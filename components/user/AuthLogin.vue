<template>
  <div class="fb-login-box">
    <h3>
      <span>{{ nl('page_common_or') }} </span>
      {{ nl('page_login_way') }}
    </h3>
    <div class="auth-login-content">
      <a
        v-for="(item, index) in authLoginWays"
        :key="index"
        @click="handleLogin(item.name)"
        :aria-label="item.name"
        :id="item.id"
        tabindex="0"
        role="button"
        href="javascript:void(0);"
      >
        <az-icon :iconClass="item.icon" :class="item.class" class="icon-auth-login"></az-icon
      ></a>
    </div>
  </div>
</template>

<script>
import trackNebulas from '@/assets/js/point'
import { strToUpper } from '@/assets/js/utils'
export default {
  name: 'AuthLogin',
  languageKeys: ['page_common_or', 'page_login_way'],
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // fbEntranceAvailable: '',
      authLoginWays: [
        { id: 'btn-google', name: 'google', icon: 'iconsign_in_google', class: 'g-signin2' },
        { id: 'btn-facebook', name: 'facebook', icon: 'iconsign_in_facebook' },
        { id: 'btn-apple', name: 'apple', icon: 'iconsign_in_apple' }
      ]
    }
  },
  mounted() {
    // if (!this.fbEntranceAvailable) this.getLoginInfo()
  },
  methods: {
    handleLogin(name) {
      this.authLoginPointer(name)
      switch (name) {
        case 'google':
          this.googleLogin()
          break
        case 'facebook':
          this.facebookLogin()
          break
        case 'apple':
          this.appleLogin()
          break
      }
      // ga4打点
      this.setGA4DataLayer({
        event: 'ga4Event',
        event_name: 'login',
        event_parameters: {
          method: strToUpper(name)
        }
      })
    },
    googleLogin() {
      const _this = this
      if (!window.gapi) {
        // 监控到 window.gapi 有不存在的情况，先 return false 掉，防止报错
        return false
      }
      window.gapi.load('auth2', function() {
        /* Ready. Make a call to gapi.auth2.init or some other API */
        const GoogleAuth = window.gapi.auth2.init({
          client_id: '331630312007-33bo44m31snvb187hrst3n91rt0pmd6r.apps.googleusercontent.com',
          scope: 'profile',
          fetch_basic_profile: true
        })

        GoogleAuth.signIn({
          scope: 'profile email'
        })
          .then((googleUser) => {
            const idToken = googleUser && googleUser.getAuthResponse().id_token
            idToken && _this.authLogin('google', idToken)
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
    facebookLogin() {
      const _this = this
      if (!window.FB) {
        // 监控到 window.FB 有不存在的情况，先 return false 掉，防止报错
        return false
      }
      window.FB.init({
        appId: this.new_facebook_app_code,
        cookie: true,
        xfbml: true,
        oauth: true,
        status: false
      })
      window.FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          response.authResponse && _this.authLogin('facebook', response.authResponse.accessToken)
        } else {
          window.FB.login(function(response) {
            if (response.status === 'connected') {
              response.authResponse && _this.authLogin('facebook', response.authResponse.accessToken)
            }
          })
        }
      })
    },
    async appleLogin() {
      const _this = this
      window.AppleID.auth.init({
        clientId: 'com.azazie.www',
        scope: 'email',
        redirectURI: window.location.origin,
        state: 'initial',
        usePopup: true // or false defaults to false
      })
      try {
        const response = await window.AppleID.auth.signIn()
        response.authorization && _this.authLogin('apple', response.authorization.id_token)
      } catch (error) {
        // handle error.
      }
    },
    authLogin(name, accessToken) {
      this.$cookie.removeCookie('access_token')
      this.$axios
        .$post(`/1.0/user/login/third`, {
          source: name,
          access_token: accessToken
        })
        .then((res) => {
          if (res.code == 0) {
            // 登录后清空详情页获取交期的地址cookie
            this.$cookie.removeCookie('delivery_province', '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.removeCookie('delivery_province_new', '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.setCookie('user_id', (res.data && (res.data.userId || res.data.user_id)) || '-1', 7, '.' + this.APP_DOMAIN_LOWER)
            this.reloadFunc()
          } else if (res.code == 30001 || res.code == 30002) {
            this.$cookie.setCookie('access_token', accessToken, 1, '.' + this.APP_DOMAIN_LOWER)
            let url = '/user/login?from=email&authway=' + name
            url = this.getHref(url, 'back', this.source)
            location.href = url
          } else if (res.code == 30003) {
            this.$cookie.setCookie('access_token', accessToken, 1, '.' + this.APP_DOMAIN_LOWER)
            let url = '/user/login?from=password&authway=' + name + '&email=' + res.data.email
            url = this.getHref(url, 'back', this.source)
            location.href = url
          } else {
            alert(res.msg)
            // window.location.reload()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    authLoginPointer(name) {
      trackNebulas(
        this,
        'event',
        {
          ec: 'signin',
          el: name,
          ea: 'click',
          lgt: new Date().getTime()
        },
        '/user/login'
      )
    },
    getHref(url, key, value) {
      let hrefUrl = url
      if (hrefUrl.indexOf('?') > 0) {
        hrefUrl = hrefUrl + '&' + key + '=' + value
      } else {
        hrefUrl = hrefUrl + '?' + key + '=' + value
      }
      return hrefUrl
    },
    // 登录成功之后页面跳转
    reloadFunc() {
      // 订单追踪页登录之后，跳转订单列表页
      if (this.$route.query.hasOwnProperty('has_track')) {
        location.href = this.countryUrl('/order/list')
        return
      }
      location.href = this.source
    }
  }
}
</script>

<style lang="less" scoped>
// .fb-login {
//   margin: 15px 0 45px;
//   height: 22px;
//   overflow: hidden;
//   margin-top: 30px;
// }

.fb-login-box {
  margin-top: 25px;
  h3 {
    text-transform: uppercase;
    font-family: @font-family-600;
  }
  .bottom {
    font-size: 13px;
  }
  .auth-login-content {
    margin-top: 15px;
    a {
      &:not(:last-child) {
        margin-right: 23px;
      }
      .icon-auth-login {
        cursor: pointer;
        font-size: 35px;
      }
    }
  }
}
</style>
