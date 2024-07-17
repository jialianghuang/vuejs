<template>
  <div class="bride-look-book">
    <main-app :navigation="navigation">
      <div :class="['book-box', { 'min-height': minHeight }]">
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
import { images, createClickArea } from '@/assets/js/brideLookbook'
export default {
  name: 'NewBrandBook',
  components: {
    mainApp
  },
  data() {
    return {
      images,
      currentPage: 1,
      minHeight: true,
      // guideUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/33/20/6678401686285ae18b7e0c90dc643320.png',
      viewPointId: []
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      if (context.store.state.isNewLanguageCountry) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
      }
      context.store.commit('setJsKey', 'bride-lookbook')
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
        // todo: 页脚页码
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
        // todo: 创建书本容器filpbook
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
              // todo：给需要点击的页面加超链接, 因为前三页无需创建点击区域
              view.forEach((pageNumber) => {
                if (![0, 1, 2, 3].includes(pageNumber)) {
                  const hasDom = document.querySelector(`.click-page-${pageNumber}`)
                  !hasDom && that.createClickBox($, $(this), pageNumber)
                }
              })
              if (page == 1) {
                $('.book-btn.previous').css('opacity', 0)
              }
              if (page == length) {
                $('.book-btn.next').css('opacity', 0)
              }
            },
            turned(event, page, view) {
              // view 打点
              that.setPageViewPoint(view)
              that.minHeight = false
              $(this).turn('center')
              $(this).turn('peel', false)
              if (page == 1) {
                // $(this).turn('peel', 'br')
                $(this).append(pageDom)
                pageDom.text(page + `/${length}`)
                $('.book-btn.previous').css('opacity', 0)
                $('.book-btn.next').css('opacity', 1)
              } else {
                $('.book-btn.previous').css('opacity', 1)
                $('.book-btn.next').css('opacity', 1)
              }
              if (page == length) {
                $('.book-btn.next').css('opacity', 0)
              }
              // // 设置外层容器高度
              $('.book-box').css('height', $('.magazine').height())
            },
            missing(event, pages) {
              for (let i = 0; i < pages.length; i++) {
                window.addPage(pages[i], $(this), that.addWebpSuffix(that.images[pages[i] - 1].url))
              }
            }
          }
        })

        // todo: 执行窗口自适应
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
        // todo: 使用键盘左右方向键翻书
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
        // todo: 重置窗口展示大小
        $(window)
          .resize(function() {
            window.resizeViewport()
          })
          .bind('orientationchange', function() {
            window.resizeViewport()
          })
        // 下一页点击
        $('.book-btn.next')
          .bind($.mouseEvents.over, function() {
            // $(this).addClass('next-button-hover')
          })
          .bind($.mouseEvents.out, function() {
            // $(this).removeClass('next-button-hover')
          })
          .bind($.mouseEvents.down, function() {
            // $(this).addClass('next-button-down')
          })
          .bind($.mouseEvents.up, function() {
            // $(this).removeClass('next-button-down')
          })
          .click(function() {
            $('.magazine').turn('next')
          })
        // 上一页点击
        $('.book-btn.previous')
          .bind($.mouseEvents.over, function() {
            // $(this).addClass('previous-button-hover')
          })
          .bind($.mouseEvents.out, function() {
            // $(this).removeClass('previous-button-hover')
          })
          .bind($.mouseEvents.down, function() {
            // $(this).addClass('previous-button-down')
          })
          .bind($.mouseEvents.up, function() {
            // $(this).removeClass('previous-button-down')
          })
          .click(function() {
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
    // todo: 创建点击区域
    createClickBox($, book, page) {
      createClickArea($, book, page, this.images, this.HTTPS_HOST, this.country, this.getSupportUrl)
    },
    // todo: click打点
    setClickPoint(page, index, bol, type, number) {
      // todo: 订单追踪
      this.setOrderSourceFlag('bride_lookbook', true)
      let els = null
      if (type === 1) {
        els = 'page' + page + '_banner' + number
      } else if (type === 2) {
        els = 'page' + page + '_title'
      } else if (type === 3) {
        els = 'page' + page + '_ins'
      } else {
        els = 'page' + page + '_' + number
      }
      const el = bol ? 'page' + page : els
      this.buryPoint(this, 'event', {
        ec: 'weddingdresslookbook',
        el,
        ea: 'click',
        dp: '/wdlookbook'
      })
    },
    // todo: view打点
    setPageViewPoint(view) {
      const that = this
      view.forEach((page) => {
        if (page) {
          const el = 'page' + page
          // todo: 确保view只打点一次
          if (!that.checkHasView(el) && ![16, 17, 18, 21, 22, 25, 26, 27, 28].includes(page)) {
            that.buryPoint(this, 'event', {
              ec: 'weddingdresslookbook',
              el,
              ea: 'view',
              dp: '/wdlookbook'
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
      let el = null
      // 超过一个商品才打点
      if (products.length > 1) {
        products.forEach((product, index) => {
          if (product.type === 1) {
            el = 'page' + page + '_banner' + product.number
          } else if (product.type === 2) {
            el = 'page' + page + '_title'
          } else if (product.type === 3) {
            el = 'page' + page + '_ins'
          } else {
            el = 'page' + page + '_' + product.number
          }
          if (!that.checkHasView(el)) {
            that.buryPoint(this, 'event', {
              ec: 'weddingdresslookbook',
              el,
              ea: 'view',
              dp: '/wdlookbook'
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
.bride-look-book {
  background-color: #fff;
  .book-box {
    padding: 50px 0 150px;
    position: relative;
    min-height: 600px;
    overflow: hidden;
  }
  @media screen and (max-width: 960px) {
    .book-box {
      height: 657px !important;
      transition: height 0.5s ease;
      padding: 50px 0;
    }
  }
}
/deep/ #sms-code {
  display: none;
}
</style>

<style lang="less">
.magazine-viewport {
  z-index: 0;
}
.bride-look-book {
  #canvas .magazine {
    .book-btn {
      opacity: 0;
      border: none !important;
      font-size: 24px !important;
      background-color: #fff !important;
      &.previous {
        left: -82px !important;
        transition: all 0.25s ease;
        transform: translateY(-50%) rotate(180deg);
        &:hover {
          background-color: #fff !important;
        }
      }
      &.next {
        right: -82px !important;
        &:hover {
          background-color: #fff !important;
        }
      }
    }
    .click-area {
      display: flex;
      position: absolute;
      flex-wrap: wrap;
      inset: 0;
      width: calc(100% - 6%);
      height: calc(100% - 6%);
      margin: 15px;
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 32px;
      }
    }
    .one-area {
      &.click-page-19 {
        .area-1 {
          width: 80%;
          height: 15%;
          margin-top: 13%;
          margin-left: 10%;
        }
      }
      &.click-page-24 {
        .area-1 {
          width: 85%;
          height: 20%;
          position: absolute;
          bottom: 0;
        }
      }
    }
    .two-area {
      &.click-page-9 {
        justify-content: space-between;
        margin-top: 8%;
        .area-1 {
          width: 44.5%;
          height: 47.5%;
          margin-left: 3%;
        }
        .area-2 {
          width: 44%;
          height: 47.5%;
          margin-right: 2%;
        }
      }
      &.click-page-16 {
        .area-1 {
          width: 80%;
          height: 20%;
          margin-left: 10%;
          margin-top: 10%;
        }
        .area-2 {
          height: 65%;
          margin-top: 12%;
        }
      }
      &.click-page-18 {
        .area-1 {
          width: 72%;
          height: 31%;
          margin-top: 12%;
          margin-left: 3%;
        }
        .area-2 {
          width: 72%;
          height: 39%;
          margin-top: 8%;
          margin-left: 4%;
        }
      }
      &.click-page-27 {
        margin-top: 17%;
        margin-left: 10%;
        .area-1 {
          width: 47%;
          height: 90%;
        }
        .area-2 {
          width: 44%;
          height: 90%;
          margin-left: 1%;
        }
      }
    }
    .three-area {
      &.click-page-13 {
        justify-content: space-between;
        .area-1 {
          width: 44%;
          height: 47%;
          margin-top: 3%;
          margin-left: 5.5%;
        }
        .area-2 {
          width: 44%;
          height: 47%;
          margin-top: 3%;
          margin-right: 2.5%;
        }
        .area-3 {
          height: 47.5%;
          margin: 3% 2% 0 5%;
        }
      }
    }
    .four-area {
      width: calc(100% - 20%);
      height: calc(100% - 15%);
      margin: 10% auto;
      justify-content: space-between;
      a {
        width: 49.5%;
        height: 46%;
      }
      &.click-page-5 {
        justify-content: center;
        margin-top: 25%;
        a {
          width: 40%;
          height: 40%;
          &.area-3 {
            margin-bottom: 14%;
          }
        }
      }
      &.click-page-17 {
        justify-content: flex-start;
        height: calc(100% - 10.5%);
        width: calc(100% - 28%);
        margin-top: 10.5%;
        margin-left: 28%;
        .area-1 {
          width: 44%;
          height: 41%;
          margin-left: -0.5%;
        }
        .area-2 {
          width: 43%;
          height: 27%;
          margin-top: 12%;
          margin-left: 4.5%;
        }
        .area-3 {
          width: 41%;
          height: 20%;
          margin-top: 24%;
        }
        .area-4 {
          width: 46%;
          height: 43%;
          margin-left: 4%;
          margin-top: 5%;
        }
      }
      &.click-page-21 {
        width: calc(100% - 20%);
        margin: 15% 0 0 12%;
        height: calc(100% - 15%);
        .area-1 {
          width: 32%;
          height: 32%;
          margin: 0 15px 0 10px;
        }
        .area-2,
        .area-3 {
          width: 30%;
          height: 32%;
        }
        .area-3 {
          margin-right: -1.5%;
        }
        .area-4 {
          margin-left: 40%;
          margin-top: 21%;
          width: 75%;
          margin-right: -2%;
          height: 56%;
        }
      }
      &.click-page-28 {
        justify-content: flex-start;
        .area-1 {
          height: 90%;
          width: 42%;
        }
        .area-2 {
          height: 90%;
          width: 30%;
          margin-left: 1%;
        }
        .area-3 {
          height: 90%;
          width: 22%;
          margin-left: 1%;
        }
        .area-4 {
          width: 42%;
          height: 10%;
          margin-left: 29%;
          margin-top: 10%;
        }
      }
    }
    .five-area {
      // 第七页
      &.click-page-7 {
        justify-content: flex-end;
        align-items: flex-end;
        a {
          width: 13%;
          height: 11%;
          margin-bottom: 5%;
        }
      }
      &.click-page-25 {
        margin: 6.5% 0 7% 6.5%;
        .area-1 {
          width: 43%;
          height: 49%;
        }
        .area-2 {
          width: 45%;
          height: 25%;
          margin-top: 22%;
          margin-left: 5%;
        }
        .area-3 {
          width: 43%;
          height: 30%;
          margin-bottom: 20%;
        }
        .area-4 {
          width: 23%;
          height: 47%;
          position: absolute;
          bottom: 4%;
          right: 29%;
        }
        .area-5 {
          width: 20%;
          height: 47%;
          right: 8%;
          position: absolute;
          bottom: 4%;
        }
      }
    }
    .six-area {
      width: calc(100% - 30px);
      height: calc(100% - 30px);
      &.click-page-14 {
        .area-1 {
          width: 43%;
          height: 45%;
          position: absolute;
          bottom: 12px;
          left: 11px;
        }
        .area-2,
        .area-3,
        .area-4,
        .area-5,
        .area-6 {
          width: 20%;
          height: 7.5%;
          position: absolute;
          right: 3%;
          top: 54%;
        }
        .area-3 {
          top: 63%;
        }
        .area-4 {
          top: 72%;
        }
        .area-5 {
          top: 81%;
        }
        .area-6 {
          top: 90%;
        }
      }
    }
    .seven-area {
      &.click-page-10 {
        .area-1 {
          width: 40%;
          height: 43%;
          margin: 7% 50% 6% 7%;
        }
        .area-2 {
          width: 40%;
          height: 43%;
          margin-left: 7%;
          margin-bottom: 4%;
        }
        .area-3 {
          width: 25%;
          height: 5%;
          position: absolute;
          top: 66%;
          right: 20%;
        }
        .area-4 {
          width: 25%;
          height: 5%;
          position: absolute;
          top: 72.5%;
          right: 20%;
        }
        .area-5 {
          width: 25%;
          height: 5%;
          position: absolute;
          top: 79%;
          right: 20%;
        }
        .area-6 {
          width: 25%;
          height: 5%;
          position: absolute;
          top: 85.5%;
          right: 20%;
        }
        .area-7 {
          width: 25%;
          height: 5%;
          position: absolute;
          top: 92%;
          right: 20%;
        }
      }
      &.click-page-22 {
        .area-1 {
          width: 39%;
          height: 32%;
          margin-top: 10%;
          margin-left: 7%;
        }
        .area-2 {
          width: 37%;
          height: 30%;
          margin-top: 11%;
          margin-left: 4%;
        }
        .area-3 {
          width: 55.5%;
          height: 52%;
          margin-top: 15%;
          margin-left: -2.5%;
        }
        .area-4 {
          position: absolute;
          right: 23%;
          bottom: 23%;
          width: 20%;
          height: 15.5%;
        }
        .area-5 {
          position: absolute;
          right: 0.5%;
          bottom: 23%;
          width: 20%;
          height: 15.5%;
        }
        .area-6 {
          position: absolute;
          right: 23%;
          bottom: 5%;
          width: 20%;
          height: 15.5%;
        }
        .area-7 {
          position: absolute;
          right: 0.5%;
          bottom: 5%;
          width: 20%;
          height: 15.5%;
        }
      }
    }
    .eight-area {
      &.click-page-26 {
        margin-left: 6.5%;
        margin-top: 6.5%;
        .area-1 {
          width: 22.5%;
          height: 27%;
        }
        .area-2 {
          width: 57%;
          height: 20%;
          margin-left: 4%;
          margin-top: 5%;
        }
        .area-3 {
          position: absolute;
          width: 64%;
          bottom: 49%;
          height: 17%;
          left: 2%;
        }
        .area-4 {
          position: absolute;
          width: 24%;
          height: 25.5%;
          right: 7%;
          top: 29.5%;
        }
        .area-5 {
          position: absolute;
          width: 40%;
          height: 7%;
          top: 59%;
          left: 2%;
        }
        .area-6 {
          position: absolute;
          left: 14%;
          width: 23%;
          bottom: -1px;
          height: 31%;
        }
        .area-7 {
          position: absolute;
          width: 23%;
          height: 31%;
          bottom: 0;
          left: 38%;
        }
        .area-8 {
          position: absolute;
          right: 10%;
          bottom: 0;
          width: 28%;
          height: 31%;
        }
      }
    }
  }
}
</style>
