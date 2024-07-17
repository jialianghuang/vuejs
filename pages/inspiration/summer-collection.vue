<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <div class="center-content">
        <top-banner :topBanner="topBanner" link-target="_blank">
          <h1 slot="header">{{ topBanner.title }}</h1>
        </top-banner>
        <img-oneitem-list-with-text :lists="midBanners"></img-oneitem-list-with-text>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import ImgOneitemListWithText from '@/components/static/ImgOneitemListWithText'
import TopBanner from '@/components/static/TopBanner'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'Summer2019Collection',
  components: {
    mainApp,
    TopBanner,
    ImgOneitemListWithText,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/navigation/summer-2019-collection`, {
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
      context.store.commit('setJsKey', 'summer-2019-collection')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        topBanner: res.data.topBanner,
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
  h1 {
    margin-bottom: 20px;
    font-size: 26px;
    font-family: Libre Baskerville Regular;
    color: var(--color-121212);
    line-height: 26px;
    cursor: default;
    font-weight: normal;
    text-align: left;
  }
}
</style>
