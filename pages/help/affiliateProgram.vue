<template>
  <div class="affiliate-program">
    <main-app :navigation="navigation">
      <div class="affiliate-program-main-content">
        <div v-if="topBanner && Object.keys(topBanner).length" class="top-banner">
          <a :href="countryUrl(topBanner.linkUrl)" :aria-label="topBanner.imgAlt">
            <img :src="replaceImgCdnUrl(topBanner.imgUrl)" :alt="topBanner.imgAlt" />
          </a>
          <h1 class="top-title">{{ topBanner.title }}</h1>
        </div>

        <div v-if="content && Object.keys(content).length" class="center">
          <div v-for="(contentItem, contentIndex) in content" :key="contentIndex" class="content-item">
            <h2 class="title">{{ contentItem.title }}</h2>
            <template v-if="contentItem.text && Array.isArray(contentItem.text)">
              <ul>
                <li v-for="(item, index) in contentItem.text" :key="index" v-html="item" class="item"></li>
              </ul>
            </template>
            <template v-else>
              <p v-html="contentItem.text" class="text"></p>
            </template>
          </div>
        </div>

        <div v-if="footer" class="footer">
          <p v-html="footer" class="footer-text"></p>
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
export default {
  name: 'AffiliateProgram',
  components: {
    MainApp,
    backToTop
  },
  data() {
    return {}
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/affiliate-program`)
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
      context.store.commit('setJsKey', 'affiliate_program')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        topBanner: res.data.topBanner || {},
        content: res.data.content || [],
        footer: res.data.footer
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
  methods: {}
}
</script>

<style lang="less" scoped>
.affiliate-program-main-content {
  width: 100%;
  max-width: 1004px;
  margin: 0 auto;
  padding: 5px 0 40px;
  min-height: 535px;
  .top-banner {
    margin-top: 10px;
    .top-title {
      font-family: @font-family-600;
      font-size: 24px;
      color: var(--color-121212);
      padding: 30px 0;
      border-bottom: solid var(--color-eeeeee) 1px;
    }
  }
  .center {
    color: #6c6c6c;
    padding-top: 45px;
    .content-item {
      .title {
        color: var(--color-121212);
        text-transform: uppercase;
        font-family: @font-family-600;
        font-size: 20px;
      }
      ul {
        font-family: @font-family-500;
        font-size: 13px;
        padding-top: 20px;
        line-height: 2em;
        letter-spacing: 1px;
        padding-bottom: 30px;
        padding-left: 20px;
        color: #6c6c6c;
        li {
          list-style: disc;
        }
      }
      .text {
        font-family: @font-family-500;
        font-size: 13px;
        color: var(--color-666666);
        padding-top: 20px;
        line-height: 2em;
        letter-spacing: 1px;
        padding-bottom: 30px;
      }
    }
  }
  .footer {
    /deep/.af-outlink {
      font-family: @font-family-500;
      font-size: 16px;
      color: var(--color-666666);
      text-decoration: underline var(--color-666666);
    }
    /deep/.af-help {
      padding-top: 30px;
      line-height: 2em;
      color: var(--color-666666);
      letter-spacing: 1px;
      font-family: @font-family-500;
      font-size: 13px;
      text-decoration: underline;
      padding-bottom: 50px;
      .af-mail {
        color: var(--color-121212);
        text-decoration: underline var(--color-666666);
      }
    }
  }
}
</style>
