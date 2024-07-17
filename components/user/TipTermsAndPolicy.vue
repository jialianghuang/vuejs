<template>
  <div class="tip-terms-and-policy">
    {{ txt }}
    <a @click="hrefPoint('termsofuse')" :href="countryUrl(`/terms-of-use`)" class="az-link" target="_blank">{{
      nl('page_sitemap_terms')
    }}</a
    >&#44;
    <a
      @click="hrefPoint('privacypolicy')"
      :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))"
      class="az-link"
      target="_blank"
    >
      {{ nl('page_sitemap_privacy') }}
    </a>
    <span>{{ nl('page_common_and') }}</span>
    <a
      :href="countryUrl('https://privacy.azazie.com/privacy-policy#notice-of-financial-incentive')"
      class="az-link truevault-polaris-privacy-notice"
      target="_blank"
      >{{ nl('page_common_financial_incentive') }}.
    </a>
    <slot></slot>
  </div>
</template>

<script>
import { countryList } from '@/assets/js/euSizeMap'

export default {
  name: 'TipTermsAndPolicy',
  languageKeys: [
    'page_sitemap_terms',
    'page_common_and',
    'page_sitemap_privacy',
    'page_common_financial_incentive',
    ...countryList.map((v, i) => 'page_common_provacy_policy_pdf_' + v)
  ],
  props: {
    txt: {
      type: String,
      default: ''
    }
  },
  methods: {
    hrefPoint(el) {
      if (this.$route.name == 'user-login') {
        this.buryPoint(this, 'event', {
          ec: 'signin',
          el,
          ea: 'click'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tip-terms-and-policy {
  color: var(--color-666666);
  margin-top: 15px;
  a {
    color: var(--color-666666);
    text-decoration: underline;
    margin: 0;
    float: none;
    font-weight: normal;
    text-transform: uppercase;
  }
}
.checkout-box {
  .tip-terms-and-policy a {
    color: var(--color-666666) !important;
    &:hover {
      color: var(--color-666666) !important;
    }
  }
}
</style>
