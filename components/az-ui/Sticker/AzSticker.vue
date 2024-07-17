<template>
  <div :class="stickerClass" class="info-sticker">
    <template v-for="(item, index) in stickerInfo">
      <div
        v-if="showStick(item.name)"
        :key="index"
        :class="['sticker-icon', stickClassInfo[item.name], 'sticker_' + item.name, showShipInIcon ? item.location : '']"
      >
        <template v-if="item.name == 'soldOut'">
          <az-icon :icon-class="'icon-a-soldout-' + language" />
        </template>
        <template v-if="item.name == 'beBackSoon'">
          <az-icon :icon-class="'icon-a-bebacksoon-' + language" />
        </template>

        <div ref="offDec" v-if="item.name == 'coupon_off' && stickerClass != 'cart-product-item-icon'" class="prod-flash-sale-icon">
          <span class="off-dec">-{{ item.value }}</span>
        </div>
        <div ref="offDec" v-if="item.name == 'flashSale' && stickerClass != 'cart-product-item-icon'" class="prod-flash-sale-icon">
          <span class="off-dec">-{{ item.value }}</span>
        </div>
        <template v-if="item.name == 'time_limited'">
          <!-- jira:43204 AZ Bridal 列表页和详情页limited time sale标签样式更新 -->
          <div v-if="isBridal && ['list', 'product', 'bridesIntro'].includes(jsKey)">
            Exclusive Offer
          </div>
          <div ref="offDec" v-else class="prod-flash-sale-icon">
            <span class="off-dec">-{{ item.value }}</span>
          </div>
        </template>
        <template v-if="item.name == 'tryOn'">
          <az-icon :icon-class="isBridal ? 'icon-try-on-en-new' : 'icon-try-on-' + language" />
        </template>
        <!-- <template v-if="item.name == 'stretch'">
          <az-icon :icon-class="isBridal ? 'icon-Stretch-en-new' : 'icon-Stretch-' + language" />
        </template> -->
        <!-- <template v-if="item.name == 'newsatin'">
          <az-icon :icon-class="isBridal ? 'icon-Satin-en-new' : 'icon-Satin-' + language" />
        </template> -->
        <template v-if="item.name == 'convertible'">
          <az-icon :icon-class="isBridal ? 'icon-convertible-en-new' : 'icon-convertible-' + language" />
        </template>
        <template v-if="item.name == 'convertibleStretch'">
          <az-icon :icon-class="isBridal ? 'icon-a-stretchconvertible-en-new' : 'icon-a-stretchconvertible-' + language" />
        </template>
        <!-- <template v-if="item.name == 'twoPiece'">
          <az-icon :icon-class="isBridal ? 'icon-two-piece-en-new' : 'icon-two-piece-' + language" />
        </template> -->
        <template v-if="item.name == 'Made to Order 2 Weeks'">
          <az-icon :icon-class="'icon-a-madetoorder2weeks-' + language" />
        </template>
        <template v-if="item.name == 'Made to Order 3 Weeks'">
          <az-icon :icon-class="'icon-a-madetoorder3weeks-' + language" />
        </template>
        <template v-if="item.name == 'Made to Order 14 Days'">
          <az-icon :icon-class="isBridal ? 'icon-a-madetoorder14days-en-new' : 'icon-a-madetoorder14days-' + language" />
        </template>
        <template v-if="item.name == 'Made to Order 16 Days'">
          <az-icon :icon-class="'icon-a-madetoorder16days-' + language" />
        </template>
        <template v-if="item.name == 'Made to Order 17 Days'">
          <az-icon :icon-class="'icon-a-madetoorder17days-' + language" />
        </template>
        <template v-if="item.name == 'Made to Order 19 Days'">
          <az-icon :icon-class="'icon-a-madetoorder19days-' + language" />
        </template>
        <template v-if="item.name == 'Made to Order 23 Days'">
          <az-icon :icon-class="'icon-a-madetoorder23days-' + language" />
        </template>
        <template v-if="item.name == 'slimmingLuxeStretch'">
          <az-icon :icon-class="'icon-slimming_luxe_stretch-' + language" />
        </template>
        <template v-if="item.name == 'suitingStyleStretch'">
          <az-icon :icon-class="isBridal ? 'icon-suiting-style-en-new' : 'icon-suiting-style-' + language" />
        </template>
        <!-- <template v-if="item.name == 'matteSatinStretch'">
          <az-icon :icon-class="isBridal ? 'icon-matte-satin-en-new' : 'icon-matte-satin-' + language" />
        </template> -->
        <template v-if="item.name == 'isShortenedMakeTime14'">
          <az-icon :icon-class="isBridal ? 'icon-a-freerushmadein14days-en-new' : 'icon-a-freerushmadein14days-' + language" />
        </template>
        <template v-if="item.name == 'isShortenedMakeTime16'">
          <az-icon :icon-class="isBridal ? 'icon-a-freerushmadein16days-en-new' : 'icon-a-freerushmadein16days-' + language" />
        </template>
        <template v-if="item.name == 'isShortenedMakeTime17'">
          <az-icon :icon-class="isBridal ? 'icon-a-freerushmadein17days-en-new' : 'icon-a-freerushmadein17days-' + language" />
        </template>
        <template v-if="item.name == 'isShortenedMakeTime19'">
          <az-icon :icon-class="isBridal ? 'icon-a-freerushmadein19days-en-new' : 'icon-a-freerushmadein19days-' + language" />
        </template>
        <template v-if="item.name == 'isShortenedMakeTime23'">
          <az-icon :icon-class="isBridal ? 'icon-a-freerushmadein23days-en-new' : 'icon-a-freerushmadein23days-' + language" />
        </template>
        <az-icon v-if="item.name == 'isShortenedMakeTime37'" icon-class="free_rush_37" />
        <template v-if="item.name == 'mob_mix_match'">
          <az-icon :icon-class="isBridal ? 'icon-a-MixMatch-en-new' : 'icon-a-MixMatch-' + language" />
        </template>
        <!-- <template v-if="item.name == 'freePannier'">
          <az-icon :icon-class="'icon-a-freepannier-' + language" />
        </template> -->
        <template v-if="item.name == 'hot'">
          <az-icon :icon-class="isBridal ? 'icon-Hot-en-new' : 'icon-Hot-' + language" />
        </template>
        <template v-if="item.name == 'freeFaceMask'">
          <az-icon :icon-class="'icon-a-free_facemask-' + language" />
        </template>
        <template v-if="item.name == 'withoutInner'">
          <az-icon :icon-class="isBridal ? 'icon-a-WithoutInner-en-new' : 'icon-a-WithoutInner-' + language" />
        </template>
        <template v-if="showShipInIcon">
          <template v-if="item.location != 'below'">
            <template v-if="item.name == 'shipIn24Hours'">
              <az-icon :icon-class="isBridal ? 'icon-a-Shipsin24hrs-en-new' : 'icon-a-Shipsin24hrs-' + language" />
            </template>
            <template v-if="item.name == 'shipIn48Hours'">
              <az-icon :icon-class="isBridal ? 'icon-a-Shipsin48hrs-en-new' : 'icon-a-Shipsin48hrs-' + language" />
            </template>
            <template v-if="item.name == 'shipIn2Days'">
              <az-icon :icon-class="isBridal ? 'icon-a-Shipsin2days-en-new' : 'icon-a-Shipsin2days-' + language" />
            </template>
            <template v-if="item.name == 'shipIn3Days'">
              <az-icon :icon-class="isBridal ? 'icon-a-Shipsin3days-en-new' : 'icon-a-Shipsin3days-' + language" />
            </template>
            <az-icon v-if="item.name == 'shipIn4Days'" icon-class="icon-shipsin4days" />
            <template v-if="item.name == 'shipIn7Days' && !(!isCurrentStyleSupportStock && jsKey == 'product')">
              <az-icon :icon-class="isBridal ? 'icon-a-Shipsin7days-en-new' : 'icon-a-Shipsin7days-' + language" />
            </template>
          </template>
          <template v-else>
            <p>{{ nl(getShipInText(item.name)) }}</p>
          </template>
        </template>
        <template v-if="item.name == 'exclusive'">
          <az-icon :icon-class="'icon-a-OnlyAZAZIE-' + language" />
        </template>

        <p v-if="item.name == 'maternity'" class="lay_pic_text_detail">{{ nl('page_common_maternity') }}</p>
        <p v-if="item.name == 'modest'" class="lay_pic_text_detail">{{ nl('page_common_modest') }}</p>

        <az-icon v-if="item.name == 'zion'" icon-class="zion" />

        <template v-if="item.name == 'ktla'">
          <az-icon :icon-class="'icon-a-asseenonKTLA-' + language" />
        </template>
        <template v-if="item.name == 'inStock'">
          <az-icon :icon-class="isBridal ? 'icon-a-instock-en-new' : 'icon-a-instock-' + language" />
        </template>
        <template v-if="item.name == 'pninaTornai'">
          <az-icon :icon-class="'icon-pnina-tornai-' + language" />
        </template>
        <img v-if="item.name == 'assignedMe'" :src="require('~/assets/images/stickers/assigned_me.png')" alt="assignedMe" />
        <img
          v-if="item.name == 'platinum'"
          :src="replaceImgCdnUrl(nl('page_image_stickers_platinum_style'))"
          class="platinum"
          alt="platinum"
        />
        <template v-if="item.name == 'fabricLuxeKnit'">
          <az-icon :icon-class="'icon-a-LuxeKnit-' + language" />
        </template>
        <template v-if="item.name == 'kendallKylie'">
          <az-icon :icon-class="'icon-a-azaziexkk'" />
        </template>
        <template v-if="item.name == 'barbieAzazie'">
          <az-icon :icon-class="'icon-a-BarbieAZAZIE'" />
        </template>
        <div
          v-if="item.name == 'best_seller'"
          :class="{ first: productIndex === 0, second: productIndex === 1, third: productIndex === 2 }"
          class="medal"
        >
          <img
            v-if="productIndex === 0"
            class="medal-bg"
            src="https://cdn-1.azazie.com/upimg/userfiles/images/1/4b/02/20d1e57508527ea23c6eea6055664b02.png"
            alt="medal icon"
          />
          <img
            v-else-if="productIndex === 1"
            class="medal-bg"
            src="https://cdn-1.azazie.com/upimg/userfiles/images/1/bf/8d/1872f4c60d4a5faca386c8a2feb5bf8d.png"
            alt="medal icon"
          />
          <img
            v-else-if="productIndex === 2"
            class="medal-bg"
            src="https://cdn-1.azazie.com/upimg/userfiles/images/1/db/98/888a37ebb464a9f3511863962d2cdb98.png"
            alt="medal icon"
          />
          <img
            v-else
            class="medal-bg"
            src="https://cdn-1.azazie.com/upimg/userfiles/images/1/ee/5e/e8e863bb9e26740bffb5d8524aadee5e.png"
            alt="medal icon"
          />
          <span class="medal-num">{{ productIndex + 1 }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Sticker',
  languageKeys: [
    'page_common_maternity',
    'page_common_modest',
    'page_image_stickers_platinum_style',
    'page_ships_in_time_24',
    'page_ships_in_time',
    'page_ships_in_time_2_days',
    'page_ships_in_time_3_days',
    'page_ships_in_time_4_days',
    'page_ships_in_time_7_days'
  ],
  props: {
    stickerInfo: {
      type: Array,
      default() {
        return null
      }
    },
    /**
     * product-item-icon-small: small类型固定类型，比如将sticker置为18px大小
     * product-item-icon-mini: mini类型固定类名，比如将sticker置为14px大小
     */
    stickerClass: {
      type: String,
      default() {
        return ''
      }
    },
    goodsId: {
      type: Number,
      default() {
        return 0
      }
    },
    isGiftActivity: {
      type: Boolean,
      default: false
    },
    hideShipIcon: {
      type: Boolean,
      default: false
    },
    productIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      sampleDetailShow: true,
      classConfig: {
        'sticker-type-flashSale': ['coupon_off', 'time_limited', 'flashSale'],
        'sticker-type-soldOut': ['soldOut', 'beBackSoon', 'exclusive'],
        'sticker-type-stretch': [
          'shipIn24Hours',
          'shipIn48Hours',
          'shipIn2Days',
          'shipIn3Days',
          'shipIn4Days',
          'shipIn7Days',
          'withoutInner',
          'mob_mix_match',
          'stretch',
          'newsatin',
          'convertible',
          'convertibleStretch',
          'twoPiece',
          'Made to Order 3 Weeks',
          'Made to Order 2 Weeks',
          'Made to Order 17 Days',
          'Made to Order 14 Days',
          'Made to Order 16 Days',
          'Made to Order 19 Days',
          'Made to Order 23 Days',
          'slimmingLuxeStretch',
          'suitingStyleStretch',
          'matteSatinStretch',
          'isShortenedMakeTime37',
          'isShortenedMakeTime14',
          'isShortenedMakeTime16',
          'isShortenedMakeTime17',
          'isShortenedMakeTime19',
          'isShortenedMakeTime23',
          'platinum',
          'pninaTornai',
          'fabricLuxeKnit',
          'kendallKylie',
          'barbieAzazie'
        ],
        'sticker-type-hot': ['hot', 'freePannier', 'freeFaceMask'],
        'sticker-type-maternity': ['maternity', 'modest'],
        'sticker-type-zion': ['zion'],
        'sticker-type-ktla': ['ktla'],
        'sticker-type-inStock': ['inStock', 'tryOn'],
        'sticker-type-assignedMe': ['assignedMe']
      }
    }
  },
  computed: {
    ...mapState({
      isCurrentStyleSupportStock: (state) => state.product.isCurrentStyleSupportStock,
      isNormalStock: (state) => state.quickshop.isNormalStock,
      showQuickShopDialog: (state) => state.quickshop.showQuickShopDialog
    }),
    stickClassInfo({ classConfig, isBridal }) {
      const obj = {}
      const tempClassConfig = JSON.parse(JSON.stringify(classConfig))
      if (isBridal) {
        tempClassConfig['sticker-type-left-bottom'] = ['time_limited']
      }
      for (const k in tempClassConfig) {
        tempClassConfig[k].forEach((item) => (obj[item] = k))
      }
      return obj
    },
    showShipInIcon({ jsKey, isCurrentStyleSupportStock, showQuickShopDialog, isNormalStock, hideShipIcon }) {
      return (
        jsKey != 'showroom' &&
        !(!isCurrentStyleSupportStock && jsKey == 'product') &&
        !(jsKey == 'cart' && showQuickShopDialog && !isNormalStock) &&
        !hideShipIcon
      )
    }
  },
  mounted() {
    // 根据off-dec内的文本宽度，动态scale，解决内容文本过长超出容器的问题
    const dom = this.$refs.offDec && this.$refs.offDec[0]
    if (dom && dom.clientWidth > dom.parentElement.clientWidth) {
      dom.style.transform = 'translate(-50%, -50%) scale(' + (dom.parentElement.clientWidth / dom.clientWidth).toFixed(2) + ')'
    }
  },
  methods: {
    showStick(name) {
      // 如果是买赠活动的赠品，不展示除soldOut和 beBackSoon以外的其他sticker
      return !this.isGiftActivity || (this.isGiftActivity && ['soldOut', 'beBackSoon'].includes(name))
    },
    toggleSampleDetail() {
      this.sampleDetailShow = !this.sampleDetailShow
    },
    getShipInText(name) {
      const textObj = {
        shipIn24Hours: 'page_ships_in_time_24',
        shipIn48Hours: 'page_ships_in_time',
        shipIn2Days: 'page_ships_in_time_2_days',
        shipIn3Days: 'page_ships_in_time_3_days',
        shipIn4Days: 'page_ships_in_time_4_days',
        shipIn7Days: 'page_ships_in_time_7_days'
      }
      return textObj[name] || ''
    }
  }
}
</script>

