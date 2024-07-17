<template>
  <div id="nuxt-main-base" :class="{ 'adaptive-box': adaptive }" class="main-box">
    <SvgHeader />
    <SvgCommon />
    <SvgOrder v-if="!['index', 'list', 'product'].includes(jsKey)" />
    <template v-if="isSimple">
      <top-notification v-if="showModle" :notification="navigation.notification"></top-notification>
      <az-header-simple></az-header-simple>
    </template>
    <div v-else :class="['sticky-header', { 'header-fixed': headerFixed }]" :style="{ transform: `translateY(-${headerTranslate}px)` }">
      <top-notification v-if="showModle" :notification="navigation.notification"></top-notification>
      <template>
        <az-header-activity
          id="az-header-activity"
          v-if="(dbLandingPage || newBarData.length > 0) && isAllowedShow"
          :barData="newBarData"
          @show-new-coustom="(bol) => (isNewUserCoupon = bol)"
        ></az-header-activity>
        <az-header-topbar v-else-if="showModle"></az-header-topbar>
      </template>
      <az-header-logo ref="azHeaderLogo" @refreshUser="getUserInfo" @refreshCart="getCartInfo" v-if="!onlyFixedHeader"></az-header-logo>
      <bridal-header-nav
        ref="bridalHeaderNav"
        v-if="isBridal"
        :adaptive="adaptive"
        :class="{
          'adaptive-header-nav-dot': adaptive
        }"
        :isBridal="isBridal"
        @refreshCart="getCartInfo"
        @refreshUser="getUserInfo"
        @styleQuizBtnClick="styleQuizShow = true"
      ></bridal-header-nav>
      <az-header-nav
        ref="azHeaderNav"
        v-else
        :adaptive="adaptive"
        :class="{
          'adaptive-header-nav-dot': adaptive
        }"
        @refreshCart="getCartInfo"
        @refreshUser="getUserInfo"
        @styleQuizBtnClick="styleQuizShow = true"
        @clickTuxedos="showTuxedosInfo = true"
        :onlyFixedHeader="onlyFixedHeader"
      ></az-header-nav>
    </div>
    <events-menus v-if="showEventsMenus"></events-menus>
    <slot></slot>
    <az-footer-copyright v-if="isSimple"></az-footer-copyright>
    <az-footer
      v-else
      :isFlashSalePage="isFlashSalePage"
      :isShowSubscribe="isShowSubscribe"
      :has-coupon="hasGetNewUserCoupon"
      @subscribe-submit="subscribeSubmit"
    ></az-footer>
    <LoginBox ref="login_box" :createAccountLayerShow.sync="createAccountLayerShow" :newGuestLoginLayer.sync="newGuestLoginLayer" />
    <client-only>
      <!-- 登录注册等相关弹框 end -->
      <template v-if="!isSimple">
        <style-quiz-layer v-if="styleQuizShow" @close="close"></style-quiz-layer>
        <!-- cybermonday-landing-page 活动页, kk预售列表页。隐藏其他弹框 -->
        <template v-if="!['cybermonday-landing-page', 'preorder-list', 'welcome'].includes(jsKey)">
          <popup-activity-content
            v-show="popupActivityContentShow"
            :activityContentData="activityContentData"
            v-if="!is_chrome_lighthouse"
          ></popup-activity-content>
          <activity-tag v-if="isShowActivityTag && showActivityTag" :activityContentData="activityContentData"></activity-tag>
          <lucky-wheel
            v-else-if="!isNewUserCoupon && luckyWheelShow"
            :expand="couponExpand"
            :firstOpen="firstOpen"
            @expandChange="expandChange"
            @firstOpenChange="firstOpenChange"
            @showCouponWheel="showCouponWheel"
            :couponWheelConfig="couponConfig"
          ></lucky-wheel>
          <template v-if="!isNewUserCoupon">
            <az-overlay v-if="azOverlayShow" :z-index="12" @click="firstOpenChange" />
            <newcomer-discount
              v-if="newcomerShow && couponConfig && !activityContentData && !isBridal"
              :config-data="couponConfig"
              :auto-show="firstOpen"
            ></newcomer-discount>
            <dialog-coupon v-if="newCouponList.length" :visible="!!(showDialogCoupon && !newCouponPopClick)"></dialog-coupon>
          </template>
        </template>
        <az-tuxedos :visible.sync="showTuxedosInfo"></az-tuxedos>
        <template v-if="dbLandingPage || jsKey == 'welcome'">
          <shopping-for-dialog :visible="showShoppingForDialog"></shopping-for-dialog>
          <david-bridal-promo-codes v-if="davidBridalCoupons.length" :coupons="davidBridalCoupons"></david-bridal-promo-codes>
        </template>
      </template>
      <create-edit-list v-if="showCreateStoreList" :visible="showCreateStoreList"></create-edit-list>
      <!-- AZWEB-21824 新客弹窗替换coupon wheel,弹窗和侧边入口优先级低于daily promotion活动弹窗和侧边banner，高于coupon wheel-->
      <template v-if="isNewUserCoupon && !isShowActivityTag">
        <!-- 第一步和第二步弹窗中关闭弹窗后，均在页面右侧展示侧边入口 -->
        <transition name="newUserCoupon">
          <SlideNewUserCoupon v-if="showSlideNewUserCoupon" :expand="couponExpand" @expandChange="newUserHandleExpand" />
        </transition>
        <CenterNewUserCoupon @handle-box="handleNewUser" />
      </template>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import StyleQuizLayer from '@/components/static/StyleQuizLayer'
import AzHeaderActivity from '@/components/common/AzHeaderActivity'
import PopupActivityContent from '@/components/promotion/PopupActivityContent'
import ActivityTag from '@/components/promotion/ActivityTag'
import { createThrottle, getQueryString } from '@/assets/js/utils'
import { handleGDPR, eurCountryCode } from '@/assets/js/webCookiesMap'
import EventsMenus from '@/components/list/EventsMenus'
import DialogCoupon from '@/components/coupon/DialogCoupon'
import { getSourceTagFun } from '@/assets/js/commonFun'
import _$ from '@/plugins/delegate'
import showRoomUtil from '@/plugins/showroomFav'
import ShoppingForDialog from '@/components/landingPage/ShoppingForDialog' // bd推广弹框
import DavidBridalPromoCodes from '@/components/landingPage/DavidBridalPromoCodes'
import AzLoading from '@/components/az-ui/AzLoading'
import { countryList } from '@/assets/js/euSizeMap'
import CreateEditList from '@/components/storefront/CreateEditList'
import { cachedBiAjax } from '@/assets/js/point'
import CenterNewUserCoupon from '@/components/coupon/CenterNewUserCoupon'
import SlideNewUserCoupon from '@/components/coupon/SlideNewUserCoupon'
import SvgHeader from '@/components/svgs/SvgHeader'
import SvgCommon from '@/components/svgs/SvgCommon'
import SvgOrder from '@/components/svgs/SvgOrder'
import AzHeaderTopbar from './common/AzHeaderTopbar'
import AzHeaderLogo from './common/AzHeaderLogo'
import BridalHeaderNav from './bridal/BridalHeaderNav'
import AzFooter from './common/AzFooter'
import topNotification from './common/TopNotification'
import AzHeaderNav from './common/AzHeaderNav'
import AzHeaderSimple from './common/AzHeaderSimple'
import AzFooterCopyright from './common/AzFooterCopyright'
import LuckyWheel from './coupon/LuckyWheel'
import NewcomerDiscount from './coupon/NewcomerDiscount'
import AzTuxedos from './common/AzTuxedos'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const LoginBox = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/common/LoginBox'),
  loading: AzLoading
})

