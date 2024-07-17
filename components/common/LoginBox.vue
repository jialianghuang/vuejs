<template>
  <div>
    <template v-if="componentReady">
      <sign-layer
        v-if="showSignLayer"
        :source="signLayerSource"
        @close="handleSignLayerClose"
        @toCreateAccount="handleCreateAccountLayerShow"
        @toForget="forgetPasswordShow = true"
      ></sign-layer>
      <create-account-layer
        v-if="createAccountLayerShow"
        :source="signLayerSource"
        @close="leaveLoginEvent"
        @toSign="toSign"
      ></create-account-layer>
      <forget-password-layer
        v-if="forgetPasswordShow"
        @close="forgetPasswordShow = false"
        @toCreateAccount="handleCreateAccountLayerShow"
      ></forget-password-layer>
      <guest-login-layer
        v-if="newGuestLoginLayer"
        :source="signLayerSource"
        @close="handleNewGuestLoginLayer"
        @toCreateAccount="handleCreateAccountLayerShow"
        @toForget="forgetPasswordShow = true"
      ></guest-login-layer>
      <!-- 登录挽留弹框 -->
      <LoginLeaveDialog v-if="showLoginLeaveDialog" @closeDialog="handleLeaveDialogClose" @handleLeave="handleLeave" />
    </template>
    <AzLoading v-else-if="isLoginBoxShow" />
  </div>
</template>
<script>
/**
 *  登录注册等相关弹框
 *  异步组件
 */
import { mapState } from 'vuex'
import AzLoading from '@/components/az-ui/AzLoading'
import GuestLoginLayer from '@/components/common/GuestLoginLayer'
import SignLayer from '@/components/common/NewSignLayer'
import CreateAccountLayer from '@/components/common/NewCreateAccountLayer'
import ForgetPasswordLayer from '@/components/common/NewForgetPassword'
import LoginLeaveDialog from '@/components/user/LoginLeaveDialog'
import { loadLanguagePromise } from '@/plugins/commonAsyncData'

const languageKeys = [
  ...ForgetPasswordLayer.languageKeys,
  ...CreateAccountLayer.languageKeys,
  ...SignLayer.languageKeys,
  ...GuestLoginLayer.languageKeys,
  ...LoginLeaveDialog.languageKeys
]

export default {
  name: 'LoginBox',
  components: {
    AzLoading,
    ForgetPasswordLayer,
    CreateAccountLayer,
    SignLayer,
    GuestLoginLayer,
    LoginLeaveDialog
  },
  props: {
    newGuestLoginLayer: {
      type: Boolean,
      default: false
    },
    createAccountLayerShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      componentReady: false, // 异步多语言是否加载完成
      forgetPasswordShow: false
    }
  },
  computed: {
    ...mapState({
      showSignLayer: (state) => state.showSignLayer, // 是否展示登录弹框
      signLayerSource: (state) => state.signLayerSource, // 登录注册弹框组件操作成功的跳转
      showLoginLeaveDialog: (state) => state.account.showLoginLeaveDialog
    }),
    // 是否有
    isLoginBoxShow() {
      return (
        this.showSignLayer || this.createAccountLayerShow || this.forgetPasswordShow || this.newGuestLoginLayer || this.showLoginLeaveDialog
      )
    }
  },
  created() {
    this.loadLanguagePromise()
  },
  mounted() {
    this.handleLoginHistoryLeave()
  },
  methods: {
    toSign() {
      if (this.guestCheckoutAuthorization) {
        // 游客登录弹框
        this.handleNewGuestLoginLayer()
      } else if (!this.isLogin) {
        this.$store.commit('setShowSignLayer', true)
      }
    },
    async loadLanguagePromise() {
      try {
        this.componentReady = false
        await loadLanguagePromise({ store: this.$store, $axios: this.$axios, $loading: this.$loading }, languageKeys)
        this.componentReady = true
      } catch (e) {
        console.log(e)
      }
    },
    handleCreateAccountLayerShow() {
      this.$emit('update:createAccountLayerShow', !this.createAccountLayerShow)
    },
    // 单独处理注册页返回挽留
    handleLeaveDialogClose() {
      if (this.jsKey !== 'login') {
        this.handleCreateAccountLayerShow()
      }
    },
    // 挽留弹框离开
    handleLeave() {
      history.back()
    },
    handleNewGuestLoginLayer() {
      this.$emit('update:newGuestLoginLayer', !this.newGuestLoginLayer)
    },
    handleSignLayerClose() {
      this.$store.commit('setShowSignLayer', false)
    },
    // 用户放弃注册页面时，唤起挽回弹窗
    leaveLoginEvent() {
      // 判断是否是注册页，或者登录弹框已显示
      if (this.createAccountLayerShow || this.$route.query.hasOwnProperty('is_sign_up')) {
        if (this.jsKey !== 'login') {
          this.handleCreateAccountLayerShow()
        }
        const hasOnceLoginLeave = localStorage.getItem('has_once_login_leave')
        // 注册挽留弹框显示过则不再显示
        if (hasOnceLoginLeave) {
          return
        }
        localStorage.setItem('has_once_login_leave', true)
        this.$store.commit('account/setShowLoginLeaveDialog', true)
      }
    },
    handleLoginHistoryLeave() {
      // 如果当前浏览器历史记录有大于1个，即有后退按钮，才执行下面的操作
      if (window.history && window.history.length > 1 && window.history.pushState) {
        const hasOnceLoginLeave = localStorage.getItem('has_once_login_leave')
        if (!(hasOnceLoginLeave && this.jsKey === 'login')) window.history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.leaveLoginEvent, false)

        // 判断页面展示的场景，是否是在历史记录中通过浏览器后退/前进进入详情页，如果是，则不执行弹窗挽留监听
        window.addEventListener('pageshow', (event) => {
          // event.persisted属性为true时，表示当前文档是从往返缓存中获取(ios移动端通过浏览器的前进后退进入页面)，此时页面是不会刷新的，但是会触发 popstate。所以需要在一进来的时候把挽留弹窗关掉
          if (event.persisted) {
            this.$store.commit('account/setShowLoginLeaveDialog', false)
            window.removeEventListener('popstate', this.leaveLoginEvent, false)
          }
        })
      }
    }
  }
}
</script>
