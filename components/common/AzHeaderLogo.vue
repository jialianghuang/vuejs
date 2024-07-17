<template>
  <div id="header-log" :class="{ 'is-support': isSupport, 'bridal-header-box': isBridal }" class="az-header-box az-header-box-b">
    <div class="one_line">
      <a
        v-if="isEnableForBridal"
        :href="isBridal ? countryUrl(`/`) : countryUrl(`/bridal?subsite=bridal`)"
        v-track.viewOnce.click="{ common: { ec: 'Entrance', el: isBridal ? 'Shopazazie' : 'Shopbridal' } }"
        class="left_container bridal-entry"
        ><az-icon :icon-class="isBridal ? 'icon-Frame' : 'icon-bridal1'" :class="isBridal ? 'bridesmaid-icon' : 'wedding-icon'"></az-icon>
        <span>{{ nl(isBridal ? 'page_bridal_entry_shop_azazie' : 'page_bridal_entry_shop_bridal') }}</span></a
      >
      <div :style="{ right: isSupport && positionRight ? positionRight : '' }" class="right_container right_container_bd">
        <az-header-search
          ref="headerSearch"
          @focusEvent="countrySelectFlag = false"
          :isSupport="isSupport"
          position="right"
        ></az-header-search>
        <div class="account_operation">
          <div
            @mouseenter="showSignSubmenu(true)"
            @mouseleave="showSignSubmenu(false)"
            class="top_menu need_datalayer li"
            data-datalayer-category="Signin_Click"
            data-datalayer-label="Signin_Click"
          >
            <a id="ht-login" :href="!isLogin ? countryUrl(loginHref) : countryUrl(`/order/list`)" class="menu-hove-a" aria-label="user">
              <az-icon icon-class="icon-user"></az-icon>
            </a>
            <ul
              v-show="isLogin && signShowSubmenu"
              :class="[isLogin && signShowSubmenu ? 'animation-slideflex-enter-active' : 'animation-slideflex-leave-active']"
              class="submenu account_sub sign-submenu submenu-logined"
            >
              <div class="submenu_inner">
                <li class="username">
                  <span>{{ `${nl('page_nav_hi')}, ${userInfoName}` }}</span>
                </li>
                <li>
                  <a :href="countryUrl(`/account/my_profile`)" aria-label="My account menu">{{ nl('page_head_myaccount') }}</a>
                </li>
                <li v-if="storefrontStatus === 2 && storefrontCountryCode === country">
                  <a :href="countryUrl(`/user?my_storefront`)">{{ nl('page_menu_storefront') }}</a>
                </li>
                <li v-if="influencerStatus === 2 && influencerCountryCode === country">
                  <a :href="countryUrl(`/user?influencer`)">{{ nl('page_menu_influencer') }}</a>
                </li>
                <li>
                  <a @click="setBuryPoint('myorders')" :href="countryUrl(`/order/list`)">{{ nl('page_head_myorders') }}</a>
                </li>
                <li>
                  <a @click="setBuryPoint('mycoupons')" :href="countryUrl(`/user?my_coupons`)">
                    {{ nl('page_head_mycoupons') }}<sup v-if="showNewCouponRedDot" class="dot"></sup>
                  </a>
                </li>
                <li>
                  <a @click="logout" href="javascript:;">{{ nl('page_head_signout') }}</a>
                </li>
              </div>
            </ul>
            <ul
              v-show="!isLogin && signShowSubmenu"
              :class="[!isLogin && signShowSubmenu ? 'animation-slideflex-enter-active' : 'animation-slideflex-leave-active']"
              class="submenu account_sub sign-submenu"
            >
              <div class="submenu_inner">
                <div v-if="country == 'AU' || country == 'GB'" class="color-activity-info">
                  <p class="welcome">{{ nl('page_country_welcome') }}</p>
                  <p class="des">
                    <span>{{ nl('page_az_header_logo_text1') }}</span>
                    {{ nl('page_az_header_logo_text2') }}
                  </p>
                </div>
                <li>
                  <a :href="countryUrl(loginHref)">{{ nl('page_lp_app_sign_in') }}</a>
                </li>
                <li>
                  <a :href="countryUrl(signUpHref)">{{ nl('page_lp_app_sign_up') }}</a>
                </li>
                <li>
                  <a
                    :href="countryUrl(`/user/login?has_track=1`)"
                    class="not-login-track need_datalayer"
                    data-datalayer-category="PC_GuestCheckout"
                    data-datalayer-label="PC_TrackOrderTop_Click"
                    >{{ nl('page_common_track_your_order') }}</a
                  >
                </li>
              </div>
            </ul>
          </div>
          <div
            @mouseenter="$route.name === 'cart' ? (bagSubmenu = false) : (bagSubmenu = true)"
            @mouseleave="bagSubmenu = false"
            class="top_menu need_datalayer li"
            data-datalayer-category="ShoppingBag_Click"
            data-datalayer-label="ShoppingBag_Click"
          >
            <a id="ht-bag" :href="countryUrl(`/cart`)" class="menu-hove-a" aria-label="cart">
              <az-icon icon-class="icon-cart1"></az-icon>
              <div class="ht-bag-total">
                <span>{{ cartInfo.totalCount }}</span>
              </div>
            </a>
            <client-only>
              <ul
                v-show="showBagBox"
                :class="[showBagBox ? 'animation-slideflex-enter-active' : 'animation-slideflex-leave-active']"
                class="submenu popCart"
              >
                <div class="submenu_inner">
                  <!-- #18080: 免运费活动+阶梯活动 同时存在的时候，使用新的样式，在 activity-status-progress 组件内 -->
                  <div
                    v-if="
                      cartInfo.freeShippingProgress &&
                        cartInfo.freeShippingProgress.isShowProgressBar &&
                        (!cartInfo.activityInfo || !cartInfo.activityInfo.showProgress)
                    "
                    class="free-ship-progress-box"
                  >
                    <free-ship-progress :visible="showBagBox" :progress-data="cartInfo.freeShippingProgress"></free-ship-progress>
                  </div>
                  <div :class="{ 'has-activity': cartInfo.activityInfo && cartInfo.activityInfo.showProgress }" class="goods_scroll">
                    <div v-for="(prodItem, index) in cartInfo.prodList" :key="index">
                      <li class="goods_list">
                        <div class="left_img">
                          <a :href="navToDetails(prodItem)" :aria-label="prodItem.shownGoodsName" class="jump_to_product" target="_self">
                            <az-sticker
                              v-if="prodItem.stickers && Object.keys(prodItem.stickers).length"
                              :stickerInfo="prodItem.stickers"
                              :sticker-class="`product-item-icon-small`"
                              :goodsId="prodItem.goodsId"
                            ></az-sticker>
                            <img :src="addWebpSuffix(prodItem.imgUrl)" :alt="prodItem.shownGoodsName" />
                            <span v-if="prodItem.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
                          </a>
                        </div>
                        <div class="right_info">
                          <div class="goods_div">
                            <span class="goods_name">
                              <a
                                v-if="[1063984, 1063985].includes(prodItem.goodsId)"
                                :href="navToDetails(prodItem)"
                                class="jump_to_product"
                                target="_self"
                              >
                                Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE
                                {{ prodItem.goodsId === 1063984 ? nl('page_common_garment_bag') : nl('page_common_garment_bag_wd') }}
                              </a>
                              <a v-else :href="navToDetails(prodItem)" class="jump_to_product" target="_self">
                                {{ prodItem.shownGoodsName }}
                              </a>
                            </span>
                          </div>
                          <!-- gift card  -->
                          <template v-if="prodItem.isGiftCard && prodItem.giftCard">
                            <div v-if="prodItem.giftCard" class="color_div">
                              <span class="name">{{ nl('page_common_from') }}:</span>
                              <span class="value is-gift-card">{{ prodItem.giftCard.fromUser }}</span>
                            </div>
                            <div v-if="prodItem.giftCard" class="color_div">
                              <span class="name">{{ nl('page_gift_card_order_send_to') }}:</span>
                              <span class="value is-gift-card">{{
                                prodItem.giftCard.toUser ? prodItem.giftCard.toUser.join(',') : ''
                              }}</span>
                            </div>
                            <div class="qty_div">
                              <span class="name">{{ nl('page_common_qty') }}:</span>
                              <span class="qty_value value">{{ prodItem.giftCard.goodsNumber }}</span>
                            </div>
                          </template>

                          <template v-else>
                            <div v-if="prodItem.formatStyles && prodItem.formatStyles.color" class="color_div">
                              <span class="name">{{ nl('page_common_color') }}:</span>
                              <span class="color_value value">{{ prodItem.shownColor }}</span>
                            </div>
                            <div v-if="prodItem.formatStyles && prodItem.formatStyles.size" class="size_div">{{ size(prodItem) }}</div>
                            <!-- 配件定制 -->
                            <div v-if="prodItem.styles && prodItem.styles.customNameList" class="customization_div">
                              <p v-if="prodItem.styles.customNameList.line1">
                                {{ nl('page_common_line_one') }}: {{ prodItem.styles.customNameList.line1 }}
                              </p>
                              <p v-if="prodItem.styles.customNameList.line2">
                                {{ nl('page_common_line_two') }}: {{ prodItem.styles.customNameList.line2 }}
                              </p>
                            </div>
                            <div class="qty_div">
                              <span class="name">{{ nl('page_common_qty') }}:</span>
                              <span class="qty_value value">{{ prodItem.goodsNumber }}</span>
                            </div>
                          </template>

                          <div class="price">
                            <template v-if="prodItem.hasActivityLinePrice">
                              <div class="goods-price goods-price-box">
                                <span class="current-price">{{ prodItem.shopPriceWithOutBonusDisplay }}</span>
                                <span class="no-deal-price">{{ prodItem.noDealPriceDisplay }}</span>
                              </div>
                            </template>
                            <template v-else>
                              <div class="goods-price">
                                {{ prodItem.shopPriceWithOutBonusDisplay }}
                              </div>
                            </template>
                          </div>
                          <div v-if="!prodItem.isGift" class="delete_rec">
                            <span @click="cartRemove(prodItem)" role="button" tabindex="0" aria-label="remove" class="remove"></span>
                          </div>
                        </div>
                      </li>
                    </div>
                  </div>
                  <div class="total-box">
                    <div class="total">
                      <span class="total-subtotal">{{ nl('page_common_subtotal') }}:</span>
                      <span v-if="cartInfo.hasLineTotal" class="line-total-box">
                        <span class="current-total">{{ cartInfo.totalPrice }}</span>
                        <span class="line-total">{{ cartInfo.totalNoDealPrice }}</span>
                      </span>
                      <span v-else class="total_value">{{ cartInfo.totalPrice }}</span>
                    </div>
                  </div>
                  <div v-if="cartInfo.activityInfo && cartInfo.activityInfo.showProgress" class="pop-activity-status-progress-box">
                    <activity-status-progress
                      :activityCartInfo="cartInfo.activityInfo"
                      :freeShippingProgress="cartInfo.freeShippingProgress"
                      :from="'cart-pop'"
                      :visible="showBagBox"
                    ></activity-status-progress>
                  </div>
                  <li class="go_to_cart">
                    <div :class="['view_button', { view_button_fr: country === 'FR' }]">
                      <a :href="countryUrl(`/cart`)" class="to_cart" target="_self">
                        <az-icon class="icon" icon-class="icon-xxy_add_to_bag" />
                        <span class="txt">{{ nl('page_common_view_bag') }}</span>
                      </a>
                      <span @click="buyNowClick" role="button" tabindex="0" class="to_checkout" target="_self">
                        <az-icon v-if="isBridal" icon-class="iconicon_buy_now-bridal" class="icon" />
                        <span class="txt">{{ nl('page_common_buy_now') }}</span>
                      </span>
                    </div>
                  </li>
                </div>
              </ul>
            </client-only>
          </div>
          <div
            @mouseenter="showroomSubmenu = true"
            @mouseleave="showroomSubmenu = false"
            class="ht-fav-wrapper top_menu need_datalayer li"
            data-datalayer-category="Showroom_Click"
            data-datalayer-label="Showroom_Click"
          >
            <a
              id="ht-fav"
              @click="showroomClick"
              role="button"
              href="javascript:;"
              class="signToRedirect menu-hove-a"
              aria-label="showroom"
            >
              <az-icon icon-class="icon-showroom2"></az-icon>
            </a>
            <div v-show="showroomShowFlag" class="msg_bubble">
              <em></em>
              <p>{{ nl('page_msg_buble_style') }}</p>
            </div>
            <ul
              v-show="isLogin && showroomSubmenu && showRoom && showRoom.length"
              :class="[
                isLogin && showroomSubmenu && showRoom && showRoom.length
                  ? 'animation-slideflex-enter-active'
                  : 'animation-slideflex-leave-active'
              ]"
              class="submenu showroom_sub"
            >
              <div class="submenu_inner">
                <template v-if="showRoom.length">
                  <li v-for="showroomItem in showRoom" :key="showroomItem.showroomId">
                    <a :href="countryUrl(`/showroom/${showroomItem.showroomIdDisplay}`)">
                      <span class="showroom_name">{{ showroomItem.roomName | filtRoomName }}</span>
                      <span>{{ nl('page_showroom_owner_showroom') }}</span>
                    </a>
                  </li>
                </template>
                <template v-if="!noMoreShowRoom">
                  <li>
                    <a @click="createShowroom" tabindex="0" role="button" class="create-new-showroom" style="cursor:pointer">{{
                      nl('page_head_create_showroom')
                    }}</a>
                  </li>
                </template>
              </div>
            </ul>
          </div>
          <div
            id="select_country_block"
            v-if="!isSupport"
            @mouseenter="changeCountrySelectFlag(true)"
            @mouseleave="changeCountrySelectFlag(false)"
            class="top_menu need_datalayer li"
          >
            <a href="javascript:;" class="menu-hove-a" aria-label="country">
              <az-icon class="menu-icon-country" icon-class="icon-country1"></az-icon>
            </a>
            <country-menu :show="countrySelectFlag" style="padding-top: 10px;"></country-menu>
          </div>
        </div>
      </div>
      <div class="header-logo">
        <a
          v-if="isBridal"
          :href="countryUrl(`/bridal?subsite=bridal`)"
          v-track.viewOnce.click="{ common: { ec: 'Logo', el: 'Azaziebridal' } }"
          aria-label="bridal logo"
        >
          <!-- <i class="azazie-logo small-logo"></i>
          <az-icon icon-class="bridal-logo" class="bridal-logo"></az-icon> -->
          <img :src="require('~/assets/images/AZ-Bridal-logo.svg')" alt="bridal-logo" />
        </a>
        <a v-else :href="countryUrl(`/`)" aria-label="header logo">
          <span style="display: none">header-logo</span>
          <img :src="require('~/assets/images/common/azazie_logo.svg')" alt="azazie-logo" class="azazie-logo" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// import AzWithCode from '@/components/az-ui/AzWithCode'
