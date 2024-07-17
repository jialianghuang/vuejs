<template>
  <div>
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div class="popup-customer-photo">
        <button @click="closeDialog" aria-label="Close button" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
        </button>
        <div class="popup-content">
          <a
            v-show="customPhotoPopList.length > 1"
            @click="handerSlide('prev')"
            href="javascript:void(0)"
            class="swiper-button-prev prev-arraw prev-arraw-horizontal"
            role="button"
            aria-label="prev"
          >
            <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
          </a>
          <a
            v-show="customPhotoPopList.length > 1"
            @click="handerSlide('next')"
            href="javascript:void(0)"
            class="swiper-button-next next-arraw next-arraw-horizontal"
            role="button"
            aria-label="next"
          >
            <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
          </a>
          <div ref="customerPopPhotoswiper" class="swiper-container ">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="photo-swiper-content">
                  <div class="cpp-photo">
                    <template v-if="customPhoto.type == 'video'">
                      <video :src="cdnReplace(customPhoto.videoUrl)" width="100%" autoplay muted controls></video>
                    </template>
                    <template v-else>
                      <div :class="{ show: !isLoad }" class="loading"></div>
                      <!-- 去掉addWebpSuffix  不少图片 转.webp lambda报错，导致图片无法访问 三星的有部分手机拍的照片会有这个问题-->
                      <img ref="bigImg" v-show="isLoad" :src="customPhoto.imgUrl" @load="customerImgLoad()" alt="custom photo" />
                    </template>
                  </div>
                  <div class="cpp-right">
                    <div class="cpp-info">
                      <div class="review-rating">
                        <az-rate :fontSize="'19px'" :value="customPhoto.rating * 1" :readonly="true"></az-rate>
                      </div>
                      <div class="by">
                        {{ customPhoto.user }}
                      </div>
                      <div class="upload-time">
                        {{ customPhoto.time }}
                      </div>
                      <div class="comment">
                        <div class="comment-content">
                          {{ customPhoto.txt }}
                        </div>
                      </div>
                      <div class="horizontal_swiper">
                        <div ref="horizontalSwiper" v-swiper:horizontalSwiper="horizontalSwiperOption" class="swiper-container">
                          <div class="swiper-wrapper">
                            <li
                              v-for="(pic, index) in customPhotoPopList"
                              :key="index"
                              :data-swiper-slide-index="index"
                              class="swiper-slide"
                            >
                              <!-- 去掉addWebpSuffix  不少图片 转.webp lambda报错，导致图片无法访问 三星的有部分手机拍的照片会有这个问题-->
                              <img
                                :ref="`cutomerImg${index}`"
                                :src="pic.imgUrl"
                                @load="reviewImgLoad(index)"
                                :style="customerPhotoStyleInfo[index]"
                                class="horizontal-img"
                                alt="Azazie Blake"
                              />
                            </li>
                          </div>
                        </div>
                        <a v-show="customPhotoPopList.length > 5" href="javascript:void(0)" class="swiper-button-prev prev-arraw-vertical">
                          <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
                        </a>
                        <a v-show="customPhotoPopList.length > 5" href="javascript:void(0)" class="swiper-button-next next-arraw-vertical">
                          <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
                        </a>
                      </div>
                      <div class="comment-share">
                        <div class="share-desc">{{ nl('page_common_share_this') }}:</div>
                        <az-share :shareList="getShareList(customPhoto.shareInfo)"></az-share>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import AzPopup from '@/components/az-ui/Popup/AzPopup'
