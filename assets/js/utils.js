/* eslint-disable camelcase */
import { getCookieByString } from './pointUtil'
const seoLanguages = require('../../modules/supportSeoLanguage')
const SecureWebScan = false // 代码扫描 网站安全开关

/**
 * 获取链接 search 参数
 * @param {String} url : 链接
 * @return: Object
 */
export function getUrlQuery(url) {
  const query = {
    page: 1
  }
  if (url.includes('?')) {
    const queryReg = /.*\?(.*)/.exec(url)
    if (queryReg && queryReg.length) {
      const queryStr = queryReg[1]
      if (queryStr) {
        const queryArr = queryStr.split('&')
        queryArr.map((item) => {
          const list = item.split('=')
          query[list[0]] = list[1]
        })
      }
    }
  }
  return query
}

// 链接映射表
const formatUrlList = [
  {
    reg: '(/[a-zA-Z]{2})?/engagement-dresses/?$',
    format: '$1/all/bridesmaid-dresses?earmarkGoodsKey=engagement'
  },
  {
    reg: '(/[a-zA-Z]{2})?/engagement-dresses/(.*)$',
    format: '$1/all/bridesmaid-dresses/$2?earmarkGoodsKey=engagement'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/little-black-dresses(.*)?',
    format: '$1/all/dresses/colors-family/black/with/length/midi,mini/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/white-dresses(.*)?',
    format: '$1/all/dresses/colors-family/white/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/maxi-dresses(.*)?',
    format: '$1/all/dresses/with/length/maxi/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/midi-dresses(.*)?',
    format: '$1/all/dresses/with/length/midi/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/short-dresses(.*)?',
    format: '$1/all/dresses/with/length/midi,mini/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/long-sleeve-dresses(.*)?',
    format: '$1/all/dresses/with/sleeves/long-sleeve/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/halter-dresses(.*)?',
    format: '$1/all/dresses/with/neckline/halter/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/black-dresses(.*)?',
    format: '$1/all/dresses/colors-family/black/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/blue-dresses(.*)?',
    format: '$1/all/dresses/colors-family/blue/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/red-dresses(.*)?',
    format: '$1/all/dresses/colors-family/red/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/pink-dresses(.*)?',
    format: '$1/all/dresses/colors-family/pink/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/green-dresses(.*)?',
    format: '$1/all/dresses/colors-family/green/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/yellow-dresses(.*)?',
    format: '$1/all/dresses/colors-family/yellow/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/grey-dresses(.*)?',
    format: '$1/all/dresses/colors-family/grey/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/all/gold-dresses(.*)?',
    format: '$1/all/dresses/colors-family/gold/$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/dress/([^/]+)-bridesmaid-dresses',
    format: '$1/all/bridesmaid-dresses/colors/$2?is_seo_color=true'
  },
  {
    reg: '/(nbcf)',
    format: '/all/bridesmaid-dresses/colors-family/$1'
  },
  {
    reg: '(/[a-zA-Z]{2})?/theme/([^/]*)/?$',
    format: '$1/all/bridesmaid-dresses?theme=$2'
  },
  {
    reg: '(/[a-zA-Z]{2})?/theme/([^/]*)/(.*)$',
    format: '$1/all/bridesmaid-dresses/with/$3?theme=$2'
  },
  // 详情页转发
  {
    reg: '/products/[^/]*-p([0-9]+)/?$',
    format: '/product?goods_id=$1'
  },
  {
    reg: '/products/(sample|clearance|ready-to-ship)/([0-9]+)/?$',
    format: '/product?dress_type=$1&goods_id=$2'
  },
  {
    reg: '/products/(.*)/(.*)/?$',
    format: '/product?goods_name=$1&goods_style_id=$2'
  },
  // {
  //   reg: '/products/(.*)-bridal-gown/?$',
  //   format: '/product?goods_name=$1-bg'
  // },
  // {
  //   reg: '/products/(.*)-wedding-dress/?$',
  //   format: '/product?goods_name=$1-bg'
  // },
  // {
  //   reg: '/products/(.*)-mother-of-the-bride-dress/?$',
  //   format: '/product?goods_name=$1-mbd'
  // },
  {
    reg: '/products/([0-9]+)/?$',
    format: '/product?goods_id=$1'
  },
  {
    reg: '/products/(.*)/?$',
    format: '/product?goods_name=$1'
  },
  {
    reg: '/products/',
    format: '/product'
  },
  {
    reg: '/[^/]*-g([0-9]+)/?$',
    format: '/product?goods_id=$1'
  },
  // checkout success 获取query
  {
    reg: '/checkout_success/([a-zA-Z]*)/([A-Z0-9]+)',
    format: '/checkouSuccess?action=$1&order_sn=$2'
  },
  // showroom
  {
    reg: '/showroom/(.*)/?$',
    format: '/showroom?showroomId=$1'
  },
  // reviews list 转发
  {
    reg: '/reviews/[^/]*-c([0-9]+)/?$',
    format: '/reviews?cat_id=$1'
  },
  {
    reg: '/reviews/category/(.*)/?$',
    format: '/reviews?cat_name=$1'
  },
  // 评论页转发
  {
    reg: '/reviews/[^/]*-p([0-9]+)/?$',
    format: '/reviews?goods_id=$1'
  },
  {
    reg: '/reviews/(sample|clearance|ready-to-ship)/([0-9]+)/?$',
    format: '/reviews?dress_type=$1&goods_id=$2'
  },
  {
    reg: '/reviews/(.*)/(.*)/?$',
    format: '/reviews?goods_name=$1&goods_style_id=$2'
  },
  // {
  //   reg: '/reviews/(.*)-bridal-gown/?$',
  //   format: '/reviews?goods_name=$1-bg'
  // },
  // {
  //   reg: '/reviews/(.*)-wedding-dress/?$',
  //   format: '/reviews?goods_name=$1-bg'
  // },
  // {
  //   reg: '/reviews/(.*)-mother-of-the-bride-dress/?$',
  //   format: '/reviews?goods_name=$1-mbd'
  // },
  {
    reg: '/reviews/([0-9]+)/?$',
    format: '/reviews?goods_id=$1'
  },
  {
    reg: '/reviews/(.*)/?$',
    format: '/reviews?goods_name=$1'
  },
  // collection
  {
    reg: '/all/collections/(.*)/(.*)/?$',
    format: '/collection?collection_id=$2'
  },
  {
    reg: '/convertible-dress/(.*)/?$',
    format: '/convertible-dress?goods_name=$1'
  },
  // 新版落地页
  {
    reg: '/landing/(.*)/?$',
    format: '/landing?subject=$1'
  }
]

