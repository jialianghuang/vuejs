<template>
  <div class="partner">
    <main-app :navigation="navigation" :adaptive="true" is-show-subscribe="hide">
      <div class="partner-main clearfix">
        <div class="partner-header">
          <div class="partner-header-des">
            <span>{{ nl('page_partner_join_azazie') }}</span>
            <p>{{ nl('page_partner_retail_partner') }}</p>
          </div>
          <div v-if="scene === 'apply'" class="partner-form">
            <p class="partner-form-title">{{ nl('page_help_menu_deep_partner') }}</p>
            <div ref="partnerForm" class="partner-form-main">
              <az-input
                v-model="form.first_name"
                @blur="handleBlurValidate('first_name')"
                :required="rules.first_name.required"
                :errorMsg="rules.first_name.errorMsg"
                :label="nl('page_common_first_name')"
                class="input-short"
              ></az-input>
              <az-input
                v-model="form.last_name"
                @blur="handleBlurValidate('last_name')"
                :required="rules.last_name.required"
                :errorMsg="rules.last_name.errorMsg"
                :label="nl('page_placeholder_last_name')"
                class="input-short"
              ></az-input>
              <az-input
                v-model="form.email"
                @blur="handleBlurValidate('email')"
                :required="rules.email.required"
                :errorMsg="rules.email.errorMsg"
                :label="nl('page_common_email_address')"
                class="input-short"
              ></az-input>
              <az-input
                v-model="form.phone"
                @blur="handleBlurValidate('phone')"
                :required="rules.phone.required"
                :errorMsg="rules.phone.errorMsg"
                :label="nl('page_email_phone_number')"
                class="input-short"
                type="phone"
              ></az-input>
              <az-input
                v-model="form.store_website"
                @blur="handleBlurValidate('store_website')"
                :required="rules.store_website.required"
                :errorMsg="rules.store_website.errorMsg"
                :label="nl('page_partner_website')"
                class="input-short"
              ></az-input>
              <az-input
                v-model="form.store_name"
                @blur="handleBlurValidate('store_name')"
                :required="rules.store_name.required"
                :errorMsg="rules.store_name.errorMsg"
                :label="nl('page_partner_name_store')"
                class="input-short"
              ></az-input>
              <az-input
                v-model="form.street_address"
                @blur="handleBlurValidate('street_address')"
                :required="rules.street_address.required"
                :errorMsg="rules.street_address.errorMsg"
                :label="nl('page_partner_steet_address')"
              ></az-input>
              <az-input
                v-model="form.city_text"
                @blur="handleBlurValidate('city_text')"
                :required="rules.city_text.required"
                :errorMsg="rules.city_text.errorMsg"
                :label="nl('page_placeholder_city')"
                class="input-short"
              ></az-input>
              <div class="partner-form-state input-short">
                <span class="partner-form-label">{{ nl('page_common_state') }}*</span>
                <az-select
                  :options="ffPRegionList"
                  :defaultValue="form.province"
                  :placeholder="nl('page_common_state_province_region')"
                  @on-change="handleProvinceChange"
                  name="showStateOption"
                ></az-select>
                <p v-if="rules.province.errorMsg" class="partner-form-error-tips">{{ rules.province.errorMsg }}</p>
              </div>
              <az-input
                v-model="form.zipcode"
                @blur="handleBlurValidate('zipcode')"
                :required="rules.zipcode.required"
                :errorMsg="rules.zipcode.errorMsg"
                :label="nl('page_partner_zip_code')"
                class="input-short"
              ></az-input>
              <az-input
                v-model="form.management_brand"
                @blur="handleBlurValidate('management_brand')"
                :required="rules.management_brand.required"
                :errorMsg="rules.management_brand.errorMsg"
                :label="nl('page_partner_which_brands')"
              ></az-input>
              <az-input
                v-model="form.reason"
                @blur="handleBlurValidate('reason')"
                :required="rules.reason.required"
                :errorMsg="rules.reason.errorMsg"
                :label="nl('page_partner_why_interested')"
              ></az-input>
              <az-input
                v-model="form.marketing_plan"
                @blur="handleBlurValidate('marketing_plan')"
                :required="rules.marketing_plan.required"
                :errorMsg="rules.marketing_plan.errorMsg"
                :label="nl('page_partner_how_play')"
              ></az-input>
              <az-input
                v-model="form.store_size"
                @blur="handleBlurValidate('store_size')"
                :required="rules.store_size.required"
                :errorMsg="rules.store_size.errorMsg"
                :label="nl('page_partner_what_size_store')"
              ></az-input>
              <div class="partner-form-upload">
                <span class="partner-form-label">{{ nl('page_parnter_upload_store_photo') }}*</span>
                <az-upload
                  ref="upload"
                  :limit="3"
                  :showVideoBtn="false"
                  :nameList="['fileList[0]', 'fileList[1]', 'fileList[2]']"
                  @success-upload="handleUpload"
                  @on-deleted="handleDeleteUpload"
                ></az-upload>
                <p v-if="rules.store_photo_url.errorMsg" class="partner-form-error-tips">{{ rules.store_photo_url.errorMsg }}</p>
              </div>
              <az-input
                v-model="form.working_age"
                @blur="handleBlurValidate('working_age')"
                :required="rules.working_age.required"
                :errorMsg="rules.working_age.errorMsg"
                :label="nl('page_partner_how_long_work')"
              ></az-input>
              <az-radio
                v-model="form.monthly_sales"
                :options="sellCountOptions"
                :required="rules.monthly_sales.required"
                :errorMsg="rules.monthly_sales.errorMsg"
                :label="nl('page_partner_how_many_sell')"
                name="sellCount"
              ></az-radio>
              <div class="partner-form-checkbox">
                <span class="partner-form-label">{{ nl('page_partner_what_categories') }}*</span>
                <div class="row-flex">
                  <template v-for="(item, index) in interestCatList">
                    <az-checkbox
                      v-if="index < 3"
                      :key="index"
                      :value="item.checked"
                      @onChange="(e) => handleOthersChange(e, index)"
                      class="col1"
                      theme="primary"
                      >{{ item.value }}</az-checkbox
                    >
                  </template>
                </div>
                <div class="row-flex">
                  <az-checkbox
                    :value="interestCatList[3].checked"
                    @onChange="(e) => handleOthersChange(e, 3)"
                    class="col1"
                    theme="primary"
                    >{{ interestCatList[3].value }}</az-checkbox
                  >
                  <div class="col2">
                    <div class="col2-main">
                      <az-checkbox :value="interestCatList[4].checked" @onChange="(e) => handleOthersChange(e, 4)" theme="primary">
                        {{ nl('page_email_others') }}:
                      </az-checkbox>
                      <input
                        ref="othersInput"
                        v-model="interestCatList[4].value"
                        @focus="interestCatList[4].checked = true"
                        @blur="handleInterestCatOtherBlur"
                        aria-label="ohters input"
                        type="text"
                      />
                    </div>
                    <p v-if="validateOtherMsg" class="partner-form-error-tips">{{ validateOtherMsg }}</p>
                  </div>
                </div>
                <p v-if="rules.interest_cat.errorMsg" class="partner-form-error-tips">{{ rules.interest_cat.errorMsg }}</p>
              </div>
              <az-radio
                v-model="form.store_most_popular_size"
                :options="popularSizeOptions"
                :required="rules.store_most_popular_size.required"
                :errorMsg="rules.store_most_popular_size.errorMsg"
                :label="nl('page_partner_most_popular_size')"
                name="popularSize"
              ></az-radio>
            </div>
            <az-button
              v-track.view.click="{ common: { ec: 'retailer', el: 'submitbutton' } }"
              @click="clickSubmit"
              :class="{ disabled: btnLoading }"
              class="btn btn-theme"
            >
              {{ btnLoading ? nl('page_common_open') : nl('page_v7_goods_submit') }}
            </az-button>
            <p v-if="errorMsg" class="partner-form-error-tips">{{ errorMsg }}</p>
          </div>
          <div v-else class="partner-header-main">
            <img v-if="scene === 'success'" src="../../assets/images/partner/icon_success.svg" alt="success" />
            <img v-else src="../../assets/images/partner/icon_warn.svg" alt="warn" />
            <span class="scene-title">{{ scene === 'success' ? nl('page_login_login_success') : nl('page_common_sorry') }}!</span>
            <p class="scene-des">
              {{ scene === 'success' ? nl('page_partner_apply_success') : nl('page_partner_apply_sorry') }}
            </p>
            <az-button
              v-if="scene === 'success'"
              v-track.click="{ common: { ec: 'retailer', el: 'shopdressesbutton' } }"
              @click="clickShopDress"
              class="btn btn-theme"
            >
              {{ nl('page_header_shop_dresses') }}
            </az-button>
            <az-button v-else @click="clickShopDress" class="btn btn-theme">
              {{ nl('page_header_shop_dresses') }}
            </az-button>
          </div>
        </div>
        <div v-if="scene != 'sorry'" class="partner-des">
          <div class="partner-des-left">
            <p>
              {{ nl('page_partner_description1') }}
            </p>
            <p>
              {{ nl('page_partner_description2') }}
            </p>
            <p>{{ nl('page_partner_description3') }}</p>
            <ul>
              <li>
                <az-icon icon-class="icon-lby_tick_white_s" />
                <p>{{ nl('page_partner_description4') }}</p>
              </li>
              <li>
                <az-icon icon-class="icon-lby_tick_white_s" />
                <p>{{ nl('page_partner_description5') }}</p>
              </li>
              <li>
                <az-icon icon-class="icon-lby_tick_white_s" />
                <p>{{ nl('page_partner_description6') }}</p>
              </li>
              <li>
                <az-icon icon-class="icon-lby_tick_white_s" />
                <p>{{ nl('page_partner_description7') }}</p>
              </li>
              <li>
                <az-icon icon-class="icon-lby_tick_white_s" />
                <p>{{ nl('page_partner_description8') }}</p>
              </li>
            </ul>
            <p v-html="nl('page_partner_description10')"></p>
          </div>
          <div class="partner-des-right">
            <img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/e9/1c/41fe5de6c34ffef5cd81d134e5aee91c.png')"
              alt="partner"
            />
          </div>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
