import AzButton from '@/components/az-ui/AzButton'
import CouponWheel from '@/components/coupon/CouponWheel'

export default {
  languageKeys: ['page_lucky_wheel_copy_success_text', 'page_lucky_wheel_correct_email_text'],
  components: { AzButton, CouponWheel },
  props: {
    expand: {
      type: Boolean,
      default: false
    },
    couponWheelConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    firstOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      onDrawTimer: 0,
      showAllId: 0,
      copySuccessText: '',
      userRole: '',
      userRoleUrl: '',
      showRoleOptions: false,
      email: '',
      emailError: null,
      startBtnLoading: false,
      success: false,
      drawCoupon: null,
      readyBtnEnter: false,
      successBtnEnter: false,
      bindedCouponEmail: false,
      couponScale: 0,
      topSafeHeight: 230,
      bottomSafeHeight: 160,
      center: true,
      rewardCode: '', // 色卡 coupon code
      isFreeSwatch: false
    }
  },
  computed: {
    showHtml() {
      if (
        this.couponWheelConfig.mainBody &&
        this.couponWheelConfig.mainBody.disclaimerText &&
        this.couponWheelConfig.mainBody.disclaimerText.length
      ) {
        const showHtml = this.couponWheelConfig.mainBody.disclaimerText[0]
        return showHtml
      }
      return null
    },
    showHtmlColor() {
      if (
        this.couponWheelConfig.mainBody &&
        this.couponWheelConfig.mainBody.disclaimerTextColor &&
        this.couponWheelConfig.mainBody.disclaimerTextColor.length
      ) {
        const showHtmlColor = this.couponWheelConfig.mainBody.disclaimerTextColor[0]
        return showHtmlColor
      }
      return null
    }
  },
  watch: {
    expand: {
      handler(val) {
        if (val) {
          this.copySuccessText = ''
          this.setBiAnalysis('trymyluck', 'view')
        }
        this.isOpenCouponWheel(val)
      },
      immediate: true
    },
    firstOpen: {
      handler(val) {
        val && this.setBiAnalysis('trymyluck', 'view')
        this.isOpenCouponWheel(this.firstOpen)
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener(
      'resize',
      () => {
        this.getWindowHeight()
      },
      false
    )
    this.getWindowHeight()
    this.closeOptions = (e) => {
      if (!e.target.closest('.role-select')) {
        this.showRoleOptions = false
      }
    }
    document.body.addEventListener('click', this.closeOptions)
    let couponCodeTemp = localStorage.getItem('COUPON_CODE_TEMP')
    // 如果存在缓存couponCode，并且在有效期内，组件直接显示券码页面内容
    if (couponCodeTemp && couponCodeTemp.expire >= new Date().getTime() && couponCodeTemp.country === this.country) {
      couponCodeTemp = JSON.parse(couponCodeTemp)
      this.success = true
      this.bindedCouponEmail = true
      this.drawCoupon = couponCodeTemp.couponCode
    }
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.closeOptions)
  },
  methods: {
    // 判断是正式用户还是游客，只有游客走新逻辑色卡下单
    isOpenCouponWheel(status) {
      this.$store.commit('setCouponWheelIsShow', status)
    },
    loginAxios() {
      this.retentionReject()
      this.$axios
        .$post(`/1.0/user/guest`, { email: this.email })
        .then((res) => {
          if (res.code == 0) {
            this.isFreeSwatch = true
            this.$cookie.setCookie('swatch_login_token', res.data.token, 7)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 游客直接购买色卡
    handleCouponSwatchShow() {
      this.setBiAnalysis('shopnow', 'click')
      this.$store.commit('setIsCouponSwatch', true)
    },
    closeCouponWheel() {
      this.$emit('showCouponWheel', false, 1)
      this.$emit('firstOpenChange', false)
      this.$store.commit('setCouponWheelIsShow', false)
    },
    judgeSuccessBi() {
      if (this.success && this.bindedCouponEmail) {
        this.setBiAnalysis('success', 'view')
        this.setBiAnalysis('trymyluck_success', 'click')
        this.setBiAnalysis('trymyluck_success', 'view')
      }
    },
    setBiAnalysis(el, ea) {
      if (Array.isArray(el)) {
        this.buryPoint(
          this,
          'events',
          el.map((item) => ({ ec: this.ecBi || 'coupon', el: item.el, ea: item.ea }))
        )
      } else {
        this.buryPoint(this, 'event', { ec: this.ecBi || 'coupon', el, ea })
      }
    },
    onCopy() {
      this.setBiAnalysis('shopnow', 'click')
      this.copySuccessText = this.nl('page_lucky_wheel_copy_success_text')
      this.showAll()
      this.toDetail()
    },
    onError() {
      this.setBiAnalysis('shopnow', 'click')
      console.log('copy error')
      this.toDetail()
    },
    getWindowHeight() {
      const windowHeight = window.innerHeight
      // 算出1px所占的比例
      const ratioY = 0.83 / 980
      let scaleY = ratioY * windowHeight
      if (scaleY >= 1) scaleY = 1
      // 计算出coupon高度
      let bottomHeight = (windowHeight - scaleY * 700) / 2
      if (bottomHeight <= this.topSafeHeight) {
        bottomHeight = this.topSafeHeight
        const couponHeight = windowHeight - this.bottomSafeHeight - this.topSafeHeight
        scaleY = couponHeight / 700

        this.center = false
      } else {
        this.center = true
      }

      const windowWidth = window.innerWidth
      // 算出1px所占的比例
      const ratioX = 0.83 / 1920
      let scaleX = ratioX * windowWidth
      if (scaleX >= 1) scaleX = 1
      let resScale = scaleY < scaleX ? scaleY : scaleX
      if (parseInt(resScale * 100000) >= parseInt(0.67857 * 100000)) {
        resScale = 0.67857 // 缩放最大值
      } else if (parseInt(resScale * 100000) <= parseInt(0.5 * 100000)) {
        resScale = 0.5 // 缩放最小值
      }
      // this.couponScale = scaleY < scaleX ? scaleY : scaleX
      this.couponScale = resScale
    },
    showAll() {
      // this.$router.push('/all/bridesmaid-dresses')
      if (this.showAllId) clearTimeout(this.showAllId)
      this.showAllId = setTimeout(() => {
        this.exportExpand(false)
      }, 1000)
    },
    startCoupon() {
      this.setBiAnalysis('trymyluck', 'click')
      const isEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ // 校验邮箱格式
      if (!isEmail.test(this.email)) {
        this.emailError = this.nl('page_lucky_wheel_correct_email_text')
        return
      }

      this.startBtnLoading = true
      this.$axios
        .$post('/1.0/coupon-wheel/drawCoupon', {
          email: this.email,
          role: this.userRole,
          role_url: this.userRoleUrl
        })
        .then((resp) => {
          if (resp.code == 0) {
            this.$refs.couponWheel.startCoupon(resp.data)
            this.$cookie.setCookie('UnLoginEmail', this.email, 30, '.' + this.APP_DOMAIN_LOWER) // 设置未登录邮箱缓存
            if (resp.data.isFreeSwatch) {
              const isLogin = this.isLogin
              this.rewardCode = resp.data.rewardCode
              if (!isLogin) this.loginAxios() // 网站已登陆正式用户，则走老逻辑
            }
            // ga4上报
            this.trackGA4NewEmail(this.email, 'coupon_wheel_subscribe', this.userRole)
          } else {
            this.emailError = resp.msg
            this.startBtnLoading = false
          }
        })
        .catch((resp) => {
          this.startBtnLoading = false
        })
    },
    showCoupon() {
      const bis = [{ el: this.expand ? 'sidebarclose' : 'sidebaropen', ea: 'click' }]
      if (this.success && this.bindedCouponEmail && !this.expand) {
        bis.push({ el: 'success', ea: 'view' })
      }
      this.setBiAnalysis(bis)
      this.exportExpand(!this.expand)
    },
    exportExpand(bool) {
      this.$emit('expandChange', bool)
    },
    onDrawErr(msg) {
      this.startBtnLoading = false
      this.emailError = msg
    },
    onDraw(coupon) {
      this.onDrawTimer = setTimeout(() => {
        this.onDrawTimer && clearTimeout(this.onDrawTimer)
        this.success = true
        this.drawCoupon = coupon
        // 将券码缓存半小时
        localStorage.setItem(
          'COUPON_CODE_TEMP',
          JSON.stringify({
            couponCode: coupon, // couponwheel这里是包含couponCode的对象
            mode: 1, // couponwheel的mode是1
            country: this.country,
            expire: new Date().getTime() + 30 * 60 * 1000
          })
        )
        const startTime = this.$cookie.getCookie('coupon-start') || '0'
        this.$cookie.setCookie(`coupon-start-${startTime}`, startTime)
        this.bindedCouponEmail = true
        this.judgeSuccessBi()
      }, 4500)
    },
    onKeydown(e) {
      if (e.keyCode == 13) {
        this.startCoupon()
      }
    },
    toDetail() {
      if (this.drawCoupon && this.drawCoupon.linkUrl) {
        location.href = this.drawCoupon.linkUrl
      }
    }
  }
}
