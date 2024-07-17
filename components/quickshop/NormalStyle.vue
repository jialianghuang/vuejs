<template>
  <div :class="{ quick_shop: fromDialog }" class="color-hover-parent normal-style">
    <div :class="['normal-style-block', { 'no-style': noStyle, 'has-custom-size': styleInfo.customSize && hasCustomeSize }]">
      <div v-if="hasColor" class="color-block">
        <color-label
          :selected-color="selectedColor"
          :is-dress="baseInfo.isDress"
          :is-coming-soon="baseInfo.isComingSoon"
          :shop-more="shopMore"
          :fromDialog="fromDialog"
          :baseInfo="baseInfo"
        ></color-label>
        <!--详情页色系色圈 -->
        <color-family-list
          v-if="showProductColorFamily(colorsFormat.shown)"
          :productColorFamily="colorsFormat.shownColorFamily"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :stock-info="stockInfo"
          @select-color="selectColor"
          :showSwatchBtn="true"
          :selectedColor="selectedColor"
          :baseInfo="baseInfo"
          :colorInfoId="colorInfoId"
          :fromQuickShop="true"
        ></color-family-list>
        <color-list
          v-else
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :stock-info="stockInfo"
          @select-color="selectColor"
        ></color-list>
        <div
          v-if="baseInfo.hasPriceRule && colorsFormat.priceColors && Object.keys(colorsFormat.priceColors).length"
          class="mesh-color-block"
        >
          <mesh-label></mesh-label>
          <color-list
            :colors="colorsFormat.priceColors"
            :selected-color-id="selectedColor.styleId"
            :stock-info="stockInfo"
            @mesh-color="selectMeshColor"
            @select-color="selectColor"
          ></color-list>
        </div>
        <div
          v-if="retireInfo.hasOwnProperty('retireColor') && colorsFormat.retireColors && Object.keys(colorsFormat.retireColors).length"
          class="retire-color-block"
        >
          <retire-label :retire-info="retireInfo"></retire-label>
          <color-list
            :colors="colorsFormat.retireColors"
            :selected-color-id="selectedColor.styleId"
            :stock-info="stockInfo"
            @select-color="selectColor"
          ></color-list>
        </div>
      </div>
      <template v-if="!fromDialog || fromDialog == 'cartFreeGift'">
        <div v-if="hasSize" class="size-block">
          <size-label :is-groomsmen="baseInfo.isGroomsmen" :baseInfo="baseInfo" :hasSizeChart="hasSizeChart"></size-label>
          <size-list
            :sizes="styleInfo.size"
            :selected-size-id="selectedSize.styleId"
            :size-hover-tip="{}"
            :hide-size-map="hideSizeMap"
            :fromDialog="fromDialog"
            @select-size="selectSize"
          ></size-list>
          <size-detail
            v-if="hasSizeChart"
            :size-chart="styleInfo.sizeChart"
            :selected-size="selectedSize.key"
            :unit="unit"
            @switch-unit="switchUnit"
          ></size-detail>
          <!-- 买赠活动的赠品弹窗没有 customSize 模块-->
          <custom-size
            ref="customSize"
            v-if="hasCustomeSize && fromDialog != 'cartFreeGift'"
            :is-visible="customSizeSelected"
            :unit="unit"
            :sizeChart="styleInfo.sizeChart"
            :goodsId="baseInfo.goodsId"
            :customData="customData"
            @select-custom="selectCustom"
            @switch-unit="switchUnit"
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
      </template>
      <template v-else>
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
        <div v-if="hasSize" class="size-block">
          <template v-if="!isSpecialCatId(baseInfo.catId)">
            <div v-if="styleInfo.customSize && hasCustomeSize && fromDialog !== 'shopTheLook'" class="tab-title">
              <div @click="tabChange(false)" :class="{ selected: !customSizeSelected }" class="standard">
                {{ nl('page_order_standard_size') }}
                <div v-if="!customSizeSelected" class="select_split"></div>
              </div>
              <div @click="tabChange(true)" :class="{ selected: customSizeSelected }" class="custom">
                {{ nl('page_goods_custom_size_free') }}
                <div v-if="customSizeSelected" class="select_split"></div>
              </div>
              <div class="split_line"></div>
            </div>
            <div v-show="!customSizeSelected" class="standard-size-block">
              <size-label
                :is-groomsmen="baseInfo.isGroomsmen"
                :baseInfo="baseInfo"
                :isDialogCustomSize="Boolean(fromDialog) && Boolean(styleInfo.customSize)"
                :hasSizeChart="hasSizeChart"
              ></size-label>
              <size-list
                :sizes="styleInfo.size"
                :size-hover-tip="{}"
                :selected-size-id="selectedSize.styleId"
                :hide-size-map="hideSizeMap"
                :fromDialog="fromDialog"
                @select-size="selectSize"
              ></size-list>
              <size-detail
                v-if="hasSizeChart"
                :size-chart="styleInfo.sizeChart"
                :selected-size="selectedSize.key"
                :unit="unit"
                @switch-unit="switchUnit"
              ></size-detail>
            </div>
          </template>
          <template v-else>
            <size-label
              :is-groomsmen="baseInfo.isGroomsmen"
              :baseInfo="baseInfo"
              :isDialogCustomSize="Boolean(fromDialog) && Boolean(styleInfo.customSize)"
              :hasSizeChart="hasSizeChart"
            ></size-label>
            <new-size-list v-bind="newSizeListBindValue" @select-size="selectStockSize"></new-size-list>
            <size-detail
              v-if="hasSizeChart"
              :size-chart="styleInfo.sizeChart"
              :selected-size="selectedSize.key"
              :unit="unit"
              @switch-unit="switchUnit"
            ></size-detail>
          </template>
          <custom-size
            ref="customSize"
            v-if="hasCustomeSize"
            :is-visible="customSizeSelected"
            :sizeChart="styleInfo.sizeChart"
            :goodsId="baseInfo.goodsId"
            :customData="customData"
            :fromDialog="fromDialog"
            :unit="unit"
            @select-custom="selectCustom"
            @switch-unit="switchUnit"
          ></custom-size>
        </div>
      </template>
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
        :fromDialog="fromDialog"
        @change-qty="changeQty"
        :max="baseInfo.maxSelectNumber"
        :goods-number="goodsNumber"
      ></goods-number>
      <sample-confirm
        v-if="baseInfo.customizable"
        @click="confirmSelected = !confirmSelected"
        :selected="confirmSelected"
        :base-info="baseInfo"
      ></sample-confirm>
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
      <check-tips
        v-show="showCheckTip"
        :tipsLeft="checkTipsLeftPosition"
        :tips="checkTips"
        :style="{ top: '57px !important' }"
      ></check-tips>
    </div>
    <template v-else>
      <div v-if="atelierIsNotifyMe && baseInfo.catId == 3110" class="add-to-bag-block">
        <az-button
          id="notify-me"
          v-track.view.click="getNotifyMeParams(baseInfo)"
          :class="{ disabled: disableNotifyMe }"
          @click="changeDialogStatus"
          :text="nl('page_notify_me')"
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
            :icon="isBridal ? 'iconicon_buy_now-bridal' : 'iconicon_buy_now'"
          ></az-button>
        </template>
        <check-tips v-show="showCheckTip" :tipsLeft="checkTipsLeftPosition" :tips="checkTips"></check-tips>
      </div>
      <sample-link v-if="showSampleLink" :baseInfo="baseInfo"></sample-link>
    </template>
    <notify-dialog
      @show-notify-dialog="changeDialogStatus"
      :show-dialog="showNotifyDialog"
      :baseInfo="baseInfo"
      :is-sample="false"
      v-bind="notifyBindValue"
    ></notify-dialog>
  </div>
