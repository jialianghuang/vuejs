<template>
  <div class="az-tips">
    <slot></slot>
    <div class="az-notice">
      <az-icon icon-class="icon-gwc-_question_" class="icon-question"></az-icon>
      <p v-if="text" v-track.view="{ common: { ec, el } }" class="az-notice-box">
        <span class="tips-box-item">{{ text }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzTips',
  props: {
    text: {
      require: true,
      type: String,
      default: ''
    },
    ec: {
      type: String,
      default: 'tips'
    },
    el: {
      type: String,
      default: 'hover-tips'
    }
  }
}
</script>

<style lang="less" scoped>
.az-tips {
  margin-top: 5px;
  .az-notice {
    position: relative;
    display: inline;
  }
  .az-notice-box {
    width: 220px;
    padding: 10px;
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, 9px);
    display: none;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    z-index: @z-index;
    &:hover {
      display: block;
    }
    &::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 50%;
      right: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-left: 12px solid #fff;
      border-top: 12px solid #fff;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    }
    &::after {
      content: '';
      position: absolute;
      top: -3px;
      left: 50%;
      right: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-left: 12px solid #fff;
      border-top: 12px solid #fff;
      box-shadow: 0 0 8px 0 #fff;
    }
  }
  &:hover {
    .az-notice-box {
      display: block;
    }
  }
}
</style>
