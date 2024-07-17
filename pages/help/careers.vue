<template>
  <div class="careers">
    <main-app :navigation="navigation">
      <div class="careers-main-content">
        <div v-if="topBanners && topBanners.length > 0" class="top-banner-swiper">
          <div ref="top_banner_swiper" v-swiper:second_banner_swiper="topBannersSwiperOption" class="swiper-container ">
            <div class="swiper-wrapper product-swiper-viewport">
              <div v-for="(item, id) in topBanners" :key="id" class="goods-item swiper-slide">
                <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="midBanners && Object.keys(midBanners).length" class="center">
          <div v-for="(item, index) in midBanners" :key="index" class="item">
            <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
            <div class="item-content">
              <p class="item-title">{{ item.title }}</p>
              <p v-html="item.text" class="item-text"></p>
            </div>
          </div>
        </div>

        <div v-if="footer && Object.keys(footer).length" class="footer">
          <p class="footer-header">{{ footer.header }}</p>
          <p v-html="footer.title" class="footer-title"></p>
          <p v-if="footer.linkText" class="footer-link">
            <a :href="countryUrl(footer.linkUrl)">{{ footer.linkText }}</a>
          </p>
          <p v-html="footer.text" class="footer-text"></p>
        </div>
      </div>

      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
export default {
  name: 'Careers',
  components: {
    MainApp,
    backToTop
  },
  data() {
    return {
      topBannersSwiperOption: {
        loop: true,
        autoplay: {
          delay: 10000
        }
      }
    }
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/careers`)
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
      context.store.commit('setJsKey', 'careers')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        topBanners: res.data.topBanners || [],
        midBanners: res.data.midBanners || [],
        footer: res.data.footer || {}
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
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.careers-main-content {
  width: 100%;
  max-width: 1004px;
  margin: 0 auto;
  padding: 5px 0 40px;
  min-height: 535px;
  .top-banner-swiper {
    margin-bottom: 64px;
    .goods-item {
      img {
        max-width: 1004px;
        width: 100%;
        vertical-align: middle;
      }
    }
  }
  .center {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .item {
      width: 302px;
      margin-bottom: 86px;
      img {
        width: 100%;
        vertical-align: middle;
      }
      .item-content {
        text-align: center;
        .item-title {
          margin-top: 30px;
          margin-bottom: 14px;
          font-size: 16px;
          color: var(--color-121212);
          font-family: @font-family-600;
        }
        .item-text {
          font-family: @font-family-500;
          font-size: 14px;
          color: var(--color-121212);
          line-height: 24px;
        }
      }
    }
  }
  .footer {
    text-align: left;
    .footer-header {
      font-size: 24px;
      color: var(--color-121212);
      margin-bottom: 10px;
    }
    .footer-title {
      font-family: @font-family-500;
      font-size: 14px;
      line-height: 24px;
    }
    .footer-link {
      margin-top: 10px;
      font-size: 16px;
      a {
        color: var(--color-121212);
        text-decoration: underline;
      }
    }
    .footer-text {
      margin-top: 40px;
      text-align: left;
      font-family: @font-family-500;
      font-size: 14px;
      line-height: 24px;
      color: var(--color-121212);
    }
  }
}
</style>
<style>
.footer-text p {
  margin-bottom: 10px;
}
</style>
