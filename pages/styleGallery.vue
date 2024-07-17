<template>
  <div class="style-gallery">
    <!-- 条款页 -->
    <gallery-terms-of-use v-if="isTermsOfUse"></gallery-terms-of-use>
    <GalleryAgreement v-else-if="isAgreement" />
    <!-- 主页面 -->
    <main-app :navigation="navigation" v-else>
      <div id="style-gallery-page" class="main">
        <gallery-banner></gallery-banner>
        <gallery-filter :filters="filters" @changeFilter="changeFilter" v-if="!isBridal"></gallery-filter>
        <gallery-list
          @getGalleryInfo="getGalleryInfo"
          @getGalleryList="getGalleryList"
          :pageInfo="pageInfo"
          :loadingFlag="loadingFlag"
        ></gallery-list>
      </div>
      <back-to-top></back-to-top>
      <popup-style-gallery
        v-if="popupStyleGallery.popupStyleGalleryShow"
        @getGalleryInfo="getGalleryInfo"
        @getGalleryList="getGalleryList"
        :pageInfo="pageInfo"
      ></popup-style-gallery>
      <popup-customer-photo-upload v-if="popupCustomerPhotoUploadShow"></popup-customer-photo-upload>
    </main-app>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MainApp from '@/components/Main'
import { styleGalleryPathToFilters } from '@/assets/js/utils.js'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import colorHex from '@/assets/js/colorHex'
import backToTop from '@/components/common/BackToTop'
import GalleryBanner from '@/components/styleGallery/GalleryBanner'
import GalleryFilter from '@/components/styleGallery/GalleryFilter'
import GalleryList from '@/components/styleGallery/GalleryList'
import PopupStyleGallery from '@/components/styleGallery/PopupStyleGallery'
import GalleryTermsOfUse from '@/components/styleGallery/GalleryTermsOfUse'
import popupCustomerPhotoUpload from '@/components/product/PopupCustomerPhotoUpload'
import GalleryAgreement from '@/components/styleGallery/GalleryAgreement'

