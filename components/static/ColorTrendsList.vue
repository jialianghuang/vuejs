<template>
  <div class="mid_block_list">
    <div v-for="(themeItem, key) in lists" :key="key" class="mid_block">
      <div class="mid_div">
        <img :src="replaceImgCdnUrl(themeItem.theme.imgUrl)" :alt="themeItem.theme.alt" class="desc_img" />
        <input type="hidden" class="mid_title" />
      </div>
      <div v-for="(item, name) in themeItem.color" :key="name" :class="[getName(name)]" class="mid_block_item">
        <a :href="countryUrl(item.linkUrl)" class="mid_link">
          <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.alt" />
          <div class="link_name">{{ item.linkName }} >></div>
        </a>
        <div class="popular_styles img_swipper clearfix">
          <h3 class="module_name">{{ item.goodsListTitle }}</h3>
          <product-list-swiper :prodList="getProdlist(item)" :hasHoverStyle="true" :swiperCount="6"></product-list-swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductListSwiper from '@/components/static/ProductListSwiper'

export default {
  name: 'ColorTrendsList',
  components: {
    ProductListSwiper
  },
  props: {
    lists: {
      type: Object,
      default() {
        return {}
      }
    },
    linkTarget: {
      type: String,
      default: '_blank'
    }
  },
  methods: {
    getProdlist(list) {
      return (list.goodsList || []).map((item) => {
        return {
          eventCategory: list.eventCategory,
          eventName: list.eventName,
          linkUrl: item.goodsUrl,
          imgUrl: item.imgUrl,
          imgAlt: item.goodsName,
          title: item.goodsName,
          text: item.shownColor,
          noDealPrice: item.noDealPriceDisplay,
          shopPrice: item.shopPriceDisplay
        }
      })
    },
    getName(key) {
      return key.replace(/\s+/g, '_').replace(/[A-Z]/g, ($) => ($ ? $.toLocaleLowerCase() : $)) + '_block'
    }
  }
}
</script>

<style lang="less" scoped>
h3 {
  font-family: @font-family-500;
  font-size: 24px;
  color: var(--color-121212);
  font-weight: 400;
  text-transform: uppercase;
  margin: 70px 0 20px;
}
// .mid_block_list {
//   margin-top: 70px;
// }
.mid_block {
  margin-top: 70px;
  .mid_block_item {
    margin-top: 70px;
    padding-bottom: 70px;
    border-bottom: 1px solid var(--color-eeeeee);
  }
  &:last-child .mid_block_item:last-child {
    border-bottom: none;
  }
  .desc_img {
    max-width: 100%;
  }
  .mid_title {
    font-family: 'Libre Baskerville Regular';
    font-weight: bold;
    color: var(--color-121212);
    font-size: 28px;
  }
  .separator {
    width: 60px;
    height: 4px;
    margin: 20px 0 30px;
    background: var(--color-121212);
  }
  .mid_txt {
    font-family: @font-family-500;
    color: var(--color-121212);
    font-size: 16px;
    line-height: 26px;
    margin-bottom: 28px;
  }
  .mid_link {
    img {
      max-width: 100%;
    }
  }
  .link_name {
    margin-top: 5px;
    color: var(--color-121212);
    text-decoration: underline;
    font-family: @font-family-500;
    font-size: 14px;
    margin-left: 45px;
  }
}
.dusty_sage_block .link_name,
.dark_navy_block .link_name {
  margin-left: 495px;
}
</style>
