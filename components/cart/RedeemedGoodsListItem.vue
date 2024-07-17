<template>
  <div
    @click="handleOrderSourceClick(redeemedStatus && redeemedStatus.status && redeemedStatus.status.conditionType == 2)"
    v-track.viewOnce.click="{
      id: showSticker ? `item_${baseInfo.goodsId}_${index}_viewall` : `item_${baseInfo.goodsId}_${index}`,
      common: [
        getRedeemedGoodsPoint('redeemedconfiguration', 'items', baseInfo),
        getRedeemedGoodsPoint('redeemedconfiguration', `item${index + 1}`, baseInfo)
      ]
    }"
    class="redeemed-goods-swiper-content swiper-slide"
  >
    <div class="left_block">
      <span v-if="showSticker && baseInfo.offRateValue" class="sticker_block">{{ baseInfo.offRateValue }}</span>
      <a
        :href="type ? countryUrl(baseInfo.goodsUrl) : 'javascript: void(0);'"
        @click="type ? () => false : redeemedAddToBag()"
        class="goods_url"
      >
        <img
          :src="require('~/assets/images/default_img.jpg')"
          :data-src="addWebpSuffix(`${PIC_PATH}s240/${baseInfo.goodsThumb}`)"
          :alt="baseInfo.shownGoodsName"
          data-expand="1"
          class="lazyload goods-img"
        />
      </a>
    </div>
    <div class="right_block">
      <div class="info_block">
        <div @click="toDetail(baseInfo)" class="goods_url">
          <div :title="baseInfo.shownGoodsName" class="goods_url_item goods_name">{{ baseInfo.shownGoodsName }}</div>
          <div v-if="baseInfo.formatStyles && baseInfo.formatStyles.color" class="goods_url_item color">
            {{ nl('page_common_color') }}:&nbsp;{{ baseInfo.shownColor }}
          </div>
          <div
            v-if="baseInfo.formatStyles && baseInfo.formatStyles.size && baseInfo.formatStyles.size.standardSize"
            class="goods_url_item size"
          >
            {{ nl('page_common_size') }}:&nbsp;{{ baseInfo.formatStyles.size.standardSize.name }}
          </div>
        </div>
      </div>
      <div class="price_block">
        <div :class="[currencyCode]" class="price-box">
          <template v-if="baseInfo.hasLinePrice">
            <span class="shop_price">{{ baseInfo.shopPriceDisplay }}</span>
            <span class="line_price">{{ baseInfo.noDealPriceDisplay }}</span>
          </template>
          <template v-else>
            <span class="shop_price origin">{{ baseInfo.shopPriceDisplay }}</span>
          </template>
        </div>
        <div class="btn-box">
          <az-icon
            v-if="noticeText"
            @click.stop="redeemedAddToBag()"
            @mouseenter.native="mouseOverFn(true)"
            @mouseleave.native="mouseOverFn(false)"
            class="icon-bag icon-quick"
            icon-class="iconicon_shop_disable"
          />
          <az-icon
            v-else
            @click.stop="redeemedAddToBag()"
            @mouseenter.native="mouseOverFn(true)"
            @mouseleave.native="mouseOverFn(false)"
            v-track.viewOnce.click.stop="{
              id: showSticker ? `quickshop_${baseInfo.goodsId}_${index}_viewall` : `quickshop_${baseInfo.goodsId}_${index}`,
              common: [getRedeemedGoodsPoint('redeemedconfiguration', 'quickshop', baseInfo)]
            }"
            class="icon-bag icon-quick"
            icon-class="iconicon_shop-new"
          />
          <div v-if="hasAddCart" class="dot-box"></div>
        </div>
      </div>
    </div>
    <div v-show="noticeShow && noticeText" :class="{ 'position-l': isPositionLeft }" class="add_bag_notice">
      <span :style="{ right: noticeRightPosition + 'px' }" class="one"></span>
      <span :style="{ right: noticeRightPosition + 'px' }" class="two"></span>
      <az-icon icon-class="icon-xxy_prompt_red"></az-icon><span>{{ noticeText }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RedeemedGoodsListItem',
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    // 是否跳转
    type: {
      type: Boolean,
      default: true
    },
    // 是否显示折扣标签
    showSticker: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      noticeRightPosition: 0,
      noticeShow: false,
      isPositionLeft: false
    }
  },
  computed: {
    ...mapState('cart', ['redeemedStatus', 'redeemedBagGoodsList', 'redeemedBagGoodsIds']),
    noticeText() {
      let txt = ''
      if (!this.type) {
        return false
      }
      if (!this.redeemedStatus.status.canExchange) {
        txt = `${this.nl('page_cart_notice_away_1')} ${this.redeemedStatus.status.gap} ${this.nl('page_cart_notice_away_2')}`
      } else if (
        this.redeemedStatus.status.canExchange &&
        this.redeemedStatus.status.currentRedeemedGoodsCount == this.redeemedStatus.status.goodsNumLimit
      ) {
        txt = this.nl('page_cart_redeemed_limit')
      }
      return txt
    },
    hasAddCart({ baseInfo, redeemedBagGoodsIds }) {
      // 是否已经加过购物车
      if (baseInfo.supportDimension !== 'sku') {
        return redeemedBagGoodsIds.some((item) => item == baseInfo.goodsId)
      }
      return false
    }
  },
  methods: {
    mouseOverFn(Bool) {
      // 最左边的slide的气泡需要设置靠左，其他的靠右,40是.redeemed-wrapper有个30px的padding+ redeemed-goods-swiper-content的左侧有个10px的padding
      if (
        this.$el.querySelector('.left_block') &&
        document.querySelector('.redeemed-wrapper') &&
        this.$el.querySelector('.left_block').getBoundingClientRect().left -
          document.querySelector('.redeemed-wrapper').getBoundingClientRect().left <=
          40
      ) {
        this.isPositionLeft = true
        this.noticeRightPosition =
          286 - this.$el.querySelector('.left_block').offsetWidth - this.$el.querySelector('.price_block').offsetWidth - 15
      } else {
        this.isPositionLeft = false
        this.noticeRightPosition =
          this.$el.querySelector('.right_block').offsetWidth - this.$el.querySelector('.price_block').offsetWidth + 15
      }
      this.noticeShow = Bool
      this.$emit('noticeShow', Bool)
    },
    redeemedAddToBag() {
      this.handleOrderSourceClick()
      if (this.noticeText) return
      // 判断商品维度,如果不是sku维度，则需要弹窗quickshop加购
      if (this.baseInfo.supportDimension !== 'sku') {
        const params = {
          goods_id: this.baseInfo.goodsId,
          dress_type: this.baseInfo.dressType,
          goods_style_id: this.isSpecialCatId(this.baseInfo.catId)
            ? this.baseInfo.goodsStyleIdInfo[this.baseInfo.colorReal].goodsStyleId
            : '', // 通过colorReal进行匹配
          color: this.baseInfo.formatStyles && this.baseInfo.formatStyles.color && this.baseInfo.formatStyles.color.key,
          fromDialog: 'redeemed',
          supportDimension: this.baseInfo.supportDimension, // 商品参与换购的维度
          fromRedeemed: (this.redeemedStatus.status && this.redeemedStatus.status.conditionType) || 1, // 是否是换购模块
          bundleExchangeVersion: this.versionObj.cartTyingAbtest.toLowerCase()
        }
        this.$emit('quickShop', params)
        this.$store.commit('cart/setLoadingFlag', true)
        this.$store.commit('quickshop/setQuickShopDialog', true)
        return false
      }
      this.$store.commit('cart/setLoadingFlag', true)
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', this.baseInfo.goodsId)
      formData.set('dress_type', this.baseInfo.dressType)
      formData.set('styles[freeStyle]', false)
      formData.set('styles[size_type]', '_inch')
      formData.set('styles[isRedeemed]', true)
      formData.set('styles[bundleExchangeVersion]', this.versionObj.cartTyingAbtest.toLowerCase())
      if (this.baseInfo.formatStyles && this.baseInfo.formatStyles.color) {
        formData.set('styles[select][color]', this.baseInfo.formatStyles.color.id)
      }
      // if (this.baseInfo.hasSash) {
      //   formData.set('styles[select][sash_color]', this.selectedSashColor.styleId)
      // }
      if (this.baseInfo.formatStyles && this.baseInfo.formatStyles.size) {
        formData.set('styles[select][size]', this.baseInfo.formatStyles && this.baseInfo.formatStyles.size.standardSize.id)
      }
      formData.set('goods_number', 1)
      this.$axios.$post('/1.0/cart/goods', formData).then((res) => {
        if (res.code == 0) {
          //   this.setOrderSource(this.baseInfo.goodsId)
          this.retentionAddToCart({ ...this.baseInfo, goodsNumber: 1, csText: this.getColorAndSizeText(formData) }, res.data.rec_id)
          this.$emit('refreshCartList')
        } else {
          alert(res.msg)
          this.loading = false
          window.location.reload()
        }
      })
    },
    handleOrderSourceClick(type) {
      this.setOrderSourceFlag('redeem_offer_bundle', true)
      if (type) {
        this.setPoint('redeemedconfiguration', 'quickshop', 'click', { viewall: 1, ab: this.versionObj.cartTyingAbtest.toLowerCase() })
        this.redeemedAddToBag(type)
      }
    },
    getRedeemedGoodsPoint(ec, el, item) {
      const msg = {
        goodsId: item.goodsId,
        color: item.colorReal,
        cat_name: item.catName,
        cat_id: item.catId,
        goods_name: item.shownGoodsName,
        ab: this.versionObj.cartTyingAbtest.toLowerCase()
      }
      if (this.showSticker) {
        msg.viewall = 1 // 表示从搭售的viewall来的
      }
      return {
        ec,
        el,
        msg: JSON.stringify(msg)
      }
    },
    toDetail(baseInfo) {
      if (this.type) {
        window.open(this.countryUrl(baseInfo.goodsUrl))
      }
    }
  }
}
</script>

