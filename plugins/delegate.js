const delegate = {
  // 监听的父节点
  _wrapEle: null,
  _match(elem, target, selector) {
    while (target && target !== elem) {
      if (target.matches(selector)) {
        return target
      }
      target = target.parentElement
    }
    return null
  },
  delegate(type, selector, callback, capture) {
    if (!this._wrapEle) {
      return
    }
    const wrapper = (e) => {
      const target = this._match(this._wrapEle, e.target, selector)
      if (target) {
        callback.call(this._wrapEle, e, target)
      }
    }
    this._wrapEle.addEventListener(type, wrapper, capture || false)
  },
  off(type, callback, capture) {
    this._wrapEle.removeEventListener(type, callback, capture || false)
  }
}

export default (selector) => {
  // 目前只取一个唯一的父节点
  delegate._wrapEle = document.querySelector(selector)
  return delegate
}
