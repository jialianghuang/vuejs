<template>
  <div :id="moduleId" v-track.viewOnce.click="{ common: getBiParams(moduleId) }" class="wedding-product-list">
    <div class="content">
      <div :style="{ backgroundColor: productListData.bannerBackground }" class="intro">
        <div class="image">
          <img :src="productListData.banner" :alt="moduleId + ' banner image'" />
        </div>
        <div class="text">
          <div class="title">{{ productListData.name }}</div>
          <div class="subtitle">
            {{ productListData.description }}
          </div>
        </div>
      </div>
      <!-- 选择色系 -->
      <template v-if="productListData && productListData.colors.length > 0">
        <div :style="{ backgroundColor: productListData.productBackground }" class="color-family">
          <div class="color-family-content">
            <div v-swiper:colorFamilySwiper="colorFamilySwiperOption" class="swiper-container color-family-swiper">
              <div class="swiper-wrapper">
                <div v-for="(item, index) in colorFamilyList" :key="index" class="swiper-slide">
                  <div @click="colorFamilyClick(index)" class="color-family-item">
                    <div :class="['color', { active: colorFamilyCur === index }]">
                      <div :style="getColorStyle(item.key)" class="bg"></div>
                      <az-icon v-if="colorFamilyCur === index" icon-class="icon-lby_tick_white_s" class="active-icon" />
                    </div>
                    <div class="name">{{ item.value }}</div>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="colorFamilyList && colorFamilyList.length > 12">
              <div class="swiper-left swiper-pagination">
                <az-icon
                  :class="['swiper-button-prev', ' swiper-nav-prev', 'color-family-prev-' + moduleId]"
                  icon-class="icon-lby_arrow_left"
                />
              </div>
              <div class="swiper-right swiper-pagination">
                <az-icon
                  :class="['swiper-button-next', ' swiper-nav-next', 'color-family-next-' + moduleId]"
                  icon-class="icon-lby_arrow_right"
                />
              </div>
            </template>
          </div>
        </div>
      </template>
      <!-- 商品列表 -->
      <div
        v-if="productListData && productListData.proList.length > 0"
        :style="{ backgroundColor: productListData.productBackground }"
        class="product-list"
      >
        <div class="product-list-content">
          <div v-swiper:productListSwiper="productListSwiperOption" class="swiper-container product-list-swiper">
            <div class="swiper-wrapper">
              <div v-for="(i, idx) in productSwiperList" :key="idx" class="swiper-slide">
                <div class="product-box">
                  <template v-for="(item, index) in i">
                    <div
                      v-if="item && item.goodsId"
                      :key="index"
                      v-track.viewOnce.click="{ common: [getBiParams('product', item), getBiParams('singlecolor', item)] }"
                      @click.prevent.stop="quickShop(item)"
                      class="product-item"
                    >
                      <product-list-item
                        :product-index="index"
                        :item="item"
                        :hide-back-img="true"
                        :show-with-code="true"
                        :show-limited-time-tag="true"
                        :show-fav="false"
                        :data-goods-id="item.goodsId"
                        :data-color-id="item.color"
                        :show-color-box="false"
                        :add-suffix="true"
                        :show-quick-shop-btn="true"
                      ></product-list-item>
                    </div>
                    <a
                      v-else
                      :key="index"
                      :href="countryUrl(productListData.productViewMore)"
                      v-track.viewOnce.click="{ common: getBiParams('productviewmore', item) }"
                      class="product-more"
                    >
                      <div class="product-more-content">
                        {{ nl('page_common_view_more') }}
                      </div>
                    </a>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="swiper-left swiper-pagination">
            <az-icon :class="['swiper-button-prev', ' swiper-nav-prev', 'product-prev-' + moduleId]" icon-class="icon-lby_arrow_left" />
          </div>
          <div class="swiper-right swiper-pagination">
            <az-icon :class="['swiper-button-prev', ' swiper-nav-prev', 'product-next-' + moduleId]" icon-class="icon-lby_arrow_right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * wedding-theme主题页 商品渲染组件
 *
 */
