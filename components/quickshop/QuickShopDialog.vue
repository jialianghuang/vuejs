<template>
  <az-overlay
    v-if="Object.keys(baseInfo).length > 0"
    @click="closeQuickShop"
    :class="[showAnimate ? 'animation-fade-enter-active' : 'animation-fade-leave-active']"
    :z-index="15"
  >
    <template v-if="componentReady">
      <client-only><SvgProduct /> </client-only>
      <!-- showroom quickshop -->
      <div id="order_dress" v-if="hasCustomSize && fromDialog == 'showroom'" class="quick_shop_dialog">
        <div class="popup">
          <h2>{{ nl('page_goods_select_size') }}</h2>
          <div class="tabs">
            <span @click="tabShowClick('standard')" :class="{ active: tabShow == 'standard' }" class="tab">{{
              nl('page_order_standard_size')
            }}</span>
            <span @click="tabShowClick('custom')" :class="{ active: tabShow == 'custom' }" class="tab">{{
              nl('page_goods_custom_size')
            }}</span>
          </div>
          <div class="content">
            <div v-show="tabShow == 'standard'" class="standard-size">
              <div class="left">
                <div class="goods-info">
                  <div class="goods-img">
                    <az-sticker
                      v-if="baseInfo.stickers && Object.keys(baseInfo.stickers).length"
                      :stickerInfo="baseInfo.stickers"
                      :sticker-class="`cart-product-item-icon`"
                      :goodsId="baseInfo.goodsId"
                    ></az-sticker>
                    <img :src="addWebpSuffix(imageInfo.browserPrefix + showRoomGoodsThumbUrl)" alt="standard-size-good-img" />
                    <span v-if="baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
                  </div>
                  <div class="detail">
                    <p class="goods_name">{{ baseInfo.shownGoodsName }}</p>
                    <p class="cat_name">{{ baseInfo.catName }}</p>
                    <p v-if="baseInfo.fabric" class="goods_fabric">{{ nl('page_common_fabric') }}: {{ baseInfo.fabric }}</p>
                    <template v-if="baseInfo.hasLinePrice">
                      <span class="price-display">{{ baseInfo.shopPriceDisplay }}</span>
                      <span style="color: var(--color-999999);text-decoration: line-through">{{ baseInfo.noDealPriceDisplay }}</span>
                    </template>
                    <span v-else class="goods_price">{{ baseInfo.shopPriceDisplay }}</span>
                    <!-- 展示含税提示 -->
                    <p v-if="taxIncluseText" class="tax-incluse tax-incluse-small">{{ taxIncluseText }}</p>
                  </div>
                </div>
                <p
                  v-if="baseInfo.catId == 7"
                  @click="toggleMeasurementShow"
                  :class="{ show: measurementStandardShow }"
                  class="show-measurement-bri"
                >
                  <a class="show-measure-img">{{ nl('page_size_how_to_take_measurement') }}</a>
                  <span :class="measurementStandardShow ? 'r-bottom' : 'r-right'"></span>
                </p>
                <p v-else @click="toggleMeasurementShow" :class="{ show: measurementStandardShow }" class="show-measurement">
                  <a class="show-measure-img">{{ nl('page_size_how_to_take_measurement') }}</a>
                  <span :class="measurementStandardShow ? 'r-bottom' : 'r-right'"></span>
                </p>
                <p v-show="measurementStandardShow" class="measurement">
                  <img
                    v-if="baseInfo.catId == 9"
                    :src="addWebpSuffix(nl('page_image_jbd_measure'))"
                    alt="measure image"
                    width="398"
                    height="296"
                  />
                  <template v-else-if="baseInfo.catId == 7">
                    <video
                      id="myVideo"
                      ref="standardSizeVideo"
                      :poster="replaceImgCdnUrl(nl('page_image_pc_measurement_poster'))"
                      class="quick-shop-video"
                      controls
                      preload="auto"
                      width="400"
                      height="247"
                      data-setup="{}"
                    >
                      <source :src="nl('page_video_size_guide_url')" type="video/mp4" />
                    </video>
                  </template>
                  <img
                    v-else-if="baseInfo.catId == 45"
                    :src="addWebpSuffix(nl('page_image_standard_size_new'))"
                    alt="measure image"
                    width="398"
                    height="323"
                  />
                  <img
                    v-else-if="baseInfo.catId == 2 && styleInfo.sizeChart.hasNeckHole"
                    :src="addWebpSuffix(nl('page_image_measure_size_chart'))"
                    alt="measure image"
                    width="370"
                    height="328"
                  />
                  <img
                    v-else-if="baseInfo.catId == 2 && !styleInfo.sizeChart.hasNeckHole"
                    :src="addWebpSuffix(nl('page_image_standard_size'))"
                    alt="measure image"
                    width="398"
                    height="296"
                  />
                  <img v-else :src="addWebpSuffix(nl('page_image_bride_measure'))" alt="measure image" width="398" height="296" />
                </p>
                <div class="size-unit">
                  <span class="unit">IN</span>
                  <div @click="switchUnit" :class="{ right_unit: unit == 'cm' }" class="unit-switch"><span class="switch-icon"></span></div>
                  <span class="unit">CM</span>
                </div>
                <template v-if="styleInfo.sizeChart && !!styleInfo.sizeChart.length">
                  <table class="inch_content">
                    <thead>
                      <tr :valign="baseInfo.catId == 2 ? 'top' : ''">
                        <th>{{ styleInfo.sizeChart.firstTitle }}</th>
                        <th v-if="styleInfo.sizeChart.secondTitle">{{ styleInfo.sizeChart.secondTitle }}</th>
                        <!-- <th v-if="showEuSizeMap">EU</th> -->
                        <th v-for="(attr, index) in styleInfo.sizeChart[unit][0].sizeDetail" :key="index">
                          <span v-if="unit == 'cm'">{{ attr.name }}({{ nl('page_common_length_cm') }})</span>
                          <span v-else>{{ attr.name }}({{ nl('page_size_inch_abbr') }})</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        :class="{ pink: selectedSize.styleId == sizeInfo.styleId }"
                        v-for="(sizeInfo, index) in styleInfo.size"
                        :key="index"
                      >
                        <th>{{ sizeInfo.shownName }}</th>
                        <td v-if="styleInfo.sizeChart.secondTitle">{{ styleInfo.sizeChart[unit][index].secondName }}</td>
                        <!-- <td v-if="showEuSizeMap" class="eu-size-map">{{ euSizeMap[baseInfo.catId][sizeInfo.name] }}</td> -->
                        <td v-for="(detail, detailIndex) in styleInfo.sizeChart[unit][index].sizeDetail" :key="detailIndex">
                          {{ detail.value }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </template>
                <div class="note-size">
                  <strong>{{ nl('page_size_note') }}</strong> {{ nl('page_size_note1_part') }}
                  <a @click="tabShowClick('custom')" class="jump-to-custom-size">{{ nl('page_goods_custom_size') }}</a
                  >.
                </div>
              </div>
              <div class="right">
                <p class="title">{{ nl('page_size_select_your_dress_size') }}</p>
                <size-list
                  :sizes="styleInfo.size"
                  :selected-size-id="selectedSize.styleId"
                  :hide-size-map="hideSizeMap"
                  :size-hover-tip="{}"
                  :fromDialog="fromDialog"
                  @select-size="selectSizeFun"
                ></size-list>
                <p class="size-check">
                  <span class="size_check">{{ nl('page_order_size_check_desc') }}</span>
                  <span class="information">
                    {{ nl('page_order_size_check_confirm') }}
                    <span v-if="baseInfo.catId == 45">{{ nl('page_size_advice') }}</span>
                  </span>
                </p>
                <div v-if="baseInfo.catId == 3110 && atelierIsNotifyMe" class="add_to_bag_block">
                  <az-button
                    id="notify-me"
                    v-track.view.click="getNotifyMeParams(baseInfo)"
                    @click="changeDialogStatus"
                    :text="nl('page_notify_me')"
                    icon="icon-icon_notice"
                    class="notify-btn"
                  ></az-button>
                </div>
                <div v-else class="add_to_bag_block 222">
                  <az-button
                    id="standard_add_to_bag"
                    @click="dialogAddToBag"
                    @mouseenter.native="checkStyle"
                    @mouseleave.native="hideCheckTip"
                    :text="nl('page_order_add2bag')"
                    :loading="loading"
                    icon="icon-xxy_add_to_bag"
                  ></az-button>
                  <check-tips v-show="showCheckTip" :tips="checkTips"></check-tips>
                </div>
              </div>
            </div>
            <div v-show="tabShow == 'custom'" class="custom-size">
              <div class="left">
                <div class="goods-info">
                  <div class="goods-img">
                    <az-sticker
                      v-if="baseInfo.stickers && Object.keys(baseInfo.stickers).length"
                      :stickerInfo="baseInfo.stickers"
                      :sticker-class="`cart-product-item-icon`"
                      :goodsId="baseInfo.goodsId"
                    ></az-sticker>
                    <img
                      :src="addWebpSuffix(imageInfo.browserPrefix + productImgs[0].imgUrl)"
                      alt="measure image"
                      width="74"
                      height="102"
                    />
                    <span v-if="baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
                  </div>
                  <div class="detail">
                    <p class="goods_name">{{ baseInfo.shownGoodsName }}</p>
                    <p class="cat_name">{{ baseInfo.catName }}</p>
                    <p v-if="baseInfo.fabric" class="goods_fabric">{{ nl('page_common_fabric') }}: {{ baseInfo.fabric }}</p>
                    <template v-if="baseInfo.hasLinePrice">
                      <span class="support-link">{{ baseInfo.shopPriceDisplay }}</span>
                      <span style="color: var(--color-999999);text-decoration: line-through">{{ baseInfo.noDealPriceDisplay }}</span>
                    </template>
                    <span v-else class="goods_price">{{ baseInfo.shopPriceDisplay }}</span>
                  </div>
                </div>
                <template v-if="[7, 158].includes(baseInfo.catId)">
                  <p v-show="!measurementCustomShow" @click="toggleMeasurementShow" class="measurement-custom">
                    <a class="show-measure-img">{{ nl('page_product_checkout_video') }}</a> <span class="r-right"></span>
                  </p>
                  <p v-show="measurementCustomShow" @click="toggleMeasurementShow" class="measurement-custom-show">
                    <span class="r-left"></span> <a class="show-measure-img">{{ nl('page_product_back_measurement') }}</a>
                  </p>
                  <p v-show="measurementCustomShow" class="measurement">
                    <video
                      id="myVideo_custom"
                      ref="customSizeVideo"
                      :poster="replaceImgCdnUrl(nl('page_image_pc_measurement_poster'))"
                      class="quick-shop-video"
                      controls
                      preload="auto"
                      width="400"
                      height="247"
                      data-setup="{}"
                    >
                      <source :src="nl('page_video_size_guide_url')" type="video/mp4" />
                    </video>
                  </p>
                </template>
                <div v-show="!measurementCustomShow" class="normal_measure">
                  <div v-if="baseInfo.catId == 9" class="custom-size-image">
                    <img :src="addWebpSuffix(nl('page_image_custom_size_jbd'))" alt="measure image" width="424" height="344" />
                  </div>
                  <div v-else-if="baseInfo.catId == 45" class="custom-size-image">
                    <img :src="addWebpSuffix(nl('page_image_custom_size_maternity'))" alt="measure image" width="424" height="423" />
                  </div>
                  <div v-else-if="styleInfo.sizeChart.hasUnderBust && !styleInfo.sizeChart.isUnderBust" class="custom-size-image">
                    <img :src="addWebpSuffix(nl('page_image_custom_under_bust'))" alt="measure image" width="424" height="423" />
                  </div>
                  <div v-else-if="baseInfo.catId == 2 && styleInfo.sizeChart.hasNeckHole" class="custom-size-image-neck">
                    <img :src="addWebpSuffix(nl('page_image_custom_size_neck'))" alt="measure image" width="424" height="384" />
                    <img
                      v-if="styleInfo.sizeChart.withWrap"
                      :src="nl('page_image_custom_size_with_wrapper')"
                      style="margin-left: -18px;"
                      alt="measure image"
                      width="450"
                      height="230"
                    />
                  </div>
                  <div v-else class="custom-size-image">
                    <img :src="addWebpSuffix(nl('page_image_custom_size'))" alt="measure image" width="424" height="344" />
                    <img
                      v-if="styleInfo.sizeChart.withWrap"
                      :src="addWebpSuffix(nl('page_image_custom_size_with_wrapper'))"
                      style="margin-left: -18px;"
                      alt="measure image"
                      width="450"
                      height="230"
                    />
                  </div>
                </div>
              </div>
              <div class="right">
                <h3>
                  {{ nl('page_order_size_measurement') }}
                  <span>
                    ({{ nl('page_quick_shop_dialog_text') }} <span class="color-theme">{{ nl('page_checkout_free') }}</span
                    >)
                  </span>
                </h3>

                <div v-if="!isNewLanguageCountry" class="customer-size-tape-link">
                  <p>
                    {{ nl('page_size_tape') }}
                    <a :href="countryUrl('/products/azazie-tape-measure')" class="custom-size-click-me" target="_window">
                      {{ nl('page_size_click') }}</a
                    >
                    .
                  </p>
                </div>
                <custom-size
                  ref="customSize"
                  v-if="customSizeInfo.custom_size_status"
                  :is-visible="tabShow == 'custom'"
                  :unit="unit"
                  :sizeChart="styleInfo.sizeChart"
                  :goodsId="baseInfo.goodsId"
                  :customData="customData"
                  :fromDialog="'showroom'"
                  @switch-unit="switchUnit"
                ></custom-size>
                <div class="add_to_bag_block">
                  <az-button
                    id="custom_add_to_bag"
                    @click="dialogAddToBag"
                    @mouseenter.native="checkStyle"
                    @mouseleave.native="hideCheckTip"
                    :text="nl('page_order_add2bag')"
                    :loading="loading"
                    icon="icon-xxy_add_to_bag"
                  ></az-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <az-icon @click="closeQuickShop" class="close_btn" icon-class="icon-icon_style_gallery_off" />
      </div>
      <!-- 常规quickshop -->
      <div id="quick_shop" v-else :class="versionObj.listWithCodeAbtest" class="quick_shop_dialog">
        <div class="popup">
          <div :class="{ 'm-t-0': productImgs.length <= 5 }" class="dialog_left">
            <div ref="swiperThumbs" v-swiper:swiperThumbs="thumbswiperOption" class="swiper-container carousel-vertical">
              <div class="swiper-wrapper prodp-list">
                <li
                  v-for="(pic, index) in productImgs"
                  :key="index"
                  :data-swiper-slide-index="index"
                  class="swiper-slide recommend-goods-li-vertical"
                >
                  <img
                    :src="addWebpSuffix(pic.imgType ? `${imageInfo.browserPrefix}${pic.imgUrl}` : `${pic.images.PCLeft}`)"
                    class="recommend-goods-pic-vertical"
                    alt="Azazie Blake"
                  />
                </li>
              </div>
            </div>
            <a v-show="productImgs.length > 5" href="javascript:void(0)" class="swiper-button-prev prev-arraw-vertical">
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
            </a>
            <a v-show="productImgs.length > 5" href="javascript:void(0)" class="swiper-button-next next-arraw-vertical">
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
            </a>
          </div>
          <div
            v-track.viewOnce.click="
              isExcitationLoading
                ? getExcitationParams(
                    'stimulatequick',
                    'stimulatequick',
                    baseInfo,
                    getExcitationSticker(baseInfo).text,
                    fromDialog + 'quickshop',
                    baseInfo.driveInfo && baseInfo.driveInfo.listSticker
                  )
                : null
            "
            :class="['dialog_middle', { sod: isSpecialCatId(baseInfo.catId) }]"
          >
            <ExcitationCard v-if="false && Object.keys(getExcitationSticker(baseInfo)).length" :sticker="getExcitationSticker(baseInfo)" />
            <div ref="swiperMain" v-swiper:swiperMain="swiperOption" class="swiper-container">
              <div class="swiper-wrapper">
                <div v-for="(pic, index) in productImgs" :key="index" class="swiper-slide">
                  <az-sticker
                    v-if="showSticker"
                    :stickerInfo="getSticker"
                    :flashSaleInfo="flashSaleInfo"
                    :goodsId="baseInfo.goodsId"
                    :isGiftActivity="!!giftActivityId || fromDialog == 'cartFreeGift'"
                    :hideShipIcon="hideShipIcon"
                  ></az-sticker>
                  <img :src="addWebpSuffix(`${imageInfo.thumbPrefix}${pic.imgUrl}`)" alt="measure image" class="recommend_goods_pic" />
                  <span v-if="baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
                </div>
              </div>
            </div>
            <a v-show="productImgs.length > 1" href="javascript:void(0)" class="swiper-button-prev prev-arraw-horizontal">
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
            </a>
            <a v-show="productImgs.length > 1" href="javascript:void(0)" class="swiper-button-next next-arraw-horizontal">
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
            </a>
          </div>
          <div ref="rightBlock" :class="['dialog_right', { 'sod-b': sodDetailVersionFun(baseInfo) }, $route.name]">
            <div class="prod-info-base">
              <h1>
                <span v-if="baseInfo.isFreeShipping && !isSpecialCatId(baseInfo.catId)" class="icon-free-ship"></span>
                <span
                  :class="{ 'special-occasions-pop-prod-name': isSpecialCatId(baseInfo.catId) }"
                  :data-base-name="baseInfo.shownGoodsName"
                  class="prod-name"
                  >{{ baseInfo.shownGoodsName }}</span
                >
                <az-label-sticker :stickers="stickerInfo" margin="-3px 2px 0px"></az-label-sticker>
              </h1>
              <div v-if="!showSodCouponPrice" class="price prod-com-price">
                <!-- AZWEB-18887 样衣3件20活动 tryonSaveLimit-->
                <template v-if="baseInfo.tryonSaveLimit">
                  <span class="origin-price">{{ baseInfo.shopPriceDisplay }}</span>
                  <span
                    v-html="nl('page_common_try_on_number_for_wd_' + country.toLowerCase(), null, { number: baseInfo.tryonSaveLimit })"
                    v-if="baseInfo.catId == 2"
                    class="price-item"
                  >
                  </span>
                  <span
                    v-else
                    v-html="nl('page_common_try_on_number_for_' + country.toLowerCase(), null, { number: baseInfo.tryonSaveLimit || 3 })"
                    class="price-item"
                  >
                  </span>
                </template>
                <!-- 如果是买赠活动的赠品quick shop 弹窗，价格显示 0 -->
                <template v-else-if="giftActivityId || fromDialog == 'cartFreeGift'">
                  <span class="goods-price">{{ `${baseInfo.priceSymbol}0` }}</span>
                  <span class="goods-no-deal-price">{{ baseInfo.noDealPriceDisplay }}</span>
                </template>
                <template v-else-if="isBridal && baseInfo.dressType == 'sample'">
                  <span class="origin-price">{{ baseInfo.originalPriceInfo && baseInfo.originalPriceInfo.noDealPriceDisplay }}</span>
                  <span class="price-item">| {{ nl('page_common_try_on_for') }}</span>
                  <span class="no-deal-price sample-price">{{ baseInfo.shopPriceDisplay }}</span>
                </template>
                <template v-else-if="baseInfo.hasShopPriceRange || baseInfo.hasLinePrice">
                  <!-- AZWEB-21266 未选中sku时展示价格区间 -->
                  <span v-if="baseInfo.hasShopPriceRange" class="goods-price range-price"
                    >{{ baseInfo.minShopPriceDisplay }} - {{ baseInfo.maxShopPriceDisplay }}</span
                  >
                  <span v-else class="goods-price">{{ baseInfo.shopPriceDisplay }}</span>
                  <span class="goods-no-deal-price">{{ baseInfo.noDealPriceDisplay }}</span>
                </template>
                <span v-else>
                  {{ baseInfo.shopPriceDisplay }}
                </span>
                <!-- 如果是买赠活动的赠品quick shop 弹窗,不展示 -->
                <template v-if="!giftActivityId && fromDialog !== 'cartFreeGift'">
                  <cyber-sale v-if="cyberSaleInfo && catId != 3108" :desc="cyberSaleInfo.desc" scene="details"></cyber-sale>
                  <template v-else-if="!cyberSaleInfo">
                    <az-limited-time
                      v-if="!baseInfo.activityCouponCode && baseInfo.hasLinePrice && baseInfo.shopPrice != baseInfo.noDealPrice"
                      :stickers="stickerInfo"
                      :show-limited-time-tag="true"
                      :goodsId="baseInfo.goodsId"
                    ></az-limited-time>
                  </template>
                </template>

                <cyber-sale v-else-if="cyberSaleInfo && catId != 3108" :desc="cyberSaleInfo.desc" scene="details"></cyber-sale>
                <exclusive-offer
                  v-if="baseInfo.showBundlePrice && !['cartEdit', 'redeemed'].includes(fromDialog)"
                  :price="baseInfo.bundlePrice"
                  :priceOff="baseInfo.bundlePriceOff"
                  scene="quickShopDialog"
                  question-position="under"
                ></exclusive-offer>
              </div>
              <template v-else>
                <SodCouponPriceOriginBox v-if="showSodBaseCouponPrice" v-bind="sodCouponPriceOriginValue" :from="'quickshop'" />
                <SodCouponPriceBox :base-info="baseInfo" :from="'quickshop'" />
              </template>

              <!-- AzWithCoupon 有划线价就展示save百分比,不分是 coupon  activity sale 、 limit sale 、 flash sale -->
              <AzWithCoupon
                v-if="(baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue) && !showSodCouponPrice"
                :value="baseInfo.hasShopPriceRange ? baseInfo.upToSaveRateValue : baseInfo.offRateValue"
                :showText="!!baseInfo.activityCouponCode"
                :code="showCode(baseInfo)"
                :hasShopPriceRange="baseInfo.hasShopPriceRange"
                :baseInfo="baseInfo"
                :fromDialog="fromDialog"
              />
              <p v-if="taxIncluseText" class="tax-incluse">{{ taxIncluseText }}</p>
              <!-- 预售商品进度条 -->
              <div v-if="baseInfo.preSaleGoodsProgress && Object.keys(baseInfo.preSaleGoodsProgress).length" class="goods-progress">
                <prelaunch-goods-progress
                  :from="'product'"
                  :preSaleGoodsProgress="baseInfo.preSaleGoodsProgress"
                ></prelaunch-goods-progress>
              </div>
              <flash-sale-timer
                v-if="!baseInfo.activityCouponCode && !giftActivityId && fromDialog !== 'cartFreeGift'"
                :is-quick-shop="true"
                :baseInfo="baseInfo"
                :flashSaleInfo="flashSaleInfo"
              ></flash-sale-timer>
            </div>
            <SodComingSoon
              v-if="
                isSpecialCatId(baseInfo.catId) && (baseInfo.isMeasurementHideGoods || baseInfo.isComingSoon) && !baseInfo.sodPreSaleGoods
              "
              :fromDialog="fromDialog"
              :stock-info="stockInfo"
              :style-info="styleInfo"
              :retire-info="retireInfo"
              :make-time-info="makeTimeInfo"
              :sticker-info="stickerInfo"
            ></SodComingSoon>
            <template v-else-if="!baseInfo.isComingSoon || sodPreSaleGoods">
              <sample-style
                ref="sampleStyle"
                :key="baseInfo.goodsId"
                v-if="['sample', 'clearance', 'outlet'].includes(baseInfo.dressType) || baseInfo.isFinalSale"
                :fromDialog="fromDialog"
                :stock-info="stockInfo"
                :style-info="styleInfo"
                :retire-info="retireInfo"
                :make-time-info="makeTimeInfo"
                :class="{ up_tips: upTips, 'select-size': selectedSize.key }"
                @addSuccess="addSuccess"
                @refreshCartList="refreshCartList"
                @refreshGiftActivity="refreshGiftActivity"
                @onConfirm="handleConfirm"
                :giftActivityId="giftActivityId"
                :isFindSimilar="isFindSimilar"
                :scene="scene"
              ></sample-style>
              <template v-else-if="baseInfo.isStockGoods">
                <stock-style
                  ref="stockStyle"
                  :key="baseInfo.goodsId"
                  :fromDialog="fromDialog"
                  :stock-info="stockInfo"
                  :style-info="styleInfo"
                  :retire-info="retireInfo"
                  :make-time-info="makeTimeInfo"
                  :class="{ up_tips: upTips, 'select-size': selectedSize.key }"
                  :isExcitationLoading="isExcitationLoading"
                  @addSuccess="addSuccess"
                  @refreshCartList="refreshCartList"
                  @refreshGiftActivity="refreshGiftActivity"
                  @onConfirm="handleConfirm"
                  :giftActivityId="giftActivityId"
                  :isFindSimilar="isFindSimilar"
                  :scene="scene"
                ></stock-style>
              </template>
              <normal-stock-style
                ref="normalStockStyle"
                :key="'normalStockStyle' + baseInfo.goodsId"
                v-else-if="isNormalStock"
                :fromDialog="fromDialog"
                :stock-info="stockInfo"
                :style-info="styleInfo"
                :retire-info="retireInfo"
                :make-time-info="makeTimeInfo"
                :class="{ up_tips: upTips, 'select-size': selectedSize.key }"
                @addSuccess="addSuccess"
                @refreshCartList="refreshCartList"
                @refreshGiftActivity="refreshGiftActivity"
                @onConfirm="handleConfirm"
                :giftActivityId="giftActivityId"
                :isFindSimilar="isFindSimilar"
                :scene="scene"
              >
              </normal-stock-style>
              <normal-style
                ref="normalStyle"
                :key="'normalStyle' + baseInfo.goodsId"
                v-else
                :fromDialog="fromDialog"
                :stock-info="stockInfo"
                :style-info="styleInfo"
                :retire-info="retireInfo"
                :make-time-info="makeTimeInfo"
                :class="{ up_tips: upTips, 'select-size': selectedSize.key }"
                @addSuccess="addSuccess"
                @refreshCartList="refreshCartList"
                @refreshGiftActivity="refreshGiftActivity"
                @onConfirm="handleConfirm"
                :giftActivityId="giftActivityId"
                :isFindSimilar="isFindSimilar"
                :scene="scene"
              ></normal-style>
            </template>
            <!-- 买赠活动的赠品弹窗不展示 view detail 链接 -->
            <a
              v-if="!['cartFreeGift'].includes(fromDialog)"
              :class="{ need_datalayer: isSpecialCatId(baseInfo.catId) }"
              :href="navToGoodsDetailNew(navToGoodsDetail(baseInfo.goodsUrl, baseInfo))"
              @click="hrefPoint()"
              :data-datalayer-category="isSpecialCatId(baseInfo.catId) ? 'QuickShopDresses' : ''"
              :data-datalayer-label="isSpecialCatId(baseInfo.catId) ? 'QuickShopDresses_ViewFullDetails_Click' : ''"
              class="page_cart_recommend_view_detail"
              target="_blank"
              >{{ nl('page_cart_recommend_view_detail') }}
            </a>
            <div
              v-if="
                youMayAlsoLikeList.length &&
                  !stylePricePending &&
                  recommendBlockShow &&
                  ['product', 'list', 'cart', 'youmayalsolike'].includes(fromDialog) &&
                  !hideCatIds.includes(baseInfo.catId)
              "
              class="you-may-also-like"
            >
              <div class="title">{{ nl('page_cart_recommend_desc') }}</div>
              <div class="prod_list">
                <div
                  v-for="(item, index) in youMayAlsoLikeList"
                  :key="index"
                  @click="recommendClick(item)"
                  v-track.click="{
                    click: getGAItemListParams(item, index, 'imgClick', nl('page_cart_recommend_desc'))
                  }"
                  class="prod_item"
                >
                  <img :src="addWebpSuffix(item.imgUrl)" :alt="item.shownGoodsName" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div @click="closeQuickShop" class="close_btn">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <div v-if="quickShopDialogLaoding" class="quick-shop-dialog-loading">
          <div class="loading-icon"></div>
        </div>
      </div>
      <size-chart-layer v-if="sizeChartLayerShow" :baseInfo="baseInfo" :sizeChartInfo="styleInfo.sizeChart"></size-chart-layer>
      <template v-if="baseInfo.catId == 3110">
        <notify-dialog
          @show-notify-dialog="changeDialogStatus"
          :show-dialog="showNotifyDialog"
          :baseInfo="baseInfo"
          :is-sample="false"
          v-bind="notifyBindValue"
        ></notify-dialog>
      </template>
    </template>
    <AzLoading v-else />
  </az-overlay>
