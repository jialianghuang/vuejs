<template>
  <div class="bridal-main-banner">
    <div
      v-if="banners.length > 1"
      v-swiper:baseSwiper="swiperOption"
      @mouseenter="autoPlayStop"
      @mouseleave="autoPlayStart"
      class="index-banner-different-swiper"
    >
      <div class="swiper-wrapper">
        <div
          v-for="(banner, bannerIndex) in banners"
          :key="bannerIndex"
          v-track.viewOnce.click="{
            id: 'gacollectionbanner' + bannerIndex,
            view: getGAParams(banner, bannerIndex, 'view'),
            click: getGAParams(banner, bannerIndex, 'click')
          }"
          class="swiper-slide"
        >
          <a
            :href="countryUrl(banner.linkUrl)"
            :aria-label="banner.imageLabel"
            :target="banner.newWindows ? '_blank' : '_self'"
            v-track.view="{
              common: [
                { ec: 'Collectionbanner', el: banner.imageLabel },
                getNewTrackParams('secondarybanner', 'banner', banner.imageUrl, bannerIndex + 1, null, banner.desc)
              ]
            }"
            @click="
              trackClick(
                'Collectionbanner',
                banner.imageLabel,
                'secondarybanner',
                'banner',
                banner.imageUrl,
                bannerIndex + 1,
                banner.desc,
                '/'
              )
            "
            class="banner-link"
          >
            <img
              @load="imgLoad(banner)"
              :style="getImgStyle(banner)"
              :alt="banner.imageLabel || 'bridal banner' + bannerIndex"
              :src="addWebpSuffix(banner.imageUrl)"
              class="swiper-img lazyload"
            />
          </a>
          <!-- 热区 lego 配置-->
          <ImageHotSpot
            :positions="banner.positions"
            :img-url="banner.imageUrl"
            @hotSpotClick="setPoint('Collectionbanner', banner.imageLabel, 'click')"
            ec="Collectionbanner"
            ec2="secondarybanner"
          />
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
    <div v-else class="swiper-wrapper-one">
      <a
        :href="countryUrl(banners[0].linkUrl)"
        :aria-label="banners[0].imageLabel || 'bridal banner'"
        :target="banners[0].newWindows ? '_blank' : '_self'"
        class="banner-link"
      >
        <img
          @load="imgLoad(banners[0])"
          :style="getImgStyle(banners[0])"
          :alt="banners[0].imageLabel"
          :src="addWebpSuffix(banners[0].imageUrl)"
          class="swiper-img lazyload"
        />
      </a>
    </div>
  </div>
</template>

<script>
import bridalIndexModuleMixins from '@/assets/js/bridalIndexModuleMixins'
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'BridalMainBanner',
  mixins: [bridalIndexModuleMixins, bannerMixins],
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
          delay: 5000,
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
    }
  }
}
</script>

<style lang="less" scoped>
.bridal-main-banner {
  width: 100%;
  position: relative;
  video {
    width: 100%;
  }
  .swiper-pagination {
    display: flex;
    justify-content: flex-end;
    padding-right: 50px;
    bottom: 35px;
    box-sizing: border-box;
  }
  /deep/.swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    margin: 0 8px;
    background: @btn-light-hover-color;
    opacity: 1;
  }
  /deep/.swiper-pagination-bullet-active {
    background: @border-color;
  }
}
img {
  width: 100%;
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
.swiper-wrapper-one {
  width: 100%;
  position: absolute;
  z-index: 9;
  & > img {
    width: 100%;
  }
}
</style>
