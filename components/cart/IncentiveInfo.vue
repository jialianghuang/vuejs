<template>
  <div class="incentive-info">
    <div class="ca-shipping-content">
      <img :src="require('~/assets/images/cart/notice_icon.png')" alt="notice_icon" />
      <span class="text">{{ nl('page_incentive_shipping_tips') }}</span>
    </div>
    <div v-if="awardInfo.have_dress" class="incentive-info-box">
      <template v-if="awardInfo.have_normal_dresses">
        <div class="all-normal-dresses">
          <div v-if="awardInfo.quarter_popular" class="most_popular_30">
            <!-- <=25% -->
            <div class="note_item case_1">
              <img :src="require('~/assets/images/cart/popular_icon.png')" alt="popular_icon" />
              <span class="text">{{ awardInfo.quarter_popular.string }}</span>
            </div>
          </div>
          <div v-else-if="awardInfo.half_popular" class="most_popular_30">
            <!-- 15%< <=50% -->
            <div class="note_item case_2">
              <img :src="require('~/assets/images/cart/view_icon.png')" alt="view_icon" />
              <span class="text">{{ awardInfo.half_popular.string }}</span>
            </div>
          </div>
          <div :class="awardInfo.random_string" v-else-if="awardInfo.random_string" class="other">
            <div class="note_item copy1">
              <img :src="require('~/assets/images/cart/cart_icon.png')" alt="cart_icon" />
              <span class="text">{{ nl('page_cart_incentive_random_string_1') }}</span>
            </div>
            <div class="note_item copy2">
              <img :src="require('~/assets/images/cart/black_wallet_icon.png')" alt="black_wallet_icon" />
              <span class="text">{{ nl('page_cart_incentive_random_string_2') }}</span>
            </div>
            <div class="note_item copy3">
              <img :src="require('~/assets/images/cart/clock_icon.png')" alt="clock_icon" />
              <span class="text">{{ unescape(nl('page_cart_incentive_random_string_3')) }}</span>
            </div>
            <div class="note_item copy4">
              <img :src="require('~/assets/images/cart/view_icon.png')" alt="view_icon" />
              <span class="text">{{ nl('page_cart_incentive_random_string_4') }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="have_preferential_dresses">
          <div v-if="awardInfo.only_flash_sale" class="only_flash_sale">
            <!-- 0h<h<=2h -->
            <div v-if="showItem == 'case_1'" class="note_item case_1">
              <img :src="require('~/assets/images/cart/flash_sale_icon.png')" alt="flash_sale_icon" />
              <span v-html="nl('page_incentive_time_1', null, { timeText: timeText })" class="text"></span>
            </div>
            <!-- 2h<h<=48h -->
            <div v-else-if="showItem == 'case_2'" class="note_item case_2">
              <img :src="require('~/assets/images/cart/flash_sale_icon.png')" alt="flash_sale_icon" />
              <span v-html="nl('page_incentive_time_2', null, { timeText: timeText })" class="text"></span>
            </div>
            <!-- h>48h -->
            <div v-else-if="showItem == 'case_3'" class="note_item case_3">
              <img :src="require('~/assets/images/cart/off_icon_new.png')" alt="off_icon_new" />
              <span v-html="nl('page_incentive_saved', null, { flashSaleSave: awardInfo.flash_sale_save })" class="text"></span>
            </div>
          </div>
          <div v-else-if="awardInfo.only_promotion" class="note_item only_promotion">
            <img :src="require('~/assets/images/cart/off_icon_new.png')" alt="off_icon_new" />
            <span class="text"
              >{{ awardInfo.only_promotion_discount ? awardInfo.only_promotion_discount.string : '' }}<br />{{
                nl('page_cart_get_this_offer')
              }}</span
            >
          </div>
          <div v-else-if="awardInfo.both_have" class="note_item both_have">
            <img :src="require('~/assets/images/cart/notice_icon.png')" alt="notice_icon" />
            <span class="text">{{ nl('page_cart_incentive_both_all') }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'IncentiveInfo',
  components: {},
  data() {
    return {
      hour: 0,
      minute: 0,
      showItem: '',
      timeText: ''
    }
  },
  computed: {
    ...mapState('cart', ['awardInfo']),
    ...mapState({
      flashSaleInfo: (state) => state.flashSale
    })
  },
  watch: {
    flashSaleInfo: {
      handler(val, oldVal) {
        this.$nextTick(() => {
          if (this.flashSaleInfo && Object.keys(this.flashSaleInfo).length && this.awardInfo.only_flash_sale) {
            this.remainTime = this.diffTime()
            if (this.remainTime > 0) {
              const countDown = setInterval(() => {
                if (this.remainTime > 0) {
                  this.remainTime--
                  this.timeFormat()
                }
                if (this.remainTime <= 0) {
                  clearInterval(countDown)
                }
              }, 1000)
            }
          }
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.setDataLayer({
      action: 'view',
      category: 'CartMotivation',
      label: `CartMotivation_View`
    })
  },
  methods: {
    // 有个加车挽留的功能
    diffTime() {
      if (!this.flashSaleInfo.startTime || !this.flashSaleInfo.endTime || !this.serverTime) return 0
      const startTime = new Date(this.flashSaleInfo.startTime.replace(/-/g, '/')).getTime()
      const serverTime = new Date(this.serverTime.replace(/-/g, '/')).getTime()
      const endTime = new Date(this.flashSaleInfo.endTime.replace(/-/g, '/')).getTime()
      if (startTime <= serverTime && endTime > serverTime) {
        return Math.floor((endTime - serverTime) / 1000)
      }
      return 0
    },
    timeFormat() {
      const restTime = this.remainTime
      const hourSecond = 60 * 60
      const hour = Math.floor(restTime / hourSecond)
      const minute = Math.floor((restTime - hour * hourSecond) / 60)
      this.timeText = ''
      this.showItem = ''
      if (hour > 48 || (hour == 48 && minute > 0)) {
        this.showItem = 'case_3'
        this.timeText = ''
      } else if ((hour == 2 && minute > 0) || (hour > 2 && hour < 48) || (hour == 48 && minute == 0)) {
        this.showItem = 'case_1'
        this.timeText = hour
      } else if (hour < 2 || (hour == 2 && minute == 0)) {
        this.showItem = 'case_2'
        this.timeText = Math.floor(restTime / 60)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.incentive-info {
  .ca-shipping-content {
    display: flex;
    align-items: flex-start;
    margin-top: 15px;
    img {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }
    .text {
      align-self: center;
      font-family: @font-family-500;
      color: var(--color-121212);
      font-size: 12px;
      margin-left: 3px;
      letter-spacing: -0.4px;
      line-height: 16px;
    }
  }
  .incentive-info-box {
    .other {
      .note_item {
        display: none;
      }
      &.copy1 .note_item.copy1 {
        display: flex;
      }
      &.copy2 .note_item.copy2 {
        display: flex;
      }
      &.copy3 .note_item.copy3 {
        display: flex;
      }
      &.copy4 .note_item.copy4 {
        display: flex;
      }
    }

    .note_item {
      display: flex;
      align-items: flex-start;
      margin-top: 10px;
      img {
        width: 24px;
        height: 24px;
        flex: 0 0 24px;
      }
      .text {
        align-self: center;
        font-family: @font-family-500;
        color: var(--color-121212);
        font-size: 12px;
        margin-left: 3px;
        letter-spacing: -0.4px;
        line-height: 16px;
      }
    }
  }
}
</style>
