<template>
  <div :class="['size-list', { 'sod-b': sodDetailVersionFun(baseInfo) }]">
    <div
      v-track.viewOnce.click="{ id: 'quickshop-size-' + size.key, common: getCommon(size, baseInfo) }"
      v-for="size in sizes"
      :key="size.styleId"
      :class="{
        selected: size.styleId == selectedSizeId,
        unavailable: outOfStock(size),
        faceMask: baseInfo.catId == 1504,
        'hide-size': hideSize(size),
        'bridal-style': isBridal
      }"
      @click="selectSize(size, size.isPlusSize)"
      class="size-item need_datalayer"
      data-datalayer-category="PC_DetailPageRevision"
      data-datalayer-label="DetailPageA_Size_Click"
    >
      <div :class="{ 'one-size-item': Object.keys(sizes).length == 1 }" class="normal-size-item">
        <span>
          <az-icon v-if="supportLocalWarehouseStock(size)" :icon-class="'icon-a-7day1'" class="icon-stock"></az-icon>{{ size.shownName }}
        </span>
        <div
          v-if="!['sample', 'clearance', 'outlet'].includes(baseInfo.dressType) && sizeHoverTip[size.key] && sizeHoverTip[size.key] != ''"
          class="size-tip"
        >
          {{ sizeHoverTip[size.key] }}
        </div>
      </div>
    </div>
    <i v-for="i in 10" :key="i" :class="{ faceMaskI: baseInfo.catId == 1504 }"></i>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SizeList',
  props: {
    selectedSizeId: {
      type: Number,
      default: 0
    },
    sizes: {
      type: Array,
      default: () => []
    },
    isStockGoods: {
      type: Boolean,
      default: false
    },
    supportStockSales: {
      type: Boolean,
      default: false
    },
    stock: {
      type: Array,
      default: () => []
    },
    sizeHoverTip: {
      type: Object,
      default: () => {}
    },
    hideSizeMap: {
      type: Object,
      default: () => {}
    },
    // 作用同父组件中的fromDialog
    fromDialog: {
      type: String,
      default: ''
    },
    sizeLocalWarehouseStock: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      viewSize: []
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.quickshop.baseInfo,
      hasInitStock: (state) => state.quickshop.hasInitStock,
      selectedOptions: (state) => state.quickshop.selectedOptions,
      discountInfoMessage: (state) => state.quickshop.discountInfoMessage,
      selectedSize: (state) => state.quickshop.selectedSize,
      selectedColor: (state) => state.quickshop.selectedColor
    })
  },
  mounted() {
    this.$nextTick(() => {
      let selectedSize = ''
      if (this.fromDialog !== 'cartEdit') {
        selectedSize = localStorage.getItem('SELECTED_SIZE')
        if (selectedSize) {
          const tempSelectedSize = JSON.parse(selectedSize)
          if (tempSelectedSize && Array.isArray(tempSelectedSize)) {
            for (let i = 0; i < tempSelectedSize.length; i++) {
              const ele = tempSelectedSize[i]
              if (ele.catId === this.baseInfo.catId) {
                selectedSize = ele.selectedSize
                break
              }
            }
          }
        }
      }
      // 进quickshop默认选中的size
      if (selectedSize || (this.selectedOptions && this.selectedOptions.size)) {
        const currentSize = (selectedSize && selectedSize.key) || this.selectedOptions.size
        const sizeList = this.sizes
        sizeList.forEach((sizeItem) => {
          if (sizeItem.key === decodeURIComponent(currentSize)) {
            // sod 鞋子 之前记录的尺码如果 无库存或者是影藏尺码就不选中
            if ([3, 3102].includes(this.baseInfo.catId) && (this.outOfStock(sizeItem) || this.hideSize(currentSize))) return
            this.selectSize(sizeItem, sizeItem.isPlusSize)
          }
        })
      }
    })
  },
  methods: {
    selectSize(size, isPlusSizeView) {
      const msg = {
        goodsId: this.baseInfo.goodsId,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType,
        cat_id: this.baseInfo.catId,
        size: size.key
      }
      if (this.outOfStock(size) && !this.hideSize(size)) {
        this.buryPoint(this, 'event', {
          ec: 'sizegrey',
          el: 'sizegrey',
          ea: 'click',
          msg: JSON.stringify(msg)
        })
      }
      this.$emit('select-size', size)
      // 特殊逻辑 点击大码会显示大码图片
      if (!['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType) || [2, 3, 7, 45, 158, 206].includes(this.baseInfo.catId)) {
        this.$store.commit('quickshop/setPlusSizeView', isPlusSizeView)
      }
    },
    outOfStock(size) {
      const flag = this.isStockGoods && !this.stock.includes(size.key)
      if (flag && !this.hideSize(size)) {
        if (!this.viewSize.includes(size.key) && this.hasInitStock) {
          this.viewSize.push(size.key)
          this.buryPoint(this, 'event', {
            ec: 'sizegrey',
            el: 'sizegrey',
            ea: 'view',
            msg: JSON.stringify({
              goodsId: this.baseInfo.goodsId,
              cat_id: this.baseInfo.catId,
              cat_name: this.baseInfo.catName,
              dress_type: this.baseInfo.dressType,
              size: size.key
            })
          })
        }
      }
      return flag
    },
    // #18251： 仅对于目的国有库存展示闪电标
    supportLocalWarehouseStock(size) {
      return (
        this.shipingIn24Hours &&
        this.supportStockSales &&
        size &&
        this.stock.includes(size.key) &&
        ![3].includes(this.baseInfo.catId) &&
        this.sizeLocalWarehouseStock.includes(size.key)
      )
    },
    // jira： 17111-wgd 要求部分尺码无库存时不展示
    hideSize(size) {
      return this.hideSizeMap[size.key]
    },
    getCommon(size, baseInfo, ea) {
      const color = this.selectedColor
      const isVersionB = this.sodDetailVersionFun(baseInfo)
      const hasDiscount = this.getPromoteValue(this.selectedSize, color.styleId, this.discountInfoMessage)
      const msg = {
        goodsId: baseInfo.goodsId,
        color: color.key,
        cat_id: baseInfo.catId,
        cat_name: baseInfo.catName,
        dress_type: baseInfo.dressType,
        size: size.key
      }
      if (this.isSpecialCatId(baseInfo.catId)) {
        msg.discount = '0'
        msg.ab = 'a'
      }
      if (isVersionB) {
        msg.ab = 'b'
      }
      if (hasDiscount) {
        msg.discount = '1'
      }
      // fast 闪电标记
      const common = {
        ec: 'size',
        el: this.isSpecialCatId(baseInfo.catId) ? 'quickshop' : 'choose',
        msg: JSON.stringify(msg)
      }
      return common
    }
  }
}
</script>

