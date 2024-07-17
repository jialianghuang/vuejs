<template>
  <div class="brides-box">
    <main-app :navigation="navigation" :adaptive="true">
      <a :href="countryUrl('/all/sample-dresses?current_in_stock=yes')" class="tah-banner-item">
        <div
          v-track.viewOnce.click="getBiParams('tryonstylesathome')"
          @click="setOrderSourceFlag(sourceTrackId, true)"
          :class="['tah-img-block text-center', { 'tah-lazy-block': !bannerImg._imgLoaded }]"
        >
          <img @load="imgLoaded('bannerImg')" :data-src="replaceImgCdnUrl(bannerImg.imageUrl)" class="img lazyload" alt="banner" />
        </div>
        <span class="tah-title up-case banner-btn">{{ nl('page_try_at_home_text1') }}</span>
      </a>
      <div class="brides-box-content">
        <section class="tah tah-banner text-center">
          <div @click="setOrderSourceFlag(sourceTrackId, true)" class="tah-text banner-sub-title">
            {{ nl('page_try_at_home_text2') }}
            <a
              v-track.viewOnce.click="getBiParams('FAQ')"
              :href="getSupportUrl('/articles/205644249-At-Home-Try-On-Program', `/articles/8076722`)"
              >{{ nl('page_js_faq') }}</a
            >.
          </div>
        </section>
        <!-- how it works -->
        <section class="tah tah-hiw">
          <div class="tah-hiw-item text-center">
            <p class="tah-title tah-title-sub up-case">{{ nl('page_header_how_it_works') }}</p>
            <div class="tah-desc-box text-left">
              <p v-if="isBridal" class="tah-text">{{ nl('page_bridal_how_it_works_text1') }}</p>
              <p v-else class="tah-text">{{ firstDesc }}</p>

              <p v-if="isBridal" class="tah-text">{{ nl('page_bridal_how_it_works_text2') }}</p>
              <p v-else class="tah-text">{{ nl('page_try_at_home_text4') }}</p>

              <p v-if="isBridal" class="tah-text">
                <span v-html="nl('page_bridal_how_it_works_text3')"></span>
              </p>
              <p v-else v-html="nl('page_try_at_home_text5')" class="tah-text"></p>
              <p v-if="isBridal" class="tah-text">{{ nl('page_bridal_how_it_works_text4') }}</p>
              <p v-else class="tah-text">{{ nl('page_try_at_home_text6') }}</p>
            </div>
            <a
              v-if="!isBridal"
              v-track.viewOnce.click="getBiParams('letsgetstart')"
              @click="setOrderSourceFlag(sourceTrackId, true)"
              :href="countryUrl('/all/sample-dresses?current_in_stock=yes')"
              class="tah-text-btn up-case"
            >
              <span>{{ nl('page_showroom_recommend_start') }}</span>
            </a>
            <a
              v-else
              v-track.viewOnce.click="getBiParams('letsgetstart')"
              @click="setOrderSourceFlag(sourceTrackId, true)"
              :href="countryUrl('/all/sample-brides?current_in_stock=yes')"
              class="tah-text-btn up-case"
            >
              <span>{{ nl('page_showroom_recommend_start') }}</span>
            </a>
          </div>
          <a
            v-track.viewOnce.click="getBiParams('banner')"
            @click="setOrderSourceFlag(sourceTrackId, true)"
            :href="getSupportUrl('/articles/205644249-At-Home-Try-On-Program', `/articles/8076722`)"
            :class="['tah-hiw-item', { 'tah-lazy-block': !hiwImg._imgLoaded }]"
            aria-label="hiw"
          >
            <img
              v-if="isBridal"
              @load="imgLoaded('bridalHiwImg')"
              :data-src="replaceImgCdnUrl(bridalHiwImg.imageUrl)"
              class="img lazyload"
              alt="bridal hiw"
            />
            <img v-else @load="imgLoaded('hiwImg')" :data-src="replaceImgCdnUrl(hiwImg.imageUrl)" class="img lazyload" alt="hiw" />
          </a>
        </section>
        <!-- what are you look for -->
        <section v-if="!isBridal" class="tah tah-waylf text-center">
          <p class="tah-title tah-title-sub up-case">{{ nl('page_common_looking_for') }}</p>
          <div :class="['waylf-imgs', { grid: ['GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'IE', 'SE'].includes(country) }]">
            <a
              v-for="(item, index) in waylfImgs"
              v-track.viewOnce.click="getBiParams(item.el)"
              @click="setOrderSourceFlag(sourceTrackId, true)"
              :href="countryUrl(item.linkUrl)"
              :key="index"
              :aria-label="item.el + ' ' + nl(item.imgName)"
              class="img-block"
            >
              <img :data-src="replaceImgCdnUrl(item.imageUrl)" :alt="item.el" src="~assets/images/default_img.jpg" class="img lazyload" />
              <span v-if="!['AU', 'DE', 'FR', 'ES', 'IT', 'IE', 'SE'].includes(country) && item.imgName" class="tah-text-btn up-case">{{
                nl(item.imgName)
              }}</span>
            </a>
          </div>
          <!-- AU 独有 -->
          <a
            v-track.click="getBiParams('bridesmaids')"
            @click="setOrderSourceFlag(sourceTrackId, true)"
            v-if="['AU', 'DE', 'FR', 'ES', 'IT', 'IE', 'SE'].includes(country)"
            :href="countryUrl('/all/sample-bridesmaids?current_in_stock=yes')"
            :class="['tah-text-btn up-case text-center', { padding: ['AU', 'DE', 'FR', 'ES', 'IT', 'IE', 'SE'].includes(country) }]"
            >{{ nl('page_common_bridesmaids') }}</a
          >
        </section>
        <!-- at home try on dresses  bridal -->
        <section v-if="!!productList.length && isBridal" class="tah tah-ahtod text-center">
          <p class="tah-title tah-title-sub up-case">{{ nl('page_try_at_home_text9') }}</p>
          <div class="tah-product">
            <product-swiper :prodList="productList" :nextEl="'atrod-swiper-button-next'" :prevEl="'atrod-swiper-button-prev'">
              <div ref="ctl_swiper" v-swiper:ctl_swiper="ATRODswiperOption" class="swiper-container ">
                <div :class="{ 'bridal-swiper-wrapper': isBridal }" class="swiper-wrapper product-swiper-viewport">
                  <div
                    v-track.viewOnce.click="getBiParams('athometryondresses_' + (index + 1))"
                    @click="setOrderSourceFlag(sourceTrackId, true)"
                    v-for="(item, index) in productList"
                    :key="index"
                    class="goods-item swiper-slide"
                  >
                    <product-swiper-item
                      :item="item"
                      :index="index"
                      :hasQuick="item.canQuickShop"
                      :hasQuickBtn="item.canQuickShop"
                      :addSuffix="true"
                      :from="'try-at-home'"
                    ></product-swiper-item>
                  </div>
                </div>
              </div>
            </product-swiper>
          </div>
          <a
            v-track.viewOnce.click="getBiParams('allathometryondresses_button')"
            @click="setOrderSourceFlag(sourceTrackId, true)"
            :href="countryUrl('/all/sample-brides?current_in_stock=yes')"
            class="tah-text-btn up-case"
          >
            <span>{{ nl('page_common_all') }}&nbsp;{{ nl('page_try_at_home_text9') }}</span>
          </a>
        </section>
        <!-- make it a party -->
        <section class="tah tah-miap text-center">
          <p class="tah-title tah-title-sub up-case">{{ nl('page_try_at_home_text7') }}</p>
          <p class="tah-text">{{ nl('page_try_at_home_text8') }}</p>
          <a
            :href="
              ['SE'].includes(country)
                ? countryUrl('/all/swatches-fabric?sort_by=popularity')
                : countryUrl('https://www.azazie.com/blog/how-to-throw-an-at-home-try-on-party/')
            "
            class="miap-imgs"
          >
            <img
              v-for="(img, index) in miapImgs"
              v-track.viewOnce.click="getBiParams('makeitpartybanner' + (index + 1))"
              @click="setOrderSourceFlag(sourceTrackId, true)"
              :key="index"
              :data-src="replaceImgCdnUrl(img)"
              :alt="'miap img' + index"
              src="~assets/images/default_img.jpg"
              class="img lazyload"
            />
          </a>
          <a
            v-track.viewOnce.click="getBiParams('readmore')"
            @click="setOrderSourceFlag(sourceTrackId, true)"
            :href="
              ['SE'].includes(country)
                ? countryUrl('/all/swatches-fabric?sort_by=popularity')
                : countryUrl('https://www.azazie.com/blog/how-to-throw-an-at-home-try-on-party/')
            "
            class="tah-text-btn up-case"
            aria-label="read more info"
          >
            <span>{{ nl('page_reviews_read_more') }}</span>
          </a>
        </section>
        <!-- at home try on dresses -->
        <section v-if="!!productList.length && !isBridal" class="tah tah-ahtod text-center">
          <p class="tah-title tah-title-sub up-case">{{ nl('page_try_at_home_text9') }}</p>
          <div class="tah-product">
            <product-swiper :prodList="productList" :nextEl="'atrod-swiper-button-next'" :prevEl="'atrod-swiper-button-prev'">
              <div ref="ctl_swiper" v-swiper:ctl_swiper="ATRODswiperOption" class="swiper-container ">
                <div class="swiper-wrapper product-swiper-viewport">
                  <div
                    v-track.viewOnce.click="getBiParams('athometryondresses_' + (index + 1))"
                    @click="setOrderSourceFlag(sourceTrackId, true)"
                    v-for="(item, index) in productList"
                    :key="index"
                    class="goods-item swiper-slide"
                  >
                    <product-swiper-item
                      :item="item"
                      :index="index"
                      :hasQuick="item.canQuickShop"
                      :hasQuickBtn="item.canQuickShop"
                      :addSuffix="true"
                      :from="'try-at-home'"
                    ></product-swiper-item>
                  </div>
                </div>
              </div>
            </product-swiper>
          </div>
          <a
            v-track.viewOnce.click="getBiParams('allathometryondresses_button')"
            @click="setOrderSourceFlag(sourceTrackId, true)"
            :href="countryUrl('/all/sample-dresses?current_in_stock=yes')"
            class="tah-text-btn up-case"
          >
            <span>{{ nl('page_common_all') }}&nbsp;{{ nl('page_try_at_home_text9') }}</span>
          </a>
        </section>
        <!-- 底部FAQ -->
        <div v-if="!isBridal" class="faq mid_div">
          <div class="second_title">
            <span class="title_txt">{{ nl(faq.title) }}</span>
          </div>
          <div class="children">
            <div :id="'FAQ_' + (index + 1)" v-for="(item, index) in faq.questionList" :key="index" class="qa_box">
              <p v-track.viewOnce="getBiParams('FAQ_' + (index + 1))" class="q">
                <span class="qq">{{ nl('page_letter_q') }}:</span><span class="qdesc">{{ nl(item.questionDesc) }}</span>
              </p>
              <p v-track.clickOnce="getBiParams('FAQ_Answer_' + (index + 1))" class="a">
                <span class="aa">{{ nl('page_letter_a') }}:</span><span v-html="nl(item.askDesc)" class="adesc"></span>
              </p>
            </div>
          </div>
          <div v-track.viewOnce.clickOnce="getBiParams('Azazie_FAQ')" class="last_desc">
            <span v-html="nl('page_middle_qa_footer_text')"></span>
          </div>
        </div>
        <download-app></download-app>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import productSwiper from '@/components/product/ProductSwiper'
