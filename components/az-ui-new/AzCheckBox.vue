<template>
  <div @click="handleClick" class="az-check-box">
    <p :class="['az-check-box-item', { checked: value }]">
      <az-icon icon-class="a-icon-checkbox-new"></az-icon>
    </p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AzCheckBoxNew',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('on-change')
    }
  }
}
</script>

<style lang="less" scoped>
.az-check-box {
  display: flex;
  align-items: center;
  column-gap: 10px;
  &-item {
    background-color: var(--color-ffffff);
    width: 15px !important;
    height: 15px !important;
    border: 1px solid var(--color-cccccc) !important;
    box-sizing: border-box !important;
    .az-icon {
      display: none;
      font-size: 15px;
      vertical-align: middle;
    }
    &.checked {
      border: none;
      .az-icon {
        display: block;
      }
    }
  }
}
</style>
