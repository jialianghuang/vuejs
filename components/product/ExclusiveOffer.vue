<template>
  <div :class="[questionPosition, scene]" class="exclusive-offer">
    <template v-if="scene === 'details'">
      <span class="exclusive-price">{{ price }}</span>
      <span class="exclusive-text"><az-icon icon-class="icon-a-exclusiveoffer"></az-icon>{{ nl('page_sticker_limit_text') }}</span>
      <span
        @click="clickInnerDress"
        v-track.view="{ common: { ec: 'bundle', el: 'dress' } }"
        v-html="nl('page_exclusive_offer_price_off', null, { priceOff: priceOff })"
        class="exclusive-des"
      ></span>
    </template>
    <div ref="exclusiveOfferContent" v-else class="exclusive-offer-content">
      <div class="exclusive-offer-content-des">{{ nl('page_sticker_limit_text') }}</div>
      <div class="exclusive-offer-content-price">-{{ priceOff }}</div>
    </div>
    <div
      v-if="scene !== 'completeTheLook' && scene !== 'shopthelookdetail' && showTips"
      @mouseenter="handleTriangleLeft"
      class="exclusive-offer-question"
    >
      <az-icon icon-class="icon-gwc-_question_"></az-icon>
      <div
        :style="{ left: '-' + questionLeft + 'px', width: questionWidth + 'px' }"
        :class="questionPosition"
        class="exclusive-offer-question-des"
      >
        <span
          @click="clickInnerDress"
          v-track.view="{ common: { ec: 'bundle', el: 'dress' } }"
          v-html="
            ['details', 'quickShopDialog', 'addCartdialog'].includes(scene)
              ? nl('page_exclusive_offer_question_details', null, { priceOff: priceOff })
              : nl('page_exclusive_offer_question')
          "
        ></span>
        <i :style="{ left: triangleLeft + 'px' }"></i>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * Exclusive Offer标签组件
 */
