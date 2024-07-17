<template>
  <div class="style-gallery">
    <!-- 主页面 -->
    <main-app :navigation="navigation">
      <h1 style="display:none">{{ nl('page_common_shop_our_instagram') }}</h1>
      <div id="style-gallery-page" ref="foursixty" class="main"></div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import backToTop from '@/components/common/BackToTop'
export default {
  name: 'ShopOurInstagram',
  components: {
    MainApp,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      return {
        ...commonAsyncData
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
    function facebookVerification(context) {
      let text = ''
      switch (context.country) {
        case 'CA':
          text = 'b80gp5vwps9v904pmca5mbrfyn3d7c'
          break
        case 'US':
          text = 'yvgqowwzor0t13gkah6dn8nqxev0yo'
          break
      }
      return text
    }
    const headJson = {
      // base: { target: '_blank', href: '/' }
      title: this.seoInfo.title || 'Azazie',
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.seoInfo.title },
        { hid: 'og:description', property: 'og:description', content: this.seoInfo.description },
        { hid: 'description', name: 'description', content: this.seoInfo.description },
        {
          name: 'facebook-domain-verification',
          content: facebookVerification(this)
        }
      ],
      script: [
        {
          innerHTML: `var base = document.createElement('base');base.setAttribute('target', '_parent');document.head.appendChild(base)`,
          hid: 'baseHtml'
        }
      ],
      __dangerouslyDisableSanitizersByTagID: { baseHtml: ['innerHTML'] }
    }
    return headJson
  },
  mounted() {
    const scriptEl = document.createElement('script')
    scriptEl.src = '//foursixty.com/media/scripts/fs.embed.v2.5.js'
    scriptEl.setAttribute('data-feed-id', 'azazie_1')
    scriptEl.setAttribute('data-theme', 'lookbook_v2_5')
    scriptEl.setAttribute('data-open-links-in-same-page', 'true')
    this.$refs.foursixty.appendChild(scriptEl)
    // this.scrollShowPoint()
  },
  methods: {}
}
</script>

<style lang="less">
.fs-has-links::after {
  padding: 20px 0;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.8);
  content: 'SHOP IT';
  max-width: 1600px;
}
.fs-wrapper div.fs-text-container .fs-entry-title,
div.fs-detail-title {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
}
div.fs-text-container .fs-entry-date,
div.fs-detail-container .fs-post-info,
div.fs-wrapper div.fs-has-links::after,
.fs-text-product,
.fs-overlink-text {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
}
.fs-wrapper div.fs-text-container * {
  color: #ffffff;
}
.fs-wrapper div.fs-text-container {
  background-color: rgba(0, 0, 0, 0.8);
  margin: 0px;
}
div.fs-entry-date {
  display: none;
}
div.fs-entry-title {
  display: none;
}
.fs-wrapper div.fs-timeline-entry {
  margin: 4px;
}
.main {
  width: 1293px;
  margin-left: auto;
  margin-right: auto;
  clear: both;
  padding: 10px 0 20px;
  min-height: 535px;
}
</style>
