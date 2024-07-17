<template>
  <div>
    <main-app :navigation="navigation">
      <div class="prom-intro-box">
        <div v-if="topInfo && topInfo.thumb" v-track.view.click="{ common: getBiParams('topBanner') }">
          <video
            id="prom-intro-video"
            ref="video"
            :poster="replaceImgCdnUrl(`https://cdn-1.azazie.com/upimg/userfiles/images/SOD/01/47/0f3babd19eb1d776acff02f72cde0147.jpg`)"
            width="100%"
            height="auto"
            x5-video-player-fullscreen
            x5-playsinline
            webkit-playsinline
            playsinline
            muted
            autoplay
            loop
            disablepictureinpicture
          >
            <source :src="topInfo.thumb.imgUrl" type="video/mp4" />
          </video>
        </div>
        <div class="prom-intro-top">
          <div class="prom-intro-title">{{ nl('page_prom_intro_top_title') }}</div>
          {{ nl('page_prom_intro_top_desc') }}
        </div>
        <prom-new-arrival-item v-if="goodsList1 && goodsList1.prodList" :listData="goodsList1" :biMsg="getBiParams('newArrivals')" />
        <template v-if="shopByStyle && shopByStyle.list">
          <div class="theme-banner-title">
            {{ shopByStyle.title }}
          </div>
          <div class="theme-banner-wrapper">
            <div
              v-for="(item, index) in shopByStyle.list"
              :key="index"
              v-track.view.click="{ common: getBiParams('themeBanner', index) }"
              class="theme-banner-item"
            >
              <a :href="countryUrl(item.linkUrl)" aria-label="shop by style">
                <img :src="replaceImgCdnUrl(item.imgUrl)" alt="shop by style" class="img-item lazyload" />
              </a>
            </div>
          </div>
          <div class="theme-shop-all">
            <az-button @click="shopAll(`${HTTPS_HOST}/all/party-prom-dresses`)" class="btn btn-default">{{
              nl('page_index_shop_all_styles')
            }}</az-button>
          </div>
        </template>
        <template v-if="goodsList2 && goodsList2.prodList">
          <div class="goods-list2-title">
            {{ nl(goodsList2.title) }}
          </div>
          <product-swiper
            :prodList="goodsList2.prodList"
            :nextEl="`prom-most-popular-swiper-btn-next`"
            :prevEl="`prom-most-popular-swiper-btn-prev`"
            class="product-swiper-box"
          >
            <div ref="MPSwiper" v-swiper:MPSwiper="MPSwiperOptionMostPopular" class="new-arrival-container swiper-container">
              <div class="swiper-wrapper product-swiper-viewport">
                <div
                  v-for="(item, index) in goodsList2.prodList"
                  :key="`list2` + index"
                  v-track.view.click="{ common: getBiParams('mostPopular', index, item) }"
                  class="goods-item swiper-slide"
                >
                  <product-swiper-item :item="item" :miniSize="false" :noFavIcon="true" :index="index"></product-swiper-item>
                </div>
              </div>
            </div>
          </product-swiper>
          <div class="btn-back-top-container">
            <az-button @click="scrollToTop" class="btn-back-top">{{ nl('page_back_to_top') }}</az-button>
          </div>
        </template>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
