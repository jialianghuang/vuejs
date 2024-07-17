<template>
  <div class="preorder-list-box">
    <main-app ref="main" :navigation="navigation">
      <div @click="handleClickBanner('all')" :class="[activityStatus, { 'cur-def': kkPreorderClick }]">
        <div
          ref="preorderBanner"
          @click.stop="handleClickBanner('banner')"
          v-track.viewOnce.click="{ id: 'preorderBanner', view: getBiParams('banner'), click: getBiClickParams('banner') }"
          :class="{ 'cur-def': kkPreorderClick }"
          class="preorder-banner"
        >
          <img v-show="bannerLoaded" :src="replaceImgCdnUrl(bannerImage)" :alt="bannerImage" @load="bannerLoaded = true" class="img" />
          <div v-if="!bannerLoaded" :style="styleInfo" class="skeleton-default"></div>
        </div>

        <div
          v-if="['tease', 'prelaunch'].includes(activityStatus)"
          @click.stop="handleClickBanner('clock')"
          v-track.viewOnce="{ id: 'preorderClock', view: getBiParams('clock'), click: getBiClickParams('clock') }"
          :class="{ 'cur-def': kkPreorderClick }"
          class="preorder-desc"
        >
          <div v-html="activityStatus === 'tease' ? nl('page_preorder_tease_desc') : nl('page_preorder_prelaunch_desc')" class="desc"></div>
          <div
            v-html="activityStatus === 'tease' ? nl('page_preorder_tease_sub_desc') : nl('page_preorder_prelaunch_sub_desc')"
            class="sub-desc"
          ></div>
          <div v-if="countDownTime && Object.keys(countDownTime).length" class="timer-box">
            {{ activityStatus == 'tease' ? nl('page_common_starts_in') : nl('page_year_end_ends_in_capitalize') }}
            <div class="time_countdown">
              <span v-if="countDownTime['day']" class="time-countdown-day">{{ countDownTime['day'] }}<em>d</em> </span>
              <span>{{ countDownTime['hour'] }}</span>
              <em>:</em>
              <span>{{ countDownTime['minute'] }}</span>
              <em>:</em>
              <span>{{ countDownTime['second'] }}</span>
            </div>
          </div>
        </div>
        <div class="preorder-list-box-content">
          <div :class="{ 'tease-list': activityStatus === 'tease', 'expired-list': activityStatus === 'expired' }" class="product-list">
            <div
              v-for="(productItem, productIndex) in productList"
              :key="`${productItem.goodsId}_${productIndex}`"
              :class="{ 'product-item-big': !((productIndex + 1) % 5) }"
              class="product-item"
            >
              <img
                v-if="activityStatus === 'tease'"
                :src="require('~/assets/images/default_img.jpg')"
                :data-src="productItem.imgUrl"
                :alt="productItem.shownGoodsName"
                v-track.viewOnce.click="{ id: `productItem_${productIndex}`, common: getBiParams(`${productIndex + 1}_image`) }"
                class="img lazyload"
              />
              <prelaunch-list-item
                v-else
                @quickShop="handleQuickShop"
                :item="productItem"
                :index="productIndex"
                :activityStatus="activityStatus"
                :trackEc="trackEc"
              ></prelaunch-list-item>
            </div>
          </div>
          <div class="more-to-explore">
            <div class="explore-title">{{ nl('page_preorder_more_to_explore') }}</div>
            <div v-track.viewOnce="{ id: `cat_button`, common: getBiParams(`cat_button`) }" class="explore-list">
              <a
                v-for="(item, index) in moreToExplore"
                :key="item.title"
                @click.stop="handleMore(item.url)"
                v-track.viewOnce.click="{ id: `cat_button_${index + 1}`, common: getBiParams(`${index + 1}_cat_button`) }"
                class="explore-item"
                target="_blank"
                tabindex="0"
                role="button"
              >
                {{ item.title }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <preorder-subscribe
        :show-dialog="showPreCouponDialog"
        :preInputFixed="preInputFixed"
        @close-dialog="showPreCouponDialog = false"
        @open-dialog="handleOpenDialog"
        :headH="headH"
        :activityStatus="activityStatus"
        :trackEc="trackEc"
      ></preorder-subscribe>

      <quick-shop-dialog ref="quickShopDialog" :fromDialog="'list'" @refreshCartList="getCartInfo()"></quick-shop-dialog>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import PrelaunchListItem from '@/components/list/PrelaunchListItem'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import preorderSubscribe from '@/components/common/preorderSubscribe'
// import QuickShopDialog from '@/components/quickshop/QuickShopDialog'
import backToTop from '@/components/common/BackToTop'
import colorHex from '@/assets/js/colorHex'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog')
})

