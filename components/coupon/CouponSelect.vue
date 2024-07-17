<template>
  <transition name="fade">
    <div v-if="couponSelectVisible" @click.self="handleClose" class="coupon-select">
      <transition name="rightin">
        <div v-if="show" v-track.view="{ common: { ec: 'mycoupon', el: 'checkoutpage' } }" class="coupon-select-main">
          <div class="coupon-select-header">
            <span>{{ nl('page_account_my_coupons') }}</span>
            <div @click="handleClose" class="close">
              <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
            </div>
          </div>
          <az-tabs :options="tabs" @onChange="handleTabsChange" line-width="80px">
            <div v-if="status === 'available'" class="remind">{{ nl('page_coupon_only_one_can_be_used') }}</div>
            <div class="coupon-select-body">
              <template v-if="status === 'available'">
                <div class="input-box">
                  <div class="input">
                    <input
                      v-model="couponCode"
                      :readonly="couponInfo.code || hasSelectedItem"
                      :placeholder="nl('page_checkout_promo_code')"
                      type="text"
                    />
                    <button
                      v-if="couponInfo.code || hasSelectedItem"
                      v-track.view.click="{ common: { ec: 'mycoupon', el: 'removebutton' } }"
                      @click="clickInputBtn('remove')"
                      class="remove"
                    >
                      {{ nl('page_common_remove') }}
                    </button>
                    <button
                      v-else
                      v-track.click="{ common: { ec: 'mycoupon', el: 'applybutton' } }"
                      @click="clickInputBtn('apply')"
                      class="apply"
                    >
                      {{ nl('page_checkout_apply') }}
                    </button>
                  </div>
                  <p ref="errorMsg" v-show="errorMsg" class="error-msg">{{ errorMsg }}</p>
                </div>
              </template>
              <div
                v-if="status === 'available'"
                :class="{ 'choose-result-show': couponValue }"
                :style="{ height: couponBoxHeihgt }"
                class="coupon-item-box"
              >
                <coupon-item
                  v-for="item in availableList"
                  :key="item.couponCode"
                  :val="item"
                  :can-choose="true"
                  @onChoose="handleCouponChoose"
                ></coupon-item>
                <no-data v-if="availableList.length === 0 && !loading"></no-data>
              </div>
              <div v-if="status === 'unavailable'" :style="{ height: couponBoxHeihgt }" class="coupon-item-box coupon-item-box-unavailable">
                <div v-for="item in notAvailableList" :key="item.couponCode" class="coupon-it">
                  <coupon-item :val="item" :can-choose="true" :disabled="true"></coupon-item>
                  <div v-if="item.errorMsg && item.errorMsg.msg" class="unavailable-tip">
                    <az-icon icon-class="icon-icon_des" />
                    <span>{{ item.errorMsg.msg }}</span>
                  </div>
                </div>
                <no-data v-if="notAvailableList.length === 0 && !loading"></no-data>
              </div>
              <div v-if="showContinuebox" class="choose-result">
                <div class="choose-result-info">
                  <span>{{ nl('page_coupon_one_coupon_selected') }}</span>
                  <div>
                    {{ nl('page_address_save') }}:
                    <span>{{ jsKey == 'cart' ? summaryInfo.activityOrderBonusDisplay : checkoutSummary.bonusDisplay }}</span>
                  </div>
                </div>
                <az-button v-track.view.click="{ common: { ec: 'mycoupon', el: 'continuebutton' } }" @click="handleContinue">
                  {{ nl('page_common_continue') }}
                </az-button>
              </div>
            </div>
          </az-tabs>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
import AzTabs from '@/components/az-ui/AzTabs'
import CouponItem from '@/components/coupon/CouponItem'
import NoData from '@/components/common/NoData'
import AzButton from '@/components/az-ui/AzButton'
import { mapState } from 'vuex'

/**
 * 优惠券列表选择弹框展示组件
 * 现用于checkout页面选择可用优惠券操作
 */
