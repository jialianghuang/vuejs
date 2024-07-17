<template>
  <div @click="selectOptionShow = true" :style="selectStyle" class="cart-rush-select">
    <div :style="{ 'line-height': selectStyle.height, height: selectStyle.height }" class="input">
      <input
        ref="selectInput"
        v-model="valueSelected"
        @blur="blur"
        :readonly="readonly"
        :placeholder="placeholder"
        :class="{ 'input-editor': !readonly }"
        type="text"
        aria-label="select"
      />
      <az-icon v-if="readonly" :style="{ top: top }" class="arrow-down-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
    </div>
    <div
      v-if="selectOptionShow"
      :style="{ width: selectStyle.width, top: selectStyle.height, height: list.length * selectStyle.height }"
      class="rush-cart-select"
    >
      <ul>
        <li v-for="(item, index) in list" :key="index" @click="clickLi(item)" :class="{ selected: isSelected(item) }">
          {{ getDisplayTxt(item) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import azIcon from '@/components/az-ui/AzIcon'
export default {
  name: 'ASelect',
  components: {
    azIcon
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: null
    },
    displayTxt: {
      // 展示用的字段
      type: String,
      default: 'txt'
    },
    selected: {
      type: String,
      default: null
    },
    selectStyle: {
      type: Object,
      default: () => {
        return {
          width: '164px',
          height: '26px'
        }
      }
    }
  },
  data() {
    return {
      valueSelected: this.selected,
      readonly: true,
      timer: null,
      selectOptionShow: false
    }
  },
  computed: {
    top() {
      const height = this.selectStyle.height.replace(/[^0-9]/gi, '')
      return (height - 10) / 2 + 'px'
    }
  },
  watch: {
    selected: {
      handler(val) {
        if ((val != null && val.length > 0) || val === '') {
          // val为'' 处理切换切换in/cm 重置数据 AZWEB-17511
          this.valueSelected = val
        }
      },
      immediate: true
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
  },
  methods: {
    blur() {},
    closeList() {
      this.selectOptionShow = false
    },
    clickLi(item) {
      this.closeList()
      this.valueSelected = this.getDisplayTxt(item)
      this.$emit('change', item)
    },
    getDisplayTxt(item) {
      return (this.displayTxt && item && item[this.displayTxt]) || ''
    },
    isSelected(item) {
      return this.valueSelected == this.getDisplayTxt(item)
    }
  }
}
</script>

<style lang="less" scoped>
.cart-rush-select {
  display: inline-block;
  position: relative;
  vertical-align: top;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid #eee;
  .arrow-down-icon {
    position: absolute;
    right: 10px;
    font-size: 10px;
    width: 10px;
    height: 10px;
  }
  ul li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .input {
    cursor: pointer;
    overflow: hidden;
    input {
      width: 100%;
      border: none;
      outline: none;
      box-sizing: border-box;
      padding: 0;
      cursor: pointer;
      padding-left: 10px;
      &:focus {
        background: #fff;
      }
    }
    .input-editor {
      width: 100%;
      height: 100%;
    }
  }
  .input-rush {
    padding: 0;
    text-align: center;
  }
  .rush-cart-select {
    border: 1px solid #eee;
    overflow: hidden;
    position: absolute;
    background-color: #fff;
    text-align: left;
    height: auto;
    overflow: auto;
    box-sizing: border-box;
    border-top: none;
    z-index: 1;
    ul li {
      font-family: @font-family-500, sans-serif;
      cursor: pointer;
      padding: 0 12px 0 10px;
      height: 26px;
      line-height: 30px;
      white-space: nowrap;
      &.disable {
        color: #d6d6d6;
        cursor: auto;
        &:hover {
          background: transparent;
        }
      }
      &:hover {
        background: #f6f6f6;
      }
      &.more-rush {
        padding: 0;
        border-top: 1px solid #ccc;
      }
    }
    .selected {
      background: #f6f6f6;
    }
  }
}
</style>