const commonLanguageKeys = [
  'page_pager_prev',
  'page_pager_next',
  'page_common_colors',
  'page_common_modest',
  'page_common_size',
  'page_custom_size',
  'page_common_remove',
  'page_common_new_capital',
  'page_showroom_quick_shop',
  'page_back_to_top',
  'page_js_enter_valid_add',
  'page_common_here',
  'page_order_add2bag',
  'page_common_out_of_stock',
  'page_common_only',
  'page_product_only',
  'page_product_only_unit',
  'page_common_sold_out',
  'page_common_buy_now',
  // login
  'page_login_sign_in',
  'page_login_mail_only',
  'page_login_enter_email',
  'page_email_enter_valid',
  'page_login_check_email_format',
  // showroom
  'page_common_my_showroom',
  'page_common_createshowroom',
  'page_common_remove_favorites_confirm_tip', // 接口里
  'page_common_quantity',
  'page_lucky_wheel_processing_text',
  'page_common_color',
  'page_common_sash_color',
  'page_notify_me',
  'page_index_shop_now',
  // quickShopDialog
  'page_common_new_dress',
  'page_common_size_order_new_part',
  'page_common_update',
  'page_common_choose_it',
  'page_error_something_wrong',
  /* style quiz start */
  'page_common_style_beach_destination',
  'page_common_style_chic_modern',
  'page_common_style_romantic',
  'page_common_silhouette_a_line',
  /* style quiz end */
  /* mixin */
  'page_common_gst_included',
  'page_common_vat_included'
]

