<template>
  <div>
    <div class="az-progress-info">
      <az-icon icon-class="icon-common-gift" class="icon-common-gift" /> <span>{{ progressData.currentProgressDesc }}</span>
    </div>
    <div :class="{ 'multi-lan': language != 'en' }" class="az-progress">
      <div class="bar-over">
        <div ref="progressBar" :style="{ left: `calc(${progressLeft}% + 5px)` }" class="bar-float"></div>
      </div>
      <div
        v-for="(item, index) in list"
        :key="index"
        :style="{ left: index == list.length - 1 ? 'auto' : item.width + '%', right: index == list.length - 1 ? '10px' : 'auto' }"
        class="progress-msg"
      >
        <span
          v-html="item.nodeTag"
          :class="{ 'last-node': index == list.length - 1 }"
          :style="{ left: index == list.length - 1 ? 'auto' : `calc(${item.width}% + ${language != 'en' ? 10 : 5}px)` }"
          class="progress-msg-top-text"
        ></span>
        <span
          :key="index"
          :style="{ left: index == list.length - 1 ? 'auto' : item.width + '%' }"
          :class="{ actived: progressData.currentProgress >= item.nodeThreshold }"
          class="progress-msg-circle"
        >
          <i></i
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
import AzIcon from '../az-ui/AzIcon.vue'
/**
 * 样衣买2送1活动进度展示功能组件
 * 主要用在加购后弹框，右上角购物车浮窗，购物车页面
 * 该组件暂时不再使用
 */
export default {
  name: 'SampleFree',
  components: { AzIcon },
  languageKeys: ['page_cart_progress_free_shipping', 'page_cart_progress_free_shipping_away'],
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
    }
  },
  data() {
    return {
      progressLeft: -100 // 进度条左移量
    }
  },
  computed: {
    // 当前进度条的进度，占比-100，就是左偏移量，左偏移0为进度100%展示
    progress({ progressData }) {
      const res = (progressData.currentProgress / progressData.promotionThreshold) * 100 - 100
      return res >= 0 ? 0 : res
    },
    list({ progressData }) {
      const tempList = progressData.progressNodeList
      tempList.forEach((item) => {
        item.width = parseFloat(item.nodeThreshold / progressData.promotionThreshold).toFixed(2) * 100
      })
      return tempList
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
    handleProgressLeft(e) {
      const progressBar = this.$refs.progressBar
      if (progressBar) {
        this.$refs.progressBar.style.transition = 'left 0s linear 0s'
        // 先初始化为进度0，即bar整个左偏移100%
        this.progressLeft = -100
        const that = this
        setTimeout(() => {
          that.$refs.progressBar.style.transition = 'left 0.3s linear 0.3s'
          that.progressLeft = e
        }, 50)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.az-progress-info {
  width: 100%;
  font-size: 13px;
  line-height: 18px;
  display: flex;
  align-items: center;
  span {
    font-family: @font-family-600;
    flex: 1;
  }
  .icon-common-gift {
    font-size: 18px;
    margin-right: 8px;
  }
}
.az-progress {
  width: 100%;
  padding-bottom: 10px;
  position: relative;
  margin-top: 35px;
  margin-bottom: 16px;
  &.multi-lan {
    margin-top: 60px;
    .progress-msg {
      .progress-msg-top-text {
        transform: translateX(-100%);
        white-space: normal;
        height: 40px;
        width: 100px;
        top: -54px;
      }
    }
  }
  .bar-over {
    height: 6px;
    width: 100%;
    background: #efefef;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    .bar-float {
      position: absolute;
      left: -100%;
      top: 0px;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      background: linear-gradient(
        135deg,
        var(--color-121212) 30%,
        var(--color-e3bda1) 0,
        var(--color-e3bda1) 50%,
        var(--color-121212) 0,
        var(--color-121212) 80%,
        var(--color-e3bda1) 0
      );
      background-size: 17px 17px;
      height: 100%;
      width: 100%;
      transition: left 0.5s linear 0.5s;
    }
  }

  .progress-msg {
    position: absolute;
    top: 4px;
    // width: 25px;
    // height: 25px;
    .progress-msg-top-text {
      position: absolute;
      top: -30px;
      color: var(--color-121212);
      max-width: 150px;
      white-space: nowrap;
      left: 50%;
      transform: translateX(-50%);
      height: 18px;
      font-size: 12px;
      padding: 0 4px;
      font-family: @font-family-600;
      border: 1px solid var(--color-121212);
      border-radius: 2px;
      box-sizing: border-box;
      &.last-node {
        right: -11px;
        left: auto;
        transform: translateX(0);
      }
    }
    .progress-msg-circle {
      // position: absolute;
      // top: 0;
      display: inline-block;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #ccc;
      color: #fff;
      position: absolute;
      top: -6px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.actived {
        background: @theme;
      }
      i {
        width: 3px;
        height: 3px;
        background: #fff;
        border-radius: 50%;
        display: block;
      }
    }
  }
}
</style>
