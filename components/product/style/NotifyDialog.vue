<template>
  <az-overlay v-if="showDialog" :z-index="12" @click="close('before')">
    <div v-if="!showSuccess" class="notify-dialog">
      <az-icon @click="close('before')" class="close-btn" icon-class="iconic-close-appdownload"></az-icon>
      <div class="dialog-title">{{ dialogTitle }}</div>
      <div class="dialog-tip">{{ notifyText }}</div>
      <!-- 颜色选择框 -->
      <div v-if="Object.keys(options).length > 0" class="notify-item">
        <div class="item-label">{{ nl('page_your_color') }}</div>
        <div class="item">
          <div @click="handleColor" :class="{ error: selectError }" class="style-select">{{ colorValue }}</div>
          <div v-if="colorShow" class="options">
            <div
              v-for="(option, key) in options"
              :key="key"
              :class="{ selected: colorSelected.key == key }"
              @click="selectOption(option, 'color', key)"
              class="option color"
            >
              <span :style="getColorStyle(key)" class="color-option"></span>
              <span class="color-option-text">{{ formatValue(option) }}</span>
            </div>
          </div>
          <div v-if="showSampleTip" class="sample-tip">{{ nl('page_notify_dialog_text') }}</div>
        </div>
      </div>
      <!-- 尺码选择框 -->
      <div v-if="outOfSizes.length > 0" class="notify-item">
        <div class="item-label">{{ nl('page_your_size') }}</div>
        <div class="item">
          <div @click="handleSize" :class="{ error: selectError }" class="style-select">{{ sizeValue }}</div>
          <div v-if="selectError" class="error-tip">{{ nl('page_select_correct_stock') }}</div>
          <div v-if="sizeShow" class="options">
            <div
              v-for="(option, index) in outOfSizes"
              :key="index"
              :class="{ selected: sizeSelected.key == option.key }"
              @click="selectOption(option, 'size')"
              class="option"
            >
              {{ formatValue(option) }}
            </div>
          </div>
          <div v-if="showSampleTip" class="sample-tip">{{ nl('page_notify_dialog_text') }}</div>
        </div>
      </div>
      <div class="notify-email">
        <div class="item-label">{{ nl('page_your_email') }}</div>
        <input
          v-model="email"
          @focus="focus"
          @blur="onBlurEmail"
          :class="{ error: emailError }"
          :placeholder="nl('page_email_enter_email')"
          type="text"
          name="yourEmail"
          class="email-input"
        />
        <AzEmailDomain :show="emailDomainShow" :origin-email="email" @domain-handler="(value) => (email = value)" />
        <div v-if="emailError" class="error-tip">{{ emailDomainError ? emailErrorText : nl('page_js_change_email_check_email_new') }}</div>
      </div>
      <div class="interested-box">
        <p class="interest-title">{{ nl('page_common_new_user_role_title').replace('*', '') }}</p>
        <Interested :goods-id="payProductGoodsIds" :show-title="false" @on-change="interestedChange" />
        <p v-if="categoryError" class="error-tip animated-shake">{{ nl('page_common_new_user_role_error') }}</p>
      </div>
      <div class="event-date-box">
        <p class="event-date-title">{{ nl('page_order_event_date') }}</p>
        <AzDatePicker @on-date-picker="handleDate"></AzDatePicker>
      </div>
      <az-button
        @click="submit"
        v-track.view.click="trackParams('notifyme', 'submit')"
        :text="nl('page_notify_me')"
        class="notify-btn notify-me 123"
      ></az-button>
    </div>
    <div v-else class="notify-dialog success-dialog">
      <az-icon @click="close('after')" class="close-btn" icon-class="iconic-close-appdownload"></az-icon>
      <div class="dialog-title">{{ nl('page_notify_dialog_tex1') }}</div>
      <div class="dialog-tip">{{ notifySuccessText }}</div>
      <az-button @click="close('continue')" :text="nl('page_common_continue_shopping')" class="notify-btn"></az-button>
    </div>
  </az-overlay>
</template>

