<template>
  <div class="brides-box">
    <main-app :navigation="navigation">
      <div class="center-content">
        <div class="top-banner">
          <h1 v-if="nl(topBanner.title)">{{ nl(topBanner.title) }}</h1>
          <p
            @click="setOrderSource(1, nl(topBanner.linkUrl), 1)"
            v-track.viewOnce.click="getBiParams(1)"
            :aria-label="nl(topBanner.imgAlt)"
            :class="{ pointer: nl(topBanner.linkUrl) }"
          >
            <span v-if="showLangsCode"> link:{{ topBanner.linkUrl }}</span>
            <img :src="replaceImgCdnUrl(nl(topBanner.imgUrl))" :alt="nl(topBanner.imgAlt)" />
          </p>
        </div>
        <div class="img-list">
          <div v-for="(item, index) in midBanners" :key="index">
            <p
              @click="setOrderSource(index + 2, nl(item.linkUrl), index + 2)"
              :aria-label="item.imgAlt"
              :class="{ pointer: nl(item.linkUrl) }"
              v-track.viewOnce.click="getBiParams(index + 2)"
            >
              <span v-if="showLangsCode"> link:{{ item.linkUrl }}</span>
              <img :src="replaceImgCdnUrl(nl(item.imgUrl))" :alt="item.imgAlt" />
            </p>
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
import { mapState } from 'vuex'

export default {
  name: 'ElopementStyles',
  components: {
    mainApp,
    backToTop
  },
  computed: {
    ...mapState(['showLangsCode'])
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'elopement-style-guide')

      const topBanner = {
        eventCategory: '',
        eventName: '',
        imgAlt: 'page_elopement_style_guide_title',
        imgUrl: 'page_image_pc_elopement_styles_topbanner',
        linkUrl: 'page_elppement_styles_top_link_url',
        title: 'page_elopement_style_guide_title'
      }

      const midBanners = [
        {
          imgAlt: 'The Little White Dress',
          imgUrl: 'page_image_pc_elopement_styles_midbanner0',
          linkUrl: 'page_elppement_styles_mid_link_url0'
        },
        {
          imgAlt: 'A Modern Look',
          imgUrl: 'page_image_pc_elopement_styles_midbanner1',
          linkUrl: 'page_elppement_styles_mid_link_url1'
        },
        {
          imgAlt: 'Simply Chic',
          imgUrl: 'page_image_pc_elopement_styles_midbanner2',
          linkUrl: 'page_elppement_styles_mid_link_url2'
        },
        {
          imgAlt: 'Bohemian Styles',
          imgUrl: 'page_image_pc_elopement_styles_midbanner3',
          linkUrl: 'page_elppement_styles_mid_link_url3'
        },
        {
          imgAlt: 'Pure Elegance',
          imgUrl: 'page_image_pc_elopement_styles_midbanner4',
          linkUrl: 'page_elppement_styles_mid_link_url4'
        }
      ]
      let seoInfo = {}
      const res = await context.$axios.get(`/1.0/common/seo?url=/wedding-dresses/little-white-dress`)
      seoInfo = res.data.data
      return {
        ...commonAsyncData,
        dataLayerInfo: {},
        topBanner,
        midBanners,
        seoInfo
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
      const json = getHeadJson(this)
      return json
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    // from=WDThemebanner1
    concatQueryPath(url, order) {
      if (!url) {
        return false
      }
      const data = 'from=WDThemebanner' + order
      const index = url.indexOf('?')
      let linkUrl = ''
      if (index === -1) {
        const hashIndex = url.indexOf('#')
        if (hashIndex === -1) {
          linkUrl = url + '?' + data
        } else {
          linkUrl = url.substring(0, hashIndex) + '?' + data + url.substring(hashIndex)
        }
      } else {
        linkUrl = url.substring(0, index + 1) + data + '&' + url.substring(index + 1)
      }
      window.open(decodeURIComponent(this.countryUrl(linkUrl)), '_blank')
    },
    setOrderSource(index, url, order) {
      this.setOrderSourceFlag('WDThemebanner' + index, true)
      this.concatQueryPath(url, order)
    },
    getBiParams(index) {
      return {
        id: 'ElopementStyles' + index,
        common: {
          ec: 'WDTheme',
          el: 'Banner' + index
        },
        threshold: 0.5
      }
    }
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .pointer {
    cursor: pointer;
  }
  .center-content {
    box-sizing: border-box;
    width: 1293px;
    clear: both;
    padding: 0;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 80px;
    clear: both;
  }
  h1 {
    margin-bottom: 10px;
    font-size: 24px;
    font-family: @font-family-500;
    color: var(--color-121212);
    line-height: 33px;
    cursor: default;
    font-weight: normal;
    text-align: left;
    text-transform: uppercase;
  }
  img {
    width: 100%;
    vertical-align: middle;
  }
}
.img-list {
  & > div {
    margin-top: 50px;
  }
}
</style>
