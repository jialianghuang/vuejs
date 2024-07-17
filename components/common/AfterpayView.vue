<template>
  <div :class="$route.name" class="afterpay">
    <span class="text">{{ afterpayTips }}</span>
    <div @click.stop.prevent="showPop" class="icon">
      <az-icon class="icon-afterpay" icon-class="icon-icon_afterpay" />
      <az-icon class="icon-i" icon-class="icon-icon_des" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AfterpayView',
  props: {
    afterpayTips: {
      type: String,
      default: ''
    }
  },
  methods: {
    showPop() {
      this.$store.commit('setAfterpayLayerShow', true)
    }
  }
}
</script>

<style lang="less" scoped>
.afterpay {
  display: block;
  margin-top: 5px;
  span {
    display: inline;
    color: #666;
    line-height: 18px;
  }
  .icon {
    display: inline-flex;
    align-items: center;
    vertical-align: text-bottom;
    height: 18px;
    cursor: pointer;
    margin-top: 5px;
    .icon-afterpay {
      width: 68px;
      height: 18px;
    }
    .icon-i {
      margin-left: 5px;
      width: 12px;
      height: 12px;
    }
  }
  &.cart {
    margin-top: 15px;
    font-size: 13px;
    line-height: 18px;
    span {
      margin-right: 2px;
    }
    .icon {
      margin-bottom: -2px;
    }
  }
  // &.checkout {
  //   .icon-i {
  //     margin-left: 0;
  //   }
  // }
}
</style>
