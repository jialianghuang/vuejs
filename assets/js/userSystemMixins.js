// import trackNebulas from '@/assets/js/point'
export default {
  props: {
    source: {
      type: String,
      default: '/'
    },
    belong: {
      type: String,
      default: 'page'
    }
  },
  data() {
    return {
      // fbEntranceAvailable: ''
    }
  },
  mounted() {
    // if (!this.fbEntranceAvailable) this.getLoginInfo()
  },
  methods: {
    setPageUrlParam(param) {
      let source = this.source
      try {
        source = decodeURIComponent(source)
      } catch (e) {
        console.log(e)
      }
      source = encodeURIComponent(source)
      if (['is_sign_up', 'has_track'].includes(param)) {
        location.href = this.countryUrl('/user/login?' + param) + '&back=' + source
      } else if (!param) {
        location.href = this.countryUrl('/user/login') + '?back=' + source
      } else {
        location.href = this.countryUrl('/user/login?' + param)
      }
    },
    toSignIn() {
      if (this.belong == 'dialog') {
        this.$emit('toSignIn')
        return false
      }
      this.setPageUrlParam('')
    },
    toCreateAccount() {
      this.buryPoint(this, 'event', {
        ec: 'signup',
        el: 'creatanaccount',
        ea: 'click'
      })
      if (this.belong == 'dialog') {
        this.$emit('layerToCreate')
        return false
      }
      this.setPageUrlParam('is_sign_up')
    },
    toForget() {
      if (this.belong == 'dialog') {
        this.$emit('layerToForget')
        return false
      }
      this.setPageUrlParam('forget_password')
    },
    toTrack() {
      this.buryPoint(this, 'event', {
        ec: 'signup',
        el: 'guest',
        ea: 'click'
      })
      this.setPageUrlParam('has_track')
    },
    createShowroom() {
      this.$axios.$post(`/1.0/showroom`).then((res) => {
        // this.$emit('refreshUser')
        if (res.code == 0) {
          location.href = this.countryUrl(`/showroom/${res.data.showroomIdDisplay}`)
        } else {
          alert(res.msg)
        }
      })
    }
  }
}
