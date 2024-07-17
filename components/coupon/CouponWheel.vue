<template>
  <div class="coupon-wheel">
    <div
      :style="{
        transitionDuration: transForm > 0 ? `${transitionDuration}s` : '0s',
        transform: transForm ? `rotate(${transForm}deg)` : null,
        width: `${width}px`,
        height: `${height}px`,
        borderWidth: `${borderWidth}px`,
        borderColor: `${couponConfig.outerEdgeColor}`
      }"
      class="coupon-container"
    >
      <div :style="{ transform: `rotate(${angle}deg)`, zIndex: zIndex }" v-if="couponList" class="wheel-container">
        <div
          v-for="(coupon, index) in couponList"
          :key="'coupon_' + index"
          :style="{
            backgroundColor: coupon.backGroundColor,
            transform: `rotate(${index * angle}deg) skewX(${angle - 90}deg)`,
            transformOrigin: `0 ${width / 2 - borderWidth}px`
          }"
          class="box"
        ></div>
      </div>

      <div :style="{ transform: `rotate(${angle / 2}deg)` }" v-if="couponList" class="titles-container">
        <div
          v-for="(coupon, index) in couponList"
          :key="'coupon_item_' + index"
          :style="{
            transform: `rotate(${index * angle}deg) `,
            color: coupon.rewardTextColor,
            font: `normal ${coupon.rewardSize}px/${coupon.rewardSize}px '@font-family-600'`,
            paddingLeft: `${offset}px`,
            letterSpacing: `${letterSpacing}px`
          }"
          class="title"
        >
          {{ coupon.rewardText }}
        </div>
      </div>
      <div :style="{ backgroundColor: couponConfig.innerCenterColor }" class="btn-center"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CouponWheelComponent',
  components: {},
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    borderWidth: {
      type: Number,
      default: 17
    },
    fontSize: {
      type: Number,
      default: 22
    },
    offset: {
      type: Number,
      default: 0
    },
    angelOffset: {
      type: Number,
      default: 0
    },
    letterSpacing: {
      type: Number,
      default: 1
    },
    zIndex: {
      type: Number,
      default: 0
    },
    couponConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      transForm: 0,
      transitionDuration: 3
    }
  },
  head() {},
  computed: {
    angle() {
      return this.couponConfig && this.couponConfig.couponList ? 360 / this.couponConfig.couponList.length : 0
    },
    couponList(reward) {
      if (!this.couponConfig || !this.couponConfig.couponList) return null
      const couponList = this.couponConfig.couponList
      return couponList
    }
  },
  methods: {
    startCoupon(reward) {
      const errMsg = ''
      if (!reward) return this.$emit('onDrawErr', errMsg)
      const { rewardCode, rewardText, linkUrl, message } = reward
      if (!rewardCode || !rewardText) return this.$emit('onDrawErr', errMsg)
      // console.log('random====>', reward)
      let lotteryCoupon = null
      for (let index = 0; index < this.couponList.length; index++) {
        const item = this.couponList[index]
        if (item.rewardText === rewardText) {
          this.transForm = 360 * 4 - (this.angle / 2 + this.angle * index) + this.angelOffset
          lotteryCoupon = item
          this.$emit('onDraw', { ...lotteryCoupon, couponCode: rewardCode, linkUrl, message })
          return
        }
      }
      this.$emit('onDrawErr', errMsg)
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-wheel {
  display: flex;
  align-items: center;
  position: relative;

  .coupon-container {
    flex: 0 0 auto;
    position: relative;
    border-style: solid;
    box-sizing: border-box;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition-property: transform;

    .wheel-container {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      flex: 0 0 auto;
      padding: 1px;

      .box {
        position: absolute;
        right: 0;
        top: 0;
        width: 50%;
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .titles-container {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: absolute;
      overflow: hidden;
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      .title {
        right: 0;
        position: absolute;
        width: 50%;
        height: 60px;
        flex: 0 0 auto;
        transform-origin: 0px 30px;
        // text-align: center;
        font: normal 22px/60px @font-family-600;
        box-sizing: border-box;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
      }
    }
    .btn-center {
      position: absolute;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
}
</style>
