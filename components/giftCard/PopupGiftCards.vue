<template>
  <az-popup-layer :zIndex="12" @close="handleClose()" :width="'760px'" :title="nl('page_popup_gift_card_title')" height="600px">
    <div class="popup-gift-cards">
      <div class="gift-cards-top">
        <p>{{ giftCardInfo.cardImage.length }} {{ nl('page_cat_items') }}</p>
        <view-switch from="gift-card-detail"></view-switch>
      </div>
      <div class="gift-cards-list">
        <div
          v-for="(cardItem, index) in giftCardInfo.cardImage"
          :key="`${index}_${cardItem.imgId}`"
          @click="selectGiftCard(cardItem)"
          :class="[{ selected: currentImgId == cardItem.imgId }, viewSwitch]"
          @dblclick="selectGiftCard(cardItem, true)"
          class="gift-cards-item"
        >
          <img v-lazy="addWebpSuffix(cardItem.imgUrl)" :alt="'gift card' + index" class="card-img" />
        </div>
      </div>
      <div class="theme-btn-wrap">
        <az-button @click="handleConfirm" class="btn btn-default btn-choose">
          {{ nl('page_popup_gift_card_use_design') }}
        </az-button>
      </div>
    </div>
  </az-popup-layer>
</template>

<script>
/**
 * gift card详情 see more弹框
 */
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/Button/AzButton'
import viewSwitch from '@/components/list/viewSwitch'
import { mapState } from 'vuex'

export default {
  name: 'PopupGiftCards',
  components: {
    AzPopupLayer,
    AzButton,
    viewSwitch
  },
  props: {
    giftCardInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    imgId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentImgId: 0
    }
  },
  computed: {
    ...mapState({
      viewSwitch: (state) => state.list.viewSwitch,
      popupGiftCardsShow: (state) => state.giftCard.popupGiftCardsShow
    })
  },
  created() {
    if (this.imgId) this.currentImgId = this.imgId
  },
  mounted() {
    this.$store.commit('list/setViewSwitch', 'smaller')
  },
  methods: {
    handleClose() {
      this.$store.commit('giftCard/setPopupGiftCardsShow', false)
    },
    // isDbclick: true 双击的情况下，直接选中
    selectGiftCard(card, isDbclick = false) {
      this.currentImgId = card.imgId
      if (isDbclick) {
        this.handleConfirm()
      }
    },
    handleConfirm() {
      const cards = this.giftCardInfo.cardImage.filter((item) => item.imgId == this.currentImgId)
      this.$emit('selectGiftCard', cards[0])
      this.handleClose()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .az-popup-box {
  min-width: unset;
  padding: 0 !important;
  overflow-y: hidden;
  .layer-title {
    height: 45px;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eee;
    border: none;
  }
}
.popup-gift-cards {
  .gift-cards-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin: 20px 0;
    padding: 20px 40px;
  }
  .gift-cards-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 40px;
    overflow-y: scroll;
    height: 411px;
    // background: red;
    .gift-cards-item {
      cursor: pointer;
      width: calc((100% - 20px) / 2);
      padding: 2px;
      box-sizing: border-box;
      border: 1px solid var(--color-cccccc);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 20px;
      &.larger {
        width: 100%;
      }
      .card-img {
        width: 100%;
        height: auto;
      }
      &.selected {
        border: 2px solid var(--color-121212);
      }
      &:hover {
        border: 2px solid var(--color-121212);
      }
    }
  }
  .btn-choose {
    width: 315px;
    height: 45px;
  }
}
</style>
