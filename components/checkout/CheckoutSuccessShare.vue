<template>
  <div v-if="Object.keys(shareGoods).length" :class="{ 'mail-to-error': emailError }" class="checkout-success-share">
    <div class="order-share-title-box">
      <span @click="showShareBlock('link')" :class="{ selected: shareBlock == 'link' }" class="order-share">
        <az-icon icon-class="copy-link-color-icon" class="copy-link"></az-icon>
        {{ nl('page_common_share_copy_link') }}
      </span>
      <span
        v-track.view="{ common: { ec: 'share', el: 'facebook' } }"
        @click="showShareBlock('facebook')"
        :class="{ selected: shareBlock == 'facebook' }"
        class="order-share"
      >
        <az-icon icon-class="icon-xxy_facebook" class="facebook"></az-icon>
        {{ nl('page_showroom_fb') }}
      </span>
      <!-- <span @click="showShareBlock('twitter')" :class="{ selected: shareBlock == 'twitter' }" class="order-share">
        <az-icon icon-class="icon-xxy_twitter" class="twitter"></az-icon>
        {{ nl('page_common_twitter') }}
      </span> -->
      <span
        v-track.view="{ common: { ec: 'share', el: 'email' } }"
        @click="showShareBlock('email')"
        :class="{ selected: shareBlock == 'email' }"
        class="order-share"
      >
        <az-icon icon-class="icon-xxy_email" class="share_mail"></az-icon>
        {{ nl('page_subscribe_email') }}
      </span>
      <span
        v-track.view="{ common: { ec: 'share', el: 'pinterest' } }"
        @click="showShareBlock('pinterest')"
        :class="{ selected: shareBlock == 'pinterest' }"
        class="order-share"
      >
        <az-icon icon-class="icon-xxy_pinterest" class="pinterest"></az-icon>
        {{ nl('page_common_share_pinterest') }}
      </span>
    </div>
    <div :class="{ 'mail-to-error': emailError }" class="share-block">
      <div v-show="shareBlock == 'link'" class="content-copy-link">
        <img :src="addWebpSuffix(shareGoods.goodsThumb)" alt="goods thumb" />
        <div class="content">
          <input id="copy-link" v-model="copyUrl" type="text" disabled />
          <p
            v-track.view.click="{ common: { ec: 'share', el: 'link' } }"
            v-clipboard:copy="copyUrl"
            v-clipboard:success="onSuccess"
            v-clipboard:error="onError"
            class="copy-link-btn"
          >
            <span>{{ nl('page_common_share_copy_link') }}</span>
          </p>
        </div>
      </div>
      <div v-show="shareBlock == 'facebook'" class="content-fb">
        <img :src="addWebpSuffix(shareGoods.goodsThumb)" alt="goods thumb" />
        <div class="content">
          <h2>{{ shareGoods.name }} {{ shareGoods.catName }}</h2>
          <div class="content-goods-info">
            {{ nl('page_checkout_fb_share_1') }} '{{ shareGoods.name }}' {{ shareGoods.catName }} {{ nl('page_checkout_fb_share_2') }}
          </div>
        </div>
        <div id="facebook-share" @click="fbShare(`${HTTPS_HOST}${shareGoods.url}`)" class="share-button">
          <az-icon icon-class="iconshare"></az-icon>
          <span>{{ nl('page_common_checkout_success_share_purchase') }}</span>
        </div>
      </div>
      <div v-show="shareBlock == 'twitter'" class="content-twitter">
        <textarea
          id="twitter-comment"
          v-model="twitterConten"
          @focus="twitterFocusClick"
          :placeholder="
            `${nl('page_placeholder_check_desc1')}'${shareGoods.name}' ${shareGoods.catName}  that I just bought from @iheartazazie`
          "
          style="display: inline-block"
        ></textarea>
        <p style="width:380px">'{{ shareGoods.twitterUrl.showUrl }}' {{ nl('page_checkout_twitter_share') }}</p>
        <span id="words_num">{{ 116 - twitterConten.length }}</span>
        <div id="twitter-share" @click="twitterShare(shareGoods.twitterUrl.url)" class="share-button">
          <az-icon icon-class="iconshare"></az-icon>
          <span>{{ nl('page_common_checkout_success_share_purchase') }}</span>
        </div>
      </div>
      <div v-show="shareBlock == 'pinterest'" class="content-pin">
        <img :src="addWebpSuffix(shareGoods.goodsThumb)" alt="goods thumb" />
        <div class="content">
          <h2>{{ shareGoods.name }} {{ shareGoods.catName }}</h2>
          <div class="content-goods-info">
            {{ nl('page_checkout_fb_share_1') }} '{{ shareGoods.name }}' {{ shareGoods.catName }} {{ nl('page_checkout_fb_share_2') }}
          </div>
        </div>
        <div id="pin-share" @click="pinShare(shareGoods)" class="share-button">
          <az-icon icon-class="iconshare"></az-icon>
          <span>{{ nl('page_common_checkout_success_share_purchase') }}</span>
        </div>
      </div>
      <div v-show="shareBlock == 'email'" class="content-share-mail">
        <input
          id="email"
          :class="{ error: emailError }"
          v-model="shareEmailTo"
          @click="emailError = false"
          :placeholder="nl('page_placeholder_type_email')"
          type="text"
        />
        <div v-show="emailError" class="error-note" style="color: #f00;">{{ nl('page_js_enter_valid_add') }}</div>
        <textarea v-model="shareEmailContent" @focus="emailFocusClick" :placeholder="nl('page_placeholder_share_desc')"></textarea>
        <p>
          <az-icon
            @click="sendToself = !sendToself"
            :icon-class="sendToself ? 'a-icon-checkbox-new' : 'iconcheckbox'"
            :class="['checkbox-icon', { 'checkbox-checked': sendToself }]"
          ></az-icon>
          {{ nl('page_checkout_send_me_copy') }}
        </p>
        <div id="email-share" @click="emailShare" class="share-button">
          <az-icon icon-class="iconshare"></az-icon>
          <span>{{ nl('page_common_checkout_success_share_purchase') }}</span>
        </div>
      </div>
    </div>
    <az-toast ref="toast" :message="toastMsg" :duration="2000"></az-toast>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AzToast from '@/components/az-ui/AzToast'
