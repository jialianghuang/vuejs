<template>
  <div class="my-orders-box">
    <main-app :navigation="navigation">
      <div class="main-content account-width  clearfix">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div class="account-flex">
          <account-menu v-if="!isGuest" :currentMenuType="currentMenuTypeProps" :accountMenu="accountMenu"></account-menu>
          <div class="account-right">
            <div class="account-title">
              <h1>{{ nl(pageTitle) }}</h1>
              <p>{{ nl('page_order_my_orders_need_help_tip') }}</p>
            </div>
            <div class="order-filters">
              <div
                v-for="item in orderFilters"
                :key="item.value"
                :class="[item.cls, orderStatus === item.value ? 'selected' : '']"
                @click="clickFilter(item)"
              >
                {{ item.name }}
              </div>
            </div>
            <div :class="currentMenuType" class="account-content">
              <div class="order-list">
                <div class="title_line">
                  <div class="cell">{{ nl('page_common_items') }}</div>
                  <div class="cell">{{ nl('page_order_order_total') }}</div>
                  <div class="cell">{{ nl('page_goods_review_order_time') }}</div>
                  <div class="cell">{{ nl('page_common_status') }}</div>
                  <div class="cell">{{ nl('page_common_action') }}</div>
                </div>
                <order-list-item
                  :order="order"
                  v-for="order in orders"
                  :key="order.orderId"
                  @handleSetOrder="handleSetOrder"
                  class="order-item"
                ></order-list-item>
                <div v-if="!orders.length" class="empty_order">
                  <img src="~assets/images/order/no_order.png" alt="No order" />
                  <p class="order-empty-text">{{ nl('page_order_no_order') }}</p>
                </div>
              </div>
            </div>
            <az-pager
              :totalPage="pageInfo.totalPage"
              :page="pageInfo.page * 1"
              :isLoading="pageLoading"
              @pageChange="pageChange"
            ></az-pager>
          </div>
        </div>
        <cancel-order-layer
          v-if="cancelOrderLayerShow"
          :orderSn="currentOrder.orderSn"
          :isOxxoPay="currentOrder.paymentId == 256 && currentOrder.payStatus == 2"
        ></cancel-order-layer>
        <return-order-layer v-if="returnOrderLayerShow" :returnOrder="currentOrder" @refreshOrder="refreshOrderList"></return-order-layer>
        <back-to-top></back-to-top>
      </div>
      <az-loading v-if="loadingFlag"></az-loading>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import BreadCrumb from '@/components/common/Breadcrumb'
import AccountMenu from '@/components/user/AccountMenu'
import OrderListItem from '@/components/order/OrderListItem'
import CancelOrderLayer from '@/components/order/CancelOrderLayer'
import azPager from '@/components/az-ui/Pager/AzPager'
import AzLoading from '@/components/az-ui/AzLoading'
import backToTop from '@/components/common/BackToTop'
import ReturnOrderLayer from '@/components/order/ReturnOrderLayer'
import { mapState } from 'vuex'
import { init, getUserIdentity } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import accountMixins from '@/assets/js/accountMixins'

