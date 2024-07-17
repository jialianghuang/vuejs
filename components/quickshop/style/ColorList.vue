<template>
  <div :class="['color-list', { 'sod-b': sodDetailVersionFun(baseInfo) }]">
    <div v-if="showSameAsDress" :class="{ selected: sameAsDress }" @click="selectSameAsDress" class="same-as-dress">
      <span class="color">{{ nl('page_goods_same_as_dress') }}</span>
      <div class="style-tip">{{ nl('page_goods_same_as_dress') }}</div>
    </div>
    <div
      v-track.viewOnce.click="{
        id:
          'quickshop-color-' +
          color.key +
          getPromoteValue(selectedSize, color.styleId, discountInfoMessage) +
          supportLocalWarehouseStock(color),
        common: getCommon(color, baseInfo, supportLocalWarehouseStock(color))
      }"
      v-for="color in sodDetailVersionFun(baseInfo) ? colorImageInfo : colors"
      :key="color.styleId"
      :class="{
        selected: selectedColorId == color.styleId && !sameAsDress,
        'hide-color': hideColor(color),
        'bridal-style': isBridal
      }"
      @click="selectColor(color)"
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
        </div>
      </template>
      <template v-else>
        <div v-if="outOfStock(color)" class="color-disabled"></div>
        <span class="bg"></span>
        <span :style="getColorStyle(color.key, null, isBridal)" class="color"></span>
        <az-icon
          v-if="showColorTag(color)"
          :icon-class="'icon-show-color-tag' + getColorType(color.key)"
          class="icon-stock discount-tag"
        ></az-icon>
        <az-icon
          v-if="supportLocalWarehouseStock(color)"
          :icon-class="'icon-a-7day' + getColorType(color.key)"
          class="icon-stock"
        ></az-icon>
      </template>
      <div v-reset-position class="style-tip">
        <span v-if="color.isNew" class="new-color">{{ nl('page_common_new_capital') }}! </span>
        {{ replaceBackslashToAndText(color.name, baseInfo)
        }}<em v-if="supportLocalWarehouseStock(color)" class="theme-color"> {{ nl(shipsInText) }}!</em>
      </div>
    </div>
    <i v-for="i in 20" :key="i - 30"></i>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'
