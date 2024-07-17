<template>
  <div id="bridesmaid-lookbook" class="bridesmaid-lookbook">
    <main-app :navigation="navigation">
      <!-- TODO： 翻书dom存在加载时间，给个loading提升用户体验 -->
      <div v-show="loading" class="book-mask">
        <div class="book-mask-loading"></div>
      </div>
      <div v-show="!loading" class="book-box">
        <div id="canvas">
          <div class="magazine-viewport">
            <div class="container">
              <div class="magazine">
                <!-- Previous button -->
                <button ignore="1" class="book-btn previous" aria-label="prev">
                  <az-icon icon-class="book-btn-icon"></az-icon>
                </button>
                <!-- Next button -->
                <button ignore="1" class="book-btn next" aria-label="next">
                  <az-icon icon-class="book-btn-icon"></az-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { bridesmaidBookImages } from '@/assets/js/brideLookbook'
export default {
  name: 'BridesmaidLookbook',
  components: {
    mainApp
  },
  data() {
    return {
      images: bridesmaidBookImages,
      currentPage: 1,
      loading: true,
      viewPointId: []
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      // TODO: 只支持 US/CA/UK/AU
      if (!['US', 'CA', 'GB', 'AU'].includes(context.store.state.country)) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
      }
      context.store.commit('setJsKey', 'bridesmaid-lookbook')
      return {
        ...commonAsyncData
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return {
        ...getHeadJson(this)
      }
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
    window.setClickPoint = this.setClickPoint
  },
  methods: {
    loadApp() {
      const that = this
      const $ = window.$
      $(window).ready(function() {
        $('.book-btn.previous').css('opacity', 0)
        $('.book-btn.next').css('opacity', 0)
        // TODO: 页脚页码
        const length = that.images.length
        let left = '75%'
        const pageDom = $('<div />').css({
          position: 'absolute',
          bottom: '-50px',
          left,
          transform: 'translateX(-50%)',
          transition: 'left 0.5s ease',
          fontFamily: 'Ivy Mode Regular',
          fontSize: '13px',
          lineHeight: '18px',
          color: 'var(--color-121212)'
        })
        $('#canvas').fadeIn(1000)
        const flipbook = $('.magazine')
        if (flipbook.width() == 0 || flipbook.height() == 0) {
          setTimeout(that.loadApp, 10)
          return
        }
        const radio = (window.innerHeight - 241) / 900
        let width = (1386 * radio).toFixed()
        let height = (900 * radio).toFixed()
        if (radio > 1) {
          width = 1386
          height = 900
        }
        // TODO: 创建书本容器filpbook
        flipbook.turn({
          width,
          height,
          duration: 1500,
          acceleration: !window.isChrome(),
          gradients: true,
          autoCenter: true,
          elevation: 50,
          pages: length,
          when: {
            turning(event, page, view) {
              switch (page) {
                case 1:
                  that.currentPage = view[1]
                  left = '75%'
                  break
                case length:
                  left = '25%'
                  that.currentPage = view[0]
                  break
                default:
                  that.currentPage = view.join('-').toString()
                  left = '50%'
                  break
              }
              pageDom.text(that.currentPage + `/${length}`)
              pageDom.css('left', left)
              // TODO, 第一页无需创建点击区域
              view.forEach((pageNumber) => {
                if (![0, 1].includes(pageNumber)) {
                  const hasDom = document.querySelector(`.click-page-${pageNumber}`)
                  !hasDom && that.createClickBox($, $(this), pageNumber)
                }
              })
              // TODO: 第一页 previous 按钮隐藏 最后一页 next 按钮隐藏
              $('.book-btn.previous').css('opacity', Number(page != 1))
              $('.book-btn.next').css('opacity', Number(page != length))
              // view 打点
              that.setPageViewPoint(view)
            },
            turned(event, page, view) {
              that.loading = false
              $(this).turn('center')
              $(this).turn('peel', false)
              if (page == 1) {
                // view 打点
                that.setPageViewPoint(view)
                $(this).append(pageDom)
                pageDom.text(page + `/${length}`)
              }
              // TODO: 第一页 previous 按钮隐藏 最后一页 next 按钮隐藏
              $('.book-btn.previous').css('opacity', Number(page != 1))
              $('.book-btn.next').css('opacity', Number(page != length))
              // TODO: 设置外层容器高度
              $('.book-box').css('height', $('.magazine').height())
            },
            missing(event, pages) {
              // TODO: pages 从1开始
              for (let i = 0; i < pages.length; i++) {
                window.addPage(pages[i], $(this), that.images[pages[i] - 1].imgUrl)
              }
            }
          }
        })

        // TODO: 执行窗口自适应
        $('.magazine-viewport').zoom({
          flipbook: $('.magazine'),
          max() {
            return 2214 / $('.magazine').width()
          },
          when: {
            resize(event, scale, page, pageElement) {
              $('.book-box').css('height', $('.magazine').height())
            }
          }
        })
        // TODO: 使用键盘左右方向键翻书
        $(document).keydown(function(e) {
          switch (e.keyCode) {
            case 37:
              // left arrow
              $('.magazine').turn('previous')
              e.preventDefault()
              break
            case 39:
              // right arrow
              $('.magazine').turn('next')
              e.preventDefault()
              break
          }
        })
        // TODO: 重置窗口展示大小
        $(window)
          .resize(function() {
            window.resizeViewport()
          })
          .bind('orientationchange', function() {
            window.resizeViewport()
          })
        // 下一页点击
        $('.book-btn.next').click(function() {
          $('.magazine').turn('next')
        })
        // 上一页点击
        $('.book-btn.previous').click(function() {
          $('.magazine').turn('previous')
        })
        window.resizeViewport()
        $('.magazine').addClass('animated')
      })
    },
    init() {
      const that = this
      window.yepnope({
        test: window.Modernizr.csstransforms,
        yep: ['https://cdn-1.azazie.com/js/turn.min_none.js'],
        nope: ['https://cdn-1.azazie.com/js/turn.min_none.js'],
        both: ['https://cdn-1.azazie.com/js/zoom.min.js', 'https://cdn-1.azazie.com/js/basic.js', '/book/css/basic.css'],
        complete: that.loadApp
      })
    },
    // TODO: 创建点击区域
    createClickBox($, book, page) {
      const links = this.images[page - 1].links
      let pageClass = ''
      if (page == 4 || page == 5) {
        pageClass = 'four-area'
      }
      const childArea = []
      links.forEach((link, index) => {
        const linkUrl = link.other ? this.getSupportUrl(link.linkUrl, link.intercomUrl) : this.countryUrl(link.linkUrl)
        const attributeText = link.linkUrl ? `href=${linkUrl} onclick="setClickPoint(${page}, ${link.index})"` : ''
        childArea.push(`<a class="area-${index + 1}" ${attributeText} target="_blank"></a>`)
      })

      $(book)
        .find(`.page.p${page}`)
        .append(`<div class="click-area ${pageClass} click-page-${page}"></div>`)
      $(book)
        .find(`.page.p${page} .click-area.click-page-${page}`)
        .append(childArea.join(''))
    },
    // TODO: click打点
    setClickPoint(page, index) {
      // TODO: 订单追踪
      this.setOrderSourceFlag('bridesmaid_lookbook', true)
      let el = null
      switch (page) {
        case 1:
          el = 'frontcover'
          break
        case 4:
        case 5:
          el = 'page' + page + '_' + index
          break
        case this.images.length:
          el = 'backcover'
          break
        default:
          el = 'page' + page
      }
      this.buryPoint(this, 'event', {
        ec: 'BDlookbook',
        el,
        ea: 'click',
        dp: '/bridesmaid-lookbook'
      })
    },
    // TODO: view打点
    setPageViewPoint(view) {
      const that = this
      view.forEach((page) => {
        if (page) {
          let el = 'page' + page
          switch (page) {
            case 1:
              el = 'frontcover'
              break
            case this.images.length:
              el = 'backcover'
              break
            default:
              el = 'page' + page
          }
          // todo: 确保view只打点一次
          if (!that.checkHasView(el)) {
            that.buryPoint(this, 'event', {
              ec: 'BDlookbook',
              el,
              ea: 'view',
              dp: '/bridesmaid-lookbook'
            })
            that.viewPointId.push(el)
          }
          that.setProductViewPoint(page)
        }
      })
    },
    setProductViewPoint(page) {
      const that = this
      const products = this.images[page - 1].links
      // TODO: 第四页links首个值是占位用，打点的时候去掉
      if (page == 4) {
        products.shift()
      }
      let el = null
      // 超过一个商品才打点
      if (products.length > 1) {
        products.forEach((product) => {
          el = 'page' + page + '_' + product.index
          if (!that.checkHasView(el)) {
            that.buryPoint(this, 'event', {
              ec: 'BDlookbook',
              el,
              ea: 'view',
              dp: '/bridesmaid-lookbook'
            })
            that.viewPointId.push(el)
          }
        })
      }
    },
    checkHasView(el) {
      return this.viewPointId.includes(el)
    }
  }
}
</script>

<style lang="less" scoped>
#bridesmaid-lookbook {
  background-color: #fff;
  .book-box {
    padding: 20px 0 150px;
    position: relative;
    min-height: 600px;
  }
  @media screen and (max-width: 960px) {
    .book-box {
      height: 657px !important;
      transition: height 0.5s ease;
      padding: 20px 0;
    }
  }
  .book-mask {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 250px);
    background-color: #fff;
    .book-mask-loading {
      display: inline-block;
      width: 35px;
      height: 35px;
      background: url('~assets/images/loading.png') center center no-repeat;
      background-size: 100% 100%;
      animation: rotate 1s infinite;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  #canvas {
    .magazine-viewport {
      z-index: 0;
    }
    .book-btn {
      opacity: 0;
      border: none !important;
      font-size: 24px !important;
      background-color: #fff !important;
      transition: all 0.25s ease;
      &.previous {
        left: -82px !important;
        transform: translateY(-50%) rotate(180deg);
      }
      &.next {
        right: -82px !important;
      }
    }
  }
}
</style>
<style lang="less">
#bridesmaid-lookbook {
  #canvas {
    .click-area {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      flex-wrap: wrap;
      inset: 0;
      width: 100%;
      height: 100%;
      a {
        display: block;
        width: 100%;
        height: 100%;
        font-size: 32px;
      }
      &.four-area {
        a {
          width: 45%;
          height: 45%;
        }
      }
    }
  }
}
</style>
