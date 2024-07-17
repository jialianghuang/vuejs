<template>
  <az-overlay
    @click="closeDialog"
    :class="[showGiftCardDialog ? 'animation-fade-enter-active' : 'animation-fade-leave-active']"
    :z-index="12"
  >
    <div class="gift-cart-dialog">
      <div class="dialog-header">
        {{ nl('page_common_preview') }}
      </div>
      <div class="dialog-content">
        <div class="desc-box">
          <div class="desc-tip">{{ nl('page_gift_card_dialog_desc_tips') }}</div>
          <div v-html="giftCardFromData.to_email ? giftCardFromData.to_email.replace(/\n/g, ',') : ''" class="desc-content"></div>
        </div>
        <div class="gift-cart-dialog-content">
          <div class="title-box">
            <div class="logo-box"></div>
          </div>
          <div class="content-box">
            <img
              :src="giftCardFromData.selectedGiftCard ? addWebpSuffix(giftCardFromData.selectedGiftCard.thumbImgUrl) : ''"
              :alt="baseInfo.shownGoodsName"
              class="card-img"
            />
            <div v-show="giftCardFromData.card_msg" class="card-msg">{{ giftCardFromData.card_msg }}</div>
            <div class="card-info">
              <div class="card-price">
                {{ giftCardFromData.selectedCardPrice ? giftCardFromData.selectedCardPrice.cardPriceDisplay : '' }}
              </div>
              <div class="card-name">{{ baseInfo.shownGoodsName }}</div>
            </div>
            <div class="card-btn">
              <div class="btn">{{ nl('page_gift_card_dialog_btn') }}</div>
              <div class="code-box">{{ nl('page_gift_card_dialog_code') }}</div>
            </div>
          </div>
        </div>
      </div>
      <az-icon @click="closeDialog" class="close-btn" icon-class="icon-icon_style_gallery_off" />
    </div>
  </az-overlay>
</template>

<script>
import { mapState } from 'vuex'
// import azPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import azOverlay from '@/components/az-ui/Overlay/AzOverlay'
export default {
  name: 'GiftCardThumbDialog',
  components: { azOverlay },
  props: {
    shareList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('giftCard', ['baseInfo', 'giftCardInfo', 'showGiftCardDialog', 'giftCardFromData']),
    ...mapState('product', ['baseInfo'])
  },
  watch: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    closeDialog() {
      this.$store.commit('giftCard/setShowGiftCardDialog', false)
    }
  }
}
</script>

<style lang="less" scoped>
.gift-cart-dialog {
  position: relative;
  background: var(--color-eeeeee);
  height: 90vh;
  width: 760px;
  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .dialog-header {
    font-size: 16px;
    text-transform: uppercase;
    color: var(--color-121212);
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-family: @font-family-600;
  }
  .dialog-content {
    height: calc(~'90vh - 45px');
    display: flex;
    flex-flow: column;
    .desc-box {
      background: #ffffff;
      width: 100%;
      padding: 15px 40px;
      box-sizing: border-box;
      .desc-tip {
        font-size: 13px;
        line-height: 18px;
        color: var(--color-121212);
        font-family: @font-family-600;
      }
      .desc-content {
        margin-top: 5px;
        font-size: 13px;
        line-height: 18px;
        color: var(--color-121212);
        min-height: 18px;
        word-break: break-word;
      }
    }
  }
  .gift-cart-dialog-content {
    padding: 40px;
    overflow-y: auto;
    flex: 1;
    .title-box {
      display: flex;
      justify-content: center;
      padding: 40px 0;
      box-sizing: border-box;
      background: #fff;
      .logo-box {
        display: inline-block;
        width: 200px;
        height: 26px;
        background: url(~assets/images/common/azazie_logo.svg) no-repeat;
        background-size: contain;
      }
    }
    .content-box {
      background: #ffffff;
      color: var(--color-121212);
      // height: calc(~'90vh - 106px');
      overflow-y: auto;
      .card-img {
        width: 100%;
        height: auto;
        vertical-align: middle;
      }
      .card-msg {
        padding: 30px;
        font-size: 24px;
        line-height: 33px;
        word-break: break-word;
      }
      .card-info {
        border-top: 1px solid var(--color-eeeeee);
        padding: 20px 30px 30px;
        border-bottom: 1px solid var(--color-eeeeee);
        .card-price {
          font-size: 36px;
          line-height: 49px;
          font-family: @font-family-600;
          word-break: break-all;
        }
        .card-name {
          font-size: 18px;
          line-height: 25px;
          margin-top: 10px;
        }
      }
      .card-btn {
        padding: 50px 0;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        .btn {
          font-size: 18px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          text-transform: uppercase;
          color: #ffffff;
          font-family: @font-family-600;
          padding: 0 54px;
          background: var(--color-121212);
          display: inline-block;
        }
        .code-box {
          width: 560px;
          height: 60px;
          border: 1px solid var(--color-121212);
          box-sizing: border-box;
          font-size: 18px;
          color: var(--color-121212);
          font-family: @font-family-600;
          line-height: 58px;
          margin-top: 40px;
          text-align: center;
        }
      }
    }
  }
}
</style>
