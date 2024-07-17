import { loadScript } from '@/assets/js/utils.js'

window.app = null
export default ({ app, store }) => {
  window.app = app

  if (store.state.versionGroup.messagerAbtest === 'B') {
    return false
  }
  if (!window.is_chrome_lighthouse) {
    if (
      !window.location.href.includes('support/header') &&
      !window.location.href.includes('support/footer') &&
      !window.location.href.includes('/unsubscribe') &&
      !window.location.href.includes('/comingsoon') &&
      !window.location.href.includes('/maintenance') &&
      !window.location.href.includes('/all/special-occasion-dresses/kendall-kylie') &&
      !window.location.href.includes('/checkout')
    ) {
      loadScript('https://static.zdassets.com/ekr/snippet.js?key=452afc22-20a6-4651-a6f2-7176be4b0aa8', 'ze-snippet', function() {
        console.log('load new solvvy success')
      })
    }
  }
}
