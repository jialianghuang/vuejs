<template>
  <div :class="['normal-style', { wgd: isSpecialCatId(catId) }]">
    <div
      :class="[
        'normal-style-block',
        { 'no-style': noStyle, 'has-custom-size': styleInfo.customSize && hasCustomeSize, atelier: baseInfo.catId == 3110 }
      ]"
    >
      <div v-if="hasColor" class="color-block">
        <div
          v-if="styleInfo.themeColorInfo && Object.keys(styleInfo.themeColorInfo).length > 0"
          v-track.view.click="{ common: getBiParams('color', 'themecolorchoose') }"
          class="theme-color-block"
        >
          <div class="title">{{ nl('page_popular_color_of_the_season') }}</div>
          <color-list
            :stock="colorStock"
            :colorLocalWarehouseStock="colorLocalWarehouseStock"
            :support-stock-sales="supportStockSales"
            :colors="styleInfo.themeColorInfo"
            :selected-color-id="selectedColor.styleId"
            :stock-info="stockInfo"
            @select-color="selectStockColor"
          ></color-list>
        </div>
        <color-label
          :selected-color="selectedColor"
          :is-dress="baseInfo.isDress"
          :is-coming-soon="baseInfo.isComingSoon"
          :shop-more="shopMore"
          :baseInfo="baseInfo"
          :colorLocalWarehouseStock="colorLocalWarehouseStock"
          :showSwatchBtn="showProductColorFamily(colorsFormat.shown)"
        ></color-label>
        <!--详情页色系色圈 -->
        <!-- <color-family-list
          v-if="showProductColorFamily(colorsFormat.shown)"
          :productColorFamily="colorsFormat.shownColorFamily"
          :stock="colorStock"
          :colorLocalWarehouseStock="colorLocalWarehouseStock"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :support-stock-sales="supportStockSales"
          :stock-info="stockInfo"
          @select-color="selectStockColor"
          :selectedColor="selectedColor"
          :baseInfo="baseInfo"
          :colorInfoId="colorInfoId"
        ></color-family-list> -->
        <color-list
          :stock="colorStock"
          :colorLocalWarehouseStock="colorLocalWarehouseStock"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :support-stock-sales="supportStockSales"
          :stock-info="stockInfo"
          @select-color="selectStockColor"
          :showSwatchBtn="true"
          :isFromProduct="true"
        ></color-list>
        <div v-if="baseInfo.hasPriceRule" class="mesh-color-block">
          <mesh-label></mesh-label>
          <color-list
            :colors="colorsFormat.priceColors"
            :selected-color-id="selectedColor.styleId"
            :stock-info="stockInfo"
            @mesh-color="selectMeshColor"
            @select-color="selectStockColor"
          ></color-list>
        </div>
        <div
          v-if="retireInfo.hasOwnProperty('retireColor') && !(styleInfo.themeColorInfo && Object.keys(styleInfo.themeColorInfo).length > 0)"
          class="retire-color-block"
        >
          <retire-label :retire-info="retireInfo"></retire-label>
          <color-list
            :colors="colorsFormat.retireColors"
            :selected-color-id="selectedColor.styleId"
            :stock-info="stockInfo"
            @select-color="selectStockColor"
          ></color-list>
        </div>
      </div>
      <div v-if="hasSize" class="size-block">
        <size-label :is-groomsmen="baseInfo.isGroomsmen" :baseInfo="baseInfo" :hasSizeChart="hasSizeChart"></size-label>
        <template v-if="!isSpecialCatId(catId)">
          <size-list
            :stock="sizeStock"
            :sizeLocalWarehouseStock="sizeLocalWarehouseStock"
            :size-hover-tip="{}"
            :isSelectedCustom="isSelectedCustom"
            :hasCustomSize="hasCustomeSize"
            :sizes="sizes"
            :selected-size-id="selectedSize.styleId"
            :support-stock-sales="supportStockSales"
            :hide-size-map="hideSizeMap"
            @select-size="selectStockSize"
          ></size-list>
        </template>
        <template v-else>
          <new-size-list v-bind="newSizeListBindValue" @select-size="selectStockSize"></new-size-list>
        </template>
        <size-detail
          v-if="hasSizeChart"
          :size-chart="styleInfo.sizeChart"
          :selected-size="selectedSize.key"
          :unit="unit"
          @switch-unit="switchUnit"
        ></size-detail>
        <custom-size
          ref="customSize"
          v-if="hasCustomeSize"
          :is-visible="customSizeSelected"
          :unit="unit"
          :sizeChart="styleInfo.sizeChart"
          :goodsId="baseInfo.goodsId"
          :customData="customData"
          @select-custom="selectCustom"
          @switch-unit="switchUnit"
          mark-str="productDetail"
        ></custom-size>
        <!-- <match-face-mask @select-face-mask="selectFaceMask" @is-render="handleIsRender"></match-face-mask> -->
      </div>
      <div v-if="baseInfo.hasSash" class="sash-color-block">
        <color-label
          :selected-color="sameAsDress ? { name: 'Same as Dress', isNew: false } : selectedSashColor"
          :is-coming-soon="baseInfo.isComingSoon"
          :is-sash-color="true"
          :baseInfo="baseInfo"
        ></color-label>
        <color-list
          :colors="sashColorsFormat.shown"
          :selected-color-id="selectedSashColor.styleId"
          :same-as-dress="sameAsDress"
          :show-same-as-dress="showSameAsDress"
          :stock-info="stockInfo"
          @select-color="selectSashColor"
          @select-same-as-dress="changeSameAsDress"
        ></color-list>
      </div>
      <!-- 定制配件 -->
      <Customization
        ref="customization"
        v-if="baseInfo.customizable"
        :customNameList="customNameList"
        :max-length="customCharaterLen"
        :supportTwoLine="supportTwoLine"
        @changeCustomNameList="changeCustomNameList"
      ></Customization>
      <goods-number
        v-if="baseInfo.numberSelectable"
        @change-qty="changeQty"
        :max="baseInfo.maxSelectNumber"
        :goods-number="goodsNumber"
      ></goods-number>
      <stock-tips :tip-status="tipStatus" :support-stock-sales="supportStockSales" v-if="currentStyleSupportStock"></stock-tips>
      <sample-confirm
        v-if="baseInfo.customizable"
        @click="confirmSelected = !confirmSelected"
        :selected="confirmSelected"
        :base-info="baseInfo"
      ></sample-confirm>
    </div>
    <div v-if="atelierIsNotifyMe && baseInfo.catId == 3110" class="add-to-bag-block">
      <az-button
        id="notify-me"
        :class="{ disabled: atelierIsNotifyMe }"
        @click="changeDialogStatus"
        :text="nl('page_notify_me')"
        v-track.view.click="trackParams('notifyme', 'notifyme')"
        icon="icon-icon_notice"
        class="notify-btn"
      ></az-button>
    </div>
    <div v-else class="add-to-bag-block">
      <az-button
        id="add-to-bag"
        @click="addToBag"
        @mouseenter.native="checkStyle(false)"
        @mouseleave.native="hideCheckTip"
        :text="nl('page_order_add2bag')"
        :loading="loading"
        icon="icon-xxy_add_to_bag"
      ></az-button>
      <az-button
        id="buy-now"
        @click="buyNow"
        @mouseenter.native="checkStyle(true)"
        @mouseleave.native="hideCheckTip"
        :textColor="'var(--color-121212)'"
        :color="'#fff'"
        :text="nl('page_common_buy_now')"
        :loading="buyNowLoading"
      ></az-button>
      <check-tips v-show="showCheckTip" :tipsLeft="checkTipsLeftPosition" :tips="checkTips"></check-tips>
    </div>
    <sample-link v-if="showSampleLink && !showTryBeforeYouBuyNew" :baseInfo="baseInfo"></sample-link>
    <client-only>
      <section v-show="deliveryInit" class="rush-delivery-box">
        <rush-select v-if="!isCurrentStyleSupportStock && baseInfo.rushSelectItems" :baseInfo="baseInfo" />
        <address-delivery-info
          id="wgd-delivery"
          ref="delivery"
          :baseInfo="baseInfo"
          :makeTimeInfo="makeTimeInfo"
          :goodsNumber="goodsNumber"
        ></address-delivery-info>
      </section>
      <add-cart-dialog @quickShop="quickShopClick" :goodsNumber="goodsNumber" v-if="showAddCartDialog"></add-cart-dialog>
      <notify-dialog
        @show-notify-dialog="changeDialogStatus"
        :show-dialog="showNotifyDialog"
        :baseInfo="baseInfo"
        :is-sample="false"
        v-bind="notifyBindValue"
      ></notify-dialog>
    </client-only>
  </div>
