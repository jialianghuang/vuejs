<template>
  <div :class="{ quick_shop: fromDialog }" class="stock-style">
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
    <div :class="{ dressType, quick_shop: fromDialog }" class="style-block">
      <div v-if="hasColor" class="color-block">
        <color-label
          :selected-color="selectedColor"
          :shop-more="shopMore"
          :is-dress="baseInfo.isDress"
          :fromDialog="fromDialog"
          :baseInfo="baseInfo"
          :colorLocalWarehouseStock="colorLocalWarehouseStock"
        ></color-label>
        <template v-if="showColorNotify && !!Object.keys(colorNotifyOption).length && !baseInfo.fromRedeemed">
          <notify-label
            @click="changeDialogStatus"
            :is-sample="isSample"
            :is-stock-goods="isStockGoods"
            :stock="colorStock"
            type="color"
          ></notify-label>
        </template>
        <!--详情页色系色圈 -->
        <color-family-list
          v-if="showProductColorFamily(colorsFormat.shown)"
          :productColorFamily="colorsFormat.shownColorFamily"
          :stock="colorStock"
          :colorLocalWarehouseStock="colorLocalWarehouseStock"
          :support-stock-sales="supportStockSales"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          @select-color="selectStockColor"
          :selectedColor="selectedColor"
          :baseInfo="baseInfo"
          :colorInfoId="colorInfoId"
          :fromQuickShop="true"
        ></color-family-list>
        <color-list
          v-else
          :stock="colorStock"
          :colorLocalWarehouseStock="colorLocalWarehouseStock"
          :support-stock-sales="supportStockSales"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          @select-color="selectStockColor"
        ></color-list>
        <template v-if="baseInfo.hasPriceRule && colorsFormat.priceColors && Object.keys(colorsFormat.priceColors).length">
          <mesh-label></mesh-label>
          <color-list
            :stock="colorStock"
            :colorLocalWarehouseStock="colorLocalWarehouseStock"
            :support-stock-sales="supportStockSales"
            :colors="colorsFormat.priceColors"
            :selected-color-id="selectedColor.styleId"
            :is-stock-goods="isStockGoods"
            :stock-info="stockInfo"
            @mesh-color="selectMeshColor"
            @select-color="selectStockColor"
          ></color-list>
        </template>
        <template
          v-if="retireInfo.hasOwnProperty('retireColor') && colorsFormat.retireColors && Object.keys(colorsFormat.retireColors).length"
        >
          <retire-label :retire-info="retireInfo"></retire-label>
          <color-list
            :stock="colorStock"
            :colorLocalWarehouseStock="colorLocalWarehouseStock"
            :support-stock-sales="supportStockSales"
            :colors="colorsFormat.retireColors"
            :selected-color-id="selectedColor.styleId"
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
        <template v-if="showSizeNotify && !!Object.keys(sizeNotifyOption).length && !baseInfo.fromRedeemed">
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
          :fromDialog="fromDialog"
          @select-size="selectStockSize"
        ></size-list>
        <!-- 3分类的商品，只有在cart和showroom页面的quickshop才会展示 size-detail -->
        <size-detail
          v-if="
            hasSizeChart &&
              (!isSpecialCatId(baseInfo.catId) ||
                (isSpecialCatId(baseInfo.catId) && ['showroom', 'cart'].includes($route.name) && sodDetailVersionFun(baseInfo)))
          "
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
          :fromDialog="fromDialog"
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
        v-if="baseInfo.numberSelectable && fromDialog !== 'shopTheLook'"
        :fromDialog="fromDialog"
        :max="baseInfo.maxSelectNumber"
        :stock-number="maxStockNumber"
        :goods-number="goodsNumber"
        @change-qty="changeQty"
      ></goods-number>
      <stock-tips :tip-status="tipStatus" :is-sample="isSample" :is-clearance="isClearance"></stock-tips>
    </div>
    <template v-if="baseInfo.isRush == 1">
      <rush-desc></rush-desc>
    </template>

    <div v-if="fromDialog === 'shopTheLook'" class="add-to-bag-block">
      <az-button
        v-track.view.click="{ common: [getBiParams('shopthelook'), getBiParams('shopthelook', baseInfo.catName)] }"
        @click="clickConfirm"
        @mouseenter.native="checkStyle(false)"
        @mouseleave.native="hideCheckTip"
        class="btn-confirm"
        >{{ nl('page_common_confirm') }}</az-button
      >
      <check-tips v-if="showCheckTip" :tipsLeft="checkTipsLeftPosition" :tips="checkTips" :style="{ top: '57px !important' }"></check-tips>
    </div>
    <template v-else>
      <div v-if="showNotifyMeBtn && !baseInfo.isFinalSale" class="add-to-bag-block">
        <az-button
          id="notify-me"
          v-track.view.click="getNotifyMeParams(baseInfo)"
          :class="{ disabled: disableNotifyMe }"
          @click="changeDialogStatus"
          :text="fromDialog === 'cartFreeGift' ? nl('page_common_sold_out') : nl('page_notify_me')"
          icon="icon-icon_notice"
          class="notify-btn"
        ></az-button>
      </div>
      <div v-else class="add-to-bag-block">
        <!-- 购物车商品编辑 -->
        <az-button
          id="update-goods"
          v-if="fromDialog == 'cartEdit'"
          @click="editCartGoods"
          @mouseenter.native="checkStyle(true)"
          @mouseleave.native="hideCheckTip"
          :text="nl('page_common_update')"
          :loading="cartEditLoading"
          icon="icon-icon_edit"
        ></az-button>
        <!-- from 购物车 free gift 弹窗点击  -->
        <az-button
          id="choose-it-btn"
          v-else-if="fromDialog === 'cartFreeGift'"
          @click="addToBag"
          @mouseenter.native="checkStyle(false)"
          @mouseleave.native="hideCheckTip"
          :text="nl('page_common_choose_it')"
          :loading="chooseItLoading"
          class="choose-it-btn"
          icon="icon-xxy_add_to_bag"
        ></az-button>

        <template v-else>
          <az-button
            id="add-to-bag"
            v-track.viewOnce.click="
              isExcitationLoading
                ? getCommons('sodaddtobag', 'sodquickshop', 'stimulateaddquick', 'stimulateaddquick', 'quickshop-add-to-bag')
                : {}
            "
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
            v-track.viewOnce.click="
              isExcitationLoading
                ? getCommons('sodbuynow', 'sodquickshop', 'stimulatebuyquick', 'stimulatebuyquick', 'quickshop-buy-now')
                : {}
            "
            v-if="!['product', 'cart', 'youmayalsolike', 'redeemed'].includes(fromDialog) || continueCheckoutShow"
            @click="buyNow"
            @mouseenter.native="checkStyle(true)"
            @mouseleave.native="hideCheckTip"
            :textColor="'var(--color-121212)'"
            :color="'#fff'"
            :text="nl('page_common_buy_now')"
            :loading="buyNowLoading"
            :disable="disable"
            :icon="isBridal ? 'iconicon_buy_now-bridal' : 'iconicon_buy_now'"
          ></az-button>
        </template>
        <check-tips v-show="showCheckTip" :tipsLeft="checkTipsLeftPosition" :tips="checkTips"></check-tips>
      </div>
    </template>
    <NotifyMeDialog v-if="openNotifyMe" v-bind="notifyMeDialogValue" />
  </div>
