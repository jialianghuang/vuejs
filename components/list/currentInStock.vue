<template>
  <div id="current_in_stock" class="current-in-stock fl">
    <input id="stock_checkbox_input" v-model="ckeckVal" @change="changeStock()" class="current_in_stock_checkbox" type="checkbox" />
    <label id="stock_checkbox" for="stock_checkbox_input"
      ><span style="display:none">{{ ckeckVal }}</span></label
    >
    <span @click="changeStockTxt" class="current_in_stock_txt">{{ nl('page_current_in_stock') }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CurrentInStock',
  languageKeys: ['page_current_in_stock'],
  components: {},
  props: {},
  data() {
    return {
      ckeckVal: false
    }
  },
  computed: {
    ...mapState({
      currentInStock: (state) => state.list.currentInStock
    })
  },
  watch: {},
  mounted() {
    this.ckeckVal = this.currentInStock == 'yes'
  },
  methods: {
    changeStock(e) {
      if (this.ckeckVal) {
        this.setDataLayer({
          action: 'click',
          category: 'Sample',
          label: 'Sample_CurrentlyIn-Stock_Click'
        })
        this.$store.commit('list/setCurrentInStock', 'yes')
        this.$emit('currentInStockChange', 'yes')
      } else {
        this.$store.commit('list/setCurrentInStock', 'no')
        this.$emit('currentInStockChange', 'no')
      }
    },
    changeStockTxt() {
      this.ckeckVal = !this.ckeckVal
      this.changeStock()
    },
    setUrlParam(url, arg, argVal) {
      const pattern = arg + '=([^&]*)'
      const replaceText = arg + '=' + argVal
      if (url.match(pattern)) {
        let tmp = '/(' + arg + '=)([^&]*)/gi'
        tmp = url.replace(this.eval(tmp), replaceText)
        return tmp
      } else {
        const baseUrl = url.split('#')
        if (url.match('[?]')) {
          url = baseUrl[0] + '&' + replaceText
        } else {
          url = baseUrl[0] + '?' + replaceText
        }
        return url + (baseUrl[1] ? baseUrl[1] : '')
      }
    },
    eval(fn) {
      const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
      return new Fn('return ' + fn)()
    }
  }
}
</script>

<style lang="less" scoped>
.current-in-stock {
  padding: 5px 0 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .current_in_stock_checkbox {
    visibility: hidden;
    width: 12px;
    height: 12px;
    margin-right: 5px;
  }
  .current_in_stock_txt {
    color: var(--color-121212);
    font-size: 13px;
    line-height: 16px;
  }
  #stock_checkbox {
    margin-right: 5px;
    border-radius: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    cursor: pointer;
    position: absolute;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
  }

  #stock_checkbox_input:checked {
    & + #stock_checkbox {
      border: 1px solid var(--color-121212);
      &::before {
        display: block;
        content: '\2713';
        text-align: center;
        font-size: 12px;
        color: var(--color-121212);
        width: 12px;
        height: 12px;
        box-sizing: border-box;
        margin-top: -3px;
        margin-left: 0;
        transform: scale(0.8);
      }
    }
  }
}
</style>
