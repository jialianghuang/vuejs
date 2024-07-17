<template>
  <div class="img_show">
    <div class="big_img">
      <img v-if="showImg" :src="replaceImgCdnUrl(selectImg)" :alt="imgAlt" :class="[showType && showType[selectIndex]]" />
    </div>
    <div class="img_swipper">
      <a
        v-if="imgList.length > 4"
        href="javascript:void(0)"
        role="button"
        aria-label="prev"
        class="prev-arraw swiper-button-prev swiper-button-black"
      ></a>
      <div v-swiper:MPSwiper="MPSwiperOption" class="swiper-container swiper-no-swiping">
        <div class="swiper-wrapper">
          <div v-for="(item, index) in imgList" :key="index" class="swiper-slide">
            <div :class="{ isShowing: selectIndex == index }" class="slide_mask">
              <img :src="replaceImgCdnUrl(item)" :alt="imgAlt" :class="[showType[index]]" />
            </div>
          </div>
        </div>
      </div>
      <a
        v-if="imgList.length > 4"
        href="javascript:void(0)"
        role="button"
        aria-label="next"
        class="next-arraw swiper-button-next swiper-button-black"
      ></a>
    </div>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'

export default {
  name: 'RealWeddingImgsSwiper',
  mixins: [colorHex],
  props: {
    imgList: {
      type: Array,
      default() {
        return []
      }
    },
    showType: {
      type: Array,
      default() {
        return []
      }
    },
    linkTarget: {
      type: String,
      default: '_blank'
    },
    imgAlt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectIndex: 0,
      timer: 0,
      showImg: true,
      MPSwiperOption: {
        slidesPerView: 4,
        spaceBetween: '0%',
        slidesPerGroup: 4,
        simulateTouch: false,
        loop: false,
        autoplay: false,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  computed: {
    selectImg() {
      return this.imgList[this.selectIndex]
    }
  },
  mounted() {
    document.querySelector('.img_show .img_swipper').addEventListener('click', (e) => {
      this.showImg = false
      clearTimeout(this.timer)
      const index = [...document.querySelectorAll('.img_show .img_swipper .slide_mask')].indexOf(e.target.closest('.slide_mask'))
      this.selectIndex = index === -1 ? this.selectIndex : index
      this.timer = setTimeout(() => {
        this.showImg = true
      }, 4)
    })
  }
}
</script>

<style lang="less" scoped>
.img_show {
  img {
    display: inline-block;
  }
  .big_img {
    height: 670px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
    img.byWidth {
      width: 100%;
    }
    img.byHeight {
      height: 100%;
    }
  }
  .img_swipper {
    position: relative;
    width: 858px;
    height: 140px;
    margin: 40px 0 50px;
    padding: 0 73px;
    .swiper-slide {
      display: flex;
      justify-content: flex-start;
      height: 140px;
      cursor: pointer;
      .slide_mask {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        box-sizing: border-box;
        width: 180px;
        height: 140px;
        border: 2px solid transparent;
        opacity: 0.6;
        &.isShowing {
          border-color: var(--color-121212);
          opacity: 1;
        }
        &:last-child {
          margin-right: 0;
        }
        img.byWidth {
          height: 100%;
        }
        img.byHeight {
          width: 100%;
        }
      }
    }
    .swiper-button {
      width: 11px;
      height: 18px;
      margin-top: -9px;
      background-size: 11px 18px;
    }
    .prev-arraw,
    .next-arraw {
      position: absolute;
      display: block;
      top: 46%;
      width: 11px;
      height: 18px;
      margin-top: -9px;
      background-size: 11px 18px;
      &.active {
        cursor: pointer;
      }
      &:focus {
        outline: none;
      }
    }
    .prev-arraw {
      left: -30px;
    }
    .next-arraw {
      right: -30px;
    }
  }
}
</style>
