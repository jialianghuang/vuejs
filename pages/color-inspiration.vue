<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <h1 style="display:none">color inspiration</h1>
      <div class="center-content">
        <top-banner v-if="topBanner" :topBanner="topBanner" class="popular-banner"></top-banner>
        <color-palette-list
          v-if="addPhoto"
          :uploadImgUrl="addPhoto.imgUrl"
          :colorTitle="addPhoto.colorTitle"
          :paletteTitle="addPhoto.paletteTitle"
          :lists="fileList"
          :title="addPhoto.title"
          @open="showUpload = true"
        ></color-palette-list>
        <color-palette-list
          v-if="popularWeddings"
          :lists="popularWeddings.photoList"
          :title="popularWeddings.title"
          :colorTitle="addPhoto.colorTitle"
          :paletteTitle="addPhoto.paletteTitle"
        ></color-palette-list>
        <color-inspiration-upload-layer v-if="showUpload" @close="showUpload = false" @update="addImgList"></color-inspiration-upload-layer>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import TopBanner from '@/components/static/TopBanner'
import ColorPaletteList from '@/components/static/color-inspiration/ColorPaletteList'
import ColorInspirationUploadLayer from '@/components/static/color-inspiration/ColorInspirationUploadLayer'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'ColorInspiration',
  components: {
    mainApp,
    TopBanner,
    ColorPaletteList,
    ColorInspirationUploadLayer,
    backToTop
  },
  data() {
    return {
      showUpload: false,
      fileList: []
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const [res, colorHexRes] = await Promise.all([
        context.$axios.$get(`/1.0/navigation/color-inspiration`, {
          params: {
            seoUrl: commonAsyncData.requestUrl
          }
        }),
        context.$axios.$get(`/1.0/common/color-hex`)
      ])

      context.store.commit('setColorHex', (colorHexRes.data && colorHexRes.data.colorHex) || [])

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
      context.store.commit('setJsKey', 'color-inspiration')

      const topBanner = {}
      if (res.data && res.data.popularBanner) {
        topBanner.imgUrl = res.data.popularBanner.imgUrl
        topBanner.imgAlt = res.data.popularBanner.imgAlt
      }

      if (res.data && res.data.popularWeddings) {
        res.data.popularWeddings.photoList = [
          {
            imgUrl: require('../assets/images/color_inspiration/color_inspiration_01.jpg'),
            alt: 'color inspiration',
            text: 'color-box'
          },
          {
            imgUrl: require('../assets/images/color_inspiration/color_inspiration_02.jpg'),
            alt: 'color inspiration',
            text: 'color-box'
          },
          {
            imgUrl: require('../assets/images/color_inspiration/color_inspiration_03.jpg'),
            alt: 'color inspiration',
            text: 'color-box'
          },
          {
            imgUrl: require('../assets/images/color_inspiration/color_inspiration_04.jpg'),
            alt: 'color inspiration',
            text: 'color-box'
          },
          {
            imgUrl: require('../assets/images/color_inspiration/color_inspiration_05.jpg'),
            alt: 'color inspiration',
            text: 'color-box'
          },
          {
            imgUrl: require('../assets/images/color_inspiration/color_inspiration_06.jpg'),
            alt: 'color inspiration',
            text: 'color-box'
          }
        ]
      }

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        topBanner,
        addPhoto: res.data.addPhoto,
        popularWeddings: res.data.popularWeddings
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
  methods: {
    addImgList(files) {
      if (!(files && files[0])) return
      this.fileList.push({
        imgUrl: files[0],
        alt: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .center-content {
    box-sizing: border-box;
    width: 1004px;
    clear: both;
    padding: 0;
    margin: 0 auto;
    clear: both;
  }
  .popular-banner {
    padding-top: 10px;
    padding-bottom: 21px;
    margin: 0 auto;
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