</template>

<script>
/**
 * quickshop 弹框
 * 异步组件
 */
import AzLoading from '@/components/az-ui/AzLoading'
import AzButton from '@/components/az-ui/AzButton'
import CheckTips from '@/components/quickshop/style/CheckTips'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import azOverlay from '@/components/az-ui/Overlay/AzOverlay'
import FlashSaleTimer from '@/components/quickshop/FlashSaleTimer'
import SampleStyle from '@/components/quickshop/SampleStyle'
import StockStyle from '@/components/quickshop/StockStyle'
import NormalStyle from '@/components/quickshop/NormalStyle'
import NormalStockStyle from '@/components/quickshop/NormalStockStyle'
import AzLimitedTime from '@/components/az-ui/AzLimitedTime'
import SizeList from '@/components/quickshop/style/SizeList'
// import AzWithCode from '@/components/az-ui/AzWithCode'
import CustomSize from '@/components/quickshop/CustomSize'
import SizeChartLayer from '@/components/quickshop/SizeChartLayer'
import PrelaunchGoodsProgress from '@/components/promotion/PrelaunchGoodsProgress'
import ExclusiveOffer from '@/components/product/ExclusiveOffer'
import SodComingSoon from '@/components/quickshop/SodComingSoon'
import ExcitationCard from '@/components/common/excitation/ExcitationCard'
import SodCouponPriceOriginBox from '@/components/common/excitation/SodCouponPriceOriginBox'
import SodCouponPriceBox from '@/components/common/excitation/SodCouponPriceBox'
import CyberSale from '@/components/list/CyberSale'
import AzWithCoupon from '@/components/az-ui/AZWithCoupon'
import AzLabelSticker from '@/components/az-ui-new/AzLabelSticker'

