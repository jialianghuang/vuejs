<template>
  <div class="ticket-form">
    <ul>
      <li>
        <label><em>*</em> {{ nl('page_order_reimburse_store_name') }}:</label>
        <div class="input-box">
          <input
            v-model="formData.storeName"
            :class="{ error: rulesResult.storeName }"
            @focus="resetInput('storeName')"
            @input="handleStoreInput"
            @blur="handleStoreBlur"
            type="text"
            name="storeName"
            maxlength="50"
            class="w2"
          />
          <autocomplete-suggestion
            :visible.sync="showSuggestion"
            :options="suggestions"
            @select="handleAddressSelect"
          ></autocomplete-suggestion>
        </div>
        <p v-show="rulesResult.storeName" class="error-tip">{{ rulesResult.storeName }}</p>
      </li>
      <li>
        <label><em>*</em> {{ nl('page_order_reimburse_store_address') }}:</label>
        <input
          v-model="formData.storeAddress"
          :class="{ error: rulesResult.storeAddress }"
          @focus="resetInput('storeAddress')"
          readonly
          autocomplete="off"
          disableautocomplete
          type="text"
          name="storeAddress"
          maxlength="50"
          class="w2"
        />
        <p v-show="rulesResult.storeAddress" class="error-tip">{{ rulesResult.storeAddress }}</p>
      </li>
      <li>
        <label><em>*</em> {{ nl('page_order_reimburse_store_phone') }}: ({{ nl('page_order_reimburse_store_phone_tip') }})</label>
        <div :class="{ error: rulesResult.storePhone }" class="tel-box">
          <div class="before">
            {{ currentCountry }}
            <em>{{ countryTelPre }}</em>
          </div>
          <input
            v-model="formData.storePhone"
            :maxlength="['US', 'CA'].includes(currentCountry) ? 10 : 60"
            @focus="resetInput('storePhone')"
            @blur="onBlur('storePhone')"
            type="text"
            name="storePhone"
            class="w2"
          />
          <az-icon v-if="rulesPassResult.storePhone" icon-class="icon-right" class="icon-right" />
        </div>
        <p v-show="rulesResult.storePhone" class="error-tip">{{ rulesResult.storePhone }}</p>
      </li>
      <li>
        <label><em>*</em> {{ nl('page_order_reimburse_work_select') }}:</label>
        <az-select
          :options="workOptions"
          :defaultValue="formData.workType"
          @on-change="handleSelectChange"
          :width="700"
          :height="40"
        ></az-select>
        <input
          v-if="formData.workType == 5"
          v-model="formData.workTypeName"
          :class="{ error: rulesResult.workTypeName }"
          @focus="resetInput('workTypeName')"
          type="text"
          name="workTypeName"
          maxlength="100"
          class="w2"
        />
        <p v-show="rulesResult.workTypeName" class="error-tip">{{ rulesResult.workTypeName }}</p>
      </li>
      <li>
        <label
          ><em>*</em> {{ nl('page_order_reimburse_total_expense') }}:
          <az-icon @click="showRefundFee()" class="icon-question" icon-class="icon-gwc-_question_" />
        </label>
        <input
          v-model="formData.totalExpense"
          :class="{ error: rulesResult.totalExpense }"
          @focus="resetInput('totalExpense')"
          type="text"
          name="totalExpense"
          maxlength="100"
          class="w2"
        />
        <p v-show="rulesResult.totalExpense" class="error-tip">{{ rulesResult.totalExpense }}</p>
      </li>
      <li>
        <label><em>*</em> {{ nl('page_refund_receipt_alteration') }}:</label>
        <az-button :class="{ error: rulesResult.img }" @click="resetInput('img')" class="btn btn-choose-file">
          <img :src="require('~/assets/images/order/camera.png')" class="icon-camera" alt="camera icon" />
          {{ nl('page_gallery_upload_choose_file') }}
          <az-upload-img @upload-img="getUploadImg"></az-upload-img>
        </az-button>
        <p class="refund-note">({{ nl('page_refund_maximum_size') }})</p>
        <div id="show_img" v-if="formData.img">
          <img id="gallery_img" :src="formData.img" alt="gallery" />
          <div @click="deleteImg()" class="layer-close"></div>
        </div>
        <p id="_img_msg" v-show="rulesResult.img" class="error-tip">{{ rulesResult.img }}</p>
      </li>
      <li>
        <label><em>*</em> {{ nl('page_order_reimburse_alterations_score') }}:</label>
        <div class="starx-wrap">
          <az-rate
            :value="formData.starstar"
            :showText="true"
            :textStyle="{ fontSize: '13px', color: '#666', display: 'inline-block', 'vertical-align': 'super', 'margin-top': '5px' }"
            @change="rateChange(arguments)"
            font-size="25px"
          ></az-rate>
        </div>
        <p v-show="rulesResult.starstar" class="error-tip">{{ rulesResult.starstar }}</p>
        <refund-label v-if="labelOptions.length" :options="labelOptions" @select="handleLabelSelect"></refund-label>
      </li>
      <li v-if="formData.starstar">
        <label>{{ nl('page_order_reimburse_comments_option') }}: </label>
        <textarea
          v-model="formData.comments"
          :class="{ error: rulesResult.comments }"
          :placeholder="nl('page_alteration_feedback')"
          @focus="resetInput('comments')"
          class="w2"
          name="comments"
          maxlength="100"
        ></textarea>
      </li>
      <!-- <li>
        <label>{{ nl('page_refund_write_description') }}<em>*</em></label>
        <textarea
          id="_description"
          v-model="formData.description"
          :class="{ error: rulesResult.description }"
          @focus="resetInput('description')"
          class="w2"
          name="description"
          maxlength="200"
        ></textarea>
        <p id="_description_msg" v-show="rulesResult.description" class="error-tip">{{ rulesResult.description }}</p>
      </li> -->
      <li ref="submitButton">
        <az-button :needIcon="false" @click="handleSubmit" :disabled="refundLoadingFlag" class="btn btn-default continue-btn">
          {{ refundLoadingFlag ? `${nl('page_order_progress_processing')}...` : nl('page_common_just_submit') }}
        </az-button>
      </li>
    </ul>
    <popup-address
      v-if="isAddressPopupShow"
      :addressInfo="addressInfo"
      :addressType="1 * 1"
      :popupTitle="nl('page_order_reimburse_store_address')"
      @closeAddressPopup="closeAddressPopup"
      @handleSaveAddress="handleSaveAddress"
      @setSuggestAddress="setSuggestAddress"
      scene="alteration"
    ></popup-address>
    <popup-suggest-address
      :visible.sync="isSuggestAddressPopupShow"
      :list="suggestAddressList"
      :loading="suggestAddressLoading"
      @confirm="confirmAddress"
      @clickEdit="handleSuggestEdit"
      scene="alteration"
    ></popup-suggest-address>
  </div>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import azUploadImg from '@/components/az-ui/UploadImg/AzUploadImg'
