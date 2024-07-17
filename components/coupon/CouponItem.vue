<template>
  <div :class="{ disabled: val.couponStatus !== 'available', 'is-bridal': isBridal }" @click.prevent="_handleClick" class="coupon-item">
    <div class="coupon-item-top">
      <p v-if="val.couponTitle" class="coupon-title">{{ val.couponTitle }}</p>
      <span :class="{ 'no-margin': val.couponTitle }" class="off">{{ val.couponValueTxt }}</span>
      <p v-if="isSimple">
        {{ nl('page_comp_check_in_code_name') }} <span>{{ val.couponCode }}</span>
      </p>
      <template v-else>
        <p v-if="val.couponCodeTxt" v-html="val.couponCodeTxt"></p>
        <p v-if="val.couponApplyTxt">{{ val.couponApplyTxt }}</p>
      </template>
      <p>{{ val.couponExpireTxt }}</p>
      <div v-if="val.couponStatus !== 'available' && !disabled" class="status">{{ val.couponStatusTxt }}</div>
      <div v-if="canChoose" :class="{ checked: val.selected }" class="coupon-item-check"></div>
      <p v-if="showUse && val.couponStatus === 'available'" class="use-button">{{ nl('page_ambassador_code_use') }}</p>
    </div>
    <div class="coupon-item-center"></div>
    <div :class="{ 'coupon-item-bottom-open': showDes }" class="coupon-item-bottom">
      <p ref="couponDes" v-if="isSimple" v-html="val.couponApplyTxt"></p>
      <template v-else>
        <p ref="couponDes">
          {{ val.couponConditionTxt }}
        </p>
        <az-icon v-if="showUnfold" @click.stop="showDes = !showDes" icon-class="icon-a-unfold_mycoupon"></az-icon>
      </template>
    </div>
  </div>
</template>
<script>
/**
 * 优惠券组件
 * 现主要在/user?my-coupons页面使用
 * @date 2022-11-03
 */
