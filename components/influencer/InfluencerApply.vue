<template>
  <transition name="fade">
    <div v-if="visible" class="influencer-apply">
      <div @click.self="clickClose" class="influencer-apply-box">
        <div class="influencer-apply-main">
          <button @click="clickClose" aria-label="Close button" class="btn-close">
            <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
          </button>
          <h2>{{ nl('page_common_application') }}</h2>
          <p class="des">{{ nl('page_influencer_apply_today_start') }}</p>
          <h3>{{ nl('page_influencer_about_you') }}</h3>
          <div class="section">
            <div class="name">
              <az-input
                v-model="applyForm.first_name"
                @blur="handleBlurValidate('first_name')"
                :placeholder="nl('page_goods_first_name')"
                :required="rules.first_name.required"
                :errorMsg="rules.first_name.errorMsg"
                :label="nl('page_goods_first_name')"
                required-position="left"
              ></az-input>
              <az-input
                v-model="applyForm.last_name"
                @blur="handleBlurValidate('last_name')"
                :placeholder="nl('page_goods_last_name')"
                :required="rules.last_name.required"
                :errorMsg="rules.last_name.errorMsg"
                :label="nl('page_goods_last_name')"
                required-position="left"
              ></az-input>
            </div>
            <az-input
              v-model="userInfoEmail"
              @blur="handleBlurValidate('email')"
              :disabled="true"
              :placeholder="nl('page_placeholder_enter_email')"
              :required="true"
              :label="nl('page_login_email')"
              :type="'email'"
              required-position="left"
            ></az-input>
            <div class="form-state">
              <span class="form-label"><i>*</i>{{ nl('page_influencer_currently_live') }}</span>
              <az-select
                :options="countryList"
                :defaultValue="applyForm.country_code"
                :placeholder="nl('page_influencer_select_country')"
                @on-change="handleCountryChange"
                name="showStateOption"
              ></az-select>
              <p v-if="rules.country_code.errorMsg" class="error-tips">{{ rules.country_code.errorMsg }}</p>
            </div>
            <az-input
              v-model="applyForm.school"
              @blur="handleBlurValidate('school')"
              :placeholder="nl('page_influencer_ex')"
              :required="rules.school.required"
              :errorMsg="rules.school.errorMsg"
              :label="nl('page_influencer_attending_college')"
              required-position="left"
            ></az-input>
            <az-checkbox :value="applyForm.agree" @onChange="handleCheckChange">
              <span
                v-html="nl('page_influencer_agree_terms_and_conditions')"
                @click="influencerTermsVisible = true"
                class="checkbox-text"
              ></span>
            </az-checkbox>
            <p v-if="rules.agree.errorMsg" class="error-tips">{{ nl('page_js_accept') }}</p>
          </div>
          <h3>{{ nl('page_influencer_social_platforms') }}</h3>
          <p class="des">{{ nl('page_influencer_social_channel') }}</p>
          <div class="section">
            <div v-for="(item, index) in socialList" :key="index" class="social-item">
              <img :src="item.imgUrl" :alt="item.name" />
              <az-input v-model="item.link" :placeholder="item.placeholder"></az-input>
            </div>
          </div>
          <az-button @click="clickSubmit" :disabled="disabled" class="btn btn-default">{{
            nl('page_influencer_submit_application')
          }}</az-button>
          <!-- <p v-html="nl('page_influencer_privacy_policy')" class="des policy"></p> -->
        </div>
      </div>
      <az-dialog :visible.sync="resultVisible" :scroll-limit="false">
        <div class="apply-result">
          <p v-html="nl(resultTips)"></p>
        </div>
      </az-dialog>
      <az-dialog :visible.sync="influencerTermsVisible" :scroll-limit="false">
        <div class="influencer-term-condition">
          <influencer-terms></influencer-terms>
        </div>
      </az-dialog>
    </div>
  </transition>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import AzInput from '@/components/az-ui/AzInput'
