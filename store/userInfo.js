// import axios from '@/utils/axios'
// cookie from '@/utils/cookie'
export const state = () => ({
  userInfoName: '',
  userInfoEmail: '',
  userInfoWeddingDate: null,
  cartNum: 0,
  preCartNum: 0,
  user: '',
  isLogin: false,
  waitGetLogin: true,
  isGuest: false,
  guestCheckoutAuthorization: false,
  firstInTime: '',
  sampleSource: 'US',
  showRoom: {},
  showRoomNum: 0,
  storeRoomNum: 0, // 门店收藏列表数量
  noMoreShowRoom: false,
  isShowCoupon: false,
  isShowTopNotify: false,
  haveActivity: false,
  activityDiffTime: 0,
  userInfoDown: false,
  userId: null,
  intercom: null, // intercom 用户安全验证hash
  userInfoUpdated: false,
  isRetailer: false,
  ambassadorData: {
    // 大使身份标记 true:是，false:不是
    isAmbassador: null,
    // 大使审核状态：Approved：审核通过 Unprocessed：审核中  Rejected:审核拒绝 End cooperation:合作结束
    ambassadorStatus: '',
    // 校园大使身份是否过期 true:生效中，false:已过期
    isAmbassadorLimit: false
  },
  newCouponList: [], // 弹框展示的券列表
  newCouponPopClick: false, // 优惠券列表弹框是否关闭过
  newCouponRedPointClick: false, // 优惠券有红点状态是否点击过
  hasFreeSwatchCoupon: false, // 是否有免费色卡券
  davidBridalCoupons: [], // david bridal 落地页注册赠送优惠券
  canReceiveSodCoupon: false, // 是否能使用sod coupon 默认能使用
  influencerStatus: false, // 是否网红
  influencerCountryCode: '', // 网红国家
  storefrontStatus: false, // 是否门店
  storefrontCountryCode: '', // 门店国家
  storefrontLists: [] // 门店内收藏列表数据
})

