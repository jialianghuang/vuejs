<template>
  <div class="order-b returned-goods-list">
    <div class="return-status-title">{{ list.length }}&nbsp;{{ nl('page_common_items_returned') }}</div>
    <div class="product-list">
      <returned-goods-item v-for="(productItem, index) in list" :key="index" :goodInfo="productItem"></returned-goods-item>
    </div>
  </div>
</template>

<script>
import ReturnedGoodsItem from '@/components/order/ReturnedGoodsItem'

export default {
  name: 'ReturnedGoodsList',
  components: {
    ReturnedGoodsItem
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.product-list {
  padding: 0 15px;
  /deep/ .returned-goods-item {
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
