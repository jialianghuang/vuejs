const cookiesMap = {
  analytics: [
    '_gid',
    '_dc_gtm_UA-54385339-1',
    '_gat_UA-54385339-3',
    '_clck',
    '__attentive_id',
    '_attn_',
    '__attentive_cco',
    'tpc_id',
    '_clsk',
    '__attentive_ss_referrer',
    'SRM_B',
    'MR',
    '__attentive_dv',
    '__attentive_pv',
    'MR',
    'SM',
    'test-gdpr',
    '_ga',
    'ExtendedWGDLanded',
    'wgd_first_entry_tag',
    'criteo_cookie_header',
    'criteo_cookie_perm',
    'JJSREF',
    'first-in-time',
    '_ga_D8GXEMDR1J',
    'userAgent',
    '_gat_UA-54385339-1',
    // 'coupon-start',
    '5CC1BD247E2BFD3B72C61CD8CC091E01',
    '0608760AF2A0CEFB029C77EB1EF57E82',
    '_hjSession_1867389',
    '_hjAbsoluteSessionInProgress',
    '_hjIncludedInSessionSample_1867389',
    '_hjFirstSeen',
    '_hjSessionUser_1867389',
    '1P_JAR',
    'NID',
    'domain_accessed',
    'wgdCouponBoxOpened',
    'ZZSID',
    'BF59152FE42FBCCA45876067ED4DA6A4',
    '4D338C8D1BB6A90E2B4607ADC7D566CE'
  ],
  advertising: [
    'uid',
    '_tt_enable_cookie',
    '_ttp',
    'MUID',
    'tuuid',
    'c',
    'AWSALBCORS',
    'stx_user_id',
    'khaos',
    'audit',
    'ANONCHK',
    'tuuid_lu',
    'visitor-id',
    'data-c-ts',
    'data-c',
    'tt_viewer',
    'A3',
    'pid',
    'TestIfCookieP',
    'csync',
    'ayl_visitor',
    'bkdc',
    'bkpa',
    'bku',
    'tluid',
    'IDSYNC',
    'CMID',
    'CMPS',
    'CMPRO',
    'mv_tokens',
    'lidid',
    'um',
    'umeh',
    'demdex',
    'SCM',
    'KRTBCOOKIE_97',
    'PugT',
    'dpm',
    'SCM1001851',
    'ab',
    '_gcl_au',
    'IDE',
    'mv_tokens_invalidate-verizon-pushes',
    'am_tokens',
    'am_tokens_invalidate-verizon-pushes',
    'criteo',
    'visitor',
    'status',
    'tuuid',
    'tuuid_lu',
    'SOC',
    'MUID',
    '_pin_unauth',
    '_pinterest_ct_ua',
    '_fbp',
    'cto_bundle',
    'criteo_cookie_header',
    'criteo_cookie_perm'
  ],
  functionality: [
    'user_id',
    '__zlcmid',
    'ZZTID',
    'abtest',
    'CountryCode',
    'us_privacy',
    'Currency',
    'Language',
    'imgCdnAbtest',
    'shoppingCartGoodsTotal',
    '_shop_cart',
    'hasLogin',
    'AZSID',
    'AWSALBCORS',
    'polaris_consent_settings',
    'SOCS',
    'Secure-ENID',
    'CONSENT',
    'coupon-start'
  ],
  security: ['AEC']
}

const eurCountryCode = [
  'AT',
  'BE',
  'FR',
  'DE',
  'IE',
  'NL',
  'ES',
  'GB',
  'IT',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'GR',
  'HU',
  'LV',
  'LT',
  'LU',
  'MT',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'SE',
  'IS',
  'LI',
  'NO'
]

/**
 *
 * 为了获取第三方设置cookie内容
 * @param {*} vm 当前vue实例对象
 */
const getPolarisSettings = (vm) => {
  if (process.server) return
  const polarisConsentSettings = vm.$cookie.getCookie('polaris_consent_settings')
  return JSON.parse(polarisConsentSettings) || {}
}

/**
 *  删除黑名单cookie
 * @param {*} vm 当前vue实例对象
 * {"clientId":"127f552a-3cc8-46a7-cd9c-520a0f04197a",
 * "implicit":false,
 * "analyticsPermitted":true,
 * "personalizationPermitted":true,
 * "adsPermitted":false,
 * "essentialPermitted":true}
 */
const handleGDPR = (vm) => {
  if (process.server) return
  // 请求头中的countrycode 是根据ip定位国家的
  setTimeout(() => {
    const localCountry = vm.$store && vm.$store.state.logsId.reqHeaders.countrycode
    const polarisCookies = getPolarisSettings(vm)
    if (eurCountryCode.includes(localCountry)) {
      if (!polarisCookies.analyticsPermitted) {
        for (let i = 0; i < cookiesMap.analytics.length; i++) {
          vm.$cookie.setCookie(cookiesMap.analytics[i], '', -1, '.' + vm.APP_DOMAIN_LOWER, true)
        }
      }
      if (!polarisCookies.adsPermitted) {
        for (let i = 0; i < cookiesMap.advertising.length; i++) {
          vm.$cookie.setCookie(cookiesMap.advertising[i], '', -1, '.' + vm.APP_DOMAIN_LOWER, true)
        }
      }
    }
  }, 0)
}

/**
 *  拦截黑名单中的cookie，用户拒绝过禁止再次设置
 * @param {*} vm 当前vue实例
 * @param {*} name 需要拦截的cookie
 * @returns
 */
const cookieInterceptor = (vm, name) => {
  if (process.server) return
  // 请求头中的countrycode 是根据ip定位国家的
  const localCountry = vm.$store && vm.$store.state.logsId.reqHeaders.countrycode
  const polarisCookies = getPolarisSettings(vm)
  let flag = false
  if (eurCountryCode.includes(localCountry)) {
    if (!polarisCookies.analyticsPermitted && cookiesMap.analytics.includes(name)) {
      flag = true
    } else if (!polarisCookies.adsPermitted && cookiesMap.advertising.includes(name)) {
      flag = true
    }
  }
  return flag
}

export { cookiesMap, handleGDPR, cookieInterceptor, eurCountryCode }