<style lang="less" scoped>
.info-sticker {
  cursor: pointer;
  img {
    width: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
    fill: @theme-color;
  }
  .sticker-icon {
    position: absolute;
    width: 70px;
    height: 70px;
    top: 0;
    z-index: 1;
    &.sticker_pninaTornai {
      width: 98px;
      height: 98px;
      margin-left: 21px;
      svg {
        fill: var(--color-121212);
      }
    }
    &.sticker_kendallKylie {
      width: 30.6% !important;
      height: 8.3% !important;
      margin-top: 6.8% !important;
      margin-left: 4.1% !important;
      transform: scale(1) !important;
      svg {
        fill: var(--color-121212);
      }
    }
    &.sticker_barbieAzazie {
      margin-top: 2.8% !important;
      margin-left: 4.1% !important;
    }
    // &.top {
    //   top: 0;
    // }
    // &.topLeft {
    //   top: 10px;
    //   left: 10px;
    // }
    // &.topRight {
    //   top: 10px;
    //   right: 10px;
    // }
    // &.left {
    //   left: 10px;
    // }
    // &.right {
    //   right: 10px;
    // }
    // &.bottom {
    //   top: auto;
    //   bottom: 0;
    // }
    // &.bottomLeft {
    //   top: auto;
    //   bottom: 0;
    //   left: 0;
    // }
    // &.bottomRight {
    //   top: auto;
    //   bottom: 0;
    //   right: 0;
    // }
    &.below {
      top: auto;
      bottom: 0;
      width: 100% !important;
      height: 30px !important;
      background-color: #fde9e9;
      opacity: 0.9;
      font-size: 13px;
      font-family: @font-family-600;
      color: var(--color-121212);
      line-height: 30px;
      text-transform: uppercase;
      text-align: center;
      transform: scale(1) !important;
    }
  }
  .sticker-type-maternity {
    font-family: @font-family-600, sans-serif;
    font-size: 16px;
    color: #555;
    background-color: #e3e3e3;
    position: absolute;
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
    width: 60%;
    opacity: 0.6;
    height: 30px;
    margin: auto;
    transform-origin: center bottom;
    p {
      text-align: center;
      line-height: 30px;
      text-transform: uppercase;
    }
  }
  .sticker-type-flashSale,
  .sticker-type-soldOut {
    z-index: 2;
    height: 70px;
    top: 10px;
    left: 10px;
  }

  .sticker-type-flashSale {
    z-index: 2;
    top: 10px;
    left: 10px;
    background-color: @theme-color;
    border-radius: 50%;
    .prod-flash-sale-icon {
      position: absolute;
      font-size: 24px;
      color: #fff;
      line-height: 22px;
      text-align: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .off-dec {
        font-family: @font-family-600;
        white-space: nowrap;
      }
      .off-txt {
        transform: scale(0.6);
        display: inline-block;
      }
    }
  }

  .sticker-type-left-bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 110px;
    height: 28px;
    background: rgba(167, 176, 173, 0.9);
    color: #fff;
    top: auto;
    bottom: 30px;
    font-size: 13px;
    line-height: 18px;
  }

  .sticker-type-stretch {
    width: 102px;
    height: 102px;
  }
  .sticker-type-hot {
    left: 20px;
    top: -2px;
    width: 64px;
    height: 64px;
    z-index: 2;
  }

  @media screen and (max-width: 1440px) {
    .sticker-type-hot {
      width: 70px;
      height: 74px;
    }
  }

  .sticker-type-zion,
  .sticker-type-ktla {
    top: auto;
    bottom: 10px;
    right: 10px;
    transform-origin: right bottom;
  }
  .sticker-type-ktla {
    height: 49px;
  }

  .sticker-type-assignedMe {
    width: 32px;
    height: 42px;
    top: 9px;
    left: 9px;
    z-index: 2;
  }

  &.product-item-icon {
    .sticker-type-flashSale,
    .sticker-type-soldOut {
      top: 8px;
      left: 8px;
      width: 38px;
      height: 38px;
      .prod-flash-sale-icon {
        line-height: 12px;
        font-size: 14px;
      }
    }

    .sticker-type-stretch {
      width: 50px;
      height: 50px;
      &.sticker_pninaTornai,
      &.sticker_kendallKylie,
      &.sticker_barbieAzazie {
        margin-left: 10px;
      }
    }
    .sticker-type-hot {
      top: 0;
      left: 10px;
      width: 35px;
      height: 35px;
    }
  }

  /**列表大图模式 */
  &.cat-product-item-icon-larger {
    .sticker-type-flashSale,
    .sticker-type-soldOut {
      top: 10px;
      left: 20px;
      width: 45px;
      height: 45px;
      .prod-flash-sale-icon {
        line-height: 18px;
        font-size: 18px;
      }
    }
  }

  &.cat-product-item-icon-larger,
  &.cat-product-item-icon,
  &.showroom-goods-item-icon {
    .sticker-type-maternity {
      font-size: 13px;
      bottom: 0;
      width: 100%;
      opacity: 0.6;
      height: 30px;
      margin: auto;
    }

    .sticker-type-stretch {
      width: 80px;
      height: 80px;
    }
    .sticker-type-hot {
      left: 10px;
      top: 0;
      width: 50px;
      height: 50px;
    }

    .sticker-type-ktla {
      width: 55px;
      height: 38px;
      left: auto;
      top: auto;
      bottom: 10px;
      right: 10px;
    }

    .sticker-type-zion {
      width: 55px;
      height: 55px;
      top: auto;
      bottom: 10px;
      right: 10px;
    }
  }

  /**列表小图模式 */
  &.showroom-goods-item-icon,
  &.cat-product-item-icon {
    .sticker-type-flashSale,
    .sticker-type-soldOut {
      top: 10px;
      left: 20px;
      width: 45px;
      height: 45px;
      .prod-flash-sale-icon {
        line-height: 14px;
        font-size: 16px;
      }
    }
    .sticker_pninaTornai,
    .sticker_kendallKylie {
      width: 68px;
      height: 68px;
      margin-left: 10px;
    }
    .sticker_barbieAzazie {
      width: 60px;
      height: 60px;
    }
  }
  /** cart */
  &.cart-product-item-icon {
    .sticker-type-flashSale {
      background: transparent;
    }

    .sticker-type-stretch {
      width: 55px;
      height: 55px;
    }
    .sticker-type-inStock {
      width: 55px;
      height: 55px;
    }
    .sticker-type-hot {
      top: -3px;
      left: 12px;
      width: 38px;
      height: 38px;
    }
    .sticker_barbieAzazie {
      width: 22px;
      height: 22px;
    }
  }
  &.product-item-icon-small {
    .sticker_barbieAzazie {
      width: 18px;
      height: 18px;
    }
  }
  &.product-item-icon-mini {
    .sticker_barbieAzazie {
      width: 14px;
      height: 14px;
    }
  }
  /*flash sale*/
  &.flash-sale-item-icon {
    .sticker-type-flashSale,
    .sticker-type-soldOut {
      top: 10px;
      left: 10px;
      width: 45px;
      height: 45px;
      .prod-flash-sale-icon {
        line-height: 14px;
        font-size: 16px;
      }
    }
  }

  // prelaunch 商品
  &.prelaunch-item-icon {
    .sticker-icon {
      display: none; // prelaunch 商品在预售列表页不展示其他sticker
    }
    .sticker-type-flashSale {
      display: block;
      left: 0;
      top: 20px;
      color: #ffffff;
      font-family: @font-family-600;
      background: var(--color-121212);
      height: 35px;
      border-radius: 0;
      width: 76px;
      .prod-flash-sale-icon {
        font-size: 24px;
        line-height: 35px;
        color: #ffffff;
      }
    }
  }
  .medal {
    width: 54px;
    height: 54px;
    position: absolute;
    top: 0px;
    left: 3px;
    &-bg {
      width: 100%;
      height: 100%;
    }
    &-num {
      position: absolute;
      bottom: 7px;
      left: 0px;
      right: 0px;
      text-align: center;
      color: #666;
      font-size: 24px;
      font-family: @font-family-600;
      line-height: normal;
    }
    &.first {
      .medal-num {
        color: #a17725;
      }
    }
    &.second {
      .medal-num {
        color: #6c7783;
      }
    }
    &.third {
      .medal-num {
        color: #8e6350;
      }
    }
  }
}
</style>
<style lang="less">
.bridal-theme-b {
  .info-sticker {
    .sticker-type-left-bottom {
      background: rgba(100, 132, 121, 0.9);
    }
  }
}
</style>
