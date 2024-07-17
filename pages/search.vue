<template>
  <div :class="['list-box', $route.name]">
    <main-app ref="main" :navigation="navigation" :prodList="prodList">
      <div class="main-content">
        <div class="loading-box">
          <div :class="['goods_show_container', { 'empty-container': emptyInfo.empty }]">
            <div ref="catLeft" v-if="!emptyInfo.empty" class="cat-left">
              <div id="cat-left-scroll" :style="filterFixed">
                <div id="listFiltersTop"></div>
                <list-filters v-if="filters && Object.keys(filters).length"></list-filters>
                <filter-banner :filterBanner="filterBanner"></filter-banner>
              </div>
            </div>
            <div ref="listRight" :class="{ 'nosearch-cat-right': emptyInfo.empty }" class="cat-right">
              <div class="cat-right-top-filter-box">
                <cat-title
                  :seoCatName="seoCatName"
                  :total="pageInfo && pageInfo.totalCount"
                  v-if="!emptyInfo.empty || ['sample', 'clearance', 'outlet'].includes(searchDressType)"
                  :searchDressType="searchDressType"
                ></cat-title>
                <div class="filter-box-right">
                  <template v-if="['sample', 'clearance', 'outlet'].includes(apiDressType)">
                    <sample-search
                      @sampleSearchChange="sampleSearchChange"
                      :searchQ="searchQ"
                      :isFromSearch="true"
                      :searchDressType="searchDressType"
                    ></sample-search>
                    <current-in-stock v-if="apiDressType == 'sample'" @currentInStockChange="currentInStockChange"></current-in-stock>
                  </template>
                  <template v-else>
                    <sort-by @sortByChange="sortByChange" :sortTypes="sortTypes" v-if="!emptyInfo.empty"></sort-by>
                  </template>
                  <view-switch v-if="!emptyInfo.empty || ['sample', 'clearance', 'outlet'].includes(searchDressType)"></view-switch>
                </div>
              </div>
              <skeleton-list :viewSwitch="viewSwitch" v-if="loadingFlag"></skeleton-list>
              <search-empty-list v-if="emptyInfo.empty" :searchQ="searchQ" :noSearchGooods="emptyInfo"></search-empty-list>
              <empty-product-list v-else-if="emptyInfo.filterEmpty" :emptyInfo="emptyInfo" :markStr="'list'"></empty-product-list>
              <template v-else>
                <search-product-list
                  :page="pageInfo.page * 1"
                  :recommendProdList="recommendProdList"
                  :recommendTitle="recommendTitle"
                  :resetDisplay="resetDisplay"
                  @notify-me="notifyMe"
                ></search-product-list>
                <div class="see-all-page">
                  <az-pager
                    :totalPage="pageInfo.totalPage"
                    :page="pageInfo.page * 1"
                    :isLoading="pageLoading"
                    @pageChange="pageChange"
                  ></az-pager>
                </div>
              </template>
            </div>
          </div>
          <az-loading
            v-model="loadingFlag"
            :overlayStyle="{ 'background-color': 'rgba(255, 255, 255, 0.3)', position: 'absolute' }"
            :msgFlag="axiosError"
          ></az-loading>
        </div>
        <NotifyMeDialog v-if="openNotifyMe" :item="goodsItem" :style-info="{}" />
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import filterBanner from '@/components/list/filterBanner'
import catTitle from '@/components/list/catTitle'
import sortBy from '@/components/list/sortBy'
import viewSwitch from '@/components/list/viewSwitch'
import searchEmptyList from '@/components/list/searchEmpty'
import searchProductList from '@/components/list/searchProductList'
import azPager from '@/components/az-ui/Pager/AzPager'
import backToTop from '@/components/common/BackToTop'
import sampleSearch from '@/components/list/sampleSearch'
import currentInStock from '@/components/list/currentInStock'
import AzLoading from '@/components/az-ui/Loading/AzLoading'
import SkeletonList from '@/components/list/skeleton/SkeletonList'
import { pathToFilters, getUrlQueryNoPage } from '@/assets/js/utils.js'
import { getCookieByString } from '@/assets/js/pointUtil.js'
import filtersMixins from '@/assets/js/filters'
import colorHex from '@/assets/js/colorHex'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import EmptyProductList from '@/components/list/EmptyProductList'
import ListFilters from '@/components/list/ListFilters'

const sizeIsAllPlusSize = (sizes = []) => {
  if (Object.keys(sizes).length > 0) {
    return sizes.every((item) => ['1x', '2x', '3x', '1X', '2X', '3X'].includes(item))
  }
  return false
}