// import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import AzInput from '@/components/az-ui/AzInput'
import AzRadio from '@/components/az-ui/AzRadio'
import AzSelect from '@/components/az-ui/AzSelect'
import AzCheckbox from '@/components/az-ui/AzCheckbox'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzUpload from '@/components/az-ui/Upload/AzUpload'

/**
 * 零售商申请页面
 */
export default {
  name: 'Partner',
  components: {
    MainApp,
    AzInput,
    AzRadio,
    AzSelect,
    AzCheckbox,
    AzButton,
    AzUpload
  },
  data() {
    return {
      scene: 'apply', // 操作场景，默认申请apply，成功success，不支持sorry
      btnLoading: false, // 点击submit，置为true
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        store_website: '',
        store_name: '',
        street_address: '',
        city_text: '',
        province: '',
        zipcode: '',
        management_brand: '',
        reason: '',
        marketing_plan: '',
        store_size: '',
        store_photo_url: [],
        working_age: '',
        monthly_sales: '',
        interest_cat: '',
        store_most_popular_size: ''
      },
      sellCountOptions: [
        { label: '<50', value: 1 },
        { label: '50-100', value: 2 },
        { label: '>100', value: 3 }
      ],
      interestCatList: [
        {
          checked: false,
          value: 'Pnina Tornai for Azazie'
        },
        {
          checked: false,
          value: 'Bridesmaids'
        },
        {
          checked: false,
          value: 'Bridal/ wedding dresses'
        },
        {
          checked: false,
          value: 'Mother of the Bride'
        },
        {
          checked: false,
          value: ''
        }
      ],
      popularSizeOptions: [
        { label: '0-6', value: 1 },
        { label: '7-10', value: 2 },
        { label: '11-13', value: 3 },
        { label: '13+', value: 4 }
      ],
      ffPRegionList: [], // 省份列表数据
      // form内容对应的校验
      rules: {
        first_name: {
          required: true,
          errorMsg: ''
        },
        last_name: {
          required: true,
          errorMsg: ''
        },
        email: {
          required: true,
          errorMsg: '',
          type: 'email'
        },
        phone: {
          required: true,
          errorMsg: ''
        },
        store_website: {
          required: true,
          errorMsg: ''
        },
        store_name: {
          required: true,
          errorMsg: ''
        },
        street_address: {
          required: true,
          errorMsg: ''
        },
        city_text: {
          required: true,
          errorMsg: ''
        },
        province: {
          required: true,
          errorMsg: ''
        },
        zipcode: {
          required: true,
          errorMsg: ''
        },
        management_brand: {
          required: true,
          errorMsg: ''
        },
        reason: {
          required: true,
          errorMsg: ''
        },
        marketing_plan: {
          required: true,
          errorMsg: ''
        },
        store_size: {
          required: true,
          errorMsg: ''
        },
        store_photo_url: {
          required: true,
          type: 'array',
          errorMsg: ''
        },
        working_age: {
          required: true,
          errorMsg: ''
        },
        monthly_sales: {
          required: true,
          errorMsg: ''
        },
        interest_cat: {
          required: true,
          errorMsg: ''
        },
        store_most_popular_size: {
          required: true,
          errorMsg: ''
        }
      },
      validateOtherMsg: '', // 应产品需求，针对other输入内容的单独校验提示
      errorMsg: '' // 接口返回错误提示
    }
  },
  asyncData(context) {
    try {
      // context.redirect(302, '/ambassador-program')
      // return
      // const commonAsyncData = await init(context)
      // if (!commonAsyncData) return
      // context.store.commit('setJsKey', 'partner')
      // return {
      //   ...commonAsyncData
      // }
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
  created() {
    // 目前仅us展示申请
    if (this.country != 'US') {
      this.scene = 'sorry'
    }
  },
  mounted() {
    this.getSubRegion()
  },
  methods: {
    /**
     * 输入框失去焦点，校验
     */
    handleBlurValidate(key) {
      if (this.rules[key]) {
        if (this.rules[key].required) {
          // 如果必填，并且对应值为空值
          if ((this.rules[key].type === 'array' && !this.form[key].length) || (this.rules[key].type !== 'array' && !this.form[key])) {
            this.rules[key].errorMsg = this.nl('page_please_enter_valid_value')
            return false
          } else if (this.rules[key].type === 'email' && !this.emailFormCheck(this.form[key])) {
            // 校验邮箱格式
            this.rules[key].errorMsg = this.nl('page_email_enter_valid')
            return false
          }
        }
        // 校验通过后，清空errorMsg
        this.rules[key].errorMsg = ''
      }
      return true
    },
    /**
     * 获取当前国家的省份数据
     */
    getSubRegion() {
      // 加上ff_id后，接口返回的参数regionList变成了ffRegionList
      this.$axios.$post('/1.0/address-suggest/fetch-sub-region?order_country_code=' + this.country + '&ff_id=3859').then((res) => {
        if (res.data && res.data.res && res.data.res.ffRegionList) {
          this.ffPRegionList = res.data.res.ffRegionList.map((ele) => {
            return {
              name: ele.regionNameLocal,
              value: ele.ffRegionId,
              key: ele.regionId
            }
          })
        }
      })
    },
    /**
     * 省份选择操作，获取选择结果
     */
    handleProvinceChange(e) {
      this.form.province = e.key
    },
    /**
     * 处理others checkbox修改操作，同步控制对应input聚焦和失焦
     */
    handleOthersChange(e, i) {
      if (e) {
        // 只要有选中值，就清空对应报错提示
        this.rules.interest_cat.errorMsg = ''
      }
      this.interestCatList[i].checked = e
      if (i === 4) {
        if (e) {
          this.$refs.othersInput.focus()
        } else {
          // 清空对应内容
          this.interestCatList[4].value = ''
          // 清空错误提示
          this.validateOtherMsg = ''
        }
      }
    },
    /**
     * Others内容输入操作，同步修改对应的checkbox
     */
    handleInterestCatOtherBlur() {
      // 在点击checkbox的时候，input的blur先于handleOthersChange方法执行，因此会有显示冲突
      // 添加定时延迟处理
      setTimeout(() => {
        if (this.interestCatList[4].checked && !this.interestCatList[4].value) {
          this.validateOtherMsg = this.nl('page_please_enter_valid_value')
        } else {
          this.validateOtherMsg = ''
        }
      }, 300)
    },
    /**
     * 选择图片后上传
     */
    handleUpload() {
      this.$axios.$post(`/1.0/image/upload/retailer`, this.$refs.upload.upload()).then((res) => {
        if (res.data && res.data.images) {
          this.form.store_photo_url = res.data.images.map((ele) => {
            return ele.imgUrl
          })
          // 重新校验该项，将已有的报错提示取消
          this.handleBlurValidate('store_photo_url')
        }
      })
    },
    /**
     * 删除已选择的图片
     */
    handleDeleteUpload(e) {
      if (!e.list.length) {
        this.form.store_photo_url = []
      } else {
        // e.index为删除项的索引
        this.form.store_photo_url.splice(e.index, 1)
      }
    },
    /**
     * 点击submit，提交输入的内容
     */
    clickSubmit() {
      this.btnLoading = true
      let hasValidated = true
      // 校验多选条目
      const tempInterestCat = []
      this.interestCatList.forEach((ele) => {
        if (ele.checked) {
          if (ele.value) {
            tempInterestCat.push(ele.value)
          } else {
            hasValidated = false
          }
        }
      })
      // 多选校验不通过，直接中止
      if (!hasValidated) {
        this.btnLoading = false
        return
      }
      if (tempInterestCat.length > 0) {
        this.form.interest_cat = tempInterestCat.join(',')
      } else {
        this.form.interest_cat = ''
      }
      let idx = 0
      for (const key in this.form) {
        hasValidated = this.handleBlurValidate(key)
        if (!hasValidated) {
          // 根据错误项的索引，确定需要上滚的基数值
          if (idx < 3) {
            idx = 0
          } else if (idx < 6) {
            idx = 1
          } else if (idx === 6) {
            idx = 2
          } else if (idx < 10) {
            idx = 3
          } else if (idx < 14) {
            idx = idx - 6
          }
          // 如果有校验错误项，滚动页面到错误输入项
          this.$refs.partnerForm.scrollTop = 78 * idx
          break
        }
        idx++
      }
      // 校验通过后，调用零售商申请接口
      if (hasValidated) {
        this.$axios.$post('/1.0/retailer-apply', this.form).then((res) => {
          this.btnLoading = false
          if (res.code === 0) {
            this.scene = 'success'
            this.buryPoint(this, 'event', {
              ec: 'retailer',
              el: 'shopdressesbutton',
              ea: 'view'
            })
          } else {
            this.errorMsg = res.msg
          }
        })
      } else {
        // 针对others的单独处理，两个错误提示都存在时，显示选项输入框的提示
        if (this.rules.interest_cat.errorMsg && this.validateOtherMsg) {
          this.rules.interest_cat.errorMsg = ''
        }
        this.btnLoading = false
      }
    },
    /**
     * 点击shop dress
     */
    clickShopDress() {
      window.location.href = this.countryUrl('/all/bridesmaids-bridal-party')
    }
  }
}
</script>

<style lang="less" scoped>
.partner {
  min-width: 1263px;
  &-header {
    height: 683px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('https://cdn-1.azazie.com/upimg/userfiles/images/ec/8d/ad117c21219794a153b8b0489a2bec8d.jpg') no-repeat center;
    background-size: cover;
    &-des {
      font-family: @font-Ivy-Mode-400;
      font-style: normal;
      font-weight: 400;
      font-size: 28px;
      line-height: 35px;
      color: #fff;
      margin-right: 56px;
      p {
        font-size: 48px;
        line-height: 60px;
      }
    }
    &-main {
      padding: 40px;
      background: #fff;
      width: 615px;
      height: 503px;
      text-align: center;
      color: var(--color-121212);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 60px;
        height: 60px;
      }
      .scene-title {
        font-family: @font-family-500;
        font-size: 24px;
        line-height: 33px;
        text-transform: uppercase;
        margin-top: 15px;
        margin-bottom: 30px;
      }
      .scene-des {
        width: 520px;
        font-size: 16px;
        line-height: 26px;
        margin-bottom: 30px;
      }
      .btn {
        width: 190px;
        height: 40px;
        font-weight: 600;
      }
    }
  }
  &-form {
    padding: 40px;
    background: #fff;
    width: 42%;
    max-width: 600px;
    min-width: 500px;
    &-main {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      height: 375px;
      overflow-y: scroll;
    }
    &-title {
      font-family: @font-Ivy-Mode-400;
      font-style: normal;
      font-weight: 400;
      font-size: 28px;
      line-height: 35px;
      text-transform: uppercase;
      color: var(--color-121212);
      margin-bottom: 15px;
    }
    .az-input,
    .az-radio,
    &-upload {
      width: 100%;
      margin-bottom: 15px;
    }
    &-upload {
      /deep/ .az-upload-box {
        padding-top: 10px;
      }
    }
    &-label {
      line-height: 18px;
      font-family: @font-family-600;
      font-style: normal;
    }
    &-state {
      > div {
        margin-top: 5px;
      }
      /deep/ .az-select-main {
        width: 100% !important;
      }
    }
    .input-short {
      width: 32%;
    }
    &-checkbox {
      width: 100%;
      .row-flex {
        display: flex;
        &:last-of-type {
          margin-bottom: 6px;
        }
        /deep/ input[type='checkbox'] {
          width: 15px;
          height: 15px;
        }
        .col1 {
          flex: 1;
        }
        .col2 {
          flex: 2;
          &-main {
            display: flex;
            align-items: center;
          }
          input {
            flex: 1;
            margin-left: 10px;
            border: none;
            border-bottom: 1px solid #ccc;
            padding: 0px 5px;
          }
          .partner-form-error-tips {
            margin-top: 0;
          }
        }
      }
    }
    &-error-tips {
      color: red;
      margin-top: 5px;
    }
    .btn {
      width: 190px;
      height: 40px;
      margin-top: 16px;
      font-weight: 600;
      &.disabled {
        background: #f1d9dc;
      }
    }
  }
  &-des {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-121212);
    font-size: 16px;
    line-height: 26px;
    &-left {
      width: 47%;
      max-width: 674px;
      min-width: 560px;
      margin-right: 65px;
      > p {
        width: 669px;
        margin-bottom: 10px;
        /deep/ a {
          color: var(--color-121212);
        }
      }
      ul {
        margin-bottom: 10px;
        li {
          margin-bottom: 5px;
          line-height: 24px;
          display: flex;
          align-items: center;
          .az-icon {
            font-size: 12px;
            margin-right: 10px;
          }
          p {
            flex: 1;
          }
        }
      }
    }
    &-right {
      img {
        width: 558px;
        height: 673px;
        display: block;
      }
    }
  }
}
@media screen and (max-width: 1262px) {
  .adaptive-box {
    .partner-header-des {
      font-size: 22px;
      p {
        font-size: 38px;
      }
    }
    .partner-des-left {
      margin-right: 20px;
      > p {
        width: 100%;
      }
    }
  }
}

@media screen and (max-width: 1444px) {
  .adaptive-box {
    .partner-des-left {
      margin-right: 20px;
    }
  }
}
</style>
