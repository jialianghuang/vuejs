<template>
  <div v-if="totalPage > 1" class="az-pager-box">
    <div class="pager-num">
      <template v-if="totalPage > 5">
        <template v-if="curPage - 2 > 1">
          <span :class="{ cur: curPage == 1 }" @click="itemClick(1)" :aria-label="item" class="num-item">1</span>
          <span class="dot">...</span>
        </template>
        <span
          v-for="item in getList(curPage - 2, curPage + 2)"
          :key="item"
          :aria-label="item"
          :class="{ cur: curPage == item }"
          @click="itemClick(item)"
          class="num-item"
        >
          {{ item }}
        </span>
        <template v-if="curPage + 2 < totalPage">
          <span class="dot">...</span>
          <span :class="{ cur: curPage == totalPage }" @click="itemClick(totalPage)" :aria-label="totalPage" class="num-item">
            {{ totalPage }}
          </span>
        </template>
      </template>
      <template v-else>
        <span
          v-for="item in getList(1, totalPage)"
          :key="item"
          :aria-label="item"
          :class="{ cur: curPage == item }"
          @click="itemClick(item)"
          class="num-item"
          >{{ item }}</span
        >
      </template>
    </div>
    <div class="pager-upon">
      <span :class="{ cur: curPage == 1 }" @click="prevClick" class="prev">
        <az-icon class="icon" icon-class="icon-lby_arrow_left" />
        <span class="name">{{ nl('page_pager_prev') }}</span>
      </span>
      <span class="line">|</span>
      <span :class="{ cur: curPage == totalPage }" @click="nextClick" class="next">
        <span class="name">{{ nl('page_pager_next') }}</span>
        <az-icon class="icon" icon-class="icon-lby_arrow_right" />
      </span>
    </div>
  </div>
</template>

<script>
import azIcon from './../AzIcon'
export default {
  name: 'AzPager',
  languageKeys: ['page_pager_prev', 'page_pager_next'],
  components: {
    azIcon
  },
  props: {
    totalPage: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: ''
    }
  },
  computed: {
    curPage: {
      get() {
        return this.page
      },
      set(newValue) {
        this.$emit('pageChange', newValue, this.type)
      }
    }
  },
  methods: {
    getList(left, right) {
      const res = []
      for (let i = left; i <= right; i++) {
        if (i >= 1 && i <= this.totalPage) {
          res.push(i)
        }
      }
      while (res.length < 5 && (res[0] > 1 || res[res.length - 1] < this.totalPage)) {
        if (res[0] > 1) {
          res.unshift(res[0] - 1)
        } else {
          res.push(res[res.length - 1] + 1)
        }
      }
      return res
    },
    itemClick(val) {
      if (this.$route.name == 'list') {
        this.setPoint('select page bottom', this.catBiName + '_button', 'click', { index: val })
        this.setPoint('select page bottom', this.catBiName + '_button', 'click')
      }

      if (this.isLoading) return
      if (val == this.curPage) return
      this.type = 'page'
      this.curPage = val
    },
    prevClick() {
      if (this.isLoading) return
      if (this.curPage == 1) return
      this.type = 'prev'
      this.curPage--
      if (this.$route.name == 'list') {
        this.setPoint('select page bottom', this.catBiName + '_button', 'click')
      }
      if (this.$route.name == 'showroom') {
        this.setPoint('reviews', 'previouspage', 'click')
      }
    },
    nextClick() {
      if (this.isLoading) return
      if (this.curPage == this.totalPage) return
      this.type = 'next'
      this.curPage++
      if (this.$route.name == 'list') {
        this.setPoint('select page bottom', this.catBiName + '_button', 'click')
      }
      if (this.$route.name == 'showroom') {
        this.setPoint('reviews', 'nextpage', 'click')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.az-pager-box {
  font-size: 13px;
  text-align: center;
  .pager-num {
    margin-bottom: 11px;
    color: #666;
    .num-item {
      padding: 5px;
      color: #666;
      cursor: pointer;
      text-decoration: underline;
      &:not(.cur):hover {
        color: @theme-color;
      }
      &.cur {
        color: #666;
        cursor: auto;
        text-decoration: none;
      }
      &.dot {
        cursor: auto;
        text-decoration: none;
      }
    }
  }
  .pager-upon {
    .prev,
    .next {
      padding: 5px;
      color: #666;
      cursor: pointer;
      &:not(.cur):hover {
        color: @theme-color;
      }
      &.cur {
        color: #ccc;
        cursor: auto;
      }
      .icon {
        font-size: 10px;
        width: 10px;
        height: 10px;
        vertical-align: inherit;
        fill: currentColor;
      }
    }
    .name {
      text-transform: uppercase;
    }
  }
}
</style>
