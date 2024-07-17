<template>
  <div class="goods_thumb_box">
    <div id="goods_thumb_list" v-if="productImgList.length > 0" class="prod-thumb">
      <div :class="['carousel', { wgd: isSpecialCatId(catId), 'carousel-pad': showArrowBtn }]">
        <div v-show="showArrowBtn">
          <a href="javascript:void(0)" class="btn swiper-button-prev prev-arraw-vertical" aria-label="left" aria-disabled="true">
            <span style="display: none">left</span>
            <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
          </a>
          <a href="javascript:void(0)" class="btn swiper-button-next next-arraw-vertical" aria-label="right" aria-disabled="false">
            <span style="display: none">right</span>
            <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
          </a>
        </div>
        <div ref="productThumbSwiper" v-swiper:productThumbSwiper="thumbswiperOption" class="swiper-container thumb-box">
          <ul id="thumblist" class="swiper-wrapper">
            <li
              v-track.viewOnce="getCommon(index, 'smallswift')"
              v-for="(pic, index) in productImgList"
              :key="index"
              :class="{ current: currentImgIndex == index }"
              :data-index="index"
              class="swiper-slide"
            >
              <a
                :imgType="pic.imgType"
                :data-datalayer-label="'DetailPage' + TABLE_TEST + '_SmallPic_Click'"
                data-datalayer-category="PC_DetailPageRevision"
                class="zoomThumb need_datalayer"
                href="javascript:void(0);"
                aria-label="Azazie Blake"
              >
                <img
                  :src="addWebpSuffix(pic.imgType ? `${imageInfo.browserPrefix}${pic.imgUrl}` : `${pic.thumbnail}`, false, catId == 9)"
                  :alt="getImgAlt(baseInfo, index + 1)"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="thumb_detail">
        <div class="prod-thumb-right">
          <!-- 缩略图 -->
          <div
            v-track.viewOnce.click="
              getExcitationParams(
                'stimulatedetail',
                'stimulatedetail',
                baseInfo,
                getStickerText(),
                'detailpage',
                baseInfo.driveInfo && baseInfo.driveInfo.detailSticker
              )
            "
            class="magnify"
          >
            <div id="azThumb" ref="productSwiper" v-swiper:productSwiper="swiperOption" v-show="swiperVisible" class="swiper-container">
              <div class="swiper-wrapper">
                <div
                  v-track.viewOnce="getCommon(index, 'normalswift')"
                  v-for="(pic, index) in productImgList"
                  :key="index"
                  :imgType="pic.imgType"
                  class="swiper-slide"
                >
                  <template v-if="pic.imgType">
                    <az-pic-zoom
                      :src="addWebpSuffix(`${imageInfo.thumbPrefix}${pic.imgUrl}`, false, catId == 9)"
                      :bigsrc="addWebpSuffix(`${imageInfo.originalPrefix}${pic.imgUrl}`, false, catId == 9)"
                      :configs="configs"
                      :alt="getImgAlt(baseInfo)"
                      :index="index"
                    >
                      <client-only>
                        <az-sticker :stickerInfo="getSticker" :flashSaleInfo="flashSaleInfo" :goodsId="baseInfo.goodsId"></az-sticker>
                      </client-only>
                      <span v-if="baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
                    </az-pic-zoom>
                  </template>
                  <template v-else>
                    <video
                      id="goods_video"
                      ref="video"
                      :poster="replaceImgCdnUrl(pic.thumbnail)"
                      width="100%"
                      height="100%"
                      preload
                      muted
                      loop
                    >
                      <source :src="cdnReplace(pic.url)" type="video/mp4" />
                      {{ nl('page_product_thumb_text') }}
                    </video>
                    <az-icon
                      v-track.view.click="{ common: setVideoPoint('voicebutton') }"
                      v-if="!!pic.has_voice"
                      @click="clickVoice"
                      :icon-class="muted ? 'icon-jingyin' : 'icon-shengyin'"
                      class="voice-icon"
                    ></az-icon>
                  </template>
                </div>
              </div>
            </div>
            <!-- 左右切换按钮 -->
            <div
              v-if="productImgList.length > 1"
              :data-datalayer-label="'DetailPage' + TABLE_TEST + '_SwitchButton_Click'"
              data-datalayer-category="PC_DetailPageRevision"
              class="swiper-button-prev prev-arraw-horizontal need_datalayer"
              role="button"
              aria-label="left"
            >
              <span style="display: none">left</span>
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
            </div>
            <div
              v-if="productImgList.length > 1"
              :data-datalayer-label="'DetailPage' + TABLE_TEST + '_SwitchButton_Click'"
              data-datalayer-category="PC_DetailPageRevision"
              class="swiper-button-next next-arraw-horizontal need_datalayer"
              role="button"
              aria-label="right"
            >
              <span style="display: none">right</span>
              <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
            </div>
          </div>
          <az-fav-icon
            v-if="favIconShow"
            :goodsId="baseInfo.goodsId"
            :goodsCatId="baseInfo.catId"
            :colorId="baseInfo.colorId"
          ></az-fav-icon>
          <ExcitationView v-if="hasExcitation(baseInfo)" :sticker="getExcitationValues" />
        </div>
        <!-- 原分享不用，使用新分享 -->
        <div id="share">
          <az-share v-if="false" :shareList="shareListInfo" :fontSize="'35px'" :space="'0 26px 0 0'"></az-share>
          <az-share-new v-bind="bindShareConfig"></az-share-new>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AzShare from '@/components/az-ui/Share/AzShare'
