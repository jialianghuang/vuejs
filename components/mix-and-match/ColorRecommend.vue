<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="!loaded" class="skeleton-default">
      <img :src="require('~/assets/images/default_img.jpg')" alt="default img" />
    </div>
    <!-- 色系推荐商品 -->
    <div v-show="loaded" v-track.viewOnce.click="{ common: getBiParams('colorfamily', currentColor) }" class="color-recommend">
      <div class="color-recommend-intro">
        <!-- 标题 文案 -->
        <div class="title">{{ nl(data.familyTitle) }}</div>
        <div class="text">{{ nl(data.familySubTitle) }}</div>
        <a
          v-track.viewOnce.click="{ common: getBiParams('colorfamilyshopthispalette', currentColor) }"
          :href="`/all/bridesmaid-dresses/colors-family/` + currentColor"
          class="btn"
        >
          {{ nl('page_common_shop_this_palette') }}
        </a>
      </div>
      <!-- horizon参数配置排列模式 horizon: true:顺序 false:反序 默认为顺序 -->
      <div :style="{ background: bgColor }" class="color-recommend-box">
        <div :class="['color-recommend-content', horizon ? 'normal' : 'reverse']">
          <div v-track.click="{ common: getBiParams('colorfamilyphoto', currentColor) }" class="image-content">
            <template v-for="(item, index) in data.familyBanner">
              <div :key="index" class="image">
                <a :href="'/all/bridesmaid-dresses/colors-family/' + currentColor" :aria-label="item.bannerTitle">
                  <img :aria-label="item.bannerTitle" :src="item.bannerUrl || ''" :alt="item.bannerTitle" />
                </a>
                <div class="image-text">
                  {{ item.bannerTitle }}
                  <p>{{ item.bannerSubTitle }}</p>
                </div>
              </div>
            </template>
          </div>
          <div class="blank"></div>
          <div class="list">
            <div
              :ref="'colorRecommendSwiperRef' + currentColor"
              v-swiper:colorRecommendListSwiper="colorRecommendListSwiperOption"
              :class="['swiper-container', 'colorRecommend' + currentColor]"
            >
              <div v-track.viewOnce="{ common: getBiParams('colorfamilydress1', currentColor) }" class="swiper-wrapper">
                <!-- 商品列表 -->
                <div v-for="(item, index) in data.prodList" :key="item.goodsId" class="swiper-slide">
                  <div class="item">
                    <div v-track.click="{ common: getBiParams('colorfamilydress', currentColor) }" class="product">
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
                      ></product-list-item>
                    </div>
                    <template v-if="data && data.swatchProdList[index].baseInfo && data.swatchProdList[index].baseInfo.shownColor">
                      <div class="divide-line"></div>
                      <div v-track.click="{ common: getBiParams('colorfamilyswatch', currentColor) }">
                        <color-swatch-item
                          :item="data.swatchProdList[index]"
                          :loading="loading"
                          @add-to-bag="addToBag"
                          @quick-shop="quickShop"
                        ></color-swatch-item>
                      </div>
                    </template>
                  </div>
                </div>
                <!-- 显示更多 -->
                <div v-if="data.prodList && data.prodList.length > 1" class="swiper-slide">
                  <div v-track.viewOnce.click="{ common: getBiParams('colorfamilyviewmore', currentColor) }" class="view-more">
                    <a :href="'/all/bridesmaid-dresses/colors-family/' + currentColor" class="view-more-content">
                      {{ nl('page_common_view_more') }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-left swiper-pagination">
              <az-icon :class="['swiper-button-prev', ' swiper-nav-prev-' + currentColor]" icon-class="icon-lby_arrow_left" />
            </div>
            <div class="swiper-right swiper-pagination">
              <az-icon :class="['swiper-button-next', ' swiper-nav-next-' + currentColor]" icon-class="icon-lby_arrow_right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductListItem from '@/components/list/ProductListItem'
import ColorSwatchItem from '@/components/mix-and-match/ColorSwatchItem'

const bgColorMap = {
  Green: '#eaefeb',
  Blue: '#edf2f5',
  Red: '#e4d2ce',
  Purple: '#f1ecec',
  Pink: 'var(--color-f1e9e6)',
  Black: '#ededed',
  Orange: '#f2e6dd',
  Pastel: '#f3eeeb',
  bd_lookbook_jeweltones: '#e0e5ec'
}

const horizonMap = {
  Green: true,
  Blue: false,
  Red: true,
  Purple: false,
  Pink: true,
  Black: false,
  Orange: true,
  Pastel: false,
  bd_lookbook_jeweltones: true
}

export default {
  name: 'ColorRecommend',
  components: {
    ProductListItem,
    ColorSwatchItem
  },
  props: {
    currentColor: {
      type: String,
      default: ''
    }, // 当前组件颜色
    pageName: {
      type: String,
      default: ''
    } // 标记哪个页面调用组件
  },
  data() {
    return {
      loaded: false,
      loading: false,
      data: {},
      horizon: true,
      colorRecommendListSwiperOption: {
        slidesPerView: 2.6,
        slidesPerGroup: 2,
        spaceBetween: 30,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: '.swiper-nav-next-' + this.currentColor,
          prevEl: '.swiper-nav-prev-' + this.currentColor
        },
        on: {
          slideChangeTransitionEnd: () => {
            // 每屏2个slide 需要处理index获取当前第x屏
            const index = this.swiper.realIndex ? this.swiper.realIndex / 2 + 1 : 1
            this.setPoint(
              'mixandmatchpage',
              'colorfamilydress' + index,
              'view',
              { color: this.currentColor },
              '/mix-and-match-bridesmaid-dresses'
            )
          },
          click: () => {
            const index = this.swiper.realIndex ? this.swiper.realIndex / 2 + 1 : 1
            this.setPoint(
              'mixandmatchpage',
              'colorfamilydress' + index,
              'click',
              { color: this.currentColor },
              '/mix-and-match-bridesmaid-dresses'
            )
          }
        }
      },
      observer: null
    }
  },
  computed: {
    swiper() {
      return this.$refs['colorRecommendSwiperRef' + this.currentColor].swiper
    },
    bgColor() {
      return bgColorMap[this.currentColor]
    }
  },
  mounted() {
    this.init()
    // 绑定视窗元素监听事件
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => {
          if (entry.isIntersecting) {
            this.loadMore()
          }
        },
        {
          root: null,
          rootMargin: '0',
          threshold: 1.0
        }
      )
    })
    const el = document.querySelector('.color-recommend-content')
    this.observer.observe(el.lastChild)
  },
  methods: {
    // 根据当前color请求数据
    async init() {
      const params = {
        hasTitle: false, // boolen类型 传参true返回页面信息 第一次加载必须传参 false时只返回色系推荐信息
        color: this.currentColor, // str类型 色系颜色值 首屏调用不传
        mmLandingPage: this.pageName == 'mixandmatch' ? 'mix_match' : 'swatch' // string类型 区分获取字段 默认值mix_match: popularColor / swatch: topSwatchGoods
      }
      const { data } = await this.$axios.$get(`/1.0/mix-match-page`, { params })
      this.data = data // 设置state
      this.horizon = horizonMap[this.currentColor] // 初始化顺序

      this.loaded = true
    },
    // 获取styleId
    getStyleId(item) {
      const color = item.baseInfo.colorReal
      return item.styleInfo.color[color].styleId
    },
    // 色卡简易加车逻辑
    addToBag(item) {
      this.loading = true
      // 加车按钮不报错点击数量
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', item.baseInfo.goodsId)
      formData.set('dress_type', item.baseInfo.dressType)
      formData.set('styles[select][color]', this.getStyleId(item))
      formData.set('goods_number', 1)
      this.addToBagAjax(formData)
    },
    addToBagAjax(formData) {
      this.$axios.$post('/1.0/cart/goods', formData).then(async (res) => {
        if (res.code == 0) {
          this.$store.commit('setBundlePromotionProgress', res.data.bundlePromotionProgress)
          await this.getCartInfo()
          this.loading = false
          this.$store.commit('product/setShowAddCartDialog', true)
          this.$store.commit('product/setIsCustomSize', this.customSizeSelected)
          this.$store.commit('setTopCartListShow', true)
          this.setOrderSourceFlag(this.pageName, true)
        } else {
          alert(res.msg)
          this.loading = false
          window.location.reload()
        }
      })
    },
    async getCartInfo() {
      // 导航栏的购物车icon,hover上去有删除功能，删除之后获取购物车状态
      try {
        const res = await this.$axios.$get(`/1.0/cart`, {
          params: { for_checkout: 1, sodGalleryVersion: this.versionObj.sodGalleryVersion.toLowerCase() }
        })
        if (res.code == 0) {
          if (res.data.summary) {
            this.$store.commit('setCartInfo', {
              totalCount: res.data.forCheckoutQty,
              prodList: res.data.checkoutGoodsList || [],
              hasLineTotal: res.data.summary.goodsAmount != res.data.summary.totalNoDealGoodsAmount,
              totalPrice: res.data.summary.goodsAmountDisplay,
              totalNoDealPrice: res.data.summary.totalNoDealGoodsAmountDisplay,
              sample_gift_goods_id: '', //  后端说这个送头纱现在没有了
              freeShippingProgress: res.data.freeShippingProgress, // 免运费进度条相关数据
              cartBundleList: res.data.cartBundleList, // buy more get more
              activityInfo: res.data.activityInfo || {}
            })
          } else {
            this.$store.commit('setCartInfo', {
              totalCount: 0,
              prodList: [],
              hasLineTotal: false,
              totalPrice: 0,
              totalNoDealPrice: 0,
              sample_gift_goods_id: '',
              freeShippingProgress: null,
              activityInfo: {}
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    quickShop(item) {
      const params = {
        goods_id: item?.baseInfo?.goodsId,
        dress_type: item?.baseInfo?.dressType,
        color: item?.baseInfo?.color,
        catId: item?.baseInfo?.catId,
        catName: item?.baseInfo?.catName,
        hasRecommend: false,
        colorSortVersion: this.$store.state.versionObj.productColorSort.toLowerCase(),
        sodGalleryVersion: this.$store.state.versionObj.sodGalleryVersion
      }
      this.$emit('quick-shop', params)
    },
    loadMore() {
      this.$emit('load-more', this.currentColor)
    },
    getBiParams(el, color) {
      if (process.server) return
      return {
        ec: this.pageName == 'mixandmatch' ? 'mixandmatchpage' : 'freeswatchpage',
        el,
        msg: { color }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.color-recommend {
  .color-recommend-intro {
    max-width: 1600px;
    margin: 0 auto;
    padding: 80px 30px 30px;
    user-select: none;
    .title {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-Ivy-Mode-400;
      font-size: 48px;
      line-height: 60px; /* 125% */
      letter-spacing: 2.88px;
      text-transform: uppercase;
    }
    .text {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 18px;
      line-height: normal;
      margin: 10px auto;
      max-width: 1600px;
      min-width: 1150px;
    }
    .btn {
      display: block;
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 18px;
      font-weight: 600;
      text-decoration-line: underline;
      cursor: pointer;
    }
  }
  .color-recommend-box {
    padding: 40px 30px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .color-recommend-content {
      max-width: 1600px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      &.normal {
        flex-direction: row;
      }
      &.reverse {
        flex-direction: row-reverse;
      }
    }
    .image-content {
      max-width: 414px;
      width: 100%;
    }
    .image {
      max-width: 414px;
      width: 100%;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .image-text {
      margin: 8px 0;
      color: var(--color-121212);
      font-family: @font-family-500;
      font-size: 12px;
      letter-spacing: 0.24px;
    }
    .blank {
      display: block;
      width: 30px;
      height: 100%;
      visibility: hidden;
    }
    .list {
      width: 100%;
      height: 100%;
      padding: 0 56px;
      overflow: hidden;
      position: relative;
    }
    .swiper-container {
      box-sizing: border-box;
    }
    .swiper-slide {
      width: 100%;
      max-width: 380px;
    }
    .item {
      max-width: 380px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column nowrap;
    }
    /deep/ .goods-item {
      max-width: 380px !important;
      width: 100% !important;
      margin-bottom: 15px;
    }
    /deep/ .goods-item .goods-item-pic {
      width: 100%;
      max-width: 380px;
      max-height: 526px;
      margin-bottom: 8px;
    }
    /deep/ .goods-item .goods-price {
      font-size: 16px;
      font-family: @font-family-600;
    }
    /deep/ .goods-colors {
      display: none !important;
    }
    .product {
      width: 100%;
      max-width: 380px;
    }
    .divide-line {
      margin: 0 0 15px;
      width: 100%;
      height: 1px;
      background: #fff;
    }
    .view-more {
      display: flex;
      width: 380px;
      height: 526px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: var(--color-f9f9f9);
      cursor: pointer;
    }
    .view-more-content {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 24px;
      text-transform: uppercase;
      padding-bottom: 8px;
      border-bottom: 3px solid var(--color-121212);
    }

    .swiper-left,
    .swiper-right {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 26px;
      z-index: 9;
      height: 26px;
      width: 26px;
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

    .swiper-left {
      left: 0;
    }

    .swiper-right {
      right: 0;
    }
  }
}

/deep/ .goods-img {
  display: none;
  opacity: 0;
}
/deep/ .goods-img.show {
  display: block !important;
  opacity: 1 !important;
}

.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 1126px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 1600px) {
  .image-content {
    width: unset !important;
  }
  .image {
    width: 310.5px !important;
  }
}
</style>
