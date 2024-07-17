<template>
  <div class="pre-sale-list-page">
    <main-app ref="main" :navigation="navigation" :adaptive="true">
      <quick-shop-dialog ref="quickShopDialog" :fromDialog="'list'"></quick-shop-dialog>
      <div class="pre-sale-list-page-top-menu">
        <a
          v-for="(item, index) in moreToExplore"
          :key="index"
          :href="countryUrl(item.url)"
          v-track.view.click="{ common: getBiParams(item.title, index + 1) }"
          class="pre-sale-list-page-top-menu-item"
        >
          <img
            v-if="item.url.includes('/all/guest-of-wedding-dresses')"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/demo/gif/aa/d2/c7c8e35d3d1d80fc2a0bed1fd734aad2.gif')"
            class="hot"
            alt="Flame dynamic diagram"
          />
          <span>{{ item.title }}</span>
          <!-- v-if="item.url.includes('/all/kendallkylieSOD-collection')" -->
          <img
            v-if="item.url.includes('/all/winter-wedding-guest-dresses')"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/c0/25/b6dac4449a0c72d9e10c889948ecc025.png')"
            class="heart"
            alt="Flame dynamic diagram"
          />
        </a>
      </div>
      <div class="pre-sale-list-page-container">
        <div :class="['pre-sale-list-page-banner', { minH: !loaded }]">
          <img id="top-banner-img" @load="loaded = true" :src="nl('page_image_doll_house_collection_banner')" alt="presale banner" />
          <div @click="listBoxInToView()" class="click-area"></div>
          <!-- <div class="pre-sale-video-box">
            <video id="preVideo" :poster="posterUrl" @click="pauseVideo" :loop="loop" autoplay muted>
              <source src="https://cdn-1.azazie.com/video/PINK-CLONING_2.mp4" />
            </video>
            <az-icon
              v-track.viewOnce.click="{ id: 'presalevideo', common: { el: 'presalevideo', ec: 'presalevideo' } }"
              v-if="showPlay"
              @click="playVideo"
              icon-class="az-review-play-icon"
            ></az-icon>
          </div> -->
        </div>
        <div class="pre-sale-list-page-box">
          <div class="pre-sale-list-page-box-title">
            <!-- {{ nl('page_common_sod_preorder_text6') }} -->
            <span>
              {{ nl('page_common_sod_preorder_text9') }}
            </span>
            <img src="https://cdn-1.azazie.com/upimg/userfiles/images/c0/25/b6dac4449a0c72d9e10c889948ecc025.png" alt="heart img" />
          </div>
          <div class="pre-sale-list-page-box-product">
            <product-list :isProductsSplit="false" :resetDisplay="false" @quickShop="quickShopClick" @notify-me="notifyMe"></product-list>
          </div>
        </div>
      </div>
      <NotifyMeDialog v-if="openNotifyMe" :item="currentItem" :style-info="{}" />
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import ProductList from '@/components/list/ProductList'
// import QuickShopDialog from '@/components/quickshop/QuickShopDialog'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import backToTop from '@/components/common/BackToTop'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import colorHex from '@/assets/js/colorHex'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog')
})

