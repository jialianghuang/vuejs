<template>
  <button @click="handleClick" :class="{ 'loading-btn': loading }" type="button">
    <i class="loading-icon"></i>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'AzButton',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (this.loading) {
        return false
      }
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
.loading-btn {
  cursor: not-allowed;
  .loading-icon {
    margin-right: 5px;
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: -0.15em;
    background: url(~assets/images/loading_1.gif) no-repeat;
    background-size: 100% 100%;
  }
}
.btn {
  display: inline-block;
  padding: 6px 32px;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.428571429;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  .border-radius(2px);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  &.ml {
    margin-left: 10px;
  }
}
.btn:focus,
.btn:active,
.btn.active {
  outline: 0;
}

.btn.disabled,
.btn.disabled:hover,
.btn[disabled],
.btn[disabled]:hover,
fieldset[disabled] .btn {
  //pointer-events: none;
  cursor: default;
  background-color: #666;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.btn-theme,
.btn-success {
  background: var(--color-121212);
  color: #fff;
  border: none;
  text-transform: uppercase;
  &:hover,
  &:focus,
  &:active,
  &.active {
    background: var(--color-1e1e1e);
  }
  &[disabled],
  &[disabled]:hover,
  &.disabled,
  &.disabled:hover {
    background-color: #666;
  }
}
.btn-default {
  background: var(--color-e3bda1);
  border: solid 1px var(--color-e3bda1);
  color: #fff;
  text-transform: uppercase;
  padding: 7px 18px;
  &:hover,
  &:focus,
  &:active,
  &.active {
    background: var(--color-121212);
    border-color: var(--color-121212);
  }
  &[disabled],
  &[disabled]:hover,
  &.disabled,
  &.disabled:hover {
    background-color: #666;
    border: solid 1px #666;
  }
}
</style>
