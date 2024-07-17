<template>
  <div class="az-share-box">
    <ul class="share-items">
      <li
        v-for="(item, index) in shareList"
        :key="index"
        :data-datalayer-label="'DetailPage' + TABLE_TEST + '_ShareWith_Click'"
        :style="{ fontSize, margin: space }"
        data-datalayer-category="PC_DetailPageRevision"
        class="need_datalayer"
      >
        <a @click="jump(item, $event)" :class="`share_by_${item.key}`" class="ui-link">
          <az-icon :icon-class="`icon-xxy_${item.key}`" class="icon-share"></az-icon>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AzShare',
  props: {
    fontSize: {
      type: String,
      default: '25px'
    },
    space: {
      type: String,
      default: '0 3px 0 0'
    },
    shareList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      TABLE_TEST: 'A'
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo
    })
  },
  created() {},
  mounted() {
    this.shareControl()
  },
  methods: {
    jump(shareItem, e) {
      this.setPoint('share', shareItem.key, 'click', {
        goodsId: this.baseInfo.goodsId,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType || this.dressType
      })
      // ga4打点
      window.dataLayer.push({ event_parameters: null })
      window.dataLayer.push({
        event: 'ga4Event',
        event_name: 'share',
        event_parameters: {
          method: shareItem.key,
          item_id: this.baseInfo.shownGoodsName
        }
      })

      if (shareItem.key == 'email' || shareItem.key == 'blog') {
        const tempwindow = window.open('_blank')
        tempwindow.location.href = shareItem.url
        return false
      }
      if (shareItem.dialog_width && shareItem.dialog_height) {
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
      } else {
        const tempwindow = window.open('_blank')
        tempwindow.location.href = shareItem.url
        return false
      }

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
.az-share-box {
  text-align: center;
  .share-items {
    display: inline-block;
    li {
      display: inline-block;
      a {
        display: block;
        cursor: pointer;
        svg {
          fill: currentColor;
          &.icon-share {
            color: var(--color-121212);
          }
        }
      }
      &:last-child {
        margin: 0 !important;
      }
    }
  }
}
.comment-share {
  .az-share-box {
    .share_by_facebook {
      .icon-share {
        color: #4b64ae;
      }
    }
    .share_by_pinterest {
      .icon-share {
        color: #b11427;
      }
    }
    .share_by_twitter {
      .icon-share {
        color: #2da6da;
      }
    }
    .share_by_email {
      .icon-share {
        color: var(--color-121212);
      }
    }
    .share_by_blog {
      .icon-share {
        color: var(--color-121212);
      }
    }
  }
}
</style>
