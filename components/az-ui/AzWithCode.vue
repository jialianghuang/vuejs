<template>
  <div v-if="code" class="az-with-code-box-container">
    <client-only>
      <div :class="['az-with-code-box', { 'other-style': otherStyle, 'need-bg': needColor }]">
        <p class="with-code-box">
          <span class="with-code-box-text">{{ prefixText }}</span>
          <span class="with-code-box-code">{{ codeText }}</span>
        </p>
        <!-- <img
          v-if="needColor"
          :src="
            replaceImgCdnUrl(
              isBridal
                ? 'https://cdn-1.azazie.com/upimg/userfiles/images/1/3b/5d/8a20c20b938ab9d0b854c9101f303b5d.png'
                : 'https://cdn-1.azazie.com/upimg/userfiles/images/1/fa/9f/4caf062ebd686545d9a0efddf72ffa9f.png'
            )
          "
          class="bg-img"
          alt="code"
        /> -->
        <div v-if="needColor" class="bg-block-container">
          <p class="bg-block-container-item left">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </p>
          <p class="bg-block-container-item"></p>
        </div>
      </div>
      <template v-if="showExpire">
        <div class="sod-coupon-expire-soon">
          <span class="sod-coupon-expire-soon-text">{{ nl('page_common_expire_soon') }}</span>
          <div v-if="!couponInfo.couponEndTime" class="sod-coupon-expire-soon-tips">
            <az-icon icon-class="icon-gwc-_question_" class="sod-tip"></az-icon>
            <p class="tips-box">
              <span>{{ nl('page_common_expire_soon_desc') }}</span>
            </p>
          </div>
        </div>
        <div v-if="couponInfo.couponEndTime" class="countdown-box">
          <span class="text">{{ nl('page_common_expires_in') }}</span>
          <az-count-down :endTime="couponInfo.couponEndTime"></az-count-down>
        </div>
      </template>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import azCountDown from '@/components/az-ui/AzCountDown'

export default {
  name: 'AzWithCode',
  languageKeys: [
    'page_common_with_code',
    'page_comp_check_in_code_name',
    'page_common_expire_soon',
    'page_common_expire_soon_desc',
    'page_common_expires_in'
  ],
  components: { azCountDown },
  props: {
    code: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: 'normal'
    },
    showExpire: {
      type: Boolean,
      default: false
    },
    otherStyle: {
      type: Boolean,
      default: false
    },
    needColor: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('checkout', ['couponInfo']),
    ...mapState({
      cyberSaleInfo: (state) => state.cyberSaleInfo
    }),
    prefixText({ source, nl }) {
      const text = nl(source == 'normal' ? 'page_common_with_code' : 'page_comp_check_in_code_name')
      return text && text.toLowerCase()
    },
    codeText({ code }) {
      return code
    }
  }
}
</script>

<style lang="less" scoped>
.az-with-code-box {
  display: flex;
  font-size: 0;
  align-items: center;
  position: relative;
  &.other-style {
    justify-content: center;
  }
  &-container {
    img.bg-img {
      display: inline-block;
      width: auto;
    }
  }
}
.bg-block-container {
  display: flex;
  &-item {
    position: relative;
    width: 5px;
    height: 22px;
    background-color: var(--color-121212);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.left {
      width: 6px;
      &::before {
        position: absolute;
        background-color: var(--color-ffffff);
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        top: -3px;
        left: 0;
      }
      &::after {
        position: absolute;
        background-color: var(--color-ffffff);
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        bottom: -3px;
        left: 0;
      }
    }
    .dot {
      width: 2.5px;
      height: 2.5px;
      margin: 0 auto;
      background-color: var(--color-ffffff);
      border-radius: 50%;
      &:nth-child(2) {
        margin: 2px auto;
      }
    }
  }
}
&.need-bg .with-code-box {
  background: var(--color-121212);
  color: var(--color-ffffff);
}
.with-code-box {
  // width: 82px;
  height: 22px;
  line-height: 22px;
  padding: 0 2px 0 5px;
  position: relative;
  font-family: @font-family-600;
  font-size: 12px;
  color: @theme-color;
  text-align: center;
  white-space: nowrap;
  &-text {
    text-transform: capitalize;
  }
  &-code {
    text-transform: unset;
  }
}
img {
  height: 22px;
  vertical-align: top;
}
.sod-coupon-expire-soon {
  margin: 5px 0;
  display: flex;
  align-items: center;
  &-text {
    color: @theme;
    letter-spacing: -0.26px;
    text-transform: capitalize;
  }
  &-tips {
    margin-left: 5px;
    position: relative;
    z-index: @z-index-5;
    &:hover {
      .tips-box {
        display: block;
      }
    }
    .tips-box {
      display: none;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 10px);
      max-width: 280px;
      width: max-content;
      padding: 15px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0 0 2px 1px #d9d9d9;
      text-align: left;
      &:before,
      &:after {
        content: '';
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-bottom-color: #ccc;
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
      }
      &:after {
        border-bottom-color: #fff;
        top: -15px;
      }
    }
  }
}
.countdown-box {
  display: flex;
  justify-content: space-between;
  min-width: max-content;
  .text {
    margin-right: 10px;
  }
}
</style>
