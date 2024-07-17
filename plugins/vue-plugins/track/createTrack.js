/*
tips:
  1. 存在当前页面更新问题: 当前页$router.push/列页面无刷新加载 => 单次曝光是否再次曝光
    使用与路径匹配的id  $nuxt.$route.path / $nuxt.$route.fullPath / $nuxt.$route.name
      自动添加路径
      是否包含query 分页排序等   
  2. 与swiper共同使用时, 轮播模式下, view打点不准确, 需要手写  
 */

/**
  v-track.click.clickOnce.view.viewOnce.stop={ id, common, view, click, threshold }
  modifiers
    .click click埋点
    .clickOnce 单次click埋点 需要配value.id作为唯一标识
    .view view埋点
    .viewkOnce 单次click埋点 需要配value.id作为唯一标识
    .stop 阻止父级元素click埋点
  value参数
    打点数据
      common 通用打点数据
      view view打点定制数据  => view打点数据  mergeValue(value, 'click' | 'view')
      click click打点定制数据  => click打点数据  { ...(common || {}), ...(click || {})}
    单次打点标识 可选
      id 作为执行一次的标识符 需要不重复的  推荐 [组件名][catId][goodId][colorId][btnName]等组合
    view打点阈值 可选
      threshold 曝光阈值 默认0.1
    唯一标识拼接参数
      cachePath 默认 'path'
        false 不拼接
        true location.href
        [string] $nuxt.$route[string]
 */

import trackNebulas from '@/assets/js/point'
require('intersection-observer')

const defaultClassName = 'vue-directive-track'

/**
 * 创建tracj指令
 * @param {Object} options
 * @param {String} options.className 支持的track元素类名
 * @param {Boolean | String} options.cachePath 默认path 是否为全局缓存id拼接url  path|fullPath|name
 */
