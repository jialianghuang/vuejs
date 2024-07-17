<template>
  <div :class="['color-list new', { wgd: isSpecialCatId(catId), 'sod-b': sodDetailVersionFun(baseInfo) }]">
    <div v-if="showSameAsDress" :class="{ selected: sameAsDress }" @click="selectSameAsDress" class="same-as-dress">
      <span class="color">{{ nl('page_goods_same_as_dress') }}</span>
      <div class="style-tip">{{ nl('page_goods_same_as_dress') }}</div>
    </div>
    <div
      v-track.viewOnce.click="{
        id: 'color-' + color.key + getPromoteValue(selectedSize, color.styleId, discountInfoMessage) + supportLocalWarehouseStock(color),
        common: getCommon(color, baseInfo, supportLocalWarehouseStock(color))
      }"
      v-for="color in sodDetailVersionFun(baseInfo) ? colorImageInfo : colors"
      :key="color.styleId"
      :class="[
        {
          selected: isCurrentColor(color),
          'hide-color': hideColor(color),
          'bridal-style': isBridal
        },
        'color-' + color.styleId
      ]"
      @click="selectColor(color)"
      @mouseover="resetPosition(color.styleId)"
      class="color-item need_datalayer"
      data-datalayer-category="PC_DetailPageRevision"
      data-datalayer-label="DetailPageA_Color_Click"
    >
      <template v-if="sodDetailVersionFun(baseInfo)">
        <div v-track.view.click="getLightBiParams(baseInfo, supportLocalWarehouseStock(color))" class="color-img-container">
          <div :class="['img-box', { 'out-of-stock': outOfStock(color) }]">
            <img
              :src="require('~/assets/images/default_img.jpg')"
              :data-src="addWebpSuffix(color.imgUrl, false)"
              class="lazyload"
              alt="color img"
            />
          </div>
          <p v-if="getPromoteValue(selectedSize, color.styleId, discountInfoMessage)" class="discount-text">
            -{{ getPromoteValue(selectedSize, color.styleId, discountInfoMessage) }}
          </p>
          <template v-if="supportLocalWarehouseStock(color)">
            <az-icon :icon-class="'icon-a-7day-b-' + getColorType(color.key)" class="icon-stock b"></az-icon>
          </template>
          <client-only>
            <div :class="['style-tip', 'style-tip-' + color.styleId]">
              <span v-if="color.isNew" class="new-color">{{ nl('page_common_new_capital') }}! </span>
              {{ replaceBackslashToAndText(color.name, baseInfo) }}
              <em v-if="supportLocalWarehouseStock(color)" class="theme-color"> {{ nl(shipsInText) }}!</em>
            </div>
          </client-only>
        </div>
      </template>
      <template v-else>
        <div v-if="outOfStock(color)" class="color-disabled"></div>
        <span class="bg"></span>
        <span :style="getColorStyle(color.key, null, isBridal, null, isFromProduct ? color : null)" class="color"></span>
        <div :class="['style-tip', 'style-tip-' + color.styleId]">
          <span v-if="color.isNew" class="new-color">{{ nl('page_common_new_capital') }}! </span>
          {{ replaceBackslashToAndText(color.name, baseInfo) }}
          <em v-if="supportLocalWarehouseStock(color)" class="theme-color"> {{ nl(shipsInText) }}!</em>
        </div>
        <az-icon
          v-if="showColorTag(color)"
          :icon-class="'icon-show-color-tag' + getColorType(color.key)"
          class="icon-stock discount-tag"
        ></az-icon>
        <az-icon
          v-else-if="supportLocalWarehouseStock(color)"
          :icon-class="'icon-a-7day' + getColorType(color.key)"
          class="icon-stock"
        ></az-icon>
        <div
          v-if="supportLocalWarehouseStock(color) && !showColorTag(color) && selectedColorId == color.styleId && !sameAsDress"
          class="icon-stock2"
        >
          <img ref="hashGif" :src="require(`~/assets/images/start.gif`)" alt="hash gif" />
        </div>
      </template>
    </div>
    <!-- Click the purchase color card pop-up window and only add the details page -->
    <div
      @click="handleSwatch"
      v-if="baseInfo.swatchId && showSwatchBtn"
      v-track.viewOnce.click="{ id: `orderaswatch_${baseInfo.goodsId}`, common: getBiParams() }"
      class="swatch-txt"
    >
      {{ hasFreeSwatchCoupon ? nl('page_order_your_free_swatches') : nl('page_goods_order_swatch_btn_text') }}
    </div>
    <i v-for="i in 20" :key="i - 30"></i>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'
