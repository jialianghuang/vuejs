<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <div class="center-content">
        <div v-if="titleRoot" class="common-title" style="width: 1004px; margin: 50px auto 25px auto">
          <span v-if="titleRoot[0]" class="title_root"
            ><a :href="countryUrl(titleRoot[0].linkUrl)">{{ titleRoot[0].title }}&nbsp;&nbsp;</a></span
          >
          <h1 v-if="titleRoot[1]" class="title_child" style="display: inline-block">>&nbsp;&nbsp;&nbsp;{{ titleRoot[1].title }}</h1>
        </div>
        <book-turn :bookList="bookList"></book-turn>
        <div v-if="exhibition && exhibition.list && exhibition.list.length" class="credits_container">
          <div class="common-title mb-half">{{ exhibition.title }}</div>
          <div v-for="(item, index) in exhibition.list" :key="index" class="child">
            <p v-for="(text, textIndex) in item" :key="textIndex">{{ text }}</p>
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
import BookTurn from '@/components/static/show-book/BookTurn'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'ShowBook',
  components: {
    mainApp,
    BookTurn,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const module = context.route.path.replace('/show-book/', '')

      const res = await context.$axios.$get(`/1.0/navigation/show-book/${module}`, {
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
      context.store.commit('setJsKey', 'show-book')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        bookList: res.data.book && res.data.book.pageList,
        titleRoot: res.data.book && res.data.book.titleRoot,
        exhibition: res.data.exhibition
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
    clear: both;
    padding: 0;
    margin: 0 auto;
    margin-top: 22px;
    margin-bottom: 85px;
    clear: both;
  }
  .common-title {
    letter-spacing: 1px;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
    border-bottom: solid 1px var(--color-121212);
    padding-bottom: 7px;
  }
  .title_root a {
    color: var(--color-121212);
    &:active {
      color: var(--color-121212);
    }
  }

  .title_root a:hover {
    color: #e8437b;
  }

  .credits_container {
    height: 334px;
    width: 1004px;
    margin: 35px auto 0;

    .child {
      float: left;
      width: 33.3%;
      p {
        margin-top: 20px;
        font-family: @font-family-500, sans-serif;
        font-size: 13px;
        color: var(--color-121212);
      }
    }
  }
}
</style>
