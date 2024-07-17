export const state = () => ({
  giftCardInfo: {},
  showGiftCardDialog: false,
  giftCardFromData: {},
  popupGiftCardVerifyShow: false, // 验证码弹框是否显示
  popupGiftCardsShow: false
})
export const mutations = {
  setGiftCardInfo(state, giftCardInfo) {
    state.giftCardInfo = giftCardInfo
  },
  setShowGiftCardDialog(state, showGiftCardDialog) {
    state.showGiftCardDialog = showGiftCardDialog
  },
  setGiftCardFromData(state, giftCardFromData) {
    state.giftCardFromData = giftCardFromData
  },
  setPopupGiftCardVerifyShow(state, popupGiftCardVerifyShow) {
    state.popupGiftCardVerifyShow = popupGiftCardVerifyShow
  },
  setPopupGiftCardsShow(state, popupGiftCardsShow) {
    state.popupGiftCardsShow = popupGiftCardsShow
  },
  setGiftCardFromDataEmail(state, email) {
    state.giftCardFromData.to_email = email
  }
}
export const getters = {}
