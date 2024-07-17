<template>
  <div id="product_info_part">
    <!-- false 部分不再使用了，这里设置true是为了使用component is 的时候eslint不报错 -->
    <template v-if="isSpecialCatId(catId) || true">
      <div class="product-detail-tabs">
        <p
          v-track.viewOnce.click="getBiTabCommonParams(tab.ec, tab.el)"
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['product-detail-tabs-item', { active: activeTab == tab.tabLabel }]"
          @click.stop="changeTab(tab)"
        >
          {{ nl(tab.tabTitle) }}
        </p>
      </div>
      <!-- eslint-disable vue/require-component-is -->
      <div :class="['product-detail-tab-container', { wgd: isSpecialCatId(catId) }]">
        <component
          v-bind:is="currentComponentName"
          :baseInfo="baseInfo"
          :detailsInfo="detailsInfo"
          :giftInfo="giftInfo"
          :swatchInfo="swatchInfo"
          :videoInfo="videoInfo"
          :stockInfo="stockInfo"
          :makeTimeInfo="makeTimeInfo"
        />
      </div>
    </template>
    <template v-else>
      <product-detail-block :baseInfo="baseInfo" :detailsInfo="detailsInfo" :giftInfo="giftInfo"></product-detail-block>
      <product-description-block
        :baseInfo="baseInfo"
        :detailsInfo="detailsInfo"
        :swatchInfo="swatchInfo"
        :videoInfo="videoInfo"
        :giftInfo="giftInfo"
      ></product-description-block>
      <product-shipping-info-block
        :baseInfo="baseInfo"
        :stock-info="stockInfo"
        :make-time-info="makeTimeInfo"
        :detailsInfo="detailsInfo"
      ></product-shipping-info-block>
      <template v-if="showModelBlock">
        <ProductModelBlock :detailsInfo="detailsInfo" />
      </template>
    </template>
  </div>
</template>

<script>
import productDescriptionBlock from '@/components/product/ProductInfoDetailBlock/ProductDescriptionBlock'
import productDetailBlock from '@/components/product/ProductInfoDetailBlock/ProductDetailBlock'
import productShippingInfoBlock from '@/components/product/ProductInfoDetailBlock/ProductShippingInfoBlock'
import ProductModelBlock from '@/components/product/ProductInfoDetailBlock/ProductModelBlock'

export default {
  name: 'ProductInfoDetail',
  languageKeys: [
    'page_goods_product_details',
    'page_description_and_no_tips',
    'page_description_and_tips',
    'page_common_size_and_fit',
    'page_processing_time_and_return',
    'page_shipping_and_return',
    'page_common_model_info',
    ...productDescriptionBlock.languageKeys,
    ...productDetailBlock.languageKeys,
    ...productShippingInfoBlock.languageKeys,
    ...ProductModelBlock.languageKeys
  ],
  components: {
    productDescriptionBlock,
    productDetailBlock,
    productShippingInfoBlock,
    ProductModelBlock
  },
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
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
        return null
      }
    },
    giftInfo: {
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
    makeTimeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      activeTab: 'detail',
      currentComponentName: 'productDetailBlock'
    }
  },
  computed: {
    tabs({ baseInfo, detailsInfo, showModelBlock }) {
      const list = [
        {
          tabTitle: 'page_goods_product_details',
          tabLabel: 'detail',
          componentName: 'productDetailBlock',
          ec: 'productdetails',
          el: 'entrance',
          show: !this.isSpecialCatId(baseInfo.catId) && detailsInfo.showDetails
        },
        {
          tabTitle: baseInfo.catId == 10 ? 'page_description_and_no_tips' : 'page_description_and_tips',
          tabLabel: 'sample',
          componentName: 'productDescriptionBlock',
          ec: 'description&tips',
          el: 'entrance',
          show: true
        },
        {
          tabTitle: 'page_common_size_and_fit',
          tabLabel: 'detail',
          componentName: 'productDetailBlock',
          ec: 'productdetails',
          el: 'entrance',
          show: this.isSpecialCatId(baseInfo.catId) && baseInfo.isMassProduct != 0 && detailsInfo.showDetails
        },
        {
          tabTitle: detailsInfo.isRush ? 'page_processing_time_and_return' : 'page_shipping_and_return',
          tabLabel: 'shipping',
          componentName: 'productShippingInfoBlock',
          ec: 'shipping&return',
          el: 'entrance',
          show:
            !baseInfo.isComingSoon &&
            !baseInfo.isGiftCard &&
            (!this.isSpecialCatId(baseInfo.catId) || (this.isSpecialCatId(baseInfo.catId) && baseInfo.isMassProduct == 0))
        },
        {
          tabTitle: 'page_common_model_info',
          tabLabel: 'model',
          componentName: 'ProductModelBlock',
          ec: 'productmodelinfo',
          el: 'entrance',
          show: showModelBlock
        }
      ]
      return list.filter((item) => item.show)
    },
    showModelBlock({ detailsInfo }) {
      const { modelDetailsConf = {}, plusSizeModelDetailsConf = {} } = detailsInfo.modelInfo || {}
      return Object.keys(modelDetailsConf).length > 0 || Object.keys(plusSizeModelDetailsConf).length > 0
    }
  },
  created() {
    this.activeTab = this.isSpecialCatId(this.catId) || !this.detailsInfo.showDetails ? 'sample' : 'detail'
    this.currentComponentName =
      this.isSpecialCatId(this.catId) || !this.detailsInfo.showDetails ? 'productDescriptionBlock' : 'productDetailBlock'
    this.$store.commit('product/setCurrentBlock', this.activeTab)
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab.tabLabel
      this.currentComponentName = tab.componentName
      this.$store.commit('product/setCurrentBlock', tab.tabLabel)
    },
    getBiTabCommonParams(ec, el) {
      return {
        common: {
          ec,
          el,
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType,
            cat_id: this.baseInfo.catId
          })
        }
      }
    }
  }
}
</script>