import ProductListItem from '@/components/list/ProductListItem'
import colorHex from '@/assets/js/colorHex'

export default {
  name: 'WeddingProductList',
  components: {
    ProductListItem
  },
  mixins: [colorHex],
  props: {
    currentColor: {
      type: String,
      default: ''
    },
    ec: {
      type: String,
      default: ''
    },
    moduleId: {
      type: String,
      default: ''
    },
    productListData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      colorFamilySwiperOption: {
        watchOverflow: true,
        slidesPerView: 'auto',
        slidesPerGroup: 10,
        centerInsufficientSlides: true,
        spaceBetween: 10,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 10,
        navigation: {
          nextEl: '.color-family-next-' + this.moduleId,
          prevEl: '.color-family-prev-' + this.moduleId
        }
      },
      productListSwiperOption: {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
          nextEl: '.product-next-' + this.moduleId,
          prevEl: '.product-prev-' + this.moduleId
        }
      },
      colorFamilyCur: -1
    }
  },
  computed: {
    productList() {
      return this.productListData.proList || []
    },
    colorFamilyList() {
      return Object.values(this.productListData.colors) || []
    },
    productSwiperList() {
      const viewmore = {
        name: 'viewmore',
        goodsId: null,
        dressType: this.productList[0].dressType || '',
        catId: this.productList[0].catId || ''
      }
      if (this.productList.length > 34) {
        return [this.productList.slice(0, 12), this.productList.slice(12, 24), this.productList.slice(24, 35).concat(viewmore)]
      } else if (this.productList.length < 12) {
        return [this.productList.slice(0, 11).concat(viewmore)]
      } else {
        return [this.productList.slice(0, 12), this.productList.slice(12, 23).concat(viewmore)]
      }
    }
  },
  watch: {
    currentColor(val) {
      // 匹配当前色系 swiper跳转到此项并重新加载商品列表
      const idx = this.colorFamilyList.findIndex((item) => {
        return item.key === val
      })
      this.colorFamilyCur = idx
      if (idx > 0) {
        this.colorFamilySwiper.slideTo(idx)
        this.$emit('refresh', { moduleId: this.moduleId, ...this.colorFamilyList[idx] })
      } else {
        this.$emit('refresh', { moduleId: this.moduleId, key: '' })
      }
    },
    productListData(val) {
      if (val) {
        this.productListSwiper.slideTo(0)
      }
    }
  },
  methods: {
    quickShop(item) {
      const params = {
        goods_id: item.goodsId,
        dress_type: item.dressType,
        color: item.color,
        catId: item.catId,
        catName: item.catName,
        hasRecommend: false,
        colorSortVersion: this.$store.state.versionObj.productColorSort.toLowerCase(),
        sodGalleryVersion: this.$store.state.versionObj.sodGalleryVersion
      }
      this.$emit('quick-shop', params)
    },
    colorFamilyClick(index) {
      // 当前选中色值更新商品列表
      this.colorFamilyCur = index
      this.$emit('refresh', { moduleId: this.moduleId, ...this.colorFamilyList[index] })
    },
    getBiParams(el, item = {}) {
      if (process.server) return
      // 单色打点只在bd和men记录
      if (el === 'singlecolor' && !['BRIDESMAID', 'MEN'].includes(this.moduleId)) {
        return
      }
      const elMap = {
        BRIDES: 'bride',
        BRIDESMAID: 'bridesmaid',
        MOM: 'mom',
        MEN: 'groomsmen',
        JBD: 'juniorandfgd'
      }
      const params = {
        ec: this.ec,
        el: elMap[el] || el,
        msg: {
          color: this.currentColor || '',
          cat_id: item.catId || '',
          dress_type: item.dressType || '',
          goods_id: item.goodsId || ''
        }
      }
      if (el === 'singlecolor') {
        params.msg.singleColor =
          this.colorFamilyList && this.colorFamilyList.length > 0
            ? {
                singleColor: this.colorFamilyList[this.colorFamilyCur]
              }
            : {}
      }
      return params
    }
  }
}
</script>

