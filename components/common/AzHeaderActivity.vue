<template>
  <div class="activity-box">
    <div id="activity_bar" :class="{ 'activity-position-fixed': fixed }" class="activity-position">
      <div
        ref="activitySwiper"
        v-swiper:activitySwiper="swiperOption"
        @mouseenter="autoPlayStop"
        @mouseleave="autoPlayStart"
        class="swiper-container swiper-box"
      >
        <a
          v-show="showPagination"
          href="javascript:void(0)"
          class="prev-arraw swiper-button-prev activity-swiper-button-prev"
          aria-label="swiper button prev"
        >
          <span style="display: none">swiper-button-prev</span>
          <az-icon class="arraw-icon" icon-class="icon-lby_arrow_left" />
        </a>
        <a
          v-show="showPagination"
          href="javascript:void(0)"
          class="next-arraw swiper-button-next activity-swiper-button-next"
          aria-label="swiper button next"
        >
          <span style="display: none">swiper-button-next</span>
          <az-icon class="arraw-icon" icon-class="icon-lby_arrow_right" />
        </a>
        <div class="swiper-wrapper">
          <!-- db推广 替换第一个横幅 点击显示领券弹框-->
          <div
            v-if="dbLandingPage"
            :style="{
              background: `var(--color-121212)`
            }"
            @click="handleShowShoppingForDialog"
            class="swiper-slide dbLandingPage"
          >
            <div class="activity-bar-content">
              <div class="bar_text">
                <img
                  :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/c7/9e/d13cc37ca55f330dee24329bbe12c79e.png')"
                  alt="activty bar banner"
                />
              </div>
            </div>
          </div>
          <div
            v-for="(barInfo, index) in barData"
            :key="index"
            v-track.viewOnce.click="{ id: 'RedPromobanner' + index, common: getBiParams(index) }"
            :style="{
              background:
                barInfo.bar && barInfo.bar.backgroundImgUrl
                  ? getBgStyle(barInfo.bar && barInfo.bar.backgroundImgUrl)
                  : 'var(--color-121212)'
            }"
            class="swiper-slide"
          >
            <div
              @click="linkToPage(barInfo.bar.barBanner && barInfo.bar.barBanner.length && barInfo.bar.barBanner[0])"
              :aria-label="barInfo.bar.barBanner && barInfo.bar.barBanner.length && barInfo.bar.barBanner[0].linkUrl"
              :class="{ cursor: barInfo.bar.barBanner && barInfo.bar.barBanner.length && barInfo.bar.barBanner[0].linkUrl }"
              class="activity-bar-content"
            >
              <div :class="{ have_time_countdown: countDownTime[index] }" class="bar_text">
                <a
                  v-for="(bannerItem, key) in barInfo.bar.barBanner"
                  :key="key"
                  :class="{ 'no-cursor': !bannerItem.linkUrl }"
                  @click.stop="linkToPage(bannerItem, bannerItem.newWindows ? '_blank' : '_self')"
                >
                  <img :src="addWebpSuffix(bannerItem.imgUrl)" alt="activty bar banner" />
                  <!-- 热区 lego 配置-->
                  <ImageHotSpot
                    :positions="bannerItem.positions && Array.isArray(bannerItem.positions) ? bannerItem.positions : []"
                    :img-url="bannerItem.imgUrl"
                    ec="Banner"
                  />
                </a>
              </div>
              <div
                v-if="barInfo.couponCode || countDownTime[index]"
                :style="{ color: barInfo.bar.endInColor }"
                :class="{ 'bar-coupon-countdwon': barInfo.couponCode && countDownTime[index] }"
                class="activity-fixed"
              >
                <div v-if="barInfo.couponCode" :style="{ color: barInfo.bar.codeColor }" class="activity-code">
                  {{ nl('page_common_code') }}:
                  <span class="underline">{{ barInfo.couponCode }}</span>
                </div>
                <div v-if="countDownTime[index]" class="activity_countdown_block">
                  {{ barInfo.bar.isPreviewActivity ? nl('page_common_starts_in') : nl('page_year_end_ends_in_capitalize') }}
                  <span :style="{ color: barInfo.bar.countDownColor }" class="time_countdown">
                    <span
                      :style="{ background: barInfo.bar.backGroudColor }"
                      v-if="countDownTime[index]['day']"
                      :class="{ width30: countDownTime[index]['day'].toString().length > 1 }"
                      class="time-countdown-day"
                      >{{ countDownTime[index]['day'] }}<em>d</em>
                    </span>
                    <span :style="{ background: barInfo.bar.backGroudColor }">{{ countDownTime[index]['hour'] }}</span>
                    <em>:</em>
                    <span :style="{ background: barInfo.bar.backGroudColor }">{{ countDownTime[index]['minute'] }}</span>
                    <em>:</em>
                    <span :style="{ background: barInfo.bar.backGroudColor }">{{ countDownTime[index]['second'] }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
// import AzCountDown from '@/components/az-ui/AzCountDown'
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'AzHeaderActivity',
  components: {
    // AzCountDown
  },
  mixins: [bannerMixins],
  languageKeys: ['page_common_code', 'page_common_starts_in', 'page_year_end_ends_in_capitalize'],
  props: {
    fixed: {
      type: Boolean,
      default: false
    },
    barData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showPagination: true,
      swiperOption: {
        loop: false,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          speed: 300
        },
        navigation: {
          nextEl: '.activity-swiper-button-next',
          prevEl: '.activity-swiper-button-prev'
        }
      },
      countDownTime: [],
      activityTimer: []
    }
  },
  computed: {
    dbEndTime() {
      return this.serverTime.split(' ')[0] + ' 23:59:59'
    }
  },
  watch: {
    barData: {
      handler(newVal) {
        this.$nextTick(() => {
          if (this.activitySwiper) {
            if (Object.keys(this.barData).length <= 1) {
              this.activitySwiper.update()
              this.activitySwiper.allowTouchMove = false
              this.showPagination = false
            } else {
              this.activitySwiper.update()
              this.activitySwiper.allowTouchMove = true
              this.showPagination = true
            }
          }
        })

        if (process.client) {
          // this.init()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const clientTime = new Date().getTime()
      const diffTime = new Date(this.serverTime.replace(/-/g, '/')).getTime() - clientTime
      for (const i in this.barData) {
        const barInfo = this.barData[i]
        const status = barInfo.status
        if (status == 'countdown') {
          const endTime = new Date(barInfo.countdownEndTime.replace(/-/g, '/')).getTime()
          this.activityTimer[i] = setInterval(() => {
            const clientTime = new Date().getTime()
            const serverTime = clientTime + diffTime
            let remainTime = Math.floor((endTime - serverTime) / 1000)
            if (remainTime > 0) {
              this.$set(this.countDownTime, i, this.timeFormat(remainTime))
            } else {
              remainTime = 0
              this.$set(this.countDownTime, i, this.timeFormat(remainTime))
              clearInterval(this.activityTimer[i])
              // location.reload()
            }
          }, 1000)
        }
      }
    },
    getBarToWgdBiParams(e) {
      if (process.server) return
      if (e.type == 'sod_banner') {
        const msg = {
          attr1: '0',
          attr2: this.$route.name + '-page',
          category_ids: (this.catIds || []).join(',')
        }
        if (this.$route.name == 'list' && !this.$route.path.includes('/all/special-offer') && this.isSpecialCatId(this.catId)) {
          msg.attr1 = '1'
        }
        if (this.$route.name == 'product' && this.isSpecialCatId(this.catId)) {
          msg.attr1 = '2'
        }
        return {
          ec: e.ec,
          el: e.el,
          msg: JSON.stringify(msg)
        }
      }
      if (e.type == 'navToWgd') {
        return {
          ec: 'topbartowgd',
          el: this.$route.name
        }
      }
    },
    getBiParams(index) {
      if (process.server) return
      return {
        ec: 'Banner',
        el: 'RedPromobanner',
        param1: (location && location.href) || '-1',
        param2: this.versionObj.activityAbtest,
        msg: JSON.stringify({
          report_pos: index
        })
      }
    },
    addZero(val) {
      return val < 10 ? `0${val}` : val
    },
    timeFormat(remainTime) {
      const oneDayTime = 24 * 60 * 60
      const oneHourTime = 60 * 60
      const day = Math.floor(remainTime / oneDayTime)
      const dayRemainTime = remainTime % oneDayTime
      const hour = Math.floor(dayRemainTime / oneHourTime)
      const hourRemainTime = dayRemainTime % oneHourTime
      const minute = Math.floor(hourRemainTime / 60)
      const second = hourRemainTime % 60
      return {
        day,
        hour: this.addZero(hour),
        minute: this.addZero(minute),
        second: this.addZero(second)
      }
    },
    autoPlayStop() {
      this.activitySwiper && this.activitySwiper.autoplay.stop()
    },
    autoPlayStart() {
      if (this.showShoppingForDialog) return
      this.activitySwiper && this.activitySwiper.autoplay.start()
    },
    handleShowShoppingForDialog() {
      this.$store.commit('setShowShoppingForDialog', true)
    },
    getBgStyle(imgUrl) {
      if (!imgUrl) return ''
      return `url(${this.addWebpSuffix(imgUrl)}) no-repeat center`
    },
    linkToPage(item, target) {
      if (!item || !item.linkUrl) return
      if (item.linkUrl.includes('/az-app-dialog/e5e7f8876bea')) {
        this.$store.commit('setShowNewUserCoupon', true)
        this.$store.commit('setShowSlideNewUserCoupon', false)
        this.$store.commit('setFromAzHeaderActivitySource', true)
        this.$emit('show-new-coustom', true)
      } else {
        this.$store.commit('setShowNewUserCoupon', false)
        this.$store.commit('setShowSlideNewUserCoupon', false)
        this.$store.commit('setFromAzHeaderActivitySource', false)
        window.open(this.countryUrl(item.linkUrl, target))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.welcome-count-down {
  /deep/ .time {
    background-color: #fff;
    color: var(--color-121212);
    .d {
      color: var(--color-121212) !important;
    }
  }
}
.underline {
  text-decoration: underline;
}
.activity-box {
  position: relative;
  min-width: 1263px;
  padding-top: 50px;
  height: 0;
  overflow: hidden;
  .activity-position {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: @position-z-index;
    &.activity-position-fixed {
      position: fixed;
      top: 0;
      z-index: @fixed-z-index;
    }
    .swiper-box {
      height: 50px;
      overflow: hidden;
      /deep/ .swiper-slide {
        text-align: center;
        overflow: hidden;
        &.dbLandingPage {
          cursor: pointer;
        }
        .activity-bar-content {
          max-width: 1353px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-sizing: border-box;
          margin: auto;
          // justify-content: space-between;
          padding: 0 30px;
          &.cursor {
            cursor: pointer;
          }
          .bar_text {
            // width: 60%;
            // margin-left: 4%;
            // flex: 1;
            height: 50px;
            display: flex;
            justify-content: center;
            a {
              &.no-cursor {
                cursor: auto;
              }
              img {
                // width: 100%;
                height: 50px;
              }
            }

            p {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              font-family: @font-family-600;
            }
            &.have_time_countdown {
              width: auto;
            }
          }
          .activity-fixed {
            display: flex;
            align-items: center;
            justify-content: space-between;
            &.bar-coupon-countdwon {
              flex: 1;
              .activity-code {
                margin-left: 10%;
              }
            }
            .activity-code {
              font-size: 16px;
              text-transform: uppercase;
              span {
                text-decoration: underline;
              }
            }
            .activity_countdown_block {
              .time_countdown {
                span {
                  display: inline-block;
                  width: 24px;
                  height: 20px;
                  background: #fff;
                  margin-right: 1px;
                  vertical-align: middle;
                  font-size: 14px;
                  line-height: 20px;
                  box-sizing: border-box;
                  text-align: center;
                  font-family: @font-family-700;
                  &.time-countdown-day {
                    margin-right: 4px;
                    &.width30 {
                      width: 30px;
                    }
                    em {
                      transform: translateY(-2px);
                      font-size: 13px;
                    }
                  }
                }
                em {
                  transform: scale(1.5);
                  display: inline-block;
                }
              }
            }
          }
          @media screen and (max-width: 1250px) {
            .activity-fixed {
              display: none;
            }
          }
        }
      }
    }
  }
}
.arraw-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  color: #ffffff;
  filter: drop-shadow(0px 0px 11px rgba(0, 0, 0, 0.3));
}
.prev-arraw,
.next-arraw {
  position: absolute;
  display: block;
  top: 75%;
  // cursor: default;
  background-image: none;
  width: auto;
  height: auto;
}
.prev-arraw {
  left: 40px;
}
.next-arraw {
  right: 40px;
}
/deep/ .swiper-button-disabled {
  pointer-events: auto !important;
}
@media screen and (max-width: 765px) {
  .prev-arraw,
  .next-arraw {
    display: none;
  }
}
</style>
