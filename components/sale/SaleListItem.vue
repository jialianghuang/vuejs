<template>
  <div :id="`sale_list_children_${currentIndex + 1}`" class="sale-list-children">
    <template v-if="titleBanner || description">
      <div class="sale-list-title">
        <sale-banner-item
          v-if="titleBanner"
          :keyStr="`list_banner_${currentIndex}`"
          :item="titleBanner"
          :category="category"
          class="title-banner"
        />
        <template v-if="description">
          <p
            v-if="!['shop the looks', 'comprar los looks', 'acheter les looks'].includes(description.toLowerCase())"
            v-html="description"
            class="description-txt"
          />
          <template v-else>
            <div class="img-title">
              <img :src="addWebpSuffix(nl('page_image_sale_list_item'))" :alt="`shopthelook`" class="shop-the-look" />
            </div>
          </template>
        </template>
      </div>
    </template>
    <div class="sale-list-content">
      <sale-list-item-swiper
        v-if="prodList && prodList.length"
        :indexStr="`${currentIndex}`"
        :list="prodList"
        :pageInfo="pageInfo"
        :shopAllUrl="shopAllUrl"
        @saleListItemAppear="itemAppear"
        @saleListItemClick="itemClick"
      />
    </div>
  </div>
</template>

<script>
import SaleBannerItem from '@/components/sale/SaleBannerItem'
import SaleListItemSwiper from '@/components/sale/SaleListItemSwiper'
export default {
  name: 'SaleListItem',
  components: { SaleBannerItem, SaleListItemSwiper },
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    titleBanner: {
      type: Object,
      default() {
        return null
      }
    },
    category: {
      type: String,
      default() {
        return null
      }
    },
    description: {
      type: String,
      default() {
        return null
      }
    },
    eventName: {
      type: String,
      default() {
        return null
      }
    },
    dataLayerLabel: {
      type: String,
      default() {
        return ''
      }
    },
    clickItemDataLayerCategory: {
      type: String,
      default() {
        return ''
      }
    },
    clickShopAllDataLayerCategory: {
      type: String,
      default() {
        return ''
      }
    },
    viewDataLayerCategory: {
      type: String,
      default() {
        return ''
      }
    },
    prodList: {
      type: Array,
      default() {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    maxLength: {
      type: Number,
      default() {
        return {}
      }
    },
    shopAllUrl: {
      type: String,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      scrollDointFlag: false
    }
  },
  methods: {
    itemClick(data) {
      const { index, item } = data || {}
      this.salePoint('click', index + 1, item)
    },
    itemAppear(data) {
      const { index, item } = data || {}
      this.salePoint('view', index + 1, item)
    },
    salePoint(ea, index, item) {
      const eventParams = {
        dp: 'sale page',
        ec: 'salepage',
        el: index ? `${this.eventName}_${index}` : `${this.eventName}`,
        ea,
        param1: (location && location.href) || '-1',
        msg: JSON.stringify({
          cat_name: item.catName,
          dress_type: item.dressType,
          goodsId: item.goodsId
        })
      }
      if (this.jsKey == 'cybermonday-landing-page') {
        delete eventParams.dp
        eventParams.ec = 'cyber_sale'
      }
      this.buryPoint(this, 'event', eventParams)
    }
  }
}
</script>

<style lang="less" scoped>
.sale-list-children {
  width: 100%;
  .sale-list-title {
    margin: 60px 15px 25px;
    width: 100%;
    .title-banner {
      position: relative;
      left: -15px;
      display: block;
    }
    .description-txt {
      font-size: 13px;
      color: var(--color-121212);
      font-family: @font-family-500, sans-serif;
      text-align: center;
      margin: 16px 157px 0px;
      /deep/ a {
        text-decoration: underline;
        color: @theme;
      }
    }
    .img-title {
      width: 100%;
      display: flex;
      margin-top: 60px;
      align-items: center;
      justify-content: center;
      img {
        width: 336px;
        height: 100%;
      }
    }
  }
  .sale-list-content {
    width: 100%;
    min-width: unset;
  }
}
</style>
