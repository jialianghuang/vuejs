<template>
  <div class="login-box">
    <div style="display:none">
      <h1>{{ pageTitle }}</h1>
    </div>
    <main-app :navigation="navigation">
      <div class="main-content">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div v-if="!disabledCookie" class="login-wrap">
          <div class="page-title">{{ pageTitle }}</div>
          <div :class="pageType" class="page-content">
            <template v-if="pageType == 'sign_in'">
              <sign-in v-if="!['email', 'password'].includes(from)" :source="source"></sign-in>
              <bind-account-email v-else-if="from == 'email'" :source="source"></bind-account-email>
              <bind-account-password
                v-else-if="from == 'password'"
                :source="source"
                :userEmail="email"
                @toForget="setPageUrlParam('forget_password')"
              ></bind-account-password>
            </template>
            <create-account v-else-if="pageType == 'sign_up'" :source="source" @toSignIn="setPageUrlParam('')"></create-account>
            <forget-password v-else-if="pageType == 'forget_password'" @toCreateAccount="setPageUrlParam('is_sign_up')"></forget-password>
            <reset-password v-else-if="pageType == 'reset_password'" :resetPasswordData="resetPasswordData"></reset-password>
            <track-your-order v-else-if="pageType == 'has_track'" :source="source" :from="from"></track-your-order>
            <guest-login v-else-if="pageType == 'has_guest'" :source="source" :from="from"></guest-login>
          </div>
        </div>
        <div v-else>
          <cookie-disabled></cookie-disabled>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import breadCrumb from '@/components/common/Breadcrumb'
