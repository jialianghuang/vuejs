<template>
  <div @click="selectClick" class="az-select-box">
    <div :id="id" class="select">
      <div class="select-name">{{ getSelectName() }}</div>
      <az-icon class="arrow-down-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
    </div>
    <ul :style="selectOptionStyle" :class="['select-option', { showUl: selectOptionShow }]">
      <li
        :style="liStyle"
        v-for="(selectItem, index) in selectList"
        :key="(selectItem.key || selectItem.number) + index"
        :class="{
          selected: mode ? selected.includes(selectItem.key) : selectItem.key == selected,
          disabled: mode ? !selectItem.number : false
        }"
        @click="selectItemClick(selectItem)"
      >
        <template v-if="mode">
          <div class="checkbox">
            <az-icon class="selected-icon" icon-class="icon-lby_tick_white_s"></az-icon>
            <az-icon class="disabled-icon" icon-class="icon-xxy_Non-clickable"></az-icon>
          </div>
          <span class="name">{{ selectItem.name }}</span>
          <span class="value">({{ selectItem.number }})</span>
        </template>
        <template v-else>
          <div class="name">{{ selectItem.name }}</div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * 下拉选项
 */
import azIcon from './../AzIcon'

export default {
  name: 'AzSelect',
  components: {
    azIcon
  },
  props: {
    selectOptionStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    liStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    mode: {
      // 模式：false=>简单模式，简单的select, true=>复杂模式，包含复选框，并且支持多选
      type: Boolean,
      default: false
    },
    selectList: {
      required: true,
      type: Array
    },
    defaultSelected: {
      // 默认选中值，仅在简单模式生效，指定数据中的key值
      type: String,
      default: ''
    },
    defaultSelectedArray: {
      type: Array,
      default() {
        return []
      }
    },
    allSelectName: {
      // select name，仅在复杂模式生效，change的时候不会更改此值
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      selected: '',
      selectOptionShow: false,
      timer: null
    }
  },
  created() {
    if (this.mode) {
      this.selected = JSON.parse(JSON.stringify(this.defaultSelectedArray))
    } else {
      this.selected = this.defaultSelected
    }
  },
  mounted() {
    document.documentElement.addEventListener('click', (event) => {
      let flag = false
      let parent = event.target.parentNode
      while (parent) {
        if (parent == this.$el) {
          flag = true
          break
        }
        parent = parent.parentNode
      }
      if (!flag) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.selectOptionShow = false
        }, 10)
      }
    })
    // comments: 详情页评论下拉选父框宽度需要跟着下拉框宽度走
    if (this.id) {
      this.$nextTick(() => {
        const parentDom = document.querySelector('.az-select-box #' + this.id)
        const childDom = document.querySelector(`.az-select-box #${this.id} + .select-option`)
        if (parentDom && childDom) {
          parentDom.style.setProperty('width', childDom.getBoundingClientRect().width + 'px')
        }
      })
    }
  },
  methods: {
    selectClick() {
      this.selectOptionShow = true
      this.$emit('click', this.selected)
    },
    getSelectName() {
      if (this.mode) {
        return this.allSelectName
      } else {
        let current
        this.selectList.map((item) => {
          if (item.key == this.selected) {
            current = item
          }
        })
        return current && current.name
      }
    },
    selectItemClick(obj) {
      if (this.mode) {
        if (!obj.number) return false
        if (!this.selected.includes(obj.key)) {
          this.selected.push(obj.key)
        } else {
          const selected = JSON.parse(JSON.stringify(this.selected))
          this.selected = selected.filter((item) => item != obj.key)
        }
      } else {
        this.selected = obj.key
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.selectOptionShow = false
        }, 10)
      }
      this.$emit('change', this.selected)
    }
  }
}
</script>

<style lang="less" scoped>
.az-select-box {
  display: inline-block;
  position: relative;
  height: 40px;
  cursor: pointer;
  .select {
    position: relative;
    box-sizing: border-box;
    height: 40px;
    line-height: 38px;
    padding: 0 21px 0 11px;
    border: 1px solid #ccc;
    .select-name {
      color: var(--color-121212);
      font-size: 13px;
      text-transform: capitalize;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .arrow-down-icon {
      position: absolute;
      top: 13px;
      right: 10px;
      z-index: 10;
      width: 10px;
      height: 13px;
    }
  }
  .select-option {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    left: 0;
    top: 40px;
    z-index: @z-index;
    color: var(--color-121212);
    font-size: 13px;
    background: #fff;
    border: 1px solid #ccc;
    border-top: 0;
    box-shadow: 0 2px 3px 0 rgba(51, 51, 51, 0.3);
    visibility: hidden;
    &.showUl {
      visibility: visible;
    }
    li {
      height: 30px;
      line-height: 30px;
      padding: 0 11px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      &:hover {
        background: #f5f5f5;
      }
      &.selected {
        background: #f5f5f5;
        .checkbox {
          border: 0;
          background-color: #666;
          .selected-icon {
            display: block;
          }
        }
      }
      &.disabled {
        color: #ccc;
        cursor: not-allowed;
        .checkbox {
          border: 0;
          background-color: #fff;
          .disabled-icon {
            display: block;
          }
        }
      }
      .checkbox {
        box-sizing: border-box;
        position: relative;
        min-width: 12px;
        width: 12px;
        height: 12px;
        margin-right: 7px;
        border: 1px solid var(--color-121212);
        .selected-icon {
          display: none;
          position: absolute;
          top: 2px;
          left: 1px;
          z-index: 10;
          color: #fff;
          width: 9px;
          height: 9px;
          fill: currentColor;
        }
        .disabled-icon {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 10;
        }
      }
      .name {
        text-transform: capitalize;
      }
      .value {
        margin-left: 5px;
      }
    }
  }
}
</style>
