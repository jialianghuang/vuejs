<template>
  <az-drawer :visible="visible" :maskEnable="true" @onClose="handleClose" :title="nl('page_cart_add_on_items_title')">
    <div class="add-on-items">
      <div v-if="addType === 'promotion'" class="price-away">
        <span
          v-if="activityCartInfo"
          v-html="
            activityCartInfo.discountDesc
              ? activityCartInfo.discountDesc.replace(/var(--color-121212)/g, isBridal ? 'var(--color-121212)' : 'var(--color-121212)')
              : ''
          "
          class="txt"
        ></span>
      </div>
      <div v-else class="price-away">
        <template v-if="progressData && progressData.freeShippingDifference">
          <span class="price">{{ progressData.freeShippingDifferenceDisplay }}</span>
          <span>{{ nl('page_cart_add_on_items_away') }}</span>
        </template>
        <span v-else>{{ nl('page_cart_progress_free_shipping') }}</span>
      </div>
      <van-list v-model="loading" :finished="isFinished" :immediate-check="false" :offset="200" @load="onLoad" class="van-clearfix">
        <div class="goods-list">
          <div
            v-for="(item, index) in list"
            :key="index"
            v-track.view.click="{ common: [getBiParams('addon_items', item), getBiParams('addon_items' + (index + 1), item)] }"
            @click="clickGoods(item)"
            class="goods-item"
            role="article"
          >
            <div class="goods-img-box">
              <az-sticker :stickerInfo="item.stickers" :stickerClass="'product-item-icon'" :goodsId="item.goodsId"></az-sticker>
              <img :src="item.imgUrl" :alt="item.shownGoodsName" @load="imgLoad(item)" :style="getImgStyle(item)" class="goods-img" />
            </div>
            <p class="goods-name">{{ item.shownGoodsName }}</p>
            <div class="goods-price-add">
              <template v-if="item.hasShopPriceRange || item.hasLinePrice">
                <!-- AZWEB-21266 未选中sku时展示价格区间 -->
                <p v-if="item.hasShopPriceRange" class="current-price range-price">
                  {{ item.minShopPriceDisplay }} - {{ item.maxShopPriceDisplay }}
                </p>
                <p v-else class="current-price">{{ item.shopPriceDisplay }}</p>
                <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
              </template>
              <span v-else>{{ item.shopPriceDisplay }}</span>
              <az-icon
                v-track.view.click="{ common: getBiParams('addon_quickshop', item) }"
                @click.stop="clickAddToBag(item, index)"
                icon-class="iconicon_shop-new"
              />
            </div>
            <template v-if="cyberSaleInfo && item.catId != 3108">
              <cyber-sale v-if="!item.activityCouponCode" scene="addonitem"></cyber-sale>
              <az-with-code
                v-else-if="item.activityCouponCode"
                :code="item.activityCouponCode"
                :source="isSpecialCatId(item.catId) ? 'mini' : 'normal'"
                :other-style="false"
                class="activity-coupon-code"
              ></az-with-code>
            </template>
          </div>
        </div>
        <div slot="loading" class="load-more">
          <i class="loading-hint"></i>
          <span class="loading-txt">{{ nl('page_common_loading') }}</span>
        </div>
      </van-list>
    </div>
  </az-drawer>
</template>
<script>
import AzDrawer from '@/components/az-ui/AzDrawer'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import CyberSale from '@/components/list/CyberSale'
import AzWithCode from '@/components/az-ui/AzWithCode'
import { mapState } from 'vuex'

/**
 * 凑单商品列表展示组件
 */
