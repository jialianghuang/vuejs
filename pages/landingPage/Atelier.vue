<template>
  <div class="atelier-page">
    <main-app :navigation="navigation" is-show-subscribe="hide">
      <div class="atelier-container">
        <section class="atelier-top">
          <img :src="nl('page_image_sod_atelier_mask_pc')" @click="topPlay" alt="sod atelier mask" />
          <video
            id="atelier-top-video"
            poster="https://cdn-1.azazie.com/upimg/userfiles/ppml/222/47/5a/bb710ec72f519cefe2b4e845e618475a.jpeg"
            muted
            loop
            preload="true"
            autoplay
          >
            <source src="https://www.azazie.com/upvideo/product/Azazie_Teaser_Landing_Page.mp4" />
          </video>
        </section>
        <section class="atelier-about">
          <div class="atelier-about-item about">{{ nl('page_common_about') }}</div>
          <div class="atelier-about-item desc">{{ nl('page_common_atelier_text24') }}</div>
        </section>
        <section class="atelier-middle">
          <p class="atelier-middle-title">{{ nl('page_common_atelier_text3') }}</p>
          <div class="atelier-middle-pic">
            <a
              v-for="(item, key, index) in middleImages"
              :key="key + index"
              :class="['video-item', { 'hover-dom': !item.playing || item.status == 'pause' }]"
              :href="countryUrl(item.url)"
            >
              <img
                :src="require('~/assets/images/default_img.jpg')"
                :data-src="nl(item.imgUrl)"
                :alt="item.alt"
                class="lazyload goods-img"
              />
            </a>
          </div>
          <div class="atelier-middle-btn">
            <a :href="countryUrl('/all/atelier-dresses')">{{ nl('page_common_atelier_text26') }}</a>
          </div>
        </section>
        <section class="atelier-product">
          <p class="atelier-product-title">{{ nl('page_common_atelier_text25') }}</p>
          <div class="atelier-product-box">
            <a
              v-for="(product, index) in productList"
              :key="index"
              :href="countryUrl(product.goodsUrl)"
              class="atelier-product-box-item"
              target="_blank"
            >
              <img
                :src="require('~/assets/images/default_img.jpg')"
                :data-src="product.imgUrl"
                alt="product img"
                class="lazyload goods-img"
              />
              <p class="product-name">{{ product.shownGoodsName }}</p>
              <p class="product-price">{{ product.shopPriceDisplay }}</p>
            </a>
          </div>
          <div class="atelier-product-btn">
            <a :href="countryUrl('/all/atelier-dresses')">{{ nl('page_common_atelier_text26') }}</a>
          </div>
        </section>
        <section class="atelier-footer">
          <a
            :href="
              language == 'en'
                ? 'https://www.azazie.com/blog/a-toast-to-fashion-with-azazie-atelier-celebrate-your-moment-in-style-2/'
                : countryUrl('/all/atelier-dresses')
            "
          >
            <img
              :src="require('~/assets/images/default_img.jpg')"
              :data-src="nl('page_image_sod_atelier_pc_img5')"
              alt="sod atelier img5"
              class="lazyload"
            />
          </a>
        </section>
        <section class="atelier-email">
          <p class="atelier-email-title">{{ nl('page_common_atelier_text1') }}</p>
          <p class="atelier-email-desc">{{ nl('page_common_atelier_text2') }}</p>
          <az-interest-subscribe
            :isEvent="true"
            :resResult="rulesRes.email"
            :show-continue="emailDomainError"
            @subscribeSubmit="saveEmail"
            @initError="initEmailCheckDomain"
          ></az-interest-subscribe>
        </section>
        <az-dialog :visible.sync="showDialog" width="520px">
          <div class="atelier-dialog">
            <az-icon icon-class="icon-icon-success"></az-icon>
            <p class="atelier-dialog-title">{{ nl('page_common_atelier_text5') }}</p>
            <p class="atelier-dialog-desc">{{ nl('page_common_atelier_text6') }}</p>
          </div>
        </az-dialog>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import AzDialog from '@/components/az-ui/AzDialog'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
import AzInterestSubscribe from '@/components/common/AzInterestSubscribe'
import checkEmailDomain from '@/assets/js/checkEmailDomain'

