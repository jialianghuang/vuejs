<template>
  <div class="wedding-dress-collection">
    <main-app ref="main" :navigation="navigation" :adaptive="true" class="adaptive-box">
      <div class="collection-top-banner text-font-center">
        <div v-track.view.click="{ common: getPointCommon('banner1'), id: 'banner1' }" class="img-block">
          <a :href="countryUrl('/all/wedding-dresses?subsite=bridal')">
            <img :src="require('~/assets/images/default_img.jpg')" :data-src="addWebpSuffix(banner)" alt="img" class="lazyload" />
          </a>
        </div>
        <div class="banner-text">
          <p class="text">{{ nl('page_wd_collection_text1') }}</p>
          <p class="text normal">{{ nl('page_wd_collection_text2') }}</p>
          <!-- <p
            v-track.viewOnce="{ common: getPointCommon('shopalldresses'), id: 'shopalldresses' }"
            @click="setBuryPoint('shopalldresses')"
            class="btn-text"
          >
            <a :href="countryUrl('all/wedding-dresses')" target="_blank">{{ nl('page_special_occasions_continue_shopping') }}</a>
          </p> -->
        </div>
      </div>
      <div class="module-two text-font-center">
        <p class="two-title">{{ nl('page_shop_by_collection') }}</p>
        <div class="img-box">
          <template v-for="(item, index) in moduleImgs">
            <div
              v-track.viewOnce="{ common: getPointCommon(item.el), id: item.el }"
              @click="linkToList(item)"
              :key="index"
              class="img-block"
            >
              <img :src="require('~/assets/images/default_img.jpg')" :data-src="addWebpSuffix(item.imgUrl)" alt="img" class="lazyload" />
              <p class="name">{{ nl(item.name) }}</p>
            </div>
          </template>
        </div>
        <!-- <div class="module-two-swiper-container">
          <div
            ref="module-two-swiper"
            v-swiper:module_two_swiper="moduleTwoSwiperOption"
            @mouseenter="autoPlayStop"
            @mouseleave="autoPlayStart"
            class="swiper-container"
          >
            <div class="swiper-wrapper">
              <div v-track.viewOnce="{ common: getPointCommon('banner2'), id: 'banner2' }" class="sigle-text-box swiper-slide">
                <div class="img-block">
                  <img
                    :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/c4/75/c3c5b27560c4ed9ee07a4fa5f1e9c475.jpg')"
                    alt="swiper banner2"
                  />
                </div>
                <div class="text-box">
                  <p class="text">{{ nl('page_wd_collection_text3') }}</p>
                  <p
                    v-track.viewOnce="{ common: getPointCommon('learnmore'), id: 'learnmore' }"
                    @click="linkToMore('learnmore', '/bridal-shopping-guide')"
                    class="btn-box"
                  >
                    <span class="btn-text">{{ nl('page_common_learn_more') }}</span>
                  </p>
                </div>
              </div>
              <div v-track.viewOnce="{ common: getPointCommon('lookbook'), id: 'lookbook' }" class="sigle-text-box swiper-slide ">
                <div class="img-block">
                  <img
                    :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/8a/ab/1c6bf487edaf75ee2db6a78c36f28aab.jpg')"
                    alt="lookbook"
                  />
                </div>
                <div class="text-box banner2">
                  <p class="text">{{ nl('page_wd_collection_text5') }}</p>
                  <p
                    v-track.viewOnce="{ common: getPointCommon('viewlookbook'), id: 'viewlookbook' }"
                    @click="linkToMore('viewlookbook', '/bride-lookbook')"
                    class="btn-box view-lookbook"
                  >
                    <span class="btn-text">{{ nl('page_wd_collection_text7') }}</span>
                  </p>
                  <p
                    v-track.viewOnce="{ common: getPointCommon('downloadlookbook'), id: 'downloadlookbook' }"
                    @click="linkToMore('downloadlookbook', 'https://cdn-1.azazie.com/pdf/azazie-wd-lookbook.pdf', true)"
                    class="btn-box download-lookbook"
                  >
                    <span class="btn-text">{{ nl('page_wd_collection_text8') }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="swiper-pagination swiper-pagination-bullets"></div>
          </div>
        </div> -->
      </div>
      <!-- <div class="module-three text-font-center">
        <p class="text">{{ nl('page_wd_collection_text4') }}</p>
      </div> -->
      <div
        v-track.viewOnce="{ common: getPointCommon('item' + showBestPage, true, 'bestsellers'), id: 'bestsellers-item' + showBestPage }"
        class="module-four text-font-center best-sellers"
      >
        <p class="title">{{ nl('page_header_best_sellers') }}</p>
        <product-swiper
          v-if="!!bestSellersList.length"
          :prodList="bestSellersList"
          :nextEl="'best-sellers-button-next'"
          :prevEl="'best-sellers-button-prev'"
        >
          <div ref="best_sellers_swiper" v-swiper:best_sallers_swiper="bestSellersSwiperOption" class="swiper-container">
            <div class="swiper-wrapper product-swiper-viewport">
              <div
                v-for="(item, index) in bestSellersList.slice(0, 15)"
                :key="index"
                v-track.viewOnce="{
                  common: getPointCommon('item' + showBestPage + '_' + ((index + 1) % 5 || 5), true, 'bestsellers', {
                    goodsId: item.goodsId,
                    cat_name: item.catName,
                    dress_type: item.dressType
                  }),
                  id: 'bestsellers-item' + showBestPage + '_' + ((index + 1) % 5 || 5)
                }"
                @click="setBuryPoint('bestsellers', item, showBestPage, index)"
                class="goods-item swiper-slide"
                data-datalayer-category="PC_DetailPageRevision"
              >
                <product-swiper-item
                  :item="item"
                  :addSuffix="true"
                  :hasQuick="item.canQuickShop"
                  :hasQuickBtn="item.canQuickShop"
                  :from="'best sellers'"
                  :index="index"
                ></product-swiper-item>
              </div>
            </div>
          </div>
        </product-swiper>
      </div>
      <div
        v-track.viewOnce="{ common: getPointCommon('item' + showPage, true, 'newarrival'), id: 'newarrival-item' + showPage }"
        class="module-four text-font-center new-arrivals"
      >
        <p class="title">{{ nl('page_header_new_arrivals') }}</p>
        <product-swiper
          v-if="!!newArrivalsList.length"
          :prodList="newArrivalsList"
          :nextEl="'new-arrivals-button-next'"
          :prevEl="'new-arrivals-button-prev'"
        >
          <div ref="new_arrivals_swiper" v-swiper:new_arrivals_swiper="newArrivalSwiperOption" class="swiper-container">
            <div class="swiper-wrapper product-swiper-viewport">
              <div
                v-for="(item, index) in newArrivalsList.slice(0, 15)"
                :key="index"
                v-track.viewOnce="{
                  common: getPointCommon('item' + showPage + '_' + ((index + 1) % 5 || 5), true, 'newarrival', {
                    goodsId: item.goodsId,
                    cat_name: item.catName,
                    dress_type: item.dressType
                  }),
                  id: 'newarrival-item' + showPage + '_' + ((index + 1) % 5 || 5)
                }"
                @click="setBuryPoint('newarrival', item, showPage, index)"
                class="goods-item swiper-slide"
              >
                <product-swiper-item
                  :item="item"
                  :addSuffix="true"
                  :hasQuick="item.canQuickShop"
                  :hasQuickBtn="item.canQuickShop"
                  :from="'new arrivals'"
                ></product-swiper-item>
              </div>
            </div>
          </div>
        </product-swiper>
      </div>
      <div class="back-to-top text-font-center">
        <span @click="backToTop" class="text">{{ nl('page_back_to_top') }}</span>
      </div>
      <download-app></download-app>
      <div v-if="seoInfo.content" class="wdc-seo-box">
        <seo-content :content="seoInfo.content"></seo-content>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import productSwiper from '@/components/product/ProductSwiper'
