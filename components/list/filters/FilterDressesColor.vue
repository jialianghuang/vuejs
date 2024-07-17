<template>
  <div :class="[{ 'one-line': catId == 2 }, jsKey]" class="filter-body filter-dresses-color">
    <div
      v-for="item in info.values"
      :key="item.key"
      v-track.view.click="{ common: getBiParamsWithItem(item) }"
      :style="{ flex: [3, 3098].includes(catId) ? '50%' : '100%' }"
      v-show="!(info.parentFold && item.fold) || showFlag"
      class="simple-filters-item"
    >
      <filter-color-item :selected="item.selected" :info="item" :hasNumber="false" @click="clickFilter(item)"></filter-color-item>
    </div>
    <div v-if="info.parentFold" @click="clickMore" class="more">{{ nl(showMoreText) }}</div>
  </div>
</template>

<script>
import FilterColorItem from '@/components/list/filters/FilterColorItem'
import filtersMixins from '@/assets/js/filters'
export default {
  name: 'FilterDressesColor',
  components: {
    FilterColorItem
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
      showMoreText: 'page_common_new_more',
      otherMore: false
    }
  },
  created() {
    if (this.filtersShowLess.includes(this.info.value)) {
      this.showMoreText = 'page_common_new_less'
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
      this.filterSelectOption(this.info.key, item.key)
    },
    clickMore() {
      this.otherMore = true
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
.filter-dresses-color {
  &.search {
    width: calc(100% + 20px);
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: -3px;
    &::-webkit-scrollbar-track-piece {
      background: #fff;
    }

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 3px;
    }
    .simple-filters-item {
      overflow: unset;
    }
  }
}
.filter-body {
  max-width: 270px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 7px;
  padding-top: 10px;
  color: var(--color-121212);
  line-height: 2;
  border: 0;
  &.one-line {
    grid-template-columns: unset;
  }
  .simple-filters-item {
    margin-bottom: 5px;
    overflow: hidden;
    white-space: nowrap;
  }
  &.filter-dresses-color {
    .simple-filters-item {
      margin-bottom: 0;
    }
  }
  .more {
    flex: 50%;
    height: 26px;
    margin: 1px 0;
    font-family: @font-family-500, sans-serif;
    font-size: 13px;
    color: #666;
    font-weight: 400;
    cursor: pointer;
    &:hover {
      color: var(--color-121212);
    }
  }
}
</style>
