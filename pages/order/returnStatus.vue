<template>
  <div class="return-status-box">
    <main-app :navigation="navigation">
      <div class="main-content account-width">
        <order-breadcrumb :listCrumb="listCrumb"></order-breadcrumb>
        <div class="account-flex">
          <account-menu v-if="!isGuest" :accountMenu="accountMenu"></account-menu>
          <div class="account-right">
            <div class="return-status-title">
              <div class="title">{{ nl('page_logistics_return_details') }}</div>
              <a :href="countryUrl(`/order/detail?order_sn=${orderSn}`)" class="back">
                <az-icon icon-class="icon-xxy_arrow_left_l" class="back-icon"></az-icon>{{ nl('page_orders_back_order_detail') }}
              </a>
            </div>
            <!-- 退货状态 -->
            <return-status-info :returnApplyInfo="returnApplyInfo" :returnApplyProcess="returnApplyProcess"></return-status-info>
            <!-- 退货商品列表 -->
            <returned-goods-list :list="returnApplyGoods"></returned-goods-list>
            <!-- 退货单详情 -->
            <returned-information :returnApplyInfo="returnApplyInfo"></returned-information>
          </div>
          <back-to-top></back-to-top>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import ReturnStatusInfo from '@/components/order/ReturnStatusInfo'
import OrderBreadcrumb from '@/components/order/OrderBreadcrumb'
import ReturnedGoodsList from '@/components/order/ReturnedGoodsList'
import ReturnedInformation from '@/components/order/ReturnedInformation'
import AccountMenu from '@/components/user/AccountMenu'
import accountMixins from '@/assets/js/accountMixins'

import { init, getUserIdentity } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'RetureStatus',
  components: {
    mainApp,
    backToTop,
    OrderBreadcrumb,
    AccountMenu,
    ReturnStatusInfo,
    ReturnedGoodsList,
    ReturnedInformation
  },
  mixins: [accountMixins],
  data() {
    return {
      listCrumb: [
        { href: '/order/list', name: this.nl('page_common_my_orders') },
        { href: `/order/detail?order_sn=${this.orderSn}`, name: this.nl('page_common_order_detail') },
        { name: this.nl('page_logistics_return_status') }
      ]
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

      context.store.commit('setJsKey', 'return_status')
      const query = context.route.query
      const url = '/1.0/order/return-apply'
      const res = await context.$axios.$get(url, {
        params: {
          order_sn: query.order_sn,
          return_apply_id: query.return_apply_id
        }
      })

      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, `/user/login?back=${encodeURIComponent(context.route.fullPath)}`)
        return
      }

      await getUserIdentity(context)

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        url,
        returnApplyGoods: res.data.returnApplyGoods,
        returnApplyInfo: res.data.returnApplyInfo,
        returnApplyProcess: res.data.returnApplyProcess,
        orderSn: res.data.orderSn
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
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.main-content {
  min-height: 535px;
  .account-flex {
    display: flex;
    .account-right {
      width: 903px;
      margin-top: 18px;
    }
    .account-left {
      flex: 1;
      margin-right: 1293px - 903px - 350px;
      // 兼容未修改页面
      float: left;
    }
  }

  .return-status-title {
    font-size: 16px;
    line-height: 28px;
    font-family: @font-family-600;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    .title {
      text-transform: uppercase;
    }
    .back {
      font-family: @font-family-500;
      color: var(--color-121212);
      font-size: 13px;
      .back-icon {
        font-size: 9px;
        margin-right: 5px;
        vertical-align: middle;
        margin-top: -2px;
      }
    }
  }

  /deep/ .order-b {
    margin-top: 20px;
    border: 1px solid var(--color-eeeeee);
    .return-status-title {
      padding: 0 15px;
      font-family: @font-family-600;
      font-size: 16px;
      line-height: 40px;
      text-transform: uppercase;
      background: var(--color-f9f9f9);
      border-bottom: 1px solid var(--color-eeeeee);
      height: 40px;
      color: var(--color-121212);
    }
    .order-actions {
      padding: 15px;
      a {
        color: @theme-color;
        text-decoration: underline;
        cursor: pointer;
        margin-right: 20px;
      }
    }
  }
}
/deep/ .return-flow-point {
  padding: 15px 0;
  border-top: 1px solid #ccc;
}
</style>
