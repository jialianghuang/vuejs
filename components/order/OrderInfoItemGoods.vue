<template>
  <div
    v-show="showGoods"
    :class="[showGoods ? 'animation-slideflex-enter-active' : 'animation-slideflex-leave-active']"
    class="order-goods-list-box"
  >
    <div class="order-goods-list-box-content">
      <div class="goods_scroll">
        <div v-for="(productItem, index) in goodsList" :key="`good_${index}`">
          <div class="card">
            <div class="img-box">
              <az-sticker
                :stickerItem="productItem"
                v-if="productItem.stickers && Object.keys(productItem.stickers).length"
                :stickerInfo="productItem.stickers"
                :sticker-class="`cart-product-item-icon`"
              ></az-sticker>
              <img
                :data-src="addWebpSuffix(productItem.imgUrl)"
                :src="require('~/assets/images/default_img.jpg')"
                :alt="productItem.shownGoodsName"
                class="lazyload good-img"
              />
              <span v-if="!productItem.available" class="unavailable_style">
                <span class="white-bg"></span>
                <template v-if="!(productItem.styles && productItem.styles.select && productItem.styles.select.isSpecialStock)">
                  <az-icon :icon-class="'icon-a-bebacksoon-' + language" class="be_back_soon" fill="#666" />
                </template>
              </span>
            </div>
            <div class="base-info">
              <div class="top">
                <h4 class="good-name">
                  <a :href="navToGoodsDetail(productItem.detailUrl, productItem)">
                    {{ productItem.shownGoodsName }}
                    <span v-if="productItem.dressType == 'clearance'">({{ nl('page_bread_crumb_ready_to_ship') }}) </span>
                    <span v-if="productItem.isFinalSale">({{ nl('page_bread_crumb_ready_to_ship') }}) </span>
                    <span v-if="productItem.dressType == 'outlet'">({{ nl('page_bread_crumb_outlet') }}) </span>
                    <span v-if="productItem.suffix" class="gift-goods">({{ productItem.suffix }})</span>
                  </a>
                </h4>
                <!-- gift card -->
                <div v-if="productItem.isGiftCard" class="gift-card-item">
                  <p>
                    <span>{{ nl('page_gift_card_detail_message') }}:</span> {{ productItem.giftCard.cardMsg }}
                  </p>
                  <p>
                    <span>{{ nl('page_common_from') }}:</span> {{ productItem.giftCard.fromUser || userInfoEmail }}
                  </p>
                  <p>
                    <span>{{ nl('page_gift_card_order_send_to') }}:</span>
                    {{ productItem.giftCard.toUser ? productItem.giftCard.toUser.join(', ') : '' }}
                  </p>
                  <p class="gift-card-item-tips">
                    <span>{{ nl('page_gift_card_order_what_is_next') }}:</span> {{ nl('page_gift_card_order_what_is_next_desc') }}
                  </p>
                </div>
                <template v-else>
                  <p @click="showSizeDetailDialog(productItem)" class="good-color-size">
                    <span v-if="productItem.formatStyles && productItem.formatStyles.color" class="color">{{
                      productItem.shownColor
                    }}</span>
                    <span v-if="productItem.formatStyles && productItem.formatStyles.size" class="size">
                      {{ getSize(productItem) }}
                      <az-icon
                        v-if="sizeItems(productItem) && sizeItems(productItem).length"
                        icon-class="icon-lby_expand_arrow_down"
                        class="triangle"
                      ></az-icon>
                    </span>
                  </p>
                  <ul v-if="showSizeDetail" class="size-detail">
                    <li v-for="(sizeItem, sindex) in sizeItems(productItem)" :key="`size_${sindex}`">
                      <span>{{ sizeItem.name }}:</span>
                      <span v-if="productItem.catId == '3102'">
                        {{ sizeItem.name == nl('page_common_foot_length') ? sizeItem.value : parseInt(sizeItem.value) }}
                        {{ sizeItem.name == nl('page_common_foot_length') ? (sizeItem.unit == 'inch' ? 'in' : 'cm') : '' }}</span
                      >
                      <span v-else>{{ sizeItem.value }} {{ sizeItem.key !== 'age' ? sizeItem.unit : '' }}</span>
                    </li>
                  </ul>
                  <p v-if="showGetTime" class="good-estimate-date">{{ productItem.lastGetTime }}</p>
                  <p v-if="!productItem.available" class="goods-warning">{{ nl('page_js_out_of_stock') }}</p>
                  <!-- 配件定制 -->
                  <div v-if="productItem.formatStyles && productItem.formatStyles.customName" class="customization">
                    {{ nl('page_common_line_one') }}: {{ productItem.formatStyles.customName }}
                  </div>
                  <!--sample gift tip -->
                  <div v-if="productItem.isGift && productItem.dressType == 'sample'" class="gift-wedding-veil">
                    {{ nl('page_cart_gift_wedding_veil') }}
                  </div>
                  <!-- measure tip -->
                  <div v-if="productItem.tip" class="measure-tip">{{ productItem.tip }}</div>
                </template>
              </div>

              <div class="footer">
                <p>
                  <span v-if="productItem.hasLinePrice" class="price discount">{{ productItem.totalAmountDisplay }}</span>
                  <span :class="['price', { 'no-deal': productItem.hasLinePrice }]">{{ productItem.totalNoDealPriceDisplay }}</span>
                </p>
                <span class="number"><i>x</i> {{ productItem.goodsNumber }}</span>
              </div>
              <az-with-code
                v-if="productItem.activityCouponCode && productItem.activityBonus && !productItem.isGift"
                :code="productItem.activityCouponCode"
                class="cart_with_code"
              ></az-with-code>
              <az-with-code
                v-else-if="$route.name == 'checkout' && productItem.couponCode && !productItem.isGift && productItem.bonus"
                :code="productItem.couponCode"
                :class="country"
                class="cart_with_code"
              ></az-with-code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderInfoItemGoods',
  components: {},
  props: {
    showGoods: {
      type: Boolean,
      default: false
    },
    goodsList: {
      type: Array,
      default() {
        return []
      }
    },
    showGetTime: {
      // 是否显示交期
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showSizeDetail: false
    }
  },
  computed: {
    // 当前应该展示的国家，如果有订单国家code，取订单国家code，否则就是country
    currentCountry() {
      const res = (this.orderInfoItem && this.orderInfoItem.countryCode) || this.$route.query.order_country_code || this.country
      return res
    },
    isOxxoPayPrepare() {
      return (
        this.orderInfoItem.paymentExtension &&
        this.orderInfoItem.paymentExtension.hasOwnProperty('ticketPayCodeIsExpired') &&
        !this.orderInfoItem.paymentExtension.ticketPayCodeIsExpired
      )
    }
  },
  methods: {
    getBiCommonParams(ec, el) {
      if (process.server) return
      const params = {
        common: {
          ec,
          el
        }
      }
      return params
    },
    showSizeDetailDialog(productItem) {
      if (!this.sizeItems(productItem).length) return false
      this.showSizeDetail = !this.showSizeDetail
    },
    sizeItems(productItem) {
      if (productItem.formatStyles && productItem.formatStyles.size) {
        if (productItem.formatStyles.size.CustomSize && productItem.formatStyles.size.CustomSize.items) {
          return productItem.formatStyles.size.CustomSize.items
        } else if (productItem.formatStyles.size.standardSize && productItem.formatStyles.size.standardSize.items) {
          return productItem.formatStyles.size.standardSize.items
        }
      }
      return []
    },
    getSize(productItem) {
      if (productItem.formatStyles && productItem.formatStyles.size) {
        if (productItem.formatStyles.size.CustomSize) {
          return ' / ' + productItem.formatStyles.size.CustomSize.name
        } else if (productItem.formatStyles.size.standardSize) {
          return ' / ' + productItem.formatStyles.size.standardSize.shownName
        }
      }
      return ''
    }
  }
}
</script>