export default {
  name: 'PreorderList',
  components: {
    mainApp,
    preorderSubscribe,
    PrelaunchListItem,
    QuickShopDialog,
    backToTop
  },
  mixins: [colorHex],
  data() {
    return {
      countDownTime: {},
      activityTimer: null,
      showPreCouponDialog: false,
      hasAuto: false,
      preInputFixed: false,
      headH: 0,
      bannerLoaded: false,
      defaultBackgroundImg: require('~/assets/images/goodsList/img-bg.png'),
      kkPreorderClick: false
    }
  },
  computed: {
    styleInfo() {
      return {
        background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
      }
    },
    trackEc() {
      let ec = ''
      if (this.activityStatus === 'tease') {
        ec = 'kkwarmup'
      } else if (this.activityStatus === 'prelaunch') {
        ec = 'kkprelaunch'
      }
      return ec
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      // const bol = true
      // if (bol) {
      //   context.redirect(302, resetSeoUrl(context, '/all/special-occasion-dresses?fixedBrandId=16'))
      //   return
      // }
      if (context.store.state.isNewLanguageCountry) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
      }
      context.store.commit('setJsKey', 'preorder-list')
      // 活动状态   activityStatus:  tease   |    prelaunch   |   expired
      const result = await context.$axios.get('/1.0/list/preorder-landing-page')
      if (!result.data || result.data.code == 5) {
        context.error({
          statusCode: 200,
          message: result.msg ? result.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (result.data.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      }
      const preorderData = result.data.data || {}
      const { activityStatus, moreToExplore = [], bannerImage, startTime, endTime, productList = [] } = preorderData
      return {
        ...commonAsyncData,
        activityStatus,
        moreToExplore,
        bannerImage,
        startTime,
        endTime,
        productList,
        seoInfo: result.data.seoInfo,
        dataLayerInfo: result.data.dataLayerInfo
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return {
        ...getHeadJson(this)
      }
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  mounted() {
    this.getCountDownTime()
    window.addEventListener('scroll', this.handleAutoDialog)
    this.getColorHexAjax()
    this.kkPreorderClick = localStorage.getItem('kkPreorderClick')
  },
  beforeDestroy() {
    this.activityTimer && clearInterval(this.activityTimer)
  },
  methods: {
    handleClickBanner(type) {
      if ((type === 'all' && this.activityStatus === 'prelaunch') || this.activityStatus === 'expired' || this.kkPreorderClick) return false
      this.showPreCouponDialog = true
      localStorage.setItem('kkPreorderClick', 1)
      this.kkPreorderClick = 1
      if (type !== 'banner' && this.activityStatus === 'tease') {
        // 预热阶段，整个页面banner以下，底部按钮以上部分的点击打点
        this.setPoint(this.trackEc, 'page', 'click')
      } else if (type === 'clock' && this.activityStatus === 'prelaunch') {
        // 预售阶段，倒计时模块的点击打点
        this.setPoint(this.trackEc, 'clock', 'click')
      }
    },
    handleAutoDialog(type) {
      if ((type === 'click' && this.activityStatus === 'prelaunch') || this.activityStatus === 'expired') return false
      const preorderBanner = this.$refs.preorderBanner
      const headerTranslate = this.$refs.main ? this.$refs.main.headerTranslate : 0
      const h = document.querySelector('.sticky-header') ? document.querySelector('.sticky-header').getBoundingClientRect().height : 0
      this.headH = h - headerTranslate

      if (preorderBanner) {
        const bannerB = preorderBanner.getBoundingClientRect().bottom
        if (bannerB < 0) {
          this.preInputFixed = true
        } else {
          this.preInputFixed = false
        }
      }
      // 自动弹窗只执行一次
      if (!this.hasAuto) {
        this.handleClickBanner()
        this.hasAuto = true
      }
    },
    handleOpenDialog() {
      this.showPreCouponDialog = true
      localStorage.setItem('kkPreorderClick', 1)
      this.kkPreorderClick = 1
    },
    getCountDownTime() {
      let computeTime = null
      if (this.activityStatus === 'tease') {
        // 预热期间
        computeTime = this.startTime
      } else if (this.activityStatus === 'prelaunch') {
        // 活动期间
        computeTime = this.endTime
      }
      if (!computeTime) return false
      const clientTime = new Date().getTime()
      const diffTime = new Date(this.serverTime.replace(/-/g, '/')).getTime() - clientTime
      const endTime = new Date(computeTime.replace(/-/g, '/')).getTime()
      this.activityTimer = setInterval(() => {
        const clientTime = new Date().getTime()
        const serverTime = clientTime + diffTime
        let remainTime = Math.floor((endTime - serverTime) / 1000)
        if (remainTime > 0) {
          this.countDownTime = this.timeFormat(remainTime)
        } else {
          remainTime = 0
          this.countDownTime = this.timeFormat(remainTime)
          clearInterval(this.activityTimer)
        }
      }, 1000)
    },
    timeFormat(remainTime) {
      const oneDayTime = 24 * 60 * 60
      const oneHourTime = 60 * 60
      const day = Math.floor(remainTime / oneDayTime)
      const dayRemainTime = remainTime % oneDayTime
      const hour = Math.floor(dayRemainTime / oneHourTime)
      const hourRemainTime = dayRemainTime % oneHourTime
      const minute = Math.floor(hourRemainTime / 60)
      const second = hourRemainTime % 60
      return {
        day,
        hour: this.addZero(hour),
        minute: this.addZero(minute),
        second: this.addZero(second)
      }
    },
    addZero(val) {
      return val < 10 ? `0${val}` : val
    },
    handleQuickShop(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    getCartInfo() {
      this.$refs.main && this.$refs.main.getCartInfo()
    },
    getImgStyle({ _imgLoaded }) {
      if (_imgLoaded) return {}
      // 默认取第一个图片宽高
      const el = this.$el && this.$el.querySelector('img')
      const height = el && el.offsetHeight
      const width = el && el.offsetWidth
      if (height >= 80 && width >= 74) {
        return {
          background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
        }
      } else if (!height && !width) {
        // ssr
        return {
          background: `var(--color-f9f9f9)`
        }
      } else {
        // 过小
        return {
          background: `url(${this.defaultBackgroundImg}) no-repeat center center/ contain, var(--color-f9f9f9)`
        }
      }
    },
    imgLoad(banner) {
      this.loaded = true
      this.$set(banner, '_imgLoaded', true)
    },
    handleMore(url) {
      window.open(this.countryUrl(url))
    },
    getBiParams(el) {
      if (process.server || !this.trackEc) return
      return {
        ec: this.trackEc,
        el
      }
    },
    getBiClickParams(el) {
      if (process.server || !this.trackEc || this.kkPreorderClick) return
      return {
        ec: this.trackEc,
        el
      }
    }
  }
}
</script>

<style lang="less" scoped>
.preorder-list-box {
  width: 100%;
  .cur-def {
    cursor: default !important;
  }
  .tease {
    cursor: pointer;
  }
  .preorder-banner {
    cursor: pointer;
    .img {
      width: 100%;
      height: auto;
      vertical-align: middle;
    }
    .skeleton-default {
      background-color: var(--color-f9f9f9);
      width: 100%;
      padding-bottom: 37.5%;
    }
  }
  .preorder-desc {
    padding: 40px 0 50px;
    text-align: center;
    cursor: pointer;
    .desc {
      font-size: 24px;
      line-height: 33px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-121212);
      /deep/ .bold {
        font-family: @font-family-700;
        font-size: 32px;
      }
    }
    .sub-desc {
      font-size: 18px;
      line-height: 25px;
      letter-spacing: 0.05em;
      color: var(--color-121212);
      margin: 15px 0;
      /deep/ .bold {
        font-family: @font-family-700;
        font-size: 18px;
      }
    }

    .timer-box {
      font-size: 18px;
      line-height: 25px;
      .time_countdown {
        font-size: 23px;
        line-height: 35px;
        display: inline-block;
        margin-left: 5px;
        span {
          display: inline-block;
          width: 40px;
          height: 35px;
          background: var(--color-121212);
          margin-right: 1px;
          vertical-align: middle;
          box-sizing: border-box;
          text-align: center;
          font-family: @font-family-600;
          color: #fff;
          &.time-countdown-day {
            margin-right: 4px;
            em {
              transform: translateY(-8px);
              font-size: 17px;
              line-height: 23px;
              margin-left: 1px;
            }
          }
        }
        em {
          display: inline-block;
          display: inline-block;
          margin: 0 -1px 0 -3px;
        }
      }
    }
  }
  .preorder-list-box-content {
    margin: 0 auto;
    // max-width: 1293px;
    max-width: 1353px;
    width: 100%;
    padding: 10px 30px 0;
    box-sizing: border-box;
    @media screen and (min-width: 1921px) {
      &.preorder-list-box-content {
        max-width: 1353px;
      }
    }
    @media screen and (max-width: 1920px) {
      &.preorder-list-box-content {
        max-width: 1083px;
      }
    }
    @media screen and (max-width: 1679px) {
      &.preorder-list-box-content {
        max-width: 913px;
      }
    }
    .product-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .product-item {
        width: calc(50% - 10px);
        margin-bottom: 22px;
        &.product-item-big {
          width: 100%;
        }
      }
      &.expired-list {
        .product-item {
          margin-bottom: 40px;
        }
      }
      &.tease-list {
        .product-item {
          margin-bottom: 20px;
        }
        .img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
    }
    .more-to-explore {
      padding: 30px 0 50px;
      .explore-title {
        font-family: @font-family-600;
        font-size: 24px;
        line-height: 33px;
        text-align: center;
        text-transform: uppercase;
        color: var(--color-121212);
        margin-bottom: 30px;
      }
      .explore-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .explore-item {
          text-align: center;
          width: calc(25% - 22.5px);
          height: 60px;
          line-height: 60px;
          background: var(--color-f1e9e6);
          font-size: 14px;
          color: var(--color-121212);
          font-family: @font-family-600;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
