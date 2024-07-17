<template>
  <div class="fs-content">
    <div v-if="!['email', 'password'].includes(from)" class="fsc-left">
      <sign-form ref="SIGN" :source="source" @toForget="toForget" :formTitle="nl('page_login_mail_only')"></sign-form>
    </div>
    <div :class="{ 'has-border-top': $route.name != 'checkout' }" class="fsc-right">
      <guest-form :source="source" @toCreateAccount="toCreateAccount" @close="$emit('close')"></guest-form>
    </div>
  </div>
</template>

<script>
import userSystemMixins from '@/assets/js/userSystemMixins'
import SignForm from '@/components/user/SignForm'
import GuestForm from '@/components/user/GuestForm'
import { mapState } from 'vuex'
export default {
  name: 'GuestLogin',
  languageKeys: [...SignForm.languageKeys, ...GuestForm.languageKeys],
  components: {
    SignForm,
    GuestForm
  },
  mixins: [userSystemMixins],
  props: {
    source: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('userInfo', ['noMoreShowRoom'])
  },
  mounted() {
    if (this.$route.name === 'cart' && this.guestCheckoutAuthorization) {
      this.setDataLayer({
        action: 'view',
        category: 'PC_GuestCheckout',
        label: 'PCA_GuestCheckout_View'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.fsc-left {
  width: 276px;
  margin-bottom: 15px;
}
.fsc-right {
  p,
  li {
    line-height: 16px;
  }
  p {
    margin: 18px 0 15px;
  }
  ul {
    padding-top: 17px;
  }
  li {
    margin: 3px 0 4px;
    &:before {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: url(~assets/images/a_sprite_l_20190128.png) no-repeat -227px 0;
      content: '';
      margin: 4px 9px 0 2px;
      vertical-align: top;
    }
  }
  .btn-large {
    margin-top: 13px;
  }
  &.has-border-top {
    border-top: 1px solid #d8d8d8;
    padding-top: 25px;
    margin-top: 25px;
  }
}
</style>
