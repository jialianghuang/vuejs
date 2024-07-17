<template>
  <div class="buy-now-notice">
    <div class="notice-icon">
      <az-icon icon-class="icon-icon_caveat"></az-icon>
    </div>
    <div class="notice-text">
      {{ nl('page_buy_now_notice_text1 ') }} {{ nl('page_common_please') }}
      <a :href="buyNowNotice.url" class="choose_other">{{ nl('page_buy_now_notice_text2') }} {{ chooseTemp }}</a>
      {{ nl('page_buy_now_notice_text3') }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'BuyNowNotice',
  computed: {
    ...mapState('checkout', ['buyNowNotice']),
    chooseTemp() {
      let chooseTmp = ''
      if (this.buyNowNotice.msg.includes('item')) {
        chooseTmp = this.nl('page_common_item').toLowerCase()
      } else {
        chooseTmp = this.nl('page_common_color').toLowerCase() + '/' + this.nl('page_common_size').toLowerCase()
      }
      return chooseTmp
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.buy-now-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: var(--color-f9f9f9);
  border: 1px solid #eee;
  color: var(--color-ff0000);
  text-align: center;
  height: 30px;
  margin-bottom: 60px;
  .notice-icon {
    width: 12px;
    height: 12px;
    font-size: 12px;
    margin-right: 5px;
    svg {
      vertical-align: baseline;
    }
  }
  .notice-text {
    font-size: 13px;
    font-family: @font-family-500;
    color: var(--color-ff0000);
    .choose_other {
      color: var(--color-ff0000);
      text-decoration: underline;
    }
  }
}
</style>
