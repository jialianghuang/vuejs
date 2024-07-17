<template>
  <div class="barbie-dresses">
    <main-app :navigation="navigation">
      <div class="barbie-dresses-container">
        <div class="barbie-dresses-banner">
          <img
            :data-src="nl(topBanner.imgUrl)"
            :src="require('~/assets/images/default_img.jpg')"
            class="lazyload"
            alt="barbie dresses top banenr"
          />
        </div>
        <h2 class="section-title">{{ nl('page_barbie_channel_icon') }}</h2>
        <div class="barbie-dresses-channel">
          <div class="barbie-dresses-channel-main container">
            <a
              v-for="(item, index) in categoryBanner"
              :key="index"
              :href="countryUrl(item.linkUrl)"
              :aria-label="item.catName || 'category ' + item.catId"
              v-track.view.click="{ common: getBiBanner(item) }"
              class="channel-item"
            >
              <img
                :data-src="nl(item.imgUrl)"
                :src="require('~/assets/images/default_img.jpg')"
                :alt="item.catName || 'category ' + item.catId"
                class="lazyload"
              />
            </a>
          </div>
        </div>
        <div class="barbie-dresses-main container">
          <h2 class="section-title">{{ nl('page_barbie_latest_drops') }}</h2>
          <div v-for="(item, index) in content" :key="index" class="barbie-dresses-main-item">
            <a
              :href="countryUrl(item.linkUrl)"
              :aria-label="item.catName || 'category ' + item.catId"
              v-track.view.click="{ common: getBiSection(item) }"
              class="section-banner"
            >
              <img
                :data-src="item.imgUrl"
                :src="require('~/assets/images/default_img.jpg')"
                :alt="item.catName || 'category ' + item.catId"
                class="lazyload"
              />
            </a>
            <product-module v-bind="getProductModuleProps(item)"></product-module>
          </div>
        </div>
        <div class="barbie-dresses-blog">
          <a
            :href="countryUrl(blogBanner.linkUrl)"
            v-track.view.click="{ common: { ec: 'barbie_blog', el: 'banner' } }"
            target="_blank"
            aria-label="barbie dresses blog banner"
          >
            <img
              :data-src="nl(blogBanner.imgUrl)"
              :src="require('~/assets/images/default_img.jpg')"
              class="lazyload"
              alt="barbie dresses blog banenr"
            />
          </a>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import ProductModule from '@/components/product/ProductModule'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

/**
 * barbie落地页
 */
export default {
  components: {
    mainApp,
    ProductModule
  },
  data() {
    return {}
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      // barbie落地页接口
      const res = await context.$axios.$get(`/1.0/landing-page/barbie/page-info`)
      if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, resetSeoUrl(context, `/user/login?back=${context.route.fullPath}`))
        return
      }

      context.store.commit('setJsKey', 'barbie-dresses')
      return {
        ...commonAsyncData,
        topBanner: res.data.topBanner,
        categoryBanner: res.data.categoryBanner,
        content: res.data.content,
        blogBanner: res.data.blogBanner
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
      return {
        ...getHeadJson(this)
      }
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  mounted() {
    this.setPoint('barbie_formal', 'landing_page', 'view')
  },
  methods: {
    getBiBanner(item) {
      let el = ''
      if (item.catId === 7) {
        el = 'bd'
      } else if (item.catId === 2) {
        el = 'wd'
      } else if (item.catId === 10) {
        el = 'fgd'
      }
      return {
        ec: 'barbie_category',
        el
      }
    },
    getBiSection(item) {
      let ec = ''
      if (item.catId === 7) {
        ec = 'barbie_bd'
      } else if (item.catId === 2) {
        ec = 'barbie_wd'
      } else if (item.catId === 10) {
        ec = 'barbie_fgd'
      }
      return {
        ec,
        el: 'banner'
      }
    },
    getProductModuleProps(item) {
      let ec = ''
      if (item.catId === 7) {
        ec = 'barbie_bd'
      } else if (item.catId === 2) {
        ec = 'barbie_wd'
      } else if (item.catId === 10) {
        ec = 'barbie_fgd'
      }
      const viewMoreInfo = {
        seeMoreDes: item.seeMoreDes,
        ec,
        el: this.nl(item.seeMoreDes),
        linkUrl: item.linkUrl
      }
      return { list: item.prodList, swiperText: ec, scene: 'barbie', viewMoreInfo, ec, el: 'item', fromText: '' }
    }
  }
}
</script>

<style lang="less" scoped>
.barbie-dresses {
  &-container {
    text-align: center;
    img {
      width: 100%;
    }
    .container {
      width: 83.33%;
      max-width: 1600px;
      margin: 0 auto;
    }
    .section-title {
      color: var(--color-121212);
      font-family: @font-Ivy-Mode;
      //   font-size: 48px;
      font-size: 2.5vw;
      line-height: 85px;
      letter-spacing: 3.84px;
      text-transform: uppercase;
      margin-bottom: 30px;
    }
  }
  &-banner {
    margin-bottom: 40px;
  }
  &-channel {
    padding: 40px 0px;
    margin-bottom: 40px;
    background: #fee2e1;
    &-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .channel-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32.5%;
        height: 100%;
        min-height: 400px;
        color: #fff;
        text-shadow: 0px 0px 10px #4a4d72;
        font-family: @font-Ivy-Mode;
        line-height: normal;
        letter-spacing: 3.2px;
        text-transform: uppercase;
      }
    }
  }
  &-main {
    &-item {
      margin-bottom: 30px;
    }
  }
  .section-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > * {
      flex: 1;
      min-height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img {
        width: 100%;
      }
      .btn {
        background: #c79c9e;
        min-width: 300px;
        padding: 0px 50px;
        height: 50px;
        color: #fff;
        font-size: 18px;
        line-height: normal;
        font-family: var(--font-family-700);
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .barbie-dresses {
    &-container {
      .section-title {
        font-size: 48px;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .barbie-dresses {
    &-container {
      .section-title {
        line-height: 60px;
      }
    }
  }
}
@media screen and (max-width: 1263px) {
  .barbie-dresses {
    &-container {
      .section-title {
        font-size: 31.5px;
        line-height: initial;
      }
    }
  }
}
</style>