import { setUrlParam } from '@/assets/js/utils'

export default {
  name: 'CheckoutSuccessShare',
  components: { AzToast },
  data() {
    return {
      emailError: false,
      shareEmailTo: '',
      shareEmailContent: '',
      sendToself: false,
      twitterConten: '',
      shareBlock: 'link',
      twitterFlag: false,
      emailFlag: false,
      copyUrl: null,
      toastMsg: ''
    }
  },
  computed: {
    ...mapState('checkout', ['shareGoods']),
    ...mapState('userInfo', ['userInfoEmail'])
  },
  watch: {
    shareGoods: {
      handler(val) {
        if (Object.keys(val).length) {
          this.initUrl()
        }
      },
      deep: true
    }
  },
  methods: {
    twitterFocusClick() {
      if (!this.twitterFlag) {
        this.twitterFlag = true
        this.twitterConten = `${this.nl('page_placeholder_check_desc1')}'${this.shareGoods.name}' ${
          this.shareGoods.catName
        }  that I just bought from @iheartazazie`
      }
    },
    emailFocusClick() {
      if (!this.emailFlag) {
        this.emailFlag = true
      }
    },
    showShareBlock(blockName) {
      this.shareBlock = blockName
    },
    fbShare(facebookUrl) {
      this.setPoint('share', 'facebook', 'click')
      facebookUrl = setUrlParam(facebookUrl, 'share_channel', 'ordsnfb')
      facebookUrl = setUrlParam(facebookUrl, 'utm_source', 'facebook')
      facebookUrl = setUrlParam(facebookUrl, 'utm_medium', 'post')
      facebookUrl = setUrlParam(facebookUrl, 'utm_campaign', 'share')
      if (this.environment != 'prod') {
        const regx = /https:\/\/(mt|ft|p)[2-9]?/gi
        facebookUrl = facebookUrl.replace(regx, 'https://www').replace('http://localhost:3000', 'https://www.azazie.com')
      }
      window.open(
        `http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookUrl)}`,
        '_blank',
        'height=' + 700 + ',width=' + 600 + ',top=' + window.outerHeight / 3 + ',left=' + window.outerWidth / 3
      )
    },
    twitterShare(twitterUrl) {
      this.setPoint('share', 'twitter', 'click')
      const href = `http://twitter.com/share?text=${this.twitterConten} ${twitterUrl}&url=www.azazie.com`
      window.open(href, window, `height=320,width=700,top=${window.innerHeight / 3},left=${window.innerWidth / 3}`)
    },
    pinShare(shareGoods) {
      this.setPoint('share', 'pinterest', 'click')
      const shareContent = this.nl('page_tracking_shipment_share_content')
      let shareUrl = this.HTTPS_HOST + shareGoods.url
      if (this.environment != 'prod') {
        const regx = /https:\/\/(mt|ft|p)[2-9]?/gi
        shareUrl = shareUrl.replace(regx, 'https://www').replace('http://localhost:3000', 'https://www.azazie.com')
      }
      shareUrl = setUrlParam(shareUrl, 'utm_source', 'pinterest')
      shareUrl = setUrlParam(shareUrl, 'utm_medium', 'post')
      shareUrl = setUrlParam(shareUrl, 'utm_campaign', 'share')
      shareUrl = setUrlParam(shareUrl, 'share_channel', 'ordsnpin')
      const pinUrl = `http://pinterest.com/pin/create/button/?description=${shareContent}&media=${
        shareGoods.shareImg
      }&is_video=false&url=${encodeURIComponent(shareUrl)}`

      window.open(pinUrl, window, `height=700,width=600,top=${window.innerHeight / 3},left=${window.innerWidth / 3}`)
    },
    emailShare() {
      const mail = this.shareEmailTo.split(/[\s,:]/)
      const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
      let res = true
      let mails = ''
      for (let index = 0; index < mail.length; index++) {
        const element = mail[index]
        res = res && re.test(element)
        mails += element
        if (index < mail.length - 1) {
          mails += ','
        }
      }
      if (this.sendToself) {
        mails += ',' + this.userInfoEmail
      }
      if (res == false) {
        this.emailError = true
        return false
      }
      let shareUrl = window.location.href
      if (this.environment != 'prod') {
        const regx = /https:\/\/(mt|ft|p)[2-9]?/gi
        shareUrl = shareUrl.replace(regx, 'https://www').replace('http://localhost:3000', 'https://www.azazie.com')
      }
      shareUrl = setUrlParam(shareUrl, 'share_channel', 'ordsnem')
      const href =
        'mailto:' + mails + '?subject=Look what I bought at Azazie.com&body=' + `${this.shareEmailContent} ${encodeURIComponent(shareUrl)}`
      this.setPoint('share', 'email', 'click')
      window.location.href = href
    },
    initUrl() {
      if (this.shareGoods.url && !this.shareGoods.url.includes('azazie.')) {
        this.copyUrl = setUrlParam(this.HTTPS_HOST + this.shareGoods.url, 'share_channel', 'ordsnurl')
      } else {
        this.copyUrl = setUrlParam(this.shareGoods.url, 'share_channel', 'ordsnurl')
      }
    },
    onSuccess(e) {
      this.toastMsg = this.nl('page_common_share_successfully_copied')
      this.$refs && this.$refs.toast.show()
    },
    onError() {
      this.toastMsg = this.nl('page_common_share_copy_failed')
      this.$refs && this.$refs.toast.show()
    }
  }
}
</script>

