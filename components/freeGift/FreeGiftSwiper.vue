<template>
  <div class="free-gift-module-conent">
    <div class="title-box">
      <div class="left">
        <az-icon icon-class="icon-gift1" class="icon title-img"></az-icon>
        <div class="txt">{{ moduleItem.activityDescription && moduleItem.activityDescription.text }}</div>
      </div>
      <div :class="{ disabled: limited }" class="right">{{ moduleItem.selectedNumber }}/{{ moduleItem.giftNumber }}</div>
    </div>
    <div :id="`free-gift-swipper-${moduleIndex}`" :ref="`free-gift-swipper-${moduleIndex}`" class="free-gift-swipper content">
      <a
        v-if="moduleItem.activityGiftGoods.length > 9"
        :class="[`swiper-button-prev-${moduleIndex}`]"
        href="javascript:void(0)"
        aria-label="swiper-button-prev"
        class="prev-arraw swiper-button-prev swiper-button-black"
      >
        <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
      </a>
      <div
        v-swiper:[dynamicSwiperName]="fGSwiperOption"
        :instance-name="dynamicSwiperName"
        :class="[`swiper-container-${moduleItem.activityId}`]"
        :ref="`freeGiftModule-${moduleItem.activityId}`"
        class="swiper-container"
      >
        <div :class="[`swiper-wrapper-${moduleItem.activityId}`]" :ref="[`swiper-wrapper-${moduleItem.activityId}`]" class="swiper-wrapper">
          <div v-for="(item, index) in moduleItem.activityGiftGoods" :key="`${index}_${item.goodsId}`" class="swiper-slide ">
            <div
              @click="handleQuickShop(item, moduleItem.activityId, index)"
              :class="{ disabled: limited || !needAction }"
              v-track.view="setPoint('select free gift', 'product', 'view')"
              class="item"
            >
              <div class="img-box">
                <img
                  :src="require('~/assets/images/default_img.jpg')"
                  :data-src="addWebpSuffix(item.imgUrl)"
                  :alt="item.shownGoodsName"
                  data-expand="1"
                  class="lazyload goods-img"
                />
                <div
                  v-if="needAction"
                  :id="`add-gift-icon-${moduleIndex}-${index}`"
                  :ref="`add-gift-icon-${moduleIndex}-${index}`"
                  @click="handleNotice(index, 'click')"
                  @mouseenter="handleNotice(index, 'enter')"
                  @mouseleave="handleNotice(index, 'leave')"
                  class="add-icon-box"
                >
                  <az-icon v-if="limited" icon-class="icon-a-addtobag-no" class="add-icon"></az-icon>
                  <az-icon v-else icon-class="icon-a-addtobag-yes" class="add-icon"></az-icon>
                </div>
              </div>
              <div class="goods-price">
                <p class="current-price">{{ item.shopPriceDisplay }}</p>
                <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a
        v-if="moduleItem.activityGiftGoods.length > 9"
        :class="[`swiper-button-next-${moduleIndex}`]"
        href="javascript:void(0)"
        aria-label="swiper-button-next"
        class="next-arraw swiper-button-next swiper-button-black"
      >
        <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
      </a>
    </div>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'

export default {
  name: 'FreeGiftSwiper',
  mixins: [colorHex],
  props: {
    moduleItem: {
      type: Object,
      default() {
        return {}
      }
    },
    moduleIndex: {
      type: Number,
      default: 0
    },
    needAction: {
      type: Boolean,
      default: true // 是否需要点击 quickshop 功能，从商品详情页过来不需要
    }
  },
  data() {
    return {
      dynamicSwiperName: this.moduleIndex + '',
      fGSwiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 15,
        slidesPerGroupAuto: true,
        slidesPerGroup: 10,
        autoplay: false,
        navigation: {
          nextEl: `.swiper-button-next-${this.moduleIndex}`,
          prevEl: `.swiper-button-prev-${this.moduleIndex}`
        }
      },
      limitedNotice: false,
      limitedNoticeLeft: 100,
      currentIndex: 0
    }
  },
  computed: {
    limited() {
      return this.moduleItem.giftNumber == this.moduleItem.selectedNumber
    }
  },
  created() {},
  methods: {
    handleQuickShop(item, activityId, index) {
      if (this.limited) return false
      this.setPoint('select free gift', 'product', 'click')
      // 14451 需求打点
      this.setPoint('addtobag', 'freegift', 'click', {
        index,
        goodsId: item.goodsId,
        color: item.colorReal,
        cat_id: item.catId
      })
      const params = {
        goods_id: item.goodsId,
        dress_type: item.dressType,
        goods_style_id: this.isSpecialCatId(item.catId) ? item.goodsStyleIdInfo[item.color].goodsStyleId : '',
        color: item.color,
        fromDialog: 'cartFreeGift', // todo 记得改
        catName: item.catName,
        gift_activity_id: activityId
      }
      this.$emit('quickShop', params)
      this.$store.commit('cart/setLoadingFlag', true)
      this.$store.commit('quickshop/setQuickShopDialog', true)
    },
    handleNotice(index, type) {
      this.$emit('handleNotice', {
        moduleIndex: this.moduleIndex,
        index,
        type,
        limited: this.limited
      })
    }
  }
}
</script>

