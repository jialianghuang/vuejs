<template>
  <div class="flash-sale-list-empty">
    <div class="empty-img"></div>
    <div class="empty-title">{{ nl('page_flash_sale_end') }}</div>
  </div>
</template>
<script>
export default {
  name: 'FlashSaleListEmpty',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.flash-sale-list-empty {
  margin-top: 80px;
  margin-bottom: 40px;
  text-align: center;
  .empty-img {
    display: inline-block;
    width: 143px;
    height: 169px;
    background: url(~assets/images/flashSale/flash-sale-end.png) center center/100% 100% no-repeat;
    background-size: 100% 100%;
  }
  .empty-title {
    margin-top: 25px;
    font-family: @font-family-600, sans-serif;
    font-size: 16px;
    line-height: 22px;
    color: var(--color-121212);
  }
}
</style>
