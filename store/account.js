export const state = () => ({
  showLoginLeaveDialog: false // 是否显示登录挽留弹框
})

export const mutations = {
  setShowLoginLeaveDialog(state, showLoginLeaveDialog) {
    state.showLoginLeaveDialog = showLoginLeaveDialog
  }
}
