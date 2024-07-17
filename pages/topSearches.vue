<template>
  <div class="top-searches-box">
    <main-app :navigation="navigation">
      <div class="top-searches-main">
        <h1 class="top-searches-title">{{ nl('page_top_searches') }}</h1>
        <div v-if="Object.keys(tagList).length > 0" class="content">
          <div v-for="(tags, mark) in tagList" :key="mark" class="section">
            <h3 v-if="mark && mark != 'top'" class="section-title">{{ mark != 'top' ? mark : '' }}</h3>
            <ul class="three-column">
              <li v-for="(tag, index) in tags" :key="index">
                <a :href="countryUrl(tag.url)">{{ tag.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'TopSearches',
  components: {
    MainApp,
    backToTop
  },
  data() {
    return {}
  },
  computed: {},
  // todo  等接口
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/top-search`)
      if (res.code == 0) {
        // todo
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
      context.store.commit('setJsKey', '404')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        tagList: res.data.list || {}
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

<style lang="less">
.top-searches-box {
  .top-searches-main {
    width: 1004px;
    margin: 0 auto;
    clear: both;
    padding: 9px 0 20px;
    min-height: 535px;
    .top-searches-title {
      margin-bottom: 47px;
      border-bottom: 1px solid var(--color-121212);
      padding-bottom: 7px;
      letter-spacing: 1px;
      font-size: 24px;
      font-weight: 400;
      text-transform: uppercase;
    }
    .content {
      .section {
        margin-bottom: 40px;
      }
      .section-title {
        letter-spacing: 1px;
        font-size: 16px;
        font-family: @font-family-600, sans-serif;
        text-transform: uppercase;
        margin-bottom: 12px;
        color: var(--color-121212);
      }
      .three-column {
        display: flex;
        flex-wrap: wrap;
        li {
          margin-bottom: 6px;
          width: 33%;
          a {
            color: #666;
            text-transform: capitalize;
            text-decoration: none;
            &:hover {
              color: var(--color-121212);
            }
          }
        }
      }
    }
  }
}
</style>
