<template>
  <!-- 校园大使个人页面折线图 -->
  <div class="line-chart">
    <div :id="chartId" class="line-chart-container">
      <div v-for="(item, key) in dict" :key="key" :data-x="item.x" class="chart-module">
        <span :style="{ height: item.height }" class="chart-bar"
          ><s
            :title="item.y"
            :class="{ 'hover-x': hoverValue === item.x }"
            @mouseenter="hoverValue = item.x"
            @mouseleave="hoverValue = null"
          >
            <em class="chart-circle"></em></s
        ></span>
        <div v-if="hoverValue === item.x" class="hover-bar">
          <p class="hover-bar-value">{{ chartId === 'paid_chart' ? '$' : '' }}{{ item.y }}</p>
          <p class="hover-bar-line"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    chartId: {
      type: String,
      default: 'line_chart'
    },
    chartData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dict: [],
      hoverValue: ''
    }
  },
  mounted() {
    this.drawLineChart()
  },
  methods: {
    drawLineChart() {
      // 清除连线
      const eles = document.querySelectorAll(`#${this.chartId} s`)
      ;[].slice.call(eles).forEach((ele, index) => {
        if (ele.querySelector('i')) {
          ele.removeChild(ele.querySelector('i'))
        }
      })
      this.dict = this.chartData
      const yArr = this.dict.map((item) => {
        return item.y
      })
      const maxY = Math.max.apply(Math, yArr) // 最大值
      const num = maxY / 100
      this.dict.forEach((v, i) => {
        this.$set(this.dict[i], 'height', num === 0 || v.y / num < 6 ? '6%' : v.y / num + '%')
      })
      this.$nextTick(() => {
        const eleDots = document.querySelectorAll(`#${this.chartId} s`)
        ;[].slice.call(eleDots).forEach((ele, index) => {
          const eleNext = eleDots[index + 1]
          if (!eleNext) {
            return
          }
          let eleLine = ele.querySelector('i')
          if (!eleLine) {
            eleLine = document.createElement('i')
            eleLine.setAttribute('line', '')
            ele.appendChild(eleLine)
          }
          // 记录坐标
          const boundThis = ele.getBoundingClientRect()
          const boundNext = eleNext.getBoundingClientRect()
          // 计算长度和旋转角度
          const x1 = boundThis.left
          const y1 = boundThis.top
          const x2 = boundNext.left
          const y2 = boundNext.top
          // 连线
          const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
          const radius = 'rotate(' + (180 / Math.PI) * Math.atan((y2 - y1) / (x2 - x1)) + 'deg)'
          // 设置线条样式
          eleLine.style.width = distance + 'px'
          eleLine.style.transform = radius
        })
      })
    }
  }
}
</script>
<style lang="less">
.line-chart {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 30px;
  padding-top: 50px;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #fff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #ccc;
  }
  &-container {
    display: flex;
    padding-top: 20px;
    height: 145px;
    width: max-content;
    min-width: 100%;
    font-size: 0;
    border-top: 1px dashed #ffdbde;
    border-bottom: 1px solid #ccc;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 54px;
      left: 0px;
      height: 1px;
      width: 100%;
      border-top: 1px dashed #ffdbde;
    }
    &::after {
      content: '';
      position: absolute;
      top: 108px;
      left: 0px;
      height: 1px;
      width: 100%;
      border-top: 1px dashed #ffdbde;
    }
  }
  .chart-module {
    width: 80px;
    min-width: 80px;
    height: 100%;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      margin-left: -1px;
      width: 2px;
      height: 5px;
      background: #ccc;
    }
    &::after {
      content: attr(data-x);
      position: absolute;
      bottom: -24px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 12px;
      color: gray;
    }
  }
  .chart-module + .chart-module {
    margin-left: 16px;
  }
  .chart-bar {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    & > s {
      position: absolute;
      width: 6px;
      height: 6px;
      border: 1px solid var(--color-1e1e1e);
      border-radius: 50%;
      left: 0;
      right: 0;
      margin: auto;
      cursor: pointer;
      .chart-circle {
        position: absolute;
        width: 6px;
        height: 6px;
        border: 1px solid var(--color-1e1e1e);
        background: #fff;
        border-radius: 50%;
        left: -1px;
        top: -1px;
        right: 0;
        z-index: 4;
        margin: auto;
      }
      &.hover-x {
        .chart-circle {
          background: var(--color-1e1e1e);
        }
      }
    }
  }
  .chart-bar i[line] {
    position: absolute;
    box-sizing: border-box;
    height: 2px;
    background-color: var(--color-1e1e1e);
    transform-origin: left center;
    left: 50%;
    top: 50%;
    margin-top: -1px;
    -ms-pointer-events: none;
    pointer-events: none;
    z-index: 1;
    border-left: 3px solid #fff;
    border-right: 3px solid #fff;
  }
  .hover-bar {
    position: absolute;
    z-index: 2;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    &-value {
      position: relative;
      border-radius: 6px;
      font-family: @font-family-600;
      font-size: 20px;
      text-align: center;
      min-width: 56px;
      padding: 0 4px;
      height: 39px;
      line-height: 39px;
      color: #ffffff;
      background: linear-gradient(180deg, var(--color-1e1e1e) -15.38%, #ffb6be 100%);
      &::after {
        position: absolute;
        bottom: -5px;
        left: 50%;
        margin-left: -5px;
        content: '';
        display: inline-block;
        z-index: 2;
        width: 10px;
        height: 10px;
        background: linear-gradient(180deg, #f9aab3 -15.38%, #ffb6be 100%);
        transform: rotate(45deg);
      }
    }
    &-line {
      position: relative;
      width: 26px;
      height: 158px;
      margin: auto;
      background: linear-gradient(180deg, #ffd6db 0%, rgba(255, 235, 238, 0.2) 100%);
      &::after {
        content: '';
        position: absolute;
        opacity: 0.6;
        height: 158px;
        left: 50%;
        margin-left: -0.5px;
        border-left: 1px dashed var(--color-1e1e1e);
      }
    }
  }
}
</style>
