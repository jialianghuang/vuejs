<template>
  <div
    :data-goods-id="productItem.goodsId"
    :class="{ 'pay-product-list-order-item': ['order-tracking', 'order-orderDetail'].includes($route.name), active: isVisible }"
    class="pay-product-list-item"
  >
    <!-- checkout 部分商品布局修改 -->
    <template v-if="['checkout', 'checkoutSuccess'].includes($route.name)">
      <div class="goods-img-block">
        <az-sticker
          v-if="productItem.stickers && Object.keys(productItem.stickers).length"
          :stickerInfo="productItem.stickers"
          :sticker-class="`product-item-icon-small`"
          :goodsId="productItem.goodsId"
        ></az-sticker>
        <a :href="navToGoodsDetail(productItem.detailUrl, productItem)" :aria-label="productItem.shownGoodsName">
          <img :src="addWebpSuffix(productItem.imgUrl)" :alt="productItem.shownGoodsName" class="goods-img" />
          <span v-if="productItem.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
          <span style="display:none">{{ productItem.shownGoodsName }}</span>
          <span v-if="!productItem.available" class="unavailable_style">
            <span class="white-bg"></span>
            <template v-if="!(productItem.styles && productItem.styles.select && productItem.styles.select.isSpecialStock)">
              <az-icon :icon-class="'icon-a-bebacksoon-' + language" class="be_back_soon" fill="#666" />
            </template>
          </span>
        </a>
      </div>
      <div class="goods-info">
        <h4 :class="{ 'is-gift-card': productItem.isGiftCard }" class="goods-name">
          <a :href="navToGoodsDetail(productItem.detailUrl, productItem)">
            <template v-if="[1063984, 1063985].includes(productItem.goodsId)">
              Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE
              {{ productItem.goodsId === 1063984 ? nl('page_common_garment_bag') : nl('page_common_garment_bag_wd') }}
            </template>
            <template v-else>
              {{ productItem.shownGoodsName }}
            </template>
            <span v-if="productItem.dressType == 'clearance'">({{ nl('page_bread_crumb_ready_to_ship') }})</span>
            <span v-if="productItem.isFinalSale">({{ nl('page_bread_crumb_ready_to_ship') }})</span>
            <span v-if="productItem.dressType == 'outlet'">({{ nl('page_bread_crumb_outlet') }})</span>
            <span v-if="productItem.previousName" class="history-name"> {{ goods.previousName }}</span>
            <span v-if="productItem.suffix" class="gift_goods">({{ productItem.suffix }})</span>
          </a>
        </h4>
        <!--  gift card -->
        <div v-if="productItem.isGiftCard" :class="{ 'checkout-success': jsKey == 'checkoutSuccess' }" class="gift-card-item">
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
          <p>
            <span>{{ nl('page_common_quantity') }}:</span> {{ productItem.giftCard.goodsNumber }}
          </p>
          <p class="gift-card-item-tips">
            <span>{{ nl('page_gift_card_order_what_is_next') }}:</span> {{ nl('page_gift_card_order_what_is_next_desc') }}
          </p>
        </div>
        <template v-else>
          <p v-if="productItem.formatStyles && productItem.formatStyles.color" class="goods-color">
            {{ nl(productItem.formatStyles.color.name) }}: <span>{{ nl(productItem.shownColor) }}</span>
          </p>
          <div v-if="productItem.formatStyles && productItem.formatStyles.size" @click="handleSizeTip()" class="goods-size-box">
            <!-- checkoutsuccess商品尺寸信息全展示 -->
            <div v-if="$route.name == 'checkoutSuccess'" class="goods-size">
              <template v-if="productItem.formatStyles.size.CustomSize">
                <span v-if="sizeItems.length > 0">{{ nl('page_goods_custom_size') }} ({{ nl('page_common_free') }}):</span>
                <span v-else>{{ nl('page_common_size') }}:</span
                >{{ $route.name === 'order-orderDetail' && !isMyOrder ? `***` : productItem.formatStyles.size.CustomSize.name }}
              </template>
              <template v-else-if="productItem.formatStyles.size.standardSize">
                <span v-if="sizeItems.length > 0"
                  >{{ nl('page_common_size') }} {{ productItem.formatStyles.size.standardSize.shownName }}:</span
                >
                <template v-else>
                  <span>{{ nl('page_common_size') }}:</span>{{ productItem.formatStyles.size.standardSize.shownName }}
                </template>
              </template>
              <template v-for="(sizeItem, sizeItemskey) in sizeItems">
                <span :key="sizeItemskey">
                  <template v-if="sizeItemskey > 0">|</template>
                  <template v-if="!sizeItem.name">({{ sizeItem.value }})</template>
                  <template v-else>
                    {{ sizeItem.name }}:
                    <template v-if="productItem.catId == '3102'">
                      {{ sizeItem.name == nl('page_common_foot_length') ? sizeItem.value : parseInt(sizeItem.value) }}
                      <span>{{ sizeItem.name == nl('page_common_foot_length') ? (sizeItem.unit == 'inch' ? 'in' : 'cm') : '' }}</span>
                    </template>
                    <template v-else>
                      {{ sizeItem.value }}
                      <span v-if="sizeItem.name != nl('page_common_cup_size')">
                        {{ sizeItem.key !== 'age' ? sizeItem.unit : '' }}
                      </span>
                    </template>
                  </template>
                </span>
              </template>
            </div>
            <template v-else>
              <div class="goods-size">
                {{ size }}
                <span v-if="sizeItems && sizeItems.length">
                  <az-icon icon-class="icon-lby_arrow_right" class="triangle"></az-icon>
                  <span v-if="isSizeTipShow" class="icon-tip">
                    <em style="display: inline;"></em>
                    <span> </span>
                  </span>
                </span>
              </div>
              <div v-if="sizeItems && sizeItems.length > 0 && isSizeTipShow" class="tip-goods-size">
                <p v-for="(sizeItem, indexx) in sizeItems" :key="indexx">
                  {{ sizeItem.name }}:
                  <template v-if="productItem.catId == '3102'">
                    {{ sizeItem.name == nl('page_common_foot_length') ? sizeItem.value : parseInt(sizeItem.value) }}
                    <span>{{ sizeItem.name == nl('page_common_foot_length') ? (sizeItem.unit == 'inch' ? 'in' : 'cm') : '' }}</span>
                  </template>
                  <template v-else>
                    {{ sizeItem.value }}
                    <span>{{ sizeItem.key !== 'age' ? sizeItem.unit : '' }}</span>
                  </template>
                </p>
              </div>
            </template>
          </div>
          <!-- 配件定制 -->
          <div v-if="productItem.styles && productItem.styles.customNameList" class="customization">
            <p v-if="productItem.styles.customNameList.line1">
              {{ nl('page_common_line_one') }}: {{ productItem.styles.customNameList.line1 }}
            </p>
            <p v-if="productItem.styles.customNameList.line2">
              {{ nl('page_common_line_two') }}: {{ productItem.styles.customNameList.line2 }}
            </p>
          </div>
          <!-- 交期 -->
          <!-- <div v-if="productItem.productionTime && !purchaseSamples && !isSamplePurchaseOrder" class="delivery_time">
          <span>{{ nl('page_checkout_production_time') }} :</span>
          <span class="production_time_value">{{ productItem.productionTime }}</span> -->
          <!-- <template v-if="productItem.productionTime.toLowerCase() == 'rush'">
            <span class="rush-fee sym_price">{{ productItem.totalRushFeeDisplay }}</span>
          </template> -->
          <!-- </div> -->
          <!-- 获得时间 -->
          <p v-if="!purchaseSamples && showGetTime && !fromTrackingPage" class="get_time">
            <span :class="{ no_address: !shippingAddress.length }">{{ productItem.lastGetTime }}</span>
          </p>
          <!-- 仅在checkout 显示缺货 -->
          <div v-if="['checkout'].includes($route.name) && !productItem.available" class="goods-warning">
            {{ nl('page_js_out_of_stock') }}
          </div>
        </template>
      </div>
      <!-- #19202: pc, cart和checkout页面非coupon的折扣划线价都放左边单价旁边,with code的折扣统一放右边. 所以这个checkout的单独拎出来处理-->
      <!-- checkout页面 商品价格模块 -->
      <div v-if="$route.name == 'checkout'" :class="[`${$route.name}-goods-price-block`]" class="goods-price-block">
        <!-- 是否有划线价（非coupon）： hasActivityLinePrice -->
        <div class="goods-price-box">
          <template v-if="productItem.hasActivityLinePrice">
            <div class="prod-com-price">
              <div>
                <!-- #19202: pc, 非coupon的折扣划线价都放左边单价旁边 -->
                <!-- 商品原价 noDealPriceDisplay-->
                <span class="goods-no-deal-price">{{ productItem.noDealPriceDisplay }}</span>
                <!-- 除coupon外折扣价（单价）shopPriceWithOutBonusDisplay-->
                <span class="goods-price">{{ productItem.shopPriceWithOutBonusDisplay }}</span>
              </div>
            </div>
          </template>
          <span v-else class="goods-price">{{ productItem.shopPriceWithOutBonusDisplay }}</span>
          <template v-if="productItem.isRedeemed">
            <AzTips :text="nl('page_common_tying_text3')">
              <span>{{ nl('page_common_offer') }}</span>
            </AzTips>
          </template>
        </div>
        <!-- 数量 -->
        <em>x</em>
        <div class="goods-num-block">
          <div class="goods-num">{{ productItem.goodsNumber }}</div>
        </div>
        <!-- 是否有划线价（coupon）： hasCouponLinePrice -->
        <template v-if="productItem.hasCouponLinePrice">
          <div class="goods-item-total-price-box">
            <div>
              <!-- 除coupon外折扣价（总价） totalPriceWithOutBonusDisplay -->
              <span class="goods-no-deal-price">{{ productItem.totalPriceWithOutBonusDisplay }}</span>
              <!-- 最终总价 totalAmountDisplay -->
              <span class="goods-price">{{ productItem.totalAmountDisplay }}</span>
            </div>
            <az-with-code
              v-if="productItem.activityCouponCode && productItem.activityBonus && !productItem.isGift"
              :code="productItem.activityCouponCode"
              class="cart_with_code"
            ></az-with-code>
            <az-with-code
              v-else-if="productItem.couponCode && !productItem.isGift && productItem.bonus"
              :code="productItem.couponCode"
              :class="country"
              class="cart_with_code"
            ></az-with-code>
          </div>
        </template>
        <span v-else class="goods-item-total-price">{{ productItem.totalAmountDisplay }}</span>
      </div>
      <!-- 非checkout页面 商品价格模块 -->
      <div v-else :class="[`${$route.name}-goods-price-block`]" class="goods-price-block">
        <div class="goods-price-box">
          <template v-if="productItem.hasLinePrice">
            <div class="prod-com-price">
              <div>
                <span class="goods-no-deal-price">{{ productItem.noDealPriceDisplay }}</span>
                <span class="goods-price">{{ productItem.shopPriceDisplay }}</span>
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
          </template>
          <span v-else class="goods-price">{{ productItem.shopPriceDisplay }}</span>
          <template v-if="productItem.isRedeemed">
            <AzTips :text="nl('page_common_tying_text3')">
              <span>{{ nl('page_common_offer') }}</span>
            </AzTips>
          </template>
        </div>
        <!-- 数量 -->
        <em>x</em>
        <div class="goods-num-block">
          <div class="goods-num">{{ productItem.goodsNumber }}</div>
        </div>
        <strong class="goods-item-total-price">{{ productItem.totalAmountDisplay }}</strong>
      </div>
    </template>
    <template v-else>
      <table>
        <tbody>
          <tr>
            <!-- 仅在样衣选择页面显示复选框 -->
            <td v-if="$route.name == 'purchaseSample'" rowspan="2" class="td-checkbox">
              <div :class="{ selected: isVisible }" @click="checkboxClick" class="checkbox-box">
                <svg v-show="isVisible" class="icon">
                  <use xlink:href="#icon-lby_tick_white_s"></use>
                </svg>
              </div>
            </td>
            <td rowspan="2" class="td-img">
              <a
                :href="
                  [1063984, 1063985].includes(productItem.goodsId) ? 'javascript:;' : navToGoodsDetail(productItem.goodsUrl, productItem)
                "
                :aria-label="productItem.goodsName"
                @click="handleClickGoods(productItem)"
                :target="[1063984, 1063985].includes(productItem.goodsId) ? '' : targetBlank(productItem.goodsId != 1003491)"
                :style="[1063984, 1063985].includes(productItem.goodsId) ? 'cursor: default;' : ''"
              >
                <az-sticker
                  v-if="productItem.stickers && Object.keys(productItem.stickers).length"
                  :stickerInfo="productItem.stickers"
                  :sticker-class="`product-item-icon-mini`"
                  :goodsId="productItem.goodsId"
                ></az-sticker>
                <img
                  :class="{ 'checkout-img': $route.name == 'checkout', 'gift-card-img': productItem.isGiftCard }"
                  :src="addWebpSuffix(productItem.imgUrl)"
                  :alt="productItem.goodsName"
                />
                <span v-if="productItem.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
              </a>
            </td>
            <td :class="{ 'is-gift-card': productItem.isGiftCard }" class="td-title">
              <h4>
                <a
                  :href="
                    [1063984, 1063985].includes(productItem.goodsId) ? 'javascript:;' : navToGoodsDetail(productItem.goodsUrl, productItem)
                  "
                  @click="handleClickGoods(productItem)"
                  :style="[1063984, 1063985].includes(productItem.goodsId) ? 'cursor: default;' : ''"
                >
                  <template v-if="[1063984, 1063985].includes(productItem.goodsId)">
                    Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE
                    {{ productItem.goodsId === 1063984 ? nl('page_common_garment_bag') : nl('page_common_garment_bag_wd') }}
                  </template>
                  <template v-else>
                    {{ productItem.shownGoodsName }}
                  </template>
                  <template v-if="productItem.dressType == 'clearance'">({{ nl('page_bread_crumb_ready_to_ship') }})</template>
                  <template v-if="productItem.isFinalSale">({{ nl('page_bread_crumb_ready_to_ship') }})</template>
                  <template v-if="productItem.dressType == 'outlet'">({{ nl('page_bread_crumb_outlet') }})</template>
                </a>
                <span v-if="productItem.previousName" class="history-name"> {{ goods.previousName }}</span>
                <span v-if="productItem.suffix" class="gift_goods">({{ productItem.suffix }})</span>
              </h4>
              <!-- 仅在checkout 显示缺货 -->
              <div v-if="['checkout'].includes($route.name) && !productItem.available" class="warning">
                {{ nl('page_js_out_of_stock') }}
              </div>
            </td>
          </tr>
          <tr>
            <td
              v-if="productItem.isGiftCard && productItem.giftCard && Object.keys(productItem.giftCard).length"
              class="td-desc gift-card-td"
            >
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
              <p>
                <span>{{ nl('page_common_quantity') }}:</span> {{ productItem.giftCard.goodsNumber }}
              </p>
              <p class="gift-card-item-tips">
                <span>{{ nl('page_gift_card_order_what_is_next') }}:</span> {{ nl('page_gift_card_order_what_is_next_desc') }}
              </p>
            </td>
            <td v-else class="td-desc">
              <!-- 商品颜色 -->
              <p v-if="productItem.formatStyles && productItem.formatStyles.color" class="color">
                <span style="text-transform: capitalize">{{ productItem.formatStyles.color.name }} :</span>
                {{ productItem.formatStyles.color.value }}
                <!-- sash color -->
                <template v-if="productItem.formatStyles && productItem.formatStyles.sash_color">
                  <span style="text-transform: capitalize">{{ productItem.formatStyles.sash_color.name }} :</span>
                  {{ productItem.formatStyles.sash_color.value }}
                </template>
              </p>
              <!-- 商品尺寸 -->
              <p v-if="productItem.formatStyles && productItem.formatStyles.size" class="size">
                <template v-if="productItem.formatStyles.size.CustomSize">
                  <span v-if="sizeItems.length > 0">{{ nl('page_goods_custom_size') }} ({{ nl('page_common_free') }}):</span>
                  <span v-else>{{ nl('page_common_size') }}:</span
                  >{{ $route.name === 'order-orderDetail' && !isMyOrder ? `***` : productItem.formatStyles.size.CustomSize.name }}
                </template>
                <template v-else-if="productItem.formatStyles.size.standardSize">
                  <span v-if="sizeItems.length > 0"
                    >{{ nl('page_common_size') }} {{ productItem.formatStyles.size.standardSize.shownName }}:</span
                  >
                  <template v-else>
                    <span>{{ nl('page_common_size') }}:</span>{{ productItem.formatStyles.size.standardSize.shownName }}
                  </template>
                </template>
                <template v-for="(sizeItemValue, sizeItemskey) in sizeItems">
                  <template v-if="sizeItemskey > 0">|</template>
                  <template v-if="!sizeItemValue.name">({{ sizeItemValue.value }})</template>
                  <template v-else>
                    {{ sizeItemValue.name }}:
                    <template v-if="productItem.catId == '3102'">
                      {{ sizeItemValue.name == nl('page_common_foot_length') ? sizeItemValue.value : parseInt(sizeItemValue.value) }}
                      <template v-if="sizeItemValue.name != nl('page_common_cup_size')">
                        {{ sizeItemValue.name == nl('page_common_foot_length') ? (sizeItemValue.unit == 'inch' ? 'in' : 'cm') : '' }}
                      </template>
                    </template>
                    <template v-else>
                      {{ sizeItemValue.value }}
                      <template v-if="sizeItemValue.name != nl('page_common_cup_size')">
                        {{ sizeItemValue.key !== 'age' ? sizeItemValue.unit : '' }}
                      </template>
                    </template>
                  </template>
                </template>
              </p>
              <!-- 配件定制 -->
              <div v-if="productItem.styles && productItem.styles.customNameList" class="customization">
                <p v-if="productItem.styles.customNameList.line1">
                  {{ nl('page_common_line_one') }}: {{ productItem.styles.customNameList.line1 }}
                </p>
                <p v-if="productItem.styles.customNameList.line2">
                  {{ nl('page_common_line_two') }}: {{ productItem.styles.customNameList.line2 }}
                </p>
              </div>
              <!-- 获得时间 -->
              <p v-if="!purchaseSamples && showGetTime && !fromTrackingPage" class="get_time">
                <span :class="{ no_address: !shippingAddress.length }">{{ productItem.lastGetTime }}</span>
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="price">
        <div class="goods-price-box">
          <template v-if="productItem.hasLinePrice">
            <!-- 样衣和赠品，不显示划线价 -->
            <span v-if="productItem.dressType == 'sample' || productItem.isGift" class="sym_price sample">
              {{ productItem.shopPriceDisplay }}
            </span>
            <template v-else>
              <p class="sym_price origin">
                {{ productItem.noDealPriceDisplay }}
              </p>
              <p class="sym_price">
                {{ productItem.shopPriceDisplay }}
              </p>
            </template>
          </template>
          <span v-else class="sym_price">{{ productItem.shopPriceDisplay }}</span>
          <template v-if="productItem.isRedeemed">
            <AzTips :text="nl('page_common_tying_text3')">
              <span>{{ nl('page_common_offer') }}</span>
            </AzTips>
          </template>
        </div>
        <span>x</span>
        <span class="goods_number">{{ productItem.goodsNumber }}</span>
        <strong :style="{ color: productItem.isGift ? 'var(--color-121212)' : '' }" class="price_1 sym_price">
          {{ productItem.totalAmountDisplay }}
        </strong>
      </div>
    </template>
    <!-- checkoutSuccess商品列表分享按钮 -->
    <div v-if="$route.name == 'checkoutSuccess' && !productItem.isGiftCard" class="social-share">
      <div class="social-share-in">
        <az-icon @click="fbShare" icon-class="icon-xxy_facebook" class="facebook"></az-icon>
        <az-icon @click="twitterShare" icon-class="icon-xxy_twitter" class="twitter"></az-icon>
        <az-icon @click="pinShare" icon-class="icon-xxy_pinterest" class="pinterest"></az-icon>
        <az-icon @click="mailShare" icon-class="icon-xxy_email" class="share_mail"></az-icon>
      </div>
    </div>
    <!-- checkout页面时才有remove按钮 -->
    <div v-if="$route.name === 'checkout' && !orderInfo.orderSn && !productItem.available" class="remove-wrap unavailable_goods">
      <span @click="removeUnavailableGoods(productItem.recId)" class="remove">{{ nl('page_common_remove') }}</span>
    </div>

    <div v-if="$route.name === 'order-orderDetail'" class="write-a-review-wrap">
      <!-- order detail 页面有 Return Status  -->
      <p v-if="productItem.returnApplyId && productItem.returnApplyOrderSn" class="return-status">
        <em></em>
        <a :href="productItem.returnStatusUrl" target="_blank">
          {{ nl('page_logistics_return_status') }}
        </a>
      </p>

      <!-- 样衣pdf下载 -->
      <p v-if="productItem.pdf" class="return-status">
        <a :href="`${envApi}${productItem.pdf}`">
          {{ nl('page_return_label_instructions') }}
        </a>
      </p>

      <!-- order detail 页面有 write a review -->
      <p v-if="productItem.writeReviewUrl && productItem.hasReview" class="write-a-review">
        <em></em>
        <a :href="productItem.writeReviewUrl" target="_blank">
          {{ nl('page_category_write_a_review') }}
        </a>
      </p>

      <!-- giftcard order detail 页面有  edit email -->
      <p v-if="productItem.actionInfo && productItem.actionInfo.giftCardEditEmailAble" class="action-item">
        <a @click.stop="handleEditEmail">{{ nl('page_order_gift_card_edit_email') }}</a>
      </p>
      <!-- giftcard order detail 页面有  resend -->
      <p v-if="productItem.actionInfo && productItem.actionInfo.giftCardResendAble" class="action-item">
        <a @click.stop="handleResend">{{ nl('page_common_resend') }}</a>
      </p>
    </div>
  </div>
