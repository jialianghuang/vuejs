<template>
  <div class="gift-card-info-box">
    <div class="card-description">
      <div class="card-name">{{ baseInfo.shownGoodsName }}</div>
      <div class="card-price">{{ giftCardInfo.giftCardPrice }}</div>
      <div class="card-prod-from">
        <div v-if="giftCardInfo.cardImage && Object.keys(giftCardInfo.cardImage).length > 0" class="card-design-box card-from-item">
          <div class="item-title m-t-15">{{ nl('page_gift_card_detail_design') }}</div>
          <div class="card-design-list-box">
            <!-- <div :class="{ 'no-swipper': giftCardInfo.cardImage.length <= 4 }" class="card-img-swipper"> -->
            <!-- <a
              v-if="giftCardInfo.cardImage.length > 4"
              href="javascript:void(0)"
              aria-label="swiper-button-prev"
              class="prev-arraw swiper-button-prev swiper-button-black"
            ></a> -->
            <!-- <div> -->
            <!-- <div> -->
            <template v-if="popupTopCards && popupTopCards.length">
              <div
                v-for="(cardItem, index) in popupTopCards"
                :class="[{ selected: giftCardFrom.selectedGiftCard.imgId === cardItem.imgId }]"
                :key="`${index}_${cardItem.imgId}`"
                @click="selectGiftCard(cardItem)"
                class="gift-cards-item"
              >
                <img
                  :src="addWebpSuffix(cardItem.imgUrl)"
                  :alt="'gift card' + index"
                  :class="{ 'skeleton-item': !isImgLoad }"
                  @load="imgLoad()"
                  class="card-img"
                />
              </div>
            </template>
            <!-- <div
              v-for="(cardItem, index) in giftCardInfo.cardImage"
              :key="`${index}_${cardItem.imgId}`"
              @click="selectGiftCard(cardItem)"
              :class="[{ selected: giftCardFrom.selectedGiftCard.imgId === cardItem.imgId }]"
              class="gift-cards-item"
            >
              <img :src="addWebpSuffix(cardItem.imgUrl)" :alt="'gift card' + index" class="card-img" />
            </div> -->
            <!-- 当卡片>14时，在第15位卡片位插入see more -->
            <div v-if="popupTopCards.length == 14" @click="handleSeeMore" class="gift-cards-item view-more-block">
              <div class="view-more">
                <span class="view-more-text">{{ nl('page_common_see_more') }}</span>
              </div>
            </div>
            <!-- </div> -->
            <!-- </div> -->
            <!-- <a
              v-if="giftCardInfo.cardImage.length > 4"
              href="javascript:void(0)"
              aria-label="swiper-button-next"
              class="next-arraw swiper-button-next swiper-button-black"
            ></a> -->
            <!-- </div> -->
          </div>
        </div>
        <div v-if="giftCardInfo.fixedPrice && Object.keys(giftCardInfo.fixedPrice).length > 0" class="card-amount-box card-from-item">
          <div class="item-title">{{ nl('page_gift_card_detail_amount') }}</div>
          <div class="card-amount-list-box item-list-box">
            <div
              v-for="priceItem in giftCardInfo.fixedPrice"
              :key="priceItem.cardPriceDisplay"
              @click="selectCardPrice(priceItem)"
              :class="{
                selected: giftCardFrom.selectedCardPrice.cardPrice === priceItem.cardPrice && !giftCardFrom.selectedCardPrice.isCustom
              }"
              class="amount-item item-box"
            >
              <span>{{ priceItem.cardPriceDisplay }}</span>
            </div>
            <div
              @click="selectCustomCardPrice()"
              :class="{
                selected: giftCardFrom.selectedCardPrice.isCustom,
                error: giftCardFromErrResult.customPrice
              }"
              class="amount-item custom-amount-item item-box"
            >
              <label>
                <span class="custom-amount-label">{{ currencySymbol }}</span>
                <input
                  ref="customPrice"
                  @input="changeCustomCardPrice($event)"
                  @focus="handleFocus('customPrice')"
                  @blur="handleBlur('customPrice')"
                  v-model="customPrice"
                  :placeholder="nl('page_gift_card_detail_enter_amount')"
                  type="text"
                  class="custom-amount-int"
                />
              </label>
              <div v-if="giftCardFromErrResult.customPrice" class="err-tips">{{ giftCardFromErrResult.customPrice }}</div>
            </div>
          </div>
        </div>
        <div v-if="giftCardInfo.shippingType && Object.keys(giftCardInfo.shippingType).length > 0" class="card-delivery-box card-from-item">
          <div class="item-title m-t-15">{{ nl('page_common_delivery') }}</div>
          <div class="card-delivery-list-box item-list-box">
            <div
              v-for="typeItem in giftCardInfo.shippingType"
              :key="typeItem.key"
              @click="selectShippingType(typeItem)"
              :class="{
                selected: giftCardFrom.selectedShippingType.key === typeItem.key
              }"
              class="delivery-item item-box"
            >
              <span>{{ nl(typeItem.name) }}</span>
            </div>
          </div>
        </div>
        <div class="card-to-box card-from-item">
          <div class="item-title">{{ nl('page_common_to') }}</div>
          <div class="card-to-input-box item-input-box">
            <textarea
              ref="to_email"
              v-model="giftCardFrom.to_email"
              :placeholder="nl('page_gift_card_detail_to_email_placeholder')"
              @input="handleValChange('to_email', giftCardFrom.to_email)"
              @focus="handleFocus('to_email')"
              @blur="handleBlur('to_email')"
              :class="{ error: giftCardFromErrResult.to_email }"
              :style="{ height: `${toEmailHeight}px` }"
              aria-label="to email"
              class="to-int item-int"
            />
            <AzEmailDomain :show="emailDomainShow" :origin-email="giftCardFrom.to_email" @domain-handler="emailHandler" />
            <div v-html="nl('page_gift_card_detail_to_email_tips')" class="tips"></div>
            <div v-if="giftCardFromErrResult.to_email" class="err-tips">{{ giftCardFromErrResult.to_email }}</div>
          </div>
        </div>
        <div class="card-from-box card-from-item">
          <div class="item-title">{{ nl('page_common_from') }}</div>
          <div class="card-from-input-box item-input-box">
            <input
              ref="from_user"
              @input="handleValChange('from_user', giftCardFrom.from_user)"
              @focus="handleFocus('from_user')"
              v-model="giftCardFrom.from_user"
              :placeholder="nl('page_your_name')"
              :class="{ error: giftCardFromErrResult.from_user }"
              type="text"
              aria-label="from user"
              class="from-int item-int"
            />
          </div>
        </div>
        <div class="card-message-box card-from-item">
          <div class="item-title">{{ nl('page_gift_card_detail_message') }}</div>
          <div class="card-message-input-box item-input-box">
            <textarea
              ref="card_msg"
              @input="handleValChange('card_msg', giftCardFrom.card_msg)"
              @focus="handleFocus('card_msg')"
              v-model="giftCardFrom.card_msg"
              :placeholder="nl('page_gift_card_detail_message_placeholder')"
              :class="{ error: giftCardFromErrResult.card_msg }"
              style="resize:none"
              class="message-int item-int"
              maxlength="500"
              aria-label="card msg"
            />
            <div class="tips">{{ giftCardFrom.card_msg ? giftCardFrom.card_msg.length : 0 }}/500</div>
          </div>
        </div>
        <div ref="goods_number" class="card-quantity-box card-from-item">
          <label for="goods-number">{{ nl('page_common_quantity') }}:</label>
          <az-select-input
            id="goods-number"
            :value="giftCardFrom.goods_number"
            :option="11"
            :max="10"
            @changeNumber="changeNumber"
            v-show="showNumSelect"
            class="card-number"
          ></az-select-input>
          <div v-if="!showNumSelect" class="tips">
            {{ nl('page_gift_card_detail_one_qty_tips') }}
          </div>
        </div>
        <div class="card-date-box card-from-item">
          <div class="item-title">
            <span>{{ nl('page_gift_card_detail_delivery_date') }}:</span>
            <span class="date-dec">{{ showDate | dateFormat(datePickerLang) }}</span>
          </div>
          <div ref="delivery_date" class="card-date-picker">
            <date-picker
              v-model="giftCardFrom.delivery_date"
              :append-to-body="false"
              :popup-style="{ top: '40px', zIndex: 1 }"
              :disabled-date="disabledDate"
              :clearable="false"
              :editable="false"
              :lang="datePickerLang"
              :format="dateFormatisplay"
              @input="handleValChange('delivery_date', giftCardFrom.delivery_date)"
              :placeholder="nl('page_common_now')"
              :input-attr="{ 'aria-label': 'date picker' }"
              type="date"
              value-type="YYYY-MM-DD"
            ></date-picker>
            <div class="tips">
              {{ nl('page_gift_card_deliver_tip') }}
            </div>
          </div>
        </div>
        <div @click="handleConfirmCheckbox" class="card-notice-box card-from-item">
          <input :checked="confirmCheckbox" aria-label="card confirm" type="checkbox" />
          <div v-html="nl('page_gift_card_detail_checkout_tips')" class="notice-desc"></div>
        </div>
      </div>
      <div class="add-to-bag-block">
        <az-button
          id="add-to-bag"
          @click="handleAddToBagGiftCard"
          @mouseenter.native="checkStyle(false)"
          @mouseleave.native="hideCheckTip"
          :text="nl('page_order_add2bag')"
          :loading="loading"
          icon="icon-xxy_add_to_bag"
          class="add-to-bag-btn"
        ></az-button>
        <az-button
          id="buy-now"
          @click="handleBuyGiftCard"
          @mouseenter.native="checkStyle(true)"
          @mouseleave.native="hideCheckTip"
          :textColor="'var(--color-121212)'"
          :color="'#fff'"
          :text="nl('page_common_buy_now')"
          :loading="buyNowLoading"
          class="buy-now-btn"
        ></az-button>
        <check-tips v-show="showCheckTip" :tipsLeft="checkTipsLeftPosition" :tips="checkTips"></check-tips>
      </div>
    </div>
    <product-info-detail :baseInfo="baseInfo" :detailsInfo="detailsInfo" :make-time-info="makeTimeInfo"></product-info-detail>
    <add-cart-dialog @quickShop="quickShopClick" :goodsNumber="giftCardNumber" v-if="showAddCartDialog"></add-cart-dialog>
    <popup-gift-cards
      :giftCardInfo="giftCardInfo"
      v-if="popupGiftCardsShow"
      @selectGiftCard="selectGiftCard"
      :imgId="giftCardFrom.selectedGiftCard.imgId"
    ></popup-gift-cards>
  </div>
