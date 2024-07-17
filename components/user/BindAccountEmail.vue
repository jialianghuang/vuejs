<template>
  <div class="fs-content">
    <form id="emailFb" name="emailFb" class="confirmFb">
      <p>{{ nl('page_bind_account_email_text1') }}&nbsp;{{ nl('page_bind_account_email_text2') }}</p>
      <email-input ref="EMAIL" @submit="fbLoginSubmit" @focus="resultMsg = ''" :tabindex="'1'"></email-input>
      <az-button :loading="loading" :disabled="loading" :needIcon="false" @click="fbLoginSubmit" class="btn btn-theme">
        {{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_register_reg_submit') }}
      </az-button>
    </form>
  </div>
</template>

<script>
import EmailInput from '@/components/user/EmailInput'
import AzButton from '@/components/az-ui/Button/AzButton'

export default {
  name: 'BindAccountEmail',
  components: {
    EmailInput,
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
    }
  },
  data() {
    return {
      email: '',
      loading: false,
      resultMsg: ''
    }
  },
  methods: {
    getHref(url, key, value) {
      let hrefUrl = url
      if (hrefUrl.indexOf('?') > 0) {
        hrefUrl = hrefUrl + '&' + key + '=' + value
      } else {
        hrefUrl = hrefUrl + '?' + key + '=' + value
      }
      return hrefUrl
    },
    fbLoginSubmit() {
      if (this.loading) {
        return false
      }
      const validateResult = !this.$refs.EMAIL.validateEvent()
      if (validateResult) {
        return false
      }
      this.email = this.$refs.EMAIL.email
      this.fbAxios()
    },
    fbAxios() {
      this.loading = true
      const formData = new FormData()
      formData.append('source', this.$route.query.authway)
      formData.append('email', this.email)
      formData.append('access_token', this.$cookie.getCookie('access_token'))
      this.retentionReject()
      this.$axios
        .$post(`/1.0/user/login/third`, formData)
        .then((res) => {
          if (res.code == 0) {
            this.setDataLayer({
              category: 'webtracking',
              action: 'signin_success',
              label: 'PC_emailsuccess'
            })
            this.$cookie.setCookie('user_id', (res.data && (res.data.userId || res.data.user_id)) || '-1', 7, '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.setCookie('webpush_email', this.email, 7, '.' + this.APP_DOMAIN_LOWER)
            // 登录后清空详情页获取交期的地址cookie
            this.$cookie.removeCookie('delivery_province', '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.removeCookie('delivery_province_new', '.' + this.APP_DOMAIN_LOWER)
            location.href = this.source
          } else if (res.code == 30003) {
            let url = '/user/login?from=password&authway=' + this.$route.query.authway + '&email=' + this.email
            url = this.getHref(url, 'back', this.source)
            location.href = url
          } else {
            // window.location.reload()
            alert(res.msg)
            this.loading = false
            this.resultMsg = res.msg
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
#emailFb {
  width: 100%;
  p {
    font-size: 24px;
    color: var(--color-121212);
    margin-bottom: 35px;
  }
  div.control-group,
  button {
    margin-left: 170px;
    width: 318px;
    margin-top: 15px;
  }
  // /deep/ input {
  //   width: 276px;
  // }
}
</style>
