<template>
  <div
    v-swiper:[dynamicSwiperName]="swiperOption"
    :class="{ 'swiper-no-swiping': bannerList && bannerList.length == 1 }"
    class="swiper-container"
  >
    <div class="swiper-wrapper">
      <div v-for="(bannerItem, bannerIndex) in bannerList" :key="bannerIndex" class="swiper-slide">
        <div
          v-track.view.click="{
            common: getBiParams(ec, bannerItem.description)
          }"
          class="module-content-banner"
        >
          <div v-if="!isImgLoad" :style="styleInfo" class="skeleton-default"></div>
          <div v-show="isImgLoad">
            <a
              v-if="bannerItem.url"
              :href="countryUrl(bannerItem.url)"
              :aria-label="bannerItem.description || 'landingpage ' + bannerIndex"
              :target="targetBlank(bannerItem.newWindows)"
            >
              <img
                :src="addWebpSuffix(bannerItem.imgUrl)"
                @load="imgLoad()"
                :alt="bannerItem.description || 'landingpage ' + bannerIndex"
              />
            </a>
            <img
              v-else
              :src="addWebpSuffix(bannerItem.imgUrl)"
              @load="imgLoad()"
              :alt="bannerItem.description || 'landingpage ' + bannerIndex"
            />
          </div>
          <!-- 热区 lego 配置-->
          <ImageHotSpot :positions="bannerItem.positions" :img-url="bannerItem.imgUrl" :ec="ec" />
        </div>
      </div>
    </div>
    <div class="swiper-pagination swiper-pagination-bullets"></div>
    <template v-if="bannerList && bannerList.length > 1">
      <div class="swiper-button-prev prev-arraw prev-arraw-horizontal" role="button" aria-label="left">
        <span style="display: none">left</span>
        <az-icon class="index-arraw-icon" icon-class="icon-lby_arrow_left" />
      </div>
      <div class="swiper-button-next next-arraw next-arraw-horizontal" role="button" aria-label="right">
        <span style="display: none">right</span>
        <az-icon class="index-arraw-icon" icon-class="icon-lby_arrow_right" />
      </div>
    </template>
  </div>
</template>

<script>
import bannerMixins from '@/assets/js/bannerMixins'
export default {
  name: 'CommonBannerSwiper',
  mixins: [bannerMixins],
  props: {
    bannerList: {
      type: Array,
      default: () => {
        return []
      }
    },
    moduleIndex: {
      type: Number,
      default: 0
    },
    ec: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dynamicSwiperName: 'swiper_' + this.moduleIndex,
      isImgLoad: false
    }
  },
  computed: {
    swiperOption({ bannerList }) {
      const tempSwiperOption = {
        slidesPerView: 1,
        centeredSlides: true,
        on: {
          click: (e) => {}
        }
      }
      if (bannerList && bannerList.length == 1) {
        return {
          loop: false,
          ...tempSwiperOption
        }
      } else {
        return {
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            prevEl: '.prev-arraw-horizontal',
            nextEl: '.next-arraw-horizontal'
          },
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            speed: 1000
          },
          ...tempSwiperOption
        }
      }
    },
    // 动态占位高度
    styleInfo({ moduleIndex }) {
      const heightMap = {
        0: '16.92vw',
        1: '52vw',
        3: '43.75vw',
        5: '21.87vw'
      }
      return {
        height: heightMap[moduleIndex] || 'auto'
      }
    }
  },
  methods: {
    imgLoad() {
      this.isImgLoad = true
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    }
  }
}
</script>
<style lang="less" scoped>
img {
  width: 100%;
}
.index-arraw-icon {
  visibility: hidden;
  fill: currentColor;
  color: #eee;
  font-size: 24px;
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5));
}
&:hover .index-arraw-icon {
  visibility: visible;
}
/deep/ .swiper-button-prev,
/deep/ .swiper-button-next {
  background-image: unset;
  width: 24px;
  height: 24px;
  &.prev-arraw {
    left: 40px;
  }
  &.next-arraw {
    right: 40px;
  }
}
/deep/ .swiper-pagination-bullet {
  background-color: var(--color-eeeeee);
  opacity: 1 !important;
}
/deep/ .swiper-pagination-bullet-active {
  background-color: var(--color-121212);
  opacity: 1 !important;
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  background: url('~assets/images/goodsList/img-bg.png') no-repeat center center/ 74px 80px, var(--color-f9f9f9);
}
</style>
