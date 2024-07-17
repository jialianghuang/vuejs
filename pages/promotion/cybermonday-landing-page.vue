<template>
  <div class="cyber-monday-promotion">
    <!-- 预热： #20417 -->
    <!-- 活动中： #20481 -->
    <!-- 黑五期间，预热和结束阶段的页面结构差不多，活动中的差异比较大，走的是lego独立页配置的数据, -->
    <main-app :navigation="navigation" :isShowSubscribe="'hide'" :adaptive="true" class="adaptive-box">
      <!-- 活动中 -->
      <template v-if="activityStatus == 'isOngoing'">
        <div :class="[pageName]" class="isOngoing-box">
          <div
            v-for="(moduleItem, index) in isOngoingModules"
            :key="index"
            :id="'module_load_' + index"
            :class="{ 'full-screen': moduleItem.isShowNotice }"
            class="module-content-item"
          >
            <!-- banner -->
            <template v-if="moduleItem.moduleType === 'banner'">
              <CommonBannerSwiper :bannerList="moduleItem.imageList" :moduleIndex="index" :ec="'new landingpage banner'" />
            </template>
            <!-- 商品行 -->
            <template v-if="moduleItem.moduleType === 'product'">
              <div class="module-content-product">
                <LandingActivityList
                  :moduleIndex="index"
                  :productTabList="moduleItem.productTabList"
                  :moduleTitleImgUrl="moduleItem.imgUrl"
                  scene="cybermonday"
                />
              </div>
            </template>
          </div>
          <sale-seo-content
            v-if="seoInfo && seoInfo.content && ['US', 'CA'].includes(country)"
            :content="seoInfo.content"
          ></sale-seo-content>
        </div>
      </template>
      <!-- 预热或者结束 -->
      <template v-else>
        <!-- coming soon -->
        <CyberMondayCountDown
          v-if="activityStatus === 'isPreheating'"
          :endTime="activityTime.endTime"
          :banner="promotionStatusBeforeBanner"
          :emailSubscribePopBanner="emailSubscribePopBanner"
          :emailSelectCodeList="emailSelectCodeList"
        />
        <div v-else>
          <div class="banner-block">
            <img
              :data-src="nl(promotionStatusAfterBanner.img)"
              :src="require('~/assets/images/default_img.jpg')"
              class="lazyload"
              alt="cybermonday"
            />
            <a
              v-track.view.click="getBiParams({ ec: '2023cybersale', el: 'continueshopping' })"
              :href="promotionStatusAfterBanner.url"
              aria-label="cybermonday"
              class="btn-continue"
            >
            </a>
          </div>
        </div>
        <div class="sale-content">
          <template v-if="activityStatus === 'isPreheating'">
            <p class="faq-head">{{ nl('page_cyber_weekend_faq') }}</p>
            <ul class="faq">
              <li v-for="(item, index) in seoFaqList" :key="index" class="faq-item">
                <h3 class="faq-title">{{ nl(item.name) }}</h3>
                <p v-html="nl(item.value)" class="faq-content"></p>
              </li>
            </ul>
          </template>
          <new-arrival-banner :categoriesBanners="categoriesBanners" :cate-no-head="true"></new-arrival-banner>
          <new-arrival-list :prodReqListData="prodReqListData" max-width=""></new-arrival-list>
          <sale-seo-content
            v-if="seoInfo && seoInfo.content && ['US', 'CA'].includes(country)"
            :content="seoInfo.content"
          ></sale-seo-content>
        </div>
      </template>
      <download-app></download-app>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import CyberMondayCountDown from '@/components/promotion/CyberMondayCountDown'
