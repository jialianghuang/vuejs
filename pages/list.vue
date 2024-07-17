<template>
  <div :class="['list-box', country, apiDressType]">
    <main-app ref="main" :prodList="prodList" :adaptive="true" class="adaptive-box">
      <!-- 黑五期间，列表页banner先改成顶通的样式。所以先把组件 category-second-banner 挪到<main-app>外面 -->
      <template v-if="showFourStaicBanner && !isBridalSwatches && !activityPageData.banner">
        <template v-if="!squaresBanner || !squaresBanner.length">
          <category-second-banner v-if="!!secondaryBannerData.length" :secondaryBanner="secondaryBannerData"></category-second-banner>
        </template>
      </template>
      <div class="main-content">
        <!-- 备注： id="listContentQueryData" 内容是 /1.0/list/content 接口入参， 用于爬虫给lego使用，勿删 -->
        <div id="listContentQueryData" style="display:none;">{{ listContentQueryData }}</div>
        <quick-shop-dialog ref="quickShopDialog" :fromDialog="'list'" @refreshCartList="getCartInfo()"></quick-shop-dialog>
        <!-- new notify me dialog -->
        <NotifyMeDialog v-if="openNotifyMe" :item="goodsItem" :style-info="{}" />
        <size-chart-layer v-if="sizeChartLayerShow" :baseInfo="baseInfo" :sizeChartInfo="styleInfo.sizeChart"></size-chart-layer>
        <holiday-banner
          v-if="activityPageData && activityPageData.banner && Array.isArray(activityPageData.banner) && activityPageData.banner.length > 0"
          :banners="activityPageData.banner || []"
        />
        <template v-else>
          <seo-theme-banner v-if="hasSeoThemeBanner"></seo-theme-banner>
          <!-- #13413: MOB/BD/WD列表页top banner布局优化 有abtest,【注意】因为这个需求是bd, wd, mob列表页hard code，所以当有lego配置里的活动banner的时候，优先展示配置的活动banner -->
          <!-- 如果 list-top-banner 模块的判断条件有更改，记得同步下下面 color-family-filter 组件的值 -->
          <template v-if="showFourStaicBanner && !isBridalSwatches">
            <list-top-banner v-if="squaresBanner && squaresBanner.length" :squaresBanner="squaresBanner"></list-top-banner>
            <!-- 黑五期间，列表页banner先改成顶通的样式。所以先把组件 category-second-banner 挪到 <main-app>外面,这里先隐藏 -->
            <!-- <template v-else>
            <category-second-banner v-if="!!secondaryBannerData.length" :secondaryBanner="secondaryBannerData"></category-second-banner>
          </template> -->
          </template>
        </template>
        <div class="loading-box">
          <!-- #15355: 列表页颜色样式优化-展示色系+单色 -->
          <color-family-filter
            @handleNormalStockChange="handleNormalStockChange"
            v-if="showColorFamily"
            :hasListTopBanner="!!(showFourStaicBanner && !isBridalSwatches && squaresBanner && squaresBanner.length)"
            :colorsFamilyListObj="
              filters.list_colors_family.values && Object.keys(filters.list_colors_family.values).length
                ? filters.list_colors_family.values
                : {}
            "
            :valueFamilyKeyList="filters.list_colors_family.valueFamilyKeyList || []"
            :fromListFilter="true"
          ></color-family-filter>
          <div
            :class="[
              'goods_show_container',
              {
                wgd: isSpecialCatId(catId),
                'empty-container': emptyInfo.empty,
                'display-flex': isComingSoon,
                'not-collection': !['/collection/all', '/all/collection-dresses', '/all/final-sale'].includes($route.path)
              }
            ]"
          >
            <div ref="catLeft" v-if="!isComingSoon" class="cat-left">
              <div id="cat-left-scroll" :style="filterFixed">
                <div id="listFiltersTop"></div>
                <list-filters
                  @handleNormalStockChange="handleNormalStockChange"
                  @handleSodChange="handleSodChange"
                  v-if="filtersFlag"
                ></list-filters>
                <!-- jira 14202 左边筛选只有常规筛选 -->
                <template v-if="!freshDeals">
                  <!-- jira:14833 /bridal品类列表不展示推荐banner -->
                  <template v-if="!isSpecialCatId(catId) && !isBridal">
                    <popular-filter-banner v-if="popularFilterBanner" :goods-img="completeLookGoodsList" />
                    <filter-banner :filterBanner="filterBannerData" :style="filterBannerFixed"></filter-banner>
                  </template>
                  <div id="popularFilter"></div>
                  <div v-if="popularFilterFlag && popularFilterShow" :style="{ position: 'sticky', top: stickyTop + 'px' }">
                    <popular-filter @selectedFilter="popularFilterShow = false" @sticky-top="(top) => (stickyTop = top)"></popular-filter>
                    <popular-filter-banner v-if="!isBridal" :goods-img="completeLookGoodsList" :sticky-box="popularFilterShow" />
                  </div>
                </template>
              </div>
            </div>
            <div id="cat-right" ref="listRight" :class="{ 'cat-content': isComingSoon }" class="cat-right">
              <style-quiz-share v-if="isStyleQuizShare"></style-quiz-share>
              <div :class="['cat-right-top-filter-box', { hide: isComingSoon }]">
                <cat-title
                  v-if="!isComingSoon"
                  :seoCatName="seoCatName"
                  :total="pageInfo && pageInfo.totalCount"
                  class="filter-box-left"
                ></cat-title>
                <!-- 商品上面的筛选条件 -->
                <div :class="['filter-box-right', { 'scale-margin': dressType == 'sample' }]">
                  <template v-if="!isComingSoon">
                    <template v-if="['sample', 'clearance', 'outlet'].includes(dressType) || isFinalSaleList">
                      <sort-by v-if="isShowOrderFilter" @sortByChange="sortByChange" :sortTypes="sortTypes"></sort-by>
                      <sample-search
                        v-if="showSampleSearch"
                        :isShowOrderFilter="isShowOrderFilter"
                        @sampleSearchChange="sampleSearchChange"
                        :searchDressType="$route.path.includes('/all/final-sale') ? 'sale' : dressType"
                        :show-label="false"
                        :width="135"
                      ></sample-search>
                      <current-in-stock v-if="dressType == 'sample'" @currentInStockChange="currentInStockChange"></current-in-stock>
                      <az-checkbox
                        v-if="showTryOnByFavorited"
                        v-track.view.click="getBiCommonParams('listpage', 'try_on_dresses_by_favorited')"
                        :show-bg="true"
                        :value="tryOnDressValue"
                        @onChange="handleTryOnChange"
                        >{{ nl('page_sample_tryon_dresses_by_favorited') }}</az-checkbox
                      >
                    </template>
                    <template v-else>
                      <sort-by @sortByChange="sortByChange" :sortTypes="sortTypes"></sort-by>
                    </template>
                    <div v-if="shouldShowSpecialOffer" class="special-offer">
                      <div @click="checkboxSelect" v-if="!inSpecialOffer" :class="{ selected: inSpecialOffer }" class="checkbox-box"></div>
                      <div @click="checkboxSelect" v-else :class="{ selected: inSpecialOffer }" class="checkbox-box">
                        <svg class="icon">
                          <use xlink:href="#icon-lby_tick_white_s" />
                        </svg>
                      </div>
                      <span>{{ nl('page_list_text1') }}</span>
                    </div>
                    <view-switch v-if="!(isSpecialCatId(catId) && sodView == 'petite_plus')"></view-switch>
                  </template>
                </div>
              </div>
              <div v-if="showSamplerNote && !isComingSoon" class="sample-note">
                <span v-html="nl('page_sample_list_desc')"></span>
                <span @click="closeBanner" class="sample-note-x"></span>
              </div>
              <div v-if="isStyleQuizShare && emptyInfo.empty" class="empty-style-quiz">
                <div v-html="nl('page_common_style_quiz_matches_none')" class="style-quiz-empty-txt"></div>
                <button :href="countryUrl('/all/bridesmaid-dresses')" class="retake_quiz style_quiz_banner">
                  {{ nl('page_common_style_quiz_retake') }}
                </button>
              </div>
              <!-- ************* 上部分为右侧筛选条件 ************* -->
              <!-- 列表骨架屏，接口请求阶段显示骨架屏，没有商品显示空列表组件 -->
              <skeleton-list :viewSwitch="viewSwitch" v-if="loadingFlag"></skeleton-list>
              <template v-else>
                <empty-product-list v-if="emptyInfo.empty" :emptyInfo="emptyInfo" :markStr="'list'"></empty-product-list>
                <template v-else>
                  <product-list
                    :page="pageInfo.page * 1"
                    :isProductsSplit="isProductsSplit"
                    :resetDisplay="resetDisplay"
                    :scene="productListScene"
                    @quickShop="quickShopClick"
                    @sodViewChange="sodViewChange"
                    @notify-me="notifyMe"
                  ></product-list>
                  <div v-track.viewOnce="getBiCommonParams('select_page_bottom', catBiName + '_button')" class="see-all-page">
                    <az-pager
                      :totalPage="pageInfo.totalPage"
                      :page="pageInfo.page * 1"
                      :isLoading="pageLoading"
                      @pageChange="pageChange"
                    ></az-pager>
                  </div>
                  <button v-if="isStyleQuizShare" :href="countryUrl('/all/bridesmaid-dresses')" class="retake_quiz style_quiz_banner">
                    <img src="~assets/images/style_quiz/retake_quiz.png" alt="retake quiz" />
                    {{ nl('page_common_style_quiz_retake') }}
                  </button>
                </template>
              </template>
              <client-only>
                <cate-nav-menu v-if="cateNavMenus.length && country === 'US' && language === 'en'" :list="cateNavMenus"></cate-nav-menu>
              </client-only>
              <template v-if="catId == 3110">
                <SodListTop />
              </template>
              <template v-if="isSpecialCatId(catId)">
                <TrendingNow :list="trendingNow" />
              </template>
              <category-description v-if="seoInfo" :content="seoInfo.content" :colorContent="seoInfo.colorContent"></category-description>
              <!-- AZWEB-15969 网站google organic search result中增加FAQ -->
              <client-only><SeoFaq /></client-only>
            </div>
          </div>
          <az-loading v-model="loadingFlag" :msgFlag="axiosError"></az-loading>
        </div>
      </div>
      <download-app></download-app>
      <back-to-top></back-to-top>
      <!-- 以下弹框 -->
      <az-confirm
        :continueTxt="nl('page_common_confirm')"
        :confirmContent="nl('page_list_rts_confirm_tip')"
        :onlyConfirmClose="true"
        :showCloseIcon="false"
        :ec="'listpage'"
        :el="'rts_size_choose_pop'"
        v-if="resListConfirmHasShow"
        @closeConfirmDialog="closeConfirmDialog"
      ></az-confirm>
      <afterpay-layer></afterpay-layer>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import PopularFilter from '@/components/list/PopularFilter'
