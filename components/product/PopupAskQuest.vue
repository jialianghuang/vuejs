<template>
  <div>
    <div v-if="popupAskQuestShow">
      <az-popup-layer
        :z-index="12"
        :title="nl('page_goods_post_my_question')"
        @close="askQuestClose"
        width="757px"
        height="auto"
        class="az-popup-layer--ask"
      >
        <div class="popup-ask-quest clearfix">
          <div class="askq-left fl">
            <form id="form-question" class="ticket-form" onsubmit="return false" autocomplete="off">
              <input type="hidden" name="type" value="goods" />
              <input v-model="baseInfo.goodsId" type="hidden" name="goods_id" />
              <ul>
                <li v-if="!hideName" class="form-item">
                  <label for="user_name">{{ nl('page_email_your_name') }}:<em>*</em></label>
                  <input
                    id="user_name"
                    :class="[inputWidth, { error: rulesResult.name }]"
                    v-model="userName"
                    @focus="inputFocus('name')"
                    type="text"
                    name="user_name"
                  />
                  <p class="error-tip">{{ rulesResult.name }}</p>
                </li>
                <li class="form-item">
                  <label for="user_email">{{ nl('page_email_your_email') }}:<em>*</em></label>
                  <input
                    id="user_email"
                    :class="[inputWidth, { error: rulesResult.email }]"
                    v-model="userEmail"
                    @focus="inputFocus('email')"
                    type="text"
                    name="user_email"
                  />
                  <p class="error-tip">{{ rulesResult.email }}</p>
                </li>
                <li class="form-item">
                  <label for="comment_title">{{ nl('page_goods_question_title') }}:<em>*</em></label>
                  <input
                    id="comment_title"
                    v-model="questTitle"
                    :class="{ error: rulesResult.questTitle }"
                    @focus="inputFocus('questTitle')"
                    class="w440"
                    type="text"
                    name="title"
                  />
                  <p class="error-tip">{{ rulesResult.questTitle }}</p>
                </li>
                <template v-if="is206">
                  <li class="form-item">
                    <label for="prefered_dress_style_name">{{ nl('page_question_prefered_dress_sytle') }}:</label>
                    <input
                      id="prefered_dress_style_name"
                      :class="inputWidth"
                      v-model="sampleStyle"
                      type="text"
                      name="prefered_dress_style_name"
                    />
                  </li>
                  <li class="form-item">
                    <label for="prefered_size">{{ nl('page_question_prefered_size') }}:</label>
                    <input id="prefered_size" :class="inputWidth" v-model="preferedSize" type="text" name="prefered_size" />
                  </li>
                  <li class="form-item">
                    <label for="prefered_fabric_type">{{ nl('page_question_prefered_fabric') }}:</label>
                    <input
                      id="prefered_fabric_type"
                      :class="inputWidth"
                      v-model="preferedFabricType"
                      type="text"
                      name="prefered_fabric_type"
                    />
                  </li>
                </template>
                <li class="form-item">
                  <label for="comment_content">{{ nl('page_goods_your_question') }}:<em>*</em></label>
                  <textarea
                    id="question_comment_content"
                    :placeholder="`${nl('page_write_review_tips')}:\n${nl('page_placeholder_ask_question')}`"
                    :class="{ error: rulesResult.questComment }"
                    @focus="inputFocus('questComment')"
                    v-model="questComment"
                    class="w440 h200"
                    maxlength="3000"
                    name="comment"
                  ></textarea>
                  <p class="error-tip">{{ rulesResult.questComment }}</p>
                </li>
                <li class="form-item">
                  <label>{{ nl('page_goods_verification_code_tip') }}:<em>*</em></label>
                  <input
                    id="genCode"
                    :class="{ error: rulesResult.genCode }"
                    @focus="inputFocus('genCode')"
                    v-model="genCode"
                    type="text"
                    name="genCode"
                  />
                  <img id="verifyImg" :src="`${envApi}${verifyCodeUrl}`" @click="verifyCode" alt="verify" />
                  <p class="error-tip">{{ rulesResult.genCode }}</p>
                </li>
                <li class="form-item">
                  <input id="doSubmitOpt_question_sbmt_comment" type="hidden" value="submit" />
                  <p :class="['privacy-policy-box', { shake: shakeItem }]">
                    <span :class="[{ selected: submitCheck }]" @click.stop="submitCheck = !submitCheck" class="checkbox-box">
                      <az-icon v-if="submitCheck" class="icon-checkbox" icon-class="icon-lby_tick_white_s"></az-icon>
                    </span>
                    <span>{{ nl('page_common_by_submitting_my_question') }}</span
                    >,
                    <span class="blank-item">{{ nl('page_common_i_agree_to_azazie') }}</span>
                    <a :href="countryUrl(`/terms-of-use`)" target="_blank">
                      <span>{{ nl('page_common_help_terms_of_use') }}</span>
                    </a>
                    <span class="blank-item">{{ nl('page_common_and') }}</span>
                    <a :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))" target="_blank"
                      >{{ nl('page_sitemap_privacy') }}.
                    </a>
                  </p>
                  <az-button id="question_sbmt_comment" :loading="subQuestLoading" @click="subQuest" class="btn btn-default">{{
                    nl('page_goods_submit_question')
                  }}</az-button>
                </li>
              </ul>
            </form>
          </div>
          <div class="askq-right fr">
            <popup-right-img :baseInfo="baseInfo"></popup-right-img>
          </div>
        </div>
      </az-popup-layer>
    </div>
    <template v-if="['reviews', 'review'].includes(askType)">
      <popup-ask-quest-success-reviews
        v-if="showPop"
        @close="showPop = false"
        :ticketId="ticketId"
        :askType="askType"
      ></popup-ask-quest-success-reviews>
    </template>
    <popup-ask-quest-success v-else :ticketId="ticketId"></popup-ask-quest-success>
  </div>
