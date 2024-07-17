<template>
  <div class="tying-dialog-box">
    <AzDialog :visible.sync="visibleDialog" @onClose="closeDialog">
      <div class="tying-box">
        <h1 class="tying-box-header">{{ nl('page_common_tying_text4') }}</h1>
        <p class="tying-box-tips">
          <az-icon class="icon-redeem" icon-class="icon-icon-redeem" />
          <span class="tying-box-des">{{ nl('page_common_tying_text5') }}</span>
        </p>
        <div class="tying-box-list">
          <redeemed-goods-list-item
            v-for="(goodsInfo, index) in list"
            :index="index"
            :key="index"
            :baseInfo="goodsInfo"
            :type="false"
            :show-sticker="true"
            :style="{
              '--number': 5,
              '--space': 20 + 'px'
            }"
            @refreshCartList="refreshCartList"
            @quickShop="quickShopClick"
          ></redeemed-goods-list-item>
        </div>
      </div>
    </AzDialog>
  </div>
</template>

<script>
/** 搭售列表 */
import AzDialog from '@/components/az-ui/AzDialog'
import RedeemedGoodsListItem from '@/components/cart/RedeemedGoodsListItem'
export default {
  name: 'TyingList',
  components: { AzDialog, RedeemedGoodsListItem },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      visibleDialog: false
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (!process.client) return
      if (newVal) {
        this.visibleDialog = newVal
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    refreshCartList() {
      this.$emit('refreshCartList')
    },
    quickShopClick(params) {
      this.$emit('quickShop', params)
    }
  }
}
</script>

<style lang="less" scoped>
.tying-dialog-box {
  /deep/ .az-dialog-content {
    width: unset;
    padding: 40px 20px;
  }
  .tying-box {
    &-header {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-600;
      font-size: 24px;
    }
    &-tips {
      display: flex;
      align-items: center;
      column-gap: 10px;
      padding: 10px 15px;
      margin: 20px;
      background-color: var(--bg-light-color);
      color: var(--theme-color);
      font-family: @font-family-500;
      font-size: 14px;
      text-align: center;
      .icon-redeem {
        font-size: 20px;
        vertical-align: middle;
      }
    }
    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      width: 905px;
      padding: 0 20px;
      // max-height: 577px;
      max-height: 460px;
      overflow: auto;
      /deep/ .redeemed-goods-swiper-content {
        flex-direction: column;
        width: calc((100% - var(--space) * (var(--number) - 1)) / var(--number));
        margin-right: 0 !important;
        padding: 0 !important;
        margin-right: auto;
        background: unset;
        .left_block {
          width: unset;
          height: unset;
          margin-right: unset;
          vertical-align: middle;
        }
        .right_block {
          width: 100%;
          .info_block {
            margin: 5px 0;
            .goods_name {
              overflow: hidden;
              color: var(--color-121212);
              font-size: 13px;
              font-family: @font-family-500;
              text-overflow: ellipsis;
              text-transform: capitalize;
            }
            .color,
            .size {
              display: none;
            }
          }
          .price_block {
            .icon-bag.icon-quick {
              font-size: 15px;
            }
          }
        }
        .goods_url {
          display: block;
        }
      }
    }
  }
}
</style>
