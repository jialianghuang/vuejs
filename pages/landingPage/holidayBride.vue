<template>
  <div class="pre-sale-list-page">
    <main-app ref="main" :navigation="navigation" :adaptive="true">
      <quick-shop-dialog ref="quickShopDialog" :fromDialog="'list'"></quick-shop-dialog>
      <div class="pre-sale-list-page-container">
        <div :class="['pre-sale-list-page-banner', { minH: !loaded }]">
          <img
            id="top-banner-img"
            v-track.view.click="{ common: { ec: 'charitybanner', el: 'topbanner' } }"
            @click="listBoxInToView()"
            @load="loaded = true"
            :src="nl('page_image_holiday_bride_banner')"
            alt="holiday bride banner"
          />
          <!-- <div @click="listBoxInToView()" class="click-area"></div> -->
        </div>
        <div class="pre-sale-list-page-box">
          <div class="pre-sale-list-page-box-title">
            <span>
              {{ nl('page_holiday_bride_title') }}
            </span>
          </div>
          <div class="pre-sale-list-page-box-product">
            <product-list
              ref="productList"
              :isProductsSplit="false"
              :resetDisplay="false"
              :showViewMore="!isEndFull"
              @quickShop="quickShopClick"
              @notify-me="notifyMe"
              scene="holidayBride"
            ></product-list>
            <a
              v-if="isEndFull"
              v-track.view.click="{ common: { ec: 'charityproduct', el: 'view more' } }"
              :href="countryUrl('/all/wedding-dresses?subsite=bridal')"
              class="view-more"
              target="_blank"
            >
              {{ nl('page_common_view_more') }}
            </a>
          </div>
          <category-description v-if="seoInfo" :content="seoInfo.content" :colorContent="seoInfo.colorContent"></category-description>
        </div>
      </div>
      <NotifyMeDialog v-if="openNotifyMe" :item="currentItem" :style-info="{}" />
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
/**
 * AZWEB-20548 The Bachelorette’s Charity Lawson Holiday
 */
import mainApp from '@/components/Main'
import ProductList from '@/components/list/ProductList'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import backToTop from '@/components/common/BackToTop'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import colorHex from '@/assets/js/colorHex'
import CategoryDescription from '@/components/list/CategoryDescription'
import { Base64 } from 'js-base64'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog')
})