</template>

<script>
/**
 * gift card详情
 */
import { mapState } from 'vuex'
import AzSelectInput from '@/components/az-ui/Select/AzSelectInput'
import AzButton from '@/components/az-ui/AzButton'
import productInfoDetail from '@/components/product/ProductInfoDetail'
import CheckTips from '@/components/quickshop/style/CheckTips'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'
import 'vue2-datepicker/locale/sv'
import { dateFormatFn } from '@/assets/js/utils.js'
import { Base64 } from 'js-base64'
import Schema from 'async-validator'
import formValidatorType from '@/assets/js/formValidatorType'
import AddCartDialog from '@/components/cart/AddCartDialog'
import PopupGiftCards from '@/components/giftCard/PopupGiftCards'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
export default {
  name: 'GiftCardProductInfo',
  components: {
    AzSelectInput,
    DatePicker,
    AzButton,
    productInfoDetail,
    CheckTips,
    AddCartDialog,
    PopupGiftCards,
    AzEmailDomain
  },
  filters: {
    dateFormat: (s, l) => {
      return dateFormatFn(s, l)
    }
  },
  props: {
    detailsInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    makeTimeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    styleInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      GCSwiperOption: {
        slidesPerView: 4,
        spaceBetween: '2.857%',
        slidesPerGroup: 4,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      buyNowLoading: false,
      customPrice: null,
      giftCardFromErrResult: {},
      confirmCheckbox: false,
      showCheckTip: false,
      checkTipsLeftPosition: '',
      checkTips: [],
      showNumSelect: true,
      loading: false,
      toEmailHeight: 40,
      popupTopCards: [], // 前14个卡片
      isImgLoad: false,
      emailDomainShow: true
    }
  },
  computed: {
    ...mapState('giftCard', ['giftCardInfo', 'giftCardFromData', 'popupGiftCardsShow']),
    ...mapState('product', ['baseInfo', 'showAddCartDialog']),
    showDate() {
      return this.giftCardFrom.delivery_date ? this.giftCardFrom.delivery_date : this.$dayjs().format('YYYY-MM-DD')
    },
    datePickerLang() {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = this.language === 'se' ? 'sv' : this.language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    },
    giftCardFrom: {
      get() {
        const obj = JSON.parse(JSON.stringify(this.giftCardFromData))
        return obj
      },
      set(val) {
        // 因为这个计算属性是对象，更改对象的值无法触发set方法，所以在methods里做处理了。
        console.log(val, '====')
      }
    },
    giftCardNumber() {
      // 礼品卡购买的数量
      if (this.giftCardFrom && this.giftCardFrom.to_email && this.giftCardFrom.goods_number) {
        const list = this.giftCardFrom.to_email.split(/[(\r\n)\r\n]/)
        return list.length * this.giftCardFrom.goods_number
      } else {
        return 0
      }
    }
  },
  created() {
    this.popupTopCards = this.giftCardInfo.cardImage.slice(0, 14)
    if (this.giftCardFromData.selectedGiftCard) this.selectGiftCard(this.giftCardFromData.selectedGiftCard)
  },
  mounted() {
    // 根据当前选中项，直接滚动轮播图到对应选中项
    // let idx = 0
    // for (let i = 0; i < this.giftCardInfo.cardImage.length; i++) {
    //   const ele = this.giftCardInfo.cardImage[i]
    //   if (this.giftCardFrom.selectedGiftCard.imgId === ele.imgId) {
    //     idx = i
    //   }
    // }
    // this.giftCardSwiper.slideTo(idx, 0, false)
  },
  updated() {},
  methods: {
    imgLoad() {
      this.isImgLoad = true
    },
    disabledDate(current) {
      // Can not select days before today
      return current && (current < this.$dayjs().startOf('day') || current > this.$dayjs().add(1, 'year'))
    },
    changeNumber(val) {
      this.handleValChange('goods_number', val)
    },
    selectGiftCard(card) {
      // 当卡片>14时，第14位往后的卡片在see more弹框被选中，则把把选中的卡片置顶第一位
      const hasCard = this.popupTopCards.some((item) => {
        return item.imgId == card.imgId
      })
      if (!hasCard) {
        this.isImgLoad = false
        this.popupTopCards = [card, ...this.popupTopCards].slice(0, 14)
      }
      this.handleValChange('selectedGiftCard', card)
    },
    selectCardPrice(price) {
      this.handleValChange('selectedCardPrice', {
        ...price,
        isCustom: false
      })
      this.customPrice = null
      this.$set(this.giftCardFromErrResult, 'customPrice', false)
    },
    selectShippingType(type) {
      this.handleValChange('selectedShippingType', type)
    },
    selectCustomCardPrice() {
      this.handleValChange('selectedCardPrice', {
        isCustom: true,
        cardPrice: this.customPrice,
        cardPriceDisplay: this.customPrice ? `${this.currencySymbol}${this.customPrice}` : `${this.currencySymbol}`
      })
    },
    changeCustomCardPrice(e) {
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null
      this.customPrice = e.target.value
      this.selectCustomCardPrice()
    },
    handleValChange(key, val) {
      if (key === 'card_msg' && val && val.length > 500) {
        this.$set(this.giftCardFromErrResult, 'card_msg', true)
      }
      const obj = {
        ...this.giftCardFrom
      }
      obj[key] = val
      this.$store.commit('giftCard/setGiftCardFromData', obj)
      if (key === 'to_email') {
        // 输入的时候，按行数撑开高度
        const toEmailsList = this.giftCardFrom.to_email ? this.giftCardFrom.to_email.split(/[(\r\n)\r\n]/) : []
        this.toEmailHeight = toEmailsList.length * 18 + 22
      }
    },
    handleConfirmCheckbox(val) {
      this.confirmCheckbox = !this.confirmCheckbox
      this.$set(this.giftCardFromErrResult, 'confirmCheckbox', !this.confirmCheckbox)
    },
    /**
     * 获取焦点的时候，清空错误提示
     */
    handleFocus(key) {
      if (key === 'to_email') {
        this.emailDomainShow = true
      }
      this.$set(this.giftCardFromErrResult, key, false)
    },
    /**
     * 失去焦点之后校验输入项
     */
    handleBlur(key) {
      if (key === 'to_email') {
        const timer = setTimeout(() => {
          this.emailDomainShow = false
          clearTimeout(timer)
        }, 300)
      }
      if (key === 'customPrice' && this.giftCardFrom.selectedCardPrice && this.giftCardFrom.selectedCardPrice.isCustom) {
        // 备注：校验自定义金额 金额最小$1，最大$1000，最多俩位小数，货币单位只到美分
        if (!this.customPrice || +this.customPrice < 1) {
          this.$set(this.giftCardFromErrResult, 'customPrice', this.nl('page_gift_card_detail_price_errtip_minimum'))
        } else if (+this.customPrice > 1000) {
          this.$set(this.giftCardFromErrResult, 'customPrice', this.nl('page_gift_card_detail_price_errtip_maximum'))
        }
      } else if (key === 'to_email') {
        // 校验邮箱，支持多个对象，用英文逗号或空格隔开，只允许一个逗号+若干空格，若干空格，一个逗号三种隔开格式，只要用户在不同邮箱间输入的空格>1，在失去焦点时，自动处理成换行显示
        let toEmailsList = this.giftCardFrom.to_email
          ? this.giftCardFrom.to_email
              .replace(/\n/g, ',')
              .replace(/ /g, ',')
              .split(',')
          : []
        toEmailsList = toEmailsList.filter((item) => {
          return !!item
        })
        this.giftCardFrom.to_email = toEmailsList.join('\n') // 处理成自动换行
        this.toEmailHeight = toEmailsList.length * 18 + 22 // 按行数撑开高度
        if (toEmailsList.length > 10) {
          this.$set(this.giftCardFromErrResult, 'to_email', this.nl('page_gift_card_detail_email_errtip_maximum'))
        } else if (!toEmailsList.length) {
          this.$set(this.giftCardFromErrResult, 'to_email', this.nl('page_common_miss_email'))
        } else {
          toEmailsList.some((email) => {
            this.emailCheck(email)
          })
        }
        if (toEmailsList.length > 1) {
          // 多个邮箱的时候，数量goods_number默认为1
          this.showNumSelect = false
          this.changeNumber(1)
        } else {
          this.showNumSelect = true
        }
      } else if (key === 'card_msg') {
        if (this.giftCardFrom.card_msg && this.giftCardFrom.card_msg.length > 500) {
          this.$set(this.giftCardFromErrResult, 'card_msg', true)
        }
      }
    },
    /**
     * 单个邮箱校验Fn
     */
    emailCheck(_email) {
      const rules = {
        email: formValidatorType.email({ validator: this.nl('page_email_enter_valid') })
      }
      this.emailValidator = new Schema(rules)
      this.emailValidator.validate(
        {
          email: _email
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              this.$set(this.giftCardFromErrResult, 'to_email', item.message)
            })
          }
        }
      )
    },
    /**
     * 点击buyNow之后先校验再跳checkout
     */
    handleBuyGiftCard() {
      this.cardCheckout('buyNow').then((data) => {
        if (!data) {
          this.buyNowLoading = false
          return false
        }
        // 校验成功了，跳转到checkout页面
        const params = data.giftCardParams
        const buyNowParam = Base64.encode(JSON.stringify(params))
        const buyNowUrl = this.countryUrl(`/checkout?buy_now=${buyNowParam}&order_country_code=${this.country}`)
        window.location.href = buyNowUrl
      })
    },
    /**
     * 添加到购物车
     */
    handleAddToBagGiftCard() {
      this.cardCheckout('addToBag').then((data) => {
        if (!data) {
          this.loading = false
          return false
        }
        // 校验成功了，执行加车操作
        const params = data.giftCardParams
        const formData = new FormData()
        if (params.styles && params.styles.select && params.styles.select.color) {
          formData.set('styles[select][color]', params.styles.select.color)
        }
        if (params.styles && params.styles.select && params.styles.select.size) {
          formData.set('styles[select][size]', params.styles.select.size)
        }
        this.$axios
          .$post('/1.0/cart/goods', params)
          .then((res) => {
            if (res.code == 0) {
              this.retentionAddToCart({ ...this.baseInfo, goodsNumber: 1, csText: this.getColorAndSizeText(formData) }, res.data.rec_id)
              this.loading = false
              this.$store.commit('product/setShowAddCartDialog', true)
              this.$emit('getCartInfo')
            } else {
              alert(res.msg)
              this.loading = false
              window.location.reload()
            }
          })
          .catch((error) => {
            alert(error.msg)
            this.loading = false
            window.location.reload()
          })
      })
    },
    /**
     * 购买之前检验
     */
    async cardCheckout(action) {
      const { selectedGiftCard = {}, selectedShippingType = {}, selectedCardPrice = {} } = this.giftCardFrom
      // styles 这个入参是因为giftcard 需要走商品的buynow流程，需要有这个参数，跟后端确认，color取giftCardInfo里面的 styleId ，size取first-screen接口的styleInfo数据。
      const stylesObj = {
        select: {
          color: selectedGiftCard.styleId,
          size: this.styleInfo.size && Object.values(this.styleInfo.size) && Object.values(this.styleInfo.size)[0].styleId
        },
        size_type: '_inch'
      }
      const params = {
        act: 'addGoodsToCart',
        dress_type: 'dress',
        gift_card: 1,
        goods_id: this.baseInfo.goodsId,
        card_img_id: selectedGiftCard.imgId,
        card_img_url: selectedGiftCard.cardImgUrl,
        shipping_type: selectedShippingType.key,
        card_price: selectedCardPrice.cardPrice,
        card_msg: this.giftCardFrom.card_msg,
        delivery_date: this.showDate,
        from_user: this.giftCardFrom.from_user,
        to_email: this.giftCardFrom.to_email.replace(/\n/g, ','),
        goods_number: this.giftCardFrom.goods_number,
        styles: stylesObj
      }
      if (this.handleCheckFrom()) {
        return false
      }
      if (action === 'buyNow') {
        this.buyNowLoading = true
        // ga4打点
        this.setGA4DataLayer({
          event: 'ga4Event',
          event_name: 'checkout',
          event_parameters: {
            button_name: 'Buy Now'
          }
        })
      } else {
        this.loading = true
        this.addToBagGA4(params)
      }
      const res = await this.$axios.$get('/1.0/product/card-checkout', { params })
      if (res.code == 0) {
        this.trackGA4NewEmail(params.to_email, 'gift_card_detail', null, true)
        return { ...res, giftCardParams: params }
      } else {
        alert(res.msg)
        return false
      }
    },
    handleCheckFrom() {
      this.giftCardFromErrResult = {}
      // 针对失去焦点校验的项，在提交的时候再校验一次
      const checkKey = ['customPrice', 'to_email']
      checkKey.forEach((key) => {
        this.handleBlur(key)
      })
      if (!this.confirmCheckbox) {
        this.$set(this.giftCardFromErrResult, 'confirmCheckbox', true)
      }
      const errFlag = []
      Object.keys(this.giftCardFromErrResult).forEach((key) => {
        if (this.giftCardFromErrResult[key]) {
          errFlag.push(key)
        }
      })
      // 滚动到第一个报错的位置
      if (errFlag.length) {
        const firstErr = errFlag[0]
        this.$refs[firstErr] && this.$refs[firstErr].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
      return errFlag.length > 0
    },
    hideCheckTip() {
      this.showCheckTip = false
    },
    checkStyle(isBuyNowBtnHover) {
      this.checkTips = []
      if (!this.confirmCheckbox) {
        this.checkTips.push({
          title: this.nl('page_js_accept')
        })
        this.showCheckTip = true
      }
      // buy now hover
      this.checkTipsLeftPosition =
        this.showCheckTip && isBuyNowBtnHover ? document.querySelector('#add-to-bag').offsetWidth + 10 + 'px' : '0px'
    },
    // 商品详情页,点击addtobag加购打点
    addToBagGA4(params) {
      // ga4打点
      const gaParams = {
        event: 'ga4Event',
        event_name: 'add_to_cart',
        event_parameters: {
          currency: this.currencyCode,
          value: params.card_price * params.goods_number,
          items: [
            {
              item_id: this.baseInfo.goodsId,
              item_name: this.baseInfo.shownGoodsName,
              discount: this.baseInfo.priceOff,
              item_category: this.baseInfo.catName,
              item_category2: this.baseInfo.shownColor,
              item_variant: 'none',
              item_brand: this.baseInfo.brandId || 0,
              price: params.card_price,
              quantity: params.goods_number,
              sku_id: this.baseInfo.gaData && this.baseInfo.gaData.ecommProdId
            }
          ]
        }
      }
      this.setGA4DataLayer(gaParams)
    },
    quickShopClick(params) {
      this.$emit('quickShop', params)
    },
    // 点击see more后弹窗
    handleSeeMore() {
      this.$store.commit('giftCard/setPopupGiftCardsShow', true)
    },
    emailHandler(value) {
      this.$store.commit('giftCard/setGiftCardFromDataEmail', value)
      this.handleBlur('to_email')
    }
  }
}
</script>