import productSwiperItem from '@/components/product/productSwiperItem'
import DownloadApp from '@/components/common/DownloadApp'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

let vm = null
export default {
  name: 'HowItWorks',
  components: {
    mainApp,
    backToTop,
    productSwiper,
    productSwiperItem,
    DownloadApp
  },
  data() {
    return {
      ATRODswiperOption: {
        slidesPerView: 5,
        spaceBetween: 20,
        slidesPerGroup: 5,
        simulateTouch: false,
        speed: 800,
        navigation: {
          nextEl: '.atrod-swiper-button-next',
          prevEl: '.atrod-swiper-button-prev'
        },
        on: {
          slideChangeTransitionEnd() {
            console.log(vm)
          }
        }
      },
      bridalBannerImg: {
        _imgLoaded: false,
        imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/a9/22/a021ae0706075132d79f9c7554cea922.jpg'
      },
      hiwImg: {
        _imgLoaded: false,
        imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/bc/c3/13a836c79966741185c32f7dbfbbbcc3.jpg'
      },
      bridalHiwImg: {
        _imgLoaded: false,
        imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/19/88/99ef5b183d297b51daab157bb2331988.jpg'
      },
      miapImgs: [
        'https://cdn-1.azazie.com/upimg/userfiles/images/a8/6e/acb9b6996052383b1f6e90e90492a86e.jpg',
        'https://cdn-1.azazie.com/upimg/userfiles/images/82/a0/a2a947f38aa527db2bb3099d19d582a0.jpg',
        'https://cdn-1.azazie.com/upimg/userfiles/images/65/ac/34841f82f0881b6d415815a9ee6565ac.jpg'
      ],
      sourceTrackId: 'at_home_try_on_how_it_works'
    }
  },
  computed: {
    firstDesc({ country }) {
      const prefix = country.toLowerCase()
      return this.nl('page_sitemap_main_event_info_' + prefix)
    },
    waylfImgs({ country }) {
      const imagesUSCA = [
        {
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/44/a2/bcea3ff81c214072250c0371928d44a2.jpg',
          imgName: 'page_common_bridesmaids',
          linkUrl: '/all/sample-bridesmaids?current_in_stock=yes',
          el: 'bridesmaids'
        },
        {
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/84/4d/1ae01a56a88759ab63ea93fcd55c844d.jpg',
          imgName: 'page_common_bridal',
          linkUrl: '/all/sample-brides?current_in_stock=yes',
          el: 'bridal'
        },
        {
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/09/5b/ea2dd1dacb1fb19c92211b312ae1095b.jpg',
          imgName: 'page_common_mother_of_the_bride',
          linkUrl: '/all/sample-mother-of-the-bride?current_in_stock=yes',
          el: 'motherofthebride'
        }
      ]
      const imagesGB = [
        {
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/3b/1f/cfa2951356e81be5ca76a4e9ffde3b1f.jpg',
          imgName: 'page_common_bridesmaids',
          linkUrl: '/all/sample-bridesmaids?current_in_stock=yes',
          el: 'bridesmaids'
        },
        {
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/24/20/927c8daac4f84fa0db198746bb182420.jpg',
          imgName: 'page_common_bridal',
          linkUrl: '/all/sample-brides?current_in_stock=yes',
          el: 'bridal'
        }
      ]
      const imagesAU = [
        {
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/3b/3a/37852d1c680426c707a428d9ff153b3a.jpg',
          imgName: '',
          linkUrl: '/all/sample-bridesmaids?current_in_stock=yes',
          el: 'bridesmaids'
        },
        {
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/3b/1f/cfa2951356e81be5ca76a4e9ffde3b1f.jpg',
          imgName: '',
          linkUrl: '/all/sample-bridesmaids?current_in_stock=yes',
          el: 'bridesmaids'
        }
      ]
      if (country === 'GB') {
        return imagesGB
      }
      if (['AU', 'DE', 'FR', 'ES', 'IT', 'IE', 'SE'].includes(country)) {
        return imagesAU
      }
      return imagesUSCA
    },
    faq({ country }) {
      const list = {
        title: 'page_middle_qa_question_title',
        questionList: [
          {
            questionDesc: 'page_middle_qa_question_one',
            askDesc: 'page_middle_qa_question_one_answer_' + country.toLowerCase()
          },
          {
            questionDesc: 'page_middle_qa_question_two',
            askDesc: 'page_middle_qa_question_two_answer'
          },
          {
            questionDesc: 'page_middle_qa_question_three',
            askDesc: 'page_middle_qa_question_three_answer'
          },
          {
            questionDesc: 'page_middle_qa_question_four',
            askDesc: 'page_middle_qa_question_four_answer'
          },
          {
            questionDesc: 'page_middle_qa_question_five',
            askDesc: 'page_middle_qa_question_five_answer'
          },
          {
            questionDesc: 'page_middle_qa_question_six',
            askDesc: 'page_middle_qa_question_six_answer'
          },
          {
            questionDesc: 'page_middle_qa_question_seven',
            askDesc: country === 'US' ? 'page_middle_qa_question_seven_answer_us' : 'page_middle_qa_question_seven_answer'
          },
          {
            questionDesc: 'page_middle_qa_question_eight',
            askDesc: 'page_middle_qa_question_eight_answer'
          }
        ]
      }
      return list
    },
    bannerImg() {
      let imageUrl = 'https://cdn-1.azazie.com/upimg/userfiles/images/ad/b1/aeffcecf1e4e9ce7bc0e63ba806aadb1.jpg'
      if (this.isBridal) {
        imageUrl = this.nl('page_image_howitworks_banner_bridal_pc')
      } else if (this.country === 'US') {
        imageUrl = this.nl('page_image_howitworks_banner_pc_us')
        // }
        //   if (this.language === 'en') {
        //     imageUrl = 'https://cdn-1.azazie.com/upimg/userfiles/cartoon/08/68/8533c80fc870f8030ede16e150580868.jpg'
        //   } else if (this.language === 'es') {
        //     imageUrl = 'https://cdn-1.azazie.com/upimg/userfiles/cartoon/57/7c/4dc23dc38f8db4ee1d26e893ffd6577c.jpg'
        //   }
      } else {
        imageUrl = this.nl('page_image_howitworks_banner_pc')
      }

      return {
        _imgLoaded: false,
        imageUrl
      }
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      if (context.store.state.country === 'AU') context.store.commit('setIsBridal', false)
      if (context.store.state.isNewLanguageCountry) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return false
      }
      const result = await context.$axios.$post(
        '/1.0/list/products',
        { filters: { sortBy: ['popularity'] }, view_mode: [], originUrl: commonAsyncData.requestUrl || '/sample-dresses/how-it-works' },
        {
          params: {
            cat_name: context.store.state.isBridal ? 'sample-brides' : 'sample-dresses',
            dress_type: 'sample',
            page: 1,
            limit: 15,
            in_stock: 'yes'
          }
        }
      )
      let productList = []
      if (result.code == 0 && !result.data.empty) {
        productList = result.data.prodList || []
      }

      context.store.commit('setJsKey', 'how-it-works')
      return {
        ...commonAsyncData,
        productList
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
    vm = this
  },
  methods: {
    getBiParams(el) {
      return {
        id: el,
        common: {
          ec: 'how_it_works',
          el
        }
      }
    },
    addAttribute() {
      const aLinks = document.querySelectorAll('a')
      aLinks.forEach((link) => {
        link.setAttribute('target', '_blank')
      })
    },
    imgLoaded(key) {
      this.$set(this[key], '_imgLoaded', true)
    }
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .tah-banner-item {
    width: 100%;
    display: inline-grid;
    .tah-img-block,
    .tah-lazy-block,
    .tah-title {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 2;
    }
    .tah-title {
      align-self: end;
      width: max-content;
      margin: 0 auto -18px;
      padding: 15px 7.734%;
      background-color: #f6f6f6;
    }
    .tah-lazy-block {
      width: 100%;
      height: 100vw * 0.234375;
    }
  }
  .brides-box-content {
    max-width: 1293px;
    margin: 0 auto;
    .tah {
      margin: 100px auto;
    }
    .tah-banner {
      width: 100%;
      margin-top: 30px;

      .banner-sub-title {
        max-width: 1000px;
        margin: 34px auto 10px;
        a {
          text-decoration: underline;
          text-decoration-skip-ink: none;
        }
      }
      .tah-lazy-block {
        width: 100%;
        height: 420px;
      }
    }
    .tah-hiw {
      margin-top: 46px;
      display: grid;
      grid-template-columns: 50.5% 1fr;
      column-gap: 40px;
      grid-template-rows: auto;
      .tah-desc-box {
        counter-reset: descIndex;
        /deep/ a {
          color: @theme-color!important;
        }
        .tah-text {
          line-height: 32px;
          display: grid;
          grid-template-columns: 41px 1fr;
          grid-template-rows: auto;
          grid-template-areas: 'a .';
          align-items: center;
          gap: 0 30px;
          margin: 28px auto;
          &::before {
            grid-area: a;
            counter-increment: descIndex;
            content: '0' counter(descIndex);
            font-family: @font-Ivy-Mode-400;
            font-style: italic;
            font-size: 36px;
            line-height: 45px;
            color: var(--color-cccccc);
          }
        }
      }
      .tah-text-btn {
        width: max-content;
        padding: 15px 100px;
        margin: 0 auto;
        background-color: #eee;
      }
      .tah-lazy-block {
        height: 474px;
      }
    }
    .tah-waylf {
      .tah-title {
        margin-bottom: 34px;
      }
      .waylf-imgs {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 26px;
        .tah-text-btn {
          width: 100%;
          height: 50px;
          display: inline-block;
          background-color: #eee;
          line-height: 50px;
        }
        &.grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .tah-text-btn.padding {
        display: inline-block;
        padding: 16px 119px 15px 118px;
        background-color: #eee;
        margin-top: 40px;
      }
    }
    .tah-miap {
      .tah-text {
        margin: 10px auto 34px;
      }
      .miap-imgs {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0 26px;
        font-size: 0;
        .img {
          max-height: 360px;
        }
      }
      .tah-text-btn {
        width: max-content;
        background-color: #eee;
        margin: 40px auto 0;
        padding: 16px 125px 15px 124px;
      }
    }
    .tah-ahtod {
      margin-bottom: 35px;
      .tah-product {
        margin: 34px 0 40px;
        /deep/ .swiper-button-next,
        /deep/ .swiper-button-prev {
          background-image: none;
        }
      }
      .tah-text-btn {
        width: max-content;
        margin: 0 auto;
        background-color: #eee;
        padding: 16px 61px 15px;
      }
    }
  }
  .faq {
    padding-top: 10px;
    .children {
      color: var(--color-121212);
      text-align: left;
      .last_desc {
        font-family: @font-family-600;
        margin: 30px 0 20px 0;
        color: var(--color-121212);
        font-size: 16px;
        line-height: 26px;
        /deep/ a {
          text-decoration: underline;
          color: @theme-color;
        }
      }
    }
    .qa_box {
      text-align: left;
      border-bottom: 1px solid #eee;
      .q {
        font-size: 16px;
        margin-top: 30px;
        .qq {
          text-transform: uppercase;
        }
        .qdesc {
          padding-left: 5px;
        }
      }
      .a {
        margin: 15px 0;
        color: var(--color-999999);
        font-size: 13px;
        .aa {
          text-transform: uppercase;
        }
        .adesc {
          padding-left: 5px;
        }
      }
    }
  }
  .second_title {
    margin: 70px 0 60px 0;
    font-family: @font-family-600;
    text-align: center;
    color: var(--color-121212);
    font-size: 24px;
    line-height: 1px;
    text-transform: uppercase;
    border-top: 1px solid #e5e1e1;
    .title_txt {
      padding: 0 35px;
      background: #ffffff;
    }
  }

  // 公共样式
  .tah-title {
    font-family: @font-Ivy-Mode-400;
    font-style: normal;
    font-weight: 400;
    font-size: 42px;
    line-height: 52px;
    color: var(--color-121212);
  }
  .tah-title-sub {
    font-size: 36px;
    line-height: 45px;
  }
  .tah-text {
    font-family: @font-family-500;
    font-size: 18px;
    line-height: 25px;
    letter-spacing: 0.05em;
    color: var(--color-121212);
  }
  .tah-text-btn {
    font-family: @font-family-600;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: var(--color-121212);
    &:hover {
      opacity: 0.9;
    }
  }
  .up-case {
    text-transform: uppercase;
  }
  .img {
    width: 100%;
    vertical-align: middle;
  }
  a {
    display: inline-block;
    color: var(--color-121212);
  }
}

.last_desc {
  font-family: @font-family-500;
  margin: 15px 0 18px;
  color: var(--color-121212);
  a {
    text-decoration: underline;
    color: @theme-color;
  }
}
@media screen and (max-width: 1293px) {
  .brides-box .brides-box-content {
    margin: 0 30px;
  }
}
@media screen and (max-width: 1080px) {
  .brides-box .brides-box-content {
    .tah {
      margin: 60px auto;
    }
    .tah-title {
      font-size: 2rem;
      line-height: 1 !important;
    }
    .tah-title-sub {
      font-size: 1.5rem;
      line-height: 1.5 !important;
    }
    .tah-text {
      font-size: 0.875rem;
      line-height: 1.5 !important;
    }
    .tah-hiw {
      gap: 0 20px !important;
    }
    .tah-desc-box .tah-text {
      margin: 15px auto !important;
      &::before {
        font-size: 1.5rem;
        line-height: 1.2 !important;
      }
    }
  }
}

.a-link,
.a-linkl {
  text-decoration: underline !important;
  color: @theme-color !important;
}
</style>
