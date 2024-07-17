import Vue from 'vue'
// import webpushDialog from '@/components/webpush/webpushPlugin'
import track from './track/index'
import videoplay from './videoplay/index' // 视频控制自定义指令
// import loading from './loading/index'
// Vue.directive('track', track)
// Vue.directive(track.name, track)

Vue.use(track, { className: 'az_v_directive_track' })
Vue.use(videoplay)
// Vue.use(loading)

// export default (options) => {
//   // const { app } = options
//   Vue.use(webpushDialog)
// }
