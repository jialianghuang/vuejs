<template>
  <div class="returned-goods-item">
    <div class="left-box">
      <a :href="goodInfo.orderGoods.detailUrl" :title="goodInfo.orderGoods.goodsName" :aria-label="goodInfo.orderGoods.goodsName">
        <az-sticker
          v-if="goodInfo.orderGoods.stickers && Object.keys(goodInfo.orderGoods.stickers).length"
          :stickerInfo="goodInfo.orderGoods.stickers"
          :sticker-class="`product-item-icon-small`"
          :goodsId="goodInfo.orderGoods.goodsId"
        ></az-sticker>
        <img :src="addWebpSuffix(goodInfo.orderGoods.imgUrl)" :alt="goodInfo.orderGoods.goodsName" />
        <span v-if="goodInfo.orderGoods.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
      </a>
    </div>
    <div class="center-box">
      <div class="top">
        <h4 class="goods-name">
          <a :href="goodInfo.orderGoods.detailUrl" :title="goodInfo.orderGoods.shownGoodsName"
            >{{ goodInfo.orderGoods.shownGoodsName
            }}<span v-if="goodInfo.orderGoods.previousName" class="history-name">{{ goodInfo.orderGoods.previousName }}</span></a
          >
        </h4>
        <!-- 价格  -->
        <p class="price">{{ goodInfo.orderGoods.shopPriceDisplay }}</p>
      </div>

      <p v-if="goodInfo.orderGoods.formatStyles && goodInfo.orderGoods.formatStyles.color" class="color item">
        <span class="list-desc">{{ goodInfo.orderGoods.formatStyles.color.name }}: </span>
        <span class="list-content">{{ goodInfo.orderGoods.formatStyles.color.value }}</span>
      </p>
      <p v-if="goodInfo.orderGoods.formatStyles && goodInfo.orderGoods.formatStyles.size" class="size item">
        <span class="list-desc">
          {{
            goodInfo.orderGoods.formatStyles.size.CustomSize
              ? nl('page_goods_custom_size') + '(' + nl('page_common_free') + ')'
              : nl('page_cart_goods_standard_size') +
                ' ' +
                (goodInfo.orderGoods.styles && goodInfo.orderGoods.styles.select && goodInfo.orderGoods.styles.select.sizeName)
          }}:
        </span>
        <span class="list-content text-size">{{ getSizeStr(goodInfo.orderGoods.formatStyles.size) }}</span>
      </p>
      <div class="return-reason-submit">
        <p v-if="goodInfo.reasonText" class="item">
          <span class="list-desc">{{ nl('page_return_reason') }}: </span>
          <span class="list-content">{{ goodInfo.reasonText }}</span>
        </p>
        <p class="item">
          <span class="list-desc">{{ nl('page_return_quantity_to_return') }}: </span>
          <span class="list-content">{{ goodInfo.quantity }}</span>
        </p>
        <p v-if="goodInfo.reasonNote" class="item">
          <span class="list-desc">{{ nl('page_return_comments') }}:</span>
          <span class="list-content">{{ goodInfo.reasonNote }}</span>
        </p>
      </div>
    </div>
    <div class="over-box"></div>
  </div>
</template>

<script>
import AzSticker from '@/components/az-ui/Sticker/AzSticker'

export default {
  name: 'ReturnedGoodsItem',
  components: { AzSticker },
  props: {
    goodInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    getSizeStr(size) {
      if (!(size.CustomSize || size.standardSize)) return ''
      const items = (size.CustomSize || size.standardSize).items
      if (!items) return ''
      return items
        .map((item) => {
          let unit = item.unit
          let value = (+item.value).toFixed(2)
          // 单独处理shoes产品单位和数字格式
          if (this.goodInfo.orderGoods.catId == '3102') {
            if (item.name == 'Foot Length') {
              unit = item.unit == 'inch' ? ' in' : ' cm'
            } else {
              unit = ''
              value = parseInt(item.value)
            }
          }
          return item.name + ': ' + value + unit
        })
        .join(' | ')
    }
  }
}
</script>

<style lang="less" scoped>
.returned-goods-item {
  display: flex;
  padding: 15px 0;
  font-size: 13px;
  line-height: 18px;
  border-bottom: 1px solid var(--color-eeeeee);
  a {
    color: var(--color-121212);
    &:hover {
      color: @theme-color;
    }
  }
  .left-box {
    margin-right: 15px;
    img {
      width: 85px;
      height: auto;
      display: block;
    }
    a {
      display: block;
      position: relative;
    }
    .mattel {
      position: absolute;
      right: 3px;
      bottom: 3px;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
      color: #fff;
      transform-origin: right bottom;
      transform: scale(0.3);
      width: max-content;
    }
  }
}
.center-box {
  flex: 1;
  font-size: 13px;
  line-height: 18px;
  color: var(--color-121212);
  .top {
    display: flex;
    justify-content: space-between;
  }
  .price {
    font-size: 14px;
    line-height: 19px;
    font-family: @font-family-600;
  }
  .item {
    margin: 5px 0;
  }
  .list-desc {
    color: var(--color-999999);
    text-transform: capitalize;
  }
  .list-content {
    text-transform: capitalize;
    &.text-size {
      text-transform: none;
    }
  }
}
</style>
