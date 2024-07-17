<template>
  <div>
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div :data-gallery-id="popupStyleGallery.popupStyleGalleryId" class="popup-gallery-info">
        <button @click="closeDialog" aria-label="Close button" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
        </button>
        <a @click="getGalleryInfo('prev')" v-show="!firstGallery && showSwitchButton" href="javascript:void(0)" class="pop-prev-arraw">
          <az-icon class="arraw-icon" icon-class="icon-xxy_arrow_left_m" />
        </a>
        <div id="gallery-info" class="popup-content">
          <div class="left-wrapper">
            <img :src="addWebpSuffix(galleryInfo.imgSrc)" :alt="galleryInfo.dressStyle" />
          </div>
          <div class="right-wrapper">
            <div class="header">
              <span class="name-time">
                <span v-if="galleryInfo.userName" style="text-transform: capitalize;">{{ galleryInfo.userName }},</span>
                <span> {{ galleryInfo.uploadTime }}</span>
              </span>
              <!-- <gallery-share :shareList="shareListInfo"></gallery-share> -->
              <az-share :shareList="shareListInfo" :fontSize="'30px'" :space="'0 15px 0 0'" class="gallery-share"></az-share>
            </div>
            <p v-html="galleryInfo.comment" class="comment"></p>
            <div v-if="galleryInfoAgg.prodList && Object.keys(galleryInfoAgg.prodList).length" class="goods-list">
              <div class="title">{{ nl('page_gallery_shop_the_look') }}</div>
              <div class="item-list">
                <product-swiper
                  v-if="galleryInfoAgg.prodList.length"
                  :prodList="galleryInfoAgg.prodList"
                  :nextEl="'rv-swiper-button-next'"
                  :prevEl="'rv-swiper-button-prev'"
                  :slidesPerView="2"
                >
                  <div ref="SLSwiper" v-swiper:SLSwiper="swiperOption" class="swiper-container">
                    <div class="swiper-wrapper product-swiper-viewport">
                      <div v-for="(item, index) in galleryInfoAgg.prodList" :key="index" @click="itemClick" class="swiper-slide goods-item">
                        <product-swiper-item :item="item" :index="index" :isGallery="true" :itemTarget="'_blank'"></product-swiper-item>
                      </div>
                    </div>
                  </div>
                </product-swiper>
              </div>
            </div>
            <div v-if="galleryInfoAgg.colors && Object.keys(galleryInfoAgg.colors).length" class="shop-color">
              <div class="header">
                <div class="title">
                  {{ nl('page_gallery_shop_the_color') }}
                </div>
                <div id="_order_swatch" class="order_swatch">{{ nl('page_gallery_order_swatches') }} >></div>
              </div>
              <div class="color-list">
                <div v-for="color in galleryInfoAgg.colors" :key="color.colorId" class="color-item">
                  <a :href="countryUrl(color.url)" target="_black">
                    <div :style="getColorStyle(color.color)" class="color"></div>
                    <div class="color-name">
                      <span v-if="color.isNew" class="new-color">{{ nl('page_common_new_capital') }}! </span>{{ color.shownColor }}
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a @click="getGalleryInfo('next')" v-show="!lastGallery && showSwitchButton" href="javascript:void(0)" class="pop-next-arraw">
          <az-icon class="arraw-icon" icon-class="icon-xxy_arrow_right_m" />
        </a>
      </div>
    </az-popup>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'
import azPopup from '@/components/az-ui/Popup/AzPopup'
// import GalleryShare from '@/components/styleGallery/GalleryShare'
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
import azShare from '@/components/az-ui/Share/AzShare'
import { mapState } from 'vuex'

