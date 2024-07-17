/**
 * 项目中在多个地方可共用的公共方法合集
 * 并且该方法没有较明显的工具方法特性
 * 符合条件，可抽离到此文件中
 */

/**
 * 获取可用referrer
 */
export function getReferrer() {
  let referrer = document.referrer
  // 可能存在undefined情况，置空，避免语法报错
  // 从google搜索直接进入，referrer会是google.com，非azazie的都置为空
  if (typeof referrer == 'undefined' || !referrer.includes('.azazie.')) {
    referrer = ''
  }
  return referrer
}

/**
 * 根据当前url路径确认对应的tag，然后加到
 * 场景分析：
 * 1.进入商品详情页加购或购买，需要在目标路径上加上tag
 * 2.列表页快速加购，直接根据当前页面url确定tag
 * @param {string} url 当前页面路径的path
 * @param {string} query 当前页面路径的query参数
 * @param {boolean} isAddHandle 是否是执行的点击操作
 * @param {string} defaultTag 默认tag，用到的场景比较少，目前仅搜索弹框商品用到
 */
const specifyList = [
  { route: '/all/guest-of-wedding-dresses', tag: 'wedding_guest_dresses' },
  { route: '/all/events-dresses', tag: 'events_dresses' },
  { route: '/all/party-dresses', tag: 'party_dresses' },
  { route: '/all/cocktail-dresses', tag: 'cocktail_dresses' },
  { route: '/all/formal-dresses', tag: 'formal_dresses' },
  { route: '/all/day-party-dresses', tag: 'day_party_dresses' },
  { route: '/all/night-out-dresses', tag: 'night_out_dresses' },
  { route: '/all/prom-dresses', tag: 'prom_dresses' },
  { route: '/all/graduation-dresses', tag: 'graduation_dresses' },
  { route: '/all/sorority-rush-dresses', tag: 'sorority_rush_dresses' },
  { route: '/all/vacation-dresses', tag: 'vacation_dresses' },
  { route: '/all/homecoming-dresses', tag: 'homecoming_dresses' },
  { route: '/all/birthday-dresses', tag: 'birthday_dresses' },
  { route: '/all/casual-dresses', tag: 'casual_dresses' },
  { route: '/all/club-dresses', tag: 'club_dresses' },
  { route: '/all/holiday-dresses', tag: 'holiday_dresses' },
  { route: '/all/semi-formal-dresses', tag: 'semi_formal_dresses' },
  { route: '/all/special-occasion-dresses', tag: 'events_dresses' },
  { route: '/all/fresh-deals-dresses', tag: 'all_fresh_deals_dresses' },
  { route: '/all/fresh-deals', tag: 'all_fresh_deals_dresses' },
  { route: '/all/festival-dresses', tag: 'festival_dresses' },
  { route: '/all/going-out-dresses', tag: 'going_out_dresses' },
  { route: '/all/gala-dresses', tag: 'gala_dresses' },
  // atelier
  { route: '/all/atelier-party-dresses', tag: 'atelier_party_dresses' },
  { route: '/all/atelier-cocktail-dresses', tag: 'atelier_cocktail_dresses' },
  { route: '/all/atelier-formal-dresses', tag: 'atelier_formal_dresses' },
  { route: '/all/atelier-guest-of-wedding-dresses', tag: 'atelier_guest_of_wedding_dresses' },
  { route: '/all/atelier-gala-dresses', tag: 'atelier_gala_dresses' },
  { route: '/all/atelier-dresses', tag: 'atelier_dresses' },
  // 22187
  { route: '/all/atelier-special-event-dresses', tag: 'atelier_special_event_dresses' }
]
export function getSourceTagFun(url, query, isAddHandle, defaultTag, vm, catId) {
  // 特殊路径及对应tag
  // comments: 这里要处理之前的脏数据，比如链接等
  if (query.sourceTag) {
    let flag = true
    for (let i = 0; i < specifyList.length; i++) {
      const ele = specifyList[i]
      // comments: sourceTag 是路径 或者 sourceTag 对应的值但是被修改了在首部或者尾部添加了额外字符串
      if (query.sourceTag.includes('/')) {
        query.sourceTag = query.sourceTag.replace(/_/g, '-').toLowerCase()
      }
      // 如果当前路径或者上一路径匹配到了特殊路径中的某一项，取对应的tag
      if (query.sourceTag.includes(ele.route) || query.sourceTag == ele.tag) {
        flag = false
        if (query.sourceTag.includes('semi_formal_dresses')) {
          query.sourceTag = 'semi_formal_dresses'
          break
        }
        query.sourceTag = ele.tag
        break
      }
    }
    if (flag) {
      query.sourceTag = 'others'
    }
    if (query.sourceTag == 'events_dresses' && catId == 3110) {
      query.sourceTag = 'atelier_dresses'
    }
    return query.sourceTag
  }

  let sourceTag = 'others'
  // 路径匹配判断优先于缓存判断
  for (let i = 0; i < specifyList.length; i++) {
    const ele = specifyList[i]
    url = url.replace(/_/g, '-').toLowerCase()
    // 如果当前路径或者上一路径匹配到了特殊路径中的某一项，取对应的tag
    if (url.includes(ele.route)) {
      sourceTag = ele.tag
      break
    }
  }

  if (sourceTag == 'others') {
    // comments: 如果是广告的详情页 或者 3分类的其他列表页 补充3110 以及其他的
    if (query.src === 'eventspmax' || vm.$route.name == 'list') {
      const tagObj = {
        3: 'events_dresses',
        3110: 'atelier_dresses'
      }
      sourceTag = tagObj[catId] || 'others'
    } else if (process.client || isAddHandle) {
      // 如果是加车操作，可能是快速加购，页面路径很可能不会存在sourceTag，这时需判断是否有上一页
      const referrer = getReferrer()
      // referrer不存在，说明是直接进入详情页或者从非azazie网址进入的详情页
      if (!referrer) {
        sourceTag = 'others'
      }
      if (defaultTag) {
        sourceTag = defaultTag
      }
      // comments：这是从收藏页面加车过来的
      const sessionTag = sessionStorage.getItem('AZAZIE_WGD_SOURCE_TAG_TEMP')
      if (sessionTag && !sessionTag.includes('/')) {
        sourceTag = sessionTag
      }
    }
  }

  // comments：兜底对于路径或者direct_detailpage 统一归类为 others
  if (sourceTag.includes('/') || sourceTag == 'direct_detailpage') {
    sourceTag = 'others'
  }
  return sourceTag
}

