<template>
  <div id="shipping_method" class="shipping-method-block">
    <block-title
      :title="nl('page_order_shipping_method')"
      :tipLink="getSupportUrl(`/articles/360001805031-General-Shipping-Information`, `/articles/8076714`)"
    ></block-title>
    <div class="method-content">
      <div v-if="shippingAddress && shippingAddress.length" class="shipping-method-list">
        <ul>
          <li v-for="(item, index) in shippingMethodList" :key="index">
            <div
              :class="{ selected: shippingMethodId == item.smId }"
              @click="handleSelectShippingMethod(item.smId, item.shippingTitle)"
              class="shipping-method-item"
            >
              <span :class="{ selected: shippingMethodId == item.smId }" class="radio-icon"></span>
              <span>
                <span :class="{ 'theme-color': item.shippingFeeDescNew }" class="shipping-fee">{{ item.shippingFeeDesc }}</span>
                <span v-if="item.shippingFeeDescNew" class="shipping-fee-line-through">{{ item.shippingFeeDescNew }}</span>
                <span class="shipping-desc-title">{{ item.shippingTitle.replace(',', '') }},</span>
                <span class="shipping-desc-date">{{ getCapitalize(item.deliveryDateDesc) }}</span>
                <em class="line-through">{{ item.lineDrawingPrice }}</em>
                <em class="theme-color"> {{ item.shippingFee }}</em>
              </span>
              <PreSaleShippingNotice v-if="sodPreSaleGoods" />
            </div>
            <p v-if="item.shippingFeeDescNew" class="shipping-method-item-tips">
              {{ nl('page_checkout_expedited_shipping_tip') }}
            </p>
          </li>
          <i v-for="i in 3" :key="i - 30"></i>
        </ul>
      </div>
      <div v-else v-track.view="{ common: getBiParams('unavailable') }">{{ nl('page_shipping_method_options_tips') }}</div>
    </div>
  </div>
</template>

<script>
import BlockTitle from '@/components/checkout/BlockTitle'
// import { debounce } from '@/assets/js/utils'
import { mapState } from 'vuex'
export default {
  name: 'ShippingMethod',
  components: {
    BlockTitle
  },
  data() {
    return {
      init: false
    }
  },
  computed: {
    ...mapState('checkout', ['shippingMethodId', 'shippingMethodList', 'shippingAddress', 'payProductList']),
    sodPreSaleGoods({ payProductList }) {
      return (payProductList || []).some((item) => this.isSpecialCatId(item.catId) && item.sodPreSaleGoods)
    }
  },
  watch: {
    shippingMethodId() {
      if (
        this.shippingMethodId &&
        this.getShippingTitle(this.shippingMethodId) &&
        this.shippingAddress &&
        this.shippingAddress.length &&
        !this.init
      ) {
        // ga4 打点 默认情况下（即使用户未点击）也触发该埋点，以保证整个结算流程数据的完整性。只打一次
        this.$emit('setCheckoutGA4', {
          type: 'add_shipping_info',
          shippingTitle: this.getShippingTitle(this.shippingMethodId)
        })
        this.init = true
      }
    }
  },
  methods: {
    getBiParams(el) {
      if (process.server) return
      return {
        ec: 'shippingmethod',
        el,
        param1: (location && location.href) || '-1'
      }
    },
    handleSelectShippingMethod(smId, shippingTitle) {
      // 客户端先更改选项选择
      if (this.shippingMethodId == smId) return false
      sessionStorage.setItem('shippingMethodIdPrev', this.shippingMethodId)
      this.$store.commit('checkout/setShippingMethodId', smId)
      this.$store.commit('checkout/setLoadingFlag', true)
      this.getCheckoutInfo()
      // debounce(this.getCheckoutInfo, 500)
      // ga4 打点
      this.$emit('setCheckoutGA4', {
        type: 'add_shipping_info',
        shippingTitle
      })
    },
    getCheckoutInfo() {
      // 请求后端数据更新summary及shippingInfo
      this.$emit('setCheckoutAmount')
    },
    getCapitalize(text) {
      return (
        this.nl(text)
          .charAt(0)
          .toUpperCase() + this.nl(text).substring(1)
      )
    },
    getShippingTitle(id) {
      if (!this.shippingMethodList || !id) return ''
      let shippingTitle = ''
      this.shippingMethodList.forEach((item) => {
        if (id == item.smId) {
          shippingTitle = item.shippingTitle
        }
      })
      return shippingTitle
    }
  }
}
</script>

<style lang="less" scoped>
.theme-color {
  color: @theme;
}
.line-through {
  text-decoration: line-through;
}
.shipping-method-block {
  .method-content {
    padding: 20px 0 60px;
  }
  .shipping-method-list {
    ul {
      li {
        &.hide {
          display: none;
        }
        .shipping-method-item {
          width: fit-content;
          height: 22px;
          padding: 10px 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          border: solid 1px #fff;
          .radio-icon {
            display: block;
            width: 15px;
            height: 15px;
            padding: 2px;
            border-radius: 50%;
            margin-left: 3px;
            margin-right: 10px;
            border: 1px solid #ccc;
            background-clip: content-box;
            box-sizing: border-box;
            &.selected {
              background-color: var(--color-121212);
              cursor: default;
            }
          }
          .shipping-fee {
            display: inline-block;
            // width: 45px;
            // margin-right: 5px;
          }
          .shipping-desc-title {
            margin-left: 10px;
          }
          .shipping-fee-line-through {
            color: var(--color-999999);
            text-decoration: line-through;
          }
        }
        .shipping-method-item-tips {
          margin-left: 30px;
          color: @theme;
          margin-top: -10px;
        }
      }
    }
  }
}
.checkout-box {
  .radio-icon.selected {
    background-color: @black-btn-color!important;
  }
}
</style>
