<template>
  <main-app ref="main" :navigation="navigation" :prodList="prodList">
    <SvgStorefront />
    <div class="storefront-view">
      <div
        :style="{
          backgroundImage: `url(${
            storefrontInfo.bannerImgUrl
              ? cdnPath + storefrontInfo.bannerImgUrl
              : 'https://cdn-1.azazie.com/upimg/userfiles/images/1/2e/f0/c9a5eeba85e055d487226544c1ce2ef0.jpg'
          })`
        }"
        class="storefront-view-header"
      >
        <div v-if="!storefrontInfo.hideUserImage" class="view-container">
          <img :src="cdnPath + storefrontInfo.headerImgUrl" class="storefront-view-avatar" alt="avatar" />
        </div>
      </div>
      <color-family-filter
        v-if="showColorFamily && filtersFlag"
        :colorsFamilyListObj="
          filters.list_colors_family.values && Object.keys(filters.list_colors_family.values).length
            ? filters.list_colors_family.values
            : {}
        "
        :valueFamilyKeyList="filters.list_colors_family.valueFamilyKeyList || []"
        :fromListFilter="true"
      ></color-family-filter>
      <div :class="{ 'view-container': !filtersFlag }" class="storefront-view-body">
        <div v-if="filtersFlag" class="body-left">
          <list-filters></list-filters>
        </div>
        <div class="body-right">
          <div class="storefront-view-body-header">
            <div class="list-name">
              <h1 v-if="seoInfo.h1">{{ seoInfo.h1 }}</h1>
              <template v-else>
                <span>{{ nl('page_storefront_user_name_list', null, { name: storefrontInfo.userName }) }}:</span>
                <span class="name">{{ storefrontInfo.name }}</span>
              </template>
            </div>
            <div @click="clickShare" class="share-btn">
              <az-icon icon-class="iconshare-link"></az-icon>
              <span>{{ nl('page_common_share').toLowerCase() }}</span>
            </div>
          </div>
          <empty-product-list v-if="emptyInfo.empty" :emptyInfo="emptyInfo" :markStr="'list'"></empty-product-list>
          <template v-else>
            <skeleton-list :viewSwitch="viewSwitch" v-if="loadingFlag"></skeleton-list>
            <div v-else :class="['product-list', viewSwitch, 'grid-box']">
              <product-list-item
                v-for="(product, index) in prodList"
                :key="product.goodsId + '-' + index"
                :productIndex="index"
                :item="product"
                :page="Number(pageInfo.page)"
                :show-limited-time-tag="true"
                :data-goods-id="product.goodsId"
                :data-color-id="product.color"
                :data-goods-index="product.indexNo"
                :data-cat-id="product.catId"
                :data-dress-type="product.dressType"
                :addSuffix="true"
                @quickShop="quickShopClick"
                @notify-me="notifyMe"
              ></product-list-item>
            </div>
            <az-pager :totalPage="pageInfo.totalPage" :page="pageInfo.page * 1" @pageChange="pageChange"></az-pager>
          </template>

          <div class="cate-links">
            <h1 class="cate-links-title">{{ nl('page_storefront_collections') }}</h1>
            <p class="cate-links-des">{{ nl('page_storefront_collections_des') }}</p>
            <ul>
              <li v-for="(item, index) in categoryLinks" :key="index" class="cate-links-item">
                <a :href="countryUrl(item.link)">{{ nl(item.name) }}</a>
              </li>
            </ul>
          </div>
          <seo-content v-if="seoInfo && seoInfo.content" :content="seoInfo.content" class="seo-content"></seo-content>
        </div>
      </div>
    </div>
    <share-list :visible.sync="shareVisible" :storeInfo="{ storefrontListInfo: storefrontInfo, goodsList: prodList }"></share-list>
    <quick-shop-dialog ref="quickShopDialog" :fromDialog="'list'" @refreshCartList="getCartInfo()"></quick-shop-dialog>
    <notify-me-dialog v-if="openNotifyMe" :item="goodsItem" :style-info="{}"></notify-me-dialog>
    <az-loading v-if="loadingFlag"></az-loading>
  </main-app>
