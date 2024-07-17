<template>
  <section class="az-share-new">
    <SvgShare />
    <ul :style="{ '--space': space + 'px' }" class="az-share-new-container">
      <template v-for="(item, index) in shareList">
        <template v-if="item.key == 'link'">
          <li
            v-track.view.click="{ common: getBiParams(item.key) }"
            v-clipboard:copy="item.url"
            v-clipboard:success="onSuccess"
            v-clipboard:error="onError"
            :style="{ '--size': size + 'px', '--line-height': lineHeight + 'px', '--font-size': fontSize + 'px' }"
            :class="['az-share-new-container-item', { show: item.show }]"
            :key="item.key + index"
          >
            <az-icon :icon-class="showColorIcon ? item.icon + '-color' : item.icon"></az-icon>
          </li>
        </template>
        <li
          v-else
          v-track.view.click="{ common: getBiParams(item.key) }"
          :key="index"
          :style="{ '--size': size + 'px', '--line-height': lineHeight + 'px', '--font-size': fontSize + 'px' }"
          :class="['az-share-new-container-item', { show: item.show }]"
          :title="item.name"
          @click="jump(item, $event)"
        >
          <img v-if="item.img" :src="item.img" alt="instagram img" />
          <az-icon :icon-class="showColorIcon ? item.icon + '-color' : item.icon"></az-icon>
        </li>
      </template>
    </ul>
    <az-toast ref="toast" :message="toastMsg" :duration="2000"></az-toast>
  </section>
</template>

<script>
import AzToast from '@/components/az-ui/AzToast'
import SvgShare from '@/components/svgs/SvgShare'
import { setUrlParam } from '@/assets/js/utils'