</template>

<script>
import styleMixins from '@/assets/js/quickshopStyleMixins'
import ColorList from '@/components/quickshop/style/ColorList'
import SizeList from '@/components/quickshop/style/SizeList'
import SizeLabel from '@/components/quickshop/style/SizeLabel'
import SizeDetail from '@/components/quickshop/style/SizeDetail'
import Customization from '@/components/quickshop/style/Customization'
import GoodsNumber from '@/components/quickshop/style/GoodsNumber'
import CheckTips from '@/components/quickshop/style/CheckTips'
import AzButton from '@/components/az-ui/AzButton'
import MeshLabel from '@/components/quickshop/style/MeshLabel'
import CustomSize from '@/components/quickshop/CustomSize'
import RetireLabel from '@/components/quickshop/style/RetireLabel'
import ColorLabel from '@/components/quickshop/style/ColorLabel'
import SampleLink from '@/components/quickshop/style/SampleLink'
import NewSizeList from '@/components/product/style/NewSizeList'
import RushDesc from '@/components/quickshop/RushDesc'
import SampleConfirm from '@/components/product/style/SampleConfirm'
import ColorFamilyList from '@/components/product/style/ColorFamilyList'
import NotifyDialog from '@/components/product/style/NotifyDialog'
import { mapState } from 'vuex'