/**
 * 给打点方法添加参数param1
 * wgd广告落地页标记
 * @param {Object} vm Vue对象--> this
 * @param {String} type 打点事假类型 pageview event events...
 * @param {Object||Array} value 打点方法buryPoint传入的第三个参数，可能是对象或数组
 */
export function addParam1AndWGDTag(vm, type, value) {
  const ecs = ['addtobag', 'buynow', 'image']
  const els = ['addtobag', 'buynow', 'smallswift', 'normalswift']
  const name = vm.$route.name
  const valueType = Object.prototype.toString.call(value).slice(8, -1)
  // comments: 如果打点参数没有param1 或者是undefined -1 都补充当前页面完整路径
  if (valueType === 'Object' && !!Object.keys(value).length) {
    if (!value.lgt) {
      value.lgt = new Date().getTime()
    }
    if (!value.param1 || value.param1 == '-1' || value.param1 == 'undefined') {
      value.param1 = (location && decodeURIComponent(location.href)) || '-1'
    } else {
      value.param1 = decodeURIComponent(value.param1)
    }
    if (['list', 'product'].includes(name) && vm.isSpecialCatId(vm.catId)) {
      if (ecs.includes(value.ec) && els.includes(value.el)) {
        value.param2 = vm.sodGalleryVersion
      }
    }
  }
  if (valueType === 'Array' && !!value.length) {
    value.forEach((item) => {
      if (!item.lgt) {
        item.lgt = new Date().getTime()
      }
      if (!item.param1 || item.param1 == '-1' || item.param1 == 'undefined') {
        item.param1 = (location && decodeURIComponent(location.href)) || '-1'
      } else {
        item.param1 = decodeURIComponent(item.param1)
      }
      if (['list', 'product'].includes(name) && vm.isSpecialCatId(vm.catId)) {
        if (ecs.includes(item.ec) && els.includes(item.el)) {
          item.param2 = vm.sodGalleryVersion
        }
      }
    })
  }
  // comments: 统一处理wgd 来源参数
  const firstEntryCookie = vm.$cookie.getCookie('wgd_first_entry_tag')
  const WGDLandedCookie = vm.$cookie.getCookie('wgd_landed_is')
  const WGDSourceCookie = vm.$cookie.getCookie('wgd_source_is_new')
  const ExtendedWgdLandedCookie = vm.$cookie.getCookie('ExtendedWGDLanded')

  let ExtendedWGDLanded = null
  let wgdLanded = null
  let wgdSource = vm.$route.query.src ? vm.$route.query.src.toString() : ''
  if (!wgdSource) {
    if (vm.wgdUesrTag.WGDSource) {
      wgdSource = vm.wgdUesrTag.WGDSource
    } else {
      // comments: 游客
      wgdSource = WGDSourceCookie && decodeURIComponent(WGDSourceCookie)
    }
  }

  if (wgdSource === 'Direct') {
    wgdSource = 'wgdcpc'
  } else if (wgdSource === 'nonDirect' || wgdSource == 'undefined') {
    wgdSource = ''
  }
  // comments: 首次进入页面且命中目标页面
  const isReferrer =
    !document.referrer || (document.referrer && !document.referrer.includes('.azazie.') && !document.referrer.includes('localhost'))
  if (isReferrer) {
    // comments: 目标列表页--“wgdList”， 目标详情页--“wgdDetail”
    if ((firstEntryCookie == 'wgdList' || wgdSource) && vm.$route.name == 'list' && vm.isSpecialCatId(vm.catId)) {
      wgdLanded = vm.catId == 3110 ? 'atelier' : 'yes'
    } else if ((firstEntryCookie == 'wgdDetail' || wgdSource) && vm.$route.name === 'product' && vm.isSpecialCatId(vm.catId)) {
      wgdLanded = vm.catId == 3110 ? 'atelier' : 'yes'
    }
  }

  const textArr = ['atelier', 'yes']
  if (!textArr.includes(wgdLanded)) {
    if (textArr.includes(vm.wgdUesrTag.WGDLanded)) {
      wgdLanded = vm.wgdUesrTag.WGDLanded
    } else if (textArr.includes(WGDLandedCookie)) {
      wgdLanded = WGDLandedCookie
    }
  }
  if (!document.referrer || (document.referrer && !document.referrer.includes('.azazie.') && !document.referrer.includes('localhost'))) {
    if (!['list', 'product'].includes(vm.$route.name) || vm.isSpecialCatId(vm.catId)) {
      ExtendedWGDLanded = 'yes'
    }
  } else if (ExtendedWgdLandedCookie === 'yes') {
    ExtendedWGDLanded = 'yes'
  }
  const path = vm.$route.path
  const query = vm.$route.query
  // 获取操作来源标签
  const sourceTagText = getSourceTagFun(path, query, true, null, vm, vm.catId)
  const polarisCookie = vm.$cookie.getCookie('polaris_consent_settings')
  let isTrue = 0
  if (polarisCookie) {
    const { analyticsPermitted = false, personalizationPermitted = false, adsPermitted = false } = JSON.parse(polarisCookie)
    isTrue = analyticsPermitted && personalizationPermitted && adsPermitted
  }
  const msgFun = (item) => {
    const msg = {
      version: vm.version || process.env.GIT_VERSION, // 打包后的版本号，确认是否最新代码
      pre_dp: document.referrer,
      home_abtest: vm.indexPageVersion,
      acc: Number(isTrue)
    }
    if (vm.catId) {
      msg.from_cat_id = vm.catId
    }
    // 3分类列表页详情页
    const isWGDPage = ['list', 'product'].includes(vm.$route.name)
    if (isWGDPage) {
      if (vm.catId == 3) {
        msg.lp_type = sourceTagText
        msg.wgd_lp = 1
      }
      if (vm.catId == 3110) {
        msg.lp_type = sourceTagText
        msg.atelier_lp = 1
      }
      // 校验是不是wgd列表页或者存在wgd商品的目标sale页面
      if (!vm.isSpecialCatId(vm.catId) && (vm.catIds.includes(3) || vm.catIds.includes(3110))) {
        msg.lp_type = sourceTagText
        const path = vm.$route.path
        for (let i = 0; i < specifyList.length; i++) {
          if (path.includes(specifyList[i].route)) {
            if (specifyList[i].route.includes('atelier-')) {
              msg.atelier_lp = 1
            } else {
              msg.wgd_lp = 1
            }
            break
          }
        }
      }
    }
    // 预售列表页 和 预售详情页
    if (vm.$route.name == 'landingPage-preSaleList' || (vm.$route.name == 'product' && vm.$store.state.product.baseInfo.sodPreSaleGoods)) {
      msg.lp_type = 'doll_house_collection'
      msg.wgd_lp = 1
    }
    // comments: undefined string object
    if (!item.msg) {
      return msg
    } else if (typeof item.msg == 'object') {
      if (item.msg.category_ids && Array.isArray(item.msg.category_ids)) {
        item.msg.category_ids = item.msg.category_ids.join(',')
      }
      return deleteEmptyOfObjectKey({ ...item.msg, ...msg })
    } else {
      const tempMsg = { ...JSON.parse(item.msg) }
      if (tempMsg.category_ids && Array.isArray(tempMsg.category_ids)) {
        tempMsg.category_ids = tempMsg.category_ids.join(',')
      }
      return deleteEmptyOfObjectKey({ ...tempMsg, ...msg })
    }
  }
  const deleteEmptyOfObjectKey = (obj = {}) => {
    for (const key in obj) {
      if ((!obj[key] || obj[key] == -1) && (obj[key] != 0 || obj[key] != '')) {
        delete obj[key]
      }
    }
    return obj
  }

  if (['event', 'events', 'pageview'].includes(type)) {
    if (valueType === 'Array' && !!value.length) {
      value.forEach((valueItem) => {
        valueItem.msg = JSON.stringify({ ...msgFun(valueItem) })
        if (ExtendedWGDLanded === 'yes') {
          valueItem.param6 = 'atelier'
        }
        if (textArr.includes(wgdLanded)) {
          valueItem.param7 = wgdLanded
        }
        if (wgdSource) {
          valueItem.param8 = wgdSource
        }
        if (vm.$store && vm.$store.state.dbLandingPage) {
          valueItem.param8 = 'db'
        } else if (vm.$route.path == '/we-help-brides') {
          //  /we-help-brides 页面 param8 打点

          valueItem.param8 = vm.$route.query.banner || ''
        }
      })
    } else {
      value.msg = JSON.stringify({ ...msgFun(value) })
      if (ExtendedWGDLanded === 'yes') {
        value.param6 = 'atelier'
      }
      if (textArr.includes(wgdLanded)) {
        value.param7 = wgdLanded
      }
      if (wgdSource) {
        value.param8 = wgdSource
      }
      if (vm.$store && vm.$store.state.dbLandingPage) {
        value.param8 = 'db'
      } else if (vm.$route.path == '/we-help-brides') {
        //  /we-help-brides 页面 param8 打点
        value.param8 = vm.$route.query.banner || ''
      }
    }
  }

  return value
}

