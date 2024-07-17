<template>
  <div :class="{ unavailable: isInvalid }" class="cat-product-item">
    <div class="goods-img-block">
      <az-icon
        v-if="item.editType == 'check'"
        :icon-class="isMeasureChecked ? 'a-icon-checkbox-new' : 'iconcheckbox'"
        @click="handleMeasure"
        class="goods-checkbox"
      ></az-icon>
      <az-sticker
        v-if="item.stickers && Object.keys(item.stickers).length"
        :stickerInfo="item.stickers"
        :sticker-class="`cart-product-item-icon`"
        :goodsId="item.goodsId"
      ></az-sticker>
      <a
        :href="isLimitTapeMeasureLink ? 'javascript:;' : navToDetails(item)"
        @click="handleClick"
        :aria-label="item.shownGoodsName"
        :style="{ cursor: isLimitTapeMeasureLink ? 'default' : 'pointer' }"
        class="goods-img-a"
      >
        <img :src="addWebpSuffix(item.imgUrl)" :alt="item.shownGoodsName" class="goods-img" />
        <span v-if="item.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
        <span style="display:none">{{ item.shownGoodsName }}</span>
        <span v-if="!item.available" class="unavailable_style">
          <span class="white-bg"></span>
          <template v-if="!supportStockSales">
            <az-icon :icon-class="'icon-a-bebacksoon-' + language" class="be_back_soon" fill="#666" />
          </template>
        </span>
      </a>
    </div>
    <section
      v-track.viewOnce.click="
        getExcitationParams(
          'stimulateshopbag',
          'stimulateshopbag',
          item,
          getStickerText(item),
          'cartpage',
          item.driveInfo && item.driveInfo.cartSticker
        )
      "
      class="cat-product-item-right"
    >
      <div class="cat-product-item-right-item">
        <div class="goods-info">
          <div class="info-content">
            <h4 class="goods-name">
              <a
                :href="isLimitTapeMeasureLink ? 'javascript:;' : navToDetails(item)"
                :style="{ cursor: isLimitTapeMeasureLink ? 'default' : 'pointer' }"
                @click="handleClick"
              >
                <span v-if="item.flashSaleInfo" class="flash-sale-goods">
                  {{ nl('page_header_sale_flash_sale') }}
                </span>
                <template v-if="[1063984, 1063985].includes(item.goodsId)">
                  Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE
                  {{ item.goodsId === 1063984 ? nl('page_common_garment_bag') : nl('page_common_garment_bag_wd') }}
                </template>
                <template v-else>
                  {{ item.shownGoodsName }}
                </template>
                <span v-if="item.dressType == 'clearance'">({{ nl('page_bread_crumb_ready_to_ship') }})</span>
                <span v-if="item.dressType == 'outlet'">({{ nl('page_bread_crumb_outlet') }})</span>
                <span v-if="item.isFinalSale">({{ nl('page_bread_crumb_ready_to_ship') }})</span>
                <!-- <span v-if="item.isRedeemed" class="redeemed">({{ nl('page_cart_offer_redeemed') }})</span> -->
                <span v-if="!isTying && item.suffix" class="gift-goods">({{ item.suffix }})</span>
              </a>
            </h4>
            <!-- gift card  -->
            <div v-if="item.isGiftCard && item.giftCard" class="gift-card-item">
              <p>
                <span>{{ nl('page_gift_card_detail_message') }}:</span> {{ item.giftCard.cardMsg }}
              </p>
              <p>
                <span>{{ nl('page_common_from') }}:</span> {{ item.giftCard.fromUser }}
              </p>
              <p>
                <span>{{ nl('page_gift_card_order_send_to') }}:</span>
                {{ item.giftCard.toUser ? item.giftCard.toUser.join(',') : '' }}
              </p>
              <p class="gift-card-item-tips">
                <span>{{ nl('page_gift_card_order_what_is_next') }}:</span> {{ nl('page_gift_card_order_what_is_next_desc') }}
              </p>
            </div>
            <template v-else>
              <!--sample gift tip -->
              <div v-if="item.isGift && item.dressType == 'sample'" class="gift-wedding-veil">{{ nl('page_cart_gift_wedding_veil') }}</div>
              <!-- measure tip -->
              <div v-if="item.tip" class="measure-tip">{{ item.tip }}</div>
              <p v-if="item.formatStyles && item.formatStyles.color" @click="editCartGoods(item)" class="goods-color">
                {{ item.formatStyles.color.name }}:
                <span>{{ replaceBackslashToAndText(item.formatStyles.color.value, item) }}</span>
              </p>
              <div v-if="item.formatStyles && item.formatStyles.size" @click="editCartGoods(item)" class="goods-size-box">
                <div class="goods-size">
                  {{ size }}
                  <az-icon v-if="sizeItems && sizeItems.length" icon-class="icon-lby_arrow_right" class="triangle"></az-icon>
                </div>
                <div v-if="sizeItems && sizeItems.length > 0" class="tip-goods-size">
                  <p v-for="(sizeItem, index) in sizeItems" :key="index">
                    {{ sizeItem.name }}:
                    <template v-if="item.catId == '3102'">
                      {{ sizeItem.name == nl('page_common_foot_length') ? sizeItem.value : parseInt(sizeItem.value) }}
                      <span>{{ sizeItem.name == nl('page_common_foot_length') ? (sizeItem.unit == 'inch' ? 'in' : 'cm') : '' }}</span>
                    </template>
                    <template v-else>
                      {{ sizeItem.value }}
                      <span v-if="sizeItem.key !== 'age'">{{ sizeItem.unit }}</span>
                    </template>
                  </p>
                </div>
              </div>
              <!-- 配件定制 -->
              <div v-if="item.styles && item.styles.customNameList" class="customization">
                <p v-if="item.styles.customNameList.line1">{{ nl('page_common_line_one') }}: {{ item.styles.customNameList.line1 }}</p>
                <p v-if="item.styles.customNameList.line2">{{ nl('page_common_line_two') }}: {{ item.styles.customNameList.line2 }}</p>
              </div>
              <!-- 交期 赠品不展示交期-->
              <div v-if="item.makeInfo && (!item.isGift || item.giftActivityId)" class="goods-estimate">
                <div class="style-words">{{ item.makeInfo.label }}{{ !item.available && item.isStockGoods ? ':*' : '' }}</div>
                &nbsp;
                <cart-rush-select
                  v-if="item.rushable && item.rushSelectItems && Object.keys(item.rushSelectItems).length"
                  @change="rushTypeChange"
                  :list="rushList"
                >
                </cart-rush-select>
                <!-- </span> -->
                <template v-else>
                  {{ item.makeInfo.description }}
                </template>
                <PreSaleShippingNotice v-if="isSpecialCatId(item.catId) && item.sodPreSaleGoods" />
              </div>
              <ExcitationCartTip v-if="hasExcitation(item)" :sticker="(item.driveInfo && item.driveInfo.cartSticker) || []" />
              <!-- rush提示 -->
              <p v-if="item.rushType == 'rush' && showRushNote" :id="'notice_' + item.recId" class="goods_notice">
                <span>{{ nl('page_party_tip_note') }}:</span>
                <span class="rush_notice">{{ nl('page_rush_order_goods_notice') }}</span>
              </p>
              <!-- goods warning -->
              <p v-if="goodsWarning" v-html="goodsWarning" :class="{ error: !item.available && isBundle }" class="goods-warning"></p>
              <!-- bd sample buy2get1free tip -->
              <!-- <div v-if="item.freeOfSamplePromotion" class="measure-tip">{{ nl('page_cart_buy2get1free_tip') }}</div> -->
            </template>
          </div>
          <!-- 按钮事件 -->
          <!-- 如果赠品属于买赠活动，即giftActivityId不为0的清空下，有 edit 和delete -->
          <div v-if="item.giftActivityId" class="cart-btn-block">
            <a @click="editGiftGoods(item)">{{ nl('page_common_edit') }}</a>
            <a
              @click="deleteCartGoods()"
              :data-datalayer-label="isLater ? 'SaveForLater_Delete_Click' : 'ShoppingCart_Delete_Click'"
              class="need_datalayer"
              data-datalayer-category="PC_ShoppingCartRevision"
              >{{ nl('page_common_delete') }}</a
            >
          </div>
          <div v-else-if="item.editType != 'check' && !item.isGift" class="cart-btn-block">
            <!-- redeemed 的商品，如果 supportDimension 维度不是 sku， 也可以编辑 -->
            <a v-if="showEditBtn" @click="editCartGoods(item)">{{ nl('page_common_edit') }}</a>
            <a
              @click="deleteCartGoods()"
              :data-datalayer-label="isLater ? 'SaveForLater_Delete_Click' : 'ShoppingCart_Delete_Click'"
              v-track.viewOnce.click="{
                id: `delete_${item.goodsId}_${item.recId}`,
                common: [getRedeemedGoodsPoint('redeemedconfiguration', 'delete', item)]
              }"
              class="need_datalayer"
              data-datalayer-category="PC_ShoppingCartRevision"
              >{{ nl('page_common_delete') }}</a
            >
            <a
              v-if="!item.isRedeemed && isLater && item.available"
              @click="upDateCartGoods(1)"
              class="need_datalayer"
              data-datalayer-category="PC_ShoppingCartRevision"
              data-datalayer-label="SaveForLater_MTSB_Click"
              >{{ nl('page_cart_move_to_shopping_bag') }}</a
            >
            <a
              v-else-if="!item.isRedeemed && !isLater"
              @click="upDateCartGoods(0)"
              class="need_datalayer"
              data-datalayer-category="PC_ShoppingCartRevision"
              data-datalayer-label="ShoppingCart_SFL_Click"
              >{{ nl('page_cart_save_for_later') }}</a
            >
          </div>
        </div>
        <div class="goods-price-block">
          <div class="goods-price-box">
            <p v-if="item.hasActivityLinePrice" class="prod-com-price">
              <span class="goods-no-deal-price">{{ item.noDealPriceDisplay }}</span>
              <span class="cur-goods-price">{{ item.shopPriceWithOutBonusDisplay }}</span>
            </p>
            <p v-else class="goods-price">{{ item.shopPriceWithOutBonusDisplay }}</p>
            <template v-if="isTying && item.isRedeemed">
              <AzTips :text="nl('page_common_tying_text3')">
                <span>{{ nl('page_common_offer') }}</span>
              </AzTips>
            </template>
          </div>
          <!-- 数量 -->
          <em>x</em>
          <div class="goods-num-block">
            <!-- redeemed 的商品，如果 supportDimension 维度不是 sku， 也可以编辑数量 -->
            <div v-if="item.editable && !(item.isRedeemed && item.supportDimension == 'sku')" class="select-box">
              <input
                v-if="goodsNumInputAble"
                @blur="goodsNumberBlur()"
                @change="goodsNumberChange()"
                v-model="item.goodsNumber"
                type="text"
                class="input input-num"
                maxlength="3"
              />
              <div v-else @click.stop.prevent="showSelectBox()" class="input">
                <input :value="item.goodsNumber" readonly="readonly" type="text" />
                <svg class="icon select_title-icon">
                  <use xlink:href="#icon-lby_expand_arrow_down"></use>
                </svg>
              </div>
              <div :class="{ show: selectBoxShow }" class="num-select">
                <ul>
                  <li
                    v-for="(numItem, index) in numList"
                    :key="index"
                    @click="selectGoodsNum(numItem)"
                    :class="{ disable: index >= item.maxQuantity && !(supportStockSales && item.available) }"
                  >
                    {{ numItem }}
                  </li>
                  <li
                    v-if="(!item.maxSelectQuantity || (supportStockSales && item.available)) && !item.isRedeemed"
                    @click.stop.prevent="handleGoodsNumInputAble()"
                    class="more-num"
                  >
                    10+
                  </li>
                </ul>
              </div>
            </div>
            <div v-else class="goods-num">{{ item.goodsNumber }}</div>
            <div v-if="hasOnlyTip" class="select-tip">
              {{ nl('page_common_only') }} {{ item.maxQuantity }} {{ nl('page_product_only_unit') }}!
            </div>
          </div>
          <!-- #19202: pc, with code的折扣统一放右边 -->
          <!-- 是否有划线价（coupon）： hasCouponLinePrice -->
          <template v-if="item.hasCouponLinePrice">
            <div :class="{ hasOnlyTip: hasOnlyTip }" class="goods-item-total-price-box">
              <div>
                <!-- 除coupon外折扣价（总价） totalPriceWithOutBonusDisplay -->
                <span class="goods-no-deal-price">{{ item.totalPriceWithOutBonusDisplay }}</span>
                <!-- 最终总价 totalPriceDisplay -->
                <span class="cur-goods-price">{{ item.totalPriceDisplay }}</span>
              </div>
              <az-with-code
                v-if="item.activityCouponCode && item.activityBonus && !item.isGift"
                :code="item.activityCouponCode"
                :class="[country, { hasOnlyTip: hasOnlyTip }]"
                :show-expire="item.activityCouponCode == 'HIBEAUTY'"
                class="cart_with_code"
              ></az-with-code>
              <az-with-code
                v-else-if="item.couponCode && !item.isGift && item.bonus"
                :code="item.couponCode"
                :class="[country, { hasOnlyTip: hasOnlyTip }]"
                :show-expire="item.couponCode == 'HIBEAUTY'"
                class="cart_with_code"
              ></az-with-code>
            </div>
          </template>
          <span v-else :class="{ hasOnlyTip: hasOnlyTip }" class="goods-item-total-price">{{ item.totalPriceDisplay }}</span>
        </div>
      </div>
    </section>
    <az-confirm
      :showCancel="false"
      :confirmContent="nl(confirmContent)"
      v-if="showConfirmDialog"
      @closeConfirmDialog="closeConfirmDialog"
    ></az-confirm>
    <az-toast ref="cartItemToast" :message="toastTip" @toastHide="toastHide" :locateMode="'self'"></az-toast>
  </div>
