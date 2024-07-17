<template>
  <div ref="azSelect" class="az-select">
    <span v-if="label" class="az-select-label">{{ label }}</span>
    <div
      @click="_handleClick"
      :style="{ width: width + 'px', height: height + 'px' }"
      :class="{ valued: selectedValue.name, error: errTips }"
      class="az-select-main"
    >
      <div class="az-select-main-info">
        <img v-if="selectedValue.img" :src="replaceImgCdnUrl(selectedValue.img)" alt="option img" />
        <input
          v-if="inputAble"
          v-model="selectedValue.name"
          :placeholder="placeholder"
          @input="handleChange"
          @click.stop
          @focus="handleFocus"
          type="text"
        />
        <span v-else :class="placeholder && !selectedValue.name ? 'placeholder' : ''">
          <slot :text="selectedValue.name">{{ selectedValue.name ? selectedValue.name : placeholder }}</slot>
        </span>
      </div>
      <span v-if="innerRequired" class="must-inner">*</span>
      <svg v-if="clearable && selectedValue.key" @click.stop="_handleClear" class="az-icon">
        <use xlink:href="#icon-myaccount_cancel_x"></use>
      </svg>
      <svg v-else :style="show ? 'transform:rotate(180deg)' : ''" class="az-icon">
        <use xlink:href="#icon-lby_expand_arrow_down"></use>
      </svg>
      <ul
        ref="az_select_options"
        :class="{ under: optionsPosition !== 'upper', upper: optionsPosition === 'upper', open: show, 'show-scrollbar': showScrollbar }"
        :style="optionsStyle"
        class="az-select-options"
      >
        <li
          v-for="(item, index) in list"
          :class="{ active: item.key === selectedValue.key, hide: item.hide, disabled: item.disabled }"
          :key="index"
          :style="{ lineHeight: height + 'px', padding: paddingTopBottom + 'px 10px' }"
          @click.stop="_clickOptions(item)"
        >
          <img v-if="item.img" :src="replaceImgCdnUrl(item.img)" alt="option img" />
          <slot :label="item.name" name="label">{{ item.name }}</slot>
          <az-icon v-if="name && item.key === selectedValue.key" icon-class="icon-right" class="icon-right" />
        </li>
        <li v-if="inputAble && list.length == 0" :style="{ lineHeight: height + 'px' }" class="no-data">{{ nl('page_no_reslut') }}</li>
        <li v-else-if="options.length == 0" :style="{ lineHeight: height + 'px' }" class="no-data">No data</li>
      </ul>
    </div>
    <p v-if="errTips" class="theme-warning">{{ errTips }}</p>
  </div>
</template>
<script>
/*
    自定义Select组件，
    说明：项目中已有一个AzSelect组件，但是因为该组件创建时间较久，样式与现有设计有些出入，
        且项目中多处select功能并未用到该组件，所以这里新增一个Select组件，后续同类功能可用并完善此组件。
    传入options格式：[{
      key:1,
      name:'选项1',
      img:'' // 列表项中需要展示图片时，可传此参数
    }]
    父组件中通过@on-change获取操作结果
 */
