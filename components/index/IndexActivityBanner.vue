<template>
  <div id="index-activity-banner" :style="marginStyle" class="index-activity-banner">
    <div v-if="banners && banners.length && banners.length == 1">
      <div
        v-for="(banner, index) in banners"
        :key="index"
        :data-analysis-b="'Promobanner' + (index + 1)"
        v-track.viewOnce.click="{
          id: 'activitybanner_' + index,
          view: [getBiParams(index)],
          click: [getBiParams(index)]
        }"
        class="swiper-slide"
        data-analysis-a="Banner"
      >
        <img v-if="judgeIsEmptyUrl(banner.linkUrl)" :src="addWebpSuffix(banner.imgUrl)" :alt="banner.alt" />
        <a v-else :href="countryUrl(banner.linkUrl)" :aria-label="banner.alt" target="_blank">
          <img :src="addWebpSuffix(banner.imgUrl)" :alt="banner.alt" />
        </a>
      </div>
    </div>
    <div v-else v-swiper:indexBannerSwiper="swiperOption" @mouseenter="autoPlayStop" @mouseleave="autoPlayStart" class="content">
      <div class="swiper-wrapper">
        <div
          v-for="(banner, index) in banners"
          :key="index"
          :data-analysis-b="'Promobanner' + (index + 1)"
          v-track.viewOnce.click="{
            id: 'activitybanner_' + index,
            view: [getBiParams(index)],
            click: [getBiParams(index)]
          }"
          class="swiper-slide"
          data-analysis-a="Banner"
        >
          <img v-if="judgeIsEmptyUrl(banner.linkUrl)" :src="addWebpSuffix(banner.imgUrl)" :alt="banner.alt" />
          <a v-else :href="countryUrl(banner.linkUrl)" :aria-label="banner.alt" target="_blank">
            <img :src="addWebpSuffix(banner.imgUrl)" :alt="banner.alt" />
          </a>
        </div>
      </div>
      <div v-show="showPagination" class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
/**
 * 该组件暂未使用
 */
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'IndexActivityBanner',
  components: {},
  mixins: [bannerMixins],
  props: {
    banners: {
      type: Array,
      default: () => {
        return []
      }
    },
    marginBottom: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      activityBanner: {},
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          speed: 1100
        },
        on: {
          slideChangeTransitionEnd: () => {},
          tap: () => {}
        }
      },
      showPagination: true,
      marginStyle: {}
    }
  },
  watch: {
    banners: {
      handler(newVal) {
        this.$nextTick(() => {
          if (this.indexBannerSwiper) {
            if (Object.keys(this.banners).length <= 1) {
              this.indexBannerSwiper.loopDestroy()
              this.indexBannerSwiper.update()
              this.indexBannerSwiper.allowTouchMove = false
              this.showPagination = false
            } else {
              this.indexBannerSwiper.loopDestroy()
              this.indexBannerSwiper.loopCreate()
              this.indexBannerSwiper.update()
              this.indexBannerSwiper.allowTouchMove = true
              this.showPagination = true
            }
            // if (this.banners && this.banners.length) this.setBiAnalysis('view', 'Promobanner1')
          }
        })
      },
      immediate: true
    }
  },
  mounted() {
    // abtest 新版首页模块打点
    this.marginStyle = {
      marginBottom: this.marginBottom + 'px'
    }
  },
  methods: {
    getBiParams(index) {
      if (process.server) return
      return {
        dp: 'home',
        ec: 'Banner',
        el: 'Promobanner',
        param1: (location && location.href) || '-1',
        param2: this.versionObj.activityAbtest,
        msg: JSON.stringify({
          report_pos: index
        })
      }
    },
    autoPlayStop() {
      this.indexBannerSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.indexBannerSwiper.autoplay.start()
    }
  }
}
</script>

<style lang="less" scoped>
.index-activity-banner {
  width: 100%;
  // padding: 0 20px;
  box-sizing: border-box;
  // max-width: 1600px;
  min-width: unset;
  // margin: 20px auto -10px;
  // display: none;

  /deep/ .swiper-pagination-bullet {
    background: #ccc;
    opacity: 1;
  }
  /deep/.swiper-pagination-bullet-active {
    background: var(--color-121212);
  }
  .title {
    color: var(--color-121212);
    text-transform: uppercase;
    font-size: 24px;
    line-height: 33px;
    padding-bottom: 7px;
    border-bottom: 1px solid var(--color-cccccc);
  }
  .swiper-slide {
    img {
      width: 100%;
      // height: 130px;
      vertical-align: middle;
    }
  }
}
</style>
