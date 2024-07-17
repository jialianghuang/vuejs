<template>
  <div class="show-book-content">
    <ul :class="getPageClass()" class="pages">
      <!--一个li.paper包含了正反两页-->
      <li
        v-for="(item, index) in bookList"
        :key="index"
        :style="{ zIndex: zIndex.list[index] }"
        :class="getIndexClass(index)"
        class="paper"
      >
        <!--一个.page就是一页内容-->
        <div :style="{ 'background-image': `url(${item.imgUrl[0]})` }" class="page page-front">
          <template v-if="item.label && item.label.length">
            <book-goods-info v-for="(goods, goodsIndex) in item.label" :key="goodsIndex" :goods="goods"></book-goods-info>
          </template>
        </div>
        <div :style="{ 'background-image': `url(${item.imgUrl[1]})` }" class="page page-back">
          <template v-if="item.labelBack && item.labelBack.length">
            <book-goods-info v-for="(goods, goodsIndex) in item.labelBack" :key="goodsIndex" :goods="goods"></book-goods-info>
          </template>
        </div>
      </li>
    </ul>
    <az-icon @click="changePage(-1)" v-show="showIndex" class="arraw-icon arraw-icon-left" icon-class="icon-lby_arrow_left" />
    <az-icon
      @click="changePage(1)"
      v-show="showIndex !== bookList.length"
      class="arraw-icon arraw-icon-right"
      icon-class="icon-lby_arrow_right"
    />
  </div>
</template>

<script>
import BookGoodsInfo from '@/components/static/show-book/BookGoodsInfo'

export default {
  name: 'BookTurn',
  components: {
    BookGoodsInfo
  },
  props: {
    bookList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      lastIndex: '',
      step: 0,
      showIndex: 0,
      zIndex: {
        list: {},
        max: 0
      },
      showLinkWaitTime: 1000, // 小于动画翻转一般效果
      showLinkIndex: 0,
      showLinkIndexId: 0
    }
  },
  created() {
    // 动态添加
    this.bookList.forEach((item, index) => {
      // this.$set(this.zIndex.list, index, index + 1)
      this.$set(this.zIndex.list, index, this.bookList.length - index)
    })
    this.zIndex.max = this.bookList.length
    // 当前的翻动
  },
  mounted() {
    this.$nextTick(() => {
      const page = this.solveHash()
      for (let i = 0; i < page; i++) {
        this.changePage(1)
      }
    })
  },
  methods: {
    solveHash() {
      const hash = this.$route.hash.replace(/#[^/]*\//, '')
      let page
      if (hash == 'cover') {
        page = 0
      }
      if (hash == 'closing-page') {
        page = this.bookList.length
      }
      page = hash.replace(/page[^-]*-/, '') / 2
      return page
    },
    changeHash() {
      const path = this.$route.path
      const bookName = this.$route.path.replace('/show-book/', '').toLocaleUpperCase()
      let pageName = ''
      if (this.showIndex == 0) {
        pageName = '/cover'
      } else if (this.showIndex == this.bookList.length) {
        pageName = '/closing-page'
      } else {
        pageName = '/page' + (this.showIndex * 2 - 1) + '-' + this.showIndex * 2
      }
      this.$router.push(path + '#' + bookName + pageName)
    },
    changePage(step) {
      let showIndex = this.showIndex + step
      showIndex = showIndex <= 0 ? 0 : showIndex
      showIndex = showIndex > this.bookList.length ? this.bookList.length : showIndex
      this.lastIndex = this.showIndex
      this.step = showIndex - this.showIndex
      this.showIndex = showIndex
      if (this.lastIndex != this.showIndex) {
        this.zIndex.list[this.step > 0 ? this.lastIndex : this.showIndex] = ++this.zIndex.max
        if (this.showLinkIndexId) clearTimeout(this.showLinkIndexId)
        this.showLinkIndex = ''
        this.showLinkIndexId = setTimeout(() => {
          this.showLinkIndex = this.showIndex
        }, this.showLinkWaitTime)
        this.changeHash()
      }
    },
    getIndexClass(index) {
      const cls = []
      if (this.showIndex > index) {
        cls.push('flip-to-left')
      }
      if (this.showIndex == index && this.step < 0) {
        cls.push('flip-to-right')
      }
      if (this.showLinkIndex - 1 === index && this.step > 0) {
        cls.push('current-left-page')
      } else if (this.showIndex == index) {
        cls.push('current-right-page')
      }
      if (this.showLinkIndex - 1 === index && this.step < 0) {
        cls.push('current-left-page-hide')
      }
      return cls
    },
    getPageClass() {
      if (this.showIndex === 0) {
        return ['move-to-left']
      }
      if (this.showIndex === this.bookList.length) {
        return ['move-to-right']
      }
    }
  }
}
</script>

<style lang="less" scoped>
@bookHeight: 600px;
@bookWidth: 884px;
.pages {
  width: @bookWidth;
  height: @bookHeight;
  margin: 0 auto;
  position: relative;
  z-index: 0;
  transition: all 0.3s ease-out;
  &.move-to-left {
    transform: translateX(-25%);
  }
  &.move-to-right {
    transform: translateX(25%);
  }
  .paper,
  .paper .page {
    width: @bookWidth / 2;
    height: @bookHeight;
  }
  .paper .page {
    background-repeat: no-repeat;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    &.page-front {
      background-position: 100% 0%;
      z-index: 1;
    }
    &.page-back {
      background-position: 0% 0%;
      transform: rotateY(180deg);
      z-index: 0;
    }
  }
}
.paper {
  // display: none;
  position: absolute;
  /* 默认放在右边 */
  right: 0;
  top: 0;
  transform-style: preserve-3d;
  box-shadow: 2px 2px 2px #ddd;
  &.current-right-page {
    .page-back {
      display: none;
    }
  }
  &.current-left-page,
  &.current-left-page-hide {
    .page-front {
      display: none;
    }
  }
  &.flip-to-left {
    transform-origin: left center;
    animation: flip-to-left 1s ease-in-out;
    animation-fill-mode: forwards;
  }
  &.flip-to-right {
    transform-origin: left center;
    animation: flip-to-right 1s ease-in-out;
    animation-fill-mode: forwards;
    .page-back {
      display: block;
    }
  }
}
@keyframes flip-to-left {
  0% {
    transform: perspective(2000px) rotateY(0);
  }
  100% {
    transform: perspective(2000px) rotateY(-180deg);
  }
}
@keyframes flip-to-right {
  0% {
    transform: perspective(2000px) rotateY(-180deg);
  }
  100% {
    transform: perspective(2000px) rotateY(0);
  }
}

.show-book-content {
  position: relative;
  .arraw-icon {
    position: absolute;
    top: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  .arraw-icon-left {
    left: 0;
    transform: translateY(-50%);
  }
  .arraw-icon-right {
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