import { mapState } from 'vuex'
export default {
  name: 'ColorList',
  languageKeys: ['page_goods_same_as_dress', 'page_ships_in_time', 'page_ships_in_time_24'],
  directives: {
    'reset-position': {
      inserted(el) {
        // todo: 这个指令只针对quickshop使用， color-hover-parent 类名单独添加做标记用，误删
        const domClientRect = el.getBoundingClientRect()
        const parentDom = document.querySelector('.color-hover-parent')
        const ppppDomClientRect = parentDom && parentDom.getBoundingClientRect()
        if (!parentDom) return
        if (domClientRect.left - 10 <= ppppDomClientRect.left) {
          el.classList.add('left')
        }
        if (domClientRect.right + 15 >= ppppDomClientRect.right) {
          el.classList.add('right')
        }
      },
      unbind(el) {
        el.classList.remove('left')
        el.classList.remove('right')
      }
    }
  },
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
    stockInfo: {
      type: Object,
      default: () => {}
    },
    colorLocalWarehouseStock: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState({
      selectedColor: (state) => state.quickshop.selectedColor,
      baseInfo: (state) => state.quickshop.baseInfo,
      selectedSize: (state) => state.quickshop.selectedSize,
      discountInfoMessage: (state) => state.quickshop.discountInfoMessage,
      colorInfoId: (state) => state.quickshop.colorInfoId,
      customStyleId: (state) => state.quickshop.customStyleId,
      imageInfo: (state) => state.quickshop.imageInfo,
      plusSizeView: (state) => state.quickshop.plusSizeView,
      customSizeSelected: (state) => state.quickshop.customSizeSelected
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
    },
    customStyleId: {
      handler(val) {
        this.colorInfoIdChange()
      }
    }
  },
  mounted() {
    if (!this.isSpecialCatId(this.baseInfo.catId)) {
      this.buryPoint(this, 'event', {
        ...this.getCommon(this.selectedColor, this.baseInfo, this.supportLocalWarehouseStock(this.selectedColor)),
        ea: 'click'
      })
    }
    this.getDiscountinfo()
  },
  methods: {
    selectColor(color) {
      this.$emit('select-color', color)
      this.$emit('mesh-color')
    },
    outOfStock(color) {
      return this.isStockGoods && !this.stock.includes(color.key)
    },
    selectSameAsDress() {
      this.$emit('select-same-as-dress')
    },
    showColorTag(color) {
      return this.colorInfoId.includes(color.styleId)
    },
    async getDiscountinfo() {
      const params = {
        goods_id: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        dress_type: this.baseInfo.dressType,
        from: 'quick-shop'
      }
      // 查询是否有折扣信息
      const result = await this.$axios.$get('/1.0/product/discount-info', { params })
      if (result.code == 0) {
        this.$store.commit('quickshop/setDiscountInfo', result.data)
      }
    },
    colorInfoIdChange() {
      // 选中尺码后更新
      const { colorId = [], size = {}, sizeMap = {} } = this.discountInfoMessage
      const { styleId } = this.selectedSize
      if (size.hasColorId == 1) {
        if (this.customStyleId) {
          return this.$store.commit('quickshop/setColorInfoId', sizeMap[this.customStyleId] || [])
        }
        if (styleId != 0) {
          return this.$store.commit('quickshop/setColorInfoId', sizeMap[styleId] || [])
        }
      }
      return this.$store.commit('quickshop/setColorInfoId', colorId)
    },
    hideColor(color) {
      const { colorMap = {} } = this.stockInfo || {}
      const { allSize = {}, hideSize = {} } = colorMap[color.key] || {}
      if (this.isSpecialCatId(this.baseInfo.catId) && Object.keys(colorMap).length && Object.keys(hideSize).length) {
        return Object.keys(allSize).length === Object.keys(hideSize).length
      }
      return false
    },
    // #18251： 仅对于目的国有库存展示闪电标
    supportLocalWarehouseStock(color) {
      if (this.isSpecialCatId(this.baseInfo.catId) && this.country == 'US') {
        return this.stock.includes(color.key) && !this.customSizeSelected && this.colorLocalWarehouseStock.includes(color.key)
      }
      return (
        this.shipingIn24Hours &&
        this.supportStockSales &&
        this.stock.includes(color.key) &&
        !this.customSizeSelected &&
        !this.isSpecialCatId(this.baseInfo.catId) &&
        this.colorLocalWarehouseStock.includes(color.key)
      )
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
      if (this.isSpecialCatId(baseInfo.catId)) {
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
        el: this.isSpecialCatId(baseInfo.catId) ? 'quickshop' : 'choose',
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
        attr2: this.$route.name + '-quickshop'
      }
      return {
        id: '',
        common: {
          ec: 'shipfast',
          el: 'shipfast',
          msg: JSON.stringify(msg)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.theme-color {
  color: @theme-color;
}
.color-list {
  position: relative;
  padding-top: 6px;
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 23px);
  grid-template-rows: repeat(auto-fit, 23px);
  justify-content: space-between;
  gap: 8px 6px;
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
        display: block;
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
    opacity: 0;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    white-space: nowrap;
    color: #231f1e;
    font-family: @font-family-600, sans-serif;
    z-index: -1;
    width: fit-content;
    height: 0;
    top: 100%;
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
        left: calc(10% - 8px);
        left: 0;
        transform: translateX(4px);
      }
      &::after {
        left: calc(10% - 8px);
        left: 0;
        transform: translateX(4px);
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
  }
  .color-item {
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
    .color-disabled {
      position: absolute;
      width: 100%;
      height: 1px;
      background: #eee;
      transform: rotate(-45deg);
    }
    span {
      width: 25px;
      height: 25px;
      display: block;
      border-radius: 50%;
    }

    &:hover {
      .style-tip {
        opacity: 1;
        height: auto;
        padding: 4px 10px;
        margin-top: 10px;
        z-index: 1;
      }
    }

    &.selected {
      .color {
        width: 19px;
        height: 19px;
      }
      .color-disabled {
        width: 19px;
      }
      .bg {
        border: 1px solid @theme-color;
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
        top: 6px;
      }
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
  &.sod-b {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding-top: 0;
    margin: 10px 0 15px;
    gap: 0;
    .color-item {
      width: 45px;
      // height: fit-content;
      height: 63px;
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
      }
      &.selected {
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
          left: 0px;
          bottom: 0px;
        }
      }
    }
  }
}
</style>
