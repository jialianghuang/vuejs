<template>
  <div v-if="secondaryBanner.length > 0" class="second-banner-swiper second-banner-commonbox">
    <div
      ref="second_banner_swiper"
      @mouseenter="autoPlayStop"
      @mouseleave="autoPlayStart"
      v-swiper:second_banner_swiper="secondBannerSwiperOption"
      class="swiper-container"
    >
      <div class="swiper-wrapper product-swiper-viewport">
        <div
          v-for="(item, id) in secondaryBanner"
          :key="id"
          v-track.viewOnce.click="{
            id: `ga_secondbanner_${item.alt}_${id}`,
            view: getGAParams(item, id, 'view'),
            click: getGAParams(item, id, 'click')
          }"
          data-analysis-a="listPageSecondaryBannery"
          class="goods-item swiper-slide"
        >
          <a
            v-track.view.click="getBiCommonParams(id + 1)"
            :href="countryUrl(item.linkUrl && !isSpecialHotMapUrl(item) ? item.linkUrl : '')"
            :class="{
              need_datalayer: item.eventCategory,
              style_quiz_banner: item.eventName == 'style_quiz_banner',
              'no-pointer': judgeIsEmptyUrl(item.linkUrl, id) || isSpecialHotMapUrl(item)
            }"
            :data-datalayer-category="item.eventCategory"
            :data-datalayer-label="item.eventName"
            :aria-label="item.eventCategory || item.eventName || 'second banner' + id"
            :target="item.newWindows ? '_blank' : '_self'"
            class="goods-item-a"
          >
            <!-- 黑五活动期间临时加上只要有图片链接就展示图，详细内容活动后确定 -->
            <img
              v-if="(!judgeIsEmptyUrl(item.linkUrl) && !isSpecialHotMapUrl(item)) || item.imgUrl"
              :src="addWebpSuffix(item.imgUrl)"
              :alt="item.alt | filterAlt"
            />
          </a>
          <!-- 热区 lego 配置-->
          <ImageHotSpot :positions="item.positions" @hotSpotClick="setPoint(item, id, 'click')" ec="secondarybanner" />
        </div>
      </div>
      <div v-show="showPagination" class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bannerMixins from '@/assets/js/bannerMixins'

let vm = null
export default {
  name: 'SecondBannerSwiper',
  filters: {
    filterAlt(e) {
      let res = e
      if (res) {
        res = e.replace('+', ' ')
        res = res.replace('_', ' ')
      } else {
        res = 'second swiper banner'
      }
      return res
    }
  },
  mixins: [bannerMixins],
  props: {
    secondaryBanner: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      arrView: [],
      secondBannerSwiperOption: {
        loop: true,
        autoplay: {
          delay: 3500
        },
        // observer: true, // 修改swiper自己或子元素时，自动初始化swiper  无效的，别用这个
        // observeParents: true, // 修改swiper的父元素时，自动初始化swiper  无效的，别用这个
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        },
        on: {
          slideChangeTransitionEnd: () => {
            if (vm.second_banner_swiper) {
              const index = vm.second_banner_swiper.realIndex
              const item = vm.secondaryBanner && vm.secondaryBanner[index]
              if (!vm.arrView.includes(index)) {
                vm.getBiCommonParams(index)
              }
              if (item && item.eventViewCategory && item.eventViewName) {
                if (this.cancelExtraPoint(item.eventViewName, item.eventViewName)) {
                  this.setDataLayer({
                    action: 'view',
                    category: item.eventViewCategory,
                    label: item.eventViewName
                  })
                }
              }
            }
          }
        }
      },
      showPagination: true
    }
  },
  computed: {
    ...mapState('list', ['isOutlet'])
  },
  watch: {
    secondaryBanner: {
      handler(newVal) {
        this.$nextTick(() => {
          if (this.second_banner_swiper) {
            if (Object.keys(this.secondaryBanner).length <= 1) {
              this.second_banner_swiper.loopDestroy()
              this.second_banner_swiper.update()
              this.second_banner_swiper.allowTouchMove = false
              this.showPagination = false
            } else {
              this.second_banner_swiper.loopDestroy()
              this.second_banner_swiper.loopCreate()
              this.second_banner_swiper.update()
              this.second_banner_swiper.allowTouchMove = true
              this.showPagination = true
            }
            this.getBiCommonParams(1)
          }
        })
      },
      immediate: true
    }
  },
  created() {
    vm = this
  },
  mounted() {
    if (this.secondaryBanner.length) {
      this.getBiCommonParams(1)
      this.arrView.push(0)
    }
  },
  methods: {
    isSpecialHotMapUrl(item) {
      return (this.dressType === 'clearance' || this.dressType === 'outlet') && item && item.linkUrl.includes('https://support.azazie.com')
    },
    autoPlayStop() {
      this.second_banner_swiper && this.second_banner_swiper.autoplay.stop()
    },
    autoPlayStart() {
      this.second_banner_swiper && this.second_banner_swiper.autoplay.start()
    },
    handleHeatMapClick(e) {
      if ((this.dressType == 'clearance' || this.dressType === 'outlet') && this.secondaryBanner.length) {
        if (this.isOutlet == 1 || this.dressType === 'outlet') {
          window.open(this.secondaryBanner[this.secondaryBanner.length - 1].linkUrl)
        } else {
          window.open(this.getSupportUrl(`/articles/115005989606-Ready-to-Ship-Dresses`, `/articles/8076754`))
        }
      }
    },
    getBiCommonParams(index) {
      if (process.server) return
      const category = this.catBiName
      const item = this.secondaryBanner && this.secondaryBanner[index - 1]
      const msg = {
        index,
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
      if (item && item.isWebActivity) {
        msg.report_pos = 'activity_banner'
      }
      const params = {
        common: {
          ec: 'secondarybanner',
          el: category + '_' + index + '_secondarybanner',
          msg: JSON.stringify(msg)
        }
      }
      return params
    },
    getGAParams(item, index, type) {
      // ga打点
      if (process.server) return
      const creativeSlot = `top carousel banner_${index + 1}`
      const creativeName = item.alt || item.bannerText
      const params = {
        event: 'ga4Event',
        event_parameters: {
          creative_slot: creativeSlot,
          creative_name: creativeName,
          promotion_name: item.activityName || 'none',
          items: [
            {
              item_id: 'none',
              item_name: 'none',
              item_category: 'none',
              item_brand: 'none',
              currency: this.currencyCode,
              promotion_id: item.activityId || 'none',
              promotion_name: item.activityName || 'none'
            }
          ]
        }
      }
      if (type === 'view') {
        params.event_name = 'view_promotion'
      } else {
        params.event_name = 'select_promotion'
      }
      return params
    }
  }
}
</script>

<style lang="less">
.second-banner-swiper {
  // .goods-item {
  //   width: 100% !important;
  // }
  .goods-item-a {
    display: inline-block;
    width: 100%;
    vertical-align: middle;
    img {
      width: 100%;
    }
    .heat-click {
      &:hover {
        cursor: pointer;
      }
    }
  }
  .swiper-pagination {
    width: 100%;
    display: block;
    text-align: center;
    height: 15px;
    position: absolute;
    bottom: 7px;
    z-index: 3;
    .swiper-pagination-bullet {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: var(--color-cccccc);
      cursor: pointer;
      opacity: 1;
      margin: 0 5px;
    }
    .swiper-pagination-bullet-active {
      background: var(--color-121212);
    }
  }
}
</style>
