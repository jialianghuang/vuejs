<template>
  <div :class="{ error: rulesResult.orderSn }" class="control-group">
    <label v-if="placeholder == ''" :for="id">{{ nl('page_guest_order_input_text') }}</label>
    <input
      ref="GuestOrderInput"
      v-model="orderSn"
      @focus="inputFocus"
      @blur="inputBlur"
      @keydown="keydownEvent"
      @input="handleChange"
      :id="id"
      :name="id"
      :placeholder="placeholder"
      :tabindex="tabindex"
      type="text"
      maxlength="96"
      autocomplete="off"
      aria-label="order sn"
    />

    <div v-if="suggestItemShow && guestOptions.length" class="email-domain-box">
      <div v-for="(item, idx) in guestOptions" :key="idx" @click="suggestItemChoose(item)" class="domian-item">
        {{ item.orderSn }}
      </div>
    </div>
    <span class="help-inline">{{ rulesResult.orderSn }}</span>
  </div>
</template>

<script>
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
import { getArrayByName } from '../../assets/js/utils'

export default {
  name: 'GuestOrderInput',
  props: {
    id: {
      type: String,
      default: '_orderSn'
    },
    placeholder: {
      type: String,
      default: ''
    },
    tabindex: {
      type: [String, Number],
      default: 0
    },
    guestEmail: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orderSn: '',
      validator: null,
      rulesResult: {
        orderSn: ''
      },
      checkSuccess: false,
      guestCheckoutInfo: [],
      suggestItemShow: false,
      suggestItemShowTimer: null,
      guestOptions: [], // 匹配邮箱的建议筛选订单列表
      originGuestOptions: [] // 匹配邮箱的建议原订单列表
    }
  },
  watch: {
    guestEmail(newVal) {
      // 邮箱输入框失焦，则focus订单输入框
      if (newVal) {
        this.$refs.GuestOrderInput.focus()
      }
    }
  },
  mounted() {
    this.validator = new Schema({
      orderSn: formValidatorType.orderSn({
        required: this.nl('page_js_email_input_number'),
        validator: this.nl('page_js_emil_input_valid_number')
      })
    })
    const guestCheckoutInfo = localStorage.getItem('guestCheckoutInfo')
    if (guestCheckoutInfo) {
      this.guestCheckoutInfo = JSON.parse(guestCheckoutInfo)
    }
  },
  methods: {
    inputFocus() {
      this.rulesResult.orderSn = ''
      this.$emit('focus')
      //  根据邮件匹配订单号
      if (this.guestEmail && this.guestCheckoutInfo.length) {
        this.guestOptions = this.guestCheckoutInfo.filter((item) => item.checkoutLoginEmail == this.guestEmail)
        this.originGuestOptions = JSON.parse(JSON.stringify(this.guestOptions))
        this.suggestItemShow = true
      }
    },
    inputBlur() {
      this.orderSn = this.orderSn.trim()
      if (this.suggestItemShowTimer) clearTimeout(this.suggestItemShowTimer)
      this.suggestItemShowTimer = setTimeout(() => {
        this.suggestItemShow = false
      }, 300)
    },
    keydownEvent(e) {
      const keyCode = e.which || e.keyCode
      if (keyCode == 13) {
        this.$emit('submit')
      }
    },
    validateEvent(e) {
      this.rulesResult.orderSn = ''
      this.validator.validate(
        {
          orderSn: this.orderSn
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesResult[item.field]) {
                this.rulesResult[item.field] = item.message
              }
            })
            this.checkSuccess = false
            e.preventDefault()
            return false
          } else {
          }
          this.checkSuccess = true
        }
      )
      return this.checkSuccess
    },
    // 做模糊匹配
    handleChange(e) {
      const filterArr = getArrayByName(this.originGuestOptions, e.target.value, 'orderSn')
      this.guestOptions = JSON.parse(JSON.stringify(filterArr))
    },
    // 选择推荐订单号
    suggestItemChoose(item) {
      this.orderSn = item.orderSn
      this.suggestItemShow = false
    }
  }
}
</script>

<style lang="less" scoped></style>
