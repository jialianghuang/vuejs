<template>
  <div class="student-discount">
    <main-app :navigation="navigation">
      <div class="student-discount-content clearfix help-menu-outbox">
        <help-menu :currentMenuTitle="currentMenuTitle" :helpMenu="helpMenu" v-if="helpMenu && Object.keys(helpMenu).length"></help-menu>
        <div class="content">
          <h1 class="title">{{ contents.title }}</h1>
          <div v-if="isSuccess" class="success-dec">
            <div class="success-content">
              <svg viewBox="0 0 1024 1024" class="succ-icon">
                <path
                  d="M511.99429 0C229.224075 0 0 229.224075 0 511.99429S229.224075 1023.98858 511.99429 1023.98858 1023.98858 794.764506 1023.98858 511.99429 794.764506 0 511.99429 0zM810.786096 349.071963L436.728218 723.129841a33.504879 33.504879 0 0 1-2.866301 2.557973 34.258567 34.258567 0 0 1-45.89506-2.283904l-174.718694-174.718694a34.258567 34.258567 0 0 1 0-48.453034 34.258567 34.258567 0 0 1 48.441614 0l150.532145 150.497887 350.122559-350.11114a34.258567 34.258567 0 0 1 48.441615 0 34.258567 34.258567 0 0 1 0 48.453034z"
                  p-id="16830"
                ></path>
              </svg>
              <p v-html="nl('page_student_discount_success')" class="tip-success"></p>
            </div>
          </div>
          <form id="student_discount_form" v-else onsubmit="return false">
            <div :class="{ error: rulesResult.firstName }" class="control-group flex">
              <div class="int-box">
                <input
                  ref="firstName"
                  v-model="formData.firstName"
                  @focus="resetInput('firstName')"
                  :placeholder="nl('page_placeholder_first_name')"
                  type="text"
                  maxlength="96"
                />
                <div class="help-inline">{{ rulesResult.firstName }}</div>
              </div>
              <div class="int-box">
                <input
                  ref="lastName"
                  :placeholder="nl('page_placeholder_last_name')"
                  v-model="formData.lastName"
                  @focus="resetInput('lastName')"
                  type="text"
                  maxlength="96"
                />
                <div class="help-inline">{{ rulesResult.lastName }}</div>
              </div>
            </div>
            <div :class="{ error: rulesResult.email }" class="control-group">
              <div class="int-box">
                <input
                  ref="sutdentEmail"
                  :placeholder="nl('page_common_email_address')"
                  v-model="formData.email"
                  @focus="resetInput('email')"
                  @blur="onBlurEmail"
                  type="email"
                  maxlength="96"
                />
                <AzEmailDomain
                  :show="emailDomainShow"
                  :origin-email="formData.email"
                  @domain-handler="(value) => (formData.email = value)"
                />
                <div class="help-inline">{{ rulesResult.email }}</div>
              </div>
            </div>

            <div :class="{ error: rulesResult.categories }" class="control-group">
              <div class="interested-box">
                <div class="interested-title">{{ nl('page_common_new_user_role_title') }}</div>
                <Interested @on-change="interestedChange" />
                <div v-if="categoriesError" class="help-inline">{{ categoriesError }}</div>
              </div>
            </div>

            <div class="control-group">
              <AzDatePicker @on-date-picker="(e) => (date = e)" />
            </div>

            <div :class="{ error: rulesResult.uploadList }" class="control-group">
              <label>{{ nl('page_student_discount_school_id_photo') }}:</label>
              <div class="int-box">
                <div
                  @click="resetInput('uploadList')"
                  :class="{ 'hide-upload-btn': formData.uploadList.length >= 1 }"
                  class="btn btn-choose-file"
                >
                  <az-upload
                    ref="upload"
                    :nameList="['fileList[0]']"
                    :showVideoBtn="false"
                    :limit="1"
                    @success-upload="setUploadImg"
                  ></az-upload>
                </div>
                <p class="img-tips">{{ nl('page_student_discount_school_id_photo_tips') }}</p>
                <div class="help-inline">{{ rulesResult.uploadList }}</div>
              </div>
            </div>

            <div class="control-group">
              <div>
                <a id="agreement_protocol" @click="showPop()" tabindex="0" role="button">{{
                  nl('page_student_discount_terms_and_conditions')
                }}</a>
                <az-button
                  :loading="loading"
                  :disabled="loading"
                  :needIcon="false"
                  @click="handleSubmit"
                  class="btn btn-default btn-submit"
                  tabindex="4"
                  >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_common_just_submit') }}</az-button
                >
                <p class="az-privacy-item">
                  <span>{{ nl('page_common_submit_az_text') }}</span>
                  <a :href="countryUrl(`/terms-of-use`)" target="_blank">
                    <span>{{ nl('page_common_help_terms_of_use') }}</span> </a
                  >&#44;
                  <a
                    @click="hrefPoint('privacypolicy')"
                    :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))"
                    class="az-link"
                    target="_blank"
                  >
                    {{ nl('page_sitemap_privacy') }}
                  </a>
                  <span>{{ nl('page_common_and') }}</span>
                  <a
                    :href="countryUrl('https://privacy.azazie.com/privacy-policy#notice-of-financial-incentive')"
                    class="az-link truevault-polaris-privacy-notice"
                    target="_blank"
                    >{{ nl('page_common_financial_incentive') }}.
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>

    <div v-if="contents.terms && Object.keys(contents.terms).length && showTermsPop" class="terms-layer">
      <az-popup-layer :lockScroll="true" :z-index="12" @close="handleTermsIntro" :title="contents.terms.title" width="540px" height="auto">
        <div class="terms-layer-box">
          <div class="terms-container">
            <p v-html="contents.terms.text"></p>
          </div>
        </div>
      </az-popup-layer>
    </div>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import HelpMenu from '@/components/common/HelpMenu'
