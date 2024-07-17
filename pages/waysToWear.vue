<template>
  <div class="ways-to-wear">
    <main-app :navigation="navigation">
      <div class="terms-of-use-main">
        <div class="ways-wear-wrapper">
          <div class="bg">
            <img :src="require(`~/assets/images/ways_to_wear/${way}.jpg`)" alt="ways_to_wear" />
          </div>
          <template v-if="way == 'new_way1'">
            <span :key="num" :class="`box_${num}`" v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" class="video_box">
              <span :data-value="num" :class="`video_${num}`" @click="handlePop(num)" class="video_btn video_1"></span>
            </span>
          </template>
          <a :class="way" :href="$route.query.back" class="btn shop_now_btn"><span>shop now</span><span class="arrow_right"></span> </a>
        </div>
        <div v-if="prodList && Object.keys(prodList).length" class="same-wear-ways-clothes">
          <div class="ways-to-wear-title">
            <span class="line"></span>
            <h2>{{ nl('page_ways_to_wear_text') }}</h2>
          </div>
          <div class="clothes-list-box">
            <product-swiper
              v-if="prodList.length"
              :prodList="prodList"
              :nextEl="'rv-swiper-button-next'"
              :prevEl="'rv-swiper-button-prev'"
              :slidesPerView="2"
            >
              <div ref="SLSwiper" v-swiper:SLSwiper="swiperOption" class="swiper-container">
                <div class="swiper-wrapper product-swiper-viewport">
                  <div v-for="(item, index) in prodList" :key="index" class="swiper-slide goods-item">
                    <div>
                      <a :href="item.goodsUrl" target="_blank">
                        <div class="pic">
                          <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.shownGoodsName" />
                        </div>
                        <!-- 颜色 -->
                        <div class="goods-colors">
                          <span class="cat-switch-color">
                            <a
                              v-for="(colorItem, color_index) in item.colorSwitch"
                              :key="color_index"
                              :class="[colorItem.color]"
                              :style="getColorStyle(colorItem.color, 'square')"
                              @click.stop.prevent="colorSwitchClick(colorItem, index)"
                            >
                              <span style="display:none">{{ colorItem.shownColor }}</span>
                            </a>
                          </span>
                          <a class="more">
                            {{ item.colorNumber }}
                            <span v-if="item.colorNumber == 1">{{ nl('page_common_color') }}</span>
                            <span v-else>{{ nl('page_common_colors') }}</span>
                          </a>
                        </div>
                        <div class="list-goods-name">{{ item.shownGoodsName }}</div>
                        <div class="price">
                          <template v-if="item.hasLinePrice">
                            <div class="goods-price goods-price-box">
                              <p class="current-price">{{ item.shopPriceDisplay }}</p>
                              <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
                            </div>
                          </template>
                          <template v-else>
                            <div class="goods-price">{{ item.shopPriceDisplay }}</div>
                          </template>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </product-swiper>
          </div>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
    <!-- 弹窗 -->
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog" v-if="showPop && popNum">
      <div class="popup-pannier ">
        <div @click="closeDialog()" class="close-popup"></div>
        <div class="popup-content">
          <img :src="require(`~/assets/images/ways_to_wear/video_poster_${popNum}.jpg`)" alt="video poster" style="display: none" />
          <video
            id="pannierVideo"
            :poster="require(`~/assets/images/ways_to_wear/video_poster_${popNum}.jpg`)"
            preload="auto"
            width="640"
            height="382"
            data-setup="{}"
            controls=""
            loop
          >
            <source :src="`https://dojygcq45t31s.cloudfront.net/upimg/userfiles/multiway/1122/${popNum}.mp4`" type="video/mp4" />
          </video>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import azPopup from '@/components/az-ui/Popup/AzPopup'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import ProductSwiper from '@/components/product/ProductSwiper'
