<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <div class="center-content">
        <top-banner :topBanner="topBanner"></top-banner>
        <get-start
          v-if="midBannersConfig.gettingStarted && midBannersConfig.gettingStarted.display"
          :gettingStarted="midBanners.gettingStarted"
        ></get-start>
        <img-link-list
          v-if="midBannersConfig.seasonalTrends && midBannersConfig.seasonalTrends.display"
          :lists="midBanners.seasonalTrends.list"
          :title="midBanners.seasonalTrends.title"
          :rowCount="3"
          :textLayout="'ta-left'"
          @set-style-quiz-layer-show="setStyleQuizLayerShow"
        ></img-link-list>
        <img-link-list
          v-if="midBannersConfig.dressDetails && midBannersConfig.dressDetails.display"
          :lists="midBannersConfig.dressDetails.hasBigImg ? midBanners.dressDetails.list.slice(3) : midBanners.dressDetails.list"
          :title="midBanners.dressDetails.title"
          :rowCount="3"
          :textLayout="'ta-left'"
          @set-style-quiz-layer-show="setStyleQuizLayerShow"
        >
          <big-img slot="bigImg" v-if="midBannersConfig.dressDetails.hasBigImg" :bigImg="midBanners.dressDetails"></big-img>
        </img-link-list>
        <img-link-list
          v-if="midBannersConfig.dressGuide && midBannersConfig.dressGuide.display"
          :lists="midBanners.dressGuide.list"
          :title="midBanners.dressGuide.title"
          :textLayout="'ta-left'"
          :rowCount="3"
          @set-style-quiz-layer-show="setStyleQuizLayerShow"
        ></img-link-list>
        <brides-dress-guide :lists="dressesGuideVideo.list" :title="dressesGuideVideo.title"></brides-dress-guide>
        <style-quiz-layer
          v-if="styleQuizLayerShow"
          @close="setStyleQuizLayerShow(false)"
          :styleQuizBridal="styleQuizBridal"
        ></style-quiz-layer>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import GetStart from '@/components/static/wedding-dresses/WeddingDressesGetStart'
import TopBanner from '@/components/static/TopBanner'
import ImgLinkList from '@/components/static/ImgLinkList'
import StyleQuizLayer from '@/components/static/StyleQuizLayer'
import BigImg from '@/components/static/wedding-dresses/WeddingDressesBigImg'
import BridesDressGuide from '@/components/static/BridesDressGuide'
import { mapState, mapGetters } from 'vuex'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
// import '~assets/less/vjs.less'

export default {
  name: 'WeddingDresses101',
  components: {
    mainApp,
    TopBanner,
    GetStart,
    ImgLinkList,
    StyleQuizLayer,
    BridesDressGuide,
    BigImg,
    backToTop
  },
  data() {
    return {
      styleQuizLayerShow: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({})
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/navigation/wedding-dresses-101`, {
        params: {
          seoUrl: commonAsyncData.requestUrl
        }
      })

      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }
      context.store.commit('setJsKey', 'wedding-dresses-101')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        topBanner: res.data.topBanner,
        midBannersConfig: res.data.midBannersConfig,
        midBanners: res.data.midBanners,
        styleQuizBridal: res.data.styleQuizBridal,
        dressesGuideVideo: res.data.dressesGuideVideo
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
  mounted() {},
  methods: {
    setStyleQuizLayerShow(bl) {
      this.styleQuizLayerShow = bl
    }
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .center-content {
    box-sizing: border-box;
    width: 1132px;
    clear: both;
    padding: 0;
    margin: 0 auto;
    margin-top: 22px;
    margin-bottom: 80px;
    clear: both;
  }
}
</style>
