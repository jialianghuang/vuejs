<template>
  <div class="brides-box">
    <div style="display:none">
      <h1>{{ nl('page_inspiration_silhouette_guide') }}</h1>
    </div>
    <main-app :navigation="navigation">
      <div class="center-content">
        <back-to-top></back-to-top>
        <silhouette-guide v-if="!silhouette" :topBanner="topBanner" :midBanners="midBanners"></silhouette-guide>
        <silhouette-guide-list v-else :topBanner="topBanner" :aFewFavorites="aFewFavorites" :quizBox="quizBox"></silhouette-guide-list>
      </div>
      <!-- 不用组件是因为组件存在抖动 -->
      <div v-if="isLoading" class="loading">
        <transition name="fade">
          <div class="loading-icon"></div>
        </transition>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import SilhouetteGuide from '@/components/static/SilhouetteGuide'
import SilhouetteGuideList from '@/components/static/SilhouetteGuideList'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'SilhouetteGuideAll',
  components: {
    mainApp,
    SilhouetteGuide,
    SilhouetteGuideList,
    backToTop
  },
  data() {
    return {
      isLoading: false
    }
  },
  watch: {
    '$route.query'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getSilhouetteData()
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      let url = '/1.0/navigation/silhouette-guide'

      let silhouette

      if (context.route.query && context.route.query.silhouette) {
        silhouette = context.route.query.silhouette
        url += '/' + silhouette
      }

      const res = await context.$axios.$get(url, {
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

      context.store.commit('setJsKey', 'silhouette-guide')
      return {
        ...commonAsyncData,
        silhouette,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        aFewFavorites: res.data.aFewFavorites,
        quizBox: res.data.quizBox,
        topBanner: res.data.topBanner,
        midBanners: res.data.midBanners
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
  methods: {
    async getSilhouetteData() {
      try {
        let url = '/1.0/navigation/silhouette-guide'
        const query = this.$route.query
        this.silhouette = query.silhouette
        if (query.silhouette) {
          url += '/' + query.silhouette
        }
        this.isLoading = true
        const res = await this.$axios.$get(url)
        this.isLoading = false
        this.seoInfo = res.data.seoInfo
        this.dataLayerInfo = res.data.dataLayerInfo
        this.aFewFavorites = res.data.aFewFavorites
        this.quizBox = res.data.quizBox
        this.topBanner = res.data.topBanner
        this.midBanners = res.data.midBanners
      } catch (error) {
        console.error(error.message || 'Error')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .center-content {
    max-width: 1293px;
    margin: 40px auto 100px;
  }
  /deep/ .silhouette_guide_wrapper {
    width: 100%;
    margin: 50px auto 0;
    h3 {
      font-size: 26px;
      font-family: Libre Baskerville Regular;
      color: var(--color-121212);
      line-height: 26px;
      cursor: default;
      font-weight: normal;
    }
    p {
      font-size: 13px;
      font-family: @font-family-500;
      color: rgba(51, 51, 51, 1);
      line-height: 25px;
      cursor: default;
    }
    h4 {
      margin-top: 42px;
      font-size: 16px;
      font-family: @font-family-600;
      color: var(--color-121212);
      line-height: 16px;
      cursor: default;
      font-weight: normal;
    }
    hr {
      cursor: default;
    }
    .measurement-video {
      margin-left: 75px;
      margin-top: 18px;
      padding-bottom: 4px;
      .loading-before {
        position: absolute;
        z-index: 1;
        margin-left: 310px;
        margin-top: 175px;
      }
      .start-note {
        position: absolute;
        z-index: 1;
        margin-top: 16px;
        margin-left: 10px;
        font-size: 16px;
        font-family: @font-family-600, sans-serif;
      }
    }

    button,
    .a_btn {
      margin: 7px 0 40px;
      width: 280px;
      height: 40px;
      padding: 0;
      border: none;
      background: var(--color-121212);
      font-size: 14px;
      font-family: @font-family-600;
      color: #fff;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        background: var(--color-1e1e1e);
      }
    }
    button {
      outline: none;
    }

    .measurement-video {
      margin: 0;
      margin-top: 9px;

      .start-note {
        z-index: 1;
      }
      .loading-before {
        position: absolute;
        z-index: 1;
        margin-left: 420px;
        margin-top: 240px;
      }
    }

    .custom_size_form {
      max-width: 420px;
      margin-top: 10px;
      .size_des {
        border: 1px solid #e5e5e5;
        background-color: #fafafa;
        margin-top: 10px;
        p {
          padding: 8px 10px;
          color: var(--color-999999);
          span {
            color: #666;
          }
          line-height: unset !important;
        }
      }
      .size-chart-png {
        float: right;
        width: 150px;
        margin-top: 18px;
      }
      .dress_ul {
        display: inline-block;
        li {
          margin: 17px 0 35px;
        }
        label {
          display: inline-block;
          width: 116px;
          margin-right: 7px;
          text-align: left;
          text-transform: none;
        }
        input {
          display: inline-block;
          width: 35px;
          height: 21px;
          padding: 4px 10px;
          border: 1px solid #ccc;
          margin-right: 10px;
          background-color: #fff;
          color: #555;
          line-height: 30px;
          vertical-align: middle;
        }
        input.has_error {
          border-color: var(--color-ff0000);
        }
      }
    }

    p.spacial_p {
      color: var(--color-999999);
      font-size: 13px;
      font-family: @font-family-500;
      line-height: 13px;
    }
    .specials_box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin: 20px 0 80px;
      .specials_item {
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        width: 50%;
        height: 272px;
        margin-bottom: 30px;
        img {
          width: 196px;
          height: 272px;
          vertical-align: top;
        }
        div.spacial_desc {
          width: 335px;
          height: 272px;
          padding: 0 15px 0;
          margin: 0 15px 0 0px;
          h4 {
            margin: 10px 0 15px 0;
            font-size: 14px;
            font-family: @font-family-600;
            line-height: 14px;
          }
          hr {
            margin: 0;
            margin-bottom: 10px;
            width: 60px;
            border-color: var(--color-121212);
          }
          p {
            height: 160px;
            color: #666;
            line-height: 20px;
          }
          .a_btn {
            display: inline-block;
            width: 200px;
            height: 40px;
            margin: 0;
            text-align: center;
            font-family: @font-family-500;
            text-transform: uppercase;
          }
        }
        &.be_recommended .spacial_desc {
          background: #fff6f6;
        }
      }
    }
  }
  @media screen and (max-width: 1293px) {
    .center-content {
      margin: 40px 30px 100px;
    }
  }
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: @popuy-z-index;
  }
  .loading-icon {
    display: inline-block;
    width: 35px;
    height: 35px;
    background: url('~assets/images/loading.png') center center no-repeat;
    background-size: 100% 100%;
    animation: rotate 1s infinite;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
