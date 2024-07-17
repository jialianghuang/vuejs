<template>
  <div class="year-and-promotion">
    <main-app :navigation="navigation" :isShowSubscribe="'hide'" :adaptive="true" class="adaptive-box">
      <div v-if="promotionStatus !== 'processing' && !!bgImg" class="promotion-comingsoon-over">
        <div v-track.viewOnce="getBiParams(topBanner.event.el || 'eventbanner')" class="img-block">
          <img
            :src="require('~/assets/images/default_img.jpg')"
            :data-src="addWebpSuffix(bgImg)"
            alt="promotion not start or over"
            data-expand="1"
            class="lazyload"
          />
        </div>
      </div>
      <template v-else>
        <div v-if="!!topBanner.imgUrl && !!topBanner.imgUrl.length" class="promotion-content">
          <div class="banner-block">
            <div
              v-if="topBanner.imgUrl.length > 1"
              v-swiper:baseSwiper="swiperOption"
              @mouseenter="autoPlayStop"
              @mouseleave="autoPlayStart"
              class="index-banner-different-swiper"
            >
              <div class="swiper-wrapper">
                <div v-for="(banner, bannerIndex) in topBanner.imgUrl" :key="bannerIndex" class="swiper-slide">
                  <p v-track.viewOnce="getBiParams(topBanner.event.el || 'eventbanner')" class="banner-link">
                    <img
                      :data-src="addWebpSuffix(banner)"
                      :alt="topBanner.alt"
                      :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/8d/e7/f08fbe910832b62ef03e3537d5af8de7.jpg')"
                      data-expand="1"
                      class="swiper-img lazyload"
                    />
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="single-banner-block">
              <p v-track.viewOnce="getBiParams(topBanner.event.el || 'eventbanner')">
                <img
                  :src="require('~/assets/images/default_img.jpg')"
                  :data-src="addWebpSuffix(topBanner.imgUrl[0])"
                  :alt="topBanner.alt"
                  data-expand="1"
                  class="swiper-img lazyload"
                />
              </p>
            </div>
          </div>
          <div v-if="!!categories.length" class="middle-block">
            <template v-for="(category, categoryIndex) in categories">
              <a
                v-track.viewOnce.click="getBiParams(category.event.el, categoryIndex)"
                :key="categoryIndex"
                :href="countryUrl(category.linkUrl)"
                :aria-label="category.alt"
                @click="setOrderSourceFlag('midyear2022', true)"
                target="_blank"
                class="img-block"
              >
                <img
                  :data-src="addWebpSuffix(category.imgUrl)"
                  :alt="category.alt"
                  :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/fa/9e/ab85717ed548bc9ffd158ebdd04dfa9e.jpg')"
                  data-expand="1"
                  class="lazyload"
                />
                <div class="mask"></div>
              </a>
            </template>
          </div>
          <template v-for="(module, moduleIndex) in mostPopular">
            <div :key="moduleIndex" class="module-box">
              <YearAndPromotionItem :module="module" :current-index="moduleIndex" />
            </div>
          </template>
        </div>
      </template>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import YearAndPromotionItem from '@/components/promotion/YearAndPromotionItem'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  name: 'YearAndPromotion',
  components: {
    MainApp,
    YearAndPromotionItem
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        effect: 'fade',
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
          speed: 500
        }
      }
    }
  },
  computed: {
    bgImg({ promotionStatus, beforePromotion, afterPromotion }) {
      switch (promotionStatus) {
        case 'not_started':
          return beforePromotion
        case 'over':
          return afterPromotion
        default:
          return null
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      if (!['US', 'CA', 'GB', 'AU', 'DE', 'FR'].includes(context.store.state.country)) {
        context.redirect(302, resetSeoUrl(context, '/'))
        return
      }
      context.store.commit('setJsKey', 'yearAndPromotion')
      const result = await context.$axios.get('/1.0/list/midyear-landing-page')
      const { promotionStatus, beforePromotion, afterPromotion, topBanner = {}, categories = [], mostPopular = [] } = result.data.data
      return {
        ...commonAsyncData,
        topBanner,
        categories,
        mostPopular,
        promotionStatus,
        beforePromotion,
        afterPromotion
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
  methods: {
    autoPlayStop() {
      this.baseSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.baseSwiper.autoplay.start()
    },
    getBiParams(el, index) {
      if (process.server) return
      const bi = ['BD_cat', 'WD_cat', 'MOB_cat', 'SOD_cat', 'Brand_cat', 'FlowerGirl_cat', 'Accessories_cat', 'Groomsmen_cat']
      if (!el) {
        el = bi[index]
      }
      return {
        id: `midyear2022-${el}`,
        common: {
          ec: 'midyear2022',
          el
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.year-and-promotion {
  background-color: #fff;
  .promotion-comingsoon-over {
    max-width: 1600px;
    max-height: 690px;
    margin: 10px auto;
    .img-block {
      background-color: var(--color-f9f9f9);
      img {
        width: 100%;
        vertical-align: middle;
        max-height: 690px;
      }
    }
  }
  .promotion-content {
    max-width: 1293px;
    margin: 13px auto 60px;
    overflow: hidden;
    .banner-block {
      font-size: 0;
      img {
        width: auto;
        max-height: 560px;
      }
      .single-banner-block {
        a {
          display: block;
          background-color: var(--color-f9f9f9);
          img {
            margin: 0 auto;
            display: block;
          }
        }
      }
      a {
        cursor: default;
      }
    }
    .middle-block {
      width: 100%;
      margin: 15px 0 60px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 15px;
      .img-block {
        display: block;
        font-size: 0;
        position: relative;
        img {
          width: auto;
          max-height: 267px;
        }
        &:hover .mask {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
    }
    .module-box {
      width: 100%;
      margin-bottom: 60px;
    }
    a {
      display: block;
      text-align: center;
    }
  }
  @media screen and (max-width: 1600px) {
    .promotion-comingsoon-over {
      margin: 10px 20px;
    }
  }
  @media screen and (max-width: 1360px) {
    .promotion-content {
      margin: 13px 20px 60px;
      .middle-block {
        margin: 15px 0 30px;
      }
    }
  }
}
</style>