export default {
  name: 'CouponItem',
  languageKeys: ['page_ambassador_code_use', 'page_comp_check_in_code_name'],
  props: {
    // 数据源
    val: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否可以选择，如果true，显示check组件
    canChoose: {
      type: Boolean,
      default: false
    },
    // 是否不可用
    disabled: {
      type: Boolean,
      default: false
    },
    // 显示use按钮
    showUse: {
      type: Boolean,
      default: false
    },
    parent: {
      type: String,
      default: 'coupon'
    },
    // 是否是简约版coupon列表
    isSimple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showUnfold: false, // 是否显示展开图标，默认不展示，内容文本超出一行时展示
      showDes: false // 是否展开描述
    }
  },
  mounted() {
    // 当文本宽度大于可视宽度时，展示图标，否则不展示
    const clientWidth = this.$refs.couponDes.clientWidth
    const scrollWidth = this.$refs.couponDes.scrollWidth
    if (scrollWidth > clientWidth) {
      this.showUnfold = true
    } else {
      this.showUnfold = false
    }
  },
  methods: {
    // 点击可用优惠券，如果允许选择，执行选择操作，否则，根据target进行跳转
    _handleClick() {
      this.buryPoint(this, 'event', {
        ec: this.parent === 'reference' ? 'my reference' : 'mycoupon',
        el: this.parent === 'reference' ? 'code' : 'choosecoupon',
        ea: 'click'
      })
      if (this.val.couponStatus === 'available' && !this.disabled) {
        if (this.canChoose) {
          const res = {
            ...this.val,
            selected: !this.val.selected
          }
          this.$emit('onChoose', res)
        } else if (this.val.target) {
          location.href = this.val.target
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@dotWidth: 7.5px;
@color: @theme-color;
@disabledColor: var(--color-cccccc);
.coupon-item {
  overflow: hidden;
  width: 100%;
  max-width: 425px;
  min-height: 100px;
  position: relative;
  cursor: pointer;
  .sectionCommon {
    overflow: hidden;
    background: #fff6f8;
    border: 1px solid @color;
    position: relative;
  }
  &-top {
    min-height: 103.5px;
    .sectionCommon();
    border-top: 4px solid @color;
    border-bottom: none;
    color: @color;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.02em;
    font-family: @font-family-500;
    padding: 0 15px;
    .coupon-title {
      margin-top: 10px;
    }
    .off {
      font-size: 24px;
      line-height: 33px;
      text-transform: uppercase;
      font-family: @font-family-700;
      display: block;
      margin-top: 10px;
    }
    .no-margin {
      margin-top: 0;
    }
    .use-button {
      position: absolute;
      top: 50%;
      margin-top: -16px;
      right: 15px;
      width: 70px;
      height: 32px;
      color: #fff;
      line-height: 32px;
      font-size: 12px;
      text-align: center;
      background: @theme-color;
    }
    > p {
      margin-top: 2px;
    }
    .status-img {
      width: 60px;
      height: 60px;
      position: absolute;
      right: -9px;
      top: -9px;
    }
    .status {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      position: absolute;
      right: -9px;
      top: -14px;
      border: 3.5px double @disabledColor;
      font-size: 12px;
      line-height: 12px;
      font-family: @font-family-600;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(-26deg);
      letter-spacing: -0.06em;
      word-break: break-all;
      text-align: center;
      padding: 2px;
    }
  }
  &-center {
    height: 17px;
    width: 100%;
    background: url('https://cdn-1.azazie.com/upimg/userfiles/images/1/a2/a4/68d93d6647520689f955d19c804ca2a4.png') no-repeat center;
    background-size: 100% 100%;
    position: relative;
    &::before {
      content: '';
      width: calc(100% - 26px);
      height: 0px;
      border-bottom: 1px dashed #ccc;
      position: absolute;
      left: 50%;
      top: 8px;
      transform: translateX(-50%);
      z-index: 1;
    }
  }
  &-bottom {
    font-size: 10px;
    line-height: 16px;
    color: #999;
    padding: 1.5px 15px 10px;
    .sectionCommon();
    border-top: none;
    > p {
      width: 91%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .az-icon {
      position: absolute;
      top: 0.5px;
      right: 15px;
      font-size: 16px;
      fill: #ccc;
      transition: 0.3s;
      cursor: pointer;
    }
    &-open {
      > p {
        white-space: normal;
        word-break: break-word;
      }
      .az-icon {
        transform: rotate(180deg);
      }
    }
  }
  &-check {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid var(--color-cccccc);
    width: 16px;
    height: 16px;
    position: absolute;
    right: 15px;
    top: 51px;
    border-radius: 50%;
    &.checked {
      &::before {
        content: '';
        width: 12px;
        height: 12px;
        background: @theme-color;
        border-radius: 50%;
        position: absolute;
        top: 2px;
        left: 2px;
      }
    }
  }
  &.disabled {
    cursor: default;
    .coupon-item-top,
    .coupon-item-bottom {
      color: @disabledColor;
      background: var(--color-f9f9f9);
      border-color: @disabledColor;
      &::before,
      &::after {
        border-color: @disabledColor;
      }
    }
    .coupon-item-center {
      background: url('https://cdn-1.azazie.com/upimg/userfiles/cartoon/b8/de/0a07a3168935e2c102fb8ac470f8b8de.png') no-repeat center;
      background-size: 100% 100%;
    }
    .coupon-item-check {
      background: rgba(238, 238, 238, 0.6);
    }
  }
  &.is-bridal {
    .coupon-item-center {
      background: url('https://cdn-1.azazie.com/upimg/userfiles/images/1/1b/8a/95343acbfaea6c238b4d189488171b8a.png') no-repeat center;
      background-size: 100% 100%;
    }
    .coupon-item-top,
    .coupon-item-bottom {
      background: @btn-light-hover-color;
    }
  }
}
</style>
