<template>
  <az-popup-layer
    v-track.view="{ common: getBiParams('recommend', 'windowclose_outside') }"
    :z-index="12"
    :title="nl('page_goods_success_add_cart')"
    @close="closeDialog"
    :showIcon="true"
    :class="[showAddCartDialog ? 'animation-fade-enter-active' : 'animation-fade-leave-active']"
    :delay-close="3.5"
    width="620px"
    height="auto"
  >
    <div v-track.view="{ common: getBiParams('recommend', 'windowclose_inside') }" class="add-cart-dialog">
      <div v-if="baseInfo.activityCouponCode == 'HIBEAUTY' && showCouponCode(baseInfo)" class="sod-coupon-tips">
        <span v-html="nl('page_common_coupon_add_pop_tip')"></span>
      </div>
      <div class="add-cart-dialog-content">
        <div class="cat-product-block">
          <div class="cat-product-list">
            <div class="cat-product-item">
              <div :class="{ 'goods-img-block-freeship': isFreeShipProgressCountry }" class="goods-img-block">
                <az-sticker
                  v-if="baseInfo.stickers && Object.keys(baseInfo.stickers).length"
                  :stickerInfo="baseInfo.stickers"
                  :sticker-class="`product-item-icon-small`"
                  :goodsId="baseInfo.goodsId"
                ></az-sticker>
                <img
                  v-if="baseInfo.isGiftCard"
                  :data-src="addWebpSuffix(giftCardFromData.giftCardDefaultImgUrl)"
                  :alt="baseInfo.goodsName"
                  :src="require('~/assets/images/default_img.jpg')"
                  class="lazyload goods-img"
                />
                <img
                  v-else
                  :src="require('~/assets/images/default_img.jpg')"
                  :data-src="addWebpSuffix(`${PIC_PATH}s240/${baseInfo.goodsThumb}`)"
                  :alt="baseInfo.goodsName"
                  class="lazyload goods-img"
                />
                <span v-if="baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
              </div>
              <div class="goods-info-box">
                <div :class="{ 'goods-info-freeship': isFreeShipProgressCountry }" class="goods-info">
                  <div class="info-content">
                    <h4 class="goods-name">
                      <span
                        >{{ baseInfo.shownGoodsName }}
                        <em
                          v-if="baseInfo.dressType == 'clearance' || baseInfo.dressType == 'outlet' || baseInfo.isFinalSale"
                          class="final-sale"
                          >( {{ nl('page_product_clearance_desc') }} )</em
                        >
                      </span>
                    </h4>
                    <template v-if="baseInfo.isGiftCard">
                      <p class="goods-from">
                        {{ nl('page_common_from') }}: <span>{{ giftCardFromData.from_user || userInfoEmail }}</span>
                      </p>
                      <p class="goods-to">
                        {{ nl('page_gift_card_order_send_to') }}: <span>{{ giftCardFromData.to_email }}</span>
                      </p>
                    </template>
                    <template v-else>
                      <p class="goods-color">
                        {{ nl('page_common_color') }}:
                        <span class="color-text">{{ replaceBackslashToAndText(selectedColor.name || baseInfo.shownColor, baseInfo) }}</span>
                      </p>
                      <div class="goods-size-box">
                        <div v-if="selectedSize.name" class="goods-size">{{ nl('page_common_size') }}: {{ selectedSize.shownName }}</div>
                        <div v-else-if="isCustomSize">{{ nl('page_custom_size') }}</div>
                      </div>
                    </template>

                    <div class="goods-qty">{{ nl('page_common_qty') }}: {{ goodsNumber }}</div>

                    <div class="goods-com-price">
                      <!-- AZWEB-18887 样衣3件20活动 tryonSaveLimit-->
                      <template v-if="baseInfo.tryonSaveLimit">
                        <span :class="{ red: baseInfo.hasLinePrice }" class="goods-price"> {{ baseInfo.shopPriceDisplay }} </span>
                        <span
                          v-html="
                            nl('page_common_try_on_number_for_wd_' + country.toLowerCase(), null, { number: baseInfo.tryonSaveLimit || 3 })
                          "
                          v-if="baseInfo.catId == 2"
                        >
                        </span>
                        <span
                          v-else
                          v-html="
                            nl('page_common_try_on_number_for_' + country.toLowerCase(), null, { number: baseInfo.tryonSaveLimit || 3 })
                          "
                        >
                        </span>
                      </template>
                      <template v-else-if="baseInfo.isGiftCard">
                        <span class="goods-price">
                          {{ giftCardFromData.selectedCardPrice ? giftCardFromData.selectedCardPrice.cardPriceDisplay : '' }}
                        </span>
                      </template>
                      <template v-else>
                        <span :class="{ red: baseInfo.hasLinePrice }" class="goods-price">
                          {{ baseInfo.shopPriceDisplay }}
                        </span>
                        <span v-if="baseInfo.hasLinePrice" class="no-deal-price">{{ baseInfo.noDealPriceDisplay }}</span>
                      </template>
                      <exclusive-offer
                        v-if="baseInfo.showBundlePrice"
                        :price="baseInfo.bundlePrice"
                        :priceOff="baseInfo.bundlePriceOff"
                        question-position="under"
                        scene="addCartdialog"
                      ></exclusive-offer>
                    </div>
                    <!-- AzWithCoupon 有划线价就展示save百分比,不分是 coupon  activity sale 、 limit sale 、 flash sale -->
                    <AzWithCoupon
                      v-if="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
                      :value="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
                      :showText="!!baseInfo.activityCouponCode"
                      :code="showCode(baseInfo)"
                      :hasShopPriceRange="baseInfo.hasShopPriceRange"
                      :baseInfo="baseInfo"
                    />
                  </div>
                  <div v-if="isFreeShipProgressCountry" class="cart-total">
                    <span class="items-count">{{ nl('page_cart_num_in_bag', null, { num: cartInfo.totalCount }) }}</span>
                    <span class="subtotal">{{ nl('page_common_subtotal') }}: {{ cartInfo.totalPrice }}</span>
                  </div>
                </div>
                <!-- #18080: 免运费活动+阶梯活动 同时存在的时候，使用新的样式，在 activity-status-progress 组件内 -->
                <free-ship-progress
                  v-if="
                    cartInfo.freeShippingProgress &&
                      cartInfo.freeShippingProgress.isShowProgressBar &&
                      isFreeShipProgressCountry &&
                      (!cartInfo.activityInfo || !cartInfo.activityInfo.showProgress)
                  "
                  :progress-data="cartInfo.freeShippingProgress"
                ></free-ship-progress>
                <activity-status-progress
                  v-else-if="cartInfo.activityInfo && cartInfo.activityInfo.showProgress"
                  :activityCartInfo="cartInfo.activityInfo"
                  :freeShippingProgress="cartInfo.freeShippingProgress"
                  :isFreeShipProgressCountry="isFreeShipProgressCountry"
                  :from="'add-cart-pop'"
                ></activity-status-progress>
                <!-- AZWEB-18459 Buy more save more  -->
                <BuyMoreSaveMore
                  v-if="baseInfo.buyMoreSaveMore && Object.keys(bundlePromotionProgress).length"
                  :bundlePromotionInfo="bundlePromotionProgress"
                />

                <div :class="{ 'add-to-bag-block-freeship': isFreeShipProgressCountry }" class="add-to-bag-block">
                  <a v-if="isFreeShipProgressCountry" @click="clickKeepShopping" href="javascript:;" class="keep-shopping-btn">{{
                    nl('page_common_keep_shopping')
                  }}</a>
                  <a v-track.view.click="{ common: getBiParams('recommend', 'viewbag') }" :href="countryUrl(`/cart`)" @click="close">
                    <az-button class="btn btn-default btn-add-to-bag">{{ nl('page_common_view_bag') }}</az-button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cat-product-match-block">
          <p class="cat-product-match-title">{{ nl('page_designed_to_match') }}</p>
          <!-- tab -->
          <ul ref="catListRef" v-if="catList.length > 1 && false" class="cat-list-box">
            <li
              v-for="(item, index) in catList"
              :key="item.cat_id"
              :class="[{ active: index == catListActive }, 'parent-li']"
              @click="catListClick(item, index, $event)"
              v-track.view.click="{ common: [getBiParams('recommend', item.cat_name), getCategoryXBiParams(item, index)] }"
            >
              <span>{{ item.cat_name }}</span>
            </li>
            <i :style="underLineStyle" class="under-line"></i>
          </ul>
          <!-- 推荐商品列表 -->
          <div
            v-track.view.click="{ common: getBiParams('designtomatch', 'items') }"
            :class="versionObj.listWithCodeAbtest"
            class="cat-product-match-list"
          >
            <!-- 骨架图 -->
            <div v-show="loadingFlag" :style="{ padding: '0px 18px;' }" class="seize-seat">
              <div v-for="item in '1234'" :key="item" class="cat-product-match-item">
                <div class="product-color-skeleton"></div>
              </div>
            </div>
            <product-swiper
              v-show="!loadingFlag && !!recommendProducts.length"
              :prodList="recommendProducts"
              :nextEl="'rv-swiper-button-next'"
              :prevEl="'rv-swiper-button-prev'"
              :slidesPerView="4"
              @getPrevOrNext="getPrevOrNext"
              v-track.view="{ common: getPrevOrNextView() }"
            >
              <div ref="RVSwiper" v-swiper:RVSwiper="RVSwiperOption" class="swiper-container">
                <div class="swiper-wrapper product-swiper-viewport">
                  <div
                    v-if="shopLookInfo.length"
                    v-track.view="{
                      common: [getBiParams('shopthelook', 'entrance'), getBiParams('shopthelook', 'entrance_tag')]
                    }"
                    class="swiper-slide need_datalayer cat-product-match-item"
                  >
                    <shop-the-look-imgs
                      @clickCustomize="clickCustomize"
                      @handleClickImg="handleClickImg"
                      :products="shopLookInfo"
                      :link="shopLookLink"
                      scene="entry"
                    ></shop-the-look-imgs>
                  </div>
                  <div
                    v-for="(item, index) in recommendProducts"
                    :title="item.shownGoodsName"
                    :key="index"
                    v-track.view="{ common: [getCatGoodsPoint(item)] }"
                    class="swiper-slide need_datalayer cat-product-match-item"
                  >
                    <a :href="jointColorSizeUrl(countryUrl(item.goodsUrl), item)" @click="clickCatListProduct(item, index)">
                      <img
                        :src="require('~/assets/images/default_img.jpg')"
                        :data-src="addWebpSuffix(item.imgUrl)"
                        :alt="item.shownGoodsName"
                        v-track.click="{
                          click: getGAItemListParams(item, index, 'imgClick', from)
                        }"
                        class="lazyload goods-img"
                      />
                      <div
                        v-track.click="{
                          click: getGAItemListParams(item, index, 'titleClick', from)
                        }"
                        class="goods-name"
                      >
                        {{ item.shownGoodsName }}
                      </div>
                    </a>
                    <div class="goods-com-price">
                      <p v-if="isBridal && item.dressType == 'sample'" class="sample-text">
                        <span class="sample-text-price">
                          {{ item.originalPriceInfo && item.originalPriceInfo.noDealPriceDisplay }}
                        </span>
                        <span class="sample-text-price-text">{{ nl('page_common_try_on_for') }}</span>
                        <span class="bold-price">{{ item.shopPriceDisplay }}</span>
                      </p>
                      <div v-else class="goods-price-block">
                        <!-- AZWEB-21266 未选中sku时展示价格区间 -->
                        <span v-if="item.hasShopPriceRange" :class="{ red: item.hasShopPriceRange }" class="goods-price"
                          >{{ item.minShopPriceDisplay }} - {{ item.maxShopPriceDisplay }}</span
                        >
                        <span v-else :class="{ red: item.hasLinePrice }" class="goods-price">{{ item.shopPriceDisplay }}</span>
                        <span v-if="item.hasShopPriceRange || item.hasLinePrice" class="no-deal-price">{{ item.noDealPriceDisplay }}</span>
                        <!-- AzWithCoupon 有划线价就展示save百分比,不分是 coupon  activity sale 、 limit sale 、 flash sale -->
                        <AzWithCoupon
                          v-if="item.hasShopPriceRange ? item.upToSaveRateValue : item.offRateValue"
                          :value="item.hasShopPriceRange ? item.upToSaveRateValue : item.offRateValue"
                          :showText="!!item.activityCouponCode"
                          :code="showCode(item)"
                          :hasShopPriceRange="item.hasShopPriceRange"
                          :baseInfo="item"
                        />
                      </div>
                      <az-icon
                        v-track.view.click="{ common: getBiParams('designtomatch', 'quickshop') }"
                        @click.stop.prevent="showQuickShopDialog(item)"
                        icon-class="iconicon_shop-new"
                      />
                    </div>

                    <cyber-sale v-if="cyberSaleInfo && item.catId != 3108" scene="addcartdialog"></cyber-sale>
                    <template v-else>
                      <exclusive-offer
                        v-if="item.showBundlePrice"
                        :price="item.bundlePrice"
                        :priceOff="item.bundlePriceOff"
                        scene="addCartdialogRecommend"
                      ></exclusive-offer>
                      <limited-time-offer
                        v-else
                        :stickers="item.stickers"
                        :itemCatId="item.catId"
                        scene="addCartdialogRecommend"
                      ></limited-time-offer>
                    </template>
                  </div>
                </div>
              </div>
            </product-swiper>
          </div>
        </div>
      </div>
    </div>
  </az-popup-layer>
