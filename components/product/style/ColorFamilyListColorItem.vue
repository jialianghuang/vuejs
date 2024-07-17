<template>
  <div
    :key="`color_${colorItem.key}_${colorIndex}`"
    :class="[{ 'color-active': selectedColor.key === colorItem.key, 'color-disabled': outOfStock(colorItem) }]"
    @click="colorClick(colorItem, familyItem)"
    class="color-item"
  >
    <div class="color-item-content">
      <span>
        <em :style="getColorStyle(colorItem.key, null, true)" :class="'color_type' + getColorType(colorItem.key)">
          <div v-if="outOfStock(colorItem)" class="color-disabled"></div>
          <az-icon v-if="selectedColor.key === colorItem.key" icon-class="icon-lby_tick_white_s" class="active-icon" />
          <az-icon
            v-else-if="showColorTag(colorItem)"
            :icon-class="'icon-show-color-tag' + getColorType(colorItem.key)"
            class="icon-stock discount-tag"
          ></az-icon>
          <az-icon
            v-else-if="supportLocalWarehouseStock(colorItem)"
            :icon-class="'icon-a-7day' + getColorType(colorItem.key)"
            class="icon-stock"
          ></az-icon>
          <div
            v-if="
              supportLocalWarehouseStock(colorItem) &&
                !showColorTag(colorItem) &&
                selectedColor.styleId == colorItem.styleId &&
                !sameAsDress
            "
            class="icon-stock2"
          >
            <img ref="hashGif" :src="replaceImgCdnUrl(gifSrc)" alt="hash gif" />
          </div>
        </em>
      </span>
    </div>
    <div class="color-item-name">
      <span v-if="colorItem.isNew" class="theme-color">{{ nl('page_common_new_capital') }}! </span>
      <span class="text-ca">{{ formartName(colorItem.name) }}</span>
      <span v-if="supportLocalWarehouseStock(colorItem)" class="theme-color"> {{ nl(shipsInText) }}!</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import colorHex from '@/assets/js/colorHex'
export default {
  name: 'ColorFamilyListColorItem',
  languageKeys: ['page_common_new_capital', 'page_ships_in_time_24', 'page_ships_in_time'],
  mixins: [colorHex],
  props: {
    colorItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    familyItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    colorIndex: {
      type: String,
      default: ''
    },
    selectedColor: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isStockGoods: {
      type: Boolean,
      default: false
    },
    colorLocalWarehouseStock: {
      type: Array,
      default: () => {
        return []
      }
    },
    supportStockSales: {
      type: [Boolean, Number],
      default: false
    },
    stock: {
      type: Array,
      default: () => {
        return []
      }
    },
    sameAsDress: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    colorInfoId: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      datetime: new Date().getTime(),
      timer: null
    }
  },
  computed: {
    ...mapState({ customSizeSelected: (state) => state.product.customSizeSelected }),
    shipsInText({ baseInfo }) {
      if (this.isSpecialCatId(baseInfo.catId)) {
        return 'page_ships_in_time_24'
      }
      return 'page_ships_in_time'
    },
    gifSrc() {
      return 'https://cdn-1.azazie.com/upimg/userfiles/images/9d/67/4ae631390871935ebf3fe4d6a4df9d67.gif?t=' + this.datetime
    }
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  mounted() {
    this.timer = setInterval(() => {
      this.datetime = new Date().getTime()
    }, 3000)
  },
  methods: {
    formartName(name) {
      return name ? name.toLowerCase() : ''
    },
    colorClick(colorItem, familyItem) {
      this.buryPoint(this, 'event', {
        ec: 'color',
        el: 'choose',
        ea: 'click',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType,
          cat_id: this.baseInfo.catId
        })
      })
      this.$emit('colorClick', {
        colorItem,
        familyItem
      })
    },
    outOfStock(color) {
      return this.isStockGoods && !this.stock.includes(color.key)
    },
    // #18251： 仅对于目的国有库存展示闪电标
    supportLocalWarehouseStock(color) {
      if (this.isSpecialCatId(this.baseInfo.catId) && this.country == 'US') {
        return this.stock.includes(color.key) && !this.customSizeSelected && this.colorLocalWarehouseStock.includes(color.key)
      }
      // sod 支持 ship in 24
      return (
        this.shipingIn24Hours &&
        this.supportStockSales &&
        this.stock.includes(color.key) &&
        !this.customSizeSelected &&
        !this.isSpecialCatId(this.baseInfo.catId) &&
        this.colorLocalWarehouseStock.includes(color.key)
      )
    },
    showColorTag(color) {
      return this.colorInfoId.includes(color.styleId)
    }
  }
}
</script>

<style lang="less" scoped>
.theme-color {
  color: @theme-color;
}
.text-ca {
  text-transform: capitalize;
}
// 单个颜色的样式
.color-item {
  width: 75px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  border-radius: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  flex-flow: column;
  margin: 16px 2.5px 0;
  z-index: 1;
  .color-item-content {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
    a {
      display: flex;
    }
  }
  .color-item-name {
    color: var(--color-121212);
    font-size: 12px;
    line-height: 12px;
    text-transform: capitalize;
    word-break: break-word;
    margin-left: -1px;
    margin-right: -1px;
  }
  &:hover {
    .color-item-name {
      color: @theme-color;
    }
  }
  &.color-disabled {
    z-index: 1;
    .color-item-name {
      color: #999;
    }
  }
  em {
    display: inline-block;
    width: 30px;
    height: 30px;
    overflow: hidden;
    border-radius: 5px;
    position: relative;
    .icon-stock {
      position: absolute;
      fill: currentColor;
      color: #fff;
      font-size: 16px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      &.discount-tag {
        margin-top: -4px;
        margin-left: -4px;
        transform: scale(1.3);
      }
    }
  }
  .active-icon {
    position: absolute;
    width: 16px;
    height: 14px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    fill: currentColor;
    color: #fff;
  }
  em.color_type0 {
    .active-icon {
      fill: currentColor;
      color: #666;
    }
  }
  .color-disabled {
    position: absolute;
    width: 55px;
    height: 1px;
    background: #eee;
    transform: translate(-50%, -50%) rotate(-45deg);
    top: 50%;
    left: 50%;
  }
  .icon-stock2 {
    position: absolute;
    fill: currentColor;
    width: 30px;
    height: 30px;
    color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
