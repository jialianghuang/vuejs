import { mapState } from 'vuex'
export default {
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('cart', ['summaryInfo'])
  },
  methods: {
    validateCart() {
      this.$store.commit('cart/setCartWarningDec', [])
      this.$axios
        .$get('/1.0/cart/status', {
          params: {
            status_to_check: JSON.stringify(this.summaryInfo.statusToCheck)
          }
        })
        .then((res) => {
          if (res.code == 0) {
            this.loading = false
            if (!res.data.available) {
              window.location.reload()
              window.location.href = this.countryUrl(`/cart`)
            }
            if (res.data.errorTips && res.data.errorTips.length > 0) {
              // 处理购物车报错
              this.$store.commit('cart/setCartWarningDec', res.data.errorTips)
              this.setDataLayer({
                action: 'View',
                category: 'M_ShoppingBag_A',
                label: 'M_ShoppingBag_Sign_ChooseParty_ErrorTip_View_A'
              })
              window.scroll(0, 0)
              const items = []
              res.data.errorTips.forEach((item, index) => {
                const temp = {
                  ec: 'checkout',
                  el: 'checkout',
                  ea: 'view',
                  msg: JSON.stringify({ error: item.msg })
                }
                items.push(temp)
                this.buryPoint(this, 'events', items)
                const limitCode = [200002, 200005, 200001, 200004, 200102, 200100]
                if (limitCode.includes(item.code)) {
                  // 商品超限报错
                  this.setPoint('note', 'exceedLimit', 'view', { error: item.msg })
                }
                const invalidCode = [200101, 200003]
                // 商品失效报错
                if (invalidCode.includes(item.code)) {
                  this.setPoint('note', 'invalid', 'view', { error: item.msg })
                }
                if (item.code == 200101) {
                  setTimeout(function() {
                    window.location.reload()
                  }, 3000)
                }
              })
            } else {
              this.setDataLayer({
                action: 'click',
                category: 'PC_GuestCheckout',
                label: 'PCA_GuestCheckoutSuccess_Click'
              })
              // 这里是购物车点击 continue checkout 跳转到 checkout 页面的代码
              // 用于记录 上一个页面是购物车/购物车后面的登陆注册页情况下，checkout页面曝光数，设置sessionStorage 方便checkout 页面辨识
              sessionStorage.setItem('fromCart', '1')
              window.location = this.countryUrl('/checkout')
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
