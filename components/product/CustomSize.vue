<template>
  <div :class="{ from_dialog: fromDialog != 'showroom' && fromDialog }" class="custom-size-box">
    <div v-if="!fromDialog" class="custom-label-box">
      <label v-if="markStr !== 'productDetail'" @click="selectCustom" class="custom-label">
        <div :class="{ selected: isVisible }" class="checkbox-box">
          <svg v-show="isVisible" class="icon">
            <use xlink:href="#icon-lby_tick_white_s"></use>
          </svg>
        </div>
        {{ nl('page_goods_custom_size_free') }}
      </label>
      <div v-show="isVisible" @click="changeUnit" class="switch_unit_box">
        <span class="unit">IN</span>
        <div class="switch_unit inch">
          <span class="selected_icon_bg_left selected_icon_bg"></span>
          <span class="selected_icon_bg_right selected_icon_bg"></span>
          <span :style="{ left: unit == 'inch' ? 0 : 'auto', right: unit == 'cm' ? 0 : 'auto' }" class="selected_icon"></span>
        </div>
        <span class="unit">CM</span>
      </div>
    </div>
    <client-only>
      <div v-show="isVisible" class="custom_size_form">
        <div v-if="fromDialog != 'showroom'" class="size_des">
          <p>
            <span>{{ currentShowName }}: </span>{{ currentShowDesc }}
          </p>
        </div>
        <div :class="fromDialog" class="size_form">
          <ul class="dress_ul">
            <li v-for="(customItem, index) in customList" :key="customItem.key">
              <div class="label">
                <span class="name">{{ customItem.name }}:</span>
                <a-select
                  v-if="customItem.key == 'extra_length'"
                  :list="extraLengthOption"
                  :selected="selected(customItem.key)"
                  :placeholder="getDescTitle(customItem)"
                  :displayTxt="`name`"
                  :selectStyle="{ width: '74px', height: '31px' }"
                  :class="{ error: customListFormResult[customItem.key] }"
                  @change="(item) => selectChange(customItem, index, item)"
                  class="select"
                >
                </a-select>
                <label v-else>
                  <span style="display: none"> text </span>
                  <input
                    v-model.number="customListForm[customItem.key]"
                    :placeholder="getDescTitle(customItem)"
                    @focus="inputFocus(customItem, index, $event)"
                    @blur="inputBlur(customItem.key)"
                    @input="inputChange(customItem.key)"
                    :class="{ error: customListFormResult[customItem.key] }"
                    class="input"
                    type="text"
                  />
                </label>
                <span class="unit_item"
                  >({{ unit == 'inch' ? 'in' : 'cm' }})
                  <a v-if="customItem.key == 'extra_length'" class="faq" href="javascript:void(0)">
                    <az-icon icon-class="icon-icon_undone1"></az-icon>
                    <div class="text-tip">
                      <span class="big-card">{{
                        country == 'US' ? nl('page_size_use_extra_length') : nl('page_size_use_extra_length_ca')
                      }}</span>
                    </div>
                  </a>
                  <!-- jira 10305 -->
                  <template v-else>
                    <a v-if="!isSpecialCatId(baseInfo.catId) && measureList[customItem.key]" class="faq" href="javascript:void(0)">
                      <az-icon v-track.view.click="getBiParams(customItem.name)" icon-class="icon-icon_undone1"></az-icon>
                      <div v-track.view.click="getBiParams(customItem.name)" class="text-tip">
                        <span class="big-card big-card-measure">
                          {{ nl(measureList[customItem.key].text) }}
                          <img :src="addWebpSuffix(nl(measureList[customItem.key].imgUrl))" :alt="nl(measureList[customItem.key].imgUrl)" />
                        </span>
                      </div>
                    </a>
                  </template>
                </span>
              </div>
              <p class="notice">{{ customListFormResult[customItem.key].length ? customListFormResult[customItem.key] : '' }}</p>
            </li>
          </ul>
          <div v-if="!fromDialog || fromDialog == 'cartEdit'" class="measure-block">
            <div class="normal_measure">
              <template v-if="baseInfo.catId == 45">
                <div @click="openBigImgDialog('maternity')" class="img-box">
                  <img :src="addWebpSuffix(langImages.maternity.small)" alt="maternity size chart" class="size-chart-png maternity" />
                  <i class="measure-btn" data-cat="maternity"></i>
                </div>
              </template>
              <template v-else-if="sizeChart.hasNeckHole">
                <div @click="openBigImgDialog('neck_hole')" class="img-box">
                  <img :src="addWebpSuffix(langImages.neck_hole.small)" alt="neck hole size chart" class="size-chart-png neck_hole" />
                  <i class="measure-btn" data-cat="neck_hole"></i>
                </div>
              </template>
              <template v-else-if="sizeChart.hasUnderBust && !sizeChart.isUnderBust">
                <div @click="openBigImgDialog('under_bust')" class="img-box">
                  <img :src="addWebpSuffix(langImages.under_bust.small)" alt="under bust size chart" class="size-chart-png under_bust" />
                  <i class="measure-btn" data-cat="under_bust"></i>
                </div>
              </template>
              <template v-else-if="baseInfo.catId == 2">
                <div @click="openBigImgDialog('dress')" class="img-box">
                  <img :src="addWebpSuffix(langImages.dress.small)" alt="bridal size chart" class="size-chart-png bridal" />
                  <i class="measure-btn" data-cat="dress"></i>
                </div>
              </template>
              <template v-else-if="baseInfo.catId == 9">
                <div @click="openBigImgDialog('junior')" class="img-box">
                  <img :src="addWebpSuffix(langImages.junior.small)" alt="junior size chart" class="size-chart-png dress" />
                  <i class="measure-btn" data-cat="junior"></i>
                </div>
              </template>
              <template v-else-if="sizeChart.isUnderBust">
                <div @click="openBigImgDialog('under_bust')" class="img-box">
                  <img :src="addWebpSuffix(langImages.under_bust.small)" alt="under bust size chart" class="size-chart-png under_bust" />
                  <i class="measure-btn" data-cat="under_bust"></i>
                </div>
              </template>
              <template v-else>
                <div @click="openBigImgDialog('dress_des')" class="img-box">
                  <img :src="addWebpSuffix(langImages.dress_des.small)" alt="dress size chart" class="size-chart-png dress" />
                  <i class="measure-btn" data-cat="dress"></i>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div v-if="customSuggestionShow" class="custom_suggestion">
          <div v-html="`* ${nl('page_custom_suggestion2')}`" @click="errorSuggestionClick($event)" class="error_suggestion"></div>
        </div>
        <div class="bot-wrap">
          <ul>
            <li>
              <div :class="{ error: confirmCheckboxError }" class="return_support_notice">
                <span
                  ><label>
                    <span style="display: none">checkbox</span>
                    <input v-model="confirmCheckbox" type="checkbox" name="return_support_checkbox" class="return_support_checkbox" />
                  </label>
                </span>
                <span
                  v-html="isBridal ? nl('page_custom_size_agree_des_bridal') : nl('page_custom_size_agree_des')"
                  class="agree-desc"
                ></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </client-only>
    <az-overlay @click="overlayShow = false" v-if="overlayShow" :zIndex="12">
      <div class="big-img-overlay">
        <div @click="overlayShow = false" class="layer-close">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <img :src="addWebpSuffix(overlayImgSrc)" alt="overlay" />
      </div>
    </az-overlay>
  </div>