</template>

<script>
import styleMixins from '@/assets/js/styleMixins'
import ColorList from '@/components/product/style/ColorList'
import SizeList from '@/components/product/style/SizeList'
import NewSizeList from '@/components/product/style/NewSizeList'
import SizeLabel from '@/components/product/style/SizeLabel'
import SizeDetail from '@/components/product/style/SizeDetail'
import Customization from '@/components/product/style/Customization'
import GoodsNumber from '@/components/product/style/GoodsNumber'
import CheckTips from '@/components/product/style/CheckTips'
import AzButton from '@/components/az-ui/AzButton'
import MeshLabel from '@/components/product/style/MeshLabel'
import CustomSize from '@/components/product/CustomSize'
import RetireLabel from '@/components/product/style/RetireLabel'
import ColorLabel from '@/components/product/style/ColorLabel'
import SampleLink from '@/components/product/style/SampleLink'
// import MatchFaceMask from '@/components/product/MatchFaceMask'
import AddCartDialog from '@/components/cart/AddCartDialog'
import StockTips from '@/components/product/style/StockTips'
import RushSelect from '@/components/product/style/RushSelect'
import AddressDeliveryInfo from '@/components/product/AddressDeliveryInfo'
import SampleConfirm from '@/components/product/style/SampleConfirm'
// import ColorFamilyList from '@/components/product/style/ColorFamilyList'
import NotifyDialog from '@/components/product/style/NotifyDialog'

