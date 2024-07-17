<template>
  <div class="how-it-works">
    <main-app :navigation="navigation">
      <div class="how-it-works-main-content">
        <h1 class="title">{{ title }}</h1>
        <div v-if="list && Object.keys(list).length" class="mid-banners">
          <div v-for="(item, index) in list" :key="index" class="s-row clearfix" style="background: #ffffff;">
            <div :class="[index % 2 ? 'img-r' : 'img-l']" class="s-img">
              <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
            </div>
            <div :class="[index % 2 ? 's-text-l' : 's-text-r']" class="s-text">
              <div class="s-title">{{ item.title }}</div>
              <div class="s-under-line"></div>
              <div v-html="item.text" class="s-content"></div>
            </div>
          </div>
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
  name: 'AboutUs',
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

      const res = await context.$axios.$get(`/1.0/help/how-it-works`)
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
      context.store.commit('setJsKey', 'how_it_works')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        list: res.data.list || [],
        title: res.data.title
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
.how-it-works-main-content {
  width: 100%;
  max-width: 1004px;
  margin: 0 auto;
  padding: 9px 0 20px;
  min-height: 535px;
  .title {
    font-size: 24px;
    color: var(--color-121212);
    text-align: center;
    padding-bottom: 35px;
    font-family: @font-family-600;
    text-transform: uppercase;
    margin-top: 36px;
  }
  .s-row {
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    position: relative;
    border-top: solid var(--color-eeeeee) 1px;
    padding: 2.3em 0;
    .s-text {
      text-align: left;
      display: inline-block;
      font-family: @font-family-500;
      vertical-align: middle;
      font-size: 13px;
      line-height: 2em;
      color: var(--color-666666);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 20px;
      .s-title {
        font-size: 24px;
        font-family: @font-family-600;
        color: var(--color-121212);
        font-weight: normal;
        text-transform: uppercase;
      }
      .s-under-line {
        margin-top: 3%;
        margin-bottom: 8%;
        text-align: left;
        width: 70px;
        border-bottom: 5px solid var(--color-121212);
      }
    }
    .s-text-l {
      max-width: 44%;
      margin-left: 3%;
    }
    .s-text-r {
      width: 51%;
      box-sizing: border-box;
      padding-left: 7%;
      vertical-align: middle;
    }
    .s-img {
      height: auto;
      width: 45.8%;
      background-size: contain;
      display: inline-block;
      clear: both;
      height: auto;
      vertical-align: middle;
      img {
        max-width: 100%;
        height: auto;
        overflow: hidden;
        vertical-align: middle;
      }
    }
    .img-r {
      float: right;
    }
    .img-l {
      float: left;
    }
  }
}
</style>