<style lang="less">
#product_info_part {
  margin-top: 25px;
  .split_line {
    height: 10px;
    background: var(--color-f9f9f9);
  }
  .info-block {
    .info-block-container {
      margin-top: 15px;
      margin-bottom: 27px;
      font-size: 13px;
      padding: 0 10px;
      a {
        text-decoration: underline;
        color: var(--color-666666);
      }
      .info-block-title {
        font-family: @font-family-600;
        font-size: 13px;
        color: var(--color-121212);
        margin-bottom: 5px;
      }
      .info-block-content {
        font-family: @font-family-500;
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
        line-height: 20px;
        div,
        span,
        pre,
        p,
        a {
          font-family: @font-family-500;
          font-size: 13px;
          color: #666;
          line-height: 20px;
          //margin-bottom: 10px;
        }
        .pannier_gift {
          color: @theme-color !important;
          text-transform: none;
          font-family: @font-family-600 !important;
          .what_is_pannier {
            text-decoration: underline;
            cursor: pointer;
            &:hover {
              color: @theme-color;
              span {
                color: @theme-color;
              }
            }
          }
        }
      }
      .size_guide_title {
        font-family: @font-family-600;
        font-size: 14px;
        color: var(--color-121212);
        width: 100%;
        height: 55px;
        box-shadow: 0px 3px 6px 1px #aaaaaa;
        margin-bottom: 5px;
        .size_col {
          font-family: @font-family-600;
        }
      }
      .size_guide_chart {
        overflow: scroll;
      }
      .size_guide_chart::-webkit-scrollbar {
        display: none;
      }
      .size_col {
        width: 50%;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        font-family: Avenir-Roman;
        color: var(--color-121212);
      }
      .size_row {
        display: table;
        box-sizing: border-box;
        width: 100%;
      }
      .size_row_odd {
        background-color: #f6f6f6;
      }
      .size_row_value {
        height: 40px;
      }
    }
  }
  .block_bar_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    border: none;
    border-top: 1px solid #ccc;
    padding: 0 10px;
    cursor: pointer;
    .block_bar_desc {
      font-family: @font-family-600;
      font-size: 14px;
      color: var(--color-121212);
      text-transform: uppercase;
    }
    .switch {
      .switch_open,
      .switch_close {
        width: 10px;
        height: 10px;
      }
    }
  }
  .info-block {
    transition: all 0.25s ease;
    &.open {
      .block_bar_title {
        border-bottom: 1px solid #ccc;
      }
      .switch_close {
        display: block;
      }
      .switch_open {
        display: none;
      }
      .info-block-container {
        display: block;
      }
    }
    &.close {
      .block_bar_title {
        border-bottom: none;
      }

      .switch_close {
        display: none;
      }
      .switch_open {
        display: block;
      }
      .info-block-container {
        display: none;
      }
    }
    &:last-child {
      .block_bar_title {
        border-bottom: 1px solid #ccc;
      }
    }
  }
  // todo: wgd 样式
  .product-detail-tabs {
    width: 100%;
    margin: 25px auto 14px;
    box-shadow: 0 1px 0 var(--color-121212);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .product-detail-tabs-item {
      padding-top: 10px;
      padding-bottom: 6px;
      font-family: @font-family-600;
      font-size: 16px;
      line-height: 22px;
      color: #999;
      text-transform: uppercase;
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 30px;
      }
      &.active {
        position: relative;
        color: var(--color-121212);
        transition: all 0.2s ease-in-out;
        &::after {
          content: '';
          position: absolute;
          display: inline-block;
          width: 100%;
          height: 5px;
          background-color: var(--color-121212);
          left: 0;
          bottom: 0;
          transform: translateY(50%);
          transition: all 0.4s ease-in-out;
        }
      }
    }
  }
  .product-detail-tab-container {
    .block_bar_title {
      display: none;
    }
    &.wgd {
      .info-block-title {
        display: none;
      }
    }
    .info-block-container {
      padding: unset !important;
      margin: 14px auto 25px !important;
      .wgd {
        display: inline-grid;
        grid-template-columns: calc(70% - 15px) calc(30% - 15px);
        column-gap: 30px;
      }
    }
  }
}
</style>
