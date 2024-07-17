<template>
  <div class="brides-box">
    <div style="display:none">
      <h1>{{ nl('page_header_real_wedding') }}</h1>
    </div>
    <main-app :navigation="navigation">
      <div class="center-content">
        <template v-if="realWeddings">
          <real-wedding-middle :realWeddings="realWeddings"></real-wedding-middle>
        </template>
        <real-wedding-detail v-else :detailData="detailData"></real-wedding-detail>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import RealWeddingMiddle from '@/components/static/real-wedding/RealWeddingMiddle'
import RealWeddingDetail from '@/components/static/real-wedding/RealWeddingDetail'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'RealWeddings',
  components: {
    mainApp,
    RealWeddingMiddle,
    RealWeddingDetail,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      let url = `/1.0/navigation/real-weddings`

      let detailGoodsId
      if (context.route && context.route.path) {
        const matches = context.route.path.match(new RegExp('/real-weddings(/([^/?#]*))?'))
        detailGoodsId = matches && matches[2]
      }

      // 处理告警， 用户随意输入会导致页面展示异常多语言code，非法链接会直接使网站挂掉，所以先判断已有的detailGoodsId，后续如果有需求新增，再加
      if (!detailGoodsId || !['0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008'].includes(detailGoodsId)) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
      }
      if (detailGoodsId) {
        url += '/' + detailGoodsId
      }

      const [res, colorHexRes] = await Promise.all([
        context.$axios.$get(url, {
          params: {
            seoUrl: commonAsyncData.requestUrl
          }
        }),
        context.$axios.$get(`/1.0/common/color-hex`)
      ])

      const detailData = detailGoodsId ? res.data : null

      const realWeddings = !detailGoodsId ? res.data : null

      const colorArr = []
      if (realWeddings && realWeddings.picList) {
        for (const k in realWeddings.picList) {
          colorArr.push(...(realWeddings.picList[k].color || []))
        }
      } else if (detailData && detailData.color) {
        colorArr.push(...(detailData.color || []))
      }

      const colorHex = {}
      if (colorHexRes && colorHexRes.data && colorHexRes.data.colorHex) {
        colorArr.forEach((item) => {
          colorHex[item] = colorHexRes.data.colorHex[item]
        })
      }
      context.store.commit('setColorHex', colorHex)

      // TODO 跳转
      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(
          302,
          context.store.state.currentCountryUrl + `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`
        )
        return
      }
      context.store.commit('setJsKey', 'what-to-wear')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        detailData,
        realWeddings
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
    width: 1132px;
    clear: both;
    padding: 0;
    margin: 0 auto;
    clear: both;
  }
}
</style>
