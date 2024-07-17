<template>
  <div>
    <main-app :navigation="navigation">
      <div v-if="online == 'In progress'">
        <div
          v-for="(moduleItem, index) in modules"
          :key="index"
          :id="'module_load_' + index"
          :class="{ 'full-screen': moduleItem.isShowNotice }"
          class="module-content-item"
        >
          <!-- banner -->
          <template v-if="moduleItem.moduleType === 'banner'">
            <CommonBannerSwiper :bannerList="moduleItem.imageList" :moduleIndex="index" :ec="'new landingpage banner'" />
          </template>
          <!-- 商品行 -->
          <template v-if="moduleItem.moduleType === 'product'">
            <div class="module-content-product">
              <p class="module-title"><img :src="addWebpSuffix(moduleItem.imgUrl)" alt="landingpage" /></p>
              <LandingActivityList :moduleIndex="index" :productTabList="moduleItem.productTabList" />
            </div>
          </template>
        </div>
      </div>
      <!-- 年中大促结束页 -->
      <div v-else-if="midYearEnd" class="mid-year-box">
        <div v-if="midYearEndBanner">
          <a :href="countryUrl('/all/bridesmaid-dresses')" aria-label="mid year" class="btn-continue"
            ><img :src="addWebpSuffix(midYearEndBanner)" alt="mid year banner"
          /></a>
        </div>
        <div v-if="['US', 'CA'].includes(country)" class="sale-content">
          <sale-first-banner :categoriesBanners="categoriesBanners"></sale-first-banner>
          <sale-list :prodReqListData="prodReqListData" :hasData="hasData"></sale-list>
          <sale-footer-banner :footerBanners="footerBanners"></sale-footer-banner>
          <sale-seo-content v-if="seoInfo && seoInfo.content" :content="seoInfo.content"></sale-seo-content>
        </div>
      </div>
      <!-- 常规结束页 -->
      <div v-else-if="online == 'Finished'" class="page404-box">
        <div class="guided-entry-menu">
          <a
            v-for="(item, index) in settled"
            :key="index"
            v-track.view.click="{ common: getBiParams('404_error', item.cat_name.toLowerCase()) }"
            :href="countryUrl(item.url)"
            class="guided-entry-menu-item"
          >
            {{ item.title }}
          </a>
        </div>
        <div class="page404-main">
          <div class="content">
            <p class="desc-text">{{ nl('page_landing_activity_end') }}</p>
            <template v-if="tips.button">
              <div v-for="(item, key, index) in tips.button" :key="key">
                <a
                  v-track.view.click="{ common: getBiParams('404_error', 'shop_similar', key) }"
                  :href="countryUrl(item.linkUrl)"
                  :class="index === 0 ? 'btn-theme' : 'btn-white'"
                  class="btn"
                >
                  <span>{{ item.desc }}</span>
                </a>
              </div>
            </template>
            <template v-else>
              <p>
                <a id="btn-shop-bridesmaids" :href="countryUrl('/all/bridesmaid-dresses')" class="btn btn-theme">
                  <span>{{ nl('page_common_shop_bridesmaids') }}</span>
                </a>
              </p>
              <p>
                <a id="btn-shop-brides" :href="countryUrl('/all/wedding-dresses')" class="btn btn-white">
                  <span>{{ nl('page_common_shop_brides') }}</span>
                </a>
              </p>
            </template>
          </div>
          <most-popular
            v-if="allGoods.prodList && Object.keys(allGoods.prodList).length > 0"
            :title="allGoods.title"
            :mostPopular="allGoods"
            scene="404_error"
          ></most-popular>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import MainApp from '@/components/Main'
