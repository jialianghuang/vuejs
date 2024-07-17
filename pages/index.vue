<template>
  <div id="index-page" v-track.view.click="{ common: getBiParams() }" class="index-box index-box-new index-new">
    <main-app :navigation="navigation" :adaptive="true" class="adaptive-box">
      <bridal-site v-if="isBridal" :modules="modules"></bridal-site>
      <div v-else class="index-container">
        <div
          v-for="item in modules"
          :key="item.keyStr"
          :id="'module_load_' + item.keyStr"
          :class="{
            'custome-module': indexPageVersion == 'a' && (item.keyStr.indexOf('homepage_custom') === 0 || ['US', 'CA'].includes(country))
          }"
        >
          <template v-if="item.keyStr === 'firstBanner'">
            <!-- <index-activity-banner
              :banners="activityBanners"
              :margin-bottom="0"
              v-if="!!Object.keys(activityBanners).length"
              :indexBannerPosition="indexBannerPosition"
            ></index-activity-banner> -->
            <index-top-banner
              :skeleton="modulesSkeletonMap[item.keyStr]"
              :item="firstTopBanners(item)"
              :indexBannerPosition="indexBannerPosition"
            ></index-top-banner>
          </template>
          <template v-if="item.keyStr === 'brand_kendall_kylie'">
            <index-brand-KK
              :skeleton="modulesSkeletonMap[item.keyStr]"
              :item="item"
              :indexBannerPosition="indexBannerPosition"
            ></index-brand-KK>
          </template>
          <template v-if="item.keyStr === 'collections'">
            <index-collections
              :skeleton="modulesSkeletonMap[item.keyStr]"
              :item="item"
              :indexBannerPosition="indexBannerPosition"
            ></index-collections>
          </template>
          <template v-if="item.keyStr === 'collections_links'">
            <index-collections-links :skeleton="modulesSkeletonMap[item.keyStr]" :item="item"></index-collections-links>
          </template>
          <template v-if="item.keyStr === 'eventMarketing'">
            <index-marketing
              :skeleton="modulesSkeletonMap[item.keyStr]"
              :item="item"
              :indexBannerPosition="indexBannerPosition"
            ></index-marketing>
          </template>
          <template v-if="item.keyStr === 'atHomeTryOn'">
            <index-tryon :skeleton="modulesSkeletonMap[item.keyStr]" :item="item"></index-tryon>
          </template>
          <template v-if="item.keyStr === 'bdColor'">
            <index-shop-by-color :skeleton="modulesSkeletonMap[item.keyStr]" :item="item"></index-shop-by-color>
          </template>
          <template v-if="item.keyStr === 'comments'">
            <index-reviews-b
              :skeleton="modulesSkeletonMap[item.keyStr]"
              :item="item"
              :indexBannerPosition="indexBannerPosition"
            ></index-reviews-b>
          </template>
          <template v-if="item.keyStr === 'styleGallery'">
            <index-instagram :skeleton="modulesSkeletonMap[item.keyStr]" :item="item"></index-instagram>
          </template>
          <template v-if="item.keyStr === 'sellingPoint'">
            <index-selling-point :skeleton="modulesSkeletonMap[item.keyStr]" :item="item"></index-selling-point>
          </template>
          <template v-if="item.keyStr === 'featuredin'">
            <index-featuredin :skeleton="modulesSkeletonMap[item.keyStr]" :item="item"></index-featuredin>
          </template>
          <!-- <template v-if="indexPageVersion == 'a' && ['US', 'CA'].includes(country)">
            <template v-if="item.keyStr === 'cyberData-1'">
              <IndexCyberList :skeleton="modulesSkeletonMap[item.keyStr]" :item="item" />
            </template>
            <template v-if="item.keyStr === 'cyberData-2'">
              <IndexCyberList :skeleton="modulesSkeletonMap[item.keyStr]" :item="item" />
            </template>
          </template> -->
          <!-- 系统兜底模块，新增自定义模块在这之上添加 -->
          <template v-else-if="item.keyStr.indexOf('homepage_custom') === 0">
            <common-module
              :skeleton="modulesSkeletonMap[item.keyStr]"
              :config="item"
              :autoSize="true"
              :indexBannerPosition="indexBannerPosition"
            ></common-module>
          </template>
        </div>
      </div>
      <seo-content :content="seoInfo.content" v-if="!isBridal"></seo-content>
      <download-app :isBridalIndex="isBridal"></download-app>
      <scroll-to-top :icon-class="isBridal ? 'black' : 'pink'"></scroll-to-top>
      <!-- 校园大使邀请弹窗 -->
      <invitation-popup v-if="!isBridal"></invitation-popup>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import SeoContent from '@/components/index/SeoContent'
