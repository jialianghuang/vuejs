<template>
  <div
    v-track.view.click="{ common: [getBiParams('shopthelook', item.catName), getBiParams('shopthelook', 'module')] }"
    @click="clickChange"
    :class="{ 'has-goods': item.goodsInfo }"
    class="stl-goods-item"
  >
    <template v-if="item.goodsInfo && item.goodsInfo.baseInfo">
      <div class="goods-img">
        <img :src="addWebpSuffix(goodsImg)" :alt="item.goodsInfo.baseInfo.shownGoodsName" />
      </div>
      <div class="goods-info">
        <div class="goods-name">
          <div class="goods-name-content">
            <span>{{ item.goodsInfo.baseInfo.shownGoodsName }}</span>
            <a
              v-track.view.click="{ common: getBiParams('shopthelook', item.catName + '_change') }"
              @click.stop="clickChange"
              href="javascript:;"
              role="button"
              >{{ nl('page_common_change') }}</a
            >
          </div>
          <button
            v-track.view.click="{ common: [getBiParams('shopthelook', 'delete'), getBiParams('shopthelook', item.catName + '_delete')] }"
            @click.stop="clickDelete"
            class="icon-delete"
          >
            <az-icon icon-class="icon-icon_delete"></az-icon>
          </button>
        </div>
        <div class="color-size-box">
          <div
            v-track.view.click="{
              common: [getBiParams('shopthelook', item.catName + '_edit'), getBiParams('shopthelook', 'size_color_edit')]
            }"
            @click.stop="clickColoeSize"
            :class="{ error: item.error }"
            class="color-size"
          >
            <div v-if="hasColor" :style="getColorStyle(item.selectedColor.key)" class="color"></div>
            <span v-if="hasColor && hasSize">/&nbsp;</span>
            <span v-if="hasSize" class="size">{{
              item.selectedSize.shownName ? item.selectedSize.shownName : nl('page_goods_select_size')
            }}</span>
            <az-icon icon-class="icon-lby_expand_arrow_down"></az-icon>
          </div>
          <p v-if="item.error" class="error-msg">{{ item.error }}</p>
        </div>
        <div class="price-box">
          <span :class="{ red: item.goodsInfo.baseInfo.hasLinePrice }" class="goods-price">{{
            item.goodsInfo.baseInfo.shopPriceDisplay
          }}</span>
          <span v-if="item.goodsInfo.baseInfo.hasLinePrice" class="no-deal-price">{{ item.goodsInfo.baseInfo.noDealPriceDisplay }}</span>
          <exclusive-offer
            v-if="item.goodsInfo.baseInfo.showBundlePrice"
            :price="item.goodsInfo.baseInfo.bundlePrice"
            :priceOff="item.goodsInfo.baseInfo.bundlePriceOff"
            question-position="under"
            scene="shopthelook"
          ></exclusive-offer>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="goods-default-info">
        <div class="icon-box">
          <az-icon :icon-class="catIcon"></az-icon>
        </div>
        <span>{{ item.catName }}</span>
      </div>
      <button class="icon-plus">+</button>
    </template>
  </div>
</template>
<script>
import colorHex from '@/assets/js/colorHex'
import ExclusiveOffer from '@/components/product/ExclusiveOffer'

/**
 * shop the look工具页商品展示组件
 * 默认无商品状态和有商品状态
 */
