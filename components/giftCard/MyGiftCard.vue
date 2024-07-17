<template>
  <div class="my-gift-cards">
    <div class="my-gift-cards-balance">
      <div class="sub-title">
        {{ nl('page_my_gift_card_balance_text') }} <span class="theme-color">{{ giftCardBalance }}</span>
      </div>
      <div class="balance-input-box">
        <input v-model="giftCardCode" :placeholder="nl('page_my_gift_card_input_placeholder')" type="text" />
        <az-button :loading="submitFlag" :disabled="submitFlag" :needIcon="false" @click="handleSubmit()" class="btn btn-hollow">{{
          submitFlag ? `${nl('page_order_progress_processing')}...` : nl('page_my_gift_card_btn_text')
        }}</az-button>
        <az-button v-track.view.click="{ common: { ec: 'gift_card', el: 'mygiftcard_reload' } }" :needIcon="false" class="btn btn-default">
          <a :href="countryUrl('/products/azazie-digital-gift-card')" target="_blank" style="color: #fff;">
            {{ nl('page_common_reload_your_balance') }}
          </a>
        </az-button>
      </div>
    </div>
    <div class="my-gift-cards-history">
      <div class="sub-title">{{ nl('page_my_gift_card_list_title') }}</div>
      <div class="history-table-header">
        <span class="header-title">{{ nl('page_common_date') }}</span>
        <span class="header-title">{{ nl('page_goods_goods_desc_title') }}</span>
        <span class="header-title">{{ nl('page_gift_card_detail_amount') }}</span>
      </div>
      <div class="history-table-box">
        <div v-if="loadingFlag" class="loading-box">
          <az-loading></az-loading>
        </div>
        <template v-else>
          <template v-if="historyList.length">
            <div v-for="(item, index) in historyList" :key="index" :class="{ 'even-item': index % 2 !== 0 }" class="table-box-item">
              <span class="table-item-content">{{ item.date }}</span>
              <span class="table-item-content"
                >{{ item.description }} <a :href="countryUrl(`/order/detail?order_sn=${item.orderSn}`)">{{ item.orderSn }}</a>
              </span>
              <span class="table-item-content">{{ item.descValue }}</span>
            </div>
            <div v-if="pageInfo.totalPage > 1" style="margin-top: 20px;">
              <az-pager :totalPage="pageInfo.totalPage" :page="pageInfo.page * 1" :isLoading="false" @pageChange="pageChange"></az-pager>
            </div>
          </template>
          <!-- 无历史订单 -->
          <template v-else>
            <div class="empty_order">
              <p class="order-empty-text">{{ nl('page_my_gift_card_list_empty') }}</p>
            </div>
          </template>
        </template>
      </div>
    </div>
    <popup-gift-card-verify
      ref="popup_gift_card_verify"
      v-if="popupGiftCardVerifyShow"
      @handleVerifySubmit="handleSubmit"
    ></popup-gift-card-verify>
    <az-toast ref="azToast" :message="successMsg" @toastHide="toastHide"></az-toast>
  </div>
</template>

<script>
import azPager from '@/components/az-ui/Pager/AzPager'
import AzLoading from '@/components/az-ui/AzLoading'
import AzButton from '@/components/az-ui/Button/AzButton'
import PopupGiftCardVerify from '@/components/giftCard/PopupGiftCardVerify'
import AzToast from '@/components/az-ui/AzToast'

