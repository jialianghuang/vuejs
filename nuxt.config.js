// const path = require('path')
const LRU = require('lru-cache')
const date = new Date().getTime()
const isDevelopment = !['production'].includes(process.env.NODE_ENV) || process.env.NODE_ENV_TEST
const glob = require('glob')
const { removeSync } = require('fs-extra')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const SENTRY_RELEASE = `riven-az-pc-${process.env.GIT_VERSION}`
const seoLanguages = require('./modules/supportSeoLanguage')
const { redisAllPages } = require('./modules/redisPages')
// const { logger } = require('./server/logger')

// const addRouters = require('./router/index')

const nuxtConfig = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Azazie'
  },
  // 不可注释
  // host: '0.0.0.0' 确保局域网可访问
  server: {
    port: 3000,
    host: '0.0.0.0' // 默认 localhost 使用0.0.0.0支持局域网访问
  },
  env: {
    SENTRY_DSN: 'https://8a53abedc8ea4f5880d57b471e30e4e2@sentry.gaoyaya.com/5',
    SENTRY_RELEASE,
    GIT_VERSION: process.env.GIT_VERSION // 客户端使用变量
  },
  /*
   ** Customize the progress-bar color
   */
  loading: false,
  /*
   ** Global CSS
   */
  css: [
    { src: 'assets/less/font.less', lang: 'less' },
    { src: 'assets/less/reset.less', lang: 'less' },
    { src: 'assets/less/common.less', lang: 'less' },
    { src: 'swiper/dist/css/swiper.css' }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/axios' },
    { src: '~plugins/filter' },
    { src: '~plugins/mixins.js' },
    { src: '~plugins/dayjs.js' },
    // { src: '~plugins/echarts' },
    { src: '~plugins/errorlog.js' },
    { src: '~plugins/routerAfterEach.js', mode: 'client' },
    { src: '~plugins/cookie.js', mode: 'client' },
    { src: '~plugins/localStorage.js', mode: 'client' },
    { src: '~plugins/swiper.js', mode: 'client' },
    // { src: '~plugins/zendesk_new.js', mode: 'client' },
    { src: '~plugins/intercom.js', mode: 'client' },
    { src: '~plugins/vue-lazyload.js', mode: 'client' },
    { src: '~plugins/clipboard.js', mode: 'client' },
    { src: '~plugins/showroomFav', mode: 'client' },
    { src: '~plugins/vue-plugins', mode: 'client' },
    { src: '~plugins/readyUtils.js', mode: 'client' }, // airship
    { src: '~plugins/vant-loadmore.js' },
    { src: '~plugins/sentry.server.js', mode: 'server' },
    { src: '~plugins/sentry.client.js', mode: 'client' }
    // { src: '~plugins/velocity.js', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
    // 'nuxt-build-optimisations'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '~/modules/web-api', // 必须第一位 => 重写的rendeRoute最后执行
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/proxy',
    '@/modules/axCache',
    '~/modules/cache',
    '~/modules/serverAnalysis',
    '@/modules/redis-hook',
    '~/modules/nuxt-ssr-cache'
    // 'nuxt-precompress'
  ],
  cache: {
    pages: redisAllPages, // 任意值，保证进入判断逻辑
    useHostPrefix: true,
    platform: 'pc',
    store: {
      type: 'redis',
      // host: 'aznode-stress.nsg3lg.0001.use1.cache.amazonaws.com', // 压测
      host: isDevelopment ? 'ec2-34-194-77-29.compute-1.amazonaws.com' : 'aznode-temp.sx3zi9.ng.0001.use1.cache.amazonaws.com', // test online
      // ttl: 5 * 60,
      // ttl: 30,
      // ttl: 15 * 60,
      ttl: 30 * 60,
      configure: [
        // these values are configured
        // on redis upon initialization
        ['maxmemory', '200mb'],
        ['maxmemory-policy', 'allkeys-lru']
      ]
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    credentials: true,
    proxy: true
  },
  proxy: {
    '/dev/1.0/': {
      target: 'https://api-t-6.azazie.com/',
      pathRewrite: {
        '^/dev/': '/'
      },
      changeOrigin: true
    },
    '/dev-1/1.0/': {
      target: 'https://api-t-1.azazie.com/',
      pathRewrite: {
        '^/dev-1/': '/'
      },
      changeOrigin: true
    },
    '/dev-2/1.0/': {
      target: 'https://api-t-2.azazie.com/',
      pathRewrite: {
        '^/dev-2/': '/'
      },
      changeOrigin: true
    },
    '/dev-3/1.0/': {
      target: 'https://api-t-3.azazie.com/',
      pathRewrite: {
        '^/dev-3/': '/'
      },
      changeOrigin: true
    },
    '/dev-4/1.0/': {
      target: 'https://api-t-4.azazie.com/',
      pathRewrite: {
        '^/dev-4/': '/'
      },
      changeOrigin: true
    },
    '/dev-5/1.0/': {
      target: 'https://api-t-5.azazie.com/',
      pathRewrite: {
        '^/dev-5/': '/'
      },
      changeOrigin: true
    },
    '/dev-6/1.0/': {
      target: 'https://api-t-6.azazie.com/',
      pathRewrite: {
        '^/dev-6/': '/'
      },
      changeOrigin: true
    },
    '/dev-7/1.0/': {
      target: 'https://api-t-7.azazie.com/',
      pathRewrite: {
        '^/dev-7/': '/'
      },
      changeOrigin: true
    },
    '/dev-8/1.0/': {
      target: 'https://api-t-8.azazie.com/',
      pathRewrite: {
        '^/dev-8/': '/'
      },
      changeOrigin: true
    },
    '/dev-9/1.0/': {
      target: 'https://api-t-9.azazie.com/',
      pathRewrite: {
        '^/dev-9/': '/'
      },
      changeOrigin: true
    },
    '/dev-p1/1.0/': {
      target: 'https://apix-p.azazie.com/',
      pathRewrite: {
        '^/dev-p1/': '/'
      },
      changeOrigin: true
    },
    '/dev-p2/1.0/': {
      target: 'https://apix-p2.azazie.com/',
      pathRewrite: {
        '^/dev-p2/': '/'
      },
      changeOrigin: true
    },
    '/dev-p3/1.0/': {
      target: 'https://apix-p3.azazie.com/',
      pathRewrite: {
        '^/dev-p3/': '/'
      },
      changeOrigin: true
    },
    '/dev-p4/1.0/': {
      target: 'https://apix-p4.azazie.com/',
      pathRewrite: {
        '^/dev-p4/': '/'
      },
      changeOrigin: true
    },
    '/dev-p5/1.0/': {
      target: 'https://apix-p5.azazie.com/',
      pathRewrite: {
        '^/dev-p5/': '/'
      },
      changeOrigin: true
    },
    '/dev-p6/1.0/': {
      target: 'https://apix-p6.azazie.com/',
      pathRewrite: {
        '^/dev-p6/': '/'
      },
      changeOrigin: true
    },
    '/dev-x/1.0/': {
      target: 'https://apix.azazie.com/',
      pathRewrite: {
        '^/dev-x/': '/'
      },
      changeOrigin: true
    },
    // '/dev-ca/1.0/': {
    //   target: 'https://apix-p4.azazie.com/',
    //   pathRewrite: {
    //     '^/dev-ca/': '/'
    //   },
    //   changeOrigin: true
    // },
    // !！！！线上项目会走这里的代理，以下代理请不要修改！！！
    '/prod/1.0/': {
      target: 'https://apix-internal.azazie.com/',
      pathRewrite: {
        '^/prod/': '/'
      },
      changeOrigin: true
    },
    // '/prod-ca/1.0/': {
    //   target: 'https://apix-internal.azazie.com/',
    //   pathRewrite: {
    //     '^/prod-ca/': '/'
    //   },
    //   changeOrigin: true
    // },
    '/pre/1.0/': {
      target: 'https://apix-p' + process.env.ENV_ID + '.azazie.com/',
      pathRewrite: {
        '^/pre/': '/'
      },
      changeOrigin: true
    },
    // 压测域名
    '/stress/1.0/': {
      target: 'https://apix-stress.azazie.com/',
      pathRewrite: {
        '^/stress/': '/'
      },
      changeOrigin: true
    },
    // '/pre-ca/1.0/': {
    //   target: 'https://apix-p' + process.env.ENV_ID + '.azazie.com/',
    //   pathRewrite: {
    //     '^/pre-ca/': '/'
    //   },
    //   changeOrigin: true
    // },
    '/test/1.0/': {
      target: 'https://api-t-' + process.env.ENV_ID + '.azazie.com/',
      pathRewrite: {
        '^/test/': '/'
      },
      changeOrigin: true
    },
    // '/test-ca/1.0/': {
    //   target: 'https://api-t-' + process.env.ENV_ID + '.azazie.com/',
    //   pathRewrite: {
    //     '^/test-ca/': '/'
    //   },
    //   changeOrigin: true
    // },
    // 日志
    '/prod/logs/1.0/': {
      target: 'https://azlog.azazie.com/',
      pathRewrite: {
        '^/prod/logs/': '/'
      },
      changeOrigin: true
    },
    // '/prod-ca/logs/1.0/': {
    //   target: 'https://azlog.azazie.com/',
    //   pathRewrite: {
    //     '^/prod-ca/logs/': '/'
    //   },
    //   changeOrigin: true
    // },
    '/pre/logs/1.0/': {
      target: 'https://azlog.azazie.com/',
      pathRewrite: {
        '^/pre/logs/': '/'
      },
      changeOrigin: true
    },
    // '/pre-ca/logs/1.0/': {
    //   target: 'https://azlog.azazie.com/',
    //   pathRewrite: {
    //     '^/pre-ca/logs/': '/'
    //   },
    //   changeOrigin: true
    // },
    // 静态json cdn
    '/dev/static/': {
      target: 'https://azazietestimg.s3.amazonaws.com/',
      pathRewrite: {
        '^/dev/static': '/'
      },
      changeOrigin: true
    }
    // '/dev-ca/static/': {
    //   target: 'https://azazietestimg.s3.amazonaws.com/',
    //   pathRewrite: {
    //     '^/dev-ca/static': '/'
    //   },
    //   changeOrigin: true
    // }
  },
  /**
   * Global Variables
   */
  styleResources: {
    less: ['./assets/less/variables.less', './assets/less/theme_bridal.less']
  },

  // https://www.nuxtjs.cn/guide/routing
  router: {
    middleware: 'resetSeoLanguage',
    extendRoutes(routes) {
      const aliasRouters = [
        {
          path: '/bestSeller',
          alias: ['/best-seller/*']
        },
        {
          path: '/inspiration/fall-winter-wedding-dresses',
          alias: ['/inspiration/spring-summer-wedding-dresses']
        },
        {
          path: '/real-weddings',
          alias: ['/real-weddings(/[^/]*)?']
        },
        {
          path: '/inspiration/try-before-you-buy',
          alias: ['/inspiration/planning-your-try-on']
        },
        {
          path: '/show-book',
          alias: ['/show-book/*']
        },
        {
          path: '/shop_by',
          alias: ['/shop-by/*']
        },

        {
          path: '/promotion/cybermonday-landing-page',
          alias: ['/black-friday-cyber-monday', '/black-friday-cyber-monday-influencer-selected']
        },
        {
          path: '/giftCard', // 礼品卡详情页
          alias: ['/products/azazie-digital-gift-card*']
        },
        {
          path: '/product',
          alias: ['/products/*']
        },
        {
          path: '/review/reviewsList',
          alias: ['/reviews', '/reviews/category/*', '/reviews/[^/]*-c([0-9]+)/?$']
        },
        {
          path: '/review/productReviews',
          alias: ['/reviews/*']
        },
        {
          path: '/landingPage/kendallKylieComingSoon',
          alias: ['/kendall-kylie-comingsoon']
        },
        {
          path: '/sale',
          alias: ['/all/sale']
        },
        {
          path: '/rankpage',
          alias: ['/all/rankpage/([0-9]{6})']
        },
        {
          path: '/collection',
          alias: ['/all/collections/*']
        },
        {
          path: '/promDressIntro',
          alias: ['/all/prom-intro']
        },
        {
          path: '/landingPage/newBrandComingSoon',
          alias: ['/all/pnina-tornai-intro']
        },
        // WGD KK预售landing page
        {
          path: '/landingPage/preorderList',
          alias: ['/all/special-occasion-dresses/kendall-kylie']
        },
        {
          path: '/landingPage/holidayBride', // AZWEB-20548 The Bachelorette’s Charity Lawson Holiday
          alias: ['/all/the-bachelorette-charity-lawson-bride-to-be-holiday-gift-guide']
        },
        {
          path: '/flashSaleList',
          alias: ['/all/flash-sale']
        },
        {
          path: '/landingPage/preSaleList',
          alias: ['/all/winter-wedding-guest-dresses']
        },
        {
          path: '/landingPage/Atelier', // sod 定制落地页
          alias: ['/all/atelier']
        },
        {
          path: '/landingPage/barbieDresses', // barbie落地页
          alias: ['/barbie-dresses']
        },
        {
          path: '/list',
          alias: [
            '/dress/*',
            '/engagement-dresses*',
            '/theme/*',
            '/swatches',
            '/fabrics',
            '/samples&swatches',
            '/samples-swatches',
            '/swatches&fabric',
            '/swatches-fabric',
            '/sashes',
            '/nbcf',
            '/nuxt/list',
            '/swatches/*',
            '/fabrics/*',
            '/swatches-fabric/*',
            '/collection/all', // all sale 需求
            '/collection/eventshop*' // lego配置的活动落地页，原本走theHolidayShop，现在走列表页
          ]
        },
        {
          path: '/theHolidayShop',
          alias: ['/eventshop*']
        },
        {
          path: '/checkoutSuccess',
          alias: ['/checkout_success/([a-zA-Z]*)/([A-Z0-9]+)']
        },
        {
          path: '/showroom',
          alias: ['/showroom', '/showroom/(.*)']
        },
        {
          path: '/order/returnStatus',
          alias: ['/order/return_status']
        },
        {
          path: '/order/AlterationReimbursement',
          alias: ['/order/alteration_reimbursement']
        },
        {
          path: '/order/orderDetail',
          alias: ['/order/detail']
        },
        {
          path: '/order/invoiceDetail',
          alias: ['/order/invoice_detail']
        },
        {
          path: '/order/orderList',
          alias: ['/order/list', '/account/orders']
        },
        {
          path: '/order/editAddress',
          alias: ['/order/edit_address']
        },
        {
          path: '/order/tracking',
          alias: ['/pages/tracking']
        },
        {
          path: '/review/orderReview',
          alias: ['/review/order_review']
        },
        {
          path: '/review/orderReviews',
          alias: ['/review/order_reviews']
        },
        {
          path: '/purchaseSample',
          alias: ['/purchase_sample']
        },
        {
          path: '/styleGallery',
          alias: ['/style-gallery/(.*)', '/style-gallery']
        },
        {
          path: '/help/aboutUs',
          alias: ['/about-us']
        },
        {
          path: '/help/careers',
          alias: ['/careers']
        },
        {
          path: '/help/scholarship',
          alias: ['/scholarship']
        },
        {
          path: '/help/siteMap',
          alias: ['/site_map', '/sitemap']
        },
        {
          path: '/help/affiliateProgram',
          alias: ['/affiliate_program']
        },
        {
          path: '/help/ambassadorProgram',
          alias: ['/ambassador-program']
        },
        {
          path: '/help/partner',
          alias: ['/partner']
        },
        {
          path: '/help/gift_cards_terms_and_conditions',
          alias: ['/azazie-gift-cards-terms-and-conditions']
        },
        {
          path: '/help/terms_of_use',
          alias: ['/terms-of-use']
        },
        {
          path: '/help/privacy_policy',
          alias: ['/privacy-policy']
        },
        {
          path: '/help/content-submission-agreement',
          alias: ['/content-submission-agreement']
        },
        {
          path: '/help/press',
          alias: ['/press']
        },
        {
          path: '/help/sizeChart',
          alias: ['/size-chart']
        },
        {
          path: '/help/dressGuide',
          alias: ['/dress-guide']
        },
        {
          path: '/help/giveaways_and_contests',
          alias: ['/giveaways-and-contests']
        },
        {
          path: '/help/accessibility_statement',
          alias: ['/accessibility_statement']
        },
        {
          path: '/help/student_discount',
          alias: ['/student-discount']
        },
        {
          path: '/help/sign_up_for_email',
          alias: ['/sign-up-for-email']
        },
        {
          path: '/help/wedding_expo',
          alias: ['/wedding-expo']
        },
        {
          path: '/help/payment_methods',
          alias: ['/payment-methods']
        },
        {
          path: '/help/ca_transparency',
          alias: ['/ca-transparency']
        },
        {
          path: '/landingPage/couponWheel',
          alias: ['/coupon-wheel']
        },
        {
          path: '/landingPage/WDShoppingExperience',
          alias: ['/bridal-shopping-guide']
        },
        {
          path: '/landingPage/WDCollection',
          alias: ['/brides-intro']
        },
        {
          path: '/topSearches',
          alias: ['/top-searches']
        },
        {
          path: '/help/how_it_works',
          alias: ['/how-it-works']
        },
        {
          path: '/waysToWear',
          alias: ['/convertible-dress/*']
        },
        {
          path: '/landingPage/comingSoon',
          alias: ['/comingsoon']
        },
        {
          path: '/landingPage/unsubscribe',
          alias: ['/unsubscribe']
        },
        {
          path: '/landingPage/maintenance',
          alias: ['/maintenance']
        },
        {
          path: '/landingPage/NewBrandBook',
          alias: ['/lookbook']
        },
        {
          path: '/landingPage/YearAndPromotion',
          alias: ['/year-and-promotion', '/event']
        },
        {
          path: '/landingPage/BrideLookbook',
          alias: ['/bride-lookbook']
        },
        {
          path: '/landingPage/BridesmaidLookbook',
          alias: ['/bridesmaid-lookbook']
        },
        {
          path: '/landingPage/exchange',
          alias: ['/return_exchange']
        },
        {
          path: '/promotion/userGeneratedContent',
          alias: ['/azazie-prom-day']
        },
        {
          path: '/',
          alias: ['/', '/help', '/bridal']
        },
        {
          path: '/elopement-styles',
          alias: ['/wedding-dresses/little-white-dress']
        },
        {
          path: '/landingPage/Welcome',
          alias: ['/we-help-brides']
        },
        {
          path: '/landingPage/landing_activity',
          alias: ['/mid-year-semi-annual-sale', '/landing/(.*)']
        },
        {
          path: '/landingPage/klarnaInfo', // Klarna落地页
          alias: ['/klarna-info']
        },
        {
          path: '/storefront/storefrontDetails',
          alias: ['/storefront-details']
        },
        // {
        //   path: '/landingPage/barbiePre', // barbie 预热页面
        //   alias: ['/barbie-dresses']
        // },
        {
          path: '/storefront/storefrontView',
          alias: ['/store/*', '/store']
        }
        // 兜底，跳转到404，不要往后加！！！！
        // {
        //   path: '/404',
        //   alias: ['/*']
        // }
      ]
      // routes.push(...addRouters)
      aliasRouters.map((item) => {
        const index = routes.findIndex((route) => '' + route.path === '' + item.path)
        routes[index] = { ...routes[index], alias: item.alias }
      })

      // 注意因为很多匹配 /all/* 路径，所以这个路径放最后push
      routes.push({
        path: '/list',
        alias: ['/all/*']
      })
      // 兜底，跳转到404，不要往后加！！！！
      routes.push({
        path: '/404',
        alias: ['/*']
      })

      const countryRouteReg = '/(' + seoLanguages.join('|') + ')'
      // 新增语言alias，增加路由匹配
      routes.forEach((item) => {
        if (item.alias && item.alias.length) {
          item.alias = [...item.alias, ...item.alias.map((aliaItem) => countryRouteReg + aliaItem)]
        } else {
          item.alias = [countryRouteReg + item.path]
        }
      })

      // logger.error(JSON.stringify(routes))

      // console.log('-----routes----', routes)
      return routes
    },
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return {
          x: 0,
          y: 0
        }
      }
    }
  },
  // render: {
  //   bundleRenderer: {
  //     cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 60 })
  //   }
  // },
  render: {
    bundleRenderer: {
      cache: new LRU({
        max: 200,
        maxAge: 1000 * 60 * 60 * 3
      })
    },
    static: {
      // static文件默认maxAge0，需设置
      maxAge: 1000 * 60 * 60 * 24 * 30 * 3 // 暂定3个月缓存
    },
    shouldPreload: (file, type) => {
      return ['style', 'font'].includes(type)
    }
  },
  /*
   ** Build configuration
   */
  build: {
    // analyze: true,
    /**
     * 将主块中的 CSS 提取到一个单独的 CSS 文件中
     */
    // extractCSS: isDevelopment ? false :{ ignoreOrder: true },
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       styles: {
    //         name: 'styles',
    //         test: /\.(css|vue)$/,
    //         chunks: 'all',
    //         enforce: true
    //       }
    //     }
    //   }
    // },
    filenames: {
      app: ({ isDev }) => (isDev ? 'riven/[name].[id].js?v=' + date : 'riven/[id].[contenthash].js'),
      chunk: ({ isDev }) => (isDev ? 'riven/[name].[id].js?v=' + date : 'riven/[id].[contenthash].js'),
      css: ({ isDev }) => (isDev ? 'riven/[name].[id].css?v=' + date : 'riven/[id].[contenthash].css'),
      img: ({ isDev }) => (isDev ? 'riven/[path][name].[ext]' : 'riven/img/[contenthash:7].[ext]'),
      font: ({ isDev }) => (isDev ? 'riven/[path][name].[ext]' : 'riven/fonts/[contenthash:7].[ext]'),
      video: ({ isDev }) => (isDev ? 'riven/[path][name].[ext]' : 'riven/videos/[contenthash:7].[ext]')
    },
    postcss: {
      // 添加插件名称作为键，参数作为值
      // 使用npm或yarn安装它们
      plugins: {
        // 通过传递 false 来禁用插件
      },
      preset: {
        // 更改postcss-preset-env 设置
        autoprefixer: {
          overrideBrowserslist: 'last 5 version'
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // 配置svg-sprite-loader
      // const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))
      // svgRule.exclude = [path.resolve(__dirname, 'assets/svgs')]
      // config.module.rules.push({
      //   test: /\.svg$/,
      //   include: [path.resolve(__dirname, 'assets/svgs')],
      //   loader: 'svg-sprite-loader',
      //   options: {
      //     symbolId: '[name]'
      //   }
      // })

      /** 引入打包时自动上传sourcemap的插件 */
      const { isDev } = ctx
      if (!isDev && ctx.isClient) {
        config.devtool = 'source-map'
        config.plugins.push(
          new SentryWebpackPlugin({
            include: ['.nuxt/dist/client/riven'],
            ignore: ['node_modules', '.nuxt/dist/client/riven/fonts', '.nuxt/dist/client/riven/img'],
            urlPrefix: '~/_nuxt/riven/',
            release: SENTRY_RELEASE
          }),
          // 构建完后删除 source map 文件的简易插件
          {
            apply: (compiler) => {
              compiler.hooks.done.tap('CleanJsMapPlugin', () => {
                glob.sync('.nuxt/dist/**/**/*.js.map').forEach((f) => removeSync(f))
              })
            }
          }
        )
      }
    },
    /**
     * vendor.bundle.js 文件中添加一些模块，以减少应用 bundle 的体积
     */
    vendor: ['axios', 'vue-clipboard2', 'vue-awesome-swiper', 'vue2-datepicker', 'dayjs', 'vant', 'vue-lazyload']
  },
  // Default options, override if needed
  // https://www.npmjs.com/package/nuxt-precompress
  // nuxtPrecompress: {
  //   enabled: true, // Enable in production
  //   report: false, // set true to turn one console messages during module init
  //   test: /\.(js|css|html|txt|xml|svg)$/, // files to compress on build
  //   // Serving options
  //   middleware: {
  //     // You can disable middleware if you serve static files using nginx...
  //     enabled: true,
  //     // Enable if you have .gz or .br files in /static/ folder
  //     enabledStatic: true,
  //     // Priority of content-encodings, first matched with request Accept-Encoding will me served
  //     encodingsPriority: ['br', 'gzip']
  //   },

  //   // build time compression settings
  //   gzip: {
  //     // should compress to gzip?
  //     enabled: true,
  //     // compression config
  //     // https://www.npmjs.com/package/compression-webpack-plugin
  //     filename: '[path].gz[query]', // middleware will look for this filename
  //     threshold: 10240, // 对超过10kb的数据进行压缩
  //     minRatio: 0.8,
  //     compressionOptions: { level: 9 }
  //   },
  //   brotli: {
  //     // should compress to brotli?
  //     enabled: true,
  //     // compression config
  //     // https://www.npmjs.com/package/compression-webpack-plugin
  //     filename: '[path].br[query]', // middleware will look for this filename
  //     compressionOptions: { level: 11 },
  //     threshold: 10240,
  //     minRatio: 0.8
  //   }
  // },
  hooks: {
    'vue-renderer': {
      ssr: {
        templateParams(templateParams) {
          templateParams.APP = templateParams.APP.replace(/<script/gi, '<script data-polaris-consent=essential defer')
        }
      }
    }
  }
}
if (process.env.NODE_ENV !== 'development') {
  nuxtConfig.buildModules.push('nuxt-build-optimisations')
}
// 自定义环境变量， nuxt build打包时无法传入
// 客户端js代码不包含自定义环境变量，因此不能用自定义环境变量判断客户端代码
if (process.env.NODE_ENV_TEST) {
  // 需要redis的环境在[]填入ENV_ID
  if (![].includes(process.env.ENV_ID)) {
    const index = nuxtConfig.modules.indexOf('~/modules/nuxt-ssr-cache')
    if (index != -1) nuxtConfig.modules.splice(index, 1)
  }
}

module.exports = nuxtConfig
