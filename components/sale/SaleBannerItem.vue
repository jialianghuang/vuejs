<template>
  <a
    @click="handleClick()"
    :id="`sale_list_banner_${keyStr}`"
    :href="countryUrl(item.linkUrl)"
    :class="{ small: category == 'ready-to-ship' }"
    :aria-label="'sale banner ' + keyStr.replace('_', ' ')"
    class="item-link"
  >
    <img :src="require('~/assets/images/default_img.jpg')" :data-src="addWebpSuffix(item.imgUrl)" :alt="item.linkUrl" class="lazyload" />
  </a>
</template>

<script>
export default {
  name: 'SaleBannerItem',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    isFirstBanner: {
      type: Boolean,
      default() {
        return null
      }
    },
    category: {
      type: String,
      default() {
        return null
      }
    },
    keyStr: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      scrollDointFlag: false
    }
  },
  watch: {
    scrollDointFlag(nval) {
      if (nval) {
        this.handleBuryPoint('view')
      }
    }
  },
  mounted() {
    // 初始化
    const ele = document.querySelector(`#sale_list_banner_${this.keyStr}`)
    this.scrollDointFlag = this.inViewPort(ele, 0.5)
    // 滚动
    this.scrollShowPoint()
  },
  methods: {
    scrollShowPoint() {
      const _this = this
      window.addEventListener('scroll', function() {
        const ele = document.querySelector(`#sale_list_banner_${_this.keyStr}`)
        _this.scrollDointFlag = _this.inViewPort(ele, 0.5)
      })
    },
    handleClick() {
      this.handleBuryPoint('click')
    },
    handleBuryPoint(action) {
      const eventName = this.getBannerEvent(this.item.linkUrl, this.isFirstBanner ? '1' : '2')
      this.salePoint(action, eventName)
    },
    data() {
      return {}
    },
    getBannerEvent(url, index) {
      if (!url || !index) {
        return null
      }
      const eventArray = [
        { key: 'ready-to-ship', '1': '70offreadytoship_smallbanner', '2': '70offreadytoship_bigbanner' },
        { key: 'last-chance-outlet', '1': '85offoutletdress_smallbanner', '2': '85offoutletdress_bigbanner' },
        { key: 'flash-sale', '1': 'flashsales_smallbanner', '2': 'flashsales_bigbanner' },
        { key: 'accessories', '1': 'flashsaleacc', '2': 'flashsaleacc' }
      ]
      let eventName = null
      eventArray.map((item, i) => {
        if (url.includes(item.key)) {
          eventName = item[index]
        }
      })
      return eventName
    },
    salePoint(ea, el) {
      if (!el) {
        return
      }
      const eventParams = {
        dp: 'sale page',
        ec: 'salepage',
        el,
        ea,
        param1: (location && location.href) || '-1'
      }
      if (this.jsKey == 'cybermonday-landing-page') {
        delete eventParams.dp
        eventParams.ec = 'cyber_sale'
      }
      if (this.isFirstBanner) {
        eventParams.param2 = this.isFirstBanner ? this.versionGroup.banner_sale_top : this.versionGroup.banner_sale_footer
      }
      this.buryPoint(this, 'event', eventParams)
    }
  }
}
</script>

<style lang="less" scoped>
.item-link {
  width: 100%;
  &.small {
    margin-top: 13px;
    width: 50%;
    margin: 0px 25% 0px;
    height: 100%;
  }
  img {
    width: 100%;
  }
}
</style>
