<template>
  <div v-track.view.click="{ common: getBiParams('Shipin24hrs') }" @click="handleNormalStockChange" class="stock-checkbox">
    <div v-if="!supportStockSales" :class="{ selected: supportStockSales }" class="checkbox-box"></div>
    <div v-else :class="{ selected: supportStockSales }" class="checkbox-box">
      <svg class="icon">
        <use xlink:href="#icon-lby_tick_white_s"></use>
      </svg>
    </div>
    <span>{{ nl(isSpecialCatId(catId) ? 'page_ships_in_time_24' : 'page_ships_in_time') }}</span>
  </div>
</template>
<script>
export default {
  name: 'SupportStockSalesCheckbox',
  languageKeys: ['page_ships_in_time_24', 'page_ships_in_time'],
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
  height: 32px;
  background: @btn-light-hover-color;
  display: inline-block;
  line-height: 32px;
  padding: 0 10px;
  border-radius: 32px;
  margin-top: 4px;
  font-size: 13px;
  cursor: pointer;
  .checkbox-box {
    border: 1px solid var(--color-121212);
    width: 12px;
    height: 12px;
    line-height: 12px;
    display: inline-block;
    margin-right: 3px;
    box-sizing: border-box;
    flex-shrink: 0;
    cursor: pointer;
    vertical-align: middle;
    margin-top: -2px;
    &.selected {
      background: #666;
      border-color: #666;
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
}
</style>
