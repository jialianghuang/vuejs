<template>
  <div class="cate-nav-menu">
    <ul class="cate-nav-menu-list">
      <li v-for="(item, index) in list" :key="index" class="cate-nav-menu-item">
        <a :href="countryUrl(item.url)">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * 横条分类导航菜单，多出来的横向滚动
 * 用在列表商品底部
 */
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cate-nav-menu {
  overflow: auto;
  margin-bottom: 20px;
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 2px;
  }
  &-list {
    display: flex;
    align-items: center;
    padding: 15px 0 11px;
  }
  &-item {
    margin-right: 20px;
    font-size: 13px;
    line-height: 16px;
    text-transform: capitalize;
    white-space: nowrap;
    cursor: pointer;
    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>
