<template>
  <div id="description" :class="[{ 'sod-b': sodDetailVersionFun(baseInfo) }]">
    <div id="name-des">
      <h1 class="des_line">
        <span>
          <span v-if="baseInfo.brandId === 20" style="text-transform: initial;">
            <template v-if="baseInfo.dressType === 'sample'">
              {{ baseInfo.shownGoodsName.toUpperCase() }}
            </template>
            <template v-else> Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE </template>
          </span>
          <template v-else>
            {{ baseInfo.goodsTitle ? baseInfo.goodsTitle : baseInfo.shownGoodsName }}
          </template>
          <em v-if="baseInfo.dressType == 'clearance' || baseInfo.dressType == 'outlet' || baseInfo.isFinalSale" class="final-sale">
            ( {{ nl('page_product_clearance_desc') }} )
          </em>
          <az-label-sticker :stickers="stickerInfo" margin="-4px 2px 0px"></az-label-sticker>
        </span>
      </h1>
      <p v-if="baseInfo.goodsSubTitle" class="goods-sub-name">{{ baseInfo.goodsSubTitle }} {{ selectedColor.name }}</p>

      <div class="spec-style">
        <div v-if="!hideBrandName" @mouseenter="handOver(true)" @mouseleave="handOver(false)" class="cat cat-spec">
          <template v-if="showBrandName && baseInfo.brandInfo.name">
            <a
              v-track.viewOnce.click="{ id: `${baseInfo.goodsId}_${baseInfo.key}_brand`, common: getBiParamsKKPre() }"
              :href="countryUrl(baseInfo.brandUrl)"
              :target="baseInfo.brandUrl ? '_blank' : '_self'"
              class="brand_name pointer"
            >
              <template v-if="baseInfo.brandId === 20">
                Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE
              </template>
              <template v-else>
                {{ baseInfo.brandInfo.name }}
              </template>
            </a>
            <template v-if="baseInfo.brandInfo.desc">
              <az-icon
                @mouseenter.native="introduceShow = true"
                @mouseleave.native="introduceShow = false"
                class="icon-question"
                icon-class="icon-gwc-_question_"
              />
              <div :class="{ show: introduceShow }" class="brand_introduce blush_mark">
                <div class="brand_detail">
                  <p v-html="baseInfo.brandInfo.desc"></p>
                </div>
              </div>
            </template>
          </template>
          <template v-else-if="showSapphire">
            <a :href="countryUrl('/all/ready-to-ship-formal?current_in_stock=yes')" class="brand_name pointer">{{
              nl('page_common_sapphire')
            }}</a>
            <az-icon
              @mouseenter.native="introduceShow = true"
              @mouseleave.native="introduceShow = false"
              class="icon-question"
              icon-class="icon-gwc-_question_"
            />
            <div :class="{ show: introduceShow }" class="brand_introduce sapphire">
              <div class="brand_detail">
                <p>{{ nl('page_product_desc_text4') }}</p>
                <p>{{ nl('page_product_desc_text5') }}</p>
              </div>
            </div>
          </template>
          <template v-else>
            <span v-if="baseInfo.goodsId == '1002174'"> {{ nl('page_zion_brides') }}</span>
            <span v-else-if="baseInfo.dressType == 'outlet'"> {{ nl('page_bread_crumb_outlet') }}</span>
            <span v-else-if="baseInfo.catId == '8'">{{ nl('page_category_bride_mother') }}</span>
          </template>
        </div>
        <div
          v-if="[3, 3098].includes(+baseInfo.catId) && !sodDetailVersionFun(baseInfo)"
          :class="{ 'style-id-spec-noborder': !baseInfo.brandInfo.name || hideBrandName }"
          class="style-id-spec"
        >
          {{ nl('page_common_style') }}&nbsp;<span class="style-id">{{ baseInfo.goodsId }}</span>
        </div>
        <template v-if="reviewInfo.totalCount != 0 && sodDetailVersionFun(baseInfo)">
          <!-- 点击跳转到评论位置 -->
          <div @click="showReview()" class="review-rating">
            <az-rate :value="reviewInfo.rating * 1" :readonly="true" :showScore="false" :title="reviewInfo.rating" space="0"></az-rate>
            <div class="show_review">
              {{ nl('page_goods_reviews') }}(<span>{{ reviewInfo.totalCount }}</span
              >)
            </div>
          </div>
        </template>
      </div>

      <div v-if="baseInfo.goodsId == '1002174'" class="zion_des">{{ nl('page_zion_brides') }}</div>

      <template v-if="reviewInfo.totalCount != 0 && !sodDetailVersionFun(baseInfo)">
        <!-- 点击跳转到评论位置 -->
        <div @click="showReview()" class="review-rating">
          <az-rate :value="reviewInfo.rating * 1" :readonly="true" :showScore="false" :title="reviewInfo.rating" space="0"></az-rate>
          <div class="show_review">
            {{ nl('page_goods_reviews') }}(<span>{{ reviewInfo.totalCount }}</span
            >)
          </div>
        </div>
      </template>

      <!-- 价格信息 -->
      <div :class="['prod-price-box', { sod: isSpecialCatId(baseInfo.catId), 'sod-old': !showSodCouponPrice }]">
        <div v-if="!showSodCouponPrice" :class="{ 'activity-prod-price-box': showCountDownTime }">
          <div id="price" class="prod-com-price">
            <!-- AZWEB-18887 样衣3件20活动 tryonSaveLimit-->
            <!-- <template v-if="baseInfo.tryonSaveLimit">
              <span class="origin-price">{{ baseInfo.shopPriceDisplay }}</span>
              <span v-html="nl('page_common_try_on_number_for_' + country.toLowerCase(), null, { number: baseInfo.tryonSaveLimit || 3 })">
              </span>
            </template> -->
            <div v-if="baseInfo.dressType == 'sample' && isBridal" class="goods-price-item">
              <span class="origin-price">{{ baseInfo.originalPriceInfo && baseInfo.originalPriceInfo.noDealPriceDisplay }}</span>
              <span class="price-item">| {{ nl('page_common_try_on_for') }}</span>
              <span class="no-deal-price sample-price">{{ baseInfo.shopPriceDisplay }}</span>
            </div>
            <template v-else-if="baseInfo.hasShopPriceRange || baseInfo.hasLinePrice">
              <!-- AZWEB-21266 未选中sku时展示价格区间 -->
              <span v-if="baseInfo.hasShopPriceRange" class="goods-price range-price"
                >{{ baseInfo.minShopPriceDisplay }} - {{ baseInfo.maxShopPriceDisplay }}</span
              >
              <span v-else class="price_show goods-price">{{ baseInfo.shopPriceDisplay }}</span>
              <span class="old_price goods-no-deal-price">{{ baseInfo.noDealPriceDisplay }}</span>
            </template>
            <template v-else>
              <span class="price_show">{{ baseInfo.shopPriceDisplay }}</span>
            </template>
            <!-- 该组件这里实际没有使用: showLimitedTimeTag false -->
            <!-- <az-limited-time
              v-if="showLimitedTime"
              :stickers="stickerInfo"
              :show-limited-time-tag="false"
              :goodsId="baseInfo.goodsId"
            ></az-limited-time> -->
            <exclusive-offer
              v-if="baseInfo.showBundlePrice"
              :price="baseInfo.bundlePrice"
              :priceOff="baseInfo.bundlePriceOff"
              question-position="under"
              scene="details"
            ></exclusive-offer>
            <!-- sod样式和其他商品不一样 -->
            <div v-if="sodDetailVersionFun(baseInfo)" class="activity-block">
              <!-- AzWithCoupon 有划线价就展示save百分比,不分是 coupon  activity sale 、 limit sale 、 flash sale -->
              <client-only>
                <AzWithCoupon
                  v-if="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
                  :value="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
                  :showText="!!baseInfo.activityCouponCode"
                  :code="showCode(baseInfo)"
                  :hasShopPriceRange="baseInfo.hasShopPriceRange"
                  :baseInfo="baseInfo"
                />
              </client-only>
              <!-- coupon code 优先级最高，有code的时候，其他活动样式不显示 promotionType 为空-->
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
                v-else-if="promotionType == 'flashSale'"
                :flashSaleInfo="flashSaleInfo"
                :showCountDownTime="showCountDownTime"
              ></flash-sale-timer>
              <!-- flash sale商品 优惠的价格 -->
              <span v-if="baseInfo.priceOff" class="prod-save-price">
                <!-- promotional offer price description -->
                <span v-if="tipText && isSpecialCatId(baseInfo.catId)" class="sod-activity-sale-intro">
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
              </span>
            </div>

            <!-- AZWEB-18170 样衣买二送一 变更 AZWEB-18459 Buy more save more - 支持lego配置 baseInfo.bundlePromotionInfo.showProductBundleTag-->
            <TagBuyMoreSaveMore
              :nameEl="'dp_name'"
              :descEl="'dp_description'"
              v-if="baseInfo.buyMoreSaveMore && baseInfo.bundlePromotionInfo"
              :bundlePromotionInfo="baseInfo.bundlePromotionInfo"
            />
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

          <div v-if="!sodDetailVersionFun(baseInfo)" class="activity-block">
            <!-- AzWithCoupon 有划线价就展示save百分比,不分是 coupon  activity sale 、 limit sale 、 flash sale -->
            <!-- coupon code 优先级最高，有code的时候，其他活动样式不显示 promotionType 为空-->
            <client-only>
              <AzWithCoupon
                v-if="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
                :value="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
                :showText="!!baseInfo.activityCouponCode"
                :code="showCode(baseInfo)"
                :hasShopPriceRange="baseInfo.hasShopPriceRange"
                :baseInfo="baseInfo"
              />
            </client-only>
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
              v-else-if="promotionType == 'flashSale'"
              :flashSaleInfo="flashSaleInfo"
              :showCountDownTime="showCountDownTime"
            ></flash-sale-timer>
          </div>
        </div>
        <template v-else>
          <SodCouponPriceOriginBox v-if="showSodBaseCouponPrice" v-bind="sodCouponPriceOriginValue" />
          <SodCouponPriceBox :base-info="baseInfo" />
        </template>
        <best-seller-entrance
          v-if="!['US'].includes(country) && sellerInfo.sort && sellerInfo.sort <= 10"
          :sellerInfo="sellerInfo"
        ></best-seller-entrance>
        <div
          v-track.viewOnce.click="{ id: 'signuptoget3freeswatch', common: { ec: 'swatch', el: 'signuptoget3freeswatch' } }"
          v-if="canShow && !isLogin && baseInfo.catId == 33"
          @click="signUp"
          :class="['swatch-sign-up', { bridal: isBridal }]"
        >
          <span class="text-item upper">{{ nl('page_login_leave_free_swatches') }}</span>
          <span class="line-block"></span>
          <span class="text-item">{{ nl('page_common_swatch_sign_up_text') }}</span>
          <span class="arrow"></span>
        </div>
        <afterpay-view :afterpayTips="baseInfo.afterPayTips" v-if="baseInfo.hasAfterPay" />
        <!-- Klarna 卖点信息 -->
        <template v-if="baseInfo.hasKlarna">
          <!-- DE 使用自定义的Klarna卖点，不使用sdk的-->
          <az-klarna-messaging v-if="country == 'DE'" :purchaseAmountDisplay="baseInfo.shopPriceDisplay"></az-klarna-messaging>
          <klarna-messaging
            v-else
            :purchaseAmount="(baseInfo.shopPrice * 100).toFixed() * 1"
            :dataKey="'credit-promotion-badge'"
          ></klarna-messaging>
        </template>
      </div>

      <!-- final sale -->
      <p v-if="finalSale" class="flash-sale">
        {{ nl('page_sample_retired') }}
        <!-- 中山仓发货的商品warehouse为1,不展示ships in 48hrs  -->
        <span v-if="baseInfo.warehouse != 1" class="flash-sale-tag">{{ nl('page_ships_in_time') }}</span>
      </p>

      <!-- 信用卡分期 -->
      <div v-if="baseInfo.installments && baseInfo.installments.length" @click="handlePopupInstallmentShow" class="tip-installment">
        <az-icon icon-class="icon-menu" class="icon-menu" />
        <span>{{ installmentsTipInfo.installments }} x {{ installmentsTipInfo.installment_amount_display }}</span
        ><az-icon icon-class="icon-icon_des" class="icon-des" />
      </div>

      <!--带convertible属性的商品的相关调整-->
      <div id="ways_to_wear" v-if="detailsInfo.other && detailsInfo.other.convertibleWay">
        <img src="../../assets/images/way_to_wear_icon.png" alt="icon" />
        <a :href="countryUrl(`${detailsInfo.other.convertibleUrl}?back=${$route.path}`)" target="_blank">
          <span>{{ detailsInfo.other.convertibleTxt }}</span>
        </a>
      </div>

      <!-- 延迟下架-->
      <div class="ready-to-off-sale">
        <!-- AZWEB-20728 kk商品增加下架提示文案 -->
        <p v-if="baseInfo.brandId == 16 && !['clearance', 'outlet'].includes(baseInfo.dressType)" class="text">
          {{ nl('page_product_kk_retire_tips') }}
        </p>
        <template v-else-if="retireInfo.retireGoods && !!Object.keys(retireInfo.retireGoods).length">
          <p class="text">{{ nl('page_sample_will_retire') }} {{ retireInfo.retireGoods.retireDate }}</p>
          <p class="time-decrease">
            <span class="triangle"></span><span class="text">{{ retireInfo.retireGoods.leftTime }}</span>
          </p>
        </template>
      </div>
      <div v-if="baseInfo.catId == 1504 && showCountDown" class="face-mask-activity">
        <p>
          {{ nl('page_product_desc_text1') }} <span class="activity-time">{{ countDownTime }}</span>
        </p>
        <p>{{ nl('page_product_desc_text2') }} {{ country == 'US' ? '$30' : '$40' }} · {{ nl('page_product_desc_text3') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import idArr from '@/assets/js/limitedGoods'
import ActivitySaleTimer from '@/components/promotion/ActivitySaleTimer'
import FlashSaleTimer from '@/components/promotion/FlashSaleTimer'
import LimitSaleTimer from '@/components/promotion/LimitSaleTimer'
import PrelaunchGoodsProgress from '@/components/promotion/PrelaunchGoodsProgress'
import AfterpayView from '@/components/common/AfterpayView'
// import AzLimitedTime from '@/components/az-ui/AzLimitedTime'
import AzWithCoupon from '@/components/az-ui/AZWithCoupon'
import AzRate from '@/components/az-ui/Rate/AzRate'
import ExclusiveOffer from '@/components/product/ExclusiveOffer'
import { mapGetters, mapState } from 'vuex'
import TagBuyMoreSaveMore from '@/components/product/TagBuyMoreSaveMore'
import KlarnaMessaging from '@/components/common/KlarnaMessaging'
import AzKlarnaMessaging from '@/components/common/AZKlarnaMessaging'
import SodCouponPriceOriginBox from '@/components/common/excitation/SodCouponPriceOriginBox'
import SodCouponPriceBox from '@/components/common/excitation/SodCouponPriceBox'
import BestSellerEntrance from '@/components/product/BestSellerEntrance'
import AzLabelSticker from '@/components/az-ui-new/AzLabelSticker'
import { countryList } from '@/assets/js/euSizeMap'

export default {
  name: 'ProductDescription',
  languageKeys: [
    'page_product_clearance_desc',
    'page_common_sapphire',
    'page_zion_brides',
    'page_bread_crumb_outlet',
    'page_category_bride_mother',
    'page_goods_reviews',
    'page_common_save',
    'page_sample_retired',
    'page_ships_in_time',
    'page_sample_will_retire',
    'page_product_valid_until',
    'page_product_sale_ends',
    'page_common_try_on_for',
    'page_common_style',
    'page_common_try_on_number_for',
    'page_login_leave_free_swatches',
    'page_common_swatch_sign_up_text',
    'page_product_kk_retire_tips',
    'page_sample_name',
    ...countryList.map((v, i) => 'page_common_try_on_number_for_' + v),
    ...new Array(5).fill().map((v, i) => 'page_product_desc_text' + (i + 1)),
    ...ExclusiveOffer.languageKeys,
    ...FlashSaleTimer.languageKeys,
    ...ActivitySaleTimer.languageKeys,
    ...LimitSaleTimer.languageKeys,
    ...AzRate.languageKeys,
    ...AzWithCoupon.languageKeys,
    ...PrelaunchGoodsProgress.languageKeys,
    ...ExclusiveOffer.languageKeys,
    ...AzKlarnaMessaging.languageKeys,
    ...SodCouponPriceOriginBox.languageKeys,
    ...SodCouponPriceBox.languageKeys,
    ...BestSellerEntrance.languageKeys,
    ...AzLabelSticker.languageKeys
  ],
  components: {
    FlashSaleTimer,
    ActivitySaleTimer,
    LimitSaleTimer,
    AzRate,
    // AzLimitedTime,
    AzWithCoupon,
    AfterpayView,
    PrelaunchGoodsProgress,
    ExclusiveOffer,
    TagBuyMoreSaveMore,
    KlarnaMessaging,
    AzKlarnaMessaging,
    SodCouponPriceOriginBox,
    SodCouponPriceBox,
    BestSellerEntrance,
    AzLabelSticker
  },
  props: {
    detailsInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    reviewInfo: {
      type: Object,
      default() {
        return {}
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
    stickerInfo: {
      type: Array,
      default() {
        return []
      }
    },
    flashSaleInfo: {
      type: Object,
      default() {
        return null
      }
    },
    sellerInfo: {
      type: [Object, Array],
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      countDownTime: '',
      timer: null,
      showCountDown: false,
      introduceShow: false,
      canShow: false
    }
  },
  computed: {
    ...mapGetters({
      isSemiSale: 'getIsSemiSale',
      baseInfo: 'product/getBaseInfo'
    }),
    ...mapState({
      activityInfo: (state) => state.activityInfo,
      selectedColor: (state) => state.product.selectedColor,
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    promotionType({ baseInfo }) {
      if (this.baseInfo.activityCouponCode) return ''
      let promotionType = ''
      // 促销类型  activitySale、limitSale、flashSale
      if (this.baseInfo.countdownEndTime) {
        // 就是coupon活动开启了倒计时
        promotionType = 'activitySale'
      } else if (
        (!this.retireInfo.retireGoods && baseInfo.activityInfo) ||
        (!baseInfo.activityCouponCode && baseInfo.hasShopPriceRange && baseInfo.isLimitedTimeActivity)
      ) {
        // AZWEB-21266 价格区间显示 limitSale
        promotionType = 'limitSale'
      } else if (this.flashSaleInfo) {
        promotionType = 'flashSale'
      }

      return promotionType
    },
    // 是否展示倒计时，如果展示，需加背景色
    showCountDownTime({ baseInfo, flashSaleInfo, promotionType }) {
      // 1.promotionType == 'activitySale'
      // 2.promotionType = 'limitSale'  baseInfo.activityInfo.endTime && baseInfo.activityInfo.countDown > 0
      // 3.promotionType = 'flashSale' flashSaleInfo.endTime
      const showActivitySaleCountDown = promotionType == 'activitySale'
      const showLimitSaleCountDown =
        promotionType == 'limitSale' && baseInfo.activityInfo && baseInfo.activityInfo.endTime && baseInfo.activityInfo.countDown > 0
      const showFlashSaleCountDown = promotionType == 'flashSale' && flashSaleInfo && flashSaleInfo.endTime
      return !!(showActivitySaleCountDown || showLimitSaleCountDown || showFlashSaleCountDown)
    },
    catShowName() {
      if (this.baseInfo.catName == 'Fabric') {
        return 'Swatches & Fabrics'
      } else if (this.baseInfo.catName == 'Mother of the Bride Dresses') {
        return 'Moms & Celebrations'
      }
      return this.baseInfo.catName
    },
    showBrandName() {
      const isTrue = this.baseInfo.brandInfo
      if (isTrue) {
        this.setPoint('blushmark', 'blushmark', 'view')
      }
      return isTrue
    },
    showSapphire() {
      const isTrue = this.baseInfo.catId == 18
      if (isTrue) {
        this.setPoint('Brand', 'sapphirepopup', 'view')
      }
      return isTrue
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
    activityContentData() {
      let activityContentData
      for (const i in this.activityInfo) {
        const activity = this.activityInfo[i]
        if (activity.banner && activity.banner.activityContent) {
          activityContentData = activity.banner.activityContent[0]
          break
        }
      }
      return activityContentData
    },
    installmentsTipInfo() {
      return this.baseInfo.installments[this.baseInfo.installments.length - 1]
    },
    showLimitedTime({ baseInfo, retireInfo }) {
      return (
        !baseInfo.activityCouponCode &&
        baseInfo.hasLinePrice &&
        (!baseInfo.activityInfo || baseInfo.activityInfo.countDown == 0 || (baseInfo.activityInfo && retireInfo.retireGoods))
      )
    },
    finalSale({ baseInfo }) {
      // AZWEB-21266 价格区间不显示finalSale文案
      if (baseInfo.hasShopPriceRange) return false
      const { dressType, catId } = baseInfo
      const discount = this.baseInfo.discount
      return (
        ['clearance', 'outlet'].includes(dressType) &&
        ![9, 139, 18].includes(+catId) &&
        !(discount == 7 || discount == 5) &&
        !((discount == 3 || discount == 1.5) && baseInfo.warehouse == 1) // 70%off和85% off的中山仓rts不展示try on描述
      )
    },
    hideBrandName() {
      if (this.isSpecialCatId(this.baseInfo.catId) && this.baseInfo.isMassProduct == 0) {
        return false
      }
      return this.baseInfo.brandInfo && this.baseInfo.brandInfo.name && this.isSpecialCatId(this.catId) && this.baseInfo.isFinalSale
    },
    showSodCouponPrice({ baseInfo, canReceiveSodCoupon }) {
      if (!baseInfo.couponInfo) {
        return false
      }
      if (baseInfo.couponInfo) {
        return baseInfo.couponInfo.sodCouponFirst
      }
      return false
    },
    showSodBaseCouponPrice({ baseInfo }) {
      const { couponInfo = {} } = baseInfo
      return couponInfo.noneSodCouponPrice && !!Object.keys(couponInfo.noneSodCouponPrice).length
    },
    sodCouponPriceOriginValue({ baseInfo, stickerInfo, retireInfo, flashSaleInfo }) {
      return {
        baseInfo,
        stickerInfo,
        retireInfo,
        flashSaleInfo
      }
    },
    tipText({ promotionType, baseInfo, delayDesc }) {
      let text = ''
      if (promotionType == 'activitySale') {
        text = baseInfo.activityDesc
      } else if (promotionType == 'limitSale') {
        return delayDesc + ' ' + baseInfo.activityInfo.retireDate
      } else if (promotionType == 'flashSale') {
        return true
      }
      return text
    }
  },
  mounted() {
    if (this.reviewInfo.totalCount !== 0) {
      this.setPoint('reviews', 'reviewneartheprice', 'view')
    }
    this.$nextTick(() => {
      const brandNameDom = document.querySelector('.brand_name.pointer')
      const sliblingBox = document.querySelector('.brand_name.pointer + .icon-question')
      if (brandNameDom) {
        const style = document.createElement('style')
        document.head.appendChild(style)
        const sheet = style.sheet
        const left = brandNameDom.clientWidth + sliblingBox.clientWidth / 2
        sheet.insertRule(`.brand_introduce:before { left: ${left}px !important; }`, 0)
        sheet.insertRule(`.brand_introduce:after { left: ${left}px !important;}`, 0)
      }
    })
    // best seller view订单追踪，根据ab区分
    const version = this.versionObj.bestSellerAbtest === 'B' ? 'b' : 'a'
    this.setOrderSourceFlag(`best seller view ${version} ${this.baseInfo.catId}`, true)
    const timer = setTimeout(() => {
      const flag = this.baseInfo.hasShopPriceRange ? this.baseInfo.upToSaveRateValue : this.baseInfo.offRateValue
      this.canShow = flag
      clearTimeout(timer)
    }, 1500)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handlePopupInstallmentShow() {
      this.$store.commit('product/setPopupInstallmentShow', true)
    },
    setPoint(ec, el, ea) {
      const msg = {
        goodsId: this.baseInfo.goodsId,
        color: this.selectedColor.key,
        cat_name: this.baseInfo.catName,
        cat_id: this.baseInfo.catId,
        dress_type: this.baseInfo.dressType || this.dressType
      }
      const isVersionB = this.sodDetailVersionFun(this.baseInfo)
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        msg.ab = isVersionB ? 'b' : 'a'
      }
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify(msg)
      })
    },
    handOver(status) {
      this.showBrandName && status && this.setPoint('Brand', 'blushmarkpopup', 'view')
    },
    addZero(val) {
      return val < 10 ? `0${val}` : val
    },
    timeFormat(remainTime) {
      if (remainTime <= 0) {
        return 0
      }
      const oneDayTime = 24 * 60 * 60
      const oneHourTime = 60 * 60
      const day = Math.floor(remainTime / oneDayTime)
      const dayRemainTime = remainTime % oneDayTime
      const hour = Math.floor(dayRemainTime / oneHourTime)
      const hourRemainTime = dayRemainTime % oneHourTime
      const minute = Math.floor(hourRemainTime / 60)
      const second = hourRemainTime % 60
      if (day) {
        return `${day}d ${this.addZero(hour)}h ${this.addZero(minute)}m ${this.addZero(second)}s`
      } else {
        return `${this.addZero(hour)}h ${this.addZero(minute)}m ${this.addZero(second)}s`
      }
    },
    showReview() {
      this.setPoint('reviews', 'reviewneartheprice', 'click')
      document.querySelector('#prod_reviews').scrollIntoView()
    },
    showAfterpayLayer() {
      this.$store.commit('product/setAfterpayLayerShow', true)
    },
    getBiParamsKKPre() {
      if (process.server || !this.baseInfo.isPreOrderGoods) return
      return {
        ec: 'kkdetail',
        el: 'brand',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.baseInfo.color
        })
      }
    },
    // 色卡 注册内容
    signUp() {
      this.$emit('swatch-sign-up')
    }
  }
}
</script>

<style lang="less" scoped>
/* 价格下面的模块 */
.activity-block {
  display: flex;
  align-items: center;
  margin-top: 5px;
  /deep/ .az-with-coupon {
    margin: 0;
    margin-right: 5px;
  }
  /deep/.activity-sale-info-box {
    margin-top: 0;
  }
  /deep/ #product-falsh-sale-timer {
    margin-top: 0 !important;
  }
}
/deep/ .activity-sale-title {
  color: #666;
}
.sod {
  .activity-block {
    margin-top: 0;
  }
  /deep/ .az-with-coupon {
    margin-left: 5px;
  }
  .activity-sale-info-box {
    // margin-left: 5px;
    /deep/ #product-falsh-sale-timer {
      margin-right: 0;
    }
  }
}

