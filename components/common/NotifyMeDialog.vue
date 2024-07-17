<template>
  <div id="notify-me-dialog" v-track.view="trackParams('sizeoutofstock', 'popup')">
    <azLoading v-if="loading"></azLoading>
    <az-overlay
      v-else
      :z-index="13"
      :lockScroll="false"
      @click="close"
      :class="[showAnimate ? 'animation-fade-enter-active' : 'animation-fade-leave-active']"
    >
      <div class="notify-me-dialog">
        <az-icon @click="close" icon-class="icon-icon_style_gallery_off" class="nmd-close"></az-icon>
        <template v-if="!showSuccess">
          <p class="nmd-title">{{ nl('page_common_out_of_stock') }}?</p>
          <p class="nmd-sub-title">{{ nl('page_notify_me_sub_title') }}</p>
          <div v-if="Object.keys(colors).length >= 8" class="nmd-list colors big">
            <div class="color-label">{{ nl('page_your_color') }}</div>
            <div
              @click="
                () => {
                  showColorOption = !showColorOption
                  showOption = false
                }
              "
              :class="['select-color', { up: showColorOption }]"
            >
              {{ selectColor.name || nl('page_select_color') }}
              <div v-show="showColorOption" class="select-options">
                <template v-for="(color, key) in colors">
                  <p :key="key" @click="handleColor(color)" class="option-item">
                    <span :style="getColorStyle(color.key)" :class="['color-item', { selected: color.key == selectColor.key }]">
                      <az-icon icon-class="color-disabled" class="disabled"></az-icon>
                      <az-icon icon-class="color-disabled-selected" class="disabled-selected"></az-icon>
                    </span>
                    {{ color.name }}
                  </p>
                </template>
              </div>
            </div>
          </div>
          <div v-else class="nmd-list colors">
            <template v-for="(color, key, index) in colors">
              <span
                :key="index"
                :style="getColorStyle(color.key)"
                :class="['color-item', { selected: color.key == selectColor.key }]"
                @click="handleColor(color)"
              >
                <az-icon icon-class="color-disabled" class="disabled"></az-icon>
                <az-icon icon-class="color-disabled-selected" class="disabled-selected"></az-icon>
              </span>
            </template>
          </div>
          <div v-if="Object.keys(sizes).length >= 8" class="nmd-list sizes big">
            <div class="size-label">{{ nl('page_your_size') }}</div>
            <div
              @click="
                () => {
                  showOption = !showOption
                  showColorOption = false
                }
              "
              :class="['select-size', { up: showOption }]"
            >
              {{ sizeValue }}
              <div v-show="showOption" class="select-options">
                <template v-for="(size, key) in sizes">
                  <p :key="key" @click="handleSize(size)" class="option-item">{{ formatValue(size) }}</p>
                </template>
              </div>
            </div>
          </div>
          <div v-else :class="{ 'no-size': !Object.keys(sizes) || !Object.keys(sizes).length }" class="nmd-list sizes">
            <template v-for="(size, key) in sizes">
              <p
                :key="key"
                @click="handleSize(size)"
                :style="{ '--width': Math.sqrt(Math.pow(48, 2) + Math.pow(34, 2)) + 'px' }"
                :class="['size-item', { selectd: size.key == selectSize.key }]"
              >
                {{ size.name }}
              </p>
            </template>
          </div>
          <div class="nmd-form">
            <span class="nmd-form-text">{{ nl('page_your_email') }}</span>
            <input
              v-model="email"
              @focus="() => ((rulesResult.email = ''), initEmailCheckDomain())"
              @blur="onBlurEmail"
              :placeholder="nl('page_lucky_wheel_placeholder_text')"
              :class="['nmd-form-input', { error: rulesResult.email }]"
              type="email"
            />
            <AzEmailDomain :show="emailDomainShow" :origin-email="email" @domain-handler="(value) => (email = value)" />
            <p v-if="rulesResult.email" class="error-tips">{{ rulesResult.email }}</p>
            <div class="interested-box">
              <p class="interest-title">{{ nl('page_common_new_user_role_title').replace('*', '') }}</p>
              <Interested :goods-id="payProductGoodsIds" :show-title="false" @on-change="interestedChange" />
              <p v-if="categoryError" class="error-tip animated-shake">{{ nl('page_common_new_user_role_error') }}</p>
            </div>
            <div class="event-date-box">
              <p class="event-date-title">{{ nl('page_order_event_date') }}</p>
              <AzDatePicker @on-date-picker="handleDate"></AzDatePicker>
            </div>
            <div v-track.view.click="trackParams('notifyme', 'submit')" @click="subscribeSubmit" class="nmd-btn">
              <img src="~assets/images/notify-me.png" alt="notify me" class="nmd-notify-me-img" />
              <span class="nmd-btn-text">{{ nl('page_notify_me') }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="nmd-success-img">
            <img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/0c/7b/eb2eff15a9917f8c9242429541540c7b.png')"
              alt="nmd success"
            />
          </p>
          <p class="nmd-success-title">{{ nl('page_notify_dialog_tex1') }}</p>
          <!-- page_notify_me_success_desc -->
          <p class="nmd-success-desc">{{ nl('page_notify_me_success_desc') }}</p>
          <p v-track.view.click="trackParams('sizeoutofstock', 'continueshopping')" @click="close(1)" class="nmd-success-btn">
            {{ nl('page_js_continue_shopping') }}
          </p>
        </template>
      </div>
    </az-overlay>
  </div>
</template>

<script>
import azOverlay from '@/components/az-ui/Overlay/AzOverlay'
import azLoading from '@/components/az-ui/AzLoading'
import Schema from 'async-validator'
import formValidatorType from '@/assets/js/formValidatorType'
import colorHex from '@/assets/js/colorHex'
import Interested from '@/components/common/Interested'
import AzDatePicker from '@/components/az-ui-new/AzDatePicker'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
import checkEmailDomain from '@/assets/js/checkEmailDomain'
export default {
  name: 'NotifyMeDialog',
  languageKeys: [
    'page_common_out_of_stock',
    'page_notify_me_sub_title',
    'page_your_color',
    'page_select_color',
    'page_your_size',
    'page_your_email',
    'page_lucky_wheel_placeholder_text',
    'page_notify_dialog_tex1',
    'page_notify_me_success_desc',
    'page_js_continue_shopping',
    'page_select_size',
    'page_login_enter_email',
    'page_login_check_email_format',
    'page_order_event_date',
    'page_common_new_user_role_error',
    'page_common_email_save_continue',
    ...Interested.languageKeys,
    ...AzDatePicker.languageKeys,
    ...AzEmailDomain.languageKeys
  ],
  components: {
    azOverlay,
    azLoading,
    Interested,
    AzDatePicker,
    AzEmailDomain
  },
  mixins: [colorHex, checkEmailDomain],
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    selectedSizeKey: {
      type: String,
      default: ''
    },
    selectedColorKey: {
      type: String,
      default: ''
    },
    styleInfo: {
      type: Object,
      default: () => {}
    },
    stockInfo: {
      type: Object,
      default: () => {}
    },
    colorOptions: {
      type: [Object, Array],
      default: () => []
    },
    sizeOptions: {
      type: [Object, Array],
      default: () => []
    }
  },
  data() {
    return {
      showAnimate: false,
      loading: false,
      email: '',
      rulesResult: {
        email: ''
      },
      colors: {},
      sizes: {},
      selectColor: {},
      selectSize: {},
      showSuccess: false,
      showColorOption: false,
      showOption: false,
      categories: [],
      categoryError: false,
      event_date: ''
    }
  },
  computed: {
    sizeValue({ sizes, selectSize }) {
      const value = this.formatValue(selectSize)
      return value || this.nl('page_select_size')
    },
    payProductGoodsIds({ item }) {
      if (item.isGift) return []
      const specialIds = [1061464, 1061465, 1061466, 1061467, 1061468, 1061469]
      if (specialIds.includes(item.goodsId) && item.catId == 33) {
        return [2]
      }
      return [item.catId]
    }
  },
  mounted() {
    const descriptor = {
      email: formValidatorType.email({
        required: this.nl('page_login_enter_email'),
        validator: this.nl('page_login_check_email_format')
      })
    }
    this.validator = new Schema(descriptor)
    this.getLoginEmail()
    if (Object.keys(this.styleInfo).length == 0) {
      this.loading = true
      this.getProductInfo()
    } else {
      this.showAnimate = true
      this.colors = this.colorOptions || {}
      this.sizes = this.sizeOptions || []
      this.selectColor = this.colors[this.selectedColorKey] || {}
      this.selectSize = this.sizes[this.selectedSizeKey] || {}
      if (Object.keys(this.colors).length == 0) {
        this.colors = this.styleInfo.color || {}
      }
      if (Object.keys(this.sizes).length == 0 && this.styleInfo.size) {
        this.styleInfo.size.forEach((size) => {
          this.sizes[size.key] = size
        })
      }
    }
  },
  methods: {
    close(type) {
      this.$store.commit('setOpenNotifyMe', false)
      if (type) return
      this.buryPoint(this, 'event', {
        ec: 'sizeoutofstock',
        el: 'popupclose',
        ea: 'click',
        msg: JSON.stringify({ goodsId: this.item.goodsId, cat_name: this.item.catName, size: this.selectSize.key || this.selectedSizeKey })
      })
    },
    subscribeSubmit(e) {
      this.validator.validate(
        {
          email: this.email
        },
        (errors, fields) => {
          console.log('errors fields: ', errors, fields)
          if (errors) {
            errors.map((item) => {
              if (!this.rulesResult[item.field]) {
                this.rulesResult[item.field] = item.message
              }
            })
            e.preventDefault()
            return false
          }
          this.submitAxios()
        }
      )
    },
    submitAxios() {
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rulesResult.email = ''
      }
      const params = {
        goods_id: this.item.goodsId,
        color: this.selectColor.name || '',
        size: this.selectSize.name || '',
        type: this.item.dressType,
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
      this.$axios.$post('/1.0/notify-me/add', params).then((res) => {
        if (res.code == 100210) {
          this.emailDomainError = true
          this.rulesResult.email = res.msg
          return
        }
        if (res.code == 0) {
          this.showSuccess = true
        }
      })
    },
    getLoginEmail() {
      if (this.userInfoEmail) {
        this.email = this.userInfoEmail
      }
    },
    async getProductInfo() {
      this.showAnimate = true
      const url = `/1.0/product/first-screen?goods_id=${this.item.goodsId}`
      const res = await this.$axios.$get(url)
      if (res.code == 0) {
        const { styleInfo = {} } = res.data
        if (this.item.isStockGoods || this.item.supportStockSales) {
          this.getStockInfo(styleInfo)
        } else {
          this.selectColor = styleInfo.color[this.selectedColorKey] || {}
          this.selectSize = styleInfo.size ? styleInfo.size.find((item) => item.key == this.selectedSizeKey) || {} : {}
          this.loading = false
        }
      } else {
        this.loading = false
      }
    },
    handleColor(color) {
      this.buryPoint(this, 'event', {
        ec: 'sizeoutofstock',
        el: 'popupchoose',
        ea: 'click',
        msg: JSON.stringify({
          color: color.key
        })
      })
      if (this.selectColor.key == color.key) {
        this.$set(this, 'selectColor', {})
        return
      }
      this.$set(this, 'selectColor', color)
    },
    handleSize(size) {
      this.buryPoint(this, 'event', {
        ec: 'sizeoutofstock',
        el: 'popupchoose',
        ea: 'click',
        msg: JSON.stringify({
          size: size.key
        })
      })
      if (this.selectSize.key == size.key) {
        this.$set(this, 'selectSize', {})
        return
      }
      this.$set(this, 'selectSize', size)
    },
    trackParams(ec, el) {
      return {
        common: {
          ec,
          el,
          msg: JSON.stringify({
            goodsId: this.item.goodsId,
            cat_name: this.item.catName,
            cat_id: this.item.catId,
            size: this.selectedSizeKey
          })
        }
      }
    },
    async getStockInfo(styleInfo) {
      const result = await this.$axios.$get('/1.0/stock/' + this.item.goodsId + '?dress_type=' + this.item.dressType)
      if (result.code == 0) {
        this.selectColor = (styleInfo.color && styleInfo.color[this.selectedColorKey]) || {}
        this.selectSize = styleInfo.size ? styleInfo.size.find((item) => item.key == this.selectedSizeKey) || {} : {}
        for (const colorKey in result.data.outOfStockColorMap) {
          this.$set(this.colors, colorKey, styleInfo.color[colorKey])
        }
        if (styleInfo.size) {
          for (const sizeKey in result.data.outOfStockSizeMap) {
            const sizeMap = styleInfo.size.find((size) => size.key == sizeKey)
            if (sizeMap) {
              this.$set(this.sizes, sizeKey, {
                name: sizeMap.shownName,
                key: sizeMap.key,
                lastAvailableDate: sizeMap.lastAvailableDate || ''
              })
            }
          }
        }
        if (Object.keys(this.colors).length == 0) {
          this.colors = styleInfo.color || {}
        }
        if (Object.keys(this.sizes).length == 0 && styleInfo.size) {
          styleInfo.size.forEach((size) => {
            this.sizes[size.key] = size
          })
        }
      }
      this.loading = false
    },
    formatValue(option) {
      if (!option) {
        return false
      }
      if (option.lastAvailableDate && this.item.dressType == 'sample') {
        return (option.shownName || option.name) + ' (Last Available: ' + option.lastAvailableDate + ' PST)'
      } else {
        return option.shownName || option.name
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
#notify-me-dialog {
  .notify-me-dialog {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 40px 60px;
    background-color: #fff;
    box-sizing: border-box;
    overflow-y: auto;
    .nmd-close {
      position: absolute;
      right: 0;
      top: 0;
      border: 18px solid transparent;
      font-size: 14px;
      cursor: pointer;
    }
    .nmd-title {
      font-family: @font-family-600;
      font-size: 18px;
      line-height: 25px;
      text-align: center;
      color: var(--color-121212);
    }
    .nmd-sub-title {
      margin-top: 5px;
      font-family: @font-family-500;
      font-size: 13px;
      line-height: 18px;
      text-align: center;
      color: var(--color-121212);
    }
    .nmd-list {
      &.colors {
        max-width: 350px;
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        &.big {
          margin: 10px auto;
          .color-label {
            width: 100%;
            padding-bottom: 6px;
          }
        }
      }
      .color-item {
        position: relative;
        width: 26px;
        height: 26px;
        margin: 0 4px;
        border-radius: 50%;
        box-sizing: border-box;
        cursor: pointer;
        .az-icon {
          display: inline-block;
          width: 100%;
          height: 100%;
          &.disabled-selected {
            display: none;
          }
        }
        &.selected {
          .disabled {
            display: none;
          }
          .disabled-selected {
            display: inline-block;
          }
        }
      }
      &.sizes {
        margin: 20px auto;
        max-width: 350px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        &.big {
          margin: 10px auto;
          .size-label {
            width: 100%;
            padding-bottom: 6px;
          }
        }
        &.no-size {
          margin-top: 0;
        }
      }
      .size-item {
        position: relative;
        width: 48px;
        height: 34px;
        margin: 4px;
        border: 1px solid #f5f5f5;
        line-height: 34px;
        text-align: center;
        color: #d6d6d6;
        &::after {
          position: absolute;
          left: 0;
          bottom: 0;
          content: '';
          width: var(--width);
          height: 1px;
          background-color: #f5f5f5;
          transform-origin: left;
          transform: rotate(-35deg);
        }
        &.selectd {
          border-color: @theme;
        }
      }
      .select-color,
      .select-size {
        position: relative;
        width: 350px;
        margin: 0 auto;
        height: 40px;
        border: 1px solid @border-color;
        padding: 10px;
        box-sizing: border-box;
        &::after {
          content: '';
          width: 0;
          height: 0;
          border-color: var(--color-121212) transparent transparent;
          border-style: solid;
          border-width: 6px 3px 0;
          position: absolute;
          top: 18px;
          right: 10px;
          transition: transform 0.5s ease;
        }
        .select-options {
          position: absolute;
          background-color: #fff;
          width: 100%;
          border: 1px solid @border-color;
          max-height: 160px;
          overflow: auto;
          top: 38px;
          left: -1px;
          z-index: 1;
          .option-item {
            display: flex;
            align-items: center;
            height: 40px;
            padding: 10px;
            box-sizing: border-box;
            box-shadow: 0 -1px 0 #eee;
            &:hover {
              background-color: #2390fd;
            }
            .color-item {
              display: inline-block;
              position: relative;
              width: 26px;
              height: 26px;
              margin: 0 4px;
              border-radius: 50%;
              box-sizing: border-box;
              cursor: pointer;
              .az-icon {
                display: inline-block;
                width: 26px;
                height: 26px;
                &.disabled-selected {
                  display: none;
                }
              }
              &.selected {
                .disabled {
                  display: none;
                }
                .disabled-selected {
                  display: inline-block;
                }
              }
            }
          }
        }
        &.up {
          &::after {
            transform: rotate(180deg);
          }
        }
      }
    }
    .nmd-form {
      position: relative;
      width: 350px;
      margin: 10px auto 0px;
      .nmd-form-text {
        font-family: @font-family-500;
        font-size: 13px;
        line-height: 18px;
        text-align: left;
        color: var(--color-121212);
      }
      .nmd-form-input {
        width: 100%;
        height: 40px;
        background-color: #fff;
        border: 1px solid @border-color;
        padding: 0 10px;
        margin: 6px auto 0;
        box-sizing: border-box;
        &.error {
          border-color: red;
        }
      }
      .error-tips {
        color: red;
      }
      /deep/ .az-email-domain-box {
        top: 63px;
        max-height: 275px;
        border-top: none;
        z-index: @z-index-3;
      }
      .nmd-btn {
        width: 100%;
        height: 50px;
        margin-top: 10px;
        background-color: @theme;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .nmd-notify-me-img {
          width: 14px;
          vertical-align: middle;
          margin-right: 8px;
        }
        &-text {
          font-family: @font-family-600;
          font-size: 13px;
          line-height: 18px;
          text-align: center;
          text-transform: uppercase;
          color: #ffffff;
        }
        &:hover {
          background-color: var(--color-121212);
          opacity: 0.85;
        }
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
      .error-tip {
        text-align: left;
        color: var(--color-ff0000);
        line-height: 13px;
        margin-top: 7px;
      }
    }
    .nmd-success-img {
      img {
        display: block;
        margin: 0 auto;
        height: 148px;
        filter: grayscale(1); // 图片变为灰白
      }
    }
    .nmd-success-title {
      margin: 20px auto 5px;
      font-family: @font-family-600;
      font-size: 18px;
      line-height: 25px;
      text-align: center;
      color: var(--color-121212);
    }
    .nmd-success-desc {
      max-width: 350px;
      margin: 0 auto;
      font-family: @font-family-500;
      font-size: 13px;
      line-height: 18px;
      text-align: center;
      color: var(--color-121212);
    }
    .nmd-success-btn {
      max-width: 350px;
      height: 50px;
      margin-top: 25px;
      line-height: 50px;
      background-color: @theme;
      font-family: @font-family-600;
      font-size: 14px;
      text-align: center;
      text-transform: uppercase;
      color: #ffffff;
      cursor: pointer;
      &:hover {
        background-color: var(--color-121212);
        opacity: 0.85;
      }
    }
  }
}
</style>
