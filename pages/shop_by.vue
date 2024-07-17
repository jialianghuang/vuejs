<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <div :class="{ 'normal-center-content': shopByType != 'color' }" class="center-content">
        <template v-if="shopByType == 'color'">
          <color-top-banner :topBanner="banner"></color-top-banner>
          <color-list :contentList="contentList"></color-list>
        </template>
        <template v-else> <normal-list :contentList="contentList" :hoverImage="hoverImage"></normal-list></template>
        <more-option :moreOption="moreOption"></more-option>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import ColorTopBanner from '@/components/static/shopBy/ColorTopBanner'
import ColorList from '@/components/static/shopBy/ColorList'
import NormalList from '@/components/static/shopBy/NormalList'
import MoreOption from '@/components/static/shopBy/MoreOption'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'ShopBy',
  components: {
    mainApp,
    ColorTopBanner,
    ColorList,
    backToTop,
    NormalList,
    MoreOption
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      let url = `/1.0/shop-by`

      let shopByType
      if (context.route && context.route.path) {
        const matches = context.route.path.match(new RegExp('/shop-by(/([^/?#]*))?'))
        shopByType = matches && matches[2]
      }
      if (shopByType) {
        url += '/' + shopByType
      } else if (context.route) {
        context.redirect(302, (context.route.fullPath || '').replace('/shop-by', '/shop-by/color') || '/shop-by/color')
        return
      }

      const axiosArr = [
        context.$axios.$get(url, {
          params: {
            seoUrl: commonAsyncData.requestUrl
          }
        })
      ]
      if (shopByType === 'color') {
        axiosArr.push(context.$axios.$get(`/1.0/common/color-hex`))
      }

      const [res, colorHexRes] = await Promise.all(axiosArr)

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
      context.store.commit('setJsKey', 'shop_by')

      // 列表页将colorHex放在首屏里面，优化页面渲染
      if (shopByType === 'color' && colorHexRes) {
        const colorArr = []
        if (res.data.contentList && res.data.contentList.length) {
          res.data.contentList.forEach((lists) => {
            if (lists.list && lists.list.length) {
              lists.list.forEach((subs) => {
                if (subs.sub && subs.sub.length) {
                  subs.sub.forEach((item) => {
                    colorArr.push(item.class)
                  })
                }
              })
            }
          })
        }
        const colorHex = {}
        if (colorHexRes && colorHexRes.data && colorHexRes.data.colorHex) {
          colorArr.forEach((item) => {
            colorHex[item] = colorHexRes.data.colorHex[item]
          })
        }
        context.store.commit('setColorHex', colorHex)
      }

      // if (colorHexRes.code == 0) {
      //   context.store.commit('setColorHex', colorHexRes.data.colorHex)
      // }

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        shopByType,
        banner: res.data.banner,
        attrName: res.data.attrName,
        hoverImage: res.data.hoverImage,
        contentList: res.data.contentList,
        moreOption: res.data.moreOption
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
    margin-left: auto;
    margin-right: auto;
    min-width: 1263px;
    max-width: 1353px;
    clear: both;
    padding: 9px 30px 20px;
    min-height: 535px;
    box-sizing: border-box;
    // &.normal-center-content {
    //   width: 1004px;
    // }
  }
}
</style>