import LandingActivityList from '@/components/landingPage/LandingActivityList'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import MostPopular from '@/components/index/MostPopular'
import SaleFirstBanner from '@/components/sale/SaleFirstBanner'
import SaleList from '@/components/sale/SaleList'
import SaleFooterBanner from '@/components/sale/SaleFooterBanner'
import SaleSeoContent from '@/components/sale/SaleSeoContent'
import CommonBannerSwiper from '@/components/common/CommonBannerSwiper'
export default {
  name: 'LandingActivity',
  components: {
    MainApp,
    LandingActivityList,
    MostPopular,
    SaleFirstBanner,
    SaleList,
    SaleFooterBanner,
    SaleSeoContent,
    CommonBannerSwiper
  },
  data() {
    return {
      modules: [],
      prodReqListData: [],
      hasData: true
    }
  },
  computed: {
    midYearEndBanner() {
      const bannerMap = {
        'us-en': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/79/8d/9f2bbac5998b3a35a0c3c41c7972798d.jpg',
        'us-es': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/b4/f5/7cfe9a2eb214a80c4d837604642bb4f5.jpg',
        'ca-en': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/79/8d/9f2bbac5998b3a35a0c3c41c7972798d.jpg',
        'ca-fr': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/02/d6/6791598f2b4d1c95902f14db6aab02d6.jpg',
        'gb-en': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/79/8d/9f2bbac5998b3a35a0c3c41c7972798d.jpg',
        'ie-en': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/79/8d/9f2bbac5998b3a35a0c3c41c7972798d.jpg',
        'au-en': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/79/8d/9f2bbac5998b3a35a0c3c41c7972798d.jpg',
        'de-de': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/7c/06/3372df64af089f91ce8a104413427c06.jpg',
        'de-en': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/79/8d/9f2bbac5998b3a35a0c3c41c7972798d.jpg',
        'fr-fr': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/02/d6/6791598f2b4d1c95902f14db6aab02d6.jpg',
        'es-es': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/b4/f5/7cfe9a2eb214a80c4d837604642bb4f5.jpg',
        'it-it': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/4b/2d/1c393bdcf0445724da728568cd4f4b2d.jpg',
        'nl-nl': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/a8/d9/ec1538be4987c163051c301aed87a8d9.jpg',
        'de-nl': 'https://cdn-1.azazie.com/upimg/userfiles/multiway/a8/d9/ec1538be4987c163051c301aed87a8d9.jpg'
      }
      return bannerMap[`${this.country.toLowerCase()}-${this.language}`] || ''
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      if (commonAsyncData.requestUrl.startsWith('/mid-year-semi-annual-sale')) query.subject = 'Semi-Annual-Sale'
      const res = await context.$axios.$get('/1.0/activityPage/v2/get?subject=' + query.subject)
      if (res.code != 0) {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      const { content, online } = res.data
      let modules = []
      let endInfo = {}
      let midYearEnd = false // 年中大促结束页
      let categoriesBanners = {}
      let footerBanners = {}
      let prodReqList = []
      if (content) modules = content.filter((item) => !item.hiddenModule) // 配置结果

      if (online == 'Not started' || !online) {
        context.redirect(302, context.store.state.currentCountryUrl + '/404')
        return
      } else if (online == 'Finished') {
        // 年中大促结束页，调all sale接口
        if (query.subject == 'Semi-Annual-Sale') {
          midYearEnd = true
          const saleRes = await context.$axios.$get('/1.0/sale/landing', {
            params: {
              saleTopVersion: context.store.state.versionGroup.banner_sale_top,
              saleFooterVersion: context.store.state.versionGroup.banner_sale_footer
            }
          })
          // code等于5表明redis链接失败，需要用户刷新重试
          if (saleRes.code === 0) {
            categoriesBanners = saleRes.data.categoryBanners
            footerBanners = saleRes.data.footerBanners
            prodReqList = saleRes.data.list || []
          }
        } else {
          // 常规活动落地页调404接口
          const params = {
            originUrl: context.route.query.originUrl
          }
          const p404Res = await context.$axios.$get(`/1.0/error/p404`, { params })
          if (p404Res.code == 0) {
            const { Tips, goods, settled } = p404Res.data
            endInfo = { tips: Tips, allGoods: goods, settled }
          }
        }
      }

      context.store.commit('setJsKey', 'landing_activity')

      return {
        ...commonAsyncData,
        modules,
        online,
        ...endInfo,
        midYearEnd,
        categoriesBanners,
        footerBanners,
        prodReqList
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
    this.getProdReqListData()
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    getBiParams(ec, el, url = '') {
      if (process.server) return
      const obj = {
        ec: ec || 'landingpage',
        el: el || 'landingpage',
        msg: JSON.stringify({ url })
      }
      return obj
    },
    async getProdReqListData() {
      // 获取商品模块的接口挪到客户端请求
      this.hasData = false
      const prodReqListData = await Promise.all(
        this.prodReqList.map((item) => {
          if (item.key == 'flash-sale') {
            return this.$axios.$post('/1.0/list/flash-sale', { page: 1, limit: item.maxLength })
          } else {
            return this.$axios
              .$post(
                `/1.0/list/products`,
                {
                  filters: { sortBy: ['popularity'] },
                  view_mode: [],
                  originUrl: this.requestUrl
                },
                {
                  params: {
                    cat_name: item.key,
                    dress_type: item.dressType,
                    page: 1,
                    limit: item.maxLength,
                    in_stock: '',
                    module: 'salelist'
                  }
                }
              )
              .catch((error) => {
                throw error
              })
          }
        })
      )
      this.prodReqListData = prodReqListData.map((result, index) => {
        return result.code === 0 && !result.data.empty && this.prodReqList[index]
          ? {
              ...this.prodReqList[index],
              prodList: result.data.prodList,
              pageInfo: result.data.pageInfo
            }
          : {
              ...this.prodReqList[index],
              prodList: [],
              pageInfo: { totalCount: 0 }
            }
      })
      this.hasData = true
    }
  }
}
</script>

<style lang="less" scoped>
img {
  display: block;
  width: 100%;
}
.module-title {
  margin: 0 0 20px;
}
.module-content-item {
  margin: 0 160px 60px;
  &.full-screen {
    margin: 0;
    margin-bottom: 60px;
  }
  .module-content-banner {
    position: relative;
  }
}
/deep/ .product-module-container {
  margin-top: 40px;
}
@media screen and (max-width: 1400px) {
}
@media screen and (max-width: 1280px) {
}
.page404-box {
  .guided-entry-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-item {
      flex: 1;
      margin-right: 15px;
      height: 59px;
      background: #f8f2ef;
      font-size: 14px;
      line-height: 59px;
      font-family: @font-family-600;
      text-align: center;
      cursor: pointer;
      color: var(--color-121212);
      text-transform: capitalize;
      &:last-of-type {
        margin-right: 0px;
      }
    }
  }
  .page404-main {
    min-width: 768px;
    max-width: 1353px;
    margin: 0 auto;
    clear: both;
    padding: 9px 20px 20px 20px;
    min-height: 535px;
    .content {
      width: 800px;
      margin: 60px auto;
      text-align: center;
      p {
        text-align: center;
      }
      .desc-text {
        font-family: @font-family-600;
        font-size: 16px;
        line-height: 22px;
        color: var(--color-121212);
      }
      .btn {
        padding: 0;
        width: 214px;
        height: 42px;
        border-radius: 0;
        font-family: @font-family-600, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        text-transform: uppercase;
        font-size: 14px;
        margin: 0 auto;
      }
      .btn-theme {
        background: var(--color-121212);
        color: #fff;
        margin-top: 25px;
        margin-bottom: 10px;
        &:hover {
          background: var(--color-1e1e1e);
        }
      }
      .btn-white {
        background: #fff;
        border: 1px solid #ccc;
        color: var(--color-121212);
        margin-bottom: 10px;
        &:hover {
          background: #eee;
        }
      }
    }
  }
}
</style>
