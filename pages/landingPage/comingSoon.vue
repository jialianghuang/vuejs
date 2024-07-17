<template>
  <div id="coming_soon" :class="{ 'small-view': !isBkImgShow }">
    <div class="coming-soon-content">
      <div class="comming-pwd">
        <div id="btn_preview" v-if="isPassWordEnterShow" @click="handlePreview">{{ nl('page_common_preview') }}</div>
        <form id="subscribe_submit" v-else>
          <div>
            <input id="subscribe_email" v-model="password" :placeholder="nl('page_login_password')" type="text" name="email" />
          </div>
          <az-button @click="handlePassWord" :disabled="loading" class="btn btn-default btn-submit">
            {{ loading ? `Processing...` : `go` }}
          </az-button>
        </form>
      </div>
      <div v-if="isBkImgShow" class="bk-img">
        <img :src="leftImg" alt="azazie.com" />
      </div>
      <div class="info-content">
        <h1><img :src="replaceImgCdnUrl(logoImg)" alt="azazie.com" width="272" /></h1>
        <h2><img :src="replaceImgCdnUrl(comingsoonImg)" alt="Coming Soon" width="100%" /></h2>
        <form id="subscribe_submit">
          <div>
            <input
              id="subscribe_email"
              v-model="email"
              :class="{ error: rulesResult.email }"
              @focus="rulesResult.email = ''"
              :placeholder="nl('page_placeholder_notify')"
              type="text"
              name="email"
            />
          </div>
          <az-button @click="subscribeSubmit" :disabled="loading" class="btn btn-default btn-submit">
            {{ loading ? nl('page_js_processing') : nl('page_common_just_submit') }}
          </az-button>
        </form>
        <p v-if="rulesResult.email" class="error-tip">{{ rulesResult.email ? rulesResult.email : nl('page_js_enter_valid_add') }}</p>
        <az-share :shareList="shareList" :fontSize="'32px'" :space="'0 10px 0 0'"></az-share>
      </div>
    </div>
    <main-app v-if="showMainApp"></main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'

import AzButton from '@/components/az-ui/Button/AzButton'
import azShare from '@/components/az-ui/Share/AzShare'
import Schema from 'async-validator'
import formValidatorType from '@/assets/js/formValidatorType'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
export default {
  name: 'ComingSoon',
  components: {
    mainApp,
    AzButton,
    azShare
  },
  data() {
    return {
      showMainApp: false,
      password: '',
      email: '',
      rulesResult: {
        email: ''
      },
      loading: false,
      isPassWordEnterShow: true,
      isBkImgShow: true,
      shareList: [
        {
          key: 'facebook',
          url: 'https://www.facebook.com/azazieofficial'
        },
        {
          key: 'twitter',
          url: 'https://twitter.com/azazieofficial'
        },
        {
          key: 'pinterest',
          url: 'http://www.pinterest.com/azazieofficial'
        },
        {
          key: 'instagram',
          url: 'http://instagram.com/azazieofficial'
        }
      ],
      leftImg: 'https://www.azazie.com/themes/azazie/images/comingsoon/comingsoon.jpg',
      logoImg: 'https://www.azazie.com/themes/azazie/images/comingsoon/logo.png',
      comingsoonImg: 'https://www.azazie.com/themes/azazie/images/comingsoon/coming_soon.png'
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

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
    const descriptor = {
      email: formValidatorType.email({
        required: this.nl('page_login_enter_email'),
        validator: this.nl('page_login_check_email_format')
      })
    }
    this.validator = new Schema(descriptor)

    window.onresize = () => {
      const viewPortWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (viewPortWidth <= 720) {
        this.isBkImgShow = false
      } else {
        this.isBkImgShow = true
      }
    }
  },
  methods: {
    handlePreview() {
      this.isPassWordEnterShow = false
    },
    handlePassWord() {
      if (this.password.trim() == 'azazievip') {
        location.href = this.countryUrl('/')
      }
    },
    subscribeSubmit(e) {
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
            e.preventDefault()
            return false
          }
          this.submitAxios()
        }
      )
    },
    submitAxios() {
      this.loading = true
      this.retentionReject()
      this.$axios
        .$get(`/1.0/email/subscribe?email=${this.email}`)
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            alert(res.data)
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
#coming_soon {
  background: var(--color-121212);
  min-height: 952px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  &.small-view {
    background: #ebebeb;
  }
  .coming-soon-content {
    width: 100%;
    max-height: 895px;
    padding: 0 10%;
    display: flex;
    justify-content: center;
    background: #ebebeb;
    .comming-pwd {
      position: absolute;
      right: 20px;
      margin-top: 10px;
      #btn_preview {
        color: #bfbfbf;
        font-size: 14px;
        line-height: 35px;
        cursor: pointer;
        &:after {
          display: inline-block;
          vertical-align: top;
          content: '▶';
          font-size: 'Times New Roman';
          margin-left: 5px;
        }
        &:hover {
          color: @theme;
        }
      }
      #subscribe_submit {
        display: flex;
        width: 156px;
        position: relative;
        display: flex;
        margin: 0 auto 5%;
        > div {
          flex: 1;
          input {
            width: 105px;
            height: 40px;
            line-height: 14px;
            outline: none;
            padding: 0 6px 0 6px;
            background: #fff;
            border: solid 1px @border-color;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            font-style: italic;
            color: #787878;
            // max-width: 720px;
            &.error {
              border: solid 1px red;
            }
          }
        }

        .btn-submit {
          // margin-left: 6px;
          background: #484848;
          border: solid 1px #484848;
          // padding: 7px;
          &:hover {
            background: @theme;
            border: solid 1px @theme;
          }
        }
      }
    }
    .bk-img {
      width: 42%;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .info-content {
      flex: 1;
      text-align: center;
      padding: 50px 0;
      h1 {
        margin-top: 5%;
      }
      h2 {
        margin: 13% 0;
      }
      .error-tip {
        color: red;
        margin-left: 9%;
        text-align: left;
      }
      #subscribe_submit {
        width: 82%;
        max-width: 720px;
        position: relative;
        display: flex;
        margin: 0 auto;
        > div {
          flex: 1;
          input {
            width: 100%;
            height: 40px;
            line-height: 14px;
            outline: none;
            padding: 0 6px 0 6px;
            background: #fff;
            border: solid 1px @border-color;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            font-style: italic;
            color: #787878;
            max-width: 720px;
            &.error {
              border: solid 1px red;
            }
          }
        }

        .btn-submit {
          // margin-left: 6px;
          background: #484848;
          border: solid 1px #484848;
          &:hover {
            background: @theme;
            border: solid 1px @theme;
          }
        }
      }
    }
  }
}
</style>
