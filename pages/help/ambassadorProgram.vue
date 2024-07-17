<template>
  <div>
    <!-- ambassador（校园大使）落地页 -->
    <main-app :navigation="navigation" :adaptive="true">
      <div class="ambassador-content">
        <template v-if="['US', 'CA', 'GB', 'AU'].includes(country)">
          <div
            v-track.view="{
              common: {
                ec: 'ambassador landing page',
                el: 'landing page'
              }
            }"
            class="banner-content"
          >
            <img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/f0/af/5ccf38347c1190ad2f7f367ebe75f0af.jpeg')"
              alt="banner"
            />
            <div class="banner-content-tip">
              <div class="banner-azazie-title"><i class="azazie-logo small-logo"></i></div>
              <h3 class="banner-tip">{{ nl('page_ambassador_banner_ambassador') }}</h3>
              <p class="banner-tip2">{{ nl('page_ambassador_banner_tip3') }}</p>
              <az-button
                @click="handleApply"
                v-track.click="{
                  common: {
                    ec: 'ambassador banner',
                    el: 'apply here'
                  }
                }"
                class="btn btn-theme"
              >
                {{ nl('page_ambassador_apply_here') }}
              </az-button>
            </div>
          </div>

          <h4 class="content-title">{{ nl('page_ambassador_how_work') }}</h4>
          <ul class="how-todo">
            <li v-for="(item, index) in howTodoList" :key="item.tag">
              <h5>
                <i>0{{ index + 1 }}</i
                ><span>{{ nl(item.title) }}</span>
              </h5>
              <p>{{ nl(item.content) }}</p>
            </li>
          </ul>

          <div class="ambassador-perks">
            <h4>{{ nl('page_ambassador_perks') }}</h4>
            <div class="ambassador-tag">
              <div v-for="item in tagList" :key="item.title">
                <img :src="replaceImgCdnUrl(item.imgUrl)" alt="ambassador" />
                <p>{{ nl(item.title) }}</p>
                <span v-html="nl(item.content)" class="ambassador-tag-content"></span>
              </div>
            </div>
          </div>

          <!-- 底部FAQ -->
          <h4 class="content-title">{{ nl('page_ambassador_qa_title_new') }}</h4>
          <ul class="ambassador-faq">
            <li v-for="(item, index) in faqContent" :key="item.question">
              <p @click="toogleFaqShow(item, index)" class="faq_q">
                <span>{{ nl(item.question) }}</span> <i>{{ item.show ? '–' : '+' }}</i>
              </p>
              <p
                v-if="item.show"
                v-html="
                  ['page_ambassador_qa_answer_three', 'page_ambassador_qa_answer_eight', 'page_ambassador_qa_answer_ten'].includes(
                    item.answer
                  )
                    ? nl(item.answer + `${country !== 'US' ? `_${country.toLowerCase()}` : ''}`)
                    : nl(item.answer)
                "
                class="faq_a"
              ></p>
            </li>
          </ul>
        </template>
        <template v-else>
          <div
            v-track.view="{
              common: {
                ec: 'ambassador landing page',
                el: 'coming soon'
              }
            }"
            class="banner-content"
          >
            <img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/33/01/84c9b50c408ded6f11e778cba4833301.jpg')"
              alt="banner"
            />
            <p class="coming-soon">{{ nl('page_common_coming_soon') }}</p>
          </div>
        </template>
        <back-to-top></back-to-top>
      </div>
    </main-app>
    <toast-popup ref="toastPopup" :content="toastContent"></toast-popup>
    <apply-form ref="applyForm"></apply-form>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import ToastPopup from '@/components/help/ambassadorProgram/ToastPopup'
import ApplyForm from '@/components/help/ambassadorProgram/ApplyForm'
import AzButton from '@/components/az-ui/Button/AzButton'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'