import cookieDisabled from '@/components/user/CookieDisabled'
import SignIn from '@/components/user/SignIn'
import BindAccountEmail from '@/components/user/BindAccountEmail'
import BindAccountPassword from '@/components/user/BindAccountPassword'
import CreateAccount from '@/components/user/CreateAccount'
import ForgetPassword from '@/components/user/ForgetPassword'
import ResetPassword from '@/components/user/ResetPassword'
import TrackYourOrder from '@/components/user/TrackYourOrder'
import GuestLogin from '@/components/user/GuestLogin'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'UserLogin',
  components: {
    breadCrumb,
    cookieDisabled,
    SignIn,
    BindAccountEmail,
    BindAccountPassword,
    CreateAccount,
    ForgetPassword,
    TrackYourOrder,
    ResetPassword,
    GuestLogin,
    MainApp
  },
  data() {
    return {
      keyTitle: {
        sign_in: this.nl('page_common_sign_in'),
        has_guest: this.nl('page_common_sign_in'),
        sign_up: this.nl('page_common_create_an_account'),
        has_track: this.nl('page_common_track_your_order'),
        forget_password: this.nl('page_common_forget_password'),
        reset_password: this.nl('page_common_reset_password')
      }
    }
  },
  computed: {
    breadCrumbInfo() {
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        login: {
          title: this.keyTitle[this.pageType]
        }
      }
    },
    pageTitle() {
      return this.pageType == 'forget_password'
        ? this.nl('page_common_reset_password')
        : this.pageType == 'reset_password'
        ? this.nl('page_common_create_your_new_password')
        : this.keyTitle[this.pageType]
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const query = context.route.query
      const url = '/1.0/user/login/first-screen'
      let pageType = 'sign_in'
      const resetPasswordData = {
        email: '',
        token: ''
      }
      if (query.hasOwnProperty('is_sign_up')) {
        pageType = 'sign_up'
      } else if (query.hasOwnProperty('has_track')) {
        pageType = 'has_track'
      } else if (query.hasOwnProperty('has_guest')) {
        pageType = 'has_guest'
      } else if (query.hasOwnProperty('forget_password')) {
        pageType = 'forget_password'
      } else if (query.hasOwnProperty('reset_password')) {
        if (query.hasOwnProperty('email')) {
          resetPasswordData.email = decodeURI(query.email)
        }
        if (query.hasOwnProperty('token')) {
          resetPasswordData.token = decodeURI(query.token)
        }
        if (resetPasswordData.email && resetPasswordData.token) {
          pageType = 'reset_password'
        }
      }

      let from = ''
      if (query.hasOwnProperty('from')) {
        from = query.from
      }
      let email = ''
      if (query.hasOwnProperty('email')) {
        email = query.email
      }
      let source = '/'
      if (query.hasOwnProperty('back')) {
        source = query.back
        source = decodeURI(source)
      }

      const res = await context.$axios.$get(url)

      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (!res.data.hasOwnProperty('seoInfo')) {
        res.logType = 'rivenLogin'
        console.log(JSON.stringify(res))
      }
      if (res.data.hasLogin && pageType != 'forget_password' && pageType != 'reset_password') {
        context.redirect(302, encodeURI(source))
        return
      }
      // 一种情况是res.data.hasLogin==0 但是cookie 又是存在
      // if (getCookieByString('login_token', context.req.headers.cookie) || getCookieByString('x-token', context.req.headers.cookie)) {
      //   context.redirect(302, encodeURI(source))
      //   return
      // }
      context.store.commit('setJsKey', 'login')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        disabledCookie: res.data.disabledCookie,
        url,
        pageType,
        from,
        email,
        source,
        resetPasswordData
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
  created() {
    if (process.client) {
    }
  },
  mounted() {
    // view 打点
    if (this.from == 'email') {
      this.setDataLayer({
        action: 'view',
        category: 'PC_Login',
        label: 'PC_emailpage'
      })
    } else if (this.from == 'password') {
      this.setDataLayer({
        action: 'view',
        category: 'PC_Login',
        label: 'PC_passwordpage'
      })
    }
    this.trackSignUp(this.pageType)
  },
  methods: {
    setPageUrlParam(param) {
      if (param == 'is_sign_up') {
        location.href = this.countryUrl('/user/login?' + param + '&back=' + this.source)
      } else if (!param) {
        location.href = this.countryUrl('/user/login?back=' + this.source)
      } else {
        location.href = this.countryUrl('/user/login?' + param)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main-content {
  box-sizing: border-box;
  max-width: 1353px;
  min-width: 1263px;
  width: 100%;
  clear: both;
  padding: 0;
  margin: auto;
  padding: 0 30px 0;
}
.login-wrap {
  /deep/ .control-group {
    position: relative;
    label,
    input,
    select,
    textarea {
      display: block;
    }
    label {
      margin: 15px 0 5px;
    }
    input[type='text'],
    input[type='password'],
    input[type='email'] {
      box-sizing: border-box;
      width: 100%;
      height: 40px;
    }
    select {
      width: 100%;
      height: 28px;
      line-height: 28px;
    }
    .help-block {
      display: block;
      margin-bottom: 9px;
      font-size: @font-size-small;
      color: #666;
    }
    .help-inline {
      color: var(--color-ff0000);
      display: block;
      margin-top: 3px;
    }
    &.error {
      padding: 0;
      background: none;
      border: none;
      width: auto;
      .help-inline,
      .help-block {
        color: var(--color-ff0000);
      }
    }
    .waiting {
      position: relative;
      left: 280px;
      top: -27px;
      padding: 5px 30px 5px 0;
      height: 16px;
      background: url(~assets/images/loading_s16.gif) no-repeat 10px 4px;
    }
    .email-domain-box {
      position: absolute;
      left: 0;
      top: 63px;
      z-index: 10;
      width: 100%;
      max-height: 284px;
      font-size: 13px;
      background: #fff;
      color: var(--color-121212);
      box-sizing: border-box;
      // border: 1px solid #4b83af;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.35);
      overflow-y: scroll;
      .title {
        padding: 0 5px;
        font-family: @font-family-600, sans-serif;
        line-height: 20px;
      }
      .domian-item {
        padding: 0 5px;
        font-family: @font-family-500, sans-serif;
        line-height: 38px;
        cursor: pointer;
        span {
          color: #666;
        }
        &:hover {
          background-color: @shadow-color;
        }
      }
      &.has_placeholder {
        top: 40px;
      }
    }
    #forgotPwd {
      color: var(--color-121212);
      cursor: pointer;
      margin-top: 10px;
      display: block;
      float: right;
      border-bottom: 1px solid var(--color-121212);
      outline: none;
      &:hover {
        color: @theme;
        border-bottom: 1px solid @theme;
      }
    }
  }
  /deep/ h3 {
    text-transform: uppercase;
    font-family: @font-family-600, sans-serif;
  }
}
.page-title {
  color: var(--color-121212);
  padding: 25px 0 7px;
  border-bottom: 1px solid #666;
  letter-spacing: 1px;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
}
.page-content {
  &.has_track {
    /deep/ .fs-content {
      .fsc-left {
        .btn-user-form {
          margin-top: 30px;
        }
      }
    }
  }
  &.sign_up {
    margin-bottom: 100px;
    margin-top: 20px;
  }
  &.sign_in,
  &.has_track,
  &.has_guest {
    width: 826px;
    margin: auto;
    margin-top: 50px;
    margin-bottom: 100px;
    // padding: 50px 233px 100px 233px;
    /deep/ .fs-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
  }
  /deep/ .fs-content {
    .loading-btn {
      background: #666 !important;
    }
    .btn-user-form,
    .btn-large {
      width: 100%;
      margin-top: 15px;
    }
  }
  a.js-switch {
    cursor: pointer;
  }
}
</style>
