<template>
  <div class="sale-box">
    <main-app :navigation="navigation" :adaptive="true">
      <div class="main-content">
        <new-arrival-banner :categoriesBanners="categoriesBanners" :topBanners="topBanners"></new-arrival-banner>
        <new-arrival-list :prodReqListData="prodReqListData" max-width=""></new-arrival-list>
        <new-arrival-seo-content v-if="seoInfo && seoInfo.content" :content="seoInfo.content"></new-arrival-seo-content>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import NewArrivalList from '@/components/newArrival/NewArrivalList'
import NewArrivalBanner from '@/components/newArrival/NewArrivalBanner'
import NewArrivalSeoContent from '@/components/newArrival/NewArrivalSeoContent'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'NewArrival',
  components: {
    mainApp,
    backToTop,
    NewArrivalList,
    NewArrivalBanner,
    NewArrivalSeoContent
  },
  data() {
    return {
      //   pageLoading: false
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

      const url = '/1.0/new-arrival/landing'
      const res = await context.$axios.$get(url, {
        params: {
          newArrivalMiddleVersion: context.store.state.versionGroup.banner_new_arrival_middle,
          newArrivalTopVersion: context.store.state.versionGroup.banner_new_arrival_top
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
      context.store.commit('setJsKey', 'new_arrival')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        categoriesBanners: res.data.categoryBanners,
        topBanners: res.data.topBanners,
        url,
        prodReqListData: res.data.list
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
  mounted() {}
}
</script>

<style lang="less" scoped>
.sale-box {
  .main-content {
    box-sizing: border-box;
    max-width: 1353px;
    width: 100%;
    clear: both;
    padding: 0;
    margin: auto;
    padding: 10px 30px 0;
  }
}
</style>
