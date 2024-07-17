<template>
  <div id="reviews-list-box">
    <main-app :navigation="navigation">
      <div class="main-content normal-width clearfix">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div class="reviews-box">
          <reviews-menu :summary="summary"></reviews-menu>
          <div class="reviews-list">
            <h1 v-if="currentCat">
              {{ currentCat.showName }}
              <em>{{ currentCat.total }}{{ currentCat.total == 1 ? nl('page_checkout_review') : nl('page_goods_review_reviews') }}</em>
            </h1>
            <div class="reviews-list-block">
              <reviews-list-item
                v-for="(item, index) in reviews"
                :key="item.id"
                :info="item"
                :itemIndex="index"
                :fitCatIds="noFitFilter"
                @openPreview="openPreview"
              ></reviews-list-item>
            </div>
            <az-pager
              v-if="reviews.length"
              :totalPage="pageInfo.totalPage"
              :page="pageInfo.page * 1"
              :isLoading="pageLoading"
              @pageChange="pageChange"
            ></az-pager>
          </div>
        </div>
      </div>
      <review-photo-preview
        v-if="previewImgList.length"
        :index="previewImgIndex"
        :srcList="previewImgList"
        :from="'reviews'"
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
import ReviewsMenu from '@/components/review/ReviewsMenu'
import ReviewsListItem from '@/components/review/ReviewsListItem'
import ReviewPhotoPreview from '@/components/product/ReviewPhotoPreview'
import azPager from '@/components/az-ui/Pager/AzPager'
import AzLoading from '@/components/az-ui/AzLoading'
import backToTop from '@/components/common/BackToTop'
import { mapState } from 'vuex'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'ReviewsList',
  components: {
    mainApp,
    BreadCrumb,
    ReviewsMenu,
    ReviewsListItem,
    ReviewPhotoPreview,
    azPager,
    AzLoading,
    backToTop
  },
  data() {
    return {
      reviewPostList: [],
      previewImgList: [],
      previewImgIndex: 0,
      pageLoading: false,
      loadingFlag: false,
      noFitFilter: [6, 13, 15, 33, 138, 139]
    }
  },
  computed: {
    ...mapState('order', ['cancelOrderLayerShow']),
    breadCrumbInfo() {
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        login: {
          title: this.nl('page_goods_review_reviews')
        }
      }
    },
    currentCat() {
      let temp
      for (let index = 0; index < this.summary.length; index++) {
        const element = this.summary[index]
        if (element.selected) {
          temp = element
          break
        }
      }
      return temp
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      context.store.commit('setJsKey', 'reviews_list')
      const url = '/1.0/review/list'
      const res = await context.$axios.$get(url, {
        params: {
          ...query,
          topic: context.store.state.isBridal ? 'bridal' : 'azazie',
          sodGalleryVersion: (context.store.state.versionObj.sodGalleryVersion || 'A').toLowerCase()
        }
      })
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
        context.redirect(302, context.store.state.currentCountryUrl + '/reviews')
        return
      }
      if (!res.data.seoInfo.canonicalUrl) {
        // 特殊处理sample_clearance
        if (query.hasOwnProperty('cat_name') && query.cat_name == 'sample_clearance') {
          res.data.seoInfo.title = 'Azazie Sample Clearance Reviews'
          res.data.seoInfo.keywords = 'Azazie Sample Clearance Reviews'
          res.data.seoInfo.description = 'Azazie Sample Clearance Reviews'
        }
      }
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        summary: res.data.summary,
        reviews: res.data.reviews,
        pageInfo: res.data.pageInfo,
        query
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
    openPreview(obj) {
      this.previewImgIndex = obj.index
      this.previewImgList = obj.list
    },
    resetPreviewImg() {
      this.previewImgIndex = 0
      this.previewImgList = []
    },
    pageChange(val) {
      this.loadingFlag = true
      this.reviewPostList.push(new Date().getTime())
      if (this.reviewPostList.length > 1) {
        // 防止快速点击的无意义请求
        this.axiosSource.cancel('Operation canceled by the user.')
        this.axiosSource = this.$axios.CancelToken.source()
        this.reviewPostList = []
      }
      this.$axios
        .$get(
          `/1.0/review/list`,
          {
            params: { ...this.query, page: val, topic: this.$store.state.isBridal ? 'bridal' : 'azazie' }
          },
          {
            cancelToken: this.axiosSource.token
          }
        )
        .then((res) => {
          this.loadingFlag = false
          this.reviewPostList = []
          if (res.code == 0) {
            this.summary = res.data.summary
            this.pageInfo = res.data.pageInfo
            this.reviews = res.data.reviews
            window.scroll(0, 0)
          }
        })
        .catch((error) => {
          this.loadingFlag = false
          this.reviewPostList = []
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.reviews-box {
  display: flex;
  margin: 2px auto 69px;
  padding-top: 10px;
  position: relative;
}
.reviews-list {
  position: relative;
  width: 796px;
  h1 {
    height: 40px;
    line-height: 20px;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-121212);
    font-size: 15px;
    display: flex;
    align-items: center;
    em {
      font-weight: normal;
      font-size: 13px;
      padding-left: 24px;
    }
  }
}
</style>
