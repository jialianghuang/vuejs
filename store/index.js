export const state = () => ({
  headersInfo: '', // 请求headers中的所有信息
  country: 'US', // 国家缩写
  currentCountryUrl: '', // 拼接国家路径
  countryName: '', // 国家全称
  countryId: '', // 国家id
  currencyCode: '', // 货币code
  currencySymbol: '', // 货币符号
  headItemImageUrl: '', // 国家图标
  language: 'en', // 默认语言
  languageName: '', // 语言全程
  siteOptions: [], // 所有站点信息
  languageOptions: [], // 站点支持的语言
  isNewLanguageCountry: false, // 是否新语言国家
  jsKey: '',
  langs: {},
  colorHex: {},
  envApi: '',
  environment: 'dev',
  serverTime: '', // 服务器时间
  new_facebook_app_code: '3400562746935623',
  HTTPS_HOST: '',
  WEB_ROOT: '/',
  APP_NAME_LOWER: 'azazie',
  APP_DOMAIN_LOWER: 'azazie.com',
  PIC_PATH: 'https://cdn-1.azazie.com/upimg/',
  isFlashSale: false,
  flashSale: {},
  isComingSoon: false,
  topBarInfo: [],
  dressType: 'dress',
  catId: 0,
  catIds: [],
  catName: 'dresses',
  footerMenu: [],
  cartInfo: {
    totalCount: 0,
    prodList: [],
    hasLineTotal: false,
    totalPrice: 0,
    totalNoDealPrice: 0,
    sample_gift_goods_id: '',
    cartBundleList: null,
    freeShippingProgress: null,
    activityInfo: {},
    recommendInfo: {} // 购物车为空的时候的按钮信息
  },
  bundlePromotionProgress: {},
  scrollToTop: false,
  ZZSID: '',
  SRSID: '',
  AZSID: '',
  isSemiSale: false,
  activityInfo: [],
  abtest: 'A',
  versionObj: {},
  versionGroup: {},
  isSupportWebp: false,
  logsId: {
    reqHeaders: ''
  },
  topCartListShow: false,
  isPreviewWebsite: false,
  afterpayLayerShow: false,
  popupActivityContentShow: false,
  couponWheelIsShow: false,
  isCouponSwatch: false, // 免费色卡直接购买
  showLangsCode: false,
  is_chrome_lighthouse: false,
  // azHeaderActivityHeight: 0
  wgdUesrTag: {},
  isBridal: false,
  isEnableForBridal: false, // 该国家是否开启bridal
  version: '',
  headerFixed: false,
  openNotifyMe: false,
  subSmallBox: [],
  webLanguageKeys: [], // 页面支持的多语言
  showSignLayer: false, // 是否展示登录弹框组件
  signLayerSource: '', // 登录注册弹框组件操作成功的跳转
  sodGalleryVersion: 'a', // sod 图片的abtest标记
  registScene: {
    key: '', // 注册场景特殊值
    data: {} // 额外参数
  }, // 注册场景，用于区分特殊场景的登录注册组件弹框操作，比如david_bridal的落地
  dbLandingPage: false, // 是否来源DB landing page 推广
  showShoppingForDialog: false, // 是否显示DB 领券弹框
  cyberSaleInfo: null,
  showNewUserCoupon: false, // 展示居中弹框新用户领取券包
  showSlideNewUserCoupon: false, // 展示侧边栏新用户领取券包
  navigation: {}, // 导航栏数据
  fromAzHeaderActivitySource: false, // 是否来原通顶点击
  ipLocationData: {}, //
  firstTopBannerList: null // 首页first banner
})

