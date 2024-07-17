<template>
  <div v-if="!(hasData && !reviews.length)" v-track.viewOnce="getBiParams('customerviews')" class="index-reviews">
    <template v-if="!skeleton && hasData">
      <div class="index-reviews-title">
        <h3>{{ nl('page_module_index_reviews_title') }}</h3>
        <div class="view-more">
          <div v-if="total" class="view-more__count">
            <az-rate :value="+averageRating" :readonly="true"></az-rate>{{ ` ${total} ` }}{{ nl('page_module_index_reviews') }}
          </div>
          <div v-if="reviews.length > 3" class="view-more__arrow">
            <a
              v-track.viewOnce.click="getBiParams('customerviewsarrow')"
              href="javascript:void(0)"
              aria-label="swiper-button-prev"
              class="prev-arraw swiper-button-prev reviews-swiper-button-prev"
            >
              <span style="display: none">swiper-button-prev</span>
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
            </a>
            <a
              v-track.viewOnce.click="getBiParams('customerviewsarrow')"
              href="javascript:void(0)"
              aria-label="swiper-button-next"
              class="next-arraw swiper-button-next reviews-swiper-button-next"
            >
              <span style="display: none">swiper-button-next</span>
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
            </a>
          </div>
        </div>
      </div>
      <div
        ref="MPSwiper"
        v-swiper:MPSwiper="MPSwiperOption"
        v-if="reviews"
        v-track.click="getBiParams('customerviews')"
        @mouseenter="autoPlayStop"
        @mouseleave="autoPlayStart"
        class="swiper-container"
      >
        <div class="swiper-wrapper product-swiper-viewport">
          <div v-for="(item, index) in reviews" :key="index" class="swiper-slide">
            <index-reviews-item :item="item"></index-reviews-item>
          </div>
        </div>
      </div>
    </template>
    <common-lazy-module v-else :radio="0.15" height="50"></common-lazy-module>
  </div>
</template>

<script>
// import { reviewsInfo } from '@/mock/index'
import AzRate from '@/components/az-ui/Rate/AzRate'
import CommonLazyModule from '@/components/common/CommonLazyModule'
import IndexReviewsItem from '@/components/index/IndexReviewsItem'

export default {
  name: 'IndexReviews',
  components: {
    CommonLazyModule,
    IndexReviewsItem,
    AzRate
  },
  props: {
    skeleton: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      hasData: false,
      reviews: [],
      total: 0,
      averageRating: 5,
      MPSwiperOption: {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 15,
        slidesPerGroup: 3,
        simulateTouch: false,
        loopFillGroupWithBlank: true,
        speed: 800,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
          speed: 500
        },
        navigation: {
          nextEl: '.reviews-swiper-button-next',
          prevEl: '.reviews-swiper-button-prev'
        }
      }
    }
  },
  watch: {
    skeleton: {
      handler() {
        if (!this.skeleton) this.fetchData()
      },
      immediate: true
    }
  },
  methods: {
    autoPlayStop() {
      this.MPSwiper && this.MPSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.MPSwiper && this.MPSwiper.autoplay.start()
    },
    fetchData() {
      if (process.server || this.hasData) return
      return this.$axios
        .$get('/1.0/home/customer-comment')
        .then((data) => {
          if (+data.code !== 0) return
          this.reviews = data.data.reviews || []
          this.total = data.data.total
          this.averageRating = data.data.averageRating
        })
        .finally(() => {
          this.hasData = true
        })
    },
    getBiParams(el) {
      if (process.server) return
      if (!(!this.skeleton && this.hasData)) return
      return {
        id: `index-reviews-${el}`,
        common: {
          ec: 'homepage',
          el,
          param1: (location && location.href) || '-1',
          param2: this.versionGroup.home_custom_home
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.index-reviews {
  max-width: 1600px;
  min-width: unset;
  margin: 30px auto 60px;
  padding: 0 20px;
}
//
.index-reviews-title {
  position: relative;
  border-bottom: 1px solid #ccc;
  h3 {
    font-size: 24px;
    line-height: 24px;
    font-family: @font-family-500, sans-serif;
    text-align: left;
    font-weight: normal;
    letter-spacing: 0;
    padding-bottom: 10px;
  }
  .view-more {
    position: absolute;
    top: 1px;
    right: 0;
    // transform: translateY(-50%);
    display: flex;
    /deep/ svg {
      width: 12px;
      height: 12px;
    }
    /deep/ .rate-item {
      cursor: auto;
    }
  }
  .view-more__arrow {
    margin-right: 10px;
  }
}

.prev-arraw,
.next-arraw {
  display: inline-block;
  cursor: pointer;
  background-image: none;
  width: auto;
  height: auto;
  position: static;
  z-index: unset;
  &.swiper-button-disabled {
    cursor: default;
  }
  &:focus {
    outline: none;
  }
}
</style>
