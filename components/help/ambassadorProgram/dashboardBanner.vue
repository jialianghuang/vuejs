<template>
  <div class="apply-now">
    <img
      v-track.viewOnce="{
        common: {
          ec: 'Ambassador Dashboard',
          el: 'Banner'
        }
      }"
      :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/03/bb/0e0cd58190e7b3ea65117bf4976703bb.jpg')"
      alt="apply"
    />
    <p>{{ nl('page_ambassador_dashboard_banner_tip') }}</p>
    <h3>{{ nl('page_ambassador_dashboard_banner_title') }}</h3>
    <az-button
      @click="handleApply"
      v-track.click="{
        common: {
          ec: 'Ambassador Dashboard',
          el: 'Apply Now'
        }
      }"
      class="btn btn-theme"
    >
      {{ nl('page_ambassador_apply_now') }}
    </az-button>
    <toast-popup ref="toastPopup" :content="toastContent"></toast-popup>
    <apply-form ref="applyForm"></apply-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ToastPopup from '@/components/help/ambassadorProgram/ToastPopup'
import ApplyForm from '@/components/help/ambassadorProgram/ApplyForm'
import AzButton from '@/components/az-ui/Button/AzButton'
export default {
  components: {
    ToastPopup,
    ApplyForm,
    AzButton
  },
  data() {
    return {
      toastContent: ''
    }
  },
  computed: {
    ...mapState('userInfo', ['ambassadorData'])
  },
  methods: {
    /* 点击apply now打开弹窗 */
    handleApply() {
      if (this.ambassadorData.ambassadorStatus === 'Unprocessed') {
        // 申请审核中
        this.toastContent = this.nl(`page_ambassador_popup_tip2${this.country !== 'US' ? `_${this.country.toLowerCase()}` : ''}`)
        this.$refs.toastPopup.toogleShow()
      } else {
        // 打开表单填写
        this.$refs.applyForm.toogleShow()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.apply-now {
  position: relative;
  margin-top: 20px;
  width: 100%;
  height: 360px;
  img {
    width: 100%;
  }
  & > p {
    position: absolute;
    bottom: 138px;
    left: 0;
    width: 100%;
    font-family: @font-Ivy-Mode-400;
    font-size: 28px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #ffffff;
    text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.6);
  }
  & > h3 {
    position: absolute;
    bottom: 76px;
    left: 0;
    width: 100%;
    font-family: @font-Ivy-Mode-700;
    font-size: 54px;
    text-align: center;
    letter-spacing: 0.06em;
    color: #ffffff;
    text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.6);
  }
  .btn {
    position: absolute;
    bottom: 24px;
    left: 50%;
    margin-left: -100px;
    width: 200px;
    height: 40px;
    font-weight: 600;
  }
}
</style>
