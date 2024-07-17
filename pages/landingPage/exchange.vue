<template>
  <div class="exchange">
    <main-app :navigation="navigation">
      <div class="exchange-header">
        <h1>{{ nl('page_exchange_header_title') }}</h1>
        <p v-html="nl('page_exchange_header_des')"></p>
      </div>
      <div class="exchange-main">
        <div class="exchange-section">
          <div class="exchange-section-img">
            <img
              src="https://cdn-1.azazie.com/upimg/userfiles/email/e0/62/5edbd2718abe738c768effef18a4e062.jpg"
              alt="RETURNS & EXCHANGES"
            />
          </div>
          <div class="exchange-section-info">
            <h2 class="section-title">{{ nl('page_exchange_section1_title') }}</h2>
            <p v-html="nl('page_exchange_section1_des')" class="section-des"></p>
            <ul class="section-info">
              <li class="section-info-item">
                <span class="index">01</span>
                <div>
                  <p v-html="nl('page_exchange_section1_info1')"></p>
                </div>
              </li>
              <li class="section-info-item">
                <span class="index">02</span>
                <div>
                  <p v-html="nl('page_exchange_section1_info2')"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="exchange-section">
          <div class="exchange-section-info">
            <h2 class="section-title">{{ nl('page_exchange_section2_title') }}</h2>
            <p v-html="nl('page_exchange_section2_des')" class="section-des"></p>
            <ul class="section-info">
              <li class="section-info-item">
                <span class="index">01</span>
                <div>
                  <h3>{{ nl('page_exchange_section2_info1_title') }}</h3>
                  <p @click="clickReturnPolicy" v-html="nl('page_exchange_section2_info1_des')"></p>
                </div>
              </li>
              <li class="section-info-item">
                <span class="index">02</span>
                <div>
                  <h3>{{ nl('page_exchange_section2_info2_title') }}</h3>
                  <p v-html="nl('page_exchange_section2_info2_des')"></p>
                </div>
              </li>
              <li class="section-info-item">
                <span class="index">03</span>
                <div>
                  <h3>{{ nl('page_exchange_section2_info3_title') }}</h3>
                  <p v-html="nl('page_exchange_section2_info3_des')"></p>
                </div>
              </li>
            </ul>
            <az-button @click="startMyExchange" class="btn btn-theme">{{ nl('page_exchange_btn_exchange') }}</az-button>
          </div>
          <div class="exchange-section-img">
            <img src="https://cdn-1.azazie.com/upimg/userfiles/email/9f/72/f416e5beb7bdc816ab017a5ff3e99f72.jpg" alt="EXCHANGE POLICY" />
          </div>
        </div>
        <div class="exchange-section">
          <div class="exchange-section-img">
            <img src="https://cdn-1.azazie.com/upimg/userfiles/email/16/b4/c2ae95bb3f60d3503fc7ce5c4ee816b4.jpg" alt="RETURN POLICY" />
          </div>
          <div class="exchange-section-info">
            <h2 class="section-title">{{ nl('page_common_return_policy') }}</h2>
            <p v-html="nl('page_exchange_section3_des')" class="section-des"></p>
            <ul class="section-info">
              <li class="section-info-item">
                <span class="index">01</span>
                <div>
                  <h3>{{ nl('page_exchange_section2_info1_title') }}</h3>
                  <p @click="clickStartReturnProcess" v-html="nl('page_exchange_section3_info1_des')"></p>
                </div>
              </li>
              <!-- <li class="section-info-item">
                <span class="index">02</span>
                <div>
                  <h3>{{ nl('page_exchange_section2_info2_title') }}</h3>
                  <p @click="clickMailIn" v-html="nl('page_exchange_section3_info2_des')"></p>
                </div>
              </li> -->
            </ul>
            <az-button @click="startMyReturn" class="btn btn-theme">{{ nl('page_exchange_btn_return') }}</az-button>
          </div>
        </div>
      </div>
      <div class="exchange-footer">
        <p v-html="nl('page_exchange_footer_des')"></p>
      </div>
      <return-order-layer v-if="returnOrderLayerShow" :returnOrder="returnData" @refreshOrder="handleRefreshOrder"></return-order-layer>
    </main-app>
    <div v-if="message" class="az-message">
      <div class="az-message-content">
        <button @click="message = ''" aria-label="Close button" class="btn-close">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon-close"></az-icon>
        </button>
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import AzButton from '@/components/az-ui/Button/AzButton'
import ReturnOrderLayer from '@/components/order/ReturnOrderLayer'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { mapState } from 'vuex'

/**
 * 订单return items操作中间页
 */
