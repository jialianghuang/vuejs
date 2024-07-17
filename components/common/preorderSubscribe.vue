<template>
  <div>
    <!-- 固定在顶部的填邮箱模块 -->
    <template v-if="preInputFixed">
      <div :style="{ top: `${headH}px` }" class="pre-coupon-fix">
        <!-- 需求有更改，tease 和  prelaunch 阶段都改成精简模式，代码先保留 -->
        <!-- prelaunch 阶段 -->
        <!-- <template v-if="activityStatus === 'tease'">
          <div class="tease">
            <div v-html="nl('page_preorder_subscribe_desc')" class="desc"></div>
            <div class="pre-input">
              <email-input
                ref="PREEMAIL"
                @submit="submit"
                :tabindex="'2'"
                @focus="isError = false"
                :class="{ error: isError }"
                :placeholder="nl('page_placeholder_notify')"
                :requiredTxt="nl('page_login_enter_email')"
                :validatorTxt="nl('page_email_enter_valid')"
              ></email-input>
              <az-button
                :needIcon="false"
                @click="submit"
                :class="{ 'btn-loadng': loading }"
                class="btn btn-default pre-btn"
                tabindex="4"
                >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_common_just_submit') }}</az-button
              >
            </div>
          </div>
        </template> -->
        <!-- 预热阶段 -->
        <template v-if="activityStatus === 'prelaunch' || activityStatus === 'tease'">
          <div @click="handleGetIt" class="prelaunch">
            <div v-html="nl('page_preorder_subscribe_desc')" class="desc"></div>
            <az-button :needIcon="false" :class="{ 'btn-loadng': loading }" class="btn btn-default get-btn" tabindex="4">{{
              nl('page_common_get_it_now')
            }}</az-button>
          </div>
        </template>
      </div>
    </template>

    <!-- 弹窗填邮箱模块 -->
    <template v-if="showDialog || showSuccess">
      <az-overlay :z-index="12" @click="close">
        <div class="pre-coupon-dialog">
          <az-icon @click="close" class="close-btn" icon-class="iconic-close-appdownload"></az-icon>
          <template v-if="!showSuccess">
            <div v-track.view="{ common: getBiParams(`email_fill`) }" class="pre-coupon-content">
              <div class="img-box">
                <az-icon class="kk-icon" icon-class="icon-a-azaziexkk"></az-icon>
              </div>
              <div v-html="nl('page_preorder_subscribe_desc')" class="desc"></div>
              <div class="pre-input">
                <email-input
                  ref="PREEMAIL"
                  @submit="submit"
                  :tabindex="'2'"
                  @focus="isError = false"
                  :class="{ error: isError }"
                  :placeholder="activityStatus === 'prelaunch' ? nl('page_preorder_placeholder_notify') : nl('page_placeholder_notify')"
                  :requiredTxt="nl('page_login_enter_email')"
                  :validatorTxt="nl('page_email_enter_valid')"
                ></email-input>
                <az-button
                  :needIcon="false"
                  @click="submit"
                  v-track.click="{ common: getBiParams(`email_submit`) }"
                  :class="{ 'btn-loadng': loading }"
                  class="btn btn-default pre-btn"
                  tabindex="4"
                  >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_common_just_submit') }}</az-button
                >
              </div>
            </div>
          </template>
          <template v-else>
            <div class="pre-coupon-content pre-coupon-success">
              <img src="~assets/images/ccpa/ccpa_success.png" alt="" />
              <div v-track.view="{ common: getBiParams(`email_success`) }" class="suc-title">
                {{ nl('page_preorder_subscribe_suc_title') }}
              </div>
              <div class="pre-coupon-tips">
                {{
                  activityStatus === 'tease'
                    ? nl('page_preorder_subscribe_suc_desc_tease')
                    : nl('page_preorder_subscribe_suc_desc_prelaunch')
                }}
              </div>
            </div>
          </template>
        </div>
      </az-overlay>
    </template>
  </div>
</template>

