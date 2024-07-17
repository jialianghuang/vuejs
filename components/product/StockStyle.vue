<template>
  <div :class="['stock-style', { wgd: isSpecialCatId(catId), 'sod-b': sodDetailVersionFun(baseInfo) }]">
    <!-- garment bags  -->
    <div v-if="isGarmentBags && baseInfo.goodsId != 1055452" class="garment">
      <span>{{ nl('page_garment_bags_price_desc_' + country.toLowerCase()) }}</span>
    </div>
    <notify-dialog
      @show-notify-dialog="changeDialogStatus"
      :show-dialog="showNotifyDialog"
      :baseInfo="baseInfo"
      :is-sample="isSample"
      v-bind="notifyBindValue"
    ></notify-dialog>
    <template v-if="!hasColor && !hasSize && !stockInfo.hasStock">
      <notify-label @click="changeDialogStatus" :is-sample="isSample" type="none"></notify-label>
    </template>
    <div :class="{ dressType }" class="style-block">
      <div v-if="hasColor" class="color-block">
        <template v-if="[1000291, 1003269].includes(baseInfo.goodsId)">
          <!-- bd color list -->
          <template>
            <color-label
              :selected-color="selectedColor"
              :shop-more="shopMore"
              :is-dress="baseInfo.isDress"
              :baseInfo="baseInfo"
              :colorLocalWarehouseStock="colorLocalWarehouseStock"
              :showSwatchBtn="showProductColorFamily(colorsFormat.shown)"
              :show-text="'page_common_color_for_bd'"
              :text="'page_swatch_shop_bridemaid'"
              :label-type="'bd'"
            ></color-label>
            <template v-if="showColorNotifyLabel">
              <notify-label
                @click="changeDialogStatus"
                :is-sample="isSample"
                :is-stock-goods="isStockGoods"
                :stock="colorStock"
                type="color"
              ></notify-label>
            </template>
            <color-list
              :stock="colorStock"
              :colorLocalWarehouseStock="colorLocalWarehouseStock"
              :colors="colorsFormat.bd"
              :selected-color-id="selectedColor.styleId"
              :alias-style-id="selectedColor.aliasStyleId"
              :is-stock-goods="isStockGoods"
              :stock-info="stockInfo"
              @select-color="selectStockColor"
              :showSwatchBtn="true"
            ></color-list>
          </template>
          <!-- mob color list -->
          <template v-if="!!Object.keys(colorsFormat.mob).length">
            <color-label
              :selected-color="selectedColor"
              :shop-more="mobShopMore"
              :is-dress="baseInfo.isDress"
              :baseInfo="baseInfo"
              :colorLocalWarehouseStock="colorLocalWarehouseStock"
              :showSwatchBtn="showProductColorFamily(colorsFormat.shown)"
              :show-text="'page_common_color_for_mob'"
              :text="'page_shop_more_mbd'"
              :label-type="'mob'"
            ></color-label>
            <template v-if="showColorNotifyLabel">
              <notify-label
                @click="changeDialogStatus"
                :is-sample="isSample"
                :is-stock-goods="isStockGoods"
                :stock="colorStock"
                type="color"
              ></notify-label>
            </template>
            <color-list
              :stock="colorStock"
              :colorLocalWarehouseStock="colorLocalWarehouseStock"
              :colors="colorsFormat.mob"
              :selected-color-id="selectedColor.styleId"
              :alias-style-id="selectedColor.aliasStyleId"
              :is-stock-goods="isStockGoods"
              :stock-info="stockInfo"
              @select-color="selectStockColor"
              :showSwatchBtn="true"
            ></color-list>
          </template>
        </template>
        <template v-else>
          <color-label
            :selected-color="selectedColor"
            :shop-more="shopMore"
            :is-dress="baseInfo.isDress"
            :baseInfo="baseInfo"
            :colorLocalWarehouseStock="colorLocalWarehouseStock"
            :showSwatchBtn="showProductColorFamily(colorsFormat.shown)"
          ></color-label>
          <template v-if="showColorNotifyLabel">
            <notify-label
              @click="changeDialogStatus"
              :is-sample="isSample"
              :is-stock-goods="isStockGoods"
              :stock="colorStock"
              type="color"
            ></notify-label>
          </template>
          <!--详情页色系色圈 -->
          <!-- <color-family-list
            v-if="showProductColorFamily(colorsFormat.shown)"
            :productColorFamily="colorsFormat.shownColorFamily"
            :stock="colorStock"
            :colorLocalWarehouseStock="colorLocalWarehouseStock"
            :colors="colorsFormat.shown"
            :selected-color-id="selectedColor.styleId"
            :is-stock-goods="isStockGoods"
            :stock-info="stockInfo"
            @select-color="selectStockColor"
            :selectedColor="selectedColor"
            :baseInfo="baseInfo"
            :colorInfoId="colorInfoId"
          ></color-family-list> -->
          <color-list
            :stock="colorStock"
            :colorLocalWarehouseStock="colorLocalWarehouseStock"
            :support-stock-sales="supportStockSales"
            :colors="colorsFormat.shown"
            :selected-color-id="selectedColor.styleId"
            :is-stock-goods="isStockGoods"
            :stock-info="stockInfo"
            @select-color="selectStockColor"
            :showSwatchBtn="true"
            :isFromProduct="true"
          ></color-list>
        </template>
        <template v-if="baseInfo.hasPriceRule">
          <mesh-label></mesh-label>
          <color-list
            :stock="colorStock"
            :colorLocalWarehouseStock="colorLocalWarehouseStock"
            :support-stock-sales="supportStockSales"
            :colors="colorsFormat.priceColors"
            :selected-color-id="selectedColor.styleId"
            :alias-style-id="selectedColor.aliasStyleId"
            :is-stock-goods="isStockGoods"
            :stock-info="stockInfo"
            @mesh-color="selectMeshColor"
            @select-color="selectStockColor"
          ></color-list>
        </template>
        <template v-if="retireInfo.hasOwnProperty('retireColor')">
          <retire-label :retire-info="retireInfo"></retire-label>
          <color-list
            :stock="colorStock"
            :colorLocalWarehouseStock="colorLocalWarehouseStock"
            :support-stock-sales="supportStockSales"
            :colors="colorsFormat.retireColors"
            :selected-color-id="selectedColor.styleId"
            :alias-style-id="selectedColor.aliasStyleId"
            :is-stock-goods="isStockGoods"
            :stock-info="stockInfo"
            @select-color="selectStockColor"
          ></color-list>
        </template>
      </div>
      <div v-if="hasSize && baseInfo.catId != 1504" class="size-block">
        <size-label
          :is-stock-goods="isStockGoods"
          :is-groomsmen="baseInfo.isGroomsmen"
          :baseInfo="baseInfo"
          :hasSizeChart="hasSizeChart"
        ></size-label>
        <template v-if="showSizeNotifyLabel">
          <notify-label @click="changeDialogStatus" :is-sample="isSample" :is-stock-goods="isStockGoods" :stock="sizeStock"></notify-label>
        </template>
        <size-list
          :stock="sizeStock"
          :sizeLocalWarehouseStock="sizeLocalWarehouseStock"
          :support-stock-sales="supportStockSales"
          :size-hover-tip="sizeHoverTip"
          :sizes="sizes"
          :selected-size-id="selectedSize.styleId"
          :is-stock-goods="isStockGoods"
          :hide-size-map="hideSizeMap"
          @select-size="selectStockSize"
        ></size-list>
        <size-detail
          v-if="hasSizeChart"
          :is-stock-goods="isStockGoods"
          :size-chart="styleInfo.sizeChart"
          :selected-size="selectedSize.key"
          :unit="unit"
          :show-switch="baseInfo.catId == '3102'"
          @switch-unit="switchUnit"
        ></size-detail>
      </div>
      <div v-if="baseInfo.hasSash" class="sash-block">
        <color-label
          :selected-color="sameAsDress ? { name: 'Same as Dress', isNew: false } : selectedSashColor"
          :shop-more="baseInfo.shopMore"
          :is-sash-color="true"
          :baseInfo="baseInfo"
        ></color-label>
        <color-list
          :stock="sashStock"
          :colors="sashColorsFormat.shown"
          :selected-color-id="selectedSashColor.styleId"
          :is-stock-goods="isStockGoods"
          :same-as-dress="sameAsDress"
          :stock-info="stockInfo"
          @select-color="selectStockSashColor"
          @select-same-as-dress="changeSameAsDress"
        ></color-list>
      </div>
      <goods-number
        v-if="baseInfo.numberSelectable"
        :max="baseInfo.maxSelectNumber"
        :stock-number="maxStockNumber"
        :goods-number="goodsNumber"
        @change-qty="changeQty"
      ></goods-number>
      <stock-tips :tip-status="tipStatus" :is-sample="isSample" :is-clearance="isClearance"></stock-tips>
    </div>
    <div v-if="showNotifyMeBtn" class="add-to-bag-block">
      <template v-if="baseInfo.brandId == 16">
        <az-button id="sold-out" v-if="isSoldOut" :disable="true" :text="nl('page_common_sold_out')" class="sold-out-btn"></az-button>
        <az-button
          id="notify-me"
          v-else
          :class="{ disabled: disableNotifyMe }"
          @click="shopSimilar"
          :text="nl('page_sale_down_button')"
          v-track.view.click="trackParams('shopsimilar', 'shopsimilar')"
          icon="icon-icon_notice"
          class="notify-btn"
        ></az-button>
      </template>
      <az-button
        id="notify-me"
        v-else
        :class="{ disabled: disableNotifyMe }"
        @click="changeDialogStatus"
        :text="nl('page_notify_me')"
        v-track.view.click="trackParams('notifyme', 'notifyme')"
        icon="icon-icon_notice"
        class="notify-btn"
      ></az-button>
    </div>
    <div v-else class="add-to-bag-block">
      <!-- 购物车商品编辑 -->
      <az-button
        id="add-to-bag"
        v-track.viewOnce.click="{
          id: baseInfo.goodsId + baseInfo.color + baseInfo.goodsUrl + 'product-add-to-bag',
          common: [
            isSpecialCatId(baseInfo.catId) ? trackParams('sodaddtobag', 'sodaddtobag', 'sod').common : null,
            getExcitationParams(
              'stimulateadd',
              'stimulateadd',
              baseInfo,
              getStickerText(),
              'detailpage',
              baseInfo.driveInfo && baseInfo.driveInfo.detailSticker
            ).common
          ]
        }"
        @click="addToBag"
        @mouseenter.native="checkStyle(false)"
        @mouseleave.native="hideCheckTip"
        :text="nl('page_order_add2bag')"
        :loading="loading"
        :disable="disable"
        icon="icon-xxy_add_to_bag"
      ></az-button>
      <az-button
        id="buy-now"
        v-track.viewOnce.click="{
          id: baseInfo.goodsId + baseInfo.color + baseInfo.goodsUrl + 'product-buy-now',
          common: [
            isSpecialCatId(baseInfo.catId) ? trackParams('sodbuynow', 'sodbuynow', 'sod').common : null,
            getExcitationParams(
              'stimulatebuy',
              'stimulatebuy',
              baseInfo,
              getStickerText(),
              'detailpage',
              baseInfo.driveInfo && baseInfo.driveInfo.detailSticker
            ).common
          ]
        }"
        @click="buyNow"
        @mouseenter.native="checkStyle(true)"
        @mouseleave.native="hideCheckTip"
        :textColor="'var(--color-121212)'"
        :color="'#fff'"
        :text="nl('page_common_buy_now')"
        :loading="buyNowLoading"
        :disable="disable"
      ></az-button>
      <check-tips v-show="showCheckTip" :tipsLeft="checkTipsLeftPosition" :tips="checkTips"></check-tips>
    </div>
    <div v-if="baseInfo.isRush == 1 && !(country == 'MX' && baseInfo.mxBdBatch)" style="margin-bottom: 10px;">
      <rush-desc></rush-desc>
    </div>
    <client-only>
      <div v-show="!beBackSoonGoods && deliveryInit" :class="['rush-delivery-box', { 'hide-delivery': isKKOutStock }]">
        <address-delivery-info
          ref="delivery"
          :baseInfo="baseInfo"
          :makeTimeInfo="makeTimeInfo"
          :goodsNumber="goodsNumber"
        ></address-delivery-info>
      </div>
      <add-cart-dialog @quickShop="quickShopClick" :goodsNumber="goodsNumber" v-if="showAddCartDialog"></add-cart-dialog>
      <NotifyMeDialog v-if="openNotifyMe" v-bind="notifyMeDialogValue" />
    </client-only>
  </div>
