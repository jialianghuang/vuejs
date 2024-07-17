<template>
  <div class="ticket-box">
    <main-app :navigation="navigation">
      <div v-if="!['cancelOrderSuccess', 'cancelOrderFail'].includes(type)" class="main-content normal-width clearfix">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <account-menu v-if="!isGuest" :currentMenuType="currentMenuType" :accountMenu="accountMenu"></account-menu>
        <div class="account-right">
          <div class="ticket-info">
            <ul class="ticket-basic">
              <li>
                <span>{{ nl('page_order_order_date') }}:</span> {{ orderInfo.orderTime }}
              </li>
              <li>
                <span>{{ nl('page_common_order_number') }}:</span> {{ orderInfo.orderSn }}
              </li>
              <li>
                <span>{{ nl('page_order_order_total') }}:</span> {{ orderInfo.orderAmountDisplay }}
              </li>
            </ul>
            <a :href="countryUrl(`/order/detail?order_sn=${orderInfo.orderSn}`)" class="account-back">{{
              nl('page_email_back_to_order_details')
            }}</a>
          </div>
          <template v-if="!ticketId">
            <h1 class="ticket-form-title">{{ title }}</h1>
            <div v-show="ticketStatus == 'edit'" class="ticket-form">
              <ul>
                <li v-if="type == 'cancelOrder'">
                  <label>{{ nl('page_ticket_reason_for_cancellation') }}:<em>*</em></label>
                  <select
                    id="_cancel_reason"
                    v-model="cancelReason"
                    :class="{ error: rulesResult.cancelReason }"
                    @blur="onBlur('cancelReason')"
                    @focus="resetInput('cancelReason')"
                    name="cancel_reason"
                  >
                    <option value="" selected="selected">{{ nl('page_ticket_please_select_a_reason') }}</option>
                    <option v-for="(resonVal, reasonKey) in reasons" :key="reasonKey" :value="reasonKey">{{ resonVal }}</option>
                  </select>
                  <p id="_cancel_reason_msg" v-show="rulesResult.cancelReason" style="color: #f00;">{{ rulesResult.cancelReason }}</p>
                </li>
                <li>
                  <label>{{ nl('page_email_please_write_your_detailed_message_here') }}<em>*</em></label>
                  <textarea
                    id="_message"
                    v-model="message"
                    :class="{ error: rulesResult.message }"
                    @blur="onBlur('message')"
                    @focus="resetInput('message')"
                    class="w2"
                    name="message"
                    maxlength="3000"
                  ></textarea>
                  <p id="_message_msg" v-show="rulesResult.message" style="color: #f00;">{{ rulesResult.message }}</p>
                </li>
                <li>
                  <p v-html="nl('page_email_submit_request_tip')"></p>
                </li>

                <li>
                  <label>{{ nl('page_email_your_name') }}:<em>*</em></label>
                  <input
                    id="_name"
                    v-model="orderInfo.userName"
                    :class="{ error: rulesResult.userName }"
                    @blur="onBlur('userName')"
                    @focus="resetInput('userName')"
                    class="w1"
                    type="text"
                    name="user_name"
                  />
                  <p id="_name_msg" v-show="rulesResult.userName" style="color: #f00;">{{ rulesResult.userName }}</p>
                </li>
                <li>
                  <label>{{ nl('page_email_your_email') }}:<em>*</em></label>
                  <input
                    id="_email"
                    v-model="orderInfo.email"
                    :class="{ error: rulesResult.email }"
                    @blur="onBlur('email')"
                    @focus="resetInput('email')"
                    class="w1"
                    type="text"
                    name="email"
                  />
                  <p id="_email_msg" v-show="rulesResult.email" style="color: #f00;">{{ rulesResult.email }}</p>
                </li>
                <li>
                  <label>{{ nl('page_email_phone_number') }}:<em>*</em></label>
                  <input
                    id="_phone"
                    v-model="orderInfo.tel"
                    :class="{ error: rulesResult.tel }"
                    @blur="onBlur('tel')"
                    @focus="resetInput('tel')"
                    :maxlength="['US', 'CA'].includes(currentCountry) ? 10 : 60"
                    class="w1"
                    type="text"
                    name="phone"
                    size="30"
                  />
                  <p id="_phone_msg" v-show="rulesResult.tel" style="color: #f00;">{{ rulesResult.tel }}</p>
                </li>
                <li>
                  <button id="sbmit_frm_btn" @click="ticketStatusChange('preview')" class="btn">{{ nl('page_pager_next') }}</button>
                </li>
              </ul>
            </div>
            <div v-show="ticketStatus == 'preview'" class="ticket-preview">
              <dl class="expanded">
                <dt>{{ nl('page_email_please_check_and_confirm') }}</dt>
                <dd>
                  <template v-if="type == 'cancelOrder'">
                    <strong>{{ nl('page_ticket_reason_for_cancellation') }}</strong
                    ><br />
                    {{ reasons[cancelReason] }}<br /><br />
                  </template>
                  <strong>{{ nl('page_email_additional_information') }}</strong
                  ><br />
                  {{ message }}<br /><br />
                  <strong>{{ nl('page_email_contact_information') }}</strong
                  ><br />
                  {{ orderInfo.userName }}<br />
                  {{ orderInfo.email }}<br />
                  {{ orderInfo.tel }}<br />
                </dd>
              </dl>
              <div>
                <button id="submit1" @click="submitTicket" :disabled="submitLoading" class="btn">
                  {{ submitLoading ? `${nl('page_order_progress_processing')}...` : nl('page_email_confirm_and_submit') }}
                </button>
                <button id="back" @click="ticketStatusChange('edit')" class="btn">{{ nl('page_common_back') }}</button>
              </div>
            </div>
          </template>
          <div v-else class="ticket-success">
            <div class="content">
              <h3 style="border-bottom-width: 0px;">Thanks for submitting your request!</h3>
              <div style="padding-bottom: 120px;">
                <p>
                  {{
                    `An Azazie Stylist will respond to you within 1 business day. Your ticket number is ${ticketId}. Our office is open Sunday-Saturday
                  7am-5pm PST.`
                  }}
                </p>
                <p>You can also reach us at 650.422.2460</p>
                <p>
                  While you wait, please check out our <a :href="getSupportUrl(`/`, `/`)" target="_blank">FAQ</a> page for a more immediate
                  response to some of your questions!
                </p>
              </div>
            </div>
          </div>
        </div>
        <back-to-top></back-to-top>
      </div>
      <div v-else class="main-content normal-width">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div class="ticket-result">
          <div class="content">
            <template v-if="type == 'cancelOrderSuccess'">
              <div class="icon icon-okicon-ok"></div>
              <div class="txt">{{ nl('page_cancel_result_canceled') }}</div>
            </template>
            <template v-else-if="type == 'cancelOrderFail'">
              <div class="icon icon-failed"></div>
              <div class="txt">{{ nl('page_cancel_result_not_canceled') }}</div>
            </template>
          </div>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import formValidatorType from '@/assets/js/formValidatorType'
