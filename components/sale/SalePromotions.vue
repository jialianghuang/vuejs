<template>
  <div class="sale-promotions">
    <div class="title">{{ title }}</div>
    <div class="sub-title">{{ subTitle }}</div>
    <div class="promotions-list">
      <template v-for="(item, index) in categoryActivity">
        <div :key="`${item.cat_name}_${index}`" class="promotions-item">
          <a :href="countryUrl(item.url)" @click="setOrderSourceFlag('allsale_promotions', true)" target="_blank">
            <img
              :src="addWebpSuffix(item.image)"
              v-track.viewOnce.click="{ id: 'sale-promotions-img', common: { ec: 'allsale', el: `${item.cat_name}` } }"
              :alt="item.cat_name"
              class="img"
            />
            <div
              v-track.viewOnce.click="{ id: 'sale-promotions-title', common: { ec: 'allsale', el: `${item.cat_name}_title` } }"
              v-html="item.title"
              class="txt"
            ></div>
          </a>
        </div>
      </template>
      <!-- <i v-for="i in 5" :key="`promotions_${i}`" class="promotions-item"></i> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'SalePromotions',
  components: {},
  props: {
    categoryActivity: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.sale-promotions {
  color: var(--color-121212);
  .title {
    font-size: 32px;
    line-height: 44px;
    text-align: center;
    font-family: @font-family-600;
    color: var(--color-121212);
  }
  .sub-title {
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    letter-spacing: 0.02em;
    color: var(--color-121212);
    margin-top: 15px;
  }
  .promotions-list {
    margin-top: 30px;
    display: flex;
    // justify-content: space-between;
    justify-content: center;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-left: -29px;
    margin-right: -29px;
    .promotions-item {
      width: 200px;
      margin: 0 29px 30px;
      .img {
        width: 200px;
        height: 200px;
        vertical-align: middle;
      }
      .txt {
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        letter-spacing: 0.02em;
        color: var(--color-121212);
        font-family: @font-family-600;
        width: 200px;
        word-wrap: break-word;
        margin-top: 15px;
      }
    }
  }
}
</style>