export default {
  name: 'Atelier',
  components: {
    mainApp,
    AzDialog,
    AzInterestSubscribe
  },
  mixins: [checkEmailDomain],
  data() {
    return {
      topVideos: null,
      loaded: false,
      subscribeLoading: false,
      rulesRes: {
        email: ''
      },
      email: '',
      showDialog: false
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const params = {
        cat_name: 'atelier-dresses',
        dress_type: 'dress',
        topic: 'azazie',
        limit: 8
      }
      const res = await context.$axios.$post(
        `/1.0/list/content`,
        {
          filters: {},
          originUrl: '/all/atelier-dresses',
          view_mode: []
        },
        {
          params
        }
      )
      const middleImages = {
        bows: {
          imgUrl: 'page_image_sod_atelier_pc_img2',
          url: '/all/atelier-special-occasion-dresses/with/trend/bows',
          name: 'Bows',
          alt: 'page_image_sod_atelier_pc_img2',
          newWindows: false
        },
        black_and_white: {
          imgUrl: 'page_image_sod_atelier_pc_img3',
          url: '/all/atelier-special-occasion-dresses/with/trend/black-and-white',
          name: 'Black & White',
          alt: 'page_image_sod_atelier_pc_img3',
          newWindows: false
        },
        lace: {
          imgUrl: 'page_image_sod_atelier_pc_img4',
          url: '/all/atelier-special-occasion-dresses/with/trend/lace',
          name: 'Lace',
          alt: 'page_image_sod_atelier_pc_img4',
          newWindows: false
        }
      }
      let productList = []
      if (res.code == 0) {
        const { filters = {}, prodList = [] } = res.data
        const { values = {} } = filters.trend || {}
        productList = prodList
        for (const key in middleImages) {
          middleImages[key].url = values[key] && values[key].url
        }
      }
      context.store.commit('setJsKey', 'atelier')
      return {
        ...commonAsyncData,
        productList,
        middleImages
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
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const rules = {
      email: formValidatorType.email({ required: this.nl('page_js_enter_valid_add'), validator: this.nl('page_email_enter_valid') })
    }
    this.validator = new Schema(rules)
    this.$nextTick(() => {
      this.videoScroll()
    })
  },
  methods: {
    saveEmail(e) {
      if (this.subscribeLoading) return false
      this.subscribeLoading = true
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rulesRes.email = ''
      }
      this.retentionReject()
      this.$axios
        .$post(`/1.0/email/add-sod-custom-email`, {
          categories: e.categories,
          event_date: e.event_date,
          email: e.email,
          type: 'custom_page',
          is_check_email_suffix: this.needCheckEmailDomain
        })
        .then((res) => {
          this.subscribeLoading = false
          if (res.code == 100210) {
            this.emailDomainError = true
            this.rulesRes.email = res.msg
            return
          }
          if (res.code == 0) {
            this.$cookie.setCookie('UnLoginEmail', e.email, 30, '.' + this.APP_DOMAIN_LOWER)
            this.showDialog = true
            this.trackGA4NewEmail(e.email, 'atelier_subscribe', e.categories)
          }
        })
        .catch((error) => {
          console.log(error)
          this.subscribeLoading = false
        })
    },
    topPlay() {
      this.topVideos && this.topVideos.play()
    },
    videoScroll() {
      if (
        'IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window &&
        'intersectionRatio' in window.IntersectionObserverEntry.prototype
      ) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, index) => {
              if (entry.intersectionRatio >= 0.8) {
                entry.target && entry.target.play()
              } else {
                entry.target && entry.target.pause()
              }
            })
          },
          { threshold: 0.8 }
        )
      }
      this.topVideos = document.getElementById('atelier-top-video')
      this.observer && this.observer.observe(this.topVideos)
    }
  }
}
</script>

