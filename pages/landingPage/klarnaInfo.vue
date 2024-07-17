<template>
  <div class="klarna-messaging-info-page">
    <main-app :navigation="navigation">
      <div class="klarna-messaging-info-page-content">
        <klarna-messaging id="klarna-messaging-info-page" :dataKey="'info-page'"></klarna-messaging>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import KlarnaMessaging from '@/components/common/KlarnaMessaging'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  name: 'KlarnaInfo',
  components: {
    MainApp,
    KlarnaMessaging
  },
  data() {
    return {}
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      if (!['GB', 'ES', 'IT', 'FR', 'DE'].includes(context.store.state.country)) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      }
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
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.klarna-messaging-info-page {
  .klarna-messaging-info-page-content {
    min-height: 700px;
  }
}
</style>
