<template>
  <div class="return-items-box">
    <main-app :navigation="navigation">
      <div class="main-content account-width">
        <order-breadcrumb :listCrumb="listCrumb"></order-breadcrumb>
        <div :class="{ 'is-success-main': returnItemsSubmitSuccess || autoReturnShow }" class="main-box account-flex">
          <account-menu v-if="!isGuest" :accountMenu="accountMenu"></account-menu>
          <div class="account-right">
            <template v-if="autoReturnShow == 'success'">
              <div class="auto-return-dec">
                <p>
                  {{ nl('page_return_auto_return_success') }}
                </p>
              </div>
            </template>
            <template v-else-if="autoReturnShow == 'fail'">
              <div class="auto-return-dec">
                <p>
                  {{ nl('page_return_auto_return_fail_1') }}
                  <a id="custom_service" @click="showCustomService" href="javascript:void(0);">{{
                    nl('page_return_auto_return_fail_2')
                  }}</a>
                  {{ nl('page_return_auto_return_fail_3') }}
                </p>
              </div>
            </template>
            <template v-else-if="!returnItemsSubmitSuccess">
              <div v-if="!showReturnDetails" class="return-items-list-box">
                <h1 class="return-items-title">{{ nl('page_order_return_items') }}</h1>
                <div class="return-list-box">
                  <hollow-out-title :title="nl('page_return_choose_to_return')" class="list-title"></hollow-out-title>
                  <div class="return-goods-list">
                    <template>
                      <div v-for="(item, index) in goodsList" :key="index" class="item">
                        <return-goods-items
                          :goodsItem="item"
                          :reasons="reasons"
                          :isLastItem="index == goodsList.length - 1"
                        ></return-goods-items>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <!-- 退货渠道选择-->
              <template v-else-if="showReturnChannelModel && supportReturnChannel">
                <div class="return-channel-list-box">
                  <h1 class="return-channel-title">{{ nl('page_order_return_items') }}</h1>
                  <div class="return-list-box">
                    <hollow-out-title :title="nl('page_order_return_channel_title')" class="channel-list-title"></hollow-out-title>
                    <div class="return-channel-list">
                      <template v-for="(item, index) in returnChanelList">
                        <div
                          :class="{ selected: returnChannel == item.key }"
                          :key="item.key"
                          @click="handleSelectReturnMethod(item.key)"
                          class="return-channel-item"
                        >
                          <span :class="{ selected: returnChannel == item.key }" class="radio-icon"></span>
                          <div class="item-content">
                            <template v-if="item.key === 'gift_card'">
                              <!-- 退到 gift card 我的账户 -->
                              <img :src="addWebpSuffix(nl('page_image_return_channel_gift_card'))" class="tip-img" alt="gift card" />
                              <div class="txt">{{ nl('page_order_return_channel_az_account_txt') }}</div>
                              <div class="time">{{ nl('page_order_return_channel_az_account_time') }}</div>
                            </template>
                            <template v-else-if="item.key === 'original'">
                              <!-- 原路退回 -->
                              <div class="txt">{{ nl('page_order_return_channel_original_txt') }}</div>
                            </template>
                          </div>
                        </div>
                        <div v-if="index < returnChanelList.length - 1" :key="`${item.key}_line`" class="line-style"></div>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="return-items-list-box">
                <h1 class="return-items-title">{{ nl('page_order_return_items') }}</h1>
                <div class="return-list-box">
                  <hollow-out-title :title="nl('page_return_tips_text')"></hollow-out-title>
                  <div class="return-goods-list step-three">
                    <template>
                      <div v-for="(item, index) in returnGoodsList" :key="index" class="item">
                        <return-goods-items
                          :goodsItem="item"
                          :isLastItem="index == returnGoodsList.length - 1"
                          :showReturnDetails="showReturnDetails"
                          :returnChannel="returnChannel"
                        ></return-goods-items>
                      </div>
                    </template>
                  </div>
                  <p class="refund-to">
                    {{ nl('page_order_return_refund_to') }}:
                    {{
                      returnChannel === 'gift_card'
                        ? nl('page_order_return_refund_to_gift_card')
                        : nl('page_order_return_refund_to_original')
                    }}
                  </p>
                  <div class="order-summary-block">
                    <return-status-summary :returnSummaryInfo="returnSummaryInfo"></return-status-summary>
                  </div>
                </div>
              </div>
              <div class="return-continue">
                <a id="continue" :class="{ disabled: !continueAble }" @click="returnContinue()" class="continue-btn">
                  {{
                    showReturnDetails && !(showReturnChannelModel && supportReturnChannel)
                      ? nl('page_common_just_submit')
                      : nl('page_common_continue')
                  }}
                </a>
              </div>
            </template>
            <template v-else>
              <div class="success-dec">
                <p>
                  {{ nl('page_return_have_received') }}
                </p>
              </div>
            </template>
            <back-to-top></back-to-top>
          </div>
        </div>

        <popup-parcel-point
          @close="showPopupParcePoint = false"
          @handleConfirmParcePoint="handleConfirmParcePoint"
          :orderInfo="orderInfo"
          v-if="showPopupParcePoint"
        ></popup-parcel-point>

        <az-popup-layer
          id="popup_confirm_return"
          v-if="showPopupConfirmReturn"
          :lockScroll="true"
          :z-index="12"
          @close="showPopupConfirmReturn = false"
          width="930px"
          height="290px"
        >
          <p class="choose-title">
            {{ nl('page_popup_parce_point_text1') }} : <strong>{{ extensions.addressLine1 }} {{ extensions.addressLine2 }}</strong>
          </p>
          <p class="theme-warning">{{ nl('page_return_text1') }}:</p>
          <div v-for="(item, index) in returnGoodsList" :key="index" class="item">
            <return-goods-items
              :goodsItem="item"
              :isLastItem="index == returnGoodsList.length - 1"
              :showReturnDetails="showReturnDetails"
            ></return-goods-items>
          </div>
          <az-button @click="handleSubmit" :disbaled="!submitLoading || !extensions.addressLine1" class="btn btn-default btn-confirm">
            {{ nl('page_common_submit1') }}
          </az-button>
        </az-popup-layer>
      </div>
      <az-toast ref="toast" :message="toastMsg" :duration="3000"></az-toast>
    </main-app>
    <popup-oxxo-refund v-if="popupOxxoRefundShow" @handleSubmit="returnContinue" @handleClose="handleClose"></popup-oxxo-refund>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import OrderBreadcrumb from '@/components/order/OrderBreadcrumb'
