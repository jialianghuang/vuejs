<template>
  <div
    id="shipping_info"
    v-if="!baseInfo.isComingSoon && !baseInfo.isGiftCard"
    :class="blockOpen ? 'open' : 'close'"
    class="info-block"
    block-name="shipping"
  >
    <div
      @click="toggleBlock('shipping')"
      :data-datalayer-label="blockLabel"
      class="block_bar_title need_datalayer"
      data-datalayer-category="PC_DetailPageRevision"
    >
      <div v-if="detailsInfo.isRush" class="block_bar_desc">{{ nl('page_processing_time_and_return') }}</div>
      <div v-else class="block_bar_desc">{{ nl('page_shipping_and_return') }}</div>
      <div class="switch">
        <az-icon class="switch_close" icon-class="icon-lby_add" />
        <az-icon class="switch_open" icon-class="icon-lby_subtraction" />
      </div>
    </div>

    <client-only>
      <div class="info-block-container shipping_info_container">
        <div v-if="detailsInfo.isRush">
          <div v-track.view="{ common: getBiParams('processing') }" class="info-block-title">{{ nl('page_common_processing_time') }}</div>
          <div v-html="makeTimeInfo.productTimeTxt || detailsInfo.productTime.txt" class="info-block-content"></div>
        </div>
        <div>
          <div v-track.view="{ common: getBiParams('shippingtime') }" class="info-block-title">{{ getShipingTitle }}</div>
          <div
            id="href_shipping"
            v-if="isCurrentStyleSupportStock"
            v-html="nl('page_goods_robes_ship_time')"
            class="info-block-content"
          ></div>
          <div id="href_shipping" v-else v-html="detailsInfo.shipping.txt" class="info-block-content"></div>
        </div>
        <product-shipping :baseInfo="baseInfo" :makeTimeInfo="makeTimeInfo" :support-stock-sales="supportStockSales"></product-shipping>
        <div class="return">
          <div class="info-block-title">{{ nl('page_common_returns') }}</div>
          <div id="href_shipping" v-if="isCurrentStyleSupportStock" class="info-block-content">
            <template v-if="country === 'MX' && baseInfo.mxNotReturn">
              {{ nl('page_bag_return_note') }}
            </template>
            <template v-else>
              <span v-if="['US', 'CA'].includes(country) && isSpecialCatId(catId)">
                {{ nl('page_common_see_our') }}
                <a :href="getSupportUrl(`/articles/360001805031-General-Shipping-Information`, `/articles/8076714`)">{{
                  nl('page_common_free_shipping')
                }}</a>
                {{ nl('page_common_or') }}
                <a :href="getSupportUrl(`/articles/115005951206-What-is-your-return-policy`, '/articles/8075724')">{{
                  nl('page_setting_return_policy')
                }}</a>
                {{ nl('page_common_pages') }}
              </span>
              <span v-else
                ><a
                  :href="getSupportUrl(`/articles/115005951206-What-is-your-return-policy-`, '/articles/8075724')"
                  class="return_policy"
                  >{{ nl('page_free_return_note') }}</a
                >
                {{ nl('page_goods_are_available_for') }}</span
              >
            </template>
          </div>
          <!-- jira15358 -->
          <template v-else>
            <span v-if="['US', 'CA'].includes(country) && isSpecialCatId(catId)">
              {{ nl('page_common_see_our') }}
              <a :href="getSupportUrl(`/articles/360001805031-General-Shipping-Information`, `/articles/8076714`)">{{
                nl('page_common_free_shipping')
              }}</a>
              {{ nl('page_common_or') }}
              <a :href="getSupportUrl(`/articles/115005951206-What-is-your-return-policy`, '/articles/8075724')">{{
                nl('page_setting_return_policy')
              }}</a>
              {{ nl('page_common_pages') }}
            </span>
            <div id="href_return" v-else v-html="detailsInfo.return.txt" class="info-block-content"></div>
          </template>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductShipping from '@/components/product/ProductShipping'

