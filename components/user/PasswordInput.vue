<template>
  <div :class="{ error: rulesResult.password }" class="control-group">
    <label v-if="placeholder == ''" :for="id"><span v-if="needIcon" class="must">*</span>{{ nl(labelText) }}</label>
    <input
      ref="PASSWORD"
      v-model="password"
      @focus="inputFocus"
      @keydown="keydownEvent"
      :id="id"
      :name="id"
      :placeholder="placeholder"
      :tabindex="tabindex"
      :readonly="!readonly ? false : 'readonly'"
      type="password"
      maxlength="40"
      autocomplete="off"
    />
    <span class="help-inline">{{ rulesResult.password }}</span>
    <a
      id="forgotPwd"
      v-if="hasForget"
      @click="toForget"
      :tabindex="tabindex"
      role="button"
      href="javascript:void(0);"
      title="Forgot Password"
      >{{ nl('page_login_forgot') }}</a
    >
  </div>
</template>

<script>
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
export default {
  name: 'PasswordInput',
  languageKeys: ['page_login_forgot', 'page_password_input_label_text', 'page_login_enter_password', 'page_register_pwd_minimum_5'],
  props: {
    id: {
      type: String,
      default: '_password'
    },
    name: {
      type: String,
      default: 'password'
    },
    placeholder: {
      type: String,
      default: ''
    },
    needConfirm: {
      type: Boolean,
      default: false
    },
    hasForget: {
      type: Boolean,
      default: true
    },
    tabindex: {
      type: [String, Number],
      default: 0
    },
    rules: {
      type: String,
      default: 'type1'
    },
    labelText: {
      type: String,
      default: 'page_password_input_label_text'
    },
    requiredText: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    needIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      password: '',
      validator: null,
      rulesResult: {
        password: ''
      },
      checkSuccess: false
    }
  },
  mounted() {
    const txt = this.requiredText == '' ? this.nl('page_login_enter_password') : this.requiredText
    if (this.rules == 'type1') {
      this.validator = new Schema({
        password: formValidatorType.password({ required: txt })
      })
    } else if (this.rules == 'type2') {
      this.validator = new Schema({
        password: [...formValidatorType.password({ required: txt }), { min: 5, message: this.nl('page_register_pwd_minimum_5') }]
      })
    }
  },
  methods: {
    inputFocus() {
      this.rulesResult.password = ''
      this.$refs.PASSWORD.removeAttribute('readonly')
      this.$emit('focus')
    },
    keydownEvent(e) {
      const keyCode = e.which || e.keyCode
      if (keyCode == 13) {
        this.$emit('submit')
      }
    },
    validateEvent(e) {
      this.rulesResult.password = ''
      this.validator.validate(
        {
          password: this.password
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
    toForget() {
      this.buryPoint(this, 'event', {
        ec: 'signin',
        el: 'forgotpassword',
        ea: 'click'
      })
      this.$emit('toForget')
    }
  }
}
</script>

<style lang="less" scoped>
.must {
  color: var(--color-121212);
}
</style>
