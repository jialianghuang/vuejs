<template>
  <div class="gallery-filter-box">
    <div v-if="filters.colors && filters.colors.values" class="filters-list filters-list--color">
      <div :class="{ actived: judgeSelected('colors', 'remove_filter') }" class="color-box">
        <span @click="removeFilter('colors')" :style="getColorStyle('all_colors')" class="color-circle"></span>
        <div class="text-tip new-text-tip">
          <span>{{ nl('page_color_all') }}</span>
        </div>
      </div>
      <div v-for="item in filters.colors.values" :key="item.key" :class="{ actived: judgeSelected('colors', item.key) }" class="color-box">
        <span
          @click="handleFilter('colors', item.key)"
          :style="getColorStyle(item.key)"
          :class="{ ['color_type' + getColorType(item.key)]: true }"
          class="color-circle"
        ></span>
        <div class="text-tip new-text-tip">
          <span>
            <a v-if="item.isNew" style="color: var(--color-121212)">{{ nl('page_common_new_capital') }}! </a>{{ nl(item.nameLanguage) }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="filters.category && filters.category.values" class="filters-list">
      <div @click="removeFilter('category')" :class="{ actived: judgeSelected('category', 'remove_filter') }" class="normal-filter-box">
        {{ nl('page_common_all') }}
      </div>
      <div
        v-for="item in filters.category.values"
        :key="item.key"
        :class="{ actived: judgeSelected('category', item.key) }"
        @click="handleFilter('category', item.key)"
        class="normal-filter-box"
      >
        {{ nl(item.nameLanguage) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import colorHex from '@/assets/js/colorHex'
export default {
  name: 'GalleryFilter',
  components: {},
  mixins: [colorHex],
  props: {
    filters: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('styleGallery', ['selectedFilters']),
    selectedFiltersTemp: {
      get() {
        return JSON.parse(JSON.stringify(this.selectedFilters))
      },
      set(newVal) {
        console.log(newVal)
      }
    }
  },
  methods: {
    judgeSelected(filterKey, key) {
      const selected = this.selectedFilters[filterKey]
      if (!(selected && selected.length)) {
        return key === 'remove_filter'
      }
      return selected[0] === key
    },
    handleFilter(filterType, key) {
      this.showSub = ''
      this.selectedFiltersTemp[filterType] = [key]
      this.$store.commit('styleGallery/setSelectedFilters', this.selectedFiltersTemp)
      this.$emit('changeFilter')
    },
    removeFilter(filterType) {
      const key = this.selectedFilters[filterType] ? this.selectedFilters[filterType][0] : null
      if (!key) return false
      if (this.selectedFiltersTemp[filterType].includes(key)) {
        this.selectedFiltersTemp[filterType] = []
        this.$store.commit('styleGallery/setSelectedFilters', this.selectedFiltersTemp)
        this.$emit('changeFilter')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.gallery-filter-box {
  margin-bottom: 12px;
  .filters-list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin: 40px auto 0;
  }
  .filters-list--color {
    margin-bottom: -5px;
  }
  .color-box {
    position: relative;
    margin-right: 11px;
    border-radius: 50%;
    border-bottom: 1px solid #eee;
    width: 49px;
    height: 49px;
    text-align: center;
    &:last-child {
      margin-right: 0;
    }
    .color-circle {
      cursor: pointer;
      background-image: url(~assets/images/a_sprite_color_20190306.png?5770949);
      background-repeat: no-repeat;
      display: inline-block;
      width: 47px;
      height: 47px;
      transform: scale(0.85);
      transition: all 0.2s ease;
      overflow: hidden;
      border-radius: 50%;
      &::before {
        background-image: url(~assets/images/a_sprite_l_20190128.png?5770949);
        background-repeat: no-repeat;
        content: '';
        position: absolute;
        display: none;
        width: 14px;
        height: 10px;
        top: 20px;
        left: 19px;
        transform: scale(1.2);
        background-position: -116px 0;
      }
      &.color_type0::before {
        background-position: -138px 0;
      }
    }
    &.actived {
      .color-circle::before {
        display: block;
      }
    }
    &:hover {
      .color-circle {
        .scale(1);
      }
      .new-text-tip {
        display: block;
      }
    }
  }
  .normal-filter-box {
    margin: 0 25px 10px;
    text-transform: uppercase;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    &.actived {
      color: #c9858e;
      border-bottom-color: #c9858e;
    }
    &:hover {
      color: #c9858e;
      border-bottom-color: #c9858e;
    }
  }
}
</style>