import { mapState } from 'vuex'
export default {
  name: 'ColorList',
  languageKeys: [
    'page_goods_same_as_dress',
    'page_ships_in_time',
    'page_order_your_free_swatches',
    'page_goods_order_swatch_btn_text',
    'page_ships_in_time_24'
  ],
  mixins: [colorHex],
  props: {
    colors: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectedColorId: {
      type: Number,
      default: 0
    },
    selectedColorIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    stock: {
      type: Array,
      default: () => {
        return []
      }
    },
    isStockGoods: {
      type: Boolean,
      default: false
    },
    supportStockSales: {
      type: Boolean,
      default: false
    },
    showSameAsDress: {
      type: Boolean,
      default: false
    },
    sameAsDress: {
      type: Boolean,
      default: false
    },
    showSwatchBtn: {
      // 是否展示色卡弹窗入口
      type: Boolean,
      default: false
    },
    stockInfo: {
      type: Object,
      default: () => {}
    },
    colorLocalWarehouseStock: {
      type: Array,
      default: () => {
        return []
      }
    },
    aliasStyleId: {
      type: [String, Number],
      default: 0
    },
    isFromProduct: {
      // 是否来源主商品，主商品用styleInfo里提供的色值
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      datetime: new Date().getTime(),
      timer: null
    }
  },
  computed: {
    ...mapState({
      selectedColor: (state) => state.product.selectedColor,
      baseInfo: (state) => state.product.baseInfo,
      selectedSize: (state) => state.product.selectedSize,
      discountInfoMessage: (state) => state.product.discountInfoMessage,
      colorInfoId: (state) => state.product.colorInfoId,
      customStyleId: (state) => state.product.customStyleId,
      hasFreeSwatchCoupon: (state) => state.userInfo.hasFreeSwatchCoupon,
      imageInfo: (state) => state.product.imageInfo,
      plusSizeView: (state) => state.product.plusSizeView,
      customSizeSelected: (state) => state.product.customSizeSelected
    }),
    colorImageInfo({ colors, imageInfo }) {
      const tempColors = JSON.parse(JSON.stringify(colors))
      const { browserPrefix, goodsGallery } = imageInfo
      for (const key in tempColors) {
        const images = goodsGallery[key].images
        let imgUrl = images[0].imgUrl
        if (this.plusSizeView) {
          const item = images.find((child) => child.isPlus) || images[0]
          imgUrl = item.imgUrl
        }
        tempColors[key].imgUrl = browserPrefix + imgUrl
      }
      return tempColors
    },
    shipsInText({ baseInfo }) {
      if (this.isSpecialCatId(baseInfo.catId)) {
        return 'page_ships_in_time_24'
      }
      return 'page_ships_in_time'
    }
  },
  watch: {
    selectedSize: {
      handler(val) {
        this.colorInfoIdChange()
      },
      immediate: true
    }
  },
  mounted() {
    if (!this.isSpecialCatId(this.baseInfo.catId)) {
      this.buryPoint(this, 'event', {
        ...this.getCommon(this.selectedColor, this.baseInfo, this.supportLocalWarehouseStock(this.selectedColor)),
        ea: 'click'
      })
    }
    this.timer = setInterval(() => {
      this.datetime = new Date().getTime()
    }, 3000)
    this.resetColorItem()
    window.addEventListener('resize', this.resetColorItem)
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
    window.removeEventListener('resize', this.resetColorItem)
  },
  methods: {
    selectColor(color) {
      this.$emit('select-color', color)
      this.$emit('mesh-color')
    },
    outOfStock(color) {
      return this.isStockGoods && !this.stock.includes(color.key)
    },
    supportOutOfStock(color) {
      return this.supportStockSales && !this.stock.includes(color.key)
    },
    // #18251： 仅对于目的国有库存展示闪电标
    supportLocalWarehouseStock(color) {
      if (this.isSpecialCatId(this.baseInfo.catId) && this.country == 'US') {
        return this.stock.includes(color.key) && !this.customSizeSelected && this.colorLocalWarehouseStock.includes(color.key)
      }
      // sod 支持 ship in 24
      return (
        this.shipingIn24Hours &&
        this.supportStockSales &&
        this.stock.includes(color.key) &&
        !this.customSizeSelected &&
        !this.isSpecialCatId(this.baseInfo.catId) &&
        this.colorLocalWarehouseStock.includes(color.key)
      )
    },
    selectSameAsDress() {
      this.$emit('select-same-as-dress')
    },
    showColorTag(color) {
      return this.colorInfoId.includes(color.styleId)
    },
    colorInfoIdChange() {
      // 选中尺码后更新
      const { colorId = [], size = {}, sizeMap = {} } = this.discountInfoMessage
      const { styleId } = this.selectedSize
      if (size.hasColorId == 1) {
        if (this.customStyleId) {
          return this.$store.commit('product/setColorInfoId', sizeMap[this.customStyleId] || [])
        }
        if (styleId != 0) {
          return this.$store.commit('product/setColorInfoId', sizeMap[styleId] || [])
        }
      }
      return this.$store.commit('product/setColorInfoId', colorId)
    },
    handleSwatch() {
      this.$store.commit('product/setShowOrderSwatch', 'fromSwatchId')
    },
    getBiParams() {
      if (process.server) return
      return {
        ec: this.hasFreeSwatchCoupon ? 'orderyourfreeswatch' : 'orderaswatch',
        el: 'orderaswatch',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      }
    },
    resetPosition(id) {
      if (this.sodDetailVersionFun(this.baseInfo)) return
      const el = document.querySelector('.style-tip-' + id)
      el.classList.remove('right')
      const parentDom = document.querySelector('.color-list.new')
      const domClientRect = el.getBoundingClientRect()
      const parentClientRect = parentDom.getBoundingClientRect()
      const right = domClientRect.right >= 1843 || domClientRect.right - 4 >= parentClientRect.right
      if (right) {
        el.classList.add('right')
      }
    },
    resetColorItem() {
      try {
        for (const key in this.colors) {
          this.resetPosition(this.colors[key].styleId)
        }
      } catch (error) {
        console.log(error)
      }
    },
    hideColor(color) {
      if (this.stockInfo) {
        const { colorMap = {} } = this.stockInfo
        const { allSize = {}, hideSize = {} } = colorMap[color.key] || {}
        if (this.isSpecialCatId(this.baseInfo.catId) && Object.keys(colorMap).length && Object.keys(hideSize).length) {
          return Object.keys(allSize).length === Object.keys(hideSize).length
        }
      }
      return false
    },
    getCommon(color, baseInfo, bol) {
      const isVersionB = this.sodDetailVersionFun(baseInfo)
      const hasDiscount = this.getPromoteValue(this.selectedSize, color.styleId, this.discountInfoMessage)
      const msg = {
        goodsId: baseInfo.goodsId,
        color: color.key,
        cat_id: baseInfo.catId,
        cat_name: baseInfo.catName,
        dress_type: baseInfo.dressType
      }
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        msg.discount = '0'
        msg.ab = 'a'
        msg.fast = bol ? '1' : '0'
      }
      if (isVersionB) {
        msg.ab = 'b'
      }
      if (hasDiscount) {
        msg.discount = '1'
      }
      // fast 闪电标记
      const common = {
        ec: 'color',
        el: 'choose',
        msg: JSON.stringify(msg),
        param2: this.versionObj.productColorSort
      }
      return common
    },
    getLightBiParams(baseInfo, bol, version) {
      if (!bol) return {}
      const msg = {
        goodsId: baseInfo.goodsId,
        color: this.selectedColor.key,
        cat_id: baseInfo.catId,
        cat_name: baseInfo.catName,
        dress_type: baseInfo.dressType,
        ab: version || 'A',
        attr2: this.$route.name
      }
      return {
        id: '',
        common: {
          ec: 'shipfast',
          el: 'shipfast',
          msg: JSON.stringify(msg)
        }
      }
    },
    isCurrentColor(color) {
      if ([1000291, 1003269].includes(this.baseInfo.goodsId)) {
        return (this.aliasStyleId == color.aliasStyleId && !this.sameAsDress) || this.selectedColorIds.includes(color.styleId)
      }
      return (this.selectedColorId == color.styleId && !this.sameAsDress) || this.selectedColorIds.includes(color.styleId)
    }
  }
}
</script>

