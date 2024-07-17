<template>
  <div v-track.view="getBiParams('oos', 'items')" class="similar-sample">
    <div
      v-for="(prod, index) in sampleData.prodList"
      :key="index"
      v-track.click="getBiParams('oos', 'items')"
      @click="setOrderSourceFlag('oos_recommends', true)"
      class="item"
    >
      <a :href="countryUrl(prod.goodsUrl)" target="_blank" class="goods-item">
        <img :src="addWebpSuffix(prod.imgUrl)" :alt="prod.shownGoodsName" class="goods-image" />
        <div class="goods-name">{{ prod.shownGoodsName.replace('Azazie ', '') }}</div>
        <div v-if="prod.hasLinePrice" class="goods-price">
          <span class="no-deal-price">{{ prod.noDealPriceDisplay }}</span>
          <span class="shop-price">{{ prod.shopPriceDisplay }}</span>
        </div>
        <div v-else class="goods-price">{{ prod.shopPriceDisplay }}</div>
      </a>
    </div>
    <div v-if="sampleData.totalCount > 4" v-track.view.click="getBiParams('oos', 'seeall')" class="item">
      <a
        :href="countryUrl(sampleData.shopAll)"
        class="need_datalayer see-all"
        target="_blank"
        data-datalayer-category="SimilarStyles"
        data-datalayer-label="SimilarStyles_SeeAll_Click"
      >
        <span class="see-all-text">{{ nl('page_category_see_all') }}</span>
        <span class="sum">({{ sampleData.totalCount }})</span>
        <div class="line"></div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimilarSample',
  props: {
    sampleData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      return {
        common: {
          ec,
          el,
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType,
            cat_id: this.baseInfo.catId,
            from_cat_id: this.baseInfo.catId // 主商品catId
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.similar-sample {
  display: flex;
  margin-top: 17px;
  .item {
    width: 88px;
    margin-right: 12px;
    img {
      width: 100%;
    }
    .goods-item {
      color: var(--color-121212);
      &:hover {
        color: var(--color-121212);
      }
    }
    .goods-name {
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: inherit;
    }
    .goods-price {
      text-align: center;
      color: inherit;
      .shop-price {
        color: var(--color-121212);
      }
      .no-deal-price {
        color: #999;
        text-decoration: line-through;
      }
    }
  }
  .see-all {
    display: block;
    text-align: center;
    color: var(--color-121212);
    font-family: @font-family-600, sans-serif;
    font-size: 13px;
    line-height: 18px;
    text-transform: uppercase;
    padding-top: 50px;
    .line {
      color: var(--color-121212);
      height: 2px;
      background-color: var(--color-121212);
      margin: 2px 8px;
      border: none;
    }
  }
}
</style>