import AzShareNew from '@/components/az-ui/Share/AzShareNew'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import AzFavIcon from '@/components/az-ui/AzFavIcon'
import ExcitationView from '@/components/common/excitation/ExcitationView'
import sodExcitationMixins from '@/assets/js/sodExcitationMixins.js'
import { mapState } from 'vuex'
let vm = null // eslint-disable-line no-unused-vars
export default {
  name: 'ProductThumb',
  languageKeys: [
    'page_product_thumb_text',
    ...AzShareNew.languageKeys,
    ...AzSticker.languageKeys,
    ...AzFavIcon.languageKeys,
    ...ExcitationView.languageKeys
  ],
  components: {
    AzShare,
    AzSticker,
    AzFavIcon,
    ExcitationView,
    AzShareNew
  },
  mixins: [sodExcitationMixins],
  props: {
    detailsInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    videoInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    shareList: {
      type: Array,
      default() {
        return []
      }
    },
    stickerInfo: {
      type: Array,
      default() {
        return []
      }
    },
    flashSaleInfo: {
      type: Object,
      default() {
        return null
      }
    },
    stockInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isProductImgListSet: false,
      TABLE_TEST: 'A',
      configs: {
        width: 454,
        height: 538,
        maskWidth: 185,
        maskHeight: 219,
        maskColor: '#fff',
        maskOpacity: 0.2
      },
      currentImgIndex: 0,
      swiperOption: {
        direction: 'horizontal', // 横向切换
        loop: true,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        slidesPerView: 1,
        observeSlideChildren: true,
        navigation: {
          prevEl: '.prev-arraw-horizontal',
          nextEl: '.next-arraw-horizontal'
        },
        on: {
          slideChange() {
            vm.currentImgIndex = this.realIndex
            vm.changCurrentThumbImg(this.realIndex)
            vm.picHandleClick(this.realIndex)
            vm.productImgList[vm.currentImgIndex] &&
              vm.$store.commit('product/setCurrentShowImageUrl', vm.productImgList[vm.currentImgIndex].imgUrl || '')
            if (vm.productImgList.length && vm.productImgList[vm.currentImgIndex].url) {
              vm.handleVideo()
            }
            vm.buryPoint(vm, 'event', {
              ec: 'image',
              el: 'normalswift',
              ea: 'click',
              param2: vm.sodGalleryVersion || 'a',
              msg: JSON.stringify({
                goodsId: vm.baseInfo && vm.baseInfo.goodsId,
                color: vm.selectedColor.key,
                index: this.realIndex + 1,
                cat_name: vm.baseInfo.catName,
                dress_type: vm.baseInfo.dressType || vm.dressType
              })
            })
          },
          tap() {}
        }
      },
      swiperVisible: true,
      showArrowBtn: false,
      muted: true, // 默认静音
      maxHeight: 0,
      thumbswiperOption: {
        direction: 'vertical',
        slidesPerView: 'auto',
        spaceBetween: 6,
        slidesPerGroup: 6,
        slideToClickedSlide: true,
        navigation: {
          prevEl: '.prev-arraw-vertical',
          nextEl: '.next-arraw-vertical'
        },
        on: {
          imagesReady() {
            // 线上问题修复， 左侧缩略图加载不完全的时候，计算轮播高度会有错误导致页面展示不对，所以需要监听左侧轮播图片加载完全之后再重新计算一遍。
            vm.getMaxHeight()
          },
          click() {
            if (typeof this.clickedIndex !== 'number') return // 点击空白的地方
            vm.changCurrentImg(this.clickedIndex)
          }
        }
      },
      netTimer: null
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      defaultSelectedSashColor: (state) => state.product.defaultSelectedSashColor,
      isPlusSize: (state) => state.product.isPlusSize,
      selectedSize: (state) => state.product.selectedSize,
      plusSizeView: (state) => state.product.plusSizeView,
      selectedColor: (state) => state.product.selectedColor,
      imageInfo: (state) => state.product.imageInfo
    }),
    productImgs() {
      let productImgs = []
      if (this.imageInfo.goodsGallery[this.baseInfo.color] && this.imageInfo.goodsGallery[this.baseInfo.color].images) {
        productImgs = JSON.parse(JSON.stringify(this.imageInfo.goodsGallery[this.baseInfo.color].images))
      }
      if (this.baseInfo.hasSash) {
        let key = this.baseInfo.sashColor
        if (key == '' || !productImgs[key]) {
          key = this.defaultSelectedSashColor.key
          if (this.baseInfo.dressType == 'sample' || this.baseInfo.dressType == 'clearance' || this.baseInfo.dressType == 'outlet') {
            const sashColors = Object.keys(this.stockInfo.colorMap[this.baseInfo.color].allSashColor)
            key = sashColors[0]
          }
        }
        productImgs = productImgs[key]
      }

      const tempArr = []
      for (let i = 0; i < productImgs.length; i++) {
        const element = productImgs[i]
        if (element.isPlus) {
          tempArr.push(element)
          productImgs.splice(i, 1)
          i--
        }
      }
      if (this.isPlusSize) {
        productImgs = [...tempArr, ...productImgs]
      } else {
        productImgs = [...productImgs, ...tempArr]
      }
      return productImgs
    },
    productImgList() {
      let productImgList = this.productImgs
      if (this.videoInfo.ktlaVideo && this.videoInfo.ktlaVideo.url) {
        this.buryPoint(this, 'event', {
          ec: 'video',
          el: 'icon',
          ea: 'view',
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType || this.dressType
          })
        })
        const temp = [this.videoInfo.ktlaVideo]
        productImgList = temp.concat(productImgList)
      }
      return productImgList
    },
    shareListInfo() {
      const shareList = this.shareList.concat([])
      let symbol = '?'
      if (this.page_url.includes(symbol)) {
        symbol = '&'
      }
      const shareUrl = this.HTTPS_HOST + this.countryUrl(this.baseInfo.goodsDefaultUrl)
      const utmSource = '&utm_medium=post&utm_campaign=share'
      shareList.forEach((item) => {
        item.dialog_height = 320
        item.dialog_width = 700
        let url = ''
        if (item.key == 'facebook') {
          url = 'http://www.facebook.com/sharer/sharer.php?u=' + shareUrl + symbol + 'utm_source=facebook' + utmSource
        }
        if (item.key == 'pinterest') {
          url =
            'http://pinterest.com/pin/create/button/?description=' +
            item.pinterestDesc +
            '&media=' +
            item.shareImg +
            '&is_video=false' +
            '&url=' +
            shareUrl +
            symbol +
            'utm_source=pinterest' +
            utmSource
        }
        if (item.key == 'twitter') {
          url =
            'http://twitter.com/share?text=I%27m in love with ' +
            item.title +
            '.&via=iheartazazie' +
            '&url=' +
            shareUrl +
            symbol +
            'utm_source=twitter' +
            utmSource
        }
        if (item.key == 'email') {
          url =
            'mailto:?subject=Look what I found at ' +
            this.HTTPS_HOST +
            '&body=' +
            this.baseInfo.shownGoodsName +
            '-' +
            this.baseInfo.catName +
            shareUrl +
            symbol +
            'utm_source=email' +
            utmSource
        }
        if (item.key == 'google') {
          item.dialog_height = 600
          item.dialog_width = 600
          url = 'https://plus.google.com/share?hl=en' + '&url=' + shareUrl + symbol + 'utm_source=googleplus' + utmSource
        }
        item.url = url
      })
      return shareList
    },
    normalPosition() {
      let positionIndex = 0
      const productImgs = JSON.parse(JSON.stringify(this.productImgs))
      if (this.isPlusSize) {
        for (let index = 0; index < productImgs.length; index++) {
          const element = productImgs[index]
          if (!element.isPlus) {
            positionIndex = index
            break
          }
        }
      }
      return positionIndex
    },
    plusPosition() {
      let positionIndex = 0
      const productImgs = JSON.parse(JSON.stringify(this.productImgs))
      if (!this.isPlusSize) {
        for (let index = 0; index < productImgs.length; index++) {
          const element = productImgs[index]
          if (element.isPlus) {
            positionIndex = index
            break
          }
        }
      }
      if (this.videoInfo.ktlaVideo && this.videoInfo.ktlaVideo.url) {
        positionIndex += 1
      }
      return positionIndex
    },
    favIconShow() {
      if (this.baseInfo.catId == 1504 || this.baseInfo.isComingSoon) {
        // 口罩  coming soon 商品
        return false
      }
      // mx下，mxBdBatch为1时，不显示showroom
      if (this.baseInfo.isFinalSale || (this.country == 'MX' && this.baseInfo.mxBdBatch)) {
        return false
      }
      return !['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType) && !this.baseInfo.isGiftCard
    },
    // sod 列表页排队影藏的商品不展示beBacksoon sticker
    getSticker({ baseInfo, stickerInfo }) {
      if (this.isSpecialCatId(baseInfo.catId) && baseInfo.isMeasurementHideGoods && baseInfo.isComingSoon) {
        return stickerInfo.filter((sticker) => sticker.name != 'beBackSoon')
      }
      return stickerInfo
    },
    bindShareConfig({ baseInfo }) {
      return {
        shareConfig: [],
        baseInfo,
        showColorIcon: false
      }
    }
  },
  watch: {
    productImgList: {
      handler(val, oldVal) {
        // 商品图列表变更
        this.swiperVisible = false
        this.$nextTick(() => {
          this.swiperVisible = true
        })
      },
      deep: true
    },
    selectedSize: {
      handler(val, oldVal) {
        if (process.server) return
        this.initCurrentImgIntoView()
      }
    }
  },
  created() {
    vm = this
  },
  mounted() {
    // （大小图轮播）挂载的时候默认选中的图片为其打点。
    const smallImg = {
      ec: 'image',
      el: 'smallswift',
      ea: 'click',
      param2: this.sodGalleryVersion || 'a',
      msg: JSON.stringify({
        goodsId: this.baseInfo.goodsId,
        color: this.selectedColor.key,
        cat_id: this.baseInfo.catId,
        index: 1,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType || this.dressType
      })
    }
    const bigImg = {
      ec: 'image',
      el: 'normalswift',
      ea: 'click',
      param2: this.sodGalleryVersion || 'a',
      msg: JSON.stringify({
        goodsId: this.baseInfo.goodsId,
        color: this.selectedColor.key,
        cat_id: this.baseInfo.catId,
        index: 1,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType || this.dressType
      })
    }
    this.buryPoint(this, 'events', [smallImg, bigImg])
    this.$nextTick(() => {
      if (this.productImgList.length && this.productImgList[this.currentImgIndex].url) {
        this.handleVideo()
      }
    })
    this.$store.commit('product/setCurrentShowImageUrl', this.baseInfo.goodsThumb)
    window.addEventListener('resize', () => {
      this.getMaxHeight()
    })
  },
  updated() {
    this.$nextTick(() => {
      if (this.productThumbSwiper && this.productSwiper) {
        this.productThumbSwiper.update()
        this.productSwiper.loopDestroy()
        this.productSwiper.loopCreate()
        this.productSwiper.update()
      }
    })
  },
  beforeDestroy() {
    this.netTimer && clearInterval(this.netTimer)
  },
  methods: {
    // 获取图片的对应alt
    getImgAlt(item, index, type) {
      if (!index) index = 1
      if (!type) type = 'front'
      let goodsName = item.goodsTitle ? item.goodsTitle : item.shownGoodsName
      let catName = item.catName || ''
      let goodsSubTitle = item.goodsSubTitle || ''
      // 如果最后一个字符是空格，去掉空格
      if (goodsName.charAt(goodsName.length - 1) === ' ') goodsName = goodsName.substr(0, goodsName.length - 1)
      if (catName.length > 1 && catName.charAt(catName.length - 1) === ' ') catName = catName.substr(0, catName.length - 1)
      if (goodsSubTitle.length > 1 && goodsSubTitle.charAt(goodsSubTitle.length - 1) === ' ')
        goodsSubTitle = goodsSubTitle.substr(0, goodsSubTitle.length - 1)

      if ([7, 8, 10, 2, 45, 158].includes(item.catId)) {
        return `${goodsName} ${catName} ${goodsSubTitle} image${index}`
      } else if (item.catId === 9) {
        return `${goodsName} ${goodsSubTitle} image${index}`
      } else if (this.isSpecialCatId(item.catId)) {
        return `${goodsName} image${index}`
      } else {
        return `${type} ${goodsName}`
      }
    },
    /**
     * 视频播放中判断网络是否中断
     */
    checkNet(ele) {
      // 获取视频时长，和当前已经播放的时长
      let num = 0
      // 设置定时器判断视频是否已经播放完成，是否有卡顿
      this.netTimer = setInterval(() => {
        num++
        // 如果播放的时间延迟了1秒，判断网络是否中断
        if (num / 1000 > ele.currentTime + 1) {
          // 如果有卡顿，判断是否网络中断
          if (window.navigator.onLine != true) {
            alert('网络中断')
          }
        }
        if (ele.currentTime >= ele.duration - 0.1) {
          clearInterval(this.netTimer)
        }
      }, 1)
    },
    /**
     * 点击声音图标，控制视频是否静音，默认静音
     */
    clickVoice() {
      const ele = document.getElementById('goods_video')
      if (ele) {
        // 将是否静音置为相反状态
        console.log(ele.muted)
        ele.muted = !ele.muted
        // 更新组件状态
        this.muted = !this.muted
      }
    },
    setVideoPoint(el) {
      return {
        ec: 'detailpage',
        el,
        msg: JSON.stringify({
          goods_id: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName
        })
      }
    },
    handleVideo() {
      const ele = document.getElementById('goods_video')
      const _this = this
      if (ele) {
        // 网络不够快的时候可能是0
        if ([0, 4].includes(ele.readyState)) {
          const promise = ele.play()
          promise
            .then(() => {})
            .catch((err) => {
              console.log(err)
              ele.setAttribute('muted', true)
              ele
                .play()
                .then(() => {})
                .catch((e) => {
                  console.log(e)
                })
            })
          this.checkNet(ele)
        }
        this.setPoint('videolittle', 'view')

        // 状态判断，PC Chrome
        document.addEventListener(
          'webkitfullscreenchange',
          (evt) => {
            if (!ele.webkitDisplayingFullscreen) {
              // 退出全屏
              _this.setPoint('videolittle', 'view')
              _this.setPoint('buttonlittle', 'click')
            } else {
              _this.setPoint('videolarge', 'view')
              _this.setPoint('buttonlarge', 'click')
            }
          },
          false
        )
      }
    },
    setPoint(el, ea) {
      this.buryPoint(this, 'event', {
        ec: 'video',
        el,
        ea,
        msg: JSON.stringify({
          goods_id: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    },
    changCurrentImg(index) {
      this.buryPoint(this, 'event', {
        ec: 'image',
        el: 'smallswift',
        ea: 'click',
        param2: this.sodGalleryVersion || 'a',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.selectedColor.key,
          index: index + 1,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
      this.productSwiper.slideToLoop(index, 800, false)
    },
    changCurrentThumbImg(index) {
      this.productThumbSwiper.slideToLoop(index, 800, false)
    },
    getMaxHeight() {
      const selectorText = this.isSpecialCatId(this.catId) ? '.carousel.wgd' : '.carousel'
      const parentDom = document.querySelector(selectorText)
      const thumbBox = document.querySelector('.thumb-box')
      const sildeDoms = document.querySelectorAll('#thumblist .swiper-slide')
      const bigPicDom = document.querySelector('.thumb_detail .prod-thumb-right')
      let maxHeight = 0
      let mh = 0
      sildeDoms.forEach((item, index) => {
        mh += item && item.getBoundingClientRect().height + 6
      })
      this.showArrowBtn = mh > bigPicDom.getBoundingClientRect().height
      maxHeight = bigPicDom.getBoundingClientRect().height - (this.showArrowBtn ? 40 : 0)
      parentDom && parentDom.style.setProperty('height', maxHeight + 'px')
      thumbBox && thumbBox.style.setProperty('height', maxHeight + 'px')
      this.maxHeight = maxHeight
      this.productThumbSwiper && this.productThumbSwiper.update()
    },
    picHandleClick(index) {
      const ele = document.getElementById('goods_video')
      if (this.productImgList[index].imgType) {
        ele && ele.pause()
      }
    },
    getCommon(index, el) {
      return {
        id: 'smallswift' + index + this.selectedColor.key + this.sodGalleryVersion,
        common: {
          ec: 'image',
          el,
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            color: this.selectedColor.key,
            index: index + 1,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType || this.dressType
          })
        }
      }
    },
    hasExcitation(item) {
      return false
    },
    initCurrentImgIntoView() {
      if (this.plusSizeView) {
        this.changCurrentImg(this.plusPosition)
        this.changCurrentThumbImg(this.plusPosition)
      } else {
        this.changCurrentImg(this.normalPosition)
        this.changCurrentThumbImg(this.normalPosition)
      }
    }
  }
}
</script>

<style lang="less" scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
video:focus {
  outline: none;
}
img {
  width: 100%;
}
.goods_thumb_box {
  #goods_thumb_list {
    display: flex;
    .carousel {
      min-width: 65px;
      width: 11.66%;
      max-width: 95px;
      position: relative;
      overflow: hidden;
      margin-right: 10px;
      &-pad {
        padding: 20px 0;
      }
      li.swiper-slide {
        height: fit-content;
        .zoomThumb {
          display: block;
          height: fit-content;
        }
        &.current a {
          border: 3px solid @theme-color;
          // outline-offset: -3px;
        }
        &:is(:nth-last-child) {
          margin-bottom: 6px;
        }
        img {
          max-height: 132px;
          vertical-align: middle;
        }
      }
      .btn {
        display: inline-block;
        position: absolute;
        transform: rotate(90deg) translateY(50%);
        width: unset;
        height: unset;
        &.prev-arraw-vertical {
          top: 20px;
          left: 50%;
        }
        &.next-arraw-vertical {
          right: unset;
          left: 50%;
          top: 100%;
        }
      }
      &.wgd {
        max-width: 14.18%;
        margin-right: 15px;
        // max-height: 680px;
        // height: max-content;
      }
    }
    .thumb_detail {
      position: relative;
      flex-grow: 1;
      flex-shrink: 1;
      .prod-thumb-right {
        position: relative;
        width: 100%;
        text-align: center;
        margin-bottom: -1px;
        padding-bottom: 1px;
        .magnify {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('~assets/images/loading.gif') center center no-repeat;
          .swiper-slide {
            .goods-video {
              width: 100%;
            }
            img {
              width: 100%;
              height: 100%;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .voice-icon {
              position: absolute;
              left: 10px;
              bottom: 10px;
              font-size: 36px;
              cursor: pointer;
            }
            .mattel {
              position: absolute;
              right: 5px;
              bottom: 5px;
              font-size: 13px;
              line-height: 13px;
              text-transform: uppercase;
              color: #fff;
            }
          }
        }
        &::after {
          content: '';
          display: block;
          padding-top: 138.3%;
        }
      }
      img,
      video {
        outline: 1px solid #fff;
        outline-offset: -1px;
      }
      ._magnifier {
        width: 100%;
      }
      // 主图左右切换按钮
      .prev-arraw-horizontal,
      .next-arraw-horizontal {
        z-index: 1 !important;
        background-image: unset;
        visibility: hidden;
      }
      &:hover {
        .prev-arraw-horizontal,
        .next-arraw-horizontal {
          visibility: visible;
        }
      }
    }
  }
  #share {
    margin: 20px 0;
  }
  // 左侧垂直切换
  .prev-arraw-vertical,
  .next-arraw-vertical {
    background-image: unset;
  }
  // 主图左右切换按钮
  .prev-arraw-horizontal,
  .next-arraw-horizontal {
    z-index: 1 !important;
    background-image: unset;
  }
  @media screen and (max-width: 1536px) {
    #goods_thumb_list {
      grid-template-columns: 85px calc(100% - 95px);
    }
  }
  @media screen and (max-width: 1440px) {
    #goods_thumb_list {
      grid-template-columns: 75px calc(100% - 85px);
    }
  }
  @media screen and (max-width: 1280px) {
    #goods_thumb_list {
      grid-template-columns: 65px calc(100% - 75px);
    }
  }
}
</style>
