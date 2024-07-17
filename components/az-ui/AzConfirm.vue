<template>
  <az-popup-layer
    :zIndex="12"
    @close="closeAlert()"
    :width="'265px'"
    :showCloseIcon="showCloseIcon"
    :class="{ 'no-title': !showCloseIcon }"
    height="auto"
  >
    <div class="alert-content">
      <p v-html="confirmContent"></p>
      <div class="btn-content">
        <az-button @click="closeAlert()" v-if="showCancel" class="btn btn-default btn-hollow cancle-btn">
          {{ cancleTxt || nl('page_common_cancel') }}
        </az-button>
        <az-button
          @click="closeAlert('yes')"
          v-track.view.click="{
            common: getBiParams(ec, el)
          }"
          class="btn btn-default"
        >
          {{ continueTxt || nl('page_common_continue') }}
        </az-button>
      </div>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
export default {
  name: 'AzConfirm',
  components: {
    AzPopupLayer,
    AzButton
  },
  props: {
    showCancel: {
      type: Boolean,
      default: false
    },
    confirmContent: {
      type: String,
      default: ''
    },
    cancleTxt: {
      type: String,
      default: ''
    },
    continueTxt: {
      type: String,
      default: ''
    },
    // 是否只能通过点击确认按钮让弹框消失
    onlyConfirmClose: {
      type: Boolean,
      default: false
    },
    // 是否展示关闭按钮
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    ec: {
      type: String,
      default: ''
    },
    el: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec: ec || 'confirm',
        el: el || 'confirm'
      }
      return obj
    },
    closeAlert(eventType) {
      if (this.onlyConfirmClose) {
        if (eventType) {
          this.$emit('closeConfirmDialog', eventType)
        }
      } else {
        this.$emit('closeConfirmDialog', eventType)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.no-title {
  /deep/ .az-popup-box {
    padding: 40px 40px 40px !important;
    .btn {
      height: 45px;
      width: 230px !important;
    }
    .btn-content {
      margin-top: 15px;
    }
  }
}
/deep/ .az-popup-box {
  padding: 58px 25px 40px !important;
  min-width: unset;
}
.btn {
  cursor: pointer;
}
.alert-content {
  width: 100%;
  height: fit-content;
  background: #ffffff;
  //   padding-bottom: 30px;
  text-align: center;
  img {
    width: 280px;
    height: 125px;
    display: block;
    margin: auto;
  }
  .btn-content {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    .btn {
      width: 100%;
    }
  }
  .bgf {
    background: #ffffff;
    border: 1px solid var(--color-cccccc);
    color: var(--color-121212);
  }
  .cancle-btn {
    margin-right: 15px;
  }
}
</style>
