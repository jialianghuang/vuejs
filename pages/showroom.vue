<template>
  <div class="showroom-box">
    <main-app :navigation="navigation">
      <div id="showroom-page" class="main">
        <quick-shop-dialog ref="quickShopDialog" :fromDialog="'showroom'"></quick-shop-dialog>
        <size-chart-layer v-if="sizeChartLayerShow" :baseInfo="baseInfo" :sizeChartInfo="styleInfo.sizeChart"></size-chart-layer>
        <showroom-notice></showroom-notice>
        <showroom-title></showroom-title>
        <div class="showroom-info">
          <div class="user-info">
            <!-- 左侧 -->
            <user-info-showroom></user-info-showroom>
            <user-info-invite @getShowroomProdList="getShowroomProdList"></user-info-invite>
            <!-- <user-info-tutorial v-if="showroomBaseInfo.isOwner"></user-info-tutorial> -->
            <groomsmen-accessories v-if="prodList && Object.keys(prodList).length"></groomsmen-accessories>
          </div>
          <div class="showroom-details">
            <!-- 右侧商品列表部分 -->
            <showroom-goods-list @getShowroomProdList="getShowroomProdList" @quickShop="quickShopClick"></showroom-goods-list>
            <order-swatches-and-samples></order-swatches-and-samples>
            <my-dashboard v-if="showroomBaseInfo.isOwner"></my-dashboard>
          </div>
        </div>
        <invite v-if="invitePopShow"></invite>
        <invite-overlay v-if="invitePopOverShow"></invite-overlay>
        <tutorial v-if="tutorialPopShow" :guideList="guideList" @getShowroomProdList="getShowroomProdList"></tutorial>
      </div>
      <first-in-layer></first-in-layer>
      <showroom-delete-pop></showroom-delete-pop>
      <az-loading v-if="loadingFlag"></az-loading>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import Invite from '@/components/showroom/Invite'
import InviteOverlay from '@/components/showroom/inviteOverlay'
import Tutorial from '@/components/showroom/Tutorial'
import ShowroomNotice from '@/components/showroom/ShowroomNotice'
import ShowroomTitle from '@/components/showroom/ShowroomTitle'
import OrderSwatchesAndSamples from '@/components/showroom/OrderSwatchesAndSamples'
import MyDashboard from '@/components/showroom/MyDashboard'
// import QuickShopDialog from '@/components/quickshop/QuickShopDialog'
import sizeChartLayer from '@/components/product/SizeChartLayer'
import ShowroomGoodsList from '@/components/showroom/ShowroomGoodsList'
// import UserInfoTutorial from '@/components/showroom/UserInfoTutorial'
import UserInfoInvite from '@/components/showroom/UserInfoInvite'
import GroomsmenAccessories from '@/components/showroom/GroomsmenAccessories'
import UserInfoShowroom from '@/components/showroom/UserInfoShowroom'
import ShowroomDeletePop from '@/components/showroom/ShowroomDeletePop'
import FirstInLayer from '@/components/showroom/FirstInLayer'
import AzLoading from '@/components/az-ui/AzLoading'
import colorHex from '@/assets/js/colorHex'
import backToTop from '@/components/common/BackToTop'

import { mapState } from 'vuex'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog')
})

