<template>
  <div :style="{ width: barLength + 28 + 'px' }" class="az-progress">
    <div class="bar">
      <template v-for="(item, index) in list">
        <div
          :key="index"
          v-if="status === index && item.progressTxt"
          :style="{
            left: (barProgressWidth[index] + progressPercentLength || 0) + 14 + 'px'
          }"
          class="progress-txt"
        >
          {{ item.progressTxt }}
        </div>
      </template>
      <div :style="{ width: barLength + 'px' }" class="bar-over">
        <div
          :style="{
            width: (barProgressWidth[status] + progressPercentLength || 0) + 'px'
          }"
          class="bar-float"
        ></div>
      </div>
      <div v-for="(item, index) in list" :key="index" :style="{ left: (barProgressWidth[index] || 0) + 'px' }" class="progress-msg">
        <az-icon
          v-if="status >= index"
          :key="index"
          :class="{ actived: status >= index }"
          class="progress-msg-circle"
          icon-class="icon-ok"
        ></az-icon>
        <span v-else :key="index" :style="{ left: (barProgressWidth[index] || 0) + 'px' }" class="progress-msg-circle"></span>
        <span v-html="item.name.replace(/<\/?br ?\/?>/g, ' ')" :class="{ actived: status >= index }" class="progress-msg-text"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzProgress',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    status: {
      type: Number,
      default: -1
    }
  },
  computed: {
    barProgressWidth() {
      let count = 0
      return this.list.map((item) => (count += item.width))
    },
    barLength() {
      return this.barProgressWidth[this.barProgressWidth.length - 1]
    },
    progressPercentLength() {
      if (this.list[this.status] && this.list[this.status + 1] && this.list[this.status].progressPercent) {
        return this.list[this.status + 1].width * this.list[this.status].progressPercent * 1 * 0.01
      }
      return 0
    }
  }
}
</script>

<style lang="less" scoped>
@themcolor: var(--color-121212);
.az-progress {
  margin: 0 auto;
}
.bar {
  position: relative;
  height: 28px;
  position: relative;
  clear: both;
  text-align: center;
  .progress-msg {
    position: absolute;
    top: 0;
    // width: 25px;
    // height: 25px;
  }
  .progress-msg-circle {
    // position: absolute;
    // top: 0;
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #ccc;
    color: #fff;
    // &.actived {
    //   background: @themcolor;
    // }
  }
  span.progress-msg-circle {
    background: #ccc;
    transform: scale(0.6);
    // background: radial-gradient(#ccc, #ccc 60%, transparent 60%);
  }

  .progress-txt {
    position: absolute;
    padding: 0 16px;
    width: max-content;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-family: @font-family-600;
    font-size: 13px;
    top: -38px;
    background: var(--color-121212);
    border-radius: 2px;
    color: #fff;
    transform: translateX(-50%);
    white-space: nowrap;
    &::after {
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-top: 6px solid var(--color-121212);
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: none;
      position: absolute;
      left: calc(50% - 8px);
    }
  }

  .bar-over {
    height: 3px;
    position: absolute;
    background: #ccc;
    top: 11px;
    width: 903px;
    left: 14px;
    .bar-float {
      position: absolute;
      display: inline-block;
      background: @themcolor;
      height: 3px;
      left: 0;
      width: 0;
    }
  }
}

.progress-msg-text {
  position: absolute;
  top: 31px;
  line-height: 18px;
  color: #999;
  max-width: 150px;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  &.actived {
    color: var(--color-121212);
  }
}
</style>
