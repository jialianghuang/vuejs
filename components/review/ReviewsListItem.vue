<template>
  <div :data-comment-id="info.id" class="review_item">
    <div class="goods_img_div">
      <a :href="info.goodsInfo.goodsUrl" :aria-label="info.goodsInfo.shownGoodsName + itemIndex">
        <img :src="addWebpSuffix(info.goodsInfo.goodsThumb)" :alt="info.goodsInfo.shownGoodsName" />
      </a>
      <span>{{ info.goodsInfo.shownGoodsName }}</span>
    </div>
    <div class="goods_review">
      <div class="grlr-details">
        <div class="all_rating">
          <az-rate
            :value="info.rating * 1"
            :readonly="true"
            :showScore="false"
            space="0 1px 0 0"
            font-size="12px"
            style="height: 12px;margin-top: 5px;margin-left: 0px;margin-right: 15px;"
          ></az-rate>
          <template v-if="!fitCatIds.includes(info.goodsInfo.catId)">
            <template v-if="info.fit">
              <label>{{ nl('page_goods_fit') }}</label>
              <div class="fit_pic">
                <div :class="[`fit_${info.fit}`]" class="red_point fl">
                  <div v-if="info.fit == 1" class="fit_text">{{ nl('page_review_fit_small') }}</div>
                  <div v-if="info.fit == 2" class="fit_text">{{ nl('page_review_fit_slightlysmall') }}</div>
                  <div v-if="info.fit == 3" class="fit_text">{{ nl('page_review_fit_right') }}</div>
                  <div v-if="info.fit == 4" class="fit_text">{{ nl('page_review_fit_slightlylarge') }}</div>
                  <div v-if="info.fit == 5" class="fit_text">{{ nl('page_review_fit_large') }}</div>
                </div>
              </div>
            </template>
          </template>
          <span class="name_time"> {{ nl('page_goods_by') }} {{ info.name }} {{ nl('page_common_on') }} {{ info.time }}</span>
        </div>
        <div v-if="!fitCatIds.includes(info.goodsInfo.catId)" class="fit_info">
          <strong v-if="info.bodyType" class="body_type">{{ nl('page_shop_by_option_body_type') }}: </strong
          ><span v-if="info.bodyType">{{ info.bodyType }}</span> <br />
          <strong v-if="info.shownName">{{ nl('page_customer_size_ordered') }}: </strong
          ><span v-if="info.shownName">{{ info.shownName }}</span> <br />
          <div :class="{ body_size: true, clearfix: true, body_boder: sizeDetailSort.length }">
            <div v-for="itemSize in sizeDetailSort" :key="itemSize.key" class="size">
              <div class="size_title">{{ itemSize.name }}</div>
              <div class="size_text">{{ itemSize.value }}</div>
            </div>
          </div>
        </div>
        <div :class="{ 'show-trans-txt': showTransTxt }" class="prlr-text">
          <svg class="icon icon-left">
            <use xlink:href="#icon-xxy_quotation_marks_left1"></use></svg
          >{{ info.txt }}

          <template v-if="language != setLangCode(info.languageCode)">
            <div class="review-trans-box">
              <div
                @click="handleTransReview(info)"
                v-show="!showTransTxt"
                :class="{ 'trans-loading': translateLoading }"
                class="review-trans-icon-box"
              >
                <az-icon icon-class="icon-Translate1" class="trans-icon"></az-icon>
                <span class="txt">{{ nl('page_common_translate') }}</span>
              </div>
              <div v-show="showTransTxt" class="review-trans-text-box">
                <div @click="handleCloseTrans(info)" class="review-trans-close">
                  <az-icon icon-class="icon-icon_style_gallery_off" class="trans-close-icon"></az-icon>
                </div>
                <div v-html="translateTxt" class="review-trans-text"></div>
                <div class="review-trans-by">
                  <span class="txt">{{ nl('page_common_translated_by') }}</span>
                  <az-icon icon-class="icon-google_logo" class="google-logo-icon"></az-icon>
                </div>
              </div>
            </div>
          </template>
          <svg class="icon icon-right">
            <use xlink:href="#icon-xxy_quotation_marks_right"></use>
          </svg>
        </div>
        <div class="prlr-photos carousel">
          <a
            v-show="totalPhotoSlide"
            :class="{ active: curPhotoSlideIndex != 0 }"
            @click="prevPhotoClick"
            href="javascript:void(0)"
            class="prev-arraw"
            aria-label="prev"
          >
            <svg class="icon">
              <use xlink:href="#icon-lby_arrow_left"></use>
            </svg>
          </a>
          <div class="viewport">
            <ul ref="photoBox" :style="{ marginLeft: `${photoBoxMarginLeft}px` }">
              <li v-for="(image, index) in info.images" :key="`${image}_${index}`" @click="openPreview(index)">
                <a :data-lightbox="`lb_${itemIndex}`" target="_blank" aria-label="review image">
                  <img
                    v-lazy="replaceImgCdnUrl(image)"
                    :ref="`reviewImg${index}`"
                    @load="reviewImgLoad(index)"
                    alt="review image"
                    class="gtm-review-images"
                  />
                </a>
              </li>
            </ul>
          </div>
          <a
            v-show="totalPhotoSlide"
            :class="{ active: curPhotoSlideIndex != totalPhotoSlide }"
            @click="nextPhotoClick"
            href="javascript:void(0)"
            class="next-arraw"
            aria-label="next"
          >
            <svg class="icon">
              <use xlink:href="#icon-lby_arrow_right"></use>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AzRate from '@/components/az-ui/Rate/AzRate'