export default {
  name: 'Ambassador',
  components: {
    mainApp,
    backToTop,
    ToastPopup,
    ApplyForm,
    AzButton
  },
  data() {
    return {
      toastContent: '',
      showToast: false,
      faqContent: [
        {
          question: 'page_ambassador_qa_question_one',
          answer: 'page_ambassador_qa_answer_one'
        },
        {
          question: 'page_ambassador_qa_question_two',
          answer: 'page_ambassador_qa_answer_two'
        },
        {
          question: 'page_ambassador_qa_question_three',
          answer: 'page_ambassador_qa_answer_three'
        },
        {
          question: 'page_ambassador_qa_question_four',
          answer: 'page_ambassador_qa_answer_four'
        },
        {
          question: 'page_ambassador_qa_question_five',
          answer: 'page_ambassador_qa_answer_five'
        },
        {
          question: 'page_ambassador_qa_question_six',
          answer: 'page_ambassador_qa_answer_six'
        },
        {
          question: 'page_ambassador_qa_question_seven',
          answer: 'page_ambassador_qa_answer_seven'
        },
        {
          question: 'page_ambassador_qa_question_eight',
          answer: 'page_ambassador_qa_answer_eight'
        },
        {
          question: 'page_ambassador_qa_question_nine',
          answer: 'page_ambassador_qa_answer_nine'
        },
        {
          question: 'page_ambassador_qa_question_ten',
          answer: 'page_ambassador_qa_answer_ten'
        },
        {
          question: 'page_ambassador_qa_question_eleven',
          answer: 'page_ambassador_qa_answer_eleven'
        }
      ]
    }
  },
  computed: {
    ...mapState('userInfo', ['ambassadorData']),
    tagList() {
      return [
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/4f/2c/1dc931cd34bfeefa41df7ab816bd4f2c.png',
          title: 'page_ambassador_tag_perks_title1',
          content: 'page_ambassador_tag_perks_content_new1'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/e7/90/88cd6b2197730733c62cdefa7787e790.png',
          title: 'page_ambassador_tag_perks_title2',
          content: 'page_ambassador_tag_perks_content2'
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/d8/52/45b37f074c85009ab1166d66d548d852.png',
          title: 'page_ambassador_tag_perks_title3',
          content: `page_ambassador_tag_perks_content3${this.country !== 'US' ? `_${this.country.toLowerCase()}` : ''}`
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/4b/83/6fda72c3b66eafd9e6bbb16a03b84b83.png',
          title: 'page_ambassador_tag_perks_title4',
          content: `page_ambassador_tag_perks_content4${this.country !== 'US' ? `_${this.country.toLowerCase()}` : ''}`
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/b9/af/223d81a7de6d53298f5ba9c2a47ab9af.png',
          title: 'page_ambassador_tag_perks_title5',
          content: `page_ambassador_tag_perks_content_new5`
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/25/81/103ca625b633b78056b65b657dd62581.png',
          title: 'page_ambassador_tag_perks_title6',
          content: `page_ambassador_tag_perks_content_new6`
        }
      ]
    },
    howTodoList() {
      return [
        {
          title: 'page_checkout_apply',
          content: 'page_ambassador_tag_content1'
        },
        {
          title: 'page_common_share',
          content: 'page_ambassador_tag_content2'
        },
        {
          title: 'page_ambassador_tag',
          content: 'page_ambassador_tag_content3'
        }
      ]
    }
  },
  watch: {
    isLogin(newVal, oldVal) {
      if (newVal && this.$route.query.hasOwnProperty('show_ambassador_apply')) {
        this.$router.replace('/ambassador-program')
        this.handleApply()
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      context.store.commit('setJsKey', 'ambassador')
      return {
        ...commonAsyncData
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
  mounted() {
    const utmSource = this.$route.query.utm_source
    if (utmSource)
      this.buryPoint(this, 'event', {
        ec: 'ambassador landing page',
        el: utmSource,
        ea: 'view'
      })
  },
  methods: {
    // 点击apply here打开弹窗
    handleApply() {
      // 已登录
      if (this.isLogin) {
        if (this.ambassadorData.isAmbassador) {
          // 合作结束
          if (this.ambassadorData.ambassadorStatus === 'End cooperation') this.$refs.applyForm.toogleShow()
          else {
            // 申请已通过isAmbassadorLimit:true生效中，false:过期
            this.toastContent = this.ambassadorData.isAmbassadorLimit
              ? this.nl('page_ambassador_popup_pc_tip1')
              : this.nl('page_ambassador_popup_pc_tip3')
            this.$refs.toastPopup.toogleShow()
            this.buryPoint(this, 'event', {
              ec: 'ambassador banner',
              el: this.ambassadorData.isAmbassadorLimit ? 'already an ambassador' : 'expired',
              ea: 'view'
            })
          }
        } else if (this.ambassadorData.ambassadorStatus === 'Unprocessed') {
          // 申请审核中
          this.toastContent = this.nl(`page_ambassador_popup_tip2${this.country !== 'US' ? `_${this.country.toLowerCase()}` : ''}`)
          this.$refs.toastPopup.toogleShow()
          this.buryPoint(this, 'event', {
            ec: 'ambassador banner',
            el: 'processing',
            ea: 'view'
          })
        } else {
          // 进入表单填写
          this.$refs.applyForm.toogleShow()
        }
      } else {
        // 未登录跳转至登录页（登陆后回来自动打开弹窗）
        // this.$router.push('/user/login?back=' + encodeURIComponent(location.origin + '/ambassador-program?show_ambassador_apply=true'))
        // 未登录调整为进入表单填写
        this.$refs.applyForm.toogleShow()
      }
    },
    toogleFaqShow(item, index) {
      this.faqContent.splice(index, 1, { ...item, show: !item.show })
    }
  }
}
</script>

<style lang="less" scoped>
.banner-module-position {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.ambassador-content {
  .banner-content {
    position: relative;
    width: 100%;
    min-width: 1293px;
    img {
      width: 100%;
    }
    .banner-content-tip {
      &:extend(.banner-module-position);
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
    }
    .banner-tip {
      width: 100%;
      text-align: center;
      color: #121212;
      font-family: @font-Ivy-Mode-400;
      font-size: 7.2vw;
      letter-spacing: 21px;
      margin-top: 25px;
      font-weight: normal;
    }
    @media screen and (min-width: 1900px) {
      .banner-tip {
        font-size: 140px;
      }
    }
    @media screen and (max-width: 1263px) {
      .banner-tip {
        font-size: 80px;
      }
    }
    .banner-tip2 {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 1.6vw;
      line-height: normal;
      letter-spacing: 1.6px;
      margin-top: 10px;
    }
    @media screen and (min-width: 1900px) {
      .banner-tip2 {
        font-size: 32px;
      }
    }
    @media screen and (max-width: 1263px) {
      .banner-tip2 {
        font-size: 28px;
      }
    }
    .btn {
      width: 300px;
      height: 60px;
      font-weight: 600;
      font-size: 24px;
      color: #fff;
      text-align: center;
      font-family: @font-family-600;
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      background: #121212;
      text-transform: uppercase;
      margin-top: 3.3vw;
    }
    @media screen and (min-width: 1900px) {
      .btn {
        margin-top: 65px;
      }
    }
    @media screen and (max-width: 1263px) {
      .btn {
        margin-top: 30px;
      }
    }
    .coming-soon {
      &:extend(.banner-module-position);
      bottom: 174px;
      font-family: @font-Ivy-Mode-400;
      font-size: 80px;
      color: #ffffff;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-shadow: 2px 2px 10px rgba(51, 51, 51, 0.5);
    }
  }
  .content-title {
    font-family: @font-family-600;
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    letter-spacing: 0.64px;
    text-align: center;
    margin-top: 100px;
    margin-bottom: 50px;
    color: #121212;
    min-width: 1293px;
  }
  .ambassador-faq {
    width: 1293px;
    margin: 0 auto 50px;
    li {
      border-bottom: 1px solid #eee;
      padding: 15px 0;
    }
    .faq_q {
      font-family: @font-family-500;
      position: relative;
      cursor: pointer;
      span {
        font-size: 13px;
        color: var(--color-121212);
        font-family: @font-family-500;
      }
      i {
        position: absolute;
        right: 0;
        font-size: 26px;
        line-height: 18px;
        color: var(--color-121212);
        font-weight: 400;
        cursor: pointer;
        font-style: normal;
      }
    }
    /deep/ .faq_a {
      margin-top: 15px;
      font-family: @font-family-500;
      font-size: 13px;
      color: var(--color-121212);
      a {
        text-decoration: underline;
        color: @theme;
      }
    }
  }
  .how-todo {
    display: flex;
    width: 1293px;
    margin: 0 auto;
    li {
      width: 431px;
      padding: 20px 30px;
      box-sizing: border-box;
      h5 {
        position: relative;
        font-family: @font-family-600;
        font-style: normal;
        font-size: 32px;
        text-align: center;
        letter-spacing: 0.64px;
        color: #121212;
        text-transform: uppercase;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          font-family: @font-Ivy-Mode-400;
          font-size: 60px;
          color: var(--color-999999);
          margin-right: 10px;
        }
        &::after {
          content: '';
          position: absolute;
          width: 177px;
          height: 1px;
          background: var(--color-121212);
          left: 310px;
        }
      }
      &:last-child {
        h5 {
          &::after {
            display: none;
          }
        }
      }
      p {
        font-family: @font-family-500;
        font-style: normal;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        letter-spacing: 0.64px;
        color: #121212;
        margin-top: 20px;
      }
    }
  }
}
.ambassador-perks {
  margin-top: 80px;
  padding: 100px 0;
  background: #f1e9e6;
  h4 {
    color: #121212;
    text-align: center;
    font-family: @font-family-600;
    font-size: 32px;
    font-style: normal;
    width: 1292px;
    margin: auto;
    letter-spacing: 0.64px;
  }
  .ambassador-tag {
    display: flex;
    flex-wrap: wrap;
    width: 1292px;
    margin: 0 auto;
    & > div {
      margin-top: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: var(--color-121212);
      width: calc(100% / 3);
      p {
        color: #121212;
        text-align: center;
        font-family: @font-family-600;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0.8px;
        margin-top: 10px;
      }

      & > span {
        display: block;
        margin-top: 30px;
        width: 360px;
        &.ambassador-tag-content {
          color: #121212;
          text-align: center;
          font-family: @font-family-500;
          font-size: 16px;
          line-height: normal;
          letter-spacing: 0.64px;
        }
      }
    }
    img {
      display: block;
      height: 100px;
    }
    /deep/ .highlight-txt {
      font-family: @font-family-600;
      color: #121212;
      font-size: 16px;
      // font-weight: 600;
      letter-spacing: 0.64px;
    }
  }
}
.azazie-logo {
  display: block;
  width: 214px;
  height: 28px;
  margin: auto;
  background: url(~assets/images/common/azazie_logo.svg) no-repeat;
  background-size: contain;
}
</style>
