<template>
  <div :data-comment-id="info.id" class="prl-review review_item">
    <div class="prlr-details">
      <div v-if="info.isMyReview" class="my-review">{{ nl('page_goods_your_review') }}</div>
      <div class="name">{{ info.name }}</div>
      <p>
        <strong>{{ nl('page_review_desc') }}</strong>
        {{ info.time }}
      </p>
      <p v-if="info.color">
        <strong>{{ nl('page_common_color') }}: </strong>
        {{ info.color }}
      </p>
      <template v-if="!fitCatIds.includes(baseInfo.catId)">
        <p v-if="info.bodyType">
          <strong>{{ nl('page_shop_by_option_body_type') }}: </strong>
          {{ info.bodyType }}
        </p>
        <p v-if="info.shownName || info.sizeFreeStyle">
          <strong>{{ nl('page_customer_size_ordered') }}: </strong>
          {{ info.sizeFreeStyle ? nl('page_goods_custom_size') : info.shownName }}
        </p>
        <div v-if="sizeDetailSort.length" class="body_size">
          <div v-for="itemSize in sizeDetailSort" :key="itemSize.key" class="size">
            <div class="size_title">{{ itemSize.name }}</div>
            <div v-if="['US', 'GB'].includes(country)" class="size-detail-box">
              <p>
                <span>{{ itemSize.value }}</span>
                <span v-if="!hideInfo(info, itemSize)">in</span>
              </p>
              <p v-if="!hideInfo(info, itemSize)">
                <span>({{ itemSize.cmValue }} cm)</span>
              </p>
            </div>
            <div v-else class="size-detail-box">
              <p>
                <span>{{ itemSize.cmValue }}</span>
                <span v-if="!hideInfo(info, itemSize)">cm</span>
              </p>
              <p v-if="!hideInfo(info, itemSize)">
                <span>({{ itemSize.value }} in)</span>
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="prlr-text-wrap">
      <div class="all_rating">
        <az-rate
          :value="info.rating * 1"
          :readonly="true"
          :showScore="false"
          space="0 1px 0 0"
          font-size="12px"
          style="height: 12px;margin: 4px 10px 0 20px;"
        ></az-rate>
        <template v-if="!fitCatIds.includes(baseInfo.catId)">
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
      </div>
      <div :class="{ 'show-trans-txt': showTransTxt }" class="prlr-text">
        <svg class="icon icon-left">
          <use xlink:href="#icon-review-item-marks-left"></use>
        </svg>
        {{ info.txt }}
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
          <use xlink:href="#icon-review-item-marks-right"></use>
        </svg>
        <div v-if="info.reply" class="reBack border_radius">
          <p class="replyInfo">
            <strong>{{ nl('page_goods_reply_by_site') }}</strong>
            <span>{{ info.repliedDatetime }}</span>
          </p>
          <div class="answerContent">
            <p :class="info.replyTranslation ? 'hide' : 'show'" class="translated">{{ info.replyTranslation }}</p>
            <p :class="info.replyTranslation ? 'hide' : 'show'" class="no_translated">{{ info.reply }}</p>
          </div>
        </div>
        <div v-if="info.replyCustom" class="rely_custom">
          <span class="tip">{{ nl('page_js_azazie') }}:</span>
          <span>{{ info.replyCustom }}</span>
        </div>
      </div>
      <div class="review_vote">
        <div class="review_txt">{{ nl('page_review_helpful_vote') }}</div>
        <div class="review_select">
          <span @click="voteClick()" class="vote_yes">
            <az-icon icon-class="iconicon_like" class="icon-vote icon-agree"></az-icon>
            <span class="vote_num">({{ yes }})</span>
          </span>
        </div>
      </div>
    </div>
    <div class="prlr-photos carousel">
      <a
        v-show="totalPhotoSlide"
        :class="{ active: curPhotoSlideIndex != 0 }"
        @click="prevPhotoClick"
        aria-label="prev"
        role="button"
        href="javascript:void(0)"
        class="prev-arraw"
      >
        <svg class="icon">
          <use xlink:href="#icon-lby_arrow_left"></use>
        </svg>
      </a>
      <div class="viewport">
        <ul ref="photoBox" :style="{ marginLeft: `${photoBoxMarginLeft}px` }">
          <li
            v-track.view.click="getTrackCommon(image.type)"
            v-for="(image, index) in photos"
            :key="`${image.imgUrl}_${index}`"
            @click="openPreview(index)"
          >
            <a
              :data-lightbox="`lb_${itemIndex}`"
              aria-label="review photo"
              class="need_datalayer"
              data-datalayer-category="PC_DetailPageRevision"
              data-datalayer-label="DetailPageA_ReviewsPic_Click"
              target="_blank"
            >
              <az-icon v-if="image.type == 'video'" icon-class="az-review-play-icon" class="az-play-icon"></az-icon>
              <img
                v-lazy="addWebpSuffix(image.imgUrl)"
                :ref="`reviewImg${index}`"
                @load="reviewImgLoad(index)"
                alt="review photo"
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
        aria-label="next"
        role="button"
        href="javascript:void(0)"
        class="next-arraw"
      >
        <svg class="icon">
          <use xlink:href="#icon-lby_arrow_right"></use>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