<script>
import AzButton from '@/components/az-ui/AzButton'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import colorHex from '@/assets/js/colorHex'
import Interested from '@/components/common/Interested'
import AzDatePicker from '@/components/az-ui-new/AzDatePicker'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
import checkEmailDomain from '@/assets/js/checkEmailDomain'
export default {
  name: 'NotifyDialog',
  languageKeys: [
    'page_common_save',
    'page_select_correct_stock',
    'page_your_color',
    'page_your_size',
    'page_select_size',
    'page_notify_dialog_text',
    'page_your_email',
    'page_email_enter_email',
    'page_js_change_email_check_email_new',
    'page_notify_dialog_tex1',
    'page_common_continue_shopping',
    'page_notify_text1',
    'page_notify_text2',
    'page_notify_text3',
    'page_notify_text4',
    'page_notify_text5',
    'page_notify_text6',
    'page_out_of_stock_notify',
    'page_size_out_of_stock_notify',
    'page_color_out_of_stock_notify',
    'page_select_color',
    'page_common_last_available',
    'page_common_atelier_comingsoon_text1',
    'page_common_atelier_comingsoon_text2',
    'page_common_atelier_comingsoon_text3',
    'page_order_event_date',
    'page_common_new_user_role_error',
    'page_common_email_save_continue',
    ...Interested.languageKeys,
    ...AzDatePicker.languageKeys,
    ...AzEmailDomain.languageKeys
  ],
  components: { AzOverlay, AzButton, Interested, AzDatePicker, AzEmailDomain },
  mixins: [colorHex, checkEmailDomain],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isSample: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'size'
    },
    selectedColor: {
      type: Object,
      default: () => {}
    },
    selectedSize: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      email: '',
      emailError: false,
      selectError: false,
      showSuccess: false,
      colorSelected: {},
      sizeSelected: {},
      colorShow: false,
      sizeShow: false,
      categories: [],
      categoryError: false,
      event_date: '',
      emailErrorText: ''
    }
  },
  computed: {
    notifyText({ baseInfo }) {
      if (baseInfo.catId == 3110) {
        return this.nl('page_common_atelier_comingsoon_text2')
      }
      if (this.isSample) {
        return this.nl('page_notify_text1')
      } else if (this.type == 'size') {
        return this.nl('page_notify_text1')
      } else if (this.type == 'color') {
        return this.nl('page_notify_text2')
      } else {
        return this.nl('page_notify_text3')
      }
    },
    notifySuccessText({ baseInfo }) {
      if (baseInfo.catId == 3110) {
        return this.nl('page_common_atelier_comingsoon_text3')
      }
      if (this.isSample) {
        return this.nl('page_notify_text4')
      } else if (this.type == 'size') {
        return this.nl('page_notify_text4')
      } else if (this.type == 'color') {
        return this.nl('page_notify_text5')
      } else {
        return this.nl('page_notify_text6')
      }
    },
    dialogTitle({ baseInfo }) {
      if (baseInfo.catId == 3110) {
        return this.nl('page_common_atelier_comingsoon_text1')
      }
      if (this.isSample) {
        return this.nl('page_size_out_of_stock_notify')
      } else if (this.type == 'size') {
        return this.nl('page_size_out_of_stock_notify')
      } else if (this.type == 'color') {
        return this.nl('page_color_out_of_stock_notify')
      } else {
        return this.nl('page_out_of_stock_notify')
      }
    },
    sizeValue() {
      const color = this.options[this.colorSelected.key] || {}
      const outOfSizes = (color.outOfSizes || []).find((item) => item.key == this.sizeSelected.key) || {}
      const value = this.formatValue(outOfSizes)
      return value || this.nl('page_select_size')
    },
    colorValue() {
      const value = this.formatValue(this.options[this.colorSelected.key])
      return value || this.nl('page_select_color')
    },
    showSampleTip() {
      const option = this.options[this.sizeSelected.key]
      return this.isSample && option && !option.lastAvailableDate
    },
    outOfSizes() {
      const color = this.options[this.colorSelected.key] || {}
      return color.outOfSizes || []
    },
    payProductGoodsIds({ baseInfo }) {
      if (baseInfo.isGift) return []
      const specialIds = [1061464, 1061465, 1061466, 1061467, 1061468, 1061469]
      if (specialIds.includes(baseInfo.goodsId) && baseInfo.catId == 33) {
        return [2]
      }
      return [baseInfo.catId]
    }
  },
  watch: {
    showDialog(val) {
      if (val) {
        this.colorSelected = this.selectedColor
        this.sizeSelected = this.selectedSize
        this.setPoint('sizeoutofstock', 'popup', 'view')
        // 如果已登录则自动填充email
        if (this.userInfoEmail) {
          this.email = this.userInfoEmail
        }
      }
      if (process.client) {
        const bodyDom = document.body
        bodyDom && bodyDom.style.setProperty('overflow', val ? 'hidden' : 'auto')
      }
    }
  },
  methods: {
    setPoint(ec, el, ea) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType,
          cat_id: this.baseInfo.catId,
          size: this.sizeSelected.key || ''
        })
      })
    },
    close(type) {
      if (type == 'before') {
        this.setPoint('sizeoutofstock', 'popupclose', 'click')
      }
      if (type == 'continue') {
        this.setPoint('sizeoutofstock', 'continueshopping', 'click')
      }
      this.showSuccess = false
      this.colorShow = false
      this.sizeShow = false
      this.emailErrorText = ''
      this.$emit('show-notify-dialog')
      this.initEmailCheckDomain()
    },
    formatValue(option) {
      if (!option) {
        return false
      }
      if (option.lastAvailableDate && this.isSample) {
        // return option.name + ' (Last Available: ' + option.lastAvailableDate + ' PST)'
        return (option.shownName || option.name) + `(${this.nl('page_common_last_available', null, { date: option.lastAvailableDate })})`
      } else {
        return option.shownName || option.name
      }
    },
    selectOption(item, type, key) {
      if (type == 'color') {
        this.colorShow = false
        this.colorSelected = {
          name: item.name,
          key
        }
      }
      if (type == 'size') {
        this.sizeShow = false
        this.sizeSelected = item
      }
    },
    handleColor() {
      this.colorShow = !this.colorShow
      this.sizeShow = false
    },
    handleSize() {
      this.sizeShow = !this.sizeShow
      this.colorShow = false
    },
    focus() {
      this.initEmailCheckDomain()
      this.emailError = false
      this.emailErrorText = ''
    },
    submit() {
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.emailError = false
      }
      // 提交按钮打点
      if (this.selectedSize == '' && this.type != 'none') {
        this.selectError = true
      }
      const isEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (this.email == '' || !isEmail.test(this.email)) {
        this.emailError = true
      }
      if (this.selectError || this.emailError) {
        return false
      }
      const params = {
        goods_id: this.baseInfo.goodsId,
        color: this.colorSelected.name || '',
        size: this.sizeSelected.name || '',
        type: this.baseInfo.dressType,
        email: this.email,
        categories: this.categories,
        is_check_email_suffix: this.needCheckEmailDomain
      }
      if (params.categories.length == 0) {
        this.categoryError = true
        return
      }
      if (this.event_date) {
        params.event_date = this.event_date
      }
      this.categoryError = false
      this.$axios.$post('/1.0/notify-me/add', params).then((res) => {
        if (res.code == 100210) {
          this.emailDomainError = true
          this.emailError = true
          this.emailErrorText = res.msg
          return
        }
        if (res.code == 0) {
          this.showSuccess = true
          this.setPoint('sizeoutofstock', 'continueshopping', 'view')
          this.trackGA4NewEmail(this.email, 'notify_me')
        }
      })
    },
    trackParams(ec, el) {
      return {
        common: {
          ec,
          el,
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType,
            cat_id: this.baseInfo.catId,
            size: this.sizeSelected.key || ''
          })
        }
      }
    },
    interestedChange(value) {
      this.categories = value
      this.categoryError = false
    },
    handleDate(value) {
      this.event_date = value
    }
  }
}
</script>

