<template>
  <div
    v-track.view.click="getBiParams()"
    :class="{ cursor: progress < 0 && scene === 'cart' }"
    @click="clickAdd('free-ship')"
    class="free-ship-progress"
  >
    <div class="free-ship-progress-info">
      <span
        v-html="
          progress >= 0
            ? nl('page_cart_progress_free_shipping')
            : nl('page_cart_progress_free_shipping_away', null, { amount: progressData.freeShippingDifferenceDisplay })
        "
        class="free-ship-progress-info-des"
      ></span>
      <span v-if="progress < 0 && scene === 'cart'" class="add-btn">
        <a role="button" href="javascript:;">{{ nl('page_common_add') }}</a>
        >
      </span>
    </div>
    <div class="free-ship-progress-main">
      <div ref="progressBar" :style="{ left: progressLeft + '%' }" class="free-ship-progress-bar"></div>
    </div>
    <div v-if="progressData.freeShippingFeeStartingDisplay && progressData.freeShippingFeeThresholdDisplay" class="free-ship-progress-num">
      <span class="start-num">{{ progressData.freeShippingFeeStartingDisplay }}</span>
      <span class="end-num">{{ progressData.freeShippingFeeThresholdDisplay }}</span>
    </div>
  </div>
</template>
<script>
/**
 * 购物车免运费活动进度展示功能组件
 * 主要用在加购后弹框，右上角购物车浮窗，购物车页面
 */
export default {
  languageKeys: ['page_cart_progress_free_shipping', 'page_cart_progress_free_shipping_away', 'page_common_add'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 进度相关数据
    progressData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 组件使用场景
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      progressLeft: -100 // 进度条左移量
    }
  },
  computed: {
    // 当前进度条的进度，占比-100，就是左偏移量，左偏移0为进度100%展示
    progress() {
      if (this.progressData.freeShippingFeeThreshold) {
        const res = (this.progressData.goodsFreeShippingAmount / this.progressData.freeShippingFeeThreshold) * 100 - 100
        return res >= 0 ? 0 : res
      } else {
        return 0
      }
    }
  },
  watch: {
    visible(e) {
      if (e) {
        this.handleProgressLeft(this.progress)
      } else {
        this.handleProgressLeft(-100)
      }
    },
    progress(n, o) {
      this.handleProgressLeft(n)
    }
  },
  mounted() {
    this.handleProgressLeft(this.progress)
  },
  methods: {
    getBiParams() {
      if (this.progress < 0 && this.scene === 'cart') {
        return {
          common: { ec: 'shopping_bag', el: 'addon' }
        }
      }
    },
    handleProgressLeft(e) {
      const progressBar = this.$refs.progressBar
      if (progressBar) {
        this.$refs.progressBar.style.transition = 'left 0s linear 0s'
        // 先初始化为进度0，即bar整个左偏移100%
        this.progressLeft = -100
        const that = this
        setTimeout(() => {
          if (that.$refs.progressBar) that.$refs.progressBar.style.transition = 'left 0.3s linear 0.3s'
          that.progressLeft = e
        }, 50)
      }
    },
    clickAdd(type) {
      if (this.progress < 0 && this.scene === 'cart') {
        this.$emit('clickAdd', type)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.free-ship-progress {
  width: 100%;
  background: #fff;
  padding-bottom: 10px;
  &.cursor {
    cursor: pointer;
  }
  &-info {
    width: 100%;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
    margin-bottom: 5px;
    font-family: @font-family-500;
    color: var(--color-121212);
    &-des {
      /deep/ span {
        color: @btn-hover-color;
      }
    }
    .add-btn {
      font-family: @font-family-600;
      margin-left: 15px;
      cursor: pointer;
      a {
        color: var(--color-121212);
        text-decoration: underline;
      }
    }
  }
  &-main {
    height: 10px;
    width: 100%;
    background: var(--color-eeeeee);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  }
  &-bar {
    position: absolute;
    left: -100%;
    top: 0px;
    border-radius: 16px;
    background: @theme-color;
    height: 100%;
    width: 100%;
    transition: left 0.5s linear 0.5s;
  }
  &-num {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-121212);
    font-size: 10px;
    line-height: 14px;
    font-family: @font-family-500;
    margin-top: 5px;
  }
}
</style>
