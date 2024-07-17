<template>
  <transition name="fade">
    <div @click.self="closePopup" class="rs-popup">
      <div class="rs-popup-content">
        <section class="rs-left">
          <div class="img-block">
            <img
              :src="require('~/assets/images/default_img.jpg')"
              :data-src="currentProductImageUrl"
              :alt="baseInfo.goodsName"
              class="lazyload"
            />
          </div>
          <p v-html="nl('page_size_recommend_second_text')" @click="clickHere($event)" class="middle-box"></p>
          <div class="privacy">
            <section class="privacy-content">
              <div @click="privacyHide = false" class="privacy-text">
                <az-icon icon-class="size-recommend-privacy"></az-icon>
                {{ nl('page_checkout_phone_subscribe_privacy') }}
              </div>
              <div :class="['privacy-tips', { hide: privacyHide }]">
                <p class="tips-box">
                  <az-icon @click.stop="privacyHide = true" icon-class="icon-icon_style_gallery_off" class="tips-close-icon"></az-icon>
                  {{ nl('page_size_recommend_pravicy_tetx') }}
                </p>
              </div>
            </section>
          </div>
        </section>
        <section class="rs-right">
          <az-icon @click="closePopup" icon-class="icon-icon_style_gallery_off" class="close-icon"></az-icon>
          <h2 class="rs-right-title">{{ nl('page_size_recommend_help_with_sizeing') }}</h2>
          <template v-if="initStatus">
            <div class="size-tips-box">
              <p class="tips-text">
                <span class="currentName">{{ currentShowName }}:</span>
                {{ currentShowDesc }}
              </p>
              <p :class="['tips-img']">
                <img :src="addWebpSuffix(tipsImgs[current.key])" :alt="current.name" />
              </p>
            </div>
            <div class="size-recommend-input">
              <div class="input-ul">
                <section v-for="(customItem, index) in customSizeList" :key="index" class="input-li">
                  <p class="label-text">{{ customItem.name }}:</p>
                  <div class="input-box">
                    <input
                      v-model.number="customListForm[customItem.key]"
                      :placeholder="getDescTitle(customItem)"
                      @focus="inputFocus(customItem, index, $event)"
                      @blur="inputBlur(customItem.key)"
                      @input="inputChange(customItem.key)"
                      :class="{ error: customListFormResult[customItem.key] }"
                      type="text"
                    />
                    <span class="unit">(in)</span>
                    <p v-if="customListFormResult[customItem.key]" class="error-text">{{ customListFormResult[customItem.key] }}</p>
                  </div>
                </section>
              </div>
              <div class="img-block">
                <img :src="addWebpSuffix(tipsThumb)" alt="tips thumb" />
              </div>
            </div>
            <div
              :class="['confirm-btn', { active: confirmActive }]"
              v-track.viewOnce.click="{
                id: 'helpmysize-confirm',
                common: getCommonParam('confirm')
              }"
              @click="confirmCustomSize"
            >
              {{ nl('page_common_confirm') }}
            </div>
          </template>
          <template v-else>
            <div class="size-tips-box has-size">
              <div class="size-tips">
                <div class="tips-text">
                  <p v-for="(item, key, index) in showFormData" :key="index" class="tips-text-item">
                    <label class="label-text">{{ item.name }}:</label>
                    <span class="unit-text">{{ item.value }} {{ unit }}</span>
                  </p>
                </div>
                <div class="tips-img">
                  <img :src="addWebpSuffix(tipsThumb)" alt="tips thumb" />
                </div>
              </div>
              <p v-html="recommendDes" class="please-notice"></p>
            </div>
            <div :class="['has-size-content', { 'no-match': !recommendSizeText }]">
              <p v-if="hint" class="recommend-size-desc">{{ hint }}</p>
              <template v-else-if="recommendSizeText">
                <p class="recommend-text">{{ nl('page_size_recommend_recommend') }}:</p>
                <p class="recommend-size">
                  <az-icon icon-class="size-recommend-has-size-icon"></az-icon>
                  <span class="size">{{ recommendSizeText }}</span>
                </p>
              </template>
              <p v-else class="recommend-text">{{ nl('page_size_recommend_no_match') }}</p>
            </div>
            <div class="has-size-btn">
              <template v-if="recommendSizeText">
                <az-button
                  v-track.viewOnce.click="{
                    id: 'helpmysize-ordersizenow',
                    common: getCommonParam('ordersizenow')
                  }"
                  @click="orderThisSize"
                  class="btn btn-default"
                >
                  {{ nl('page_size_recommend_order_size_now') }}
                </az-button>
                <az-button
                  v-track.viewOnce.click="{
                    id: 'helpmysize-customsize',
                    common: getCommonParam('customsize')
                  }"
                  @click="goCustomSize"
                  class="btn btn-hollow"
                >
                  {{ nl('page_goods_custom_size') }}
                </az-button>
              </template>
              <template v-else>
                <az-button
                  v-track.viewOnce.click="{
                    id: 'helpmysize-customsize',
                    common: getCommonParam('customsize')
                  }"
                  @click="goCustomSize"
                  class="btn btn-default"
                >
                  {{ nl('page_goods_custom_size') }}
                </az-button>
                <az-button
                  v-track.viewOnce.click="{
                    id: 'helpmysize-trybefore',
                    common: getCommonParam('trybefore')
                  }"
                  @click="tryBeforYouBuy"
                  class="btn btn-hollow"
                >
                  {{ nl('page_inspiration_try_on_try_before_you_buy') }}
                </az-button>
              </template>
              <a
                v-track.viewOnce.click="{
                  id: 'helpmysize-startagain',
                  common: getCommonParam('startagain')
                }"
                @click="tryAgain"
                role="button"
                class="start-again"
              >
                {{ nl('page_size_recommend_start_again') }}
              </a>
            </div>
          </template>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
