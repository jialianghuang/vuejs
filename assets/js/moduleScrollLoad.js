/**
 *
 * @param {Object} options
 * @param {Function} options.callback 回调函数
 * @param {Number} options.height 滚动阈值
 * @param {Boolean} options.ssr 是否是服务端渲染
 * @param {Boolean} options.listenResize 是否监听滚动
 */

export default function(...args) {
  return new CheckModuleLoad(...args)
}

function CheckModuleLoad(options, modules = [], modulesSkeletonMapPrev = {}) {
  const defaultOptions = {
    height: 200,
    ssr: false,
    autoSize: false,
    listenResize: false
  }
  this.options = Object.assign(defaultOptions, options)
  this.modules = modules

  this.isClient = !this.options.ssr && typeof window === 'object'

  // 节流时间间隔
  this.thresholdTimeout = 50
  // 滚动标识
  this.scheduledScroll = null
  // resize标识
  this.scheduledResize = null
  // resize变动
  // 1. props 提示组件更新/获取图片高度
  // 2. 基于eventbus
  this.resizeCount = 0
  //
  this.modulesSkeletonMap = this.judgeVisible(modules, modulesSkeletonMapPrev)
  // console.log(this.modulesSkeletonMap)
  //
  if (this.isClient) this.addListener()
}

CheckModuleLoad.prototype = {
  // 获取基础高度
  getBaseHeight() {
    const isClient = this.isClient
    const el = this.el
    // 不考虑活动状态
    // 黑色 + (marginTop + title +  marginBottom) + nav + bodyBo
    // pc 40 + (32 + 26 + 41) + 42 + 20 ==> 201 ==> 200
    // 30 + 46 ==> 80
    const topHeight = 40 + (32 + 26 + 41) + 42 + 20
    const biHeight = 1080
    const biWidth = 1600 // pc最大宽度1600
    // 打点sr属性获取最主流的宽高 // pc 1920×1040 m 414×896 ==> pc 1920×1080 m 414×896

    const height = isClient ? window.screen.availHeight : biHeight
    // m用屏幕 pc用中心宽度
    let width = biWidth
    if (isClient) {
      width = window.screen.availWidth
      width = width > 1600 ? 1600 : width
      width = width < 768 ? 768 : width
      const element = el && document.querySelector(el)
      if (element) {
        width = element.offsetWidth
      }
    }
    return {
      topHeight,
      height,
      width,
      canUseHeight: height - topHeight
    }
  },
  // 判断显示
  judgeVisible(modules, mapPrev) {
    const baseData = this.getBaseHeight()
    let canUseHeight = baseData.canUseHeight
    const modulesSkeletonMap = {}
    modules.forEach((item) => {
      //
      const key = item.keyStr
      if (canUseHeight <= 0) return (modulesSkeletonMap[key] = mapPrev[key] !== false)
      modulesSkeletonMap[key] = false
      if (item.isSystem) {
        if (item.height) {
          canUseHeight -= item.height
        } else {
          // 默认高度0
          canUseHeight -= 0
        }
        return
      }
      if (!item.scrollable || this.autoSize) {
        canUseHeight -= (item.height / item.width) * baseData.width
      } else {
        canUseHeight -= item.height
      }
      if (item.paddingBottom) canUseHeight -= +item.paddingBottom
      if (item.titleHeight) canUseHeight -= +item.titleHeight
    })
    return modulesSkeletonMap
  },
  // 添加监听
  addListener() {
    this.scrollHandler()
    this._scrollHandlerStore = this.scrollHandler.bind(this)
    window.addEventListener('scroll', this._scrollHandlerStore)
    // 是否添加resize监听
    if (this.options.listenResize) {
      this._resizelHandlerStore = this.resizeHandler.bind(this)
      window.addEventListener('resize', this._resizelHandlerStore)
    }
  },
  /**
   * resize 处理函数
   * resizeCount数量变化说明触发了resize
   * 组件内监听resize方法：==> 都是异步的
   *  1. watch ==> resizeCount
   *  2. eventbus 注册并监听 $emit事件
   */
  resizeHandler() {
    if (this.scheduledResize) return
    if (typeof requestAnimationFrame === 'function') {
      this.scheduledResize = true
      requestAnimationFrame(() => {
        this.setResizeCount()
      })
    } else {
      this.scheduledResize = setTimeout(() => {
        this.setResizeCount()
      }, this.thresholdTimeout)
    }
  },
  setResizeCount() {
    this.scheduledResize = false
    this.resizeCount = this.resizeCount > 100 ? 1 : this.resizeCount + 1
  },
  // 滚动事件处理
  scrollHandler() {
    if (this.scheduledScroll) return
    if (typeof requestAnimationFrame === 'function') {
      this.scheduledScroll = true
      requestAnimationFrame(() => {
        this.judePosition()
      })
    } else {
      this.scheduledScroll = setTimeout(() => {
        this.judePosition()
      }, this.thresholdTimeout)
    }
  },
  // 高度判断
  judePosition() {
    // console.log('judePosition')
    this.scheduledScroll = false
    const scrollTop = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
    const pageHeight =
      window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight
    this.modules.forEach((item, index) => {
      const key = item.keyStr
      const element = document.querySelector(`#module_load_${key}`)
      // mostpopular相关固定组件
      if (!element) return
      // 初始显示则加载
      const offsetTop = element.offsetTop
      if (scrollTop + pageHeight - offsetTop > this.options.height) {
        // eventBus.$emit(selector).then(() => {
        //   // 异步删除
        //   const curIndex = module.indexOf(item)
        //   module.splice(curIndex, 1)
        // })
        this.modulesSkeletonMap[key] = false
      }
    })
    if (!this.hasModuleHide()) {
      this.removeListen()
    }
  },
  // 是否有组件未显示
  hasModuleHide() {
    for (const k in this.modulesSkeletonMap) {
      if (this.modulesSkeletonMap[k]) return true
    }
    return false
  },
  // 移除事件
  removeListen() {
    // console.log('removeListen')
    window.removeEventListener('scroll', this._scrollHandlerStore)
  }
}