/**
 * 链接映射
 * @param {String} url : 待处理链接
 * @return: String 处理之后的链接
 */
export function urlToFormatUrl(url) {
  let res
  let flag = false
  for (let index = 0, len = formatUrlList.length; index < len; index++) {
    const element = formatUrlList[index]
    const regexp = new RegExp(element.reg)
    if (regexp.test(url)) {
      flag = true
      res = url.replace(regexp, formatUrlList[index].format)
      break
    }
  }
  return !flag ? url : res
}

const needHandleLink = {
  style: {
    // 'simple', 'casual','princess',
    left: ['beach', 'destination', 'modern', 'fairytale', 'traditional', 'sencillo'],
    right: [
      'beach-destination',
      'beach-destination',
      'beach-destination',
      'beach-destination',
      'chic-modern',
      'romantic',
      'romantic',
      'romantic',
      'beach-destination'
    ]
  },
  silhouette: {
    left: ['a-line-princess'],
    right: ['a-line']
  }
}
const needHandleLinkNew = {
  style: {
    // 'simple', 'casual','princess',
    left: ['beach', 'destination', 'modern', 'fairytale', 'traditional', 'sencillo'],
    right: [
      'page_common_style_beach_destination',
      'page_common_style_beach_destination',
      'page_common_style_beach_destination',
      'page_common_style_beach_destination',
      'page_common_style_chic_modern',
      'page_common_style_romantic',
      'page_common_style_romantic',
      'page_common_style_romantic',
      'page_common_style_beach_destination'
    ]
  },
  silhouette: {
    left: ['a-line-princess'],
    right: ['page_common_silhouette_a_line']
  }
}
const needHandleLinkKey = Object.keys(needHandleLink)

/**
 * 从 url 连接中获取 filters 对象参数信息，仅用于初次请求数据
 * @param {String} requestUrl : 链接,去掉了国家多语言路径例如：/es、/fr
 * @param {Object} langs : 多语言对象,列表页才有这个参数
 * @return: Object
 */
export function pathToFilters(requestUrl, _store) {
  const urlPath = requestUrl.startsWith('/collection/all') ? queryUrlToPath(requestUrl, _store) : requestUrl // colletion路径转正常路径
  const url = urlToFormatUrl(urlPath)
  let langs = {}
  if (_store) {
    const glVar = typeof window === 'object' ? window : global
    const langKey = `langs${_store.state.language}`
    langs = glVar[langKey] || {}
    // langs = _store.state.langs
  }

  try {
    // 将url中的path和query区分
    let path
    if (url.includes('?')) {
      path = /(.*)\?.*/.exec(url)
      path && path.length && (path = decodeURIComponent(path[1]))
    } else {
      path = decodeURIComponent(url)
    }
    // 处理 query
    const query = getUrlQuery(url)
    // 单独处理
    // if (path === '/swatches-fabric') {
    //   return {
    //     cat_name: 'swatches-fabric',
    //     dress_type: 'dress',
    //     viewMode: ['petite'],
    //     mkt: '',
    //     filtersObj: {},
    //     query
    //   }
    // }
    // if (path === '/fabrics') {
    //   return {
    //     cat_name: 'fabrics',
    //     dress_type: 'dress',
    //     viewMode: ['petite'],
    //     mkt: '',
    //     filtersObj: {},
    //     query
    //   }
    // }
    // if (path === '/swatches') {
    //   return {
    //     cat_name: 'swatches',
    //     dress_type: 'dress',
    //     viewMode: ['petite'],
    //     mkt: '',
    //     filtersObj: {},
    //     query
    //   }
    // }
    let category = /\/all\/([0-9a-zA-Z-_]+)/.exec(path)
    // 处理 cat_name
    category && category.length && (category = category[1])
    // 单独处理色卡，色卡书以及面料的 category
    if (path === '/swatches-fabric' || path.includes('/swatches-fabric/')) {
      category = 'swatches-fabric'
    } else if (path === '/fabrics' || path.includes('/fabrics/')) {
      category = 'fabrics'
    } else if (path === '/swatches' || path.includes('/swatches/')) {
      category = 'swatches'
    }
    const filtersObj = {}
    // 颜色处理
    if (path.includes('/color')) {
      let colorReg = /\/(color|colors|colors-family)\/([0-9a-zA-Z-_,]*)/g
      // barbie暂时特殊处理，颜色上会带有™
      if (path.includes('/barbie™')) colorReg = /\/(color|colors|colors-family)\/([0-9a-zA-Z-™_,]*)/g
      let colorArray
      const colorExec = []
      while ((colorArray = colorReg.exec(path)) !== null && colorArray.length) {
        colorExec.push(colorArray)
      }
      if (colorExec.length) {
        for (let index = 0, len = colorExec.length; index < len; index++) {
          const element = colorExec[index]
          if (element[1] && element[2]) {
            if (element[1] === 'colors-family') {
              filtersObj[element[1]] = element[2].split(',')
            } else {
              filtersObj[element[1]] = [element[2]]
            }
          }
        }
      }
    }
    // 处理特殊链接 /mkt/free-returns
    let mkt
    if (path.includes('/mkt')) {
      const mktExec = /\/(mkt)\/([a-zA-Z-_,]*)(\/)?/.exec(path)
      if (mktExec && mktExec.length) {
        mkt = mktExec[2]
      }
    }
    // plus-size 处理
    let viewMode
    if (path.includes('/plus-size')) {
      viewMode = ['plus']
    }
    if (query.sod_view) {
      switch (query.sod_view) {
        case 'petite':
          viewMode = ['petite']
          break
        case 'plus':
          viewMode = ['plus']
          break
        case 'petite_plus':
          viewMode = ['petite_plus']
          break
        default:
          viewMode = ['petite']
          break
      }
    }
    // filter 处理
    const filtersExec = /\/with\/(.*)/.exec(path)
    if (filtersExec && filtersExec.length) {
      const filtersPath = filtersExec[1]
      let filtersArray = filtersPath.split('/')
      filtersArray = filtersArray.filter((item) => item != '')
      filtersArray.map((item, index, array) => {
        if (index % 2 === 0) {
          filtersObj[item] = array[index + 1].split(',')
        }
      })
    }
    // 处理 dress_type
    let dress_type = 'dress'
    if (category) {
      if (category.includes('ready-to-ship')) {
        dress_type = 'clearance'
      } else if (category.includes('last-chance-outlet')) {
        dress_type = 'outlet'
      } else if (category.includes('sample')) {
        dress_type = 'sample'
      }
      if (category.includes('ready-to-ship-party')) {
        dress_type = 'dress'
      }
    }
    // 婚纱特殊处理
    if (category === 'wedding-dresses') {
      for (const key in filtersObj) {
        if (filtersObj.hasOwnProperty(key)) {
          if (!needHandleLinkKey.includes(key)) {
            continue
          } else {
            const element = filtersObj[key]
            for (let index = 0, len = element.length; index < len; index++) {
              if (needHandleLink[key].left.includes(element[index]) || needHandleLinkNew[key].left.includes(element[index])) {
                // 判断是否从 /brides页面过来的，执行多语言脚本
                if (url.includes('from_style_quiz=1')) {
                  element[index] = langs[needHandleLinkNew[key].right[needHandleLinkNew[key].left.indexOf(element[index])]]
                } else {
                  element[index] = needHandleLink[key].right[needHandleLink[key].left.indexOf(element[index])]
                }
              }
            }
            filtersObj[key] = [...new Set(element)]
          }
        }
      }
    }
    // outlet 特殊处理
    if (category && category.includes('last-chance-outlet')) {
      return {
        is_outlet: 1,
        cat_name: category,
        dress_type,
        viewMode,
        mkt,
        filtersObj,
        query
      }
    }
    // comments: 16479 希望sod指向events-dresses 后端工作量大，希望从前端源头做映射处理
    // 21420 21841
    if (['special-occasion-dresses', 'atelier-special-occasion-dresses'].includes(category)) {
      category = 'events-dresses'
    }
    return {
      cat_name: category,
      dress_type,
      viewMode,
      mkt,
      filtersObj,
      query
    }
  } catch (error) {
    return {
      error,
      category: '',
      dress_type: '',
      viewMode: ['petite'],
      mkt: '',
      filtersObj: {},
      query: {}
    }
  }
}