import { mapState } from 'vuex'
import { euSizeMap, countryList } from '@/assets/js/euSizeMap'
import { setSelectedSizeLocal } from '@/assets/js/commonFun'
import { loadLanguagePromise } from '@/plugins/commonAsyncData'
import notifyMeMixins from '@/assets/js/notifyMeMixins'
import NotifyDialog from '@/components/product/style/NotifyDialog'
import SvgProduct from '@/components/svgs/SvgProduct'

const languageKeys = [
  'page_goods_select_size',
  'page_order_standard_size',
  'page_goods_custom_size',
  'page_common_fabric',
  'page_size_how_to_take_measurement',
  'page_image_jbd_measure',
  'page_image_pc_measurement_poster',
  'page_video_size_guide_url',
  'page_image_standard_size_new',
  'page_image_measure_size_chart',
  'page_image_standard_size',
  'page_image_bride_measure',
  'page_common_length_cm',
  'page_size_inch_abbr',
  'page_size_note',
  'page_size_note1_part',
  'page_size_select_your_dress_size',
  'page_order_size_check_desc',
  'page_order_size_check_confirm',
  'page_size_advice',
  'page_order_add2bag',
  'page_product_checkout_video',
  'page_product_back_measurement',
  'page_image_custom_size_jbd',
  'page_image_custom_size_maternity',
  'page_image_custom_under_bust',
  'page_image_custom_size_neck',
  'page_image_custom_size_with_wrapper',
  'page_image_custom_size',
  'page_order_size_measurement',
  'page_quick_shop_dialog_text',
  'page_checkout_free',
  'page_size_tape',
  'page_size_click',
  'page_common_save',
  'page_cart_recommend_view_detail',
  'page_cart_recommend_desc',
  'page_common_color',
  'page_common_sash_color',
  'page_common_size',
  'page_goods_please_provide',
  'page_js_accept',
  'page_common_with_code',
  'page_common_try_on_for',
  ...countryList.map((v, i) => 'page_common_try_on_number_for_wd_' + v),
  ...countryList.map((v, i) => 'page_common_try_on_number_for_' + v),
  ...AzSticker.languageKeys,
  ...FlashSaleTimer.languageKeys,
  ...SampleStyle.languageKeys,
  ...StockStyle.languageKeys,
  ...NormalStyle.languageKeys,
  ...NormalStockStyle.languageKeys,
  ...AzLimitedTime.languageKeys,
  ...CustomSize.languageKeys,
  ...SizeChartLayer.languageKeys,
  ...PrelaunchGoodsProgress.languageKeys,
  ...ExclusiveOffer.languageKeys,
  ...SodComingSoon.languageKeys,
  ...ExcitationCard.languageKeys,
  ...SodCouponPriceOriginBox.languageKeys,
  ...SodCouponPriceBox.languageKeys,
  ...CyberSale.languageKeys,
  ...AzLabelSticker.languageKeys
]

