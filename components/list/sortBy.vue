<template>
  <div id="sort_by" class="sort-by fl">
    <span class="sort-type-title">{{ nl('page_search_sort') }}:&nbsp;</span>
    <div class="select-box">
      <div @click.stop="openValue" class="input">
        <label for="sortByInput">
          <span style="display: none">select</span>
          <input id="sortByInput" v-model="sortByText" aria-label="sortByInput" type="text" readonly />
        </label>
        <svg class="icon select_title-icon">
          <use xlink:href="#icon-lby_expand_arrow_down"></use>
        </svg>
      </div>
      <client-only>
        <div v-show="show" class="orderby-select">
          <ul>
            <li @click="getvalue(item)" v-for="(item, key) in sortTypes" :key="key">{{ item.name }}</li>
          </ul>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SortBy',
  languageKeys: ['page_search_sort'],
  props: {
    sortTypes: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState({
      sortBy: (state) => state.list.sortBy
    }),
    sortByText: {
      get() {
        let temp = ''
        for (const key in this.sortTypes) {
          if (this.sortTypes.hasOwnProperty(key)) {
            const element = this.sortTypes[key]
            if (element.selected) {
              temp = element.name
              this.$store.commit('list/setSortBy', element.key)
              break
            }
          }
        }
        return temp
      },
      set(newValue) {
        console.log(newValue)
      }
    },
    biMsgAll() {
      return {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
    }
  },
  mounted() {
    if (this.jsKey == 'list') {
      this.setPoint('sortby', this.catBiName + '_sortby', 'view', this.biMsgAll)
    }
    document.documentElement.addEventListener('click', () => {
      this.show = false
    })
  },
  methods: {
    // 点开选项框
    openValue() {
      this.show = !this.show
      if (this.jsKey == 'list') {
        this.setPoint('sortby', this.catBiName + '_popup', 'view', this.biMsgAll)
      } else {
        this.setPoint('sortby', this.catBiName + '_popup', 'view')
      }
      // 这里是原az的代码逻辑，感觉打点不全面，看以后的产品提需求把，先用az的
      const keyArr = ['featured', 'top_rated', 'new-arrival']
      const keyLayerArr = ['Featured', 'TopRated', 'Newest']
      keyArr.forEach((item, index) => {
        if (this.sortTypes[item]) {
          this.setDataLayer({
            action: 'view',
            category: 'SortBy',
            label: `SortBy_${keyLayerArr[index]}_View`
          })
        }
      })
    },
    // 选中sort by 类型
    getvalue(item) {
      if (['list', 'search'].includes(this.jsKey)) {
        this.setPoint('sortby', this.catBiName + item.name.toLowerCase(), 'click', this.biMsgAll)
      }
      if (this.sortBy === item.key) return
      this.$emit('sortByChange', item.key)
      this.$store.commit('list/setSortBy', item.key)
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.sort-by {
  font-family: @font-family-500;
  color: var(--color-121212);
  display: flex;
  align-items: center;
  padding: 5px 0 5px;
  .sort-type-title {
    vertical-align: top;
    line-height: 30px;
  }
  .select-box {
    position: relative;
    width: 175px;
    height: 32px;
    display: inline-block;
    cursor: pointer;
    color: var(--color-121212);
    .select_title-icon {
      position: absolute;
      top: 10px;
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
      width: 100%;
      height: 100%;
      line-height: 30px;
      border: 1px solid var(--color-cccccc);
      position: absolute;
      padding: 0 10px;
      box-sizing: border-box;
      input {
        border: none;
        outline: none;
        padding: 0;
        cursor: pointer;
        color: var(--color-121212);
        width: 100%;
        &:focus {
          background: #fff;
        }
      }
    }
    .orderby-select {
      width: 175px;
      border: 1px solid var(--color-cccccc);
      overflow: hidden;
      position: absolute;
      top: 32px;
      background-color: #fff;
      box-sizing: border-box;
      border-top: none;
      z-index: @z-index-4;
      ul li {
        box-sizing: border-box;
        height: 30px;
        cursor: pointer;
        line-height: 30px;
        padding-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &:hover {
          background: #f6f6f6;
        }
      }
    }
  }
}
</style>
