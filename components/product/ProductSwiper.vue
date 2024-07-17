<template>
  <div :class="hideMixTitle" class="product-swiper">
    <div :class="['product-swiper-container', { 'no-padding': !showArrowIcon }]">
      <a
        v-show="prodList.length > slidesPerView && showArrowIcon"
        :class="prevEl"
        @click="_handlePrevOrNext('prev')"
        v-track.view.click="getBiParams(leftArrowEvent)"
        href="javascript:void(0)"
        class="prev-arraw swiper-button-prev"
        aria-label="swiper-button-prev"
      >
        <span style="display: none">swiper-button-prev</span>
        <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
      </a>
      <slot></slot>
      <a
        v-show="prodList.length > slidesPerView && showArrowIcon"
        :class="nextEl"
        @click="_handlePrevOrNext('next')"
        v-track.view.click="getBiParams(rightArrowEvent)"
        href="javascript:void(0)"
        class="next-arraw swiper-button-next"
        aria-label="swiper-button-next"
      >
        <div v-if="loadMoreLoading" class="loading-icon"></div>
        <template v-else>
          <span style="display: none">swiper-button-next</span>
          <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
        </template>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductSwiper',
  props: {
    prodList: {
      type: Array,
      default() {
        return []
      }
    },
    hideMixTitle: {
      type: String,
      default() {
        return ''
      }
    },
    nextEl: {
      type: String,
      default() {
        return ''
      }
    },
    prevEl: {
      type: String,
      default() {
        return ''
      }
    },
    slidesPerView: {
      type: Number,
      default: 6
    },
    leftArrowEvent: {
      type: Object,
      default() {
        return {}
      }
    },
    rightArrowEvent: {
      type: Object,
      default() {
        return {}
      }
    },
    showArrowIcon: {
      type: Boolean,
      default: true
    },
    loadMoreLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 前进后退点击事件，将当前点击项传给父组件，让父组件知道当前执行的操作
     */
    _handlePrevOrNext(e) {
      this.$emit('getPrevOrNext', e)
    },
    getBiParams(ev) {
      if (process.server) return
      if (!Object.keys(ev).length) return
      const { ec, el } = ev
      return {
        common: {
          ec,
          el
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.product-swiper {
  .product-swiper-container {
    padding: 0 20px;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    transition: padding 0.3s ease;
    &.no-padding {
      padding: 0 !important;
    }
    .arraw-icon {
      width: 18px;
      height: 18px;
    }
    .prev-arraw,
    .next-arraw {
      position: absolute;
      display: block;
      top: 46%;
      width: auto;
      height: auto;
      background: none;
    }
    .prev-arraw {
      left: -4px;
    }
    .next-arraw {
      right: -4px;
    }
  }
  .goods-item {
    cursor: pointer;
    display: inline-block;
    width: auto;
    .goods-item-a {
      color: var(--color-121212);
      font-size: 13px;
      .img-box {
        width: 191px;
        position: relative;
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
          width: 191px;
          height: auto;
          vertical-align: top;
          margin-bottom: 6px;
        }
      }
      .goods-name {
        width: 179px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: auto;
        font-family: @font-family-500;
        line-height: 19px;
      }
      .goods-price {
        line-height: 19px;
        text-align: center;
        &.goods-price-box {
          font-size: 0;
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
        }
      }
    }
  }
  .loading-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url('~assets/images/loading.png') center center no-repeat;
    background-size: 100% 100%;
  }
}
#product_customer_photo {
  .product-swiper {
    .prev-arraw,
    .next-arraw {
      top: 57%;
    }
  }
}
</style>
