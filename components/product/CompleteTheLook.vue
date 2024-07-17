<template>
  <div
    id="complete-the-look"
    v-track.view.click="{
      common: getBiParams('completethelook', 'all')
    }"
    class="page-product-item-content-block"
  >
    <p class="page-product-item-title">{{ nl('page_product_fittings_head_desc') }}</p>
    <product-swiper
      v-track.view="{ common: getBiParams('completethelook', '1items') }"
      :prodList="completeTheLookList"
      :slidesPerView="CTLswiperOption.slidesPerView"
      :nextEl="'ctl-swiper-button-next'"
      :prevEl="'ctl-swiper-button-prev'"
    >
      <div ref="ctl_swiper" v-swiper:ctl_swiper="CTLswiperOption" class="swiper-container">
        <div class="swiper-wrapper product-swiper-viewport">
          <div
            v-track.view.click="getBiCommon(item, index + 1)"
            v-for="(item, index) in completeTheLookList"
            :key="index"
            class="goods-item swiper-slide"
          >
            <product-swiper-item
              :item="item"
              :index="index"
              :fromDialog="fromDialog"
              :hasQuick="item.canQuickShop || true"
              :hasQuickBtn="item.canQuickShop || true"
              :addSuffix="true"
              :from="'completeTheLook'"
              :itemListName="nl('page_product_fittings_head_desc')"
              :onlyCyberSale="scene === 'productInfo'"
              @quickShop="showQuickShopDialog"
            ></product-swiper-item>
          </div>
        </div>
      </div>
    </product-swiper>
  </div>
</template>
<script>
import ProductSwiper from '@/components/product/ProductSwiper'
import ProductSwiperItem from '@/components/product/productSwiperItem'
import { mapState } from 'vuex'
/**
 * 商品详情Complete the look模块组件，因14182需求较急，直接从ProductRelated.vue组件中抽离出本组件内容
 */
