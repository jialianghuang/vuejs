import { getGoogleSeo, getGooglevideo } from '@/assets/js/googleSeo'
import { eurCountryCode } from '@/assets/js/webCookiesMap'
import { getQueryString, addGTM, replaceQueryString, strToUpper, getMainDomain, removeAllUrlParamter } from '../assets/js/utils'
const seoLanguages = require('../modules/supportSeoLanguage')
const { languageCodeList } = require('../modules/hreflang')

function facebookVerification(context) {
  let text = ''
  switch (context.country) {
    case 'CA':
      text = 'b80gp5vwps9v904pmca5mbrfyn3d7c'
      break
    case 'US':
      text = 'yvgqowwzor0t13gkah6dn8nqxev0yo'
      break
  }
  return text
}
/**
 * 根据dresstype或路由名，过滤掉不支持的url路径
 * 部分路径在部分国家下是404，所以对应的国家下不需要添加对应语言seo link
 * @param {*} context
 * @param {*} langKey languageCodeList中的数据
 */
function checkValidRoute(context, langKey = 'en') {
  // TODO: 这里先对es尽心单独判断，因为后续要上的西班牙也是es，但是languageCodeList中暂未细分es-mx、es-es，细分后下面判断直接去掉即可
  if (langKey === 'es') {
    langKey = 'mx'
  }
  langKey = langKey.toUpperCase()
  const dressType = context.dressType
  if (dressType === 'sample') {
    return !['FR', 'DE', 'MX'].some((ele) => {
      return langKey.includes(ele)
    })
  } else if (dressType === 'outlet') {
    return !['FR', 'DE', 'MX', 'GB', 'AU'].some((ele) => {
      return langKey.includes(ele)
    })
  } else if (dressType === 'clearance') {
    return !['FR', 'DE', 'MX', 'GB', 'AU'].some((ele) => {
      return langKey.includes(ele)
    })
  } else if (context.requestUrl.includes('/sample-dresses/how-it-works')) {
    return !['FR', 'DE', 'MX'].some((ele) => {
      return langKey.includes(ele)
    })
  }
  return true
}

