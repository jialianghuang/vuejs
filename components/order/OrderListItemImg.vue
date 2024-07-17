<template>
  <div class="order-list-item-img">
    <div v-swiper:baseSwiper="swiperOption" class="order-img-swiper">
      <div class="swiper-wrapper">
        <div v-for="(imgItem, imgIndex) in list" :key="imgIndex" :style="{ width: '57px' }" class="swiper-slide">
          <a :href="countryUrl(imgHref)" :aria-label="imgItem.goodsName" target="_blank" class="img-link">
            <span style="display: none;">{{ imgItem.goodsName }}</span>
            <az-sticker
              v-if="imgItem.stickers && Object.keys(imgItem.stickers).length"
              :stickerInfo="imgItem.stickers"
              :sticker-class="`product-item-icon-mini`"
              :goodsId="imgItem.goodsId"
            ></az-sticker>
            <img :alt="imgItem.goodsName" :data-src="addWebpSuffix(imgItem.goodsThumb)" :src="defaultImg" class="swiper-img lazyload" />
            <span v-if="imgItem.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
          </a>
        </div>
      </div>
    </div>
    <div v-if="list.length > 2" class="img-arrow">
      <a
        :class="[`${classKey}-button-prev`]"
        href="javascript:void(0);"
        aria-label="swiper-button-prev"
        class="prev-arraw swiper-button-prev order-item-swiper-button-prev"
      >
        <span style="display: none">swiper-button-prev</span>
        <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
      </a>
      <a
        :class="[`${classKey}-button-next`]"
        href="javascript:void(0);"
        aria-label="swiper-button-next"
        class="next-arraw swiper-button-next order-item-swiper-button-next"
      >
        <span style="display: none">swiper-button-next</span>
        <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
      </a>
    </div>
  </div>
</template>

<script>
import AzSticker from '@/components/az-ui/Sticker/AzSticker'

export default {
  name: 'OrderListItemImg',
  components: { AzSticker },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    imgHref: {
      type: String,
      default() {
        return ''
      }
    },
    classKey: {
      type: [String, Number],
      default() {
        return `${Math.random()}`.substr(2, 6)
      }
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 2,
        spaceBetween: 10,
        slidesPerGroup: 2,
        simulateTouch: false,
        loopFillGroupWithBlank: true,
        speed: 400,
        navigation: {
          nextEl: '.order-item-swiper-button-next',
          prevEl: '.order-item-swiper-button-prev'
        }
      },
      defaultImg: require('~/assets/images/default_img.jpg')
    }
  },
  created() {
    // 定义特殊class名，防止公用class类名出现bug
    this.swiperOption.navigation.nextEl = `.${this.classKey}-button-next`
    this.swiperOption.navigation.prevEl = `.${this.classKey}-button-prev`
  }
}
</script>

<style lang="less" scoped>
@imgWidth: 57px;
@imgHeight: 80px;
.order-list-item-img {
  position: relative;
  width: @imgWidth * 2 + 10px;
  height: @imgHeight;
  margin: 0 10px 6px;
  .order-img-swiper {
    width: @imgWidth * 2 + 10px;
    overflow: hidden;
  }
  .swiper-slide {
    width: @imgWidth;
    height: @imgHeight;
    margin-right: 10px;
    .img-link {
      display: block;
    }
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
    white-space: nowrap;
  }
  .swiper-img {
    width: @imgWidth;
    height: @imgHeight;
    vertical-align: middle;
  }
}

.prev-arraw,
.next-arraw {
  display: inline-block;
  cursor: pointer;
  background-image: none;
  width: auto;
  height: auto;
  position: static;
  z-index: unset;
  &.swiper-button-disabled {
    cursor: default;
  }
  &:focus {
    outline: none;
  }
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}
.prev-arraw {
  left: -18px;
}
.next-arraw {
  right: -18px;
}
</style>