<style lang="less" scoped>
.atelier-page {
  --vertical-gap: 80px;
  --level-gap: 200px;
  --column-gap: 20px;
  --paly-icon-width: 100px;
  --max-height: 600px;
  background-color: #fff;
  * {
    transition: all 0.25s ease;
  }
  img {
    width: 100%;
    vertical-align: middle;
  }
  .atelier-top {
    position: relative;
    font-size: 0;
    background: url('~assets/images/goodsList/img-bg.png') no-repeat center center/ 74px 80px, var(--color-f9f9f9);
    max-height: var(--max-height);
    video {
      width: 100%;
      vertical-align: middle;
    }
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 31.25%;
      vertical-align: middle;
      transform: translate(-50%, -50%);
    }
  }

  .atelier-about {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: calc(var(--column-gap) * 2);
    padding: var(--vertical-gap) var(--level-gap);
    background-color: #121212;
    .atelier-about-item {
      &.about {
        margin-right: auto;
        color: #ffffff;
        -webkit-text-stroke-width: 1;
        -webkit-text-stroke-color: #121212;
        font-family: @font-Ivy-Mode-400;
        font-size: 48px;
        font-weight: 400;
        letter-spacing: 3.84px;
        text-transform: uppercase;
      }
      &.desc {
        max-width: 1200px;
        color: #ffffff;
        text-align: center;
        font-family: @font-family-500;
        font-size: 24px;
        font-weight: 500;
        line-height: 36px; /* 150% */
        letter-spacing: 1.44px;
      }
    }
  }
  .atelier-email {
    background-color: #121212;
    padding: var(--vertical-gap) 0;
    margin: var(--vertical-gap) auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-title {
      color: var(--color-ffffff);
      text-align: center;
      font-family: @font-Ivy-Mode-400;
      font-size: 48px;
      line-height: 85px;
      letter-spacing: 3.84px;
      text-transform: uppercase;
    }
    &-desc {
      margin: 5px 0 calc(var(--column-gap) * 2);
      color: var(--color-ffffff);
      text-align: center;
      font-family: @font-family-500;
      font-size: 24px;
      font-weight: 500;
      line-height: 32px;
      letter-spacing: 2.4px;
    }
    .form-box {
      display: flex;
      column-gap: 10px;
      transition: all 0.3s ease;
      .input-item {
        position: relative;
        &.email {
          &::after {
            content: '*';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: @theme-color;
          }
        }
        &.shop-type {
          animation: in-out 0.25s ease;
        }
        @keyframes in-out {
          0% {
            width: 0;
          }
          100% {
            width: 240px;
          }
        }
        &.error {
          /deep/ .az-select-main {
            border-color: #f00;
          }
        }
      }
      .error-tip {
        position: absolute;
        left: 0;
        top: 100%;
        color: #f00;
        font-style: normal;
        padding-top: 7px;
        text-transform: none;
        text-align: left;
      }
      input::-ms-clear {
        display: none;
      }
      input {
        width: 240px;
        height: 50px;
        line-height: 14px;
        color: #666;
        font-family: @font-family-500;
        font-weight: 500;
        outline: none;
        padding: 0 6px 0 6px;
        background: #fff;
        border: solid 1px @border-color;
        box-sizing: border-box;
        &:focus {
          border: solid 2px var(--theme-color);
          padding: 10px 5px;
        }
        &.error {
          border: solid 1px #f00;
          background: var(--color-f9f9f9);
          padding: 10px 5px;
        }
        &::placeholder {
          color: var(--color-999999);
          font-family: @font-family-500;
          font-size: 13px;
          font-weight: 500;
          line-height: 32px; /* 246.154% */
          letter-spacing: 0.26px;
        }
      }
      /deep/ .atelier-button {
        background-color: var(--color-ffffff);
        padding: 0;
        width: 160px;
        height: 50px;
        overflow: hidden;
        line-height: 50px;
        border: none;
        color: var(--color-121212);
        font-family: @font-family-700;
        font-size: 14px;
        letter-spacing: 0.28px;
        text-transform: uppercase;
      }
      /deep/ .az-select-main {
        text-transform: capitalize;
        border-color: @border-color;
        .az-select-options {
          // max-height: 200px !important;
          z-index: @z-index-5;
        }
      }
    }
    /deep/ .interested-list-box {
      gap: 20px 30px;
      .check-box-item-text {
        color: var(--color-ffffff);
        font-size: 14px;
      }
    }
  }
  .atelier-middle {
    margin: var(--vertical-gap) auto;
    text-align: center;
    &-title {
      color: var(--color-121212);
      font-family: @font-Ivy-Mode-400;
      font-size: 48px;
      font-style: normal;
      font-weight: 400;
      line-height: 85px; /* 177.083% */
      letter-spacing: 3.84px;
      text-transform: uppercase;
    }
    &-desc {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 32px; /* 133.333% */
      letter-spacing: 2.4px;
    }
    &-pic {
      // max-width: 1600px;
      margin: 30px 100px 0;
      display: flex;
      column-gap: 20px;
      .video-item {
        position: relative;
        width: calc((100% - 40px) / 3);
        background: url('~assets/images/goodsList/img-bg.png') no-repeat center center/ 74px 80px, var(--color-f9f9f9);
        img {
          width: 100%;
          inset: 0;
          // aspect-ratio: 23 / 28;
          z-index: 1;
        }
      }
    }
    &-btn {
      width: fit-content;
      margin: calc(var(--column-gap) + 10px) auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: 1px solid #121212;
      a {
        width: fit-content;
        min-width: 450px;
        height: calc(var(--column-gap) * 3);
        color: #121212;
        text-align: center;
        font-family: @font-family-600;
        font-size: 20px;
        font-weight: 600;
        line-height: calc(var(--column-gap) * 3);
        letter-spacing: 1.2px;
        text-transform: uppercase;
      }
    }
  }

  .atelier-product {
    margin: var(--vertical-gap) auto;
    padding: 0 calc(var(--vertical-gap) * 2);
    text-align: center;
    &-title {
      color: #121212;
      font-family: @font-Ivy-Mode-400;
      font-size: 48px;
      font-weight: 400;
      line-height: 85px;
      letter-spacing: 3.84px;
      text-transform: uppercase;
    }
    &-box {
      display: flex;
      column-gap: var(--column-gap);
      // margin: calc(var(--column-gap) + 10px) 0;
      flex-wrap: wrap;
      &-item {
        width: calc((100% - calc(var(--column-gap) * 3)) / 4);
        margin-top: calc(var(--column-gap) + 10px);
        img {
          width: 100%;
          vertical-align: middle;
        }
        .product-name {
          padding: 0 10px;
          margin-top: 8px;
          color: #121212;
          font-family: @font-family-500;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .product-price {
          color: #121212;
          font-family: @font-family-500;
          font-size: 15px;
          font-weight: 500;
        }
      }
    }
    &-btn {
      width: fit-content;
      margin: calc(var(--column-gap) + 10px) auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: 1px solid #121212;
      a {
        width: fit-content;
        min-width: 450px;
        height: calc(var(--column-gap) * 3);
        color: #121212;
        text-align: center;
        font-family: @font-family-600;
        font-size: 20px;
        font-weight: 600;
        line-height: calc(var(--column-gap) * 3);
        letter-spacing: 1.2px;
        text-transform: uppercase;
      }
    }
  }
  .atelier-footer {
    margin: var(--vertical-gap) 0;
    a {
      display: block;
    }
  }
  .atelier-dialog {
    text-align: center;
    .az-icon {
      font-size: 80px;
      vertical-align: middle;
      fill: currentColor;
      color: @theme-color;
    }
    &-title {
      margin: var(--column-gap) 0 10px;
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-600;
      font-size: 18px;
      line-height: normal;
      letter-spacing: 0.72px;
      text-transform: uppercase;
    }
    &-desc {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 13px;
      line-height: normal;
      letter-spacing: 0.52px;
    }
  }
  /deep/ .az-footer-box {
    margin-top: var(--vertical-gap);
  }
  @media screen and (max-width: 1600px) {
    --vertical-gap: 60px;
    --level-gap: 160px;
    --column-gap: 15px;
    --paly-icon-width: 80px;
    .atelier-middle-pic {
      margin: 20px 40px 0;
    }
    .atelier-product-btn a {
      min-width: 380px;
    }
  }
  @media screen and (max-width: 1440px) {
    --vertical-gap: 50px;
    --level-gap: 140px;
    --column-gap: 15px;
    --paly-icon-width: 60px;
    .atelier-middle-pic {
      margin: 15px 30px 0;
    }
    .atelier-product-btn a {
      min-width: 340px;
    }
  }
  @media screen and (max-width: 1263px) {
    --vertical-gap: 40px;
    --level-gap: 100px;
    --column-gap: 10px;
    .atelier-middle-btn a,
    .atelier-product-btn a {
      height: 45px;
      line-height: 45px;
    }
  }
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-leave-to {
    transform: scale(0);
    opacity: 0;
  }
  @media screen and (max-width: 2560px) {
    --max-height: 800px;
  }
  @media screen and (max-width: 3840px) {
    --max-height: 1200px;
  }
  @media screen and (max-width: 7680px) {
    --max-height: 2400px;
  }
}

/deep/ .az-interest-subscribe {
  background: var(--color-121212) !important;
  .interest-title {
    color: var(--color-ffffff) !important;
  }
  .interest-checkbox-text {
    color: var(--color-ffffff) !important;
  }
  .subscribe-box label {
    color: var(--color-ffffff) !important;
  }
  .az-checkbox-icon {
    background: var(--color-121212) !important;
  }
  .mailbox-subscription button {
    background: var(--color-ffffff) !important;
    color: var(--color-121212) !important;
  }
  .az-check-box-item {
    border: 1px solid var(--color-ffffff) !important;
    background: none !important;
  }
  .az-check-box-item.checked {
    border: none !important;
  }
  .az-check-box-item.checked .az-icon {
    fill: var(--color-ffffff) !important;
  }
}
</style>
