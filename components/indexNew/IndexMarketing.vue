<template>
  <div class="index-marketing">
    <div
      v-show="!skeleton && loaded"
      v-swiper:marketingSwiper="marketingSwiperOption"
      @mouseenter="autoPlayStop"
      @mouseleave="autoPlayStart"
    >
      <div class="swiper-wrapper">
        <div
          v-for="(it, idx) in item.bannerList"
          :key="idx"
          v-track.viewOnce.click="{
            id: 'marketingbanner_' + idx,
            view: getGAParams(it, idx, 'view'),
            click: getGAParams(it, idx, 'click')
          }"
          class="swiper-slide"
        >
          <a
            :href="it.linkUrl ? countryUrl(it.linkUrl) : 'javascript:;'"
            :target="it.newWindows ? '_blank' : '_self'"
            :aria-label="it.imageLabel || 'marketing banner' + idx"
            class="marketing-banner"
          >
            <img
              v-track.viewOnce="{
                id: 'Rotatingbanner' + idx,
                common: [
                  getBiParams('Banner', 'Rotatingbanner' + (idx + 1)),
                  getNewTrackParams('secondarybanner', 'banner', it.imageUrl, idx + 1, null, it.desc || it.imageLabel)
                ]
              }"
              :src="addWebpSuffix(it.imageUrl)"
              :alt="it.imageLabel || 'marketing banner' + idx"
              @load="imgLoad(it)"
              @click="
                trackClick(
                  'Banner',
                  'Rotatingbanner' + (idx + 1),
                  'secondarybanner',
                  'banner',
                  it.imageUrl,
                  idx + 1,
                  it.desc || it.imageLabel,
                  '/'
                )
              "
              :style="getImgStyle(it)"
              :data-val="JSON.stringify(it)"
            />
          </a>
          <ImageHotSpot
            :positions="it.positions"
            :img-url="it.imageUrl"
            @hotSpotClick="setPoint('Banner', 'Rotatingbanner' + (idx + 1), 'click', {}, null, '/')"
            ec="Rotatingbanner"
            ec2="secondarybanner"
            target-page="/"
          />
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets"></div>
      <template v-if="item.bannerList && item.bannerList.length > 1">
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
    <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'
import bannerMixins from '@/assets/js/bannerMixins'

/**
 * 首页eventMarketing轮播图区域
 */
// let vm = null
export default {
  mixins: [indexModuleMixins, bannerMixins],
  data() {
    return {
      marketingSwiperOption: {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          prevEl: '.prev-arraw-horizontal',
          nextEl: '.next-arraw-horizontal'
        },
        autoplay: {
          delay: 5000,
          // disableOnInteraction: true,
          speed: 500
        },
        allowTouchMove: false
        // on: {
        //   click: (e) => {
        //     if (e.target.dataset.val) {
        //       const val = JSON.parse(e.target.dataset.val)
        //       vm.clickBanner(val)
        //     }
        //   }
        // }
      }
    }
  },
  // created() {
  //   vm = this
  // },
  methods: {
    autoPlayStop() {
      this.marketingSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.marketingSwiper.autoplay.start()
    },
    clickBanner(e = {}) {
      if (e.linkUrl) {
        const url = this.countryUrl(e.linkUrl)
        if (e.newWindows) {
          window.open(url)
        } else {
          location.href = url
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.index-marketing {
  .swiper-slide {
    a {
      position: relative;
      display: block;
    }
    img {
      width: 100%;
    }
    .marketing-banner {
      cursor: pointer;
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
  .index-arraw-icon {
    visibility: hidden;
    fill: currentColor;
    color: #fff;
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
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.409;
}
</style>