import ListFilters from '@/components/list/ListFilters'
import categorySecondBanner from '@/components/list/categorySecondBanner'
import filterBanner from '@/components/list/filterBanner'
import catTitle from '@/components/list/catTitle'
import SortBy from '@/components/list/sortBy'
import viewSwitch from '@/components/list/viewSwitch'
import EmptyProductList from '@/components/list/EmptyProductList'
import ProductList from '@/components/list/ProductList'
import AzPager from '@/components/az-ui/Pager/AzPager'
import CategoryDescription from '@/components/list/CategoryDescription'
// import QuickShopDialog from '@/components/quickshop/QuickShopDialog'
import filtersMixins from '@/assets/js/filters'
// import topPager from '@/components/list/topPager'
import BackToTop from '@/components/common/BackToTop'
import DownloadApp from '@/components/common/DownloadApp'
import sampleSearch from '@/components/list/sampleSearch'
import currentInStock from '@/components/list/currentInStock'
import AzCheckbox from '@/components/az-ui/AzCheckbox'
import AzLoading from '@/components/az-ui/Loading/AzLoading'
import SkeletonList from '@/components/list/skeleton/SkeletonList'
import SizeChartLayer from '@/components/product/SizeChartLayer'
import StyleQuizShare from '@/components/list/StyleQuizShare'
import SeoThemeBanner from '@/components/list/SeoThemeBanner'
import colorHex from '@/assets/js/colorHex'
import { pathToFilters, sodRequestUrl, objectUrlToStringUrl } from '@/assets/js/utils.js'
import { getCookieByString } from '@/assets/js/pointUtil.js'
import { init, initWebLanguageKeys, resetSeoUrl, getNavigation, getNavigationDynamic } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
import ListTopBanner from '@/components/list/ListTopBanner'
import popularFilterBanner from '@/components/list/popularFilterBanner'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import ColorFamilyFilter from '@/components/list/ColorFamilyFilter'
import AfterpayLayer from '@/components/common/AfterpayLayer'
import SeoFaq from '@/components/list/SeoFaq'
import TrendingNow from '@/components/list/TrendingNow'
import AzConfirm from '@/components/az-ui/AzConfirm'
import SodListTop from '@/components/common/SodListTop'
import HolidayBanner from '@/components/theHolidayShop/holidayBanner'
import CateNavMenu from '@/components/list/CateNavMenu'

import { Base64 } from 'js-base64'

// 广告位特殊处理
const getPosition = (viewSwitch, len, positionImg, index) => {
  const min = 2
  const max = viewSwitch == 'smaller' ? positionImg.position.small : positionImg.position.big

  if (len < min) {
    // 商品小于2位，广告位不显示
    positionImg.position.big = positionImg.position.small = null
    return positionImg
  } else if (len < max) {
    if (index == 0) {
      //   商品数大于2且小于广告位位的位置，则排在数组最后一位 只保留一个banner
      positionImg.position.big = positionImg.position.small = len
      return positionImg
    } else {
      positionImg.position.big = positionImg.position.small = null
    }
  }
  return positionImg
}

const pageLanguageKeys = [
  'page_saletype_sale_offers',
  'page_sample_tryon_dresses_by_favorited',
  'page_list_text1',
  'page_sample_list_desc',
  'page_common_style_quiz_matches_none',
  'page_common_style_quiz_retake',
  'page_image_gift_card_filter_banner1',
  'page_image_gift_card_filter_banner2',
  'page_list_no_result_tips1', // 接口code
  'page_list_no_result_tips2', // 接口code
  /** sale down 页面多语言 */
  'page_common_shop_bridesmaids',
  'page_common_shop_brides',
  'page_index_most_popular',
  /** sale down 页面多语言 end */
  'page_image_gifts_filter_banner1',
  'page_image_gifts_filter_banner2',
  'page_common_confirm',
  'page_list_rts_confirm_tip'
]

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog'),
  // 异步组件加载时使用的组件
  loading: AzLoading
})

const languageKeys = [
  ...MainApp.languageKeys,
  ...catTitle.languageKeys,
  ...SortBy.languageKeys,
  ...viewSwitch.languageKeys,
  ...EmptyProductList.languageKeys,
  ...ProductList.languageKeys,
  ...AzPager.languageKeys,
  ...CategoryDescription.languageKeys,
  // ...QuickShopDialog.languageKeys,
  ...PopularFilter.languageKeys,
  ...ListFilters.languageKeys,
  ...BackToTop.languageKeys,
  ...sampleSearch.languageKeys,
  ...currentInStock.languageKeys,
  ...SizeChartLayer.languageKeys,
  ...DownloadApp.languageKeys,
  ...NotifyMeDialog.languageKeys,
  ...ColorFamilyFilter.languageKeys,
  ...AfterpayLayer.languageKeys,
  ...pageLanguageKeys,
  ...TrendingNow.languageKeys,
  ...SodListTop.languageKeys
]

/**
 * 判断是否全是大码size
 * @param {Object} firstQuery
 * @returns {Boolean} 默认 false
 */
const sizeIsAllPlusSize = (firstQuery) => {
  // const { dress_type: dressType, filtersObj } = firstQuery
  const { filtersObj } = firstQuery
  if (filtersObj.size && !!Object.keys(filtersObj.size).length) {
    return filtersObj.size.every((item) => ['1x', '2x', '3x'].includes(item))
  }
  return false
}

