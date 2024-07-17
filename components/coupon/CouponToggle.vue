<template>
  <div
    :style="{
      backgroundColor: bgColor,
      color: textColor,
      transform: `rotate(-90deg) translate(${-(350 * scale + 13)}px)`
    }"
    class="toggle-container"
  >
    <div
      :style="{ transform: `scale(${scale < 0.15 ? scale * 5 : 1})` }"
      style="display: flex; align-items: center;justify-content: center;"
    >
      <span>{{ open ? expandText : closeText }}</span>
      <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
      <!-- <img :style="{ transform: `rotate(${open ? 180 : 0}deg)` }" :src="replaceImgCdnUrl(btnImage)" alt="img" /> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'CouponToggle',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1
    },
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: 'var(--color-121212)'
    },
    expandText: {
      type: String,
      default: ''
    },
    closeText: {
      type: String,
      default: ''
    },
    btnImage: {
      type: String,
      default: ''
    },
    ecBi: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      success: false
    }
  },
  mounted() {
    this.buryPoint(this, 'event', { ec: this.ecBi || 'coupon', el: 'sidebar', ea: 'view' })
  },
  methods: {
    startCoupon() {}
  }
}
</script>

<style lang="less" scoped>
.toggle-container {
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 0px 0px;
  box-shadow: -7px -6px 6px -1px rgba(0, 0, 0, 0.06);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;

  span {
    font: normal 14px/19px @font-family-600;
    margin-right: 10px;
  }

  img {
    width: 22px;
    height: 22px;
    object-fit: fill;
  }
  .icon-close {
    fill: #fff;
    width: 10px;
    height: 10px;
    font-size: 10px;
    transform: rotate(90deg);
  }
}
</style>
