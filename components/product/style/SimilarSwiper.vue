<template>
  <div id="similarList" class="similar-content">
    <product-swiper
      :prodList="findSimilarData.prodList"
      :slidesPerView="SSswiperOption.slidesPerView"
      :nextEl="'ss-swiper-button-next'"
      :prevEl="'ss-swiper-button-prev'"
      :loadMoreLoading="loadMoreLoading"
    >
      <div ref="ss_swiper" v-swiper:ss_swiper="SSswiperOption" class="swiper-container">
        <div class="swiper-wrapper product-swiper-viewport">
          <template v-if="isLoading">
            <div v-for="item in 4" :key="`skeleton-${item}`" class="skeleton-item goods-item swiper-slide">
              <div class="img-box">
                <!-- <img :src="require('~/assets/images/default_img.jpg')" alt="skeleton" class="skeleton-img" /> -->
                <div :style="defaultStyleInfo" class="skeleton-img"></div>
              </div>
              <skeleton-rect v-for="i in 2" :key="`skeletonRectNum-${i}`" :style="{ height: '18px', marginTop: '1px' }"></skeleton-rect>
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item, index) in findSimilarData.prodList"
              :key="index"
              @click="setOrderSourceFlag('oos_recommends', true)"
              class="goods-item swiper-slide"
            >
              <product-swiper-item
                :item="item"
                :index="index"
                :hasQuick="true"
                :hasQuickBtn="true"
                :addSuffix="true"
                :from="'similar'"
                @quickShop="showQuickShopDialog"
                v-track.view.click="{ common: [getBiParams('oos', `items`, item), getBiParams('oos', `items_${index + 1}`, item)] }"
              ></product-swiper-item>
            </div>
          </template>
        </div>
      </div>
    </product-swiper>
  </div>
</template>

<script>
import productSwiper from '@/components/product/ProductSwiper'
import productSwiperItem from '@/components/product/productSwiperItem'
import SkeletonRect from '@/components/list/skeleton/rect/index.js'
import { mapState } from 'vuex'
let vm = null
export default {
  name: 'SimilarSwiper',
  components: {
    productSwiper,
    productSwiperItem,
    SkeletonRect
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    loadMoreLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultBackgroundImg: require('~/assets/images/default_img.jpg')
    }
  },
  computed: {
    ...mapState('product', ['baseInfo', 'findSimilarData']),
    defaultStyleInfo() {
      return {
        background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 100%`
      }
    },
    SSswiperOption() {
      return {
        slidesPerView: 4,
        spaceBetween: 10,
        slidesPerGroup: 4,
        simulateTouch: false,
        observer: true,
        speed: 800,
        navigation: {
          nextEl: '.ss-swiper-button-next',
          prevEl: '.ss-swiper-button-prev'
        },
        on: {
          slideChangeTransitionStart() {
            if (this.isEnd) {
              // 最后一个的时候
              vm.handleLoad()
            }
          }
        }
      }
    }
  },
  watch: {
    'findSimilarData.findSimilarKey'(oldVav, val) {
      this.$nextTick(() => {
        if (this.ss_swiper) {
          this.ss_swiper.update()
        }
        if (this.findSimilarData.prodList && this.findSimilarData.prodList.length) {
          const gaParams = this.getGAItemListParams(this.findSimilarData.prodList, null, 'view', 'similar')
          this.setGA4DataLayer(gaParams)
        }
      })
    }
  },
  created() {
    vm = this
  },
  methods: {
    showQuickShopDialog(params) {
      this.$emit('quickShop', { ...params, isFindSimilar: true })
    },
    getBiParams(ec, el, item) {
      if (process.server) return
      const msg = {
        goodsId: item.goodsId,
        cat_name: item.catName,
        dress_type: item.dressType,
        cat_id: item.catId,
        from_cat_id: this.baseInfo.catId, // 主商品catId
        recommendType: item && item.recommendType
      }
      return {
        ec,
        el,
        msg: JSON.stringify(msg)
      }
    },
    handleLoad() {
      const { total, prodList } = this.findSimilarData
      if (total && total > prodList.length) {
        // 需要请求接口下一页
        this.$emit('handleLoad', this.findSimilarData.findSimilarKey)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.similar-content {
  margin-top: 10px;

  /deep/ .quick-shop {
    white-space: nowrap;
    font-size: 12px;
    padding: 0 5px;
    line-height: 30px;
    width: max-content;
    &.FR,
    &.MX {
      transform: translate(-50%) scale(0.8);
    }
  }
  /deep/ .product-swiper .product-swiper-container .arraw-icon {
    width: 11px;
    height: 11px;
  }

  .skeleton-item {
    .img-box {
      width: 100%;
      margin-bottom: 6px;
      .skeleton-img {
        width: 100%;
        height: 0;
        vertical-align: middle;
        padding-top: 138.3%;
      }
    }
  }
}
</style>
