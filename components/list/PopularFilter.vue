<template>
  <div v-track.view.click="getBiCommonParams('popularfilter', 'popularfilter')" class="simple-filters-box">
    <div class="simple-filters-group">
      <div class="group-title">{{ nl('page_common_popular_filters') }}</div>
      <div class="group-content" style="padding-bottom: 15px;">
        <div
          v-for="item in popularFilters"
          :key="item.key"
          v-track.view="{ common: getBiParamsWithItem(item) }"
          class="simple-filters-item"
        >
          <div v-track.view.click="getBiCommonParams('popularfilter', catBiName + '_popular filter', null, item)">
            <filter-checkbox :selected="false" :hasNumber="false" :info="item" @click="clickFilter(item)"></filter-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div v-if="filtersClearAllFlag" class="simple-filters-group">
      <div class="group-title">
        {{ nl('page_common_selected_filters')
        }}<a @click="clickClearFilters" class="clear-all-filters-btn">{{ nl('page_common_clear_all') }}</a>
      </div>
      <div class="group-content" style="padding-left: 0;">
        <template v-for="value in filtersSelected">
          <selected-filter-item
            v-for="item in value.values"
            :key="item.key + item.value"
            @click="clickDeleteFilter({ ...item, parentValue: value.value })"
            :filterItem="{ ...item, parentName: value.name, value: value }"
          ></selected-filter-item>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import FilterCheckbox from '@/components/list/filters/FilterCheckbox'
import SelectedFilterItem from '@/components/list/filters/SelectedFilterItem'
import filtersMixins from '@/assets/js/filters'
import { mapState } from 'vuex'

export default {
  name: 'PopularFilter',
  languageKeys: ['page_common_popular_filters', 'page_common_selected_filters', 'page_common_clear_all'],
  components: {
    FilterCheckbox,
    SelectedFilterItem
  },
  mixins: [filtersMixins],
  data() {
    return {}
  },
  computed: {
    ...mapState('list', ['simpleFilters'])
  },
  watch: {
    headerFixed(newVal, oldVal) {
      this.$nextTick(() => {
        this.getTop()
      })
    }
  },
  mounted() {
    this.getTop()
  },
  methods: {
    getTop() {
      const headerNavDom = document.getElementById('header-nav')
      const headerDom = document.getElementsByClassName('sticky-header')[0]
      if (headerNavDom) {
        const headerNavDomHeight = headerNavDom && headerNavDom.offsetHeight
        const headerDomHeight = headerDom && headerDom.offsetHeight
        this.$emit('sticky-top', (this.headerFixed ? headerNavDomHeight : headerDomHeight) + 50)
      }
    },
    getBiParamsWithItem(item) {
      return this.getfilterBiParams && this.getfilterBiParams(item, null, 'popular filter')
    },
    clickFilter(item) {
      this.clickFilterSetPoint && this.clickFilterSetPoint(item, null, 'popular filter')
      this.toNewPath(item.url)
      this.$emit('selectedFilter')
    },
    clickDeleteFilter(item) {
      this.toNewPath(item.url)
      this.$emit('selectedFilter')
    },
    clickClearFilters() {
      this.toNewPath(this.filtersClearAllUrl)
      this.$emit('selectedFilter')
    }
  }
}
</script>

<style lang="less" scoped>
.simple-filters-box {
  // position: sticky;
  // top: 66px;
  z-index: 1;
  box-sizing: border-box;
  padding: 0 8px 0 12px;
  background-color: #fff;
  box-shadow: 0px 0px 5px 0px rgba(51, 51, 51, 0.3);
  .simple-filters-group {
    border-top: 1px solid #ccc;
    &:nth-of-type(1) {
      border-top: 0;
    }
    .group-title {
      font-family: @font-family-600, sans-serif;
      font-size: 16px;
      color: var(--color-121212);
      line-height: 1.5;
      text-transform: uppercase;
      padding: 20px 0 10px;
      .clear-all-filters-btn {
        margin-top: 2px;
        float: right;
        color: #666;
        text-transform: capitalize;
        text-decoration: underline;
        font-family: @font-family-600, sans-serif;
        font-size: 13px;
        line-height: 1.5;
        letter-spacing: normal;
        cursor: pointer;
      }
    }
    .group-content {
      padding-left: 3px;
      padding-bottom: 20px;
    }
  }
}
</style>
