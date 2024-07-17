<template>
  <button @click="handleClick" :class="{ 'loading-btn': loading }" type="button">
    <i v-if="needIcon" class="loading-icon"></i>
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
    },
    needIcon: {
      type: Boolean,
      default: true
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
    filter: grayscale(1);
  }
}
.btn {
  display: inline-block;
  padding: 6px 32px;
  margin: 0;
  height: 40px;
  font-size: 13px;
  font-family: @font-family-600;
  // font-weight: 400;
  // line-height: 1.428571429;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
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
  background-color: #ccc;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.btn-theme,
.btn-success {
  background: var(--theme-color);
  color: #fff;
  border: none;
  text-transform: uppercase;
  &:hover,
  &:focus,
  &:active,
  &.active {
    background: var(--btn-hover-color);
  }
  &[disabled],
  &[disabled]:hover,
  &.disabled,
  &.disabled:hover {
    background-color: #ccc;
  }
}
.btn-default {
  background: var(--theme-color);
  border: solid 1px var(--theme-color);
  color: #fff;
  text-transform: uppercase;
  padding: 7px 18px;
  cursor: pointer;
  &:hover,
  &:focus,
  &:active,
  &.active {
    background: var(--btn-hover-color);
    border-color: var(--btn-hover-color);
  }
  &[disabled],
  &[disabled]:hover,
  &.disabled,
  &.disabled:hover {
    background-color: #ccc;
    border: solid 1px #ccc;
  }
}
.btn-hollow {
  height: 40px;
  border: solid 1px var(--btn-hover-color);
  color: var(--btn-hover-color);
  background: #fff;
  text-transform: uppercase;
  padding: 7px 18px;
  font-family: @font-family-700, sans-serif;
  &:hover,
  &:focus,
  &:active,
  &.active {
    background: #fff;
    border-color: var(--btn-hover-color);
    opacity: 0.9;
  }
  &[disabled],
  &[disabled]:hover,
  &.disabled,
  &.disabled:hover {
    border: solid 1px #666;
    color: #666;
  }
}
</style>
