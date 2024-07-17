<template>
  <az-overlay :z-index="17" :alwaysShowOverLayProp="true">
    <div class="leave-dialog">
      <div class="leave-dialog-content">
        <div class="title-box">
          <div class="title1">{{ nl('page_login_leave_title') }}</div>
        </div>
        <div class="content-box">
          <div v-if="country != 'MX'" class="content-box-item">
            <div class="icon-wrap">
              <az-icon icon-class="icon-a-FreeStandardShipping" class="freeship-icon"></az-icon>
            </div>
            <p class="icon-title">{{ nl('page_product_selling_point_free_shipping') }}</p>
            <p class="icon-des">{{ nl('page_login_leave_speical_offer') }}</p>
          </div>
          <div class="content-box-item">
            <div class="icon-wrap">
              <az-icon icon-class="icon-a-free-gift" class="freeship-icon"></az-icon>
            </div>
            <p class="icon-title">{{ nl('page_common_free_gift') }}</p>
            <p class="icon-des">{{ nl('page_login_leave_free_swatches') }}</p>
          </div>
        </div>
        <div class="btn-box">
          <az-button
            v-track.view.click="{ common: getBiParams('sign_in', `leave`) }"
            @click="handleLeave"
            :text="nl('page_common_leave')"
            text-color="var(--color-121212)"
            class="btn-leave"
          ></az-button>
          <az-button
            v-track.view.click="{ common: getBiParams('sign_in', `continue`) }"
            :text="nl('page_common_continue')"
            @click="closeDialog"
            class="btn-continue"
          ></az-button>
        </div>
      </div>
    </div>
  </az-overlay>
</template>

<script>
import { mapState } from 'vuex'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import AzButton from '@/components/az-ui/AzButton'
/* 注册页面离开显示挽留弹框 */
export default {
  name: 'LoginLeaveDialog',
  languageKeys: [
    'page_common_leave',
    'page_login_leave_title',
    'page_product_selling_point_free_shipping',
    'page_login_leave_speical_offer',
    'page_common_free_gift',
    'page_login_leave_free_swatches',
    'page_common_continue'
  ],
  components: { AzOverlay, AzButton },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState('product', ['findSimilarData'])
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$store.commit('account/setShowLoginLeaveDialog', false)
      this.$emit('closeDialog')
    },
    handleLeave() {
      this.$store.commit('account/setShowLoginLeaveDialog', false)
      this.$emit('handleLeave')
    },
    getBiParams(ec, el, item) {
      if (process.server) return
      return {
        ec,
        el
      }
    }
  }
}
</script>

<style lang="less" scoped>
.leave-dialog {
  position: relative;
  background: #ffffff;
  height: max-content;
  max-height: calc(~'100% - 44px');
  width: 640px;
  overflow-y: auto;
  padding: 40px;
  box-sizing: border-box;
  .leave-dialog-content {
    .title-box {
      font-size: 18px;
      line-height: 25px;
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-600;
    }
    .content-box {
      display: flex;
      justify-content: center;
      margin-top: 25px;
      margin-bottom: 25px;
      .content-box-item {
        text-align: center;
        &:nth-child(2) {
          margin-left: 100px;
          .icon-wrap svg {
            margin-right: -5px;
          }
        }
        .icon-wrap {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #fbf1f2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          svg {
            font-size: 45px;
          }
        }
        .icon-title {
          font-size: 16px;
          font-family: @font-family-600;
          margin-top: 8px;
          margin-bottom: 2px;
        }
      }
    }
    .btn-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .btn-leave,
      .btn-continue {
        width: calc((100% - 25px) / 2);
        height: 46px;
        line-height: 46px;
        text-transform: uppercase;
        font-size: 14px;
        font-family: @font-family-600;
        border: 1px solid @theme-color;
        box-sizing: border-box;
      }
      .btn-leave {
        border: 1px solid #ccc;
        background: #fff !important;
        color: var(--color-121212);
      }
      .btn-continue {
      }
    }
  }
}
</style>
