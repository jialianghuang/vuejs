export const state = () => ({
  defaultSelectedColor: {
    key: '',
    name: '',
    styleId: 0
  },
  defaultSelectedSashColor: {
    key: '',
    name: '',
    styleId: 0
  },
  selectedColor: {
    key: '',
    name: '',
    styleId: 0
  },
  selectedSashColor: {
    key: '',
    name: '',
    styleId: 0
  },
  selectedSize: {
    key: '',
    name: '',
    styleId: 0
  },
  fromShowroom: '',
  fromWhatAreU: '',
  recommendFlag: '',
  fromDetailsEntry: '',
  fromInstagram: '',
  videoStatusInfo: {
    videoStatus: false, // 图片视频播放状态
    videoIndex: 0 // 当前显示index
  },
  showOrderSwatch: false,
  pannierVideoStatus: false, // pannier 视频播放状态
  popupPannierShow: false, // What is a pannier 弹框显示状态
  popupGarmentBagShow: false, // 防尘袋 弹框显示状态
  popupAddToCartOnlyShow: false, // add to cart only $0.01 弹框显示状态
  popupCustomerPhoto: {
    popupCustomerPhotoShow: false, // customer photo 弹框显示状态
    popupCustomerPhotoIndex: 0 // 当前显示index
  },
  popupAskQuestShow: false, // ask a quest 弹窗显示状态
  popupCustomerPhotoUploadShow: false, // upload a photo 弹框显示状态
  sizeChartLayerShow: false, // size chart 弹窗显示状态
  uploadList: [], // 上传的图片,
  popupAskQuestSuccessShow: false, // ask a quest 成功 弹窗显示状态
  favGoodsList: {}, // 所有收藏列表,
  plusSizeView: false, // 是否选择大码尺寸 缩略图与主图的展示（婚纱伴娘裙选择大码尺寸时展示大码图片）
  currentBlock: '',
  baseInfo: {},
  imageInfo: {},
  styleInfo: {},
  makeTimeInfo: {},
  shippingInfo: {}, // shipped to you交期时间
  stockInfo: {},
  stickerInfo: {},
  retireInfo: {},
  showQuickShopDialog: false, // 是否显示qucik shop弹框
  isPlusSize: 0,
  isNormalStock: false, // 购物车弹框非批量商品支持库存购买 例如：bd 库存
  discountInfoMessage: {},
  colorInfoId: [],
  customStyleId: '',
  indexNo: 0, // 列表页点击的第几个商品（超过1页加上之前页面总商品数) 默认值0表示没有设置
  showSticker: true,
  isCurrentStyleSupportStock: false,
  hideShipIcon: false,
  hasInitStock: false,
  selectedOptions: {}, // 默认选中项,目前只取里面的size. color还是拿baseInfo的数据
  colorFilter: [], // 需要过滤展示的颜色
  hasSample: false,
  // discount: '',
  hasRealStock: false, // 是否有真实库存
  customSizeSelected: false, // quickshop选中了custom size
  customSizeInfo: {},
  comingsoonGoodsId: {} // atelier 指定goodsId的尺码显示comingsoon
})
export const mutations = {
  // setDiscount(state, discount) {
  //   state.discount = discount
  // },
  setPlusSize(state, isPlusSize) {
    state.isPlusSize = isPlusSize
  },
  setVideoStatusInfo(state, videoStatusInfo) {
    state.videoStatusInfo = videoStatusInfo
  },
  setPannierVideoStatus(state, pannierVideoStatus) {
    state.pannierVideoStatus = pannierVideoStatus
  },
  setPopupPannierShow(state, popupPannierShow) {
    state.popupPannierShow = popupPannierShow
  },
  setPopupGarmentBagShow(state, popupGarmentBagShow) {
    state.popupGarmentBagShow = popupGarmentBagShow
  },
  setPopupAddToCartOnlyShow(state, popupAddToCartOnlyShow) {
    state.popupAddToCartOnlyShow = popupAddToCartOnlyShow
  },
  setPopupCustomerPhotoShow(state, popupCustomerPhoto) {
    state.popupCustomerPhoto = popupCustomerPhoto
  },
  setPopupAskQuestShow(state, popupAskQuestShow) {
    state.popupAskQuestShow = popupAskQuestShow
  },
  setPopupCustomerPhotoUploadShow(state, popupCustomerPhotoUploadShow) {
    state.popupCustomerPhotoUploadShow = popupCustomerPhotoUploadShow
  },
  setSizeChartLayerShow(state, sizeChartLayerShow) {
    state.sizeChartLayerShow = sizeChartLayerShow
  },
  setUploadList(state, uploadList) {
    state.uploadList = uploadList
  },
  setDefaultSelectedColor(state, defaultSelectedColor) {
    state.defaultSelectedColor = defaultSelectedColor
  },
  setDefaultSelectedSashColor(state, defaultSelectedSashColor) {
    state.defaultSelectedSashColor = defaultSelectedSashColor
  },
  setSelectedColor(state, selectedColor) {
    state.selectedColor = selectedColor
  },
  setSelectedSashColor(state, selectedSashColor) {
    state.selectedSashColor = selectedSashColor
  },
  setSelectedSize(state, selectedSize) {
    state.selectedSize = selectedSize
  },
  setFromShowroom(state, fromShowroom) {
    state.fromShowroom = fromShowroom
  },
  setFromWhatAreU(state, fromWhatAreU) {
    state.fromWhatAreU = fromWhatAreU
  },
  setRecommendFlag(state, recommendFlag) {
    state.recommendFlag = recommendFlag
  },
  setFromDetailsEntry(state, fromDetailsEntry) {
    state.fromDetailsEntry = fromDetailsEntry
  },
  setFromInstagram(state, fromInstagram) {
    state.fromInstagram = fromInstagram
  },
  setShowOrderSwatch(state, showOrderSwatch) {
    state.showOrderSwatch = showOrderSwatch
  },
  setPopupAskQuestSuccessShow(state, popupAskQuestSuccessShow) {
    state.popupAskQuestSuccessShow = popupAskQuestSuccessShow
  },
  setFavGoodsList(state, favGoodsList) {
    state.favGoodsList = favGoodsList
  },
  setCurrentBlock(state, currentBlock) {
    state.currentBlock = currentBlock
  },
  setMakeTimeInfo(state, makeTimeInfo) {
    state.makeTimeInfo = makeTimeInfo
  },
  setShippingInfo(state, shippingInfo) {
    state.shippingInfo = shippingInfo
  },
  setBaseInfo(state, baseInfo) {
    state.baseInfo = baseInfo
    state.hasRealStock = !!baseInfo.hasRealStock
  },
  setPlusSizeView(state, plusSizeView) {
    state.plusSizeView = plusSizeView
  },
  setQuickShopDialog(state, showQuickShopDialog) {
    state.showQuickShopDialog = showQuickShopDialog
  },
  setImageInfo(state, imageInfo) {
    state.imageInfo = imageInfo
  },
  setStyleInfo(state, styleInfo) {
    state.styleInfo = styleInfo
  },
  setStockInfo(state, stockInfo) {
    state.stockInfo = stockInfo
  },
  setStickerInfo(state, stickerInfo) {
    state.stickerInfo = stickerInfo
  },
  setRetireInfo(state, retireInfo) {
    state.retireInfo = retireInfo
  },
  setIsNormalStock(state, isNormalStock) {
    state.isNormalStock = isNormalStock
  },
  setDiscountInfo(state, info = {}) {
    state.discountInfoMessage = info
    // 首次进入详情页展示
    const { size = {}, sizeMap = {} } = info
    const { styleId } = state.selectedSize
    if (size.hasColorId == 1) {
      if (state.customStyleId) {
        state.colorInfoId = sizeMap[state.customStyleId] || []
        return
      }
      if (styleId != 0) {
        state.colorInfoId = sizeMap[styleId] || []
        return
      }
    }
    state.colorInfoId = info.colorId || []
  },
  setColorInfoId(state, ids) {
    state.colorInfoId = ids
  },
  setCustomStyleId(state, id) {
    state.customStyleId = id
  },
  setIndexNo(state, no) {
    state.indexNo = no || 0
  },
  setShowSticker(state, bol) {
    state.showSticker = bol
  },
  setIsCurrentStyleSupportStock(state, bol) {
    state.isCurrentStyleSupportStock = bol
  },
  setHideShipIcon(state, bol) {
    state.hideShipIcon = bol
  },
  setHasInitStock(state, bol) {
    state.hasInitStock = bol
  },
  setSelectedOptions(state, selectedOptions) {
    state.selectedOptions = selectedOptions
  },
  setColorFilter(state, colorFilter) {
    state.colorFilter = colorFilter
  },
  setHasSample(state, hasSample) {
    state.hasSample = hasSample
  },
  setCustomSizeSelected(state, customSizeSelected) {
    state.customSizeSelected = customSizeSelected
  },
  setCustomSizeInfo(state, info) {
    state.customSizeInfo = info
  },
  setComingSoonGoodsId(state, idObj) {
    state.comingsoonGoodsId = idObj
  }
}
export const getters = {
  getVideoStatusInfo(state) {
    return state.videoStatusInfo
  },
  getPannierVideoStatus(state) {
    return state.pannierVideoStatus
  },
  getPopupPannierShow(state) {
    return state.popupPannierShow
  },
  getPopupAddToCartOnlyShow(state) {
    return state.popupAddToCartOnlyShow
  },
  getPopupCustomerPhotoShow(state) {
    return state.popupCustomerPhoto
  },
  getPopupAskQuestShow(state) {
    return state.popupAskQuestShow
  },
  getPopupCustomerPhotoUploadShow(state) {
    return state.popupCustomerPhotoUploadShow
  },
  getSizeChartLayerShow(state) {
    return state.sizeChartLayerShow
  },
  getUploadList(state) {
    return state.uploadList
  },
  getPopupAskQuestSuccessShow(state) {
    return state.popupAskQuestSuccessShow
  },
  getFavGoodsList(state) {
    return state.favGoodsList
  },
  getSelectedColor(state) {
    return state.selectedColor
  },
  getCurrentBlock(state) {
    return state.currentBlock
  },
  getBaseInfo(state) {
    return state.baseInfo
  }
}
