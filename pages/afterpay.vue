<template>
  <div class="afterpay">
    <main-app :navigation="navigation">
      <div class="main">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo" class="bread_crumb"></bread-crumb>
        <div class="first_block">
          <div class="title_icon">
            <az-icon icon-class="icon-icon_afterpay_tran" class="icon"></az-icon>
          </div>
          <div class="title">{{ nl('page_afterpay_first_title') }}</div>
          <div class="slogan">{{ nl('page_afterpay_first_slogan') }}</div>
        </div>
        <div class="second_block_title">
          {{ nl('page_afterpay_second_block_title') }}
        </div>
        <div class="detail_block">
          <div v-for="(infoItem, index) in detailInfo" :key="index" class="detail_div">
            <div class="num">{{ index + 1 }}</div>
            <img :src="replaceImgCdnUrl(infoItem.img)" :alt="infoItem.title" />
            <div class="title">{{ infoItem.title }}</div>
            <div class="slogan">{{ infoItem.slogan }}</div>
          </div>
        </div>
        <p class="description">
          {{ nl('page_afterpay_description_one') }}
          <a class="here" href="https://www.afterpay.com/installment-agreement">{{ nl('page_common_here') }}</a>
          {{ nl('page_afterpay_description_two') }}
        </p>
        <p class="description">
          {{ nl('page_afterpay_description_three') }}
          <a href="https://www.afterpay.com/terms-of-service">{{ nl('page_afterpay_description_three_one') }}</a> |
          <a href="https://www.afterpay.com/installment-agreement">{{ nl('page_afterpay_description_three_two') }}</a> |
          <a href="https://help.afterpay.com/hc/en-us/articles/360031623571-How-Do-Refunds-and-Returns-Work-at-Afterpay-">{{
            nl('page_afterpay_description_three_three')
          }}</a>
        </p>
        <div class="faq">
          <div class="second_title">
            <span class="title_txt">{{ nl(faq.title) }}</span>
          </div>
          <div class="children">
            <div :id="'FAQ_' + (index + 1)" v-for="(item, index) in faq.questionList" :key="index" class="qa_box">
              <div class="q">
                <span class="qq">{{ nl('page_letter_q') }}: </span>
                <span class="qdesc">{{ nl(item.questionDesc) }}</span>
              </div>
              <div class="a">
                <div v-for="(ans, ansIndex) in item.askDesc" :key="ansIndex" class="a__item">
                  <span v-if="ansIndex === 0" class="aa">{{ nl('page_letter_a') }}: </span>
                  <span v-html="nl(ans)" class="adesc"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="last_desc">
            <div v-html="faq.endDesc"></div>
          </div>
        </div>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import backToTop from '@/components/common/BackToTop'
import MainApp from '@/components/Main'
import { getHeadJson } from '@/plugins/head'
import BreadCrumb from '@/components/common/Breadcrumb'
import { init } from '@/plugins/commonAsyncData'

