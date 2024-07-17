<template>
  <div class="terms-of-use">
    <main-app :navigation="navigation">
      <div class="terms-of-use-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content">
          <h1 class="title">{{ contents.title }}</h1>
          <div v-for="(item, index) in contents.list" :key="index" class="item-block">
            <h4 :class="[{ 'first-t': index == 0 && language === 'en' }, { padbot25: index == 15 }]" class="sub-title">{{ item.title }}</h4>
            <div v-html="item.text" class="txt"></div>
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
import HelpMenu from '@/components/common/HelpMenu'
export default {
  name: 'TermsOfUse',
  components: {
    MainApp,
    backToTop,
    HelpMenu
  },
  data() {
    return {
      currentMenuTitle: '',
      accountMenu: {}
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/terms-of-use`)
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
      context.store.commit('setJsKey', 'terms_of_use')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {},
        contents: res.data.contents || {}
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
.terms-of-use-main {
  .content {
    .title {
      margin-bottom: 5px;
    }
    .first-t {
      padding: 0 0 10px !important;
    }
    .padbot25 {
      padding: 0 0 25px !important;
    }
    .item-block {
      .sub-title {
        padding: 15px 0 10px;
        font-size: 14px;
        font-family: @font-family-600, sans-serif;
        text-transform: uppercase;
      }
      /deep/ p {
        padding-bottom: 25px !important;
        word-break: break-word !important;
      }
      /deep/ a {
        color: var(--color-121212);
      }
    }
    .indent {
      padding-left: 30px !important;
    }
    /deep/ strong {
      font-weight: 700 !important;
      font-family: @font-family-700, sans-serif;
    }
    /deep/ li {
      list-style: disc inside;
      padding-left: 20px !important;
    }
  }
}
</style>
