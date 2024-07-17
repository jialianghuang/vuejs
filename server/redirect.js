/** 路径直接server重定向 */

// 拦截请求链接进行重定向
function validate(url) {
  let redirectUrl = ''
  if (
    url &&
    !url.includes('.js') &&
    !url.includes('/1.0/') &&
    !url.includes('/_nuxt/') &&
    !url.includes('/__webpack_hmr/') &&
    !url.includes('/favicon.ico') &&
    !url.includes('.map')
  ) {
    const urlMap = {
      // AZWEB-19980 列表路径重定向
      '/all/all-mom-and-celebration-dresses/plus-size': '/all/plus-size-mother-of-the-bride-dresses',
      '/all/all-mom-and-celebration-dresses': '/all/mother-of-the-bride-dresses',
      '/all/rehearsal-dinner-dresses': '/all/mother-of-the-bride-dresses/with/occasion/rehearsal-dinner',
      '/all/bridal-shower-dresses': '/all/mother-of-the-bride-dresses/with/occasion/bridal-shower',
      '/all/formal-gala-dresses': '/all/mother-of-the-bride-dresses/with/occasion/formal-gala',
      '/all/cocktail-short-dresses': '/all/mother-of-the-bride-dresses/with/occasion/cocktail-short',
      // azazie-honey-bg详情页路径重定向 sale down
      // '/products/azazie-honey-bg': '/products/azazie-honeydew-bg',
      // AZWEB-19285 下掉权益包，路径重定向
      '/user?azazie_perks': '/user?my_coupons',
      '/rights-checkout': '/404',
      // AZWEB-19141 隐藏  stores、partner 入口
      '/stores': '/ambassador-program',
      '/partner': '/ambassador-program',
      // AZWEB-16829 KK预售跳定制列表页
      '/all/special-occasion-dresses/kendall-kylie': '/all/special-occasion-dresses?fixedBrandId=16',
      // '/all/sale': '/all/final-sale',
      // '/all/ready-to-ship': '/all/final-sale',
      // '/all/special-offer': '/all/final-sale',
      '/size_chart': '/size-chart',
      '/student_discount': '/student-discount',
      '/how_it_works': '/how-it-works',
      '/azazie_gift_cards_terms_and_conditions': '/azazie-gift-cards-terms-and-conditions',
      '/about_us': '/about-us',
      '/dress_guide': '/dress-guide',
      '/privacy_policy': '/privacy-policy',
      '/terms_of_use': '/terms-of-use',
      '/shop_by/color': '/shop-by/color',
      '/shop_by/length': '/shop-by/length',
      '/shop_by/fabric': '/shop-by/fabric',
      '/shop_by/silhouette': '/shop-by/silhouette',
      '/shop_by/style': '/shop-by/style',
      '/shop_by/straps-sleeves': '/shop-by/straps-sleeve',
      '/shop_by/back-style': '/shop-by/back-style',
      '/shop_by/price': '/shop-by/price',
      '/shop_by/neckline': '/shop-by/neckline',
      '/shop_by/features': '/shop-by/features',
      '/shop_by/body_type': '/shop-by/body-type',
      '/shop_by/embellishment': '/shop-by/embellishment',
      '/sign_up_for_email': '/sign-up-for-email',
      '/payment_methods': '/payment-methods',
      '/site_map': '/sitemap',
      '/reviews/category/bridesmaid_dresses': '/reviews/category/bridesmaid-dresses',
      '/reviews/category/wedding_dresses': '/reviews/category/wedding-dresses',
      '/reviews/category/mother_of_the_bride_dresses': '/reviews/category/mother-of-the-bride-dresses',
      '/reviews/category/modest_bridesmaid_dresses': '/reviews/category/modest-bridesmaid-dresses',
      '/reviews/category/maternity_bridesmaid_dresses': '/reviews/category/maternity-bridesmaid-dresses',
      '/reviews/category/junior_bridesmaid_dresses': '/reviews/category/junior-bridesmaid-dresses',
      '/reviews/category/flower_girl_dresses': '/reviews/category/flower-girl-dresses',
      '/reviews/category/groomsmen_accessories': '/reviews/category/groomsmen-accessories',
      '/reviews/category/wedding_veils': '/reviews/category/wedding-veils',
      '/reviews/category/sample_clearance': '/reviews/category/sample-clearance',
      '/reviews/category/garment_bags': '/reviews/category/garment-bags',
      '/giveaways_and_contests': '/giveaways-and-contests',
      '/ca_transparency': '/ca-transparency',
      '/all/special-occasion-dresses': '/all/atelier-formal-dresses',
      '/all/atelier-special-occasion-dresses': '/all/atelier-formal-dresses',
      '/all/party-dresses': '/all/atelier-party-dresses',
      '/all/cocktail-dresses': '/all/atelier-cocktail-dresses',
      '/all/formal-dresses': '/all/atelier-special-event-dresses',
      '/all/guest-of-wedding-dresses': '/all/atelier-guest-of-wedding-dresses',
      '/all/gala-dresses': '/all/atelier-gala-dresses',
      '/all/atelier-dresses': '/all/atelier-formal-dresses'
    }
    for (const i in urlMap) {
      if (url.includes(i)) {
        redirectUrl = url.replace(i, urlMap[i])
        break
      }
    }
  }
  return redirectUrl
}

exports.validate = validate
