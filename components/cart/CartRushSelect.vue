<template>
  <div @click="selectOptionShow = true" class="cart-rush-select">
    <div class="input">
      <input
        ref="selectInput"
        v-model="valueSelected"
        @blur="blur"
        :readonly="readonly"
        :class="{ 'input-editor': !readonly }"
        type="text"
        aria-label="select"
      />
      <az-icon v-if="readonly" class="arrow-down-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
    </div>
    <div v-if="selectOptionShow" class="rush-cart-select">
      <ul>
        <li v-for="(item, index) in list" :key="index" @click="clickLi(item)" :class="{ selected: valueSelected == item.label }">
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import azIcon from '@/components/az-ui/AzIcon'
export default {
  name: 'CartRushSelect',
  components: {
    azIcon
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      valueSelected: '',
      readonly: true,
      timer: null,
      selectOptionShow: false
    }
  },
  computed: {},
  watch: {
    list: {
      handler(val) {
        val.forEach((item) => {
          if (item.selected) {
            this.valueSelected = item.label
          }
        })
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
    console.log('value', this.valueSelected)
  },
  methods: {
    blur() {},
    closeList() {
      this.selectOptionShow = false
    },
    clickLi(item) {
      this.closeList()
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="less" scoped>
.cart-rush-select {
  display: inline-block;
  position: relative;
  width: 164px;
  height: 26px;
  vertical-align: top;
  cursor: pointer;
  .arrow-down-icon {
    position: absolute;
    top: 8px;
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
    // width: 100%;
    // height: 100%;
    line-height: 26px;
    height: 26px;
    border: 1px solid #ccc;
    // position: absolute;
    // padding: 0 19px;
    box-sizing: border-box;
    cursor: pointer;
    input {
      border: none;
      outline: none;
      padding: 0;
      width: 152px;
      cursor: pointer;
      // text-align: center;
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
    width: 164px;
    border: 1px solid #eee;
    overflow: hidden;
    position: absolute;
    top: 26px;
    background-color: #fff;
    text-align: left;
    height: auto;
    overflow: auto;
    box-sizing: border-box;
    border-top: none;
    z-index: 1;
    ul li {
      height: 26px;
      padding-right: 12px;
      line-height: 30px;
      font-family: @font-family-500, sans-serif;
      cursor: pointer;
      padding-left: 10px;
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
