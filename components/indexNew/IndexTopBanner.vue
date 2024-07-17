<template>
  <div>
    <!-- v-show="!skeleton && loaded" -->
    <div class="index-banner">
      <!-- swiper-no-swiping 导致一个banner图时，不走on事件 特殊处理 -->
      <div
        ref="indexFirstBanner"
        v-swiper:indexFirstBanner="swiperOption"
        :class="{ 'swiper-no-swiping': list && list.length == 1 }"
        @mouseenter="autoPlayStop"
        @mouseleave="autoPlayStart"
        class="swiper-container"
      >
        <div class="swiper-wrapper">
          <div v-if="dbLandingPage" @click="handleShowShoppingForDialog" class="swiper-slide">
            <img :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/73/7b/5fdbc2e09f3e60a8936001c4e7e6737b.jpg')" />
          </div>
          <div v-for="(it, idx) in list" :key="idx" class="swiper-slide">
            <a
              :href="it.linkUrl ? countryUrl(it.linkUrl) : 'javascript:;'"
              :target="it.newWindows ? '_blank' : '_self'"
              :aria-label="(it.imageLabel || 'index swiper banner' + idx) | filterAlt"
            >
              <img
                v-track.viewOnce.click="{
                  id: 'Banner-topbanner-' + idx,
                  view: [
                    getBiParams(ec || 'Banner', `topbanner_${idx + 1}`),
                    getGAParams(it, idx, 'view'),
                    getNewTrackParams('mainbanner', 'banner', it.imageUrl, idx + 1, null, it.desc)
                  ],
                  click: [
                    getBiParams(ec || 'Banner', `topbanner_${idx + 1}`),
                    getNewTrackParams('mainbanner', 'banner', it.imageUrl, idx + 1, null, it.desc)
                  ]
                }"
                :src="addWebpSuffix(it.imageUrl)"
                :alt="(it.imageLabel || 'index swiper banner' + idx) | filterAlt"
                :usemap="it.isHotspot ? '#indexBannerMap' + idx : ''"
                :data-val="JSON.stringify(it)"
                :data-idx="idx"
                :style="styleInfo"
                class="skeleton-default index-swiper-banner"
                width="1280px"
                height="400px"
              />
            </a>
            <!-- 热区 lego 配置-->
            <ImageHotSpot
              :positions="it.positions || []"
              :img-url="it.imageUrl"
              @hotSpotClick.stop="setPoint('Banner', `topbanner_${idx + 1}`, 'click', {}, null, '/')"
              :ec="ec || 'Banner'"
              :ec2="'mainbanner'"
              target-page="/"
            />
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets"></div>
        <template v-if="list && list.length > 1">
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
    </div>
    <!-- <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div> -->
  </div>
</template>
<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'
import bannerMixins from '@/assets/js/bannerMixins'

/**
 * 首页首屏
 */
let vm = null
export default {
  name: 'IndexTopBanner',
  filters: {
    filterAlt(e) {
      return e.replace(/\+/g, ' ')
    }
  },
  mixins: [indexModuleMixins, bannerMixins],
  props: {
    ec: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: this.item.bannerList || []
    }
  },
  computed: {
    swiperOption() {
      const tempSwiperOption = {
        slidesPerView: 1,
        centeredSlides: true,
        on: {
          click: (e) => {
            // 循环轮播的轮播项点击操作会出现点击无效的情况，所以点击相关事件要放在这里
            if (e.target.dataset.val) {
              const val = JSON.parse(e.target.dataset.val)
              const idx = JSON.parse(e.target.dataset.idx)
              vm.setPoint('Banner', `topbanner_${idx + 1}`, 'click', {}, null, '/')
              vm.getGAParams(val, idx, 'click')
              // vm.clickBanner(val)
            }
          }
        }
      }
      if (this.item.bannerList && this.item.bannerList.length == 1) {
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
            delay: 4000,
            // disableOnInteraction: false,
            speed: 500
          },
          allowTouchMove: false,
          ...tempSwiperOption
        }
      }
    },
    dbEndTime() {
      return this.serverTime.split(' ')[0] + ' 23:59:59'
    }
  },
  watch: {
    item(e) {
      this.list = JSON.parse(JSON.stringify(e.bannerList))
    }
  },
  created() {
    vm = this
  },
  mounted() {
    this.list = JSON.parse(JSON.stringify(this.item.bannerList))
    this.handleHotMap()
    window.addEventListener('resize', this.handleHotMap)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleHotMap)
  },
  methods: {
    clickBanner(e, i) {
      if (e.linkUrl) {
        const url = this.countryUrl(e.linkUrl)
        if (e.newWindows) {
          window.open(url)
        } else {
          location.href = url
        }
      }
    },
    // 因为接口返回的热图坐标是相对于图片真实大小的坐标，但是显示时不会正好显示那个大小，
    // 所以要根据当前视图显示比例，动态调整热图坐标数据
    handleHotMap() {
      setTimeout(() => {
        const pageWidth = this.$refs.indexFirstBanner.clientWidth // 获取页面宽度
        const tempArr = JSON.parse(JSON.stringify(this.item.bannerList))
        for (let i = 0; i < tempArr.length; i++) {
          const ele = tempArr[i]
          if (ele.isHotspot) {
            const banners = document.querySelectorAll('.index-swiper-banner')
            // 当前视图宽度/图片真实宽度 * 热图的坐标，就可以获取当前视图上热图应该有的坐标
            const ratio = pageWidth / banners[i].naturalWidth
            if (ele.hotSpotRegion) {
              for (let x = 0; x < ele.hotSpotRegion.length; x++) {
                const e = ele.hotSpotRegion[x]
                for (let y = 0; y < e.coordinates.length; y++) {
                  const v = e.coordinates[y]
                  this.list[i].hotSpotRegion[x].coordinates[y] = Math.round(v * ratio)
                }
              }
            }
          }
        }
        this.$forceUpdate()
      }, 100)
    },
    autoPlayStop() {
      this.indexFirstBanner.autoplay.stop()
    },
    autoPlayStart() {
      this.indexFirstBanner.autoplay.start()
    },
    handleShowShoppingForDialog() {
      this.$store.commit('setShowShoppingForDialog', true)
    }
  }
}
</script>
<style lang="less" scoped>
.index-banner {
  .swiper-slide {
    img {
      width: 100%;
      cursor: pointer;
      height: auto;
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
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  // height: 100vw * 0.46876;
}
</style>
