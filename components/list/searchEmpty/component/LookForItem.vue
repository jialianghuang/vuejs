<template>
  <div>
    <div v-for="(item, index) in goodsInfo" :key="index" class="look-for-item">
      <div @click="goProdouct(item)" class="look-item">
        <div><img :src="addWebpSuffix(item.imgUrl)" class="look-item-img" alt="look item" /></div>
        <div class="look-goods-name">{{ item.shownGoodsName }}</div>
        <div class="goods-price">
          <span class="goods-no-deal-price">{{ item.noDealPrice }}</span>
          <span class="goods-shop-price">{{ item.shopPrice }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    goodsInfo: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    goProdouct(e) {
      const url = e.goodsUrl
      window.location.href = url
    }
  }
}
</script>

<style lang="less" scoped>
.look-for-item {
  display: inline-block;
  text-align: center;
}
.look-item {
  text-align: center;
  margin-right: 20px;
  margin-left: 20px;
  &:hover {
    .look-goods-name {
      color: var(--color-121212);
    }
  }
  .look-item-img {
    width: 179px;
    height: 248px;
    vertical-align: top;
    margin-bottom: 15px;
  }
  .look-goods-name {
    width: 179px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .goods-price {
    text-align: center;
  }
  .goods-shop-price {
    color: var(--color-999999);
    text-decoration: line-through;
    font-size: 13px;
    margin-left: 5px;
    display: inline-block;
  }
  .goods-no-deal-price {
    color: var(--color-121212);
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 22px;
  }
}
</style>
