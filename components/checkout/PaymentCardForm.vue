<template>
  <div :class="{ installment: payType == 'installment' }" class="payment-card-form">
    <form method="post">
      <ul v-if="payType == 'installment'" class="card-installment-list">
        <li>
          <div class="installment-title">
            {{ nl('page_detail_installment_dialog_header') }}
            <span class="theme-color"> ({{ nl('page_checkout_to_pay') }} {{ checkoutSummary.totalAmountDisplay }})</span>
          </div>
          <az-select
            :class="{ 'error-border': paymentRulesResult.installmentsId }"
            :options="installmentList"
            :defaultValue="(bankCardForm.installments && bankCardForm.installments + '') || ''"
            :placeholder="nl('page_detail_installment_dialog_header')"
            :width="465"
            @on-change="handleChooseInstallment"
            class="installment-select"
            name="installments"
          ></az-select>
          <div v-if="bankCardForm.installmentsTotalAmount" class="installment-selected">
            {{ nl('page_checkout_precio_total') }} <span class="theme-color">{{ bankCardForm.installmentsTotalAmount }}</span>
          </div>
        </li>

        <!-- <li>
          <input
            v-model="bankCardForm.document_id"
            :placeholder="nl('page_checkout_document_id')"
            @focus="resetInput('document_id')"
            @blur="onBlur('document_id')"
            :class="{ error: paymentRulesResult.document_id || paymentError }"
            type="text"
            name="document_id"
          />
          <p class="error-tip">{{ paymentRulesResult.document_id }}</p>
        </li> -->
      </ul>
      <!-- <ul class="card-list">
        <li
          v-for="(item, index) in payCardList"
          :key="index"
          :class="{ selected: bankCardForm.cardName == item.replace('icon-', '') }"
          class="card-item"
        >
          <span :class="item">
            <img
              v-if="item == 'cartes-bancaires'"
              src="https://cdn-1.azazie.com/upimg/userfiles/images/77/51/723e448f39d9ccc6f8f1c96bcefa7751.png"
            />
            <az-icon v-else :icon-class="item" class="icon"></az-icon>
          </span>
        </li>
      </ul> -->
      <ul class="card-info">
        <li v-if="payType == 'installment'">
          <input
            v-model="bankCardForm.holderName"
            :placeholder="nl('page_checkout_credit_card_name')"
            @focus="resetInput('holderName')"
            @blur="onBlur('holderName')"
            :class="{ error: paymentRulesResult.holderName || paymentError }"
            type="text"
            name="holderName"
          />
          <p class="error-tip">{{ paymentRulesResult.holderName }}</p>
        </li>
        <li>
          <div>
            <cleave
              v-model="bankCardForm.cardNumber"
              @focus.native="resetInput('cardNumber')"
              @blur.native="onBlur('cardNumber')"
              @input="cardNumberChangeHandler"
              :class="{ error: paymentRulesResult.cardNumber || paymentError }"
              :placeholder="nl('page_checkout_card_num')"
              :options="cardOptions"
              name="cardNumber"
            ></cleave>
            <p class="error-tip">{{ paymentRulesResult.cardNumber }}</p>
          </div>
        </li>
        <li class="expirate_data_li">
          <div class="col2-wrap">
            <cleave
              id="expirate_data_input"
              v-model="tempExpirateDate"
              @focus.native="resetInput('expirateDate')"
              @blur.native="onBlur('expirateDate')"
              :placeholder="'MM/YY'"
              :class="{ error: paymentRulesResult.expirateDate || paymentError }"
              :options="options"
              name="expirateDate"
            ></cleave>
          </div>
          <p class="error-tip">{{ paymentRulesResult.expirateDate }}</p>
        </li>

        <li class="security_code_li">
          <div class="col2-wrap">
            <div class="col2">
              <input
                id="security_code_input"
                v-model="bankCardForm.securityCode"
                @focus="resetInput('securityCode')"
                @blur="onBlur('securityCode')"
                :placeholder="nl('page_payment_security_code')"
                :class="{ error: paymentRulesResult.securityCode || paymentError }"
                type="text"
                name="securityCode"
              />
            </div>
            <div id="security_code_hover" @mouseenter="handOver(true)" @mouseleave="handOver(false)">
              <az-icon icon-class="icon-gwc-_question_" class="icon-question"></az-icon>
              <div class="text_tip">
                <em></em>
                <span></span>
                <div class="credit-card">
                  <img :src="addWebpSuffix(nl('page_image_pc_credit_card'))" alt="credit card" />
                </div>
              </div>
            </div>
          </div>
          <p class="error-tip">{{ paymentRulesResult.securityCode }}</p>
        </li>
      </ul>
    </form>
  </div>