</template>

<script>
import styleMixins from '@/assets/js/quickshopStyleMixins'
import ColorList from '@/components/quickshop/style/ColorList'
import ColorLabel from '@/components/quickshop/style/ColorLabel'
import SizeList from '@/components/quickshop/style/SizeList'
import SizeLabel from '@/components/quickshop/style/SizeLabel'
import SizeDetail from '@/components/quickshop/style/SizeDetail'
import GoodsNumber from '@/components/quickshop/style/GoodsNumber'
import CheckTips from '@/components/quickshop/style/CheckTips'
import AzButton from '@/components/az-ui/AzButton'
import MeshLabel from '@/components/quickshop/style/MeshLabel'
import StockTips from '@/components/quickshop/style/StockTips'
import NotifyLabel from '@/components/quickshop/style/NotifyLabel'
import RetireLabel from '@/components/quickshop/style/RetireLabel'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import NotifyDialog from '@/components/product/style/NotifyDialog'
// import webPush from '@/plugins/pushengage'
import RushDesc from '@/components/quickshop/RushDesc'
import ColorFamilyList from '@/components/product/style/ColorFamilyList'
import { countryList } from '@/assets/js/euSizeMap'
// import { mapState } from 'vuex'

export default {
  name: 'StockStyle',
  languageKeys: [
    'page_common_update',
    'page_common_choose_it',
    'page_order_add2bag',
    'page_common_confirm',
    ...countryList.map((v, i) => 'page_garment_bags_price_desc_' + v),
    ...RetireLabel.languageKeys,
    ...NotifyDialog.languageKeys,
    ...NotifyLabel.languageKeys,
    ...StockTips.languageKeys,
    ...MeshLabel.languageKeys,
    ...GoodsNumber.languageKeys,
    ...SizeLabel.languageKeys,
    ...ColorLabel.languageKeys,
    ...ColorList.languageKeys,
    ...RushDesc.languageKeys,
    ...NotifyMeDialog.languageKeys,
    ...ColorFamilyList.languageKeys
  ],
  components: {
    AzButton,
    RetireLabel,
    NotifyDialog,
    NotifyLabel,
    StockTips,
    MeshLabel,
    CheckTips,
    GoodsNumber,
    SizeDetail,
    SizeLabel,
    SizeList,
    ColorLabel,
    ColorList,
    RushDesc,
    NotifyMeDialog,
    ColorFamilyList
  },
  mixins: [styleMixins],
  props: {
    scene: {
      type: String,
      default: ''
    } // 使用场景值，较细的场景类型
  },
  data() {
    return {
      continueCheckoutShow: false,
      isStockGoods: true,
      disable: false,
      tipStatus: {
        key: 'default',
        stockNumber: 0,
        tipsRed: false,
        statusRed: false
      },
      confirmSelected: false,
      sampleSimilarSize: '',
      showSampleSimilar: false,
      sampleSimilarData: []
    }
  },
  computed: {
    showColorNotify() {
      if (this.giftActivityId || this.fromDialog == 'cartFreeGift' || this.baseInfo.isFinalSale) {
        // 如果是买赠活动的赠品quick shop 弹窗，不展示
        return false
      } else if ((this.hasSize || this.isClearance) && ![1504].includes(+this.baseInfo.catId)) {
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
        setTimeout(() => {
          if (this.isSpecialCatId(this.baseInfo.catId)) {
            if (newVal && (this.currentSizeSupportStock || this.selectedSize.key == '')) {
              this.$store.commit('quickshop/setShowSticker', true)
              this.$store.commit('quickshop/setIsCurrentStyleSupportStock', true)
            } else {
              this.$store.commit('quickshop/setShowSticker', false)
              this.$store.commit('quickshop/setIsCurrentStyleSupportStock', false)
            }
          }
        }, 0)
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
  },
  methods: {
    getBiParams(ec, catName) {
      if (process.server) return
      let el = 'update'
      if (this.scene === 'shopLookUpdate') {
        el = 'update'
        if (catName) el = catName + '_update'
      } else if (this.scene === 'shopLookConfirm') {
        el = 'list_item_confirm'
        if (catName) return
      }
      const obj = {
        ec,
        el
      }
      return obj
    },
    clickConfirm() {
      if (!this.allReady || this.tipStatus.stockNumber < this.goodsNumber) {
        return false
      }
      this.$emit('onConfirm', {
        goodsId: this.baseInfo.goodsId,
        baseInfo: this.baseInfo,
        imageInfo: this.imageInfo,
        styleInfo: this.styleInfo,
        selectedColor: this.selectedColor,
        selectedSize: this.selectedSize
      })
    },
    // mesh color 选择打点
    selectMeshColor() {
      this.buryPoint(this, 'event', {
        ec: 'color',
        el: 'mesh',
        ea: 'click',
        msg: JSON.stringify({
          cat_id: this.baseInfo.catId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType
        })
      })
    },
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
          this.showNotifyDialog = false
          this.notifyMeSelectColor = color
          if (!this.baseInfo.isFinalSale) {
            this.$store.commit('setOpenNotifyMe', true)
          }
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
      if (!this.allReady || this.tipStatus.stockNumber < this.goodsNumber) {
        return false
      }
      const formData = new FormData()
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

      // 因为买赠活动赠品的弹窗，入参跟加车是一样的，为了整合代码，这里加判断走不同的接口
      if (this.fromDialog == 'cartFreeGift') {
        // 买赠的赠品点击quickshop
        this.chooseItLoading = true
        this.chooseItAjax(formData)
      } else {
        this.loading = true
        formData.set('act', 'addGoodsToCart')
        this.addToBagAjax(formData)
        this.trackAddToCart({
          goodsId: this.baseInfo.goodsId,
          colorId: this.baseInfo.colorId,
          value: this.baseInfo.noDealPrice
        })
        // quickshop弹窗里面之前的打点整理在这下面
        // 加车按钮不报错点击数量
        this.setDataLayer({
          category: 'DetailpgeAddtobag',
          action: 'click',
          label: 'DetailpgeAddtobag_Addtobag_Click2'
        })
        const msg = {
          goodsId: this.baseInfo.goodsId,
          color: this.selectedColor.key,
          size: this.selectedSize.key,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType,
          cat_id: this.baseInfo.catId
        }
        if (this.indexNo) {
          msg.no = this.indexNo
          msg.sort_by = this.sortBy
        }
        const isVersionB = this.sodDetailVersionFun(this.baseInfo)
        msg.ab = 'a'
        if (isVersionB) {
          msg.ab = 'b'
        }
        const tempDiscount = this.baseInfo.discount
        if (tempDiscount && this.baseInfo.dressType === 'clearance') {
          msg.discount = 10 - tempDiscount
        }
        this.buryPoint(this, 'event', {
          ec: 'addtobag',
          el: 'addtobag',
          ea: 'click',
          msg: JSON.stringify(msg),
          param2: this.versionObj.productColorSort
        })
        if (this.fromDialog == 'product') this.setOrderSourceFlag('detailpagequickshop', true)
      }
      if (this.scene == 'product') {
        // 详情页often_bought_with加购订单追踪goodsid
        this.setOrderSourceFlagWithGoodsId('often_bought_with', this.baseInfo.goodsId)
      }
    },
    buyNow() {
      if (!this.allReady || this.tipStatus.stockNumber < this.goodsNumber) {
        return false
      }
      const isVersionB = this.sodDetailVersionFun(this.baseInfo)
      this.buryPoint(this, 'event', {
        ec: 'buynow',
        el: 'buynow',
        ea: 'click',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.selectedColor.key,
          cat_id: this.baseInfo.catId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType,
          ab: isVersionB ? 'B' : 'A'
        })
      })
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
      if (this.fromDialog == 'product') this.setOrderSourceFlag('detailpagequickshop', true)
      this.$set(formData, 'goods_number', this.goodsNumber)
      this.$set(stylesObject, 'select', stylesSelectObject)
      this.$set(formData, 'styles', stylesObject)
      this.buyNowAjax(formData)
    },
    editCartGoods() {
      if (!this.allReady || this.tipStatus.stockNumber < this.goodsNumber) {
        return false
      }
      this.cartEditLoading = true
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
      //  换购模块商品更新
      if (this.fromDialog === 'redeemed' || this.baseInfo.fromRedeemed) {
        this.$set(stylesObject, 'bundleExchangeVersion', this.versionObj.cartTyingAbtest.toLowerCase())
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
      this.cartEditAjax(formData)
    },
    addToBagDot() {
      this.setDataLayer({
        category: 'PC_DetailPageRevision',
        action: 'click',
        label: 'DetailPageA_AddToBagSuccess_Click'
      })
      this.setDataLayer({
        category: 'CountryAddtoBag_Click',
        action: 'click',
        label: this.country + '_AllCountryAddtoBag_Click'
      })
      let eventName = ''
      switch (this.cat_id) {
        case 7:
        case 45:
        case 158:
        case 9:
        case 139:
          eventName = 'Bridesmaid_AddtoBag_Click'
          break
        case 2:
          eventName = 'Bride_AddtoBag_Click'
          break
        case 8:
          eventName = 'MBD_AddtoBag_Click'
          break
        case 138:
          eventName = 'GroomAcc_AddtoBag_Click'
          break
        case 13:
          eventName = 'Wrap_AddtoBag_Click'
          break
        case 15:
          eventName = 'Sash_AddtoBag_Click'
          break
        case 6:
          eventName = 'WeddingVeil_AddtoBag_Click'
          break
      }
      if (eventName != '') {
        this.setDataLayer({
          category: 'AddtoBag',
          action: 'click',
          label: eventName
        })
      }
      eventName = ''
      switch (this.baseInfo.catId) {
        case 7:
        case 45:
        case 158:
        case 139:
          eventName = 'BD_DetailPageAddtoBag'
          break
        case 9:
          eventName = 'Junior_DetailPageAddtoBag'
          break
        case 2:
          eventName = 'WD_DetailPageAddtoBag'
          break
        case 8:
          eventName = 'MOB_DetailPageAddtoBag'
          break
        case 107:
        case 40:
        case 138:
        case 13:
        case 15:
        case 6:
        case 37:
          eventName = 'ACC_DetailPageAddtoBag'
          break
      }
      if (eventName != '') {
        this.setDataLayer({
          category: 'DetailPageAddtoBag',
          action: 'click',
          label: eventName
        })
      }
    },
    getCommons(ec, el, ec2, el2, type) {
      const common = [this.trackParams(ec, el, 'sod').common]
      const baseInfo = this.baseInfo
      common.push(
        this.getExcitationParams(
          ec2,
          el2,
          baseInfo,
          this.getExcitationSticker(baseInfo).text,
          this.fromDialog + 'quickshop',
          baseInfo.driveInfo && baseInfo.driveInfo.listSticker
        ).common
      )
      return {
        id: baseInfo.goodsId + baseInfo.color + baseInfo.goodsUrl + type + this.fromDialog + 'quickshop' + this.isExcitationLoading,
        common
      }
    }
  }
}
</script>

