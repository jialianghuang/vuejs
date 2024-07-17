<template>
  <div class="year-and-promotion-item">
    <div class="module-products">
      <product-swiper
        :prodList="productList"
        :nextEl="'module_swiper-button-next-' + currentIndex"
        :prevEl="'module_swiper-button-prev-' + currentIndex"
        :leftArrowEvent="subEvent.leftArrow"
        :rightArrowEvent="subEvent.rightArrow"
      >
        <div
          :ref="'module_swiper' + currentIndex"
          v-swiper:module_swiper="moduleSwiperOption"
          v-track.view.click="getBiParams(subEvent.itemsTotal)"
          class="swiper-container"
        >
          <div class="swiper-wrapper product-swiper-viewport">
            <template v-for="(product, productIndex) in productList">
              <div :key="productIndex" v-track.view.click="getBiParams(product.event)" class="goods-item swiper-slide">
                <product-swiper-item
                  :item="product"
                  :index="productIndex"
                  :addSuffix="true"
                  :stickerClass="`cat-product-item-icon`"
                ></product-swiper-item>
              </div>
            </template>
            <div
              v-track.view.click="getBiParams({ ec: '2022cybersale', el: `${alias}_view_more` })"
              class="goods-item swiper-slide view-more-block"
            >
              <div class="view-more">
                <a :href="countryUrl(viewMoreUrl)" target="_blank">
                  <span class="view-more-text">{{ nl('page_common_view_more') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </product-swiper>
    </div>
  </div>
</template>

<script>
import productSwiper from '@/components/product/ProductSwiper'
import productSwiperItem from '@/components/product/productSwiperItem'

export default {
  name: 'CyberMondayLandingItem',
  components: {
    productSwiper,
    productSwiperItem
  },
  props: {
    productList: {
      type: Array,
      default: () => {
        return []
      }
    },
    viewMoreUrl: {
      type: String,
      default: ''
    },
    currentIndex: {
      type: String,
      default: ''
    },
    subEvent: {
      type: Object,
      default: () => {
        return {}
      }
    },
    alias: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      moduleSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 15,
        slidesPerGroup: 6,
        simulateTouch: false,
        speed: 800,
        navigation: {
          nextEl: `.module_swiper-button-next-${this.currentIndex}`,
          prevEl: `.module_swiper-button-prev-${this.currentIndex}`
        },
        on: {
          slideChangeTransitionEnd() {
            // console.log('activeIndex:', vm.$refs.module_swiper.swiper.activeIndex)
          }
        }
      }
    }
  },
  methods: {
    getEventEl(item) {
      return (item.event && item.event.el) || null
    },
    getBiParams(ev) {
      if (process.server) return
      const { ec, el } = ev
      return {
        common: {
          ec,
          el
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.year-and-promotion-item {
  .module-banner-block {
    display: block;
    font-size: 0;
    margin-bottom: 35px;
    img {
      width: 100%;
      max-height: 150px;
    }
  }
  .module-products {
    .view-more-block {
      height: auto;
      .view-more {
        background-color: var(--color-f9f9f9);
        height: calc(100% - 20px);
        align-items: center;
        justify-content: center;
        display: flex;
        .view-more-text {
          text-transform: uppercase;
          border-bottom: 2px solid var(--color-121212);
          padding-bottom: 5px;
          font-size: 14px;
          color: var(--color-121212);
        }
      }
    }
    /deep/ .swiper-button-prev,
    /deep/ .swiper-button-next {
      background: none !important;
    }
    /deep/ .product-swiper .product-swiper-container .prev-arraw {
      left: 5px;
    }
    /deep/ .product-swiper .product-swiper-container .next-arraw {
      right: 6px;
    }
  }
}
</style>