import AzButton from '@/components/az-ui/Button/AzButton'
import Schema from 'async-validator'
import AzUpload from '@/components/az-ui/Upload/AzUpload'
import formValidatorType from '@/assets/js/formValidatorType'
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import Interested from '@/components/common/Interested'
import AzDatePicker from '@/components/az-ui-new/AzDatePicker'
import AzEmailDomain from '@/components/az-ui-new/AzEmailDomain'
import checkEmailDomain from '@/assets/js/checkEmailDomain'

export default {
  name: 'StudentDiscount',
  components: {
    MainApp,
    backToTop,
    HelpMenu,
    AzButton,
    AzUpload,
    AzPopupLayer,
    AzDatePicker,
    Interested,
    AzEmailDomain
  },
  mixins: [checkEmailDomain],
  data() {
    return {
      currentMenuTitle: this.nl('page_student_discount_title'),
      accountMenu: {},
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        categories: '',
        uploadList: []
      },
      rulesResult: {
        firstName: '',
        lastName: '',
        email: '',
        categories: '',
        uploadList: ''
      },
      loading: false,
      isSuccess: false,
      showTermsPop: false,
      date: '',
      categoriesError: ''
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/help/student-discount`)
      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }
      context.store.commit('setJsKey', 'student_discount')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        helpMenu: res.data.helpMenu || {},
        contents: res.data.contents || {}
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
      hasSpace(val) {
        return / /.test(val.trim())
      },
      minLength(val, checks) {
        if (checks.name == 'tel') {
          return val.replace(/[^0-9]/gi, '').trim().length >= checks.minLength
        } else {
          return val.trim().length >= checks.minLength
        }
      }
    }
    const firstNameCheck = (rule, value, callback) => {
      if (!rules.minLength(value, { minLength: 2 })) {
        callback(new Error(this.nl('page_pay_minimum_2')))
      } else {
        callback()
      }
    }
    const lastNameCheck = (rule, value, callback) => {
      if (!rules.minLength(value, { minLength: 2 })) {
        callback(new Error(this.nl('page_pay_minimum_2')))
      } else {
        callback()
      }
    }

    const descriptor = {
      firstName: [{ type: 'string', required: true, validator: firstNameCheck, trigger: 'blur' }],
      lastName: [{ type: 'string', required: true, validator: lastNameCheck, trigger: 'blur' }],
      email: formValidatorType.email({
        required: this.nl('page_student_email_empty_tips'),
        validator: this.nl('page_student_email_error_tips')
      }),
      categories: [{ type: 'array', required: true, message: this.nl('page_common_new_user_role_error'), trigger: 'blur' }],
      uploadList: [{ type: 'array', required: true, message: this.nl('page_student_photo_error_tips'), trigger: 'blur' }]
    }
    this.validator = new Schema(descriptor)
  },
  methods: {
    resetInput(name) {
      if (name == 'email') {
        this.initEmailCheckDomain()
      }
      if (name) {
        this.rulesResult[name] = ''
        return false
      }
      this.rulesResult = {
        description: '',
        amount: '',
        uploadList: ''
      }
    },
    setUploadImg() {
      this.formData.uploadList = this.$refs.upload.fileList
    },
    handleSubmit(e) {
      this.resetInput()
      this.categoriesError = this.formData.categories.length > 0 ? '' : this.nl('page_common_new_user_role_error')
      this.validator.validate(
        {
          ...this.formData
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesResult[item.field]) {
                this.rulesResult[item.field] = item.message
              }
            })
            e.preventDefault()
            return false
          }
          this.studentDiscountAxios()
        }
      )
    },
    studentDiscountAxios() {
      if (this.formData.uploadList[0].size > 2 * 1024 * 1024) {
        alert(this.nl('page_common_student_discount_warning_tips_text'))
        return
      }
      this.loading = true
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rulesResult.email = ''
      }
      const formData = new FormData()
      formData.append('first_name', this.formData.firstName)
      formData.append('last_name', this.formData.lastName)
      formData.append('email', this.formData.email)
      formData.append('fileList[0]', this.formData.uploadList[0])
      formData.append('event_date', this.date)
      formData.append('is_check_email_suffix', this.needCheckEmailDomain)
      this.formData.categories.forEach((value, index) => {
        formData.append(`categories[${index}]`, value)
      })

      this.$axios
        .$post(`/1.0/help/student-discount`, formData)
        .then((res) => {
          this.loading = false
          if (res.code == 100210) {
            this.emailDomainError = true
            this.rulesResult.email = res.msg
            return
          }
          if (res.code == 0) {
            this.isSuccess = true
            this.trackGA4NewEmail(this.formData.email, 'student_discount_coupon_subscribe')
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    },
    handleTermsIntro() {
      this.showTermsPop = false
    },
    showPop() {
      this.showTermsPop = true
    },
    interestedChange(e) {
      this.formData.categories = e
      this.categoriesError = ''
    }
  }
}
</script>

<style lang="less" scoped>
.student-discount-content {
  .content {
    .success-dec {
      margin-top: 20px;
      text-align: center;
      .success-content {
        display: inline-block;
        margin: 0 auto;
      }
      .icon-ok {
        width: 60px;
        height: 60px;
        margin: auto;
        display: block;
      }
      .tip-success {
        font-size: 16px;
        line-height: 25px;
        margin-top: 20px;
      }
      .succ-icon {
        display: inline-block;
        width: 60px;
        height: 60px;
        fill: var(--color-121212);
      }
    }

    .title {
      letter-spacing: 1px;
      font-size: 16px;
      font-family: @font-family-600, sans-serif;
      text-transform: uppercase;
      border-bottom: 1px solid var(--color-121212);
      padding-bottom: 7px;
    }

    #student_discount_form {
      margin: 20px auto;
      width: 555px;
      .control-group {
        position: relative;
        margin-bottom: 15px;
        .int-box {
          width: 555px;
          /deep/ .az-email-domain-box {
            z-index: @z-index-3;
            transform: translateY(-1px);
          }
        }
        &.error {
          .help-inline {
            color: #f00;
          }
          input {
            border-color: #f00;
          }
        }
        label {
          display: block;
          font-family: @font-family-500;
          font-size: 13px;
          margin-bottom: 10px;
          em {
            color: @theme;
          }
        }
        input {
          width: 100%;
          height: 18px;
          display: block;
          line-height: 18px;
          height: 40px;
          padding: 10px 5px 10px 10px;
          background: #fff;
          border: 1px solid var(--color-cccccc);
          box-sizing: border-box;
          &::placeholder {
            color: var(--color-999999);
          }
          &:hover,
          &:focus,
          &:active {
            border-color: var(--color-121212);
          }
        }
        .email-domain-box {
          position: absolute;
          left: 191px;
          top: 40px;
          z-index: 10;
          width: 276px;
          max-height: 284px;
          font-size: 13px;
          background: #fff;
          color: var(--color-121212);
          box-sizing: border-box;
          border: 1px solid #4b83af;
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
        .help-inline {
          color: #555;
          display: block;
          margin-top: 3px;
          white-space: nowrap;
        }
        .img-tips {
          color: var(--color-999999);
          margin-top: 10px;
          text-align: left;
        }
        #agreement_protocol {
          color: var(--color-121212);
          display: block;
          margin-bottom: 15px;
          text-decoration: underline;
          cursor: pointer;
          &:hover {
            color: @theme !important;
          }
        }
        .az-privacy-item {
          margin-top: 15px;
          white-space: nowrap;
          a {
            // color: var(--theme-color);
            text-decoration: underline;
            text-transform: uppercase;
          }
        }
        .btn-choose-file {
          position: relative;
          width: 555px;
          // height: 40px;
          display: inline-block;
          &.hide-upload-btn {
            /deep/ .az-upload-box {
              .upload-box-a {
                display: none;
              }
            }
          }
          /deep/ .az-upload-box {
            .upload-box-a {
              width: 100%;
              height: 40px;
              margin: 0;
              .upload-btn {
                background-image: none;
              }
            }
            .upload-list {
              margin: 0;
            }
          }
          &.error {
            border-color: var(--color-ff0000);
          }
        }
        .btn-submit {
          width: 184px;
          font-size: 14px;
          font-family: @font-family-600;
        }
      }
    }
  }
}
.terms-layer {
  /deep/.az-popup-box .layer-title {
    height: 42px;
    background: #272727;
    font-family: @font-family-600;
    color: #fff;
    font-size: 16px;
    line-height: 42px;
    padding: 0;
    padding-left: 35px;
  }
  .terms-layer-box {
    .terms-container {
      padding: 24px;
      color: var(--color-121212);
      font-size: 13px;
      line-height: 25px;
    }
    /deep/.customer_service {
      color: var(--color-121212);
      text-decoration: underline;
    }
  }
}
.data-picker-box {
  display: block;
  width: 555px;
  height: 45px;
  /deep/ .mx-input {
    display: block;
    height: 45px;
    border-radius: 0;
    border: 1px solid @border-color;
  }
  /deep/ .mx-icon-calendar {
    display: inline-block;
  }
}
.student-discount-content .content #student_discount_form {
  .flex {
    display: flex;
  }
  .control-group.flex {
    display: flex;
    justify-content: space-between;
    .int-box {
      width: calc((100% - 15px) / 2);
    }
  }
}

/deep/ .az-upload-box .upload-box .upload-btn {
  padding: 0 10px !important;
  width: fit-content !important;
}
</style>
