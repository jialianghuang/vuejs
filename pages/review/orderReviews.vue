<template>
  <div class="order-reviews-box">
    <main-app :navigation="navigation">
      <div class="main">
        <div class="order-title">{{ isFromWgdReviewEmail ? nl('page_goods_review_write_review') : nl('page_common_my_reviews') }}</div>
        <div v-if="(!goodsList || !Object.keys(goodsList).length) && isFromWgdReviewEmail" class="order-review-list-empty">
          <div class="empty-desc">{{ nl('page_order_reviews_empty_desc') }}</div>
          <a :href="countryUrl('/all/guest-of-wedding-dresses')" class="empty-btn">{{ nl('page_common_shop_more') }}</a>
        </div>
        <div v-else class="order-review-list">
          <div v-for="(item, index) in goodsList" :key="index" class="order-review-item">
            <div class="order-review-img">
              <az-sticker
                v-if="item.baseInfo.stickers && Object.keys(item.baseInfo.stickers).length"
                :stickerInfo="item.baseInfo.stickers"
                :sticker-class="`product-item-icon-small`"
                :goodsId="item.baseInfo.goodsId"
              ></az-sticker>
              <img :src="replaceImgCdnUrl(`${PIC_PATH}s179/${item.baseInfo.goodsThumb}`)" alt="goods thumb" />
              <span v-if="item.baseInfo.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
            </div>
            <div v-if="item.selected" class="order-review-right">
              <p class="goods-name">
                <a :href="item.baseInfo.goodsUrl">{{ item.baseInfo.shownGoodsName }}</a>
              </p>
              <p class="goods-color-box">
                <span>{{ item.baseInfo.isDress ? nl('page_style_dress_color') : nl('page_common_color') }}: </span>
                <span>{{ item.baseInfo.shownColor }}</span>
              </p>
              <p class="goods-size-box">{{ nl('page_common_size') }}: {{ item.sizeOrderedShownName || item.sizeOrdered }}</p>
              <write-reviews
                :isReviewList="true"
                :isExtraOption="true"
                :baseInfo="item.baseInfo"
                :size="item.styleInfo && item.styleInfo.size ? item.styleInfo.size : {}"
                :rating="item.starstar"
                :sizeOrdered="item.sizeOrdered"
                :orderSn="item.orderSn"
                :recId="item.recId + ''"
                @rateChange="rateChange(arguments, index)"
                @success="writeSuccess(arguments, index)"
                :reasons="reasons"
                :hideName="true"
                :isFromWgdReviewEmail="isFromWgdReviewEmail"
                :urlQuery="urlQuery"
                ask-type="reviews"
              ></write-reviews>
            </div>

            <div v-else class="order-review-hide-detail">
              <p v-if="item.isSuccess" class="success-tips">{{ nl('page_oreder_review_thank') }}{{ item.baseInfo.shownGoodsName }}</p>
              <p v-if="item.isSuccess" class="review-note">
                {{ +item.rating >= 3 ? nl('page_js_post_tip') : nl('page_module_reviews_bad_tips') }}
              </p>
              <p class="goods-name">
                <a :href="item.baseInfo.goodsUrl">{{ item.baseInfo.shownGoodsName }}</a>
              </p>
              <p class="goods-color-box">
                <span>{{ item.baseInfo.isDress ? nl('page_style_dress_color') : nl('page_common_color') }}: </span>
                <span>{{ item.baseInfo.shownColor }}</span>
              </p>
              <p class="goods-size-box">{{ nl('page_common_size') }}: {{ item.sizeOrderedShownName || item.sizeOrdered }}</p>
              <div class="starx-wrap">
                <az-rate
                  :value="item.starstar"
                  :showText="true"
                  :textStyle="{ fontSize: '13px', color: '#666', display: 'inline-block', 'vertical-align': 'super', 'margin-top': '5px' }"
                  :readonly="item.isSuccess"
                  @change="rateChange(arguments, index)"
                  font-size="25px"
                ></az-rate>
              </div>
              <!-- TODO 分享 -->
              <div v-if="item.isSuccess && Object.keys(item.shareList).length" class="comment-share">
                <p class="share-desc">{{ nl('page_order_review_share_review') }}:</p>
                <az-share :shareList="item.shareList" :fontSize="'27px'" :space="'0 5px 0 0'"></az-share>
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
import AzRate from '@/components/az-ui/Rate/AzRate'
import azShare from '@/components/az-ui/Share/AzShare'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'

