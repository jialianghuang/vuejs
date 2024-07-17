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
  selectRush: null,
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
  showOrderSwatch: false, // swatch 弹框显示
  pannierVideoStatus: false, // pannier 视频播放状态
  popupMaskShow: false, // 口罩 弹框显示状态
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
  isPlusSize: 0,
  makeTimeInfo: {},
  shippingInfo: {}, // shipped to you交期时间
  tryOnPopupShow: false,
  showAddCartDialog: false,
  isCustomSize: false, // 这里给到加购推荐弹框使用
  isCurrentStyleSupportStock: false, // 当前颜色和尺码是否支持库存
  regionIdSelected: '', // 交期，选中的地区id
  regionNameSelected: '', // 交期，选中的地址name
  regionBlockShow: false,
  regionShow: 'select',
  dateStr: '',
  expeditedDaysSateStr: '',
  discountInfoMessage: {},
  colorInfoId: [],
  customStyleId: '',
  hasSample: false, // 是否有样衣商品
  sampleUrl: '', // 对应样衣的跳转地址
  isPopupInstallmentShow: false, // 分期描述弹框
  showRecommendSizePopup: false,
  currentShowImageUrl: '',
  completeTheLookCurScreens: 1, //  completethelook第X屏，方便打点使用
  mostPopularCurScreens: 1, // mostpopular第X屏，方便打点使用
  alsoLikeCurScreens: 1, // Youmayalsolike第X屏，方便打点使用
  recentlyViewCurScreens: 1, // recentlyView第X屏，方便打点使用
  showWordsType: 1, // 详情卖点活动文案类型，1，2，3种文案类型，因为加购后卖点展示文案类型可能会变化，所以将参数存在这里
  completeTheLookPosition: { left: false, right: false }, // complete the look 展示位置,非wgd默认在右边
  sampleInfo: {},
  showSampleEntrance: false,
  showNotifyDialog: false,
  findSimilarData: {}, // 缺货推荐的商品信息
  selectedOptions: {}, // 刚进详情页，根据链接获取的默认选中项,目前只取里面的size. color还是拿baseInfo的数据
  needJointColorSize: true, // url路径是否需要添加color,size
  presaleGoods: false,
  imageInfo: {},
  sodPreSalePicVersion: 'a',
  isFromSodPreSaleList: false, // 是否来自sod预售列表
  hasRealStock: false, // 是否有真实库存
  colorChart: {}, // color chart配图列表
  colorChartShow: false, // 是否展示colorChart配图
  deliveryInit: false, // 交期接口调用成功与否
  customSizeSelected: false, // 详情选中了custom Size
  productVideoList: {}, // 详情页视屏数据
  customSizeInfo: {},
  comingsoonGoodsId: {}, // atelier 指定goodsId的尺码显示comingsoon
  showStockTips: false // 控制clearance 提示库存信息的显示隐藏，因stockInfo是在服务端调用接口获取，切换skc的时候要更新内容，故先隐藏错误的等更新后在显示提示文案
})
export const mutations = {
  setColorChart(state, colorChart) {
    state.colorChart = colorChart
  },
  setColorChartShow(state, colorChartShow) {
    state.colorChartShow = colorChartShow
  },
  setNeedJointColorSize(state, needJointColorSize) {
    state.needJointColorSize = needJointColorSize
  },
  setShowWordsType(state, showWordsType) {
    state.showWordsType = showWordsType
  },
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
  setSelectRush(state, selectRush) {
    state.selectRush = selectRush
  },
  setPopupMaskShow(state, popupMaskShow) {
    state.popupMaskShow = popupMaskShow
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
    if (baseInfo.sodPreSaleGoods) {
      state.presaleGoods = true
    }
    if (!state.selectedColor.key || ![2, 3, 7, 45, 158, 206].includes(state.baseInfo.catId)) return
    const { goodsGallery } = state.imageInfo
    const images = goodsGallery[state.selectedColor.key].images || []
    let imgUrl = images[0].imgUrl
    if (state.plusSizeView) {
      const item = images.find((child) => child.isPlus) || images[0]
      imgUrl = item.imgUrl
    }
    state.baseInfo = {
      ...baseInfo,
      goodsThumb: imgUrl || this.baseInfo.goodsThumb
    }
  },
  setPlusSizeView(state, plusSizeView) {
    state.plusSizeView = plusSizeView
  },
  setShowTryOnPopup(state, tryOnPopupShow) {
    state.tryOnPopupShow = tryOnPopupShow
  },
  setShowAddCartDialog(state, showAddCartDialog) {
    state.showAddCartDialog = showAddCartDialog
  },
  setIsCustomSize(state, isCustomSize) {
    state.isCustomSize = isCustomSize
  },
  setIsCurrentStyleSupportStock(state, isCurrentStyleSupportStock) {
    state.isCurrentStyleSupportStock = isCurrentStyleSupportStock
  },
  setRegionIdSelected(state, regionIdSelected) {
    state.regionIdSelected = regionIdSelected
  },
  setRegionNameSelected(state, regionNameSelected) {
    state.regionNameSelected = regionNameSelected
  },
  setRegionBlockShow(state, regionBlockShow) {
    state.regionBlockShow = regionBlockShow
  },
  setRegionShow(state, regionShow) {
    state.regionShow = regionShow
  },
  setDateStr(state, dateStr) {
    state.dateStr = dateStr
  },
  setExpeditedDaysSateStr(state, expeditedDaysSateStr) {
    state.expeditedDaysSateStr = expeditedDaysSateStr
  },
  setDiscountInfoMessage(state, info = {}) {
    state.discountInfoMessage = info
    // 首次进入详情页展示
    state.colorInfoId = info.colorId || []
  },
  setColorInfoId(state, ids) {
    state.colorInfoId = ids
  },
  setCustomStyleId(state, id) {
    state.customStyleId = id
  },
  setHasSample(state, hasSample) {
    state.hasSample = hasSample
  },
  setSampleUrl(state, sampleUrl) {
    state.sampleUrl = sampleUrl
  },
  setPopupInstallmentShow(state, isPopupInstallmentShow) {
    state.isPopupInstallmentShow = isPopupInstallmentShow
  },
  setCurrentShowImageUrl(state, showImageUrl) {
    state.currentShowImageUrl = showImageUrl || state.baseInfo.goodsThumb
  },
  setShowRecommendSizePopup(state, bol) {
    state.showRecommendSizePopup = bol
  },
  setCompleteTheLookCurScreens(state, completeTheLookCurScreens) {
    state.completeTheLookCurScreens = completeTheLookCurScreens
  },
  setMostPopularCurScreens(state, mostPopularCurScreens) {
    state.mostPopularCurScreens = mostPopularCurScreens
  },
  setAlsoLikeCurScreens(state, alsoLikeCurScreens) {
    state.alsoLikeCurScreens = alsoLikeCurScreens
  },
  setRecentlyViewCurScreens(state, recentlyViewCurScreens) {
    state.recentlyViewCurScreens = recentlyViewCurScreens
  },
  setCompleteTheLookPosition(state, obj) {
    state.completeTheLookPosition = obj
  },
  setSampleInfo(state, info = {}) {
    state.sampleInfo = info
    state.showSampleEntrance = info.hasSample || false
  },
  setShowNotifyDialog(state, bol) {
    state.showNotifyDialog = bol
  },
  setFindSimilarData(state, findSimilarData) {
    state.findSimilarData = findSimilarData
  },
  setSelectedOptions(state, selectedOptions) {
    state.selectedOptions = selectedOptions
  },
  setPresaleGoods(state, bol) {
    state.presaleGoods = bol
  },
  setImageInfo(state, imageInfo) {
    state.imageInfo = imageInfo
  },
  setSodPreSalePicVersion(state, version = 'a') {
    state.sodPreSalePicVersion = version
  },
  setIsFromSodPreSaleList(state, bol = false) {
    state.isFromSodPreSaleList = bol
  },
  setDeliveryInit(state, init = false) {
    state.deliveryInit = init
  },
  setCustomSizeSelected(state, customSizeSelected) {
    state.customSizeSelected = customSizeSelected
  },
  setVideoList(state, obj = {}) {
    state.productVideoList = obj
  },
  setCustomSizeInfo(state, info) {
    state.customSizeInfo = info
  },
  setComingSoonGoodsId(state, idObj) {
    state.comingsoonGoodsId = idObj
  },
  setShowStockTips(state, bol) {
    state.showStockTips = bol
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
