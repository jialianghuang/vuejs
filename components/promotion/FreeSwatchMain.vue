<template>
  <div>
    <div class="free-swatch-main">
      <img
        v-if="!submitSuccess"
        :data-src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/ae/e1/95f9f43e5709dede669396321f07aee1.jpeg')"
        :src="require('~/assets/images/default_img.jpg')"
        class="lazyload img-bg"
        alt="free swatch"
      />
      <img
        v-else
        :data-src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/7e/1c/856366beaec4fe37c73d0b5a26387e1c.jpeg')"
        :src="require('~/assets/images/default_img.jpg')"
        class="lazyload img-bgc"
        alt="free swatch success"
      />
      <template v-if="!submitSuccess">
        <div class="title">{{ nl('page_free_swatch_main_text1') }}</div>
        <div class="desc">
          {{ nl('page_free_swatch_main_text2') }}
          {{ nl('page_free_swatch_main_text3') }}
        </div>
      </template>
      <!-- 邮箱提交成功显示code -->
      <div v-else class="free-swatch-content free-swatch-success">
        <div class="free-swatch-title">{{ nl('page_instagram_free_swatch_suc_title') }}</div>
        <div class="free-swatch-tips">{{ nl('page_free_swatch_main_text4') }}</div>
        <div :class="{ 'copy-ing': isCopyIng }" class="free-code">
          {{ code }}
        </div>
        <az-button
          :needIcon="false"
          v-clipboard:copy="code"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="btn btn-default"
          tabindex="4"
        >
          {{ btnText }}
        </az-button>
        <p class="free-tip-desc">{{ nl('page_common_color_card_desc') }}</p>
      </div>
    </div>
    <div v-if="!submitSuccess" class="free-swatch-interest-subscribe">
      <az-interest-subscribe
        :isEvent="true"
        :resResult="rulesRes.email"
        :show-continue="emailDomainError"
        @subscribeSubmit="addFreeSwatchEmail"
        @initError="initEmailCheckDomain"
      ></az-interest-subscribe>
    </div>
  </div>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
import AzInterestSubscribe from '@/components/common/AzInterestSubscribe'
import checkEmailDomain from '@/assets/js/checkEmailDomain'

export default {
  name: 'FreeSwatchMain',
  components: {
    AzButton,
    AzInterestSubscribe
  },
  mixins: [checkEmailDomain],
  data() {
    return {
      submitSuccess: false,
      loading: false,
      email: '',
      isError: false,
      code: '',
      isCopyIng: false,
      btnText: '',
      isSubmited: false,
      showMb: '',
      // 邮箱订阅data
      validator: '',
      rulesRes: {
        email: ''
      },
      roles: [],
      roleKey: '',
      role: ''
    }
  },
  mounted() {
    this.setBiAnalysis('sign_up', 'view')
    this.btnText = this.nl('page_free_swatch_get_yours_now')
    // 邮件订阅初始化
    const rules = {
      email: formValidatorType.email({ required: this.nl('page_js_enter_valid_add'), validator: this.nl('page_email_enter_valid') })
    }
    this.validator = new Schema(rules)
    this.getUserRoles()
    this.setPoint('customer', 'identity', 'view')
  },
  methods: {
    focus() {
      this.isError = false
    },
    onCopy() {
      this.setBiAnalysis('copied_successfully', 'click')
      location.href = this.countryUrl('/swatches?from=image')
    },
    onError() {
      console.log('onError')
    },
    setBiAnalysis(el, ea) {
      this.buryPoint(this, 'event', {
        ec: 'free swatch',
        el,
        ea,
        dp: '/promotion/free-swatch'
      })
    },
    newEmaliSubmit(e) {
      if (this.loading) {
        return false
      }
      this.setBiAnalysis('sign_up', 'click')
      this.addFreeSwatchEmail(e)
    },
    addFreeSwatchEmail(e) {
      this.loading = true
      this.retentionReject()
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rulesRes.email = ''
      }
      this.$axios
        .$post('/1.0/email/add-free-swatch-email', {
          categories: e.categories,
          event_date: e.event_date,
          email: e.email,
          is_check_email_suffix: this.needCheckEmailDomain
        })
        .then((res) => {
          if (res.code == 100210) {
            this.emailDomainError = true
            this.rulesRes.email = res.msg
            return
          }
          if (res.code === 0) {
            if (!res.data.couponCode) {
              this.submitSuccess = false
              this.loading = false
              return
            }
            this.$cookie.setCookie('UnLoginEmail', e.email, 30, '.' + this.APP_DOMAIN_LOWER) // 设置未登录邮箱缓存
            this.submitSuccess = true
            this.setBiAnalysis('success', 'view')
            this.code = res.data.couponCode
            this.trackGA4NewEmail(e.email, 'top_3_swatch_coupon_subscribe', e.role)
          } else {
            console.log('error')
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 邮箱订阅
    // 下拉选择修改获取对应的数据
    handleSelectChange(e) {
      this.roleKey = e.key
      this.role = e.name
      this.setPoint('customer', 'identity', 'click')
    },
    getUserRoles() {
      this.retentionReject()
      // 获取订阅用户身份接口
      this.$axios.$get('/1.0/email/subscribe-user-role').then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.roles = res.data.map((ele, idx) => {
            return {
              name: ele,
              key: idx
            }
          })
        }
      })
    },
    subscribeSubmit() {
      this.validator.validate(
        {
          email: this.email
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesRes[item.field]) {
                this.rulesRes[item.field] = item.message
              }
            })
            return false
          }

          this.newEmaliSubmit({
            email: this.email,
            role: this.role
          })
        }
      )
    },
    onFocus() {
      this.rulesRes.email = ''
      this.$emit('init-error')
    }
  }
}
</script>