export default {
  name: 'Showroom',
  components: {
    MainApp,
    Invite,
    InviteOverlay,
    Tutorial,
    ShowroomNotice,
    ShowroomTitle,
    OrderSwatchesAndSamples,
    MyDashboard,
    QuickShopDialog,
    sizeChartLayer,
    ShowroomGoodsList,
    // UserInfoTutorial,
    UserInfoInvite,
    GroomsmenAccessories,
    UserInfoShowroom,
    ShowroomDeletePop,
    FirstInLayer,
    AzLoading,
    backToTop
  },
  mixins: [colorHex],
  data() {
    return {}
  },
  computed: {
    ...mapState('product', ['baseInfo', 'sizeChartLayerShow']),
    ...mapState('list', ['styleInfo']),
    ...mapState('showroom', [
      'tutorialPopShow',
      'invitePopShow',
      'showroomBaseInfo',
      'loadingFlag',
      'invitePopOverShow',
      'pageInfo',
      'prodList'
    ])
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      // 有一部分特殊url截取showroomId中包含user/login
      if (/user/.test(commonAsyncData.requestUrl)) {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }

      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      const [res, addInfo] = await Promise.all([
        context.$axios.$get(`/1.0/showroom/${query.showroomId}`, {
          params: {
            ...context.route.query,
            sodGalleryVersion: (context.store.state.versionObj.sodGalleryVersion || 'A').toLowerCase()
          }
        }),
        context.$axios.$get('/1.0/showroom/banner')
      ])

      if (res.code == 0) {
        context.store.commit('showroom/setShowroomInfo', res.data)
        context.store.commit('showroom/setFirstInLayerShow', !res.data.has_visit)
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else if (res.code == 100501) {
        // 未登录
        context.redirect(302, context.store.state.currentCountryUrl + `/user/login?back=${commonAsyncData.requestUrl}`)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }

      if (addInfo.code === 0) {
        if (Array.isArray(addInfo.data.side)) {
          addInfo.data.side.forEach((item) => {
            item.isShow = true
          })
          context.store.commit('showroom/setAdInfo', addInfo.data.side)
        }
      }
      context.store.commit('setJsKey', 'showroom')
      return {
        ...commonAsyncData,
        guideList: res.data.guideInfo && res.data.guideInfo.guide_list,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo
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
  },
  mounted() {
    if (this.prodList && !Object.keys(this.prodList).length && this.pageInfo.page && this.pageInfo.page != 1 && this.pageInfo.totalPage) {
      this.getShowroomProdList(this.pageInfo.totalPage)
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          page: this.pageInfo.totalPage
        }
      })
    }
    if (this.tutorialPopShow) {
      this.buryPoint(this, 'event', {
        ec: 'tutorial',
        el: 'fornewcustomer',
        ea: 'view'
      })
    }
  },
  methods: {
    // 更新showroom列表信息
    async getShowroomProdList(pageVal, noLoad) {
      if (!noLoad) this.$store.commit('showroom/setLoadingFlag', true)
      const params = {
        showroom_id: this.showroomBaseInfo.showroomIdDisplay,
        page: pageVal || 1,
        limit: this.pageInfo ? this.pageInfo.limit : null // 有默认值
      }
      try {
        const res = await this.$axios.$get(`/1.0/showroom/list`, { params })
        if (res.code == 0) {
          if (!(res.data.prodList && Object.keys(res.data.prodList).length >= 1)) {
            this.$store.commit('showroom/setTutorialPopShow', false)
          }
          if (res.data) {
            // 非第一页的时候，删除商品后如果当前页面无商品了，跳转至上一页
            if (res.data.prodList && !Object.keys(res.data.prodList).length && this.pageInfo.page && this.pageInfo.page != 1) {
              const prePage = res.data.pageInfo.totalPage
              this.$router.push({
                path: this.$route.path,
                query: {
                  ...this.$route.query,
                  page: prePage
                }
              })
              this.getShowroomProdList(prePage)
              return
            }
            this.$store.commit('showroom/setPageInfo', res.data.pageInfo || {})
            this.$store.commit('showroom/setProdList', res.data.prodList || [])
          }
        }
        this.$store.commit('showroom/setLoadingFlag', false)
      } catch (error) {
        this.errorExtra()
      }
    },
    errorExtra(msg) {
      const _msg = msg || this.nl('page_error_something_wrong')
      this.$store.commit('showroom/setLoadingFlag', false)
      alert(_msg)
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  box-sizing: border-box;
  max-width: 1353px;
  width: 100%;
  padding: 0 30px;
  min-height: 535px;
  .showroom-info {
    display: flex;
    .user-info {
      flex-shrink: 0;
      width: 18.7%;
      margin-top: 15px;
      margin-right: 1.3%;
      // background: red;
    }
    .showroom-details {
      margin-top: 15px;
      flex-shrink: 1;
      flex-grow: 1;
    }
  }
}
/deep/.details_module {
  margin: 60px 0;
  border: 1px solid #eee;
  padding: 0 20px 25px;
  .details_module_header {
    font-size: 20px;
    font-family: @font-family-600;
    color: var(--color-121212);
    padding: 15px 0 25px;
    text-transform: capitalize;
  }
  .details_module_content {
    .copy {
      margin: 0 0 25px;
      text-align: center;
    }
    .link_box {
      text-align: center;
      a {
        display: inline-block;
        min-width: 120px;
        padding: 0 50px;
        height: 40px;
        margin-right: 20px;
        background: var(--color-121212);
        border: 1px solid var(--color-121212);
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        font-family: @font-family-600;
        color: #ffffff;
        text-transform: uppercase;
        &.try_at_home {
          text-transform: uppercase;
          background: #ffffff;
          color: var(--color-121212);
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
    .none_order_copy {
      margin-top: -20px !important;
      text-align: left;
      font-size: 16px;
      line-height: 16px;
      img {
        width: 240px;
        height: 332px;
      }
      span {
        display: block;
        width: 240px;
        text-align: center;
        margin-top: 0px;
        font-size: 13px;
        font-family: @font-family-500;
        font-weight: 400;
        color: var(--color-121212) !important;
      }
    }
    .order_box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .order_item {
        display: inline-flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        width: 24%;
        margin-top: 38px;
        margin-right: 1.3%;
        &.no_margin_right {
          margin-right: 0;
        }
        .owner_icon {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          margin: 0;
          border-radius: 50%;
          background-color: var(--color-ede1d3);
          text-align: center;
          color: #ffffff;
          font-family: @font-family-500;
          font-size: 14px;
          line-height: 28px;
          text-transform: uppercase;
        }
        img {
          width: 100%;
          height: unset;
          margin-bottom: 10px;
          max-width: 228px;
          max-height: 315px;
        }
        span {
          max-width: 100%;
          font-size: 13px;
          font-family: @font-family-500;
          color: var(--color-999999);
          line-height: 18px;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: bottom;
          text-transform: none;
        }
        .goods_name {
          font-size: 14px;
          font-family: @font-family-600;
          color: var(--color-121212);
          margin-bottom: 6.5px;
        }
        .goods_color {
          span {
            color: var(--color-121212);
          }
        }
        .buy_time {
          margin-bottom: 3px;
        }
        .order_status {
          color: var(--color-121212);
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