export default {
  name: 'OrderList',
  components: {
    mainApp,
    BreadCrumb,
    AccountMenu,
    OrderListItem,
    CancelOrderLayer,
    azPager,
    AzLoading,
    backToTop,
    ReturnOrderLayer
  },
  mixins: [accountMixins],
  data() {
    return {
      pageLoading: false,
      loadingFlag: false,
      currentOrder: null,
      currentMenuType: 'my_orders'
    }
  },
  computed: {
    ...mapState('userInfo', ['isGuest', 'isRetailer', 'ambassadorData']),
    ...mapState('order', ['cancelOrderLayerShow', 'addToShowrommLayerShow', 'returnOrderLayerShow']),
    pageTitle() {
      return this.accountMenu[this.currentMenuType].title
    },
    orderFilters() {
      return [
        {
          name: this.nl('page_module_order_filter_all'),
          value: 'all'
        },
        {
          name: this.nl('page_module_order_filter_unpaid'),
          value: 'unpaid'
        },
        {
          name: this.nl('page_module_order_filter_processing'),
          value: 'processing'
        },
        {
          name: this.nl('page_module_order_filter_shipped'),
          value: 'shipped'
        },
        {
          name: this.nl('page_module_order_filter_review'),
          value: 'review'
        },
        {
          name: this.nl('page_module_order_filter_canceled_long'),
          value: 'canceled',
          cls: 'special-filter'
        }
      ]
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'my_orders')
      const query = context.route.query
      let currentMenuTypeProps = 'my_orders'
      if (query.hasOwnProperty('status')) {
        currentMenuTypeProps = query.status
      }
      const url = '/1.0/order/list'
      const res = await context.$axios.$get(url, {
        params: {
          ...query
        }
      })
      if (res.code == 0) {
      } else if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
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
      } else {
        context.redirect(302, '/')
        return
      }
      const list = res.data.list
      let isSetDataLayer = false
      for (let i = 0; i < list.length; i++) {
        if (list[i].showroomAble) {
          isSetDataLayer = true
          break
        }
      }

      await getUserIdentity(context)

      return {
        ...commonAsyncData,
        orders: res.data.list,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        pageInfo: res.data.pageInfo,
        orderStatus: res.data.orderStatus || 'all',
        isSetDataLayer,
        currentMenuTypeProps
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
  mounted() {
    if (this.isSetDataLayer) {
      this.setDataLayer({
        action: 'view',
        category: 'AddOrdertoShowroom',
        label: `AddOrdertoShowroom_Button_View`
      })
    }
  },
  methods: {
    clickFilter(item) {
      this.getOrderList(1, item.value)
    },
    // 分页
    pageChange(val) {
      this.$nextTick(() => {
        this.getOrderList(val)
      })
    },
    updateQuery(query) {
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          ...query
        }
      })
    },
    async getOrderList(pageVal, status) {
      this.loadingFlag = true
      const params = {
        page: pageVal || 1,
        status: status === undefined ? this.orderStatus : status
      }
      try {
        const res = await this.$axios.$get('/1.0/order/list', { params })
        if (res.code == 0) {
          if (res.data) {
            // 非第一页的时候，如果当前页面无商品了，跳转至上一页
            if (this.pageInfo.page && this.pageInfo.page != 1 && res.data.pageInfo.page > res.data.pageInfo.totalPage) {
              const prePage = res.data.pageInfo.totalPage
              this.getOrderList(prePage)
              return
            }
            this.orders = res.data.list
            this.addToShowrommBtnIsHave(this.orders)
            this.pageInfo = res.data.pageInfo
            this.orderStatus = res.data.orderStatus || 'all'
            // this.updateQuery({ page: res.data.pageInfo.page, status: this.orderStatus === 'all' ? undefined : this.orderStatus })
            this.updateQuery({ page: res.data.pageInfo.page, status: this.orderStatus })
          }
        }
        this.loadingFlag = false
      } catch (error) {
        this.loadingFlag = false
      }
    },
    refreshOrderList() {
      this.getOrderList(this.pageInfo.page)
    },
    addToShowrommBtnIsHave(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].showroomAble) {
          this.setDataLayer({
            action: 'view',
            category: 'AddOrdertoShowroom',
            label: `AddOrdertoShowroom_Button_View`
          })
          break
        }
      }
    },
    handleSetOrder(order) {
      this.currentOrder = order
    }
  }
}
</script>

