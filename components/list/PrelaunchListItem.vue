<template>
  <div class="prelaunch-goods-item">
    <div @mouseenter="handleQuickShop(true)" @mouseleave="handleQuickShop(false)" class="goods-item-pic">
      <az-sticker :stickerInfo="item.stickers" :sticker-class="`prelaunch-item-icon`" :goodsId="item.goodsId"></az-sticker>
      <a
        :href="countryUrl(item.goodsUrl)"
        :target="item.goodsUrl ? '_blank' : '_self'"
        v-track.viewOnce.click="{ id: `productItem_${index}`, common: getBiParams(`${index + 1}_image`) }"
      >
        <img
          :class="{ show: !showBackImg }"
          :data-src="addWebpSuffix(item.imgUrl)"
          :alt="`front ${item.shownGoodsName}`"
          :src="require('~/assets/images/default_img.jpg')"
          class="goods-img lazyload"
          style="color: #f6f6f6"
        />
        <img
          :class="{ show: showBackImg }"
          :src="addWebpSuffix(item.backImgUrl)"
          :alt="`back ${item.shownGoodsName}`"
          class="goods-img back-goods-img"
          style="color: #f6f6f6"
        />
      </a>

      <div
        :class="{ show: quickShopBtnShow }"
        @click.stop="showQuickShopDialog"
        v-if="item.isOnSale"
        v-track.view.click="{ common: getBiParams(`${index + 1}_access`) }"
        class="quick-shop"
      >
        <p class="quick-shop-text">
          {{ activityStatus === 'prelaunch' ? nl('page_preorder_early_access') : nl('page_showroom_quick_shop') }}
        </p>
      </div>
    </div>
    <template v-if="item.preSaleGoodsProgress">
      <div class="goods-name">
        <a
          v-track.click="{ common: getBiParams(`${index + 1}_name`) }"
          :href="countryUrl(item.goodsUrl)"
          :target="item.goodsUrl ? '_blank' : '_self'"
          >{{ item.shownGoodsName }}</a
        >
      </div>
      <div class="goods-info mt8">
        <div class="goods-progress">
          <prelaunch-goods-progress :preSaleGoodsProgress="item.preSaleGoodsProgress"></prelaunch-goods-progress>
        </div>
        <template v-if="item.hasLinePrice">
          <div class="goods-price goods-price-box">
            <p class="current-price">{{ item.shopPriceDisplay }}</p>
            <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
          </div>
        </template>
        <template v-else>
          <div class="goods-price">{{ item.shopPriceDisplay }}</div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="goods-info">
        <div class="goods-name">
          <a
            v-track.click="{ common: getBiParams(`${index + 1}_name`) }"
            :href="countryUrl(item.goodsUrl)"
            :target="item.goodsUrl ? '_blank' : '_self'"
            >{{ item.shownGoodsName }}</a
          >
        </div>
        <template v-if="item.hasLinePrice">
          <div class="goods-price goods-price-box">
            <p class="current-price">{{ item.shopPriceDisplay }}</p>
            <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
          </div>
        </template>
        <template v-else>
          <div class="goods-price">{{ item.shopPriceDisplay }}</div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import PrelaunchGoodsProgress from '@/components/promotion/PrelaunchGoodsProgress'

export default {
  name: 'PrelaunchListItem',
  languageKeys: [...AzSticker.languageKeys, ...PrelaunchGoodsProgress.languageKeys],
  components: { AzSticker, PrelaunchGoodsProgress },
  props: {
    item: {
      type: Object,
      default() {
        return () => {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    activityStatus: {
      type: String,
      default: ''
    },
    trackEc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showBackImg: false,
      quickShopBtnShow: false,
      progressLeft: -100 // 进度条左移量
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handleQuickShop(quickShopBtnShow) {
      this.showBackImg = quickShopBtnShow
      this.quickShopBtnShow = quickShopBtnShow
    },
    showQuickShopDialog() {
      const params = {
        goods_id: this.item.goodsId,
        dress_type: this.item.dressType,
        color: this.item.color
      }

      this.$emit('quickShop', params)
    },
    getBiParams(el) {
      if (process.server || !this.trackEc) return
      return {
        ec: this.trackEc,
        el
      }
    }
  }
}
</script>

<style lang="less" scoped>
.prelaunch-goods-item {
  width: 100%;
  .goods-item-pic {
    color: var(--color-121212);
    font-size: 13px;
    width: 100%;
    position: relative;
    margin-bottom: 10px;
    .goods-img {
      width: 100%;
      height: unset;
      width: 100%;
      vertical-align: middle;
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
    }
    .back-goods-img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .quick-shop {
    z-index: 8;
    background: rgba(255, 255, 255, 0.7);
    height: 50px;
    line-height: 50px;
    width: 300px;
    box-sizing: border-box;
    position: absolute;
    color: var(--color-121212);
    bottom: 50%;
    left: 50%;
    cursor: pointer;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05);
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: var(--color-121212);
    text-transform: uppercase;
    text-align: center;
    &.show {
      display: block;
    }
  }

  .goods-name {
    color: var(--color-121212);
    font-size: 18px;
    line-height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: var(--color-121212);
    a {
      color: var(--color-121212);
    }
  }
  .mt8 {
    margin-top: 8px;
  }
  .goods-info {
    display: flex;
    align-items: baseline;
    .goods-name {
      flex: 1;
    }
    .goods-progress {
      flex: 1;
    }
    .goods-price {
      display: inline-block;
      font-size: 24px;
      line-height: 24px;
      text-align: center;
      color: var(--color-121212);
      padding-left: 20px;
      font-family: @font-family-600;
      &.goods-price-box {
        font-size: 0;
      }
      .current-price {
        font-family: @font-family-600;
        font-size: 24px;
        line-height: 24px;
        display: inline-block;
        color: @theme-color;
      }
      .no-deal-price {
        color: var(--color-999999);
        text-decoration: line-through;
        font-size: 16px;
        line-height: 16px;
        margin-left: 5px;
        display: inline-block;
        font-family: @font-family-500;
      }
    }
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
</style>
