<template>
  <div
    v-if="show"
    v-track.view.click="getBiCommonParams('Banner', 'recommend_listpage_banner')"
    @click="setOrderSourceFlag('recommend_list_page_banner', true)"
    :class="['popular-filter-banner', { stickyBox: stickyBox }]"
  >
    <p class="pfb-title">{{ goodsImg.name }}</p>
    <a :href="countryUrl(goodsImg.url.startsWith('/') ? goodsImg.url : '/' + goodsImg.url)" class="image-box">
      <template v-for="(item, index) in goodsImg.goodsImgUrlList">
        <img :key="index" :src="addWebpSuffix(item)" alt="filter banner" />
      </template>
    </a>
  </div>
</template>

<script>
export default {
  name: 'PopularFilterBanner',
  props: {
    stickyBox: {
      type: Boolean,
      default: false
    },
    goodsImg: {
      type: [Object, Array],
      default: () => {}
    }
  },
  computed: {
    show({ goodsImg }) {
      const { goodsImgUrlList = [] } = goodsImg
      return !!Object.keys(goodsImg).length && !!goodsImgUrlList.length
    }
  },
  methods: {
    getBiCommonParams(ec, el) {
      if (process.server) return
      const params = {
        common: {
          ec,
          el,
          msg: JSON.stringify({
            cat_id: this.catId,
            category_ids: this.catIds,
            cat_name: this.seoCatName || this.catName,
            dress_type: this.dressType
          })
        }
      }
      return params
    }
  }
}
</script>

<style lang="less" scoped>
.popular-filter-banner {
  overflow: hidden;
  background-color: var(--color-f9f9f9);
  margin-bottom: 12px;
  padding: 12px;
  &.stickyBox {
    margin-top: 10px;
  }
  .pfb-title {
    font-family: @font-Ivy-Mode-400;
    margin-bottom: 9px;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    text-transform: uppercase;
  }
  .image-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 6px;
    font-size: 0;
    img {
      width: 100%;
    }
  }
}
</style>