import mainApp from '@/components/Main'
import BreadCrumb from '@/components/common/Breadcrumb'
import AccountMenu from '@/components/user/AccountMenu'
import backToTop from '@/components/common/BackToTop'
import { mapState } from 'vuex'
import { init, getUserIdentity } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import Schema from 'async-validator'
import accountMixins from '@/assets/js/accountMixins'

export default {
  name: 'Ticket',
  components: {
    mainApp,
    BreadCrumb,
    AccountMenu,
    backToTop
  },
  mixins: [accountMixins],
  data() {
    return {
      flashSaleInfo: null,
      currentMenuType: '',
      pageLoading: false,
      ticketStatus: 'edit',
      message: '',
      cancelReason: '',
      ticketId: '',
      submitLoading: false,
      rulesResult: {
        cancelReason: '',
        message: '',
        userName: '',
        email: '',
        tel: ''
      }
    }
  },
  computed: {
    ...mapState('userInfo', ['isGuest']),
    breadCrumbInfo() {
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        viewOrders: {
          href: `/order/list`,
          title: this.nl('page_common_my_orders')
        },
        submitTicket: {
          title: this.nl('page_email_submit_ticket')
        }
      }
    },
    // 当前应该使用的国家code，如果url中存在订单国家code，就是用订单国家code，否则网站环境国家code
    currentCountry() {
      const res = (this.orderInfo && this.orderInfo.countryCode) || this.$route.query.order_country_code || this.country
      return res || this.country
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'ticket')
      const query = context.route.query
      const url = '/1.0/order/ticket'
      const res = await context.$axios.$get(url, {
        params: {
          ...query
        }
      })

      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 0) {
        console.log('ticket page success')
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, `/user/login?back=${context.route.fullPath}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/order/list')
        return
      }

      await getUserIdentity(context)

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        orderInfo: res.data.orderInfo,
        reasons: res.data.reasons,
        title: res.data.title,
        type: query.type
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {},
  mounted() {
    const rules = {
      maxLength(val, checks) {
        return val.trim().length <= checks.maxLength
      },
      minLength(val, checks) {
        if (checks.name == 'tel') {
          return val.replace(/[^0-9]/gi, '').trim().length >= checks.minLength
        } else {
          return val.trim().length >= checks.minLength
        }
      },
      number(val) {
        return /^[0-9]+$/.test(val.trim())
      }
    }
    const telCheck = (rule, value, callback) => {
      if (['AU', 'GB'].includes(this.currentCountry)) {
        if (!rules.number(value)) {
          callback(new Error(this.nl('page_pay_valid_phone_num')))
        } else {
          callback()
        }
      }
      if (!rules.number(value)) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      } else if (!rules.minLength(value, { minLength: 10, name: 'tel' })) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      } else if (!rules.maxLength(value, { maxLength: 11 })) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      } else {
        callback()
      }
    }
    const descriptor = {
      message: [{ type: 'string', required: true, message: this.nl('page_ticket_please_enter_your_detailed_message'), trigger: 'blur' }],
      userName: [{ type: 'string', required: true, message: this.nl('page_ticket_your_name_is_required'), trigger: 'blur' }],
      email: formValidatorType.email({
        required: this.nl('page_ticket_email_address_is_required'),
        validator: this.nl('page_common_email_format_error')
      }),
      tel: [{ type: 'number', required: true, message: this.nl('page_pay_valid_phone_num'), validator: telCheck, trigger: 'blur' }]
    }
    if (this.type == 'cancelOrder')
      descriptor.cancelReason = [
        { type: 'string', required: true, message: this.nl('page_ticket_cancel_reason_is_required'), trigger: 'blur' }
      ]
    this.validator = new Schema(descriptor)
  },
  methods: {
    resetInput(name) {
      if (name) {
        this.rulesResult[name] = ''
        return false
      }
      this.rulesResult = {
        cancelReason: '',
        message: '',
        userName: '',
        email: '',
        tel: ''
      }
    },
    onBlur(name) {
      this.validator.validate(
        {
          ...{
            cancelReason: this.cancelReason,
            message: this.message,
            userName: this.orderInfo.userName,
            email: this.orderInfo.email,
            tel: this.orderInfo.tel
          }
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesResult[item.field] && name == item.field) {
                this.rulesResult[item.field] = item.message
              }
            })
            return false
          }
        }
      )
    },
    ticketStatusChange(ticketStatus) {
      if (ticketStatus == 'preview') {
        this.validator.validate(
          {
            ...{
              cancelReason: this.cancelReason,
              message: this.message,
              userName: this.orderInfo.userName,
              email: this.orderInfo.email,
              tel: this.orderInfo.tel
            }
          },
          (errors, fields) => {
            if (errors) {
              errors.map((item) => {
                if (!this.rulesResult[item.field]) {
                  this.rulesResult[item.field] = item.message
                }
              })
              return false
            }
            this.ticketStatus = ticketStatus
            window.scroll(0, 0)
          }
        )
      } else {
        this.ticketStatus = ticketStatus
        window.scroll(0, 0)
      }
    },
    submitTicket() {
      this.submitLoading = true
      const params = {
        order_sn: this.orderInfo.orderSn,
        user_name: this.orderInfo.userName,
        email: this.orderInfo.email,
        phone: this.orderInfo.tel,
        message: this.message,
        reason: this.cancelReason,
        type: this.type
      }
      this.$axios.$post(`/1.0/order/ticket`, params).then((res) => {
        if (res.code == 0) {
          this.submitLoading = false
          this.ticketId = res.data.ticketId
          this.trackGA4NewEmail(this.orderInfo.email, this.type === 'cancelOrder' ? 'intercom_order_cancel' : 'intercom_order_edit_address')
        } else {
          alert(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.account-right {
  width: 746px;
  float: right;
  margin-top: 18px;
}
.ticket-info {
  margin-top: 39px;
  position: relative;
  .account-back {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 19px;
    padding: 0 10px;
    border: solid 1px #ccc;
    .border-radius(2px);
    color: #666;
    &:hover {
      color: @theme;
    }
    &:after {
      display: inline-block;
      content: '';
      overflow: hidden;
      width: 6px;
      height: 8px;
      background: url('~assets/images/a_sprite_l_20190128.png') no-repeat -48px -167px;
      margin-left: 8px;
    }
  }
  .ticket-basic {
    li {
      margin-bottom: 9px;
    }
    span {
      color: #666;
    }
    a {
      color: @theme;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.ticket-form-title {
  letter-spacing: 1px;
  font-size: 24px;
  font-weight: normal;
  text-transform: uppercase;
  border-top: solid 1px var(--color-121212);
  margin-top: 28px;
  padding: 8px 0 25px;
}
.ticket-form {
  li {
    margin-bottom: 16px;
  }
  label {
    display: block;
    margin-bottom: 6px;
    font-family: @font-family-600;
    em {
      color: @theme;
      margin-left: 3px;
      font-size: @font-size-small;
    }
  }
  p {
    margin: 6px 0;
  }

  textarea {
    resize: vertical;
  }
  input.w1 {
    width: 218px;
  }
  input.w2 {
    width: 718px;
  }
  textarea.w2 {
    width: 440px;
    height: 200px;
  }
}
.ticket-preview {
  padding-top: 28px;
  padding-bottom: 20px;
  dl {
    margin-bottom: 12px;
    border: solid 1px #e3e3e3;
  }
  dt {
    background: #f6f6f6;
    padding: 10px 11px 11px;
    font-family: @font-family-600;
    em {
      display: inline-block;
      margin: 3px 5px 0 0;
      width: 14px;
      height: 14px;
      overflow: hidden;
      background-image: url('~assets/images/a_sprite_l_20190128.png');
      background-repeat: no-repeat;
      background-position: -15px -143px;
    }
  }
  dd {
    display: none;
    padding: 15px 25px;
    line-height: 18px;
    word-wrap: break-word;
    a {
      color: @theme;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .expanded {
    dt em {
      background-position: 0 -143px;
    }
    dd {
      display: block;
    }
  }
}
#sbmit_frm_btn,
#submit1 {
  background: var(--color-e3bda1);
  border: solid 1px var(--color-e3bda1);
  &:hover {
    background: var(--color-121212);
    border-color: var(--color-121212);
  }
}
.btn {
  font-size: 14px;
  color: #fff;
  text-transform: uppercase;
  padding: 7px 18px;
  &[disabled],
  &[disabled]:hover,
  &.disabled,
  &.disabled:hover {
    background-color: #666 !important;
  }
}
#back {
  background: #fff;
  border: solid 1px var(--color-e3bda1);
  color: var(--color-e3bda1);
  margin-left: 10px;
  &:hover {
    background: var(--color-121212);
    color: #fff;
  }
}
.ticket-result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  .content {
    display: block;
    width: 830px;
    font-size: 16px;
    font-weight: bold;
    .icon {
      content: '';
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-top: -35px;
      margin-right: 10px;
      padding-bottom: 35px;
    }
    .icon-ok {
      background: url('~assets/images/order/ok-icon.png') no-repeat;
    }
    .icon-failed {
      height: 11px;
      background: url('~assets/images/order/i-icon.png') no-repeat;
    }
    .txt {
      display: inline-block;
      width: 760px;
    }
  }
}
.ticket-success {
  border-top: solid 1px var(--color-121212);
  margin-top: 28px;
  padding: 8px 0 0;
  h3 {
    margin-bottom: 15px;
  }
  a {
    &:hover {
      color: var(--color-121212);
    }
    text-decoration: underline;
    color: var(--color-121212);
  }
  p {
    margin-top: 14px;
  }
}
</style>
