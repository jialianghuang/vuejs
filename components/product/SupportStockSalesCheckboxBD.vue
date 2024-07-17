<template>
  <div v-track.view.click="{ common: getBiParams('Shipin24hrs') }" @click="handleNormalStockChange" class="stock-checkbox">
    <div v-if="!supportStockSales" :class="{ selected: supportStockSales }" class="checkbox-box"></div>
    <div v-else :class="{ selected: supportStockSales }" class="checkbox-box">
      <svg class="icon">
        <use xlink:href="#icon-lby_tick_white_s"></use>
      </svg>
    </div>
    <az-icon :icon-class="'icon-a-7day1'" class="icon-stock"></az-icon>
    <span>{{ nl('page_ships_in_time') }}</span>
  </div>
</template>
<script>
export default {
  name: 'SupportStockSalesCheckboxBD',
  languageKeys: ['page_ships_in_time'],
  props: {
    supportStockSales: {
      type: Number,
      default: 0
    }
  },
  methods: {
    getBiParams(ec) {
      if (process.server) return
      return {
        ec,
        el: 'button',
        param1: (location && location.href) || '-1',
        msg: JSON.stringify({
          cat_name: this.seoCatName,
          dress_type: this.dressType,
          cat_id: this.catId
        })
      }
    },
    handleNormalStockChange() {
      this.$emit('handleNormalStockChange', this.supportStockSales ? 0 : 1)
    }
  }
}
</script>
<style lang="less" scoped>
.stock-checkbox {
  display: inline-block;
  line-height: 16x;
  padding: 0 7px;
  font-size: 12px;
  cursor: pointer;
  color: @theme-color;
  display: flex;
  align-items: center;
  font-family: @font-family-600;
  .checkbox-box {
    border: 1px solid @theme-color;
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-right: 3px;
    box-sizing: border-box;
    flex-shrink: 0;
    cursor: pointer;
    &.selected {
      background: @theme-color;
      border-color: @theme-color;
    }
    .icon {
      width: 9px;
      height: 9px;
      color: #fff;
      vertical-align: top;
      fill: currentColor;
      overflow: hidden;
      margin: 1px 0 0 1px;
    }
  }
  .icon-stock {
    color: @theme-color;
    fill: currentColor;
    margin-right: 3px;
  }
}
</style>