<style lang="less" scoped>
.size-list {
  display: flex;
  margin-top: 5px;
  flex-wrap: wrap;
  justify-content: space-between;
  i {
    width: 57px;
    height: 0;
    &.faceMaskI {
      width: 77px;
    }
  }
  .size-item {
    display: block;
    text-align: center;
    text-decoration: none;
    border: 1px solid #cdcdcd;
    margin: 0 5px 5px 0;
    line-height: 11px;
    min-height: 25px;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    .normal-size-item {
      width: 50px;
      &.one-size-item {
        width: unset;
        min-width: 50px;
      }
    }
    .size-tip {
      display: none;
      position: absolute;
      width: fit-content;
      white-space: nowrap;
      border: solid 1px #ccc;
      border-radius: 4px;
      padding: 4px 10px;
      line-height: 18px;
      background-color: #fff;
      color: var(--color-121212);
      top: 32px;
      left: 50%;
      transform: translateX(-50%);
      font-family: @font-family-600, sans-serif;
      z-index: 3;
      &::before {
        content: '';
        display: block;
        position: absolute;
        left: calc(50% - 8px);
        top: -8px;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #ccc;
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: calc(50% - 8px);
        top: -7px;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #fff;
      }
    }
    &:hover {
      color: @theme-color;
      border-color: @theme-color;
      .size-tip {
        display: block;
      }
    }
    &.selected {
      color: @theme-color;
      border: 1px solid @theme-color !important;
      .icon-stock {
        color: @theme-color;
        fill: currentColor;
      }
    }
    &.bridal-style {
      &.selected,
      &:hover {
        border-color: var(--color-121212) !important;
        color: var(--color-121212) !important;
        .normal-size-item {
          color: var(--color-121212) !important;
        }
      }
    }
    &.unavailable {
      background: #fff;
      color: #999 !important;
      border: 1px dashed var(--color-cccccc);
      &:hover {
        color: @theme-color;
        border: 1px solid @theme-color;
      }
    }
    &.faceMask {
      width: 70px;
      white-space: nowrap;
    }
    &.hide-size {
      display: none;
    }
  }
  // sod B 版本样式
  &.sod-b {
    justify-content: flex-start;
    gap: 5px;
    .size-item {
      width: 53px;
      min-height: 33px;
      // margin: 0 5px 0 0;
      border-color: var(--color-121212);
      box-sizing: border-box;
      .normal-size-item {
        width: 100%;
      }
      &.selected {
        background-color: @theme-color;
        .normal-size-item {
          color: #fff;
        }
      }
      &.unavailable {
        border-style: solid;
        border-color: #ccc;
        .normal-size-item {
          color: #999;
          width: 100%;
        }
        &.selected {
          background-color: #fff;
          border-color: #ccc !important;
        }
      }
    }
  }
}
</style>
