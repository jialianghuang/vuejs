<template>
  <div
    v-track.viewOnce.click="
      getExcitationParams(
        'stimulatedetail',
        'stimulatedetail',
        item,
        getExcitationSticker(item).text,
        from || 'recommand',
        item.driveInfo && item.driveInfo.listSticker
      )
    "
    :class="`product_swiper_item_${item.goodsId}`"
    @mouseenter="hoverMethod(true)"
    @mouseleave="hoverMethod(false)"
    :style="myStyle"
    class="swiper-item-wrapper"
  >
    <div :class="[from, { miniSize: miniSize }]" @click="handleLinkTo(item)" class="goods-item-a">
      <div
        @click="showQuickShopDialog('img')"
        v-track.click="{
          click: getGAItemListParams(item, index, 'imgClick', itemListName || from)
        }"
        class="img-box"
      >
        <ExcitationCard v-if="false && Object.keys(getExcitationSticker(item)).length" :sticker="getExcitationSticker(item)" />
        <az-sticker :stickerInfo="item.stickers" :stickerClass="stickerClass" :goodsId="item.goodsId"></az-sticker>
        <img
          :src="require('~/assets/images/default_img.jpg')"
          :data-src="addWebpSuffix(item.imgUrl, !addSuffix)"
          :alt="item.shownGoodsName"
          data-expand="1"
          class="lazyload goods-img"
        />
        <span v-if="item.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
      </div>
      <az-fav-icon v-if="favIconShow" :goodsId="item.goodsId" :goodsCatId="item.catId" :colorId="item.colorId" :isList="true"></az-fav-icon>
      <p
        :class="[{ 'goods-name': true, 'goods-wrap': isWrap }]"
        v-track.click="{
          click: getGAItemListParams(item, index, 'titleClick', itemListName || from)
        }"
      >
        <az-icon
          v-if="item.isFreeShipping && !isSpecialCatId(item.catId) && from !== 'similar'"
          :icon-class="'icon-xxy_free_shipping_cart-' + language"
          class="icon-free-ship-cart"
        />
        {{ item.shownGoodsName }}
      </p>
      <p v-if="isGallery" class="goods-color">
        {{ item.shownColor }}
      </p>
      <template v-if="item.hasShopPriceRange || item.hasLinePrice">
        <div
          :class="{ 'is-gallery': isGallery }"
          v-track.click="{
            click: getGAItemListParams(item, index, 'titleClick', itemListName || from)
          }"
          class="goods-price goods-price-box"
        >
          <template v-if="showSampleText && item.dressType === 'sample'">
            <p class="sample-text">
              <span v-if="!['completeTheLook', 'cartRecommend'].includes(from)" :class="['sample-text-price', from]">
                {{ item.originalPriceInfo ? item.originalPriceInfo.noDealPriceDisplay : '' }}
              </span>
              <span class="sample-text-price-text">{{ nl('page_common_try_on_for') }}</span>
            </p>
            <span :class="['bold-price', { 'large-size': !['completeTheLook', 'cartRecommend'].includes(from) }]">
              {{ item.shopPriceDisplay }}
            </span>
          </template>
          <template v-else>
            <!-- AZWEB-21266 未选中sku时展示价格区间 -->
            <p v-if="item.hasShopPriceRange" class="current-price range-price">
              {{ item.minShopPriceDisplay }} - {{ item.maxShopPriceDisplay }}
            </p>
            <p v-else class="current-price">{{ item.shopPriceDisplay }}</p>
            <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
          </template>
          <span v-if="isShowProgress" class="sale-percent">{{ item.flashSaleInfo.progress }}% Sold</span>
          <az-limited-time
            v-if="!cyberSaleInfo && !item.activityCouponCode"
            :stickers="item.stickers"
            :show-limited-time-tag="showLimitedTimeTag"
            :goodsId="item.goodsId"
          ></az-limited-time>
          <AzWithCoupon
            v-if="item.hasShopPriceRange ? item.upToSaveRateValue : item.offRateValue"
            :value="item.hasShopPriceRange ? item.upToSaveRateValue : item.offRateValue"
            :is-block="from == 'completeTheLook'"
            :showText="!!item.activityCouponCode"
            :hasShopPriceRange="item.hasShopPriceRange"
            :baseInfo="{}"
          />
        </div>
      </template>
      <template v-else>
        <div
          :class="{ 'is-gallery': isGallery }"
          v-track.click="{
            click: getGAItemListParams(item, index, 'titleClick', itemListName || from)
          }"
          class="goods-price"
        >
          <!-- <p v-if="showSampleText && item.dressType === 'sample'" class="sample-text">
            <span v-if="!['completeTheLook', 'cartRecommend'].includes(from)" :class="['sample-text-price', from]">
              {{ item.originalPriceInfo ? item.originalPriceInfo.noDealPriceDisplay : '' }}
            </span>
            <span class="sample-text-price-text">{{ nl('page_common_try_on_for') }}</span>
          </p>
          <span :class="['bold-price', { 'large-size': !['completeTheLook', 'cartRecommend'].includes(from) }]">
            {{ item.shopPriceDisplay }}
          </span> -->
          <template v-if="showSampleText && item.dressType === 'sample'">
            <span v-if="item.tryonSaveLimit" class="price-try-on-for">
              <span class="origin-price">{{ item.shopPriceDisplay }}</span>
              <span
                v-html="nl('page_common_try_on_number_for_wd_' + country.toLowerCase(), null, { number: item.tryonSaveLimit })"
                v-if="item.catId == 2"
                class="sample-text-price-text"
              >
              </span>
              <span
                v-else
                v-html="nl('page_common_try_on_number_for_' + country.toLowerCase(), null, { number: item.tryonSaveLimit || 3 })"
                class="sample-text-price-text"
              >
              </span>
            </span>
            <template v-else-if="isBridal || item.catId == 2">
              <span v-if="!['completeTheLook', 'cartRecommend'].includes(from)" :class="['sample-text-price', from]">
                {{ item.originalPriceInfo ? item.originalPriceInfo.noDealPriceDisplay : '' }}
                <span v-if="item.originalPriceInfo && item.originalPriceInfo.noDealPriceDisplay">|</span>
              </span>
              <span class="sample-text-price-text">{{ nl('page_common_try_on_for') }}</span>
            </template>
          </template>
          <span :class="['bold-price', { 'large-size': !['completeTheLook', 'cartRecommend'].includes(from) }]" v-if="!item.tryonSaveLimit">
            {{ item.shopPriceDisplay }}
          </span>
        </div>
      </template>
      <cyber-sale
        v-if="cyberSaleInfo && item.catId != 3108 && (!item.activityCouponCode || onlyCyberSale)"
        :from="from"
        scene="swiperitem"
      ></cyber-sale>
      <div v-if="isShowProgress" class="percent-process-box">
        <div class="percent-process">
          <div :style="`width: ${item.flashSaleInfo.progress}%`" class="percent"></div>
        </div>
      </div>
      <div
        v-if="isGallery"
        v-track.click="{ common: getBiParams('Shop our instagram', index + 1 + '_image_Shop Now') }"
        class="shop_now need_datalayer"
        data-datalayer-category="StyleGallery"
        data-datalayer-label="StyleGallery_Shopnow_Click"
      >
        {{ nl('page_index_shop_now') }}
      </div>
      <template v-if="!cyberSaleInfo">
        <exclusive-offer
          v-if="item.showBundlePrice"
          :price="item.bundlePrice"
          :priceOff="item.bundlePriceOff"
          :scene="from"
        ></exclusive-offer>
        <limited-time-offer v-else :scene="from" :stickers="item.stickers" :itemCatId="item.catId"></limited-time-offer>
      </template>
    </div>
    <div v-if="hasQuickBtn" :class="['quick-shop', country, from, { show: quickShopBtnShow }]" @click="showQuickShopDialog('btn')">
      <p class="quick-shop-text upper">{{ from === 'orderRecommend' ? nl('page_order_dress') : nl('page_showroom_quick_shop') }}</p>
    </div>
  </div>
