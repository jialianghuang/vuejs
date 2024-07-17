<template>
  <div class="az-footer-box">
    <div
      id="sms-code"
      v-if="
        ['cart', 'newBrandComingSoon', 'partner', 'kendallKylieComingSoon', 'welcome', 'cybermonday-landing-page'].indexOf(jsKey) < 0 &&
          country != 'CA' &&
          !isBridal
      "
      :class="{ hide: hideDom }"
      class="footer-sms"
    >
      <!-- <img :src="require('~/assets/images/sms_bg.png')" class="sms-bg" alt="sms" /> -->
      <div v-if="country === 'US'" class="sms-content">
        <p class="text1">
          <img :src="require('~/assets/images/sms_phone.png')" alt="sms" />
          {{ nl('page_footer_text1_one') }}
          <span>'{{ nl('page_footer_text1_two') }}'</span>
          {{ nl('page_footer_text1_three') }}
          <span class="number">{{ nl('page_footer_text1_four') }}</span>
          {{ nl('page_footer_text1_five') }}
        </p>
        <div class="text2">
          {{ nl('page_footer_text2_one') }}
          <a :href="countryUrl(`/terms-of-use`)" target="_blank">{{ nl('page_common_help_terms_of_use') }}</a
          >&#44;
          <a :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))" target="_blank">
            {{ nl('page_common_help_privacy_policy') }}
          </a>
          <span style="padding-left: 2px">{{ nl('page_common_and') }}</span>
          <a
            :href="countryUrl('https://privacy.azazie.com/privacy-policy#notice-of-financial-incentive')"
            target="_blank"
            class="truevault-polaris-privacy-notice"
          >
            {{ nl('page_common_financial_incentive') }}.
          </a>
        </div>
      </div>
    </div>

    <client-only>
      <az-interest-subscribe
        v-if="jsKey != 'atelier' && !hasCoupon"
        :title="nl('page_receive_special_offers_and_more')"
        @subscribe-submit="$emit('subscribe-submit')"
      ></az-interest-subscribe>
      <div v-if="isBridal" class="footer-underline"></div>
    </client-only>
    <az-footer-menu></az-footer-menu>
    <az-footer-copyright></az-footer-copyright>
  </div>
</template>

<script>
import { countryList } from '@/assets/js/euSizeMap'
import AzFooterMenu from './AzFooterMenu'
import AzFooterCopyright from './AzFooterCopyright'
import AzInterestSubscribe from './AzInterestSubscribe'

export default {
  name: 'AzFooter',
  languageKeys: [
    'page_footer_text1_one',
    'page_footer_text1_two',
    'page_footer_text1_three',
    'page_footer_text1_four',
    'page_footer_text1_five',
    'page_footer_text2_one',
    'page_footer_text2_terms',
    'page_footer_text2_privacy',
    'page_checkout_phone_subscribe_privacy',
    'page_common_and',
    'page_common_financial_incentive',
    'page_common_help_privacy_policy',
    ...countryList.map((v, i) => 'page_common_provacy_policy_pdf_' + v),
    ...AzInterestSubscribe.languageKeys,
    ...AzFooterMenu.languageKeys,
    ...AzFooterCopyright.languageKeys
  ],
  components: {
    AzFooterMenu,
    AzFooterCopyright,
    AzInterestSubscribe
  },
  props: {
    // 是否领取过新户coupon
    hasCoupon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hideDom({ catId, $route }) {
      // comments: jira:16185 wgd 列表页详情页影藏
      if (this.country == 'US') {
        return catId == 3 && ['list', 'product'].includes($route.name)
      }
      return this.isSpecialCatId(catId) && ['list', 'product'].includes($route.name)
    }
  }
}
</script>

<style lang="less" scoped>
.az-footer-box {
  margin-top: 100px;
  border-bottom: 1px solid var(--color-121212);
  .footer {
    box-sizing: border-box;
    width: 100%;
    background: #272727;
    color: #ccc;
    line-height: 35px;
    height: 35px;
    text-align: right;
    text-transform: uppercase;
    white-space: nowrap;
    .container {
      box-sizing: border-box;
      max-width: 1353px;
      width: 100%;
      margin: 0 auto;
      padding: 0 30px;
      overflow: hidden;
      .footer-logo {
        float: left;
        display: block;
        width: 137px;
        height: 29px;
        overflow: hidden;
        background: url(~assets/images/a_sprite_l_20190128.png?5761312) no-repeat -260px -233px;
        text-indent: 1000px;
      }
    }
  }
  .footer-sms {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto 30px;
    padding: 0 20px;
    max-width: 1640px;
    z-index: 1;
    img.sms-bg {
      display: block;
      width: 100%;
    }
    .sms-content {
      width: 100%;
      padding: 27px;
      width: 100%;
      border: 4px solid #f4dfd1;
      background: linear-gradient(#fff, #fffdf8);
      box-sizing: border-box;
      .text1 {
        margin: 0 auto 5px;
        width: 100%;
        max-width: 1290px;
        text-align: center;
        font-size: 16px;
        font-family: @font-family-600;
        color: #272727;
        line-height: 23px;
        span {
          color: var(--color-121212);
        }
        span.number {
          font-size: 18px;
        }
        img {
          display: inline-block;
          margin-right: 5px;
          width: 22px;
          vertical-align: middle;
        }
      }
      .text2 {
        margin: 0 auto;
        width: 100%;
        max-width: 1290px;
        text-align: center;
        font-size: 12px;
        font-family: @font-family-500;
        color: #666;
        line-height: 18px;
        a {
          color: #666;
          text-decoration: underline;
          &:hover,
          &:active {
            text-decoration: underline;
          }
        }
      }
    }
  }
  .footer-underline {
    background: var(--color-ffffff);
    width: 100%;
    height: 5px;
  }
}
</style>