export default {
  name: 'List',
  components: {
    AzConfirm,
    MainApp,
    categorySecondBanner,
    filterBanner,
    catTitle,
    SortBy,
    viewSwitch,
    EmptyProductList,
    ProductList,
    AzPager,
    CategoryDescription,
    QuickShopDialog,
    PopularFilter,
    ListFilters,
    // topPager,
    BackToTop,
    sampleSearch,
    currentInStock,
    AzCheckbox,
    AzLoading,
    SkeletonList,
    SizeChartLayer,
    SeoThemeBanner,
    StyleQuizShare,
    ListTopBanner,
    popularFilterBanner,
    DownloadApp,
    NotifyMeDialog,
    ColorFamilyFilter,
    AfterpayLayer,
    SeoFaq,
    TrendingNow,
    SodListTop,
    HolidayBanner,
    CateNavMenu
  },
  mixins: [filtersMixins, colorHex],
  data() {
    return {
      popularFilterShow: false,
      filterBannerFixed: {},
      listHeight: 0,
      pageLoading: false,
      colorFilterPos: 'header',
      axiosError: false,
      showRoomNumFlag: false,
      stickyTop: 0,
      goodsItem: {},
      filterFixed: {},
      resListConfirmHasShow: false, // rts列表页首次进入时，是否显示弹框
      cateNavMenus: [] // 列表商品底部横向导航菜单数据
    }
  },
  computed: {
    ...mapState('product', ['baseInfo', 'sizeChartLayerShow']),
    ...mapState('list', [
      'imageInfo',
      'styleInfo',
      'stockInfo',
      'retireInfo',
      'viewSwitch',
      'sodView',
      'prodList',
      'pageInfo',
      'loadingFlag',
      'seoCatName',
      'popupMyCharityShow',
      'apiViewMode',
      'isCanLoading',
      'freshDeals',
      'familyColorKey',
      'keepScroll',
      'filterScrollTop',
      'hisSeparateScroll',
      'filters',
      'apiFilters',
      'emptyInfo'
    ]),
    ...mapState({
      flashSale: (state) => state.flashSale,
      isStyleQuizShare: (state) => state.list.apiQuery.from_style_quiz,
      inSpecialOffer: (state) => state.list.inSpecialOffer
    }),
    isShowOrderFilter() {
      return this.sortTypes && Object.keys(this.sortTypes).length > 0
    },
    secondaryBannerData() {
      const secondaryBannerTemp = this.secondaryBanner ? JSON.parse(JSON.stringify(this.secondaryBanner)) : []
      for (const key in this.activityInfo) {
        const activityNow = this.activityInfo[key]
        const bannerKey = this.getListBannerKey()
        if (activityNow.banner && activityNow.banner.secondaryBanner) {
          const activitySecondaryBanner = activityNow.banner.secondaryBanner[bannerKey] || []
          for (const i in activitySecondaryBanner) {
            const bannerData = activitySecondaryBanner[i]
            bannerData.isWebActivity = true
            if (this.isInTime(bannerData.startTime, bannerData.endTime, this.serverTime)) {
              // 因为ga打点需要,所以这里把促销活动的id和name也加进去
              if (activityNow.base) {
                bannerData.activityId = activityNow.base.activityId
                bannerData.activityName = activityNow.base.name
              }
              secondaryBannerTemp.splice(bannerData.displayOrder * 1 - 1, 0, bannerData)
            }
          }
        }
      }
      return secondaryBannerTemp
    },
    filterBannerData() {
      const filterBannerTemp = this.filterBanner ? JSON.parse(JSON.stringify(this.filterBanner)) : []
      for (const key in this.activityInfo) {
        const activityNow = this.activityInfo[key]
        const bannerKey = this.getListBannerKey()
        if (activityNow.banner && activityNow.banner.filterBanner) {
          const activityFilterBanner = activityNow.banner.filterBanner[bannerKey] || []
          const filterBannerTempLen = filterBannerTemp.length
          for (const i in activityFilterBanner) {
            const bannerData = activityFilterBanner[i]
            bannerData.isWebActivity = true
            if (this.isInTime(bannerData.startTime, bannerData.endTime, this.serverTime)) {
              // 因为ga打点需要,所以这里把促销活动的id和name也加进去
              if (activityNow.base) {
                bannerData.activityId = activityNow.base.activityId
                bannerData.activityName = activityNow.base.name
              }
              filterBannerTemp.splice(bannerData.displayOrder * 1 - 1, 0, bannerData)
              filterBannerTemp.splice(filterBannerTempLen, 1)
            }
          }
        }
      }
      return filterBannerTemp
    },
    // tryon dresses默认值
    tryOnDressValue() {
      let res = false
      if (this.$route.query.tryOnDress == 'true' || this.$route.query.tryOnDress == true) res = true
      return res
    },
    // 是否展示try on dress by favorited
    showTryOnByFavorited() {
      return this.dressType == 'sample' && this.isLogin
    },
    showFourStaicBanner() {
      return !(this.$route.query && this.$route.query.utm_source)
    },
    // 是否展示列表内容搜索
    showSampleSearch() {
      // 如果是final sale列表页，根据category筛选项中的needSearch来判断
      if (this.isFinalSaleList) {
        let needSearch = false
        if (this.filters.category) {
          for (const key in this.filters.category.values) {
            if (Object.hasOwnProperty.call(this.filters.category.values, key)) {
              const ele = this.filters.category.values[key]
              if (ele.selected) needSearch = ele.needSearch
            }
          }
        }
        return needSearch
      } else {
        return !this.isFinalSale
      }
    }
  },
  watch: {
    '$route.query': {
      handler(newVal, oldVal) {
        if (!oldVal) return
        console.log('---oldVal--', newVal, oldVal)
        if (this.isCanLoading) {
          this.initListScroll(true)
          if (this.$route.path.includes('/collection/all') || this.$route.path.includes('/collection/eventshop')) this.getFirstScreen()
          this.getProdList()
        }
      },
      immediate: true,
      deep: true
    },
    viewSwitch: {
      handler(val, oldVal) {
        // 根据大小图模式决定广告位
        if (this.positionFixedImgList && this.positionFixedImgList.length) {
          const positionFixedImgListTemp = this.positionFixedImgList.concat([])
          this.positionFixedImgList = []
          for (const i in positionFixedImgListTemp) {
            this.positionFixedImgList[i] = getPosition(val, this.pageInfo.totalCount, positionFixedImgListTemp[i], i)
          }

          let tempProdList = JSON.parse(JSON.stringify(this.prodList))

          // for (const i in positionFixedImgListTemp) {
          //   if (this.positionFixedImgList[i].position.big && this.positionFixedImgList[i].position.small) {
          //     const oldImgPostion =
          //       oldVal == 'smaller' ? positionFixedImgListTemp[i].position.small : positionFixedImgListTemp[i].position.big
          //     tempProdList.splice(oldImgPostion * 1 - i, 1)
          //   }
          // }

          // #19044： 线上问题修复，由于目前网站插入广告位的方式，最终展示的结果会有问题导致 数组计算的index错误，故先改成判断是否是广告位删除
          tempProdList = tempProdList.filter((item = {}) => {
            return !item.position
          })

          // 下面这个这个计算方法是有问题的，使用splice插入的过程中 数组tempProdList的 index会一直改变，所以有点误差，目前还没找到合适的方法，先修复上面的问题，后续可优化
          for (const i in positionFixedImgListTemp) {
            if (this.positionFixedImgList[i].position.big && this.positionFixedImgList[i].position.small) {
              const imgPostion = val == 'smaller' ? this.positionFixedImgList[i].position.small : this.positionFixedImgList[i].position.big
              tempProdList.splice(imgPostion, 0, this.positionFixedImgList[i])
            }
          }

          this.$store.commit('list/setProdList', tempProdList)
          if (this.prodList && this.prodList.length && !this.emptyInfo.empty) {
            const gaParams = this.getGAItemListParams(this.prodList, null, 'view', 'list')
            this.setGA4DataLayer(gaParams)
          }
        }
      },
      deep: true
    },
    loadingFlag: {
      handler(val) {
        this.setMessageZindex(val)
      }
    },
    catId(e) {
      // barbie集合页分类切换时，要切换对应的seo h1显示
      if (process.client && this.$route.path.includes('/collection/eventshop/barbie')) {
        // barbie集合页h1，特殊处理
        if (['barbie_all', 'barbie_bd', 'barbie_wd', 'barbie_fgd'].includes(this.seoCatName)) {
          let seoCatName = ''
          if (e === 7) {
            seoCatName = 'barbie_bd'
          } else if (e === 2) {
            seoCatName = 'barbie_wd'
          } else if (e === 10) {
            seoCatName = 'barbie_fgd'
          } else {
            seoCatName = 'barbie_all'
          }
          this.$store.commit('list/setSeoCatName', seoCatName)
        }
      }
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setJsKey', 'list')
      initWebLanguageKeys(context, languageKeys)
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      // 21186 礼品卡列表页重定向只能在此处理，公共方法用不了
      if (commonAsyncData.requestUrl == '/all/azazie-digital-gift-cards') {
        context.redirect(302, resetSeoUrl(context, '/all/azazie-digital-gift-cards?sort_by=popularity&fromPage=gifts'))
        return
      }
      // gift card页面只有US有数据
      const isGiftCardListPage = commonAsyncData.requestUrl.includes('/all/azazie-digital-gift-cards')
      if (commonAsyncData.requestUrl === '/list' || (isGiftCardListPage && context.store.state.country != 'US')) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      }
      const refererText = context.req && context.req.headers && context.req.headers.referer
      let isBridalSwatches
      let firstQuery = {}
      let result
      let res
      let subRes
      // let colorHexRes

      const positionFixedImgList = []
      let positionFixedImgListTemp = [] // 接口返回广告位信息
      let emptyInfo = {} // 接口返回空页面信息
      let recommendProdList = [] // 接口返回推荐商品
      let hasSeoThemeBanner = false
      let filterBannerTemp = []
      // isFinalSale sod  转 rts 的时候的标志。
      // isFinalSale 为 true的时候，没有viewSize切换功能
      let isFinalSale = false
      let isProductsSplit = false // list 商品是否服务端和客户端分开渲染
      // let productList = []
      let subList = []
      let firstList = []
      let resetDisplay = false
      let tempSodView = null
      let listContentQueryData = {}
      let isFinalSaleList = false // 是否是final-sale列表页
      let landingpage = '' // 配置的活动落地页subject
      let activityPageData = {} // 配置的活动落地页返回的goodsIds等数据
      let productListScene = '' // 列表组件出现的场景类型
      if (commonAsyncData.requestUrl != '/list') {
        // 18421 plus size入口落地页链接改为/special-occasion-plus-size-dresses
        const requestUrl = sodRequestUrl(commonAsyncData.requestUrl)
        // 第二个参数是多语言
        firstQuery = pathToFilters(requestUrl, context.store)
        // sod 需要这里解析出来的尺码做后续切换颜色传大小码图判断
        if (firstQuery.filtersObj.size && Object.keys(firstQuery.filtersObj.size).length) {
          context.store.commit('list/setFilterSize', firstQuery.filtersObj.size)
        } else {
          context.store.commit('list/setFilterSize', [])
        }

        if (firstQuery.query && firstQuery.query.fresh_deals) {
          context.store.commit('list/setFreshDeals', firstQuery.query.fresh_deals)
        }
        isBridalSwatches =
          firstQuery.cat_name === 'swatches' && context.route.query.subsite === 'bridal' && context.store.state.isEnableForBridal
        // 首屏接口
        context.store.commit('list/setApiCatName', firstQuery.cat_name)
        context.store.commit('list/setApiDressType', firstQuery.dress_type)
        context.store.commit('list/setApiFilters', firstQuery.filtersObj)
        context.store.commit('list/setApiMkt', firstQuery.mkt)
        context.store.commit('setDressType', firstQuery.dress_type)
        context.store.commit('setCatName', firstQuery.cat_name)
        context.store.commit('list/setIsOutlet', firstQuery.is_outlet || 0)
        context.store.commit('list/setInSpecialOffer', !!(firstQuery.query && firstQuery.query.inSpecialOffer == 'true'))
        // 因为bd,dresses,婚纱都有大码，根据url路径中的plus-size，判断大码后，在这里设置viewMode，详情见utils中的pathToFilters
        firstQuery.viewMode && context.store.commit('list/setApiViewMode', firstQuery.viewMode)
        if (firstQuery.query) {
          context.store.commit('list/setApiQuery', firstQuery.query)
          firstQuery.query.current_in_stock && context.store.commit('list/setCurrentInStock', firstQuery.query.current_in_stock)
          // 大小图模式
          let initViewSwitch =
            firstQuery.query.view_switch ||
            (context.req && context.req.headers && getCookieByString('view_switch', context.req.headers.cookie))
          if (!['smaller', 'larger'].includes(initViewSwitch)) initViewSwitch = 'smaller'
          context.store.commit('list/setViewSwitch', initViewSwitch || 'smaller')
        }
        if (firstQuery.cat_name == 'dresses') {
          // 胖瘦图模式
          const SOD_VIEW_NEW_COOKIE = context.req && context.req.headers && getCookieByString('SOD_VIEW_NEW', context.req.headers.cookie)
          context.store.commit('list/setApiViewMode', firstQuery.viewMode ? firstQuery.viewMode : [SOD_VIEW_NEW_COOKIE || 'petite'])
          context.store.commit('list/setSodView', firstQuery.viewMode ? firstQuery.viewMode[0] : SOD_VIEW_NEW_COOKIE || 'petite')
          tempSodView = firstQuery.viewMode ? firstQuery.viewMode[0] : SOD_VIEW_NEW_COOKIE || 'petite'
          // 时装胖瘦图并存的时候，默认走小图模式
          if (context.store.state.list.apiViewMode[0] == 'petite_plus') {
            context.store.commit('list/setViewSwitch', 'smaller')
          }
        }
        // 如果路径中有colors-family，取对应的值保存并传值
        if (firstQuery.filtersObj['colors-family'] && firstQuery.filtersObj['colors-family'].length === 1) {
          context.store.commit('list/setFamilyColorKey', firstQuery.filtersObj['colors-family'][0])
        }
        if (firstQuery.cat_name == 'ready-to-ship-party') {
          isFinalSale = true
        }
        const publicData = {
          filters: context.store.state.list.apiFilters,
          view_mode: context.store.state.list.apiViewMode,
          mkt: context.store.state.list.apiMkt,
          originUrl: commonAsyncData.requestUrl
        }
        const firstScreenParams = {
          cat_name: context.store.state.list.apiCatName,
          dress_type: context.store.state.list.apiDressType,
          page: firstQuery.query.page,
          sort_by: firstQuery.query.sort_by,
          in_stock: context.store.state.list.currentInStock,
          ...context.store.state.list.apiQuery,
          is_outlet: context.store.state.list.isOutletm,
          version: 'b', // ui调整的定版，和lego活动配置无关
          bannersVersion: context.store.state.versionGroup.banner_list_top, // 二级banner控制字段
          filterBannerVersion: context.store.state.versionGroup.filter_banner_list_left, // filter banner控制字段
          supportStockSales: firstQuery.query.supportStockSales, // 是否支持非库存商品可以卖库存
          fresh_deals: context.store.state.list.freshDeals
        }
        const contentParams = {
          cat_name: context.store.state.list.apiCatName,
          dress_type: context.store.state.list.apiDressType,
          page: firstQuery.query.page,
          limit: context.store.state.is_chrome_lighthouse ? 15 : 60,
          in_stock: context.store.state.list.currentInStock,
          ...context.store.state.list.apiQuery,
          ...context.route.query,
          is_outlet: context.store.state.list.isOutlet,
          version: 'b', // ui调整的定版，和lego活动配置无关
          supportStockSales: firstQuery.query.supportStockSales, // 是否支持非库存商品可以卖库存
          activityVerison: context.store.state.versionObj.activityAbtest && context.store.state.versionObj.activityAbtest.toLowerCase(), // lego活动配置版本
          galleryVersion: context.store.state.versionGroup.list_content_gallery_ab, // 图片ab版本
          fresh_deals: context.store.state.list.freshDeals,
          topic: isBridalSwatches ? 'bridal' : 'azazie',
          sodGalleryVersion: context.store.state.versionObj.sodGalleryVersion, // sod 强制获取图片ab版本
          listColorVersion: 'A' // 色系排序ab版本
        }
        // 如果路径中有colors-family，取对应的值传给后端
        if (context.store.state.list.familyColorKey) {
          contentParams.familyKey = context.store.state.list.familyColorKey
        }
        // fastDeliveryDress 是sod shipping in 24 特有标记，原supportStockSales已被污染，sod不再使用
        if (firstQuery.query && firstQuery.query.hasOwnProperty('fastDeliveryDress')) {
          firstScreenParams.fastDeliveryDress = firstQuery.query.fastDeliveryDress
          contentParams.fastDeliveryDress = firstQuery.query.fastDeliveryDress
          delete firstScreenParams.supportStockSales
          delete contentParams.supportStockSales
        }
        if (commonAsyncData.requestUrl.includes('/all/final-sale')) {
          isFinalSaleList = true
          firstScreenParams.dress_type = 'sale'
          contentParams.dress_type = 'sale'
        }

        // 判断链接是否全是大码： 样衣和
        if (sizeIsAllPlusSize(firstQuery)) {
          publicData.view_mode = ['plus']
        }
        // /1.0/list/content 接口入参
        listContentQueryData = {
          ...publicData,
          ...contentParams
        }
        if (firstScreenParams.filter) {
          delete firstScreenParams.filter
        }
        if (contentParams.filter) {
          delete contentParams.filter
        }

        // eventshop落地页相关逻辑处理
        if (context.route.path.includes('/collection/eventshop')) {
          productListScene = 'eventshopList'
          landingpage = context.route.query.landingpage
          // 旧地址重定向处理
          // /eventshop和/collection/eventshop两种类型统一改成/collection/eventshop/活动key形式
          if (landingpage) {
            delete context.route.query.landingpage
            const tempQuery = {
              ...context.route.query
            }
            const resUrl = objectUrlToStringUrl('/collection/eventshop/' + landingpage, tempQuery)
            context.redirect(302, resUrl)
            return
          }
          const category = context.route.query.category
          const pathArr = context.route.path.split('/collection/eventshop/')
          if (!landingpage) {
            landingpage = pathArr.length > 1 ? pathArr[1] : ''
            if (landingpage.includes('/with')) {
              landingpage = landingpage.split('/with')[0]
            }
            if (landingpage.includes('/colors')) {
              landingpage = landingpage.split('/colors')[0]
            }
          }
          const params = {
            subject: landingpage
          }
          const configRes = await context.$axios.$get(`/1.0/activityPage/get`, { params })
          if (configRes.code === 0) {
            activityPageData = configRes.data || {}
            const { catIds, goodsIds, goodsColors, supportCustomSort } = activityPageData
            if (goodsIds) {
              firstScreenParams.landingpage = landingpage
              firstScreenParams.isCollectionActivity = true
              firstScreenParams.cat_name = category || 'collection'
              firstScreenParams.supportCustomSort = supportCustomSort
              contentParams.landingpage = landingpage
              contentParams.isCollectionActivity = true
              contentParams.cat_name = category || 'collection'
              contentParams.supportCustomSort = supportCustomSort
              if (!firstQuery.query.sort_by) {
                // 活动落地页默认排序默认most_popular
                firstScreenParams.sort_by = 'popularity'
                contentParams.sort_by = 'popularity'
                // 如果设置了按照上传文件顺序，以上传文件顺序排序
                if (supportCustomSort) {
                  firstScreenParams.sort_by = 'custom'
                  contentParams.sort_by = 'custom'
                }
              }
              publicData.catIds = catIds
              publicData.goodsIds = goodsIds
              if (goodsColors) publicData.goodsColors = goodsColors
            }
          }
        }
        // 首屏、列表、色圈接口并发 colorHexRes
        ;[result, res, subRes] = await Promise.all([
          context.$axios.$post(`/1.0/list/first-screen`, publicData, {
            params: firstScreenParams
          }),
          context.$axios.$post(`/1.0/list/content`, publicData, {
            params: {
              sub_page: 'firstPage', // 客户端和服务端渲染分开，服务端24个商品
              format: 'list',
              ...contentParams
            }
          }),
          context.$axios.$post(`/1.0/list/content`, publicData, {
            params: {
              sub_page: 'secondPage', // 客户端剩余的36个商品
              format: 'list',
              ...contentParams
            }
          })
        ])

        // first-screen首屏数据处理
        if (result.code == 0) {
          if ((result.data.topic === 'bridal' || context.route.query.subsite === 'bridal') && context.store.state.isEnableForBridal) {
            context.store.commit('setIsBridal', result.data.topic === 'bridal') // 这里以接口返回的topic为准
            // if (isBridalSwatches) {
            //   context.store.commit('list/setViewSwitch', 'larger')
            // }
            // 获取bridal导航数据
            // 因为活动信息区分主题，婚纱页面在commonAsyncData文件里获取到的主题值有误，所以这里需要重新查询活动信息数据，否则婚纱页面会出现内容闪现问题
            await Promise.all([getNavigation(context), getNavigationDynamic(context, context.store.state.versionObj, true)])
          }
          if (result.data.pageConfig) {
            context.store.commit('list/setApiCatName', result.data.pageConfig.cat_name)
          }
          // context.store.commit('list/setPageConfig', result.data.pageConfig)
          context.store.commit('setCatId', result.data.pageConfig.catId)
          if ([3110].includes(result.data.pageConfig.catId)) {
            context.store.commit('list/setViewSwitch', 'larger')
          }
          // todo: 设置catIds
          context.store.commit('setCatIds', result.data.pageConfig.catIds)
          if ([3, 3110].includes(result.data.pageConfig.catId) && firstQuery.query.os) {
            context.store.commit('list/setOnSale', true)
          }
          context.store.commit('setComingSoon', result.data.pageConfig.isComingSoon)
          if (result.data.pageConfig && result.data.pageConfig.filters) {
            if (result.data.pageConfig.filters.price) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.price[0])
            } else if (result.data.pageConfig.filters.pricecadca) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.pricecadca[0])
            } else if (result.data.pageConfig.filters.priceaudau) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.priceaudau[0])
            } else if (result.data.pageConfig.filters.pricegbpgb) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.pricegbpgb[0])
            } else if (result.data.pageConfig.filters.priceeurfr) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurfr[0])
            } else if (result.data.pageConfig.filters.pricemxnmx) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.pricemxnmx[0])
            } else if (result.data.pageConfig.filters.priceeurde) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurde[0])
            } else if (result.data.pageConfig.filters.priceeures) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeures[0])
            } else if (result.data.pageConfig.filters.priceeurit) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurit[0])
            } else if (result.data.pageConfig.filters.priceeurie) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurie[0])
            } else if (result.data.pageConfig.filters.priceeurnl) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurnl[0])
            } else if (result.data.pageConfig.filters.priceeurbe) {
              context.store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurbe[0])
            } else {
              context.store.commit('list/setPriceRange', 'price0-0')
            }
          } else {
            context.store.commit('list/setPriceRange', 'price0-0')
          }
          if (result.data.themeBanner) {
            hasSeoThemeBanner = true
            context.store.commit('list/setSeoThemeBanner', result.data.themeBanner)
          } else {
            hasSeoThemeBanner = false
            context.store.commit('list/setSeoThemeBanner', [])
          }
          if (result.data.filterBanner && result.data.filterBanner.length > 3) {
            // 截取前三个
            filterBannerTemp = result.data.filterBanner.slice(0, 3)
          } else {
            filterBannerTemp = result.data.filterBanner
          }
          // 21186-礼品卡列表页 filterbanner 置空
          if (commonAsyncData.requestUrl.includes('/all/all-gifts') || isGiftCardListPage) {
            filterBannerTemp = []
          }
          // 处理google seo
          context.store.commit('list/setSeoFaqList', result.data.faqInfo || [])
          //  是否显示BD库存筛选按钮
          context.store.commit('list/setShowSupportStockSales', result.data.supportStockSales)
          context.store.commit('list/setSupportStockSales', firstQuery.query.supportStockSales * 1 || 0)
          // sod 是否显示 shipping in 24
          context.store.commit('list/setShowFastDeliveryDress', result.data.fastDeliveryDress)
          context.store.commit('list/setFastDeliveryDress', firstQuery.query.fastDeliveryDress * 1 || 0)
        } else if (result.code == 5) {
          context.error({
            statusCode: 200,
            message: result.msg ? result.msg : 'service are unavailable temporarily, please refresh page!'
          })
          return
        } else if (result.code == 404) {
          context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
          return
        }

        // list content 服务端数据处理
        if (res.code == 0) {
          firstList = res.data.prodList || []
          // productList = res.data.prodList || []
          // 处理无结果页
          if (res.data.empty) {
            emptyInfo = {
              empty: res.data.empty,
              continueShoppingUrl: res.data.continueShoppingUrl,
              btnText: res.data.btnText,
              text: res.data.text,
              shopAll: res.data.shopAll || '',
              noResultTips1: res.data.noResultTips1,
              noResultTips2: res.data.noResultTips2,
              removeAllFilterUrl: res.data.removeAllFilterUrl
            }
            recommendProdList = res.data.recommendProdList || []
          } else {
            emptyInfo = {}
          }
          context.store.commit('list/setEmptyInfo', emptyInfo)
          // 处理广告位
          if (res.data.positionImg && res.data.positionImg.length > 0) {
            positionFixedImgListTemp = res.data.positionImg
          }
          context.store.commit('list/setFilters', res.data.filters)
          context.store.commit('list/setPageInfo', res.data.pageInfo)
          context.store.commit('list/setPopularFilters', res.data.popularFilters)
          let seoCatName = res.data.seoInfo && res.data.seoInfo.seoCatName
          // 特殊处理eventshop活动列表页的seo标题，优先common seo，否则取接口subject
          if (context.route.path.includes('/collection/eventshop')) {
            if (context.route.path.includes('/collection/eventshop/barbie-azazie-swatches-collection')) {
              // barbie色卡seo name固定
              seoCatName = 'barbie_swatches'
            } else if (commonAsyncData.seoInfo && commonAsyncData.seoInfo.h1) {
              seoCatName = commonAsyncData.seoInfo.h1
            } else {
              seoCatName = activityPageData.subject
              // barbie集合页h1，特殊处理
              if (seoCatName.toLowerCase() === 'BARBIE-AZAZIE-STYLE-COLLECTION'.toLowerCase()) {
                const catId = result.data.pageConfig.catId
                if (catId === 7) {
                  seoCatName = 'barbie_bd'
                } else if (catId === 2) {
                  seoCatName = 'barbie_wd'
                } else if (catId === 10) {
                  seoCatName = 'barbie_fgd'
                } else {
                  seoCatName = 'barbie_all'
                }
              }
            }
          }
          context.store.commit('list/setSeoCatName', seoCatName)
          context.store.commit('list/setShopByStyle', (res.data.keywordsFilters && res.data.keywordsFilters.shop_by_style) || [])
          context.store.commit('list/setFinalInfo', res.data.finalInfo || {})
          context.store.commit('setSubSmallBox', res.data.subSmallBox || [])
          context.store.commit('list/setShowSodNewSmallBox', res.data.showSodNewSmallBox || false)
          // 处理列表页上方色系的选中状态
          if (res.data.filters && res.data.filters.list_colors_family && res.data.filters.list_colors_family.values) {
            let selectedColorFamily = {}
            for (const key in res.data.filters.list_colors_family.values) {
              const familyItem = res.data.filters.list_colors_family.values[key]
              if (familyItem && familyItem.selected) {
                selectedColorFamily = JSON.parse(JSON.stringify(familyItem))
              }
            }
            context.store.commit('list/setSelectedColorFamily', selectedColorFamily)
          }

          // 是否color family落地页
          context.store.commit('list/setIsLandPage', res.data.isLandPage || false)
        } else if (res.code == 5) {
          context.error({
            statusCode: 200,
            message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
          })
          return
        } else if (res.code == 404) {
          context.redirect(302, resetSeoUrl(context, `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
          return
        }

        // 分2个接口并发请求，加快请求速度
        if (subRes.code == 0) {
          subList = subRes.data.prodList || []
          let productList = [...firstList, ...subList] // 商品数据合并

          // 处理服务端和客户端渲染
          if (productList.length > 15) {
            isProductsSplit = true
          }
          // 处理无结果时推荐商品
          if (Object.keys(emptyInfo).length) {
            productList = recommendProdList
            if (process.server) {
              context.res.statusCode = 404
            } // 无结果情况下 code 设置成404
          }

          // 数据合并之后处理广告位
          const viewSwitch = context.store.state.list.viewSwitch
          if (positionFixedImgListTemp.length > 0) {
            for (const i in positionFixedImgListTemp) {
              positionFixedImgList[i] = getPosition(viewSwitch, productList.length, positionFixedImgListTemp[i], i)
            }
            for (const i in positionFixedImgList) {
              if (positionFixedImgList[i].position.big && positionFixedImgList[i].position.small) {
                const imgPostion = viewSwitch == 'smaller' ? positionFixedImgList[i].position.small : positionFixedImgList[i].position.big
                // 根据大小图模式决定广告位
                productList.splice(imgPostion * 1, 0, positionFixedImgList[i])
              }
            }
          }
          // comments: 16080 需要知道商品的位置，不用列表渲染index是因为大于第一页需要加上第一页的数量
          let addIndex = 0
          if (firstQuery.query.page) {
            addIndex += (+firstQuery.query.page - 1) * 60
          }
          productList.forEach((item, index) => (item.indexNo = index + 1 + addIndex))
          context.store.commit('list/setProdList', productList)
          productList.forEach((item) => {
            if (tempSodView == 'petite_plus' || (item.specialPlus && [2, 8].includes(result.data.pageConfig.catId))) {
              resetDisplay = true
            }
          })
        }

        // 列表页将colorHex放在首屏里面，优化页面渲染
        // if (colorHexRes.code == 0) {
        //   context.store.commit('setColorHex', colorHexRes.data.colorHex)
        // }
      }

      context.store.commit('list/setIsCanLoading', false)
      context.store.commit('list/setLoadingFlag', false)
      const seoInfo = res.data.seoInfo
      if (seoInfo.content) seoInfo.content = Base64.encode(seoInfo.content)
      context.store.commit('analysis/updateTime', ['asyncDataEnd', +new Date()])
      return {
        ...commonAsyncData,
        seoInfo,
        referer: refererText,
        dataLayerInfo: res.data.dataLayerInfo,
        secondaryBanner: result.data.secondaryBanner,
        squaresBanner: result.data.squaresBanner,
        filterBanner: filterBannerTemp,
        positionFixedImgList,
        // emptyInfo,
        sortTypes: res.data.sortTypes,
        hasSeoThemeBanner,
        shouldShowSpecialOffer: result.data.shouldShowSpecialOffer,
        isFinalSale,
        isProductsSplit,
        completeLookGoodsList: res.data.completeLookGoodsList || {},
        resetDisplay,
        isBridalSwatches,
        trendingNow: res.data.trendingNowBanner || [],
        listContentQueryData: JSON.stringify(listContentQueryData),
        isFinalSaleList,
        landingpage,
        activityPageData,
        productListScene
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
    if (!this.colorHex || !Object.keys(this.colorHex).length) {
      this.getColorHexAjax()
    }
    if (process.client) {
      if (this.isCanLoading) {
        this.initListScroll(true)
        this.getFirstScreen()
        this.getProdList()
      } else {
        // ga4打点，一次性打一页的
        // eslint-disable-next-line
        if (this.prodList && this.prodList.length && !this.emptyInfo.empty) {
          const gaParams = this.getGAItemListParams(this.prodList, null, 'view', 'list')
          this.setGA4DataLayer(gaParams)
        }
        if (this.country === 'US' && this.language === 'en') this.getCateNavMenus()
      }
    } else if (!this.filtersOpen.length) {
      this.getFiltersOpen()
    }
  },
  mounted() {
    this.$nextTick(() => {
      // rts 弹框
      const resListConfirmHasShow = localStorage.getItem('resListConfirmHasShow')
      if (!resListConfirmHasShow && this.dressType == 'clearance') {
        this.resListConfirmHasShow = true
        localStorage.setItem('resListConfirmHasShow', 1)
      }

      // #16198： 列表页的filter模块和右侧商品模块分开滚动之后， popular filter 模块不再出现了，所以这里就不需要再执行 popularScroll 方法，filterbanner会跟filter模块一块处理，所以也不需要再执行filterBannerScroll 方法。
      // if (this.popularFilterFlag) {
      //   window.addEventListener('scroll', this.popularScroll, false)
      // } else if (this.filterBannerData && this.filterBannerData.length) {
      //   window.addEventListener('scroll', this.filterBannerScroll, false)
      // }
      // 一进来先设置cat-left-scroll 的样式
      this.filterScroll()
      window.addEventListener('scroll', this.filterScroll, false)

      // todo: 首次进入页面执行一次，后续在this.getFirstScreen()方法调用成功在执行一次
      if (!this.isCanLoading) {
        this.pageviewPoint()
      }
    })
    this.trackViewCategory({ style_ids: this.prodList })
    if (this.referer && !window.name) {
      window.name = 'firstLoad'
      const reg = /(.*)azazie(.ca|.com)(\/)?$/
      if (this.referer.indexOf('?') > 0) {
        if (reg.test(this.referer.substr(0, this.referer.indexOf('?')))) {
          this.buryPoint(this, 'event', {
            ec: 'Homepage',
            el: 'Homepage2listpage',
            ea: 'view'
          })
        }
      } else if (reg.test(this.referer)) {
        this.buryPoint(this, 'event', {
          ec: 'Homepage',
          el: 'Homepage2listpage',
          ea: 'view'
        })
      }
    }
    // todo: jira--14877 通过搜索的商品加订单追踪及搜索结果打点
    if (this.$route.query.from && this.$route.query.from == 'search') {
      const hasresult = this.prodList && !!this.prodList.length && !this.emptyInfo.empty ? '1' : '0'
      const fromSource = this.$cookie.getCookie('fromSource')
      fromSource != '1' &&
        this.buryPoint(this, 'event', {
          ec: 'search',
          el: 'results',
          ea: 'view',
          msg: JSON.stringify({
            q: this.searchQ,
            hasresult
          })
        })
      this.setOrderSourceFlag('search_result', true)
    }
    this.showSamplerNote = this.dressType == 'sample' && localStorage.getItem('sample-note') != 1
  },
  beforeDestroy() {
    // if (this.popularFilterFlag) {
    //   window.removeEventListener('scroll', this.popularScroll, false)
    // } else if (this.filterBannerData && this.filterBannerData.length) {
    //   window.removeEventListener('scroll', this.filterBannerScroll, false)
    // }
    window.addEventListener('scroll', this.filterScroll, false)
  },
  methods: {
    // 获取底部导航菜单数据
    getCateNavMenus() {
      // 列表页底部横向导航菜单接口
      this.$axios
        .$get('/1.0/navigation/list-page-bottom?catId=' + this.catId)
        .then((res) => {
          if (res.code === 0) {
            this.cateNavMenus = res.data.navigationList || []
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    closeConfirmDialog() {
      document.querySelector('.filter-size-block') && document.querySelector('.filter-size-block').scrollIntoView({ block: 'start' })
      setTimeout(() => {
        const element = document.querySelector('.filter-body.filter-size')
        element && element.classList.add('animated-shake')
        this.resListConfirmHasShow = false
      }, 400)
    },
    getListBannerKey() {
      // 获取当前页面标识，用来索引对应下标的列表或filter活动banner
      let bannerKey = this.catId
      if (this.isComingSoon) {
        bannerKey = 'coming_soon_' + this.catId
      } else if (this.apiCatName && this.apiCatName == 'final-sale') {
        bannerKey =
          (this.apiFilters.category && this.apiFilters.category[0] && this.apiFilters.category[0].replace(/-/g, '_')) || 'final_sale'
      } else if (['clearance', 'outlet'].includes(this.dressType) || (this.apiCatName && this.apiCatName.includes('collection'))) {
        bannerKey = this.apiCatName.replace(/-/g, '_')
      } else if (this.dressType == 'sample') {
        const catId = this.catId || 0
        bannerKey = 'sample_' + catId
      } else if (this.catName == 'bridesmaid-dresses') {
        bannerKey = '7_0'
      } else if (bannerKey == '36') {
        bannerKey = '33'
      }
      return bannerKey
    },
    // 首屏信息
    async getFirstScreen() {
      try {
        const params = {
          cat_name: this.$store.state.list.apiCatName,
          dress_type: this.$store.state.list.apiDressType,
          page: this.pageInfo.page,
          sort_by: this.$store.state.list.sortBy,
          in_stock: this.$store.state.list.currentInStock,
          ...this.$store.state.list.apiQuery,
          ...this.$route.query,
          is_outlet: this.$store.state.list.isOutlet,
          version: 'b',
          bannersVersion: this.$store.state.versionGroup.banner_list_top,
          filterBannerVersion: this.$store.state.versionGroup.filter_banner_list_left,
          fresh_deals: this.$store.state.list.freshDeals
        }
        if (this.$route.query && this.$route.query.hasOwnProperty('fastDeliveryDress')) {
          delete params.supportStockSales
        }
        if (this.$route.path.includes('/all/final-sale')) {
          this.isFinalSaleList = true
          params.dress_type = 'sale'
        } else {
          this.isFinalSaleList = false
        }
        if (params.filter) {
          delete params.filter
        }

        const payload = {
          filters: this.$store.state.list.apiFilters,
          view_mode: this.apiViewMode,
          mkt: this.$store.state.list.apiMkt,
          originUrl: this.$route.fullPath
        }
        // 如果是活动落地页，添加goodsIds等参数
        if (this.$route.path.includes('/collection/eventshop')) {
          const { category } = this.$route.query
          const { catIds, goodsIds, goodsColors, supportCustomSort } = this.activityPageData
          params.landingpage = this.landingpage
          params.isCollectionActivity = true
          params.cat_name = category || 'collection'
          params.supportCustomSort = supportCustomSort
          if (supportCustomSort && !params.sort_by) params.sort_by = 'custom'
          payload.catIds = catIds
          payload.goodsIds = goodsIds
          if (goodsColors) payload.goodsColors = goodsColors
        }
        const result = await this.$axios.$post(`/1.0/list/first-screen`, payload, {
          params
        })
        if (result.code == 0) {
          //  是否显示BD库存筛选按钮
          this.$store.commit('list/setShowSupportStockSales', result.data.supportStockSales)
          this.$store.commit('list/setShowFastDeliveryDress', result.data.fastDeliveryDress)
          this.$store.commit('setCatId', result.data.pageConfig.catId)
          this.$store.commit('setCatIds', result.data.pageConfig.catIds)
          this.$store.commit('setComingSoon', result.data.pageConfig.isComingSoon)
          if (this.isSpecialCatId(result.data.pageConfig.catId) && this.$route.query.os) {
            this.$store.commit('list/setOnSale', true)
          }
          if (result.data.filterBanner && result.data.filterBanner.length > 3) {
            // 截取前三个
            this.filterBanner = result.data.filterBanner.slice(0, 3)
          } else {
            this.filterBanner = result.data.filterBanner
          }
          // 21186-礼品卡列表页 filterbanner 置空
          if (this.$route.path.includes('/all/all-gifts') || this.$route.path.includes('/all/azazie-digital-gift-cards')) {
            this.filterBanner = []
          }
          this.secondaryBanner = result.data.secondaryBanner
          this.shouldShowSpecialOffer = result.data.shouldShowSpecialOffer
          if (result.data.pageConfig && result.data.pageConfig.filters) {
            if (result.data.pageConfig.filters.price) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.price[0])
            } else if (result.data.pageConfig.filters.pricecadca) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.pricecadca[0])
            } else if (result.data.pageConfig.filters.priceaudau) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.priceaudau[0])
            } else if (result.data.pageConfig.filters.pricegbpgb) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.pricegbpgb[0])
            } else if (result.data.pageConfig.filters.priceeurfr) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurfr[0])
            } else if (result.data.pageConfig.filters.pricemxnmx) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.pricemxnmx[0])
            } else if (result.data.pageConfig.filters.priceeurde) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurde[0])
            } else if (result.data.pageConfig.filters.priceeures) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeures[0])
            } else if (result.data.pageConfig.filters.priceeurit) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurit[0])
            } else if (result.data.pageConfig.filters.priceeurie) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurie[0])
            } else if (result.data.pageConfig.filters.priceeurnl) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurnl[0])
            } else if (result.data.pageConfig.filters.priceeurbe) {
              this.$store.commit('list/setPriceRange', result.data.pageConfig.filters.priceeurbe[0])
            } else {
              this.$store.commit('list/setPriceRange', 'price0-0')
            }
          } else {
            this.$store.commit('list/setPriceRange', 'price0-0')
          }
          if (result.data.pageConfig) {
            this.$store.commit('list/setApiCatName', result.data.pageConfig.cat_name)
          }
          if (result.data.themeBanner) {
            this.hasSeoThemeBanner = true
            this.$store.commit('list/setSeoThemeBanner', result.data.themeBanner)
          } else {
            this.hasSeoThemeBanner = false
            this.$store.commit('list/setSeoThemeBanner', [])
          }
          // todo: 在此处调用是因为接口异步catIds 会是上一次的状态，并非最新状态
          this.pageviewPoint()

          if (this.country === 'US' && this.language === 'en') this.getCateNavMenus()
        }
      } catch (error) {
        this.axiosError = true
      }
    },
    /**
     * 获取商品列表
     * cat_name
     * dressType
     * page
     * limit
     * sort_by
     * sod_view
     */
    async getProdList() {
      this.resetDisplay = false
      try {
        // sod 需要这里解析出来的尺码做后续切换颜色传大小码图判断
        const firstQuery = pathToFilters(this.$route.path, this.$store)
        if (firstQuery.filtersObj.size && Object.keys(firstQuery.filtersObj.size).length) {
          this.$store.commit('list/setFilterSize', firstQuery.filtersObj.size)
        } else {
          this.$store.commit('list/setFilterSize', [])
        }
        this.$store.commit('list/setSupportStockSales', this.$route.query.supportStockSales * 1 || 0)
        this.$store.commit('list/setFastDeliveryDress', this.$route.query.fastDeliveryDress * 1 || 0)
        const params = {
          cat_name: this.$store.state.list.apiCatName,
          dress_type: this.$store.state.list.apiDressType,
          page: this.pageInfo.page,
          limit: this.pageInfo.limit,
          in_stock: this.$store.state.list.currentInStock,
          ...this.$store.state.list.apiQuery,
          ...this.$route.query,
          is_outlet: this.$store.state.list.isOutlet,
          version: 'b',
          activityVerison: this.versionObj.activityAbtest && this.versionObj.activityAbtest.toLowerCase(),
          galleryVersion: this.$store.state.versionGroup.list_content_gallery_ab, // 图片ab版本
          fresh_deals: this.$route.query.fresh_deals,
          sodGalleryVersion: this.$store.state.versionObj.sodGalleryVersion, // sod 强制获取图片ab版本
          topic: this.isBridalSwatches ? 'bridal' : 'azazie',
          listColorVersion: 'A' // 色系排序ab版本
        }
        if (this.$route.query && this.$route.query.hasOwnProperty('fastDeliveryDress')) {
          delete params.supportStockSales
        }
        if (this.familyColorKey) {
          params.familyKey = this.familyColorKey // best seller、new in 默认显示色泡
        }
        if (params.filter) delete params.filter
        if (this.$route.path.includes('/all/final-sale')) {
          this.isFinalSaleList = true
          params.dress_type = 'sale'
        } else {
          this.isFinalSaleList = false
        }

        const payload = {
          filters: this.$store.state.list.apiFilters,
          view_mode: sizeIsAllPlusSize(firstQuery) ? ['plus'] : this.apiViewMode,
          mkt: this.$store.state.list.apiMkt,
          originUrl: this.$route.fullPath
        }
        // 如果是活动落地页，添加goodsIds等参数
        if (this.$route.path.includes('/collection/eventshop')) {
          const { category } = this.$route.query
          const { catIds, goodsIds, goodsColors, supportCustomSort } = this.activityPageData
          params.landingpage = this.landingpage
          params.isCollectionActivity = true
          params.cat_name = category || 'collection'
          params.supportCustomSort = supportCustomSort
          if (supportCustomSort && !params.sort_by) params.sort_by = 'custom'
          payload.catIds = catIds
          payload.goodsIds = goodsIds
          if (goodsColors) payload.goodsColors = goodsColors
        }

        const res = await this.$axios.$post(`/1.0/list/content`, payload, {
          params: {
            format: 'list',
            ...params
          }
        })

        if (res.code == 0) {
          let productList = res.data.prodList || []
          this.$store.commit('list/setPageInfo', res.data.pageInfo)
          this.$store.commit('setSubSmallBox', res.data.subSmallBox || [])
          this.$store.commit('list/setShowSodNewSmallBox', res.data.showSodNewSmallBox || false)
          let emptyInfo = {}
          if (res.data.empty) {
            productList = res.data.recommendProdList || []
            emptyInfo = {
              empty: res.data.empty,
              continueShoppingUrl: res.data.continueShoppingUrl,
              btnText: res.data.btnText,
              text: res.data.text,
              shopAll: res.data.shopAll || '',
              noResultTips1: res.data.noResultTips1,
              noResultTips2: res.data.noResultTips2,
              removeAllFilterUrl: res.data.removeAllFilterUrl
            }
          } else {
            emptyInfo = {}
          }
          this.$store.commit('list/setEmptyInfo', emptyInfo)
          if (res.data.positionImg && res.data.positionImg.length) {
            const positionFixedImgListTemp = res.data.positionImg
            this.positionFixedImgList = []
            for (const i in positionFixedImgListTemp) {
              this.positionFixedImgList[i] = getPosition(this.viewSwitch, productList.length, positionFixedImgListTemp[i], i)
            }

            for (const i in this.positionFixedImgList) {
              if (this.positionFixedImgList[i].position.big && this.positionFixedImgList[i].position.small) {
                const imgPostion =
                  this.viewSwitch == 'smaller' ? this.positionFixedImgList[i].position.small : this.positionFixedImgList[i].position.big
                productList.splice(imgPostion * 1, 0, this.positionFixedImgList[i])
              }
            }
          }
          let addIndex = 0
          addIndex += (+this.pageInfo.page - 1) * 60
          productList.forEach((item, index) => {
            item.indexNo = index + 1 + addIndex
            if (this.sodView == 'petite_plus' || (item.specialPlus && [2, 8].includes(this.catId))) {
              this.resetDisplay = true
            }
          })
          this.$store.commit('list/setProdList', productList)
          if (this.prodList && this.prodList.length && !this.emptyInfo.empty) {
            const gaParams = this.getGAItemListParams(this.prodList, null, 'view', 'list')
            this.setGA4DataLayer(gaParams)
          }

          if (res.data.prodList && res.data.prodList.length > 0) {
            this.$nextTick(() => {
              this.$refs.main && this.$refs.main.getFavGoodsList()
            })
          }
          this.$store.commit('list/setFilters', res.data.filters)
          this.$store.commit('list/setPopularFilters', res.data.popularFilters)
          if (!this.$route.path.includes('/collection/eventshop')) {
            this.$store.commit('list/setSeoCatName', res.data.seoInfo.seoCatName)
          }
          this.$store.commit('list/setIsLandPage', res.data.isLandPage || false) // 是否color family落地页
          // seoInfo 更改
          const seoInfo = res.data.seoInfo
          if (seoInfo.content) seoInfo.content = Base64.encode(seoInfo.content)
          this.seoInfo = seoInfo
          this.sortTypes = res.data.sortTypes

          // 处理列表页上方色系的选中状态
          if (res.data.filters && res.data.filters.list_colors_family && res.data.filters.list_colors_family.values) {
            // 处理列表页上方色系的选中状态
            let selectedColorFamily = {}
            for (const key in res.data.filters.list_colors_family.values) {
              const familyItem = res.data.filters.list_colors_family.values[key]
              if (familyItem && familyItem.selected) {
                selectedColorFamily = JSON.parse(JSON.stringify(familyItem))
              }
            }
            this.$store.commit('list/setSelectedColorFamily', selectedColorFamily)
          }
          this.initListScroll()
        }
        this.$nextTick(() => {
          if (this.apiCatName == 'ready-to-ship-party') {
            this.isFinalSale = true
          }
        })
        if (!this.axiosError) {
          this.$store.commit('list/setIsCanLoading', false)
          this.$store.commit('list/setLoadingFlag', false)
        }
      } catch (error) {
        this.axiosError = true
      }
    },
    // 分页
    pageChange(val) {
      this.changeQuery({
        page: val
      })
    },
    sodViewChange(val) {
      this.changeQuery({
        sod_view: val
      })
    },
    sortByChange(val) {
      let params = {
        sort_by: val,
        page: 1
      }
      // eventshop路径中会存在category
      if (this.$route.path.includes('/collection/eventshop')) {
        params = {
          ...this.$route.query,
          ...params
        }
      }
      this.changeQuery(params)
    },
    checkboxSelect() {
      this.$store.commit('list/setInSpecialOffer', !this.inSpecialOffer)
      this.changeQuery({
        inSpecialOffer: this.inSpecialOffer
      })
    },
    handleNormalStockChange(supportStockSales) {
      this.$store.commit('list/setSupportStockSales', supportStockSales * 1 || 0)
      this.changeQuery({
        supportStockSales: this.supportStockSales,
        page: 1
      })
    },
    // sod shipping in 24
    handleSodChange(fastDeliveryDress) {
      this.$store.commit('list/setFastDeliveryDress', fastDeliveryDress * 1 || 0)
      this.changeQuery({
        fastDeliveryDress: this.fastDeliveryDress,
        page: 1
      })
    },
    currentInStockChange(val) {
      this.changeQuery({ current_in_stock: val })
    },
    sampleSearchChange(valObj) {
      this.changeQuery(valObj)
    },
    popularScroll() {
      const popularFilter = this._$$('#popularFilter')
      const azFooterBox = this._$$('.az-footer-box')
      if (popularFilter) {
        // 优化了小屏幕下，popularFilter出来但是右侧空白的情况，加上 document.querySelector('.az-footer-box').getBoundingClientRect().top > 100
        if (this._$$Rect(popularFilter).top < 83 && ((azFooterBox && this._$$Rect(azFooterBox).top > 100) || !azFooterBox)) {
          this.popularFilterShow = true
        } else {
          this.popularFilterShow = false
        }
      } else {
        this.popularFilterShow = false
      }
      // comments: 控制popularFilterBanner
      if (this.popularFilterShow) {
        const simpleFilterBox = this._$$('.simple-filters-box')
        const popularFilterBanner = this._$$('.popular-filter-banner')
        if (simpleFilterBox && this._$$Rect(simpleFilterBox)) {
          popularFilterBanner && popularFilterBanner.style.setProperty('top', this._$$Rect(simpleFilterBox).bottom + 15 + 'px', 'important')
        }
      }
    },
    filterBannerScroll() {
      const filterBanner = this._$$('#filter_banner')
      if (filterBanner) {
        const filterRect = this._$$Rect(filterBanner)
        const listFiltersBox = this._$$('.list-filters-box')
        const catProdList = this._$$('.cat-prod-list')
        const footerTop = this._$$Rect(this._$$('.az-footer-box')).top
        if (!this.listHeight && catProdList) {
          this.listHeight = this._$$Rect(catProdList).height + 180
        }
        const leftHeight = listFiltersBox ? this._$$Rect(listFiltersBox).height + filterRect.height : filterRect.height
        const headerActivityDom = this._$$('#az-header-activity')
        const topHeight = ((headerActivityDom && headerActivityDom.offsetHeight) || 0) + 56
        if (
          this.listHeight > leftHeight &&
          filterRect.top < topHeight + 2 &&
          (listFiltersBox
            ? this._$$Rect(listFiltersBox).bottom < topHeight - 3
            : this._$$Rect(this._$$('#listFiltersTop')).top < topHeight - 3)
        ) {
          if (filterRect.height + topHeight + 2 <= footerTop) {
            this.filterBannerFixed = {
              position: 'sticky',
              top: topHeight + 'px',
              // bottom: 'auto',
              'z-index': 10,
              overflowY: 'auto',
              height: `calc(100vh - ${topHeight}px)`
            }
          }
        } else {
          this.filterBannerFixed = {}
        }
      } else {
        this.filterBannerFixed = {}
      }
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    getCartInfo() {
      this.$refs.main.getCartInfo()
    },
    // try on dress by favorited 修改监听
    handleTryOnChange(e) {
      let query = { tryOnDress: e }
      // 选中try on dress后，sort by置为default
      if (e) {
        query = {
          ...query,
          sort_by: 'default',
          page: 1
        }
      } else {
        // 当try on dress by favorited被选中时，sort_by选项会多出来一个default选项
        // 当取消选中时，sort_by选项就没有default参数了
        // 所以，当try on dress by favorited取消选中时，清楚url query中的sort_by和page
        query = {
          ...query,
          sort_by: null,
          page: null
        }
      }
      // 跟现有代码风格保持一致，修改url路径传参
      this.changeQuery(query)
    },
    pageviewPoint() {
      if (process.server) return
      const pageview = {
        lgt: new Date().getTime(),
        param1: (location && location.href) || '-1',
        param3: (document && document.referrer) || '-1',
        msg: {
          dress_type: this.dressType,
          cat_name: this.catName,
          // cat_id: this.catId,
          category_ids: this.catIds.length ? this.catIds.join(',') : '',
          cdn_prvd: this.catIds.length == 1 && this.catIds[0] == 9 ? this.cdnPrvd(this.catIds[0]) : -1
        }
      }
      // comments BI 要求catId有值才传（rts这些会存在多个catId 此时catId就是空）
      if (this.catId && this.catId > 0) {
        pageview.msg.cat_id = this.catId
      }
      // 通过搜索页面过来的，前端会在链接上加上from_type，表示来源，需要加在打点里面
      if (this.$route.query && this.$route.query.from_type) {
        pageview.msg.from_type = this.$route.query.from_type
      }
      let linkId = this.$route.query.link_id
      if (linkId) {
        // 如果存在linkId，存入cookie中
        this.$cookie.setCookie('link_id', linkId, 365)
        pageview.msg.link_id = linkId
      } else {
        // 如果路径中不存在link_id，判断cookie中是否有link_id
        linkId = this.$cookie.getCookie('link_id')
        if (linkId) {
          pageview.msg.link_id = linkId
        }
      }
      this.buryPoint(this, 'pageview', pageview)
    },
    // comments: document.querySelector别称
    _$$(selector) {
      if (process.client) {
        return document.querySelector(selector)
      }
    },
    // comments: getBoundingClientRect()别称
    _$$Rect(dom) {
      if (process.client) {
        return dom && dom.getBoundingClientRect()
      }
    },
    notifyMe(item) {
      this.$set(this, 'goodsItem', item)
      this.$store.commit('setOpenNotifyMe', true)
    },
    filterScroll() {
      const catLeftScrollBox = this._$$('#cat-left-scroll')
      const catLeftBox = this.$refs.catLeft
      if (catLeftScrollBox && catLeftBox) {
        let top = catLeftBox.getBoundingClientRect().top
        const headerTranslate = this.$refs.main ? this.$refs.main.headerTranslate : 0
        const h = document.querySelector('.sticky-header') ? document.querySelector('.sticky-header').getBoundingClientRect().height : 0
        const topHeight = h - headerTranslate
        let filterTop = top
        let filterHeight = top

        if (top <= topHeight) {
          top = topHeight
          // 滚动的时候顶部底部上下要留20px的间隙
          filterTop = top + 20
          filterHeight = top + 40
        } else {
        }
        this.filterFixed = {
          position: 'sticky',
          top: filterTop + 'px',
          'z-index': 1,
          overflowY: 'auto',
          height: `calc(100vh - ${filterHeight}px)`
        }
      } else {
        this.filterFixed = {}
      }
    },
    listScrollToTop() {
      // 页面中客户端接口请求列表数据后，滚动到商品顶部，即在浮动的导航栏下面
      const headerTranslate = this.$refs.main ? this.$refs.main.headerTranslate : 0
      const h = document.querySelector('.sticky-header') ? document.querySelector('.sticky-header').getBoundingClientRect().height : 0
      const headerH = h - headerTranslate

      const scrollTop = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
      const listRightTop = this.$refs.listRight && this.$refs.listRight.getBoundingClientRect().top
      // 需要让列表滚顶到顶部，即页面滚动的scrollTop + 列表顶部距屏幕的距离 - 网站头部的高度
      const st = scrollTop + listRightTop - headerH
      window.scrollTo({
        top: st,
        behavior: 'instant'
      })
    },
    initListScroll(init) {
      this.$nextTick(() => {
        if (init && !this.hisSeparateScroll) {
          // 初始化进来的时候，判断是否需要滚动到列表页顶部，不是就保持上一步的操作
          if (this.keepScroll) {
            window.scrollTo({
              top: this.keepScroll,
              behavior: 'instant'
            })
          }
        } else if (this.hisSeparateScroll) {
          // 根据上一步的用户行为，判断列表页商品模块是否要滚动到顶，即浮动的导航栏下面
          this.listScrollToTop()
        }
        document.querySelector('#cat-left-scroll') && document.querySelector('#cat-left-scroll').scrollTo(0, this.filterScrollTop)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.loading-box {
  position: relative;
}
.list-box {
  --max-height: 240px;
  .atelier-banner {
    position: relative;
    justify-content: center;
    font-size: 0;
    background: url('~assets/images/goodsList/img-bg.png') no-repeat center center/ 74px 80px, #f9f9f9;
    max-height: var(--max-height);
    img {
      max-width: 100%;
      width: 100%;
    }
  }
  .main-content {
    max-width: 1843px;
    margin: 0 auto;
    width: 100%;
    margin-top: 10px;
    box-sizing: border-box;
    .goods_show_container {
      width: 100%;
      margin-top: 20px;
      display: grid;
      grid-template-columns: 290px calc(100% - 310px);
      column-gap: 20px;
      .cat-left {
        max-width: 290px;
        min-width: 200px;
        width: 100%;
        transition: all 0.5s ease;
        #cat-left-scroll {
          //width: calc(100% + 30px)加上30px 是产品想把左侧main-content的margin-left： 30px也纳入左侧filter的范围。所以需要加上 30px的距离。先margin-left: -30px;再padding-left: 30px;
          width: calc(100% + 30px);
          padding-right: 20px;
          box-sizing: border-box;
          position: sticky;
          top: 180px;
          z-index: 1;
          overflow-y: auto;
          height: calc(100vh - 200px);
          margin-left: -30px;
          padding-left: 30px;
          &::-webkit-scrollbar-track-piece {
            background: #fff;
          }

          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          &::-webkit-scrollbar-thumb {
            background: #e0e0e0;
            border-radius: 3px;
          }
        }
        @media screen and (max-width: 1450px) {
          #cat-left-scroll {
            padding-right: 10px;
          }
        }
        /deep/ .sb-title {
          padding: unset;
          line-height: 32px;
          a {
            line-height: 32px;
          }
        }
        /deep/ .filter_attributes_div {
          padding: unset;
          height: 20px;
        }
      }
      .cat-right {
        width: 100%;
        &.cat-content {
          margin: auto;
        }
        .cat-right-top-filter-box {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .filter-box-right {
            // height: 32px;
            margin-bottom: 20px;
            display: flex;
            // justify-content: space-between;
            flex-wrap: wrap;
            & > :not(:last-child) {
              margin-right: 20px;
            }
            #sort_by,
            #sample_search,
            #view_switch {
              padding: 0;
            }
            .special-offer {
              line-height: 35px;
              padding: 0 5px;
              background: @btn-light-hover-color;
            }
            @media screen and (max-width: 1168px) {
              & {
                margin-bottom: 0;
                > div {
                  margin-bottom: 20px;
                }
              }
            }
          }
          /deep/ .cat-title {
            margin-bottom: 10px;
          }
          &.hide {
            display: none;
          }
        }
        .sample-note {
          border: 1px solid #b8d4e2;
          background-color: #ebf6fb;
          padding: 8px;
          margin-bottom: 20px;
          /deep/ a {
            color: @theme-color!important;
          }
          .sample-note-x {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-left: 10px;
            background: url('~assets/images/x.png') no-repeat;
            background-size: contain;
            cursor: pointer;
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
        /deep/ .cat-empty-prod-list .most-popular {
          max-width: 100%;
        }
      }
      &.display-flex {
        display: flex;
      }
      &.wgd {
        .cat-left {
          /deep/ .filter-banner {
            max-width: 290px;
            width: 100%;
          }
          /deep/ .popular-filter-banner {
            max-width: 290px;
          }
          /deep/ .sb-title {
            padding: 0 !important;
            line-height: 32px;
            a {
              line-height: 32px;
            }
          }
          /deep/ .filter_attributes_div {
            padding: unset;
            height: 20px;
          }
          /deep/ .list-filters-box {
            margin-bottom: 20px;
            .border-line {
              border: none;
              box-shadow: 0 1px 0 #eee;
            }
          }
          &.not-collection {
            /deep/ .filter-body .more {
              display: none;
            }
          }
        }
      }
    }
    .retake_quiz {
      text-align: center;
      border: 1px solid var(--color-999999);
      min-width: 150px;
      height: 43px;
      line-height: 43px;
      margin: auto;
      text-transform: uppercase;
      text-decoration: none;
      color: var(--color-666666);
      font-size: 14px;
      font-family: @font-family-600, sans-serif;
      display: block;
      padding: 0;
      cursor: pointer;
      padding: 0 10px;
      img {
        vertical-align: sub;
        margin-right: 10px;
      }
    }
    .empty-style-quiz {
      .style-quiz-empty-txt {
        text-align: center;
        font-size: 24px;
        margin-bottom: 30px;
        margin-top: 50px;
      }
      .retake_quiz {
        min-width: 210px;
        height: 50px;
        line-height: 50px;
        color: @theme;
        border: 1px solid #ccc;
        margin-bottom: 60px;
      }
    }
  }
  @media screen and (min-width: 1940px) {
    .main-content {
      max-width: 1860px;
      .goods_show_container {
        column-gap: 40px;
        grid-template-columns: 290px calc(100% - 330px);
      }
    }
  }
  @media screen and (max-width: 1860px) {
    /deep/ .main-content {
      width: calc(100% - 60px);
      margin: 0 30px;
    }
  }
  @media screen and (max-width: 1600px) {
    .main-content {
      .goods_show_container {
        grid-template-columns: 230px calc(100% - 250px);
      }
      /deep/ .filter-svg-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 55px) !important;
        gap: 10px 10px;
      }
    }
  }
  @media screen and (max-width: 1440px) {
    .main-content {
      .goods_show_container {
        grid-template-columns: 190px calc(100% - 210px);
      }
      /deep/ .filter-svg-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 44px) !important;
        gap: 10px 10px;
      }
    }
  }
  @media screen and (max-width: 3840px) {
    --max-height: 400px;
  }
  @media screen and (max-width: 2560px) {
    --max-height: 320px;
  }
  @media screen and (max-width: 1920px) {
    --max-height: 240px;
  }
  @media screen and (max-width: 1600px) {
    --max-height: 190px;
  }
}
</style>