</template>

<script>
import azSticker from '@/components/az-ui/Sticker/AzSticker'
import azWithCode from '@/components/az-ui/AzWithCode'
import { mapState } from 'vuex'
import CartRushSelect from '@/components/cart/CartRushSelect'
import AzConfirm from '@/components/az-ui/AzConfirm.vue'
import AzToast from '@/components/az-ui/AzToast'
import AzTips from '@/components/az-ui/AzTips'
import ExcitationCartTip from '@/components/common/excitation/ExcitationCartTip'

export default {
  name: 'CartProductItem',
  components: { azSticker, azWithCode, CartRushSelect, AzConfirm, AzToast, ExcitationCartTip, AzTips },
  props: {
    isInvalid: {
      type: Boolean,
      default: false
    },
    isLater: {
      type: Boolean,
      default: false
    },
    isRedeemed: {
      type: Boolean,
      default: false
    },
    isBundle: {
      type: Boolean,
      default: false
    },
    invalidCheckoutGoodsIndex: {
      type: Number,
      default: 0
    },
    validCheckoutGoodsIndex: {
      type: Number,
      default: 0
    },
    saveForLaterGoodsIndex: {
      type: Number,
      default: 0
    },
    redeemedGoodsIndex: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: () => {}
    },
    showRushNote: {
      type: Boolean,
      default: false
    },
    // 是否是搭售
    isTying: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectBoxShow: false,
      goodsNumInputAble: false,
      toggle: true, // 防重复点击
      showConfirmDialog: false,
      confirmContent: 'page_cart_confirm_content_text',
      customizationNumber: 0,
      toastTip: '',
      cartItem: null
    }
  },
  computed: {
    ...mapState('cart', [
      'checkoutGoodsList',
      'saveForLaterGoodsList',
      'invalidCheckoutGoodsList',
      'validCheckoutGoodsList',
      'redeemedStatus',
      'redeemedBagGoodsList',
      'redeemedBagGoodsIds'
    ]),
    ...mapState('checkout', ['hasCoupons', 'couponInfo', 'redeemedStatus']),
    supportStockSales() {
      return this.item.styles && this.item.styles.select && this.item.styles.select.isSpecialStock
    },
    numList(right) {
      let limit = (!(this.supportStockSales && this.item.available) && this.item.maxSelectQuantity * 1) || 9
      // 如果是换购商品，最大只能选当前活动配置的剩余的个数
      if (this.item.isRedeemed && this.redeemedStatus && this.redeemedStatus.status && this.redeemedStatus.status.conditionType != 2) {
        const redeemedMax =
          (this.redeemedStatus.status.goodsNumLimit || 0) * 1 -
          (this.redeemedStatus.status.currentRedeemedGoodsCount || 0) * 1 +
          this.item.goodsNumber
        limit = redeemedMax
        if (!isNaN(limit)) {
          limit = Math.min(limit, redeemedMax)
        }
      }
      const res = []
      for (let i = 1; i <= limit; i++) {
        if (i >= 1 && i <= limit) {
          res.push(i)
        }
      }
      return res
    },
    size() {
      if (this.item.formatStyles && this.item.formatStyles.size) {
        if (this.item.formatStyles.size.CustomSize) {
          return this.item.formatStyles.size.CustomSize.name + ': ' + this.item.formatStyles.size.CustomSize.value
        } else if (this.item.formatStyles.size.standardSize) {
          return this.nl('page_common_size') + ': ' + this.item.formatStyles.size.standardSize.shownName
        }
      }
      return ''
    },
    sizeItems() {
      if (this.item.formatStyles && this.item.formatStyles.size) {
        if (this.item.formatStyles.size.CustomSize) {
          return this.item.formatStyles.size.CustomSize.items
        } else if (this.item.formatStyles.size.standardSize) {
          return this.item.formatStyles.size.standardSize.items
        }
      }
      return []
    },
    goodsWarning() {
      // buy more save 失效商品显示提示文案
      if (this.isBundle && !this.item.available) {
        return this.nl('page_cart_list_text3') + '<br>' + this.nl('page_cart_list_text2')
      }
      // save for later 模块展示失效商品文案
      if (!this.isLater) {
        return ''
      }
      // 商品不能购买
      if (!this.item.available) {
        if ([1003179, 1002333].includes(this.item.goodsId)) {
          // 色卡书
          this.setPoint('note', 'invalid', 'view', { error: this.nl('page_cart_swatches_book_unavailable') })
          return this.nl('page_cart_swatches_book_unavailable')
        } else if (this.item.catId == 33) {
          this.setPoint('note', 'invalid', 'view', { error: this.nl('page_cart_swatches_unavailable') })
          return this.nl('page_cart_swatches_unavailable')
        } else {
          this.setPoint('note', 'invalid', 'view', { error: this.nl('page_cart_style_unavailable') })
          return this.nl('page_cart_style_unavailable')
        }
      }
      return ''
    },
    // 量尺是否选中
    isMeasureChecked() {
      // 未选中时：recId为空，且接口中没有catName，选中时recId有值，catName有值，1003491只需要判断recId即可
      if (this.item.recId != '' && (this.item.catName || this.item.goodsId === 1003491)) {
        return true
      }
      return false
    },
    rushList() {
      const arr = []
      for (const i in this.item.rushSelectItems) {
        const obj = {
          label: this.item.rushSelectItems[i].txt,
          value: this.item.rushSelectItems[i].key,
          selected: this.item.rushSelectItems[i].selected
        }
        if (this.item.rushSelectItems[i].groupId) obj.groupId = this.item.rushSelectItems[i].groupId
        arr.push(obj)
      }
      return arr
    },
    // 皮尺，限定国家不允许跳转
    isLimitTapeMeasureLink() {
      if (this.item.goodsId === 1003491 && ['IT', 'ES', 'IE'].includes(this.country)) {
        return true
      }
      return false
    },
    hasOnlyTip({ item }) {
      return (
        (item.isStockGoods || this.supportStockSales) &&
        item.dressType == 'dress' &&
        (item.maxQuantity < 4 || item.maxQuantity <= item.goodsNumber) &&
        item.maxQuantity > 0 &&
        !item.giftActivityId
      ) // 买赠的赠品购物车不显示 only X left .
    },
    showEditBtn({ item, isLater }) {
      if (item.dressType == 'clearance') {
        return false
      }
      return (
        !item.isGiftCard &&
        !(item.isRedeemed && item.supportDimension == 'sku') &&
        !isLater &&
        ((item.formatStyles && item.formatStyles.size) || (item.formatStyles && item.formatStyles.color))
      )
    }
  },
  created() {
    this.cartItem = JSON.parse(JSON.stringify(this.item))
  },
  mounted() {
    document.addEventListener('click', () => {
      if (this.selectBoxShow) this.selectBoxShow = false
    })
    if (this.item && this.item.giftActivityId) {
      // 买赠活动赠品曝光打点
      const tempDiscount = this.item.styles.select.discount
      const msg = {}
      if (tempDiscount && this.item.dressType === 'clearance') {
        msg.discount = 10 - tempDiscount
      }
      this.setPoint('addtobag', 'free gift', 'view', msg)
    }
  },
  methods: {
    // 跳转到商品详情
    // 因为详情页缓存缘故，会导致卖点文案的描述不能根据加购状况及时更新，所以添加个时间戳
    navToDetails(e) {
      let detailUrl = e.detailUrl
      if (detailUrl) {
        if (detailUrl.includes('?')) {
          detailUrl += '&t=' + new Date().getTime()
        } else {
          detailUrl += '?t=' + new Date().getTime()
        }
      }
      return this.navToGoodsDetail(detailUrl, e)
    },
    closeConfirmDialog(eventType) {
      this.showConfirmDialog = false
      if (eventType == 'yes') {
        // this.item.goodsNumber = this.customizationNumber
        this.addCartGoods()
      }
    },
    // 显示数量选择框
    showSelectBox() {
      this.selectBoxShow = true
    },
    // 选择数量
    selectGoodsNum(numItem) {
      const msg = {
        goodsId: this.item.goodsId,
        color: (this.item.formatStyles && this.item.formatStyles.color && this.item.formatStyles.color.key) || this.item.colorReal
      }
      this.setPoint('items', 'changequantity', 'click', msg)
      if (numItem > this.item.maxQuantity && !(this.supportStockSales && this.item.available)) return false
      this.handleListGoodsNum(numItem)
      this.selectBoxShow = false
      this.$nextTick(() => {
        this.upDateCartGoods(this.isLater ? 0 : 1)
      })
    },
    // 数量可输入
    handleGoodsNumInputAble() {
      this.goodsNumInputAble = true
      this.selectBoxShow = false
    },
    goodsNumberBlur() {
      this.goodsNumInputAble = false
      this.upDateCartGoods(this.isLater ? 0 : 1)
    },
    // 输入框监听处理
    goodsNumberChange() {
      let num = JSON.parse(JSON.stringify(this.item.goodsNumber))
      num = parseInt(num)
      this.handleListGoodsNum(num || 1)
    },
    // 更新列表商品数量
    handleListGoodsNum(numItem) {
      if (this.isBundle) {
        this.cartItem.goodsNumber = numItem
        return
      }
      const tempProdList = this.isLater
        ? JSON.parse(JSON.stringify(this.saveForLaterGoodsList))
        : this.isRedeemed
        ? JSON.parse(JSON.stringify(this.redeemedBagGoodsList))
        : this.isInvalid
        ? JSON.parse(JSON.stringify(this.invalidCheckoutGoodsList))
        : JSON.parse(JSON.stringify(this.validCheckoutGoodsList))
      const productIndex = this.isLater
        ? this.saveForLaterGoodsIndex
        : this.isRedeemed
        ? this.redeemedGoodsIndex
        : this.isInvalid
        ? this.invalidCheckoutGoodsIndex
        : this.validCheckoutGoodsIndex
      const tempProdListItem = tempProdList[productIndex]
      tempProdListItem.goodsNumber = numItem
      tempProdList[productIndex] = tempProdListItem
      if (this.isLater) {
        this.$store.commit('cart/setSaveForLaterGoodsList', tempProdList)
      } else if (this.isRedeemed) {
        this.$store.commit('cart/setRedeemedBagGoodsList', tempProdList)
      } else {
        const tempCheckoutGoodsList = JSON.parse(JSON.stringify(this.checkoutGoodsList))
        const CheckoutGoodsIndex = this.isInvalid
          ? this.invalidCheckoutGoodsIndex
          : this.validCheckoutGoodsIndex + Object.keys(this.invalidCheckoutGoodsList).length
        tempCheckoutGoodsList[CheckoutGoodsIndex] = tempProdListItem
        this.$store.commit('cart/setCheckoutGoodsList', tempCheckoutGoodsList)
        if (this.isInvalid) {
          this.$store.commit('cart/setInvalidCheckoutGoodsList', tempProdList)
        } else {
          this.$store.commit('cart/setValidCheckoutGoodsList', tempProdList)
        }
        if (numItem > this.item.goodsNumber) {
          this.sethandleGoodsGA4(this.item, 'add_to_cart', numItem - this.item.goodsNumber)
        } else if (numItem < this.item.goodsNumber) {
          this.sethandleGoodsGA4(this.item, 'remove_from_cart', this.item.goodsNumber - numItem)
        }
      }
    },
    // 皮尺事件
    handleMeasure() {
      if (this.isMeasureChecked) {
        this.deleteCartGoods()
      } else {
        this.addCartGoods()
      }
    },
    /**
     * 添加商品到购物车
     * goods_id	必填	商品id
      custom	选填	是否自定义尺码
      goods_number	必填	商品数量
      dress_type	选填	商品dress type
      styles	选填	商品style数据
      styles_sash	选填	商品腰带
      from_showroom	选填	商品来源
      from_instagram	选填	商品来源
      from_details_entry	选填	商品来源
      from_whatAreU	选填	商品来源
      from_recommend	选填	商品来源
      choose_sash	选填	是否选择腰带
      sash_id	选填	腰带商品id
     *  */
    addCartGoods() {
      if (this.toggle) {
        this.toggle = false
        this.$store.commit('cart/setLoadingFlag', true)
        const tempStyles = JSON.parse(JSON.stringify(this.item.styles))
        tempStyles.select && tempStyles.select.isSpecialStock && delete tempStyles.select.isSpecialStock
        const params = {
          goods_id: this.item.goodsId,
          goods_number: this.item.goodsNumber,
          dress_type: this.item.dressType,
          styles: tempStyles
        }

        this.setModuleCookie('save_for_later', this.item.goodsId)
        this.$axios
          .$post('/1.0/cart/goods', params)
          .then((res) => {
            this.toggle = true
            if (res.code == 0) {
              this.$emit('refreshCartList')
            } else {
              this.cartErrorExtra(res.msg)
            }
          })
          .catch((error) => {
            console.log(error)
            this.cartErrorExtra()
          })
      }
    },
    /**
     * 更新购物车中商品信息
     * goods_number	选填	商品数量
      for_checkout	选填	0-save for later 1-商品用于checkout
      rush_type	选填	无
     *  */
    upDateCartGoods(checkoutType, rushType = this.item.rushType, rushGroupId = this.item.rushGroupId) {
      const msg = {
        goodsId: this.item.goodsId,
        color: (this.item.formatStyles && this.item.formatStyles.color && this.item.formatStyles.color.key) || this.item.colorReal
      }
      switch (checkoutType) {
        case 0:
          this.setPoint('items', 'saveforlater', 'click', msg)
          break
        case 1:
          this.setPoint('items', 'movetobag', 'click', msg)
          break
        // default:
        //   this.setPoint('items', 'delete', 'click', msg)
        //   break
      }
      if (this.toggle) {
        this.toggle = false
        this.$store.commit('cart/setLoadingFlag', true)
        const params = {
          for_checkout: checkoutType,
          goods_number: this.item.goodsNumber,
          rush_type: rushType
        }
        if (rushGroupId) params.rush_group_id = rushGroupId
        if (this.isBundle) {
          params.goods_number = this.cartItem.goodsNumber
        }
        this.$axios
          .$post(`/1.0/cart/goods/${this.item.recId}`, params)
          .then((res) => {
            this.toggle = true
            if (res.code == 0) {
              this.customizationNumber = res.data.customizationNumber * 1
              if (this.customizationNumber > 0) this.showConfirmDialog = true
              this.$emit('refreshCartList')
            } else {
              this.cartErrorExtra()
            }
          })
          .catch((error) => {
            console.log(error)
            this.cartErrorExtra()
          })
      }
    },
    /**
     * 编辑购物车商品
     */
    editCartGoods(item) {
      if (item.giftActivityId) {
        this.editGiftGoods()
        return false
      }
      if (item.isGift || this.isLater || (item.isRedeemed && item.supportDimension === 'sku')) return false
      this.$store.commit('quickshop/setIsNormalStock', false)
      if (this.supportStockSales) {
        this.$store.commit('quickshop/setIsNormalStock', true)
      }
      const params = {
        goods_id: item.goodsId,
        dress_type: item.dressType,
        goods_style_id: this.isSpecialCatId(item.catId) ? item.goodsStyleIdInfo[item.colorReal].goodsStyleId : '', // 通过colorReal进行匹配
        color: item.colorReal, // colorReal是英文color
        rec_id: item.recId,
        fromDialog: 'cartEdit',
        isLater: this.isLater,
        itemInfo: item,
        cartGoodsNumber: item.goodsNumber, // 当前购物车此商品的数量，弹窗里面用到了
        discount: item.styles.select.discount || ''
      }
      if (item.isRedeemed) {
        params.supportDimension = item.supportDimension // 商品参与换购的维度
        params.fromRedeemed = 1 // 是否是换购模块
      }
      const msg = {
        goodsId: this.item.goodsId,
        color: (this.item.formatStyles && this.item.formatStyles.color && this.item.formatStyles.color.key) || this.item.colorReal
      }
      this.setPoint('items', 'edit', 'click', msg)
      this.$emit('quickShop', params)
      this.$store.commit('cart/setLoadingFlag', true)
      this.$store.commit('quickshop/setQuickShopDialog', true)
    },
    /**
     * 删除购物车商品
     *  */
    deleteCartGoods() {
      const msg = {
        goodsId: this.item.goodsId,
        color: (this.item.formatStyles && this.item.formatStyles.color && this.item.formatStyles.color.key) || this.item.colorReal
      }
      this.setPoint('items', 'delete', 'click', msg)
      // ga4打点
      if (!this.isLater) {
        this.sethandleGoodsGA4(this.item, 'remove_from_cart')
      }
      if (!this.isLater) this.setPoint('items', 'deleteshoppingbag', 'click', msg)
      if (this.toggle) {
        this.toggle = false
        this.$store.commit('cart/setLoadingFlag', true)
        const isRealDelete = this.isLater ? 1 : 0
        this.$axios
          .$delete(`/1.0/cart/goods/${this.item.recId}`, { params: { is_real_delete: isRealDelete, ignoreRedeemed: 0 } })
          .then((res) => {
            this.toggle = true
            if (res.code == 0) {
              this.$emit('refreshCartList')
            } else if (
              res.code == 300601 &&
              this.redeemedStatus &&
              this.redeemedStatus.status &&
              this.redeemedStatus.status.conditionType != 2
            ) {
              this.$emit('triggleGiveUpBundle', this.item)
              this.$store.commit('cart/setLoadingFlag', false)
            } else {
              this.cartErrorExtra()
            }
          })
          .catch((error) => {
            console.log(error)
            this.cartErrorExtra()
          })
      }
    },
    cartErrorExtra(msg) {
      const _msg = msg || this.nl('page_error_something_wrong')
      this.$store.commit('cart/setLoadingFlag', false)
      alert(_msg)
    },
    // 更换是否rush
    rushTypeChange(event) {
      // console.log('rushTypeChange', event)
      this.upDateCartGoods(this.isLater ? 0 : 1, event.value, event.groupId)
    },
    // 如果是买赠活动的赠品，点edit需要弹出赠品弹窗（M站是跳到freeGift页面）
    editGiftGoods() {
      const tempDiscount = this.item.styles.select.discount
      const msg = {}
      if (tempDiscount && this.item.dressType === 'clearance') {
        msg.discount = 10 - tempDiscount
      }
      this.setPoint('addtobag', 'free gift', 'click', msg)
      this.$emit('getCartGiftActivity')
    },
    handleClick() {
      if (!this.item.detailUrl) {
        // 后端没有给跳转链接。说明不可点击跳转
        this.toastTip = this.nl('page_common_shop_cart_free_gift_tip')
        this.$refs.cartItemToast.show()
      }
    },
    toastHide() {
      this.toastTip = ''
    },
    sethandleGoodsGA4(item, type, quantity) {
      // 增删减商品  ga4打点
      // type  remove_from_cart:  点击删除按钮;   当用户输入数量小于原有数量时触发: remove_from_cart ; 当用户输入数量大于原有数量时触发:  add_to_cart
      const gaParams = {
        event: 'ga4Event',
        event_name: type,
        event_parameters: {
          product_name: item.shownGoodsName,
          currency: this.currencyCode,
          value: item.totalPrice,
          items: [
            {
              item_id: item.goodsId,
              item_name: item.shownGoodsName,
              item_category: item.catName,
              item_category2: item.shownColor,
              item_variant: this.getGoodsSize(item),
              item_brand: item.brandId || 0,
              price: item.shopPrice,
              quantity: quantity || item.goodsNumber,
              discount: item.priceOff,
              sku_id: item.gaData && item.gaData.ecommProdId
            }
          ]
        }
      }
      this.setGA4DataLayer(gaParams)
    },
    getRedeemedGoodsPoint(ec, el, item) {
      if (!item.isRedeemed) return false
      return {
        ec,
        el,
        msg: JSON.stringify({
          goodsId: item.goodsId,
          color: item.colorReal,
          cat_name: item.catName,
          cat_id: item.catId,
          goods_name: item.shownGoodsName
        })
      }
    },
    hasExcitation(item) {
      return false
    },
    getStickerText(item) {
      return item.driveInfo && item.driveInfo.cartSticker && item.driveInfo.cartSticker[0] && item.driveInfo.cartSticker[0].subText
    }
  }
}
</script>

