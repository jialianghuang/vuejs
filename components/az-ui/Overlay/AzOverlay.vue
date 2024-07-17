<template>
  <div :style="{ zIndex, ...overlayStyle }" @click.self="handleClick" class="az-overlay-box">
    <slot></slot>
  </div>
</template>

<script>
import getScrollBarWidth from '@/assets/js/scrollbar-width'
export default {
  name: 'AzOverlay',
  props: {
    zIndex: {
      type: Number,
      default: 1
    },
    overlayStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    lockScroll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      withoutHiddenClass: true,
      bodyPaddingRight: 0,
      azOverLayDisplay: null
    }
  },
  watch: {
    azOverLayDisplay: {
      handler(val) {
        // if (val === 'none' || val === null) {
        //   this.setMessageZindex(false)
        // } else {
        // }
        this.setMessageZindex(val)
      },
      immediate: true
    }
  },
  mounted() {
    if (this.lockScroll) {
      this.withoutHiddenClass = !document.body.classList.contains('body-overflow-hidden')
      if (this.withoutHiddenClass) {
        this.bodyPaddingRight = document.body.style.paddingRight
        this.computedBodyPaddingRight = parseInt(this.getStyle(document.body, 'paddingRight'), 10)
      }
      const scrollBarWidth = getScrollBarWidth()
      const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
      const bodyOverflowY = this.getStyle(document.body, 'overflowY')
      if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && this.withoutHiddenClass) {
        document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
      }
      document.body.classList.add('body-overflow-hidden')
    }
    const overLayDom = document.querySelector('.az-overlay-box')
    if (overLayDom) {
      this.azOverLayDisplay = overLayDom.style.zIndex
    }
  },
  beforeDestroy() {
    if (this.withoutHiddenClass) {
      document.body.style.paddingRight = this.bodyPaddingRight
      document.body.classList.remove('body-overflow-hidden')
    }
    this.withoutHiddenClass = true
  },
  methods: {
    handleClick() {
      this.$emit('click', false)
    },
    getStyle(element, styleName) {
      try {
        const computed = document.defaultView.getComputedStyle(element, '')
        return element.style[styleName] || computed ? computed[styleName] : null
      } catch (e) {
        return element.style[styleName]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.az-overlay-box {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
