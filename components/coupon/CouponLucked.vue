<template>
  <div class="coupon-lucked">
    <p class="coupon-lucked-title">{{ nl('page_wgd_coupon_box_text10') }}</p>
    <p class="coupon-lucked-sub-title">{{ nl('page_wgd_coupon_box_text11') }}</p>
    <p class="coupon-lucked-description">{{ nl('page_wgd_coupon_box_text12') }}</p>
  </div>
</template>

<script>
export default {
  name: 'CouponLucked',
  languageKeys: ['page_wgd_coupon_box_text10', 'page_wgd_coupon_box_text11', 'page_wgd_coupon_box_text12']
}
</script>

<style lang="less" scoped>
.coupon-lucked {
  &-title {
    font-family: @font-family-600;
    font-size: 32px;
    letter-spacing: 0.04em;
    text-align: center;
    text-transform: uppercase;
  }
  &-sub-title {
    margin: 25px 0 25px;
    color: @theme-color;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0.96px;
    text-transform: uppercase;
    text-align: center;
  }
  &-description {
    color: #999;
    font-size: 13px;
    line-height: normal;
    margin-top: 5px;
    font-family: @font-family;
    text-align: center;
  }
}
</style>