</template>

<script>
import azSticker from '@/components/az-ui/Sticker/AzSticker'
import azWithCode from '@/components/az-ui/AzWithCode'
import AzTips from '@/components/az-ui/AzTips'
import { mapState } from 'vuex'
export default {
  name: 'PayproductListItem',
  components: { azSticker, azWithCode, AzTips },
  filters: {
    upper: (value) => {
      return value.toUpperCase()
    }
  },
  props: {
    productItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isMyOrder: {
      type: Boolean,
      default: false
    },
    isSamplePurchaseOrder: {
      type: Boolean,
      default: false
    },
    purchaseSamples: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isNewReturnMethod: {
      // 是否走新退货逻辑，即是否有happy return 弹窗
      type: Boolean,
      default: false
    },
    fromTrackingPage: {
      // 是否来自/pages/tracking 物流查询页面
      type: Boolean,
      default: false
    },
    showGetTime: {
      // 是否显示交期
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      index: false,
      isSizeTipShow: false,
      isVisible: false
    }
  },
  computed: {
    ...mapState('checkout', ['orderInfo', 'shippingAddress']),
    size() {
      if (this.productItem.formatStyles && this.productItem.formatStyles.size) {
        if (this.productItem.formatStyles.size.CustomSize) {
          return this.productItem.formatStyles.size.CustomSize.name + ': ' + this.productItem.formatStyles.size.CustomSize.value
        } else if (this.productItem.formatStyles.size.standardSize) {
          return this.nl('page_common_size') + ': ' + this.productItem.formatStyles.size.standardSize.shownName
        }
      }
      return ''
    },
    sizeItems() {
      if (this.productItem.formatStyles && this.productItem.formatStyles.size) {
        if (this.productItem.formatStyles.size.CustomSize && this.productItem.formatStyles.size.CustomSize.items) {
          return this.productItem.formatStyles.size.CustomSize.items
        } else if (this.productItem.formatStyles.size.standardSize && this.productItem.formatStyles.size.standardSize.items) {
          return this.productItem.formatStyles.size.standardSize.items
        }
      }
      return []
    }
  },
  mounted() {
    document.documentElement.addEventListener('click', (event) => {
      let flag = false
      let parent = event.target.parentNode
      while (parent) {
        if (parent == this.$el.querySelector('.goods-size-box')) {
          flag = true
          break
        }
        parent = parent.parentNode
      }
      if (!flag) {
        this.isSizeTipShow = false
      }
    })
  },
  methods: {
    removeUnavailableGoods(recId) {
      this.$store.commit('checkout/setLoadingFlag', true)
      this.$axios
        .$delete(`/1.0/cart/goods/${recId}`, { params: { is_real_delete: false } })
        .then((res) => {
          if (res.code == 0) {
            this.refreshCheckoutList()
          } else {
            window.location.reload()
          }
        })
        .catch((error) => {
          console.log(error)
          window.location.reload()
        })
    },
    refreshCheckoutList() {
      this.$axios
        .$get('/1.0/order/checkout', {
          params: this.$route.query
        })
        .then((res) => {
          this.$store.commit('checkout/setLoadingFlag', false)
          if (res.code == 0) {
            this.$store.commit('checkout/setCheckoutBaseInfo', res.data)
          } else {
            window.location.href = this.countryUrl(`/cart`)
          }
        })
    },
    fbShare() {
      const facebookUrl = `http://www.facebook.com/sharer/sharer.php?u=${this.HTTPS_HOST}${this.HTTPS_HOST}${this.navToGoodsDetail(
        this.productItem.goodsUrl
      )}`
      const shareUrl = facebookUrl.substr(facebookUrl.indexOf('u=') + 2)
      if (typeof dataLayer != 'undefined') {
        this.setDataLayer({ event: 'PaySuccessPage_Facebook2_Click' })
      }
      const that = this
      window.FB.ui(
        {
          method: 'share',
          mobile_iframe: true,
          href: shareUrl
        },
        function(response) {
          if (typeof response != 'undefined') {
            if (typeof dataLayer != 'undefined') {
              that.setDataLayer({ event: 'PaySuccessPage_FacebookSuccess2_Click' })
            }
          }
        }
      )
    },
    pinShare() {
      let pinDes = ''
      if (this.productItem.formatStyles && this.productItem.formatStyles.color && this.productItem.formatStyles.color.value) {
        pinDes = `${this.productItem.goodsName.toUpperCase()}. ${this.productItem.goodsName}. %23
        ${this.productItem.formatStyles.color.value} %23${this.productItem.catName} %23Wedding %23CustomDresses %23AZAZIE`
      } else {
        pinDes = `${this.productItem.goodsName.toUpperCase()}. ${this.productItem.goodsName}. %23
        ${this.productItem.catName} %23Wedding %23CustomDresses %23AZAZIE`
      }
      const pinUrl = `http://pinterest.com/pin/create/button/?description=${encodeURI(pinDes)}
      &media=${this.productItem.shareImg}&is_video=false&url=${this.HTTPS_HOST}${this.navToGoodsDetail(this.productItem.goodsUrl)}`
      window.open(pinUrl, window, `height=320,width=700,top=${window.innerHeight / 3},left=${window.innerWidth / 3}`)
    },
    twitterShare() {
      const twitterUrl = `http://twitter.com/share?text=I%27m in love with ${this.productItem.goodsName.toUpperCase()}.&via=iheartazazie&url=${this.navToGoodsDetail(
        this.productItem.goodsUrl
      )}`
      window.open(twitterUrl, window, `height=320,width=700,top=${window.innerHeight / 3},left=${window.innerWidth / 3}`)
    },
    mailShare() {
      const url = `mailto:?subject=Look what I found at ${this.APP_DOMAIN_LOWER}&body=${this.productItem.goodsName} - ${
        this.productItem.catName
      } ${this.navToGoodsDetail(this.productItem.goodsUrl)}`
      window.location.href = url
    },
    googlePlusShare() {
      const googlePlusUrl = `https://plus.google.com/share?hl=en&url=${this.HTTPS_HOST}${this.navToGoodsDetail(this.productItem.goodsUrl)}`
      window.open(googlePlusUrl, window, `height=320,width=700,top=${window.innerHeight / 3},left=${window.innerWidth / 3}`)
    },
    checkboxClick() {
      this.isVisible = !this.isVisible
      this.$emit('changeCheckStatus', this.productItem.recId)
    },
    // 显示size提示
    handleSizeTip() {
      this.isSizeTipShow = !this.isSizeTipShow
    },
    handleEditEmail() {
      this.$store.commit('order/setEditEmailResendLayerShow', 'editEmail')
      this.$store.commit('order/setCurrentGiftCarInfo', {
        ...this.productItem
      })
    },
    handleResend() {
      this.$store.commit('order/setEditEmailResendLayerShow', 'resend')
      this.$store.commit('order/setCurrentGiftCarInfo', {
        ...this.productItem
      })
    },
    handleClickGoods(productItem) {
      // /pages/tracking 物流查询页面 点击商品打点
      if (this.fromTrackingPage) {
        this.setPoint('ordersummary', 'goods', 'click', {
          goodsId: productItem.goodsId,
          color: productItem.shownColor
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pay-product-list-item {
  position: relative;
  padding: 20px 0;
  display: flex;
  border-bottom: solid 1px var(--color-cccccc);
  &.active {
    background: var(--color-f9f9f9);
  }
  &.pay-product-list-order-item {
    padding: 15px 0 32px;
    &:last-child {
      border-bottom: solid 1px var(--color-cccccc);
    }
  }
  table {
    width: 100%;
  }
  td {
    padding: 0;
  }
  .price {
    display: flex;
    align-items: flex-start;
    column-gap: 24px;
    color: var(--color-121212);
    strong {
      text-align: right;
      width: 80px;
    }
    .sym_price {
      min-width: 60px;
    }
    span.sym_price {
      text-align: left;
      display: inline-block;
      &.sample {
        color: #999;
      }
    }
    p.sym_price {
      color: var(--color-121212);
      line-height: 18px;
      &.origin {
        margin-bottom: 2px;
        color: #999;
        text-decoration: line-through;
      }
    }
    /deep/ .az-tips {
      margin-top: 2px;
    }
  }
  #cart & .price {
    position: absolute;
    top: 15px;
    right: 25px;
    line-height: 32px;
    color: var(--color-121212);
    .nor_price,
    .deal_price {
      margin-left: 24px;
      position: absolute;
      right: 220px;
    }
    .price_x {
      position: absolute;
      right: 190px;
    }
    .qty {
      position: absolute;
      right: 120px;
    }
    .goods-no-deal-price {
      color: #999;
      text-decoration: line-through;
      line-height: 18px;
      text-align: center;
    }
    .goods-price {
      text-align: center;
      color: var(--color-121212);
      line-height: 18px;
      margin-top: 2px;
    }
    .cart-flash-sale {
      height: 20px;
      background-color: #ffeef2;
      color: var(--color-121212);
      font-size: 12px;
      text-align: center;
      line-height: 20px;
      margin-top: 6px;
      padding: 0 4px;
      white-space: nowrap;
    }
  }
  .remove-wrap {
    position: absolute;
    bottom: 15px;
    right: 25px;
  }
  .remove {
    display: block;
    width: 11px;
    height: 14px;
    overflow: hidden;
    line-height: 200px;
    background: url('~assets/images/a_sprite_l_20190128.png') no-repeat -258px 0;
  }
  .write-a-review-wrap {
    position: absolute;
    right: 0;
    bottom: 5px;
    .return-status {
      display: inline-block;
      margin-right: 25px;
      em {
        display: inline-block;
        width: 12px;
        height: 12px;
        overflow: hidden;
        background: data-uri('~assets/images/order/return_status.png') no-repeat 0 0;
        margin-right: 5px;
        transform: translateY(1px);
      }
      a {
        color: @theme;
        text-decoration: underline;
      }
    }

    .write-a-review {
      position: relative;
      margin-bottom: -16px;
      display: inline-block;
      em {
        display: inline-block;
        width: 12px;
        height: 12px;
        overflow: hidden;
        background: data-uri('~assets/images/a_sprite_l_20190128.png') no-repeat -338px 0;
        margin-right: 5px;
      }
      a {
        color: @theme;
        text-decoration: underline;
      }
    }

    .action-item {
      display: inline-block;
      margin-right: 25px;
      cursor: pointer;
      a {
        color: @theme;
        text-decoration: underline;
      }
    }
  }

  .td-checkbox {
    width: 39px;
    text-align: center;
    .checkbox-box {
      display: inline-block;
      box-sizing: border-box;
      width: 15px;
      height: 15px;
      border: 1px solid #999;
      svg.icon {
        margin: 2px;
        display: block;
        color: #fff;
        font-size: 10px;
        width: 10px;
        height: 9px;
        fill: #fff;
      }
      &.disabled {
        opacity: 0.3;
      }
      &.selected {
        background: #666;
        border-color: #666;
      }
    }
  }
  .td-img {
    padding-right: 15px;
    width: 74px;
    position: relative;
    img {
      width: 74px;
      height: 102px;
      display: block;
      &.checkout-img {
        width: 120px;
        height: 165px;
      }
      &.gift-card-img {
        width: 120px;
        height: auto;
        vertical-align: middle;
      }
    }
    .product-try-on {
      height: 55px;
      width: 55px;
      position: absolute;
    }
    a {
      position: relative;
    }
    .mattel {
      position: absolute;
      right: 3px;
      bottom: 3px;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
      color: #fff;
      transform-origin: right bottom;
      transform: scale(0.3);
      width: max-content;
    }
  }
  .td-title {
    vertical-align: top;
    padding-right: 250px;
    &.is-gift-card {
      font-family: @font-family-600;
    }

    .history-name {
      color: #888;
      font-size: 13px;
      font-weight: normal;
      text-transform: capitalize;
    }
    a {
      color: var(--color-121212);
      &:hover {
        color: @theme;
      }
    }
    .flash-sale-goods {
      width: 60px;
      height: 18px;
      display: inline-block;
      background: url('~assets/images/flash_sale.png') no-repeat;
      vertical-align: TOP;
      margin-right: 1px;
    }
  }
  .gift_goods {
    color: @theme-color;
    text-transform: capitalize;
  }
  .td-desc {
    position: relative;
    vertical-align: bottom;
    line-height: 18px;
    padding-right: 192px;
    color: var(--color-121212);
    span {
      color: var(--color-121212);
      margin-right: 3px;
    }
    .estimated-time {
      color: var(--color-121212);
    }
    .production_time_value {
      color: var(--color-121212);
      text-transform: capitalize;
    }
    .goods_notice {
      padding-top: 10px;
      clear: both;
      span {
        color: @theme-color;
      }
      .more_cat_notice,
      .rush_notice {
        display: none;
        color: var(--color-121212);
      }
    }
    .color {
      margin-left: -15px;
      text-transform: capitalize;
      span {
        margin-left: 15px;
      }
    }
    .get_time {
      margin-top: 2px;
      font-size: 12px;
      span {
        color: var(--color-5fa452) !important;
      }
    }

    span.rush-fee {
      position: absolute;
      right: 0px;
      color: @text-color;
      // bottom: 15px;
    }
    &.gift-card-td {
      vertical-align: top;
      padding-right: 260px;
      span {
        font-family: @font-family-600;
        text-transform: capitalize;
      }
      .gift-card-item-tips {
        margin-top: 18px;
      }
    }
  }
  .warning {
    color: @theme;
    margin-top: 5px;
  }
  .only-ship {
    margin-top: 5px;
  }

  .gift-wedding-veil {
    color: @theme;
  }

  .social-share {
    position: absolute;
    right: 0;
    bottom: 22px;
    .social-share-in {
      display: flex;
      align-items: center;
    }
    svg {
      cursor: pointer;
      font-size: 22px;
      fill: #999;
      &:not(:last-of-type) {
        margin-right: 10px;
      }
    }
    .facebook {
      &:hover {
        fill: #4b64ae;
      }
    }
    .twitter {
      &:hover {
        fill: #2ca8d2;
      }
    }
    .pinterest {
      &:hover {
        fill: #b80d22;
      }
    }
    .share_mail {
      &:hover {
        fill: var(--color-121212);
      }
    }
  }

  .goods-img-block {
    position: relative;
    .goods-checkbox {
      cursor: pointer;
      position: absolute;
      width: 15px;
      height: 15px;
      top: 0;
      left: 0;
      z-index: 2;
    }
    .goods-img {
      // width: 124px;
      // height: 171px;
      width: 120px;
      display: inline-block;
      vertical-align: middle;
    }
    .mattel {
      position: absolute;
      right: 3px;
      bottom: 3px;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
      color: #fff;
      transform-origin: right bottom;
      transform: scale(0.3);
      width: max-content;
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
  }

  .goods-info {
    position: relative;
    flex: 1;
    margin-left: 20px;
    .goods-name {
      font-weight: 400;
      max-width: 330px;
      &.is-gift-card {
        font-family: @font-family-600;
      }
      a {
        color: var(--color-121212);
        .flash-sale-goods {
          width: 60px;
          height: 18px;
          display: inline-block;
          background: data-uri('~assets/images/cart/flash_sale.png') no-repeat;
          vertical-align: TOP;
          margin-right: 3px;
        }
        .gift-goods {
          color: @theme;
          text-transform: capitalize;
          font-weight: bold;
        }
        &:hover {
          color: @theme-color;
        }
      }
    }
    .gift-card-item {
      // max-width: 450px;
      &.checkout-success {
        width: 700px;
      }
      p {
        word-break: break-word;
        span {
          font-family: @font-family-600;
        }
      }
      .gift-card-item-tips {
        margin-top: 10px;
      }
    }
    .measure-tip {
      color: @theme;
      margin-top: 10px;
      max-width: 340px;
    }
    .goods-warning {
      margin-top: 10px;
      color: @theme;
    }
    .goods-color {
      text-transform: capitalize;
      span {
        margin-left: 3px;
      }
    }
    .goods-size-box {
      position: relative;
      display: inline-block;
      cursor: pointer;
      .goods-size {
        display: inline-block;
        > span {
          position: relative;
          .icon-tip {
            display: inline;
            em {
              bottom: -7px;
              right: 5px;
              border-color: transparent transparent var(--color-cccccc);
              border-width: 6.5px;
              border-style: dashed dashed solid;
              font-size: 0;
              line-height: 0;
              position: absolute;
              display: block;
              pointer-events: none;
            }
            span {
              bottom: -7.5px;
              border-color: transparent transparent #fff;
              border-width: 6.5px;
              right: 5px;
              z-index: 2;
              border-style: dashed dashed solid;
              font-size: 0;
              line-height: 0;
              position: absolute;
              display: block;
              pointer-events: none;
            }
          }
        }
        .triangle {
          width: 10px;
          margin-left: 3px;
        }
      }
      .tip-goods-size {
        left: calc(~'100% - 10px');
        top: 25px;
        background: #fff;
        position: absolute;
        border: 1px solid #ccc;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        padding: 10px 12px;
        white-space: nowrap;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        color: #231f1e;
        font-family: @font-family-500, sans-serif;
        z-index: 1;
      }
    }
    .delivery_time {
      margin-top: 10px;
      font-size: 13px;
      font-family: @font-family-500;
      color: var(--color-121212);
      text-transform: capitalize;
    }
    .get_time {
      font-size: 13px;
      span {
        color: var(--color-5fa452) !important;
      }
    }
  }
  .barbie-heart {
    fill: #de1c85;
    transform: scale(0.5);
  }
  .goods-price-block {
    position: relative;
    display: flex;
    height: 32px;
    align-items: center;
    // top: -8px;
    right: 0;
    flex: 1;
    justify-content: flex-end;
    .goods-price-box {
      display: flex;
      flex-direction: column;
    }
    .goods-price {
      min-width: 98px;
    }
    .prod-com-price {
      min-width: 98px;
      margin-right: 10px;
      .goods-price {
        color: @theme-color;
        display: inline-block;
        min-width: auto;
      }
      .goods-no-deal-price {
        color: var(--color-999999);
        text-decoration: line-through;
      }
      .cart_with_code {
        position: absolute;
        left: 0;
        top: 100%;
        margin-top: 5px;
      }
    }

    .goods-num-block {
      position: relative;
      .goods-num {
        display: inline-block;
        position: relative;
        width: 40px;
        margin-left: 39px;
      }
    }

    .goods-item-total-price {
      position: relative;
      max-width: 150px;
      min-width: 70px;
      text-align: right;
      font-family: @font-family-600;
    }

    .goods-item-total-price-box {
      max-width: 150px;
      min-width: 70px;
      // width: 100%;
      text-align: right;
      position: relative;
      // right: -85px;
      // margin-left: 26px;
      .goods-price {
        color: @theme-color;
        display: inline-block;
        min-width: auto;
      }
      .goods-no-deal-price {
        color: var(--color-999999);
        text-decoration: line-through;
      }
      .goods-save-price {
        position: absolute;
        bottom: -33px;
        font-family: @font-family-500;
        background-color: #ffeef2;
        color: @theme-color;
        padding: 0 4px;
        white-space: nowrap;
        line-height: 20px;
        font-size: 12px;
        right: -90px;
      }
      .cart_with_code {
        position: absolute;
        right: 0;
        top: 100%;
        margin-top: 5px;
      }
    }
  }
}
</style>
