<template>
  <div :class="versionObj.listWithCodeAbtest" class="sod-coupon-price-origin-box">
    <div :class="{ 'activity-prod-price-box': !!promotionType, 'sod-coupon': true }">
      <div class="prod-com-price">
        <strong class="price_show goods-price">{{ showSodLinePrice }}</strong>
        <span class="old_price goods-no-deal-price">{{ baseInfo.noDealPriceDisplay }}</span>
        <span class="prod-save-price">
          <!-- <span>({{ nl('page_common_thrift') }} {{ showSodCouponLinePrice }})</span> -->
          <!-- AzWithCoupon 有划线价就展示save百分比,不分是 coupon  activity sale 、 limit sale 、 flash sale -->
          <AzWithCoupon
            v-if="baseInfo.offRateValue"
            :value="showOffRateNoneSodCouponValue"
            :showText="false"
            :hasShopPriceRange="baseInfo.hasShopPriceRange"
            :baseInf="{}"
          />
        </span>
        <!-- bounds module -->
        <TagBuyMoreSaveMore
          :nameEl="'dp_name'"
          :descEl="'dp_description'"
          v-if="baseInfo.buyMoreSaveMore && baseInfo.bundlePromotionInfo && baseInfo.bundlePromotionInfo.showProductBundleTag && !from"
          :bundlePromotionInfo="baseInfo.bundlePromotionInfo"
        />
        <az-limited-time
          v-if="promotionType == 'limitSale' && from"
          :stickers="stickerInfo"
          :show-limited-time-tag="true"
          :goodsId="baseInfo.goodsId"
        ></az-limited-time>
        <exclusive-offer
          v-if="baseInfo.showBundlePrice"
          :price="baseInfo.bundlePrice"
          :priceOff="baseInfo.bundlePriceOff"
          question-position="under"
          scene="details"
        ></exclusive-offer>
        <section v-if="!baseInfo.isFinalSale" class="sod-count-down-box">
          <!-- 活动促销  -->
          <activity-sale-timer v-if="promotionType == 'activitySale'" :showCountDownTime="showCountDownTime"></activity-sale-timer>
          <!-- limit sale -->
          <limit-sale-timer
            v-else-if="promotionType == 'limitSale'"
            :delayDesc="delayDesc"
            :showCountDownTime="showCountDownTime"
          ></limit-sale-timer>
          <!-- flash sale 促销 -->
          <flash-sale-timer
            v-else-if="promotionType == 'flashSale' || (!from && baseInfo.activityCouponCode == 'HIBEAUTY')"
            :flashSaleInfo="flashSaleInfo"
            :showCountDownTime="showCountDownTime"
          ></flash-sale-timer>
        </section>
        <!-- promotional offer price description -->
        <span v-if="tipText" class="sod-activity-sale-intro">
          <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
          <div class="introduce-hover-content">
            <div v-if="promotionType == 'flashSale'" class="flash-sale-intro-pop">
              <p class="intro-title">{{ nl('page_flash_sale_timer_text') }}:</p>
              <p class="intro-dec">
                {{ nl('page_flash_sale_for_short_a_time') }}
                <a :href="countryUrl('/all/flash-sale')" class="a-href to-flash-sale ui-link">
                  {{ nl('page_flash_sale_timer_text1') }} &gt;
                </a>
              </p>
              <p class="intro-title">{{ nl('page_flash_sale_tips') }}</p>
              <p class="intro-dec">{{ nl('page_flash_sale_intro_dec_1') }}</p>
              <p class="intro-dec">
                {{ nl('page_flash_sale_intro_dec_2_1') }}
                <span class="intro-highlight">{{ nl('page_flash_sale_intro_dec_2_2') }}</span>
              </p>
              <p class="intro-dec">{{ nl('page_flash_sale_intro_dec_3') }}</p>
            </div>
            <div v-else v-html="tipText"></div>
          </div>
        </span>
      </div>
      <!-- 展示含税提示 -->
      <p v-if="taxIncluseText" class="tax-incluse">{{ taxIncluseText }}</p>
      <!-- 预售商品进度条 -->
      <div v-if="baseInfo.preSaleGoodsProgress && Object.keys(baseInfo.preSaleGoodsProgress).length" class="goods-progress">
        <prelaunch-goods-progress
          :from="'product'"
          :preSaleGoodsProgress="baseInfo.preSaleGoodsProgress"
          :baseInfo="baseInfo"
          :selectedColor="selectedColor"
        ></prelaunch-goods-progress>
      </div>
      <template v-if="baseInfo.isFinalSale">
        <!-- 活动促销  -->
        <activity-sale-timer v-if="promotionType == 'activitySale'"></activity-sale-timer>
        <!-- limit sale -->
        <limit-sale-timer v-else-if="promotionType == 'limitSale'" :delayDesc="delayDesc"></limit-sale-timer>
        <!-- flash sale 促销 -->
        <flash-sale-timer v-else-if="promotionType == 'flashSale'" :flashSaleInfo="flashSaleInfo"></flash-sale-timer>
      </template>
    </div>
  </div>