// 首屏颜色问题
const colorHexData = {
  pink: {
    key: 'pink',
    hexes: ['#ff8aa8'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Pink'
  },
  purple: {
    key: 'purple',
    hexes: ['#9e81b7'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Purple'
  },
  red: {
    key: 'red',
    hexes: ['#c00017'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Red'
  },
  green: {
    key: 'green',
    hexes: ['#4e712d'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Green'
  },
  yellow: {
    key: 'yellow',
    hexes: ['#fef984'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Yellow'
  },
  white: {
    key: 'white',
    hexes: ['#ffffff'],
    isComplexColor: 0,
    colorType: 0,
    needsInConfig: 1,
    outer: {
      hex: 'var(--color-cccccc)'
    },
    showColor: 'White'
  },
  orange: {
    key: 'orange',
    hexes: ['#ffa147'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 0,
    showColor: 'Orange'
  },
  grey: {
    key: 'grey',
    hexes: ['#ebebe8'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Grey'
  },
  brown: {
    key: 'brown',
    hexes: ['#8f6b53'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Brown'
  },
  blue: {
    key: 'blue',
    hexes: ['#60e0f9'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Blue'
  },
  black: {
    key: 'black',
    hexes: ['#2d3029'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Black'
  },
  neutral: {
    key: 'neutral',
    hexes: ['#e2d0a8'],
    isComplexColor: 0,
    colorType: 1,
    needsInConfig: 1,
    showColor: 'Neutral'
  }
}

export default {
  name: 'StyleGallery',
  components: {
    MainApp,
    backToTop,
    GalleryBanner,
    GalleryFilter,
    GalleryList,
    PopupStyleGallery,
    popupCustomerPhotoUpload,
    GalleryTermsOfUse,
    GalleryAgreement
  },
  mixins: [colorHex],
  data() {
    return {
      loadingFlag: false,
      axiosError: false
    }
  },
  computed: {
    ...mapState('styleGallery', ['popupStyleGallery', 'galleryList', 'selectedFilters', 'currentGalleryId']),
    ...mapState('product', ['popupCustomerPhotoUploadShow'])
  },
  watch: {},
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const queryObj = styleGalleryPathToFilters(commonAsyncData.requestUrl)
      context.store.commit('styleGallery/setSelectedFilters', queryObj.filtersObj)
      context.store.commit('styleGallery/setCurrentGalleryId', queryObj.query.gallery_id)
      const isTermsOfUse = queryObj.isTermsOfUse
      const isAgreement = queryObj.isAgreement
      if (isTermsOfUse) {
        // 是条款页面
        return {
          ...commonAsyncData,
          isTermsOfUse,
          isAgreement: false
        }
      } else if (isAgreement) {
        // 是条款页面
        return {
          ...commonAsyncData,
          isTermsOfUse: false,
          isAgreement
        }
      }
      const res = await context.$axios.$post(`/1.0/style-gallery/`, {
        filters: queryObj.filtersObj,
        page: 1,
        limit: null,
        last_gallery_id: 0
      })
      if (res.code == 0) {
        if (res.data) {
          context.store.commit('styleGallery/setGalleryList', res.data.galleryList || [])
        }
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
      context.store.commit('setJsKey', 'style_gallery')

      context.store.commit('setColorHex', colorHexData)

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        pageInfo: res.data.pageInfo || {},
        filters: res.data.filters || {},
        lastGalleryId: res.data.lastGalleryId || 0,
        isTermsOfUse,
        isAgreement
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
      // 临时调整缺色问题
      this.getColorHexAjax().then(() => {
        this.$store.commit('setColorHex', Object.assign(colorHexData, this.$store.state.colorHex))
      })
    }
  },
  mounted() {
    if (this.currentGalleryId) {
      this.getGalleryInfo()
    }
  },
  methods: {
    /**
     * 获取列表
     */
    async getGalleryList(data) {
      try {
        const page = data && data[0]
        const cb = data && data[1]
        this.loadingFlag = true
        const res = await this.$axios.$post(`/1.0/style-gallery/`, {
          filters: this.selectedFilters,
          page: page || 1,
          limit: this.pageInfo.limit,
          last_gallery_id: page && page != 1 ? this.lastGalleryId : 0 // 更换filter的时候 页码要重置为1 并且 last_gallery_id 要重置
        })
        if (res.code == 0) {
          this.lastGalleryId = res.data.lastGalleryId
          this.pageInfo = res.data.pageInfo || {}
          const productList = res.data.galleryList || []
          if (productList[0]) {
            //   这里设置一下当前的 CurrentGalleryId 是因为，在弹窗里面点击下一个的时候，如果是目前页面最后一个，需要自动加载下一页，所以，加载数据的时候默认把第一个数据的 galleryId 设置为当前的 CurrentGalleryId
            this.$store.commit('styleGallery/setCurrentGalleryId', productList[0].galleryId)
          }
          if (this.pageInfo.page && this.pageInfo.page > 1) {
            this.$store.commit('styleGallery/setGalleryList', this.galleryList.concat(productList))
          } else {
            this.$store.commit('styleGallery/setGalleryList', productList)
          }
          if (cb && cb == 'getInfo') {
            this.getGalleryInfo()
          }
        }
        if (!this.axiosError) {
          this.loadingFlag = false
        }
      } catch (error) {
        console.log(error)
        this.axiosError = true
      }
    },
    changeFilter() {
      this.changePathFilters()
      this.getGalleryList()
    },
    changePathFilters() {
      let path = '/style-gallery'
      const pathQueryObj = {
        category: {
          key: 'category',
          reg: /\/(category)\/([0-9a-zA-Z-_,]*)/g
        },
        colors: {
          key: 'colors',
          reg: /\/(colors)\/([0-9a-zA-Z-_,]*)/g
        },
        length: {
          key: 'length',
          reg: /\/(length)\/([0-9a-zA-Z-_,]*)/g
        },
        neckline: {
          key: 'neckline',
          reg: /\/(neckline)\/([0-9a-zA-Z-_,]*)/g
        }
      }
      for (const itemKey in this.selectedFilters) {
        if (this.selectedFilters[itemKey] && this.selectedFilters[itemKey].length) {
          const element = this.selectedFilters[itemKey][0]
          if (path.includes(`/${itemKey}`)) {
            const keyReg = pathQueryObj[itemKey].reg
            const keyArray = keyReg.exec(path)
            if (keyArray.length && keyArray[1]) {
              path = path.replace(keyReg, `/${pathQueryObj[itemKey].key}/${element}`)
            }
          } else {
            path = path + `${path.includes('/with/') ? '' : '/with'}/${pathQueryObj[itemKey].key}/${element}`
          }
        }
      }
      history.pushState('', '', path)
    },
    getGalleryInfo() {
      if (!this.currentGalleryId) return
      // 设置弹窗和url地址都在这里统一处理，其他地方只需要设置好currentGalleryId并且调用这个方法即可
      this.$store.commit('styleGallery/setPopupStyleGalleryShow', {
        popupStyleGalleryShow: true,
        popupStyleGalleryId: this.currentGalleryId
      })
      //   弹窗的时候需要更改url，关闭弹窗的时候需要恢复原来的url，所以这里记录下
      if (!this.selectedFilters || !Object.keys(this.selectedFilters).length) {
        //   没有任何筛选项的时候
        this.$store.commit('styleGallery/setCurrentUrl', '/style-gallery')
      } else {
        this.$store.commit('styleGallery/setCurrentUrl', window.location.href)
      }
      history.pushState('', '', `/style-gallery/${this.currentGalleryId}`)
      this.$store.commit('styleGallery/setGalleryInfoAgg', {})
      this.$axios.$post(`/1.0/style-gallery/info/${this.currentGalleryId}`).then((res) => {
        if (res.code == 0) {
          this.$store.commit('styleGallery/setGalleryInfoAgg', res.data || {})
        } else {
          alert(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 1293px;
  margin-left: auto;
  margin-right: auto;
  clear: both;
  padding: 10px 0 20px;
  min-height: 535px;
}
.style-gallery {
  .gallery-banner {
    padding-bottom: 9px;
    padding-top: 3px;
    position: relative;
  }
  .gallery-font {
    .banner-font {
      font-size: 50px;
      font-family: @font-family-600, sans-serif;
      z-index: 11;
      margin-top: -168px;
      position: absolute;
      text-align: center;
      width: 1000px;
      letter-spacing: 7px;
      color: #efa2b2;
      text-shadow: 2px 2px #ffffff, 3px 4px #ebd6dc;
    }
  }
}
</style>
