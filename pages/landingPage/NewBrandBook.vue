<template>
  <div class="new-brand-look-book">
    <svg style="position: absolute; width: 0px; height: 0px; overflow: hidden;">
      <symbol id="book-btn-icon" viewBox="-4 -4 30 52">
        <path
          d="M1.15 42.05a2.62 2.62 0 0 1 0-3.45L16.17 22 1.15 5.4a2.62 2.62 0 0 1 0-3.45 2.06 2.06 0 0 1 3.12 0l16.58 18.32c.87.96.87 2.5 0 3.45L4.27 42.05c-.43.48-1 .72-1.56.72a2.1 2.1 0 0 1-1.56-.72Z"
          fill="none"
          stroke="var(--color-121212)"
          stroke-width="1"
        ></path>
        <path
          d="M1.15 42.05a2.62 2.62 0 0 1 0-3.45L16.17 22 1.15 5.4a2.62 2.62 0 0 1 0-3.45 2.06 2.06 0 0 1 3.12 0l16.58 18.32c.87.96.87 2.5 0 3.45L4.27 42.05c-.43.48-1 .72-1.56.72a2.1 2.1 0 0 1-1.56-.72Z"
          fill="#fff"
        ></path>
      </symbol>
    </svg>
    <main-app :navigation="navigation">
      <div :class="['book-box', { 'min-height': minHeight }]">
        <div id="canvas">
          <div class="magazine-viewport">
            <div class="container">
              <div class="magazine">
                <!-- Previous button -->
                <!-- <button @click="flipbook(0)" ignore="1" class="book-btn previous">
                  <az-icon icon-class="book-btn-icon"></az-icon>
                </button> -->
                <!-- Next button -->
                <!-- <button @click="flipbook(1)" ignore="1" class="book-btn next">
                  <az-icon icon-class="book-btn-icon"></az-icon>
                </button> -->
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
import { newBrandBookImages } from '@/assets/js/brideLookbook'
export default {
  name: 'NewBrandBook',
  components: {
    mainApp
  },
  data() {
    return {
      images: newBrandBookImages,
      currentPage: 1,
      minHeight: true,
      guideUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/33/20/6678401686285ae18b7e0c90dc643320.png',
      viewPointId: []
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      if (context.store.state.isNewLanguageCountry) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
      }
      context.store.commit('setJsKey', 'look-book')
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
        $('.book-btn.next').css('opacity', 1)
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
        const radio = (window.innerHeight - 180) / 900
        let width = (1258 * radio).toFixed()
        let height = (900 * radio).toFixed()
        if (radio > 1) {
          width = 1258
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
              localStorage.setItem('showGuide', false)
              $('.guide-logo').css('display', 'none')
              switch (page) {
                case 1:
                  that.currentPage = view[1]
                  left = '75%'
                  break
                case 18:
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
            },
            turned(event, page, view) {
              that.setPageViewPoint(view)
              that.minHeight = false
              $(this).turn('center')
              // todo：给需要点击的页面加超链接
              view.forEach((pageNumber) => {
                if (pageNumber !== 0) {
                  const hasDom = document.querySelector(`.click-part${pageNumber}`)
                  !hasDom && that.createClickBox($, $(this), pageNumber)
                }
              })
              if (page == 1) {
                $(this).turn('peel', 'br')
                // 指引图标
                if (!localStorage.getItem('showGuide')) {
                  const dom = $('<img />', {
                    class: 'guide-logo',
                    src: that.guideUrl
                  }).css({
                    position: 'absolute',
                    bottom: '15px',
                    left: 'calc(100% + 10px)',
                    width: '185px'
                  })
                  $(this).append(dom)
                }
                // todo: 页脚页面顶出来
                $(this).append(pageDom)
                pageDom.text(page + `/${length}`)
                $('.book-btn.previous').css('opacity', 0)
                $('.book-btn.next').css('opacity', 1)
              } else {
                $('.book-btn.previous').css({
                  // left: '-100px',
                  opacity: 1
                })
              }
              if (page === length) {
                $('.book-btn.next').css('opacity', 0)
              } else {
                $('.book-btn.next').css('opacity', 1)
              }
              // // 设置外层容器高度
              $('.book-box').css('height', $('.magazine').height())
            },
            missing(event, pages) {
              for (let i = 0; i < pages.length; i++) {
                window.addPage(pages[i], $(this), that.images[pages[i] - 1].url)
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
        that.flipbook(0)
        that.flipbook(1)
        window.resizeViewport()
        $('.magazine').addClass('animated')
      })
    },
    init() {
      const that = this
      window.yepnope({
        test: window.Modernizr.csstransforms,
        yep: ['https://cdn-1.azazie.com/js/turn.min.js'],
        nope: ['https://cdn-1.azazie.com/js/turn.min.js'],
        both: ['https://cdn-1.azazie.com/js/zoom.min.js', 'https://cdn-1.azazie.com/js/basic.js', '/book/css/basic.css'],
        complete: that.loadApp
      })
    },
    // todo: 创建点击区域
    createClickBox($, book, page) {
      const no = [1, 2, 6, 8, 11, 14, 17, 18]
      const single = [4, 5, 13]
      const double = [3, 7, 9, 10, 12, 15, 16]
      const links = this.images[page - 1].links
      const that = this
      if (links.length > 0 && !no.includes(page)) {
        links.forEach((item) => {
          item.url = that.countryUrl(item.url)
        })
        if (single.includes(page)) {
          console.log('single:', page)
          const singlePart = `
            <div class="click-part${page} single">
              <a href="${this.HTTPS_HOST + links[0].url}" onclick="setClickPoint('${links[0].goodsId}', '${page}', '1')" target="_blank">
                <span class="hide">single - ${page}</span>
              </a>
            </div>      
          `
          $(book)
            .find(`.page.p${page}`)
            .append(singlePart)
        } else if (double.includes(page)) {
          console.log('double:', page)
          const doublePart = `
            <div class="click-part${page} double">
              <a href="${this.HTTPS_HOST + links[0].url}" onclick="setClickPoint('${links[0].goodsId}', '${page}', '1')" target="_blank">
                <span class="hide">left - ${page}</span>
              </a>
              <a href="${this.HTTPS_HOST + links[1].url}" onclick="setClickPoint('${links[1].goodsId}', '${page}', '2')" target="_blank">
                <span class="hide">right - ${page}</span>
              </a>
            </div> 
          `
          $(book)
            .find(`.page.p${page}`)
            .append(doublePart)
        }
      }
    },
    flipbook(type) {
      const $ = window.$
      if (type === 0) {
        $('.book-btn.next')
          .bind($.mouseEvents.over, function() {
            $(this).addClass('next-button-hover')
          })
          .bind($.mouseEvents.out, function() {
            $(this).removeClass('next-button-hover')
          })
          .bind($.mouseEvents.down, function() {
            $(this).addClass('next-button-down')
          })
          .bind($.mouseEvents.up, function() {
            $(this).removeClass('next-button-down')
          })
          .click(function() {
            $('.magazine').turn('next')
          })
      }
      if (type === 1) {
        $('.book-btn.previous')
          .bind($.mouseEvents.over, function() {
            $(this).addClass('previous-button-hover')
          })
          .bind($.mouseEvents.out, function() {
            $(this).removeClass('previous-button-hover')
          })
          .bind($.mouseEvents.down, function() {
            $(this).addClass('previous-button-down')
          })
          .bind($.mouseEvents.up, function() {
            $(this).removeClass('previous-button-down')
          })
          .click(function() {
            $('.magazine').turn('previous')
          })
      }
    },
    // todo: click打点
    setClickPoint(goodsId, page, index) {
      // todo: 订单追踪
      this.setOrderSourceFlag('pnina_tornai_lookbook', true)
      this.buryPoint(this, 'event', {
        ec: 'pninatornailookbook',
        el: 'page' + page + '_' + index,
        ea: 'click',
        dp: '/lookbook',
        msg: JSON.stringify({
          index,
          goodsId
        })
      })
    },
    // todo: view打点
    setPageViewPoint(view) {
      const that = this
      view.forEach((page) => {
        if (page !== 0) {
          let el = null
          switch (page) {
            case 1: // 第一页
              el = 'frontcover'
              break
            case 18: // 最后一页
              el = 'backcover'
              break
            default:
              // 中间页
              el = 'page' + page
              break
          }
          // todo: 确保view只打点一次
          if (!that.checkHasView(el)) {
            that.buryPoint(this, 'event', {
              ec: 'pninatornailookbook',
              el,
              ea: 'view',
              dp: '/lookbook'
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
      if (products.length) {
        products.forEach((product, index) => {
          el = 'page' + page + '_' + (index + 1)
          if (!that.checkHasView(el)) {
            that.buryPoint(this, 'event', {
              ec: 'pninatornailookbook',
              el,
              ea: 'view',
              dp: '/lookbook',
              msg: JSON.stringify({
                index: index + 1,
                goodsId: product.goodsId
              })
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
.magazine-viewport {
  z-index: 0;
}
.new-brand-look-book {
  background-color: #fff;
  .book-box {
    padding: 50px 0 150px;
    position: relative;
    min-height: 600px;
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
