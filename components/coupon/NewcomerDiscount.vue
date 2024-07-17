<template>
  <div class="newcomer-discount">
    <div v-if="!show" @click="show = true" :style="{ background: sideBar.colorOfSideBar }" class="newcomer-discount-top-right">
      <span :style="{ color: sideBar.colorOfTextAndButton }">{{ sideBar.openButtonText }}</span>
      <i></i>
    </div>
    <div :class="{ show: show }" class="newcomer-discount-box">
      <!-- 邮箱操作弹框区 -->
      <div v-if="step == 1" :style="{ backgroundImage: 'url(' + mainBody.backGroundImage + ')' }" class="newcomer-discount-main">
        <az-icon @click="clickClose(1)" icon-class="icon-coupon-wheel-close" class="close"></az-icon>
        <div class="newcomer-discount-main-inner">
          <img :src="replaceImgCdnUrl(mainBody.titleImage)" class="discount-img" alt="discount" />
          <p v-html="mainBody.titleText"></p>
          <input :class="{ error: errorInfo }" v-model="email" @blur="checkEmail" :placeholder="mainBody.placeholderText" type="email" />
          <p v-if="errorInfo" class="error">{{ errorInfo }}</p>
          <button @click="clickSignUp" :style="buttonStyle" class="btn confirm">{{ mainBody.buttonText }}</button>
        </div>
      </div>
      <!-- 操作成功区 -->
      <div v-else :style="{ backgroundImage: 'url(' + successPage.backGroundImage + ')' }" class="newcomer-discount-main">
        <az-icon @click="clickClose(2)" icon-class="icon-coupon-wheel-close" class="close"></az-icon>
        <div class="newcomer-discount-main-inner">
          <h2>{{ successPage.successText }}</h2>
          <p v-html="successPage.couponText"></p>
          <div
            :style="{ backgroundImage: 'url(' + successPage.couponBackGroundImage + ')', color: successPage.couponCodeColor }"
            class="coupon"
          >
            {{ couponCode }}
          </div>
          <button
            v-clipboard:copy="couponCode"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"
            :style="successButtonStyle"
            @click="clickCopy"
            class="btn success"
          >
            {{ copySuccessInfo || successPage.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 新用户福利活动，弹框展示输入邮箱
 * 注意：现活动仅限AU，GB
 */
export default {
  name: 'NewcomerDiscount',
  components: {},
  props: {
    // 活动配置数据
    configData: {
      type: Object,
      default: () => {}
    },
    // 是否展开弹框，初次进入展开，后续不展开
    autoShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.autoShow, // 是否展示弹框主内容
      email: '',
      step: 1, // 1 未操作 2 操作成功
      couponCode: '',
      errorInfo: '', // email错误信息
      copySuccessInfo: '' // 复制操作成功后的提示，直接在按钮上显示
    }
  },
  computed: {
    // 侧边收缩内容配置数据
    sideBar() {
      return this.configData.sideBar || {}
    },
    // 弹框主内容配置数据
    mainBody() {
      return this.configData.mainBody || {}
    },
    // 操作成功页内容配置数据
    successPage() {
      return this.configData.successPage || {}
    },
    // 邮箱确认按钮样式
    buttonStyle() {
      return {
        '--color': this.mainBody.buttonTextColor,
        '--background': this.mainBody.unPressButtonColor,
        '--background-hover': this.mainBody.pressButtonColor // hover背景颜色
      }
    },
    // 操作成功按钮样式
    successButtonStyle() {
      return {
        '--color': this.successPage.buttonTextColor,
        '--background': this.successPage.unPressButtonColor,
        '--background-hover': this.successPage.pressButtonColor // hover背景颜色
      }
    }
  },
  watch: {
    // 每次组件内容隐藏缩小都要清空email和错误提示
    show(e) {
      if (!e) {
        this.email = ''
        this.errorInfo = ''
      } else {
        this.buryPoint(this, 'event', { ec: 'newcustomer', el: 'popup', ea: 'view' })
      }
    }
  },
  mounted() {
    if (this.show) {
      this.buryPoint(this, 'event', { ec: 'newcustomer', el: 'popup', ea: 'view' })
    }
    let couponCodeTemp = localStorage.getItem('COUPON_CODE_TEMP')
    // 如果存在缓存couponCode，组件直接显示券码页面内容
    if (couponCodeTemp) {
      couponCodeTemp = JSON.parse(couponCodeTemp)
      this.step = 2
      this.couponCode = couponCodeTemp.couponCode
    } else {
      this.step = 1
      this.couponCode = ''
    }
  },
  methods: {
    /**
     * 校验邮箱输入
     */
    checkEmail() {
      // 先清空错误提示信息
      this.errorInfo = ''
      // 校验邮箱是否为空
      if (!this.email) {
        this.errorInfo = this.nl('page_login_enter_email')
        return false
      }
      if (!this.emailFormCheck(this.email)) {
        this.errorInfo = this.nl('page_email_enter_valid')
        return false
      }
      return true
    },
    /**
     * 点击sign up，校验邮箱
     */
    clickSignUp() {
      // 打点记录
      this.buryPoint(this, 'event', { ec: 'newcustomer', el: 'signup', ea: 'click' })
      if (this.checkEmail()) {
        this.$axios.$post('/1.0/coupon-pop/issuedPopCoupon?email=' + this.email).then((resp) => {
          if (resp.code == 0) {
            this.buryPoint(this, 'event', { ec: 'newcustomer', el: 'signupsuccess', ea: 'click' })
            // 操作成功后，切换到券码显示
            this.step = 2
            this.couponCode = resp.data.random_coupon // 优惠券码
          } else {
            this.errorInfo = resp.msg
            this.buryPoint(this, 'event', { ec: 'newcustomer', el: 'signuprepeat', ea: 'click' })
          }
        })
      }
    },
    /**
     * 获取券码后，点击copy和点击关闭都走这里
     */
    handleCouponResult() {
      // 将券码缓存半小时
      localStorage.setItem(
        'COUPON_CODE_TEMP',
        JSON.stringify({
          couponCode: this.couponCode,
          mode: 2, // 当前券活动类型
          country: this.country, // 当前券码生效国家
          expire: new Date().getTime() + 30 * 60 * 1000
        })
      )
      // 设置缓存，表明用户已经成功进行过操作，页面将不再显示活动组件
      const startTime = this.$cookie.getCookie('coupon-start') || '0'
      this.$cookie.setCookie(`coupon-start-${startTime}`, startTime)
    },
    /**
     * 复制当前券码成功，提示用户，并关闭当前组件
     */
    onCopySuccess() {
      console.log('copy success')
      this.copySuccessInfo = this.successPage.copyText // 复制成功的提示
      this.handleCouponResult()
      // 3s后隐藏组件
      setTimeout(() => {
        this.show = false
      }, 3000)
    },
    onCopyError() {
      console.log('copy error')
    },
    // 点击copy按钮，打点记录
    clickCopy() {
      this.buryPoint(this, 'event', { ec: 'newcustomer', el: 'copycode', ea: 'click' })
    },
    /**
     * 点击弹框上的关闭图标
     * @param e 在弹框第一屏页点击还是第二屏页面点击
     */
    clickClose(e) {
      if (e == 1) {
        this.buryPoint(this, 'event', { ec: 'newcustomer', el: 'popupclose1page', ea: 'click' })
      } else if (e == 2) {
        this.buryPoint(this, 'event', { ec: 'newcustomer', el: 'popupclose2page', ea: 'click' })
        this.handleCouponResult()
      }
      this.show = false
    }
  }
}
</script>
<style lang="less" scoped>
.newcomer-discount {
  font-family: @font-family-500;
  &-top-right {
    position: absolute;
    right: 0;
    top: 0;
    width: 130px;
    height: 130px;
    background: #e28a95;
    z-index: @popuy-z-index;
    color: #fff;
    font-size: 14px;
    transition: 0.3s;
    cursor: pointer;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
    span {
      position: absolute;
      left: 8%;
      top: 33%;
      transform: rotate(45deg);
      display: block;
      width: 140px;
      text-align: center;
      transition: 0.3s;
    }
    i {
      display: inline-block;
      border-right: 4px solid #fff;
      border-bottom: 4px solid #fff;
      border-left: 4px solid transparent;
      border-top: 4px solid transparent;
      position: absolute;
      left: 68%;
      top: 28%;
      transform: rotate(90deg);
      transition: 0.3s;
    }
    &:hover {
      width: 150px;
      height: 150px;
      span {
        left: 11%;
        top: 34%;
      }
      i {
        left: 63%;
        top: 30%;
      }
    }
  }
  &-box {
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: @popuy-z-index;
    transition: 0.3s;
    overflow: hidden;
    transform: scale(0);
    &.show {
      width: 100%;
      height: 100%;
      transform: scale(1);
    }
  }

  &-main {
    width: 688px;
    height: 440px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    &-inner {
      width: 560px;
      padding: 20px 32.5px;
      // background: #e28a95;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: -20px;
    }
    .close {
      width: 16px;
      height: 16px;
      position: absolute;
      right: 15px;
      top: 15px;
      cursor: pointer;
    }
    .discount-img {
      height: 104px;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      width: 500px;
      &.error {
        color: var(--color-ff0000);
        font-size: 13px;
        margin-top: 5px;
        line-height: 18px;
        text-align: left;
      }
    }
    input {
      width: 500px;
      height: 45px;
      background: #fff;
      font-size: 13px;
      padding: 0 15px;
      margin-top: 20px;
      box-sizing: border-box;
      border: none;
      &::placeholder {
        color: #999;
      }
      &.error {
        border: 1px solid red;
      }
    }
    h2 {
      font-size: 40px;
      margin-bottom: 20px;
      text-transform: uppercase;
      margin-top: -10px;
    }
    .coupon {
      width: 320px;
      height: 104px;
      text-align: center;
      line-height: 104px;
      text-transform: uppercase;
      font-size: 36px;
      color: #ffe78e;
      margin-top: 20px;
      font-weight: 700;
      position: relative;
      overflow: hidden;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
    .btn {
      width: 500px;
      height: 50px;
      border: none;
      outline: none;
      font-size: 18px;
      font-family: @font-family-500;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 20px;
      background: var(--background);
      color: var(--color);
      &:hover,
      &:active {
        background: var(--background-hover);
      }
    }
  }
}
</style>
