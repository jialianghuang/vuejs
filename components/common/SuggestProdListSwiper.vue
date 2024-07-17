<template>
  <!-- 推荐模块组件，轮播图，比如CA订单成功页面的推荐 因为首页的mostpopular不太合适复用，建议之后有类似的使用这个组件，但是需要自行定义打点，按需补充功能-->
  <div v-if="list.length > 0" :class="{ miniSize: miniSize }" class="suggest-prod-list-swiper">
    <div class="title">
      {{ suggestProdList.title }}
      <a v-if="suggestProdList.shopAll" :href="countryUrl(suggestProdList.shopAll)" target="_blank">
        {{ nl('page_header_sale_shop_all') }} >
      </a>
    </div>
    <div class="item-list">
      <product-swiper v-if="list.length > 0" :prodList="list" :nextEl="'mp-swiper-button-next'" :prevEl="'mp-swiper-button-prev'">
        <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <div v-for="(item, index) in list" :title="item.shownGoodsName" :key="index" @click="itemClick" class="swiper-slide goods-item">
              <product-swiper-item :item="item" :miniSize="miniSize" :index="index"></product-swiper-item>
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
  name: 'SuggestProdListSwiper',
  components: { ProductSwiper, ProductSwiperItem },
  props: {
    suggestProdList: {
      type: Object,
      default() {
        return {}
      }
    },
    miniSize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      MPSwiperOption: {
        slidesPerView: 6,
        spaceBetween: '1.16%',
        slidesPerGroup: 6,
        simulateTouch: false,
        loop: true,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: '.mp-swiper-button-next',
          prevEl: '.mp-swiper-button-prev'
        }
      },
      list: this.suggestProdList.prodList || []
    }
  },
  methods: {
    itemClick() {
      this.$emit('suggestProdListItemClick')
    }
  }
}
</script>

<style lang="less">
.suggest-prod-list-swiper {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  max-width: 1353px;
  min-width: unset;
  margin: 70px auto 90px;
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
.suggest-prod-list-swiper.miniSize {
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