import AzSelect from '@/components/az-ui/AzSelect'
import AzCheckbox from '@/components/az-ui/AzCheckbox'
import AzDialog from '@/components/az-ui/AzDialog'
import InfluencerTerms from '@/components/influencer/InfluencerTerms'

/**
 * 网红申请内容弹框组件
 */
export default {
  components: {
    AzButton,
    AzInput,
    AzSelect,
    AzCheckbox,
    AzDialog,
    InfluencerTerms
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabled: false,
      applyForm: {
        first_name: '',
        last_name: '',
        country_code: '',
        school: '',
        agree: false
      },
      rules: {
        first_name: {
          required: true,
          errorMsg: ''
        },
        last_name: {
          required: true,
          errorMsg: ''
        },
        country_code: {
          required: true,
          errorMsg: ''
        },
        school: {
          required: false,
          errorMsg: ''
        },
        agree: {
          required: true,
          errorMsg: ''
        }
      },
      socialList: {
        tiktok: {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/2d/af/5dad2b4159df3a54d2cbc9163c302daf.png',
          key: 'tiktok_link',
          name: 'tiktok',
          placeholder: 'TikTok Account URL or handle',
          link: ''
        },
        instagram: {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/c7/94/def70d1968c18250a6c77fd851ddc794.png',
          key: 'instagram_link',
          name: 'instagram',
          placeholder: 'Instagram Account URL or handle',
          link: ''
        },
        youtube: {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/ff/6f/7b9258297706eef365e2fe563545ff6f.png',
          key: 'youtube_link',
          name: 'youtube',
          placeholder: 'YouTube Account URL or handle',
          link: ''
        },
        pinterest: {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/9e/6e/c387165969667850b46705407f1d9e6e.png',
          key: 'pinterest_link',
          name: 'pinterest',
          placeholder: 'Pintrest Account URL or handle',
          link: ''
        },
        others: {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/a3/cd/74ae2f0d35f683fb001161221b9aa3cd.png',
          key: 'others_link',
          name: 'others',
          placeholder: 'Others Account URL or handle',
          link: ''
        }
      },
      resultVisible: false,
      resultTips: '',
      influencerTermsVisible: false
    }
  },
  computed: {
    countryList() {
      const res = this.siteOptions.map((ele) => {
        return {
          key: ele.countryCode,
          name: ele.countryName
        }
      })
      return res
    }
  },
  watch: {
    visible(e) {
      const m = function(e) {
        e.preventDefault()
      }
      if (e) {
        // 禁止页面滚动
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', m, false)
      } else {
        this.applyForm = {
          first_name: '',
          last_name: '',
          country_code: '',
          school: '',
          agree: false
        }
        Object.keys(this.socialList).forEach((key) => {
          this.socialList[key].link = ''
        })
        // 放开页面滚动
        document.body.style.overflow = ''
        document.removeEventListener('touchmove', m, false)
      }
    }
  },
  methods: {
    clickClose() {
      this.$emit('update:visible', false)
    },
    // 失焦后校验
    handleBlurValidate(e) {
      if (this.rules[e].required && !e) {
        this.rules[e].errorMsg = this.nl('page_please_enter_valid_value')
      } else {
        this.rules[e].errorMsg = ''
      }
    },
    // 国家选项修改
    handleCountryChange(e) {
      if (e.key) {
        this.applyForm.country_code = e.key
      }
      if (!this.applyForm.country_code) {
        this.rules.country_code.errorMsg = this.nl('page_please_enter_valid_value')
      } else {
        this.rules.country_code.errorMsg = ''
      }
    },
    // agree勾选
    handleCheckChange(e) {
      this.applyForm.agree = e
      if (this.rules.agree.required && !e) {
        this.rules.agree.errorMsg = this.nl('page_please_enter_valid_value')
      } else {
        this.rules.agree.errorMsg = ''
      }
    },
    // 校验必填内容是否填写正确
    validateForm() {
      let res = true
      let hasSocialUrl = false
      Object.keys(this.socialList).forEach((key) => {
        if (this.socialList[key].link) {
          hasSocialUrl = true
        }
      })
      Object.keys(this.rules).forEach((key) => {
        if (this.rules[key].required && !this.applyForm[key]) {
          this.rules[key].errorMsg = this.nl('page_please_enter_valid_value')
          res = false
        } else {
          this.rules[key].errorMsg = ''
        }
      })
      if (!hasSocialUrl) {
        alert('A minimum of one social channel is required.')
        res = false
      }

      return res
    },
    // 点击提交
    clickSubmit() {
      this.disabled = true
      // 校验必填内容是否填写正确
      const validateRes = this.validateForm()
      if (validateRes) {
        const params = {
          first_name: this.applyForm.first_name,
          last_name: this.applyForm.last_name,
          email: this.userInfoEmail,
          country_code: this.applyForm.country_code,
          school: this.applyForm.school,
          youtube_link: this.socialList.youtube.link,
          instagram_link: this.socialList.instagram.link,
          pinterest_link: this.socialList.pinterest.link,
          other_link: this.socialList.others.link,
          tiktok_link: this.socialList.tiktok.link
        }
        this.$axios
          .$post('/1.0/referrer/referrer-user-apply', params)
          .then((res) => {
            this.disabled = false
            if (res.code === 0) {
              this.clickClose()
              this.$emit('onResult', res)
            } else {
              this.resultTips = res.msg
              this.resultVisible = true
            }
          })
          .catch(() => {
            this.disabled = false
          })
      } else {
        this.disabled = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.influencer-apply {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 12;
  overflow: auto;
  &-box {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    min-height: calc(100% - 198px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 99px 0px;
    overflow: auto;
  }
  &-main {
    padding: 40px;
    width: 665px;
    background: #fff;
    text-align: center;
    position: relative;
    .btn-close {
      width: 30px;
      height: 30px;
      padding: 7.5px;
      position: absolute;
      right: 7.5px;
      top: 7.5px;
      border: none;
      &:focus {
        background: #fff;
      }
      .icon-close {
        width: 15px;
        height: 15px;
        fill: var(--color-121212);
      }
    }
    h2 {
      font-family: @font-Ivy-Mode-400;
      font-size: 28px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .des {
      font-size: 13px;
      font-family: @font-family-500;
      &.policy {
        text-align: left;
      }
    }
    h3 {
      font-size: 14px;
      font-family: @font-family-600;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      margin-top: 30px;
    }
    .section {
      margin-top: 20px;
      border-top: 1px solid var(--color-121212);
      text-align: left;
      > div {
        margin-top: 20px;
      }
      .form-label {
        display: block;
        margin-bottom: 5px;
        line-height: 18px;
        font-family: @font-family-600;
        font-weight: 600;
        i {
          margin-right: 5px;
          font-weight: 600;
          font-size: 13px;
          font-style: normal;
          color: @theme;
        }
      }
      /deep/ .az-select-main {
        width: 100% !important;
      }
      /deep/ .az-checkbox {
        height: auto;
      }
      .social-item {
        display: flex;
        align-items: center;
        margin-top: 20px;
        img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 15px;
        }
        .az-input {
          flex: 1;
        }
        /deep/ .az-input-box {
          margin: 0px;
        }
      }
      .error-tips {
        color: red;
        margin-top: 5px;
        &.social-error {
          margin-left: 59px;
        }
      }
      .checkbox-text {
        font-size: 13px;
        font-family: @font-family-600;
        /deep/ a {
          text-decoration: underline;
        }
        /deep/ span {
          text-decoration: underline;
        }
      }
      .name {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > div {
          width: 49%;
        }
      }
    }
    .btn {
      width: 100%;
      margin-top: 30px;
      margin-bottom: 10px;
    }
  }
}
/deep/ .az-dialog-content {
  widows: unset;
}
.influencer-term-condition {
  height: 600px;
  overflow-y: scroll;
  text-align: left;
}
</style>
