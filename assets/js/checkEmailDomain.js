export default {
  data() {
    return {
      needCheckEmailDomain: 1,
      emailDomainError: false,
      emailDomainShow: true
    }
  },
  methods: {
    initEmailCheckDomain() {
      this.needCheckEmailDomain = 1
      this.emailDomainError = false
      this.emailDomainShow = true
      if (this.rulesResult) {
        this.rulesResult.email = ''
      }
      if (this.rulesRes) {
        this.rulesRes.email = ''
      }
      if (this.rules && this.rules.email) {
        this.rules.email.errorMsg = ''
      }
    },
    onBlurEmail() {
      const timer = setTimeout(() => {
        this.emailDomainShow = false
        clearTimeout(timer)
      }, 300)
    }
  }
}