export default {
  name: 'OrderReviews',
  components: {
    mainApp,
    backToTop,
    AzRate,
    WriteReviews,
    azShare,
    AzSticker
  },
  data() {
    return {
      pageLoading: false,
      loadingFlag: false
    }
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const query = otherPageUrlToFormatUrl(commonAsyncData.requestUrl)
      let url = ''
      const isFromWgdReviewEmail = query.from == 'wgd_review_email' // 是否来自wgd的邀约评论邮件
      if (isFromWgdReviewEmail) {
        // 来自wgd的邀约评论邮件,这种情况后台不校验登录态
        url = '/1.0/review/order-review-compilations'
      } else {
        url = '/1.0/review/order-reviews'
      }
      const res = await context.$axios.$get(url, { params: query })
      let goodsList = []

      if (res.code == 0) {
        if (Object.keys(res.data.list).length) {
          goodsList = res.data.list
          goodsList.forEach((element) => {
            element.selected = false
            element.starstar = 0
            element.isSuccess = false
            element.shareList = []
          })
        }
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
        context.redirect(302, res.data)
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
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        reasons: reasonsRes.data || [],
        goodsList,
        isFromWgdReviewEmail,
        urlQuery: query
      }
    } catch (error) {
      console.log(error, '====error====')
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
    console.log(this.goodsList)
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
    writeSuccess(resArguments, index) {
      const res = resArguments[0]
      if (res.data.shareInfo && res.data.shareInfo.list) {
        this.goodsList[index].shareList = this.getShareList(res.data.shareInfo.list)
      }
      this.goodsList[index].isSuccess = true
      this.goodsList[index].rating = res.starstar
      this.goodsList[index].selected = false
    },
    rateChange(val, index) {
      this.goodsList[index].selected = true
      this.goodsList[index].starstar = val[0]
    }
  }
}
</script>

<style lang="less" scoped>
.order-reviews-box {
  .main {
    min-width: 1263px;
    max-width: 1353px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 30px;
    clear: both;
    min-height: 535px;
    color: var(--color-121212);
    box-sizing: border-box;
    width: auto;
  }
  .order-title {
    font-size: 16px;
    padding-top: 30px;
    padding-bottom: 10px;
    text-transform: uppercase;
    font-family: @font-family-600, sans-serif;
    letter-spacing: 1px;
    border-bottom: 1px solid #ccc;
  }
  .goods-name {
    font-family: @font-family-500;
    a {
      color: var(--color-121212);
      &:hover {
        color: @theme;
      }
    }
  }

  .order-review-hide-detail {
    .success-tips {
      font-size: 13px;
      color: @theme;
      font-family: @font-family-600, sans-serif;
    }
    .review-note {
      font-size: 13px;
      margin-bottom: 15px;
    }

    .comment-share {
      margin-top: 40px;
      display: flex;
      align-items: center;
      .share-desc {
        margin-right: 5px;
        font-family: @font-family-600, sans-serif;
      }
    }
  }

  .order-review-list {
    .order-review-item {
      display: flex;
      padding: 20px 0;
      border-bottom: 1px solid #ccc;
      .order-review-img {
        width: 124px;
        margin-right: 10px;
        position: relative;
        img {
          width: 100%;
        }
        .mattel {
          position: absolute;
          right: 3px;
          top: 157px;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          color: #fff;
          transform-origin: right bottom;
          transform: scale(0.35);
          width: max-content;
        }
      }
      .starx-wrap {
        margin-top: 20px;
      }
      .order-review-right {
        width: calc(100% - 134px);
        .goods-color-box {
          margin-top: 4px;
        }
        .goods-size-box {
          margin-top: 4px;
        }
        /deep/ .write-review-form {
          width: 100%;
          height: auto;
          overflow: unset;
          padding-bottom: 10px;
          li {
            margin-bottom: 20px;
            &:last-child {
              margin-bottom: 0;
            }
            &.rating {
              margin: 20px 0;
            }
            .starx-wrap {
              margin: 0;
            }
            .upload-tips {
              margin-bottom: 5px;
            }
            .upload-list {
              .item {
                width: 120px;
                min-width: 120px;
                height: 20px;
                line-height: 20px;
                .title {
                  width: 100px;
                  font-family: @font-family-500;
                }
                .close {
                  top: 7px;
                }
              }
            }
          }
          .fit {
            margin-top: 0;
            margin-bottom: 5px;
            .lable_fit {
              margin-top: 2px;
              margin-left: 100px;
              label {
                text-transform: capitalize;
                margin-bottom: 0;
              }
            }
          }
          .review-comment {
            width: 903px;
            height: 126px;
            box-sizing: border-box;
            vertical-align: middle;
            background-color: #fff;
            &:focus {
              background-color: #fff;
            }
            &::placeholder {
              color: var(--color-999999);
            }
          }
          .additional-title {
            margin-top: 0px;
            margin-bottom: 10px;
            font-family: @font-family-500;
          }
          .line_addition {
            margin-top: 0;
            margin-bottom: 0;
            border-bottom: 1px solid #fff;
          }
        }
        /deep/ .error-tip {
          margin-top: 5px;
        }
      }
    }
  }

  .order-review-list-empty {
    text-align: center;
    .empty-desc {
      font-size: 24px;
      line-height: 33px;
      color: var(--color-121212);
      margin: 90px 0 60px;
    }
    .empty-btn {
      box-sizing: border-box;
      display: inline-block;
      min-width: 190px;
      height: 42px;
      text-align: center;
      line-height: 42px;
      font-family: @font-family-600, sans-serif;
      font-size: 14px;
      color: #fff;
      padding: 0 50px;
      background: @theme-color;
    }
  }
}
</style>
