<template>
  <div
    :data-goods-id="goodsItem.goodsId"
    :data-recId="goodsItem.recId"
    :class="{ active: goodsItem.selected && isEdite, isLastItem: isLastItem }"
    class="alteration-reimbursement-item"
  >
    <div v-if="isEdite" class="module module-checkbox">
      <span :class="{ selected: goodsItem.selected, disabled: !goodsItem.reimbursable }" class="checkbox-box can-click">
        <az-icon :icon-class="'icon-lby_tick_white_s'" @click="handleSelectedItem()" class="goods-checkbox"></az-icon>
      </span>
    </div>
    <div class="module module-img">
      <a :href="goodsItem.detailUrl" :title="goodsItem.shownGoodsName" :aria-label="goodsItem.shownGoodsName">
        <az-sticker
          v-if="goodsItem.stickers && Object.keys(goodsItem.stickers).length"
          :stickerInfo="goodsItem.stickers"
          :sticker-class="`product-item-icon-small`"
          :goodsId="goodsItem.goodsId"
        ></az-sticker>
        <img :src="addWebpSuffix(goodsItem.imgUrl)" :alt="goodsItem.shownGoodsName" />
        <span v-if="goodsItem.brandId === 20" class="mattel">&copy;2024 MATTEL.</span>
      </a>
    </div>
    <div class="module module-goods-info">
      <div class="goods-title">
        <h4 class="name">
          <a :href="goodsItem.detailUrl" :title="goodsItem.shownGoodsName">
            <template v-if="[1063984, 1063985].includes(goodsItem.goodsId)">
              Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE
              {{ goodsItem.goodsId === 1063984 ? nl('page_common_garment_bag') : nl('page_common_garment_bag_wd') }}
            </template>
            <template v-else>
              {{ goodsItem.shownGoodsName }}
            </template>
          </a>
        </h4>
      </div>
      <div class="goods-dec">
        <!-- 商品颜色 -->
        <p v-if="goodsItem.formatStyles && goodsItem.formatStyles.color" class="color">
          <span class="desc">{{ goodsItem.formatStyles.color.name }}: </span>
          <span class="content">{{ goodsItem.formatStyles.color.value }}</span>
        </p>
        <!-- rush -->
        <p v-if="goodsItem.styles && (goodsItem.styles.rushType || goodsItem.styles.rush_type)" class="rush">
          <span class="desc">{{ nl('page_checkout_production_time') }}: </span>
          <span class="content">{{ goodsItem.styles.rushType || goodsItem.styles.rush_type }}</span>
        </p>
        <!-- size -->
        <p v-if="goodsItem.formatStyles && goodsItem.formatStyles.size" class="size">
          <span class="desc">
            {{
              goodsItem.formatStyles.size.CustomSize
                ? nl('page_goods_custom_size') + '(' + nl('page_common_free') + ')'
                : nl('page_cart_goods_standard_size') +
                  ' ' +
                  (goodsItem.styles && goodsItem.styles.select && goodsItem.styles.select.sizeName)
            }}:
          </span>
          <span class="content">{{ getSizeStr(goodsItem.formatStyles.size) }}</span>
        </p>
        <div v-if="goodsItem.reimbursable" class="goods-number-block">
          <goods-number
            v-if="isEdite"
            :max="goodsItem.maxSelectQuantity"
            :goods-number="goodsItem.goodsRefundNumber"
            @change-qty="changeQty"
          ></goods-number>
          <div v-else class="goods-number">
            <label for="goods-number">{{ nl('page_common_quantity') }}:</label>{{ goodsItem.goodsRefundNumber }}
          </div>
        </div>
      </div>
    </div>
    <div class="module module-price">
      <span>{{ goodsItem.shopPriceDisplay }}</span>
      <span>x</span>
      <span class="goods_number">{{ goodsItem.goodsNumber }}</span>
      <strong :style="{ color: goodsItem.isGift ? 'var(--color-121212)' : '' }">
        {{ goodsItem.totalAmountDisplay }}
      </strong>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GoodsNumber from '@/components/product/style/GoodsNumber'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'

