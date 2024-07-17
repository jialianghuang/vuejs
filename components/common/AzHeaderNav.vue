<template>
  <div @mouseleave="currentNav = ''" class="header-nav-dot">
    <div :class="[{ 'header-fixed': topNavFixed }, { 'header-activty-fixed': topNavFixed && barData.length && !isAllowShow }]">
      <div class="header-nav-box-out-box">
        <div id="header-nav" class="header-nav-box header-nav-version-a">
          <div :class="{ 'nav-wrap-fixed': topNavFixed }" class="nav-wrap">
            <div ref="navFixed" class="nav-fixed">
              <a
                :href="countryUrl('/')"
                :class="[onlyFixedHeader ? 'nav-logo-fix' : 'nav-logo-nofix', country]"
                class="nav-logo"
                aria-label="country"
              >
                <span style="display: none">country</span>
              </a>
              <div ref="nav" :class="{ 'not-one-line-nav': menuListGrid && menuListGrid.length > 1 }" class="nav">
                <div
                  v-for="(navItem, navIndex) in showMenuList"
                  :key="`${navItem.id}-${navIndex}`"
                  @mouseenter="navMouseenter(navItem)"
                  @mouseleave="navMouseleave(navItem)"
                  @click="selectNav(navItem)"
                  :class="[
                    navItem.name,
                    {
                      'nav-item': true,
                      'nav-item-selected': currentSelectedNavKey == navItem.id && jsKey == 'list',
                      'nav-hover': currentNav == navItem.id
                    }
                  ]"
                  tabindex="0"
                >
                  <div class="nav-item-box">
                    <a
                      v-if="navItem.id === 'tuxedos'"
                      @click="navBuryPoint(navItem.name)"
                      :class="navItem.style"
                      href="javascript:;"
                      class="nav-a-link"
                    >
                      {{ navItem.nameText ? navItem.nameText : nl(navItem.name) }}
                    </a>
                    <a
                      v-else-if="navItem.name.toLowerCase() === 'Barbie Azazie'.toLowerCase()"
                      @click="navBuryPoint(navItem.name)"
                      :class="navItem.style"
                      :href="countryUrl(navItem.linkUrl)"
                      class="nav-a-link"
                    >
                      <img
                        :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/34/44/9216b5e891c4250297278197f5ef3444.png')"
                        alt="barbie azazie"
                        class="barbie-menu"
                      />
                    </a>
                    <a
                      v-else
                      @click="navBuryPoint(navItem.name)"
                      :class="navItem.style"
                      :href="countryUrl(navItem.linkUrl)"
                      class="nav-a-link"
                    >
                      {{ navItem.nameText ? navItem.nameText : nl(navItem.name) }}
                    </a>
                    <img
                      v-if="navItem.imgUrl"
                      :src="addWebpSuffix(navItem.imgUrl)"
                      :alt="navItem.nameText ? navItem.nameText : nl(navItem.name)"
                      :class="[
                        'icon-tag',
                        {
                          atelier: navItem.linkUrl.includes('/all/atelier'),
                          'atelier-fixed': navItem.linkUrl.includes('/all/atelier') && topNavFixed
                        }
                      ]"
                    />
                  </div>
                  <template v-if="!is_chrome_lighthouse">
                    <div v-show="currentNav == navItem.id && (navItem.children || navItem.imgs)" :style="{ top: top }" class="nav-sub-menu">
                      <div class="desktop-wrapper">
                        <template v-for="(subMenuItem, subMenuIndex) in navItem.children">
                          <template v-if="!subMenuItem.key">
                            <div
                              :key="`${subMenuItem.name}-${navIndex}-${subMenuIndex}`"
                              @click.stop="() => null"
                              class="header-submenu header-submenu-normal"
                            >
                              <template v-if="subMenuItem.linkUrl && !subMenuItem.linkUrl.includes('javascript:void(0)')">
                                <a
                                  :href="countryUrl(subMenuItem.linkUrl)"
                                  v-track.viewOnce.click="{
                                    id: `point_${navItem.id}_${subMenuItem.id}`,
                                    common: getBiParamsView(navItem.name, subMenuItem.name, '')
                                  }"
                                  :class="subMenuItem.style"
                                  class="first-title"
                                >
                                  {{ subMenuItem.nameText ? subMenuItem.nameText : nl(subMenuItem.name) }}
                                </a>
                              </template>
                              <h4
                                v-else
                                v-track.viewOnce="{
                                  id: `point_${navItem.id}_${subMenuItem.id}`,
                                  view: getBiParamsView(navItem.name, subMenuItem.name, '')
                                }"
                                :class="subMenuItem.style"
                              >
                                {{ subMenuItem.nameText ? subMenuItem.nameText : nl(subMenuItem.name) }}
                              </h4>
                              <div :class="[{ 'two-line': getDoubleColumnList(subMenuItem.children).length == 2 }, country]">
                                <ul v-for="(dItem, dIndex) in getDoubleColumnList(subMenuItem.children)" :key="dIndex">
                                  <li
                                    v-for="(menuLinkItem, menuLinkIndex) in dItem"
                                    :key="`${menuLinkItem.name}-${navIndex}-${subMenuIndex}-${menuLinkIndex}`"
                                  >
                                    <a
                                      @click="menuLinkBuryPoint(navItem.name, subMenuItem.name, menuLinkItem.name)"
                                      :href="countryUrl(menuLinkItem.linkUrl)"
                                      :class="[
                                        menuLinkItem.style,
                                        {
                                          interval: menuLinkItem.linkUrl.includes('javascript:void(0)')
                                        }
                                      ]"
                                      v-track.viewOnce="{
                                        id: `point_${navItem.id}_${subMenuItem.id}_${menuLinkItem.id}`,
                                        view: getBiParamsView(navItem.name, subMenuItem.name, menuLinkItem.name)
                                      }"
                                      :aria-label="
                                        menuLinkItem.imgUrl
                                          ? navItem.name + ' ' + menuLinkItem.name + ' img link ' + menuLinkIndex
                                          : navItem.name + ' ' + menuLinkItem.name + ' link ' + menuLinkIndex
                                      "
                                    >
                                      {{ menuLinkItem.name }}
                                      <img
                                        v-if="menuLinkItem.linkUrl.includes('/all/kendallkylieSOD-collection')"
                                        :class="{
                                          'doll-house-collection': menuLinkItem.linkUrl.includes('/all/kendallkylieSOD-collection')
                                        }"
                                        src="https://cdn-1.azazie.com/upimg/userfiles/images/c0/25/b6dac4449a0c72d9e10c889948ecc025.png"
                                        alt="nav img"
                                      />
                                      <img
                                        v-if="menuLinkItem.imgUrl"
                                        :src="addWebpSuffix(menuLinkItem.imgUrl)"
                                        :alt="menuLinkItem.name"
                                        class="icon-tag"
                                      />
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <!-- 仿照m站新增banner配置 -->
                              <div v-if="subMenuItem.menuImgs && subMenuItem.menuImgs.length">
                                <a
                                  v-for="(img, index) in subMenuItem.menuImgs"
                                  :key="index"
                                  :href="countryUrl(img.linkUrl)"
                                  @click="menuLinkBuryPoint(navItem.name, subMenuItem.name, img.alt || 'img' + (index + 1))"
                                  :aria-label="img.name"
                                  v-track.viewOnce="{
                                    id: `point_${navItem.id}_${subMenuItem.id}_${index}`,
                                    view: getBiParamsView(navItem.name, subMenuItem.name, img.alt || 'img' + (index + 1))
                                  }"
                                >
                                  <img
                                    @click="clickMenuImg(img.name)"
                                    :src="addWebpSuffix(img.imgUrl)"
                                    :alt="img.alt || 'azazie nav img'"
                                    class="submenu-list-banner"
                                  />
                                </a>
                              </div>
                              <!-- 仿照m站新增banner配置 -->
                            </div>
                          </template>
                        </template>
                        <template v-if="navItem.imgs && !!Object.keys(navItem.imgs).length">
                          <div class="header-submenu">
                            <client-only>
                              <div class="submenu-img-box">
                                <div
                                  v-for="(menuImgItem, menuImgIndex) in navItem.imgs.slice(0, 4)"
                                  :key="`${navIndex}-${menuImgIndex}`"
                                  :style="
                                    getImgBoxWidth(navItem.imgs.length, navItem.activity && navItem.activity.param == 'swatches-fabrics')
                                  "
                                  class="submenu-img-item"
                                >
                                  <a
                                    :href="countryUrl(menuImgItem.linkUrl)"
                                    @click="externalSetDatelayer(menuImgItem, menuImgIndex, navItem.name)"
                                    :class="{
                                      'no-pointer': judgeIsEmptyUrl(menuImgItem.linkUrl)
                                    }"
                                    :aria-label="itemLinkTitleAriaLabel(navItem, menuImgItem, menuImgIndex)"
                                    :target="menuImgItem.newWindows ? '_blank' : '_self'"
                                    class="item-link"
                                  >
                                    <!-- 热区 lego 配置-->
                                    <ImageHotSpot :positions="menuImgItem.positions" ec="navbar" />
                                    <img
                                      :class="getCurrentImgWidth(navItem.id, menuImgIndex)"
                                      :alt="menuImgItem.imgText || menuImgItem.bannerText || 'azazie nav img'"
                                      :src="addWebpSuffix(menuImgItem.imgUrl)"
                                      height="240px"
                                    />
                                    <div class="item-link-title">
                                      <span>{{ menuImgItem.imgText || menuImgItem.bannerText }}</span>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            </client-only>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!-- <div v-if="showMoreBtn && menuListGrid" class="arrow-btn"> -->
              <div v-if="showMoreBtn" class="arrow-btn">
                <az-icon
                  :class="{ disabled: menuListGridIndex <= 0 }"
                  @click="getGridStep(-1)"
                  v-track.viewOnce.click="getBiParamsArrow('showleftnavbar', 'left')"
                  role="button"
                  aria-label="left"
                  class="arraw-icon"
                  icon-class="icon-lby_arrow_left"
                />
                <az-icon
                  :class="{ disabled: menuListGridIndex > 0 }"
                  @click="getGridStep(1)"
                  v-track.viewOnce.click="getBiParamsArrow('showrightnavbar', 'right')"
                  role="button"
                  aria-label="right"
                  class="arraw-icon"
                  icon-class="icon-lby_arrow_right"
                />
              </div>
              <div :class="[onlyFixedHeader ? 'right_container_fix' : 'right_container_nofix']" class="right_container">
                <az-header-search :focus="true" v-if="searchShow" position="right" class="header-search header-search-b"></az-header-search>
                <ul class="account_operation">
                  <li>
                    <a @click.stop="searchFixedEvent" role="button" tabindex="0" class="account-a ht_search_fixed" aria-label="search">
                      <az-icon icon-class="icon-search1"></az-icon>
                      <span style="display: none">{{ nl('page_common_search') }}</span>
                    </a>
                  </li>
                  <li @mouseenter="showSignSubmenu(true)" @mouseleave="showSignSubmenu(false)" class="hover-li">
                    <a
                      :href="!isLogin ? countryUrl(loginHref) : countryUrl(`/order/list`)"
                      class="account-a ht_login_fixed"
                      aria-label="user"
                    >
                      <az-icon icon-class="icon-user"></az-icon>
                    </a>
                    <ul
                      v-show="isLogin && signShowSubmenu"
                      :class="[isLogin && signShowSubmenu ? 'animation-slideflex-enter-active' : 'animation-slideflex-leave-active']"
                      class="submenu account_sub sign-submenu submenu-logined"
                    >
                      <li class="username">
                        {{ `${nl('page_nav_hi')}, ${userInfoName}` }}
                      </li>
                      <li>
                        <a :href="countryUrl(`/user?my_coupons`)">{{ nl('page_account_my_coupons') }}</a>
                      </li>
                      <li>
                        <a :href="countryUrl(`/order/list`)" aria-label="My account menu">{{ nl('page_head_myaccount') }}</a>
                      </li>
                      <li>
                        <a @click="logout" role="button" tabindex="0" href="javascript:;">{{ nl('page_head_signout') }}</a>
                      </li>
                    </ul>
                    <ul
                      v-show="!isLogin && signShowSubmenu"
                      :class="[!isLogin && signShowSubmenu ? 'animation-slideflex-enter-active' : 'animation-slideflex-leave-active']"
                      class="submenu account_sub sign-submenu"
                    >
                      <div v-if="country == 'AU' || country == 'GB'" class="color-activity-info">
                        <p class="welcome">{{ nl('page_country_welcome') }}</p>
                        <p class="des">
                          <span>{{ nl('page_az_header_logo_text1') }}</span> {{ nl('page_az_header_logo_text2') }}
                        </p>
                      </div>
                      <li>
                        <a :href="countryUrl(loginHref)">{{ nl('page_lp_app_sign_in') }}</a>
                      </li>
                      <li>
                        <a :href="countryUrl(loginHref)">{{ nl('page_lp_app_sign_up') }}</a>
                      </li>
                      <li>
                        <a :href="countryUrl(`/user/login?has_track=1`)" class="not-login-track">{{
                          nl('page_common_track_your_order')
                        }}</a>
                      </li>
                    </ul>
                  </li>
                  <li
                    @mouseenter="$route.name === 'cart' ? (bagSubmenu = false) : (bagSubmenu = true)"
                    @mouseleave="bagSubmenu = false"
                    class="hover-li"
                  >
                    <a :href="countryUrl(`/cart`)" class="account-a ht_bag_fixed" aria-label="cart">
                      <az-icon icon-class="icon-cart1"></az-icon>
                      <div>
                        <span>{{ cartInfo.totalCount }}</span>
                      </div>
                    </a>
                    <client-only>
                      <ul
                        v-show="showBagBox"
                        :class="['submenu popCart', showBagBox ? 'animation-slideflex-enter-active' : 'animation-slideflex-leave-active']"
                      >
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
                                <a
                                  :href="navToDetails(prodItem)"
                                  :aria-label="prodItem.shownGoodsName"
                                  class="jump_to_product"
                                  target="_self"
                                >
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
                                    <span class=" value">{{ prodItem.giftCard.fromUser }}</span>
                                  </div>
                                  <div v-if="prodItem.giftCard" class="color_div">
                                    <span class="name">{{ nl('page_gift_card_order_send_to') }}:</span>
                                    <span class="value">{{ prodItem.giftCard.toUser ? prodItem.giftCard.toUser.join(',') : '' }}</span>
                                  </div>
                                  <div class="qty_div">
                                    <span class="name">{{ nl('page_common_qty') }}:</span>
                                    <span class="qty_value value">{{ prodItem.giftCard.goodsNumber }}</span>
                                  </div>
                                </template>

                                <template v-else>
                                  <div v-if="prodItem.formatStyles && prodItem.formatStyles.color" class="color_div">
                                    <span class="name">{{ nl('page_common_color') }}: </span>
                                    <span class="color_value value">{{ prodItem.shownColor }}</span>
                                  </div>
                                  <div v-if="prodItem.formatStyles && prodItem.formatStyles.size" class="size_div">
                                    {{ size(prodItem) }}
                                  </div>
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
                                    <span class="name">{{ nl('page_common_qty') }}: </span>
                                    <span class="qty_value value">{{ prodItem.goodsNumber }}</span>
                                  </div>
                                </template>

                                <div class="price">
                                  <template v-if="prodItem.hasActivityLinePrice">
                                    <div class="goods-price goods-price-box">
                                      <span class="current-price">{{ prodItem.shopPriceWithOutBonusDisplay }}</span>
                                      <span class="no-deal-price">{{ prodItem.noDealPriceDisplay }}</span>
                                    </div>
                                    <az-with-code
                                      v-if="prodItem.activityCouponCode && prodItem.activityBonus && !prodItem.isGift && !cyberSaleInfo"
                                      :code="prodItem.activityCouponCode"
                                    ></az-with-code>
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
                        <!-- <section class="cart-box-btn-content">
                        </section> -->
                        <div class="total-box">
                          <div class="total">
                            <span class="sub-total">{{ nl('page_common_subtotal') }}:</span>
                            <span v-if="cartInfo.hasLineTotal" class="line-total-box">
                              <span class="current-total">{{ cartInfo.totalPrice }}</span>
                              <span class="line-total">{{ cartInfo.lineTotle }}</span>
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
                            <span @click="buyNowClick" role="button" tabindex="0" target="_self" class="to_checkout">
                              <az-icon class="icon" icon-class="iconicon_buy_now" />
                              <span class="txt">{{ nl('page_common_buy_now') }}</span>
                            </span>
                          </div>
                        </li>
                      </ul>
                    </client-only>
                  </li>
                  <li @mouseenter="showroomSubmenu = true" @mouseleave="showroomSubmenu = false" class="hover-li">
                    <a
                      @click="showroomClick"
                      :aria-label="nl('page_common_showroom')"
                      role="button"
                      tabindex="0"
                      href="javascript:;"
                      class="account-a ht_fav_fixed"
                    >
                      <az-icon icon-class="icon-showroom2"></az-icon>
                      <span style="display: none">{{ nl('page_common_showroom') }}</span>
                    </a>
                    <div v-show="showroomShowFlag" class="msg_bubble" style="left: -88px;">
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
                      style="left: auto;right: -50px;"
                    >
                      <template v-if="showRoom && showRoom.length">
                        <li v-for="showroomItem in showRoom" :key="showroomItem.showroomId">
                          <a :href="countryUrl(`/showroom/${showroomItem.showroomIdDisplay}`)">
                            <span class="showroom_name"> {{ showroomItem.roomName | filtRoomName }} </span>
                            <span>{{ nl('page_showroom_owner_showroom') }}</span>
                          </a>
                        </li>
                      </template>
                      <template v-if="!noMoreShowRoom">
                        <li>
                          <a @click="createShowroom" role="button" tabindex="0" class="create-new-showroom" style="cursor:pointer">{{
                            nl('page_head_create_showroom')
                          }}</a>
                        </li>
                      </template>
                    </ul>
                  </li>
                  <li @mouseenter="countrySelectFlag = true" @mouseleave="countrySelectFlag = false" class="hover-li">
                    <a href="javascript:;" class="ht_country_fixed" aria-label="country">
                      <az-icon icon-class="icon-country1"></az-icon>
                    </a>
                    <country-menu :show="countrySelectFlag" style="right:-12px;top:40px"></country-menu>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AzWithCode from '@/components/az-ui/AzWithCode'
