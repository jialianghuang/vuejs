<template>
  <div class="sale-box activity-box">
    <main-app ref="main" :navigation="navigation">
      <div class="main-content">
        <sale-promotions
          :categoryActivity="categoryActivity"
          :subTitle="subTitle"
          :title="title"
          v-if="categoryActivity && Object.keys(categoryActivity).length"
        ></sale-promotions>
        <sale-coupon
          :couponActivity="couponActivity"
          @handleCouponWheel="handleCouponWheel"
          @openNewUserCoupon="openNewUserCoupon"
        ></sale-coupon>
        <sale-seo-content v-if="seoInfo && seoInfo.content" :content="seoInfo.content"></sale-seo-content>
        <download-app></download-app>
        <back-to-top></back-to-top>
        <afterpay-layer></afterpay-layer>
      </div>
      <az-dialog :visible="showCouponLucked" @onClose="() => (showCouponLucked = false)" class="coupon-dialog">
        <CouponLucked />
      </az-dialog>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import SalePromotions from '@/components/sale/SalePromotions'
import SaleCoupon from '@/components/sale/SaleCoupon'
import SaleSeoContent from '@/components/sale/SaleSeoContent'
import DownloadApp from '@/components/common/DownloadApp'
import AfterpayLayer from '@/components/common/AfterpayLayer'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import AzDialog from '@/components/az-ui/AzDialog'
import CouponLucked from '@/components/coupon/CouponLucked'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Promotion',
  components: {
    mainApp,
    backToTop,
    SaleSeoContent,
    DownloadApp,
    SalePromotions,
    SaleCoupon,
    AfterpayLayer,
    AzDialog,
    CouponLucked
  },
  data() {
    return {
      showCouponLucked: false
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      flashSale: (state) => state.flashSale
    }),
    ...mapGetters({})
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      // #17393 : All sale中间页改版 ===》  /promotion， 网站sale活动信息以及coupon集合
      const res = await context.$axios.$get('/1.0/sale/all-sale')
      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      }
      context.store.commit('setJsKey', 'promotion')

      return {
        ...commonAsyncData,
        categoryActivity: res.data.categoryActivity || [],
        couponActivity: res.data.couponActivity || [],
        title: res.data.title,
        subTitle: res.data.subTitle,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo
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
  methods: {
    handleCouponWheel() {
      // 打开coupon wheel 弹窗
      this.$refs.main.firstOpen = true
      this.$refs.main.showCouponWheel(true)
    },
    // 打开新户coupon弹框
    openNewUserCoupon() {
      const newUserStep = localStorage.getItem('new_user_step')
      // 领取过直接弹领取成功的提示框
      if (this.$refs.main.hasGetNewUserCoupon || newUserStep == 3) {
        this.showCouponLucked = true
      } else {
        this.showCouponLucked = false
        this.$refs.main.promotionHandler()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sale-box {
  .main-content {
    box-sizing: border-box;
    // max-width: 1903px;
    max-width: 1293px;
    width: 100%;
    clear: both;
    padding: 0;
    margin: auto;
    padding: 60px 30px 0;
  }
  .coupon-dialog {
    /deep/ .az-dialog-content {
      padding: 60px;
      background-color: var(--color-f2e9e6);
      .btn-close {
        background: transparent !important;
      }
    }
  }
}
</style>
