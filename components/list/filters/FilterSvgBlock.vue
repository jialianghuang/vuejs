<template>
  <div class="filter-body filter-svg-block">
    <div class="filter-svg-wrapper">
      <filter-svg-icon
        v-for="(item, index) in info.values"
        :key="item.value + index"
        v-track.view.click="{ common: getBiParamsWithItem(item) }"
        :selected="item.selected"
        :info="{ ...item, parentValue: info.value }"
        @click="filterSvgClick(item)"
      ></filter-svg-icon>
    </div>
  </div>
</template>

<script>
import FilterSvgIcon from '@/components/list/filters/FilterSvgIcon'
import filtersMixins from '@/assets/js/filters'
export default {
  name: 'FilterSvgImg',
  components: {
    FilterSvgIcon
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
  methods: {
    getBiParamsWithItem(item) {
      return this.getfilterBiParams && this.getfilterBiParams(item, this.info, null)
    },
    filterSvgClick(item) {
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
      this.filterSelectOption(this.info.key, item.key)
    }
  }
}
</script>

<style lang="less" scoped>
.filter-body {
  max-width: 270px;
  padding-top: 10px;
  color: var(--color-121212);
  line-height: 2;
  .filter-svg-wrapper {
    max-width: 265px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 55px);
    gap: 15px;
  }
}
</style>