import { mapState } from 'vuex'
export default {
  name: 'MyGiftCard',
  components: {
    azPager,
    AzLoading,
    AzButton,
    PopupGiftCardVerify,
    AzToast
  },
  data() {
    return {
      submitFlag: false,
      loadingFlag: true,
      historyList: [],
      page: 1,
      pageInfo: {
        page: 1,
        limit: 5,
        totalPage: 0
      },
      giftCardCode: '',
      giftCardBalance: '',
      successMsg: ''
    }
  },
  computed: {
    ...mapState({
      popupGiftCardVerifyShow: (state) => state.giftCard.popupGiftCardVerifyShow
    })
  },
  created() {
    this.getGiftCartBalance()
    this.fetchList()
  },
  methods: {
    toastHide() {
      this.successMsg = ''
    },
    // 激活礼品卡
    handleSubmit(giftCardverifyCode) {
      if (!this.giftCardCode) {
        alert(this.nl('page_my_gift_card_input_placeholder'))
        return
      }
      this.submitFlag = true
      const params = { givex_number: this.giftCardCode }
      if (giftCardverifyCode) params.verification_code = giftCardverifyCode
      this.$axios
        .$post('/1.0/user/gift-cart-recharge', params)
        .then((res) => {
          if (this.$refs.popup_gift_card_verify) this.$refs.popup_gift_card_verify.submitFlag = false
          this.submitFlag = false
          if (res.code === 0) {
            if (res.data) {
              this.successMsg = this.currencySymbol + res.data + ' ' + this.nl('page_gift_card_success_tips')
              this.$refs.azToast.show()
            }
            this.$store.commit('giftCard/setPopupGiftCardVerifyShow', false)
            this.giftCardCode = ''
            this.getGiftCartBalance()
            this.fetchList()
          } else if (res.code == 800503) {
            // 超过10次需要显示验证弹框
            this.$store.commit('giftCard/setPopupGiftCardVerifyShow', true)
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          this.submitFlag = false
          console.error(error)
        })
    },
    // 获取余额
    getGiftCartBalance() {
      this.$axios
        .$get('/1.0/user/gift-cart-balance')
        .then((res) => {
          if (res.code === 0) {
            this.giftCardBalance = res.data.balanceDisplay
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 获取礼品卡使用列表
    fetchList() {
      const params = {
        page: this.pageInfo.page,
        limit: 5
      }
      this.$axios
        .$post(`/1.0/user/gift-cart-record`, params)
        .then((res) => {
          this.historyList = []
          this.loadingFlag = false
          if (res.code === 0) {
            this.pageInfo = res.data && Object.assign({}, this.pageInfo, res.data.pageInfo || {})
            this.historyList = res.data.list
          }
        })
        .catch((error) => {
          this.loadingFlag = false
          console.error(error)
        })
    },
    pageChange(page, type) {
      this.pageInfo.page = page
      this.fetchList()
    }
  }
}
</script>

<style lang="less" scoped>
.my-gift-cards {
  // margin-top: 20px;
  width: 100%;
  height: 100%;
  .sub-title {
    font-size: 14px;
    font-family: @font-family-600;
    padding-bottom: 5px;
    border-bottom: 1px solid #ccc;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .my-gift-cards-balance {
    margin-top: 20px;
    .balance-input-box {
      input {
        width: 275px;
        height: 40px;
        box-sizing: border-box;
        border: 1px solid var(--color-cccccc);
      }
      .btn {
        margin-left: 20px;
        min-width: 203px;
      }
    }
  }
  .my-gift-cards-history {
    margin-top: 40px;
    .history-table-header {
      width: 903px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: var(--color-f9f9f9);
      height: 40px;
      padding: 10px;
      box-sizing: border-box;
      .header-title {
        text-transform: uppercase;
        height: 19px;
        font-size: 14px;
        line-height: 19px;
        &:nth-child(2) {
          flex: 1;
        }
        &:not(:nth-child(2)) {
          width: 200px;
        }
      }
    }
    .history-table-box {
      min-height: 200px;
      width: 903px;
      .table-box-item {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        .table-item-content {
          width: calc(100% / 4);
          height: 18px;
          font-size: 13px;
          font-family: @font-family-500;
          color: var(--color-121212);
          line-height: 18px;
          &:nth-child(2) {
            flex: 1;
          }
          &:not(:nth-child(2)) {
            width: 200px;
          }
          a {
            text-decoration: underline;
            color: var(--color-121212);
          }
        }
        &.even-item {
          background-color: var(--color-f9f9f9);
        }
        &:hover {
          background-color: #eee;
        }
      }
    }
    .empty_order {
      text-align: center;
      .order-empty-text {
        font-size: 14px;
        color: #666;
        font-family: @font-family-500;
        margin-top: 30px;
      }
    }
  }
}
</style>
