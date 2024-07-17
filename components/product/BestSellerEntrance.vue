<template>
  <a
    v-track.view.click="{ common: { ec: 'top_seller_list', el: 'product_deail_page' } }"
    :href="countryUrl(bestSellerUrl)"
    :class="{ bridal: isBridal }"
    @click="handleClick"
    class="best-seller-entrance"
  >
    <span class="best-seller-rank">#{{ sellerInfo.sort }} {{ nl('page_best_seller_word') }}</span>
    <span class="best-seller-category">
      {{ nl('page_common_in') }} <span>{{ cateName }}</span>
    </span>
    <az-icon icon-class="icon-lby_arrow_right"></az-icon>
  </a>
</template>
<script>
import { mapGetters } from 'vuex'

/**
 * 榜单入口组件
 * 主要用在商品详情页
 */
export default {
  languageKeys: ['page_best_seller_word', 'page_common_in'],
  props: {
    sellerInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters({
      baseInfo: 'product/getBaseInfo'
    }),
    cateName() {
      if (this.sellerInfo.url) {
        return this.sellerInfo.url.replace(/_|-/g, ' ')
      }
      return ''
    },
    bestSellerUrl() {
      let res = '/best-seller/' + this.sellerInfo.url + '?from_item=' + this.baseInfo.goodsId + '&from_page=detail'
      if (this.isBridal) {
        res = res + '&subsite=bridal'
      }
      return res
    }
  },
  methods: {
    handleClick() {
      // best seller入口点击订单追踪
      this.setOrderSourceFlag('best seller click ' + this.baseInfo.catId, true)
    }
  }
}
</script>
<style lang="less" scoped>
.best-seller {
  &-entrance {
    background: linear-gradient(90deg, #121212 76.29%, rgba(255, 255, 255, 0) 103.98%);
    padding: 2px;
    font-size: 13px;
    line-height: normal;
    color: var(--color-ffffff);
    display: flex;
    align-items: center;
    width: max-content;
    margin-top: 10px;
    font-family: @font-family-600;
    &.bridal {
      background: linear-gradient(90deg, #f2f5f4 76.29%, rgba(255, 255, 255, 0) 103.98%);
      color: #658478;
      .best-seller-rank {
        background: #658478;
      }
      .az-icon {
        fill: #658478;
      }
    }
    .az-icon {
      fill: @theme;
      height: 10px;
    }
  }
  &-rank {
    display: inline-block;
    color: #fff;
    background: @theme;
    border-radius: 8px 0px;
    margin-right: 5px;
    padding: 0px 5px;
    text-transform: capitalize;
  }
  &-category {
    margin-right: 5px;
  }
}
</style>