export default {
  name: 'Search',
  components: {
    mainApp,
    filterBanner,
    catTitle,
    sortBy,
    viewSwitch,
    searchEmptyList,
    searchProductList,
    azPager,
    backToTop,
    sampleSearch,
    currentInStock,
    AzLoading,
    SkeletonList,
    NotifyMeDialog,
    ListFilters,
    EmptyProductList
  },
  mixins: [filtersMixins, colorHex],
  data() {
    return {
      recommendTitle: '',
      recommendProdList: [],
      pageLoading: false,
      colorFilterPos: 'header',
      showRoomNumFlag: false,
      biIdMap: {},
      goodsItem: {},
      filterFixed: {},
      axiosError: false
    }
  },
  computed: {
    ...mapState({
      viewSwitch: (state) => state.list.viewSwitch,
      prodList: (state) => state.list.prodList,
      pageInfo: (state) => state.list.pageInfo,
      apiDressType: (state) => state.list.apiDressType
    }),
    ...mapState('list', ['loadingFlag', 'seoCatName', 'keepScroll', 'filterScrollTop', 'hisSeparateScroll', 'filters'])
  },
  watch: {
    '$route.query': {
      handler(val, oldVal) {
        if (this.$store.state.list.isCanLoading) {
          this.initListScroll(true)
          this.getSearchProdList()
        }
      },
      deep: true
    }
  },
  async asyncData(context) {
    try {
      const routeQuery = context.route.query
      context.store.commit('setIsBridal', routeQuery.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      let firstQuery = {}
      let emptyInfo = {}
      let filterBannerTemp = []
      let resetDisplay = false
      let tempSodView = null
      // if (requestUrl != '/list') {
      firstQuery = pathToFilters(commonAsyncData.requestUrl)
      if (context.route.path == '/collection/all') routeQuery.q = 'azazie'
      if (firstQuery.query) {
        firstQuery.query.current_in_stock && context.store.commit('list/setCurrentInStock', firstQuery.query.current_in_stock)
        firstQuery.query.dress_type && context.store.commit('list/setApiDressType', firstQuery.query.dress_type)
        context.store.commit('list/setIsOutlet', firstQuery.query.is_outlet || 0)
        context.store.commit('list/setSearchInfo', {
          q: (firstQuery.query.q || '').replace(/\+/g, '%20'),
          dress_type: firstQuery.query.dress_type
        })
        // 大小图模式
        const viewSwitch =
          firstQuery.query.view_switch ||
          (context.req && context.req.headers && getCookieByString('view_switch', context.req.headers.cookie))
        context.store.commit('list/setViewSwitch', viewSwitch || 'larger')
      }
      context.store.commit('list/setApiFilters', firstQuery.query)
      // 设置价格区间
      context.store.commit('list/setPriceRange', firstQuery.query.price || '')
      const params = {
        dress_type: context.store.state.list.apiDressType,
        page: firstQuery.query.page,
        in_stock: context.store.state.list.currentInStock,
        ...routeQuery,
        sodGalleryVersion: (context.store.state.versionObj.sodGalleryVersion || 'a').toLowerCase()
      }
      if (params.category == 'dresses' && params.size) {
        const sizes = params.size.split(',')
        if (sizeIsAllPlusSize(sizes)) {
          params.view_mode = 'plus'
        }
      }
      const res = await context.$axios.$post(`/1.0/search`, {
        ...params
      })
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      }
      if (res.code == 0) {
        if (res.data.redirect) {
          // 部分搜索结果直接重定向跳转
          const resQuery = 'from=search'
          if (!res.data.redirectUrl.includes(resQuery)) {
            // 重定向没有标记的加上from=search标记，方便后续打点
            res.data.redirectUrl += res.data.redirectUrl && res.data.redirectUrl.includes('?') ? '&' + resQuery : '?' + resQuery
          }
          // 如果url参数存在fp，传到重定向路径
          if (routeQuery.fp) {
            const resQuery = 'fp=' + routeQuery.fp
            res.data.redirectUrl += res.data.redirectUrl && res.data.redirectUrl.includes('?') ? '&' + resQuery : '?' + resQuery
          }
          // 如果url参数存在sourceTag，传到重定向路径
          if (routeQuery.sourceTag) {
            const resQuery = 'sourceTag=' + routeQuery.sourceTag
            if (!res.data.redirectUrl.includes('/all/')) {
              res.data.redirectUrl += res.data.redirectUrl && res.data.redirectUrl.includes('?') ? '&' + resQuery : '?' + resQuery
            }
          }
          // 如果是通过搜索浮窗点击go过来的，且接口给了match_type，要拼接上传到重定向路径，方便打点
          if (
            routeQuery.from_type &&
            routeQuery.from_type.includes('search_go') &&
            getUrlQueryNoPage(res.data.redirectUrl) &&
            getUrlQueryNoPage(res.data.redirectUrl).match_type
          ) {
            const resQuery = 'from_type=search_go_' + getUrlQueryNoPage(res.data.redirectUrl).match_type
            res.data.redirectUrl += res.data.redirectUrl && res.data.redirectUrl.includes('?') ? '&' + resQuery : '?' + resQuery
          } else if (routeQuery.from_type && routeQuery.from_type.includes('search_go')) {
            const resQuery = 'from_type=' + routeQuery.from_type
            res.data.redirectUrl += res.data.redirectUrl && res.data.redirectUrl.includes('?') ? '&' + resQuery : '?' + resQuery
          }
          context.redirect(302, encodeURI(res.data.redirectUrl))
        }
        if (firstQuery.query && firstQuery.query.os) {
          context.store.commit('list/setOnSale', true)
        }
        let productList = res.data.prodList || []
        if (res.data.empty) {
          // 筛选无结果
          emptyInfo = {
            ...res.data
          }
          productList = res.data.suggestProdList || []
        } else if (productList.length < 1) {
          // 搜索无结果
          const removeAllFilterUrl = context.route.path + '?q=' + routeQuery.q
          emptyInfo = {
            ...res.data,
            filterEmpty: true,
            noResultTips1: 'page_list_no_result_tips1',
            noResultTips2: 'page_list_no_result_tips2',
            removeAllFilterUrl
          }
        }
        if (res.data.filterBanner && res.data.filterBanner.length > 3) {
          // 截取前三个
          filterBannerTemp = res.data.filterBanner.slice(0, 3)
        } else {
          filterBannerTemp = res.data.filterBanner
        }
        res.data.filters && context.store.commit('list/setFilters', res.data.filters)
        context.store.commit('list/setPageInfo', res.data.pageInfo || {})
        // comments: 16080 需要知道商品的位置，不用列表渲染index是因为大于第一页需要加上第一页的数量
        let addIndex = 0
        if (firstQuery.query.page) {
          addIndex += (+firstQuery.query.page - 1) * 60
        }
        productList.forEach((item, index) => (item.indexNo = index + 1 + addIndex))
        context.store.commit('list/setProdList', productList)
        context.store.commit('list/setSeoCatName', res.data.seoCatName)
        const SOD_VIEW_NEW_COOKIE = context.req && context.req.headers && getCookieByString('SOD_VIEW_NEW', context.req.headers.cookie)
        tempSodView = firstQuery.viewMode ? firstQuery.viewMode[0] : SOD_VIEW_NEW_COOKIE || 'petite'
        productList.forEach((item) => {
          if (tempSodView == 'petite_plus' || (item.specialPlus && [2, 8].includes(res.data.pageConfig.catId))) {
            resetDisplay = true
          }
        })
      }

      context.store.commit('list/setIsCanLoading', false)
      context.store.commit('list/setLoadingFlag', false)
      context.store.commit('setJsKey', 'search')
      return {
        ...commonAsyncData,
        filterBanner: filterBannerTemp, // 导航栏图片
        emptyInfo,
        recommendProdList: res.data.recommendProdList || [],
        recommendTitle: res.data.recommendTitle,
        sortTypes: res.data.sortTypes,
        searchQ: decodeURIComponent((firstQuery.query.q || '').replace(/\+/g, '%20')),
        searchDressType: firstQuery.query.dress_type,
        dataLayerInfo: res.data.dataLayerInfo,
        resetDisplay
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
    this.getColorHexAjax()
    if (process.client) {
      this.initListScroll(true)
      if (this.prodList && this.prodList.length && !this.emptyInfo.empty) {
        const gaParams = this.getGAItemListParams(this.prodList, null, 'view', 'search')
        this.setGA4DataLayer(gaParams)
      }
      if (this.recommendProdList && this.recommendProdList.length && !this.emptyInfo.empty) {
        const gaParams = this.getGAItemListParams(this.recommendProdList, null, 'view', 'youLookFor')
        this.setGA4DataLayer(gaParams)
      }
    }
  },
  mounted() {
    this.initBiIdArrNoResult()
    this.initBiIdArr()
    this.addPoint()
    this.trackSearch({ name: this.searchQ, style_ids: this.prodList })
    this.$nextTick(() => {
      this.handleScroll()
    })
    window.addEventListener('scroll', this.handleScroll)
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
    this.$cookie.removeCookie('fromSource')
    // todo: 搜索列表页订单追踪
    this.setOrderSourceFlag('search_result', true)

    // 一进来先设置cat-left-scroll 的样式
    this.filterScroll()
    window.addEventListener('scroll', this.filterScroll, false)
  },
  methods: {
    initBiIdArr() {
      // 处理曝光打点
      const biIdMap = this.biIdMap
      if (this.prodList && this.prodList.length) {
        this.prodList.forEach((item, index) => {
          const msg = {
            goodsId: item.goodsId,
            cat_name: item.catName,
            dress_type: item.dressType,
            cat_id: item.catId,
            from_type: this.$route.query.from_type
          }
          const id = '#resultlistpage_product' + (index + 1)
          const bp = { ec: 'search', el: 'resultlistpage', ea: 'view', msg }
          biIdMap[id] = {
            id,
            biArr: [{ ...bp }]
          }
        })
      }
    },
    initBiIdArrNoResult() {
      const biIdMap = this.biIdMap
      if (this.emptyInfo && this.emptyInfo.suggestProdList && this.emptyInfo.suggestProdList.length) {
        const id = '#you-look-for'
        const biP = { id, biArr: [] }
        this.emptyInfo.suggestProdList.forEach((item, index) => {
          if (index >= 4) return // 不加载非首屏
          const bp = { ec: 'search', el: 'noresultslistpage', ea: 'view', msg: { name: item.shownGoodsName } }
          biP.biArr.push(bp)
          // biP.biArr.push({ ...bp, el: 'noresultslistpage_' + item.shownGoodsName })
        })
        biIdMap[id] = biP
      }
    },
    handleScroll() {
      if (!Object.keys(this.biIdMap).length) return
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let pageHeight
      if (window.innerHeight) pageHeight = window.innerHeight
      else if (document.body && document.body.clientHeight) pageHeight = document.body.clientHeight
      else if (document.documentElement && document.documentElement.clientHeight) pageHeight = document.documentElement.clientHeight
      const biArr = []
      for (const k in this.biIdMap) {
        const el = document.querySelector(this.biIdMap[k].id)
        if (!el) {
          continue
        }
        const clientHeight = el.clientHeight
        const elOffsetTop = el.offsetTop
        // 可视高度/2 打曝光点
        const limitedHeight = clientHeight / 3 > 100 ? 100 : clientHeight / 3
        if (elOffsetTop + limitedHeight <= pageHeight + scrollTop && elOffsetTop + clientHeight - limitedHeight >= scrollTop) {
          const listArr = Array.isArray(this.biIdMap[k].biArr) ? this.biIdMap[k].biArr : [this.biIdMap[k].bi]
          listArr.forEach((item) => {
            const biP = { ...item }
            if (this.biIdMap[k].hasBiMsg) {
              biP.msg = this.biMsg
            }
            if (this.biIdMap[k].hasBiColorMsg) {
              biP.msg = this.biColorMsg
            }
            if (biP.hasOwnProperty('msg') && typeof biP.msg !== 'string') {
              biP.msg = JSON.stringify(biP.msg)
            }
            biArr.push(biP)
          })
          delete this.biIdMap[k]
        }
      }
      if (biArr.length) this.buryPoint(this, 'events', biArr)
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
    async getSearchProdList() {
      try {
        const params = {
          dress_type: this.$store.state.list.apiDressType,
          page: this.pageInfo.page,
          in_stock: this.$store.state.list.currentInStock,
          ...this.$route.query,
          sodGalleryVersion: (this.versionObj.sodGalleryVersion || 'a').toLowerCase(),
          q: this.$route.path == '/collection/all' ? 'azazie' : this.$route.query.q
        }
        if (params.category == 'dresses' && params.size) {
          const sizes = params.size.split(',')
          if (sizeIsAllPlusSize(sizes)) {
            params.view_mode = 'plus'
          }
        }
        const res = await this.$axios.$post(`/1.0/search`, {
          ...params
        })
        if (res.code == 0) {
          if (res.data.redirect) {
            // 部分搜索结果直接重定向跳转
            window.location.href = res.data.redirectUrl
            return
          }
          if (this.$route.query.os) {
            this.$store.commit('list/setOnSale', true)
          }
          let productList = res.data.prodList || []
          this.searchQ = decodeURIComponent(this.$route.query.q)
          this.searchDressType = this.$route.query.dress_type
          // 初始化emptyInfo
          this.emptyInfo = {}
          if (res.data.empty) {
            // 筛选无结果
            this.emptyInfo = {
              ...res.data
            }
            productList = res.data.suggestProdList || []
          } else if (productList.length < 1) {
            // 搜索无结果
            const removeAllFilterUrl = this.$route.path + '?q=' + this.$route.query.q
            this.emptyInfo = {
              ...res.data,
              filterEmpty: true,
              noResultTips1: 'page_list_no_result_tips1',
              noResultTips2: 'page_list_no_result_tips2',
              removeAllFilterUrl
            }
          }
          if (res.data.filterBanner && res.data.filterBanner.length > 3) {
            // 截取前三个
            this.filterBanner = res.data.filterBanner.slice(0, 3)
          } else {
            this.filterBanner = res.data.filterBanner
          }
          this.recommendProdList = res.data.recommendProdList || []
          if (this.recommendProdList && this.recommendProdList.length && !this.emptyInfo.empty) {
            const gaParams = this.getGAItemListParams(this.recommendProdList, null, 'view', 'youLookFor')
            this.setGA4DataLayer(gaParams)
          }
          this.recommendTitle = res.data.recommendTitle
          this.$store.commit('list/setPageInfo', res.data.pageInfo || {})
          // comments: 16080 需要知道商品的位置，不用列表渲染index是因为大于第一页需要加上第一页的数量
          let addIndex = 0
          addIndex += (+this.pageInfo.page - 1) * 60
          productList.forEach((item, index) => (item.indexNo = index + 1 + addIndex))
          this.$store.commit('list/setProdList', productList)
          if (this.prodList && this.prodList.length && !this.emptyInfo.empty) {
            const gaParams = this.getGAItemListParams(this.prodList, null, 'view', 'search')
            this.setGA4DataLayer(gaParams)
          }
          this.initBiIdArr()
          this.$nextTick(() => {
            this.handleScroll()
          })
          if (productList.length > 0) {
            this.$nextTick(() => {
              this.$refs.main.getFavGoodsList()
            })
          }
          res.data.filters && this.$store.commit('list/setFilters', res.data.filters)
          this.$store.commit('list/setApiFilters', this.$route.query)
          this.$store.commit('list/setPriceRange', this.$route.query.price || '')

          this.$store.commit('list/setSeoCatName', res.data.seoCatName)
          this.sortTypes = res.data.sortTypes

          this.initListScroll()
        }
        this.$store.commit('list/setIsCanLoading', false)
        this.$store.commit('list/setLoadingFlag', false)
      } catch (error) {
        console.log(error)
        this.axiosError = true
      }
    },
    // 分页
    pageChange(val) {
      this.changeQuery({
        page: val
      })
    },
    sortByChange(val) {
      this.changeQuery({
        sort_by: val,
        page: 1
      })
    },
    currentInStockChange(val) {
      this.changeQuery({ current_in_stock: val })
    },
    sampleSearchChange(valObj) {
      this.changeQuery(valObj)
    },
    addPoint() {
      let label
      if (this.emptyInfo.empty) {
        label = `Search_Keyword_${this.searchQ}_No_Result`
      } else {
        label = `Search_Keyword_${this.searchQ}_View`
      }
      this.setDataLayer({
        category: 'SearchResultView',
        action: 'View',
        label
      })
    },
    notifyMe(item) {
      this.$set(this, 'goodsItem', item)
      this.$store.commit('setOpenNotifyMe', true)
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
.list-box.search {
  .main-content {
    box-sizing: border-box;
    max-width: 1903px;
    width: 100%;
    clear: both;
    padding: 0;
    margin: auto;
    padding: 10px 30px 0;
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
      }
      .cat-right {
        &.nosearch-cat-right {
          width: 100%;
          .no-search {
            width: 100%;
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
        .cat-right-top-filter-box {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          .filter-box-right {
            height: 32px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            & > :not(:last-child) {
              margin-right: 20px;
            }
            #sort_by,
            #sample_search,
            #view_switch {
              padding: 0;
            }
          }
          /deep/ #cat_title {
            max-width: calc(100% - 400px);
            h1 {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      &.empty-container {
        display: flex;
        justify-content: center;
      }
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
}
.prodlist-top-flex-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .prodlist-top-flex-box-child {
    display: flex;
    flex-wrap: wrap;
    margin-right: 15px;
    padding: 10px 0 8px;
    & > div {
      margin-right: 15px;
    }
  }
}
</style>