export default {
  name: 'NormalStyle',
  languageKeys: [
    'page_order_standard_size',
    'page_goods_custom_size_free',
    'page_common_update',
    'page_common_choose_it',
    'page_order_add2bag',
    'page_common_buy_now',
    'page_common_confirm',
    ...SampleLink.languageKeys,
    ...ColorLabel.languageKeys,
    ...RetireLabel.languageKeys,
    ...MeshLabel.languageKeys,
    ...Customization.languageKeys,
    ...GoodsNumber.languageKeys,
    ...SizeLabel.languageKeys,
    ...ColorList.languageKeys,
    ...CustomSize.languageKeys,
    ...NewSizeList.languageKeys,
    ...RushDesc.languageKeys,
    ...ColorFamilyList.languageKeys
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
    RushDesc,
    SampleConfirm,
    ColorFamilyList,
    NotifyDialog
  },
  mixins: [styleMixins],
  data() {
    return {
      continueCheckoutShow: false,
      // isSelected: false,
      // faceMaskIsRender: false,
      customNameList: {},
      confirmSelected: false
    }
  },
  computed: {
    ...mapState('quickshop', ['customSizeSelected']),
    noStyle() {
      // normal-style-block 里面没有内容的情况
      return (
        !this.hasColor &&
        !this.hasSize &&
        !this.baseInfo.hasSash &&
        !((this.baseInfo.numberSelectable && !this.fromDialog) || (this.fromDialog && !this.noQuantity))
      )
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
  mounted() {
    this.disableNotifyMe = this.country == 'MX' && this.baseInfo.mxBdBatch
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
      if (!this.allReady || !this.checkCutomization()) {
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
    selectMeshColor() {
      this.setPoint('color', 'mesh', 'click')
    },
    // handleIsRender(value) {
    //   this.faceMaskIsRender = value
    // },
    // selectFaceMask(value) {
    //   this.isSelected = value
    // },
    selectCustom() {
      this.$store.commit('quickshop/setCustomSizeSelected', !this.customSizeSelected)
      this.selectSize({
        key: '',
        name: '',
        styleId: 0
      })
    },
    addToBag() {
      if (!this.allReady || !this.checkCutomization()) {
        return false
      }
      const customSize = this.$refs.customSize
      let customData = false
      if (this.customSizeSelected) {
        customData = customSize.formCheck()
        if (!customData) {
          return false
        }
      }
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
        // 加车按钮总点击数量
        this.setDataLayer({
          category: 'DetailpgeAddtobag',
          action: 'click',
          label: 'DetailpgeAddtobag_Addtobag_Click1'
        })
        this.setPoint('addtobag', 'addtobag', 'click')
        // 加车按钮不报错点击储量
        this.setDataLayer({
          category: 'DetailpgeAddtobag',
          action: 'click',
          label: 'DetailpgeAddtobag_Addtobag_Click2'
        })
        // 口罩勾选框出现的梳理
        // if (this.faceMaskIsRender) {
        //   this.setDataLayer({
        //     action: 'view',
        //     category: 'DetailPage',
        //     label: 'DetailPage_AddMatchFaceMask_View'
        //   })
        // }
        // if (this.isSelected) {
        //   // 加购口罩的打点
        //   this.setDataLayer({
        //     action: 'click',
        //     category: 'DetailPage',
        //     label: 'DetailPage_AddMatchFaceMask_Click'
        //   })
        //   formData.set('with_face_mask', true)
        //   this.setOrderSourceFlag('AddMatchFaceMask', true)
        // }
        if (this.fromDialog == 'product') this.setOrderSourceFlag('detailpagequickshop', true)
      }
      if (this.scene == 'product') {
        // 详情页often_bought_with加购订单追踪goodsid
        this.setOrderSourceFlagWithGoodsId('often_bought_with', this.baseInfo.goodsId)
      }
    },
    buyNow() {
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
      if (this.fromDialog == 'product') this.setOrderSourceFlag('detailpagequickshop', true)
      if (Object.keys(stylesInputObject).length > 0) this.$set(stylesObject, 'input', stylesInputObject)
      this.$set(formData, 'styles', stylesObject)
      this.buyNowAjax(formData)
    },
    editCartGoods() {
      // 更新购物车商品
      if (!this.allReady || !this.checkCutomization()) {
        return false
      }
      const customSize = this.$refs.customSize
      let customData = false
      if (this.customSizeSelected) {
        customData = customSize.formCheck()
        if (!customData) {
          return false
        }
      }
      this.cartEditLoading = true
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
      this.$set(stylesObject, 'customNameList', this.customNameList)

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
      switch (this.baseInfo.catId) {
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
    tabChange(bol) {
      this.$store.commit('quickshop/setCustomSizeSelected', bol)
      const id = bol ? 'customStyleId' : ''
      this.$store.commit('quickshop/setCustomStyleId', id)
    }
  }
}
</script>

<style lang="less" scoped>
.normal-style {
  width: 100%;
  .add-to-bag-block {
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  .size-block {
    padding-right: 25px;
    .tab-title {
      display: flex;
      position: relative;
      font-family: @font-family-600;
      font-size: 13px;
      color: #ccc;
      // border-bottom: 1px solid #ccc;
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
    // .standard-size-block {
    //   height: 140px;
    //   overflow-y: auto;
    // }
    // /deep/ .custom_size_form {
    //   height: 140px;
    //   overflow-y: auto;
    // }
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
    font-weight: 400;
    cursor: pointer;
    line-height: 25px;
    &:hover {
      background-color: var(--color-1e1e1e) !important;
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
    .normal-style-block {
      padding: 15px;
      background: var(--color-f9f9f9);
      margin-bottom: 20px;
      margin-top: 10px;
      color: var(--color-121212);
      overflow: revert !important;
      &.no-style {
        padding: 0;
      }
      &.has-custom-size {
        height: 400px;
        overflow-y: scroll;
        box-sizing: border-box;
        overflow-x: hidden !important;
        &::-webkit-scrollbar {
          width: 4px;
        }
        &::-webkit-scrollbar-corner {
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 3px;
        }
      }
      // 非批量饰品quickshop内色块大小为23px
      /deep/.color-list {
        padding-top: 2px;
        margin-bottom: 12px;
        // padding-right: 25px;
        box-sizing: border-box;
        i {
          width: 31px;
        }
      }
      /deep/.size-block {
        .size-label {
          padding-bottom: 0;
        }
        .size-list {
          margin-top: 4px;
        }
      }
    }
    #shipping {
      margin-top: 15px;
    }
    .delivery_date_details {
      padding-top: 6px;
      // padding-bottom: 15px;
    }
    #add-to-bag {
      padding: 13px 10px;
      width: 263px;
      height: 50px;
      margin-right: 10px;
      margin-top: 4px;
      background-color: @theme-color!important;
    }
    #buy-now {
      padding: 13px 10px;
      width: 263px;
      height: 50px;
      margin-top: 4px;
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
      border: 1px solid var(--color-e3bda1);
      &:hover {
        border: 1px solid var(--color-1e1e1e);
        background-color: var(--color-f1e9e6) !important;
      }
    }
    #continue-checkout {
      margin-left: 5px;
      border: 1px solid var(--color-121212);
      &:hover {
        border: 1px solid var(--color-1e1e1e);
        background-color: var(--color-1e1e1e) !important;
      }
    }
  }
}
</style>