#description {
  #name-des {
    color: var(--color-121212);
    .prod-price-box {
      margin-top: 12px;
      /deep/ #product-falsh-sale-timer {
        margin-top: 5px;
      }
      .activity-prod-price-box {
        background-color: @box-bg-color;
        border: 1px solid @box-border-color;
        padding: 10px;
      }
      .swatch-sign-up {
        width: max-content;
        display: flex;
        column-gap: 5px;
        align-items: center;
        padding: 3px 30px 3px 5px;
        margin: 10px 0 5px;
        background: linear-gradient(90deg, #121212 76.29%, rgba(255, 255, 255, 0) 103.98%);
        .text-item {
          color: var(--color-ffffff);
          font-family: @font-family-600;
          font-size: 13px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          &.upper {
            text-transform: uppercase;
          }
        }
        .line-block {
          width: 1px;
          height: 13px;
          background-color: var(--color-ffffff);
        }
        .arrow {
          width: 6px;
          height: 6px;
          border-bottom: 1px solid var(--color-ffffff);
          border-right: 1px solid var(--color-ffffff);
          transform: rotate(-45deg);
        }
      }
      .prod-com-price {
        display: flex;
        align-items: center;
        font-size: 24px;
        .goods-price {
          // color: var(--color-121212);
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
          display: flex;
          align-items: center;
          // margin-left: 10px;
          .sod-activity-sale-intro {
            margin-left: 5px;
            cursor: pointer;
            position: relative;
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
                line-height: initial;
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
        }
        .goods-price-item {
          display: flex;
          align-items: center;
          font-family: @font-family-500;
          font-size: 13px;
          line-height: 18px;
          color: var(--color-121212);
          .origin-price {
            font-family: @font-family-500;
            // text-decoration: line-through;
            margin: 0;
          }
          .price-item {
            margin: 0;
            font-size: 13px;
            text-transform: unset;
          }
          /deep/.sample-price {
            font-size: 24px;
            line-height: 33px;
            font-family: @font-family-600;
            margin-left: 5px;
          }
        }
        // sod 详情页b版本样式重写
        /deep/.activity-sale-info-box {
          height: 21px;
          margin-top: 0;
          // margin-left: 10px;
          font-size: 13px;
          font-family: @font-family-500;
          .activity-sale-pro-box {
            div > .activity-sale-title,
            div > .az-icon.icon-tag {
              display: none;
            }
          }
          #product-falsh-sale-timer {
            margin-top: 0;
          }
          .activitySale {
            height: 21px;
            margin-top: 0;
            margin-left: 10px;
            font-size: 13px;
            font-family: @font-family-500;
            .activity-sale-pro-box {
              .activity-sale-pro-box-item {
                display: none;
              }
            }
            #product-falsh-sale-timer {
              margin-top: 0;
            }
          }
        }
        .price-try-on-for {
          font-family: @font-family-500;
          font-size: 16px;
          color: var(--color-121212);
          display: flex;
          .price_show {
            font-family: @font-family-600;
            font-size: 24px;
            margin-left: 3px;
          }
        }
      }
      span {
        line-height: 24px;
      }
      // sod 重写倒计时样式
      &.sod {
        /deep/ .tag-buy_more_save_more {
          margin: 0;
          margin-right: 10px;
        }
        /deep/ .activity-sale-intro {
          display: none;
        }
        /deep/ .activity-sale-info {
          display: none;
        }
        /deep/ .sales-progress {
          margin-left: 0 !important;
        }
      }
      &.sod-old {
        /deep/ .tag-buy_more_save_more {
          margin: 0 10px;
        }
      }
      .price_show {
        font-family: @font-family-600;
      }
    }
    .flash-sale {
      margin-top: 10px;
      margin-bottom: -8px;
      font-family: @font-family-600, sans-serif;
      font-size: 13px;
      color: @theme-color;
      line-height: 20px;
      .flash-sale-tag {
        position: relative;
        display: inline-block;
        padding: 0 6px;
        background-color: @bg-color;
        font-family: @font-family-500;
        font-size: 12px;
        line-height: 19px;
        letter-spacing: 0.01em;
        &::after {
          position: absolute;
          right: -6.5px;
          content: '';
          width: 6.5px;
          height: 100%;
          background-color: @bg-color;
          clip-path: polygon(100% 0%, 0% 50%, 100% 100%, 0 100%, 0% 50%, 0 0);
        }
      }
    }
    .zion_des {
      font-size: 13px;
      font-family: @font-family-600;
      margin-bottom: -5px;
      margin-top: 3px;
    }
    .des_line {
      display: flex;
      align-content: center;
      text-transform: uppercase;
      font-size: 24px;
      align-items: center;
      font-family: @font-family-600;
      line-height: 33px;
    }
    .barbie-heart {
      fill: #de1c85;
      transform: scale(0.5);
    }
    .goods-sub-name {
      font-size: 16px;
      line-height: 22px;
      letter-spacing: 0.01em;
      color: var(--color-666666);
      margin-top: 5px;
    }
    .spec-style {
      display: flex;
      align-items: center;
      .cat {
        font-family: @font-family-500;
        margin-top: 1px;
        font-size: 13px;
        color: var(--color-121212);
        &.cat-spec {
          font-weight: 600;
          display: flex;
          align-items: center;
          position: relative;
          column-gap: 6px;
          .brand_introduce.show {
            display: block;
          }
        }
        .pointer {
          cursor: pointer;
        }
        .brand_name {
          font-size: 13px;
          font-family: @font-family-500;
          color: var(--color-121212);
          text-decoration: none;
          &:hover {
            color: @theme-color;
          }
        }
        .brand_introduce {
          display: none;
          position: absolute;
          z-index: @z-index-4;
          width: 552px;
          line-height: 22px;
          font-weight: initial;
          padding: 22px 15px;
          background: #fff;
          box-shadow: 0 0 6px 0 rgba(153, 153, 153, 0.8);
          margin-top: 2px;
          top: 20px;
          &:hover {
            display: block;
          }
          &.blush_mark:before,
          &.blush_mark:after {
            left: 12.5%;
          }
          &.sapphire:before,
          &.sapphire:after {
            left: 10.3%;
          }
          &:before {
            content: '';
            width: 0;
            height: 0;
            border-right: 6px solid transparent;
            border-bottom: 6px solid var(--color-cccccc);
            border-left: 6px solid transparent;
            position: absolute;
            top: 0%;
            left: 6%;
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
            left: 6%;
            margin-top: -11px;
          }
          .brand_detail {
            p {
              display: inline-block;
              padding-bottom: 4%;
            }
            p:last-child {
              padding: 0;
            }
          }
        }
      }
      .style-id-spec {
        padding-left: 16px;
        border-left: 1px solid #666;
        margin-left: 14px;
        font-weight: 400;
        font-size: 13px;
        letter-spacing: 0;
        text-transform: none;
        display: inline-block;
        font-family: @font-family-base;
        height: 16px;
        line-height: 16px;
        &-noborder {
          border-left: none;
          padding-left: 0;
          margin-left: 0;
        }
      }
    }

    .review-rating {
      display: inline-flex;
      justify-content: flex-start;
      align-items: flex-start;
      font-size: 13px;
      margin-top: 10px;
      .star_rating_box {
        position: relative;
        .icon-star-rating {
          width: 14px;
          height: 13px;
        }
        .star_rating_bg {
          width: 19px;
          height: 25px;
        }
        .star_rating_img {
          position: absolute;
          top: 0;
          right: 0;
          width: 19px;
          height: 25px;
          //   background-image: data-uri('../../assets/images/icon-star.png');
          background-size: cover;
        }
      }
      .show_review {
        text-decoration: underline;
        cursor: pointer;
        margin-left: 5px;
      }
      .fabric {
        color: #666;
        margin: 12px 0 0;
        &.hide {
          display: none;
        }
      }
    }
    .face-mask-activity {
      width: 100%;
      text-align: center;
      background: var(--color-f1e9e6);
      font-size: 13px;
      margin-top: 15px;
      text-transform: uppercase;
      p {
        line-height: 16px;
        color: var(--color-121212);
        .activity-time {
          color: @btn-hover-color;
          text-transform: lowercase;
        }
        &:first-child {
          padding-top: 10px;
        }
        &:last-child {
          padding-bottom: 9px;
        }
      }
    }
    .goods-progress {
      width: 524px;
      margin-top: 10px;
    }
  }
  &.sod-b {
    .des_line {
      font-size: 20px !important;
    }
    .spec-style {
      .review-ration-block {
        display: inline-block;
        margin: 0 10px;
        color: #666;
      }
      .review-rating {
        margin-top: 0 !important;
        &::before {
          content: '|';
          margin: 0 5px;
        }
      }
    }
  }
}
.goods-price {
  color: @theme-color;
}

