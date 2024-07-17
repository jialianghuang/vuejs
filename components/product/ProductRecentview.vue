<template>
  <div v-track.viewOnce="{ common: { ec: 'recentlyview', el: 'items' } }" class="product-recently-viewed">
    <ProductModule key="recentlyViewd" v-bind="moduleBindValue" @quickShop="showQuickShopDialog" />
  </div>
</template>

<script>
import ProductModule from '@/components/product/ProductModule'
import { mapState } from 'vuex'

export default {
  name: 'ProductRecentviewNew',
  languageKeys: ['page_common_recently_viewed', ...ProductModule.languageKeys],
  components: {
    ProductModule
  },
  props: {
    recentlyList: {
      type: Array,
      default: () => []
    },
    fromDialog: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      selectedColor: (state) => state.product.selectedColor,
      baseInfo: (state) => state.product.baseInfo
    }),
    ...mapState('product', ['recentlyViewCurScreens']),
    moduleBindValue({ recentlyList }) {
      return {
        moduleKey: 'recentlyview',
        list: recentlyList,
        title: 'page_common_recently_viewed',
        swiperText: 'recentlyViewdSwiper',
        fromText: 'recentlyview',
        moduleTitle: 'product_recently_viewed',
        ec: 'recentlyview'
      }
    }
  },
  methods: {
    showQuickShopDialog(params) {
      this.$emit('quickShop', params)
    }
  }
}
</script>