<script>
import EmailInput from '@/components/user/EmailInput'
import AzButton from '@/components/az-ui/AzButton'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import colorHex from '@/assets/js/colorHex'
export default {
  name: 'PreorderSubscribe',
  components: { AzOverlay, AzButton, EmailInput },
  mixins: [colorHex],
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    preInputFixed: {
      type: Boolean,
      default: false
    },
    headH: {
      type: Number,
      default: 0
    },
    activityStatus: {
      type: String,
      default: ''
    },
    trackEc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showSuccess: false,
      email: '',
      loading: false,
      btnText: '',
      isError: false
    }
  },
  computed: {},
  watch: {
    showDialog(val) {
      if (val) {
        // 如果已登录则自动填充email
        if (this.userInfoEmail) {
          this.email = this.userInfoEmail
        }
      }
    }
  },
  mounted() {
    this.btnText = this.nl('page_free_swatch_main_btn_text')
  },
  methods: {
    close(type) {
      this.showSuccess = false
      this.$emit('close-dialog')
    },
    handleGetIt() {
      this.$emit('open-dialog')
    },
    submit() {
      let hasError = false
      if (this.loading) {
        return false
      }
      this.email = this.$refs.PREEMAIL.email
      if (!this.$refs.PREEMAIL.validateEvent()) {
        hasError = true
        this.isError = true
      }
      if (hasError) {
        return false
      }
      this.addSubscribeEmail()
    },
    addSubscribeEmail() {
      this.retentionReject()
      this.loading = true
      this.$axios
        .$post('/1.0/email/add-subscribe-email', {
          email: this.email,
          source: 'pre_sale_kk' // 来源：预售pre_sale_kk
        })
        .then((res) => {
          if (res.code == 0) {
            this.$cookie.setCookie('UnLoginEmail', this.email, 30, '.' + this.APP_DOMAIN_LOWER) // 设置未登录邮箱缓存
            this.showSuccess = true
          } else {
            this.showSuccess = false
            this.loading = false
            this.$refs.PREEMAIL.rulesResult.email = res.msg
          }
          this.loading = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    getBiParams(el) {
      if (process.server || !this.trackEc) return
      return {
        ec: this.trackEc,
        el
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pre-coupon-dialog {
  display: block;
  width: 600px;
  padding: 60px 40px;
  box-sizing: border-box;
  background-color: #fff;
  position: relative;
  .close-btn {
    fill: currentColor;
    color: var(--color-121212);
    font-size: 15px;
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
  }
  .img-box {
    text-align: center;
    .kk-icon {
      width: 350px;
      height: 130px;
    }
  }

  .pre-coupon-success {
    text-align: center;
    img {
      width: 60px;
      height: 60px;
      vertical-align: middle;
    }
    .suc-title {
      text-transform: uppercase;
      font-family: @font-family-600;
      font-size: 30px;
      margin-top: 15px;
      line-height: 41px;
    }
    .pre-coupon-tips {
      margin-top: 15px;
      font-size: 16px;
      line-height: 22px;
      /deep/ .bold {
        font-size: 16px;
        font-family: @font-family-700;
      }
    }
  }
}
.pre-coupon-fix {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fdfcf7;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
  padding: 20px 0;
  z-index: @position-z-index;
  .tease {
    /deep/ .pre-input {
      .control-group {
        width: 590px;
      }
      input {
        width: 590px;
      }
      .email-domain-box {
        display: none;
      }
    }
    .desc {
      margin: 0 0 10px;
    }
  }

  .prelaunch {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -10px 0;
    cursor: pointer;
    .desc {
      margin: 0;
    }
    .get-btn {
      width: 160px;
      height: 40px;
      line-height: 40px;
      border: none;
      color: #ffffff;
      background-color: @theme-color;
      font-size: 14px;
      font-family: @font-family-600;
      margin-left: 20px;
    }
  }
}

.desc {
  font-size: 18px;
  line-height: 25px;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 30px 0;
  /deep/ .bold {
    font-size: 18px;
    font-family: @font-family-700;
  }
}

/deep/ .pre-input {
  display: flex;
  justify-content: center;
  .control-group {
    width: 360px;
    text-align: left;
    position: relative;
  }
  input {
    width: 360px;
    height: 40px;
    line-height: 14px;
    color: #666;
    outline: none;
    padding: 0 6px 0 6px;
    background: #fff;
    border: solid 1px #ccc;
    box-sizing: border-box;
    &::placeholder {
      color: var(--color-cccccc);
    }
  }
  .error {
    input {
      border: 1px solid var(--color-ff0000);
    }
  }
  .error .help-inline {
    display: block;
  }
  .pre-btn {
    width: 160px;
    height: 40px;
    line-height: 40px;
    border: none;
    color: #ffffff;
    background-color: @theme-color;
    font-size: 14px;
    font-family: @font-family-600;
  }
  .help-inline {
    line-height: 18px;
    margin-top: 5px;
    display: none;
    color: var(--color-ff0000);
  }
  .email-domain-box {
    position: absolute;
    left: 0;
    top: 40px;
    z-index: 10;
    width: 390px;
    max-height: 284px;
    font-size: 13px;
    background: #fff;
    color: var(--color-121212);
    text-indent: 10px;
    box-sizing: border-box;
    border: 1px solid #ffffff;
    .title {
      padding: 0 5px;
      font-family: @font-family-600, sans-serif;
      line-height: 20px;
    }
    .domian-item {
      padding: 0 5px;
      font-family: @font-family-500, sans-serif;
      line-height: 22px;
      cursor: pointer;
      span {
        color: #666;
      }
      &:hover {
        color: #fff;
        span {
          color: #fff;
        }
        background-color: #4b83af;
      }
    }
  }
}
</style>
