<template>
  <div :class="{ quick_shop: fromDialog }" class="color-hover-parent sample-style">
    <div :class="fromDialog" class="style-block">
      <div v-if="hasSize" class="size-block">
        <size-label :is-stock-goods="isStockGoods" :baseInfo="baseInfo" :fromDialog="fromDialog" :hasSizeChart="hasSizeChart"></size-label>
        <notify-dialog
          @show-notify-dialog="changeDialogStatus"
          :show-dialog="showNotifyDialog"
          :baseInfo="baseInfo"
          :is-sample="isSample"
          v-bind="notifyBindValue"
        ></notify-dialog>
        <template v-if="showSizeNotifyLabel && !baseInfo.fromRedeemed">
          <notify-label @click="changeDialogStatus" :is-sample="isSample" :is-stock-goods="isStockGoods" :stock="sizeStock"></notify-label>
        </template>
        <div v-if="isClearance && baseInfo.catId != 18" class="new-dress">
          {{ nl('page_common_size_order_new_part') }}
          <a :href="countryUrl(baseInfo.goodsDefaultUrl)" @click="setPoint('newdress', 'newdress', 'click')">{{
            nl('page_common_new_dress')
          }}</a>
          {{ nl('page_common_here') }}
        </div>
        <size-list
          :stock="sizeStock"
          :size-hover-tip="sizeHoverTip"
          :sizes="sizes"
          :selected-size-id="selectedSize.styleId"
          :is-stock-goods="isStockGoods"
          :hide-size-map="hideSizeMap"
          @select-size="selectStockSize"
        ></size-list>
      </div>
      <div v-if="hasColor" class="color-block">
        <color-label :selected-color="selectedColor" :shop-more="shopMore" :is-dress="baseInfo.isDress" :baseInfo="baseInfo"></color-label>
        <template v-if="showColorNotifyLabel && !baseInfo.fromRedeemed">
          <notify-label @click="changeDialogStatus" :is-sample="isSample" :is-stock-goods="isStockGoods" :stock="colorStock"></notify-label>
        </template>
        <!--详情页色系色圈 -->
        <color-family-list
          v-if="showProductColorFamily(colorsFormat.shown)"
          :productColorFamily="colorsFormat.shownColorFamily"
          :stock="colorStock"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          @select-color="selectStockColor"
          :selectedColor="selectedColor"
          :baseInfo="baseInfo"
          :colorInfoId="colorInfoId"
        ></color-family-list>
        <color-list
          v-else
          :stock="colorStock"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          @select-color="selectStockColor"
        ></color-list>
      </div>
      <div v-if="baseInfo.hasSash" class="sash-block">
        <color-label
          :selected-color="selectedSashColor"
          :fromDialog="fromDialog"
          :shop-more="baseInfo.shopMore"
          :is-sash-color="true"
          :baseInfo="baseInfo"
        ></color-label>
        <color-list
          :stock="sashStock"
          :colors="sashColorsFormat.shown"
          :selected-color-id="selectedSashColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          @select-color="selectStockSashColor"
          @select-same-as-dress="changeSameAsDress"
        ></color-list>
      </div>
      <stock-tips
        :tip-status="tipStatus"
        :is-sample="isSample"
        :is-clearance="isClearance"
        :show-sample-similar="showSampleSimilar"
      ></stock-tips>
      <similar-sample v-if="showSampleSimilar" :sample-data="sampleSimilarData"></similar-sample>
      <template v-if="!beBackSoonGoods && !(baseInfo.isFinalSale && showNotifyMeBtn)">
        <sample-confirm @click="check" :selected="confirmSelected" :base-info="baseInfo"></sample-confirm>
      </template>
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
      <div v-if="showNotifyMeBtn" class="add-to-bag-block">
        <az-button
          id="sold-out"
          v-if="isClearance || baseInfo.isFinalSale"
          :disable="true"
          :text="nl('page_common_sold_out')"
          class="sold-out-btn"
        ></az-button>
        <az-button
          id="notify-me"
          v-track.view.click="getNotifyMeParams(baseInfo)"
          v-else-if="!baseInfo.isFinalSale"
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
          @mouseenter.native="checkStyle(false)"
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
            v-if="
              !(continueCheckoutShow ? ['product', 'cart', 'youmayalsolike'] : ['product', 'cart', 'youmayalsolike', 'redeemed']).includes(
                fromDialog
              )
            "
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
      <sample-link v-if="showSampleLink" :baseInfo="baseInfo"></sample-link>
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
import CheckTips from '@/components/quickshop/style/CheckTips'
import AzButton from '@/components/az-ui/AzButton'
import StockTips from '@/components/quickshop/style/StockTips'
import NotifyLabel from '@/components/quickshop/style/NotifyLabel'
import SampleConfirm from '@/components/product/style/SampleConfirm'
import SimilarSample from '@/components/quickshop/style/SimilarSample'
import NotifyDialog from '@/components/product/style/NotifyDialog'
// import webPush from '@/plugins/pushengage'
import SampleLink from '@/components/quickshop/style/SampleLink'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import ColorFamilyList from '@/components/product/style/ColorFamilyList'
// import { mapState } from 'vuex'

