<template>
  <div v-track.view.click="{ common: getBiParams('4banner') }" class="list-top-banner-box">
    <div v-for="(item, index) in squaresBanner" :key="`${index}_${item.alt}`" class="item">
      <a :href="countryUrl(item.linkUrl)" v-track.view.click="{ common: getBiParams('slide') }">
        <img :src="addWebpSuffix(item.imgUrl)" :alt="nl(item.alt)" class="img" />
        <div class="txt">{{ nl(item.alt) }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListTopBanner',
  languageKeys: [
    // 接口返回多语言code
    'page_list_topbanner_mob_specialty',
    'page_list_topbanner_mob_classic',
    'page_list_topbanner_mob_trendy',
    'page_list_topbanner_mob_tryathome',
    'page_list_topbanner_mob_bestseller',
    'page_list_topbanner_bd_chiffon',
    'page_list_topbanner_bd_stretchsatin',
    'page_list_topbanner_bd_mesh',
    'page_list_topbanner_bd_shopbycolor',
    'page_list_topbanner_wd_fairytale',
    'page_list_topbanner_wd_modernsleek',
    'page_list_topbanner_wd_sexy_glam'
  ],
  props: {
    squaresBanner: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    getBiParams(el) {
      return {
        ec: 'listpage_topbanner',
        el,
        msg: JSON.stringify({
          cat_id: this.catId,
          category_ids: this.catIds,
          cat_name: this.seoCatName || this.catName,
          dress_type: this.dressType
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list-top-banner-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  .item {
    width: calc((100% - 45px) / 4);
    &:hover {
      .txt {
        color: @theme-color;
      }
    }
    .img {
      vertical-align: middle;
      width: 100%;
      height: auto;
    }
    .txt {
      font-size: 13px;
      line-height: 18px;
      margin-top: 10px;
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-600;
      text-transform: uppercase;
    }
  }
}
</style>
