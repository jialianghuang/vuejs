<template>
  <div :class="{ error: rulesResult.email || parentErrorText }" class="control-group email">
    <label v-if="placeholder == ''" :for="id"><span v-if="needIcon" class="must">*</span>{{ nl(labelText) }}</label>
    <input
      ref="EMAIL"
      v-model="email"
      @focus="emailFocus"
      @blur="emailBlur"
      @keydown="keydownEvent"
      :name="id"
      :placeholder="placeholder"
      :tabindex="tabindex"
      :readonly="!readonly ? false : 'readonly'"
      :class="className"
      type="email"
      maxlength="96"
      autocomplete="off"
      aria-label="email"
    />
    <span v-if="innerRequired" class="must-inner">*</span>
    <AzEmailDomain :show="emailDomainShow" :origin-email="email" @domain-handler="(value) => ((email = value), emailBlur())" />
    <span v-show="emailLoading" class="waiting"> </span>
    <span class="help-inline">{{ rulesResult.email || parentErrorText }}</span>
  </div>
</template>

<script>
import formValidatorType from '@/assets/js/formValidatorType'
// import emailDomainJs from '@/assets/js/emailDomain'
import Schema from 'async-validator'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
import checkEmailDomain from '@/assets/js/checkEmailDomain'
export default {
  name: 'EmailInput',
  languageKeys: [
    'page_login_select_email_type',
    'page_email_input_label_text',
    'page_login_enter_email',
    'page_login_email_invalid',
    'page_login_check_email_format',
    ...AzEmailDomain.languageKeys
  ],
  components: { AzEmailDomain },
  mixins: [checkEmailDomain],
  props: {
    id: {
      type: String,
      default: '_email'
    },
    className: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    tabindex: {
      type: [String, Number],
      default: 0
    },
    needCheck: {
      type: Boolean,
      default: false
    },
    labelText: {
      type: String,
      default: 'page_email_input_label_text'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    needIcon: {
      type: Boolean,
      default: false
    },
    requiredTxt: {
      type: String,
      default: ''
    },
    validatorTxt: {
      type: String,
      default: ''
    },
    // 输入框内是否展示必填星号
    innerRequired: {
      type: Boolean,
      default: false
    },
    autoFocus: {
      type: Boolean,
      default: true
    },
    showDomain: {
      type: Boolean,
      default: true
    },
    parentErrorText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      emailLoading: false,
      email: '',
      validator: null,
      rulesResult: {
        email: ''
      },
      checkSuccess: false
    }
  },
  mounted() {
    const reqTxt = this.requiredTxt ? this.requiredTxt : this.nl('page_login_enter_email')
    const valTxt = this.validatorTxt ? this.validatorTxt : this.nl('page_login_email_invalid')
    this.validator = new Schema({
      email: formValidatorType.email({ required: reqTxt, validator: valTxt })
    })
    if (this.autoFocus) {
      this.$refs.EMAIL.focus()
    }
  },
  methods: {
    emailFocus() {
      this.initEmailCheckDomain()
      this.rulesResult.email = ''
      this.emailDomainShow = true
      this.$refs.EMAIL && this.$refs.EMAIL.removeAttribute('readonly')
      this.$emit('focus')
    },
    emailBlur() {
      this.onBlurEmail()
      this.email = this.email.trim()
      this.$emit('emailChange', this.email)
      if (this.emailDomainTimer) clearTimeout(this.emailDomainTimer)
      this.emailDomainTimer = setTimeout(() => {
        this.emailDomainShow = false
      }, 300)
      if (this.needCheck) {
        this.checkEvent()
      }
    },
    keydownEvent(e) {
      const keyCode = e.which || e.keyCode
      if (keyCode == 13) {
        this.email = this.email.trim()
        this.$emit('emailChange', this.email)
        this.$emit('submit')
      }
    },
    validateEvent(e) {
      this.rulesResult.email = ''
      this.validator.validate(
        {
          email: this.email
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
          }
          this.checkSuccess = true
        }
      )
      return this.checkSuccess
    },
    checkEvent() {
      if (!this.validateEvent()) {
        this.rulesResult.email = ''
        return false
      }
      if (this.emailLoading && !this.validateEvent(false)) {
        return false
      }
      this.emailLoading = true
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rulesResult.email = ''
      }
      const emailValidator = new Schema({
        email: formValidatorType.email({
          required: this.nl('page_login_enter_email'),
          validator: this.nl('page_login_check_email_format')
        })
      })
      emailValidator.validate({ email: this.email }, (errors, fields) => {
        if (errors) {
          errors.map((item) => {
            if (!this.rulesResult[item.field]) {
              this.rulesResult[item.field] = item.message
            }
          })
          this.emailLoading = false
          return false
        }
        this.retentionReject()
        this.$axios
          .$get(`/1.0/user/email?email=${this.email}&is_check_email_suffix=${this.needCheckEmailDomain}`)
          .then((res) => {
            this.emailLoading = false
            if (res.code == 100210) {
              this.emailDomainError = true
              this.rulesResult.email = res.msg
              return
            }
            this.$emit('checkEmail', res.data)
            if (res.code != 0 && this.$parent.resultMsg == '') {
              this.rulesResult.email = res.msg
            }
          })
          .catch((error) => {
            this.emailLoading = false
            console.log(error)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.control-group {
  position: relative;
}
.must,
.must-inner {
  color: @theme-color;
}
.must-inner {
  height: 18px;
  line-height: 18px;
  position: absolute;
  right: 10px;
  top: 11px;
}
</style>