import AzRate from '@/components/az-ui/Rate/AzRate'
import AzShare from '@/components/az-ui/Share/AzShare'
import { mapState, mapGetters } from 'vuex'
let vm = null
export default {
  name: 'PopupCustomerPhoto',
  languageKeys: ['page_common_share_this', ...AzRate.languageKeys],
  components: { AzPopup, AzRate, AzShare },
  props: {
    customPhotoPopList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoad: false,
      currentIndex: 0,
      horizontalSwiperOption: {
        slidesPerView: 5,
        // loop: true,
        // width: 54,
        spaceBetween: 10,
        navigation: {
          prevEl: '.prev-arraw-vertical',
          nextEl: '.next-arraw-vertical'
        },
        on: {
          click() {
            if (typeof this.clickedIndex !== 'number' || vm.currentIndex == this.clickedIndex) return // 点击空白的地方
            vm.isLoad = false
            vm.currentIndex = this.clickedIndex
            this.slideTo(this.clickedIndex)
          },
          slideChangeTransitionStart() {
            vm.$nextTick(() => {
              const horizontalSwiper = vm.$refs.horizontalSwiper.swiper
              horizontalSwiper.el.querySelector('.swiper-slide-active') &&
                horizontalSwiper.el.querySelector('.swiper-slide-active').classList.remove('swiper-slide-active')
              horizontalSwiper.el.querySelectorAll('.swiper-slide') &&
                horizontalSwiper.el.querySelectorAll('.swiper-slide')[vm.currentIndex] &&
                horizontalSwiper.el.querySelectorAll('.swiper-slide')[vm.currentIndex].classList.add('swiper-slide-active')
            })
          }
        }
      },
      customerPhotoStyleInfo: {}
    }
  },
  computed: {
    ...mapGetters({
      popupCustomerPhoto: 'product/getPopupCustomerPhotoShow'
    }),
    ...mapState({
      baseInfo: (state) => state.product.baseInfo
    }),
    customPhoto() {
      return this.customPhotoPopList[this.currentIndex] || {}
    },
    getShareList() {
      return (shareInfo = {}) => {
        const shareList = [
          {
            key: 'twitter',
            url: ''
          },
          {
            key: 'facebook',
            url: ''
          },
          {
            key: 'pinterest',
            url: ''
          }
        ]

        const shareUrl = this.HTTPS_HOST + this.countryUrl(this.baseInfo.goodsUrl)
        let symbol = '?'
        if (shareUrl.includes(symbol)) {
          symbol = '&'
        }
        const utmSource = '&utm_medium=post&utm_campaign=share'
        shareList.forEach((item) => {
          let url = ''
          if (item.key == 'facebook') {
            url = 'http://www.facebook.com/sharer/sharer.php?u=' + shareUrl + symbol + 'utm_source=facebook' + utmSource
          }
          if (item.key == 'pinterest') {
            url =
              'http://pinterest.com/pin/create/button/?description=' +
              shareInfo.pinterestTxt +
              '&media=' +
              shareInfo.img +
              '&is_video=false' +
              '&url=' +
              shareUrl +
              symbol +
              'utm_source=pinterest' +
              utmSource
          }
          if (item.key == 'twitter') {
            url =
              'http://twitter.com/share?text=' +
              shareInfo.twitterTxt +
              '.&via=iheartazazie' +
              '&url=' +
              shareUrl +
              symbol +
              'utm_source=twitter' +
              utmSource
          }
          item.url = url
          item.dialog_height = 320
          item.dialog_width = 700
        })
        return shareList
      }
    }
  },
  created() {
    vm = this
    this.currentIndex = this.popupCustomerPhoto.popupCustomerPhotoIndex
  },
  updated() {
    this.$nextTick(() => {
      if (this.customPhotoPopList.length <= 5 || this.currentIndex > this.customPhotoPopList.length - 5) {
        this.$nextTick(() => {
          const horizontalSwiper = this.$refs.horizontalSwiper.swiper
          horizontalSwiper.el.querySelector('.swiper-slide-active') &&
            horizontalSwiper.el.querySelector('.swiper-slide-active').classList.remove('swiper-slide-active')
          horizontalSwiper.el.querySelectorAll('.swiper-slide') &&
            horizontalSwiper.el.querySelectorAll('.swiper-slide')[this.currentIndex] &&
            horizontalSwiper.el.querySelectorAll('.swiper-slide')[this.currentIndex].classList.add('swiper-slide-active')
        })
      } else {
        this.horizontalSwiper.slideTo(this.currentIndex)
      }
    })
  },
  methods: {
    reviewImgLoad(index) {
      const curImg = this.$refs[`cutomerImg${index}`][0]
      if (curImg && curImg.src && curImg.src.includes('http')) {
        const boxWidth = 54
        const boxHeight = 54
        const imgScale = curImg.naturalWidth / curImg.naturalHeight
        let width, height, marginLeft, marginTop

        if (curImg.naturalWidth > curImg.naturalHeight) {
          height = boxHeight
          width = boxHeight * imgScale
          marginLeft = `${(boxWidth - width) / 2}`
        } else {
          width = boxWidth
          height = boxHeight / imgScale
          marginTop = `${(boxHeight - height) / 2}`
        }

        this.customerPhotoStyleInfo[index] = {
          width: `${width}px`,
          height: `${height}px`
        }

        if (marginLeft) this.customerPhotoStyleInfo[index]['margin-left'] = `${marginLeft}px`
        if (marginTop) this.customerPhotoStyleInfo[index]['margin-top'] = `${marginTop}px`
      }
    },
    customerImgLoad() {
      this.isLoad = true
      this.$nextTick(() => {
        if (this.$refs.bigImg && this.$refs.bigImg.offsetWidth > this.$refs.bigImg.offsetHeight) {
          this.$refs.bigImg.style.width = '100%'
          this.$refs.bigImg.style.height = 'auto'
        } else if (this.$refs.bigImg) {
          this.$refs.bigImg.style.width = 'auto'
          this.$refs.bigImg.style.height = '100%'
        }
      })
    },
    handerSlide(type) {
      this.isLoad = false
      let currentIndex = 0
      if (type == 'prev') {
        if (this.currentIndex > 0) {
          currentIndex = this.currentIndex - 1
        }
        currentIndex = currentIndex == 0 ? this.customPhotoPopList.length - 1 : currentIndex
      } else if (type == 'next') {
        if (this.currentIndex < this.customPhotoPopList.length - 1) {
          currentIndex = this.currentIndex + 1
        }

        currentIndex = currentIndex == this.customPhotoPopList.length ? 0 : currentIndex
      }
      this.currentIndex = currentIndex
    },
    closeDialog() {
      this.$store.commit('product/setPopupCustomerPhotoShow', false, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.popup-customer-photo {
  max-width: 850px;
  // height: 690px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  margin: auto;
  .close-popup {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 23px;
    height: 23px;
    padding: 5px;
    z-index: 2;
    border: none;
    line-height: 0px;
    cursor: pointer;
    .az-icon {
      font-size: 13px;
    }
  }
  .popup-content {
    // padding: 38px;
    background: #fff;
    height: 600px;
    .prev-arraw-horizontal {
      left: -45px;
    }
    .next-arraw-horizontal {
      right: -45px;
    }
    .arraw-icon {
      width: 29px;
      height: 29px;
      font-size: 29px;
      fill: #fff;
    }
    .photo-swiper-content {
      display: flex;
      padding: 40px;
      .cpp-photo {
        width: 375px;
        height: 520px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
        background-color: #f6f6f6;
        overflow: hidden;
        img {
          display: block;
        }
        .loading {
          position: absolute;
          top: 43%;
          left: 0;
          right: 0;
          margin: auto;
          width: 80px;
          height: 80px;
          // padding: 150px;
          background: url('~assets/images/loading.gif') center center no-repeat;
          display: none;
          &.show {
            display: block;
          }
        }
      }
      .cpp-right {
        text-align: left;
        flex: 1;
        padding-left: 15px;
        .cpp-info {
          .by {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 8px;
          }
          .upload-time {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            color: var(--color-121212);
            font-size: 13px;
            height: 18px;
          }
          .review-rating {
            margin-bottom: 11px;
          }
          .comment {
            height: 275px;
            overflow-y: auto;
            margin-top: 15px;
            .comment-content {
              font-size: 13px;
              color: var(--color-121212);
              line-height: 24px;
            }
          }
          .horizontal_swiper {
            position: relative;
            width: 380px;
            background-color: #f6f6f6;
            height: 84px;
            padding: 15px 35px;
            box-sizing: border-box;
            margin-top: 15px;
            .swiper-slide {
              display: flex;
              align-items: center;
              position: relative;
              width: 54px;
              height: 54px;
              overflow: hidden;
              box-sizing: border-box;
              cursor: pointer;
              img {
                width: 100%;
              }
            }
            .swiper-button-prev,
            .swiper-button-next {
              background-image: none;
              outline: none;
            }
            .swiper-slide-active::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border: 1px solid var(--color-121212);
              box-shadow: inset 0 0 0 1px #fff;
              box-sizing: border-box;
            }
            .prev-arraw-vertical {
              left: 16px;
              top: 55px;
            }
            .next-arraw-vertical {
              right: 3px;
              top: 55px;
            }
            .arraw-icon {
              width: 14px;
              height: 14px;
              font-size: 14px;
              fill: #666;
            }
          }
          .comment-share {
            position: absolute;
            bottom: 34px;
            display: flex;
            align-items: center;
            .share-desc {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