<style lang="less" scoped>
.order-goods-list-box {
  color: #101010;
  position: absolute;
  text-align: left;
  padding-top: 10px;
  width: 364px;
  z-index: @z-index-5;
  top: 100%;
  right: -15px;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--color-cccccc);
    border-left: 6px solid transparent;
    position: absolute;
    top: 11px;
    right: 15px;
    margin-top: -7px;
  }
  &:after {
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: #ffffff;
    position: absolute;
    top: 11px;
    right: 15px;
    margin-top: -11px;
  }
  .order-goods-list-box-content {
    border: 1px solid #ccc;
    background: #fff;
  }
  .goods_scroll {
    padding: 0px 15px;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 466px;
    box-sizing: border-box;
  }
  .card {
    display: flex;
    position: relative;
    padding: 15px 0;
    .img-box {
      position: relative;
      img.good-img {
        width: 90px;
        vertical-align: middle;
      }
      .unavailable_style {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        .white-bg {
          display: inline-block;
          width: 100%;
          height: 100%;
          background: #fff;
          opacity: 0.7;
        }
        .be_back_soon {
          width: 50px;
          height: 50px;
          position: absolute;
          z-index: 4;
        }
      }
      /deep/ .sticker-icon {
        width: 40px !important;
        height: 40px !important;
      }
    }
    .base-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 15px;
      text-transform: initial;
      .top {
        .good-name {
          line-height: 18px;
          a {
            color: var(--color-121212);
          }
          .gift-goods {
            font-size: 12px;
            color: @theme;
            text-transform: capitalize;
          }
        }
        .gift-card-item {
          margin-bottom: 10px;
          p {
            margin-top: 5px;
            word-break: break-word;
          }
        }
        .good-color-size {
          line-height: 18px;
          margin: 5px 0;
          color: var(--color-121212);
          .size {
            text-transform: uppercase;
          }
        }
        .good-estimate-date {
          margin-bottom: 20px;
          line-height: 18px;
          color: var(--color-5fa452);
        }
        .goods-warning {
          color: @theme;
          margin: 10px 0 5px;
        }
        .size-detail {
          margin: 5px 0;
          font-family: @font-family-600;
          color: var(--color-999999);
          font-size: 12px;
          line-height: 16px;
        }
      }
      .footer {
        display: flex;
        justify-content: space-between;
        height: 16px;
        font-family: @font-family-600;
        font-size: 16px;
        line-height: 16px;
        .price {
          text-transform: uppercase;
          &.discount {
            color: @theme;
          }
          &.no-deal {
            margin-left: 5px;
            font-size: 12px;
            line-height: 14px;
            color: var(--color-999999);
            text-decoration: line-through;
          }
        }
        .number {
          font-size: 12px;
          line-height: 12px;
          i {
            font-style: normal;
            transform: scale(0.8);
          }
        }
      }
      .cart_with_code {
        margin-top: 10px;
      }
    }
    &::after {
      content: '';
      width: 200%;
      height: 1px;
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: #eee;
      transform: scaleX(0.5);
      transform-origin: 0 0;
    }
  }
}
</style>
