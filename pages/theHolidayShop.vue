<template>
  <div class="holiday-shop-box">
    <main-app ref="main" :navigation="navigation" :prodList="prodList">
      <div class="main-content">
        <quick-shop-dialog ref="quickShopDialog" :fromDialog="'list'" @refreshCartList="getCartInfo()"></quick-shop-dialog>
        <holiday-banner v-if="getBannerData.length > 0" :banners="getBannerData" />
        <holiday-tabs
          ref="holidayTabs"
          v-if="getTabsList.length > 0"
          :tabs="getTabsList"
          :activityName="getActivetyThemeName"
          @tabsCallBack="tabsCallBack"
        />
        <div class="sort-by-content">
          <cat-title :seoCatName="seoInfo.h1 || seoInfo.title" :total="pageInfo && pageInfo.totalCount" class="filter-box-left"></cat-title>
          <!-- <div class="holoday-total">{{ getTotlaStr }}</div> -->
          <sort-by @sortByChange="sortByChange" :sortTypes="sortTypes"></sort-by>
        </div>
        <empty-product-list
          v-if="emptyInfo.empty"
          @holidayShopClick="holidayShopClick"
          :emptyInfo="emptyInfo"
          mark-str="holidayShop"
        ></empty-product-list>
        <div v-else>
          <skeleton-list v-if="isEmpty" view-switch="holiday"></skeleton-list>
          <van-list
            id="product-swiper"
            v-if="!isEmpty"
            v-model="loading"
            :finished="true"
            :immediate-check="false"
            :offset="200"
            @load="onLoad"
            class="item-list prod-list van-clearfix"
          >
            <div
              v-for="(item, index) in prodList"
              :key="index"
              data-datalayer-category="FlashSale"
              data-datalayer-label="FlashSale_SizeLess_Click"
              class="need_datalayer van-goods-item"
              role="article"
            >
              <product-list-item
                @quickShop="quickShopClick"
                :productIndex="index"
                :item="item"
                :show-limited-time-tag="true"
                :data-goods-id="item.goodsId"
                :data-color-id="item.color"
                :addSuffix="true"
              ></product-list-item>
              <!-- <product-swiper-item v-if="false" :showFavIcon="true" :isWrap="true" :item="item"></product-swiper-item> -->
            </div>
            <!--<template> <i></i><i></i><i></i><i></i><i></i> </template>
            <div slot="loading" class="load-more">
              <i class="loading-hint"></i>
              <span class="loading-txt">{{ nl('page_common_loading') }}</span>
            </div>-->
          </van-list>
        </div>
        <div id="see-all-page" class="see-all-page">
          <az-pager :totalPage="pageInfo.totalPage" :page="pageInfo.page * 1" :isLoading="pageLoading" @pageChange="pageChange"></az-pager>
        </div>
        <category-description v-if="seoInfo" :content="seoInfo.content" :colorContent="seoInfo.colorContent"></category-description>
      </div>
    </main-app>
  </div>
</template>

<script>
/** lego 活动落地页配置 */
import mainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import holidayBanner from '@/components/theHolidayShop/holidayBanner'
import holidayTabs from '@/components/theHolidayShop/holidayTabs'
import { getHeadJson } from '@/plugins/head'
import { mapState, mapGetters } from 'vuex'
import sortBy from '@/components/list/sortBy'
// import ProductSwiperItem from '@/components/product/productSwiperItem'
import azPager from '@/components/az-ui/Pager/AzPager'
import SkeletonList from '@/components/list/skeleton/SkeletonList'
import emptyProductList from '@/components/list/EmptyProductList'
import productListItem from '@/components/list/ProductListItem'
// import QuickShopDialog from '@/components/quickshop/QuickShopDialog'
import CatTitle from '@/components/list/catTitle'
import CategoryDescription from '@/components/list/CategoryDescription'
import colorHex from '@/assets/js/colorHex'
import { Base64 } from 'js-base64'
import { objectUrlToStringUrl } from '@/assets/js/utils.js'

