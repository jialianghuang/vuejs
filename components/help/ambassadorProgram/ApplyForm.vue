<template>
  <!-- 校园大使落地页ambassadorProgram引用，申请表单 -->
  <div v-if="showForm" class="ambassdor-apply-form">
    <div v-if="!applySuccess" class="apply-form-container">
      <az-icon @click="toogleShow" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
      <p class="form-title">{{ nl('page_ambassador_form_title') }}</p>
      <p class="form-subtitle">{{ nl('page_ambassador_form_tip') }}</p>
      <div
        ref="applyForm"
        v-track.view="{
          common: {
            ec: 'form',
            el: 'form'
          }
        }"
        class="form-content"
      >
        <div ref="profession_type" :data-top="0" class="form-item">
          <span class="form-label"><i>*</i>{{ nl('page_ambassador_form_am') }}</span>
          <az-select
            :options="selectOptions.profession_type"
            :defaultValue="form.profession_type"
            :placeholder="nl('page_ambassador_form_am_placeholder')"
            @on-change="handleSelectChange($event, 'profession_type')"
            name="showIdentityOption"
          ></az-select>
          <p v-if="rules.profession_type.errorMsg" class="error-tips">{{ rules.profession_type.errorMsg }}</p>
        </div>
        <az-input
          ref="profession_addr"
          :data-top="0"
          v-if="['College Student', 'Wedding Industry Vendor'].includes(form.profession_type)"
          v-model="form.profession_addr"
          :required="rules.profession_addr.required"
          :errorMsg="rules.profession_addr.errorMsg"
          @focus="rules.profession_addr.errorMsg = ''"
          :label="
            nl('page_ambassador_form_specify') +
              ' ' +
              (form.profession_type === 'College Student'
                ? nl('page_ambassador_form_school')
                : ['Wedding Industry Vendor'].includes(form.profession_type)
                ? nl('page_ambassador_form_business')
                : '')
          "
          class=" form-item"
          required-position="left"
        ></az-input>
        <!-- 邮箱 -->
        <az-input
          ref="email"
          v-if="form.profession_type"
          v-model="form.email"
          :label="nl(emailMap[form.profession_type])"
          :required="rules.email.required"
          :errorMsg="rules.email.errorMsg"
          :type="'email'"
          @focus="() => (initEmailCheckDomain(), (rules.email.errorMsg = ''), (errorMsg = ''))"
          required-position="left"
          class="form-item email"
        ></az-input>
        <az-input
          ref="website"
          :data-top="1 * topCardinality"
          v-if="['Wedding Industry Vendor', 'Blogger'].includes(form.profession_type)"
          v-model="form.website"
          :label="
            form.profession_type === 'Wedding Industry Vendor' ? nl('page_ambassador_website_label1') : nl('page_ambassador_website_label2')
          "
          :required="form.profession_type === 'Blogger'"
          :errorMsg="rules.website.errorMsg"
          @focus="rules.website.errorMsg = ''"
          class=" form-item"
          required-position="left"
        ></az-input>

        <az-input
          ref="first_name"
          v-model="form.first_name"
          :required="rules.first_name.required"
          :errorMsg="rules.first_name.errorMsg"
          :placeholder="nl('page_common_first_name')"
          :label="nl('page_common_first_name')"
          :data-top="1 * topCardinality"
          @focus="() => ((rules.first_name.errorMsg = ''), (errorMsg = ''))"
          class=" form-item form-short"
          required-position="left"
        ></az-input>
        <az-input
          ref="last_name"
          v-model="form.last_name"
          :required="rules.last_name.required"
          :errorMsg="rules.last_name.errorMsg"
          :placeholder="nl('page_common_last_name')"
          :label="nl('page_common_last_name')"
          :data-top="1 * topCardinality"
          @focus="rules.last_name.errorMs = ''"
          class=" form-item form-short"
          required-position="left"
        ></az-input>

        <div :data-top="3 * topCardinality" class="form-item">
          <span class="form-label">{{ nl('page_ambassador_form_networks') }}</span>
          <ul class="form-social">
            <li v-for="item in socialList" :key="item.key">
              <p :class="{ 'act-social': currentSocial === item.key || form[item.key] }">
                <img :src="replaceImgCdnUrl(item.imgUrl)" @click="currentSocial = item.key" alt="social" />
              </p>
              <input
                v-model="form[item.key]"
                v-if="currentSocial === item.key"
                :placeholder="
                  item.key === 'other_link' ? nl(item.name) : `${nl(item.name)} ${nl('page_ambassador_form_networks_placeholder')}`
                "
                type="text"
              />
            </li>
          </ul>
        </div>
        <div ref="from_source" :data-top="4 * topCardinality" class="form-item">
          <span class="form-label"><i>*</i>{{ nl('page_ambassador_form_apply_type') }}</span>
          <az-select
            :options="selectOptions.from_source"
            :defaultValue="form.from_source"
            :placeholder="nl('page_ambassador_form_apply_type_placeholder')"
            @on-change="handleSelectChange($event, 'from_source')"
            name="showStateOption"
          ></az-select>
          <p v-if="rules.from_source.errorMsg" class="error-tips">{{ rules.from_source.errorMsg }}</p>
        </div>
        <az-input
          ref="from_source_extra"
          :data-top="5 * topCardinality"
          v-if="form.from_source === 'Others'"
          v-model="form.from_source_extra"
          :required="rules.from_source_extra.required"
          :errorMsg="rules.from_source_extra.errorMsg"
          :label="nl('page_ambassador_form_specify')"
          class=" form-item"
          required-position="left"
        ></az-input>
        <az-input
          ref="apply_reason"
          :data-top="6.5 * topCardinality"
          v-model="form.apply_reason"
          :required="rules.apply_reason.required"
          :errorMsg="rules.apply_reason.errorMsg"
          :label="nl('page_ambassador_form_why')"
          :max-length="500"
          type="textarea"
          show-word-limit
          is-alphabet-limit
          class="form-item"
          required-position="left"
        ></az-input>
        <az-radio
          ref="is_over_eighteen"
          :data-top="8 * topCardinality"
          v-model="form.is_over_eighteen"
          :options="whetherOptions"
          :required="rules.is_over_eighteen.required"
          :errorMsg="rules.is_over_eighteen.errorMsg"
          :label="nl('page_ambassador_form_years')"
          name="overEighteen"
          class="form-item"
          required-position="left"
        ></az-radio>
        <az-radio
          ref="is_legal_work"
          :data-top="8 * topCardinality"
          v-model="form.is_legal_work"
          :options="whetherOptions"
          :required="rules.is_legal_work.required"
          :errorMsg="rules.is_legal_work.errorMsg"
          :label="nl(`page_ambassador_form_work${country !== 'US' ? `_${country.toLowerCase()}` : ''}`)"
          name="legalWork"
          class="form-item"
          required-position="left"
        ></az-radio>
        <az-radio
          ref="is_confirm"
          :data-top="9 * topCardinality"
          v-model="form.is_confirm"
          :options="agreeWhetherOptions"
          :required="rules.is_confirm.required"
          :errorMsg="rules.is_confirm.errorMsg"
          name="confirm"
          class="form-item"
          required-position="left"
        >
          <template slot="label">
            <div class="radio-title">
              <span>*</span>
              <p>
                {{ nl('page_ambassador_form_verify_new') }} <a @click="openAgreement">{{ nl('page_ambassador_form_verify_new_btn') }}</a>
              </p>
            </div>
          </template>
        </az-radio>
        <p v-if="errorMsg" class="form-error-tips">{{ nl(errorMsg) }}</p>
        <az-button
          @click="clickSubmit"
          :class="{ disabled: btnLoading }"
          v-track.click="{
            common: {
              ec: 'form',
              el: 'submit'
            }
          }"
          class="btn btn-theme"
        >
          {{ nl('page_v7_goods_submit') }}
        </az-button>
      </div>
    </div>
    <div v-else class="apply-form-container">
      <az-icon @click="toogleShow" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
      <div class="success-content">
        <img src="../../../assets/images/partner/icon_success.svg" alt="success" />
        <p>{{ nl('page_ambassador_form_submit_success') }}</p>
        <az-button @click="toogleShow" class="btn btn-theme">
          {{ nl('page_common_ok') }}
        </az-button>
      </div>
    </div>
    <agreement ref="agreementPopup" />
  </div>
