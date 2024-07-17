<template>
  <div v-track.view.click="{ common: getBiParams('form', 'popup_1') }" class="special-package">
    <h2 class="title">3 FREE swatches • 10% OFF bridal gowns • 15% OFF pre & post wedding events</h2>
    <div class="shopping-for-info">
      <span class="i-am">I'm shopping for a</span>
      <az-select
        ref="welome_event_select"
        :options="events"
        :width="250"
        :height="50"
        :paddingTopBottom="10"
        :defaultValue="event"
        @on-change="handleEventChange"
        v-track.view.click="{ common: getBiParams('dbwelcome', 'popup_event') }"
        placeholder="event"
      ></az-select
      >on
      <div :class="{ error: rulesRes.eventDate }" class="date-picker">
        <date-picker
          v-model="eventDate"
          :append-to-body="false"
          :popup-style="{ top: '50px', left: '0', zIndex: 1 }"
          :clearable="false"
          :editable="false"
          :lang="language || 'en'"
          :format="dateFormatisplay"
          :input-attr="{ 'aria-label': 'date picker' }"
          :class="{ valued: eventDate }"
          @open="showDatePick = true"
          @close="showDatePick = false"
          v-track.view.click="{ common: getBiParams('dbwelcome', 'popup_date') }"
          :open="showDatePick"
          type="date"
          placeholder="this date"
          value-type="YYYY-MM-DD"
        >
          <template v-slot:icon-calendar>
            <svg :style="showDatePick ? 'transform:rotate(180deg)' : ''" class="az-icon">
              <use xlink:href="#icon-lby_expand_arrow_down"></use>
            </svg>
          </template>
        </date-picker>
      </div>
      .
    </div>
    <div class="shopping-for-info my-email">
      <div :class="{ error: rulesRes.email }" class="input-wrap">
        <input
          id="event_email"
          v-model="eventEmail"
          @focus="handleFocus"
          @blur="onBlurEmail"
          v-track.view.click="{ common: getBiParams('dbwelcome', 'popup_email') }"
          :placeholder="'Enter Your Email Here...'"
          type="email"
        />
        <AzEmailDomain :show="emailDomainShow" :origin-email="eventEmail" @domain-handler="(value) => (eventEmail = value)" />
        <p v-if="rulesRes.email">
          {{ rulesRes.email }}
        </p>
      </div>
    </div>
    <!-- <div v-if="event === 'wedding'" v-track.view.click="{ common: getBiParams('form', 'popup_2') }" class="shopping-for-info">
      as a
      <az-select
        :options="roles"
        :width="250"
        :height="50"
        :paddingTopBottom="10"
        :defaultValue="eventRole"
        @on-change="handleRoleChange"
        placeholder="your role"
      >
      </az-select>
      and will be setting up outfits for
      <az-select
        :options="people"
        :width="250"
        :height="50"
        :paddingTopBottom="10"
        :defaultValue="eventPeople"
        @on-change="handlePeopleChange"
        placeholder="# of people"
      >
      </az-select
      >.
    </div> -->
    <az-button v-track.view.click="{ common: getBiParams('dbwelcome', 'popup_button') }" @click="clickGetStarted" class="btn btn-theme">
      {{ nl('page_common_claim_your_offers') }}
    </az-button>
    <ul class="submit-tips">
      <li>
        By entering your email, you are signing up to receive these special offers.
      </li>
      <li>
        You are also agreeing to our
        <a :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))" target="_blank">PRIVACY POLICY</a>. You may
        unsubscribe at any time <a href="/unsubscribe">HERE</a>.
      </li>
    </ul>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import AzSelect from '@/components/az-ui/AzSelect'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
import checkEmailDomain from '@/assets/js/checkEmailDomain'

