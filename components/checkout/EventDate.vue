<template>
  <div id="event_date" class="event-date">
    <block-title :title="nl('page_order_event_date')" :event-date="true"></block-title>
    <div id="event_date_check" class="ca_style">
      <template v-if="!orderInfo.editable">
        <p>
          <span class="check_date_tip">
            {{ eventDate.selected && eventDate.date && eventDate.date != '0000-00-00' ? eventDate.date : nl('page_order_not_have_event') }}
          </span>
        </p>
      </template>
      <template v-else>
        <div :class="{ 'error_note animated animate-shake': errorNote }" class="error_note_style error-tip">
          {{ nl('page_order_please_choose_your_event_date') }}
        </div>
        <div v-if="eventDateFlag === 'have_event'" class="event_date_select_box">
          <p class="event_date_select">
            <date-picker
              v-if="mounted"
              v-model="eventDateInt"
              @change="eventDateChange"
              :append-to-body="false"
              :popup-style="{ top: '40px', zIndex: 1 }"
              :editable="false"
              :class="{ error: errorNote }"
              :disabled-date="disabledDate"
              :placeholder="nl('page_order_what_is_date')"
              :lang="datePickerLang"
              :format="dateFormatisplay2"
              :input-attr="{ 'aria-label': 'date picker' }"
              type="date"
              class="data-picker-box"
              value-type="YYYY-MM-DD"
            ></date-picker>
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BlockTitle from '@/components/checkout/BlockTitle'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'
import 'vue2-datepicker/locale/sv'
import { mapState } from 'vuex'

export default {
  name: 'EventDate',
  components: {
    BlockTitle,
    DatePicker
  },
  props: {},
  data() {
    return {
      mounted: false,
      eventDateInt: '',
      eventDateFlag: 'have_event',
      errorNote: false
    }
  },
  computed: {
    ...mapState('checkout', ['eventDate', 'checkoutError', 'orderInfo']),
    datePickerLang() {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = this.language === 'se' ? 'sv' : this.language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    },
    // 不根据语种展示日期格式
    dateFormatisplay2() {
      if (['US', 'CA'].includes(this.country)) {
        return 'YYYY/MM/DD'
      } else {
        return 'DD/MM/YYYY'
      }
    }
  },
  watch: {
    checkoutError: {
      handler(newVal) {
        if (newVal.isEventError) {
          // eventDate 验证
          this.errorNote = true
        }
      },
      immediate: true
    },
    errorNote(newVal) {
      if (!newVal) {
        // eventDate 验证
        this.$store.commit('checkout/setCheckoutError', { isEventError: false })
      }
    }
  },
  mounted() {
    // this.eventDate.selected   表示用户是否选择过 eventDate
    if (!this.eventDate.selected) {
      // 首次进入checkout页面，即没有成单的时候
      this.eventDateInt = ''
      this.eventDateFlag = 'have_event'
      // this.setPoint('eventdate', 'common', 'click')
    } else {
      // 二次进入checkout,即已经成单的时候
      this.eventDateInt = this.eventDate.date && this.eventDate.date != '0000-00-00' ? this.eventDate.date : ''
      this.eventDateFlag = this.eventDate.date && this.eventDate.date != '0000-00-00' ? 'have_event' : 'no_date'
    }
    this.mounted = true
    this.setEventData()
  },
  methods: {
    disabledDate(current) {
      // Can not select days before today
      return current && current < this.$dayjs().startOf('day')
    },
    eventDateChange(date) {
      this.errorNote && (this.errorNote = false)
      this.setEventData()
    },
    eventDateOption(val) {
      if (val == 'no_date') {
        this.setPoint('eventdate', 'none', 'click')
      }
      if (val == 'have_event') {
        this.setPoint('eventdate', 'common', 'click')
      }
      if (this.eventDateFlag === val) {
        return false
      }
      this.eventDateFlag = val
      if (val) {
        this.errorNote && (this.errorNote = false)
      }
      if (val === 'no_date') {
        // 关闭需要置空eventDate
        this.eventDateInt = ''
      }
      this.setEventData()
    },
    setEventData() {
      const eventDateObj = {
        ...this.eventDate,
        date: this.eventDateInt,
        selected: true,
        eventDateFlag: this.eventDateFlag
      }
      this.$store.commit('checkout/setEventDate', eventDateObj)
    }
  }
}
</script>

<style lang="less" scoped>
.event-date {
  .ca_style {
    margin: 22px 0 60px;
    .error_note_style {
      display: none;
      color: #f00;
      margin-bottom: 15px;
      &.error_note {
        display: block;
      }
    }
    .event_date_opt_box {
      cursor: pointer;
      display: flex;
      align-items: center;
      .event_date_icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        padding: 2px;
        border-radius: 50%;
        margin-left: 3px;
        margin-right: 10px;
        border: 1px solid #ccc;
        background-clip: content-box;
        box-sizing: border-box;
      }
      &.selected {
        cursor: default;
        .event_date_icon {
          background-color: var(--color-121212);
          cursor: default;
        }
      }
    }
    .event_date_select_box {
      margin-top: 10px;
      .event_date_select {
        display: inline-block;
        width: 365px;
        height: 40px;
        line-height: 40px;
        border-radius: 0;
        background-color: #fff;
      }
      .data-picker-box {
        width: 367px;
        height: 40px;
        /deep/ .mx-input {
          height: 40px;
          line-height: 40px;
          border-radius: 0;
          background-color: #fff;
          padding-left: 10px;
          border-color: #ccc;
          box-shadow: none;
          border: 0;
          outline: 1px solid #ccc;
          &:hover,
          &:focus {
            border-color: #ccc;
          }
        }
        /deep/ ::-webkit-input-placeholder {
          color: var(--color-999999);
          font-size: 13px;
          font-family: @font-family-500;
        }
        &.error {
          /deep/ .mx-input {
            border-color: #f00;
          }
        }
      }
    }
    .do_not_have_event_line {
      margin-top: 20px;
    }
  }
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }
  .animate-shake {
    animation-name: shake;
  }
  @keyframes shake {
    from,
    to {
      transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate3d(-6px, 0, 0);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translate3d(6px, 0, 0);
    }
  }
  /deep/ .mx-datepicker-popup {
    width: 100%;
    margin-top: 2px;
    border: 0;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    outline: 1px solid #e8e8e8;
  }
  /deep/ .mx-calendar {
    width: 100%;
    padding: 15px;
    .mx-calendar-header {
      line-height: unset;
    }
    .mx-calendar-content {
      height: unset;
      .mx-table-date {
        thead tr {
          width: 335px;
          display: flex;
          justify-content: space-around;
        }
        tbody {
          height: 211px;
          .mx-date-row .cell:hover {
            background-color: #1284e7;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
