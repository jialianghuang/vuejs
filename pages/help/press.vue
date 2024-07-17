<template>
  <div class="press">
    <main-app :navigation="navigation">
      <h1 style="display:none">{{ nl('page_help_menu_press') }}</h1>
      <div class="press-main clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content">
          <div class="tabs">
            <span
              v-for="(item, tabIndex) in tabs"
              :key="tabIndex"
              :class="{ checked: currentTabIndex == tabIndex }"
              @click="changeTab(tabIndex)"
              >{{ item.name }}</span
            >
          </div>
          <div v-show="currentTabIndex == 0" class="block aaron">
            <div class="item-aisle">
              <div ref="aisleSwiper" v-swiper:aisleSwiper="swiperOption" class="swiper-container">
                <div class="swiper-wrapper">
                  <div v-for="(item, index) in aisle.list" :key="index" class="swiper-slide item-block">
                    <div @click="openDownloadDialog(item.pdfUrl)" class="img">
                      <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.title" />
                      <div class="download_btn"></div>
                    </div>
                    <div v-html="item.title" class="txt"></div>
                  </div>
                </div>
              </div>
              <az-icon v-show="slideIndex !== 0" icon-class="book-btn-icon" class="aisle-swiper-button-prev"></az-icon>
              <az-icon v-show="slideIndex !== aisle.list.length - 1" icon-class="book-btn-icon" class="aisle-swiper-button-next"></az-icon>
            </div>
          </div>
          <div v-show="currentTabIndex == 1" class="block video">
            <div class="item-content">
              <template v-for="(item, index) in video.list">
                <div :key="index" class="item-block">
                  <div class="img">
                    <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.title" />
                    <div @click="showPop(item, index, 'video')" class="video_btn"></div>
                  </div>
                  <div v-html="item.title" class="txt"></div>
                </div>
              </template>
              <div class="none"></div>
              <div class="none"></div>
            </div>
          </div>

          <div v-show="currentTabIndex == 2" class="block press">
            <p v-html="press.text" class="desc"></p>
            <div class="item-content">
              <template v-for="(item, key, index) in press.list">
                <div :key="index" class="item-block">
                  <div @click="showPop(item, index, 'press')" class="img">
                    <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
                  </div>
                </div>
              </template>
              <div class="none"></div>
              <div class="none"></div>
              <div class="none"></div>
            </div>
          </div>

          <div v-show="currentTabIndex == 3" class="block magazine">
            <div class="item-content">
              <div v-for="(item, index) in magazine.list" :key="index" class="item-block">
                <div @click="showPop(item, index, 'magazine')" class="img">
                  <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.title" />
                </div>
                <div v-html="item.title" class="txt"></div>
              </div>
              <div class="none"></div>
              <div class="none"></div>
            </div>
          </div>

          <div v-show="currentTabIndex == 4" class="block blog">
            <p v-html="blog.text" class="desc"></p>
            <div class="item-content">
              <template v-for="(item, index) in blog.list">
                <div :key="index" v-if="Math.ceil((index + 1) / 6) == pageInfo.page" class="item-block">
                  <div @click="showPop(item, index, 'blog')" class="img">
                    <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.title" />
                  </div>
                  <div v-html="item.title" class="txt"></div>
                </div>
              </template>
              <div class="none"></div>
              <div class="none"></div>
            </div>
            <div class="press-pager">
              <az-pager :totalPage="pageInfo.totalPage" :page="pageInfo.page * 1" @pageChange="pageChange"></az-pager>
            </div>
          </div>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>

    <!-- 弹窗 -->
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog" v-if="popType && popType == 'video'">
      <div class="press-pannier video-popup">
        <p>{{ popData.title }}</p>
        <div @click="closeDialog()" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <span @click="showShare()" v-show="!showSharePop" class="press_video_share_button"></span>
        <a @click="getInfo('prev')" v-if="!firstData" href="javascript:void(0)" class="pop-prev-arraw">
          <az-icon class="arraw-icon" icon-class="icon-xxy_arrow_left_l" />
        </a>
        <div class="popup-content">
          <img :src="replaceImgCdnUrl(popData.imgUrl)" :alt="popData.title" style="display: none" />
          <video
            id="pannierVideo"
            :poster="replaceImgCdnUrl(popData.imgUrl)"
            v-if="showVideo"
            autoplay
            preload="auto"
            width="680"
            height="408"
            data-setup="{}"
            controls=""
            loop
          >
            <source :src="popData.videoUrl" type="video/mp4" />
          </video>
        </div>
        <a @click="getInfo('next')" v-if="!lastData" href="javascript:void(0)" class="pop-next-arraw">
          <az-icon class="arraw-icon" icon-class="icon-xxy_arrow_right_l" />
        </a>
        <div v-if="showSharePop" class="pop-share">
          <div class="pop-share-content">
            <div class="press_video_share_desc">{{ nl('page_common_share') }}:</div>
            <div class="press_video_share_url">https://www.azazie.com/press</div>
            <div class="press_video_share_link">
              <gallery-share :shareList="shareListInfo" :isPress="true"></gallery-share>
            </div>
            <div @click="closeShare()" class="press_video_share_close">CLOSE</div>
          </div>
        </div>
      </div>
    </az-popup>
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog" v-if="popType && ['blog', 'magazine'].includes(popType)">
      <div :class="[{ 'magazine-popup': popType == 'magazine' }, { 'blog-popup': popType == 'blog' }]" class="press-pannier">
        <div @click="closeDialog()" class="close-popup">
          <az-icon :style="{ fill: '#666' }" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <a @click="getInfo('prev')" v-if="!firstData" href="javascript:void(0)" class="pop-prev-arraw">
          <az-icon class="arraw-icon" icon-class="icon-xxy_arrow_left_l" />
        </a>
        <div class="popup-content">
          <div class="img">
            <img :src="replaceImgCdnUrl(popData.imgUrl)" :alt="popData.imgAlt" />
          </div>
        </div>
        <a @click="getInfo('next')" v-if="!lastData" href="javascript:void(0)" class="pop-next-arraw">
          <az-icon class="arraw-icon" icon-class="icon-xxy_arrow_right_l" />
        </a>
      </div>
    </az-popup>
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog" v-if="popType && ['press'].includes(popType)">
      <div class="press-pannier press-popup">
        <div @click="closeDialog()" class="close-popup">
          <az-icon :style="{ fill: '#666' }" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <a @click="getInfo('prev')" v-if="!firstData" href="javascript:void(0)" class="pop-prev-arraw">
          <az-icon class="arraw-icon" icon-class="icon-xxy_arrow_left_l" />
        </a>
        <div class="popup-content clearfix">
          <div class="left">
            <a v-if="popData.linkUrl" :href="popData.linkUrl" target="_blank">
              <img :src="replaceImgCdnUrl(popData.imgUrl)" :class="`press-img-${popData.id}`" alt="press" class="press-img" />
            </a>
            <img v-else :src="replaceImgCdnUrl(popData.imgUrl)" :class="`press-img-${popData.id}`" alt="press" class="press-img" />
          </div>
          <div class="right">
            <div class="right-content">
              <a v-if="popData.parentImgLink" :href="popData.parentImgLink" target="_blank">
                <img :src="replaceImgCdnUrl(popData.parentImgUrl)" :alt="popData.title" />
              </a>
              <img v-else :src="replaceImgCdnUrl(popData.parentImgUrl)" :alt="popData.title" />
              <div v-html="popData.text" class="note"></div>
            </div>
          </div>
          <div v-if="popData.bottomText && popData.bottomText.indexOf('Image 1 of 1') == -1" class="bottom-txt">
            {{ popData.bottomText }}
          </div>
        </div>
        <a @click="getInfo('next')" v-if="!lastData" href="javascript:void(0)" class="pop-next-arraw">
          <az-icon class="arraw-icon" icon-class="icon-xxy_arrow_right_l" />
        </a>
      </div>
    </az-popup>
    <az-popup-layer v-if="downloadDialog" :zIndex="12" @close="closeAlert()" :width="'344px'" height="auto">
      <div class="dialog-content">
        <div class="dialog-title">{{ nl('page_common_download_aisle') }}</div>
        <div class="dialog-footer">
          <az-button @click="closeAlert('yes')" class="btn btn-default">
            {{ nl('page_common_yes') }}
          </az-button>
          <az-button @click="closeAlert()" class="btn btn-default bgf">
            {{ nl('page_common_no') }}
          </az-button>
        </div>
      </div>
    </az-popup-layer>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import HelpMenu from '@/components/common/HelpMenu'
