<template>
  <div class="shop-the-look-match-item">
    <span class="product-name">{{ info.baseInfo.goodsTitle ? info.baseInfo.goodsTitle : info.baseInfo.shownGoodsName }}</span>
    <p class="product-subtitle">{{ info.baseInfo.goodsSubTitle }}</p>
    <span class="product-price">{{ info.baseInfo.shopPriceDisplay }}</span>
    <div class="product-info">
      <img :src="addWebpSuffix(productImg)" :alt="info.baseInfo.shownGoodsName" class="product-img" />
      <div ref="productColorSize" class="product-color-size">
        <div class="color-select-box">
          <div @click="showColorOptions = !showColorOptions" class="color-select">
            <div :style="getColorStyle(selectedColor.key)" class="color-shown"></div>
            <span class="color-name">{{ selectedColor.name }}</span>
            <az-icon :style="showColorOptions ? 'transform:rotate(180deg)' : ''" icon-class="icon-lby_expand_arrow_down"></az-icon>
          </div>
          <div v-show="showColorOptions" :style="{ width: Object.keys(allColors).length <= 5 ? '200px' : '333px' }" class="color-options">
            <color-list :colors="allColors" :selected-color-id="selectedColor.styleId" @select-color="handleSelectColor"></color-list>
          </div>
        </div>
        <az-select
          v-if="info.styleInfo.hasSize"
          :width="200"
          :height="45"
          :options="allSizes"
          :max-num="10"
          :placeholder="nl('page_common_size')"
          :options-position="optionsUpper ? 'upper' : ''"
          :err-tips="errTips"
          :default-value="selectedSize.key"
          @on-change="handleSizeChange"
        ></az-select>
        <az-select-input v-else :value="goodsNumber" @changeNumber="changeNumber"></az-select-input>
        <div v-if="stockTips" class="stock-tips">{{ stockTips }}</div>
        <az-button @click="clickAddToBag" :disable="disabled" :class="{ loading: loading }" class="btn">{{ btnText }}</az-button>
        <div class="product-showroom">
          <!-- <az-fav-icon
            v-track.click="{ common: getBiParams('complete the look', 'showroom') }"
            :goodsId="info.baseInfo.goodsId"
            :colorId="info.baseInfo.colorId"
            :goodsCatId="info.baseInfo.catId"
            :showSignLayer="true"
            :signLayerSource="signLayerSource"
          ></az-fav-icon> -->
          <a
            v-track.click="{ common: getBiParams('complete the look', 'viewdetail') }"
            :href="countryUrl(info.baseInfo.goodsUrl)"
            class="view-details"
            >{{ nl('page_common_view_details') }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/AzButton.vue'
import AzSelect from '@/components/az-ui/AzSelect.vue'
// import AzFavIcon from '@/components/az-ui/AzFavIcon'
import ColorList from '@/components/product/style/ColorList'
import AzSelectInput from '@/components/az-ui/Select/AzSelectInput'
import colorHex from '@/assets/js/colorHex'
import { mapState } from 'vuex'

/**
 * 搭配商品弹框中的每个商品项
 */
export default {
  name: 'ShopTheLookMatchItem',
  languageKeys: [
    'page_common_size',
    'page_common_view_details',
    'page_common_open',
    'page_order_add2bag',
    'page_showroom_added_to_bag',
    'page_product_only',
    'page_product_only_order_soon',
    'page_goods_select_size_tip'
  ],
  components: {
    AzButton,
    AzSelect,
    // AzFavIcon,
    ColorList,
    AzSelectInput
  },
  mixins: [colorHex],
  props: {
    // 详细数据
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // options是否在上方展示
    optionsUpper: {
      type: Boolean,
      default: false
    },
    shopTheLookIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      disabled: false, // 按钮disabled状态
      loading: false,
      isAdded: false, // 是否已经加车
      showColorOptions: false,
      selectedColor: {}, // 选中的颜色
      selectedSize: {}, // 选中的尺码
      goodsNumber: 1, // 商品数量
      errTips: '',
      stockInfo: {}, // 库存信息
      tipStatus: {
        key: 'default',
        stockNumber: 0,
        tipsRed: false,
        statusRed: false
      }
    }
  },
  computed: {
    ...mapState('product', ['fromShowroom', 'fromWhatAreU', 'recommendFlag', 'fromDetailsEntry', 'fromInstagram']),
    isSupportStock() {
      return this.info.baseInfo.isStockGoods || this.info.baseInfo.supportStockSales
    },
    signLayerSource() {
      let href = location.href
      if (!href.includes('shopTheLookIndex')) {
        if (href.includes('?')) {
          href += '&shopTheLookIndex=' + this.shopTheLookIndex
        } else {
          href += '?shopTheLookIndex=' + this.shopTheLookIndex
        }
      }
      return href
    },
    // 有库存的尺码
    sizeStock() {
      if (!this.info.styleInfo.hasSize || !this.stockInfo.hasOwnProperty('sizeMap')) {
        return []
      }
      let res = []
      for (const i in this.stockInfo.sizeMap) {
        if (this.stockInfo.sizeMap[i].hasStock) {
          res.push(i)
        }
      }
      if (this.selectedColor.key != '') {
        if (
          !this.stockInfo.colorMap[this.selectedColor.key] ||
          !Object.keys(this.stockInfo.colorMap[this.selectedColor.key]).length ||
          !this.stockInfo.colorMap[this.selectedColor.key].inStockSize
        ) {
          return []
        }
        const inStockSize = Object.keys(this.stockInfo.colorMap[this.selectedColor.key].inStockSize)
        res = this.getIntersect(res, inStockSize)
      }
      return res
    },
    // 所有颜色数据
    allColors() {
      const res = {}
      if (this.info.styleInfo.hasColor) {
        const colors = this.info.styleInfo.color
        for (const key in colors) {
          if (Object.hasOwnProperty.call(colors, key)) {
            let hideColor = false
            const { colorMap = {} } = this.stockInfo
            const { allSize = {}, hideSize = {} } = colorMap[key] || {}
            if (this.isSpecialCatId(this.info.baseInfo.catId) && Object.keys(colorMap).length) {
              hideColor = Object.keys(allSize).length === Object.keys(hideSize).length
            }
            if (!hideColor) {
              res[key] = colors[key]
            }
          }
        }
      }
      return res
    },
    // 所有尺码数据
    allSizes() {
      const res = []
      if (!this.info.styleInfo.hasSize) {
        // 没有size的时候，是批量商品，展示可选数量
        for (let i = 1; i <= 10; i++) {
          res.push({
            key: i,
            name: i
          })
        }
      } else if (this.info.baseInfo.isFinalSale) {
        for (const i in this.stockInfo.sizeMap) {
          res.push(this.styleInfo.styleInfoSizeMap[i])
        }
      } else {
        for (const key in this.info.styleInfo.size) {
          if (Object.hasOwnProperty.call(this.info.styleInfo.size, key)) {
            const ele = this.info.styleInfo.size[key]
            const hasStock = this.info.baseInfo.isStockGoods ? this.sizeStock.includes(ele.key) : true
            res.push({
              ...ele,
              disabled: !hasStock,
              name: hasStock ? ele.name : ele.name + ' (Out of Stock)'
            })
          }
        }
      }
      return res
    },
    // 按钮文本
    btnText() {
      if (this.loading) {
        return this.nl('page_common_open')
      } else if (this.isAdded) {
        return this.nl('page_showroom_added_to_bag')
      } else {
        return this.nl('page_order_add2bag')
      }
    },
    // 商品图片，跟随颜色切换变化
    productImg() {
      const currentImg = this.selectedColor.key
        ? this.info.imageInfo.goodsGallery[this.selectedColor.key].images[0].imgUrl
        : this.info.baseInfo.goodsThumb
      return this.info.imageInfo.browserPrefix + currentImg
    },
    // 剩余库存数量提示
    stockTips() {
      if (!this.selectedColor.key) return ''
      if (this.stockInfo.hasStock) {
        let stockNumber = 0 // 剩余库存数量
        const hasColor = this.info.styleInfo.hasColor
        const hasSize = this.info.styleInfo.hasSize
        // stockInfo.stockNumberMap中的数据为当前商品sku的库存对应数据
        if (hasColor && !hasSize) {
          stockNumber = this.stockInfo.stockNumberMap[this.selectedColor.key]
        } else if (hasColor && hasSize) {
          if (!this.selectedSize.key) return ''
          stockNumber = this.stockInfo.stockNumberMap[this.selectedColor.key + '*' + this.selectedSize.key]
        }
        // 库存剩余小于5或3的时候提示
        if ((this.info.baseInfo.supportStockSales && stockNumber <= 5) || stockNumber <= 3) {
          return `${this.nl('page_product_only')} ${stockNumber} ${this.nl('page_product_only_order_soon')}`
        }
      }
      return ''
    }
  },
  mounted() {
    for (const key in this.allColors) {
      if (Object.hasOwnProperty.call(this.allColors, key) && key === this.info.baseInfo.color) {
        this.selectedColor = this.allColors[key]
        break
      }
    }
    // 如果没有尺码，展示可选数量，默认1
    if (!this.info.styleInfo.hasSize) {
      this.selectedSize = {
        key: 1,
        name: 1
      }
    }

    this.queryStockInfo()
  },
  methods: {
    getBiParams(ec, el, ea) {
      if (process.server) return
      const obj = {
        ec,
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.info.baseInfo.goodsId,
          cat_name: this.info.baseInfo.catName,
          cat_id: this.info.baseInfo.catId
        })
      }
      return obj
    },
    getIntersect(a, b) {
      if (Array.isArray(a) && Array.isArray(b)) {
        const set1 = new Set(a)
        const set2 = new Set(b)
        return Array.from(new Set([...set1].filter((x) => set2.has(x))))
      }
      return []
    },
    // 查询库存信息
    queryStockInfo() {
      if (this.isSupportStock) {
        this.$axios.$get('/1.0/stock/' + this.info.baseInfo.goodsId + '?dress_type=' + this.info.baseInfo.dressType).then((res) => {
          if (res && res.data) {
            this.stockInfo = res.data
            this.disabled = !res.data.hasStock
          }
        })
      }
    },
    // 选择颜色项后的操作
    handleSelectColor(e) {
      this.selectedColor = e
      this.showColorOptions = false
    },
    // 选择尺码后的操作
    handleSizeChange(e) {
      this.selectedSize = e
      this.errTips = ''

      if (!this.info.styleInfo.hasSize) {
        this.goodsNumber = e.key
      }
    },
    // 数量修改
    changeNumber(e) {
      this.goodsNumber = e
    },
    // 校验尺码选择，数量选择
    checkSelected() {
      // 如果没有选择尺码，提示选择尺码
      if (this.info.styleInfo.hasSize && !this.selectedSize.key) {
        this.errTips = this.nl('page_goods_select_size_tip')
        // 将错误提示滚动到可视区域
        this.$refs.productColorSize.scrollIntoView({ block: 'center', behavior: 'smooth' })
        return false
      }
      return true
    },
    // 点击加购
    clickAddToBag() {
      const params = this.getBiParams('complete the look', 'addtobag', 'click')
      this.buryPoint(this, 'event', params)
      const res = this.checkSelected()
      if (res) {
        this.addToBag()
      }
    },
    // 加入购物车
    addToBag() {
      this.loading = true
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', this.info.baseInfo.goodsId)
      formData.set('dress_type', this.info.baseInfo.dressType)
      formData.set('from_showroom', this.fromShowroom)
      formData.set('from_whatAreU', this.fromWhatAreU)
      formData.set('recommend_flag', this.recommendFlag)
      formData.set('from_details_entry', this.fromDetailsEntry)
      formData.set('from_instagram', this.fromInstagram)
      formData.set('styles[freeStyle]', false)
      formData.set('styles[size_type]', this.unit == 'inch' ? '_inch' : '_cm')
      if (this.info.styleInfo.hasColor) {
        formData.set('styles[select][color]', this.selectedColor.styleId)
      }
      if (this.info.styleInfo.hasSize) {
        formData.set('styles[select][size]', this.selectedSize.styleId)
      }
      formData.set('goods_number', this.goodsNumber)
      this.$axios.$post('/1.0/cart/goods', formData).then((res) => {
        if (res.code == 0) {
          this.retentionAddToCart(
            { ...this.info.baseInfo, goodsNumber: this.goodsNumber, csText: this.getColorAndSizeText(formData) },
            res.data.rec_id
          )
          // 通知父组件，执行加购操作成功
          this.$emit('onAddedToCart', true)
          this.loading = false
          this.isAdded = true
          setTimeout(() => {
            this.isAdded = false
          }, 3000)
          this.getCartInfo()
          // 加入购物车成功后打点
          const tempMsg = {
            goodsId: this.info.baseInfo.goodsId,
            color: this.selectedColor.key,
            size: this.selectedSize.key,
            cat_name: this.info.baseInfo.catName,
            dress_type: this.info.baseInfo.dressType || this.dressType,
            cat_id: this.info.baseInfo.catId
          }
          if (this.info.baseInfo.catId == 33) {
            tempMsg.has_line_price = this.info.baseInfo.hasLinePrice ? 1 : 0
          }
          const tempDiscount = this.info.baseInfo.discount
          if (tempDiscount && this.info.baseInfo.dressType === 'clearance') {
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
          const params = this.getBiParams('complete the look', 'addtobagsuccess', 'click')
          this.buryPoint(this, 'event', params)
        } else {
          alert(res.msg)
          this.loading = false
        }
      })
    },
    // 获取购物车数据，更新购物车相关数据
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
    }
  }
}
</script>
<style lang="less" scoped>
.shop-the-look-match-item {
  width: 375px;
  font-size: 14px;
  line-height: 19px;
  color: var(--color-121212);
  .product {
    &-name {
      font-family: @font-family-600;
      margin-bottom: 5px;
    }
    &-subtitle {
      margin-bottom: 5px;
    }
    &-info {
      width: 100%;
      height: 228px;
      margin-top: 10px;
    }
    &-img {
      float: left;
      width: 165px;
      height: 228px;
    }
    &-color-size {
      float: right;
      width: 200px;
      height: 228px;
      position: relative;
      > * {
        margin-bottom: 10px;
      }
      .btn {
        height: 45px;
        line-height: 45px;
        font-family: @font-family-600;
        &.loading {
          background: #f1d8db !important;
        }
      }
      /deep/ .az-select {
        flex-direction: column;
        .az-select-main {
          padding: 0px 15px;
        }
        .theme-warning {
          width: 100%;
        }
      }
      /deep/ .az-select-input {
        margin-left: 0px;
        width: 100%;
        height: 45px;
        .input {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0px 15px;
          input {
            width: 100px;
            padding-left: 0px;
            font-size: 14px;
            line-height: 19px;
          }
          .az-icon {
            position: initial;
            width: 12px;
            height: 12px;
            z-index: unset;
          }
        }
        .num-select {
          width: 100%;
          max-height: 225px;
          top: 45px;
          ul {
            li {
              height: 45px;
              line-height: 45px;
              padding-left: 15px;
            }
          }
        }
      }
      .stock-tips {
        color: red;
        font-size: 14px;
        line-height: 19px;
      }
    }
    &-showroom {
      position: absolute;
      bottom: 0px;
      right: 0px;
      height: 36px;
      width: 100%;
      margin-bottom: 0px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      /deep/ .icon-fav-wrapper {
        position: relative;
        .az-fav-icon {
          position: initial;
          .az-icon {
            width: 36px;
            height: 36px;
          }
        }
      }
      .view-details {
        margin-left: 20px;
        font-size: 12px;
        line-height: 16px;
        text-decoration-line: underline;
        color: var(--color-121212);
        text-transform: capitalize;
      }
    }
  }
}
.color {
  &-select {
    padding: 0px 15px;
    width: 200px;
    height: 45px;
    border: 1px solid var(--color-cccccc);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    .az-icon {
      font-size: 12px;
      transition: 0.3s;
    }
    &-box {
      position: relative;
    }
  }
  &-shown {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: red;
    margin-right: 15px;
  }
  &-name {
    flex: 1;
    font-size: 14px;
    line-height: 19px;
    text-transform: uppercase;
    font-family: @font-family-600;
    text-align: left;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &-options {
    position: absolute;
    top: 45px;
    right: 0px;
    box-sizing: border-box;
    padding: 10px 5px 0px 12px;
    border: 1px solid var(--color-cccccc);
    background: #fff;
    z-index: 1;
    /deep/ .color-list {
      margin-bottom: 0px;
    }
  }
}
</style>