</template>

<script>
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import AzLimitedTime from '@/components/az-ui/AzLimitedTime'
// import AzWithCode from '@/components/az-ui/AzWithCode'
import AzWithCoupon from '@/components/az-ui/AZWithCoupon'
import AzFavIcon from '@/components/az-ui/AzFavIcon'
import ExclusiveOffer from '@/components/product/ExclusiveOffer'
import ExcitationCard from '@/components/common/excitation/ExcitationCard'
import LimitedTimeOffer from '@/components/product/LimitedTimeOffer'
import CyberSale from '@/components/list/CyberSale'
import { countryList } from '@/assets/js/euSizeMap'
import { mapState } from 'vuex'

export default {
  name: 'ProductSwiperItem',
  languageKeys: [
    'page_index_shop_now',
    'page_showroom_quick_shop',
    'page_common_maternity',
    'page_common_modest',
    'page_common_try_on_for',
    ...countryList.map((v, i) => 'page_common_try_on_number_for_wd_' + v),
    ...countryList.map((v, i) => 'page_common_try_on_number_for_' + v),
    ...AzSticker.languageKeys,
    ...AzLimitedTime.languageKeys,
    // ...AzWithCode.languageKeys,
    ...AzFavIcon.languageKeys,
    ...ExclusiveOffer.languageKeys,
    ...ExcitationCard.languageKeys,
    ...LimitedTimeOffer.languageKeys,
    ...CyberSale.languageKeys,
    ...AzWithCoupon.languageKeys
  ],
  components: {
    AzSticker,
    AzLimitedTime,
    // AzWithCode,
    AzFavIcon,
    ExclusiveOffer,
    ExcitationCard,
    LimitedTimeOffer,
    CyberSale,
    AzWithCoupon
  },
  props: {
    stickerClass: {
      type: String,
      default() {
        return 'product-item-icon'
      }
    },
    isShowProgress: {
      type: Boolean,
      default() {
        return false
      }
    },
    itemTarget: {
      type: String,
      default: '_self'
    },
    showLimitedTimeTag: {
      type: Boolean,
      default() {
        return false
      }
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    miniSize: {
      type: Boolean,
      default: false
    },
    myStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    hasQuick: {
      type: Boolean,
      default: false
    },
    hasQuickBtn: {
      type: Boolean,
      default: false
    },
    isWrap: {
      type: Boolean,
      default: false
    },
    isGallery: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    showFavIcon: {
      type: Boolean,
      default: false
    },
    fromDialog: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    addSuffix: {
      type: Boolean,
      default: false
    },
    // 操作来源标签，根据模块确定
    sourceTag: {
      type: String,
      default: ''
    },
    // 用于ga4打点的 item_list_name 参数
    itemListName: {
      type: String,
      default: ''
    },
    // 只展示cyber sale
    onlyCyberSale: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollDointFlag: false,
      quickShopBtnShow: false
    }
  },
  computed: {
    // needJointColorSize:样衣详情页推荐模块的商品需要在链接上拼接color和size,以便在详情页默认选中
    ...mapState('product', ['selectedSize', 'needJointColorSize']),
    ...mapState({
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    favIconShow() {
      if (!this.showFavIcon) {
        return false
      }
      if (this.item.catId == 1504) {
        // 口罩
        return false
      }
      return (
        this.item.dressType != 'sample' &&
        this.item.dressType != 'clearance' &&
        this.item.dressType != 'outlet' &&
        !this.item.isComingSoon &&
        !this.item.isFinalSale &&
        !this.item.isGiftCard
      )
    },
    showSampleText({ $route, isBridal }) {
      return ['product', 'sample-dresses-how-it-works'].includes($route.name)
    }
    // showWithCoupon({ item, from }) {
    //   return item.hasLinePrice && ['completeTheLook', 'cartRecommend', 'mostpopular', 'youmayalsolike', 'recentlyview'].includes(from)
    // }
  },
  watch: {
    scrollDointFlag(nval) {
      if (nval) {
        this.$emit('appear', {
          index: this.index,
          item: this.item
        })
      }
    }
  },
  mounted() {
    // 初始化
    const { goodsId } = this.item || {}
    const ele = document.querySelector(`.product_swiper_item_${goodsId}`)
    this.scrollDointFlag = this.inViewPort(ele, 0.5)
    // 滚动
    this.scrollShowPoint()
  },
  methods: {
    // 因为ada检测会要求a标签内的文本包含在aria-label对应的描述，此处a标签内文本较多，所以如果使用a标签，不确定性太大，且经常修改的可能性较大，故直接用div点击控制跳转
    handleLinkTo(item) {
      let url = this.navToGoodsDetail(!this.hasQuick || this.hasQuickBtn ? item.goodsUrl : '', {
        catId: item.catId,
        sourceTag: this.sourceTag
      })
      // barbie落地页商品跳转不处理
      if (this.jsKey !== 'barbie-dresses') {
        url = this.jointColorSizeUrl(url, item)
      }
      if (this.itemTarget === '_blank') {
        window.open(url)
      } else {
        location.href = url
      }
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        dp: 'home',
        ec,
        el
      }
      return obj
    },
    setPoint(ec, el, ea, msg = {}) {
      let param2 = {}
      if (this.from === 'completeTheLook') {
        param2 = [8, 9].includes(this.catId) ? { param2: 'A' } : {}
      }
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        ...param2,
        msg: JSON.stringify(msg)
      })
    },
    scrollShowPoint() {
      const _this = this
      const _goodsId = (this.item && this.item.goodsId) || ''
      window.addEventListener('scroll', function() {
        const ele = document.querySelector(`.product_swiper_item_${_goodsId}`)
        _this.scrollDointFlag = _this.inViewPort(ele, 0.5)
      })
    },
    hoverMethod(bool) {
      if (this.item.isGiftCard) return
      if (this.item.isComingSoon) return
      this.quickShopBtnShow = bool
      if (this.hasQuickBtn && bool) {
        this.setPoint('quickshop', 'button', 'view')
        if (this.from === 'similar') {
          this.buryPoint(this, 'event', {
            ec: 'oos',
            el: 'quickshop',
            ea: 'view',
            msg: JSON.stringify({
              goodsId: this.item.goodsId,
              cat_name: this.item.catName,
              dress_type: this.item.dressType,
              cat_id: this.item.catId,
              from_cat_id: this.$store.state.product.baseInfo.catId // 主商品catId
            })
          })
        }
      }
    },
    // 显示quick shop弹框
    showQuickShopDialog(clickPosition) {
      // 打点
      if (this.from == 'completeTheLook') {
        const eventParams = {
          index: this.index + 1,
          goodsId: this.item.goodsId,
          color: this.item.colorReal,
          cat_id: this.item.catId,
          dress_type: this.item.dressType,
          from_cat_id: this.$store.state.product.baseInfo.catId,
          rec_auto: this.item.hasRecommend ? 0 : 1 // 自动推荐还是手动推荐, hasRecommend为true表示lego手动配置推荐，打点字段rec_auto： 1表示是自动推荐，不打或者非1表示手动
        }
        if (clickPosition == 'btn') {
          this.setPoint(this.from, 'quickshop', 'click', eventParams)
        }
        if (clickPosition == 'img' && this.hasQuickBtn) {
          this.setPoint(this.from, 'items', 'click', eventParams)
        }
        this.setOrderSourceFlagWithGoodsId(this.from, this.item.goodsId)
      } else if (['youMayAlsoLike', 'mostPopular', 'recentlyViewd'].includes(this.from)) {
        this.setPoint('quickshop', 'button', 'click')
      }
      if (!this.hasQuick || (clickPosition == 'img' && this.hasQuickBtn)) return
      const goodsStyleId =
        this.item.goodsStyleIdInfo &&
        this.item.goodsStyleIdInfo[this.item.color] &&
        this.item.goodsStyleIdInfo[this.item.color].goodsStyleId
      const params = {
        goods_id: this.item.goodsId,
        dress_type: this.item.dressType,
        goods_style_id: this.isSpecialCatId(this.item.catId) ? goodsStyleId : '',
        color: this.item.color,
        need_point: this.item.needPoint,
        index: this.index,
        fromDialog: this.fromDialog,
        catName: this.item.catName,
        catId: this.item.catId,
        hasRecommend: this.item.hasRecommend,
        isPlusImg: this.item.isPlusImg
      }
      // 如果需要默认选中size，则加上size入参
      if (this.needJointColorSize && this.item.stockSize) {
        params.size = this.item.stockSize
      }
      this.$emit('quickShop', params)
      this.$store.commit('quickshop/setQuickShopDialog', true)
      if (this.isSpecialCatId(this.item.catId)) {
        this.setDataLayer({
          action: 'click',
          category: 'Dress',
          label: 'Dress_QuickShop_Click'
        })
      }
      if (this.from === 'similar') {
        this.buryPoint(this, 'event', {
          ec: 'oos',
          el: 'quickshop',
          ea: 'click',
          msg: JSON.stringify({
            goodsId: this.item.goodsId,
            cat_name: this.item.catName,
            dress_type: this.item.dressType,
            cat_id: this.item.catId,
            from_cat_id: this.$store.state.product.baseInfo.catId // 主商品catId
          })
        })
      }
      return false
    },
    // 在目标url路径上加上color,size。因为目前只有样衣详情页的推荐模块，且推荐接口为公共，所以只能前端拼接url
    jointColorSizeUrl(url, item = {}) {
      const color = item.color || ''
      let stockSize = item.stockSize || ''
      let selectedSize = localStorage.getItem('SELECTED_SIZE') || ''
      if (selectedSize) {
        const tempSelectedSize = JSON.parse(selectedSize)
        if (tempSelectedSize && Array.isArray(tempSelectedSize)) {
          for (let i = 0; i < tempSelectedSize.length; i++) {
            const ele = tempSelectedSize[i]
            if (ele.catId === item.catId) {
              selectedSize = ele.selectedSize
              break
            }
          }
        }
      } else {
        selectedSize = this.selectedSize
      }
      // 如果stockSize不存在，判断selecedSize是否有值
      if (!stockSize && selectedSize.key) {
        stockSize = selectedSize.key
      }
      const obj = { color, size: stockSize }
      let tempUrl = url
      // 购物车页面的you may also like也需要添加对应尺码跳转
      if (tempUrl && !tempUrl.includes('javascript:') && this.needJointColorSize) {
        for (const key in obj) {
          if (obj[key] && !tempUrl.includes(key)) {
            const value = this.isSpecialCatId(item.catId) && key == 'color' ? encodeURIComponent(obj[key]) : obj[key]
            if (tempUrl.includes('?')) {
              tempUrl = `${tempUrl}&${key}=${value}`
            } else {
              tempUrl = `${tempUrl}?${key}=${value}`
            }
          }
        }
      }
      return tempUrl
    }
  }
}
</script>

