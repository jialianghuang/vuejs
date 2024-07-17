<template>
  <div class="product-list-swiper">
    <h3 v-if="title" class="list_title">{{ title }}</h3>
    <div class="product-swiper-container">
      <a
        v-if="prodList.length > swiperCount"
        href="javascript:void(0)"
        aria-label="swiper-button-prev"
        class="prev-arraw swiper-button-prev swiper-button-black"
      >
        <!-- <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" /> -->
      </a>
      <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
        <div class="swiper-wrapper product-swiper-viewport">
          <div v-for="(item, index) in prodList" :title="item.shownGoodsName" :key="index" class="swiper-slide goods-item">
            <a
              v-if="item.shopAll"
              :href="countryUrl(item.linkUrl)"
              :data-datalayer-category="item.eventCategory"
              :data-datalayer-label="item.eventName"
              :class="{ need_datalayer: item.eventName && item.eventCategory, ['shop-all-' + swiperCount]: true }"
              class="slide_mask shop_all_box"
              target="_blank"
            >
              <div class="shop_all">
                {{ nl('page_header_sale_shop_all') }}
                <hr />
              </div>
            </a>
            <a
              v-else
              :href="countryUrl(item.linkUrl)"
              :data-datalayer-category="item.eventCategory"
              :data-datalayer-label="item.eventName"
              :class="{
                hover_theme: hasHoverStyle,
                need_datalayer: item.eventName && item.eventCategory
              }"
              class="slide_mask"
              target="_blank"
            >
              <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt || item.title" />
              <span v-if="item.title" class="item-title">{{ item.title }}</span>
              <span>{{ item.text }}</span>
              <!-- 打折商品价格划线-->
              <div v-if="item.shopPrice != item.noDealPrice" style="font-size: 0;">
                <span class="shop-price">{{ item.shopPrice }}</span>
                <span class="no-deal-price">{{ item.noDealPrice }}</span>
              </div>
              <span v-else>{{ item.shopPrice }}</span>
            </a>
          </div>
          <template v-if="shopAll">
            <div v-if="typeof shopAll == 'string'" class="swiper-slide goods-item">
              <a :href="countryUrl(shopAll)" :class="{ ['shop-all-' + swiperCount]: true }" class="slide_mask shop_all_box" target="_blank">
                <div class="shop_all">
                  {{ nl('page_header_sale_shop_all') }}
                  <hr />
                </div>
              </a>
            </div>
            <div v-else-if="typeof shopAll == 'object'" class="swiper-slide goods-item">
              <a
                :href="countryUrl(shopAll.linkUrl)"
                :data-datalayer-category="shopAll.eventCategory"
                :data-datalayer-label="shopAll.eventName"
                :class="{ need_datalayer: shopAll.eventName && shopAll.eventCategory, ['shop-all-' + swiperCount]: true }"
                class="slide_mask shop_all_box"
                target="_blank"
              >
                <div class="shop_all">
                  {{ nl('page_header_sale_shop_all') }}
                  <hr />
                </div>
              </a>
            </div>
          </template>
        </div>
      </div>
      <a
        v-if="prodList.length > swiperCount"
        href="javascript:void(0)"
        aria-label="swiper-button-next"
        class="next-arraw swiper-button-next swiper-button-black"
      >
        <!-- <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" /> -->
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductListSwiper',
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    prodList: {
      type: Array,
      default() {
        return []
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
    shopAll: {
      type: [String, Object],
      default: ''
    },
    swiperCount: {
      type: Number,
      default: 4
    },
    hasHoverStyle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      MPSwiperOption: {
        slidesPerView: 4,
        spaceBetween: '1.16%',
        slidesPerGroup: 4,
        simulateTouch: false,
        loop: true,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  created() {
    this.MPSwiperOption.slidesPerView = this.swiperCount
    this.MPSwiperOption.slidesPerGroup = this.swiperCount
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.list_title {
  font-size: 24px;
  font-family: @font-family-600;
  color: var(--color-121212);
  line-height: 64px;
  font-weight: normal;
}
.product-swiper-container {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  .arraw-icon {
    width: 18px;
    height: 18px;
  }
  .prev-arraw,
  .next-arraw {
    position: absolute;
    display: block;
    top: 46%;
    width: 11px;
    height: 18px;
    margin-top: -9px;
    background-size: 11px 18px;
    &.active {
      cursor: pointer;
    }
    &:focus {
      outline: none;
    }
  }
  .prev-arraw {
    left: -30px;
  }
  .next-arraw {
    right: -30px;
  }
}
.swiper-slide {
  display: flex;
  justify-content: flex-start;
  cursor: default;
  .slide_mask {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 270px;
    margin-right: 17px;
    img {
      width: 100%;
      height: auto;
      margin-bottom: 20px;
    }
    &:last-child {
      margin-right: 0;
    }
    span {
      color: var(--color-121212);
    }
    .item-title {
      font-family: @font-family-600;
    }
    .shop-price {
      color: var(--color-121212);
      font-family: @font-family-600;
      font-size: 16px;
      line-height: 22px;
    }
    .no-deal-price {
      color: var(--color-999999);
      text-decoration: line-through;
      font-size: 13px;
      margin-left: 5px;
    }
    &.hover_theme:hover {
      span {
        color: var(--color-121212);
      }
    }
  }
}
.shop_all_box {
  div.shop_all {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f6f6f6;
    font: bold 14px @font-family-500, sans-serif;
    color: var(--color-121212);
    width: 270px;
    height: 374px;
    font-size: 25px;
    hr {
      width: 118px;
      height: 2px;
      background-color: var(--color-121212);
      margin-top: 2px;
      border: none;
    }
  }
  &.shop-all-5 {
    div.shop_all {
      width: 215.9px;
      height: 298.5px;
      font-size: 14px;
      hr {
        width: 68px;
      }
    }
  }
  &.shop-all-6 {
    div.shop_all {
      width: 177.7px;
      height: 245.8px;
      font-size: 14px;
      hr {
        width: 68px;
      }
    }
  }
}
</style>
