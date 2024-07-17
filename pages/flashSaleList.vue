<template>
  <div class="flash-sale-box">
    <div style="display:none">
      <h1>{{ nl('page_header_all_sale_flash_sale') }}</h1>
    </div>
    <main-app :navigation="navigation" :onlyFixedHeader="true" :isFlashSalePage="true" :adaptive="true">
      <div class="flash-sale-container">
        <div class="top-box">
          <img :src="addWebpSuffix(nl('page_image_flash_sale'))" class="flash-sale-icon" alt="flash-sale" />
          <flash-sale-list-timer :flashSaleBaseInfo="baseInfo"></flash-sale-list-timer>
        </div>
        <div v-if="flashSaleTips" class="flash-sale-tips listPage">
          <div v-html="flashSaleTips" class="flash-sale-tips-content"></div>
        </div>
        <flash-sale-list-empty v-if="isEmpty"></flash-sale-list-empty>
        <van-list
          id="product-swiper"
          v-if="!isEmpty"
          v-model="loading"
          :finished="pageInfo.page >= pageInfo.totalPage"
          :immediate-check="false"
          :offset="200"
          @load="onLoad"
          class="item-list prod-list van-clearfix"
        >
          <div
            v-for="(item, index) in prodList"
            :key="index"
            data-datalayer-category="FlashSale"
            data-datalayer-label="FlashSale_SizeLess_Click"
            class="need_datalayer goods-item"
            role="article"
          >
            <product-swiper-item
              :stickerClass="`flash-sale-item-icon`"
              :item="item"
              :isShowProgress="item.flashSaleInfo && item.flashSaleInfo.dullSale == 1 && isSpecialCatId(item.flashSaleInfo.catId)"
              :index="index"
            ></product-swiper-item>
          </div>
          <template> <i></i><i></i><i></i><i></i><i></i> </template>
          <div slot="loading" class="load-more">
            <i class="loading-hint"></i>
            <span class="loading-txt">{{ nl('page_common_loading') }}</span>
          </div>
        </van-list>
      </div>
      <scroll-to-top></scroll-to-top>
      <most-popular v-if="Object.keys(mostPopular).length > 0 && isEmpty" :mostPopular="mostPopular"></most-popular>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import ScrollToTop from '@/components/common/ScrollToTop'
