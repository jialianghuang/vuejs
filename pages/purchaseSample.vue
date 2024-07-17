<template>
  <div class="sample-selectopn-box">
    <main-app :navigation="navigation">
      <div class="main-content">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div id="order_items" class="return_items_ordered new_return_items_ordered">
          <h1 class="return-items-title">{{ nl('page_order_purchase_samples') }}</h1>
          <div class="pay-title">
            <h2>{{ nl('page_choose_to_bug') }}</h2>
          </div>
          <div>
            <div class="order-prod-list">
              <pay-product-list-item
                v-for="productItem in goodsList"
                :key="productItem.recId"
                :productItem="productItem"
                :purchaseSamples="true"
                @changeCheckStatus="changeCheckStatus($event)"
              ></pay-product-list-item>
            </div>
            <p class="notice">
              <span class="note">{{ nl('page_size_note') }} </span>
              <span>{{ nl('page_purchase_samples_notice') }}</span>
            </p>
            <div id="checkout-btn" class="cc-btn-wrap">
              <button id="btn_sbmt_order" :disabled="!canContinue" @click="toCheckout" class="btn btn-theme btn-large new-btn-checkout">
                {{ nl('page_common_continue') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import breadCrumb from '@/components/common/Breadcrumb'
import payProductListItem from '@/components/checkout/PayProductListItem'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'PurchaseSample',
  components: {
    mainApp,
    breadCrumb,
    payProductListItem
  },
  data() {
    return {
      canContinue: false,
      isProcessing: false,
      selectedItemCol: []
    }
  },
  computed: {
    breadCrumbInfo() {
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        myOrder: {
          href: `/order/list`,
          title: this.nl('page_head_order')
        },
        currentPage: {
          title: this.nl('page_order_purchase_samples')
        }
      }
    },
    // 从上一页带过来的订单国家标识
    orderCountryCode() {
      return this.$route.query.order_country_code
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const query = context.route.query
      if (!query.hasOwnProperty('order_sn')) {
        context.redirect(302, context.store.state.currentCountryUrl + '/order/list')
        return
      }
      const url = `/1.0/order/purchase-sample-list?order_sn=${query.order_sn}`
      const res = await context.$axios.$get(url)
      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100501) {
        context.redirect(302, context.store.state.currentCountryUrl + `/user/login?back=${context.route.fullPath}`)
        return
      }
      context.store.commit('setJsKey', 'purchase_sample')
      return {
        ...commonAsyncData,
        goodsList: res.data.goodsList,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        resData: res,
        order_sn: query.order_sn
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    if (process.client) {
    }
  },
  methods: {
    changeCheckStatus(itemId) {
      const index = this.selectedItemCol.indexOf(itemId)
      const status = this.canContinue
      if (index === -1) {
        this.selectedItemCol.push(itemId)
      } else {
        this.selectedItemCol.splice(index, 1)
      }

      if (this.selectedItemCol.length > 0) {
        this.canContinue = true
        this.setDataLayer({
          category: 'PurchaseSamples',
          action: 'Click',
          label: 'PurchaseSamples_SampleSelect_Checkbox_Click'
        })
      } else {
        this.canContinue = false
        this.setDataLayer({
          category: 'PurchaseSamples',
          action: 'Click',
          label: 'PurchaseSamples_SampleRemove_Checkbox_Click'
        })
      }
      if (!status && this.canContinue) {
        this.setDataLayer({
          category: 'PurchaseSamples',
          action: 'View',
          label: 'PurchaseSamples_ContinueButton_View'
        })
      }
    },
    toCheckout() {
      if (!this.isProcessing) {
        this.isProcessing = true
        this.setDataLayer({
          category: 'PurchaseSamples',
          action: 'Click',
          label: 'PurchaseSamples_ContinueButton_Click'
        })
        let url = this.countryUrl(
          '/checkout?origin_order_sn=' + this.order_sn + '&order_type=sample&rec_ids=' + this.selectedItemCol.join(',')
        )
        // 如果当前页面路劲中存在订单国家code，进入checkout的路径中也要带上
        if (this.orderCountryCode) {
          url = url + '&order_country_code=' + this.orderCountryCode
        }
        window.location.href = url
      }
    }
  }
}
</script>

<style lang="less">
.sample-selectopn-box {
  /deep/#bread_crumb {
    box-sizing: border-box;
    min-width: 1263px;
    max-width: 1353px;
    width: 100%;
    padding: 8px 30px 30px;
    margin: 0 auto;
  }
  .order-prod-list {
    border-bottom: solid 1px #ccc;
    font-size: 13px;
    margin-top: -1px;
  }
  #order_items {
    box-sizing: border-box;
    min-width: 1263px;
    max-width: 1353px;
    width: 100%;
    padding: 0 30px;
    margin: 0 auto;
  }
  .return-items-title {
    letter-spacing: 1px;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
    padding-bottom: 5px;
  }
  .pay-title {
    width: 752px;
  }
  .pay-title h2 {
    border-top: solid 1px #ccc;
    padding: 20px 0 5px;
    text-transform: uppercase;
    color: var(--color-121212);
    line-height: 18px;
    font-size: 14px;
    font-family: @font-family-600;
  }
  .notice {
    margin: 8px 0 20px;
    font-size: 13px;
    font-family: @font-family-500;
    line-height: 20px;
    .note {
      color: @theme-color;
    }
  }
  #checkout-btn {
    text-align: right;
    padding-bottom: 32px;
    button {
      font-size: 13px;
      font-family: @font-family-600;
      text-transform: uppercase;
      color: #fff;
      background: var(--color-121212);
      width: 176px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      display: inline-block;
      padding: 0;
      border-radius: 0;
      border: none;
      &:hover {
        background: var(--color-1e1e1e);
      }
    }
    button[disabled] {
      background: #ccc;
    }
  }
}
</style>
