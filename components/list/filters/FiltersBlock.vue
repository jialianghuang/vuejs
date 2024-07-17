<template>
  <div
    v-if="!!Object.keys(info.values).length && !(isCategory && isBridal && ['ready-to-ship-brides', 'sample-brides'].includes(apiCatName))"
    :class="{ 'filter-size-block': info.key == 'size' }"
    class="border-line"
  >
    <div :class="{ 'left-color32-filter': info.value === 'color' }">
      <h5 @click="filterBodyShowEvent" class="expanded">
        <p class="expanded-title">
          <span>{{ info.value }}</span>
          <span v-if="info.selectedCount">({{ info.selectedCount }})</span>
        </p>
        <template v-if="filterBodyFlag">
          <svg class="filter-title-delete">
            <use xlink:href="#icon-lby_add"></use>
          </svg>
        </template>
        <template v-else>
          <svg class="filter-title-add">
            <use xlink:href="#icon-lby_subtraction"></use>
          </svg>
        </template>
      </h5>
      <template v-if="filterBodyFlag">
        <!-- category -->
        <filter-category
          v-if="isCategory"
          :info="{ key: info.key, values: info.values, value: info.value, bodyShow, parentFold: info.fold }"
        ></filter-category>
        <!-- price -->
        <filter-price
          v-else-if="isFilterPrice(info)"
          :originInfo="{
            parentFold: info.fold,
            parentKey: info.key,
            ...info
          }"
        ></filter-price>
        <!-- svg 显示 -->
        <filter-svg-block
          v-else-if="isImgFilter && catId != 6"
          :info="{ key: info.key, values: info.values, value: info.key, bodyShow }"
        ></filter-svg-block>
        <!--color、colors、 colors_family -->
        <filter-dresses-color
          v-else-if="info.key === 'colors_family' || info.key === 'colors' || info.key === 'color'"
          :info="{ key: info.key, values: info.values, value: info.value, bodyShow, parentFold: info.fold }"
        ></filter-dresses-color>
        <!-- size -->
        <filter-size
          v-else-if="info.key === 'size'"
          :info="{ key: info.key, values: info.values, value: info.value, parentFold: info.fold, parentKey: info.key, multi: info.multi }"
        ></filter-size>
        <!-- 普通的filter -->
        <filter-normal v-else v-bind="filterNormalBindValue"></filter-normal>
      </template>
    </div>
  </div>
</template>

<script>
import FilterCategory from '@/components/list/filters/FilterCategory'
import FilterNormal from '@/components/list/filters/FilterNormal'
import FilterSize from '@/components/list/filters/FilterSize'
import FilterPrice from '@/components/list/filters/FilterPrice'
import FilterSvgBlock from '@/components/list/filters/FilterSvgBlock'
import FilterDressesColor from '@/components/list/filters/FilterDressesColor'
import filtersMixins from '@/assets/js/filters'

export default {
  name: 'FiltersBlock',
  languageKeys: [...FilterPrice.languageKeys, ...FilterNormal.languageKeys],
  components: {
    FilterCategory,
    FilterNormal,
    FilterSize,
    FilterPrice,
    FilterSvgBlock,
    FilterDressesColor
  },
  mixins: [filtersMixins],
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    bodyShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterBodyFlag: false
    }
  },
  computed: {
    isCategory() {
      return ['category', 'events'].includes(this.info.key)
    },
    isImgFilter({ catId }) {
      // 做个兼容key  straps_&_sleeves
      let list = ['length', 'straps_sleeves', 'straps_&_sleeves', 'neckline', 'silhouette', 'back_style', 'shop_by_shape']
      // sod 定制length不显示图片 显示文案
      if (this.catId == 3110) {
        list.shift()
      }
      // jira:17527 sod调整neckline做成 checkbox
      // 搜索结果页如果选中sod也需要调整
      if (this.isSpecialCatId(catId) || (this.$route.name === 'search' && this.$route.query.category === 'dresses')) {
        list.splice(3, 1)
      }
      // 6分类(wedding_veils)不走svg
      if (this.$route.name === 'search' && this.$route.query.category === 'wedding_veils') {
        list = []
      }
      return list.includes(this.info.key)
    },
    filterNormalBindValue({ finalInfo, info, apiFilters }) {
      const values = JSON.parse(JSON.stringify(info.values))
      if (finalInfo.isFinalSale && ['discountLevel', 'discount', 'discountoff'].includes(info.key)) {
        for (const key in values) {
          values[key].showNumber = true
          // todo: 此类别暂时无，这里做禁止选择处理
          if (key == 'last_chance_deals') {
            values[key].number = 0
          } else {
            values[key].number = 1
          }
        }
      }
      // 普通filter绑定数据
      let parentFold = info.fold
      const hasGoods = []
      for (const key in values) {
        if (values[key].number) {
          hasGoods.push(values[key])
        }
      }
      if (Object.keys(apiFilters).length == 0) {
        parentFold = info.fold && hasGoods.length > 5
      }
      return {
        info: {
          ...info,
          values,
          value: info.value,
          parentFold,
          parentKey: info.key
        }
      }
    }
  },
  created() {
    // 修复强制在这里判断 isWGD 则强制改为ture导致的store的数据和页面展示不符的bug
    this.filterBodyFlag = this.bodyShow
  },
  methods: {
    filterBodyShowEvent() {
      const arr = JSON.parse(JSON.stringify(this.filtersOpen))
      if (this.filterBodyFlag) {
        const index = arr.indexOf(this.info.key)
        if (index > -1) {
          arr.splice(index, 1)
        }
      } else {
        arr.push(this.info.key)
      }
      this.$store.commit('list/setFiltersOpen', arr)
      this.filterBodyFlag = !this.filterBodyFlag
    },
    isFilterPrice(info) {
      const priceArr = [
        'price',
        'pricecadca',
        'priceaudau',
        'pricegbpgb',
        'priceeurfr',
        'pricemxnmx',
        'priceeurde',
        'priceeures',
        'priceeurit',
        'priceeurie',
        'priceeurnl',
        'priceeurbe'
      ]
      return priceArr.includes(info.key)
    }
  }
}
</script>

<style lang="less" scoped>
.border-line {
  box-shadow: 0 1px 0 var(--color-eeeeee);
  padding: 20px 0;
  .expanded {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: @font-family-600, sans-serif;
    font-size: 13px;
    line-height: 18px;
    text-transform: uppercase;
    color: var(--color-121212);
    cursor: pointer;
    .expanded-title {
      :not(:first-child) {
        margin-left: 3px;
      }
    }
    .filter-title-delete,
    .filter-title-add {
      width: 10px;
      height: 10px;
      margin-right: 20px;
      color: #666;
      vertical-align: middle;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