import customSizeMixins from '@/assets/js/customSizeMixins.js'
import AzButton from '@/components/az-ui/Button/AzButton'

export default {
  name: 'RecommendSizePopup',
  languageKeys: [
    'page_size_recommend_second_text',
    'page_checkout_phone_subscribe_privacy',
    'page_size_recommend_pravicy_tetx',
    'page_size_recommend_help_with_sizeing',
    'page_common_confirm',
    'page_size_recommend_recommend',
    'page_size_recommend_no_match',
    'page_size_recommend_order_size_now',
    'page_inspiration_try_on_try_before_you_buy',
    'page_size_recommend_start_again',
    'page_goods_custom_size',
    'page_customsize_tip_min',
    'page_customsize_jbd_tip_for',
    'page_customsize_tip_for',
    'page_common_length_inches',
    'page_customsize_tip_max',
    'page_customsize_tip_diff',
    'page_customsize_tip_and',
    'page_customsize_tip_less',
    'page_common_length_inches',
    'page_customsize_tip_or',
    'page_customsize_tip_greater',
    ...customSizeMixins.languageKeys
  ],
  components: {
    AzButton
  },
  mixins: [customSizeMixins],
  props: {
    customSizeInfo: {
      type: Object,
      require: true,
      default: () => {}
    },
    styleInfo: {
      type: Object,
      require: true,
      default: () => {}
    }
  },
  data() {
    return {
      tipsImgs: {
        bust: 'https://cdn-1.azazie.com/upimg/userfiles/aa/e5/6a/90767d2a49b7a8574482e4484dd2e56a.png',
        waist: 'https://cdn-1.azazie.com/upimg/userfiles/aa/ba/8e/faf747bbbeb2ce0397a698e3c859ba8e.png',
        hips: 'https://cdn-1.azazie.com/upimg/userfiles/aa/40/a8/c13a691fefae419974624f2f4c0440a8.png',
        hollow_to_hem: 'https://cdn-1.azazie.com/upimg/userfiles/images/57/4b/1026385622f0352e7e9773c0ced5574b.png'
      },
      tipsThumb: 'https://cdn-1.azazie.com/upimg/userfiles/aa/42/a5/9ca8fc99769c50bfd56f37bb229842a5.png',
      privacyHide: true,
      initStatus: true,
      customListForm: {},
      customListFormResult: {},
      recommendSizeText: null,
      recommendDes: '',
      hint: ''
    }
  },
  computed: {
    customSizeList({ customList }) {
      const tempList = JSON.parse(JSON.stringify(customList))
      const list = tempList
        .map((tempItem) => {
          if (tempItem.key === 'hollow_to_floor') {
            tempItem.key = 'hollow_to_hem'
            tempItem.name = 'hollow to hem'
          }
          return tempItem
        })
        .filter((item) => ['bust', 'waist', 'hips', 'hollow_to_hem'].includes(item.key))
      return list
    },
    currentProductImageUrl({ baseInfo, PIC_PATH }) {
      let imgName = baseInfo.goodsThumb
      if (this.$store.state.product.currentShowImageUrl) {
        imgName = this.$store.state.product.currentShowImageUrl
      }
      return decodeURIComponent(PIC_PATH + 's600/' + imgName)
    },
    tipsImg({ current, measureList }) {
      return measureList[current.key]
    },
    sizeChart({ styleInfo }) {
      return styleInfo.sizeChart || {}
    },
    confirmActive({ customListForm, customListFormResult }) {
      const { bust, hips, hollow_to_hem: hollowToHem, waist } = customListForm
      let flag = true
      for (const key in customListFormResult) {
        if (customListFormResult[key]) {
          flag = false
          break
        }
      }
      return flag && !!bust && !!waist && !!hips && !!hollowToHem
    },
    sizeParams({ unit, sizeChart, customListForm, logicType }) {
      return {
        unit,
        sizeChart,
        customListForm,
        logicType
      }
    },
    logicType({ baseInfo }) {
      let type = 1
      // if ([1002420, 1006376, 1009674, 1004424].includes(baseInfo.goodsId)) {
      //   type = 1
      // }
      if ([1005298].includes(baseInfo.goodsId)) {
        type = 2
      }
      return type
    },
    showFormData({ customSizeList, customListForm }) {
      const tempObj = {}
      customSizeList.forEach((item) => {
        tempObj[item.key] = {
          name: item.name,
          value: customListForm[item.key]
        }
      })
      return tempObj
    },
    size({ styleInfo }) {
      return styleInfo.size || []
    }
  },
  methods: {
    clickHere(e) {
      if (e.target.className === 'middle-box-here') {
        window.open(this.getSupportUrl(`/`, `/`), '_blank')
      }
    },
    closePopup() {
      this.$store.commit('product/setShowRecommendSizePopup', false)
    },
    confirmCustomSize() {
      // todo: 1002420、1006376、1009674、1004424采用逻辑1，1005298采用逻辑2
      this.recommendSizeText = null
      if (this.confirmActive) {
        this.$axios
          .$post('/1.0/product/recommend/custom-size/' + this.baseInfo.goodsId, {
            customSize: this.customListForm
          })
          .then((res) => {
            this.initStatus = false
            if (!Object.keys(res.data).length) {
              this.recommendSizeText = ''
              this.recommendDes = ''
              this.hint = ''
            } else {
              this.recommendSizeText = res.data.name
              this.recommendDes = res.data.recommendWarning
              this.hint = res.data.hint
            }
          })
      }
    },
    getCustomListForm() {
      this.customList.map((item) => {
        const tempItem = JSON.parse(JSON.stringify(item))
        if (tempItem.key === 'hollow_to_floor') tempItem.key = 'hollow_to_hem'
        this.$set(this.customListForm, tempItem.key, '')
        this.$set(this.customListFormResult, tempItem.key, '')
      })
    },
    orderThisSize() {
      this.setOrderSourceFlag('mysize_recommend', true)
      const size = this.size.find((item) => item.key === this.recommendSizeText) || {}
      this.$emit('select-size', size)
      this.$store.commit('product/setCustomStyleId', '')
      // 特殊逻辑 点击大码会显示大码图片
      if (!['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType)) {
        this.$store.commit('product/setPlusSizeView', size.isPlusSizeView)
      }
    },
    goCustomSize() {
      this.setOrderSourceFlag('mysize_custom', true)
      const size = {
        keyStr: 'customSize',
        key: '',
        name: this.nl('page_goods_custom_size'),
        form: { hollow_to_floor: '', height: '', ...JSON.parse(JSON.stringify(this.customListForm)) }
      }
      this.$store.commit('product/setCustomStyleId', 'customStyleId')
      this.$emit('select-size', size)
    },
    tryBeforYouBuy() {
      this.setOrderSourceFlag('mysize_sample', true)
      const { dressType } = this.baseInfo
      const url = this.$store.state.product.sampleUrl
      if (dressType === 'dress' && url) {
        return window.open(url)
      }
      window.open(this.baseInfo.goodsDefaultUrl)
    },
    tryAgain() {
      this.initStatus = true
      this.recommendSizeText = null
      this.current = this.customList[0]
      this.getCustomListForm()
    },
    getCommonParam(el, msg) {
      return {
        ec: 'helpmysize',
        el,
        msg: msg || {}
      }
    },
    // todo: ********* 以下是原customSize逻辑内容 **********
    number(val) {
      const valStr = val + ''
      return /^[0-9]*(\.?)[0-9]*$/.test(valStr.trim())
    },
    inputFocus(obj, index, event) {
      this.current = obj
      this.currentShowName = this.customSizeList[index].name
      this.currentShowDesc = this.size_des_mapping[this.customSizeList[index].key]
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
    getDescTitle(obj) {
      if (obj.key === 'hollow_to_hem') return 'Please enter hollow to hem value!'
      const minKey = this.unit == 'inch' ? 'inch_min' : 'cm_min'
      const maxKey = this.unit == 'inch' ? 'inch_max' : 'cm_max'
      if (obj[minKey] && obj[maxKey]) {
        return `${obj[minKey]} - ${obj[maxKey]}`
      } else if (obj[minKey]) {
        return `>= ${obj[minKey]}`
      } else if (obj[maxKey]) {
        return `<= ${obj[maxKey]}`
      }
    },
    checkAndNotice(key) {
      if (key === 'hollow_to_hem') return
      if (this.customListForm[key] && this.customMaps[key]) {
        this.checkSelfAndNotice()
        this.checkOtherAndNotice()
      }
    },
    // 单个属性
    checkSelfAndNotice() {
      const minKey = this.unit == 'inch' ? 'inch_min' : 'cm_min'
      const maxKey = this.unit == 'inch' ? 'inch_max' : 'cm_max'
      for (const key in this.customMaps) {
        this.$set(this.customListFormResult, key, '')
        const selfItem = this.customMaps[key]
        const minVal = selfItem[minKey]
        const maxVal = selfItem[maxKey]
        if (this.customListForm[key]) {
          if (minVal && this.customListForm[key] < minVal) {
            const underNotice = `${this.nl('page_customsize_tip_min')} ${selfItem.name} ${
              this.baseInfo.catId == 9 ? this.nl('page_customsize_jbd_tip_for') : this.nl('page_customsize_tip_for')
            } ${selfItem.inch_min} ${this.nl('page_common_length_inches').toLowerCase()}.`
            this.customListFormResult[key] = underNotice
          } else if (maxVal && this.customListForm[key] > maxVal) {
            const greaterNotice = `${this.nl('page_customsize_tip_max')} ${selfItem.name} ${
              this.baseInfo.catId == 9 ? this.nl('page_customsize_jbd_tip_for') : this.nl('page_customsize_tip_for')
            } ${selfItem.inch_max} ${this.nl('page_common_length_inches').toLowerCase()}.`
            this.customListFormResult[key] = greaterNotice
          }
        }
      }
    },
    // 属性之间
    checkOtherAndNotice() {
      const minKey = this.unit == 'inch' ? 'inch_min' : 'cm_min'
      const maxKey = this.unit == 'inch' ? 'inch_max' : 'cm_max'
      for (const restrictSizeKey in this.customSizeInfo.other_restrict_info) {
        const restrictSizeItem = this.customSizeInfo.other_restrict_info[restrictSizeKey]
        const keys = restrictSizeItem.key.split('-')
        const names = restrictSizeItem.name.split('-')
        const oneKey = keys[0]
        const otherKey = keys[1]
        if (this.customListForm[oneKey] && this.customListForm[otherKey]) {
          const diffVal = this.customListForm[keys[0]] * 1 - this.customListForm[keys[1]] * 1
          if (diffVal < restrictSizeItem[minKey] || diffVal > restrictSizeItem[maxKey]) {
            let diffNotice = ''
            if (restrictSizeItem[minKey] >= 0) {
              diffNotice = `${this.nl('page_customsize_tip_diff')} ${names[0]} ${this.nl('page_customsize_tip_and')} ${names[1]} ${this.nl(
                'page_customsize_tip_less'
              )} ${restrictSizeItem.inch_min} ${this.nl('page_common_length_inches').toLowerCase()} ${this.nl('page_customsize_tip_or')} ${
                restrictSizeItem.inch_max
              } ${this.nl('page_common_length_inches').toLowerCase()}`
            } else if (diffVal > restrictSizeItem[maxKey]) {
              diffNotice = `${this.nl('page_customsize_tip_diff')} ${names[0]} ${this.nl('page_customsize_tip_and')} ${names[1]} ${this.nl(
                'page_customsize_tip_greater'
              )} ${restrictSizeItem.inch_max} ${this.nl('page_common_length_inches').toLowerCase()}`
            } else {
              diffNotice = `${this.nl('page_customsize_tip_diff')} ${names[1]} ${this.nl('page_customsize_tip_and')} ${names[0]} ${this.nl(
                'page_customsize_tip_greater'
              )} ${Math.abs(restrictSizeItem.inch_min * 1)} ${this.nl('page_common_length_inches').toLowerCase()}`
            }
            this.customListFormResult[oneKey] = diffNotice
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rs-popup {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: @popuy-z-index;
}
.rs-popup-content {
  display: flex;
  font-family: @font-family-500;
  max-width: 830px;
  max-height: 740px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-f9f9f9);
}
.rs-left {
  position: relative;
  padding: 30px;
  width: 210px;
  .img-block {
    font-size: 0;
    img {
      width: 100%;
    }
  }
  .middle-box {
    width: 100%;
    margin-top: 20px;
    padding: 40px 20px;
    background-color: #fff;
    font-size: 13px;
    line-height: 20px;
    color: var(--color-121212);
    box-sizing: border-box;
  }
  .middle-box-here {
    color: @theme-color;
    text-decoration: underline;
  }
  .privacy {
    position: absolute;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    height: 18px;
    line-height: 18px;
    text-align: center;
    .privacy-content {
      position: relative;
      .privacy-text {
        cursor: pointer;
        .az-icon {
          margin-right: 2px;
          font-size: 12px;
        }
      }
      &:hover .privacy-tips {
        display: block;
      }
    }
    .privacy-tips {
      position: absolute;
      bottom: calc(100% + 20px);
      left: 0;
      width: 210px;
      max-height: 200px;
      background-color: #fff;
      padding: 20px;
      border: 1px solid var(--color-121212);
      transform: translateX(calc(-50% + 30px));
      box-sizing: border-box;
    }
    .tips-box {
      position: relative;
      font-size: 13px;
      line-height: 20px;
      color: var(--color-121212);
      text-align: initial;
    }
    .privacy-tips::before {
      position: absolute;
      bottom: 0;
      left: 50%;
      content: '';
      width: 13px;
      height: 13px;
      background-color: #fff;
      border: 1px solid;
      border-left: 0;
      border-top: 0;
      transform: translate(-50%, calc(50% + 1px)) rotate(45deg);
    }
    .tips-close-icon {
      position: absolute;
      top: -15px;
      right: -15px;
      font-size: 10px;
      border: 10px solid transparent;
      cursor: pointer;
    }
  }
}
.rs-right {
  position: relative;
  width: 560px;
  padding: 30px;
  background-color: #fff;
  box-sizing: border-box;
  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    border: 15px solid transparent;
    cursor: pointer;
  }
  .rs-right-title {
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 22px;
    text-transform: uppercase;
    color: var(--color-121212);
  }
  .size-tips-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 170px;
    padding: 10px 20px;
    margin: 15px 0 20px;
    background: var(--color-f9f9f9);
    border: 1px solid var(--color-eeeeee);
    box-sizing: inherit;
    .size-tips {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .please-notice {
      font-size: 13px;
      margin-top: 10px;
      /deep/ span {
        font-family: @font-family-600;
        color: #f00;
      }
    }
  }
  .tips-text {
    max-width: 270px;
    font-size: 13px;
    line-height: 20px;
    color: #666;
    .currentName {
      font-family: @font-family-600;
      color: var(--color-121212);
      text-transform: capitalize;
    }
  }
  .tips-img {
    display: flex;
    justify-content: center;
    width: 180px;
    font-size: 0;
    overflow: hidden;
    transition: all 0.25s ease;
    img {
      width: 100%;
      display: block;
    }
    &.config-height {
      img {
        width: auto;
        height: 150px;
      }
    }
  }
  .has-size {
    flex-direction: column;
    justify-content: flex-start;
    .tips-text-item {
      margin-bottom: 10px;
    }
    .label-text {
      margin-right: 5px;
      font-family: @font-family-600;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-121212);
      text-transform: capitalize;
    }
    .unit-text {
      font-size: 12px;
      line-height: 16px;
    }
    .tips-img {
      width: 281px;
      img {
        display: block;
        width: auto;
        max-height: 234px;
      }
    }
  }
  .size-recommend-input {
    display: flex;
    .input-ul {
      flex: 1;
      max-height: 317px;
      overflow-y: auto;
      .input-li:first-child .label-text {
        margin-top: 0;
      }
      .label-text {
        margin-top: 15px;
        margin-bottom: 10px;
        font-family: @font-family-600;
        line-height: 18px;
        text-transform: capitalize;
      }
      input[type='text'] {
        width: 252px;
        height: 40px;
        margin-right: 10px;
        border: 1px solid #ccc;
        box-sizing: border-box;
      }
      .unit {
        font-size: 12px;
        line-height: 16px;
      }
      .error-text {
        max-width: 262px;
        font-size: 13px;
        line-height: 18px;
        color: @highlight-lightest;
      }
    }
    .img-block {
      width: 190px;
      font-size: 0;
      img {
        width: 100%;
      }
    }
  }
  .has-size-content {
    width: 100%;
    margin-top: -5px;
    // margin-bottom: 78px;
    padding: 30px 5px;
    box-sizing: border-box;
    border: 1px solid transparent;
    .recommend-text {
      font-size: 16px;
      line-height: 22px;
      text-align: center;
    }
    .recommend-size {
      width: max-content;
      margin: 30px auto 0;
      padding: 5px 15px;
      background-color: var(--color-5fa452);
      border-radius: 30px;
      color: #fff;
      text-transform: uppercase;
      .az-icon {
        margin-right: 10px;
        font-size: 12px;
      }
    }
    &.no-match {
      border: unset;
    }
  }
  .has-size-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn {
      width: 350px;
      margin-bottom: 20px;
    }
    .order-size-btn {
      background-color: @theme-color;
      margin-top: 0;
      cursor: pointer;
    }
    .try-before-you-buy {
      height: 38px;
      margin-top: 20px;
      background-color: #fff;
      border: 1px solid @theme-color;
      color: @theme-color;
    }
    .start-again {
      text-align: center;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-121212);
      text-decoration: underline;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .confirm-btn {
    max-width: 352px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin: 30px auto 0;
    font-family: @font-family-600;
    font-size: 14px;
    color: #fff;
    text-transform: uppercase;
    background-color: #ccc;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &.active {
      background-color: @theme-color;
    }
  }
}
.fade-enter-active {
  opacity: 1;
}
.fade-leave-active {
  opacity: 0;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 9px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 30px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background: #ccc;
}
::-webkit-scrollbar-thumb:window-inactive {
  background: #ccc;
}
</style>
<style>
.middle-box-here {
  color: var(--color-121212);
  text-decoration: underline;
  cursor: pointer;
}
</style>