export function getUrlQueryNoPage(url) {
  const query = {}
  if (url.includes('?')) {
    const queryReg = /.*\?(.*)/.exec(url)
    if (queryReg && queryReg.length) {
      const queryStr = queryReg[1]
      if (queryStr) {
        const queryArr = queryStr.split('&')
        queryArr.map((item) => {
          const list = item.split('=')
          query[list[0]] = list[1]
        })
      }
    }
  }
  return query
}

// 没有page query的formatUrl
export function otherPageUrlToFormatUrl(url) {
  // 将url中的path和query区分
  let path
  if (url.includes('?')) {
    path = /(.*)\?.*/.exec(url)
    path && path.length && (path = path[1])
  } else {
    path = url
  }
  // 处理 query
  let query = getUrlQueryNoPage(url)
  path = urlToFormatUrl(path)
  query = { ...query, ...getUrlQueryNoPage(path) }
  return query
}

// 防抖函数
let timeout = null
export function debounce(fn, wait) {
  if (timeout !== null) clearTimeout(timeout)
  timeout = setTimeout(fn, wait)
}

// styleGallery url入参处理
// 有两种情况，filter和GalleryId,并且两种情况不并存，所以先判断是否是filter，如果没有任何一个filter，再判断是否有请求GalleryId
export function styleGalleryPathToFilters(urlPath) {
  const url = urlToFormatUrl(urlPath)
  try {
    // 将url中的path和query区分
    let path
    if (url.includes('?')) {
      path = /(.*)\?.*/.exec(url)
      path && path.length && (path = path[1])
    } else {
      path = url
    }
    // 处理 query
    let query = getUrlQuery(url)
    // 处理 filter
    const filtersObj = {}
    const pathQueryObj = {
      category: {
        key: 'category',
        reg: /\/(category)\/([0-9a-zA-Z-_,]*)/g
      },
      colors: {
        key: 'colors',
        reg: /\/(colors)\/([0-9a-zA-Z-_,]*)/g
      },
      length: {
        key: 'length',
        reg: /\/(length)\/(.*)/g
      },
      neckline: {
        key: 'neckline',
        reg: /\/(neckline)\/(.*)/g
      }
    }
    let isQueryGalleryId = true
    let isTermsOfUse = false
    let isAgreement = false
    for (const itemKey in pathQueryObj) {
      if (path.includes(`/${itemKey}`)) {
        isQueryGalleryId = false
        let keyArray
        const keyExec = []
        const keyReg = pathQueryObj[itemKey].reg
        while ((keyArray = keyReg.exec(path)) !== null && keyArray.length) {
          keyExec.push(keyArray)
        }
        if (keyExec.length) {
          for (let index = 0, len = keyExec.length; index < len; index++) {
            const element = keyExec[index]
            if (element[1] && element[2]) {
              filtersObj[element[1]] = [element[2]]
            }
          }
        }
      }
    }
    if (path.includes(`terms-of-use`)) {
      isQueryGalleryId = false
      isTermsOfUse = true
    }
    if (path.includes(`gallery-agreement`)) {
      isQueryGalleryId = false
      isAgreement = true
    }
    if (isQueryGalleryId) {
      const element = {
        reg: '/style-gallery/(.*)/?$',
        format: '/style-gallery?gallery_id=$1'
      }
      const regexp = new RegExp(element.reg)
      if (regexp.test(url)) {
        const res = url.replace(regexp, element.format)
        query = { ...query, ...getUrlQueryNoPage(res) }
      }
    }
    return {
      filtersObj,
      query,
      isTermsOfUse,
      isAgreement
    }
  } catch (error) {
    return {
      error
    }
  }
}

// list 打点，获取当前的category 当前路径中 /all/之后的内容 同m端catBiName字段
export function listPoint(path) {
  const index = path.indexOf('/all/') + 5
  const endIndex = path.indexOf('/', index)
  const category = path.slice(index, endIndex != -1 ? endIndex : path.length)
  return category
}

