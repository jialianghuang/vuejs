<template>
  <div class="product-reviews-box">
    <main-app :navigation="navigation">
      <div class="main-content">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <h2>
          <a :href="navToGoodsDetail(baseInfo.goodsUrl, baseInfo)">{{ nl('page_common_back_to_product_page') }} ►</a
          >{{ nl('page_review_read_customers_saying') }}
        </h2>
        <div class="product-box">
          <div class="reviews-goods-thumb">
            <div>
              <a :href="navToGoodsDetail(baseInfo.goodsUrl, baseInfo)" :aria-label="baseInfo.goodsName" class="go_to_goods_url_img">
                <img :src="replaceImgCdnUrl(`${PIC_PATH}s179/${baseInfo.goodsThumb}`)" :alt="baseInfo.goodsName" />
              </a>
            </div>
          </div>
          <div class="reviews-product-info">
            <h1>
              <span class="prod-name detail-prod-name">{{ baseInfo.shownGoodsName }}</span>
              <span class="cat">{{ baseInfo.catName }}</span>
            </h1>
            <p v-if="baseInfo.fabric" class="fabric">{{ nl('page_common_fabric').toUpperCase() }}: {{ baseInfo.fabric }}</p>
            <!-- 打折商品价格划线 -->
            <div v-if="baseInfo.hasLinePrice" class="price">
              <span class="text1">{{ baseInfo.shopPriceDisplay }}</span>
              <span class="text2">{{ baseInfo.noDealPriceDisplay }}</span>
            </div>
            <p id="id_shop_price" v-else class="price">{{ baseInfo.shopPriceDisplay }}</p>
            <dl class="info">
              <dt style="text-transform: uppercase">{{ nl('page_swatch_product_info') }}</dt>
              <dd>
                <p>{{ description }}&nbsp;</p>
              </dd>
            </dl>
            <az-share :shareList="shareInfo.list" :fontSize="'35px'" :space="'0 9px 0 0'"></az-share>
          </div>
          <div class="reviews-buy-now">
            <a :href="navToGoodsDetail(baseInfo.goodsUrl, baseInfo)">{{ nl('page_common_buy_now') }}</a>
          </div>
          <div style="clear:both"></div>
        </div>
        <product-reviews-block
          v-if="!baseInfo.isComingSoon"
          :baseInfo="baseInfo"
          :reviewInfo="{ noFitFilter, pageInfo, reviewFilter, reviewList }"
          :from="'productReviews'"
          @reviewsChange="reviewsChange"
        ></product-reviews-block>
      </div>
      <review-photo-preview
        v-if="previewImgList.length"
        :index="previewImgIndex"
        :srcList="previewImgList"
        @close="resetPreviewImg"
        name="Azazie Sedona BG"
      ></review-photo-preview>
      <az-loading v-if="loadingFlag"></az-loading>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import BreadCrumb from '@/components/common/Breadcrumb'
import AzLoading from '@/components/az-ui/AzLoading'
import backToTop from '@/components/common/BackToTop'
import ProductReviewsBlock from '@/components/product/ProductReviews'
import ReviewPhotoPreview from '@/components/product/ReviewPhotoPreview'
import AzShare from '@/components/az-ui/Share/AzShare'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'ProductReviews',
  components: {
    mainApp,
    BreadCrumb,
    AzLoading,
    backToTop,
    ProductReviewsBlock,
    ReviewPhotoPreview,
    AzShare
  },
  data() {
    return {
      reviewPostList: [],
      previewImgList: [],
      previewImgIndex: 0,
      pageLoading: false,
      loadingFlag: false
    }
  },
  computed: {
    breadCrumbInfo() {
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        cat: {
          href:
            this.baseInfo.dressType != 'dress'
              ? `/reviews/category/sample-clearance`
              : `/reviews/category/${this.baseInfo.catName.replace(RegExp(' ', 'g'), '-').toLowerCase()}`,
          title: this.baseInfo.dressType != 'dress' ? 'Sample & Clearance Reviews' : `${this.baseInfo.catName} Reviews`
        },
        product: {
          title: `${this.baseInfo.shownGoodsName} Reviews`
        }
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'product_reviews')

      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      let url = '/1.0/review/product'
      if (query.hasOwnProperty('goods_id')) {
        url = url + '?goods_id=' + escape(query.goods_id)
      } else if (query.hasOwnProperty('goods_name')) {
        const goodsName = query.goods_name
        if (goodsName == 'azazie-swatches-bridesmaids-and-wedding-party') {
          url = url + '?goods_id=1000291'
        } else if (
          goodsName.includes('sample-bride') ||
          goodsName.includes('sample-modest') ||
          goodsName.includes('sample-maternity') ||
          goodsName.includes('sample-mother-of-the-bride')
        ) {
          url = url + '?dress_type=sample&goods_name=' + escape(query.style)
        } else if (goodsName.includes('ready-to-ship') || goodsName.includes('clearance')) {
          url = url + '?dress_type=clearance&goods_name=' + escape(query.style)
        } else if (goodsName.includes('last-chance-outlet')) {
          url = url + '?dress_type=outlet&goods_name=' + escape(query.style)
        } else {
          url = url + '?goods_name=' + escape(goodsName)
        }
      } else {
        context.redirect(
          302,
          context.store.state.currentCountryUrl + `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`
        )
        return false
      }
      query.sodGalleryVersion = (context.store.state.versionObj.sodGalleryVersion || 'a').toLowerCase()
      for (const i in query) {
        if (!['goods_id', 'goods_name'].includes(i)) {
          let param = query[i]
          if (Array.isArray(param)) {
            param = param[param.length - 1]
          }
          url += '&' + escape(i) + '=' + escape(param)
        }
      }

      const res = await context.$axios.$get(url)
      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 0) {
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, context.store.state.currentCountryUrl + `/user/login?back=${context.route.fullPath}`)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        pageInfo: res.data.pageInfo,
        reviewFilter: res.data.reviewFilter,
        reviewList: res.data.reviewList,
        baseInfo: res.data.baseInfo,
        shareInfo: res.data.shareInfo,
        noFitFilter: res.data.noFitFilter,
        description: res.data.description
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
    this.axiosSource = this.$axios.CancelToken.source()
  },
  mounted() {},
  methods: {
    reviewsChange(val) {
      this.loadingFlag = true
      this.reviewPostList.push(new Date().getTime())
      if (this.reviewPostList.length > 1) {
        // 防止快速点击的无意义请求
        this.axiosSource.cancel('Operation canceled by the user.')
        this.axiosSource = this.$axios.CancelToken.source()
        this.reviewPostList = []
      }
      this.$axios
        .$post(
          `/1.0/review/${this.baseInfo.goodsId}`,
          {
            cat_id: this.baseInfo.catId,
            dress_type: this.baseInfo.dressType,
            page: val.isPageChange ? val.page : 1,
            limit: this.pageInfo.limit,
            filters: {
              star_rating: val.star,
              fit: val.fit,
              color: val.color,
              sort_by: val.sortBy
            }
          },
          {
            cancelToken: this.axiosSource.token
          }
        )
        .then((res) => {
          this.loadingFlag = false
          this.reviewPostList = []
          if (res.code == 0) {
            this.reviewFilter = res.data.reviewFilter
            this.reviewList = res.data.reviewList
            this.pageInfo = res.data.pageInfo
            window.scroll(0, 0)
          }
        })
        .catch((error) => {
          this.loadingFlag = false
          this.reviewPostList = []
          console.log(error)
        })
    },
    openPreview(obj) {
      this.previewImgIndex = obj.index
      this.previewImgList = obj.list
    },
    resetPreviewImg() {
      this.previewImgIndex = 0
      this.previewImgList = []
    }
  }
}
</script>

