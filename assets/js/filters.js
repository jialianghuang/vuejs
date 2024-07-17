import { mapState } from 'vuex'
import { pathToFilters, getNewQueryUrl, queryUrlToPath, pathToQueryUrl, objectUrlToStringUrl } from '@/assets/js/utils.js'
const seoLanguages = require('../../modules/supportSeoLanguage')

export default {
  data() {
    return {
      showSamplerNote: false
    }
  },
  computed: {
    ...mapState(['catId', 'country']),
    ...mapState('list', [
      'filters',
      'filtersOpen',
      'filtersShowLess',
      'apiFilters',
      'popularFilters',
      'apiCatName',
      'seoCatName',
      'viewSwitch',
      'shopByStyle',
      'finalInfo',
      'prodList',
      'apiDressType',
      'priceRange',
      'onSale',
      'supportStockSales',
      'fastDeliveryDress'
    ]),
    ...mapState(['catName']),
    // 是否需要 filters
    filtersFlag() {
      return !!Object.keys(this.filters).length
    },
    // 是否需要 popular filter
    popularFilterFlag() {
      return (
        [7, 9, 2, 8].includes(this.catId * 1) &&
        this.filtersFlag &&
        !!Object.keys(this.popularFilters).length &&
        !['sample', 'clearance', 'outlet'].includes(this.dressType)
      )
    },
    // 是否需要filtersColor，及轮播下面的颜色选择
    filtersColorFlag() {
      return this.filtersFlag && (this.filters.color || this.filters.colors)
    },
    // 选中的filters，从请求接口返回的filters中过滤得到
    filtersSelected({ currencyCode, currencySymbol, priceRange, catId, apiFilters, $route, language }) {
      const res = {}
      const filtersObj = JSON.parse(JSON.stringify(this.filters))
      // 14202 活动合并内容需要清理discountLevel
      if (this.finalInfo.isFinalSale) {
        delete filtersObj.discountLevel
        delete filtersObj.discount
      }
      for (const key in filtersObj) {
        if (filtersObj.hasOwnProperty(key)) {
          const element = filtersObj[key]
          let removeKey = ['category', 'list_colors_family']

          // US 的 from_style_quiz 特殊处理
          // 15322 要加上价格
          if (!(this.country === 'US' && this.$route.query.from_style_quiz) && !this.isSpecialCatId(this.catId)) {
            removeKey.push('price')
            removeKey.push('pricecadca')
            removeKey.push('priceaudau')
            removeKey.push('pricegbpgb')
            removeKey.push('priceeurfr')
            removeKey.push('pricemxnmx')
            removeKey.push('priceeurde')
            removeKey.push('priceeures')
            removeKey.push('priceeurit')
            removeKey.push('priceeurie')
            removeKey.push('priceeurnl')
            removeKey.push('priceeurbe')
          }

          if (this.$route.name === 'search') {
            // search 页面要加上上面的filter
            removeKey = []
          }

          // 多语言需求之前一直用element.value做判断，多语言后value会变成多语言，所以现改为key做判断
          if (!removeKey.includes(element.key) && element.selected) {
            for (const sKey in element.values) {
              if (element.values.hasOwnProperty(sKey)) {
                if (
                  !element.values[sKey].selected ||
                  (element.key === 'category' && sKey === 'all_categories' && $route.name === 'search')
                ) {
                  delete element.values[sKey]
                }
              }
            }
            if (element.values && Object.keys(element.values).length) {
              res[key] = element
            }
          }

          //  处理list_colors_family选中的颜色
          if (element.key === 'list_colors_family') {
            // 针对 list_colors_family 的选中项处理，这个是色系+颜色的组合，颜色在色系的下面
            for (const sKey in element.values) {
              if (element.values.hasOwnProperty(sKey)) {
                if (element.values[sKey].selected) {
                  const familyItem = element.values[sKey]
                  for (const colorKey in familyItem.subColorList) {
                    const colorItem = familyItem.subColorList[colorKey]
                    if (!colorItem.selected) {
                      delete familyItem.subColorList[colorKey]
                    }
                  }
                  if (familyItem.subColorList && Object.keys(familyItem.subColorList).length) {
                    // 自定义一个 self_sub_color 的key，表示list_colors_family中选中的颜色.在列表页展示选中的属性的时候方便判断。
                    res.self_sub_color = {
                      ...familyItem,
                      values: familyItem.subColorList
                    }
                  }
                }
              }
            }
          }
        }
        // 将手动输入的价格展示在filter顶部
        if (
          key.includes('price') &&
          !filtersObj[key].selected &&
          (($route.path.includes(key) && this.isSpecialCatId(catId) && Object.keys(apiFilters).length > 0) ||
            (this.$route.name === 'search' && apiFilters[key] && priceRange))
        ) {
          const info = JSON.parse(JSON.stringify(filtersObj[key]))
          const prices = priceRange.replace(/[A-Za-z]/g, '')
          let path = $route.path

          if (this.isSpecialCatId(catId)) {
            const prefixText = info.value.toLowerCase()
            const reg = new RegExp(`/${info.key}/${prefixText}(\\d\\.*)+-(\\d\\.*)+`)
            path = path.replace(reg, '')
            if (path.endsWith('/with')) {
              path = path.replace('/with', '')
            }
            if (path.startsWith(`/${language}`)) {
              path = path.replace(`/${language}`, '')
            }
          }
          const value = {
            manualPrice: {
              fold: false,
              key: 'addOther',
              name: prices
                .split('-')
                .map((price) => {
                  if (currencyCode == 'EUR') {
                    return price.trim() + currencySymbol
                  } else {
                    return currencySymbol + price.trim()
                  }
                })
                .join(' - '),
              number: '',
              url: path,
              value: priceRange
            }
          }
          info.values = value
          res[key] = info
        }
      }
      return res
    },
    // 搜索列表页要跳转的url
    searchFilterQuery() {
      // 保留原有的query, 去掉所有的filter，再加上已选中的filter
      const query = JSON.parse(JSON.stringify(this.$route.query))
      const filtersObj = JSON.parse(JSON.stringify(this.filters))
      for (const filtersObjKey in filtersObj) {
        const filtersObjItem = filtersObj[filtersObjKey]
        delete query[filtersObjItem.key]
      }
      // 由于size是某些品类才会有的，所以size单独处理
      delete query.size
      const filtersSelected = JSON.parse(JSON.stringify(this.filtersSelected))
      for (const filterKey in filtersSelected) {
        const filterItem = filtersSelected[filterKey]
        for (const valueKey in filterItem.values) {
          const valueItem = filterItem.values[valueKey]
          if (query[filterItem.key]) {
            query[filterItem.key] = `${query[filterItem.key]},${valueItem.value}`
          } else {
            query[filterItem.key] = valueItem.value
          }
        }
      }
      return query
    },
    filtersClearAllFlag() {
      return !!Object.keys(this.filtersSelected).length
    },
    // 简单的 filters ，用于请求数据时的 filters
    sampleFilters() {
      const res = {}
      if (this.filtersClearAllFlag) {
        for (const key in this.filtersSelected) {
          if (this.filtersSelected.hasOwnProperty(key)) {
            const element = this.filtersSelected[key]
            for (const sKey in element.values) {
              if (element.values.hasOwnProperty(sKey)) {
                const sElement = element.values[sKey]
                if (res[element.value]) {
                  res[element.value].push(sElement.value)
                } else {
                  res[element.value] = [sElement.value]
                }
              }
            }
          }
        }
      }
      return res
    },
    filtersClearAllUrl() {
      const path = this.prePath
      const preQuery = this.preQuery
      let res = ''
      let reg = '(/all/[0-9a-zA-Z-_]+'
      // if (this.$route.path.includes('/plus-size')) {
      //   reg = reg + '/plus-size'
      // }

      // if (this.$route.path.includes('colors-family')) {
      //   // 存在 list_colors_family 的filter，产品要求选中的色系或者颜色都不展示在已选中中，所以，这里 colors-family 不需要清空清空，其他情况还是按之前的逻辑处理
      //   if (this.showColorFamily) {
      //     reg = reg + '/colors-family/[0-9a-zA-Z-_]+).*'
      //   } else {
      //     reg = reg + ').*'
      //   }
      // } else if (this.$route.path.includes('colors')) {
      //   reg = reg + '/colors/[0-9a-zA-Z-_]+).*'
      // } else if (this.$route.path.includes('color')) {
      //   reg = reg + '/color/[0-9a-zA-Z-_]+).*'
      // } else {
      //   reg = reg + ').*'
      // }

      // final-sale集合页点击clear all时，不改变已选中的category参数
      if (this.$route.path.includes('/all/final-sale') && this.$route.path.includes('/category/')) {
        reg = reg + '/with/category/[0-9a-zA-Z-_]+).*'
      } else {
        reg = reg + ').*'
      }

      const regPath = new RegExp(reg).exec(path)
      if (regPath && regPath.length && regPath[1]) {
        res = regPath[1]
      }

      let queryStr = ''

      // 活动列表落地页清空筛选时，固定路径
      if (this.$route.path.includes('/collection/eventshop')) {
        const pathArr = this.$route.path.split('/collection/eventshop/')
        let landingpage = ''
        landingpage = pathArr.length > 1 ? pathArr[1] : ''
        if (landingpage.includes('/with')) {
          landingpage = landingpage.split('/with')[0]
        }
        if (landingpage.includes('/colors')) {
          landingpage = landingpage.split('/colors')[0]
        }
        res = '/collection/eventshop/' + landingpage
        if (preQuery.category) {
          queryStr = `${queryStr}?category=${preQuery.category}`
        }
      } else if (this.$route.path.includes('/store/')) {
        // 门店分享列表落地页清空筛选时，固定路径
        let storeName = this.$route.path.split('/store/')[1]
        if (storeName.includes('/with')) {
          storeName = storeName.split('/with')[0]
        }
        if (storeName.includes('/colors')) {
          storeName = storeName.split('/colors')[0]
        }
        delete preQuery.page
        res = '/store/' + storeName
        res = objectUrlToStringUrl(res, preQuery)
      } else {
        const catName = this.apiCatName.replace(' ', '-').replace('_', '-')
        // 色卡的链接需要单独处理
        if (['swatches-fabric', 'fabrics', 'swatches'].includes(catName)) {
          res = `/${catName}`
        }
        if (`${this.currentCountryUrl}${res}` === path) {
          if (catName === 'swatches-fabric') {
            res = '/swatches-fabric'
          } else if (catName === 'fabrics') {
            res = '/fabrics'
          } else if (catName === 'swatches') {
            res = '/swatches'
          } else {
            res = `/all/${catName}`
          }
        }

        // 清空的时候不重置sort_by
        if (preQuery && preQuery.sort_by) {
          queryStr = `?sort_by=${preQuery.sort_by}`
        }
      }

      const url = res + queryStr
      return url
    },
    popularFilterBanner({ dressType }) {
      return !['sample', 'clearance', 'outlet'].includes(dressType)
    },
    showColorFamily() {
      // 列表页上方展示色系+单色
      return this.filters && this.filters.list_colors_family && Object.keys(this.filters.list_colors_family).length
    },
    // 备注： 下面对价格的判断为什么分成三个判断，因为每个逻辑都是独立的，跟m保持一致
    // price 的filter 是否走 checkbox 模式
    isCheckboxPriceFilter() {
      return this.isSpecialCatId(this.catId) || this.$route.name === 'search'
    },
    // price 里面是否有 onsale选项
    hasOnSaleFilter() {
      // All New Page 需求，search 页去掉 onsale 选项
      return [3].includes(this.catId)
    },
    // price 里面是否可以让用户自动填写价格区间
    hasPriceInputFilter() {
      // All New Page 需求，search 页去掉 apply的价格区间
      return [3].includes(this.catId)
    },
    seoLangPath() {
      const seoLangPath = this.$route.fullPath
      let tempPath = ''
      const currentSeoLanguages = seoLanguages.filter((item) => seoLangPath == `/${item}` || seoLangPath.startsWith(`/${item}/`))
      if (currentSeoLanguages.length) {
        tempPath = seoLangPath.substring(currentSeoLanguages[0].length + 1, seoLangPath.length)
      } else {
        tempPath = seoLangPath
      }
      return tempPath
    },
    prePath() {
      // colletion路径转正常路径
      return this.$route.path.includes('/collection/all') ? queryUrlToPath(this.seoLangPath, this.$store, true).path : this.$route.path
    },
    preQuery() {
      // colletion路径参数转正常路径参数
      return this.$route.path.includes('/collection/all') ? queryUrlToPath(this.seoLangPath, this.$store, true).query : this.$route.query
    },
    discountType() {
      return this.$route.path.includes('/collection/all') ? '/discountoff/' : '/discount/'
    }
  },
  methods: {
    getfilterBiParams(item, info, fName) {
      const fname = fName || info.value || ''
      const cname = item.name
      return {
        ec: 'listpage',
        el: 'filter',
        msg: JSON.stringify({
          cat_name: this.seoCatName,
          attr1: fname,
          attr2: cname,
          cat_id: this.catId,
          dress_type: this.dressType
        })
      }
    },
    clickFilterSetPoint(item, info, fName) {
      const fname = fName || info.value || ''
      const cname = item.name
      this.buryPoint(this, 'event', {
        ec: 'listpage',
        el: 'filter',
        ea: 'click',
        msg: JSON.stringify({
          cat_name: this.seoCatName,
          attr1: fname,
          attr2: cname,
          cat_id: this.catId,
          dress_type: this.dressType
        })
      })
    },
    /**
     * 修改 price 价格
     * @param {Array} price : [小值， 大值]
     * @param {Boolean} flag : 是否需要获取数据
     * @param {Boolean} isApply : 是否是点击apply手动输入的价格
     */
    changePriceFilters(price, info, isApply) {
      // 处理search页面的价格
      if (this.$route.name === 'search') {
        const priceQueryKey = info.key
        const priceQueryValue = `${info.value.toLowerCase()}${price.join('-')}`
        const priceQuery = {}
        priceQuery[priceQueryKey] = priceQueryValue
        // 只有手动输入的价格才setPriceRange
        if (isApply) {
          this.$store.commit('list/setPriceRange', priceQueryValue)
        } else {
          this.$store.commit('list/setPriceRange', '')
        }
        this.handleSearchFilterResult({ key: 'price', queryData: priceQuery })
        return false
      }

      let path = this.prePath
      const prefixText = info.value.toLowerCase()
      const reg = new RegExp(`/${info.key}/${prefixText}(\\d\\.*)+-(\\d\\.*)+`)
      const replaceText = `/${info.key}/${prefixText}${price.join('-')}`
      if (path.includes('/with/')) {
        if (path.includes(`/${info.key}/${prefixText}`)) {
          path = this.prePath.replace(reg, replaceText)
        } else {
          path += replaceText
        }
      } else {
        path += `/with${replaceText}`
      }
      if (path == this.prePath) return
      // 修复更改price之后，shopby会有瞬间重置的问题。之前是toNewPath传入参path和query.需要改成完整的链接解决
      let queryStr = ''
      const preQuery = this.preQuery

      const queryKey = Object.keys(preQuery)
      queryKey.forEach((qKey, qIndex) => {
        if (qKey === 'page') {
          return false
        }
        if (qIndex) {
          queryStr += '&'
        } else {
          queryStr += '?'
        }
        queryStr += `${qKey}=${preQuery[qKey]}`
      })
      const url = path + queryStr
      this.toNewPath(url)
    },
    /**
     * 修改链接中的 query，比如 sort_by、page
     * @param {String} obj : 需要修改的query
     */
    changeQuery(obj) {
      let path = this.prePath
      const preQuery = this.preQuery
      const query = {
        ...preQuery,
        ...obj
      }
      // 除了分页操作，后续筛选不带fixedBrandId
      const isOnlyPage = Object.keys(obj).length === 1 && obj.page
      if (!isOnlyPage) delete query.fixedBrandId
      // 删除query中没有值的参数
      Object.keys(query).forEach((ele) => {
        if (query[ele] == null || query[ele] == undefined) {
          delete query[ele]
        }
      })
      if (this.$route.name === 'search') {
        this.handleSearchFilterResult({ key: 'query', queryData: query })
      } else {
        if (query.supportStockSales || this.fastDeliveryDress) {
          // #17628: supportStockSales选中的情况下 rush 要去掉
          this.clearFilters('rush')
          const regex = /\/with\/rush\/(?:yes|no)$/g
          path = path.replace(regex, '')
          path = path.replace('/rush/yes', '')
        } else {
          this.clearFilters('stock_size')
          delete query.stock_size
        }
        this.toNewPath({
          path,
          query
        })
      }
    },
    // 跳转到新的 路由
    toNewPath(pathVal) {
      let val = JSON.parse(JSON.stringify(pathVal))
      if (!val.path) {
        val = this.countryUrl(val)
        // 16399 wgd价格新增on sale筛选条件
        if (this.isSpecialCatId(this.catId)) {
          if (this.onSale.selected) {
            val = this.setUrlParam(val, 'os', 1)
          } else {
            val = this.delUrlParam(val, 'os', false)
          }
        }
        if (!this.supportStockSales) {
          // supportStockSales不需要选中的时候，移除 supportStockSales
          val = this.delUrlParam(val, 'supportStockSales', false)
        }
        if (!this.fastDeliveryDress) {
          val = this.delUrlParam(val, 'fastDeliveryDress', false)
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.isSpecialCatId(this.catId)) {
          if (this.onSale.selected) {
            val.query.os = 1
          } else {
            delete val.query.os
          }
        }
        if (!this.supportStockSales) {
          // supportStockSales不需要选中的时候，移除 supportStockSales
          delete val.query.supportStockSales
        }
        if (!this.fastDeliveryDress) {
          delete val.query.fastDeliveryDress
        }
      }
      if (this.$route.fullPath == val) {
        return false
      }

      const oldRouteQuery = this.preQuery
      // comments: 14202 后端根据这个参数fresh_deals区分数据
      if (oldRouteQuery.fresh_deals) {
        if (typeof val === 'string' && !val.includes('fresh_deals=')) {
          val += val.includes('?') ? `&fresh_deals=${oldRouteQuery.fresh_deals}` : `?fresh_deals=${oldRouteQuery.fresh_deals}`
        }
      }

      // ga推广参数，路径变更时保留
      if (!val.path) {
        const tempArr = ['gad_source', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content']
        if (this.$route.path.includes('/store/')) tempArr.push('referrer_code')
        tempArr.forEach((item) => {
          if (val && oldRouteQuery && oldRouteQuery[item]) val = getNewQueryUrl(val, item, oldRouteQuery[item])
        })
      }

      let query
      let route
      if (
        typeof val === 'string' &&
        !/^https?:\/\//.test(val) &&
        (val.includes('all/sample-') ||
          val.includes('all/ready-to-ship') ||
          val.includes('all/last-chance-outlet') ||
          val.includes('all/final-sale'))
      ) {
        route = this.$router.match(val)
        query = { ...(route.query || {}) }
        query.current_in_stock = query.current_in_stock || 'yes' // 如果query没有current_in_stock，默认yes
        if (oldRouteQuery.tryOnDress == 'true' || oldRouteQuery.tryOnDress == true) {
          query.tryOnDress = oldRouteQuery.tryOnDress
          // tryOnDress为true的情况下，要求切换筛选后，sort_by仍旧选择default，所以这里要带上sort_by
          if (oldRouteQuery.sort_by) {
            query.sort_by = oldRouteQuery.sort_by
          }
        }
      }

      // 更进入列表首页一样同步更新 catName
      // filter 路径获取参数，去掉国家拼接
      const seoLangPath = (query && route && route.path) || (val.path ? val.path : val)
      let tempPath = ''
      const currentSeoLanguages = seoLanguages.filter((item) => seoLangPath == `/${item}` || seoLangPath.startsWith(`/${item}/`))
      if (currentSeoLanguages.length) {
        tempPath = seoLangPath.substring(currentSeoLanguages[0].length + 1, seoLangPath.length)
      } else {
        tempPath = seoLangPath
      }
      const queryData = pathToFilters(tempPath, this.$store)
      this.$store.commit('setCatName', queryData.cat_name)
      this.$store.commit('setIsFlashSale', false)
      this.$store.commit('list/setApiViewMode', queryData.viewMode || ['petite'])
      this.$store.commit('list/setIsCanLoading', true)
      this.$store.commit('list/setLoadingFlag', true)
      let pathUrl = ''
      if (query && route && route.path) {
        pathUrl = objectUrlToStringUrl(route.path, query)
      } else if (val.query) {
        pathUrl = objectUrlToStringUrl(val.path, val.query)
      } else {
        pathUrl = val
      }
      if (this.$route.path.includes('/collection/all') && !pathUrl.includes('/collection/all')) {
        pathUrl = pathUrl.replace('?', '&')
        // console.log('-----进去页面之前路径------', pathUrl)
        pathUrl = pathToQueryUrl(pathUrl, this.$store)
        // console.log('-----处理之后路径------', pathUrl)
      }
      // ?变成&符号，处理 /all/bridesmaid-dresses?filter=xxx 路径
      this.$nextTick(() => {
        // 处理筛选filter之后，页面的行为，保持动作的连贯性
        this.handleListBehavior()
        this.$router.push(pathUrl)
      })
    },
    // 获取对象类型
    getType(val) {
      return Object.prototype.toString.call(val).slice(8, -1)
    },
    // 获取展开的filter
    getFiltersOpen() {
      const arr = []
      // 此处配置了定制化内容  price显示则sale-type显示
      let hasSaleType = false
      const saletypeNameArr = ['sale_type', 'sale_type_cad']
      let saletypeName = ''
      const priceNameArr = [
        'price',
        'pricecadca',
        'priceaudau',
        'pricegbpgb',
        'priceeurfr',
        'pricemxnmx',
        'priceeurde',
        'priceeures',
        'priceeurit',
        'priceeurie',
        'priceeurnl',
        'priceeurbe'
      ]
      let priceName = ''
      for (const key in this.filters) {
        // 之前的需求，wgd 分类filter默认全展开。
        // 挪到这里处理是修复之前的代码放在FiltersBlock的created里面强制处理展开，会导致store的数据和页面展示不一致的bug
        // stock-size 默认展开
        // /all/final-sale路径，category为all下筛选项全展开
        if (
          this.isSpecialCatId(this.catId) ||
          ((arr.length < 4 || this.$route.path.includes('/all/final-sale')) && this.filters.hasOwnProperty(key))
        ) {
          const element = this.filters[key]
          // sod定制： price  length  occasion embellishment category->product_type1 关， trend-开
          if (this.catId == 3110) {
            const keyArr = ['price', 'length', 'shop_by_category', 'embellishment', 'shop_by_occasion']
            if (!keyArr.includes(key)) {
              arr.push(element.key)
            }
          } else {
            arr.push(element.key)
          }
        }
        // sale-type定制化
        if (saletypeNameArr.includes(this.filters[key].key)) {
          hasSaleType = true
          saletypeName = this.filters[key].key
        }
        priceName = priceNameArr.includes(this.filters[key].key) ? this.filters[key].key : priceName
      }
      // sale-type定制化
      if (hasSaleType) {
        if (arr.includes(priceName) && !arr.includes(saletypeName)) arr.push(saletypeName)
        if (!arr.includes(priceName) && arr.includes(saletypeName)) arr.splice(arr.indexOf(saletypeName, 1))
      }
      arr.push('stock_size') // 由于stock_size不是一开始就会出现的，getFiltersOpen只会执行一次，但是stock_size要默认展开，所以这里直接把stock_size加入 FiltersOpen
      this.$store.commit('list/setFiltersOpen', arr)
    },
    getBiCommonParams(ec, el, ea, item) {
      if (process.server) return
      const msg = {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
      if (item) {
        msg.name = item.name
      }
      const params = {
        common: {
          ec,
          el,
          msg: JSON.stringify(msg)
        }
      }
      if (ea) {
        params.common.ea = ea
      }
      return params
    },
    closeBanner() {
      localStorage.setItem('sample-note', 1)
      this.showSamplerNote = false
    },
    // filter点击筛选项之后，先展示选中效果再跳转到新的页面
    filterSelectOption(filterKey, optionKey, tempUrl) {
      if (!this.filters) return false
      const tempFilters = JSON.parse(JSON.stringify(this.filters))
      let filter = {}
      let discountUrl = ''
      // 因为filters 给的外层对象的key跟对象里面的key值可能存在不对应的关系，所以这里使用对象里面的key值为准
      for (const i in tempFilters) {
        const item = tempFilters[i]
        if (filterKey === item.key) {
          filter = item
        }
        if (['discount', 'discountoff'].includes(item.key)) {
          for (const key in item.values) {
            if (item.values[key].selected && (item.key == 'discountoff' || [7, 5, 1.5, 9, 10].includes(item.values[key].value))) {
              // console.log('------discountUrl-----', item.values[key].value)
              discountUrl = this.discountType + item.values[key].value
            }
          }
        }
      }
      if (!filter.key) return false
      let option = {}
      for (const j in filter.values) {
        const jItem = filter.values[j]
        if (optionKey === jItem.key) {
          option = jItem
        }
      }
      if (!option.key) return false
      const multi = filter.multi
      this.$set(option, 'selected', !option.selected)
      let flag = false
      for (const i in filter.values) {
        if (filter.values[i].selected) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$set(filter, 'selected', true)
      } else {
        this.$set(filter, 'selected', false)
      }

      // 若为单选filter 将其他选中的取消
      if (!multi) {
        for (const i in filter.values) {
          if (filter.values[i].selected && filter.values[i].value !== option.value) {
            this.$set(filter.values[i], 'selected', false)
            break
          }
        }
      }

      // todo #17628： rush 的特殊处理： 如果是rush, 值为no的时候，需要设置成取消选中所有项的状态
      // 这里如果接口改了rush的筛选项，好像就不用动了
      if (filterKey === 'rush' && optionKey === 'no') {
        this.$set(option, 'selected', false)
        for (const i in filter.values) {
          if (filter.values[i].selected && filter.values[i].value !== option.value) {
            this.$set(filter.values[i], 'selected', false)
            break
          }
        }
      }

      if (filter.key === 'list_colors_family') {
        // 选中 list_colors_family 里面的色系的时候，要把其他色系下的子颜色 选中的取消
        if (option.isFamily) {
          for (const i in filter.values) {
            if (!filter.values[i].selected) {
              const familyItem = filter.values[i]
              for (const colorKey in familyItem.subColorList) {
                filter.values[i].subColorList[colorKey].selected = false
              }
            }
          }
        }
      }

      // 批量转rts列表页discount筛选，是多选，但是all是单选
      if (['discount'].includes(filterKey) && optionKey === 'all') {
        option.url = option.url.split(this.discountType)[0]
      }

      this.$store.commit('list/setFilters', tempFilters)
      // ！筛选特殊处理：当当前路径存在discount筛选参数时，点击其他筛选项，对应的跳转路径要拼上这个discount筛选条件
      let resUrl = tempUrl || option.url
      // 当前路径从对象转字符串
      const prePath = this.prePath

      // console.log('--拼接discount之前路径-----', prePath)
      // collection filterKey catergory不拼接discountoff
      if (prePath.includes(this.discountType) && !['discount', 'discountoff'].includes(filterKey) && filterKey != 'category') {
        if (!resUrl.includes(this.discountType && discountUrl)) {
          if (!resUrl.includes('/with/')) {
            discountUrl = '/with/' + discountUrl
          }
          if (resUrl.includes('?')) {
            resUrl = resUrl.split('?')[0] + discountUrl + '?' + resUrl.split('?')[1]
          } else {
            resUrl = resUrl + discountUrl
          }
        }
      }

      // 如果是门店分享商品列表页，接口返回的筛选url里没有query信息，这里需要拼上当前路径的query信息
      if (this.jsKey === 'storefront_share') {
        const urlQuery = this.$route.fullPath.split('?')[1]
        if (urlQuery) {
          resUrl = option.url + '?' + urlQuery
          resUrl = this.delUrlParam(resUrl, 'page', false)
        }
      }
      // 后续筛选不带fixedBrandId
      if (resUrl && resUrl.includes('fixedBrandId')) {
        resUrl = this.delUrlParam(resUrl, 'fixedBrandId', false)
      }
      // console.log('---拼接discount之后路径----', resUrl)
      if (this.$route.name === 'search') {
        // search 列表页
        this.$nextTick(() => {
          if (filterKey === 'category') {
            // 切换category，需要清空其他的filter
            this.handleSearchFilterResult({ key: 'category', queryData: { category: optionKey } })
            return
          }
          this.handleSearchFilterResult()
        })
      } else {
        // 列表页
        this.$nextTick(() => {
          this.toNewPath(resUrl)
        })
      }
    },
    selectOptionSubColors(filterKey, optionKeys = {}, tempUrl) {
      // 单独处理 list_colors_family 里面的子颜色，list_colors_family这个模块是整合了色系和颜色,颜色为色系下的  subColorList 。所以需要单独处理
      // 选中色系下的子颜色，需要把当前色系下其他的颜色选中取消
      const { familyKey, colorKey } = optionKeys
      if (filterKey === 'list_colors_family' && familyKey && colorKey) {
        const tempFilters = JSON.parse(JSON.stringify(this.filters))
        let discountUrl = ''
        for (const i in tempFilters) {
          const item = tempFilters[i]
          if (['discount', 'discountoff'].includes(item.key)) {
            for (const key in item.values) {
              if (item.values[key].selected && [7, 5, 1.5, 9, 10].includes(item.values[key].value)) {
                discountUrl = this.discountType + item.values[key].value
              }
            }
          }
        }
        const filter = tempFilters[filterKey]
        if (!filter || !filter.values) return false
        const familyItem = filter.values[optionKeys.familyKey] || {} // 当前色系
        const colorItem = familyItem.subColorList[colorKey] // 当前色系下的当前颜色
        let flag = false
        for (const subKey in familyItem.subColorList) {
          const subItem = familyItem.subColorList[subKey]
          if (colorKey === subItem.key && !subItem.selected) {
            filter.values[familyKey].subColorList[subKey].selected = true
            flag = true
          } else {
            filter.values[familyKey].subColorList[subKey].selected = false
          }
        }
        // 当前色系的 selected 根据是否有选中颜色控制
        familyItem.selected = flag
        // 把其他的色系的selected置为false
        for (const parentKey in filter.values) {
          if (familyKey !== parentKey) {
            filter.values[parentKey].selected = false
            // 要把其他色系下的子颜色 选中的取消
            const fItem = filter.values[parentKey]
            for (const cKey in fItem.subColorList) {
              this.$set(filter.values[parentKey].subColorList[cKey], 'selected', false)
            }
          }
        }
        this.$store.commit('list/setFilters', tempFilters)
        // ！筛选特殊处理：当当前路径存在discount筛选参数时，点击其他筛选项，对应的跳转路径要拼上这个discount筛选条件
        let resUrl = tempUrl || colorItem.url
        const prePath = this.prePath
        // collection filterKey catergory不拼接discountoff
        if (prePath.includes(this.discountType) && !['discount', 'discountoff'].includes(filterKey) && filterKey != 'category') {
          if (!resUrl.includes(this.discountType && discountUrl)) {
            if (!resUrl.includes('/with/')) {
              discountUrl = '/with/' + discountUrl
            }
            if (resUrl.includes('?')) {
              resUrl = resUrl.split('?')[0] + discountUrl + '?' + resUrl.split('?')[1]
            } else {
              resUrl = resUrl + discountUrl
            }
          }
        }
        this.$nextTick(() => {
          this.toNewPath(resUrl)
        })
      }
    },
    /*
     ** filter回显池 点击清空/删除筛选项
     ** parentKey filter的key值。有值表示删除当前filter下所有的筛选项， 无值表示清空
     ** filterKey filter下的value的key值，有值表示删除当前当前filter下的某一个筛选项， 无值表示删除当前filter下所有的筛选项
     */
    clearFilters(parentKey, filterKey) {
      const filters = JSON.parse(JSON.stringify(this.filters))
      let needExcludeKeys = ['category'] // 清空时候需要排除的filter，列表页不会清空category， search页面会清空所有的
      if (this.$route.name === 'search') {
        needExcludeKeys = []
      }
      for (const i in filters) {
        if (
          filters[i].selected &&
          !needExcludeKeys.includes(filters[i].key) &&
          ((parentKey && parentKey === filters[i].key) || !parentKey || i === 'list_colors_family')
        ) {
          const options = filters[i].values
          for (const j in options) {
            if (options[j].selected && ((filterKey && filterKey === options[j].key) || !filterKey)) {
              this.$set(options[j], 'selected', false)
            } else if (options[j].selected && i === 'list_colors_family') {
              // 重置筛选条件的时候 色系+颜色的组合，要把选中色系下所有的颜色取消选中
              const familyItem = options[j]
              for (const colorKey in familyItem.subColorList) {
                this.$set(options[j].subColorList[colorKey], 'selected', false)
              }
            }
          }
        }
        // 遍历当前filter下的所有的values，如果有选中的值，则当前filter则为选中态，如果没有任何选中值，则为非选中态
        let flag = false
        for (const k in filters[i].values) {
          if (filters[i].values[k].selected) {
            flag = true
            break
          }
        }

        if (flag) {
          this.$set(filters[i], 'selected', true)
        } else {
          this.$set(filters[i], 'selected', false)
        }
      }

      this.$store.commit('list/setFilters', filters)
    },
    setUrlParam(url, arg, argVal) {
      const evil = function(fn) {
        const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
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
    },
    delUrlParam(url, ref, useDecode) {
      if (!url.includes(ref)) {
        return url
      }
      if (useDecode) {
        url = decodeURIComponent(url)
      }

      const baseUrl = url.split('#')
      const arrUrl = baseUrl[0].split('?')
      const base = arrUrl[0]
      const arrParam = (arrUrl[1] && arrUrl[1].split('&')) || []
      let index = -1
      for (let i = 0; i < arrParam.length; i++) {
        const paired = arrParam[i].split('=')
        if (paired[0] == ref) {
          index = i
          break
        }
      }

      if (index != -1) {
        arrParam.splice(index, 1)
        if (arrParam.length > 0) {
          url = base + '?' + arrParam.join('&') + (baseUrl[1] ? baseUrl[1] : '')
        } else {
          url = base
        }
      }

      return useDecode ? encodeURIComponent(url) : url
    },
    handleSearchFilterResult(obj = {}) {
      let query = JSON.parse(JSON.stringify(this.searchFilterQuery))
      query.page = 1 // 切换filter之后 page需要重置到1
      delete query.from_type // 切换filter之后 from_type需要去掉
      if (obj && obj.queryData && Object.keys(obj.queryData).length) {
        if (obj.key === 'category') {
          let curQuery = {}
          if (query.q) {
            // q 可能不存在
            curQuery = {
              q: query.q
            }
          }
          query = {
            // 切换category，需要清空其他的filter
            ...curQuery,
            ...obj.queryData
          }
        } else {
          query = {
            ...query,
            ...obj.queryData
          }
        }
      }

      // 处理 price 里面的 onSale
      if (this.onSale.selected) {
        query.os = 1
      } else {
        delete query.os
      }

      // 处理search切换了filter之后的操作
      const curQuery = this.$route.query && JSON.parse(JSON.stringify(this.$route.query))
      if (this.isObjEqual(curQuery, query)) {
        // query 未改变
        console.log('query unchanged')
        // 入参没有变化的时候不执行操作
        return false
      }
      this.$store.commit('list/setIsCanLoading', true)
      this.$store.commit('list/setLoadingFlag', true)
      // 提前处理apiFilters，保证数据连贯性
      this.$store.commit('list/setApiFilters', query)
      this.$router.push({
        path: this.$route.path,
        query
      })

      this.$nextTick(() => {
        this.handleListBehavior()
      })
    },
    // 对比入参对象是否有变化
    isObjEqual(o1 = {}, o2 = {}) {
      const props1 = Object.keys(o1)
      const props2 = Object.keys(o2)
      let flag = true
      if (props1.length != props2.length) {
        return false
      }
      for (let i = 0; i < props1.length; i++) {
        const propName = props1[i]
        if (o1[propName] !== o2[propName]) {
          flag = false
        }
      }
      return flag
    },
    handleListBehavior() {
      // 通过filter 切换页面之前记录当前的用户行为
      // keepScroll： 上一步页面整体滚动的距离
      const keepScroll = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
      this.$store.commit('list/setKeepScroll', keepScroll)

      // filterScrollTop , 上一步 左侧filter 滚动的距离
      const filterScrollTop = document.querySelector('#cat-left-scroll') && document.querySelector('#cat-left-scroll').scrollTop
      this.$store.commit('list/setFilterScrollTop', filterScrollTop)

      // hisSeparateScroll, 上一步列表页商品模块是否滚动超过导航栏了。如果是，新的页面会让列表页滚动到顶部，如果否，则保持keepScroll即可
      const headerTranslate = this.$refs.main ? this.$refs.main.headerTranslate : 0
      const h = document.querySelector('.sticky-header') ? document.querySelector('.sticky-header').getBoundingClientRect().height : 0
      const headerH = h - headerTranslate
      const listRightlTop = document.querySelector('#cat-right') && document.querySelector('#cat-right').getBoundingClientRect().top
      // 给个10px的误差，保证列表页商品模块顶部距离顶部较近的时候，切换filter之后会滚动到列表页顶部
      this.$store.commit('list/setHisSeparateScroll', listRightlTop <= headerH + 10)
    }
  }
}
