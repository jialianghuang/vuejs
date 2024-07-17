<template>
  <div>
    <a
      :href="countryUrl(moduleTitleLinkUrl)"
      v-track.view.click="{
        common: getBiParams('module title', 'module title' + moduleIndex)
      }"
      class="module-title"
      target="_blank"
      ><img :src="addWebpSuffix(moduleTitleImgUrl)" alt="landingpage"
    /></a>
    <az-tab
      :tabNav="tabNav(productTabList)"
      @onChange="onTabsChange"
      :oneNoTab="true"
      :from="'landingActivity'"
      :class="{ 'one-tab': productTabList.length == 1 }"
      class="product-list-block"
    >
      <div
        v-for="(productTabItem, productTabIndex) in productTabList"
        :key="`module_${productTabIndex}`"
        v-track.view.click="{
          common: getBiParams('product module', productTabItem.tabName + ' items')
        }"
        class="tab-list-content"
      >
        <template v-if="moduleKey + productTabItem.catId + productTabIndex == selectedTab">
          <div
            v-for="(productItem, index) in productTabItem.productList"
            :key="index + moduleKeyName(productTabItem)"
            @click="eventListeners(moduleKeyName(productTabItem), productItem, index + 1, productTabItem)"
            v-track.view.click="getViewParams(productItem, productTabItem.tabName + ' items')"
            class="goods-item"
          >
            <product-swiper-item
              :item="productItem"
              :addSuffix="true"
              :hasQuick="productItem.canQuickShop"
              :hasQuickBtn="productItem.canQuickShop"
              :from="moduleKeyName(productTabItem)"
              :index="index"
              item-target="_blank"
            ></product-swiper-item>
          </div>

          <div v-if="viewMoreInfo(productTabItem)" class="goods-item swiper-slide view-more-block">
            <a
              v-track.view.click="{
                common: getBiParams(viewMoreInfo(productTabItem).ec, viewMoreInfo(productTabItem).el)
              }"
              :href="countryUrl(viewMoreInfo(productTabItem).linkUrl)"
              target="_blank"
              class="view-more"
            >
              <p>
                <span class="view-more-text">{{ nl('page_common_view_more') }}</span>
              </p>
            </a>
          </div>
          <div v-for="i in 6" :key="i" class="goods-item"></div>
        </template>
      </div>
    </az-tab>
  </div>
</template>
<script>
import AzTab from '@/components/az-ui/AzTab'
import productSwiperItem from '@/components/product/productSwiperItem'

export default {
  name: 'LandingActivityListExtend',
  components: { AzTab, productSwiperItem },
  props: {
    moduleIndex: {
      type: Number,
      default: 0
    },
    moduleTitleImgUrl: {
      type: String,
      default: ''
    },
    productTabList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 该组件出现的场景，区分不同使用场景
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedTab: '' // tab品类切换
    }
  },
  computed: {
    moduleKey() {
      return 'module_' + this.moduleIndex + '_'
    },
    // 标题链接跳转
    moduleTitleLinkUrl() {
      if (this.productTabList.length == 1) {
        return this.productTabList[0].linkUrl
      }
      // 当前选中tab的view more url
      const currentProductTabList = this.productTabList.filter((item, index) => {
        return this.selectedTab == this.moduleKey + item.catId + index
      })
      return currentProductTabList && currentProductTabList.length && currentProductTabList[0].linkUrl
    }
  },
  mounted() {
    this.initTab()
  },
  methods: {
    tabNav(list) {
      const tabs = []
      list.forEach((item, index) => {
        tabs.push({
          name: item.tabName,
          key: this.moduleKey + item.catId + index,
          ec: 'product module',
          el: item.tabName
        })
      })
      return tabs
    },
    moduleKeyName(item) {
      return (
        this.moduleKey +
        item.tabName
          .replace(/ /g, '_')
          .toLowerCase()
          .replace("'", '')
      )
    },
    viewMoreInfo(item) {
      // 显示more
      return {
        ec: 'product module',
        el: item.tabName + ' VIEW MORE',
        linkUrl: item.linkUrl
      }
    },
    initTab() {
      this.selectedTab = this.moduleKey + this.productTabList[0].catId + 0
    },
    onTabsChange(key) {
      this.selectedTab = key
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec: ec || 'landingpage',
        el: el || 'landingpage'
      }
      return obj
    },
    getViewParams(item, el = null) {
      return {
        common: {
          ec: 'product module',
          el,
          msg: JSON.stringify({
            goodsId: item.goodsId
          })
        }
      }
    },
    // 订单追踪
    eventListeners(_module, item, index, productTabItem) {
      // 为点击商品的打点
      this.setPoint(this.moduleKeyName(productTabItem), 'items', 'click', {
        index,
        goodsId: item.goodsId,
        cat_name: item.catName,
        dress_type: item.dressType || this.dressType,
        cat_id: item.catId,
        from_cat_id: this.catId // 主商品catId
      })

      const path = this.$route.path
      if (path.includes('/black-friday-cyber-monday-influencer-selected')) {
        this.setOrderSourceFlagWithGoodsId('2023_black_friday_cyber_monday_influencer', item.goodsId)
      } else if (path.includes('/black-friday-cyber-monday')) {
        this.setOrderSourceFlagWithGoodsId('2023_black_friday_cyber_monday', item.goodsId)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.product-list-block {
  &.one-tab {
    margin-top: -30px;
  }
  .tab-list-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .goods-item {
      width: calc((100% - 6 * 10px) / 7);
      margin-top: 30px;
    }
    .view-more-block {
      height: auto;
      cursor: pointer;
      .view-more {
        background-color: var(--color-f9f9f9);
        height: calc(100% - 40px);
        align-items: center;
        justify-content: center;
        display: flex;
        .view-more-text {
          text-transform: uppercase;
          border-bottom: 2px solid var(--color-121212);
          padding-bottom: 5px;
          font-size: 14px;
          color: var(--color-121212);
        }
      }
    }
  }
}
.module-title {
  margin: 0px 0 20px;
  display: block;
  img {
    width: 100%;
  }
}
/deep/ .tabs {
  margin: 0;
}
</style>
