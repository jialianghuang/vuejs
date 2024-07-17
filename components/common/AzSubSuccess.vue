<template>
  <div class="az-sub-success">
    <img :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/ee/9c/7d5b864290c377add646fc32bbf7ee9c.gif')" alt="success" />
    <p v-html="text1"></p>
    <a :href="countryUrl(linkUrl)" v-if="linkUrl" target="_blank">{{ linkText }}</a>
  </div>
</template>

<script>
export default {
  name: 'AzSubSuccess',
  components: {},
  props: {
    text1: {
      type: String,
      default: 'type1'
    },
    linkText: {
      type: String,
      default: 'type1'
    },
    linkUrl: {
      type: String,
      default: 'type1'
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.az-sub-success {
  text-align: center;
  color: var(--color-121212);
  img {
    width: 60px;
    margin-top: 60px;
    margin-bottom: 20px;
  }
  p {
    font-size: 13px;
    line-height: 18px;
    font-family: @font-family-500;
    color: var(--color-121212);
  }
  a {
    display: block;
    box-sizing: border-box;
    width: 184px;
    height: 40px;
    background: var(--color-121212);
    text-align: center;
    margin: 25px auto 0;
    font-size: 14px;
    font-family: @font-family-600;
    line-height: 40px;
    text-transform: uppercase;
  }
}
</style>
