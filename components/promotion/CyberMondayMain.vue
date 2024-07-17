<template>
  <div class="cyber-main">
    <svg aria-hidden="true" style="position: absolute; width: 0px; height: 0px; overflow: hidden;">
      <symbol id="list_ok" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 1170 1024">
        <path
          d="M1146.374778 19.049365L1117.204937 3.005952a33.545318 33.545318 0 0 0-39.379287 8.750953L393.792863 722.04255 183.770003 525.146118a35.00381 35.00381 0 0 0-23.335874-10.209444 37.920794 37.920794 0 0 0-24.794365 10.209444l-125.430319 119.596351a35.00381 35.00381 0 0 0 0 48.130239l329.619211 320.868259A33.545318 33.545318 0 0 0 364.623021 1023.950411h100.635954a32.086826 32.086826 0 0 0 27.71135-13.126428L1166.793668 52.594683a33.545318 33.545318 0 0 0-20.41889-33.545318z"
          p-id="4896"
        ></path>
      </symbol>
    </svg>
    <img
      v-show="submitSuccess"
      :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/2f/e4/8c8d8efc2974384f9a2564d754722fe4.jpg')"
      class="img-bgc"
      alt="cyber"
    />
    <img
      v-show="!submitSuccess"
      :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/d5/8e/f8b8d7b5606b45ee141bab8a3a36d58e.jpg')"
      class="img-bgc"
      alt="cyber"
    />
    <div v-if="!submitSuccess" class="cyber-content cyber-email">
      <div class="cyber-title">{{ nl('page_cyber_monday_main_text1') }}</div>
      <div class="cyber-tips">{{ nl('page_cyber_monday_main_text') }}</div>
      <div class="cyber-input">
        <email-input
          ref="EMAIL"
          @submit="newEmaliSubmit"
          :tabindex="'2'"
          :placeholder="'Your email'"
          :requiredTxt="nl('page_login_enter_email')"
          :validatorTxt="nl('page_email_enter_valid')"
        ></email-input>
        <az-button :loading="loading" :disabled="loading" :needIcon="false" @click="newEmaliSubmit" class="btn btn-default" tabindex="4">{{
          loading ? `${nl('page_order_progress_processing')}...` : nl('page_footer_sign_up')
        }}</az-button>
      </div>
      <div class="cyber-more">
        <span @click="submitMore = !submitMore" :class="{ selected: submitMore }" class="submit-more"
          ><az-icon v-if="submitMore" icon-class="list_ok" class="icon-ok"></az-icon
        ></span>
        <span>{{ nl('page_cyber_monday_main_text2') }}</span>
      </div>
    </div>
    <div v-else class="cyber-content cyber-success">
      <img src="~assets/images/promotion/cyber_success.png" alt="cyber" />
      <div class="cyber-title">{{ nl('page_cyber_monday_main_text3') }}</div>
      <div class="cyber-tips">{{ nl('page_cyber_monday_main_text4') }}</div>
      <az-button :needIcon="false" @click="jumpList" class="btn btn-default" tabindex="4">
        {{ nl('page_cyber_monday_main_text5') }}
      </az-button>
    </div>
  </div>
</template>

<script>
import EmailInput from '@/components/user/EmailInput'
import AzButton from '@/components/az-ui/Button/AzButton'

