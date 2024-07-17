<template>
  <div class="brides-box">
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
  name: 'FeaturedCollection',
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

      const res = await context.$axios.$get(`/1.0/navigation/featured-collection`, {
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
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      context.store.commit('setJsKey', 'fall-winter-wedding-dresses')

      let midBanners = []
      if (res && res.data && res.data.goodsList) {
        midBanners = res.data.goodsList.map((item) => {
          return {
            imgAlt: item.alt,
            linkUrl: item.LinkUrl || item.linkUrl,
            imgUrl: item.imgUrl,
            eventCategory: item.eventCategory,
            eventName: item.eventName,
            goodsId: item.goodsId
          }
        })
      }

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        topBanner: res.data.topBanner,
        midBanners
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
    /deep/ .one-item {
      margin-top: 0;
      margin-bottom: 20px;
    }
  }
}
</style>
