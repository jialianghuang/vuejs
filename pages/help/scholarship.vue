<template>
  <div class="scholarship">
    <main-app :navigation="navigation">
      <div class="scholarship-main-content">
        <div v-if="topBanner && Object.keys(topBanner).length" class="top-banner">
          <img :src="replaceImgCdnUrl(topBanner.imgUrl)" :alt="topBanner.imgAlt" />
        </div>

        <div v-if="midBanners && Object.keys(midBanners).length" class="mid-banners">
          <template v-if="midBanners && Object.keys(midBanners).length">
            <div
              v-for="(item, index) in midBanners"
              :key="index"
              :class="[index % 2 ? 'p-l-20' : 'p-l-0']"
              class="s-row s-row-with-bottom-border clearfix"
            >
              <div :class="[index % 2 ? 'img-r' : 'img-l']" class="s-img">
                <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
              </div>
              <div :class="[index % 2 ? 's-text-l' : 's-text-r']" class="s-text">
                <h1 class="s-title">{{ item.title }}</h1>
                <div class="s-under-line"></div>
                <ul v-if="item.texts && Object.keys(item.texts).length" class="s-content">
                  <template v-for="(txt, txtIndex) in item.texts">
                    <template v-if="item.displayType == 'li'">
                      <li :key="txtIndex" v-html="txt" class="li-disc"></li>
                    </template>
                    <template v-else>
                      <li :key="txtIndex" v-html="txt"></li>
                      <br :key="txtIndex" v-if="txtIndex != item.texts.length - 1" />
                    </template>
                  </template>
                </ul>
              </div>
            </div>
          </template>
        </div>

        <div v-if="footer && Object.keys(footer).length" class="footer">
          <div class="footer-content">
            <p v-html="footer.title" class="footer-title"></p>
            <ul v-if="footer.texts && Object.keys(footer.texts).length" class="footer-texts">
              <template v-for="(txt, txtIndex) in footer.texts">
                <li :key="txtIndex" v-html="txt" class="footer-txt"></li>
              </template>
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
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
export default {
  name: 'Scholarship',
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

      const res = await context.$axios.$get(`/1.0/help/scholarship`)
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
      context.store.commit('setJsKey', 'scholarship')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        topBanner: res.data.topBanner || {},
        midBanners: res.data.midBanners || [],
        footer: res.data.footer || {}
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
.scholarship-main-content {
  width: 100%;
  max-width: 1004px;
  margin: 0 auto;
  padding: 9px 0 20px;
  min-height: 535px;
  .top-banner {
    width: 100%;
    max-width: 1004px;
    max-height: 358px;
    margin-bottom: 2.3em;
    padding-left: 0;
  }
  .s-row {
    width: 100%;
    text-align: left;
    padding-left: 20px;
    box-sizing: border-box;
    position: relative;
    &.p-l-0 {
      padding-left: 0;
    }
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
        text-transform: capitalize;
      }
      .s-under-line {
        margin-top: 3%;
        margin-bottom: 8%;
        text-align: left;
        width: 70px;
        border-bottom: 5px solid var(--color-121212);
      }
      .s-li li {
        list-style: disc;
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
    .s-single-title {
      font-family: @font-family-600;
      font-size: 24px;
      text-align: center;
      padding: 2.29em 0 1.88em 0;
    }
    .img-r {
      float: right;
    }
    .img-l {
      float: left;
    }
  }
  .s-row-with-bottom-border {
    border-bottom: solid var(--color-eeeeee) 1px;
    padding-top: 2.3em;
    padding-bottom: 2.3em;
  }
  .border-b-none {
    border-bottom: none;
  }
  li.li-disc {
    margin-left: 0.92em;
    list-style: disc;
  }
  .footer {
    max-width: 1004px;
    max-height: 430px;
    padding: 2.3em 0 0.77em 0;
    .footer-content {
      max-width: 95%;
      padding: 5% 0 4% 3.85em;
      width: 100%;
      background-color: var(--color-f9f9f9);
      font-family: @font-family-500;
      letter-spacing: 1px;
      font-size: 13px;
      line-height: 2em;
      color: var(--color-666666);
      .footer-title {
        font-family: @font-family-600;
        font-size: 24px;
        text-transform: capitalize;
        color: var(--color-121212);
        margin-bottom: 3.4%;
      }
      .footer-texts {
        max-width: 95%;
        li {
          margin-left: 0.92em;
          list-style: disc;
        }
      }
    }
  }
}
</style>