export const mutations = {
  setIpLocationData(state, ipLocationData) {
    state.ipLocationData = ipLocationData
  },
  setCyberSaleInfo(state, cyberSaleInfo) {
    state.cyberSaleInfo = cyberSaleInfo
  },
  setRegistScene(state, registScene) {
    state.registScene = registScene
  },
  setShowSignLayer(state, showSignLayer) {
    state.showSignLayer = showSignLayer
  },
  setSignLayerSource(state, signLayerSource) {
    state.signLayerSource = signLayerSource
  },
  setIsBridal(state, isBridal) {
    state.isBridal = isBridal
  },
  setIsEnableForBridal(state, isEnableForBridal) {
    state.isEnableForBridal = isEnableForBridal
  },
  // 保存请求headers中的信息
  setReqHeaders(state, headers) {
    state.headersInfo = headers
  },
  // 保存国家，比如：US，AU等
  setCountry(state, country) {
    // 先校验传入的country符不符合要求
    // 国家简称大多数为两个大写字母，个别一个字母
    const reg = /[A-Z]{1,2}/
    let res = country
    if (res.length > 2) {
      // 如果传入的数据长度超过两位，无论什么形式，只截取头两位大写字符串
      res = res.match(reg)
      // 没有任何匹配值时，res是null
      if (res) res = res[0]
    }
    // 符合条件的情况下，更新country，否则country依旧为默认值
    if (reg.test(res)) {
      state.country = res
    }
    if (['MX'].includes(state.country)) state.isNewLanguageCountry = true
  },
  setCountryName(state, countryName) {
    state.countryName = countryName
  },
  setCurrentCountryUrl(state, currentCountryUrl) {
    state.currentCountryUrl = currentCountryUrl
  },
  setCountryId(state, countryId) {
    state.countryId = countryId
  },
  setCurrencyCode(state, currencyCode) {
    state.currencyCode = currencyCode
    // 根据country和currencyCode，获取对应的currencySymbol
    for (let i = 0; i < state.siteOptions.length; i++) {
      const ele = state.siteOptions[i]
      if (ele.countrycode === state.country) {
        for (let x = 0; x < ele.multicurrency.length; x++) {
          const item = ele.multicurrency[x]
          if (item.currency === currencyCode) {
            state.currencySymbol = item.currencySymbol
            break
          }
        }
        break
      }
    }
  },
  setCurrencySymbol(state, currencySymbol) {
    state.currencySymbol = currencySymbol
  },
  setHeadItemImageUrl(state, headItemImageUrl) {
    state.headItemImageUrl = headItemImageUrl
  },
  setLanguage(state, language) {
    if (!language || language == 'null' || language == 'undefined') language = 'en'
    state.language = language
    // if (language != 'en') {
    //   state.currentCountryUrl = `/${language.toLowerCase()}`
    // }
  },
  setLanguageName(state, languageName) {
    state.languageName = languageName
  },
  setSiteOptions(state, siteOptions = []) {
    state.siteOptions = siteOptions
    // state.isSupportWebp = isSupportWebp

    // 全球站二期，数据返回结构变动，返回数组结构
    for (let i = 0; i < siteOptions.length; i++) {
      const ele = siteOptions[i]
      if (ele.countryCode === state.country) {
        state.countryName = ele.countryName
        state.countryId = ele.countryId
        state.currencyCode = ele.currencyCode
        state.currencySymbol = ele.currencySymbol
        state.headItemImageUrl = ele.headItemImageUrl
        state.languageOptions = ele.multilanguages
        break
      }
    }
  },
  setLanguageOptions(state, languageOptions) {
    state.languageOptions = languageOptions
  },
  setTopCartListShow(state, topCartListShow) {
    state.topCartListShow = topCartListShow
  },
  setIsSupportWebp(state, isSupportWebp) {
    state.isSupportWebp = isSupportWebp
  },
  setJsKey(state, jsKey) {
    state.jsKey = jsKey
  },
  setHttpsHost(state, HTTPS_HOST) {
    state.HTTPS_HOST = HTTPS_HOST
  },
  setIsPreviewWebsite(state, isPreviewWebsite) {
    state.isPreviewWebsite = isPreviewWebsite
  },
  setTopBarInfo(state, topBarInfo) {
    state.topBarInfo = topBarInfo
  },
  setDressType(state, val) {
    state.dressType = val
  },
  setAppDomainLower(state, APP_DOMAIN_LOWER) {
    state.APP_DOMAIN_LOWER = APP_DOMAIN_LOWER
  },
  setFooterMenu(state, footerMenu) {
    state.footerMenu = footerMenu
  },
  setCartInfo(state, obj) {
    state.cartInfo.totalCount = obj.totalCount
    state.cartInfo.prodList = JSON.parse(JSON.stringify(obj.prodList))
    state.cartInfo.hasLineTotal = obj.hasLineTotal
    state.cartInfo.totalPrice = obj.totalPrice
    state.cartInfo.totalNoDealPrice = obj.totalNoDealPrice
    state.cartInfo.freeShippingProgress = obj.freeShippingProgress
    state.cartInfo.cartBundleList = obj.cartBundleList // buy more get more
    state.cartInfo.activityInfo = obj.activityInfo || {} // 活动信息
    state.cartInfo.recommendInfo = obj.recommendInfo || {} // 购物车为空的时候的按钮信息
  },
  setBundlePromotionProgress(state, bundlePromotionProgress) {
    state.bundlePromotionProgress = bundlePromotionProgress
  },
  setCatId(state, catId) {
    state.catId = catId
  },
  setCatIds(state, catIds = []) {
    state.catIds = catIds
  },
  setCatName(state, catName) {
    state.catName = catName
  },
  setIsFlashSale(state, isFlashSale) {
    state.isFlashSale = isFlashSale
  },
  setFlashSale(state, flashSale) {
    state.flashSale = flashSale
  },
  setComingSoon(state, isComingSoon) {
    state.isComingSoon = isComingSoon
  },
  setEnvironment(state, environment) {
    state.environment = environment
  },
  setEnvApi(state, envApi) {
    state.envApi = envApi
  },
  setLangs(state, langs) {
    state.langs = langs
  },
  setColorHex(state, colorHex) {
    state.colorHex = colorHex
  },
  setServerTime(state, serverTime) {
    state.serverTime = serverTime
  },
  setScrollToTop(state, scrollToTop) {
    state.scrollToTop = scrollToTop
  },
  setHeaderFixed(state, headerFixed) {
    state.headerFixed = headerFixed
  },
  setZZSID(state, zzsid) {
    state.ZZSID = zzsid
  },
  setSRSID(state, srsid) {
    state.SRSID = srsid
  },
  setAZSID(state, azsid) {
    state.AZSID = azsid
  },
  setIsSemiSale(state, isSemiSale) {
    state.isSemiSale = isSemiSale
  },
  setActivityInfo(state, activityInfo) {
    state.activityInfo = activityInfo
  },
  setAbtest(state, abtest) {
    state.abtest = abtest
  },
  setVersionObj(state, versionObj) {
    state.versionObj = versionObj
  },
  setVersionGroup(state, versionGroup) {
    state.versionGroup = versionGroup
  },
  setLogHeaders(state, head) {
    state.logsId.reqHeaders = head
  },
  setPopupActivityContentShow(state, popupActivityContentShow) {
    state.popupActivityContentShow = popupActivityContentShow
  },
  setAfterpayLayerShow(state, bl) {
    state.afterpayLayerShow = bl
  },
  setIsCouponSwatch(state, isCouponSwatch) {
    state.isCouponSwatch = isCouponSwatch
  },
  setCouponWheelIsShow(state, couponWheelIsShow) {
    state.couponWheelIsShow = couponWheelIsShow
  },
  setShowLangsCode(state, showLangsCode) {
    state.showLangsCode = showLangsCode
  },
  // setAzHeaderActivityHeight(state, height) {
  //   state.azHeaderActivityHeight = height
  // }
  setWgdUesrTag(state, userTag = {}) {
    state.wgdUesrTag = userTag
  },
  setVersion(state, version = '') {
    state.version = version
  },
  setOpenNotifyMe(state, bol) {
    state.openNotifyMe = bol
  },
  setSubSmallBox(state, data) {
    state.subSmallBox = data || []
  },
  setWebLanguageKeys(state, webLanguageKeys) {
    state.webLanguageKeys = webLanguageKeys
  },
  setSodGalleryVersion(state, version) {
    state.sodGalleryVersion = version
  },
  setDBLandingPage(state, dbLandingPage) {
    state.dbLandingPage = dbLandingPage
  },
  setShowShoppingForDialog(state, showShoppingForDialog) {
    state.showShoppingForDialog = showShoppingForDialog
  },
  setShowNewUserCoupon(state, showNewUserCoupon) {
    state.showNewUserCoupon = showNewUserCoupon
  },
  setShowSlideNewUserCoupon(state, showSlideNewUserCoupon) {
    state.showSlideNewUserCoupon = showSlideNewUserCoupon
  },
  setNavigationData(state, navigation) {
    state.navigation = navigation
  },
  setFromAzHeaderActivitySource(state, bol) {
    state.fromAzHeaderActivitySource = bol
  },
  setFirstTopBannerList(state, firstTopBannerList) {
    state.firstTopBannerList = firstTopBannerList
  }
}
export const getters = {
  getIsSemiSale(state) {
    return state.isSemiSale
  }
}

