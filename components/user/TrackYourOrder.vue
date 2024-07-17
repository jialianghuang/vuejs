<template>
  <div class="fs-content">
    <div class="fsc-left track-order-box">
      <track-form :source="source"></track-form>
    </div>
    <div v-if="!['email', 'password'].includes(from)" class="fsc-right">
      <p class="m-t-0 m-b-20">{{ nl('page_track_your_order_title') }}</p>
      <sign-form :source="source" @toForget="toForget" :formTitle="nl('page_track_your_order_form_title')"></sign-form>
    </div>
  </div>
</template>

<script>
import userSystemMixins from '@/assets/js/userSystemMixins'
import SignForm from '@/components/user/SignForm'
import TrackForm from '@/components/user/TrackForm'
import { mapState } from 'vuex'
export default {
  name: 'TrackYourOrder',
  components: {
    TrackForm,
    SignForm
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
    document.querySelector('.track-order-email').focus()
    // document.querySelector('#_orderSn').focus()
  }
}
</script>

<style lang="less" scoped>
.fsc-left {
  width: 318px;
}
.fsc-right {
  padding: 0 0 0px 95px;
  width: 318px;
  border-left: solid 1px #ccc;
}
.m-t-0 {
  margin-top: 0px;
}
.m-t-25 {
  margin-top: 20px;
}
.m-b-20 {
  margin-bottom: 20px;
}
/deep/ .fb-login-box {
  h3 {
    margin-top: 30px;
  }
  .fb-login {
    margin-top: 10px;
    margin-bottom: 0;
  }
}
</style>