export default {
  name: 'MainApp',
  languageKeys: [
    'page_wgd_coupon_box_text1',
    'page_common_sod_coupon_top_img_pc',
    'page_common_sod_coupon_top_link',
    ...countryList.map((v, i) => 'page_image_bar_to_wgd_' + v),
    ...countryList.map((v, i) => 'page_topbar_towgd_link_' + v),
    ...commonLanguageKeys,
    ...AzFooter.languageKeys,
    ...AzHeaderNav.languageKeys,
    ...AzHeaderLogo.languageKeys,
    ...StyleQuizLayer.languageKeys,
    ...AzFooterCopyright.languageKeys,
    ...LuckyWheel.languageKeys,
    ...AzHeaderActivity.languageKeys,
    ...DialogCoupon.languageKeys,
    ...CreateEditList.languageKeys,
    ...CenterNewUserCoupon.languageKeys,
    ...SlideNewUserCoupon.languageKeys
  ],
  components: {
    AzOverlay,
    AzFooter,
    topNotification,
    AzHeaderTopbar,
    AzHeaderNav,
    AzHeaderLogo,
    StyleQuizLayer,
    AzHeaderSimple,
    AzFooterCopyright,
    LuckyWheel,
    AzHeaderActivity,
    PopupActivityContent,
    ActivityTag,
    NewcomerDiscount,
    BridalHeaderNav,
    EventsMenus,
    DialogCoupon,
    ShoppingForDialog,
    DavidBridalPromoCodes,
    AzTuxedos,
    LoginBox,
    CreateEditList,
    CenterNewUserCoupon,
    SlideNewUserCoupon,
    SvgHeader,
    SvgCommon,
    SvgOrder
  },
  props: {
    adaptive: {
      type: Boolean,
      default: false
    },
    isSimple: {
      // 是否有导航栏等公共组件，比如，checkout 页面就没有
      type: Boolean,
      default: false
    },
    prodList: {
      // 列表、详情的商品
      type: Array,
      default() {
        return []
      }
    },
    onlyFixedHeader: {
      // 只展示固定头部，比如 flash-sale 页面
      type: Boolean,
      default: false
    },
    isFlashSalePage: {
      // 是否是 flashSalePage 页面
      type: Boolean,
      default: false
    },
    isShowSubscribe: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      newGuestLoginLayer: false,
      createAccountLayerShow: false,
      styleQuizShow: false,
      couponWheelShow: false, // 大转盘弹框
      couponExpand: false,
      couponConfig: null, // coupon wheel以及新用户活动相关配置数据
      newcomerShow: false, // 控制新用户优惠活动组件是否展示
      // sizes 分类 1024  768
      sizes: [],
      firstOpen: false,
      messageBtnDom: null,
      scrollTop: 0,
      headerTranslate: 0,
      activityTime: {
        startTime: '',
        endTime: ''
      },
      showActivityTag: false,
      showDialogCoupon: false, // dialog coupon组件展示限制条件，默认不展示，根据条件判断是否展示
      distance: 0,
      startTimer: null,
      beginTime: 0,
      speed: 0,
      utmCampaign: [
        'signup',
        'appdownload1',
        'appdownload2',
        'subscriber',
        'weddingapproaching',
        'studentdiscount',
        'studentdiscount2',
        'couponwheel',
        'swatchcouponexpire',
        'swatch_shipping14d',
        'swatch_shipping21d'
      ],
      btns: [],
      polarisTimer: null,
      gdprTimer: null,
      gdprCount: 0,
      gdprDelay: 500,
      azZendeskShow: false,
      showTuxedosInfo: false, // 展示tuxedos提示信息
      isNewUserCoupon: false, // 是否是新版新用户领取券包活动期间
      hasGetNewUserCoupon: false // 是否领取过新户coupon
    }
  },
  computed: {
    ...mapState({
      showSlideNewUserCoupon: (state) => state.showSlideNewUserCoupon,
      showNewUserCoupon: (state) => state.showNewUserCoupon,
      favGoodsList: (state) => state.product.favGoodsList,
      validCheckoutGoodsList: (state) => state.cart.validCheckoutGoodsList,
      payProductList: (state) => state.checkout.payProductList,
      orderAllList: (state) => state.checkout.orderAllList,
      newCouponList: (state) => state.userInfo.newCouponList,
      newCouponPopClick: (state) => state.userInfo.newCouponPopClick,
      davidBridalCoupons: (state) => state.userInfo.davidBridalCoupons,
      presaleGoods: (state) => state.product.presaleGoods,
      showSignLayer: (state) => state.showSignLayer, // 是否展示登录弹框
      showCreateStoreList: (state) => state.list.showCreateStoreList // 是否展示创建门店收藏列表
    }),
    barData() {
      const barData = []
      for (const i in this.activityInfo) {
        const activity = this.activityInfo[i]
        //  jira:15863  catId：2,7,8,9,45,158 列表、详情页不展示wdg横幅活动(371)
        const wgdBarHide =
          activity.base &&
          activity.base.activityId == 371 &&
          ['list', 'product'].includes(this.jsKey) &&
          this.catId &&
          [2, 7, 8, 9, 45, 158].includes(this.catId)
        if (activity.bar && activity.bar[activity.base.status] && !wgdBarHide) {
          barData.push({
            couponCode: activity.base.couponCode || '',
            bar: activity.bar[activity.base.status],
            status: activity.base.status,
            countdownEndTime: activity.base.countdownEndTime
          })
        }
      }
      if (this.dbLandingPage && barData.length) {
        // db推广替换横幅第一位
        barData.slice(1, barData.length)
      }
      return barData
    },
    newBarData({ hasGetNewUserCoupon, barData }) {
      if (!hasGetNewUserCoupon) {
        return barData
      } else {
        return barData.slice(0, barData.length - 1)
      }
    },
    activityContentData() {
      let activityContentData
      for (const i in this.activityInfo) {
        const activity = this.activityInfo[i]
        if (activity.banner && activity.banner.activityBanner && activity.banner.activityBanner.barBanner) {
          activityContentData = activity.banner.activityBanner
          break
        }
      }
      return activityContentData
    },
    // 是否允许展示
    isAllowedShow({ jsKey }) {
      return !['checkout', 'checkoutSuccess'].includes(jsKey)
    },
    // comments: luck-wheel 展示
    luckyWheelShow({ isBridal, couponWheelShow, couponConfig, activityContentData, hideCouponWheel }) {
      return (
        !isBridal && couponWheelShow && couponConfig && Object.keys(couponConfig).length > 0 && !activityContentData && !hideCouponWheel
      )
    },
    // comments: 固定mask层
    azOverlayShow({ firstOpen, activityContentData, couponWheelShow, isBridal, newcomerShow, hideCouponWheel }) {
      return firstOpen && !activityContentData && couponWheelShow && !isBridal && !newcomerShow && !hideCouponWheel
    },
    showEventsMenus({ wgdListDetailPage, catName, catId, $route }) {
      // 17575 jewlery列表页顶部露出卖点，支持lego配置
      if (catId == 3076 && ['Jewelry', 'jewelry'].includes(catName)) {
        return ['list', 'product'].includes($route.name)
      }
      return (
        (wgdListDetailPage && catName != 'ready-to-ship-party') ||
        ($route.path.includes('/all/shoes-and-bags') && !$route.path.includes('/all/shoes-and-bags-for-bridal'))
      )
    },
    wgdListDetailPage({ country, $route, catId, presaleGoods }) {
      // comments: jira:16756 wgd 列表页 详情页
      // 批量转rts列表页面不展示sodcoupon
      return (
        ((['list', 'product'].includes($route.name) && this.isSpecialCatId(catId)) || presaleGoods) &&
        !($route.path.includes('/special-offer') || this.$store.state.product.baseInfo.isFinalSale)
      )
    },
    // 不是flashSalePage页面且允许展示模块
    showModle({ isAllowedShow, isFlashSalePage }) {
      return !isFlashSalePage && isAllowedShow
    },
    // daily promotion活动弹窗和侧边banner
    isShowActivityTag({ jsKey, activityContentData, isBridal }) {
      return !['cart', 'checkout'].includes(jsKey) && activityContentData && !isBridal
    },
    // AZWEB-21852 默认进商详页不弹couponwheel,兼容老用户侧边显示
    hideCouponWheel() {
      if (process.client) {
        const startTime = this.$cookie.getCookie('coupon-start')
        if (this.jsKey == 'product' && !startTime) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    isLogin: {
      handler(val, old) {
        if (val) {
          if (this.showRoomNum + this.storeRoomNum > 0) {
            if (this.prodList && this.prodList.length > 0) {
              this.getFavGoodsList()
            }
          }
        }
      },
      immediate: true
    },
    azZendeskShow() {
      if (this.azZendeskShow) {
        if (window.zE) {
          this.setPoint('chatbot', 'zendesk', 'view')
          window.zE('webWidget:on', 'open', () => {
            this.setPoint('chatbot', 'zendesk', 'click')
          })
        }
      }
    }
  },
  created() {
    if (process.client) {
      this.getLocationCode()
      this.initWGDUserTagCookie()
      this.getUserInfo()
      this.getNavigationDynamic()
      if (!this.isSimple && this.$route.name !== 'cart') {
        // 购物车页面不请求这个公共的接口，因为这个接口不会自动获取coupon，会导致购物车请求的时候数据跟本身的数据错乱
        this.getCartInfo()
      }
    }
  },
  mounted() {
    // 分享订单追踪
    if (this.$route.query.share_channel) {
      const mainValue = JSON.parse(this.$localStorage.getLocalStorage('OrderTracking'))
      for (const trackKey in mainValue) {
        if (trackKey.indexOf('share_') == 0) {
          delete mainValue[trackKey]
        }
      }
      // 更新配置
      this.$localStorage.setLocalStorage('OrderTracking', JSON.stringify(mainValue))
      this.setOrderSourceFlag(`share_${this.$route.query.share_channel}`, true)
    }
    this.handleQueryAbtest()
    // 离开checkout要将存储的 sodCouponCode 删除
    if (this.$route.name != 'checkout') {
      localStorage.removeItem('sodCouponCode')
    }
    // 来源非/collection/all的路径，移除FROM_COLLECTION_ALL
    if (!document.referrer.includes('/collection/all')) {
      localStorage.removeItem('FROM_COLLECTION_ALL')
    }

    // DB landing page 推广 cookie有效期设置6天
    if (this.$route.query.type && this.$route.query.type == 'db') {
      this.$cookie.setCookie('db_landing_page', true, 6, '.' + this.APP_DOMAIN_LOWER)
    }
    // 这里是为了处理之前 login_token种的时候没有设置时间和domain,导致和后端不一致，www.azazie.com 下的token没有被清掉，影响游客用户登录正式账号
    if (!this.environment.includes('dev')) this.$cookie.removeCookie('login_token')
    // 设置国家cookie缓存
    this.$cookie.setCookie('CountryCode', this.country, 30, '.' + this.APP_DOMAIN_LOWER)
    // 因为多货币，多语言的需求，货币和语言也要进行cookie缓存
    // 设置货币cookie缓存
    this.$cookie.setCookie('Currency', this.currencyCode, 30, '.' + this.APP_DOMAIN_LOWER)
    // 设置语言cookie缓存
    this.$cookie.setCookie('Language', this.language, 30, '.' + this.APP_DOMAIN_LOWER)
    if (this.$route.query.country || this.$route.query.client_id) {
      // 路径国是否发生变化，发生变化，也需要种
      this.$cookie.setCookie('domain_accessed', 1, 180, '.' + this.APP_DOMAIN_LOWER)
    }
    // 解决本地未登录态加车无法在购物车查看的问题
    if (this.environment.includes('dev') && this.$store.state.AZSID) {
      this.$cookie.setCookie('AZSID', this.$store.state.AZSID, 7, 'localhost')
    }
    const criteoCookieHeader = this.$cookie.getCookie('criteo_cookie_header')
    if (criteoCookieHeader === null) {
      this.$cookie.setCookie('criteo_cookie_header', '1', 1)
    }
    const criteoPermCookie = this.$cookie.getCookie('criteo_cookie_perm')
    if (criteoPermCookie === null) {
      this.$cookie.setCookie('criteo_cookie_perm', '1', 1)
    }

    this.markReferer()
    this.bindGtmEvent()
    this.couponWheelFunc()

    this.$nextTick(() => {
      if (document.querySelectorAll('.style_quiz_banner').length > 0) {
        const classObj = document.querySelectorAll('.style_quiz_banner')
        for (let i = 0; i < classObj.length; i++) {
          classObj[i].addEventListener('click', () => {
            this.styleQuizShow = true
          })
        }
      }
      const biServerCached = this.$store.state.analysis.biServerCached
      for (let i = 0; i < biServerCached.length; i++) {
        if (biServerCached[i]) this.buryPoint(this, biServerCached[i].type, biServerCached[i].opts)
      }
      this.$store.commit('analysis/recoverBiServerCached')
    })

    // 重置订单追踪的版本
    const mainValue = JSON.parse(this.$localStorage.getLocalStorage('OrderTracking'))
    // try on 的订单追踪
    if (mainValue) {
      delete mainValue.VersionA_tryon
      // 更新配置
      this.$localStorage.setLocalStorage('OrderTracking', JSON.stringify(mainValue))
    }

    if (!this.isSimple) {
      this.handleScrollThrottle = createThrottle(this.handleScroll.bind(this))
      window.addEventListener('scroll', this.handleScrollThrottle)
    }
    // db推广弹框是否打开过
    const shoppingForDialogOpened = this.$cookie.getCookie('shoppingForDialogOpened')
    // comments: 落地页
    const referrer = document.referrer
    if (!referrer || (referrer && !referrer.includes('.azazie.') && !referrer.includes('localhost'))) {
      this.openCouponWheel(shoppingForDialogOpened)
    } else if (this.wgdListDetailPage || (!shoppingForDialogOpened && this.dbLandingPage)) {
      this.couponWheelShow = false
      this.showActivityTag = false
      setTimeout(() => {
        if (!shoppingForDialogOpened && this.dbLandingPage) {
          this.$store.commit('setShowShoppingForDialog', true)
        }
      }, 3000)
    } else {
      this.showActivityTag = true
      this.initCouponWheel()
    }
    window.zESettings = {
      webWidget: {
        zIndex: 9,
        color: { theme: this.isBridal ? '#fff' : '#e5bdb8 ' },
        boxShadow: this.isBridal ? '0 0 4px 0 rgba(0, 0, 0, 0.25)' : 'none'
      }
    }
    // 设置 bridal主题的颜色
    if (window.intercomSettings && this.isBridal) {
      window.intercomSettings = {
        ...window.intercomSettings,
        action_color: '#fff',
        background_color: '#fff'
      }
      window.Intercom && window.Intercom('update')
    }

    // 页面跳转，到下个页面打点
    const nextTrackObj = JSON.parse(sessionStorage.getItem('point-pre-page'))
    if (nextTrackObj) {
      const { url, parameters, path } = nextTrackObj
      cachedBiAjax(url, parameters, path)
      sessionStorage.removeItem('point-pre-page')
    }

    const { countrycode = 'US' } = this.$store.state.logsId.reqHeaders
    if (!this.is_chrome_lighthouse) {
      let counter = 0
      this.polarisTimer = setInterval(() => {
        counter++
        this.btns = document.querySelectorAll('#polaris-consent-widgets footer .polaris-button._button-button-sXeE8')
        if (this.btns.length && this.btns[Number(!eurCountryCode.includes(countrycode))]) {
          this.btns[Number(!eurCountryCode.includes(countrycode))].addEventListener('click', this.updateConsent)
        }
        if (counter >= 3 || this.btns.length) {
          clearInterval(this.polarisTimer)
        }
      }, 1000)
    }
    // 监听dom点击事件，根据第三插件 polaris 点击dom设置cookie内容
    this.$nextTick(() => {
      window.addEventListener('click', this.handleGDPRCookie)
      this.handleGDPRInterval()
    })
    this.handleChatbotPoint()
    if (['product', 'cart'].includes(this.$route.name) && (!this.isLogin || this.environment != 'prod')) {
      window.geq && window.geq.page()
    } else {
      this.retentionReject()
    }
  },
  beforeDestroy() {
    this.polarisTimer && clearInterval(this.polarisTimer)
    this.gdprTimer && clearInterval(this.gdprTimer)
    window.removeEventListener('click', this.handleGDPRCookie)
  },
  methods: {
    // 来自promotion页面，因为promotion页面右侧按钮是隐藏的
    promotionHandler() {
      this.isNewUserCoupon = true
      this.$store.commit('setShowNewUserCoupon', true)
    },
    newUserHandleExpand() {
      this.couponExpand = false
      this.$store.commit('setShowSlideNewUserCoupon', false)
      this.$store.commit('setShowNewUserCoupon', true)
    },
    // 查看用户是否领取过四个coupon
    async hasNewCoustomCoupon(email) {
      const res = await this.$axios.$get(`/1.0/coupon-wheel/v2/hasNewCustomerCoupon?email=${email}`)
      const newUserStep = localStorage.getItem('new_user_step')
      this.hasGetNewUserCoupon = res.data.hasCoupon
      if (res.code == 0 && newUserStep != 3) {
        if (res.data.hasCoupon) {
          this.initShowDialogCoupon()
        } else {
          this.getNewUser()
        }
      }
    },
    // 处理新用户领取券包
    async getNewUser() {
      if (!['cart', 'checkout', 'checkoutSuccess', 'my_orders', 'OrderDetail', 'login', 'barbie'].includes(this.jsKey)) {
        if (this.isNewUserCoupon) return
        const res = await this.$axios.$get('/1.0/coupon-wheel/v2/useful')
        if (res.code == 0) {
          const timer = setTimeout(() => {
            this.isNewUserCoupon = res.data.useful
            if (this.isNewUserCoupon) this.handleInteraction()
            clearTimeout(timer)
          }, 2000)
        }
      }
    },
    handleNewUser() {
      if (!this.isNewUserCoupon) return
      const newUserClose = localStorage.getItem('new_user_close')
      const newUserStep = localStorage.getItem('new_user_step')
      if (newUserStep != 3) {
        // 3 才算领取成功
        if (newUserClose || this.jsKey == 'product') {
          // 第一步和第二步弹窗中关闭弹窗后，均在页面右侧展示侧边入口
          // 详情只展示侧边入口
          this.$store.commit('setShowSlideNewUserCoupon', true)
        } else {
          this.$store.commit('setShowNewUserCoupon', true)
        }
      } else {
        this.hasGetNewUserCoupon = true
        this.$store.commit('setShowSlideNewUserCoupon', false)
      }
    },
    // 监听页面交互
    handleInteraction() {
      const events = ['click', 'touchstart', 'touchmove', 'keydown', 'scroll', 'mousewheel', 'resize']
      let flag = false
      const wgdFun = (e, event) => {
        if (flag) return
        if ((event == 'click' && !['A', 'IMG'].includes(e.target.tagName)) || event !== 'click') {
          // 有交互再触发弹框
          flag = true
          this.handleNewUser()
        }
      }
      for (let i = 0; i < events.length; i++) {
        if (flag) {
          break
        }
        window.addEventListener(events[i], (e) => {
          wgdFun(e, events[i])
        })
      }
    },
    resetHandleGDPRInterval() {
      clearInterval(this.gdprTimer)
      this.gdprCount = 0
      this.gdprDelay = 500
      this.handleGDPRInterval()
    },
    handleGDPRInterval() {
      this.gdprTimer = setInterval(() => {
        handleGDPR(this)
        this.gdprCount++
        if (this.gdprCount >= 10) {
          this.gdprDelay += 5000
          clearInterval(this.gdprTimer)
          this.handleGDPRInterval()
        }
        if (this.gdprDelay >= 1000 * 30) {
          clearInterval(this.gdprTimer)
        }
      }, this.gdprDelay)
    },
    handleGDPRCookie(e) {
      const classList = Array.from(e.target.classList)
      // 点击的dom是button且类名包含 polaris-button 和 _button-button-sXeE8
      if (e.target.nodeName === 'BUTTON' && classList.includes('polaris-button') && classList.includes('_button-button-sXeE8')) {
        handleGDPR(this)
        this.resetHandleGDPRInterval()
      } else if (e.target.nodeName == 'SPAN' && e.target.offsetParent && e.target.offsetParent.className == '_toggle-toggle-ukiWP') {
        handleGDPR(this)
        this.resetHandleGDPRInterval()
      }
    },
    // 因为coupon wheel是根据接口来显示，所以showDialogCoupon参数需要在接口操作后设置，要不然会出现弹框顺序不对问题
    initShowDialogCoupon() {
      // ！！！不加定时器延迟执行，大转盘会出现translate动作，暂不明具体原因
      const timer = setTimeout(() => {
        const otherPopup = (this.luckyWheelShow && this.firstOpen) || this.newcomerShow
        this.showDialogCoupon =
          !['cart', 'checkout', 'checkoutSuccess'].includes(this.$route.name) &&
          this.newCouponList.length &&
          !this.newCouponPopClick &&
          !otherPopup
        clearTimeout(timer)
      }, 20)
    },
    // 页面往上滚动时，露出整个头部,向下滚动只显示nav
    handleScroll() {
      let offsetTop = 0
      if (document.getElementById('top-notification')) {
        offsetTop += document.getElementById('top-notification').offsetHeight
      }
      if (document.getElementById('header-topbar')) {
        offsetTop += document.getElementById('header-topbar').offsetHeight
      }
      if (document.getElementById('az-header-activity')) {
        offsetTop += document.getElementById('az-header-activity').offsetHeight
      }
      if (document.getElementById('wgd-top-bar')) {
        offsetTop += document.getElementById('wgd-top-bar').offsetHeight
      }
      let translateY = 0
      if (document.getElementById('header-log')) {
        const headerLog = document.getElementById('header-log')
        const height = headerLog.offsetHeight
        if (height) {
          // offsetTop += height
          translateY = offsetTop + height
        }
      }
      const newScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

      if (newScrollTop > offsetTop && newScrollTop > this.scrollTop) {
        this.$store.commit('setHeaderFixed', true)
        this.headerTranslate = translateY
      } else if (newScrollTop < translateY && newScrollTop < this.scrollTop) {
        this.$store.commit('setHeaderFixed', false)
        this.headerTranslate = 0
      }

      if (newScrollTop > 0) {
        this.$store.commit('setScrollToTop', true)
      } else {
        this.$store.commit('setScrollToTop', false)
      }

      // ---以下代码判断页面滚动速度---
      const timeScale = 100 // 检测滚动停止的时间
      this.distance += newScrollTop - this.scrollTop // 间隔时间内滑动的距离(+向下，-向上)
      clearTimeout(this.startTimer) // 清除开始定时器
      if (!this.beginTime) {
        this.beginTime = new Date().getTime() // 如果timer为0,则开始滚动,则获取起始时间
        // console.log(beginTime)
      }
      this.startTimer = setTimeout(() => {
        // 设置开始定时器
        const overTime = new Date().getTime() // 延时100ms后，滚动后结束的时间
        // console.log(overTime)
        const diffTimer = (overTime - this.beginTime - timeScale) / 1000 // 时间差 = 结束-开始-100ms
        this.speed = this.distance / diffTimer
        this.distance = 0 // 间隔距离归零
        this.beginTime = 0 // 起始时间
        if (this.speed < -800) {
          this.$store.commit('setHeaderFixed', false)
          this.headerTranslate = 0
        }
      }, timeScale)
      // ---以上代码判断页面滚动速度---

      this.scrollTop = newScrollTop
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
    // pageview 打点
    pageviewPoint(dp) {
      if (process.server) return
      const routeName = this.$route.name
      const pageview = {
        lgt: new Date().getTime(),
        param1: (location && location.href) || '-1',
        param3: document.referrer || '-1',
        msg: {}
      }
      if (dp) pageview.dp = dp

      if (['product', 'giftCard'].includes(routeName)) {
        pageview.msg = {
          dress_type: this.dressType,
          cat_name: this.$store.state.product.baseInfo.catName,
          category_ids: this.$store.state.product.baseInfo.catId,
          cat_id: this.$store.state.product.baseInfo.catId,
          cdn_prvd: this.cdnPrvd(this.$store.state.product.baseInfo.catId)
        }
      }
      if (['product', 'giftCard', 'search'].includes(routeName)) {
        // 通过搜索页面过来的，前端会在链接上加上from_type，表示来源，需要加在打点里面,list页面 有自己的打点
        if (this.$route.query && this.$route.query.from_type) {
          pageview.msg.from_type = this.$route.query.from_type
        }
      }
      if (this.$route.query.q && ['product', 'giftCard'].includes(routeName)) {
        // 通过搜索页面过来的，会在链接上加上q，需要加在打点里面 from_q
        pageview.msg.from_q = this.$route.query.q
      }
      // 当url中有link_id是，打点传入此数据，否则，不传入此数据
      // link_id的出现场景是网红推广链接，第一次出现会在商品详情页
      let linkId = this.$route.query.link_id
      if (linkId) {
        // 如果存在linkId，存入cookie中
        this.$cookie.setCookie('link_id', linkId, 365)
        pageview.msg.link_id = linkId
      } else {
        // 如果路径中不存在link_id，判断cookie中是否有link_id
        linkId = this.$cookie.getCookie('link_id')
        if (linkId) {
          pageview.msg.link_id = linkId
        }
      }
      // comments: 列表页pageview单独在列表页打点，因为catids因为接口异步原因，在列表页切换筛选条件时，不能实时拿到最新状态，无奈之举
      if (routeName == 'list') {
        return false
      }
      // comments: cart checkout checkoutsuccess pageview新增msg打点字段
      const orderIds = []
      let tempList = []
      if (routeName == 'checkoutSuccess') {
        for (const key in this.orderAllList) {
          orderIds.push(key)
          tempList = tempList.concat(...this.orderAllList[key])
        }
        Boolean(orderIds.join(',')) && (pageview.msg.order_ids = orderIds.join(','))
      }
      const goodsListTemp = {
        cart: this.validCheckoutGoodsList,
        checkout: this.payProductList,
        checkoutSuccess: tempList
      }
      const lpTypes = []
      const catIds = []
      if (['cart', 'checkout', 'checkoutSuccess'].includes(routeName)) {
        const list = goodsListTemp[routeName]
        list.forEach((item) => {
          if (!catIds.includes(item.catId)) {
            catIds.push(item.catId)
          }
          if (item.sourceTag) {
            const sourceTag = getSourceTagFun(null, { sourceTag: item.sourceTag }, false, null, this, item.catId)
            if (sourceTag && !lpTypes.includes(sourceTag)) {
              lpTypes.push(sourceTag)
            }
          }
        })
        Boolean(lpTypes.join(',')) && (pageview.msg.lp_types = lpTypes.join(','))
        if (routeName == 'checkout') {
          pageview.msg.category_ids = catIds.filter((a) => a).join(',')
        }
      }
      this.buryPoint(this, 'pageview', pageview)
    },
    async initCouponWheel() {
      const jskey = this.$store.state.jsKey
      if (['cart', 'checkout', 'coupon-wheel'].includes(jskey)) {
        return
      }
      // sod 预热页面不显示大转盘
      if (this.jsKey == 'atelier') return
      if (this.hideCouponWheel) return
      const resp = await this.$axios.$get('/1.0/coupon-wheel')
      if (resp.code == 0 && resp.data && resp.data.sideBar) {
        this.couponConfig = resp.data
        // promotion 页面不要自动弹
        if (this.$route.name == 'promotion') {
          return
        }
        const appearanceCycle = resp.data.sideBar.appearanceCycle || 30 // 如果没有配置活动周期，默认30天
        const duration = appearanceCycle * 24 * 3600 * 1000
        const currentTime = new Date().getTime()
        const startTime = +this.$cookie.getCookie('coupon-start')
        const endTime = (+startTime || 0) + duration
        const openTime = resp.data.sideBar.openTime || 5 // 如果没有配置打开时间，默认5s
        // comments: wgd 列表页 详情页 不展示
        if (this.wgdListDetailPage) {
          this.initShowDialogCoupon()
          return
        }
        // 用户这个周期内看到过
        if (startTime) {
          // 老用户
          // 当前还在活动时间内
          if (currentTime >= startTime && currentTime <= endTime) {
            let drawEd = false
            // 从缓存中读取临时couponCode数据
            let sessionTemp = localStorage.getItem('COUPON_CODE_TEMP')
            if (sessionTemp) {
              sessionTemp = JSON.parse(sessionTemp)
            }
            const cookieCouponStart = this.$cookie.getCookie(`coupon-start-${startTime}`)
            // 获取了券码，并且已经超过了半小时，用户券活动结束
            // 或者，缓存的券活动跟当前活动不是同一个类型，不显示当前活动
            // 或者，缓存的券活动国家与当前国家不一致，生成券后，只能在生成券的国家生效，所以不同国家不显示券结果
            const isExpire = sessionTemp && sessionTemp.expire < new Date().getTime()
            if (
              (cookieCouponStart && isExpire) ||
              (sessionTemp && sessionTemp.mode != this.couponConfig.mode) ||
              (sessionTemp && sessionTemp.country != this.country)
            ) {
              // 如果过期了，清除缓存
              if (isExpire) {
                localStorage.removeItem('COUPON_CODE_TEMP')
              }
              drawEd = true
            }
            if (drawEd) {
              // 用户抽过奖品---->隐藏侧边栏
              this.showCouponWheel(false, openTime)
            } else {
              // 收缩侧边栏
              this.showCouponWheel(true, openTime)
              this.couponExpand = false
            }
          }
        } else {
          // 新用户
          this.showCouponWheel(true, openTime)
          this.firstOpenChange(true)
          // 新用户初次进入，本地没有缓存数据，将当前时间设置为缓存，并且该参数会用于比较判断用户是否进行过操作
          this.$cookie.setCookie('coupon-start', currentTime, 365)
        }
      }
    },
    expandChange(expand) {
      this.couponExpand = expand
    },
    showCouponWheel(show, delay) {
      if (!isNaN(parseInt(delay)) && show) {
        setTimeout(() => {
          // mode为1是coupon wheel，mode为2是新用户优惠活动
          if (this.couponConfig.mode == 2) {
            this.newcomerShow = show
          } else {
            this.couponWheelShow = show
          }
        }, delay * 1000)
      } else if (this.couponConfig.mode == 2) {
        this.newcomerShow = show
      } else {
        this.couponWheelShow = show
      }
      this.initShowDialogCoupon()
    },
    async getNavigationDynamic() {
      try {
        const url = '/1.0/navigation/dynamic'
        const res = await this.$axios.$get(url, {
          params: {
            version: this.versionObj.activityAbtest && this.versionObj.activityAbtest.toLowerCase(),
            topic: this.$store.state.isBridal ? 'bridal' : 'azazie',
            countryCode: this.country,
            langs: this.language
          }
        })
        if (res.code == 0) {
          this.initActivity(res.data.activityInfo)
          if (res.data.flashSaleInfo) {
            this.$store.commit('setIsFlashSale', true)
            this.$store.commit('setFlashSale', res.data.flashSaleInfo)
          } else {
            this.$store.commit('setIsFlashSale', false)
            this.$store.commit('setFlashSale', {})
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    initActivity(activity = []) {
      const activities = []
      let cyberSaleInfo = null
      for (const key in activity) {
        const activityNow = activity[key]
        if (['CYBERWAZ', 'CYBERAZZ', 'CYBERWAZtes', 'CYBERAZZtes'].includes(activityNow.base.couponCode)) {
          let desc = ''
          if (activityNow.banner && activityNow.banner.activityBanner) {
            desc = activityNow.banner.activityBanner.desc || ''
          }
          cyberSaleInfo = {
            couponCode: activityNow.base.couponCode,
            desc
          }
        }
        const status = activityNow.base.status
        if (status == 'end' || status == 'not started') {
          continue
        }
        activities.push(activityNow)
      }
      this.$store.commit('setCyberSaleInfo', cyberSaleInfo)
      this.$store.commit('setActivityInfo', activities)
    },
    close() {
      this.styleQuizShow = false
    },
    async getUserInfo() {
      await this.$axios
        .$get(`/1.0/common/user-info`)
        .then((res) => {
          this.$store.commit('userInfo/setUserInfoDown')
          if (res.code === 0) {
            const hasLogin = res.data.userId != null && res.data.userId != undefined && res.data.userId != 0
            const firstTime = this.$cookie.getCookie('first-in-time')
            if (typeof firstTime == 'undefined' || firstTime == null || firstTime.length == 0) {
              this.$cookie.setCookie('first-in-time', res.data.firstInTime, 100 * 12 * 31)
            }
            // 放入标记位userInfoUpdated
            res.data.userInfoUpdated = true
            this.$store.commit('userInfo/updateInfo', res.data)
            if (hasLogin) {
              this.$store.commit('setShowSignLayer', false)
              if (res.data.emailHashed != undefined) {
                if (typeof window.dataLayer !== 'undefined') {
                  window.dataLayer.push({
                    event: 'UserInfo',
                    emailHashed: res.data.emailHashed ? res.data.emailHashed : 'unknown'
                  })
                }
              }
              this.$cookie.setCookie('hasLogin', 1, 7, '.' + this.APP_DOMAIN_LOWER)
              // 获取用户信息之后更新
              if (window.intercomSettings) {
                window.intercomSettings = {
                  ...window.intercomSettings,
                  name: this.userInfoName,
                  email: this.userInfoEmail,
                  user_id: this.userId,
                  user_hash: this.intercom // intercom 用户安全验证hash
                }
                window.Intercom && window.Intercom('update')
              }
              // 有用户信息，查看是否领取过新客弹窗coupon
              this.hasNewCoustomCoupon(res.data.userEmail)
            } else {
              this.$cookie.setCookie('hasLogin', 0, 7, '.' + this.APP_DOMAIN_LOWER)
              // this.syncLoginStatus()
              // 获取用户信息之后更新
              // 未登录的时候不要传用户信息，否则会被视为同一个匿名用户
              if (window.intercomSettings) {
                window.intercomSettings = {
                  ...window.intercomSettings
                }
                window.Intercom && window.Intercom('update')
              }
              // 没有用户信息，直接调用是否能弹新户coupon弹窗
              this.getNewUser()
            }
            this.$cookie.setCookie('user_id', res.data.userId || res.data.user_id || '-1', 7, '.' + this.APP_DOMAIN_LOWER)
            if (res.data.userEmail) {
              this.$cookie.setCookie('webpush_email', res.data.userEmail, 7, '.' + this.APP_DOMAIN_LOWER)
            }
            // 购物车guest checkout打点
            if (this.$route.name == 'cart') {
              if (res.data.guestCheckoutAuthorization) {
                this.setDataLayer({
                  action: 'view',
                  category: 'PC_GuestCheckout',
                  label: 'PCA_Cart_View'
                })
                this.setOrderSourceFlag('VersionA_GuestCheckout')
              } else {
                this.setDataLayer({
                  action: 'view',
                  category: 'PC_GuestCheckout',
                  label: 'PCB_Cart_View'
                })
                this.setOrderSourceFlag('VersionB_GuestCheckout')
              }
            }
            if (!this.showRoomNum) {
              // 没有收藏夹的情况下，处理session是否有要需要收藏的商品
              this.sessionAddGoodsFav()
            }
            // 当前用户可用的新券
            if (res.data.newCoupon) {
              // 保存券数据
              this.$store.commit('userInfo/setNewCouponList', res.data.newCoupon.newCouponList)
              this.$store.commit('userInfo/setNewCouponPopClick', res.data.newCoupon.newCouponPopClick)
              this.$store.commit('userInfo/setNewCouponRedPointClick', res.data.newCoupon.newCouponRedPointClick)
            }
          }
          this.$store.commit('userInfo/setWaitGetLogin', false)
        })
        .finally(() => {
          // comments: 在这里能知道是否登录了
          this.updateWGDTag()
          // comments: pageview 放到获取用户信息后面再执行，保证用户信息接口一定优先执行完毕，获取打点的用户信息
          this.pageviewPoint()
        })
    },
    markReferer() {
      const referer = document.referrer
      const url = document.URL
      const re = new RegExp(/https*:\/\/(dev|d|ft|m|mp|p|www)\.azazie\.com/)
      if (referer == '' || referer.search(re) == -1) {
        this.$axios.$post(`/1.0/common/mark-referer`, { referer, url }).then((res) => {
          if (res.code == 0) {
            this.$cookie.setCookie('JJSREF', res.data.newTag, 180, '.' + this.APP_DOMAIN_LOWER)
          }
        })
      }
    },
    bindGtmEvent() {
      const self = this
      let obj = {}
      _$('body').delegate('click', '.need_datalayer', (e, node) => {
        obj = {
          category: node.getAttribute('data-datalayer-category'),
          label: node.getAttribute('data-datalayer-label'),
          action: node.getAttribute('data-datalayer-action') || 'Click'
        }
        if (['list', 'product', 'search'].includes(this.$route.name)) {
          let ele = e.target
          while (ele.tagName != 'BODY') {
            // 之前使用的 ele.className.includes 方法，在 svg元素的时候会报错，因为svg的className是一个SVGAnimatedString对象，没有includes方法
            // 所以改成ele.classList.contains
            // 备注： 这个while循环判断代码是因为  #6041:打点追踪修改 首页，列表页，详情页，搜索页面仅保留导航栏打点。但是目前的代码里面，导航栏现在是没有gtm打点了的，代码先保留，做好容错
            if (ele && ele.classList && ele.classList.contains('header-nav-dot')) {
              self.setDataLayer(obj, true)
              break
            } else ele = ele.parentElement
          }
        } else self.setDataLayer(obj)
      })
    },
    async getCartInfo() {
      // 导航栏的购物车icon,hover上去有删除功能，删除之后获取购物车状态
      try {
        const res = await this.$axios.$get(`/1.0/cart`, {
          params: { for_checkout: 1, sodGalleryVersion: this.versionObj.sodGalleryVersion.toLowerCase(), from: 'simpleCart' }
        })
        if (res.code == 0) {
          if (res.data.summary) {
            this.$store.commit('setCartInfo', {
              totalCount: res.data.forCheckoutQty,
              prodList: res.data.checkoutGoodsList || [],
              hasLineTotal: res.data.summary.goodsAmount != res.data.summary.totalNoDealGoodsAmount,
              totalPrice: res.data.summary.goodsAmountDisplay,
              totalNoDealPrice: res.data.summary.totalNoDealGoodsAmountDisplay,
              sample_gift_goods_id: '', //  后端说这个送头纱现在没有了
              freeShippingProgress: res.data.freeShippingProgress, // 免运费进度条相关数据
              cartBundleList: res.data.cartBundleList, // buy more get more
              activityInfo: res.data.activityInfo || {}
            })
          } else {
            this.$store.commit('setCartInfo', {
              totalCount: 0,
              prodList: [],
              hasLineTotal: false,
              totalPrice: 0,
              totalNoDealPrice: 0,
              sample_gift_goods_id: '',
              freeShippingProgress: null,
              activityInfo: {}
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    logout() {
      // 存在没有this.$refs.azHeaderLogo的情况，直接请求退出登录接口
      if (this.$refs.azHeaderLogo) {
        this.$refs.azHeaderLogo.logout()
      } else {
        this.$axios.$post(`/1.0/user/logout`).then((res) => {
          if (res.code == 0) {
            // 退出后清空详情页获取交期的地址cookie
            this.$cookie.removeCookie('delivery_province', '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.removeCookie('delivery_province_new', '.' + this.APP_DOMAIN_LOWER)
            this.$cookie.removeCookie('user_id')
            // 退出登录的时候对讲机（'关闭'）
            window.Intercom && window.Intercom('shutdown')
            location.reload()
          } else {
            console.log('logout error')
          }
        })
      }
    },
    // 获取商品的收藏状态
    getFavGoodsList() {
      const prodList = JSON.parse(JSON.stringify(this.prodList))
      const goodsIdsArr = []
      if (prodList && prodList.length > 0) {
        for (const key in prodList) {
          goodsIdsArr[key] = prodList[key].goodsId
        }
        this.$axios
          .$post(`/1.0/showroom/favorites-check`, {
            goods_ids: goodsIdsArr
          })
          .then((res) => {
            if (res.code == 0) {
              res.data.favList && Object.keys(res.data.favList).length && this.$store.commit('product/setFavGoodsList', res.data.favList)
            }
            this.sessionAddGoodsFav()
          })
      }
    },
    sessionAddGoodsFav() {
      if (sessionStorage.getItem('fav_goods_id') && sessionStorage.getItem('fav_colorKey')) {
        // session里的fav_goods_id 是否已经收藏过
        if (this.favGoodsList[sessionStorage.getItem('fav_goods_id')]) {
          const flag = this.favGoodsList[sessionStorage.getItem('fav_goods_id')].some((element) => {
            return element.colorId == this.colorId
          })
          if (flag) {
            return
          }
        }
        if (this.showRoomNum + this.storeRoomNum > 0) {
          const sourceTag = this.getSourceTag(this.$store.state.product.baseInfo)
          showRoomUtil.addFav2ShowRoom(
            -1,
            sessionStorage.getItem('fav_goods_id'),
            sessionStorage.getItem('fav_colorKey'),
            sessionStorage.getItem('fav_goods_size'),
            0,
            sourceTag,
            false,
            (favGoodsList) => {
              this.$store.commit('product/setFavGoodsList', favGoodsList)
            }
          )
        } else {
          this.createShowroom()
        }
      }
    },
    createShowroom() {
      this.$axios.$post(`/1.0/showroom`).then((res) => {
        if (res.code == 0) {
          res.data.showroomList &&
            Object.keys(res.data.showroomList).length &&
            this.$store.commit('userInfo/setShowRooms', res.data.showroomList)
          this.sessionAddGoodsFav()
        } else {
          // alert(res.msg)
        }
      })
    },
    firstOpenChange(flag) {
      if (!process.client) return
      this.firstOpen = flag
      // comments: wgd 列表页 或者详情页 隐藏大转盘
      if (this.wgdListDetailPage) {
        const couponWheelDom = document.querySelector('#coupon-box')
        couponWheelDom && couponWheelDom.style.setProperty('display', 'none')
      }
    },
    openCouponWheel(shoppingForDialogOpened) {
      const that = this
      const events = ['click', 'keydown', 'scroll', 'mousewheel', 'resize']
      // comments: 开关阻止移动事件多次调用
      let flag = false
      const wgdFun = (e, event) => {
        const target = (e && e.target) || {}
        if (flag) return
        if ((event == 'click' && !['A', 'IMG'].includes(target.tagName)) || event !== 'click') {
          // db推广没有弹过框 !shoppingForDialogOpened
          // comments: wgd coupon box 没有弹过框
          if (that.wgdListDetailPage || (!shoppingForDialogOpened && this.dbLandingPage)) {
            that.couponWheelShow = false
            flag = true
            const timer = setTimeout(() => {
              // db推广弹框是否打开过
              const shoppingForDialogOpened = this.$cookie.getCookie('shoppingForDialogOpened')
              if (!shoppingForDialogOpened && this.dbLandingPage) {
                this.$store.commit('setShowShoppingForDialog', true)
              }
              clearTimeout(timer)
            }, 3000)
          } else {
            that.showActivityTag = true
            !flag && that.initCouponWheel()
            flag = true
          }
        }
      }
      for (let i = 0; i < events.length; i++) {
        if (flag) {
          window.removeEventListener(events[i], (e) => {
            wgdFun(e, events[i])
          })
          continue
        }
        window.addEventListener(events[i], (e) => {
          wgdFun(e, events[i])
        })
      }
    },
    // comments: 初始化首次进入页面cookie以及是否首次进入目标页面cookie
    initWGDUserTagCookie() {
      if (
        !document.referrer ||
        (document.referrer && !document.referrer.includes('.azazie.') && !document.referrer.includes('localhost'))
      ) {
        // comments: 落地页不是列表页详情页或者是wgd的列表页和详情页记录ExtendedWGDLanded=yes
        if (!['list', 'product'].includes(this.$route.name) || this.isSpecialCatId(this.catId)) {
          this.$cookie.setCookie('ExtendedWGDLanded', 'yes')
        }
        let cookieText = 'otherPage'
        let wgdLandedIsText = null
        // comments: wgd列表页 atelier列表页
        if (this.isSpecialCatId(this.catId)) {
          if (this.$route.name == 'list') {
            // 落地页是列表页
            cookieText = 'wgdList'
          } else if (this.$route.name === 'product') {
            // 落地页是详情页
            cookieText = 'wgdDetail'
          }
          wgdLandedIsText = this.catId == 3110 ? 'atelier' : 'yes'
        }
        wgdLandedIsText && this.$cookie.setCookie('wgd_landed_is', wgdLandedIsText)
        if (wgdLandedIsText == 'atelier') {
          window.dataLayer.unshift({ ENABLE_RECORDING: 1 })
        }
        let wgdSource = this.$route.query.src
        if (wgdSource === 'Direct') {
          wgdSource = 'wgdcpc'
        } else if (wgdSource === 'nonDirect') {
          wgdSource = ''
        }
        wgdSource && this.$cookie.setCookie('wgd_source_is_new', wgdSource)
        // comments: 标记首次进入的是目标列表页还是目标详情页面
        this.$cookie.setCookie('wgd_first_entry_tag', cookieText)
      } else {
        const atelierText = this.$cookie.getCookie('wgd_landed_is')
        if (atelierText == 'atelier') {
          window.dataLayer.unshift({ ENABLE_RECORDING: 1 })
        }
      }
    },
    updateConsent() {
      this.resetHandleGDPRInterval()
      const { countrycode = 'US' } = this.$store.state.logsId.reqHeaders
      const grantedText = !eurCountryCode.includes(countrycode) ? 'denied' : 'granted'
      window.gtag('consent', 'update', {
        ad_storage: grantedText,
        analytics_storage: grantedText
      })
      this.btns[Number(!eurCountryCode.includes(countrycode))].removeEventListener('click', this.updateConsent)
      this.btns = []
    },
    handleChatbotPoint() {
      // 客服相关打点
      if (!window.is_chrome_lighthouse) {
        if (
          !window.location.href.includes('support/header') &&
          !window.location.href.includes('support/footer') &&
          !window.location.href.includes('/unsubscribe') &&
          !window.location.href.includes('/comingsoon') &&
          !window.location.href.includes('/maintenance') &&
          !window.location.href.includes('/all/special-occasion-dresses/kendall-kylie') &&
          !window.location.href.includes('/checkout')
        ) {
          // if (this.versionGroup.messagerAbtest === 'B') {
          // 执行 Intercome 相关的打点
          this.setPoint('chatbot', 'Intercome', 'view')
          window.Intercom &&
            window.Intercom('onShow', () => {
              this.setPoint('chatbot', 'Intercome', 'click')
            })
          // } else {
          //   this.azZendesk()
          // }
        }
      }
    },
    azZendesk() {
      // 由于Zendesk api的局限性，需要加载之后才能执行，所以使用MutationObserver 监听dom变化
      // 当观察到变动时执行的回调函数
      const callback = (mutationsList, observer) => {
        // Use traditional 'for loops' for IE 11
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            if (document.querySelector('iframe#launcher')) {
              // 停止观察
              observer.disconnect()
              // 执行 zendesk 相关的打点
              this.azZendeskShow = true
            }
          }
        }
      }
      // 创建一个观察器实例并传入回调函数
      const observer = new MutationObserver(callback)
      // 以上述配置开始观察目标节点
      observer.observe(document.body, { childList: true })
    },
    // 如果上一个页面存在queryAbtest,则修改url路由，添加queryAbtest参数
    handleQueryAbtest() {
      // 当前页面存在queryAbtest，则不处理
      if (this.$route.query.queryAbtest) return
      let queryAbtest = ''
      const referer = document.referrer
      if (referer) {
        // 当前页面不带有queryAbtest参数，则从referer判断是否存在参数queryAbtest
        queryAbtest = getQueryString(referer).queryAbtest || ''
      }

      let tempUrl = document.URL
      if (queryAbtest) {
        if (/\?/g.test(tempUrl)) {
          tempUrl = tempUrl + '&queryAbtest=' + queryAbtest
        } else {
          tempUrl = tempUrl + '?queryAbtest=' + queryAbtest
        }
        window.history.pushState(null, null, tempUrl)
      }
    },
    subscribeSubmit() {
      this.isNewUserCoupon = false
      this.$store.commit('setShowNewUserCoupon', false)
      this.$store.commit('setShowSlideNewUserCoupon', false)
    }
  }
}
</script>

<style lang="less" scoped>
.main-box {
  min-width: 1263px;
  @media screen and (max-width: 1262px) {
    &.adaptive-box {
      width: 100%;
      min-width: 768px;
      /deep/ #top-notification,
      /deep/ .az-header-topbar,
      /deep/ .activity-box,
      /deep/ .header-widgets,
      /deep/ .az-header-box {
        width: 100%;
        min-width: 768px;
      }
    }
  }

  @media screen and (max-width: 1023px) {
    &.adaptive-box /deep/ .az-header-box {
      display: none;
    }
  }

  &.adaptive-box {
    /deep/ .sticker-icon {
      transform-origin: top left;
      @media screen and (max-width: 1023px) {
        transform: scale(0.95);
      }
      @media screen and (max-width: 900px) {
        transform: scale(0.8);
      }
      @media screen and (max-width: 800px) {
        transform: scale(0.7);
      }
    }
  }
  .sticky-header {
    position: sticky;
    top: 0;
    background: #fff;
    transform: translateY(0);
    transition: transform 0.3s cubic-bezier(0.2, 0.93, 0.8, 0.9);
    z-index: @fixed-z-index;
  }
  .header-fixed {
    transition-duration: 0.4s;
  }
  .newUserCoupon-enter-active,
  .newUserCoupon-leave-active {
    transition: all 0.5s;
    transform: translateX(0);
  }
  .newUserCoupon-enter,
  .newUserCoupon-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
<style lang="less">
.solvvy-v5-widget.desktop.position-bottom-right.launcher {
  border-radius: 50% !important;
  bottom: 25px !important;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  .svg-icon.widget-icon {
    transform: scale(0.8) !important;
  }
}
// intercom 样式
.intercom-lightweight-app-launcher,
.intercom-bm64t8 {
  transform: scale(0.9375) !important;
}
.intercom-lightweight-app,
.intercom-bm64t8 {
  z-index: 8 !important; //参考zendesk
}
.intercom-messenger-frame {
  z-index: 11 !important;
}

/* Europe cookie dialog css rewrite */
#polaris-consent-widgets {
  --heading-font-family: @font-family-500 !important;
  --text: var(--color-121212);
  h2 {
    font-size: 16px !important;
    text-transform: uppercase !important;
  }
  h3 {
    font-size: 14px !important;
  }
  .polaris-consent-widgets {
    .polaris-modal__overlay._modal-modal__overlay-yPJLO.polaris-preferences-widget {
      background-color: rgba(0, 0, 0, 0.5);
      .polaris-modal._modal-modal-hnkld {
        padding: 20px;
        border-width: 0;
      }
      .polaris-modal__body {
        ._toggle_row-toggle_row-yNo8B {
          header {
            & + p {
              color: #666;
              margin-top: 5px;
              font-size: 13px !important;
            }
            ._toggle-toggle-ukiWP {
              span::before {
                background-color: @theme-color;
              }
              input:not(:checked) + span::before {
                background-color: #ccc;
              }
            }
          }
        }
      }
      .polaris-modal__footer {
        .polaris-button._button-button-sXeE8 {
          border-color: #666;
          font-size: 13px !important;
          font-family: @font-family-600 !important;
          color: var(--color-121212);
        }
      }
      .polaris-modal__close_icon._modal-modal__close_icon-tbv1S {
        &::before,
        &::after {
          height: 19px;
        }
      }
    }
    .polaris-banner._banner-banner-uWTk6.polaris-consent-widget._consent_app-consent-VfXBA {
      ._banner-banner__inner-vQTM0 {
        header + p {
          font-size: 14px !important;
          font-family: @font-family-500!important;
        }
        .polaris-consent-widget__title._consent_app-consent__title-yGZjm {
          text-transform: uppercase !important;
          font-size: 16px !important;
        }
      }
    }
    .polaris-consent-widget__footer._consent_app-consent__footer-q1D_T {
      .polaris-button._button-button-sXeE8 {
        font-family: @font-family-500 !important;
        font-size: 14px !important;
        color: var(--color-121212);
        &._button-button--link-tbmgH {
          color: @theme-color;
        }
      }
    }
  }
}
</style>
