<template>
  <div
    :data-goods-id="goodsItem.baseInfo.goodsId"
    :data-cat-id="goodsItem.baseInfo.catId"
    :data-showroom-goods-index="showroomGoodsIndex"
    :class="{ assigned_me: goodsItem.favInfo.assignedMe && !showroomBaseInfo.isOwner }"
    class="showroom-goods-item"
  >
    <div class="goods-info">
      <span v-if="goodsItem.favInfo.assignedMe && !showroomBaseInfo.isOwner" class="assigned_sticker"></span>
      <!-- 图片 -->
      <div class="goods-img-block">
        <az-sticker
          v-if="goodsItem.stickers && Object.keys(goodsItem.stickers).length"
          :stickerInfo="getSticker"
          :sticker-class="`showroom-goods-item-icon`"
          :goodsId="goodsItem.baseInfo.goodsId"
        ></az-sticker>
        <a
          :class="{ disabled: !goodsItem.baseInfo.available }"
          @click="goToLink(goodsItem.baseInfo.available, goodsItem.baseInfo.goodsUrl)"
          :aria-label="goodsItem.baseInfo.shownGoodsName"
        >
          <img
            :alt="goodsItem.baseInfo.shownGoodsName"
            :src="require('~/assets/images/default_img.jpg')"
            :data-src="addWebpSuffix(`${goodsItem.imageInfo.showroomPrefix}${goodsItem.baseInfo.goodsThumb}`)"
            class="lazyload"
          />
          <span v-if="goodsItem.baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
        </a>
        <p class="add-name">
          <span class="add-user">{{ goodsItem.favInfo.shortName }}</span>
        </p>
      </div>
      <!-- 交期 -->
      <div class="estimated-delete">
        <template v-if="goodsItem.makeTimeInfo && goodsItem.baseInfo.catId != 3108">
          <p v-if="goodsItem.makeTimeInfo.isExpeditedShippingGoods" class="estimated-time">
            {{ nl('page_ship_delivery_shipping') }} {{ goodsItem.makeTimeInfo.hours }} hours
          </p>
          <p
            v-else-if="
              goodsItem.baseInfo.isStockGoods ||
                [1001154, 1001569, 1001570, 1000166].includes(goodsItem.baseInfo.goodsId) ||
                [33, 3098].includes(goodsItem.baseInfo.catId)
            "
            class="estimated-time"
          >
            {{ nl('page_ship_delivery_shipping') }} {{ goodsItem.makeTimeInfo.minDays }}-{{ goodsItem.makeTimeInfo.maxDays }}
            {{ nl('page_ship_delivery_days') }}
          </p>
          <p v-else-if="goodsItem.makeTimeInfo.minWeeks && goodsItem.makeTimeInfo.useMinWeek" class="estimated-time">
            {{ nl('page_goods_time') }} {{ goodsItem.makeTimeInfo.minWeeks }}{{ nl('page_goods_time_week') }}
          </p>
          <p v-else class="estimated-time">
            {{ nl('page_goods_time') }} {{ goodsItem.makeTimeInfo.minWeeks }}-{{ goodsItem.makeTimeInfo.maxWeeks }}
            {{ nl('page_goods_time_week') }}
          </p>
        </template>
        <span
          id="remove-btn"
          v-if="goodsItem.favInfo.addUserId == userId || showroomBaseInfo.isOwner"
          @click="handleRemoveFav(goodsItem)"
          class="remove"
        >
          <az-icon class="remove-icon" icon-class="remove"></az-icon>
        </span>
      </div>

      <!-- 名称 -->
      <p class="goods-name">
        <a
          @click="goToLink(goodsItem.baseInfo.available, goodsItem.baseInfo.goodsUrl)"
          :class="{ disabled: !goodsItem.baseInfo.available }"
        >
          <az-icon
            v-if="goodsItem.baseInfo.isFreeShipping && !isSpecialCatId(goodsItem.baseInfo.catId)"
            :icon-class="'icon-xxy_free_shipping_cart-' + language"
            class="icon-free-ship-cart"
          />
          {{ goodsItem.baseInfo.shownGoodsName }}
        </a>
      </p>

      <!-- 价格 -->
      <template v-if="goodsItem.baseInfo.hasLinePrice">
        <div class="goods-price goods-price-block">
          <span class="current-price">{{ goodsItem.baseInfo.shopPriceDisplay }}</span>
          <span class="no-deal-price">{{ goodsItem.baseInfo.noDealPriceDisplay }}</span>
        </div>
      </template>
      <template v-else>
        <div class="goods-price">{{ goodsItem.baseInfo.shopPriceDisplay }}</div>
      </template>
      <!-- 颜色 -->
      <div class="goods-color-block">
        <div @mouseenter="showColors" @mouseleave="hideColors">
          <div class="color-btn-and-tips">
            <div :class="{ 'color-btn-act': colorShow }" v-if="hasColor" class="color-btn">
              <div class="goods-color">{{ goodsItem.baseInfo.shownColor }}</div>
              <div
                :class="[goodsItem.baseInfo.colorReal]"
                :style="getColorStyle(goodsItem.baseInfo.colorReal, 'square')"
                class="color-img"
              ></div>
              <az-icon v-if="goodsItem.baseInfo.catId != 3108" class="arrow-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
            </div>
            <div class="goods-stock-tips">{{ goodsStockTips }}</div>
          </div>
          <div v-show="colorShow && hasColor && goodsItem.baseInfo.catId != 3108" class="pis-color-box">
            <template v-for="(colorItem, key) in goodsItem.styleInfo.color">
              <div
                :key="key"
                @click="colorSwitchClick(goodsItem, colorItem)"
                :class="{ selected: selectedColorId == colorItem.colorId }"
                v-if="colorItem.isShow"
                class="color-item"
              >
                <template>
                  <span :class="{ 'no-stock': outOfStock(colorItem) }" class="bg"></span>
                  <span :class="[colorItem.key]" :style="getColorStyle(colorItem.key, 'square')" class="color"></span>
                  <div class="style-tip">
                    <span v-if="colorItem.isNew" class="new-color">{{ nl('page_common_new_capital') }}!</span>
                    {{ replaceBackslashToAndText(colorItem.name, goodsItem.baseInfo) }}
                  </div>
                  <az-icon
                    v-if="colorIds.includes(colorItem.styleId)"
                    :icon-class="'icon-show-color-tag' + getColorType(colorItem.key)"
                    class="icon-stock"
                  ></az-icon>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <showroom-goods-assign
      :assignInfo="goodsItem.assignInfo"
      :favoriteId="goodsItem.favInfo.favoriteId"
      :showroomGoodsIndex="showroomGoodsIndex"
      @updateAssignBlockShow="updateAssignBlockShow"
    ></showroom-goods-assign>
    <div v-show="!assignBlockShow">
      <div v-if="!goodsItem.baseInfo.available" class="us-tip">{{ nl('page_cart_us_sample') }}</div>
      <div class="add-to-bag-wrapper">
        <button
          id="showroom_order_dress"
          @click="addToBag"
          :disabled="!orderBtnAvailable"
          :class="{ loading: showroomBtnLoadingIndex === showroomGoodsIndex, disabled: !goodsItem.baseInfo.available }"
          class="add_cart_btn"
        >
          {{ orderBtnText }}
        </button>
        <button
          v-if="showTryOnDressBtn"
          v-track.view.click="{ common: { ec: 'showroom', el: 'try_it_on' } }"
          @click="clickTryItOn"
          class="try-it-on-btn add_cart_btn"
        >
          {{ nl('page_button_try_it_on') }}
        </button>
      </div>
      <showroom-goods-comment
        :commentInfo="goodsItem.commentInfo"
        :favoriteId="goodsItem.favInfo.favoriteId"
        :showroomGoodsIndex="showroomGoodsIndex"
      ></showroom-goods-comment>
    </div>
  </div>
