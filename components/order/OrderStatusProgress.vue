<template>
  <div class="order-status-progress">
    <div class="bar">
      <template v-for="(item, index) in progressList">
        <div
          :key="`progress_title_${index}`"
          :style="{ left: barProgressWidth(index), width: barProgressWidth(1) }"
          :class="{ active: orderProgress >= index }"
          class="progress-title"
        >
          {{ item.statusInfo ? item.statusInfo.title : '' }}
        </div>
      </template>
      <div class="bar-over">
        <div
          :style="{ width: barProgressWidth(orderProgress < progressList.length - 1 ? orderProgress + 1 : orderProgress) }"
          class="bar-float"
        ></div>
      </div>
      <div v-for="(item, index) in progressList" :key="`progress_${index}`" :style="{ left: barProgressWidth(index) }" class="progress-msg">
        <!-- 失败的情况，这次需求不需要，svg如下 -->
        <!-- <az-icon class="progress-msg-circle" icon-class="iconstatus-wrong"></az-icon> -->
        <az-icon v-if="orderProgress >= index" class="progress-msg-circle" icon-class="iconstatus-ok"></az-icon>
        <az-icon v-else class="progress-msg-circle undo" icon-class="iconstatus-undo"></az-icon>
        <az-icon v-if="orderProgress + 1 == index" class="progress-msg-circle next" icon-class="iconstatus-next"></az-icon>
      </div>
      <template v-for="(item, index) in progressList">
        <div
          :key="`progress_desc_${index}`"
          :style="{ left: barProgressWidth(index), width: barProgressWidth(1) }"
          :class="{ active: orderProgress >= index }"
          class="progress-desc"
        >
          {{ item.time }}
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
    statusInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    progressList() {
      return this.statusInfo.progressList || []
    },
    orderProgress() {
      // 进度条进度，从 0 开始
      let orderProgress = 0
      this.progressList.forEach((item, index) => {
        if (this.statusInfo.statusCode == item.statusCode) {
          orderProgress = index
        }
      })
      return orderProgress
    }
  },
  created() {},
  methods: {
    barProgressWidth(index = 0) {
      if (this.progressList && this.progressList.length) {
        return `${(100 / (this.progressList.length - 1)) * index}%`
      }
      return '100%'
    }
  }
}
</script>

<style lang="less" scoped>
@themcolor: var(--color-121212);
.order-status-progress {
  margin: 0 auto;
  padding: 55px;
}
.bar {
  position: relative;
  text-align: center;
  .progress-msg {
    position: absolute;
    top: 0;
    margin-left: -9px;
    margin-top: -9px;
  }
  .progress-msg-circle {
    font-size: 18px;
    vertical-align: middle;
    border-radius: 50%;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    &.next {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 16px;
      transform: translate(-50%, -50%);
    }
    &.undo {
      box-shadow: none;
    }
  }

  .progress-title {
    position: absolute;
    font-size: 12px;
    line-height: 16px;
    color: var(--color-999999);
    width: max-content;
    font-family: @font-family-600;
    top: -19px;
    transform: translate(-50%, -100%);
    text-transform: capitalize;
    &.active {
      color: var(--color-121212);
    }
  }
  .progress-desc {
    position: absolute;
    font-size: 12px;
    line-height: 16px;
    color: var(--color-999999);
    width: max-content;
    font-family: @font-family-500;
    top: 19px;
    transform: translateX(-50%);
  }

  .bar-over {
    height: 1px;
    position: absolute;
    background: #eee;
    width: 100%;
    .bar-float {
      position: absolute;
      display: inline-block;
      background: @themcolor;
      height: 1px;
      left: 0;
      width: 0;
    }
  }
}
</style>