</template>

<script>
import idArr from '@/assets/js/limitedGoods'
import TagBuyMoreSaveMore from '@/components/product/TagBuyMoreSaveMore'
import azLimitedTime from '@/components/az-ui/AzLimitedTime'
import ExclusiveOffer from '@/components/product/ExclusiveOffer'
import ActivitySaleTimer from '@/components/promotion/ActivitySaleTimer'
import FlashSaleTimer from '@/components/promotion/FlashSaleTimer'
import LimitSaleTimer from '@/components/promotion/LimitSaleTimer'
import PrelaunchGoodsProgress from '@/components/promotion/PrelaunchGoodsProgress'
import AzWithCoupon from '@/components/az-ui/AZWithCoupon'

import { mapState } from 'vuex'
export default {
  name: 'SodCouponPriceOriginBox',
  languageKeys: [
    'page_common_thrift',
    'page_flash_sale_timer_text',
    'page_flash_sale_for_short_a_time',
    'page_flash_sale_timer_text1',
    'page_flash_sale_tips',
    'page_flash_sale_intro_dec_1',
    'page_flash_sale_intro_dec_2_1',
    'page_flash_sale_intro_dec_2_2',
    'page_flash_sale_intro_dec_3'
  ],
  components: {
    TagBuyMoreSaveMore,
    azLimitedTime,
    ExclusiveOffer,
    ActivitySaleTimer,
    FlashSaleTimer,
    LimitSaleTimer,
    PrelaunchGoodsProgress,
    AzWithCoupon
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    },
    stickerInfo: {
      type: Array,
      default() {
        return []
      }
    },
    retireInfo: {
      type: Object,
      default: () => {
        return {
          retireGoods: {}
        }
      }
    },
    flashSaleInfo: {
      type: Object,
      default() {
        return null
      }
    },
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      countDownTime: null
    }
  },
  computed: {
    ...mapState({
      selectedColor: (state) => state.product.selectedColor
    }),
    showSodLinePrice({ baseInfo }) {
      const { couponInfo = {} } = baseInfo
      return couponInfo.noneSodCouponPrice.shopPriceNoneSodCouponDisplay
    },
    showSodCouponLinePrice({ baseInfo, promotionType }) {
      const { couponInfo = {} } = baseInfo
      return couponInfo.noneSodCouponPrice.priceOffNoneSodCouponDisplay
    },
    showOffRateNoneSodCouponValue({ baseInfo }) {
      const { couponInfo = {} } = baseInfo
      return couponInfo.noneSodCouponPrice.offRateNoneSodCouponValue
    },
    promotionType() {
      let promotionType = ''
      // 促销类型  activitySale、limitSale、flashSale
      if (this.baseInfo.countdownEndTime) {
        promotionType = 'activitySale'
      } else if (!this.retireInfo.retireGoods && this.baseInfo.activityInfo) {
        promotionType = 'limitSale'
      } else if (this.flashSaleInfo) {
        promotionType = 'flashSale'
      }

      return promotionType
    },
    delayDesc() {
      if (this.baseInfo.activityInfo && this.baseInfo.activityInfo.increasePrice) {
        return this.baseInfo.activityInfo.increasePriceDesc
      } else if (idArr.includes(+this.baseInfo.goodsId)) {
        return this.nl('page_product_valid_until')
      } else {
        return this.nl('page_product_sale_ends')
      }
    },
    tipText({ promotionType, baseInfo, delayDesc, from }) {
      let text = null
      if (promotionType == 'activitySale') {
        text = baseInfo.activityDesc
      } else if (promotionType == 'limitSale' && !from) {
        return delayDesc + ' ' + baseInfo.activityInfo.retireDate
      } else if (promotionType == 'flashSale') {
        return true
      }
      return text
    },
    // 是否展示倒计时，如果展示，需加背景色
    showCountDownTime({ baseInfo, flashSaleInfo, promotionType }) {
      // 1.promotionType == 'activitySale'
      // 2.promotionType = 'limitSale'  baseInfo.activityInfo.endTime && baseInfo.activityInfo.countDown > 0
      // 3.promotionType = 'flashSale' flashSaleInfo.endTime
      const showActivitySaleCountDown = promotionType == 'activitySale'
      const showLimitSaleCountDown = promotionType == 'limitSale' && baseInfo.activityInfo.endTime && baseInfo.activityInfo.countDown > 0
      const showFlashSaleCountDown = promotionType == 'flashSale' && flashSaleInfo.endTime
      return showActivitySaleCountDown || showLimitSaleCountDown || showFlashSaleCountDown
    }
  },
  watch: {
    promotionType(val, old) {
      console.log('val, old:', val, old)
      if (val != old) {
        this.getCountDownTime()
      }
    }
  },
  created() {
    this.getCountDownTime()
  },
  methods: {
    getCountDownTime() {
      const { promotionType, baseInfo, flashSaleInfo } = this
      let time = null
      if (promotionType == 'activitySale') {
        time = baseInfo.countdownEndTime
      } else if (promotionType == 'limitSale') {
        const { activityInfo = {} } = baseInfo
        if (activityInfo.endTime && activityInfo.countDown > 0) {
          time = activityInfo.endTime
        }
      } else if (promotionType == 'flashSale') {
        time = flashSaleInfo.endTime
      }
      this.countDownTime = time
    }
  }
}
</script>

