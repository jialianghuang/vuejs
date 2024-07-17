<template>
  <div :class="{ isCollection: $route.path.includes('/collection/all') }" class="filter-body filter-category">
    <div
      v-for="item in info.values"
      :key="item.key"
      v-track.view.click="{ common: getBiParamsWithItem(item) }"
      v-show="!(info.parentFold && item.fold) || showFlag"
      class="simple-filters-item"
    >
      <filter-checkbox
        :selected="item.selected"
        :info="{ ...item, multi: info.multi }"
        :hasNumber="false"
        @click="clickChangeCategory(item)"
      ></filter-checkbox>
    </div>
    <div v-if="info.parentFold" @click="clickMore" class="more">{{ nl(showMoreText) }}</div>
  </div>
</template>

<script>
import FilterCheckbox from '@/components/list/filters/FilterCheckbox'
import filtersMixins from '@/assets/js/filters'
export default {
  name: 'FilterCategory',
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
  },
  methods: {
    getBiParamsWithItem(item) {
      return this.getfilterBiParams && this.getfilterBiParams(item, this.info, null)
    },
    clickChangeCategory(item) {
      if (!item.selected) {
        this.filterSelectOption(this.info.key, item.key)
        const msg = {
          cat_name: item.value,
          dress_type: item.dressType || this.dressType,
          name: item.name
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
          msg: JSON.stringify(msg)
        })
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
  .simple-filters-item:not(:last-child) {
    margin-bottom: 10px;
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
.isCollection {
  .more {
    display: block !important;
  }
}
</style>
