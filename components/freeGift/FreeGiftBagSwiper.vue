<template>
  <div
    v-if="selectedGiftGoodsList && selectedGiftGoodsList.length"
    v-track.view="setPoint('select free gift', 'selected', 'view')"
    class="free-gift-bag-swipper content"
  >
    <a
      v-if="selectedGiftGoodsList.length > 3"
      @click="handlePrev"
      href="javascript:void(0)"
      aria-label="swiper-button-prev"
      class="prev-arraw swiper-button-prev swiper-button-black swiper-button-prev-bag"
    >
      <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
    </a>
    <div
      ref="fGBagSwiper"
      v-swiper:[dynamicSwiperName]="fGBagSwiperOption"
      :instance-name="dynamicSwiperName"
      class="swiper-container free-gift-bag-swipper-container"
    >
      <div class="swiper-wrapper">
        <div v-for="(item, index) in selectedGiftGoodsList" :key="`${index}_${item.goodsId}`" class="swiper-slide ">
          <div class="item">
            <div class="left">
              <img
                :src="require('~/assets/images/default_img.jpg')"
                :data-src="addWebpSuffix(item.imgUrl)"
                :alt="item.shownGoodsName"
                data-expand="1"
                class="lazyload goods-img"
              />
            </div>
            <div class="right">
              <div class="info">
                <div class="goods-name">
                  <p class="name-txt">{{ item.shownGoodsName }}</p>
                  <span class="gift-txt"> ({{ nl('page_cart_free_gift') }}) </span>
                </div>
                <div v-if="item.formatStyles && item.formatStyles.color" class="goods-color">
                  <span>{{ item.formatStyles.color.name }}:</span>
                  <span>{{ item.formatStyles.color.value }}</span>
                </div>
                <div v-if="item.formatStyles && item.formatStyles.size" class="goods-size">
                  {{ setSize(item) }}
                </div>
                <!-- 配件定制 -->
                <div v-if="item.styles && item.styles.customNameList" class="customization">
                  <p v-if="item.styles.customNameList.line1">{{ nl('page_common_line_one') }}: {{ item.styles.customNameList.line1 }}</p>
                  <p v-if="item.styles.customNameList.line2">{{ nl('page_common_line_two') }}: {{ item.styles.customNameList.line2 }}</p>
                </div>
              </div>
              <div class="price-quantity">
                <div class="goods-price">
                  <p class="current-price">{{ item.shopPriceDisplay }}</p>
                  <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
                </div>
                <div class="goods-quantity">
                  <span @click="handleSub(item)" class="sub">
                    <az-icon icon-class="icon-minus" class="icon"></az-icon>
                  </span>
                  <span class="quantity">{{ item.goodsNumber }}</span>
                  <span
                    @click="handleAdd(item)"
                    :class="{ disable: singleActivityLimited[item.giftActivityId] || activityLimited || stockGoodsNumberLimited(item) }"
                    class="add"
                  >
                    <az-icon icon-class="icon-a-addtobag" class="icon"></az-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a
      v-if="selectedGiftGoodsList.length > 3"
      @click="handleNext"
      href="javascript:void(0)"
      aria-label="swiper-button-next"
      class="next-arraw swiper-button-next swiper-button-black swiper-button-next-bag"
    >
      <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FreeGiftBagSwiper',
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
    }
  },
  data() {
    return {
      dynamicSwiperName: 'fGBagSwiper',
      fGBagSwiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        slidesPerGroupAuto: true,
        observer: true,
        observeParents: true,
        slidesPerGroup: 3,
        navigation: {
          nextEl: `.swiper-button-next-bag`,
          prevEl: `.swiper-button-prev-bag`
        }
      }
    }
  },
  computed: {
    ...mapState('cart', ['giftActivityInfo', 'hasGiftActivity']),
    selectedGiftGoodsList() {
      return (this.giftActivityInfo && this.giftActivityInfo.selectedGiftGoodsList) || []
    },
    singleActivityLimited() {
      // 单个活动是否到达赠品上限
      const singleActivityLimited = {}
      this.giftActivityInfo &&
        this.giftActivityInfo.giftActivity &&
        this.giftActivityInfo.giftActivity.forEach((item) => {
          singleActivityLimited[item.activityId] = item.giftNumber === item.selectedNumber
        })
      return singleActivityLimited
    },
    activityLimited() {
      // 总活动是否到达赠品上限
      return this.giftActivityInfo.selectedNumber == this.giftActivityInfo.giftNumber
    }
  },
  watch: {
    selectedGiftGoodsList: {
      handler(newVal) {
        this.$nextTick(() => {
          if (this.fGBagSwiper) {
            if (Object.keys(this.selectedGiftGoodsList).length > 3) {
              this.fGBagSwiper.updateSlides()
              this.fGBagSwiper.update()
            }
          }
        })
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    // 自己写轮播左右切换功能，因为这里遇到了一个问题，动态加载数据的时候，左右切换按钮失效了，没找到办法解决，所以先自己写
    handlePrev(a) {
      this.fGBagSwiper.slidePrev()
    },
    handleNext() {
      this.fGBagSwiper.slideNext()
    },
    handleAdd(item) {
      if (this.singleActivityLimited[item.giftActivityId] || this.activityLimited || this.stockGoodsNumberLimited(item)) return false
      this.handleUpdate(item, 'add')
    },
    handleSub(item) {
      this.handleUpdate(item, 'delete')
    },
    handleUpdate(item = {}, action) {
      this.setPoint('select free gift', 'change quantity', 'click')
      this.$store.commit('cart/setLoadingFlag', true)
      const formData = {}
      this.$set(formData, 'action', action)
      this.$set(formData, 'goods_number', 1)
      this.$set(formData, 'gift_activity_id', item.giftActivityId)
      this.$set(formData, 'goods_id', item.goodsId)
      this.$set(formData, 'styles', item.styles)
      this.$set(formData, 'dress_type', item.dressType)
      this.$axios
        .$post(`/1.0/gift/goods/select`, formData)
        .then((res) => {
          if (res.code == 0) {
            // 更新赠品弹窗信息
            const updataGiftActivityInfo = res.data
            this.$store.commit('cart/setUpdataGiftActivityInfo', updataGiftActivityInfo)
            if (this.selectedGiftGoodsList && !this.selectedGiftGoodsList.length) {
              this.$emit('setHasClear')
            }
          } else if (res.code == 800008) {
            this.$store.commit('cart/setCartErrorMsg', (res && res.msg) || 'Error')
          } else {
            this.$emit('refreshGiftActivity')
            this.$store.commit('cart/setCartErrorMsg', (res && res.msg) || 'Error')
          }
        })
        .catch((error) => {
          console.log('selectError:', error)
          this.$store.commit('cart/setCartErrorMsg', (error && error.msg) || 'Error')
        })
        .finally(() => {
          this.$store.commit('cart/setLoadingFlag', false)
        })
    },
    setSize(item) {
      if (item.formatStyles && item.formatStyles.size) {
        if (item.formatStyles.size.CustomSize) {
          return item.formatStyles.size.CustomSize.name + ': ' + item.formatStyles.size.CustomSize.value
        } else if (item.formatStyles.size.standardSize) {
          return this.nl('page_common_size') + ': ' + item.formatStyles.size.standardSize.name
        }
      }
      return ''
    },
    stockGoodsNumberLimited(item) {
      return item.isStockGoods && item.maxStockGoodsNumber <= item.goodsNumber
    }
  }
}
</script>

<style lang="less" scoped>
.free-gift-bag-swipper {
  position: relative;
  width: 893px;
  padding: 15px 29px;
  box-sizing: border-box;
  .swiper-container {
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .swiper-slide {
    display: flex;
    justify-content: flex-start;
    // height: 140px;
    width: 272px;
    .item {
      display: flex;
      .left {
        .goods-img {
          vertical-align: middle;
          width: 67px;
          height: 92px;
        }
      }
      .right {
        margin-left: 10px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .info {
          font-size: 12px;
          line-height: 16px;
          .name-txt {
            width: 195px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .gift-txt {
            color: var(--color-121212);
          }
        }
        .goods-color,
        .goods-size {
          width: 195px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .price-quantity {
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          .goods-price {
            display: flex;
            margin-top: 2px;
            .current-price {
              color: var(--color-121212);
              font-family: @font-family-600;
              font-size: 14px;
              line-height: 19px;
              display: inline-block;
            }
            .no-deal-price {
              color: var(--color-999999);
              text-decoration: line-through;
              font-size: 12px;
              line-height: 19px;
              margin-left: 5px;
              display: inline-block;
            }
          }
          .goods-quantity {
            // margin-right: 5px;
            display: flex;
            align-items: center;
            .sub,
            .add {
              cursor: pointer;
              &.disable {
                cursor: default;
                .icon {
                  color: #ccc;
                  fill: currentColor;
                }
              }
            }
            .icon {
              width: 20px;
              height: 20px;
              vertical-align: middle;
              color: var(--color-121212);
              fill: currentColor;
            }
            .quantity {
              margin: 0 10px;
              font-size: 14px;
              font-family: @font-family-600;
            }
          }
        }
      }
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
</style>
