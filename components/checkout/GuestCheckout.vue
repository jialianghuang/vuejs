<template>
  <div class="guest-checkout">
    <block-title title="Email ADDRESS"></block-title>
    <div v-html="emailAddress" class="guest-email"></div>
  </div>
</template>

<script>
import BlockTitle from '@/components/checkout/BlockTitle'
import { mapState } from 'vuex'

export default {
  name: 'GuestCheckout',
  components: {
    BlockTitle
  },
  computed: {
    ...mapState('checkout', ['emailAddress'])
  }
}
</script>

<style lang="less" scoped>
.guest-checkout {
  .guest-email {
    margin: 19px 0 50px;
  }
}
</style>
