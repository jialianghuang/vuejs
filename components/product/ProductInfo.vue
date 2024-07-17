<!--suppress ALL -->
<template>
  <div class="prod-info">
    <section class="prod-info-container">
      <product-description
        :detailsInfo="detailsInfo"
        :reviewInfo="reviewInfo"
        :retireInfo="retireInfo"
        :flashSaleInfo="flashSaleInfo"
        :stickerInfo="stickerInfo"
        :sellerInfo="sellerInfo"
        @swatch-sign-up="$parent.createAccountLayerShow = true"
      ></product-description>
      <try-before-you-buy-new v-if="showTryBeforeYouBuyNew" :baseInfo="baseInfo"></try-before-you-buy-new>
      <!-- 取消国家和品类卖点限制 -->
      <template v-if="!baseInfo.isFinalSale">
        <product-selling-point-new
          v-if="country !== 'MX'"
          :stock-info="stockInfo"
          :giftInfo="giftInfo"
          :make-time-info="makeTimeInfo"
        ></product-selling-point-new>
        <product-selling-point v-else :stock-info="stockInfo" :giftInfo="giftInfo" :make-time-info="makeTimeInfo"></product-selling-point>
      </template>
      <template v-if="!beBackSoonGoods">
        <try-before-you-buy :baseInfo="baseInfo"></try-before-you-buy>
      </template>
      <!-- sod comingsoon module -->
      <SodComingSoon
        v-if="isSpecialCatId(baseInfo.catId) && (baseInfo.isMeasurementHideGoods || baseInfo.isComingSoon) && !baseInfo.sodPreSaleGoods"
        :stock-info="stockInfo"
        :style-info="styleInfo"
        :retire-info="retireInfo"
        :make-time-info="makeTimeInfo"
        :sticker-info="stickerInfo"
      ></SodComingSoon>
      <!-- 商品颜色尺码module -->
      <template v-else-if="!baseInfo.isComingSoon || sodPreSaleGoods">
        <!-- 样衣 清仓 售罄 -->
        <sample-style
          v-if="['sample', 'clearance', 'outlet'].includes(baseInfo.dressType) || baseInfo.isFinalSale"
          :stock-info="stockInfo"
          :style-info="styleInfo"
          :retire-info="retireInfo"
          :make-time-info="makeTimeInfo"
          :sticker-info="stickerInfo"
          @quickShop="quickShopClick"
        ></sample-style>
        <!-- 库存商品 -->
        <template v-else-if="baseInfo.isStockGoods">
          <stock-style
            :stock-info="stockInfo"
            :style-info="styleInfo"
            :retire-info="retireInfo"
            :make-time-info="makeTimeInfo"
            :sticker-info="stickerInfo"
            @quickShop="quickShopClick"
          ></stock-style>
        </template>
        <!-- BD库存 -->
        <normal-style
          ref="refName"
          v-else
          :stock-info="stockInfo"
          :style-info="styleInfo"
          :retire-info="retireInfo"
          :make-time-info="makeTimeInfo"
          :sticker-info="stickerInfo"
          @quickShop="quickShopClick"
        ></normal-style>
      </template>
      <!-- comingsoon module -->
      <come-soon :baseInfo="baseInfo" v-else></come-soon>
      <product-info-detail
        :baseInfo="baseInfo"
        :detailsInfo="detailsInfo"
        :videoInfo="videoInfo"
        :styleInfo="styleInfo"
        :swatchInfo="swatchInfo"
        :giftInfo="giftInfo"
        :make-time-info="makeTimeInfo"
        :stock-info="stockInfo"
      ></product-info-detail>
    </section>
    <client-only v-if="!is_chrome_lighthouse">
      <RecommendSizePopup v-bind="bindValue" @select-size="selectStockSize" v-if="showRecommendSizePopup" />
      <complete-the-look
        v-if="completeTheLookList.length > 0 && (isSpecialCatId(catId) || (!cmpPosition.left && cmpPosition.right)) && showCompleteTheLook"
        :fromDialog="'product'"
        :completeTheLookList="completeTheLookList"
        @quickShop="quickShopClick"
        scene="productInfo"
      ></complete-the-look>
    </client-only>
  </div>