import AzRate from '@/components/az-ui/Rate/AzRate'
export default {
  name: 'ProductReviewItem',
  languageKeys: [
    'page_goods_your_review',
    'page_review_desc',
    'page_common_color',
    'page_shop_by_option_body_type',
    'page_customer_size_ordered',
    'page_goods_custom_size',
    'page_goods_fit',
    'page_review_fit_small',
    'page_review_fit_slightlysmall',
    'page_review_fit_right',
    'page_review_fit_slightlylarge',
    'page_review_fit_large',
    'page_common_translate',
    'page_common_translated_by',
    'page_goods_reply_by_site',
    'page_js_azazie',
    'page_review_helpful_vote'
  ],
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
    },
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      curPhotoSlideIndex: 0,
      photoBoxMarginLeft: 0,
      yes: 0,
      sizeSort: ['bust', 'waist', 'hips', 'height'],
      showTransTxt: false,
      translateTxt: '',
      translateLoading: false,
      voteFlag: true
    }
  },
  computed: {
    totalPhotoSlide() {
      return this.photos && this.photos.length && Math.ceil(this.photos.length / 2) - 1
    },
    sizeDetailSort() {
      return this.info.sizeDetail || []
    },
    photos({ info }) {
      const { photos = [], video } = info
      if (video && video.imgUrl && video.videoUrl) {
        return [{ imgUrl: video.imgUrl, videoUrl: video.videoUrl, type: 'video' }, ...photos]
      }
      return photos
    }
  },
  created() {
    this.yes = this.info.voteInfo && this.info.voteInfo.yes
  },
  mounted() {
    if (this.$refs.photoBox) {
      this.$refs.photoBox.style.width = `${(this.totalPhotoSlide + 1) * 89 * 2}px`
    }
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
        list: this.photos
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
    voteClick() {
      if (!this.voteFlag) return
      this.voteFlag = false
      const commentId = this.info.id
      const cookieValue = localStorage.getItem(`review_vote${commentId}`)
      const action = cookieValue == 'yes' ? 'sub' : 'add'
      if (this.yes == 0 && action == 'sub') return false
      this.$axios
        .$post('/1.0/product/comment-vote', {
          comment_id: commentId,
          vote_type: 'yes',
          act_type: action
        })
        .then((res) => {
          this.voteFlag = true
          if (res.code == 0) {
            this.yes = res.data.voteNum
            if (action == 'sub') {
              this.setPoint('reviews', 'approvalremove', 'click')
              localStorage.removeItem(`review_vote${commentId}`, 'yes')
            } else {
              this.setPoint('reviews', 'approval', 'click')
              localStorage.setItem(`review_vote${commentId}`, 'yes')
            }
          }
        })
        .catch((error) => {
          this.voteFlag = true
          console.log(error)
        })
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
    },
    setPoint(ec, el, ea, msg = {}) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify(msg)
      })
    },
    getTrackCommon(type) {
      return {
        common: {
          ec: 'reviews',
          el: type == 'video' ? 'video' : 'image',
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId
          })
        }
      }
    },
    hideInfo(info, item) {
      return [3102].includes(info.catId) && ['us_size', 'size'].includes(item.key)
    }
  }
}
</script>