<style lang="less">
.redeemed-goods-swiper-content {
  display: flex;
  min-height: 98px;
  padding: 10px;
  box-sizing: border-box;
  background: var(--color-f9f9f9);
  &.swiper-slide {
    //  在轮播组件加载完成之前，先使用的宽度，保证页面样式不会错乱
    width: calc((100% - 30px) / 4);
    margin-right: 10px;
  }
  .goods_url {
    color: var(--color-121212);
    cursor: pointer;
  }
  .left_block {
    position: relative;
    width: 56px;
    height: 78px;
    margin-right: 10px;
    .sticker_block {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 38px;
      height: 38px;
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: var(--theme-color);
      color: #fff;
      font-family: @font-family-600;
      font-size: 14px;
      border-radius: 100%;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right_block {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 65px);
    .info_block {
      .goods_name {
        overflow: hidden;
        width: 100%;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 16px;
      }
      .color,
      .size {
        margin-top: 0px;
        overflow: hidden;
        width: 100%;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 16px;
      }
      .goods_url_item:hover {
        color: var(--theme-color);
      }
    }
    .price_block {
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .price-box {
        display: flex;
        align-items: center;
        &.MXN,
        &.AUD,
        &.CAD {
          flex-flow: column;
          align-items: flex-start;
        }
      }
      .shop_price {
        font-size: 14px;
        line-height: 14px;
        color: @theme-color;
        font-family: @font-family-600;
        margin-right: 5px;
        &.origin {
          color: var(--color-121212);
        }
      }
      .line_price {
        color: #999;
        font-size: 12px;
        line-height: 12px;
        font-family: @font-family-500;
        text-decoration: line-through;
      }
      .btn-box {
        cursor: pointer;
      }
      .icon-bag {
        font-size: 20px;
        cursor: pointer;
        fill: @theme-color;
      }
      .dot-box {
        display: none;
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: @theme-color;
        right: 0px;
        bottom: 16px;
      }
    }
  }
  .add_bag_notice {
    position: absolute;
    background-color: #fee0e0;
    border: 1px solid @theme-color;
    width: 286px;
    bottom: 0;
    right: 0;
    box-sizing: border-box;
    padding: 6px 8px;
    border-radius: 3px;
    display: flex;
    align-items: flex-start;
    transform: translateY(100%);
    &.position-l {
      left: 0;
      right: unset;
    }
    svg {
      font-size: 15px;
      // margin-right: 8px;
      margin: 2px 4px 0 0;
    }
    span {
      flex: 1;
    }
    .one {
      content: '';
      width: 0;
      height: 0;
      border-right: 6px solid transparent;
      border-bottom: 6px solid @theme-color;
      border-left: 6px solid transparent;
      position: absolute;
      top: 0%;
      right: 110px;
      margin-top: -7px;
    }
    .two {
      content: '';
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #fee0e0;
      position: absolute;
      top: 0%;
      right: 110px;
      margin-top: -11px;
    }
  }
}
</style>
