<template>
  <div class="sample-style">
    <div class="style-block">
      <div v-if="hasSize" class="size-block">
        <size-label :is-stock-goods="isStockGoods" :baseInfo="baseInfo" :hasSizeChart="hasSizeChart"></size-label>
        <notify-dialog
          @show-notify-dialog="changeDialogStatus"
          :show-dialog="showNotifyDialog"
          :baseInfo="baseInfo"
          :is-sample="isSample"
          v-bind="notifyBindValue"
        ></notify-dialog>
        <template v-if="showSizeNotifyLabel">
          <notify-label @click="changeDialogStatus" :is-sample="isSample" :is-stock-goods="isStockGoods" :stock="sizeStock"></notify-label>
        </template>
        <div v-if="isClearance && baseInfo.catId != 18" class="new-dress">
          {{ nl('page_common_size_order_new_part') }}
          <a :href="countryUrl(baseInfo.goodsDefaultUrl)" @click="setPoint('newdress', 'newdress', 'click')">{{
            nl('page_common_new_dress')
          }}</a>
          {{ nl('page_common_here') }}
        </div>
        <size-list
          :stock="sizeStock"
          :size-hover-tip="sizeHoverTip"
          :sizes="sizes"
          :selected-size-id="selectedSize.styleId"
          :is-stock-goods="isStockGoods"
          :hide-size-map="hideSizeMap"
          @select-size="selectStockSize"
        ></size-list>
      </div>
      <div v-if="hasColor" class="color-block">
        <color-label :selected-color="selectedColor" :shop-more="shopMore" :is-dress="baseInfo.isDress" :baseInfo="baseInfo"></color-label>
        <template v-if="showColorNotifyLabel">
          <notify-label @click="changeDialogStatus" :is-sample="isSample" :is-stock-goods="isStockGoods" :stock="colorStock"></notify-label>
        </template>
        <!--详情页色系色圈 -->
        <!-- <color-family-list
          v-if="showProductColorFamily(colorsFormat.shown)"
          :productColorFamily="colorsFormat.shownColorFamily"
          :stock="colorStock"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          @select-color="selectStockColor"
          :selectedColor="selectedColor"
          :baseInfo="baseInfo"
          :colorInfoId="colorInfoId"
        ></color-family-list> -->
        <color-list
          :stock="colorStock"
          :colors="colorsFormat.shown"
          :selected-color-id="selectedColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          :isFromProduct="true"
          @select-color="selectStockColor"
        ></color-list>
      </div>
      <div v-if="baseInfo.hasSash" class="sash-block">
        <color-label
          :selected-color="selectedSashColor"
          :shop-more="baseInfo.shopMore"
          :is-sash-color="true"
          :baseInfo="baseInfo"
        ></color-label>
        <color-list
          :stock="sashStock"
          :colors="sashColorsFormat.shown"
          :selected-color-id="selectedSashColor.styleId"
          :is-stock-goods="isStockGoods"
          :stock-info="stockInfo"
          @select-color="selectStockSashColor"
          @select-same-as-dress="changeSameAsDress"
        ></color-list>
      </div>
      <stock-tips
        v-if="showStockTips"
        :tip-status="tipStatus"
        :is-sample="isSample"
        :is-clearance="isClearance"
        :show-sample-similar="showSampleSimilar"
        :isSimilarLoading="isSimilarLoading"
      ></stock-tips>
      <similar-swiper
        id="sampleSimilar"
        v-if="showSampleSimilar"
        @quickShop="quickShopClick"
        :isLoading="isSimilarLoading"
        @handleLoad="handleLoad"
        :loadMoreLoading="loadMoreLoading"
      ></similar-swiper>
      <template v-if="!beBackSoonGoods && !(baseInfo.isFinalSale && showNotifyMeBtn)">
        <sample-confirm @click="check" :selected="confirmSelected" :base-info="baseInfo"></sample-confirm>
      </template>
    </div>
    <!-- 没有库存的情况下展示notifyme或sold out 按钮 -->
    <div v-if="showNotifyMeBtn" class="add-to-bag-block">
      <az-button
        id="sold-out"
        v-if="isClearance || baseInfo.isFinalSale"
        :disable="true"
        :text="nl('page_common_sold_out')"
        class="sold-out-btn"
      ></az-button>
      <az-button
        id="notify-me"
        v-else-if="!baseInfo.isFinalSale"
        @click="changeDialogStatus"
        :text="nl('page_notify_me')"
        v-track.view.click="trackParams('notifyme', 'notifyme')"
        icon="icon-icon_notice"
        class="notify-btn"
      ></az-button>
    </div>
    <div v-else class="add-to-bag-block">
      <!-- 购物车商品编辑 -->
      <az-button
        id="add-to-bag"
        @click="addToBag"
        @mouseenter.native="checkStyle(false)"
        @mouseleave.native="hideCheckTip"
        :text="nl('page_order_add2bag')"
        :loading="loading"
        :disable="disable"
        icon="icon-xxy_add_to_bag"
      ></az-button>
      <az-button
        id="buy-now"
        @click="buyNow"
        @mouseenter.native="checkStyle(true)"
        @mouseleave.native="hideCheckTip"
        :textColor="'var(--color-121212)'"
        :color="'#fff'"
        :text="nl('page_common_buy_now')"
        :loading="buyNowLoading"
        :disable="disable"
        :icon="isBridal ? 'iconicon_buy_now-bridal' : 'iconicon_buy_now'"
      ></az-button>
      <check-tips v-show="showCheckTip" :tipsLeft="checkTipsLeftPosition" :tips="checkTips"></check-tips>
    </div>
    <client-only>
      <section v-show="!beBackSoonGoods && deliveryInit" class="rush-delivery-box">
        <rush-select v-if="!isCurrentStyleSupportStock && baseInfo.rushSelectItems" :baseInfo="baseInfo" />
        <address-delivery-info
          id="wgd-delivery"
          ref="delivery"
          :baseInfo="baseInfo"
          :makeTimeInfo="makeTimeInfo"
          :goodsNumber="goodsNumber"
        ></address-delivery-info>
      </section>
      <add-cart-dialog @quickShop="quickShopClick" :goodsNumber="goodsNumber" v-if="showAddCartDialog"></add-cart-dialog>
      <NotifyMeDialog v-if="openNotifyMe" v-bind="notifyMeDialogValue" />
      <AzToast ref="sampleAddBagError" :message="toastMsg" :duration="2000" />
    </client-only>
    <sample-link v-if="showSampleLink && !showTryBeforeYouBuyNew" :baseInfo="baseInfo"></sample-link>
  </div>
