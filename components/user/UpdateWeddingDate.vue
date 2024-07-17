<template>
  <div class="wedding-date-box">
    <div class="wedding_date">
      <div class="wedding_date_info">
        <template v-if="hasWeddingDate">
          <span class="wedding_date_detail">{{ nl('page_register_event_date') }}</span>
          <!-- <input :value="showDate" readonly style="border:none;width: 90px" /> -->
          <span class="wedding-date-dec">{{ dateFormat(showDate) }}</span>
        </template>
        <span v-else>{{ (nl('page_common_nodate') || '').replace(/\\(?=('|"))/g, '') }}</span>
      </div>
      <div class="wedding_date_picker">
        <date-picker
          ref="picker"
          v-model="input_wedding_date"
          :append-to-body="false"
          :popup-style="{ top: '40px', zIndex: 1 }"
          :disabled-date="disabledDate"
          :clearable="false"
          :editable="false"
          :lang="datePickerLang"
          :format="dateFormatisplay"
          :input-attr="{ 'aria-label': 'date picker' }"
          type="date"
          placeholder=""
          value-type="YYYY-MM-DD"
        ></date-picker>
      </div>
      <button @click="saveDate">{{ nl('page_user_save_changes') }}</button>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import { dateFormatForWeddingDate } from '@/assets/js/utils.js'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'
export default {
  name: 'UpdateWeddingDate',
  components: {
    DatePicker
  },
  props: {
    source: {
      type: String,
      default: ''
    },
    weddingDate: {
      type: String,
      default: '0000-00-00'
    }
  },
  data() {
    return {
      input_wedding_date: null,
      regResult: '',
      currentDate: new Date(),
      input: null
    }
  },
  computed: {
    showDate() {
      // 格式化使用filters了，所以这里不需要format
      return this.input_wedding_date ? this.input_wedding_date : this.weddingDate ? this.weddingDate : this.currentDate
    },
    hasWeddingDate() {
      return this.weddingDate != '0000-00-00'
    },
    datePickerLang() {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = this.language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    }
  },
  methods: {
    disabledDate(current) {
      // Can not select days before today
      return current && current < this.$dayjs().startOf('day')
    },
    saveDate() {
      if (!this.input_wedding_date) {
        alert(this.nl('page_update_wedding_date_text'))
        return false
      }
      const wdDate = this.input_wedding_date
      const formData = new FormData()
      formData.append('wedding_date', wdDate)
      this.$axios
        .$post(`/1.0/user/wedding-date`, formData)
        .then((res) => {
          if (res.code == 0) {
            alert(res.msg)
            this.$store.commit('userInfo/setWeddingDate', this.input_wedding_date)
          } else {
            this.regResult = res.msg
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    dateFormat(date) {
      if (date) {
        return dateFormatForWeddingDate(date, this.country, this.datePickerLang)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wedding-date-box {
  .wedding_date {
    width: 367px;
    margin: 0 auto;
    text-align: left;
    .wedding_date_info {
      margin-top: 20px;
      .wedding_date_detail,
      .wedding-date-dec {
        height: 18px;
        line-height: 18px;
        padding-left: 0;
      }
      .wedding-date-dec {
        font-family: @font-family-600;
      }
    }
    .wedding_date_picker {
      padding-top: 25px;
    }
    /deep/ .mx-datepicker {
      width: 367px;
      .mx-icon-calendar {
        display: inline-block;
        right: 16px;
        font-size: 16px;
      }
      .mx-input {
        box-shadow: none;
      }
      input {
        width: 367px;
        height: 40px;
        line-height: 40px;
        border-radius: 0;
        padding-left: 15px;
      }
    }

    button {
      width: 184px;
      height: 40px;
      line-height: 40px;
      border-radius: 0;
      margin-top: 20px;
      padding: 0;
      background: var(--color-121212);
      border-color: var(--color-121212);
      font-size: 14px;
      font-family: @font-family-600;
      text-transform: uppercase;
      color: #fff;
      &:hover {
        background: var(--color-1e1e1e);
        border-color: var(--color-1e1e1e);
      }
    }
  }
}
</style>