<style lang="less" scoped>
.A {
  .goods-price {
    color: @theme-color !important;
  }
}
.sod-coupon-price-origin-box {
  .activity-prod-price-box {
    background-color: @box-bg-color;
    border: 1px solid @box-border-color;
    padding: 10px;
  }
  // 促销活动样式
  .sod-activity-sale-intro {
    margin-left: 2px;
    cursor: pointer;
    position: relative;
    font-size: 13px;
    &:hover {
      .introduce-hover-content {
        display: block;
      }
    }
    .introduce-hover-content {
      display: none;
      min-width: 280px;
      padding: 15px;
      top: 22px;
      left: 57px;
      transform: translateX(-50%);
      position: absolute;
      z-index: 3;
      font-weight: initial;
      background: #fff;
      box-shadow: 0 0 6px 0 rgba(153, 153, 153, 0.8);
      margin-top: 2px;
      color: var(--color-121212);
      &:before {
        content: '';
        width: 0;
        height: 0;
        border-right: 6px solid transparent;
        border-bottom: 6px solid var(--color-cccccc);
        border-left: 6px solid transparent;
        position: absolute;
        top: 0%;
        left: calc(~'50% - 57px');
        margin-top: -7px;
      }
      &:after {
        content: '';
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-bottom-color: #ffffff;
        position: absolute;
        top: 0%;
        left: calc(~'50% - 57px');
        margin-top: -11px;
      }
    }
    .flash-sale-intro-pop {
      .intro-title {
        color: var(--color-121212);
        font-family: @font-family-600;
      }
      .intro-dec {
        color: var(--color-121212);
        margin: 5px 0 15px;
        .intro-highlight {
          color: var(--color-121212);
          font-family: @font-family-600;
        }
      }
      .ui-link {
        color: @theme;
        text-decoration: underline;
      }
    }
  }
  .prod-com-price {
    display: flex;
    align-items: center;
    font-size: 24px;
    .goods-price {
      color: @theme-color;
      font-family: @font-family-600;
    }
    .goods-no-deal-price {
      color: #999;
      text-decoration: line-through;
      font-size: 16px;
      margin-left: 5px;
      font-weight: 400;
    }
    .prod-save-price {
      color: @theme-color;
      font-size: 13px;
      line-height: 18px;
      margin-left: 10px;
      display: flex;
    }
    /deep/ .tag-buy_more_save_more {
      height: 30px;
      padding: 0 10px;
      margin-right: 10px;
      filter: grayscale(1);
      z-index: @z-index + 2;
    }
    .sod-count-down-box {
      font-size: 13px;
      /deep/ .flashSale,
      /deep/ .limitSale {
        margin-top: 0;
        .activity-sale-pro-box {
          // & > div:first-child {
          //   display: none;
          // }
          .sales-progress {
            margin-top: 0 !important;
          }
        }
      }
    }
  }
  .sod-coupon {
    background-color: transparent;
    border: none;
    padding: unset;
    .goods-price {
      font-size: 20px;
      color: var(--color-121212);
    }
    .goods-no-deal-price {
      margin: 0 5px;
      font-family: @font-family-500;
      font-size: 13px;
    }
    .prod-save-price {
      color: var(--color-121212);
      margin: 0;
      // margin-right: 10px;
    }
  }
}
</style>
