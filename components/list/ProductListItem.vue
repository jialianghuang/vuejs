<template>
  <div
    v-track.viewOnce="getProductView(item)"
    :class="[
      { [`plusSizePhotoComingSoon_${item.goodsStyleId}`]: isSpecialCatId(item.catId) && sodView != 'petite' },
      { 'catpl-prod-270x370': viewSwitch == 'smaller' && sodView != 'petite_plus' },
      { 'catpl-prod-360x498': viewSwitch == 'larger' && sodView != 'petite_plus' },
      { 'catpl-prod-petite-plus-270x370': sodView == 'petite_plus' || (item.specialPlus && [2, 8].includes(catId)) },
      { 'goods-item-positon': item.position },
      { wgd: isSpecialCatId(item.catId) },
      { 'gift-card-item': $route.path.includes('/all/azazie-digital-gift-cards') },
      versionObj.listWithCodeAbtest
    ]"
    @click="goodsClick(productIndex)"
    tabindex="0"
    class="goods-item"
  >
    <template v-if="!item.position">
      <div
        v-track.viewOnce.click="
          getExcitationParams(
            'stimulatelist',
            'stimulatelist',
            item,
            getExcitationSticker(item).text,
            'listpage',
            item.driveInfo && item.driveInfo.listSticker
          )
        "
      >
        <div @mouseenter="handleQuickShop(true)" @mouseleave="handleQuickShop(false)" class="goods-item-pic">
          <ExcitationCard v-if="false && Object.keys(getExcitationSticker(item)).length" :sticker="getExcitationSticker(item)" />
          <az-sticker
            v-if="!hideBackImg && (!hasVideo || !showVideo)"
            :stickerInfo="getSticker"
            :sticker-class="`cat-product-item-icon${viewSwitch == 'larger' ? '-larger' : ''}`"
            :goodsId="item.goodsId"
            :productIndex="productIndex"
          ></az-sticker>
          <az-fav-icon
            v-if="favIconShow"
            :goodsId="item.goodsId"
            :colorId="item.colorId"
            :goodsCatId="item.catId"
            :isList="true"
          ></az-fav-icon>
          <div
            :class="{
              'goods-item-petite-plus plus-img-left': sodView == 'petite_plus' || (item.specialPlus && [2, 8].includes(catId))
            }"
            @mouseenter="setIndex(0)"
            @click="SODSizeDot('SpecialOccasions', 'SOD_BigSize_Click')"
            tabindex="0"
            class="goods-img-wrap"
          >
            <a
              :href="productDetailUrl(item, sodView == 'plus')"
              :class="{
                need_datalayer: sodView == 'petite_plus'
              }"
              :aria-label="item.shownGoodsName + ' ' + item.colorId + (item.brandId === 20 ? ' ©2024 MATTEL.' : '')"
              @click="goodsImgDot('imgClick')"
              tabindex="0"
              data-datalayer-category="PlusSizeGowns"
              data-datalayer-label="PlusSizeGowns_Regular_Click"
              target="_blank"
            >
              <template v-if="hasVideo && !is_chrome_lighthouse">
                <div ref="videoBox" v-videoplay.hoverHide="getVideoInfo(item)" :class="{ 'video-box-hide': !showVideo }" class="video-box">
                  <!-- <az-icon icon-class="icon-liebiaoyeyouvideo" class="icon-bofang"></az-icon> -->
                </div>
              </template>
              <!-- 服务端不使用 v-lazy 影响性能 现在服务端渲染15个商品，其他45个商品客户端渲染-->
              <img
                v-if="productIndex > 15"
                v-lazy="addWebpSuffixProps((sodView == 'plus' && item.plusSize && item.plusSize.imgUrl) || item.imgUrl)"
                :class="{ show: !iconPetiePlusShow || iconPetiePlusIndex != 0 }"
                :alt="getImgAlt(item, 1, 'front')"
                class="goods-img"
                style="color: #f6f6f6"
              />
              <!-- 前面15个商品不需要使用懒加载(加快加载速度) -->
              <img
                v-else
                :src="addWebpSuffixProps((sodView == 'plus' && item.plusSize && item.plusSize.imgUrl) || item.imgUrl)"
                :class="{ show: !iconPetiePlusShow || iconPetiePlusIndex != 0 }"
                :alt="getImgAlt(item, 1, 'front')"
                class="goods-img"
                style="color: #f6f6f6"
              />
              <!-- 商品背景图客户端渲染 -->
              <client-only>
                <template v-if="iconPetiePlusShow && iconPetiePlusIndex == 0">
                  <img
                    v-if="productIndex > 15"
                    :class="{ show: iconPetiePlusShow && iconPetiePlusIndex == 0 }"
                    v-lazy="addWebpSuffixProps((sodView == 'plus' && item.plusSize && item.plusSize.backImgUrl) || item.backImgUrl)"
                    :alt="getImgAlt(item, 2, 'back')"
                    class="goods-img sample-thumb"
                    style="color: #f6f6f6"
                  />
                  <!-- 前面15个商品不需要使用懒加载(加快加载速度) -->
                  <img
                    v-else
                    :class="{ show: iconPetiePlusShow && iconPetiePlusIndex == 0 }"
                    :src="addWebpSuffixProps((sodView == 'plus' && item.plusSize && item.plusSize.backImgUrl) || item.backImgUrl)"
                    :alt="getImgAlt(item, 2, 'back')"
                    class="goods-img sample-thumb"
                    style="color: #f6f6f6"
                  />
                </template>
              </client-only>
              <span v-if="item.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
            </a>
            <div
              v-if="sodView == 'petite_plus'"
              @mouseenter="handleIconPetiePlus(true, 0)"
              @mouseleave="handleIconPetiePlus(false, 0)"
              @click="changeSodView('petite')"
              :class="{ show: iconPetiePlusShow && iconPetiePlusIndex == 0 }"
              role="button"
              tabindex="0"
              data-datalayer-category="Dress"
              data-datalayer-label="Dress_ViewStandardSizeModels_Click"
              class="bubble sod-bubble need_datalayer"
            >
              <img
                :src="require(`~/assets/images/goodsList/icon-petite${iconPetiePlusHover && iconPetiePlusIndex == 0 ? '-hover' : ''}.png`)"
                alt="img"
              />
            </div>
          </div>
          <div
            v-if="sodView == 'petite_plus' || (item.specialPlus && [2, 8].includes(catId))"
            :class="{
              'goods-item-petite-plus plus-img-right need_datalayer':
                sodView == 'petite_plus' || (item.specialPlus && [2, 8].includes(catId))
            }"
            @mouseenter="setIndex(1)"
            @mouseout="moveInBig = false"
            @click="SODSizeDot('SpecialOccasions', 'SOD_BigSize_Click')"
            tabindex="0"
            class="goods-img-wrap"
          >
            <a
              :href="productDetailUrl(item, item.plusSize)"
              :class="{
                need_datalayer: sodView == 'petite_plus'
              }"
              :aria-label="item.shownGoodsName + ' right img' + (item.brandId === 20 ? ' ©2024 MATTEL.' : '')"
              data-datalayer-category="PlusSizeGowns"
              data-datalayer-label="PlusSizeGowns_Plus_Click"
              target="_blank"
            >
              <img
                v-if="productIndex > 15"
                v-lazy="addWebpSuffixProps((item.plusSize && item.plusSize.imgUrl) || item.imgUrl)"
                :class="[
                  { show: !iconPetiePlusShow || iconPetiePlusIndex != 1 },
                  { 'shadow-blur': !(item.plusSize && item.plusSize.isPlus) }
                ]"
                :alt="getImgAlt(item, 1, 'front')"
                class="goods-img"
                style="color: #f6f6f6"
              />
              <!-- 前面15个商品不需要使用懒加载(加快加载速度) -->
              <img
                v-else
                :src="addWebpSuffixProps((item.plusSize && item.plusSize.imgUrl) || item.imgUrl)"
                :class="[
                  { show: !iconPetiePlusShow || iconPetiePlusIndex != 1 },
                  { 'shadow-blur': !(item.plusSize && item.plusSize.isPlus) }
                ]"
                :alt="getImgAlt(item, 1, 'front')"
                class="goods-img"
                style="color: #f6f6f6"
              />
              <!-- 商品背景图客户端渲染 -->
              <client-only>
                <template v-if="(iconPetiePlusShow || moveInBig) && iconPetiePlusIndex == 1">
                  <img
                    v-if="productIndex > 15"
                    :class="[
                      { show: (iconPetiePlusShow || moveInBig) && iconPetiePlusIndex == 1 },
                      { 'shadow-blur': !(item.plusSize && item.plusSize.isPlus) }
                    ]"
                    v-lazy="addWebpSuffixProps((item.plusSize && item.plusSize.backImgUrl) || item.backImgUrl)"
                    :alt="getImgAlt(item, 2, 'back')"
                    class="goods-img sample-thumb"
                    style="color: #f6f6f6"
                  />
                  <!-- 前面8个商品不需要使用懒加载(加快加载速度) -->
                  <img
                    v-else
                    :class="[
                      { show: (iconPetiePlusShow || moveInBig) && iconPetiePlusIndex == 1 },
                      { 'shadow-blur': !(item.plusSize && item.plusSize.isPlus) }
                    ]"
                    :src="addWebpSuffixProps((item.plusSize && item.plusSize.backImgUrl) || item.backImgUrl)"
                    :alt="getImgAlt(item, 2, 'back')"
                    class="goods-img sample-thumb"
                    style="color: #f6f6f6"
                  />
                </template>
              </client-only>
              <span v-if="item.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
            </a>
            <div
              v-if="!(item.plusSize && item.plusSize.isPlus)"
              :class="'tip-soon-' + language"
              :style="{ background: 'url(' + nl('page_image_m_product_cart_tip_soon') + ')  50%/212px auto no-repeat' }"
              class="tip-soon"
            ></div>
            <div
              v-if="[2, 8].includes(catId) && item.plusSize && iconPetiePlusShow && iconPetiePlusIndex == 1"
              class="shop-more-plus need_datalayer"
              data-datalayer-category="PlusSizeGowns"
              data-datalayer-label="PlusSizeGowns_ShopTheLook_ShopMoreInPlus_Click"
            >
              <p @click="toPlusPath" class="shop-more-plus-text" role="button" tabindex="0">{{ nl('page_product_list_item_text1') }}</p>
            </div>
            <div
              v-if="sodView == 'petite_plus'"
              @mouseenter="handleIconPetiePlus(true, 1)"
              @mouseleave="handleIconPetiePlus(false, 1)"
              @click="changeSodView('plus')"
              :class="{ show: iconPetiePlusShow && iconPetiePlusIndex == 1 }"
              role="button"
              tabindex="0"
              data-datalayer-category="Dress"
              data-datalayer-label="Dress_ViewPlusSizeModels_Click"
              class="bubble sod-bubble need_datalayer"
            >
              <img
                :src="require(`~/assets/images/goodsList/icon-plus${iconPetiePlusHover && iconPetiePlusIndex == 1 ? '-hover' : ''}.png`)"
                alt="img"
              />
            </div>
          </div>
          <div v-if="showAvailableCurve" :class="['plus-size-available', { 'plus-size-available-wgd': isSpecialCatId(catId) }]">
            <p>{{ nl('page_common_plus_size_available') }}</p>
          </div>
          <template v-if="beBackSoonGoods">
            <a
              v-track.view.click="getBiNotifyMeParam(item)"
              :href="productDetailUrl(item, item.plusSize)"
              class="goods-be-back-soon-btn"
              target="_blank"
            >
              <p @click.prevent="backSoonBtn(item)" role="button" tabindex="0" class="btn-text">{{ nl('page_notify_me') }}</p>
            </a>
          </template>
          <template v-else-if="$route.name !== 'search' && !item.isComingSoon">
            <div
              v-if="[1508, 3102, 3].includes(item.catId) || (item.isAccessory && item.catName != 'bridal-accessories') || showQuickShopBtn"
              :class="{ show: quickShopBtnShow }"
              @click="showQuickShopDialog"
              role="button"
              tabindex="0"
              class="quick-shop"
            >
              <p class="quick-shop-text">
                {{
                  [33, 36].includes(item.catId) && $route.name == 'list'
                    ? nl('page_common_quick_shop_swatch')
                    : nl('page_showroom_quick_shop')
                }}
              </p>
            </div>
          </template>
        </div>
        <!-- 商品信息内容 -->
        <!-- sod goods information part -->
        <template
          v-if="
            isSpecialCatId(item.catId) &&
              $route.name != 'search' &&
              !['holidayBride', 'finalSaleList', 'eventshopList'].includes(scene) &&
              !$route.path.includes('/collection/all')
          "
        >
          <div :class="{ wgd: isSpecialCatId(item.catId) }">
            <!-- 颜色 --- 评论 -->
            <div class="goods-color-rate">
              <div
                v-if="showColorBox"
                :class="{ 'show-plus-size-available': (sodView == 'plus' || apiViewMode[0] == 'plus') && !item.isPlusImg }"
                class="goods-colors"
              >
                <!-- ready-to-ship不显示 -->
                <span
                  v-if="!['clearance', 'outlet'].includes(item.dressType) && item.colorSwitch"
                  :class="'cat-' + item.catId"
                  class="cat-switch-color"
                >
                  <a
                    v-track.viewOnce.click="getColorBiParams(colorItem, index)"
                    v-for="(colorItem, index) in item.colorSwitch"
                    :key="index"
                    :class="[colorItem.color, { selected: colorItem.colorId == item.colorId }]"
                    :style="getColorStyle(colorItem.color, null, null, null, colorItem)"
                    :aria-label="colorItem.shownGoodsName + ' ' + colorItem.color"
                    @click="colorSwitchClick(colorItem, 'click')"
                    role="button"
                    tabindex="0"
                  >
                    <span class="inner-color-box"
                      ><i style="display: none;">{{ colorItem.shownGoodsName }}</i>
                      <az-icon v-if="colorItem.showExpeditedShippingTime" icon-class="icon-a-7day" class="icon-stock"></az-icon>
                    </span>
                  </a>
                </span>
                <a
                  v-if="item.colorNumber"
                  :href="productDetailUrl(item, sodView == 'plus')"
                  :data-goods-id="item.goodsId"
                  :data-cat-id="item.catId"
                  @click="goodsImgDot('titleClick')"
                  :aria-label="showGoodsNumberText(item.colorNumber) || 'color number'"
                  role="button"
                  tabindex="0"
                  class="more"
                  target="_blank"
                >
                  {{ showGoodsNumberText(item.colorNumber) }}
                </a>
              </div>
              <!-- 评论 -->
              <div v-if="item.reviewInfo && item.reviewInfo.rating > 0" class="goods-rate">
                <a
                  :href="productDetailUrl(item, sodView == 'plus')"
                  :aria-label="item.shownGoodsName + ' ' + item.colorId + ' rate (' + item.reviewInfo.totalCount + ')'"
                  target="_blank"
                >
                  <az-rate :value="item.reviewInfo.rating * 1" :readonly="true" :showScore="false" space="0"></az-rate>
                  <span class="show_review">({{ item.reviewInfo.totalCount }})</span>
                </a>
              </div>
            </div>
            <div class="goods-name-price">
              <!-- 商品名 -->
              <div :class="country" @click="goodsImgDot('titleClick')" tabindex="0" class="goods-name">
                <a :href="productDetailUrl(item, sodView == 'plus')" :aria-label="goodsNameAriaLabel" target="_blank">
                  <az-icon
                    v-if="item.isFreeShipping && !isSpecialCatId(item.catId)"
                    :icon-class="'icon-xxy_free_shipping_cart-' + language"
                    class="icon-free-ship-cart"
                  />
                  <span v-if="item.isNew" class="icon-new">{{ nl('page_common_new_capital') }}!</span>
                  <template v-if="item.brandId === 20">
                    <template v-if="item.dressType === 'sample'"> {{ item.shownGoodsName }} </template>
                    <template v-else> Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE </template>
                  </template>
                  <template v-else>
                    {{ item.goodsTitle ? item.goodsTitle : item.shownGoodsName }}
                  </template>
                </a>
                <az-label-sticker :stickers="getSticker" margin="-2px 2px 0px"></az-label-sticker>
              </div>
              <a
                v-if="item.goodsSubTitle"
                :href="productDetailUrl(item, sodView == 'plus')"
                :aria-label="item.goodsSubTitle + ' ' + productIndex"
                target="_blank"
              >
                <p class="goods-sub-name">{{ item.goodsSubTitle }}</p>
              </a>
              <!-- 商品金额相关信息 -->
              <div :class="{ display_inline: !item.reviewInfo || item.reviewInfo.rating <= 0 }" class="price-and-timer">
                <div>
                  <template v-if="item.isGiftCard">
                    <!-- gift card的价格用多语言code写死 -->
                    <div class="goods-price">{{ nl('page_common_gift_card_price') }}</div>
                  </template>
                  <div v-else-if="item.hasShopPriceRange || item.hasLinePrice" class="goods-price goods-price-box">
                    <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
                    <!-- AZWEB-21266 未选中sku时展示价格区间 -->
                    <p v-if="item.hasShopPriceRange" class="current-price">
                      {{ item.minShopPriceDisplay }} - {{ item.maxShopPriceDisplay }}
                    </p>
                    <p v-else class="current-price">{{ item.shopPriceDisplay }}</p>
                  </div>
                  <div v-else class="goods-price">{{ item.shopPriceDisplay }}</div>
                </div>
              </div>
            </div>
            <PreOrderOnly v-if="showSodSaleSticker(item)" :type="item.preSaleSticker" />
            <div
              v-else-if="!sodPreSaleGoods"
              :class="{
                'flex-between':
                  cyberSaleInfo && item.catId != 3108 && (['clearance', 'outlet'].includes(item.dressType) || item.isFinalSale)
              }"
              class="goods-limit-time-container"
            >
              <template v-if="cyberSaleInfo && item.catId != 3108 && !item.activityCouponCode">
                <p v-if="['clearance', 'outlet'].includes(item.dressType) || item.isFinalSale" class="final_sale">
                  {{ nl('page_clearance_final_sale') }}
                </p>
                <cyber-sale :itemCatId="item.catId"></cyber-sale>
              </template>
              <template v-else>
                <!-- code and finalsale or limited Time -->
                <div v-if="item.hasShopPriceRange || item.hasLinePrice" :class="['with-code-and-finalsale', { isBetween: hasText }]">
                  <template v-if="hasText">
                    <p v-if="item.isFinalSale" class="final_sale">
                      {{ nl('page_clearance_final_sale') }}
                    </p>
                    <p v-if="isShowLimitedTimeTag" class="final_sale">
                      {{ nl('page_limited_time_tag') }}
                    </p>
                  </template>
                  <AzWithCoupon
                    :value="item.hasShopPriceRange ? item.upToSaveRateValue : item.offRateValue"
                    :show-text="!!item.activityCouponCode"
                    :hasShopPriceRange="item.hasShopPriceRange"
                    :baseInfo="item"
                  />
                </div>
                <p v-else-if="item.dressType == 'clearance' || item.dressType == 'outlet' || item.isFinalSale" class="final_sale">
                  {{ nl('page_clearance_final_sale') }}
                </p>

                <az-discount v-if="item.activityResume && !item.activityCouponCode" :code="item.activityResume"></az-discount>

                <!-- flash sale -->
                <az-count-down
                  v-if="isShowFlashSaleTag"
                  :startTime="item.flashSaleInfo && item.flashSaleInfo.startTime"
                  :endTime="item.flashSaleInfo && item.flashSaleInfo.endTime"
                  :isGoodsItem="true"
                ></az-count-down>
              </template>
            </div>
            <a v-if="showTryNow" :href="productDetailUrl(item, sodView == 'plus')" class="try-class" target="_blank">
              {{ nl('page_common_try_now') }}
            </a>
            <!-- come soon -->
            <come-soon
              v-if="
                ((item.isComingSoon && !sodPreSaleGoods) || item.isMeasurementHideGoods) &&
                  !(sodPreSaleGoods && item.isMeasurementHideGoods)
              "
              :soonCatId="item.catId"
              :goodsId="item.goodsId"
            ></come-soon>
          </div>
        </template>
        <template v-else>
          <div
            v-if="showColorBox"
            :class="{ 'show-plus-size-available': (sodView == 'plus' || apiViewMode[0] == 'plus') && !item.isPlusImg }"
            class="goods-colors"
          >
            <!-- ready-to-ship不显示 -->
            <span
              v-if="!['clearance', 'outlet'].includes(item.dressType) && item.colorSwitch"
              :class="'cat-' + item.catId"
              class="cat-switch-color"
            >
              <a
                v-track.viewOnce.click="getColorBiParams(colorItem, index)"
                v-for="(colorItem, index) in item.colorSwitch"
                :key="index"
                :class="[colorItem.color, { selected: colorItem.colorId == item.colorId }]"
                :style="getColorStyle(colorItem.color, null, null, null, colorItem)"
                :aria-label="colorItem.shownGoodsName + ' ' + colorItem.color"
                @click="colorSwitchClick(colorItem, 'click')"
                role="button"
                tabindex="0"
              >
                <span
                  ><i style="display: none;">{{ colorItem.shownGoodsName }}</i>
                  <az-icon v-if="colorItem.showExpeditedShippingTime" icon-class="icon-a-7day" class="icon-stock"></az-icon>
                </span>
              </a>
            </span>
            <a
              v-if="item.colorNumber"
              :href="productDetailUrl(item, sodView == 'plus')"
              :data-goods-id="item.goodsId"
              :data-cat-id="item.catId"
              @click="goodsImgDot('titleClick')"
              :aria-label="showGoodsNumberText(item.colorNumber) || 'color number'"
              role="button"
              tabindex="0"
              class="more"
              target="_blank"
            >
              {{ showGoodsNumberText(item.colorNumber) }}
            </a>
          </div>
          <div @click="goodsImgDot('titleClick')" tabindex="0" class="goods-name">
            <a :href="productDetailUrl(item, sodView == 'plus')" :aria-label="goodsNameAriaLabel" target="_blank">
              <az-icon
                v-if="item.isFreeShipping && !isSpecialCatId(item.catId)"
                :icon-class="'icon-xxy_free_shipping_cart-' + language"
                class="icon-free-ship-cart"
              />
              <span v-if="item.isNew" class="icon-new">{{ nl('page_common_new_capital') }}!</span>
              <template v-if="item.brandId === 20">
                <template v-if="item.dressType === 'sample'"> {{ item.shownGoodsName }} </template>
                <template v-else> Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE </template>
              </template>
              <template v-else>
                {{ item.goodsTitle ? item.goodsTitle : item.shownGoodsName }}
              </template>
              <az-label-sticker :stickers="getSticker" margin="-2px 2px 0px"></az-label-sticker>
            </a>
          </div>
          <a
            v-if="item.goodsSubTitle"
            :href="productDetailUrl(item, sodView == 'plus')"
            :aria-label="item.goodsSubTitle + ' ' + productIndex"
            target="_blank"
          >
            <p class="goods-sub-name">{{ item.goodsSubTitle }}</p>
          </a>
          <!-- jira:16469 要求礼品卡隐藏颜色名称 -->
          <div v-if="item.catId === 3108" class="goods-color">{{ item.shownColor }}</div>
          <!-- 商品金额相关信息 -->
          <div :class="{ display_inline: !item.reviewInfo || item.reviewInfo.rating <= 0 }" class="price-and-timer">
            <template v-if="item.isGiftCard">
              <!-- gift card的价格用多语言code写死 -->
              <div class="goods-price">{{ nl('page_common_gift_card_price') }}</div>
            </template>
            <!-- AZWEB-18887 样衣3件20活动 tryonSaveLimit-->
            <template v-else-if="item.tryonSaveLimit">
              <div class="goods-price">
                <p class="origin-price">{{ item.shopPriceDisplay }}</p>
                <span
                  v-html="nl('page_common_try_on_number_for_wd_' + country.toLowerCase(), null, { number: item.tryonSaveLimit })"
                  v-if="item.catId == 2"
                >
                </span>
                <span
                  v-else
                  v-html="nl('page_common_try_on_number_for_' + country.toLowerCase(), null, { number: item.tryonSaveLimit || 3 })"
                >
                </span>
              </div>
            </template>
            <template v-else-if="item.dressType == 'sample' && (isBridal || item.catId == 2)">
              <!-- <template v-else-if="item.dressType == 'sample' && isBridal"> -->
              <div class="goods-price">
                <p class="origin-price">{{ item.originalPriceInfo && item.originalPriceInfo.noDealPriceDisplay }}</p>
                <span>| {{ nl('page_common_try_on_for') }}</span>
                <p class="no-deal-price sample-price">{{ item.shopPriceDisplay }}</p>
              </div>
            </template>
            <div v-else-if="item.hasShopPriceRange || item.hasLinePrice" class="goods-price goods-price-box">
              <!-- AZWEB-21266 未选中sku时展示价格区间 -->
              <p v-if="item.hasShopPriceRange" class="current-price">{{ item.minShopPriceDisplay }} - {{ item.maxShopPriceDisplay }}</p>
              <p v-else class="current-price">{{ item.shopPriceDisplay }}</p>
              <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
            </div>
            <div v-else class="goods-price">{{ item.shopPriceDisplay }}</div>
            <template v-if="cyberSaleInfo && item.catId != 3108 && !item.activityCouponCode">
              <p v-if="['clearance', 'outlet'].includes(item.dressType) || item.isFinalSale" class="final_sale">
                {{ nl('page_clearance_final_sale') }}
              </p>
              <cyber-sale :itemCatId="item.catId"></cyber-sale>
            </template>
            <template v-else>
              <AzWithCoupon
                v-if="item.hasShopPriceRange ? item.upToSaveRateValue : item.offRateValue"
                :value="item.hasShopPriceRange ? item.upToSaveRateValue : item.offRateValue"
                :show-text="!!item.activityCouponCode"
                :hasShopPriceRange="item.hasShopPriceRange"
                :baseInfo="item"
              />
              <p v-if="['clearance', 'outlet'].includes(item.dressType) || item.isFinalSale" class="final_sale">
                {{ nl('page_clearance_final_sale') }}
              </p>
              <p v-else-if="isShowLimitedTimeTag" class="final_sale">
                {{ nl('page_limited_time_tag') }}
              </p>

              <az-discount v-if="item.activityResume && !item.activityCouponCode" :code="item.activityResume"></az-discount>

              <!-- flash sale -->
              <az-count-down
                v-if="isShowFlashSaleTag"
                :startTime="item.flashSaleInfo && item.flashSaleInfo.startTime"
                :endTime="item.flashSaleInfo && item.flashSaleInfo.endTime"
                :isGoodsItem="true"
              ></az-count-down>
            </template>
          </div>
          <!-- 评论 -->
          <div v-if="item.reviewInfo && item.reviewInfo.rating > 0" class="goods-rate">
            <a
              :href="productDetailUrl(item, sodView == 'plus')"
              :aria-label="item.shownGoodsName + ' ' + item.colorId + ' rate (' + item.reviewInfo.totalCount + ')'"
              target="_blank"
            >
              <az-rate :value="item.reviewInfo.rating * 1" :readonly="true" :showScore="false" space="0"></az-rate>
              <span class="show_review">({{ item.reviewInfo.totalCount }})</span>
            </a>
          </div>
          <a :href="productDetailUrl(item, sodView == 'plus')" v-if="showTryNow" class="try-class" target="_blank">
            {{ nl('page_common_try_now') }}
          </a>
          <!-- come soon -->
          <come-soon
            v-if="
              ((item.isComingSoon && !sodPreSaleGoods) || item.isMeasurementHideGoods) && !(sodPreSaleGoods && item.isMeasurementHideGoods)
            "
            :catId="item.catId"
            :goodsId="item.goodsId"
          ></come-soon>
        </template>
      </div>
    </template>
    <!-- 广告位 -->
    <template v-else>
      <!--  db推广 -->
      <div v-if="dbLandingPage && productIndex <= 4 && catId == 2" @click="handleShowShoppingForDialog" class="goods-item-pic">
        <div :class="{ 'goods-img-petite-plus-positon': sodView == 'petite_plus' }" class="goods-img-wrap goods-img-wrap-positon">
          <img :src="addWebpSuffix(dbBannerUrl)" alt="azazie" class="goods-img-positon" />
        </div>
      </div>
      <div v-else v-track.view.click="{ common: getBiParams() }" class="goods-item-pic">
        <div :class="{ 'goods-img-petite-plus-positon': sodView == 'petite_plus' }" class="goods-img-wrap goods-img-wrap-positon">
          <a :href="countryUrl(`${item.linkUrl}`)" v-if="dressType == 'sample'">
            <img
              v-if="productIndex < 15"
              :src="addWebpSuffix(item.imgUrl)"
              :alt="item.goodsName || 'position img'"
              class="goods-img-positon"
            />
            <img v-else v-lazy="addWebpSuffixProps(item.imgUrl)" :alt="item.goodsName || 'position img'" class="goods-img-positon" />
            <a
              :href="getSupportUrl('/sections/200806445-Sample-Program', '/articles/8076722')"
              :class="{ 'is-bridal': isBridal }"
              class="sample-faq-link"
              target="_blank"
            >
              {{ nl('page_product_list_item_text3') }}
            </a>
          </a>
          <a
            v-else
            :href="countryUrl(`${item.linkUrl}`)"
            :class="{ need_datalayer: item.goodsId == 78789 }"
            :data-datalayer-category="item.eventCategory"
            :data-datalayer-label="item.eventName"
            :aria-label="'position img' + productIndex"
            target="_blank"
          >
            <img
              v-if="productIndex < 15"
              :src="scene === 'holidayBride' ? nl(item.imgUrl) : addWebpSuffix(item.imgUrl)"
              :alt="item.goodsName || 'position img'"
              class="goods-img-positon"
            />
            <img v-else v-lazy="addWebpSuffixProps(item.imgUrl)" :alt="item.goodsName || 'position img'" class="goods-img-positon" />
          </a>
          <ImageHotSpot :positions="item.positions" :ec="`fixbanner_${productIndex}`" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import AzFavIcon from '@/components/az-ui/AzFavIcon'
