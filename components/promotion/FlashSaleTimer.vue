<template>
  <div class="activity-sale-info-box flashSale">
    <div class="activity-sale-pro-box">
      <div id="product-falsh-sale-timer" v-if="serverTime && flashSaleInfo && flashSaleInfo.endTime" class="sales-progress">
        {{ nl('page_year_end_ends_in_capitalize') }}
        <az-count-down :endTime="flashSaleInfo.endTime"></az-count-down>
      </div>
      <div>
        <!-- <az-icon icon-class="icon-icon-test" class="icon-tag" /> -->
        <span v-if="!showCountDownTime" class="activity-sale-title">{{ nl('page_category_launch_sale') }}</span>
        <span @mouseenter="handleFlashSaleIntro()" @mouseleave="handleFlashSaleIntro()" class="activity-sale-intro">
          <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
          <div :class="[{ hide: !popupSaleTipShow }]" class="introduce-hover-content flash-sale-intro-pop">
            <div>
              <p class="intro-title">{{ nl('page_flash_sale_timer_text') }}:</p>
              <p class="intro-dec">
                {{ nl('page_flash_sale_for_short_a_time') }}
                <a :href="countryUrl('/all/flash-sale')" class="a-href to-flash-sale ui-link">
                  {{ nl('page_flash_sale_timer_text1') }} &gt;
                </a>
              </p>
              <p class="intro-title">{{ nl('page_flash_sale_tips') }}</p>
              <p class="intro-dec">{{ nl('page_flash_sale_intro_dec_1') }}</p>
              <p class="intro-dec">
                {{ nl('page_flash_sale_intro_dec_2_1') }}
                <span class="intro-highlight">{{ nl('page_flash_sale_intro_dec_2_2') }}</span>
              </p>
              <p class="intro-dec">{{ nl('page_flash_sale_intro_dec_3') }}</p>
            </div>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import azCountDown from '@/components/az-ui/AzCountDown'
export default {
  name: 'FlashSaleTimer',
  languageKeys: [
    'page_category_launch_sale',
    'page_flash_sale_timer_text',
    'page_flash_sale_for_short_a_time',
    'page_flash_sale_timer_text1',
    'page_flash_sale_tips',
    'page_flash_sale_intro_dec_1',
    'page_flash_sale_intro_dec_2_1',
    'page_flash_sale_intro_dec_2_2',
    'page_flash_sale_intro_dec_3',
    'page_year_end_ends_in_capitalize'
  ],
  components: { azCountDown },
  props: {
    flashSaleInfo: {
      type: Object,
      default() {
        return null
      }
    },
    showCountDownTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popupSaleTipShow: false
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo
    })
  },
  created() {},
  methods: {
    handleFlashSaleIntro() {
      this.popupSaleTipShow = !this.popupSaleTipShow
    }
  }
}
</script>

<style lang="less" scoped>
.activity-sale-info-box {
  position: relative;
  margin-top: 10px;
}
.activity-sale-pro-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.has-tip {
    background: var(--color-f9f9f9);
    padding: 7px 15px 9px;
  }
  .activity-sale-title {
    margin: 0 4px;
  }
  .icon-tag {
    fill: currentColor;
    color: @theme;
  }
  .activity-sale-intro {
    cursor: pointer;
    position: relative;
  }
  #product-falsh-sale-timer {
    position: relative;
    margin-right: 5px;
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
  z-index: 3;
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
  &:before {
    content: '';
    width: 0;
    height: 0;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--color-cccccc);
    border-left: 6px solid transparent;
    position: absolute;
    top: 0%;
    left: calc(~'50% - 57px');
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
    left: calc(~'50% - 57px');
    margin-top: -11px;
  }
  &.flash-sale-intro-pop {
    min-width: 280px;
    padding: 15px;
    top: 22px;
    left: 57px;
    transform: translateX(-50%);
    .intro-title {
      color: var(--color-121212);
      font-family: @font-family-600;
    }
    .intro-dec {
      color: var(--color-121212);
      margin: 5px 0 15px;
      .intro-highlight {
        color: var(--color-121212);
        font-family: @font-family-600;
      }
    }
    .ui-link {
      color: @theme;
      text-decoration: underline;
    }
  }
}
</style>
