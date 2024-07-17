export const state = () => ({
  isPaymentProcessing: false,
  popupPayProcessingShow: false,
  loadingFlag: false,
  regionList: [],
  payList: [],
  rightsId: '',
  paymentId: '',
  rightsPackage: {}
})

export const mutations = {
  setPaymentProcessing(state, flag = false) {
    state.isPaymentProcessing = flag
  },
  setPopupPayProcessingShow(state, flag = false) {
    state.popupPayProcessingShow = flag
  },
  setLoading(state, flag = false) {
    state.loadingFlag = flag
  },
  setRegionList(state, regionList = []) {
    state.regionList = regionList
  },
  setPayList(state, list = []) {
    state.payList = list
  },
  setRightsId(state, id) {
    state.rightsId = id
  },
  setPaymentId(state, id) {
    state.paymentId = id
  },
  setRightsPackage(state, info = {}) {
    state.rightsPackage = info
  }
}
