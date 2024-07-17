<template>
  <div @click="_handleClick" :class="{ selected: checked }" class="az-switch">
    <span :style="{ 'background-color': checked ? checkedBg : normalBg }" class="switch">
      <span class="toggler"></span>
    </span>
    <span class="label">
      <slot></slot>
    </span>
  </div>
</template>
<script>
/**
 * 自定义switch组件，用于简单的开关操作，后续网站功能增加或者相似功能调整，可继续更新维护此组件
 */
export default {
  name: 'AzSwitch',
  props: {
    // 传入的默认值
    value: {
      type: Boolean,
      default: false
    },
    disable: {
      // 按钮禁用
      type: Boolean,
      default: false
    },
    // 开启的时候的背景
    checkedBg: {
      type: String,
      default: 'var(--color-666666)'
    },
    // 未开启的的时候的背景
    normalBg: {
      type: String,
      default: '#d9d9d9'
    }
  },
  data() {
    return {
      checked: this.value
    }
  },
  watch: {
    value(e) {
      this.checked = e
    }
  },
  methods: {
    _handleClick() {
      if (this.disable) return
      this.checked = !this.checked
      this.$emit('onChange', this.checked)
    }
  }
}
</script>
<style lang="less" scoped>
.az-switch {
  display: flex;
  align-items: center;
  cursor: pointer;
  .switch {
    height: 14px;
    display: inline-block;
    transition: all 0.35s cubic-bezier(0.46, 0.01, 0.32, 1);
    margin-right: 5px;
    position: relative;
    width: 29px;
    border-radius: 40px;
    .toggler {
      position: absolute;
      height: 12px;
      width: 12px;
      background-color: white;
      left: 1px;
      top: 1px;
      border-radius: 50%;
      transition: all 0.35s cubic-bezier(0.46, 0.01, 0.32, 1);
    }
  }
  &.selected {
    .toggler {
      left: calc(~'100% - 13px');
    }
  }
}
</style>