<style lang="less" scoped>
.page-title {
  color: var(--color-121212);
  padding: 13px 0 7px;
  border-bottom: 1px solid #666;
  letter-spacing: 1px;
  font-size: 24px;
  font-weight: 400;
  text-transform: uppercase;
}
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
.account-title {
  border-bottom: solid 1px var(--color-cccccc);
  height: 28px;
  display: flex;
  align-items: center;
  h1 {
    display: inline;
    .font-large();
    letter-spacing: normal;
    line-height: 22px;
    padding-bottom: 5px;
    text-transform: uppercase;
  }
  p {
    display: inline-block;
    color: var(--color-999999);
    margin-left: 10px;
    line-height: 14px;
    max-width: 780px;
    padding-bottom: 5px;
  }
}
.account-content.my_orders {
  border-width: 1px 0;
  line-height: 16px;
  margin-top: 20px;
  .order-list {
    position: relative;
    width: 100%;
  }
  .title_line {
    display: flex;
    align-items: center;
    width: 100%;
    .cell {
      font-size: 14px;
      text-transform: uppercase;
      height: 40px;
      background-color: var(--color-f9f9f9);
      padding-left: 10px;
      font-weight: 700;
      line-height: 40px;
      box-sizing: border-box;
      &:nth-child(1) {
        width: 210px;
      }
      &:nth-child(2) {
        width: 183px;
      }
      &:nth-child(3) {
        width: 190px;
      }
      &:nth-child(4) {
        width: 140px;
      }
      &:nth-child(5) {
        width: 180px;
        padding-left: 10px;
      }
    }
  }
  .order-item {
    &:nth-child(2n-1) {
      background-color: var(--color-f9f9f9);
    }
    &:hover {
      background-color: #eee;
    }
  }
  table {
    width: 100%;
  }
  th,
  td {
    white-space: nowrap;
    &.break {
      white-space: normal;
      width: 300px;
    }
  }
  .first-table > tbody > tr {
    height: 40px;
    & > td {
      padding: 10px 0 10px 10px;
      &:last-child {
        padding-left: 0;
        padding-right: 10px;
        text-align: right;
      }
    }
    &:nth-child(2n) {
      background-color: var(--color-f9f9f9);
    }
  }
  thead th {
    font-size: 14px;
    text-transform: uppercase;
    height: 40px;
    background-color: var(--color-f9f9f9);
    padding-left: 10px;
    &:nth-child(1) {
      width: 150px - 10px;
    }
    &:nth-child(2) {
      width: 270px - 150px;
    }
    &:nth-child(3) {
      width: 412px - 270px;
    }
    &:nth-child(4) {
      width: 248px;
    }
    &:nth-child(5) {
      width: 153px + 100px;
      padding-left: 0;
      padding-right: 10px;
      text-align: right;
    }
  }
  .order-status-entry {
    // margin-bottom: 10px;
    tr:first-child td {
      padding-top: 0;
    }
    td {
      border-top: none;
      padding-top: 10px;
      &.track-order {
        // padding-bottom: 10px;
        a {
          color: @theme-color;
        }
      }
      // &.change-address {
      //   padding-bottom: 10px;
      // }
      // &.a_samples_extension_item {
      //   padding-bottom: 10px;
      // }
    }
  }
  tbody tr:hover td {
    background: var(--color-eeeeee);
  }
  // .action_line {
  //   td {
  //     padding-top: 10px;
  //   }
  // }
  a,
  span {
    color: var(--color-121212);
    text-decoration: underline;
    cursor: pointer;
    &.cur,
    &:hover {
      color: @theme-color;
    }
  }
  .a_alteration_refund {
    display: block;
    padding-top: 12px;
  }
}
/deep/ .az-pager-box {
  padding-top: 40px;
}
.order-filters {
  margin: 30px 0 10px;
  display: flex;
  & > div {
    font-family: @font-family-600;
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 1px;
    border-bottom: 3px solid transparent;
    margin-right: 36px;
    text-transform: uppercase;
    cursor: pointer;
    &.selected {
      color: var(--color-121212);
      border-bottom-color: var(--color-121212);
    }
    &.special-filter {
      margin-top: (23px - 18px) / 2;
      font-family: @font-family-500;
      font-size: 12px;
      line-height: 18px;
      height: 18px;
      text-decoration: underline;
      text-transform: capitalize;
      padding-left: 27px;
      border-bottom: none;
      border-left: 1px solid var(--color-121212);
      margin-left: -8px;
      margin-right: 0;
      &.selected {
        color: var(--color-121212);
      }
    }
  }
}

.empty_order {
  text-align: center;
  img {
    display: block;
    width: 132px;
    margin: 90px auto 0 auto;
  }
  .order-empty-text {
    font-size: 14px;
    color: #666;
    font-family: @font-family-500;
    margin-top: 30px;
  }
}
</style>
