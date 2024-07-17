<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <div class="center-content">
        <top-banner :topBanner="topBanner">
          <div slot="center" class="entry">
            <a
              v-for="(item, index) in topBanner.list"
              :key="index"
              :data-datalayer-category="item.eventCategory"
              :class="{ need_datalayer: item.eventCategory && item.eventName }"
              :data-datalayer-label="item.eventName"
              :href="countryUrl(item.linkUrl)"
              target="_blank"
              >{{ item.title }}</a
            >
          </div>
        </top-banner>
        <wedding-fabric-facts-list :lists="midBanners"></wedding-fabric-facts-list>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import WeddingFabricFactsList from '@/components/static/WeddingFabricFactsList'
import TopBanner from '@/components/static/TopBanner'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'WeddingFabricFacts',
  components: {
    mainApp,
    TopBanner,
    WeddingFabricFactsList,
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
      context.store.commit('setJsKey', 'wedding-fabric-facts')

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
    clear: both;
    margin-bottom: 140px;
  }
  .entry {
    width: 200px;
    position: absolute;
    right: 460px;
    top: 297px;
    z-index: 1;
    a {
      display: block;
      line-height: 26px;
      font-size: 13px;
      text-align: center;
      text-decoration: underline;
      font-family: @font-family-600, sans-serif;
      color: var(--color-121212);
      word-spacing: 1.9px;
      font-weight: 400;
    }
  }
}
</style>
