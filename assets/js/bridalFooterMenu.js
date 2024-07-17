export default [
  /** name内容是多语言，需要nl(),nameText是不需要多语言转换的
   * 未包含belong属性的时候，US和CA都渲染，包含belong属性的时候，需要判断是否是当前站点
   * 包含uninclude属性时，表示uninclude里的站点不渲染
   */
  {
    name: 'page_bridal_footer_brand',
    items: [
      {
        name: 'page_bridal_footer_our_story',
        url: '/about-us?subsite=bridal',
        need_datalayer: true,
        category: 'Bottom_Brand_Click',
        label: 'Brand_OurStory_Click'
      },
      {
        name: 'page_bridal_footer_azazie_brides',
        url: '/style-gallery/with/category/bridal?subsite=bridal',
        need_datalayer: true,
        category: 'Bottom_Brand_Click',
        label: 'Brand_AzazieBrides_Click'
      },
      {
        name: 'page_bridal_footer_testimonials',
        url: '/reviews/category/wedding-dresses?subsite=bridal',
        need_datalayer: true,
        category: 'Bottom_Brand_Click',
        label: 'Brand_Testimonials_Click'
      },
      {
        name: 'page_bridal_footer_lookbooks',
        url: '/bride-lookbook?subsite=bridal',
        need_datalayer: true,
        category: 'Bottom_Brand_Click',
        label: 'Brand_LookBooks_Click',
        uninclude: ['FR', 'DE', 'MX', 'ES', 'IT', 'IE']
      },
      {
        nameText: 'page_bridal_footer_careers',
        url: '/careers',
        need_datalayer: true,
        category: 'Bottom_Brand_Click',
        label: 'Brand_Careers_Click'
      }
    ]
  },
  {
    name: 'page_bridal_footer_resources',
    items: [
      {
        isSupportUrl: true,
        name: 'page_bridal_footer_ordering_timerframes',
        url: '/articles/360001805031-General-Shipping-Information',
        intercomUrl: `/articles/8076714`,
        need_datalayer: true,
        category: 'Bottom_Resources_Click',
        label: 'Resources_OrderingTimerframes_Click'
      },
      // {
      //   isSupportUrl: true,
      //   name: 'page_bridal_footer_how_our_sizing_works',
      //   url: '/articles/208182526-Standard-Sizing#h_01FVX969MQE4M6N3H17P28SAJP',
      //   need_datalayer: true,
      //   category: 'Bottom_Resources_Click',
      //   label: 'Resources_HowOurSizingWorks_Click'
      // },
      {
        name: 'page_bridal_footer_sizing_charts',
        url: '/size-chart',
        need_datalayer: true,
        category: 'Bottom_Resources_Click',
        label: 'Resources_SizingCharts_Click'
      },
      {
        isSupportUrl: true,
        name: 'page_bridal_footer_faqs',
        url: '/',
        intercomUrl: `/`,
        need_datalayer: true,
        category: 'Bottom_Resources_Click',
        label: 'Resources_Faqs_Click'
      },
      {
        isSupportUrl: true,
        name: 'page_bridal_footer_shipping',
        url: '/articles/360001805031-General-Shipping-Information',
        intercomUrl: `/articles/8076714`,
        need_datalayer: true,
        category: 'Bottom_Resources_Click',
        label: 'Resources_ShippingDelivery_Click'
      },
      {
        isSupportUrl: true,
        name: 'page_bridal_footer_return',
        url: '/articles/115005951206-What-is-your-return-policy',
        intercomUrl: '/articles/8075724',
        need_datalayer: true,
        category: 'Bottom_Resources_Click',
        label: 'Resources_ReturnExchanges_Click'
      },
      {
        name: 'page_bridal_footer_terms',
        url: '/terms-of-use',
        need_datalayer: true,
        category: 'Bottom_Resources_Click',
        label: 'Resources_TermsConditions_Click'
      },
      {
        name: 'page_sitemap_ca_transparency',
        url: '/ca-transparency',
        need_datalayer: true,
        category: 'Bottom_Azazie_Click',
        label: 'Azazie_CATransparency_Click',
        belong: ['US']
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
        name: 'page_bridal_footer_account',
        url: '/order/list',
        need_datalayer: true,
        category: 'Bottom_Resources_Click',
        label: 'Resources_Account_Click'
      },
      {
        isSupportUrl: true,
        name: 'page_bridal_footer_cantact',
        url: '/articles/360026475311-How-do-I-contact-you',
        intercomUrl: `/articles/8076683`,
        need_datalayer: true,
        category: 'Bottom_Resources_Click',
        label: 'Resources_CantactUs_Click'
      }
    ]
  },
  {
    name: 'page_bridal_footer_our_dresses',
    items: [
      {
        name: 'page_bridal_footer_wedding_dresses',
        url: '/all/wedding-dresses',
        need_datalayer: true,
        category: 'Bottom_OurDresses_Click',
        label: 'Bottom_WeddingDresses_Click'
      },
      {
        name: 'page_bridal_footer_plus_size',
        url: '/all/wedding-dresses/plus-size',
        need_datalayer: true,
        category: 'Bottom_OurDresses_Click',
        label: 'OurDresses_PlusSize_Click'
      },
      {
        name: 'page_bridal_footer_dresses',
        url: '/all/guest-of-wedding-dresses',
        need_datalayer: true,
        category: 'Bottom_OurDresses_Click',
        label: 'OurDresses_Dresses_Click'
      },
      {
        name: 'page_bridal_footer_bridesmaid',
        url: '/all/bridesmaid-dresses',
        need_datalayer: false,
        category: 'Bottom_OurDresses_Click',
        label: 'OurDresses_BridesmaidDresses_Click'
      },
      {
        name: 'page_bridal_footer_mother_bride',
        url: '/all/mother-of-the-bride-dresses',
        need_datalayer: true,
        category: 'Bottom_OurDresses_Click',
        label: 'OurDresses_MotherBride_Click'
      }
    ]
  }
]