export default {
  name: 'ReviewsListItem',
  components: {
    AzRate
  },
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    itemIndex: {
      type: Number,
      default: 0
    },
    fitCatIds: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      curPhotoSlideIndex: 0,
      photoBoxMarginLeft: 0,
      voteSelect: '',
      sizeSort: ['bust', 'waist', 'hips', 'height'],
      showTransTxt: false,
      translateTxt: '',
      translateLoading: false
    }
  },
  computed: {
    totalPhotoSlide() {
      return this.info.images && Math.ceil(this.info.images.length / 2) - 1
    },
    sizeDetailSort() {
      const res = []
      this.sizeSort.forEach((item) => {
        if (this.info && this.info.sizeDetail) {
          this.info.sizeDetail.forEach((sizeItem) => {
            if (item == sizeItem.key) {
              res.push(sizeItem)
            }
          })
        }
      })
      return res
    }
  },
  created() {},
  mounted() {
    this.$refs.photoBox.style.width = `${(this.totalPhotoSlide + 1) * 89 * 2}px`
  },
  methods: {
    prevPhotoClick() {
      if (this.curPhotoSlideIndex == 0) return
      this.curPhotoSlideIndex--
      let length = 89 * 2
      const timer = setInterval(() => {
        length -= 10
        if (length > 0) {
          this.photoBoxMarginLeft = this.photoBoxMarginLeft + 10
        } else {
          clearInterval(timer)
          this.photoBoxMarginLeft = this.photoBoxMarginLeft + (10 + length)
        }
      }, 5)
    },
    nextPhotoClick() {
      if (this.curPhotoSlideIndex == this.totalPhotoSlide) return
      this.curPhotoSlideIndex++
      let length = 89 * 2
      const timer = setInterval(() => {
        length -= 10
        if (length > 0) {
          this.photoBoxMarginLeft = this.photoBoxMarginLeft - 10
        } else {
          clearInterval(timer)
          this.photoBoxMarginLeft = this.photoBoxMarginLeft - (10 + length)
        }
      }, 5)
    },
    openPreview(val) {
      this.$emit('openPreview', {
        index: val,
        list: this.info.images
      })
    },
    reviewImgLoad(index) {
      const curImg = this.$refs[`reviewImg${index}`][0]
      if (curImg && curImg.src && curImg.src.includes('http')) {
        const boxWidth = 74
        const boxHeight = 102
        const boxScale = boxWidth / boxHeight
        const imgScale = curImg.naturalWidth / curImg.naturalHeight
        let width, height
        if (
          (boxWidth <= curImg.naturalWidth && boxHeight <= curImg.naturalHeight) ||
          (boxWidth >= curImg.naturalWidth && boxHeight >= curImg.naturalHeight)
        ) {
          if (boxScale < imgScale) {
            height = boxHeight
            width = boxHeight * imgScale
            curImg.style.marginLeft = `${(boxWidth - width) / 2}px`
          } else if (boxScale > imgScale) {
            width = boxWidth
            height = boxWidth / imgScale
            curImg.style.marginTop = `${(boxHeight - height) / 2}px`
          }
        } else if (boxWidth > curImg.naturalWidth) {
          width = boxWidth
          height = boxWidth / imgScale
          curImg.style.marginTop = `${(boxHeight - height) / 2}px`
        } else if (boxHeight > curImg.naturalHeight) {
          height = boxHeight
          width = boxHeight * imgScale
          curImg.style.marginLeft = `${(boxWidth - width) / 2}px`
        }
        curImg.style.width = `${width}px`
        curImg.style.height = `${height}px`
      }
    },
    handleTransReview(info = {}) {
      if (this.translateLoading) return false
      if (this.translateTxt) {
        this.showTransTxt = true
        return false
      }
      const params = {
        content: info.txt
      }
      this.translateLoading = true
      this.$axios
        .$post(`/1.0/product/comment/translate`, params)
        .then((res) => {
          if (res.code == 0 && res.data) {
            this.translateTxt = res.data.translate
            this.showTransTxt = true
          } else {
            this.translateTxt = ''
            this.showTransTxt = false
          }
        })
        .finally(() => {
          this.translateLoading = false
        })
    },
    handleCloseTrans(info) {
      this.showTransTxt = false
    },
    setLangCode(code) {
      return code || 'en'
    }
  }
}
</script>

