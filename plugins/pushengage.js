function Pushengage() {}

const pushengageDiscount = 0.1
// 商品真实id
// const realGoodsId = window.pageData.realGoodsId || window.pageData.goods_id
// let goodsName = window.pageData.goodsName || window.pageData.goodsName
// goodsName = formatGoodsName(goodsName)

// pushengage添加加车trigger
Pushengage.prototype.addToCartPushengageTrigger = function(campaignName, goodsName, goodsPrice, imageUrl) {
  if (typeof window._peq != 'undefined') {
    // const imageUrl = getImageUrl()
    window._peq.push([
      'add-to-trigger',
      {
        campaign_name: campaignName,
        event_name: 'add_to_cart',
        title: { productname: goodsName },
        message: { productname: goodsName, price: goodsPrice },
        notification_url: { notificationurl: window.$nuxt.HTTPS_HOST + '/cart' },
        notification_image: { imageurl: window.$nuxt.PIC_PATH + 's74/' + imageUrl }
      }
    ])
  }
}

// pushengage添加支付trigger
Pushengage.prototype.payPushengageTrigger = function(campaignName) {
  if (typeof window._peq != 'undefined') {
    window._peq.push([
      'add-to-trigger',
      {
        campaign_name: campaignName,
        event_name: 'pay'
      }
    ])
  }
}

/**
 * 降价通知商品折扣，需与pushengage后台设置的降价条件一致
 * 且alertPrice不传会默认设置为price，且alertPrice需低于后台设置降价后价格
 * curl pushengage api update product两次价格满足设置条件，且降价后的价格低于alertPrice
 * 即原价20，折扣0.2，alertPrice需尽量低于16，api更新商品价格低于16和alertPrice
 */
// pushengage降价通知
Pushengage.prototype.saleAlert = function(goodsId, goodsPrice, goodsName, imageUrl, colorId) {
  if (typeof window._peq != 'undefined') {
    const alertPrice = Math.floor(goodsPrice * (1 - pushengageDiscount))
    window._peq.push([
      'add-alert',
      {
        type: 'price_drop',
        product_id: window.$nuxt.country + goodsId, // required, product id or product SKU
        link: window.location.href, // required, product page url
        price: goodsPrice, // required
        title: goodsName, // required, default: "title"
        image_link: window.$nuxt.PIC_PATH + 's74/' + imageUrl, // required, default: "image_link"
        alertPrice, // 降价必须
        // "ts_expires": "", // optional, alert expiry date, default 30 days
        // "availability": "", // [inStock, outOfStock], default:inStock, (Optional and takes "Out Of Stock" as default value in Inventory Alert, "In Stock" in Price Drop Alert)
        constiant_id: window.$nuxt.country + goodsId + colorId // optional, (Optional. Example if the same T-shirt has a different price for different colors)
        // "description": "", // optional, product description
      },
      console.log
    ])
  }
}

// pushengage库存通知
Pushengage.prototype.stockAlert = function(color, size, goodsPrice, imageUrl, goodsName, goodsId) {
  if (typeof window._peq != 'undefined') {
    const alertPrice = Math.floor(goodsPrice * (1 - pushengageDiscount))
    window._peq.push([
      'add-alert',
      {
        type: 'inventory',
        product_id: window.$nuxt.country + goodsId, // required, product id or product SKU
        link: window.location.href, // required, product page url
        price: goodsPrice, // required
        title: goodsName, // required, default: "title"
        image_link: window.$nuxt.PIC_PATH + 's74/' + imageUrl, // required, default: "image_link"
        alertPrice, // optional, default to price
        // "ts_expires": "", // optional, alert expiry date, default 30 days
        availability: 'outOfStock', // 库存通知只能是outOfStock
        constiant_id: window.$nuxt.country + goodsId + color + size // optional
        // "description": "", // optional, product description
      },
      console.log
    ])
  }
}

// // 实体字符解码，"&#039"转成"'";
// function decode(str) {
//   let div = document.createElement('div')
//   div.innerHTML = str
//   const output = div.textContent || div.textContent
//   div = null
//   return output
// }

// // 字符串首字母转大写
// function strToUpper(str) {
//   let temp = []
//   str = str.toLowerCase()
//   temp = str.split(' ')
//   for (let i = 0; i < temp.length; i++) {
//     let strTemp = temp[i].charAt(0)
//     strTemp = strTemp.toUpperCase()
//     temp[i] = temp[i].replace(temp[i].charAt(0), strTemp)
//   }
//   str = temp.join(' ')
//   return str
// }

// // 各种商品名处理
// function formatGoodsName(str) {
//   // 实体字符解码
//   str = decode(str)
//   // sod商品名处理
//   switch (window.pageData.cat_id) {
//     case 3:
//       // 获取选取的颜色，navy blue
//       let goodsColor = ''
//       // $('.style-color-block .pis-color-box')
//       //   .find('a dl dt.selected')
//       //   .parent()
//       //   .attr('data-showcolor') || ''
//       // 转大写Navy Blue
//       goodsColor = strToUpper(goodsColor)
//       // Kendall {Color} Off-The-Shoulder Maxi Dress，Navy Blue替换{Color}
//       const reg = /\{Color\}/g
//       str = str.replace(reg, goodsColor)
//       break
//   }
//   return str
// }

// // 商品原价
// function getGoodsPrice() {
//   if (typeof window.pageData.product_base.no_deal_price != 'undefined') {
//     return window.pageData.product_base.no_deal_price.slice(window.pageData.product_base.no_deal_price.indexOf('$') + 1)
//   } else {
//     return window.pageData.product_base.price.slice(window.pageData.product_base.price.indexOf('$') + 1)
//   }
// }

// // 商品图片
// function getImageUrl() {
//   if (window.$nuxt.product.goodsGallery[window.pageData.defaultThumbColor]) {
//     return window.pageData.goodsGallery[window.pageData.defaultThumbColor][0]
//   } else {
//     // 带腰带的裙子，图片由裙子颜色和腰带颜色共同决定，取第一个就好
//     const key = Object.keys(window.pageData.goodsGallery).shift()
//     return window.pageData.goodsGallery[key][0]
//   }
// }

// // 商品颜色
// function getColorId() {
//   // 时装颜色不同，价格可能不同
//   if (window.pageData.cat_id == 3) {
//     return ''
//     //   $('.style-color-block .pis-color-box')
//     //     .find('a dl dt.selected')
//     //     .parent()
//     //     .attr('data-style-id') || ''
//   } else {
//     return ''
//   }
// }

export default new Pushengage()
