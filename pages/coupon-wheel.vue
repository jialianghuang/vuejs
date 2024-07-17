<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <div class="center-content">
        <lucky-wheel v-if="couponConfig && Object.keys(couponConfig).length > 0" :couponWheelConfig="couponConfig"></lucky-wheel>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import { mapState, mapGetters } from 'vuex'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import LuckyWheel from '@/components/coupon/LuckyWheelPage'
// import '~assets/less/vjs.less'

export default {
  name: 'CouponWheel',
  components: {
    mainApp,
    LuckyWheel
  },
  data() {
    return {
      styleQuizLayerShow: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({})
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/coupon-wheel`)

      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      context.store.commit('setJsKey', 'coupon-wheel')

      return {
        ...commonAsyncData,
        couponConfig: res.data
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
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.brides-box {
  .center-content {
    box-sizing: border-box;
    min-width: 1263px;
    max-width: 1353px;
    clear: both;
    padding: 0;
    margin: 0 auto;
    margin-top: 22px;
    margin-bottom: 80px;
    clear: both;
  }
}
</style>
