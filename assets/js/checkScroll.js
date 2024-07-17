/**
 *
 * @param {Object} options
 * @param {Function} options.callback 回调函数
 * @param {Number} options.threshold IntersectionObserver阈值 取值范围0-1
 * @param {Number} options.height 滚动阈值
 */
const CheckUpdate = function(options = {}) {
  this.options = Object.assign({ threshold: 0.01, height: 0 }, options)
  this.scheduledScroll = null
  this.thresholdTimeout = 50
  this.addListener()
  // { callback, element, threshold = 0.01, height = 0}
}

CheckUpdate.prototype = {
  // 添加监听
  addListener() {
    if (typeof IntersectionObserver === 'function') {
      this.observeListener()
    } else {
      this.scrollListener()
    }
  },
  observeListener() {
    // const cb = this.options.callback
    this.intersection = new IntersectionObserver(
      (entries) => {
        entries.forEach((item) => {
          if (item.isIntersecting) {
            this.options.callback()
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: this.options.threshold
      }
    )
    this.intersection.observe(this.options.element)
  },
  scrollListener() {
    this.scrollHandler()
    this._scrollHandlerStore = this.scrollHandler.bind(this)
    window.addEventListener('scroll', this._scrollHandlerStore)
  },
  // 滚动事件处理
  scrollHandler() {
    if (this.scheduledScroll) return
    if (typeof requestAnimationFrame === 'function') {
      this.scheduledScroll = true
      requestAnimationFrame(this.judeHeight.bind(this))
    } else {
      this.scheduledScroll = setTimeout(() => {
        this.judeHeight()
      }, this.thresholdTimeout)
    }
  },
  // 高度判断
  judeHeight() {
    this.scheduledScroll = false
    const offsetTop = this.options.element.offsetTop
    const scrollTop = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
    const pageHeight =
      window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight
    // 初始显示则加载
    if (scrollTop + pageHeight - offsetTop > this.options.height) {
      this.options.callback()
    }
  },
  // 移除事件
  removeListen() {
    if (typeof IntersectionObserver !== 'function') {
      if (this.intersection) {
        this.intersection.unobserve(this.options.element)
        this.intersection = null
      }
    } else {
      window.removeEventListener('scroll', this._scrollHandlerStore)
    }
  }
}

export default function(opotions) {
  return new CheckUpdate(opotions)
}
