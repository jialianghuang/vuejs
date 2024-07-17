<template>
  <div class="az-progress">
    <div class="bar">
      <div class="bar-over">
        <div
          :style="{
            width: progressPercentLength + '%'
          }"
          class="bar-float"
        ></div>
      </div>
      <div v-for="(item, index) in list" :key="index" :style="{ left: (item.width || 0) + '%' }" class="progress-msg">
        <span
          v-html="item.name.replace(/<\/?br ?\/?>/g, ' ')"
          :class="{ actived: item.width <= progressPercentLength }"
          class="progress-msg-top-text"
        ></span>
        <span
          :key="index"
          :style="{ left: (item.width || 0) + '%' }"
          :class="{ actived: item.width <= progressPercentLength }"
          class="progress-msg-circle"
        ></span>
        <span
          v-html="item.info.replace(/<\/?br ?\/?>/g, ' ')"
          :class="{ actived: item.width <= progressPercentLength }"
          class="progress-msg-text"
        ></span>
      </div>
      <template v-for="(item, index) in list">
        <div
          :key="index"
          v-if="progressTxt"
          :style="{
            left: progressPercentLength + '%'
          }"
          class="progress-txt"
        >
          {{ progressTxt }}
        </div>
      </template>
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
    progressPercentLength: {
      type: Number,
      default: 0
    },
    progressTxt: {
      type: String,
      default: ''
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.az-progress {
  margin: 0 auto;
  width: 100%;
}
.bar {
  position: relative;
  height: 28px;
  position: relative;
  clear: both;
  text-align: center;
  .progress-msg {
    position: absolute;
    top: 4px;
    // width: 25px;
    // height: 25px;
  }
  .progress-msg-circle {
    // position: absolute;
    // top: 0;
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #f7e4e2;
    color: #fff;
    &.actived {
      background: @theme-color;
    }
  }
  span.progress-msg-circle {
    background: #f7e4e2;
    // transform: scale(0.6);
    // background: radial-gradient(var(--color-cccccc), var(--color-cccccc) 60%, transparent 60%);
  }

  .progress-txt {
    position: absolute;
    padding: 2px 6px;
    width: fit-content;
    text-align: center;
    font-family: @font-family-600;
    font-size: 13px;
    top: 26px;
    background: @theme;
    border-radius: 10px;
    color: #fff;
    transform: translateX(-50%);
    &::before {
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-top: none;
      border-right: 4px solid transparent;
      border-bottom: 4px solid @theme;
      border-left: 4px solid transparent;
      position: absolute;
      left: calc(50% - 4px);
      bottom: 21px;
    }
  }

  .bar-over {
    height: 5px;
    position: absolute;
    background: #f7e4e2;
    top: 11px;
    width: 100%;
    .bar-float {
      position: absolute;
      display: inline-block;
      height: 5px;
      left: 0;
      width: 0;
      background: linear-gradient(
        135deg,
        #121212 30%,
        var(--color-e3bda1) 0,
        var(--color-e3bda1) 50%,
        #121212 0,
        #121212 80%,
        var(--color-e3bda1) 0
      );
      background-size: 17px 17px;
      border-radius: 3px;
    }
  }
}
.progress-msg-top-text {
  position: absolute;
  top: -26px;
  color: var(--color-121212);
  max-width: 150px;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  height: 18px;
  background: linear-gradient(180deg, #fefafa 0%, #ffeef0 100%);
  border-radius: 9px;
  font-size: 12px;
  padding: 2px 4px;
  font-family: @font-family-600;
}
.progress-msg-text {
  position: absolute;
  top: 22px;
  line-height: 18px;
  color: var(--color-121212);
  max-width: 150px;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  &.actived {
    color: var(--color-121212);
  }
}
</style>
