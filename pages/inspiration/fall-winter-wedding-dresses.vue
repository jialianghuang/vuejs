<template>
  <div class="brides-box">
    <div style="display:none">
      <h1>{{ h1Content }}</h1>
    </div>
    <main-app :navigation="navigation">
      <div class="center-content">
        <top-banner :topBanner="topBanner"></top-banner>
        <img-oneitem-list :lists="midBanners"></img-oneitem-list>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import ImgOneitemList from '@/components/static/ImgOneitemList'
import TopBanner from '@/components/static/TopBanner'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'FallWinterWeddingDresses',
  components: {
    mainApp,
    TopBanner,
    ImgOneitemList,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const module = context.route.path.replace('/inspiration/', '')

      const res = await context.$axios.$get(`/1.0/navigation/wedding-dresses-101/${module}`, {
        params: {
          seoUrl: commonAsyncData.requestUrl
        }
      })

      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }

      context.store.commit('setJsKey', 'fall-winter-wedding-dresses')

      let h1Title = 'Spring/Summer Wedding Dresses'
      if (module == 'fall-winter-wedding-dresses') {
        h1Title = 'Fall/Winter Wedding Dresses'
      }

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        topBanner: res.data.topBanner,
        h1Content: h1Title,
        midBanners: res.data.midBanners
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
    margin: 0 auto;
    margin-top: 22px;
    margin-bottom: 140px;
    clear: both;
  }
}
</style>