<style lang="less" scoped>
.free-gift-module-conent {
  margin-bottom: 15px;
  .title-box {
    min-height: 18px;
    padding: 6px 0;
    background: var(--color-f1e9e6);
    line-height: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-121212);
    font-size: 13px;
    .left {
      height: 100%;
      display: flex;
      position: relative;
      padding-left: 65px;
      .title-img {
        width: 55px;
        height: 30px;
        vertical-align: middle;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
      }
    }
    .right {
      padding-right: 10px;
      &.disabled {
        color: var(--color-121212);
      }
    }
  }
  .free-gift-swipper {
    position: relative;
    width: 893px;
    height: 164px;
    padding: 20px 39px;
    box-sizing: border-box;
    .swiper-container {
      padding-bottom: 0;
      margin-bottom: 0;
    }
    .swiper-slide {
      display: flex;
      justify-content: flex-start;
      height: 140px;
      width: 68px;
      .item {
        width: 68px;
        cursor: pointer;
        &.disabled {
          cursor: default;
        }
        .img-box {
          position: relative;
          width: 100%;
          height: 97px;
          .add-icon-box {
            position: absolute;
            right: 5px;
            bottom: 5px;
            width: 24px;
            height: 24px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
            .add-icon {
              width: 24px;
              height: 24px;
            }
          }
        }
        .goods-img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .goods-price {
          // display: flex;
          // justify-content: center;
          text-align: center;
          margin-top: 5px;
          .current-price {
            color: var(--color-121212);
            font-family: @font-family-600;
            font-size: 14px;
            line-height: 19px;
            // display: inline-block;
          }
          .no-deal-price {
            color: var(--color-999999);
            text-decoration: line-through;
            font-size: 12px;
            line-height: 16px;
            margin-top: 4px;
            // display: inline-block;
          }
        }
      }
    }
    .limited-notice-tips {
      width: 286px;
      position: absolute;
      bottom: 46px;
      transform: translate(-50%, 100%);
      background: #fee0e0;
      border: 1px solid var(--color-121212);
      box-sizing: border-box;
      border-radius: 3px;
      z-index: 1;
      padding: 6px 8px;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-121212);
      /deep/ a {
        color: var(--color-121212);
        text-decoration: underline;
      }
      .icon {
        width: 15px;
        height: 15px;
        float: left;
      }
      .txt {
        margin-left: 23px;
      }
      &:before {
        content: '';
        position: absolute;
        border: 1px solid var(--color-121212);
        border-right: transparent;
        border-bottom: transparent;
        top: -1px;
        background: #fee0e0;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 9px;
        height: 9px;
        box-sizing: border-box;
      }
    }
    .swiper-button {
      width: 11px;
      height: 18px;
      margin-top: -9px;
      background-size: 11px 18px;
    }
    .prev-arraw,
    .next-arraw {
      position: absolute;
      display: block;
      top: 50%;
      width: 13px;
      height: 13px;
      margin-top: -6px;
      .arraw-icon {
        width: 13px;
        height: 13px;
      }
      &.swiper-button-disabled .arraw-icon {
        fill: var(--color-999999);
      }
      &.active {
        cursor: pointer;
      }
      &:focus {
        outline: none;
      }
    }
    .prev-arraw {
      left: 13px;
    }
    .next-arraw {
      right: 13px;
    }
    /deep/.swiper-button-prev,
    /deep/.swiper-button-next {
      background-image: none;
      outline: none;
    }
  }
}
</style>
