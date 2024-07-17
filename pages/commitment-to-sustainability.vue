<template>
  <div class="sustainability">
    <main-app :navigation="navigation">
      <div class="sustainability-content">
        <img :src="addWebpSuffix(nl('page_image_sustainability_banner'))" alt="top banner" />
        <div class="main-content">
          <img
            id="banner1"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/50/c7/fe62d64fa75222fa691aa4b6c95350c7.png')"
            alt="sustainability banner1"
          />
          <img id="banner2" :src="addWebpSuffix(nl('page_image_sustainability_img2'))" alt="sustainability banner2" />
          <img id="banner3" :src="addWebpSuffix(nl('page_image_sustainability_img3'))" alt="sustainability banner3" />
          <img
            id="banner4"
            :class="'banner-' + language"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/f6/f3/008f8e5a09db874df255f5182f91f6f3.png')"
            alt="sustainability banner4"
          />
          <img
            id="banner5"
            :class="'banner-' + language"
            :src="addWebpSuffix(nl('page_image_sustainability_img5'))"
            alt="sustainability banner5"
          />
          <img
            id="banner6"
            :class="'banner-' + language"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/67/c6/d1ee2675131c8cdecf1234acc36967c6.png')"
            alt="sustainability banner6"
          />
        </div>
        <a id="button" :class="['btn-' + language]" :href="countryUrl('/inspiration/wedding-themes-ideas')" target="_blank">
          <span class="btn-text">{{ nl('page_commintent_to_text') }}</span>
        </a>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
export default {
  name: 'CommitmentToSustainability',
  components: {
    MainApp,
    backToTop
  },
  data() {
    return {}
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      context.store.commit('setJsKey', 'CommitmentToSustainability')
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
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.sustainability-content {
  width: 100%;
  max-width: 1293px;
  margin: 0 auto;
  padding-bottom: 20px;
  min-height: 535px;
  & > img:first-child {
    width: 100%;
  }
  .main-content {
    position: relative;
    width: 100%;
    height: 1993px;
  }
  #banner1 {
    position: absolute;
    left: 48px;
    top: 22px;
  }
  #banner2 {
    position: absolute;
    left: 626px;
    top: 78px;
    max-width: 624px;
  }
  #banner3 {
    position: absolute;
    left: 64px;
    top: 854px;
    max-width: 625px;
  }
  #banner4 {
    position: absolute;
    left: 626px;
    top: 650px;
    &.banner-fr {
      top: 718px;
    }
    &.banner-es {
      top: 752px;
    }
  }
  #banner5 {
    position: absolute;
    left: 626px;
    top: 1146px;
    max-width: 624px;
    &.banner-fr {
      top: 1214px;
    }
    &.banner-es {
      top: 1248px;
    }
  }
  #banner6 {
    position: absolute;
    left: 48px;
    top: 1543px;
    &.banner-fr {
      top: 1611px;
    }
    &.banner-es {
      top: 1645px;
    }
  }
  #button {
    display: block;
    margin: 60px auto;
    text-align: center;
    &.btn-fr {
      margin-top: 128px;
    }
    &.btn-es {
      margin-top: 162px;
    }
    .btn-text {
      display: inline-block;
      padding: 0 10px;
      color: var(--color-121212);
      font-family: @font-family-600;
      font-size: 18px;
      text-transform: uppercase;
      // width: 420px;
      height: 50px;
      line-height: 50px;
      background: #aed4bf;
    }
  }
}
</style>
