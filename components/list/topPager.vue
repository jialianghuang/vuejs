<template>
  <div id="top_pager" v-if="totalPage > 1" class="top-pager fr">
    <div class="pager">
      <div class="pager-total">
        <template v-if="isFromSearch">
          <span class="title txt">{{ nl('page_search_page_desc') }}</span>
          <span class="txt">{{ curPage }}</span>
          <span class="txt"> {{ nl('page_common_of') }} {{ totalPage }} </span>
        </template>
        <template v-else>
          <span class="title txt">{{ nl('page_search_select_desc') }}</span>
          <div class="select-box">
            <div @click.stop="openValue" class="input">
              <label>
                <span style="display: none">select</span>
                <input v-model="curPage" readonly type="text" />
              </label>
              <svg class="icon select_title-icon">
                <use xlink:href="#icon-lby_expand_arrow_down"></use>
              </svg>
            </div>
            <div v-show="show" class="pager-select">
              <ul>
                <li v-for="(item, index) in getList(1, totalPage)" :key="index" @click="pagerClick(item)">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <span class="txt txt-of-page"> {{ nl('page_common_of') }} {{ totalPage }} </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopPager',
  languageKeys: ['page_search_page_desc', 'page_common_of', 'page_search_select_desc'],
  components: {},
  props: {
    totalPage: {
      type: Number,
      default: 0
    },
    page: {
      type: [String, Number],
      default: 1
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isFromSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    curPage: {
      get() {
        return this.page
      },
      set(newValue) {
        this.$emit('pageChange', newValue)
      }
    }
  },
  watch: {},
  mounted() {
    if (this.$route.name == 'list' && this.totalPage > 1) {
      this.buryPoint(this, 'event', {
        ec: 'selectpagetop',
        el: this.catBiName + '_button',
        ea: 'view',
        msg: JSON.stringify({
          cat_id: this.catId,
          category_ids: this.catIds,
          cat_name: this.seoCatName || this.catName,
          dress_type: this.dressType
        })
      })
    }
    document.documentElement.addEventListener('click', () => {
      this.show = false
    })
  },
  methods: {
    getList(left, right) {
      const res = []
      for (let i = left; i <= right; i++) {
        if (i >= 1 && i <= this.totalPage) {
          res.push(i)
        }
      }
      return res
    },
    pagerClick(item) {
      if (this.$route.name == 'list') {
        this.buryPoint(this, 'event', {
          ec: 'selectpagetop',
          el: this.catBiName + '_button',
          ea: 'click',
          msg: JSON.stringify({
            index: item,
            cat_id: this.catId,
            category_ids: this.catIds,
            cat_name: this.seoCatName || this.catName,
            dress_type: this.dressType
          })
        })
      }
      this.show = !this.show
      if (item == this.curPage) return
      this.curPage = item
      this.$emit('pageChange', item)
    },
    openValue() {
      if (this.$route.name == 'list') {
        this.buryPoint(this, 'event', {
          ec: 'selectpagetop',
          el: this.catBiName + '_popup',
          ea: 'view',
          msg: JSON.stringify({
            cat_id: this.catId,
            category_ids: this.catIds,
            cat_name: this.seoCatName || this.catName,
            dress_type: this.dressType
          })
        })
      }
      this.show = !this.show
    }
  }
}
</script>

<style lang="less" scoped>
.top-pager {
  font-family: @font-family-500;
  color: var(--color-121212);
  padding: 5px 0 5px;
  display: flex;
  align-items: center;
  .txt {
    vertical-align: top;
    line-height: 30px;
  }
  .txt-of-page {
    padding: 5px;
  }
  .select-box {
    display: inline-block;
    margin: 0 2px 0 8px;
    position: relative;
    width: 56px;
    height: 32px;
    vertical-align: top;
    cursor: pointer;
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
      cursor: pointer;
      input {
        border: none;
        outline: none;
        padding: 0;
        width: 100%;
        cursor: pointer;
        &:focus {
          background: #fff;
        }
      }
    }
    .pager-select {
      width: 56px;
      border: 1px solid var(--color-cccccc);
      overflow: hidden;
      position: absolute;
      top: 32px;
      z-index: @z-index-4;
      background-color: #fff;
      text-align: left;
      max-height: 182px;
      height: auto;
      overflow: auto;
      box-sizing: border-box;
      border-top: none;
      ul li {
        height: 30px;
        padding-left: 10px;
        padding: 0 10px;
        line-height: 30px;
        font-family: @font-family-500, sans-serif;
        cursor: pointer;
        &:hover {
          background: #f6f6f6;
        }
      }
    }
  }
}
</style>
