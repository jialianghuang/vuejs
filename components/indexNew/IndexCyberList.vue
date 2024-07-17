<template>
  <section class="index-cyber-list">
    <template v-for="(subItem, moduleIndex) in item.data">
      <a
        :href="countryUrl(subItem.linkUrl)"
        v-track.view.click="{
          common: getBiParams('module title', 'module title' + moduleIndex)
        }"
        :key="`module_${moduleIndex}`"
        class="module-title"
        target="_blank"
      >
        <img :src="addWebpSuffix(subItem.imgUrl)" alt="landingpage" />
      </a>
      <ProductModule :key="moduleIndex" v-bind="productBindValue(subItem, subItem.productList)" />
    </template>
  </section>
</template>

<script>
import indexModuleMixins from '@/assets/js/indexModuleMixins'
import ProductModule from '@/components/product/ProductModule'

export default {
  name: 'IndexCyberList',
  components: { ProductModule },
  mixins: [indexModuleMixins],
  methods: {
    productBindValue(item, list) {
      const key =
        'module_cyber_' +
        item.tabName
          .replace(/ /g, '_')
          .toLowerCase()
          .replace("'", '')
      return {
        moduleKey: key,
        list,
        swiperText: key + '_swiper',
        fromText: key,
        moduleTitle: key,
        el: item.tabName + ' items',
        scene: 'cybermonday'
      }
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec: ec || 'landingpage',
        el: el || 'landingpage'
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.index-cyber-list {
  background-color: #fff;
  margin: 50px 160px;
  .module-title {
    img {
      width: 100%;
      vertical-align: middle;
    }
  }
  .product-module-container {
    margin: 18px auto 50px;
  }
}
</style>