</template>

<script>
import formValidatorType from '@/assets/js/formValidatorType'
import azPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
import PopupRightImg from '@/components/product/PopupRightImg'
import PopupAskQuestSuccess from '@/components/product/PopupAskQuestSuccess'
import PopupAskQuestSuccessReviews from '@/components/product/PopupAskQuestSuccessReviews'
import { countryList } from '@/assets/js/euSizeMap'
import { mapGetters } from 'vuex'
import Schema from 'async-validator'

export default {
  name: 'PopupAskQuest',
  languageKeys: [
    'page_goods_post_my_question',
    'page_email_your_name',
    'page_email_your_email',
    'page_goods_question_title',
    'page_question_prefered_dress_sytle',
    'page_question_prefered_size',
    'page_question_prefered_fabric',
    'page_goods_your_question',
    'page_write_review_tips',
    'page_placeholder_ask_question',
    'page_goods_verification_code_tip',
    'page_common_by_submitting_my_question',
    'page_common_i_agree_to_azazie',
    'page_common_help_terms_of_use',
    'page_common_and',
    'page_sitemap_privacy',
    'page_goods_submit_question',
    'page_goods_please_enter_your_name',
    'page_login_enter_email',
    'page_js_errmsg_check_email',
    'page_goods_question_title_is_empty',
    'page_goods_question_empty',
    'page_goods_verify_code_is_empty',
    ...countryList.map((v, i) => 'page_common_provacy_policy_pdf_' + v),
    ...PopupRightImg.languageKeys,
    ...PopupAskQuestSuccess.languageKeys,
    ...PopupAskQuestSuccessReviews.languageKeys
  ],
  components: { azPopupLayer, AzButton, PopupRightImg, PopupAskQuestSuccess, PopupAskQuestSuccessReviews },
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    hideName: {
      type: Boolean,
      default() {
        return false
      }
    },
    askType: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      showPop: false,
      userName: '',
      userEmail: '',
      questTitle: '',
      questComment: '',
      sampleStyle: '',
      preferedSize: '',
      preferedFabricType: '',
      genCode: '',
      subQuestLoading: false,
      validator: null,
      rulesResult: {
        name: '',
        email: '',
        questTitle: '',
        questComment: '',
        genCode: ''
      },
      ticketId: '',
      verifyCodeUrl: '/1.0/ask-question/img',
      fileList: [],
      submitCheck: false,
      shakeItem: false
    }
  },
  computed: {
    ...mapGetters({
      popupAskQuestShow: 'product/getPopupAskQuestShow'
    }),
    is206() {
      return this.baseInfo.catId == '206'
    },
    inputWidth() {
      return this.baseInfo.catId == '206' ? 'w440' : 'w218'
    }
  },
  watch: {
    popupAskQuestShow(newVal) {
      if (newVal) this.verifyCode()
    },
    userInfoName: {
      handler(newValue) {
        this.userName = newValue || ''
      },
      immediate: true
    }
  },
  mounted() {
    const rules = {
      name: formValidatorType.name({ required: this.nl('page_goods_please_enter_your_name') }),
      email: formValidatorType.email({ required: this.nl('page_login_enter_email'), validator: this.nl('page_js_errmsg_check_email') }),
      questTitle: formValidatorType.questTitle({ required: this.nl('page_goods_question_title_is_empty') }),
      questComment: formValidatorType.questComment({ required: this.nl('page_goods_question_empty') }),
      genCode: formValidatorType.genCode({ required: this.nl('page_goods_verify_code_is_empty') })
    }
    this.validator = new Schema(rules)
  },
  methods: {
    askQuestClose() {
      this.$emit('closePop')
      this.$store.commit('product/setPopupAskQuestShow', false)
    },
    subQuest(e) {
      if (['reviews', 'review'].includes(this.askType)) this.setPoint('review', 'submit', 'click')
      if (this.hideName) {
        this.userName = this.userInfoName || this.userId || '-1'
      }
      this.resetRulesResult()
      this.validator.validate(
        {
          name: this.userName,
          email: this.userEmail,
          questTitle: this.questTitle,
          questComment: this.questComment,
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
    questAxiosSubmit(imgList) {
      if (!this.submitCheck) {
        this.shakeItem = true
        setTimeout(() => {
          this.shakeItem = false
        }, 1000)
        return
      }
      const formData = new FormData()
      formData.set('type', 'goods')
      formData.set('category_id', this.baseInfo.catId)
      formData.set('goods_id', this.baseInfo.goodsId)
      formData.set('user_name', this.userName)
      formData.set('user_email', this.userEmail)
      formData.set('title', this.questTitle)
      formData.set('comment', this.questComment)
      formData.set('prefered_dress_style_name', this.sampleStyle)
      formData.set('prefered_size', this.preferedSize)
      formData.set('prefered_fabric_type', this.preferedFabricType)
      formData.set('genCode', this.genCode)
      this.$axios
        .$post('/1.0/ask-question/submit', formData)
        .then((res) => {
          this.ticketId = '000000'
          if (res.code == 0) {
            this.restAllInput()
            this.ticketId = res.data.ticket_id || res.data.ticketId
            this.$store.commit('product/setPopupAskQuestShow', false)
            // 两种弹窗
            this.$store.commit('product/setPopupAskQuestSuccessShow', true)
            this.showPop = true
          } else {
            alert(res.msg)
          }
          this.subQuestLoading = false
        })
        .catch(() => {
          this.restAllInput()
          this.subQuestLoading = false
        })
    },
    restAllInput() {
      this.userName = ''
      this.userEmail = ''
      this.questTitle = ''
      this.questComment = ''
      this.genCode = ''
      this.fileList = []
    },
    inputFocus(type) {
      this.rulesResult[type] = ''
    },
    resetRulesResult() {
      this.rulesResult.name = ''
      this.rulesResult.email = ''
      this.rulesResult.questTitle = ''
      this.rulesResult.questComment = ''
      this.rulesResult.genCode = ''
    },
    verifyCode() {
      this.verifyCodeUrl = '/1.0/ask-question/img?random=' + Math.random()
    }
  }
}
</script>

<style lang="less" scoped>
.az-popup-layer--ask /deep/ .az-popup-box {
  overflow: auto;
}
.popup-ask-quest {
  padding: 35px;
  width: 757px;
  box-sizing: border-box;
  .askq-left {
    // width: 450px;
    height: 590px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 487px;
    .w440 {
      width: 440px;
    }
    .w218 {
      width: 218px;
    }
    .h200 {
      height: 200px;
    }
    #form-question {
      padding: 0 2px;
      li.form-item {
        margin-bottom: 16px;
        label {
          display: block;
          margin-bottom: 6px;
          font-family: @font-family-600, sans-serif;
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
      .add-a-photo {
        .upload-title {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 5px;
          color: var(--color-121212);
        }
        .upload-tips {
          font-size: 13px;
          margin-bottom: 10px;
          color: var(--color-666666);
        }
      }
      .privacy-policy-box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin: 15px 0;
        font-size: 12px;
        line-height: 16px;
        color: #999;
        &.shake {
          color: red !important;
          animation: shake 800ms ease-in-out;
          a {
            color: red !important;
          }
          .checkbox-box {
            border-color: red;
          }
        }
        a {
          color: #999;
          text-transform: uppercase;
          text-decoration: underline;
        }
        .blank-item {
          margin: 0 4px;
        }
        .checkbox-box {
          display: inline-block;
          vertical-align: middle;
          margin-right: 5px;
          width: 12px;
          height: 12px;
          border: 1px solid #666;
          box-sizing: border-box;
          &.selected {
            background: @theme-color;
            border: 1px solid @theme-color;
          }
          .icon-checkbox {
            margin: 1px 0;
            color: #fff;
            width: 9px;
            height: 9px;
            vertical-align: top;
            fill: currentColor;
          }
        }
      }
    }
  }
  .askq-right {
    width: 197px;
  }
}
#question_sbmt_comment {
  background: @theme-color;
  border: solid 1px @theme-color;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(+2px, 0, 0);
  }
  30%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(+4px, 0, 0);
  }
  50% {
    transform: translate3d(-4px, 0, 0);
  }
}
</style>