import productSwiperItem from '@/components/product/productSwiperItem'
import DownloadApp from '@/components/common/DownloadApp'
import SeoContent from '@/components/index/SeoContent'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
let vm = null
export default {
  name: 'WeddingDressCollection',
  components: {
    MainApp,
    productSwiper,
    productSwiperItem,
    DownloadApp,
    SeoContent
  },
  data() {
    return {
      banner: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/bb/15/db9cc0e7f0d2f9a6c492ade8e237bb15.jpg',
      moduleImgs: [
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/84/82/6430a117ad7591325b85a5282cc38482.jpg',
          name: 'page_common_style_little_white_dress',
          linkUrl: '/all/wedding-dresses/with/collection/little-white-dresses',
          el: 'littlewhitedress'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/86/6c/9e900f18e5e96b790fd1c4404dca866c.jpg',
          name: 'page_common_style_modern_sleek',
          linkUrl: 'all/wedding-dresses/with/collection/modern-sleek',
          el: 'modernsleek'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/d0/58/714c215289fb5c29bcd574832164d058.jpg',
          name: 'page_common_style_boho',
          linkUrl: 'all/wedding-dresses/with/collection/boho',
          el: 'boho'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/23/68/52e05843913a9ed79f827758efb62368.jpg',
          name: 'page_common_style_fairy_tale',
          linkUrl: 'all/wedding-dresses/with/collection/fairy-tale',
          el: 'fairytale'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/reviews/2b/8f/c1c1ff67650a2a5112168553b52d2b8f.jpg',
          name: 'page_common_style_sexy_glam',
          linkUrl: 'all/wedding-dresses/with/collection/sexy-glam',
          el: 'sexyglam'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/b5/61/3cdf0d167c5e1bdc133f60def01db561.jpg',
          name: 'page_common_style_black',
          linkUrl: '/all/wedding-dresses/colors/black',
          el: 'blackweddingdress'
        }
      ],
      bestSellersSwiperOption: {
        slidesPerView: 5,
        spaceBetween: 14,
        slidesPerGroup: 5,
        simulateTouch: false,
        speed: 800,
        navigation: {
          nextEl: '.best-sellers-button-next',
          prevEl: '.best-sellers-button-prev'
        },
        on: {
          slideChangeTransitionEnd() {
            if (vm.$refs.best_sellers_swiper.swiper.activeIndex == 5) {
              vm.showBestPage = 2
            } else if ([9, 10].includes(vm.$refs.best_sellers_swiper.swiper.activeIndex)) {
              vm.showBestPage = 3
            }
          }
        }
      },
      showBestPage: 1,
      newArrivalSwiperOption: {
        slidesPerView: 5,
        spaceBetween: 14,
        slidesPerGroup: 5,
        simulateTouch: false,
        speed: 800,
        navigation: {
          nextEl: '.new-arrivals-button-next',
          prevEl: '.new-arrivals-button-prev'
        },
        on: {
          slideChangeTransitionEnd() {
            if (vm.$refs.new_arrivals_swiper.swiper.activeIndex == 5) {
              vm.showPage = 2
            } else if ([9, 10].includes(vm.$refs.new_arrivals_swiper.swiper.activeIndex)) {
              vm.showPage = 3
            }
          }
        }
      },
      showPage: 1,
      moduleTwoSwiperOption: {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          speed: 500
        },
        on: {
          slideChangeTransitionEnd() {}
        }
      }
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
      let seoInfo = {}
      const res = await context.$axios.get(`/1.0/common/seo?url=/brides-intro`)
      seoInfo = res.data.data
      const list = [
        {
          catName: 'wedding_dresses',
          dressType: 'dress',
          sortBy: 'new_arrival',
          maxLength: 20
        },
        {
          catName: 'wedding_dresses',
          dressType: 'dress',
          sortBy: 'popularity',
          maxLength: 20
        }
      ]
      let productList = await Promise.all(
        list.map((item, index) => {
          const { catName, dressType = 'dress', sortBy = 'new_arrival', maxLength = 10 } = item
          return context.$axios.$post(
            '/1.0/list/products',
            { filters: { sortBy: [sortBy] }, view_mode: [], originUrl: commonAsyncData.requestUrl || '/brides-intro' },
            {
              params: {
                cat_name: catName,
                dress_type: dressType,
                page: 1,
                limit: maxLength,
                in_stock: ''
              }
            }
          )
        })
      )
      productList = productList.map((item, index) => {
        return item.code === 0 && !item.data.empty
          ? {
              ...list[index],
              prodList: item.data.prodList,
              pageInfo: item.data.pageInfo
            }
          : {
              ...list[index],
              prodList: [],
              pageInfo: { totalCount: 0 }
            }
      })
      context.store.commit('setJsKey', 'bridesIntro')
      return {
        ...commonAsyncData,
        newArrivalsList: [...productList[0].prodList] || [],
        bestSellersList: [...productList[1].prodList] || [],
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
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    vm = this
  },
  methods: {
    linkToList(item) {
      this.setBuryPoint(item.el)
      window.open(this.countryUrl(item.linkUrl), '_blank')
    },
    linkToMore(el, url, bol) {
      this.setBuryPoint(el)
      if (bol) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'wd-lookbook')
        document.body.appendChild(link)
        link.click()
      } else {
        window.open(this.countryUrl(url), '_blank')
      }
    },
    backToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    getPointCommon(el, bol, ec, msg) {
      if (bol) {
        return {
          ec,
          el,
          dp: '/brides-intro',
          msg: JSON.stringify(msg)
        }
      }
      return {
        ec: 'brideintro',
        el,
        dp: '/brides-intro'
      }
    },
    setBuryPoint(el, item, page, index) {
      this.setOrderSourceFlag('brides_intro', true)
      if (item) {
        this.buryPoint(this, 'event', {
          ec: el,
          el: 'item' + page + '_' + ((index + 1) % 5 || 5),
          ea: 'click',
          dp: '/brides-intro',
          msg: JSON.stringify({ goodsId: item.goodsId, cat_name: item.catName, dress_type: item.dressType })
        })
      } else {
        this.buryPoint(this, 'event', {
          ec: 'brideintro',
          el,
          ea: 'click',
          dp: '/brides-intro'
        })
      }
    },
    autoPlayStop() {
      this.module_two_swiper.autoplay.stop()
    },
    autoPlayStart() {
      this.module_two_swiper.autoplay.start()
    }
  }
}
</script>

