<template>
  <div class="filter-shop-by-style">
    <p class="fsbs-common-title fsbs-title">{{ nl('page_footer_menu_shop_by_style') }}</p>
    <section :class="['fsbs-filter-box', { less: list.length <= 10 }]">
      <a v-for="(item, index) in list" :key="index" :href="countryUrl(item.url)" class="fsbs-common-title fsbs-filter-box-item">
        {{ item.title }}
      </a>
    </section>
    <p v-if="list.length > 10" @click="showMore" class="fsbs-view-more">{{ nl(viewText) }}</p>
  </div>
</template>

<script>
export default {
  name: 'FilterShopByStyle',
  languageKeys: ['page_footer_menu_shop_by_style', 'page_common_view_less', 'page_common_view_more'],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      viewMore: false
    }
  },
  computed: {
    viewText({ viewMore }) {
      return viewMore ? 'page_common_view_less' : 'page_common_view_more'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getFilterBoxMaxHeight()
    })
  },
  methods: {
    showMore() {
      this.viewMore = !this.viewMore
      this.getFilterBoxMaxHeight()
    },
    getFilterBoxMaxHeight() {
      if (process.client) {
        const boxDom = document.querySelector('.fsbs-filter-box')
        const boxItemDoms = document.querySelectorAll('.fsbs-filter-box-item')
        let maxHeight = 0
        boxItemDoms.forEach((item, index) => {
          if (this.viewMore) {
            maxHeight += item.getBoundingClientRect().height + 30
          } else if (index <= 9) {
            maxHeight += item.getBoundingClientRect().height + 30
          }
        })
        boxDom.style.setProperty('max-height', maxHeight + 'px')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.filter-shop-by-style {
  padding: 20px 0;
  box-shadow: 0 1px 0 #eee;
  .fsbs-title {
    margin-bottom: 20px;
    text-transform: uppercase;
  }
  .fsbs-filter-box {
    transition: all 0.2s ease;
    overflow: hidden;
    .fsbs-filter-box-item {
      display: block;
      margin-bottom: 30px;
      text-transform: capitalize;
    }
    &.less {
      .fsbs-filter-box-item:last-child {
        margin-bottom: 0;
      }
    }
  }
  .fsbs-common-title {
    font-family: @font-family-600;
    font-size: 13px;
    line-height: 18px;
    color: var(--color-121212);
  }
  .fsbs-view-more {
    font-family: @font-family-500;
    font-size: 13px;
    line-height: 18px;
    color: var(--color-121212);
    text-transform: uppercase;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
