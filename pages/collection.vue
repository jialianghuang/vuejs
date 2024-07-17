<template>
  <div class="list-box">
    <main-app ref="main" :navigation="navigation" :prodList="prodList">
      <div class="main-content">
        <div class="loading-box">
          <div :class="{ 'no-result': isNoResult }" class="goods-show-container">
            <template v-if="isNoResult">
              <div class="main-looking-title">
                {{ nl('page_common_looking_for') }}
              </div>
              <span class="separate-line"></span>
            </template>
            <div v-swiper:bannerSwiper="swiperOption">
              <div class="swiper-wrapper">
                <div
                  v-for="(bannerItem, bannerIndex) in collections"
                  :key="bannerIndex"
                  @click="handleLinkUrl(bannerItem)"
                  class="swiper-slide collections-banner"
                >
                  <div class="collections-img">
                    <img :src="replaceImgCdnUrl(bannerItem.pcPic)" :alt="bannerItem.title" />
                  </div>
                  <div class="collections-banner-title">
                    <div>
                      <h1 class="looking-title">{{ bannerItem.title }}</h1>
                      <div v-html="unescape(bannerItem.slogan)" class="looking-description"></div>
                      <div v-if="isNoResult" class="shop-all">{{ nl('page_header_sale_shop_all') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <collection-product-list :page="pageInfo.page * 1"></collection-product-list>
            <div class="see-all-page">
              <az-pager
                :totalPage="pageInfo.totalPage"
                :page="pageInfo.page * 1"
                :isLoading="pageLoading"
                @pageChange="pageChange"
              ></az-pager>
            </div>
          </div>
          <az-loading
            v-model="loadingFlag"
            :overlayStyle="{ 'background-color': 'rgba(255, 255, 255, 0.3)', position: 'absolute' }"
          ></az-loading>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import CollectionProductList from '@/components/list/CollectionProductList'
import azPager from '@/components/az-ui/Pager/AzPager'
import backToTop from '@/components/common/BackToTop'
import AzLoading from '@/components/az-ui/Loading/AzLoading'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import colorHex from '@/assets/js/colorHex'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
import filtersMixins from '@/assets/js/filters'

export default {
  name: 'Collection',
  components: {
    mainApp,
    CollectionProductList,
    azPager,
    backToTop,
    AzLoading
  },
  mixins: [colorHex, filtersMixins],
  data() {
    return {
      swiperOption: {
        autoplay: {
          delay: 5000
        }
      },
      pageLoading: false,
      collectionId: ''
    }
  },
  computed: {
    ...mapState({
      viewSwitch: (state) => state.list.viewSwitch,
      prodList: (state) => state.list.prodList,
      pageInfo: (state) => state.list.pageInfo
    }),
    ...mapState('list', ['loadingFlag'])
  },
  watch: {
    '$route.query'(val) {
      this.getCollectionProdList()
    },
    collections: {
      handler(newVal) {
        this.$nextTick(() => {
          if (this.bannerSwiper) {
            if (Object.keys(this.collections).length <= 1) {
              this.bannerSwiper.allowTouchMove = false
            } else {
              this.bannerSwiper.allowTouchMove = true
            }
          }
        })
      },
      immediate: true
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      let firstQuery = {}
      firstQuery = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      let page = 1
      if (firstQuery.page) page = firstQuery.page
      const res = await context.$axios.$get(`/1.0/what-are-u`, {
        params: {
          page,
          collection_id: firstQuery.collection_id,
          limit: 20
        }
      })
      let isNoResult = false
      let collections = []
      if (res.code == 0) {
        context.store.commit('list/setViewSwitch', 'smaller')
        const productList = res.data.prodList || []
        if (Object.keys(res.data.collections).length) {
          isNoResult = true
          collections = res.data.collections
        } else {
          collections = [res.data.collection]
        }
        context.store.commit('list/setPageInfo', res.data.pageInfo)
        context.store.commit('list/setProdList', productList)
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      context.store.commit('list/setIsCanLoading', false)
      context.store.commit('list/setLoadingFlag', false)
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        collections,
        collectionId: firstQuery.collection_id,
        isNoResult
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
    this.getColorHexAjax()
    if (process.client) {
      if (this.prodList && this.prodList.length) {
        const gaParams = this.getGAItemListParams(this.prodList, null, 'view', this.$route.name)
        this.setGA4DataLayer(gaParams)
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * 获取商品列表
     */
    async getCollectionProdList() {
      const res = await this.$axios.$get(`/1.0/what-are-u`, {
        params: {
          page: this.pageInfo.page,
          limit: this.pageInfo.limit,
          collection_id: this.collectionId,
          ...this.$route.query
        }
      })
      if (res.code == 0) {
        const productList = res.data.prodList || []
        this.$store.commit('list/setPageInfo', res.data.pageInfo)
        this.$store.commit('list/setProdList', productList)
        if (this.prodList && this.prodList.length) {
          const gaParams = this.getGAItemListParams(this.prodList, null, 'view', this.$route.name)
          this.setGA4DataLayer(gaParams)
        }
        if (productList.length > 0) {
          this.$nextTick(() => {
            this.$refs.main.getFavGoodsList()
          })
        }
      }
      this.$store.commit('list/setIsCanLoading', false)
      this.$store.commit('list/setLoadingFlag', false)
    },
    // 分页
    pageChange(val) {
      this.changeQuery({
        page: val
      })
    },
    handleLinkUrl(bannerItem) {
      if (this.isNoResult) {
        location.href = this.countryUrl('/all/collections/' + bannerItem.linksUrl + '/' + bannerItem.linkUrl)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.loading-box {
  position: relative;
}
.list-box {
  .main-content {
    box-sizing: border-box;
    max-width: 1004px;
    width: 100%;
    clear: both;
    padding: 0;
    margin: auto;
    padding: 10px 0 0;
    .goods-show-container {
      &.no-result {
        .collections-banner {
          cursor: pointer;
          .looking-description {
            font-size: 16px !important;
            color: var(--color-666666);
            line-height: unset !important;
            padding: 0 20px;
          }
        }
      }
      .main-looking-title {
        text-align: center;
        padding: 60px 0 40px 0;
        font-size: 36px;
        font-family: @font-family-600;
      }
      .separate-line {
        text-align: center;
        border-top: 4px solid var(--color-121212);
        width: 85px;
        margin: 0 auto 60px;
        display: block;
      }
      .collections-banner {
        display: flex;
        .collections-img {
          width: 540px;
          height: 300px;
        }
        .collections-banner-title {
          border: 4px solid #f6f6f6;
          border-left: 0;
          width: 464px;
          display: flex;
          align-items: center;
          justify-content: center;
          > div {
            padding: 0 50px;
            text-align: center;
            .looking-title {
              font-size: 36px;
              font-family: @font-family-600;
              word-break: break-word;
              line-height: 48px;
            }
            .looking-description {
              font-size: 20px;
              word-break: break-word;
              line-height: 32px;
              margin-top: 30px;
            }
            .shop-all {
              font-size: 14px;
              font-family: @font-family-600;
              text-transform: uppercase;
              position: relative;
              margin-top: 30px;
              &:after {
                border-top: 4px solid transparent;
                border-left: 7px solid var(--color-121212);
                border-bottom: 4px solid transparent;
                content: '';
                position: relative;
                display: inline-block;
                vertical-align: middle;
                margin-left: 8px;
              }
            }
          }
        }
      }
      /deep/ #cat-prod-list {
        margin-top: 30px;
      }
      .see-all-page {
        padding-top: 28px;
        margin-top: -1px;
        border-top: 1px solid #fff;
        text-align: right;
        margin-bottom: 35px;
        position: relative;
      }
    }
  }
}
</style>