import ProductSwiperItem from '@/components/product/productSwiperItem'
import FlashSaleListTimer from '@/components/flashSale/flashSaleListTimer'
import FlashSaleListEmpty from '@/components/flashSale/flashSaleListEmpty'
import MostPopular from '@/components/index/MostPopular'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'FlashSaleList',
  components: {
    ScrollToTop,
    MainApp,
    ProductSwiperItem,
    FlashSaleListTimer,
    FlashSaleListEmpty,
    MostPopular
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    isShowProgress() {
      return (item) => {
        return false
      }
    },
    isEmpty() {
      return !this.prodList || !Object.keys(this.prodList).length
    },
    flashSaleTips() {
      let showTips = ''
      if (this.baseInfo && this.baseInfo.tips && this.baseInfo.tips.listPage) {
        const tips = this.baseInfo.tips.listPage
        if (tips.startTime <= this.serverTime && tips.endTime >= this.serverTime && tips.content) {
          showTips = tips.content
        }
      }
      return showTips
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const query = commonAsyncData.requestUrl
      let goodId = ''
      let styleId = ''
      if (query.goods_id) {
        const params = query.goods_id.split('_')
        if (params.length) {
          goodId = params[0]
          styleId = params[1]
        }
      }
      const params = { page: 1, limit: 20, goodId, styleId, need_seo: true }
      const res = await context.$axios.$post('/1.0/list/flash-sale', params)
      if (res.code == 0) {
        // do something
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      context.store.commit('setJsKey', 'flash_sale')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        baseInfo: !Object.keys(res.data.baseInfo).length ? {} : res.data.baseInfo,
        prodList: res.data.prodList,
        pageInfo: res.data.pageInfo || {},
        goodId,
        styleId,
        mostPopular: res.data.mostPopular || {}
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
  mounted() {
    // 如果库存商品的剩余尺码数 等于1 或者2时曝光 sizeStock
    this.setDataLayer({ category: 'FlashSale', action: 'view', label: 'FlashSale_SizeLess_View' })
    if (Object.keys(this.mostPopular).length == 0) {
      this.getMostPopularList()
    }
  },
  methods: {
    onLoad() {
      this.getFlashSaleList(this.pageInfo.page + 1)
    },
    /**
     *  获取flash sale列表数据
     *  page
     *  limit
     *  styleId
     *  goodsId
     * */
    getFlashSaleList(page) {
      this.loading = true
      const query = this.$route.query
      let goodId = ''
      let styleId = ''
      if (query.goods_id) {
        const params = query.goods_id.split('_')
        if (params.length) {
          goodId = params[0]
          styleId = params[1]
        }
      }

      const params = {
        page,
        limit: this.pageInfo.limit,
        goodId,
        styleId
      }
      this.$axios.$post('/1.0/list/flash-sale', params).then((res) => {
        if (res.code == 0) {
          this.prodList = this.prodList.concat(res.data.prodList)
          this.mostPopular = res.data.mostPopular ? res.data.mostPopular : {}
          this.baseInfo = !Object.keys(res.data.baseInfo).length ? {} : res.data.baseInfo
          this.pageInfo = res.data.pageInfo || {}
          this.pageInfo.page = page
          if (this.pageInfo.page < this.pageInfo.totalPage) {
            this.loading = false
          }
        }
      })
    },
    getMostPopularList() {
      const recentReviewed = localStorage.getItem('recently_viewed')
      const recentViewGoodList = localStorage.getItem('recent_view_good_list')
      if (recentReviewed) {
        this.$axios
          .$post(`/1.0/recommend/recently-view-recommend`, {
            page: 1,
            limit: JSON.parse(recentReviewed).length,
            recently_viewed: recentReviewed,
            recent_view_good_list: recentViewGoodList
          })
          .then((res) => {
            if (res.code == 0) {
              if (res.data.prodList && res.data.prodList.length > 0) {
                this.$set(this, 'mostPopular', res.data)
              }
            }
          })
      }
    }
  }
}
</script>

<style lang="less">
.flash-sale-box {
  width: 100%;
  // min-width: 1263px;
  .flash-sale-container {
    padding: 0 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    max-width: 1353px;
    min-width: unset;
    width: 100%;
    margin: 30px auto 80px;
    .prod-list {
      display: flex;
      justify-content: space-between;
      width: 100%;
      background-color: #ffdfe1;
      padding: 0 24px 24px;
      box-sizing: border-box;
      flex-wrap: wrap;
      .goods-item {
        width: 230px;
        background-color: #fff;
        margin-top: 24px;
        &:hover {
          .goods-name {
            color: var(--color-121212) !important;
          }
        }
        .goods-item-a {
          .img-box {
            width: 100% !important;
            margin-bottom: 10px !important;
            &:after {
              content: '';
              display: block;
              padding-top: 138.4%;
              background: #f6f6f6;
            }
            .goods-img {
              position: absolute;
              width: 100% !important;
            }
          }
          .goods-name {
            margin: 0 !important;
            text-align: left !important;
            padding: 0 10px;
            width: 100% !important;
            box-sizing: border-box;
          }
          .goods-price-box {
            margin-top: 2px;
            padding: 0 10px;
            text-align: left !important;
          }
        }
      }
      i {
        width: 230px;
      }
      /deep/ .van-list__loading {
        width: 100%;
        .load-more {
          text-align: center;
          padding: 20px 0;
          .loading-hint {
            display: inline-block;
            height: 20px;
            width: 20px;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAP1BMVEUAAAD0KA/xJhHxJA7yJA7xJA7xJA7xJA7xJA7wJA7xJA7xJA7xJA7xJA7xJA7xJA3xJA7xJA7xJA7xJA7xJA5JCyllAAAAFXRSTlMACxdEI3NalDdn3LyvLstPoveIgOl7Sm+EAAABiklEQVRIx9XS0W7kIAxAUWyDwckAIfD/37owUyndbbMJrtSq92UeoiMbGHMWRqKciSKamSw5v23b462d7T0HVIc76NrbGK8h+153vgozi9u39ZW7wOSfSYB3pyY3JqdV4ByiG86FTw6xrSmlx+mZ4757X8PJPo/Uo5OPe4/MaTwGy6dfOvz/VeAY7OGjrPvOcHH9PqXFf9i21krmMrcsi/vnhg55bfPfr1Irm1v5bqM5ElcF7lFYl2WF46DOOTA3w/TuuNBlMLeTvjIeQ8XcD9LS9mOoNRPl1t7GBufYTLW29jotP4dOjk2mhyJi5oKltfG2UYTMZL4VN6aL2FnKpTzGjwjMUiyl9b1F2Ey3lILjlvI8XUshY5lpnm6l8KBhnvpSxETmOE/3UpySjo6Fv5UiMykp5JyNsk5BSUPOqL2nnKP2sERklHWq3pgoaDf+nWPVfwsK6rcNIVilxW7xB6wNMVqtjXqLnVrQWbAj+IJFHcanRQAlxhH0xiJza7/owIrpMOBrsK4L9wckTA/GBoy0fQAAAABJRU5ErkJggg==)
              no-repeat 0 0;
            background-size: 100% 100%;
            animation: rotate 1s infinite;
          }
          .loading-txt {
            padding-left: 12px;
            font-size: 16px;
            color: var(--color-121212);
            line-height: 20px;
            display: inline-block;
          }
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        }
      }
    }
  }
  .flash-sale-container {
    .top-box {
      margin-bottom: 25px;
      text-align: center;
      .flash-sale-icon {
        // width: 247px;
        height: 36px;
        // background: url(~assets/images/flash-sale.png) center center no-repeat;
        // background-size: 100% 100%;
        margin: 15px auto 9px;
      }
    }
    .flash-sale-tips {
      border: 1px solid #f1f1f1;
      border-width: 1px 0;
      line-height: 18px;
      text-align: center;
      margin-bottom: 10px;
      padding: 10px 0;
      .flash-sale-tips-content {
        display: inline-block;
        font-size: 13px;
        position: relative;
        padding-left: 27px;
        .underline {
          color: var(--color-121212);
          text-decoration: underline;
        }
        .tip-deep {
          color: var(--color-121212);
        }
        &:before {
          content: '';
          display: inline-block;
          width: 17px;
          height: 16px;
          background: url(~assets/images/flashSale/icon-flash-sale-tips.png) center center/100% 100% no-repeat;
          background-size: 100% 100%;
          vertical-align: middle;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
  /deep/ .az-with-code-box {
    justify-content: flex-start !important;
  }
}
</style>
