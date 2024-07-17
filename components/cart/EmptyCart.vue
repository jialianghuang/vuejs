<template>
  <div class="empty-cart">
    <div class="empty-cart-title">{{ nl('page_cart_empty_tip') }}</div>
    <div class="empty-cart-dec">{{ nl('page_cart_empty_tips2') }}</div>
    <a
      v-if="cartInfo.recommendInfo"
      v-track.view.click="{ common: { ec: 'shoppingbag', el: 'shop_offers' } }"
      :href="countryUrl(cartInfo.recommendInfo.url)"
      class="go-shopping-btn"
      >{{ cartInfo.recommendInfo.buttonName }}</a
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'EmptyCart',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['cartInfo'])
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.empty-cart {
  margin-top: 65px;
  text-align: center;
  .empty-cart-title {
    font-family: @font-family-600, sans-serif;
    font-size: 16px;
    line-height: 22px;
    color: var(--color-121212);
  }
  .empty-cart-dec {
    margin: 21px 0 25px;
    font-family: @font-family-500, sans-serif;
    font-size: 13px;
    line-height: 18px;
    color: var(--color-121212);
  }
  .go-shopping-btn {
    display: inline-block;
    min-width: 200px;
    padding: 0 25px;
    box-sizing: border-box;
    height: 42px;
    text-align: center;
    line-height: 42px;
    font-family: @font-family-600, sans-serif;
    font-size: 14px;
    color: #fff;
    background-color: @black-btn-color !important;
    text-transform: uppercase;
    &:hover,
    &:focus,
    &:active,
    &.active {
      background-color: @black-btn-hover-color !important;
    }
  }
}
</style>