import FreeShipProgress from '@/components/cart/FreeShipProgress'
import { mapState } from 'vuex'
import ActivityStatusProgress from '@/components/cart/ActivityStatusProgress'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import CountryMenu from './CountryMenu'
import AzHeaderSearch from './AzHeaderSearch'
import signRoomBagMixins from './../../assets/js/signRoomBagMixins'

export default {
  name: 'AzHeaderLogo',
  languageKeys: [
    'page_bridal_entry_shop_azazie',
    'page_nav_hi',
    'page_bridal_entry_shop_bridal',
    'page_common_country',
    'page_common_country_region',
    'page_common_currency',
    'page_common_language',
    'page_head_myaccount',
    'page_head_myorders',
    'page_head_mycoupons',
    'page_head_signout',
    'page_country_welcome',
    'page_az_header_logo_text1',
    'page_az_header_logo_text2',
    'page_lp_app_sign_in',
    'page_lp_app_sign_up',
    'page_common_track_your_order',
    'page_msg_buble_style',
    'page_head_create_showroom',
    'page_common_line_one',
    'page_common_subtotal',
    'page_common_view_bag',
    'page_showroom_owner_showroom',
    'page_common_my_showroom',
    'page_common_qty',
    'page_common_color',
    'page_common_buy_now',
    'page_sod_copupon_hibeauty_desc',
    'page_menu_storefront',
    'page_menu_influencer',
    'page_common_garment_bag',
    'page_common_garment_bag_wd',
    // ...AzWithCode.languageKeys,
    ...AzHeaderSearch.languageKeys,
    ...CountryMenu.languageKeys,
    ...FreeShipProgress.languageKeys,
    ...ActivityStatusProgress.languageKeys,
    ...AzSticker.languageKeys
  ],
  components: {
    AzHeaderSearch,
    // AzWithCode,
    CountryMenu,
    FreeShipProgress,
    ActivityStatusProgress,
    AzSticker
  },
  filters: {
    /* 过滤roomName名称显示格式 */
    filtRoomName(e) {
      let res = e
      // 页面中视图显示位置最多显示7位，如果roomName大于7位，就要做格式过滤处理
      if (e.length > 7) {
        // 格式:abcd...(1),abcdef...
        // 先判断字符串中有没有（），如果有格式第一种，如果没有格式第二种
        const reg = /\(|\)/g // 正则校验字符串中是否有括号
        if (reg.test(res)) {
          res = res.substring(0, 4) + '...' + res.substring(res.length - 3, res.length)
        } else {
          res = res.substring(0, 6) + '...'
        }
      }
      return res
    }
  },
  mixins: [signRoomBagMixins],
  props: {
    isSupport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      countrySelectFlag: false,
      loginHref: '', // 登录路径地址
      signUpHref: '', // 注册路径地址
      countrySelectShow: false // 国家选择是否展开
    }
  },
  computed: {
    ...mapState({
      isEnableForBridal: (state) => state.isEnableForBridal,
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    ...mapState('userInfo', [
      'newCouponList',
      'newCouponRedPointClick',
      'influencerStatus',
      'influencerCountryCode',
      'storefrontStatus',
      'storefrontCountryCode'
    ]),
    size() {
      return (item) => {
        if (item.formatStyles && item.formatStyles.size) {
          if (item.formatStyles.size.CustomSize) {
            return item.formatStyles.size.CustomSize.name
          } else if (item.formatStyles.size.standardSize) {
            return this.nl('page_common_size') + ': ' + item.formatStyles.size.standardSize.shownName
          }
        }
        return ''
      }
    },
    showBagBox({ bagSubmenu, topCartListShow, cartInfo }) {
      // AzHeaderNav组件中也有个类似的弹框显示，不能同时出现，所以这里
      const flag = (bagSubmenu || topCartListShow) && cartInfo.totalCount > 0
      return flag
    },
    // 是否展示优惠券红点
    showNewCouponRedDot() {
      // 券列表有数据，并且没有点击过红点
      return this.newCouponList && this.newCouponList.length && !this.newCouponRedPointClick
    }
  },
  mounted() {
    const loginUrl = '/user/login'
    this.loginHref = loginUrl // 设置登录地址
    this.signUpHref = loginUrl + '?is_sign_up' // 设置注册地址
    // 拿到当前url地址的所有参数
    const url = this.$route.query
    /*
      无论什么场景下，进入到登录注册页，如果url中有back，带上即可
      判断当前地址路径中是否有back参数，如果有，说明是从其他场景过来，已经进入/user/login路径下，
      因为登录注册页存在用户来回点击的情况，所以拿back参数直接拼接loginHref和signUpHref
      如果没有back，说明是直接进入到/user/login目录下，无需关心参数处理
    */
    if (url.back) {
      this.loginHref += '?back=' + url.back
      this.signUpHref += '&back=' + url.back
    }
    // 如果jsKey不是login，说明不在登录注册页，此时sign in和sign up的跳转路径上，应该带上当前页面路径
    // 并且当前路径中不能有originUrl，否则拼上back，进入登录注册页会有URI malformed错误
    // originUrl参数主要出现在404，sale_down页面
    if (this.jsKey !== 'login' && !url.originUrl) {
      this.loginHref = `${loginUrl}?back=${encodeURIComponent(location.href)}`
      this.signUpHref = `${loginUrl}?is_sign_up&back=${encodeURIComponent(location.href)}`
    }
    if (this.isSupport) this.loginHref = `/user/login` // ???
    if (this.$cookie.getCookie('select_country_block')) {
      const sampleSource = this.$cookie.getCookie('select_country_block')
      if (sampleSource == 'CA') {
        if (this.dressType == 'samples') {
          this.setDataLayer({
            action: 'click',
            category: 'CountryPage_Session',
            label: 'CA_SampleCountryPage_Session'
          })
          if (this.jsKey == 'v6_category') {
            this.setDataLayer({
              action: 'click',
              category: 'CountryPage_Session',
              label: 'CASample_Listpage_sessions'
            })
          } else if (this.jsKey == 'product') {
            this.setDataLayer({
              action: 'click',
              category: 'CountryPage_Session',
              label: 'CASample_Detailpage_sessions'
            })
          }
        } else {
          this.setDataLayer({
            action: 'click',
            category: 'CountryPage_Session',
            label: 'CA_AllCountryPage_Session'
          })
        }
      } else if (this.dressType == 'samples') {
        this.setDataLayer({
          action: 'click',
          category: 'CountryPage_Session',
          label: 'US_SampleCountryPage_Session'
        })
      } else {
        this.setDataLayer({
          action: 'click',
          category: 'CountryPage_Session',
          label: 'US_AllCountryPage_Session'
        })
      }
    }
    document.documentElement.addEventListener('click', () => {
      this.countrySelectFlag = false
    })
    // 搜索框展示打点
    this.$nextTick(() => {
      this.buryPoint(this, 'event', {
        ec: 'search',
        el: 'bar',
        ea: 'view'
      })
    })
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
    showSignSubmenu(show) {
      if (!this.isLogin) {
        this.setDataLayer({
          action: 'view',
          category: 'PC_GuestCheckout',
          label: 'PC_TrackOrderTop_View'
        })
      }
      this.signShowSubmenu = show
    },
    changeCountrySelectFlag(flag) {
      this.countrySelectFlag = flag
    },
    buyNowClick() {
      // ga4打点
      this.setGA4DataLayer({
        event: 'ga4Event',
        event_name: 'checkout',
        event_parameters: {
          button_name: 'Buy Now'
        }
      })
      window.location.href = this.countryUrl('/checkout')
    },
    setBuryPoint(type) {
      if (type === 'mycoupons' && this.showNewCouponRedDot) {
        const postData = {
          viewType: 'new_coupon_red_point' // 新券弹窗new_coupon_pop ，红点new_coupon_red_point
        }
        // 优惠券弹框关闭和红点点击记录接口
        this.$axios
          .$post('/1.0/coupon-pop/add-view-record', postData)
          .then((res) => {
            if (res) {
              this.$store.commit('userInfo/setNewCouponRedPointClick', true)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
      this.buryPoint(this, 'event', {
        ec: 'navbar',
        el: type,
        ea: 'click'
      })
    },
    getParams() {
      const msg = {
        attr2: this.$route.name
      }
      const common = {
        ec: this.isLogin ? 'sodcouponhoverlogin' : 'sodcouponhover',
        el: this.isLogin ? 'sodcouponhoverlogin' : 'sodcouponhover',
        msg: JSON.stringify(msg)
      }
      return {
        id: '',
        common
      }
    }
  }
}
</script>

<style lang="less" scoped>
.az-header-box {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 32px 37px 13px 30px;
  z-index: 10;
  &.bridal-header-box {
    // padding: 18px 30px !important;
    padding: 20px 30px 11px !important;
  }
  &.is-support {
    .sign-submenu,
    .showroom_sub,
    .popCart {
      display: none !important;
      z-index: @z-index-5;
    }
  }
  .one_line {
    position: relative;
    .left_container,
    .right_container {
      position: absolute;
      top: 1px;
    }
    .bridal-entry {
      display: flex;
      align-items: center;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-family: @font-family-600;
      font-size: 14px;
      color: var(--color-121212);
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      line-height: 28px;
      .az-icon {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
      .wedding-icon {
        height: 18px;
        width: 18px;
      }
    }
    .right_container {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      // top: 7px;
      display: flex;
      align-items: center;
    }
    .right_container_ac {
      .top_menu {
        margin-left: 15px !important;
        #ht-login::before {
          margin-right: 0;
        }
      }
      .header-search {
        float: left;
        position: relative;
        width: 200px;
        height: 28px;
        margin-left: 0;
        z-index: @z-index-5;
        .input_text {
          margin-top: 0px;
          width: 200px;
        }
        .search {
          top: 9px;
        }
      }
    }
  }
  .header-logo {
    display: flex;
    justify-content: center;
    margin: 0;
    a {
      display: flex;
      align-items: center;
    }
    .azazie-logo {
      display: block;
      width: 245px;
      height: 32px;
      margin: 0;
      // background: url(~assets/images/common/azazie_logo.svg) no-repeat;
      // background-size: contain;
    }
    .small-logo {
      width: 172.4px;
      height: 22.18px;
    }
    .bridal-logo {
      margin-left: 16px;
      width: 130.5px;
      height: 54px;
    }
  }
  #header-nav.header-nav-us nav {
    display: flex;
    justify-content: space-between;
  }
  #select_country_block {
    float: left;
    .pc_idx_header_deliverLabel {
      display: inline-block;
      margin-right: 9px;
      font-size: 13px;
      font-family: @font-family-500, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .delivery_to {
      color: var(--color-121212);
      margin-right: 5px;
    }
    .select {
      display: inline-block;
      cursor: pointer;
      // width: 70px;
      height: 31px;
      .select_block {
        position: relative;
        width: 100%;
        height: 31px;
        line-height: 31px;
        box-sizing: border-box;
        .icon-country {
          width: 20px;
          height: 14px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 5px;
        }
        .select-country {
          display: flex;
          align-items: center;
          em {
            width: 1px;
            height: 13px;
            margin: 0 8px;
            background: #666;
            display: block;
          }
          span {
            text-transform: uppercase;
          }
          &:hover {
            color: @theme-color;
          }
        }
        .select_title-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 10px;
          width: 10px;
          height: 10px;
        }
      }
      .select_list {
        background: #ffffff;
        border: 1px solid #e1e1e1;
        position: absolute;
        z-index: 1;
        box-sizing: border-box;
        width: 175px;
        .select_item {
          height: 31px;
          line-height: 29px;
          padding-left: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          .icon-country {
            width: 20px;
            height: 14px;
            margin-right: 5px;
          }
          &:hover {
            background: #f5f5f5;
          }
        }
      }
    }
    .select-A {
      width: 175px;
      border: 1px solid rgba(225, 225, 225, 1);
    }
  }
  .account_operation {
    display: flex;
    align-items: center;
    .dropdown {
      position: relative;
    }
    .li {
      float: left;
      position: relative;
      .msg_bubble {
        background-color: @a-color;
        opacity: 0.8;
        border-radius: 4px;
        position: absolute;
        width: 192px;
        right: -20px;
        top: 30px;
        em {
          position: absolute;
          top: -6px;
          left: 90px;
          width: 13px;
          height: 8px;
          background: url(~assets/images/seo_sprite_20190129.png?5770949) no-repeat;
          background-position: -577px -33px;
          display: block;
          border-left: 0px;
        }
        p {
          line-height: normal;
          text-align: center;
          font-size: 13px;
          color: #ffffff;
          font-family: @font-family-500, sans-serif;
          padding: 12px;
        }
      }
      #ht-login,
      #ht-login-fixed {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          max-width: 94px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      #ht-bag,
      #ht-bag-fixed {
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .ht-bag-total {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: var(--color-121212);
          text-align: center;
          line-height: 14px;
          position: absolute;
          top: 8px;
          left: 11px;
          span {
            color: #fff;
            font-size: 12px;
            font-family: @font-family-500;
            transform: scale(0.8);
            letter-spacing: -1px;
            display: block;
          }
        }
      }
      a {
        color: #101010;
      }
      a:hover {
        color: @theme-color;
      }
    }
    .top_menu {
      margin-left: 20px;
      cursor: pointer;
      position: relative;
      &:hover::after {
        position: absolute;
        bottom: -12px;
        right: 0px;
        content: '';
        width: 100%;
        height: 3px;
        background-color: var(--color-121212);
        z-index: @z-index-6;
      }
    }
    .ht-fav-wrapper {
      display: flex;
      position: relative;
      align-items: center;
      .signToRedirect {
        display: flex;
        align-items: center;
        img {
          width: 18px;
          height: 17px;
          margin-right: 8px;
        }
      }
    }
    #ht-store {
      display: flex;
      position: relative;
      &:before {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 8px;
        background: url(~assets/images/common/location.svg) no-repeat;
        background-size: contain;
        content: '';
      }
    }
    .submenu {
      color: #101010;
      position: absolute;
      left: 0;
      top: 18px;
      text-align: left;
      padding-top: 10px;
      .submenu_inner {
        border: 1px solid #ccc;
        background: #fff;
        .username {
          max-width: 198px;
          font-style: italic;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #666;
          cursor: default;
          span {
            padding-right: 1px;
          }
        }
        .dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: @theme-color;
        }
      }
      &.sign-submenu {
        width: auto;
        left: 0;
        z-index: @z-index-5;
        .submenu_inner {
          padding: 15px 20px;
          .color-activity-info {
            font-size: 12px;
            color: #666;
            width: 198px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
            margin-bottom: 15px;
            .welcome {
              font-weight: 600;
              margin-bottom: 5px;
            }
            .des {
              font-weight: normal;
              span {
                color: @theme-color;
              }
            }
          }
        }
        li:not(:first-of-type) {
          margin-top: 10px;
        }
      }
      &.showroom_sub {
        width: auto;
        z-index: @z-index-5;
        right: -48px;
        .submenu_inner {
          padding: 15px 20px;
        }
        li:not(:first-of-type) {
          margin-top: 10px;
        }
        .showroom_name {
          display: inline-block;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: bottom;
        }
      }
      li {
        // padding: 6px 0 6px 25px;
        // width: 111px;
        float: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }
      a {
        .text-link(@gray);
        background: #fff;
        padding: 0;
        height: auto;
      }
      .cart_special {
        border: 1px solid var(--color-cccccc);
        li {
          border: none;
        }
      }
      &.popCart {
        width: 349px;
        z-index: @z-index-5;
        left: auto;
        right: -86px;
        .free-ship-progress-box {
          margin: 15px 15px 0px;
          border-bottom: 1px solid #ccc;
        }
        .total {
          margin: 0px 15px;
          padding: 12px 0px 11px;
          text-transform: uppercase;
          font-size: 16px;
          color: var(--color-121212);
          font-family: @font-family-600;
          border-bottom: 1px solid #eee;
          text-align: center;
          height: 27px;
          line-height: normal;
          &-box {
            border-top: 1px solid #ccc;
          }
          .line-total-box {
            .current-total {
              font-size: 20px;
              color: @theme-color;
            }
            .line-total {
              color: #999;
              text-decoration: line-through;
            }
          }
          .sub-total {
            text-transform: uppercase;
          }
        }
        .pop-activity-status-progress-box {
          // border-top: 1px solid #ccc;
        }
        .goods_scroll {
          padding: 15px 15px 0;
          overflow: scroll;
          overflow-x: hidden;
          overflow-y: auto;
          max-height: 466px;
          box-sizing: border-box;
          &.has-activity {
            max-height: 386px;
          }
        }
        li {
          position: relative;
          display: flex;
          box-sizing: content-box;
          height: 125px;
          margin-bottom: 25px;
          padding: 0;
          box-sizing: border-box;
          .left_img {
            height: 100%;
            img {
              height: 125px;
              display: block;
            }
            .jump_to_product {
              position: relative;
              display: block;
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
          }
          .right_info {
            height: 100%;
            display: flex;
            flex-direction: column;
            margin-left: 15px;
            .goods_div {
              padding-bottom: 5px;
              display: flex;
              width: 180px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              .goods_name {
                width: 100% !important;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 13px;
                font-family: @font-family-600;
              }
              .barbie-heart {
                fill: #de1c85;
                transform: scale(0.5);
              }
              span a {
                font-size: 13px;
                font-family: @font-family-600;
                color: var(--color-121212);
                line-height: 12px;
              }
            }
            .name,
            .value:not('.is-gift-card') {
              text-transform: capitalize;
            }
            .color_div {
              width: 180px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .qty_div {
              width: 180px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .price {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              margin-top: 10px;
              .goods-price-box {
                .current-price {
                  color: @theme-color;
                  font-size: 16px;
                  font-family: @font-family-600;
                }
                .no-deal-price {
                  font-size: 13px;
                  font-family: @font-family-500;
                  color: #999;
                  text-decoration: line-through;
                  margin-left: 3px;
                }
              }
              .goods-price {
                font-size: 13px;
                color: var(--color-121212);
                font-family: @font-family-600;
                display: flex;
                align-items: center;
                /deep/ .exclusive-offer {
                  margin-left: 5px;
                }
              }
              .coupon-box {
                display: flex;
                align-items: center;
                margin-top: 4px;
                column-gap: 5px;
                .sod-question-tip {
                  position: relative;
                  &:hover {
                    .sod-question-tip-text {
                      display: block;
                    }
                  }
                  .sod-question-tip-text {
                    display: none;
                    position: absolute;
                    right: -20px;
                    bottom: 30px;
                    width: 280px;
                    padding: 10px;
                    box-sizing: border-box;
                    background-color: #fff;
                    font-size: 12px;
                    box-shadow: 0 0 2px 1px #d9d9d9;
                    &:before {
                      content: '';
                      width: 0;
                      height: 0;
                      border: 8px solid transparent;
                      border-top-color: #d9d9d9;
                      position: absolute;
                      bottom: -17px;
                      right: 11px;
                      transform: translate(-50%, 0);
                    }
                    &:after {
                      content: '';
                      width: 0;
                      height: 0;
                      border: 8px solid transparent;
                      border-top-color: #fff;
                      position: absolute;
                      bottom: -15px;
                      right: 11px;
                      transform: translate(-50%, 0);
                    }
                    span {
                      line-height: unset;
                      white-space: pre-wrap;
                    }
                  }
                }
              }
            }
            .delete_rec {
              position: absolute;
              top: 10px;
              right: 0;
              .remove {
                cursor: pointer;
                display: block;
                width: 14px;
                height: 14px;
                background: url(~assets/images/common/icon_delete.png);
                background-size: contain;
              }
            }
          }
          &.go_to_cart {
            display: block;
            text-align: center;
            height: auto;
            margin: 0 15px;
            padding: 10px 0 15px;
            box-sizing: border-box;
            .view_button {
              cursor: pointer;
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .to_cart,
              .to_checkout {
                display: block;
                width: 155px;
                text-transform: uppercase;
                font-size: 14px;
                font-family: @font-family-600;
                box-sizing: border-box;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                .txt {
                  white-space: break-spaces;
                  line-height: 16px;
                  height: 100%;
                  display: inline-flex;
                  align-items: center;
                  max-width: calc(~'100% - 40px');
                }
              }
              .to_cart {
                background: @theme-color;
                color: #fff;
                .icon {
                  height: 15px;
                  width: 20px;
                  fill: currentColor;
                  margin-right: 5px;
                }
                &:hover {
                  background: @btn-hover-color;
                }
              }
              .to_checkout {
                border: 1px solid @theme-color;
                background: #fff;
                color: @theme-color;
                .icon {
                  height: 13px;
                  width: 18px;
                  fill: currentColor;
                  margin-right: 5px;
                }
                &:hover {
                  background: @bg-color;
                }
              }
              &.view_button_fr {
                flex-direction: column;
                .to_cart,
                .to_checkout {
                  width: calc(100% - 30px) !important;
                }
                .to_checkout {
                  margin-top: 10px !important;
                }
              }
            }
          }
        }
      }
    }
    .dropdown.over {
      z-index: 10;
      .submenu {
        display: block;
      }
    }
  }
  &.az-header-box-b {
    .account_operation {
      .submenu {
        left: auto;
        &.sign-submenu {
          left: auto;
          right: -60px;
        }
        &.submenu-logined {
          left: auto;
          right: -50px;
        }
      }
    }
  }
}
/deep/ .az-with-code-box {
  justify-content: flex-start !important;
}
.adaptive-box {
  @media screen and (max-width: 1262px) {
    .az-header-box {
      padding-left: 20px;
      padding-right: 20px;
      .account_operation {
        .li {
          #ht-login,
          #ht-login-fixed {
            span {
              max-width: 70px;
            }
          }
        }
        .top_menu:not(:first-child) {
          margin-left: 15px;
        }
      }
    }
  }
}
.menu-hove-a {
  position: relative;
  font-size: 18px;
  height: 18px;
  width: 18px;
  display: flex;
  .az-icon {
    fill: var(--color-121212);
  }
}
</style>
