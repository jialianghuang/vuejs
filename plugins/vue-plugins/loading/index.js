/**
 * AzLoading 插件
 */
import AzLoading from '@/components/az-ui/AzLoading.vue'
// 定义插件对象
const LoadingPlugin = {}
// vue的install方法，用于定义vue插件
LoadingPlugin.install = function(Vue, options) {
  const Loading = Vue.extend(AzLoading)
  let currentInstance
  let dom
  const initInstance = () => {
    // 实例化vue实例
    currentInstance = new Loading()
    dom = currentInstance.$mount()
    document.body.appendChild(dom.$el)
  }

  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$loading = {
    show() {
      if (!currentInstance) {
        initInstance()
      }
      const options = {}
      if (typeof options === 'object') {
        Object.assign(currentInstance, options)
      }
    },
    dismiss() {
      if (currentInstance) {
        if (document.body.contains(dom.$el)) {
          document.body.removeChild(dom.$el)
        }
        currentInstance.$destroy()
        currentInstance = null
      }
    }
  }
}

export default LoadingPlugin