<style lang="less" scoped>
.notify-dialog {
  display: block;
  width: 655px;
  padding: 50px 50px 45px;
  box-sizing: border-box;
  box-shadow: 0 0 20px var(--color-121212);
  border: solid 1px var(--color-121212);
  background-color: #fff;
  position: relative;
  transform: translateY(-15px);
  overflow-y: auto;
  .close-btn {
    fill: currentColor;
    color: var(--color-999999);
    font-size: 18px;
    position: absolute;
    border: 15px solid transparent;
    right: 0;
    top: 0;
    cursor: pointer;
  }
  .dialog-title {
    font-family: @font-family-600, sans-serif;
    font-size: 16px;
    line-height: 12px;
    border-bottom: 1px solid var(--color-121212);
    text-align: center;
    padding-bottom: 12px;
  }
  .dialog-tip {
    text-align: center;
    line-height: 18px;
    margin-top: 25px;
    margin-bottom: 16px;
  }
  .notify-item {
    margin-bottom: 15px;
    .item-label {
      text-align: left;
      line-height: 13px;
    }
    .item {
      position: relative;
      .style-select {
        width: 100%;
        height: 45px;
        border: 1px solid @border-color;
        box-sizing: border-box;
        margin-top: 6px;
        padding: 10px;
        color: var(--color-121212);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &::after {
          content: '';
          width: 0;
          height: 0;
          border-width: 6px 3px 0;
          border-style: solid;
          border-color: var(--color-121212) transparent transparent;
          position: absolute;
          top: 18px;
          right: 10px;
        }
        &.error {
          border-color: var(--color-ff0000);
        }
      }
      .options {
        position: absolute;
        background: #fff;
        width: 100%;
        max-height: 300px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        overflow-y: auto;
        z-index: 1;
      }
      .option {
        display: flex;
        align-items: center;
        padding: 0 5px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &.color {
          display: grid;
          grid-template-columns: 15px 1fr;
          grid-template-rows: minmax(40px, auto);
          align-items: center;
          column-gap: 10px;
          height: unset;
          line-height: unset;
        }
        &:hover {
          background-color: #2390fd;
        }
        .color-option {
          width: 15px;
          height: 15px;
          border-radius: 50%;
        }
      }
      .sample-tip {
        margin-top: 8px;
        font-size: 13px;
        line-height: 15px;
        color: #666;
      }
    }
  }
  .notify-email {
    position: relative;
    .email-input {
      width: 100%;
      height: 40px;
      border: 1px solid @border-color;
      box-sizing: border-box;
      margin-top: 6px;
      padding: 10px;
      color: var(--color-121212);
      &.error {
        border-color: var(--color-ff0000);
      }
    }
    /deep/ .az-email-domain-box {
      max-height: 275px;
      border-top: none;
      z-index: @z-index-3;
    }
  }
  .error-tip {
    text-align: left;
    color: var(--color-ff0000);
    line-height: 13px;
    margin-top: 7px;
  }
  .notify-me::before {
    content: '';
    background: url(~assets/images/common/a_sprite_l_20190418.png) -53px -420px no-repeat;
    width: 14px;
    height: 16px;
    margin-right: 9px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
  }
  .interested-box,
  .event-date-box {
    margin: 15px auto;
    .interest-title,
    .event-date-title {
      color: var(--color-121212);
      font-family: @font-family-500;
      font-size: 13px;
      text-transform: capitalize;
    }
    /deep/ .az-date-picker {
      margin-top: 5px;
    }
  }
  .notify-btn {
    width: 100%;
    height: 50px;
    background: @theme-color!important;
    border-radius: 2px;
    color: #fff;
    text-align: center;
    margin-top: 15px;
    font-family: @font-family-600;
    font-size: 14px;
    padding: 0;
    line-height: 50px;
    text-transform: uppercase !important;
    &:hover {
      background-color: @btn-hover-color !important;
    }
  }
}
</style>
