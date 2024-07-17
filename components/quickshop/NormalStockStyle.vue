<template>
  <div :class="{ quick_shop: fromDialog }" class="color-hover-parent stock-style normal-stock-style">
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
        <!--详情页色系色圈 -->
        <color-family-list
          v-if="showProductColorFamily(stockColorsFormat.shown)"
          :productColorFamily="stockColorsFormat.shownColorFamily"
          :stock="colorStock"
          :colorLocalWarehouseStock="colorLocalWarehouseStock"
          :colors="stockColorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :support-stock-sales="true"
          :stock-info="stockInfo"
          @select-color="selectStockColor"
          :selectedColor="selectedColor"
          :baseInfo="baseInfo"
          :colorInfoId="colorInfoId"
        ></color-family-list>
        <color-list
          v-else
          :stock="colorStock"
          :colorLocalWarehouseStock="colorLocalWarehouseStock"
          :colors="stockColorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          :support-stock-sales="true"
          @select-color="selectStockColor"
        ></color-list>
      </div>
      <div v-if="hasSize" class="size-block">
        <size-label
          :is-stock-goods="isStockGoods"
          :is-groomsmen="baseInfo.isGroomsmen"
          :baseInfo="baseInfo"
          :hasSizeChart="hasSizeChart"
        ></size-label>

        <size-list
          :stock="sizeStock"
          :sizeLocalWarehouseStock="sizeLocalWarehouseStock"
          :size-hover-tip="sizeHoverTip"
          :sizes="sizes"
          :selected-size-id="selectedSize.styleId"
          :is-stock-goods="isStockGoods"
          :hide-size-map="hideSizeMap"
          :fromDialog="fromDialog"
          :support-stock-sales="true"
          @select-size="selectStockSize"
        ></size-list>
        <size-detail
          v-if="hasSizeChart"
          :is-stock-goods="isStockGoods"
          :size-chart="styleInfo.sizeChart"
          :selected-size="selectedSize.key"
          :unit="unit"
          @switch-unit="switchUnit"
        ></size-detail>
      </div>
      <stock-tips :tip-status="tipStatus" :is-sample="isSample" :is-clearance="isClearance" :supportStockSales="true"></stock-tips>
    </div>
    <div v-if="fromDialog === 'shopTheLook'" class="add-to-bag-block">
      <az-button
        v-track.view.click="{ common: [getBiParams('shopthelook'), getBiParams('shopthelook', baseInfo.catName)] }"
        @click="clickConfirm"
        @mouseenter.native="checkStyle(false)"
        @mouseleave.native="hideCheckTip"
        class="btn-confirm"
        >{{ nl('page_common_confirm') }}</az-button
      >
      <check-tips
        v-show="showCheckTip"
        :tipsLeft="checkTipsLeftPosition"
        :tips="checkTips"
        :style="{ top: '57px !important' }"
      ></check-tips>
    </div>
    <template v-else>
      <div class="add-to-bag-block">
        <!-- 购物车商品编辑 -->
        <az-button
          id="update-goods"
          v-if="fromDialog == 'cartEdit'"
          @click="editCartGoods"
          @mouseenter.native="checkStyle(true)"
          @mouseleave.native="hideCheckTip"
          :text="nl('page_common_update')"
          :loading="cartEditLoading"
          :disable="disable"
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
  </div>
</template>

<script>
import styleMixins from '@/assets/js/quickshopStyleMixins'
import ColorList from '@/components/quickshop/style/ColorList'
import ColorLabel from '@/components/quickshop/style/ColorLabel'
import SizeList from '@/components/quickshop/style/SizeList'
import SizeLabel from '@/components/quickshop/style/SizeLabel'
import SizeDetail from '@/components/quickshop/style/SizeDetail'
import CheckTips from '@/components/quickshop/style/CheckTips'
import AzButton from '@/components/az-ui/AzButton'
import StockTips from '@/components/quickshop/style/StockTips'
import ColorFamilyList from '@/components/product/style/ColorFamilyList'
// import { mapState } from 'vuex'

