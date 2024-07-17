<template>
  <div class="cyber-main">
    <div class="cyber-pre-content">
      <img v-show="imgLoaded" :src="nl(banner.img)" @load="imgLoaded = true" class="img-bgc" alt="cyber monday" />
      <div v-if="!imgLoaded" class="default-img">
        <img :src="require('~/assets/images/default_img.jpg')" alt="default img" />
      </div>
      <div v-if="!popType" :style="{ opacity: imgLoaded ? 1 : 0 }" class="cyber-content cyber-email">
        <!-- <az-count-down :endTime="endTime" :isCyberTime="true"></az-count-down> -->
        <div class="cyber-input-wrap">
          <!-- <h2 class="title1">{{ nl('page_cyber_subscribe_top') }}</h2> -->
          <h1 class="title">{{ nl('page_cyber_subscribe_title') }}</h1>
          <p v-html="nl('page_cyber_subscribe_desc1')" class="des1"></p>
          <!-- <p v-html="nl('page_cyber_subscribe_desc2')" class="des2"></p> -->
          <div class="cyber-input">
            <az-select
              :options="options"
              :defaultValue="identity"
              :placeholder="nl('page_cyber_monday_identity')"
              @on-change="handleSelectChange"
              :width="260"
              :height="40"
              :errTips="identityErr"
              :innerRequired="true"
            ></az-select>
            <email-input
              ref="EMAIL"
              @submit="newEmaliSubmit"
              :tabindex="'2'"
              :placeholder="nl('page_enter_your_email')"
              :requiredTxt="nl('page_login_enter_email')"
              :validatorTxt="nl('page_email_enter_valid')"
              :innerRequired="true"
              :autoFocus="false"
              :showDomain="false"
            ></email-input>
          </div>
          <date-picker
            v-model="eventDate"
            :append-to-body="false"
            :popup-style="{ top: '40px', left: '0', zIndex: 1 }"
            :disabled-date="disabledDate"
            :clearable="false"
            :editable="false"
            :lang="datePickerLang"
            :input-attr="{ 'aria-label': 'date picker' }"
            :placeholder="nl('page_order_what_is_date')"
            type="date"
            class="data-picker-box"
            value-type="YYYY-MM-DD"
          ></date-picker>
          <az-button
            v-track.view.click="getBiParams({ ec: '2023cybersale', el: 'subscribe' })"
            :loading="loading"
            :disabled="loading"
            :needIcon="false"
            @click="newEmaliSubmit"
            class="btn btn-default btn-submit"
            tabindex="4"
          >
            {{ nl('page_cyber_subscribe_button') }}
          </az-button>
        </div>
      </div>
      <div v-else-if="popType === 1" class="cyber-email congratulations">
        <h1 class="title">{{ nl('page_cyber_subscribe_success_title') }}</h1>
        <p v-html="nl('page_cyber_subscribe_success_desc')" class="des"></p>
        <p class="code">
          {{ nl('page_common_code') }}:<span class="code-num">{{ couponCode }}</span>
        </p>
        <az-button
          v-track.view.click="getBiParams({ ec: '2023cybersale', el: 'addswatch' })"
          @click="clickAddSwatches"
          class="btn btn-default btn-submit"
        >
          {{ nl('page_cyber_monday_add_swatches') }}
        </az-button>
        <p v-html="nl('page_cyber_subscribe_success_tip')" class="tips"></p>
      </div>
      <div v-else-if="popType === 2" class="cyber-email congratulations">
        <h1 class="title">{{ nl('page_cyber_subscribe_set_title') }}</h1>
        <p v-html="nl('page_cyber_subscribe_set_desc')" class="des"></p>
        <az-button
          v-track.view.click="getBiParams({ ec: '2023cybersale', el: 'startshopping' })"
          @click="clickStartShopping"
          class="btn btn-default btn-submit"
        >
          {{ nl('page_cyber_subscribe_set_button') }}
        </az-button>
        <template v-if="country === 'US'">
          <p v-html="nl('page_cyber_subscribe_set_desc2')" class="des"></p>
          <az-button
            v-track.view.click="getBiParams({ ec: '2023cybersale', el: 'shopgiftcards' })"
            @click="clickShopGiftCards"
            class="btn btn-default btn-submit"
          >
            {{ nl('page_cyber_subscribe_set_button2') }}
          </az-button>
        </template>
      </div>
    </div>
    <!-- <div class="cyber-pre-tips-block">
      <div v-html="nl('page_cyber_monday_pre_end_title1')" class="cyber-pre-tips-title"></div>
      <div class="cyber-pre-tips-item">
        <h3>{{ nl('page_cyber_monday_pre_end_title2') }}</h3>
        <p>
          {{ nl('page_cyber_monday_pre_end_title3') }}
        </p>
      </div>
      <div class="cyber-pre-tips-item">
        <h3>{{ nl('page_cyber_monday_pre_end_title4') }}</h3>
        <p>{{ nl('page_cyber_monday_pre_end_title5') }}</p>
        <div class="icon-wrap">
          <a href="https://twitter.com/azazieofficial"> <az-icon icon-class="icon-circle-twitter"></az-icon></a>
          <a href="https://www.instagram.com/azazieofficial/"><az-icon icon-class="icon-circle-ins"></az-icon></a>
          <a href="https://www.tiktok.com/@azazieofficial"><az-icon icon-class="icon-circle-tiktok"></az-icon></a>
        </div>
      </div>
      <div class="cyber-pre-tips-item">
        <h3>{{ nl('page_cyber_monday_pre_end_title6') }}</h3>
        <p>{{ nl('page_cyber_monday_pre_end_title7') }}</p>
      </div>
      <ul>
        <li>
          <a :href="nl('page_cyber_monday_watches_url')">{{ nl('page_cyber_monday_pre_articles_title1') }}</a>
        </li>
        <li>
          <a :href="nl('page_cyber_monday_standard_sizing_url')">{{ nl('page_cyber_monday_pre_articles_title2') }}</a>
        </li>
        <li>
          <a :href="nl('page_cyber_monday_when_to_order_url')">{{ nl('page_cyber_monday_pre_articles_title3') }}</a>
        </li>
        <li>
          <a :href="nl('page_cyber_monday_dye_lot_procedure_url')">{{ nl('page_cyber_monday_pre_articles_title4') }}</a>
        </li>
        <li>
          <a :href="nl('page_cyber_monday_return_policy_url')">{{ nl('page_cyber_monday_pre_articles_title5') }}</a>
        </li>
      </ul>
      <div v-html="nl('page_cyber_monday_pre_end_title8')" class="cyber-pre-tips-more"></div>
    </div> -->
    <!-- <az-popup-layer id="popup_cyber_success" v-if="resultTips" @close="resultTips = ''" width="450px" height="auto">
      <div class="cyber-content cyber-success">
        <img :src="replaceImgCdnUrl(emailSubscribePopBanner.img)" alt="cyber monday" />
        <div v-html="resultTips" class="cyber-tips"></div>
        <p v-if="couponCode" class="theme-color">{{ nl('page_order_coupon_code') }}: {{ couponCode }}</p>
        <a :href="popUrl">
          <az-button
            v-track.view.click="getBiParams({ ec: '2022cybersale', el: `window${popType}` })"
            :needIcon="false"
            @click="resultTips = ''"
            class="btn btn-default btn-continue"
            tabindex="4"
          >
            {{ btnText }}
          </az-button>
        </a>
      </div>
    </az-popup-layer> -->
  </div>
