<template>
  <div class="search-product-list-container">
    <div id="cat-prod-list" :class="[viewSwitch, resetDisplay ? 'flex-box' : 'grid-box']">
      <product-list-item
        v-for="(product, index) in prodList"
        :id="'resultlistpage_product' + (index + 1)"
        :key="product.goodsId + '-' + index"
        :productIndex="index"
        :item="product"
        :page="page"
        @notify-me="notifyMe"
      ></product-list-item>
      <div
        :class="[
          { 'catpl-prod-270x370': viewSwitch == 'smaller' },
          { 'catpl-prod-360x498': viewSwitch == 'larger' && sodView != 'petite_plus' },
          { 'catpl-prod-petite-plus-270x370': sodView == 'petite_plus' }
        ]"
        v-for="key in [1, 2, 3, 4, 5]"
        :key="key"
        class="goods-item"
      ></div>
    </div>
    <div v-if="recommendProdList.length > 0" class="cat-recommend-prod-list">
      <h3 class="bestSeller-title">
        {{ recommendTitle }}
      </h3>
      <div id="most-popular-point" class="most-popular">
        <div class="item-list">
          <product-swiper
            v-if="recommendProdList.length > 0"
            :prodList="recommendProdList"
            :nextEl="'mp-swiper-button-next'"
            :prevEl="'mp-swiper-button-prev'"
          >
            <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
              <div class="swiper-wrapper product-swiper-viewport">
                <div
                  v-for="(item, index) in recommendProdList"
                  :title="item.shownGoodsName"
                  :key="index"
                  @click="seeItem(index, item.goodsId)"
                  data-datalayer-category="MostPopular_Click"
                  data-datalayer-label="MostPopular_Click"
                  class="swiper-slide need_datalayer goods-item"
                >
                  <product-swiper-item :item="item" :from="'youLookFor'" :index="index"></product-swiper-item>
                </div>
              </div>
            </div>
          </product-swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productListItem from '@/components/list/ProductListItem'
import ProductSwiper from '@/components/product/ProductSwiper'
import ProductSwiperItem from '@/components/product/productSwiperItem'
import { mapState } from 'vuex'
export default {
  name: 'SearchProductList',
  components: {
    productListItem,
    ProductSwiper,
    ProductSwiperItem
  },
  props: {
    page: {
      type: Number,
      default: 0
    },
    recommendProdList: {
      type: Array,
      default: () => {
        return []
      }
    },
    recommendTitle: {
      type: String,
      default: ''
    },
    resetDisplay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      most_popular_point: true,
      MPSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 20,
        slidesPerGroup: 4,
        simulateTouch: false,
        speed: 800,
        navigation: {
          nextEl: '.mp-swiper-button-next',
          prevEl: '.mp-swiper-button-prev'
        },
        breakpoints: {
          1500: {
            slidesPerView: 4,
            slidesPerGroup: 4
          },
          1920: {
            slidesPerView: 6,
            slidesPerGroup: 6
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      viewSwitch: (state) => state.list.viewSwitch,
      sodView: (state) => state.list.sodView,
      prodList: (state) => state.list.prodList
    })
  },
  mounted() {
    this.scrollDom()
  },
  methods: {
    getOffset(elem) {
      const docElem = document.documentElement
      const box = elem.getBoundingClientRect()
      return {
        top: box.top + docElem.scrollTop
      }
    },
    scrollDom() {
      const _this = this
      window.addEventListener('scroll', function() {
        const ele = document.getElementById('most-popular-point')
        if (!ele) {
          return
        }
        const p = _this.getOffset(ele).top
        const docTop = document.documentElement.scrollTop
        const broHight = document.body.offsetHeight
        if (p >= docTop && p < docTop + broHight) {
          if (_this.most_popular_point) {
            _this.setDataLayer({
              category: 'YouMayLookfor',
              action: 'view',
              label: 'YouMayLookfor_FewResult_View',
              value: _this.recommendProdList.length
            })
            _this.most_popular_point = false
          }
        }
      })
    },
    seeItem(i, id) {
      this.setDataLayer({
        category: 'YouMayLookfor',
        action: 'Click',
        label: 'YouMayLookfor_NoResult_Click',
        value: i + 1
      })
      this.setModuleCookie('YouMayLookfor', id)
    },
    notifyMe(info) {
      this.$emit('notify-me', info)
    }
  }
}
</script>

<style lang="less">
#cat-prod-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  line-height: 1.8;
  clear: both;
  justify-content: space-between;
}
.cat-recommend-prod-list {
  .bestSeller-title {
    text-transform: uppercase;
    font-size: 24px;
    letter-spacing: 0;
    font-family: @font-family-500, sans-serif;
    font-weight: normal;
    border-top: 1px solid #ccc;
    padding: 20px 0;
  }
  .most-popular {
    width: 100%;
    box-sizing: border-box;
    .title {
      color: var(--color-121212);
      text-transform: uppercase;
      letter-spacing: 0;
      font-weight: 400;
      font-family: @font-family-500, sans-serif;
      font-size: 24px;
      line-height: 24px;
      padding-bottom: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--color-cccccc);
      a {
        display: inline-block;
        text-transform: uppercase;
        font-size: 13px;
        font-weight: 400;
        font-family: @font-family-500, sans-serif;
        color: var(--color-121212);
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
}
#cat-prod-list {
  width: 100%;
  line-height: 1.8;
  clear: both;
  &.grid-box {
    display: grid;
  }
  &.flex-box {
    display: flex;
    flex-wrap: wrap;
  }
  &.smaller {
    &.grid-box {
      grid-template-columns: repeat(5, 1fr);
      column-gap: 15px;
      .goods-item {
        width: 100% !important;
      }
    }
    &.flex-box {
      .goods-item {
        margin-right: 15px;
        &:nth-child(1) {
          margin-right: 30px;
        }
        &:nth-child(5n - 1) {
          margin-right: 0;
        }
      }
    }
  }
  &.larger {
    &.grid-box {
      grid-template-columns: repeat(4, 1fr);
      column-gap: 15px;
      .goods-item {
        width: 100% !important;
      }
    }
    &.flex-box {
      .goods-item {
        margin-right: 15px;
        &:nth-child(1) {
          margin-right: 30px;
        }
        &:nth-child(4n - 1) {
          margin-right: 0;
        }
      }
    }
  }
  @media screen and (max-width: 1600px) {
    &.smaller {
      &.grid-box {
        grid-template-columns: repeat(4, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(4n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
          &:nth-child(4) {
            margin-right: 15px;
          }
        }
      }
    }
    &.larger {
      &.grid-box {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(3n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1024px) {
    &.smaller {
      &.grid-box {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(3n - 1) {
            margin-right: 0;
          }
          &:nth-child(2) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
        }
      }
    }
    &.larger {
      &.grid-box {
        grid-template-columns: repeat(2, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(2n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
          &:nth-child(2) {
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>