export const mutations = {
  setStorefrontList(state, storefrontLists) {
    state.storefrontLists = storefrontLists
  },
  setInfluencerCountryCode(state, influencerCountryCode) {
    state.influencerCountryCode = influencerCountryCode
  },
  setStorefrontCountryCode(state, storefrontCountryCode) {
    state.storefrontCountryCode = storefrontCountryCode
  },
  setInfluencerStatus(state, influencerStatus) {
    state.influencerStatus = influencerStatus
  },
  setStorefrontStatus(state, storefrontStatus) {
    state.storefrontStatus = storefrontStatus
  },
  setDavidBridalCoupons(state, davidBridalCoupons) {
    state.davidBridalCoupons = davidBridalCoupons
  },
  setNewCouponList(state, newCouponList) {
    state.newCouponList = newCouponList
  },
  setNewCouponPopClick(state, newCouponPopClick) {
    state.newCouponPopClick = newCouponPopClick
  },
  setNewCouponRedPointClick(state, newCouponRedPointClick) {
    state.newCouponRedPointClick = newCouponRedPointClick
  },
  setHasFreeSwatchCoupon(state, hasFreeSwatchCoupon) {
    state.hasFreeSwatchCoupon = hasFreeSwatchCoupon
  },
  setWaitGetLogin(state, waitGetLogin) {
    state.waitGetLogin = waitGetLogin
  },
  setUserName(state, userInfoName) {
    state.name = userInfoName
  },
  setEmail(state, userInfoEmail) {
    state.userInfoEmail = userInfoEmail
  },
  setWeddingDate(state, userInfoWeddingDate) {
    state.userInfoWeddingDate = userInfoWeddingDate
  },
  setCartNum(state, num) {
    state.cartNum = num
  },
  updateInfo(state, userInfo) {
    state.userInfoName = userInfo.userName ? userInfo.userName : ''
    state.userInfoEmail = userInfo.userEmail
    state.userInfoWeddingDate = userInfo.weddingDate && userInfo.weddingDate != '0000-00-00' ? userInfo.weddingDate : null
    state.cartNum = userInfo.shoppingCartGoodsTotal
    state.preCartNum = userInfo.preLoginShoppingCartGoodsTotal
    state.isLogin = !!userInfo.userId && !userInfo.isGuest
    state.isGuest = !!userInfo.isGuest
    state.guestCheckoutAuthorization = userInfo.guestCheckoutAuthorization
    state.firstInTime = userInfo.firstInTime
    state.showRoom = userInfo.showrooms && userInfo.showrooms.length ? userInfo.showrooms : []
    state.showRoomNum = userInfo.showrooms ? userInfo.showrooms.length : 0
    state.storeRoomNum = userInfo.storefront_list_num ? Number(userInfo.storefront_list_num) : 0
    state.noMoreShowRoom = userInfo.noMoreShowRoom
    state.userInfoDown = true
    state.userId = userInfo.userId
    state.userInfoUpdated = userInfo.userInfoUpdated
    state.isRetailer = userInfo.isRetailer
    state.ambassadorData = {
      isAmbassador: userInfo.isAmbassador,
      ambassadorStatus: userInfo.ambassadorStatus,
      isAmbassadorLimit: userInfo.isAmbassadorLimit
    }
    state.intercom = userInfo.intercom
    state.canReceiveSodCoupon = userInfo.canReceiveSodCoupon
    if (userInfo.referrerUserIdentity) {
      state.influencerStatus = userInfo.referrerUserIdentity.influencerStatus
      state.influencerCountryCode = userInfo.referrerUserIdentity.influencerCountryCode
      state.storefrontStatus = userInfo.referrerUserIdentity.storefrontStatus
      state.storefrontCountryCode = userInfo.referrerUserIdentity.storefrontCountryCode
    }
  },
  updateShowCoupon(state, isShow) {
    state.isShowCoupon = isShow
  },
  setIsShowTopNotify(state, isShowTopNotify) {
    state.isShowTopNotify = isShowTopNotify
  },
  setHaveActivity(state, haveActivity) {
    state.haveActivity = haveActivity
  },
  setActivityData(state, activityData) {
    const { activityDiffTime } = activityData
    state.activityDiffTime = activityDiffTime
  },
  setSampleSource(state, sampleSource) {
    state.sampleSource = sampleSource
  },
  setUserInfoDown(state) {
    state.userInfoDown = true
  },
  setShowRooms(state, showRooms) {
    state.showRoom = showRooms
    state.showRoomNum = showRooms && showRooms.length ? showRooms.length : 0
  }
}

export const getters = {
  getUserName(state) {
    return state.userInfoName
  },
  getEmail(state) {
    return state.userInfoEmail
  },
  getWeddingDate(state) {
    return state.userInfoWeddingDate
  },
  getCartNum(state) {
    return state.cartNum
  },
  isLogin(state) {
    return state.isLogin
  },
  isGuest(state) {
    return state.isGuest
  },
  isRetailer(state) {
    return state.isRetailer
  },
  ambassadorData(state) {
    return state.ambassadorData
  },
  guestCheckoutAuthorization(state) {
    return state.guestCheckoutAuthorization
  },
  getUser(state) {
    return state.user
  },
  isShowCoupon(state) {
    return state.isShowCoupon
  },
  haveActivity(state) {
    return state.haveActivity
  },
  isShowTopNotify(state) {
    return state.isShowTopNotify
  },
  getActivityDiffTime(state) {
    return state.activityDiffTime
  },
  getNoMoreShowRoom(state) {
    return state.noMoreShowRoom
  },
  getSampleSource(state) {
    return state.sampleSource
  },
  getShowRoomNum(state) {
    return state.showRoomNum
  },
  getUserInfoDown(state) {
    return state.userInfoDown
  }
}
