<template>
  <div id="coupon-box" :class="{ 'first-open-coupon-box': firstOpen }" class="swatch-coupon-box">
    <div
      :style="{
        transform: `translate(${expand ? 0 : transformWidth}px,50%)`,
        alignSelf: center ? 'center' : 'flex-end',
        bottom: datePickerOpen ? '55%' : newUserEntryBottom,
        transition: 'all 0.3s'
      }"
      :class="[$route.name]"
      class="coupon-side-all main-vue"
    >
      <NewUserCoupon @setNewUserStep="setNewUserStep" @dateChange="(bol) => (datePickerOpen = bol)" />
      <div
        v-if="!hideCouponToggle"
        :style="{ left: '-30px' }"
        :class="`new-user-step-${newUserStep}`"
        class="toggle"
        style="pointer-events: auto"
      >
        <coupon-toggle
          @click.native="showCoupon"
          :open="expand"
          :bgColor="sideBar.colorOfSideBar"
          :textColor="sideBar.colorOfTextAndButton"
          :expandText="nl(sideBar.closeButtonText)"
          :closeText="nl(sideBar.openButtonText)"
          :btnImage="sideBar.openButtonImage"
          :scale="couponScale"
          :ecBi="'newcustomer'"
        />
      </div>
    </div>
  </div>
</template>
<script>
import CouponToggle from '@/components/coupon/CouponToggle'
import NewUserCoupon from '@/components/coupon/NewUserCoupon'
import { mapState } from 'vuex'
import luckyMixin from './luckyMixin'
/**
 * AZWEB-21824 新客弹窗替换coupon wheel 侧边栏显示
 */
export default {
  name: 'SlideNewUserCoupon',
  languageKeys: ['page_common_new_user_15_off_tips', 'page_common_close', ...luckyMixin.languageKeys, ...NewUserCoupon.languageKeys],
  components: { NewUserCoupon, CouponToggle },
  mixins: [luckyMixin],
  data() {
    return {
      newUserStep: 1,
      datePickerOpen: false,
      sideBar: {
        openButtonText: 'page_common_new_user_15_off_tips',
        closeButtonText: 'page_common_close',
        colorOfTextAndButton: '#fff',
        colorOfSideBar: '#121212',
        openButtonImage: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/ce/e9/da3a321d358a211afcab3d29dc08cee9.gif'
      }
    }
  },
  computed: {
    ...mapState({
      scrollToTop: (state) => state.scrollToTop
    }),
    hideCouponToggle() {
      return this.firstOpen || this.$route.name == 'promotion'
    },
    transformWidth({ newUserStep }) {
      let transformWidth = 620
      if (newUserStep == 3) {
        transformWidth = 715
      }

      return transformWidth
    },
    newUserEntryBottom({ $route }) {
      if ($route.name == 'product') {
        return '292px'
      }
      return this.scrollToTop ? '400px' : '292px'
    }
  },
  watch: {
    expand(newVal) {
      if (newVal) {
        this.setPoint('newcustomer', 'newpopupside', 'view')
      } else {
        this.setPoint('newcustomer', 'newpopupclose', 'click')
      }
    }
  },
  methods: {
    getBiParams(el) {
      if (process.server) return
      const params = {
        ec: 'newcustomer'
      }
      if (el) {
        params.el = el
      } else if (this.expand) {
        params.el = 'sidebaropen'
      } else {
        params.el = 'sidebarclose'
      }
      return {
        common: params
      }
    },
    setNewUserStep(newUserStep) {
      this.newUserStep = newUserStep
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
  .coupon-side-all {
    display: flex;
    position: absolute;
    align-items: center;
    transition: transform 1s;
    pointer-events: auto;
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
/deep/ .new-user-coupon-container {
  // box-shadow: 0px 0px 24px 0px var(--color-121212)40;
  &.muti-lang {
    padding-top: 30px;
    padding-bottom: 90px;
  }
  &.new-user-container-step-2 {
    padding-top: 50px;
    padding-bottom: 70px;
  }
}

/deep/.new-user-coupon-content {
  height: 246px !important;
  &.identity-event-date {
    height: 445px !important;
    margin: 0 45px;
    &.congrats {
      width: 595px !important;
      margin: 0;
    }
  }
  &.email {
    margin: 0 45px;
  }
  .new-user-coupon-title {
    font-size: 32px !important;
  }
  .btn-submit {
    margin-top: 15px !important;
  }
  .data-picker-box {
    margin-top: 10px !important;
  }
}

.new-user-step-1,
.new-user-step-2,
.new-user-step-3 {
  height: 0;
  /deep/ .toggle-container {
    margin-top: -13px;
    height: 30px !important;
    border-radius: 0 !important;
    padding: 0 15px;
    transform: rotate(-90deg) translate(-195px) !important;
    span {
      font: normal 14px/19px @font-family !important;
      letter-spacing: 0.7px;
      font-weight: 500 !important;
    }
  }
}

// .new-user-step-2,
// .new-user-step-3 {
//   height: 0;
//   /deep/ .toggle-container {
//     margin-top: 2px;
//     // width: 565px !important;
//     transform: rotate(-90deg) translate(-280px) !important;
//   }
// }
</style>