export const actions = {
  getErr({ state, commit }, errInfo) {
    if (process.env.NODE_ENV === 'production' && state.environment.includes('dev')) {
      return
    }
    errInfo.requestTraceId = state.logsId.reqHeaders.request_trace_id
    errInfo.requestTraceUid = state.logsId.reqHeaders.request_trace_user_uid
    // errInfo.err.replace(/[\r\n]/g, '') // 防止报错信息自带/n换行
    if (process.server || [601, 602, 603].includes(errInfo.errorCode)) {
      // 601, 602, 603 bi打点查询
      this.$axios.$post('/serverLog', { ...errInfo })
    } else {
      // 生产环境，客户端的控制台报错显示去掉多语言报错
      if (!(state.environment == 'prod' && errInfo.errorMetric.includes('langue code error:'))) {
        console.log(errInfo)
      }
      //  其他客户端报错code 421、423 多语言未配置
      errInfo.errorCode = [423].includes(errInfo.errorCode) ? errInfo.errorCode : 421
      // this.$axios.$post('/serverLog', { ...errInfo })
    }
    // test-min 模式不调用log接口
    if (process.env.NODE_ENV_TEST || (process.env.NODE_ENV === 'production' && state.environment === 'test')) {
      return
    }
    if (process.env.NODE_ENV === 'production') {
      // this.$axios.$post('/logs/1.0/log/riven', { log: JSON.stringify(errInfo) })
    }
  }
}
