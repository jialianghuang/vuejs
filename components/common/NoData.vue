<template>
  <div :style="{ marginTop: marginTop }" class="no-data">
    <img :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/00/1a/26b6d57e908a2b6600a3bc42f141001a.png')" alt="no data" />
    <p>{{ nl(text) }}</p>
  </div>
</template>
<script>
/**
 * 空数据时展示的图文提示组件
 */
export default {
  props: {
    text: {
      type: String,
      default: 'page_coupon_list_empty'
    },
    marginTop: {
      type: String,
      default: '10%'
    }
  }
}
</script>
<style lang="less" scoped>
.no-data {
  text-align: center;
  font-size: 16px;
  line-height: 22px;
  font-family: @font-family-500;
  margin-top: 10%;
  img {
    width: 282px;
    display: block;
    margin: 0 auto;
    margin-bottom: 35px;
    filter: grayscale(1);
  }
}
</style>
