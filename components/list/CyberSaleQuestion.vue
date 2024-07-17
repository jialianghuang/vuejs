<template>
  <div class="icon-question-box">
    <az-icon icon-class="icon-icon-question-red" class="icon-question"></az-icon>
    <div class="icon-question-des">
      <div v-html="desc" class="icon-question-main"></div>
    </div>
  </div>
</template>
<script>
/**
 * 问号及鼠标浮动问号的气泡描述
 * 现在已经有AzQuestionIcon组件，但是样式不符本需求
 * 后续有类似需求，可在此组件和AzQuestionIcon中选择
 * TODO:建议统一问号及气泡样式风格
 */
export default {
  props: {
    desc: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="less" scoped>
.icon-question {
  width: 12px;
  height: 12px;
  fill: @theme-color;
  cursor: pointer;
  display: block;
  &-box {
    width: 12px;
    height: 12px;
    margin-left: 6px;
    position: relative;
    display: inline-block;
    &:hover {
      .icon-question-des {
        display: block;
      }
    }
  }
  &-des {
    display: none;
    padding-top: 8px;
    position: absolute;
    top: 12px;
    right: -26px;
    z-index: 2;
  }
  &-main {
    width: max-content;
    min-width: 150px;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    color: var(--color-121212);
    text-transform: none;
    box-shadow: 0px 0px 5px 0px #eee;
    font-family: @font-family-500;
    &::after {
      content: '';
      width: 10px;
      height: 10px;
      border-top: 1px solid #eee;
      border-right: 1px solid #eee;
      position: absolute;
      top: 3px;
      right: 26px;
      transform: rotate(-45deg);
      background: #fff;
    }
  }
}
</style>
