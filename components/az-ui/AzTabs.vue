<template>
  <div class="az-tabs">
    <ul :style="{ height: height }" :class="[mode]" class="az-tabs-box">
      <li
        ref="azTabsItem"
        v-for="item in options"
        :key="item.key"
        :class="{ active: activeKey === item.key }"
        :style="{ color: activeKey === item.key ? activeColor : defaultColor }"
        v-track.view.click="{ common: getBiParams(item) }"
        @click="_clickTabsItem(item)"
        class="az-tabs-item"
      >
        <span>
          {{ nl(item.name) }}<span v-if="typeof item.count === 'number' && !isNaN(item.count)">&nbsp;({{ item.count }})</span>
        </span>
      </li>
      <i
        ref="underLine"
        :style="{ left: underLineLeft + 'px', width: underLineWidth, height: lineHeight, background: activeColor }"
        class="az-tabs-underline"
      ></i>
    </ul>
    <slot></slot>
  </div>
</template>
<script>
/**
 * 切换卡组件
 * M端AzTabs组件默认内容选项居中显示
 * PC端本组件默认从左到右显示选项
 * @date 2022-11-03
 */
export default {
  props: {
    // 可选项，例如：[{name:'a',key:1}]
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 默认选中项
    default: {
      type: String,
      default: ''
    },
    // 切换卡的高度，默认40px
    height: {
      type: String,
      default: '40px'
    },
    // 下划线宽度，默认为空，根据文本宽度显示下划线宽度
    lineWidth: {
      type: String,
      default: ''
    },
    // 下划线高度
    lineHeight: {
      type: String,
      default: '3px'
    },
    // 默认显示颜色
    defaultColor: {
      type: String,
      default: '#999999)'
    },
    // 选中显示颜色
    activeColor: {
      type: String,
      default: '#121212)'
    },
    // 模式，默认default:居中显示，left:从左往右显示
    mode: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      activeKey: this.default, // 当前选中项
      underLineLeft: 0, // 选中项下划线的居左位置
      underLineWidth: this.lineWidth // 选中下划线宽度
    }
  },
  computed: {
    // 当前选中项的索引
    activeIndex() {
      let res = 0
      for (let i = 0; i < this.options.length; i++) {
        const ele = this.options[i]
        if (ele.key === this.activeKey) {
          res = i
          break
        }
      }
      return res
    }
  },
  watch: {
    // 监听选中项索引的变化，根据各选项宽度，动态计算下划线的位置
    activeIndex(e) {
      this.calcUnderLineLeft(e)
    }
  },
  created() {
    // 初始化当前选中项的key
    if (this.options.length > 0) {
      if (this.default) {
        this.activeKey = this.default
      } else {
        // 默认选项列表的第一项为选中项
        this.activeKey = this.options[0].key
      }
    }
  },
  mounted() {
    this.calcUnderLineLeft(this.activeIndex)
  },
  methods: {
    // 打点
    getBiParams(e) {
      let res = {}
      if (e && e.ec && e.el) {
        res = {
          ec: e.ec,
          el: e.el
        }
      }
      return res
    },
    // 根据各选项宽度，动态计算下划线的位置
    calcUnderLineLeft(e = 0) {
      let res = 0
      for (let i = 0; i < this.$refs.azTabsItem.length; i++) {
        const ele = this.$refs.azTabsItem[i]
        if (i === e) {
          if (this.mode === 'left') {
            this.underLineLeft = ele.offsetLeft
          } else {
            this.underLineLeft = res + ele.clientWidth / 2
          }
          // 如果没有设置下划线宽度，跟着选中项文本的宽度走
          if (!this.lineWidth) {
            this.underLineWidth = ele.children[0].clientWidth + 'px'
          }
          break
        }
        res += ele.clientWidth
      }
    },
    // 点击切换选项
    _clickTabsItem(e) {
      this.activeKey = e.key
      this.$emit('onChange', e.key)
    }
  }
}
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.az-tabs {
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-box {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    height: 40px;
    position: relative;
    white-space: nowrap;
    overflow: auto;
    &.default {
      .az-tabs-item {
        flex: 1;
        text-transform: capitalize;
        font-size: 13px;
        line-height: 18px;
      }
    }
    &.left {
      .az-tabs-item {
        flex: none;
        text-transform: uppercase;
        font-size: 16px;
        line-height: 22px;
        padding: 0 28px 0px 0px;
      }
      .az-tabs-underline {
        transform: translateX(0);
      }
    }
  }
  &-item {
    height: 100%;
    .center();
    font-family: @font-family-500;
    color: #999;
    transition: 0.3s;
    padding: 0 14px;
    cursor: pointer;
    span {
      display: inline-block;
      height: 100%;
      .center();
    }
    &.active {
      color: var(--color-121212);
      font-family: @font-family-600;
    }
  }
  &-underline {
    position: absolute;
    bottom: 0px;
    background: var(--color-121212);
    transform: translateX(-50%);
    transition: 0.3s;
  }
}
</style>