import ScrollToTop from '@/components/common/ScrollToTop'
import DownloadApp from '@/components/common/DownloadApp'
import CommonModule from '@/components/common/CommonModule'
import BridalSite from '@/components/bridal'
import InvitationPopup from '@/components/index/InvitationPopup'
import IndexTopBanner from '@/components/indexNew/IndexTopBanner'
import IndexBrandKK from '@/components/indexNew/IndexBrandKK'
import IndexCollections from '@/components/indexNew/IndexCollections'
import IndexCollectionsLinks from '@/components/indexNew/IndexCollectionsLinks'
import IndexMarketing from '@/components/indexNew/IndexMarketing'
import IndexShopByColor from '@/components/indexNew/IndexShopByColor'
import IndexTryon from '@/components/indexNew/IndexTryon'
import IndexReviewsB from '@/components/indexNew/IndexReviewsB'
import IndexInstagram from '@/components/indexNew/IndexInstagram'
import IndexSellingPoint from '@/components/indexNew/IndexSellingPoint'
import IndexFeaturedin from '@/components/indexNew/IndexFeaturedin'
// import IndexCyberList from '@/components/indexNew/IndexCyberList'

import createModuleScrollLoad from '@/assets/js/moduleScrollLoad'
import { init, initWebLanguageKeys, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import colorHex from '@/assets/js/colorHex'

const languageKeys = [
  ...MainApp.languageKeys,
  ...BridalSite.languageKeys,
  ...DownloadApp.languageKeys,
  ...InvitationPopup.languageKeys,
  ...IndexShopByColor.languageKeys,
  ...IndexInstagram.languageKeys
]

export default {
  name: 'Index',
  components: {
    ScrollToTop,
    // RecentlyView,
    // MostPopular,
    // IndexReviews,
    SeoContent,
    MainApp,
    // IndexActivityBanner,
    CommonModule,
    // IndexStyleGallery,
    BridalSite,
    IndexReviewsB,
    IndexInstagram,
    DownloadApp,
    InvitationPopup,
    IndexTopBanner,
    IndexBrandKK,
    IndexCollections,
    IndexCollectionsLinks,
    IndexMarketing,
    IndexShopByColor,
    IndexTryon,
    IndexSellingPoint,
    IndexFeaturedin
    // IndexCyberList
  },
  mixins: [colorHex],
  data() {
    return {
      marketingSwiperOption: {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          speed: 1000
        }
      }
    }
  },
  computed: {
    indexBannerPosition() {
      // ga4首页banner打点的banner顺序，从上往下排
      const indexBannerKeyList = ['firstBanner', 'brand_kendall_kylie', 'collections', 'eventMarketing', 'comments'] // 首页需要ga4 banner 打点的模块
      const indexBannerPosition = []
      this.modules &&
        this.modules.forEach((item) => {
          if (indexBannerKeyList.includes(item.keyStr)) {
            indexBannerPosition.push(item.keyStr)
          }
        })
      return indexBannerPosition
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setJsKey', 'index')
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal' || context.route.path === '/bridal')
      initWebLanguageKeys(context, languageKeys)
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      if (context.store.state.isBridal) {
        // bridal seo
        let seoInfo = {}
        try {
          const res = await context.$axios.get(`/1.0/common/seo?url=/bridal`)
          seoInfo = res.data.data
        } catch {}

        // bridal 查询首页模块信息接口
        const baseModules = await context.$axios.$get('/1.0/home/page-module', {
          params: {
            abtest: context.store.state.versionGroup.home_custom_home,
            listColorVersion: 'A', // 色系排序ab版本
            abVersion: 'b',
            topic: 'bridal'
          }
        })

        if (baseModules.code == 5) {
          // code等于5表明redis链接失败，需要用户刷新重试
          context.error({
            statusCode: 200,
            message: baseModules.msg ? baseModules.msg : 'service are unavailable temporarily, please refresh page!'
          })
          return
        } else if (baseModules.code == 404) {
          context.redirect(302, resetSeoUrl(context, `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
          return
        }

        let modules = Array.isArray(baseModules.data) ? baseModules.data : []
        modules = modules
          // 配置结果
          .filter((item) => !item.hiddenModule)
          // 数据有效性
          .filter((item) => {
            return (item.bannerList && item.bannerList.length) || item.isSystem
          })
        context.store.commit('analysis/updateTime', ['asyncDataEnd', +new Date()])
        return {
          ...commonAsyncData,
          seoInfo,
          modules
        }
      } else {
        // 查询首页模块信息接口
        // ['US', 'CA'].includes(context.store.state.country) ? context.$axios.$get('/1.0/recommend/cyber-goods') : Promise.resolve(),
        const [baseModules, firstscreen] = await Promise.all([
          context.$axios.$get('/1.0/home/page-module', {
            params: {
              abtest: context.store.state.versionGroup.home_custom_home,
              listColorVersion: 'A', // 色系排序ab版本
              abVersion: 'b',
              topic: 'azazie'
            }
          }),
          await context.$axios.$get('/1.0/home/first-screen')
        ])

        // 处理baseModules数据
        if (baseModules.code == 5) {
          // code等于5表明redis链接失败，需要用户刷新重试
          context.error({
            statusCode: 200,
            message: baseModules.msg ? baseModules.msg : 'service are unavailable temporarily, please refresh page!'
          })
          return
        } else if (baseModules.code == 404) {
          context.redirect(302, resetSeoUrl(context, `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
          return
        }
        let modules = Array.isArray(baseModules.data) ? baseModules.data : []
        modules = modules
          // 配置结果
          .filter((item) => !item.hiddenModule)
          // 数据有效性
          .filter((item) => {
            return (item.bannerList && item.bannerList.length) || item.isSystem
          })

        let marginTopStyle = {}
        let marginBottom = 12
        let hasActivityBanner = false // 有没有活动banner
        for (const key in context.store.state.activityInfo.activityInfo) {
          const activityNow = context.store.state.activityInfo.activityInfo[key]
          if (activityNow.banner && activityNow.banner.indexBanner) {
            hasActivityBanner = true
            break
          }
        }

        const moduleScrollLoad = createModuleScrollLoad({ ssr: true, autoSize: true }, modules, {})

        modules.forEach((module) => {
          if (module.keyStr === 'homepage_custom_1651139730040' || module.description === 'selling points') {
            marginTopStyle = {
              marginTop: module.paddingBottom + 'px'
            }
            marginBottom = module.paddingBottom
          } else if (hasActivityBanner) {
            marginTopStyle = {
              marginTop: marginBottom + 'px'
            }
          }
        })

        // US CA 动态加入cyber内容
        // if (context.store.state.versionObj.indexAbtest == 'A' && ['US', 'CA'].includes(context.store.state.country)) {
        //   const addModule1 = { keyStr: 'cyberData-1', data: cyberData.data.slice(0, 1) || [] }
        //   const addModule2 = { keyStr: 'cyberData-2', data: cyberData.data.slice(1) || [] }
        //   modules.splice(1, 0, addModule1)
        //   modules.splice(2, 0, addModule2)
        //   const bdColorModule = modules.splice(6, 1)
        //   modules.splice(2, 0, ...bdColorModule)
        // }
        // 处理seo数据
        const seoInfo = (firstscreen.data && firstscreen.data.seoInfo) || {}
        context.store.commit('analysis/updateTime', ['asyncDataEnd', +new Date()])
        return {
          ...commonAsyncData,
          seoInfo,
          modules,
          modulesSkeletonMap: moduleScrollLoad.modulesSkeletonMap || {},
          marginTopStyle,
          marginBottom
        }
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
  mounted() {
    this.getColorHexAjax()
    // comments: 给列表页打点用的标记勿删
    window.name = ''
    this.$nextTick(() => {
      const moduleScrollLoad = createModuleScrollLoad({ el: 'index-module', autoSize: true }, this.modules, this.modulesSkeletonMap)
      this.modulesSkeletonMap = moduleScrollLoad.modulesSkeletonMap
    })
    if (this.$route.query && this.$route.query.type === 'autotest') {
      this.$cookie.setCookie('az_autotest', '1', 7, '.' + this.APP_DOMAIN_LOWER)
      if (this.environment.includes('dev')) {
        this.$cookie.setCookie('az_autotest', '1', 7, 'localhost')
      }
    }
  },
  methods: {
    // firstBanner
    firstTopBanners(item) {
      const tempItem = JSON.parse(JSON.stringify(item))
      const firstTopBannerTemp = tempItem.bannerList ? JSON.parse(JSON.stringify(tempItem.bannerList)) : []
      for (const key in this.activityInfo) {
        const activityNow = JSON.parse(JSON.stringify(this.activityInfo[key]))
        if (activityNow.banner && activityNow.banner.indexBanner) {
          const activityBanners = activityNow.banner.indexBanner // 首页活动banner
          for (const i in activityBanners) {
            const bannerData = activityBanners[i]
            // 因为ga打点需要,所以这里把促销活动的id和name也加进去
            if (activityNow.base) {
              bannerData.activityId = activityNow.base.activityId
              bannerData.activityName = activityNow.base.name
            }
            // 首页活动banner，插入到first banner
            const { imgUrl, linkUrl, activityName, positions, newWindows } = bannerData
            firstTopBannerTemp.splice(bannerData.displayOrder - 1, 0, {
              bannerType: 'carousel',
              linkUrl,
              imageUrl: imgUrl,
              desc: activityName,
              positions,
              newWindows
            })
          }
        }
      }
      tempItem.bannerList = firstTopBannerTemp
      // this.$store.commit('setFirstTopBannerList', firstTopBannerTemp)
      return tempItem
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        dp: 'home',
        ec: ec || this.isBridal ? 'Bridalhomepage' : 'Homepage',
        el: el || this.isBridal ? 'Bridalhomepage' : 'Homepage',
        param1: (location && location.href) || '-1'
      }
      return obj
    }
  }
}
</script>

<style lang="less">
.main-modules {
  max-width: 1600px;
  min-width: unset;
  margin: 30px auto 60px;
}
.index-box {
  width: 100%;
  min-width: 768px;
  .product-swiper {
    .product-swiper-container {
      padding: 0 37px;
    }
    .goods-item {
      .img-box {
        width: 100% !important;
        margin: 0 0 8px !important;
        .goods-img {
          width: 100% !important;
        }
      }
      .goods-name {
        font-family: @font-family-500, sans-serif !important;
        width: 100% !important;
      }
      .icon-free-ship-cart {
        vertical-align: middle;
      }
    }
  }
  .flash-sale {
    .product-swiper {
      .img-box {
        margin-bottom: 5px !important;
      }
    }
  }
}
// 新版首页样式
.index-box-new {
  width: 100%;
  min-width: 768px;
  .most-popular,
  .recently-view {
    box-sizing: border-box;
    max-width: 1640px;
    padding: 0 20px;
    margin: 60px auto 60px !important;
  }
}
.afterpay_banner {
  display: block;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  max-width: 1640px;
  min-width: unset;
  margin-bottom: 30px;
  margin: 0 auto 30px auto;
  img {
    width: 100%;
  }
}
// 首页改版新版
.index-new {
  // min-width: 1280px;
  .index {
    &-container {
      img {
        display: block;
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  .index-new {
    .index {
      &-collections {
        .collections {
          &-imgs {
            dl {
              font-size: 16px;
              dd {
                a {
                  line-height: 18px;
                }
              }
            }
          }
        }
      }
      &-collections-links {
        ul {
          li {
            font-size: 14px;
          }
        }
      }
      &-tryon {
        .tryon {
          &-btn {
            font-size: 16px;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .index-new {
    .index {
      &-collections {
        .collections {
          &-imgs {
            dl {
              font-size: 20px;
              dd {
                a {
                  line-height: 24px;
                }
              }
            }
          }
        }
      }
      &-collections-links {
        ul {
          li {
            font-size: 18px;
          }
        }
      }
      &-tryon {
        .tryon {
          &-btn {
            font-size: 16px;
          }
        }
      }
    }
  }
}
.custome-module {
  .common-module .common-module__list {
    padding-bottom: 0 !important;
  }
  div.index-shopbycolor {
    background-color: var(--color-f1e9e6);
    padding: 60px 0;
    margin: -20px 0;
  }
}
</style>
