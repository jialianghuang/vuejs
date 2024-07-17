<template>
  <div @click="_handleClick" :class="[{ 'show-bg': showBg }, theme]" class="az-checkbox">
    <az-icon
      v-if="isThemeStyle"
      :icon-class="disable ? 'icon-checkbox-disable' : checked ? 'iconcheckbox-select' : 'iconcheckbox'"
      class="icon-checkbox"
    ></az-icon>
    <div v-else :class="{ checked: checked }" class="az-checkbox-icon">
      <svg v-if="checked" class="icon tick_white">
        <use xlink:href="#icon-lby_tick_white_s"></use>
      </svg>
    </div>
    <!-- <input v-else v-model="checked" aria-label="az checkbox" type="checkbox" /> -->
    <span class="check-box-text">
      <slot></slot>
    </span>
  </div>
</template>
<script>
/**
 * 自定义checkbox组件，用于简单的选择确认操作，后续网站功能增加或者相似功能调整，可继续更新维护此组件，避免冗余组件产生
 * TODO：本项目中有多个类似的选择确认组件，但是基本上都是重复写组件，并没有一个统一的组件去避免冗余的组件产生，后续可陆续更新替换掉其他类似组件
 */
export default {
  name: 'AzCheckbox',
  props: {
    // 是否展示背景色，默认false
    showBg: {
      type: Boolean,
      default: false
    },
    // 传入的默认值
    value: {
      type: Boolean,
      default: false
    },
    // 当前checkbox的显示样式
    theme: {
      type: String,
      default: 'default' // default镂空 primary红底
    },
    isThemeStyle: {
      // 主题风格的checkbox
      type: Boolean,
      default: false
    },
    disable: {
      // 按钮禁用
      type: Boolean,
      default: false
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
.az-checkbox {
  display: flex;
  align-items: center;
  font-size: 13px;
  border-radius: 50px;
  height: 32px;
  line-height: 18px;
  cursor: pointer;
  .icon-checkbox {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
  &-icon {
    width: 12px;
    height: 12px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 12px;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    margin-right: 6px;
    border: 1px solid #ccc;
    background: #fff;
    &.checked {
      background: @theme;
      border-color: var(--color-ffffff);
      .icon {
        fill: #fff;
      }
    }
    .icon {
      margin: 1px 0 0 1px;
      color: #fff;
      font-size: 10px;
      width: 9px;
      height: 9px;
      vertical-align: top;
      fill: currentColor;
    }
  }
  &.show-bg {
    background: var(--color-121212);
    padding: 0px 10px;
    .check-box-text {
      color: var(--color-ffffff);
    }
  }
  .common {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    background: #fff;
  }
  input[type='checkbox'] {
    width: 12px;
    height: 12px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 12px;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    margin-right: 6px;
    &::before {
      content: '';
      .common();
    }
    &:checked::before {
      content: '\2713';
      .common();
      color: var(--color-121212);
      font-size: 12px;
    }
  }
  &.show-bg input[type='checkbox'] {
    &::before {
      background: var(--color-121212);
    }
    &:checked::before {
      background: var(--color-121212);
    }
  }
  &.primary {
    input[type='checkbox'] {
      &:checked::before {
        color: var(--color-ffffff);
        background: var(--color-1e1e1e);
        border: none;
        line-height: 14px;
      }
    }
  }
  .check-box-text {
    color: var(--color-121212);
  }
}
</style>
