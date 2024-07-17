<template>
  <div class="privacy-policy-new">
    <main-app :navigation="navigation">
      <div class="privacy-policy-new-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <!-- <div class="content">
          <h1 class="title">{{ contents.title }}</h1>
          <div v-for="(item, index) in contents.list" :key="index" class="item-block">
            <h4 :class="{ 'first-t': index == 0 }" class="sub-title">{{ item.title }}</h4>
            <div v-html="item.text" class="txt"></div>
          </div>
        </div> -->
        <NewPrivacyPolicy />
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
import NewPrivacyPolicy from '@/components/help/NewPrivacyPolicy'
export default {
  name: 'PrivacyPolicy',
  components: {
    MainApp,
    backToTop,
    HelpMenu,
    NewPrivacyPolicy
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

      const res = await context.$axios.$get(`/1.0/help/privacy-policy`)
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
      context.store.commit('setJsKey', 'privacy_policy')
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
