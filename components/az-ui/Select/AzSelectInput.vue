<template>
  <div @click="selectOptionShow = !selectOptionShow" class="az-select-input">
    <div class="input">
      <input
        ref="selectInput"
        v-model="inputNumber"
        @blur="blur"
        :readonly="readonly"
        :class="{ 'input-editor': !readonly }"
        aria-label="select"
        type="text"
      />
      <az-icon
        v-if="readonly"
        :style="{ transform: selectOptionShow ? 'rotate(180deg)' : '' }"
        class="arrow-down-icon"
        icon-class="icon-lby_expand_arrow_down"
      ></az-icon>
    </div>
    <div v-if="selectOptionShow" class="num-select">
      <ul>
        <li v-for="item in listOption" :key="item" @click="selectOption(item)">{{ item }}</li>
        <li v-if="isShowCustomer" @click.stop="toEditor" class="more-num">{{ option + 1 }}+</li>
      </ul>
    </div>
  </div>
</template>

<script>
import azIcon from './../AzIcon'
export default {
  name: 'AzSelectInput',
  components: {
    azIcon
  },
  props: {
    value: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    },
    option: {
      type: Number,
      default: 9
    },
    min: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      readonly: true,
      timer: null,
      selectOptionShow: false
    }
  },
  computed: {
    inputNumber: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('changeNumber', this.limit(val))
      }
    },
    isMax() {
      return this.goodsNumber == this.max
    },
    isMin() {
      return this.goodsNumber == this.min
    },
    listOption() {
      let res = 1
      if (this.option > this.max) {
        res = this.max
      } else {
        res = this.option
      }
      return res
    },
    isShowCustomer() {
      let res = true
      if (this.listOption == this.option) {
        res = true
      } else {
        res = false
      }
      return res
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
          this.readonly = true
        }, 10)
      }
    })
  },
  methods: {
    toEditor() {
      this.readonly = false
      this.selectOptionShow = false
      this.$refs.selectInput.focus()
    },
    selectOption(val) {
      this.$emit('changeNumber', val)
      this.selectOptionShow = false
    },
    limit(val) {
      let num = parseInt(val) || 1
      if (num > this.max) {
        num = this.max
      } else if (num < this.min) {
        num = this.min
      }
      return num
    },
    blur() {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.az-select-input {
  display: inline-block;
  position: relative;
  width: 90px;
  height: 32px;
  vertical-align: top;
  margin-left: 5px;
  cursor: pointer;
  .arrow-down-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 10px;
    height: 10px;
    font-size: 10px;
    z-index: @z-index-2;
    transition: 0.3s;
  }
  ul li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .input {
    width: 100%;
    height: 100%;
    line-height: 30px;
    border: 1px solid var(--color-cccccc);
    position: absolute;
    // padding: 0 19px;
    box-sizing: border-box;
    background: #fff;
    cursor: pointer;
    input {
      background: #fff;
      border: none;
      outline: none;
      padding: 0;
      width: 43px;
      cursor: pointer;
      // text-align: center;
      padding-left: 10px;
      &:focus {
        background: #fff;
      }
    }
    .input-editor {
      // width: 100%;
      height: 100%;
    }
  }
  .input-num {
    padding: 0;
    text-align: center;
  }
  .num-select {
    width: 90px;
    border: 1px solid var(--color-cccccc);
    overflow: hidden;
    position: absolute;
    top: 32px;
    z-index: 2;
    background-color: #fff;
    text-align: left;
    max-height: 150px;
    overflow: auto;
    box-sizing: border-box;
    border-top: none;
    ul li {
      height: 30px;
      padding-right: 12px;
      line-height: 30px;
      font-family: @font-family-500, sans-serif;
      cursor: pointer;
      // text-align: center;
      padding-left: 10px;
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
      &.more-num {
        padding: 0;
        border-top: 1px solid #ccc;
      }
    }
  }
}
</style>
