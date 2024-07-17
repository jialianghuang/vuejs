<template>
  <div :class="{ 'is-press': isPress }" class="gallery-share">
    <ul class="share-items">
      <li v-for="(item, index) in shareList" :key="index">
        <a @click="jump(item, $event)" :class="[`share_by_${item.key}`, item.key]" class="ui-link share-icon"> </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GalleryShare',
  props: {
    shareList: {
      type: Array,
      default() {
        return []
      }
    },
    isPress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({})
  },
  created() {},
  mounted() {
    this.shareControl()
  },
  methods: {
    jump(shareItem, e) {
      if (shareItem.key == 'email') {
        window.location.href = shareItem.url
        return false
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
    shareControl() {
      let ele = ''
      if ((window.is_ios_app && window.app_is_high_version('2.1.8')) || (window.is_android_app && window.app_is_high_version('1.2.1'))) {
        ele = document.querySelectorAll('.app-high-share')
      } else if (
        (window.is_ios_app && !window.app_is_high_version('2.1.8')) ||
        (window.is_android_app && !window.app_is_high_version('1.2.1'))
      ) {
        ele = document.querySelectorAll('.app-lower-share')
      } else {
        ele = document.querySelectorAll('.normal-share')
      }
      for (const key in ele) {
        if (ele.hasOwnProperty(key)) {
          const element = ele[key]
          element.style.display = 'block'
        }
      }
    },
    shareClick() {
      if (typeof dataLayer != 'undefined') {
        this.setDataLayer({ event: 'M_DetailPage_View' })
      }
      const facebook = document.querySelector('.share_by_facebook')
      const facebookUrl = decodeURIComponent(facebook.attr('href'))
      const shareUrl = facebookUrl.substr(facebookUrl.indexOf('u=') + 2)
      facebook.on('click', function() {
        if (typeof dataLayer != 'undefined') {
          this.setDataLayer.push({ event: 'M_DetailPage_Facebook_Click' })
        }
        if (window.is_app) {
          if (typeof dataLayer != 'undefined') {
            this.setDataLayer.push({ event: 'M_DetailPage_FacebookSuccess_Click' })
          }
        } else {
          const that = this
          window.FB.ui(
            {
              method: 'share',
              mobile_iframe: true,
              href: shareUrl
            },
            function(response) {
              if (typeof response != 'undefined') {
                if (typeof dataLayer != 'undefined') {
                  that.setDataLayer.push({ event: 'M_DetailPage_FacebookSuccess_Click' })
                }
              }
            }
          )
        }
      })
      const twitter = document.querySelector('.share_by_twitter')
      twitter.on('click', function() {
        if (typeof dataLayer != 'undefined') {
          this.setDataLayer.push({ event: 'M_DetailPage_Twitter_Click' })
        }
      })
      const pinterest = document.querySelector('.share_by_pinterest')
      pinterest.on('click', function() {
        if (typeof dataLayer != 'undefined') {
          this.setDataLayer.push({ event: 'M_DetailPage_Pinterest_Click' })
        }
      })
      const shareMail = document.querySelector('.share_by_email')
      shareMail.on('click', function() {
        if (typeof dataLayer != 'undefined') {
          this.setDataLayer.push({ event: 'M_DetailPage_Email_Click' })
        }
      })
      const googleplus = document.querySelector('.share_by_google')
      googleplus.on('click', function() {
        if (typeof dataLayer != 'undefined') {
          this.setDataLayer.push({ event: 'M_DetailPage_GP_Click' })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.gallery-share {
  text-align: center;
  display: inline-block;
  margin-left: 21px;
  .share-items {
    display: inline-block;
    li {
      display: inline-block;
      margin-left: 10px;
      .share-icon {
        display: inline-block;
        vertical-align: top;
        width: 24px;
        height: 24px;
        overflow: hidden;
        line-height: 24px;
        text-indent: -2000px;
        background-image: data-uri('assets/images/a_sprite_l_20190128.png');
        background-repeat: no-repeat;
        display: inline-block;
        cursor: pointer;
        &.facebook {
          background-position: -133px -21px;
          &:hover {
            background-position: -133px -50px;
          }
        }
        &.pinterest {
          background-position: -166px -21px;
          &:hover {
            background-position: -166px -50px;
          }
        }
        &.twitter {
          background-position: -200px -21px;
          &:hover {
            background-position: -200px -50px;
          }
        }
        &.email {
          background-position: -340px -21px;
          &:hover {
            background-position: -340px -50px;
          }
        }
        &.google {
          background-position: -234px -21px;
          &:hover {
            background-position: -234px -50px;
          }
        }
      }
    }
  }
  &.is-press {
    .share-items {
      li {
        margin-left: 7px;
        .share-icon {
          width: 30px;
          height: 30px;
          &.facebook {
            background-position: -204px -398px;
          }
          &.pinterest {
            background-position: -243px -398px;
          }
          &.twitter {
            background-position: -282px -398px;
          }
          &.email {
            background-position: -321px -398px;
          }
          &.google {
            background-position: -360px -398px;
          }
        }
      }
    }
  }
}
</style>
