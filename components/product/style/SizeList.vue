<template>
  <div :class="['size-list', { wgd: isSpecialCatId(catId), 'sod-b': sodDetailVersionFun(baseInfo) }, dressType]">
    <div
      v-track.viewOnce.click="{ id: 'size-' + size.key, common: getCommon(size, baseInfo) }"
      v-for="size in getSizeList"
      :key="size.styleId"
      :class="{
        selected: size.styleId == selectedSizeId || (isSelectedCustom && size.keyStr === 'customSize'),
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
      <div v-if="size.keyStr === 'customSize'" class="custom-size-item">
        <span>{{ size.name }}</span>
        <div
          v-if="!['sample', 'clearance', 'outlet'].includes(baseInfo.dressType) && sizeHoverTip[size.key] && sizeHoverTip[size.key] != ''"
          class="size-tip"
        >
          {{ sizeHoverTip[size.key] }}
        </div>
        <span class="customsize-free-text">{{ nl('page_common_order_free') }}</span>
      </div>
      <div v-else :class="['normal-size-item', { 'one-size-item': Object.keys(getSizeList).length == 1 }]">
        <span>
          <az-icon v-if="supportLocalWarehouseStock(size)" :icon-class="'icon-a-7day1'" class="icon-stock"></az-icon>
          {{ size.shownName }}
        </span>
        <div
          v-if="!['sample', 'clearance', 'outlet'].includes(baseInfo.dressType) && sizeHoverTip[size.key] && sizeHoverTip[size.key] != ''"
          class="size-tip"
        >
          {{ sizeHoverTip[size.key] }}
        </div>
      </div>
    </div>
    <i v-for="i in 10" :key="i"></i>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SizeList',
  languageKeys: ['page_common_order_free', 'page_goods_custom_size'],
  props: {
    selectedSizeId: {
      type: Number,
      default: 0
    },
    sizes: {
      type: Array,
      default: () => []
    },
    hasCustomSize: {
      type: Boolean,
      default: false
    },
    isStockGoods: {
      type: Boolean,
      default: false
    },
    supportStockSales: {
      type: Boolean,
      default: false
    },
    isSelectedCustom: {
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
      baseInfo: (state) => state.product.baseInfo,
      selectedOptions: (state) => state.product.selectedOptions,
      selectedColor: (state) => state.product.selectedColor,
      discountInfoMessage: (state) => state.product.discountInfoMessage,
      selectedSize: (state) => state.product.selectedSize
    }),
    getSizeList() {
      if (this.hasCustomSize) {
        return [
          {
            keyStr: 'customSize',
            key: '',
            name: this.nl('page_goods_custom_size')
          },
          ...this.sizes
        ]
      } else {
        return this.sizes
      }
    },
    bigItem({ baseInfo }) {
      return !['sample', 'clearance', 'outlet'].includes(baseInfo.dressType)
    }
  },
  mounted() {
    this.$nextTick(() => {
      let selectedSize = ''
      selectedSize = localStorage.getItem('SELECTED_SIZE')
      // rts详情有缓存选中尺码时，不选中
      if (this.baseInfo.dressType === 'clearance') selectedSize = ''
      const querySize = this.$route.query.size
      if (selectedSize && !querySize) {
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
        const { size = {}, sizeMap = {} } = this.discountInfoMessage
        // 当服务端请求的数据返回有活动信息的时候，判断当前记录颜色尺码有没有活动
        if (selectedSize && this.baseInfo.activityInfo && size.hasColorId == 1 && selectedSize.styleId != 0) {
          let res = false
          if (sizeMap[selectedSize.styleId]) {
            res = sizeMap[selectedSize.styleId].find((ele) => {
              return ele === this.selectedColor.styleId
            })
          }
          // 如果对应尺码对应颜色没有活动，那么即使有尺码数据记录，也不选中，避免出现页面内容数据闪动情况
          if (!res) {
            selectedSize = ''
          }
        }
      }
      // 进详情页默认选中的size
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
      if (this.outOfStock(size) && !this.hideSize(size)) {
        this.buryPoint(this, 'event', {
          ec: 'sizegrey',
          el: 'sizegrey',
          ea: 'click',
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_id: this.baseInfo.catId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType,
            size: size.key
          })
        })
      }
      this.$emit('select-size', size)
      // todo: 色圈上是否有打折icon，自定义尺码特殊处理id，前后端约定customeStyleId字符串做判断标准
      this.$store.commit('product/setCustomStyleId', '')
      if (size.keyStr === 'customSize') {
        this.$store.commit('product/setCustomStyleId', 'customStyleId')
        this.$store.commit('product/setPlusSizeView', false)
        return
      }
      // 特殊逻辑 点击大码会显示大码图片,
      // jira: 20316, 这些品类[2, 3, 7, 45, 158, 206]不区分样衣 清仓 售罄
      if (!['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType) || [2, 3, 7, 45, 158, 206].includes(this.baseInfo.catId)) {
        this.$store.commit('product/setPlusSizeView', isPlusSizeView)
      }
    },
    outOfStock(size) {
      const flag = this.isStockGoods && !this.stock.includes(size.key)
      if (flag && !this.hideSize(size)) {
        if (!this.viewSize.includes(size.key)) {
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
      if (this.isSpecialCatId(this.baseInfo.catId)) {
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
        el: 'choose',
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
  flex-wrap: wrap;
  i {
    width: 105px;
    height: 0;
    margin-right: 5px;
  }
  .size-item {
    display: block;
    text-align: center;
    text-decoration: none;
    border: 1px solid #cdcdcd;
    margin: 0 5px 10px 0;
    line-height: 11px;
    min-height: 27px;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    .custom-size-item {
      width: 105px;
      .customsize-free {
        position: absolute;
        right: 0;
        top: -10px;
        width: 33px;
        height: 16px;
      }
      .customsize-free-text {
        position: absolute;
        top: -13px;
        right: 0px;
        display: inline-block;
        background: @bg-color;
        min-width: 44px;
        height: 21px;
        line-height: 21px;
        text-align: center;
        text-transform: uppercase;
        padding: 0px 5px;
        box-sizing: border-box;
        font-size: 12px;
        color: @theme-color;
        transform: translateX(15%) scale(0.75);
      }
    }
    .normal-size-item {
      width: 105px;
      &.one-size-item {
        width: unset;
        min-width: 105px;
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
      top: 37px;
      left: 50%;
      transform: translateX(-50%);
      font-family: @font-family-600, sans-serif;
      z-index: 1;
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
    .icon-stock {
      color: var(--color-121212);
    }
    &:hover {
      color: @theme-color;
      border-color: @theme-color;
      .size-tip {
        display: block;
      }
      .icon-stock {
        color: @theme-color;
        fill: currentColor;
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
  &.wgd {
    display: grid;
    grid-template-columns: repeat(auto-fill, 50px);
    gap: 10px;
    .size-item {
      justify-content: center;
      margin: 0;
      min-height: 35px;
    }
    .normal-size-item {
      width: unset;
      &.one-size-item {
        min-width: unset !important;
        width: max-content !important;
      }
    }
    i {
      display: none;
    }
    .size-tip {
      top: 45px;
    }
  }
  // sod B 版本样式
  &.sod-b {
    grid-template-columns: repeat(auto-fill, 55px);
    .size-item {
      min-height: 38px;
      border-color: var(--color-121212);
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
