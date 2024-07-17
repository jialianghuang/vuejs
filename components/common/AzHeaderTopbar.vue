<template>
  <div id="header-topbar" v-if="topBarInfo.length > 0" class="az-header-topbar">
    <div ref="topBarSwiper" v-if="topBarInfo.length > 0" v-swiper:topBarSwiper="swiperOption" class="swiper-container swiper-box">
      <div class="swiper-wrapper">
        <div v-for="topBarInfoItem in topBarInfo" :key="topBarInfoItem.key" class="swiper-slide">
          <div v-html="topBarInfoItem.html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
let vm = null // eslint-disable-line no-unused-vars
export default {
  name: 'AzHeaderTopbar',
  data() {
    return {
      swiperOption: {
        direction: 'vertical',
        loop: true,
        autoplay: {
          delay: 4000,
          stopOnLastSlide: false,
          disableOnInteraction: true,
          speed: 300
        },
        on: {
          init() {
            if (vm.cancelExtraPoint(`TopBarNotification${this.realIndex + 1}_View`, `TopBarNotification${this.realIndex + 1}_View`)) {
              vm.setDataLayer({
                action: 'view',
                category: 'TopBarNotification_View',
                label: `TopBarNotification${this.realIndex + 1}_View`
              })
            }
          },
          slideChange() {
            if (vm.cancelExtraPoint(`TopBarNotification${this.realIndex + 1}_View`, `TopBarNotification${this.realIndex + 1}_View`)) {
              vm.setDataLayer({
                action: 'view',
                category: 'TopBarNotification_View',
                label: `TopBarNotification${this.realIndex + 1}_View`
              })
            }
          },
          tap() {
            vm.setDataLayer({
              action: 'click',
              category: 'TopBarNotification_Click',
              label: `TopBarNotification${this.realIndex + 1}_Click`
            })
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      topBarInfoOrigin: (state) => state.topBarInfo
    }),
    topBarInfo() {
      const topBar = this.topBarInfoOrigin
      const data = []
      for (const i in topBar) {
        const bar = topBar[i]
        if (bar.flag == 'free swatch' && this.noSwatch) {
          continue
        }
        data.push(bar)
      }
      return data
    },
    swiper() {
      return this.$refs.topBarSwiper.swiper
    }
  },
  watch: {
    topBarInfo: {
      handler(newVal) {
        this.$nextTick(() => {
          if (this.topBarSwiper) {
            if (Object.keys(this.topBarInfo).length <= 1) {
              this.topBarSwiper.loopDestroy()
              this.topBarSwiper.update()
              this.topBarSwiper.allowTouchMove = false
            } else {
              this.topBarSwiper.loopDestroy()
              this.topBarSwiper.loopCreate()
              this.topBarSwiper.update()
              this.topBarSwiper.allowTouchMove = true
            }
          }
        })
      },
      immediate: true
    }
  },
  created() {
    vm = this
  }
}
</script>

<style lang="less" scoped>
.az-header-topbar {
  box-sizing: border-box;
  min-width: 1263px;
  width: 100%;
  padding: 0;
  max-height: 40px;
  background-color: #272727;
  color: #fff;
  text-align: center;
  overflow: hidden;
  line-height: 40px;
  .swiper-container,
  .swiper-slide {
    height: 40px;
  }
  .swiper-slide {
    width: 100%;
  }
  /deep/ a {
    color: #fff;
  }
}
</style>
