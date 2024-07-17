<template>
  <div id="selling_point" v-if="showSellingPoint" :class="{ us_wd: country == 'US' && freePannier }">
    <div class="line_box">
      <div v-if="isFreeFacemask || freePannier || addToCartOnly || isGarmentBags" class="has_img_icon has_img_icon">
        <div v-if="isFreeFacemask" class="free_pannier selling_point_item">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/d7/ed/c0dd5b5147dc9b4e4589216919add7ed.png')"
            alt="free pannier"
          />
          <span @click="showPopupFaceMask">{{ giftInfo.free_face_mask.freeFaceMaskDes }}</span>
        </div>
        <div v-if="freePannier" class="free_pannier selling_point_item">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/c1/0c/a03cba6ae43726f98666da1a67f9c10c.jpg')"
            alt="free
          pannier"
          />
          <span @click="showPopupPannier">{{ giftInfo.pannier.freePannierDes }}</span>
        </div>
        <div v-if="isGarmentBags" @click="showPopupGarmentBag" class="free_garment selling_point_item">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/7b/62/30ca179d9084e1a8d2fcaa4bf2247b62.jpg')"
            alt="free pannier"
          />
          <span>{{ giftInfo.garment_bag_gift.garmentBagsDes }}</span>
        </div>
        <div v-if="addToCartOnly" class="add_to_cart_only selling_point_item">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/c3/e4/aca02ed595d8ca4fae5495ef4029c3e4.jpg')"
            alt="add to cart only"
          />
          <span @click="showPopupAddToCartOnly">{{ nl(addToBagText) }}</span>
        </div>
      </div>
      <div class="line_box">
        <div v-if="freeCustomSize" class="selling_point_item">
          <az-icon class="selling_point_icon" icon-class="icon-all_tick" />
          <span>{{ nl('page_product_selling_point_free_custom_size') }}</span>
        </div>
        <div v-if="freeShipping" class="selling_point_item">
          <az-icon class="selling_point_icon" icon-class="icon-all_tick" />
          <span>{{ nl('page_details_free_shipping') }}</span>
          <div v-if="showFreeShippingTips" @mouseenter="handlePopupFreeShipping()" @mouseleave="handlePopupFreeShipping()" class="after">
            <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
            <div :class="[{ hide: !popupFreeShipping }]" class="introduce-hover-content free-return-intro-pop">
              <p v-if="baseInfo.isThresholdFreeShipping">
                {{ nl('page_product_selling_point_free_ship_tips_goods_' + country.toLowerCase()) }}
              </p>
              <p v-if="baseInfo.dressType === 'sample'">
                {{ nl('page_product_selling_point_free_ship_tips_samples') }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="readyToShip" class="selling_point_item">
          <az-icon class="selling_point_icon" icon-class="icon-all_tick" />
          <span>{{ nl('page_product_selling_point_ready_to_ship') }}</span>
          <span v-if="finalSale" class="final-sale">{{ nl('page_product_selling_point_final_text') }}</span>
        </div>
        <div v-if="freeReturns" class="selling_point_item">
          <az-icon class="selling_point_icon" icon-class="icon-all_tick" />
          <span v-if="['US', 'CA'].includes(country) && isSpecialCatId(catId)">{{ nl('page_product_selling_point_free_shipping') }}</span>
          <span v-else>{{ nl('page_product_selling_point_free_returns') }}</span>
          <div @mouseenter="handleFreeReturnIntro()" @mouseleave="handleFreeReturnIntro()" class="after">
            <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
            <div
              :class="[{ 'pop-hide': !popupFreeReturnTipShow, 'pop-reset': resetPosition }]"
              class="introduce-hover-content free-return-intro-pop return-pop"
            >
              <p>{{ nl(freeReturnText) }}</p>
            </div>
          </div>
        </div>
        <div v-if="makeTimeInfo.specialOfferTime" class="selling_point_item">
          <az-icon class="selling_point_icon" icon-class="icon-all_tick" />
          <span>{{ nl('page_product_selling_point_free_rush_production') }}</span>
          <div @mouseenter="handleFreeRushIntro()" @mouseleave="handleFreeRushIntro()" class="after">
            <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
            <div :class="[{ hide: !popupFreeRushTipShow }]" class="introduce-hover-content free-return-intro-pop">
              <p>
                {{ nl('page_product_selling_point_text1') }} {{ makeTimeInfo.specialOfferTime }},
                {{ nl('page_product_selling_point_text2') }} {{ processTime }}.
              </p>
            </div>
          </div>
        </div>
        <div v-if="isSevenDaysDelivery" class="selling_point_item">
          <az-icon class="selling_point_icon" icon-class="icon-all_tick" />
          <span>{{ nl('page_7_days_delivery') }}</span>
          <div @mouseenter="handlePopupShippingRush()" @mouseleave="handlePopupShippingRush()" class="after">
            <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
            <div :class="[{ hide: !popupShippingRush }]" class="introduce-hover-content free-return-intro-pop">
              <p>
                {{ nl('page_7_days_delivery_des') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productSellingPointMixin from './productSellingPointMixin'

export default {
  name: 'ProductSellingPoint',
  languageKeys: ['page_details_free_shipping', 'page_product_selling_point_free_rush_production', 'page_product_selling_point_final_text'],
  mixins: [productSellingPointMixin],
  data() {
    return {
      popupFreeReturnTipShow: false,
      popupFreeRushTipShow: false,
      popupShippingRush: false,
      resetPosition: false,
      popupFreeShipping: false
    }
  },
  watch: {
    popupFreeReturnTipShow: {
      handler(val) {
        if (process.client) {
          this.resetPosition = false
          const dom = document.querySelector('.free-return-intro-pop.return-pop')
          if (dom && dom.getBoundingClientRect().right >= 1843) {
            val && (this.resetPosition = true)
          }
        }
      }
    }
  },
  methods: {
    showPopupFaceMask() {
      this.setPoint('freefacemask', 'click')
      this.$store.commit('product/setPopupMaskShow', true)
    },
    showPopupPannier() {
      this.setPoint('freepannier', 'click')
      this.$store.commit('product/setPopupPannierShow', true)
    },
    showPopupGarmentBag() {
      this.$store.commit('product/setPopupGarmentBagShow', true)
    },
    showPopupAddToCartOnly() {
      this.setPoint('tapemeasure', 'click')
      this.$store.commit('product/setPopupAddToCartOnlyShow', true)
    },
    handleFreeReturnIntro() {
      if (!this.popupFreeReturnTipShow) {
        this.setPoint('freereturnspopup')
      }
      this.popupFreeReturnTipShow = !this.popupFreeReturnTipShow
    },
    handleFreeRushIntro() {
      if (!this.popupFreeRushTipShow) {
        this.setPoint('freerushpopup')
      }
      this.popupFreeRushTipShow = !this.popupFreeRushTipShow
    },
    handlePopupShippingRush() {
      this.popupShippingRush = !this.popupShippingRush
    },
    // 展示free shipping弹框内容
    handlePopupFreeShipping() {
      this.popupFreeShipping = !this.popupFreeShipping
    }
  }
}
</script>

<style lang="less" scoped>
#selling_point {
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 10px 10px 3px;
  margin-top: 15px;
  margin-bottom: 5px;
  line-height: 20px;
  background-color: @bg-color;
  .line_box {
    display: flex;
    -webkit-box-pack: center;
    justify-content: flex-start;
    -webkit-box-align: center;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .selling_point_item {
    display: inline-flex;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 7px;
    &:first-child {
      margin-left: 0;
    }
    .selling_point_icon {
      margin-right: 4px;
      border-radius: 50%;
    }
    .after {
      position: relative;
      display: inline-block;
      margin-left: 2px;
      cursor: pointer;
      .selling_point_icon {
        margin-right: 0px;
      }
    }
    .final-sale {
      color: @theme-color;
      margin-left: 5px;
    }
    .free-gift {
      cursor: pointer;
    }
  }
  .free_pannier,
  .add_to_cart_only,
  .free_garment {
    margin-right: 20px;
    font-family: @font-family-600;
    img {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
    span {
      cursor: pointer;
    }
  }
  .introduce-hover-content {
    position: absolute;
    z-index: 1;
    font-weight: initial;
    background: #fff;
    border: 1px solid var(--color-cccccc);
    border-radius: 3px;
    margin-top: 2px;
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
    &.free-return-intro-pop {
      width: 291px;
      padding: 10px;
      left: -150px;
      top: 24px;
    }
    &.pop-hide {
      visibility: hidden;
      z-index: -1;
    }
    &.pop-reset {
      left: unset;
      right: -20px;
      &::before,
      &::after {
        left: unset;
        right: 6%;
      }
    }
  }
  &.us_wd .introduce-hover-content {
    left: unset;
    right: -40px;
    &:before,
    &:after {
      left: 83.5%;
    }
  }
}
.selling_point_icon {
  fill: @theme-color;
}
.free_pannier,
.add_to_cart_only,
.free_garment {
  color: @theme-color;
}
@media screen and (max-width: 1368px) {
  #selling_point.us_wd .introduce-hover-content {
    left: -150px;
    right: unset;
    &:before,
    &:after {
      left: 48.4%;
    }
  }
}
</style>
