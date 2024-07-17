<template>
  <div @click="showShippingFeeLayer" class="link-shipping-fee">
    <az-icon icon-class="icon-gwc_question_" class="icon-question" />
    <div class="link">{{ nl('page_shipping_how_much') }}</div>
  </div>
</template>

<script>
export default {
  name: 'ShippingFee',
  methods: {
    showShippingFeeLayer() {
      this.$store.commit('cart/setShippingFeeLayerShow', true)
    }
  }
}
</script>

<style lang="less" scoped>
.link-shipping-fee {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 350px;
  height: 25px;
  margin-top: 15px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  padding-left: 20px;
  &:hover {
    .link {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .icon-question {
    width: 12px;
    height: 12px;
  }
  .link {
    margin-left: 5px;
    font-size: 11px;
    color: var(--color-121212);
  }
}
</style>
