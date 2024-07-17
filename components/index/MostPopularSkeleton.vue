<template>
  <div
    id="most-popular"
    v-track.view.click="getBiCommon('item')"
    v-if="!(hasData && list.length === 0)"
    :class="{ miniSize: miniSize }"
    class="most-popular"
  >
    <template v-if="!skeleton && hasData">
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
      <div :class="['item-list', { abtestB: abtestVersionB }]">
        <template v-if="abtestVersionB">
          <div v-track.view.click="{ common: { ec: 'Mostpopular', el: 'arrow' } }" class="btn-box">
            <a
              href="javascript:void(0)"
              aria-label="swiper-button-prev"
              class="common-a prev-arraw swiper-button-prev mp-swiper-button-prev"
            >
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
            </a>
            <a
              href="javascript:void(0)"
              aria-label="swiper-button-next"
              class="common-a next-arraw swiper-button-next mp-swiper-button-next"
            >
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
            </a>
          </div>
          <product-swiper v-if="abtestList.length >= 2" :prodList="list">
            <template v-for="(item, index) in abtestList">
              <div :ref="mpSwipers[index]" v-swiper:[mpSwipers[index]]="MPSwiperOption" :key="index" class="swiper-container">
                <div class="swiper-wrapper product-swiper-viewport">
                  <div
                    v-for="(subItem, subIndex) in item"
                    :title="subItem.shownGoodsName"
                    :key="subIndex"
                    @click="itemClick(subItem, subIndex)"
                    v-track.view.click="{ common: getBiParams(subItem, subIndex + 1) }"
                    data-datalayer-category="MostPopular_Click"
                    data-datalayer-label="MostPopular_Click"
                    class="swiper-slide need_datalayer goods-item"
                  >
                    <product-swiper-item :item="subItem" :miniSize="miniSize" :addSuffix="true" :index="subIndex"></product-swiper-item>
                  </div>
                </div>
              </div>
            </template>
          </product-swiper>
        </template>
        <template v-else>
          <product-swiper v-if="list.length > 0" :prodList="list" :nextEl="'mp-swiper-button-next'" :prevEl="'mp-swiper-button-prev'">
            <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
              <div class="swiper-wrapper product-swiper-viewport">
                <div
                  v-for="(item, index) in list"
                  :title="item.shownGoodsName"
                  :key="index"
                  @click="itemClick(item, index)"
                  v-track.view.click="{ common: getBiParams(item, index + 1) }"
                  data-datalayer-category="MostPopular_Click"
                  data-datalayer-label="MostPopular_Click"
                  class="swiper-slide need_datalayer goods-item"
                >
                  <product-swiper-item :item="item" :miniSize="miniSize" :addSuffix="true" :index="index"></product-swiper-item>
                </div>
              </div>
            </div>
          </product-swiper>
        </template>
      </div>
    </template>
    <common-lazy-module v-else :radio="0.273" height="50"></common-lazy-module>
  </div>
</template>

<script>
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
import CommonLazyModule from '@/components/common/CommonLazyModule'
export default {
  name: 'MostPopularSkeleton',
  components: { ProductSwiper, ProductSwiperItem, CommonLazyModule },
  props: {
    skeleton: {
      type: Boolean,
      default() {
        return false
      }
    },
    mostPopularSSR: {
      type: [Object, null, undefined],
      default() {
        return undefined
      }
    },
    miniSize: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'page_index_most_popular_title'
    }
  },
  data() {
    return {
      hasData: false,
      mostPopular: {},
      MPSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 15,
        slidesPerGroup: 6,
        simulateTouch: false,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: '.mp-swiper-button-next',
          prevEl: '.mp-swiper-button-prev'
        }
      },
      list: [],
      abtestList: [[], []],
      mpSwipers: ['MPSwiper', 'MPSwiperS'],
      scrollDointFlag: false
    }
  },
  computed: {
    // abtestVersionB({ versionObj, $route }) {
    //   // todo：只有首页做abtest
    //   return versionObj.indexMostPolularAbtest === 'B' && $route.name == 'index'
    // }
  },
  watch: {
    skeleton: {
      handler() {
        if (!this.skeleton) this.fetchData()
      },
      immediate: true
    }
  },
  created() {
    if (this.mostPopularSSR) {
      this.hasData = true
      this.mostPopular = this.mostPopularSSR
      if (this.mostPopular.prodList) this.list = this.mostPopular.prodList
    }
  },
  methods: {
    getBiCommon(el) {
      const obj = {
        id: `Mostpopular-${el}`,
        common: {
          ec: 'Mostpopular',
          el
        }
      }
      // 如果是b版本，加上param2:'b'
      if (this.abtestVersionB) {
        obj.common.param2 = 'b'
      } else {
        obj.common.param2 = 'a'
      }
      return obj
    },
    fetchData() {
      if (process.server || this.hasData) return
      // todo: jira-14435首页模块做abtest，需要告知后端获取数据量 a: 20条,b: 36条
      const params = this.abtestVersionB ? { limit: 36, abtestVersion: 'b' } : {}
      const recentReviewed = localStorage.getItem('recently_viewed')
      const recentViewGoodList = localStorage.getItem('recent_view_good_list')
      params.recently_viewed = recentReviewed
      params.recent_view_good_list = recentViewGoodList
      this.$axios
        .$post('/1.0/recommend/recently-view-recommend', params)
        .then((data) => {
          if (+data.code !== 0) return
          this.mostPopular = data.data
          if (this.mostPopular.prodList) {
            this.list = this.mostPopular.prodList
            this.abtestVersionB && this.getAbtestList(this.mostPopular.prodList)
          }
        })
        .finally(() => {
          this.hasData = true
        })
    },
    itemClick(item, index) {
      this.$emit('mostPopularItemClick')
    },
    getBiParams(item, index) {
      if (process.server) return
      const params = {
        ec: 'Mostpopular',
        el: 'item' + index,
        param1: (location && location.href) || '-1',
        msg: JSON.stringify({
          goodsId: item.goodsId,
          color: item.color,
          cat_name: item.catName,
          dress_type: item.dressType || this.dressType,
          cat_id: item.catId
        })
      }
      // 如果是b版本，加上param2:'b'，否则'a'
      if (this.abtestVersionB) {
        params.param2 = 'b'
      } else {
        params.param2 = 'a'
      }
      return params
    },
    getAbtestList(list) {
      const abtestArr = [[], []]
      list.forEach((item, index) => {
        // todo: 这里的6后续往里传值
        if (Math.floor(Number(index / 6)) % 2 == 0) {
          abtestArr[0].push(item)
        } else {
          abtestArr[1].push(item)
        }
      })
      this.$set(this, 'abtestList', abtestArr)
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
  // abtest b 重写样式，影藏本有的左右切换
  .abtestB {
    position: relative;
    .common-a {
      margin-top: 0 !important;
      transform: translateY(-50%);
    }
    .prev-arraw {
      left: -4px;
    }
    .next-arraw {
      right: -4px;
    }
    .product-swiper-container {
      .prev-arraw,
      .next-arraw {
        display: none !important;
      }
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
