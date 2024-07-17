<template>
  <div class="filter-body filter-normal">
    <div
      v-for="(item, key, index) in info.values"
      :key="['discount', 'discountoff'].includes(info.key) ? item.key + index : item.key"
      class="simple-filters-item"
    >
      <filter-checkbox
        v-show="!(info.parentFold && item.fold) || showFlag"
        :selected="item.selected"
        :info="{ ...item, multi: info.multi }"
        v-track.view.click="{ common: getBiParamsWithItem(item) }"
        :hasNumber="false"
        @click="clickFilter(item)"
      ></filter-checkbox>
    </div>
    <div v-if="info.parentFold" @click="clickMore" class="more">{{ nl(showMoreText) }}</div>
  </div>
</template>

<script>
import FilterCheckbox from '@/components/list/filters/FilterCheckbox'
import filtersMixins from '@/assets/js/filters'
export default {
  name: 'FilterNormal',
  languageKeys: ['page_common_new_more', 'page_common_new_less'],
  components: {
    FilterCheckbox
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
      //  /all/final-sale  页面 discount选项如果已经选中，再次点击，不能被反选
      if (this.$route.path && this.$route.path.includes('/all/final-sale') && ['discount'].includes(this.info.parentKey) && item.selected) {
        return false
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