import SaleSeoContent from '@/components/sale/SaleSeoContent'
import DownloadApp from '@/components/common/DownloadApp'
import backToTop from '@/components/common/BackToTop'
import NewArrivalList from '@/components/newArrival/NewArrivalList'
import NewArrivalBanner from '@/components/newArrival/NewArrivalBanner'
import CommonBannerSwiper from '@/components/common/CommonBannerSwiper'
import LandingActivityList from '@/components/landingPage/LandingActivityListExtend'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'CybermondayLandingPage',
  components: {
    MainApp,
    CyberMondayCountDown,
    SaleSeoContent,
    DownloadApp,
    backToTop,
    NewArrivalList,
    NewArrivalBanner,
    CommonBannerSwiper,
    LandingActivityList
  },
  data() {
    return {
      selectedFirstTabIndex: 'bridesmaid',
      selectedSecondTabIndex: 'women_accessories',
      hasData: true,
      emailSelectCodeList: []
    }
  },
  computed: {},
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const path = context.route.path
      let pageName = ''
      if (path.includes('/black-friday-cyber-monday-influencer-selected')) {
        pageName = 'cybermonday_influencer'
      } else if (path.includes('/black-friday-cyber-monday')) {
        pageName = 'cybermonday'
      }
      // 通过activityStatus判断活动状态，有三个值（预售：isPreheating，进行中：isOngoing，结束：isEnding）
      let utmMedium = context.route.query.utm_medium
      if (!utmMedium && pageName === 'cybermonday_influencer') utmMedium = 'influencer'
      const params = {
        from: utmMedium || ''
      }
      const res = await context.$axios.$get('/1.0/list/cyber-monday', { params })
      if (res.code != 0) {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      const { activityConfig, activityStatus } = res.data
      let isOngoingModules = []
      // isOngoing活动进行中，取 activityConfig.content的数据， 预售：isPreheating 和 结束：isEnding 需要请求下面的接口/1.0/new-arrival/landing获取数据
      let newArrivalres = null
      if (activityStatus === 'isOngoing') {
        const content = activityConfig.content || []
        if (content) isOngoingModules = content.filter((item) => !item.hiddenModule) // 配置结果
      } else {
        newArrivalres = await context.$axios.$get('/1.0/new-arrival/landing', {
          params: {
            newArrivalMiddleVersion: context.store.state.versionGroup.banner_new_arrival_middle,
            newArrivalTopVersion: context.store.state.versionGroup.banner_new_arrival_top
          }
        })
      }

      context.store.commit('setJsKey', 'cybermonday-landing-page')
      return {
        ...commonAsyncData,
        activityTime: activityConfig.activityTime,
        emailSubscribePopBanner: activityConfig.emailSubscribePopBanner,
        emailSelectCodeList: activityConfig.emailSelectCodeList,
        promotionStatusBeforeBanner: activityConfig.promotionStatusBeforeBanner,
        seoFaqList: activityConfig.seoFaqList,
        promotionStatusAfterBanner: activityConfig.promotionStatusAfterBanner || {},
        activityStatus: res.data.activityStatus,
        activityConfig,
        categoriesBanners: newArrivalres && newArrivalres.data && newArrivalres.data.categoryBanners,
        prodReqListData: newArrivalres && newArrivalres.data && newArrivalres.data.list,
        isOngoingModules,
        pageName
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
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  mounted() {
    // this.getProdReqListData()
  },
  methods: {
    onFirstTabsChange(key) {
      this.selectedFirstTabIndex = key
    },
    onSecondTabsChange(key) {
      this.selectedSecondTabIndex = key
    },
    autoPlayStop() {
      this.baseSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.baseSwiper.autoplay.start()
    },
    getBiParams(ev) {
      if (process.server) return
      const { ec, el } = ev
      return {
        common: {
          ec,
          el,
          msg: JSON.stringify({
            source: this.$route.query.source || ''
          })
        }
      }
    },
    async getProdReqListData() {
      // 获取商品模块的接口挪到客户端请求
      this.hasData = false
      const prodReqListData = await Promise.all(
        this.prodReqList.map((item) => {
          if (item.key == 'flash-sale') {
            return this.$axios.$post('/1.0/list/flash-sale', { page: 1, limit: item.maxLength })
          } else {
            return this.$axios
              .$post(
                `/1.0/list/products`,
                {
                  filters: { sortBy: ['popularity'] },
                  view_mode: [],
                  originUrl: this.requestUrl
                },
                {
                  params: {
                    cat_name: item.key,
                    dress_type: item.dressType,
                    page: 1,
                    limit: item.maxLength,
                    in_stock: '',
                    module: 'salelist'
                  }
                }
              )
              .catch((error) => {
                throw error
              })
          }
        })
      )
      this.prodReqListData = prodReqListData.map((result, index) => {
        return result.code === 0 && !result.data.empty && this.prodReqList[index]
          ? {
              ...this.prodReqList[index],
              prodList: result.data.prodList,
              pageInfo: result.data.pageInfo
            }
          : {
              ...this.prodReqList[index],
              prodList: [],
              pageInfo: { totalCount: 0 }
            }
      })
      this.hasData = true
    }
  }
}
</script>

<style lang="less" scoped>
@cyber-theme-color: #8d2837;
.cyber-monday-promotion {
  background-color: #fff;
  .promotion-content {
    margin-bottom: 30px;
    .img-title {
      width: 38%;
      margin: 40px auto 0;
      img {
        width: 100%;
      }
    }
    .category-block {
      width: auto;
      margin: 0 132px;
      display: flex;
      margin-top: 20px;
      justify-content: space-between;
      &.category-second-block {
        margin: 80px 0 0;
        .img-block {
          width: calc((100% - 12px * 3) / 3);
        }
      }
      .img-block {
        display: block;
        font-size: 0;
        position: relative;
        width: calc((100% - 28px * 3) / 4);
        img {
          width: 100%;
        }
        &:hover .mask {
          position: absolute;
          inset: 0;
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
    .product-list-block {
      margin: 20px 132px 0;
    }
    .module-box {
      width: 100%;
      margin-top: 40px;
    }
    a {
      display: block;
      text-align: center;
    }
  }
  .sale-content {
    max-width: 1293px;
    padding: 0 20px;
    margin: 30px auto 0px;
  }
  .banner-block {
    // margin-top: 15px;
    font-size: 0;
    position: relative;
    a {
      width: 100%;
    }
    .btn-shop-left {
      left: 25%;
    }
    .btn-shop-right {
      right: 21%;
    }
    .btn-continue {
      position: absolute;
      right: 25%;
      bottom: 20%;
      width: 18.2%;
      height: 9%;
      background: transparent;
    }
    &.banner-top-block {
      margin-top: 0;
    }
    &.banner-bottom-block {
      margin-top: 80px;
    }
    img {
      width: 100%;
      height: 31.25vw;
      min-height: 400px;
    }
  }
  .faq {
    margin: 0px 0px 50px;
    max-width: 1293px;
    /deep/ a {
      color: var(--color-121212);
      text-decoration: underline;
    }
    &-head {
      font-size: 32px;
      margin-bottom: 25px;
      margin-top: 40px;
      font-family: @font-family-500;
      text-align: center;
    }
    &-item {
      margin-bottom: 25px;
    }
    &-title {
      font-size: 16px;
      font-family: @font-family-600;
      line-height: normal;
      letter-spacing: 0.32px;
      margin-bottom: 5px;
    }
    &-content {
      font-size: 14px;
      font-family: @font-family-500;
      line-height: normal;
      letter-spacing: 0.28px;
    }
  }
}
.isOngoing-box {
  img {
    display: block;
    width: 100%;
  }
  .module-content-item {
    margin: 0 160px;
    padding: 0px 0px 60px;
    &.full-screen {
      margin: 0;
      // padding: 0px;
    }
    .module-content-banner {
      position: relative;
    }
  }
  #module_load_0 {
    /deep/ img {
      display: block;
    }
  }
  // &.cybermonday_influencer {
  // #module_load_1,
  // #module_load_8 {
  // background: var(--color-f1e9e6);
  // margin: 0px;
  // padding: 60px 160px;
  // margin-bottom: 60px;
  // }
  // }
  // &.cybermonday {
  // #module_load_6 {
  // background: var(--color-f1e9e6);
  // margin: 0px;
  // padding: 60px 160px;
  // margin-bottom: 60px;
  // }
  // }
  /deep/ .product-module-container {
    margin: 20px auto 0px;
  }
  /deep/ .sale-seo-content {
    margin: 0 160px 60px;
    width: auto;
  }
}
</style>
