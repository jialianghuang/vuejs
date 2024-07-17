<template>
  <div class="sign-up-for-email">
    <main-app :navigation="navigation">
      <div class="sign-up-for-email-content clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content">
          <h1 class="common-title">{{ currentMenuTitle }}</h1>
          <div v-if="isSuccess" class="success">
            <img class="success_img" src="~assets/images/cancel_order/ok-icon.png" alt="ok" />
            <div class="word">{{ nl('page_email_added') }}</div>
          </div>
          <template v-else>
            <p class="sign-desc">
              {{ nl('page_sign_up_for_mail_desc') }}&nbsp;<a href="/blog/" target="_blank">{{ nl('page_common_blog') }}</a
              >{{ nl('page_sign_up_for_mail_unsubscribe') }}
            </p>
            <form id="sign_email" onsubmit="return false">
              <div id="email_check" class="clearfix">
                <div id="email_subscribe" :class="{ error: rulesResult.email }">
                  <input
                    id="_email"
                    ref="email"
                    v-model="formData.email"
                    @focus="resetInput('email', 'sameData')"
                    :placeholder="nl('page_login_email')"
                    type="text"
                    name="email"
                    maxlength="96"
                    tabindex="1"
                    autocomplete="off"
                  />
                  <span class="help-inline">{{ rulesResult.email }}</span>
                </div>
                <div id="confirm_email" :class="{ error: rulesResult.confirmEmail || rulesResult.sameData }">
                  <input
                    id="_confirm"
                    ref="confirmEmail"
                    v-model="formData.confirmEmail"
                    @focus="resetInput('confirmEmail', 'sameData')"
                    :placeholder="nl('page_sign_up_for_mail_confirm')"
                    type="text"
                    name="confirm"
                    maxlength="40"
                    tabindex="2"
                    autocomplete="off"
                  />
                  <span class="help-inline">{{ rulesResult.confirmEmail || rulesResult.sameData }}</span>
                </div>
              </div>
              <az-button
                id="email_submit"
                :loading="loading"
                :disabled="loading"
                :needIcon="false"
                @click="handleSubmit"
                class="btn btn-default btn-submit  btn-theme btn-large"
                tabindex="4"
                >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_common_just_submit') }}</az-button
              >
            </form>
          </template>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import HelpMenu from '@/components/common/HelpMenu'
import AzButton from '@/components/az-ui/Button/AzButton'
import Schema from 'async-validator'
import formValidatorType from '@/assets/js/formValidatorType'

export default {
  name: 'SignUpForEmail',
  components: {
    MainApp,
    backToTop,
    HelpMenu,
    AzButton
  },
  data() {
    return {
      currentMenuTitle: this.nl('page_header_sign_up_for_mail'),
      accountMenu: {},
      formData: {
        email: '',
        confirmEmail: '',
        sameData: []
      },
      rulesResult: {
        email: '',
        confirmEmail: '',
        sameData: ''
      },
      loading: false,
      isSuccess: false,
      uploadList: []
    }
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/sign-up-for-email`)
      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }
      context.store.commit('setJsKey', 'sign_up_for_email')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {}
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
  mounted() {
    const descriptor = {
      email: formValidatorType.email({
        required: this.nl('page_js_provide_missing_information'),
        validator: this.nl('page_js_enter_valid_add')
      }),
      confirmEmail: formValidatorType.email({
        required: this.nl('page_js_provide_missing_information'),
        validator: this.nl('page_js_enter_valid_add')
      }),
      sameData: formValidatorType.sameData({
        validator: this.nl('page_js_enter_same_valid_add')
      })
    }
    this.validator = new Schema(descriptor)
  },
  methods: {
    resetInput(...res) {
      if (res && res.length) {
        res.forEach((name) => {
          this.rulesResult[name] = ''
        })
        return false
      }
      this.rulesResult = {
        email: '',
        confirmEmail: '',
        sameData: ''
      }
    },
    handleSubmit(e) {
      this.resetInput()
      this.formData.sameData = [(this.formData.email || '').trim(), (this.formData.confirmEmail || '').trim()]
      this.validator.validate(
        {
          ...this.formData
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesResult[item.field]) {
                this.rulesResult[item.field] = item.message
              }
            })
            e.preventDefault()
            return false
          }
          this.studentDiscountAxios()
        }
      )
    },
    studentDiscountAxios() {
      this.loading = true
      this.$axios
        .$post(`/1.0/help/sign-up-for-email`, { email: this.formData.email, confirm: this.formData.confirmEmail })
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            this.isSuccess = true
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.sign-up-for-email-content {
  .content {
    .sign-desc {
      margin-top: 20px;
      a {
        color: @theme;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
.success {
  margin-top: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-right: 10px;
  }
  .word {
    display: inline-block;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    color: var(--color-121212);
  }
  .sign-p {
    margin-top: 14px;
    padding-bottom: 0px;
  }
}
#sign_email {
  display: block;
  width: 367px;
  margin: 0 auto;
  // display: flex;
  #email_subscribe {
    margin-top: 40px;
  }
  #confirm_email {
    margin-top: 20px;
  }
  label {
    display: block;
    margin-bottom: 4px;
    color: var(--color-121212);
    font-size: 13px;
    line-height: normal;
    font-family: @font-family-500, sans-serif;
  }
  input {
    // width: 367px;
    width: calc(100% - 17px);
    height: 18px;
    display: block;
    line-height: 18px;
    padding: 10px 5px 10px 10px;
    background: #fff;
    border: 1px solid var(--color-cccccc);
    &::placeholder {
      color: var(--color-999999);
    }
    &:hover,
    &:focus,
    &:active {
      border-color: var(--color-121212);
    }
  }
  #email_submit {
    width: 184px;
    margin-top: 20px;
    font-size: 14px;
    font-family: @font-family-600;
  }
  .error-note {
    padding-bottom: 0px;
    color: #f00;
    width: 425px;
  }
  .error {
    input {
      border-color: #f00;
      //margin-bottom: 8px;
      background: #fff;
    }
    .help-inline {
      color: #f00;
      white-space: nowrap;
    }
  }
  .help-inline {
    color: #555;
    display: block;
    margin-top: 3px;
    white-space: nowrap;
    color: #f00;
  }
}
</style>
