<template>
  <div v-track.view.click="getBiCommonParams('trackshipment', 'page')" class="tracking-box">
    <main-app :navigation="navigation">
      <div class="main-content">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div class="tracking-main">
          <div v-track.view="getBiCommonParams('expectedarrival', 'module')" class="tracking-arrival tracking-module">
            <div class="module-title">{{ nl('page_tracking_expected_arrival') }}</div>
            <div class="arrival-box">
              <div v-if="!shippingSignedTime" class="arrival-desc">{{ nl('page_tracking_expected_arrival_desc') }}</div>
              <div class="arrival-date">
                <div class="arrival-date-title">{{ deliveryTimeList.calendarTitle }}</div>
                <div class="arrival-date-content">
                  <client-only>
                    <date-picker
                      :inline="true"
                      v-model="selectedDate"
                      :append-to-body="false"
                      :popup-style="{ top: '40px', left: '0', zIndex: 1 }"
                      :disabled-date="disabledDate"
                      :clearable="false"
                      :editable="false"
                      :lang="datePickerLang"
                      @change="handleDateChange"
                      :default-value="startDate"
                      :multiple="true"
                      :input-attr="{ 'aria-label': 'date picker' }"
                      type="dates"
                      placeholder=""
                      class="data-picker-box"
                      value-type="YYYY-MM-DD"
                    ></date-picker>
                  </client-only>
                </div>
              </div>
            </div>
          </div>
          <div v-track.view="getBiCommonParams('status', 'module')" class="tracking-status tracking-module">
            <div class="module-title">
              <span>{{ nl('page_common_status') }}</span>
              <div
                v-track.view="{ common: { ec: 'sharetracking', el: 'share' } }"
                @mouseenter="setPoint('sharetracking', 'share', 'click')"
                class="share-box"
              >
                <az-icon icon-class="az-share-icon-arrow" class="share-icon"></az-icon>
                <div class="share-container">
                  <div class="share-container-text">
                    <span>{{ nl('page_common_share') }}</span>
                    <span>{{ nl('page_common_to') }}</span>
                  </div>
                  <AzShareNew v-bind="bindShareConfig" />
                </div>
              </div>
            </div>
            <div class="status-box">
              <div v-if="trackMessageList && trackMessageList[0]" class="status-desc">
                {{ trackMessageList[0].message }}
              </div>
              <div class="status-title">{{ nl('page_tracking_shipping_activity') }}</div>
              <div class="status-content">
                <template v-for="item in trackMessageList">
                  <div :key="item.key" class="status-item">
                    <div class="date">
                      <p>{{ item.checkpointTimeStr }}</p>
                    </div>
                    <div class="desc">
                      <p>{{ item.message }}</p>
                    </div>
                  </div>
                </template>
              </div>
              <div class="tracking-info">
                <p>
                  <a
                    :href="trackInfo.trackingUrl"
                    v-track.click="getBiCommonParams('carriername', 'button')"
                    target="_blank"
                    class="bold text-up"
                    >{{ trackInfo.shippingCarrier }}</a
                  >
                  <span class="text-ca">{{ nl('page_tracking_number') }}</span>
                </p>
                <p class="mt-5">
                  <a
                    :href="trackInfo.trackingUrl"
                    v-track.click="getBiCommonParams('trackingnumber', 'button')"
                    class="link bold"
                    target="_blank"
                    >{{ trackInfo.trackingNumber }}</a
                  >
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="bannerList && bannerList[0]"
            v-track.view.click="getBiCommonParams('shopbridesmaid', 'banner1')"
            class="tracking-ad tracking-module"
          >
            <a :href="countryUrl(bannerList[0].url)" target="_blank">
              <img :src="addWebpSuffix(bannerList[0].imageUrl)" alt="tracking" class="img" />
              <div class="img-desc">{{ bannerList[0].title }}</div>
            </a>
          </div>
        </div>

        <order-goods-item
          :orderGoods="orderGoods"
          :fromTrackingPage="true"
          v-track.view="getBiCommonParams('ordersummary', 'ordersummary')"
        ></order-goods-item>
        <most-popular
          v-if="sampleRecommendDressAble ? Object.keys(recommendProducts).length > 0 : Object.keys(cartRecommendList).length > 0"
          :mostPopular="sampleRecommendDressAble ? recommendProducts : cartRecommendList"
          :title="nl('page_cart_recommend_desc')"
          :fromTrackingPage="true"
          :sampleRecommendDressAble="sampleRecommendDressAble"
        ></most-popular>

        <div v-track.view.click="getBiCommonParams('categorybanner', 'all')" class="more-to-love-box">
          <div class="more-title">{{ nl('page_tracking_more_to_love') }}</div>
          <div class="more-content">
            <template v-for="(moreItem, index) in bannerList">
              <a
                :key="`${moreItem.title}_${index}`"
                v-track.view.click="getBiCommonParams('categorybanner', `banner_${index + 1}`)"
                :href="countryUrl(moreItem.url)"
                v-if="index"
                class="more-item"
                target="_blank"
              >
                <img :src="addWebpSuffix(moreItem.imageUrl)" alt="more" class="img" />
                <div class="img-desc">{{ moreItem.title }}</div>
              </a>
            </template>
          </div>
        </div>
      </div>
      <scroll-to-top :icon-class="isBridal ? 'black' : 'pink'"></scroll-to-top>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import ScrollToTop from '@/components/common/ScrollToTop'
