<template>
  <div class="hover-tips">
    <az-icon :icon-class="questionClass" class="tip-icon"></az-icon>
    <div class="text_tip">
      <em></em>
      <span></span>
      <div
        v-html="popTips"
        v-track.view="{
          common: getBiParams(ec, el)
        }"
        class="text_content"
      ></div>
    </div>
  </div>
</template>
<script>
/** hover问号显示tips文案 */
export default {
  name: 'AzQuestionIcon',
  props: {
    popTips: {
      type: String,
      default: ''
    },
    ec: {
      required: true,
      type: String,
      default: 'az-question'
    },
    el: {
      required: true,
      type: String,
      default: 'az-question'
    },
    // 问号icon的icon-class
    questionClass: {
      type: String,
      default: 'icon-gwc-_question_'
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server || !ec || !el) return
      const obj = {
        ec,
        el
      }
      return obj
    }
  }
}
</script>
<style lang="less" scoped>
.hover-tips {
  display: inline-block;
  position: relative;
  margin-left: 10px;
  .tip-icon {
    cursor: pointer;
    font-size: 13px;
  }

  .text_tip {
    display: none;
    border: 1px solid #e1e1e1;
    position: absolute;
    background: #ffffff;
    padding: 10px;
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    text-align: center;
    line-height: 18px;
    border-radius: 2px;
    z-index: @z-index-4;
    width: 248px;
    left: -131px;
    top: 30px;
    text-transform: initial;
    text-align: left;
    em {
      display: block;
      border-width: 10px;
      position: absolute;
      left: 127px;
      top: -20px;
      border-style: dashed dashed solid;
      border-color: transparent transparent #e1e1e1;
      font-size: 0;
      line-height: 0;
    }
    span {
      display: block;
      border-width: 10px;
      position: absolute;
      left: 127px;
      top: -18px;
      border-style: dashed dashed solid;
      border-color: transparent transparent #ffffff;
      font-size: 0;
      line-height: 0;
    }
    .text_content {
      /deep/ p {
        margin-top: 10px;
        a {
          color: @theme-color;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }

  &:hover {
    .text_tip {
      display: block;
    }
  }
}
</style>
