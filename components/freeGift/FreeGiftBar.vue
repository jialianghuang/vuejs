<template>
  <div class="free-gift-bar-box">
    <div class="title-box">
      <div class="left">
        <az-icon icon-class="icon-gift1" class="icon"></az-icon>
        <div class="txt">{{ nl('page_fg_select_your_free_gift') }}</div>
      </div>
      <div @click="handleSelectGift()" class="right">
        <span class="txt">{{ nl('page_fg_select_gift') }}</span>
        <span>({{ giftActivityInfo.selectedNumber || 0 }}/{{ giftActivityInfo.giftNumber || 0 }})</span>
      </div>
    </div>
    <div class="content">
      <div class="gift-list-box">
        <template v-for="(item, index) in giftActivityGoodsList">
          <div v-if="index < 9" :key="`${index}_${item.goodsId}`" @click="handleSelectGift()" class="item">
            <img
              :src="require('~/assets/images/default_img.jpg')"
              :data-src="addWebpSuffix(item.imgUrl)"
              :alt="item.shownGoodsName"
              data-expand="1"
              class="lazyload goods-img"
            />
            <div class="goods-price">
              <p class="current-price">{{ item.shopPriceDisplay }}</p>
              <p class="no-deal-price">{{ item.noDealPriceDisplay }}</p>
            </div>
          </div>
        </template>
        <div @click="handleSelectGift('all')" v-if="giftActivityGoodsList.length > 10" class="item">
          <div class="shop-all-box">
            <div class="shopall">
              {{ nl('page_fg_view_all') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'FreeGiftBar',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('cart', ['giftActivityInfo', 'hasGiftActivity']),
    giftActivityGoodsList() {
      return (this.giftActivityInfo && this.giftActivityInfo.giftActivityGoodsList) || []
    }
  },
  mounted() {
    this.setPoint('addtobag', 'free gift module', 'view')
    if (this.giftActivityGoodsList.length > 10) {
      this.setPoint('addtobag', 'view all', 'view')
    }
  },
  methods: {
    handleSelectGift(from) {
      if (from === 'all') {
        this.setPoint('addtobag', 'view all', 'click')
      } else {
        this.setPoint('addtobag', 'free gift module', 'click')
      }
      this.$emit('getCartGiftActivity')
    },
    trackMsg(id, item) {
      return {
        index: id + 1,
        goodsId: item.goodsId,
        color: item.colorReal,
        cat_id: item.catId
      }
    }
  }
}
</script>
<style lang="less" scoped>
.free-gift-bar-box {
  margin: 36px 0 31px;
  .title-box {
    height: 30px;
    background: var(--color-f1e9e6);
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-121212);
    font-size: 13px;
    .left {
      height: 100%;
      display: flex;
      .icon {
        width: 55px;
        height: 100%;
        margin-right: 10px;
      }
    }
    .right {
      padding-right: 10px;
      cursor: pointer;
      .txt {
        text-decoration: underline;
      }
    }
  }
  .content {
    .gift-list-box {
      display: flex;
      // justify-content: space-between;
      justify-content: flex-start;
      padding: 20px 16.5px;
      flex-wrap: wrap;
      .item {
        // width: 7.62%;
        width: 68px;
        min-width: 68px;
        cursor: pointer;
        margin-right: 20px;
        &:last-child {
          margin-right: 0;
        }
        .goods-img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .goods-price {
          text-align: center;
          margin-top: 5px;
          .current-price {
            color: var(--color-121212);
            font-family: @font-family-600;
            font-size: 14px;
            line-height: 19px;
          }
          .no-deal-price {
            color: var(--color-999999);
            text-decoration: line-through;
            font-size: 12px;
            line-height: 16px;
            margin-top: 4px;
          }
        }
        .shop-all-box {
          width: 100%;
          // height: 124px;
          height: 138px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--color-f9f9f9);
          .shopall {
            font: bold 12px @font-family-500, sans-serif;
            line-height: 16px;
            color: var(--color-999999);
            text-decoration: underline;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
