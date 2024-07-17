<template>
  <div class="sale-list">
    <template v-if="hasData">
      <sale-list-item
        v-for="(item, index) in list"
        :key="index"
        :category="item.key"
        :title="item.title"
        :titleBanner="item.thumb"
        :description="item.description"
        :eventName="item.eventName"
        :dataLayerLabel="item.dataLayerLabel"
        :clickItemDataLayerCategory="item.clickItemDataLayerCategory"
        :clickShopAllDataLayerCategory="item.clickShopAllDataLayerCategory"
        :viewDataLayerCategory="item.viewDataLayerCategory"
        :prodList="item.prodList"
        :pageInfo="item.pageInfo"
        :maxLength="item.maxLength"
        :shopAllUrl="item.shopAllUrl"
        :currentIndex="index"
      ></sale-list-item>
    </template>
    <common-lazy-module v-else :radio="0.273" height="50"></common-lazy-module>
  </div>
</template>

<script>
import SaleListItem from '@/components/sale/SaleListItem'
import CommonLazyModule from '@/components/common/CommonLazyModule'
export default {
  name: 'SaleList',
  components: { SaleListItem, CommonLazyModule },
  props: {
    prodReqListData: {
      type: Array,
      default() {
        return []
      }
    },
    hasData: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    list() {
      const result = this.prodReqListData
        .filter((item) => item.prodList && item.prodList.length > 0)
        .map((item) => {
          return {
            ...item,
            prodList: item.pageInfo.totalCount > item.maxLength ? item.prodList.slice(0, item.maxLength - 1) : item.prodList
          }
        })
      return result
    }
  }
}
</script>

<style lang="less" scoped>
.sale-list {
  width: 100%;
  margin: 50px auto 50px;
}
</style>
