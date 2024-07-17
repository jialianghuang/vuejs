<template>
  <div class="cybermonday-box">
    <main-app :navigation="navigation">
      <div class="main-content promotion-main clearfix">
        <cyber-monday-main></cyber-monday-main>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import CyberMondayMain from '@/components/promotion/CyberMondayMain'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'Cybermonday',
  components: {
    MainApp,
    CyberMondayMain
  },
  data() {
    return {}
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'cybermonday')
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
  created() {
    if (process.client) {
    }
  },
  methods: {}
}
</script>

<style lang="less">
.promotion-main {
  min-width: 1263px;
  max-width: 1353px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 30px;
  clear: both;
  min-height: 535px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