export default {
  name: 'AzShareNew',
  languageKeys: ['page_tracking_shipment_share_content', 'page_common_share_successfully_copied', 'page_common_share_copy_failed'],
  components: { AzToast, SvgShare },
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    },
    // icon盒子宽高
    size: {
      type: Number,
      default: 35
    },
    // 行高
    lineHeight: {
      type: Number,
      default: 35
    },
    // svg大小
    fontSize: {
      type: Number,
      default: 35
    },
    // icon 间距
    space: {
      type: Number,
      default: 25
    },
    // 分享渠道列表
    shareConfig: {
      type: Array,
      default: () => []
    },
    // 显示颜色icon
    showColorIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      app_high_share: false,
      normal_share: false,
      app_lower_share: false,
      toastMsg: ''
    }
  },
  computed: {
    defaultConfig({ $route }) {
      if (process.server) return []
      const profixObj = {
        product: 'de',
        showroom: 'showroom',
        'order-tracking': 'track',
        checkoutSuccess: 'ordesn'
      }
      const profix = profixObj[$route.name] || 'de'
      const defaultConfig = [
        {
          icon: 'az-share-copy-link-icon',
          key: 'link',
          name: 'copy link',
          shareChannel: `${profix}url`,
          show: true
        },
        {
          icon: 'az-share-message-icon',
          key: 'message',
          name: 'message',
          shareChannel: `${profix}mes`,
          show: /macintosh|mac os x/i.test(navigator.userAgent)
        },
        {
          icon: 'az-share-email-icon',
          key: 'email',
          name: 'email',
          shareChannel: `${profix}em`,
          show: true
        },
        {
          icon: 'az-share-facebook-icon',
          key: 'facebook',
          name: 'facebook',
          shareChannel: `${profix}fb`,
          show: true
        },
        {
          icon: 'az-share-pinterest-icon',
          key: 'pinterest',
          name: 'pinterest',
          shareChannel: `${profix}pin`,
          show: true
        },
        {
          icon: 'az-share-twitter-icon',
          key: 'twitter',
          name: 'twitter',
          shareChannel: `${profix}xx`,
          show: true
        },
        {
          icon: 'az-share-instagram-icon',
          img: 'https://cdn-1.azazie.com/upimg/userfiles/images/c7/94/def70d1968c18250a6c77fd851ddc794.png',
          key: 'instagram',
          name: 'instagram',
          shareChannel: `${profix}ins`,
          show: false
        }
      ]
      return defaultConfig
    },
    currentShowImageUrl({ baseInfo, PIC_PATH }) {
      let imgName = baseInfo.goodsThumb
      if (this.$store.state.product.currentShowImageUrl) {
        imgName = this.$store.state.product.currentShowImageUrl
      }
      return decodeURIComponent(PIC_PATH + 's600/' + imgName)
    },
    shareList({ shareConfig, defaultConfig, baseInfo, environment }) {
      // 13627
      if (process.server) return
      // 如果传属性有值则用传值，否则用默认值
      const tempList = shareConfig.length > 0 ? shareConfig : defaultConfig
      const shareContent = this.nl('page_tracking_shipment_share_content')
      const title = baseInfo.goodsName
      const shareImg = decodeURIComponent(this.PIC_PATH + 's600/' + baseInfo.goodsThumb)
      return tempList.map((item) => {
        let shareUrl = window.location.href
        // 开发测试环境转换链接
        if (environment != 'prod') {
          const regx = /https:\/\/(mt|ft|p)[2-9]?/gi
          shareUrl = shareUrl.replace(regx, 'https://www').replace('http://localhost:3000', 'https://www.azazie.com')
        }
        shareUrl = setUrlParam(shareUrl, 'share_channel', item.shareChannel)
        if (item.key == 'message') {
          item.url = `sms:?&body=${encodeURIComponent(shareContent)}  ${encodeURIComponent(shareUrl)}`
        }
        if (item.key == 'link') {
          item.url = shareUrl
          item.showName = title
        }
        if (item.key == 'whatsapp') {
          item.url = `https://wa.me/?text=${decodeURIComponent(shareContent)}  ${encodeURIComponent(shareUrl)}`
        }
        if (item.key == 'pinterest') {
          shareUrl = setUrlParam(shareUrl, 'utm_source', 'pinterest')
          shareUrl = setUrlParam(shareUrl, 'utm_medium', 'post')
          shareUrl = setUrlParam(shareUrl, 'utm_campaign', 'share')
          item.url = `http://pinterest.com/pin/create/button/?description=${shareContent}&media=${shareImg}&is_video=false&url=${encodeURIComponent(
            shareUrl
          )}`
          item.pinterestDesc = shareContent
        }
        if (item.key == 'email') {
          shareUrl = setUrlParam(shareUrl, 'utm_source', 'email')
          shareUrl = setUrlParam(shareUrl, 'utm_medium', 'post')
          shareUrl = setUrlParam(shareUrl, 'utm_campaign', 'share')
          item.url = `mailto:?subject=${title}&body=${shareContent} ${encodeURIComponent(shareUrl)}`
          item.showName = title
        }
        if (item.key == 'facebook') {
          shareUrl = setUrlParam(shareUrl, 'utm_source', 'facebook')
          shareUrl = setUrlParam(shareUrl, 'utm_medium', 'post')
          shareUrl = setUrlParam(shareUrl, 'utm_campaign', 'share')
          item.url = `http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        }
        if (item.key == 'twitter') {
          shareUrl = setUrlParam(shareUrl, 'utm_source', 'twitter')
          shareUrl = setUrlParam(shareUrl, 'utm_medium', 'post')
          shareUrl = setUrlParam(shareUrl, 'utm_campaign', 'share')
          item.url = `http://twitter.com/share?text=${decodeURIComponent(shareContent)}%26via=iheartazazie%26url=${encodeURIComponent(
            shareUrl
          )}`
          item.title = title
        }
        item.dialog_height = 600
        item.dialog_width = 700
        return item
      })
    }
  },
  mounted() {
    this.shareControl()
    // 初始化fb
    this.getFb()
  },
  methods: {
    jump(shareItem, e) {
      console.log('*** jump shareItem ***:', shareItem)
      // const that = this
      if (!shareItem.dialog_height && !shareItem.dialog_width) {
        window.location.href = shareItem.url
        return false
      }
      if (this.app_high_share) {
        window.location.href = shareItem.url
        return false
      }
      if (shareItem.key == 'email' || shareItem.key == 'message') {
        window.location.href = shareItem.url
        return false
      }
      if (shareItem.key == 'save-image') {
        return this.downloadCodeImg(shareItem.url)
      }
      window.open(
        shareItem.url,
        '_blank',
        'height=' +
          shareItem.dialog_height +
          ',width=' +
          shareItem.dialog_width +
          ',top=' +
          window.outerHeight / 3 +
          ',left=' +
          window.outerWidth / 3
      )
      e.preventDefault()
    },
    // 分享支持的版本
    shareControl() {
      if ((window.is_ios_app && window.app_is_high_version('2.1.8')) || (window.is_android_app && window.app_is_high_version('1.2.1'))) {
        this.app_high_share = true
      } else if (
        (window.is_ios_app && !window.app_is_high_version('2.1.8')) ||
        (window.is_android_app && !window.app_is_high_version('1.2.1'))
      ) {
        this.app_lower_share = true
      } else {
        this.normal_share = true
      }
    },
    getFb() {
      const self = this
      if (typeof FB == 'undefined') {
        ;(function() {
          const e = document.createElement('script')
          e.async = true
          e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js'
          document.getElementById('fb-root').appendChild(e)
        })()
        window.fbAsyncInit = function() {
          window.FB.init({
            appId: self.new_facebook_app_code,
            cookie: true,
            xfbml: true,
            oauth: true,
            status: false
          })
        }
      } else {
        window.fbAsyncInit = function() {
          window.FB.init({
            appId: self.new_facebook_app_code,
            cookie: true,
            xfbml: true,
            oauth: true,
            status: false
          })
        }
        window.fbAsyncInit()
      }
    },
    onSuccess(e) {
      this.toastMsg = this.nl('page_common_share_successfully_copied')
      this.$refs && this.$refs.toast.show()
    },
    onError() {
      this.toastMsg = this.nl('page_common_share_copy_failed')
      this.$refs && this.$refs.toast.show()
    },
    getBiParams(el) {
      if (process.server) return
      const msg = {
        goodsId: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType || this.dressType
      }
      return {
        ec: this.$route.name === 'order-tracking' ? 'sharetracking' : 'share',
        el,
        msg: JSON.stringify(msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.az-share-new {
  &-container {
    display: flex;
    column-gap: var(--space);
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
    &-item {
      display: none;
      width: var(--size);
      height: var(--size);
      transition: all 0.25s ease;
      line-height: var(--line-height);
      font-size: var(--font-size);
      text-align: center;
      cursor: pointer;
      img {
        width: 100%;
        vertical-align: -0.15em;
      }
      &.show {
        display: block;
      }
    }
  }
  .toast-box {
    width: 200px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    background-color: var(--color-121212);
    text-align: center;
    color: #fff;
    z-index: 1;
  }
  /deep/ .az-toast__text {
    text-transform: capitalize;
  }
}
@media screen and (max-width: 1336px) {
  .az-share-new-container {
    column-gap: 15px;
  }
  .az-share-new-container-item {
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
  }
}
</style>
