<template>
  <div id="popup-my-charity">
    <az-popup-layer :z-index="12" :title="nl('page_submit_my_charity')" @close="popClose" width="506px" height="auto">
      <div class="popup-content">
        <form onsubmit="return false" autocomplete="off">
          <ul>
            <li v-for="(item, key) in list" :key="key" class="form-item">
              <label for="user_name">{{ item }}:<em>*</em></label>
              <input
                id="user_name"
                :class="[{ error: rulesResult[key] }]"
                v-model="listForm[key]"
                @focus="inputFocus(key)"
                :name="key"
                type="text"
              />
              <p class="error-tip">{{ rulesResult[key] }}</p>
            </li>
            <li class="form-item">
              <label for="comment_content">{{ nl('page_charity_feedback') }}:<em>*</em></label>
              <textarea
                id="question_comment_content"
                :placeholder="`${nl('page_write_review_tips')}:\nAdditional information about your charity or other details.`"
                :class="{ error: rulesResult.charityFeedback }"
                @focus="inputFocus('charityFeedback')"
                v-model="listForm.charityFeedback"
                maxlength="3000"
                name="comment"
              ></textarea>
              <p class="error-tip">{{ rulesResult.charityFeedback }}</p>
            </li>
            <li class="form-item">
              <input
                id="genCode"
                :class="{ error: rulesResult.genCode }"
                @focus="inputFocus('genCode')"
                v-model="listForm.genCode"
                type="text"
                name="genCode"
              />
              <img id="verifyImg" :src="`${envApi}${verifyCodeUrl}`" @click="verifyCode" alt="verify" />
              <p class="error-tip">{{ rulesResult.genCode }}</p>
            </li>
            <li class="form-item">
              <az-button :loading="submitLoading" @click="onSubmit()" class="btn btn-default">{{ nl('page_submit_my_charity') }}</az-button>
            </li>
          </ul>
        </form>
      </div>
    </az-popup-layer>
  </div>
</template>

<script>
import formValidatorType from '@/assets/js/formValidatorType'
import azPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
// import { mapState } from 'vuex'
import Schema from 'async-validator'

export default {
  name: 'PopupMyCharity',
  languageKeys: [
    'page_submit_my_charity',
    'page_charity_feedback',
    'page_write_review_tips',
    'page_email_your_name',
    'page_email_your_email',
    'page_charity_name',
    'page_charity_phone_number',
    'page_charity_email',
    'page_goods_please_enter_your_name',
    'page_js_errmsg_check_email',
    'page_goods_verify_code_is_empty',
    'page_login_enter_email',
    'page_email_enter_valid'
  ],
  components: { azPopupLayer, AzButton },
  data() {
    return {
      list: {
        userName: this.nl('page_email_your_name'),
        userEmail: this.nl('page_email_your_email'),
        charityName: this.nl('page_charity_name'),
        charityPhoneNumber: this.nl('page_charity_phone_number'),
        charityEmail: this.nl('page_charity_email')
      },
      listForm: {
        userName: '',
        userEmail: '',
        charityName: '',
        charityPhoneNumber: '',
        charityEmail: '',
        charityFeedback: '',
        genCode: ''
      },
      rulesResult: {
        userName: '',
        userEmail: '',
        charityName: '',
        charityPhoneNumber: '',
        charityEmail: '',
        charityFeedback: '',
        genCode: ''
      },
      submitLoading: false,
      validator: null,
      verifyCodeUrl: '/1.0/ask-question/img'
    }
  },
  computed: {},
  mounted() {
    const rules = {
      userName: formValidatorType.name({ required: this.nl('page_goods_please_enter_your_name') }),
      userEmail: formValidatorType.email({ required: this.nl('page_login_enter_email'), validator: this.nl('page_js_errmsg_check_email') }),
      charityName: [{ type: 'string', required: true, message: 'Please enter your charity name.' }],
      charityPhoneNumber: [{ type: 'string', required: true, message: 'Please enter your charity phone number.' }],
      charityEmail: formValidatorType.email({
        required: this.nl('page_login_enter_email'),
        validator: this.nl('page_js_errmsg_check_email')
      }),
      charityFeedback: [{ type: 'string', required: true, message: 'Please enter additional details or feedback.' }],
      genCode: formValidatorType.genCode({ required: this.nl('page_goods_verify_code_is_empty') })
    }
    this.validator = new Schema(rules)
  },
  methods: {
    popClose() {
      this.$store.commit('list/setPopupMyCharityShow', false)
    },
    onSubmit(e) {
      this.resetRulesResult()
      this.validator.validate(
        {
          userName: this.userName,
          userEmail: this.userEmail,
          charityName: this.charityName,
          charityPhoneNumber: this.charityPhoneNumber,
          genCode: this.genCode
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
          this.questAxiosSubmit()
        }
      )
    },
    questAxiosSubmit() {
      const msg = {
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
      this.buryPoint(this, 'event', {
        ec: 'popup',
        el: 'submitmycharity',
        ea: 'click',
        msg
      })
      this.submitLoading = true
      this.$axios
        .$post('/1.0/ask-question/submit', this.listForm)
        .then((res) => {
          if (res.code == 0) {
            this.buryPoint(this, 'event', {
              ec: 'popup',
              el: 'submitmycharitysuccessful',
              ea: 'click',
              msg
            })
            this.$store.commit('list/setPopupMyCharityShow', false)
          } else {
            alert(res.msg)
          }
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    inputFocus(type) {
      this.rulesResult[type] = ''
    },
    resetRulesResult() {
      this.rulesResult.name = ''
      this.rulesResult.email = ''
      this.rulesResult.charityName = ''
      this.rulesResult.charityPhoneNumber = ''
      this.rulesResult.charityEmail = ''
      this.rulesResult.charityFeedback = ''
      this.rulesResult.genCode = ''
    },
    verifyCode() {
      this.verifyCodeUrl = '/1.0/ask-question/img?random=' + Math.random()
    }
  }
}
</script>

<style lang="less" scoped>
.popup-content {
  padding: 30px;
  li.form-item {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
    input {
      width: 100%;
    }
    label {
      display: block;
      margin-bottom: 10px;
      font-family: @font-family-600;
      em {
        color: var(--color-121212);
        margin-left: 3px;
        font-size: 11px;
      }
    }
    .error-tip {
      color: red;
      margin: 6px 0;
    }
    #question_comment_content {
      width: 100%;
      height: 80px;
    }
  }
  #genCode {
    width: 80px;
    text-align: center;
    margin-right: 6px;
    padding: 11px 13px 10px;
  }
  #verifyImg {
    vertical-align: top;
    cursor: pointer;
  }
}
</style>
