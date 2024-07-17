<template>
  <az-tab :tabNav="tabNav(productTabList)" @onChange="onTabsChange" :oneNoTab="true" :from="'landingActivity'" class="product-list-block">
    <div
      v-for="(productTabItem, productTabIndex) in productTabList"
      :key="`module_${productTabIndex}`"
      v-track.view.click="{
        common: getBiParams('product module', productTabItem.tabName + ' items')
      }"
    >
      <ProductModule
        v-if="moduleKey + productTabItem.catId + productTabIndex == selectedTab"
        v-bind="productBindValue(productTabItem, productTabItem.productList)"
      />
    </div>
  </az-tab>
</template>
<script>
import AzTab from '@/components/az-ui/AzTab'
import ProductModule from '@/components/product/ProductModule'
export default {
  name: 'LandingActivityList',
  components: { AzTab, ProductModule },
  props: {
    moduleIndex: {
      type: Number,
      default: 0
    },
    productTabList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 该组件出现的场景，区分不同使用场景
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedTab: '' // tab品类切换
    }
  },
  computed: {
    moduleKey() {
      return 'module_' + this.moduleIndex + '_'
    }
  },
  mounted() {
    this.initTab()
  },
  methods: {
    tabNav(list) {
      const tabs = []
      list.forEach((item, index) => {
        tabs.push({
          name: item.tabName,
          key: this.moduleKey + item.catId + index,
          ec: 'product module',
          el: item.tabName
        })
      })
      return tabs
    },
    productBindValue(item, list) {
      const key =
        this.moduleKey +
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
        el: this.scene === 'cybermonday' ? item.tabName + ' items' : null,
        viewMoreInfo: {
          // 显示more
          ec: 'product module',
          el: item.tabName + ' VIEW MORE',
          linkUrl: item.linkUrl
        },
        scene: this.scene
      }
    },
    initTab() {
      this.selectedTab = this.moduleKey + this.productTabList[0].catId + 0
    },
    onTabsChange(key) {
      this.selectedTab = key
    },
    getBiParams(ec, el) {
      if (process.server || this.scene === 'cybermonday') return
      const obj = {
        ec: ec || 'landingpage',
        el: el || 'landingpage'
      }
      return obj
    }
  }
}
</script>
<style scoped></style>
