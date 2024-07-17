<template>
  <div class="az-date-picker">
    <client-only>
      <date-picker
        v-model="eventDateInt"
        @change="eventDateChange"
        @open="$emit('open')"
        @close="$emit('close')"
        :append-to-body="false"
        :popup-style="{ top: '100%', width: '100%', zIndex: 1 }"
        :clearable="false"
        :editable="false"
        :disabled-date="disabledDate"
        :placeholder="nl('page_order_what_is_date')"
        :lang="datePickerLang"
        :format="dateFormatisplay"
        :input-attr="{ 'aria-label': 'date picker' }"
        type="date"
        class="data-picker-box"
        value-type="YYYY-MM-DD"
      ></date-picker>
    </client-only>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'
import 'vue2-datepicker/locale/sv'
export default {
  name: 'AzDatePicker',
  languageKeys: ['page_order_what_is_date'],
  components: { DatePicker },
  data() {
    return {
      eventDateInt: ''
    }
  },
  computed: {
    datePickerLang({ language }) {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = language === 'se' ? 'sv' : language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    }
  },
  methods: {
    disabledDate(current) {
      // Can not select days before today
      return current && current < this.$dayjs().startOf('day')
    },
    eventDateChange() {
      this.$emit('on-date-picker', this.eventDateInt)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.mx-icon-calendar {
  font-size: 16px !important;
}
.az-date-picker {
  .data-picker-box {
    width: 100%;
    z-index: @z-index-2;
    &.error {
      /deep/ .mx-input {
        border-color: var(--color-ff0000);
      }
    }
    /deep/ .mx-datepicker-main {
      box-sizing: border-box;
      .mx-calendar {
        width: 100%;
      }
    }
    /deep/ .mx-input {
      background-color: var(--color-ffffff);
      padding: 0 10px;
      height: 45px;
      border: none;
      border-radius: 0;
      border: 1px solid var(--color-cccccc);
      box-shadow: none;
      box-sizing: border-box;
      &:hover,
      &:focus {
        border-color: var(--color-121212);
      }
    }
    ::-webkit-input-placeholder {
      color: var(--color-999999);
      font-size: 13px;
      font-family: @font-family-500;
    }
    /deep/ .mx-datepicker-popup {
      top: calc(100% - 1px);
      margin: 0;
      .mx-table-date th {
        text-align: center;
      }
    }
  }
}
</style>
<style>
.mx-icon-calendar {
  font-size: 16px !important;
  width: 16px !important;
}
</style>
