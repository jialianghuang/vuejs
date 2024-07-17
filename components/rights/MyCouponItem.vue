<template>
  <div :class="{ unavailable: item.status !== 'available' }" class="my-coupons-card">
    <div class="card-top">
      <div :class="{ unavailable: item.status !== 'available' }" class="card-top-left">
        <div class="left-item">{{ item.showCouponValue }}</div>
        <div class="left-item down">{{ nl('page_comp_check_in_code_name') }}:{{ item.couponCode }}</div>
      </div>
      <div v-if="item.status === 'available'" @click="useCoupons(item.target)" class="card-top-right">
        <div v-track.view.click="{ common: { ec: 'coupons', el: 'use' } }" class="right-item">{{ nl('page_rights_use_text') }}</div>
      </div>
      <!-- 使用过 或 过期图片 -->
      <div v-else :class="{ used: item.status === 'used' }" class="card-top-right-expired"></div>
      <div class="card-line"></div>
    </div>
    <div class="card-bottom">
      <div :class="{ unavailable: item.status !== 'available' }" class="card-bottom-left">
        <div class="left-item">{{ nl('page_right_coupon_valid_until') }}&nbsp;{{ item.couponEndTime }}</div>
        <div class="left-item">
          <span>{{ nl('page_rights_for_text') }}&nbsp;{{ item.targetName }}</span>
        </div>
      </div>
      <div @click="$emit('showDetail', item.index)" class="card-bottom-right">
        <!-- icon-perks-arrow -->
        <az-icon :class="{ up: item.show }" icon-class="icon-perks-arrow" class="icon"></az-icon>
      </div>
    </div>
    <div v-show="item.show" :class="{ unavailable: item.status !== 'available' }" class="card-detail">
      {{ nl('page_rights_other_offer_options') }}:&nbsp;{{ item.couponComment }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyCouponsItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    showDetail() {
      this.show = !this.show
    },
    useCoupons(target) {
      location.href = target
    }
  }
}
</script>

<style lang="less" scoped>
.my-coupons-card {
  padding: 15px 20px;
  box-sizing: border-box;
  width: 444px;
  background: var(--color-f2e9e6);
  box-shadow: 0px 2px 4px 0px var(--color-eeeeee);
  border-top: 3px solid var(--color-121212);
  margin-bottom: 15px;
  &.unavailable {
    background: #eee;
    border-top: 3px solid #ccc;
  }
  .card-top {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    &::before {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      bottom: -40px;
      left: -24px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      // box-shadow: 0.5px 0 1px #999;
    }
    &::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      bottom: -40px;
      right: -48px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      // box-shadow: 0 0.5px 1px #999;
    }
    .card-top-left {
      color: var(--color-121212);
      .left-item {
        font-size: 24px;
        font-family: @font-family-600;
        font-weight: 600;
        line-height: 33px;
        &.down {
          font-size: 13px;
          line-height: 18px;
          text-transform: capitalize;
        }
      }
      &.unavailable {
        color: #ccc;
      }
    }
    .card-top-right {
      width: 50px;
      height: 24px;
      box-sizing: border-box;
      border: 1px solid var(--color-121212);
      // box-shadow: 1px 0px 2px var(--color-121212), 0 -1px 2px var(--color-121212), -1px 0px 2px var(--color-121212), 0px 1px 2px var(--color-121212);
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      .right-item {
        font-size: 13px;
        font-family: @font-family-600;
        font-weight: 600;
        color: var(--color-121212);
        text-transform: uppercase;
      }
    }
    .card-top-right-expired {
      position: absolute;
      top: -15px;
      right: -20px;
      width: 55px;
      height: 48px;
      background: url(~assets/images/rights/unavilable.png) no-repeat;
      background-size: 100% 100%;
      &.used {
        background: url(~assets/images/rights/used.png) no-repeat;
        background-size: 100% 100%;
      }
    }
    .card-line {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% + 20px);
      height: 1px;
      border-top: 1px dashed #fff;
    }
  }
  .card-bottom {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-top: 20px;
    box-sizing: border-box;
    // min-height: 75px;
    .card-bottom-left {
      padding-top: 20px;
      color: var(--color-666666);
      .left-item {
        height: 17px;
        font-size: 12px;
        font-family: @font-family-500;
        line-height: 17px;
        padding-bottom: 5px;
      }
      &.unavailable {
        color: #999;
      }
    }
    .card-bottom-right .icon {
      width: 18px;
      height: 18px;
      margin-top: 20px;
      &.up {
        transform: rotate(180deg);
      }
    }
  }
  .card-detail {
    // height: 34px;
    font-size: 12px;
    font-family: @font-family-500;
    color: var(--color-666666);
    line-height: 17px;
    margin-top: 5px;
    &.unavailable {
      color: #999;
    }
  }
}
</style>
