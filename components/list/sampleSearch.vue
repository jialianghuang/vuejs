<template>
  <div id="sample_search" :class="{ ml20: isShowOrderFilter }" class="sample-search fl">
    <span v-if="showLabel" class="title">{{ nl('page_search_producname') }}&nbsp;</span>
    <form id="sampleSearch" :style="{ width: width + 'px' }">
      <label for="input_text">
        <span style="display: none">{{ placeTxt }}</span>
      </label>
      <input
        id="input_text"
        :placeholder="placeTxt"
        v-model="q"
        @focus="delPlaceHolder()"
        @blur="setPlaceHolder()"
        @keyup.enter="sampleSearchClick"
        :style="{ width: width + 'px' }"
        type="text"
        name="q"
        class="input_text"
        aria-label="input"
      />
      <label for="searchId">
        <span style="display: none">{{ nl('page_search_desc') }}</span>
      </label>
      <input id="searchId" @click="sampleSearchClick" value class="search" readonly aria-label="search" />
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SampleSearch',
  languageKeys: ['page_search_producname', 'page_search_desc', 'page_placeholder_grace'],
  components: {},
  props: {
    isShowOrderFilter: {
      type: Boolean,
      default() {
        return false
      }
    },
    searchQ: {
      type: String,
      default() {
        return ''
      }
    },
    isFromSearch: {
      type: Boolean,
      default: false
    },
    searchDressType: {
      type: String,
      default() {
        return ''
      }
    },
    // 是否展示label，默认true，13063新需求调整，取消label，缩小宽度
    showLabel: {
      type: Boolean,
      default: true
    },
    // form宽度
    width: {
      type: Number,
      default: 175
    }
  },
  data() {
    return {
      placeTxt: this.nl('page_placeholder_grace'),
      q: this.searchQ
    }
  },
  computed: {
    ...mapState('list', ['isOutlet', 'filters'])
  },
  watch: {},
  mounted() {
    this.setPlaceHolder()
  },
  methods: {
    delPlaceHolder() {
      this.placeTxt = ''
    },
    setPlaceHolder() {
      if (!this.q || this.q == '') {
        if (!this.showLabel) {
          // 如果不显示label，将label内容设为placeholder
          this.placeTxt = this.nl('page_search_producname')
            .toLowerCase()
            .split(':')[0]
        } else {
          this.placeTxt = this.nl('page_placeholder_grace')
        }
      }
    },
    sampleSearchClick() {
      if (this.isFromSearch) {
        if (this.searchQ == this.q) return
        this.$emit('sampleSearchChange', {
          q: this.q,
          dress_type: this.searchDressType
        })
      } else {
        let discount = ''
        for (const i in this.filters) {
          const item = this.filters[i]
          if (['discount', 'discountoff'].includes(item.key)) {
            for (const key in item.values) {
              if (item.values[key].selected) {
                discount = item.values[key].value
              }
            }
          }
        }
        const catId = this.catId || -1
        let linkUrl = `/search?q=${this.q}&dress_type=${this.searchDressType}&cat_id=${catId}`
        if (discount) {
          linkUrl = linkUrl + '&discount=' + discount
        }
        if (this.isOutlet == 1) {
          linkUrl += '&is_outlet=1'
        }
        location.href = linkUrl
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sample-search {
  padding: 5px 0 5px;
  display: flex;
  align-items: center;
  // &.ml20 {
  //   margin-left: 20px;
  // }
  form {
    position: relative;
    display: inline-block;
    width: 175px;
    height: 31px;
    margin-left: 3px;
    input {
      position: absolute;
      border: 1px solid #ccc;
      width: 175px;
      line-height: 32px;
      -webkit-appearance: none;
      -moz-appearance: none;
      outline: 0;
      padding: 0 22px 0 10px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      background: #fff;
      height: 32px;
      &::placeholder {
        text-transform: capitalize;
      }
    }
    .search {
      position: absolute;
      top: 10px;
      right: 9px;
      background: url(~assets/images/head_fixed_search.png) no-repeat;
      width: 11px;
      height: 11px;
      display: inline-block;
      padding: 0;
      border: 0;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>
