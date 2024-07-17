<template>
  <div v-if="showFiltersExtra" class="filter-extra border-line">
    <!-- rush filter: 改成switch模式 -->
    <div v-if="showRush" class="rush-filter filter-item switch-filter-item">
      <az-switch :value="!!rushValue" @onChange="onRushChange">{{ rushFilter.value }}</az-switch>
    </div>
    <!-- ship in 24h -->
    <div v-if="showShipin" class="ship-in-filter filter-item switch-filter-item">
      <az-switch :value="!!fastDeliveryDress" @onChange="onShipInChange">
        <div class="ship-in-box">
          <az-icon :icon-class="'icon-a-7day1'" class="icon-stock"></az-icon>
          <span>{{ nl('page_ships_in_time_24') }}</span>
        </div>
      </az-switch>
    </div>
  </div>
</template>

<script>
import filtersMixins from '@/assets/js/filters'
import AzSwitch from '@/components/az-ui/AzSwitch'
import { mapState } from 'vuex'
export default {
  name: 'FiltersSodShippingIn24',
  languageKeys: ['page_common_new_more', 'page_common_new_less', 'page_ships_in_time_24'],
  components: {
    AzSwitch
  },
  mixins: [filtersMixins],
  props: {},
  data() {
    return {
      ssFilterBodyFlag: false
    }
  },
  computed: {
    ...mapState('list', ['showFastDeliveryDress']),
    showRush() {
      return this.rushFilter && Object.keys(this.rushFilter).length
    },
    showShipin() {
      return this.showFastDeliveryDress
    },
    showFiltersExtra() {
      return this.showRush || this.showShipin
    },
    rushFilter() {
      let rushFilter = {}
      for (const key in this.filters) {
        if (this.filters[key] && this.filters[key].key === 'rush') {
          rushFilter = this.filters[key]
        }
      }
      return rushFilter
    },
    rushValue() {
      // 这里的switch的开关值跟普通意义上的不一样 ： 产品要求，选中时：相当于选了 yes，没选中时，相当于没选（而不是相当于选了No）
      // 由于 rush 的filter，values返回的是 yes on 的对象，所以这里根据选中结果判断
      let rushValue = false
      if (this.rushFilter.selected) {
        const values = this.rushFilter.values || {}
        for (const key in values) {
          if (values[key] && values[key].selected) {
            rushValue = values[key].key === 'yes'
          }
        }
      }
      return rushValue
    }
  },
  methods: {
    onRushChange(bol) {
      // rush 为 yes的时候， supportStockSales 需要设置为0
      if (bol) {
        this.$store.commit('list/setSupportStockSales', 0)
        this.filterSelectOption(this.rushFilter.key, 'yes')
      } else {
        // 取消选中yes
        this.filterSelectOption(this.rushFilter.key, 'yes')
      }
    },
    onShipInChange(bol) {
      this.$emit('handleSodChange', bol ? 1 : 0)
    }
  }
}
</script>

<style lang="less" scoped>
.filter-extra {
  padding: 20px 0;
  box-shadow: 0 1px 0 var(--color-eeeeee);
  .filter-item {
    margin-top: 10px;
    &.available-sizes-filter {
      margin-top: 15px;
    }
    &:first-child {
      margin-top: 0;
    }
    &.switch-filter-item {
      text-transform: uppercase;
      font-size: 13px;
      line-height: 18px;
      font-family: @font-family-600;
      color: var(--color-121212);
    }
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
}
</style>