export default {
  name: 'HolidayBride',
  components: {
    mainApp,
    backToTop,
    QuickShopDialog,
    ProductList,
    NotifyMeDialog,
    CategoryDescription
  },
  mixins: [colorHex],
  data() {
    return {
      loaded: false,
      posterUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/3b/57/89be0d6b0acead6776c33d445ba33b57.jpg',
      showPlay: false,
      currentItem: {},
      loop: true,
      isEndFull: true
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', true)
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      context.store.commit('setJsKey', 'holiday-bride-list')
      const [result, colorHexRes] = await Promise.all([
        context.$axios.get('/1.0/list/key-name-landing-page?sale_key=holiday_bride'),
        context.$axios.$get('/1.0/common/color-hex')
      ])
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
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      }
      const preorderData = result.data.data || {}
      const { bannerImage, productList = [] } = preorderData
      // wd结束位置插入固定一张图
      if (['US', 'CA', 'GB'].includes(context.store.state.country)) {
        for (let i = 0; i < productList.length; i++) {
          const ele1 = productList[i]
          const ele2 = productList[i + 1]
          if (ele1.catId === 2 && ele2.catId !== 2) {
            // 插入图片
            productList.splice(i + 1, 0, {
              imgDesc: 'Try on sample brides',
              imgUrl: 'page_image_holiday_bride_tryon_banner_pc',
              indexNo: i + 1,
              linkUrl: '/all/sample-brides?current_in_stock=yes&subsite=bridal',
              position: {}
            })
            break
          }
        }
      }
      context.store.commit('list/setProdList', productList)
      context.store.commit('list/setViewSwitch', 'smaller')
      if (commonAsyncData.seoInfo.content) commonAsyncData.seoInfo.content = Base64.encode(commonAsyncData.seoInfo.content)
      return {
        ...commonAsyncData,
        bannerImage,
        productList,
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
    this.handleIsEndFull()
    window.addEventListener('resize', this.handleIsEndFull)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleIsEndFull)
  },
  methods: {
    // 判断当前列表最后一行是否铺满商品，并根据结果决定显示哪种viewmore样式
    handleIsEndFull() {
      if (this.$refs.productList) {
        const goodsWidth = this.$refs.productList.$el.children[0].clientWidth
        if (goodsWidth) {
          let num = (this.$refs.productList.$el.clientWidth + 15) / (goodsWidth + 15)
          num = Math.round(num)
          const last = this.productList.length % num
          if (last === 0) {
            this.isEndFull = true
          } else {
            this.isEndFull = false
          }
        }
      }
    },
    getBiParams(attr1, index) {
      if (process.server) return
      let resEl = attr1
      if (attr1 && String(attr1).length > 0) {
        resEl = attr1.replace(/\s/g, '').toLowerCase()
      }
      return {
        ec: 'charityproduct',
        el: resEl,
        msg: JSON.stringify({ attr1: index })
      }
    },
    // notifyme
    notifyMe(item) {
      this.$set(this, 'currentItem', item)
      this.$store.commit('setOpenNotifyMe', true)
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    listBoxInToView() {
      const targetDom = document.querySelector('.pre-sale-list-page-container .pre-sale-list-page-box')
      window.scrollTo({
        top: targetDom.offsetTop - 50,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pre-sale-list-page {
  // min-width: 1263px;
  /deep/ #coupon-box {
    display: none;
  }
  &-top-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 15px;
    &-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 3px;
      background-color: #f8f2ef;
      font-family: @font-family-600;
      font-size: 14px;
      max-height: 60px;
      overflow: hidden;
      padding: 20px 0;
      text-align: center;
      color: var(--color-121212);
      box-sizing: border-box;
      .hot {
        width: 15px;
        vertical-align: text-top;
      }
      .heart {
        width: 14px;
        vertical-align: text-top;
      }
    }
  }
  &-container {
    max-width: 1600px;
    padding: 0 20px;
    box-sizing: border-box;
    margin: 0 auto;
  }
  &-banner {
    position: relative;
    margin: 20px auto 60px;
    font-size: 0;
    background: url('~assets/images/goodsList/img-bg.png') no-repeat center center/ 74px 80px, var(--color-f9f9f9);
    &.minH {
      min-height: 400px;
    }
    img {
      display: block;
      width: 100%;
      cursor: pointer;
    }
    .click-area {
      position: absolute;
      top: 75%;
      right: 21%;
      height: 49px;
      width: 319px;
      background-color: transparent;
      z-index: 1;
      cursor: pointer;
    }
    .pre-sale-video-box {
      position: absolute;
      left: 160px;
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.5s ease;
      video {
        max-width: 270px;
        max-height: 480px;
      }
      .az-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 90px;
        transform: translate(-50%, -50%);
        z-index: 1;
      }
    }
    @media screen and (max-width: 1560px) {
      .pre-sale-video-box {
        left: 120px;
        video {
          max-width: 250px;
        }
      }
      .az-icon {
        font-size: 80px;
      }
    }
    @media screen and (max-width: 1400px) {
      .pre-sale-video-box {
        left: 100px;
        video {
          max-width: 220px;
        }
      }
      .az-icon {
        font-size: 60px;
      }
    }
  }
  &-box {
    margin: 10px auto 30px;
    &-title {
      display: flex;
      align-items: center;
      column-gap: 3px;
      margin-bottom: 30px;
      font-family: @font-family-600;
      font-size: 24px;
      line-height: 33px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--color-121212);
      img {
        width: 22px;
      }
    }
    &-product {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 30px 20px;
      /deep/ .presale-item {
        width: calc((100% - 80px) / 5);
      }
      .view-more {
        width: 295px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        line-height: auto;
        border: 1px solid var(--color-121212);
        background: #fff;
        outline: none;
        margin: 0 auto 75px;
        font-size: 14px;
        text-transform: uppercase;
        font-family: @font-family-600;
        padding: 0px;
      }
    }
  }
}
</style>
