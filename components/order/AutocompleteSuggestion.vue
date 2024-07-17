<template>
  <transition @before-enter="transitionInit" @enter="transitionEnter" @leave="transitionLeave">
    <div ref="autocompleteSuggestion" v-if="visible" class="autocomplete-suggestion">
      <div class="autocomplete-suggestion-main">
        <ul>
          <li v-for="item in options" :key="item.id" @click="clickSelect(item)">
            <span>{{ item.store_name }}</span>
            <p>{{ item.store_address }}</p>
          </li>
        </ul>
        <p v-if="options.length === 0" class="no-result">{{ nl('page_no_reslut').toLowerCase() }}</p>
      </div>
      <div class="autocomplete-suggestion-footer">
        <span>{{ nl('page_cant_find_store') }}</span>
        <span @click="clickManually('entermanually')">{{ nl('page_enter_it_manually') }}</span>
      </div>
    </div>
  </transition>
</template>
<script>
/**
 * 自动补全提示建议组件
 * 比如用户输入操作的时候，展开本组件，展示几条根据输入内容提示的数据，可以直接点击补全到输入框中
 * 因为此组件数据内容功能有点特殊性，复用性不明显，所以放在关联order目录下
 * 目前应用场景：/order/alteration_reimbursement页面store输入
 */
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 可选数据
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    // 监听可选数据变化，动态修改本组件的高度
    options(e) {
      let len = e.length
      if (len > 5) len = 5
      if (len < 1) len = 1
      if (this.$refs.autocompleteSuggestion) {
        this.$refs.autocompleteSuggestion.style.height = len * 58 + 40 + 'px'
      }
    }
  },
  methods: {
    transitionInit(el) {
      el.style.height = '0px'
    },
    transitionEnter(el) {
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth
      let len = this.options.length
      if (len > 5) len = 5
      el.style.height = len * 58 + 40 + 'px'
      el.style.transition = 'all 0.3s'
    },
    transitionLeave(el) {
      el.style.height = '0px'
      el.style.transition = 'all 0.3s'
    },
    clickManually(el) {
      this.setPoint('alterations', el, 'click')
      this.$emit('update:visible', false)
    },
    clickSelect(e) {
      this.$emit('select', e)
      this.clickManually('recommendstore')
    }
  }
}
</script>
<style lang="less" scoped>
.autocomplete-suggestion {
  background: #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.35);
  width: 100%;
  position: absolute;
  top: 43px;
  z-index: 3;
  overflow: hidden;
  transition: all 0.3s;
  &-main {
    max-height: 290px;
    overflow: auto;
    font-size: 13px;
    line-height: 18px;
    ul {
      li {
        padding: 10px;
        cursor: pointer;
        &:hover {
          background-color: var(--color-f9f9f9);
        }
        p {
          color: #999;
          margin-top: 2px;
        }
      }
    }
    .no-result {
      margin: 20px auto;
      text-align: center;
      text-transform: capitalize;
    }
  }
  &-footer {
    border-top: 1px solid var(--color-eeeeee);
    height: 39px;
    text-align: center;
    line-height: 39px;
    font-size: 13px;
    > span:last-of-type {
      color: @theme;
      cursor: pointer;
    }
  }
}
</style>