/**
 * 判断referrer是否是列表页
 */
export function judgeReferrerIsList() {
  const referrer = document && document.referrer
  const pathRegs = [
    '/all/',
    '/dress/',
    '/engagement-dresses',
    '/theme/',
    '/swatches',
    '/fabrics',
    '/samples&swatches',
    '/samples-swatches',
    '/swatches&fabric',
    '/swatches-fabric',
    '/sashes',
    '/nbcf',
    '/nuxt/list'
  ]
  let res = false
  for (let i = 0; i < pathRegs.length; i++) {
    const ele = new RegExp(pathRegs[i])
    // 如果referrer有匹配项，说明是列表页
    if (ele.test(referrer)) {
      res = true
      break
    }
  }
  return res
}

/**
 * 记录用户选中的尺码
 * 列表页尺码筛选，详情尺码选择等操作场景
 * @param {string} size 选中的尺码key
 * @param {number} catId 选中尺码对应的catId
 */
export function setSelectedSizeLocal(size, catId) {
  // 判断是否有缓存数据
  // 如果没有数据，直接赋值新数据
  // 如果有数据，判断是否是数组，如果不是，直接赋值新数据
  // 如果是数据，判断是否已有相同catId，如果有，覆盖，如果没有，添加新数据
  let selectedSize = localStorage.getItem('SELECTED_SIZE')
  if (selectedSize) selectedSize = JSON.parse(selectedSize)
  if (!selectedSize || !Array.isArray(selectedSize)) {
    selectedSize = [
      {
        catId,
        selectedSize: size
      }
    ]
  } else {
    let hasCat = false
    for (let i = 0; i < selectedSize.length; i++) {
      const ele = selectedSize[i]
      if (ele.catId === catId) {
        ele.selectedSize = size
        hasCat = true
        break
      }
    }
    if (!hasCat) {
      selectedSize.push({
        catId,
        selectedSize: size
      })
    }
  }
  localStorage.setItem('SELECTED_SIZE', JSON.stringify(selectedSize))
}
