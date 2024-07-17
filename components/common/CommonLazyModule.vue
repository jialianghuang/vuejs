<template>
  <div class="common-skeleton">
    <div :style="{ height: height + 'px' }" v-if="hasSkeletonTitle" class="common-skeleton__head"></div>
    <div :style="getBodyStyle()" class="common-skeleton__body"></div>
  </div>
</template>

<script>
export default {
  name: 'CommonLazyModule',
  props: {
    radio: {
      type: Number,
      default() {
        return 0.3
      }
    },
    height: {
      type: [Number, String],
      default: 50
    },
    hasSkeletonTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultBackgroundImg: require('~/assets/images/goodsList/img-bg.png')
    }
  },
  methods: {
    getBodyStyle() {
      return {
        paddingBottom: `calc(100% * ${this.radio})`,
        background: `url(${this.defaultBackgroundImg}) no-repeat center center/ 74px 80px, var(--color-f9f9f9)`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.common-skeleton {
  padding: 0 15px;
  box-sizing: border-box;
  background: #fff;
  &__head,
  &__body {
    background: var(--color-f9f9f9);
    box-sizing: border-box;
  }
  &__head {
    margin-bottom: 15px;
  }
  &__body {
    width: 100%;
  }
}
</style>
