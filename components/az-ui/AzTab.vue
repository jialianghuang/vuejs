<template>
  <div>
    <div
      id="fix"
      v-if="!(oneNoTab && tabNav.length <= 1)"
      :class="[
        { 'tabs-fixed-top': needFixed && fixedPosition == 'top', 'tabs-fixed-head': fixedHeadDown && fixedPosition == 'head' },
        from
      ]"
    >
      <div id="tab" class="tabs">
        <div v-for="(item, index) in tabNav" :key="item.key" class="tab-list">
          <div
            :class="[
              {
                'tabs-item': true,
                'tabs-item-active': selectedIndex == index
              }
            ]"
            @click="handleChangeTab(index, $event, item.key, item)"
            v-track.view.click="{
              common: getBiParams(item.ec || 'azTab', item.el || item.name)
            }"
          >
            {{ nl(item.name) }}
          </div>
        </div>
      </div>
    </div>
    <div :class="{ place: placeholder }"></div>
    <div id="tab-content" ref="tabContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzTab',
  props: {
    // tabs的名字
    tabNav: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否需要悬挂tabs到顶部,优先级高于fixedHeadDown。
    needFixed: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 是否需要在下拉的时候将tab挂在head下边。
    fixedHeadDown: {
      type: Boolean,
      default() {
        return false
      }
    },
    querySelector: {
      type: String,
      default() {
        return '#product-related'
      }
    },
    from: {
      type: String,
      default: ''
    },
    // 只有一条tab时，不显示tab项
    oneNoTab: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 上一次选择的下标
      previousIndex: 0,
      // 当前选择的tab的下标
      selectedIndex: 0,
      // tab悬挂的位置 top 表示遮盖head，head表示放在head下边。none表示不悬挂
      fixedPosition: 'none',
      // 当前滚动的内容现在距离顶部的距离
      currentOffsetTop: 0,
      // 当前滚动的内容上一次距离顶部的距离
      previousOffsetTop: 0,
      // 当前点击的位置需要移动的位置
      offset: 0,
      // 添加占位
      placeholder: false,
      isScrollTop: false // 是否回到顶部
    }
  },
  mounted() {
    const self = this
    if (self.needFixed) {
      window.addEventListener('scroll', self.throttle(self.handleScroll, 300))
    }
  },
  beforeDestroy() {
    if (this.needFixed) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    },
    handleScroll() {
      const self = this
      if (self.isScrollTop) {
        // 固定tabs切换，回到顶部时，隐藏tabs
        self.fixedPosition = 'top'
        self.placeholder = true
        setTimeout(() => {
          self.isScrollTop = false
        }, 1000)
        return
      }

      const tabs = this.$refs.tabContent
      const footerEle = document.querySelector('#footer_main')
      if (!footerEle) return
      const footerEleCurrentOffsetTop = footerEle.offsetTop - document.documentElement.scrollTop
      if (tabs) {
        self.previousOffsetTop = self.currentOffsetTop
        self.currentOffsetTop = tabs.offsetTop - document.documentElement.scrollTop
        // 获取nav_bar的信息
        const navBarDom = document.querySelector('#nav_bar')
        // 获取元素样式
        const navBarStyle = getComputedStyle(navBarDom)
        // console.log(navBarStyle.height)
        // 获取top和height的数值
        const navBarTop = Number(navBarStyle.top.split('px')[0])
        const navBarHeight = Number(navBarStyle.height.split('px')[0])

        // 当滚动到navBar的位置时，固定位置
        if (parseInt(self.currentOffsetTop * 100) <= parseInt((navBarTop + navBarHeight) * 100)) {
          if (navBarTop > 0) {
            self.fixedPosition = 'head'
          } else {
            self.fixedPosition = 'top'
          }
          self.placeholder = true
        } else {
          self.fixedPosition = 'none'
          self.placeholder = false
        }
      }
      if (footerEleCurrentOffsetTop < 120) {
        // 内容到底部时，隐藏tabs
        self.fixedPosition = 'none'
        self.placeholder = false
      }
    },
    throttle(fun, wait) {
      const self = this
      let previous = 0
      return function() {
        const now = Date.now()
        if (now - previous > wait) {
          fun.call(self)
          previous = now
        }
      }
    },
    handleChangeTab(index, e, key, item) {
      const tab = document.getElementById('tab')
      // 暂时没有使用到
      this.previousIndex = this.selectedIndex
      this.selectedIndex = index
      const clientWidth = document.documentElement.clientWidth
      // 将非第一个或者最后一个的元素至于正中间
      const left = e.target.offsetLeft - clientWidth / 2 + e.target.getBoundingClientRect().width / 2
      if (this.selectedIndex != 0 && this.selectedIndex != this.tabNav.length - 1) {
        tab.scrollLeft = left
      }
      // 如果点击的是第一个，将scroll 初始化为0
      if (this.selectedIndex == 0) {
        tab.scrollLeft = 0
      }
      const offsetLeft = tab.scrollWidth
      // 如果点击的是最后一个，将scroll 挪到最后
      if (this.selectedIndex == this.tabNav.length - 1) {
        tab.scrollLeft = offsetLeft
      }
      this.$emit('onChange', key)
      if (this.fixedPosition != 'none') {
        document.querySelector(this.querySelector).scrollIntoView({ block: 'start', behavior: 'smooth' })
        this.isScrollTop = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.tabs {
  margin: 0 15px;
  display: flex;
  display: -webkit-box;
  display: -ms-flexbox;
  overflow-x: scroll;
  border-bottom: 1px solid #ccc;
  z-index: @fixed-z-index;
  .tab-list {
    margin-right: 24px;
    &:last-child {
      margin-right: 0;
    }
  }
  .tabs-item {
    position: relative;
    left: 0;
    font-size: 16px;
    color: #ccc;
    height: 45px;
    overflow: hidden;
    line-height: 45px;
    border-bottom: 3px solid #fff;
    font-family: @font-family-600;
    cursor: pointer;
  }
  .tabs-item-active {
    color: var(--color-121212);
    font-weight: 400;
    border-bottom: 3px solid var(--color-121212);
  }
}
.place {
  height: 45px;
}
#fix {
  position: relative;
  z-index: @position-z-index;
  background: #fff;
  &.tabs-fixed-top {
    position: fixed;
    left: 0;
    right: 0;
    top: 0 !important;
    z-index: @fixed-z-index;
    margin: 0;
    background: #fff;
  }
  &.tabs-fixed-head {
    position: fixed;
    left: 0;
    right: 0;
    top: 40px;
    z-index: @fixed-z-index;
    margin: 0;
    background: #fff;
  }
  &.landingActivity {
    .tabs-item:not(.tabs-item-active) {
      color: #666;
    }
    .tab-list {
      margin-right: 40px;
    }
    .tabs-item {
      height: 33px;
      line-height: 33px;
      padding-bottom: 6px;
    }
  }
}
</style>
