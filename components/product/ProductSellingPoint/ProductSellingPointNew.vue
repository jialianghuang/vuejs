<template>
  <div v-if="!isEmpty || isClearance">
    <div :class="['selling-point-new', { 'sod-pre-sale-first': isFromSodPreSaleList && showSodText }]">
      <div class="selling-point-main">
        <az-icon icon-class="icon-a-FreeStandardShipping" class="freeship-icon"></az-icon>
        <template v-if="showWordsType === 1">
          {{ nl('page_product_selling_point_base') }}
          <span class="selling-point-item">{{ showedPointsText }}!</span>
        </template>
        <template v-else-if="showWordsType === 2">
          <span class="selling-point-item font-normal">{{ showedPointsText }}!</span>
        </template>
        <template v-else-if="showWordsType === 3">
          {{ nl('page_product_selling_point_base2') }}
          <span class="selling-point-item">{{ showedPointsText }}!</span>
        </template>
        <span v-track.view.click="{ common: getBiParams() }" @click="visible = true" class="see-more">
          {{ nl('page_common_see_more') }}
        </span>
      </div>
      <az-popup-layer :zIndex="12" @close="handlePopupClose" v-if="visible" width="600px" padding="0px" height="auto">
        <div class="selling-point-popup">
          <div class="selling-point-popup-main">
            <template v-for="item in sellingPoints">
              <a
                v-if="item.show"
                :key="item.key"
                :href="item.link ? item.link : 'javascript:;'"
                :style="{ cursor: item.link ? 'pointer' : 'default' }"
              >
                <div class="selling-point-popup-item">
                  <az-icon :icon-class="item.icon"></az-icon>
                  <span class="selling-point-popup-title">{{ item.title }}</span>
                  <div v-html="item.des" class="selling-point-popup-des"></div>
                </div>
              </a>
            </template>
          </div>
          <div class="selling-point-popup-question">
            <span class="title">{{ nl('page_goods_questions') }}?</span>
            <span v-html="nl('page_selling_point_questions')"></span>
          </div>
        </div>
      </az-popup-layer>
    </div>
    <div v-if="isFromSodPreSaleList && showSodText" class="selling-point-new sod-pre-sale-second">
      <div class="selling-point-main">
        <az-icon icon-class="sod-pre-sale-made-to-order" class="freeship-icon"></az-icon>
        <p class="selling-point-item">{{ showSodText }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import { countryList } from '@/assets/js/euSizeMap'
import { mapState } from 'vuex'
import productSellingPointMixin from './productSellingPointMixin'

/**
 * 商品详情卖点新版本内容样式组件
 */
export default {
  languageKeys: [
    'page_product_selling_point_base',
    'page_product_selling_point_base2',
    'page_common_see_more',
    'page_goods_questions',
    'page_selling_point_questions',
    ...countryList.map((v, i) => 'page_product_selling_point_free_ship_tips_goods_' + v),
    'page_product_selling_point_free_ship_tips_samples',
    'page_common_free_shipping',
    'page_product_selling_point_free_custom_size',
    'page_product_selling_point_free_custom_size_des',
    'page_selling_point_a_free_garment_bag',
    'page_selling_point_a_free_garment_bag_desc',
    'page_product_selling_point_free_shipping',
    'page_product_selling_point_free_returns',
    'page_product_selling_point_free_returns_tips_wgd',
    'page_product_selling_point_free_returns_tips',
    'page_selling_point_tape_measure',
    ...countryList.map((v, i) => 'page_selling_point_tape_measure_' + v),
    'page_add_to_cart_only_text',
    ...countryList.map((v, i) => 'page_add_to_cart_only_text_' + v),
    'page_product_selling_point_ready_to_ship',
    'page_order_detail_clearance_no_return',
    'page_product_selling_point_free_rush_production',
    'page_product_selling_point_text1',
    'page_product_selling_point_text2',
    'page_selling_point_free_pannier',
    'page_popup_pannier_text',
    ...countryList.map((v, i) => 'page_free_pannier_ship_delivery_' + v),
    ...countryList.map((v, i) => 'page_product_selling_point_over_' + v),
    ...countryList.map((v, i) => 'page_selling_point_free_ship_link_' + v),
    ...countryList.map((v, i) => 'page_selling_point_free_custom_size_link_' + v),
    ...countryList.map((v, i) => 'page_garment_bags_gift_desc_' + v),
    'page_common_sod_preorder_text10',
    'page_common_sod_preorder_text11'
  ],
  components: {
    AzPopupLayer
  },
  mixins: [productSellingPointMixin],
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState({
      showWordsType: (state) => state.product.showWordsType,
      isFromSodPreSaleList: (state) => state.product.isFromSodPreSaleList
    }),
    processTime() {
      if (this.baseInfo.isStockGoods) {
        return `${this.makeTimeInfo.minDays} - ${this.makeTimeInfo.maxDays} business days`
      } else {
        return this.makeTimeInfo.useMinWeek ? `Within: ${this.makeTimeInfo.minWeeks} weeks` : `${this.makeTimeInfo.description}`
      }
    },
    // 所有的卖点数据
    sellingPoints() {
      // 默认正价裙子文案
      let freeShippingDes = this.nl('page_product_selling_point_free_ship_tips_goods_' + this.country.toLowerCase())
      if (this.baseInfo.isThresholdFreeShipping) {
        freeShippingDes = this.nl('page_product_selling_point_free_ship_tips_goods_' + this.country.toLowerCase())
      } else if (this.baseInfo.dressType === 'sample') {
        freeShippingDes = this.nl('page_product_selling_point_free_ship_tips_samples')
      }
      return [
        {
          key: 'free_shipping',
          name: this.nl('page_common_free_shipping'), // 在详情中展示的卖点名称
          title: this.nl('page_common_free_shipping'), // 在卖点弹框中展示的卖点名称标题，可能会比name长
          des: freeShippingDes,
          link: this.nl(`page_selling_point_free_ship_link_${this.country.toLowerCase()}`),
          icon: 'icon-a-FreeStandardShipping',
          show: this.freeShipping || this.isClearance
        },
        {
          key: 'free_custome_sizing',
          name: this.nl('page_product_selling_point_free_custom_size'),
          title: this.nl('page_product_selling_point_free_custom_size'),
          des: this.nl('page_product_selling_point_free_custom_size_des'),
          link: this.nl(`page_selling_point_free_custom_size_link_${this.country.toLowerCase()}`),
          icon: 'icon-a-FreeCustomSizing',
          show: this.freeCustomSize
        },
        {
          key: 'free_garment_bag',
          name: this.nl('page_selling_point_a_free_garment_bag'),
          title: this.nl('page_garment_bags_gift_desc_' + this.country.toLowerCase()),
          des: this.nl('page_selling_point_a_free_garment_bag_desc'),
          link: '/products/azazie-wedding-garment-bag?color=white',
          icon: 'icon-a-GarmentBag',
          show: this.isGarmentBags
        },
        {
          key: 'free_return',
          name: this.nl('page_product_selling_point_free_returns'),
          title: this.nl('page_product_selling_point_free_returns'),
          des: this.nl('page_product_selling_point_free_returns_tips'),
          link: this.getSupportUrl(`/articles/115005951206-What-is-your-return-policy-`, '/articles/8075724'),
          icon: 'icon-a-FreeReturns',
          show: this.freeReturns
        },
        {
          key: 'tape_measure',
          name: ['AU', 'GB', 'IE', 'DE'].includes(this.country)
            ? this.nl('page_selling_point_tape_measure_' + this.country.toLowerCase())
            : this.nl('page_selling_point_tape_measure'),
          title: ['AU', 'GB', 'IE', 'DE'].includes(this.country)
            ? this.nl('page_selling_point_tape_measure_' + this.country.toLowerCase())
            : this.nl('page_selling_point_tape_measure'),
          des:
            this.country === 'AU'
              ? this.nl('page_add_to_cart_only_text_au')
              : this.country === 'GB'
              ? this.nl('page_add_to_cart_only_text_gb')
              : this.nl('page_add_to_cart_only_text'),
          link: ['IT', 'ES', 'IE'].includes(this.country) ? '' : '/products/azazie-tape-measure?subsite=bridal',
          icon: 'icon-a-Azazietape',
          show: this.addToCartOnly
        },
        {
          key: 'ready_to_ship',
          name: this.nl('page_product_selling_point_ready_to_ship'),
          title: this.nl('page_product_selling_point_ready_to_ship'),
          des: this.nl('page_order_detail_clearance_no_return'),
          link:
            this.country === 'DE'
              ? this.getSupportUrl(`/articles/205019699-Rush-Production-and-Expedited-Shipping`, `/articles/8153075`)
              : this.getSupportUrl(`/articles/115005989606-Ready-to-Ship-Outlet-Dresses`, `/articles/8076754`),
          icon: 'icon-a-ReadytoShip',
          show: this.readyToShip
        },
        {
          key: 'free_rush_production',
          name: this.nl('page_product_selling_point_free_rush_production'),
          title: this.nl('page_product_selling_point_free_rush_production'),
          des:
            this.nl('page_product_selling_point_text1') +
            this.makeTimeInfo.specialOfferTime +
            this.nl('page_product_selling_point_text2') +
            this.processTime,
          link:
            this.country === 'DE'
              ? this.getSupportUrl(`/`, `/`)
              : this.getSupportUrl(`/articles/205019699-Rush-Production-and-Expedited-Shipping`, `/articles/8153075`),
          icon: 'icon-a-FreeRushProduction',
          show: this.makeTimeInfo.specialOfferTime
        },
        {
          key: 'free_pannier',
          name: this.nl('page_selling_point_free_pannier'),
          title: this.nl('page_free_pannier_ship_delivery_' + this.country.toLowerCase()),
          des: this.nl('page_popup_pannier_text'),
          link: this.getSupportUrl(`/`, `/`),
          icon: 'icon-a-FreePannier',
          show: this.freePannier
        }
      ]
    },
    // 返回sellingPoints中允许展示的数据项
    showedPoints() {
      return this.sellingPoints.filter((ele) => {
        return !!ele.show
      })
    },
    // 返回经过判断拼接后的所有卖点文本内容
    showedPointsText() {
      const showedPoints = this.showedPoints
      const over = this.nl('page_product_selling_point_over_' + this.country.toLowerCase())
      let res = ''
      for (let i = 0; i < showedPoints.length; i++) {
        const ele = showedPoints[i]
        let tempName = ele.name
        if (this.showWordsType === 2 && ele.key === 'free_shipping') {
          tempName = ele.name + ' ' + over
        }
        if (showedPoints.length === 1) {
          res = tempName
        } else {
          if (i > 0 && i === showedPoints.length - 1) {
            res = res + ' & ' + tempName
          }
          if (i < showedPoints.length - 2) {
            res = res + tempName + ', '
          } else if (i === showedPoints.length - 2) {
            res = res + tempName
          }
        }
      }
      return res
    },
    showSodText({ baseInfo, nl }) {
      if (!baseInfo.preSaleSticker || !this.isSpecialCatId(baseInfo.catId) || baseInfo.isFinalSale || baseInfo.dressType != 'dress')
        return null
      const textObj = {
        made_to_order: nl('page_common_sod_preorder_text10'),
        limited_stock: nl('page_common_sod_preorder_text11')
      }
      return textObj[baseInfo.preSaleSticker] || null
    }
  },
  methods: {
    getBiParams() {
      return {
        ec: 'sellingpoint',
        el: 'seemore',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.baseInfo.color,
          cat_name: this.baseInfo.catName
        })
      }
    },
    handlePopupClose() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.selling-point {
  &-new {
    background: @bg-color;
    padding: 10px;
    color: var(--color-121212);
    font-family: @font-family-500;
    display: flex;
    margin: 15px 0 10px;
    .freeship-icon {
      font-size: 20px;
      margin-right: 10px;
      vertical-align: middle;
    }
    &.sod-pre-sale-first {
      margin-top: 15px;
      margin-bottom: 0;
    }
    &.sod-pre-sale-second {
      margin-top: 0;
      padding-top: 0;
      .selling-point-item {
        display: inline-block;
        color: var(--color-121212);
        font-family: @font-family-500;
        font-size: 12px;
        &::first-letter {
          text-transform: uppercase;
        }
      }
    }
  }
  &-main {
    font-size: 12px;
    line-height: 20px;
    .see-more {
      text-decoration: underline;
      color: var(--color-121212);
      text-transform: capitalize;
      cursor: pointer;
    }
  }
  &-item {
    font-family: @font-family-600;
    &.font-normal {
      font-family: @font-family-500;
    }
  }
  &-popup {
    max-height: 550px;
    overflow: auto;
    a {
      color: var(--color-121212);
    }
    &-main {
      padding: 40px;
      overflow: auto;
      > a {
        display: block;
        margin-bottom: 20px;
        &:last-of-type {
          margin-bottom: 0px;
        }
      }
    }
    .close-icon {
      position: absolute;
      right: 15px;
      top: 15px;
      font-size: 15px;
    }
    &-item {
      text-align: center;
      .az-icon {
        font-size: 24px;
      }
    }
    &-title {
      font-size: 13px;
      line-height: 20px;
      font-family: @font-family-600;
      display: block;
      margin-top: 5px;
    }
    &-des {
      font-size: 13px;
      line-height: 20px;
      font-family: @font-family-500;
    }
    &-question {
      padding: 15px;
      background: var(--color-f9f9f9);
      font-size: 13px;
      line-height: 20px;
      text-align: center;
      font-family: @font-family-500;
      display: flex;
      align-items: center;
      justify-content: center;
      .title {
        font-family: @font-family-600;
        margin-right: 5px;
      }
      /deep/ a {
        text-decoration: underline;
      }
    }
  }
}
</style>