<style lang="less" scoped>
.product-reviews-box {
  .main-content {
    box-sizing: border-box;
    // max-width: 1353px;
    max-width: 1920px;
    width: 100%;
    clear: both;
    padding: 0;
    margin: auto;
    padding: 0 30px;
  }
  h2 {
    margin-bottom: 10px;
    height: 20px;
    a {
      border: 1px solid #ddd;
      float: right;
      vertical-align: top;
      padding: 2px 8px;
      margin-top: -3px;
      font-weight: 400;
      color: #888;
    }
  }
  .product-box {
    border: 10px solid #f3f3f3;
    padding: 30px 40px;
    padding-bottom: 0;
    position: relative;
    display: flex;
    .reviews-goods-thumb {
      border: 0px solid blue;
      div {
        position: relative;
        .go_to_goods_url_img {
          img {
            width: 179px;
          }
        }
        a.icon-fav {
          position: absolute;
          display: block;
          top: 7px;
          right: 10px;
        }
      }
    }
    .reviews-product-info {
      flex: 1;
      margin-left: 30px;
      margin-right: 30px;
      h1 {
        letter-spacing: 1px;
        font-size: 24px;
        font-weight: normal;
        text-transform: uppercase;
        line-height: 25px;
        margin-top: 5px;
        .cat {
          font-weight: normal;
          font-size: 13px;
          letter-spacing: 0;
          text-transform: none;
          display: block;
          font-family: @font-family-500, sans-serif;
        }
      }
      .fabric {
        color: #666;
        margin: 12px 0 0;
      }
      .price {
        display: flex;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        margin-top: -1px;
        .text1 {
          color: var(--color-121212);
          font-family: @font-family-600;
          font-size: 24px;
          line-height: 33px;
        }
        .text2 {
          color: var(--color-999999);
          text-decoration: line-through;
          font-size: 16px;
          margin-left: 5px;
        }
      }
      /deep/ .az-share-box {
        text-align: left;
        margin-left: -12px;
        margin-top: 8px;
      }
    }
    .reviews-buy-now {
      width: 175px;
      padding: 13px 10px;
      text-align: center;
      border: 1px solid @theme-color;
      border-radius: 2px;
      padding: 0px;
      align-self: flex-end;
      margin-bottom: 30px;
      a {
        font-weight: bold;
        text-transform: uppercase;
        color: @theme-color;
        background-color: #fff;
        font-size: 14px;
        line-height: 18px;
        display: inline-block;
        white-space: nowrap;
        vertical-align: middle;
        width: 100%;
        line-height: 38px;
        &:hover {
          color: #fff;
          background-color: @theme-color;
        }
      }
    }
  }
  /deep/ .reviews-box {
    width: auto;
  }
  /deep/ .review_filter_block {
    padding-top: 30px;
    margin-top: 30px;
  }
  /deep/ #bread_crumb {
    max-width: 100%;
  }
  /deep/ #product_page_revires {
    max-width: 100%;
    .prlr-details {
      max-width: 300px;
    }
  }
}
</style>
