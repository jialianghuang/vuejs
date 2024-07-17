<template>
  <!-- trending color 颜色组件 -->
  <div class="trending-color">
    <!-- swatchMode:true显示色卡swiper  false显示单色swiper -->
    <div
      v-track.viewOnce="{ common: getBiParams(swatchMode ? 'swatch' : 'trendingcolor') }"
      :style="{ maxWidth: swatchMode ? '1571px' : '1294px' }"
      class="trending-swiper-content"
    >
      <div ref="trendingColorSwiper" v-swiper:trendingColorSwiper="trendingColorSwiperOption" class="swiper-container">
        <div class="swiper-wrapper">
          <template v-if="swatchMode">
            <div v-for="(item, index) in trendingColorList" :key="index" class="swiper-slide">
              <div
                v-track.click="{ common: getBiParams('swatch') }"
                @click.stop="addToBag(item)"
                @mouseenter="useMask(index, true)"
                @mouseleave="useMask(index, false)"
                class="item"
              >
                <div :style="{ background: 'url(' + getImageUrl(item.key) + ') no-repeat center/cover' }" class="item-img">
                  <div v-if="maskVisible && index === current" class="item-mask">{{ nl('page_order_add2bag') }}</div>
                </div>
                <div class="item-text">{{ item.name }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div v-for="(item, index) in mixMatchData" :key="index" class="swiper-slide">
              <a
                v-track.click="{ common: getBiParams('trendingcolor') }"
                :href="item.url"
                :aria-label="'trending color swiper' + item.name"
              >
                <div class="color-item">
                  <div :style="getColorStyle(item.key)" class="img"></div>
                  <div class="text">{{ item.name }}</div>
                </div>
              </a>
            </div>
          </template>
        </div>
      </div>
      <div class="swiper-left swiper-pagination">
        <az-icon class="swiper-button-prev swiper-nav-prev" icon-class="icon-lby_arrow_left" />
      </div>
      <div class="swiper-right swiper-pagination">
        <az-icon class="swiper-button-next swiper-nav-next" icon-class="icon-lby_arrow_right" />
      </div>
    </div>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'

export default {
  name: 'TrendingColor',
  mixins: [colorHex],
  props: {
    mixMatchData: {
      type: Array,
      default: () => {
        return []
      }
    }, // mix-and-match page
    swatchData: {
      type: Object,
      default: () => {
        return {}
      } // free-swatch page
    },
    swatchMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      trendingColorSwiperOption: {
        slidesPerView: this.isSmallSize ? 8 : 10,
        slidesPerGroup: this.isSmallSize ? 8 : 10,
        spaceBetween: this.swatchMode ? 25 : 40,
        navigation: {
          nextEl: '.swiper-nav-next',
          prevEl: '.swiper-nav-prev'
        }
      },
      trendingColorList: [],
      maskVisible: false,
      isSmallSize: false,
      current: null
    }
  },
  created() {},
  mounted() {
    this.init()
    this.isSmallSize = document.documentElement.clientWidth <= 1500
  },
  methods: {
    init() {
      if (this.swatchMode && this.swatchData?.styleInfo && this.swatchData?.styleInfo?.color) {
        this.trendingColorList = Object.values(this.swatchData?.styleInfo?.color)
      }
    },
    // free-swatch页面色卡简易加车逻辑
    addToBag(item) {
      this.setPoint('freeswatchpage', 'swatchaddtobag', 'click')
      this.loading = true
      // 加车按钮不报错点击数量
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', this.swatchData.baseInfo.goodsId)
      formData.set('dress_type', this.swatchData.baseInfo.dressType)
      formData.set('styles[select][color]', item.styleId)
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
          this.setOrderSourceFlag('freeswatchpage', true)
          this.setPoint('freeswatchpage', 'swatchaddtobagsuccess', 'click')
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
    getBiParams(el) {
      if (process.server) return
      return {
        ec: this.swatchMode ? 'freeswatchpage' : 'mixandmatchpage',
        el
      }
    },
    getImageUrl(color) {
      return this.swatchData.imageInfo?.browserPrefix + this.swatchData.imageInfo?.goodsGallery[color]?.images[0]?.imgUrl
    },
    useMask(index, state) {
      this.current = index
      this.maskVisible = state
    }
  }
}
</script>

<style lang="less" scoped>
.trending-color {
  .trending-swiper-content {
    position: relative;
    height: 100%;
    margin: 0 auto;
    padding: 0 43px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .swiper-container {
    width: 100%;
    box-sizing: border-box;
  }
  .item {
    width: 126px;
  }
  .item-img {
    width: 100%;
    height: 176px;
    position: relative;
    cursor: pointer;
  }
  .item-mask {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 176px;
    position: absolute;
    cursor: pointer;
    color: #fff;
    text-align: center;
    font-family: @font-family-500;
    font-size: 14px;
    font-weight: 600;
    text-decoration-line: underline;
    background-color: rgba(0, 0, 0, 0.4);
    text-transform: uppercase;
  }
  .item-text {
    margin-top: 10px;
    color: var(--color-121212);
    text-align: center;
    font-family: @font-family-500;
    font-size: 12px;
    text-transform: uppercase;
  }
  .color-item {
    width: 90px;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .img {
      width: 75px;
      height: 75px;
      border-radius: 100px;
      position: relative;
      &::after {
        content: ' ';
        width: 75px;
        height: 75px;
        border-radius: 100px;
        position: absolute;
        left: 0;
        top: 0;
        background: url('https://cdn-1.azazie.com/upimg/userfiles/images/1/96/08/79940b3a75a066a4bc74a38e591c9608.png');
        z-index: 99;
      }
    }
    .text {
      text-align: center;
      color: var(--color-121212);
      font-size: 12px;
      text-transform: uppercase;
      margin-top: 10px;
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

  .swiper-left {
    left: 0;
  }

  .swiper-right {
    right: 0;
  }
}
</style>