import AzButton from '@/components/az-ui/Button/AzButton'
import promNewArrivalItem from '@/components/prom/PromNewArrivalItem'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  name: 'PromDressIntro',
  components: {
    mainApp,
    ProductSwiperItem,
    promNewArrivalItem,
    AzButton,
    ProductSwiper
  },
  data() {
    return {
      topInfo: null,
      shopByStyle: null,
      goodsList1: null,
      goodsList2: null,
      MPSwiperOptionMostPopular: {
        slidesPerView: 6,
        // spaceBetween: '1.16%',
        spaceBetween: 15,
        slidesPerGroup: 6,
        simulateTouch: false,
        // loop: true,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: `.prom-most-popular-swiper-btn-next`,
          prevEl: `.prom-most-popular-swiper-btn-prev`
        }
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const url = '/1.0/webpage/prom-intro'
      const result = await context.$axios.$get(url, { params: { version: 'a' } })
      const { topInfo, shopByStyle } = (result && result.data) || {}
      const videoInfo = topInfo && topInfo.length ? topInfo[0] : null
      const list = [
        {
          key: 'party-prom-dresses',
          dressType: 'dress',
          sortBy: 'new_arrival',
          maxLength: 10,
          title: 'page_prom_title_text1'
        },
        {
          key: 'party-prom-dresses',
          dressType: 'dress',
          sortBy: 'popularity',
          maxLength: 6,
          title: 'page_prom_title_text2'
        }
      ]
      let productList = await Promise.all(
        list.map((item, index) => {
          const { key, dressType = 'dress', sortBy = 'popularity', maxLength = 10 } = item
          return context.$axios.$post(
            '/1.0/list/products',
            { filters: { sortBy: [sortBy] }, view_mode: [], originUrl: commonAsyncData.requestUrl },
            {
              params: {
                cat_name: key,
                dress_type: dressType,
                page: 1,
                limit: maxLength,
                in_stock: ''
              }
            }
          )
        })
      )
      productList = productList.map((item, index) => {
        return item.code === 0 && !item.data.empty
          ? {
              ...list[index],
              prodList: item.data.prodList,
              pageInfo: item.data.pageInfo
            }
          : {
              ...list[index],
              prodList: [],
              pageInfo: { totalCount: 0 }
            }
      })
      return {
        ...commonAsyncData,
        shopByStyle,
        topInfo: videoInfo,
        goodsList1: productList[0],
        goodsList2: productList[1]
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    shopAll(url) {
      window.location.href = url
    },
    getBiParams(key, index, goodsInfo) {
      const eventMap = {
        topBanner: {
          ec: 'promdresses',
          el: 'topbanner'
        },
        newArrivals: {
          ec: 'newarrivals',
          el: 'items'
        },
        themeBanner: {
          ec: 'promdresses',
          el: 'Thememodulebanner'
        },
        mostPopular: {
          ec: 'mostpopular',
          el: 'items'
        }
      }
      const eventData = eventMap[key]
      if (eventData) {
        if (goodsInfo) {
          const { goodsId, catName, color } = goodsInfo
          eventData.msg = JSON.stringify({
            index: index + 1,
            goodsId,
            color,
            cat_name: catName
          })
        }
        index && (eventData.el = eventData.el + index)
      }
      return eventData
    },
    scrollToTop() {
      window.scroll(0, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.prom-intro-box {
  box-sizing: border-box;
  max-width: 1353px;
  width: 100%;
  clear: both;
  padding: 0;
  margin: auto;
  padding: 0 30px 0;
  .prom-intro-top {
    padding: 30px;
    margin-top: -5px;
    font-size: 16px;
    line-height: 26px;
    font-style: normal;
    font-weight: 400;
    text-align: center;
    background-color: var(--color-f1e9e6);
    .prom-intro-title {
      font-size: 36px;
      line-height: 49px;
      text-align: center;
      margin: 0 0 15px;
    }
  }
  .theme-banner-title {
    padding: 50px 0 40px 0;
    font-family: @font-Ivy-Mode-400;
    font-style: normal;
    font-weight: normal;
    font-size: 36px;
    line-height: 45px;
    text-align: center;
    color: var(--color-121212);
  }
  .theme-banner-wrapper {
    display: flex;
    justify-content: space-between;
    .theme-banner-item {
      width: calc((100% - 30px) / 3);
      height: 100%;
      .img-item {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .theme-shop-all {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .btn {
      height: auto;
      padding: 15px 50px;
      font-family: @font-family-600;
      font-size: 14px;
      text-align: center;
      &:hover {
        background-color: var(--color-1e1e1e);
      }
    }
  }
  .goods-list2-title {
    padding: 30px 0 10px 0;
    margin-top: 20px;
    font-family: @font-Ivy-Mode-400;
    font-size: 24px;
    line-height: 25px;
    border-bottom: 1px solid #ccc;
  }
  .product-swiper-box {
    margin-top: 30px;
  }
  .btn-back-top-container {
    display: flex;
    justify-content: center;
    margin: 50px 0 50px 0;
    .btn-back-top {
      padding: 15px 60px;
      text-transform: uppercase;
    }
  }
}
</style>
