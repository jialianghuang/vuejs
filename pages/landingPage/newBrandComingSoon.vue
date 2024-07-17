<template>
  <div class="new-brand-coming-soon">
    <main-app :navigation="navigation" :isShowSubscribe="'hide'" :adaptive="true" class="adaptive-box">
      <div class="main-content">
        <img :src="replaceImgCdnUrl(bgUrl)" alt="bg" />
        <div class="input-container">
          <div class="input-box">
            <input
              v-model="email"
              :placeholder="nl('page_placeholder_notify')"
              :class="{ error: rulesResult.email }"
              @focus="rulesResult.email = ''"
              type="text"
            />
            <button @click="submitData">{{ loading ? nl('page_js_processing') : nl('page_common_submit1') }}</button>
          </div>
          <p v-if="rulesResult.email" class="error-tip">{{ rulesResult.email ? rulesResult.email : nl('page_email_enter_valid') }}</p>
          <div v-if="showToast" class="success-toast">
            <span>{{ toastText }}</span>
          </div>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  name: 'NewBrandComingSoon',
  components: {
    MainApp
  },
  data() {
    return {
      bgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/ed/fd/8bff817eb0f3ca8266eb4ee6f1e3edfd.jpg',
      loading: false,
      email: '',
      rulesResult: {
        email: ''
      },
      showToast: false,
      toastText: '',
      successMsg: '',
      validator: null
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      context.store.commit('setJsKey', 'newBrandComingSoon')
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
    const rules = {
      email: formValidatorType.email({ required: this.nl('page_email_enter_email'), validator: this.nl('page_email_enter_valid') })
    }
    this.validator = new Schema(rules)
  },
  methods: {
    submitData() {
      if (this.loading) return false
      this.rulesResult.email = ''
      this.successMsg = ''
      this.validator.validate(
        {
          email: this.email
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesResult[item.field]) {
                this.rulesResult[item.field] = item.message
              }
            })
            return false
          }
          this.loading = true
          this.$axios
            .post(`/1.0/comingSoon/save?email=${this.email}&brand_id=14`)
            .then((res) => {
              this.loading = false
              if (res.data.code == 0) {
                this.showToast = true
                this.toastText = this.nl('page_common_toast_success_text')
              } else {
                this.showToast = true
                this.toastText = this.nl('page_common_toast_registered_text')
              }
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.loading = false
              setTimeout(() => {
                this.showToast = false
              }, 2000)
            })
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.new-brand-coming-soon {
  min-width: 1024px;
  .main-content {
    min-height: 540px;
    position: relative;
    background-color: #f0f0f0;
    img {
      width: 100%;
      vertical-align: middle;
    }
    .input-container {
      position: absolute;
      left: 50%;
      bottom: 100px;
      transform: translate(-50%, -50%);
      .input-box {
        display: flex;
        position: relative;
        input {
          min-width: 340px;
          width: 31.25vw;
          height: 50px;
          padding: 16px 0 16px 12px;
          box-sizing: border-box;
          font-size: 14px;
          &.error {
            border: solid 1px #f00;
            background: var(--color-f9f9f9);
            padding: 10px 5px;
          }
        }
        button {
          min-width: 125px;
          width: 7.8125vw;
          height: 50px;
          background: #a0a1a0;
          font-size: 16px;
          color: #fff;
          text-transform: uppercase;
          &:hover {
            background: var(--color-999999);
          }
        }
      }
      .error-tip {
        color: #f00;
        font-style: normal;
        padding: 7px 0 9px;
        text-transform: none;
        position: absolute;
        bottom: -30px;
        left: 0;
      }
      .success-toast {
        /* width: 100%; */
        padding: 16px 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translateY(-70px);
        background: rgba(51, 51, 51, 0.8);
        border-radius: 6px;
        span {
          height: 18px;
          font-size: 13px;
          font-family: @font-family-500;
          color: #fff;
          line-height: 18px;
          white-space: nowrap;
        }
      }
    }
  }
}
@media screen and (max-width: 1680px) {
  .new-brand-coming-soon .main-content .input-container {
    bottom: 80px;
  }
}
@media screen and (max-width: 1440px) {
  .new-brand-coming-soon .main-content .input-container {
    bottom: 60px;
  }
}
@media screen and (max-width: 1360px) {
  .new-brand-coming-soon .main-content .input-container {
    bottom: 40px;
  }
}
@media screen and (max-width: 1280px) {
  .new-brand-coming-soon .main-content .input-container {
    bottom: 20px;
  }
}
</style>