<style lang="less" scoped>
.stock-style {
  width: 100%;
  .garment {
    box-sizing: border-box;
    // width: 100%;
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
    #notify-me.disabled {
      background: #ccc !important;
      cursor: not-allowed !important;
      pointer-events: none !important;
      &:hover {
        background: #ccc !important;
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
    width: 80%;
    max-width: 285px;
    padding: 13px 10px;
    margin-top: 5px;
    height: 50px;
    font-family: @font-family-600;
    box-sizing: border-box;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    line-height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: @theme-color!important;
    &:hover {
      background-color: @btn-hover-color !important;
    }
    &.disabled {
      background: #ccc !important;
      cursor: not-allowed !important;
      pointer-events: none !important;
      &:hover {
        background-color: #ccc !important;
      }
    }
    /deep/ .az-icon {
      height: 22px;
      width: 22px;
      margin-right: 8px;
      fill: currentColor;
    }
  }
  #add-to-bag {
    width: 80%;
    max-width: 285px;
    padding: 13px 10px;
    margin-top: 24px;
    height: 50px;
    font-family: @font-family-600;
    box-sizing: border-box;
    text-transform: uppercase;
    font-size: 14px;
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
    width: 80%;
    max-width: 285px;
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
  #update-goods,
  .choose-it-btn {
    width: 80%;
    max-width: 285px;
    padding: 13px 10px;
    margin-top: 4px;
    height: 50px;
    font-family: @font-family-600;
    box-sizing: border-box;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    line-height: 25px;
    background-color: @theme-color!important;
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
  .btn-confirm {
    width: 80%;
    max-width: 285px;
    height: 50px;
    padding: 13px 10px;
    font-family: @font-family-600;
    font-size: 14px;
    line-height: 24px;
  }
  // quickshop弹窗内样式兼容
  &.quick_shop {
    .style-block {
      padding: 15px 20px 10px;
      background: var(--color-f9f9f9);
      margin-bottom: 20px;
      margin-top: 10px;
      color: var(--color-121212);
    }
    /deep/ .az-select-input input {
      background-color: #fff;
    }
    #shipping {
      margin-top: 15px;
    }
    .delivery_date_details {
      padding-top: 6px;
      // padding-bottom: 15px;
    }
    .add-to-bag-block {
      justify-content: flex-start;
    }
    #add-to-bag {
      padding: 13px 10px;
      width: 263px;
      height: 50px;
      margin-right: 10px;
      margin-top: 5px;
      background-color: @theme-color;
    }
    #buy-now {
      padding: 13px 10px;
      width: 263px;
      height: 50px;
      margin-top: 5px;
      margin-left: 0;
      color: @theme-color!important;
      &:hover {
        background-color: @btn-light-hover-color !important;
      }
    }
    #continue-shopping,
    #continue-checkout {
      margin-top: 5px;
      display: inline-block;
      font-size: 14px;
      box-sizing: border-box;
      text-transform: uppercase;
      padding: 13px 10px;
      width: 240px;
      height: 50px;
      margin-right: 10px;
      font-family: @font-family-600;
    }
    #continue-shopping {
      border: 1px solid @title-color;
      &:hover {
        border: 1px solid @btn-hover-color;
        background-color: var(--color-f1e9e6) !important;
      }
    }
    #continue-checkout {
      margin-left: 5px;
      border: 1px solid @theme-color;
      &:hover {
        border: 1px solid @btn-hover-color;
        background-color: @btn-hover-color !important;
      }
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
}
</style>