<style lang="less" scoped>
.theme-color {
  text-transform: none;
  color: @theme-color;
}
.color-list {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  justify-content: space-between;
  margin-bottom: 10px;
  // overflow: hidden;
  &.wgd {
    padding-right: 0;
    padding-top: 5px;
    width: 100%;
  }
  i {
    order: 3;
    width: 33px;
    height: 0;
    display: block;
  }
  .same-as-dress {
    margin-right: 8px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    &:hover {
      color: @theme-color;
      .style-tip {
        visibility: visible;
        // z-index: initial;
        left: -10px;
      }
    }
    &.selected {
      .color {
        border: 2px solid #999;
      }
    }
    .color {
      height: 21px;
      line-height: 21px;
      padding: 0 5px;
      border: 1px solid #ccc;
      border-radius: 21px;
    }
  }
  .style-tip {
    text-transform: uppercase;
    position: absolute;
    visibility: hidden;
    // display: none;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 10px;
    white-space: nowrap;
    color: #231f1e;
    font-family: @font-family-600, sans-serif;
    z-index: -1;
    width: fit-content;
    height: auto;
    top: 100%;
    margin-top: 10px;
    .new-color {
      color: @theme-color;
      display: inline;
    }
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
    &.left {
      left: 0;
      &::before {
        left: 0;
        right: unset;
        transform: translateX(2px);
      }
      &::after {
        left: 0;
        right: unset;
        transform: translateX(2px);
      }
    }
    &.right {
      right: 0;
      &::before {
        left: unset;
        right: 0;
        transform: translateX(-2px);
      }
      &::after {
        left: unset;
        right: 0;
        transform: translateX(-2px);
      }
    }
    &.right-bottom {
      right: 0;
      top: unset;
      margin-bottom: 10px;
      bottom: 100%;
      &::before {
        top: 100%;
        left: unset;
        right: 0;
        transform: rotate(180deg);
      }
      &::after {
        top: 100%;
        left: unset;
        right: 0;
        transform: rotate(180deg) translate(0px, 1px);
      }
    }
    &.left-bottom {
      left: 0;
      top: unset;
      margin-bottom: 10px;
      bottom: 100%;
      &::before {
        top: 100%;
        left: 0;
        transform: rotate(180deg) translateX(-1px);
      }
      &::after {
        top: 100%;
        left: 0;
        transform: rotate(180deg) translate(-1px, 1px);
      }
    }
    &.bottom {
      top: unset;
      margin-bottom: 10px;
      bottom: 100%;
      &::before {
        top: 100%;
        left: calc(50% - 8px);
        transform: translateY(1px);
        border-bottom-color: transparent;
        border-top: 8px solid #ccc;
      }
      &::after {
        top: 100%;
        left: calc(50% - 8px);
        border-bottom-color: transparent;
        border-top: 8px solid #fff;
      }
    }
  }
  .color-item {
    margin-right: 7px;
    margin-bottom: 10px;
    cursor: pointer;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    position: relative;
    .bg {
      width: 25px;
      height: 25px;
      position: absolute;
      background-size: cover;
      background-position: center;
    }
    span {
      width: 25px;
      height: 25px;
      display: block;
      border-radius: 50%;
    }

    &:hover {
      .style-tip {
        // display: block;
        visibility: visible;
        z-index: @z-index-2;
      }
    }

    &.selected {
      .color {
        width: 19px;
        height: 19px;
      }
      .bg {
        border: 1px solid @theme-color;
      }
      .color-disabled {
        width: 19px;
      }
    }
    &.bridal-style.selected .bg {
      border-color: var(--color-121212);
    }
    .icon-stock {
      position: absolute;
      fill: currentColor;
      color: #fff;
      &.discount-tag {
        left: 7px;
        top: 7px;
      }
    }
    .icon-stock2 {
      position: absolute;
      fill: currentColor;
      width: 35px;
      height: 35px;
      color: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .az-icon.disabled,
    .az-icon.disabled-selected {
      position: absolute;
      inset: 0;
      width: 25px;
      height: 25px;
    }
    .color-disabled {
      position: absolute;
      width: 100%;
      height: 1px;
      background: #eee;
      transform: rotate(-45deg);
    }
    &.hide-color {
      display: none;
    }
    .shiping-in-24-img {
      position: absolute;
      left: 1px;
      bottom: 1px;
      width: 20px;
    }
  }
  .swatch-txt {
    font-size: 13px;
    line-height: 25px;
    color: #666;
    font-family: @font-family-500;
    text-decoration-line: underline;
    cursor: pointer;
  }
  &.sod-b {
    justify-content: flex-start;
    align-items: center;
    padding-top: 0;
    margin: 15px 0 5px;
    .color-item {
      width: 55px;
      height: fit-content;
      margin-right: 18px;
      .color-img-container {
        border: 1.5px solid transparent;
        position: relative;
        .img-box {
          font-size: 0;
          border: 1.5px solid #ccc;
          img {
            width: 100%;
            // height: 62.5px;
          }
          // 无库存
          &.out-of-stock::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            width: 1px;
            height: 50px;
            background-color: var(--color-121212);
            transform: translate(-50%, -50%) rotate(-30deg);
          }
        }
        // 折扣
        .discount-text {
          position: absolute;
          right: 0;
          top: 0;
          background-color: var(--color-f1e9e6);
          border: 1px solid #fff;
          border-radius: 1px;
          transform: translate(50%, -50%);
          font-family: @font-family-600;
          font-size: 12px;
          color: @theme-color;
        }
        // 闪电
        .icon-stock.b {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 14px;
        }
        .style-tip {
          position: absolute;
          top: 100%;
          margin-top: 10px;
          left: 50% !important;
          transform: translateX(-50%);
        }
      }
      .discount-text {
        position: absolute;
        right: 0;
        top: 0;
        background-color: var(--color-f1e9e6);
        border: 1px solid #fff;
        border-radius: 1px;
        transform: translate(50%, -50%);
        font-family: @font-family-600;
        font-size: 11px;
        color: @theme-color;
      }
      .bg {
        width: 100%;
        height: 100%;
        border-width: 2px;
        box-sizing: border-box;
      }
      .color {
        width: 30px;
        height: 30px;
        border: 2px solid @border-color;
        // box-sizing: border-box;
      }
      &.selected {
        // transform: scale(1.05);
        .color {
          width: 26px;
          height: 26px;
          border-color: #fff;
        }
      }
      .icon-stock {
        transform: translate(-50%, -50%) scale(1.5) !important;
      }
      .icon-stock2 {
        width: 45px;
        height: 45px;
      }
      &.selected {
        .color-img-container {
          border-color: @theme-color;
        }
        .img-box {
          border-color: #fff;
        }
        .shiping-in-24-img {
          left: 0;
          bottom: 0;
        }
      }
    }
  }
}
</style>
