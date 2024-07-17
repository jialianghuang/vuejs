<template>
  <div class="order-detail-box">
    <main-app :navigation="navigation">
      <div class="main-content account-width">
        <order-breadcrumb :listCrumb="listCrumb"></order-breadcrumb>
        <div class="account-flex">
          <account-menu v-if="!isGuest" :accountMenu="accountMenu"></account-menu>
          <div class="account-right">
            <div class="order-detail-title">
              <div class="title">{{ nl('page_common_order_detail') }}</div>
              <a :href="countryUrl(`/order/list`)" class="back">
                <az-icon icon-class="icon-xxy_arrow_left_l" class="back-icon"></az-icon>{{ nl('page_order_back_to_list') }}
              </a>
            </div>
            <div v-if="havCodeImage && country != 'MX'">
              <img :src="addWebpSuffix(bannerImgUrl)" alt="purchase" class="purchase-banner" />
            </div>
            <!--正式用户引导登录 -->
            <div v-if="loginGuide" class="guide-to-login">
              {{ nl('page_common_please') }}
              <a :href="`/user/login?back=/order/detail?order_sn=${orderInfo.orderSn}`" class="guide-to-login-a">{{
                nl('page_order_login')
              }}</a>
              {{ nl('page_order_view_detail') }}
            </div>

            <!-- 拆单情况下部分支付成功部分支付失败提示 -->
            <div v-if="isPaidAndUnpaid" class="notice-tip pay-tip">
              <span v-html="nl('page_order_note')" class="note"></span>
              <span v-html="nl('page_order_failed_pay_note')" class="desc"> </span>
            </div>
            <!-- 拆单提示-->
            <!-- 全部未支付的时候不提示-->
            <div v-else-if="showGroup" class="notice-tip group-tip">
              <span v-html="nl('page_order_note')" class="note"></span>
              <span v-html="nl('page_order_split_note', null, { packageNumber: Object.keys(orderInfoList).length })" class="desc"> </span>
            </div>

            <template>
              <!-- 每个订单的具体信息以及ORDER STATUS -->
              <template v-if="showGroup">
                <!-- 未支付的订单排前面 -->
                <template v-for="orderInfoItem in unpaidOrders">
                  <order-info-item
                    :key="`${orderInfoItem.orderId}`"
                    :orderInfoItem="orderInfoItem"
                    :isGroup="isGroup"
                    :showGroup="showGroup"
                    :orderRecIds="orderRecIds"
                    :orderItemGoodsList="orderGoodsList[orderInfoItem.orderId]"
                    @onCopySuccess="onCopySuccess"
                    @onCopyError="onCopyError"
                    :isAllUnpaid="isAllUnpaid"
                  ></order-info-item>
                </template>
                <!-- 已支付的订单-->
                <template v-for="orderInfoItem in paidOrders">
                  <order-info-item
                    :key="`${orderInfoItem.orderId}`"
                    :orderInfoItem="orderInfoItem"
                    :isGroup="isGroup"
                    :showGroup="showGroup"
                    :orderItemGoodsList="orderGoodsList[orderInfoItem.orderId]"
                    @onCopySuccess="onCopySuccess"
                    @onCopyError="onCopyError"
                    :isAllUnpaid="isAllUnpaid"
                  ></order-info-item>
                </template>
              </template>
              <template v-else>
                <!-- 不拆单以及全部订单全部未支付成功的情况-->
                <!-- 全部订单全部未支付成功，不管拆不拆单：不会展示拆单详情，只展示整个订单的信息 -->
                <!-- 不拆单且支付成功的情况下，订单的信息orderInfoItem取 orderInfoList 里面主订单的信息 orderInfoList[orderInfo.orderId]  -->
                <!-- 全部订单全部未支付成功，订单的信息orderInfoItem取 orderInfo  -->
                <order-info-item
                  :orderInfoItem="isAllUnpaid ? orderInfo : orderInfoList[orderInfo.orderId]"
                  :isGroup="isGroup"
                  :showGroup="showGroup"
                  :orderItemGoodsList="orderGoods"
                  @onCopySuccess="onCopySuccess"
                  @onCopyError="onCopyError"
                  :isAllUnpaid="isAllUnpaid"
                ></order-info-item>
              </template>

              <!-- ITEMS ORDERED -->
              <!--  showOrderGoodsList 展示 拆单情况下成功支付的订单的商品 或者 全部未支付时整个订单的商品-->
              <order-goods-list
                :orderInfo="orderInfo"
                :orderGoods="showOrderGoodsList"
                :isMyOrder="isMyOrder"
                :returnMethodData="returnMethodData"
                :showGroup="showGroup"
                :isPaidAndUnpaid="isPaidAndUnpaid"
                :isAllUnpaid="isAllUnpaid"
                :isGroup="isGroup"
              ></order-goods-list>
              <!-- ORDER INFORMATION -->
              <new-order-information
                @onCopySuccess="onCopySuccess"
                @onCopyError="onCopyError"
                :orderInfo="orderInfo"
                :billingAddress="billingAddress"
              ></new-order-information>
            </template>

            <!-- ACTIONS 未登录状态下，或者游客登录态下不是查询的用户的情况，不允许使用此功能。 支付成功的样衣购买订单的订单详情页 隐藏actions模块-->
            <div
              v-if="
                isMyOrder &&
                  hasAction &&
                  (!(orderInfo.isSamplePurchaseOrder && orderInfo.payStatus == 2) || (orderInfo.isSSOrder && orderInfo.payStatus == 2))
              "
              class="order-b"
            >
              <div class="order_info_title">
                {{ nl('page_common_action') }}
              </div>
              <div class="order-actions">
                <!-- 为当前的订单 添加partId，选择展示 -->
                <a v-if="orderInfo.showroomAble" @click.stop="showAddToShowroomLayer">{{ nl('page_order_add_to_showroom') }}</a>
                <a v-if="orderInfo.cancelable" @click.stop="showCancelOrderLayer">{{ nl('page_order_cancel_order') }}</a>
                <!-- redoOrderAble -->
                <a
                  v-if="redoOrderAble"
                  :href="
                    countryUrl(
                      `/checkout?origin_order_sn=${orderInfo.orderSn}&order_type=swatches&rec_ids=${orderRecIds}&order_country_code=${orderInfo.countryCode}`
                    )
                  "
                  @click.stop="createReDelivered"
                  >{{ nl('page_order_not_delivered') }}</a
                >
                <template v-if="!orderInfo.isSamplePurchaseOrder || orderInfo.isSSOrder">
                  <!-- 退货 #12280 判断 isNewReturnMethod的订单走弹窗逻辑，其余订单走之前的逻辑-->
                  <!-- 还有一种特殊情况,基于新版退货方式：returnable为false && showContactUs为true && isNewReturnMethod为true,不可退货的订单会弹出退货弹窗,比如remake的订单 -->
                  <!-- 备注：下面这样的代码判断逻辑看起来比较绕，是因为这个需求测试过程中产品一直有对逻辑的增删改。为了使影响面较小，避免因为更改判断逻辑需要重新回归所有的测试流程，先保留下面的判断方式，望理解，如果看不懂，可以直接找对应开发 -->
                  <template v-if="orderInfo.returnable || (orderInfo.showContactUs && returnMethodData.isNewReturnMethod)">
                    <!-- 如果仅有样衣，点击出现弹框 -->
                    <template v-if="country === 'US'">
                      <a v-if="orderInfo.allSample" @click="handleReturnOrder">{{ nl('page_order_return_items') }}</a>
                      <a v-else :href="countryUrl('/return_exchange?order_sn=' + orderInfo.orderSn)" class="a_return_items">{{
                        nl('page_order_return_items')
                      }}</a>
                    </template>
                    <template v-else>
                      <a
                        v-if="orderInfo.returnable && !returnMethodData.isNewReturnMethod"
                        :href="`/order/return?order_sn=${orderInfo.orderSn}`"
                        >{{ nl('page_order_return_items') }}</a
                      >
                      <a v-else @click="handleReturnOrder">{{ nl('page_order_return_items') }}</a>
                    </template>
                  </template>
                  <!-- 修补 -->
                  <a
                    v-if="orderInfo.reimbursable"
                    :href="`/order/alteration_reimbursement?order_sn=${orderInfo.orderSn}&order_country_code=${orderInfo.countryCode}`"
                    >{{ nl('page_order_alteration_reimbersement') }}</a
                  >
                  <!-- 样衣延迟归 -->
                  <a v-if="orderInfo.sampleExtendable" @click="showPopupSamplesExtension()">{{
                    nl('page_order_request_return_extension')
                  }}</a>
                  <!-- <a
                    v-if="orderInfo.samplePurchasable"
                    :href="orderInfo.samplePurchaseUrl + '&order_country_code=' + orderInfo.countryCode"
                  >
                    {{ nl('page_order_purchase_samples') }}
                  </a> -->
                </template>
              </div>
            </div>

            <!-- 推荐模块 -->
            <order-recommend
              v-if="recommendProducts && recommendProducts.prodList && Object.keys(recommendProducts.prodList).length"
              :recommendProducts="recommendProducts"
              @quickShop="quickShopClick"
              :fromDialog="'orderRecommend'"
              :sampleRecommendDressAble="orderInfo.sampleRecommendDressAble"
            ></order-recommend>
          </div>
        </div>
      </div>
      <cancel-order-layer
        v-if="cancelOrderLayerShow"
        :orderSn="orderInfo.orderSn"
        :isOxxoPay="orderInfo.paymentId == 256 && orderInfo.payStatus == 2"
      ></cancel-order-layer>
      <order-add-to-showroom
        v-if="addToShowrommLayerShow"
        :orderSn="orderInfo.orderSn"
        @refreshOrder="refreshOrderDetail"
      ></order-add-to-showroom>
      <popup-samples-extension
        :orderSn="orderInfo.sampleOrderSn"
        @setOrderExtendSampleDays="setOrderExtendSampleDays"
        @onClose="orderInfo.sampleExtendable = false"
      ></popup-samples-extension>
      <return-order-layer
        v-if="returnOrderLayerShow"
        :returnOrder="returnMethodData"
        @refreshOrder="refreshOrderDetail"
      ></return-order-layer>
      <!-- resend 操作异常 弹窗 -->
      <resend-unusal-layer v-if="resendUnusalLayerShow"></resend-unusal-layer>
      <!-- giftcard  editemail/resend 弹窗 -->
      <edit-email-resend-layer v-if="editEmailResendLayerShow" @refreshOrder="refreshOrderDetail"></edit-email-resend-layer>
      <az-toast ref="toast" :message="toastMsg" :duration="3000"></az-toast>
      <quick-shop-dialog ref="quickShopDialog" :fromDialog="'orderRecommend'"></quick-shop-dialog>
    </main-app>
  </div>