export default {
  name: 'NormalStyle',
  languageKeys: [
    'page_popular_color_of_the_season',
    'page_order_add2bag',
    'page_common_buy_now',
    'page_try_it_on',
    'page_goods_please_provide',
    'page_js_accept',
    ...SampleLink.languageKeys,
    ...ColorLabel.languageKeys,
    ...RetireLabel.languageKeys,
    ...MeshLabel.languageKeys,
    ...Customization.languageKeys,
    ...GoodsNumber.languageKeys,
    ...SizeLabel.languageKeys,
    ...SizeList.languageKeys,
    ...ColorList.languageKeys,
    ...CustomSize.languageKeys,
    ...NewSizeList.languageKeys,
    ...AddCartDialog.languageKeys,
    ...StockTips.languageKeys,
    ...RushSelect.languageKeys,
    ...AddressDeliveryInfo.languageKeys,
    ...SampleConfirm.languageKeys
    // ...ColorFamilyList.languageKeys
  ],
  components: {
    SampleLink,
    ColorLabel,
    RetireLabel,
    MeshLabel,
    CheckTips,
    AzButton,
    Customization,
    GoodsNumber,
    SizeDetail,
    SizeLabel,
    SizeList,
    ColorList,
    CustomSize,
    NewSizeList,
    // MatchFaceMask,
    AddCartDialog,
    StockTips,
    RushSelect,
    AddressDeliveryInfo,
    SampleConfirm,
    // ColorFamilyList,
    NotifyDialog
  },
  mixins: [styleMixins],
  data() {
    return {
      isSelectedCustom: false,
      customNameList: {},
      confirmSelected: false
    }
  },
  computed: {
    noStyle() {
      // normal-style-block 里面没有内容的情况
      return !this.hasColor && !this.hasSize && !this.baseInfo.hasSash && !this.baseInfo.numberSelectable
    },
    // 特定商品可定制两行文案
    supportTwoLine() {
      return [1060990, 1060991, 1060993, 1061261, 1061262, 1061264].includes(this.baseInfo.goodsId)
    },
    customCharaterLen({ baseInfo }) {
      let len = 25
      const goodsId = baseInfo.goodsId
      switch (goodsId) {
        case 1060885:
        case 1063632:
          len = 1
          break
        case 1061156:
        case 1061269:
          len = 2
          break
        default:
          break
      }
      return len
    }
  },
  watch: {
    currentColorSupportStock: {
      handler(newVal) {
        if (newVal && (this.currentSizeSupportStock || this.selectedSize.key == '') && !this.customSizeSelected) {
          this.$store.commit('product/setIsCurrentStyleSupportStock', true)
        } else {
          this.$store.commit('product/setIsCurrentStyleSupportStock', false)
        }
      },
      immediate: true
    },
    customSizeSelected: {
      handler(newVal) {
        if (newVal) {
          this.$store.commit('product/setIsCurrentStyleSupportStock', false)
        } else if (this.currentStyleSupportStock || (this.currentColorSupportStock && this.selectedSize.key == '')) {
          this.$store.commit('product/setIsCurrentStyleSupportStock', true)
        }
        this.$nextTick(() => {
          this.$refs.delivery && this.$refs.delivery.getDeliveryInfo()
        })
      }
    }
  },
  mounted() {
    if (this.supportTwoLine) {
      this.customNameList = { line1: '', line2: '' }
    } else {
      this.customNameList = { line1: '' }
    }
    // 显示按钮的次数数量
    this.setDataLayer({
      action: 'view',
      category: 'DetailpgeAddtobag',
      label: 'DetailpgeAddtobag_Addtobag_View'
    })
    this.setPoint('addtobag', 'addtobag', 'view')
    this.setPoint('buynow', 'buynow', 'view')

    // 对于拥有“该虚拟试穿功能”的商品A/B实验 订单追踪
    if (this.baseInfo.supportTryon) this.setOrderSourceFlag(`VersionB_tryon`, true)
  },
  methods: {
    selectStockColor(color) {
      this.selectColor(color)
      this.$nextTick(() => {
        if (this.$refs.delivery) {
          this.$refs.delivery.getDeliveryInfo()
        }
        this.currentColorSupportStock && this.checkSelect('color')
      })
    },
    selectStockSize(size, bol) {
      const { form } = size
      // TODO: 修复自定义颜色取消选中问题
      if (size.keyStr === 'customSize') {
        this.selectCustom()
        this.isSelectedCustom = !this.isSelectedCustom
        if (form) {
          this.isSelectedCustom = true
          this.customData = form
        }
        return
      } else {
        this.isSelectedCustom = false
      }
      if (bol) {
        this.isSelectedCustom = false
        this.$store.commit('product/setCustomSizeSelected', false)
        this.customData = form
        return
      }
      this.selectSize(size)
      this.$nextTick(() => {
        if (this.$refs.delivery) {
          this.$refs.delivery.getDeliveryInfo()
        }
        this.currentSizeSupportStock && this.checkSelect()
      })
    },
    getBiParams(ec, el) {
      if (process.server) return
      return {
        ec,
        el,
        param1: (location && location.href) || '-1',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          cat_id: this.baseInfo.catId,
          color: this.baseInfo.color.colorReal
        })
      }
    },
    // 显示try on 弹框
    showTryOnPopup() {
      this.$store.commit('product/setShowTryOnPopup', true)
    },
    selectCustom() {
      this.$store.commit('product/setCustomSizeSelected', !this.customSizeSelected)
      this.selectSize({
        key: '',
        name: '',
        styleId: 0
      })
    },
    addToBag() {
      if (!this.handleCheck()) return
      if (!this.allReady || !this.checkCutomization()) {
        return false
      }
      // 加车按钮总点击数量
      this.setDataLayer({
        category: 'DetailpgeAddtobag',
        action: 'click',
        label: 'DetailpgeAddtobag_Addtobag_Click1'
      })
      this.setPoint('addtobag', 'addtobag', 'click')
      const customSize = this.$refs.customSize
      let customData = false
      if (this.customSizeSelected) {
        customData = customSize.formCheck()
        if (!customData) {
          return false
        }
      }
      // 加车按钮不报错点击储量
      this.setDataLayer({
        category: 'DetailpgeAddtobag',
        action: 'click',
        label: 'DetailpgeAddtobag_Addtobag_Click2'
      })
      this.loading = true
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', this.baseInfo.goodsId)
      formData.set('dress_type', this.baseInfo.dressType)
      formData.set('from_showroom', this.fromShowroom)
      formData.set('from_whatAreU', this.fromWhatAreU)
      formData.set('recommend_flag', this.recommendFlag)
      formData.set('from_details_entry', this.fromDetailsEntry)
      formData.set('from_instagram', this.fromInstagram)
      formData.set('styles[freeStyle]', false)
      formData.set('styles[size_type]', this.unit == 'inch' ? '_inch' : '_cm')
      if (this.currentStyleSupportStock && this.isCurrentStyleSupportStock) {
        formData.set('styles[select][isSpecialStock]', 1)
      } else {
        for (const i in this.customNameList) {
          formData.set('styles[customNameList][' + i + ']', this.customNameList[i])
        }
      }
      if (this.hasColor) {
        formData.set('styles[select][color]', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        formData.set('styles[select][sash_color]', this.selectedSashColor.styleId)
      }
      if (this.customSizeSelected) {
        formData.set('custom', 'on')
        formData.set('return_support_checkbox', 'on')
        formData.set('styles[input][bust_value_judge]', '')
        for (const i in customData) {
          formData.set('styles[input][' + i + ']', customData[i])
        }
      } else if (this.hasSize) {
        formData.set('styles[select][size]', this.selectedSize.styleId)
      }
      if (this.baseInfo.discount && this.baseInfo.dressType === 'clearance') {
        formData.set('styles[select][discount]', this.baseInfo.discount)
      }
      formData.set('goods_number', this.goodsNumber)
      this.addToBagAjax(formData)
      this.trackAddToCart({
        goodsId: this.baseInfo.goodsId,
        colorId: this.baseInfo.colorId,
        value: this.baseInfo.noDealPrice
      })
    },
    buyNow() {
      if (!this.handleCheck()) return
      if (!this.allReady || !this.checkCutomization()) {
        return false
      }
      this.setPoint('buynow', 'buynow', 'click')
      const customSize = this.$refs.customSize
      let customData = false
      if (this.customSizeSelected) {
        customData = customSize.formCheck()
        if (!customData) {
          return false
        }
      }
      this.buyNowLoading = true
      const formData = {}
      const stylesObject = {}
      const stylesSelectObject = {}
      const stylesInputObject = {}
      this.$set(formData, 'act', 'addGoodsToCart')
      this.$set(formData, 'goods_id', this.baseInfo.goodsId)
      this.$set(formData, 'dress_type', this.baseInfo.dressType)
      this.$set(formData, 'from_showroom', this.fromShowroom)
      this.$set(formData, 'from_whatAreU', this.fromWhatAreU)
      this.$set(formData, 'recommend_flag', this.recommendFlag)
      this.$set(formData, 'from_details_entry', this.fromDetailsEntry)
      this.$set(formData, 'from_instagram', this.fromInstagram)
      this.$set(stylesObject, 'freeStyle', false)
      this.$set(stylesObject, 'size_type', this.unit == 'inch' ? '_inch' : '_cm')
      if (this.currentStyleSupportStock && this.isCurrentStyleSupportStock) {
        this.$set(stylesSelectObject, 'isSpecialStock', 1)
      } else {
        this.$set(stylesObject, 'customNameList', this.customNameList)
      }
      if (this.hasColor) {
        this.$set(stylesSelectObject, 'color', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        this.$set(stylesSelectObject, 'sash_color', this.selectedSashColor.styleId)
      }
      if (this.customSizeSelected) {
        this.$set(formData, 'custom', 'on')
        this.$set(formData, 'return_support_checkbox', 'on')
        this.$set(stylesInputObject, 'bust_value_judge', '')
        for (const i in customData) {
          this.$set(stylesInputObject, i, customData[i])
        }
      } else if (this.hasSize) {
        this.$set(stylesSelectObject, 'size', this.selectedSize.styleId)
      }
      if (this.baseInfo.discount && this.baseInfo.dressType === 'clearance') {
        this.$set(stylesSelectObject, 'discount', this.baseInfo.discount)
      }
      this.$set(formData, 'goods_number', this.goodsNumber)
      // if (this.isSelected) {
      //   this.$set(formData, 'with_face_mask', true)
      // }
      this.$set(stylesObject, 'select', stylesSelectObject)
      if (Object.keys(stylesInputObject).length > 0) this.$set(stylesObject, 'input', stylesInputObject)
      this.$set(formData, 'styles', stylesObject)
      this.buyNowAjax(formData)
    },
    quickShopClick(params) {
      this.$emit('quickShop', params)
    }
  }
}
</script>

