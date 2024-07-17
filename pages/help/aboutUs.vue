<template>
  <div class="about-us">
    <div style="display:none">
      <h1>{{ nl('page_common_about_us') }}</h1>
    </div>
    <main-app :navigation="navigation">
      <div class="about-us-main-content">
        <div class="first_block content_block">
          <img v-if="isBridal" :src="addWebpSuffix(nl('page_image_bridal_about_us_banner1'))" alt="about us" />
          <img v-else :src="addWebpSuffix(nl('page_image_about_us_banner1'))" alt="abount us1" />
        </div>
        <!-- about-us 1 -->
        <div class="second_block content_block">
          <div v-if="!isBridal">
            <img :src="addWebpSuffix(nl('page_image_about_us_banner2'))" usemap="#second_map" alt="about us2" />
            <map id="second_map" name="second_map">
              <area
                :href="countryUrl('/size-chart')"
                shape="rect"
                coords="260,120,430,140"
                aria-label="See our size chart"
                alt="See our size chart"
              />
              <area
                :href="getSupportUrl(`/articles/207213726`, `/articles/8076729`)"
                shape="rect"
                coords="440,220,560,250"
                aria-label="Learn more hot area1"
                alt="Learn more hot area1"
              />
              <area
                :href="countryUrl('/all/bridesmaids-bridal-party')"
                shape="rect"
                coords="100,305,355,375"
                aria-label="START SHOPPING"
                alt="START SHOPPING"
              />
            </map>
          </div>
          <div v-else>
            <img :src="addWebpSuffix(nl('page_image_bridal_about_us_banner2'))" alt="about us2" usemap="#second_map" />
            <map id="second_map" name="second_map">
              <area :href="countryUrl('/size-chart')" shape="rect" coords="365,160,465,180" aria-label="Size chart" alt="Size chart" />
              <area
                :href="getSupportUrl(`/articles/207213726`, `/articles/8076729`)"
                shape="rect"
                coords="460,270,600,290"
                aria-label="Learn more hot area2"
                alt="Learn more hot area2"
              />
              <area
                :href="countryUrl('/bridal?subsite=bridal')"
                shape="rect"
                coords="100,325,355,385"
                aria-label="START SHOPPING"
                alt="START SHOPPING"
              />
            </map>
          </div>
        </div>
        <!-- about-us 2 -->
        <div class="third_block content_block">
          <div v-if="!isBridal">
            <img :src="addWebpSuffix(nl('page_image_about_us_banner3'))" usemap="#third_map" alt="about us3" />
            <map id="third_map" name="third_map">
              <area
                :href="countryUrl('/commitment-to-sustainability')"
                shape="rect"
                coords="840,148,1100,162"
                aria-label="Sustainability"
                alt="Sustainability"
              />
              <area
                :href="countryUrl('/commitment-to-sustainability')"
                shape="rect"
                coords="854,245,960,262"
                aria-label="Sustainability"
                alt="Sustainability"
              />
              <area
                :href="getSupportUrl(`/articles/205058819-When-should-I-place-my-order-`, `/articles/8076758`)"
                shape="rect"
                coords="707,324,1027,385"
                aria-label="Learn more hot area3"
                alt="Learn more hot area3"
              />
              <area
                :href="countryUrl('/swatches')"
                shape="rect"
                coords="700,340,1040,410"
                aria-label="SHOP COLOR SWATCHES"
                alt="SHOP COLOR SWATCHES"
              />
            </map>
          </div>
          <div v-else>
            <img :src="addWebpSuffix(nl('page_image_bridal_about_us_banner3'))" alt="about us3" usemap="#third_map" />
            <map id="third_map" name="third_map">
              <area
                :href="countryUrl('/commitment-to-sustainability')"
                shape="rect"
                coords="990,105,1150,165"
                aria-label="Sustainability"
                alt="Sustainability"
              />
              <area
                :href="countryUrl('/commitment-to-sustainability')"
                shape="rect"
                coords="700,140,840,190"
                aria-label="Sustainability"
                alt="Sustainability"
              />
              <area
                :href="getSupportUrl(`/articles/205058819-When-should-I-place-my-order-`, `/articles/8076758`)"
                shape="rect"
                coords="980,260,1100,285"
                aria-label="Learn more hot area4"
                alt="Learn more hot area4"
              />
              <area
                :href="
                  isNewLanguageCountry ? countryUrl('/all/wedding-dresses?subsite=bridal') : countryUrl('/brides-intro?subsite=bridal')
                "
                shape="rect"
                coords="700,270,960,330"
                aria-label="SHOP BRIDAL"
                alt="SHOP BRIDAL"
              />
            </map>
          </div>
        </div>
        <!-- about-us 3 -->
        <div class="fourth_block content_block">
          <div v-if="!isBridal">
            <img :src="addWebpSuffix(nl('page_image_about_us_banner4'))" usemap="#fourth_map" alt="abount us4" />
            <map id="fourth_map" name="fourth_map">
              <area
                :href="getSupportUrl(`/articles/205644249-At-Home-Try-On-Program`, `/articles/8076722`)"
                shape="rect"
                coords="424,150,530,170"
                aria-label="Learn More Info1"
                alt="Learn More Info1"
              />
              <area
                :href="getSupportUrl(`/articles/360000176003-How-do-you-create-and-add-items-to-a-Showroom-`, `/articles/8076693`)"
                shape="rect"
                coords="245,325,353,343"
                aria-label="Learn More Info2"
                alt="Learn more Info2"
              />
              <area
                :href="countryUrl('/all/sample-dresses?current_in_stock=yes')"
                shape="rect"
                coords="100,410,420,472"
                aria-label="START SHOPPING"
                alt="START SHOPPING"
              />
            </map>
          </div>
          <div v-else-if="!['AU', 'DE', 'MX', 'FR', 'SE'].includes(country)">
            <img :src="addWebpSuffix(nl('page_image_bridal_about_us_banner4'))" alt="about us4" usemap="#fourth_map" />
            <map id="fourth_map" name="fourth_map">
              <area
                :href="getSupportUrl(`/articles/205644249-At-Home-Try-On-Program`, `/articles/8076722`)"
                shape="rect"
                coords="360,160,550,190"
                aria-label="Learn More Info3"
                alt="Learn More Info3"
              />
              <area
                :href="getSupportUrl(`/articles/360000176003-How-do-you-create-and-add-items-to-a-Showroom-`, `/articles/8076693`)"
                shape="rect"
                coords="250,335,370,365"
                aria-label="Learn More Info4"
                alt="Learn more Info4"
              />
              <area
                :href="countryUrl('/sample-dresses/how-it-works?subsite=bridal')"
                shape="rect"
                coords="100,220,355,280"
                aria-label="At-Home Try On"
                alt="At-Home Try On"
              />
            </map>
          </div>
        </div>
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
  name: 'AboutUs',
  components: {
    MainApp,
    backToTop
  },
  data() {
    return {}
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/about-us`)
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
      context.store.commit('setJsKey', 'about_us')
      // res.data.seoInfo.canonicalUrl = 'https://www.azazie.com/about_us'
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {}
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
.about-us-main-content {
  width: 100%;
  max-width: 1293px;
  margin: 0 auto;
  padding: 9px 0 20px;
  min-height: 535px;
  .content_block {
    position: relative;
  }
  .second_block {
    margin-top: 80px;
  }
  .third_block {
    margin-top: 80px;
  }
  .fourth_block {
    margin-top: 80px;
    margin-bottom: 100px;
  }
  area {
    outline: none;
  }
  img {
    width: 100%;
    vertical-align: middle;
  }
}
</style>
