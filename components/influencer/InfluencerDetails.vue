<template>
  <div class="influencer-details">
    <div class="influencer-details-form-item">
      <span class="form-item-label">{{ nl('page_influencer_landing_page') }}</span>
      <az-input v-model="landingPageUrl" :errorMsg="urlErrorMsg" @blur="urlBlurValidate" placeholder="https://www.azazie.com/"></az-input>
    </div>
    <div class="influencer-details-form-item">
      <span class="form-item-label">{{ nl('page_influencer_copy_link') }}</span>
      <div class="tracking-links">
        <div @click="clickGenerate('instagram')" class="tracking-link">
          <az-icon icon-class="icon-Instagram"></az-icon>{{ nl('page_ambassador_form_instagram') }}
        </div>
        <div @click="clickGenerate('tiktok')" class="tracking-link">
          <az-icon icon-class="icon-tiktok"></az-icon>{{ nl('page_ambassador_form_tiktok') }}
        </div>
        <div @click="clickGenerate('youtube')" class="tracking-link">
          <az-icon icon-class="icon-youtube"></az-icon>{{ nl('page_ambassador_form_youtube') }}
        </div>
        <div @click="clickGenerate('others')" class="tracking-link">
          <az-icon icon-class="icon-Share"></az-icon>{{ nl('page_influencer_other_channel') }}
        </div>
      </div>
    </div>
    <div class="influencer-details-form-item">
      <template v-if="influencerInfo.payAccount || (paypalSaved && paypalAccount)">
        <span class="form-item-label">{{ nl('page_ambassador_dashboard_my_paypal') }}: {{ paypalAccount }}</span>
        <p v-html="nl('page_influencer_paypal_tips')" class="paypal-tips"></p>
      </template>
      <template v-else>
        <span class="form-item-label">{{ nl('page_ambassador_dashboard_my_paypal') }}</span>
        <div class="input-box">
          <az-input
            v-model="paypalAccount"
            :errorMsg="paypalErrorMsg"
            @blur="paypalBlurValidate"
            :placeholder="nl('page_ambassador_my_paypal_placeholder')"
          ></az-input>
          <az-button @click="clickSavePaypal" class="btn btn-hollow">{{ nl('page_common_save') }}</az-button>
        </div>
      </template>
    </div>
    <my-dashboard :dashboardData="dashboardData"></my-dashboard>
    <az-toast ref="toast" :message="toastMsg" :duration="2000"></az-toast>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import AzInput from '@/components/az-ui/AzInput'
import AzToast from '@/components/az-ui/AzToast'
import MyDashboard from '@/components/influencer/MyDashboard'

export default {
  components: {
    AzButton,
    AzInput,
    AzToast,
    MyDashboard
  },
  props: {
    influencerInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    dashboardData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      landingPageUrl: '',
      urlErrorMsg: '',
      paypalAccount: '',
      paypalErrorMsg: '',
      toastMsg: '',
      paypalSaved: false
    }
  },
  mounted() {
    this.landingPageUrl = this.influencerInfo.destinationUrl || ''
    this.paypalAccount = this.influencerInfo.payAccount || ''
  },
  methods: {
    urlBlurValidate() {
      if (this.landingPageUrl) {
        // 去除？后面内容
        this.landingPageUrl = this.landingPageUrl.split('?')[0]
        const tempHost = 'https://www.azazie.com'
        const tempUrl = this.landingPageUrl.substr(0, tempHost.length)
        if (tempHost !== tempUrl) {
          this.urlErrorMsg = this.nl('page_influencer_validate_host')
          return
        }
        if (this.landingPageUrl.includes('/store/') || this.landingPageUrl.endsWith('/store')) {
          this.urlErrorMsg = this.nl('page_influencer_cannot_store')
          return
        }
        this.urlErrorMsg = ''
      } else {
        this.urlErrorMsg = this.nl('page_please_enter_valid_value')
      }
    },
    paypalBlurValidate() {
      if (this.paypalAccount) this.paypalErrorMsg = ''
    },
    clickGenerate(e) {
      this.urlBlurValidate()
      if (this.urlErrorMsg) return

      const params = {
        url: this.landingPageUrl,
        utm_source: e
      }
      // 生成渠道短连接
      this.$axios.$post('/1.0/referrer/short-link', params).then((res) => {
        if (res.code === 0) {
          this.$copyText(res.data.shortUrl).then(
            (e) => {
              this.toastMsg = this.nl('page_common_copied')
              this.$refs.toast.show()
            },
            (e) => {
              console.log('copy fail!')
            }
          )
        } else {
          alert(this.nl(res.msg))
        }
      })
    },
    clickSavePaypal() {
      if (!this.paypalAccount) {
        this.paypalErrorMsg = this.nl('page_please_enter_valid_value')
        return
      }
      const params = {
        pay_account: this.paypalAccount,
        referrer_type: 'influencer'
      }
      // 保存paypal账户接口
      this.$axios.$post('/1.0/referrer/collect-pay-account', params).then((res) => {
        if (res.code === 0) {
          this.paypalSaved = true
          this.toastMsg = this.nl('page_common_saved')
          this.$refs.toast.show()
        } else {
          alert(this.nl(res.msg))
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.influencer-details {
  &-form-item {
    margin-top: 20px;
    .form-item-label {
      font-size: 13px;
      margin-bottom: 6px;
      display: block;
      .az-input {
        margin-top: 0px;
      }
    }
    .paypal-tips {
      font-size: 13px;
      color: #999;
    }
    .input-box {
      display: flex;
      justify-content: space-between;
      .btn {
        min-width: 100px;
        margin-left: 12px;
      }
      .az-input {
        flex: 1;
      }
      /deep/ .az-input-box {
        margin: 0px;
      }
    }
    .tracking {
      &-links {
        display: flex;
        align-items: center;
      }
      &-link {
        min-width: 120px;
        height: 30px;
        padding: 5px 10px;
        background-color: @bg-color;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        font-size: 13px;
        font-family: @font-family-600;
        cursor: pointer;
        color: var(--color-121212);
        .az-icon {
          margin-right: 5px;
          font-size: 24px;
          fill: var(--color-121212);
        }
      }
    }
  }
}
</style>
