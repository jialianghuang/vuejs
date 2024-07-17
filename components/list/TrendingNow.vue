<template>
  <div v-if="!!list.length" class="sod-trending-now">
    <p class="sod-trending-now-title">{{ nl('page_common_trending_now') }}</p>
    <div class="sod-trending-now-items">
      <a v-for="(item, index) in list" :key="index" :href="countryUrl(item.url)">
        <span v-track.view.click="getCommon()">{{ item.title }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import { getSourceTagFun } from '@/assets/js/commonFun'

export default {
  name: 'TrendingNow',
  languageKeys: ['page_common_trending_now'],
  props: {
    list: {
      type: [Array],
      default: () => []
    }
  },
  methods: {
    getCommon() {
      const path = this.$route.path
      const query = this.$route.query
      return {
        common: {
          ec: 'trendingnow',
          el: 'trendingnow',
          msg: JSON.stringify({
            lp_type: getSourceTagFun(path, query, true, null, this, this.catId)
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sod-trending-now {
  background-color: #fff;
  &-title {
    padding-bottom: 8px;
    font-family: @font-family-600;
    font-size: 24px;
    line-height: 33px;
    color: var(--color-121212);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    box-shadow: 0 1px 0 0 #ccc;
  }
  &-items {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    margin-bottom: 80px;
    row-gap: 10px;
    a {
      width: calc((100% - 80px) / 5);
      font-size: 16px;
      line-height: 22px;
      letter-spacing: 0.02em;
      color: var(--color-121212);
    }
  }
}
</style>
