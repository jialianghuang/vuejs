<template>
  <div class="year-and-promotion-item">
    <a
      :href="countryUrl(module.bannerInfo.linkUrl)"
      v-track.viewOnce.click="getBiParams(getEventEl(module.bannerInfo), currentIndex)"
      @click="setOrderSourceFlag('midyear2022', true)"
      target="_blank"
      class="module-banner-block"
      aria-label="year and promotion"
    >
      <img :src="replaceImgCdnUrl(module.bannerInfo.imgUrl)" alt="year and promotion" />
    </a>
    <div v-if="!!module.prodList.length" class="module-products">
      <product-swiper
        :prodList="module.prodList"
        :nextEl="'module_swiper-button-next-' + currentIndex"
        :prevEl="'module_swiper-button-prev-' + currentIndex"
      >
        <div :ref="'module_swiper' + currentIndex" v-swiper:module_swiper="moduleSwiperOption" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <template v-for="(product, productIndex) in module.prodList.slice(0, -1)">
              <div :key="productIndex" @click="setOrderSourceFlag('midyear2022', true)" class="goods-item swiper-slide">
                <product-swiper-item
                  :item="product"
                  :index="productIndex"
                  :hasQuick="product.canQuickShop"
                  :hasQuickBtn="product.canQuickShop"
                  :addSuffix="true"
                  :from="'landingPage'"
                ></product-swiper-item>
              </div>
            </template>
            <div
              v-track.viewOnce.click="getBiParams(getEventEl(module.prodList.slice(-1)[0]), currentIndex + 5)"
              @click="setOrderSourceFlag('midyear2022', true)"
              class="goods-item swiper-slide view-more"
            >
              <a :href="countryUrl(module.prodList.slice(-1)[0].linkUrl)" target="_blank">
                <span class="text">{{ nl('page_common_view_more') }}</span>
              </a>
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
  name: 'YearAndPromotionItem',
  components: {
    productSwiper,
    productSwiperItem
  },
  props: {
    module: {
      type: Object,
      default: () => {}
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      moduleSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 30,
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
  watch: {
    suggestProdList: {
      handler(val) {
        if (this.module && this.module.prodList && this.module.prodList.length) {
          const gaParams = this.getGAItemListParams(this.module.prodList, null, 'view', 'landingPage')
          this.setGA4DataLayer(gaParams)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getEventEl(item) {
      return (item.event && item.event.el) || null
    },
    getBiParams(el, index) {
      if (process.server) return
      const bi = [
        'bd_titlebanner',
        'wd_titlebanner',
        'mob_titlebanner',
        'sod_titlebanner',
        'acc_titlebanner',
        'bd_viewmore',
        'wd_viewmore',
        'mob_viewmore',
        'sod_viewmore',
        'acc_viewmore'
      ]
      if (!el) {
        el = bi[index]
      }
      return {
        id: `midyear2022-${el}`,
        common: {
          ec: 'midyear2022',
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
    .view-more {
      max-width: 176px;
      max-height: 264px;
      margin-left: 10px;
      background-color: var(--color-f9f9f9);
      a {
        display: inline-block;
        width: 100%;
        height: 264px;
        line-height: 264px;
        text-align: center;
      }
      .text {
        font-size: 14px;
        line-height: 19px;
        text-align: center;
        text-transform: uppercase;
        color: var(--color-121212);
        border-bottom: 2px solid var(--color-121212);
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
