export default [
  /** name内容是多语言，需要nl(),nameText是不需要多语言转换的
   * 未包含belong属性的时候，US和CA都渲染，包含belong属性的时候，需要判断是否是当前站点
   * 包含uninclude属性时，表示uninclude里的站点不渲染
   */
  {
    name: 'page_sitemap_shopping',
    items: [
      {
        name: 'page_sitemap_shop_color',
        url: '/shop-by/color',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_Shopbycolor_Click'
      },
      {
        name: 'page_sitemap_shop_length',
        url: '/shop-by/length',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_ShopbyLength_Click'
      },
      {
        name: 'page_sitemap_shop_fabric',
        url: '/shop-by/fabric',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_ShopbyFabric_Click'
      },
      {
        name: 'page_sitemap_shop_silhouette',
        url: '/shop-by/silhouette',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_ShopbySilhouette_Click'
      },
      {
        nameText: 'page_footer_menu_shop_by_style',
        url: '/shop-by/style',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_ShopbyStyle_Click'
      },
      {
        nameText: 'page_footer_menu_shop_by_strap_&_sleeves',
        url: '/shop-by/straps-sleeves',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_ShopbyStrap&Sleeves_Click'
      },
      {
        nameText: 'page_footer_menu_shop_by_back_style',
        url: '/shop-by/back-style',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_ShopbyBackStyle_Click'
      },
      {
        name: 'page_shop_by_collection',
        url: '/wedding-dress-collections',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_ShopbyCollection_Click'
      },
      // {
      //   name: 'page_index_shop_sorority',
      //   url: 'https://sorority.azazie.com',
      //   need_datalayer: true,
      //   category: 'Bottom_Shopping_Click',
      //   label: 'Shopping_ShopSororityDresses_Click'
      // },
      // {
      //   name: 'page_index_shop_evening',
      //   url: 'https://evening.azazie.com',
      //   need_datalayer: true,
      //   category: 'Bottom_Shopping_Click',
      //   label: 'Shopping_ShopEveningDresses_Click'
      // },
      // {
      //   name: 'page_index_shop_blush_mark',
      //   url: 'https://www.blushmark.com',
      //   need_datalayer: true,
      //   category: 'Bottom_Shopping_Click',
      //   label: 'Shopping_ShopBlushMark_Click'
      // },
      {
        name: 'page_index_shop_gift_card',
        url: '/products/azazie-digital-gift-card',
        need_datalayer: true,
        category: 'Bottom_Shopping_Click',
        label: 'Shopping_ShopGiftCard_Click',
        belong: ['US']
      }
    ]
  },
  {
    name: 'page_js_azazie',
    items: [
      {
        key: 'blog_link',
        name: 'page_common_blog',
        url: 'https://www.azazie.com/blog/',
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_Blog_Click'
      },
      {
        name: 'page_common_about_us',
        url: '/about-us',
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_AboutUs_Click'
      },
      {
        name: 'page_common_careers',
        url: '/careers',
        belong: ['US'],
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_Careers_Click'
      },
      {
        name: 'page_sitemap_press',
        url: '/press',
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_Press_Click'
      },
      // {
      //   name: 'page_common_partner',
      //   url: '/partner',
      //   belong: ['US'],
      //   need_datalayer: true,
      //   category: 'Bottom_Azazie_Click',
      //   label: 'Azazie_Partner_Click'
      // },
      // {
      //   name: 'page_common_Scholarship',
      //   url: 'scholarship',
      //   need_datalayer: true,
      //   category: 'Bottom_Azazie_Click',
      //   label: 'Azazie_Scholarship_Click'
      // },
      {
        name: 'page_sitemap_affiliate_program',
        url: '/affiliate_program',
        uninclude: ['US', 'CA', 'GB', 'AU'],
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_AffiliateProgram_Click'
      },
      {
        name: 'page_sitemap_ambassador_program',
        url: '/ambassador-program',
        belong: ['US', 'CA', 'GB', 'AU'],
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_AmbassadorProgram_Click',
        key: 'ambassador_program'
      },
      {
        name: 'page_common_site_map',
        url: '/sitemap',
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_SiteMap_Click'
      },
      {
        name: 'page_reviews_keywords',
        url: '/reviews',
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_Reviews_Click'
      }
    ]
  },
  {
    name: 'page_sitemap_customer_care',
    items: [
      {
        name: 'page_common_customer_support',
        url: '',
        intercomUrl: `/`,
        country: 'CA', // 需要 country == 'CA' ? yesUrl : noUrl
        isSupportUrl: true, // https://support.azazie.com 的域名需要设置 isSupportUrl 为true
        yesUrl: '?from=ca',
        noUrl: '',
        need_datalayer: true,
        category: 'Bottom_CustomerCare_Click',
        label: 'CustomerCare_CustomerSupport_Click',
        isBaseCustomerSupport: true // 基础的faq链接需要做ab跳转测试
      },
      {
        name: 'page_goods_size_chart',
        url: '/size-chart',
        need_datalayer: true,
        category: 'Bottom_CustomerCare_Click',
        label: 'CustomerCare_SizeChart_Click'
      },
      {
        nameText: 'page_footer_menu_track_your_order',
        url: '/order/list',
        need_datalayer: true,
        category: 'PC_GuestCheckout',
        label: 'PC_TrackOrderBot_Click',
        font_bold: true,
        key: 'track_your_order',
        class: 'track-your-order'
      },
      // {
      //   name: 'page_mid_dress_guide',
      //   url: '/brides',
      //   need_datalayer: false,
      //   category: '',
      //   label: ''
      // },
      {
        name: 'page_common_goods_shipping',
        isSupportUrl: true, // https://support.azazie.com 的域名需要设置 isSupportUrl 为true
        url: '/articles/360001805031-General-Shipping-Information',
        intercomUrl: `/articles/8076714`,
        need_datalayer: true,
        category: 'Bottom_CustomerCare_Click',
        label: 'CustomerCare_Shipping_Click'
      },
      {
        name: 'page_common_payment_methods',
        url: '/payment-methods',
        need_datalayer: true,
        category: 'Bottom_CustomerCare_Click',
        label: 'CustomerCare_PaymentMethods_Click'
      },
      {
        name: 'page_student_discount_title',
        url: '/student-discount',
        need_datalayer: true,
        category: 'Bottom_CustomerCare_Click',
        label: 'CustomerCare_10%StudentDiscount_Click'
      },
      {
        name: 'page_common_return_policy',
        isSupportUrl: true, // https://support.azazie.com 的域名需要设置 isSupportUrl 为true
        url: '/articles/115005951206-What-is-your-return-policy',
        intercomUrl: '/articles/8075724',
        need_datalayer: true,
        category: 'Bottom_CustomerCare_Click',
        label: 'CustomerCare_ReturnPolicy_Click'
      },
      {
        name: 'page_common_contact_us',
        isSupportUrl: true, // https://support.azazie.com 的域名需要设置 isSupportUrl 为true
        url: '/articles/360026475311-How-do-I-contact-you',
        intercomUrl: `/articles/8076683`,
        key: 'contact_us',
        need_datalayer: true,
        category: 'Bottom_CustomerCare_Click',
        label: 'CustomerCare_ContactUs_Click'
      }
    ]
  }
]
