<template>
  <div v-if="flashSaleInfo && isFlashSale" class="flash-sale-info-box">
    <div :class="{ show: flashSaleInfo }" class="flash-sale-pro-box">
      <div v-if="flashSaleInfo.tips && flashSaleInfo.tips.detailPage" class="flash-sale-tips">
        <div class="flash-sale-tips-content">{{ flashSaleInfo.tips.detailPage.content }}</div>
      </div>

      <div id="product-falsh-sale-timer" class="sales-progress">
        <az-count-down
          v-if="isFlashSale"
          :startTime="flashSaleInfo.startTime"
          :endTime="flashSaleInfo.endTime"
          @setDay="setDay"
        ></az-count-down>
        <div
          @mouseenter="handleFlashSaleIntro()"
          @mouseleave="handleFlashSaleIntro()"
          class="flash-sale-intro need_datalayer"
          data-datalayer-category="FlashSale"
          data-datalayer-label="FlashSale_Detail_Click"
        >
          <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
        </div>
        <template v-if="flashSaleInfo.dullSale && isSpecialCatId(flashSaleInfo.catId)">
          <div class="sale_percent">{{ flashSaleInfo.progress }}% {{ nl('page_common_sold') }}</div>
          <div class="percent_process">
            <div :style="`width: ${flashSaleInfo.progress}%`" class="percent"></div>
          </div>
        </template>
      </div>
    </div>

    <div
      :class="[{ hide: !popupFlashSaleTipShow }, { hasDay: day }]"
      @mouseenter="handleFlashSaleIntro()"
      @mouseleave="handleFlashSaleIntro()"
      class="introduce-hover-content flash-sale-intro-pop"
    >
      <div class="expand_hot_zone"></div>
      <p class="intro-title">{{ nl('page_flash_sale_timer_text') }}:</p>
      <p class="intro-dec">
        {{ nl('page_flash_sale_for_short_a_time') }}
        <a :href="countryUrl('/all/flash-sale')" class="a-href to-flash-sale ui-link">{{ nl('page_flash_sale_timer_text1') }} &gt;</a>
      </p>
      <p class="intro-title">{{ nl('page_flash_sale_tips') }}:</p>
      <p class="intro-dec">{{ nl('page_flash_sale_intro_dec_1') }}</p>
      <p class="intro-dec">{{ nl('page_flash_sale_intro_dec_2_1') }}</p>
      <p class="intro-dec">{{ nl('page_flash_sale_intro_dec_3') }}</p>
    </div>
  </div>
</template>

<script>
import azCountDown from '@/components/az-ui/AzCountDown'
import { mapState } from 'vuex'
export default {
  name: 'FlashSaleTimer',
  languageKeys: [
    'page_common_sold',
    'page_flash_sale_timer_text',
    'page_flash_sale_for_short_a_time',
    'page_flash_sale_timer_text1',
    'page_flash_sale_tips',
    'page_flash_sale_intro_dec_1',
    'page_flash_sale_intro_dec_2_1',
    'page_flash_sale_intro_dec_3'
  ],
  components: { azCountDown },
  props: {
    flashSaleInfo: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      day: 0,
      popupFlashSaleTipShow: false
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.quickshop.baseInfo
    })
  },
  created() {},
  methods: {
    handleFlashSaleIntro() {
      this.popupFlashSaleTipShow = !this.popupFlashSaleTipShow
    },
    setDay(day) {
      this.day = day
    }
  }
}
</script>

<style lang="less" scoped>
.flash-sale-info-box {
  position: relative;
}
.flash-sale-pro-box {
  display: none;
  &.show {
    display: block;
  }
  &.has-tip {
    background: var(--color-f9f9f9);
    padding: 7px 15px 9px;
  }
  .flash-sale-tips {
    margin: 12px 0 20px;
    padding-top: 12px;
    border-top: 1px dashed #ccc;
    .flash-sale-tips-content {
      display: inline-block;
      font-size: 13px;
      position: relative;
      padding-left: 27px;
      &:before {
        content: '';
        display: inline-block;
        width: 17px;
        height: 16px;
        background: data-uri('~assets/images/flashSale/icon-flash-sale-tips.png') center center/100% 100% no-repeat;
        vertical-align: middle;
        position: absolute;
        left: 0;
      }
    }
  }

  #product-falsh-sale-timer {
    background-color: #f6f6f6;
    padding: 10px;
    margin-top: 10px;
    position: relative;
    max-width: 420px;

    .flash-sale-intro {
      display: inline-block;
      margin-left: 6px;
      width: 20px;
      height: 20px;
      position: relative;
      font-size: 20px;
    }
    .sale_percent {
      font-family: @font-family-500, sans-serif;
      color: var(--color-121212);
      font-size: 13px;
      position: absolute;
      right: 10px;
      top: 22px;
    }
    .percent_process {
      height: 9px;
      width: 100%;
      border-radius: 4px;
      margin-top: 10px;
      background-color: #fff;
      border: 1px solid #eee;
      .percent {
        width: 3%;
        border-radius: 4px;
        height: 100%;
        background-color: var(--color-121212);
      }
    }
  }
}

.introduce-hover-content {
  position: absolute;
  z-index: 21;
  font-weight: initial;
  background: #fff;
  box-shadow: 0 0 6px 0 rgba(153, 153, 153, 0.8);
  margin-top: 2px;
  .expand_hot_zone {
    position: absolute;
    width: 100%;
    height: 30px;
    background: transparent;
    top: -18px;
    left: 0;
  }
  &.hasDay {
    &:before {
      content: '';
      left: 38%;
    }
    &::after {
      content: '';
      left: 38%;
    }
  }
  &:before {
    content: '';
    width: 0;
    height: 0;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--color-cccccc);
    border-left: 6px solid transparent;
    position: absolute;
    top: 0%;
    left: 24.4%;
    margin-top: -7px;
  }
  &:after {
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: #ffffff;
    position: absolute;
    top: 0%;
    left: 24.4%;
    margin-top: -11px;
  }
  &.flash-sale-intro-pop {
    // width: 438px;
    padding: 15px;
    top: 50px;
    .intro-title {
      color: var(--color-121212);
      font-family: @font-family-600;
    }
    .intro-dec {
      color: var(--color-121212);
      margin: 5px 0 15px;
    }
    .ui-link {
      color: @theme;
      text-decoration: underline;
    }
  }
}
</style>
