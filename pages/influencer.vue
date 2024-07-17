<template>
  <main-app :navigation="navigation">
    <div class="influencer">
      <a :href="countryUrl(`/`)" aria-label="header logo" class="azazie-logo">
        <span style="display: none">header-logo</span>
      </a>
      <p class="influencer-program">{{ nl('page_influencer_grogram') }}</p>
      <p class="influencer-discover">{{ nl('page_influencer_discover') }}</p>
      <p class="influencer-des">{{ nl('page_influencer_description') }}</p>
      <az-button @click="clickApplyToday" class="btn btn-default">{{ nl('page_influencer_apply_today') }}</az-button>
      <!-- <p class="influencer-des">
        Already an Influencer? <a :href="countryUrl(loginHref)">{{ nl('page_lp_app_sign_in') }}</a>
      </p> -->
      <div class="img-box">
        <img
          v-show="imgLoaded"
          @load="imgLoaded = true"
          src="https://cdn-1.azazie.com/upimg/userfiles/images/1/7d/e0/a48f021bb1fda5e71793a43db8ec7de0.jpg"
          alt="influencer banner"
        />
        <div v-if="!imgLoaded" class="default-img">
          <img :src="require('~/assets/images/default_img.jpg')" alt="default img" />
        </div>
      </div>
      <div class="step-box">
        <div v-for="(item, index) in steps" :key="index" class="step-item">
          <h3>{{ item.name }}</h3>
          <p>{{ item.des }}</p>
        </div>
      </div>
      <p class="influencer-cash">{{ nl('page_influencer_cash_in') }}</p>
      <az-button @click="clickApplyToday" class="btn btn-default">{{ nl('page_influencer_apply_today') }}</az-button>
      <!-- <p class="influencer-des">
        Already an Influencer? <a :href="countryUrl(loginHref)">{{ nl('page_lp_app_sign_in') }}</a>
      </p> -->
      <influencer-apply :visible.sync="applyVisible" @onResult="handleResult"></influencer-apply>
      <az-dialog :visible.sync="successVisible" width="665px" height="486px">
        <div class="apply-success">
          <az-icon icon-class="icon-icon-success"></az-icon>
          <p>
            {{ nl('page_influencer_thank_you_applying') }}
          </p>
          <az-button @click="successVisible = false" class="btn btn-default">{{ nl('page_common_ok') }}</az-button>
        </div>
      </az-dialog>
      <az-dialog :visible.sync="resultVisible">
        <div class="apply-result">
          <p v-html="nl(resultTips)"></p>
        </div>
      </az-dialog>
    </div>
  </main-app>
</template>

<script>
import mainApp from '@/components/Main'
import InfluencerApply from '@/components/influencer/InfluencerApply'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzDialog from '@/components/az-ui/AzDialog'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'LookBook',
  components: {
    mainApp,
    InfluencerApply,
    AzButton,
    AzDialog
  },
  data() {
    return {
      imgLoaded: false,
      loginHref: '',
      applyVisible: false,
      successVisible: false,
      resultVisible: false,
      resultTips: ''
    }
  },
  computed: {
    steps() {
      return [
        {
          name: this.nl('page_influencer_step1'),
          des: this.nl('page_influencer_step1_des')
        },
        {
          name: this.nl('page_influencer_step2'),
          des: this.nl('page_influencer_step2_des')
        },
        {
          name: this.nl('page_influencer_step3'),
          des: this.nl('page_influencer_step3_des')
        }
      ]
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      // 获取是否是门店或网红身份接口
      const res = await context.$axios.$get('/1.0/referrer/user-identity')

      context.store.commit('setJsKey', 'influencer')
      return {
        ...commonAsyncData,
        influencerStatus: res.data.influencerStatus
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
    const loginUrl = '/user/login'
    this.loginHref = loginUrl // 设置登录地址
    // 拿到当前url地址的所有参数
    const url = this.$route.query
    /*
      无论什么场景下，进入到登录注册页，如果url中有back，带上即可
      判断当前地址路径中是否有back参数，如果有，说明是从其他场景过来，已经进入/user/login路径下，
      因为登录注册页存在用户来回点击的情况，所以拿back参数直接拼接loginHref和signUpHref
      如果没有back，说明是直接进入到/user/login目录下，无需关心参数处理
    */
    if (url.back) {
      this.loginHref += '?back=' + url.back
    }
    // 如果jsKey不是login，说明不在登录注册页，此时sign in和sign up的跳转路径上，应该带上当前页面路径
    if (this.jsKey !== 'login') {
      this.loginHref = `${loginUrl}?back=${encodeURIComponent(location.href)}`
    }
  },
  methods: {
    // 点击申请，如果没有登录，去登录，已登录，弹框
    clickApplyToday() {
      if (this.isLogin) {
        // 如果是网红，弹出提示，否则，尽心申请操作
        if (this.influencerStatus === 2) {
          this.resultTips = this.nl('page_influencer_go_to_influencer')
          this.resultVisible = true
        } else if (this.influencerStatus === 1) {
          this.resultTips = this.nl('page_common_referrer_email_existed')
          this.resultVisible = true
        } else {
          this.applyVisible = true
        }
      } else {
        location.href = this.countryUrl(this.loginHref)
      }
    },
    handleResult(e) {
      if (e.code === 0) {
        this.successVisible = true
      } else {
        this.resultTips = e.msg
        this.resultVisible = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.influencer {
  text-align: center;
  .azazie-logo {
    display: block;
    width: 319px;
    height: 41px;
    margin: 50px auto 11px;
    background: url(~assets/images/common/azazie_logo.svg) no-repeat;
    background-size: contain;
  }
  &-program {
    font-size: 18px;
    font-family: @font-family;
    font-weight: 300;
    line-height: normal;
    letter-spacing: 3.6px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  &-discover {
    font-size: 24px;
    font-family: @font-family-500;
    margin-bottom: 20px;
  }
  &-des {
    width: 600px;
    margin: 0 auto;
    font-size: 16px;
    line-height: 26px;
    /deep/ a {
      text-decoration: underline;
      color: var(--color-121212);
    }
  }
  &-cash {
    margin-bottom: 10px;
    font-size: 24px;
    font-family: @font-family-600;
  }
  .btn {
    margin: 30px 0px 10px;
    width: 400px;
    height: 60px;
    font-size: 18px;
  }
  .img-box {
    margin-top: 30px;
    margin-bottom: 20px;
    img {
      width: 100%;
    }
    .default-img {
      width: 100%;
      height: 36.09vw;
      min-height: 462px;
      background: #f7f7f7;
      text-align: center;
      img {
        width: auto;
        height: 100%;
      }
    }
  }
  .step {
    &-box {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
    }
    &-item {
      width: 371px;
      padding: 20px 30px;
      h3 {
        font-size: 24px;
        font-family: @font-family-600;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        line-height: 26px;
      }
    }
  }
  .apply-success {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .az-icon {
      width: 60px;
      height: 60px;
      fill: var(--color-5fa452);
    }
    p {
      margin: 40px 0px;
    }
    .btn {
      width: 190px;
      height: 45px;
    }
  }
  .apply-result {
    text-align: center;
    /deep/ a {
      color: @theme-color;
    }
  }
}
</style>