let quickshopVm = null
export default {
  name: 'QuickShopDialog',
  components: {
    AzLoading,
    azOverlay,
    AzSticker,
    FlashSaleTimer,
    SampleStyle,
    StockStyle,
    NormalStyle,
    NormalStockStyle,
    AzLimitedTime,
    SizeList,
    CustomSize,
    SizeChartLayer,
    CheckTips,
    AzButton,
    // AzWithCode,
    PrelaunchGoodsProgress,
    ExclusiveOffer,
    SodComingSoon,
    ExcitationCard,
    SodCouponPriceOriginBox,
    SodCouponPriceBox,
    CyberSale,
    AzWithCoupon,
    NotifyDialog,
    AzLabelSticker,
    SvgProduct
  },
  mixins: [notifyMeMixins],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    fromDialog: {
      type: String,
      default: ''
    },
    // 使用场景值，较细的场景类型
    scene: {
      type: String,
      default: ''
    },
    // 调用quickshop接口时，组件外部的loading状态
    quickShopLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      componentReady: false, // 异步多语言是否加载完成
      showAnimate: false,
      isInit: 1,
      successNotificationShow: false,
      flashSaleInfo: null,
      thumbswiperOption: {
        direction: 'vertical',
        slidesPerView: 5,
        // slidesOffsetBefore: 10,
        watchSlidesVisibility: true, // 防止不可点击
        navigation: {
          prevEl: '.prev-arraw-vertical',
          nextEl: '.next-arraw-vertical'
        },
        on: {
          click() {
            if (typeof this.clickedIndex !== 'number') return // 点击空白的地方
            quickshopVm.changCurrentImg(this.clickedIndex)
          }
        }
      },
      swiperOption: {
        direction: 'horizontal', // 横向切换
        loop: true,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        slidesPerView: 1,
        navigation: {
          prevEl: '.prev-arraw-horizontal',
          nextEl: '.next-arraw-horizontal'
        },
        on: {
          slideChange() {
            quickshopVm.changCurrentThumbImg(this.realIndex)
          }
        }
      },
      hideCatIds: [3098],
      tabShow: 'standard',
      measurementStandardShow: false,
      measurementCustomShow: false,
      unit: 'inch',
      customData: {},
      checkTips: [],
      showCheckTip: false,
      allReady: false,
      loading: false,
      goodsNumber: 1,
      upTips: false, // checkTips 向上
      youMayAlsoLikeList: [], // quickshop 内商品推荐
      recommendBlockShow: false,
      quickShopDialogLaoding: false,
      stylePricePending: false,
      giftActivityId: 0,
      isFindSimilar: false,
      euSizeMap,
      isExcitationLoading: true,
      sodPicVersion: 'a', // quickshop sod 预售商品图片 打点 版本
      isSizeChanged: false, // size 是否变更
      isColorChanged: false, // color 是否变更
      discount: '', // 弹框里的discount（主要处理购物车编辑指定discount）
      showNotifyDialog: false
    }
  },
  computed: {
    ...mapState('quickshop', [
      'baseInfo',
      'makeTimeInfo',
      'selectedColor',
      'selectedSize',
      'selectedSashColor',
      'defaultSelectedSashColor',
      'imageInfo',
      'detailsInfo',
      'styleInfo',
      'stockInfo',
      'stickerInfo',
      'retireInfo',
      'isPlusSize',
      'plusSizeView',
      'sizeChartLayerShow',
      'isNormalStock',
      'indexNo',
      'showSticker',
      'hideShipIcon',
      'selectedOptions',
      'customSizeSelected',
      'customSizeInfo',
      'comingsoonGoodsId'
    ]),
    ...mapState('showroom', ['showroomBaseInfo']),
    ...mapState('list', ['sortBy']),
    ...mapState({
      mainSelectedSize: (state) => state.product.selectedSize,
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    hasColor() {
      return this.styleInfo.hasColor
    },
    hasSize() {
      return this.styleInfo.hasSize
    },
    isSample() {
      return this.baseInfo.dressType == 'sample'
    },
    isClearance() {
      return this.baseInfo.dressType == 'clearance' || this.baseInfo.dressType == 'outlet'
    },
    hasCustomSize() {
      // 库存商品没有custom size
      return this.styleInfo.customSize && this.customSizeInfo.custom_size_status && !this.baseInfo.isStockGoods
    },
    productImgs() {
      let productImgs = []
      if (this.imageInfo.goodsGallery[this.baseInfo.color] && this.imageInfo.goodsGallery[this.baseInfo.color].images) {
        productImgs = JSON.parse(JSON.stringify(this.imageInfo.goodsGallery[this.baseInfo.color].images))
      }
      if (this.baseInfo.hasSash) {
        let key = this.baseInfo.sashColor
        if (key == '' || !productImgs[key]) {
          key = this.defaultSelectedSashColor.key
          if (this.baseInfo.dressType == 'sample' || this.baseInfo.dressType == 'clearance' || this.baseInfo.dressType == 'outlet') {
            const sashColors = Object.keys(this.stockInfo.colorMap[this.baseInfo.color].allSashColor)
            key = sashColors[0]
          }
        }
        productImgs = productImgs[key]
      }
      const tempArr = []
      for (let i = 0; i < productImgs.length; i++) {
        const element = productImgs[i]
        if (element.isPlus) {
          tempArr.push(element)
          productImgs.splice(i, 1)
          i--
        }
      }
      if (this.isPlusSize) {
        productImgs = [...tempArr, ...productImgs]
      } else {
        productImgs = [...productImgs, ...tempArr]
      }

      return productImgs
    },
    showSizeUnit() {
      // 新增了三个国家ES DE IT都是要展示，目前看只有['US', 'UK']不展示，所以把判断条件改一下
      return !['US'].includes(this.country)
    },
    hideSizeMap({ baseInfo, stockInfo, selectedColor }) {
      const { colorMap = {} } = this.stockInfo || {}
      let tempObj = {}
      if (this.isSpecialCatId(baseInfo.catId)) {
        tempObj = colorMap[selectedColor.key] && colorMap[selectedColor.key].hideSize
      }
      return tempObj || {}
    },
    // sod 预售标记
    sodPreSaleGoods({ baseInfo }) {
      return this.isSpecialCatId(baseInfo.catId) && baseInfo.sodPreSaleGoods
    },
    getSticker({ baseInfo, stickerInfo }) {
      if (baseInfo.isMeasurementHideGoods && this.isSpecialCatId(baseInfo.catId)) {
        return stickerInfo.filter((sticker) => sticker.name != 'beBackSoon')
      }
      return stickerInfo
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
    normalPosition() {
      let positionIndex = 0
      const productImgs = JSON.parse(JSON.stringify(this.productImgs))
      if (this.isPlusSize) {
        for (let index = 0; index < productImgs.length; index++) {
          const element = productImgs[index]
          if (!element.isPlus) {
            positionIndex = index
            break
          }
        }
      }
      return positionIndex
    },
    plusPosition() {
      let positionIndex = 0
      const productImgs = JSON.parse(JSON.stringify(this.productImgs))
      if (!this.isPlusSize) {
        for (let index = 0; index < productImgs.length; index++) {
          const element = productImgs[index]
          if (element.isPlus) {
            positionIndex = index
            break
          }
        }
      }
      return positionIndex
    },
    showRoomGoodsThumbUrl({ productImgs, plusSizeView }) {
      const url = productImgs[0].imgUrl
      if (plusSizeView) {
        return (productImgs.find((item) => item.isPlus) || {}).imgUrl || url
      }
      return url
    },
    atelierIsNotifyMe({ baseInfo, selectedSize, comingsoonGoodsId }) {
      if (comingsoonGoodsId[baseInfo.goodsId]) {
        return comingsoonGoodsId[baseInfo.goodsId].includes(selectedSize.key)
      }
      return false
    }
  },
  watch: {
    baseInfo: {
      handler() {
        if (Object.keys(this.baseInfo).length > 0) {
          this.showAnimate = true
        }
      },
      immediate: true
    },
    selectedColor: {
      handler(val, oldVal) {
        // 清仓取消颜色选择的情况调item-info 接口不传尺码
        if (this.isClearance && this.selectedColor.styleId == 0) {
          this.getProductInfo()
        }
        if (val.styleId != 0) {
          this.isColorChanged = true
          this.isExcitationLoading = false
          this.recommendBlockShow = false
          this.setBaseInfo()
          this.getProductInfo()
          this.getSimilarPopular()
          this.$nextTick(() => {
            if (this.$refs.rightBlock && this.$refs.rightBlock.offsetHeight <= 450) this.recommendBlockShow = true
            this.setPoint('quickshop', 'recommend', 'view')
          })
        }
      },
      deep: true
    },
    selectedSize: {
      handler(val, oldVal) {
        // 之前这里的逻辑不满足样衣、清仓取消尺码选择，需要更新数据的情况
        // 应该只要styleId发生变更，就更新相关数据
        if (val.styleId != oldVal.styleId) {
          this.isSizeChanged = true
          // color请求接口中，不再发起接口请求,等锁释放，再去请求
          if (this.isColorChanged) return
          this.setBaseInfo()
          this.getProductInfo()
          if (this.isInCatIds(this.baseInfo.catId)) {
            this.getSimilarPopular()
          }
          this.initCurrentImgIntoView()
          this.$nextTick(() => {
            const dom = document.querySelector('.inch_content .pink')
            dom && dom.scrollIntoView({ block: 'center', behavior: 'smooth' })
          })
        }
        if (val.styleId == 0) {
          this.$store.commit('quickshop/setPlusSizeView', false)
        }
      },
      deep: true
    },
    // 监听 customsize 变动 是否选中都更新下数据
    customSizeSelected: {
      handler(val) {
        this.getProductInfo()
      }
    },
    selectedSashColor: {
      handler(val, oldVal) {
        if (val.styleId != 0) {
          this.setBaseInfo()
          this.getProductInfo()
        }
      },
      deep: true
    },
    openNotifyMe: {
      handler(val) {
        if (process.client) {
          const couponWheel = document.getElementById('coupon-box')
          const displayText = val ? 'none' : ''
          couponWheel && couponWheel.style.setProperty('display', displayText)
        }
      }
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.swiperThumbs && this.swiperMain && this.isInit === 0) {
        this.swiperThumbs.update()
        this.swiperMain.loopDestroy()
        this.swiperMain.loopCreate()
        this.swiperMain.update()
      }
      if (this.$refs.rightBlock) {
        this.upTips = this.$refs.rightBlock.offsetHeight > 580
      }
    })
  },
  created() {
    quickshopVm = this
    this.loadLanguagePromise()
    if (this.fromDialog == 'showroom') {
      // 针对showroom 弹窗的时候 AU CA FR MX ES DE IT 尺码默认cm，其他的情况在quickshopStyleMixins 处理了
      if (this.showEuSize) this.unit = 'cm'
    }
  },
  provide() {
    return {
      setSodGalleryVersion: () => {
        return {
          abVersion: this.sodPicVersion || 'a'
        }
      }
    }
  },

  methods: {
    async loadLanguagePromise() {
      try {
        this.componentReady = false
        await loadLanguagePromise({ store: this.$store, $axios: this.$axios, $loading: this.$loading }, languageKeys)
        this.componentReady = true
      } catch (e) {
        console.log(e)
      }
    },
    hrefPoint() {
      const msg = {
        goodsId: this.baseInfo.goodsId,
        color: this.selectedColor.key,
        size: this.selectedSize.key,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType,
        cat_id: this.baseInfo.catId
      }
      if (this.indexNo) {
        msg.no = this.indexNo
        msg.sort_by = this.sortBy
      }
      this.buryPoint(this, 'event', {
        ec: 'viewfulldetails',
        el: 'quickshop',
        ea: 'click',
        msg: JSON.stringify(msg)
      })
    },
    toggleMeasurementShow() {
      if (this.tabShow == 'standard') this.measurementStandardShow = !this.measurementStandardShow
      else this.measurementCustomShow = !this.measurementCustomShow
      // 切换展示时暂停视频
      if (this.$refs.standardSizeVideo) this.$refs.standardSizeVideo.pause()
      if (this.$refs.customSizeVideo) this.$refs.customSizeVideo.pause()
    },
    tabShowClick(tab) {
      if (tab === 'custom') {
        this.$store.commit('quickshop/setCustomSizeSelected', true)
      } else {
        this.$store.commit('quickshop/setCustomSizeSelected', false)
      }
      this.tabShow = tab
      this.selectSizeFun({
        key: '',
        name: '',
        styleId: 0
      })
      // 切换展示时暂停视频
      if (this.$refs.standardSizeVideo) this.$refs.standardSizeVideo.pause()
      if (this.$refs.customSizeVideo) this.$refs.customSizeVideo.pause()
    },
    // 一些stylemixin的方法
    selectSizeFun(size) {
      this.goodsNumber = 1
      if ((this.isSample || this.isClearance) && size.styleId == this.selectedSize.styleId) {
        this.$store.commit('quickshop/setSelectedSize', {
          name: '',
          key: '',
          styleId: 0
        })
      } else {
        this.$store.commit('quickshop/setSelectedSize', size)
        setSelectedSizeLocal(size, this.baseInfo.catId)
      }
      if (size.styleId != 0) {
        this.$store.commit('quickshop/setCustomSizeSelected', false)
      }
    },
    switchUnit() {
      this.unit = this.unit == 'inch' ? 'cm' : 'inch'
      sessionStorage.setItem('ca_unit', this.unit)
    },
    checkStyle() {
      this.checkTips = []
      const checkTips = []
      if (this.hasColor && this.selectedColor.styleId <= 0) {
        checkTips.push(this.nl('page_common_color'))
      }
      if (this.baseInfo.hasSash && this.selectedSashColor.styleId <= 0) {
        checkTips.push(this.nl('page_common_sash_color'))
      }
      if (this.hasSize && this.selectedSize.styleId <= 0 && !this.customSizeSelected) {
        checkTips.push(this.nl('page_common_size'))
      }
      let allReady = true
      if (checkTips.length > 0) {
        this.checkTips.push({
          title: this.nl('page_goods_please_provide'),
          items: checkTips
        })
        this.showCheckTip = true
        allReady = false
      }
      if ((this.isSample || this.isClearance) && !this.confirmSelected) {
        this.checkTips.push({
          title: this.nl('page_js_accept')
        })
        this.showCheckTip = true
        allReady = false
      }
      this.allReady = allReady
    },
    hideCheckTip() {
      this.showCheckTip = false
    },
    dialogAddToBag() {
      if (!this.allReady) {
        return false
      }
      const customSize = this.$refs.customSize
      let customData = false
      if (this.customSizeSelected) {
        customData = customSize.formCheck()
        if (!customData) {
          return false
        }
      }
      this.loading = true
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', this.baseInfo.goodsId)
      formData.set('dress_type', this.baseInfo.dressType)
      formData.set('styles[freeStyle]', false)
      formData.set('styles[size_type]', this.unit == 'inch' ? '_inch' : '_cm')
      if (this.hasColor) {
        formData.set('styles[select][color]', this.selectedColor.styleId)
      }
      if (this.baseInfo.hasSash) {
        formData.set('styles[select][sash_color]', this.selectedSashColor.styleId)
      }
      if (this.customSizeSelected) {
        formData.set('custom', 'on')
        formData.set('return_support_checkbox', 'on')
        formData.set('styles[input][bust_value_judge]', '')
        for (const i in customData) {
          formData.set('styles[input][' + i + ']', customData[i])
        }
      } else if (this.hasSize) {
        formData.set('styles[select][size]', this.selectedSize.styleId)
      }
      if (this.baseInfo.discount && this.baseInfo.dressType === 'clearance') {
        formData.set('styles[select][discount]', this.baseInfo.discount)
      }
      formData.set('goods_number', this.goodsNumber)
      const sourceTag = this.getSourceTag(this.baseInfo)
      if (sourceTag) {
        formData.set('source_tag', sourceTag)
      }
      this.addToBagAjax(formData)
    },
    addToBagAjax(formData) {
      this.$axios.$post('/1.0/cart/goods', formData).then((res) => {
        if (res.code == 0) {
          this.retentionAddToCart(
            { ...this.baseInfo, goodsNumber: this.goodsNumber, csText: this.getColorAndSizeText(formData) },
            res.data.rec_id
          )
          this.loading = false
          if (this.fromDialog == 'list') {
            this.$emit('addSuccess')
            return
          } else if (['cart', 'youmayalsolike'].includes(this.fromDialog)) {
            // 购物车推荐弹窗,重新获取购物车数据，不会重新刷新页面
            // this.$store.commit('quickshop/setBaseInfo', {})
            this.showAnimate = false
            setTimeout(() => {
              this.$store.commit('quickshop/setBaseInfo', {})
            }, 300)
            this.$emit('refreshCartList')
            return
          } else if (this.fromDialog == 'showroom') {
            window.location.href = this.countryUrl(`/cart?showroom_id=${this.showroomBaseInfo.showroomId}`)
            return
          }
          window.location.href = this.countryUrl(`/cart`)
        } else {
          alert(res.msg)
          this.loading = false
          window.location.reload()
        }
      })
    },
    /**
     * 根据不同颜色获取商品信息
     * goods_id
     * dress_type
     * color
     * size
     * style_ids
     *  */
    getProductInfo() {
      this.stylePricePending = true
      this.isExcitationLoading = false
      const sizeStyleId = this.customSizeSelected ? 0 : this.selectedSize.styleId
      const size = this.customSizeSelected ? '' : this.selectedSize.key
      const params = {
        goods_id: this.baseInfo.goodsId,
        dress_type: this.baseInfo.dressType,
        color: this.baseInfo.color,
        size,
        style_ids: this.selectedColor.styleId + ',' + sizeStyleId + ',' + this.selectedSashColor.styleId,
        sodGalleryVersion: this.$store.state.versionObj.sodGalleryVersion, // sod 强制获取图片ab版本
        fromRedeemed: this.baseInfo.fromRedeemed,
        is_custom_size: this.customSizeSelected // 如果点击了custome size，需要传true
      }
      if (this.baseInfo.dressType === 'clearance') params.discount = this.discount || -1 // 购物车使用确定的discount,其他弹框传-1
      if (this.isClearance && this.selectedColor.styleId == 0) {
        // 清仓取消颜色选择的情况调item-info 接口不传尺码
        delete params.color
        delete params.size
        delete params.style_ids
      }
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        params.hide_drive = 1 // sod 激励告诉后端是否
        // if (this.$route.name == 'list') {
        //   params.sodGalleryVersion = 'a'
        // }
      }
      // sod 预售商品加个来源，true表示是预售列表页切换颜色
      if (this.$route.name == 'landingPage-preSaleList') {
        params.from_pre_sale = true
        params.sodGalleryVersion = 'b'
      }
      if (this.baseInfo.fromRedeemed || this.fromDialog === 'redeemed') {
        params.bundleExchangeVersion = this.versionObj.cartTyingAbtest.toLowerCase()
      }
      this.$axios
        .$get(`/1.0/product/item-info`, { params })
        .then((res) => {
          if (res.code == 0) {
            // quickshop dialog中需要变更serverTime
            if (res.data.flashSaleInfo) this.$store.commit('setServerTime', res.data.flashSaleInfo.serverTime)
            const baseInfo = res.data.baseInfo
            const hasLinePrice = baseInfo.hasLinePrice
            const noDealPriceDisplay = baseInfo.noDealPriceDisplay
            const shopPriceDisplay = baseInfo.shopPriceDisplay
            const priceOffDisplay = baseInfo.priceOffDisplay
            const shopPrice = baseInfo.shopPrice
            const noDealPrice = baseInfo.noDealPrice
            const priceOff = baseInfo.priceOff
            const priceSymbol = baseInfo.priceSymbol
            const hasPriceRule = baseInfo.hasPriceRule
            const shownGoodsName = baseInfo.shownGoodsName
            const goodsUrl = baseInfo.goodsUrl
            const activityCouponCode = baseInfo.activityCouponCode
            const activityBonus = baseInfo.activityBonus
            const isMeasurementHideGoods = baseInfo.isMeasurementHideGoods
            const comingSoonInfo = baseInfo.comingSoonInfo
            const isComingSoon = baseInfo.isComingSoon
            const _baseInfo = JSON.parse(JSON.stringify(this.baseInfo))
            const imageInfo = res.data.imageInfo
            const driveInfo = baseInfo.driveInfo || {}
            const couponInfo = baseInfo.couponInfo || {}
            const activityInfo = baseInfo.activityInfo
            const warehouse = baseInfo.warehouse
            const sodPreSaleGoods = baseInfo.sodPreSaleGoods
            const hasRealStock = baseInfo.hasRealStock
            this.sodPicVersion =
              imageInfo.goodsGallery && imageInfo.goodsGallery[_baseInfo.color] && imageInfo.goodsGallery[_baseInfo.color].sodGalleyVersion
                ? imageInfo.goodsGallery[_baseInfo.color].sodGalleyVersion
                : 'a'
            this.flashSaleInfo = baseInfo.flashSaleInfo
            this.$store.commit('quickshop/setStickerInfo', res.data.stickers)
            // 弹窗关闭的瞬间， closeQuickShop 会延迟300ms置空baseInfo，所以这里做个判断，如果原有的 baseInfo 为空，就不继续set了,否则会影响quickshop弹窗的关闭，因为弹窗展示的条件是v-if="Object.keys(baseInfo).length > 0"
            if (!_baseInfo || !Object.keys(_baseInfo).length) return
            this.$store.commit('quickshop/setBaseInfo', {
              ..._baseInfo,
              hasLinePrice,
              noDealPriceDisplay,
              shopPriceDisplay,
              priceOffDisplay,
              shopPrice,
              noDealPrice,
              priceOff,
              priceSymbol,
              hasPriceRule,
              shownGoodsName,
              goodsUrl,
              activityCouponCode,
              activityBonus,
              isMeasurementHideGoods,
              comingSoonInfo,
              isComingSoon,
              driveInfo,
              couponInfo,
              activityInfo,
              warehouse,
              sodPreSaleGoods,
              hasRealStock,
              discount: baseInfo.discount || '', // 使用sku对应的discount
              offRateValue: baseInfo.offRateValue || '',
              upToSaveRateValue: baseInfo.upToSaveRateValue || '',
              hasShopPriceRange: baseInfo.hasShopPriceRange, // AZWEB-21266 更新区间价
              minShopPriceDisplay: baseInfo.minShopPriceDisplay,
              maxShopPriceDisplay: baseInfo.maxShopPriceDisplay,
              rushSelectItems: baseInfo.rushSelectItems,
              afterPayTips: baseInfo.afterPayTips
            })
            this.isExcitationLoading = true
          }
        })
        .finally(() => {
          if (this.isColorChanged && this.isSizeChanged) {
            // 等锁释放，size 如果发生变化，再去一次请求
            this.isSizeChanged = false
            this.getProductInfo()
          }
          this.isColorChanged = false

          this.$nextTick(() => {
            if (this.$refs.rightBlock && this.$refs.rightBlock.offsetHeight <= 450) this.stylePricePending = false
            this.setPoint('quickshop', 'recommend', 'view')
          })
        })
    },
    /**
     * 获取 mostPopularList youMayAlsoLikeList 数据
     * quickshop 这里没有 most popular
     */
    getSimilarPopular() {
      const params = {
        goods_id: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        dress_type: this.baseInfo.dressType,
        color: this.selectedColor ? this.selectedColor.key : '',
        size: this.selectedSize ? this.selectedSize.key : '',
        sodGalleryVersion: (this.versionObj.sodGalleryVersion || 'A').toLowerCase()
      }
      if (this.isInCatIds(this.baseInfo.catId)) {
        params.view_mode = this.plusSizeView || this.selectedSize.isPlusSize ? 'plus' : 'petite' // 大小码图
      }
      this.$axios
        .$get(`/1.0/recommend/similar-popular`, {
          params
        })
        .then((res) => {
          if (res.code == 0) {
            const similar = res.data.similar || {}
            if (similar.prodList && similar.prodList.length > 0) {
              this.youMayAlsoLikeList = similar.prodList.slice(0, 5)
              if (this.youMayAlsoLikeList && this.youMayAlsoLikeList.length) {
                const gaParams = this.getGAItemListParams(this.youMayAlsoLikeList, null, 'view', this.nl('page_cart_recommend_desc'))
                this.setGA4DataLayer(gaParams)
              }
            } else {
              this.youMayAlsoLikeList = []
            }
          }
        })
    },
    /**
     * 商品推荐点击
     */
    recommendClick(item) {
      let styleId = ''
      if (this.isSpecialCatId(item.catId) && item.goodsStyleIdInfo[item.color]) {
        styleId = item.goodsStyleIdInfo[item.color].goodsStyleId || ''
      }
      const params = {
        goods_id: item.goodsId,
        dress_type: item.dressType,
        goods_style_id: styleId,
        color: item.color,
        cat_id: item.catId
      }
      this.quickShopDialogLaoding = true
      this.setPoint('quickshop', 'recommend', 'click', { goodsId: item.goodsId, color: item.colorReal })
      this.setOrderSourceFlag('accessoryquickshoprecommend', true)
      // 初始化数据
      this.recommendClickInit()
      this.quickShopClick(params)
    },
    recommendClickInit() {
      // 重置选择的颜色和尺码还有baseInfo
      this.$store.commit('quickshop/setSelectedColor', {
        name: '',
        key: '',
        styleId: 0
      })
      this.$store.commit('quickshop/setSelectedSize', {
        name: '',
        key: '',
        styleId: 0
      })
      this.youMayAlsoLikeList = []
      this.recommendBlockShow = false
    },
    setBaseInfo() {
      const _baseInfo = JSON.parse(JSON.stringify(this.baseInfo))
      if (this.selectedColor.key != '') {
        _baseInfo.color = this.selectedColor.key
        _baseInfo.shownColor = this.selectedColor.name
        _baseInfo.colorId = this.imageInfo.colorIdMap[this.selectedColor.key]
        let images = this.imageInfo.goodsGallery[this.selectedColor.key].images
        if (_baseInfo.hasSash) {
          let key = this.selectedSashColor.key
          if (key != '') {
            _baseInfo.sashColor = this.selectedSashColor.key
            _baseInfo.shownSashColor = this.selectedSashColor.name
            _baseInfo.sashColorId = this.imageInfo.colorIdMap[this.selectedSashColor.key]
          }
          if (key == '' || !images[key]) {
            key = this.defaultSelectedSashColor.key
            if (_baseInfo.dressType == 'sample' || _baseInfo.dressType == 'clearance' || _baseInfo.dressType == 'outlet') {
              const sashColors = Object.keys(this.stockInfo.colorMap[this.baseInfo.color].allSashColor)
              key = sashColors[0]
            }
          }
          images = images[key]
        }
        _baseInfo.goodsThumb = images ? images[0].imgUrl : _baseInfo.goodsThumb
      }
      // 由于点击颜色需要切换商品名称和商品链接，如果从接口拿会比较慢，所以先由前端根据基本信息匹配，再从接口拿，以防止匹配有错的情况
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        const regex = /\{Color\}/g
        const _regex = /\{color\}/g
        let goodsStyleId = ''
        if (this.baseInfo.goodsStyleIdInfo && this.selectedColor.key && this.baseInfo.goodsStyleIdInfo[this.selectedColor.key]) {
          goodsStyleId = this.baseInfo.goodsStyleIdInfo[this.selectedColor.key].goodsStyleId
        }
        _baseInfo.shownGoodsName = this.baseInfo.goodsName.replace(regex, this.selectedColor.name)
        _baseInfo.goodsUrl =
          this.baseInfo.goodsDefaultUrl.replace(_regex, this.selectedColor.name.toLowerCase().replace(/\s+/g, '-')) + '/' + goodsStyleId
        this.$store.commit('quickshop/setBaseInfo', _baseInfo)
      } else {
        const color = this.getQueryValue(this.baseInfo.goodsUrl, 'color')
        _baseInfo.goodsUrl = _baseInfo.goodsUrl.replace(color, _baseInfo.shownColor.toLowerCase().replace(/\s+/g, '-'))
        this.$store.commit('quickshop/setBaseInfo', _baseInfo)
      }
    },
    quickShopClick(params) {
      if (params.indexNo && this.fromDialog == 'list') {
        this.$store.commit('quickshop/setIndexNo', params.indexNo)
      } // 主动注入到baseInfo中的数据，需要在quickshop中使用到
      const _selfParams = {
        fromRedeemed: params.fromRedeemed,
        cartGoodsNumber: params.cartGoodsNumber
      }
      delete params.cartGoodsNumber
      // 置空flashsaleInfo
      this.flashSaleInfo = null
      // 置空推荐
      this.youMayAlsoLikeList = []
      this.recommendBlockShow = false
      this.isFindSimilar = params.isFindSimilar
      params.sodGalleryVersion = this.versionObj.sodGalleryVersion.toLowerCase() // sod 强制获取图片ab版本
      if (this.isSpecialCatId(params.catId)) {
        // if (this.$route.name == 'list') {
        //   params.sodGalleryVersion = 'a'
        // }
        if (this.$route.name == 'landingPage-preSaleList') {
          params.sodGalleryVersion = 'b'
        }
      }
      this.sodPicVersion = params.sodGalleryVersion

      delete params.isFindSimilar
      if (params.discount) this.discount = params.discount
      // if (params.discount) {
      //   this.$store.commit('quickshop/setDiscount', params.discount)
      // } else {
      //   this.$store.commit('quickshop/setDiscount', '')
      // }
      if (this.$store.state.versionObj.productColorSort)
        params.colorSortVersion = this.$store.state.versionObj.productColorSort.toLowerCase() // 详情页颜色排序优化ab版本
      // 购物车页面quickshop显示loading
      if (['addOnItems', 'addOnItems_promotion'].includes(this.fromDialog)) {
        this.$store.commit('cart/setLoadingFlag', true)
      }

      let url = '/1.0/product/quick-shop'
      if (this.fromDialog === 'shopTheLook') {
        url = '/1.0/product/shop-look/product' // shop the look 获取quickshop数据接口
      }
      if (params.isPlusImg) {
        this.$store.commit('quickshop/setPlusSize', params.isPlusImg)
      }
      delete params.isPlusImg

      const tempParams = JSON.parse(JSON.stringify(params))
      // 购物车quickshop接口去掉字段itemInfo
      if (tempParams.itemInfo) delete tempParams.itemInfo
      this.$axios.$get(url, { params: tempParams }).then(async (res) => {
        if (this.fromDialog === 'shopTheLook') {
          this.$emit('update:quickShopLoading', false)
        }
        if (['addOnItems', 'addOnItems_promotion'].includes(this.fromDialog)) {
          this.$store.commit('cart/setLoadingFlag', false)
        }
        if (res.code == 0) {
          this.$store.commit('quickshop/setCustomSizeInfo', res.data.customSizeInfo || {})
          if (res.data.styleInfo && res.data.styleInfo.size && Object.keys(res.data.styleInfo.size).length) {
            const styleInfoSizeMap = {}
            for (const i in res.data.styleInfo.size) {
              styleInfoSizeMap[res.data.styleInfo.size[i].key] = res.data.styleInfo.size[i]
            }
            res.data.styleInfo.styleInfoSizeMap = styleInfoSizeMap
          }
          // 关闭quickshop loading
          this.quickShopDialogLaoding = false
          // 详情页quickshop弹窗出现
          if (params.fromDialog == 'product') {
            const param2 = [8, 9].includes(this.catId) ? { param2: 'A' } : {}
            this.buryPoint(this, 'event', {
              ec: 'completethelook',
              el: 'quickshop',
              ea: 'view',
              ...param2,
              msg: JSON.stringify({
                index: params.index + 1,
                goodsId: params.goods_id,
                color: params.colorReal,
                cat_id: params.catId,
                dress_type: params.dress_type,
                from_cat_id: this.$store.state.product.baseInfo.catId,
                rec_auto: params.hasRecommend ? 0 : 1 // 自动推荐还是手动推荐, hasRecommend为true表示lego手动配置推荐，打点字段rec_auto： 1表示是自动推荐，不打或者非1表示手动
              })
            })
          }

          const imageInfo = res.data.imageInfo
          const _baseInfo = JSON.parse(JSON.stringify(res.data.baseInfo))
          if (_baseInfo.catId == 3110) {
            this.getGoodsIds('quickshop')
          }
          // 更新sodPicVersion的内容
          this.sodPicVersion =
            imageInfo.goodsGallery && imageInfo.goodsGallery[_baseInfo.color] && imageInfo.goodsGallery[_baseInfo.color].sodGalleyVersion
              ? imageInfo.goodsGallery[_baseInfo.color].sodGalleyVersion
              : 'a'

          this.$store.commit('quickshop/setImageInfo', imageInfo)
          this.$store.commit('quickshop/setStyleInfo', res.data.styleInfo)
          this.$store.commit('quickshop/setMakeTimeInfo', res.data.makeTimeInfo)
          this.$store.commit('quickshop/setStickerInfo', res.data.stickers)
          this.$store.commit('quickshop/setColorFilter', res.data.colorFilter || []) // 需要过滤展示的颜色
          // comments: 单独调用库存接口获取库存stockInfo
          let stockInfo = {}
          stockInfo = res.data.stockInfo || {}
          if (res.data.baseInfo.isStockGoods || res.data.baseInfo.supportStockSales || this.isNormalStock) {
            if (![33, 1508, 138, 3101, 6, 13, 3077, 3076, 3099, 3109, 3102].includes(res.data.baseInfo.catId)) {
              const { goodsId, dressType } = res.data.baseInfo
              let payload = { dress_type: dressType }
              if (dressType === 'clearance' && tempParams.discount) {
                payload = {
                  ...payload,
                  discount: tempParams.discount
                }
              }
              const result = await this.$axios.$get('/1.0/stock/' + goodsId, {
                params: payload
              })
              if (result.code == 0) {
                stockInfo = result.data
                this.$store.commit('quickshop/setHasInitStock', true)
              }
            }
            if (
              ['sample', 'clearance', 'outlet'].includes(res.data.baseInfo.dressType) &&
              stockInfo.colorMap &&
              !stockInfo.colorMap.hasOwnProperty(res.data.baseInfo.color)
            ) {
              res.data.baseInfo.color = Object.keys(stockInfo.colorMap)[0]
              res.data.baseInfo.shownColor = res.data.styleInfo.color[res.data.baseInfo.color].name
              res.data.baseInfo.colorId = res.data.imageInfo.colorIdMap[res.data.baseInfo.color]
              if (res.data.baseInfo.hasSash) {
                const sashColor = Object.keys(stockInfo.sashColorMap)[0]
                const images = res.data.imageInfo.goodsGallery[res.data.baseInfo.color].images
                if (images[sashColor]) {
                  res.data.baseInfo.goodsThumb = images[sashColor][0].imgUrl
                }
              } else {
                res.data.baseInfo.goodsThumb = res.data.imageInfo.goodsGallery[res.data.baseInfo.color].images[0].imgUrl
              }
            }
            this.$store.commit('quickshop/setStockInfo', stockInfo)
          }
          // baseInfo 的设置需要放在 stockInfo 的后面！！！ 因为首次quickshop的弹窗显示是通过baseInfo的数据控制的
          this.$store.commit('quickshop/setBaseInfo', { ...res.data.baseInfo, ..._selfParams })

          // 1002333 这个色卡书 有默认色 但是没有颜色选项，所以要排除他，不应该有 selectedColor   quickshop弹窗样衣和rts颜色缺货不选择默认色
          if (
            res.data.baseInfo.colorId &&
            res.data.baseInfo.goodsId != 1002333 &&
            res.data.baseInfo.goodsId != 1010976 &&
            res.data.styleInfo.color
          ) {
            const color = res.data.styleInfo.color[res.data.baseInfo.color]
            if (color) {
              this.$store.commit('quickshop/setSelectedColor', color)
              this.$store.commit('quickshop/setDefaultSelectedColor', color)
            }
          }
          if (res.data.baseInfo.hasSash && res.data.baseInfo.dressType == 'dress') {
            const sashColor = res.data.styleInfo.sashColor[res.data.baseInfo.sashColor]
            this.$store.commit('quickshop/setSelectedSashColor', sashColor)
            this.$store.commit('quickshop/setDefaultSelectedSashColor', sashColor)
          }
          // 默认选中项,目前只需要取里面的size. color还是取的baseInfo的数据
          // 如果主商品有选中尺码，那么quickshop商品也默认选中对应尺码
          let selectedOptions = res.data.selectedOptions
          if ((!res.data.selectedOptions || !res.data.selectedOptions.size) && this.mainSelectedSize.key) {
            selectedOptions = {
              ...selectedOptions,
              size: this.mainSelectedSize.key
            }
          }
          this.$store.commit('quickshop/setSelectedOptions', selectedOptions || {})

          // falshSaleInfo
          this.$store.commit('setFlashSale', res.data.baseInfo.flashSaleInfo)
          this.$store.commit('quickshop/setRetireInfo', res.data.retireInfo ? res.data.retireInfo : {})
          this.initQuickShopDialogThumb()
          // showroom btn 状态恢复
          this.$store.commit('showroom/setShowroomBtnLoadingIndex', null)
          // quickshop弹窗 防尘袋获取price信息
          if (!this.hasColor && !this.hasSize) {
            this.getProductInfo()
          }
          // cartEdit 弹窗
          if (params.fromDialog == 'cartEdit') {
            this.$store.commit('cart/setLoadingFlag', false)
            // 这里给自定义尺码回显之前填写的内容 前辈这么赋值的 我只是加了点修饰
            if (params.itemInfo.formatStyles.size && params.itemInfo.formatStyles.size.CustomSize) {
              this.$store.commit('quickshop/setCustomSizeSelected', true) // 避免自定义尺码渲染调用了item-info接口，但获取的customSizeSelected 不是最新的
              const { items = [], unit = 'inch' } = params.itemInfo.formatStyles.size.CustomSize
              this.$nextTick(() => {
                this.$refs.normalStyle.$refs.customSize.confirmCheckbox = true
                this.$refs.normalStyle.unit = unit
                items.forEach((size) => {
                  this.$refs.normalStyle.$refs.customSize.customListForm[size.key] = Number(size.value)
                })
              })
            } else if (
              res.data.stockInfo &&
              res.data.stockInfo.sizeMap &&
              res.data.stockInfo.sizeMap.hasOwnProperty(params.itemInfo.formatStyles.size.standardSize.key)
            ) {
              this.$store.commit(
                'quickshop/setPlusSizeView',
                this.validateIsPlusSize(res.data.baseInfo.catId, params.itemInfo.formatStyles.size.standardSize.key)
              )
              this.$nextTick(() => {
                // 放到这里设置值是防止 swiper还没有初始化 执行滑动 slideToLoop 方法报错
                this.$store.commit('quickshop/setSelectedSize', {
                  name: params.itemInfo.formatStyles.size.standardSize.name,
                  key: params.itemInfo.formatStyles.size.standardSize.key,
                  styleId: params.itemInfo.formatStyles.size.standardSize.id * 1,
                  shownName: params.itemInfo.formatStyles.size.standardSize.shownName
                })
                this.$refs.sampleStyle && this.$refs.sampleStyle.checkSelect()
                this.$refs.stockStyle && this.$refs.stockStyle.checkSelect()
                this.$refs.normalStockStyle && this.$refs.normalStockStyle.checkSelect()
              })
            }
            if (this.baseInfo.catId == 3110 && params.itemInfo?.formatStyles?.size?.standardSize) {
              this.$nextTick(() => {
                // 放到这里设置值是防止 swiper还没有初始化 执行滑动 slideToLoop 方法报错
                this.$store.commit('quickshop/setSelectedSize', {
                  name: params.itemInfo.formatStyles.size.standardSize.name,
                  key: params.itemInfo.formatStyles.size.standardSize.key,
                  styleId: params.itemInfo.formatStyles.size.standardSize.id * 1,
                  shownName: params.itemInfo.formatStyles.size.standardSize.shownName
                })
                this.$refs.sampleStyle && this.$refs.sampleStyle.checkSelect()
                this.$refs.stockStyle && this.$refs.stockStyle.checkSelect()
                this.$refs.normalStockStyle && this.$refs.normalStockStyle.checkSelect()
              })
            }
          }
          this.giftActivityId = res.data.giftActivityId * 1 || 0
          // 购物车 gift活动 点击加购赠品 弹窗
          if (params.fromDialog == 'cartFreeGift') {
            this.$store.commit('cart/setLoadingFlag', false)
            this.setPoint('select free gift', 'quick shop pop up', 'view')
          }
          // 购物车 redeemed 换购模块点击加购 弹窗
          if (params.fromDialog == 'redeemed') {
            this.$store.commit('cart/setLoadingFlag', false)
          }
          this.getSimilarPopular()
          this.$nextTick(() => {
            // 345
            if (this.$refs.rightBlock && this.$refs.rightBlock.offsetHeight <= 450) this.recommendBlockShow = true
            this.setPoint('quickshop', 'recommend', 'view')
          })
        } else {
          this.$store.commit('cart/setLoadingFlag', false)
        }
      })
    },
    initQuickShopDialogThumb() {
      if (this.isInit === 1) {
        this.$nextTick(() => {
          if (this.$refs.swiperMain) {
            const swiperMain = this.$refs.swiperMain.swiper
            const swiperThumbs = this.$refs.swiperThumbs.swiper
            swiperMain.params.thumbs.swiper = swiperThumbs
            swiperMain.thumbs.init()
            this.swiperThumbs.update()
            this.swiperMain.update()
            this.isInit = 0
          }
        })
      }
    },
    // 关闭 quickshop 弹框
    closeQuickShop() {
      // 重置 cutomsize 选中态
      this.$store.commit('quickshop/setCustomSizeSelected', false)
      // 重置 非批量商品支持库存购买 IsNormalStock 例如：bd 库存
      this.$store.commit('quickshop/setIsNormalStock', false)
      // 重置样衣显示
      this.$store.commit('quickshop/setHasSample', false)
      // 重置选择的颜色和尺码还有baseInfo
      this.$store.commit('quickshop/setSelectedColor', {
        name: '',
        key: '',
        styleId: 0
      })
      this.$store.commit('quickshop/setSelectedSize', {
        name: '',
        key: '',
        styleId: 0
      })
      // this.$store.commit('quickshop/setBaseInfo', {})
      this.showAnimate = false
      setTimeout(() => {
        this.$store.commit('quickshop/setBaseInfo', {})
      }, 300)
      this.isInit = 1
      this.youMayAlsoLikeList = []
      this.recommendBlockShow = false
      this.$store.commit('setOpenNotifyMe', false)
    },
    addSuccess() {
      if (this.$route.name == 'product') {
        const msg = {
          goodsId: this.baseInfo.goodsId,
          color: this.selectedColor.key,
          cat_id: this.baseInfo.catId,
          cat_name: this.baseInfo.catName,
          from_cat_id: this.catId
        }
        const param2 = [8, 9].includes(this.catId) ? { param2: 'A' } : {}
        this.buryPoint(this, 'event', {
          ec: 'completeTheLook',
          el: 'success',
          ea: 'click',
          ...param2,
          msg: JSON.stringify(msg)
        })
      }
      this.successNotificationShow = true
      setTimeout(() => {
        this.successNotificationShow = false
      }, 1500)
    },
    refreshCartList(val) {
      this.$emit('refreshCartList', val)
    },
    refreshGiftActivity() {
      this.$emit('refreshGiftActivity')
    },
    setPoint(ec, el, ea, msg = {}) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.baseInfo.colorReal,
          size: this.selectedSize.key,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType,
          cat_id: this.baseInfo.catId,
          ...msg
        })
      })
    },
    // 确认按钮操作，将获取多颜色尺码传给父组件
    handleConfirm(e) {
      if (this.fromDialog === 'shopTheLook') {
        this.$emit('onConfirm', e)
        this.closeQuickShop()
      }
    },
    changCurrentImg(index) {
      this.buryPoint(this, 'event', {
        ec: 'image-quickshop',
        el: 'smallswift',
        ea: 'click',
        param2: this.sodPicVersion || 'a',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.selectedColor.key,
          index: index + 1,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
      this.swiperMain && this.swiperMain.slideToLoop(index, 800, false)
    },
    changCurrentThumbImg(index) {
      this.swiperThumbs && this.swiperThumbs.slideToLoop(index, 800, false)
    },
    initCurrentImgIntoView() {
      if (this.plusSizeView) {
        this.changCurrentImg(this.plusPosition)
        this.changCurrentThumbImg(this.plusPosition)
      } else {
        this.changCurrentImg(this.normalPosition)
        this.changCurrentThumbImg(this.normalPosition)
      }
    },
    navToGoodsDetailNew(resUrl) {
      if (!this.isSpecialCatId(this.baseInfo.catId)) return resUrl
      let sodGalleryVersion = 'a'
      // if (['list', 'search'].includes(this.$route.name)) {
      //   sodGalleryVersion = 'a'
      // }
      if (this.$route.name == 'landingPage-preSaleList') {
        sodGalleryVersion = 'b'
        if (resUrl.indexOf('?')) {
          resUrl += `&sodGalleryVersion=${sodGalleryVersion}`
        } else {
          resUrl += `?sodGalleryVersion=${sodGalleryVersion}`
        }
      }
      return resUrl
    },
    getNotifyMeParams(item) {
      if (this.fromDialog == 'list') {
        const msg = {
          goodsId: item.goodsId,
          color: item.colorReal,
          cat_name: item.catName,
          dress_type: item.dressType,
          cat_id: item.catId,
          no: this.indexNo
        }
        if (this.sortBy && this.sortBy != -1) {
          msg.sort_by = this.sortBy
        }
        return {
          common: {
            ec: 'notifyme',
            el: 'notice',
            msg: JSON.stringify(msg)
          }
        }
      }
    },
    changeDialogStatus() {
      if (this.baseInfo.catId != 3110) return false
      this.showNotifyDialog = !this.showNotifyDialog
    }
  }
}
</script>

