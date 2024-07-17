<template>
  <div class="fs-content">
    <div class="fsc-left">
      <sign-form :source="source" :formTitle="nl('page_login_mail_only')" @toForget="toForget" @createShowroom="createShowroom"></sign-form>
    </div>
    <div class="fsc-right">
      <h3>{{ nl('page_login_regist') }}</h3>
      <ul>
        <li>
          <az-icon icon-class="icon-a-gift" fill="var(--color-121212)" class="login-coupon" />
          <p>{{ nl(`page_login_coupon_tips_${country.toLowerCase()}`) }}</p>
        </li>
        <li>
          <az-icon icon-class="icon-all_tick" fill="var(--color-121212)" />
          <p>{{ nl('page_login_reason1_expedite_feature') }}</p>
        </li>
        <li>
          <az-icon icon-class="icon-all_tick" fill="var(--color-121212)" />
          <p>{{ nl('page_login_reason2_check_order') }}</p>
        </li>
        <li>
          <az-icon icon-class="icon-all_tick" fill="var(--color-121212)" />
          <p v-html="nl('page_login_reason3_wish_list')"></p>
        </li>
        <li>
          <az-icon icon-class="icon-all_tick" fill="var(--color-121212)" />
          <p>{{ nl('page_login_reason4_receive_email') }}</p>
        </li>
      </ul>
      <p>{{ nl('page_login_ques') }}</p>
      <az-button :needIcon="false" @click="toCreateAccount" class="btn btn-theme btn-user-form">{{ nl('page_login_regist') }}</az-button>
      <div v-if="belong == 'page'" class="guest_block">
        <h3>{{ nl('page_guest_form_guest_checkout') }}</h3>
        <p>
          {{ nl('page_sign_in_show_first_text') }}
          <a @click="toTrack" tabindex="0" role="button">{{ nl('page_sign_in_show_second_text') }}</a>
          {{ nl('page_sign_in_show_three_text') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import userSystemMixins from '@/assets/js/userSystemMixins'
import SignForm from '@/components/user/SignForm'
import AzButton from '@/components/az-ui/Button/AzButton'
import { countryList } from '@/assets/js/euSizeMap'
export default {
  name: 'SignIn',
  languageKeys: [
    'page_login_mail_only',
    'page_login_regist',
    'page_login_reason1_expedite_feature',
    'page_login_reason2_check_order',
    'page_login_reason3_wish_list',
    'page_login_reason4_receive_email',
    'page_login_ques',
    'page_guest_form_guest_checkout',
    'page_sign_in_show_first_text',
    'page_sign_in_show_second_text',
    'page_sign_in_show_three_text',
    ...SignForm.languageKeys,
    ...countryList.map((v, i) => 'page_login_coupon_tips_' + v)
  ],
  components: {
    SignForm,
    AzButton
  },
  mixins: [userSystemMixins],
  props: {
    source: {
      type: String,
      default: ''
    },
    belong: {
      type: String,
      default: 'page'
    }
  },
  mounted() {
    if (this.$route.name === 'cart') {
      this.setDataLayer({
        action: 'view',
        category: 'PC_GuestCheckout',
        label: 'PC_GuestCheckout'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.fsc-left {
  width: 318px;
}
.fsc-right {
  padding: 0 0 3px 95px;
  width: 318px;
  border-left: solid 1px #ccc;
  p,
  li {
    line-height: 18px;
  }
  p {
    margin: 20px 0 15px;
  }
  ul {
    padding-top: 15px;
  }
  li {
    display: flex;
    margin: 10px 0 10px;
    align-items: center;
    svg {
      font-size: 12px;
      border-radius: 50%;
      &.login-coupon {
        border-radius: 0;
      }
    }
    p {
      display: inline-block;
      margin: 0;
      margin-left: 3px;
    }
    &:nth-child(1) {
      margin-top: 0;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
.guest_block {
  margin-top: 60px;
  h3 {
    font-family: @font-family-600;
    margin-bottom: 15px;
  }
  p {
    margin: 0;
    a {
      color: var(--color-121212);
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
