<template>
  <div class="common-module-item">
    <div
      v-if="banners.length > 1"
      v-swiper:baseSwiper="swiperOption"
      @mouseenter="autoPlayStop"
      @mouseleave="autoPlayStart"
      class="index-banner-different-swiper"
    >
      <div class="swiper-wrapper">
        <div v-for="(banner, bannerIndex) in banners" :key="bannerIndex" class="swiper-slide">
          <a
            :href="countryUrl(banner.linkUrl)"
            :aria-label="banner.imageLabel"
            v-track.viewOnce.click="getBiParams(banner.imageLabel, bannerIndex)"
            target="_blank"
            class="banner-link"
          >
            <span style="display: none;">{{ banner.imageLabel || `${bis.ec || ''}-images-${bannerIndex}` }}</span>
            <img
              @load="imgLoad(banner)"
              :style="getImgStyle(banner)"
              :alt="banner.imageLabel || 'common banner' + bannerIndex"
              :src="addWebpSuffix(banner.imageUrl)"
              class="swiper-img lazyload"
            />
          </a>
          <!-- 热区 lego 配置-->
          <ImageHotSpot
            :positions="banner.positions"
            :ec="banner.imageLabel || 'common banner'"
            :img-url="banner.imageUrl"
            @hotSpotClick="setPoint(banner.imageLabel, bannerIndex, 'click')"
          />
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
    <div v-else class="swiper-wrapper-one">
      <a
        :href="countryUrl(banners[0].linkUrl)"
        :aria-label="banners[0].imageLabel | filtImageLabel"
        v-track.viewOnce.click="getBiParams(banners[0].imageLabel)"
        class="banner-link"
        target="_blank"
      >
        <span style="display: none;">{{ banners[0].imageLabel || `${bis.ec || ''}-images-0` }}</span>
        <img
          @load="imgLoad(banners[0])"
          :style="getImgStyle(banners[0])"
          :alt="banners[0].imageLabel | filtImageLabel"
          :src="addWebpSuffix(banners[0].imageUrl)"
          class="swiper-img lazyload"
        />
      </a>
      <!-- 热区 lego 配置-->
      <ImageHotSpot
        :positions="banners[0].positions"
        :ec="banners[0].imageLabel"
        :img-url="banners[0].imageUrl"
        @hotSpotClick="setPoint(banners[0].imageLabel, 0, 'click')"
      />
    </div>
  </div>
</template>

<script>
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'CommonModuleItem',
  filters: {
    // alt内容要符合标准
    filtImageLabel(e) {
      let res = e
      if (res === 'shipin24hrs') {
        res = 'ship in 24hrs'
      }
      if (!res) res = 'swiper banner'
      return res
    }
  },
  mixins: [bannerMixins],
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    },
    bis: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      height: 0,
      width: 0,
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
          speed: 500
        }
      },
      defaultBackgroundImg: require('~/assets/images/goodsList/img-bg.png')
    }
  },
  methods: {
    getImgStyle({ _imgLoaded }) {
      if (_imgLoaded) return {}
      // 默认取第一个图片宽高
      const el = this.$el && this.$el.querySelector('img')
      const height = el && el.offsetHeight
      const width = el && el.offsetWidth
      if (height >= 80 && width >= 74) {
        return {
          background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
        }
      } else if (!height && !width) {
        // ssr
        return {
          background: `var(--color-f9f9f9)`
        }
      } else {
        // 过小
        return {
          background: `url(${this.defaultBackgroundImg}) no-repeat center center/ contain, var(--color-f9f9f9)`
        }
      }
    },
    imgLoad(banner) {
      this.$set(banner, '_imgLoaded', true)
    },
    updateSize() {
      this.height = this.$el.offsetHeight
      this.width = this.$el.offsetWidth
    },
    autoPlayStop() {
      this.baseSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.baseSwiper.autoplay.start()
    },
    getBiParams(el, y = 0) {
      if (process.server) return
      return {
        id: `${this.bis.id}-${this.bis.x}-${y}`,
        common: {
          ec: this.bis.ec,
          el,
          param1: (location && location.href) || '-1',
          param2: this.versionGroup.home_custom_home
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.swiper-wrapper-one {
  position: relative;
}
.common-module-item {
  height: 100%;
  & > div,
  .wiper-wrapper,
  .swiper-slide {
    height: 100%;
  }
  .swiper-pagination {
    bottom: 20px;
  }
  /deep/.swiper-pagination-bullet {
    background: #ccc;
    opacity: 1;
  }
  /deep/.swiper-pagination-bullet-active {
    background: var(--color-121212);
  }
}
img {
  // max-width: 100%;
  // max-height: 100%;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  // background: url(../../assets/images/goodsList/img-bg.png) center center/74px 80px no-repeat, var(--color-f9f9f9);
}
a {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>