import Schema from 'async-validator'
import AzRate from '@/components/az-ui/Rate/AzRate'
import AzSelect from '@/components/az-ui/AzSelect'
import AutocompleteSuggestion from '@/components/order/AutocompleteSuggestion'
import RefundLabel from '@/components/order/RefundLabel'
import PopupAddress from '@/components/checkout/PopupAddress'
import PopupSuggestAddress from '@/components/checkout/PopupSuggestAddress'
import { isElementInViewport } from '@/assets/js/utils'

export default {
  name: 'FormAlterationReimbursement',
  components: { AzButton, azUploadImg, AzRate, AzSelect, AutocompleteSuggestion, PopupAddress, RefundLabel, PopupSuggestAddress },
  props: {
    limitAmount: {
      type: Number,
      default: 0
    },
    refundLoadingFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        storeName: '',
        storeAddress: '',
        storePhone: '',
        workType: '',
        workTypeName: '',
        totalExpense: '',
        img: '',
        starstar: 0,
        comments: ''
        // description: '',
      },
      rulesResult: {
        storeName: '',
        storeAddress: '',
        storePhone: '',
        workTypeName: '',
        totalExpense: '',
        img: '',
        starstar: '',
        comments: ''
        // description: '',
      },
      rulesPassResult: {
        storePhone: false
      },
      uploadList: [],
      showSuggestion: false,
      isAddressPopupShow: false,
      alterationAddress: [], // 所有门店数据
      suggestions: [], // 根据输入内容匹配到的数据，最多十条
      allRefundLabels: [], // 所有星级标签
      labelOptions: [], // 选中星级标签
      suggestAddressLoading: false, // 建议地址操作
      isSuggestAddressPopupShow: false, // 是否展示建议地址
      suggestAddressList: [], // 建议地址列表
      addressInfo: {} // 确认的地址信息，包含省市区街道邮编等
    }
  },
  computed: {
    workOptions() {
      return [
        {
          key: 1,
          name: this.nl('page_order_reimburse_work_option1')
        },
        {
          key: 2,
          name: this.nl('page_order_reimburse_work_option2')
        },
        {
          key: 3,
          name: this.nl('page_order_reimburse_work_option3')
        },
        {
          key: 4,
          name: this.nl('page_order_reimburse_work_option4')
        },
        {
          key: 5,
          name: this.nl('page_email_others')
        }
      ]
    },
    // 当前应该使用的国家code，如果url中存在订单国家code，就是用订单国家code，否则网站环境国家code
    currentCountry() {
      const res = this.$route.query.order_country_code
      return res || this.country
    },
    countryTelPre() {
      // 国家对应的电话前缀
      let telPre = '+1'
      switch (this.currentCountry) {
        case 'AU':
          telPre = '+61'
          break
        case 'GB':
          telPre = '+44'
          break
        case 'FR':
          telPre = '+33'
          break
        case 'MX':
          telPre = '+52'
          break
        case 'ES':
          telPre = '+34'
          break
        case 'DE':
          telPre = '+49'
          break
        case 'IT':
          telPre = '+39'
          break
        case 'IE':
          telPre = '+353'
          break
        case 'BE':
          telPre = '+32'
          break
        case 'NL':
          telPre = '+31'
          break
        case 'SE':
          telPre = '+46'
          break
        case 'AT':
          telPre = '+43'
          break
        case 'FI':
          telPre = '+358'
          break
        case 'DK':
          telPre = '+45'
          break
        default:
          telPre = '+1'
          break
      }
      return telPre
    }
  },
  mounted() {
    const rules = {
      hasSpace(val) {
        return / /.test(val.toString().trim())
      },
      fixedLength(val, checks) {
        return val.toString().trim().length == checks.fixedLength
      },
      maxLength(val, checks) {
        return val.toString().trim().length <= checks.maxLength
      },
      minLength(val, checks) {
        if (checks.name == 'tel') {
          return (
            val
              .toString()
              .replace(/[^0-9]/gi, '')
              .trim().length >= checks.minLength
          )
        } else {
          return val.toString().trim().length >= checks.minLength
        }
      },
      tel(val, checks) {
        return (
          /^[\d-\s]{1,20}$/.test(val) &&
          val
            .toString()
            .trim()
            .replace(/[\s]+/g, ' ').length <= checks.maxLength
        )
      },
      number(val) {
        return /^[0-9]+$/.test(val.toString().trim())
      },
      letter(val) {
        return /^[a-zA-Z]+$/.test(val.toString().trim())
      },
      notPobox(val, source) {
        const addressVal = val
          .toString()
          .replace(/\./g, '')
          .replace(/[ ]/g, '')
          .toLowerCase()
        const poAddress1 = addressVal.includes('pobox')
        const poAddress2 = addressVal.includes('p.o.box')
        const except1 = addressVal.includes('apo')
        const except2 = addressVal.includes('fpo')
        const except3 = addressVal.includes('dpo')
        const except4 = addressVal.includes('armedforces')
        // billing address 不做pobox限制
        return (!poAddress1 && !poAddress2) || except1 || except2 || except3 || except4 || source == 'billing'
      }
    }
    const amountCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.nl('page_order_reimburse_validate_total_expense')))
      } else if (!rules.number(value)) {
        callback(new Error(this.nl('page_js_reimbursement_num')))
      } else if (value > this.limitAmount) {
        callback(new Error(this.nl('page_js_reimbersement_over')))
      } else {
        callback()
      }
    }
    const starCheck = (rule, value, callback) => {
      if (!value || value <= 0) {
        callback(new Error(this.nl('page_order_reimburse_validate_alterations_score')))
      } else {
        callback()
      }
    }
    const telCheck = (rule, value, callback) => {
      if (!rules.number(value)) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      }
      if (['AU', 'GB', 'FR', 'MX', 'DE', 'IT'].includes(this.currentCountry)) {
        // 不检验长度
        callback()
      }

      // ES 9位数
      else if (['ES'].includes(this.currentCountry)) {
        if (!rules.fixedLength(value, { fixedLength: 9, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num')))
        } else {
          callback()
        }
      }
      // DK 8位数
      else if (['DK'].includes(this.currentCountry)) {
        if (!rules.fixedLength(value, { fixedLength: 8, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num')))
        } else {
          callback()
        }
      }
      // FI 7-11位数
      else if (this.currentCountry == 'FI') {
        if (!rules.minLength(value, { minLength: 7, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else if (!rules.maxLength(value, { maxLength: 11 })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else {
          callback()
        }
      }

      // IE 8-15位数
      else if (this.currentCountry == 'IE') {
        if (!rules.minLength(value, { minLength: 8, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else if (!rules.maxLength(value, { maxLength: 15 })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else {
          callback()
        }
      }
      // NL\BE 9-10位数
      else if (['NL', 'BE', 'SE'].includes(this.currentCountry)) {
        if (!rules.minLength(value, { minLength: 9, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else if (!rules.maxLength(value, { maxLength: 10 })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else {
          callback()
        }
      } else if (!rules.minLength(value, { minLength: 10, name: 'tel' })) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      } else if (!rules.maxLength(value, { maxLength: 11 })) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      } else {
        callback()
      }
    }
    const descriptor = {
      storeName: [{ type: 'string', required: true, message: this.nl('page_order_reimburse_validate_store_name'), trigger: 'blur' }],
      storeAddress: [{ type: 'string', required: true, message: this.nl('page_order_reimburse_validate_store_address'), trigger: 'blur' }],
      storePhone: [
        {
          type: 'string',
          required: true,
          validator: telCheck,
          trigger: 'blur'
        }
      ],
      workTypeName: [{ type: 'string', required: true, message: this.nl('page_order_reimburse_validate_work_select'), trigger: 'blur' }],
      totalExpense: [{ type: 'number', required: true, validator: amountCheck, trigger: 'blur' }],
      img: [{ type: 'string', required: true, message: this.nl('page_js_receipt_requie'), trigger: 'blur' }],
      starstar: [{ type: 'number', required: true, validator: starCheck, trigger: 'blur' }]
      // description: [{ type: 'string', required: true, message: this.nl('page_js_detailed'), trigger: 'blur' }],
    }
    this.validator = new Schema(descriptor)

    this.getAlterationAddress()
    this.getRefundLabels()
  },
  methods: {
    onBlur(name) {
      this.validator.validate(
        {
          ...this.formData
        },
        (errors, fields) => {
          if (errors) {
            if (this.formData[name]) this.rulesPassResult[name] = true
            errors.map((item) => {
              if (name == item.field) {
                this.rulesPassResult[name] = false
              }
              if (!this.rulesResult[item.field] && name == item.field) {
                this.rulesResult[name] = item.message
              }
            })
            return false
          }
        }
      )
    },
    // 建议地址弹框编辑按钮操作
    handleSuggestEdit(i) {
      this.confirmAddress(i)
      this.isAddressPopupShow = true
    },
    // 建议地址弹框确认操作
    confirmAddress(i) {
      const values = this.suggestAddressList[i]
      this.saveAddressInfo(values)
      this.isSuggestAddressPopupShow = false
    },
    // 更新保存addressInfo数据
    saveAddressInfo(e) {
      this.addressInfo = e
      const city = e.city_text || e.cityText
      const province = e.province_text || e.provinceText
      const district = e.district_text || e.districtText
      const signBuilding = e.sign_building || e.signBuilding
      let res = e.address
      if (signBuilding) {
        res = res + ' ' + signBuilding
      }
      if (district) {
        res = res + ', ' + district
      }
      res = res + ', ' + city
      res = res + ', ' + province + ', ' + e.zipcode
      this.formData.storeAddress = res
    },
    // 接口一次性确认地址
    handleSaveAddress(e) {
      this.saveAddressInfo(e)
      this.closeAddressPopup()
    },
    // 当需要确认建议地址弹框时，显示建议地址
    setSuggestAddress(suggestAddressList) {
      this.isAddressPopupShow = false
      this.isSuggestAddressPopupShow = true
      this.suggestAddressList = suggestAddressList
    },
    // 标签选择操作，可以选中，可以取消
    handleLabelSelect(e) {
      for (let i = 0; i < this.labelOptions.length; i++) {
        const ele = this.labelOptions[i]
        if (ele.name === e.name) {
          ele.selected = !ele.selected
          break
        }
      }
    },
    // 获取标签
    getRefundLabels() {
      this.$axios.$get('/1.0/order/refund-label').then((res) => {
        if (res && res.data) {
          this.allRefundLabels = res.data
        }
      })
    },
    // 联想组件数据选择确认
    handleAddressSelect(e) {
      this.addressInfo = e
      this.formData.storeName = e.store_name
      this.formData.storeAddress = e.store_address
    },
    /**
     * 获取所有门店数据
     */
    getAlterationAddress() {
      this.$axios
        .$get('/1.0/alteration-address/get', {
          params: {
            order_country_code: this.$route.query.order_country_code || this.country
          }
        })
        .then((res) => {
          if (res && res.data && Array.isArray(res.data)) {
            this.alterationAddress = res.data
          }
        })
    },
    // 关闭地址弹窗
    closeAddressPopup() {
      this.isAddressPopupShow = false
    },
    // 门店输入失去焦点监听，取消联想组件展示
    handleStoreBlur() {
      // 因为失去焦点操作会在联想组件的点击事件前执行，所以这里要延迟执行失去焦点后的操作
      setTimeout(() => {
        this.showSuggestion = false
      }, 100)
    },
    // 门店输入监听，获取输入内容，根据内容筛选关联门店
    handleStoreInput(e) {
      let value = e.target.value.toLowerCase()
      if (value.length === 0) {
        this.showSuggestion = false
        return
      }
      value = value.replace(/'|‘|’/g, "'")
      const res = []
      // 从所有数据中选出符合匹配项的数据
      this.alterationAddress.forEach((ele) => {
        let storeName = ele.store_name.toLowerCase()
        storeName = storeName.replace(/'|‘|’/g, "'")
        if (storeName.indexOf(value) === 0 && res.length < 10) {
          res.push(ele)
        }
      })
      // 根据store_name进行排序
      res.sort((a, b) => {
        const aName = a.store_name.toLowerCase()
        const bName = b.store_name.toLowerCase()
        if (aName < bName) {
          return -1
        } else if (aName > bName) {
          return 1
        } else {
          return 0
        }
      })
      this.suggestions = res
      if (res.length > 0) {
        this.showSuggestion = true
      }
    },
    handleSelectChange(data) {
      this.formData.workType = data.key
      if (data.key == 5) {
        this.formData.workTypeName = ''
      } else {
        this.formData.workTypeName = data.name
      }
      this.rulesResult.workTypeName = ''
    },
    rateChange(val) {
      this.formData.starstar = val[0]
      const resVal = this.allRefundLabels[val[0]]
      if (resVal) {
        this.labelOptions = resVal.map((ele) => {
          return {
            name: ele,
            selected: false
          }
        })
      }
      // 点击星级，如果submit按钮不在可视区域内，滚动到可视区域
      this.$nextTick(() => {
        const isInView = isElementInViewport(this.$refs.submitButton)
        if (!isInView) {
          this.$refs.submitButton.scrollIntoView(false)
        }
      })
    },
    resetInput(name) {
      if (name) {
        if (name === 'storeAddress') {
          this.isAddressPopupShow = true
        }
        this.rulesResult[name] = ''
        return false
      }
      this.rulesResult = {
        storeName: '',
        storeAddress: '',
        storePhone: '',
        workTypeName: '',
        totalExpense: '',
        img: '',
        starstar: '',
        comments: ''
        // description: '',
      }
    },
    // 获取本地上传图片
    getUploadImg(uploadList) {
      this.uploadList = uploadList
      this.formData.img = uploadList.length > 0 && uploadList[0].url
    },
    deleteImg() {
      this.uploadList = []
      this.formData.img = ''
    },
    showRefundFee() {
      this.$store.commit('order/setRefundFeeLayerShow', true)
    },
    handleSubmit(e) {
      this.resetInput()
      this.validator.validate(
        {
          ...this.formData
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (item.field && !this.rulesResult[item.field]) {
                this.rulesResult[item.field] = item.message
              }
            })
            return false
          }
          const { storeName, storeAddress, storePhone, workType, workTypeName, totalExpense, starstar, comments } = this.formData
          const serviceLabel = []
          this.labelOptions.forEach((ele) => {
            if (ele.selected) {
              serviceLabel.push(ele.name)
            }
          })
          const params = {
            store_name: storeName,
            store_address: storeAddress,
            store_contact: storePhone,
            work_done_by_type: workType,
            work_done_by_name: workTypeName,
            amount: totalExpense,
            service_rate: starstar,
            service_label: serviceLabel.join(','), // 多个标签以逗号分隔
            country: this.addressInfo.country,
            province: this.addressInfo.province,
            province_text: this.addressInfo.province_text || this.addressInfo.provinceText,
            city: this.addressInfo.city || '',
            city_text: this.addressInfo.city_text || this.addressInfo.cityText || '',
            address: this.addressInfo.address,
            sign_building: this.addressInfo.sign_building || this.addressInfo.signBuilding || '',
            district: this.addressInfo.district || '',
            district_text: this.addressInfo.district_text || this.addressInfo.districtText || '',
            zipcode: this.addressInfo.zipcode
          }
          if (comments) params.remark = comments
          const formData = new FormData()
          Object.keys(params).forEach((item) => {
            formData.set(item, params[item])
          })
          formData.append('fileList[]', this.uploadList[0].file)
          this.$emit('saveRefund', formData)
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ #file {
  font-size: 0;
}
.ticket-form {
  margin-top: 20px;
  li {
    margin-bottom: 15px;
    position: relative;
    .input-box {
      width: 700px;
      position: relative;
    }
    .tel-box {
      display: flex;
      height: 40px;
      width: 700px;
      border: 1px solid @border-color;
      position: relative;
      &.error {
        border-color: var(--color-ff0000);
      }
      .before {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 65px;
        font-size: 13px;
        line-height: 18px;
        text-align: center;
        border-right: 1px solid @border-color;
        em {
          margin-left: 3px;
        }
      }
      input {
        flex: 1;
        border: none;
      }
      .icon-right {
        fill: currentColor;
        color: @theme-green;
        padding: 10px;
        position: absolute;
        right: 0;
      }
    }
    input {
      height: 40px;
      box-sizing: border-box;
      &[name='workTypeName'] {
        margin-top: 15px;
      }
    }
  }
  label {
    display: block;
    margin-bottom: 6px;
    font-family: @font-family-600;
    position: relative;
    .icon-question {
      font-size: 12px;
      cursor: pointer;
    }
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
    height: 50px;
  }
  .w2 {
    width: 700px;
  }
  .icon-camera {
    width: 21px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }
  .btn-choose-file {
    border: 1px solid #ccc;
    border-radius: 2px;
    font-size: 13px;
    position: relative;
    padding: 10px 45px;
    font-family: @font-family-600;
    color: var(--color-121212);
    &.error {
      border-color: var(--color-ff0000);
    }
  }
  .refund-note {
    color: #666;
  }
  .continue-btn {
    width: 133px;
  }
  .error-tip {
    display: block;
    color: #f00;
  }
  #show_img {
    width: 166px;
    height: auto;
    margin-top: 10px;
    position: relative;
    img {
      width: 100%;
    }
    .layer-close {
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 10;
      width: 24px;
      height: 24px;
      cursor: pointer;
      background: url(~assets/images/a_sprite_l_20190128.png?5770949) no-repeat 0 -162px;
    }
  }
  .icon-refund-question {
    display: inline-block;
    top: 40px;
    width: 11px;
    height: 11px;
    background-image: url('~assets/images/cal_shippping_fee3.png');
    cursor: pointer;
  }
}
</style>
