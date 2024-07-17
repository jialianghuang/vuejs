export const state = () => ({
  popupSamplesExtensionShow: false,
  extendSampleDays: 0,
  // sampleHasBeenExtended: false, // 样衣是否已延期
  returnReasonData: {},
  cancelOrderLayerShow: false,
  refundFeeLayerShow: false,
  refundList: [], // 修补商品列表
  addToShowrommLayerShow: false,
  returnOrderLayerShow: false,
  resendUnusalLayerShow: false, // resend 异常 弹窗展示
  editEmailResendLayerShow: false, // giftcard editmail/resend 弹窗展示
  currentGiftCarInfo: {} // 当前的 gift card 信息，用于 editmail/resend 弹窗
})
export const mutations = {
  setPopupSamplesExtensionShow(state, popupSamplesExtensionShow) {
    state.popupSamplesExtensionShow = popupSamplesExtensionShow
  },
  setExtendSampleDays(state, extendSampleDays) {
    state.extendSampleDays = extendSampleDays
  },
  // setSampleHasBeenExtended(state, sampleHasBeenExtended) {
  //   state.sampleHasBeenExtended = sampleHasBeenExtended
  // },
  setReturnReasonData(state, returnReasonData) {
    state.returnReasonData = returnReasonData
  },
  setCancelOrderLayerShow(state, cancelOrderLayerShow) {
    state.cancelOrderLayerShow = cancelOrderLayerShow
  },
  setRefundFeeLayerShow(state, refundFeeLayerShow) {
    state.refundFeeLayerShow = refundFeeLayerShow
  },
  setRefundList(state, refundList) {
    state.refundList = refundList
  },
  setAddToShowrommLayerShow(state, addToShowrommLayerShow) {
    state.addToShowrommLayerShow = addToShowrommLayerShow
  },
  setReturnOrderLayerShow(state, returnOrderLayerShow) {
    state.returnOrderLayerShow = returnOrderLayerShow
  },
  setResendUnusalLayerShow(state, resendUnusalLayerShow) {
    state.resendUnusalLayerShow = resendUnusalLayerShow
  },
  setEditEmailResendLayerShow(state, editEmailResendLayerShow) {
    state.editEmailResendLayerShow = editEmailResendLayerShow
  },
  setCurrentGiftCarInfo(state, currentGiftCarInfo) {
    state.currentGiftCarInfo = currentGiftCarInfo
  }
}
