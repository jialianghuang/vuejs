<template>
  <p class="privacy-policy-box">
    <span>{{ nl('page_create_account_tip_text') }}</span>
    <a :href="countryUrl(`/terms-of-use`)" target="_blank">
      <span>{{ nl('page_common_help_terms_of_use') }}</span> </a
    >&#44;
    <a :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))" target="_blank">
      <span>{{ nl('page_sitemap_privacy') }}</span>
    </a>
    <span class="text-and">{{ nl('page_common_and') }}</span>
    <a
      :href="countryUrl('https://privacy.azazie.com/privacy-policy#notice-of-financial-incentive')"
      target="_blank"
      class="truevault-polaris-privacy-notice"
    >
      <span>{{ nl('page_common_financial_incentive') }}.</span>
    </a>
  </p>
</template>

<script>
import { countryList } from '@/assets/js/euSizeMap'

export default {
  name: 'PrivacyPolicyTips',
  languageKeys: [
    'page_create_account_tip_text',
    'page_common_help_terms_of_use',
    'page_common_and',
    'page_sitemap_privacy',
    'page_common_financial_incentive',
    ...countryList.map((v, i) => 'page_common_provacy_policy_pdf_' + v)
  ]
}
</script>

<style lang="less" scoped>
.privacy-policy-box {
  margin-top: 15px;
  font-size: 12px;
  line-height: 16px;
  color: #999;
  text-align: center;
  a {
    color: #999;
    text-transform: uppercase;
    text-decoration: underline;
  }
}
</style>
