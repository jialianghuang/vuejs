<template>
  <div v-if="ready == 1" class="swatch-dialog">
    <div v-show="show" class="content">
      <template v-if="!isCouponSwatch">
        <div @click="close" class="close">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <az-icon v-if="length > 1 && index > 0" @click="change(index - 1)" icon-class="icon-lby_arrow_left" class="prev"></az-icon>
        <div class="small-pic">
          <img :src="addWebpSuffix(image)" :alt="baseInfo.shownGoodsName" class="pic" />
        </div>
      </template>
      <div class="big-pic">
        <img :src="addWebpSuffix(image)" :alt="baseInfo.shownGoodsName" class="pic" />
        <div class="fav-icon"></div>
      </div>
      <div class="product-info">
        <div class="goods-name">{{ baseInfo.shownGoodsName }}</div>
        <div v-if="!isCouponSwatch" class="price">
          <template v-if="baseInfo.noDealPrice != baseInfo.shopPrice">
            <span class="goods-price">{{ baseInfo.shopPriceDisplay }}</span>
            <span class="goods-no-deal-price">{{ baseInfo.noDealPriceDisplay }}</span>
          </template>
          <span v-else>{{ baseInfo.shopPriceDisplay }}</span>
          <az-limited-time
            v-if="!baseInfo.activityCouponCode && baseInfo.hasLinePrice && baseInfo.shopPrice != baseInfo.noDealPrice"
            :stickers="stickerInfo"
            :show-limited-time-tag="true"
            :goodsId="baseInfo.goodsId"
          ></az-limited-time>
        </div>
        <!-- AzWithCoupon 有划线价就展示save百分比,不分是 coupon  activity sale 、 limit sale 、 flash sale -->
        <AzWithCoupon
          v-if="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
          :value="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
          :showText="!!baseInfo.activityCouponCode"
          :code="showCode(baseInfo)"
          :hasShopPriceRange="baseInfo.hasShopPriceRange"
          :baseInfo="baseInfo"
        />
        <div class="style-block">
          <template v-if="isCouponSwatch">
            <div v-if="selectedColors && selectedColors.length" class="color-label">
              <div class="color-title">
                Color:
                <span v-for="(colorItem, idx) in selectedColors" :key="idx">{{
                  `${colorItem.name}${idx != selectedColors.length - 1 ? ',' : ''}`
                }}</span>
              </div>
            </div>
            <p v-if="showColorTip" class="theme-warning color-tip">
              {{ nl('page_coupon_swatches_exceed_3_error') }}
            </p>
          </template>
          <template v-else>
            <div class="color-title">
              {{ nl('page_navigation_one_real_wedding_color_title') }}
              <strong class="color-name">{{ selectedColor.name }}</strong>
            </div>
            <a :href="countryUrl(shopMoreUrl)" @click="swatchPoint" v-if="showOrderSwatch != 'fromSwatchId'" class="shop-more">{{
              shopMoreText
            }}</a>
            <notify-label v-if="showColorNotify" @click="changeDialogStatus" type="color"></notify-label>
          </template>
          <color-list
            :stock="colorStock"
            :colors="isCouponSwatch ? stockColorsFormat.shown : colorsFormat.shown"
            :selected-color-id="selectedColor.styleId"
            :selectedColorIds="selectedColorIds"
            :is-stock-goods="!!baseInfo.isStockGoods"
            :stock-info="stockInfo"
            @select-color="selectColor"
          ></color-list>
          <template v-if="baseInfo.hasPriceRule">
            <mesh-label></mesh-label>
            <color-list
              :stock="colorStock"
              :colors="isCouponSwatch ? stockColorsFormat.priceColors : colorsFormat.priceColors"
              :selected-color-id="selectedColor.styleId"
              :selectedColorIds="selectedColorIds"
              :is-stock-goods="!!baseInfo.isStockGoods"
              :stock-info="stockInfo"
              @select-color="selectColor"
            ></color-list>
          </template>
          <stock-tips :tip-status="tipStatus" v-if="!isCouponSwatch"></stock-tips>
        </div>
        <template v-if="!isCouponSwatch">
          <product-shipping
            :base-info="baseInfo"
            :make-time-info="makeTimeInfo"
            :swatchShippingInfo="swatchShippingInfo"
            :from="'swatchDialog'"
          ></product-shipping>
          <div v-if="!success" class="add-to-bag-block">
            <old-az-button
              @click="addToBag"
              :text="nl('page_order_add2bag')"
              :loading="loading"
              :disable="disable"
              v-track.view.click="{ common: getBiParams('addtobag') }"
              class="add-to-bag"
              icon="icon-xxy_add_to_bag"
            ></old-az-button>
            <old-az-button
              @click="buyNow"
              :text="nl('page_common_buy_now')"
              :loading="buyNowLoading"
              :textColor="'var(--color-121212)'"
              :color="'#fff'"
              :disable="disable"
              v-track.view.click="{ common: getBiParams('buynow') }"
              :icon="isBridal ? 'iconicon_buy_now-bridal' : 'iconicon_buy_now'"
              class="buy-now"
            ></old-az-button>
          </div>
          <template v-else>
            <old-az-button
              @click="close"
              :text="nl('page_common_continue_shopping')"
              color="#fff"
              text-color="var(--color-121212)"
              round="3px"
              class="continue-shopping success-btn"
            ></old-az-button>
            <old-az-button @click="jumpCart" :text="nl('page_checkout_title')" round="3px" class="checkout success-btn"></old-az-button>
          </template>
          <a :href="countryUrl(detailUrl)" target="_blank" class="view-detail">{{ nl('page_cart_recommend_view_detail') }}</a>
        </template>
        <!-- coupon 下单 -->
        <az-button v-else @click="handleContinue" :disabled="loading" :needIcon="false" class="btn-default btn-continue">
          {{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_common_continue') }}</az-button
        >
      </div>
      <az-icon v-if="length > 1 && index < length - 1" @click="change(index + 1)" icon-class="icon-lby_arrow_right" class="next"></az-icon>
      <div v-if="length > 1" class="page">
        <span v-for="i in length" :key="i" @click="change(i - 1)" :class="{ active: i == index + 1 }"> {{ i }}</span>
      </div>
    </div>
    <notify-dialog
      @show-notify-dialog="changeDialogStatus"
      :show-dialog="showNotifyDialog"
      :options="colorNotifyOption"
      :baseInfo="baseInfo"
      :selectedColor="selectedColor || {}"
      :selectedSize="{}"
      type="color"
    ></notify-dialog>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import OldAzButton from '@/components/az-ui/AzButton'
import AzButton from '@/components/az-ui/Button/AzButton'
import ColorList from '@/components/product/style/ColorList'
import MeshLabel from '@/components/product/style/MeshLabel'
import StockTips from '@/components/product/style/StockTips'
import ProductShipping from '@/components/product/ProductShipping'
import NotifyLabel from '@/components/product/style/NotifyLabel'
import NotifyDialog from '@/components/product/style/NotifyDialog'
// import AzWithCode from '@/components/az-ui/AzWithCode'
import AzWithCoupon from '@/components/az-ui/AZWithCoupon'

import { mapState } from 'vuex'
export default {
  name: 'SwatchDialog',
  languageKeys: [
    'page_common_thrift',
    'page_coupon_swatches_exceed_3_error',
    'page_navigation_one_real_wedding_color_title',
    'page_order_add2bag',
    'page_common_buy_now',
    'page_common_continue_shopping',
    'page_checkout_title',
    'page_cart_recommend_view_detail',
    'page_order_progress_processing',
    'page_common_continue',
    'page_swatch_shop_bridemaid',
    'page_goods_shop_more_color',
    ...ColorList.languageKeys,
    ...MeshLabel.languageKeys,
    ...StockTips.languageKeys,
    ...ProductShipping.languageKeys,
    ...NotifyLabel.languageKeys,
    ...NotifyDialog.languageKeys
    // ...AzWithCode.languageKeys
  ],
  components: {
    NotifyDialog,
    NotifyLabel,
    OldAzButton,
    AzButton,
    ProductShipping,
    StockTips,
    MeshLabel,
    ColorList,
    AzWithCoupon
    // AzWithCode
  },
  props: {
    swatchId: {
      type: Number,
      default: 1000291
    },
    color: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 1
    },
    index: {
      type: Number,
      default: 0
    },
    swatchOriginGoodsInfo: {
      // 主商品的信息
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      baseInfo: {},
      styleInfo: {},
      imageInfo: {},
      stockInfo: {},
      makeTimeInfo: {},
      swatchShippingInfo: {},
      selectedColor: {
        key: '',
        name: '',
        styleId: 0
      },
      selectedColors: [],
      selectedColorIds: [],
      ready: 0,
      disable: false,
      loading: false,
      buyNowLoading: false,
      success: false,
      show: true,
      showNotifyDialog: false,
      showColorTip: false
    }
  },
  computed: {
    ...mapState({
      showOrderSwatch: (state) => state.product.showOrderSwatch,
      isCouponSwatch: (state) => state.isCouponSwatch
    }),
    image() {
      let src = this.baseInfo.goodsThumb
      const images = this.imageInfo.goodsGallery
      if (this.isCouponSwatch) {
        src = images[this.selectedColors[this.selectedColors.length - 1].key].images[0].imgUrl
      } else if (images.hasOwnProperty(this.selectedColor.key)) {
        src = images[this.selectedColor.key].images[0].imgUrl
      }

      return this.imageInfo.thumbPrefix + src
    },
    shopMoreText() {
      if (this.baseInfo.goodsId == 1000291) {
        this.setPoint('shopbridesmaiddressesinthiscolor', 'view')
        return this.nl('page_swatch_shop_bridemaid')
      } else if (this.baseInfo.goodsId == 1000354) {
        this.setPoint('shopweddingdressesinthiscolor', 'view')
        return 'Shop wedding dresses in this color'
      } else if (this.baseInfo.catId == 33 || this.baseInfo.catId == 36) {
        this.setPoint('shopdressesinthiscolor', 'view')
        return 'Shop dresses in this color'
      } else {
        this.setPoint('shopmoreinthiscolor', 'view')
        return this.nl('page_goods_shop_more_color')
      }
    },
    shopMoreUrl() {
      return '/all/bridesmaid-dresses/colors/' + this.selectedColor.key.replace(/_|\s+/g, '-').toLowerCase()
    },
    colorsFormat() {
      const colors = {
        shown: {},
        priceColors: {}
      }
      for (const key in this.styleInfo.color) {
        const color = this.styleInfo.color[key]
        if (this.baseInfo.hasPriceRule && this.baseInfo.priceRule[color.styleId]) {
          colors.priceColors[key] = color
        } else {
          colors.shown[key] = color
        }
      }
      return colors
    },
    stockColorsFormat() {
      const colors = {
        shown: {},
        priceColors: {},
        retireColors: {}
      }
      for (const key in this.styleInfo.color) {
        const color = this.styleInfo.color[key]
        if (this.stockInfo.colorMap && this.stockInfo.colorMap.hasOwnProperty(key) && this.stockInfo.colorMap[key].hasStock) {
          if (this.baseInfo.hasPriceRule && this.baseInfo.priceRule[color.styleId]) {
            colors.priceColors[key] = color
          } else {
            colors.shown[key] = color
          }
        }
      }
      return colors
    },
    colorStock() {
      const colors = []
      for (const i in this.stockInfo.colorMap) {
        if (this.stockInfo.colorMap[i].hasStock) {
          colors.push(i)
        }
      }
      return colors
    },
    tipStatus() {
      const tipStatus = {
        key: 'default',
        stockNumber: 0,
        tipsRed: false,
        statusRed: false
      }
      if (this.selectedColor.key == '') {
        return tipStatus
      }
      const colorMap = this.stockInfo.colorMap
      if (colorMap[this.selectedColor.key].hasStock) {
        tipStatus.tipsRed = true
        tipStatus.key = 'hasStock'
        tipStatus.stockNumber = this.stockInfo.stockNumberMap[this.selectedColor.key]
      } else if (this.baseInfo.catId == 33) {
        tipStatus.key = 'color_no_stock'
        tipStatus.statusRed = true
      } else {
        tipStatus.key = 'onlyColorNoStock'
        tipStatus.statusRed = true
      }
      return tipStatus
    },
    detailUrl() {
      return this.baseInfo.goodsDefaultUrl + '?color=' + this.selectedColor.name.replace(/\s+/g, '-').toLowerCase()
    },
    showColorNotify() {
      return this.stockInfo.outOfStockColorMap && this.stockInfo.outOfStockColorMap.hasOwnProperty(this.selectedColor.key)
    },
    colorNotifyOption() {
      const options = {}
      for (const i in this.stockInfo.outOfStockColorMap) {
        const color = this.styleInfo.color[i]
        options[i] = color
      }
      return options
    }
  },
  watch: {
    selectedColor: {
      handler(val, oldVal) {
        if (val.styleId != 0) {
          this.getProductInfo()
          this.getDeliveryInfo()
        }
      },
      deep: true
    }
  },
  created() {
    this.quickShopClick()
  },
  methods: {
    quickShopClick() {
      const params = {
        goods_id: this.swatchId,
        color: this.color,
        swatchOriginGoodsId: this.swatchOriginGoodsInfo && this.swatchOriginGoodsInfo.goodsId, // 主商品的goodsID
        swatchOriginDressType: this.swatchOriginGoodsInfo && this.swatchOriginGoodsInfo.dressType // 主商品的dressType
      }
      if (this.showOrderSwatch === 'fromSwatchId') {
        // 只有是点击 Order a swatch ，才入参这个参数 ！
        params.fabricType = this.swatchOriginGoodsInfo && this.swatchOriginGoodsInfo.fabricKeyValues
      }
      this.$axios
        .$get(`/1.0/product/quick-shop`, { params })
        .then((res) => {
          if (res.code == 0) {
            this.baseInfo = res.data.baseInfo
            this.styleInfo = res.data.styleInfo
            this.imageInfo = res.data.imageInfo
            this.makeTimeInfo = res.data.makeTimeInfo
            let stockInfo = {}
            if (this.baseInfo.isStockGoods) {
              stockInfo = res.data.stockInfo || {}
              this.stockInfo = stockInfo
            }
            if (this.isCouponSwatch) {
              let defaultSelectedColor = {}
              // dusty_rose有库存，则默认dusty rose
              if (this.stockInfo.colorMap['dusty_rose]'] && this.stockInfo.colorMap['dusty_rose]'].hasStock) {
                defaultSelectedColor = this.styleInfo.color.dusty_rose
              } else {
                // dusty rose没有值的话，则取默认值是有库存的第一个
                for (const i in this.stockInfo.colorMap) {
                  if (this.stockInfo.colorMap[i].hasStock) {
                    defaultSelectedColor = this.styleInfo.color[i]
                    break
                  }
                }
              }

              this.selectedColorIds = [defaultSelectedColor.styleId]
              this.selectedColors = [defaultSelectedColor]
            } else {
              const key = this.baseInfo.color
              // if (this.color != '' && this.styleInfo.color[this.color]) {
              //   key = this.color
              // }
              if (this.styleInfo.color && this.styleInfo.color[key]) {
                this.selectedColor.key = this.styleInfo.color[key].key
                this.selectedColor.name = this.styleInfo.color[key].name
                this.selectedColor.styleId = this.styleInfo.color[key].styleId
              }
              this.getDeliveryInfo()
            }
            this.ready++
            this.$emit('ready', { id: this.swatchId, ready: this.ready })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleContinue() {
      const swatchGoodsList = []
      for (const key in this.selectedColors) {
        const item = this.selectedColors[key]
        const buyNowData = {
          act: 'addGoodsToCart',
          goods_id: this.baseInfo.goodsId,
          dress_type: this.baseInfo.dressType,
          from_showroom: this.fromShowroom,
          from_whatAreU: this.fromWhatAreU,
          recommend_flag: this.recommendFlag,
          from_details_entry: this.fromDetailsEntry,
          from_instagram: this.fromInstagram,
          styles: {
            freeStyle: false,
            size_type: this.unit == 'inch' ? '_inch' : '_cm',
            select: {
              color: item.styleId
            },
            input: {}
          },
          goods_number: 1
        }
        swatchGoodsList.push(buyNowData)
      }

      this.$emit('handleContinue', swatchGoodsList)
    },
    getProductInfo() {
      this.$axios
        .$get(`/1.0/product/item-info`, {
          params: {
            goods_id: this.baseInfo.goodsId,
            dress_type: this.baseInfo.dressType,
            color: this.selectedColor.key,
            style_ids: `${this.selectedColor.styleId},0,0` // selectedSize.styleId selectedSashColor.styleId 色卡均为0
          }
        })
        .then((res) => {
          if (res.code == 0) {
            const baseInfo = res.data.baseInfo
            const hasLinePrice = baseInfo.hasLinePrice
            const noDealPriceDisplay = baseInfo.noDealPriceDisplay
            const shopPriceDisplay = baseInfo.shopPriceDisplay
            const priceOffDisplay = baseInfo.priceOffDisplay
            const shopPrice = baseInfo.shopPrice
            const noDealPrice = baseInfo.noDealPrice
            const priceOff = baseInfo.priceOff
            const priceSymbol = baseInfo.priceSymbol
            const hasPriceRule = baseInfo.hasPriceRule
            const shownGoodsName = baseInfo.shownGoodsName
            const goodsUrl = baseInfo.goodsUrl
            const activityCouponCode = baseInfo.activityCouponCode
            const activityBonus = baseInfo.activityBonus
            const _baseInfo = JSON.parse(JSON.stringify(this.baseInfo))
            this.baseInfo = {
              ..._baseInfo,
              hasLinePrice,
              noDealPriceDisplay,
              shopPriceDisplay,
              priceOffDisplay,
              shopPrice,
              noDealPrice,
              priceOff,
              priceSymbol,
              hasPriceRule,
              shownGoodsName,
              goodsUrl,
              activityCouponCode,
              activityBonus,
              discount: baseInfo.discount || '', // 使用sku对应的discount
              offRateValue: baseInfo.offRateValue,
              upToSaveRateValue: baseInfo.upToSaveRateValue || '', // AZWEB-21266 更新区间价
              hasShopPriceRange: baseInfo.hasShopPriceRange,
              minShopPriceDisplay: baseInfo.minShopPriceDisplay,
              maxShopPriceDisplay: baseInfo.maxShopPriceDisplay,
              afterPayTips: baseInfo.afterPayTips
            }
          }
        })
    },
    swatchPoint() {
      switch (this.shopMoreText) {
        case this.nl('page_goods_shop_more_color'):
          this.setPoint('shopmoreinthiscolor', 'click')
          break
        case 'Shop dresses in this color':
          this.setPoint('shopdressesinthiscolor', 'click')
          break
        case 'Shop wedding dresses in this color':
          this.setPoint('shopweddingdressesinthiscolor', 'click')
          break
        case this.nl('page_swatch_shop_bridemaid'):
          this.setPoint('shopbridesmaiddressesinthiscolor', 'click')
          break
      }
    },
    setPoint(el, type) {
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
    // 复选，最多3个
    selectColor(color) {
      if (this.isCouponSwatch) {
        this.showColorTip = false
        const index = this.selectedColorIds.indexOf(color.styleId)
        if (index !== -1) {
          if (this.selectedColorIds.length <= 1) {
            return
          }
          this.selectedColors.splice(index, 1)
          this.selectedColorIds.splice(index, 1)
          return
        }
        if (this.selectedColorIds.length >= 3) {
          this.showColorTip = true
          return
        }
        this.selectedColors.push(color)
        this.selectedColorIds.push(color.styleId)
      } else {
        this.selectedColor.key = color.key
        this.selectedColor.name = color.name
        this.selectedColor.styleId = color.styleId
      }

      this.$nextTick(() => {
        if (this.tipStatus.key !== 'hasStock' && this.tipStatus.key !== 'shipsImmediately') {
          this.disable = true
        } else {
          this.disable = false
        }
      })
    },
    changeDialogStatus() {
      this.show = this.showNotifyDialog
      this.showNotifyDialog = !this.showNotifyDialog
    },
    addToBag() {
      // 以下来自stockStyle
      this.loading = true
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', this.baseInfo.goodsId)
      formData.set('goods_number', 1)
      formData.set('styles[select][color]', this.selectedColor.styleId)
      this.$axios
        .$post('/1.0/cart/goods', formData)
        .then((res) => {
          this.retentionAddToCart({ ...this.baseInfo, goodsNumber: 1, csText: this.getColorAndSizeText(formData) }, res.data.rec_id)
          this.loading = false
          if (res.code == 0) {
            this.success = true
          } else {
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    buyNow() {
      // 以下来自stockStyle
      this.buyNowLoading = true
      const formData = {}
      const stylesObject = {}
      const stylesSelectObject = {}

      this.$set(formData, 'act', 'addGoodsToCart')
      this.$set(formData, 'goods_id', this.baseInfo.goodsId)
      this.$set(formData, 'dress_type', this.baseInfo.dressType)
      this.$set(formData, 'from_showroom', '')
      this.$set(formData, 'from_whatAreU', '')
      this.$set(formData, 'recommend_flag', '')
      this.$set(formData, 'from_details_entry', '')
      this.$set(formData, 'from_instagram', '')
      this.$set(stylesObject, 'freeStyle', false)
      this.$set(stylesObject, 'size_type', this.unit == 'inch' ? '_inch' : '_cm')
      this.$set(stylesSelectObject, 'color', this.selectedColor.styleId)
      this.$set(formData, 'goods_number', 1)
      this.$set(stylesObject, 'select', stylesSelectObject)
      this.$set(formData, 'styles', stylesObject)

      const param = Base64.encode(JSON.stringify(formData))
      const buyNowUrl = this.countryUrl(`/checkout?buy_now=${param}`)
      this.$store.commit('checkout/setBuyNow', param)
      window.location.href = buyNowUrl
    },
    close() {
      this.$store.commit('product/setShowOrderSwatch', false)
    },
    jumpCart() {
      window.open(this.countryUrl(`/cart`))
    },
    change(index) {
      if (index < 0 || index > this.length - 1 || index == this.index) {
        return false
      }
      this.$emit('change', index)
    },
    getBiParams(el) {
      if (process.server) return
      if (this.showOrderSwatch != 'fromSwatchId') return
      return {
        ec: this.baseInfo.hasLinePrice ? 'orderyourfreeswatch' : 'orderaswatch',
        el,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      }
    },
    getDeliveryInfo() {
      const _this = this
      const params = {
        goods_id: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        dress_type: this.baseInfo.dressType,
        province_id: '',
        color_style_id: this.selectedColor.styleId,
        size_style_id: 0 // 色卡为0
      }
      if (this.baseInfo.dressType === 'clearance') {
        params.discount = -1
      }
      this.$axios.$post('/1.0/delivery', params).then((res) => {
        if (res.code == 0) {
          const deliveryInfo = res.data.deliveryInfo
          _this.dateStr = deliveryInfo.dateStr
          if (_this.baseInfo.isStockGoods) {
            // 更新交期信息
            // const newMakeInfo = {
            //   minDays: deliveryInfo.minDays,
            //   maxDays: deliveryInfo.maxDays,
            //   minWeeks: deliveryInfo.minWeek,
            //   maxWeeks: deliveryInfo.maxWeek
            // }
            // if (deliveryInfo.isExpeditedShippingGoods) {
            //   newMakeInfo.isExpeditedShippingGoods = deliveryInfo.isExpeditedShippingGoods
            //   newMakeInfo.hours = deliveryInfo.hours
            //   newMakeInfo.expeditedDeliverStr = deliveryInfo.expeditedDeliverStr // 交期描述，返回的多语言code
            // }
            this.makeTimeInfo = deliveryInfo
          }
          // 保存Shipped to You交期时间
          this.swatchShippingInfo = deliveryInfo.shippingInfo
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.az-with-coupon {
  margin-bottom: 15px;
}
.swatch-dialog {
  .content {
    width: 1110px;
    padding: 30px 25px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
    .close {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 10;
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
    .prev {
      position: absolute;
      left: 15px;
      top: calc(50% - 10px);
      font-size: 20px;
      cursor: pointer;
    }
    .next {
      position: absolute;
      right: 15px;
      top: calc(50% - 10px);
      font-size: 20px;
      cursor: pointer;
    }
    .small-pic {
      img {
        width: 64px;
        border: 2px solid #cdcdcd;
      }
    }

    .big-pic {
      margin-left: 6px;
      position: relative;

      img {
        width: 418px;
      }

      .fav-icon {
        position: absolute;
        width: 34px;
        height: 39px;
        right: 8px;
        top: 9px;
        z-index: 2;
      }
    }

    .product-info {
      width: 476px;
      margin-left: auto;

      .goods-name {
        letter-spacing: 1px;
        font-size: 24px;
        font-weight: normal;
        text-transform: uppercase;
        line-height: 25px;
        margin-top: 5px;
      }

      .price {
        display: flex;
        align-items: center;
        font-size: 24px;
        .goods-price {
          font-family: @font-family-600;
          font-size: 24px;
        }
        .goods-no-deal-price {
          color: var(--color-999999);
          text-decoration: line-through;
          font-size: 16px;
          margin-left: 5px;
          font-weight: normal;
        }
        .prod-save-price {
          font-size: 13px;
          font-weight: normal;
          line-height: 18px;
          margin-left: 10px;
        }
      }

      .style-block {
        padding: 30px 0 30px 23px;
        background: var(--color-f9f9f9);
        margin-bottom: 20px;
        color: var(--color-121212);
        // quickshop的时候，颜色的tips超出部分被隐藏，如果后期增加size-list需求考虑该部分
        // max-height: 300px;
        // overflow-y: auto;

        .color-name {
          text-transform: capitalize;
        }
        .color-tip {
          margin-bottom: 12px;
        }
        .shop-more {
          color: #666;
          text-decoration: underline;
          cursor: pointer;
        }

        .notify-label {
          margin: 18px 0;
        }

        .color-list {
          width: 100%;
          margin-bottom: 8px;
        }

        .mesh-label {
          margin-top: 22px;
        }
      }
      .add-to-bag-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .add-to-bag,
        .buy-now {
          width: 230px;
          height: 50px;
          line-height: 50px;
          text-transform: uppercase;
          font-size: 14px;
          margin-top: 15px;
          font-weight: 400;
        }
        .buy-now:hover {
          background-color: @bg-color !important;
        }
        .az-icon {
          height: 15px;
          width: 20px;
          margin-right: 8px;
          fill: currentColor;
        }
      }

      .view-detail {
        font-size: 13px;
        font-family: @font-family-600, sans-serif;
        color: var(--color-121212);
        cursor: pointer;
        text-decoration: underline;
        margin-top: 10px;
        display: block;
      }

      .continue-shopping {
        margin-right: 10px;
      }

      .success-btn {
        display: inline-block;
        width: 176px;
        height: 50px;
        line-height: 50px;
        text-transform: uppercase;
        font-size: 14px;
        margin-top: 15px;
        font-weight: 400;
        &.checkout {
          background-color: @theme-color!important;
          border-color: @theme-color;
        }
      }
    }
    .continue-shopping {
      &:hover {
        color: #fff !important;
      }
    }

    .page {
      display: block;
      width: 100%;
      text-align: center;
      span {
        color: @theme-color;
        padding: 5px;
        cursor: pointer;
      }
      .active {
        color: var(--color-121212);
        cursor: default;
      }
    }
  }
}
.activity-coupon-code {
  margin-left: 5px;
}
.btn-continue {
  width: 275px;
  height: 40px;
}
.add-to-bag,
.buy-now {
  border: 1px solid @theme-color;
}
.buy-now {
  color: @theme-color!important;
  &:hover {
    background-color: @btn-light-hover-color !important;
  }
}
.add-to-bag {
  background-color: @theme-color!important;
  &:hover {
    background-color: @btn-hover-color !important;
  }
}
.continue-shopping {
  color: @theme-color!important;
  border: 1px solid @theme-color;
  &:hover {
    background-color: @btn-hover-color !important;
  }
}
.price {
  .goods-price {
    color: @theme-color;
  }
  .prod-save-price {
    color: @theme-color;
  }
}
</style>