export default {
  name: 'Afterpay',
  components: {
    MainApp,
    BreadCrumb,
    backToTop
  },
  data() {
    return {
      breadCrumbInfo: {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        afterpay: {
          title: this.nl('page_common_afterpay')
        }
      },
      detailInfo: [
        {
          title: this.nl('page_menu_shop_title'),
          img: require('~/assets/images/afterpay/icon_cart.png'),
          slogan: this.nl('page_afterpay_detail_one')
        },
        {
          title: this.nl('page_checkout_keywords'),
          img: require('~/assets/images/afterpay/icon_checkout.png'),
          slogan: this.nl('page_afterpay_detail_two')
        },
        {
          title: this.nl('page_login_submit'),
          img: require('~/assets/images/afterpay/icon_login.png'),
          slogan: this.nl('page_afterpay_detail_three')
        },
        {
          title: this.nl('page_common_pay'),
          img: require('~/assets/images/afterpay/icon_pay.png'),
          slogan: this.nl('page_afterpay_detail_four')
        }
      ]
    }
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData || context.store.state.country != 'US') {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }

      const res = await context.$axios.$get(`/1.0/navigation/wedding-dresses-101`)
      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      context.store.commit('setJsKey', 'afterpay')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        prodList: res.data.prodList || []
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
    this.faq = {
      title: 'page_common_customer_support',
      endDesc: `${this.nl('page_after_pay_endDesc_text1')} <a href="https://help.afterpay.com/hc/en-au/requests/new">${this.nl(
        'page_after_pay_here'
      )}</a>.`,
      questionList: [
        {
          questionDesc: 'page_after_pay_question_desc1',
          askDesc: ['page_after_pay_ask_desc_1_text1']
        },
        {
          questionDesc: 'page_after_pay_question_desc2',
          askDesc: ['page_after_pay_ask_desc_2_text1', 'page_after_pay_ask_desc_2_text2']
        },
        {
          questionDesc: 'page_after_pay_question_desc3',
          askDesc: [this.nl('page_after_pay_ask_desc_3_text1') + ' <a href="https://www.azazie.com/">azazie.com</a>.']
        },
        {
          questionDesc: 'page_after_pay_question_desc4',
          askDesc: ['page_after_pay_ask_desc_4_text1']
        },
        {
          questionDesc: 'page_after_pay_question_desc5',
          askDesc: ['page_after_pay_ask_desc_5_text1', 'page_after_pay_ask_desc_5_text2']
        },
        {
          questionDesc: 'page_after_pay_question_desc6',
          askDesc: [
            `${this.nl('page_after_pay_ask_desc_6_text1')} <a href="https://help.afterpay.com/hc/en-us/sections/203376123-Payments">
            ${this.nl('page_after_pay_ask_desc_6_text2')}</a>`
          ]
        },
        {
          questionDesc: 'page_after_pay_question_desc7',
          askDesc: [
            'page_after_pay_ask_desc_7_text1',
            this.nl('page_after_pay_ask_desc_7_text2') +
              ' <a href="' +
              this.getSupportUrl(`/articles/360001805031-General-Shipping-Information`, `/articles/8076714`) +
              '">' +
              this.nl('page_after_pay_here') +
              '</a>.'
          ]
        },
        {
          questionDesc: 'page_after_pay_question_desc8',
          askDesc: ['page_after_pay_ask_desc_8_text1']
        },
        {
          questionDesc: 'page_after_pay_question_desc9',
          askDesc: ['page_after_pay_ask_desc_9_text1']
        },
        {
          questionDesc: 'page_after_pay_question_desc10',
          askDesc: ['page_after_pay_ask_desc_10_text1', 'page_after_pay_ask_desc_10_text2']
        },
        {
          questionDesc: 'page_after_pay_question_desc11',
          askDesc: [
            this.nl('page_after_pay_ask_desc_11_text1') +
              '<a href="https://www.afterpay.com/purchase-payment-agreement">' +
              this.nl('page_after_pay_here') +
              '</a> ' +
              this.nl('page_after_pay_ask_desc_11_text1_2')
          ]
        },
        {
          questionDesc: 'page_after_pay_question_desc12',
          askDesc: ['page_after_pay_ask_desc_12_text1']
        },
        {
          questionDesc: '',
          askDesc: [
            this.nl('page_after_pay_ask_desc_13_text1') +
              ' <a href="http://www.afterpay.com">www.afterpay.com</a> ' +
              this.nl('page_after_pay_ask_desc_13_text1_2') +
              ' <a href="https://help.afterpay.com/hc/en-us/">' +
              this.nl('page_common_faqs_title') +
              '</a>, <a href="https://www.afterpay.com/terms-of-service">' +
              this.nl('page_footer_text2_terms') +
              '</a>, <a href="https://www.afterpay.com/purchase-payment-agreement">' +
              this.nl('page_afterpay_description_three_two') +
              '</a> ' +
              this.nl('page_after_pay_ask_desc_13_text1_3') +
              ' <a href="https://www.afterpay.com/privacy-policy">https://www.afterpay.com/privacy-policy</a>'
          ]
        }
      ]
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.bread_crumb {
  text-transform: capitalize;
}
.afterpay {
  .main {
    box-sizing: border-box;
    max-width: 1293px;
    width: 100%;
    padding-bottom: 100px;
    margin: 0 auto;
    padding-top: 0;
  }
  /deep/ #bread_crumb {
    padding: 20px 0;
    li {
      height: 18px;
      a,
      span {
        height: 18px;
        line-height: 18px;
        &::after {
          top: -2px;
          height: 18px;
        }
      }
    }
  }
  .first_block {
    width: 100%;
    height: 153px;
    background-color: #b2fce4;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    box-sizing: border-box;
    .title_icon {
      svg {
        width: 154px;
        height: 30px;
        font-size: 30px;
      }
    }
    .title {
      color: var(--color-121212);
      font-size: 16px;
      font-family: @font-family-600;
      margin-top: 17px;
    }
    .slogan {
      font-size: 13px;
      font-family: @font-family-500;
      margin-top: 6px;
    }
  }
  .second_block_title {
    margin-top: 60px;
    margin-bottom: 30px;
    text-align: center;
    font-size: 24px;
    font-family: @font-family-600;
    color: var(--color-121212);
  }
  .detail_block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    .detail_div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 308px;
      height: 261px;
      background-color: #b2fce4;
      padding: 40px 25px 0;
      box-sizing: border-box;
      position: relative;
      .num {
        position: absolute;
        left: 10px;
        top: 10px;
        font-size: 24px;
        color: var(--color-121212);
        font-family: @font-family-600;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #fff;
        line-height: 30px;
        text-align: center;
      }
      img {
        width: 84px;
        height: 84px;
      }
      .title {
        font-size: 18px;
        font-family: @font-family-600;
        margin-top: 10px;
        margin-bottom: 5px;
        text-transform: uppercase;
      }
      .slogan {
        font-size: 13px;
        font-family: @font-family-500;
        text-align: center;
      }
    }
  }
  .description {
    text-align: center;
    font-family: @font-family-500;
    color: var(--color-121212);
    font-size: 13px;
    margin-bottom: 15px;
    .here {
      text-transform: lowercase;
    }
    a {
      text-transform: capitalize;
      color: var(--color-121212);
      text-decoration: underline;
    }
  }
}

.faq {
  padding-top: 10px;
  .second_title {
    margin: 60px 0 45px 0;
    font-family: @font-family-600;
    text-align: center;
    color: var(--color-121212);
    font-size: 24px;
    line-height: 1px;
    // text-transform: uppercase;
    border-top: 1px solid #e5e1e1;
    .title_txt {
      padding: 0 35px;
      background: #ffffff;
    }
  }
  .last_desc {
    color: var(--color-121212);
    margin-top: 15px;
    /deep/ a {
      text-decoration: underline;
      color: var(--color-121212);
    }
  }
  .qa_box {
    text-align: left;
    border-bottom: 1px solid #eee;
    .q {
      font-size: 16px;
      margin-top: 30px;
      font-family: @font-family-600;
      .qq {
        text-transform: uppercase;
      }
    }
    .a {
      margin: 15px 0;
      color: var(--color-999999);
      font-size: 13px;
      .aa {
        text-transform: uppercase;
      }
      .a__item {
        &:nth-child(n + 2) {
          margin-top: 15px;
        }
      }
      /deep/ a {
        color: var(--color-999999);
        text-decoration: underline;
      }
    }
  }
}
</style>
