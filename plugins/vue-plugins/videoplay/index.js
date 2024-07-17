import createVideoplay from './createVideoplay'

// 插件主体
const MyPlugin = {}

MyPlugin.install = function(Vue) {
  // 注册一个全局指令:v-videoplay
  Vue.directive('videoplay', createVideoplay())
}
export default MyPlugin
