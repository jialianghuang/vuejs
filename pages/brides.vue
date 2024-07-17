<template>
  <div class="brides-box">
    <main-app :navigation="navigation" :adaptive="true">
      <fullpage-banner :topBanner="topBanner" v-if="topBanner">
        <accordion-menu slot="menu" :menus="topBanner.filters" @set-style-quiz-layer-show="setStyleQuizLayerShow"></accordion-menu>
        <fullpage-btn slot="btn" :btns="topBanner.btns"></fullpage-btn>
      </fullpage-banner>
      <div class="center-content">
        <growns-under-price :lists="gownsUnderList"></growns-under-price>
        <img-link-list
          :lists="midBanners"
          :rowCount="3"
          :textArrow="true"
          @set-style-quiz-layer-show="setStyleQuizLayerShow"
        ></img-link-list>
        <img-link-list v-if="shopFeatureList" :lists="shopFeatureList.list" :title="shopFeatureList.title" :rowCount="4"></img-link-list>
        <product-list-swiper
          v-if="trendingProducts"
          :prodList="trendingProducts.list"
          :title="trendingProducts.title"
          :shopAll="trendingProducts.shopAll"
        ></product-list-swiper>
        <img-link-list
          v-if="inspirationsGuidanceList"
          :lists="inspirationsGuidanceList.list"
          :title="inspirationsGuidanceList.title"
          :rowCount="3"
          :textArrow="true"
        ></img-link-list>
        <brides-dress-guide v-if="dressGuide" :lists="dressGuide.list" :title="dressGuide.title"></brides-dress-guide>
        <style-quiz-layer
          v-if="styleQuizLayerShow"
          @close="setStyleQuizLayerShow(false)"
          :styleQuizBridal="styleQuizBridal"
        ></style-quiz-layer>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import FullpageBanner from '@/components/static/FullpageBanner'
import AccordionMenu from '@/components/static/AccordionMenu'
import FullpageBtn from '@/components/static/FullpageBtn'
import GrownsUnderPrice from '@/components/static/GrownsUnderPrice'
import ImgLinkList from '@/components/static/ImgLinkList'
import StyleQuizLayer from '@/components/static/StyleQuizLayer'
import ProductListSwiper from '@/components/static/ProductListSwiper'
import BridesDressGuide from '@/components/static/BridesDressGuide'
// import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'Brides',
  components: {
    mainApp,
    AccordionMenu,
    FullpageBtn,
    FullpageBanner,
    GrownsUnderPrice,
    ProductListSwiper,
    BridesDressGuide,
    ImgLinkList,
    StyleQuizLayer,
    backToTop
  },
  data() {
    return {
      styleQuizLayerShow: false
    }
  },
  asyncData(context) {
    try {
      // 直接转发首页
      context.redirect(302, '/')
      return
      // const commonAsyncData = await init(context)
      // if (!commonAsyncData) return
      // const res = await context.$axios.$get(`/1.0/navigation/find-your-dream`, {
      //   params: {
      //     seoUrl: context.route.path
      //   }
      // })
      // if (res.code == 0) {
      //   // 数据正常
      // } else if (res.code == 5) {
      //   context.error({
      //     statusCode: 200,
      //     message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
      //   })
      //   return
      // } else if (res.code == 404) {
      //   context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
      //   return
      // } else if (res.code == 9) {
      //   context.redirect(302, res.data.redirectUrl)
      //   return
      // } else {
      //   context.redirect(302, context.store.state.currentCountryUrl + '/')
      //   return
      // }
      // context.store.commit('setJsKey', 'find-your-dream')
      // return {
      //   ...commonAsyncData,
      //   seoInfo: res.data.seoInfo,
      //   dataLayerInfo: res.data.dataLayerInfo,
      //   topBanner: res.data.topBanner || [],
      //   shopFeatureList: res.data.shopFeatureList,
      //   gownsUnderList: res.data.gownsUnderList || [],
      //   midBanners: res.data.midBanners || [],
      //   trendingProducts: res.data.trendingProducts,
      //   inspirationsGuidanceList: res.data.inspirationsGuidanceList,
      //   dressGuide: res.data.dressGuide,
      //   styleQuizBridal: res.data.styleQuizBridal || {}
      // }
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
  methods: {
    setStyleQuizLayerShow(bl) {
      this.styleQuizLayerShow = bl
      if (bl) this.setPoint('bridalstylefinder', 'guidance', 'view')
    }
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .center-content {
    box-sizing: border-box;
    width: 1132px;
    clear: both;
    padding: 0;
    margin: auto;
    margin-bottom: 80px;
  }
  /deep/ .product-list-swiper {
    margin-bottom: 50px;
  }
  /deep/ .dress_guide {
    margin-top: 0;
  }
}
</style>
