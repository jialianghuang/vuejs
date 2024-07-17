<template>
  <div class="fs-content">
    <form id="passwordFb" name="passwordFb" class="confirmFb">
      <p>{{ nl('page_bind_account_password_text1') }}</p>
      <p style="color: var(--color-121212);">{{ userEmail }}</p>
      <p>{{ nl('page_bind_account_password_text2') }}</p>
      <p>
        <span style="color: var(--color-121212);">{{ nl('page_bind_account_password_text3') }}</span>
        {{ nl('page_bind_account_password_text4') }}
      </p>
      <password-input ref="PASSWORD" @toForget="toForget" @submit="fbLoginSubmit" :tabindex="'1'"></password-input>
      <az-button :loading="loading" :disabled="loading" :needIcon="false" @click="fbLoginSubmit" class="btn btn-theme">
        {{ loading ? `${nl('page_order_progress_processing')}...` : 'START SHOPPING' }}
      </az-button>
    </form>
  </div>
</template>

<script>
import PasswordInput from '@/components/user/PasswordInput'
import AzButton from '@/components/az-ui/Button/AzButton'

export default {
  name: 'BindAccountPassword',
  components: {
    PasswordInput,
    AzButton
  },
  props: {
    source: {
      type: String,
      default: ''
    },
    belong: {
      type: String,
      default: 'dialog'
    },
    userEmail: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      password: '',
      loading: false
    }
  },
  mounted() {
    document.querySelector('#_password').focus()
  },
  methods: {
    toForget() {
      this.$emit('toForget')
    },
    fbLoginSubmit(e) {
      if (this.loading) {
        return false
      }
      const validateResult = !this.$refs.PASSWORD.validateEvent()
      if (validateResult) {
        return false
      }
      this.password = this.$refs.PASSWORD.password
      this.fbAxios()
    },
    fbAxios() {
      this.loading = true
      const formData = new FormData()
      formData.append('source', this.$route.query.authway)
      formData.append('email', this.userEmail)
      formData.append('password', this.password)
      formData.append('access_token', this.$cookie.getCookie('access_token'))
      this.$axios
        .$post(`/1.0/user/login/third`, formData)
        .then((res) => {
          if (res.code == 0) {
            this.setDataLayer({
              category: 'webtracking',
              action: 'signin_success',
              label: 'PC_passwordsuccess'
            })
            this.$cookie.setCookie('user_id', (res.data && (res.data.userId || res.data.user_id)) || '-1', 7, '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.setCookie('webpush_email', this.userEmail, 7, '.' + this.APP_DOMAIN_LOWER)
            // 登录后清空详情页获取交期的地址cookie
            this.$cookie.removeCookie('delivery_province', '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.removeCookie('delivery_province_new', '.' + this.APP_DOMAIN_LOWER)
            location.href = this.source
          } else {
            alert(res.msg)
            this.loading = false
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
#passwordFb {
  padding-left: 23%;
  button {
    margin-top: 15px;
    width: 318px;
  }
  /deep/ input {
    width: 318px;
  }
}
</style>
