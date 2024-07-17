<template>
  <div :class="{ inline: inline }" class="az-input">
    <span v-if="label" class="az-input-label"
      ><i v-if="requiredShow === 'left'">*</i>{{ label }}{{ requiredShow === 'right' ? '*' : '' }}</span
    >
    <div v-if="type !== 'textarea'" class="az-input-box">
      <div v-if="type === 'phone'" class="az-input-prefix">{{ prefix }}</div>
      <input
        :value="value"
        :placeholder="placeholder"
        @input="inputHandler"
        @blur="blurHandler"
        @focus="focusHandler"
        :disabled="disabled"
        :type="type"
        :maxLength="maxLength"
        :aria-label="label || 'az input'"
        class="az-input-content"
      />
    </div>
    <div v-else class="az-input-box">
      <textarea
        :value="value"
        @input="inputHandler"
        @blur="blurHandler"
        @focus="focusHandler"
        @change="changeHandler"
        :placeholder="placeholder"
        :aria-label="label || 'az textarea'"
        class="az-input-content"
      />
      <span v-if="showWordLimit" class="az-input-limit">{{ textLength }}/{{ maxLength }}</span>
    </div>
    <AzEmailDomain :show="emailDomainShow && type == 'email'" :origin-email="value" @domain-handler="(value) => $emit('input', value)" />
    <p v-if="errorMsg" class="az-input-tips">{{ errorMsg }}</p>
  </div>
</template>
<script>
/**
 * 自定义输入组件
 * 目前此组件主要用在零售商申请页，/partner，/ambassador-program后续可丰富此组件，替换其他功能页面中的输入操作，比如地址编辑中，也有较多输入操作。
 */
import { emojiRegex } from '@/assets/js/emojiRegex'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
export default {
  components: {
    AzEmailDomain
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    // 绑定的值
    value: {
      type: [String, Number],
      default: ''
    },
    // 输入内容对应的标签描述
    label: {
      type: String,
      default: ''
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
    // 提示
    placeholder: {
      type: String,
      default: ''
    },
    // 类型，普通输入，phone number等
    type: {
      type: String,
      default: 'text'
    },
    // 标签和输入框的排列
    inline: {
      type: Boolean,
      default: false // false 上下排列，true 水平排列
    },
    // 错误提示
    errorMsg: {
      type: String,
      default: ''
    },
    // 前缀内容，填写电话号码会显示前缀
    prefix: {
      type: String,
      default: 'US +1'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 最大长度
    maxLength: {
      type: Number,
      default: null
    },
    // 显示字数统计
    showWordLimit: {
      type: Boolean,
      default: false
    },
    // 字数统计是否根据单词数
    isAlphabetLimit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emailDomainShow: false
    }
  },
  computed: {
    requiredShow() {
      return this.required && this.requiredPosition
    },
    textLength() {
      if (!this.isAlphabetLimit) {
        if (typeof this.value === 'number') {
          return String(this.value).length
        }
        const len = (this.value || '').length
        if (len > this.maxLength) {
          this.$emit('input', this.value.substr(0, len - 1))
        }
        return len - 1
      } else {
        let count = 0
        let isAlphabet = false
        // 处理emoji
        const emojiArr = this.value.match(emojiRegex()) || []
        const withoutEmojiValue = this.value.replace(emojiRegex(), ' ')
        for (let i = 0; i < withoutEmojiValue.length; i++) {
          // 当前字符为空格
          if (withoutEmojiValue[i] === ' ') {
            isAlphabet = false
          } else if (/^[A-Za-z]+$/.test(withoutEmojiValue[i])) {
            // 当前字符为字母
            if (!isAlphabet) {
              // 非连续字母,单词数+1
              count++
            }
            isAlphabet = true
          } else {
            // 中文、字符等非空格非英文字母都加一
            count++
            isAlphabet = false
          }
        }
        // 超过上限禁止输入
        count = count + emojiArr.length
        const len = this.value.length
        if (count > this.maxLength) {
          this.$emit('input', this.value.substr(0, emojiRegex().test(this.value.substr(len - 1, len)) ? len - 2 : len - 1))
          return count - 1
        }
        return count
      }
    }
  },
  methods: {
    // 输入框获得焦点
    focusHandler($event) {
      this.emailDomainShow = true
      this.$emit('focus', $event.target.value)
    },
    // 输入框失去焦点
    blurHandler($event) {
      const timer = setTimeout(() => {
        this.emailDomainShow = false
        clearTimeout(timer)
      }, 300)
      this.$emit('blur', $event.target.value)
    },
    // 输入框内容改变
    changeHandler($event) {
      this.$emit('change', $event.target.value)
    },
    // 输入框内容改变
    inputHandler($event) {
      this.$emit('input', $event.target.value)
    }
  }
}
</script>
<style lang="less" scoped>
.az-input {
  position: relative;
  color: var(--color-121212);
  display: flex;
  flex-direction: column;
  font-size: 13px;
  &.inline {
    flex-direction: row;
    .az-input-label {
      margin-right: 10px;
    }
    .az-input-main {
      margin: 0;
    }
  }
  &-label {
    line-height: 18px;
    font-family: @font-family-600;
    i {
      margin-right: 5px;
      font-family: @font-family-600;
      font-size: 13px;
      font-style: normal;
      color: @theme-color;
    }
  }
  &-box {
    width: 100%;
    display: flex;
    align-content: center;
    margin-top: 5px;
  }
  &-prefix {
    width: 50px;
    text-align: center;
    line-height: 38px;
    border: 1px solid #ccc;
    border-right: none;
  }
  &-content {
    flex: 1;
    width: 100%;
    border: 1px solid #ccc;
  }
  &-tips {
    color: red;
    margin-top: 5px;
  }
  input[type='text']:focus,
  textarea:focus {
    background: #fff;
  }
  input:disabled {
    background: var(--color-f9f9f9);
  }
  &-limit {
    color: #999;
    background: #fff;
    position: absolute;
    font-size: 12px;
    bottom: 5px;
    right: 10px;
  }
  textarea {
    resize: none;
  }
}
</style>
