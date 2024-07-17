<template>
  <div class="wedding-expo">
    <main-app :navigation="navigation">
      <h1 style="display:none">{{ nl('page_common_wedding_expo') }}</h1>
      <div class="wedding-expo-content main">
        <div class="expo-banner">
          <!-- TODO 小图 -->
          <a :href="countryUrl(topBanner.linkUrl)" :aria-label="topBanner.imgAlt" target="_blank">
            <img :src="replaceImgCdnUrl(topBanner.imgUrl)" :alt="topBanner.imgAlt" />
          </a>
        </div>
        <div class="expo-search">
          <span>{{ texts.address }}</span>
          <input v-model="address" class="address" type="text" placeholder="ZIP CODE/CITY" name="address" />
          <span>{{ texts.distance }}</span>
          <select
            v-if="texts.distanceOptions && Object.keys(texts.distanceOptions).length"
            v-model="distance"
            class="distance"
            name="distance"
          >
            <option v-for="(item, index) in texts.distanceOptions" :key="index" :value="item">{{ item }}</option>
          </select>
          <span>{{ texts.unit }}</span>
          <az-button @click="handleSearch" :disabled="loading" class="btn btn-default btn-search">
            {{ nl('page_common_search') }}
          </az-button>
        </div>

        <template v-if="tips">
          <div v-html="unescape(tips)" class="tips"></div>
          <div class="search-not-fund-line">
            <div class="content">{{ nl('page_common_wedding_expo1') }}</div>
            <div class="line"></div>
          </div>
        </template>

        <div v-if="expoList.length" class="expo-list">
          <div v-for="(item, index) in expoList" :key="index" class="expo-item">
            <div class="time-title">
              <div class="time">
                <div class="month">
                  {{ item.month }}
                </div>
                <div class="day">
                  {{ item.day }}
                </div>
              </div>
              <div class="title">
                <div class="event-title">
                  {{ item.expo_name }}
                </div>
                <div class="event-booth"></div>
              </div>
            </div>
            <div class="time-address">
              <div class="date-time">
                <em class="icon-date"></em>
                <div class="text">
                  <div>{{ item.expo_date }}</div>
                  <div>{{ item.expo_time }}</div>
                </div>
              </div>
              <div class="address">
                <em class="icon-address"></em>
                <div class="text">
                  <div>{{ item.address1 }}, {{ item.street }}</div>
                  <div>{{ item.address2 }}</div>
                </div>
              </div>
              <div>
                <az-button class="btn btn-default add-to-calendar">{{ nl('page_add_to_calendar') }}</az-button>
              </div>
            </div>
          </div>
        </div>
        <div class="expo-faq">
          {{ nl('page_middle_qa_last_1') }}
          <a :href="getSupportUrl(`/`, `/`)" target="_blank">{{ nl('page_middle_qa_last_2') }}</a>
          {{ nl('page_middle_qa_last_3') }}
        </div>
      </div>
      <back-to-top></back-to-top>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import backToTop from '@/components/common/BackToTop'
import AzButton from '@/components/az-ui/Button/AzButton'

export default {
  name: 'WeddingExpo',
  components: {
    MainApp,
    backToTop,
    AzButton
  },
  data() {
    return {
      currentMenuTitle: '',
      accountMenu: {},
      loading: false,
      address: '',
      distance: 50,
      tips: ''
    }
  },
  computed: {},
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const res = await context.$axios.$get(`/1.0/help/wedding-expo`)
      if (res.code == 0) {
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
      context.store.commit('setJsKey', 'wedding_expo')
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo || {},
        dataLayerInfo: res.data.dataLayerInfo || {},
        topBanner: res.data.topBanner,
        texts: res.data.texts,
        expoList: res.data.expoList || []
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
  created() {},
  mounted() {},
  methods: {
    handleSearch() {
      this.loading = true
      if (!this.address) {
        this.tips = ''
        setTimeout(() => {
          this.loading = false
        }, 500)
        return false
      }

      this.$axios
        .$post(`/1.0/help/wedding-expo`, { address: this.address, distance: this.distance })
        .then((res) => {
          this.loading = false
          if (res.code == 0) {
            if (res.data.expoList && Object.keys(res.data.expoList)) {
              this.expoList = res.data.expoList
            } else {
              this.tips = res.data.tips
            }
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
.wedding-expo-content {
  width: 1133px;
  &.big {
    width: 1353px;
  }
  .expo-banner {
  }
  .expo-search {
    margin: 0px auto;
    width: 570px;
    margin-top: 30px;
    .address {
      width: 200px;
      height: 40px;
      padding: 0px;
      padding-left: 5px;
      margin-left: 5px;
      margin-right: 25px;
    }
    .distance {
      width: 60px;
      height: 40px;
    }
    .btn-search {
      margin-left: 25px;
      text-transform: uppercase;
    }
  }
  .tips {
    width: 600px;
    font-size: 16px;
    line-height: 17px;
    margin: 40px auto 10px auto;
    text-align: center;
    font-family: @font-family-500;
  }
  .search-not-fund-line {
    margin: 50px auto 20px auto;
    .content {
      width: 325px;
      font-size: 24px;
      font-family: @font-family-500;
      font-weight: 400;
      line-height: 30px;
      display: inline-block;
    }
    .line {
      border-top: 1px solid #e5e1e1;
      display: inline-block;
      height: 4px;
      width: 800px;
    }
  }
  .expo-list {
    display: flex;
    margin-top: 40px;
    .expo-item {
      border: 1px solid var(--color-eeeeee);
      padding-top: 20px;
      box-shadow: 0px 0px 5px 2px rgba(136, 136, 136, 0.1);
      width: 290px;
      height: 270px;
      margin-right: 25px;
      padding: 20px 30px 30px;
      .time-title {
        display: flex;
        align-items: center;
        .time {
          width: 72px;
          height: 74px;
          text-align: center;
          vertical-align: middle;
          background-image: data-uri('~assets/images/help/expo_time.png');
          background-size: 100% 100%;
          .month {
            line-height: 18px;
            color: #808080;
            font-size: 12px;
            margin-top: 25px;
            margin-left: 5px;
          }
          .day {
            line-height: 21px;
            font-size: 26px;
            color: var(--color-121212);
            margin-left: 5px;
            font-weight: 650;
          }
        }
        .title {
          width: 240px;
          line-height: 25px;
          font-weight: 800;
          margin-left: 10px;
          font-size: 18px;
          vertical-align: middle;
          .event-title {
          }
          .event-booth {
          }
        }
      }
      .time-address {
        height: 145px;
        .date-time,
        .address {
          margin-top: 10px;
          line-height: 25px;
          display: flex;
          .icon-date {
            background-image: data-uri('~assets/images/help/Date.png');
            height: 16px;
            width: 16px;
            margin-right: 5px;
            margin-top: 3px;
            display: inline-block;
          }
          .icon-address {
            background-image: data-uri('~assets/images/help/Address.png');
            height: 16px;
            width: 16px;
            margin-right: 5px;
            margin-top: 3px;
            display: inline-block;
          }
          .text {
            flex: 1;
          }
        }
      }
      .add-to-calendar {
        width: 270px;
        margin-top: 25px;
      }
    }
  }
  .expo-faq {
    margin-top: 40px;
    font-size: 16px;
    font-family: @font-family-600;
    a {
      color: @theme;
      text-decoration: underline;
    }
  }
}
</style>