export const createThrottle = function(callback) {
  let scheduledResize
  return function(...args) {
    const that = this
    if (scheduledResize) return
    if (typeof requestAnimationFrame === 'function') {
      scheduledResize = true
      requestAnimationFrame(() => {
        callback.apply(that, args)
        scheduledResize = undefined
      })
    } else {
      scheduledResize = setTimeout(() => {
        callback.apply(that, args)
        scheduledResize = undefined
      }, 17)
    }
  }
}

/**
 * 判断元素是否在页面可视区域内
 * @param {*} el 元素
 * @returns boolean true 在 false 不在
 */
export function isElementInViewport(el) {
  if (el) {
    const rect = el.getBoundingClientRect()
    return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0
  }
  return false
}

/**
 * 根据站点路径url>cookie>ip>业务需求的国家优先级>siteOptions>US 获取国家和语言
 * @param {*} context 请求上下文，包含heanders,countrycode等信息
 * @param {*} country 业务逻辑中已经确认的国家数据，一般默认会是US
 * @returns country 国家code，例如：US、AU
 */
export function handleReqHeaderCountry(context, country) {
  let currentCountry = country // 当前国家
  const siteOptions = (context.store && context.store.state.siteOptions) || [] // 配置的国家列表
  if (context.req && context.req.headers) {
    const host = context.req.headers['x-original-host'] || context.req.headers.host
    const requestUrl = context.req.headers['x-original-uri'] || context.req.originalUrl
    const query = getQueryString(requestUrl)
    const urlCountry = query.country // 直接从query中拿到Country字段，nuxt中的context.query是context.route.query的别名
    const headerCookieCountryCode = context.req.headers.cookie && getCookieByString('CountryCode', context.req.headers.cookie)
    const headersCountryCode = context.req.headers.countrycode // 获取请求headers中的countrycode，这是根据访问ip确定的国家
    const adCountry = query.campaigncountry // 获取url路径中的特殊字段，此字段用在google广告投放关联路径中，如果有此字段，符合配置国家范围条件后，直接进入对应路径页面

    // 根据站点路径获取国家和语言：站点路径url>cookie>ip>业务需求的国家优先级>siteOptions
    // 优先级：
    // 1.判断url是否带国家语言参数,在满足此情况下走下面23456
    // 'es-us’,'en-de' 代表语言和国家
    // 'es','nl','de' 代表语言,国家根据url、cookie、ip
    // 'fr', 'gb', 'au', 'ie',  'it', , 'dk', 'se', 'fi' 代表国家
    // 2.判断cookie中的CountryCode
    // 3.如果请求头cookie中没有CountryCode，使用ip
    // 4.按业务需求的国家优先级
    // 5.根据国家站点列表siteOptions的优先级
    // 6.最后兜底US

    const currentSeoLanguages = seoLanguages.filter(
      (item) => requestUrl == `/${item}` || requestUrl.startsWith(`/${item}?`) || requestUrl.startsWith(`/${item}/`)
    )
    // 1.判断url是否带国家语言参数
    if (currentSeoLanguages.length) {
      const siteParam = currentSeoLanguages[0].substring(0, 2) // 这里现在会有 'es-us'、'en-de' 这种情况,所以需要截取前2位数,前2位是国家或者语言

      let currentCountryList = [] // 支持url链接中的国家或语言的国家
      let currentCountryCodeList = [] // 支持url链接中的国家或语言的国家Code

      if (host.includes('.ca') && siteParam == 'fr') {
        // CA 支持法语
        context.store && context.store.commit('setLanguage', siteParam)
        return 'CA'
      } else if (currentSeoLanguages[0].includes('-')) {
        // 从链接上获取国家和语言  'es-us'、'en-de'
        context.store && context.store.commit('setLanguage', siteParam)
        if (siteOptions && Array.isArray(siteOptions)) {
          currentCountryList = siteOptions.filter((item) => item.countryCode == currentSeoLanguages[0].split('-')[1].toUpperCase())
        }
      } else if (['es', 'nl', 'de'].includes(siteParam)) {
        // 从链接上获取语言
        context.store && context.store.commit('setLanguage', siteParam)
        // 如果路径上没有国家参数,则取获取匹配语言的国家
        if (!urlCountry && siteOptions && Array.isArray(siteOptions)) {
          currentCountryList = siteOptions.filter((item) => item.language == siteParam)
        }
      } else {
        // 从链接上获取国家
        // eslint-disable-next-line
        if (siteOptions && Array.isArray(siteOptions)) {
          currentCountryList = siteOptions.filter((item) => item.countryCode == siteParam.toUpperCase())
        }
      }

      if (currentCountryList.length) {
        currentCountryCodeList = currentCountryList.map((item) => {
          return item.countryCode
        })
      }

      if (urlCountry) {
        // 选择国家参数
        currentCountry = urlCountry
      } else if (headerCookieCountryCode) {
        // 路径中没有国家标识，但是cookie中的CountryCode还在
        currentCountry = headerCookieCountryCode
      } else if (headersCountryCode) {
        // 如果请求头cookie中没有CountryCode，说明是初次进入，或者本地cookie已经清除,使用ip
        if (context.store) {
          context.store.commit('setReqHeaders', context.req.headers)
        }
        currentCountry = headersCountryCode
      }

      // 如果获取到的国家支持这个路径参数，则返回这个国家
      if (currentCountryCodeList.includes(currentCountry)) {
        return currentCountry
      } else if (currentCountryCodeList.length) {
        let currentCountry = ''
        for (const i in currentCountryCodeList) {
          const item = currentCountryCodeList[i]
          if (['ES', 'NL', 'DE'].includes(item)) {
            // 这几个国家，如果路径上没有国家参数，则直接认为是这个国家，不然进 siteOptions 匹配到的第一个国家
            currentCountry = item
            break
          }
        }

        return currentCountry || currentCountryCodeList[0]
      } else {
        return currentCountry
      }
    }

    if (host.includes('.ca')) {
      // 处理CA 因为国家现在和语言唯一绑定，所以根据host定国家
      currentCountry = 'CA'
    } else if (adCountry) {
      // 广告路径
      currentCountry = adCountry
    } else if (urlCountry) {
      // 选择国家参数
      currentCountry = urlCountry
    } else if (headerCookieCountryCode) {
      // 路径中没有国家标识，但是cookie中的CountryCode还在
      currentCountry = headerCookieCountryCode
    } else if (headersCountryCode) {
      // 如果请求头cookie中没有CountryCode，说明是初次进入，或者本地cookie已经清除,使用ip
      currentCountry = headersCountryCode
    }
  } else {
    currentCountry = context.store && context.store.state.country
  }
  let hasSupport = false //  是否是支持的国家
  if (siteOptions.length && currentCountry) {
    hasSupport = siteOptions.some((ele) => {
      return ele.countryCode === currentCountry
    })
  }

  if (hasSupport) {
    return currentCountry
  } else {
    return 'US' // 不是支持的国家，默认US
  }
}

