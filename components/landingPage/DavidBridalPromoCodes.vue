<template>
  <!--  -->
  <az-popup-layer :lockScroll="true" :z-index="12" @close="clickClose" width="1184px" height="auto">
    <div v-track.view="{ common: getBiParams('dbwelcome', 'signup_success') }" class="david-bridal-promo-codes">
      <div class="david-bridal-promo-codes-main">
        <p class="title">CONGRATULATIONS!</p>
        <p class="codes-are">You have received the special offers from Azazie!</p>
        <div class="codes-box">
          <coupon-item v-for="item in coupons" :key="item.couponCode" :val="item"></coupon-item>
        </div>
        <!-- <p class="codes-des">Copy the codes above to use at checkout. Still deciding? No worries we've also sent them to your inbox!</p> -->
        <az-button v-track.view.click="{ common: getBiParams('dbwelcome', 'singup_shop_now') }" @click="clickShop" class="btn btn-theme"
          >show now</az-button
        >
      </div>
    </div>
  </az-popup-layer>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import CouponItem from '@/components/coupon/CouponItem.vue'
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'

/**
 * david bridal 落地页注册后优惠券弹框
 * 展示四个优惠券
 */
export default {
  components: {
    AzButton,
    CouponItem,
    AzPopupLayer
  },
  props: {
    // 所有优惠券
    coupons: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      return {
        ec,
        el
      }
    },
    // 点击关闭时需要操作coupon-pop/add-view-record接口，将用户是否查看过新券的状态置为true，从而避免刷新页面时，DialogCoupon组件弹出
    clickClose() {
      const postData = {
        viewType: 'new_coupon_pop' // 新券弹窗new_coupon_pop ，红点new_coupon_red_point
      }
      // 优惠券弹框关闭和红点点击记录接口
      this.$axios
        .$post('/1.0/coupon-pop/add-view-record', postData)
        .then((res) => {
          if (res) {
            this.$store.commit('userInfo/setNewCouponPopClick', true)
          }
          this.$store.commit('userInfo/setDavidBridalCoupons', [])
          // let href = location.href
          // if (href.includes('?')) {
          //   href += '&bridal_gowns=true'
          // } else {
          //   href += '?bridal_gowns=true'
          // }
          // location.href = href
        })
        .catch((err) => {
          console.log(err)
        })
    },
    clickShop() {
      this.$store.commit('userInfo/setDavidBridalCoupons', [])
      this.$emit('clickShop')
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .az-popup-box {
  padding: 60px 157px !important;
  box-sizing: border-box;
  max-height: 758px;
}
.david-bridal-promo-codes {
  width: 100%;
  margin: auto;
  text-align: center;
  &-main {
    .title {
      font-family: @font-family-700;
      font-size: 32px;
      line-height: 44px;
      text-align: center;
      letter-spacing: 0.1em;
      height: 53px;
    }
    .codes {
      &-are {
        font-size: 24px;
        line-height: 33px;
        text-align: center;
        letter-spacing: 0.1em;
        margin-bottom: 30px;
      }
      &-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        text-align: left;
        /deep/ .coupon-item {
          &:nth-child(3) {
            margin-top: 20px;
          }
        }
      }
      &-des {
        margin-bottom: 30px;
      }
    }
    .btn {
      // width: 160px;
      width: 259px;
      height: 50px;
      margin-top: 30px;
    }
  }
}
</style>