export default {
  name: 'SampleStyle',
  languageKeys: [
    'page_common_size_order_new_part',
    'page_common_new_dress',
    'page_common_here',
    'page_common_sold_out',
    'page_notify_me',
    'page_common_update',
    'page_common_choose_it',
    'page_order_add2bag',
    'page_common_buy_now',
    ...SampleLink.languageKeys,
    ...SimilarSample.languageKeys,
    ...SampleConfirm.languageKeys,
    ...NotifyDialog.languageKeys,
    ...NotifyLabel.languageKeys,
    ...StockTips.languageKeys,
    ...SizeLabel.languageKeys,
    ...ColorLabel.languageKeys,
    ...ColorList.languageKeys,
    ...NotifyMeDialog.languageKeys,
    ...ColorFamilyList.languageKeys
  ],
  components: {
    SampleLink,
    SimilarSample,
    SampleConfirm,
    NotifyDialog,
    NotifyLabel,
    StockTips,
    CheckTips,
    AzButton,
    SizeLabel,
    SizeList,
    ColorLabel,
    ColorList,
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
      showNotifyDialog: false,
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
      } else if (this.hasSize || this.isClearance) {
        return false
      }
      return this.stockInfo.outOfStockColorMap && this.stockInfo.outOfStockColorMap.hasOwnProperty(this.selectedColor.key)
    }
  },
  mounted() {
    this.checkSelect()
    // add to bag 按钮打点
    this.setPoint('addtobag', 'addtobag', 'view')
    this.setPoint('buynow', 'buynow', 'view')
    if (this.isClearance && this.baseInfo.catId != 18) {
      this.setPoint('newdress', 'newdress', 'view')
    }
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
      this.checkSelect()
    },
    check() {
      this.confirmSelected = !this.confirmSelected
    },
    getSampleSimilar() {
      if (this.sampleSimilarSize != this.selectedSize.key) {
        this.sampleSimilarSize = this.selectedSize.key
        const url =
          '/1.0/recommend/sample-similar?goods_id=' +
          this.baseInfo.goodsId +
          '&cat_id=' +
          this.baseInfo.catId +
          '&size=' +
          this.sampleSimilarSize +
          '&cat_name' +
          this.baseInfo.catName
        this.$axios.$get(url).then((res) => {
          if (res.code == 0) {
            this.sampleSimilarData = res.data
            this.showSampleSimilar = true
          }
        })
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
      if (this.hasColor) {
        formData.set('styles[select][color]', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        formData.set('styles[select][sash_color]', this.selectedSashColor.styleId)
      }
      if (this.hasSize) {
        formData.set('styles[select][size]', this.selectedSize.styleId)
      }
      formData.set('styles[other][agree_sample_dress_terms_and_conditions]', 'yes')
      formData.set('styles[select][rent_product]', this.baseInfo.goodsName)
      if (this.isSample) {
        formData.set('styles[select][sample_source]', this.country)
      }
      if (this.baseInfo.dressType == 'clearance') {
        formData.set('styles[select][isClearance]', true)
        if (this.baseInfo.discount) {
          formData.set('styles[select][discount]', this.baseInfo.discount)
        }
      }
      if (this.baseInfo.dressType == 'outlet') {
        formData.set('styles[select][isOutlet]', true)
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
      const stylesOtherObject = {}
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
      if (this.hasColor) {
        this.$set(stylesSelectObject, 'color', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        this.$set(stylesSelectObject, 'sash_color', this.selectedSashColor.styleId)
      }
      if (this.hasSize) {
        this.$set(stylesSelectObject, 'size', this.selectedSize.styleId)
      }
      this.$set(stylesOtherObject, 'agree_sample_dress_terms_and_conditions', 'yes')
      if (['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType)) {
        this.$set(stylesSelectObject, 'rent_product', this.baseInfo.goodsName)
      }
      if (this.isSample) {
        this.$set(stylesSelectObject, 'sample_source', this.country)
      }
      if (this.baseInfo.dressType == 'clearance') {
        this.$set(stylesSelectObject, 'isClearance', true)
        if (this.baseInfo.discount) {
          this.$set(stylesSelectObject, 'discount', this.baseInfo.discount)
        }
      }
      if (this.baseInfo.dressType == 'outlet') {
        this.$set(stylesSelectObject, 'isOutlet', true)
      }
      if (this.fromDialog == 'product') this.setOrderSourceFlag('detailpagequickshop', true)
      this.$set(formData, 'goods_number', this.goodsNumber)
      this.$set(stylesObject, 'select', stylesSelectObject)
      this.$set(stylesObject, 'other', stylesOtherObject)
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
      const stylesOtherObject = {}
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
      if (this.hasColor) {
        this.$set(stylesSelectObject, 'color', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        this.$set(stylesSelectObject, 'sash_color', this.selectedSashColor.styleId)
      }
      if (this.hasSize) {
        this.$set(stylesSelectObject, 'size', this.selectedSize.styleId)
      }
      this.$set(stylesOtherObject, 'agree_sample_dress_terms_and_conditions', 'yes')
      this.$set(stylesSelectObject, 'rent_product', this.baseInfo.goodsName)
      if (this.isSample) {
        this.$set(stylesSelectObject, 'sample_source', this.country)
      }
      if (this.baseInfo.dressType == 'clearance') {
        if (this.baseInfo.discount) {
          this.$set(stylesSelectObject, 'discount', this.baseInfo.discount)
        }
        this.$set(stylesSelectObject, 'isClearance', true)
      }
      if (this.baseInfo.dressType == 'outlet') {
        this.$set(stylesSelectObject, 'isOutlet', true)
      }
      this.$set(formData, 'goods_number', this.goodsNumber)
      this.$set(stylesObject, 'select', stylesSelectObject)
      this.$set(stylesObject, 'other', stylesOtherObject)
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
      if (this.isSample) {
        if (this.baseInfo.catId == 2) {
          eventName = 'BrideSample_AddtoBag_Click'
        } else if (this.baseInfo.catId == 8) {
          eventName = 'MBDSample_AddtoBag_Click'
        } else {
          eventName = 'BridesmaidSample_AddtoBag_Click'
        }
      } else {
        eventName = 'BridesmaidClearance_AddtoBag_Click'
      }
      if (eventName != '') {
        this.setDataLayer({
          category: 'AddtoBag',
          action: 'click',
          label: eventName
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sample-style {
  width: 100%;
  .add-to-bag-block {
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  .style-block {
    background-color: var(--color-f9f9f9);
    margin-top: 12px;
    padding: 20px 10px 10px 10px;
    .size-block {
      .new-dress {
        padding-bottom: 6px;
        a {
          cursor: pointer;
          text-decoration: underline;
          color: var(--color-121212);
          &:hover {
            color: @theme-color;
          }
        }
      }
    }
  }
  #sold-out,
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
    background: @theme-color;
    &:hover {
      background-color: @btn-hover-color;
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
      padding: 15px 20px 5px;
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
}
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
</style>