</template>
<script>
import StockStyle from '@/components/product/StockStyle'
import NormalStyle from '@/components/product/NormalStyle'
import SampleStyle from '@/components/product/SampleStyle'
import ProductDescription from '@/components/product/ProductDescription'
import ComeSoon from '@/components/product/ComeSoon'
import TryBeforeYouBuy from '@/components/product/TryBeforeYouBuy'
import TryBeforeYouBuyNew from '@/components/product/TryBeforeYouBuyNew'
import productInfoDetail from '@/components/product/ProductInfoDetail'
import ProductSellingPoint from '@/components/product/ProductSellingPoint/ProductSellingPoint'
import ProductSellingPointNew from '@/components/product/ProductSellingPoint/ProductSellingPointNew'
import RecommendSizePopup from '@/components/product/RecommendSizePopup'
import CompleteTheLook from '@/components/product/CompleteTheLook'
import SodComingSoon from '@/components/product/SodComingSoon'
import { mapState } from 'vuex'
export default {
  name: 'ProductInfo',
  languageKeys: [
    ...ComeSoon.languageKeys,
    ...ProductSellingPoint.languageKeys,
    ...ProductSellingPointNew.languageKeys,
    ...SampleStyle.languageKeys,
    ...StockStyle.languageKeys,
    ...NormalStyle.languageKeys,
    ...ProductDescription.languageKeys,
    ...TryBeforeYouBuy.languageKeys,
    ...TryBeforeYouBuyNew.languageKeys,
    ...productInfoDetail.languageKeys,
    ...SodComingSoon.languageKeys,
    ...RecommendSizePopup.languageKeys,
    ...CompleteTheLook.languageKeys
  ],
  components: {
    ComeSoon,
    SampleStyle,
    StockStyle,
    NormalStyle,
    ProductDescription,
    TryBeforeYouBuy,
    TryBeforeYouBuyNew,
    productInfoDetail,
    ProductSellingPoint,
    ProductSellingPointNew,
    RecommendSizePopup,
    CompleteTheLook,
    SodComingSoon
  },
  props: {
    detailsInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    videoInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    styleInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    swatchInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    reviewInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    makeTimeInfo: {
      type: Object,
      default() {
        return null
      }
    },
    retireInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    flashSaleInfo: {
      type: Object,
      default() {
        return null
      }
    },
    stockInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    giftInfo: {
      type: Object,
      default() {
        return null
      }
    },
    stickerInfo: {
      type: Array,
      default() {
        return []
      }
    },
    completeTheLookList: {
      type: [Array, Object],
      default: () => []
    },
    // 免运费活动文本类型
    showWordsType: {
      type: Number,
      default: 1
    },
    // 是否展示often bought with
    showCompleteTheLook: {
      type: Boolean,
      default: true
    },
    customPhotoList: {
      type: Array,
      default() {
        return []
      }
    },
    sellerInfo: {
      type: [Object, Array],
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapState({
      showRecommendSizePopup: (state) => state.product.showRecommendSizePopup,
      selectedColor: (state) => state.product.selectedColor,
      selectedSize: (state) => state.product.selectedSize,
      cmpPosition: (state) => state.product.completeTheLookPosition,
      hasSample: (state) => state.product.hasSample,
      customSizeInfo: (state) => state.product.customSizeInfo,
      baseInfo: (state) => state.product.baseInfo
    }),
    bindValue({ customSizeInfo, styleInfo }) {
      return {
        customSizeInfo,
        styleInfo
      }
    },
    beBackSoonGoods({ stickerInfo }) {
      return stickerInfo.some((sticker) => sticker.name == 'beBackSoon')
    },
    // sod 预售标记
    sodPreSaleGoods({ baseInfo }) {
      return this.isSpecialCatId(baseInfo.catId) && baseInfo.sodPreSaleGoods
    },
    // 是否展示样衣入口
    showSampleLink() {
      if (this.isNewLanguageCountry) {
        return false
      }
      if (this.baseInfo.dressType == 'sample') {
        return [2, 7, 8, 9, 45, 158].includes(this.baseInfo.catId)
      } else if (this.baseInfo.dressType == 'dress') {
        // hasSample为true时，说明有样衣商品
        // 原本只有2类目有样衣入口，13292需求：现在新增7 Bridesmaid Dresses, 8 Mother of the Bride Dresses, 45 Maternity Bridesmaid Dresses, 158 Modest Bridesmaid Dresses, 9  jbd
        return this.hasSample && [2, 7, 8, 9, 45, 158].includes(this.baseInfo.catId)
      }
      return false
    },
    // 是否展示新版try before you buy入口
    showTryBeforeYouBuyNew() {
      if (this.versionObj.tryBeforeAbtest === 'B' && this.baseInfo.dressType === 'dress' && this.showSampleLink) {
        if (
          (['US', 'CA', 'GB'].includes(this.country) && this.baseInfo.catId === 2) ||
          (this.country === 'DE' && [7, 45, 158].includes(this.baseInfo.catId))
        ) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    showRecommendSizePopup: {
      handler(val) {
        if (val) {
          const form = {
            bust: '',
            waist: '',
            hips: '',
            height: '',
            hollow_to_floor: ''
          }
          this.selectStockSize(
            {
              key: '',
              name: '',
              styleId: 0,
              form
            },
            true
          )
        }
      },
      immediate: true
    }
  },
  created() {
    // if (this.baseInfo.isSampleCat) {
    //   this.hasSampleFun()
    // }
  },
  methods: {
    selectStockSize(size, bol) {
      if (this.$refs.refName) {
        this.$refs.refName.selectStockSize(size, bol)
      }
      !bol && this.$store.commit('product/setShowRecommendSizePopup', false)
    },
    quickShopClick(params) {
      this.$emit('quickShop', params)
    },
    hasSampleFun() {
      // 获取关联样衣接口
      this.$axios
        .$get('/1.0/product/sample-info', {
          params: { goods_id: this.baseInfo.goodsId, cat_id: this.baseInfo.catId }
        })
        .then((res) => {
          if (res.code == 0) {
            this.$store.commit('product/setSampleInfo', res.data)
            this.$store.commit('product/setHasSample', res.data.hasSample)
            this.$store.commit('product/setSampleUrl', res.data.sampleUrl) // 对应样衣的跳转地址
          }
        })
    }
  }
}
</script>
<style lang="less" scoped>
.prod-info {
  height: max-content;
  .normal-stock-block {
    .tab-content {
      border-bottom: 2px solid @theme-color;
      margin-top: 20px;
      display: flex;
      margin-bottom: 20px;
      .icon-question {
        fill: currentColor;
        color: #ccc;
        margin-left: 3px;
        cursor: pointer;
        &.checked {
          color: #666;
        }
      }
      span {
        color: @theme-color;
        cursor: pointer;
        display: inline-block;
        font-family: @font-family-600;
        font-size: 14px;
        height: 38px;
        line-height: 38px;
        width: 50%;
        text-align: center;
        &.checked {
          background: @theme-color;
          color: #fff;
          border-bottom: 2px solid @theme-color;
          em {
            color: @theme-color;
          }
        }
      }
    }
  }
}
</style>