<style lang="less" scoped>
.review_item {
  display: flex;
  justify-content: space-between;
  margin: 25px auto 0 auto;
  &:not(:last-of-type) {
    border-bottom: 1px dotted #d3d3d3;
  }
}

.goods_img_div {
  text-align: center;
  width: 143px;
  padding-bottom: 18px;
  img {
    width: 143px;
  }
}

.goods_review {
  width: 628px;
  padding-bottom: 25px;
}

.all_rating {
  height: 40px;
  display: flex;
  label {
    margin: 5px 15px 0 0;
  }
  .fit_pic {
    margin: 10px 0;
    width: 164px;
    height: 8px;
    background: url(~assets/images/seo_sprite_20190129.png) -38px -32px no-repeat;
  }
  .red_point {
    margin-top: -1px;
    width: 10px;
    height: 10px;
    background-color: @theme-color;
    border-radius: 50%;
  }
  .fit_1 {
    position: relative;
    margin: -1px 0 0 -5px;
    width: 10px;
    height: 10px;
    background-color: @theme-color;
    border-radius: 50%;
  }
  .fit_2 {
    position: relative;
    margin: -1px 0 0 36px;
    width: 10px;
    height: 10px;
    background-color: @theme-color;
    border-radius: 50%;
  }
  .fit_3 {
    position: relative;
    margin: -1px 0 0 77px;
    width: 10px;
    height: 10px;
    background-color: @theme-color;
    border-radius: 50%;
  }
  .fit_4 {
    position: relative;
    margin: -1px 0 0 118px;
    width: 10px;
    height: 10px;
    background-color: @theme-color;
    border-radius: 50%;
  }
  .fit_5 {
    position: relative;
    margin: -1px 0 0 159px;
    width: 10px;
    height: 10px;
    background-color: @theme-color;
    border-radius: 50%;
  }
  .fit_text {
    position: absolute;
    top: 10px;
    left: -5px;
    min-width: 50px;
  }
  .name_time {
    position: relative;
    margin-right: 15px;
    float: left;
    margin: 3px 40px 0 20px;
  }
}
.fit_info {
  margin-top: 15px;
  margin-bottom: 8px;
  .body_type {
    text-transform: capitalize;
  }
  .body_size {
    background-color: var(--color-f9f9f9);
    margin-top: 16px;
    width: fit-content;
  }
  .body_boder {
    border: 5px solid var(--color-f9f9f9);
  }
  .size {
    float: left;
    min-width: 50px;
    height: 60px;
    text-align: center;
    .size_title {
      font-family: @font-family-600, sans-serif;
      width: 100%;
      height: 30px;
      padding-right: 10px;
      line-height: 30px;
    }
    .size_text {
      height: 30px;
      line-height: 30px;
      background-color: #fff;
    }
  }
}
.prlr-text {
  position: relative;
  padding: 29px 21px 35px 40px;
  z-index: 0;
  font-size: 13px;
  line-height: 22px;
  word-break: keep-all;
  &.show-trans-txt {
    padding: 29px 21px 48px 40px;
  }
  .icon {
    width: 39px;
    height: 29px;
    position: absolute;
    fill: currentColor;
    color: #eee;
  }
  .icon-left {
    left: 0px;
    top: 5px;
  }
  .icon-right {
    bottom: 10px;
    right: 0;
  }
  .review-trans-box {
    .review-trans-icon-box {
      cursor: pointer;
      margin-top: 5px;
      display: inline-block;
      font-size: 0;
      .trans-icon {
        font-size: 12px;
        fill: currentColor;
        color: @theme-color;
        vertical-align: middle;
      }
      .txt {
        font-size: 13px;
        line-height: 18px;
        color: @theme-color;
        vertical-align: middle;
        margin-left: 5px;
        text-transform: capitalize;
      }
      &.trans-loading {
        cursor: default;
        color: #999;
        .trans-icon {
          fill: currentColor;
          color: #999;
        }
        .txt {
          color: #999;
        }
      }
    }
    .review-trans-text-box {
      margin-top: 10px;
      padding: 20px 15px 15px;
      background: var(--color-f9f9f9);
      position: relative;
      .review-trans-close {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
        line-height: 10px;
        .trans-close-icon {
          font-size: 10px;
          fill: currentColor;
          color: var(--color-999999);
        }
      }
      .review-trans-text {
        font-size: 13px;
        line-height: 22px;
        color: var(--color-666666);
      }
      .review-trans-by {
        text-align: right;
        margin-top: 5px;
        line-height: 16px;
        .txt {
          color: var(--color-999999);
          font-size: 12px;
          line-height: 16px;
        }
        .google-logo-icon {
          width: 39px;
          height: 13px;
          vertical-align: middle;
        }
      }
    }
  }
}

.prlr-photos {
  flex-shrink: 0;
  position: relative;
  width: 178px;
  height: 102px;
  padding: 6px 30px 0 20px;
  .viewport {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  ul,
  li {
    height: 100%;
  }
  li {
    width: 74px;
    height: 102px;
    margin: 0 10px;
    float: left;
    overflow: hidden;
    a {
      display: block;
      width: 74px;
      height: 102px;
      img {
        cursor: pointer;
        width: 100%;
      }
    }
  }
  .prev-arraw,
  .next-arraw {
    position: absolute;
    top: 46px;
    width: 18px;
    height: 18px;
    text-align: center;
    font-weight: bold;
    color: #ccc;
    &.active {
      color: var(--color-121212);
    }
    .icon {
      fill: currentColor;
      width: 18px;
      height: 18px;
    }
  }
  .prev-arraw {
    left: -4px;
  }
  .next-arraw {
    right: -4px;
  }
}
</style>
