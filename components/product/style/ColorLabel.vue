<template>
  <div ref="colorLabel" :class="['color-label', { wgd: isSpecialCatId(catId), showSmallStyle: showSmallStyle }, `language-${language}`]">
    <div ref="colorTitle" class="color-title">
      <span v-if="!isSpecialCatId(catId)">{{ nl(type) }}:</span>
      <template v-if="showColorName">
        <span class="color-name">{{ replaceBackslashToAndText(selectedColor.name, baseInfo) }}</span>
        <span v-if="selectedColor.isNew" class="new-color">{{ nl('page_common_new_capital') }}!</span>
      </template>
      <div v-if="isCurrentStyleSupportStock && colorLocalWarehouseStock.includes(selectedColor.key)" class="new-color-tag">
        <template v-if="shipingIn24Hours && ![3].includes(baseInfo.catId)">
          <span>{{ nl('page_ships_in_time') }}</span>
          <span class="clip-path"></span>
        </template>
        <template v-else-if="isSpecialCatId(baseInfo.catId) && country == 'US'">
          <span>{{ nl('page_ships_in_time_24') }}</span>
          <span class="clip-path"></span>
        </template>
      </div>
      <span v-if="colorChart.image && colorChart.image.length" @click="clickColorChart" class="color-chart">
        ({{ nl('page_lining_color_chart') }})
      </span>
    </div>
    <div v-if="showSampleSwatch" @click="orderSwatch" class="sample-swatch">
      (<img v-if="!$store.state.isBridal" src="~assets/images/product/sample-swatch_20190128.png" alt="sample swatch" />
      <img v-else src="~assets/images/product/coupon.svg" alt="sample swatch" />
      <span class="order-swatch">{{ nl('page_common_color_ques') }}</span
      >)
    </div>
    <!-- 因为这个按钮会在客户端的时候才确认样式，所以设置在客户端渲染 -->
    <client-only>
      <div
        @click="handleSwatch"
        v-if="baseInfo.swatchId && showSwatchBtn && false"
        v-track.viewOnce.click="{ id: `orderaswatch_${baseInfo.goodsId}`, common: getBiParams() }"
        class="swatch-txt"
      >
        {{ hasFreeSwatchCoupon ? nl('page_order_your_free_swatches') : nl('page_goods_order_swatch_btn_text') }}
      </div>
    </client-only>
    <a
      ref="shopMore"
      v-if="!isComingSoon && baseInfo.dressType == 'dress' && !isSashColor && !fromDialog && baseInfo.catId != 1504"
      :href="countryUrl(shopMore)"
      @click="swatchPoint"
      v-text="shopMoreText"
      target="_blank"
      class="need_datalayer shop-more"
      data-datalayer-category="PC_DetailPageRevision"
      data-datalayer-label="DetailPageA_ShopMoreInThisColor_Click"
    ></a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ColorLabel',
  languageKeys: [
    'page_common_color_ques',
    'page_common_sash_color',
    'page_goods_dress_color',
    'page_veil_color',
    'page_swatch_shop_bridemaid',
    'page_swatch_shop_dress',
    'page_goods_shop_more_color',
    'page_shop_wedding_dresses_color',
    'page_ships_in_time_24',
    'page_lining_color_chart',
    'page_swatch_shop_bridemaid',
    'page_shop_more_mbd',
    'page_common_color_for_bd',
    'page_common_color_for_mob',
    'page_order_your_free_swatches',
    'page_goods_order_swatch_btn_text'
  ],
  props: {
    selectedColor: {
      type: Object,
      default: () => {
        return {}
      }
    },
    shopMore: {
      type: String,
      default: ''
    },
    isDress: {
      type: Boolean,
      default: true
    },
    isSashColor: {
      type: Boolean,
      default: false
    },
    fromDialog: {
      type: String,
      default: ''
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    colorLocalWarehouseStock: {
      type: Array,
      default: () => {
        return []
      }
    },
    showSwatchBtn: {
      // 是否展示色卡弹窗入口
      type: Boolean,
      default: false
    },
    showText: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    labelType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showSmallStyle: false
    }
  },
  computed: {
    ...mapState('product', ['isCurrentStyleSupportStock', 'colorChart']),
    ...mapState('userInfo', ['hasFreeSwatchCoupon']),
    type() {
      if (this.showText) {
        return this.showText
      }
      if (this.isSashColor) {
        return 'page_common_sash_color'
      } else if (this.isDress) {
        return 'page_goods_dress_color'
      } else if (this.baseInfo.catId == 6) {
        return 'page_veil_color'
      } else if (this.baseInfo.catId == 6 && this.from) {
        return 'page_veil_color'
      }
      return 'page_common_color'
    },
    shopMoreText() {
      if (this.text) {
        return this.nl(this.text)
      }
      if (this.baseInfo.goodsId == 1000291) {
        this.setPointText('shopbridesmaiddressesinthiscolor', 'view')
        return this.nl('page_swatch_shop_bridemaid')
      } else if (this.baseInfo.goodsId == 1000354) {
        this.setPointText('shopweddingdressesinthiscolor', 'view')
        return this.nl('page_shop_wedding_dresses_color')
      } else if (this.baseInfo.catId == 33 || this.baseInfo.catId == 36) {
        this.setPointText('shopdressesinthiscolor', 'view')
        return this.nl('page_swatch_shop_dress')
      } else {
        this.setPointText('shopmoreinthiscolor', 'view')
        return this.nl('page_goods_shop_more_color')
      }
    },
    showSampleSwatch() {
      const isTrue = [7, 8, 9, 158, 45].includes(this.baseInfo.catId) && this.baseInfo.dressType == 'sample' && !this.isSashColor
      if (isTrue) {
        this.setPointColor(`can'tfind`, 'view')
      }
      return isTrue
    },
    showColorName({ selectedColor, baseInfo, labelType }) {
      if ([1000291, 1003269].includes(baseInfo.goodsId)) {
        if (labelType == 'mob') {
          return selectedColor.styleId !== selectedColor.aliasStyleId && selectedColor.aliasStyleId.includes('mob')
        } else {
          return selectedColor.styleId == selectedColor.aliasStyleId || selectedColor.aliasStyleId.includes('bd')
        }
      }
      return true
    }
  },
  created() {
    if (process.client) {
      this.getStyleClass()
    }
  },
  mounted() {
    // 解决多语言内容过长导致显示错乱问题
    // 计算当前内容的宽度，如果两个节点的宽度相加超过容器宽度，说明内容过长，这时，a标签移到下一行
    if (this.$refs.colorLabel && this.$refs.colorTitle && this.$refs.shopMore) {
      // 兼容下报错
      const labelClientWidth = this.$refs.colorLabel.clientWidth // 容器视图总宽度
      const titleClientWidth = this.$refs.colorTitle.clientWidth
      const moreClientWidth = this.$refs.shopMore.clientWidth
      if (labelClientWidth < titleClientWidth + moreClientWidth) {
        this.$refs.colorLabel.style.height = '40px'
        this.$refs.shopMore.style.left = 0
        this.$refs.shopMore.style.bottom = 0
      }
    }
    window.addEventListener('resize', () => {
      this.getStyleClass()
    })
  },
  methods: {
    // 点击本文标签，弹出color chart配图
    clickColorChart() {
      this.$store.commit('product/setColorChartShow', true)
    },
    swatchPoint() {
      switch (this.shopMoreText) {
        case this.nl('page_goods_shop_more_color'):
          this.setPointText('shopmoreinthiscolor', 'click')
          break
        case 'Shop dresses in this color':
          this.setPointText('shopdressesinthiscolor', 'click')
          break
        case 'Shop wedding dresses in this color':
          this.setPointText('shopweddingdressesinthiscolor', 'click')
          break
        case this.nl('page_swatch_shop_bridemaid'):
          this.setPointText('shopbridesmaiddressesinthiscolor', 'click')
          break
      }
    },
    setPointText(el, type) {
      this.buryPoint(this, 'event', {
        ec: 'shopmoreinthiscolor',
        el,
        ea: type || 'view',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.selectedColor.key,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    },
    setPointColor(el, ea) {
      this.buryPoint(this, 'event', {
        ec: 'color',
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    },
    orderSwatch() {
      this.setPointColor(`can'tfind`, 'click')
      this.$store.commit('product/setShowOrderSwatch', true)
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
    handleSwatch() {
      this.$store.commit('product/setShowOrderSwatch', 'fromSwatchId')
    },
    getStyleClass() {
      // color-label 样式，色系的时候 获取屏幕宽度，小于1536以及quickshop使用一套，大于1536 使用另一套
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      this.showSmallStyle =
        windowWidth <= 1536 && this.baseInfo.swatchId && this.showSwatchBtn && this.versionObj.productColorAbtest === 'B'
    }
  }
}
</script>

<style lang="less" scoped>
.color-label {
  width: 100%;
  display: flex;
  margin-bottom: 13px;
  position: relative;
  &.showSmallStyle {
    &:not(.language-en) {
      margin-bottom: 38px;
      .swatch-txt {
        margin-left: 0;
        position: absolute;
        top: 100%;
      }
    }
  }
  &.wgd {
    margin: unset;
  }
  .color-title {
    text-transform: uppercase;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    .color-name {
      text-indent: 0.2em;
      font-family: @font-family-600;
    }
    .new-color {
      color: @theme-color;
      margin-left: 5px;
      font-family: @font-family-600, sans-serif;
      font-size: 14px;
    }
    .new-color-tag {
      position: relative;
      height: 19px;
      line-height: 19px;
      color: var(--color-ffffff);
      text-transform: none;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin-left: 5px;
      span {
        padding: 0 6px;
        background: var(--color-121212);
        font-size: 12px;
        &.clip-path {
          clip-path: polygon(60% 0%, 0% 50%, 60% 100%, 0 100%, 0% 50%, 0 0);
        }
      }
    }
    .color-chart {
      font-size: 13px;
      line-height: normal;
      text-decoration: underline;
      color: @theme-color;
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .sample-swatch {
    color: @title-color;
    cursor: pointer;
    margin-left: 5px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 13px;
      margin-right: 5px;
    }
    .order-swatch:hover {
      text-decoration: underline;
    }
  }
  .swatch-txt {
    font-size: 13px;
    line-height: 25px;
    color: #666;
    font-family: @font-family-500;
    text-decoration-line: underline;
    cursor: pointer;
    margin-left: 8px;
  }
  .shop-more {
    margin-left: auto;
    color: #666;
    text-decoration: underline;
    position: absolute;
    right: 0;
  }
}
</style>
