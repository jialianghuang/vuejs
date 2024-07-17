<template>
  <div :class="{ partyTime: isPartyTime, showroomTime: isShowroomTime }" class="timer">
    <span v-if="isOrderItem" class="count-time">
      <az-icon icon-class="icon-xxy_check_estimated_delivery_dates" class="icon-time"></az-icon>
      <span v-if="day" class="flash-sale-time-day">{{ day }}d</span>
      <span class="flash-sale-time-h">{{ hour }}h</span>
      <i>:</i>
      <span>{{ minute }}m</span>
      <i>:</i>
      <span>{{ second }}s</span>
    </span>
    <span
      v-else-if="isGoodsItem || isPartyTime"
      :class="{ 'bridal-flash-sale-time': isBridal, 'bridal-flash-sale-time-b': isBridal }"
      class="flash-sale-time"
    >
      <span v-if="!isPartyTime" class="flash-sale-time-day">{{ day }}</span>
      <span v-if="!isPartyTime && day" class="flash-sale-time-day-plus">d</span>
      <span class="flash-sale-time-h">{{ hour }}</span>
      <i>:</i>
      <span>{{ minute }}</span>
      <i>:</i>
      <span>{{ second }}</span>
    </span>
    <template v-else-if="isShowroomTime">
      <div id="time-h0" class="time_r time-h">{{ hour_0 }}</div>
      <div id="time-h1" class="time_r time-h">{{ hour_1 }}</div>
      <div id="time-m0" class="time_r time-m">{{ minute_0 }}</div>
      <div id="time-m1" class="time_r time-m">{{ minute_1 }}</div>
      <div id="time-s0" class="time_r time-s">{{ second_0 }}</div>
      <div id="time-s1" class="time_r time-s">{{ second_1 }}</div>
    </template>
    <!-- cyber monday -->
    <div v-else-if="isCyberTime" class="cyber-monday-timer">
      <div v-if="day">
        <span>{{ day }}</span>
        <p>days</p>
      </div>
      <div>
        <span>{{ hour }}</span>
        <p>hours</p>
      </div>
      <div>
        <span>{{ minute }}</span>
        <p>minutes</p>
      </div>
      <div>
        <span>{{ second }}</span>
        <p>seconds</p>
      </div>
    </div>
    <template v-else>
      <div v-if="day" :class="{ width26: day.toString().length > 1 }" class="day-box time time-d">
        <div id="time-d">{{ day }}</div>
        <span class="d">d</span>
      </div>
      <!-- welcome页面 0 day也展示 -->
      <div v-else-if="isWelcomeTime" :class="{ width26: day.toString().length > 1 }" class="day-box time time-d">
        <div id="time-d">0</div>
        <span class="d">d</span>
      </div>
      <div id="time-h" class="time time-h">{{ hour }}</div>
      <div class="time-point"></div>
      <div id="time-m" class="time time-m">{{ minute }}</div>
      <div class="time-point"></div>
      <div id="time-s" class="time time-s">{{ second }}</div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AzCountDown',
  props: {
    isGoodsItem: {
      // 是否是商品列表的倒计时
      type: Boolean,
      default: false
    },
    isOrderItem: {
      // 是否是订单的倒计时
      type: Boolean,
      default: false
    },
    isPartyTime: {
      // 是否是购物车party的倒计时
      type: Boolean,
      default: false
    },
    isShowroomTime: {
      // 是否是showroom的倒计时
      type: Boolean,
      default: false
    },
    isCyberTime: {
      // 是否是cyber monday的倒计时
      type: Boolean,
      default: false
    },
    isWelcomeTime: {
      // 是否是welcome的倒计时
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
      day: '',
      hour: '',
      minute: '',
      second: '',
      hour_0: '',
      hour_1: '',
      minute_0: '',
      minute_1: '',
      second_0: '',
      second_1: ''
    }
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {
    this.initTime()
  },
  methods: {
    initTime() {
      this.remainTime = this.diffTime()
      if (this.remainTime > 0) {
        this.timeFormat()
        const countDown = setInterval(() => {
          if (this.remainTime > 0) {
            this.remainTime--
            this.timeFormat()
          }
          if (this.remainTime <= 0) {
            clearInterval(countDown)
            this.$emit('countDownEnd')
          }
        }, 1000)
      }
    },
    diffTime() {
      let startTime = ''
      if (this.isPartyTime) {
        // 购物车party开始时间为结束时间前24小时
        startTime = new Date(new Date(this.endTime.replace(/-/g, '/')).getTime() - 24 * 60 * 60 * 1000)
      } else {
        startTime = new Date(this.startTime.replace(/-/g, '/')).getTime()
      }
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
      return val < 10 ? `0${val}` : val
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
      if (day) {
        this.day = day
      }
      this.hour = this.addZero(hour)
      this.minute = this.addZero(minute)
      this.second = this.addZero(second)
      this.$emit('setDay', this.day)
      if (this.isShowroomTime) {
        this.timeFormatSplice()
      }
    },
    timeFormatSplice() {
      const hourArr = (this.hour + '').split('')
      const minuteArr = (this.minute + '').split('')
      const secondArr = (this.second + '').split('')
      this.hour_0 = hourArr[0]
      this.hour_1 = hourArr[1]
      this.minute_0 = minuteArr[0]
      this.minute_1 = minuteArr[1]
      this.second_0 = secondArr[0]
      this.second_1 = secondArr[1]
    }
  }
}
</script>

