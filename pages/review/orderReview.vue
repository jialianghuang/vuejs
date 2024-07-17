<template>
  <div class="order-review-box">
    <main-app :navigation="navigation">
      <div class="main page-center-main">
        <a :href="baseInfo.goodsUrl" class="account-back">{{ nl('page_common_back_to_product_page') }}</a>
        <div class="wreview-content">
          <div class="wreview-content-left">
            <div class="order-title">{{ nl('page_goods_post_my_review') }}</div>
            <template v-if="isSuccess">
              <p class="review-success">{{ nl('page_js_comment_success') }}</p>
              <p class="review-note">
                {{ +rating >= 3 ? nl('page_js_post_tip') : nl('page_module_reviews_bad_tips') }}
              </p>
              <!-- TODO 分享 -->
              <div v-if="Object.keys(shareList).length" class="comment-share">
                <p class="share-desc">{{ nl('page_review_share') }}</p>
                <az-share :shareList="shareList" :fontSize="'27px'" :space="'0 5px 0 0'"></az-share>
              </div>
            </template>
            <div v-else>
              <write-reviews
                :baseInfo="baseInfo"
                :size="size"
                :isExtraOption="true"
                :sizeOrdered="sizeOrdered"
                :orderSn="orderSn"
                :recId="recId + ''"
                :reasons="reasons"
                :hideName="true"
                @success="writeSuccess"
                ask-type="review"
              ></write-reviews>
            </div>
          </div>
          <div class="wreview-content-right">
            <div class="write-review-goods-info">
              <h2>{{ nl('page_goods_being_reviewed') }}</h2>
              <div class="goods-info">
                <div class="goods-thumb-box">
                  <az-sticker
                    v-if="baseInfo.stickers && Object.keys(baseInfo.stickers).length"
                    :stickerInfo="baseInfo.stickers"
                    :sticker-class="`product-item-icon-small`"
                    :goodsId="baseInfo.goodsId"
                  ></az-sticker>
                  <img :src="replaceImgCdnUrl(`${PIC_PATH}s74/${baseInfo.goodsThumb}`)" alt="goods thumb" />
                  <span v-if="baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
                </div>
                <div class="name-price">
                  <a :href="baseInfo.goodsUrl" class="goods-name" target="_blank">{{ baseInfo.shownGoodsName }}</a>
                  <p class="goods-price">{{ baseInfo.shopPriceDisplay }}</p>
                </div>
              </div>
              <div class="comment-tips">
                <h3>{{ nl('page_review_tips_review') }}</h3>
                <p>1. {{ nl('page_review_tip_review_tip1') }}</p>
                <p>2. {{ nl('page_review_tip_review_tip2') }}</p>
                <p>3. {{ nl('page_review_tip_review_tip3') }}</p>
                <p>4. {{ nl('page_review_tip_review_tip4') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
// import { mapState } from 'vuex'
import { otherPageUrlToFormatUrl } from '@/assets/js/utils.js'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import WriteReviews from '@/components/review/WriteReviews'
import azShare from '@/components/az-ui/Share/AzShare'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'

export default {
  name: 'OrderReview',
  components: {
    mainApp,
    backToTop,
    WriteReviews,
    azShare,
    AzSticker
  },
  data() {
    return {
      pageLoading: false,
      loadingFlag: false,
      shareList: []
    }
  },
  computed: {
    breadCrumbInfo() {
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        login: {
          title: 'test'
        }
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      const url = '/1.0/review/order'
      const res = await context.$axios.$get(url, { params: query })

      if (res.code == 0) {
      } else if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, context.store.state.currentCountryUrl + `/user/login?back=${encodeURIComponent(context.route.fullPath)}`)
        return
      } else if (res.code == 302) {
        context.redirect(302, context.store.state.currentCountryUrl + res.data)
        return
      } else {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }

      // 兼容
      let reasonsRes = {}
      try {
        reasonsRes = await context.$axios.$get('/1.0/review/reason-list')
      } catch {}

      context.store.commit('setJsKey', 'order_review')

      return {
        ...commonAsyncData,
        isSuccess: !res.data.hasReview,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        baseInfo: res.data.baseInfo || {},
        size: res.data.styleInfo && res.data.styleInfo.size ? res.data.styleInfo.size : {},
        sizeOrdered: res.data.sizeOrdered,
        recId: res.data.recId,
        rating: res.data.rating,
        orderSn: query.order_sn,
        reasons: reasonsRes.data || []
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
  methods: {
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
    },
    writeSuccess(res) {
      if (res.data.shareInfo && res.data.shareInfo.list) {
        this.shareList = this.getShareList(res.data.shareInfo.list)
      }
      this.isSuccess = true
      this.rating = res.starstar
    }
  }
}
</script>

<style lang="less" scoped>
.order-review-box {
  .page-center-main {
    min-width: 1263px;
    max-width: 1353px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 100px - 20px - 15px;
    clear: both;
    min-height: 535px;
    box-sizing: border-box;
  }
  .account-back {
    color: var(--color-121212);
    &:hover {
      color: @theme;
    }
    &:before {
      display: inline-block;
      content: '';
      overflow: hidden;
      width: 6px;
      height: 8px;
      background: url('~assets/images/a_sprite_l_20190128.png') no-repeat -38px -167px;
      margin-right: 8px;
    }
  }
  .order-title {
    font-size: 16px;
    padding-bottom: 10px;
    text-transform: uppercase;
    font-family: @font-family-600, sans-serif;
    border-bottom: 1px solid #ccc;
  }
  .wreview-content {
    display: flex;
    margin-top: 30px;
    .review-success {
      font-weight: bold;
      margin-top: 35px;
      margin-bottom: 20px;
    }
    .comment-share {
      margin-top: 40px;
      display: flex;
      align-items: center;
      .share-desc {
        margin-right: 5px;
        margin-left: auto;
        font-weight: bold;
      }
    }
    /deep/ .write-review-form {
      height: auto;
      width: 100%;
      margin-top: 25px;
      overflow: unset;
      .fit {
        .lable_fit {
          margin-left: 100px;
          label {
            text-transform: capitalize;
          }
        }
      }
    }
    .wreview-content-left {
      float: left;
      width: 100%;
      margin-right: 390px;
    }
    .wreview-content-right {
      // margin-top: 33px;
      // margin-left: 40px;
      // float: right;
      margin-top: 33px;
      margin-left: -350px;
      float: left;
      .write-review-goods-info {
        width: 350px;
        box-sizing: border-box;
        background: #f6f6f6;
        padding: 20px 15px 15px;
        h2 {
          margin-bottom: 15px;
          text-align: center;
          font-family: @font-family-600, sans-serif;
          text-align-last: left;
        }
        .goods-info {
          background: #fff;
          display: flex;
          align-items: center;
          padding: 10px;
          .goods-name {
            color: var(--color-121212);
            &:hover {
              color: @theme;
            }
          }
          img {
            width: 124px;
            height: 171px;
            display: block;
          }
          .goods-thumb-box {
            position: relative;
            .mattel {
              position: absolute;
              right: 3px;
              bottom: 3px;
              font-size: 12px;
              line-height: 12px;
              text-transform: uppercase;
              color: #fff;
              transform-origin: right bottom;
              transform: scale(0.3);
              width: max-content;
            }
          }
          .name-price {
            text-align: center;
            width: 100%;
          }
          .goods-price {
            font-family: @font-family-600, sans-serif;
          }
        }
        .comment-tips {
          margin-top: 5px;
          font-size: 12px;
          color: #666;
          h3,
          p {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
