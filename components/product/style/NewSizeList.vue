<template>
  <section class="new-size-list">
    <div v-if="hasCustomeSize" class="new-size-list-item">
      <p
        @click="
          selectSize({
            keyStr: 'customSize',
            key: '',
            name: nl('page_goods_custom_size')
          })
        "
        :class="['font-text text-item', { checked: customSizeSelected }]"
      >
        <span>{{ nl('page_goods_free_custom_sizing') }}</span>
      </p>
    </div>
    <div class="new-size-list-item">
      <p
        v-track.viewOnce.click="{ id: 'size-select-size', common: getCommon('size', 'select_size', selectedSize) }"
        @click="openSizeList"
        :class="[
          'font-text text-item standard',
          { checked: selectedSize.key, 'coming-soon-size': currentSizeIsComingSoon(baseInfo, selectedSize) }
        ]"
      >
        <span>
          {{ nl('page_goods_standard_sizing') }} -
          <span v-if="selectedSize.key" :class="'size'">
            {{ selectedSize.shownName }}
            <span class="coming-soon-text"> - {{ nl('page_common_coming_soon') }}</span>
          </span>
          <span v-else>{{ nl('page_goods_select_size') }}</span>
        </span>
        <az-icon :class="{ up: showSizeList }" icon-class="icon-lby_expand_arrow_down"></az-icon>
      </p>
      <div v-show="showSizeList" class="size-list-box">
        <p
          v-track.viewOnce.click="{ id: 'size-select-size-choose' + size.key, common: getCommon('size', 'choose', size) }"
          v-for="(size, index) in sizes"
          :key="index"
          :class="['font-text size-list-box-item', { checked: selectedSize.styleId == size.styleId }]"
          @click.stop="selectSize(size, size.isPlusSize)"
        >
          <span :class="['size-text', { 'coming-soon-size': currentSizeIsComingSoon(baseInfo, size) }]">
            {{ size.shownName }}
            <span class="coming-soon-text"> - {{ nl('page_common_coming_soon') }}</span>
            <span class="check-mark"></span>
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
// import { isBigSize } from '@/assets/js/utils'
export default {
  name: 'NewSizeList',
  languageKeys: [
    'page_goods_custom_size',
    'page_goods_free_custom_sizing',
    'page_goods_standard_sizing',
    'page_goods_select_size',
    'page_common_coming_soon'
  ],
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    },
    sizes: {
      type: [Array, Object],
      default: () => []
    },
    stock: {
      type: Array,
      default: () => []
    },
    selectedColor: {
      type: Object,
      default: () => {}
    },
    selectedSize: {
      type: Object,
      default: () => {}
    },
    isStockGoods: {
      type: Boolean,
      default: false
    },
    supportStockSales: {
      type: Boolean,
      default: false
    },
    hasCustomSize: {
      type: Boolean,
      default: false
    },
    sizeLocalWarehouseStock: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedOptions: {
      type: Object,
      default: () => {}
    },
    discountInfoMessage: {
      type: Object,
      default: () => {}
    },
    hideSizeMap: {
      type: Object,
      default: () => {}
    },
    customSizeSelected: {
      type: Boolean,
      default: false
    },
    hasCustomeSize: {
      type: Boolean,
      default: false
    },
    // product quickshop 表示是详情页或者quickshop
    scene: {
      required: true,
      type: String,
      default: 'product'
    },
    // 作用同父组件中的fromDialog
    fromDialog: {
      type: String,
      default: ''
    },
    comingsoonGoodsId: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      viewSize: [],
      showSizeList: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      let selectedSize = ''
      selectedSize = localStorage.getItem('SELECTED_SIZE')
      // rts详情有缓存选中尺码时，不选中
      if (this.baseInfo.dressType === 'clearance') selectedSize = ''
      const querySize = this.$route.query.size
      if (selectedSize && !querySize) {
        const tempSelectedSize = JSON.parse(selectedSize)
        if (tempSelectedSize && Array.isArray(tempSelectedSize)) {
          for (let i = 0; i < tempSelectedSize.length; i++) {
            const ele = tempSelectedSize[i]
            if (ele.catId === this.baseInfo.catId) {
              selectedSize = ele.selectedSize
              break
            }
          }
        }
        const { size = {}, sizeMap = {} } = this.discountInfoMessage
        // 当服务端请求的数据返回有活动信息的时候，判断当前记录颜色尺码有没有活动
        if (selectedSize && this.baseInfo.activityInfo && size.hasColorId == 1 && selectedSize.styleId != 0) {
          let res = false
          if (sizeMap[selectedSize.styleId]) {
            res = sizeMap[selectedSize.styleId].find((ele) => {
              return ele === this.selectedColor.styleId
            })
          }
          // 如果对应尺码对应颜色没有活动，那么即使有尺码数据记录，也不选中，避免出现页面内容数据闪动情况
          if (!res) {
            selectedSize = ''
          }
        }
      }
      if (this.fromDialog == 'cartEdit') {
        selectedSize = ''
      }
      // 进详情页默认选中的size
      if (selectedSize || (this.selectedOptions && this.selectedOptions.size)) {
        const currentSize = (selectedSize && selectedSize.key) || this.selectedOptions.size
        const sizeList = this.sizes
        sizeList.forEach((sizeItem) => {
          if (sizeItem.key === decodeURIComponent(currentSize)) {
            // sod 鞋子 之前记录的尺码如果 无库存或者是影藏尺码就不选中
            if ([3, 3102].includes(this.baseInfo.catId)) return
            this.selectSize(sizeItem, sizeItem.isPlusSize)
          }
        })
      }
    })
    document.documentElement.addEventListener('click', (e) => {
      if (e.target.closest('#add-to-bag') || e.target.closest('#buy-now')) {
        setTimeout(() => {
          this.showSizeList = false
        }, 0)
      }
    })
  },
  methods: {
    selectSize(size, isPlusSizeView = false) {
      this.showSizeList = false
      this.$emit('select-size', size)
      // todo: 色圈上是否有打折icon，自定义尺码特殊处理id，前后端约定customeStyleId字符串做判断标准
      this.$store.commit(`${this.scene}/setCustomStyleId`, '')
      if (size.keyStr === 'customSize') {
        this.$store.commit(`${this.scene}/setCustomStyleId`, 'customStyleId')
        this.$store.commit(`${this.scene}/setPlusSizeView`, false)
        return
      }
      // 特殊逻辑 点击大码会显示大码图片,
      if (
        !['sample', 'clearance', 'outlet'].includes(this.baseInfo.dressType) ||
        [2, 3, 7, 45, 158, 206, 3110].includes(this.baseInfo.catId)
      ) {
        this.$store.commit(`${this.scene}/setPlusSizeView`, isPlusSizeView)
      }
    },
    getCommon(ec, el, size) {
      const color = this.selectedColor
      const msg = {
        goodsId: this.baseInfo.goodsId,
        color: color.key,
        cat_id: this.baseInfo.catId,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType,
        size: size.key
      }
      const common = {
        ec,
        el,
        msg: JSON.stringify(msg)
      }
      return common
    },
    openSizeList() {
      this.showSizeList = !this.showSizeList
      if (this.scene) {
        this.$store.commit(`${this.scene}/setCustomSizeSelected`, false)
      }
    },
    currentSizeIsComingSoon(baseInfo, size) {
      if (this.comingsoonGoodsId[baseInfo.goodsId]) {
        return this.comingsoonGoodsId[baseInfo.goodsId].includes(size.key)
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.new-size-list {
  &-item {
    position: relative;
    width: 480px;
    margin: 10px 0;
    cursor: pointer;
    .text-item {
      height: 40px;
      padding: 5px 0;
      text-align: center;
      outline: 1px solid #ccc;
      box-sizing: border-box;
      &:hover {
        opacity: 0.9;
      }
      &::after {
        content: '';
        line-height: 30px;
      }
      &.standard {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 10px;
        color: #121212;
        .size {
          color: #121212;
        }
        .coming-soon-text {
          display: none;
        }
        &.coming-soon-size {
          color: var(--color-999999) !important;
          .size {
            color: var(--color-999999) !important;
          }
          .coming-soon-text {
            display: inline;
          }
        }
      }
      &.checked {
        outline-color: var(--theme-color);
        color: var(--theme-color);
        .size {
          color: var(--theme-color);
        }
      }
      .az-icon {
        transition: all 0.3s ease;
        &.up {
          transform: rotate(180deg);
        }
      }
    }
    .size-list-box {
      max-height: 300px;
      width: 100%;
      position: absolute;
      background-color: #fff;
      outline: 1px solid #ccc;
      box-sizing: border-box;
      overflow: auto;
      z-index: @z-index-4;
      &-item {
        height: 40px;
        line-height: 40px;
        .size-text {
          position: relative;
          .coming-soon-text {
            display: none;
          }
          &.coming-soon-size {
            color: var(--color-999999);
            .coming-soon-text {
              display: inline;
            }
          }
        }
        .check-mark {
          display: none;
          position: absolute;
          right: 0;
          bottom: 3px;
        }
        &.checked {
          background-color: #f9f9f9;
          font-weight: 600;
          .check-mark {
            display: inline-block;
            width: 10px;
            height: 6px;
            border-left: 2px solid #121212;
            border-bottom: 2px solid #121212;
            transform-origin: bottom left;
            transform: translateX(25px) rotate(-45deg);
          }
        }
      }
    }
  }
  .font-text {
    text-align: center;
    color: #121212;
    font-family: @font-family-500;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.52px;
    text-transform: uppercase;
  }
}
</style>