import azPopup from '@/components/az-ui/Popup/AzPopup'
import GalleryShare from '@/components/styleGallery/GalleryShare'
import azPager from '@/components/az-ui/Pager/AzPager'
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
let vm = null
export default {
  name: 'Press',
  components: {
    MainApp,
    backToTop,
    HelpMenu,
    azPopup,
    GalleryShare,
    azPager,
    AzPopupLayer,
    AzButton
  },
  data() {
    return {
      currentMenuTitle: '',
      showSharePop: false,
      popType: '',
      popData: {},
      popDataIndex: 0,
      popMagazineDataIndex: 0,
      popPressDataIndex: 0,
      currentTabIndex: 0,
      downloadDialog: false,
      pageInfo: {
        totalPage: 6,
        page: 1
      },
      showVideo: true,
      slideIndex: 0,
      swiperOption: {
        navigation: {
          nextEl: '.aisle-swiper-button-next',
          prevEl: '.aisle-swiper-button-prev'
        },
        on: {
          // 轮播内容滑动修改监听
          slideChange() {
            // 获取到当前位置索引
            vm.slideIndex = this.realIndex
          }
        }
      }
    }
  },
  computed: {
    tabs() {
      return [
        { name: this.aisle.title },
        { name: this.video.title },
        { name: this.press.title },
        { name: this.magazine.title },
        { name: this.blog.title }
      ]
    },
    shareListInfo() {
      const shareList = [
        {
          key: 'facebook'
        },
        {
          key: 'pinterest'
        },
        {
          key: 'twitter'
        },
        {
          key: 'email'
        }
        // {
        //   key: 'google'
        // }
      ]
      let symbol = '?'
      if (this.page_url.includes(symbol)) {
        symbol = '&'
      }
      const shareUrl = encodeURIComponent(this.HTTPS_HOST + this.countryUrl('/press'))
      const shareImg = 'https://www.azazie.com/themes/azazie/images/video/press_share_link_img_20180327.jpg'
      const contentDesc =
        'Azazie is a leading fashion bridal party online store. The exclusive bridesmaid dresses, bridal gowns and more can be explored in this one stop boutique.'
      const twitterText = 'I%27m in love with Press/Azazie.&via=iheartazazie'
      shareList.forEach((item) => {
        item.dialog_height = 320
        item.dialog_width = 700
        let url = ''
        if (item.key == 'facebook') {
          url = 'http://www.facebook.com/sharer/sharer.php?u=' + shareUrl
        }
        if (item.key == 'pinterest') {
          url =
            'http://pinterest.com/pin/create/button/?description=' +
            contentDesc +
            '&media=' +
            shareImg +
            '&is_video=false' +
            '&url=' +
            shareUrl
        }
        if (item.key == 'twitter') {
          url = 'http://twitter.com/share?text=' + twitterText + '&url=' + shareUrl
        }
        if (item.key == 'email') {
          url = 'mailto:?' + 'body=' + shareUrl + '. ' + contentDesc + 'subject=Look what I found at Press | Azazie'
        }
        if (item.key == 'google') {
          item.dialog_height = 600
          item.dialog_width = 600
          url = 'https://plus.google.com/share?hl=en' + '&url=' + shareUrl
        }
        item.url = url
      })
      return shareList
    },
    firstData() {
      if (this.popType && this.popType == 'magazine') {
        return this.popMagazineDataIndex == 0
      } else if (this.popType && this.popType == 'press') {
        return this.popPressDataIndex == 0
      } else {
        return this.popDataIndex == 0
      }
    },
    lastData() {
      if (this.popType && this.popType == 'magazine') {
        if (
          this.magazine &&
          this.magazine.list &&
          this.magazine.list[this.popDataIndex] &&
          this.magazine.list[this.popDataIndex].imgPopList
        ) {
          return this.popMagazineDataIndex == this.magazine.list[this.popDataIndex].imgPopList.length - 1
        }
      } else if (this.popType && this.popType == 'press') {
        const allKeys = Object.keys(this.press.list)
        const pressKey = allKeys[this.popDataIndex]
        return this.popPressDataIndex == this.press.list[pressKey].childList.length - 1
      } else if (this.popType && this[this.popType] && this[this.popType].list) {
        return this.popDataIndex == this[this.popType].list.length - 1
      }
      return true
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/press`)
      const query = context.route.query
      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }
      context.store.commit('setJsKey', 'press')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {},
        aisle: res.data.aisle || {},
        video: res.data.video || {},
        press: res.data.press || {},
        magazine: res.data.magazine || {},
        blog: res.data.blog || {},
        pressChildList: res.data.pressChildList || [],
        query: query || {}
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
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    vm = this
  },
  mounted() {
    if (this.query && this.query.name) {
      if (this.query.name == 'press') {
        this.popType = this.query.name
        const allKeys = Object.keys(this.press.list)
        const pressKey = allKeys[this.query.id]
        const childList = this.press.list[pressKey] && this.press.list[pressKey].childList
        if (childList) {
          this.popDataIndex = this.query.id
          this.popPressDataIndex = 0
          this.popData = childList[0]
        } else {
          this.popData = {}
        }
      } else if (this.query.name == 'blog' && this.blog.list) {
        this.popType = this.query.name
        this.popDataIndex = this.query.id
        this.popData = this.blog.list[this.query.id] || {}
      }
    }
  },
  methods: {
    openDownloadDialog(url) {
      this.pdfUrl = url
      this.downloadDialog = true
    },
    closeAlert(act) {
      this.downloadDialog = false
      if (act) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = this.pdfUrl
        link.setAttribute('download', this.aisle.title)
        document.body.appendChild(link)
        link.click()
      }
    },
    // 分页
    pageChange(val) {
      this.pageInfo.page = val
    },
    changeTab(index) {
      this.currentTabIndex = index
    },
    showPop(item, index, type) {
      // magazine 的弹窗内容展示的是本item下面的 imgPopList 的图片
      // blog 的弹窗内容展示的是本item 的图片
      // video 的弹窗内容展示的是本item 的视频
      // press 的弹窗内容展示的是本item 对应的 pressChildList 的项的内容,但是每一项里面有可能有好几个对于的子级别
      this.popType = type
      this.popDataIndex = index
      if (type == 'magazine') {
        if (!item.imgPopList) return
        this.popData = {
          imgUrl: item.imgPopList[0],
          imgAlt: 'magazine'
        }
        this.popMagazineDataIndex = 0
      } else if (type == 'press') {
        const popData = item.childList[0]
        if (this.pressChildList && popData) {
          this.popData = {
            ...popData,
            parentImgLink: item.imgAlt || ''
          }
          this.popPressDataIndex = 0
          // 处理地址 /press?name=PYMNTS&id=0
          history.pushState('', '', `/press?name=${this.popType}&id=${index}`)
        } else {
          this.popData = {}
        }
      } else {
        this.popData = item
      }
      if (this.popType && this.popType == 'blog') {
        // 处理地址 /press?name=PYMNTS&id=0
        history.pushState('', '', `/press?name=${this.popType}&id=${this.popDataIndex}`)
      }
    },
    getInfo(type) {
      if (this.popType && this[this.popType] && this[this.popType].list) {
        if (this.popType && this.popType == 'press') {
          if (type && type == 'prev') {
            this.popPressDataIndex--
          } else if (type && type == 'next') {
            this.popPressDataIndex++
          }
          const allKeys = Object.keys(this.press.list)
          const pressKey = allKeys[this.popDataIndex]
          this.popData = {
            ...this.press.list[pressKey].childList[this.popPressDataIndex],
            parentImgLink: this.press.list[pressKey].imgAlt || ''
          }
          // 处理地址 /press?name=PYMNTS&id=0
          history.pushState('', '', `/press?name=${this.popType}&id=${this.popDataIndex}`)
        } else if (this.popType && this.popType == 'magazine') {
          if (this.magazine.list[this.popDataIndex].imgPopList) {
            if (type && type == 'prev') {
              this.popMagazineDataIndex--
              this.popData = {
                imgUrl: this.magazine.list[this.popDataIndex].imgPopList[this.popMagazineDataIndex],
                imgAlt: 'magazine'
              }
            } else if (type && type == 'next') {
              this.popMagazineDataIndex++
              this.popData = {
                imgUrl: this.magazine.list[this.popDataIndex].imgPopList[this.popMagazineDataIndex],
                imgAlt: 'magazine'
              }
            }
          }
        } else if (this.popType) {
          if (type && type == 'prev') {
            this.popDataIndex--
            this.popData = this[this.popType].list[this.popDataIndex]
          } else if (type && type == 'next') {
            this.popDataIndex++
            this.popData = this[this.popType].list[this.popDataIndex]
          }
          if (this.popType && this.popType == 'video') {
            this.showVideo = false
            setTimeout(() => {
              this.showVideo = true
            })
          }
        }
        if (this.popType && this.popType == 'blog') {
          // 处理地址 /press?name=PYMNTS&id=0
          history.pushState('', '', `/press?name=${this.popType}&id=${this.popDataIndex}`)
        }
      }
    },
    closeDialog() {
      this.popType = ''
      history.pushState('', '', `/press`)
    },
    handleVideo(type) {
      const myVideo = document.getElementById('pannierVideo')
      if (type) {
        myVideo.play()
      } else {
        myVideo.pause()
      }
    },
    closeShare() {
      this.showSharePop = false
      this.handleVideo(true)
    },
    showShare() {
      this.showSharePop = true
      this.handleVideo(false)
    }
  }
}
</script>

<style lang="less" scoped>
.press-main {
  .content {
    .tabs {
      margin-bottom: 30px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 8px;
      span {
        letter-spacing: 0;
        font-size: 16px;
        font-family: @font-family-600;
        text-transform: uppercase;
        padding-bottom: 5px;
        margin-right: 20px;
        color: #ccc;
        cursor: pointer;
        &.checked {
          color: var(--color-121212);
          border-bottom: 3px solid var(--color-121212);
        }
      }
    }
    .block {
      .title {
        margin-bottom: 20px;
      }
      .desc {
        font-family: @font-family-500;
        margin-bottom: 20px;
      }
      .item-content {
        text-align: center;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        // margin: 0 0 0 -20px;
        .item-block {
          min-height: 1px;
          vertical-align: top;
          box-sizing: border-box;
          &:hover {
            box-shadow: 0px 0px 10px 0px #eee;
          }
          .img {
            position: relative;
            cursor: pointer;
            box-sizing: border-box;
            img {
              width: 366px;
              // cursor: auto;
              max-width: 100%;
              max-height: 100%;
            }
            .video_btn {
              cursor: pointer;
              position: absolute;
              width: 65px;
              height: 65px;
              background-size: contain;
              background-image: data-uri('~assets/images/icon_video_play.png');
              top: 50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
          }
          .txt {
            text-align: center;
            width: 220px;
            margin: 0 auto;
            margin-top: 10px;
            font-size: 13px;
            font-family: @font-family-600, sans-serif;
            display: block;
            color: var(--color-121212);
          }
        }
      }
      .item-aisle {
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 450px;
        margin: 0 auto;
        position: relative;
        .img {
          position: relative;
          cursor: pointer;
          box-sizing: border-box;
          img {
            width: 450px;
            height: 800px;
          }
          .download_btn {
            cursor: pointer;
            position: absolute;
            width: 40px;
            height: 40px;
            background-size: contain;
            background-image: data-uri('~assets/images/download.png');
            bottom: 10px;
            right: 10px;
          }
        }
        .txt {
          text-align: center;
          width: 220px;
          margin: 0 auto;
          margin-top: 10px;
          font-size: 13px;
          font-family: @font-family-600, sans-serif;
          display: block;
          color: var(--color-121212);
        }
        .az-icon {
          font-size: 24px;
          position: absolute;
          top: 50%;
          cursor: pointer;
          &.aisle-swiper-button-prev {
            transform: translateY(-32px) rotate(180deg);
            left: -50px;
          }
          &.aisle-swiper-button-next {
            transform: translateY(-32px);
            right: -50px;
          }
        }
      }
      .load-more {
        position: relative;
        margin-bottom: 60px;
        img {
          width: 100%;
          max-height: 275px;
          max-width: 100%;
          height: auto;
          margin-top: -100%;
        }
        .load-more-txt {
          position: absolute;
          z-index: 3;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 34px;
          border: 1px solid var(--color-121212);
          margin: -23px auto 0;
          vertical-align: middle;
          text-align: center;
          line-height: 34px;
          font-family: @font-family-600;
          color: var(--color-121212);
          font-size: 13px;
          cursor: pointer;
          text-transform: uppercase;
          &:hover {
            color: var(--color-121212);
            border-color: var(--color-121212);
          }
        }
      }
      &.video {
        margin-bottom: 40px;
        .title {
          margin-bottom: 20px;
        }
        .none {
          width: 288px;
        }
        .item-block {
          width: 33.333%;
          margin-bottom: 30px;
          width: 288px;
          &:nth-child(3n + 1) {
            text-align: left;
          }
          &:nth-child(3n) {
            text-align: right;
          }
          .txt {
            width: 170px;
            margin-top: 11px;
            margin-bottom: 10px;
          }
        }
      }
      &.press {
        .none {
          width: 196px;
        }
        .item-block {
          width: 25%;
          margin-bottom: 40px;
          width: 196px;
          border: 1px solid #ccc;
          &:hover {
            border: 1px solid #fff;
          }
          &:nth-child(4n + 1) {
            text-align: left;
          }
          &:nth-child(4n) {
            text-align: right;
          }
          .img {
            margin: 0 auto;
            height: 102px;
            cursor: pointer;
            border-radius: 1px;
            text-align: center;
            vertical-align: middle;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 62%;
              // width: auto;
              height: auto;
              // max-width: 100%;
              // max-height: 100%;
              // position: absolute;
              // left: 50%;
              // top: 50%;
              // transform: translate(-50%, -50%);
            }
          }
        }
      }
      &.magazine {
        .none {
          width: 251px;
        }
        .item-block {
          width: 33.33%;
          margin-bottom: 40px;
          width: 251px;
          &:nth-child(3n + 1) {
            text-align: left;
          }
          &:nth-child(3n) {
            text-align: right;
          }
          .img {
            margin: 0 auto;
            width: 251px;
            height: 297px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 1px;
            text-align: center;
            vertical-align: middle;
            img {
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 100%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .txt {
            margin-bottom: 15px;
            width: 100%;
            text-align: center;
          }
        }
      }
      &.blog {
        .none {
          width: 288px;
        }
        .item-block {
          // width: 50%;
          width: 288px;
          // padding-left: 20px;
          // &:nth-child(2n + 1) {
          //   text-align: left;
          // }
          // &:nth-child(2n) {
          //   text-align: right;
          // }
          &:hover {
            .img {
              border: 1px solid #fff;
            }
          }
          margin-bottom: 37px;
          .img {
            margin: 0 auto;
            width: 288px;
            height: 288px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 1px;
            text-align: center;
            vertical-align: middle;
            img {
              width: auto;
              height: 100%;
              max-width: 100%;
              max-height: 100%;
              // position: absolute;
              // left: 50%;
              // top: 50%;
              // transform: translate(-50%, -50%);
            }
          }
          .txt {
            width: 100%;
            margin-bottom: 15px;
          }
        }
        .press-pager {
          margin-top: 40px;
        }
      }
    }
  }
}
.dialog-content {
  width: 100%;
  .dialog-head {
    width: 100%;
    height: 40px;
    position: relative;
    .dialog-close {
      position: absolute;
      right: 10px;
      top: 10px;
      display: block;
      width: 15px;
      height: 15px;
      background-image: data-uri('~assets/images/download.png');
      background-size: cover;
    }
  }
  .dialog-title {
    margin-top: 10px;
    margin-bottom: 20px;
    font-family: @font-family-500;
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
    color: var(--color-121212);
  }
  .dialog-footer {
    width: 100%;
    height: 36px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .btn {
      min-width: 61px;
      height: 36px;
    }
    .bgf {
      margin-left: 20px;
      background-color: #fff;
      color: var(--color-121212);
    }
  }
}
/deep/.az-popup-box {
  overflow-y: unset !important;
}
.press-pannier {
  width: 680px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  margin: auto;
  background-color: var(--color-121212);
  p {
    color: #fff;
    padding-top: 21px;
    margin-bottom: 7px;
  }
  .close-popup {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 1;
    cursor: pointer;
    .icon {
      font-size: 16px;
      fill: currentColor;
      color: #fff;
    }
  }
  .pop-prev-arraw,
  .pop-next-arraw {
    position: absolute;
    display: block;
    top: 50%;
    .arraw-icon {
      fill: currentColor;
      color: #fff;
      width: 32px;
      height: 32px;
    }
    &:hover {
      .arraw-icon {
        fill: currentColor;
        color: var(--color-121212);
      }
    }
  }
  .pop-prev-arraw {
    left: -46px;
  }
  .pop-next-arraw {
    right: -46px;
  }
  .press_video_share_button {
    position: absolute;
    top: 65px;
    right: 13px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    background-size: contain;
    background: data-uri('~assets/images/press_video_share_pc.png');
    background-size: 100% 100%;
    z-index: 1;
  }
  .popup-content {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .pop-share {
    text-align: center;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    .pop-share-content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .press_video_share_desc {
      font-size: 16px;
      font-family: @font-family-500;
      color: #ffffff;
    }
    .press_video_share_url {
      margin-top: 15px;
      padding: 0 5px;
      font-family: @font-family-600;
      font-size: 20px;
      color: #ffffff;
      line-height: 30px;
      background-color: #0a64d3;
    }
    .press_video_share_link {
      margin-top: 20px;
      height: 36px;
    }
    .press_video_share_close {
      cursor: pointer;
      margin-top: 37px;
      font-size: 14px;
      font-family: @font-family-500;
      color: #ffffff;
      text-transform: uppercase;
      text-decoration: underline;
    }
  }
  &.video-popup {
    .popup-content {
      padding-bottom: 24px;
    }
  }
  &.press-popup {
    width: 1138px;
    background-color: #fff;
    .popup-content {
      background: #fff;
      height: 662px;
      padding: 10px;
      .left {
        float: left;
        width: 510px;
        text-align: center;
        height: 100%;
        position: relative;
        margin-left: 30px;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          max-width: 100%;
          max-height: 100%;
          transform: translate(-50%, -50%);
        }
      }
      .right {
        float: left;
        width: 530px;
        height: 100%;
        position: relative;
        overflow-y: auto;
        margin-left: 18px;
        .right-content {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          // max-width: 100%;
          // max-height: 100%;
          -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          img {
            max-width: 196px;
            max-height: 100px;
            height: auto;
            margin: 13px 0;
          }
          .note {
            margin: 0 auto;
            // width: 400px;
            color: var(--color-121212);
            font-family: @font-family-500, sans-serif;
            font-size: 14px;
            text-align: left;
          }
        }
      }
      .bottom-txt {
        position: absolute;
        bottom: 5px;
        width: 100%;
        display: block;
        text-align: center;
      }
    }
  }
  &.magazine-popup {
    height: 772px;
    background: #fff;
    padding: 40px;
    width: auto;
    max-width: 1068px;
    .popup-content {
      justify-content: center;
      .img {
        height: 100%;
        img {
          max-width: 100%;
          height: 100%;
        }
      }
    }
  }
  &.blog-popup {
    width: 630px;
    max-height: 857px;
    background: #fff;
    padding: 40px;
    .popup-content {
      justify-content: center;
      .img {
        height: 100%;
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
