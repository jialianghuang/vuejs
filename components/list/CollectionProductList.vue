<template>
  <div>
    <div id="cat-prod-list">
      <product-list-item
        v-for="(product, index) in prodList"
        :key="product.goodsId + '-' + index"
        :productIndex="index"
        :item="product"
        :page="page"
      ></product-list-item>
    </div>
  </div>
</template>

<script>
import productListItem from '@/components/list/ProductListItem'
import { mapState } from 'vuex'
export default {
  name: 'CollectionProductList',
  components: {
    productListItem
  },
  props: {
    page: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      prodList: (state) => state.list.prodList
    })
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less">
#cat-prod-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  line-height: 1.8;
  clear: both;
}
</style>
