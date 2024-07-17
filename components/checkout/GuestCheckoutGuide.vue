<template>
  <div id="guest-guide" class="guest-checkout-guide">
    <div class="guide_info">
      <img :src="require('~/assets/images/checkout/guest_checkout_bg.png')" alt="guest register" />
      <div class="copy_word">
        <p class="line_1">{{ nl('page_checkout_complete_registration') }}</p>
        <p class="line_2">
          {{ nl('page_login_email') }}: <span class="guest_email">{{ emailAddress }}</span>
        </p>
        <p class="line_3">{{ nl('page_checkout_guest_account_ready') }}</p>
      </div>
    </div>
    <div class="form_info">
      <form id="guestGuide" v-if="!guestGuideSuc" class="guest-guide" action="null">
        <div v-if="resultMsg" class="control-group error">
          <span class="help-block">{{ resultMsg }}</span>
        </div>
        <password-input
          ref="PASSWORD"
          @submit="createAccount"
          @focus="resultMsg = ''"
          :hasForget="false"
          :tabindex="'2'"
          :rules="'type2'"
          :labelText="nl('page_regist_createpswd')"
          :readonly="true"
          :needIcon="true"
        ></password-input>

        <div class="control-group">
          <label for="date">{{ nl('page_regist_wedding_date') }}</label>
          <date-picker
            v-model="weddingDate"
            :append-to-body="false"
            :popup-style="{ top: '40px', left: '0', zIndex: 1 }"
            :disabled-date="disabledDate"
            :clearable="false"
            :editable="false"
            @keydown="keydownEvent"
            :lang="datePickerLang"
            :format="dateFormatisplay"
            :input-attr="{ 'aria-label': 'date picker' }"
            type="date"
            placeholder=""
            class="data-picker-box"
            value-type="YYYY-MM-DD"
          ></date-picker>
        </div>
        <az-button
          :loading="loading"
          :disabled="loading"
          :needIcon="false"
          @click="createAccount"
          class="btn btn-success guest-guide-btn"
          tabindex="4"
          >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_common_create_account') }}</az-button
        >
        <!-- <div v-html="nl('page_checkout_by_siging_up_agree_azazie')" class="tip-terms-and-policy"></div> -->
        <div class="tip-terms-and-policy">
          {{ nl('page_create_account_tip_text') }}
          <a :href="countryUrl('/terms-of-use')" target="_blank" class="az-link"> {{ nl('page_help_menu_terms') }}</a
          >&#44;
          <a :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))" target="_blank" class="az-link">
            {{ nl('page_help_menu_privacy') }}
          </a>
          {{ nl('page_common_and') }}
          <a
            :href="countryUrl('https://privacy.azazie.com/privacy-policy#notice-of-financial-incentive')"
            target="_blank"
            class="truevault-polaris-privacy-notice"
            style="text-decoration: underline;"
            >{{ nl('page_common_financial_incentive') }}.
          </a>
        </div>
      </form>
      <az-sub-success v-else :text1="successTxt" :linkText="linkText" :linkUrl="linkUrl" class="creat-suc"></az-sub-success>
    </div>
  </div>
</template>

