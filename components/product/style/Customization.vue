<template>
  <div :class="{ 'two-line': maxLength > 2 }" class="customization">
    <div :class="{ error: customNameError.line1 }" class="line_block">
      <div class="title">{{ nl('page_common_line_one') }}:</div>
      <input
        v-model="line1"
        @focus="inputFocus('line1')"
        :placeholder="nl(maxLength > 2 ? 'page_customization_placeholder_line1' : `page_customization_placeholder_line_one_${maxLength}`)"
        :maxlength="maxLength"
        type="text"
      />
      <span class="theme-warning">{{ nl('page_customization_tips') }}</span>
    </div>
    <div :class="{ error: customNameError.line2 }" v-if="supportTwoLine" class="line_block">
      <div class="title">{{ nl('page_common_line_two') }}:</div>
      <input
        v-model="line2"
        @focus="inputFocus('line2')"
        :placeholder="nl('page_customization_placeholder_line2')"
        :maxlength="maxLength"
        type="text"
      />
      <span class="theme-warning">{{ nl('page_customization_tips') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Customization',
  languageKeys: [
    'page_common_line_one',
    'page_common_line_two',
    'page_customization_placeholder_line',
    'page_customization_placeholder_line1',
    'page_customization_placeholder_line2',
    'page_customization_placeholder_line_one_1',
    'page_customization_placeholder_line_one_2',
    'page_customization_tips'
  ],
  props: {
    customNameList: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否支持两行
    supportTwoLine: {
      type: Boolean,
      default: false
    },
    // 最大长度
    maxLength: {
      type: Number,
      default: 25
    }
  },
  data() {
    return {
      customNameError: {
        line1: false,
        line2: false
      }
    }
  },
  computed: {
    line1: {
      get() {
        return this.customNameList.line1
      },
      set(val) {
        this.$emit('changeCustomNameList', 'line1', val)
      }
    },
    line2: {
      get() {
        return this.customNameList.line2
      },
      set(val) {
        this.$emit('changeCustomNameList', 'line2', val)
      }
    },
    placeholder() {
      return this.maxLength + ' Characters Max'
    }
  },
  mounted() {},
  methods: {
    inputFocus(key) {
      this.customNameError[key] = false
    }
  }
}
</script>

<style lang="less" scoped>
.customization {
  margin-bottom: 25px;
  .title {
    font-size: 13px;
    font-family: @font-family-500;
    color: var(--color-121212);
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  input {
    border: 1px solid #ccc;
    width: 162px;
    height: 32px;
    box-sizing: border-box;
    padding: 0 0 0 10px;
  }

  &.two-line {
    max-width: 695px;
    display: flex;
    justify-content: space-between;
    .line_block {
      width: calc((100% - 15px) / 2);
      input {
        width: 100%;
      }
    }
  }
  .theme-warning {
    display: none;
  }
  .line_block {
    &:nth-child(1) {
      margin-right: 15px;
    }
    &.error {
      input {
        border-color: var(--color-ff0000);
      }
      .theme-warning {
        display: block;
        margin-top: 5px;
      }
    }
  }
}
</style>
