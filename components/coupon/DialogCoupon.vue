<template>
  <div v-show="visible && bgLoaded" v-track.view="{ common: getBiParams('couponpopup') }" class="dialog-coupon">
    <div class="dialog-coupon-container">
      <img
        @load="handleBgLoaded"
        :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/01/fd/953575223a37057b6245db8bfc4a01fd.jpg')"
        class="dialog-coupon-bg"
        alt="Dialog coupon background"
      />
      <button
        v-track.click="{ common: getBiParams('couponpopupclose') }"
        @click="clickClose"
        tabindex="0"
        aria-label="Close button"
        class="close-button"
      >
        <az-icon icon-class="icon-icon_style_gallery_off"></az-icon>
      </button>
      <az-icon icon-class="iconsuccess" class="icon-success"></az-icon>
      <p class="dialog-coupon-des">{{ nl('page_dialog_coupon_des') }}</p>
      <div class="dialog-coupon-main">
        <coupon-item v-for="item in newCouponList" :key="item.id" :val="item"></coupon-item>
      </div>
      <div class="dialog-coupon-btns">
        <az-button
          v-track.click="{ common: getBiParams('couponpopupshopnowbutton') }"
          @click="clickClose('shopNow')"
          class="btn btn-default"
          >{{ nl('page_index_shop_now') }}</az-button
        >
        <a
          v-track.click="{ common: getBiParams('couponpopupcheckoutcouponsbutton') }"
          @click="clickClose('checkCoupons')"
          href="javascript:;"
          role="button"
          class="check-coupons"
          >{{ nl('page_button_check_coupons') }}</a
        >
      </div>
    </div>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import CouponItem from '@/components/coupon/CouponItem'
import { mapState } from 'vuex'

/**
 * 优惠券弹框操作组件，展示可用优惠券
 */
export default {
  name: 'DialogCoupon',
  languageKeys: ['page_dialog_coupon_des', 'page_index_shop_now', 'page_button_check_coupons', ...CouponItem.languageKeys],
  components: {
    AzButton,
    CouponItem
  },
  props: {
    // 是否可用，控制本组件显示隐藏
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bgLoaded: false // 背景图是否加载完成，完成后才允许组件展示
    }
  },
  computed: {
    ...mapState('userInfo', ['newCouponList'])
  },
  watch: {
    visible(e) {
      if (e) {
        // 禁止页面滚动
        document.body.style.overflow = 'hidden'
      } else {
        // 放开页面滚动
        document.body.style.overflow = ''
      }
    }
  },
  methods: {
    // 背景图片加载完成后，将状态设为允许展示
    handleBgLoaded() {
      this.bgLoaded = true
    },
    // 打点
    getBiParams(el) {
      return {
        ec: 'coupon',
        el,
        msg: JSON.stringify({
          count: this.newCouponList.length // 券数量
        })
      }
    },
    // 关闭操作
    clickClose(type) {
      const postData = {
        viewType: 'new_coupon_pop' // 新券弹窗new_coupon_pop ，红点new_coupon_red_point
      }
      // 优惠券弹框关闭和红点点击记录接口
      this.$axios
        .$post('/1.0/coupon-pop/add-view-record', postData)
        .then((res) => {
          if (res) {
            this.$store.commit('userInfo/setNewCouponPopClick', true)
            if (type === 'shopNow') {
              // // 仅一张券coupon仅适用一个品类时跳转对应品类列表页，多张券时点击shop now关闭当前弹窗
              // if (
              //   this.newCouponList.length === 1 &&
              //   this.newCouponList[0].couponApplyCatArr &&
              //   this.newCouponList[0].couponApplyCatArr.length === 1
              // ) {
              //   location.href = this.countryUrl(this.newCouponList[0].couponApplyCatArr[0].url)
              // }
              this.bgLoaded = false
            } else if (type === 'checkCoupons') {
              location.href = this.countryUrl('/user?my_coupons')
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-coupon {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: @popuy-z-index;
  &-container {
    width: 365px;
    padding: 15px 30px 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .close-button {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 16px;
      height: auto;
      width: auto;
      border: none;
      padding: 0px;
      line-height: 16px;
      background: none;
      &:active {
        background: none;
      }
    }
    .icon-success {
      font-size: 40px;
    }
  }
  &-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  &-des {
    margin: 8px 0px 15px;
    font-size: 13px;
    line-height: 18px;
    font-family: @font-family-600;
  }
  &-main {
    width: 100%;
    max-height: 230px;
    overflow: auto;
    // 重置滚动条样式
    &::-webkit-scrollbar-track-piece {
      background: #f1f1f1;
    }
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    > div {
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
  &-btns {
    width: 100%;
    margin-top: 14px;
    text-align: center;
    button {
      width: 100%;
      margin-bottom: 10px;
    }
    .check-coupons {
      font-size: 14px;
      line-height: 19px;
      text-align: center;
      text-decoration-line: underline;
      color: @theme-color;
      font-family: @font-family-600;
    }
  }
}
</style>
