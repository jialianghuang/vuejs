<template>
  <div class="color-label">
    <div class="color-title">
      {{ nl(type) }}:&nbsp;
      <strong class="color-name">{{ replaceBackslashToAndText(selectedColor.name, baseInfo) }}</strong>
      <span v-if="selectedColor.isNew" class="new-color">{{ nl('page_common_new_capital') }}!</span>
      <div v-if="isCurrentStyleSupportStock && colorLocalWarehouseStock.includes(selectedColor.key)" class="new-color-tag">
        <template v-if="shipingIn24Hours && !isSpecialCatId(baseInfo.catId)">
          <span>{{ nl('page_ships_in_time') }}</span>
          <span class="clip-path"></span>
        </template>
        <template v-else-if="isSpecialCatId(baseInfo.catId) && country == 'US'">
          <span>{{ nl('page_ships_in_time_24') }}</span>
          <span class="clip-path"></span>
        </template>
      </div>
    </div>
    <a
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
    'page_shop_wedding_dresses_color'
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
    }
  },
  computed: {
    ...mapState('quickshop', ['isCurrentStyleSupportStock']),
    type() {
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
    }
  },
  methods: {
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
      this.$store.commit('quickshop/setShowOrderSwatch', true)
    }
  }
}
</script>

<style lang="less" scoped>
.color-label {
  width: 100%;
  display: flex;
  margin-top: 10px;
  margin-bottom: 6px;
  .color-title {
    text-transform: uppercase;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    .new-color {
      color: var(--color-121212);
      margin-left: 5px;
      font-family: @font-family-600, sans-serif;
      font-size: 14px;
    }
    .new-color-tag {
      position: relative;
      height: 19px;
      line-height: 19px;
      color: @theme-color;
      text-transform: none;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin-left: 5px;
      span {
        padding: 0 6px;
        background: @btn-light-hover-color;
        font-size: 12px;
        &.clip-path {
          clip-path: polygon(60% 0%, 0% 50%, 60% 100%, 0 100%, 0% 50%, 0 0);
        }
      }
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
  .shop-more {
    margin-left: auto;
    color: var(--color-121212);
    text-decoration: underline;
  }
}
</style>