</template>
<script>
import AzSelect from '@/components/az-ui/AzSelect'
import paymentCardMixins from '@/assets/js/paymentCardMixins.js'
import Cleave from 'vue-cleave-component'
import { mapState } from 'vuex'
export default {
  name: 'PaymentCardForm',
  components: {
    Cleave,
    AzSelect
  },
  mixins: [paymentCardMixins],
  props: {
    payType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempExpirateDate: '',
      cardRules: [
        { cardName: 'visa', cardReg: /^4[0-9]/ },
        { cardName: 'master_card', cardReg: /^5[1-5]/ },
        { cardName: 'american_express', cardReg: /^(34|37)/ },
        { cardName: 'discover', cardReg: /^6011|^(6(4[4-9]|5[0-9]))/ },
        { cardName: 'diners_club', cardReg: /^(30[0-5]|309|36|38|39)[0-9]/ },
        { cardName: 'jcb', cardReg: /^(35(2[8-9]|[3-8][0-9]))/ }
      ],
      cardOptions: {
        creditCard: true
      },
      options: {
        date: true,
        datePattern: ['m', 'y']
      }
    }
  },
  computed: {
    ...mapState('checkout', [
      'checkoutError',
      'errorTipCode',
      'errorTipText',
      'installmentsId',
      'paymentInfo',
      'checkoutSummary',
      'bankCardInfo'
    ]),
    ...mapState({
      isPopupInstallmentShow: (state) => state.product.isPopupInstallmentShow
    }),
    paymentError() {
      return (
        this.errorTipCode &&
        !['duplicate', 'unknown_error', 'unavailable', 'blacklist', 'paypal', '', 'eventdate'].includes(this.errorTipCode.toLowerCase())
      )
    },
    installmentList() {
      const tmpInstallmentList = []
      if (this.paymentInfo.installmentsPlan && this.paymentInfo.installmentsPlan.installments) {
        this.paymentInfo.installmentsPlan.installments.forEach((item) => {
          tmpInstallmentList.push({
            key: item.installments + '',
            name: `${item.installments} x  ${item.installment_amount_display}${
              item.installments == 1 ? '' : '(' + item.total_amount_display + ')'
            } ${item.interestRate > 0 ? item.interestRate + '%' : ''} ${
              item.interestRate * 1 > 0 ? this.nl('page_product_of_interest') : ''
            }`,
            ...item
          })
        })
      }

      return tmpInstallmentList
    }
  },
  watch: {
    tempExpirateDate: {
      handler(val) {
        if (val.length === 4) {
          const myDate = new Date()
          this.bankCardForm.month = val.substr(0, 2)
          this.bankCardForm.year =
            myDate
              .getFullYear()
              .toString()
              .substr(0, 2) + val.substr(2, 2)
          this.bankCardForm.expirateDate = this.bankCardForm.month + '/' + this.bankCardForm.year
        } else {
          this.bankCardForm.expirateDate = ''
          this.bankCardForm.year = ''
          this.bankCardForm.month = ''
        }
      },
      immediate: true
    }
  },
  created() {
    // 有分期的情况下，默认选中1期
    if (!this.bankCardInfo.installmentsId && this.installmentList.length) this.handleChooseInstallment(this.installmentList[0])
  },
  mounted() {},
  methods: {
    handleChooseInstallment(item) {
      this.bankCardForm.installmentsTotalAmount = item.total_amount_display
      this.bankCardForm.installmentsId = item.id
      this.bankCardForm.installments = item.installments
      const tempBankCardInfo = JSON.parse(JSON.stringify(this.bankCardForm))
      this.$store.commit('checkout/setBankCardInfo', tempBankCardInfo)
      const rulesResult = JSON.parse(JSON.stringify(this.paymentRulesResult))
      rulesResult.installmentsId = ''
      this.$store.commit('checkout/setpPaymentRulesResult', rulesResult)
    },
    handOver(status) {
      status && this.setPoint('creditcard', 'icon', 'click')
    },
    resetInput(name) {
      let rulesResult = JSON.parse(JSON.stringify(this.paymentRulesResult))
      this.$store.commit('checkout/setErrorTipCode', '')
      this.$store.commit('checkout/setErrorTipText', '')
      this.$store.commit('checkout/setCheckoutError', { isPaymentError: false })
      if (name) {
        rulesResult[name] = ''
        this.$store.commit('checkout/setpPaymentRulesResult', rulesResult)
        return false
      }
      rulesResult = {
        cardNumber: '',
        expirateDate: '',
        securityCode: ''
      }
      this.$store.commit('checkout/setpPaymentRulesResult', rulesResult)
    },
    onBlur(name) {
      const tempBankCardInfo = JSON.parse(JSON.stringify(this.bankCardForm))
      this.$store.commit('checkout/setBankCardInfo', tempBankCardInfo)
      const rulesResult = JSON.parse(JSON.stringify(this.paymentRulesResult))
      const param = {
        cardNumber: this.bankCardForm.cardNumber,
        expirateDate: this.bankCardForm.expirateDate,
        securityCode: this.bankCardForm.securityCode,
        holderName: this.bankCardForm.holderName,
        installmentsId: this.bankCardForm.installmentsId
      }
      this.validator.validate(param, (errors, fields) => {
        if (errors) {
          errors.map((item) => {
            if (!rulesResult[item.field] && name == item.field) {
              rulesResult[item.field] = item.message
              if (item.field == 'cardNumber') {
                this.setPoint('payment', 'error', 'view', { error: item.message })
                this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Payment_Error2_View' })
              }
              if (item.field == 'expirateDate') {
                this.setPoint('payment', 'error', 'view', { error: item.message })
                this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Payment_Error3_View' })
              }
              if (item.field == 'securityCode') {
                this.setPoint('payment', 'error', 'view', { error: item.message })
                this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Payment_Error4_View' })
              }
            }
          })
          this.$store.commit('checkout/setpPaymentRulesResult', rulesResult)
        }
      })
    },
    // 卡类型确认
    cardNumberChangeHandler() {
      const tempBankCardInfo = JSON.parse(JSON.stringify(this.bankCardForm))
      const number = this.bankCardForm.cardNumber.trim()
      let findIt = false
      for (let i = 0; i < this.cardRules.length; i++) {
        if (this.cardRules[i].cardReg.test(number)) {
          if (this.bankCardForm.cardName != this.cardRules[i].cardName) {
            tempBankCardInfo.cardName = this.cardRules[i].cardName
          }
          findIt = true
        }
      }
      if (!findIt) {
        tempBankCardInfo.cardName = ''
      }
      this.$store.commit('checkout/setBankCardInfo', tempBankCardInfo)
    }
  }
}
</script>
<style lang="less" scoped>
.payment-card-form {
  width: 100%;
  &.installment {
    .card-info {
      li {
        max-width: 225px;
      }
    }
    .card-installment-list {
      width: 465px;
      .installment-title,
      .installment-select,
      .installment-selected {
        margin-bottom: 10px;
      }
      li {
        margin-top: 10px;
      }
      input {
        width: 100%;
      }
    }
    input {
      width: 225px;
      height: 40px;
      box-sizing: border-box;
    }
    .security_code_li {
      width: 175px !important;
      .col2-wrap {
        justify-content: space-between;
        .col2 {
          width: 145px;
          #security_code_input {
            width: 100%;
          }
          #security_code_hover {
            margin-left: 0;
          }
        }
      }
    }

    .expirate_data_li {
      width: 80px !important;
      #expirate_data_input {
        width: 80px;
      }
    }
  }

  .card-list {
    display: flex;
    .card-item {
      border: 2px solid transparent;
      cursor: pointer;
      border-radius: 4px;
      margin-right: 1px;
      &.selected {
        border-color: var(--color-121212);
      }
      span {
        display: block;
        width: 35px;
        height: 22px;
        .icon,
        img {
          width: 35px;
          height: 22px;
        }
      }
    }
  }
  .card-info {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    label {
      display: block;
      margin: 0 0 3px 2px;
      text-transform: capitalize;
    }
    li {
      margin-bottom: 5px;
      .col2-wrap {
        display: flex;
        align-items: center;
      }
      #security_code_hover {
        display: inline-block;
        position: relative;
        vertical-align: middle;
        margin-left: 10px;
        margin-top: -3px;
        cursor: pointer;
        .icon-question {
          display: inline-block;
          width: 15px;
          height: 15px;
        }
        .text_tip {
          display: none;
          border: 1px solid #e1e1e1;
          position: absolute;
          background: #ffffff;
          font-family: @font-family-500;
          font-size: 13px;
          color: var(--color-121212);
          text-align: center;
          line-height: 18px;
          border-radius: 2px;
          width: 380px;
          left: -152px;
          top: 27px;
          z-index: @z-index-5;
          .credit-card {
            height: 180px;
            img {
              width: 100%;
            }
          }
          em {
            display: block;
            border-width: 10px;
            position: absolute;
            left: 150px;
            top: -20px;
            border-style: dashed dashed solid;
            border-color: transparent transparent #e1e1e1;
            font-size: 0;
            line-height: 0;
          }
          span {
            display: block;
            border-width: 10px;
            position: absolute;
            left: 150px;
            top: -18px;
            border-style: dashed dashed solid;
            border-color: transparent transparent #ffffff;
            font-size: 0;
            line-height: 0;
          }
        }

        &:hover {
          .text_tip {
            display: block;
          }
        }
      }
    }
    .expirate_data_li {
      width: 176px;
    }
    .security_code_li {
      width: 180px;
    }
  }

  .col2 {
    width: 153px;
    &:nth-child(2) {
      margin-left: 20px;
    }
  }

  input,
  select {
    background: #fff;
    border: solid 1px #ccc;
    padding: 10px 5px;
    margin-bottom: 5px;
  }
  input {
    width: 355px;
  }
  select {
    width: 341px;
    height: 40px;
    padding: 10px 0;
  }
  #expirate_data_input {
    width: 164px;
  }
  #security_code_input {
    width: 138px;
  }
  .col2 input {
    width: 141px;
  }
  .col2 select {
    width: 153px;
  }
  .mt {
    margin-top: 6px;
  }
  input.error,
  select.error {
    border: solid 1px #f00;
  }
  .error-tip {
    display: block;
    color: #f00;
    &.payment-rrror {
      margin-bottom: 10px;
    }
  }
}
</style>