</template>

<script>
import mainApp from '@/components/Main'
import ProductListItem from '@/components/list/ProductListItem'
import ShareList from '@/components/storefront/ShareList'
import AzLoading from '@/components/az-ui/AzLoading'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import ListFilters from '@/components/list/ListFilters'
import SeoContent from '@/components/sale/SaleSeoContent'
import AzPager from '@/components/az-ui/Pager/AzPager'
import ColorFamilyFilter from '@/components/list/ColorFamilyFilter'
import SkeletonList from '@/components/list/skeleton/SkeletonList'
import EmptyProductList from '@/components/list/EmptyProductList'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
import filtersMixins from '@/assets/js/filters'
import { pathToFilters } from '@/assets/js/utils.js'
import SvgStorefront from '@/components/svgs/SvgStorefront'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog'),
  // 异步组件加载时使用的组件
  loading: AzLoading
})

export default {
  components: {
    mainApp,
    ProductListItem,
    ShareList,
    AzLoading,
    QuickShopDialog,
    NotifyMeDialog,
    ListFilters,
    SeoContent,
    AzPager,
    ColorFamilyFilter,
    SkeletonList,
    EmptyProductList,
    SvgStorefront
  },
  mixins: [filtersMixins],
  data() {
    return {
      shareVisible: false,
      goodsItem: {},
      cdnPath: 'https://cdn-1.azazie.com/',
      categoryLinks: [
        {
          name: 'page_category_bridemaids',
          link: '/all/bridesmaid-dresses'
        },
        {
          name: 'page_category_bride',
          link: '/all/wedding-dresses?subsite=bridal'
        },
        {
          name: 'page_category_bride_moms',
          link: '/all/mother-of-the-bride-dresses'
        },
        {
          name: 'page_mobile_index_special_occasion',
          link: '/all/special-occasion-dresses'
        }
      ]
    }
  },
  computed: {
    ...mapState('list', ['prodList', 'loadingFlag', 'viewSwitch', 'apiFilters', 'isCanLoading', 'filters'])
  },
  watch: {
    '$route.query': {
      handler(newVal, oldVal) {
        if (!oldVal) return
        if (this.isCanLoading) {
          this.getProdList()
        }
      },
      immediate: true,
      deep: true
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const referrerCode = context.route.query.referrer_code || ''

      const path = context.route.path.split('?')[0]
      let pageInfo = { totalCount: 0, limit: 60, page: 1, totalPage: 1 }
      const firstQuery = pathToFilters(commonAsyncData.requestUrl, context.store)
      context.store.commit('list/setApiFilters', firstQuery.filtersObj)
      const payload = {
        page: pageInfo.page,
        limit: pageInfo.limit,
        filters: context.store.state.list.apiFilters,
        ...context.route.query
      }
      // if (referrerCode) payload.referrer_code = referrerCode
      let storeName = path.split('/store/')[1]
      if (storeName && storeName.includes('/with')) {
        storeName = storeName.split('/with')[0]
      }
      if (storeName && storeName.includes('/colors')) {
        storeName = storeName.split('/colors')[0]
      }
      if (!storeName) {
        // 链接不对
        context.redirect(302, '/404')
        return
      }
      payload.originUrl = '/store/' + storeName
      const apiUrl = '/1.0/store/' + storeName
      const res = await context.$axios.$post(apiUrl, payload)
      let storefrontInfo = {}
      let seoInfo = commonAsyncData.seoInfo
      let emptyInfo = {} // 接口返回空页面信息
      if (res.code === 0) {
        // 如果返回的longUrl有值，说明当前访问路径不对，需要重定向到longUrl
        if (res.data.longUrl) {
          context.redirect(302, res.data.longUrl)
          return
        }
        pageInfo = res.data.pageInfo
        storefrontInfo = res.data.storefrontInfo
        if (!res.data.goodsList.length) {
          emptyInfo = {
            empty: true,
            noResultTips1: res.data.noResultTips1,
            noResultTips2: res.data.noResultTips2,
            removeAllFilterUrl: payload.originUrl + '?' + commonAsyncData.requestUrl.split('?')[1]
          }
        }
        if (res.data.goodsList) context.store.commit('list/setProdList', res.data.goodsList)
        if (res.data.filters) context.store.commit('list/setFilters', res.data.filters)
        if (res.data.pageConfig) {
          if (res.data.pageConfig.catId) context.store.commit('setCatId', res.data.pageConfig.catId)
          if (res.data.pageConfig.price) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.price[0])
          } else if (res.data.pageConfig.pricecadca) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.pricecadca[0])
          } else if (res.data.pageConfig.priceaudau) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.priceaudau[0])
          } else if (res.data.pageConfig.pricegbpgb) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.pricegbpgb[0])
          } else if (res.data.pageConfig.priceeurfr) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.priceeurfr[0])
          } else if (res.data.pageConfig.pricemxnmx) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.pricemxnmx[0])
          } else if (res.data.pageConfig.priceeurde) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.priceeurde[0])
          } else if (res.data.pageConfig.priceeures) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.priceeures[0])
          } else if (res.data.pageConfig.priceeurit) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.priceeurit[0])
          } else if (res.data.pageConfig.priceeurie) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.priceeurie[0])
          } else if (res.data.pageConfig.priceeurnl) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.priceeurnl[0])
          } else if (res.data.pageConfig.priceeurbe) {
            context.store.commit('list/setPriceRange', res.data.pageConfig.priceeurbe[0])
          } else {
            context.store.commit('list/setPriceRange', 'price0-0')
          }
        } else {
          context.store.commit('list/setPriceRange', 'price0-0')
        }
        if (res.data.seo) seoInfo = res.data.seo
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, `/user/login?back=${context.route.fullPath}`)
        return
      }

      const colorHexRes = await context.$axios.$get('/1.0/common/color-hex')
      // 列表页将colorHex放在首屏里面，优化页面渲染
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      }

      context.store.commit('list/setViewSwitch', 'smaller')
      context.store.commit('list/setIsCanLoading', false)
      context.store.commit('list/setLoadingFlag', false)
      context.store.commit('setJsKey', 'storefront_share')
      return {
        ...commonAsyncData,
        seoInfo,
        referrerCode,
        storefrontInfo,
        pageInfo,
        apiUrl,
        emptyInfo
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    if (this.isCanLoading) {
      this.getProdList()
    }
    if (!this.filtersOpen.length) {
      this.getFiltersOpen()
    }
  },
  mounted() {
    // 只要访问门店分享页，就更新本地缓存，记录当前链接，注册成功后打点传入
    localStorage.setItem('STOREFRONT_LINK', location.href)
  },
  methods: {
    pageChange(val) {
      this.changeQuery({
        page: val
      })
    },
    notifyMe(item) {
      this.goodsItem = item
      this.$store.commit('setOpenNotifyMe', true)
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    getCartInfo() {
      this.$refs.main.getCartInfo()
    },
    clickShare() {
      this.shareVisible = true
    },
    // 查询列表商品数据
    getProdList() {
      const payload = {
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
        filters: this.apiFilters,
        originUrl: this.apiUrl.split('/1.0')[1],
        ...this.$route.query
      }
      this.$axios.$post(this.apiUrl, payload).then((res) => {
        if (res.code === 0) {
          // 如果返回的longUrl有值，说明当前访问路径不对，需要重定向到longUrl
          if (res.data.longUrl) {
            location.href = res.data.longUrl
            return
          }
          this.pageInfo = res.data.pageInfo
          this.storefrontInfo = res.data.storefrontInfo
          if (!res.data.goodsList.length) {
            this.emptyInfo = {
              empty: true,
              noResultTips1: res.data.noResultTips1,
              noResultTips2: res.data.noResultTips2,
              removeAllFilterUrl: payload.originUrl + '?' + this.$route.fullPath.split('?')[1]
            }
          }
          if (res.data.goodsList) {
            this.$store.commit('list/setProdList', res.data.goodsList)
            this.$nextTick(() => {
              this.$refs.main && this.$refs.main.getFavGoodsList()
            })
          }
          if (res.data.filters) this.$store.commit('list/setFilters', res.data.filters)
          if (res.data.pageConfig) {
            this.$store.commit('setCatId', res.data.pageConfig.catId || 0)
            if (res.data.pageConfig.price) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.price[0])
            } else if (res.data.pageConfig.pricecadca) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.pricecadca[0])
            } else if (res.data.pageConfig.priceaudau) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.priceaudau[0])
            } else if (res.data.pageConfig.pricegbpgb) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.pricegbpgb[0])
            } else if (res.data.pageConfig.priceeurfr) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.priceeurfr[0])
            } else if (res.data.pageConfig.pricemxnmx) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.pricemxnmx[0])
            } else if (res.data.pageConfig.priceeurde) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.priceeurde[0])
            } else if (res.data.pageConfig.priceeures) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.priceeures[0])
            } else if (res.data.pageConfig.priceeurit) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.priceeurit[0])
            } else if (res.data.pageConfig.priceeurie) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.priceeurie[0])
            } else if (res.data.pageConfig.priceeurnl) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.priceeurnl[0])
            } else if (res.data.pageConfig.priceeurbe) {
              this.$store.commit('list/setPriceRange', res.data.pageConfig.priceeurbe[0])
            } else {
              this.$store.commit('list/setPriceRange', 'price0-0')
            }
          } else {
            this.$store.commit('list/setPriceRange', 'price0-0')
          }
          this.$store.commit('list/setIsCanLoading', false)
          this.$store.commit('list/setLoadingFlag', false)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.storefront-view {
  .view-container {
    width: 79.6875vw;
    max-width: 1530px;
    min-width: 1280px;
  }
  &-header {
    position: relative;
    width: 100%;
    height: 220px;
    background: #ccc;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    .view-container {
      margin: 0 auto;
      height: 100%;
      position: relative;
    }
  }
  &-banner {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  &-avatar {
    width: 200px;
    height: 200px;
    border: 2px solid #fff;
    border-radius: 50%;
    position: absolute;
    left: 0px;
    bottom: -25px;
    background: #ccc;
  }
  &-body {
    margin: 44px auto 0px;
    padding: 0px 40px;
    display: flex;
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .list-name {
        font-size: 16px;
        font-family: @font-family-600;
        text-transform: uppercase;
        .name {
          font-size: 24px;
          margin-left: 15px;
          text-transform: capitalize;
        }
      }
      .share-btn {
        font-size: 13px;
        cursor: pointer;
        text-transform: capitalize;
      }
    }
    // .product-list {
    //   padding: 15px 0px;
    //   display: flex;
    //   justify-content: space-between;
    //   flex-wrap: wrap;
    //   .goods-item {
    //     width: 19%;
    //   }
    // }
    .body-left {
      width: 264px;
      padding-right: 20px;
    }
    .body-right {
      flex: 1;
      .cate-links {
        padding: 40px;
        background: #fffcf5;
        text-align: center;
        margin-top: 30px;
        margin-bottom: 20px;
        &-title {
          font-family: 'GFS Didot';
          font-size: 32px;
          font-weight: 400;
          line-height: normal;
          text-transform: uppercase;
        }
        &-des {
          font-family: @font-family-500;
          font-size: 13px;
          line-height: normal;
          margin-bottom: 40px;
        }
        ul {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        &-item {
          flex: 1;
          margin-right: 15px;
          height: 45px;
          border: 1px solid #333;
          text-transform: uppercase;
          a {
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: @font-family-600;
            font-size: 14px;
            width: 100%;
            height: 100%;
          }
          &:last-of-type {
            margin-right: 0px;
          }
        }
      }
    }
  }
}
.product-list {
  width: 100%;
  line-height: 1.8;
  clear: both;
  display: grid;
  &.grid-box {
    display: grid;
  }
  &.flex-box {
    display: flex;
    flex-wrap: wrap;
  }
  &.smaller {
    &.grid-box {
      grid-template-columns: repeat(5, 1fr);
      column-gap: 15px;
      .goods-item {
        width: 100% !important;
      }
    }
    &.flex-box {
      .goods-item {
        margin-right: 15px;
        &:nth-child(1) {
          margin-right: 30px;
        }
        &:nth-child(5n - 1) {
          margin-right: 0;
        }
      }
    }
  }
  &.larger {
    &.grid-box {
      grid-template-columns: repeat(4, 1fr);
      column-gap: 15px;
      .goods-item {
        width: 100% !important;
      }
    }
    &.flex-box {
      .goods-item {
        margin-right: 15px;
        &:nth-child(1) {
          margin-right: 30px;
        }
        &:nth-child(4n - 1) {
          margin-right: 0;
        }
      }
    }
  }
  @media screen and (max-width: 1600px) {
    &.smaller {
      &.grid-box {
        grid-template-columns: repeat(4, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(4n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
          &:nth-child(4) {
            margin-right: 15px;
          }
        }
      }
    }
    &.larger {
      &.grid-box {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(3n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1024px) {
    &.smaller {
      &.grid-box {
        grid-template-columns: repeat(3, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(n) {
            margin-right: 15px;
          }
          &:nth-child(3n - 1) {
            margin-right: 0;
          }
          &:nth-child(2) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
        }
      }
    }
    &.larger {
      &.grid-box {
        grid-template-columns: repeat(2, 1fr);
        column-gap: 15px;
      }
      &.flex-box {
        .goods-item {
          &:nth-child(2n - 1) {
            margin-right: 0;
          }
          &:nth-child(1) {
            margin-right: 30px;
          }
          &:nth-child(2) {
            margin-right: 15px;
          }
        }
      }
    }
  }
}
/deep/ .van-list__loading {
  width: 100%;
  .load-more {
    text-align: center;
    padding: 16px 0;
    .loading-hint {
      display: inline-block;
      height: 12px;
      width: 12px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAP1BMVEUAAAD0KA/xJhHxJA7yJA7xJA7xJA7xJA7xJA7wJA7xJA7xJA7xJA7xJA7xJA7xJA3xJA7xJA7xJA7xJA7xJA5JCyllAAAAFXRSTlMACxdEI3NalDdn3LyvLstPoveIgOl7Sm+EAAABiklEQVRIx9XS0W7kIAxAUWyDwckAIfD/37owUyndbbMJrtSq92UeoiMbGHMWRqKciSKamSw5v23b462d7T0HVIc76NrbGK8h+153vgozi9u39ZW7wOSfSYB3pyY3JqdV4ByiG86FTw6xrSmlx+mZ4757X8PJPo/Uo5OPe4/MaTwGy6dfOvz/VeAY7OGjrPvOcHH9PqXFf9i21krmMrcsi/vnhg55bfPfr1Irm1v5bqM5ElcF7lFYl2WF46DOOTA3w/TuuNBlMLeTvjIeQ8XcD9LS9mOoNRPl1t7GBufYTLW29jotP4dOjk2mhyJi5oKltfG2UYTMZL4VN6aL2FnKpTzGjwjMUiyl9b1F2Ey3lILjlvI8XUshY5lpnm6l8KBhnvpSxETmOE/3UpySjo6Fv5UiMykp5JyNsk5BSUPOqL2nnKP2sERklHWq3pgoaDf+nWPVfwsK6rcNIVilxW7xB6wNMVqtjXqLnVrQWbAj+IJFHcanRQAlxhH0xiJza7/owIrpMOBrsK4L9wckTA/GBoy0fQAAAABJRU5ErkJggg==)
        no-repeat 0 0;
      background-size: 100% 100%;
      animation: rotate 1s infinite;
    }
    .loading-txt {
      padding-left: 8px;
      font-size: 12px;
      color: var(--color-121212);
      line-height: 17px;
      display: inline-block;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
