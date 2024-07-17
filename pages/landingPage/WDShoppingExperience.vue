<template>
  <div class="wd-shopping-experience">
    <main-app ref="main" :navigation="navigation" :adaptive="true" class="adaptive-box">
      <div class="wd-content">
        <section v-track.viewOnce="{ common: getPointCommon('module1'), id: 'module1' }" class="top mb-80">
          <h2 class="title">{{ nl('page_shopping_experience_top_title') }}</h2>
          <p class="sub-title">{{ nl('page_shopping_experience_top_sub_title') }}</p>
        </section>
        <section class="middle mb-80">
          <div class="middle-item-left flex">
            <h3 class="title">{{ nl('page_shopping_experience_middle_title1') }}</h3>
            <p class="sub-title">{{ nl('page_shopping_experience_middle_sub_title1_1') }}</p>
            <p class="sub-title mt-26">{{ nl('page_shopping_experience_middle_sub_title1_2') }}</p>
            <p v-track.viewOnce="{ common: getPointCommon('startshopping'), id: 'startshopping' }" class="btn-text">
              <span
                @click="
                  setBuryPoint(
                    'startshopping',
                    language == 'en' ? '/blog/what-azazie-offers-made-to-order-vs-ready-made/' : '/all/wedding-dresses'
                  )
                "
                >{{ nl('page_shopping_experience_btn_text1') }}</span
              >
            </p>
          </div>
          <div
            v-track.viewOnce="{ common: getPointCommon('module1banner'), id: 'module1banner' }"
            class="middle-item-right ml-60 img-block"
          >
            <img :src="replaceImgCdnUrl(picture1)" alt="exclusively yours" />
          </div>
        </section>
        <section v-if="country !== 'SE'" class="middle mb-80">
          <div v-track.viewOnce="{ common: getPointCommon('module2banner'), id: 'module2banner' }" class="middle-item-left mr-60 img-block">
            <img :src="replaceImgCdnUrl(picture2)" alt="wedding dress shopping experience" />
          </div>
          <div class="middle-item-right flex">
            <h3 class="title">{{ nl('page_shopping_experience_middle_title2') }}</h3>
            <p class="sub-title">{{ nl('page_shopping_experience_middle_sub_title2_1') }}</p>
            <p class="sub-title mt-26">{{ nl('page_shopping_experience_middle_sub_title2_2') }}</p>
            <p v-track.viewOnce="{ common: getPointCommon('selectyourtryondress'), id: 'selectyourtryondress' }" class="btn-text">
              <span
                @click="
                  setBuryPoint(
                    'selectyourtryondress',
                    language == 'en' ? '/blog/how-to-throw-an-at-home-try-on-party/' : '/all/sample-brides?current_in_stock=yes'
                  )
                "
                >{{ nl('page_shopping_experience_btn_text2') }}</span
              >
            </p>
          </div>
        </section>
        <section class="middle mb-80">
          <div class="middle-item-left flex">
            <h3 class="title">{{ nl('page_shopping_experience_middle_title3') }}</h3>
            <p class="sub-title">{{ nl('page_shopping_experience_middle_sub_title3_1') }}</p>
            <p class="sub-title mt-26">{{ nl('page_shopping_experience_middle_sub_title3_2') }}</p>
            <p v-track.viewOnce="{ common: getPointCommon('bridalpluscurve'), id: 'bridalpluscurve' }" class="btn-text">
              <span
                @click="
                  setBuryPoint(
                    'bridalpluscurve',
                    language == 'en' ? '/all/wedding-dresses?subsite=bridal' : '/all/wedding-dresses/plus-size'
                  )
                "
                >{{ nl('page_shopping_experience_btn_text3') }}</span
              >
            </p>
          </div>
          <div
            v-track.viewOnce="{ common: getPointCommon('module3banner'), id: 'module3banner' }"
            class="middle-item-right ml-60 img-block"
          >
            <img :src="replaceImgCdnUrl(picture3)" alt="wedding dress shopping experience" />
          </div>
        </section>
        <!-- <section class="middle mb-80">
          <div v-track.viewOnce="{ common: getPointCommon('module4banner'), id: 'module4banner' }" class="middle-item-left mr-60 img-block">
            <img :src="replaceImgCdnUrl(picture4)" alt="wedding dress shopping experience" />
          </div>
          <div class="middle-item-right flex-center flex">
            <h3 class="title">{{ nl('page_shopping_experience_middle_title4') }}</h3>
            <p class="sub-title">{{ nl('page_shopping_experience_middle_sub_title4_1') }}</p>
          </div>
        </section> -->
        <section v-track.viewOnce="{ common: getPointCommon('module4'), id: 'module4' }" class="footer mb-80">
          <span class="sub-title text">{{ nl('page_shopping_experience_footer_text') }}</span>
        </section>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  name: 'WdShoppingExperience',
  components: {
    MainApp
  },
  data() {
    return {
      picture1: 'https://cdn-1.azazie.com/upimg/userfiles/images/a2/d5/40f6880a619578c16e6b8f76147ea2d5.jpg',
      picture2: 'https://cdn-1.azazie.com/upimg/userfiles/images/a3/04/add539d592c641375b886d0cafa4a304.jpg',
      picture3: 'https://cdn-1.azazie.com/upimg/userfiles/images/13/62/f88a82cb873883503cc7d66cf5fe1362.jpg',
      picture4: 'https://cdn-1.azazie.com/upimg/userfiles/images/65/ce/4d828b60ac8e8b4f206c98566ea865ce.jpg'
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      if (context.store.state.isNewLanguageCountry) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
      }
      context.store.commit('setJsKey', 'wd_shopping_experience')
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
  methods: {
    getPointCommon(el) {
      return {
        ec: 'brideexperience',
        el,
        dp: '/bridal-shopping-guide'
      }
    },
    setBuryPoint(el, link) {
      this.setOrderSourceFlag('bridal_shopping_guide', true)
      this.buryPoint(this, 'event', {
        ec: 'brideexperience',
        el,
        ea: 'click',
        dp: '/bridal-shopping-guide'
      })
      window.open(this.countryUrl(link), '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.wd-shopping-experience {
  width: 100%;
  background-color: #fff;
  .wd-content {
    max-width: 1293px;
    margin: 10px auto;
    .top {
      padding: 40px 100px 0;
      text-align: center;
      color: var(--color-121212);
      .sub-title {
        max-width: 715px;
        margin: 20px auto 0;
      }
    }
    .middle {
      display: flex;
      padding: 0 100px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 30px;
      .title {
        margin-bottom: 30px;
        font-size: 28px;
        line-height: 35px;
        letter-spacing: 0;
        text-align: left;
        text-transform: capitalize;
      }
      .sub-title {
        line-height: 26px;
        font-size: 18px;
        font-family: @font-family-500;
        font-style: normal;
        letter-spacing: 0.03em;
        color: #666;
      }
      .btn-text {
        margin-top: 60px;
        font-family: @font-family-600;
        font-size: 18px;
        line-height: 25px;
        text-align: left;
        letter-spacing: 0.05em;
        cursor: pointer;
        span {
          display: inline-block;
          padding: 17.5px 40px;
          background-color: #aed4bf;
          text-transform: uppercase;
        }
      }
      .img-block {
        max-width: 548px;
        img {
          display: inline-block;
          width: 100%;
          // max-width: 548px;
        }
      }
    }
    .footer {
      padding: 0 100px;
      text-align: center;
      .text {
        font-size: 28px;
        line-height: 38px;
        letter-spacing: 0.03em;
      }
    }
    .title {
      font-family: @font-Ivy-Mode-400;
      font-weight: 400;
      font-size: 50px;
      line-height: 62px;
      text-align: center;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .sub-title {
      font-family: @font-family;
      font-style: italic;
      font-weight: 300;
      font-size: 20px;
      line-height: 32px;
      letter-spacing: 0.05em;
    }
    .flex-center {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .mb-80 {
      margin-bottom: 80px;
    }
    .ml-60 {
      margin-left: 60px;
    }
    .mr-60 {
      margin-right: 60px;
    }
    .mt-26 {
      margin-top: 26px;
    }
    .flex {
      flex: 1;
    }
  }
}
@media screen and (max-width: 1293px) {
  .wd-shopping-experience .wd-content {
    .top {
      padding: 20px 20px 0;
    }
    .middle,
    .footer {
      padding: 0 20px;
    }
    .ml-60,
    .mr-60 {
      margin-left: 0;
      margin-right: 0;
    }
  }
  /deep/ #activity_bar .activity-bar-content .bar_text a img {
    width: 100% !important;
  }
}
@media screen and (max-width: 1096px) {
  .wd-shopping-experience .wd-content {
    .top .title {
      font-size: 34px;
      line-height: 31px;
    }
    .middle,
    .footer {
      .title {
        font-size: 20px;
        margin-bottom: 10px;
      }
      .sub-title {
        font-size: 14px;
        line-height: 20px;
      }
      .btn-text {
        margin-top: 30px;
        span {
          padding: 12.5px 20px;
        }
      }
    }
  }
}
</style>