export default {
  name: 'AlterationReimbursementItem',
  components: { GoodsNumber, AzSticker },
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    },
    isLastItem: {
      type: Boolean,
      default: false
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    isEdite: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('order', ['refundList'])
  },
  created() {},
  mounted() {
    console.log(this.goodsItem)
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
          if (this.goodsItem.catId == '3102') {
            if (item.name == 'Foot Length') {
              unit = item.unit == 'inch' ? 'in' : 'cm'
            } else {
              unit = ''
              value = parseInt(item.value)
            }
          }
          return item.name + ': ' + value + unit
        })
        .join(' | ')
    },
    handleSelectedItem() {
      if (!this.goodsItem.reimbursable) return false
      const tempRefundList = JSON.parse(JSON.stringify(this.refundList))
      tempRefundList[this.currentIndex].selected = !this.goodsItem.selected
      this.$store.commit('order/setRefundList', tempRefundList)
    },
    // 选择数量
    changeQty(num) {
      const tempRefundList = JSON.parse(JSON.stringify(this.refundList))
      tempRefundList[this.currentIndex].goodsRefundNumber = parseInt(num)
      this.$store.commit('order/setRefundList', tempRefundList)
    }
  }
}
</script>

<style lang="less" scoped>
.alteration-reimbursement-item {
  position: relative;
  padding: 15px 0;
  border-bottom: solid 1px var(--color-cccccc);
  display: flex;
  &.active {
    background-color: #f3f3f3;
  }
  &.isLastItem {
    border-bottom: solid 1px var(--color-121212);
  }
  .module-checkbox {
    padding-left: 12px;
    padding-right: 12px;
    position: relative;
    width: 15px;
    .checkbox-box {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: inline-block;
      box-sizing: border-box;
      width: 15px;
      height: 15px;
      border: 1px solid #666;
      .goods-checkbox {
        margin: 2px;
        display: block;
        fill: currentColor;
        color: #fff;
        font-size: 10px;
        width: 10px;
        height: 9px;
        cursor: pointer;
      }
      &.disabled {
        opacity: 0.3;
        .goods-checkbox {
          cursor: default;
        }
      }
      &.selected {
        background: var(--color-999999);
      }
    }
  }
  .module-img {
    padding-right: 15px;
    width: 74px;
    position: relative;
    min-height: 108px;
    a {
      position: absolute;
      top: 50%;
      height: 102px;
      transform: translateY(-50%);
      display: block;
    }
    img {
      width: 74px;
      height: 100%;
      display: block;
    }
    .mattel {
      position: absolute;
      right: 2px;
      bottom: 2px;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
      color: #fff;
      transform-origin: right bottom;
      transform: scale(0.25);
      width: max-content;
    }
  }
  .module-goods-info {
    position: relative;
    flex: 1;
    .goods-title {
      a {
        color: var(--color-121212);
      }
      .barbie-heart {
        fill: #de1c85;
        transform: scale(0.5);
      }
    }
    .goods-dec {
      min-height: 80px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .desc {
        text-transform: capitalize;
        color: var(--color-999999);
        margin-right: 3px;
      }
      .goods-number-block {
        margin-top: 5px;
        /deep/ .goods-number {
          margin: auto;
          label {
            text-transform: capitalize;
            color: var(--color-999999);
          }
          #goods-number {
            cursor: pointer;
          }
        }
      }
    }

    .return_reason_submit {
      margin-top: 6px;
      .desc {
        text-transform: capitalize;
        color: var(--color-999999);
        margin-right: 3px;
      }
      .note {
        padding-right: 130px;
        .desc {
          display: inline-block;
          margin: 10px 0px 5px;
          color: var(--color-121212);
        }
        textarea {
          width: 98%;
          background-color: #eee;
          resize: none;
          padding: 5px;
        }
      }
    }
  }
  .module-price {
    margin-right: 10px;
    span {
      margin-left: 24px;
    }
    strong {
      margin-left: 24px;
    }
  }
}
</style>
