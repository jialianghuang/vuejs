<template>
  <div class="dress-guide">
    <main-app :navigation="navigation">
      <h1 style="display:none">{{ nl('page_mid_dress_guide') }}</h1>
      <div class="dress-guide-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content help-right help-size-charts">
          <span class="fr dress_guide_entry"
            >{{ dressContents.text }}
            <a
              id="dress_guide_entry"
              :data-datalayer-category="dressContents.eventName"
              :data-datalayer-label="dressContents.eventCategory"
              :class="{
                need_datalayer: dressContents.eventName && dressContents.eventCategory
              }"
              :href="countryUrl(dressContents.linkUrl)"
              style="color: var(--color-121212);text-decoration: underline"
            >
              {{ dressContents.linkText }}</a
            ></span
          >

          <h2 class="common-title">{{ dressContents.title }}</h2>
          <img :src="replaceImgCdnUrl(dressContents.videoImageUrl)" :alt="dressContents.videoImageAlt" style="display: none" />
          <video
            :poster="replaceImgCdnUrl(dressContents.videoImageUrl)"
            style="margin-top: 20px"
            controls=""
            preload="auto"
            width="903"
            height="508"
            data-setup="{}"
          >
            <source :src="dressContents.videoUrl" type="video/mp4" />
          </video>
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
  name: 'DressGuide',
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

      const res = await context.$axios.$get(`/1.0/help/dress-guide`)
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
      context.store.commit('setJsKey', 'partner')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {},
        dressContents: res.data.contents || {}
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
.dress-guide-main {
  .help-size-charts {
    position: relative;
  }
  .dress_guide_entry {
    margin-top: 4px;
  }
}
</style>
