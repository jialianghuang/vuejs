<template>
  <div class="help-menu">
    <h2 class="title">{{ helpMenu.title }}</h2>
    <div v-if="helpMenu.deepMenu && Object.keys(helpMenu.deepMenu).length" class="deep-menu">
      <ul>
        <li v-for="(item, index) in helpMenu.deepMenu" :key="index" :class="index">
          <a :href="countryUrl(item.linkUrl)" :class="{ cur: item.linkUrl == $route.path.substr(1) }">{{ item.title }}</a>
        </li>
      </ul>
    </div>
    <div v-if="helpMenu.lightMenu && Object.keys(helpMenu.lightMenu).length" class="light-menu">
      <ul>
        <li v-for="(item, index) in helpMenu.lightMenu" :key="index" :class="index">
          <a :href="countryUrl(item.linkUrl)" :class="{ cur: item.linkUrl == $route.path.substr(1) }">{{ item.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HelpMenu',
  props: {
    helpMenu: {
      type: Object,
      default() {
        return {}
      }
    },
    currentMenuTitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.help-menu {
  float: left;
  width: 180px;
  .title {
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-cccccc);
    padding-bottom: 5px;
  }
  .deep-menu {
    padding-top: 15px;
    a {
      color: var(--color-121212);
      cursor: pointer;
    }
  }
  .light-menu {
    padding-top: 50px;
    a {
      color: #999;
      cursor: pointer;
    }
  }
  li {
    margin-bottom: 10px;
    font-size: 13px;
    font-family: @font-family-500;
    text-transform: uppercase;
  }
  a {
    &.cur,
    &:hover {
      color: @theme;
    }
  }
}
</style>
