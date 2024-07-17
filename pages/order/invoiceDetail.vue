<template>
  <div class="App">
    <div v-if="ticketInfo" class="oxxo-ticket">
      <div class="ticket">
        <header>
          <div class="merchant-bank">
            <div class="merchant-logo">
              <img
                :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/5b/e5/bce4b847d70640b55df5075f3d6c5be5.png')"
                alt="logo"
                class="logo"
              />
            </div>
            <div class="line"></div>
            <div class="bank-logo">
              <img
                id="logo-banco"
                :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/b5/38/eb9fd8cc56b70e415bd80da247c0b538.png')"
                class="logo"
                alt="logo"
              />
            </div>
          </div>
        </header>
        <div>
          {{ nl('page_checkout_oxxo_code_tips') }}
        </div>
        <main>
          <h1 class="title">{{ nl('page_checkout_oxxo_code_datos') }}</h1>
          <h2 class="subtitle">{{ nl('page_checkout_oxxo_code_monto') }}{{ ticketInfo.showAmount }}</h2>
          <div class="ticket">
            <div class="row">
              <label class="left-label">{{ nl('page_checkout_oxxo_code_fecha') }}</label
              ><label class="bold-label right-label">{{ ticketInfo.expiredDate }}</label>
            </div>
          </div>
          <div class="barcodeNew">
            <div>
              <div>
                <img id="barcode" alt="barcode" />
              </div>
              <p class="bold-label">{{ ticketInfo.code }}</p>
            </div>
          </div>
        </main>
        <footer>
          <div class="actions center no-print">
            <button @click="handleBack" class="grey-button">{{ nl('page_checkout_oxxo_code_save_btn') }}</button>
            <button @click="handlePrint" class="btn blue-button">{{ nl('page_checkout_oxxo_code_btn_imprimir') }}</button>
          </div>
          <div>
            <div class="more-data">
              <ul>
                <li>{{ nl('page_checkout_oxxo_code_desc1') }}</li>
                <li>{{ nl('page_checkout_oxxo_code_desc2') }}</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  components: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      const apiUrl = '/1.0/order/ticket-code'
      const res = await context.$axios.$post(apiUrl, query)
      let ticketInfo = {}
      if (res.code == 0) {
        ticketInfo = res.data
      } else if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, context, `/user/login?back=${context.route.fullPath}`)
        return
      } else {
        context.redirect(302, '/order/list')
        return
      }
      return {
        ...commonAsyncData,
        ticketInfo
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
    const options = {
      displayValue: false,
      height: 60
    }
    const element = document.getElementById('barcode')
    window.JsBarcode &&
      this.ticketInfo &&
      this.ticketInfo.code &&
      window.JsBarcode(element, this.ticketInfo.code.replaceAll('-', ''), options)
  },
  methods: {
    handleBack() {
      window.location.href = this.countryUrl(`/order/detail?order_sn=${this.$route.query.order_sn}`)
    },
    handlePrint() {
      window.print()
    }
  }
}
</script>
<style lang="less" scoped>
.App {
  text-align: center;
  padding-top: 40px;
  padding-bottom: 40px;
  width: 100%;
  display: inline-block;
}