// import categoryTitle from '@/components/list/CategoryTitle'
// import sortPage from '@/components/list/SortPage'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog')
})

export default {
  name: 'TheHolidayShop',
  components: {
    mainApp,
    holidayBanner,
    holidayTabs,
    sortBy,
    // ProductSwiperItem,
    azPager,
    SkeletonList,
    emptyProductList,
    QuickShopDialog,
    productListItem,
    CatTitle,
    CategoryDescription
    // categoryTitle,
    // sortPage
  },
  mixins: [colorHex],
  data() {
    return {
      pageLoading: false,
      confData: {},
      pageInfo: {},
      sortTypes: {},
      // prodList: [],
      loading: false,
      emptyInfo: {}
    }
  },
  computed: {
    ...mapState({
      prodList: (state) => state.list.prodList,
      baseInfo: (state) => state.product.baseInfo
    }),
    isEmpty() {
      const result = !this.prodList || !Object.keys(this.prodList).length
      return result
    },
    getActivetyThemeName() {
      const { landingpage } = this.$route.query || {}
      return landingpage || ''
    },
    getBannerData() {
      const { banner } = this.confData || {}
      return banner || []
    },
    getTabsList() {
      const { tags } = this.confData || {}
      return tags || []
    },
    getTotlaStr() {
      if (this.pageInfo && this.pageInfo.totalCount > 1) {
        return `${this.pageInfo.totalCount} ${this.nl('page_common_items')}`
      } else {
        return `${this.pageInfo.totalCount || 0} ${this.nl('page_common_item')}`
      }
    },
    ...mapGetters({})
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const { landingpage } = context.route.query
      const pathArr = context.route.path.split('eventshop/')
      let subject = landingpage
      if (!landingpage) {
        subject = pathArr.length > 1 ? pathArr[1] : ''
      }

      // 旧地址重定向处理
      // /eventshop和/collection/eventshop两种类型统一改成/collection/eventshop/活动key形式
      if (
        context.route.path.includes('/eventshop') &&
        (!context.route.path.includes('/collection/eventshop') || context.route.query.landingpage)
      ) {
        delete context.route.query.landingpage
        const tempQuery = {
          ...context.route.query
        }
        const resUrl = objectUrlToStringUrl('/collection/eventshop/' + subject, tempQuery)
        context.redirect(302, resUrl)
        return
      }
      const params = {
        subject
      }
      const [configData, colorHexRes] = await Promise.all([
        context.$axios.$get(`/1.0/activityPage/get`, { params }),
        context.$axios.$get('/1.0/common/color-hex')
      ])
      let confData = {}
      if (configData.code == 0) {
        confData = configData.data
      } else if (configData.code == 5) {
        context.error({
          statusCode: 200,
          message: configData.msg ? configData.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (configData.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      }
      const { goodsIds, languageConfig } = confData || {}
      let res = {}
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      }
      try {
        res = await context.$axios.$post(
          `/1.0/list/content`,
          {
            needNotCatName: true,
            fromActivityPage: true,
            goodsIds: goodsIds || '1'
            // filters: context.store.state.list.apiFilters,
            // view_mode: context.store.state.list.apiViewMode,
            // mkt: context.store.state.list.apiMkt,
            // originUrl: commonAsyncData.requestUrl
          },
          {
            params: {
              // dress_type: context.store.state.list.apiDressType,
              page: 1,
              sort_by: context.route.query.sort_by
            }
          }
        )
      } catch {}
      let prodList = []
      let pageInfo = {}
      let sortTypes = {}
      if (res.code == 0) {
        // do something
        const tData = res.data || {}
        pageInfo = tData.pageInfo
        prodList = tData.prodList
        sortTypes = tData.sortTypes
        if (res.data.empty) {
          context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
          return
        }
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      }

      let seoH1 = ''
      if (languageConfig) {
        languageConfig.forEach((ele) => {
          if (ele.countryCode.toLowerCase() === context.store.state.country.toLowerCase() && ele.config) {
            ele.config.forEach((item) => {
              if (item.languageCode === context.store.state.language) {
                seoH1 = item.title
              }
            })
          }
        })
      }
      let seoInfo = {}
      if (commonAsyncData.seoInfo && (commonAsyncData.seoInfo.h1 || commonAsyncData.seoInfo.title)) {
        seoInfo = commonAsyncData.seoInfo
      } else if (seoH1) {
        seoInfo = { ...commonAsyncData.seoInfo, h1: seoH1 }
      }
      if (seoInfo.content) seoInfo.content = Base64.encode(seoInfo.content)
      context.store.commit('list/setProdList', prodList || [])
      return {
        ...commonAsyncData,
        seoInfo,
        confData,
        pageInfo,
        // prodList,
        sortTypes
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
      const json = getHeadJson(this)
      const { landingpage } = this.$route.query
      if (landingpage) {
        json.title = landingpage
      }
      return json
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    if (!this.colorHex || !Object.keys(this.colorHex).length) {
      this.getColorHexAjax()
    }
    if (process.client) {
      if (this.prodList && this.prodList.length) {
        const gaParams = this.getGAItemListParams(this.prodList, null, 'view', this.$route.name)
        this.setGA4DataLayer(gaParams)
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.main && this.$refs.main.getFavGoodsList()
    }, 100)
  },
  methods: {
    pageChange(val) {
      this.getProductList(val, false)
    },
    holidayShopClick() {
      this.$refs.holidayTabs && this.$refs.holidayTabs.clickItem(0)
    },
    sortByChange(val) {
      this.srotByKey = val
      this.getProductList(null, true)
    },
    tabsCallBack(val) {
      this.filterTag = val
      this.getProductList(null, true)
    },
    onLoad() {
      this.getProductList(this.pageInfo.page * 1 + 1)
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    getCartInfo() {
      this.$refs.main.getCartInfo()
    },
    getProductList(page, isFresh) {
      if (!page) {
        page = this.pageInfo.pag ? this.pageInfo.page * 1 : 1
      }
      this.loading = true
      // this.prodList = []
      this.$store.commit('list/setProdList', [])
      this.emptyInfo = {}
      const { goodsIds } = this.confData
      const reqBody = {
        needNotCatName: true,
        fromActivityPage: true,
        goodsIds: goodsIds || '1'
      }
      const reqParams = {
        page
      }
      if (this.srotByKey) {
        reqParams.sort_by = this.srotByKey
      }
      if (this.filterTag) {
        const { needNotCatName, key, value } = this.filterTag || {}
        reqBody.needNotCatName = needNotCatName
        if (needNotCatName) {
          // needNotCatName为ture，该标签不为catname走fiter，filters: {key: ["value"]}
          const filterParam = {}
          filterParam[key] = [value]
          reqBody.filters = filterParam
        } else {
          // needNotCatName为false，value为catname 走catname=value
          reqParams.cat_name = value
        }
      }
      this.$axios
        .$post(`/1.0/list/content`, reqBody, {
          params: reqParams
        })
        .then((res) => {
          if (res.code == 0 && res.data) {
            // this.prodList = res.data.prodList
            this.$store.commit('list/setProdList', res.data.prodList || [])
            if (this.prodList && this.prodList.length) {
              const gaParams = this.getGAItemListParams(this.prodList, null, 'view', this.$route.name)
              this.setGA4DataLayer(gaParams)
            }
            this.$refs.main && this.$refs.main.getFavGoodsList()
            this.sortTypes = res.data.sortTypes
            this.filterIsEmpty = false
            if (res.data.empty === true) {
              this.filterIsEmpty = true
              this.emptyInfo = {
                empty: res.data.empty,
                continueShoppingUrl: res.data.continueShoppingUrl,
                btnText: res.data.btnText || 'CONTINUE SHOPPING',
                text: res.data.text || 'Sorry, your search returned no result.'
              }
            }
            this.pageInfo = res.data.pageInfo || {}
            this.pageInfo.page = page
            if (this.pageInfo.page < this.pageInfo.totalPage) {
              this.loading = false
            }
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-list__placeholder {
  display: none;
}
.holiday-shop-box {
  .main-content {
    max-width: 1353px;
    width: 100%;
    margin: auto;
    box-sizing: border-box;
    transition: padding 0.5s ease;
    .sort-by-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      /deep/ .sort-by {
        padding: 0;
      }
      .holoday-total {
        margin-left: 20px;
        font-size: 13;
        color: var(--color-121212);
      }
    }
    .see-all-page {
      padding-top: 28px;
      margin-top: -1px;
      border-top: 1px solid #fff;
      text-align: right;
      margin-bottom: 35px;
      position: relative;
    }
    .prod-list {
      display: flex;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      flex-wrap: wrap;
      .van-goods-item {
        width: calc((100% / 5) - 12px);
        margin-top: 20px;
        .goods-item {
          width: 100%;
          background-color: #fff;
          &:hover {
            .goods-name {
              color: var(--color-121212) !important;
            }
          }
          .goods-item-a {
            .img-box {
              width: 100% !important;
              margin-bottom: 10px !important;
              &:after {
                content: '';
                display: block;
                padding-top: 138.4%;
                background: #f6f6f6;
              }
              .goods-img {
                position: absolute;
                width: 100% !important;
              }
            }
            .goods-name {
              margin: 0 !important;
              text-align: left !important;
              padding: 0 10px;
              width: 100% !important;
              box-sizing: border-box;
            }
            .goods-price-box {
              margin-top: 2px;
              padding: 0 10px;
              text-align: left !important;
            }
          }
        }
        i {
          width: 230px;
        }
        /deep/ .van-list__loading {
          width: 100%;
          .load-more {
            text-align: center;
            padding: 20px 0;
            .loading-hint {
              display: inline-block;
              height: 20px;
              width: 20px;
              background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAP1BMVEUAAAD0KA/xJhHxJA7yJA7xJA7xJA7xJA7xJA7wJA7xJA7xJA7xJA7xJA7xJA7xJA3xJA7xJA7xJA7xJA7xJA5JCyllAAAAFXRSTlMACxdEI3NalDdn3LyvLstPoveIgOl7Sm+EAAABiklEQVRIx9XS0W7kIAxAUWyDwckAIfD/37owUyndbbMJrtSq92UeoiMbGHMWRqKciSKamSw5v23b462d7T0HVIc76NrbGK8h+153vgozi9u39ZW7wOSfSYB3pyY3JqdV4ByiG86FTw6xrSmlx+mZ4757X8PJPo/Uo5OPe4/MaTwGy6dfOvz/VeAY7OGjrPvOcHH9PqXFf9i21krmMrcsi/vnhg55bfPfr1Irm1v5bqM5ElcF7lFYl2WF46DOOTA3w/TuuNBlMLeTvjIeQ8XcD9LS9mOoNRPl1t7GBufYTLW29jotP4dOjk2mhyJi5oKltfG2UYTMZL4VN6aL2FnKpTzGjwjMUiyl9b1F2Ey3lILjlvI8XUshY5lpnm6l8KBhnvpSxETmOE/3UpySjo6Fv5UiMykp5JyNsk5BSUPOqL2nnKP2sERklHWq3pgoaDf+nWPVfwsK6rcNIVilxW7xB6wNMVqtjXqLnVrQWbAj+IJFHcanRQAlxhH0xiJza7/owIrpMOBrsK4L9wckTA/GBoy0fQAAAABJRU5ErkJggg==)
                no-repeat 0 0;
              background-size: 100% 100%;
              animation: rotate 1s infinite;
            }
            .loading-txt {
              padding-left: 12px;
              font-size: 16px;
              color: var(--color-121212);
              line-height: 20px;
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
      }
    }
  }
  @media screen and (max-width: 1393px) {
    .main-content {
      padding: 0 30px;
    }
  }
}
</style>
