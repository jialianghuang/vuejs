<template>
  <div :class="versionObj.listWithCodeAbtest" class="sod-coupon-price-box">
    <div class="sod-price-box">
      <strong class="sod-goods-price">{{ baseInfo.shopPriceDisplay }}</strong>
      <span class="sod-old-price">{{ baseInfo.noDealPriceDisplay }}</span>
      <!-- <span v-if="baseInfo.priceOff" class="sod-prod-save-price"> ({{ nl('page_common_thrift') }} {{ baseInfo.priceOffDisplay }}) </span> -->
    </div>
    <!-- <template>
      <azWithCode :code="baseInfo.activityCouponCode" source="normal" />
    </template> -->
    <!-- AzWithCoupon 有划线价就展示save百分比,不分是 coupon  activity sale 、 limit sale 、 flash sale -->
    <AzWithCoupon
      v-if="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
      :value="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
      :showText="!!baseInfo.activityCouponCode"
      :code="baseInfo.activityCouponCode"
      :hasShopPriceRange="baseInfo.hasShopPriceRange"
      :baseInfo="{}"
    />
    <div class="sod-question-tip">
      <az-icon icon-class="icon-gwc-_question_" class="sod-tip"></az-icon>
      <p v-track.view="getParams()" :class="['sod-question-tip-text', from]">
        <span>{{ nl('page_sod_copupon_hibeauty_desc') }}</span>
        <!-- <span v-else>{{ nl('page_sod_copupon_hibeauty_guest_desc') }}</span> -->
      </p>
    </div>
    <TagBuyMoreSaveMore
      :nameEl="'dp_name'"
      :descEl="'dp_description'"
      v-if="baseInfo.buyMoreSaveMore && baseInfo.bundlePromotionInfo && baseInfo.bundlePromotionInfo.showProductBundleTag && !from"
      :bundlePromotionInfo="baseInfo.bundlePromotionInfo"
    />
  </div>
</template>

<script>
// import azWithCode from '@/components/az-ui/AzWithCode'
import AzWithCoupon from '@/components/az-ui/AZWithCoupon'

import TagBuyMoreSaveMore from '@/components/product/TagBuyMoreSaveMore'
export default {
  name: 'SodCouponPriceBox',
  languageKeys: ['page_common_thrift', 'page_sod_copupon_hibeauty_desc', 'page_sod_copupon_hibeauty_guest_desc'],
  components: { AzWithCoupon, TagBuyMoreSaveMore },
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    },
    from: {
      type: String,
      default: ''
    }
  },
  methods: {
    getParams() {
      const msg = {
        attr2: this.$route.name + (this.from ? '-' + this.from : '')
      }
      const common = {
        ec: this.isLogin ? 'sodcouponhoverlogin' : 'sodcouponhover',
        el: this.isLogin ? 'sodcouponhoverlogin' : 'sodcouponhover',
        msg: JSON.stringify(msg)
      }
      return {
        id: '',
        common
      }
    }
  }
}
</script>

<style lang="less" scoped>
.A {
  .sod-goods-price {
    color: @theme-color !important;
  }
}
.sod-coupon-price-box {
  margin-top: 8px;
  display: flex;
  align-items: center;
  .sod-price-box {
    display: flex;
    align-items: center;
  }
  .sod-goods-price {
    font-family: @font-family-600;
    font-size: 20px;
    color: var(--color-121212);
  }
  .sod-old-price {
    margin: 0 5px;
    font-family: @font-family-500;
    font-size: 13px;
    color: #999;
    text-decoration-line: line-through;
  }
  .sod-prod-save-price {
    font-family: @font-family-500;
    font-size: 13px;
    color: @theme;
  }
  .sod-question-tip {
    margin: 0 10px 0 5px;
    position: relative;
    z-index: @z-index;
    &:hover {
      .sod-question-tip-text {
        display: block;
      }
    }
    .sod-question-tip-text {
      display: none;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 7px);
      max-width: 388px;
      width: max-content;
      padding: 15px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0 0 2px 1px #d9d9d9;
      &.quickshop {
        max-width: 280px;
      }
      &:before {
        content: '';
        width: 0;
        height: 0;
        border-right: 8px solid transparent;
        border-bottom: 8px solid var(--color-cccccc);
        border-left: 8px solid transparent;
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translate(-50%, 0);
        margin-top: -8px;
      }
      &:after {
        content: '';
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-bottom-color: #ffffff;
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translate(-50%, 0);
        margin-top: -15px;
      }
      span {
        line-height: unset;
      }
    }
  }
  /deep/ .tag-buy_more_save_more {
    height: 30px;
    padding: 0 10px;
    margin-right: 10px;
  }
}
</style>
