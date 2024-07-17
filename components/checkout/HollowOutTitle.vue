<template>
  <div class="hollow-out-title">
    <h2 class="title">{{ title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'HollowOutTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.hollow-out-title {
  display: flex;
  align-items: center;
  background: #fff;
  text-transform: uppercase;
  .title {
    border-top: 1px solid var(--color-121212);
    border-bottom: 1px solid var(--color-cccccc);
    padding: 6px 0;
    width: 100%;
  }
}
</style>
