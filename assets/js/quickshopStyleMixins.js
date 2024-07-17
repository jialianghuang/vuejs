import { Base64 } from 'js-base64'
// import webPush from '@/plugins/pushengage'
import { mapState } from 'vuex'
import { setSelectedSizeLocal } from './commonFun'
import notifyMeMixins from './notifyMeMixins'

export default {
  props: {
    fromDialog: {
      type: String,
      default: ''
    },
    stockInfo: {
      type: Object,
      default: () => {}
    },
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
    giftActivityId: {
      type: Number,
      default: 0
    },
    isFindSimilar: {
      // 是否是缺货推荐模块
      type: Boolean,
      default: false
    },
    isExcitationLoading: {
      type: Boolean,
      default: true
    },
    scene: {
      type: String,
      default: ''
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
      chooseItLoading: false,
      notifyMeSelectSize: {},
      notifyMeSelectColor: {},
      showNotifyDialog: false,
      disableNotifyMe: false // 是否禁用notifyme
    }
  },
  computed: {
    ...mapState('quickshop', [
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
      'stickerInfo',
      'indexNo',
      'isCurrentStyleSupportStock',
      'isNormalStock',
      'hasInitStock',
      'colorFilter',
      'hasSample',
      'colorInfoId',
      'plusSizeView',
      'hasRealStock',
      'imageInfo',
      'customSizeSelected',
      'selectedOptions',
      'discountInfoMessage',
      'customSizeInfo',
      'comingsoonGoodsId'
    ]),
    ...mapState('showroom', ['showroomBaseInfo']),
    ...mapState('list', ['sortBy']),
    ...mapState('cart', ['checkoutGoodsList']),
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
    // 是否展示样衣入口
    showSampleLink() {
      if (this.isNewLanguageCountry) {
        return false
      }
      if (this.giftActivityId || this.fromDialog == 'cartFreeGift') {
        // 如果是买赠活动的赠品quick shop 弹窗，不展示
        return false
      }
      if (this.baseInfo.dressType == 'sample') {
        return [2, 7, 8, 9, 45, 158].includes(this.baseInfo.catId)
      } else if (this.baseInfo.dressType == 'dress') {
        // hasSample为true时，说明有样衣商品
        // 原本只有2类目有样衣入口，13292需求：现在新增7 Bridesmaid Dresses, 8 Mother of the Bride Dresses, 45 Maternity Bridesmaid Dresses, 158 Modest Bridesmaid Dresses,9  jbd
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
          colors.retireColors[key] = color
        } else if (this.baseInfo.hasPriceRule && this.baseInfo.priceRule[color.styleId]) {
          colors.priceColors[key] = color
        } else {
          colors.shown[key] = color
        }
      }
      // #17758: 如果是来自于 换购模块的 quickshop,需要根据接口返回的 colorFilter 过滤展示的颜色，备注：目前只有skc维度接口才会返回过滤的颜色，goodsId维度展示所有颜色
      if (this.colorFilter && this.colorFilter.length) {
        for (const ctype in colors) {
          const colorType = colors[ctype]
          for (const color in colorType) {
            if (!this.colorFilter.includes(color)) {
              delete colorType[color]
            }
          }
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
      return stickerInfo && stickerInfo.some((sticker) => sticker.name == 'beBackSoon')
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
    sizeNotifyOption({ stockInfo, styleInfo, hideSizeMap }) {
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
    colorStock({ hasColor, stockInfo, selectedSize, selectedSashColor }) {
      if (!hasColor || !stockInfo.hasOwnProperty('colorMap')) {
        return []
      }
      let colors = []
      for (const i in stockInfo.colorMap) {
        if (stockInfo.colorMap[i].hasStock) {
          colors.push(i)
        }
      }
      if (selectedSize.key != '') {
        if (this.isSample || this.isClearance) {
          if (stockInfo.sizeMap[selectedSize.key] && !stockInfo.sizeMap[selectedSize.key].inStockColor) {
            return []
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (!stockInfo.sizeMap || !stockInfo.sizeMap[selectedSize.key] || !stockInfo.sizeMap[selectedSize.key].inStockColor) {
            return []
          }
        }
        if (stockInfo.sizeMap[selectedSize.key]) {
          const inStockColors = Object.keys(stockInfo.sizeMap[selectedSize.key].inStockColor)
          colors = this.getIntersect(colors, inStockColors)
        }
      }
      if (selectedSashColor.key != '') {
        if (!stockInfo.sashColorMap[selectedSashColor.key].inStockColor) {
          return []
        }
        const inStockColors = Object.keys(stockInfo.sashColorMap[selectedSashColor.key].inStockColor)
        colors = this.getIntersect(colors, inStockColors)
      }
      if (selectedSize.key != '' && selectedSashColor.key != '') {
        const inStockColors = []
        for (const i in colors) {
          const key = colors[i] + '*' + selectedSize.key + '*' + selectedSashColor.key
          if (stockInfo.stockNumberMap[key]) {
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
    sizeStock({ hasSize, stockInfo, selectedColor, selectedSashColor }) {
      if (!hasSize || !stockInfo.hasOwnProperty('sizeMap')) {
        return []
      }
      let sizes = []
      for (const i in stockInfo.sizeMap) {
        if (stockInfo.sizeMap[i].hasStock) {
          sizes.push(i)
        }
      }
      if (selectedColor.key != '') {
        if (this.isSample || this.isClearance) {
          if (!this.stockInfo.colorMap[this.selectedColor.key].inStockSize) {
            return []
          }
        } else {
          const flag =
            !stockInfo.colorMap[selectedColor.key] ||
            !Object.keys(stockInfo.colorMap[selectedColor.key]).length ||
            !stockInfo.colorMap[selectedColor.key].inStockSize
          if (flag) {
            return []
          }
        }
        const inStockSize = Object.keys(stockInfo.colorMap[selectedColor.key].inStockSize)
        sizes = this.getIntersect(sizes, inStockSize)
      }
      if (selectedSashColor.key != '') {
        if (!stockInfo.sashColorMap[selectedSashColor.key].inStockSize) {
          return []
        }
        const inStockSize = Object.keys(stockInfo.sashColorMap[selectedSashColor.key].inStockSize)
        sizes = this.getIntersect(sizes, inStockSize)
      }
      if (selectedColor.key != '' && selectedSashColor.key != '') {
        const inStockSize = []
        for (const i in sizes) {
          const key = selectedColor.key + '*' + sizes[i] + '*' + selectedSashColor.key
          if (stockInfo.stockNumberMap.hasOwnProperty(key) && stockInfo.stockNumberMap.hasOwnProperty(key) > 0) {
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
    sashStock({ baseInfo, stockInfo, selectedColor, selectedSize }) {
      if (!baseInfo.hasSash || !stockInfo.hasOwnProperty('sashColorMap')) {
        return []
      }
      let sashes = []
      for (const i in stockInfo.sashColorMap) {
        if (stockInfo.sashColorMap[i].hasStock) {
          sashes.push(i)
        }
      }
      if (selectedColor.key != '') {
        if (!stockInfo.colorMap[selectedColor.key].inStockSashColor) {
          return []
        }
        const inStockSash = Object.keys(stockInfo.colorMap[selectedColor.key].inStockSashColor)
        sashes = this.getIntersect(sashes, inStockSash)
      }
      if (selectedSize.key != '') {
        if (!stockInfo.sizeMap[selectedSize.key].inStockSashColor) {
          return []
        }
        const inStockSash = Object.keys(stockInfo.sizeMap[selectedSize.key].inStockSashColor)
        sashes = this.getIntersect(sashes, inStockSash)
      }
      if (selectedColor.key != '' && selectedSize.key != '') {
        const inStockSash = []
        for (const i in sashes) {
          const key = selectedColor.key + '*' + selectedSize.key + '*' + sashes[i]
          if (stockInfo.stockNumberMap[key]) {
            inStockSash.push(sashes[i])
          }
        }
        sashes = inStockSash
      }
      return sashes
    },
    supportStockSales({ baseInfo, stockInfo }) {
      return baseInfo.supportStockSales && stockInfo && stockInfo.hasStock
    },
    currentColorSupportStock({ colorStock, baseInfo }) {
      // 当前颜色支持库存购买
      return colorStock.includes(baseInfo.color)
    },
    currentSizeSupportStock({ sizeStock, selectedSize }) {
      // 当前尺码支持库存购买
      return sizeStock.length && sizeStock.includes(selectedSize.key)
    },
    currentStyleSupportStock({ currentColorSupportStock, currentSizeSupportStock }) {
      // 当前颜色和size支持库存购买
      return currentColorSupportStock && currentSizeSupportStock
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
    sizes() {
      if (!this.styleInfo.hasSize) {
        // 没有size的情况
        return []
      } else if (this.isSample || this.isClearance || this.baseInfo.isFinalSale) {
        const sizes = []
        for (const i in this.stockInfo.sizeMap) {
          sizes.push(this.styleInfo.styleInfoSizeMap[i])
        }
        return sizes
      } else if (this.isNormalStock) {
        const sizes = []
        for (const key in this.styleInfo.size) {
          const size = this.styleInfo.size[key]
          if (this.stockInfo.sizeMap && this.stockInfo.sizeMap.hasOwnProperty(size.key)) {
            sizes.push(size)
          }
        }
        return sizes
      } else {
        return this.styleInfo.size
      }
    },
    showSizeNotify() {
      if (this.giftActivityId || this.fromDialog == 'cartFreeGift') {
        // 如果是买赠活动的赠品quick shop 弹窗，不展示
        return false
      }
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
    // sod 预售标记
    sodPreSaleGoods({ baseInfo }) {
      return this.isSpecialCatId(baseInfo.catId) && baseInfo.sodPreSaleGoods
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
        from_cat_id: this.catId || '', // 主商品catId
        from_tag: 'quickshop' // 打点来源标签
      })
    },
    getSodGalleryVersion({ setSodGalleryVersion }) {
      return setSodGalleryVersion().abVersion
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
        scene: 'quickshop',
        fromDialog: this.fromDialog
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
    currentColorSupportStock: {
      handler(newVal) {
        if (newVal && (this.currentSizeSupportStock || this.selectedSize.key == '') && !this.customSizeSelected) {
          this.$store.commit('quickshop/setIsCurrentStyleSupportStock', true)
          this.$store.commit('quickshop/setHideShipIcon', false)
        } else {
          this.$store.commit('quickshop/setIsCurrentStyleSupportStock', false)
          this.$store.commit('quickshop/setHideShipIcon', true)
        }
      }
    },
    customSizeSelected: {
      handler(val) {
        if (val) {
          this.$store.commit('quickshop/setCustomStyleId', 'customStyleId')
          this.$store.commit('quickshop/setIsCurrentStyleSupportStock', false)
          this.$store.commit('quickshop/setHideShipIcon', true)
        } else if (this.currentStyleSupportStock || (this.currentColorSupportStock && this.selectedSize.key == '')) {
          this.$store.commit('quickshop/setIsCurrentStyleSupportStock', true)
          this.$store.commit('quickshop/setHideShipIcon', false)
        }
      }
    },
    hasRealStock() {
      this.checkSelect()
    }
  },
  created() {
    // AU 默认cm，当CA，FR，MX时，购物车编辑弹框customeSize返回的是inch数据，并不是cm数据，所以CA,FR,MX购物车商品编辑显示inch单位
    if (this.showEuSize) {
      this.unit = 'cm'
    }
    this.getHasSample()
    // 购物车商品数量带到quickshop
    this.goodsNumber = this.baseInfo.cartGoodsNumber || 1
  },
  inject: ['setSodGalleryVersion'],
  methods: {
    getHasSample() {
      // 获取关联样衣接口
      this.$axios
        .$get('/1.0/product/sample-info', {
          params: { goods_id: this.baseInfo.goodsId, cat_id: this.baseInfo.catId }
        })
        .then((res) => {
          if (res.code == 0) {
            this.$store.commit('quickshop/setHasSample', res.data.hasSample)
          }
        })
    },
    selectColor(color) {
      // sod 点击的色圈和已选中的色圈是同一个不做处理
      if (this.isSpecialCatId(this.baseInfo.catId) && color.key == this.selectedColor.key) return
      this.goodsNumber = 1
      if (this.isClearance && color.styleId == this.selectedColor.styleId) {
        this.$store.commit('quickshop/setSelectedColor', {
          name: '',
          key: '',
          styleId: 0
        })
      } else {
        this.$store.commit('quickshop/setSelectedColor', color)
      }
      if (this.sameAsDress) {
        const sashColor = this.styleInfo.sashColor[color.key]
        if (sashColor) {
          this.$store.commit('quickshop/setSelectedSashColor', sashColor)
        } else {
          this.sameAsDress = false
          this.$store.commit('quickshop/setSelectedSashColor', this.defaultSelectedSashColor)
        }
      }
      // sod 上一个颜色选中的尺码在当前颜色下面无库存或是隐藏尺码就重置尺码
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        const sizeKey = this.selectedSize.key
        if (sizeKey && (!this.sizeStock.includes(sizeKey) || this.hideSizeMap[sizeKey])) {
          this.$store.commit('quickshop/setSelectedSize', {
            name: '',
            key: '',
            styleId: 0
          })
          this.$store.commit('quickshop/setPlusSizeView', false)
        }
        !this.plusSizeView && this.$store.commit('quickshop/setPlusSize', 0)
      }
    },
    selectSize(size) {
      this.goodsNumber = 1
      if ((this.isSample || this.isClearance) && size.styleId == this.selectedSize.styleId) {
        this.$store.commit('quickshop/setSelectedSize', {
          name: '',
          key: '',
          styleId: 0
        })
      } else {
        this.$store.commit('quickshop/setSelectedSize', size)
        setSelectedSizeLocal(size, this.baseInfo.catId)
      }
      if (size.styleId != 0) {
        this.$store.commit('quickshop/setCustomSizeSelected', false)
      }
    },
    switchUnit() {
      this.unit = this.unit == 'inch' ? 'cm' : 'inch'
      // #17930-切换单位清空数据
      this.$refs.customSize && this.$refs.customSize.getCustomListForm()
      sessionStorage.setItem('ca_unit', this.unit)
    },
    selectSashColor(color) {
      this.sameAsDress = false
      if ((this.isSample || this.isClearance) && color.styleId == this.selectedSashColor.styleId) {
        this.$store.commit('quickshop/setSelectedSashColor', {
          name: '',
          key: '',
          styleId: 0
        })
      } else {
        this.$store.commit('quickshop/setSelectedSashColor', color)
      }
    },
    changeSameAsDress() {
      const sashColor = this.styleInfo.sashColor[this.selectedColor.key]
      if (sashColor) {
        this.sameAsDress = true
        this.$store.commit('quickshop/setSelectedSashColor', sashColor)
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
        checkTips.push(this.nl('page_common_color'))
      }
      if (this.baseInfo.hasSash && this.selectedSashColor.styleId <= 0) {
        checkTips.push(this.nl('page_common_sash_color'))
      }
      if (this.hasSize && this.selectedSize.styleId <= 0 && !this.customSizeSelected) {
        checkTips.push(this.nl('page_common_size'))
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
        this.showCheckTip && isBuyNowBtnHover && document.querySelector('#buy-now')
          ? document.querySelector('#buy-now').offsetWidth + 10 + 'px'
          : '0px'
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
    async getCartInfo() {
      // 导航栏的购物车icon,hover上去有删除功能，删除之后获取购物车状态
      try {
        const res = await this.$axios.$get(`/1.0/cart`, {
          params: { for_checkout: 1, sodGalleryVersion: this.versionObj.sodGalleryVersion.toLowerCase() }
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
    addToBagAjax(formData) {
      const catIds = []
      this.checkoutGoodsList.forEach((item) => {
        if (!catIds.includes(item.catId)) {
          catIds.push(item.catId)
        }
      })
      const msg = JSON.parse(this.biMsgAll)
      if (catIds.length > 0) {
        msg.category_ids = catIds.join(',')
      }
      // 购物车推荐打点
      if (this.fromDialog === 'youmayalsolike') {
        this.setPoint('youmayalsolike', 'addtobag', 'click', msg)
      }
      const sourceTag = this.getSourceTag(this.baseInfo)
      if (sourceTag) {
        formData.set('source_tag', sourceTag)
      }
      //  换购模块商品加车
      if (this.baseInfo.fromRedeemed) {
        formData.set('styles[isRedeemed]', true)
      }
      //  换购模块商品加车
      if (this.fromDialog === 'redeemed' || this.baseInfo.fromRedeemed) {
        formData.set('styles[isRedeemed]', true)
        formData.set('styles[bundleExchangeVersion]', this.versionObj.cartTyingAbtest.toLowerCase())
      }
      this.addToBagGA4()
      this.$axios.$post('/1.0/cart/goods', formData).then((res) => {
        if (res.code == 0) {
          this.retentionAddToCart(
            { ...this.baseInfo, goodsNumber: this.goodsNumber, csText: this.getColorAndSizeText(formData) },
            res.data.rec_id
          )
          // 加入购物车成功后打点
          const tempDiscount = this.baseInfo.discount
          if (tempDiscount && this.baseInfo.dressType === 'clearance') {
            msg.discount = 10 - tempDiscount
          }
          this.buryPoint(this, 'event', {
            ec: 'addtobag',
            el: 'success',
            ea: 'click',
            // param2: this.versionObj.productColorSort,
            param2: this.versionObj.listWithCodeAbtest,
            msg: JSON.stringify(msg)
          })
          if (this.isFindSimilar) {
            this.buryPoint(this, 'event', {
              ec: 'oos',
              el: 'quickshop_success',
              ea: 'click',
              msg: JSON.stringify(msg)
            })
          }
          if (['list', 'showroom', 'product', 'addCartDialog'].includes(this.fromDialog)) {
            this.getCartInfo()
              .then(() => {
                this.$nextTick(() => {
                  let t = 500
                  if (['product'].includes(this.fromDialog)) {
                    document.querySelector('#header-log').scrollIntoView({ block: 'center', behavior: 'smooth' })
                    t = 800
                  }
                  setTimeout(() => {
                    this.$store.commit('setTopCartListShow', true)
                  }, t)
                })
              })
              .finally(() => {
                this.continueCheckoutShow = true
                this.loading = false
                this.$emit('addSuccess')
                this.$parent.$parent.closeQuickShop()
              })
            return
          } else if (['cart', 'youmayalsolike', 'redeemed', 'addOnItems', 'addOnItems_promotion'].includes(this.fromDialog)) {
            // 购物车推荐打点
            if (this.fromDialog === 'youmayalsolike') {
              this.setPoint('youmayalsolike', 'addtobag_success', 'click', msg)
            }
            // 换购打点
            if (this.fromDialog === 'redeemed') {
              this.setPoint('redeemedconfiguration', 'quickshop_success', 'click', msg)
            }
            // 免运费进度条打点
            if (['addOnItems'].includes(this.fromDialog)) {
              this.setPoint('shopping_bag', 'addon_quickshop_success', 'click', msg)
            }
            // 促销活动进度条打点
            if (['addOnItems_promotion'].includes(this.fromDialog)) {
              this.setPoint('shopping_bag_progressbar', 'addon_quickshop_success', 'click', msg)
            }

            // 购物车推荐弹窗,重新获取购物车数据，不会重新刷新页面
            this.$emit('refreshCartList', {
              then: () => {
                this.$nextTick(() => {
                  document.querySelector('#header-log').scrollIntoView({ block: 'center', behavior: 'smooth' })
                })
              },
              finally: () => {
                this.$parent.showPop = false
                this.$parent.$parent.closeQuickShop()
                if (['addOnItems', 'addOnItems_promotion'].includes(this.fromDialog)) {
                  // toast提示加购成功
                  this.$store.commit('cart/setCartErrorMsg', this.nl('page_common_added_success_txt'))
                }
                setTimeout(() => {
                  this.$store.commit('quickshop/setBaseInfo', {})
                }, 300)
              }
            })
            return
          }
          this.addToBagDot()
          this.setOrderSource(this.baseInfo.goodsId)
          this.loading = false
          window.location.href = this.countryUrl(`/cart`)
        } else {
          alert(res.msg)
          this.loading = false
          window.location.reload()
        }
      })
    },
    buyNowAjax(formData) {
      const sourceTag = this.getSourceTag(this.baseInfo)
      if (sourceTag) {
        // comments: 此处的formData就是一个普通的对象
        this.$set(formData, 'source_tag', sourceTag)
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
      const buyNowUrl = this.countryUrl(`/checkout?buy_now=${param}&order_country_code=${this.country}`)
      this.$store.commit('checkout/setBuyNow', param)
      window.location.href = buyNowUrl
    },
    cartEditAjax(formData) {
      // 换购模块商品购物车编辑
      if (this.baseInfo.fromRedeemed && formData.styles) {
        this.$set(formData.styles, 'isRedeemed', true)
      }
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
      this.$store.commit('quickshop/setBaseInfo', {})
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
    chooseItAjax(formData) {
      this.setPoint('select free gift', 'quick shop pop up', 'click')
      formData.set('action', 'add')
      formData.set('gift_activity_id', this.giftActivityId)
      this.$axios
        .$post(`/1.0/gift/goods/select`, formData)
        .then((res) => {
          if (res.code == 0) {
            this.setPoint('select free gift', 'quick shop submit success', 'click')
            this.$parent.$parent.closeQuickShop()
            // 更新赠品弹窗信息
            const updataGiftActivityInfo = res.data
            this.$store.commit('cart/setUpdataGiftActivityInfo', updataGiftActivityInfo)
          } else if (res.code == 800008) {
            // todo 这个打点，还有可能是活动失效了或者活动赠品达到上限
            this.setPoint('select free gift', 'quick shop limite error', 'click')
            this.$store.commit('cart/setCartErrorMsg', (res && res.msg) || 'Error')
          } else {
            this.$emit('refreshGiftActivity')
            this.$store.commit('cart/setCartErrorMsg', (res && res.msg) || 'Error')
          }
        })
        .catch((error) => {
          console.log('selectError:', error)
          this.$store.commit('cart/setCartErrorMsg', (error && error.msg) || 'Error')
        })
        .finally(() => {
          this.chooseItLoading = false
          this.$parent.$parent.closeQuickShop()
        })
    },
    getNotifyMeParams(item) {
      if (this.fromDialog == 'list') {
        const msg = {
          goodsId: item.goodsId,
          color: item.colorReal,
          cat_name: item.catName,
          dress_type: item.dressType,
          cat_id: item.catId,
          no: this.indexNo
        }
        if (this.sortBy && this.sortBy != -1) {
          msg.sort_by = this.sortBy
        }
        return {
          common: {
            ec: 'notifyme',
            el: 'notice',
            msg: JSON.stringify(msg)
          }
        }
      }
    },
    // quickshop,点击addtobag加购打点
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
    setPoint(ec, el, ea, msg1 = {}) {
      const msg = JSON.parse(this.biMsgAll)
      if (this.indexNo) {
        msg.no = this.indexNo
        msg.sort_by = this.sortBy
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
        msg: JSON.stringify({ ...msg, ...msg1 })
      })
    },
    selectStockSize(size) {
      this.selectSize(size)
      if (this.isSpecialCatId(this.baseInfo.catId) && this.baseInfo.isMassProduct == 0) {
        this.tabChange && this.tabChange(size.keyStr == 'customSize')
      }
      this.$nextTick(() => {
        if (this.beBackSoonGoods) {
          this.showNotifyDialog = false
          this.notifyMeSelectSize = size
          if (!this.baseInfo.isFinalSale) {
            this.$store.commit('setOpenNotifyMe', true)
          }
          return false
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
    checkSelect(selectType) {
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
            //
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
        if (this.isSample || this.isClearance || this.baseInfo.isFinalSale) {
          if (this.isSample && ['sizeNoStock', 'noColorAndNoStock'].includes(tipStatus.key)) {
            this.getSampleSimilar()
          } else {
            this.showSampleSimilar = false
          }
        }
        if (selectType == 'color' && this.disable) {
          // 库存其他颜色的size 当前颜色是否有  没有则重置尺码为空
          this.tipStatus = {
            key: 'default',
            stockNumber: 0,
            tipsRed: false,
            statusRed: false
          }
          this.disable = false
          this.selectSize({
            name: '',
            key: '',
            styleId: 0
          })
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
    changeDialogStatus() {
      if (this.beBackSoonGoods) {
        this.showNotifyDialog = false
        this.$store.commit('setOpenNotifyMe', true)
        return
      }
      if (this.giftActivityId || this.fromDialog == 'cartFreeGift') {
        // 如果是买赠活动的赠品quick shop 弹窗，不展示
        return false
      }
      this.showNotifyDialog = !this.showNotifyDialog
    },
    setOrderSource(goodsId) {
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        if (this.$cookie.getCookie('trace_order_from_mail') == 'dressstartat29') {
          this.$cookie.setCookie('dressstartat29-' + goodsId, 1, 7, '.' + this.APP_DOMAIN_LOWER)
        }
      }
      if (!(this.isSample || this.isClearance || this.baseInfo.isFinalSale || this.baseInfo.isStockGoods || this.isNormalStock)) {
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
    trackParams(ec, el, from) {
      if (!this.isSpecialCatId(this.baseInfo.catId)) return {}
      const common = {
        ec,
        el
      }
      const msg = {
        goodsId: this.baseInfo.goodsId,
        color: this.selectedColor.key,
        size: this.selectedSize.key,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType || this.dressType,
        cat_id: this.baseInfo.catId
      }
      if (from && this.isSpecialCatId(this.baseInfo.catId)) {
        msg.cdn_prvd = this.cdnPrvd(this.baseInfo.catId)
        msg.ab = (this.getSodGalleryVersion || 'A').toLowerCase()
      }
      return {
        id: 'quickshop-' + this.baseInfo.goodsId + ec + el + from + msg.color + msg.size,
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
    }
  }
}
