<template>
  <div>
    <div>
      <az-popup-layer :z-index="12" :title="nl('page_order_oxxo_refund_title')" @close="handleClose" width="318px" height="auto">
        <div class="popup-oxxo-refund clearfix">
          <form class="ticket-form">
            <ul>
              <li class="form-item">
                <label for="receiverName">{{ nl('page_order_oxxo_refund_holder_name') }}:<em>*</em></label>
                <input
                  :class="{ error: rulesResult.receiverName }"
                  v-model="ticketForm.receiverName"
                  @focus="inputFocus('receiverName')"
                  type="text"
                  name="receiverName"
                  maxlength="100"
                />
                <p class="error-tip">{{ rulesResult.receiverName }}</p>
              </li>
              <li class="form-item">
                <label for="bankName">{{ nl('page_order_oxxo_refund_bank_name') }}:<em>*</em></label>
                <input
                  id="bankName"
                  v-model="ticketForm.bankName"
                  :class="{ error: rulesResult.bankName }"
                  @focus="inputFocus('bankName')"
                  type="text"
                  name="bankName"
                  maxlength="45"
                />
                <p class="error-tip">{{ rulesResult.bankName }}</p>
              </li>
              <li class="form-item">
                <label>{{ nl('page_order_oxxo_refund_key') }}:<em>*</em></label>
                <input
                  :class="{ error: rulesResult.bankAccountNumber }"
                  @focus="inputFocus('bankAccountNumber')"
                  v-model="ticketForm.bankAccountNumber"
                  type="text"
                  name="bankAccountNumber"
                />
                <p class="error-tip">{{ rulesResult.bankAccountNumber }}</p>
              </li>
              <li class="form-item">
                <az-button :loading="submitLoading" @click="handleSubmit" class="btn btn-default btn-submit">{{
                  nl('page_btn_send')
                }}</az-button>
              </li>
            </ul>
          </form>
          <p class="ticket-form-tips">{{ nl('page_order_oxxo_refund_form_tips') }}</p>
        </div>
      </az-popup-layer>
    </div>
  </div>
</template>

<script>
import azPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
import Schema from 'async-validator'

export default {
  name: 'PopupOxxoRefund',
  components: { azPopupLayer, AzButton },
  props: {},
  data() {
    return {
      submitLoading: false,
      validator: null,
      ticketForm: {
        totalPrice: '',
        receiverName: '',
        bankName: '',
        bankAccountNumber: ''
      },
      rulesResult: {
        receiverName: '',
        bankName: '',
        bankAccountNumber: ''
      }
    }
  },
  created() {},
  mounted() {
    const rules = {
      maxLength(val, checks) {
        return val.trim().length <= checks.maxLength
      },
      minLength(val, checks) {
        return val.trim().length >= checks.minLength
      },
      number(val) {
        return /^[0-9]+$/.test(val.trim())
      }
    }

    const cardNumberCheck = (rule, value, callback) => {
      if (!rules.number(value)) {
        callback(new Error(this.nl('page_js_credit_card_enter_valid_num')))
      } else if (!rules.minLength(value, { minLength: 14 }) || !rules.maxLength(value, { maxLength: 16 })) {
        callback(new Error(this.nl('page_js_credit_card_enter_valid_num')))
      } else {
        callback()
      }
    }
    const descriptor = {
      receiverName: [{ type: 'string', required: true, message: this.nl('page_order_oxxo_refund_ruler_holder_name'), trigger: 'blur' }],
      bankName: [{ type: 'string', required: true, message: this.nl('page_order_oxxo_refund_ruler_bank_name'), trigger: 'blur' }],
      bankAccountNumber: [{ type: 'string', required: true, validator: cardNumberCheck, trigger: 'blur' }]
    }
    this.validator = new Schema(descriptor)
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    handleSubmit(e) {
      this.resetRulesResult()
      this.validator.validate(this.ticketForm, (errors, fields) => {
        if (errors) {
          errors.map((item) => {
            if (!this.rulesResult[item.field]) {
              this.rulesResult[item.field] = item.message
            }
          })
          e.preventDefault()
          return false
        }
        const params = {
          receiver_name: this.ticketForm.receiverName,
          bank_name: this.ticketForm.bankName,
          bank_account_number: this.ticketForm.bankAccountNumber
        }
        this.$emit('handleSubmit', params)
      })
    },
    restAllInput() {
      this.totalPrice = ''
      this.receiverName = ''
      this.bankName = ''
      this.bankAccountNumber = ''
    },
    inputFocus(type) {
      this.rulesResult[type] = ''
    },
    resetRulesResult() {
      this.rulesResult.totalPrice = ''
      this.rulesResult.receiverName = ''
      this.rulesResult.bankName = ''
      this.rulesResult.bankAccountNumber = ''
    }
  }
}
</script>

<style lang="less" scoped>
.popup-oxxo-refund {
  box-sizing: border-box;
  .ticket-form {
    li {
      margin-bottom: 15px;
      input {
        height: 40px;
        box-sizing: border-box;
        width: 100%;
        &[disabled] {
          background: var(--color-f9f9f9);
        }
      }
      label {
        display: block;
        margin-bottom: 6px;
        font-family: @font-family-600, sans-serif;
        em {
          color: var(--color-121212);
          margin-left: 3px;
          font-size: 11px;
        }
      }
      .error-tip {
        color: red;
        margin: 6px 0;
      }
      .btn-submit {
        width: 100%;
      }
    }
  }
  .ticket-form-tips {
    color: var(--color-999999);
  }
}
</style>
