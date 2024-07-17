<template>
  <div :style="{ height: orderStatusProgressH }" class="order-status-progress">
    <div class="bar">
      <div class="bar-over">
        <div
          :style="{ height: barProgressWidth(orderProgress < progressList.length - 1 ? orderProgress + 1 : orderProgress) }"
          class="bar-float"
        ></div>
      </div>
      <div v-for="(item, index) in progressList" :key="`progress_${index}`" :style="{ top: barProgressWidth(index) }" class="progress-msg">
        <az-icon v-if="orderProgress >= index" class="progress-msg-circle" icon-class="iconstatus-ok"></az-icon>
        <az-icon v-else class="progress-msg-circle undo" icon-class="iconstatus-undo"></az-icon>
        <az-icon v-if="orderProgress + 1 == index" class="progress-msg-circle next" icon-class="iconstatus-next"></az-icon>
      </div>
      <template v-for="(item, index) in progressList">
        <div
          :key="`progress_title_${index}`"
          :style="{ top: barProgressWidth(index) }"
          :class="{ active: orderProgress >= index }"
          class="progress-message"
        >
          <div class="title">{{ item.title }}</div>
          <div v-if="orderProgress >= index" class="desc">{{ item.processTime }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderStatusProgress',
  components: {},
  props: {
    returnApplyInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    returnApplyProcess: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    progressList() {
      return this.returnApplyProcess || []
    },
    orderProgress() {
      // 进度条进度，从 0 开始
      let orderProgress = 0
      this.progressList.forEach((item, index) => {
        if (this.returnApplyInfo.applyStatus == item.processStatus) {
          orderProgress = index
        }
      })
      return orderProgress
    },
    orderStatusProgressH() {
      // 这里动态设置总长度
      if (this.progressList && this.progressList.length) {
        return (this.progressList.length - 1) * 63 + 'px'
      }
      return '63px'
    }
  },
  created() {},
  methods: {
    barProgressWidth(index = 0) {
      if (this.progressList && this.progressList.length) {
        return `${(100 / (this.progressList.length - 1)) * index}%`
      }
      return '100%'
    },
    onCopySuccess() {
      this.$emit('onCopySuccess')
    },
    onCopyError() {
      this.$emit('onCopyError')
    }
  }
}
</script>

<style lang="less" scoped>
@themcolor: var(--color-121212);
.order-status-progress {
  margin: 0 auto;
  padding: 29px 0 9px 9px;
}
.bar {
  position: relative;
  text-align: center;
  height: 100%;
  .progress-msg {
    position: absolute;
    left: 0;
    margin-left: -8px;
    margin-top: -9px;
  }
  .progress-msg-circle {
    font-size: 18px;
    vertical-align: top;
    border-radius: 50%;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    &.next {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 14px;
      transform: translate(-50%, -50%);
    }
    &.undo {
      box-shadow: none;
    }
  }

  .progress-message {
    position: absolute;
    font-size: 12px;
    line-height: 16px;
    color: var(--color-999999);
    width: calc(100% - 20px);
    font-family: @font-family-600;
    margin-top: -8px;
    left: 21px;
    display: flex;
    justify-content: space-between;
    &.active {
      .title {
        color: var(--color-121212);
      }
    }
    .title {
      .order-sn {
        color: var(--color-999999) !important;
      }
    }
    .desc {
      font-size: 12px;
      line-height: 16px;
      color: var(--color-999999);
      font-family: @font-family-500;
    }
    .copy-icon {
      fill: var(--color-999999);
      color: currentColor;
    }
  }

  .bar-over {
    width: 1px;
    position: absolute;
    background: #eee;
    height: 100%;
    .bar-float {
      position: absolute;
      display: inline-block;
      background: @themcolor;
      width: 1px;
      top: 0;
    }
  }
}
</style>
