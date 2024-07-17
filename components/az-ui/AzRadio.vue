<template>
  <div class="az-radio">
    <span v-if="label" class="az-radio-title"
      ><i>{{ requiredShow === 'left' ? '*' : '' }}</i
      >{{ label }}{{ requiredShow === 'right' ? '*' : '' }}</span
    >
    <slot name="label"></slot>
    <div class="az-radio-main">
      <div v-for="(item, index) in options" :key="index" class="az-radio-option">
        <input
          :name="name"
          :id="'az_radio_' + name + index"
          :value="item.value"
          :aria-label="item.label + ' az radio ' + name + index"
          @change="$emit('change', $event.target.value)"
          type="radio"
        />
        <label :for="'az_radio_' + name + index" class="az-radio-option-label">{{ item.label }}</label>
      </div>
    </div>
    <p v-if="errorMsg" class="az-radio-tips">{{ errorMsg }}</p>
  </div>
</template>
<script>
/**
 * 自定义radio组件，与网站设计风格保持统一，
 * 注意：现此组件主要用在零售商申请页，申请操作form中，后续其他其他页面有radio功能需求，可更新维护此组件
 */
export default {
  name: 'AzRadio',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 绑定的值
    value: {
      type: String,
      default: ''
    },
    // 可选项列表，内容结构：[{label:'a',value:1}]
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false
    },
    // 必填*位置
    requiredPosition: {
      type: String,
      default: 'right'
    },
    // 代表的功能标签说明
    label: {
      type: String,
      default: ''
    },
    // 表明功能的名字
    name: {
      type: String,
      default: ''
    },
    // 错误提示
    errorMsg: {
      type: String,
      default: ''
    }
  },
  computed: {
    requiredShow() {
      return this.required && this.requiredPosition
    }
  }
}
</script>
<style lang="less" scoped>
.az-radio {
  font-family: @font-family-500;
  font-size: 13px;
  line-height: 18px;
  color: var(--color-121212);
  &-title {
    line-height: 18px;
    font-family: @font-family-600;
    font-style: normal;
    i {
      margin-right: 5px;
      font-family: @font-family-600;
      font-size: 13px;
      font-style: normal;
      color: @theme;
    }
  }
  &-main {
    display: flex;
    align-content: center;
    margin-top: 5px;
  }
  &-option {
    display: flex;
    align-items: center;
    margin-right: 15px;
    input[type='radio'] {
      width: 15px;
      height: 15px;
      position: relative;
      -webkit-appearance: none;
      border: none;
      cursor: pointer;
      .input_common {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 13px;
        height: 13px;
        border: 1px solid #ccc;
        border-radius: 50%;
      }
      &::before {
        .input_common();
      }
      &:checked {
        &::before {
          .input_common();
        }
        &::after {
          content: '';
          position: absolute;
          left: 2.5px;
          top: 2.5px;
          width: 10px;
          height: 10px;
          background: var(--color-121212);
          border-radius: 50%;
        }
      }
    }
    &-label {
      margin-left: 10px;
    }
  }
  &-tips {
    color: red;
    margin-top: 5px;
  }
}
</style>