import AzHeaderSearch from '@/components/common/AzHeaderSearch'
import CountryMenu from '@/components/common/CountryMenu'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import signRoomBagMixins from '@/assets/js/signRoomBagMixins'
import bannerMixins from '@/assets/js/bannerMixins'
import { createThrottle } from '@/assets/js/utils'
import FreeShipProgress from '@/components/cart/FreeShipProgress'
import ActivityStatusProgress from '@/components/cart/ActivityStatusProgress'
import { mapState } from 'vuex'

export default {
  name: 'AzHeaderNav',
  languageKeys: [
    'page_common_search',
    'page_nav_hi',
    'page_account_my_coupons',
    'page_head_myaccount',
    'page_head_signout',
    'page_country_welcome',
    'page_az_header_logo_text1',
    'page_az_header_logo_text2',
    'page_lp_app_sign_in',
    'page_lp_app_sign_up',
    'page_common_track_your_order',
    'page_common_from',
    'page_gift_card_order_send_to',
    'page_common_color',
    'page_common_qty',
    'page_common_subtotal',
    'page_common_view_bag',
    'page_common_buy_now',
    'page_common_showroom',
    'page_msg_buble_style',
    'page_showroom_owner_showroom',
    'page_head_create_showroom',
    'page_common_size',
    'page_common_garment_bag',
    'page_common_garment_bag_wd',
    ...AzWithCode.languageKeys,
    ...AzHeaderSearch.languageKeys,
    ...CountryMenu.languageKeys,
    ...FreeShipProgress.languageKeys,
    ...ActivityStatusProgress.languageKeys,
    ...AzSticker.languageKeys
  ],
  components: {
    AzWithCode,
    AzHeaderSearch,
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
  mixins: [signRoomBagMixins, bannerMixins],
  props: {
    adaptive: {
      type: Boolean,
      default: false
    },
    onlyFixedHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // navSize: {}
      menuListGridIndex: 0,
      menuListGrid: null,
      sizeMap: {},
      sizeCount: 0,
      showMoreBtn: false,
      // 以上新增
      mouseEnterTimer: 0,
      searchShow: false,
      currentNav: '',
      mouseTimer: null,
      activityLoading: false,
      researchShow: false,
      loginHref: '',
      top: '50px',
      copyNavItem: {},
      // 当前选择的 nav的 key，用来设置选中状态
      currentSelectedNavKey: '',
      countrySelectFlag: false, // 是否展示国家选择
      sliceIndex: 8
    }
  },
  computed: {
    ...mapState({
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    showMenuList({ menuListGrid, menuListGridIndex, menuList }) {
      return menuListGrid && menuListGrid.length > 1 ? menuListGrid[menuListGridIndex] : menuList
    },
    // 考虑一行元素的使用 space-arround
    overOneGridItem({ menuListGrid }) {
      return menuListGrid && menuListGrid.length > 1
    },
    barData() {
      const barData = []
      for (const i in this.activityInfo) {
        const activity = this.activityInfo[i]
        if (activity.bar && activity.bar[activity.base.status]) {
          barData.push({
            couponCode: activity.base.couponCode || '',
            bar: activity.bar[activity.base.status],
            status: activity.base.status,
            countdownEndTime: activity.base.countdownEndTime
          })
        }
      }
      return barData
    },
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
    menuList() {
      const tempMenuList = JSON.parse(JSON.stringify(this.navigation.navigation)) || []
      return tempMenuList
    },
    showBagBox({ bagSubmenu, topCartListShow, cartInfo, topNavFixed }) {
      const flag = (bagSubmenu || (topNavFixed && topCartListShow)) && cartInfo.totalCount > 0
      return flag
    },
    isAllowShow() {
      return ['checkout', 'checkoutSuccess'].includes(this.$store.state.jsKey)
    },
    topNavFixed({ headerFixed, onlyFixedHeader }) {
      return headerFixed || onlyFixedHeader
    }
  },
  watch: {
    activityInfo: {
      handler(newVal, oldVal) {
        const glVar = typeof window === 'object' ? window : global
        if (newVal.length && !glVar.isActivityFlag) {
          glVar.isActivityFlag = true
          this.activityLoading = true
          // 判断活动banner是否有数据，如果有匹配数据，修改菜单列表对应数据
          if (newVal[0].banner && newVal[0].banner.navBanner && newVal[0].banner.navBanner.length && this.menuList.length) {
            const navBanner = newVal[0].banner.navBanner
            navBanner.forEach((item) => {
              this.menuList.forEach((navItem, navIndex) => {
                if (navItem.activity && navItem.activity.param && item.navName == navItem.activity.param) {
                  item.isWebActivity = true
                  if (navItem.imgs) {
                    // const itemImgLen = navItem.imgs.length
                    if (navItem.activity && navItem.activity.param == 'swatches-fabrics') {
                      navItem.imgs.splice(0, 0, item)
                    } else {
                      navItem.imgs.splice(item.displayOrder * 1 - 1, 0, item)
                    }
                    // navItem.imgs.splice(itemImgLen, 1)
                  } else {
                    navItem.imgs = [item]
                  }
                }
              })
            })
          }
        }
      }
    },
    currentNav(newVal) {
      if (newVal) {
        let eventParams = {}
        // 使用新的打点方式，为导航栏的hover打点
        eventParams = {
          ec: 'navbar_level1',
          el: this.nl(this.copyNavItem.name).toLowerCase(),
          ea: 'view'
        }
        this.buryPoint(this, 'event', eventParams)
      }
    },
    topNavFixed(newVal) {
      if (newVal) {
        this.top = '54px'
      } else {
        this.top = '50px'
      }
    }
  },
  mounted() {
    // 为第一级菜单的曝光打点
    let temp = {}
    const items = []
    if (this.menuList && this.menuList.length) {
      this.menuList.forEach((item) => {
        const name = this.nl(item.name).toLowerCase()
        temp.ec = 'navbar'
        temp.ea = 'view'
        temp.el = name
        temp.msg = JSON.stringify({ p1: name })
        temp.param1 = (location && location.href) || '-1'
        items.push(temp)
        temp = {}
      })
    }

    this.buryPoint(this, 'events', items)
    this.loginHref = `/user/login?back=${location.href}`
    document.documentElement.addEventListener('click', (e) => {
      if (e.target.closest('.az-header-search')) {
        setTimeout(() => {
          this.searchShow = false
        }, 0)
      } else {
        this.searchShow = false
      }
    })
    this.currentSelectedNavKey = (sessionStorage && sessionStorage.getItem('current_selected_nav_key')) || ''
    const sizeMap = {}
    let sizeCount = 0
    const elements = document.body.querySelectorAll('.nav .nav-item')
    this.menuList.forEach((navItem, index) => {
      const element = elements[index]
      if (element) {
        const width = element.offsetWidth
        sizeCount += width
        sizeMap[navItem.id] = width
      }
    })
    this.sizeMap = sizeMap
    this.sizeCount = sizeCount
    // 初始执行
    // this.resizeFn()
    this.resizeFnThrottle = createThrottle(this.resizeFn.bind(this))
    this.resizeFnThrottle()
    window.addEventListener('resize', this.resizeFnThrottle)
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
    // 获取item-link-title元素对应的aria-label内容
    itemLinkTitleAriaLabel(navItem, menuImgItem, menuImgIndex) {
      const catName = navItem.nameText ? navItem.nameText : this.nl(navItem.name)
      return catName + ' ' + (menuImgItem.imgText || menuImgItem.bannerText) + ' img link ' + menuImgIndex
    },
    getBiParamsArrow(el, p1) {
      if (process.server) return
      return {
        id: el + '-' + p1,
        common: {
          ec: 'navbar',
          el,
          msg: {
            p1
          },
          param1: (location && location.href) || '-1'
        }
      }
    },
    resizeFn() {
      // 节流后执行
      this.scheduledResize = false
      const nav = document.body.querySelector('.nav')
      if (!nav) return false
      const navWidth = nav.offsetWidth
      // const arrow = document.body.querySelector('.arrow-btn')
      // if (!arrow) navWidth -= 45
      this.showMoreBtn = this.sizeCount > navWidth
      // this.getGroup(navWidth)
    },
    getGroup(navWidth) {
      const grid = []
      let row = []
      const sizeMap = this.sizeMap
      let allowWidth = navWidth
      const prevId =
        this.menuListGrid && this.menuListGrid[this.menuListGridIndex]
          ? this.menuListGrid[this.menuListGridIndex][0].id
          : this.menuList[0].id
      let prevToCurrentIndex = 0
      // console.log(prevId)
      this.menuList.forEach((navItem, index) => {
        const itemWidth = sizeMap[navItem.id]
        if (navWidth < itemWidth) {
          if (row.length) {
            grid.push(row)
            row = []
          }
          grid.push([navItem])
          allowWidth = navWidth
        } else {
          if (allowWidth >= itemWidth) row.push(navItem)
          else {
            grid.push(row)
            row = [navItem]
            allowWidth = navWidth
          }
          allowWidth -= itemWidth
        }
        if (prevId === navItem.id) {
          prevToCurrentIndex = grid.length - 1 + (row.length ? 1 : 0)
        }
      })
      grid.push(row)
      this.menuListGrid = grid
      this.menuListGridIndex = prevToCurrentIndex
    },
    getGridStep(step) {
      if (step > 0) {
        const scrollLeft = this.$refs.navFixed.scrollWidth - this.$refs.navFixed.clientWidth
        this.$refs.navFixed.scrollTo(scrollLeft, 0)
        const scrollLeftNav = this.$refs.nav.scrollWidth - this.$refs.nav.clientWidth
        this.$refs.nav.scrollTo(scrollLeftNav, 0)
      } else {
        this.$refs.navFixed.scrollTo(0, 0)
        this.$refs.nav.scrollTo(0, 0)
      }
      this.menuListGridIndex = step
      // const index = this.menuListGridIndex + step
      // if (index < 0 || index > this.menuListGrid.length - 1) return
      // this.menuListGridIndex = index
    },
    selectNav(navItem) {
      sessionStorage && sessionStorage.setItem('current_selected_nav_key', navItem.id)
      this.currentSelectedNavKey = navItem.id
      if (navItem.linkUrl && !navItem.linkUrl.includes('javascript')) {
        window.open(this.countryUrl(navItem.linkUrl), '_self')
      }
    },
    // nav bar 的订单追踪
    setNavBarOrderSourceFlag() {
      const navBarVersion = 'VersionB_NavBar'
      this.setOrderSourceFlag(navBarVersion, true)
    },
    // 为nav的点击事件埋点
    navBuryPoint(langName) {
      let eventParams = {}
      eventParams = {
        ec: 'navbar',
        el: this.nl(langName).toLowerCase(),
        ea: 'click',
        msg: JSON.stringify({ p1: this.nl(langName).toLowerCase() }),
        param1: (location && location.href) || '-1'
      }
      this.buryPoint(this, 'event', eventParams)
      this.setNavBarOrderSourceFlag()
      if (langName === 'tuxedos') {
        this.$emit('clickTuxedos')
      }
    },
    // 为menuLink打点
    menuLinkBuryPoint(navItemName, subMenuName, menuLinkName) {
      let eventParams = {}
      const msg = {
        p1: this.nl(navItemName).toLowerCase(),
        p2: this.nl(subMenuName).toLowerCase(),
        p3: this.nl(menuLinkName).toLowerCase()
      }

      eventParams = {
        ec: 'navbar',
        el: this.nl(menuLinkName).toLowerCase(),
        ea: 'click',
        msg: JSON.stringify(msg),
        param1: (location && location.href) || '-1'
      }
      this.buryPoint(this, 'event', eventParams)
      this.setNavBarOrderSourceFlag()
    },
    // 为nav的子元素打点
    subMenuBuryPoint(menuImgIndex, navItemName, menuImgItem) {
      // 这里对图片事件进行打点，el是如 1st image 这样的。根据图片的顺序
      const numberSuffix = ['st', 'nd', 'rd']
      const defaultSuffix = 'th'
      const defaultEl = ' image'
      const suffix = numberSuffix[menuImgIndex] || defaultSuffix
      const el = menuImgIndex + 1 + suffix + defaultEl
      let eventParams = {}
      let msg = {}

      msg = {
        p1: this.nl(navItemName).toLowerCase(),
        p3: el
      }
      eventParams = {
        ec: 'navbar',
        el,
        ea: 'click',
        msg: JSON.stringify(msg),
        param1: (location && location.href) || '-1',
        param2: this.versionGroup.banner_navigation_top
      }

      if (menuImgItem.isWebActivity) {
        eventParams.msg = JSON.stringify({
          report_pos: 'activity_banner'
        })
        eventParams.param2 = this.versionObj.activityAbtest
      }

      this.buryPoint(this, 'event', eventParams)
      this.setNavBarOrderSourceFlag()
    },
    debounce(fn, wait) {
      let timeout = null
      return function() {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(fn, wait)
      }
    },
    externalSetDatelayer(menuImgItem, menuImgIndex, subMenuItem) {
      this.subMenuBuryPoint(menuImgIndex, subMenuItem, menuImgItem)
      if (menuImgItem && menuImgItem.eventCategory && menuImgItem.eventName) {
        this.setDataLayer({
          action: 'click',
          category: menuImgItem.eventCategory,
          label: menuImgItem.eventName
        })
      }
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
    getCurrentImgWidth(key, index) {
      let res
      switch (key) {
        case 'bridesmaids':
          res = 'img-186-240'
          break
        case 'brides':
          res = 'img-266-240'
          break
        case 'mbd':
          res = 'img-255-240'
          break
        case 'special-occasions':
          res = 'img-236-240'
          break
        case 'accessories':
          res = 'img-266-240'
          break
        case 'swatch-fabric':
          res = 'img-616-240'
          break
        case 'samples':
          res = 'img-319-240'
          break
        case 'ready_to_ship':
          res = 'img-248-240'
          break
        case 'inspo':
          res = 'img-324-240'
          break
        case 'sale':
          res = 'img-275-240'
          break
        default:
          break
      }
      return res
    },
    getImgBoxWidth(n, bol) {
      if (!n || !bol) return {}
      return {
        width: `calc((100% - (${bol ? '0px' : '24px'})) / ${n}) !important;`
      }
    },
    navMouseenter(item) {
      if (item.linkUrl === '/all/special-occasion-dresses') {
        this.sliceIndex = 9
      } else {
        this.sliceIndex = 8
      }
      this.copyNavItem = item
      // 清除显示定时器
      if (this.mouseEnterTimer) clearTimeout(this.mouseEnterTimer)
      // 等于当前显示导航，清除隐藏定时器
      if (this.mouseTimer && this.currentNav === item.id) clearTimeout(this.mouseTimer)
      this.mouseEnterTimer = setTimeout(
        () => {
          if (this.currentNav !== item.id) this.currentNav = item.id
        },
        // 有二级导航延迟显示
        150
      )
    },
    navMouseleave(item) {
      clearTimeout(this.mouseEnterTimer)
      if (this.currentNav !== item.id) return
      this.mouseTimer = setTimeout(() => {
        // 等于当前显示导航 且 隐藏定时器 > 显示定时器
        if (this.currentNav === item.id && this.mouseEnterTimer < this.mouseTimer) {
          this.currentNav = ''
        }
      }, 300)
    },
    getStyle(el) {
      let myGetComputedStyle
      if (typeof window.getComputedStyle !== 'function') {
        myGetComputedStyle = function(el, pseudo) {
          const oStyle = {}
          const oCurrentStyle = el.currentStyle || {}
          for (const key in oCurrentStyle) {
            oStyle[key] = oCurrentStyle[key]
          }

          oStyle.styleFloat = oStyle.cssFloat

          oStyle.getPropertyValue = function(prop) {
            return oCurrentStyle.getAttribute(prop) || null
          }
          return oStyle
        }
      } else {
        myGetComputedStyle = window.getComputedStyle
      }
      return myGetComputedStyle(el)
    },
    searchFixedEvent() {
      this.searchShow = true
    },
    closeActivity() {
      this.activityLoading = false
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
    clickMenuImg(menuName) {
      if (menuName == 'bridalstylefinder') this.$emit('styleQuizBtnClick')
    },
    getBiParamsView(p1, p2, p3) {
      if (process.server) return
      const msg = {
        p1: this.nl(p1).toLowerCase()
      }
      if (p2) {
        msg.p2 = this.nl(p2).toLowerCase()
      }
      if (p3 && p3.toLowerCase() != p1.toLowerCase()) {
        msg.p3 = this.nl(p3).toLowerCase()
      }
      return {
        ec: 'navbar',
        el: this.nl(msg.p3 || msg.p2 || msg.p1).toLowerCase(),
        msg: JSON.stringify(msg),
        param1: (location && location.href) || '-1'
      }
    },
    getDoubleColumnList(item = []) {
      const arr = []
      let spliceIndex = 0
      if (item && item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          const tempItem = item[i]
          if (tempItem.style && tempItem.style.includes('columns')) {
            spliceIndex = i
            break
          }
        }
        if (spliceIndex > 0) {
          arr[0] = item.slice(0, spliceIndex)
          arr[1] = item.slice(spliceIndex)
        } else {
          arr[0] = item.slice(0)
        }
      }
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
@navFixHeight: 48px;
.header-nav-dot {
  position: relative;
  .atelier {
    transform: translate(-10px, -10px) !important;
    height: 20px !important;
    &-fixed {
      transform: translate(-10px, -6px) !important;
    }
  }
  .nav-item {
    cursor: pointer;
  }
}
.smooth-header {
  height: 53px;
  &.activity-smooth-header {
    height: 35px;
  }
}

.arrow-btn {
  // margin-right: 15px;
  width: 30px;
  height: 39px;
  line-height: 39px;
  padding-top: 8px;
  position: absolute;
  right: 18px;
  background-color: #fff;
  .arraw-icon {
    width: 12px;
    height: 12px;
    cursor: pointer;
    &.disabled {
      opacity: 0.35;
    }
  }
}
.nav-wrap {
  // position: relative;
  padding-right: 30px;
}
.nav-fixed {
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .nav {
    padding-top: 8px;
  }
}
.header-fixed {
  .arrow-btn {
    height: @navFixHeight;
    line-height: @navFixHeight;
    padding-top: 3px;
  }
  .header-nav-box-out-box {
    .header-nav-box {
      position: unset;
      height: unset;
      max-width: unset;
      &.header-nav-version-a {
        .nav-wrap .nav .nav-item {
          letter-spacing: 0;
        }
        .submenu-img-box {
          .submenu-img-item {
            &.swatch-fabric-box {
              width: 50% !important;
              .header-submenu-border {
                margin: 0 26px 0 26px !important;
              }
            }
          }
        }
      }
      .nav-wrap {
        height: unset;
        &.nav-wrap-fixed {
          box-sizing: content-box;
          .nav {
            flex-wrap: nowrap;
            justify-content: center;
            height: @navFixHeight;
            line-height: @navFixHeight;
            // overflow: hidden;
            margin: 0 15px;
            flex: 1;
            padding-top: 3px;
            .nav-item {
              padding: 0;
              height: @navFixHeight;
              line-height: @navFixHeight;
              .nav-item-box {
                .icon-tag {
                  top: 3px;
                }
                &::after {
                  padding: 0 2px;
                  left: -2px;
                }
              }
            }
            .nav-sub-menu {
              top: 80px;
            }
          }
        }
      }
    }
  }
}
.header-nav-box-out-box {
  border-bottom: 3px solid #f1f1f1;
  position: relative;
  .header-nav-box {
    box-sizing: border-box;
    min-width: 1263px;
    width: 100%;
    padding: 0 37px 0px 30px;
    margin: 0 auto;
    &.header-nav-version-a {
      .nav-wrap .nav .nav-item {
        letter-spacing: 0;
      }
      .submenu-img-box {
        .submenu-img-item {
          &.swatch-fabric-box {
            width: 50% !important;
            .header-submenu-border {
              margin: 0 26px 0 26px !important;
            }
            &:last-child {
              text-align: right;
            }
          }
        }
      }
    }
    .nav-wrap {
      top: 0;
      left: 0;
      right: 0;
      background: #fff;
      .nav {
        margin: 0 auto;
        font-size: 0;
        display: flex;
        justify-content: center;
        flex: 1;
        // overflow: hidden;
        &.not-one-line-nav {
          justify-content: center;
        }
        .nav-item {
          display: inline-block;
          vertical-align: top;
          height: 39px;
          line-height: 39px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-size: 13px;
          white-space: nowrap;
          &:nth-child(1) {
            .nav-item-box {
              padding-left: 0;
            }
          }
          &:last-child {
            .nav-item-box {
              padding-right: 0;
            }
          }
          .nav-item-box {
            padding: 0 25px;
            position: relative;
            .icon-tag {
              height: 15px;
              position: absolute;
              padding: 0;
              top: 3px;
            }
            .nav-a-link {
              &.space {
                color: var(--color-121212);
              }
              .barbie-menu {
                height: 38px;
                width: 98.8px;
                vertical-align: middle;
              }
            }
          }
          &:hover {
            .nav-a-link {
              color: var(--color-121212);
              &::after {
                background-color: var(--color-121212);
              }
            }
          }
          &.Barbie {
            .icon-tag {
              position: absolute;
              top: -5px;
              left: 91px;
              height: 20px;
            }
          }
        }
        .nav-item-selected {
          .nav-a-link {
            &::after {
              background-color: var(--color-121212);
            }
          }
        }
        .pdl24 {
          width: 10px;
          display: inline-block;
        }
        .nav-a-link {
          display: inline-block;
          width: 100%;
          height: 100%;
          padding: 0;
          position: relative;
          font-family: @font-family-500, sans-serif;
          color: var(--color-121212);
          &.highlight {
            color: var(--color-121212);
          }
          &.bold {
            font-family: @font-family-600, sans-serif;
          }
          &::after {
            box-sizing: content-box;
            content: '';
            display: block;
            width: 100%;
            height: 3.5px;
            background-color: transparent;
            margin-top: -3.5px;
            padding: 0 8px;
            position: relative;
            left: -8px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .header-fixed {
    .header-nav-box {
      padding-left: 30px !important;
      padding-right: 37px !important;
    }
  }
}
/deep/ .az-with-code-box {
  justify-content: flex-start !important;
}

// 自适应移出来
.nav-sub-menu {
  background: #fff;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: normal;
  font-family: @font-family-500, sans-serif;
  position: absolute;
  z-index: @z-index-5;
  text-transform: none;
  text-align: left;
  border-bottom: 1px solid #d7d7d7;
  box-sizing: border-box;
  width: 100%;
  top: 39px;
  padding: 30px 40px 40px;
  min-height: 370px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15);
  left: 0;
  right: 0;
  .desktop-wrapper {
    min-width: 1204px;
    max-width: 1294px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    justify-content: space-between;
    white-space: nowrap;
    height: 100%;
    .header-submenu {
      display: inline-block;
      vertical-align: top;
      text-align: left;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
      h4 {
        display: block;
        margin-top: 0;
        line-height: 21px;
        text-decoration: none;
        font-family: @font-family-500, sans-serif;
        text-transform: uppercase;
        font-size: 13px;
        padding-bottom: 3px;
        margin-bottom: 11px;
        color: var(--color-121212);
        font-weight: normal;
        border-bottom: 1px solid #eee;
        &.highlight {
          color: var(--color-121212);
        }
        &.bold {
          font-family: @font-family-600, sans-serif;
        }
        &.space {
          margin-left: 10px;
          display: inline-block;
        }
      }
      a.first-title {
        font-family: @font-family-500, sans-serif;
        color: var(--color-121212);
        &:hover {
          color: var(--color-121212);
        }
        &.highlight {
          color: var(--color-121212);
        }
        &.bold {
          font-family: @font-family-600, sans-serif;
        }
        &.space {
          margin-left: 10px;
        }
      }
      .survey-entrance {
        margin-top: 12px;
        a {
          cursor: pointer;
          display: inline-block;
          img {
            width: 150px;
            height: 90px;
          }
        }
      }
      ul {
        li {
          margin: 7px 0;
          a {
            position: relative;
            color: var(--color-121212);
            max-width: 220px;
            overflow: hidden;
            white-space: normal;
            .icon-tag {
              height: 15px;
              position: absolute;
              bottom: 8px;
              padding: 0;
            }
            &:hover {
              // color: var(--color-121212);
              color: @text-light-hover-color;
            }
            &.theme-color {
              color: var(--color-121212);
            }
            &.highlight {
              color: var(--color-121212);
            }
            &.bold {
              font-family: @font-family-600, sans-serif;
            }
            &.space {
              margin-left: 10px;
              display: inline-block;
            }
            &.interval {
              margin-top: 10px;
              padding-bottom: 3px;
              display: inline-block;
              width: 100%;
              border-bottom: 1px solid #eee;
              cursor: default;
              &:hover {
                color: var(--color-121212);
              }
            }
          }
        }
      }
      .submenu-img-box {
        display: flex;
        justify-content: space-between;
        padding: 5px 0 0 0;
        .submenu-img-item {
          display: inline-block;
          padding: 0;
          margin: 0 0 0 12px;
          flex: 1;
          &:nth-child(1) {
            margin-left: 0;
          }
          &.swatch-fabric-box {
            margin: 0;
            &:nth-child(1),
            &:nth-child(2) {
              width: 300px;
            }
            &:nth-child(3) {
              .item-link {
                .item-link-title {
                  display: none;
                }
              }
            }
            .item-link {
              display: inline-block;
            }
          }
          .item-link {
            position: relative;
            display: block;
            white-space: nowrap;
            color: var(--color-121212);
            font-size: 0;
            height: 280px;
            img {
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 240px;
              vertical-align: middle;
              &.img-240-240 {
                width: 240px;
                height: 240px;
              }
              &.img-179-280 {
                width: 179px;
                height: 280px;
              }
              &.img-250-280 {
                width: 250px;
                height: 280px;
              }
              &.img-246-280 {
                width: 246px;
                height: 280px;
              }
              &.img-232-280 {
                width: 232px;
                height: 280px;
              }
              &.img-226-200 {
                width: 220px;
                height: 200px;
              }
              &.img-311-280 {
                width: 311px;
                height: 280px;
              }
              &.img-186-240 {
                width: 186px;
                height: 240px;
              }
              &.img-266-280 {
                width: 266px;
                height: 280px;
              }
              &.img-266-240 {
                width: 266px;
                height: 240px;
              }
              &.img-255-240 {
                width: 255px;
                height: 240px;
              }
              &.img-237-240 {
                width: 237px;
                height: 240px;
              }
              &.img-319-240 {
                width: 319px;
                height: 240px;
              }
              &.img-319-280 {
                width: 319px;
                height: 280px;
              }
              &.img-248-240 {
                width: 248px;
                height: 240px;
              }
              &.img-324-240 {
                width: 324px;
                height: 240px;
              }
              &.img-275-240 {
                width: 275px;
                height: 240px;
              }
              &.img-240-220 {
                width: 240px;
                height: 220px;
              }
              &.img-236-240 {
                width: 236px;
                height: 240px;
              }
              &.img-611-280 {
                width: 611px;
                height: 280px;
              }
              &.img-616-240 {
                width: 616px;
                height: 240px;
              }
            }
            &:hover {
              .item-link-title {
                background: var(--color-121212);
                color: #fff;
              }
            }
            .item-link-title {
              // position: absolute;
              width: 100%;
              background: var(--color-ede1d3);
              height: 40px;
              font-size: 13px;
              font-family: @font-family-600, sans-serif;
              font-weight: 600;
              color: var(--color-121212);
              text-align: center;
              text-transform: uppercase;
              line-height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              height: auto;
              padding: 2px 0;
              span {
                min-height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 18px;
                word-break: break-word;
                white-space: break-spaces;
              }
            }
          }
        }
      }
    }
    .header-submenu-swatches {
      width: 100%;
      .submenu-img-item {
        width: 50%;
        box-sizing: border-box;
        &:last-child {
          border-left: 1px solid #eee;
        }
      }
    }
    .header-submenu-border {
      display: inline-block;
      vertical-align: top;
      margin: 0 0 0 26px;
      background: #fff;
      height: 100%;
      width: 1px;
    }
    .submenu-list-banner {
      width: 118px;
      height: 64px;
      margin-top: 14px;
      &:first-child {
        margin-top: 1px;
      }
    }
  }
}
.nav-logo {
  margin-top: 7px;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  background: url(~assets/images/common/azazie_logo_fixed.svg) no-repeat;
  background-size: cover;
}
.right_container {
  position: unset;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: @navFixHeight;
  .header-search {
    position: absolute;
    top: 9px;
    right: 136px;
    z-index: @z-index-5;
    &-b {
      top: 15px;
      right: 189px;
    }
  }
  .account_operation {
    background-color: #fff;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      position: relative;
      cursor: pointer;
      margin-left: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      &:nth-child(1) {
        margin-left: 0;
      }
      a.account-a {
        max-width: 120px;
        height: 18px;
        color: #101010;
        display: flex;
        justify-content: center;
        align-items: center;
        &.ht_bag_fixed {
          position: relative;
          div {
            font-size: 12px;
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
        .az-icon {
          font-size: 18px;
          fill: var(--color-121212);
        }
      }
      .msg_bubble {
        background-color: var(--color-121212);
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
      .submenu {
        color: #101010;
        background: #fff;
        border: 1px solid #ccc;
        padding: 15px 20px;
        position: absolute;
        left: auto;
        top: 40px;
        text-align: left;
        &.sign-submenu {
          right: -60px;
          z-index: @z-index-5;
          .color-activity-info {
            font-size: 12px;
            color: #666;
            width: 198px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
            margin-bottom: 6px;
            .welcome {
              font-weight: 600;
              margin-bottom: 5px;
            }
            .des {
              font-weight: normal;
              span {
                color: @theme;
              }
            }
          }
        }
        &.submenu-logined {
          right: -50px;
        }
        li {
          display: block;
          margin: 0;
          padding: 6px 0 6px 0px;
          float: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
        }
        .username {
          max-width: 198px;
          font-style: italic;
          color: #666;
          cursor: default;
          padding-right: 1px;
        }
        a {
          .text-link(@gray);
          background: #fff;
          padding: 0;
          height: auto;
        }
        &.popCart {
          width: 349px;
          padding: 0;
          z-index: @z-index-5;
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
            .cart-box-btn-content {
              background-color: var(--color-ffffff);
              position: sticky;
              bottom: 0;
            }
          }
          border: 1px solid #e1e1e1;
          left: auto;
          right: -88px;
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
                  font-size: 12px;
                  font-family: @font-family-600;
                  color: var(--color-121212);
                  line-height: 12px;
                }
              }
              .name,
              .value {
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
                .goods-price-box {
                  .current-price {
                    color: @theme;
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
            ul {
              li {
                a {
                  position: relative;
                  white-space: nowrap;
                  color: var(--color-121212);
                  .icon-tag {
                    height: 15px;
                    position: absolute;
                    top: -7px;
                    padding: 0;
                  }
                  &:hover {
                    color: var(--color-121212);
                  }
                  &.theme-color {
                    color: var(--color-121212);
                  }
                  &.highlight {
                    color: var(--color-121212);
                  }
                  &.bold {
                    font-family: @font-family-600, sans-serif;
                  }
                  &.space {
                    margin-left: 10px;
                    display: inline-block;
                  }
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
                  background: @theme;
                  color: #fff;
                  .icon {
                    height: 15px;
                    width: 20px;
                    fill: currentColor;
                    margin-right: 5px;
                  }
                  &:hover {
                    background: var(--color-1e1e1e);
                  }
                }
                .to_checkout {
                  border: 1px solid @theme;
                  background: #fff;
                  color: @theme;
                  .icon {
                    height: 13px;
                    width: 18px;
                    fill: currentColor;
                    margin-right: 5px;
                  }
                  &:hover {
                    background: var(--color-f1e9e6);
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
        &.showroom_sub {
          z-index: @z-index-5;
          .showroom_name {
            display: inline-block;
            max-width: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
          }
        }
      }
      .dropdown.over {
        .submenu {
          display: block;
        }
      }
      .ht_country_fixed {
        line-height: 48px;
        font-size: 20px;
        .az-icon {
          width: 18px;
        }
      }
      &.hover-li:hover::after {
        position: absolute;
        bottom: 6px;
        content: '';
        width: 100%;
        height: 3px;
        background-color: var(--color-121212);
        z-index: @z-index-6;
        animation: hoverIn 0.3s ease 0.3s forwards;
        transition: 0.3s;
        opacity: 0;
      }
      @keyframes hoverIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }
}

// 自适应添加

.header-submenu-border {
  display: none;
}

.nav-logo {
  &.nav-logo-nofix {
    display: none;
  }
  &.nav-logo-fix {
    display: block;
  }
}

.right_container {
  &.right_container_nofix {
    display: none;
  }
  &.right_container_fix {
    display: block;
  }
}

.adaptive-header-nav-dot .header-nav-box-out-box {
  @media screen and (max-width: 1262px) {
    .header-nav-box {
      width: 100%;
      min-width: 768px;
      padding: 0 20px !important;
      margin: 0 auto;
    }

    .header-submenu-normal {
      margin-right: 26px;
      &.header-submenu-normal-last {
        margin-right: 0;
      }
    }
    .nav-sub-menu {
      .desktop-wrapper {
        width: 100%;
        min-width: 768px - 30px;
        .header-submenu .submenu-img-box {
          .submenu-img-item {
            .item-link {
              height: unset;
              img {
                height: auto;
                width: auto;
                max-width: 100%;
                vertical-align: middle;
              }
              .item-link-title {
                bottom: unset;
                top: 100%;
              }
            }
          }
          .submenu-img-item.swatch-fabric-box {
            margin: 0;
          }
        }
        .submenu-img-box {
          .header-submenu-border {
            display: none;
          }
        }
      }
      .item-link-title {
        overflow: hidden;
        span {
          max-width: 100%;
          line-height: 18px;
          word-break: break-word;
          white-space: break-spaces;
        }
      }
    }
  }
  @media screen and (max-width: 1023px) {
    .arrow-btn {
      height: @navFixHeight;
      line-height: @navFixHeight;
      right: 220px;
    }
    .nav-sub-menu {
      padding-left: 15px;
      padding-right: 15px;
      min-width: 768px;
    }
    .nav-fixed {
      overflow: initial;
    }
    .header-nav-box .nav-wrap .nav {
      justify-content: flex-start;
      padding-left: 15px;
      padding-right: 15px;
      overflow: auto;
      margin-right: 30px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .nav-wrap .nav .nav-item {
      line-height: @navFixHeight;
      height: @navFixHeight;
    }
    .nav-logo {
      &.nav-logo-nofix {
        display: block;
      }
    }
    .right_container {
      &.right_container_nofix {
        display: block;
      }
      .header-search {
        right: 115px;
      }
    }
  }
}

.nav-item {
  .nav-item-box {
    .nav-a-link {
      &.space {
        color: @theme-color!important;
      }
    }
  }
  &.nav-hover {
    .nav-a-link {
      color: @theme-color!important;
      &::after {
        background-color: @theme-color!important;
      }
    }
  }
  .nav-a-link:hover {
    color: @theme-color!important;
    &::after {
      background-color: @theme-color!important;
    }
  }
}

@media screen and (max-width: 900px) {
  .adaptive-header-nav-dot .header-nav-box-out-box .nav-sub-menu .item-link-title {
    height: auto;
    padding: 4px 0;
    span {
      font-size: 12px;
      line-height: 16px;
      min-height: 32px;
    }
  }
}
.BRIDES .submenu-list-banner {
  width: 147px !important;
}
@media screen and (max-width: 1360px) {
  .nav-sub-menu .desktop-wrapper .header-submenu-swatches {
    .submenu-img-item.swatch-fabric-box {
      &:last-child {
        border: none;
      }
    }
  }
  .nav-sub-menu .desktop-wrapper .header-submenu .submenu-img-box .submenu-img-item.swatch-fabric-box .item-link {
    max-width: 97%;
    height: unset;
    img {
      vertical-align: middle;
    }
    .item-link-title {
      bottom: -40px;
    }
  }
}
.two-line {
  display: flex;
  &.CA {
    margin-top: 10px;
  }
  ul {
    &:nth-child(1) {
      margin-right: 40px;
    }
    li {
      &:nth-child(1) {
        margin-top: 0 !important;
      }
      a {
        white-space: nowrap !important;
      }
    }
  }
}
img.doll-house-collection {
  width: 13px;
  vertical-align: middle;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2.5) {
  .goods_scroll {
    max-height: 320px !important;
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .goods_scroll {
    max-height: 235px !important;
  }
}
</style>