/deep/ .tag-buy_more_save_more {
  padding: 0 15px;
  margin-left: 10px;
}
.ready-to-off-sale {
  margin-top: 8px;
  color: @theme-color;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  & > p {
    margin-top: 5px;
  }
  .text {
    margin-right: 5px;
  }
  .time-decrease {
    line-height: 16px;
    display: flex;
    align-items: center;
    color: @theme-color;
    span.triangle {
      display: inline-block;
      width: 0px;
      height: 0px;
      border-right: 8px solid var(--color-121212);
      border-top: 11px solid transparent;
      border-bottom: 11px solid transparent;
    }
    span.text {
      background-color: var(--color-121212);
      height: 16px;
      padding: 3px 7px;
      color: var(--color-ffffff);
      &:before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: -21%;
        padding-right: 5px;
        background: data-uri('../../assets/images/seo_sprite_20190129.png') no-repeat;
        background-position: -496px -28px;
      }
    }
  }
}
.tip-installment {
  margin-top: 10px;
  height: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon-menu {
    font-size: 15px;
  }
  .icon-des {
    font-size: 12px;
  }
  span {
    margin: 0 5px;
    font-family: @font-family-500;
    font-size: 13px;
  }
}
#ways_to_wear {
  margin-top: 20px;
  img {
    width: 13px;
    height: 16px;
    margin-right: 9px;
    margin-bottom: -3px;
  }
  span {
    color: @theme-color;
    text-decoration: underline;
    font-size: 12px;
    line-height: 18px;
    font-family: @font-family-500;
  }
  a {
    font-family: @font-family-500;
    font-size: 13px;
    color: @theme-color;
    text-decoration: underline;
    line-height: 20px;
  }
}
.activity-coupon-code {
  margin-left: 5px;
}
</style>
