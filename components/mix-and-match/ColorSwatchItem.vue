<template>
  <!-- colorRecommend中色卡商品item组件 -->
  <div class="color-swatch-item">
    <div class="content">
      <div class="image">
        <a
          v-if="imgUrl && item.baseInfo && item.baseInfo.shownColor"
          @click="quickShopClick(item)"
          :aria-label="'color swatch image ' + item.baseInfo.shownColor"
        >
          <img :src="imgUrl" :alt="'color swatch image ' + item.baseInfo.shownColor" />
        </a>
      </div>
      <div class="intro">
        <div class="intro-content">
          <div class="title">{{ nl('page_common_get_color_swatch') }}</div>
          <div v-if="item.baseInfo && item.baseInfo.shownColor" class="color">
            {{ nl('page_common_color') + ': ' + item.baseInfo.shownColor }}
          </div>
          <div class="price">
            <template v-if="item.baseInfo && item.baseInfo.activityCouponCode">
              <div v-if="item.baseInfo && item.baseInfo.shopPriceDisplay" class="discount">
                {{ item.baseInfo.shopPriceDisplay }}<span class="cost">{{ item.baseInfo.originalPriceInfo.noDealPriceDisplay }}</span>
              </div>
            </template>
            <template v-else>
              <div v-if="item.baseInfo && item.baseInfo.noDealPriceDisplay" class="normal">
                {{ item.baseInfo.noDealPriceDisplay }}
              </div>
            </template>
          </div>
          <div v-if="item.baseInfo && item.baseInfo.activityCouponCode" class="coupon">
            {{ nl('page_common_with_code') + ' ' + item.baseInfo.activityCouponCode }}
          </div>
        </div>
        <az-button @click="addToBagClick(item)" :text="nl('page_order_add2bag')" :loading="btnLoading" class="btn"></az-button>
      </div>
    </div>
  </div>
</template>

<script>
import AzButton from '@/components/az-ui/AzButton'

export default {
  name: 'ColorSwatchItem',
  components: { AzButton },
  props: {
    item: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      colorReal: this.item.baseInfo?.colorReal || '',
      selfLoading: false
    }
  },
  computed: {
    imgUrl() {
      if (this.item?.imageInfo?.goodsGallery[this.colorReal]?.images?.length == 0) {
        return ''
      }
      const url = this.item?.imageInfo?.browserPrefix + this.item?.imageInfo?.goodsGallery[this.colorReal]?.images[0]?.imgUrl
      return url
    },
    btnLoading() {
      return this.loading && this.selfLoading
    }
  },
  watch: {
    loading(val) {
      if (!val) {
        this.selfLoading = false
      }
    }
  },
  methods: {
    addToBagClick(item) {
      this.selfLoading = true
      this.$emit('add-to-bag', item)
    },
    quickShopClick(item) {
      this.$emit('quick-shop', item)
    }
  }
}
</script>

<style lang="less" scoped>
.color-swatch-item {
  position: relative;
  .content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .image {
      margin-right: 30px;
      width: 122px;
      cursor: pointer;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .intro {
      width: 180px;
      min-height: 170px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-flow: column nowrap;
      overflow: hidden;
    }
    .intro-content {
      width: 180px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-flow: column nowrap;
    }
    .title {
      color: var(--color-121212);
      text-align: left;
      font-family: @font-family-500;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 5px;
      word-break: break-all;
    }
    .color {
      color: #666;
      text-align: left;
      font-family: @font-family-500;
      font-size: 13px;
      letter-spacing: 0.52px;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    .price {
      margin-bottom: 5px;
      .discount {
        color: var(--color-121212);
        font-family: @font-family-500;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.64px;
      }
      .cost {
        color: #999;
        font-family: @font-family-500;
        font-size: 13px;
        letter-spacing: 0.52px;
        text-decoration-line: line-through;
        font-weight: 400;
      }
      .normal {
        color: var(--color-121212);
        font-family: @font-family-500;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.64px;
      }
    }
    .coupon {
      color: #666;
      text-align: left;
      font-family: @font-family-500;
      font-size: 13px;
    }
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180px;
      height: 40px;
      background: var(--color-121212);
      color: #fff;
      text-align: center;
      font-family: @font-family-500;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
    }
  }
}

@media screen and (max-width: 1600px) {
  .color-swatch-item {
    .image {
      margin-right: 22.5px !important;
      width: 91.5px !important;
    }
    .intro {
      width: 135px !important;
      min-height: 127.5px !important;
    }
    .intro-content {
      width: 135px !important;
    }
    .title {
      font-size: 14px !important;
    }
    .color {
      font-size: 12px !important;
    }
    .price {
      .discount {
        font-size: 14px !important;
      }
      .cost {
        font-size: 12px !important;
      }
      .normal {
        font-size: 14px !important;
      }
    }
    .coupon {
      font-size: 12px !important;
    }
    .btn {
      width: 135px !important;
      height: 30px !important;
      font-size: 12px !important;
    }
  }
}
</style>
