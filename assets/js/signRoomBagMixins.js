import { mapState } from 'vuex'
import { ridUrlParam } from './utils'
export default {
  data() {
    return {
      showroomShowFlag: false,
      signShowSubmenu: false,
      showroomSubmenu: false,
      bagSubmenu: false
    }
  },
  computed: {
    ...mapState(['cartInfo', 'topCartListShow']),
    ...mapState('userInfo', ['preCartNum', 'showRoom', 'showRoomNum', 'noMoreShowRoom']),
    showroomNameComputed() {
      if (this.isLogin && typeof this.showRoom == 'object' && this.showRoom != null && this.showRoom.length > 0) {
        return this.nl('page_common_my_showroom')
      } else {
        return this.nl('page_common_createshowroom')
      }
    }
  },
  watch: {
    topCartListShow() {
      setTimeout(() => {
        this.$store.commit('setTopCartListShow', false)
      }, 3000)
    }
  },
  methods: {
    showroomClick() {
      if (this.isLogin) {
        if (this.showRoom.length > 0) {
          location.href = this.countryUrl(`/showroom/${this.showRoom[0].showroomIdDisplay}`)
        } else {
          this.createShowroom()
        }
      } else {
        // this.$parent.signLayerShow = true
        this.$store.commit('setShowSignLayer', true)
        this.$parent.signLayerSource = 'showroom'
      }
    },
    createShowroom() {
      this.$axios.$post(`/1.0/showroom`).then((res) => {
        if (res.code == 0) {
          // this.$emit('refreshUser')
          location.href = this.countryUrl(`/showroom/${res.data.showroomIdDisplay}`)
        } else {
          alert(res.msg)
        }
      })
    },
    logout() {
      const url = location.href
      const hasBackInUrl = url.indexOf('back=')
      const splitsymbol = url.substr(hasBackInUrl).indexOf('&')
      const length = splitsymbol > hasBackInUrl ? splitsymbol - hasBackInUrl : 0
      let paramBack = ''
      if (length == 0) {
        paramBack = hasBackInUrl == -1 ? 'back=' + encodeURIComponent(url) : url.substr(hasBackInUrl)
      } else {
        paramBack = hasBackInUrl == -1 ? 'back=' + encodeURIComponent(url) : url.substr(hasBackInUrl, length)
      }
      let backUrl = this.delUrlParam(paramBack.split('=')[1], 'fav_flag', true)
      backUrl = this.delUrlParam(backUrl, 'fav_color', true)
      if (this.jsKey == 'v6_category') {
        backUrl = this.setUrlParam(backUrl, 'view_switch', this.viewSwitch, true)
      }
      // 本地退出登录
      if (process.env.NODE_ENV == 'development') {
        this.$cookie.removeCookie('login_token')
      }
      paramBack = 'back=' + backUrl
      // console.log(paramBack, backUrl)
      this.$axios.$post(`/1.0/user/logout`).then((res) => {
        if (res.code == 0) {
          // 退出后清空详情页获取交期的地址cookie
          this.$cookie.removeCookie('delivery_province', '.' + this.APP_DOMAIN_LOWER)
          this.$cookie.removeCookie('delivery_province_new', '.' + this.APP_DOMAIN_LOWER)
          this.$cookie.removeCookie('user_id')
          // 如果是样衣列表，并且url中有tryOnDress，删除url中的tryOnDress和sort_by
          // 退出登录的时候对讲机（'关闭'）
          window.Intercom && window.Intercom('shutdown')
          if (this.dressType == 'sample' && url.indexOf('tryOnDress')) {
            const replaceUrl = ridUrlParam(url, ['tryOnDress', 'sort_by'])
            location.replace(replaceUrl)
          } else {
            location.reload()
          }
          // if (typeof FB == 'undefined') {
          //   ;(function() {
          //     const e = document.createElement('script')
          //     e.async = true
          //     e.src = 'https://connect.facebook.net/en_US/all.js'
          //     document.getElementById('fb-root').appendChild(e)
          //   })()
          //   window.fbAsyncInit = function() {
          //     window.FB.init({
          //       appId: this.new_facebook_app_code,
          //       cookie: true,
          //       xfbml: true,
          //       oauth: true,
          //       status: false,
          //       version: 'v2.8'
          //     })
          //     if (window.FB.getAuthResponse()) {
          //       window.FB.logout(function(response) {})
          //     }facebookLogout
          //     location.reload()
          //   }
          // } else {
          // this.facebookLogout()
          // }
        } else {
          console.log('facebook logout error')
        }
      })
    },
    googleLogout() {
      const auth2 = window.gapi.auth2.getAuthInstance()
      auth2.signOut().then(function() {
        console.log('User signed out.')
      })
    },
    facebookLogout() {
      window.fbAsyncInit = function() {
        if (window.FB.getAuthResponse()) {
          window.FB.logout(function(response) {
            console.log('User signed out.')
          })
        }
        // location.reload()
      }
      window.fbAsyncInit()
    },
    appleLogout() {},
    delUrlParam(url, ref, useDecode) {
      if (!url.includes(ref)) {
        return url
      }
      if (useDecode) {
        url = decodeURIComponent(url)
      }
      const baseUrl = url.split('#')
      const arrUrl = baseUrl[0].split('?')
      const base = arrUrl[0]
      const arrParam = arrUrl[1].split('&')
      let index = -1
      for (let i = 0; i < arrParam.length; i++) {
        const paired = arrParam[i].split('=')
        if (paired[0] == ref) {
          index = i
          break
        }
      }
      if (index != -1) {
        arrParam.splice(index, 1)
        if (arrParam.length > 0) {
          url = base + '?' + arrParam.join('&') + (baseUrl[1] ? baseUrl[1] : '')
        } else {
          url = base
        }
      }
      return useDecode ? encodeURIComponent(url) : url
    },
    setUrlParam(url, arg, argVal) {
      const evil = function(fn) {
        const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
        return new Fn('return ' + fn)()
      }
      const pattern = arg + '=([^&]*)'
      const replaceText = arg + '=' + argVal
      if (url.match(pattern)) {
        let tmp = '/(' + arg + '=)([^&]*)/gi'
        tmp = url.replace(evil(tmp), replaceText)
        return tmp
      } else {
        const baseUrl = url.split('#')
        if (url.match('[?]')) {
          url = baseUrl[0] + '&' + replaceText
        } else {
          url = baseUrl[0] + '?' + replaceText
        }
        return url + (baseUrl[1] ? baseUrl[1] : '')
      }
    },
    /**
     * 删除购物车商品
     *  */
    cartRemove(obj) {
      try {
        this.$axios.$delete(`/1.0/cart/goods/${obj.recId}`, { params: { is_real_delete: 1 } }).then((res) => {
          if (res.code == 0) {
            this.$emit('refreshCart')
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
