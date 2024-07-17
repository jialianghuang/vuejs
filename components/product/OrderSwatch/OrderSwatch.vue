<template>
  <az-overlay v-show="allReady" :z-index="12" class="order-swatch">
    <swatch-dialog
      v-for="(id, index) in swatchIds"
      :key="id"
      v-show="id == swatchId"
      @change="changeSwatch"
      @ready="ready"
      :swatch-id="id"
      :color="color.key"
      :length="swatchIds.length"
      :index="index"
      :swatchOriginGoodsInfo="baseInfo"
    ></swatch-dialog>
  </az-overlay>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import SwatchDialog from '@/components/product/OrderSwatch/SwatchDialog'
import { mapState } from 'vuex'
export default {
  name: 'OrderSwatch',
  languageKeys: [...SwatchDialog.languageKeys],
  components: {
    SwatchDialog,
    AzOverlay
  },
  props: {
    swatchIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      swatchId: 0,
      allReady: false
    }
  },
  computed: {
    ...mapState({
      color: (state) => state.product.selectedColor,
      baseInfo: (state) => state.product.baseInfo
    })
  },
  created() {
    this.swatchId = this.swatchIds[0]
    // this.$store.commit('product/setShowOrderSwatch', true)
  },
  methods: {
    changeSwatch(index) {
      if (index < 0 || index > this.swatchIds.length - 1) {
        return false
      }
      this.swatchId = this.swatchIds[index]
    },
    ready(data) {
      if (data.id == this.swatchId && data.ready == 1) {
        this.allReady = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 1028px;
  padding: 50px 20px 30px;
  box-sizing: border-box;
  display: flex;
  background: #fff;
  .small-pic {
    img {
      width: 64px;
      border: 2px solid #cdcdcd;
    }
  }
  .big-pic {
    margin-left: 6px;
    position: relative;
    img {
      width: 418px;
    }
    .fav-icon {
      position: absolute;
      width: 34px;
      height: 39px;
      right: 8px;
      top: 9px;
      z-index: 2;
    }
  }
  .product-info {
    width: 476px;
    margin-left: auto;
    .goods-name {
      letter-spacing: 1px;
      font-size: 24px;
      font-weight: normal;
      text-transform: uppercase;
      line-height: 25px;
      margin-top: 5px;
    }
    .price {
      margin-top: 8px;
      margin-bottom: 14px;
      font-size: 24px;
    }
    .style-block {
      padding: 30px 0 30px 23px;
      background: var(--color-f9f9f9);
      margin-bottom: 20px;
      color: var(--color-121212);
      max-height: 300px;
      overflow-y: auto;
      .color-name {
        text-transform: capitalize;
        font-weight: bold;
      }
      .shop-more {
        color: #666;
        text-decoration: underline;
        cursor: pointer;
      }
      .notify-label {
        margin: 18px 0;
      }
      .color-list {
        width: 100%;
        margin-bottom: 8px;
      }
      .mesh-label {
        margin-top: 22px;
      }
    }
    .add-to-bag {
      width: 240px;
      height: 50px;
      line-height: 50px;
      text-transform: uppercase;
      font-size: 14px;
      margin-top: 15px;
      font-weight: 400;
    }
    .view-detail {
      font-size: 13px;
      font-family: @font-family-600, sans-serif;
      color: var(--color-121212);
      cursor: pointer;
      text-decoration: underline;
      margin-top: 10px;
      display: block;
    }
    .continue-shopping {
      margin-right: 10px;
      border: 1px solid var(--color-121212);
    }
    .success-btn {
      display: inline-block;
      width: 176px;
      height: 50px;
      line-height: 50px;
      text-transform: uppercase;
      font-size: 14px;
      margin-top: 15px;
      font-weight: 400;
    }
  }
}
</style>
