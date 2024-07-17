<template>
  <div v-if="giftCardFromData && Object.keys(giftCardFromData).length" class="gift-card-thumb-box">
    <div class="gift-card-picture">
      <img
        :src="giftCardFromData.selectedGiftCard ? addWebpSuffix(giftCardFromData.selectedGiftCard.thumbImgUrl) : ''"
        @click="handleShowGCDialog"
        :alt="baseInfo.shownGoodsName"
        class="card-img"
      />
      <div v-show="giftCardFromData.card_msg" class="card-msg">{{ giftCardFromData.card_msg }}</div>
      <div class="card-info">
        <div class="card-price">{{ giftCardFromData.selectedCardPrice ? giftCardFromData.selectedCardPrice.cardPriceDisplay : '' }}</div>
        <div class="card-name">{{ baseInfo.shownGoodsName }}</div>
      </div>
    </div>
    <div class="gift-card-tip">{{ nl('page_gift_card_detail_click_to_preview') }}</div>
    <div id="share" class="gift-card-share">
      <div id="share-title" class="share-title">
        <h3>
          <span>{{ nl('page_goods_details_share_with') }}</span>
        </h3>
      </div>
      <az-share :shareList="shareListInfo" :fontSize="'35px'" :space="'0 26px 0 0'"></az-share>
    </div>

    <gift-card-thumb-dialog v-if="showGiftCardDialog"></gift-card-thumb-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import azShare from '@/components/az-ui/Share/AzShare'
import GiftCardThumbDialog from '@/components/giftCard/GiftCardThumbDialog'
export default {
  name: 'GiftCardProductThumb',
  languageKeys: ['page_goods_details_share_with'],
  components: {
    azShare,
    GiftCardThumbDialog
  },
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
    ...mapState('giftCard', ['giftCardInfo', 'showGiftCardDialog', 'giftCardFromData']),
    ...mapState('product', ['baseInfo']),
    shareListInfo() {
      const shareList = this.shareList.concat([])
      let symbol = '?'
      if (this.page_url.includes(symbol)) {
        symbol = '&'
      }
      const shareUrl = this.HTTPS_HOST + this.countryUrl(this.baseInfo.goodsDefaultUrl)
      const utmSource = '&utm_medium=post&utm_campaign=share'
      shareList.forEach((item) => {
        item.dialog_height = 320
        item.dialog_width = 700
        // gift card 分享的时候分享选中的图片
        const shareImg =
          (this.giftCardFromData && this.giftCardFromData.selectedGiftCard && this.giftCardFromData.selectedGiftCard.thumbImgUrl) ||
          item.shareImg
        let url = ''
        if (item.key == 'facebook') {
          url = 'http://www.facebook.com/sharer/sharer.php?u=' + shareUrl + symbol + 'utm_source=facebook' + utmSource
        }
        if (item.key == 'pinterest') {
          url =
            'http://pinterest.com/pin/create/button/?description=' +
            item.pinterestDesc +
            '&media=' +
            shareImg +
            '&is_video=false' +
            '&url=' +
            shareUrl +
            symbol +
            'utm_source=pinterest' +
            utmSource
        }
        if (item.key == 'twitter') {
          url =
            'http://twitter.com/share?text=I%27m in love with ' +
            item.title +
            '.&via=iheartazazie' +
            '&url=' +
            shareUrl +
            symbol +
            'utm_source=twitter' +
            utmSource
        }
        if (item.key == 'email') {
          url =
            'mailto:?subject=Look what I found at ' +
            this.HTTPS_HOST +
            '&body=' +
            this.baseInfo.shownGoodsName +
            '-' +
            this.baseInfo.catName +
            shareUrl +
            symbol +
            'utm_source=email' +
            utmSource
        }
        if (item.key == 'google') {
          item.dialog_height = 600
          item.dialog_width = 600
          url = 'https://plus.google.com/share?hl=en' + '&url=' + shareUrl + symbol + 'utm_source=googleplus' + utmSource
        }
        item.url = url
      })
      return shareList
    }
  },
  watch: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    handleShowGCDialog() {
      this.$store.commit('giftCard/setShowGiftCardDialog', true)
    }
  }
}
</script>

<style lang="less" scoped>
.gift-card-thumb-box {
  .gift-card-picture {
    background: #ffffff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
    color: var(--color-121212);
    .card-img {
      width: 100%;
      height: auto;
      cursor: pointer;
      vertical-align: middle;
    }
    .card-msg {
      padding: 30px;
      font-size: 18px;
      line-height: 28px;
      word-break: break-word;
    }
    .card-info {
      border-top: 1px solid var(--color-eeeeee);
      padding: 20px 30px 30px;
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
  }
  .gift-card-tip {
    font-size: 18px;
    line-height: 25px;
    color: var(--color-121212);
    text-align: center;
    padding: 20px 0 18px;
  }
  .gift-card-share {
    .share-title {
      border-top: 1px solid #ccc;
      margin-top: 32px !important;
      margin-bottom: 16px;
      text-align: center;
      h3 {
        margin: -16px 0 -1px;
        font-size: 20px;
        color: #666;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: 400;
        span {
          font-size: 14px;
          font-family: @font-family-600;
          color: var(--color-121212);
          background: #fff;
          padding: 0 25px;
        }
      }
    }
  }
}
</style>
