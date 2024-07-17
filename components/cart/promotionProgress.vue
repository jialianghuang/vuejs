<template>
  <div class="az-progress">
    <div class="bar">
      <div class="bar-over">
        <div
          :style="{
            width: progressPercentLength + '%',
            backgroundImage: `url(${barFloatImg})`
          }"
          class="bar-float"
        ></div>
      </div>
      <div v-for="(item, index) in list" :key="index" :style="{ left: (item.width || 0) + '%' }" class="progress-msg">
        <span
          v-html="item.name"
          :class="{ actived: item.width <= progressPercentLength, last: index == list.length - 1, bottom: interlace && index % 2 !== 0 }"
          class="progress-msg-top-text"
        ></span>
        <span
          :key="index"
          :style="{ left: (item.width || 0) + '%' }"
          :class="{ actived: item.width <= progressPercentLength, last: index == list.length - 1 }"
          class="progress-msg-circle"
        >
          <span class="inner-circle"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PromotionProgress',
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
    interlace: {
      // 文案便签是否上下交错
      type: Boolean,
      default: false
    }
  },
  computed: {
    barFloatImg() {
      return this.isBridal
        ? 'https://cdn-1.azazie.com/upimg/userfiles/images/1/bc/36/b84a9f015d9e0431135c726ff78abc36.png'
        : 'https://cdn-1.azazie.com/upimg/userfiles/images/1/e3/76/e77752aad1a1e7b877f86c16bafbe376.png'
    }
  }
}
</script>

<style lang="less" scoped>
.az-progress {
  margin: 0 auto;
  width: 100%;
}
.bar {
  position: relative;
  height: 6px;
  position: relative;
  clear: both;
  text-align: center;
  .progress-msg {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .progress-msg-circle {
    display: inline-block;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: var(--color-cccccc);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .inner-circle {
      position: absolute;
      width: 3px;
      height: 3px;
      background: #fff;
      border-radius: 50%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &.actived {
      background: @theme-color;
    }
  }

  .bar-over {
    height: 6px;
    position: absolute;
    background: #efefef;
    top: 0px;
    width: 100%;
    border-radius: 10px;
    .bar-float {
      position: absolute;
      display: inline-block;
      height: 6px;
      left: 0;
      width: 0;
      // background: linear-gradient(135deg, var(--color-121212) 30%, var(--color-e3bda1) 0, var(--color-e3bda1) 50%, var(--color-121212) 0, var(--color-121212) 80%, var(--color-e3bda1) 0);
      background-image: url('https://cdn-1.azazie.com/upimg/userfiles/images/1/e3/76/e77752aad1a1e7b877f86c16bafbe376.png');
      background-size: auto 100%;
      border-radius: 3px;
      transition: all 1.5s;
    }
  }
}
.progress-msg-top-text {
  position: absolute;
  top: -9px;
  color: @theme-color;
  max-width: 150px;
  white-space: nowrap;
  left: 50%;
  transform: translate(-50%, -100%);
  font-size: 12px;
  line-height: 16px;
  padding: 0 5px;
  font-family: @font-family-600;
  border: 1px solid @theme-color;
  border-radius: 2px;
  min-width: 36px;
  box-sizing: border-box;
  &.last {
    right: 0;
    left: unset;
    transform: translate(0, -100%);
  }
  &.bottom {
    top: unset;
    bottom: -9px;
    transform: translate(-50%, 100%);
    &.last {
      transform: translate(0, 100%);
    }
  }
  &.actived {
    background: @theme-color !important;
    color: #fff;
  }
}
</style>
