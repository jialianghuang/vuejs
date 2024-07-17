<template>
  <div :class="[scene]" v-if="hasLimitedTimeOffer()" class="limited-time-offer">
    <p class="limited-time-box">{{ nl('page_limited_time_tag') }}<span class="after"></span></p>
    <div
      ref="limited-time-offer-tooltip"
      v-tooltip
      :tips="nl('page_limited_time_tips')"
      @click.stop="handleClick"
      class="limited-time-offer-tooltip"
    >
      <az-icon
        ref="tooltip-question"
        v-track.view="{
          common: getBiParams('limited_time_tab', 'shoes_bag')
        }"
        @mouseenter.native="handleIn"
        icon-class="icon-gwc-_question_"
        class="icon-question"
      ></az-icon>
    </div>
  </div>
</template>
<script>
/**
 * Exclusive Offer标签组件
 */
export default {
  name: 'LimitedTimeOffer',
  languageKeys: ['page_limited_time_tag', 'page_limited_time_tips'],
  // 自定义提示指令
  directives: {
    tooltip(el, binding, vnode) {
      const _this = vnode.context
      let isInTooltipBox = false
      // 鼠标移入时，将浮沉元素插入到body中
      el.onmouseenter = (e) => {
        destroyTips()
        // 创建浮层元素并设置样式
        const vcTooltipDom = document.createElement('div')
        const tooltipBox = _this.$refs['limited-time-offer-tooltip']
        const clientWidth = document.documentElement.clientWidth
        if (!tooltipBox) return
        const tooltipBoxRect = tooltipBox.getBoundingClientRect()
        vcTooltipDom.setAttribute('id', 'limited-tooltip')
        if (tooltipBoxRect.left < 130) {
          vcTooltipDom.style.left = '5px'
          vcTooltipDom.style.transform = 'translateX(0)'
        } else if (clientWidth - tooltipBoxRect.right < 130) {
          vcTooltipDom.style.right = '0px'
          vcTooltipDom.style.left = 'unset'
          vcTooltipDom.style.transform = 'translateX(0)'
        } else {
          vcTooltipDom.style.left = tooltipBoxRect.left + 5 + 'px'
        }
        vcTooltipDom.style.top = tooltipBoxRect.top + 'px'

        // 设置三角样式
        const triangle1Dom = document.createElement('div')
        const triangle2Dom = document.createElement('div')
        triangle1Dom.setAttribute('id', 'limited-tooltip-triangle-1')
        triangle2Dom.setAttribute('id', 'limited-tooltip-triangle-2')
        triangle1Dom.style.left = tooltipBoxRect.left + 3 + 'px'
        triangle2Dom.style.left = tooltipBoxRect.left + 3 + 'px'
        triangle1Dom.style.top = tooltipBoxRect.top + 22 + 'px'
        triangle2Dom.style.top = tooltipBoxRect.top + 22 + 'px'

        // 将浮层插入到body中
        document.body.appendChild(vcTooltipDom)
        document.body.appendChild(triangle1Dom)
        document.body.appendChild(triangle2Dom)
        // 浮层中的文字 通过属性值传递动态的显示文案
        document.getElementById('limited-tooltip').innerHTML = `
          <div class="content">
          ${el.getAttribute('tips')}
          </div>
        `
        vcTooltipDom.onmouseenter = (event) => {
          isInTooltipBox = true
        }
        vcTooltipDom.onmouseleave = (event) => {
          if (event.clientX > tooltipBoxRect.left && event.clientX < tooltipBoxRect.right) return false
          isInTooltipBox = false
          destroyTips()
        }
        vcTooltipDom.onclick = () => {
          _this.setPoint('limited_time_tab', 'shoes_bag_desc', 'click')
        }
      }
      // 鼠标移出时将浮层元素销毁
      el.onmouseleave = (event) => {
        // 找到浮层元素并移出
        const tooltipBox = _this.$refs['limited-time-offer-tooltip']
        const tooltipBoxRect = tooltipBox.getBoundingClientRect()
        if (
          !isInTooltipBox ||
          event.clientY < tooltipBoxRect.top ||
          event.clientX < tooltipBoxRect.left ||
          event.clientX > tooltipBoxRect.right
        ) {
          destroyTips()
        }
      }

      document.addEventListener('scroll', () => {
        destroyTips()
      })

      function destroyTips() {
        const vcTooltipDom = document.getElementById('limited-tooltip')
        const triangle1Dom = document.getElementById('limited-tooltip-triangle-1')
        const triangle2Dom = document.getElementById('limited-tooltip-triangle-2')
        vcTooltipDom && document.body.removeChild(vcTooltipDom)
        triangle1Dom && document.body.removeChild(triangle1Dom)
        triangle2Dom && document.body.removeChild(triangle2Dom)
      }
    }
  },
  props: {
    // 使用场景
    scene: {
      type: String,
      default: 'default'
    },
    stickers: {
      type: Array,
      default() {
        return []
      }
    },
    itemCatId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  beforeDestroy() {
    const vcTooltipDom = document.getElementById('limited-tooltip')
    const triangle1Dom = document.getElementById('limited-tooltip-triangle-1')
    const triangle2Dom = document.getElementById('limited-tooltip-triangle-2')
    vcTooltipDom && document.body.removeChild(vcTooltipDom)
    triangle1Dom && document.body.removeChild(triangle1Dom)
    triangle2Dom && document.body.removeChild(triangle2Dom)
  },
  mounted() {},
  methods: {
    handleClick() {
      // 阻止事件冒泡使用
      return false
    },
    hasLimitedTimeOffer() {
      if (!this.stickers || !Object.keys(this.stickers).length) return false
      const hasLimitedTime = this.stickers.some((item) => {
        return item.name === 'time_limited'
      })
      // #19969: 鞋包推荐位limited time sale标签外露,有指定的模块 : 加购弹窗，详情页推荐(often bought with, you may also like)，购物车推荐，首页瀑布流推荐，recently reviewed,
      return (
        hasLimitedTime &&
        [3102, 3109].includes(this.itemCatId) &&
        ['addCartdialogRecommend', 'completeTheLook', 'youmayalsolike', 'cartRecommend', 'empty_cart_recommend', 'recentlyview'].includes(
          this.scene
        )
      )
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    },
    handleIn() {
      this.setPoint('limited_time_tab', 'shoes_bag', 'click')
      this.setPoint('limited_time_tab', 'shoes_bag_desc', 'view')
    }
  }
}
</script>
<style lang="less" scoped>
.limited-time-offer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &.limited-time-offer {
    .addCartdialogRecommend,
    .completeTheLook {
      justify-content: flex-start;
    }
  }
  .limited-time-box {
    height: 24px;
    line-height: 24px;
    background: @btn-light-hover-color;
    font-size: 12px;
    color: @title-color;
    padding-left: 4px;
    padding-right: 4px;
    position: relative;
    text-align: left;
    white-space: nowrap;
    transform: scale(0.83);
    margin-left: -6px;
    .after {
      display: inline-block;
      position: absolute;
      height: 24px;
      width: 10px;
      right: -10px;
      top: 0;
      background: @btn-light-hover-color;
      clip-path: polygon(100% 0%, 5% 50%, 100% 100%, 0 100%, 0% 50%, 0 0);
    }
  }
}
</style>
<style lang="less">
#limited-tooltip {
  box-sizing: border-box;
  position: fixed;
  transform: translateX(-50%);
  padding-top: 10px;
  z-index: 999;
  margin-top: 15px;
  .content {
    background: #fff;
    color: var(--color-121212);
    font-size: 13px;
    width: max-content;
    max-width: 274px;
    padding: 10px;
    border: 1px solid #ccc;
  }
}

#limited-tooltip-triangle-1,
#limited-tooltip-triangle-2 {
  position: fixed;
  background: #fff;
  width: 6px;
  height: 6px;
  transform: rotate(-45deg);
  left: 0;
  top: 0;
  border-radius: 2px;
  z-index: -1;
  border: 1px solid #ccc;
}
#limited-tooltip-triangle-2 {
  z-index: 999;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
}
.limited-time-offer-tooltip {
  margin-left: 5px;
}
</style>
