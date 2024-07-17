<template>
  <div class="flash-sale-list-timer">
    <div class="flash-sale-countdown-box">
      <flash-sale-countdown
        :start-time="flashSaleBaseInfo.startTime"
        :end-time="flashSaleBaseInfo.endTime"
        :isFlashSaleList="true"
        v-if="flashSaleBaseInfo && serverTime"
      ></flash-sale-countdown>
      <div @mouseenter="handleFlashSaleIntro()" @mouseleave="handleFlashSaleIntro()" class="flash-sale-intro">
        <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
        <div
          :class="[{ hide: !popupFlashSaleTipShow }]"
          @mouseenter="handleFlashSaleIntro()"
          @mouseleave="handleFlashSaleIntro()"
          class="introduce-hover-content flash-sale-intro-pop"
        >
          <p class="intro-title">{{ nl('page_flash_sale_details') }}</p>
          <p class="intro-dec">
            {{ nl('page_flash_sale_for_short_a_time') }}
          </p>
          <p class="intro-title">{{ nl('page_flash_sale_tips') }}</p>
          <p v-html="nl('page_flash_sale_intro_dec_1')" class="intro-dec"></p>
          <p v-html="nl('page_flash_sale_intro_dec_2')" class="intro-dec"></p>
          <p v-html="nl('page_flash_sale_intro_dec_3')" class="intro-dec"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FlashSaleCountdown from '@/components/common/FlashSaleCountTimedown'
export default {
  name: 'FlashSaleListTimer',
  components: { FlashSaleCountdown },
  props: {
    flashSaleBaseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      popupFlashSaleTipShow: false
    }
  },
  computed: {},
  created() {},
  methods: {
    handleFlashSaleIntro() {
      this.popupFlashSaleTipShow = !this.popupFlashSaleTipShow
    }
  }
}
</script>

<style lang="less" scoped>
.flash-sale-list-timer {
  .flash-sale-countdown-box {
    display: flex;
    justify-content: center;
  }
  .flash-sale-intro {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: 19px 0 0 10px;
    position: relative;
    font-size: 20px;
  }
  .introduce-hover-content {
    font-size: 13px;
    width: 590px;
    box-sizing: border-box;
    padding: 15px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(153, 153, 153, 0.8);
    line-height: 18px;
    text-align: left;
    position: absolute;
    left: 50%;
    z-index: 3;
    transform: translateX(-50%);
    top: 27px;
    .intro-title {
      color: var(--color-121212);
      font-family: @font-family-600;
    }
    .intro-dec {
      color: var(--color-121212);
      margin: 5px 0 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #ffffff;
      box-shadow: 0px 0px 6px 0px rgba(153, 153, 153, 0.8), -1px 0px 6px 0px rgba(153, 153, 153, 0.8);
      line-height: 18px;
      text-align: left;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      top: 0;
    }
    &::after {
      content: '';
      display: inline-block;
      width: 16px;
      height: 8px;
      background: #ffffff;
      line-height: 18px;
      text-align: left;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
    }
  }
}
</style>