</template>

<script>
import customSizeMixins from '@/assets/js/customSizeMixins.js'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import ASelect from '@/components/az-ui/Select/ASelect'
export default {
  name: 'CustomSize',
  languageKeys: [
    'page_goods_custom_size_free',
    'page_size_use_extra_length',
    'page_size_use_extra_length_ca',
    'page_custom_suggestion2',
    'page_custom_size_agree_des_bridal',
    'page_custom_size_agree_des',
    'page_image_maternity_img',
    'page_image_neck_hole_img',
    'page_image_under_bust_img',
    'page_image_size_chart',
    'page_image_dress_des_img',
    'page_image_maternity',
    'page_image_neck_hole',
    'page_image_under_bust',
    'page_image_dress',
    'page_image_junior',
    'page_size_ques',
    ...customSizeMixins.languageKeys
  ],
  components: {
    AzOverlay,
    ASelect
  },
  mixins: [customSizeMixins],
  props: {
    sizeChart: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    fromDialog: {
      type: String,
      default: ''
    },
    markStr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      overlayShow: false,
      overlayImgSrc: ''
    }
  },
  computed: {
    extraLengthOption() {
      if (this.customSizeInfo.extra_length_status) {
        const extraLengthItem = this.customMaps.extra_length
        const minKey = this.unit == 'inch' ? 'inch_min' : 'cm_min'
        const maxKey = this.unit == 'inch' ? 'inch_max' : 'cm_max'
        const gapKey = this.unit == 'inch' ? 'gap' : 'cm_gap'
        return this.getCustomSelectList(extraLengthItem[minKey], extraLengthItem[maxKey], extraLengthItem[gapKey], extraLengthItem.prefix)
      } else {
        return []
      }
    },
    baseInfo() {
      return this.$store.state.product.baseInfo
    },
    langImages() {
      // 多语言图片资源，采用多语言配置方式，获取不同语言下的图片链接
      return {
        maternity: {
          small: this.nl('page_image_maternity_img'),
          big: this.nl('page_image_maternity')
        },
        neck_hole: {
          small: this.nl('page_image_neck_hole_img'),
          big: this.nl('page_image_neck_hole')
        },
        under_bust: {
          small: this.nl('page_image_under_bust_img'),
          big: this.nl('page_image_under_bust')
        },
        dress: {
          small: this.nl('page_image_size_chart'),
          big: this.nl('page_image_dress')
        },
        junior: {
          small: this.nl('page_image_dress_des_img'),
          big: this.nl('page_image_junior')
        },
        dress_des: {
          small: this.nl('page_image_dress_des_img'),
          big: this.nl('page_image_dress')
        }
      }
    }
  },
  watch: {
    isVisible: {
      handler(val) {
        if (val) {
          this.setPoint('size', 'custom', 'click', {
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType || this.dressType
          })
        }
      },
      immediate: true
    },
    fromDialog: {
      handler(val) {
        if (!val) {
          this.setPoint('size', 'custom', 'view', {
            goodsId: this.baseInfo.goodsId,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType || this.dressType
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    number(val) {
      const valStr = val + ''
      return /^[0-9]*(\.?)[0-9]*$/.test(valStr.trim())
    },
    selectCustom() {
      this.$emit('select-custom')
    },
    getCustomSelectList(min, max, gap, prefix) {
      const res = []
      for (let i = min; i <= max; i += gap) {
        res.push({
          name: `${prefix}${i}`,
          value: i
        })
      }
      return res
    },
    inputFocus(obj, index, event) {
      this.current = obj
      this.currentShowName = this.customList[index].name
      this.currentShowDesc = this.size_des_mapping[this.customList[index].key]
      this.$set(this.customListFormResult, obj.key, '')
    },
    inputBlur(key) {
      this.checkAndNotice(key)
    },
    inputChange(key) {
      // 排除非数字和0
      if (
        (this.customListForm[key] && !this.number(this.customListForm[key])) ||
        (this.number(this.customListForm[key]) && this.customListForm[key] == 0)
      )
        this.customListForm[key] = ''
    },
    selectClick(obj, index, event) {
      this.current = obj
      this.currentShowName = this.customList[index].name
      this.currentShowDesc = this.nl('page_size_ques')
      this.$set(this.customListFormResult, obj.key, '')
    },
    selectChange(obj, index, item) {
      this.selectClick(obj, index)
      const key = obj.key
      const { value } = item || {}

      this.customListForm[key] = value
      if (!String(value) || value == -1) {
        this.customListFormResult[key] = true
      } else {
        this.customListFormResult[key] = false
      }
    },
    selected(key) {
      return this.customListForm[key] + ''
    },
    errorSuggestionClick(event) {
      const targetClassList = event.target.classList
      if (targetClassList.contains('customer_service')) {
        document.querySelector('#solvvy-support-flow-launch-widget') && document.querySelector('#solvvy-support-flow-launch-widget').click()
      }
    },
    formCheck() {
      // formCheck 对外提供的方法，返回 false => 前端验证未通过，前端验证通过的时候会返回 custom size 数据
      if (this.checkCustomSizeField()) {
        return this.customListForm
      } else {
        return false
      }
    },
    openBigImgDialog(key) {
      this.overlayImgSrc = this.langImages[key].big // 获取对应大图链接
      this.overlayShow = true
    },
    getBiParams(position) {
      if (process.server) return
      const msg = {
        goodsId: this.$store.state.product.baseInfo.goodsId,
        cat_Name: this.$store.state.product.baseInfo.catName
      }
      return {
        common: {
          ec: 'sizechart',
          el: `coustom_${position}_hover`,
          msg: JSON.stringify(msg)
        }
      }
    },
    setPoint(ec, el, ea, msg) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify(msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.custom-size-box {
  // margin-top: 12px;
  .custom-label-box {
    display: flex;
    justify-content: space-between;
    max-width: 420px;
    .custom-label {
      text-transform: uppercase;
      line-height: 18px;
      color: var(--color-121212);
      cursor: pointer;
      .checkbox-box {
        border: 1px solid var(--color-121212);
        width: 12px;
        height: 12px;
        line-height: 12px;
        display: inline-block;
        margin-right: 1px;
        box-sizing: border-box;
        &.selected {
          background: #666;
          border-color: #666;
        }
        .icon {
          width: 9px;
          height: 9px;
          color: #fff;
          vertical-align: top;
          fill: currentColor;
          overflow: hidden;
          margin: 1px 0 0 1px;
        }
      }
    }
    .switch_unit_box {
      display: flex;
      align-items: center;
      cursor: pointer;
      .unit {
        font-size: 13px;
        line-height: 18px;
        font-family: @font-family-500;
        color: #999;
      }
      .switch_unit {
        display: flex;
        align-items: center;
        position: relative;
        width: 32px;
        height: 12px;
        margin: 0 8px;
        span {
          display: inline-block;
          width: 16px;
          height: 12px;
        }
        .selected_icon_bg_left {
          border-radius: 50% 0 0 50%;
          background: #eee;
        }
        .selected_icon_bg_right {
          border-radius: 0 50% 50% 0;
          background: #eee;
        }
        .selected_icon {
          position: absolute;
          top: -2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: @theme-color;
        }
      }
    }
  }
  .custom_size_form {
    max-width: 508px;
    .size_des {
      border: 1px solid #e5e5e5;
      background-color: #fafafa;
      margin-top: 10px;
      p {
        padding: 8px 10px;
        color: #999;
        span {
          color: #666;
        }
      }
    }
    .size_form {
      display: flex;
      .dress_ul {
        flex: 1;
        li {
          margin: 15px 0;
          .label {
            font-size: 12px;
            color: var(--color-121212);
            height: 31px;
            display: flex;
            align-items: center;
            .name {
              flex: 1;
              font-size: 13px;
              text-align: left;
              text-transform: capitalize;
            }
            .input {
              box-sizing: border-box;
              width: 74px;
              font-size: 12px;
              padding: 4px 7px 4px 8px;
              margin-right: 10px;
              height: 31px;
              color: #555;
              border: 1px solid #ccc;
              background-color: #fff;
              &.error {
                border-color: #f00;
              }
            }
            .select {
              box-sizing: border-box;
              width: 74px;
              font-size: 12px;
              margin-right: 10px;
              color: #555;
              border: 1px solid #ccc;
              background-color: #fff;
              &.error {
                border-color: #f00;
              }
            }
            .input:focus {
              background: #f0f0f0;
            }
            .unit_item {
              width: 49px;
              text-align: left;
              .faq {
                display: inline-block;
                width: 20px;
                height: 20px;
                position: relative;
                left: 2px;
                top: 6px;
                vertical-align: top;
                margin-top: -7px;
                svg {
                  padding-top: 5px;
                }
                .text-tip {
                  // display: none;
                  margin-top: 10px;
                  position: absolute;
                  z-index: 101;
                  font-size: 13px;
                  left: -151px;
                  top: 16px;
                  text-align: center;
                  .big-card {
                    text-align: left;
                    text-transform: none;
                    width: 210px;
                    background-color: #fff;
                    padding: 20px 12px;
                    font-size: 13px;
                    font-family: @font-family-500;
                    color: var(--color-121212);
                    word-break: break-word;
                    white-space: pre-wrap;
                  }
                  .big-card-measure {
                    text-align: center;
                    width: auto;
                    white-space: inherit;
                    img {
                      margin-top: 10px;
                      width: 100%;
                    }
                  }
                }
              }
            }
          }
          .notice {
            text-align: left;
            color: #f00;
            width: 198px;
            font-size: 13px;
            line-height: 18px;
            margin-top: 5px;
          }
        }
      }
      .measure-block {
        width: 170px;
        .normal_measure {
          position: relative;
          .img-box {
            cursor: pointer;
          }
        }
        .size-chart-png.bridal {
          width: 150px;
          margin-top: 25px;
        }
        .size-chart-png.maternity {
          width: 170px;
          margin-top: 41px;
        }
        .size-chart-png.neck_hole {
          width: 150px;
          margin-top: 56px;
        }
        .size-chart-png.under_bust {
          width: 170px;
          margin-top: 40px;
        }
        .size-chart-png.dress {
          width: 170px;
          margin-top: 18px;
        }
        .measure-btn {
          position: absolute;
          right: 4px;
          bottom: 9px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          background-image: url(~assets/images/measure/zoom.png);
          background-size: cover;
        }
      }
      &.showroom {
        .dress_ul .label {
          justify-content: center;
          .name {
            display: inline-block;
            width: 132px;
            margin: 0 7px 0 50px;
            text-transform: uppercase;
            flex: none;
          }
        }
        .unit_item .faq .text-tip {
          left: -320px !important;
          .big-card::before {
            left: 86% !important;
          }
        }
      }
      &.cartEdit {
        justify-content: center;
        .dress_ul {
          flex: unset;
        }
      }
    }
    .return_bust_notice {
      width: 100%;
      height: 87px;
      background: inherit;
      background-color: #f8f8f8;
      box-sizing: border-box;
      border: 1px solid #ececec;
      border-radius: 0;
      -moz-box-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      font-family: @font-family-500, sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      color: var(--color-121212);
      text-align: center;
      line-height: normal;
      margin-top: 16px;
      margin-bottom: 5px;
      clear: both;
      .return_bust {
        border-width: 0;
        text-align: left;
        padding-left: 18px;
        padding-top: 15px;
        padding-bottom: 10px;
        display: block;
      }
      .return_bust_radio {
        display: inline;
        width: 118.5px;
        position: relative;
        line-height: 30px;
        bottom: 24px;
        right: -18px;
        margin-right: 71px;
        cursor: pointer;
        input[type='radio'] {
          width: 20px;
          height: 20px;
          opacity: 0;
        }
        label {
          cursor: pointer;
          .circle {
            position: absolute;
            left: 8px;
            top: 4px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid @border-color;
            &.selected::after {
              background-color: @theme-color;
              position: absolute;
              content: '';
              width: 8px;
              height: 8px;
              top: 1px;
              left: 1px;
              border-radius: 50%;
            }
          }
          span {
            margin-left: 5px;
          }
        }
      }
    }
    .error_suggestion {
      padding-left: 0;
      color: #f00;
      font-size: 13px;
      font-family: @font-family-500;
      line-height: 18px;
      /deep/ .customer_service {
        text-decoration: @btn-hover-color;
      }
    }
    .bot-wrap {
      width: 100%;
      // max-width: 420px;
      display: inline-block;
      text-align: left;
      padding-top: 9px;
      padding-bottom: 0;
      .btn-large {
        width: 149px;
        padding: 10px;
        font-size: 14px;
        font-weight: bold;
      }
      .btn-gray {
        background: #c4c4c4;
        color: #fff;
        border: none;
        text-transform: uppercase;
        margin-right: 7px;
        &:active {
          background: #b3b3b3;
        }
      }
      .btn-theme {
        background: @theme-color;
        color: #fff;
        border: none;
        text-transform: uppercase;
        &:active {
          background: @btn-hover-color;
        }
      }
      .return_support_notice {
        padding: 13px 10px;
        border: 1px solid #dbdbdb;
        background-color: #ffffff;
        font-size: 13px;
        line-height: 20px;
        color: var(--color-121212);
        &.error {
          border-color: #f00;
        }
        .return_support_checkbox {
          width: 13px;
          margin-right: 4px;
          position: relative;
          top: 2px;
          height: 13px;
          line-height: 13px;
          vertical-align: baseline;
        }
        span {
          font-family: @font-family-500;
        }
        .agree-desc {
          /deep/ a {
            color: @theme-color !important;
          }
        }
      }
    }
  }
  .big-img-overlay {
    position: relative;
    width: 790px;
    height: 566px;
    z-index: 10;
    border: solid 1px var(--color-121212);
    background-color: #fff;
    .layer-close {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 10;
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
    img {
      width: 100%;
    }
  }
  &.from_dialog {
    .custom_size_form {
      max-width: unset;
    }
    .bot-wrap {
      max-width: unset;
    }
  }
}
</style>