<style lang="less" scoped>
.clearfix:after {
  content: '.';
  clear: both;
  height: 0;
  visibility: hidden;
  display: block;
}
.review_item {
  display: flex;
  justify-content: space-between;
  padding: 32px 0;
  overflow: hidden;
  border-bottom: 1px solid #eee;
  color: #666;
}
.prl-review {
  overflow: hidden;
  padding: 25px 0 25px;
  border-bottom: 1px solid #eee;
  color: @gray;
  display: flex;
  justify-content: space-between;
  .prlr-details,
  .prlr-photos {
    flex-shrink: 0;
  }
  .prlr-text-wrap {
    flex-shrink: 1;
    flex-grow: 1;
  }
}
.rating_avg .show_rating {
  margin: 4px 20px 4px 0;
}
.rating_avg {
  margin: 23px 0 30px 23px;
}
.fit {
  margin-top: 23px;
  margin-left: 138px;
}
.wr_a {
  margin: 36px 30px 0 0;
  border-radius: 0;
}
.prl-review {
  padding: 32px 0 32px;
  .prlr-photos {
    li {
      margin: auto;
      margin-left: 15px;
    }
  }
}

.prlr-details {
  float: left;
  min-width: 317px;
  width: max-content;
  // margin-right: 1%;
  strong {
    font-family: @font-family-600;
  }
}
.my-review {
  min-width: 98px;
  max-width: 130px;
  height: 23px;
  text-align: center;
  line-height: 23px;
  color: @theme-color;
  border: 1px solid @theme-color;
  margin-bottom: 15px;
}
.prlr-text-wrap {
  float: left;
  width: 60%;
  margin-right: 1%;
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
.rely_custom {
  position: relative;
  margin-top: 10px;
  padding: 12px 4px 13px 13px;
  background-color: var(--color-f9f9f9);
  span {
    font-size: 13px;
    color: var(--color-666666);
    line-height: 20px;
    font-family: @font-family-500;
    &.tip {
      font-family: @font-family-600;
    }
  }
}
.prlr-photos {
  flex-shrink: 0;
  float: right;
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
      position: relative;
      img {
        cursor: pointer;
        width: 100%;
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
.prod-reviews-more {
  text-align: right;
  margin-top: 10px;
  a {
    .text-link(@gray);
  }
}
.body_size {
  display: flex;
  justify-content: center;
  background-color: var(--color-f9f9f9);
  border: 5px solid var(--color-f9f9f9);
  margin-top: 16px;
  width: fit-content;
  .size {
    display: flex;
    flex-direction: column;
    min-width: 65px;
    min-height: 60px;
    .size_title {
      font-family: @font-family-600, sans-serif;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
    .size-detail-box {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      padding: 5px;
    }
  }
}
.review_vote {
  padding-left: 20px;
  float: right;
  margin-top: 0px;
  .review_txt {
    display: inline-block;
    color: var(--color-121212);
    margin-right: 6px;
  }
  .review_select {
    display: inline-block;
    color: var(--color-121212);
    .icon-vote {
      fill: currentColor;
    }
    .icon-disagree {
      transform: rotate(180deg);
    }
    .vote_yes,
    .vote_no {
      cursor: pointer;
      &.disabled {
        .icon-vote {
          color: var(--color-cccccc);
        }
        .vote_num {
          color: #999;
        }
      }
    }
    .vote_yes {
      margin-right: 6px;
    }
    .disabled {
      .icon-vote {
        color: var(--color-cccccc);
      }
    }
  }
}
</style>
