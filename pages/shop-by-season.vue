<template>
  <div class="brides-box">
    <div style="display:none">
      <h1>{{ nl('page_header_shop_by_season') }}</h1>
    </div>
    <main-app :navigation="navigation">
      <div class="center-content">
        <template v-if="seasonAllData">
          <top-banner :topBanner="seasonAllData.topBanner"></top-banner>
          <shopby-season-card :lists="seasonAllData.seasonList"></shopby-season-card>
        </template>
        <template v-else-if="detailData">
          <top-banner :topBanner="detailData.bannerMain"></top-banner>
          <shopby-season-list :lists="detailData.detailContentList"></shopby-season-list>
          <shopby-season-footer
            v-if="detailData.otherSeasons"
            :lists="detailData.otherSeasons.menuList"
            :title="detailData.otherSeasons.otherSeasonTitle"
          ></shopby-season-footer>
        </template>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import ShopbySeasonCard from '@/components/static/shop-by-season/ShopbySeasonCard'
import ShopbySeasonList from '@/components/static/shop-by-season/ShopbySeasonList'
import ShopbySeasonFooter from '@/components/static/shop-by-season/ShopbySeasonFooter'
import TopBanner from '@/components/static/TopBanner'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'ShopBySeason',
  components: {
    mainApp,
    ShopbySeasonCard,
    ShopbySeasonList,
    ShopbySeasonFooter,
    TopBanner,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      let url = `/1.0/navigation/shop-by-season`
      let season

      if (context.route.query && context.route.query.season) {
        season = context.route.query.season
        url += '/' + season
      }

      const [res] = await Promise.all([
        context.$axios.$get(url, {
          params: {
            seoUrl: commonAsyncData.requestUrl
          }
        })
      ])

      const detailData = season ? res.data : null

      const seasonAllData = !season ? res.data : null

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
      context.store.commit('setJsKey', 'shop-by-season')

      if (seasonAllData && seasonAllData.topBanner) {
        seasonAllData.topBanner.imgUrl = seasonAllData.topBanner.imgSrc
      }

      if (detailData && detailData.bannerMain) {
        detailData.bannerMain.imgUrl = detailData.bannerMain.imgSrc
      }
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        detailData,
        seasonAllData,
        season
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
    clear: both;
    margin: 20px auto 70px;
  }
  /deep/ h3.module_name {
    font-size: 24px;
    font-family: @font-family-600;
    line-height: 24px;
    color: var(--color-121212);
    padding: 0 0 20px;
    font-weight: normal;
  }
}
</style>
