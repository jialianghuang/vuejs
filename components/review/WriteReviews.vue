<template>
  <div class="write-review-form">
    <form class="ticket-form">
      <ul>
        <li class="rating clearfix">
          <label v-if="!isReviewList" class="fl">{{ nl('page_goods_your_rating') }}:<em>*</em></label>
          <div class="starx-wrap fl">
            <az-rate
              :value="starstar"
              :showText="true"
              :textStyle="{ fontSize: '13px', color: '#666', display: 'inline-block', 'vertical-align': '3px', 'margin-top': '5px' }"
              @change="rateChange"
              font-size="21px"
            >
            </az-rate>
            <az-service v-if="starstar && starstar < 3" @openAskPop="openAskPop"></az-service>
          </div>
          <p v-if="rulesResult.starstar" class="error-tip">{{ rulesResult.starstar }}</p>
        </li>
        <li v-if="starstar && starstar < 3 && reasons && reasons.length" class="bad-reason clearfix">
          <label
            >{{ nl('page_email_reason') }}:<em>*</em><span class="">{{ nl('page_module_reviews_reason_limited') }}</span>
            <p v-if="rulesResult.reason_ids" class="error-tip">{{ rulesResult.reason_ids }}</p></label
          >
          <div class="starx-wrap">
            <div class="reason-list">
              <div
                v-for="reason in reasons"
                :key="reason.reasonId"
                @click="setReason(reason)"
                :class="{ selected: selectReasons.includes(reason.reasonId) }"
                class="reason-item"
              >
                {{ reason.reason }}
              </div>
            </div>
          </div>
        </li>
        <li v-if="!fitCatIds.includes(baseInfo.catId)" class="fit clearfix">
          <label class="fl">{{ nl('page_goods_your_fit') }}:<em>*</em></label>
          <div class="fl">
            <div class="starx-wrap_fit ">
              <div
                v-for="(item, index) in fitText"
                :key="item"
                :class="{ selected: starstar_fit === index + 1 }"
                :title="item"
                @click="fitChange(index)"
                class="fit-item-dot"
              ></div>
            </div>
            <div class="lable_fit clearfix">
              <label :class="{ click_show: starstar_fit === 1 }" class="fit_small">{{ nl('page_review_fit_small') }}</label>
              <label :class="{ click_show: starstar_fit === 2 }" class="double hidden">{{ nl('page_review_fit_slightlysmall') }}</label>
              <label :class="{ click_show: starstar_fit === 3 }" class="hidden">{{ nl('page_review_fit_right') }}</label>
              <label :class="{ click_show: starstar_fit === 4 }" class="double hidden">{{ nl('page_review_fit_slightlylarge') }}</label>
              <label :class="{ click_show: starstar_fit === 5 }" class="fit_large">{{ nl('page_review_fit_large') }}</label>
            </div>
          </div>
          <p v-if="rulesResult.starstar_fit" :class="{ 'right-fixed': isExtraOption }" class="error-tip-fit">
            {{ rulesResult.starstar_fit }}
          </p>
        </li>
        <li v-if="!hideName">
          <label v-if="!isReviewList" for="review_user_name">{{ nl('page_email_your_name') }}:<em>*</em></label>
          <input
            v-model="user_name"
            @focus="rulesResult.user_name = ''"
            :placeholder="isReviewList ? nl('page_your_name') : ''"
            :class="{ error: rulesResult.user_name }"
            class="w1"
            type="text"
            name="user_name"
            style="width: 292px;box-sizing: border-box;height: 40px;"
          />
          <p v-if="rulesResult.user_name" class="error-tip">{{ rulesResult.user_name }}</p>
        </li>
        <li>
          <label v-if="!isReviewList" for="review_comment_content">{{ nl('page_goods_your_review') }}:<em>*</em></label>
          <textarea
            :placeholder="
              `${nl('page_write_review_tips').replace(/<br\/>/g, '\r\n')}:\r\n${nl('page_write_review_tipques1').replace(
                /<br\/>/g,
                '\r\n'
              )}${nl('page_write_review_tipques2').replace(/<br\/>/g, '\r\n')}${nl('page_write_review_tipques3').replace(
                /<br\/>/g,
                '\r\n'
              )}`
            "
            v-model="comment"
            @focus="rulesResult.comment = ''"
            :class="{ error: rulesResult.comment }"
            class="review-comment"
            maxlength="3000"
            name="comment"
          ></textarea>
          <p v-if="rulesResult.comment" class="error-tip">{{ rulesResult.comment }}</p>
        </li>
        <li class="popframe">
          <div name="upload">
            <p v-if="!isReviewList" class="upload-title">{{ nl('page_write_review_upload_photo') }}:</p>
            <p class="upload-tips">{{ nl('page_write_review_upload_desc') }}</p>
            <az-upload
              ref="upload"
              :showVideoBtn="showVideoBtn"
              :isReviewList="isReviewList"
              :nameList="['fileList[0]', 'fileList[1]', 'fileList[2]', 'fileList[3]', 'fileList[4]']"
              @video-uploaded="(data) => (review_video = data)"
            ></az-upload>
          </div>
        </li>
        <template v-if="!fitCatIds.includes(baseInfo.catId) && false">
          <div class="line_addition"></div>
          <li class="clearfix">
            <div class="clearfix">
              <label class="additional-title">{{ nl('page_reviews_additional') }} <span v-if="isExtraOption">(Optional)</span>:</label>
              <template v-if="!isReviewList">
                <div class="additional-item-block">
                  <div class="body_type">
                    <!-- <label class="body_type_title">{{ nl('page_shop_by_option_body_type') }}</label> -->
                    <select @change="bodyTypeChange" :class="{ 'placeholder-value': bodyType === '' }" name="body_type">
                      <option value="">{{ nl('page_shop_by_option_body_type') }}</option>
                      <option :value="nl('page_shop_by_body_type_pear')">{{ nl('page_shop_by_body_type_pear') }}</option>
                      <option :value="nl('page_shop_by_body_type_apple')">{{ nl('page_shop_by_body_type_apple') }}</option>
                      <option :value="nl('page_shop_by_body_type_straight')">{{ nl('page_shop_by_body_type_straight') }}</option>
                      <option :value="nl('page_shop_by_body_type_Hourglass')">{{ nl('page_shop_by_body_type_Hourglass') }}</option>
                    </select>
                  </div>
                  <div class="size_ordered">
                    <!-- <label class="body_type_title">{{ nl('page_customer_size_ordered') }}</label> -->
                    <select
                      @change="sizeOrderedChange"
                      v-model="size_ordered"
                      :class="{ 'placeholder-value': size_ordered === '' }"
                      name="size_ordered"
                    >
                      <option value="">{{ nl('page_customer_size_ordered') }}</option>
                      <option :value="nl('page_v6_goods_custom_size')">{{ nl('page_v6_goods_custom_size') }}</option>
                      <option v-for="item in review_size" :key="item.shownName" :value="item.shownName">{{ item.shownName }}</option>
                    </select>
                  </div>
                  <div class="height">
                    <input
                      v-model.number="height"
                      @focus="rulesResult.height = ''"
                      :placeholder="nl('page_review_height')"
                      name="height"
                      type="text"
                    />
                    <p v-if="rulesResult.height" class="error-tip">{{ rulesResult.height }}</p>
                  </div>
                </div>
                <div class="additional-item-block">
                  <div class="tip-item">
                    <input
                      v-model.number="bust"
                      @focus="rulesResult.bust = ''"
                      :placeholder="nl('page_review_bust')"
                      name="bust"
                      type="text"
                    />
                    <p v-if="rulesResult.bust" class="error-tip">{{ rulesResult.bust }}</p>
                  </div>
                  <div class="tip-item">
                    <input
                      v-model.number="waist"
                      @focus="rulesResult.waist = ''"
                      :placeholder="nl('page_review_waist')"
                      name="waist"
                      type="text"
                    />
                    <p v-if="rulesResult.waist" class="error-tip">{{ rulesResult.waist }}</p>
                  </div>
                  <div class="tip-item">
                    <input
                      v-model.number="hips"
                      @focus="rulesResult.hips = ''"
                      :placeholder="nl('page_review_hips')"
                      name="hips"
                      type="text"
                    />
                    <p v-if="rulesResult.hips" class="error-tip">{{ rulesResult.hips }}</p>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="reviews-list-additional">
                  <div class="body_type">
                    <select @change="bodyTypeChange" :class="{ 'placeholder-value': bodyType == '' }" name="body_type">
                      <option value="">{{ nl('page_shop_by_option_body_type') }}</option>
                      <option :value="nl('page_shop_by_body_type_pear')">{{ nl('page_shop_by_body_type_pear') }}</option>
                      <option :value="nl('page_shop_by_body_type_apple')">{{ nl('page_shop_by_body_type_apple') }}</option>
                      <option :value="nl('page_shop_by_body_type_straight')">{{ nl('page_shop_by_body_type_straight') }}</option>
                      <option :value="nl('page_shop_by_body_type_Hourglass')">{{ nl('page_shop_by_body_type_Hourglass') }}</option>
                    </select>
                    <az-icon class="icon-select" icon-class="icon-lby_expand_arrow_down"></az-icon>
                  </div>
                  <div class="size_ordered">
                    <select
                      @change="sizeOrderedChange"
                      :class="{ 'placeholder-value': size_ordered == '' }"
                      v-model="size_ordered"
                      name="size_ordered"
                    >
                      <option value="">{{ nl('page_customer_size_ordered') }}</option>
                      <option :value="nl('page_v6_goods_custom_size')">{{ nl('page_v6_goods_custom_size') }}</option>
                      <option v-for="item in review_size" :key="item.shownName" :value="item.shownName">{{ item.shownName }}</option>
                    </select>
                    <az-icon class="icon-select" icon-class="icon-lby_expand_arrow_down"></az-icon>
                  </div>
                  <div class="height">
                    <input
                      v-model.number="height"
                      @focus="rulesResult.height = ''"
                      :placeholder="nl('page_size_height') + (['US', 'GB'].includes(country) ? ' (in)' : ' (cm)')"
                      name="height"
                      type="text"
                    />
                    <p v-if="rulesResult.height" class="error-tip">{{ rulesResult.height }}</p>
                  </div>
                </div>
                <div class="reviews-list-additional">
                  <div class="measurements">
                    <div class="tip">
                      <div class="tip-item">
                        <input
                          v-model.number="bust"
                          @focus="rulesResult.bust = ''"
                          :placeholder="nl('page_common_bust') + (['US', 'GB'].includes(country) ? ' (in)' : ' (cm)')"
                          name="bust"
                          type="text"
                        />
                        <p v-if="rulesResult.bust" class="error-tip">{{ rulesResult.bust }}</p>
                      </div>
                      <div class="tip-item">
                        <input
                          v-model.number="waist"
                          @focus="rulesResult.waist = ''"
                          :placeholder="nl('page_common_waist') + (['US', 'GB'].includes(country) ? ' (in)' : ' (cm)')"
                          name="waist"
                          type="text"
                        />
                        <p v-if="rulesResult.waist" class="error-tip">{{ rulesResult.waist }}</p>
                      </div>
                      <div class="tip-item">
                        <input
                          v-model.number="hips"
                          @focus="rulesResult.hips = ''"
                          :placeholder="nl('page_common_hips') + (['US', 'GB'].includes(country) ? ' (in)' : ' (cm)')"
                          name="hips"
                          type="text"
                        />
                        <p v-if="rulesResult.hips" class="error-tip">{{ rulesResult.hips }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </li>
        </template>
        <li>
          <az-button :disabled="loading" @click="writeReviewsEvent" class="btn btn-default btn-submit">
            {{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_goods_submit_review') }}</az-button
          >
        </li>
      </ul>
    </form>
    <p class="privacy-policy-box">
      <span>{{ nl('page_common_i_agree_to_azazie') }}</span>
      <a :href="countryUrl(`/terms-of-use`)" target="_blank">
        <span>{{ nl('page_common_help_terms_of_use') }}</span>
      </a>
      <span>{{ nl('page_common_and') }}</span>
      <a :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))" target="_blank"
        >{{ nl('page_sitemap_privacy') }}
      </a>
    </p>
    <popup-ask-quest
      v-if="showAsk"
      :baseInfo="baseInfo"
      :hideName="hideName"
      :askType="askType"
      @closePop="showAsk = false"
    ></popup-ask-quest>
  </div>
</template>

<script>
import AzUpload from '@/components/az-ui/Upload/AzUpload'
import Schema from 'async-validator'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzRate from '@/components/az-ui/Rate/AzRate'
import AzService from '@/components/az-ui/Rate/AzService'
import PopupAskQuest from '@/components/product/PopupAskQuest'

export default {
  name: 'WriteReviews',
  components: {
    AzService,
    AzUpload,
    AzButton,
    AzRate,
    PopupAskQuest
  },
  props: {
    // 是否显示name
    hideName: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 评论ask类型 reviews / review
    askType: {
      type: String,
      default() {
        return ''
      }
    },
    // 差评原因
    reasons: {
      type: Array,
      default() {
        return []
      }
    },
    fitCatIds: {
      type: Array,
      default() {
        return []
      }
    },
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    size: {
      type: [Array, Object],
      default() {
        return {}
      }
    },
    orderSn: {
      type: String,
      default: ''
    },
    recId: {
      type: String,
      default: ''
    },
    rating: {
      // 订单商品批量评论的时候会传
      type: Number,
      default: 0
    },
    sizeOrdered: {
      // 订单商品评论的时候会传
      type: String,
      default: ''
    },
    isReviewList: {
      // 是否是批量评论
      type: Boolean,
      default: false
    },
    isExtraOption: {
      // 是否Additional Information 可选
      type: Boolean,
      default: false
    },
    isFromWgdReviewEmail: {
      // 是否来自wgd的邀约评论邮件
      type: Boolean,
      default: false
    },
    urlQuery: {
      // 链接上的入参
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showAsk: false,
      selectReasons: [],
      review_size: [],
      starstar: 0,
      starstar_fit: 0,
      user_name: '',
      comment: '',
      height: '',
      bust: '',
      waist: '',
      hips: '',
      bodyType: '',
      size_ordered: '',
      fitText: [
        this.nl('page_review_fit_small'),
        this.nl('page_review_fit_slightlysmall'),
        this.nl('page_review_fit_right'),
        this.nl('page_review_fit_slightlylarge'),
        this.nl('page_review_fit_large')
      ],
      rules: {},
      validator: null,
      rulesResult: {
        starstar: '',
        starstar_fit: '',
        user_name: '',
        comment: '',
        height: '',
        bust: '',
        waist: '',
        hips: '',
        reason_ids: ''
      },
      loading: false,
      showVideoBtn: true,
      review_video: []
    }
  },
  watch: {
    userInfoName: {
      handler(newValue) {
        this.user_name = newValue
      },
      immediate: true
    }
  },
  created() {
    if (this.rating * 1 > 0) this.starstar = this.rating
  },
  mounted() {
    for (const key in this.size) {
      const sizeItem = {
        shownName: this.size[key].shownName
        // value: this.size[key].styleId
      }
      if (this.sizeOrdered && sizeItem.shownName == this.sizeOrdered.toUpperCase()) this.size_ordered = sizeItem.shownName
      this.review_size.push(sizeItem)
    }
    this.rules = {
      starstar: [{ type: 'number', required: true, min: 1, max: 5, message: this.nl('page_rating_required') }],
      starstar_fit: [{ type: 'number', required: true, min: 1, max: 5, message: this.nl('page_fit_required') }],
      user_name: [{ type: 'string', required: true, message: this.nl('page_goods_please_enter_your_name') }],
      comment: [
        { type: 'string', required: true, message: this.nl('page_goods_review_is_empty') },
        { max: 3000, message: this.nl('page_goods_review_question_content_length') }
      ]
    }
    if (!this.fitCatIds.includes(this.baseInfo.catId) && !this.isExtraOption) {
      // TODO 是否需要校验
      this.addRules()
    }
    this.validator = new Schema(this.rules)
  },
  methods: {
    openAskPop() {
      this.setPoint('review', 'ques_icon', 'click')
      this.showAsk = true
      this.$store.commit('product/setPopupAskQuestShow', true)
    },
    setReason(reason) {
      this.rulesResult.reason_ids = ''
      if (this.selectReasons.includes(reason.reasonId)) {
        this.selectReasons = this.selectReasons.filter((item) => item != reason.reasonId)
      } else if (this.selectReasons.length < 2) this.selectReasons.push(reason.reasonId)
    },
    addRules() {
      this.rules.height = [{ type: 'number', required: true, message: this.nl('page_please_enter_valid_value') }]
      this.rules.bust = [{ type: 'number', required: true, message: this.nl('page_please_enter_valid_value') }]
      this.rules.waist = [{ type: 'number', required: true, message: this.nl('page_please_enter_valid_value') }]
      this.rules.hips = [{ type: 'number', required: true, message: this.nl('page_please_enter_valid_value') }]
    },
    deleteRules() {
      delete this.rules.height
      delete this.rules.bust
      delete this.rules.waist
      delete this.rules.hips
    },
    addReasonRule() {
      this.rules.reason_ids = [
        {
          type: 'array',
          validator: (rule, value, callback) => {
            if (value && value.length) {
              callback()
            } else {
              callback(new Error(this.nl('page_module_reviews_valid_error')))
            }
          }
        }
      ]
    },
    deleteReasonRule() {
      delete this.rules.reason_ids
    },
    rateChange(val) {
      this.rulesResult.starstar = ''
      this.starstar = val
      if (+val < 3) {
        this.addReasonRule()
      } else {
        this.deleteReasonRule()
        this.selectReasons = []
      }
      this.validator = new Schema(this.rules)
      this.setPoint('review', 'star', 'click', { num: val })
      this.$emit('rateChange', val)
    },
    fitChange(index) {
      this.rulesResult.starstar_fit = ''
      this.starstar_fit = index + 1
    },
    resetRulesResult() {
      const keys = Object.keys(this.rulesResult)
      keys.map((item) => {
        this.rulesResult[item] = ''
      })
    },
    writeReviewsEvent() {
      this.setPoint('reviews', 'writesubmit', 'click')
      const badposts = (this.reasons || []).filter((item) => (this.selectReasons || []).includes(item.reasonId)).map((item) => item.reason)
      this.setPoint('review', 'submit', 'click', { badposts })
      if (this.loading) {
        return false
      }
      if (this.hideName) {
        this.user_name = this.userInfoName || this.userId || '-1'
      }
      if (+this.starstar < 3) {
        this.addReasonRule()
      } else {
        this.deleteReasonRule()
      }
      this.validator = new Schema(this.rules)
      this.resetRulesResult()
      const data = {
        starstar: this.starstar,
        starstar_fit: this.starstar_fit,
        user_name: this.user_name,
        comment: this.comment,
        reason_ids: this.selectReasons
      }
      if (!this.fitCatIds.includes(this.baseInfo.catId)) {
        data.height = this.height
        data.bust = this.bust
        data.waist = this.waist
        data.hips = this.hips
      }
      this.validator.validate(data, (errors, fields) => {
        if (errors) {
          errors.map((item) => {
            if (!this.rulesResult[item.field]) {
              this.rulesResult[item.field] = item.message
            }
          })
          return false
        }
        this.writeReviewsAxios()
      })
    },
    bodyTypeChange(event) {
      this.bodyType = event.target.value
    },
    sizeOrderedChange() {
      this.size_ordered = event.target.value
      if (event.target.value == this.nl('page_v6_goods_custom_size')) {
        this.addRules()
      } else {
        this.deleteRules()
      }
      this.validator = new Schema(this.rules)
      this.resetRulesResult()
      const data = {
        starstar: this.starstar,
        starstar_fit: this.starstar_fit,
        user_name: this.user_name,
        comment: this.comment
      }
      if (!this.fitCatIds.includes(this.baseInfo.catId)) {
        data.height = this.height
        data.bust = this.bust
        data.waist = this.waist
        data.hips = this.hips
      }
      this.validator.validate(data, (errors, fields) => {
        if (errors) {
          errors.map((item) => {
            if (!this.rulesResult[item.field]) {
              this.rulesResult[item.field] = item.message
            }
          })
          return false
        }
      })
    },
    async uploadImg() {
      let images = []
      const formData = this.$refs.upload.upload()
      if (formData.code == 2) {
        return formData
      }
      const res = await this.$axios.$post(`/1.0/image/upload/review`, formData)
      if (res.code == 0) {
        images = res.data.images
      }
      return images
    },
    async writeReviewsAxios() {
      const params = {
        goods_id: this.baseInfo.goodsId,
        dress_type: this.baseInfo.dressType,
        rating: this.starstar,
        fit_rating: this.starstar_fit,
        name: this.user_name,
        comment: this.comment,
        body_type: this.bodyType,
        size_ordered: this.size_ordered,
        height: this.height,
        bust: this.bust,
        waist: this.waist,
        hips: this.hips,
        reason_ids: this.selectReasons
      }
      if (this.orderSn) {
        params.order_sn = this.orderSn
        params.rec_id = this.recId
      }
      params.images = await this.uploadImg()
      // 如果需要上传视频，还未上传完成就会返回code=2的对象
      if (params.images.code == 2) return
      if (this.showVideoBtn) {
        params.review_video = this.review_video
      }
      this.loading = true
      let queryUrl = ''
      if (this.isFromWgdReviewEmail) {
        // 来自wgd的邀约评论邮件的时候，提交评论把链接中的入参也加上
        queryUrl = '/1.0/review/write-without-login'
      } else {
        queryUrl = '/1.0/review/write'
      }
      this.$axios
        .$post(queryUrl, params)
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            this.$emit('success', { ...res, starstar: this.starstar, reviewContent: this.comment })
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.clearfix:after {
  content: '.';
  clear: both;
  height: 0;
  visibility: hidden;
  display: block;
}
.clearfix {
  *zoom: 1;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.submit-loading {
  border-color: #666 !important;
  background: #666 !important;
}

.write-review-form {
  width: 495px;
  float: left;
  height: 590px;
  overflow: auto;
  overflow-x: hidden;
  li {
    margin-bottom: 15px;
  }
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
  .review-comment {
    width: 100%;
    height: 200px;
    box-sizing: border-box;
    padding: 15px;
  }
  .error-tip {
    color: #f00;
  }
  .rating {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    label {
      margin-bottom: 0;
    }
    .error-tip {
      margin-top: 0;
    }
  }
  .bad-reason {
    label {
      display: block;
      span {
        color: var(--color-999999);
      }
      p {
        display: inline;
        font: 13px;
        color: var(--color-ff0000);
        margin-left: 15px;
      }
    }
    .reason-list {
      display: flex;
      padding: 5px 0;
      flex-wrap: wrap;
      .reason-item {
        margin-top: 10px;
        padding: 4px 10px 3px 10px;
        border-radius: 20px;
        background: var(--color-f9f9f9);
        color: var(--color-999999);
        border: 1px solid var(--color-f9f9f9);
        cursor: pointer;
        &.selected {
          border-color: var(--color-121212);
          color: var(--color-121212);
          background: #fff;
        }
        margin-right: 10px;
      }
    }
  }
  .starx-wrap {
    margin: -4px 6px 0;
  }
  .fit {
    text-align: left;
    margin-top: 15px;
    margin-bottom: 0;
    position: relative;
    .starx-wrap_fit {
      position: relative;
      background: url(~assets/images/write_review/write_review.png) no-repeat 0 0px;
      width: 218px;
      height: 8px;
      margin: 5px 0 6px 10px;
      .fit-item-dot {
        position: absolute;
        top: 0;
        z-index: 10;
        width: 10px;
        height: 10px;
        cursor: pointer;
        border-radius: 50%;
        &.selected {
          background: var(--color-121212);
        }
        &:nth-child(1) {
          left: -5px;
        }
        &:nth-child(2) {
          left: calc(25% - 5px);
        }
        &:nth-child(3) {
          left: calc(50% - 5px);
        }
        &:nth-child(4) {
          left: calc(75% - 5px);
        }
        &:nth-child(5) {
          left: calc(100% - 5px);
        }
      }
    }
    .lable_fit {
      margin-bottom: 0px;
      margin-left: 0 !important;
      clear: both;
      line-height: 15px;
      label {
        float: left;
        margin-right: 10px;
        font-family: @font-family-600, sans-serif;
        text-transform: uppercase;
        &.click_show {
          color: var(--color-121212);
          visibility: visible;
        }
      }
      .hidden {
        visibility: hidden;
      }
      .fit_small {
        width: 42px;
        word-break: break-all;
      }
      .double {
        width: 50px;
        word-break: break-all;
      }
      .fit_large {
        margin-right: 0;
      }
    }
    .error-tip-fit {
      font-size: 13px;
      font-family: @font-family-500;
      color: var(--color-ff0000);
      margin-top: 0;
      margin-bottom: 15px;
      &.right-fixed {
        float: left;
      }
    }
  }
  .popframe {
    margin-bottom: 20px;
    .upload-title {
      font-family: @font-family-600, sans-serif;
      margin: 6px 0;
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 5px;
      color: var(--color-121212);
    }
    .upload-tips {
      font-size: 13px;
      margin-top: 6px;
      margin-bottom: 10px;
      color: var(--color-666666);
    }
    /deep/ .upload-list {
      margin-bottom: 0;
      width: 100%;
      .item {
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .line_addition {
    width: 100%;
    border-bottom: 1px solid #ebebeb;
    margin-top: 20px;
  }
  .additional-title {
    font-family: @font-family-600, sans-serif;
    font-size: 13px;
    color: var(--color-121212);
    margin-bottom: 10px;
    margin-top: 20px;
    span {
      color: var(--color-999999);
    }
  }
  .additional-item-block {
    display: flex;
    & > div {
      flex: 1;
      margin-right: 12px;
      margin-bottom: 20px;
      &:last-child {
        margin-right: 0;
      }
      select,
      input {
        width: 100%;
        padding: 0 10px;
        font-family: @font-family-500, sans-serif;
        height: 40px;
        box-sizing: border-box;
        border-color: #ccc;
        &::placeholder {
          color: var(--color-999999);
        }
      }
      select {
        background: #fff;
        line-height: 28px;
        &.placeholder-value {
          color: var(--color-999999);
        }
        option,
        &.placeholder-value option {
          color: var(--color-121212);
        }
      }
      input {
        &:focus {
          border-color: var(--color-121212);
        }
      }
    }
  }
  .reviews-list-additional {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 903px;
    &:last-child {
      margin-bottom: 0;
    }
    .measurements {
      width: 100%;
    }
    .tip {
      display: flex;
      justify-content: space-between;
      .tip-item {
        width: calc((100% - 30px) / 3);
      }
    }
    .body_type,
    .size_ordered,
    .height {
      position: relative;
      width: calc((100% - 30px) / 3);
    }
    select,
    input {
      width: 100%;
      padding: 0 10px;
      font-family: @font-family-500, sans-serif;
      height: 40px;
      box-sizing: border-box;
      border-color: #ccc;
      &::placeholder {
        color: var(--color-999999);
      }
    }
    select {
      background: #fff;
      line-height: 28px;
      appearance: none;
      &.placeholder-value {
        color: var(--color-999999);
      }
      option,
      &.placeholder-value option {
        color: var(--color-121212);
      }
    }
    input {
      &:focus {
        border-color: var(--color-121212);
      }
    }
    .icon-select {
      width: 10px;
      height: 10px;
      position: absolute;
      right: 15px;
      top: 16px;
    }
  }
  .privacy-policy-box {
    margin-top: 10px;
    font-size: 12px;
    line-height: 16px;
    color: #999;
    a {
      color: #999;
      text-transform: uppercase;
      text-decoration: underline;
    }
  }
}

.comment-prod {
  h2 {
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  table {
    width: 100%;
  }
  td {
    background: #fff;
    height: 102px;
  }
  .pic {
    width: 197px;
    border: 10px solid #f6f6f6;
    img {
      width: 179px;
      height: 278px;
    }
  }
  .desc {
    padding-left: 0;
    text-align: center;
    h3 {
      font-weight: normal;
    }
  }
  a {
    color: var(--color-121212);
  }
  .goods-nodeal-price {
    color: var(--color-999999);
    text-decoration: line-through;
  }
}

.comment-tips {
  color: #666;
  line-height: 12px;
  font-size: 12px;
  h3 {
    margin: 33px 0 12px;
  }
  p {
    margin-bottom: 13px;
  }
}
.btn-submit {
  width: 200px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  padding: 0 !important;
  border-radius: 0;
}
</style>
