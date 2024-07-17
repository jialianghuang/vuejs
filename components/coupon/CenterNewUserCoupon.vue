<template>
  <az-dialog :visible="showNewUserCoupon" @onClose="close()" v-track.view="getBiParams('newpopup')" class="popup-center-new-user">
    <NewUserCoupon @setNewUserStep="setNewUserStep" />
  </az-dialog>
</template>

<script>
/**
 * AZWEB-21824 新客弹窗替换coupon wheel 居中显示
 */
import AzDialog from '@/components/az-ui/AzDialog'
import NewUserCoupon from '@/components/coupon/NewUserCoupon'
import { mapState } from 'vuex'

export default {
  name: 'CenterNewUserCoupon',
  languageKeys: NewUserCoupon.languageKeys,
  components: {
    AzDialog,
    NewUserCoupon
  },
  data() {
    return {
      newUserStep: 1
    }
  },
  computed: {
    ...mapState({
      showNewUserCoupon: (state) => state.showNewUserCoupon
    })
  },
  methods: {
    getBiParams(el) {
      if (process.server) return
      return {
        common: {
          ec: 'newcustomer',
          el
        }
      }
    },
    setNewUserStep(newUserStep) {
      this.newUserStep = newUserStep
    },
    close() {
      if (this.newUserStep == 2) {
        this.setPoint('newcustomer', 'submitpopupclose', 'click')
      } else if (this.newUserStep == 3) {
        this.setPoint('newcustomer', 'closecouponpopup', 'click')
      }
      localStorage.setItem('new_user_close', true)
      this.$store.commit('setShowNewUserCoupon', false)
      this.hasLucked = false
      this.$emit('handle-box', false)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .az-dialog-content {
  background: var(--color-f2e9e6);
  width: auto;
  padding: 0;
  .btn-close {
    background: transparent !important;
  }
}
</style>