/**
 * 用于缓存中判断当前国家
 * @param {*} context 上下文
 * @param {*} country 传入的国家
 * 注意点：是否是支持的国家，在nuxt-ssr-cache,判断是否进行缓存。如果没有获取到国家，则不进行缓存，不能默认US，污染US缓存数据
 */
export function handleCacheCountry(context) {
  let currentCountry = ''
  if (context.req && context.req.headers) {
    const host = context.req.headers['x-original-host'] || context.req.headers.host || context.req.hostname || context.req.host

    const requestUrl = context.req.headers['x-original-uri'] || context.req.originalUrl
    const query = getQueryString(requestUrl)
    const urlCountry = query.country // 直接从query中拿到Country字段，nuxt中的context.query是context.route.query的别名
    const headerCookieCountryCode = context.req.headers.cookie && getCookieByString('CountryCode', context.req.headers.cookie)
    const headersCountryCode = context.req.headers.countrycode // 获取请求headers中的countrycode，这是根据访问ip确定的国家

    // 根据站点路径获取国家和语言：站点路径url>cookie>ip>业务需求的国家优先级>siteOptions>US
    // 优先级：
    // 1.判断url是否带国家语言参数,在满足此情况下走下面23456
    // 'es-us’,'en-de' 代表语言和国家
    // 'es','nl','de' 代表语言,国家根据url、cookie、ip
    // 'fr', 'gb', 'au', 'ie',  'it', , 'dk', 'se', 'fi' 代表国家
    // 2.判断cookie中的CountryCode
    // 3.如果请求头cookie中没有CountryCode，使用ip
    // 4.按业务需求的国家优先级
    // 5.根据国家站点列表siteOptions的优先级

    const currentSeoLanguages = seoLanguages.filter(
      (item) => requestUrl == `/${item}` || requestUrl.startsWith(`/${item}?`) || requestUrl.startsWith(`/${item}/`)
    )

    // 1.判断url是否带国家语言参数
    if (currentSeoLanguages.length) {
      const siteParam = currentSeoLanguages[0]

      // CA 支持法语
      if (host.includes('.ca') && siteParam == 'fr') {
        return 'CA'
      }

      let currentCountryCodeList = [] // 支持url链接中的国家或语言的国家Code
      currentCountryCodeList = getCurrentCountryList(siteParam)
      if (urlCountry) {
        // 选择国家参数
        currentCountry = urlCountry
      } else if (headerCookieCountryCode) {
        // 路径中没有国家标识，但是cookie中的CountryCode还在
        currentCountry = headerCookieCountryCode
      } else if (headersCountryCode) {
        // 如果请求头cookie中没有CountryCode，说明是初次进入，或者本地cookie已经清除,使用ip
        currentCountry = headersCountryCode
      }

      // 如果获取到的国家支持这个语言，则返回这个国家
      if (currentCountryCodeList.includes(currentCountry)) {
        return currentCountry
      } else if (currentCountryCodeList.length) {
        // 其他情况，进 siteOptions 匹配到的第一个国家
        const currentCountry = currentCountryCodeList[0]
        return currentCountry
      }
    }

    if (host.includes('.ca')) {
      // 处理CA 因为国家现在和语言唯一绑定，所以根据host定国家
      currentCountry = 'CA'
    } else if (urlCountry) {
      // 选择国家参数
      currentCountry = urlCountry
    } else if (headerCookieCountryCode) {
      // 路径中没有国家标识，但是cookie中的CountryCode还在
      currentCountry = headerCookieCountryCode
    } else if (headersCountryCode) {
      // 如果请求头cookie中没有CountryCode，说明是初次进入，或者本地cookie已经清除,使用ip
      currentCountry = headersCountryCode
    }
  }

  return currentCountry
}

/**
 * 获取url路径中的query数据，并将数据以对象形式返回
 * 返回示例：{a:1,b:2}
 * @param {*} url 路径
 * @returns object
 */
export function getQueryString(url = '') {
  const obg = {}
  let a = ''
  a = url.split('?')[1]
  if (a) {
    a.split(/&/g).forEach(function(item) {
      obg[(item = item.split('='))[0]] = item[1]
    })
  }
  return obg
}

/**
 * 模糊搜索
 * @param {*} list 数组
 * @param {*} keyWord 关键字
 * @param {*} matchKey 要匹配搜索的key,默认 name
 * @returns
 */
export function getArrayByName(list, keyWord, matchKey = 'name') {
  const arr = []
  try {
    // 因为这个keyWord又可能是用户输入的，比如在AzSelect组件中的用法，keyWord如果是以/或者[等字符结尾的时候会报语法错误，所以需要try catch一下
    const reg = new RegExp(keyWord, 'i')
    for (let i = 0; i < list.length; i++) {
      if (reg.test(list[i][matchKey])) {
        arr.push(list[i])
      }
    }
  } catch (error) {
    console.log(error)
  }
  return arr
}

// 获取设备id
export function generateDeviceId() {
  const nav = window.navigator
  const screen = window.screen
  let deviceId = nav.mimeTypes.length
  Object.values(navigator.mimeTypes).forEach((p) => (deviceId += p.type))
  deviceId += nav.userAgent.replace(/\D+/g, '') // Only use digits
  deviceId += nav.plugins.length
  Object.values(navigator.plugins).forEach((p) => (deviceId += p.filename))
  deviceId += screen.height || ''
  deviceId += screen.width || ''
  deviceId += screen.pixelDepth || ''
  return checksum(deviceId)
}

