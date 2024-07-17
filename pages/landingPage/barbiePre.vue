<template>
  <main-app :navigation="navigation" :isShowSubscribe="'hide'">
    <barbie-pre-main></barbie-pre-main>
  </main-app>
</template>

<script>
import mainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import BarbiePreMain from '@/components/landingPage/BarbiePreMain'

export default {
  name: 'BarbiePre',
  components: {
    mainApp,
    BarbiePreMain
  },
  async asyncData(context) {
    try {
      context.store.commit('setJsKey', 'barbie')

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
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  }
}
</script>

<style lang="less" scoped></style>
