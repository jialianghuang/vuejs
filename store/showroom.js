export const state = () => ({
  tutorialPopShow: false,
  inviteInfo: {},
  invitePopShow: false,
  invitePopOverShow: false,
  showroomBaseInfo: {},
  dashboardInfo: {},
  userList: [],
  showroomDeletePopShow: false,
  prodList: [],
  pageInfo: {},
  loadingFlag: false,
  adInfo: [],
  showroomBtnLoadingIndex: null,
  firstInLayerShow: false
})

export const mutations = {
  setShowroomInfo(state, showroomInfo) {
    state.showroomBaseInfo = showroomInfo.baseInfo
    state.dashboardInfo = showroomInfo.dashboardInfo || {}
    state.userList = showroomInfo.userList
    state.prodList = showroomInfo.prodList || []
    state.pageInfo = showroomInfo.pageInfo || {}
    // state.adInfo = showroomInfo.adInfo || {}
    state.inviteInfo = showroomInfo.inviteInfo || {}
    if (
      showroomInfo &&
      showroomInfo.baseInfo &&
      showroomInfo.baseInfo.isFirstTime &&
      showroomInfo.baseInfo.isOwner &&
      showroomInfo.baseInfo.ownShowroomCount <= 1
    ) {
      state.tutorialPopShow = true
    }
  },
  setTutorialPopShow(state, tutorialPopShow) {
    state.tutorialPopShow = tutorialPopShow
  },
  setInvitePopShow(state, invitePopShow) {
    state.invitePopShow = invitePopShow
  },
  setInvitePopOverShow(state, invitePopOverShow) {
    state.invitePopOverShow = invitePopOverShow
  },
  setShowroomBaseInfo(state, showroomBaseInfo) {
    state.showroomBaseInfo = showroomBaseInfo
  },
  setShowroomDeletePopShow(state, showroomDeletePopShow) {
    state.showroomDeletePopShow = showroomDeletePopShow
  },
  setProdList(state, prodList) {
    state.prodList = prodList || []
  },
  setPageInfo(state, pageInfo) {
    state.pageInfo = pageInfo || {}
  },
  setLoadingFlag(state, loadingFlag) {
    state.loadingFlag = loadingFlag
  },
  setShowroomBtnLoadingIndex(state, showroomBtnLoadingIndex) {
    state.showroomBtnLoadingIndex = showroomBtnLoadingIndex
  },
  setInviteInfoUserList(state, userList) {
    state.inviteInfo.userList = userList
  },
  setFirstInLayerShow(state, firstInLayerShow) {
    state.firstInLayerShow = firstInLayerShow
  },
  setAdInfo(state, adInfo) {
    state.adInfo = adInfo || []
  }
}

export const getters = {}