import { mapState } from 'vuex'
import { init, getUserIdentity } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import HollowOutTitle from '@/components/checkout/HollowOutTitle'
import ReturnGoodsItems from '@/components/order/ReturnGoodsItems'
import PopupParcelPoint from '@/components/order/PopupParcelPoint'
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
import PopupOxxoRefund from '@/components/order/PopupOxxoRefund'
import AccountMenu from '@/components/user/AccountMenu'
import accountMixins from '@/assets/js/accountMixins'
import AzToast from '@/components/az-ui/AzToast'
import ReturnStatusSummary from '@/components/order/ReturnStatusSummary'

export default {
  name: 'Return',
  components: {
    mainApp,
    backToTop,
    OrderBreadcrumb,
    HollowOutTitle,
    ReturnGoodsItems,
    PopupParcelPoint,
    AzPopupLayer,
    AzButton,
    PopupOxxoRefund,
    AccountMenu,
    AzToast,
    ReturnStatusSummary
  },
  mixins: [accountMixins],
  data() {
    return {
      listCrumb: [
        { href: '/order/list', name: this.nl('page_common_my_orders') },
        { href: `/order/detail?order_sn=${this.orderSn}`, name: this.nl('page_common_order_detail') },
        { name: this.nl('page_order_return_items') }
      ],
      continueAble: false,
      showReturnDetails: false,
      returnGoodsList: [],
      submitItems: [],
      returnItemsSubmitSuccess: false,
      autoReturnShow: '',
      submitLoading: true,
      showPopupConfirmReturn: false,
      showPopupParcePoint: false,
      extensions: {},
      popupOxxoRefundShow: false,
      showReturnChannelModel: false,
      returnChannel: '',
      toastMsg: '',
      returnSummaryInfo: {}
    }
  },
  computed: {
    ...mapState('order', ['returnReasonData']),
    recIdArr() {
      return this.goodsList.map(function(item) {
        return item.recId
      })
    },
    supportReturnChannel() {
      // 是否支持选择退款渠道
      return this.returnChanelList && this.returnChanelList.length > 0
    }
  },
  watch: {
    returnReasonData: {
      handler() {
        let flag = false
        for (const key in this.returnReasonData) {
          if (this.returnReasonData[key].selected) {
            flag = true
            break
          }
        }
        this.continueAble = flag
      },
      immediate: true
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/order/return`, { params: context.route.query })
      if (res.code == 0) {
        const goodsList = res.data.goodsList || []
        const returnReasonData = {}
        if (goodsList.length > 0) {
          goodsList.forEach((item) => {
            returnReasonData[item.recId] = {
              rec_id: item.recId,
              needReturnReason: item.dressType != 'sample' // #12280 如果是样衣，就不选原因
            }
          })
        }
        context.store.commit('order/setReturnReasonData', returnReasonData)
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100501) {
        // 未登录
        context.redirect(302, `/user/login?back=${context.route.fullPath}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else if (res.code == 65001) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else {
        context.redirect(302, `/order/detail?order_sn=${context.query.order_sn}`)
        return
      }

      await getUserIdentity(context)

      context.store.commit('setJsKey', 'return_items')
      return {
        ...commonAsyncData,
        orderInfo: res.data.orderInfo,
        goodsList: res.data.goodsList || [],
        reasons: res.data.reasons || {},
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        returnChanelList: res.data.returnChanelList || []
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
    // 获取默认的退款渠道
    this.returnChanelList.forEach((item) => {
      if (item.selected) {
        this.returnChannel = item.key
      }
    })
  },
  methods: {
    // 获取退款订单简要信息
    async previewReturnAmount() {
      const goodsList = []
      this.returnGoodsList.forEach((ele) => {
        goodsList.push({
          order_goods_id: ele.recId,
          goods_number: this.returnReasonData[ele.recId].quantity,
          order_sn: ele.orderSn
        })
      })
      const payload = {
        refund_method: 'mail_in',
        goods_list: goodsList
      }
      const res = await this.$axios.$post('/1.0/order/preview-return-amount', payload)
      if (res.data) {
        this.returnSummaryInfo = res.data.preview
      }
    },
    returnContinue(bankInfo) {
      if (!this.continueAble || !this.submitLoading) return
      this.checkoutContinue(bankInfo)
    },
    async checkoutContinue(bankInfo) {
      if (!this.showReturnDetails) {
        // 前端提交，到submit页面，review具体信息
        const returnReasonDataTemp = JSON.parse(JSON.stringify(this.returnReasonData))
        let flag = true
        this.returnGoodsList = []
        this.submitItems = []
        for (const key in returnReasonDataTemp) {
          const item = returnReasonDataTemp[key]
          if (item.selected) {
            if (!item.reason && item.needReturnReason) {
              item.inputError = true
              flag = false
              alert(this.nl('page_js_select_reason'))
              this.$store.commit('order/setReturnReasonData', returnReasonDataTemp)
              return false
            }
            if (item.showDescribe) {
              if (!item.note) {
                alert(this.nl('page_js_comment_required'))
                item.textError = true
                flag = false
                this.$store.commit('order/setReturnReasonData', returnReasonDataTemp)
                return false
              } else if (item.note.split(/ +/).length < 5) {
                item.textError = true
                flag = false
                alert(this.nl('page_js_comment_min_5'))
                this.$store.commit('order/setReturnReasonData', returnReasonDataTemp)
                return false
              }
            }
            this.setReturnGoodsList(key)
          }
        }
        this.$store.commit('order/setReturnReasonData', returnReasonDataTemp)
        await this.previewReturnAmount()
        this.showReturnDetails = flag
        if (this.supportReturnChannel) {
          let sampleCount = 0
          this.returnGoodsList.forEach((ele) => {
            if (ele.dressType === 'sample') sampleCount++
          })
          // 如果选中的全是样衣，跳过选择refund渠道
          if (sampleCount === this.returnGoodsList.length) {
            flag = false
          }
          // 填写完退货原因后要让选择 退款渠道
          this.showReturnChannelModel = flag
        }
      } else if (this.showReturnDetails && this.showReturnChannelModel && this.supportReturnChannel) {
        // 选择完退款渠道之后，继续下一步操作
        this.showReturnChannelModel = false
        // // 选择完退款渠道之后，继续下一步操作
        // this.showReturnChannelModel = false
        // } else if (this.orderInfo.countryCode == 'AU') {  #20581： AU站下线pp退货渠道
        //   this.showPopupParcePoint = true
      } else {
        this.handleSubmit(bankInfo)
      }
    },
    handleConfirmParcePoint(extensions) {
      this.extensions = extensions
      this.showPopupParcePoint = false
      this.showPopupConfirmReturn = true
    },
    handleSubmit(bankInfo) {
      //  oxxo的退货，需要加弹框，点击弹框的保存，才会调退货接口，否则是未退货
      if (this.orderInfo.paymentId == 256 && !bankInfo) {
        this.popupOxxoRefundShow = true
        return
      }
      //  submit页面，请求后端接口提交
      this.submitLoading = false
      this.continueAble = false

      const params = {
        order_sn: this.$route.query.order_sn,
        items: this.submitItems,
        extensions: this.extensions
      }
      if (this.supportReturnChannel) {
        params.return_channel = this.returnChannel || 'original'
      } else {
        // 不支持选择退款渠道的默认传 original
        params.return_channel = 'original'
      }
      if (bankInfo) {
        params.extensions = { ...params.extensions, ...bankInfo }
      }

      this.$axios
        .$post('/1.0/order/return', params)
        .then((res) => {
          if (res.code == 0) {
            // 如果生成的退货单只有一个，就跳对应的退货状态页面，如果有多个，就维持现状
            if (
              res.data.returnApplyId &&
              Object.keys(res.data.returnApplyId) &&
              Object.keys(res.data.returnApplyId).length === 1 &&
              Object.keys(res.data.returnApplyId)[0] &&
              Object.values(res.data.returnApplyId)[0]
            ) {
              this.toastMsg = this.nl('page_common_submitted')
              this.$refs.toast && this.$refs.toast.show()
              // orderSn -> returnApplyId
              const oSn = Object.keys(res.data.returnApplyId)[0]
              const rId = Object.values(res.data.returnApplyId)[0]
              const url = `/order/return_status?return_apply_id=${rId}&order_sn=${oSn}`
              window.location.href = this.countryUrl(url)
            } else {
              // eslint-disable-next-line
              if (res.data.refundType == 'only_refund') {
                // 低于10美金项链自动退款成功
                this.autoReturnShow = 'success'
              } else {
                this.returnItemsSubmitSuccess = true
              }
            }
          } else if (res.code == 300501) {
            // 低于10美金项链自动退款失败(已经自动退款2次后续需要联系客服)
            this.autoReturnShow = 'fail'
          } else {
            console.log(res.msg)
          }
        })
        .finally(() => {
          // 挪到finally里面
          this.continueAble = true
          this.submitLoading = true
          this.showPopupConfirmReturn = false
          this.popupOxxoRefundShow = false
        })
    },
    setReturnGoodsList(key) {
      this.goodsList.forEach((goodsItem) => {
        if (goodsItem.recId == key) {
          goodsItem.returnReasonObj = this.returnReasonData[key]
          this.returnGoodsList.push(goodsItem)
          let reason = this.returnReasonData[key].reason
          if (goodsItem.dressType === 'sample') {
            reason = 'sample'
          }
          this.submitItems.push({
            rec_id: this.returnReasonData[key].rec_id,
            quantity: this.returnReasonData[key].quantity,
            reason,
            note: this.returnReasonData[key].note
          })
        }
      })
    },
    showCustomService() {
      if (document.querySelector('.solvvy-v5-widget')) document.querySelector('.solvvy-v5-widget').click()
      else window.$zopim.livechat.window.show()
    },
    handleClose() {
      this.popupOxxoRefundShow = false
    },
    handleSelectReturnMethod(type) {
      this.returnChannel = type
    }
  }
}
</script>

<style lang="less" scoped>
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
.main-box {
  min-height: 535px;
  color: var(--color-121212);
  &.is-success-main {
    min-height: 270px;
  }
  .return-items-list-box {
    margin-bottom: 28px;
    .return-items-title {
      font-size: 16px;
      line-height: 28px;
      font-family: @font-family-600;
      display: flex;
      justify-content: space-between;
      text-transform: uppercase;
      border-bottom: 1px solid #ccc;
    }
    .list-title {
      /deep/.title {
        font-size: 14px;
        font-family: @font-family-600;
        padding: 20px 0 5px 0;
        border-color: #ccc;
      }
    }
  }
  .return-channel-list-box {
    margin-bottom: 28px;
    .return-channel-title {
      font-size: 16px;
      line-height: 28px;
      font-family: @font-family-600;
      display: flex;
      justify-content: space-between;
      text-transform: uppercase;
      border-bottom: 1px solid #ccc;
    }
    .channel-list-title {
      /deep/.title {
        font-size: 14px;
        font-family: @font-family-600;
        padding: 20px 0 5px 0;
        border-color: #ccc;
        text-transform: none;
        border-bottom: none;
      }
    }
    .return-channel-list {
      padding: 0px 15px 15px;
      .return-channel-item {
        padding: 20px 0;
        display: flex;
        align-items: center;
        color: var(--color-121212);
        cursor: pointer;
        width: max-content;
        .item-content {
          cursor: pointer;
        }
        .radio-icon {
          display: block;
          width: 15px;
          height: 15px;
          padding: 2px;
          border-radius: 50%;
          margin-left: 15px;
          margin-right: 30px;
          border: 1px solid #ccc;
          background-clip: content-box;
          box-sizing: border-box;
          cursor: pointer;
          &.selected {
            border: 1px solid var(--color-999999);
            background-color: var(--color-121212);
            opacity: 1;
          }
        }
        .tip-img {
          height: 19px;
          width: auto;
          vertical-align: middle;
          margin-bottom: 10px;
        }
        .txt {
          font-size: 13px;
          line-height: 18px;
          font-family: @font-family-600;
        }
        .time {
          font-size: 13px;
          line-height: 18px;
          margin-top: 10px;
        }
      }
      .line-style {
        width: calc(100% - 60px);
        margin-left: 60px;
        height: 1px;
        background: #eee;
      }
    }
  }
  .refund-to {
    color: var(--color-121212);
    margin-left: 15px;
    margin-top: 15px;
    font-size: 13px;
  }
  .order-summary-block {
    width: 270px;
    background: var(--color-f9f9f9);
    margin-left: 15px;
    padding: 15px;
    // margin-right: 15px;
    margin-bottom: 15px;
    margin-top: 10px;
  }
  .return-list-box {
    border: 1px solid #eee;
    margin-top: 20px;
    .hollow-out-title {
      background-color: var(--color-f9f9f9);
      /deep/ .title {
        padding: 10px 15px;
        line-height: 19px;
        border-top: none;
        border-color: #eee;
      }
    }
    /deep/ .return-goods-items {
      padding: 15px;
      border: none;
      &::after {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 15px;
        right: 15px;
        height: 1px;
        background-color: #eee;
      }
      .module-checkbox {
        padding-left: 0px;
      }
      .module-price {
        margin-right: 0px;
      }
      &.isLastItem {
        &::after {
          background: none;
        }
      }
      .return-reason-form {
        width: 120%;
      }
    }
    .step-three {
      /deep/ .return-goods-items {
        &.isLastItem {
          &::after {
            background-color: #eee;
          }
        }
      }
    }
  }
  .return-continue {
    text-align: right;
    height: 50px;
    .continue-btn {
      display: inline-block;
      background: var(--color-121212);
      color: #fff;
      text-transform: uppercase;
      font-size: 14px;
      line-height: 40px;
      height: 40px;
      width: 176px;
      box-sizing: border-box;
      text-align: center;
      padding: 0;
      border-radius: 0;
      &:hover {
        background: var(--color-1e1e1e);
      }
      &.disabled {
        background: #ccc;
      }
    }
  }
  .success-dec,
  .auto-return-dec {
    font-weight: bold;
    text-align: center;
    font-size: 24px;
    margin-top: 33px;
  }
  .auto-return-dec {
    font-weight: normal;
  }
}
#custom_service {
  text-decoration: underline;
  color: @theme;
}
#popup_confirm_return {
  .theme-warning {
    margin-top: 20px;
  }
  .btn-confirm {
    position: absolute;
    bottom: 40px;
    right: 40px;
    width: 255px;
  }
}
</style>
