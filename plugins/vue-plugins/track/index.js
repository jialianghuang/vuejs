import createTrack from './createTrack'

// 插件主体
const MyPlugin = {}

MyPlugin.install = function(Vue, options) {
  // 1. 添加全局方法或 property
  // Vue.myGlobalMethod = function () {
  //   // 逻辑...
  // }

  // 2. 添加全局资源
  Vue.directive('track', createTrack(options))

  // // 3. 注入组件选项
  // Vue.mixin({
  //   created: function () {
  //     // 逻辑...
  //   }
  //   ...
  // })

  // // 4. 添加实例方法
  // Vue.prototype.$myMethod = function (methodOptions) {
  //   // 逻辑...
  // }
}
export default MyPlugin
