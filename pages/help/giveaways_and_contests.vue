<template>
  <div class="giveaways-and-contests">
    <main-app :navigation="navigation">
      <div class="giveaways-and-contests-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content">
          <h1 class="title">{{ contents.header }}</h1>
          <div class="content-header">
            <p v-html="contents.text"></p>
            <h4 v-html="contents.desc"></h4>
          </div>
          <div v-for="(item, index) in contents.list" :key="index" class="item-block">
            <h4 :class="{ 'first-t': index == 0 }" class="sub-title">{{ item.title }}</h4>
            <div>
              <p v-for="(p, pIndex) in item.texts" :key="pIndex" v-html="p" class="txt"></p>
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
import HelpMenu from '@/components/common/HelpMenu'
export default {
  name: 'GiveawaysAndContests',
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
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/giveaways-and-contests`)
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
      context.store.commit('setJsKey', 'giveaways_and_contests')
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
.giveaways-and-contests-main {
  .content {
    .title {
      margin-bottom: 5px;
    }
    .content-header {
      p {
        padding-bottom: 0px;
        font-size: 13px;
        color: var(--color-121212);
        font-family: @font-family-600;
        padding-top: 14px;
      }
      h4 {
        padding: 17px 0 3px;
        padding-top: 0;
        font-size: 13px;
        font-family: @font-family-600, sans-serif;
        text-transform: uppercase;
      }
    }
    .item-block {
      .sub-title {
        padding: 15px 0 10px;
        font-size: 14px;
        font-family: @font-family-600, sans-serif;
        text-transform: uppercase;
      }
      /deep/p {
        padding-bottom: 25px;
      }
      /deep/ a {
        color: var(--color-121212);
      }
    }
  }
}
</style>