</template>

<script>
import sodExcitationMixins from '@/assets/js/sodExcitationMixins.js'
import styleMixins from '@/assets/js/styleMixins'
import ColorList from '@/components/product/style/ColorList'
import ColorLabel from '@/components/product/style/ColorLabel'
import SizeList from '@/components/product/style/SizeList'
import SizeLabel from '@/components/product/style/SizeLabel'
import SizeDetail from '@/components/product/style/SizeDetail'
import GoodsNumber from '@/components/product/style/GoodsNumber'
import CheckTips from '@/components/product/style/CheckTips'
import AzButton from '@/components/az-ui/AzButton'
import MeshLabel from '@/components/product/style/MeshLabel'
import StockTips from '@/components/product/style/StockTips'
import NotifyLabel from '@/components/product/style/NotifyLabel'
import NotifyDialog from '@/components/product/style/NotifyDialog'
import RetireLabel from '@/components/product/style/RetireLabel'
import RushDesc from '@/components/product/RushDesc'
import AddCartDialog from '@/components/cart/AddCartDialog'
import AddressDeliveryInfo from '@/components/product/AddressDeliveryInfo'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
// import ColorFamilyList from '@/components/product/style/ColorFamilyList'
import { countryList } from '@/assets/js/euSizeMap'

export default {
  name: 'StockStyle',
  languageKeys: [
    'page_sale_down_button',
    'page_notify_me',
    ...countryList.map((v, i) => 'page_garment_bags_price_desc_' + v),
    ...RetireLabel.languageKeys,
    ...NotifyDialog.languageKeys,
    ...NotifyLabel.languageKeys,
    ...SizeList.languageKeys,
    ...StockTips.languageKeys,
    ...MeshLabel.languageKeys,
    ...GoodsNumber.languageKeys,
    ...SizeLabel.languageKeys,
    ...ColorLabel.languageKeys,
    ...ColorList.languageKeys,
    ...RushDesc.languageKeys,
    ...AddCartDialog.languageKeys,
    ...AddressDeliveryInfo.languageKeys,
    ...NotifyMeDialog.languageKeys
    // ...ColorFamilyList.languageKeys
  ],
  components: {
    RetireLabel,
    NotifyDialog,
    NotifyLabel,
    StockTips,
    MeshLabel,
    CheckTips,
    AzButton,
    GoodsNumber,
    SizeDetail,
    SizeLabel,
    SizeList,
    ColorLabel,
    ColorList,
    RushDesc,
    AddCartDialog,
    AddressDeliveryInfo,
    NotifyMeDialog
    // ColorFamilyList
  },
  mixins: [styleMixins, sodExcitationMixins],
  data() {
    return {
      isStockGoods: true,
      disable: false,
      confirmSelected: false,
      sampleSimilarSize: '',
      showSampleSimilar: false,
      sampleSimilarData: [],
      disableNotifyMe: false // 是否禁用notifyme
    }
  },
  computed: {
    showColorNotify() {
      if (this.hasSize && ![1504].includes(+this.baseInfo.catId)) {
        // catId13 库存商品 hasSize 有outOfStockColorMap 无outOfStockSizeMap
        if (
          !([13].includes(+this.baseInfo.catId) && this.hasSize && this.stockInfo.outOfStockColorMap && !this.stockInfo.outOfStockSizeMap)
        ) {
          return false
        }
      }
      return this.stockInfo.outOfStockColorMap && this.stockInfo.outOfStockColorMap.hasOwnProperty(this.selectedColor.key)
    },
    maxStockNumber() {
      if (this.tipStatus.key == 'hasStock' || this.tipStatus.key == 'shipsImmediately') {
        return this.tipStatus.stockNumber
      } else if (this.tipStatus.key == 'default') {
        return this.baseInfo.maxSelectNumber
      } else {
        return 0
      }
    },
    // 当前商品是否是 防尘袋 需要定义
    isGarmentBags() {
      return this.baseInfo.catId == 1508
    }
  },
  watch: {
    currentColorSupportStock: {
      handler(newVal) {
        if (this.isSpecialCatId(this.baseInfo.catId) || this.baseInfo.brandId == 16) {
          if (newVal && (this.currentSizeSupportStock || this.selectedSize.key == '')) {
            this.$store.commit('product/setIsCurrentStyleSupportStock', true)
          } else {
            this.$store.commit('product/setIsCurrentStyleSupportStock', false)
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.disableNotifyMe = this.country == 'MX' && this.baseInfo.mxBdBatch
    if (this.baseInfo.catId == 1504) {
      this.solveDefaultSize()
    } else {
      this.checkSelect()
    }
    // 加购物车按钮
    this.setPoint('addtobag', 'addtobag', 'view')
    this.setPoint('buynow', 'buynow', 'view')
    // 设置complete the look 模块展示位置
    if (this.beBackSoonGoods) {
      this.getDeliveryInfo()
      this.setCompletePosition()
    }
  },
  methods: {
    solveDefaultSize() {
      if (this.baseInfo.catId == 1504 && this.sizeStock && this.sizeStock.length && this.styleInfo && this.styleInfo.styleInfoSizeMap) {
        const size = this.styleInfo.styleInfoSizeMap[this.sizeStock[0]]
        this.selectStockSize(size, size.isPlusSize)
      } else if (this.baseInfo.catId == 1504 && this.styleInfo.size && Object.keys(this.styleInfo.size).length) {
        const size = this.styleInfo.size[0]
        this.selectStockSize(size, size.isPlusSize)
      }
    },
    selectStockColor(color) {
      this.selectColor(color)
      this.$nextTick(() => {
        if (this.beBackSoonGoods) {
          this.$store.commit('product/setShowNotifyDialog', false)
          this.notifyMeSelectColor = color
          this.$store.commit('setOpenNotifyMe', true)
          return false
        }
        if (this.$refs.delivery) {
          this.$refs.delivery.getDeliveryInfo()
        }
      })
      if (this.baseInfo.catId == 1504 && !this.selectedSize.key) {
        this.solveDefaultSize()
      } else {
        this.checkSelect()
      }
    },
    addToBag() {
      if (!this.handleCheck()) return
      if (!this.allReady || this.tipStatus.stockNumber < this.goodsNumber) {
        return false
      }
      // 加车按钮不报错点击数量
      this.setDataLayer({
        category: 'DetailpgeAddtobag',
        action: 'click',
        label: 'DetailpgeAddtobag_Addtobag_Click2'
      })
      this.setPoint('addtobag', 'addtobag', 'click')
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
      if (this.baseInfo.supportStockSales && this.currentStyleSupportStock && this.isCurrentStyleSupportStock) {
        formData.set('styles[select][isSpecialStock]', 1)
      }
      if (this.hasColor) {
        // TODO: 在这里处理颜色styleId的前缀内容
        formData.set('styles[select][color]', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        formData.set('styles[select][sash_color]', this.selectedSashColor.styleId)
      }
      if (this.hasSize) {
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
      if (!this.allReady || this.tipStatus.stockNumber < this.goodsNumber) {
        return false
      }
      this.setPoint('buynow', 'buynow', 'click')
      this.buyNowLoading = true
      const formData = {}
      const stylesObject = {}
      const stylesSelectObject = {}
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
      if (this.baseInfo.supportStockSales && this.currentStyleSupportStock && this.isCurrentStyleSupportStock) {
        this.$set(stylesSelectObject, 'isSpecialStock', 1)
      }
      if (this.hasColor) {
        this.$set(stylesSelectObject, 'color', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        this.$set(stylesSelectObject, 'sash_color', this.selectedSashColor.styleId)
      }
      if (this.hasSize) {
        this.$set(stylesSelectObject, 'size', this.selectedSize.styleId)
      }
      if (this.baseInfo.discount && this.baseInfo.dressType === 'clearance') {
        this.$set(stylesSelectObject, 'discount', this.baseInfo.discount)
      }
      this.$set(formData, 'goods_number', this.goodsNumber)
      this.$set(stylesObject, 'select', stylesSelectObject)
      this.$set(formData, 'styles', stylesObject)
      this.buyNowAjax(formData)
    },
    // 兼容 商品没有库存，不调交期接口的问题
    getDeliveryInfo() {
      const _this = this
      const params = {
        goods_id: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        dress_type: this.baseInfo.dressType,
        province_id: '',
        color_style_id: this.selectedColor.styleId,
        size_style_id: this.selectedSize.styleId,
        goods_number: this.goodsNumber
      }
      if (this.baseInfo.dressType === 'clearance') {
        params.discount = -1
      }
      if (this.isCurrentStyleSupportStock) params.isSpecialStockGoods = 1 // DB库存
      this.$axios.$post('/1.0/delivery', params).then((res) => {
        if (res.code == 0) {
          const deliveryInfo = res.data.deliveryInfo
          _this.$store.commit('product/setMakeTimeInfo', deliveryInfo)
          // 保存Shipped to You交期时间
          _this.$store.commit('product/setShippingInfo', deliveryInfo.shippingInfo)
        }
      })
    },
    quickShopClick(params) {
      this.$emit('quickShop', params)
    }
  }
}
</script>

<style lang="less" scoped>
.stock-style {
  width: 100%;
  margin-top: 20px;
  &.wgd {
    display: flex;
    flex-direction: column;
    padding: 15px;
    margin-top: 17px;
    // background-color: #f7f7f7;
    box-sizing: border-box;
  }
  .rush-delivery-box {
    background-color: #f7f7f7;
    padding: 10px 15px;
    &.hide-delivery {
      background-color: unset;
      padding: 0;
      /deep/ .address-delivery-info {
        display: none;
      }
      /deep/ .delivery-time-content {
        display: none;
      }
    }
  }
  .garment {
    box-sizing: border-box;
    min-height: 40px;
    padding: 10px;
    margin-top: 15px;
    margin-bottom: 5px;
    background-color: var(--color-f1e9e6);
    font-size: 13px;
    line-height: 18px;
    margin-right: 25px;
  }
  .add-to-bag-block {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
    #notify-me.disabled {
      background: #ccc !important;
      cursor: not-allowed !important;
      pointer-events: none !important;
      &:hover {
        background: #ccc !important;
      }
    }
    .sold-out-btn {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      .az-icon {
        height: 22px;
        width: 22px;
      }
    }
  }
  .style-block {
    &.sample {
      background-color: var(--color-f9f9f9);
      margin-top: 12px;
      padding: 20px 10px 10px 10px;
    }
    &.clearance {
      background-color: var(--color-f9f9f9);
      margin-top: 12px;
      padding: 20px 10px 10px 10px;
    }
    // 最右边色块hover出现文字导致弹窗有滚动条
    /deep/.color-list {
      padding-right: 25px;
      box-sizing: border-box;
    }
  }
  #notify-me {
    flex: 1;
    padding: 13px 10px;
    margin-top: 24px;
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
    &.disabled {
      background: #ccc !important;
      cursor: not-allowed !important;
      pointer-events: none !important;
    }
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
    margin-top: 24px;
    height: 50px;
    font-family: @font-family-600;
    box-sizing: border-box;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    line-height: 25px;
    background: @theme-color!important;
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
    margin-top: 24px;
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
    color: @theme-color!important;
    &:hover {
      background-color: @btn-light-hover-color !important;
    }
    .az-icon {
      height: 13px;
      width: 18px;
      margin-right: 8px;
      margin-bottom: 1px;
      fill: currentColor;
    }
  }
  .goods-number {
    margin-top: 10px;
    .title {
      display: inline-block;
      margin-right: 8px;
      font-size: 13px;
      font-family: @font-family-500, sans-serif;
      color: var(--color-121212);
      text-transform: uppercase;
      line-height: 32px;
    }
  }
  &.sod-b {
    #notify-me {
      margin-top: 0 !important;
    }
  }
}
</style>
