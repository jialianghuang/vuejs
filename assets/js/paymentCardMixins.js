import { mapState } from 'vuex'
import Schema from 'async-validator'

export default {
  name: 'PaymentCardForm',
  data() {
    return {
      validator: null,
      bankCardForm: {}
    }
  },
  computed: {
    ...mapState('checkout', ['bankCardInfo', 'paymentRulesResult', 'paymentId'])
  },
  watch: {
    bankCardInfo: {
      handler() {
        let tempBankCardInfo = {
          cardNumber: '',
          month: '',
          year: '',
          expirateDate: '',
          securityCode: '',
          cardName: '',
          holderName: '',
          installments: '',
          installmentsId: ''
        }
        if (Object.keys(this.bankCardInfo).length) {
          tempBankCardInfo = JSON.parse(JSON.stringify(this.bankCardInfo))
        }
        this.bankCardForm = tempBankCardInfo
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    const _this = this
    const rules = {
      maxLength(val, checks) {
        return val.trim().length <= checks.maxLength
      },
      minLength(val, checks) {
        return val.trim().length >= checks.minLength
      },
      number(val) {
        return /^[0-9]+$/.test(val.trim())
      },
      dateCheck() {
        const inputMonth = _this.bankCardForm.month
        const inputYear = _this.bankCardForm.year
        const myDate = new Date()
        const nowMonth = myDate.getMonth() + 1
        const nowYear = myDate.getFullYear()
        if (inputYear < nowYear) return false
        if (inputYear == nowYear && inputMonth < nowMonth) return false
        return true
      }
    }

    const cardNumberCheck = (rule, value, callback) => {
      if (!rules.number(value)) {
        this.setPoint('checkout', 'error', 'view', { error: this.nl('page_js_credit_card_enter_valid_num') })
        callback(new Error(this.nl('page_js_credit_card_enter_valid_num')))
      } else if (!rules.minLength(value, { minLength: 14 }) || !rules.maxLength(value, { maxLength: 16 })) {
        this.setPoint('checkout', 'error', 'view', { error: this.nl('page_js_credit_card_enter_valid_num') })
        callback(new Error(this.nl('page_js_credit_card_enter_valid_num')))
      } else {
        callback()
      }
    }

    const expirateDateCheck = (rule, value, callback) => {
      if (!rules.dateCheck()) {
        this.setPoint('checkout', 'error', 'view', { error: this.nl('page_js_expiration_date') })
        callback(new Error(this.nl('page_js_expiration_date')))
      } else {
        callback()
      }
    }

    const securityCodeCheck = (rule, value, callback) => {
      if (!rules.number(value)) {
        this.setPoint('checkout', 'error', 'view', { error: this.nl('page_js_credit_card_enter_valid_code') })
        callback(new Error(this.nl('page_js_credit_card_enter_valid_code')))
      } else if (!rules.minLength(value, { minLength: 3 }) || !rules.maxLength(value, { maxLength: 4 })) {
        this.setPoint('checkout', 'error', 'view', { error: this.nl('page_js_credit_card_enter_valid_code') })
        callback(new Error(this.nl('page_js_credit_card_enter_valid_code')))
      } else {
        callback()
      }
    }

    const descriptor = {
      cardNumber: [
        {
          type: 'number',
          required: true,
          message: this.nl('page_js_credit_card_enter_valid_num'),
          validator: cardNumberCheck,
          trigger: 'blur'
        }
      ],
      expirateDate: [
        { type: 'string', required: true, message: this.nl('page_js_expiration_date'), validator: expirateDateCheck, trigger: 'blur' }
      ],
      securityCode: [
        {
          type: 'number',
          required: true,
          message: this.nl('page_js_credit_card_enter_valid_code'),
          validator: securityCodeCheck,
          trigger: 'blur'
        }
      ],
      holderName: [
        {
          type: 'string',
          required: true,
          message: this.nl('page_checkout_credit_card_enter_valid_name'),
          trigger: 'blur'
        }
      ],
      installmentsId: [
        {
          type: 'string',
          required: true,
          message: this.nl('page_detail_installment_dialog_header'),
          trigger: 'blur'
        }
      ]
    }

    this.validator = new Schema(descriptor)
  },
  methods: {}
}
