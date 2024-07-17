<template>
  <div :class="{ active: itemSelected && !showReturnDetails, isLastItem: isLastItem }" class="return-goods-items">
    <div v-if="!showReturnDetails" class="module module-checkbox">
      <span :class="{ selected: itemSelected, disabled: !goodsItem.returnable }" class="checkbox-box can-click">
        <az-icon :icon-class="'icon-lby_tick_white_s'" @click="handleSelectedItem()" class="goods-checkbox"></az-icon>
      </span>
    </div>
    <div class="module module-img">
      <a :href="goodsItem.goodsUrl" :title="goodsItem.shownGoodsName" :aria-label="goodsItem.shownGoodsName">
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
        <div class="name">
          <a :href="goodsItem.goodsUrl" :title="goodsItem.shownGoodsName">
            {{ goodsItem.shownGoodsName }}
            <span v-if="goodsItem.dressType == 'clearance'">({{ nl('page_category_clearance') }})</span>
          </a>
          <span v-if="goodsItem.suffix" class="gift_goods">({{ goodsItem.suffix }})</span>
        </div>
      </div>
      <div :class="{ 'no-position': itemSelected }" class="goods-dec">
        <!-- 商品颜色 -->
        <p v-if="goodsItem.formatStyles && goodsItem.formatStyles.color" class="color">
          <span class="desc">{{ goodsItem.formatStyles.color.name }}: </span>
          <span class="content">{{ goodsItem.formatStyles.color.value }}</span>
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
        <!-- rush -->
        <p v-if="goodsItem.styles && (goodsItem.styles.rushType || goodsItem.styles.rush_type)" class="rush">
          <span class="desc">{{ nl('page_checkout_production_time') }}: </span>
          <span class="content">{{ goodsItem.styles.rushType || goodsItem.styles.rush_type }}</span>
        </p>
        <!-- 如果退回到gift card ，展示文案 -->
        <p v-if="showReturnDetails && returnChannel === 'gift_card'" class="return-channel">
          <span class="desc">{{ nl('page_order_return_refund_to') }}: </span>
          <span class="content">{{ nl('page_order_return_refund_to_gift_card') }}</span>
        </p>
      </div>
      <!-- 退货原因表单 -->
      <template v-if="!showReturnDetails">
        <return-reason-form :goodsItem="goodsItem" :reasons="reasons" v-show="itemSelected"></return-reason-form>
      </template>
      <!-- 退货原因展示详情 -->
      <template v-else>
        <div class="return_reason_submit">
          <p v-if="goodsItem.returnReasonObj.needReturnReason" class="reason">
            <span class="desc">{{ nl('page_return_reason') }}: </span>
            <span class="content">{{ goodsItem.returnReasonObj.descArr }}</span>
          </p>
          <p class="qut">
            <span class="desc">{{ nl('page_return_quantity_to_return') }}: </span>
            <span class="content">{{ goodsItem.returnReasonObj.quantity }}</span>
          </p>
          <div v-if="goodsItem.returnReasonObj.note" class="note">
            <span class="desc">{{ nl('page_return_comments') }}: </span>
            <textarea
              v-model="goodsItem.returnReasonObj.note"
              maxlength="200"
              readonly
              style="background-color:#eee;resize:none"
            ></textarea>
          </div>
        </div>
      </template>
    </div>
    <div v-if="!showReturnDetails" class="module module-price">
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
import ReturnReasonForm from '@/components/order/ReturnReasonForm'
import AzSticker from '@/components/az-ui/Sticker/AzSticker'
import { mapState } from 'vuex'
export default {
  name: 'ReturnGoodsItems',
  components: { ReturnReasonForm, AzSticker },
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    },
    reasons: {
      type: Object,
      default() {
        return {}
      }
    },
    isLastItem: {
      type: Boolean,
      default: false
    },
    showReturnDetails: {
      type: Boolean,
      default: false
    },
    returnChannel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('order', ['returnReasonData']),
    itemSelected: {
      get() {
        return this.returnReasonData[this.goodsItem.recId] && this.returnReasonData[this.goodsItem.recId].selected
      },
      set() {
        const tempData = JSON.parse(JSON.stringify(this.returnReasonData))
        if (!tempData[this.goodsItem.recId] || !Object.keys(tempData[this.goodsItem.recId]).length) {
          tempData[this.goodsItem.recId] = {
            rec_id: this.goodsItem.recId,
            needReturnReason: this.goodsItem.dressType != 'sample' // #12280 如果是样衣，就不选原因
          }
        }
        tempData[this.goodsItem.recId].selected = !tempData[this.goodsItem.recId].selected
        this.$store.commit('order/setReturnReasonData', tempData)
      }
    }
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
              unit = item.unit == 'inch' ? ' in' : ' cm'
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
      if (this.goodsItem.returnable) this.itemSelected = !this.itemSelected
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.return-goods-items {
  position: relative;
  padding: 20px 0;
  border-bottom: solid 1px var(--color-cccccc);
  display: flex;
  &.active {
    background-color: var(--color-f9f9f9);
  }
  &.isLastItem {
    border-bottom: solid 1px #ccc;
  }
  .module-checkbox {
    padding-left: 12px;
    padding-right: 12px;
    position: relative;
    width: 15px;
    align-self: flex-start;
    top: 50px;
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
        background: #666;
      }
    }
  }
  .module-img {
    padding-right: 15px;
    width: 74px;
    position: relative;
    min-height: 102px;
    display: flex;
    align-items: flex-start;
    a {
      height: 102px;
      display: block;
      position: relative;
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
      margin-bottom: 25px;
      a {
        color: var(--color-121212);
      }
      .name {
        font-family: @font-family-500;
        font-size: 13px;
      }

      .gift_goods {
        color: var(--color-121212);
        text-transform: capitalize;
      }
    }
    .goods-dec {
      &.no-position {
        position: relative;
      }
      .desc {
        text-transform: capitalize;
        // color: var(--color-999999);
        margin-right: 3px;
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
