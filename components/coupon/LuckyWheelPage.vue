<template>
  <div id="coupon-box">
    <div class="coupon-side-all">
      <div class="coupons-contain media-scale wheel-bottom">
        <div class="coupon">
          <div
            v-show="success"
            :style="{
              backgroundImage: `url(${couponWheelConfig.successPage.backGroundImage})`,
              backgroundColor: couponWheelConfig.successPage.backGroundColor
            }"
            class="coupon-success"
          >
            <div :style="{ backgroundImage: `url(${couponWheelConfig.successPage.titleImage})` }" class="title"></div>
            <div class="message">{{ couponWheelConfig.successPage.message && couponWheelConfig.successPage.message[0] }}</div>
            <div
              :style="{
                backgroundImage: `url(${couponWheelConfig.successPage.couponBackGroundImage})`,
                color: bindedCouponEmail ? couponWheelConfig.successPage.couponCodeColor : couponWheelConfig.successPage.waitBindColor,
                fontSize: bindedCouponEmail ? '' : couponWheelConfig.successPage.waitBindFontSize
              }"
              v-if="drawCoupon && drawCoupon.couponCode"
              v-text="bindedCouponEmail ? drawCoupon.couponCode : couponWheelConfig.successPage.waitBindText"
              class="code"
            ></div>
            <div v-html="couponWheelConfig.successPage.message && couponWheelConfig.successPage.message[1]" class="desc"></div>
            <az-button
              :text="copySuccessText || couponWheelConfig.successPage.buttonText"
              :style="{
                backgroundColor: successBtnEnter
                  ? couponWheelConfig.successPage.pressButtonColor
                  : couponWheelConfig.successPage.unPressButtonColor,
                color: '#fff',
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
              backgroundImage: `url(${couponWheelConfig.mainBody.backGroundImage})`,
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
              />
            </div>
            <div class="cou-right">
              <div :style="{ backgroundImage: `url(${couponWheelConfig.mainBody.titleImage})` }" class="title"></div>
              <div v-html="couponWheelConfig.mainBody.titleText" class="message"></div>
              <div class="input-user-info">
                <div class="email-input">
                  <input
                    v-model="email"
                    @input="emailError = ''"
                    @keydown="onKeydown"
                    :placeholder="nl('page_lucky_wheel_placeholder_text')"
                    type="email"
                  />
                  <span>*</span>
                </div>
                <div
                  v-if="couponWheelConfig.mainBody.userRolesOptions && couponWheelConfig.mainBody.userRolesOptions.length"
                  class="role-select"
                >
                  <div @click="showRoleOptions = !showRoleOptions" class="select">
                    <div :class="{ 'select-name--selected': userRole }" class="select-name">{{ userRole || 'I Am...' }}</div>
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
              <div v-if="emailError" v-text="emailError" class="error">error email</div>
              <az-button
                @click="startCoupon"
                :style="{
                  backgroundColor: readyBtnEnter
                    ? couponWheelConfig.mainBody.pressButtonColor
                    : couponWheelConfig.mainBody.unPressButtonColor,
                  color: '#fff',
                  borderRadius: '0',
                  borderColor: couponWheelConfig.mainBody.buttonBorderColor,
                  borderWidth: startBtnLoading ? 0 : '1px',
                  borderStyle: 'solid'
                }"
                :text="couponWheelConfig.mainBody.buttonText"
                @mouseenter.native="readyBtnEnter = true"
                @mouseleave.native="readyBtnEnter = false"
                :loading="startBtnLoading"
                class="btn-try"
              ></az-button>
              <div v-html="showHtml" class="policy"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import luckyMixin from './luckyMixin'

export default {
  name: 'LuckyWheelPage',
  mixins: [luckyMixin]
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
  margin: 30px 0 100px;
  display: flex;
  /*align-items: center;*/
  justify-content: flex-end;
  /*pointer-events: auto;*/
  pointer-events: none;

  .coupon-side-all {
    display: flex;
    position: relative;
    align-items: center;
    margin: 0 auto;

    .coupons-contain {
      position: relative;
      .coupon {
        width: 1263px;
        height: 475px;
        position: relative;
        pointer-events: auto;
        box-sizing: border-box;

        .coupon-ready {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: space-between;
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          pointer-events: auto;

          .cou-left {
            width: (175 + 118) * 2px;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            .wheel {
              position: absolute;
              transform-origin: center;
              transform: scale(0.6);
            }

            .pointer {
              width: 150px;
              height: auto;
              position: absolute;
              right: 0;
              transform: scale(0.6);
            }
          }

          .cou-right {
            width: 443px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-right: 156px;

            .title {
              text-align: center;
              width: 443px;
              height: 109px;
              background-size: 100% 100%;
              // margin-top: 64px;
            }

            .message {
              width: 443px;
              padding-top: 14px;
              font: normal 14px/19px @font-family-600;
              text-align: center;
            }

            .input-user-info {
              width: 443px;
              display: flex;
              margin-top: 20px;
            }

            .role-select {
              margin-left: 15px;
              flex: 1 1 50%;
              position: relative;
              font-family: @font-family-500, serif;
              font-size: 14px;
              .select {
                box-sizing: border-box;
                height: 40px;
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
                  height: 40px;
                  line-height: 40px;
                  padding: 0 10px;
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
              height: 40px;
              border: 1px solid var(--color-cccccc);
              font: normal 14px/19px @font-family-500;
              padding: 0 10px;
              box-sizing: border-box;
              background-color: white;
              display: flex;
              align-items: center;
              input {
                border: none;
                outline: none;
                flex: 1;
                height: 100%;
                width: 100%;
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
              width: 443px;
              margin-top: 10px;
              color: var(--color-ff0000);
              font: normal 10px/12px @font-family-500;
            }

            .btn-try {
              width: 443px;
              height: 50px;
              line-height: 50px;
              margin-top: 15px;
              font: normal 14px/50px @font-family-600;
              text-transform: uppercase;
            }

            /deep/ .policy {
              margin-top: 10px;
              width: 443px;
              color: var(--color-121212);
              text-align: left;
              font-size: 12px;
              line-height: 17px;
              a {
                color: var(--color-121212);
                &:focus,
                &:active,
                &:hover,
                &:visited,
                &[disabled],
                &[disabled]:hover,
                &.disabled,
                &.disabled:hover {
                  color: var(--color-121212);
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
            width: 713px;
            height: 94px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }

          .message {
            width: 713px;
            font: normal 14px/19px @font-family-600;
            padding-top: 13px;
            text-align: center;
          }

          .code {
            margin: 15px 0;
            width: 372px;
            height: 120px;
            text-align: center;
            font-family: @font-family-700;
            line-height: 120px;
            font-size: 36px;
            background-size: 100% 100%;
          }

          .desc {
            width: 796px;
            text-align: center;
            font: normal 14px/19px @font-family-500;
          }

          .btn-shop {
            margin-top: 20px;
            width: 448px;
            height: 50px;
            font: normal 14px/50px @font-family-600;
            text-transform: uppercase;
          }
        }
      }
    }
  }
}
</style>