export default {
  components: { ExclusiveOffer },
  mixins: [colorHex],
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    catIcon() {
      const catId = this.item.catId
      let res = ''
      if (catId === 3109) {
        res = 'icon-look-bag-small'
      } else if (catId === 7) {
        res = 'icon-look-dress-small'
      } else if (catId === 3076) {
        res = 'icon-look-jewelry-small'
      } else if (catId === 3102) {
        res = 'icon-look-shoes-small'
      }
      return res
    },
    // 商品图片地址
    goodsImg() {
      const shopLookGallery = this.item.goodsInfo.imageInfo.shopLookGallery
      if (shopLookGallery && shopLookGallery[this.item.selectedColor.key] && shopLookGallery[this.item.selectedColor.key][0]) {
        return this.item.goodsInfo.imageInfo.browserPrefix + shopLookGallery[this.item.selectedColor.key][0].imgUrl
      } else {
        return ''
      }
    },
    // 是否有颜色可选项
    hasColor() {
      if (this.item.goodsInfo.styleInfo) {
        return this.item.goodsInfo.styleInfo.hasColor
      } else {
        return false
      }
    },
    // 是否有尺码可选项
    hasSize() {
      if (this.item.goodsInfo.styleInfo) {
        return this.item.goodsInfo.styleInfo.hasSize
      } else {
        return false
      }
    }
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    },
    // 点击颜色尺码，弹框快速加购弹框，选择颜色和尺码
    clickColoeSize() {
      this.$emit('changeColorSize', this.item)
    },
    // 点击容器，如果没有商品，执行展示商品列表操作
    clickBox() {
      if (!this.item.goodsInfo) {
        this.clickChange()
      }
    },
    // 点击change
    clickChange() {
      this.$emit('clickChange', this.item)
    },
    // 点击删除
    clickDelete() {
      this.$emit('clickDelete', this.item)
    }
  }
}
</script>
<style lang="less" scoped>
.flex-center {
  display: flex;
  align-items: center;
}
.flex-between {
  .flex-center();
  justify-content: space-between;
}
.icon-button {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  padding: 0px;
  border: none;
  background: none;
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    background: var(--color-f9f9f9);
  }
}
.stl-goods-item {
  width: 100%;
  min-height: 60px;
  padding-right: 15px;
  margin: 0px auto;
  margin-bottom: 5px;
  background: var(--color-f9f9f9);
  border: 2px solid var(--color-f9f9f9);
  .flex-between();
  color: @theme;
  box-sizing: border-box;
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
  &.has-goods {
    background: #fff;
  }
  .goods-default-info {
    .flex-center();
    font-size: 13px;
    line-height: 18px;
    text-transform: uppercase;
    .icon-box {
      padding: 14px 17px;
      .az-icon {
        width: 30px;
        height: 30px;
      }
    }
  }
  .icon-plus {
    font-size: 16px;
    .icon-button();
    color: @theme;
  }
  .goods-img {
    padding: 17.5px 5px;
    margin-right: 5px;
    width: 50px;
    height: 69px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .goods-info {
    flex: 1;
    padding: 14px 0px;
    .goods-name {
      .flex-between();
      font-size: 13px;
      line-height: 18px;
      margin-bottom: 10px;
      color: var(--color-121212);
      position: relative;
      &-content {
        width: 90%;
      }
      a {
        text-decoration-line: underline;
        color: var(--color-999999);
        margin-left: 5px;
        cursor: pointer;
      }
      .icon-delete {
        position: absolute;
        right: 0px;
        .icon-button();
        .az-icon {
          font-size: 14px;
          fill: var(--color-121212);
        }
      }
    }
    .color-size {
      padding: 3px 9px;
      background: var(--color-f9f9f9);
      border-radius: 60px;
      height: 16px;
      .flex-between();
      font-size: 12px;
      line-height: 16px;
      font-family: @font-family-600;
      width: fit-content;
      border: 1px solid var(--color-f9f9f9);
      color: var(--color-121212);
      cursor: pointer;
      .color {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        margin-right: 3px;
      }
      .az-icon {
        margin-left: 10px;
        width: 9px;
      }
      &.error {
        border-color: red;
      }
      &-box {
        .error-msg {
          color: red;
          font-size: 12px;
          line-height: 16px;
          margin-top: 5px;
        }
      }
    }
    .price {
      &-box {
        .flex-center();
        justify-content: flex-end;
        font-size: 13px;
        line-height: 18px;
        color: #999;
        margin-top: 10px;
        .goods-price {
          font-size: 13px;
          display: inline-block;
          &.red {
            color: @theme-color;
          }
        }
        .no-deal-price {
          color: #999;
          text-decoration: line-through;
          display: inline-block;
          font-size: 12px;
          line-height: 16px;
          margin-left: 5px;
        }
        /deep/ .exclusive-offer {
          margin-left: 5px;
        }
      }
      &-text {
        text-transform: capitalize;
      }
    }
  }
  &:hover {
    width: calc(100% - 10px);
    border: 2px solid var(--color-121212);
    background: var(--color-f1e9e6);
  }
}
</style>