import colorHex from '@/assets/js/colorHex'
export default {
  name: 'WaysToWear',
  components: {
    MainApp,
    backToTop,
    azPopup,
    ProductSwiper
  },
  mixins: [colorHex],
  data() {
    return {
      showPop: false,
      popNum: 0,
      swiperOption: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 14, // 入参number !!!
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
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      let currentUrl = ''
      if (context.store && context.store.state) {
        currentUrl = context.store.state.HTTPS_HOST + commonAsyncData.requestUrl
      }
      const params = {
        goods_name: query.goods_name,
        current_url: currentUrl
      }
      const res = await context.$axios.$get(`/1.0/ways-to-wear`, { params })
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
      context.store.commit('setJsKey', 'ways_to_wear')
      // const goodsNameUrl = ['azazie-nessa-bridesmaid-dress', 'azazie-yesenia-bridesmaid-dress', 'azazie-stella-bridesmaid-dress']
      // if (params.hasOwnProperty('goods_name') && goodsNameUrl.includes(query.goods_name)) {
      //   res.data.seoInfo.canonicalUrl = 'https://www.azazie.com/convertible-dress/azazie-nessa-bridesmaid-dress'
      // }
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        prodList: res.data.prodList || [],
        way: res.data.way
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
    this.getColorHexAjax()
  },
  mounted() {},
  methods: {
    handlePop(num) {
      this.popNum = num
      this.showPop = true
    },
    closeDialog() {
      this.showPop = false
    },
    // 颜色选择
    colorSwitchClick(colorItem, productIndex) {
      const tempProdList = JSON.parse(JSON.stringify(this.prodList))
      const tempProdListItem = tempProdList[productIndex]
      tempProdListItem.shownGoodsName = colorItem.shownGoodsName
      tempProdListItem.color = colorItem.color
      tempProdListItem.showColor = colorItem.showColor
      tempProdListItem.goodsUrl = colorItem.linkUrl
      tempProdListItem.imgUrl = colorItem.imgUrl
      tempProdList[productIndex] = tempProdListItem
      this.prodList = JSON.parse(JSON.stringify(tempProdList))
    }
  }
}
</script>

<style lang="less" scoped>
.terms-of-use-main {
  width: 1004px;
  clear: both;
  padding: 9px 0 20px;
  min-height: 535px;
  margin: 0 auto;
  .ways-wear-wrapper {
    position: relative;
    border-top: 3px solid #f1f1f1;
    margin-top: -12px;
    margin-bottom: 20px;
    min-height: 800px;
    .video_box {
      width: 300px;
      height: 300px;
      .video_btn {
        display: inline-block;
        background-size: contain;
        width: 68px;
        height: 68px;
        background-image: data-uri('~assets/images/icon_video_play.png');
        cursor: pointer;
      }
      .video_1 {
        position: relative;
        top: 30px;
        left: 148px;
      }
      .video_2 {
        position: relative;
        top: 33px;
        left: 173px;
      }
      .video_3 {
        position: relative;
        top: 23px;
        left: 200px;
      }
      .video_4 {
        position: relative;
        top: 15px;
        left: 154px;
      }
      .video_5 {
        position: relative;
        top: 18px;
        left: 177px;
      }
      .video_6 {
        position: relative;
        top: 29px;
        left: 180px;
      }
      .video_7 {
        position: relative;
        top: 26px;
        left: 172px;
      }
      .video_8 {
        position: relative;
        top: 20px;
        left: 170px;
      }
      .video_9 {
        position: relative;
        top: 14px;
        left: 204px;
      }
      .video_10 {
        position: relative;
        top: 36px;
        left: 179px;
      }
    }
    .box_1 {
      position: absolute;
      top: 220px;
      right: 200px;
    }
    .box_2 {
      position: absolute;
      top: 561px;
      left: 0;
    }
    .box_3 {
      position: absolute;
      top: 870px;
      right: 200px;
    }
    .box_4 {
      position: absolute;
      top: 1192px;
      left: 0;
    }
    .box_5 {
      position: absolute;
      top: 1500px;
      right: 200px;
    }
    .box_6 {
      position: absolute;
      top: 1828px;
      left: 0;
    }
    .box_7 {
      position: absolute;
      top: 2108px;
      right: 200px;
    }
    .box_8 {
      position: absolute;
      top: 2449px;
      left: 0;
    }
    .box_9 {
      position: absolute;
      top: 2840px;
      right: 200px;
    }
    .box_10 {
      position: absolute;
      top: 3200px;
      left: 0;
    }
  }
  .shop_now_btn {
    cursor: pointer;
    position: absolute;
    bottom: 252px;
    text-transform: uppercase;
    display: inline-block;
    color: var(--color-121212);
    width: 260px;
    height: 60px;
    border: 1px solid #d6d6d6;
    border-radius: 2px;
    background-color: var(--color-f9f9f9);
    box-sizing: border-box;
    line-height: 60px;
    text-align: center;
    &.new_way1 {
      right: 160px;
    }
    &.new_way2 {
      left: 37px;
    }
    .arrow_right {
      display: inline-block;
      margin-left: 3px;
      border-top: 3px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 6px solid;
      position: relative;
      bottom: 3px;
      left: 4px;
    }
    &:hover {
      color: #ffffff;
      background-color: #fccece;
      border: none;
    }
    span {
      font-family: @font-family-600, sans-serif;
      font-size: 20px;
    }
  }
  .same-wear-ways-clothes {
    .ways-to-wear-title {
      margin: 30px auto 40px;
      .line {
        width: 100%;
        height: 1px;
        background: #ccc;
        display: block;
      }
      h2 {
        margin: -19px auto;
        text-align: center;
        background: #fff;
        width: 450px;
        font-size: 23px;
        color: var(--color-121212);
      }
    }
    .clothes-list-box {
      margin: 0 73px;
      width: 858px;
      height: 440px;
      padding-top: 40px;
      text-align: center;
      .goods-item {
        .pic {
          width: 240px;
          height: 332px;
          margin-bottom: 13px;
          position: relative;
          img {
            width: 100%;
            vertical-align: top;
          }
        }
        .goods-colors {
          margin: 9px 0 8px;
          text-align: center;
          line-height: 17px;
          height: 17px;
          a {
            display: inline-block;
            vertical-align: top;
          }
          .more {
            font-style: italic;
            .text-link(@gray);
            font-style: normal;
            text-transform: lowercase;
          }
          .cat-switch-color {
            a {
              width: 17px;
              height: 17px;
              margin: 0 4px;
              border-radius: 50px;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
        .list-goods-name {
          font-weight: 400;
          text-align: center;
          color: var(--color-121212);
          cursor: pointer;
        }
        .goods-price {
          color: var(--color-121212);
          display: inline-block;
          line-height: 21px;
          text-align: center;
          font-size: 15px;
          margin-top: 4px;
          &.goods-price-box {
            font-size: 0;
          }
          .current-price {
            color: var(--color-121212);
            font-family: @font-family-600;
            font-size: 16px;
            line-height: 22px;
            display: inline-block;
          }
          .no-deal-price {
            color: var(--color-999999);
            text-decoration: line-through;
            font-size: 13px;
            margin-left: 5px;
            display: inline-block;
          }
        }
      }
      /deep/.product-swiper-container {
        padding: 0 23px !important;
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
    }
  }
}
/deep/.az-popup-box {
  overflow-y: unset !important;
}
.popup-pannier {
  width: 640px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  margin: auto;
  background-color: var(--color-121212);
  .close-popup {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 24px;
    height: 24px;
    background: data-uri('~assets/images/icon-close.png');
    background-size: 100% 100%;
    z-index: 1;
  }
}
</style>
