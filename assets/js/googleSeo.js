import { removeAllUrlParamter } from '../js/utils'
const baseconfig = {
  organnization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AZAZIE',
    url: 'http://www.azazie.com',
    logo: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/c8/46/83dbd11e39709fdb20f17bd06f80c846.png',
    contactPoint: {
      '@type': 'contactPoint',
      telephone: '+1-833-829-5168',
      contactType: 'custom service'
    }
  },
  BreadcrumbLists: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'AZAZIE',
        item: 'http://www.azazie.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'AZAZIE',
        item: 'http://www.azazie.com'
      }
    ]
  },
  WebSite: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://www.azazie.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.azazie.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

export const getGoogleSeo = (routeName, context) => {
  const data = JSON.parse(JSON.stringify(baseconfig))
  if (routeName === 'index') {
    data.BreadcrumbLists.itemListElement.length = 1
    return data
  } else if (routeName === 'list') {
    data.BreadcrumbLists.itemListElement[1].name = (context.seoInfo && context.seoInfo.title) || 'Azazie'
    data.BreadcrumbLists.itemListElement[1].item = removeAllUrlParamter('https://www.azazie.com' + context.requestUrl)
    const store = context.$store || context.store
    const tempSeoFaqList = []
    if (store.state.list.seoFaqList && store.state.list.seoFaqList.length) {
      store.state.list.seoFaqList.forEach((item) => {
        tempSeoFaqList.push({
          '@type': 'Question',
          name: item.name,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.value
          }
        })
      })
    }
    if (tempSeoFaqList.length) {
      data.FAQPage = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tempSeoFaqList
      }
    }
    // #16706: bd、jbd、mob、wd、sod品类下所有列表页（包含filter）增加product 结构化数据,数据由content接口返回需要的json格式
    data.ListProduct = context.seoInfo && context.seoInfo.productSeo
    return data
  }
}

export const getBingSeo = (routeName, context) => {
  const store = context.$store || context.store
  let ecommProdid = ''
  let ecommPagetype = ''
  let revenueValue = ''
  let currency = ''
  if (routeName === 'index') {
    ecommPagetype = 'home'
  } else if (routeName === 'list') {
    ecommPagetype = 'category'
    if (store.state.list.prodList.length) {
      ecommProdid = store.state.list.prodList.map((item) => 'AZcUSleng' + item.goodsId)
    }
  } else if (routeName === 'product') {
    ecommPagetype = 'product'
    ecommProdid = 'AZcUSleng' + store.state.product.baseInfo.goodsId
  } else if (routeName === 'search') {
    if (store.state.list.prodList && store.state.list.prodList.length) {
      ecommProdid = store.state.list.prodList.map((item) => 'AZcUSleng' + item.goodsId)
    }
    ecommPagetype = 'seachresults'
  } else if (routeName === 'checkoutSuccess') {
    ecommPagetype = 'purchase'
    revenueValue = store.state.checkout.bingSeoInfo.revenueValue
    currency = store.state.checkout.bingSeoInfo.currency
  } else if (routeName === 'cart') {
    ecommPagetype = 'cart'
    ecommProdid = store.state.cart.checkoutGoodsList.map((item) => 'AZcUSleng' + item.goodsId)
  } else {
    ecommPagetype = 'other'
  }
  const env = JSON.stringify({ ecomm_prodid: ecommProdid, ecomm_pagetype: ecommPagetype, currency, revenue_value: revenueValue })
  return `window.uetqPla = window.uetqPla || []; window.uetqPla.push('event', '', ${env});window.uetq = window.uetq || []; window.uetq.push('event', '', ${env})`
}

// seo google  收录视频数据
export const getGooglevideo = (routeName, context) => {
  const store = context.$store || context.store
  const videoData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: store.state.product.baseInfo.goodsName,
    description: store.state.product.baseInfo.goodsDetails,
    thumbnailUrl: [store.state.product.productVideoList.thumbnail],
    uploadDate: '2021-09-29T16:00:00.000Z',
    // duration: 'PT1M54S',
    contentUrl: store.state.product.productVideoList.url
  }
  return videoData
}