export default {
  name: 'CouponSelect',
  components: {
    AzTabs,
    CouponItem,
    NoData,
    AzButton
  },
  props: {
    // 初始化coupon选择
    init: {
      type: Boolean,
      default: false
    },
    // 接口要传递的参数
    resParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否刷新数据
    refresh: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    return {
      show: false,
      status: 'available',
      tabs: [
        {
          name: 'page_coupon_tab_available_text',
          key: 'available',
          count: ''
        },
        {
          name: 'page_coupon_tab_no_available_text',
          key: 'unavailable',
          count: '',
          ec: 'mycoupon',
          el: 'notavailablecheckoutpage'
        }
      ],
      availableList: [], // 可用券列表
      notAvailableList: [], // 不可用券列表
      loading: true, // 记载状态
      couponCode: '', // 优惠券码
      couponValue: '', // 优惠金额
      errorMsg: '', // 错误提示
      hasSelectedItem: false, // 列表中是否有已选择确认项
      couponBoxHeihgt: '', // 优惠券列表容器高度，会根据tab切换和是否有errorMsg动态修改
      showTimer: null,
      hideTimer: null
    }
  },
  computed: {
    ...mapState({
      couponInfo: (state) => state.checkout.couponInfo,
      checkoutSummary: (state) => state.checkout.checkoutSummary,
      checkoutLoginEmail: (state) => state.checkout.checkoutLoginEmail,
      summaryInfo: (state) => state.cart.summaryInfo,
      couponSelectVisible: (state) => state.checkout.couponSelectVisible,
      paymentId: (state) => state.checkout.paymentId
    }),
    // 是否展示底部continue操作区
    showContinuebox() {
      return this.status === 'available' && (this.checkoutSummary.bonus || this.summaryInfo.activityOrderBonus)
    }
  },
  watch: {
    couponSelectVisible(e) {
      if (e) {
        this.status = 'available'
        // 清除显示定时器
        if (this.showTimer) clearTimeout(this.showTimer)
        this.showTimer = setTimeout(() => {
          this.show = true
        }, 100)
        this.handleShowInitCoupon()
        // 降低launcher的层级
        this.setMessageZindex(true)
        this.queryCoupons()
      }
    },
    show(e) {
      if (!e) {
        // 清除隐藏定时器
        if (this.hideTimer) clearTimeout(this.hideTimer)
        this.hideTimer = setTimeout(() => {
          // this.$emit('update:visible', false)
          this.$store.commit('checkout/setCouponSelectVisible', false)
          // 恢复launcher的层级
          this.setMessageZindex(false)
        }, 300)
      }
    },
    // 监听错误信息，动态修改优惠券容器高度
    errorMsg(e) {
      if (e) {
        this.$nextTick(() => {
          const errorMsgHeight = this.$refs.errorMsg ? this.$refs.errorMsg.clientHeight + 5 : 0
          this.couponBoxHeihgt = `calc(100vh - ${231 + errorMsgHeight}px)`
        })
      } else if (this.status === 'available') {
        this.couponBoxHeihgt = 'calc(100vh - 231px)'
      } else if (this.status === 'unavailable') {
        this.couponBoxHeihgt = 'calc(100vh - 141px)'
      }
    },
    // 如果refresh有更新，重新查询可用券列表
    refresh() {
      this.queryCoupons()
    },
    // 因接口操作有时间差，如果页面操作过快，会出现checkout取消券，本组件券没有被取消对状况，所以监听couponInfo变化
    couponInfo() {
      if (this.couponSelectVisible) {
        this.handleShowInitCoupon()
      }
    },
    init: {
      handler(val) {
        if (val) {
          this.handleCouponChoose({}, false)
          this.handleListState(this.couponCode, false)
          this.handleReset()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.show = this.couponSelectVisible
    // 购物车页面会触发refresh更新，所以这里不需要
    if (this.$route.name !== 'cart') {
      this.queryCoupons()
    }
  },
  methods: {
    // 处理组件显示时，输入内容状态展示
    handleShowInitCoupon() {
      if (this.couponInfo.code) {
        this.handleListState(this.couponInfo.code, true)
        this.hasSelectedItem = this.availableList.find((ele) => {
          return ele.couponCode === this.couponInfo.code
        })
        this.couponCode = this.couponInfo.code
        // 如果没有选中项，couponValue的值为bonusDisplay
        if (!this.hasSelectedItem) {
          this.couponValue = this.jsKey == 'cart' ? this.summaryInfo.activityOrderBonusDisplay : this.checkoutSummary.bonusDisplay
        }
      } else {
        // 清空输入内容，并将所有的券置为未选中
        this.handleListState('', false)
        this.handleReset()
      }
      this.errorMsg = ''
    },
    handleClose() {
      this.show = false
    },
    // 查询可用券列表
    queryCoupons() {
      this.loading = true
      const params = {
        ...this.resParams
      }

      // 获取本地缓存的券活动绑定邮箱
      const unLoginEmail = this.$cookie.getCookie('UnLoginEmail')
      if (unLoginEmail) {
        if (this.isLogin) {
          this.$cookie.removeCookie('UnLoginEmail')
        } else if (!params.guest_email) {
          // 如果用户没有填写游客邮箱并且有本地邮箱缓存，将guest_email设为缓存邮箱
          params.guest_email = unLoginEmail
        }
      }

      this.$axios
        .$get(`/1.0/address/myCoupon`, { params })
        .then((res) => {
          this.loading = false
          if (res.code === 0 && res.data) {
            const data = res.data
            this.availableList = data.availableList // 可用券
            this.notAvailableList = data.notAvailableList // 不可用券
            this.tabs.forEach((ele) => {
              if (ele.key === 'available') {
                ele.count = data.availableList.length
              } else if (ele.key === 'unavailable') {
                ele.count = data.notAvailableList.length
              }
            })
            this.$store.commit('checkout/setMaxDiscountCouponCode', data.maxDiscountCouponCode) // 最大coupon
            // let hasCoupons = false
            // if (data.availableList.length > 0 || data.notAvailableList.length > 0) {
            //   hasCoupons = true
            // }
            // 根据接口返回的是否展示券提示赋值
            this.$store.commit('checkout/setHasCoupons', data.showMyCouponTip)
            // 如果有已确认券信息，回显确认列表券内容
            if (this.couponInfo.code) {
              const tempObj = {
                couponCode: this.couponInfo.code,
                selected: true
              }
              this.handleCouponChoose(tempObj, true)
            }
          } else {
            console.log('Error: ', res.msg)
          }
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
        .finally(() => {
          this.$store.commit('checkout/setCouponCodeTipsShow', true) // 已经请求了mycoupon的接口就设置为true
        })
    },
    // 切换卡点击切换操作
    handleTabsChange(e) {
      this.status = e
    },
    // 处理优惠券列表数据选中状态
    handleListState(couponCode, selected) {
      for (let i = 0; i < this.availableList.length; i++) {
        const ele = this.availableList[i]
        // 如果券码相同，券列表该券置为选中
        if (ele.couponCode === couponCode) {
          ele.selected = selected
          if (selected) {
            this.couponValue = ele.bonusAmount // 券金额
            this.hasSelectedItem = true // 列表中有选中项
          }
        } else {
          ele.selected = false
        }
      }
    },
    // 点击apply或revome
    clickInputBtn(e) {
      if (e === 'apply') {
        if (this.couponCode) {
          if (this.jsKey == 'cart') {
            this.$emit('setCheckoutAmount', {
              params: { couponCode: this.couponCode, isFromApply: true },
              then: (couponError) => {
                // 优惠券操作错误提示
                if (couponError && couponError.msg) {
                  this.errorMsg = couponError.msg
                } else {
                  this.errorMsg = ''
                }
                this.handleListState(this.couponCode, true)
              },
              finally: () => {}
            })
          } else {
            const params = {
              ...this.resParams,
              coupon_code: this.couponCode
            }

            // 获取本地缓存的券活动绑定邮箱
            const unLoginEmail = this.$cookie.getCookie('UnLoginEmail')
            if (unLoginEmail) {
              if (this.isLogin) {
                this.$cookie.removeCookie('UnLoginEmail')
              } else if (!params.guest_email) {
                // 如果用户没有填写游客邮箱并且有本地邮箱缓存，将guest_email设为缓存邮箱
                params.guest_email = unLoginEmail
              }
            }
            if (this.paymentId) params.selected_payment_id = this.paymentId
            this.$axios.$get('/1.0/address/validate', { params }).then((res) => {
              if (res.data && res.data.errors && res.data.errors.couponError) {
                this.errorMsg = res.data.errors.couponError.msg // 优惠券操作错误提示
              } else {
                this.errorMsg = ''
              }
              this.handleListState(this.couponCode, true)
              // 传入validateResultObj数据，触发父组件中的getCheckoutAmount中的数据处理操作，避免在这里进行代码重复操作
              if (res.code == 0) {
                this.$emit('onFinish', { validateResultObj: res, isFromApply: true })
              }
            })
          }
        }
      } else if (e === 'remove') {
        // 清空输入内容，并将所有的券置为未选中
        this.handleListState('', false)
        this.handleReset()
        // 清空couponInfo信息
        this.$store.commit('checkout/setCouponInfo', {})
        if (this.jsKey == 'cart') {
          this.$emit('setCheckoutAmount', { params: { couponCode: '' } })
        } else {
          this.$cookie.removeCookie('applyCouponCode')
          this.$emit('onFinish', {})
        }
      }
    },
    // 优惠券选择操作结果
    handleCouponChoose(e, isInit) {
      if (!isInit) {
        this.$store.commit('checkout/setSelectCouponCode', true)
      }
      this.handleListState(e.couponCode, e.selected)
      if (e.selected) {
        this.couponCode = e.couponCode
        localStorage.setItem('sodCouponCode', e.couponCode)
        if (!isInit) {
          this.clickInputBtn('apply')
        }
      } else {
        if (this.couponCode === this.couponInfo.code) {
          // 清空couponInfo信息
          this.$store.commit('checkout/setCouponInfo', {})
          if (this.jsKey == 'cart') {
            this.$emit('setCheckoutAmount', { params: { couponCode: '' } })
          } else {
            this.$emit('onFinish', {})
          }
        }
        this.handleReset()
      }
    },
    // 重置数据
    handleReset() {
      this.couponCode = ''
      this.couponValue = ''
      this.hasSelectedItem = false // 列表中没有有选中项
    },
    // 点击continue，将选中的couponCode传给父组件
    handleContinue() {
      this.handleClose()
    }
  }
}
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.rightin-enter-active,
.rightin-leave-active {
  transition: 0.3s;
  transform: translateX(0px);
}

.rightin-enter,
.rightin-leave-to {
  transform: translateX(425px);
}
.coupon-select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: @popuy-z-index;
  &-main {
    position: absolute;
    top: 0;
    right: 0;
    width: 425px;
    height: 100%;
    background: #fff;
    overflow: hidden;
  }
  &-header {
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 50px;
    text-transform: uppercase;
    text-align: center;
    box-shadow: inset 0px -1px 0px var(--color-cccccc);
    .close {
      padding: 7px;
      position: absolute;
      right: 20px;
      top: 10px;
      width: 16px;
      cursor: pointer;
      .az-icon {
        font-size: 16px;
        display: block;
      }
    }
  }
  .remind {
    height: 30px;
    padding: 0px 15px;
    font-size: 12px;
    line-height: 30px;
    background: #fbf1e2;
    font-family: @font-family-500;
  }
  &-body {
    padding: 15px 25px;
    .input {
      display: flex;
      align-items: center;
      justify-content: center;
      &-box {
        margin-bottom: 15px;
        .error-msg {
          font-size: 12px;
          line-height: 14px;
          margin-top: 5px;
          color: red;
        }
      }
      input {
        flex: 1;
        height: 45px;
        border: 1px solid var(--color-cccccc);
        border-right: none;
        font-size: 13px;
        padding: 0 15px;
        font-family: @font-family-500;
        outline: none;
        box-sizing: border-box;
        &:focus {
          background: none;
        }
      }
      button {
        height: 45px;
        min-width: 80px;
        padding: 0px 10px;
        font-size: 14px;
        font-family: @font-family-600;
        text-transform: uppercase;
        border: none;
        outline: none;
        &.apply {
          background: @theme-color;
          color: #fff;
        }
        &.remove {
          background: #fff;
          border: 1px solid #ccc;
          color: var(--color-121212);
        }
        &:active {
          opacity: 0.8;
        }
      }
    }
    .coupon-item-box {
      height: calc(100vh - 231px);
      overflow: auto;
      &-unavailable {
        height: calc(100vh - 141px);
        .coupon-it {
          margin-bottom: 15px;
        }
        /deep/ .coupon-item {
          margin-bottom: 5px;
        }
      }
      &.choose-result-show {
        /deep/ .coupon-item:last-of-type {
          margin-bottom: 106px;
        }
      }
      .unavailable-tip {
        font-size: 12px;
        line-height: 16px;
        font-family: @font-family-500;
        display: flex;
        align-items: center;
        margin-top: 5px;
        .az-icon {
          margin-right: 5px;
        }
      }
    }
    /deep/ .coupon-item {
      margin-bottom: 15px;
    }
    .choose-result {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.1);
      padding: 15px 25px 25px;
      z-index: 1;
      &-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #999;
        font-family: @font-family-500;
        div {
          color: var(--color-121212);
          font-size: 14px;
          font-family: @font-family-600;
          span {
            color: @theme-color;
          }
        }
      }
      .az-button {
        height: 45px;
        line-height: 45px;
        margin-top: 15px;
        font-size: 14px;
        text-transform: uppercase;
        font-family: @font-family-600;
        text-align: center;
        background: @theme-color!important;
      }
    }
  }
}
</style>