</template>
<script>
import azPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
import ProductSwiper from '@/components/product/ProductSwiper'
import FreeShipProgress from '@/components/cart/FreeShipProgress'
import BuyMoreSaveMore from '@/components/cart/BuyMoreSaveMore'
import ShopTheLookImgs from '@/components/shopTheLook/ShopTheLookImgs'
import { judgeReferrerIsList } from '@/assets/js/commonFun'
import ExclusiveOffer from '@/components/product/ExclusiveOffer'
import ActivityStatusProgress from '@/components/cart/ActivityStatusProgress'
import LimitedTimeOffer from '@/components/product/LimitedTimeOffer'
import CyberSale from '@/components/list/CyberSale'
import AzWithCoupon from '@/components/az-ui/AZWithCoupon'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import { countryList } from '@/assets/js/euSizeMap'

import { mapState } from 'vuex'
export default {
  name: 'AddCartDialog',
  languageKeys: [
    'page_goods_success_add_cart',
    'page_common_coupon_add_pop_tip',
    'page_product_clearance_desc',
    'page_common_from',
    'page_gift_card_order_send_to',
    'page_common_color',
    'page_common_size',
    'page_custom_size',
    'page_common_qty',
    ...countryList.map((v, i) => 'page_common_try_on_number_for_wd_' + v),
    ...countryList.map((v, i) => 'page_common_try_on_number_for_' + v),
    'page_cart_num_in_bag',
    'page_common_subtotal',
    'page_common_keep_shopping',
    'page_common_view_bag',
    'page_designed_to_match',
    'page_common_try_on_for',
    'page_common_recommends_text',
    ...FreeShipProgress.languageKeys,
    ...ShopTheLookImgs.languageKeys,
    ...ExclusiveOffer.languageKeys,
    ...ActivityStatusProgress.languageKeys,
    ...LimitedTimeOffer.languageKeys,
    ...CyberSale.languageKeys,
    ...AzWithCoupon.languageKeys,
    ...AzSticker.languageKeys
  ],
  components: {
    azPopupLayer,
    AzButton,
    ProductSwiper,
    FreeShipProgress,
    ShopTheLookImgs,
    ExclusiveOffer,
    BuyMoreSaveMore,
    ActivityStatusProgress,
    LimitedTimeOffer,
    CyberSale,
    AzWithCoupon,
    AzSticker
  },
  props: {
    goodsNumber: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 加购弹框中的轮播配置
      RVSwiperOption: {
        slidesPerView: 4,
        spaceBetween: 10,
        slidesPerGroup: 4,
        simulateTouch: false,
        speed: 800,
        observer: true, // 修改swiper子元素时，自动初始化swiper
        observeParents: false,
        navigation: {
          nextEl: '.rv-swiper-button-next',
          prevEl: '.rv-swiper-button-prev'
        }
      },
      loadingFlag: true,
      recommendProducts: [], // 推荐商品列表
      catList: [], // tab分类
      catListActive: 0, // tab分类当前激活项
      excNum: 0, // 标识，记录加购推荐商品接口的执行次数
      underLineStyle: {}, // catList分类的选中下划线
      queryDataAll: [], // 所有类目的推荐商品数据，点击tab后，从此获取数据，避免重复请求接口
      from: 'designedtomatch',
      shopLookInfo: [], // shop the look 入口信息
      shopLookLink: ''
    }
  },
  computed: {
    ...mapState('product', [
      'selectedColor',
      'selectedSashColor',
      'selectedSize',
      'baseInfo',
      'showAddCartDialog',
      'isCustomSize',
      'needJointColorSize',
      'plusSizeView',
      'sodPreSalePicVersion'
    ]),
    ...mapState('giftCard', ['giftCardFromData']),
    ...mapState(['cartInfo', 'bundlePromotionProgress']),
    ...mapState({
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    // 非礼品卡，国家仅限制mx
    isFreeShipProgressCountry() {
      return this.country !== 'MX' && this.baseInfo.catId != 3108
    },
    sodPreSaleGoods({ baseInfo }) {
      return this.isSpecialCatId(baseInfo.catId) && baseInfo.sodPreSaleGoods
    }
  },
  created() {
    this.queryDataAll = []
    this.getCartRecommend()
  },
  methods: {
    close() {
      this.sodPreSaleGoods && this.closeDialog()
    },
    /**
     * 点击keep shopping，如果是从列表页过来，返回列表页，否则，直接关闭
     */
    clickKeepShopping() {
      if (this.baseInfo.isPreOrderGoods) {
        // kk预售商品活动期间跳预售落地页
        window.open(this.countryUrl('/all/special-occasion-dresses/kendall-kylie'))
        return false
      }
      const isFromList = judgeReferrerIsList()
      if (isFromList) {
        location.href = document.referrer
      } else {
        this.closeDialog()
      }
    },
    /**
     * 当tab项过长时，单词会自动换行，且换行后，文本的宽度并不是固定的，可能一个单词换行，或者两个单词换行
     * 这时，根据文本的宽度，动态设置tab每一项的父级容器的宽度，保证tab之间间距维持固定，避免因单词换行导致的视觉上的tab间距较大问题
     */
    setTabWidth() {
      this.$nextTick(() => {
        const currentRef = this.$refs.catListRef
        // 商品未出现，弹窗关闭了会出现这种情况，所以要兼容下
        if (!currentRef || !currentRef.children) return false
        // comments: 最后一项 i标签 不存在子项，剔除
        for (let i = 0; i < currentRef.children.length - 1; i++) {
          const eleParent = currentRef.children[i] // 当前dom的父级容器
          const ele = eleParent.children[0] // 当前显示dom
          eleParent.style.width = ele.offsetWidth + 1 + 'px'
        }
      })
    },
    /**
     * 根据当前视图显示，动态设置tab项下划线的位置
     */
    setUnderLineStyle() {
      this.$nextTick(() => {
        // 获取ul li span的视图宽度
        // 兼容报错
        if (!this.$refs.catListRef || !this.$refs.catListRef.children) return false
        const currentParentDom = this.$refs.catListRef.children[this.catListActive] // 当前span的父级容器的dom
        const currentDom = currentParentDom.children[0] // 当前span的dom
        const offsetLeft = currentDom.offsetLeft
        const spanWidth = currentDom.offsetWidth
        this.underLineStyle = {
          left: offsetLeft + 'px',
          width: spanWidth + 'px'
        }
      })
    },
    /**
     * 获取购物车推荐商品，以及推荐tab分类类目
     * @param version 加购的版本a旧版本b新版本
     */
    getCartRecommend(version) {
      this.loadingFlag = true
      // ab test二期需求
      // 接口改为add-to-bag-recommend-version-b
      const queryParams = {
        dress_type: this.baseInfo.dressType,
        color: this.selectedColor ? this.selectedColor.key : '',
        size: this.selectedSize ? this.selectedSize.key : '',
        sodGalleryVersion: this.sodPreSalePicVersion,
        abtest: 'A'
      }
      if (this.isInCatIds(this.baseInfo.catId)) {
        queryParams.view_mode = this.plusSizeView || this.selectedSize.isPlusSize ? 'plus' : 'petite' // 大小码图
      }
      // 当前加购的版本控制
      // 如果version没有值，获取加购版本
      if (!version) version = 'B'
      // 获取对应版本的加购推荐接口
      // 只保留新接口，删掉旧接口
      const url = '/1.0/product/add-to-bag-recommend-version-b/'
      this.$axios.$get(url + this.baseInfo.goodsId, { params: queryParams }).then((res) => {
        this.loadingFlag = false
        if (res.code === 0 && res.data) {
          const catList = res.data.catList // tab分类
          // 当分类列表数量大于0的时候，页面中显示分类，否则，this.catList为空数组，页面中分类不显示
          const tempCatList = [
            {
              cat_id: -1, // 自定义一个id
              cat_name: this.nl('page_common_recommends_text') // 类目名称
            }
          ]
          if (catList && catList.length > 0) {
            // 修改类目，将接口返回的类目列表和默认的RECOMMENDS类目合并
            this.catList = tempCatList.concat(
              catList.map((e) => {
                return {
                  ...e,
                  cat_name: e.name_language.toUpperCase() // 将类目名称改为大写
                }
              })
            )
            // 动态修改tab项的宽度，避免文本过长单词换行，导致的边距较大问题
            this.setTabWidth()
          } else {
            this.catList = tempCatList
          }
          // comments: 计算underLine样式
          this.setUnderLineStyle()
          const prodList = res.data.prodList || [] // 推荐产品列表
          if (prodList.length === 0) {
            // 如果产品列表为空，判断当前加购版本是否是b版本，如果是b版本，重新调用此方法调用查询接口，去查询a版本接口
            // 这时候会出现调用a版本接口，返回的prodList也是空数组的情况，此时便会出现无限循环的情况
            // 所以需要设置一个标识，限制此处的调用次数，最多重复调用3次
            this.excNum++
            if (this.excNum < 3) {
              this.getCartRecommend('a')
            }
          } else {
            this.excNum = 0 // 重置为0
            this.recommendProducts = prodList
            if (this.recommendProducts && this.recommendProducts.length) {
              const gaParams = this.getGAItemListParams(this.recommendProducts, null, 'view', this.from)
              this.setGA4DataLayer(gaParams)
            }
          }
          // 如果存在shopthelook相关信息，在加购推荐商品前面插入shop the look工具页入口
          const shopLookInfo = res.data.shopLookInfo
          if (shopLookInfo && !Array.isArray(shopLookInfo) && Object.keys(shopLookInfo).length) {
            const products = []
            for (const key in shopLookInfo) {
              if (Object.hasOwnProperty.call(shopLookInfo, key)) {
                const ele = shopLookInfo[key]
                if (ele.baseInfo) {
                  products.push({
                    catId: ele.catId,
                    catName: ele.baseInfo.catName,
                    color: ele.baseInfo.color,
                    goodsId: ele.baseInfo.goodsId,
                    goodsInfo: ele,
                    selectedColor: ele.styleInfo ? ele.styleInfo.color[ele.baseInfo.color] : {}
                  })
                }
              }
            }
            this.shopLookInfo = products
            this.shopLookLink = `/shopTheLook?goods_id=${this.baseInfo.goodsId}&color=${this.selectedColor.key}&dress_type=${this.baseInfo.dressType}&source=often_bought_with`
          }
          // 将数据推入第一个位置
          this.queryDataAll = []
          this.queryDataAll.push({
            catId: '_recommends',
            list: prodList
          })
        }
      })
    },
    getBiParams(ec, el) {
      if (process.server) return
      const param2 = [8, 9].includes(this.catId) && ec === 'designtomatch' ? { param2: 'A' } : { param2: this.versionObj.productColorSort }
      return {
        ec,
        el,
        param1: (location && location.href) || '-1',
        ...param2
      }
    },

    getDesigntomatchBiParams(el) {
      if (process.server) return
      const param2 = [8, 9].includes(this.catId) ? { param2: 'A' } : {}
      return {
        id: `designtomatch-${el}`,
        common: {
          ec: 'designtomatch',
          el,
          ...param2
        }
      }
    },
    getCategoryXBiParams(item, index) {
      if (process.server) return
      const msg = {
        cat_name: item.cat_name,
        from_cat_id: this.baseInfo.catId, // 主商品catId
        from_goods_id: this.baseInfo.goodsId // 主商品goodsId
      }
      if (item.cat_id && item.cat_id != -1) {
        msg.cat_id = item.cat_id
      }
      return {
        ec: 'recommend',
        el: `category${index + 1}`,
        msg: JSON.stringify(msg)
      }
    },
    /**
     * tab分类下的商品点击打点
     */
    getCatGoodsPoint(item) {
      const el = this.catList[this.catListActive].cat_name + 'item' // 获取当前激活tab项的名称
      return {
        ec: 'recommendtab',
        el,
        msg: JSON.stringify({
          goodsId: item.goodsId,
          cat_id: item.catId,
          from_cat_id: this.catId, // 主商品catId
          from_goods_id: this.baseInfo.goodsId // 主商品goodsId
        })
      }
    },
    /**
     * 点击推荐商品，打点记录点击次数
     */
    clickCatListProduct(item, index) {
      // 设置订单追踪
      this.setOrderSourceFlagWithGoodsId('VersionB_addtobagrecommenditempc', item.goodsId)
      // 打点，记录商品的点击次数，即用户在此推荐商品页点击了多少次
      const params = {
        ec: 'recommendtab',
        el: this.catList[this.catListActive].cat_name + 'item',
        ea: 'click',
        msg: JSON.stringify({
          goodsId: item.goodsId,
          cat_name: item.catName,
          dress_type: item.dressType || this.dressType,
          cat_id: item.catId,
          from_cat_id: this.catId, // 主商品catId
          from_goods_id: this.baseInfo.goodsId // 主商品goodsId
        })
      }
      this.buryPoint(this, 'event', params)
      // 不要问为什么，四叶参让必须加的
      const params1 = {
        ec: 'recommend',
        el: 'alltabitems',
        ea: 'click',
        msg: JSON.stringify({
          goodsId: item.goodsId,
          cat_name: item.catName,
          dress_type: item.dressType || this.dressType,
          cat_id: item.catId,
          from_cat_id: this.catId, // 主商品catId
          from_goods_id: this.baseInfo.goodsId // 主商品goodsId
        })
      }
      this.buryPoint(this, 'event', params1)
      // 14451要求的打点，Design to match recommneds内推荐商品的点击次数
      if (this.catList[this.catListActive] && this.catList[this.catListActive].cat_id == -1) {
        this.setPoint('recommend', 'recommends', 'click', {
          position: index + 1,
          goodsId: item.goodsId,
          color: item.colorReal,
          cat_id: item.catId,
          from_cat_id: this.catId, // 主商品catId
          from_goods_id: this.baseInfo.goodsId, // 主商品goodsId
          rec_auto: item.hasRecommend ? 0 : 1 // 自动推荐还是手动推荐, hasRecommend为true表示lego手动配置推荐，打点字段rec_auto： 1表示是自动推荐，不打或者非1表示手动
        })
      }
    },
    /**
     * 点击右上角的关闭图标按钮
     * 执行打点操作
     * @param: position 点击关闭位置 outside  inside
     */
    closeDialog(position) {
      const params = {
        ec: 'recommend',
        el: 'windowclose_' + position,
        ea: 'click',
        param1: (location && location.href) || '-1'
      }
      this.buryPoint(this, 'event', params)
      this.$store.commit('product/setShowAddCartDialog', false)
    },
    /**
     * 轮播区域前进后退点击事件监听
     */
    getPrevOrNext(e) {
      const el = e == 'prev' ? 'leftButton' : 'rightButton'
      const params = {
        ec: 'recommend',
        el,
        ea: 'click'
      }
      this.buryPoint(this, 'event', params)
    },
    getPrevOrNextView() {
      return [
        {
          ec: 'recommend',
          el: 'leftButton'
        },
        {
          ec: 'recommend',
          el: 'rightButton'
        }
      ]
    },
    /**
     * 加购弹窗类目商品查询
     * @param catId 类目id
     */
    queryCatProducts(catId) {
      this.loadingFlag = true
      // 查询tab类目对应的推荐商品，接口返回与add-to-bag-recommend-version-b接口返回类似
      const params = {
        sodGalleryVersion: this.sodPreSalePicVersion
      }
      if (this.isInCatIds(this.baseInfo.catId)) {
        params.view_mode = this.plusSizeView || this.selectedSize.isPlusSize ? 'plus' : 'petite' // 大小码图
      }
      this.$axios.$get(`/1.0/product/get-recommend-product-by-cat-id/${catId}`, { params }).then((res) => {
        this.loadingFlag = false
        if (res.data) {
          this.recommendProducts = res.data.prodList // 推荐产品列表
          if (this.recommendProducts && this.recommendProducts.length) {
            const gaParams = this.getGAItemListParams(this.recommendProducts, null, 'view', this.from)
            this.setGA4DataLayer(gaParams)
          }
          this.queryDataAll.push({
            catId,
            list: res.data.prodList
          }) // 推入数据
        }
      })
    },
    /**
     * 加购弹框中的tab分类点击切换事件
     */
    catListClick(e, i, event) {
      // 讲swiper切换到第一组数据
      this.recommendProducts = []
      this.RVSwiper.slideTo(0, 0, false)
      // 将当前点击项设为激活状态
      this.catListActive = i
      // 查询对应类目下的商品，从queryDataAll中去获取对应类目的数据，如果没有，再去查询对应接口
      let isQuery = false
      for (let x = 0; x < this.queryDataAll.length; x++) {
        const ele = this.queryDataAll[x]
        if (ele.catId == e.cat_id) {
          isQuery = true
          this.recommendProducts = this.queryDataAll[x].list
          if (this.recommendProducts && this.recommendProducts.length) {
            const gaParams = this.getGAItemListParams(this.recommendProducts, null, 'view', this.from)
            this.setGA4DataLayer(gaParams)
          }
          break
        }
      }
      if (!isQuery) {
        if (i === 0) {
          this.getCartRecommend()
        } else {
          this.queryCatProducts(e.cat_id)
        }
      }
      // 设置下划线的样式
      this.setUnderLineStyle()
    },
    // 在目标url路径上加上color,size,productSwiperItem.vue中有个同样的方法
    jointColorSizeUrl(url, item = {}) {
      const color = item.color || ''
      let stockSize = item.stockSize || ''
      // 如果stockSize不存在，判断selecedSize是否有值
      if (!stockSize && this.selectedSize.key) {
        stockSize = this.selectedSize.key
      }
      const obj = { color, size: stockSize }
      let tempUrl = url
      if (tempUrl && !tempUrl.includes('javascript:') && this.needJointColorSize) {
        for (const key in obj) {
          if (obj[key] && !tempUrl.includes(key)) {
            const value = this.isSpecialCatId(item.catId) && key == 'color' ? encodeURIComponent(obj[key]) : obj[key]
            if (tempUrl.includes('?')) {
              tempUrl = `${tempUrl}&${key}=${value}`
            } else {
              tempUrl = `${tempUrl}?${key}=${value}`
            }
          }
        }
      }
      return tempUrl
    },
    clickCustomize() {
      this.buryPoint(this, 'event', {
        ec: 'shopthelook',
        el: 'entrance_tag',
        ea: 'click',
        param1: (location && location.href) || '-1'
      })
    },
    handleClickImg() {
      this.buryPoint(this, 'event', {
        ec: 'shopthelook',
        el: 'entrance',
        ea: 'click',
        param1: (location && location.href) || '-1'
      })
    },
    // 显示quick shop弹框
    showQuickShopDialog(item) {
      const params = {
        goods_id: item.goodsId,
        dress_type: item.dressType,
        goods_style_id: item.goodsStyleId || '',
        color: item.color,
        catName: item.catName,
        catId: item.catId,
        hasRecommend: item.hasRecommend,
        fromDialog: 'addCartDialog'
      }
      this.$emit('quickShop', params)
      this.$store.commit('quickshop/setQuickShopDialog', true)
    }
  }
}
</script>
<style lang="less" scoped>
.cat-product-match-list {
  &.A {
    .goods-com-price .goods-price.red {
      color: @theme-color !important;
    }
  }
}

/deep/.az-with-coupon {
  margin-bottom: 10px;
}
.add-cart-dialog {
  .product-color-skeleton {
    background: #f1f1f1;
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: linear-gradient(to right, var(--color-eeeeee) 8%, #dddddd 18%, var(--color-eeeeee) 33%);
    background-size: 800px 104px;
    height: 179.24px;
    position: relative;
  }

  @keyframes placeHolderShimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }
  .add-cart-dialog-content {
    .price-try-on-for {
      font-family: @font-family-500;
      color: var(--color-121212);
      .price_show {
        font-family: @font-family-600;
        font-size: 16px;
      }
    }
    .goods-com-price {
      margin-top: 8px;
      display: flex;
      align-items: center;
      position: relative;
      .goods-price-block {
        margin-right: 20px;
        //   text-align: center;
      }
      .goods-price {
        font-family: @font-family-600;
        font-size: 16px;
        display: inline-block;
        color: var(--color-121212);
        &.red {
          // color: @theme-color;
          color: var(--color-121212);
        }
      }
      .no-deal-price {
        color: var(--color-999999);
        text-decoration: line-through;
        display: inline-block;
        font-family: @font-family-500;
        font-size: 12px;
        margin-left: 5px;
      }
      .sample-text {
        text-align: center;
        .sample-text-price {
          display: block;
          // text-decoration: line-through;
        }
        .bold-price {
          font-family: @font-family-600;
          font-size: 16px;
          line-height: 22px;
        }
      }
      /deep/ .sod-coupon-card {
        margin-left: 8px;
      }
      .az-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        fill: @theme-color;
        position: absolute;
        right: 0;
        top: 0;
      }
      .prod-save-price {
        color: @theme-color;
        font-size: 13px;
        line-height: 18px;
        margin-left: 10px;
        &.with-code {
          font-family: @font-family-600;
          display: flex;
          align-items: center;
          /deep/ .icon-question-box {
            margin-left: 2px;
            margin-right: 2px;
          }
          &:hover {
            /deep/ .icon-question-des {
              display: block;
            }
          }
        }
      }
    }
    .activity-coupon-code {
      margin-top: 7px;
      margin-bottom: 30px;
      width: max-content;
      &.sod {
        margin: 0;
        margin-left: 8px;
      }
      &.product-item {
        margin: 0;
        margin-top: 10px;
      }
    }
    .cat-product-block {
      position: relative;
      .cat-product-list {
        .cat-product-item {
          position: relative;
          padding-bottom: 20px;
          display: flex;
          border-bottom: 1px solid #ccc;
          .goods-img-block {
            position: relative;
            width: 90px;
            margin-right: 15px;
            &-freeship {
              width: 130px;
            }
            img {
              width: 100%;
            }
            .mattel {
              position: absolute;
              right: 3px;
              top: 164px;
              font-size: 12px;
              line-height: 12px;
              text-transform: uppercase;
              color: #fff;
              transform-origin: right bottom;
              transform: scale(0.3);
              width: max-content;
            }
          }
          .goods-info-box {
            flex: 1;
          }
          .goods-info {
            &-freeship {
              width: 100%;
              min-height: 180px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-bottom: 15px;
            }
            .info-content {
              .goods-name {
                font-size: 14px;
                font-weight: normal;
              }
              .goods-color,
              .goods-from {
                margin-top: 6px;
                .color-text {
                  text-transform: capitalize;
                }
              }
              .goods-size-box,
              .goods-to {
                margin-top: 5px;
              }
              .goods-qty {
                margin-top: 2px;
              }
              .goods-from,
              .goods-to {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: 350px;
              }
            }
          }
          .pre-order-notice {
            margin: 10px 0;
            font-family: @font-family-500;
            font-size: 13px;
            line-height: 18px;
            span {
              font-family: @font-family-600;
              text-transform: capitalize;
              padding-right: 3px;
            }
          }
          .cart-total {
            height: 52px;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            line-height: 18px;
            font-family: @font-family-500;
            .subtotal {
              font-size: 16px;
              line-height: 22px;
              font-family: @font-family-600;
              text-transform: uppercase;
            }
          }
          .add-to-bag-block {
            text-align: center;
            margin-top: 5px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            &-freeship {
              justify-content: space-between;
              position: initial;
            }
            > a {
              display: block;
              flex: 1;
              height: 40px;
              max-width: 230px;
              margin-right: 15px;
              &.keep-shopping-btn {
                color: var(--color-121212);
                font-size: 14px;
                line-height: 19px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: underline;
                font-family: @font-family-600;
                text-transform: uppercase;
              }
              &:last-of-type {
                margin-right: 0px;
              }
              .btn {
                width: 100%;
              }
            }
            .btn-add-to-bag {
              min-width: 150px;
            }
          }
        }
      }
    }
    .cat-product-match-block {
      .cat-product-match-title {
        font-size: 14px;
        font-family: @font-family-600;
        margin-top: 25px;
        margin-bottom: 20px;
        text-transform: uppercase;
      }
      .cat-product-match-list {
        display: flex;
        justify-content: space-between;
        .seize-seat {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .cat-product-match-item {
            width: 138px;
            min-height: 210px;
          }
        }
        .cat-product-match-item {
          width: 138px;
          min-height: 210px;
          img {
            width: 100%;
            max-height: 179.24px;
            display: block;
          }
          a {
            display: block;
            position: relative;
            overflow: hidden;
            &:hover {
              .goods-name {
                transform: translateY(0);
              }
            }
          }
          .goods-name {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.8);
            text-align: center;
            font-size: 12px;
            color: var(--color-121212);
            padding: 5px 0px;
            transition: 0.3s;
            transform: translateY(100%);
          }
          /deep/ .exclusive-offer {
            margin-top: 5px;
          }
          /deep/ .sod-coupon-card {
            margin-top: 8px;
            &.mini {
              justify-content: flex-start;
            }
          }
        }
        /deep/ .product-swiper {
          width: 100%;
          .product-swiper-container {
            padding: 0 20px;
          }
        }
      }
      .cat-list-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        margin-bottom: 20px;
        position: relative;
        li {
          font-size: 13px;
          padding: 0 20px;
          cursor: pointer;
          &.active {
            color: @theme-color;
          }
          &:first-of-type {
            padding-left: 0;
          }
          &:last-of-type {
            padding-right: 0;
          }
        }
        .under-line {
          position: absolute;
          left: 0;
          bottom: -3px;
          height: 3px;
          width: 130px;
          background: @theme-color;
          transition: all 0.3s;
        }
      }
    }
  }
}
.add-cart-dialog {
  .add-cart-dialog-content {
    .btn-add-to-bag {
      background: @theme-color;
      border: solid 1px @theme-color;
    }
    .goods-com-price .goods-price.red {
      // color: @theme-color;
      color: var(--color-121212);
    }
    .cat-product-match-block .cat-list-box li.active {
      color: @theme-color;
    }
    .cat-product-match-block .cat-list-box .under-line {
      background: @theme-color;
    }
  }
  .sod-coupon-tips {
    position: relative;
    top: -10px;
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    background-color: @bg-color;
    color: var(--color-121212);
    font-family: @font-family-500;
    font-size: 13px;
    letter-spacing: 0.52px;
    span {
      line-height: normal;
    }
    .bold {
      font-family: @font-family-600;
    }
  }
}
</style>
<style lang="less">
@media screen and (max-width: 1200px) {
  .az-overlay-box .az-popup-box {
    min-width: initial;
  }
}
span.bold {
  font-family: @font-family-600;
}
</style>