.oxxo-ticket {
  display: inline-block;
  font-family: 'intro' !important;
  width: 100%;
  height: 100%;
  max-width: 600px;
  .ticket {
    left: calc(50% - 320px);
    max-width: 640px;
    .merchant-bank {
      text-align: left;
      width: 100%;
      display: inline-block;
      padding-bottom: 20px;
      display: flex;
      align-items: center;
      .line {
        width: 2px;
        height: 70px;
        background: #dddddd;
        margin: 0 20px;
      }
      img {
        height: 50px;
      }
      .merchant-logo {
        img {
          height: 45px;
        }
      }
    }

    .App-header {
      padding-top: 15px;
      width: 100%;
      height: 60px;
    }

    main {
      //max-height: 320px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-top: 60px;
      padding: 50px 0 50px;
    }

    .dlocal-logo {
      width: 115px !important;
      margin-bottom: 20px;
      margin-top: 17px;
      float: right;
    }

    .sample-logo {
      height: 60px !important;
      float: left;
    }

    .container {
      margin: 25px auto;
      width: 100%;
      position: relative;
      max-width: 650px;
    }

    .container section {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-pack: center;
      justify-content: center;
      position: relative;
      -ms-flex: auto;
      flex: auto;
      min-width: 100%;
      min-height: 500px;
      align-items: center;
      border-radius: 5px;
      border: 1px solid #ddd;
    }

    .description-label {
      margin-top: 32px;
    }

    .title {
      font-size: 18px;
      color: #036bfb;
      display: block;
    }

    .subtitle {
      font-size: 16px;
      display: block;
    }

    .description {
      padding: 32px;
      display: block;
    }

    .amount {
      font-size: 24px;
      padding: 8px;
      display: block;
    }

    .bold-label {
      font-weight: bold;
    }

    .bold-blue-label {
      font-weight: bold;
      color: #036bfb;
    }

    .left-label {
      float: left;
    }

    .right-label {
      float: right;
    }

    .approved-label {
      color: #036bfb;
      font-size: 20px;
      font-weight: bold;
    }

    .expired-label {
      color: #cc3736;
      font-size: 20px;
      font-weight: bold;
    }

    .ticket-container {
      width: 80%;
      padding: 25px;
    }

    button {
      color: #fff;
      box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
      margin: 30px 10px 30px 10px;
      text-transform: uppercase;
      padding: 7px 0px 7px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 5px;
      min-width: 150px;
      text-align: center;
      transition: all 0.2s ease;
    }

    button.blue-button {
      background-color: #036bfb;
      border-color: #036bfb;
    }

    .outline-blue {
      background-color: #fff;
      color: #036bfb;
      border-color: #036bfb;
      cursor: pointer;
      border-radius: 5px;
      text-transform: none;
    }

    button.grey-button {
      background-color: #9d9d9d;
      border-color: #9d9d9d;
    }

    button.grey-button:hover,
    button.grey-button:active {
      background-color: #636161;
      border-color: #636161;
    }

    button.blue-button:hover,
    button.blue-button:active {
      background-color: #0046a5;
      border-color: #0046a5;
    }

    button.red-button {
      background-color: transparent;
      color: #cc3736;
    }

    button.red-button:hover,
    button.red-button:active {
      border-color: #cc3736;
    }

    button.back-button {
      display: inline-block;
    }

    .ticket {
      width: 80%;
      display: inline-block;
      padding: 8px;
      background-color: #fff;
    }

    .row {
      width: 100%;
      display: inline-block;
      padding-top: 6px;
      padding-bottom: 6px;
      border-bottom: 1px solid #ddd;
    }

    .code {
      width: 100%;
      display: inline-block;
      padding-top: 10px;
    }

    .bar-code-box {
      display: inline-block !important;
      width: 50%;
      box-sizing: border-box;
      text-align: center;
      position: absolute;
      top: 5px;

      p,
      img {
        position: relative !important;
        top: auto !important;
      }

      img {
        max-width: 80% !important;
      }

      :first-child {
        margin: 0.4rem auto;
      }
    }

    .barcode-string {
      padding-top: 7px;
      word-wrap: break-word;
    }

    .row svg {
      width: 90%;
    }

    .more-data {
      display: inline-block;
      text-align: left;
      margin: 20px 20px 20px 0px;
      color: #5e5e5e;
      li {
        list-style: none;
        &:not(:nth-child(1)) {
          margin-top: 20px;
        }
      }
    }

    a.blue-label {
      color: #3869e9;
      cursor: pointer;
      text-decoration: none;
    }

    @media (max-width: 750px) {
      left: 0px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
}
</style>
