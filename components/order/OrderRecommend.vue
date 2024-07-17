<template>
  <div class="order-b order-recommend">
    <div class="order_info_title">{{ nl('page_common_you_may_also_like') }}</div>
    <div class="order-recommend-body">
      <div class="recommend-list">
        <product-swiper v-if="list.length > 0" :prodList="list" :nextEl="'mp-swiper-button-next'" :prevEl="'mp-swiper-button-prev'">
          <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
            <div class="swiper-wrapper product-swiper-viewport">
              <div
                v-for="(item, index) in list"
                :key="`recommend_${index}`"
                @click="itemClick(item, index)"
                v-track.view.click="{ common: getBiParams(item, index) }"
                class="swiper-slide goods-item"
              >
                <product-swiper-item
                  :index="index"
                  :item="item"
                  :addSuffix="true"
                  :from="'orderRecommend'"
                  :hasQuickBtn="true"
                  :hasQuick="true"
                  @quickShop="showQuickShopDialog"
                  sticker-class="cart-product-item-icon"
                ></product-swiper-item>
              </div>
            </div>
          </div>
        </product-swiper>
      </div>
    </div>
  </div>
</template>

<script>
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
export default {
  name: 'OrderRecommend',
  components: {
    ProductSwiper,
    ProductSwiperItem
  },
  props: {
    recommendProducts: {
      type: Object,
      default() {
        return {}
      }
    },
    sampleRecommendDressAble: {
      // 是否是样衣订单推荐正式裙子
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showGoods: false,
      MPSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 15,
        slidesPerGroup: 6,
        simulateTouch: false,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: '.mp-swiper-button-next',
          prevEl: '.mp-swiper-button-prev'
        }
      }
    }
  },
  computed: {
    list() {
      return this.recommendProducts.prodList || []
    }
  },
  methods: {
    getBiParams(item, index) {
      if (process.server) return
      const msg = {
        position: index * 1 + 1,
        goodsId: item.goodsId,
        color: item.color,
        cat_id: item.catId,
        cat_name: item.catName
      }
      return {
        ec: 'orderdetailPage',
        el: 'youmayalsolike',
        msg: JSON.stringify(msg)
      }
    },
    // 显示quick shop弹框
    showQuickShopDialog(params) {
      this.$emit('quickShop', params)
    },
    itemClick() {
      this.sampleRecommendDressAble && this.setOrderSourceFlag('sample_recommend_order_detailpage', true)
    }
  }
}
</script>

<style lang="less" scoped>
.order_info_title {
}
.order-recommend-body {
  padding: 15px;
}
</style>
