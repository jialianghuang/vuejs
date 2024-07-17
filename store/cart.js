export const state = () => ({
  popPageShow: '',
  selectedParty: 0,
  parties: [],
  shippingFeeLayerShow: false,
  awardInfo: {},
  checkoutGoodsList: [], // shop bag列表数据
  saveForLaterGoodsList: [], // save for later 列表数据
  summaryInfo: {},
  cartWarningDec: [],
  loadingFlag: false,
  invalidCheckoutGoodsList: [], // shop bag 失效商品id
  validCheckoutGoodsList: [], // shop bag 失效商品id
  redeemedBagGoodsList: [], // 换购商品
  redeemedStatus: {}, // 换购状态
  invalidCheckoutGoodsRecIds: [], // shop bag 失效商品id
  freeGiftDialogShow: false,
  giftActivityInfo: {}, // 购物车页面的free gift 活动信息
  hasGiftActivity: false, // 是否可参与freegift活动
  cartErrorMsg: '', // freeGift的报错文案，弹窗显示
  redeemedBagGoodsIds: [], // 已加购的换购商品goodsid 集合
  cartHasKlarna: false, // 通过接口获取的购物车商品是否支持 klarna 方式
  bonusDetail: [], // 折扣明细
  view_mode: 'petite' // 大小码，默认小码
})

export const mutations = {
  setSelectedParty(state, selectedParty) {
    state.selectedParty = selectedParty
  },
  setParties(state, parties) {
    state.parties = parties
  },
  setShippingFeeLayerShow(state, shippingFeeLayerShow) {
    state.shippingFeeLayerShow = shippingFeeLayerShow
  },
  setAwardInfo(state, awardInfo) {
    state.awardInfo = awardInfo
  },
  setCheckoutGoodsList(state, checkoutGoodsList) {
    state.checkoutGoodsList = checkoutGoodsList
  },
  setSaveForLaterGoodsList(state, saveForLaterGoodsList) {
    state.saveForLaterGoodsList = saveForLaterGoodsList
  },
  setSummaryInfo(state, summaryInfo) {
    state.summaryInfo = summaryInfo
    state.cartHasKlarna = summaryInfo.hasKlarna
  },
  setCartWarningDec(state, cartWarningDec) {
    state.cartWarningDec = cartWarningDec
  },
  setLoadingFlag(state, val) {
    state.loadingFlag = val
  },
  setInvalidCheckoutGoodsList(state, invalidCheckoutGoodsList) {
    state.invalidCheckoutGoodsList = invalidCheckoutGoodsList
  },
  setValidCheckoutGoodsList(state, validCheckoutGoodsList) {
    state.validCheckoutGoodsList = validCheckoutGoodsList
  },
  setRedeemedBagGoodsList(state, redeemedBagGoodsList) {
    state.redeemedBagGoodsList = redeemedBagGoodsList
    const redeemedBagGoodsIds = []
    redeemedBagGoodsList.forEach((item) => {
      redeemedBagGoodsIds.push(item.goodsId)
    })
    state.redeemedBagGoodsIds = redeemedBagGoodsIds
  },
  setRedeemedStatus(state, redeemedStatus) {
    state.redeemedStatus = redeemedStatus
  },
  setInvalidCheckoutGoodsRecIds(state, invalidCheckoutGoodsRecIds) {
    state.invalidCheckoutGoodsRecIds = invalidCheckoutGoodsRecIds
  },
  setFreeGiftDialogShow(state, freeGiftDialogShow) {
    state.freeGiftDialogShow = freeGiftDialogShow
  },
  setGiftActivityInfo(state, giftActivityInfo) {
    const currentGiftActivityInfo = state.giftActivityInfo ? JSON.parse(JSON.stringify(state.giftActivityInfo)) : {}
    state.giftActivityInfo = {
      ...currentGiftActivityInfo,
      ...giftActivityInfo
    }
  },
  setUpdataGiftActivityInfo(state, updataGiftActivityInfo = {}) {
    // 接口返回的 giftActivity 前端自己map进giftActivityInfo去
    const currentGiftActivity = state.giftActivityInfo.giftActivity ? JSON.parse(JSON.stringify(state.giftActivityInfo.giftActivity)) : []
    const tempGiftActivity = []
    const giftActivity = updataGiftActivityInfo.giftActivity || []
    giftActivity.forEach((item) => {
      const activityId = item.activityId
      currentGiftActivity.forEach((actItem) => {
        if (actItem && actItem.activityId === activityId) {
          tempGiftActivity.push({
            ...actItem,
            ...item
          })
        }
      })
    })
    state.giftActivityInfo.giftActivity = tempGiftActivity
    state.giftActivityInfo.selectedGiftGoodsList = updataGiftActivityInfo.selectedGiftGoodsList
    state.giftActivityInfo.selectedNumber = updataGiftActivityInfo.selectedNumber
    state.giftActivityInfo.giftNumber = updataGiftActivityInfo.giftNumber
  },
  setHasGiftActivity(state, hasGiftActivity) {
    state.hasGiftActivity = hasGiftActivity
  },
  setCartErrorMsg(state, cartErrorMsg) {
    state.cartErrorMsg = cartErrorMsg
  },
  setBonusDetail(state, bonusDetail) {
    state.bonusDetail = bonusDetail
  },
  setViewMode(state, mode = 'petite') {
    state.view_mode = mode
  }
}

export const getters = {}
