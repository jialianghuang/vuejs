<template>
  <div class="sale-box activity-box">
    <main-app :navigation="navigation">
      <div class="main-content">
        <sale-first-banner :categoriesBanners="categoriesBanners"></sale-first-banner>
        <sale-list :prodReqListData="prodReqListData" :hasData="hasData"></sale-list>
        <sale-footer-banner :footerBanners="footerBanners"></sale-footer-banner>
        <sale-seo-content v-if="seoInfo && seoInfo.content" :content="seoInfo.content"></sale-seo-content>
        <download-app></download-app>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import SaleList from '@/components/sale/SaleList'
import SaleFirstBanner from '@/components/sale/SaleFirstBanner'
import SaleFooterBanner from '@/components/sale/SaleFooterBanner'
import SaleSeoContent from '@/components/sale/SaleSeoContent'
import DownloadApp from '@/components/common/DownloadApp'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Sale',
  components: {
    mainApp,
    backToTop,
    SaleList,
    SaleFirstBanner,
    SaleFooterBanner,
    SaleSeoContent,
    DownloadApp
  },
  data() {
    return {
      pageLoading: false,
      flashSaleInfo: null,
      prodReqListData: [],
      hasData: true
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      flashSale: (state) => state.flashSale
    }),
    ...mapGetters({})
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      // #17362: /all/sale -> /promotion 链接做301跳转，即将旧链接的seo权重用301跳转的方式移接到新链接
      context.redirect(301, context.store.state.currentCountryUrl + '/promotion')

      const url = '/1.0/sale/landing'
      const res = await context.$axios.$get(url, {
        params: {
          // version: context.store.state.versionGroup.allSaleBannerAbtest,
          saleTopVersion: context.store.state.versionGroup.banner_sale_top,
          saleFooterVersion: context.store.state.versionGroup.banner_sale_footer
        }
      })

      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(
          302,
          context.store.state.currentCountryUrl + `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`
        )
        return
      }
      context.store.commit('setJsKey', 'sale')

      const prodReqList = res.data.list || []

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        categoriesBanners: res.data.categoryBanners,
        footerBanners: res.data.footerBanners,
        url,
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
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    if (process.client) {
    }
  },
  mounted() {
    this.getProdReqListData()
  },
  methods: {
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
      console.log(prodReqListData, '===prodReqListData==')
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
.sale-box {
  .main-content {
    box-sizing: border-box;
    max-width: 1903px;
    width: 100%;
    clear: both;
    padding: 0;
    margin: auto;
    padding: 0 30px 0;
  }
}
</style>