export default {
  name: 'PopupStyleGallery',
  languageKeys: [
    'page_gallery_shop_the_look',
    'page_gallery_shop_the_color',
    'page_gallery_order_swatches',
    ...ProductSwiperItem.languageKeys
  ],
  components: {
    azPopup,
    // GalleryShare,
    ProductSwiperItem,
    ProductSwiper,
    azShare
  },
  mixins: [colorHex],
  props: {
    customPhotoPopList: {
      type: Array,
      default() {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    showSwitchButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        // spaceBetween: 14, // 入参number !!!
        simulateTouch: false,
        loop: false,
        loopFillGroupWithBlank: false,
        speed: 800,
        navigation: {
          nextEl: '.rv-swiper-button-next',
          prevEl: '.rv-swiper-button-prev'
        }
      }
    }
  },
  computed: {
    ...mapState('styleGallery', ['popupStyleGallery', 'galleryInfoAgg', 'galleryList', 'currentGalleryId', 'currentUrl']),
    galleryInfo() {
      return this.galleryInfoAgg.galleryInfo || {}
    },
    galleryIdList() {
      return (
        this.galleryList.map((item) => {
          return item.galleryId
        }) || []
      )
    },
    firstGallery() {
      return this.galleryIdList[0] == this.currentGalleryId
    },
    lastGallery() {
      return this.pageInfo.page >= this.pageInfo.totalPage && this.galleryIdList[this.galleryIdList.length - 1] == this.currentGalleryId
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
      const shareUrl = this.HTTPS_HOST + this.countryUrl(this.WEB_ROOT + this.galleryInfoAgg.shareUrl)
      const shareImg = this.galleryInfo.imgSrc
      const comment = this.galleryInfo.comment
      const pintComment = `${this.galleryInfo.comment} from the Azazie Style Gallery #AZAZIE #CustomDresses`
      const twitterText = `Loving this look from the Azazie Style Gallery! -www.azazie.com/style-gallery/${this.galleryInfo.galleryId} - @iheartazazie #AZAZIE #CustomDresses`
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
            encodeURIComponent(pintComment) +
            '&media=' +
            encodeURIComponent(shareImg) +
            '&is_video=false' +
            '&url=' +
            encodeURIComponent(shareUrl)
        }
        if (item.key == 'twitter') {
          url = 'http://twitter.com/share?text=' + twitterText + '&url=' + shareUrl
        }
        if (item.key == 'email') {
          url = 'mailto:?' + 'body=' + comment + '-' + shareUrl + 'subject=Loving this look from the Azazie Style Gallery!'
        }
        if (item.key == 'google') {
          item.dialog_height = 600
          item.dialog_width = 600
          url = 'https://plus.google.com/share?hl=en' + '&url=' + shareUrl
        }
        item.url = url
      })
      return shareList
    }
  },
  created() {},
  mounted() {},
  methods: {
    closeDialog() {
      this.$store.commit('styleGallery/setPopupStyleGalleryShow', { popupStyleGalleryShow: false, popupStyleGalleryId: 0 })
      history.pushState('', '', this.currentUrl)
    },
    itemClick() {},
    getGalleryInfo(type) {
      const currentIndex = this.galleryIdList.indexOf(this.currentGalleryId)
      if (currentIndex < 0) {
        return
      }
      if (type && type == 'prev') {
        if (currentIndex && this.galleryIdList[currentIndex * 1 - 1]) {
          this.$store.commit('styleGallery/setCurrentGalleryId', this.galleryIdList[currentIndex * 1 - 1])
          this.$emit('getGalleryInfo')
        }
      } else if (type && type == 'next') {
        if (this.galleryIdList[currentIndex * 1 + 1] && currentIndex > -1) {
          this.$store.commit('styleGallery/setCurrentGalleryId', this.galleryIdList[1 + currentIndex])
          this.$emit('getGalleryInfo')
        } else if (this.pageInfo.page < this.pageInfo.totalPage) {
          // 点击下一个，当前所有页面的数据完了之后，需要请求下一页的数据
          this.$emit('getGalleryList', [this.pageInfo.page * 1 + 1, 'getInfo'])
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.popup-gallery-info {
  width: 1015px;
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
  .pop-prev-arraw,
  .pop-next-arraw {
    position: absolute;
    display: block;
    top: 50%;
    transform: translateY(-50%);
    .arraw-icon {
      fill: currentColor;
      color: #fff;
      width: 32px;
      height: 32px;
    }
    &:hover {
      .arraw-icon {
        fill: currentColor;
        color: @theme-color;
      }
    }
  }
  .pop-prev-arraw {
    left: -46px;
  }
  .pop-next-arraw {
    right: -46px;
  }
  .popup-content {
    background: #fff;
    height: 681px;
    padding: 40px 30px;
    .left-wrapper {
      float: left;
      width: 400px;
      text-align: center;
      background: #f1f1f1;
      height: 100%;
      position: relative;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
      }
    }
    .right-wrapper {
      float: left;
      margin-left: 35px;
      width: 480px;
      .comment {
        max-height: 75px;
        overflow: auto;
        margin-top: 20px;
      }
      .goods-list {
        margin-top: 25px;
        .title {
          color: var(--color-121212);
          font-family: @font-family-600, sans-serif;
          font-size: 16px;
          text-align: left;
        }
        .item-list {
          margin: 19px auto 0;
          width: calc(~'100% - 35px');
        }
        /deep/.product-swiper-container {
          padding: 0 !important;
          .arraw-icon {
            width: 18px;
            height: 18px;
          }
          .prev-arraw,
          .next-arraw {
            display: block;
            cursor: pointer;
            background-image: none;
            width: auto;
            height: auto;
            top: 91px !important;
            &.swiper-button-disabled {
              cursor: default;
            }
            &:focus {
              outline: none;
            }
          }
          .prev-arraw {
            left: -25px !important;
          }
          .next-arraw {
            right: -25px !important ;
          }
        }
        /deep/ .swiper-item-wrapper {
          padding: 0 6.5px;
        }
        /deep/.goods-item-a {
          .img-box {
            margin-bottom: 15px;
          }
          .goods-name {
            font-family: @font-family-600, sans-serif;
            margin-bottom: 5px;
          }
          .goods-color {
            margin-bottom: 5px;
          }
        }
      }
      .shop-color {
        margin-top: 25px;
        .header {
          text-align: left;
          .title {
            font-size: 16px;
            color: var(--color-121212);
            font-family: @font-family-600, sans-serif;
            font-weight: 400;
            display: inline-block;
          }
          .order_swatch {
            display: none;
            float: right;
            margin-right: 50px;
            cursor: pointer;
            font-weight: 400;
          }
        }
        .color-list {
          text-align: left;
          display: flex;
          flex-wrap: wrap;
          justify-content: left;
          .color-item {
            box-sizing: border-box;
            width: 70px;
            margin-top: 20px;
            margin-right: 10px;
            &:hover {
              .color-name {
                color: @theme-color;
              }
            }
            .color {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              margin: 0 auto;
            }
            .color-name {
              text-transform: capitalize;
              line-height: 20px;
              text-align: center;
              display: inline-block;
              vertical-align: top;
              width: 100%;
              // white-space: nowrap;
              font-size: 12px;
              font-weight: 400;
              margin-top: 2px;
              // text-overflow: ellipsis;
              // overflow: hidden;
              color: var(--color-121212);
              word-break: break-word;
            }
          }
        }
      }
      .gallery-share {
        display: inline-block;
        margin-left: 25px;
        vertical-align: middle;
      }
    }
  }
}
</style>
