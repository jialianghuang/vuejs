<template>
  <div v-if="info.options" class="filter-body">
    <div class="family-block">
      <div
        v-for="(value, key) in info.options"
        :key="value.name"
        :class="[`family-${value.name.toLowerCase()}`, { cur: colorKey === key }]"
        @click="colorClick(key)"
        class="family-sample"
      ></div>
    </div>
    <div
      v-for="item in colorOptions"
      :key="item.key"
      v-track.view.click="{ common: getBiParamsWithItem(item) }"
      class="simple-filters-item"
    >
      <filter-color-item
        :selected="filterIsSelected(item.key, info.key)"
        :info="item"
        :hasNumber="false"
        @click="clickFilter(arguments, item)"
      ></filter-color-item>
    </div>
  </div>
</template>

<script>
import FilterColorItem from '@/components/list/filters/FilterColorItem'
import filtersMixins from '@/assets/js/filters'
export default {
  name: 'FilterColor',
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
      colorKey: -1,
      colorOptions: []
    }
  },
  created() {
    for (const key in this.info.options) {
      if (this.info.options.hasOwnProperty(key)) {
        const options = this.info.options[key].options
        options.forEach((item) => {
          item.class = item.name
            .toLowerCase()
            .split(' ')
            .join('_')
        })
      }
    }
  },
  methods: {
    colorClick(key) {
      this.colorKey = key
      this.colorOptions = this.info.options[key].options
    },
    getBiParamsWithItem(item) {
      return this.getfilterBiParams && this.getfilterBiParams(item, null, 'color')
    },
    clickFilter(val, item) {
      if (!val[0]) {
        this.addFilters(item.key, this.info.key)
      } else {
        this.deleteFilters(item.key, this.info.key)
      }
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
  .family-block {
    margin-top: 4px;
    font-size: 0;
    margin-bottom: 6px;
    .family-sample {
      display: inline-block;
      vertical-align: top;
      width: 15px;
      height: 24px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
      &:first-child {
        border-left: 1px solid #ccc;
      }
      &:last-child {
        border-right: 1px solid #ccc;
      }
      &.cur {
        width: 18px;
        height: 32px;
        margin-top: -1px;
        border-width: 0;
        background: url(~assets/images/list/a_sprite_l_20190128.png) 0 -411px no-repeat;
      }
      &.family-pink {
        background-color: #ffbbc9;
      }
      &.family-red {
        background-color: var(--color-ff0000);
      }
      &.family-orange {
        background-color: #ff9000;
      }
      &.family-yellow {
        background-color: #fcf02b;
      }
      &.family-green {
        background-color: #3fdc08;
      }
      &.family-blue {
        background-color: #15ecff;
      }
      &.family-purple {
        background-color: #7603b2;
      }
      &.family-brown {
        background-color: #82440c;
      }
      &.family-neutral {
        background-color: #f3e1c4;
      }
      &.family-white {
        background-color: #ffffff;
      }
      &.family-grey {
        background-color: #969696;
      }
      &.family-black {
        background-color: var(--color-121212);
      }
    }
  }
  .simple-filters-item {
    margin-bottom: 5px;
  }
}
</style>