</template>

<script>
import styleMixins from '@/assets/js/styleMixins'
import ColorList from '@/components/product/style/ColorList'
import ColorLabel from '@/components/product/style/ColorLabel'
import SizeList from '@/components/product/style/SizeList'
import SizeLabel from '@/components/product/style/SizeLabel'
import CheckTips from '@/components/product/style/CheckTips'
import AzButton from '@/components/az-ui/AzButton'
import StockTips from '@/components/product/style/StockTips'
import NotifyLabel from '@/components/product/style/NotifyLabel'
import NotifyDialog from '@/components/product/style/NotifyDialog'
import SampleConfirm from '@/components/product/style/SampleConfirm'
import SimilarSwiper from '@/components/product/style/SimilarSwiper'
import SampleLink from '@/components/product/style/SampleLink'
import AddCartDialog from '@/components/cart/AddCartDialog'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import RushSelect from '@/components/product/style/RushSelect'
import AddressDeliveryInfo from '@/components/product/AddressDeliveryInfo'
// import ColorFamilyList from '@/components/product/style/ColorFamilyList'
import AzToast from '@/components/az-ui/AzToast'

export default {
  name: 'SampleStyle',
  languageKeys: [
    'page_common_size_order_new_part',
    'page_common_new_dress',
    'page_common_here',
    'page_common_sold_out',
    'page_notify_me',
    'page_order_add2bag',
    'page_common_buy_now',
    'page_product_only_unit',
    'page_common_only',
    'page_common_out_of_stock',
    ...SampleLink.languageKeys,
    ...SampleConfirm.languageKeys,
    ...NotifyDialog.languageKeys,
    ...NotifyLabel.languageKeys,
    ...StockTips.languageKeys,
    ...SizeLabel.languageKeys,
    ...SizeList.languageKeys,
    ...ColorLabel.languageKeys,
    ...ColorList.languageKeys,
    ...AddCartDialog.languageKeys,
    ...NotifyMeDialog.languageKeys,
    ...RushSelect.languageKeys,
    ...AddressDeliveryInfo.languageKeys
    // ...ColorFamilyList.languageKeys
  ],
  components: {
    SampleLink,
    SampleConfirm,
    NotifyDialog,
    NotifyLabel,
    StockTips,
    CheckTips,
    AzButton,
    SizeLabel,
    SizeList,
    ColorLabel,
    ColorList,
    AddCartDialog,
    NotifyMeDialog,
    SimilarSwiper,
    RushSelect,
    AddressDeliveryInfo,
    // ColorFamilyList,
    AzToast
  },
  mixins: [styleMixins],
  data() {
    return {
      isStockGoods: true,
      disable: false,
      confirmSelected: false,
      sampleSimilarSize: '',
      showSampleSimilar: false,
      isSimilarLoading: false,
      tempFindSimilarDataObj: {}, // 为了减少服务器的压力，记录请求结果
      tempFindSimilarDataKeys: [], // 只保留近20次请求
      loadMoreLoading: false // 轮播加载下一页的时候的loading态
    }
  },
  computed: {
    showColorNotify() {
      if (this.hasSize || this.isClearance || this.baseInfo.isFinalSale) {
        return false
      }
      return this.stockInfo.outOfStockColorMap && this.stockInfo.outOfStockColorMap.hasOwnProperty(this.selectedColor.key)
    }
  },
  mounted() {
    this.checkSelect()
    // add to bag 按钮打点
    this.setPoint('addtobag', 'addtobag', 'view')
    this.setPoint('buynow', 'buynow', 'view')
    if (this.isClearance && this.baseInfo.catId != 18) {
      this.setPoint('newdress', 'newdress', 'view')
    }
    this.setCompletePosition()
  },
  methods: {
    // 显示try on 弹框
    showTryOnPopup() {
      this.$store.commit('product/setShowTryOnPopup', true)
    },
    selectStockColor(color) {
      this.$store.commit('product/setShowStockTips', false)
      this.selectColor(color)
      this.$nextTick(() => {
        // #17070: 样衣取消掉点无库存尺码或颜色，自动弹出notifyme的逻辑
        if (this.beBackSoonGoods) {
          this.$store.commit('product/setShowNotifyDialog', false)
          this.notifyMeSelectColor = color
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
    check() {
      this.confirmSelected = !this.confirmSelected
    },
    checkSelectSample() {
      this.tipStatus = {
        key: 'default',
        stockNumber: 0,
        tipsRed: false,
        statusRed: false
      }
      // 颜色和size都未选择的时候，不处理
      if (!this.selectedSize.key && !this.selectedColor.key) {
        this.showSampleSimilar = false
        return false
      }
      // 处理状态
      this.checkNoSashSample()
      // 获取缺货推荐findSimilar
      if (!['default', 'hasStock'].includes(this.tipStatus.key)) {
        this.getFindSimilar()
      } else {
        this.showSampleSimilar = false
      }
    },

    checkNoSashSample() {
      if (this.selectedSize.key && this.selectedColor.key) {
        // 选了size和color
        const sizeStock = this.stockInfo.sizeMap ? this.stockInfo.sizeMap[this.selectedSize.key] : {}
        if (sizeStock.hasStock) {
          if (sizeStock.inStockColor && sizeStock.inStockColor[this.selectedColor.key]) {
            // 选择有库存尺码+有库存颜色
            this.tipStatus = {
              key: 'hasStock',
              stockNumber: this.stockInfo.stockNumberMap[this.selectedColor.key + '*' + this.selectedSize.key],
              tipsRed: true,
              statusRed: false
            }
          } else {
            // 选择有库存尺码+无库存颜色
            this.tipStatus = {
              key: 'sizeStockColorNoStock',
              stockNumber: 0,
              tipsRed: false,
              statusRed: true
            }
          }
        } else {
          const colorStock = this.stockInfo.colorMap ? this.stockInfo.colorMap[this.selectedColor.key] : {}
          if (colorStock.hasStock) {
            // 选择无库存尺码+有库存颜色
            this.tipStatus = {
              key: 'sizeNoStockColorStock',
              stockNumber: 0,
              tipsRed: false,
              statusRed: true
            }
          } else {
            // 选择无库存尺码+无库存颜色
            this.tipStatus = {
              key: 'sizeNoStockColorNoStock',
              stockNumber: 0,
              tipsRed: false,
              statusRed: true
            }
          }
        }
      } else if (this.selectedColor.key && !this.selectedSize.key) {
        // 选了color未选size
        const colorStock = this.stockInfo.colorMap ? this.stockInfo.colorMap[this.selectedColor.key] : {}
        if (!colorStock.hasStock) {
          // 选择无库存颜色+未选择尺码
          this.tipStatus = {
            key: 'colorNoStockNoSelSize',
            stockNumber: 0,
            tipsRed: false,
            statusRed: true
          }
        }
      }
    },
    getFindSimilar(loadMoreFindSimilarKey) {
      // 注意： ！！！ #17082 这个需求只改样衣的详情页的推荐， quickshop的不改，所以这个组件跟 quickshop的 sampleStyle 区别会很大，如果后续quickshop的也需要改成跟详情页的逻辑一致的话，可以参考这个组件
      const params = {
        goods_id: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        color: this.selectedColor && this.selectedColor.key,
        size: this.selectedSize && this.selectedSize.key,
        view_mode: this.selectedSize && this.selectedSize.isPlusSize ? 'plus' : 'petite',
        abtest: 'a',
        page: 1
      }

      const findSimilarKey = `${params.goods_id}*${params.cat_id}*${params.color}*${params.size}`
      // 如果轮播加载的loadMoreFindSimilarKey跟当前的findSimilarKey不一致，则不处理
      if (loadMoreFindSimilarKey && loadMoreFindSimilarKey !== findSimilarKey) return false
      this.isSimilarLoading = !loadMoreFindSimilarKey // 轮播过程中加载数据不需要整个模块加loading态
      this.showSampleSimilar = true

      if (this.tempFindSimilarDataObj[findSimilarKey] && !loadMoreFindSimilarKey) {
        // 先取tempFindSimilarDataObj里面的数据，如果有就不请求接口了，缓解服务器压力
        this.$store.commit('product/setFindSimilarData', this.tempFindSimilarDataObj[findSimilarKey])
        this.$nextTick(() => {
          this.handleFindSimilarData()
          this.isSimilarLoading = false
        })
      } else {
        if (loadMoreFindSimilarKey) {
          // page需要+1
          params.page = this.findSimilarData.page * 1 + 1
          this.loadMoreLoading = true
        }
        this.$axios
          .$get('/1.0/recommend/sample-find-similar', { params })
          .then((res) => {
            if (res.code == 0) {
              // 最多只保留20个请求数据结果，防止数据过大导致页面卡顿
              if (this.tempFindSimilarDataKeys.length >= 20) {
                const removeKey = this.tempFindSimilarDataKeys[0]
                if (removeKey && this.tempFindSimilarDataObj[removeKey]) {
                  delete this.tempFindSimilarDataObj[removeKey]
                  this.tempFindSimilarDataKeys.shift()
                }
              }
              const findSimilarData = res.data || {}
              const newProdList = findSimilarData.prodList || []
              // 把接口结果存到tempFindSimilarDataObj里，后续相同的组合入参，可以直接取已有的数据，缓解服务器压力
              if (this.tempFindSimilarDataObj[findSimilarKey] && this.tempFindSimilarDataObj[findSimilarKey].prodList) {
                this.tempFindSimilarDataObj[findSimilarKey] = {
                  ...findSimilarData,
                  findSimilarKey,
                  prodList: this.tempFindSimilarDataObj[findSimilarKey].prodList.concat(newProdList)
                }
              } else {
                this.tempFindSimilarDataObj[findSimilarKey] = { ...findSimilarData, findSimilarKey }
                this.tempFindSimilarDataKeys.push(findSimilarKey)
              }

              // 当前选中的size,color组合
              const currentFindSimilarKey = `${this.baseInfo.goodsId}*${this.baseInfo.catId}*${this.selectedColor &&
                this.selectedColor.key}*${this.selectedSize && this.selectedSize.key}`
              // 请求结果跟当前的选中size,color 不一致的时候，不处理赋值，不然因为接口返回时效问题会导致页面一直在跳动变化
              if (currentFindSimilarKey !== findSimilarKey) {
                return false
              }

              this.$store.commit('product/setFindSimilarData', {
                ...this.tempFindSimilarDataObj[findSimilarKey]
              })
              if (!loadMoreFindSimilarKey) {
                // 轮播过程中加载数据不重新定位
                this.handleFindSimilarData()
              }
            } else {
              this.showSampleSimilar = false
            }
          })
          .catch(() => {
            this.showSampleSimilar = false
          })
          .finally(() => {
            this.isSimilarLoading = false
            this.loadMoreLoading = false
          })
      }
    },
    handleLoad(loadMoreFindSimilarKey) {
      this.getFindSimilar(loadMoreFindSimilarKey)
    },
    handleFindSimilarData() {
      // 样衣有无库存推荐模块的话，需要滚动到可视区域
      if (this.findSimilarData.recommendType === 'similar' && this.findSimilarData.prodList && this.findSimilarData.prodList.length > 0) {
        this.$nextTick(() => {
          const sampleSimilarDom = document.querySelector('#sampleSimilar')
          sampleSimilarDom && sampleSimilarDom.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
        })
      } else {
        this.showSampleSimilar = false
      }
    },
    addToBag() {
      if (!this.handleCheck()) return
      if (!this.allReady || this.tipStatus.stockNumber < this.goodsNumber) {
        return false
      }
      // 加车按钮不报错点击数量
      this.setDataLayer({
        category: 'DetailpgeAddtobag',
        action: 'click',
        label: 'DetailpgeAddtobag_Addtobag_Click2'
      })
      this.setPoint('addtobag', 'addtobag', 'click')
      this.loading = true
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', this.baseInfo.goodsId)
      formData.set('dress_type', this.baseInfo.dressType)
      formData.set('from_showroom', this.fromShowroom)
      formData.set('from_whatAreU', this.fromWhatAreU)
      formData.set('recommend_flag', this.recommendFlag)
      formData.set('from_details_entry', this.fromDetailsEntry)
      formData.set('from_instagram', this.fromInstagram)
      formData.set('styles[freeStyle]', false)
      formData.set('styles[size_type]', this.unit == 'inch' ? '_inch' : '_cm')
      if (this.hasColor) {
        formData.set('styles[select][color]', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        formData.set('styles[select][sash_color]', this.selectedSashColor.styleId)
      }
      if (this.hasSize) {
        formData.set('styles[select][size]', this.selectedSize.styleId)
      }
      formData.set('styles[other][agree_sample_dress_terms_and_conditions]', 'yes')
      formData.set('styles[select][rent_product]', this.baseInfo.goodsName)
      if (this.isSample) {
        formData.set('styles[select][sample_source]', this.country)
      }
      if (this.baseInfo.dressType == 'clearance') {
        formData.set('styles[select][isClearance]', true)
      }
      if (this.baseInfo.dressType == 'outlet') {
        formData.set('styles[select][isOutlet]', true)
      }
      if (this.baseInfo.discount && this.baseInfo.dressType === 'clearance') {
        formData.set('styles[select][discount]', this.baseInfo.discount)
      }
      formData.set('goods_number', this.goodsNumber)
      this.addToBagAjax(formData)
      this.trackAddToCart({
        goodsId: this.baseInfo.goodsId,
        colorId: this.baseInfo.colorId,
        value: this.baseInfo.noDealPrice
      })
    },
    buyNow() {
      if (!this.handleCheck()) return
      if (!this.allReady || this.tipStatus.stockNumber < this.goodsNumber) {
        return false
      }
      this.setPoint('buynow', 'buynow', 'click')
      this.buyNowLoading = true
      const formData = {}
      const stylesObject = {}
      const stylesSelectObject = {}
      const stylesOtherObject = {}
      this.$set(formData, 'act', 'addGoodsToCart')
      this.$set(formData, 'goods_id', this.baseInfo.goodsId)
      this.$set(formData, 'dress_type', this.baseInfo.dressType)
      this.$set(formData, 'from_showroom', this.fromShowroom)
      this.$set(formData, 'from_whatAreU', this.fromWhatAreU)
      this.$set(formData, 'recommend_flag', this.recommendFlag)
      this.$set(formData, 'from_details_entry', this.fromDetailsEntry)
      this.$set(formData, 'from_instagram', this.fromInstagram)
      this.$set(stylesObject, 'freeStyle', false)
      this.$set(stylesObject, 'size_type', this.unit == 'inch' ? '_inch' : '_cm')
      if (this.hasColor) {
        this.$set(stylesSelectObject, 'color', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        this.$set(stylesSelectObject, 'sash_color', this.selectedSashColor.styleId)
      }
      if (this.hasSize) {
        this.$set(stylesSelectObject, 'size', this.selectedSize.styleId)
      }
      this.$set(stylesOtherObject, 'agree_sample_dress_terms_and_conditions', 'yes')
      if (['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType)) {
        this.$set(stylesSelectObject, 'rent_product', this.baseInfo.goodsName)
      }
      if (this.isSample) {
        this.$set(stylesSelectObject, 'sample_source', this.country)
      }
      if (this.baseInfo.dressType == 'clearance') {
        this.$set(stylesSelectObject, 'isClearance', true)
      }
      if (this.baseInfo.dressType == 'outlet') {
        this.$set(stylesSelectObject, 'isOutlet', true)
      }
      if (this.baseInfo.discount && this.baseInfo.dressType === 'clearance') {
        this.$set(stylesSelectObject, 'discount', this.baseInfo.discount)
      }
      this.$set(formData, 'goods_number', this.goodsNumber)
      this.$set(stylesObject, 'select', stylesSelectObject)
      this.$set(stylesObject, 'other', stylesOtherObject)
      this.$set(formData, 'styles', stylesObject)
      this.buyNowAjax(formData)
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
      if (this.isSample) {
        if (this.baseInfo.catId == 2) {
          eventName = 'BrideSample_AddtoBag_Click'
        } else if (this.baseInfo.catId == 8) {
          eventName = 'MBDSample_AddtoBag_Click'
        } else {
          eventName = 'BridesmaidSample_AddtoBag_Click'
        }
      } else {
        eventName = 'BridesmaidClearance_AddtoBag_Click'
      }
      if (eventName != '') {
        this.setDataLayer({
          category: 'AddtoBag',
          action: 'click',
          label: eventName
        })
      }
    },
    quickShopClick(params) {
      this.$emit('quickShop', params)
    }
  }
}
</script>

<style lang="less" scoped>
.sample-style {
  width: 100%;
  .add-to-bag-block {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin: 15px 0px;
  }
  /deep/ .sample-link {
    margin-top: 15px;
  }
  .style-block {
    background-color: #f7f7f7;
    margin-top: 12px;
    padding: 20px 10px 10px 10px;
    .size-block {
      .new-dress {
        padding-bottom: 6px;
        a {
          cursor: pointer;
          text-decoration: underline;
          color: var(--color-121212);
          &:hover {
            color: @theme-color;
          }
        }
      }
      /deep/ .size-list.wgd .size-item {
        margin-bottom: 10px;
      }
    }
  }
  #sold-out,
  #notify-me {
    flex: 1;
    padding: 13px 10px;
    // margin-top: 24px;
    height: 50px;
    font-family: @font-family-600;
    box-sizing: border-box;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    line-height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: @theme-color !important;
    /deep/ .az-icon {
      height: 22px;
      width: 22px;
      margin-right: 8px;
      fill: currentColor;
    }
  }
  #add-to-bag {
    flex: 2;
    padding: 13px 10px;
    height: 50px;
    font-family: @font-family-600;
    box-sizing: border-box;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    line-height: 25px;
    background: @theme-color!important;
    .az-icon {
      height: 15px;
      width: 20px;
      margin-right: 8px;
      fill: currentColor;
    }
  }
  #buy-now {
    width: 80%;
    max-width: 285px;
    padding: 12px 10px;
    height: 50px;
    margin-left: 10px;
    font-family: @font-family-600;
    box-sizing: border-box;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    line-height: 25px;
    border: 1px solid @theme-color;
    &:hover {
      background-color: var(--color-f1e9e6) !important;
    }
    .az-icon {
      height: 13px;
      width: 18px;
      margin-right: 8px;
      margin-bottom: 1px;
      fill: currentColor;
    }
  }
  .rush-delivery-box {
    background-color: #f7f7f7;
    padding: 10px 15px;
  }
}
.add-to-bag-block {
  #add-to-bag,
  #buy-now {
    border: 1px solid @theme-color;
  }
  #buy-now {
    color: @theme-color!important;
    &:hover {
      background-color: @btn-light-hover-color !important;
    }
  }
  #add-to-bag {
    background-color: @theme-color!important;
    &:hover {
      background-color: @btn-hover-color !important;
    }
  }
}
</style>