export default {
  components: {
    AzButton,
    AzSelect,
    DatePicker,
    AzEmailDomain
  },
  mixins: [checkEmailDomain],
  props: {
    // 使用场景，默认空，popup：弹框场景
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showDatePick: false, // 日期选择面板是否展示
      events: [
        {
          name: 'wedding',
          key: 'wedding'
        },
        {
          name: 'special event',
          key: 'special_event'
        }
      ],
      roles: [
        {
          name: 'bridesmaid',
          key: 'bridesmaid'
        },
        {
          name: 'bride',
          key: 'bride'
        },
        {
          name: 'mom',
          key: 'mom'
        },
        {
          name: 'guest',
          key: 'guest'
        },
        {
          name: 'groomsmen',
          key: 'groomsmen'
        },
        {
          name: 'groom',
          key: 'groom'
        }
      ],
      people: [
        {
          name: '1 people',
          key: 1
        },
        {
          name: '2 people',
          key: 2
        },
        {
          name: '3 people',
          key: 3
        },
        {
          name: '4 people',
          key: 4
        },
        {
          name: '5 people',
          key: 5
        },
        {
          name: '6 people',
          key: 6
        },
        {
          name: '6+ people',
          key: 7
        }
      ],
      event: '',
      eventDate: '',
      eventRole: '',
      eventPeople: '',
      eventEmail: '',
      validator: '',
      rulesRes: {
        eventDate: '',
        email: ''
      }
    }
  },
  computed: {
    // 按钮是否禁用
    disabled() {
      if (this.eventDate) {
        if (this.eventEmail) {
          return false
        }
      }
      return true
    }
  },
  mounted() {
    const rules = {
      email: formValidatorType.email({ required: this.nl('page_js_enter_valid_add'), validator: this.nl('page_email_enter_valid') })
    }
    this.validator = new Schema(rules)
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      return {
        ec,
        el
      }
    },
    handleEventChange(e) {
      this.event = e.key
    },
    handleRoleChange(e) {
      this.eventRole = e.key
    },
    handlePeopleChange(e) {
      this.eventPeople = e.key
    },
    // 点击get started按钮，弹出注册
    clickGetStarted() {
      // 校验 event
      if (!this.event) {
        setTimeout(() => {
          this.$refs.welome_event_select.show = true
        }, 300)
        return
      }
      // 校验 date
      if (!this.eventDate) {
        this.showDatePick = true
        return
      }

      // if (!this.disabled) {
      // 校验email
      if (!this.eventEmail) {
        this.rulesRes.email = this.nl('page_email_enter_valid')
        return
      }
      this.validator.validate(
        {
          email: this.eventEmail
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesRes[item.field]) {
                this.rulesRes[item.field] = item.message
              }
            })
            return false
          }
          // 直接进行数据提交
          this.getRegisted()
        }
      )
      // }
    },
    handleFocus() {
      this.rulesRes.email = ''
      this.initEmailCheckDomain()
    },
    getRegisted() {
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rulesRes.email = ''
      }
      const url = '/1.0/landing-page/davids-bridal/subscribe'
      const params = {
        event: this.event,
        event_date: this.eventDate,
        email: this.eventEmail,
        is_check_email_suffix: this.needCheckEmailDomain
      }
      this.$axios.$post(url, params).then((res) => {
        if (res.code == 100210) {
          this.emailDomainError = true
          this.rulesRes.email = res.msg
          return
        }
        if (res.code == 0) {
          this.trackGA4NewEmail(this.eventEmail, 'we_help_brides', null, true)
          this.$store.commit('userInfo/setDavidBridalCoupons', res.data.coupon || [])
          // 通知父组件已经获取了券
          this.$emit('getCoupons')
        } else {
          //  接口报错提示
          this.rulesRes.email = res.msg
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.special-package {
  text-align: center;
  width: 1078px;
  margin: 0 auto;
  .title {
    font-family: @font-family-700;
    // margin-top: 80px;
    margin-bottom: 40px;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .shopping-for-info {
    display: flex;
    // align-items: center;
    justify-content: flex-start;
    font-size: 40px;
    line-height: 50px;
    font-family: @font-Ivy-Mode-400;
    input:-internal-autofill-selected {
      background-color: #fff !important;
      color: @theme;
      appearance: none;
    }
    .input-wrap {
      position: relative;
      width: 100%;
      font-family: @font-family-500;
      &.error {
        #event_email {
          border-bottom: 1px solid var(--color-ff0000);
        }
        p {
          font-size: 14px;
          line-height: 22px;
          color: var(--color-ff0000);
          margin-top: 8px;
          text-align: left;
        }
      }
      #event_email {
        width: 100%;
        height: 60px;
        border-radius: 0px;
        border: none;
        -webkit-box-shadow: none;
        box-shadow: none;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.06em;
        color: var(--color-121212);
        cursor: pointer;
        background: var(--color-f9f9f9);
        padding: 20px 9px;
        font-family: @font-family-500;
        box-sizing: border-box;
        &::placeholder {
          color: var(--color-999999);
        }
      }
      /deep/ .az-email-domain-box {
        max-width: 220px;
        top: 63px;
      }
    }
    .i-am {
      text-indent: 54px;
    }
    &:last-of-type {
      margin-top: 30px;
    }
    .date-picker {
      width: 300px;
      height: 50px;
      position: relative;
      text-align: left;
      margin: 0px 20px;
      &.error {
        /deep/.mx-input {
          border-bottom: 1px solid var(--color-ff0000);
        }
      }
    }
    @media screen and (max-width: 1700px) {
      /deep/ .mx-datepicker {
        .mx-input {
          font-size: 34px !important;
        }
      }
    }
    /deep/ .mx-datepicker {
      width: 300px;
      height: 50px;
      &.valued {
        .mx-input {
          border-bottom: 1px solid var(--color-121212);
          text-align: left;
        }
      }
      .mx-input {
        height: 50px;
        line-height: 50px;
        padding: 0;
        border-radius: 0px;
        border: none;
        border-bottom: 1px dashed var(--color-121212);
        box-shadow: none;
        font-size: 40px;
        color: var(--color-121212);
        cursor: pointer;
        // text-align: center;
        &:focus {
          background: #fff;
        }
        &::placeholder {
          color: rgba(214, 142, 150, 0.5);
        }
      }

      .mx-table-date td,
      .mx-table-date th {
        text-align: center;
      }
      .az-icon {
        fill: var(--color-121212);
        transition: 0.2s;
        font-size: 13px;
      }
    }
  }

  /deep/ .az-select {
    margin: 0px 20px;
    &-main {
      border: none;
      border-bottom: 1px dashed var(--color-121212);
      font-family: @font-Ivy-Mode-400;
      color: var(--color-121212);
      padding: 0px;
      &.valued {
        border-bottom: 1px solid var(--color-121212);
      }
      .placeholder {
        color: rgba(214, 142, 150, 0.5);
      }
      .az-icon {
        fill: var(--color-121212);
      }
      &-info {
        font-size: 40px;
        line-height: 50px;
        // justify-content: center;
      }
      @media screen and (max-width: 1700px) {
        &-info {
          font-size: 34px;
        }
      }
    }
    &-options {
      &.open {
        top: 50px !important;
      }
      li {
        color: rgba(214, 142, 150, 0.5);
        font-size: 40px;
        line-height: 50px;
        &:hover,
        &.active {
          font-family: @font-Ivy-Mode-400;
          color: var(--color-121212);
          background: #fff;
        }
      }
      @media screen and (max-width: 1700px) {
        li {
          font-size: 34px;
        }
      }
    }
  }
  .btn {
    width: 259px;
    height: 50px;
    box-sizing: border-box;
    font-size: 14px;
    text-transform: uppercase;
    margin-top: 40px;
    background: @theme;
    &.disabled {
      color: var(--color-999999);
      background: #fff;
      border: 2px solid var(--color-cccccc);
      cursor: not-allowed;
    }
  }
  ul.submit-tips {
    margin-top: 50px;
    padding: 0 15px;
    li {
      list-style-type: disc;
      color: var(--color-999999);
      text-align: left;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0.02em;
      a {
        color: @theme;
        text-decoration: underline;
      }
    }
  }
}
@media screen and (max-width: 1700px) {
  .special-package {
    width: 1019px;
    // .title {
    //   margin-bottom: 20px;
    // }
    .shopping-for-info {
      font-size: 34px;
      .i-am {
        text-indent: 47px;
      }
    }
  }
}
</style>