export default {
  name: 'CyberMondayMain',
  components: {
    EmailInput,
    AzButton
  },
  data() {
    return {
      submitSuccess: false,
      loading: false,
      email: '',
      submitMore: true
    }
  },
  methods: {
    setBiAnalysis(el, ea) {
      this.buryPoint(this, 'event', {
        ec: 'cyber_monday',
        el,
        ea
      })
    },
    newEmaliSubmit() {
      let hasError = false
      if (this.loading) {
        return false
      }
      this.setBiAnalysis('sign_up', 'click')
      this.email = this.$refs.EMAIL.email
      // this.$refs[...].validateEvent() 返回false 检验未通过
      if (!this.$refs.EMAIL.validateEvent()) {
        hasError = true
      }
      if (hasError) {
        return false
      }
      this.addCyberMondayEmail()
    },
    addCyberMondayEmail() {
      this.loading = true
      this.retentionReject()
      this.$axios
        .$post('/1.0/email/add-cyber-monday-email', {
          subscribeType: this.submitMore ? 1 : 0,
          email: this.email
        })
        .then((res) => {
          if (res.code === 0) {
            this.submitSuccess = true
            this.$nextTick(() => {
              this.setBiAnalysis('success', 'view')
            })
          } else {
            alert(res.msg)
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    jumpList() {
      this.setBiAnalysis('get_your_cart_ready', 'click')
      location.href = this.countryUrl('/all/bridesmaids-bridal-party')
    }
  }
}
</script>

<style lang="less" scoped>
.cyber-main {
  color: #fff;
  position: relative;
  margin-top: 40px;
  .img-bgc {
    width: 100%;
    vertical-align: middle;
  }
  .cyber-content {
    width: 511px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
  button {
    height: 40px;
    padding-left: 0;
    padding-right: 0;
    background-color: var(--color-121212);
    border-color: var(--color-121212);
    font-family: @font-family-600;
    &:hover,
    &:focus,
    &:active,
    &.active {
      background-color: var(--color-121212);
      border-color: var(--color-121212);
    }
  }
}

.cyber-email {
  top: 164 / 370 * 100%;
  color: var(--color-121212);
  .cyber-title {
    font-family: @font-family-600;
    font-size: 24px;
    text-transform: uppercase;
  }
  .cyber-tips {
    margin-top: 5px;
    margin-bottom: 15px;
  }
  /deep/ .cyber-input {
    display: flex;
    .control-group {
      width: 390px;
      text-align: left;
      position: relative;
    }
    input {
      width: 390px;
      height: 40px;
      box-sizing: border-box;
      padding-left: 10px;
      background-color: #fff;
      border-color: #eee;
      &::placeholder {
        color: var(--color-cccccc);
      }
    }
    button {
      width: 120px;
    }
    .help-inline {
      line-height: 18px;
      margin-top: 5px;
      display: block;
      color: var(--color-ff0000);
    }
    .email-domain-box {
      position: absolute;
      left: 0;
      top: 40px;
      z-index: 10;
      width: 390px;
      max-height: 284px;
      font-size: 13px;
      background: #fff;
      color: var(--color-121212);
      text-indent: 10px;
      box-sizing: border-box;
      border: 1px solid #ffffff;
      .title {
        padding: 0 5px;
        font-family: @font-family-600, sans-serif;
        line-height: 20px;
      }
      .domian-item {
        padding: 0 5px;
        font-family: @font-family-500, sans-serif;
        line-height: 22px;
        cursor: pointer;
        span {
          color: #666;
        }
        &:hover {
          color: #fff;
          span {
            color: #fff;
          }
          background-color: #4b83af;
        }
      }
    }
  }
  .cyber-more {
    margin-top: 5px;
    font-size: 12px;
    text-align: left;
    .submit-more {
      width: 9px;
      height: 9px;
      border: 1px solid #eee;
      background-color: #fff;
      display: inline-block;
      box-sizing: border-box;
      position: relative;
      margin-right: 4px;
      cursor: pointer;
    }
    .icon-ok {
      position: absolute;
      left: 1px;
    }
    /deep/ .az-icon {
      vertical-align: top;
      width: 6px;
      height: 6px;
    }
  }
}
.cyber-success {
  top: 73 / 370 * 100%;
  color: var(--color-121212);
  img {
    width: 64px;
  }
  .cyber-title {
    font-family: @font-family-600;
    font-size: 28px;
    margin-top: 20px;
  }
  .cyber-tips {
    margin: 5px 0 30px;
  }
  button {
    width: 310px;
    font-size: 14px;
  }
}
</style>