<style lang="less" scoped>
.wedding-dress-collection {
  background-color: #fff;
  .collection-top-banner {
    width: 100%;
    .img-block {
      font-size: 0;
      img {
        width: 100%;
        // max-height: 905px;
      }
    }
    .banner-text {
      width: 100%;
      background-color: @theme-color;
      padding: 44px 0 39px;
      margin: 0 auto;
      .text {
        font-size: 48px;
        line-height: 60px;
        text-align: center;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: @bg-color;
        font-family: @font-Ivy-Mode-400;
        &.normal {
          max-width: 1000px;
          margin: 5px auto 0;
          font-family: @font-family-500;
          font-size: 20px;
          line-height: 26px;
          letter-spacing: 0;
          text-transform: none;
        }
      }
      .btn-text a {
        display: inline-block;
        height: 60px;
        line-height: 60px;
        text-align: center;
        margin: 20px auto;
        padding: 0 60px;
        background-color: #666;
        font-size: 24px;
        color: #fff;
        text-transform: uppercase;
      }
    }
  }
  .module-two {
    max-width: 1293px;
    margin: 80px auto 60px;
    .two-title {
      margin-bottom: 60px;
      font-size: 44px;
      line-height: 44px;
      text-transform: uppercase;
      color: #a7927f;
    }
    .img-box {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 60px;
      font-size: 0;
      .img-block {
        max-width: 616px;
        position: relative;
        cursor: pointer;
        img {
          width: 100%;
          // max-height: 860px;
        }
        .name {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          min-height: 80px;
          background-color: rgba(51, 51, 51, 0.8);
          font-size: 36px;
          color: #fff;
          text-transform: uppercase;
          white-space: pre-wrap;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .sigle-text-box {
      width: 100%;
      // height: 460px;
      margin: 60px auto;
      // background: url('https://cdn-1.azazie.com/upimg/userfiles/images/c4/75/c3c5b27560c4ed9ee07a4fa5f1e9c475.jpg') no-repeat center;
      // background-size: 100% 100%;
      text-align: center;
      position: relative;
      .img-block {
        img {
          width: 100%;
        }
      }
      .text-box {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        // margin-left: 45%;
        margin-right: 40px;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 50%;
        .text {
          max-width: 492px;
          font-size: 44px;
          line-height: 58px;
          text-transform: uppercase;
          color: #666;
        }
        .btn-box {
          width: 100%;
          min-width: 284px;
          max-width: max-content;
          height: 60px;
          line-height: 60px;
          padding: 0 20px;
          margin: 52px auto 0;
          background-color: #666;
          cursor: pointer;
          .btn-text {
            font-size: 24px;
            color: #fff;
            text-transform: uppercase;
          }
        }
        &.banner2 {
          width: 60%;
          margin-right: 57px;
          .text {
            max-width: max-content;
            &.sub {
              max-width: 500px;
              margin-top: 23px;
              line-height: 30px;
              font-size: 24px;
              font-family: @font-family-500;
              letter-spacing: 0.05em;
              text-transform: unset;
            }
          }
          .btn-box {
            min-width: 360px;
            margin-top: 37px;
            &.download-lookbook {
              margin-top: 16px;
            }
          }
        }
      }
    }
    /deep/ .swiper-pagination-bullets {
      bottom: 90px;
    }
    /deep/ .swiper-pagination-bullet-active {
      background-color: var(--color-121212);
    }
  }
  .module-three {
    background-color: @bg-color;
    padding: 55px 0;
    .text {
      max-width: 1165px;
      margin: 0 auto;
      font-size: 36px;
      line-height: 45px;
      color: var(--color-666666);
      text-transform: uppercase;
    }
  }
  .module-four {
    max-width: 1780px;
    margin: 0 auto;
    padding: 40px 30px;
    margin-bottom: 40px;
    .title {
      margin: 0px auto 48px;
      font-size: 44px;
      line-height: 44px;
      text-transform: uppercase;
      color: #a7927f;
      font-family: @font-Ivy-Mode-400;
    }
    /deep/ .swiper-button-prev,
    /deep/ .swiper-button-next {
      background: none !important;
    }
    /deep/ .product-swiper .product-swiper-container .prev-arraw {
      left: 5px;
    }
    /deep/ .product-swiper .product-swiper-container .next-arraw {
      right: 6px;
    }
    /deep/ .swiper-item-wrapper .goods-item-a {
      .goods-name {
        font-family: @font-family-500 !important;
      }
      .goods-price {
        font-family: @font-family-500 !important;
      }
    }
    &.best-sellers {
      background: var(--color-f1e9e6);
    }
  }
  .back-to-top {
    margin: 20px auto 70px;
    .text {
      display: inline-block;
      height: 48px;
      line-height: 48px;
      padding: 0 67.5px;
      font-family: @font-family-600;
      font-size: 14px;
      text-transform: uppercase;
      color: var(--color-121212);
      border: 1px solid #ccc;
      cursor: pointer;
    }
  }
  .text-font-center {
    font-family: @font-Ivy-Mode-400;
    font-style: normal;
    font-weight: 400;
    text-align: center;
  }
  .wdc-seo-box {
    max-width: 1710px;
    margin: 0 auto 120px;
    /deep/ .seo-content-b {
      width: 100%;
      max-width: 100%;
    }
  }
  /deep/ .info-sticker.product-item-icon .sticker-icon.sticker-type-stretch.sticker_newsatin svg {
    width: 70px;
    height: 70px;
  }
  @media screen and (max-width: 1710px) {
    .wdc-seo-box {
      margin: 0 30px 80px;
    }
  }
  @media screen and (max-width: 1360px) {
    .module-two {
      margin: 40px 30px 30px;
      .two-title {
        margin-bottom: 30px;
      }
      .img-box {
        gap: 30px;
      }
      .sigle-text-box {
        margin: 30px 0;
      }
      /deep/ .swiper-pagination-bullets {
        bottom: 70px;
      }
    }
    // .module-four {
    //   margin: 0 30px;
    // }
  }
}
@media screen and (max-width: 1293px) {
  /deep/ #activity_bar .activity-bar-content .bar_text a img {
    width: 100% !important;
  }
  .wedding-dress-collection {
    .collection-top-banner .banner-text {
      padding: 20px;
      box-sizing: border-box;
      .text {
        font-size: 36px;
        line-height: 40px;
      }
    }
    .module-two {
      margin: 20px 30px 15px;
      .two-title {
        font-size: 32px;
        line-height: 1em;
      }
      .img-box .img-block {
        .name {
          height: 60px;
          font-size: 28px;
          line-height: 60px;
        }
      }
      .sigle-text-box {
        width: 100%;
        height: fit-content;
        .text-box {
          margin-right: 20px;
          .text {
            font-size: 32px;
            line-height: 40px;
          }
          .btn-box {
            height: 45px;
            line-height: 45px;
            margin-top: 32px;
            padding: 0;
            .btn-text {
              font-size: 18px;
            }
          }
        }
      }
      .sigle-text-box .text-box.banner2 {
        margin-right: 35px;
        .btn-box {
          margin-top: 25px;
          min-width: 320px;
        }
      }
      /deep/ .swiper-pagination-bullets {
        bottom: 45px;
      }
    }
    .module-three .text {
      font-size: 28px;
      line-height: 35px;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .module-four .title {
      margin: 50px auto 32px;
      font-size: 32px;
      line-height: 1em;
    }
  }
}
@media screen and (max-width: 1078px) {
  .wedding-dress-collection .module-two {
    .sigle-text-box {
      .text-box {
        margin-right: 20px;
      }
    }
    /deep/ .swiper-pagination-bullets {
      bottom: 35px;
    }
  }
}
@media screen and (max-width: 800px) {
  .wedding-dress-collection {
    .module-two {
      .sigle-text-box {
        width: 100%;
        height: fit-content;
        .text-box {
          margin-right: 20px;
          .text {
            font-size: 26px;
            line-height: 32px;
          }
          .btn-box {
            margin-top: 20px;
          }
        }
      }
      /deep/ .swiper-pagination-bullets {
        bottom: 25px;
      }
    }
    .module-three .text {
      font-size: 26px;
    }
  }
}
</style>
<style lang="less">
.wdc-seo-box #seo-content h2 {
  line-height: 50px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
}
</style>
