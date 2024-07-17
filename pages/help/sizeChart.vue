<template>
  <div class="size-chart">
    <main-app :navigation="navigation">
      <h1 style="display:none">{{ nl('page_header_size_chart') }}</h1>
      <div class="size-chart-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content help-right help-size-charts">
          <span class="fr swatch_enytry"
            >{{ topBanner.text }} <a id="add2cart_swatch" :href="countryUrl(topBanner.linkUrl)"> {{ topBanner.linkText }}</a
            >.</span
          >
          <h2 class="common-title">{{ topBanner.title }}</h2>
          <p class="img-size-chart">
            <img :src="replaceImgCdnUrl(topBanner.imgUrl)" :alt="topBanner.imgAlt || 'img'" />
          </p>
          <p v-if="topBanner.video" class="measurement-video">
            <span class="start-note">{{ topBanner.video.title }}</span>
            <video
              id="myVideo"
              :poster="topBanner.video.imgUrl"
              class="video-js vjs-default-skin vjs-big-play-centered"
              controls
              preload="auto"
              width="903"
              height="523"
              data-setup="{}"
            >
              <source :src="nl('page_video_size_guide_url')" type="video/mp4" />
            </video>
          </p>
          <size-and-fit></size-and-fit>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import HelpMenu from '@/components/common/HelpMenu'
import SizeAndFit from '@/components/help/SizeAndFit'
export default {
  name: 'SizeChart',
  components: {
    MainApp,
    backToTop,
    SizeAndFit,
    HelpMenu
  },
  data() {
    return {
      currentMenuTitle: '',
      accountMenu: {}
    }
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/size-chart`)
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
      context.store.commit('setJsKey', 'size-chart')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {},
        topBanner: res.data.contents && res.data.contents.topBanner
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
  created() {},
  mounted() {},
  methods: {
    linkToUrl(url) {
      if (url && url != 'none') {
        if (['http'].includes(url)) {
          window.open(url)
        } else {
          window.open('http://' + this.WEB_ROOT + url)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.size-chart-main {
  .help-size-charts {
    position: relative;
  }

  .img-size-chart {
    width: 100%;
    // height: 432px;
    margin-top: 20px;
    margin-bottom: 20px;
    img {
      max-width: 100%;
      width: auto;
      height: auto;
    }
  }

  .measurement-video {
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
      font-size: 14px;
      text-transform: uppercase;
      font-family: @font-family-600, sans-serif;
    }
  }

  .swatch_enytry a {
    text-decoration: underline;
  }
}
</style>
