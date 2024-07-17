import { Base64 } from 'js-base64'
// import webPush from '@/plugins/pushengage'
import { mapState } from 'vuex'
import notifyMeMixins from './notifyMeMixins'
import { setSelectedSizeLocal } from './commonFun'
import { swatchMoreColor } from './utils'
export default {
  props: {
    styleInfo: {
      type: Object,
      default: () => {}
    },
    retireInfo: {
      type: Object,
      default: () => {}
    },
    makeTimeInfo: {
      type: Object,
      default: () => {}
    },
    stickerInfo: {
      type: Array,
      default: () => []
    },
    stockInfo: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [notifyMeMixins],
  data() {
    return {
      customData: {},
      goodsNumber: 1,
      onlySelectSizeCat: [13, 15, 139],
      noDeliveryCat: [33, 36],
      sameAsDress: false,
      showCheckTip: false,
      checkTips: [],
      allReady: false,
      loading: false,
      buyNowLoading: false,
      cartEditLoading: false,
      unit: 'inch',
      checkTipsLeftPosition: '',
      notifyMeSelectSize: {},
      notifyMeSelectColor: {},
      tipStatus: {
        key: 'default',
        stockNumber: 0,
        tipsRed: false,
        statusRed: false
      },
      toastMsg: ''
    }
  },
  computed: {
    ...mapState('product', [
      'defaultSelectedColor',
      'defaultSelectedSashColor',
      'selectedColor',
      'selectedSashColor',
      'selectedSize',
      'fromShowroom',
      'fromWhatAreU',
      'recommendFlag',
      'fromDetailsEntry',
      'fromInstagram',
      'baseInfo',
      'isCurrentStyleSupportStock',
      'selectRush',
      'showAddCartDialog',
      'hasSample',
      'showNotifyDialog',
      'findSimilarData',
      'colorInfoId',
      'plusSizeView',
      'hasRealStock',
      'plusSizeView',
      'imageInfo',
      'deliveryInit',
      'customSizeSelected',
      'selectedOptions',
      'discountInfoMessage',
      'customSizeInfo',
      'comingsoonGoodsId',
      'showStockTips'
    ]),
    ...mapState('showroom', ['showroomBaseInfo']),
    sizes({ baseInfo, styleInfo, stockInfo }) {
      if (!styleInfo.hasSize) {
        // 没有size的情况
        return []
      } else if (this.isSample || this.isClearance || baseInfo.isFinalSale) {
        const sizes = []
        for (const i in stockInfo.sizeMap) {
          if (styleInfo.styleInfoSizeMap && styleInfo.styleInfoSizeMap[i]) {
            sizes.push(styleInfo.styleInfoSizeMap[i])
          }
        }
        return sizes
      } else {
        return styleInfo.size || []
      }
    },
    hasColor() {
      return this.styleInfo.hasColor
    },
    hasSize() {
      return this.styleInfo.hasSize
    },
    hasRetire() {
      return this.retireInfo.hasOwnProperty('retireColor')
    },
    isSample() {
      return this.baseInfo.dressType == 'sample'
    },
    isClearance() {
      return this.baseInfo.dressType == 'clearance' || this.baseInfo.dressType == 'outlet'
    },
    showDelivery() {
      return !this.noDeliveryCat.includes(this.baseInfo.catId) && !['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType)
    },
    shopMore() {
      if (this.baseInfo.shopMoreUrl) {
        const arr = this.baseInfo.shopMoreUrl.split('/')
        let color = this.selectedColor.key.replace(/_|\s+/g, '-').toLowerCase()
        if (this.isSpecialCatId(this.baseInfo.catId)) {
          color = this.styleInfo.SPFamilyMap[this.selectedColor.key]
        }
        arr[arr.length - 1] = color
        return arr.join('/')
      }
      return ''
    },
    mobShopMore() {
      if (this.baseInfo.mobShopMoreUrl) {
        const arr = this.baseInfo.mobShopMoreUrl.split('/')
        let color = this.selectedColor.key.replace(/_|\s+/g, '-').toLowerCase()
        if (this.isSpecialCatId(this.baseInfo.catId)) {
          color = this.styleInfo.SPFamilyMap[this.selectedColor.key]
        }
        if (this.baseInfo.mobShopMoreUrl.includes('colors')) {
          arr[arr.length - 1] = color
          return arr.join('/')
        } else {
          return this.baseInfo.mobShopMoreUrl
        }
      }
      return ''
    },
    // 是否展示新版try before you buy入口
    showTryBeforeYouBuyNew() {
      if (this.versionObj.tryBeforeAbtest === 'B' && this.baseInfo.dressType === 'dress') {
        if (
          (['US', 'CA', 'GB'].includes(this.country) && this.baseInfo.catId === 2) ||
          (this.country === 'DE' && [7, 45, 158].includes(this.baseInfo.catId))
        ) {
          return true
        }
      }
      return false
    },
    // 是否展示样衣入口
    showSampleLink() {
      if (this.isNewLanguageCountry) {
        return false
      }
      if (this.baseInfo.dressType == 'sample') {
        return [2, 7, 8, 9, 45, 158].includes(this.baseInfo.catId)
      } else if (this.baseInfo.dressType == 'dress') {
        // hasSample为true时，说明有样衣商品
        // 原本只有2类目有样衣入口，13292需求：现在新增7 Bridesmaid Dresses, 8 Mother of the Bride Dresses, 45 Maternity Bridesmaid Dresses, 158 Modest Bridesmaid Dresses, 9  jbd
        return this.hasSample && [2, 7, 8, 9, 45, 158].includes(this.baseInfo.catId)
      }
      return false
    },
    colorsFormat() {
      const colors = {
        shown: {},
        priceColors: {},
        retireColors: {},
        shownColorFamily: {}
      }
      for (const key in this.styleInfo.color) {
        const color = this.styleInfo.color[key]
        if (this.isSample || this.isClearance) {
          if (this.stockInfo.colorMap && this.stockInfo.colorMap.hasOwnProperty(key)) {
            colors.shown[key] = color
          }
        } else if (this.hasRetire && this.retireInfo.retireColor.colors[key]) {
          colors.retireColors[key] = { ...color, aliasStyleId: color.styleId }
        } else if (this.baseInfo.hasPriceRule && this.baseInfo.priceRule[color.styleId]) {
          colors.priceColors[key] = { ...color, aliasStyleId: color.styleId }
        } else {
          colors.shown[key] = color
        }
      }
      // 在详情页展示的色系模块数据，对应 colorsFormat.shown 的颜色模块，即普通的颜色
      if (this.styleInfo.colorFamily && colors.shown && Object.keys(colors.shown).length) {
        const shownColorList = Object.values(colors.shown).map((item) => {
          return item.key
        })
        const shownColorFamily = JSON.parse(JSON.stringify(this.styleInfo.colorFamily))
        for (const fKey in this.styleInfo.colorFamily) {
          const subColorList = this.styleInfo.colorFamily[fKey].subColorList || []
          shownColorFamily[fKey].subColorList = subColorList.filter((item) => {
            return item && shownColorList.includes(item.key)
          })
          if (!shownColorFamily[fKey].subColorList.length) {
            delete shownColorFamily[fKey]
          }
        }
        colors.shownColorFamily = shownColorFamily
      }
      if ([1000291, 1003269].includes(this.baseInfo.goodsId)) {
        return { ...colors, ...swatchMoreColor(this.styleInfo.color, this.stockInfo.categoryColorMap) }
      }
      return colors
    },
    sashColorsFormat() {
      const sashColors = {
        shown: {}
      }
      for (const key in this.styleInfo.sashColor) {
        const color = this.styleInfo.sashColor[key]
        if (this.isSample || this.isClearance) {
          if (this.stockInfo.sashColorMap && this.stockInfo.sashColorMap.hasOwnProperty(key)) {
            sashColors.shown[key] = color
          }
        } else if (color.isShow) {
          sashColors.shown[key] = color
        }
      }
      return sashColors
    },
    showSameAsDress() {
      return this.baseInfo.dressType == 'dress' && this.baseInfo.catId == 7
    },
    hasSizeChart() {
      return this.styleInfo && this.styleInfo.sizeChart && Object.keys(this.styleInfo.sizeChart).length > 0
    },
    beBackSoonGoods({ stickerInfo }) {
      return stickerInfo.some((sticker) => sticker.name == 'beBackSoon')
    },
    notifyMeDialogValue({
      baseInfo,
      styleInfo,
      selectedSize,
      selectedColor,
      notifyMeSelectSize,
      notifyMeSelectColor,
      stockInfo,
      sizeNotifyOption,
      colorNotifyOption
    }) {
      return {
        item: baseInfo,
        styleInfo,
        stockInfo,
        sizeOptions: sizeNotifyOption,
        colorOptions: colorNotifyOption,
        selectedSizeKey: notifyMeSelectSize.key || selectedSize.key,
        selectedColorKey: notifyMeSelectColor.key || selectedColor.key
      }
    },
    hideSizeMap({ baseInfo, stockInfo, selectedColor }) {
      const { colorMap = {} } = stockInfo
      let tempObj = {}
      if (this.isSpecialCatId(baseInfo.catId)) {
        tempObj = colorMap[selectedColor.key] && colorMap[selectedColor.key].hideSize
      }
      return tempObj || {}
    },
    // 整合公共属性
    colorStock() {
      if (!this.hasColor || !this.stockInfo.hasOwnProperty('colorMap')) {
        return []
      }
      let colors = []
      for (const i in this.stockInfo.colorMap) {
        if (this.stockInfo.colorMap[i].hasStock) {
          colors.push(i)
        }
      }
      if (this.selectedSize.key != '') {
        if (this.isSample || this.isClearance) {
          if (!this.stockInfo.sizeMap[this.selectedSize.key].inStockColor) {
            return []
          }
        } else {
          // eslint-disable-next-line
          if (!this.stockInfo.sizeMap[this.selectedSize.key] || !this.stockInfo.sizeMap[this.selectedSize.key].inStockColor) {
            return []
          }
        }
        const inStockColors = Object.keys(this.stockInfo.sizeMap[this.selectedSize.key].inStockColor)
        colors = this.getIntersect(colors, inStockColors)
      }
      if (this.selectedSashColor.key != '') {
        if (!this.stockInfo.sashColorMap[this.selectedSashColor.key].inStockColor) {
          return []
        }
        const inStockColors = Object.keys(this.stockInfo.sashColorMap[this.selectedSashColor.key].inStockColor)
        colors = this.getIntersect(colors, inStockColors)
      }
      if (this.selectedSize.key != '' && this.selectedSashColor.key != '') {
        const inStockColors = []
        for (const i in colors) {
          const key = colors[i] + '*' + this.selectedSize.key + '*' + this.selectedSashColor.key
          if (this.stockInfo.stockNumberMap[key]) {
            inStockColors.push(colors[i])
          }
        }
        colors = inStockColors
      }
      return colors
    },
    // 颜色目的国库存
    colorLocalWarehouseStock() {
      const colors = this.colorStock ? JSON.parse(JSON.stringify(this.colorStock)) : []
      for (const i in this.stockInfo.colorMap) {
        if (colors.includes(i)) {
          const index = colors.indexOf(i)
          if (!this.stockInfo.colorMap[i].localWarehouse) {
            colors.splice(index, 1)
          } else if (this.selectedSize.key != '') {
            const skuWarehouse = this.stockInfo.colorMap[i].skuWarehouse || {}
            if (!skuWarehouse[this.selectedSize.key] || skuWarehouse[this.selectedSize.key] != this.stockInfo.colorMap[i].localWarehouse) {
              colors.splice(index, 1)
            }
          }
        }
      }
      return colors
    },
    sizeStock() {
      if (!this.hasSize || !this.stockInfo.hasOwnProperty('sizeMap')) {
        return []
      }
      let sizes = []
      for (const i in this.stockInfo.sizeMap) {
        if (this.stockInfo.sizeMap[i].hasStock) {
          sizes.push(i)
        }
      }
      if (this.selectedColor.key != '') {
        if (this.isSample || this.isClearance) {
          if (!this.stockInfo.colorMap[this.selectedColor.key].inStockSize) {
            return []
          }
        } else {
          // eslint-disable-next-line
          if (
            !this.stockInfo.colorMap[this.selectedColor.key] ||
            !Object.keys(this.stockInfo.colorMap[this.selectedColor.key]).length ||
            !this.stockInfo.colorMap[this.selectedColor.key].inStockSize
          ) {
            return []
          }
        }
        const inStockSize = Object.keys(this.stockInfo.colorMap[this.selectedColor.key].inStockSize)
        sizes = this.getIntersect(sizes, inStockSize)
      }
      if (this.selectedSashColor.key != '') {
        if (!this.stockInfo.sashColorMap[this.selectedSashColor.key].inStockSize) {
          return []
        }
        const inStockSize = Object.keys(this.stockInfo.sashColorMap[this.selectedSashColor.key].inStockSize)
        sizes = this.getIntersect(sizes, inStockSize)
      }
      if (this.selectedColor.key != '' && this.selectedSashColor.key != '') {
        const inStockSize = []
        for (const i in sizes) {
          const key = this.selectedColor.key + '*' + sizes[i] + '*' + this.selectedSashColor.key
          if (this.stockInfo.stockNumberMap.hasOwnProperty(key) && this.stockInfo.stockNumberMap.hasOwnProperty(key) > 0) {
            inStockSize.push(sizes[i])
          }
        }
        sizes = inStockSize
      }
      return sizes
    },
    // size目的国库存
    sizeLocalWarehouseStock() {
      const sizes = this.sizeStock ? JSON.parse(JSON.stringify(this.sizeStock)) : []
      for (const i in this.stockInfo.sizeMap) {
        if (sizes.includes(i)) {
          const index = sizes.indexOf(i)
          if (!this.stockInfo.sizeMap[i].localWarehouse) {
            sizes.splice(index, 1)
          } else if (this.selectedColor.key != '') {
            const skuWarehouse = this.stockInfo.sizeMap[i].skuWarehouse || {}
            if (!skuWarehouse[this.selectedColor.key] || skuWarehouse[this.selectedColor.key] != this.stockInfo.sizeMap[i].localWarehouse) {
              sizes.splice(index, 1)
            }
          }
        }
      }
      return sizes
    },
    sizeHoverTip() {
      if (!this.hasSize) {
        return {}
      }
      const sizes = {}
      for (const i in this.styleInfo.styleInfoSizeMap) {
        const size = this.styleInfo.styleInfoSizeMap[i].key
        if (!this.sizeStock.includes(size)) {
          sizes[size] = this.nl('page_common_out_of_stock')
          continue
        }
        let key = ''
        if (this.hasColor) {
          key = this.selectedColor.key + '*' + size
        }
        if (this.baseInfo.hasSash) {
          key += '*' + this.selectedSashColor.key
        }
        if (this.stockInfo.stockNumberMap.hasOwnProperty(key)) {
          const stock = this.stockInfo.stockNumberMap[key]
          sizes[size] = stock <= 3 ? this.nl('page_common_only') + ' ' + stock + ' ' + this.nl('page_product_only_unit') + '!' : ''
        } else {
          sizes[size] = ''
        }
      }
      return sizes
    },
    sashStock() {
      if (!this.baseInfo.hasSash || !this.stockInfo.hasOwnProperty('sashColorMap')) {
        return []
      }
      let sashes = []
      for (const i in this.stockInfo.sashColorMap) {
        if (this.stockInfo.sashColorMap[i].hasStock) {
          sashes.push(i)
        }
      }
      if (this.selectedColor.key != '') {
        if (!this.stockInfo.colorMap[this.selectedColor.key].inStockSashColor) {
          return []
        }
        const inStockSash = Object.keys(this.stockInfo.colorMap[this.selectedColor.key].inStockSashColor)
        sashes = this.getIntersect(sashes, inStockSash)
      }
      if (this.selectedSize.key != '') {
        if (!this.stockInfo.sizeMap[this.selectedSize.key].inStockSashColor) {
          return []
        }
        const inStockSash = Object.keys(this.stockInfo.sizeMap[this.selectedSize.key].inStockSashColor)
        sashes = this.getIntersect(sashes, inStockSash)
      }
      if (this.selectedColor.key != '' && this.selectedSize.key != '') {
        const inStockSash = []
        for (const i in sashes) {
          const key = this.selectedColor.key + '*' + this.selectedSize.key + '*' + sashes[i]
          if (this.stockInfo.stockNumberMap[key]) {
            inStockSash.push(sashes[i])
          }
        }
        sashes = inStockSash
      }
      return sashes
    },
    showSizeNotify() {
      if (this.country == 'MX' && this.baseInfo.mxBdBatch) {
        return false
      } else if (this.isClearance || this.baseInfo.isFinalSale) {
        return false
      } else if (this.stockInfo && this.stockInfo.colorMap) {
        const colorStock = this.stockInfo.colorMap[this.selectedColor.key]
        let allSizeLength = colorStock && colorStock.allSize ? Object.keys(colorStock.allSize).length : 0
        if (this.isSample) {
          // 样衣展示的size使用的是 sizeMap 字段，sizeMap字段的size是全的，allsize的不全，只跟库存有关系
          const sizeMap = this.stockInfo.sizeMap || {}
          allSizeLength = Object.keys(sizeMap).length
        }
        const inStockSizeLength = colorStock && colorStock.inStockSize ? Object.keys(colorStock.inStockSize).length : 0
        return allSizeLength > inStockSizeLength
      } else if ([138, 13].includes(this.baseInfo.catId)) {
        return false
      } else if (this.stockInfo.outOfStockSizeMap && Object.keys(this.stockInfo.outOfStockSizeMap).length > 0) {
        return true
      }
      return false
    },
    sizeNotifyOption({ stockInfo, styleInfo, hideSizeMap }) {
      // 这里保持M逻辑一致
      if ([3, 3076, 3077, 3099, 3101, 6].includes(this.baseInfo.catId)) {
        const colorStock = stockInfo.colorMap && stockInfo.colorMap[this.selectedColor.key]
        if (!colorStock) {
          return {}
        }
        const allSize = colorStock.allSize || {}
        const inStockSize = colorStock.inStockSize || {}
        const diff = {}
        for (const i in allSize) {
          if (!inStockSize[i] && !hideSizeMap[i]) {
            let lastAvailableDate = ''
            if (this.stockInfo.sizeMap && this.stockInfo.sizeMap[i]) {
              lastAvailableDate = this.stockInfo.sizeMap[i].lastAvailableDate
            }
            diff[i] = {
              ...styleInfo.styleInfoSizeMap[i],
              lastAvailableDate: lastAvailableDate ? this.$dayjs(lastAvailableDate).format('MM/DD HH:mm') : ''
            }
          }
        }
        return diff
      }
      const options = {}
      // 颜色切换对应的尺码是否有库存数据会有变化，所以这里根据sizes和sizeStock确定数据
      this.sizes.forEach((ele) => {
        const res = this.sizeStock.find((item) => {
          return item === ele.key
        })
        if (!res) {
          let lastAvailableDate = ''
          if (this.stockInfo.sizeMap && this.stockInfo.sizeMap[ele.key] && this.stockInfo.sizeMap[ele.key].lastAvailableDate) {
            lastAvailableDate = this.stockInfo.sizeMap[ele.key].lastAvailableDate
          }
          options[ele.key] = {
            ...ele,
            lastAvailableDate: lastAvailableDate ? this.$dayjs(lastAvailableDate).format('MM/DD HH:mm') : ''
          }
        }
      })
      return options
    },
    colorNotifyOption({ stockInfo, styleInfo }) {
      const options = {}
      if (Object.keys(stockInfo).length == 0) {
        return {}
      }
      for (const i in stockInfo.outOfStockColorMap) {
        const color = styleInfo.color[i]
        let lastAvailableDate = ''
        if (this.stockInfo.colorMap && this.stockInfo.colorMap[i]) {
          lastAvailableDate = this.stockInfo.colorMap[i].lastAvailableDate || ''
        }
        lastAvailableDate = lastAvailableDate ? this.$dayjs(lastAvailableDate).format('MM/DD HH:mm') : ''
        options[i] = { ...color, lastAvailableDate }
      }
      return options
    },
    currentColorSupportStock() {
      // 当前颜色支持库存购买
      return this.colorStock.includes(this.baseInfo.color)
    },
    currentSizeSupportStock() {
      // 当前尺码支持库存购买
      return this.sizeStock.length && this.sizeStock.includes(this.selectedSize.key)
    },
    currentStyleSupportStock({ currentColorSupportStock, currentSizeSupportStock }) {
      // 当前颜色和size支持库存购买
      return currentColorSupportStock && currentSizeSupportStock
    },
    // sod 预售标记
    sodPreSaleGoods({ baseInfo }) {
      return this.isSpecialCatId(baseInfo.catId) && baseInfo.sodPreSaleGoods
    },
    supportStockSales() {
      // BD库存与非库存
      // sod 也做shipping in 24
      return this.baseInfo.supportStockSales && this.stockInfo && this.stockInfo.hasStock
    },
    biMsgAll() {
      return JSON.stringify({
        goodsId: this.baseInfo.goodsId,
        color: (this.selectedColor && this.selectedColor.key) || this.baseInfo.colorReal,
        size: this.selectedSize && this.selectedSize.key,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType || this.dressType,
        cat_id: this.baseInfo.catId,
        from_type: this.$route.query.from_type || '', // #17369： 搜索新加的msg.from_type,表示搜索来源
        cdn_prvd: this.cdnPrvd(this.baseInfo.catId),
        from_tag: 'productdetail' // 打点来源标签
      })
    },
    isSoldOut({ stockInfo }) {
      const { hasStock } = stockInfo || {}
      return !hasStock
    },
    isKKOutStock({ baseInfo, stockInfo, sizeStock, selectedSize }) {
      return baseInfo.brandId == 16 && (!stockInfo.hasStock || !sizeStock.includes(selectedSize.key))
    },
    hasCustomeSize({ customSizeInfo }) {
      return !!customSizeInfo.custom_size_status
    },
    // new-size-list绑定属性
    newSizeListBindValue({ baseInfo, selectedOptions, selectedColor, selectedSize, discountInfoMessage, sizeLocalWarehouseStock }) {
      const { sizes = [], sizeStock = [], supportStockSales = false, isStockGoods = false, hideSizeMap = {} } = this
      return {
        baseInfo,
        sizes,
        stock: sizeStock,
        selectedColor,
        selectedSize,
        isStockGoods,
        supportStockSales,
        sizeLocalWarehouseStock,
        selectedOptions,
        discountInfoMessage,
        hideSizeMap,
        customSizeSelected: this.customSizeSelected,
        hasCustomeSize: this.hasCustomeSize,
        comingsoonGoodsId: this.comingsoonGoodsId,
        scene: 'product',
        fromDialog: 'product'
      }
    },
    atelierIsNotifyMe({ baseInfo, selectedSize, comingsoonGoodsId }) {
      if (comingsoonGoodsId[baseInfo.goodsId]) {
        return comingsoonGoodsId[baseInfo.goodsId].includes(selectedSize.key)
      }
      return false
    }
  },
  watch: {
    openNotifyMe: {
      handler(val) {
        if (!val) {
          this.notifyMeSelectSize = {}
          this.notifyMeSelectColor = {}
        }
      }
    },
    hasRealStock() {
      this.checkSelect()
    },
    isKKOutStock: {
      handler(val) {
        if (this.baseInfo.brandId == 16 && !val) {
          this.$store.commit('product/setDeliveryInit', false)
        }
      },
      immediate: true
    },
    stockInfo: {
      handler(val) {
        this.checkSelect()
      },
      deep: true
    }
  },
  created() {
    if (this.showEuSize) this.unit = 'cm'
  },
  methods: {
    selectColor(color) {
      // sod 点击的色圈和已选中的色圈是同一个不做处理
      if (this.isSpecialCatId(this.baseInfo.catId) && color.key == this.selectedColor.key) return
      this.goodsNumber = 1
      if (this.isClearance && color.styleId == this.selectedColor.styleId) {
        this.$store.commit('product/setSelectedColor', {
          name: '',
          key: '',
          styleId: 0
        })
      } else {
        this.$store.commit('product/setSelectedColor', color)
      }
      if (this.sameAsDress) {
        const sashColor = this.styleInfo.sashColor[color.key]
        if (sashColor) {
          this.$store.commit('product/setSelectedSashColor', sashColor)
        } else {
          this.sameAsDress = false
          this.$store.commit('product/setSelectedSashColor', this.defaultSelectedSashColor)
        }
      }
      // sod 上一个颜色选中的尺码在当前颜色下面无库存或是隐藏尺码就重置尺码
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        const sizeKey = this.selectedSize.key
        if (sizeKey && (!this.sizeStock.includes(sizeKey) || this.hideSizeMap[sizeKey])) {
          this.$store.commit('product/setSelectedSize', {
            name: '',
            key: '',
            styleId: 0
          })
          this.$store.commit('product/setPlusSizeView', false)
        }
        !this.plusSizeView && this.$store.commit('product/setPlusSize', 0)
      }
    },
    selectSize(size) {
      this.goodsNumber = 1
      if ((this.isSample || this.isClearance) && size.styleId == this.selectedSize.styleId) {
        // 样衣、清仓可以取消尺码选择
        this.$store.commit('product/setSelectedSize', {
          name: '',
          key: '',
          styleId: 0
        })
      } else {
        this.$store.commit('product/setSelectedSize', size)
        // rts详情点击尺码不缓存操作尺码
        if (this.baseInfo.dressType !== 'clearance') {
          setSelectedSizeLocal(size, this.baseInfo.catId)
        }
      }
      if (size.styleId != 0) {
        this.$store.commit('product/setCustomSizeSelected', false)
      }
    },
    switchUnit() {
      this.unit = this.unit == 'inch' ? 'cm' : 'inch'
      sessionStorage.setItem('ca_unit', this.unit)
    },
    selectSashColor(color) {
      this.sameAsDress = false
      if ((this.isSample || this.isClearance) && color.styleId == this.selectedSashColor.styleId) {
        this.$store.commit('product/setSelectedSashColor', {
          name: '',
          key: '',
          styleId: 0
        })
      } else {
        this.$store.commit('product/setSelectedSashColor', color)
      }
    },
    changeSameAsDress() {
      const sashColor = this.styleInfo.sashColor[this.selectedColor.key]
      if (sashColor) {
        this.sameAsDress = true
        this.$store.commit('product/setSelectedSashColor', sashColor)
      }
    },
    changeQty(num) {
      this.buryPoint(this, 'event', {
        ec: 'quantity',
        el: 'choose',
        ea: 'click',
        msg: this.biMsgAll
      })
      this.goodsNumber = parseInt(num)
    },
    checkStyle(isBuyNowBtnHover) {
      this.checkTips = []
      const checkTips = []
      if (this.hasColor && this.selectedColor.styleId <= 0) {
        // checkTips.push(this.nl('page_common_color'))
        checkTips.push({
          key: 'color',
          name: this.nl('page_common_color')
        })
      }
      // 腰带逻辑没有了
      // if (this.baseInfo.hasSash && this.selectedSashColor.styleId <= 0) {
      //   checkTips.push(this.nl('page_common_sash_color'))
      // }
      if (this.hasSize && this.selectedSize.styleId <= 0 && !this.customSizeSelected) {
        // checkTips.push(this.nl('page_common_size'))
        checkTips.push({
          key: 'size',
          name: this.nl('page_common_size')
        })
      }
      let allReady = true
      if (checkTips.length > 0) {
        this.checkTips.push({
          title: this.nl('page_goods_please_provide'),
          items: checkTips
        })
        this.showCheckTip = true
        allReady = false
      }
      if ((this.isSample || this.isClearance || this.baseInfo.isFinalSale || this.baseInfo.customizable) && !this.confirmSelected) {
        this.checkTips.push({
          title: this.nl('page_js_accept')
        })
        this.showCheckTip = true
        allReady = false
      }
      this.allReady = allReady
      // buy now hover
      this.checkTipsLeftPosition =
        this.showCheckTip && isBuyNowBtnHover ? document.querySelector('#add-to-bag').offsetWidth + 10 + 'px' : '0px'
    },
    checkCutomization() {
      if (this.baseInfo.customizable) {
        let flag = true
        for (const key in this.customNameList) {
          // line1 、line2 数据都不能为空
          if (!this.customNameList[key]) {
            this.$refs.customization.customNameError[key] = true
            flag = false
            break
          }
        }
        return flag
      } else {
        return true
      }
    },
    changeCustomNameList(key, val) {
      this.customNameList[key] = val
    },
    hideCheckTip() {
      this.showCheckTip = false
    },
    // 获取免运费活动卖点文案类型接口，仅us和ca需要
    getFreeShippingWordsType() {
      const params = {
        goods_id: this.baseInfo.goodsId,
        color: this.selectedColor.key,
        dress_type: this.baseInfo.dressType
      }
      this.$axios
        .$get('/1.0/product/free-shipping-fee-reminder', { params })
        .then((res) => {
          if (res && res.data.showWordsType) {
            this.$store.commit('product/setShowWordsType', res.data.showWordsType)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addToBagAjax(formData) {
      const { groupId, key } = this.selectRush || {}
      if (!this.isCurrentStyleSupportStock && key) {
        // groupId字段可能会不存在，这时候就会变成undefined
        if (groupId) {
          formData.set('styles[rush_group_id]', groupId)
        }
        formData.set('styles[rush_type]', key)
      }
      const sourceTag = this.getSourceTag(this.baseInfo)
      if (sourceTag) {
        formData.set('source_tag', sourceTag)
      }
      if (this.$route.query.bundleId) {
        formData.set('bundleId', this.$route.query.bundleId)
      }
      if (this.sodDetailVersionFun(this.baseInfo)) {
        this.setOrderSourceFlag('sodab', true)
      }
      this.addToBagGA4()
      this.$axios.$post('/1.0/cart/goods', formData).then(async (res) => {
        if (res.code == 0) {
          this.retentionAddToCart(
            { ...this.baseInfo, goodsNumber: this.goodsNumber, csText: this.getColorAndSizeText(formData) },
            res.data.rec_id
          )
          this.$store.commit('setBundlePromotionProgress', res.data.bundlePromotionProgress)
          await this.getCartInfo()
          this.loading = false
          this.$store.commit('product/setShowAddCartDialog', true)
          this.$store.commit('product/setIsCustomSize', this.customSizeSelected)
          // 加入购物车成功后打点

          const tempMsg = JSON.parse(this.biMsgAll)
          if (this.baseInfo.catId == 33) {
            tempMsg.has_line_price = this.baseInfo.hasLinePrice ? 1 : 0
          }
          const tempDiscount = this.baseInfo.discount
          if (tempDiscount && this.baseInfo.dressType === 'clearance') {
            tempMsg.discount = 10 - tempDiscount
          }
          this.buryPoint(this, 'event', {
            ec: 'addtobag',
            el: 'success',
            ea: 'click',
            // param2: this.versionObj.productColorSort,
            param2: this.versionObj.listWithCodeAbtest,
            msg: JSON.stringify(tempMsg)
          })
          if (this.fromDialog == 'list' || this.fromDialog == 'showroom') {
            this.$emit('addSuccess')
            return
          } else if (this.fromDialog == 'cart') {
            // 购物车推荐弹窗,重新获取购物车数据，不会重新刷新页面
            this.$store.commit('product/setBaseInfo', {})
            this.$emit('refreshCartList')
            return
          }
          this.addToBagDot()
          this.setOrderSource(this.baseInfo.goodsId)
          if (['US', 'CA'].includes(this.country)) {
            this.getFreeShippingWordsType()
          }
        } else {
          if (res.code == 100011) {
            this.toastMsg = res.msg
            this.$refs && this.$refs.sampleAddBagError && this.$refs.sampleAddBagError.show()
          } else {
            alert(res.msg)
          }
          this.loading = false
          window.location.reload()
        }
      })
    },
    buyNowAjax(formData) {
      if (this.sodDetailVersionFun(this.baseInfo)) {
        this.setOrderSourceFlag('sodab', true)
      }
      const sourceTag = this.getSourceTag(this.baseInfo)
      if (sourceTag) {
        // todo: 此处的formData就是一个普通的对象
        this.$set(formData, 'source_tag', sourceTag)
      }
      if (this.$route.query.bundleId) {
        this.$set(formData, 'bundleId', this.$route.query.bundleId)
      }
      // ga4打点
      this.setGA4DataLayer({
        event: 'ga4Event',
        event_name: 'checkout',
        event_parameters: {
          button_name: 'Buy Now'
        }
      })
      const param = Base64.encode(JSON.stringify(formData))
      // 进入checkout页面时，带上当前网站国家，以此避免支付未成功并且多个tab页切换国家时，造成订单过去国家出错问题
      const buyNowUrl = this.countryUrl(`/checkout?buy_now=${param}&order_country_code=${this.country}`)
      this.$store.commit('checkout/setBuyNow', param)
      window.location.href = buyNowUrl
    },
    cartEditAjax(formData) {
      const params = {
        for_checkout: this.$parent.$parent.$parent.$parent.cartEditIsLater,
        goods_number: formData.goods_number,
        rush_type: 'standard',
        has_goods_info: true,
        goods_info: formData
      }
      this.$axios
        .$post(`/1.0/cart/goods/${this.$parent.$parent.$parent.$parent.cartEditRecId}`, params)
        .then((res) => {
          if (res.code == 0) {
            this.cartEditLoading = false
            this.$parent.$parent.closeQuickShop()
            this.$store.commit('cart/setLoadingFlag', true)
            this.$emit('refreshCartList')
          } else {
            this.cartErrorExtra()
          }
        })
        .catch((error) => {
          console.log(error)
          this.cartErrorExtra()
        })
    },
    cartErrorExtra(msg) {
      const _msg = msg || this.nl('page_error_something_wrong')
      this.$store.commit('cart/setLoadingFlag', false)
      alert(_msg)
    },
    continueShopping() {
      this.buryPoint(this, 'event', {
        ec: 'continueshopping',
        el: 'success',
        ea: 'click',
        msg: this.biMsgAll
      })
      this.$store.commit('product/setBaseInfo', {})
    },
    continueCheckout() {
      this.buryPoint(this, 'event', {
        ec: 'checkout',
        el: 'success',
        ea: 'click',
        msg: this.biMsgAll
      })
      if (this.fromDialog == 'showroom') window.open(this.countryUrl(`/cart?showroom_id=${this.showroomBaseInfo.showroomId}`))
      else window.open(this.countryUrl(`/cart`))
    },
    async getCartInfo() {
      // 导航栏的购物车icon,hover上去有删除功能，删除之后获取购物车状态
      try {
        const res = await this.$axios.$get(`/1.0/cart`, {
          params: { for_checkout: 1, sodGalleryVersion: this.versionObj.sodGalleryVersion.toLowerCase(), from: 'simpleCart' }
        })
        if (res.code == 0) {
          if (res.data.summary) {
            this.$store.commit('setCartInfo', {
              totalCount: res.data.forCheckoutQty,
              prodList: res.data.checkoutGoodsList || [],
              hasLineTotal: res.data.summary.goodsAmount != res.data.summary.totalNoDealGoodsAmount,
              totalPrice: res.data.summary.goodsAmountDisplay,
              totalNoDealPrice: res.data.summary.totalNoDealGoodsAmountDisplay,
              sample_gift_goods_id: '', //  后端说这个送头纱现在没有了
              freeShippingProgress: res.data.freeShippingProgress, // 免运费进度条相关数据
              cartBundleList: res.data.cartBundleList, // buy more get more
              activityInfo: res.data.activityInfo || {}
            })
          } else {
            this.$store.commit('setCartInfo', {
              totalCount: 0,
              prodList: [],
              hasLineTotal: false,
              totalPrice: 0,
              totalNoDealPrice: 0,
              sample_gift_goods_id: '',
              freeShippingProgress: null,
              activityInfo: {}
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 商品详情页,点击addtobag加购打点
    addToBagGA4() {
      // ga4打点
      const gaParams = {
        event: 'ga4Event',
        event_name: 'add_to_cart',
        event_parameters: {
          currency: this.currencyCode,
          value: this.baseInfo.shopPrice * this.goodsNumber,
          items: [
            {
              item_id: this.baseInfo.goodsId,
              item_name: this.baseInfo.shownGoodsName,
              discount: this.baseInfo.priceOff,
              item_category: this.baseInfo.catName,
              item_category2: this.baseInfo.shownColor,
              item_variant: this.selectedSize && this.selectedSize.name,
              item_brand: this.baseInfo.brandId,
              price: this.baseInfo.shopPrice,
              quantity: this.goodsNumber,
              sku_id: this.baseInfo.gaData && this.baseInfo.gaData.ecommProdId
            }
          ]
        }
      }
      this.setGA4DataLayer(gaParams)
    },
    getIntersect(a, b) {
      if (Array.isArray(a) && Array.isArray(b)) {
        const set1 = new Set(a)
        const set2 = new Set(b)
        return Array.from(new Set([...set1].filter((x) => set2.has(x))))
      }
      return []
    },
    checkSelect() {
      if (this.isSample) {
        // 样衣走这个方法
        // 注意： ！！！ #17082 这个需求只改样衣的详情页的推荐， quickshop的不改，所以这个组件跟 quickshop的 sampleStyle 区别会很大，如果后续quickshop的也需要改成跟详情页的逻辑一致的话，可以参考这个组件
        this.checkSelectSample()
        return false
      }
      this.tipStatus = {
        key: 'default',
        stockNumber: 0,
        tipsRed: false,
        statusRed: false
      }
      const tipStatus = this.tipStatus
      const colorSizeSash = (this.hasColor ? '1' : '0') + (this.hasSize ? '1' : '0') + (this.baseInfo.hasSash ? '1' : '0')
      const selColorSizeSash =
        (this.selectedColor.key != '' ? '1' : '0') +
        (this.selectedSize.key != '' ? '1' : '0') +
        (this.selectedSashColor.key != '' ? '1' : '0')
      if (colorSizeSash != selColorSizeSash) {
        tipStatus.key = 'default'
        this.disable = false
        return false
      }
      const stockNumberMap = this.stockInfo.stockNumberMap || {}
      const colorMap = this.stockInfo.colorMap || {}
      const sizeMap = this.stockInfo.sizeMap || {}
      switch (colorSizeSash) {
        case '100':
          // only color
          if (colorMap[this.selectedColor.key] && colorMap[this.selectedColor.key].hasStock) {
            tipStatus.tipsRed = true
            // 正价商品并且有真实库存
            if (
              [6, 10, 13, 138, 3076, 3077, 3099, 3101, 3109, 3102].includes(this.baseInfo.catId) &&
              this.baseInfo.dressType === 'dress' &&
              this.baseInfo.hasRealStock
            ) {
              tipStatus.key = 'shipsImmediately'
            } else {
              tipStatus.key = 'hasStock'
            }
            tipStatus.stockNumber = stockNumberMap[this.selectedColor.key]
          } else if (this.baseInfo.catId == 33 || this.baseInfo.catId == 36) {
            tipStatus.key = 'color_no_stock'
            tipStatus.statusRed = true
          } else {
            tipStatus.key = 'onlyColorNoStock'
            tipStatus.statusRed = true
          }
          break
        case '110':
          // color & size
          this.checkNoSash(tipStatus)
          break
        case '111':
          // color & size & sash
          this.checkNoSash(tipStatus)
          if (tipStatus.key == 'hasStock') {
            if (
              !colorMap[this.selectedColor.key].allSashColor[this.selectedSashColor.key] ||
              !sizeMap[this.selectedSize.key].allSashColor[this.selectedSashColor.key]
            ) {
              tipStatus.key = 'noSashColor'
              tipStatus.statusRed = true
            } else if (!stockNumberMap[this.selectedColor.key + '*' + this.selectedSize.key + '*' + this.selectedSashColor.key]) {
              tipStatus.key = 'sashColorNoStock'
              tipStatus.statusRed = true
            } else {
              tipStatus.key = 'hasStock'
              tipStatus.tipsRed = true
              tipStatus.stockNumber =
                stockNumberMap[this.selectedColor.key + '*' + this.selectedSize.key + '*' + this.selectedSashColor.key]
            }
          }
          break
        case '000':
          // no color & no size
          if (stockNumberMap['*'] && stockNumberMap['*'] > 0) {
            tipStatus.key = 'hasStock'
            tipStatus.stockNumber = stockNumberMap['*']
            tipStatus.tipsRed = true
          } else {
            tipStatus.key = 'noColorNoSize'
            tipStatus.statusRed = true
          }
          break
      }
      this.$nextTick(() => {
        // this.disable = tipStatus.key != 'hasStock' && tipStatus.key != 'default'
        this.disable = !['default', 'hasStock', 'shipsImmediately'].includes(tipStatus.key)
        if (this.isSample && ['sizeNoStock', 'noColorAndNoStock'].includes(tipStatus.key)) {
          this.getFindSimilar()
        } else {
          this.showSampleSimilar = false
        }
      })
    },
    checkNoSash(tipStatus) {
      const sizeStock =
        this.stockInfo.sizeMap && this.stockInfo.sizeMap[this.selectedSize.key] ? this.stockInfo.sizeMap[this.selectedSize.key] : {}
      if (sizeStock.hasStock) {
        if (sizeStock.allColor && sizeStock.allColor[this.selectedColor.key]) {
          if (sizeStock.inStockColor && sizeStock.inStockColor[this.selectedColor.key]) {
            // size in select color has stock
            // 正价商品并且有真实库存
            if (
              [6, 10, 13, 138, 3076, 3077, 3099, 3101, 3109, 3102].includes(this.baseInfo.catId) &&
              this.baseInfo.dressType === 'dress' &&
              this.baseInfo.hasRealStock
            ) {
              tipStatus.key = 'shipsImmediately'
            } else {
              tipStatus.key = 'hasStock'
            }
            tipStatus.tipsRed = true
            tipStatus.stockNumber = this.stockInfo.stockNumberMap[this.selectedColor.key + '*' + this.selectedSize.key]
          } else {
            // size in select color has no stock
            if (this.isSpecialCatId(this.baseInfo.catId)) {
              tipStatus.key = 'noColor'
            }
            tipStatus.key = 'colorNoStock'
            tipStatus.statusRed = true
          }
        } else {
          tipStatus.key = 'noColor'
          tipStatus.statusRed = true
        }
      } else if (sizeStock.allColor && sizeStock.allColor[this.selectedColor.key]) {
        tipStatus.key = 'sizeNoStock'
        tipStatus.statusRed = true
      } else {
        tipStatus.key = 'noColorAndNoStock'
        tipStatus.statusRed = true
      }
    },
    addToBagDot() {
      this.setDataLayer({
        category: 'PC_DetailPageRevision',
        action: 'click',
        label: 'DetailPageA_AddToBagSuccess_Click'
      })
      this.setDataLayer({
        category: 'CountryAddtoBag_Click',
        action: 'click',
        label: this.country + '_AllCountryAddtoBag_Click'
      })
      let eventName = ''
      switch (this.cat_id) {
        case 7:
        case 45:
        case 158:
        case 9:
        case 139:
          eventName = 'Bridesmaid_AddtoBag_Click'
          break
        case 2:
          eventName = 'Bride_AddtoBag_Click'
          break
        case 8:
          eventName = 'MBD_AddtoBag_Click'
          break
        case 138:
          eventName = 'GroomAcc_AddtoBag_Click'
          break
        case 13:
          eventName = 'Wrap_AddtoBag_Click'
          break
        case 15:
          eventName = 'Sash_AddtoBag_Click'
          break
        case 6:
          eventName = 'WeddingVeil_AddtoBag_Click'
          break
      }
      if (eventName != '') {
        this.setDataLayer({
          category: 'AddtoBag',
          action: 'click',
          label: eventName
        })
      }
      eventName = ''
      switch (this.baseInfo.catId) {
        case 7:
        case 45:
        case 158:
        case 139:
          eventName = 'BD_DetailPageAddtoBag'
          break
        case 9:
          eventName = 'Junior_DetailPageAddtoBag'
          break
        case 2:
          eventName = 'WD_DetailPageAddtoBag'
          break
        case 8:
          eventName = 'MOB_DetailPageAddtoBag'
          break
        case 107:
        case 40:
        case 138:
        case 13:
        case 15:
        case 6:
        case 37:
          eventName = 'ACC_DetailPageAddtoBag'
          break
      }
      if (eventName != '') {
        this.setDataLayer({
          category: 'DetailPageAddtoBag',
          action: 'click',
          label: eventName
        })
      }
    },
    setOrderSource(goodsId) {
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        if (this.$cookie.getCookie('trace_order_from_mail') == 'dressstartat29') {
          this.$cookie.setCookie('dressstartat29-' + goodsId, 1, 7, '.' + this.APP_DOMAIN_LOWER)
        }
      }
      if (!(this.isSample || this.isClearance || this.baseInfo.isFinalSale || this.baseInfo.isStockGoods)) {
        const dottedModule = [
          'Notification_BridalParty24h',
          'Notification_BridalParty4h',
          'Notification_payment1h',
          'Notification_AddToCart1h',
          'Notification_AddToCart24h',
          'Notification_AddToCart5d',
          'sample_email_reminder1',
          'sample_email_reminder2a',
          'sample_email_reminder2b'
        ]
        for (const i in dottedModule) {
          if (this.$cookie.getCookie(dottedModule[i]) > 0) {
            this.$cookie.setCookie(dottedModule[i] + '-' + goodsId, 1, 7, '.' + this.APP_DOMAIN_LOWER)
          }
        }
      }
    },
    selectMeshColor() {
      this.setPoint('color', 'mesh', 'click')
    },
    changeDialogStatus() {
      if (this.beBackSoonGoods) {
        this.$store.commit('product/setShowNotifyDialog', false)
        this.$store.commit('setOpenNotifyMe', true)
        return
      }
      this.$store.commit('product/setShowNotifyDialog', !this.showNotifyDialog)
    },
    selectStockSize(size) {
      this.$store.commit('product/setShowStockTips', false)
      this.selectSize(size)
      this.$nextTick(() => {
        if (this.beBackSoonGoods) {
          this.$store.commit('product/setShowNotifyDialog', false)
          this.notifyMeSelectSize = size
          if (!this.isSample && !this.baseInfo.isFinalSale) {
            this.$store.commit('setOpenNotifyMe', true)
            return false
          }
        }
        if (this.$refs.delivery) {
          this.$refs.delivery.getDeliveryInfo()
        }
      })
      this.checkSelect()
    },
    selectStockSashColor(color) {
      this.selectSashColor(color)
      this.checkSelect()
    },
    setPoint(ec, el, ea) {
      const msg = JSON.parse(this.biMsgAll)
      if (ec == 'addtobag' || ec == 'buynow') {
        // #17369： 搜索新加的msg.from_type,表示搜索来源
        msg.from_type = this.$route.query.from_type
      }
      const tempDiscount = this.baseInfo.discount
      if (ec === 'addtobag' && tempDiscount && this.baseInfo.dressType === 'clearance') {
        msg.discount = 10 - tempDiscount
      }
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        param2: this.versionObj.productColorSort,
        msg: JSON.stringify(msg)
      })

      const isTryOnCombImgSuccess = localStorage.getItem(`isTryOnCombImgSuccess_${this.baseInfo.goodsId}`)
      if (el == 'addtobag' && isTryOnCombImgSuccess) {
        // 看到合成图之后的add to bag 点击的打点
        const params2 = {
          ec: 'tryinstore',
          el: 'addtocart2',
          ea: 'click',
          msg: this.biMsgAll
        }
        this.buryPoint(this, 'event', params2)
      }
    },
    trackParams(ec, el, from) {
      const common = {
        ec,
        el
      }
      const msg = JSON.parse(this.biMsgAll)
      if (from && this.isSpecialCatId(this.baseInfo.catId)) {
        // const isVersionB = this.sodDetailVersionFun(this.baseInfo)
        msg.cdn_prvd = this.cdnPrvd(this.baseInfo.catId)
        msg.ab = (this.sodGalleryVersion || 'A').toLowerCase()
        // if (isVersionB) {
        //   msg.ab = 'B'
        // }
      }
      return {
        id: 'product-' + this.baseInfo.goodsId + msg.color + msg.size + el + ec + from,
        common: {
          ...common,
          msg: JSON.stringify(msg)
        }
      }
    },
    // 详情页使用颜色色系模块
    showProductColorFamily(colorList) {
      return false
      // return (
      //   this.versionObj.productColorAbtest === 'B' &&
      //   colorList &&
      //   Object.keys(colorList).length > 7 &&
      //   this.styleInfo.colorFamily &&
      //   Object.keys(this.styleInfo.colorFamily).length > 0
      // )
    },
    // 加车、buynow 校验：没有选择颜色、尺码、条款报错，锚点位置且抖动
    handleCheck() {
      // checkErrorType: size 、color
      const checkErrorTypes = this.checkTips.length && this.checkTips[0].items && this.checkTips[0].items
      for (const i in checkErrorTypes) {
        const checkErrorType = checkErrorTypes[i].key
        if (checkErrorType) {
          const sizeElement = document.querySelector(`.size-block`) // 锚点尺码元素
          sizeElement && sizeElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
          const element = document.querySelector(`.${checkErrorType}-block`) // 抖动元素
          element && element.classList.add('animated-shake') // 加抖动
          setTimeout(() => {
            // 移除抖动
            element && element.classList.remove('animated-shake')
          }, 1500)
        }
      }
      if (checkErrorTypes && checkErrorTypes.length) return false
      // 没有选中条款报错，锚点位置且抖动,且标红checkbox sample-confirm
      if ((this.isSample || this.isClearance || this.baseInfo.isFinalSale || this.baseInfo.customizable) && !this.confirmSelected) {
        const element = document.querySelector('.sample-confirm') // 抖动元素
        element && element.classList.add('animated-shake') // 加抖动
        setTimeout(() => {
          // 移除抖动
          element && element.classList.remove('animated-shake')
        }, 1500)

        return false
      }
      return true
    },
    shopSimilar() {
      const productRelateDom = document.querySelector('div#product_related')
      productRelateDom &&
        window.scrollTo({
          top: productRelateDom.offsetTop - 50,
          left: 0,
          behavior: 'smooth'
        })
    }
  }
}
