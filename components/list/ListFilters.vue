<template>
  <div class="list-filters-box">
    <h2 class="sb-title">
      {{ nl('page_filter_desc') }}
      <a id="filter_clear_all" v-if="filtersClearAllFlag" @click="clickClearFilters" tabindex="0" role="button">{{
        nl('page_common_clear_all')
      }}</a>
    </h2>
    <!-- 选中的filter回显池 -->
    <div :style="{ height: Object.keys(filtersSelected).length ? 'auto' : '20px' }" class="filter_attributes_div">
      <template v-for="(value, key, index) in filtersSelected">
        <selected-filter-item
          v-for="item in value.values"
          :key="item.key + item.value + key + index"
          @click="clickDeleteFilter({ ...item, parentValue: value.value, parentKey: value.key })"
          :filterItem="{ ...item, parentName: value.name, value: value }"
        ></selected-filter-item>
      </template>
      <template v-if="onSale.selected">
        <selected-filter-item @click="handleClearOnSale" :isOnSale="true" :onSaleName="onSale.name"></selected-filter-item>
      </template>
    </div>

    <!-- 21420 sod 改为定制不显示ship in 24 hours -->
    <template v-if="isSpecialCatId(catId) && false">
      <FiltersSodShippingIn24 @handleSodChange="(fastDeliveryDress) => $emit('handleSodChange', fastDeliveryDress)" />
    </template>
    <template v-else>
      <!--  #17628：rush置顶，shipin48h以及Available Sizes  -->
      <filters-extra @handleNormalStockChange="handleNormalStockChange"></filters-extra>
    </template>

    <filters-block
      v-for="(value, name, index) in handleFilters"
      :key="value.key"
      :info="value"
      :bodyShow="!!filtersOpen.length ? filtersOpen.includes(value.key) : index < 4"
    >
    </filters-block>
    <template v-if="isSpecialCatId(catId) && !!shopByStyle.length">
      <FilterShopByStyle :list="shopByStyle" />
    </template>
  </div>
</template>

<script>
import SelectedFilterItem from '@/components/list/filters/SelectedFilterItem'
import FiltersBlock from '@/components/list/filters/FiltersBlock'
import FiltersExtra from '@/components/list/filters/FiltersExtra'
import FiltersSodShippingIn24 from '@/components/list/filters/FiltersSodShippingIn24'
import FilterShopByStyle from '@/components/list/filters/FilterShopByStyle'
import filtersMixins from '@/assets/js/filters'

export default {
  name: 'ListFilters',
  languageKeys: ['page_common_clear_all', 'page_filter_desc', ...FiltersBlock.languageKeys, ...FilterShopByStyle.languageKeys],
  components: {
    SelectedFilterItem,
    FiltersBlock,
    FilterShopByStyle,
    FiltersExtra,
    FiltersSodShippingIn24
  },
  mixins: [filtersMixins],
  data() {
    return {
      viewArr: []
    }
  },
  computed: {
    handleFilters({ apiFilters }) {
      const res = {}
      for (const key in this.filters) {
        if (this.filters.hasOwnProperty(key)) {
          const element = this.filters[key]
          // ignoreKeys： 不会在左侧filter中展示的filter.
          // #17628： rush 改成了开关模式
          let ignoreKeys = ['list_colors_family', 'rush', 'stock_size', 'sale_type']
          if (this.$route.name === 'search') {
            ignoreKeys = ['list_colors_family']
          }
          if (!ignoreKeys.includes(element.key)) {
            // 当apiFilters无内容的时候存在 filter下的子filter都么有商品，需要隐藏
            const keyArr = [
              'category',
              'discountLevel',
              'discount',
              'discountoff',
              'colors_family',
              'length',
              'trend',
              'shop_by_occasion',
              'embellishment',
              'shop_by_category'
            ]
            if (!(keyArr.includes(key) || key.includes('price')) && !Object.keys(apiFilters).length) {
              const tempArr = []
              for (const key in element.values) {
                tempArr.push(element.values[key])
              }
              const flag = tempArr.some((item) => {
                return !!item.number
              })
              if (!flag) continue
            }
            res[key] = element
          }
        }
      }
      return res
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleScroll()
      window.addEventListener('scroll', this.handleScroll)
    })
    this.buryPoint(this, 'event', {
      ec: 'filter',
      el: 'filter',
      ea: 'view',
      msg: JSON.stringify({
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      })
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const ele = document.querySelectorAll('.border-line')
      const screenHeight = window.screen.height
      const len = ele.length
      if (!len) return false
      if (len == this.viewArr.length) {
        // 此时，打点已经全部打完了，就需要注销监听事件
        window.removeEventListener('scroll', this.handleScroll)
      }
      const items = []
      for (let i = 0; i < len; i++) {
        const currentEleHeight = ele[i].getBoundingClientRect().top
        if (!this.viewArr.includes(i) && currentEleHeight < screenHeight) {
          this.viewArr.push(i)
          const obj = {
            ec: 'filter',
            el: this.catBiName + '_filter',
            ea: 'view',
            msg: JSON.stringify({ cat_name: this.catName, dress_type: this.dressType, cat_id: this.catId })
          }
          items.push(obj)
        }
      }
      if (items.length) {
        this.buryPoint(this, 'events', items)
      }
    },
    clickClearFilters() {
      // todo: 清除手动填写的价格
      this.minPrice = ''
      this.maxPrice = ''
      this.clearFilters()
      this.$store.commit('list/setOnSale', false)
      this.$store.commit('list/setSupportStockSales', 0)
      if (this.$route.name === 'search') {
        // 处理手动填写的价格
        this.$store.commit('list/setPriceRange', '')
        this.$nextTick(() => {
          this.handleSearchFilterResult()
        })
      } else {
        this.toNewPath(this.filtersClearAllUrl)
      }
    },
    clickDeleteFilter(item) {
      this.clearFilters(item.parentKey, item.key)
      if (this.$route.name === 'search') {
        // 处理手动填写的价格
        if (item.parentKey.includes('price')) {
          this.$store.commit('list/setPriceRange', '')
        }
        this.$nextTick(() => {
          this.handleSearchFilterResult()
        })
      } else {
        this.toNewPath(item.url)
      }
    },
    handleClearOnSale() {
      this.$store.commit('list/setOnSale', false)
      this.$nextTick(() => {
        this.handleSearchFilterResult()
      })
    },
    handleNormalStockChange(supportStockSales) {
      this.$emit('handleNormalStockChange', supportStockSales)
    }
  }
}
</script>

<style lang="less" scoped>
.list-filters-box {
  margin-bottom: 12px;
  h2.sb-title {
    letter-spacing: 1px;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
    color: var(--color-121212);
    line-height: 22px;
    padding: 0 0 11px 0;
    a {
      margin-top: 1px;
      color: #666;
      text-transform: capitalize;
      float: right;
      text-decoration: underline;
      font-size: 13px;
      font-family: @font-family-600, sans-serif;
      line-height: 1.5;
      letter-spacing: normal;
      cursor: pointer;
    }
  }
  .filter_attributes_div {
    padding-bottom: 10px;
    border-bottom: 1px solid var(--color-cccccc);
  }
}
</style>