export default {
  name: 'NormalStockStyle',
  languageKeys: [...ColorFamilyList.languageKeys], // 同StockStyle
  components: {
    StockTips,
    CheckTips,
    AzButton,
    SizeDetail,
    SizeLabel,
    SizeList,
    ColorLabel,
    ColorList,
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
      confirmSelected: false
    }
  },
  computed: {
    stockColorsFormat() {
      const colors = {
        shown: {},
        priceColors: {},
        retireColors: {},
        shownColorFamily: {}
      }
      for (const key in this.styleInfo.color) {
        const color = this.styleInfo.color[key]
        if (this.stockInfo.colorMap && this.stockInfo.colorMap.hasOwnProperty(key)) {
          colors.shown[key] = color
        }
      }
      // 在详情页展示的色系模块数据，对应 colorsFormat.shown 的颜色模块，即普通的颜色
      if (this.styleInfo.colorFamily && colors.shown && Object.keys(colors.shown).length) {
        const shownColorList = Object.values(colors.shown).map((item) => {
          return item.key
        })
        const shownColorFamily = JSON.parse(JSON.stringify(this.styleInfo.colorFamily))
        for (const fKey in this.styleInfo.colorFamily) {
          const subColorList = this.styleInfo.colorFamily[fKey].subColorList || []
          shownColorFamily[fKey].subColorList = subColorList.filter((item) => {
            return item && shownColorList.includes(item.key)
          })
          if (!shownColorFamily[fKey].subColorList.length) {
            delete shownColorFamily[fKey]
          }
        }
        colors.shownColorFamily = shownColorFamily
      }
      return colors
    },
    maxStockNumber() {
      if (this.tipStatus.key == 'hasStock' || this.tipStatus.key == 'shipsImmediately') {
        return this.tipStatus.stockNumber
      } else if (this.tipStatus.key == 'default') {
        return this.baseInfo.maxSelectNumber
      } else {
        return 0
      }
    }
  },
  watch: {
    currentColorSupportStock: {
      handler(newVal) {
        if (newVal && (this.currentSizeSupportStock || this.selectedSize.key == '') && !this.customSizeSelected) {
          this.$store.commit('quickshop/setIsCurrentStyleSupportStock', true)
        } else {
          this.$store.commit('quickshop/setIsCurrentStyleSupportStock', false)
        }
      },
      immediate: true
    },
    isNormalStock(val) {
      if (val) {
        this.handleStockColorSize()
      }
    }
  },
  mounted() {
    this.checkSelect()
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
    handleStockColorSize() {
      // 左边有color size ，右边也有                       右边显示选中的颜色尺码
      // 左边有color右边有，左边有size右边没有   右边显示选中颜色，尺码为空
      // 左边有color右边没有                                  右边显示默认第一个颜色，尺码为空
      let colorflag = false
      let sizeFlag = false
      if (this.stockColorsFormat && this.stockColorsFormat.shown) {
        const colorsArr = Object.values(this.stockColorsFormat.shown)
        colorflag = colorsArr.some((element) => {
          return element.colorId == this.selectedColor.colorId
        })
        if (!colorflag) {
          // 设置BD库存默认颜色
          this.selectColor(colorsArr[0])
          this.selectSize({
            name: '',
            key: '',
            styleId: 0
          })
          this.$nextTick(() => {
            if (this.$refs.delivery) {
              this.$refs.delivery.getDeliveryInfo()
            }
          })
          this.checkSelect()
        }
      }

      if (this.sizes && this.sizes.length) {
        sizeFlag = this.sizes.some((element) => {
          return element.styleId == this.selectedSize.styleId
        })
        if (colorflag && !sizeFlag) {
          this.selectStockSize({
            name: '',
            key: '',
            styleId: 0
          })
        }
      }
    },
    selectStockColor(color) {
      this.selectColor(color)
      this.$nextTick(() => {
        if (this.$refs.delivery) {
          this.$refs.delivery.getDeliveryInfo()
        }
        this.checkSelect('color')
      })
    },
    selectStockSize(size) {
      this.selectSize(size)
      this.$nextTick(() => {
        if (this.$refs.delivery) {
          this.$refs.delivery.getDeliveryInfo()
        }
        this.checkSelect()
      })
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
      formData.set('styles[select][isSpecialStock]', 1)
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
        this.setPoint('addtobag', 'addtobag', 'click')
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
      // comments: 这个从购物车那边过来的 已经判断isSpecialStock=true了
      this.$set(stylesSelectObject, 'isSpecialStock', 1)
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
      this.$set(stylesSelectObject, 'isSpecialStock', 1)
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
      padding: 15px 0 20px 25px;
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
      background-color: @theme-color!important;
    }
    #buy-now {
      padding: 13px 10px;
      width: 263px;
      height: 50px;
      margin-top: 5px;
      margin-left: 0;
      border: 1px solid @theme-color;
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
  /deep/.unavailable {
    display: none;
  }
}
</style>