<style lang="less" scoped>
.checkout-success-share {
  border: 1px solid var(--color-cccccc);
  border-top: 0px;
  width: 520px;
  &.mail-to-error {
    height: 252px;
    margin-bottom: 40px;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-family: @font-family-500;
    color: var(--color-121212);
    svg {
      font-size: 22px;
      margin-right: 5px;
    }
  }
  .facebook {
    fill: #4b64ae;
  }
  .twitter {
    fill: #2ca8d2;
  }
  .pinterest {
    fill: #b80d22;
  }
  .share_mail {
    fill: var(--color-121212);
  }
  .order-share-title-box {
    display: flex;
  }
  .order-share {
    flex: 1;
    display: flex;
    height: 50px;
    font-size: 13px;
    text-align: center;
    background-color: #f6f6f6;
    border-top: 1px solid var(--color-cccccc);
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: var(--color-eeeeee);
    }
    &.selected {
      border-top: 2px solid var(--color-121212);
      background-color: white;
      font-weight: bold;
    }
  }
  .share-block {
    position: relative;
    height: 130px;
    width: 480px;
    padding: 20px;
    &.mail-to-error {
      height: 212px;
    }
  }
  .content-copy-link {
    display: flex;
    column-gap: 10px;
    img {
      width: 74px;
      height: 102px;
    }
    .content {
      flex: 1;
      margin: 10px 0;
      input {
        width: -webkit-fill-available;
        padding: 10px 15px;
        cursor: not-allowed;
      }
      .copy-link-btn {
        float: right;
        display: flex;
        width: 260px;
        height: 45px;
        margin-top: 15px;
        padding: 0px 20px;
        justify-content: center;
        align-items: center;
        background-color: var(--theme-color);
        cursor: pointer;
        &:hover {
          opacity: 0.9;
        }
        span {
          color: #fff;
          font-family: @font-family-600;
          font-size: 14px;
          text-transform: uppercase;
        }
      }
    }
  }
  .content-fb,
  .content-pin {
    display: flex;
  }
  .content-fb,
  .content-pin {
    img {
      width: 74px;
      height: 102px;
    }
    .content {
      margin-left: 15px;
      font-size: 13px;
      line-height: 20px;
      width: 100%;
      overflow: hidden;
      h2 {
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        font-size: 13px;
        font-weight: normal;
      }
      .content-goods-info {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 5; //显示的行
      }
    }
    textarea {
      margin-left: 10px;
      margin-bottom: 22px;
      height: 58px;
      width: 305px;
    }
  }
  .content-twitter {
    textarea {
      width: 380px;
      height: 78px;
      box-sizing: border-box;
    }
    .red {
      color: var(--color-e3bda1);
    }
  }
  .content-share-mail {
    input,
    textarea {
      border: 1px solid #ccc;
      padding: 6px 10px;
      line-height: 18px;
      display: block;
      &::placeholder {
        color: #999;
      }
    }
    input[type='text'] {
      height: 40px;
      line-height: 26px;
      width: 100%;
      box-sizing: border-box;
    }
    textarea {
      margin-top: 10px;
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      resize: none;
    }
    .checkbox-icon {
      cursor: pointer;
      font-size: 13px;
      margin-right: 5px;
    }
    p {
      margin-top: 10px;
    }
  }
  .share-button {
    position: absolute;
    right: 20px;
    bottom: 20px;
    font-size: 13px;
    text-transform: uppercase;
    font-family: @font-family-600;
    line-height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    span {
      color: @theme;
      text-decoration: underline;
    }
    .az-icon {
      font-size: 14px;
      margin-right: 10px;
      fill: @theme;
    }
  }
  #email {
    .error {
      background: var(--color-f1e9e6);
      border-color: #d77ea9;
    }
  }
  #words_num {
    position: absolute;
    right: 169px;
    bottom: 24px;
  }
  /deep/ .az-toast__text {
    text-transform: capitalize;
  }
}
.checkbox-checked {
  fill: @black-btn-color;
}
</style>
