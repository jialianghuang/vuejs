<template>
  <div class="events-menus-box">
    <section v-if="!!subSmallBox.length" class="emb-bottom">
      <a
        v-for="(item, idx) in subSmallBox.slice(0, 5)"
        :key="idx"
        :href="countryUrl(item.url)"
        v-track.view.click="{ common: getBiParams(item.title, idx + 1) }"
        class="embb-item"
      >
        <img
          v-if="item.url.includes('/all/guest-of-wedding-dresses')"
          :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/demo/gif/aa/d2/c7c8e35d3d1d80fc2a0bed1fd734aad2.gif')"
          class="hot"
          alt="Flame dynamic diagram"
        />
        <span>{{ item.title }}</span>
        <img
          v-if="item.url.includes('/all/winter-wedding-guest-dresses')"
          :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/c0/25/b6dac4449a0c72d9e10c889948ecc025.png')"
          class="heart"
          alt="Flame dynamic diagram"
        />
      </a>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'EventsMenus',
  data() {
    return {
      popupShow: false
    }
  },
  computed: {
    ...mapState({
      subSmallBox: (state) => state.subSmallBox
    })
  },
  watch: {
    popupShow: {
      handler(val) {
        if (process.client) {
          const bodyDom = document.querySelector('body')
          const isHidden = val ? 'hidden' : ''
          bodyDom.style.setProperty('overflow', isHidden)
          this.setMessageZindex(val)
        }
      }
    }
  },
  methods: {
    getBiParams(attr1, index) {
      if (process.server) return
      let resEl = attr1
      if (attr1 && String(attr1).length > 0) {
        resEl = attr1.replace(/\s/g, '').toLowerCase()
      }
      return {
        ec: 'wgdsellpoint',
        el: resEl,
        msg: JSON.stringify({ attr1: index })
      }
    },
    clickEventsMenusItem(item) {
      if (item.isClick) {
        return this.$emit('showCouponBox')
      }
      if (item.isLink && item.linkUrl) {
        return window.open(this.countryUrl(item.linkUrl), '_self')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.events-menus-box {
  .presidents-day {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    background-color: #fde9e9;
    &-title {
      font-size: 24px;
      color: var(--color-121212);
      margin: 0 30px;
      line-height: 60px;
      cursor: pointer;
      &.bold {
        font-family: @font-family-600;
      }
    }
  }
  .emb-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .embb-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 3px;
      background-color: #f8f2ef;
      font-family: @font-family-600;
      font-size: 14px;
      max-height: 60px;
      overflow: hidden;
      padding: 20px 0;
      text-align: center;
      color: var(--color-121212);
      box-sizing: border-box;
      .hot {
        width: 15px;
      }
      .heart {
        width: 23px;
      }
      .hot + span {
        color: @theme-color;
      }
      &:not(:first-child) {
        margin-left: 15px;
      }
    }
  }
}
</style>