<style lang="less" scoped>
.width26 {
  width: 26px !important;
}
.timer {
  display: inline-block;
  font-size: 0;
  // margin-top: 5px;
  .time {
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    // border-radius: 3px;
    background-color: var(--color-121212);
    // border: 1px solid rgba(255, 255, 255, 0.6);
    font-family: @font-family-600;
    color: #fff;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    display: inline-block;
    position: relative;
    &.time-d {
      margin-right: 10px;
      #time-d {
        padding: 0 0 0 4px;
        text-align: left;
      }
      .d {
        position: absolute;
        font-size: 12px;
        transform: scale(0.86);
        right: 2px;
        font-family: @font-family-600;
        color: #fff;
        line-height: 13px;
        top: 0;
      }
    }
  }
  .time-point {
    position: relative;
    margin: 0 5px;
    width: 4px;
    display: inline-block;
    &:before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #383838;
      position: absolute;
      top: -12px;
    }
    &:after {
      content: '';
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #383838;
      position: absolute;
      top: -3px;
    }
  }
  .count-time {
    color: @theme;

    .icon-time {
      fill: currentColor;
      color: @theme;
      font-size: 13px;
    }
    span,
    i {
      font-size: 13px;
      font-style: normal;
    }
    .flash-sale-time-day {
      margin-left: 2px;
    }
    .flash-sale-time-h {
      margin-left: 2px;
    }
  }
  .flash-sale-time {
    text-align: left;
    display: inline-block;
    height: 22px;
    width: 106px;
    background-color: @a-color;
    margin-left: 10px;
    position: relative;
    background-image: url(~assets/images/common/rect_clock.png);
    background-size: 106px 22px;
    background-repeat: no-repeat;
    color: @theme-color;
    line-height: 1.8;
    font-size: 0;
    &.bridal-flash-sale-time {
      background-image: url(~assets/images/flash-sale-time-bridal.svg);
    }
    &.bridal-flash-sale-time-b {
      background-image: url(~assets/images/flash-sale-time-bridal-b.svg);
    }
    span,
    i {
      font-size: 13px;
      font-style: normal;
    }
    .flash-sale-time-day {
      margin-left: 21px;
    }
    .flash-sale-time-h {
      margin-left: 2px;
    }
    &:after {
      content: ' ';
      height: 0;
      width: 0;
      border: 11px solid transparent;
      border-right: 6px solid white;
      display: inline-block;
      position: absolute;
      right: 0;
    }
    &.hide {
      display: none;
    }
  }
  &.partyTime {
    margin-top: 0;
    .flash-sale-time {
      background: none;
      margin-left: 0;
      line-height: unset;
      &:after {
        display: none;
      }
    }
  }
  &.showroomTime {
    position: absolute;
    display: inline-block;
    color: #ffffff;
    font-size: 18px;
    top: 3px;
    left: 6px;
    width: 135px;
    text-align: center;
    margin-top: 0;
    .time_r {
      display: inline-block;
      margin-right: 3px;
      &:nth-child(2n + 0) {
        margin-right: 13px;
      }
    }
  }
}

.cyber-monday-timer {
  margin: auto;
  width: 100%;
  font-size: initial;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  div {
    width: 55px;
    margin: 0 10px;
    span {
      width: 100%;
      height: 55px;
      line-height: 55px;
      background: url(~assets/images/time-bg.png) center center no-repeat;
      background-size: 100% 100%;
      font-size: 32px;
      display: block;
    }
    p {
      width: 100%;
      font-size: 12px;
      margin-top: 5px;
      text-transform: uppercase;
      transform: scale(0.83);
    }
  }
}
</style>
