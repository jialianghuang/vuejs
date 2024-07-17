<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <div class="center-content">
        <div class="common-title mb-half" style="width: 1004px; margin: 50px auto 20px auto">{{ lookBookTitle }}</div>

        <div class="photo_container" style="margin-bottom: 85px">
          <div v-for="(item, index) in photoList" :key="index" class="row_photos" style="margin-bottom: 30px">
            <a :href="countryUrl(item.left.linkUrl)" v-if="item.left" aria-label="left" target="_blank">
              <img :src="replaceImgCdnUrl(item.left.imgUrl || item.left.ImgUrl)" :alt="item.alt" class="look_book_thumb" />
            </a>
            <a v-if="item.right" :href="countryUrl(item.right.linkUrl)" aria-label="right" target="_blank">
              <img :src="replaceImgCdnUrl(item.right.imgUrl || item.right.ImgUrl)" :alt="item.alt" class="look_book_thumb" />
            </a>
          </div>
        </div>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'LookBook',
  components: {
    mainApp,
    backToTop
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/navigation/look-book`, {
        params: {
          seoUrl: commonAsyncData.requestUrl
        }
      })

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
      context.store.commit('setJsKey', 'look-book')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        photoList: res.data.photoList,
        lookBookTitle: res.data.title
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
    margin-top: 22px;
    margin-bottom: 140px;
    clear: both;
  }
  .common-title {
    letter-spacing: 1px;
    font-size: 16px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
    border-bottom: solid 1px var(--color-121212);
    padding-bottom: 7px;
  }
  .photo_container {
    width: 1004px;
    margin: 0px auto;
    .row_photos {
      width: 944px;
      margin: 0px auto;
      display: flex;
      a {
        img {
          width: 440px;
          height: 580px;
        }
      }
    }
  }
}
</style>
