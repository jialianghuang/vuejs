<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <h1 style="display:none">{{ nl('page_navigation_bridesmaids_text') }}</h1>
      <div class="center-content">
        <top-banner :topBanner="topBanner"></top-banner>
        <color-trends-list :lists="colorList"></color-trends-list>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import ColorTrendsList from '@/components/static/ColorTrendsList'
import TopBanner from '@/components/static/TopBanner'
// import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'DustyColoredDresses',
  components: {
    mainApp,
    ColorTrendsList,
    TopBanner,
    backToTop
  },
  asyncData(context) {
    try {
      // web-21323 /dusty-colored-dresses链接重定向到mixmatch页面
      context.redirect(302, '/mix-and-match-bridesmaid-dresses')
      return
      // const commonAsyncData = await init(context)
      // if (!commonAsyncData) return

      // const url = `/1.0/navigation/dusty-colored-dresses`

      // const [res] = await Promise.all([
      //   context.$axios.$get(url, {
      //     params: {
      //       seoUrl: commonAsyncData.requestUrl
      //     }
      //   })
      // ])

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
      // context.store.commit('setJsKey', 'shop-by-season')

      // const topBanner = {}
      // if (res && res.data && res.data.topBridesmaidsBanner) {
      //   topBanner.imgUrl = res.data.topBridesmaidsBanner.imgUrl
      //   topBanner.imgAlt = res.data.topBridesmaidsBanner.text
      // }
      // return {
      //   ...commonAsyncData,
      //   seoInfo: res.data.seoInfo,
      //   dataLayerInfo: res.data.dataLayerInfo,
      //   topBanner,
      //   colorList: res.data.colorList
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
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .center-content {
    box-sizing: border-box;
    width: 1132px;
    clear: both;
    margin: 0 auto;
    padding: 9px 0 20px;
    min-height: 535px;
  }
}
</style>
