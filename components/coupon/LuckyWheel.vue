<template>
  <div id="coupon-box" :class="{ 'swatch-coupon-box': isCouponSwatch, 'first-open-coupon-box': firstOpen }">
    <div
      :style="{
        transform: `translate(${expand ? 0 : 1260 * couponScale}px,50%)`,
        alignSelf: center ? 'center' : 'flex-end',
        bottom: `50%`
      }"
      :class="[{ 'first-open': firstOpen }, $route.name]"
      class="coupon-side-all main-vue"
    >
      <coupon-order-swatch
        v-if="isCouponSwatch"
        :email="email"
        :rewardCode="rewardCode"
        @closeCouponWheel="closeCouponWheel"
      ></coupon-order-swatch>
      <div
        v-else
        :style="{ transform: `scale(${couponScale})` }"
        :class="{ 'first-open': firstOpen }"
        class="coupons-contain media-scale wheel-bottom"
      >
        <div class="coupon">
          <div
            v-show="success"
            :style="{
              backgroundImage: `url(${replaceImgCdnUrl(couponWheelConfig.successPage.backGroundImage)})`,
              backgroundColor: couponWheelConfig.successPage.backGroundColor
            }"
            class="coupon-success"
          >
            <div :style="{ backgroundImage: `url(${replaceImgCdnUrl(couponWheelConfig.successPage.titleImage)})` }" class="title"></div>
            <div
              :style="{
                color:
                  (couponWheelConfig.successPage.disclaimerTextColor && couponWheelConfig.successPage.disclaimerTextColor[0]) || '#ffffff'
              }"
              class="message"
            >
              {{
                couponWheelConfig.successPage.message &&
                  couponWheelConfig.successPage.message[0] &&
                  couponWheelConfig.successPage.message[0].replace(/{rewardContent}/g, drawCoupon && drawCoupon.rewardText)
              }}
            </div>
            <div
              :style="{
                backgroundImage: `url(${replaceImgCdnUrl(couponWheelConfig.successPage.couponBackGroundImage)})`,
                color: bindedCouponEmail ? couponWheelConfig.successPage.couponCodeColor : couponWheelConfig.successPage.waitBindColor,
                fontSize: bindedCouponEmail ? '' : couponWheelConfig.successPage.waitBindFontSize
              }"
              v-if="drawCoupon && drawCoupon.couponCode"
              v-text="bindedCouponEmail ? drawCoupon.couponCode : couponWheelConfig.successPage.waitBindText"
              class="code"
            ></div>
            <div
              v-html="drawCoupon && drawCoupon.message"
              :style="{
                color:
                  (couponWheelConfig.successPage.disclaimerTextColor && couponWheelConfig.successPage.disclaimerTextColor[1]) || '#ffffff'
              }"
              class="desc"
            ></div>
            <az-button
              v-if="isFreeSwatch && rewardCode"
              :text="`${nl('page_get_them_now')}>`"
              :style="{
                backgroundColor: successBtnEnter
                  ? couponWheelConfig.successPage.pressButtonColor
                  : couponWheelConfig.successPage.unPressButtonColor,
                color: couponWheelConfig.successPage.buttonTextColor || '#DE6D7B',
                borderRadius: '0',
                borderColor: couponWheelConfig.successPage.buttonBorderColor,
                borderWidth: startBtnLoading ? 0 : '1px',
                borderStyle: 'solid'
              }"
              @mouseenter.native="successBtnEnter = true"
              @mouseleave.native="successBtnEnter = false"
              @click="handleCouponSwatchShow"
              class="btn-shop"
            ></az-button>
            <az-button
              v-else
              :text="copySuccessText || couponWheelConfig.successPage.buttonText"
              :style="{
                backgroundColor: successBtnEnter
                  ? couponWheelConfig.successPage.pressButtonColor
                  : couponWheelConfig.successPage.unPressButtonColor,
                color: couponWheelConfig.successPage.buttonTextColor || '#DE6D7B',
                borderRadius: '0',
                borderColor: couponWheelConfig.successPage.buttonBorderColor,
                borderWidth: startBtnLoading ? 0 : '1px',
                borderStyle: 'solid'
              }"
              @mouseenter.native="successBtnEnter = true"
              @mouseleave.native="successBtnEnter = false"
              v-clipboard:copy="
                !bindedCouponEmail
                  ? (couponWheelConfig.successPage && couponWheelConfig.successPage.waitBindText) || ''
                  : drawCoupon && drawCoupon.couponCode
              "
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              class="btn-shop"
            ></az-button>
          </div>
          <div
            :style="{
              backgroundImage: `url(${replaceImgCdnUrl(couponWheelConfig.mainBody.backGroundImage)})`,
              backgroundColor: couponWheelConfig.mainBody.backGroundColor
            }"
            v-show="!success"
            class="coupon-ready"
          >
            <div class="cou-left">
              <coupon-wheel
                ref="couponWheel"
                :width="760"
                :height="760"
                :offset="130"
                :couponConfig="couponWheelConfig.wheelList"
                v-if="couponWheelConfig.wheelList"
                @onDraw="onDraw"
                @onDrawErr="onDrawErr"
                class="wheel"
              ></coupon-wheel>
              <img
                :src="replaceImgCdnUrl(couponWheelConfig.wheelList && couponWheelConfig.wheelList.pointerImage)"
                alt="pointer"
                class="pointer"
                draggable="false"
              />
            </div>
            <div class="cou-right">
              <div :style="{ backgroundImage: `url(${replaceImgCdnUrl(couponWheelConfig.mainBody.titleImage)})` }" class="title"></div>
              <div v-html="couponWheelConfig.mainBody.titleText" class="message"></div>
              <div class="input-user-info">
                <div class="email-input">
                  <input
                    v-model="email"
                    :placeholder="nl('page_lucky_wheel_placeholder_text')"
                    @input="emailError = ''"
                    @keydown="onKeydown"
                    type="email"
                  />
                  <span>*</span>
                </div>
                <div
                  v-if="couponWheelConfig.mainBody.userRolesOptions && couponWheelConfig.mainBody.userRolesOptions.length"
                  class="role-select"
                >
                  <div @click="showRoleOptions = !showRoleOptions" class="select">
                    <div :class="{ 'select-name--selected': userRole }" class="select-name">
                      {{ userRole || nl('page_lucky_wheel_I_am') }}
                    </div>
                    <az-icon class="arrow-down-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
                  </div>
                  <ul v-if="showRoleOptions" class="select-option">
                    <li
                      v-for="(role, index) in couponWheelConfig.mainBody.userRolesOptions"
                      :key="index"
                      :class="{
                        selected: role.userRole === userRole
                      }"
                      @click="
                        userRole = role.userRole
                        userRoleUrl = role.userRoleUrl
                        showRoleOptions = false
                      "
                    >
                      {{ role.userRole }}
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="emailError" v-text="emailError || nl('page_lucky_wheel_error_email')" class="error"></div>
              <az-button
                @click="startCoupon"
                :style="{
                  backgroundColor: readyBtnEnter
                    ? couponWheelConfig.mainBody.pressButtonColor
                    : couponWheelConfig.mainBody.unPressButtonColor,
                  color: couponWheelConfig.mainBody.buttonTextColor || '#DE6D7B',
                  borderRadius: '0',
                  borderColor: couponWheelConfig.mainBody.buttonBorderColor,
                  borderWidth: startBtnLoading ? 0 : '1px',
                  borderStyle: 'solid',
                  opacity: startBtnLoading ? '0.7' : '1'
                }"
                :text="couponWheelConfig.mainBody.buttonText"
                @mouseenter.native="readyBtnEnter = true"
                @mouseleave.native="readyBtnEnter = false"
                :loading="startBtnLoading"
                class="btn-try"
              ></az-button>
              <div v-html="showHtml" :style="{ color: showHtmlColor }" class="policy"></div>
            </div>
          </div>

          <div v-if="firstOpen" @click="$emit('firstOpenChange', false)" class="first-open-btn">
            <!-- <az-icon icon-class="icon-coupon-wheel-close" clss="close"></az-icon> todo -->
            <az-icon
              :flll="couponWheelConfig.sideBar.colorOfTextAndButton"
              icon-class="icon-icon_style_gallery_off"
              class="icon-close"
            ></az-icon>
            <!-- <span :style="{ 'background-color': couponWheelConfig.sideBar.colorOfTextAndButton || 'var(--color-121212)' }" class="close"></span> -->
          </div>
        </div>
      </div>

      <div
        v-if="!hideCouponToggle"
        :style="{ left: `${isCouponSwatch ? -25 : 1260 - 1260 * couponScale - 25}px` }"
        class="toggle"
        style="pointer-events: auto"
      >
        <coupon-toggle
          @click.native="showCoupon"
          :open="expand"
          :bgColor="couponWheelConfig.sideBar.colorOfSideBar"
          :textColor="couponWheelConfig.sideBar.colorOfTextAndButton"
          :expandText="couponWheelConfig.sideBar.closeButtonText"
          :closeText="couponWheelConfig.sideBar.openButtonText"
          :btnImage="couponWheelConfig.sideBar.openButtonImage"
          :scale="couponScale"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AzLoading from '@/components/az-ui/AzLoading'
