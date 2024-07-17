<template>
  <div class="filter-body filter-normal">
    <az-switch :value="info" :label="'test'" @onChange="onChange"></az-switch>
  </div>
</template>

<script>
import AzSwitch from '@/components/az-ui/AzSwitch'
import filtersMixins from '@/assets/js/filters'
export default {
  name: 'FilterSwitch',
  languageKeys: [],
  components: {
    AzSwitch
  },
  mixins: [filtersMixins],
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showFlag: false,
      showMoreText: 'page_common_new_more'
    }
  },
  created() {
    if (this.filtersShowLess.includes(this.info.value)) {
      this.showMoreText = 'page_common_new_less'
      this.showFlag = true
    }
    if (this.isSpecialCatId(this.catId)) {
      this.clickMore()
      this.showFlag = true
    }
  },
  methods: {
    getBiParamsWithItem(item) {
      return this.getfilterBiParams && this.getfilterBiParams(item, this.info, null)
    },
    clickFilter(item) {
      const msg = {
        cat_name: this.seoCatName,
        cat_id: this.catId,
        dress_type: this.dressType
      }
      this.buryPoint(this, 'event', {
        ec: 'filter',
        el: 'filter',
        ea: 'click',
        msg: JSON.stringify(msg)
      })
      this.buryPoint(this, 'event', {
        ec: 'filter',
        el: this.catBiName + '_filter',
        ea: 'click',
        msg: JSON.stringify({ ...msg, name: item.name })
      })
      // comments: 如果是finalsale且是discountLevel 走对应的映射地址
      const { isFinalSale, finalSaleCategoryMap } = this.finalInfo
      if (isFinalSale && ['discountLevel', 'discount', 'discountoff'].includes(this.info.parentKey)) {
        const categoryMap = finalSaleCategoryMap[item.key]
        const { values } = this.filters.category
        let tempUrl = null
        if (this.$route.path.includes('/all/final-sale')) {
          tempUrl = '/all/final-sale'
        } else {
          for (const key in values) {
            if (values[key].selected) {
              tempUrl = categoryMap[key]
            }
          }
        }
        if ([7, 5, 1.5, 9, 10].includes(item.value)) {
          tempUrl = tempUrl + '/with' + this.discountType + item.value
        }
        this.filterSelectOption(this.info.key, item.key, tempUrl || `/404?originUrl=${encodeURIComponent(this.$route.path)}`)
      } else {
        this.filterSelectOption(this.info.key, item.key)
      }
    },
    clickMore() {
      this.showMoreText = this.showMoreText === 'page_common_new_more' ? 'page_common_new_less' : 'page_common_new_more'
      this.showFlag = !this.showFlag
      const arr = JSON.parse(JSON.stringify(this.filtersShowLess))
      if (!this.showFlag) {
        const index = arr.indexOf(this.info.value)
        if (index > -1) {
          arr.splice(index, 1)
        }
      } else {
        arr.push(this.info.value)
      }
      this.$store.commit('list/setFiltersShowLess', arr)
    }
  }
}
</script>

<style lang="less" scoped>
.filter-body {
  max-width: 270px;
  color: var(--color-121212);
  line-height: 2;
  border: 0;
  padding-top: 10px;
  .more {
    margin-top: 10px;
    font-family: @font-family-500, sans-serif;
    font-size: 13px;
    color: #666;
    font-weight: 400;
    cursor: pointer;
    &:hover {
      color: @theme-color;
    }
  }
  .simple-filters-item:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