<style lang="less" scoped>
.A {
  .goods-price {
    color: @theme-color !important;
  }
}

#quick_shop {
  position: relative;
  background: #ffffff;
  .close_btn {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .popup {
    overflow: auto;
    width: 1110px;
    padding: 30px 25px;
    box-sizing: border-box;
    max-width: 90vw;
    max-height: calc(90vw + 30px);
    overflow: auto;
    display: flex;
    .dialog_left {
      height: 610px;
      position: relative;
      overflow: hidden;
      min-width: 68px;
      &.m-t-0 {
        .carousel-vertical {
          margin-top: 0;
        }
      }

      .carousel-vertical {
        width: 68px;
        height: 510px;
        // margin-top: 34px;
        margin: 20px 0 14px;
        height: 510px;
        img.recommend-goods-pic-vertical {
          box-sizing: border-box;
          width: 68px;
          height: 96px;
          user-select: none;
          vertical-align: middle;
          &:hover {
            border: 2px solid @theme-color;
          }
        }

        .recommend-goods-li-vertical.swiper-slide-thumb-active img.recommend-goods-pic-vertical {
          border: 2px solid @theme-color;
        }
        .swiper-slide {
          margin-bottom: 6px;
          height: 96px !important;
        }
      }
    }

    .swiper-button-prev,
    .swiper-button-next {
      background-image: none;
      outline: none;
    }
    .prev-arraw-vertical,
    .next-arraw-vertical {
      position: absolute;
      display: block;
      width: 11px;
      height: 19px;
      margin-top: 0;
      transform: rotate(90deg);
      cursor: default;
      &.active {
        cursor: pointer;
      }
    }
    .prev-arraw-vertical {
      left: 27px;
      // top: 9px;
      top: -5px;
    }
    .next-arraw-vertical {
      left: 27px;
      // top: 552px;
      top: 530px;
    }

    .dialog_middle {
      margin-left: 10px;
      margin-right: 25px;
      position: relative;
      .swiper-container {
        width: 418px;
        height: 580px;
        overflow: hidden;
        text-align: center;
        pointer-events: none;
        .swiper-wrapper {
          height: 580px;
          position: relative;
          .swiper-slide {
            width: 418px;
            height: 100%;
            float: left;
            .recommend_goods_pic {
              width: 418px;
              height: 580px;
              user-select: none;
            }
            .mattel {
              position: absolute;
              right: 5px;
              bottom: 5px;
              font-size: 12px;
              line-height: 12px;
              text-transform: uppercase;
              color: #fff;
            }
          }
        }
      }
      .prev-arraw-horizontal,
      .next-arraw-horizontal {
        opacity: 0;
        transition: all 0.5s;
      }
      &:hover {
        .prev-arraw-horizontal,
        .next-arraw-horizontal {
          opacity: 1;
        }
      }
      &.sod {
        .swiper-container,
        .swiper-wrapper,
        .swiper-slide,
        .recommend_goods_pic {
          height: 610px !important;
        }
      }
    }

    .dialog_right {
      position: relative;
      width: 537px;
      min-width: 537px;
      height: fit-content;
      .prod-info-base {
        h1 {
          .font-larger();
          padding: 4px 0;
          line-height: 24px;
          .cat {
            font-weight: normal;
            font-size: @font-size-base;
            letter-spacing: 0;
            text-transform: none;
            display: block;
            font-family: @font-family-500;
          }
          .history-name {
            color: #888;
            font-size: 13px;
            font-weight: normal;
            text-transform: capitalize;
            letter-spacing: 0;
          }
        }
        .fabric {
          color: @gray;
          margin: 12px 0 0;
        }
        .tab-fabric {
          display: none;
        }
        .price {
          font-size: @font-size-larger;
          font-family: @font-family-600;
          margin-top: 3px;
          .shop_price {
            color: var(--color-999999);
            text-decoration: line-through;
          }
          .promotion_price {
            color: @theme-color;
            font-family: @font-family-600;
          }
        }
        .ready-to-off-sale {
          margin-top: 13px;
          color: @theme;
          .time-decrease {
            line-height: 16px;
            display: flex;
            align-items: center;
            color: @theme;
            padding-top: 5px;
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
                background: url('~assets/images/seo_sprite_20190129.png?5770949') no-repeat;
                background-position: -496px -28px;
              }
            }
          }
        }
        .prod-com-price {
          display: flex;
          align-items: center;
          .goods-price {
            // color: @theme-color;
            font-family: @font-family-600;
            font-size: 24px;
            color: var(--color-121212);
          }
          .goods-no-deal-price {
            color: var(--color-999999);
            text-decoration: line-through;
            font-size: 16px;
            margin-left: 5px;
            font-weight: normal;
          }
          .origin-price {
            font-size: 13px;
            color: @theme-color;
            font-family: @font-family-500;
            // text-decoration: line-through;
            margin: 0;
          }
          .price-item {
            margin: 0;
            font-size: 13px;
            text-transform: unset;
            display: flex;
            align-items: center;
          }
          /deep/.sample-price {
            font-size: 24px;
            line-height: 33px;
            font-family: @font-family-600;
            margin-left: 5px;
          }
        }
        .price-try-on-for {
          font-family: @font-family-500;
          font-size: 24px;
          color: var(--color-121212);
          .price_show {
            font-family: @font-family-600;
          }
        }
        .prod-save-price {
          color: @theme-color;
          font-size: 13px;
          font-weight: normal;
          line-height: 18px;
          margin-left: 10px;
        }
        .goods-progress {
          margin: 7px 0 8px;
          width: calc(~'100% - 17px');
        }
      }
      .prod-info-styles {
        padding: 30px 0 30px 25px;
        background: rgba(249, 249, 249, 1);
        margin-bottom: 20px;
        margin-top: 10px;
        color: var(--color-121212);
        .icon-size {
          width: 18px;
          height: 9px;
          vertical-align: inherit;
          margin: 0 2px;
        }
        .notify-me-content {
          margin-bottom: 18px !important;
          margin-top: 18px !important;
        }
        #tip_box {
          margin-bottom: -18px !important;
        }
      }
      .page_cart_recommend_view_detail {
        width: fit-content;
        max-height: 16px;
        font-size: 13px;
        font-family: @font-family-600;
        color: var(--color-121212);
        cursor: pointer;
        text-decoration: underline;
        display: block;
        margin-top: 10px;
      }
      /deep/ .size-list {
        justify-content: flex-start;
        gap: 5px;
        .size-item {
          margin: 0;
        }
      }
      /deep/ .size-label {
        margin-bottom: 5px;
      }
      /deep/ .goods-number {
        margin-bottom: 10px;
      }
      .you-may-also-like {
        // position: absolute;
        // top: 405px;
        width: 100%;
        margin-top: 25px;
        .title {
          font-size: 16px;
          font-family: @font-family-600;
        }
        .prod_list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: 10px;
          .prod_item {
            cursor: pointer;
            width: calc((100% - 40px) / 5);
            img {
              width: 100%;
              vertical-align: middle;
            }
          }
        }
      }
      // sod B 的样式重写 误删
      &.sod-b {
        .prod-info-base h1 {
          font-family: @font-family-600;
          font-size: 20px;
          padding: 0;
          letter-spacing: unset;
          line-height: unset;
          & + .price.prod-com-price {
            font-size: 20px;
          }
        }
        /deep/ .stock-style {
          margin: 10px 0;
          .style-block {
            padding: 15px;
            margin: 0;
            .size-label {
              padding-bottom: 0;
            }
          }
          .add-to-bag-block {
            margin-top: 15px;
          }
        }
        /deep/ .style-block {
          padding: 15px 15px 0;
          margin-bottom: 15px;
          box-sizing: border-box;
          .stock-tips {
            margin-top: 10px;
            padding: 0;
            .tips {
              margin-top: 0;
            }
          }
        }
        /deep/ .color-block {
          .color-label {
            margin: 0 !important;
          }
        }
        /deep/ .add-to-bag-block {
          #add-to-bag,
          #buy-now {
            margin-top: 0 !important;
          }
        }
      }
      &.showroom {
        /deep/ .style-block {
          padding: 15px;
          margin-bottom: 15px;
        }
        /deep/ .stock-tips {
          margin: 0 !important;
        }
      }
    }
    //有其他组件设置了全局样式控制影响了此组件，这里针对此组件重置
    .swiper-container {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
  .fade-enter-active {
    transition: opacity 0.5s;
  }
  .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  /deep/ .shipping_desc .inner_desc {
    width: 138px !important;
  }
  .quick-shop-dialog-loading {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.3);
    width: 100%;
    top: 0;
    height: 640px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    .loading-icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      background: url('~assets/images/loading.png') center center no-repeat;
      background-size: 100% 100%;
      animation: rotate 1s infinite;
    }
  }
}
.price-display {
  color: @theme-color;
  font-family: @font-family-600;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.support-link {
  color: @theme-color;
  font-family: @font-family-600;
}
#order_dress {
  position: relative;
  background: #ffffff;
  overflow: auto;
  & > .popup {
    width: 920px;
  }
  padding-bottom: 20px;
  img {
    vertical-align: middle;
  }
  h2 {
    padding: 40px 40px 10px;
    border: 1px solid var(--color-cccccc);
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
  }
  .tabs {
    display: flex;
    .tab {
      flex: 1;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      font-family: @font-family-600;
      background: #f6f6f6;
      color: var(--color-999999);
      text-align: center;
      text-transform: uppercase;
      &.active {
        color: var(--color-121212);
        background-color: #fff;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
  .content {
    margin-top: 20px;
    height: 545px;
    // padding: 0 40px;
    .goods-info {
      border: 1px solid var(--color-eeeeee);
      padding: 15px;
      display: flex;
      .goods-img {
        margin-right: 10px;
        position: relative;
        img {
          width: 81px;
          height: 112px;
          vertical-align: middle;
        }
        .mattel {
          position: absolute;
          right: 2px;
          bottom: 2px;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          color: #fff;
          transform-origin: right bottom;
          transform: scale(0.3);
          width: max-content;
        }
      }
      .detail {
        flex: 1;
        .goods_name {
          white-space: nowrap;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: @font-family-600;
        }
        .goods_price {
          font-family: @font-family-600;
        }
        .cat_name {
          margin: 5px 0 29px;
        }
        .goods_fabric {
          margin-bottom: 5px;
        }
      }
    }
  }
  .standard-size {
    display: flex;
    height: 545px;
    .left {
      flex: 1;
      height: 100%;
      padding-right: 15px;
      padding-left: 40px;
      overflow-y: scroll;
      .show-measurement,
      .show-measurement-bri {
        margin-top: 15px;
        margin-bottom: 15px;
        &.show {
          margin-bottom: 0;
        }
        &:hover {
          cursor: pointer;
        }
        a {
          color: @theme;
          text-decoration: underline;
        }
        span {
          display: inline-block;
          margin-left: 4px;
          &.r-right {
            width: 7px;
            height: 8px;
            background: url('~assets/images/showroom/right.png') no-repeat;
          }

          &.r-bottom {
            width: 8px;
            height: 7px;
            background: url('~assets/images/showroom/bottom.png') no-repeat;
          }
        }
      }
      .measurement {
        img {
          margin: 20px 0;
        }
        #myVideo {
          margin-top: 15px;
        }
      }
      .size-unit {
        display: flex;
        align-items: center;
        .unit {
          font-size: 13px;
          line-height: 18px;
          color: #999;
        }
        .unit-switch {
          display: flex;
          align-items: center;
          width: 32px;
          height: 12px;
          border-radius: 8px;
          background: #eee;
          margin: 0 8px;
          &.right_unit {
            justify-content: flex-end;
          }
          .switch-icon {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: @theme-color;
          }
        }
      }
      table {
        td {
          width: 70px;
          text-align: center;
          &.eu-size-map {
            white-space: nowrap;
          }
        }
        thead tr {
          height: 40px;
          background-color: #f6f6f6;
          th {
            width: 70px;
            text-align: center;
          }
        }
        tbody tr:nth-child(even) {
          background-color: #f6f6f6;
        }
        tbody tr {
          height: 34px;
          line-height: 34px;
          -moz-transition: all 0.5s ease 0s;
          -webkit-transition: all 0.5s ease 0s;
          transition: all 0.5s ease 0s;
          th {
            text-align: center;
          }
          &.pink {
            background-color: #f9d4e3;
          }
        }
      }
      div.note-size {
        margin: 15px 0 20px;
        width: 390px;
        strong {
          color: @theme;
          font-weight: normal;
        }
        a {
          color: var(--color-121212);
          text-decoration: underline;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .right {
      position: relative;
      flex: 1;
      padding-left: 15px;
      padding-right: 40px;
      height: 100%;
    }
    p.title {
      text-transform: uppercase;
      font-family: @font-family-600;
      margin-bottom: 15px;
    }
    p.size-check {
      margin-top: 15px;
      .size_check {
        color: @theme-color;
      }
      .information {
        span {
          font-family: @font-family-600;
        }
      }
    }
  }
  .custom-size {
    display: flex;
    height: 545px;
    .left {
      width: 431px;
      // flex: 1;
      height: 100%;
      padding-right: 15px;
      padding-left: 40px;
      overflow-y: auto;
      .measurement-custom,
      .measurement-custom-show {
        margin-top: 15px;
        margin-bottom: 30px;
        &:hover {
          cursor: pointer;
        }
        a {
          color: @theme;
          text-decoration: underline;
        }
        span {
          display: inline-block;
          margin-left: 4px;
          &.r-right {
            width: 7px;
            height: 8px;
            background: url('~assets/images/showroom/right.png') no-repeat;
          }

          &.r-left {
            width: 8px;
            height: 7px;
            background: url('~assets/images/showroom/left.png') no-repeat;
          }
        }
      }
      .custom-size-image {
        margin-top: 20px;
      }
      .custom-size-image-neck {
        margin-top: 25px;
      }
      .normal_measure {
        margin-bottom: 20px;
      }
    }
    .right {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-left: 15px;
      padding-right: 40px;
      text-align: center;
      h3 {
        text-transform: uppercase;
        font-family: @font-family-600, sans-serif;
        font-size: 14px;
        text-align: left;
        span {
          color: #999;
          .color-theme {
            color: @theme-color;
          }
        }
      }
      .customer-size-tape-link {
        p {
          margin: 10px 0 0;
          text-align: left;
        }
        a.custom-size-click-me {
          text-decoration: none;
          color: var(--color-121212);
          text-decoration: underline;
        }
      }
    }
  }
  // custom-scrollbar
  .custom-scrollbar() {
    &::-webkit-scrollbar {
      width: 9px;
      height: 9px;
      border-radius: 5px;
      background-color: #f1f1f1; /* or add it to the track */
    }
    /* Add a thumb */
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 5px;
    }
  }
  .custom-scrollbar();
  .standard-size,
  .custom-size {
    & > .left,
    & > .right {
      .custom-scrollbar();
    }
  }
  .add_to_bag_block {
    margin: 20px 20px;
    position: relative;
    display: flex;
    justify-content: center;
    /deep/.check-tips {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  #notify-me,
  #standard_add_to_bag,
  #custom_add_to_bag {
    display: block;
    padding: 13px 10px;
    text-transform: uppercase;
    font-size: 14px;
    line-height: 1.42857143;
    font-family: @font-family-600;
    flex: 1;
    max-width: 190px;
  }
  .close_btn {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    width: 15px;
    height: 15px;
    cursor: pointer;
    fill: var(--color-121212);
  }
}
.quick-shop-video {
  display: block;
  outline: none;
  box-sizing: border-box;
  color: #fff;
  background-color: var(--color-121212);
  position: relative;
  padding: 0;
  font-size: 10px;
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  font-family: @font-family-500, sans-serif;
  word-break: initial;
}
/deep/ .check-tips {
  top: 67px !important;
}
.up_tips {
  /deep/ .check-tips {
    top: -80px !important;
    &::before {
      left: 8px;
      top: 100%;
      border-bottom: none;
      border-top: 8px solid @theme-color;
    }
    &::after {
      left: 8px;
      top: calc(100% - 1px);
      border-bottom: none;
      border-top: 8px solid @theme-color;
    }
  }
  &.select-size {
    /deep/ .check-tips {
      top: -50px !important;
    }
  }
}
.activity-coupon-code {
  margin-left: 5px;
}
.with-code {
  color: var(--theme-color);
  font-size: 13px;
  line-height: 18px;
  margin-left: 10px;
}
/deep/ .custom-size-box {
  margin-top: 0;
  .custom_size_form {
    padding-top: 5px;
    .size_form .dress_ul li {
      margin: 10px 0;
      .label {
        .input,
        .select {
          width: 150px;
          &:focus {
            border-color: var(--color-121212);
            background-color: #fff;
          }
        }
      }
    }
    .bot-wrap {
      padding-top: 10px;
      .return_support_notice {
        padding: 10px;
        line-height: unset;
        .return_support_notice_link,
        .custom_size_faq,
        .additional_alterations,
        .return_custom_dress {
          color: var(--color-121212);
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
