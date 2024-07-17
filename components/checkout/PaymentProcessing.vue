<template>
  <div class="payment-processing">
    <div class="paying_img"></div>
    <div class="paying_text">
      {{ nl('page_paying_notice') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentProcessing'
}
</script>

<style lang="less" scoped>
.payment-processing {
  height: 50%;
  overflow: auto;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .paying_img {
    margin: 0 auto;
    width: 110px;
    height: 120px;
    background: url('~assets/images/checkout/paying_load.gif') no-repeat;
    background-size: contain;
  }
  .paying_text {
    margin-top: 20px;
    font-size: 24px;
    font-family: @font-family-500, sans-serif;
    text-align: center;
  }
}
</style>