<script>
import PasswordInput from '@/components/user/PasswordInput'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzSubSuccess from '@/components/common/AzSubSuccess'
import DatePicker from 'vue2-datepicker'
import { mapState } from 'vuex'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'
import 'vue2-datepicker/locale/sv'
export default {
  name: 'GuestCheckoutGuide',
  components: {
    PasswordInput,
    DatePicker,
    AzButton,
    AzSubSuccess
  },
  props: {},
  data() {
    return {
      loading: false,
      weddingDate: '',
      password: '',
      guestGuideSuc: false,
      resultMsg: '',
      successTxt: this.nl('page_checkout_guest_registered_suc'),
      linkText: this.nl('page_checkout_view_my_orders'),
      linkUrl: '/order/list'
    }
  },
  computed: {
    ...mapState('checkout', ['orderInfo', 'emailAddress']),
    datePickerLang() {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = this.language === 'se' ? 'sv' : this.language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    }
  },
  mounted() {
    // this.setPoint('createaccount', 'common', 'view')
    this.setDataLayer({
      category: 'FurtherGuestCheckout',
      action: 'view',
      label: 'OrderComplete_CreateAccount_View'
    })
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const elePD = document.getElementById('guest-guide')
      if (!elePD) return
      const screenHeight = window.screen.height
      const eleBottom = elePD.getBoundingClientRect().bottom
      if (eleBottom < screenHeight) {
        this.setPoint('createaccount', 'common', 'view')
        window.removeEventListener('scroll', this.handleScroll)
      }
    },
    disabledDate(current) {
      // Can not select days before today
      return current && current < this.$dayjs().startOf('day')
    },
    createAccount() {
      this.setPoint('createaccount', 'common', 'click')
      this.setDataLayer({
        category: 'FurtherGuestCheckout',
        action: 'click',
        label: 'OrderComplete_CreateAccount_Click'
      })
      //   创建用户
      if (this.loading) {
        return false
      }
      if (!this.$refs.PASSWORD.validateEvent()) {
        this.setPoint('createaccount', 'error', 'view', {
          error: this.$refs.PASSWORD && this.$refs.PASSWORD.rulesResult && this.$refs.PASSWORD.rulesResult.password
        })
        return false
      }
      this.password = this.$refs.PASSWORD.password
      this.creatAxios()
    },
    keydownEvent(e) {
      const keyCode = e.which || e.keyCode
      if (keyCode == 13) {
        this.createAccount()
      }
    },
    creatAxios() {
      this.loading = true
      //   wedding_date: Jun. 23, 2020
      const param = {
        email: this.emailAddress,
        wedding_date: this.weddingDate,
        password: this.password,
        name: this.emailAddress.split('@')[0]
      }
      // 调用注册接口
      this.$axios
        .$post(`/1.0/user/register`, param)
        .then((res) => {
          if (res.code == 0) {
            // 如果存在网红link id，在msg里面带上此数据
            const linkId = this.$cookie.getCookie('link_id')
            const tempMsg = {}
            if (linkId) {
              tempMsg.link_id = linkId
            }
            const storefrontLink = localStorage.getItem('STOREFRONT_LINK') || ''
            if (storefrontLink) {
              tempMsg.storefront_link = storefrontLink
            }
            this.guestGuideSuc = true
            this.setDataLayer({
              category: 'FurtherGuestCheckout',
              action: 'view',
              label: 'OrderComplete_RegisteSuccessful_View'
            })
            this.$cookie.setCookie('user_id', (res.data && (res.data.userId || res.data.user_id)) || '-1', 7, '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.setCookie('webpush_email', this.emailAddress, 7, '.' + this.APP_DOMAIN_LOWER)
            this.setPoint('signup', 'success', 'click', tempMsg)
          } else {
            this.setPoint('createaccount', 'error', 'view', { error: res.msg })
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
.guest-checkout-guide {
  margin-top: 40px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid #ccc;
  margin-bottom: 40px;
  .guide_info {
    width: 63.92%;
    position: relative;
    img {
      width: 100%;
    }
    .copy_word {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
    }
    .line_1 {
      margin-top: 85px;
      font-size: 36px;
      font-family: @font-family-600;
      color: var(--color-121212);
      line-height: 36px;
    }
    .line_2 {
      margin: 25px auto 15px;
      color: var(--color-121212);
      font-size: 24px;
      font-family: @font-family-500;
      line-height: 24px;
      span {
        font-family: @font-family-600;
      }
    }
    .line_3 {
      font-size: 13px;
      font-family: @font-family-500;
      color: var(--color-121212);
      line-height: 18px;
    }
  }
  .form_info {
    position: relative;
    width: 32.69%;
    form {
      /deep/.control-group {
        position: relative;
        margin-bottom: 25px;
        label,
        input {
          display: block;
        }
        label {
          margin: 0 0 4px;
        }
        input {
          box-sizing: border-box;
          width: 100%;
          height: 44px;
          line-height: 42px;
        }
        .help-block {
          display: block;
          margin-bottom: 9px;
          font-size: @font-size-small;
          color: #666;
        }
        .help-inline {
          color: #555;
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
            color: #f00;
          }
        }
        .data-picker-box {
          display: block;
          width: 100%;
          height: 44px;
          line-height: 42px;
          /deep/ .mx-input {
            display: block;
            height: 44px;
            line-height: 42px;
            border-radius: 0;
            border: 1px solid @border-color !important;
          }
          /deep/ .mx-icon-calendar {
            display: inline-block;
          }
        }
      }
      .guest-guide-btn {
        box-sizing: border-box;
        width: 100%;
        padding: 12px 10px;
        font-weight: 600;
        letter-spacing: 1px;
        &.disabled {
          background-color: #666;
        }
      }
    }
    .tip-terms-and-policy {
      margin-top: 25px;
      /deep/a.az-link {
        text-decoration: underline;
        color: var(--color-121212);
      }
    }
    .guest_register_success {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      color: var(--color-121212);
      img {
        width: 60px;
        margin-top: 60px;
        margin-bottom: 20px;
      }
      p {
        font-size: 13px;
        line-height: 18px;
        font-family: @font-family-500;
        color: var(--color-121212);
      }
      a {
        display: block;
        box-sizing: border-box;
        width: 184px;
        height: 40px;
        background: var(--color-121212);
        text-align: center;
        margin: 25px auto 0;
        font-size: 14px;
        font-family: @font-family-600;
        color: #fff;
        line-height: 40px;
        text-transform: uppercase;
      }
    }
  }
  .creat-suc {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
