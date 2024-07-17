<template>
  <div :class="{ disable: disable }" :style="style" @click="handleClickLink" class="az-button">
    <az-icon v-if="icon !== ''" :icon-class="icon"></az-icon>
    <slot name="icon"></slot>
    <slot></slot>
    {{ loading ? nl(loadingText) : text }}
  </div>
</template>
<script>
export default {
  name: 'AzButton',
  props: {
    color: {
      type: String,
      default: '#121212'
    },
    textColor: {
      type: String,
      default: '#fff'
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: 'page_lucky_wheel_processing_text'
    },
    round: {
      type: String,
      default: '0'
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    style() {
      return {
        backgroundColor: this.color,
        color: this.textColor,
        borderRadius: this.round,
        opacity: this.loading ? '0.3' : 'unset'
      }
    }
  },
  methods: {
    handleClickLink(event) {
      if (!this.loading && !this.disable) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.az-button {
  width: 100%;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  text-transform: uppercase;
  &.disable {
    cursor: not-allowed !important;
    background-color: #ccc !important;
    pointer-events: auto !important;
  }
  .az-icon {
    height: 15px;
    width: 20px;
    margin-right: 8px;
    fill: currentColor;
  }
}
</style>
