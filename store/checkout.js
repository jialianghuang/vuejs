export const state = () => ({
  baseInfoKey: '',
  isPaymentProcessing: false, // review_order页面支付大菊花图
  caPaymentDialogShow: false, // 创建订单加载态
  caPaymentDialogText: '', // 创建订单加载态文案
  payProductList: [],
  fillGoodsBundleList: [], // buy more save more bundle list
  checkoutSummary: {},
  regionList: [],
  addressId: '',
  billingAddressId: '',
  defaultAddressShow: true, // 默认地址是否显示
  shippingAddress: [], // shipping地址列表
  isAddressRulesResult: false, // 地址是否已校验通过
  billingAddress: [], // billing地址列表
  paymentId: '',
  paymentName: '',
  paymentInfoList: [], // 支付方式列表
  shippingMethodId: '',
  shippingMethodList: [], // 运输方式列表
  bankCardInfo: {}, // 卡信息
  orderInfo: {},
  isOrderConfirm: false,
  isConfirmError: false,
  loadingFlag: false,
  eventDate: {},
  couponInfo: {},
  orderGoodsList: [],
  orderInfoGoodsList: {},
  orderInfoList: [],
  isGroup: false,
  allPaid: false, // 是否有未支付订单
  errorTipCode: '', // 当前要展示的错误code
  errorTipText: '',
  errorDialogShow: false, // 接口返回报错弹框
  checkoutError: {
    isEventError: false,
    isShippingAddressError: false,
    isPaymentError: false,
    isBillingAddressError: false,
    isCouponError: false
  },
  paymentInfo: {},
  paymentRulesResult: {
    cardNumber: '',
    expirateDate: '',
    securityCode: '',
    holderName: '',
    installmentsId: ''
  },
  methodInfo: {},
  isCarPayment: false, // 编辑checkout非支付方式的时候，之前选择的是否是卡支付
  emailAddress: '',
  topWarning: [],
  shareGoods: {},
  buyNowData: '',
  buyNowUrl: '',
  buyNowNotice: '',
  checkoutLoginEmail: '',
  checkoutLoginEmailError: '',
  progressId: 1, // 下单进度id，主要用于checkout中内容进度区分显示，a版本总共有12两步，b版本总共123三步，1：shipping 2:review&pay
  popupPayProcessingShow: false, // paypal、afterpay、googlepay、applepay 支付弹框被拦截时，显示支付弹框，点击再次支付
  popupPayProcessingCode: '',
  useAccountBalanceFlag: false, // 是否使用礼品卡余额
  hasCoupons: false, // 券列表是否有券
  showGooglePay: false, // 显示google pay 按钮
  showApplePay: false, // 显示apple pay 按钮
  orderAllList: [], // checkout pageview打点数据
  couponSelectVisible: false, // 可用优惠券弹框显示控制
  bingSeoInfo: {
    revenueValue: '',
    currency: ''
  },
  maxDiscountCouponCode: '',
  couponCodeTipsShow: false,
  bonusDetail: [], // 折扣明细
  selectCouponCode: false,
  categoryError: false,
  categories: [] // 感兴趣的分类
})