export default {
  components: {
    AzDrawer,
    AzSticker,
    CyberSale,
    AzWithCode
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 进度相关数据
    progressData: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    },
    addType: {
      type: String,
      default: ''
    },
    activityCartInfo: {
      // 促销活动信息
      type: [Object, Array],
      default: () => {
        return {}
      }
    },
    goodsIds: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      defaultBackgroundImg: require('~/assets/images/goodsList/img-bg.png'),
      loading: false
    }
  },
  computed: {
    ...mapState({
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    // 列表加载更多是否已完成
    isFinished() {
      if (this.list.length > 0 && this.goodsIds.length > 0) {
        return this.list.length >= this.goodsIds.length
      }
      return false
    }
  },
  watch: {
    list(e) {
      if (e) {
        this.loading = false
      }
    }
  },
  methods: {
    onLoad() {
      if (!this.isFinished) {
        this.loading = true
        this.$emit('loadMore')
      }
    },
    getBiParams(el, e) {
      if (process.server) return
      const obj = {
        ec: this.addType === 'promotion' ? 'shopping_bag_progressbar' : 'shopping_bag',
        el,
        msg: JSON.stringify({
          cat_id: e.catId,
          cat_name: e.catName,
          goodsId: e.goodsId,
          color: e.color
        })
      }
      return obj
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    // 点击加购图标，弹出quickshop
    clickAddToBag(e, i) {
      const goodsStyleId = e.goodsStyleIdInfo && e.goodsStyleIdInfo[e.color] && e.goodsStyleIdInfo[e.color].goodsStyleId
      const params = {
        goods_id: e.goodsId,
        dress_type: e.dressType,
        goods_style_id: this.isSpecialCatId(e.catId) ? goodsStyleId : '',
        color: e.color,
        need_point: e.needPoint,
        index: i,
        fromDialog: this.addType === 'promotion' ? 'addOnItems_promotion' : 'addOnItems',
        catName: e.catName,
        catId: e.catId,
        hasRecommend: e.hasRecommend
      }
      this.setOrderSourceFlag('addon', true)
      this.setOrderSourceFlagWithGoodsId('addon_items', e.goodsId)
      this.$emit('onAddToBag', params)
    },
    clickGoods(e) {
      location.href = e.goodsUrl
    },
    getImgStyle({ _imgLoaded }) {
      if (_imgLoaded) return {}
      return {
        background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
      }
    },
    imgLoad(banner) {
      this.$set(banner, '_imgLoaded', true)
    }
  }
}
</script>
<style lang="less" scoped>
.add-on-items {
  width: 425px;
  .price-away {
    background: var(--color-f1e9e6);
    font-size: 13px;
    padding: 7px 15px;
    color: var(--color-121212);
    display: flex;
    align-items: center;
    line-height: 18px;
    .price {
      color: @theme-color;
      font-family: @font-family-600;
      margin-right: 3px;
    }
  }
  .goods {
    &-list {
      padding: 15px 25px 0px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      // max-height: calc(100vh - 97px);
      // overflow: auto;
    }
    &-item {
      margin-bottom: 15px;
      width: 168px;
      cursor: pointer;
    }
    &-img-box {
      width: 100%;
      position: relative;
      margin-bottom: 6px;
    }
    &-img {
      width: 100%;
      height: 232px;
      display: block;
      margin-bottom: 5px;
    }
    &-name {
      font-size: 12px;
      line-height: 16px;
      margin-bottom: 5px;
    }
    &-price-add {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
      line-height: 19px;
      font-family: @font-family-600;
      flex-wrap: wrap;
      position: relative;
      width: calc(100% - 20px);
      .az-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 0;
        fill: @theme-color;
      }
      .current-price {
        color: @theme-color;
        font-family: @font-family-600;
        font-size: 16px;
        line-height: 22px;
        display: inline-block;
      }
      .no-deal-price {
        color: var(--color-999999);
        text-decoration: line-through;
        font-size: 13px;
        margin-left: 5px;
        display: inline-block;
        font-family: @font-family-500;
        margin-right: 5px;
      }
    }
  }
  .van-clearfix {
    max-height: calc(100vh - 97px);
    overflow: auto;
  }
  /deep/ .van-list__loading {
    width: 100%;
    .load-more {
      text-align: center;
      padding: 20px 0;
      .loading-hint {
        display: inline-block;
        height: 20px;
        width: 20px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAP1BMVEUAAAD0KA/xJhHxJA7yJA7xJA7xJA7xJA7xJA7wJA7xJA7xJA7xJA7xJA7xJA7xJA3xJA7xJA7xJA7xJA7xJA5JCyllAAAAFXRSTlMACxdEI3NalDdn3LyvLstPoveIgOl7Sm+EAAABiklEQVRIx9XS0W7kIAxAUWyDwckAIfD/37owUyndbbMJrtSq92UeoiMbGHMWRqKciSKamSw5v23b462d7T0HVIc76NrbGK8h+153vgozi9u39ZW7wOSfSYB3pyY3JqdV4ByiG86FTw6xrSmlx+mZ4757X8PJPo/Uo5OPe4/MaTwGy6dfOvz/VeAY7OGjrPvOcHH9PqXFf9i21krmMrcsi/vnhg55bfPfr1Irm1v5bqM5ElcF7lFYl2WF46DOOTA3w/TuuNBlMLeTvjIeQ8XcD9LS9mOoNRPl1t7GBufYTLW29jotP4dOjk2mhyJi5oKltfG2UYTMZL4VN6aL2FnKpTzGjwjMUiyl9b1F2Ey3lILjlvI8XUshY5lpnm6l8KBhnvpSxETmOE/3UpySjo6Fv5UiMykp5JyNsk5BSUPOqL2nnKP2sERklHWq3pgoaDf+nWPVfwsK6rcNIVilxW7xB6wNMVqtjXqLnVrQWbAj+IJFHcanRQAlxhH0xiJza7/owIrpMOBrsK4L9wckTA/GBoy0fQAAAABJRU5ErkJggg==)
          no-repeat 0 0;
        background-size: 100% 100%;
        animation: rotate 1s infinite;
      }
      .loading-txt {
        padding-left: 12px;
        font-size: 16px;
        color: var(--color-121212);
        line-height: 20px;
        display: inline-block;
      }
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }
}
</style>
