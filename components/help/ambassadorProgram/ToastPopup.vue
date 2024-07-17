<template>
  <!-- 校园大使落地页ambassadorProgram引用，提示弹窗 -->
  <div v-if="showToast" class="ambassdor-toast-popup">
    <div>
      <az-icon @click="toogleShow" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
      <p v-html="content"></p>
      <az-button @click="toogleShow" v-if="showBtn" class="btn btn-theme">{{ btnText }}</az-button>
    </div>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
export default {
  components: {
    AzButton
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    showBtn: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showToast: false
    }
  },
  methods: {
    toogleShow() {
      this.showToast = !this.showToast
      this.$emit('toogleShowToast', this.showToast)
      if (this.showToast && !document.body.classList.contains('body-overflow-hidden')) {
        document.body.classList.add('body-overflow-hidden')
      } else if (!this.showToast) {
        document.body.classList.remove('body-overflow-hidden')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ambassdor-toast-popup {
  position: fixed;
  z-index: @popuy-z-index;
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  & > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 440px;
    padding: 40px;
    background: #fff;
    .icon {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 15px;
      height: 15px;
      fill: var(--color-121212);
      cursor: pointer;
    }
    p {
      font-family: @font-family-500;
      font-size: 14px;
      line-height: 19px;
      color: var(--color-121212);
      text-align: center;
    }
    /deep/ a {
      color: @theme;
    }
  }
  .btn {
    display: block;
    margin: auto;
    width: 190px;
    height: 40px;
    margin-top: 20px;
    font-weight: 600;
  }
}
</style>