import AzRate from '@/components/az-ui/Rate/AzRate'
import AzCountDown from '@/components/az-ui/AzCountDown'
import AzWithCoupon from '@/components/az-ui/AZWithCoupon'
import AzDiscount from '@/components/az-ui/AzDiscount'
import ComeSoon from '@/components/list/ComeSoon'
import PreOrderOnly from '@/components/pre-sale/PreOrderOnly'
import ExcitationCard from '@/components/common/excitation/ExcitationCard'
import CyberSale from '@/components/list/CyberSale'
import AzLabelSticker from '@/components/az-ui-new/AzLabelSticker'
import colorHex from '@/assets/js/colorHex'
import { mapState } from 'vuex'
import { getUrlQueryNoPage, setUrlParam } from '@/assets/js/utils.js'
import bannerMixins from '@/assets/js/bannerMixins'
import { countryList } from '@/assets/js/euSizeMap'

export default {
  name: 'ProductListItem',
  languageKeys: [
    'page_image_m_product_cart_tip_soon',
    'page_product_list_item_text1',
    'page_product_list_item_text2',
    'page_product_list_item_text3',
    'page_showroom_quick_shop',
    'page_common_gift_card_price',
    'page_clearance_final_sale',
    'page_common_try_now',
    'page_common_gift_card_price',
    'page_common_try_on_for',
    ...countryList.map((v, i) => 'page_common_try_on_number_for_wd_' + v),
    ...countryList.map((v, i) => 'page_common_try_on_number_for_' + v),
    'page_common_quick_shop_swatch',
    'page_common_plus_size_available',
    'page_limited_time_tag',
    ...AzSticker.languageKeys,
    ...AzFavIcon.languageKeys,
    ...AzRate.languageKeys,
    ...ComeSoon.languageKeys,
    ...PreOrderOnly.languageKeys,
    ...ExcitationCard.languageKeys,
    ...CyberSale.languageKeys,
    ...AzWithCoupon.languageKeys,
    ...AzLabelSticker.languageKeys
  ],
  components: {
    AzSticker,
    AzFavIcon,
    AzRate,
    AzCountDown,
    ComeSoon,
    AzDiscount,
    PreOrderOnly,
    ExcitationCard,
    CyberSale,
    AzWithCoupon,
    AzLabelSticker
  },
  mixins: [colorHex, bannerMixins],
  props: {
    showLimitedTimeTag: {
      type: Boolean,
      default() {
        return false
      }
    },
    item: {
      type: Object,
      default() {
        return () => {}
      }
    },
    productIndex: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    addSuffix: {
      type: Boolean,
      default: false
    },
    // 是否展示收藏图标
    showFav: {
      type: Boolean,
      default: true
    },
    // 组件出现的场景
    scene: {
      type: String,
      default: ''
    },
    // 是否隐藏商品背景图
    hideBackImg: {
      type: Boolean,
      default: false
    },
    // 是否显示quickshop button
    showQuickShopBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      module: null,
      addModule: false,
      imgUrl: '',
      quickShopBtnShow: false,
      iconPetiePlusShow: false, // 显示后背图
      iconPetiePlusHover: false,
      iconPetiePlusIndex: 0, // 当前hover的图片
      hasVideo: false, // 是否包含视频地址，如果有，加入video元素
      showVideo: false, // 是否展示视频
      initColor: '', // 商品初始颜色id
      moveInBig: false // 鼠标移入大图，只有有视频，并且鼠标移入的情况下，才为true
    }
  },
  computed: {
    ...mapState({
      viewSwitch: (state) => state.list.viewSwitch,
      sodView: (state) => state.list.sodView,
      apiViewMode: (state) => state.list.apiViewMode,
      prodList: (state) => state.list.prodList,
      sortBy: (state) => state.list.sortBy,
      filters: (state) => state.list.filters,
      filterSize: (state) => state.list.filterSize,
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    colorChanged() {
      return this.imgUrl
    },
    favIconShow() {
      if (!this.showFav) return false
      // sod 预售展示收藏
      if (this.sodPreSaleGoods) {
        return true
      }
      if (this.item.catId == 1504) {
        // 口罩
        return false
      }
      if (this.country == 'MX' && this.item.mxBdBatch) {
        return false
      }
      return !['clearance', 'outlet', 'sample'].includes(this.item.dressType) && !this.item.isComingSoon && !this.item.isFinalSale
    },
    beBackSoonGoods({ item }) {
      if (item.isMeasurementHideGoods && this.isSpecialCatId(item.catId)) return false
      // rts finalSale 不展示notfiyme
      if (item.isFinalSale || item.dressType == 'clearance') return false
      const { stickers = [] } = item
      return stickers.some((sticker) => sticker.name == 'beBackSoon')
    },
    goodsNameAriaLabel() {
      const goodsName = this.item.goodsTitle ? this.item.goodsTitle : this.item.shownGoodsName
      let res = this.item.isNew ? this.nl('page_common_new_capital') + '! ' + goodsName : goodsName
      res = res + ' ' + this.productIndex
      return res
    },
    dbBannerUrl() {
      return 'https://cdn-1.azazie.com/upimg/userfiles/images/1/8f/9b/aacd80c4b5f2fd625e5b0aadc0318f9b.jpg'
    },
    getSticker({ item }) {
      // sod 排队中的商品 列表页不展示bebacksoon
      if (this.isSpecialCatId(item.catId) && item.isMeasurementHideGoods) {
        return item.stickers.filter((sticker) => sticker.name != 'beBackSoon')
      }
      return item.stickers
    },
    showColorBox({ item }) {
      // sod 预售商品展示颜色
      // sod comingsoon必须展示颜色
      if (item.sodPreSaleGoods || item.isMeasurementHideGoods) {
        return true
      } else {
        // 原业务逻辑
        return !item.isComingSoon && !item.isGiftCard
      }
    },
    sodPreSaleGoods({ item }) {
      return this.isSpecialCatId(item.catId) && item.sodPreSaleGoods
    },
    showTryNow({ item, isBridal }) {
      // return item.dressType == 'sample' && !isBridal
      // AZWEB-18887 样衣3件20活动
      // BD MOB WD 全站下掉 try now, bridal 品牌本来就全站不展示
      if (item.dressType == 'sample') {
        if ([2, 7, 8, 9, 45, 158].includes(item.catId) || isBridal) {
          return false
        }
        return true
      }
      return false
    },
    // Available In Curve 文案
    showAvailableCurve({ sodView, item, apiViewMode }) {
      // return (sodView == 'plus' || apiViewMode[0] == 'plus') && !item.isPlusImg
      // 临时调整，不显示
      return false
    },
    hasText({ item }) {
      return item.isFinalSale || (item.activityInfo && item.activityInfo.labelName == 'time_limited')
    },
    // limited time显示逻辑
    // 常规逻辑：跟skc走的，skc有活动就展示limited time sale标签，详情页跟着skc/sku走，参与就展示
    // 特殊处理价格区间：没有coupon,有区间价格的时候,根据商品参与的是limited time sale展示对应的活动信息，列表页切换颜色时，区间价格和标签均显示且不变
    isShowLimitedTimeTag({ item }) {
      return (
        (item.activityInfo && item.activityInfo.labelName == 'time_limited') ||
        (!item.activityCouponCode && item.hasShopPriceRange && item.isLimitedTimeActivity)
      )
    },
    // flash sale显示逻辑
    // 常规逻辑：跟skc走的，skc有活动就展示flash sale标签，详情页跟着skc/sku走，参与就展示
    isShowFlashSaleTag({ item, serverTime }) {
      return item.flashSaleInfo && serverTime && !item.activityCouponCode
    }
  },
  mounted() {
    this.initColor = this.item.colorId
    this.module = this.$route.query.from
    const arr = [
      'shop_by_fabric',
      'season_trends',
      'spring_2019_trends',
      'summer_2019_trends',
      'shop_by_season',
      'dusty_color',
      'new_arrival_banner',
      'groomsmen_accessories_banner',
      'Why_Azazie'
    ]
    const r = arr.some((item) => {
      if (item == this.module) {
        return true
      }
    })
    this.addModule = this.module != null && r

    // 初始化设置是否包含视频
    if (this.item.videoList && this.item.videoList.ktlaVideo) {
      this.hasVideo = true
      this.showVideo = true
    } else {
      this.hasVideo = false
      this.showVideo = false
    }
    if (this.sodView == 'petite_plus' || (this.item.specialPlus && [2, 8].includes(this.catId))) {
      this.$emit('reset-display', true)
    }
  },
  methods: {
    // 获取图片的对应alt
    getImgAlt(item, index, type) {
      if (!index) index = 1
      if (!type) type = 'front'
      let goodsName = item.goodsTitle ? item.goodsTitle : item.shownGoodsName
      let catName = item.catName || ''
      let goodsSubTitle = item.goodsSubTitle || ''
      // 如果最后一个字符是空格，去掉空格
      if (goodsName.charAt(goodsName.length - 1) === ' ') goodsName = goodsName.substr(0, goodsName.length - 1)
      if (catName.length > 1 && catName.charAt(catName.length - 1) === ' ') catName = catName.substr(0, catName.length - 1)
      if (goodsSubTitle.length > 1 && goodsSubTitle.charAt(goodsSubTitle.length - 1) === ' ')
        goodsSubTitle = goodsSubTitle.substr(0, goodsSubTitle.length - 1)

      if ([7, 8, 10, 2, 45, 158].includes(item.catId)) {
        return `${goodsName} ${catName} ${goodsSubTitle} image${index}`
      } else if (item.catId === 9) {
        return `${goodsName} ${goodsSubTitle} image${index}`
      } else if (this.isSpecialCatId(item.catId)) {
        return `${goodsName} image${index}`
      } else {
        return `${type} ${goodsName}`
      }
    },
    getVideoInfo(item) {
      return {
        goodsId: item.goodsId,
        goodsSn: item.goodsSn,
        ...item.videoList.ktlaVideo,
        thumbnail: this.addWebpSuffix(item.videoList.ktlaVideo.thumbnail),
        url: this.cdnReplace(item.videoList.ktlaVideo.url)
      }
    },
    addWebpSuffixProps(url) {
      // 第三个参数： #17755: CDN 测试, 先做 JBD（catId: 9）的列表页和详情页
      const isJBDList = this.$route.name == 'list' && this.catIds.length == 1 && this.catIds[0] == 9
      return this.addWebpSuffix(url, !this.addSuffix, isJBDList)
    },
    /**
     * 对占位banner进行打点记录
     */
    getBiParams() {
      if (this.scene === 'holidayBride') {
        return { ec: 'charitybanner', el: 'banner' }
      }
      return {
        ec: 'fixbanner_' + this.productIndex, // 当前占位图在列表中的次序
        el: 'choose',
        msg: JSON.stringify({
          cat_id: this.catId,
          category_ids: this.catIds,
          cat_name: this.seoCatName || this.catName,
          dress_type: this.dressType
        }),
        dp: '/list'
      }
    },
    // 颜色选择
    colorSwitchClick(colorItem, eventType) {
      // 点击非本产品的颜色后，隐藏视频，是本产品的颜色，显示视频
      if (this.initColor == colorItem.colorId) {
        this.showVideo = true
      } else {
        this.showVideo = false
      }
      this.getProductInfo(this.item.goodsId, this.item.dressType, colorItem.color, colorItem)
    },
    // 订单追踪 和 打点
    goodsClick(index) {
      const msg = {
        goodsId: this.item.goodsId,
        cat_name: this.item.catName,
        dress_type: this.item.dressType || this.dressType,
        cat_id: this.item.catId,
        from_type: this.$route.query.from_type, // #17369： 搜索新加的msg.from_type,表示搜索来源
        cdn_prvd: this.cdnPrvd(this.item.catId)
      }
      if (this.$route.name == 'list') {
        // list 商品点击打点
        this.buryPoint(this, 'event', {
          ec: 'listpage',
          el: 'listpage',
          ea: 'click',
          msg: JSON.stringify(msg),
          param2: this.versionObj.listWithCodeAbtest
        })
      }
      if (this.$route.name == 'search' || (this.$route.name == 'list' && this.$route.query && this.$route.query.from == 'search')) {
        const name = this.item.shownGoodsName
        this.buryPoint(this, 'events', [
          { ec: 'search', el: 'resultlistpage', ea: 'click', msg },
          { ec: 'search', el: 'resultlistpage_' + name, ea: 'click', msg }
        ])
      }
      const goodsId = this.item.goodsId
      if (this.addModule) {
        this.setModuleCookie(this.module, goodsId)
      }
      if (window.location.href.indexOf('from_style_quiz=1') > 0) {
        this.setModuleCookie('style_quiz', goodsId)
      }
      if (window.location.href.indexOf('from_style_gallery=1') > 0) {
        this.setModuleCookie('style_gallery_shop_the_color', goodsId)
      }
      if (window.location.href.indexOf('all/wedding-dresses/plus-size') > 0) {
        this.setModuleCookie('from_plus_size_page', goodsId)
      }
      if (window.location.href.indexOf('all/bridesmaid-dresses/plus-size') > 0) {
        this.setModuleCookie('from_bd_plus_size_page', goodsId)
      }
      const catId = this.item.catId
      const catArray = [7, 9, 10, 45, 139, 158]
      const inCat = catArray.includes(catId)
      if (catId == 2) {
        if (this.viewSwitch == 'larger') {
          this.setModuleCookie('view_switch_larger', goodsId)
          this.setDataLayer('BrideListPageLarge_Click')
        } else {
          this.setModuleCookie('view_switch_smaller', goodsId)
          this.setDataLayer('BrideListPageSmall_Click')
        }
      } else if (inCat) {
        if (this.viewSwitch == 'larger') {
          this.setModuleCookie('view_switch_larger', goodsId)
          this.setDataLayer('BridesmaidListPageLarge_Click')
        } else {
          this.setModuleCookie('view_switch_smaller', goodsId)
          this.setDataLayer('BridesmaidListPageSmall_Click')
        }
      }
      if (window.location.href.indexOf('from_showroom_accessories_ad=1') > 0) {
        this.setModuleCookie('showroom_accessories_ad', goodsId)
      }
      if (window.location.href.indexOf('from_season_trends=1') > 0) {
        this.setModuleCookie('pc_fall2018trends', goodsId)
      }
      if (window.location.href.indexOf('from=m_canada_sample_banner_index') > 0) {
        this.setModuleCookie('pc_canada_sample_banner_index', goodsId)
      }
      if (window.location.href.indexOf('from=m_canada_sample_banner_bridesmaid') > 0) {
        this.setModuleCookie('pc_canada_sample_banner_bridesmaid', goodsId)
      }
      if (window.location.href.indexOf('from=m_canada_sample_banner_bride') > 0) {
        this.setModuleCookie('pc_canada_sample_banner_bride', goodsId)
      }
      if (window.location.href.indexOf('from=m_canada_sample_banner_mbd') > 0) {
        this.setModuleCookie('pc_canada_sample_banner_mbd', goodsId)
      }
      if (window.location.href.indexOf('from=m_canada_sample_banner_cart') > 0) {
        this.setModuleCookie('pc_canada_sample_banner_cart', goodsId)
      }
      if (window.location.href.indexOf('from_sample_similar=1') > 0) {
        this.setModuleCookie('sample_similar', goodsId)
        this.setDataLayer({
          category: 'SimilarStyles',
          action: 'click',
          label: 'SimilarStyles_ListPageProduct__Click'
        })
      }
      if (window.location.href.indexOf('sort_by=featured') > 0 && index && index <= 10) {
        this.setDataLayer({
          category: 'SortBy',
          action: 'click',
          label: `SortBy_Featured${index}_Click`
        })
      }

      // 样衣try on dresses by favorited 选中状态
      if (this.$route.query.tryOnDress == true || this.$route.query.tryOnDress == 'true') {
        this.setOrderSourceFlag('tryondressesbyfavorited', true)
      }

      this.$emit('onGoodsClick', this.item)
    },
    // 图片、颜色数量、名称入口打点
    goodsImgDot(type) {
      // AZWEB-21052 /collection/all 商品集合页（ 搜索页 q=azazie）
      if (this.jsKey == 'search') {
        localStorage && localStorage.setItem('FROM_COLLECTION_ALL', 1)
      }
      // 一些新品类 列表页商品图片入口 打点
      if (this.item.catId == 10) {
        // 花童
        this.setDataLayer({
          category: 'FlowerGirlDresses',
          action: 'click',
          label: 'FlowerGirlDresses_all_' + this.item.shownGoodsName + '_click'
        })
      } else if (this.item.goodsId == 1002653 || this.item.goodsId == 1002654) {
        // 马甲
        this.setDataLayer({
          category: 'Accessories',
          action: 'click',
          label: 'Accessories_all_' + this.item.shownGoodsName + '_click'
        })
      } else if (this.isSpecialCatId(this.item.catId)) {
        // 时装
        this.setDataLayer({
          category: 'SpecialOccasions',
          action: 'click',
          label: 'SpecialOccasions_all_' + this.item.shownGoodsName + '_click'
        })
      }
      // this.newListToDetail()
      let msg = {
        goodsId: this.item.goodsId,
        color: this.item.color,
        cat_name: this.item.catName,
        dress_type: this.item.dressType || this.dressType,
        cat_id: this.item.catId,
        img_link: (this.item.imgUrl && this.item.imgUrl.split('upimg/')[1]) || '', // 取upimg/后面的路径
        no: this.item.indexNo,
        sort_by: this.sortBy,
        from_type: this.$route.query.from_type, // #17369： 搜索新加的msg.from_type,表示搜索来源
        cdn_prvd: this.cdnPrvd(this.item.catId)
      }
      if (this.item.galleryVersion) {
        msg = {
          ...msg,
          img_ver: this.item.galleryVersion // 当前商品图片的ab版本
        }
      }
      if (this.item.catId == 33) {
        msg.has_line_price = this.item.hasLinePrice ? 1 : 0
      }
      let param2 = null

      if (this.versionObj.listWithCodeAbtest) {
        param2 = this.versionObj.listWithCodeAbtest
      } else {
        param2 = 'A' // 色系排序ab版本
      }
      if ([3, 3102, 3109].includes(this.item.catId)) {
        msg.filter_size = this.filterSize.join(',')
        msg.ab = (this.item.sodGalleyVersion || 'a').toLowerCase()
      }
      const tempDiscount = this.getDiscountPoint()
      if (tempDiscount && this.item.dressType === 'clearance') {
        msg.discount = tempDiscount
      }
      this.buryPoint(this, 'event', {
        ec: 'product',
        el: 'choose',
        ea: 'click',
        param2,
        msg
      })
      if (this.jsKey == 'holiday-bride-list') {
        this.buryPoint(this, 'event', {
          ec: 'charityproduct',
          el: 'charityproduct',
          ea: 'click',
          param2,
          msg
        })
      }
      // ga 打点
      const gaParams = this.getGAItemListParams(this.item, this.productIndex, type, this.$route.name)
      gaParams && this.setGA4DataLayer(gaParams)
    },
    // 获取discount对应的打点值
    getDiscountPoint() {
      let res = this.item.discount
      if (!res && this.$route.name === 'list') {
        if (this.filters) {
          for (const key in this.filters) {
            if (['discount', 'discountoff'].includes(this.filters[key].key)) {
              for (const k in this.filters[key].values) {
                if (this.filters[key].values[k].selected) {
                  res = this.filters[key].values[k].value
                }
              }
            }
          }
        }
      }
      return parseInt(10 - res)
    },
    filterTypeIsSelected(type) {
      let result = false
      if (!this.filters || !this.filters.filters || !this.filters.filters[type]) return false
      const filterTypeArr = this.filters.filters[type].options
      if (!filterTypeArr || !filterTypeArr.length) return false
      for (let i = 0, len = filterTypeArr.length; i < len; i++) {
        if (filterTypeArr[i].selected) {
          result = true
          break
        }
      }
      return result
    },
    // sod 打点
    SODSizeDot(key, value) {
      if (this.isSpecialCatId(this.item.catId) && key && value) {
        this.setDataLayer({
          category: key,
          action: 'click',
          label: value
        })
      }
    },
    // 显示quick shop 按钮、背面图和视频
    handleQuickShop(quickShopBtnShow) {
      // 打点Dress_QuickShop_View
      if (this.item.dressType == 'Dresses') {
        this.setDataLayer({ category: 'Dress', action: 'view', label: 'Dress_QuickShop_View' })
      }

      if (this.item.catId != 3110) {
        // 定制商品不显示quickshop
        this.quickShopBtnShow = quickShopBtnShow
      }

      // 当前颜色为初始显示颜色时，可以对视频进行hover操作
      if (this.initColor == this.item.colorId) {
        if (this.item.specialPlus) {
          this.showVideo = true
        } else {
          this.showVideo = !quickShopBtnShow // 控制视频元素是否显示
        }
      }
      // 如果存在视频，并且hover隐藏视频的情况下，显示第一张商品图
      if (this.hasVideo && !this.showVideo && this.initColor == this.item.colorId) {
        this.iconPetiePlusShow = false
        // 如果是待播放的视频，视图中并没有显示视频，这时，鼠标浮动时，需要正常切换图片
        const videoBox = (this.$refs.videoBox && this.$refs.videoBox.childNodes) || []
        videoBox.forEach((ele) => {
          if (ele.nodeName === 'DIV') {
            const elStyle = window.getComputedStyle(ele)
            if (elStyle.display === 'none') {
              this.iconPetiePlusShow = quickShopBtnShow
            }
          }
        })
      } else {
        this.iconPetiePlusShow = quickShopBtnShow
      }
    },
    // mouseenter 图片框 iconPetiePlusIndex: 序号
    setIndex(iconPetiePlusIndex) {
      if (this.hideBackImg) {
        this.iconPetiePlusShow = false
        return
      } // 通过props控制是否显示背景图
      if (iconPetiePlusIndex == 1) {
        // 浮动到大图上
        if (this.item.videoList && this.item.videoList.ktlaVideo) {
          this.moveInBig = true
        }
      }
      this.iconPetiePlusIndex = iconPetiePlusIndex
    },
    // 显示图片右下角小图标
    handleIconPetiePlus(iconPetiePlusHover, iconPetiePlusIndex) {
      this.iconPetiePlusHover = iconPetiePlusHover
      this.iconPetiePlusIndex = iconPetiePlusIndex
    },
    // 显示quick shop弹框
    showQuickShopDialog() {
      const msg = {
        goodsId: this.item.goodsId,
        color: this.item.color,
        cat_name: this.item.catName,
        dress_type: this.item.dressType,
        cat_id: this.item.catId,
        no: this.item.indexNo,
        from_type: this.$route.query.from_type // #17369： 搜索新加的msg.from_type,表示搜索来源
      }
      if (this.item.catId == 33) {
        msg.has_line_price = this.item.hasLinePrice ? 1 : 0
      }
      if (this.sortBy && this.sortBy != -1) {
        msg.sort_by = this.sortBy
      }
      const tempDiscount = this.getDiscountPoint()
      if (tempDiscount && this.item.dressType === 'clearance') {
        msg.discount = tempDiscount
      }
      this.buryPoint(this, 'event', {
        ec: 'product',
        el: 'quickshop',
        ea: 'click',
        msg
      })
      const params = {
        goods_id: this.item.goodsId,
        catId: this.item.catId,
        dress_type: this.item.dressType,
        goods_style_id: this.item.goodsStyleId || '',
        color: this.item.color,
        indexNo: this.item.indexNo,
        isPlusImg: this.item.isPlusImg
      }
      this.$emit('quickShop', params)
      this.$store.commit('quickshop/setQuickShopDialog', true)
      this.buryPoint(this, 'event', {
        ec: 'popup',
        el: 'quickshop',
        ea: 'view',
        msg
      })
    },
    // 修改显示大小码模式
    changeSodView(sodView) {
      this.$store.commit('list/setSodView', sodView)
      this.$cookie.setCookie('SOD_VIEW_NEW', sodView, 7, '.' + this.APP_DOMAIN_LOWER)
      this.$emit('sodViewChange', sodView)
      let txt = ''
      switch (sodView) {
        case 'petite_plus':
          txt = 'Dress_ViewPetiteAndPlus_Click'
          break
        case 'plus':
          txt = 'Dress_ViewPlus_Click'
          break
        case 'petite':
          txt = 'Dress_ViewPetite_Click'
          break
      }
      this.setDataLayer({
        action: 'click',
        category: 'Dress',
        label: txt
      })
    },
    /**
     * 根据不同颜色获取商品信息
     * goods_id
     * dress_type
     * color
     *  */
    getProductInfo(goodsId, dressType, color, colorItem) {
      const tempProdList = JSON.parse(JSON.stringify(this.prodList))
      const tempProdListItem = tempProdList[this.productIndex]
      // 颜色信息更新
      tempProdListItem.shownGoodsName = colorItem.shownGoodsName
      tempProdListItem.colorId = colorItem.colorId
      tempProdListItem.goodsStyleId = colorItem.goodsStyleId || tempProdListItem.goodsStyleId
      tempProdListItem.color = colorItem.color
      tempProdListItem.showColor = colorItem.showColor
      tempProdListItem.plusSize = colorItem.plusSize
      tempProdListItem.isNew = colorItem.isNew
      const params = {
        from: 'list',
        goods_id: goodsId,
        dress_type: dressType,
        color,
        sodGalleryVersion: this.$store.state.versionObj.sodGalleryVersion // sod 强制获取图片ab版本
      }
      if (this.isSpecialCatId(this.item.catId)) {
        params.hide_drive = 1 // sod 激励告诉后端是否
        // if (this.$route.name == 'list') {
        //   params.sodGalleryVersion = 'a'
        // }
        params.img_show_type = this.getImgShowType(this.filterSize)
      }
      if (this.$route.name == 'search' && this.$route.query.category == 'dresses' && this.$route.query.size) {
        if (['1x', '2x', '3x'].includes(this.$route.query.size.toLowerCase())) {
          params.img_show_type = 'plus'
        }
      }
      // sod 预售商品加个来源，true表示是预售列表页切换颜色
      if (this.$route.name == 'landingPage-preSaleList') {
        params.from_pre_sale = true
        params.sodGalleryVersion = 'b'
      }
      if (this.$route.query.fresh_deals) params.fresh_deals = this.$route.query.fresh_deals
      this.$axios
        .$get(`/1.0/product/item-info`, { params })
        .then((res) => {
          if (res.code == 0) {
            // 更新价格信息
            const baseInfo = res.data.baseInfo
            tempProdListItem.hasLinePrice = baseInfo.hasLinePrice
            tempProdListItem.noDealPriceDisplay = baseInfo.noDealPriceDisplay
            tempProdListItem.shopPriceDisplay = baseInfo.shopPriceDisplay
            tempProdListItem.priceOffDisplay = baseInfo.priceOffDisplay
            tempProdListItem.shopPrice = baseInfo.shopPrice
            tempProdListItem.noDealPrice = baseInfo.noDealPrice
            tempProdListItem.priceOff = baseInfo.priceOff
            tempProdListItem.priceSymbol = baseInfo.priceSymbol
            tempProdListItem.hasPriceRule = baseInfo.hasPriceRule
            tempProdListItem.flashSaleInfo = baseInfo.flashSaleInfo || null
            tempProdListItem.stickers = res.data.stickers || null
            tempProdListItem.isNew = baseInfo.isNew
            tempProdListItem.sodGalleyVersion = baseInfo.sodGalleyVersion
            tempProdListItem.isMeasurementHideGoods = baseInfo.isMeasurementHideGoods
            tempProdListItem.comingSoonInfo = baseInfo.comingSoonInfo
            tempProdListItem.isComingSoon = baseInfo.isComingSoon
            tempProdListItem.driveInfo = baseInfo.driveInfo || {}
            tempProdListItem.activityInfo = baseInfo.activityInfo
            tempProdListItem.isLimitedTimeActivity = baseInfo.isLimitedTimeActivity
            tempProdListItem.discount = baseInfo.discount
            tempProdListItem.offRateValue = baseInfo.offRateValue || ''
            // AZWEB-21266 更新未选中sku时展示价格区间
            tempProdListItem.upToSaveRateValue = baseInfo.upToSaveRateValue || ''
            tempProdListItem.hasShopPriceRange = baseInfo.hasShopPriceRange
            tempProdListItem.minShopPriceDisplay = baseInfo.minShopPriceDisplay
            tempProdListItem.maxShopPriceDisplay = baseInfo.maxShopPriceDisplay
            // goodsStyleId更新
            tempProdListItem.goodsStyleId = baseInfo.goodsStyleId
            tempProdListItem.goodsUrl = baseInfo.goodsUrl
            tempProdListItem.imgUrl = baseInfo.imgUrl
            tempProdListItem.backImgUrl = baseInfo.backImgUrl
            tempProdListItem.bigImg = baseInfo.bigImg
            tempProdListItem.sodPreSaleGoods = baseInfo.sodPreSaleGoods
            tempProdListItem.preSaleSticker = baseInfo.preSaleSticker
            tempProdListItem.activityCouponCode = baseInfo.activityCouponCode
            tempProdListItem.afterPayTips = baseInfo.afterPayTips
            const imageInfo = res.data.imageInfo
            let sodGalleyVersion = 'a'
            if (imageInfo.goodsGallery[baseInfo.color] && imageInfo.goodsGallery[baseInfo.color].sodGalleyVersion) {
              sodGalleyVersion = imageInfo.goodsGallery[baseInfo.color].sodGalleyVersion
            }
            this.$store.commit('setSodGalleryVersion', sodGalleyVersion)
            // best seller页面商品切换颜色不会返回sticker信息，因为此页面固定展示榜单排序，所以手动加个sticker信息
            if (this.$route.name === 'bestSeller' && (!tempProdListItem.stickers || tempProdListItem.stickers.length === 0)) {
              tempProdListItem.stickers = [
                {
                  location: 'topLeft',
                  name: 'best_seller'
                }
              ]
            }
            if ([33, 36].includes(baseInfo.catId)) {
              tempProdListItem.shownGoodsName = baseInfo.shownGoodsName
            }
          }
        })
        .finally(() => {
          tempProdList[this.productIndex] = tempProdListItem
          this.$store.commit('list/setProdList', tempProdList)
        })
    },
    toPlusPath() {
      window.open(`${location.origin}/all/wedding-dresses/plus-size`)
    },
    showGoodsNumberText(number) {
      if (this.item.colorSwitch && number > Object.keys(this.item.colorSwitch).length) {
        return '+' + (number - Object.keys(this.item.colorSwitch).length)
      } else {
        return ''
      }
    },
    backSoonBtn(info) {
      this.$emit('notify-me', info)
    },
    getBiNotifyMeParam(item) {
      const msg = {
        goodsId: item.goodsId,
        color: item.color,
        cat_name: item.catName,
        dress_type: item.dressType,
        cat_id: item.catId,
        no: item.indexNo
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
    },
    getProductView(item) {
      if (!item.position) {
        let msgObj = {
          goodsId: item.goodsId,
          color: item.color, // 这个color就是key 是当前商品的选中颜色
          cat_name: item.catName,
          dress_type: item.dressType || this.dressType,
          cat_id: item.catId,
          img_link: (item.imgUrl && item.imgUrl.split('upimg/')[1]) || '', // 取upimg/后面的路径
          no: item.indexNo,
          from_type: this.$route.query.from_type, // #17369： 搜索新加的msg.from_type,表示搜索来源
          cdn_prvd: this.cdnPrvd(item.catId)
        }
        if (this.sortBy && this.sortBy != -1) {
          msgObj.sort_by = this.sortBy
        }
        if (item.galleryVersion) {
          msgObj = {
            ...msgObj,
            img_ver: item.galleryVersion // 当前商品图片的ab版本
          }
        }
        if (item.catId == 33) {
          msgObj.has_line_price = item.hasLinePrice ? 1 : 0
        }
        const param2 = item.indexNo <= 60 ? this.$store.state.versionGroup.list_content_gallery_ab : '-1'
        if ([3, 3102, 3109].includes(this.item.catId)) {
          msgObj.filter_size = this.filterSize.join(',')
          msgObj.ab = (item.sodGalleyVersion || 'a').toLowerCase()
        }
        const tempDiscount = this.getDiscountPoint()
        if (tempDiscount && this.item.dressType === 'clearance') {
          msgObj.discount = tempDiscount
        }
        const pointArr = [
          {
            ec: 'product',
            el: 'product',
            msg: JSON.stringify(msgObj),
            param2
          }
        ]
        // #17615: from=search列表页 也需要加上search的点
        if (this.$route.name == 'list' && this.$route.query && this.$route.query.from == 'search') {
          const resultlistpageParams = {
            ec: 'search',
            el: 'resultlistpage',
            msg: JSON.stringify(msgObj)
          }
          pointArr.push(resultlistpageParams)
        }
        // AZWEB-20548 The Bachelorette’s Charity Lawson Holiday
        if (this.jsKey == 'holiday-bride-list') {
          const holidayBrideParams = {
            ec: 'charityproduct',
            el: 'charityproduct',
            msg: JSON.stringify(msgObj)
          }
          pointArr.push(holidayBrideParams)
        }

        return {
          id: item.goodsId + item.goodsUrl,
          common: pointArr
        }
      }
    },
    handleShowShoppingForDialog() {
      this.$store.commit('setShowShoppingForDialog', true)
    },
    productDetailUrl(item, sodView = false) {
      let url = item.goodsUrl
      if (sodView) {
        url = setUrlParam(url, 'is_plus_size', 1)
      }
      if (item.dressType == 'clearance') {
        url = setUrlParam(url, 'discount', -1)
      }
      return this.jointColorSizeUrl(this.navToGoodsDetail(url, item))
    },
    // 在目标url路径上加上color,size。针对列表页商品,列表页商品本身就有color了，只要加上size就行
    jointColorSizeUrl(url) {
      const obj = { size: this.$route.query.stock_size }
      // 如果路径中没有尺码信息，判断缓存中有没有对应品类的尺码记录
      if (!obj.size && process.client) {
        let selectedSize = ''
        selectedSize = localStorage && localStorage.getItem('SELECTED_SIZE')
        // all/final-sale列表页商品前端不添加size参数
        if (selectedSize && !this.$route.path.includes('/all/final-sale')) {
          const tempSelectedSize = JSON.parse(selectedSize)
          if (tempSelectedSize && Array.isArray(tempSelectedSize)) {
            for (let i = 0; i < tempSelectedSize.length; i++) {
              const ele = tempSelectedSize[i]
              if (ele.catId === this.item.catId) {
                obj.size = ele.selectedSize.key
                break
              }
            }
          }
        }
      }
      let tempUrl = url
      if (tempUrl && !tempUrl.includes('javascript:') && this.$route.name === 'list') {
        for (const key in obj) {
          if (obj[key] && !tempUrl.includes(key)) {
            if (tempUrl.includes('?')) {
              tempUrl = `${tempUrl}&${key}=${obj[key]}`
            } else {
              tempUrl = `${tempUrl}?${key}=${obj[key]}`
            }
          }
        }
      }
      if (tempUrl && !tempUrl.includes('javascript:') && this.$route.name === 'list' && this.$route.query.bundleId) {
        if (tempUrl.includes('?')) {
          tempUrl = `${tempUrl}&bundleId=${this.$route.query.bundleId}`
        } else {
          tempUrl = `${tempUrl}?bundleId=${this.$route.query.bundleId}`
        }
      }
      if (this.isSpecialCatId(this.item.catId)) {
        let sodGalleryVersion = 'a'
        // if (['list', 'search'].includes(this.$route.name)) {
        //   sodGalleryVersion = 'a'
        // }
        if (this.$route.name == 'landingPage-preSaleList') {
          sodGalleryVersion = 'b'
          if (tempUrl.indexOf('?')) {
            tempUrl += `&sodGalleryVersion=${sodGalleryVersion}`
          } else {
            tempUrl += `?sodGalleryVersion=${sodGalleryVersion}`
          }
        }
      }
      return this.jointQUrl(tempUrl)
    },
    // 在目标url路径上加上q。针对搜索跳转的列表页以及结果页商品
    // #18890: 从搜索结果页以及列表页调整到详情页需要打点from_q，参数用的是q
    jointQUrl(url) {
      if (!this.$route.query.q) return url
      const obj = { q: this.$route.query.q }
      let tempUrl = url
      if (
        tempUrl &&
        !tempUrl.includes('javascript:') &&
        (this.$route.name == 'search' || (this.$route.name == 'list' && this.$route.query.from == 'search'))
      ) {
        for (const key in obj) {
          if (obj[key] && getUrlQueryNoPage(tempUrl) && !getUrlQueryNoPage(tempUrl)[key]) {
            if (tempUrl.includes('?')) {
              tempUrl = `${tempUrl}&${key}=${obj[key]}`
            } else {
              tempUrl = `${tempUrl}?${key}=${obj[key]}`
            }
          }
        }
      }
      return tempUrl
    },
    getColorBiParams(item, index) {
      return {
        id: 'Listpage_color-' + index + item.color,
        common: {
          ec: 'Listpage_color',
          el: 'Listpage_color',
          msg: JSON.stringify({
            goodsId: this.item.goodsId,
            cat_name: this.item.catName,
            dress_type: this.item.dressType || this.dressType,
            cat_id: this.item.catId,
            color: item.color,
            colorId: item.colorId
          })
        }
      }
    },
    showSodSaleSticker(item) {
      return this.$route.name == 'landingPage-preSaleList' && item.preSaleSticker && item.dressType == 'dress' && !item.isFinalSale
    },
    getImgShowType(sizes = []) {
      // 大图 => plus, 小图 => petite
      if (this.$route.path.includes('/plus-size')) {
        return 'plus'
      } else if (this.$route.query.sod_view == 'plus') {
        return 'plus'
      } else if (this.validateIsPlusSize(this.item.catId, sizes)) {
        return 'plus'
      }
      return 'petite'
    }
  }
}
</script>

<style lang="less" scoped>
.price-and-timer {
  line-height: normal;
}
.goods-item {
  display: inline-block;
  margin-bottom: 30px;
  text-align: center;
  &.A {
    .current-price {
      color: @theme-color !important;
    }
    .price-and-timer {
      line-height: inherit;
    }
  }
  &.goods-item-positon {
    &:hover {
      box-shadow: none;
    }
  }
  &:hover {
    box-shadow: 0px 0px 10px 0px rgba(238, 238, 238, 1);
  }
  &.wgd {
    &:hover {
      box-shadow: none;
    }
    .goods-item-pic {
      margin-bottom: 0;
    }
  }
  &.gift-card-item {
    .goods-item-pic {
      &:after {
        content: '';
        display: block;
        padding-top: 94%;
      }
      .goods-img-wrap {
        background: #fff;
        .goods-img {
          top: 16.5%;
        }
      }
    }
  }
  /*大图模式*/
  &.catpl-prod-360x498 {
    width: calc((100% - 45px) / 4);
    /** 婚纱只有一个商品胖瘦图的模式的样式 */
    &.catpl-prod-petite-plus-270x370 {
      width: calc((100% - 45px) / 4 * 2);
      margin-right: 15px;
    }
  }
  /*小图模式*/
  &.catpl-prod-270x370 {
    width: calc((100% - 60px) / 5);
    /** 婚纱只有一个商品胖瘦图的模式的样式 */
    &.catpl-prod-petite-plus-270x370 {
      width: calc((100% - 60px) / 5 * 2);
      margin-right: 15px;
    }
  }
  /*胖瘦图模式*/
  &.catpl-prod-petite-plus-270x370 {
    width: calc((100% - 15px) / 2);
    .goods-item-pic {
      &:after {
        content: '';
        display: block;
        padding-top: 69.2%;
      }
      .goods-item-petite-plus {
        width: 50%;
        height: 100%;
        position: absolute;
        background: data-uri('~assets/images/goodsList/img-bg.png') center center/74px 80px no-repeat,
          linear-gradient(to bottom, #f6f6f6, #f6f6f6 100%);
        &.plus-img-right {
          right: 0;
        }
        .tip-soon {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: 212px auto;
          background-position-y: calc(100% - 57px);
          background-position-x: 21px;
          z-index: 8;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          margin: auto;
        }
        .sod-bubble {
          cursor: pointer;
          position: absolute;
          width: 34px;
          height: 34px;
          right: 8px;
          z-index: 8;
          right: 10px;
          bottom: 10px;
          display: none;
          &.show {
            display: block;
          }
          img {
            width: 100%;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1600px) {
    &.catpl-prod-360x498 {
      width: calc((100% - 30px) / 3);
      /** 婚纱只有一个商品胖瘦图的模式的样式 */
      &.catpl-prod-petite-plus-270x370 {
        width: calc((100% - 30px) / 3 * 2);
        margin-right: 15px;
      }
    }
    /*小图模式*/
    &.catpl-prod-270x370 {
      width: calc((100% - 45px) / 4);
      /** 婚纱只有一个商品胖瘦图的模式的样式 */
      &.catpl-prod-petite-plus-270x370 {
        width: calc((100% - 45px) / 4 * 2);
        margin-right: 15px;
      }
    }
    /*胖瘦图模式*/
    &.catpl-prod-petite-plus-270x370 {
      width: calc((100% - 15px) / 2);
    }
  }
  @media screen and (max-width: 1024px) {
    /*大图模式*/
    &.catpl-prod-360x498 {
      width: calc((100% - 15px) / 2);
      /** 婚纱只有一个商品胖瘦图的模式的样式 */
      &.catpl-prod-petite-plus-270x370 {
        width: 100%;
        margin-right: 0;
      }
    }
    /*小图模式*/
    &.catpl-prod-270x370 {
      width: calc((100% - 30px) / 3);
      /** 婚纱只有一个商品胖瘦图的模式的样式 */
      &.catpl-prod-petite-plus-270x370 {
        width: calc((100% - 30px) / 3 * 2);
        // margin-right: 1.2%;
        margin-right: 15px;
      }
    }

    /*胖瘦图模式*/
    &.catpl-prod-petite-plus-270x370 {
      width: 100%;
    }
  }
  .goods-item-pic {
    color: var(--color-121212);
    font-size: 13px;
    width: 100%;
    position: relative;
    margin-bottom: 6px;
    background: data-uri('~assets/images/goodsList/img-bg.png') center center/74px 80px no-repeat,
      linear-gradient(to bottom, #f6f6f6, #f6f6f6 100%);
    cursor: pointer;
    &:after {
      content: '';
      display: block;
      padding-top: 138.4%;
    }
    .goods-img-wrap {
      width: 100%;
      height: 100%;
      position: absolute;
      background: data-uri('~assets/images/goodsList/img-bg.png') center center/74px 80px no-repeat,
        linear-gradient(to bottom, #f6f6f6, #f6f6f6 100%);
      overflow: hidden;
      &.goods-img-wrap-positon {
        &.goods-img-petite-plus-positon {
          width: 50%;
          left: 0;
          right: 0;
          margin: auto;
        }
        &:hover {
          box-shadow: 0px 0px 10px 0px #eee;
        }
        .goods-img-positon {
          position: absolute;
          top: 0;
          left: 0;
          height: unset;
          width: 100%;
          opacity: 1;
        }
      }
      a {
        display: flex;
        height: 100%;
        .icon-bofang {
          position: absolute;
          right: 8px;
          top: 5px;
          font-size: 33px;
        }
      }
      .mattel {
        position: absolute;
        right: 5px;
        bottom: 5px;
        font-size: 12px;
        line-height: 12px;
        text-transform: uppercase;
        color: #fff;
        transform-origin: right bottom;
        transform: scale(0.7);
        width: max-content;
      }
      .sample-faq-link {
        position: absolute;
        text-decoration: underline;
        color: @theme-color;
        left: 0;
        right: 0;
        bottom: 5%;
        width: auto;
        height: auto;
        display: block;
        &.is-bridal {
          color: var(--color-121212);
        }
      }
      .goods-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: unset;
        width: 100%;
        // display: none;
        opacity: 1;
        -webkit-animation: 0.5s slow_hide linear forwards;
        -moz-animation: 0.5s slow_hide linear forwards;
        animation: 0.5s slow_hide linear forwards;
        &.show {
          display: block;
          opacity: 1;
          -webkit-animation: 0.5s slow_show linear forwards;
          -moz-animation: 0.5s slow_show linear forwards;
          animation: 0.5s slow_show linear forwards;
        }
        &.shadow-blur {
          filter: blur(3px);
          width: calc(100% + 40px);
          margin-left: -20px;
          height: 100%;
        }
      }
      .video-box {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: @z-index;
        -webkit-animation: 0.5s slow_show linear forwards;
        -moz-animation: 0.5s slow_show linear forwards;
        animation: 0.5s slow_show linear forwards;
        /deep/video {
          width: 100.5%;
          margin-left: -0.25%;
          outline: 1px solid #fff;
          outline-offset: -1px;
        }
        &-hide {
          -webkit-animation: 0.5s slow_hide linear forwards;
          -moz-animation: 0.5s slow_hide linear forwards;
          animation: 0.5s slow_hide linear forwards;
        }
      }
    }
    .prod-flash-sale-icon-box {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 38px;
      height: 38px;
      background-color: @theme-color;
      border-radius: 50%;
      z-index: 2;
      .prod-flash-sale-icon {
        position: absolute;
        font-size: 14px;
        color: #fff;
        line-height: 12px;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding-top: 2px;
        .off-dec {
          font-family: @font-family-600;
        }
        .off-txt {
          transform: scale(0.6);
          display: inline-block;
        }
      }
    }
    .goods-img {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
    .plus-size-available {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: rgba(192, 192, 192, 0.3);
      position: absolute;
      top: 100%;
      &-wgd {
        top: auto;
        bottom: 0;
        background: rgba(246, 246, 246, 0.6);
        color: var(--color-121212);
        font-family: @font-family-600;
        text-transform: uppercase;
      }
    }
    .quick-shop {
      z-index: 8;
      font-family: @font-family-500, sans-serif;
      background-color: #ffffffb3;
      height: 30px;
      line-height: 30px;
      width: 170px !important;
      box-sizing: border-box;
      padding: 0 5px;
      opacity: 0.8;
      position: absolute;
      color: var(--color-121212);
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.05), 0 1px 4px 0 rgba(0, 0, 0, 0.05);
      display: none;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      &.show {
        display: block;
        width: fit-content !important;
        white-space: nowrap;
      }
    }
    .shop-more-plus {
      position: absolute;
      width: 150px;
      height: 30px;
      line-height: 30px;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 10% !important;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 8;
      .shop-more-plus-text {
        color: var(--color-121212);
      }
    }
    .goods-be-back-soon-btn {
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.6);
      display: none;
      // z-index: @z-index-2;
      // display: flex;
      justify-content: center;
      align-items: center;
      // pointer-events: auto;
      .btn-text {
        width: 58%;
        padding: 6px 0;
        background-color: rgba(255, 255, 255, 0.7);
        font-family: @font-family-500;
        font-size: 13px;
        line-height: 18px;
        text-align: center;
        text-transform: lowercase;
        color: var(--color-121212);
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
        z-index: 2;
      }
    }
    &:hover {
      .goods-be-back-soon-btn {
        display: flex;
      }
    }
  }
  .goods-colors {
    margin: 9px 0 8px;
    text-align: center;
    &.show-plus-size-available {
      margin-top: 40px;
    }
    a {
      display: inline-block;
      vertical-align: middle;
    }
    .more {
      font-style: italic;
      .text-link(@gray);
      font-style: normal;
    }
    .cat-switch-color {
      a {
        border-radius: 50%;
        margin: 0 4px;
        &:hover {
          cursor: pointer;
        }
        &.selected {
          span {
            background-image: url('~assets/images/product/border.svg');
            background-size: cover;
          }
        }
        span {
          display: block;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          position: relative;
          .icon-stock {
            position: absolute;
            fill: currentColor;
            color: #fff;
            left: 0;
            right: 0;
            margin: auto;
            top: 2px;
          }
        }
      }
    }
  }
  .goods-name {
    margin: auto;
    font-family: @font-family-600;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
    .barbie-heart {
      fill: #de1c85;
      transform: scale(0.5);
    }
    a {
      // display: block;
      color: var(--color-121212);
      .icon-free-ship-cart {
        width: 41px;
        height: 19px;
        fill: currentColor;
        color: @theme-color;
        margin-right: 4px;
      }
      .icon-new {
        font-weight: bold;
        color: @theme-color;
        margin-right: 4px;
      }
    }
  }
  .goods-sub-name {
    font-size: 13px;
    line-height: 18px;
    text-align: center;
    color: var(--color-666666);
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .goods-color {
    color: #666;
    font-family: @font-family-500;
    line-height: 18px;
    text-align: center;
  }
  .goods-price {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 15px;
    &.range-price {
      .no-deal-price {
        display: block;
      }
    }
    &.goods-price-box {
      font-size: 0;
    }
    .current-price {
      font-family: @font-family-600;
      font-size: 16px;
      line-height: 22px;
      display: inline-block;
      color: var(--color-121212);
      // color: @theme-color;
    }
    .no-deal-price {
      color: var(--color-999999);
      font-size: 13px;
      margin-left: 5px;
      text-decoration: line-through;
      display: inline-block;
      font-family: @font-family-500;
      &.sample-price {
        font-family: @font-family-600;
        font-size: 16px;
        line-height: 18px;
        color: var(--color-121212);
        margin-left: 0;
        text-decoration: none;
      }
    }
    /deep/ .sample-price {
      font-family: @font-family-600;
      font-size: 16px;
      line-height: 18px;
      color: var(--color-121212);
      margin-left: 0;
      text-decoration: none;
    }
    .origin-price {
      display: inline-block;
      // text-decoration: line-through;
      font-size: 13px;
      font-family: @font-family-500;
      line-height: 18px;
      color: var(--color-121212);
      & ~ span {
        font-size: 13px;
      }
    }
  }
  .final_sale {
    font-size: 13px;
    font-family: @font-family-500;
    color: @theme-color;
    line-height: 18px;
    height: 18px;
    text-transform: capitalize;
    text-align: center;
    display: inline-block;
  }
  .try-class {
    font-size: 13px;
    color: var(--color-121212);
    font-weight: bold;
    display: inline-block;
    text-transform: uppercase;
    border: 1px solid @a-color;
    color: @a-color;
    min-width: 93px;
    height: 23px;
    padding-left: 5px;
    line-height: 23px;
    border-radius: 2px;
    margin-top: 3px;
    background-color: #fff;
    &:after {
      content: '';
      display: inline-block;
      vertical-align: 7%;
      margin-left: 9px;
      border-left: 7px solid @a-color;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
    }
    &:hover {
      color: #fff;
      background-color: @a-color;
      &:after {
        content: '';
        display: inline-block;
        vertical-align: 7%;
        margin-left: 9px;
        border-left: 7px solid #fff;
        border-top: 3px solid transparent;
        border-bottom: 3px solid transparent;
      }
    }
  }
  .goods-rate {
    font-size: 0;
    a {
      .show_review {
        color: var(--color-999999);
        cursor: pointer;
        margin-left: 5px;
        font-size: 13px;
      }
    }
  }
  .price-try-on-for {
    font-size: 15px;
    .price_show {
      font-family: @font-family-600;
      margin-left: 3px;
    }
  }
  // todo: b版本样式
  .wgd {
    .goods-color-rate {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      .goods-colors {
        margin: 13px 0 10px;
        line-height: 12px;
        text-align: left;
        .cat-switch-color {
          .inner-color-box {
            width: 12px;
            height: 12px;
          }
          a {
            margin-left: 0;
            margin-right: 5px;
          }
        }
      }
      .goods-rate {
        justify-self: flex-end;
        .show_review {
          display: none;
        }
      }
    }
    .goods-name-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-name {
        margin: 0;
        font-size: 13px;
        line-height: 18px;
        color: var(--color-121212);
        text-align: left;
        margin-right: 10px;
        max-height: 54px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        flex: 1;
        a {
          color: var(--color-121212);
          .icon-new {
            font-weight: normal;
          }
        }
      }
      .price-and-timer {
        justify-self: flex-end;
        text-align: right;
        .goods-price {
          margin-top: 0;
          font-family: @font-family-600;
          font-size: 13px;
        }
        .goods-price-box {
          // display: flex;
          // flex-direction: column;
          // justify-content: flex-end;
          text-align: right;
          .no-deal-price {
            font-size: 13px;
            line-height: 18px;
            color: var(--color-121212);
          }
          .current-price {
            font-size: 13px;
            font-family: @font-family-600;
            line-height: 18px;
            color: var(--color-121212);
            display: block;
            // color: @theme-color;
          }
        }
      }
    }
    .goods-limit-time-container {
      text-align: right;
      &.flex-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      /deep/ .limited-time-box {
        height: 18px;
        margin: 0;
        background-color: unset;
        font-size: 13px;
        font-family: @font-family-600;
        line-height: 18px;
        color: @theme-color;
        .after {
          display: none;
        }
        &::after {
          display: none;
        }
      }
      /deep/ .az-with-code-box {
        justify-content: flex-end;
      }
    }
  }
  .with-code-and-finalsale {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 5px;
    &.isBetween {
      justify-content: space-between;
    }
  }
  /deep/ .icon-fav-wrapper .sub_menu_box {
    top: 37px;
    right: 0;
  }
}
@keyframes slow_show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slow_hide {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    display: none;
  }
}
@media screen and (max-width: 1490px) {
  .wgd .goods-name-price .goods-name {
    max-height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
