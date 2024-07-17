export const state = () => ({
  isCanLoading: true,
  apiFilters: {},
  apiCatName: '',
  apiDressType: '',
  apiMkt: '',
  // 左侧 filter 的筛选内容
  filters: {},
  // 左侧filter的展开
  filtersOpen: [],
  // 左侧filter showMore 展开
  filtersShowLess: [],
  // popular Filter
  popularFilters: [],
  loadingFlag: true,
  showQuickShopDialog: false, // 是否显示qucik shop弹框
  imageInfo: {},
  styleInfo: {},
  makeTimeInfo: {},
  stockInfo: {},
  stickerInfo: {},
  retireInfo: {},
  flashSaleInfo: {},
  // pageConfig: {},
  isPlusSize: false,
  prodList: [],
  pageInfo: {},
  skeletonShow: false,
  seoCatName: '',
  currentInStock: false
})

export const mutations = {
  setFilters(state, filters) {
    state.filters = filters
  },
  setFiltersOpen(state, filtersOpen) {
    state.filtersOpen = filtersOpen
  },
  setLoadingFlag(state, val) {
    state.loadingFlag = val
  },
  setQuickShopDialog(state, showQuickShopDialog) {
    state.showQuickShopDialog = showQuickShopDialog
  },
  setIsCanLoading(state, val) {
    state.isCanLoading = val
  },
  setFiltersShowLess(state, filtersShowLess) {
    state.filtersShowLess = filtersShowLess
  },
  setImageInfo(state, imageInfo) {
    state.imageInfo = imageInfo
  },
  setStyleInfo(state, styleInfo) {
    state.styleInfo = styleInfo
  },
  setMakeTimeInfo(state, makeTimeInfo) {
    state.makeTimeInfo = makeTimeInfo
  },
  setStockInfo(state, stockInfo) {
    state.stockInfo = stockInfo
  },
  setRetireInfo(state, retireInfo) {
    state.retireInfo = retireInfo
  },
  setStickerInfo(state, stickerInfo) {
    state.stickerInfo = stickerInfo
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
  setIsPlusSize(state, isPlusSize) {
    state.isPlusSize = isPlusSize
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
  }
}