</template>
<script>
import azSticker from '@/components/az-ui/Sticker/AzSticker'
import ShowroomGoodsAssign from '@/components/showroom/ShowroomGoodsAssign'
import ShowroomGoodsComment from '@/components/showroom/ShowroomGoodsComment'
import colorHex from '@/assets/js/colorHex'
import showRoomUtil from '@/plugins/showroomFav'
import { getSourceTagFun } from '@/assets/js/commonFun'
import { mapState } from 'vuex'

export default {
  name: 'ShowroomGoodsItem',
  components: {
    azSticker,
    ShowroomGoodsAssign,
    ShowroomGoodsComment
  },
  mixins: [colorHex],
  props: {
    goodsItem: {
      type: Object,
      default: () => {}
    },
    showroomGoodsIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      color: {},
      colorShow: false,
      assignBlockShow: '',
      colorIds: []
    }
  },
  computed: {
    ...mapState({
      ...mapState('showroom', ['showroomBaseInfo', 'prodList', 'showroomBtnLoadingIndex', 'pageInfo'])
    }),
    selectedColorId() {
      return this.goodsItem.baseInfo.colorId
    },
    hasColor() {
      return this.goodsItem.styleInfo && this.goodsItem.styleInfo.hasColor
    },
    goodsStockTips() {
      // 只有色卡才会展示库存信息
      if (Object.keys(this.goodsItem).length == 0) {
        return ''
      }
      if (!this.goodsItem.baseInfo.isStockGoods || this.goodsItem.baseInfo.catId != 33) {
        return ''
      }
      const currentColor = this.hasColor ? this.goodsItem.baseInfo.color : '*'
      if (this.goodsItem.stockInfo) {
        if (
          !(this.goodsItem.stockInfo && this.goodsItem.stockInfo.hasStock) ||
          (this.goodsItem.stockInfo.colorMap &&
            this.goodsItem.stockInfo.colorMap[currentColor] &&
            !(this.goodsItem.stockInfo.colorMap[currentColor] && this.goodsItem.stockInfo.colorMap[currentColor].hasStock))
        ) {
          return 'Out of Stock'
        } else if (
          this.goodsItem.stockInfo.stockNumberMap &&
          this.goodsItem.stockInfo.stockNumberMap[currentColor] &&
          this.goodsItem.stockInfo.stockNumberMap[currentColor] <= 3
        ) {
          return 'Only ' + this.goodsItem.stockInfo.stockNumberMap[currentColor] + ' Left'
        } else {
          return ''
        }
      }
      return ''
    },
    orderBtnText() {
      if (this.showroomBtnLoadingIndex === this.showroomGoodsIndex) return this.nl('page_common_open').toUpperCase()
      else if ([2, 3, 7, 8, 9, 10, 45, 158].includes(this.goodsItem.baseInfo.catId)) return this.nl('page_order_dress').toUpperCase()
      else if ([13, 15, 6, 138, 139, 37, 248, 3076, 3077, 3102, 3109].includes(this.goodsItem.baseInfo.catId))
        return this.nl('page_showroom_quick_shop').toUpperCase()
      else if ([33, 36, 1508].includes(this.goodsItem.baseInfo.catId)) return this.nl('page_cart_add_to_bag').toUpperCase()
      else return this.nl('page_order_dress').toUpperCase()
    },
    orderBtnAvailable() {
      const currentColor = this.goodsItem.baseInfo.color || '*'
      // 只有色卡才会按钮置灰
      if (this.goodsItem.baseInfo.isStockGoods && this.goodsItem.baseInfo.catId === 33) {
        if (
          !(this.goodsItem.stockInfo && this.goodsItem.stockInfo.hasStock) ||
          (this.goodsItem.stockInfo.colorMap &&
            this.goodsItem.stockInfo.colorMap[currentColor] &&
            !(this.goodsItem.stockInfo.colorMap[currentColor] && this.goodsItem.stockInfo.colorMap[currentColor].hasStock))
        ) {
          return false
        } else {
          return true
        }
      } else if (this.goodsItem.baseInfo.isStockGoods && this.goodsItem.baseInfo.catId === 1508) {
        return this.goodsItem.stockInfo && this.goodsItem.stockInfo.hasStock
      } else {
        return true
      }
    },
    showTryOnDressBtn() {
      return this.goodsItem.tryItOn && !this.isNewLanguageCountry
    },
    getSticker({ goodsItem }) {
      if (goodsItem.baseInfo.isMeasurementHideGoods && this.isSpecialCatId(goodsItem.baseInfo.catId)) {
        return goodsItem.stickers.filter((sticker) => sticker.name != 'beBackSoon')
      }
      return goodsItem.stickers
    }
  },
  watch: {
    colorShow: {
      handler(val) {
        if (val && this.colorIds.length === 0) {
          return this.getDiscountinfo()
        }
      },
      immediate: true
    }
  },
  methods: {
    updateAssignBlockShow(act) {
      this.assignBlockShow = act
    },
    // 取消收藏
    handleRemoveFav(goodsItem) {
      this.setPoint('showroom', 'deleteitem', 'click')
      showRoomUtil.delFavFromShowRoom(
        this.showroomBaseInfo.showroomId,
        goodsItem.favInfo.favoriteId,
        goodsItem.baseInfo.goodsId,
        goodsItem.baseInfo.colorId,
        goodsItem.baseInfo.goodsSize,
        false,
        () => {
          this.$emit('getShowroomProdList', this.pageInfo.page)
        },
        false,
        this
      )
    },
    outOfStock(color) {
      // 只有色卡才会颜色缺货的时候展示缺货样式
      if (this.goodsItem.baseInfo.isStockGoods && this.goodsItem.baseInfo.catId == 33) {
        return (
          !(this.goodsItem.stockInfo && this.goodsItem.stockInfo.hasStock) ||
          !(
            this.goodsItem.stockInfo.colorMap &&
            this.goodsItem.stockInfo.colorMap[color.key] &&
            this.goodsItem.stockInfo.colorMap[color.key].hasStock
          )
        )
      }
    },
    showColors() {
      this.colorShow = true
    },
    hideColors() {
      this.colorShow = false
    },
    // 切换颜色
    colorSwitchClick(goodsItem, colorItem) {
      this.setPoint('showroom', 'changecolor', 'click')
      this.hideColors()
      this.changeGoodsImg(colorItem)
      showRoomUtil.changeColorFavFromShowRoom(
        this.showroomBaseInfo.showroomId,
        goodsItem.favInfo.favoriteId,
        goodsItem.baseInfo.goodsId,
        colorItem.colorId,
        colorItem.name,
        this.pageInfo.page,
        this.pageInfo.limit,
        (this.versionObj.sodGalleryVersion || 'a').toLowerCase(),
        (data) => {
          if (data) {
            this.$store.commit('showroom/setPageInfo', data.pageInfo || {})
            this.$store.commit('showroom/setProdList', data.prodList || [])
          }
        },
        false
      )
    },
    // 颜色选择之后，由于接口返回比较慢，图片变化有点之后，先前端更改，再请求接口，优化一下
    changeGoodsImg(colorItem) {
      const listIndex = this.showroomGoodsIndex
      const tempProdList = JSON.parse(JSON.stringify(this.prodList))
      const tempProdListItemBaseInfo = tempProdList[listIndex].baseInfo
      const tempProdListItemImageInfo = tempProdList[listIndex].imageInfo
      // 商品基本信息
      tempProdListItemBaseInfo.colorId = colorItem.colorId
      tempProdListItemBaseInfo.color = colorItem.key
      tempProdListItemBaseInfo.shownColor = colorItem.name
      // 商品图片，取第一张
      if (
        tempProdListItemImageInfo.goodsGallery &&
        tempProdListItemImageInfo.goodsGallery[colorItem.key] &&
        tempProdListItemImageInfo.goodsGallery[colorItem.key].images &&
        tempProdListItemImageInfo.goodsGallery[colorItem.key].images[0]
      ) {
        tempProdListItemBaseInfo.goodsThumb = tempProdListItemImageInfo.goodsGallery[colorItem.key].images[0].imgUrl
      }

      tempProdList[listIndex].baseInfo = tempProdListItemBaseInfo
      this.$store.commit('showroom/setProdList', tempProdList)
    },
    addToBag() {
      // 如果点击的是礼品卡，直接进入礼品卡详情
      if (this.goodsItem.baseInfo.catId === 3108) {
        this.goToLink(this.goodsItem.baseInfo.available, this.goodsItem.baseInfo.goodsUrl)
        return
      }
      if (!this.goodsItem.baseInfo.available) return false
      this.$store.commit('showroom/setShowroomBtnLoadingIndex', this.showroomGoodsIndex)
      if ([33, 36, 1508].includes(this.goodsItem.baseInfo.catId)) {
        this.setPoint('showroom', 'addtobagbutton', 'click')
        // 色卡布料直接加车
        const formData = new FormData()
        formData.set('act', 'addGoodsToCart')
        formData.set('goods_id', this.goodsItem.baseInfo.goodsId)
        formData.set('dress_type', this.goodsItem.baseInfo.dressType)
        formData.set('from_showroom', this.goodsItem.baseInfo.fromShowroom)
        formData.set('from_whatAreU', this.goodsItem.baseInfo.fromWhatAreU)
        formData.set('recommend_flag', this.goodsItem.baseInfo.recommendFlag)
        formData.set('from_details_entry', this.goodsItem.baseInfo.fromDetailsEntry)
        formData.set('from_instagram', this.goodsItem.baseInfo.fromInstagram)
        formData.set('styles[freeStyle]', false)
        formData.set('styles[size_type]', '_inch')
        if (this.hasColor) {
          formData.set('styles[select][color]', this.goodsItem.styleInfo.color[this.goodsItem.baseInfo.colorReal].styleId)
        }
        formData.set('goods_number', 1)
        this.$axios.$post('/1.0/cart/goods', formData).then((res) => {
          if (res.code == 0) {
            this.retentionAddToCart(
              { ...this.goodsItem.baseInfo, goodsNumber: 1, csText: this.getColorAndSizeText(formData) },
              res.data.rec_id
            )
            this.$store.commit('showroom/setShowroomBtnLoadingIndex', null)
            window.location.href = this.countryUrl(`/cart?showroom_id=${this.showroomBaseInfo.showroomId}`)
          } else {
            alert(res.msg)
          }
        })
      } else {
        // 其他的quick shop
        let styleId = ''
        if (
          this.isSpecialCatId(this.goodsItem.baseInfo.catId) &&
          this.goodsItem.baseInfo.goodsStyleIdInfo[this.goodsItem.baseInfo.colorReal]
        ) {
          styleId = this.goodsItem.baseInfo.goodsStyleIdInfo[this.goodsItem.baseInfo.colorReal].goodsStyleId || ''
        }
        const params = {
          goods_id: this.goodsItem.baseInfo.goodsId,
          dress_type: this.goodsItem.baseInfo.dressType,
          goods_style_id: styleId,
          color: this.goodsItem.baseInfo.colorReal // 传递colorReal 英文颜色
        }
        // 如果3分类收藏商品有sourcetag，传到quickshopdialog组件使用
        if (this.isSpecialCatId(this.goodsItem.baseInfo.catId) && this.goodsItem.baseInfo.sourceTag) {
          const sourceTag = getSourceTagFun(
            null,
            { sourceTag: this.goodsItem.baseInfo.sourceTag },
            true,
            null,
            this,
            this.goodsItem.baseInfo.catId
          )
          sessionStorage.setItem('AZAZIE_WGD_SOURCE_TAG_TEMP', sourceTag)
        }
        this.$emit('quickShop', params)
      }
    },
    goToLink(data, url) {
      this.setPoint('showroom', 'item', 'click')
      url = this.navToGoodsDetail(url, this.goodsItem.baseInfo)
      if (data) {
        if (url.includes('?')) {
          window.open(url + '&from_showroom=1')
        } else {
          window.open(url + '?from_showroom=1')
        }
      } else {
        return false
      }
    },
    async getDiscountinfo() {
      const params = {
        goods_id: this.goodsItem.baseInfo.goodsId,
        cat_id: this.goodsItem.baseInfo.catId,
        dress_type: this.goodsItem.baseInfo.dressType
      }
      // 查询是否有折扣信息
      const result = await this.$axios.$get('/1.0/product/discount-info', { params })
      if (result.code == 0 && result.data.colorId) {
        this.colorIds.push(...result.data.colorId)
      }
    },
    // 点击try it on，根据tryItOn参数进行跳转，tryItOn参数是一个路径
    // au, uk, fr, mx这些站点还没上sample，这些国家站点的showroom不需要那个try it on按钮
    clickTryItOn() {
      // 订单追踪
      this.setOrderSourceFlag('showroomtryonsample', true)
      location.href = this.countryUrl(this.goodsItem.tryItOn)
    }
  }
}
</script>
<style lang="less" scoped>
.showroom-goods-item {
  width: 100%;
  margin-top: 15px;
  border: 1px solid #f0f0f0;
  &.assigned_me {
    box-shadow: 0 0 7px 1px rgba(191, 191, 191, 0.5);
  }
  .goods-info {
    position: relative;
    border-bottom: none;
    a {
      cursor: pointer;
    }
    .disabled {
      cursor: default;
    }
    .goods-img-block {
      position: relative;
      .mattel {
        position: absolute;
        right: 3px;
        bottom: 3px;
        font-size: 12px;
        line-height: 12px;
        text-transform: uppercase;
        color: #fff;
        transform-origin: right bottom;
        transform: scale(0.7);
        width: max-content;
      }
    }
    .goods-img-block img {
      width: 100%;
      vertical-align: middle;
    }
    .add-name {
      position: absolute;
      top: 10px;
      right: 10px;
      .add-user {
        display: inline-block;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        font-size: 13px;
        text-transform: uppercase;
        background-color: var(--color-ede1d3);
        text-align: center;
        line-height: 28px;
        color: white;
      }
    }
    .estimated-delete {
      display: flex;
      margin: 10px 10px 2px;
      align-items: flex-start;
      justify-content: flex-end;
      .remove {
        margin-top: 2px;
        margin-left: 5px;
        display: inline-block;
        cursor: pointer;
        .remove-icon {
          width: 13px;
          height: 13px;
        }
      }
    }
    .estimated-time {
      color: var(--color-121212);
      word-spacing: -1px;
      flex: 1;
    }
    .goods-name {
      margin: 0 10px + 4px + 13px 5px 10px;
      color: var(--color-121212);
      height: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-transform: capitalize;
      .icon-free-ship-cart {
        width: 25px;
        fill: currentColor;
        color: @theme-color;
        margin-right: 5px;
      }
    }
    .goods-price {
      margin: 0 10px;
      height: 22px;
      &.goods-price-box {
        font-size: 0;
      }
      .current-price {
        font-size: 16px;
        font-family: @font-family-600, sans-serif;
        color: var(--color-121212);
        line-height: 22px;
        display: inline-block;
        margin-right: 6px;
      }
      .no-deal-price {
        font-size: 13px;
        color: #999;
        text-decoration: line-through;
        line-height: 22px;
        display: inline-block;
      }
    }
    .goods-color-block {
      box-sizing: border-box;
      cursor: auto;
      width: 100%;
      position: relative;
      margin-top: 10px;
      .color-btn-and-tips {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px 10px;
      }
      .goods-stock-tips {
        color: var(--color-121212);
        display: inline-block;
        padding-left: 5px;
        max-width: 80px;
      }
      .color-btn {
        display: flex;
        align-items: center;
        flex: 1;
        .goods-color {
          color: var(--color-121212);
          max-width: 100px;
          display: inline-block;
          vertical-align: middle;
          text-transform: Capitalize;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .color-img {
          margin: 0 5px;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          display: inline-block;
          vertical-align: middle;
        }
        .arrow-icon {
          width: 10px;
          fill: var(--color-121212);
        }
      }
      .pis-color-box {
        width: 333px;
        background-color: #ffffff;
        position: absolute;
        top: 28px;
        display: grid;
        grid-template-columns: repeat(auto-fit, 27px);
        grid-auto-rows: 27px;
        gap: 8px;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        border: 1px solid var(--color-eeeeee);
        box-sizing: border-box;
        z-index: @z-index-3;
        .color-item {
          margin-right: 9px;
          cursor: pointer;
          width: 27px;
          height: 27px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          position: relative;
          .bg {
            width: 27px;
            height: 27px;
            position: absolute;
            background-size: cover;
            background-position: center;
            z-index: 1;
            border-radius: 50%;
            &.no-stock {
              background-image: url('~assets/images/product/no_stock.svg');
            }
          }
          span.color {
            width: 27px;
            height: 27px;
            display: block;
            border-radius: 50%;
            position: absolute;
          }

          &:hover {
            .style-tip {
              display: block;
            }
          }

          &.selected {
            .color {
              width: 21px;
              height: 21px;
            }
            .bg {
              border: 1px solid @theme;
              &.no-stock {
                background-image: url('~assets/images/product/no_stock_selected.svg');
                border: none;
              }
            }
          }
          .icon-stock {
            position: absolute;
            left: 8px;
            right: 0;
            top: 8px;
            font-size: 16px;
          }
        }
        .style-tip {
          text-transform: uppercase;
          position: absolute;
          display: none;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 4px 10px;
          white-space: nowrap;
          color: #231f1e;
          font-family: @font-family-600, sans-serif;
          z-index: 2;
          width: fit-content;
          height: auto;
          top: 100%;
          margin-top: 10px;
          .new-color {
            color: var(--color-121212);
            display: inline;
          }
          &::before {
            content: '';
            display: block;
            position: absolute;
            left: calc(50% - 8px);
            top: -8px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #ccc;
          }
          &::after {
            content: '';
            display: block;
            position: absolute;
            left: calc(50% - 8px);
            top: -7px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #fff;
          }
        }
      }
    }
  }
}
.us-tip {
  margin-left: 10px;
  color: var(--color-121212);
}
.add-to-bag-wrapper {
  padding: 0 10px;
  .add_cart_btn {
    text-align: center;
    background: var(--color-121212);
    height: 40px;
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    text-transform: uppercase;
    font-size: 13px;
    font-family: @font-family-600;
    border: 1px solid var(--color-121212);
    border-radius: 1px;
    color: #fffefe;
    line-height: 40px;
    padding: 0;
    &:hover,
    &.active {
      background: var(--color-1e1e1e);
    }
    &.loading {
      opacity: 0.3;
    }
    &[disabled],
    &[disabled]:hover,
    &.disabled,
    &.disabled:hover {
      border: 1px solid #666;
      background-color: #666;
    }
  }
  .try-it-on-btn {
    margin-top: 10px;
  }
}
</style>