<style lang="less" scoped>
.swiper-item-wrapper {
  position: relative;
}
.goods-item {
  cursor: pointer;
  display: inline-block;
  width: auto;
  &:hover {
    .goods-name,
    .goods-price,
    .goods-color {
      color: @theme-color;
    }
  }
  .goods-item-a {
    color: var(--color-121212);
    font-size: 13px;
    cursor: pointer;
    .img-box {
      width: 100%;
      position: relative;
      margin-bottom: 6px;
      .prod-flash-sale-icon-box {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 38px;
        height: 38px;
        background-color: @theme-color;
        border-radius: 50%;
        z-index: 2;
        .prod-flash-sale-icon {
          position: absolute;
          font-size: 14px;
          color: #fff;
          line-height: 12px;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding-top: 2px;
          .off-dec {
            font-family: @font-family-600;
          }
          .off-txt {
            transform: scale(0.6);
            display: inline-block;
          }
        }
      }
      .goods-img {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
      .mattel {
        position: absolute;
        right: 5px;
        bottom: 5px;
        font-size: 12px;
        line-height: 13px;
        text-transform: uppercase;
        color: #fff;
        transform-origin: right bottom;
        transform: scale(0.7);
        width: max-content;
      }
    }
    .goods-name {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: auto;
      font-family: @font-family-500;
      line-height: 19px;
      text-align: center;
      .icon-free-ship-cart {
        width: 41px;
        height: 19px;
        fill: currentColor;
        color: @theme-color;
        margin-right: 4px;
      }
    }
    .goods-wrap {
      white-space: normal;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
    }
    .goods-color {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    .goods-price {
      // line-height: 22px;
      text-align: center;
      // height: 22px;
      &.goods-price-box {
        font-size: 0;
        .sample-text,
        .sample-text + .bold-price {
          color: @theme-color;
        }
      }
      &.is-gallery {
        line-height: 19px;
        height: 19px;
      }
      .current-price {
        color: @theme-color;
        font-family: @font-family-600;
        font-size: 16px;
        line-height: 22px;
        display: inline-block;
      }
      .no-deal-price {
        color: var(--color-999999);
        text-decoration: line-through;
        font-size: 13px;
        margin-left: 5px;
        display: inline-block;
      }
      .sale-percent {
        font-family: @font-family-500, sans-serif;
        color: var(--color-121212);
        font-size: 13px;
        margin-left: auto;
        line-height: 22px;
        float: right;
      }
      .sample-text {
        display: inline-block;
        font-size: 13px;
        .sample-text-price {
          // text-decoration: line-through;
          & + .sample-text-price-text {
            &::before {
              content: '|';
              padding: 0 2px;
              font-size: 13px;
              line-height: 18px;
              text-decoration: none;
            }
          }
        }
        @media screen and (max-width: 1440px) {
          .sample-text-price.similar {
            display: none;
            & + .sample-text-price-text {
              &::before {
                display: none;
              }
            }
          }
        }
      }
      .sample-text + .bold-price {
        font-size: 16px;
        font-family: @font-family-600;
        &.large-size {
          font-size: 16px;
          line-height: 22px;
        }
      }
    }
    .percent-process-box {
      padding: 0 10px 10px;
      .percent-process {
        height: 8px;
        border-radius: 4px;
        background-color: #fff2f2;
        .percent {
          border-radius: 4px;
          height: 100%;
          background-color: @theme-color;
        }
      }
    }
    .shop_now {
      color: @theme-color;
      font-size: 13px;
      font-family: @font-family-600;
      margin: 15px auto 0;
      line-height: 35px;
      text-align: center;
      width: 135px;
      height: 35px;
      border: 1px solid @theme-color;
      box-sizing: border-box;
    }
    /deep/ .exclusive-offer {
      margin-top: 5px;
    }
    &.orderRecommend {
      .img-box {
        .mattel {
          transform: scale(0.4);
        }
      }
    }
  }
  .goods-item-a.miniSize {
    .img-box {
      width: 166px;
      .goods-img {
        width: 166px;
      }
    }
    .goods-name {
      width: 100%;
    }
  }
}
.quick-shop {
  display: none;
  height: 30px;
  padding: 0 5px;
  width: fit-content;
  background-color: #ffffffb3;
  opacity: 0.8;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.05), 0 1px 4px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  font-family: @font-family-500, sans-serif;
  line-height: 30px;
  color: var(--color-121212);
  text-align: center;
  cursor: pointer;
  z-index: 1;
  &.completeTheLook {
    top: 80px;
  }
  &.cartRecommend {
    top: 140px;
  }
  &.show {
    display: block;
    white-space: nowrap;
  }
  .upper {
    text-transform: uppercase;
  }
}
.activity-coupon-code {
  margin-bottom: 10px;
}
</style>
