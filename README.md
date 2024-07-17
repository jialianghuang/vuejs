# riven-az-pc

> My well-made Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3001
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# 目标功能
- [x] 导航栏 -- 
- [x] 搜索 -- 
- [x] 商品详情 (
        商品图和视频、
        商品信息(
            商品描述
            What is a pannier?
            样衣 try before you buy
        )、
        Color、
        Size、
        Estimated Delivery time、
        ADD TO BAG、
        PRODUCT DETAILS、
        Customer Questions & Answers、
        DESCRIPTION & TIPS、
        SHIPPING & RETURNS、
        Before You Buy、
        Size Guide、
        头纱 Size Guide、
        SHARE WITH
    ) -- 
- [x] CUSTOMER PHOTOS -- 
- [x] YOU MAY ALSO LIKE || MOST POPULAR -- 
- [x] RECENTLY VIEWED -- 
- [x] CUSTOMER QUESTIONS & ANSWERS -- 
- [x] CUSTOMER REVIEWS-- 


## 文件夹介绍
- store： 此文件夹包含了Vuex Store文件。Nuxtjs框架实现了Vuex Store相关功能。[更多信息](https://nuxtjs.org/guide/vuex-store)

- static: 此文件夹包含了静态文件，此文件夹的文件会被映射到网站的根目录 `/`。[更多信息](https://nuxtjs.org/guide/assets#static)

- plugins：在运行Vue.js应用程序之前执行js插件。这在您需要使用自己的库或第三方模块时特别有用。[更多信息](https://nuxtjs.org/guide/plugins)

- pages: 此文件夹包含所有的视图和路由，Nuxtjs框架会读取此文件夹内所有的`*.vue`文件，然后生成对应的路由。 [更多信息](https://nuxtjs.org/guide/routing)

- middleware: 应用的中间件。中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。[更多信息](https://nuxtjs.org/guide/routing#middleware)

- layouts: 应用的布局组件。[更多信息](https://nuxtjs.org/guide/views#layouts)

- assets：如果静态资源文件需要 Webpack 做构建编译处理，可以放到 assets 目录。[更多信息](https://nuxtjs.org/guide/assets#webpacked)

- components: 组件目录 components 用于组织应用的 Vue.js 组件。Nuxt.js 不会扩展增强该目录下 Vue.js 组件，即这些组件不会像页面组件那样有 asyncData 方法的特性


# 项目布局
```
├── api                                // 数据交互统一调配
│   ├── getData.js                          // 获取数据的统一调配文件，对接口进行统一管理
│   └── tempdata                            // 开发阶段的临时数据
├── assets
│   ├── fonts
│   ├── images
│   └── less
├── middleware                                                                  
├── dist                                    // 上线项目文件，放在服务器即可正常访问
├── components                              // 组件
│   ├── az-ui                              // 公共UI组件
│   │   ├── alertTip.vue                    // 弹出框组件
│   │   ├── wxShare.vue                     // 分享组件
│   │   ├── loading.vue                     // 页面初始化加载数据的动画组件
│   │   ├── StyleUploadDialog
│   │   └── ratingStar.vue                  // 评论的五颗星组件
│   │── common                             // 公共功能组件
│   │   ├── header.vue 
│   │   ├── footer.vue                      
│   │   ├── topBar                               // 通知栏
│   │   ├── Main                                 // 页面主体
│   │   ├── SlideMenu                            // 侧边栏
│   │   ├── MostPopular                          
│   │   └── RecentlyViewed
│   └── product 
│       ├── colorSash
│       │   ├── ClearanceContainer       
│       │   ├── ColorBoxPanel
│       │   ├── DressSizeContainer
│       │   ├── NewCatContainer
│       │   ├── SampleContainer
│       │   ├── SashColorBoxPanel
│       │   └── SizeOnlyContainer
│       ├── productInfoBlock
│       │    ├── ProductDetailBlock         // PRODUCT DETAILS 商品信息
│       │    ├── ProductQaBlock             // Customer Questions & Answers 
│       │    ├── ProductShippingInfoBlock   // SHIPPING & RETURNS
│       │    ├── SampleEntranceBlock        // Before You Buy
│       │    ├── SizeGuideBlock             // Size Guide
│       │    └── VeilSizeBlock              // 头纱 Size Guide
│       ├── Breadcrumb
│       ├── ColorSelect             // 选择颜色
│       ├── SizeChart               // 选择size
│       ├── ComingSoonDescription 
│       ├── CustomerPhoto           // 用户评论图片
│       ├── CustomerPhotoFullScreen // 用户评论大图
│       ├── DeliveryDetail          // 配送时间
│       ├── DeliveryPage            // 配送时间 国家选择器
│       ├── DetailBuyPoint 
│       ├── Explore
│       ├── GoodsSwiper            // you may also like 等模块的组件
│       ├── GoodsTile  
│       ├── OrderBtn               // ADD TO BAG下单按钮
│       ├── ProductDescription     // 商品描述
│       ├── ProductInfoPart        // 商品详情模块
│       ├── ProductThumb           // 商品轮播图
│       ├── productktlaVideo       // 视频
│       ├── Review                 // 评论
│       ├── SampleProductLink      // 特殊按钮链跳转
│       ├── Share                  // SHARE WITH 分享
│       ├── Shipping               // shipping
│       ├── StylesNotification     // style notification
│       └── TryBeforeYouBuy        // 样衣 try before you buy
├── pages
│   └── products                  // 商品详情页
├── plugins                                 // 引用的插件
│   └── utils
│       ├── mUtils.js                         // 常用的js方法
│       └── mixin.js                         // 组件混合(包括：指令-下拉加载更多，处理图片地址)                                 
├── static  
├── store                                   // vuex的状态管理
│   └── proudctInfo.js                      //  
├── babelrc                                 // Babel 转码配置
├── eslintrc                                // ESLint 配置
├── gitignore                               // （配置）需被 Git 忽略的文件（夹）
├── app.html                                  // 入口html文件
├── jest.config.js                             //单元测试入口                                
├── nuxt.config.js                             //nuxt 总配置    
├── package.json                            //依赖文件入口        
└──service-worker.js                
```
#模块分析

##公共


# sentry相关
## wiki文档
https://wiki.gaoyaya.com/pages/viewpage.action?pageId=43287138

## sentry参考文档
https://docs.sentry.io/platforms/javascript/guides/vue/configuration/


# node-qrcode
## 二维码生成器
https://www.npmjs.com/package/qrcode

# 网站定义cookie
lucky-wheel-show-first: 大转盘是否第一次展示过

# 网站定义localStorage key
new_user_step: AZWEB-21824 新客弹窗操作进度
new_user_close： AZWEB-21824 关闭新客弹窗



