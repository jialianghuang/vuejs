<template>
  <div class="alteration-reimbursement">
    <main-app :navigation="navigation">
      <div class="main-content">
        <div :class="{ 'is-success-main': refundItemsSubmitSuccess }" class="main">
          <order-breadcrumb :listCrumb="listCrumb"></order-breadcrumb>
          <template v-if="!refundItemsSubmitSuccess">
            <div v-if="isEdite" class="return-items-list-box">
              <h1 class="return-items-title">{{ nl('page_alteration_refund') }}</h1>
              <hollow-out-title :title="nl('page_alteration_choose_item')" class="list-title"></hollow-out-title>
              <div class="return-goods-list">
                <template>
                  <div v-for="(item, index) in refundList" :key="index" class="item">
                    <alteration-reimbursement-item
                      :goodsItem="item"
                      :isLastItem="index == refundList.length - 1"
                      :currentIndex="index"
                    ></alteration-reimbursement-item>
                  </div>
                </template>
              </div>
              <div class="return-continue">
                <az-button :needIcon="false" @click="checkoutContinue()" :disabled="!continueAble" class="btn btn-default continue-btn">
                  {{ nl('page_common_continue') }}
                </az-button>
              </div>
            </div>

            <div v-else class="return-items-list-box">
              <h1 class="return-items-title">{{ nl('page_alteration_refund') }}</h1>
              <hollow-out-title :title="nl('page_refund_item_selected_for_reimbursement')" class="list-title"></hollow-out-title>
              <div class="return-goods-list">
                <template>
                  <div v-for="(item, index) in refundList" :key="index" class="item">
                    <alteration-reimbursement-item
                      v-if="item.selected"
                      :goodsItem="item"
                      :isLastItem="index == refundList.length - 1"
                      :currentIndex="index"
                      :isEdite="false"
                    ></alteration-reimbursement-item>
                  </div>
                </template>
              </div>
              <form-alteration-reimbursement
                @saveRefund="saveRefund"
                :limitAmount="realLimitAmount"
                :refundLoadingFlag="refundLoadingFlag"
              ></form-alteration-reimbursement>
              <refund-feeLayer :limitRule="limitRule"></refund-feeLayer>
            </div>
          </template>
          <template v-else>
            <div class="success-dec">
              <div class="icon icon-ok"></div>
              <p v-html="nl('page_alteration_refund_success')"></p>
            </div>
          </template>
          <back-to-top></back-to-top>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import OrderBreadcrumb from '@/components/order/OrderBreadcrumb'
import { mapState } from 'vuex'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import HollowOutTitle from '@/components/checkout/HollowOutTitle'
import AlterationReimbursementItem from '@/components/order/AlterationReimbursementItem'
import AzButton from '@/components/az-ui/Button/AzButton'
import FormAlterationReimbursement from '@/components/order/FormAlterationReimbursement'
import RefundFeeLayer from '@/components/order/RefundFeeLayer'
export default {
  name: 'AlterationReimbursement',
  components: {
    mainApp,
    backToTop,
    OrderBreadcrumb,
    HollowOutTitle,
    AlterationReimbursementItem,
    FormAlterationReimbursement,
    AzButton,
    RefundFeeLayer
  },
  data() {
    return {
      refundLoadingFlag: false,
      listCrumb: [{ href: '/order/list', name: this.nl('page_common_my_orders') }, { name: this.nl('page_alteration_refund') }],
      continueAble: false,
      submitItems: [],
      isEdite: true,
      refundItemsSubmitSuccess: false // 是否提交成功
    }
  },
  computed: {
    ...mapState('order', ['refundList']),
    realLimitAmount() {
      let amountTemp = 0
      for (let index = 0; index < this.refundList.length; index++) {
        const element = this.refundList[index]
        if (element.selected) amountTemp += element.goodsRefundLimit
      }
      return amountTemp
    }
  },
  watch: {
    refundList: {
      handler() {
        let flag = false
        for (const key in this.refundList) {
          if (this.refundList[key].selected) {
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

      const res = await context.$axios.$get(`/1.0/order/refund`, { params: context.route.query })

      if (res.code == 0) {
        const goodsList = res.data.goodsList || []
        goodsList.forEach((element) => {
          element.selected = false
          element.maxSelectQuantity = element.goodsRefundNumber
        })
        context.store.commit('order/setRefundList', goodsList)
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
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
        context.redirect(302, `/user/login?back=${context.route.fullPath}`)
        return
      } else {
        context.redirect(302, `/order/detail?order_sn=${context.query.order_sn}`)
        return
      }

      context.store.commit('setJsKey', 'alteration_reimbursement')
      return {
        ...commonAsyncData,
        reasons: res.data.reasons || {},
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        limitAmount: res.data.limitAmount,
        limitRule: res.data.limitRule || []
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
  methods: {
    checkoutContinue() {
      this.isEdite = false
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      })
    },
    saveRefund(formData) {
      const items = []
      for (let i = 0; i < this.refundList.length; i++) {
        const item = this.refundList[i]
        if (item.selected) {
          items.push({
            rec_id: item.recId,
            quantity: item.goodsRefundNumber
          })
        }
      }
      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          formData.set([`items[${i}][rec_id]`], items[i].rec_id)
          formData.set([`items[${i}][quantity]`], items[i].quantity)
        }
      } else {
        formData.set('items', [])
      }
      formData.set('order_sn', this.$route.query.order_sn)
      this.refundLoadingFlag = true
      this.$axios
        .$post('/1.0/order/refund', formData)
        .then((res) => {
          this.refundLoadingFlag = false
          if (res.code == 0) {
            this.refundItemsSubmitSuccess = true
          } else {
            alert(res.msg)
          }
          window.scrollTo({
            top: 0,
            behavior: 'instant'
          })
        })
        .catch((error) => {
          console.log(error)
          this.refundLoadingFlag = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 1004px;
  margin-left: auto;
  margin-right: auto;
  clear: both;
  padding: 0px 0 50px;
  min-height: 535px;
  color: var(--color-121212);
  &.is-success-main {
    min-height: 270px;
  }
  .return-items-list-box {
    padding-top: 9px;
    margin-bottom: 28px;
    .return-items-title {
      letter-spacing: 1px;
      font-size: 16px;
      font-family: @font-family-600, sans-serif;
      text-transform: uppercase;
    }
    .list-title {
      /deep/.title {
        padding: 6px 0 8px 10px;
      }
    }
  }
  .return-continue {
    margin-top: 30px;
    text-align: right;
    .continue-btn {
      padding: 7px 36px;
    }
  }
  .success-dec {
    text-align: center;
    font-size: 19px;
    margin-top: 33px;
    font-family: @font-family-600;
    .icon-ok {
      display: inline-block;
      width: 70px;
      height: 70px;
      margin-bottom: 20px;
      background: url('~assets/images/success.png') no-repeat center;
      background-size: 100%;
    }
  }
}
</style>
