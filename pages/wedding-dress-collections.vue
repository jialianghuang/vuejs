<template>
  <div class="brides-box">
    <div style="display:none">
      <h1>{{ midData.title }}</h1>
    </div>
    <main-app :navigation="navigation">
      <div class="center-content">
        <div class="cat_handler_head_main">
          <div class="cat_handler_head">
            <a :href="countryUrl(topBanner.linkUrl)" :aria-label="topBanner.alt">
              <img :src="replaceImgCdnUrl(topBanner.imgUrl)" :alt="topBanner.alt" />
            </a>
          </div>

          <div class="cat_handler_body">
            <div class="top">
              <p class="title">{{ midData.title }}</p>
              <p class="desc">{{ midData.desc }}</p>
            </div>
            <div class="mid">
              <div v-for="(item, index) in midData.list" :key="index" class="td">
                <a :href="countryUrl(item.linkUrl)">
                  <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.alt" />
                  <p>{{ item.name }}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="theme-content">
          <div class="theme-review">
            <template v-for="(item, index) in themeReviews">
              <h3 :key="index + 'h3'">{{ item.title }}</h3>
              <p :key="index + 'p'">{{ item.desc }}</p>
            </template>
          </div>
        </div>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'WeddingDressCollections',
  components: {
    mainApp,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/wedding-dress-collections`, {
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
      context.store.commit('setJsKey', 'wedding-dress-collections')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        topBanner: res.data.banner,
        midData: res.data.collection,
        themeReviews: res.data.introduce
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
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .center-content {
    box-sizing: border-box;
    width: 1004px;
    margin-left: auto;
    margin-right: auto;
    clear: both;
    padding: 9px 0 20px;
    min-height: 535px;
    text-align: center;
  }

  .cat_handler_head_main {
    text-align: center;

    .cat_handler_head {
      padding: 1px 0 70px 0;
    }

    .cat_handler_body {
      .top {
        .title {
          font-size: 28px;
          color: var(--color-121212);
          margin-bottom: 16px;
        }
        .desc {
          font-size: 16px;
          color: #787878;
          margin-bottom: 24px;
        }
      }
      .mid {
        display: flex;
        justify-content: space-between;
        .td {
          display: inline-block;
          p {
            font-size: 16px;
            color: var(--color-121212);
            padding: 15px 0;
          }
        }
      }
    }
  }
  .theme-content {
    margin: 15px auto 37px auto;
    width: 1004px;
    border-top: 1px solid #e5e5e5;
    font-family: @font-family-500, sans-serif;
    text-align: left;
    .theme-review {
      margin-top: 47px;
      h3 {
        margin: 20px 0 0;
        font-size: 15px;
        color: var(--color-121212);
        font-weight: normal;
        text-transform: capitalize;
      }
      p {
        margin: 14px 0;
        color: #a1a1a1;
        width: 100%;
        letter-spacing: 0.01em;
        word-break: keep-all;
        line-height: 1.5em;
        &.wide {
          width: 100%;
        }
      }
    }
  }
}
</style>