const createTrack = (options = { className: defaultClassName, cachePath: true }) => {
  // Magic Data
  // const TRACK_CLASSNAME = options.hasOwnProperty('className') ? options.className : defaultClassName
  const TRACK_CLASSNAME = options.className || defaultClassName
  const cachePath = options.hasOwnProperty('cachePath') ? options.cachePath : 'path'
  const globalMap = {
    view: {},
    click: {}
  }

  // window.globalMap = globalMap

  /**
   * 全局缓存api
   * 依赖上级作用域 cachePath: 是否合成url
   */
  const globalMapApi = {
    // 判断键值是否存在
    has(type, id, cakeKey) {
      const key = globalMapApi.getKey(id, cakeKey)
      return globalMap[type][key]
    },
    // 缓存唯一键值
    save(type, id, cakeKey) {
      const key = globalMapApi.getKey(id, cakeKey)
      globalMap[type][key] = true
    },
    // 生成键名
    getKey(id, cakeKey) {
      cakeKey = cakeKey !== undefined ? cakeKey : cachePath
      if (!cachePath) {
        return id
      } else {
        const prefix = (window.$nuxt && window.$nuxt.$route && window.$nuxt.$route[cakeKey]) || location.href
        return prefix + '-' + id
      }
    }
  }

  /**
   * 合并打点数据
   * {common: {a: 1, b: 1}, click: {a:2}}  => click {a: 2, b: 1}
   * {common: [{a: 1, b: 1}], click: {a:2}}  => click [{a: 1, b: 1}, {a: 2}]
   * {common: {a:1, b: 1}, click: [{a: 2}]}  => click [{a: 2}, {a: 1, b: 1}]
   * {common: [{a:1, b: 1}], click: [{a: 2}]}  => click [{a: 2}, {a: 1, b: 1}]
   * @param {*} value 基础数据
   * @param {*} key 定制数据键名
   * @param {*} ea click/view 默认使用 key值
   */
  const mergeValue = (value, key, ea) => {
    if (!value) return
    if (!value.common && !value[key]) return
    let options
    ea = ea || key
    if (Array.isArray(value.common) || Array.isArray(value[key])) {
      if (!Array.isArray(value.common)) {
        options = [...value[key]]
        if (value.common) options.push(value.common)
      } else if (!Array.isArray(value[key])) {
        options = [...value.common]
        if (value[key]) options.push(value[key])
      } else {
        options = value.common.concat(value[key])
      }
    } else {
      options = [{ ...(value.common || {}), ...(value[key] || {}) }]
    }
    const currentDate = new Date().getTime()
    const list = options.map((item) => {
      return {
        ...item,
        lgt: currentDate,
        ea
      }
    })
    return list
  }
  /**
   * 事件执行方法
   */
  const dispatchTrack = {
    click(element) {
      // 触发事件
      const { value } = element[TRACK_CLASSNAME] || {}
      if (!window.$nuxt || !value) return
      const options = mergeValue(value, 'click')
      if (!options) return

      // bi打点和ga打点都用这个插件，通过 event === 'ga4Event' 来判断是ga还是bi
      const { biOptions, ga4Options } = filterEvent(options)
      trackNebulas(window.$nuxt, 'events', biOptions)
      // console.dir('dispatchTrackClick')

      ga4Options.forEach((opt) => {
        if (opt.event === 'ga4Event') {
          if (window.$nuxt.setGA4DataLayer) {
            window.$nuxt.setGA4DataLayer(opt)
          }
        }
      })
    },
    view(element) {
      // 触发事件
      if (!element.azIntersectionObserver) return
      const { value } = element[TRACK_CLASSNAME] || {}
      if (!window.$nuxt || !value) return
      const options = mergeValue(value, 'view')
      if (!options) return

      // bi打点和ga打点都用这个插件，通过 event === 'ga4Event' 来判断是ga还是bi
      const { biOptions, ga4Options } = filterEvent(options)
      trackNebulas(window.$nuxt, 'events', biOptions)
      // console.dir('dispatchTrackView')

      ga4Options.forEach((opt) => {
        if (opt.event === 'ga4Event') {
          if (window.$nuxt.setGA4DataLayer) {
            window.$nuxt.setGA4DataLayer(opt)
          }
        }
      })
    }
  }
  /**
   * 清除数据
   * 依赖上层作用域变量 TRACK_CLASSNAME globalMap
   * @param {*} element
   * @param {*} type
   */
  const clearElement = (element, type) => {
    const binding = element[TRACK_CLASSNAME]
    if (!binding) return
    const { modifiers, value } = binding
    if (type == 'view') {
      if (modifiers.viewOnce && value.id) {
        // 移除监听
        element.azIntersectionObserver && element.azIntersectionObserver.unobserve(element)
        delete element.azIntersectionObserver
        // 添加全局标识
        // if (value.id) globalMap.view[value.id] = true
        if (value.id) globalMapApi.save('view', value.id, value.cachePath)
        // 无click
        if (!(modifiers.click || modifiers.clickOnce)) {
          delete element[TRACK_CLASSNAME]
        }
      }
    }
    if (type == 'click') {
      if (modifiers.clickOnce && value.id) {
        // 移除类名
        element.classList.remove(TRACK_CLASSNAME)
        // 添加全局标识
        // if (value.id) globalMap.click[value.id] = true
        if (value.id) globalMapApi.save('click', value.id, value.cachePath)
        // 无view
        if (!(modifiers.view || modifiers.viewOnce)) {
          delete element[TRACK_CLASSNAME]
        }
      }
    }
    // 清除所有
    if (!type) {
      element.azIntersectionObserver && element.azIntersectionObserver.unobserve(element)
      delete element[TRACK_CLASSNAME]
      delete element.azIntersectionObserver
      element.classList.remove(TRACK_CLASSNAME)
    }
  }
  /**
   * 事件委托
   * 依赖上层作用域变量 TRACK_CLASSNAME
   * @param {*} e
   */
  const delegation = (e) => {
    let element = e.target
    // let parentNode = null
    element = element.closest(`.${TRACK_CLASSNAME}`)
    while (element) {
      dispatchTrack.click(element)
      // 去除单次执行事件
      clearElement(element, 'click')
      const binding = element[TRACK_CLASSNAME]
      // 阻止冒泡
      if (binding && binding.modifiers && binding.modifiers.stop) {
        break
      }
      element = element.parentNode && element.parentNode.closest(`.${TRACK_CLASSNAME}`)
      // parentNode = element.closest(`.${TRACK_CLASSNAME}`)
      // element = parentNode !== element ? parentNode : null
    }
  }
  /**
   * 绑定事件 初始化/数据更新
   * 依赖上层作用域变量 TRACK_CLASSNAME globalMap
   * @param {Element} element
   * @param {object} binding
   */
  const bindingEvent = (element, binding) => {
    const { value, modifiers } = binding
    // 未绑定打点信息
    if (!value) return
    let hasEvent = false
    // 绑定click打点标识类名
    // if ((modifiers.click || modifiers.clickOnce) && (value.click || value.common) && (!value.id || !globalMap.click[value.id])) {
    if (
      (modifiers.click || modifiers.clickOnce) &&
      (value.click || value.common) &&
      (!value.id || !globalMapApi.has('click', value.id, value.cachePath))
    ) {
      element.classList.add(TRACK_CLASSNAME)
      hasEvent = true
    } else {
      element.classList.remove(TRACK_CLASSNAME)
    }
    // view打点绑定
    if (
      (modifiers.view || modifiers.viewOnce) &&
      (value.view || value.common) &&
      (!value.id || !globalMapApi.has('view', value.id, value.cachePath))
    ) {
      // 已绑定跳过
      if (!element.azIntersectionObserver) {
        element.azIntersectionObserver = getIntersectionObserver(value)
        element.azIntersectionObserver.observe(element)
      }
      hasEvent = true
    } else if (element.azIntersectionObserver) {
      element.azIntersectionObserver.unobserve(element)
      delete element.azIntersectionObserver
    }
    if (hasEvent) {
      // 绑定参数
      element[TRACK_CLASSNAME] = binding
    }
  }

  /**
   * 创建监听对象
   * @param {number} threshold (0, 1] 监听阈值
   */
  const createObserver = (threshold = 0.1) => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((item) => {
          if (item.isIntersecting) {
            // const value = item.target.blushMarkTrackObject
            // view: 是否需要view点
            dispatchTrack.view(item.target)
            // 去除单次执行事件
            clearElement(item.target, 'view')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        // 支持自定义曝光比例
        // threshold: value.hasOwnProperty('threshold') ? value.threshold : 0.1
        threshold
      }
    )
    return observer
  }
  // 通用监听变量
  let baseIntersectionObserver
  /**
   * 获取元素监听对象
   * @param {object} options
   */
  const getIntersectionObserver = (options = {}) => {
    if (options.hasOwnProperty('threshold')) {
      // 存在threshold 创建新监听对象
      return createObserver(options.threshold)
    } else {
      // 使用通用变量
      return baseIntersectionObserver || (baseIntersectionObserver = createObserver())
    }
  }

  // 区分 bi 和 ga4Event 打点
  const filterEvent = (value) => {
    const obj = {
      biOptions: [],
      ga4Options: []
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item.event === 'ga4Event') {
          obj.ga4Options.push(item)
        } else {
          obj.biOptions.push(item)
        }
      })
    } else if (value.event === 'ga4Event') {
      obj.ga4Options.push(value)
    } else {
      obj.biOptions.push(value)
    }
    return obj
  }

  // 事件捕获
  // 在点击事件冒泡之前触发
  document.body.addEventListener('click', delegation, true)

  return {
    /**
      el：指令所绑定的元素，可以用来直接操作 DOM。
      binding：一个对象，包含以下 property：
        name：指令名，不包括 v- 前缀。
        value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
        oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
        expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
        arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
        modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
      vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
      oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
      v-track:id.once.end="{ a: 1 }"  => { arg: 'id', modifiers: {once: true, end: true}, value: {a: 1} }
     */
    /**
     *
     * @param {*} element
     * @param {*} { modifiers, arg, value }
     */
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
    bind(element, binding) {
      bindingEvent(element, binding)
    },
    // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
    inserted(element, binding) {},
    // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
    update(element, binding) {},
    // 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
    componentUpdated(element, binding) {
      bindingEvent(element, binding)
    },
    // 只调用一次，指令与元素解绑时调用。
    unbind(element, { modifiers, arg, value }) {
      clearElement(element)
    }
  }
}

export default createTrack
