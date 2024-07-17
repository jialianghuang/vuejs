<template>
  <az-popup-layer :zIndex="12" @close="closeLayer()" width="auto" height="auto" class="return-order-dialog">
    <div class="return-order-dialog-content">
      <template v-if="!isMailIn">
        <!-- onlyRefundable  代表是不是支持只退款-->
        <div v-if="!isFromShowContactUs && returnOrder.onlyRefundable && !stillReturn" class="refund-without-return">
          <div v-html="nl('page_return_refund_without_return_txt')" class="txt"></div>
          <az-button @click="handleGoReturn" :text="nl('page_return_get_refund_without_return_btn')" class="btn"></az-button>
          <div @click="handleStillReturn" class="txt-btn">{{ nl('page_return_still_need_return') }}</div>
        </div>
        <div v-else class="happy-return">
          <div :class="{ diabled: hrdisabled }" class="hr-box">
            <div class="hr-title-box">
              <az-icon :icon-class="hrdisabled ? 'icon-a-happyreturn_no1' : 'icon-a-happyreturn_yes1'" class="icon"></az-icon>
              <div class="title">{{ nl('page_return_hr_title') }}</div>
            </div>
            <div class="hr-desc-box">
              <p v-html="nl('page_return_hr_desc_1')" class="desc"></p>
              <p v-html="nl('page_return_hr_desc_2')" class="desc"></p>
              <p v-html="nl('page_return_hr_desc_3')" class="desc"></p>
              <p v-html="nl('page_return_hr_desc_note')" class="desc"></p>
              <p v-html="nl('page_return_hr_desc_note_1')" class="desc"></p>
            </div>
            <az-button @click="handleGoHappyReturn" :text="nl('page_return_hr_btn_txt')" class="btn"></az-button>
          </div>
          <div v-if="!mailInDisabled" class="mail-in-box">
            <p class="txt">{{ nl('page_common_or') }}</p>
            <div @click="handleGoReturn" class="txt-btn">{{ nl('page_return_via_mail') }}</div>
          </div>
          <div v-html="nl('page_return_hr_customer_txt')" :class="{ mt20: mailInDisabled }" class="customer-box"></div>
        </div>
      </template>
      <template v-else>
        <div class="happy-return mail-in">
          <div class="hr-box">
            <div class="hr-title-box">
              <svg v-if="['usps', 'USPS'].includes(returnOrder.providerCode)" width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path
                  d="M66.4064 37.3296C70.3602 30.9999 68.7358 29.8506 64.6128 29.8506H60.4751C60.4598 29.8506 60.2452 29.6362 58.8045 31.0767C57.0879 31.9352 52.9965 32.0421 52.9965 32.4101C52.9965 33.0999 63.7702 31.9352 66.4982 32.4101C67.9544 32.6399 66.2685 35.5366 65.8238 37.3141C65.7473 38.0039 66.192 37.6668 66.4064 37.3296ZM49.2262 40.7931C59.0342 37.5287 64.138 37.1301 64.8582 36.778C65.5328 36.3333 64.1841 35.7665 60.8429 35.8889C52.9199 36.2261 39.755 41.5747 34.3909 44.1493L29.6862 29.8506H59.8163C59.4024 25.5289 36.3834 26.387 8.03045 26.387L0 64.0114C30.0999 49.0997 39.6783 44.0423 49.2262 40.7931ZM10.3757 15.0002C49.1956 23.2301 60.9504 25.0691 61.272 28.0576C66.8504 28.0576 68.3064 28.0576 69.3026 29.0691C72.5365 32.088 67.0652 39.4444 67.0652 39.4444C66.3908 39.8889 4.78175 63.9961 4.78175 63.9961H69.6243L80 15L10.3757 15.0002Z"
                  fill="#02599E"
                />
              </svg>
              <svg v-if="['ups', 'UPS'].includes(returnOrder.providerCode)" width="80" height="80" viewBox="0 0 80 80" fill="none">
                <g clip-path="url(#clip0_1822_669)">
                  <path
                    d="M16.003 66.0968C10.3215 61.4452 7.32043 54.7494 7.32043 46.7523V8.73773C16.2923 3.98171 27.156 1.57129 39.6114 1.57129C52.0669 1.57129 62.9318 3.98171 71.9024 8.73773V46.7523C71.9024 54.7494 68.9014 61.4404 63.2199 66.0968C58.0221 70.3571 41.5069 77.6039 39.6102 78.4286C37.716 77.6039 21.2008 70.3583 16.003 66.0968Z"
                    fill="#330000"
                  />
                  <path
                    d="M70.1342 8.29122C65.9832 7.90589 61.6713 7.6514 57.279 7.6514C40.9895 7.6514 23.526 11.153 9.08865 24.3947V47.0284C9.08865 54.4001 11.8148 60.5558 16.9945 64.7776C21.5681 68.4989 35.6429 74.8731 39.6114 76.6245C43.5296 74.8995 57.5683 68.6093 62.2223 64.7776C67.4345 60.4826 70.1342 54.4697 70.1342 47.0284V8.29122ZM12.0729 44.6732V26.2913H17.9177V44.9325C17.9177 46.5914 18.3186 49.0475 20.9991 49.0475C21.9705 49.0867 22.9316 48.836 23.76 48.3272V26.2913H29.5976V51.6608C26.9612 53.3062 23.8923 54.1241 20.7866 54.0088C15.0007 54.0088 12.0669 50.8685 12.0669 44.6732M38.4542 65.8904H32.6058V27.7798C34.9716 26.3268 37.7131 25.6032 40.4877 25.6995C47.4681 25.6995 51.3034 30.9957 51.3034 39.5198C51.3034 48.0439 47.5821 53.9079 41.0879 53.9079C40.199 53.9239 39.3124 53.8119 38.4554 53.5754L38.4542 65.8904ZM38.4542 48.7966C39.0614 49.024 39.7037 49.1435 40.3521 49.1495C43.7132 49.1495 45.3242 46.0609 45.3242 39.6663C45.3242 33.1157 43.9185 30.4063 40.5225 30.4063C39.8101 30.4005 39.1042 30.544 38.4506 30.8277L38.4542 48.7966ZM52.6287 33.3209C52.6653 31.2721 53.5108 29.3209 54.9807 27.893C56.4505 26.4652 58.4255 25.6767 60.4745 25.6995C62.7681 25.578 65.0338 26.2484 66.8919 27.5986V32.6847C65.5147 31.2478 63.642 30.3894 61.6545 30.2839C59.9968 30.2695 58.2718 30.9981 58.2154 33.0772C58.1589 35.2056 59.8803 36.0459 62.0567 37.3255C66.9411 40.1969 67.8858 42.7777 67.773 46.1881C67.6614 49.9274 65.0841 54.0112 59.3065 54.0112C57.0409 53.9858 54.8227 53.3594 52.8783 52.1961V46.8099C54.4229 48.2056 56.3908 49.0433 58.4674 49.1891C60.6126 49.1999 62.0243 47.9707 61.9738 45.9312C61.9294 44.0958 60.8935 43.0983 58.321 41.5869C53.499 38.7588 52.6323 36.4312 52.6239 33.3209M15.0379 67.1616C9.12106 62.3156 6 55.352 6 47.0284V7.45934C15.338 2.50885 26.647 0 39.6114 0C52.5758 0 63.8849 2.50885 73.2229 7.45934V47.0284C73.2229 55.352 70.1018 62.3156 64.185 67.1628C58.7759 71.5971 41.5849 79.1393 39.6114 79.9976C37.638 79.1393 20.4469 71.5972 15.0379 67.1616ZM61.0663 75.4553V78.8896H61.6857V77.4563H61.7734C61.8202 77.526 62.7061 78.8896 62.7061 78.8896H63.4563C63.4563 78.8896 62.5152 77.5128 62.4192 77.3831C62.6338 77.3465 62.8282 77.2345 62.9675 77.0672C63.1069 76.9 63.1819 76.6885 63.179 76.4708C63.1819 76.3258 63.1532 76.1818 63.0949 76.049C63.0366 75.9161 62.9501 75.7976 62.8413 75.7015C62.7326 75.6055 62.6043 75.5342 62.4652 75.4927C62.3262 75.4512 62.1798 75.4405 62.0363 75.4613L61.0663 75.4553ZM61.969 75.957C62.496 75.957 62.5692 76.2151 62.5692 76.4372C62.5692 76.7589 62.4312 76.9762 61.7674 76.9762H61.6869V75.9546L61.969 75.957ZM64.3939 77.1814C64.3929 77.641 64.2558 78.09 63.9998 78.4717C63.7439 78.8534 63.3805 79.1507 62.9557 79.326C62.5309 79.5013 62.0637 79.5468 61.613 79.4567C61.1623 79.3667 60.7485 79.1451 60.4237 78.82C60.0989 78.4948 59.8777 78.0807 59.7881 77.63C59.6985 77.1792 59.7445 76.712 59.9202 76.2874C60.096 75.8628 60.3937 75.4997 60.7756 75.2442C61.1576 74.9886 61.6067 74.8519 62.0663 74.8515C62.3722 74.8511 62.6752 74.9112 62.9579 75.0282C63.2406 75.1452 63.4974 75.3169 63.7137 75.5333C63.9299 75.7498 64.1013 76.0068 64.218 76.2896C64.3347 76.5724 64.3945 76.8755 64.3939 77.1814ZM62.0591 74.3545C61.5013 74.3552 60.9562 74.5212 60.4926 74.8315C60.0291 75.1418 59.6679 75.5826 59.4548 76.098C59.2416 76.6135 59.1859 77.1806 59.2948 77.7277C59.4037 78.2747 59.6723 78.7773 60.0667 79.1718C60.461 79.5663 60.9634 79.8351 61.5105 79.9443C62.0575 80.0534 62.6246 79.998 63.1402 79.785C63.6557 79.572 64.0966 79.2111 64.4071 78.7477C64.7176 78.2843 64.8839 77.7393 64.8848 77.1814C64.8839 76.4322 64.5859 75.7139 64.0562 75.184C63.5265 74.654 62.8083 74.3558 62.0591 74.3545Z"
                    fill="#FFBE00"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1822_669">
                    <rect width="67.2229" height="80" fill="white" transform="translate(6)" />
                  </clipPath>
                </defs>
              </svg>

              <div v-if="['usps', 'USPS', 'ups', 'UPS'].includes(returnOrder.providerCode)" class="title">
                {{ nl('page_return_mail_in_preson') }} {{ returnOrder.provider }}
              </div>
              <div v-else class="title">{{ nl('page_return_mail_in') }}</div>
            </div>
            <div class="hr-desc-box">
              <p v-html="nl('page_return_mail_in_desc_1')" class="desc"></p>
              <p v-html="nl('page_return_mail_in_desc_2')" class="desc"></p>
              <p class="desc">{{ nl('page_return_mail_in_desc_3') }}</p>
              <p v-html="nl('page_return_mail_in_desc_4')" class="desc"></p>
            </div>
            <az-button @click="handleGoReturn" :text="nl('page_return_hr_btn_txt')" class="btn"></az-button>
          </div>
          <div class="mail-in-box">
            <p class="txt">{{ nl('page_common_or') }}</p>
            <div @click="handleGoHappyReturn" class="txt-btn">{{ nl('page_return_happy_return') }}</div>
          </div>
          <div v-html="nl('page_return_hr_customer_txt')" :class="{ mt20: mailInDisabled }" class="customer-box"></div>
        </div>
      </template>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/AzButton'