<style lang="less">
.cat-product-item {
  position: relative;
  padding: 20px 0;
  display: flex;
  border-bottom: 1px solid #ccc;
  .goods-img-block {
    position: relative;
    width: 12.9%;
    max-width: 124px;
    min-width: 80px;
    .goods-checkbox {
      cursor: pointer;
      position: absolute;
      width: 15px;
      height: 15px;
      top: 0;
      left: 0;
      z-index: 2;
      fill: @theme-color;
    }
    .goods-img-a {
      max-width: 124px;
      max-height: 171px;
      min-width: 80px;
      min-height: 110px;
      width: 100%;
      // height: 171px;
      display: inline-block;
      overflow: hidden;
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
        transform: scale(0.3);
        width: max-content;
      }
    }
    .goods-img {
      // width: 124px;
      // height: 171px;
      height: 100%;
      width: 100%;
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
  }
  .cat-product-item-right {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    &-item {
      display: flex;
      flex: 1;
      justify-content: space-between;
      &.sod-excitation {
        flex: unset;
      }
    }
    .goods-info {
      flex: 1;
      margin-left: 0;
    }
  }

  .goods-info {
    position: relative;
    width: 40%;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    max-width: 380px;
    .info-content {
      flex: 1;
    }
    .goods-name {
      font-weight: 400;
      max-width: 275px;
      a {
        color: var(--color-121212);
        .flash-sale-goods {
          // width: 60px;
          height: 18px;
          display: inline-block;
          vertical-align: TOP;
          margin-right: 3px;
          color: @theme-color;
          border: 1px solid @theme-color;
          padding: 0 2px;
          font-size: 12px;
        }
        .gift-goods {
          color: @theme-color;
          text-transform: capitalize;
          font-weight: bold;
        }
        .redeemed {
          color: @theme-color;
          text-transform: capitalize;
        }
        &:hover {
          color: @theme-color;
        }
      }
      .barbie-heart {
        fill: #de1c85;
        transform: scale(0.5);
      }
    }
    .gift-card-item {
      p {
        word-break: break-word;
      }
      .gift-card-item-tips {
        margin-top: 10px;
      }
    }
    @media screen and (min-width: 1273px) {
      .goods-name {
        max-width: 300px;
      }
    }
    @media screen and (min-width: 1293px) {
      .goods-name {
        max-width: 320px;
      }
    }
    @media screen and (min-width: 1313px) {
      .goods-name {
        max-width: 340px;
      }
    }
    @media screen and (min-width: 1333px) {
      .goods-name {
        max-width: 360px;
      }
    }
    @media screen and (min-width: 1353px) {
      .goods-name {
        max-width: 380px;
      }
    }
    @media screen and (max-width: 1263px) {
      .goods-name {
        max-width: 290px;
      }
    }
    .measure-tip {
      color: @theme-color;
      margin-top: 10px;
      max-width: 340px;
    }
    .goods-warning {
      margin-top: 10px;
      color: @theme-color;
      &.error {
        font-size: 12px;
      }
    }
    .goods-color {
      cursor: pointer;
      text-transform: capitalize;
      span {
        margin-left: 3px;
      }
    }
    .goods-estimate {
      display: flex;
      align-items: center;
      margin-top: 11px;
      margin-right: 5px;
      flex-wrap: wrap;
      .rush-select {
        width: 144px;
        height: 26px;
        overflow: hidden;
        select {
          background: transparent;
          line-height: 14px;
          padding-left: 11px;
          width: 144px;
          border: 1px solid #b2b2b2;
          height: 26px;
          appearance: none;
          &::-ms-expand {
            display: none;
          }
        }
      }
    }
    .goods_notice {
      padding-top: 10px;
      clear: both;
      span {
        color: @theme-color;
      }
      .more_cat_notice,
      .rush_notice {
        color: var(--color-121212);
      }
    }
    .goods-size-box {
      position: relative;
      display: inline-block;
      cursor: pointer;
      .goods-size {
        display: inline-block;
        .triangle {
          width: 10px;
          margin-left: 3px;
          vertical-align: middle;
        }
      }
      &:hover .tip-goods-size {
        display: block;
      }
      .tip-goods-size {
        display: none;
        position: absolute;
        left: calc(100% - 10px);
        top: 25px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 10px 12px;
        white-space: nowrap;
        transform: translateX(-50%);
        color: #231f1e;
        font-family: @font-family-500, sans-serif;
        z-index: 4;
        &:before {
          content: '';
          width: 0;
          height: 0;
          border-right: 6px solid transparent;
          border-bottom: 6px solid var(--color-cccccc);
          border-left: 6px solid transparent;
          position: absolute;
          top: 0%;
          left: 48.4%;
          margin-top: -7px;
        }
        &:after {
          cursor: pointer;
          content: '';
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-bottom-color: #ffffff;
          position: absolute;
          top: 0%;
          left: 48.4%;
          margin-top: -11px;
        }
        &:hover {
          display: block;
        }
      }
    }

    .cart-btn-block {
      a {
        font-size: 13px;
        color: var(--color-121212);
        text-decoration: underline;
        margin-right: 18px;
        cursor: pointer;
      }
    }
  }
  @media screen and (max-width: 1080px) {
    .goods-info {
      width: 100%;
      .cart-btn-block {
        margin-top: 15px;
      }
    }
    .goods-price-block {
      padding-top: 8px;
      justify-content: flex-start !important;
      flex-direction: column;
      align-items: flex-end !important;
      height: 100% !important;
      .goods-price,
      .prod-com-price {
        text-align: right !important;
        min-width: unset !important;
      }
      em {
        margin-bottom: 5px !important;
      }
      .goods-num-block {
        margin-bottom: 5px !important;
        margin-right: unset !important;
        .goods-num {
          width: unset !important;
        }
      }
      .cart_with_code {
        position: relative !important;
        left: unset !important;
        top: unset !important;
      }
    }
    .goods-item-total-price-box,
    .goods-item-total-price {
      &.hasOnlyTip {
        margin-top: 18px;
      }
    }
  }
  @media screen and (max-width: 830px) {
    .cart_with_code {
      top: -10px;
      right: 0;
    }
  }
  .goods-price-block {
    display: flex;
    height: 32px;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    .goods-price {
      width: 100px;
      text-align: left;
    }
    .prod-com-price {
      position: relative;
      width: 100px;
      text-align: left;
      .cur-goods-price {
        color: @theme-color;
        display: inline-block;
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
        left: 0;
        top: 25px;
      }
    }

    em {
      margin-left: 20px;
    }

    .goods-num-block {
      margin-right: 20px;
      position: relative;
      .goods-num {
        display: inline-block;
        position: relative;
        width: 40px;
        margin-left: 39px;
      }
      .select-box {
        display: inline-block;
        position: relative;
        width: 60px;
        height: 32px;
        vertical-align: top;
        margin-left: 20px;
        cursor: pointer;
        .select_title-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 10px;
          width: 10px;
          height: 10px;
        }
        ul li {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .input {
          width: 100%;
          height: 100%;
          line-height: 30px;
          border: 1px solid var(--color-cccccc);
          position: absolute;
          // padding: 0 19px;
          box-sizing: border-box;
          cursor: pointer;
          input {
            border: none;
            outline: none;
            padding: 0;
            width: 43px;
            cursor: pointer;
            text-align: center;
            &:focus {
              background: #fff;
            }
          }
        }
        .input-num {
          padding: 0;
          text-align: center;
        }
        .num-select {
          width: 60px;
          border: 1px solid var(--color-cccccc);
          overflow: hidden;
          position: absolute;
          top: 32px;
          z-index: 2;
          background-color: #fff;
          text-align: left;
          max-height: 182px;
          // height: auto;
          overflow: auto;
          box-sizing: border-box;
          border-top: none;
          display: none;
          box-shadow: 0 2px 3px 0 rgba(51, 51, 51, 0.3);
          &.show {
            display: block;
          }
          ul li {
            height: 30px;
            padding-right: 12px;
            line-height: 30px;
            font-family: @font-family-500, sans-serif;
            cursor: pointer;
            text-align: center;
            &.disable {
              color: #d6d6d6;
              cursor: auto;
              &:hover {
                background: transparent;
              }
            }
            &:hover {
              background: #f6f6f6;
            }
            &.more-num {
              padding: 0;
              border-top: 1px solid #ccc;
            }
          }
        }
      }
      .select-tip {
        position: absolute;
        bottom: -20px;
        color: @theme-color;
        width: max-content;
        right: 0;
      }
    }

    .goods-item-total-price-box {
      position: relative;
      text-align: right;
      // width: max-content;
      width: 150px;
      .cur-goods-price {
        color: @theme-color;
        display: inline-block;
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
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    }
    .goods-item-total-price {
      position: relative;
      width: 150px;
      text-align: right;
      font-family: @font-family-600;
    }
  }
  &.unavailable {
    .goods-info .goods-name {
      max-width: 300px;
    }
    .goods-price-block .goods-num-block .select-box {
      background: var(--color-f9f9f9);
      .input {
        background: var(--color-f9f9f9);
        input {
          background: var(--color-f9f9f9);
        }
      }
    }
  }
  .gift-note {
    color: var(--color-121212);
    margin-top: 70px;
    position: absolute;
    width: 640px;
    .a_click {
      color: var(--color-121212);
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