<style lang="less" scoped>
.free-swatch-main {
  color: var(--color-121212);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
    max-width: 1600px;
    color: var(--color-121212);
    text-align: center;
    font-family: @font-Ivy-Mode-400;
    font-size: 48px;
    position: absolute;
    top: 49px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    letter-spacing: 0.96px;
  }
  .desc {
    max-width: 900px;
    color: var(--color-121212);
    text-align: center;
    font-family: @font-family-500;
    font-size: 22px;
    position: absolute;
    top: 130px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .img-bg {
    width: 100%;
    height: 240px;
    vertical-align: middle;
    object-fit: cover !important;
  }
  .img-bgc {
    width: 100%;
    height: 420px;
    vertical-align: middle;
    object-fit: cover !important;
  }
  .free-swatch-content {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    z-index: 1;
    text-align: center;
    width: 960px;
    height: 100%;
    box-sizing: border-box;
    background: var(--color-f1e9e6);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
}

.free-swatch-interest-subscribe {
  position: relative;
  width: 100%;
}

.flex-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
}

.free-swatch-email {
  .free-swatch-title {
    color: var(--color-121212);
    text-align: center;
    font-family: @font-Ivy-Mode-400;
    font-size: 48px;
    letter-spacing: 0.96px;
  }
  .free-swatch-tips {
    margin: 15px 0 0;
    width: 780px;
    color: var(--color-121212);
    text-align: center;
    font-family: @font-family-500;
    font-size: 22px;
    line-height: 29.922px;
    letter-spacing: 1.32px;
  }
}

.free-swatch-subscription {
  .row {
    margin: 30px 0 0;
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .az-select-main {
    width: 200px;
    height: 50px;
    padding: 14px 10px;
    color: var(--color-121212);
    font-family: @font-family-500;
    font-size: 16px;
    border: 1px solid @border-color;
    background: var(--color-f1e9e6);
    .placeholder {
      color: var(--color-121212);
    }
    > .az-icon {
      width: 9px;
    }
  }
  .input-box {
    margin-left: 10px;
    .input-item {
      position: relative;
      &::after {
        content: '*';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: @theme-color;
      }
    }
    input {
      width: 340px;
      height: 50px;
      box-sizing: border-box;
      border: 1px solid @border-color;
      background: var(--color-f1e9e6);
      padding: 14px 10px;
      font-size: 16px;
      color: var(--color-121212);
      font-family: @font-family-500;
      outline: none;
      &:focus {
        border: solid 2px @theme;
        padding: 14px 10px;
      }
      &.error {
        border: solid 1px #f00;
        background: var(--color-f9f9f9);
        padding: 14px 10px;
      }
      &::placeholder {
        color: var(--color-121212);
      }
    }
    input::-ms-clear {
      display: none;
    }
  }
  button {
    margin: 0 0 15px;
    padding: 0;
    width: 550px;
    height: 50px;
    overflow: hidden;
    line-height: 40px;
    border: none;
    color: #ffffff;
    background-color: var(--color-121212);
    text-transform: uppercase;
    font-family: @font-family-600;
    font-size: 18px;
    letter-spacing: 1.047px;
  }
  .error-tip {
    color: #f00;
    font-style: normal;
    text-transform: none;
    text-align: left;
    position: absolute;
  }
}

.free-swatch-success {
  width: 100% !important;
  background: unset !important;
  .duigou {
    width: 45px;
    height: 45px;
    margin-top: 27px;
    vertical-align: middle;
    svg {
      fill: var(--color-121212);
    }
  }
  .free-swatch-title {
    color: var(--color-121212);
    text-align: center;
    font-family: @font-Ivy-Mode-400;
    font-size: 48px;
    letter-spacing: 0.96px;
  }
  .free-code {
    width: 335px;
    height: 60px;
    background: #fffdee;
    border: 1px solid var(--color-121212);
    text-align: center;
    line-height: 60px;
    margin: 20px auto;
    font-size: 24px;
    font-family: @font-family-500;
    color: @gray-darker;
  }
  .free-tip-desc {
    margin-top: 20px;
    color: var(--color-666666);
    font-family: @font-family-500;
    font-size: 18px;
  }
  .free-swatch-tips {
    margin-top: 20px;
    color: var(--color-121212);
    font-family: @font-family-500;
    font-size: 22px;
  }
  button {
    width: 335px;
    height: 45px;
    font-size: 14px;
    font-family: @font-family-600;
    color: #ffffff;
    background: var(--color-121212);
    border: none;
    &:hover,
    &:focus,
    &:active,
    &.active {
      background-color: var(--color-1e1e1e);
      border-color: var(--color-1e1e1e);
    }
  }
}

.privacy-policy-box {
  color: var(--color-121212);
  text-align: center;
  font-family: @font-family-500;
  font-size: 16px;
  line-height: 24px;
  max-width: 536px;
  a {
    color: var(--color-121212);
    .l {
      text-transform: uppercase;
      text-decoration: underline;
    }
    span {
      text-transform: none;
      text-decoration: none;
    }
  }
}

@media screen and (max-width: 1900px) {
  .img-bgc {
    height: 500px !important;
  }
}
</style>