<style lang="less" scoped>
.skeleton-item {
  background: #f1f1f1;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: linear-gradient(to right, var(--color-eeeeee) 8%, #dddddd 18%, var(--color-eeeeee) 33%);
  background-size: 800px 104px;
  height: 100%;
  position: relative;
}
.gift-card-info-box {
  width: 44.9%;
  float: left;
  position: relative;
  .card-name,
  .card-price {
    font-size: 24px;
    line-height: 33px;
    text-transform: uppercase;
    color: var(--color-121212);
  }
  .card-price {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .card-prod-from {
    .card-from-item {
      margin-top: 15px;
      .item-title {
        font-size: 13px;
        line-height: 18px;
        text-transform: uppercase;
        color: var(--color-121212);
        margin-bottom: 10px;
        &.m-t-15 {
          margin-top: 15px;
        }
      }
      .item-list-box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item-box {
          width: 60px;
          height: 27px;
          line-height: 25px;
          text-align: center;
          margin-right: 15px;
          border: 1px solid var(--color-cccccc);
          box-sizing: border-box;
          cursor: pointer;
          &.selected {
            border: 1px solid var(--color-121212);
            color: var(--color-121212);
            .custom-amount-label {
              border-color: var(--color-121212);
            }
          }
          &:hover {
            border: 1px solid var(--color-121212);
          }
        }
      }
      .item-input-box {
        width: 100%;
        .item-int {
          border: 1px solid var(--color-cccccc);
          width: 100%;
          padding: 10px;
          font-size: 13px;
          line-height: 18px;
          box-sizing: border-box;
          min-height: 40px;
        }
        .to-int {
          height: auto;
        }
        &.card-to-input-box {
          position: relative;
          /deep/ .az-email-domain-box {
            top: 40x;
          }
        }
      }
      .error {
        border-color: red !important;
      }
      .err-tips {
        color: red;
        margin-top: 3px;
        line-height: 18px;
        font-size: 13px;
      }
    }
    .card-design-box {
      .card-design-list-box {
        display: flex;
        flex-wrap: wrap;
        .gift-cards-item {
          cursor: pointer;
          width: 120px;
          height: 80px;
          padding: 2px;
          box-sizing: border-box;
          border: 1px solid var(--color-cccccc);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-right: 15px;
          margin-bottom: 15px;
          .card-img {
            width: 100%;
            // height: auto;
          }
          &.selected {
            border: 2px solid var(--color-121212);
          }
          &:hover {
            border: 2px solid var(--color-121212);
          }
        }
        .view-more-block {
          .view-more {
            height: calc(100% - 40px);
            align-items: center;
            justify-content: center;
            display: flex;
            .view-more-text {
              text-transform: capitalize;
              font-size: 13px;
              color: @theme-color;
              text-decoration: underline;
            }
          }
        }
        // .swiper-button {
        //   width: 11px;
        //   height: 18px;
        //   margin-top: -8px;
        //   background-size: 11px 18px;
        // }
        // .prev-arraw,
        // .next-arraw {
        //   position: absolute;
        //   display: block;
        //   top: 50%;
        //   width: 16px;
        //   height: 16px;
        //   margin-top: -8px;
        //   background-size: 100% 100%;
        //   z-index: 1;
        //   &.active {
        //     cursor: pointer;
        //   }
        //   &:focus {
        //     outline: none;
        //   }
        // }
        // .prev-arraw {
        //   left: 2px;
        // }
        // .next-arraw {
        //   right: 2px;
        // }
        // }
      }
    }
    .card-amount-box {
      margin-top: 0;
      .card-amount-list-box {
        .custom-amount-item {
          width: unset;
          height: 27px;
          line-height: 25px;
          font-size: 0;
          box-sizing: border-box;
          position: relative;
          .custom-amount-label {
            padding: 0 10px;
            line-height: 25px;
            background: var(--color-eeeeee);
            border-right: 1px solid var(--color-cccccc);
            box-sizing: border-box;
            display: inline-block;
            font-size: 13px;
            vertical-align: top;
          }
          .custom-amount-int {
            padding: 0 5px;
            width: 102px;
            box-sizing: border-box;
            border: none;
            height: 100%;
            line-height: 25px;
            font-size: 13px;
          }
          .err-tips {
            position: absolute;
            word-break: break-all;
            width: max-content;
            top: 100%;
          }
        }
      }
    }
    .card-to-box {
      .tips {
        font-size: 12px;
        line-height: 16px;
        color: var(--color-121212);
      }
    }
    .card-from-box {
    }
    .card-message-box {
      .card-message-input-box {
        position: relative;
        .message-int {
          height: 92px;
        }
        .tips {
          position: absolute;
          right: 10px;
          bottom: 5px;
          font-size: 12px;
          line-height: 16px;
          color: var(--color-999999);
        }
      }
    }
    .card-quantity-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 13px;
      line-height: 18px;
      text-transform: uppercase;
      .card-number {
        margin-left: 10px;
        width: 88px;
        /deep/ .num-select {
          width: 88px;
        }
      }
      .tips {
        margin-left: 10px;
      }
    }
    .card-date-box {
      .date-dec {
        font-family: @font-family-600;
      }
      .card-date-picker {
        display: flex;
        align-items: center;
        /deep/ .mx-datepicker {
          width: 365px;
          .mx-icon-calendar {
            display: inline-block;
            right: 16px;
            font-size: 16px;
          }
          .mx-input {
            box-shadow: none;
          }
          input {
            width: 365px;
            height: 40px;
            line-height: 40px;
            border-radius: 0;
            padding-left: 10px;
            border: 1px solid var(--color-cccccc);
          }
        }
        .tips {
          margin-left: 10px;
          font-size: 13px;
          line-height: 18px;
        }
      }
    }
    .card-notice-box {
      cursor: pointer;
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      input[type='checkbox'] {
        width: 13px;
        height: 13px;
        margin-right: 9px;
        margin-top: 2px;
        border-radius: 0;
        vertical-align: middle;
        &::before {
          border: 1px solid var(--color-cccccc);
        }
      }
      .notice-desc {
        font-size: 13px;
        line-height: 18px;
        color: var(--color-121212);
        display: inline-block;
        /deep/ a {
          color: @theme;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
  .add-to-bag-block {
    position: relative;
    display: flex;
    justify-content: space-between;
    .buy-now-btn {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      line-height: 50px;
      font-family: @font-family-600;
    }

    #add-to-bag {
      // width: 80%;
      flex: 2;
      // max-width: 285px;
      padding: 13px 10px;
      margin-top: 24px;
      height: 50px;
      font-family: @font-family-600;
      box-sizing: border-box;
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      line-height: 25px;
      &:hover {
        background-color: var(--color-1e1e1e) !important;
      }
      .az-icon {
        height: 15px;
        width: 20px;
        margin-right: 8px;
        fill: currentColor;
      }
    }
    #buy-now {
      // width: 80%;
      // max-width: 285px;
      flex: 1;
      padding: 12px 10px;
      margin-top: 24px;
      height: 50px;
      margin-left: 10px;
      font-family: @font-family-600;
      box-sizing: border-box;
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      line-height: 25px;
      border: 1px solid @theme;
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
  }

  // 去掉加购弹窗里面的左右轮播按钮
  /deep/ .add-cart-dialog {
    .prev-arraw,
    .next-arraw {
      display: block;
      cursor: pointer;
      background-image: none;
      width: auto;
      height: auto;
      &.swiper-button-disabled {
        cursor: default;
      }
      &:focus {
        outline: none;
      }
    }
  }
}
</style>
