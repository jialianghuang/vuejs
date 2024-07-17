<template>
  <div
    id="most-popular"
    v-track.viewOnce.click="getBiCommon('item')"
    v-if="list.length > 0"
    :class="{ miniSize: miniSize }"
    class="most-popular"
  >
    <div class="title">
      {{ nl(title) }}
      <a
        v-if="mostPopular.shopAll"
        :href="countryUrl(mostPopular.shopAll)"
        class="need_datalayer"
        data-datalayer-category="MostPopular_Click"
        data-datalayer-label="MostPopular_ShopAll_Click"
        target="_blank"
      >
        {{ nl('page_header_sale_shop_all') }} >
      </a>
    </div>
    <div class="item-list">
      <product-swiper v-if="list.length > 0" :prodList="list" :nextEl="'mp-swiper-button-next'" :prevEl="'mp-swiper-button-prev'">
        <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <div
              v-for="(item, index) in list"
              :title="item.shownGoodsName"
              :key="index"
              @click="itemClick(item, index)"
              v-track.view.click="{ common: [getBiParams(item, index), getBiParams2(item, index)] }"
              data-datalayer-category="MostPopular_Click"
              data-datalayer-label="MostPopular_Click"
              class="swiper-slide need_datalayer goods-item"
            >
              <product-swiper-item
                :index="index"
                :item="item"
                :miniSize="miniSize"
                :addSuffix="true"
                :from="fromTrackingPage ? 'orderRecommend' : from ? from : 'indexMostPopular'"
              ></product-swiper-item>
            </div>
          </div>
        </div>
      </product-swiper>
    </div>
  </div>
</template>

<script>
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
export default {
  name: 'MostPopular',
  components: { ProductSwiper, ProductSwiperItem },
  props: {
    mostPopular: {
      type: Object,
      default() {
        return {}
      }
    },
    miniSize: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'page_index_most_popular'
    },
    fromTrackingPage: {
      // 是否来自/pages/tracking 物流查询页面
      type: Boolean,
      default: false
    },
    // 场景，主要用于区分打点
    scene: {
      type: String,
      default: ''
    },
    sampleRecommendDressAble: {
      // 是否是样衣订单推荐正式裙子
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      MPSwiperOption: {
        slidesPerView: 6,
        // spaceBetween: '1.16%',
        spaceBetween: 15,
        slidesPerGroup: 6,
        simulateTouch: false,
        // loop: true,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: '.mp-swiper-button-next',
          prevEl: '.mp-swiper-button-prev'
        }
      },
      list: this.mostPopular.prodList,
      scrollDointFlag: false
    }
  },
  watch: {
    list: {
      handler(val) {
        if (this.list && this.list.length) {
          const gaParams = this.getGAItemListParams(this.list, null, 'view', 'indexMostPopular')
          this.setGA4DataLayer(gaParams)
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    getBiCommon(el) {
      // 当scene有值当时候，不执行下面的打点，以免增加无效数据
      if (this.scene) return
      if (this.fromTrackingPage) {
        return {
          common: {
            ec: 'youmayalsolike',
            el: 'all'
          }
        }
      } else {
        return {
          id: `Mostpopular-${el}`,
          common: {
            ec: 'Mostpopular',
            el
          }
        }
      }
    },
    itemClick(item, index) {
      this.$emit('mostPopularItemClick')
      if (this.fromTrackingPage && this.sampleRecommendDressAble) {
        this.setOrderSourceFlag('sample_recommend_tracking_page', true)
      } else if (this.from === 'empty_cart_recommend') {
        this.setOrderSourceFlagWithGoodsId('bag_empty_recommend', item.goodsId)
      }
    },
    getBiParams(item, index) {
      if (process.server) return
      if (this.fromTrackingPage || this.scene) {
        const msg = {
          position: index * 1 + 1,
          goodsId: item.goodsId,
          color: item.color,
          cat_id: item.catId,
          cat_name: item.catName
        }
        const params = [
          {
            ec: this.scene ? this.scene : 'youmayalsolike',
            el: 'items',
            msg: JSON.stringify(msg)
          }
        ]
        if (this.fromTrackingPage && this.sampleRecommendDressAble) {
          // tracking page 当前订单中包含样衣的走推荐正式裙子逻辑的时候, 列表页you may also like打点
          params.push({
            ec: 'tryondressestrackingpage',
            el: 'youmayalsolike',
            msg: JSON.stringify(msg)
          })
        }
        return params
      } else if (this.from === 'empty_cart_recommend') {
        // 购物车为空的时候的most popular模块
        const params = {
          ec: 'shoppingbag',
          el: 'empty_waterfalls_items',
          msg: JSON.stringify({
            goodsId: item.goodsId,
            color: item.color,
            cat_name: item.catName,
            dress_type: item.dressType || this.dressType,
            cat_id: item.catId
          })
        }
        return params
      } else {
        const el = `${index + 1}_${item.shownGoodsName ? item.shownGoodsName.replace(/\s+/g, '_') : ''}`
        const params = {
          dp: 'home',
          ec: 'Mostpopular',
          el,
          param1: (location && location.href) || '-1',
          msg: JSON.stringify({
            goodsId: item.goodsId,
            color: item.color,
            cat_name: item.catName,
            dress_type: item.dressType || this.dressType,
            cat_id: item.catId
          })
        }
        return params
      }
    },
    getBiParams2(item, index) {
      if (process.server) return
      let msg = {}
      if (item) {
        msg = {
          goodsId: item.goodsId,
          cat_id: item.catId,
          cat_name: item.catName
        }
      }
      return {
        ec: this.scene,
        el: 'items_' + (index + 1),
        msg: JSON.stringify(msg)
      }
    }
  }
}
</script>

<style lang="less">
.most-popular {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  max-width: 1353px;
  min-width: unset;
  margin: 70px auto 90px;
  .swiper-wrapper {
    .swiper-slide {
      max-height: 326px;
      max-width: 196.333px;
      margin-right: 15px;
    }
  }
  .title {
    color: var(--color-121212);
    text-transform: uppercase;
    letter-spacing: 0;
    font-weight: 400;
    font-family: @font-family-500, sans-serif;
    font-size: 24px;
    line-height: 24px;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--color-cccccc);
    a {
      float: right;
      text-transform: uppercase;
      font-size: 13px;
      font-weight: 400;
      font-family: @font-family-500, sans-serif;
      color: var(--color-121212);
    }
  }
  .arraw-icon {
    width: 18px;
    height: 18px;
  }
  .prev-arraw,
  .next-arraw {
    display: block;
    cursor: pointer;
    background-image: none;
    width: auto;
    height: auto;
    &.swiper-button-disabled {
      cursor: default;
    }
    &:focus {
      outline: none;
    }
  }
}
.most-popular.miniSize {
  width: 1140px;
  max-width: 1140px;
  padding: 0;
  margin: 64px auto 3px;
  .product-swiper-viewport {
    height: 325px;
  }
  /deep/.arraw-icon {
    width: 19px !important;
    height: 19px !important;
  }
  .title {
    line-height: 22px;
    height: 22px;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    font-weight: 400;
    padding-bottom: 5px;
    margin-bottom: 26px;
  }
}
</style>
