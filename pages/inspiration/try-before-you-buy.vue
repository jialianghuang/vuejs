<template>
  <div class="brides-box">
    <div style="display:none">
      <h1>{{ nl('page_common_try_before_you_buy') }}</h1>
    </div>
    <main-app :navigation="navigation">
      <div class="center-content">
        <h3>{{ tryData.title }}</h3>
        <p>
          {{ tryData.text | dropFanXie }}
        </p>
        <div v-for="(item, index) in tryData.list" :key="index" class="shopping_guide_box before_your_try_on">
          <h4>{{ item.title }}</h4>
          <div class="step_desc">
            <div v-for="(card, cardIndex) in item.cards" :key="cardIndex">
              <img :src="replaceImgCdnUrl(card.imgUrl)" :alt="card.imgAlt" />
              <div class="desc_box">
                <h5>{{ card.title }}</h5>
                <p v-html="card.text" @click="judgeItem($event, card)"></p>
              </div>
            </div>
          </div>
          <img :src="replaceImgCdnUrl(item.banner.imgUrl)" :alt="item.banner.imgAlt" />
          <a
            :href="countryUrl(item.banner.linkUrl)"
            :data-datalayer-category="item.eventCategory"
            :data-datalayer-label="item.eventName"
            :class="{
              need_datalayer: item.eventCategory && item.eventName
            }"
            class="a_link "
            target="_blank"
            >{{ item.banner.title }}</a
          >
        </div>
        <video-pop-layer v-if="vidoeItem && vidoeItem.videoUrl" @close="close" :item="vidoeItem"></video-pop-layer>
        <style-quiz-layer
          v-if="styleQuizLayerShow"
          @close="setStyleQuizLayerShow(false)"
          :styleQuizBridal="styleQuizBridal"
        ></style-quiz-layer>
        <back-to-top></back-to-top>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import backToTop from '@/components/common/BackToTop'
import VideoPopLayer from '@/components/static/VideoPopLayer'
import StyleQuizLayer from '@/components/static/StyleQuizLayer'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'TryBeforeYouBuy',
  components: {
    mainApp,
    backToTop,
    VideoPopLayer,
    StyleQuizLayer
  },
  data() {
    return {
      vidoeItem: null,
      styleQuizLayerShow: false,
      styleQuizBridal: {}
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const res = await context.$axios.$get(`/1.0/navigation/try-before-you-buy`, {
        params: {
          seoUrl: commonAsyncData.requestUrl
        }
      })

      if (res.code == 0) {
        // 数据正常
      } else if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 9) {
        context.redirect(302, res.data.redirectUrl)
        return
      } else {
        context.redirect(302, '/')
        return
      }
      context.store.commit('setJsKey', 'try-before-you-buy')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        tryData: res.data
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
    close() {
      this.vidoeItem = null
    },
    open(item) {
      if (!item.videoUrl) return
      this.vidoeItem = item
    },
    judgeItem(e, card) {
      if (card.video && card.video.videoUrl) {
        if (e.target.className.includes('video_dialog_entry')) {
          this.vidoeItem = card.video
        }
      }
      if (e.target.className.includes('style_quiz_bridal_nav')) {
        this.setStyleQuizLayerShow(true)
      }
    },
    setStyleQuizLayerShow(bl) {
      this.styleQuizLayerShow = bl
    }
  }
}
</script>

<style lang="less" scoped>
.brides-box {
  .center-content {
    box-sizing: border-box;
    clear: both;
    padding: 0;
    width: 1132px;
    margin: 50px auto 120px;
    clear: both;
    h3,
    h4 {
      margin-bottom: 8px;
      font-size: 26px;
      font-family: Libre Baskerville Regular;
      color: var(--color-121212);
      line-height: 26px;
      cursor: default;
      font-weight: normal;
    }
    h4 {
      margin: 0 0 30px;
      text-align: center;
    }
    p {
      font-size: 13px;
      font-family: @font-family-500;
      color: var(--color-121212);
      line-height: 21px;
      cursor: default;
    }
    .shopping_guide_box {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 45px 45px;
      margin-top: 25px;
      background-color: #fcfaf6;
      text-align: center;
      &:first-child {
        margin-top: 20px;
      }
      .step_desc {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        & > div {
          position: relative;
          width: 334px;
          height: 210px;
          margin-right: 20px;
          background-color: #ffffff;
          &:last-child {
            margin-right: 0;
          }
          .desc_box {
            box-sizing: border-box;
            position: absolute;
            top: 120px;
            width: 100%;
            h5 {
              padding: 0 60px;
              margin-bottom: 10px;
              font-size: 16px;
              font-family: @font-family-600;
              color: var(--color-121212);
              line-height: 22px;
            }
            p {
              padding: 0 70px;
            }
            /deep/ a {
              color: var(--color-121212);
              text-decoration: underline;
              cursor: pointer;
            }
            /deep/ a[data-name='sample_sizes'] {
              text-decoration: none;
              cursor: default;
              pointer-events: none;
            }
          }
        }
      }
      & > img {
        width: 1042px;
      }
      a.a_link {
        position: absolute;
        bottom: 93px;
        width: 358px;
        height: 50px;
        background-color: #fff;
        line-height: 50px;
        color: var(--color-121212);
        font-family: @font-family-600;
        font-size: 14px;
        border-radius: 2px;
      }
    }
    .dialog_tpl {
      display: none;
    }
  }
  #planning_your_try_on {
    .dialog-content {
      padding: 0;
    }
    .measurement-video {
      margin: 0;
      padding: 0;
      .start-note {
        z-index: 1;
      }
      .loading-before {
        position: absolute;
        z-index: 1;
        margin-left: 420px;
        margin-top: 240px;
      }
    }
  }
}
</style>
