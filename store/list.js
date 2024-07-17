export const state = () => ({
  viewSwitch: '', // 大小图模式
  sodView: null,
  apiViewMode: [],
  isCanLoading: true,
  apiFilters: {},
  apiCatName: '',
  apiDressType: '',
  apiMkt: '',
  apiQuery: {},
  priceRange: '',
  // 左侧 filter 的筛选内容
  filters: {},
  // 左侧filter的展开
  filtersOpen: [],
  // 左侧filter showMore 展开
  filtersShowLess: [],
  // popular Filter
  popularFilters: [],
  loadingFlag: true,
  flashSaleInfo: {},
  // pageConfig: {},
  sortBy: '',
  // 过滤 free rush
  inSpecialOffer: false,
  prodList: [],
  pageInfo: {},
  skeletonShow: false,
  seoCatName: '',
  currentInStock: '',
  seoThemeBanner: {},
  searchInfo: {},
  popupMyCharityShow: false,
  isOutlet: 0,
  shopByStyle: [],
  finalInfo: {}, // finalSale 点击filter跳转的时候做映射处理
  freshDeals: '',
  selectedColorFamily: {},
  familyColorKey: '', // 色圈选中的色系key
  seoFaqList: [],
  keepScroll: 0, // 记录离开页面时的 scroll-positon
  filterScrollTop: 0, // 记录离开页面的时候左侧filter滚动距离
  hisSeparateScroll: false, // 用来记录上一步页面是否分左右两个部分分开滑动，即页面滚动到左侧filter模块顶部的时候
  onSale: {
    fold: false,
    key: 'on_sale',
    name: 'page_saletype_sale_offers',
    number: 0,
    orderBy: 2,
    selected: false,
    url: '',
    value: ''
  },
  showSupportStockSales: false, //  是否显示BD库存筛选按钮
  supportStockSales: 0, // 是否筛选支持库存售卖的非库存商品
  showFastDeliveryDress: false, // 是否展示shipping 24
  fastDeliveryDress: 0, // sod 的shiping in 24 标记，后端说supportStockSales已经被污染，所以sod用fastDeliveryDress这个新字段标记
  filterSize: [],
  showCreateStoreList: false, // 是否展示创建门店列表
  isLandPage: false, // 是否是color family landing page
  showSodNewSmallBox: false,
  emptyInfo: {} // 列表空状态数据
})

export const mutations = {
  // 因为loadingFlag是store数据，原有的emptyInfo是组件内状态，切换filter时asyncData内的设置操作导致状态差存在，导致骨架屏和空数据状态存在交叉显示问题，所以emptyInfo改为store存储
  setEmptyInfo(state, emptyInfo) {
    state.emptyInfo = emptyInfo
  },
  setIsLandPage(state, isLandPage) {
    state.isLandPage = isLandPage
  },
  setShowCreateStoreList(state, showCreateStoreList) {
    state.showCreateStoreList = showCreateStoreList
  },
  setViewSwitch(state, viewSwitch) {
    state.viewSwitch = viewSwitch
  },
  setSodView(state, sodView) {
    state.sodView = sodView
  },
  setApiViewMode(state, apiViewMode) {
    state.apiViewMode = apiViewMode
  },
  setFilters(state, filters) {
    state.filters = filters
  },
  setFiltersOpen(state, filtersOpen) {
    state.filtersOpen = filtersOpen
  },
  setLoadingFlag(state, val) {
    state.loadingFlag = val
  },
  setIsCanLoading(state, val) {
    state.isCanLoading = val
  },
  setFiltersShowLess(state, filtersShowLess) {
    state.filtersShowLess = filtersShowLess
  },
  setFlashSaleInfo(state, flashSaleInfo) {
    state.flashSaleInfo = flashSaleInfo
  },
  setPopularFilters(state, popularFilters) {
    state.popularFilters = popularFilters
  },
  setApiFilters(state, apiFilters) {
    state.apiFilters = apiFilters
  },
  setApiCatName(state, apiCatName) {
    state.apiCatName = apiCatName
  },
  // setPageConfig(state, pageConfig) {
  //   state.pageConfig = pageConfig
  // },
  setSortBy(state, sortBy) {
    state.sortBy = sortBy
  },
  setInSpecialOffer(state, inSpecialOffer) {
    state.inSpecialOffer = inSpecialOffer
  },
  setApiDressType(state, apiDressType) {
    state.apiDressType = apiDressType
  },
  setProdList(state, prodList) {
    state.prodList = prodList
  },
  setPageInfo(state, pageInfo) {
    state.pageInfo = pageInfo
  },
  setApiMkt(state, apiMkt) {
    state.apiMkt = apiMkt
  },
  setSkeletonShow(state, skeletonShow) {
    state.skeletonShow = skeletonShow
  },
  setSeoCatName(state, seoCatName) {
    state.seoCatName = seoCatName
  },
  setCurrentInStock(state, currentInStock) {
    state.currentInStock = currentInStock
  },
  setApiQuery(state, apiQuery) {
    state.apiQuery = apiQuery
  },
  setSearchInfo(state, searchInfo) {
    state.searchInfo = searchInfo
  },
  setPriceRange(state, priceRange) {
    state.priceRange = priceRange
  },
  setSeoThemeBanner(state, seoThemeBanner) {
    state.seoThemeBanner = seoThemeBanner
  },
  setPopupMyCharityShow(state, popupMyCharityShow) {
    state.popupMyCharityShow = popupMyCharityShow
  },
  setIsOutlet(state, isOutlet) {
    state.isOutlet = isOutlet
  },
  setFreshDeals(state, freshDeals = 'no') {
    state.freshDeals = freshDeals
  },
  setShopByStyle(state, data = []) {
    state.shopByStyle = data
  },
  setFinalInfo(state, info) {
    state.finalInfo = info
  },
  setSelectedColorFamily(state, selectedColorFamily) {
    state.selectedColorFamily = selectedColorFamily
  },
  setFamilyColorKey(state, familyColorKey) {
    state.familyColorKey = familyColorKey
  },
  setSeoFaqList(state, seoFaqList) {
    state.seoFaqList = seoFaqList
  },
  setKeepScroll(state, keepScroll) {
    state.keepScroll = keepScroll
  },
  setFilterScrollTop(state, filterScrollTop) {
    state.filterScrollTop = filterScrollTop
  },
  setHisSeparateScroll(state, hisSeparateScroll) {
    state.hisSeparateScroll = hisSeparateScroll
  },
  setOnSale(state, bol) {
    state.onSale.selected = bol
  },
  setShowSupportStockSales(state, showSupportStockSales) {
    state.showSupportStockSales = showSupportStockSales
  },
  setSupportStockSales(state, supportStockSales) {
    state.supportStockSales = supportStockSales
  },
  setShowFastDeliveryDress(state, showFastDeliveryDress) {
    state.showFastDeliveryDress = showFastDeliveryDress
  },
  setFastDeliveryDress(state, fastDeliveryDress) {
    state.fastDeliveryDress = fastDeliveryDress
  },
  setFilterSize(state, size = []) {
    state.filterSize = size
  },
  setShowSodNewSmallBox(state, bol) {
    state.showSodNewSmallBox = bol
  }
}
