<template>
  <div v-if="scrollToTop" @click="click" :class="{ 'bridal-icon-box': isBridal }" class="icon-box scroll-to-top">
    <az-icon icon-class="icon-top" class="icon-top"></az-icon>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ScrollToTop',
  props: {
    iconClass: {
      type: String,
      default: 'pink'
    }
  },
  computed: {
    ...mapState({
      scrollToTop: (state) => state.scrollToTop
    })
  },
  methods: {
    click() {
      window.scroll(0, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-to-top {
  position: fixed;
  right: 20px;
  bottom: 96px;
  z-index: @position-z-index;
  cursor: pointer;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  background: var(--color-f1e9e6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  &:hover {
    opacity: 0.95;
  }
  .icon-top {
    fill: var(--color-121212);
    width: 23px;
    height: 19px;
  }
  &.bridal-icon-box {
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  }
}
</style>