<style lang="less" scoped>
.normal-style {
  width: 100%;
  // 解决 atelier 选择尺码与加车按钮层级关系问题
  &-block.atelier {
    position: relative;
    z-index: @z-index-3;
  }
  &.wgd {
    display: flex;
    flex-direction: column;
    padding: 15px;
    margin-top: 17px;
    background-color: #f7f7f7;
    box-sizing: border-box;
  }
  .try-on-link {
    display: inline-block;
    // margin-top: 25px;
    font-size: 16px;
    color: @theme-color;
    text-transform: uppercase;
    text-decoration: underline;
    font-family: @font-family-600;
    cursor: pointer;
    > div {
      display: flex;
      align-items: center;
      .icon-try-before-you-buy {
        fill: currentColor;
        color: @theme-color;
        margin-right: 10px;
        // font-size: 20px;
        width: 17px;
      }
    }
  }
  .size-block {
    .tab-title {
      display: flex;
      position: relative;
      font-family: @font-family-600;
      font-size: 13px;
      color: #ccc;
      text-transform: uppercase;
    }
    .split_line {
      position: absolute;
      width: 100%;
      height: 1px;
      background: #ccc;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
    .select_split {
      position: absolute;
      width: 100%;
      height: 2px;
      background: var(--color-121212) 330;
      bottom: 0;
      left: 0;
      z-index: 2;
    }
    .standard,
    .custom {
      position: relative;
      cursor: pointer;
      padding-bottom: 5px;
      &.selected {
        color: var(--color-121212);
      }
    }
    .custom {
      margin-left: 20px;
    }
  }
  .add-to-bag-block {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
    #notify-me {
      max-width: 674px;
      padding: 13px 10px;
      height: 50px;
      font-family: @font-family-600;
      box-sizing: border-box;
      text-transform: uppercase;
      font-size: 14px;
      cursor: pointer;
      line-height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: @theme-color!important;
      &:hover {
        background-color: @btn-hover-color !important;
      }
      /deep/ .az-icon {
        height: 22px;
        width: 22px;
        margin-right: 8px;
        fill: currentColor;
      }
    }
    #add-to-bag {
      flex: 2;
      padding: 13px 10px;
      height: 50px;
      font-family: @font-family-600;
      box-sizing: border-box;
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      line-height: 25px;
      &:hover {
        background-color: @btn-hover-color !important;
      }
      .az-icon {
        height: 15px;
        width: 20px;
        margin-right: 8px;
        fill: currentColor;
      }
    }
    #buy-now {
      flex: 1;
      padding: 12px 10px;
      height: 50px;
      margin-left: 10px;
      font-family: @font-family-600;
      box-sizing: border-box;
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      line-height: 25px;
      border: 1px solid @theme-color;
      &:hover {
        background-color: @bg-color !important;
      }
      .az-icon {
        height: 13px;
        width: 18px;
        margin-right: 8px;
        margin-bottom: 1px;
        fill: currentColor;
      }
    }
  }
  .rush-delivery-box {
    background-color: #f7f7f7;
    padding: 10px 15px;
  }
}
.normal-style {
  .add-to-bag-block {
    #add-to-bag,
    #buy-now {
      border: 1px solid @theme-color;
    }
    #buy-now {
      color: @theme-color!important;
      &:hover {
        background-color: @btn-light-hover-color !important;
      }
    }
    #add-to-bag {
      background-color: @theme-color!important;
      &:hover {
        background-color: @btn-hover-color !important;
      }
    }
  }
}
.theme-color-block {
  .title {
    margin-bottom: 10px;
  }
}
</style>
