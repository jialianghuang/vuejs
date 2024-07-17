<template>
  <div class="filter-body filter-size">
    <div
      v-for="item in sizeList"
      v-track.view.click="{ common: getBiParamsWithItem(item) }"
      :key="item.key"
      v-show="!(info.parentFold && item.fold) || showFlag"
      :class="['simple-filters-item', { wgd: isSpecialCatId(catId), selected: item.selected }]"
    >
      <template v-if="isSpecialCatId(catId)">
        <p @click="clickFilter(item)" class="single-text">{{ item.shownName }}</p>
      </template>
      <template v-else>
        <filter-checkbox
          :selected="item.selected"
          :info="{ ...item, parentKey: info.parentKey, name: item.shownName, multi: info.multi }"
          :hasNumber="false"
          @click="clickFilter(item)"
        ></filter-checkbox>
      </template>
    </div>
    <div
      v-if="info.parentFold && Object.keys(info.values).length % 2 === 1 && showMoreText === 'page_common_new_less'"
      class="simple-filters-item"
    ></div>
    <div v-if="info.parentFold" @click="clickMore" class="more">{{ nl(showMoreText) }}</div>
  </div>
</template>

<script>
import FilterCheckbox from '@/components/list/filters/FilterCheckbox'
import filtersMixins from '@/assets/js/filters'
import { mapState } from 'vuex'
import { setSelectedSizeLocal } from '@/assets/js/commonFun'

export default {
  name: 'FilterSize',
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
      showMoreText: 'page_common_new_more',
      otherMore: false,
      otherApiDressType: ['sample', 'clearance', 'outlet']
    }
  },
  computed: {
    ...mapState('list', ['apiDressType']),
    showList() {
      if (this.showFlag) {
        return this.info.values
      } else {
        const res = JSON.parse(JSON.stringify(this.info.values))
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key]
            if (element.fold) {
              delete res[key]
            }
          }
        }
        return res
      }
    },
    // 所有的尺码数据
    sizeList() {
      if (this.$route.path.includes('/all/final-sale')) {
        const values = Object.values(this.info.values)
        values.sort((a, b) => {
          return a.sort - b.sort
        })
        return values
      } else {
        return this.info.values
      }
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
      // 多品类
      if (this.catIds && this.catIds.length > 1) {
        let catIds = []
        if (item.key.includes('a')) {
          catIds = [7, 45, 158, 8]
        } else if (item.key.includes('j')) {
          catIds = [9]
        } else if (item.key.includes('wd')) {
          catIds = [2]
        } else if (['xs', 's', 'm', 'l', 'xl', '1x', '2x', '3x'].includes(item.key)) {
          catIds = [3, 139]
        }
        for (let index = 0; index < catIds.length; index++) {
          setSelectedSizeLocal(item, catIds[index])
        }
      } else if (this.catId) {
        // 单品类
        setSelectedSizeLocal(item, this.catId)
      }
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
.filter-body {
  max-width: 270px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 0;
  &.filter-size {
    padding-top: 10px;
    /deep/ .filter-checkbox-box {
      margin-top: 0;
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
  .wgd {
    position: relative;
    border: 1px solid #eee;
    box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
    .single-text {
      height: 35px;
      font-size: 13px;
      color: var(--color-121212);
      line-height: 35px;
      text-align: center;
      &:hover {
        color: @theme;
      }
    }
    &.selected {
      border-color: var(--color-121212);
      font-family: @font-family-600;
      &::before {
        content: '';
        width: 24px;
        height: 24px;
        background-color: var(--color-121212);
        position: absolute;
        right: -13px;
        bottom: -13px;
        transform: rotate(45deg);
      }
      &::after {
        content: '';
        width: 4px;
        height: 2px;
        border-left: 1px solid #fff;
        border-bottom: 1px solid #fff;
        border-right: 1px solid transparent;
        border-top: 1px solid transparent;
        transform: rotate(-45deg);
        position: absolute;
        right: 2px;
        bottom: 3px;
      }
    }
    &:hover {
      border-color: var(--color-121212);
    }
  }
}
</style>