export default {
  languageKeys: [
    'page_sticker_limit_text',
    'page_exclusive_offer_price_off',
    'page_exclusive_offer_question',
    'page_exclusive_offer_question_details'
  ],
  props: {
    // 使用场景，不同的场景不同的样式
    scene: {
      type: String,
      default: 'default'
    },
    // 问题描述位置,问号上面upper或者下面under
    questionPosition: {
      type: String,
      default: 'upper'
    },
    // bundle price
    price: {
      type: String,
      default: ''
    },
    // bundle price off
    priceOff: {
      type: String,
      default: ''
    },
    showTips: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      questionLeft: 108,
      triangleLeft: 108,
      questionWidth: 254
    }
  },
  mounted() {
    this.handleTriangleLeft()
    window.addEventListener('resize', this.handleTriangleLeft)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleTriangleLeft)
  },
  methods: {
    clickInnerDress(e) {
      if (e.target.localName === 'a') {
        this.setPoint('bundle', 'dress', 'click')
        this.setOrderSourceFlag('bundle', true)
      }
    },
    // 因为本组件出现的场景位置不固定，所以需要根据场景调整内容的定位，宽度
    handleTriangleLeft() {
      if (this.$refs.exclusiveOfferContent) {
        const eocClientWidth = this.$refs.exclusiveOfferContent.clientWidth
        this.questionLeft = eocClientWidth + this.$refs.exclusiveOfferContent.offsetLeft
        this.triangleLeft = this.questionLeft + 4
      }
      if (this.$parent) {
        this.questionWidth = this.$parent.$el.clientWidth
        if (this.questionWidth > 360) this.questionWidth = 360
        // completeTheLook场景会缩放，所以问题描述的宽度要扩大
        if (this.scene === 'completeTheLook') {
          this.questionLeft = this.questionLeft * 1.125
          this.triangleLeft = this.triangleLeft * 1.125
          this.questionWidth = this.questionWidth * 1.25
        } else if (this.scene === 'headerNavCart') {
          this.questionLeft = 244
          this.triangleLeft = this.questionLeft + 4
          this.questionWidth = 272
        } else if (this.scene === 'addCartdialogRecommend') {
          this.questionWidth = 137
        } else if (this.scene === 'cartRecommend') {
          this.questionWidth = 176
        } else if (this.scene === 'details') {
          this.questionLeft = 170
          this.triangleLeft = this.questionLeft + 4
          this.questionWidth = 275
        } else if (['addCartdialog', 'quickShopDialog', 'shopthelook'].includes(this.scene)) {
          this.questionLeft = 137
          this.triangleLeft = this.questionLeft + 4
          this.questionWidth = 275
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.exclusive-offer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: @font-family-500;
  &.under {
    margin-left: 10px;
  }
  &-content {
    height: 20px;
    width: fit-content;
    font-size: 10px;
    line-height: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    white-space: nowrap;
    &-des {
      height: 100%;
      letter-spacing: -0.04em;
      text-transform: capitalize;
      padding: 0px 5px;
      background: #fbf1f2;
      color: var(--theme-color);
    }
    &-price {
      height: 100%;
      min-width: 19px;
      padding: 0px 3px;
      color: #fff;
      font-family: @font-family-600;
      background: var(--theme-color);
    }
  }
  &-question {
    height: 20px;
    display: flex;
    align-items: center;
    position: relative;
    &-des {
      display: none;
      padding: 10px;
      background: #ffffff;
      border: 1px solid var(--color-cccccc);
      border-radius: 2px;
      position: absolute;
      font-size: 13px;
      line-height: 18px;
      width: 254px;
      z-index: 2;
      box-sizing: border-box;
      white-space: initial;
      /deep/ a {
        text-decoration: underline;
        color: var(--color-121212);
      }
      i {
        display: block;
        width: 10px;
        height: 10px;
        background: #fff;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: absolute;
        left: 114px;
      }
      &.upper {
        bottom: 27px;
        i {
          transform: rotate(45deg);
          bottom: -6.5px;
        }
      }
      &.under {
        top: 27px;
        i {
          transform: rotate(-135deg);
          top: -6.5px;
        }
      }
    }
    &:hover {
      .exclusive-offer-question-des {
        display: block;
      }
    }
    .az-icon {
      margin-left: 5px;
      width: 12px;
      height: 12px;
    }
  }
  &.details {
    margin: 0px 0px 0px 10px;
    padding: 10px 15px;
    color: var(--theme-color);
    background: url('https://cdn-1.azazie.com/upimg/userfiles/0-9A-Za-z-BD/90/b7/d4af82b8d4a1bacfcdd8186f1afe90b7.jpg') no-repeat center;
    background-size: 100% 100%;
    .exclusive {
      &-price {
        font-size: 14px;
        line-height: 19px;
        font-family: @font-family-600;
      }
      &-text {
        font-size: 12px;
        line-height: 16px;
        text-transform: capitalize;
        border-left: 1px solid var(--theme-color);
        padding-left: 10px;
        margin-left: 10px;
        display: flex;
        align-items: center;
        .az-icon {
          width: 14px;
          height: 14px;
          margin-right: 5px;
        }
      }
      &-des {
        font-size: 12px;
        line-height: 16px;
        text-align: right;
        text-transform: capitalize;
        margin-left: 25px;
        font-family: @font-family-600;
        /deep/ a {
          text-decoration: underline;
          color: var(--theme-color);
        }
      }
    }
    .exclusive-offer-question-des {
      color: var(--color-121212);
    }
  }
  &.completeTheLook {
    transform: scale(0.8);
    transform-origin: center;
    position: relative;
    z-index: 2;
    .exclusive-offer-question {
      .az-icon {
        margin-left: 3px;
      }
    }
  }
  &.cartRecommend {
    position: relative;
    z-index: 2;
  }
}
</style>
