<template>
  <main-app :navigation="navigation">
    <div class="mix-and-match">
      <div class="content">
        <!-- banner -->
        <div v-track.viewOnce="{ common: getBiParams('topbanner') }" class="banner-top">
          <img
            v-track.click="{ common: getBiParams('topbannerbackground') }"
            :data-src="mixMatchPageData.banner.topBanner"
            :src="require('~/assets/images/default_img.jpg')"
            @click.self="clickBannerTop"
            class="lazyload"
            alt="mix and match top banner"
          />
          <!-- 热区-->
          <ImageHotSpot :positions="getPositionArr" :ec="'mixandmatchpage'" />
        </div>
        <!-- 流行色推荐 -->
        <div class="trending-color-box">
          <div class="trending-color-content">
            <div class="title">{{ nl('page_mixandmatach_trending_color_title') }}</div>
            <trending-color :mixMatchData="mixMatchPageData.popularColor"></trending-color>
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
        <a v-track.viewOnce.click="{ common: getBiParams('stylegallery') }" href="/style-gallery" aria-label="mix and match bottom banner">
          <img :src="mixMatchPageData.banner.bottomBanner" class="banner-bottom" alt="mix and match bottom banner" />
        </a>
        <!-- seo -->
        <seo-content v-if="seoInfo && seoInfo.content" :content="seoInfo.content" class="seo-content"></seo-content>
      </div>
    </div>
    <quick-shop-dialog ref="quickShopDialog" @refreshCartList="getCartInfo()"></quick-shop-dialog>
  </main-app>
</template>

<script>
import mainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import SeoContent from '@/components/sale/SaleSeoContent'
import { getHeadJson } from '@/plugins/head'
import bannerMixins from '@/assets/js/bannerMixins'
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
  name: 'MixAndMatchBridesmaidDresses',
  components: {
    mainApp,
    SeoContent,
    ColorRecommend,
    TrendingColor,
    QuickShopDialog
  },
  mixins: [bannerMixins],
  data() {
    return {
      pageName: 'mixandmatch',
      colorFamilyList: [], // 首屏返回color-recoomend组件所有颜色
      colorRecommentList: [] // 实际渲染color-recoomend组件数组
    }
  },
  computed: {
    // 定义热区位置
    getPositionArr() {
      const positionMap = {
        es: [
          {
            name: 'shopbddresses',
            url: '/all/bridesmaid-dresses',
            width: '0.24',
            height: '0.11',
            x: '0.573',
            y: '0.69',
            newWindows: false
          },
          {
            name: 'freeswatch',
            url: '/promotion/free-swatch',
            width: '0.15',
            height: '0.45',
            x: '0.025',
            y: '0.45',
            newWindows: false
          }
        ],
        nl: [
          {
            name: 'shopbddresses',
            url: '/all/bridesmaid-dresses',
            width: '0.245',
            height: '0.11',
            x: '0.57',
            y: '0.615',
            newWindows: false
          },
          {
            name: 'shoptryondress',
            url: '/all/sample-bridesmaids?current_in_stock=yes',
            width: '0.245',
            height: '0.11',
            x: '0.57',
            y: '0.765',
            newWindows: false
          },
          {
            name: 'freeswatch',
            url: '/promotion/free-swatch',
            width: '0.15',
            height: '0.45',
            x: '0.025',
            y: '0.45',
            newWindows: false
          }
        ],
        defalut: [
          {
            name: 'shopbddresses',
            url: '/all/bridesmaid-dresses',
            width: '0.24',
            height: '0.11',
            x: '0.59',
            y: '0.63',
            newWindows: false
          },
          {
            name: 'shoptryondress',
            url: '/all/sample-bridesmaids?current_in_stock=yes',
            width: '0.24',
            height: '0.11',
            x: '0.59',
            y: '0.78',
            newWindows: false
          },
          {
            name: 'freeswatch',
            url: '/promotion/free-swatch',
            width: '0.15',
            height: '0.45',
            x: '0.025',
            y: '0.45',
            newWindows: false
          }
        ]
      }
      return positionMap[this.language] ? positionMap[this.language] : positionMap.defalut
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const params = {
        hasTitle: true, // boolen类型 传参true返回页面信息 第一次加载必须传参 false时只返回色系推荐信息
        mmLandingPage: 'mix_match' // string类型 区分获取字段 默认值mix_match: popularColor / swatch: topSwatchGoods
      }

      const { data: mixMatchPageData } = await context.$axios.$get(`/1.0/mix-match-page`, { params })
      const colorHexRes = await context.$axios.$get('/1.0/common/color-hex')

      // 列表页将colorHex放在首屏里面，优化页面渲染
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      }

      return {
        ...commonAsyncData,
        mixMatchPageData
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
  mounted() {
    this.colorFamilyList = this.mixMatchPageData.colorFamilyList
    this.colorRecommentList = this.mixMatchPageData.colorFamilyList.slice(0, 3) // 页面初始化加载3个固定色系
    this.setPoint('mixandmatchpage', 'pageview', 'view')
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    clickBannerTop() {
      location.href = this.countryUrl('/all/bridesmaid-dresses')
    },
    loadMore(color) {
      const index = this.colorFamilyList.findIndex((item) => item === color) // 查找对应色系的index
      if (index < 8 && index + 1 >= this.colorRecommentList.length) {
        this.colorRecommentList.push(this.colorFamilyList[index + 1]) // 若index+1大于等于色系模块数量 则加载新色系
      }
    },
    getBiParams(el) {
      if (process.server) return
      return {
        ec: 'mixandmatchpage',
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
.mix-and-match {
  .banner-top {
    display: block;
    position: relative;
    cursor: pointer;
    img {
      width: 100%;
      height: auto;
    }
    .tips {
      display: block;
      width: 246px;
      height: 280px;
      position: absolute;
      left: 75px;
      bottom: 45px;
    }
    .sign {
      width: 105px;
      height: 105px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-121212);
      color: #fff;
      text-align: center;
      font-family: @font-family-500;
      font-size: 18px;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 100px;
      position: absolute;
      left: 56px;
      bottom: 51px;
      cursor: pointer;
    }
  }
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

.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.47;
}

@media screen and (max-width: 1600px) {
  .seo-content {
    padding: 0 30px;
  }
}
</style>
