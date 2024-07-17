<template>
  <div v-if="listData && listData.prodList" class="prom-new-arrival-item-swiper">
    <div class="goods-list1-title">
      {{ nl(listData.title) }}
    </div>
    <div class="item-list">
      <product-swiper
        :prodList="listData.prodList"
        :nextEl="`prom-new-arrival-swiper-btn-next`"
        :prevEl="`prom-new-arrival-swiper-btn-prev`"
      >
        <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOptionNewArrival" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <div
              v-for="(item, index) in listData.prodList"
              v-track.view.click="{ common: getBiParams(index, item) }"
              :key="`list1` + index"
              class="goods-item swiper-slide"
            >
              <product-swiper-item :item="item" :noFavIcon="true" :index="index"></product-swiper-item>
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
  name: 'PromNewArrivalItem',
  components: {
    ProductSwiperItem,
    ProductSwiper
  },
  props: {
    listData: {
      type: Object,
      default: null
    },
    biMsg: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      MPSwiperOptionNewArrival: {
        slidesPerView: 5,
        // spaceBetween: '1.16%',
        spaceBetween: 15,
        slidesPerGroup: 5,
        simulateTouch: false,
        // loop: true,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: `.prom-new-arrival-swiper-btn-next`,
          prevEl: `.prom-new-arrival-swiper-btn-prev`
        }
      }
    }
  },
  watch: {},
  methods: {
    getBiParams(index, item) {
      const msg = {
        index: index + 1,
        goodsId: item.goodsId,
        cat_name: item.catName,
        color: item.color
      }
      const biMsgTemp = {
        msg: JSON.stringify(msg),
        ...this.biMsg
      }
      return biMsgTemp
    }
  }
}
</script>

<style lang="less" scoped>
.prom-new-arrival-item-swiper {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  max-width: 1353px;
  min-width: unset;
  .goods-list1-title {
    align-items: center;
    padding: 50px 0 40px 0;
    font-family: @font-Ivy-Mode-400;
    font-size: 36px;
    font-weight: 400;
    text-align: center;
  }
  .arraw-icon {
    width: 18px;
    height: 18px;
  }
  /deep/.prev-arraw,
  /deep/.next-arraw {
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
.prom-new-arrival-item-swiper.miniSize {
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