export default {
  components: {
    mainApp,
    AzButton,
    ReturnOrderLayer
  },
  data() {
    return {
      message: '', // 报错提示信息
      returnData: {} // 传递给return-order-layer的数据
    }
  },
  computed: {
    ...mapState('order', ['returnOrderLayerShow']),
    isFromShowContactUs() {
      // 这个退货弹窗出现有两种情况
      // 1.订单可退的情况，returnable为true,这个时候,弹窗页面的显示根据returnMethod里面的数据判断
      // 2.还有一种特殊情况,不可退货的订单会弹出退货弹窗，returnable为false && showContactUs为true,这个时候弹窗内容写死为 happy return 置灰，只显示联系客服
      return !this.returnData.returnable && this.returnData.showContactUs
    },
    hrdisabled() {
      const res =
        this.isFromShowContactUs ||
        (this.returnData.returnMethod &&
          (!this.returnData.returnMethod.happy_return ||
            !this.returnData.returnMethod.happy_return.isShow ||
            !Object.keys(this.returnData.returnMethod.happy_return).length))
      return res
    }
  },
  watch: {
    message(e) {
      const m = function(e) {
        e.preventDefault()
      }
      if (e) {
        // 禁止页面滚动
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', m, false)
      } else {
        // 放开页面滚动
        document.body.style.overflow = ''
        document.removeEventListener('touchmove', m, false)
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      const userInfoRes = await context.$axios.$get(`/1.0/common/user-info`)
      let hasLogin = false
      if (userInfoRes.code == 0) {
        hasLogin = userInfoRes.data.userId != null && userInfoRes.data.userId != undefined && userInfoRes.data.userId != 0
      }
      let apiUrl = '/1.0/order/detail'
      if (!hasLogin && query.email && query.order_sn) {
        apiUrl = '/1.0/order/detail/guest'
        query.email = decodeURIComponent(query.email)
      }

      const res = await context.$axios.$get(apiUrl, { params: query })

      if (res.code == 0) {
      } else if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, resetSeoUrl(context, `/user/login?back=${context.route.fullPath}`))
        return
      } else {
        context.redirect(302, resetSeoUrl(context, '/order/list'))
        return
      }
      context.store.commit('setJsKey', 'return_exchange')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        orderInfo: res.data.orderInfo,
        returnMethodData: {
          orderSn: res.data.orderSn,
          returnMethod: res.data.returnMethod,
          isNewReturnMethod: res.data.isNewReturnMethod,
          onlyRefundable: res.data.onlyRefundable,
          showContactUs: res.data.orderInfo.showContactUs,
          returnable: res.data.orderInfo.returnable
        }
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
      return {
        ...getHeadJson(this)
      }
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  methods: {
    clickReturnPolicy(e) {
      if (e.target.localName === 'a') {
        this.startMyExchange()
      }
    },
    // 点击此处here展示happy return弹框
    async clickStartReturnProcess(e) {
      const res = await this.setReturnFlag()
      if (!res) return
      if (!e || (e && e.target.localName === 'a')) {
        if (this.orderInfo.countryCode !== 'US' && this.orderInfo.returnable && !this.returnData.isNewReturnMethod) {
          location.href = this.countryUrl(`/order/return?order_sn=${this.orderInfo.orderSn}`)
        } else {
          this.$store.commit('order/setReturnOrderLayerShow', true)
        }
      }
    },
    // 点击mail in，进入mail in
    async clickMailIn(e) {
      const res = await this.setReturnFlag()
      if (!res) return
      if (!e || (e && e.target.localName === 'a')) {
        location.href = this.countryUrl(`/order/return?order_sn=${this.orderInfo.orderSn}`)
      }
    },
    // 点击start my exchange
    async startMyExchange() {
      const res = await this.setReturnFlag('exchange')
      if (!res || this.hrdisabled) return
      // 直接跳转到happy return具体操作路径
      location.href = this.returnData.returnMethod.happy_return.url
    },
    // flag传递exchange或者空
    async setReturnFlag(flag = '') {
      const params = {
        orderSn: this.orderInfo.orderSn,
        flag
      }
      try {
        // 设置窗口期状态接口
        const res = await this.$axios.$post('/1.0/happyreturns/setReturnFlag', params)
        if (res && res.code === 0) {
          if (res.data && res.data.orderInfo) {
            this.orderInfo = res.data.orderInfo
            this.returnData = {
              orderSn: res.data.orderSn,
              returnMethod: res.data.returnMethod,
              isNewReturnMethod: res.data.isNewReturnMethod,
              onlyRefundable: res.data.onlyRefundable,
              showContactUs: res.data.orderInfo.showContactUs,
              returnable: res.data.orderInfo.returnable
            }
          } else {
            this.returnData = this.returnMethodData
          }
          if (res.data && res.data.orderInfo && res.data.orderInfo.notExchangeReason) {
            this.message = res.data.orderInfo.notExchangeReason
          } else {
            return true
          }
        } else {
          this.message = res.msg
        }
      } catch (error) {
        console.log(error)
      }
      return false
    },
    // 点击start my return，逻辑跟原有return items一样
    async startMyReturn() {
      const res = await this.setReturnFlag()
      if (!res) return
      if (this.orderInfo.returnable && !this.returnData.isNewReturnMethod) {
        location.href = this.countryUrl(`/order/return?order_sn=${this.orderInfo.orderSn}`)
      } else {
        const result = await this.getReturnChannel()
        const { channel = 'happy_return', provider = null } = result.data || {}
        this.returnData.channel = channel
        this.returnData.provider = provider
        this.returnData.providerCode = result.data.provider_code || ''
        this.$store.commit('order/setReturnOrderLayerShow', true)
      }
    },
    handleRefreshOrder() {
      // 这里只需要退回到上一页即可
      window.history.back()
    },
    async getReturnChannel() {
      const params = {
        order_sn: this.orderInfo.orderSn
      }
      const result = await this.$axios.$get('/1.0/order/smart-return', { params })
      if (result && result.code === 0) {
        return result
      } else {
        return {
          code: 1, // 失败
          data: {}
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.exchange {
  &-header,
  &-footer {
    text-align: center;
    padding: 40px 0px;
    background: #e3abb1;
    color: #ffffff;
    h1 {
      font-family: @font-Ivy-Mode-400;
      font-style: normal;
      font-weight: 400;
      font-size: 42px;
      line-height: 52px;
      margin-bottom: 15px;
    }
    p {
      font-size: 18px;
      line-height: 25px;
      text-align: center;
      text-transform: uppercase;
      /deep/ a {
        color: #fff;
        text-decoration: underline;
      }
    }
  }
  &-footer {
    margin-bottom: 35px;
  }
  &-section {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 33.85vw;
    min-height: 433px;
    > div {
      width: 50%;
      height: 100%;
      box-sizing: border-box;
    }
    &-img {
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-info {
      background: var(--color-f1e9e6);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0px 7.29%;
      .section {
        &-title {
          font-family: @font-Ivy-Mode-400;
          font-style: normal;
          font-weight: 400;
          font-size: 1.875vw;
          line-height: 2.3437vw;
          letter-spacing: 0.04em;
          color: @theme;
          margin-bottom: 0.5208vw;
        }
        &-des {
          font-size: 0.833vw;
          line-height: 1.25vw;
          letter-spacing: 0.04em;
          margin-bottom: 1.5625vw;
          /deep/ a {
            color: @theme;
            text-decoration: underline;
          }
        }
        &-info {
          text-align: left;
          width: 100%;
          &-item {
            display: flex;
            align-items: center;
            margin-bottom: 1.5625vw;
            .index {
              font-family: @font-Ivy-Mode-400;
              font-style: italic;
              font-weight: 400;
              font-size: 1.875vw;
              line-height: 2.3437vw;
              color: var(--color-cccccc);
            }
            div {
              margin-left: 20px;
              font-size: 0.9375vw;
              line-height: 1.302vw;
              letter-spacing: 0.04em;
              h3 {
                font-family: @font-family-600;
                margin-bottom: 2px;
              }
              p {
                /deep/ a {
                  color: @theme;
                  text-decoration: underline;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
      .btn {
        height: 50px;
        min-width: 213px;
      }
    }
  }
}
.az-message {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 12;
  &-content {
    background: #fff;
    padding: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    line-height: 25px;
    text-align: center;
    max-width: 420px;
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
  }
}
@media screen and (max-width: 1280px) {
  .exchange {
    &-section {
      &-info {
        .section {
          &-title {
            font-size: 24px;
            line-height: 30px;
            margin-bottom: 6px;
          }
          &-des {
            font-size: 12px;
            line-height: 16px;
            margin-bottom: 20px;
          }
          &-info {
            &-item {
              margin-bottom: 20px;
              .index {
                font-size: 22px;
                line-height: 30px;
              }
              div {
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .exchange {
    &-section {
      &-info {
        .section {
          &-title {
            font-size: 36px;
            line-height: 45px;
            margin-bottom: 10px;
          }
          &-des {
            font-size: 16px;
            line-height: 24px;
            margin-bottom: 30px;
          }
          &-info {
            &-item {
              margin-bottom: 30px;
              .index {
                font-size: 36px;
                line-height: 45px;
              }
              div {
                font-size: 18px;
                line-height: 25px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
