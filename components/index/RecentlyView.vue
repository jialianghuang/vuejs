<template>
  <div
    id="recently-view"
    v-track.viewOnce.click="getBiParams('item')"
    v-if="list.length > 3 || (miniSize && list.length > 0)"
    :class="{ miniSize: miniSize }"
    class="recently-view"
  >
    <div class="title">{{ nl('page_common_recently_viewed') }}</div>
    <div class="item-list">
      <product-swiper v-if="list.length > 0" :prodList="list" :nextEl="'rv-swiper-button-next'" :prevEl="'rv-swiper-button-prev'">
        <div ref="RVSwiper" v-swiper:RVSwiper="RVSwiperOption" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <div
              v-for="(item, index) in list"
              :title="item.shownGoodsName"
              :key="index"
              @click="itemClick(item, index)"
              data-datalayer-category="RecentlyViewed_Click"
              data-datalayer-label="Recently_Viewed_Home_Click"
              class="swiper-slide need_datalayer goods-item"
            >
              <product-swiper-item :item="item" :miniSize="miniSize" :from="'indexRecentlyViewd'" :index="index"></product-swiper-item>
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
  name: 'RecentlyView',
  components: { ProductSwiper, ProductSwiperItem },
  props: {
    miniSize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      RVSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 15,
        // spaceBetween: '1.16%',
        slidesPerGroup: 6,
        simulateTouch: false,
        // loop: true,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: '.rv-swiper-button-next',
          prevEl: '.rv-swiper-button-prev'
        },
        on: {
          slideChangeTransitionEnd: () => {
            if (this.RVSwiper) {
              this.itemsArrPoint()
            }
          }
        }
      },
      list: [],
      scrollDointFlag: false
    }
  },
  watch: {
    scrollDointFlag(nval) {
      if (nval) {
        this.itemsArrPoint()
      }
    }
  },
  mounted() {
    this.getRecentlyList()
    if (this.$route.name == 'index') {
      // abtest 首页模块打点
      this.scrollShowPoint()
    }
  },
  methods: {
    getBiParams(el) {
      if (process.server) return
      return {
        id: `Recentlyviewed-${el}`,
        common: {
          ec: 'Recentlyviewed',
          el
        }
      }
    },
    getRecentlyList() {
      const recentReviewed = localStorage.getItem('recently_viewed')
      if (recentReviewed) {
        const viewedArr = JSON.parse(recentReviewed)
          .map((item) => {
            return {
              goods_id: item.id,
              color_name: item.color,
              dress_type: item.type,
              goods_style_id: item.style_id
            }
          })
          .filter((item) => item)
        this.$axios
          .$post(`/1.0/recommend/recently-view`, {
            view_data: viewedArr
          })
          .then((res) => {
            if (res.code == 0) {
              if (res.data.prodList && res.data.prodList.length > 0) {
                this.$set(this, 'list', res.data.prodList.reverse() || [])
                if (this.list && (this.list.length > 3 || (this.miniSize && this.list.length > 0))) {
                  const gaParams = this.getGAItemListParams(this.list, null, 'view', 'indexRecentlyViewd')
                  this.setGA4DataLayer(gaParams)
                }
              }
            }
          })
      }
    },
    itemClick(item, index) {
      this.$emit('recentlyViewedItemClick')
      if (this.$route.name == 'index') {
        const itemEl = `${index + 1}_${item.shownGoodsName ? item.shownGoodsName.replace(/\s+/g, '_') : ''}`
        this.itemPoint(itemEl, 'click', item)
      }
    },
    itemPoint(itemEl, type, item) {
      if (this.$route.name == 'index') {
        // 首页此模块打点
        this.buryPoint(this, 'event', {
          dp: 'home',
          ec: 'Recentlyviewed',
          ea: type,
          el: itemEl,
          param1: (location && location.href) || '-1',
          msg: JSON.stringify({
            goodsId: item.goodsId,
            color: item.color,
            cat_name: item.catName,
            dress_type: item.dressType || this.dressType,
            cat_id: item.catId
          })
        })
      }
    },
    itemsArrPoint() {
      const index = (this.RVSwiper && this.RVSwiper.realIndex) || 0
      const paramsArr = []
      for (let i = index; i <= index + 5; i++) {
        if (this.list && this.list[i]) {
          const itemEl = `${i + 1}_${this.list[i].shownGoodsName ? this.list[i].shownGoodsName.replace(/\s+/g, '_') : ''}`
          const item = this.list[i]
          paramsArr.push({
            dp: 'home',
            ec: 'Recentlyviewed',
            ea: 'view',
            el: itemEl,
            param1: (location && location.href) || '-1',
            msg: JSON.stringify({
              goodsId: item.goodsId,
              color: item.color,
              cat_name: item.catName,
              dress_type: item.dressType || this.dressType,
              cat_id: item.catId
            })
          })
        }
      }
      this.buryPoint(this, 'events', paramsArr)
    },
    scrollShowPoint() {
      const _this = this
      window.addEventListener('scroll', function() {
        const ele = document.getElementById('recently-view')
        _this.scrollDointFlag = _this.inViewPort(ele, 0.5)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.recently-view {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  max-width: 1640px;
  min-width: unset;
  margin: 70px auto 90px;
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
  }
  .arraw-icon {
    width: 18px;
    height: 18px;
  }
  /deep/.swiper-button-prev,
  /deep/.swiper-button-next {
    background-image: none;
    outline: none;
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
  // /deep/.sticker_tryOn {
  //   // width: 50px !important;
  //   height: 50px !important;
  // }
}

.recently-view.miniSize {
  width: 1140px;
  max-width: 1140px;
  padding: 0;
  margin: 0 auto;
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