</template>

<script>
import EmailInput from '@/components/user/EmailInput'
import AzButton from '@/components/az-ui/Button/AzButton'
// import AzCountDown from '@/components/az-ui/AzCountDown'
import AzSelect from '@/components/az-ui/AzSelect'
// import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'

export default {
  name: 'CyberMondayCountDown',
  components: {
    EmailInput,
    AzButton,
    // AzCountDown,
    AzSelect,
    // AzPopupLayer,
    DatePicker
  },
  props: {
    endTime: {
      type: String,
      default: ''
    },
    banner: {
      type: Object,
      default: () => {
        return {}
      }
    },
    emailSubscribePopBanner: {
      type: Object,
      default: () => {
        return {}
      }
    },
    emailSelectCodeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      popType: null,
      popUrl: '',
      btnText: '',
      couponCode: '',
      loading: false,
      email: '',
      identity: '',
      identityErr: '',
      eventDate: '',
      swatchesUrl: '',
      giftCardUrl: '',
      bridesmaidUrl: '',
      imgLoaded: false
    }
  },
  computed: {
    options() {
      const list = []
      this.emailSelectCodeList.forEach((item) => {
        list.push({
          key: item,
          name: this.nl(item)
        })
      })
      return list
    },
    datePickerLang() {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = this.language === 'se' ? 'sv' : this.language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    }
  },
  watch: {
    userInfoEmail(e) {
      if (e) {
        this.$refs.EMAIL.email = e
      }
    }
  },
  methods: {
    clickShopGiftCards() {
      if (this.giftCardUrl) {
        location.href = this.countryUrl(this.giftCardUrl)
      }
    },
    clickStartShopping() {
      if (this.bridesmaidUrl) {
        location.href = this.countryUrl(this.bridesmaidUrl)
      }
    },
    clickAddSwatches() {
      if (this.swatchesUrl) {
        location.href = this.countryUrl(this.swatchesUrl)
      }
    },
    disabledDate(current) {
      // Can not select days before today
      return current && current < this.$dayjs().startOf('day')
    },
    getBiParams(ev) {
      if (process.server) return
      if (ev) {
        const { ec, el } = ev
        return {
          common: {
            ec,
            el,
            msg: JSON.stringify({
              source: this.$route.query.source || ''
            })
          }
        }
      } else {
        return {}
      }
    },
    handleSelectChange(data) {
      this.identity = data.key
      this.identityErr = ''
    },
    newEmaliSubmit() {
      this.email = this.$refs.EMAIL.email
      if (!this.identity) {
        this.identityErr = this.nl('page_cyber_monday_identity_error_tips')
        return false
      }
      if (!this.$refs.EMAIL.validateEvent()) {
        return false
      }
      this.addCyberMondayEmail()
    },
    addCyberMondayEmail() {
      this.btnText = ''
      this.couponCode = ''
      this.loading = true
      this.retentionReject()
      this.$axios
        .$post('/1.0/email/add-cyberMonday-email', {
          email: this.email,
          extName: this.identity,
          extValue: this.nl(this.identity),
          eventDate: this.eventDate
        })
        .then((res) => {
          this.loading = false
          if (res.code === 0) {
            this.popType = res.data.type
            if (res.data.url) {
              this.swatchesUrl = res.data.url.swatches
              this.giftCardUrl = res.data.url.giftCard
              this.bridesmaidUrl = res.data.url.bridesmaid
            }
            if (this.popType == 1) {
              this.couponCode = res.data.couponCode
            }
            this.identity = ''
            this.email = ''
            this.btnText =
              this.popType == 1 ? this.nl('page_cyber_monday_add_swatches') : this.nl('page_category_continue_shopping_btn_tip')
          } else {
            alert(res.msg)
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.cyber-main {
  color: #fff;
  position: relative;
  .cyber-pre-content {
    position: relative;
    .default-img {
      width: 100%;
      height: 31.25vw;
      min-height: 400px;
      background: #f7f7f7;
      text-align: center;
      img {
        height: 100%;
      }
    }
    .img-bgc {
      width: 100%;
      height: 31.25vw;
      min-height: 400px;
      vertical-align: middle;
    }
  }
  .cyber-pre-tips-block {
    color: var(--color-121212);
    width: 35.4%;
    margin: auto;
    margin-top: 20px;
    text-align: center;
    .cyber-pre-tips-title {
      font-family: @font-family-600;
    }
    .cyber-pre-tips-item {
      margin-top: 30px;
      h3 {
        font-family: @font-family-600;
      }
      p {
        margin-top: 10px;
      }
      .icon-wrap {
        margin-top: 10px;
        a {
          margin: 0 12px;
          .az-icon {
            font-size: 45px;
          }
        }
      }
    }
    ul {
      margin-top: 10px;
      li {
        list-style: disc;
        text-decoration-line: underline;
        text-align: left;
        margin: auto;
        margin-top: 5px;
        width: fit-content;
        a {
          color: var(--color-121212);
        }
      }
    }
    .cyber-pre-tips-more {
      margin: 30px 0;
    }
  }
}

.cyber-email {
  position: absolute;
  bottom: 50%;
  left: 50%;
  // right: 20.83%;
  transform: translateY(50%);
  color: var(--color-121212);
  text-align: center;
  width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .cyber-tips {
    margin-top: 5px;
    margin-bottom: 15px;
    color: var(--color-121212);
  }
  .title {
    font-family: @font-Ivy-Mode-700;
    font-size: 54px;
    line-height: normal;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 5px;
  }
  .cyber-input-wrap {
    width: 530px;
    margin: auto;
    // margin-top: 20px;
    .des1,
    .des2 {
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: 10px;
      color: #fff;
    }
    /deep/ .cyber-input {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .control-group {
        width: 260px;
        text-align: left;
        position: relative;
        &.error {
          input {
            border-color: red;
          }
        }
      }
      input {
        width: 260px;
        height: 40px;
        box-sizing: border-box;
        background-color: #fff;
        border-color: #fff;
        padding: 10px;
        &::placeholder {
          color: #999;
        }
      }
      .help-inline {
        line-height: 18px;
        display: block;
        color: var(--color-ff0000);
        margin-top: 5px;
      }
      .email-domain-box {
        position: absolute;
        left: 0;
        top: 40px;
        z-index: 10;
        width: 390px;
        max-height: 284px;
        font-size: 13px;
        background: #fff;
        color: var(--color-121212);
        text-indent: 10px;
        box-sizing: border-box;
        border: 1px solid #ffffff;
        .title {
          padding: 0 5px;
          font-family: @font-family-600, sans-serif;
          line-height: 20px;
        }
        .domian-item {
          padding: 0 5px;
          font-family: @font-family-500, sans-serif;
          line-height: 22px;
          cursor: pointer;
          span {
            color: #666;
          }
          &:hover {
            color: #fff;
            span {
              color: #fff;
            }
            background-color: #4b83af;
          }
        }
      }
      .az-select {
        display: block;
        .az-select-main {
          border: solid 1px #fff;
          &.error {
            border-color: red;
          }
        }
      }
    }
    .data-picker-box {
      display: block;
      width: 100%;
      height: 40px;
      line-height: 38px;
      /deep/ .mx-input {
        display: block;
        height: 40px;
        line-height: 38px;
        border-radius: 0;
        border: 1px solid #fff !important;
      }
      /deep/ .mx-icon-calendar {
        display: inline-block;
      }
    }
    .btn-submit {
      width: 100%;
      height: 40px;
      margin-top: 15px;
    }
  }
  &.congratulations {
    // bottom: 40px;
    color: #fff;
    .title {
      text-transform: capitalize;
      margin-bottom: 15px;
    }
    .des {
      font-size: 20px;
      line-height: normal;
      letter-spacing: 2.4px;
      margin-bottom: 15px;
    }
    .code {
      font-size: 20px;
      line-height: normal;
      letter-spacing: 2.4px;
      text-transform: uppercase;
      margin-bottom: 15px;
      &-num {
        font-family: @font-family-600;
      }
    }
    .btn {
      width: 240px;
      height: 40px;
      margin-bottom: 15px;
    }
    .tips {
      font-size: 13px;
      line-height: normal;
      letter-spacing: 1.56px;
    }
  }
}

#popup_cyber_success {
  /deep/ .az-popup-box {
    box-sizing: border-box;
    padding: 0 !important;
    .layer-close {
      fill: currentColor;
      color: #fff;
    }
    .cyber-success {
      text-align: center;
      img {
        width: 100%;
      }
      .cyber-tips {
        margin: 25px 40px 0;
        color: var(--color-121212);
      }
      .theme-color {
        margin-top: 10px;
        font-family: @font-family-600;
      }
      .btn-continue {
        background: var(--color-121212);
        border: 1px solid var(--color-121212);
        min-width: 240px;
        margin-top: 25px;
        margin-bottom: 40px;
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .cyber-email {
    .title {
      font-size: 46px;
    }
  }
}
</style>
