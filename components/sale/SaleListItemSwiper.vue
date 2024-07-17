<template>
  <div id="most-popular" v-if="list.length > 0" :class="{ miniSize: miniSize }" class="sale-list-item-swiper">
    <div class="item-list">
      <product-swiper
        v-if="list.length > 0"
        :prodList="list"
        :nextEl="`sale-list-swiper-button${indexStr}-next`"
        :prevEl="`sale-list-swiper-button${indexStr}-prev`"
      >
        <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <div
              v-for="(item, index) in list"
              :title="item.shownGoodsName"
              :key="index"
              @click="itemClick(item, index)"
              class="swiper-slide need_datalayer goods-item"
            >
              <product-swiper-item
                :item="item"
                :index="index"
                :miniSize="miniSize"
                :addSuffix="true"
                @appear="itemAppear"
                item-target="_blank"
              ></product-swiper-item>
            </div>
          </div>
        </div>
      </product-swiper>
    </div>
  </div>
</template>

<script>
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
export default {
  name: 'SaleListItemSwiper',
  components: { ProductSwiper, ProductSwiperItem },
  props: {
    miniSize: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    shopAllUrl: {
      type: String,
      default: ''
    },
    indexStr: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      MPSwiperOption: {
        slidesPerView: 8,
        spaceBetween: 15,
        slidesPerGroup: 8,
        simulateTouch: false,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: `.sale-list-swiper-button${this.indexStr}-next`,
          prevEl: `.sale-list-swiper-button${this.indexStr}-prev`
        },
        breakpoints: {
          1500: {
            slidesPerView: 6,
            slidesPerGroup: 6
          },
          1920: {
            slidesPerView: 8,
            slidesPerGroup: 8
          }
        }
      }
    }
  },
  watch: {},
  mounted() {},
  methods: {
    itemAppear(data) {
      this.$emit('saleListItemAppear', data)
    },
    itemClick(item, index) {
      this.$emit('saleListItemClick', {
        item,
        index
      })
    }
  }
}
</script>

<style lang="less">
.sale-list-item-swiper {
  width: 100%;
  box-sizing: border-box;
  min-width: unset;
  margin: 70px auto 90px;
  .shop-all {
    width: 164px;
    height: calc(164px / 0.72);
    background-color: #f6f6f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: @font-family-500;
    .shop-all-text {
      font-size: 16px;
      line-height: 26px;
      text-align: center;
      color: var(--color-121212);
      border-bottom: 1px solid var(--color-121212);
      border-top: 1px solid transparent;
    }
  }
  .arraw-icon {
    width: 18px;
    height: 18px;
  }
  .prev-arraw,
  .next-arraw {
    display: block;
    cursor: pointer;
    background-image: none;
    width: auto;
    height: auto;
    &.swiper-button-disabled {
      cursor: default;
    }
    &:focus {
      outline: none;
    }
  }
}
.sale-list-item-swiper.miniSize {
  width: 1140px;
  max-width: 1140px;
  padding: 0;
  margin: 64px auto 3px;
  .product-swiper-viewport {
    height: 325px;
  }
  /deep/.arraw-icon {
    width: 19px !important;
    height: 19px !important;
  }
  .title {
    line-height: 22px;
    height: 22px;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    font-weight: 400;
    padding-bottom: 5px;
    margin-bottom: 26px;
  }
}
</style>
