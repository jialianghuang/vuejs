<template>
  <div class="flash-sale-countdown">
    <div id="time-d" v-if="day && day != '0' && day != '00'" class="time time-d">
      <div class="txt-box"><span class="txt">D</span></div>
      <div class="time-box">
        <span id="time-d-1" class="bg">{{ day[0] }}</span>
        <span id="time-d-2" class="bg">{{ day[1] }}</span>
      </div>
    </div>
    <div id="time-h" class="time time-h">
      <div class="txt-box"><span class="txt">H</span></div>
      <div class="time-box">
        <span id="time-h-1" class="bg">{{ hour[0] }}</span>
        <span id="time-h-2" class="bg">{{ hour[1] }}</span>
      </div>
    </div>
    <div class="time-point"></div>
    <div id="time-m" class="time time-m">
      <div class="txt-box"><span class="txt">M</span></div>
      <div class="time-box">
        <span id="time-m-1" class="bg">{{ minute[0] }}</span>
        <span id="time-m-2" class="bg">{{ minute[1] }}</span>
      </div>
    </div>
    <div class="time-point"></div>
    <div id="time-s" class="time time-s">
      <div class="txt-box"><span class="txt">S</span></div>
      <div class="time-box">
        <span id="time-s-1" class="bg">{{ second[0] }}</span>
        <span id="time-s-2" class="bg">{{ second[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FlashSaleCountdown',
  props: {
    isGoodsItem: {
      // 是否是商品列表的倒计时
      type: Boolean,
      default: false
    },
    isFlashSaleList: {
      // 是否是flash sale 列表的倒计时
      type: Boolean,
      default: false
    },
    startTime: {
      // 开始时间
      type: String,
      default() {
        return ''
      }
    },
    endTime: {
      // 结束时间
      type: String,
      default() {
        return ''
      }
    },
    showCountDownStatus: {
      // 显示倒计时的状态 start 开始倒计时 end 结束倒计时
      type: String,
      default() {
        return 'end'
      }
    }
  },
  data() {
    return {
      remainTime: '', // 时间差
      //   countDownTime: '', // 倒计时
      day: this.addZero('0'),
      hour: this.addZero('0'),
      minute: this.addZero('0'),
      second: this.addZero('0')
    }
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {
    this.remainTime = this.diffTime()
    // this.countDownTime = this.timeFormat()
    if (this.remainTime > 0) {
      this.timeFormat()
      setInterval(() => {
        if (this.remainTime > 0) {
          this.remainTime--
          //   this.countDownTime = this.timeFormat()
          this.timeFormat()
        }
      }, 1000)
    }
  },
  methods: {
    diffTime() {
      const startTime = new Date(this.startTime.replace(/-/g, '/')).getTime()
      const serverTime = new Date(this.serverTime.replace(/-/g, '/')).getTime()
      const endTime = new Date(this.endTime.replace(/-/g, '/')).getTime()

      if (this.showCountDownStatus == 'start' && startTime > serverTime) {
        return Math.floor((startTime - serverTime) / 1000)
      } else if (this.showCountDownStatus == 'end' && endTime > serverTime) {
        return Math.floor((endTime - serverTime) / 1000)
      }
      return 0
    },
    addZero(val) {
      return val < 10 ? `0${val}` : `${val}`
    },
    timeFormat() {
      const oneDayTime = 24 * 60 * 60
      const oneHourTime = 60 * 60
      const day = Math.floor(this.remainTime / oneDayTime)
      const dayRemainTime = this.remainTime % oneDayTime
      const hour = Math.floor(dayRemainTime / oneHourTime)
      const hourRemainTime = dayRemainTime % oneHourTime
      const minute = Math.floor(hourRemainTime / 60)
      const second = hourRemainTime % 60
      if (this.isFlashSaleList) {
        this.day = this.addZero(day)
      } else if (day) {
        this.day = day
      }
      this.hour = this.addZero(hour)
      this.minute = this.addZero(minute)
      this.second = this.addZero(second)
      this.$emit('setDay', this.day)
      //   if (day) {
      //     return `${day} Days ${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(second)}`
      //   } else {
      //     return `${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(second)}`
      //   }
    }
  }
}
</script>

<style lang="less" scoped>
.flash-sale-countdown {
  display: inline-flex;
  justify-content: center;
  .time {
    &.time-d {
      margin-right: 10px;
    }
    text-align: center;
    .txt-box {
      line-height: 16px;
    }
    .txt {
      font-size: 12px;
      color: var(---color-121212);
      display: inline-block;
    }
    .time-box {
      margin-top: 2px;
      font-size: 0;
    }
    .bg {
      display: inline-block;
      width: 17px;
      height: 28px;
      background: url(~assets/images/time-bg.png) center center no-repeat;
      background-size: 100% 100%;
      color: #fff;
      font-size: 16px;
      line-height: 28px;
      &:first-child {
        margin-right: 3px;
      }
    }
  }
  .time-point {
    position: relative;
    margin: 0 4px;
    width: 2px;
    &::before {
      content: '';
      display: inline-block;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background: #383838;
      position: absolute;
      top: 29px;
    }
    &::after {
      content: '';
      display: inline-block;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background: #383838;
      position: absolute;
      top: 37px;
    }
  }
}
</style>