export default {
  name: 'ReturnOrderLayer',
  components: {
    AzPopupLayer,
    AzButton
  },
  props: {
    returnOrder: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      stillReturn: false
    }
  },
  computed: {
    hrdisabled() {
      return (
        this.isFromShowContactUs ||
        (this.returnOrder.returnMethod &&
          (!this.returnOrder.returnMethod.happy_return ||
            !this.returnOrder.returnMethod.happy_return.isShow ||
            !Object.keys(this.returnOrder.returnMethod.happy_return).length))
      )
    },
    mailInDisabled() {
      return (
        this.isFromShowContactUs ||
        (this.returnOrder.returnMethod &&
          (!this.returnOrder.returnMethod.mail_in ||
            !this.returnOrder.returnMethod.mail_in.isShow ||
            !Object.keys(this.returnOrder.returnMethod.mail_in).length))
      )
    },
    isFromShowContactUs() {
      // 这个退货弹窗出现有两种情况
      // 1.订单可退的情况，returnable为true,这个时候,弹窗页面的显示根据returnMethod里面的数据判断
      // 2.还有一种特殊情况,不可退货的订单会弹出退货弹窗，returnable为false && showContactUs为true,这个时候弹窗内容写死为 happy return 置灰，只显示联系客服
      return !this.returnOrder.returnable && this.returnOrder.showContactUs
    },
    isMailIn({ returnOrder }) {
      return returnOrder.channel == 'mail_in'
    }
  },
  methods: {
    closeLayer() {
      this.$store.commit('order/setReturnOrderLayerShow', false)
    },
    handleGoReturn() {
      window.location.href = this.countryUrl(`/order/return?order_sn=${this.returnOrder.orderSn}`)
    },
    handleStillReturn() {
      this.stillReturn = true
    },
    handleGoHappyReturn() {
      // 跳转到happy return 页面
      if (this.hrdisabled) return false
      window.open(this.returnOrder.returnMethod.happy_return.url)
      this.closeLayer()
      this.$emit('refreshOrder')
    }
  }
}
</script>

