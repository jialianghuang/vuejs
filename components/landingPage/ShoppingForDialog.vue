<template>
  <div v-if="visible" v-track.view.click="{ common: getBiParams('dbwelcome', 'popup') }" class="shopping-for-dialog">
    <div class="shopping-for-dialog-main">
      <button @click="clickClose" aria-label="Close button" class="btn-close">
        <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
      </button>
      <special-package @getCoupons="handleGetCoupons" scene="popup"></special-package>
    </div>
  </div>
</template>
<script>
import SpecialPackage from './SpecialPackage'

/**
 * I'm shopping for a ...弹框组件
 * 用在david bridal需求的welcomme落地页
 *
 * 本组件弹框内容跟页面中的special package内容一致
 */
export default {
  name: 'ShoppingForDialog',
  components: {
    SpecialPackage
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {
    visible(e) {
      const m = function(e) {
        e.preventDefault()
      }
      if (e) {
        this.$cookie.setCookie('shoppingForDialogOpened', 1)
        // 禁止页面滚动
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', m, false)
      } else {
        // 放开页面滚动
        document.body.style.overflow = ''
        document.removeEventListener('touchmove', m, false)
      }
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      return {
        ec,
        el
      }
    },
    clickClose() {
      // this.$emit('update:visible', false)
      this.$store.commit('setShowShoppingForDialog', false)
    },
    handleGetCoupons() {
      this.clickClose()
      // 触发后续操作
      this.$emit('subOperations')
    }
  }
}
</script>
<style lang="less" scoped>
.shopping-for-dialog {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 13;
  &-main {
    padding: 54px 80px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    text-align: center;
    .btn-close {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 13px;
      height: auto;
      width: auto;
      border: none;
      padding: 0px;
      line-height: 13px;
      background: none;
    }
  }
}
</style>