export const mutations = {
  setCheckoutBaseInfo(state, baseInfo) {
    state.baseInfoKey = baseInfo.baseInfoKey
    state.payProductList = baseInfo.prodList
    state.checkoutSummary = baseInfo.summary
    if (baseInfo.addressInfo) {
      state.emailAddress = baseInfo.addressInfo.emailAddress && baseInfo.addressInfo.emailAddress.email
      state.shippingAddress = baseInfo.addressInfo.shippingAddress
      state.billingAddress = baseInfo.addressInfo.billingAddress
      if (Object.keys(state.shippingAddress).length) state.addressId = state.shippingAddress[0].addressId // 地址列表的第一项就是默认地址
    }
    if (baseInfo.shippingInfo && baseInfo.shippingInfo.methodInfo) {
      if (baseInfo.addressInfo && baseInfo.addressInfo.shippingAddress && baseInfo.addressInfo.shippingAddress.length) {
        state.shippingMethodId = baseInfo.shippingInfo.methodInfo.selectedId // 用户有地址的时候使用默认shippingMethodId
      }

      state.shippingMethodList = baseInfo.shippingInfo.methodInfo.list
      state.methodInfo = baseInfo.shippingInfo.methodInfo || {}
    }
    state.paymentInfoList = baseInfo.paymentInfo.list
    state.paymentId = baseInfo.paymentInfo.selectedId
    state.paymentInfoList &&
      state.paymentInfoList.length &&
      state.paymentInfoList.forEach((item) => {
        if (item.paymentId == baseInfo.paymentInfo.selectedId) {
          state.paymentName = item.name
        }
      })
    state.paymentInfo = baseInfo.paymentInfo

    if (state.paymentInfo) {
      const tempBankCardInfo = {
        cardNumber: state.paymentInfo.cardCode ? state.paymentInfo.cardNumber || '' : '',
        month: state.paymentInfo.month || '',
        year: state.paymentInfo.year || '',
        expirateDate: state.paymentInfo.expDate || '',
        securityCode: state.paymentInfo.cardCode || '',
        cardName: state.paymentInfo.cardName || ''
      }
      state.bankCardInfo = tempBankCardInfo
    }

    state.orderInfo = baseInfo.orderInfo
    if (baseInfo.orderInfo.onlyGiftCard) state.orderInfo.hasGiftCard = true
    if (baseInfo.orderInfo.hasOwnProperty('onlyGiftCardOrder')) {
      state.orderInfo.onlyGiftCard = baseInfo.orderInfo.onlyGiftCardOrder
    }
    state.eventDate = baseInfo.eventDate || {}
    state.couponInfo = baseInfo.couponInfo || {}
    state.bonusDetail = baseInfo.bonusDetail || []
    if (baseInfo.errors && baseInfo.errors.errorTips && Object.keys(baseInfo.errors.errorTips).length) {
      state.errorTipCode = baseInfo.errors.errorTips.code
      state.errorTipText = baseInfo.errors.errorTips.msg
    }

    if (state.baseInfoKey == 'checkout') {
      if (baseInfo.errors && baseInfo.errors.topErrorTips && Object.keys(baseInfo.errors.topErrorTips).length) {
        state.topWarning = baseInfo.errors.topErrorTips
      }
      // checkout页面，如果是guest用户 且不是色卡重发，没有成单的时候，不能展示之前的地址信息,成单之后（从review order页面进入checkout），只会展示默认地址
      if (state.orderInfo.isGuest && state.orderInfo.orderType !== 'swatches') {
        if (!state.orderInfo.orderSn) {
          if (baseInfo.orderInfo.orderType != 'sample') {
            // 样衣可购买订单不用重置地址信息
            state.shippingAddress = []
            state.billingAddress = []
            state.addressId = ''
            state.shippingMethodId = '' // 游客没有地址时重置shippingMethodId
          }
        } else {
          state.shippingAddress = Object.keys(state.shippingAddress).length ? [state.shippingAddress[0]] : []
        }
      }
    } else if (state.baseInfoKey == 'checkoutSuccess') {
      state.allPaid = baseInfo.allPaid
      state.isGroup = baseInfo.isGroup
      // 有未付款的
      state.orderInfoGoodsList = baseInfo.orderInfoGoodsList || {}
      state.orderInfoList = baseInfo.orderInfoList || []
      // 无未付款的
      state.orderGoodsList = baseInfo.orderGoodsList || []
      // shareInfo
      state.shareGoods = baseInfo.shareGoods || {}
    } else {
      // 容错，这里可以把之前写好的都放进来，以防止数据结构可能有错
    }
  },
  setOrderInfoList(state, orderInfoList) {
    state.orderInfoList = orderInfoList
  },
  setAddressId(state, addressId) {
    state.addressId = addressId
  },
  setBillingAddressId(state, billingAddressId) {
    state.billingAddressId = billingAddressId
  },
  setDefaultAddressShow(state, defaultAddressShow) {
    state.defaultAddressShow = defaultAddressShow
  },
  setAddressInfo(state, addressInfo) {
    if (addressInfo && Object.keys(addressInfo).length) {
      state.shippingAddress = addressInfo.shippingAddress
      state.billingAddress = addressInfo.billingAddress
    }
    // 如果是guest用户 且不是 色卡重发，保存地址之后，收货地址只能展示默认地址
    if (state.orderInfo.isGuest && state.orderInfo.orderType !== 'swatches') {
      if (state.shippingAddress && Object.keys(state.shippingAddress).length) {
        state.shippingAddress = [state.shippingAddress[0]]
      }
    }
    if (state.shippingAddress && Object.keys(state.shippingAddress).length) state.addressId = state.shippingAddress[0].addressId
  },
  setShippingAddress(state, shippingAddress) {
    state.shippingAddress = shippingAddress
  },
  setBillingAddress(state, billingAddress) {
    state.billingAddress = billingAddress
  },
  setShippingInfo(state, shippingInfo) {
    state.shippingMethodId = shippingInfo.methodInfo.selectedId
    state.shippingMethodList = shippingInfo.methodInfo.list
    state.methodInfo = shippingInfo.methodInfo || {}
  },
  setIsAddressRulesResult(state, isAddressRulesResult) {
    state.isAddressRulesResult = isAddressRulesResult
  },
  setPaymentId(state, paymentId) {
    state.paymentId = paymentId
  },
  setPaymentName(state, paymentName) {
    state.paymentName = paymentName
  },
  setShippingMethodId(state, shippingMethodId) {
    state.shippingMethodId = shippingMethodId
  },
  setBankCardInfo(state, bankCardInfo) {
    state.bankCardInfo = bankCardInfo
  },
  setPayProductList(state, payProductList) {
    state.payProductList = payProductList
  },
  setFillGoodsBundleList(state, fillGoodsBundleList) {
    state.fillGoodsBundleList = fillGoodsBundleList
  },
  setCheckoutSummary(state, checkoutSummary) {
    state.checkoutSummary = checkoutSummary
  },
  setIsOrderConfirm(state, isOrderConfirm) {
    state.isOrderConfirm = isOrderConfirm
  },
  setIsConfirmError(state, isConfirmError) {
    state.isConfirmError = isConfirmError
  },
  setLoadingFlag(state, loadingFlag) {
    state.loadingFlag = loadingFlag
  },
  setEventDate(state, eventDate) {
    state.eventDate = eventDate
  },
  setIsPaymentProcessing(state, isPaymentProcessing) {
    state.isPaymentProcessing = isPaymentProcessing
  },
  setCaPaymentDialogShow(state, caPaymentDialogShow) {
    state.caPaymentDialogShow = caPaymentDialogShow
  },
  setCaPaymentDialogText(state, caPaymentDialogText) {
    state.caPaymentDialogText = caPaymentDialogText
  },
  setCouponInfo(state, couponInfo) {
    state.couponInfo = couponInfo
  },
  setHasCoupons(state, hasCoupons) {
    state.hasCoupons = hasCoupons
  },
  setOrderInfo(state, orderInfo) {
    state.orderInfo = orderInfo
    if (orderInfo.onlyGiftCard) state.orderInfo.hasGiftCard = true
    if (orderInfo.hasOwnProperty('onlyGiftCardOrder')) state.orderInfo.onlyGiftCard = orderInfo.onlyGiftCardOrder
  },
  setErrorDialogShow(state, errorDialogShow) {
    state.errorDialogShow = errorDialogShow
  },
  setErrorTipText(state, errorTipText) {
    state.errorTipText = errorTipText
  },
  setErrorTipCode(state, errorTipCode) {
    state.errorTipCode = errorTipCode
  },
  setCheckoutError(state, checkoutError) {
    state.checkoutError = checkoutError
  },
  setpPaymentRulesResult(state, paymentRulesResult) {
    state.paymentRulesResult = paymentRulesResult
  },
  setTopWarning(state, topWarning) {
    state.topWarning = topWarning
  },
  setIsCarPayment(state, isCarPayment) {
    state.isCarPayment = isCarPayment
  },
  setRegionList(state, regionList) {
    state.regionList = regionList
  },
  setBuyNow(state, buyNowData) {
    state.buyNowUrl = `/checkout?buy_now=${buyNowData}${state.isBridal ? '&subsite=bridal' : ''}`
    state.buyNowData = buyNowData
  },
  setBuyNowNotice(state, buyNowNotice) {
    state.buyNowNotice = buyNowNotice
  },
  setCheckoutLoginEmail(state, checkoutLoginEmail) {
    state.checkoutLoginEmail = checkoutLoginEmail
  },
  setCheckoutLoginEmailError(state, checkoutLoginEmailError) {
    state.checkoutLoginEmailError = checkoutLoginEmailError
  },
  setProgressId(state, progressId) {
    state.progressId = progressId
  },
  setEmailAddress(state, email) {
    state.emailAddress = email
  },
  setPopupPayProcessingShow(state, popupPayProcessingShow) {
    state.popupPayProcessingShow = popupPayProcessingShow
  },
  setPopupPayProcessingCode(state, popupPayProcessingCode) {
    state.popupPayProcessingCode = popupPayProcessingCode
  },
  setPaymentInfo(state, paymentInfo) {
    state.paymentInfo = paymentInfo
    if (paymentInfo.list) state.paymentInfoList = paymentInfo.list
    if (paymentInfo.selectedId) state.paymentId = paymentInfo.selectedId
  },
  setUseAccountBalance(state, useAccountBalanceFlag) {
    state.useAccountBalanceFlag = useAccountBalanceFlag
  },
  setShowGooglePay(state, showGooglePay) {
    state.showGooglePay = showGooglePay
  },
  setShowApplePay(state, showApplePay) {
    state.showApplePay = showApplePay
  },
  setOrderAllList(state, baseInfo) {
    state.orderAllList = baseInfo.orderInfoGoodsList || {}
    state.bingSeoInfo = {
      revenueValue: baseInfo.orderInfo.totalAmount,
      currency: baseInfo.dataLayerInfo.currency
    }
  },
  setCouponSelectVisible(state, couponSelectVisible) {
    state.couponSelectVisible = couponSelectVisible
  },
  setMaxDiscountCouponCode(state, maxDiscountCouponCode) {
    state.maxDiscountCouponCode = maxDiscountCouponCode
  },
  setCouponCodeTipsShow(state, couponCodeTipsShow) {
    state.couponCodeTipsShow = couponCodeTipsShow
  },
  setSelectCouponCode(state, flag) {
    state.selectCouponCode = flag
  },
  setCategories(state, value) {
    state.categories = value || []
  },
  setCategoryError(state, bol) {
    state.categoryError = bol
  }
}
