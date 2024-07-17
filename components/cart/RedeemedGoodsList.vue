<template>
  <div class="redeemed-wrapper">
    <a
      v-show="redeemedGoodsList.length > 3"
      :class="[`swiper-prev-button-${swiperId}`]"
      href="javascript:void(0)"
      class="swiper-prev-button"
    >
      <span style="display: none">swiper-button-prev</span>
      <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
    </a>
    <div
      :ref="`redeemedSwiper-${swiperId}`"
      v-swiper:[dynamicSwiperName]="redeemedSwiperOption"
      :instance-name="dynamicSwiperName"
      :class="[`swiper-container-${swiperId}`]"
      class="swiper-container"
    >
      <div class="swiper-wrapper product-swiper-viewport">
        <redeemed-goods-list-item
          v-for="(goodsInfo, index) in redeemedGoodsList"
          :index="index"
          :key="index"
          :baseInfo="goodsInfo"
          :type="type"
          :show-sticker="false"
          @refreshCartList="refreshCartList"
          @quickShop="quickShopClick"
          @noticeShow="noticeShow"
        ></redeemed-goods-list-item>
      </div>
    </div>
    <a
      v-show="redeemedGoodsList.length > 3"
      :class="[`swiper-next-button-${swiperId}`]"
      href="javascript:void(0)"
      class="swiper-next-button"
    >
      <span style="display: none">swiper-button-next</span>
      <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
    </a>
  </div>
</template>

<script>
import RedeemedGoodsListItem from '@/components/cart/RedeemedGoodsListItem'

export default {
  name: 'RedeemedGoodsSwiper',
  components: { RedeemedGoodsListItem },
  props: {
    redeemedGoodsList: {
      type: Array,
      default() {
        return []
      }
    },
    swiperId: {
      type: Number,
      default: 0
    },
    type: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dynamicSwiperName: `redeemedSwiper_${this.swiperId}`,
      redeemedSwiperOption: {
        slidesPerView: 4,
        spaceBetween: 10,
        slidesPerGroup: 4,
        simulateTouch: false,
        speed: 800,
        navigation: {
          nextEl: `.swiper-next-button-${this.swiperId}`,
          prevEl: `.swiper-prev-button-${this.swiperId}`
        },
        on: {
          slideChangeTransitionEnd() {}
        }
      }
    }
  },
  methods: {
    refreshCartList() {
      this.$emit('refreshCartList')
    },
    quickShopClick(params) {
      this.$emit('quickShop', params)
    },
    noticeShow(Bool) {
      // 处理层级问题，hover的时候，需要把自身父元素的层级提高
      if (this.$refs[`redeemedSwiper-${this.swiperId}`]) {
        this.$refs[`redeemedSwiper-${this.swiperId}`].style.zIndex = Bool ? 1 : 0
      }
    }
  }
}
</script>

<style lang="less">
.redeemed-wrapper {
  padding: 20px 30px 0;
  position: relative;
  height: 98px;
}
.arraw-icon {
  width: 13px;
  height: 13px;
}
.swiper-next-button,
.swiper-prev-button {
  position: absolute;
  display: block;
  top: 44%;
  width: auto;
  height: auto;
  cursor: pointer;
  background-image: none;
  outline: none;
}
.swiper-prev-button {
  left: 10px;
}
.swiper-next-button {
  right: 10px;
}
.swiper-button-disabled svg {
  fill: #ccc;
}
</style>
