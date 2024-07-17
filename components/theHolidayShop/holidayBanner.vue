<template>
  <div id="holiday-banner" class="holiday-banner">
    <div v-swiper:holidayBannerSwiper="swiperOption" @mouseenter="autoPlayStop" @mouseleave="autoPlayStart" class="content">
      <div class="swiper-wrapper">
        <div v-for="(banner, index) in banners" :key="index" class="swiper-slide">
          <a v-if="banner.linkUrl" @click="handleActivityBanner(index)" :href="countryUrl(banner.linkUrl)" :aria-label="banner.alt">
            <img :src="addWebpSuffix(banner.imgUrl)" :alt="banner.alt || 'holiday banner ' + index" />
          </a>
          <img v-else :src="addWebpSuffix(banner.imgUrl)" :alt="banner.alt || 'holiday banner ' + index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HolidayBanner',
  props: {
    banners: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      activityBanner: {},
      scrollDointFlag: false,
      // 首次滚动不打点
      initScrollDointFlag: true,
      // activityBannerShow: false,
      swiperOption: {
        loop: !!(this.banners && this.banners > 1),
        slidesPerView: 1,
        centeredSlides: true,
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true
        // },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          speed: 500
        },
        on: {
          slideChangeTransitionEnd: () => {},
          tap: () => {
            if (this.holidayBannerSwiper) {
              //   const index = this.holidayBannerSwiper.realIndex
            }
          }
        }
      }
    }
  },
  watch: {
    scrollDointFlag(nval) {
      // 监听滚动吗？
      if (nval) {
        if (this.initScrollDointFlag) {
          this.initScrollDointFlag = false
        } else {
          //
        }
      }
    }
  },
  mounted() {},
  methods: {
    setBiAnalysis(ea, el) {
      // 新版首页此模块打点
      this.buryPoint(this, 'event', {
        dp: 'home',
        ec: 'Banner',
        ea,
        el,
        param1: (location && location.href) || '-1',
        param2: this.versionObj.activityAbtest,
        msg: JSON.stringify({
          report_pos: 'activity_banner'
        })
      })
    },
    autoPlayStop() {
      this.holidayBannerSwiper && this.holidayBannerSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.holidayBannerSwiper && this.holidayBannerSwiper.autoplay.start()
    },
    handleActivityBanner(index) {
      // this.setBiAnalysis('click', 'Promobanner' + (index + 1))
    }
  }
}
</script>

<style lang="less" scoped>
.holiday-banner {
  width: 100%;
  margin: 10px auto;
  // display: none;
  font-size: 0;
  .content {
    a {
      display: block;
    }
    img {
      width: 100%;
      height: auto;
      vertical-align: middle;
    }
  }
}
</style>