</template>
<script>
import AzInput from '@/components/az-ui/AzInput'
import AzRadio from '@/components/az-ui/AzRadio'
import AzSelect from '@/components/az-ui/AzSelect'
import AzButton from '@/components/az-ui/Button/AzButton'
import { mapState } from 'vuex'
import checkEmailDomain from '@/assets/js/checkEmailDomain'
import Agreement from './Agreement'
export default {
  components: {
    Agreement,
    AzInput,
    AzRadio,
    AzSelect,
    AzButton
  },
  mixins: [checkEmailDomain],
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showForm: false,
      socialChecked: false,
      topCardinality: 80,
      toastContent: '',
      applySuccess: false,
      form: {
        email: '',
        first_name: '',
        last_name: '',
        profession_type: '',
        profession_addr: '',
        website: '',
        tiktok_link: '',
        instagram_link: '',
        youtube_link: '',
        pinterest_link: '',
        other_link: '',
        from_source: '',
        from_source_extra: '',
        apply_reason: '',
        is_over_eighteen: null,
        is_legal_work: null,
        is_confirm: null
      },
      rules: {
        email: {
          required: true,
          errorMsg: ''
        },
        website: {
          required: true,
          errorMsg: ''
        },
        first_name: {
          required: true,
          errorMsg: ''
        },
        last_name: {
          required: true,
          errorMsg: ''
        },
        profession_type: {
          required: true,
          errorMsg: ''
        },
        profession_addr: {
          required: true,
          errorMsg: ''
        },
        from_source: {
          required: true,
          errorMsg: ''
        },
        from_source_extra: {
          required: true,
          errorMsg: ''
        },
        apply_reason: {
          required: true,
          errorMsg: ''
        },
        is_over_eighteen: {
          required: true,
          errorMsg: ''
        },
        is_legal_work: {
          required: true,
          errorMsg: ''
        },
        is_confirm: {
          required: true,
          errorMsg: ''
        }
      },
      currentSocial: '',
      btnLoading: false,
      selectOptions: {},
      errorMsg: ''
    }
  },
  computed: {
    ...mapState('userInfo', ['userInfoEmail']),
    whetherOptions() {
      return [
        { label: this.nl('page_common_yes'), value: 1 },
        { label: this.nl('page_common_form_no'), value: 0 }
      ]
    },
    agreeWhetherOptions() {
      return [{ label: this.nl('page_common_yes'), value: 1 }]
    },
    emailMap() {
      return {
        'AZAZIE Customer': 'page_ambassador_form_email1',
        'College Student': 'page_ambassador_form_email2',
        'Wedding Industry Vendor': 'page_ambassador_form_email3',
        Blogger: 'page_ambassador_form_email4'
      }
    },
    socialList() {
      return [
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/01/29/f9586844551aeedf141c445d77d80129.png',
          key: 'tiktok_link',
          name: 'page_ambassador_form_tiktok'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/b8/4d/e998633cc298fd6b899eef8fcfe0b84d.png',
          key: 'instagram_link',
          name: 'page_ambassador_form_instagram'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/89/74/b43e267d820449ce71dadfec03548974.png',
          key: 'youtube_link',
          name: 'page_ambassador_form_youtube'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/ab/a1/76795133415ba70c306ebe428ff8aba1.png',
          key: 'pinterest_link',
          name: 'page_ambassador_form_pinterest'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/b1/5c/3d3c754fc307befb6f95d1f6587ab15c.png',
          key: 'other_link',
          name: 'page_ambassador_form_other_link'
        }
      ]
    }
  },
  watch: {
    userInfoEmail(newVal, oldVal) {
      this.form.email = this.userInfoEmail || ''
    }
  },
  created() {
    this.getSelectOptions()
  },
  mounted() {
    this.form.email = this.userInfoEmail || ''
  },
  methods: {
    toogleShow() {
      this.showForm = !this.showForm
      //   打开form弹窗时，body禁止滚动
      if (this.showForm) document.body.style.overflowY = 'hidden'
      else document.body.style.removeProperty('overflow-y')
    },
    /* 获取下拉选项列表 */
    getSelectOptions() {
      this.$axios.$get('/1.0/ambassador/form').then((res) => {
        if (res.data) {
          this.selectOptions.from_source = res.data.from_source
            ? res.data.from_source.map((item) => {
                return {
                  name: item,
                  value: item,
                  key: item
                }
              })
            : []
          this.selectOptions.profession_type = res.data.profession_type
            ? res.data.profession_type.map((item) => {
                return {
                  name: item,
                  value: item,
                  key: item
                }
              })
            : []
        }
      })
    },
    /* 选择器选择 */
    handleSelectChange(e, key) {
      this.$set(this.form, key, e.key)
      if (key === 'profession_type') this.form.profession_addr = ''
      if (key === 'from_source') this.form.from_source_extra = ''
    },
    /* 校验表单 */
    validateForm(key) {
      switch (key) {
        case 'website':
          if (this.form.profession_type === 'Blogger' && !this.form.website) {
            this.rules[key].errorMsg = this.nl('page_please_enter_valid_value')
            return key
          }
          break
        case 'is_over_eighteen':
        case 'is_legal_work':
        case 'is_confirm':
          if (!this.form[key] && this.form[key] !== 0) {
            this.rules[key].errorMsg = this.nl('page_please_enter_valid_value')
            return key
          }
          break
        default:
          if (this.rules[key] && this.$refs[key] && (!this.form[key] || (typeof this.form[key] === 'string' && !this.form[key].trim()))) {
            this.rules[key].errorMsg = this.nl('page_please_enter_valid_value')
            return key
          }
          break
      }
      if (this.rules[key]) this.rules[key].errorMsg = ''
      return false
    },
    /* 提交表单 */
    clickSubmit() {
      for (const key in this.form) {
        const validated = this.validateForm(key)
        if (validated) {
          // 如果有校验错误项，滚动页面到错误输入项
          this.$refs.applyForm.scrollTop = this.$refs[validated].$el
            ? this.$refs[validated].$el.dataset.top
            : this.$refs[validated].dataset.top
          return
        }
      }
      const data = { ...this.form }
      if (!['College Student', 'Wedding Industry Vendor'].includes(data.profession_type)) {
        delete data.profession_addr
      }
      if (!['Wedding Industry Vendor', 'Blogger'].includes(data.profession_type)) {
        delete data.website
      }
      data.is_confirm = Number(data.is_confirm)
      data.is_legal_work = Number(data.is_legal_work)
      data.is_over_eighteen = Number(data.is_over_eighteen)
      this.btnLoading = true
      if (this.emailDomainError) {
        this.needCheckEmailDomain = 0
        this.emailDomainError = false
        this.rules.email.errorMsg = ''
        this.errorMsg = ''
      }
      data.is_check_email_suffix = this.needCheckEmailDomain
      this.$axios.$post('/1.0/ambassador/apply', data).then((res) => {
        this.btnLoading = false
        if (res.code == 100210) {
          const emailFormDom = document.querySelector('.form-item.email')
          emailFormDom && emailFormDom.scrollIntoView({ block: 'start', behavior: 'smooth' })
          this.emailDomainError = true
          this.rules.email.errorMsg = res.msg
          return
        }
        if (res.code === 0) {
          // 申请成功
          this.applySuccess = true
          this.toastContent = this.nl('page_ambassador_form_submit_success')
          // GA4上报
          this.trackGA4NewEmail(this.form.email, 'ambassador')
        } else {
          this.errorMsg = res.msg
        }
      })
    },
    openAgreement() {
      this.$refs.agreementPopup.toogleShow()
    }
  }
}
</script>
<style lang="less" scoped>
.ambassdor-apply-form {
  position: fixed;
  z-index: @fixed-z-index;
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .apply-form-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 745px;
    height: 651;
    padding: 40px;
    background: #fff;
    color: var(--color-121212);
    .icon {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 15px;
      height: 15px;
      fill: var(--color-121212);
      cursor: pointer;
    }
    .form {
      &-content {
        height: 498px;
        overflow-y: auto;
        margin-top: 15px;
        padding-right: 5px;
        padding-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &::-webkit-scrollbar {
          width: 8px;
        }
        &::-webkit-scrollbar-thumb {
          width: 8px;
          height: 20%;
          border-radius: 90px;
          transition: opacity 0.34s ease-out;
          cursor: pointer;
          background-color: #ccc;
        }
        &::-webkit-scrollbar-track {
          border-radius: 60px;
          background: #eee;
        }
        .btn {
          margin: auto;
          width: 190px;
          height: 40px;
          margin-top: 20px;
          font-weight: 600;
          &.disabled {
            background: var(--color-121212);
          }
        }
      }
      &-title {
        text-align: center;
        font-family: 'Arimo';
        font-size: 28px;
        text-transform: uppercase;
      }
      &-subtitle {
        margin-top: 10px;
        text-align: center;
        font-family: 'Arimo';
        font-size: 13px;
      }
      &-item {
        margin-bottom: 20px;
        width: 100%;
      }
      &-short {
        width: calc((100% - 15px) / 2);
      }
      &-label {
        display: block;
        margin-bottom: 5px;
        line-height: 18px;
        font-family: 'Arimo SemiBold';
        font-weight: 600;
        i {
          margin-right: 5px;
          font-family: 'Arimo SemiBold';
          font-weight: 600;
          font-size: 13px;
          font-style: normal;
          color: @theme;
        }
      }
      &-social {
        display: flex;
        align-items: center;
        padding: 0 10px;
        margin-top: 15px;
        li {
          display: flex;
          align-items: center;
          & > p {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            margin-right: 15px;
            cursor: pointer;
          }
          input {
            margin-right: 15px;
            width: 325px;
          }
        }
        img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
        .act-social {
          border: 2px solid @theme;
          box-sizing: border-box;
          img {
            width: 36px;
            height: 36px;
          }
        }
      }
    }
    .error-tips,
    .form-error-tips {
      color: red;
      margin-top: 5px;
    }
    .form-error-tips {
      width: 100%;
    }
    /deep/ .az-select-main {
      width: 100% !important;
    }
    /deep/ .az-checkbox span {
      font-family: 'Arimo SemiBold';
      font-weight: 600;
    }
    /deep/ input[type='text'],
    /deep/ textarea {
      padding: 10px;
      &:focus {
        background: none;
      }
    }
    /deep/ textarea {
      height: 106px;
    }
  }
  .success-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 585.8px;
    & > img {
      width: 60px;
      height: 60px;
    }
    & > p {
      margin-top: 40px;
      font-family: 'Arimo';
      font-size: 16px;
      line-height: 26px;
      text-align: center;
      color: var(--color-121212);
    }
    button {
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -95px;
      width: 190px;
      height: 45px;
    }
  }
}
.radio-title {
  display: flex;
  font-weight: 700;
  font-family: 'Arimo SemiBold';
  line-height: 18px;
  span {
    color: @theme-color;
    margin-right: 5px;
  }
  a {
    color: @theme-color;
    text-decoration: underline;
    cursor: pointer;
  }
}
/deep/ .az-input-label,
/deep/ .az-radio-title {
  font-family: 'Arimo SemiBold' !important;
  font-weight: 600;
}
/deep/ .az-radio {
  font-family: 'Arimo' !important;
}
/deep/ .az-select-main-info .placeholder {
  font-family: 'Arimo' !important;
}
</style>
