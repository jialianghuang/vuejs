<template>
  <div id="product_qa">
    <div v-if="questionInfo.questionList && questionInfo.questionList.length > 0">
      <div v-for="(item, key) in questionInfo.questionList" :key="key" class="qa_content">
        <div class="question">
          <div class="qa_header">Q.</div>
          <div class="q_content">
            <p v-html="unescape(item.question)" class="q_text"></p>
          </div>
        </div>
        <div class="answer">
          <div class="qa_header">A.</div>
          <div class="a_content">
            <template v-if="item.answerShort">
              <div v-if="questions[key]" class="a_text_long">
                <p v-html="unescape(item.answer).replace('see less', '')"></p>
              </div>
              <div v-else class="a_text_short">
                <p @click="seeMore(key, $event)" v-html="unescape(item.answerShort)"></p>
              </div>
            </template>
            <p v-else v-html="unescape(item.answer)" class="a_text"></p>
            <div class="qa-bottom-content">
              <div class="a_time">{{ nl('page_goods_by') }} {{ item.answerer }} {{ nl('page_common_on') }} {{ item.time }}</div>
              <div v-if="item.voteInfo" class="question_vote">
                <div class="review_txt">{{ nl('page_review_helpful_vote') }}</div>
                <div class="review_select">
                  <span @click="voteClick(item, key)" class="vote_yes">
                    <az-icon icon-class="iconicon_like" class="icon-vote icon-agree"></az-icon>
                    <span class="vote_num">({{ currentIndex == key ? yes : item.voteInfo.yes }})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="see-all">
        <az-pager
          v-if="questionInfo.questionList.length"
          :totalPage="questionInfo.pageInfo.totalPage"
          :page="page"
          :isLoading="pageLoading"
          @pageChange="pageChange"
        ></az-pager>
      </div>
    </div>
    <div v-else class="empty-content">
      <p class="upper">{{ nl('page_common_0_question') }}</p>
      <span @click="showPopupAskQuest" class="btn-ask-a-question">{{ nl('page_common_to_be_ask_question') }}</span>
    </div>
  </div>
</template>

<script>
import AzPager from '@/components/az-ui/Pager/AzPager'

export default {
  name: 'ProductQaBlock',
  languageKeys: ['page_goods_by', 'page_common_on', 'page_review_helpful_vote', 'page_common_0_question', 'page_common_to_be_ask_question'],
  components: {
    AzPager
  },
  props: {
    value: {
      type: Number,
      default: -1
    },
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    questionInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      questions: {},
      currentIndex: -1,
      yes: 0,
      page: 1,
      pageLoading: false,
      voteFlag: true
    }
  },
  watch: {
    questionInfo(newval) {
      if (newval) {
        const questions = {}
        for (const i in this.questionInfo.questionList) {
          questions[i] = false
        }
        this.questions = questions
      }
    }
  },
  mounted() {},
  methods: {
    voteClick(item, key) {
      if (!this.voteFlag) return
      this.voteFlag = false
      if (this.currentIndex != key) {
        this.yes = item.voteInfo.yes
        this.currentIndex = key
      }
      const cookieValue = localStorage.getItem(`question_vote${item.voteInfo.questionId}`)
      const action = cookieValue == 'yes' ? 'sub' : 'add'
      if (this.yes == 0 && action == 'sub') return false
      this.$axios
        .$post('/1.0/product/goods-question-vote', {
          questionId: item.voteInfo.questionId,
          vote_type: 'yes',
          act_type: action
        })
        .then((res) => {
          this.voteFlag = true
          if (res.code == 0) {
            this.yes = res.data.voteNum
            if (action == 'sub') {
              this.setPoint('questions', 'approvalremove', 'click')
              localStorage.removeItem(`question_vote${item.voteInfo.questionId}`)
            } else {
              this.setPoint('questions', 'approval', 'click')
              localStorage.setItem(`question_vote${item.voteInfo.questionId}`, 'yes')
            }
          }
        })
        .catch((error) => {
          this.voteFlag = true
          console.log(error)
        })
    },
    seeMore(key, event) {
      if (event.target.className.includes('more_content')) this.questions[key] = true
    },
    pageChange(val) {
      this.page = val
      this.$emit('questionsChange', {
        page: this.page,
        isPageChange: true
      })
    },
    showPopupAskQuest() {
      this.$store.commit('product/setPopupAskQuestShow', true)
      const msg = JSON.stringify({ goodsId: this.baseInfo.goodsId, cat_name: this.baseInfo.catName, cat_id: this.baseInfo.catId })
      this.setPoint('customerquestions&answers', 'askaquesiton', 'click', msg)
    },
    setPoint(ec, el, ea, msg = {}) {
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType,
          cat_id: this.baseInfo.catId,
          ...msg
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ a {
  color: var(--color-121212);
  text-decoration: underline;
}
.qa_content {
  padding: 0 0 21px;
  .hide {
    display: none;
  }
  p {
    margin-bottom: 11px;
  }
  .question {
    display: flex;
  }
  .answer {
    margin-top: 2px;
    display: flex;
    line-height: 20px;
  }
  .qa_header {
    font-family: @font-family-600, sans-serif;
    margin-right: 10px;
  }
  .a_content {
    width: 100%;
  }
  .qa-bottom-content {
    display: flex;
    justify-content: space-between;
    .a_time {
      color: #999;
      margin-top: 2px;
    }
    .question_vote {
      padding-left: 20px;
      margin-top: 5px;
      .review_txt {
        display: inline-block;
        color: var(--color-121212);
        margin-right: 6px;
      }
      .review_select {
        display: inline-block;
        color: var(--color-121212);
        .icon-vote {
          fill: currentColor;
        }
        .icon-disagree {
          transform: rotate(180deg);
        }
        .vote_yes,
        .vote_no {
          cursor: pointer;
          &.disabled {
            .icon-vote {
              color: var(--color-cccccc);
            }
            .vote_num {
              color: #999;
            }
          }
        }
        .vote_yes {
          margin-right: 6px;
        }
        .disabled {
          .icon-vote {
            color: var(--color-cccccc);
          }
        }
      }
    }
  }
  /deep/.more_content {
    color: @theme;
    cursor: pointer;
  }
}
.btn_see_more {
  color: var(--color-121212);
  font-size: 13px;
  width: 232px;
  height: 40px;
  line-height: 40px;
  padding: 0;
  border-radius: 0;
  border: 1px solid #ccc;
  background: var(--color-f9f9f9);
}
.see-all {
  padding-top: 28px;
  margin-top: -1px;
  border-top: 1px solid #fff;
  text-align: right;
  margin-bottom: 40px;
  position: relative;
  .see-all-link {
    margin-top: -20px;
    // margin-right: 96px;
    a {
      color: #666;
      text-decoration: underline;
      text-transform: uppercase;
    }
  }
}
.empty-content {
  text-align: center;
  font-size: 16px;
  margin-top: 100px;
  margin-bottom: 100px;
  .upper {
    text-transform: uppercase;
  }
  .btn-ask-a-question {
    text-decoration: underline;
    margin-top: 10px;
    display: block;
    cursor: pointer;
    text-transform: uppercase;
  }
}
</style>