import { getArrayByName } from '../../assets/js/utils'
export default {
  props: {
    // 选择器的展示名称
    label: {
      type: String,
      default: ''
    },
    // 可选列表项
    options: {
      type: Array,
      default: () => []
    },
    // 提示语
    placeholder: {
      type: String,
      default: ''
    },
    // 是否允许清空
    clearable: {
      type: Boolean,
      default: false
    },
    // 选择器样式宽度
    width: {
      type: Number,
      default: 210
    },
    // 选择器样式高度
    height: {
      type: Number,
      default: 40
    },
    // 默认值，应该传入对应options中项的key
    defaultValue: {
      type: [String, Number],
      default: ''
    },
    showOption: {
      type: Boolean,
      default: false
    },
    // 列表一次性最多展示几条数据
    maxNum: {
      type: Number,
      default: 6
    },
    showScrollbar: {
      // mac和win都显示滚动条
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    inputAble: {
      // 可输入
      type: Boolean,
      default: false
    },
    errTips: {
      // 报错提示
      type: String,
      default: ''
    },
    // options选项展示时的位置，默认在下方under展示，特殊情况需要在上方upper展示
    optionsPosition: {
      type: String,
      default: 'under'
    },
    paddingTopBottom: {
      type: Number,
      default: 0
    },
    // 输入框内是否展示必填星号
    innerRequired: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      selectedValue: {}, // 已选择的项
      show: false // 是否展开显示options列表
    }
  },
  computed: {
    optionsStyle() {
      if (this.optionsPosition === 'upper') {
        return {
          bottom: this.height - 1 + 'px',
          maxHeight: (this.height + this.paddingTopBottom * 2) * this.maxNum + 'px'
        }
      }
      return { top: this.height - 1 + 'px', maxHeight: (this.height + this.paddingTopBottom * 2) * this.maxNum + 'px' }
    }
  },
  watch: {
    defaultValue(e) {
      if (this.selectedValue.key != e) {
        this._handleSelectedValue(e)
        this.$emit('on-change', this.selectedValue)
      }
    },
    showOption: {
      immediate: true,
      handler(val) {
        this.show = val
        if (this.show) {
          this.handleScrollTop()
        }
      }
    },
    options: {
      immediate: true,
      handler(val) {
        this.list = JSON.parse(JSON.stringify(this.options))
      }
    }
  },
  mounted() {
    // 监听页面点击操作，将select列表展开状态置为false
    document.addEventListener('click', (e) => {
      this.list = JSON.parse(JSON.stringify(this.options))
      this._handleSelectedValue(this.defaultValue)
      const tempDom = this.$refs.azSelect
      if (tempDom && !tempDom.contains(e.target)) {
        this.show = false
      }
      this.$emit('on-close', this.name)
    })

    // 如果存在默认值，初始化显示默认选项
    if (this.defaultValue) {
      this._handleSelectedValue(this.defaultValue)
      this.$emit('on-change', this.selectedValue)
    }
  },
  methods: {
    // 选中的item下拉框展开时，滚动到第一行显示
    handleScrollTop() {
      let scrollTop = 0
      if (this.selectedValue.key) {
        for (let i = 0; i < this.list.length; i++) {
          const ele = this.list[i]
          if (ele.key === this.selectedValue.key) {
            scrollTop = i * 40
            break
          }
        }
      }
      // console.log('------scrollTop---------', scrollTop)
      this.$refs.az_select_options && this.$refs.az_select_options.scrollTo(0, scrollTop)
    },
    // input 1.正向有下拉进行输入筛选，不关闭弹框，显示下拉 2.反查，有数据进行筛选和只有1条数据，则重置正向下拉数据
    handleFocus() {
      this.handleScrollTop()
      this.show = true
      this.$emit('on-reset', this.name, this.list.length > 1 ? 'isFocus' : '')
    },
    // 模糊查询
    handleChange(event) {
      this.selectedValue = { name: event.target.value }
      if (event.target.value.length < 2) {
        this.list = JSON.parse(JSON.stringify(this.options))
        return
      }
      const filterArr = getArrayByName(this.options, event.target.value)
      this.list = JSON.parse(JSON.stringify(filterArr))
    },
    /* 根据传入值确定列表中的具体项 */
    _handleSelectedValue(e) {
      let res = {}
      for (let i = 0; i < this.options.length; i++) {
        const ele = this.options[i]
        if (ele.key === e) {
          res = ele
          break
        }
      }

      // 当没有匹配值时，置为空对象
      this.selectedValue = JSON.parse(JSON.stringify(res))
    },
    /* 选择器点击事件，控制展开收缩列表 */
    _handleClick() {
      this.show = !this.show
      if (this.show) {
        this.handleScrollTop()
        this.$emit('on-reset', this.name)
      }
      if (!this.show) this.$emit('on-close', this.name)
    },
    /* 点击选择器列表项，获取当前选择结果 */
    _clickOptions(e) {
      if (!e.disabled) {
        this.selectedValue = e
        this.show = false
        this.$emit('on-change', e)
        setTimeout(() => {
          this.list = JSON.parse(JSON.stringify(this.options))
        }, 200)
      }
    },
    /* 清空操作 */
    _handleClear() {
      this.selectedValue = {}
    }
  }
}
</script>
<style lang="less" scoped>
.az-select-main-info {
  .placeholder {
    color: var(--color-999999);
  }
  input {
    width: 100%;
    border: none;
    background: #fff;
    padding: 0;
  }
}

.error-border {
  .az-select-main {
    border: none;
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flex-center {
  display: flex;
  align-items: center;
}
.az-select {
  .flex-center();
  font-family: @font-family-500;
  &-label {
    font-family: @font-family-600;
    margin-right: 10px;
    font-size: 14px;
  }
  &-main {
    padding: 0 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    font-size: 13px;
    color: var(--color-121212);
    .flex-center();
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    &-info {
      .ellipsis();
      .flex-center();
      width: calc(~'100% - 20px');
      img {
        width: 20px;
        height: 14px;
        margin-right: 8px;
      }
    }
    .az-icon {
      transition: 0.2s;
    }
    .must-inner {
      color: @theme-color;
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &-options {
    border: 1px solid #ccc;
    font-size: 13px;
    position: absolute;
    left: -1px;
    right: -1px;
    background-color: #fff;
    transform: scaleY(0);
    transition: 0.2s;
    overflow: auto;
    &.under {
      transform-origin: top center;
      border-top: none;
    }
    &.upper {
      transform-origin: bottom center;
      border-bottom: none;
    }
    &.open {
      transform: scaleY(1);
    }
    li {
      padding: 0 10px;
      box-sizing: border-box;
      .ellipsis();
      .flex-center();
      &:hover {
        background-color: var(--color-f9f9f9);
      }
      &.hide {
        display: none;
      }
      img {
        width: 20px;
        height: 14px;
        margin-right: 8px;
      }
      &.no-data {
        justify-content: center;
      }
      &.active {
        font-family: @font-family-600;
      }
      &.disabled {
        cursor: not-allowed;
        color: #ccc;
      }
      .icon-right {
        margin-left: 10px;
      }
    }
  }
}
.az-select-options {
  z-index: 1;
  &.show-scrollbar {
    // 重置滚动条样式
    &::-webkit-scrollbar-track-piece {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
  }
}
.theme-warning {
  text-align: left;
  margin-top: 5px;
}
</style>
