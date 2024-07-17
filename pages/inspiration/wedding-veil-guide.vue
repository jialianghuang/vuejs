<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <h1 style="display:none">{{ nl('page_header_wedding_veil_guide') }}</h1>
      <div class="center-content">
        <top-banner :topBanner="topBanner.banner" v-if="topBanner && topBanner.banner">
          <div slot="center" class="nav_link">
            <a v-for="(item, index) in topBanner.linkList" :key="index" :href="countryUrl(item.linkUrl)" target="_blank">{{
              nl(item.title)
            }}</a>
          </div>
        </top-banner>
        <img-oneitem-list v-if="midBanners" :lists="midBanners.list" :itemClassName="'veil-guide'"></img-oneitem-list>
        <img-link-list v-if="positionVeil" :title="positionVeil.title" :lists="positionVeil.list" :titleLayout="'ta-center'">
          <template v-slot:text="data">
            <p class="position-veil-text">
              <span>{{ nl(data.item.header) }}</span
              >&nbsp;{{ nl(data.item.title) }}
            </p>
          </template>
        </img-link-list>
        <product-list-swiper
          v-if="trendingProducts"
          :title="trendingProducts.title"
          :prodList="trendingProducts.list"
          :swiperCount="6"
          :shopAll="trendingProducts.shopAll"
        ></product-list-swiper>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import ProductListSwiper from '@/components/static/ProductListSwiper'
import ImgOneitemList from '@/components/static/ImgOneitemList'
import ImgLinkList from '@/components/static/ImgLinkList'
import TopBanner from '@/components/static/TopBanner'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'WeddingVeilGuide',
  components: {
    mainApp,
    TopBanner,
    ImgOneitemList,
    ProductListSwiper,
    ImgLinkList,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/navigation/wedding-veil-guide`, {
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
      context.store.commit('setJsKey', 'wedding-veil-guide')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        topBanner: res.data.topBanner,
        midBanners: res.data.midBanners,
        positionVeil: res.data.positionVeil,
        trendingProducts: res.data.trendingProducts
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
    clear: both;
    margin: 0px auto 120px;
  }
  .nav_link {
    position: absolute;
    top: 225px;
    right: 153px;
    width: 341px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    a {
      display: inline-block;
      margin-bottom: 16px;
      font-size: 13px;
      font-family: @font-family-600;
      color: var(--color-121212);
      line-height: 16px;
      text-decoration: underline;
      text-transform: uppercase;
    }
  }
  .position-veil-text {
    font-size: 16px;
    font-family: @font-family-500;
    color: var(--color-121212);
    line-height: 25px;
    text-align: center;
    margin-top: 15px;
    span {
      font-family: @font-family-600;
      text-transform: none;
    }
  }
}
img {
  width: 100%;
  vertical-align: middle;
}
</style>
