<template>
  <main-app :navigation="navigation" is-show-subscribe="hide">
    <div class="free-swatch">
      <div class="main-content promotion-main clearfix">
        <!-- 邮件订阅banner -->
        <free-swatch-main></free-swatch-main>
        <!-- 流行色推荐 -->
        <div v-track.viewOnce="{ common: getBiParams('swatch') }" v-if="freeSwatchPageData.topSwatchGoods" class="trending-color-box">
          <div class="trending-color-content">
            <div class="title">{{ nl('page_mixandmatach_trending_color_title') }}</div>
            <trending-color :swatch-mode="true" :swatch-data="freeSwatchPageData.topSwatchGoods"></trending-color>
          </div>
        </div>
        <!-- 色系推荐商品 -->
        <div class="color-recommend-content">
          <template v-for="(item, index) in colorRecommentList">
            <color-recommend
              :key="index"
              :current-color="item"
              :page-name="pageName"
              @load-more="loadMore"
              @quick-shop="quickShopClick"
            ></color-recommend>
          </template>
        </div>
        <!-- 底部banner -->
        <a v-track.viewOnce.click="{ common: getBiParams('stylegallery') }" href="/style-gallery" aria-label="mix and match top banner">
          <img :src="freeSwatchPageData.banner.bottomBanner" class="banner-bottom" alt="free swatch bottom banner" />
        </a>
        <!-- seo -->
        <seo-content v-if="seoInfo && seoInfo.content" :content="seoInfo.content" class="seo-content"></seo-content>
      </div>
    </div>
    <quick-shop-dialog ref="quickShopDialog" @refreshCartList="getCartInfo()"></quick-shop-dialog>
  </main-app>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import FreeSwatchMain from '@/components/promotion/FreeSwatchMain'
import SeoContent from '@/components/sale/SaleSeoContent'
import ColorRecommend from '@/components/mix-and-match/ColorRecommend' // 色系推荐商品组件
import TrendingColor from '@/components/mix-and-match/TrendingColor' // trending color组件
import AzLoading from '@/components/az-ui/Loading/AzLoading'

const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog'),
  // 异步组件加载时使用的组件
  loading: AzLoading
})

export default {
  name: 'FreeSwatch',
  components: { MainApp, FreeSwatchMain, SeoContent, ColorRecommend, TrendingColor, QuickShopDialog },
  data() {
    return {
      pageName: 'freeswatchpage',
      colorFamilyList: [], // 首屏返回color-recoomend组件所有颜色
      colorRecommentList: [], // 实际渲染color-recoomend组件数组,
      loaded: false
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'freeswatch')

      const params = {
        hasTitle: true, // boolen类型 传参true返回页面信息 第一次加载必须传参 false时只返回色系推荐信息
        mmLandingPage: 'swatch' // string类型 区分获取字段 默认值mix_match: popularColor / swatch: topSwatchGoods
      }

      const { data: freeSwatchPageData } = await context.$axios.$get(`/1.0/mix-match-page`, { params })
      const colorHexRes = await context.$axios.$get('/1.0/common/color-hex')

      // 列表页将colorHex放在首屏里面，优化页面渲染
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      }

      return {
        ...commonAsyncData,
        freeSwatchPageData
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
  created() {
    this.colorFamilyList = this.freeSwatchPageData.colorFamilyList
    this.colorRecommentList = this.freeSwatchPageData.colorFamilyList.slice(0, 3) // 页面初始化加载3个固定色系
  },
  mounted() {
    this.setPoint('freeswatchpage', 'pageview', 'view')
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    loadMore(color) {
      const index = this.colorFamilyList.findIndex((item) => item === color) // 查找对应色系的index
      if (index < 8 && index + 1 >= this.colorRecommentList.length) {
        this.colorRecommentList.push(this.colorFamilyList[index + 1]) // 若index+1大于等于色系模块数量 则加载新色系
      }
    },
    getBiParams(el) {
      if (process.server) return
      return {
        ec: 'freeswatchpage',
        el
      }
    },
    // 引入quick-shop
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
      this.setOrderSourceFlag('freewatchpage', true)
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
    }
  }
}
</script>

<style lang="less" scoped>
.free-swatch {
  .trending-color-box {
    margin: 0 auto;
    padding: 80px 30px;
    background: #fdfcf6;
    .trending-color-content {
      max-width: 1600px;
      margin: 0 auto;
    }
    .title {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-Ivy-Mode-400;
      font-size: 48px;
      line-height: 60px; /* 125% */
      letter-spacing: 2.88px;
      text-transform: uppercase;
      margin-bottom: 30px;
    }
  }
  .banner-bottom {
    margin: 80px 0;
    width: 100%;
  }
}

.seo-content {
  box-sizing: border-box;
  max-width: 1600px;
  clear: both;
  padding: 0;
  margin: 0 auto;
}

/deep/ .sale-seo-content h1 {
  margin: 0 0 15px;
}

/deep/ .az-footer-box {
  margin-top: 80px;
}

.promotion-main {
  clear: both;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 600px;
}

@media screen and (max-width: 1600px) {
  .seo-content {
    padding: 0 30px;
  }
}
</style>
