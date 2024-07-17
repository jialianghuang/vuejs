export default {
  props: {
    originEmail: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      emailDomainShow: true,
      emailDomain: [],
      emailDomainTimer: null
    }
  },
  computed: {
    getData({ originEmail, emailDomain }) {
      const data = []
      const arrDomain = []
      if (Array.isArray(arrDomain)) {
        emailDomain.forEach((domain) => {
          if (!domain.startsWith('@')) {
            domain = '@' + domain
          }
          arrDomain.push(domain)
        })
      }
      if (originEmail !== '') {
        const indexOf = originEmail.indexOf('@')
        if (indexOf > 0) {
          const starts = originEmail.slice(0, indexOf)
          const ends = originEmail.slice(indexOf, originEmail.length)
          arrDomain.forEach((item) => {
            if (item.startsWith(ends) && item !== ends) {
              data.push(starts + item)
            }
          })
        } else if (indexOf == -1) {
          arrDomain.forEach((item) => {
            data.push(originEmail + item)
          })
        }
      }
      return data
    }
  },
  mounted() {
    const emailDomain = sessionStorage.getItem('emailDomain')
    if (emailDomain) {
      this.emailDomain = JSON.parse(emailDomain)
    } else {
      // eslint-disable-next-line no-lonely-if
      if (!this.emailDomain.length) this.getEmailDomain()
    }
  },
  methods: {
    getEmailDomain() {
      this.retentionReject()
      this.$axios
        .$get(`/1.0/user/email-domain?language_code=en`)
        .then((data) => {
          if (data.code == 0) {
            this.emailDomain = data.data.domains
            sessionStorage.setItem('emailDomain', JSON.stringify(data.data.domains))
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    emailDomainEvent(val) {
      this.email = `${this.email}@${val}`
      if (this.emailBlur) {
        this.emailBlur()
      }
    },
    resetRulesResult() {
      const keys = Object.keys(this.rulesResult)
      keys.map((item) => {
        this.rulesResult[item] = ''
      })
    },
    createShowroom() {
      this.$axios.$post(`/1.0/showroom`).then((res) => {
        if (res.code == 0) {
          // this.$emit('refreshUser')
          location.href = this.countryUrl(`/showroom/${res.data.showroomIdDisplay}`)
        } else {
          alert(res.msg)
        }
      })
    }
  }
}
