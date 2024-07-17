<template>
  <div>
    <div v-show="!skeleton && loaded" v-track.view.click="{ common: getBiParams('review', 'review') }" class="index-reviews-b">
      <div v-swiper:commentsSwiper="commentsSwiperOption" @mouseenter="autoPlayStop" @mouseleave="autoPlayStart" class="swiper-box">
        <div class="swiper-wrapper">
          <div
            v-for="(it, idx) in item.bannerList"
            :key="idx"
            v-track.viewOnce.click="{
              id: 'reviewbanner_' + idx,
              view: getGAParams(it, idx, 'view'),
              click: getGAParams(it, idx, 'click')
            }"
            class="swiper-slide"
          >
            <a :href="countryUrl(it.linkUrl)" :target="it.newWindows ? '_blank' : '_self'">
              <img
                v-track.viewOnce="{ id: 'reviewIamge' + idx, common: getBiParams('review', idx + 1 + '_image') }"
                :src="addWebpSuffix(it.imageUrl)"
                @click="trackClick('review', idx + 1 + '_image', null, null, null, null, null, '/')"
                @load="imgLoad(it)"
                :style="getImgStyle(it)"
                alt="the AZAZIE"
                class="product-img"
              />
              <!-- <span class="the-azazie">the AZAZIE</span> -->
            </a>
            <div class="comment-main">
              <h2 v-if="it.goodsName" class="comment-title">{{ it.goodsName }}</h2>
              <az-rate :value="Number(it.goodsScore)" :readonly="true" font-size="20px"></az-rate>
              <p v-html="it.commentText" class="comment-des"></p>
              <span class="comment-user">{{ it.commentUserName }}</span>
              <a
                :href="countryUrl(decodeURIComponent(it.linkUrl))"
                v-track.view="{ id: 'reviewShopnow' + idx, common: getBiParams('review', idx + 1 + '_shopnow') }"
                @click="trackClick('review', idx + 1 + '_shopnow', null, null, null, null, null, '/')"
                class="shop-now"
                >{{ nl('page_index_shop_now') }}</a
              >
            </div>
          </div>
        </div>
        <div class="nav-box swiper-pagination">
          <az-icon class="swiper-button-prev swiper-nav-prev" icon-class="icon-lby_arrow_left" />
          <az-icon class="swiper-button-next swiper-nav-next" icon-class="icon-lby_arrow_right" />
        </div>
      </div>
    </div>
    <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import AzRate from '@/components/az-ui/Rate/AzRate'
import indexModuleMixins from '@/assets/js/indexModuleMixins'

/**
 * 首页新版评论模块
 */
export default {
  components: {
    AzRate
  },
  mixins: [indexModuleMixins],
  data() {
    return {
      commentsSwiperOption: {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        navigation: {
          nextEl: '.swiper-nav-next',
          prevEl: '.swiper-nav-prev'
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          speed: 500
        }
      }
    }
  },
  methods: {
    autoPlayStop() {
      this.commentsSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.commentsSwiper.autoplay.start()
    }
  }
}
</script>
<style lang="less" scoped>
.index-reviews-b {
  background: var(--color-f1e9e6);
  margin-top: 100px;
  .swiper-box {
    max-width: 1600px;
    margin: 0 auto;
    position: relative;
  }
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .product-img {
      width: 100%;
    }
    > a {
      position: relative;
      padding-left: 49px;
      width: 506px;
      height: 600px;
      overflow: hidden;
    }
    .the-azazie {
      position: absolute;
      left: 5px;
      top: 360px;
      font-family: @font-Ivy-Mode-400;
      font-style: italic;
      font-weight: 400;
      font-size: 60px;
      line-height: 75px;
      text-align: center;
      color: var(--color-121212);
      transform: rotate(-90deg);
      transform-origin: left top;
    }
    .comment {
      &-main {
        margin-left: 14%;
        width: 600px;
        /deep/ .az-rate-box {
          height: 20px;
          line-height: 20px;
          overflow: hidden;
        }
        .shop-now {
          display: inline-block;
          font-family: @font-family-600;
          margin-top: 40px;
          // font-size: 24px;
          font-size: 1.25vw;
          line-height: 33px;
          letter-spacing: 0.06em;
          text-decoration-line: underline;
          text-transform: uppercase;
          color: var(--color-121212);
          &:hover {
            color: var(--color-121212);
          }
        }
      }
      &-title {
        font-family: @font-Ivy-Mode-400;
        font-style: normal;
        font-weight: 400;
        font-size: 36px;
        line-height: 45px;
        text-transform: uppercase;
        margin-bottom: 18px;
      }
      &-des {
        font-family: @font-family-500;
        font-size: 18px;
        line-height: 25px;
        margin: 12px 0px 20px;
      }
      &-user {
        display: block;
        font-family: @font-family-600;
        font-size: 18px;
        line-height: 25px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
    }
  }
  .nav-box {
    position: absolute;
    bottom: 40px;
    right: 65px;
    font-size: 26px;
    z-index: 9;
    height: 26px;
    width: 89px;
    .az-icon {
      cursor: pointer;
      left: auto;
      right: 0px;
      top: auto;
      bottom: 0;
      background: none;
    }
    .swiper-nav-prev {
      left: 0px;
    }
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.46875;
  margin-top: 100px;
}
@media screen and (max-width: 1400px) {
  .index-reviews-b {
    .swiper-slide {
      .comment {
        &-main {
          .shop-now {
            font-size: 16px;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .index-reviews-b {
    .swiper-slide {
      .comment {
        &-main {
          .shop-now {
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>