let vm = null
export default {
  name: 'CompleteTheLook',
  languageKeys: ['page_product_fittings_head_desc', ...ProductSwiperItem.languageKeys],
  components: {
    ProductSwiper,
    ProductSwiperItem
  },
  props: {
    completeTheLookList: {
      type: Array,
      default() {
        return []
      }
    },
    fromDialog: {
      type: String,
      default: ''
    },
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      viewArr: [],
      activeNumber: 6,
      thumbSwiper: null
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo
    }),
    CTLswiperOption({ catId }) {
      return {
        slidesPerView: 8,
        spaceBetween: 10,
        slidesPerGroup: 8,
        simulateTouch: false,
        speed: 800,
        navigation: {
          nextEl: '.ctl-swiper-button-next',
          prevEl: '.ctl-swiper-button-prev'
        },
        on: {
          slideChangeTransitionEnd() {
            // isBeginning=true 第一屏，isEnd=true 最后一屏
            vm.setViewProduct(this.snapIndex, vm.isSpecialCatId(catId))
          },
          slideNextTransitionStart() {
            vm.setViewClick('click', this.snapIndex)
          },
          slidePrevTransitionStart() {
            vm.setViewClick('click', this.snapIndex + 2)
          },
          init() {
            vm.thumbSwiper = this
          }
        },
        breakpoints: {
          1440: {
            slidesPerView: vm.isSpecialCatId(catId) ? 6 : 5,
            slidesPerGroup: vm.isSpecialCatId(catId) ? 6 : 5
          },
          1500: {
            slidesPerView: 6,
            slidesPerGroup: 6
          },
          1536: {
            slidesPerView: 6,
            slidesPerGroup: 6
          }
        }
      }
    }
  },
  watch: {
    completeTheLookList: {
      handler(val) {
        if (this.completeTheLookList && this.completeTheLookList.length) {
          const gaParams = this.getGAItemListParams(this.completeTheLookList, null, 'view', this.nl('page_product_fittings_head_desc'))
          this.setGA4DataLayer(gaParams)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    vm = this
  },
  mounted() {
    // comments: 首次展示需要加入前4个商品
    const number = this.isSpecialCatId(this.catId) ? 7 : 3
    this.completeTheLookList.forEach((item, index) => {
      if (!this.viewArr.includes(item.goodsId) && index <= number) {
        this.viewArr.push(item.goodsId)
      }
    })
    // this.setViewCookie(this.viewArr)
  },
  methods: {
    getBiParams(ec, el) {
      const obj = {
        ec,
        el,
        param2: 'A'
      }
      if (el === 'all') {
        obj.msg = JSON.stringify({
          from_cat_id: this.baseInfo.catId
        })
      }
      return obj
    },
    showQuickShopDialog(params) {
      this.$emit('quickShop', { scene: 'product', ...params })
    },
    setViewProduct(snapIndex, bol) {
      // todo: snapIndex 表示第几页 0 开始
      const list = this.completeTheLookList
      let tempArr = []
      switch (snapIndex) {
        case 0:
          break
        case 1:
          tempArr = bol ? list.slice(8) : list.slice(4, 8)
          break
        case 2:
          tempArr = bol ? list.slice(16) : list.slice(8)
          break
      }
      this.setViewClick('view', snapIndex + 1)
      if (list.length === this.viewArr.length) return
      for (let i = 0; i < tempArr.length; i++) {
        if (!this.viewArr.includes(tempArr[i].goodsId)) {
          this.viewArr.push(tempArr[i].goodsId)
        }
      }
      // this.setViewCookie(this.viewArr)
    },
    // todo: 第几页view click打点
    setViewClick(ea, index) {
      const obj = this.getBiParams('completethelook', index + 'items')
      this.buryPoint(this, 'event', {
        ...obj,
        ea
      })
    },
    setViewCookie(lists) {
      const viewPorduct = this.$cookie.getCookie('viewProducts')
      let hasViewProduct = []
      if (viewPorduct) {
        hasViewProduct = decodeURIComponent(viewPorduct).split(',')
      }
      let tempValue = null
      lists.forEach((item) => {
        tempValue = item.toString()
        if (!hasViewProduct.includes(tempValue)) {
          hasViewProduct.unshift(tempValue)
        }
      })
      if (hasViewProduct.length >= 6) {
        hasViewProduct.length = 6
      }
      this.$cookie.setCookie('viewProducts', hasViewProduct)
    },
    getBiCommon(item, index) {
      const param2 = [8, 9].includes(this.catId) ? { param2: 'A' } : {}
      // 不要问为什么有两个，四叶参要的
      return {
        common: [
          {
            ec: 'completethelook',
            el: 'items' + index,
            ...param2,
            msg: JSON.stringify({
              index,
              goodsId: item.goodsId,
              color: item.colorReal,
              cat_id: item.catId,
              from_cat_id: this.baseInfo.catId,
              rec_auto: item.hasRecommend ? 0 : 1 // 自动推荐还是手动推荐, hasRecommend为true表示lego手动配置推荐，打点字段rec_auto： 1表示是自动推荐，不打或者非1表示手动
            })
          },
          {
            ec: 'completeTheLook',
            el: 'items',
            ...param2,
            msg: JSON.stringify({
              index,
              goodsId: item.goodsId,
              color: item.colorReal,
              cat_id: item.catId,
              from_cat_id: this.baseInfo.catId,
              rec_auto: item.hasRecommend ? 0 : 1
            })
          }
        ]
      }
    }
  }
}
</script>
<style lang="less" scoped>
#complete-the-look {
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
  /deep/ .goods-item-fav,
  /deep/ .goods-name,
  /deep/ .info-sticker {
    display: none !important;
  }
  &.page-product-item-content-block {
    margin-bottom: 0 !important;
    .page-product-item-title {
      padding-bottom: 5px;
      margin-bottom: 15px;
      box-shadow: 0 1px 0 var(--color-121212);
      font-family: @font-family-600;
      font-size: 16px;
      line-height: 22px;
      color: var(--color-121212);
      text-transform: uppercase;
    }
    /deep/ .page-product-item-content {
      padding-top: unset;
    }
  }
}
</style>
