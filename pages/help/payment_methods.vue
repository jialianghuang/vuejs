<template>
  <div class="payment_methods">
    <SvgPayment />
    <main-app :navigation="navigation">
      <div class="payment_methods-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content">
          <h1 class="title">{{ currentMenuTitle }}</h1>
          <p class="payment-methods-tip">{{ nl('page_payment_methods_text1') }}</p>
          <p>{{ nl('page_payment_methods_text2') }}</p>
          <h3 class="card-title">{{ nl('page_checkout_card') }}:</h3>
          <ul class="card-list">
            <li v-for="(item, index) in payCardList" :key="index" class="card-item">
              <img
                v-if="item == 'cartes-bancaires'"
                :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/77/51/723e448f39d9ccc6f8f1c96bcefa7751.png')"
                alt="cartes bancaires"
              />
              <az-icon v-else :icon-class="item" class="icon"></az-icon>
            </li>
          </ul>
          <h3 class="card-title">{{ nl('page_email_others') }}:</h3>
          <ul class="card-list">
            <li v-for="(item, index) in otherPayCardList" :key="index" class="card-item">
              <az-icon :icon-class="item" :class="item" class="icon"></az-icon>
            </li>
          </ul>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import HelpMenu from '@/components/common/HelpMenu'
import SvgPayment from '@/components/svgs/SvgPayment'

export default {
  name: 'PaymentMethods',
  components: {
    MainApp,
    backToTop,
    HelpMenu,
    SvgPayment
  },
  data() {
    return {
      currentMenuTitle: this.nl('page_common_payment_methods'),
      accountMenu: {},
      loading: false,
      uploadList: []
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/payment-methods`)
      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }
      context.store.commit('setJsKey', 'payment_methods')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {}
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
  }
}
</script>

<style lang="less" scoped>
.payment_methods-main {
  .content {
    .payment-methods-tip {
      margin: 20px 0 15px;
    }
    .card-title {
      margin-top: 30px;
      font-family: @font-family-600, sans-serif;
      font-size: 14px;
      text-transform: uppercase;
    }
    .card-list {
      margin-top: 15px;
      display: flex;
      margin-bottom: 10px;
      .card-item {
        cursor: pointer;
        margin-right: 8px;
        display: flex;
        align-items: center;
        &.selected {
          border-color: var(--color-121212);
        }
        img {
          width: 66px;
          height: 42px;
        }
        /deep/.az-icon {
          width: 66px;
          height: 42px;
          &.card-item-paypal {
            width: 96px;
            margin-top: -8px;
          }
          &.icon-google-pay-2 {
            width: 57px;
            height: 31px;
          }
        }
      }
    }
  }
}
</style>