import BreadCrumb from '@/components/common/Breadcrumb'
import OrderGoodsItem from '@/components/order/OrderGoodsItem'
import MostPopular from '@/components/index/MostPopular'
import AzShareNew from '@/components/az-ui/Share/AzShareNew'
import { init, resetSeoUrl } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'

export default {
  name: 'Ticket',
  components: {
    mainApp,
    ScrollToTop,
    BreadCrumb,
    OrderGoodsItem,
    MostPopular,
    DatePicker,
    AzShareNew
  },
  data() {
    return {
      showShareBox: false,
      selectedDate: '',
      recommendProducts: {} // 样衣订单推荐正式裙子
    }
  },
  computed: {
    datePickerLang() {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = this.language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    },
    breadCrumbInfo() {
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        submitTicket: {
          title: this.nl('page_tracking_shipment')
        }
      }
    },
    trackMessageList() {
      return this.trackInfo && this.trackInfo.trackMessageList ? this.trackInfo.trackMessageList : []
    },
    shippingSignedTime() {
      if (this.deliveryTimeList.shippingSignedTime) {
        return this.$dayjs(this.deliveryTimeList.shippingSignedTime * 1000).format('YYYY-MM-DD')
      }
      return ''
    },
    startDate() {
      if (this.deliveryTimeList.lastGetTimestamp && this.deliveryTimeList.lastGetTimestamp.start_timestamp) {
        return this.$dayjs(this.deliveryTimeList.lastGetTimestamp.start_timestamp * 1000).format('YYYY-MM-DD')
      }
      return null
    },
    endDate() {
      if (this.deliveryTimeList.lastGetTimestamp && this.deliveryTimeList.lastGetTimestamp.end_timestamp) {
        return this.$dayjs(this.deliveryTimeList.lastGetTimestamp.end_timestamp * 1000).format('YYYY-MM-DD')
      }
      return null
    },
    bindShareConfig({ orderGoods }) {
      return {
        shareConfig: [],
        baseInfo: orderGoods[0],
        size: 30,
        fontSize: 30,
        lineHeight: 30,
        space: 15,
        showColorIcon: true
      }
    }
  },
  async asyncData(context) {
    try {
      context.store.commit('setIsBridal', context.route.query.subsite === 'bridal')
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      context.store.commit('setJsKey', 'tracking')
      const { tracking: track, order } = context.route.query
      const params = {
        track,
        ...context.route.query,
        order: order ? order.toString() : ''
      }
      const apiUrl = '/1.0/trackShipment/info'
      const res = await context.$axios.$post(apiUrl, params)
      if (res.code == 0) {
      } else if (res.code == 5) {
        // code等于5表明redis链接失败，需要用户刷新重试
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, resetSeoUrl(context, `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`))
        return
      } else if (res.code == 100001 || res.code == 100501) {
        context.redirect(302, resetSeoUrl(context, `/user/login?back=${context.route.fullPath}`))
        return
      } else {
        context.redirect(302, resetSeoUrl(context, '/order/list'))
        return
      }

      return {
        ...commonAsyncData,
        orderGoods: res.data.orderGoods || [],
        trackInfo: res.data.trackInfo || {},
        deliveryTimeList: res.data.deliveryTimeList || {},
        cartRecommendList: res.data.cartRecommendList || {},
        bannerList: res.data.bannerList || [],
        orderSn: order ? order.toString() : '',
        sampleRecommendDressAble: res.data.sampleRecommendDressAble
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
  created() {
    this.selectedDate = this.shippingSignedTime
    if (process.client) {
      this.sampleRecommendDressAble && this.getOrderRecommend()
    }
  },
  mounted() {},
  methods: {
    disabledDate(current) {
      // 设置预计到达日期前后为不可选日期，用来控制 datepicker 的样式。到达时间需要设置为可选
      if (this.shippingSignedTime) {
        return current && this.$dayjs(current).format('YYYY-MM-DD') !== this.shippingSignedTime
      } else {
        return current && (current < this.$dayjs(this.startDate).startOf('day') || current > this.$dayjs(this.endDate).startOf('day'))
      }
    },
    handleDateChange(date) {
      // 因为没有找到这个插件禁止点击的属性，所以这里添加一个change方法， 强制选中时间为我们想要固定的时间
      this.selectedDate = this.shippingSignedTime
    },
    getBiCommonParams(ec, el) {
      if (process.server) return
      const params = {
        common: {
          ec,
          el
        }
      }
      return params
    },
    // 获取样衣订单推荐正式裙子
    getOrderRecommend() {
      this.recommendProducts = {}
      const params = { order_sn: this.orderSn }
      this.$axios.$get('/1.0/recommend/sample-to-dress', { params }).then((res) => {
        if (res.code == 0) {
          this.recommendProducts = Object.keys(res.data).length ? res.data : {}
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.text-ca {
  text-transform: capitalize;
}
.text-up {
  text-transform: uppercase;
}
.mt-5 {
  margin-top: 5px;
}
.main-content {
  width: auto;
  min-width: 1263px;
  max-width: 1353px;
  margin: 0 auto;
  padding: 0 30px 20px;
  color: var(--color-121212);
  box-sizing: border-box;
  .tracking-main {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 5px;
    .tracking-module {
      width: 32.25%;
      .module-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: @font-family-600;
        font-size: 16px;
        line-height: 40px;
        color: var(--color-121212);
        border-bottom: 1px solid var(--color-cccccc);
        text-transform: uppercase;
        .share-box {
          position: relative;
          width: 24px;
          height: 24px;
          line-height: 24px;
          transform: translateY(15px);
          .share-icon {
            width: 24px;
            height: 24px;
            font-size: 24px;
            fill: var(--color-121212);
            transform: translateY(-15px);
            &:hover + .share-container {
              display: block;
            }
          }
          .share-container {
            padding: 15px 20px 20px;
            background-color: #fff;
            position: absolute;
            top: calc(100% - 5px);
            left: 50%;
            display: none;
            transform: translateX(-50%);
            line-height: normal;
            border: 1px solid #d9d9d9;
            border-radius: 3px;
            z-index: @z-index;
            &-text {
              margin-bottom: 10px;
              text-transform: lowercase;
              font-size: 13px;
              color: var(--color-121212);
              font-family: @font-family-600;
              text-align: center;
              text-transform: lowercase;
              &::first-letter {
                text-transform: uppercase;
              }
            }
            &::before {
              content: '';
              position: absolute;
              top: -6px;
              left: 50%;
              right: 50%;
              transform: translateX(-50%) rotate(45deg);
              border-left: 12px solid #fff;
              border-top: 12px solid #fff;
              box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
            }
            &::after {
              content: '';
              position: absolute;
              top: -3px;
              left: 50%;
              right: 50%;
              transform: translateX(-50%) rotate(45deg);
              border-left: 12px solid #fff;
              border-top: 12px solid #fff;
              box-shadow: 0 0 8px 0 #fff;
            }
            &:hover {
              display: block;
            }
          }
          &:hover {
            .share-container {
              display: block;
            }
          }
        }
      }
    }
    .tracking-arrival {
      .arrival-box {
        height: 480px;
        padding: 30px 16px 0;
      }
      .arrival-desc {
        margin: 0 0 30px;
        font-size: 14px;
        line-height: 19px;
        text-transform: uppercase;
      }
      .arrival-date-title {
        font-family: @font-family-600;
        font-size: 24px;
        line-height: 33px;
        color: var(--color-121212);
        text-transform: uppercase;
      }
      .arrival-date-content {
        .data-picker-box {
          display: block;
          width: 100%;
          margin: 20px auto 0;
          /deep/.mx-datepicker-main {
            border: none;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          }
          /deep/.mx-calendar {
            width: 100%;
            padding: 15px;
          }
          /deep/.mx-calendar-content {
            height: unset;
            .mx-table-date {
              tbody {
                height: 211px;
              }
            }
            .cell {
              background: @bg-color;
              cursor: default;
              &.disabled {
                background: #fff;
                color: var(--color-999999);
              }
              &.active {
                background: @theme-color;
                color: #fff !important;
              }
              &.today {
                color: var(--color-999999);
              }
            }
            .mx-table {
              th {
                text-align: center !important;
                color: var(--color-999999);
              }
            }
          }
          /deep/.mx-btn {
            color: var(--color-999999);
          }
        }
      }
    }
    .tracking-status {
      .status-box {
        background: @bg-color;
        padding: 20px 15px 0;
        max-height: 480px;
        height: 480px;
        overflow-y: auto;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        &::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 6px;
        }
        .status-desc {
          font-family: @font-family-600;
          font-size: 24px;
          line-height: 33px;
          text-transform: uppercase;
        }
        .status-title {
          font-size: 14px;
          line-height: 19px;
          margin: 15px 0 20px;
          text-transform: uppercase;
        }
        .status-content {
          .status-item {
            padding: 20px 0;
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 19px;
            border-top: 1px solid var(--color-cccccc);
            .date {
              width: 46px;
              margin-right: 30px;
            }
            .desc {
              flex: 1;
            }
          }
        }
        .tracking-info {
          border-top: 1px solid var(--color-cccccc);
          padding: 20px 0;
          font-size: 14px;
          line-height: 19px;
          .bold {
            font-family: @font-family-600;
            color: var(--color-121212);
          }
          .link {
            text-decoration: underline;
            color: var(--color-121212);
          }
        }
      }
    }
    .tracking-ad {
      .img {
        width: 100%;
        height: auto;
        vertical-align: middle;
      }
      .img-desc {
        width: 100%;
        background: @bg-color;
        height: 50px;
        line-height: 20px;
        font-size: 16px;
        font-family: @font-family-600;
        color: var(--color-121212);
        text-align: center;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  /deep/.most-popular {
    padding: 0;
    margin: 40px 0 60px;
    .title {
      font-size: 16px;
      line-height: 22px;
      font-family: @font-family-600;
      padding: 9px 0;
      margin-bottom: 30px;
    }
  }
  .more-to-love-box {
    .more-title {
      font-size: 16px;
      line-height: 22px;
      font-family: @font-family-600;
      padding: 9px 0;
      border-bottom: 1px solid var(--color-cccccc);
      margin-bottom: 30px;
      text-transform: uppercase;
    }
    .more-content {
      display: flex;
      justify-content: space-between;
      .more-item {
        width: 32.56%;
        .img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .img-desc {
          width: 100%;
          background: @bg-color;
          height: 50px;
          line-height: 20px;
          font-size: 16px;
          font-family: @font-family-600;
          color: var(--color-121212);
          text-align: center;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