export default {
  name: 'ProductShippingInfoBlock',
  languageKeys: [
    'page_goods_robes_ship_time',
    'page_processing_time_and_return',
    'page_common_returns',
    'page_shipping_and_return',
    'page_common_shipping_time',
    'page_expedited_express_shipping',
    'page_free_return_note',
    'page_goods_are_available_for',
    'page_common_processing_time',
    'page_expedited_standard_shipping',
    'page_bag_return_note',
    'page_common_see_our',
    'page_common_free_shipping',
    'page_common_or',
    'page_setting_return_policy',
    'page_common_pages',
    'page_expedited_express_shipping_au'
  ],
  components: { ProductShipping },
  props: {
    value: {
      type: Number,
      default: -1
    },
    detailsInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    baseInfo: {
      type: Object,
      default() {
        return {}
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
      TABLE_TEST: 'A'
    }
  },
  computed: {
    ...mapState('product', ['currentBlock', 'isCurrentStyleSupportStock']),
    blockLabel() {
      const blockOpenStatus = this.blockOpen ? 'Open' : 'Close'
      return 'DetailPage' + this.TABLE_TEST + '_ShippingReturn' + blockOpenStatus + '_Click'
    },
    supportStockSales() {
      // BD库存与非库存
      return this.baseInfo.supportStockSales && this.stockInfo && this.stockInfo.hasStock
    },
    blockOpen() {
      return this.currentBlock == 'shipping'
    },
    getShipingTitle() {
      if (this.baseInfo.isComingSoon) {
        return this.nl('page_common_shipping_time')
      } else if (!['AU', 'GB'].includes(this.country) && (this.baseInfo.isStockGoods || this.isCurrentStyleSupportStock)) {
        return this.nl('page_common_shipping_time') + this.nl('page_expedited_express_shipping')
      } else if (this.country === 'AU' && this.baseInfo.dressType === 'sample') {
        return this.nl('page_common_shipping_time') + this.nl('page_expedited_express_shipping_au')
      } else {
        return this.nl('page_common_shipping_time') + this.nl('page_expedited_standard_shipping')
      }
    }
  },
  beforeDestroy() {
    const hrefShipping = document.querySelector('#href_shipping > a')
    hrefShipping && hrefShipping.removeEventListener('click', this.shippingPoint)
    const hrefReturn = document.querySelector('#href_return > a')
    hrefReturn && hrefReturn.removeEventListener('click', this.returnPoint)
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted() {
    // shipping 打点
    const hrefShipping = document.querySelector('#href_shipping > a')
    hrefShipping && hrefShipping.addEventListener('click', this.shippingPoint)
    // return 打点
    const hrefReturn = document.querySelector('#href_return > a')
    hrefReturn && hrefReturn.addEventListener('click', this.returnPoint)
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const elePD = document.getElementById('shipping_info')
      if (!elePD) return
      const screenHeight = window.screen.height
      const eleBottom = elePD.getBoundingClientRect().bottom
      if (eleBottom < screenHeight) {
        this.setPoint('shipping&return', 'entrance', 'view')
        window.removeEventListener('scroll', this.handleScroll)
      }
    },
    getBiParams(el) {
      return {
        ec: 'shipping&return',
        el,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType,
          cat_id: this.baseInfo.catId
        })
      }
    },
    shippingPoint() {
      this.setPoint('shipping&return', 'shipping', 'click')
    },
    returnPoint() {
      this.setPoint('shipping&return', 'free returns', 'click')
    },
    toggleBlock(val) {
      this.setPoint('shipping&return', 'entrance', 'click')
      if (this.blockOpen) {
        this.$store.commit('product/setCurrentBlock', '')
      } else {
        this.$store.commit('product/setCurrentBlock', val)
      }
    },
    setPoint(ec, el, ea, msg = {}) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType,
          cat_id: this.baseInfo.catId,
          ...msg
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
#shipping_info .return a {
  text-underline-offset: 4px;
  text-decoration: underline;
}
</style>
