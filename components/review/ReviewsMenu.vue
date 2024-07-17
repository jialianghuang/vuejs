<template>
  <div class="reviews-menu">
    <h2>{{ nl('page_common_review_by_category') }}</h2>
    <ul>
      <li v-for="(item, index) in summaryNotZero" :key="index">
        <a v-if="item.selected" href="javascript:void(0)" class="selected">{{ item.showName }} ({{ item.total }})</a>
        <a v-else :href="getHref(item)" class="canclick">{{ item.showName }} ({{ item.total }})</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ReviewsMenu',
  components: {},
  props: {
    summary: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    summaryNotZero() {
      const temp = []
      for (let index = 0; index < this.summary.length; index++) {
        const element = this.summary[index]
        if (element.total > 0) {
          temp.push(element)
        }
      }
      return temp
    }
  },
  created() {},
  mounted() {},
  methods: {
    getHref(item) {
      return item.catId == 1 ? `/reviews` : `/reviews/category/${item.catName}${this.$store.state.isBridal ? '?subsite=bridal' : ''}`
    }
  }
}
</script>

<style lang="less" scoped>
.reviews-menu {
  display: block;
  width: 183px;
  margin-right: 28px;
  border: 0px solid blue;
  h2 {
    height: 40px;
    line-height: 20px;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-121212);
    font-size: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  ul {
    padding-top: 6px;
    li {
      line-height: 15px;
      margin-bottom: 15px;
      a {
        text-transform: uppercase;
        color: var(--color-121212);
        &.selected {
          color: @theme-color;
        }
        &.count0 {
          color: #666;
        }
        &.canclick {
          &:hover {
            color: @theme-color;
          }
        }
      }
    }
  }
}
</style>