<style lang="less" scoped>
.return-order-dialog {
  /deep/.az-popup-box {
    border: none;
  }
}
.return-order-dialog-content {
  .refund-without-return {
    width: 285px;
    .txt {
      width: 100%;
      font-weight: 400;
      font-size: 13px;
      line-height: 22px;
      color: var(--color-121212);
    }
    .btn {
      width: 100%;
      font-size: 14px;
      line-height: 19px;
      padding: 13px 10px;
      font-family: @font-family-600;
      margin: 15px 0 20px;
      text-transform: uppercase;
      box-sizing: border-box;
    }
    .txt-btn {
      font-size: 14px;
      line-height: 19px;
      text-align: center;
      text-decoration: underline;
      color: var(--color-121212);
      cursor: pointer;
    }
  }
  .happy-return {
    width: 366px;
    .hr-box {
      padding: 20px 20px 30px;
      border: 1px solid var(--color-eeeeee);
      box-sizing: border-box;
      color: var(--color-121212);
      .hr-title-box {
        box-sizing: border-box;
        padding: 20px 10px;
        background: var(--color-f9f9f9);
        text-align: center;
        .icon {
          width: 80px;
          height: 80px;
        }
        .title {
          font-family: @font-family-600;
          font-size: 16px;
          line-height: 22px;
          margin-top: 10px;
        }
      }
      .hr-desc-box {
        width: 275px;
        margin: 0 auto;
        .desc {
          font-size: 13px;
          line-height: 18px;
          margin-top: 10px;
        }
      }
      .btn {
        width: 275px;
        margin: 30px auto 0;
        font-size: 14px;
        line-height: 19px;
        padding: 13px 10px;
        font-family: @font-family-600;
        text-transform: uppercase;
        box-sizing: border-box;
      }
      &.diabled {
        color: var(--color-999999);
        .btn {
          background: var(--color-f9f9f9) !important;
          border: 1px solid var(--color-cccccc) !important;
          box-sizing: border-box;
          color: var(--color-cccccc) !important;
          cursor: default;
        }
      }
    }
    .mail-in-box {
      text-align: center;
      margin-top: 15px;
      .txt {
        font-size: 13px;
        line-height: 18px;
        text-transform: uppercase;
        color: var(--color-666666);
        text-align: center;
        margin-bottom: 10px;
      }
      .txt-btn {
        font-size: 14px;
        line-height: 19px;
        text-align: center;
        text-decoration: underline;
        color: var(--color-121212);
        cursor: pointer;
      }
    }
    .customer-box {
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
      line-height: 22px;
      color: var(--color-121212);
      &.mt20 {
        margin-top: 20px;
      }
      /deep/a {
        text-decoration: underline;
        color: var(--color-121212) !important;
      }
    }
  }
}
</style>