<style lang="less" scoped>
.wedding-product-list {
  position: relative;
  padding: 50px 3.75% 0;
  margin: 0 0 30px;
  .content {
    margin: 0 auto;
    max-width: 1600px;
  }
  .intro {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: row nowrap;
  }
  .image {
    width: 50%;
    background: @shadow-color;
    user-select: none;
    img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
  }
  .text {
    box-sizing: border-box;
    width: 50%;
    padding: 3.75%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
  }
  .title {
    color: @gray-dark;
    text-align: center;
    font-family: @font-Ivy-Mode-400;
    font-size: 36px;
    letter-spacing: 2.88px;
  }
  .subtitle {
    color: @gray-dark;
    text-align: center;
    font-family: @font-family-500;
    font-size: 20px;
    line-height: 36px; /* 180% */
    letter-spacing: 1.2px;
    margin-top: 15px;
  }
  .color-family {
    position: relative;
    padding: 30px 0 0;
  }
  .color-family-content {
    margin: 0 auto;
    padding: 0 96px;
  }
  .color-family-swiper {
    .swiper-slide {
      max-width: 76px;
    }
  }
  .color-family-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: column nowrap;
    cursor: pointer;
    .color {
      border-radius: 10px;
      width: 40px;
      height: 40px;
      .bg,
      img {
        position: relative;
        z-index: 3;
        border-radius: 10px;
        width: 40px;
        height: 40px;
        display: block;
      }
    }
    .active {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      .bg,
      img {
        position: relative;
        z-index: 3;
        border-radius: 10px;
        width: 40px;
        height: 40px;
        display: block;
      }
      & + div {
        color: @theme-color;
      }
    }
    .name {
      margin-top: 10px;
      color: @gray-dark;
      text-align: center;
      font-family: @font-family-500;
      font-size: 14px;
      letter-spacing: 0.28px;
      text-transform: capitalize;
      max-width: 100px;
      word-break: break-word;
    }
  }

  .swiper-left,
  .swiper-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    z-index: 9;
    height: 18px;
    width: 18px;
    .az-icon {
      cursor: pointer;
      left: auto;
      right: 0px;
      top: auto;
      bottom: 0;
      background: none;
    }
    .swiper-nav-prev {
      left: 0px;
    }
  }
  .color-family .swiper-left {
    left: 42px;
  }
  .color-family .swiper-right {
    right: 42px;
  }

  .product-list {
    position: relative;
  }
  .product-list-content {
    padding: 30px 60px;
    margin: 0 auto;
  }
  .product-box {
    display: grid;
    grid-gap: 20px;
    grid-auto-flow: dense;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, auto);
  }

  .product-item {
    position: relative;
    cursor: pointer;
  }

  .product-more {
    background: @body-bg;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: calc(100% - 64px);
  }
  .product-more-content {
    color: @gray-dark;
    text-align: center;
    font-family: @font-family-500;
    font-size: 14px;
    text-transform: uppercase;
    padding-bottom: 5px;
    border-bottom: 2px solid @gray-dark;
  }

  .product-list .swiper-left {
    left: 27px;
  }
  .product-list .swiper-right {
    right: 27px;
  }

  /deep/ .goods-item {
    width: 100% !important;
    margin: 0 !important;
  }
  /deep/ .goods-item .goods-item-pic {
    width: 100%;
    margin-bottom: 8px;
  }
  /deep/ .goods-colors {
    display: none !important;
  }
  /deep/ .active-icon {
    position: absolute;
    width: 16px;
    height: 14px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    fill: currentColor;
    color: #fff;
    z-index: 9;
  }
}
</style>
