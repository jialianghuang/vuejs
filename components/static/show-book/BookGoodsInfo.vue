<template>
  <div
    v-if="goods.linkUrl && goods.imgUrl"
    :style="goods.position"
    style="width: auto; height: auto; position: absolute; cursor: pointer;"
    class="book-goods"
  >
    <img src="~assets/images/static/hotspot.png" alt="show book" style="vertical-align: middle;" />
    <div
      class="goods_detail_show"
      style="border-bottom: 15px solid white; border-left: 15px solid transparent; border-right: 15px solid transparent; width: 0px; height: 0px"
    ></div>
    <a :href="countryUrl(goods.linkUrl)" :style="boxStyle" target="_blank" class="goods_detail_show goods_detail_link"
      ><div style="padding-right: 10px; height: 100%; float: left">
        <img :src="replaceImgCdnUrl(goods.imgUrl)" :alt="goods.title" style="width: 74px; height: 102px;" />
      </div>
      <div style="width: 280px; height: 102px">
        <h3 class="h3-text">
          {{ goods.title }}
        </h3>
        <p class="p-text">
          {{ goods.desc }}
        </p>
      </div></a
    >
  </div>
</template>

<script>
export default {
  name: 'BookGoodsInfo',
  props: {
    goods: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    boxStyle() {
      const pageWidth = 442
      const leftPer = this.goods.position.match(/left:\s*([0-9]*)/)
      let left = 0
      if (leftPer) {
        left = leftPer[1] / 100
      }
      if (pageWidth * left <= 10) {
        return 'margin-left: 0'
      } else if (pageWidth * left <= 50) {
        return `margin-left: -${pageWidth * left - 10}px`
      } else if (pageWidth * (1 - left) <= 30) {
        return `margin-left: -260px`
      } else if (pageWidth * (1 - left) <= 310) {
        return `margin-left: ${pageWidth * (1 - left) - 310}px`
      } else {
        return 'margin-left: -40px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.book-goods {
  &:hover {
    .goods_detail_show {
      display: block;
    }
  }
  .goods_detail_show {
    display: none;
    .h3-text {
      font-family: @font-family-600, sans-serif;
      color: var(--color-121212);
      font-size: 14px;
    }
    .p-text {
      font-family: @font-family-500, sans-serif;
      color: var(--color-121212);
      font-size: 13px;
      line-height: 18px;
      margin-top: 10p;
    }
  }
  .goods_detail_link {
    padding: 10px;
    width: 280px;
    height: 102px;
    background-color: white;
    margin-left: -40px;
    border-radius: 10px;
  }
}
</style>