export default {
  name: 'PreorderList',
  components: {
    mainApp,
    backToTop,
    QuickShopDialog,
    ProductList,
    NotifyMeDialog
  },
  mixins: [colorHex],
  data() {
    return {
      loaded: false,
      posterUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/3b/57/89be0d6b0acead6776c33d445ba33b57.jpg',
      showPlay: false,
      currentItem: {},
      loop: true
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      context.store.commit('setJsKey', 'pre-sale-list')
      context.store.commit('product/setPresaleGoods', true)
      const [result, colorHexRes] = await Promise.all([
        context.$axios.get('/1.0/list/preorder-landing-page?sale_key=fall-wedding-guest'),
        context.$axios.$get('/1.0/common/color-hex')
      ])
      if (!result.data || result.data.code == 5) {
        context.error({
          statusCode: 200,
          message: result.msg ? result.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (result.data.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      }
      if (colorHexRes.code == 0) {
        context.store.commit('setColorHex', colorHexRes.data.colorHex)
      }
      const preorderData = result.data.data || {}
      const { moreToExplore = [], bannerImage, productList = [] } = preorderData
      context.store.commit('list/setProdList', productList)
      context.store.commit('list/setViewSwitch', 'smaller')
      context.store.commit('setCatId', 3)
      return {
        ...commonAsyncData,
        moreToExplore,
        bannerImage,
        productList,
        dataLayerInfo: result.data.dataLayerInfo
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
      return {
        ...getHeadJson(this)
      }
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.video = document.getElementById('preVideo')
    //   this.video.addEventListener('ended', () => {
    //     this.showPlay = true
    //   })
    // })
  },
  methods: {
    getBiParams(attr1, index) {
      if (process.server) return
      let resEl = attr1
      if (attr1 && String(attr1).length > 0) {
        resEl = attr1.replace(/\s/g, '').toLowerCase()
      }
      return {
        ec: 'presalesellpoint',
        el: resEl,
        msg: JSON.stringify({ attr1: index })
      }
    },
    // notifyme
    notifyMe(item) {
      this.$set(this, 'currentItem', item)
      this.$store.commit('setOpenNotifyMe', true)
    },
    playVideo() {
      this.showPlay = false
      this.video.play()
      this.loop = false
    },
    pauseVideo() {
      this.showPlay = true
      this.video.pause()
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    listBoxInToView() {
      const targetDom = document.querySelector('.pre-sale-list-page-container .pre-sale-list-page-box')
      window.scrollTo({
        top: targetDom.offsetTop - 50,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pre-sale-list-page {
  // min-width: 1263px;
  /deep/ #coupon-box {
    display: none;
  }
  &-top-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 15px;
    &-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 3px;
      background-color: #f8f2ef;
      font-family: @font-family-600;
      font-size: 14px;
      max-height: 60px;
      overflow: hidden;
      padding: 20px 0;
      text-align: center;
      color: var(--color-121212);
      box-sizing: border-box;
      .hot {
        width: 15px;
        vertical-align: text-top;
      }
      .heart {
        width: 14px;
        vertical-align: text-top;
      }
    }
  }
  &-container {
    max-width: 1600px;
    padding: 0 20px;
    box-sizing: border-box;
    margin: 0 auto;
  }
  &-banner {
    position: relative;
    margin: 20px auto 60px;
    font-size: 0;
    background: url('~assets/images/goodsList/img-bg.png') no-repeat center center/ 74px 80px, var(--color-f9f9f9);
    &.minH {
      min-height: 400px;
    }
    img {
      display: block;
      width: 100%;
    }
    .click-area {
      position: absolute;
      top: 55%;
      right: 15%;
      height: 70px;
      width: 340px;
      background-color: transparent;
      z-index: 1;
      cursor: pointer;
    }
    .pre-sale-video-box {
      position: absolute;
      left: 160px;
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.5s ease;
      video {
        max-width: 270px;
        max-height: 480px;
      }
      .az-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 90px;
        transform: translate(-50%, -50%);
        z-index: 1;
      }
    }
    @media screen and (max-width: 1560px) {
      .pre-sale-video-box {
        left: 120px;
        video {
          max-width: 250px;
        }
      }
      .az-icon {
        font-size: 80px;
      }
    }
    @media screen and (max-width: 1400px) {
      .pre-sale-video-box {
        left: 100px;
        video {
          max-width: 220px;
        }
      }
      .az-icon {
        font-size: 60px;
      }
    }
  }
  &-box {
    margin: 10px auto 30px;
    &-title {
      display: flex;
      align-items: center;
      column-gap: 3px;
      margin-bottom: 30px;
      font-family: @font-family-600;
      font-size: 24px;
      line-height: 33px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--color-121212);
      img {
        width: 22px;
      }
    }
    &-product {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 30px 20px;
      /deep/ .presale-item {
        width: calc((100% - 80px) / 5);
      }
    }
  }
}
</style>
