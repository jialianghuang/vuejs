<template>
  <div class="pnina-tornai-intro-box">
    <main-app :navigation="navigation">
      <div class="center-content">
        <div v-track.viewOnce="{ common: getPointCommon('module1'), id: 'module1' }" class="banner-box">
          <img :alt="baseData.banner.title" :src="replaceImgCdnUrl(baseData.banner.imgUrl)" class="img banner-img" />
          <div class="banner-text text">{{ baseData.banner.text }}</div>
        </div>
        <div class="second-banner-box">
          <div v-track.viewOnce="{ common: getPointCommon('module1banner'), id: 'module1banner' }">
            <img :alt="baseData.secondBanner.title" :src="replaceImgCdnUrl(baseData.secondBanner.imgUrl)" class="img second-banner-img" />
          </div>
          <div class="second-banner-right">
            <div class="content">
              <div class="title">{{ baseData.secondBanner.title }}</div>
              <div class="second-banner-text text">{{ baseData.secondBanner.text }}</div>
              <a
                :href="countryUrl(baseData.secondBanner.linkUrl)"
                v-track.viewOnce="{ common: getPointCommon('learnmore'), id: 'learnmore' }"
                target="_blank"
              >
                <div @click="setOrderSource('learnmore')" class="pnina-tornai-intro-btn hollow-btn">
                  {{ baseData.secondBanner.btn }}
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="shop-all-box">
          <div class="title">{{ baseData.shopAll.title }}</div>
          <div class="img-list-box">
            <div v-for="(item, index) in baseData.shopAll.list" :key="item.name" class="item">
              <a
                :href="countryUrl(item.imgLinkUrl)"
                v-track.viewOnce="{ common: getPointCommon('module2banner' + (index + 1)), id: 'module2banner' + (index + 1) }"
                target="_blank"
              >
                <img
                  @click="setOrderSource('module2banner' + (index + 1))"
                  :alt="item.name"
                  :src="replaceImgCdnUrl(item.imgUrl)"
                  class="img shop-all-img"
                />
                <div class="desc">{{ item.name }}</div>
              </a>
            </div>
          </div>
          <a
            :href="countryUrl(baseData.shopAll.linkUrl)"
            v-track.viewOnce="{ common: getPointCommon('shopall'), id: 'shopall' }"
            target="_blank"
          >
            <div @click="setOrderSource('shopall')" class="pnina-tornai-intro-btn solid-btn">
              {{ baseData.shopAll.btn }}
            </div>
          </a>
        </div>
        <div class="shop-now-girl">
          <a
            :href="countryUrl(baseData.shopNowGirl.linkUrl)"
            :aria-label="baseData.shopNowGirl.title"
            v-track.viewOnce="{ common: getPointCommon('module3flowerbanner'), id: 'module3flowerbanner' }"
            target="_blank"
          >
            <img
              @click="setOrderSource('module3flowerbanner')"
              :alt="baseData.shopNowGirl.title"
              :src="replaceImgCdnUrl(baseData.shopNowGirl.imgUrl)"
              class="img shop-now-girl-img"
            />
          </a>
          <div class="shop-now-girl-right">
            <div class="content">
              <div class="title title-head">{{ baseData.shopNowGirl.title2 }}</div>
              <div class="title">{{ baseData.shopNowGirl.title }}</div>
              <p>{{ baseData.shopNowGirl.des1 }}</p>
              <p>{{ baseData.shopNowGirl.des2 }}</p>
              <p class="brand">{{ baseData.shopNowGirl.des3 }}</p>
              <p class="designer">{{ baseData.shopNowGirl.des4 }}</p>
              <a
                :href="countryUrl(baseData.shopNowGirl.linkUrl)"
                @click="setOrderSource('shopflowergirls')"
                v-track.viewOnce="{ common: getPointCommon('shopflowergirls'), id: 'shopflowergirls' }"
                target="_blank"
              >
                <div class="pnina-tornai-intro-btn hollow-btn">{{ baseData.shopNowGirl.btn }}</div>
              </a>
            </div>
          </div>
        </div>
        <div class="shop-now-first-box">
          <div class="shop-now-first-left">
            <div class="content">
              <div class="title">{{ baseData.shopNowFirst.title }}</div>
              <a
                :href="countryUrl(baseData.shopNowFirst.linkUrl)"
                @click="setOrderSource('shopnow1')"
                v-track.viewOnce="{ common: getPointCommon('shopnow1'), id: 'shopnow1' }"
                target="_blank"
              >
                <div class="pnina-tornai-intro-btn hollow-btn">{{ baseData.shopNowFirst.btn }}</div>
              </a>
            </div>
          </div>
          <a
            :href="countryUrl(baseData.shopNowFirst.linkUrl)"
            :aria-label="baseData.shopNowFirst.title"
            v-track.viewOnce="{ common: getPointCommon('module3banner1'), id: 'module3banner1' }"
            target="_blank"
          >
            <img
              @click="setOrderSource('module3banner1')"
              :alt="baseData.shopNowFirst.title"
              :src="replaceImgCdnUrl(baseData.shopNowFirst.imgUrl)"
              class="img shop-now-first-img"
            />
          </a>
        </div>
        <div class="shop-now-second-box">
          <div class="left">
            <a
              :href="countryUrl(baseData.shopNowSecond.linkUrl)"
              :aria-label="baseData.shopNowSecond.title"
              v-track.viewOnce="{ common: getPointCommon('module3banner2'), id: 'module3banner2' }"
              target="_blank"
            >
              <img
                @click="setOrderSource('module3banner2')"
                :alt="baseData.shopNowSecond.title"
                :src="replaceImgCdnUrl(baseData.shopNowSecond.img1Url)"
                class="img shop-now-second-img"
              />
            </a>
            <div class="desc">{{ baseData.shopNowSecond.img1Desc }}</div>
          </div>
          <div class="right">
            <div class="title">{{ baseData.shopNowSecond.title }}</div>
            <a
              :href="countryUrl(baseData.shopNowSecond.linkUrl)"
              @click="setOrderSource('shopnow2')"
              v-track.viewOnce="{ common: getPointCommon('shopnow2'), id: 'shopnow2' }"
              target="_blank"
            >
              <div class="pnina-tornai-intro-btn hollow-btn">{{ baseData.shopNowSecond.btn }}</div>
            </a>
            <a
              :href="baseData.shopNowSecond.linkUrl"
              :aria-label="baseData.shopNowSecond.title"
              v-track.viewOnce="{ common: getPointCommon('module3banner3'), id: 'module3banner3' }"
              target="_blank"
            >
              <img
                @click="setOrderSource('module3banner3')"
                :alt="baseData.shopNowSecond.title"
                :src="replaceImgCdnUrl(baseData.shopNowSecond.img2Url)"
                class="img shop-now-second-img"
              />
            </a>
          </div>
        </div>
        <div class="bottom-banner-box">
          <div v-track.viewOnce="{ common: getPointCommon('bottombanner'), id: 'bottombanner' }" class="img-box">
            <img :alt="baseData.bottomBanner.title" :src="baseData.bottomBanner.imgUrl" class="img bottom-banner-img" />
            <div class="banner-title">{{ baseData.bottomBanner.title }}</div>
          </div>
          <div class="btn-list-box">
            <div
              v-for="item in baseData.bottomBanner.btnList"
              :key="item.key"
              @click="handleClickBottomBannerBtn(item)"
              v-track.viewOnce="{ common: getPointCommon(item.el), id: item.el }"
              :class="['item', { 'cursor-pointer': item.key !== 'questions' }]"
            >
              <div class="name">{{ item.name }}</div>
              <div class="text">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'Pninatornai',
  components: {
    mainApp,
    backToTop
  },
  computed: {
    baseData() {
      return {
        banner: {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/01/3d/15133627469090d43029cf99a537013d.png',
          title: 'azazie',
          text: this.nl('page_pn_to_banner_text')
        },
        secondBanner: {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/99/33/d970b7d4a50f04a494c4223b04719933.jpg',
          title: this.nl('page_pn_to_second_banner_title'),
          text: this.nl('page_pn_to_second_banner_text'),
          btn: this.nl('page_common_learn_more'),
          linkUrl: '/lookbook'
        },
        shopAll: {
          title: this.nl('page_pn_to_shop_all_title'),
          list: [
            {
              imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/85/27/2a14f3df3fba1b8fdf0453c486ed8527.jpg',
              name: this.nl('page_pn_to_shop_all_list_1_name'),
              imgLinkUrl: '/all/bridesmaid-dresses/with/brand/pnina-tornai-for-azazie/fabric/chiffon,stretch-satin'
            },
            {
              imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/b5/e4/34c0b4afabaab88b1a2ab8d31514b5e4.jpg',
              name: this.nl('page_pn_to_shop_all_list_2_name'),
              imgLinkUrl: '/all/bridesmaid-dresses/with/brand/pnina-tornai-for-azazie/fabric/velvet'
            },
            {
              imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/8d/25/6eba98d20bf7eef25b843265ae178d25.jpg',
              name: this.nl('page_pn_to_shop_all_list_3_name'),
              imgLinkUrl: '/all/bridesmaid-dresses/with/brand/pnina-tornai-for-azazie/fabric/luxurious-mikado'
            }
          ],
          btn: this.nl('page_header_sale_shop_all'),
          linkUrl: '/all/bridesmaid-dresses/with/brand/pnina-tornai-for-azazie'
        },
        shopNowGirl: {
          title: this.nl('page_pninatornai_girl_title'),
          title2: this.nl('page_pninatornai_girl_title2'),
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/9f/4d/7e757b191bd22301728c5783e99a9f4d.jpg',
          linkUrl: '/all/flower-girl-dresses/with/brand/pnina-tornai-for-azazie',
          btn: this.nl('page_pninatornai_girl_btn'),
          des1: this.nl('page_pninatornai_girl_des1'),
          des2: this.nl('page_pninatornai_girl_des2'),
          des3: this.nl('page_pninatornai_girl_brand'),
          des4: this.nl('page_pninatornai_girl_designer')
        },
        shopNowFirst: {
          title: this.nl('page_pn_to_shop_now_first_title'),
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/78/75/94f80521c4533495fbbf27572a067875.jpg',
          linkUrl: '/all/bridesmaid-dresses/with/brand/pnina-tornai-for-azazie/fabric/signature-sequin',
          btn: this.nl('page_index_shop_now')
        },
        shopNowSecond: {
          title: this.nl('page_pn_to_shop_now_second_title'),
          img1Url: 'https://cdn-1.azazie.com/upimg/userfiles/images/50/7d/5eeb4de6c1d859693b34d6aab684507d.jpg',
          img1Desc: this.nl('page_pn_to_shop_now_second_img1_desc'),
          img2Url: 'https://cdn-1.azazie.com/upimg/userfiles/images/f1/d6/81ac5ab45915a6e873bb1d948124f1d6.jpg',
          linkUrl: '/all/bridesmaid-dresses/with/brand/pnina-tornai-for-azazie/fabric/pnina-signature-lace',
          btn: this.nl('page_index_shop_now')
        },
        bottomBanner: {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/7e/2c/78681f26478fb1742db06bd149277e2c.jpg',
          title: this.nl('page_pn_to_bottom_banner_title'),
          btnList: [
            {
              key: 'newsletter',
              name: this.nl('page_pn_to_bottom_banner_btn_1_name'),
              text: this.nl('page_pn_to_bottom_banner_btn_1_text'),
              linkUrl: '/sign-up-for-email',
              el: 'newsletter'
            },
            {
              key: 'questions',
              name: this.nl('page_pn_to_bottom_banner_btn_2_name'),
              text: this.nl('page_pn_to_bottom_banner_btn_2_text'),
              linkUrl: '',
              el: 'question'
            },
            {
              key: 'social',
              name: this.nl('page_pn_to_bottom_banner_btn_3_name'),
              text: this.nl('page_pn_to_bottom_banner_btn_3_text'),
              linkUrl: 'https://www.instagram.com/azazieofficial/',
              el: 'social'
            }
          ]
        }
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      context.store.commit('setJsKey', 'pninatornai')
      if (!commonAsyncData) return

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
  mounted() {},
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    handleClickBottomBannerBtn(btn = {}) {
      if (btn.linkUrl) {
        this.setOrderSource(btn.el)
        window.open(btn.linkUrl)
      }
      // if (key === 'newsletter') {
      //   document.querySelector('#idx-footer-sub') &&
      //     document.querySelector('#idx-footer-sub').scrollIntoView({ block: 'center', behavior: 'smooth' })
      // } else {
      //   return false
      // }
    },
    // 订单追踪
    setOrderSource(el) {
      this.setOrderSourceFlag('pnina_tornai', true)
      this.buryPoint(this, 'event', {
        ec: 'pninatornaibridesmaid',
        el,
        ea: 'click',
        dp: '/pninatornai'
      })
    },
    getPointCommon(el) {
      return {
        ec: 'pninatornaibridesmaid',
        el,
        dp: '/pninatornai'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pnina-tornai-intro-box {
  font-family: @font-family-500;
  font-style: normal;
  .cursor-pointer {
    cursor: pointer;
  }
  .center-content {
    box-sizing: border-box;
    max-width: 1293px;
    min-width: 1263px;
    clear: both;
    padding: 0;
    margin: 0 auto;
    margin-bottom: 100px;
    clear: both;
    .pnina-tornai-intro-btn {
      display: inline-block;
      padding: 0px 50px;
      line-height: 48px;
      font-size: 14px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-align: center;
    }
    .hollow-btn {
      border: 1px solid var(--color-121212);
      color: var(--color-121212);
      font-family: @font-family-600;
    }
    .solid-btn {
      padding: 0 100px;
      color: #ffffff;
      background: var(--color-121212);
      border: 1px solid var(--color-121212);
      font-family: @font-family-600;
    }
    .title {
      font-size: 42px;
      line-height: 57px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-121212);
      font-family: @font-family;
      font-weight: 300;
    }

    .banner-box {
      text-align: center;
      padding-top: 49px;
      .banner-img {
        width: 358px;
        height: auto;
      }
      .banner-text {
        font-weight: 400;
        font-size: 16px;
        line-height: 30px;
        color: var(--color-121212);
        width: 1000px;
        margin: 47px auto 79px;
      }
    }
    .second-banner-box {
      display: flex;
      .second-banner-img {
        width: 762px;
        height: auto;
      }
      .second-banner-right {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 80px;
        .content {
          width: 385px;
        }
        .second-banner-text {
          font-size: 14px;
          line-height: 27px;
          letter-spacing: 0.03em;
          color: var(--color-121212);
          margin: 30px 0;
        }
      }
    }
    .shop-all-box {
      margin-top: 100px;
      text-align: center;
      .img-list-box {
        margin: 30px 0 50px;
        display: flex;
        justify-content: space-between;
        .item {
          width: 411px;
        }
        .shop-all-img {
          width: 411px;
          height: auto;
          vertical-align: middle;
        }
        .desc {
          width: 100%;
          font-size: 14px;
          line-height: 27px;
          text-align: center;
          letter-spacing: 0.03em;
          color: var(--color-121212);
          margin-top: 10px;
        }
      }
    }
    .shop-now-girl {
      margin-top: 100px;
      display: flex;
      justify-content: center;
      &-img {
        width: 513px;
        height: 690px;
      }
      &-right {
        margin-left: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title-head {
          text-transform: none;
        }
        p {
          font-size: 14px;
          max-width: 490px;
          color: var(--color-121212);
          line-height: 22px;
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0.03em;
          &:first-of-type {
            margin: 30px 0px;
            max-width: 540px;
            font-size: 16px;
          }
          &.brand {
            font-family: @font-family-600;
            margin: 15px 0px 5px;
            line-height: 19px;
          }
          &.designer {
            line-height: 19px;
          }
        }
        .pnina-tornai-intro-btn {
          margin-top: 30px;
        }
      }
    }
    .shop-now-first-box {
      margin-top: 100px;
      display: flex;
      .shop-now-first-img {
        width: 650px;
        height: auto;
      }
      .shop-now-first-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 80px;
        .content {
          width: 455px;
        }
        .pnina-tornai-intro-btn {
          margin-top: 30px;
        }
      }
    }
    .shop-now-second-box {
      margin-top: 100px;
      display: flex;
      .left {
        flex: 1;
        margin-left: 80px;
        .img {
          width: 409px;
          height: auto;
          vertical-align: middle;
        }
        .desc {
          text-align: left;
          font-size: 14px;
          line-height: 19px;
          letter-spacing: 0.03em;
          color: var(--color-121212);
          margin-top: 15px;
        }
      }
      .right {
        width: 693px;
        text-align: center;
        .title {
          margin-top: 59px;
        }
        .img {
          width: 693px;
          height: auto;
          vertical-align: middle;
        }
        .pnina-tornai-intro-btn {
          margin: 30px 0 50px;
        }
      }
    }
    .bottom-banner-box {
      margin-top: 100px;
      position: relative;
      .img-box {
        .bottom-banner-img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .banner-title {
          position: absolute;
          width: 100%;
          left: 50%;
          transform: translate(-50%, -100%);
          font-family: @font-Ivy-Mode-400;
          font-size: 80px;
          line-height: 100px;
          text-align: center;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ffffff;
          padding-bottom: 57px;
        }
      }
      .btn-list-box {
        width: 100%;
        background: rgba(243, 245, 251, 0.9);
        display: flex;
        justify-content: space-between;
        padding: 13px 26px;
        box-sizing: border-box;
        .item {
          width: 397px;
          min-height: 145px;
          border: 5px solid rgba(255, 255, 255, 0.5);
          box-sizing: border-box;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .name {
            font-size: 42px;
            line-height: 57px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--color-121212);
            font-family: @font-family;
            font-weight: 300;
          }
          .text {
            font-size: 14px;
            line-height: 19px;
            color: var(--color-121212);
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