</template>

<script>
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { init, resetSeoUrl, getUserIdentity } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
import MainApp from '@/components/Main'
import OrderBreadcrumb from '@/components/order/OrderBreadcrumb'
import PopupSamplesExtension from '@/components/order/PopupSamplesExtension'
import NewOrderInformation from '@/components/order/NewOrderInformation'
import OrderGoodsList from '@/components/order/OrderGoodsList'
import CancelOrderLayer from '@/components/order/CancelOrderLayer'
import OrderAddToShowroom from '@/components/order/OrderAddToShowroom'
import ReturnOrderLayer from '@/components/order/ReturnOrderLayer'
import ResendUnusalLayer from '@/components/order/ResendUnusalLayer'
import EditEmailResendLayer from '@/components/order/EditEmailResendLayer'
import OrderInfoItem from '@/components/order/OrderInfoItem'
import OrderRecommend from '@/components/order/OrderRecommend'
import AccountMenu from '@/components/user/AccountMenu'
import accountMixins from '@/assets/js/accountMixins'
import AzToast from '@/components/az-ui/AzToast'
import quickShopDialog from '@/components/quickshop/QuickShopDialog'
import colorHex from '@/assets/js/colorHex'
export default {
  name: 'OrderDetail',
  components: {
    MainApp,
    OrderBreadcrumb,
    PopupSamplesExtension,
    NewOrderInformation,
    OrderGoodsList,
    CancelOrderLayer,
    OrderAddToShowroom,
    ReturnOrderLayer,
    ResendUnusalLayer,
    EditEmailResendLayer,
    AccountMenu,
    OrderInfoItem,
    OrderRecommend,
    AzToast,
    quickShopDialog
  },
  mixins: [accountMixins, colorHex],
  data() {
    return {
      returnMethodData: null,
      toastMsg: '',
      recommendProducts: {} // 样衣订单推荐正式裙子
    }
  },
  computed: {
    ...mapState('order', [
      'cancelOrderLayerShow',
      'addToShowrommLayerShow',
      'returnOrderLayerShow',
      'resendUnusalLayerShow',
      'editEmailResendLayerShow'
    ]),
    hasAction() {
      return (
        this.orderInfo.cancelable ||
        this.orderInfo.returnable ||
        this.orderInfo.showContactUs ||
        this.orderInfo.reimbursable ||
        this.orderInfo.sampleExtendable ||
        this.redoOrderAble
      )
    },
    havCodeImage() {
      const { showSamplePurchaseBanner, hasSample } = this.orderInfo
      return hasSample && showSamplePurchaseBanner
    },
    // 已取消订单
    cancelOrders() {
      const arr = []
      for (const i in this.orderInfoList) {
        const item = this.orderInfoList[i]
        if (item.orderStatus == 2) {
          arr.push(item)
        }
      }
      return arr.sort(this.sortOrder())
    },
    // 支付成功订单
    paidOrders() {
      const arr = []
      for (const i in this.orderInfoList) {
        const item = this.orderInfoList[i]
        if (item.payStatus == 2) {
          arr.push(item)
        }
      }
      return arr.sort(this.sortOrder())
    },
    // 未支付成功订单
    unpaidOrders() {
      const arr = []
      for (const i in this.orderInfoList) {
        const item = this.orderInfoList[i]
        if (item.payStatus != 2) {
          arr.push(item)
        }
      }
      return arr.sort(this.sortOrder())
    },
    // 拆单情况下部分支付成功部分支付失败
    isPaidAndUnpaid() {
      return !!(Object.keys(this.paidOrders).length && Object.keys(this.unpaidOrders).length)
    },
    listCrumb() {
      const tempListCrumb = []
      if (this.loginGuide) {
        tempListCrumb[0] = { href: '/user/login?has_track=1', name: this.nl('page_common_track_your_order') }
      } else {
        tempListCrumb[0] = { href: '/order/list', name: this.nl('page_common_my_orders') }
      }
      tempListCrumb[1] = { name: this.nl('page_common_order_detail') }
      return tempListCrumb
    },
    orderRecIds() {
      return this.orderGoods.map((item) => item.recId).join(',')
    },
    showGroup() {
      // 是否按拆单展示
      if (this.unpaidOrders && Object.keys(this.unpaidOrders).length == Object.keys(this.orderInfoList).length) {
        // 不管是否拆单，如果订单全部未支付，则不按拆单展示
        return false
      }
      return this.isGroup
    },
    // 底部商品展示
    showOrderGoodsList() {
      // 如果拆单情况下，部分成功部分失败，只展示成功的商品。其他情况展示所有商品
      if (this.isPaidAndUnpaid) {
        let showOrderGoodsList = []
        this.paidOrders.forEach((item) => {
          showOrderGoodsList = showOrderGoodsList.concat(this.orderGoodsList[item.orderId])
        })
        return showOrderGoodsList
      }
      return this.validateGoodsList || []
    },
    isAllUnpaid() {
      // 是否所有的订单都未支付
      return this.unpaidOrders && Object.keys(this.unpaidOrders).length == Object.keys(this.orderInfoList).length
    },
    bannerImgUrl({ country }) {
      if (this.orderInfo.hasKendallKylieSample) {
        return this.nl('page_image_order_detail_kk_sample_coupon_' + country.toLowerCase())
      }
      return this.nl('page_image_orider_detail_banner_' + country.toLowerCase())
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      const userInfoRes = await context.$axios.$get(`/1.0/common/user-info`)
      let hasLogin = false
      let isGuestCheckoutAuthorization = false
      if (userInfoRes.code == 0) {
        hasLogin = userInfoRes.data.userId != null && userInfoRes.data.userId != undefined && userInfoRes.data.userId != 0
        isGuestCheckoutAuthorization = userInfoRes.data.guestCheckoutAuthorization || false
      }
      let apiUrl = '/1.0/order/detail'
      if (!hasLogin && query.email && query.order_sn) {
        apiUrl = '/1.0/order/detail/guest'
        query.email = decodeURIComponent(query.email)
      }

      const res = await context.$axios.$get(apiUrl, { params: query })
      if (res.code == 0) {
      } else if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, resetSeoUrl(context, `/user/login?back=${context.route.fullPath}`))
        return
      } else {
        context.redirect(302, resetSeoUrl(context, '/order/list'))
        return
      }

      await getUserIdentity(context)

      context.store.commit('checkout/setFillGoodsBundleList', res.data.fillGoodsBundleList) // buy more save more bundle list
      context.store.commit('setJsKey', 'OrderDetail')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        orderInfoList: res.data.orderInfoList,
        orderGoodsList: res.data.orderGoodsList,
        orderInfo: res.data.orderInfo,
        orderGoods: res.data.orderGoods,
        validateGoodsList: res.data.validateGoodsList, // 拆出bundle商品，剩余商品列表
        isGroup: res.data.isGroup, // 是否拆单
        loginGuide: res.data.loginGuide,
        isMyOrder: res.data.isMyOrder,
        redoOrderAble: res.data.redoOrderAble, // 是否是swatches重发
        query,
        showroomAble: res.data.orderInfo.showroomAble,
        isGuestCheckoutAuthorization,
        returnMethodData: {
          orderSn: res.data.orderSn,
          returnMethod: res.data.returnMethod,
          isNewReturnMethod: res.data.isNewReturnMethod,
          onlyRefundable: res.data.onlyRefundable,
          showContactUs: res.data.orderInfo.showContactUs,
          returnable: res.data.orderInfo.returnable
        },
        billingAddress: res.data.billingAddress
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
      this.getColorHexAjax()
      this.orderInfo.sampleRecommendDressAble && this.getOrderRecommend() // 是样衣订单推荐正式裙子
    }
  },
  mounted() {
    // console.log('orderGoodsList:', this.orderGoodsList)
    if (this.showroomAble) {
      this.setDataLayer({
        action: 'view',
        category: 'AddOrdertoShowroom',
        label: `AddOrdertoShowroom_Button_View`
      })
    }
  },
  methods: {
    async getOrderDetail() {
      try {
        const query = this.query
        const userInfoRes = await this.$axios.$get(`/1.0/common/user-info`)
        let hasLogin = false
        if (userInfoRes.code == 0) {
          hasLogin = userInfoRes.data.userId != null && userInfoRes.data.userId != undefined && userInfoRes.data.userId != 0
        }
        let apiUrl = '/1.0/order/detail'
        if (!hasLogin && query.email && query.order_sn) {
          apiUrl = '/1.0/order/detail/guest'
          query.email = decodeURIComponent(query.email)
        }
        const res = await this.$axios.$get(apiUrl, { params: query })
        if (res.code == 0) {
          this.orderInfo = res.data.orderInfo
          this.returnMethodData = {
            orderSn: res.data.orderSn,
            returnMethod: res.data.returnMethod,
            isNewReturnMethod: res.data.isNewReturnMethod,
            onlyRefundable: res.data.onlyRefundable,
            showContactUs: res.data.orderInfo.showContactUs,
            returnable: res.data.orderInfo.returnable
          }

          this.orderInfoList = res.data.orderInfoList
          this.orderGoodsList = res.data.orderGoodsList
          this.orderGoods = res.data.orderGoods
        }
      } catch (error) {
        console.log(error)
      }
    },
    showPopupSamplesExtension() {
      this.$store.commit('order/setExtendSampleDays', this.orderInfo.extendSampleDays)
      if (this.orderInfo.extendSampleDays * 1 > 0) {
        this.$store.commit('order/setPopupSamplesExtensionShow', true)
        return
      }
      // 虚拟延长3day
      this.$axios.$post(`/1.0/order/extend-sample-days`, { order_sn: this.orderInfo.orderSn, extend_day: 3 }).then((res) => {
        if (res.code == 0) {
          this.$store.commit('order/setExtendSampleDays', 3)
          this.setOrderExtendSampleDays({ sampleOrderSn: this.orderInfo.orderSn, extendSampleDays: 3 })
          this.$store.commit('order/setPopupSamplesExtensionShow', true)
        } else {
          alert(res.msg)
        }
      })
    },
    setOrderExtendSampleDays(data) {
      this.orderInfo.extendSampleDays = data.extendSampleDays
    },
    showCancelOrderLayer() {
      this.$store.commit('order/setCancelOrderLayerShow', true)
    },
    createReDelivered() {
      // 可以设置打点
    },
    showAddToShowroomLayer() {
      this.$store.commit('order/setAddToShowrommLayerShow', true)
      this.setDataLayer({
        action: 'click',
        category: 'AddOrdertoShowroom',
        label: `AddOrdertoShowroom_Button_Click`
      })
    },
    orderIntoView(ele) {
      document.querySelector('#' + ele).scrollIntoView({ block: 'end', behavior: 'smooth' })
    },
    refreshOrderDetail() {
      this.getOrderDetail()
    },
    handleReturnOrder() {
      this.$store.commit('order/setReturnOrderLayerShow', true)
    },
    onCopySuccess() {
      this.toastMsg = this.nl('page_common_copied')
      this.$refs.toast.show()
    },
    onCopyError() {
      this.toastMsg = this.nl('page_common_share_copy_failed')
      this.$refs.toast.show()
    },
    sortOrder() {
      // 订单按 packageNumber 排序
      return function(obj1, obj2) {
        const value1 = obj1.packageNumber
        const value2 = obj2.packageNumber
        return value1 - value2 // 升序
      }
    },
    // 获取样衣订单推荐正式裙子
    getOrderRecommend() {
      this.recommendProducts = {}
      const params = { order_sn: this.orderInfo.orderSn }
      this.$axios.$get('/1.0/recommend/sample-to-dress', { params }).then((res) => {
        if (res.code == 0) {
          this.recommendProducts = Object.keys(res.data).length ? res.data : {}
        }
      })
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog && this.$refs.quickShopDialog.quickShopClick(params)
    }
  }
}
</script>

<style lang="less" scoped>
.main-content {
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
  .guide-to-login {
    width: 100%;
    height: 31px;
    background: var(--color-ede1d3);
    text-align: center;
    line-height: 31px;
    color: var(--color-121212);
    margin-top: 24px;
    .guide-to-login-a {
      color: @theme-color;
      text-decoration: underline;
    }
  }
  .order-detail-title {
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
  .notice-tip {
    font-size: 12px;
    background: var(--color-f1e9e6);
    padding: 10px 15px;
    color: var(--color-121212);
    margin-top: 20px;
    .note {
      color: @theme-color;
      font-family: @font-family-600;
    }
  }

  /deep/ .order-b {
    margin-top: 20px;
    border: 1px solid var(--color-eeeeee);
    .order_info_title {
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
.purchase-banner {
  width: 100%;
  // height: 40px;
  margin-top: 20px;
}
</style>
