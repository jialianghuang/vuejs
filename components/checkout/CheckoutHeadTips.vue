<template>
  <div v-if="show" class="checkout-head-tips">
    <div>{{ nl('page_checkout_swatch_redelivery') }}</div>
    <!-- <span @click="show = false" class="close-btn">x</span> -->
    <img @click="show = false" src="~assets/images/close_m_black.png" class="close-btn" alt="close" />
  </div>
</template>

<script>
export default {
  name: 'CheckoutHeadTips',
  data() {
    return {
      show: true
    }
  }
}
</script>

<style lang="less" scoped>
.checkout-head-tips {
  background-color: #ebf6fb;
  border: 1px solid #d1e5ef;
  color: #474848;
  position: relative;
  padding: 10px;
  margin-bottom: 50px;
  .close-btn {
    position: absolute;
    cursor: pointer;
    // top: 0;
    // right: 10px;
    // padding: 4px;
    width: 10px;
    right: 12px;
    top: 9px;
  }
}
</style>
