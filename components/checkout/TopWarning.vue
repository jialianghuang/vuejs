<template>
  <div id="top-warning" v-show="Object.keys(topWarning).length > 0">
    <p v-for="(item, index) in topWarning" :key="index" v-html="item.msg"></p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TopWarning',
  computed: {
    ...mapState('checkout', ['topWarning'])
  }
}
</script>

<style lang="less" scoped>
#top-warning {
  border: 1px solid #d77ea9;
  background: var(--color-f1e9e6);
  color: var(--color-121212);
  font-size: 13px;
  padding: 8px;
  margin: 8px auto 15px;
}
</style>