import CouponToggle from '@/components/coupon/CouponToggle'
// import CouponOrderSwatch from '@/components/product/OrderSwatch/CouponOrderSwatch'
import luckyMixin from './luckyMixin'

// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const CouponOrderSwatch = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/product/OrderSwatch/CouponOrderSwatch'),
  loading: AzLoading
})

export default {
  name: 'LuckyWheel',
  languageKeys: [
    'page_get_them_now',
    'page_lucky_wheel_placeholder_text',
    'page_lucky_wheel_I_am',
    'page_lucky_wheel_error_email',
    ...luckyMixin.languageKeys,
    /** CouponOrderSwatch */
    'page_coupon_swatches_title',
    ...new Array(3).fill().map((v, i) => 'page_coupon_swatches_step_' + (i + 1))
    // ...CouponOrderSwatch.languageKeys,
  ],
  components: { CouponToggle, CouponOrderSwatch },
  mixins: [luckyMixin],
  computed: {
    hideCouponToggle() {
      return this.firstOpen || this.$route.name == 'promotion'
    }
  }
}
</script>

<style lang="less" scoped>
input,
textarea {
  border: none;
  padding: 0;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
  color: var(--color-cccccc);
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: var(--color-cccccc);
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: var(--color-cccccc);
}

#coupon-box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: @fixed-z-index; //因为quickshop等其他弹窗的层级基本上都在12，所以这里不能超过他，不然就会展示异常了
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
  &.swatch-coupon-box,
  &.first-open-coupon-box {
    z-index: @fixed-z-index + 2;
  }
  &.swatch-coupon-box {
    pointer-events: auto;
  }
  .coupon-side-all {
    display: flex;
    position: absolute;
    align-items: center;
    transition: transform 1s;
    &.promotion:not(.first-open) {
      display: none;
    }
    .toggle {
      position: absolute;
    }
    &.first-open {
      right: 50%;
      transform: translate(50%, 50%) !important;
    }

    .coupons-contain {
      position: relative;
      transform-origin: 1260px 350px;
      box-shadow: -10px 7px 16px -1px rgba(0, 0, 0, 0.15);
      border-radius: 5px 0px 0px 5px;
      .coupon {
        width: 1260px;
        height: 700px;
        position: relative;
        pointer-events: auto;
        box-sizing: border-box;

        .coupon-ready {
          display: flex;
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          pointer-events: auto;

          .cou-left {
            width: 455px;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            .wheel {
              position: absolute;
              left: -380px;
            }

            .pointer {
              width: 150px;
              height: auto;
              position: absolute;
              right: 0;
            }
          }

          .cou-right {
            margin-left: 35px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .title {
              text-align: center;
              width: 682px;
              height: 167px;
              background-size: 100% 100%;
            }

            .message {
              width: 668px;
              padding-top: 22px;
              font: normal 21px/28px @font-family-600;
              text-align: center;
              color: #ffffff;
            }

            .input-user-info {
              width: 668px;
              display: flex;
              margin-top: 30px;
            }

            .role-select {
              margin-left: 15px;
              flex: 1 1 50%;
              position: relative;
              font-family: @font-family-500, serif;
              font-size: 21px;
              .select {
                box-sizing: border-box;
                height: 60px;
                border: 1px solid var(--color-cccccc);
                padding: 0 15px 0 10px;
                box-sizing: border-box;
                background-color: white;
                display: flex;
                align-items: center;
                cursor: pointer;
                .select-name {
                  color: #ccc;
                  text-transform: capitalize;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  flex: 1;
                  &--selected {
                    color: var(--color-121212);
                  }
                }
                .arrow-down-icon {
                  width: 10px;
                  height: 13px;
                  fill: var(--color-121212);
                }
              }
              .select-option {
                box-sizing: border-box;
                width: 100%;
                margin: 0;
                padding: 0;
                list-style: none;
                position: absolute;
                left: 0;
                top: 100%;
                z-index: @z-index;
                color: var(--color-121212);
                background: #fff;
                border: 1px solid #ccc;
                border-top: 0;
                li {
                  height: 60px;
                  line-height: 60px;
                  padding: 0 15px;
                  cursor: pointer;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: flex;
                  align-items: center;
                  &:hover {
                    background: #f6f6f6;
                  }
                }
              }
            }
            .email-input {
              flex: 1 1 50%;
              height: 60px;
              border: 1px solid var(--color-cccccc);
              font: normal 21px/28px @font-family-500;
              padding: 0 15px;
              box-sizing: border-box;
              background-color: white;
              display: flex;
              align-items: center;
              input {
                border: none;
                outline: none;
                flex: 1;
                width: 100%;
                height: 58px;
                box-sizing: border-box;
                &::placeholder {
                  color: #ccc;
                }
                &:focus,
                &:active {
                  background: white;
                }
              }
              span {
                color: var(--color-121212);
              }
            }

            .error {
              width: 668px;
              margin-top: 22px;
              color: var(--color-ff0000);
              font: normal 15px/16px @font-family-500;
            }

            .btn-try {
              width: 668px;
              height: 75px;
              line-height: 75px;
              margin-top: 22px;
              font: normal 21px/75px @font-family-600;
              text-transform: uppercase;
            }

            /deep/ .policy {
              margin-top: 15px;
              width: 668px;
              color: #fff;
              text-align: left;
              font-size: 18px;
              line-height: 25px;
              a {
                color: #fff;
                &:focus,
                &:active,
                &:hover,
                &:visited,
                &[disabled],
                &[disabled]:hover,
                &.disabled,
                &.disabled:hover {
                  color: #fff;
                }
              }
            }
          }
        }

        .coupon-success {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #fff1e0;
          background-size: 100% 100%;
          pointer-events: auto;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;

          .title {
            width: 860px;
            height: 102px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-top: 15px;
          }

          .message {
            width: 793px;
            font: normal 21px/28px @font-family-600;
            padding-top: 22px;
            color: #ffffff;
          }

          .code {
            margin-top: 15px;
            width: 519px;
            height: 168px;
            text-align: center;
            font-family: @font-family-700;
            line-height: 168px;
            font-size: 53px;
            background-size: 100% 100%;
            margin-bottom: 8px;
          }

          .desc {
            width: 793px;
            text-align: center;
            font: normal 21px/28px @font-family-500;
            color: #ffffff;
          }

          .btn-shop {
            margin-top: 35px;
            width: 600px;
            height: 70px;
            font: normal 20px/70px @font-family-600;
            text-transform: uppercase;
          }
        }
        .first-open-btn {
          position: absolute;
          // right: 15px;
          // top: 15px;
          right: 28px;
          top: 28px;
          cursor: pointer;
          .icon-close {
            width: 22px;
            height: 22px;
          }
          .close {
            position: relative;
          }
          .close::before,
          .close::after {
            position: absolute;
            content: ' ';
            background-color: inherit;
            left: -5px;
            width: 1px;
            height: 20px;
          }
          .close::before {
            transform: rotate(45deg);
          }
          .close::after {
            transform: rotate(-45deg);
          }
        }
      }
      &.first-open {
        transform-origin: center;
      }
    }
  }
}
</style>
