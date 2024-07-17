<template>
  <div v-html="content" class="sale-seo-content"></div>
</template>

<script>
export default {
  name: 'NewArrivalSeoContent',
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
.sale-seo-content {
  width: 100%;
  padding: 0 30px;
  max-width: 1353px;
  margin: 0 auto 60px;
  h1,
  h2 {
    letter-spacing: 1px;
    font-size: 24px;
    font-weight: 400;
    text-transform: uppercase;
    color: var(--color-121212);
  }
  h1 {
    margin: 20px 0 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
  p {
    margin-bottom: 13px;
    color: var(--color-121212);
    width: 100%;
    letter-spacing: 0.01em;
    word-break: keep-all;
    line-height: 1.5em;
    &.wide {
      width: 100%;
    }
  }
  a {
    font-weight: 400;
    color: var(--color-121212);
    text-decoration: underline;
  }
  h3 {
    margin-top: 13px;
    font-size: 13px;
    font-weight: 700;
  }
}
</style>
