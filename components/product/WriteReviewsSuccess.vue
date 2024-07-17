<template>
  <az-overlay :z-index="12">
    <div class="reviews-success-box">
      <div @click="close" class="close">
        <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
      </div>
      <div ref="successHtml">
        <div id="review_success_dialog">
          <div class="goods_pic fl">
            <img :src="addWebpSuffix(getGoodsPictureUrl)" alt="goods pic" />
          </div>

          <div class="review_success_msg fr">
            <p :class="{ 'show-share': successData.starstar > 3 }" class="msg_title">
              {{ nl('page_review_thanks') }} <br /><span class="goodsname">{{ `${baseInfo.shownGoodsName}!` }}</span>
            </p>
            <p>{{ nl('page_review_submit_success') }}</p>
            <!-- TODO 分享 -->
            <div v-if="successData.starstar > 3 && Object.keys(shareList).length" class="comment-share">
              <az-share :shareList="shareList" :fontSize="'35px'" :space="'0 10px 0 0'"></az-share>
            </div>
          </div>
        </div>
      </div>
    </div>
  </az-overlay>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import azShare from '@/components/az-ui/Share/AzShare'

import { mapGetters } from 'vuex'
export default {
  name: 'WriteReviewsSuccess',
  languageKeys: ['page_review_thanks', 'page_review_submit_success'],
  components: {
    AzOverlay,
    azShare
  },
  props: {
    successData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      shareList: []
    }
  },
  computed: {
    ...mapGetters({
      selectedColor: 'product/getSelectedColor',
      baseInfo: 'product/getBaseInfo'
    }),
    getGoodsPictureUrl() {
      return this.PIC_PATH + 's179/' + this.baseInfo.goodsThumb
    }
  },
  created() {
    if (this.successData.data.shareInfo && this.successData.data.shareInfo.list) {
      this.shareList = this.getShareList(this.successData.data.shareInfo.list)
    }
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('close')
    },
    getShareList(shareList) {
      const tempshareList = []
      for (const key in shareList) {
        const item = shareList[key]
        let url = ''
        if (item.key == 'facebook') {
          url = item.url + '?u=' + item.shareUrl
        }
        if (item.key == 'pinterest') {
          url =
            item.url + '?description=' + item.description + '&media=' + `${this.PIC_PATH}s240/` + item.shareImg + +'&url=' + item.shareUrl
        }
        if (item.key == 'twitter') {
          url = item.url + '?text=' + item.text + '&url=' + item.shareUrl
        }
        if (item.key == 'email') {
          url = item.url + '?subject=' + item.subject + '&body=' + item.body
        }
        tempshareList.push({
          key: item.key,
          url,
          dialog_height: 320,
          dialog_width: 700
        })
      }
      tempshareList.push({
        key: 'blog',
        url: this.HTTPS_HOST + '/blog/submit-your-real-azazie-wedding/'
      })
      return tempshareList
    }
  }
}
</script>

<style lang="less" scoped>
.reviews-success-box {
  position: relative;
  width: 655px;
  height: 359px;
  background: #fff;
  border: 1px solid var(--color-121212);
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  /deep/ #review_success_dialog {
    width: 583px;
    height: 300px;
    padding: 35px 35px 0px;
    .goods_pic {
      img {
        width: 179px;
        height: 278px;
      }
      border: 10px solid #f6f6f6;
    }
    .review_success_msg {
      width: 350px;
      .msg_title {
        padding-top: 85px;
        width: 290px;
        padding-left: 20px;
        font-weight: 700;
        text-align: center;
        &.show-share {
          padding-top: 35px;
        }
      }
      p {
        padding-top: 28px;
        text-align: left;
      }
    }

    .question_success_msg {
      width: 350px;
      .msg_title {
        padding-top: 52px;
        width: 290px;
        padding-left: 32px;
        font-weight: 700;
        text-align: center;
      }
      p {
        width: 360px;
        padding-top: 35px;
        text-align: left;
      }
      a {
        &:hover {
          color: var(--color-121212);
        }
        color: var(--color-121212);
        text-decoration: underline;
      }
    }
  }
  .comment-share {
    margin-top: 30px;
    display: inline-block;
  }
}
</style>
