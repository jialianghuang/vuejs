<template>
  <div class="kk-coming-soon">
    <main-app :navigation="navigation" :isShowSubscribe="'hide'" :adaptive="true" class="adaptive-box">
      <div :style="{ background: kkConfigData.bgColor }" class="main-content">
        <div class="l-part">
          <img :src="replaceImgCdnUrl(nl(kkConfigData.mainBgImg))" :alt="nl(kkConfigData.mainBgImg)" class="brand-img" />
        </div>
        <div class="r-part">
          <div class="brand-container">
            <img :src="replaceImgCdnUrl(nl(kkConfigData.brandIcon))" :alt="nl(kkConfigData.brandIcon)" class="brand-icon-img" />
            <div class="brand-desc">{{ nl(kkConfigData.pageDesc) }}</div>
            <div class="brand-input">
              <div class="input-box">
                <input
                  v-model="email"
                  :placeholder="nl(kkConfigData.inputPlaceholder)"
                  :class="{ error: rulesResult.email }"
                  @focus="rulesResult.email = ''"
                  type="text"
                />
                <button @click="submitData">{{ loading ? nl('page_js_processing') : nl('page_common_submit1') }}</button>
              </div>
              <p v-if="rulesResult.email" class="error-tip">{{ rulesResult.email ? rulesResult.email : nl('page_email_enter_valid') }}</p>
            </div>

            <div class="brand-share">
              <div class="share-txt">{{ nl(kkConfigData.followText) }}</div>
              <ul class="share-list">
                <li v-for="(item, index) in followLinkList" :key="index">
                  <a
                    :class="item.type"
                    :data-datalayer-label="item.label"
                    :href="countryUrl(item.href)"
                    :aria-label="item.type"
                    target="_blank"
                    class="need_datalayer"
                    data-datalayer-category="Bottom_FollowUs_Click"
                  >
                    <az-icon :icon-class="item.iconClass" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showToast" class="success-toast">
        <span>{{ toastText }}</span>
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
  name: 'KendallKylieComingSoon',
  components: {
    MainApp
  },
  data() {
    return {
      loading: false,
      email: '',
      rulesResult: {
        email: ''
      },
      showToast: false,
      toastText: '',
      successMsg: '',
      validator: null,
      kkConfigData: {
        bgColor: '#F4F3EF',
        mainBgImg: 'page_image_kk_main_bg_pc',
        brandIcon: 'page_image_brand_icon',
        pageDesc: 'page_kk_brand_desc',
        inputPlaceholder: 'page_kk_input_placeholder',
        followText: 'page_kk_follow_for_more'
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      context.store.commit('setJsKey', 'kendallKylieComingSoon')
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
            .post(`/1.0/comingSoon/save?email=${this.email}&brand_id=16`)
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
.kk-coming-soon {
  min-width: 1100px;
  .main-content {
    min-height: 540px;
    display: flex;
    .l-part {
      width: 46.36vw;
      min-width: 500px;
      .brand-img {
        width: 100%;
        height: auto;
        vertical-align: middle;
      }
    }
    .r-part {
      flex: 1;
      min-width: 340px;
      position: relative;
      .brand-container {
        width: 100%;
        position: absolute;
        left: 50%;
        top: 46%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        .brand-icon-img {
          width: 31.25vw;
          min-width: 340px;
        }
        .brand-desc {
          font-family: @font-Ivy-Mode-700;
          font-size: 42px;
          line-height: 52px;
          letter-spacing: 0.1em;
          // margin: 80px auto 51px;
          margin: 8% auto 5%;
          text-align: center;
        }
        .brand-input {
          .input-box {
            display: flex;
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
              padding: 0px 5px;
              min-width: 125px;
              width: 7.8125vw;
              height: 50px;
              background: var(--color-121212);
              font-size: 16px;
              color: #fff;
              text-transform: uppercase;
              font-family: @font-family-600;
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
          }
        }

        .brand-share {
          display: flex;
          line-height: 32px;
          margin-top: 40px;
          justify-content: center;
          .share-txt {
            margin-right: 20px;
          }
          .share-list {
            li {
              float: left;
              a {
                box-sizing: content-box;
                display: block;
                float: left;
                vertical-align: top;
                overflow: hidden;
                font-size: 32px;
                margin-right: 30px;
              }
            }
          }
        }
      }
    }
  }
  .success-toast {
    /* width: 100%; */
    padding: 16px 20px;
    position: fixed;
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
@media screen and (max-width: 1680px) {
  .kk-coming-soon .main-content .r-part .brand-container .brand-desc {
    font-size: 36px;
  }
}
@media screen and (max-width: 1600px) {
  .kk-coming-soon .main-content .r-part .brand-container .brand-desc {
    font-size: 34px;
  }
}
@media screen and (max-width: 1500px) {
  .kk-coming-soon .main-content .r-part .brand-container .brand-desc {
    font-size: 32px;
  }
}
@media screen and (max-width: 1360px) {
  .kk-coming-soon .main-content .r-part .brand-container .brand-desc {
    font-size: 30px;
  }
}
@media screen and (max-width: 1280px) {
  .kk-coming-soon .main-content .r-part .brand-container .brand-desc {
    font-size: 28px;
  }
}
@media screen and (max-width: 1220px) {
  .kk-coming-soon .main-content .r-part .brand-container .brand-desc {
    font-size: 26px;
  }
}
@media screen and (max-width: 1110px) {
  .kk-coming-soon .main-content .r-part .brand-container .brand-desc {
    font-size: 24px;
  }
}
</style>