const getHeadJson = function(context) {
  const version = '1710989550677' // svg文件版本号 new Date().getTime() 发生更改的时间 注意：svg文件更改需要更改文件版本号
  let headJson
  const routeName = (context && context.$route && context.$route.name) || ''
  const store = context.$store || context.store
  // comments: 不要轻易修改，个别地方单独定义变量处理
  const host = getMainDomain(context.country)
  const query = getQueryString(context.requestUrl)
  const glVar = typeof window === 'object' ? window : global
  const jsKey = store.state.jsKey

  // 字体类名
  let fontClass = 'az-in-web'
  if (glVar.is_app) {
    fontClass = 'az-in-app'
  }

  // showroom facebook share
  if (routeName == 'user-login' && query.back && decodeURIComponent(query.back).includes('/showroom/')) {
    context.seoInfo.ogTitle = "You're being invited to join an Azazie showroom"
    context.seoInfo.ogDescription = 'Log in or create an Azazie account to join.'
  }

  // 是否测试环境
  const isDev = context.environment !== 'prod'
  const bridalThemeClass = 'bridal-theme-b'
  const metaNoIndex = {
    name: 'robots',
    content: 'noindex'
  }
  if (context.seoInfo) {
    let tempCanonicalUrl = context.seoInfo.canonicalUrl || context.requestUrl || '/'
    headJson = {
      htmlAttrs: {
        lang: store.state.language // 设置html标签的lang属性
      },
      title: context.seoInfo.title || 'Azazie',
      bodyAttrs: {
        class: [`az-${routeName}`, store.state.isBridal ? bridalThemeClass : 'azazie-theme', fontClass]
      },
      meta: [
        { hid: 'og:title', property: 'og:title', content: context.seoInfo.ogTitle || context.seoInfo.title || 'Azazie' },
        {
          hid: 'og:description',
          property: 'og:description',
          content: context.seoInfo.ogDescription || context.seoInfo.description || 'Bridesmaid Dresses & Wedding Dresses'
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: context.seoInfo.ogImage || 'https://cdn-1.azazie.com/upimg/userfiles/images/f7/47/cdaf33e28a5e4a7305bf3c261153f747.jpg'
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: context.seoInfo.ogImage || 'https://cdn-1.azazie.com/upimg/userfiles/images/f7/47/cdaf33e28a5e4a7305bf3c261153f747.jpg'
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: removeAllUrlParamter(`${host}${context.seoInfo.ogUrl ? context.seoInfo.ogUrl : context.requestUrl}`)
        },
        { hid: 'og:site_name', property: 'og:site_name', content: context.seoInfo.ogSiteName || 'Azazie' },
        { hid: 'fb:app_id', property: 'fb:app_id', content: context.seoInfo.ogAppId || store.state.new_facebook_app_code },
        {
          name: 'facebook-domain-verification',
          content: facebookVerification(context)
        }
      ],
      link: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizersByTagID: {}
    }
    // headJson.link.push({
    //   rel: 'preload',
    //   as: 'image',
    //   imagesizes: '(max-width: 1920px) 100vw, 1920px',
    //   imagesrcset: handlePreloadImg(store)
    // })
    // seoInfo.seoHead仅在列表页会有数据，限制只有列表页使用seoInfo.seoHead数据，其他情况仍然是原有逻辑
    const seoHead = context.seoInfo.seoHead
    if (seoHead && seoHead.length > 0) {
      for (let i = 0; i < seoHead.length; i++) {
        const ele = seoHead[i]
        let resHref = ele.href
        try {
          resHref = decodeURIComponent(resHref)
        } catch (error) {
          console.log(error)
        }
        // if (ele.hreflang !== 'x-default' && !ele.hreflang.includes('en')) {
        //   resHref = '/' + ele.hreflang + resHref
        // }
        headJson.link.push({
          hid: ele.dataHid,
          rel: 'alternate',
          hreflang: ele.hreflang,
          href: `${ele.hreflang == 'x-default' ? 'https://www.azazie.com' : getMainDomain(ele.countryCode)}${resHref}`
        })
      }
    } else {
      // 根据语言列表，在head中添加不同国家不同语言对应的link
      for (let x = 0; x < languageCodeList.length; x++) {
        const langCode = languageCodeList[x]
        const res = checkValidRoute(context, langCode)
        if (!res) continue
        const tempLang = langCode.split('-')
        let tempRequestUrl = context.page_url || context.requestUrl // 优先取page_url，当前页面路径，没有值的情况下取requestUrl
        // 判断路径中是否存在country和currency参数，如果存在根据对应
        if (query.country && query.currency) {
          for (let i = 0; i < store.state.siteOptions.length; i++) {
            const ele = store.state.siteOptions[i]
            // 如果-后面有国家，以国家匹配优先
            if (tempLang[1] && tempLang[1] === ele.countryCode.toLowerCase()) {
              tempRequestUrl = replaceQueryString(tempRequestUrl, 'country', ele.countryCode)
              tempRequestUrl = replaceQueryString(tempRequestUrl, 'currency', ele.currency)
              break
            } else if (!tempLang[1] && tempLang[0] === ele.language) {
              // 如果没有-后面的国家，判断语言，获取对应国家
              tempRequestUrl = replaceQueryString(tempRequestUrl, 'country', ele.countryCode)
              tempRequestUrl = replaceQueryString(tempRequestUrl, 'currency', ele.currency)
              break
            }
          }
        }
        const chartA = strToUpper(tempLang[0])
        let tempHid = 'lang' + chartA
        if (tempLang[1]) {
          const chartB = strToUpper(tempLang[1])
          tempHid += chartB
        }
        let tempHref = ''
        if (context.page_url) {
          // 判断是否是ca，修改域名
          if (langCode.indexOf('-ca') > 0) {
            // 修改域名后缀
            tempRequestUrl = tempRequestUrl.replace('.com', '.ca')
          } else {
            tempRequestUrl = tempRequestUrl.replace('.ca', '.com')
          }
          // 路径中会存在语言标识，比如/fr/,/es/等，如果是非en，替换成对应国家语言，如果替换成en，不需要展示en
          const reg = new RegExp(`/${store.state.language}/`, 'g')
          let replaceStr = `/${tempLang[0]}/`
          if (tempLang[0] === 'en') {
            replaceStr = '/'
          } else {
            let hasUrlLangChar = false
            // 先判断路径中是否存在非en语言
            for (let i = 0; i < seoLanguages.length; i++) {
              const ele = seoLanguages[i]
              if (tempRequestUrl.includes('/' + ele)) {
                hasUrlLangChar = true
              }
            }
            // 如果非en路径中没有对应的语言，添加上对应的语言
            if (!hasUrlLangChar) {
              tempRequestUrl = tempRequestUrl.replace('.com/', '.com/' + tempLang[0] + '/')
            }
          }
          // 如果url中包含多语言，但是是在路径末尾，比如：.com/de这种，需要替换对应多语言
          let isSimpleLangUrl = false
          for (let i = 0; i < languageCodeList.length; i++) {
            const ele = languageCodeList[i].split('-')[0]
            const charIndex = tempRequestUrl.indexOf(`/${ele}`)
            if (charIndex === tempRequestUrl.length - 3) {
              isSimpleLangUrl = true
            }
          }
          // page_url是当前页面全路径，不需要做拼接
          if (isSimpleLangUrl) {
            // 不排除url中可能会存在多个类似包含/de的字符串，所以仅在isSimpleLangUrl条件下，使用下面的处理
            const reg2 = new RegExp(`/${store.state.language}`, 'g')
            const replaceStr2 = tempLang[0] === 'en' ? '/' : `/${tempLang[0]}`
            tempHref = tempRequestUrl.replace(reg2, replaceStr2)
          } else {
            tempHref = tempRequestUrl.replace(reg, replaceStr)
          }
        } else {
          const tempHost = getMainDomain(tempLang[1])
          tempHref = tempLang[0] === 'en' ? `${tempHost}${tempRequestUrl}` : `${tempHost}/${tempLang[0]}${tempRequestUrl}`
        }
        // 如果路径最后有一个/，去掉
        if (tempHref.charAt(tempHref.length - 1) === '/') {
          tempHref = tempHref.substring(0, tempHref.length - 1)
        }

        let headUrl = tempHref
        try {
          headUrl = decodeURIComponent(headUrl)
        } catch (error) {
          console.log(error)
        }
        headJson.link.push({
          hid: tempHid,
          rel: 'alternate',
          hreflang: langCode,
          href: headUrl
        })
      }

      // 添加默认x-default,放在首位，href同en
      headJson.link.unshift({
        hid: 'langDefault',
        rel: 'alternate',
        hreflang: 'x-default',
        href: headJson.link[0].href && headJson.link[0].href.replace('www.azazie.ca', 'www.azazie.com')
      })
    }

    if (context.seoInfo.description) {
      headJson.meta.push({ hid: 'description', name: 'description', content: context.seoInfo.description })
    }
    if (context.seoInfo.keywords) {
      headJson.meta.push({ hid: 'keywords', name: 'keywords', content: context.seoInfo.keywords })
    }

    // 首页meta多一些
    if (routeName == 'index') {
      headJson.meta = [
        ...headJson.meta,
        ...[
          { hid: 'og:type', property: 'og:type', content: context.seoInfo.ogType || '' },
          { hid: 'fb:admins', property: 'fb:admins', content: context.seoInfo.fbAdmins || '' }
        ]
      ]
    }
    if (routeName == 'product') {
      headJson.meta = [
        ...headJson.meta,
        ...[
          { hid: 'og:ttl', property: 'og:ttl', content: context.seoInfo.ogTtl },
          { hid: 'og:type', property: 'og:type', content: context.seoInfo.ogPageType },
          { hid: 'product:price:amount', property: 'product:price:amount', content: context.seoInfo.ogPriceAmount },
          { hid: 'product:price:currencyt', property: 'product:price:currencyt', content: context.seoInfo.ogCurrency },
          { hid: 'og:availability', property: 'og:availability', content: 'instock' },
          { hid: 'og:rating_scale', property: 'og:rating_scale', content: 5 }
        ]
      ]
      // 做个判空处理，因为这里有时候接口返回的reviewInfo为undefined
      if (store.state.product.baseInfo && store.state.product.baseInfo.reviewInfo) {
        const reviewInfoMeta = [
          { hid: 'og:rating', property: 'og:rating', content: store.state.product.baseInfo.reviewInfo.rating },
          { hid: 'og:rating_count', property: 'og:rating_count', content: store.state.product.baseInfo.reviewInfo.totalCount }
        ]
        headJson.meta = headJson.meta.concat(reviewInfoMeta)
      }
    }
    if (routeName == 'user-login' || routeName == 'user-index') {
      headJson.meta = [
        ...headJson.meta,
        ...[
          { hid: 'og:type', property: 'og:type', content: context.seoInfo.ogType || 'website' },
          { hid: 'og:url', property: 'og:url', content: removeAllUrlParamter(host + context.seoInfo.ogUrl) },
          { hid: 'fb:app_id', property: 'fb:app_id', content: context.seoInfo.fbAppId },
          { hid: 'fb:admins', property: 'fb:admins', content: context.seoInfo.fbAdmins },
          { hid: 'og:site_name', property: 'og:site_name', content: context.seoInfo.ogSiteName }
        ]
      ]
      if (routeName == 'user-login') {
        tempCanonicalUrl = `${host}/user/login`
      }
    }
    // checkout 包含支付
    if (routeName == 'checkout' || routeName == 'rights-checkout') {
      headJson.script.push({ src: 'https://js.braintreegateway.com/web/3.56.0/js/client.min.js', body: true })
      headJson.script.push({ src: 'https://js.braintreegateway.com/web/3.56.0/js/paypal.min.js', body: true })
      headJson.script.push({ src: 'https://js.braintreegateway.com/web/3.56.0/js/apple-pay.min.js', body: true })
      headJson.script.push({ src: 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js', body: true, async: true, crossorigin: true })

      headJson.script.push({ src: 'https://x.klarnacdn.net/kp/lib/v1/api.js', body: true })
      // afterpay 测试环境用沙盒
      if (context.environment.includes('dev') || context.environment == 'test') {
        headJson.script.push({ src: 'https://portal.sandbox.afterpay.com/afterpay.js', body: true })
      } else {
        headJson.script.push({ src: 'https://portal.afterpay.com/afterpay.js', body: true })
      }
      headJson.script.push({ src: 'https://pay.google.com/gp/p/js/pay.js', body: true })
    }

    // ?谷歌广告
    if (tempCanonicalUrl) {
      tempCanonicalUrl = tempCanonicalUrl.replace('m.azazie.com', 'www.azazie.com')
      tempCanonicalUrl = tempCanonicalUrl.replace('p.azazie.com', 'www.azazie.com')
      let tempUrl = ''
      if (tempCanonicalUrl.startsWith(host)) {
        tempUrl = tempCanonicalUrl.split(host)[1]
      } else if (tempCanonicalUrl.startsWith('/')) {
        tempUrl = tempCanonicalUrl
      } else {
        tempUrl = '/' + tempCanonicalUrl
      }

      if (tempUrl || tempUrl == '') {
        const isSeoLangUrl = seoLanguages.some(
          (item) => tempUrl == `/${item}` || tempUrl.startsWith(`/${item}?`) || tempUrl.startsWith(`/${item}/`)
        )
        if (!isSeoLangUrl) {
          // 拼接
          tempCanonicalUrl = store.state.currentCountryUrl + tempUrl
        }
      }

      const tempHref = tempCanonicalUrl.includes(host) ? tempCanonicalUrl : host + tempCanonicalUrl
      headJson.link.push({
        hid: 'canonical',
        rel: 'canonical',
        href: tempHref // 后端返回的canonicalUrl会对路径参数进行处理，最多保留country，currency两个参数，所以前段不能全部过滤参数
      })
    }
  } else {
    headJson = {
      htmlAttrs: {
        lang: store.state.language // 设置html标签的lang属性
      },
      title: 'Azazie',
      bodyAttrs: {
        class: [`az-${routeName}`, store.state.isBridal ? bridalThemeClass : 'azazie-theme', fontClass]
      },
      meta: [
        {
          name: 'facebook-domain-verification',
          content: facebookVerification(context)
        }
      ],
      link: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizersByTagID: {}
    }

    // checkout包含支付
    if (routeName == 'checkout' || routeName == 'rights-checkout') {
      headJson.script.push({ src: 'https://js.braintreegateway.com/web/3.56.0/js/client.min.js', body: true })
      headJson.script.push({ src: 'https://js.braintreegateway.com/web/3.56.0/js/paypal.min.js', body: true })
      headJson.script.push({ src: 'https://js.braintreegateway.com/web/3.56.0/js/apple-pay.min.js', body: true })
      // afterpay 测试环境用沙盒
      if (context.environment.includes('dev') || context.environment == 'test') {
        headJson.script.push({ src: 'https://portal.sandbox.afterpay.com/afterpay.js', body: true })
      } else {
        headJson.script.push({ src: 'https://portal.afterpay.com/afterpay.js', body: true })
      }
    }
    // search 没有seoinfo
    if (routeName == 'search') {
      headJson.meta.push({
        hid: 'og:description',
        property: 'og:description',
        content: 'Discover the latest trends, styles, and colors by shopping for your perfect look at Azazie'
      })
      headJson.link.push({ hid: 'canonical', rel: 'canonical', href: 'https://www.azazie.com/search' })
    } else {
    }
  }

  if (!store.state.is_chrome_lighthouse) {
    const { countrycode = 'US' } = store.state.logsId.reqHeaders
    const flag = store.environment != 'prod'
    if ((countrycode == 'US' && !context.isLogin) || flag) {
      // retention()
      const retentionText = `!function(){var geq=window.geq=window.geq||[];if(geq.initialize) return;if (geq.invoked){if (window.console && console.error) {console.error("GE snippet included twice.");}return;}geq.invoked = true;geq.methods = ["page", "suppress", "trackOrder", "identify", "addToCart", "callBack", "event"];geq.factory = function(method){return function(){var args = Array.prototype.slice.call(arguments);args.unshift(method);geq.push(args);return geq;};};for (var i = 0; i < geq.methods.length; i++) {var key = geq.methods[i];geq[key] = geq.factory(key);} geq.load = function(key){var script = document.createElement("script");script.type = "text/javascript";script.async = true; if (location.href.includes("vge=true")) {script.src = "https://s3-us-west-2.amazonaws.com/jsstore/a/" + key + "/ge.js?v=" + Math.random();} else {script.src = "https://s3-us-west-2.amazonaws.com/jsstore/a/" + key + "/ge.js";} var first = document.getElementsByTagName("script")[0];first.parentNode.insertBefore(script, first);};geq.SNIPPET_VERSION = "1.6.1";
      geq.load("4X0HN2Q");}();`
      headJson.script.push({ innerHTML: retentionText, hid: 'retentionText', 'data-polaris-consent': 'statistics,marketing' })
      headJson.__dangerouslyDisableSanitizersByTagID.retentionText = ['innerHTML']
    }
    // cookie使用提示，接入Polaris
    if (eurCountryCode.includes(countrycode)) {
      headJson.script.push({
        src: 'https://polaris.truevaultcdn.com/static/polaris.js',
        'data-polaris-consent': 'statistics,marketing',
        body: true,
        async: true
      })
    }

    // GTAG google analytics 谷歌分析代码合并，之前冗了,同时运营说GB那个id不用了下掉，现在统一id--AW-966649179
    const grantedText = ['US', 'AU', 'CA'].includes(countrycode) ? 'granted' : 'denied'
    const gdprcontentgtm = `
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ip_country_code: '${countrycode}' })
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
    'ad_storage': '${grantedText}',
    'analytics_storage': '${grantedText}'
    });
    `
    headJson.script.push({ innerHTML: gdprcontentgtm, hid: 'gdprcontentgtm' })
    headJson.__dangerouslyDisableSanitizersByTagID.gdprcontentgtm = ['innerHTML']
    // headJson.script.push({
    //   src: `https://www.googletagmanager.com/gtag/js?id=AW-966649179`,
    //   async: true,
    //   'data-polaris-consent': 'statistics,marketing'
    // })
    // const conversionHtml = `
    //   window.dataLayer = window.dataLayer || [];
    //   function gtag(){dataLayer.push(arguments);}
    //   gtag('js', new Date ());
    //   gtag('config', 'AW-966649179');
    // `
    // headJson.script.push({ innerHTML: conversionHtml, hid: 'conversionHtml' })
    // headJson.__dangerouslyDisableSanitizersByTagID.conversionHtml = ['innerHTML']

    // US 站 upfluence 分析
    if (context.country == 'US') {
      headJson.script.push({
        src: 'https://tracking.upfluence.co/js/v1/init-33397bcb-4da1-4057-ba6b-dbe823dc57c7.js',
        async: true,
        body: true
      })
    }
    if (isDev) {
      headJson.meta ? headJson.meta.unshift(metaNoIndex) : (headJson.meta = [metaNoIndex])
    }

    if (routeName === 'styleGallery') {
      // <meta name="pinterest-rich-pin" content="false" />
      headJson.meta.push({ name: 'pinterest-rich-pin', content: 'false' })
    }
    let mHeadUrl = '/'
    try {
      mHeadUrl = decodeURIComponent(context.requestUrl)
    } catch (error) {
      console.log(error)
    }

    headJson.link.push({
      hid: 'alternate',
      rel: 'alternate',
      media: 'only screen and (max-width: 640px)',
      href: removeAllUrlParamter('https://www.azazie.com' + mHeadUrl)
    })

    if (routeName === 'help-scholarship' || routeName === 'look-book') {
      // 禁止搜索引擎收录这个页面
      headJson.meta.push({ name: 'robots', content: 'noindex, nofollow' })
    }
    // bing 和 打点
    const tagmanager = `
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(${JSON.stringify(context.dataLayerInfo)})
    `
    headJson.script.push({ innerHTML: tagmanager, hid: 'tagmanager' })
    headJson.__dangerouslyDisableSanitizersByTagID.tagmanager = ['innerHTML']
    if (context.environment == 'pre' || context.environment == 'prod') {
      addGTM(headJson, store.state.country)
    }
    if (!context.dataLayerInfo) {
      // 做零时sesson 测验
      if (routeName === 'checkout' || routeName === 'checkoutSuccess') {
        context.$throw({ stack: context.dataLayerInfo }, context, 'head+dataLayerInfo', 421)
      }
    }

    // google 授权登陆
    headJson.script.push({
      src: 'https://apis.google.com/js/platform.js',
      body: true,
      async: true,
      defer: true,
      'data-polaris-consent': 'statistics,marketing'
    })

    // apple 授权登录
    headJson.script.push({
      src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
      type: 'text/javascript',
      body: true,
      async: true,
      'data-polaris-consent': 'statistics,marketing'
    })
  }

  // svg 放到static目录
  if (!['index', 'list', 'product'].includes(jsKey)) {
    headJson.script.push({ src: `/themes/azazie/svg/svg_pc_account.js?${version}`, body: true })
  }
  if (!(store.state.is_chrome_lighthouse && ['index', 'list', 'product', 'storefront_share'].includes(jsKey))) {
    // headJson.script.push({ src: `/themes/azazie/svg/svg_pc_product.js?${version}`, body: true })
    headJson.script.push({ src: `/themes/azazie/svg/svg_pc_product_bridalB.js?${version}`, body: true })
    headJson.script.push({ src: `/themes/azazie/svg/svg_app_pc.js?${version}`, body: true })
  }

  // 根据语言引入对应的striker标签iconfont资源
  if (store.state.language == 'es') {
    headJson.script.push({ src: `/themes/azazie/svg/iconfont-new-es.js?${version}`, body: true })
  } else if (store.state.language == 'fr') {
    headJson.script.push({ src: `/themes/azazie/svg/iconfont-new-fr.js?${version}`, body: true })
  } else if (store.state.language == 'de') {
    headJson.script.push({ src: `/themes/azazie/svg/iconfont-new-de.js?${version}`, body: true })
  } else if (store.state.language == 'it') {
    headJson.script.push({ src: `/themes/azazie/svg/iconfont-new-it.js?${version}`, body: true })
  } else if (store.state.language == 'nl') {
    headJson.script.push({ src: `/themes/azazie/svg/iconfont-new-nl.js?${version}`, body: true })
  } else if (store.state.language == 'se') {
    headJson.script.push({ src: `/themes/azazie/svg/iconfont-new-se.js?${version}`, body: true })
  } else {
    headJson.script.push({ src: `/themes/azazie/svg/iconfont-new-en.js?${version}`, body: true })
  }

  headJson.script.push({
    src: 'https://www.dwin1.com/19038.js',
    body: true,
    async: true,
    defer: true,
    'data-polaris-consent': 'statistics,marketing'
  })

  // 第三方监控 Pinterest
  if (routeName === 'list' || routeName === 'search' || routeName === 'storefront-storefrontView') {
    headJson.script.push({ src: `/themes/azazie/svg/svg_list_filter_pc.js?${version}`, body: true })
    if (store.state.isBridal || store.state.dressType == 'sample') {
      // 根据主题拆分svg文件，减少文件请求大小
      headJson.script.push({ src: `/themes/azazie/svg/svg_list_filter_pc_bridalB.js?${version}`, body: true })
    }
    if (!store.state.is_chrome_lighthouse) {
      headJson.script.push({ src: `/themes/azazie/svg/svg_list_filter_pc_2.js?${version}`, body: true })
    }
  }

  if (routeName === 'order-return') {
    headJson.script.push({ src: 'https://code.jquery.com/jquery-3.5.1.min.js' })
    headJson.script.push({ src: 'https://widget.parcelpoint.com.au/widget/v3.1/stores', 'data-polaris-consent': 'statistics,marketing' })
  }

  // oxxo  barcode
  if (routeName == 'order-invoiceDetail') {
    headJson.script.push({
      src: 'https://unpkg.com/jsbarcode@latest/dist/JsBarcode.all.min.js',
      'data-polaris-consent': 'statistics,marketing'
    })
  }
  // seo
  if (['list', 'index'].includes(routeName)) {
    const seoData = getGoogleSeo(routeName, context)
    headJson.script.push({ type: 'application/ld+json', innerHTML: JSON.stringify(seoData.organnization), hid: 'seo_organnization' })
    headJson.__dangerouslyDisableSanitizersByTagID.seo_organnization = ['innerHTML']
    headJson.script.push({ type: 'application/ld+json', innerHTML: JSON.stringify(seoData.BreadcrumbLists), hid: 'seo_BreadcrumbLists' })
    headJson.__dangerouslyDisableSanitizersByTagID.seo_BreadcrumbLists = ['innerHTML']
    headJson.script.push({ type: 'application/ld+json', innerHTML: JSON.stringify(seoData.WebSite), hid: 'seo_WebSite' })
    headJson.__dangerouslyDisableSanitizersByTagID.seo_WebSite = ['innerHTML']
    if (seoData.FAQPage) {
      headJson.script.push({ type: 'application/ld+json', innerHTML: JSON.stringify(seoData.FAQPage), hid: 'seo_FAQPage' })
      headJson.__dangerouslyDisableSanitizersByTagID.seo_FAQPage = ['innerHTML']
    }
    // #16706: bd、jbd、mob、wd、sod品类下所有列表页（包含filter）增加product 结构化数据,数据由content接口返回需要的json格式
    if (seoData.ListProduct) {
      headJson.script.push({ type: 'application/ld+json', innerHTML: JSON.stringify(seoData.ListProduct), hid: 'seo_ListProduct' })
      headJson.__dangerouslyDisableSanitizersByTagID.seo_ListProduct = ['innerHTML']
    }
  }
  if (['product'].includes(routeName)) {
    const seoVideoData = getGooglevideo(routeName, context)
    if (store.state.product.productVideoList.url) {
      headJson.script.push({ type: 'application/ld+json', innerHTML: JSON.stringify(seoVideoData), hid: 'seo_video' })
      headJson.__dangerouslyDisableSanitizersByTagID.seo_video = ['innerHTML']
    }
  }

  const langKey = `langs${store.state.language}`
  let glHTML = ''
  let allLangs = glVar[langKey]
  /* chrome 跑分 */
  if (store.state.is_chrome_lighthouse && ['product'].includes(jsKey)) {
    allLangs = store.state.webLanguageKeys.reduce((pre, key) => {
      pre[key] = allLangs[key]
      return pre
    }, {})
    glHTML = `window.${langKey} =` + JSON.stringify(allLangs)
    /* chrome end */
  } else {
    // index list 多语言组件化拆分
    if (['index', 'list', 'product'].includes(jsKey)) {
      allLangs = store.state.webLanguageKeys.reduce((pre, key) => {
        pre[key] = allLangs[key]
        return pre
      }, {})
    }
    glHTML = `window.${langKey} =` + JSON.stringify(allLangs)
  }
  headJson.script.push({ innerHTML: 'window.is_chrome_lighthouse = ' + store.state.is_chrome_lighthouse, hid: 'global_chrome' })
  if (typeof window !== 'object') {
    headJson.script.push({ innerHTML: glHTML, hid: 'global_data' })
  }
  headJson.__dangerouslyDisableSanitizersByTagID.global_data = ['innerHTML']
  // // bing追踪
  // if (context.dataLayerInfo && context.dataLayerInfo.gaTransactionFlag) {
  //   const bingOne = `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"23000238"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");`
  //   const bingTwo = `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"17065226"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetqPla");`
  //   headJson.script.push({ innerHTML: bingOne, hid: 'bingOne', 'data-polaris-consent': 'statistics,marketing' })
  //   headJson.script.push({ innerHTML: bingTwo, hid: 'bingTwo', 'data-polaris-consent': 'statistics,marketing' })
  // }
  // headJson.__dangerouslyDisableSanitizersByTagID.bingOne = ['innerHTML']
  // headJson.__dangerouslyDisableSanitizersByTagID.bingTwo = ['innerHTML']
  // headJson.script.push({ innerHTML: getBingSeo(routeName, context), hid: 'bing' })
  // headJson.__dangerouslyDisableSanitizersByTagID.bing = ['innerHTML']
  // todo: 翻书页面使用的js
  if (['landingPage-NewBrandBook', 'landingPage-BrideLookbook', 'landingPage-BridesmaidLookbook'].includes(routeName)) {
    headJson.script.push({ src: 'https://cdn-1.azazie.com/js/jquery.min.1.7.js ' })
    headJson.script.push({ src: 'https://cdn-1.azazie.com/js/modernizr.2.5.3.min.js ' })
  }
  // 本地开发看效果使用
  if (process.env.NODE_ENV === 'development') {
    headJson.script.push({ src: 'https://unpkg.com/spacingjs@1.0.7/dist/bundle.js', body: true })
  }
  return headJson
}

// 是否使用webp
// function addWebpSuffix(store, url, notWebp) {
//   if (store.state.isSupportWebp && !notWebp && (url + '').startsWith('http') && (url + '').includes('cdn-1')) {
//     return (url + '').replace(/(\.jpg|\.png|\.jpeg)$/g, ($, $1) => $1 + '.webp')
//   } else {
//     return url
//   }
// }

// 预先加载图片资源,提升lcp
// function handlePreloadImg(store) {
//   const jsKey = store.state.jsKey
//   let imagesrcset = ''
//   if (jsKey == 'index' && store.state.firstTopBannerList) {
//     // 首页first banner
//     imagesrcset = store.state.firstTopBannerList
//       .map((element) => {
//         return addWebpSuffix(store, element.imageUrl)
//       })
//       .join(',')
//   } else if (jsKey == 'list' && store.state.list.prodList.length) {
//     // 列表前15个商品图
//     const mainProdList = store.state.list.prodList.slice(0, 15)
//     imagesrcset = mainProdList
//       .map((element) => {
//         return addWebpSuffix(store, element.imgUrl)
//       })
//       .join(',')
//   } else if (jsKey == 'product' && store.state.product.baseInfo) {
//     // 详情主商品图
//     const baseInfo = store.state.product.baseInfo
//     const imageInfo = store.state.product.imageInfo
//     let productImgs = []
//     if (imageInfo && imageInfo.goodsGallery && imageInfo.goodsGallery[baseInfo.color] && imageInfo.goodsGallery[baseInfo.color].images) {
//       productImgs = JSON.parse(JSON.stringify(imageInfo.goodsGallery[baseInfo.color].images))
//     }

//     imagesrcset = productImgs
//       .map((element) => {
//         return addWebpSuffix(store, `${imageInfo.thumbPrefix}${element.imgUrl}`)
//       })
//       .join(',')
//   }
//   return imagesrcset
// }

export { getHeadJson }