export function checksum(s) {
  let hash = 0
  const strlen = s.length
  let i
  let c
  if (strlen === 0) {
    return hash
  }
  for (i = 0; i < strlen; i++) {
    c = s.charCodeAt(i)
    hash = (hash << 5) - hash + c
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// gtm 打点代码
export function addGTM(headJson, country) {
  // 新增 2022ads 打点  id =>> GTM-M8LK9RD
  const gtmIds = ['GTM-M8LK9RD']
  gtmIds.forEach((id, index) => {
    const countryPush = !index ? `w[l].push({'country_code': '${country}'});` : '' // ga4 在GTM容器代码执行前执行 传递网站当前国家站点
    const gtm = `(function (w, d, s, l, i) {
      if (!window.is_chrome_lighthouse) {
        w[l] = w[l] || [];
        ${countryPush}
        w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      }
    })(window, document, 'script', 'dataLayer', '${id}');`
    headJson.script.push({ innerHTML: gtm, hid: 'gtm' })
    headJson.__dangerouslyDisableSanitizersByTagID.gtm = ['innerHTML']
    const frame = `<iframe src="//www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
    headJson.noscript.push({ innerHTML: frame, hid: 'gtmNoScript' })
    headJson.__dangerouslyDisableSanitizersByTagID.gtmNoScript = ['innerHTML']
  })
}

/**
 * 替换url的指定参数
 * @param {*} url 需要替换的url
 * @param {*} name 参数名称
 * @param {*} value 替换的值
 */
export function replaceQueryString(url, name, value) {
  const re = new RegExp(name + '=[^&]*', 'gi')
  return url.replace(re, name + '=' + value)
}

/**
 * 转换时间格式 例如 2022-11-01 ===》  Nov 01 2022
 * @param {*} data 需要转换格式的时间，格式是2022-11-01
 * @param {*} country 国家code
 */
export function dateFormatFn(data, country = '') {
  let dateFor = ''
  if (data) {
    country = country.toLowerCase()
    // 下面的数组新增语言的时候，从node包中vue2-datepicker 拷贝
    let monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if (country === 'fr') {
      monthArray = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
    } else if (country === 'es') {
      monthArray = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    } else if (country === 'de') {
      monthArray = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    } else if (country === 'it') {
      monthArray = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
    } else if (country === 'se') {
      monthArray = ['jan', 'feb', 'mars', 'apr', 'maj', 'jun', 'jul', 'aug', 'sept', 'okt', 'nov', 'dec']
    }
    const dateF = data.split('-')
    if (country === 'de') {
      dateFor = dateF[2] + '. ' + monthArray[dateF[1] - 1] + '. ' + dateF[0]
    } else {
      dateFor = monthArray[dateF[1] - 1] + '. ' + dateF[2] + ', ' + dateF[0]
    }
  }
  return dateFor
}

export function dateFormatForWeddingDate(date, country, lang) {
  let monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (lang === 'fr') {
    // monthArray = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
    monthArray = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  } else if (lang === 'es') {
    monthArray = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  } else if (lang === 'de') {
    monthArray = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  } else if (lang === 'it') {
    monthArray = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
  } else if (country === 'se') {
    monthArray = ['jan', 'feb', 'mars', 'apr', 'maj', 'jun', 'jul', 'aug', 'sept', 'okt', 'nov', 'dec']
  }
  const dateF = date.split('-')
  switch (country) {
    case 'US':
    case 'CA':
      return monthArray[dateF[1] - 1] + '. ' + dateF[2] + ', ' + dateF[0]
    case 'GB':
    case 'AU':
      return `${dateF[2]}/${dateF[1]}/${dateF[0]}`
    case 'FR':
      return dateF[2] + ' ' + monthArray[dateF[1] - 1] + ' ' + dateF[0]
    case 'DE':
      return dateF[2] + '. ' + monthArray[dateF[1] - 1] + '. ' + dateF[0]
    case 'MX':
      return Number(dateF[2]) + ' ' + monthArray[dateF[1] - 1] + '. ' + dateF[0]
    case 'IE':
      return monthArray[dateF[1] - 1] + ' ' + Number(dateF[2]) + ' ' + dateF[0]
    default:
      return monthArray[dateF[1] - 1] + '. ' + dateF[2] + ', ' + dateF[0]
  }
}

/**
 * 删除URL中指定search参数,会将参数值一起删除
 * @param {string} url 地址字符串
 * @param {array} aParam 要删除的参数key数组，如['name','age']
 * @return {string} 返回新URL字符串
 */
export function ridUrlParam(url, aParam) {
  aParam.forEach((item) => {
    const fromindex = url.indexOf(`${item}=`) // 必须加=号，避免参数值中包含item字符串
    if (fromindex !== -1) {
      // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
      const startIndex = url.indexOf('=', fromindex)
      const endIndex = url.indexOf('&', fromindex)
      const hashIndex = url.indexOf('#', fromindex)

      let reg
      if (endIndex !== -1) {
        // 后面还有search参数的情况
        const num = endIndex - startIndex
        reg = new RegExp(`${item}=.{${num}}`)
        url = url.replace(reg, '')
      } else if (hashIndex !== -1) {
        // 有hash参数的情况
        const num = hashIndex - startIndex - 1
        reg = new RegExp(`&?${item}=.{${num}}`)
        url = url.replace(reg, '')
      } else {
        // search参数在最后或只有一个参数的情况
        reg = new RegExp(`&?${item}=.+`)
        url = url.replace(reg, '')
      }
    }
  })
  const searchParam = new URL(url).search
  if (!searchParam) {
    // 如果已经没有参数，删除？号
    url = url.replace(/\?/, '')
  }
  return url
}

// 字符串首字母转大写
export function strToUpper(str = '') {
  let temp = []
  str = str.toLowerCase()
  temp = str.split(' ')
  for (let i = 0; i < temp.length; i++) {
    let strTemp = temp[i].charAt(0)
    strTemp = strTemp.toUpperCase()
    temp[i] = temp[i].replace(temp[i].charAt(0), strTemp)
  }
  str = temp.join(' ')
  return str
}

// comments: 根据国家设置域名后缀是 ca 还是 com
export function getMainDomain(country) {
  if (!country) {
    return 'https://www.azazie.com'
  }
  return country.toUpperCase() == 'CA' ? 'https://www.azazie.ca' : 'https://www.azazie.com'
}

/**
 * 移除路径上指定参数
 * @param {*} url 路径
 * @param {*} parameter 需要删除的参数
 * @returns
 */
export function removeURLParameter(url, parameter) {
  const urlparts = url.split('?')
  if (urlparts.length >= 2) {
    // 参数名前缀
    const prefix = encodeURIComponent(parameter) + '='
    const pars = urlparts[1].split(/[&;]/g)

    // 循环查找匹配参数
    for (let i = pars.length; i-- > 0; ) {
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        // 存在则删除
        pars.splice(i, 1)
      }
    }

    return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '')
  }
  return url
}
/**
 * 移除路径上指定参数
 * @param {*} url 路径
 * @param {*} parameters 需要删除的参数，数组格式
 * @returns
 */
export function removeURLParameters(url, parameters = []) {
  const urlparts = url.split('?')
  if (urlparts.length >= 2) {
    const pars = urlparts[1].split(/[&;]/g)

    // 循环查找匹配参数
    for (let i = pars.length; i-- > 0; ) {
      for (let j = 0; j < parameters.length; j++) {
        if (pars[i].lastIndexOf(parameters[j], 0) !== -1) {
          // 存在则删除
          pars.splice(i, 1)
          break
        }
      }
    }

    return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '')
  }
  return url
}
/**
 *路径上拼接指定参数
 * @param {*} url
 * @param {*} key
 * @param {*} value
 * @returns
 */
export function getNewQueryUrl(url, key, value) {
  let tempUrl = url
  // 直接判断是否包含key，会存在langdingpage,page这种包含问题
  if (url.includes('?' + key) || url.includes('&' + key)) {
    return tempUrl
  }
  if (/\?/g.test(url)) {
    tempUrl = tempUrl + '&' + key + '=' + value
  } else {
    tempUrl = tempUrl + '?' + key + '=' + value
  }
  return tempUrl
}

/**
 * 移除路径上所有参数
 * @param {*} url
 * @returns
 */
export function removeAllUrlParamter(url) {
  if (!SecureWebScan) {
    return url
  }
  if (url && url.includes('?')) {
    return url.replace(/(\?|#)[^'"]*/, '')
  }
  return url
}

/**
 * 判断异常路径
 * @param {*} url
 * @returns
 *
 */
export function isExcludeUrl(url) {
  if (!SecureWebScan) {
    return false
  }
  const tempUrl = decodeURIComponent(url)
  // sod色值会有#的情况、男配size会有"情况
  // eslint-disable-next-line
  const reg = /[(\~)(\!)(\$)(\^)(\*)(\()(\))(\||)(\+)(\[)(\])(\{)(\})(\|)(\;)(\')(\<)(\>)]+/
  if (reg.test(tempUrl) || tempUrl.includes('example.com')) {
    return true
  }
  return false
}
/**
 *
 * @param {String} base64Url 必传
 * @returns blob 对象
 */
export function urlToBlob(base64Url) {
  const BASE64_MARKER = ';base64,'
  if (!base64Url.includes(BASE64_MARKER)) {
    const parts = base64Url.split(',')
    const contentType = parts[0].split(':')[1]
    const raw = decodeURIComponent(parts[1])
    return new Blob([raw], { type: contentType })
  }
  const parts = base64Url.split(BASE64_MARKER)
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

/**
 * @param {blob} theBlob 必传
 * @param {String} fileName 必传
 * @param {Object} contentType // 可选
 * @returns file 对象
 */
export function blobToFile(theBlob, fileName, contentType = 'image/png') {
  theBlob.lastModified = new Date().getTime()
  theBlob.webkitRelativePath = ''
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  // new RegExp(/[^\.]\w*$/).exec(str)
  return new File([theBlob], fileName, { type: contentType })
}

/**
 *
 * @param {*} url 原路径地址
 * @param {*} arg 需要新增或者更新的参数
 * @param {*} argVal 需要新增或者更新的参数对应的值
 * @returns
 */
export function setUrlParam(url, arg, argVal) {
  const evil = function(fn) {
    const Fn = Function
    return new Fn('return ' + fn)()
  }
  const pattern = arg + '=([^&]*)'
  const replaceText = arg + '=' + argVal
  if (url.match(pattern)) {
    let tmp = '/(' + arg + '=)([^&]*)/gi'
    tmp = url.replace(evil(tmp), replaceText)
    return tmp
  } else {
    const baseUrl = url.split('#')
    if (url.match('[?]')) {
      url = baseUrl[0] + '&' + replaceText
    } else {
      url = baseUrl[0] + '?' + replaceText
    }
    return url + (baseUrl[1] ? baseUrl[1] : '')
  }
}

/**
 * 动态加载js
 * @param {*} url
 * @param {*} id
 * @param {*} callback
 */
export function loadScript(url, id, callback) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  if (script.readyState) {
    // IE
    script.onreadystatechange = function() {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    // Others
    script.onload = function() {
      callback()
    }
  }
  script.src = url
  script.defer = true
  if (id) script.id = id
  document.getElementsByTagName('head')[0].appendChild(script)
}

/**
 * 倒计时 获取时分秒
 * @param {*} remainTime 剩余时间s
 * @returns
 */
export function countdownFormat(remainTime) {
  const oneDayTime = 24 * 60 * 60
  const oneHourTime = 60 * 60
  const day = Math.floor(remainTime / oneDayTime)
  const dayRemainTime = remainTime % oneDayTime
  const hour = Math.floor(dayRemainTime / oneHourTime)
  const hourRemainTime = dayRemainTime % oneHourTime
  const minute = Math.floor(hourRemainTime / 60)
  const second = hourRemainTime % 60
  return {
    day,
    hour: hour < 10 ? `0${hour}` : hour,
    minute: minute < 10 ? `0${minute}` : minute,
    second: second < 10 ? `0${second}` : second
  }
}
// sod大码链接替换
export function sodRequestUrl(url) {
  if (url.split('?')[0] == '/all/special-occasion-plus-size-dresses' && url.includes('/all/special-occasion-plus-size-dresses')) {
    url = '/all/special-occasion-dresses/with/size/1x,2x,3x'
  }
  if (url.split('?')[0] == '/all/guest-of-wedding-dresses/plus-size' && url.includes('/all/guest-of-wedding-dresses/plus-size')) {
    url = '/all/guest-of-wedding-dresses/with/size/1x,2x,3x'
  }
  return url
}

export function swatchMoreColor(colors, categoryColor = {}) {
  const colorObj = {
    bd: {},
    mob: {}
  }
  for (const key in colors) {
    const color = colors[key]
    if (categoryColor['7'] && categoryColor['7'].includes(key)) {
      colorObj.bd[key] = { ...color, aliasStyleId: 'bd-' + color.styleId }
    }
    if (categoryColor['8'] && categoryColor['8'].includes(key)) {
      colorObj.mob[key] = { ...color, aliasStyleId: 'mob-' + color.styleId }
    }
  }

  return colorObj
}

/**
 * AZWEB-21154 /collection/all 以列表页形式实现集合
 * from: /collection/all?filter=collection-bridesmaid-dresses/with/length/knee-length&sort_by=new_arrival&page=1
 * to: /all/collection-bridesmaid-dresses/with/length/knee-length&sort_by=new_arrival&page=1
 * @param {*} url
 * @param {*} isObject 是否返回对象
 * @param {*} tempQuery
 * @returns
 *
 */
export function queryUrlToPath(url, _store, isObject = false) {
  const filterUrl = getUrlQueryNoPage(url).filter
  let pathUrl = decodeURIComponent(filterUrl) // filter 参数collection-bridesmaid-dresses/with/length/knee-length
  if (!filterUrl) pathUrl = 'collection'
  const query = getUrlQueryNoPage(url)
  delete query.filter // 其他参数例如： {sort_by:'new_arrival',page:1}
  if (isObject) {
    return {
      path: _store.state.currentCountryUrl + '/all/' + pathUrl, // filter 参数collection-bridesmaid-dresses/with/length/knee-length
      query // 其他参数例如： {sort_by:'new_arrival',page:1}
    }
  } else {
    pathUrl = objectUrlToStringUrl(pathUrl, query) // 对象路径转字符串路径:query参数拼接到路径
    pathUrl = _store.state.currentCountryUrl + '/all/' + pathUrl // 其他参数拼接到路径
  }

  return pathUrl
}

/**
 * AZWEB-21154 /collection/all 以列表页形式实现集合
 * 链接跳转的时候，把path 处理车成query格式
 * from: /collection/all?filter=collection-bridesmaid-dresses/with/length/knee-length&sort_by=new_arrival&page=1
 * to: /all/collection-bridesmaid-dresses/with/length/knee-length&sort_by=new_arrival&page=1
 * @param {*} url
 * @returns
 */
export function pathToQueryUrl(url, _store) {
  let tempUrl = url.replace(_store.state.currentCountryUrl, '') // 去掉url路径上的国家，作为filter参数
  const category = /\/all\/([0-9a-zA-Z-_]+)/.exec(url)[1]
  tempUrl = tempUrl.replace('/all/' + category, category) // 去掉/all/
  const pathUrl = _store.state.currentCountryUrl + '/collection/all?filter=' + tempUrl
  return pathUrl
}

/**
 * 对象路径转字符串路径:query参数拼接到路径
 * from: {path:'/all/collection-bridesmaid-dresses/with/length/knee-length',query:{sort_by:'new_arrival',page:1}}
 * to: /all/collection-bridesmaid-dresses/with/length/knee-length?sort_by=new_arrival
 * @param {*} path
 * @param {*} query
 * @returns
 */
export function objectUrlToStringUrl(path, query) {
  let pathUrl = path
  if (Object.keys(query).length) {
    for (const key in query) {
      // filter 之外的参数，例如 page、sort_by & 拼接
      pathUrl = getNewQueryUrl(pathUrl, key, query[key])
    }
  }
  return pathUrl
}

/**
 *  国家和语言 ==> 路径
 * @param {*} country
 * @param {*} language
 */
export function getCurrentCountryUrl(country, language = '') {
  let currentCountryUrl = ''
  const countryMap = {
    US_ES: 'es-us',
    DE_EN: 'en-de',
    CA_FR: 'fr',
    FR: 'fr',
    GB: 'gb',
    AU: 'au',
    IE: 'ie',
    DE: 'de',
    AT: 'de',
    MX: 'es',
    ES: 'es',
    IT: 'it',
    NL: 'nl',
    BE: 'nl',
    // DK: 'dk',
    SE: 'se'
    // FI: 'fi'
  }
  if (['US', 'DE', 'CA'].includes(country) && language && countryMap[`${country}_${language.toUpperCase()}`]) {
    currentCountryUrl = `/${countryMap[`${country}_${language.toUpperCase()}`]}`
  } else if (countryMap[country]) {
    currentCountryUrl = `/${countryMap[country]}`
  }

  return currentCountryUrl
}

/**
 * 路径(国家和语言) ===> 国家
 * @param {*} countryUrl
 */
export function getCurrentCountryList(countryUrl) {
  const countryMap = {
    'es-us': ['US'],
    'en-de': ['DE'],
    fr: ['FR'],
    gb: ['GB'],
    au: ['AU'],
    ie: ['IE'],
    de: ['DE', 'AT'], // AT=>奥地利
    es: ['MX', 'ES'],
    it: ['IT'],
    nl: ['NL', 'BE'],
    // dk: ['DK'],
    se: ['SE'] // 瑞典
    // fi: ['FI']
  }
  return countryMap[countryUrl]
}

/**
 * 切换国家和语言时，获取对应国家的跳转链接
 */
export function getCountryRedirectUrl(requestUrl, country, language = '') {
  let redirectUrl = requestUrl // 是否国家语言拼接路径
  if (getCurrentCountryUrl(country, language)) {
    redirectUrl = `${getCurrentCountryUrl(country, language)}${redirectUrl}`
  }
  // 中间件去国家站参数：country和currency 参数拼接
  redirectUrl = removeURLParameter(redirectUrl, 'currency')
  if (!['MX', 'BE', 'AT'].includes(country)) {
    redirectUrl = removeURLParameter(redirectUrl, 'country')
  }
  return redirectUrl
}
