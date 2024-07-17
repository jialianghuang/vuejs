<template>
  <a class="goods-item-a" aria-label="goods img">
    <div class="img-box">
      <az-icon v-if="item.type == 'video'" icon-class="az-review-play-icon" class="az-play-icon"></az-icon>
      <img
        :src="require('~/assets/images/default_img.jpg')"
        :data-src="addWebpSuffix(item.imgUrl)"
        :ref="`reviewImg${item.index}`"
        @load="reviewImgLoad(item.index)"
        :style="isSpecialCatId(catId) ? {} : customerPhotoStyleInfo"
        alt="goods img"
        class="goods-img lazyload"
      />
    </div>
  </a>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CustomerSwiperItem',
  props: {
    item: {
      type: Object,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      customerPhotoStyleInfo: {}
    }
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {},
  methods: {
    reviewImgLoad(index) {
      // this.customerPhotoStyleInfo = {}
      // const curImg = this.$refs[`reviewImg${index}`]
      // if (curImg && curImg.src && curImg.src.includes('http')) {
      //   const boxWidth = 169
      //   const boxHeight = 228
      //   const imgScale = curImg.naturalWidth / curImg.naturalHeight
      //   let width, height, marginLeft, marginTop
      //   if (curImg.naturalWidth > curImg.naturalHeight) {
      //     height = boxHeight
      //     width = boxHeight * imgScale
      //     marginLeft = `${(boxWidth - width) / 2}`
      //   } else {
      //     width = boxWidth
      //     height = boxHeight / imgScale
      //     marginTop = `${(boxHeight - height) / 2}`
      //   }
      //   this.customerPhotoStyleInfo = {
      //     width: `${width}px`,
      //     height: `${height}px`
      //   }
      //   if (marginLeft) this.customerPhotoStyleInfo['margin-left'] = `${marginLeft}px`
      //   if (marginTop) this.customerPhotoStyleInfo['margin-top'] = `${marginTop}px`
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.product-swiper {
  .product-swiper-container {
    padding: 0 36px;
    margin: 30px 0 10px;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    .arraw-icon {
      width: 18px;
      height: 18px;
    }
    .prev-arraw,
    .next-arraw {
      position: absolute;
      display: block;
      top: 126px;
      cursor: default;
      background-image: none;
      width: auto;
      height: auto;
      &.active {
        cursor: pointer;
      }
      &:focus {
        outline: none;
      }
    }
    .prev-arraw {
      left: -4px;
    }
    .next-arraw {
      right: -4px;
    }
  }
  .goods-item {
    cursor: pointer;
    display: inline-block;
    width: auto;
    .goods-item-a {
      color: var(--color-121212);
      font-size: 13px;
      .img-box {
        width: 169px;
        // height: 228px;
        position: relative;
        overflow: hidden;
        .goods-img {
          width: 100%;
          object-fit: cover;
          height: 228px;
        }
        .az-play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 36px;
        }
      }
    }
  }
}
</style>
