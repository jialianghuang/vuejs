<template>
  <div
    ref="style-color-family"
    :class="['cat-' + catId, { isSmallStyle: isSmallStyle, fromQuickShop: fromQuickShop }]"
    class="style-color-family"
  >
    <!-- 展示色系+颜色 -->
    <template>
      <div
        ref="style-color-family-content-box"
        v-if="productColorFamily && Object.values(productColorFamily).length"
        @mouseenter="mouseEnterOutBox($event)"
        @mouseleave="mouseLeaveOutBox($event)"
        class="style-color-family-content-box"
      >
        <div class="color-family-list-box">
          <template v-for="(familyItem, familyIndex) in Object.values(productColorFamily)">
            <div
              v-if="familyItem.subColorList && familyItem.subColorList.length"
              v-track.view="getBiCommonParams(familyItem, null, 'detailpage')"
              :key="`colorfamily_${familyItem.key}_${familyIndex}`"
              :ref="`color-family-item-${familyItem.key}`"
              :class="[
                `family-${familyItem.key}`,
                `family-${familyItem.key}-${jsKey}`,
                {
                  moreLine: moreLine,
                  lastItem: familyIndex === Object.values(productColorFamily).length - 1,
                  'family-active': curColorFamily.key === familyItem.key,
                  'family-nearby-1': nearbyColorFamily1.includes(familyIndex),
                  'family-nearby-2': nearbyColorFamily2.includes(familyIndex),
                  'family-select': isSelectedColorBelongFamily(familyItem),
                  'family-select-init': selectedColorFamilyItem.key === familyItem.key && !curColorFamily.key
                },
                { 'show-color-selected': showColorSelected(familyItem) },
                { 'hide-color-selected': getHideClass(familyItem) }
              ]"
              @mouseleave="mouseLeaveFamily(familyItem, $event)"
              class="color-family-item"
            >
              <!-- :style="{ 'margin-right': mouseInOutBox && selectedColor.key ? '90px' : '', transition: 'all 1s ease-out' }" -->
              <!-- 为了修复换行的时候，鼠标hover进色系因为气泡消失导致样式错乱问题，这这种场景下给最后一个色系加上margin-right： 90px占位。 -->
              <!-- 色系 -->
              <template>
                <div @mouseenter="mouseEnterFamily(familyItem, 'family')" @click="colorFamilyClick(familyItem)" class="family-item-content">
                  <div class="color-img-box">
                    <div class="color-img-border">
                      <!--  best_seller new_in 取色色系里的第一个单色，再加上背景图 -->
                      <div
                        v-if="['best_seller', 'new_in'].includes(familyItem.key)"
                        :style="{
                          ...getColorStyle(
                            familyItem.subColorList &&
                              Object.values(familyItem.subColorList)[0] &&
                              Object.values(familyItem.subColorList)[0].key,
                            null,
                            null,
                            addWebpSuffix(familyItem.imageUrl)
                          )
                        }"
                        class="color-img"
                      ></div>
                      <img
                        :src="addWebpSuffix(familyItem.imageUrl)"
                        :alt="familyItem.key"
                        v-else-if="familyItem.imageUrl"
                        class="color-img"
                      />
                      <div v-else :style="getColorStyle(familyItem.key)" class="color-img"></div>
                    </div>
                  </div>
                  <div class="color-name">
                    {{ familyItem.name }}
                  </div>
                </div>
              </template>
              <!-- 选中色系下的颜色的时候需要在色系旁边给一个气泡展示 -->
              <template>
                <div
                  :class="[
                    { 'selected-color-box-active': showColorSelected(familyItem) },
                    { 'selected-color-box-hide': getHideClass(familyItem) },
                    { 'selected-color-box-transparent': getTransparentClass(familyItem) }
                  ]"
                  class="selected-color-box"
                >
                  <template>
                    <color-family-list-color-item
                      :selectedColor="selectedColor"
                      :colorItem="selectedColor"
                      :familyItem="familyItem"
                      @colorClick="colorClick"
                      :isStockGoods="isStockGoods"
                      :baseInfo="baseInfo"
                      :colorLocalWarehouseStock="colorLocalWarehouseStock"
                      :support-stock-sales="supportStockSales"
                      :stock="stock"
                      :colorInfoId="colorInfoId"
                    ></color-family-list-color-item>
                  </template>
                  <!-- 气泡上的小三角 -->
                  <div class="pop-triangle-box-1"></div>
                  <div class="pop-triangle-box-2"></div>
                </div>
              </template>

              <!-- 色系下的子颜色 -->
              <template>
                <div
                  @mouseenter="mouseEnterFamily(familyItem)"
                  v-if="curColorFamily"
                  :class="[`family-${familyItem.key}-colors-box`, { 'color-list-active': curColorFamily.key === familyItem.key }]"
                  :style="colorsStyle[familyItem.key]"
                  :ref="`family-${familyItem.key}-colors-box`"
                  class="color-list-box"
                >
                  <div class="color-list-content">
                    <template>
                      <template v-for="(colorItem, colorIndex) in familyItem.subColorList">
                        <color-family-list-color-item
                          :key="`color_${colorItem.key}_${colorIndex}`"
                          :class="[`family-${familyItem.key}-color-${colorItem.key}`]"
                          :colorItem="colorItem"
                          :familyItem="familyItem"
                          :colorIndex="colorIndex + ''"
                          @colorClick="colorClick"
                          :selectedColor="selectedColor"
                          :isStockGoods="isStockGoods"
                          :baseInfo="baseInfo"
                          :colorLocalWarehouseStock="colorLocalWarehouseStock"
                          :support-stock-sales="supportStockSales"
                          :stock="stock"
                          :colorInfoId="colorInfoId"
                          v-track.click="getBiCommonParams(familyItem, colorItem, 'singlecolordetailpage')"
                        ></color-family-list-color-item>
                      </template>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'
import ColorFamilyListColorItem from '@/components/product/style/ColorFamilyListColorItem'
// import productColorFamily from '@/assets/js/productColor' // 测试使用数据
export default {
  name: 'ColorFamilyList',
  languageKeys: [...ColorFamilyListColorItem.languageKeys],
  components: { ColorFamilyListColorItem },
  mixins: [colorHex],
  props: {
    productColorFamily: {
      type: Object,
      default: () => {}
    },
    selectedColor: {
      type: Object,
      default: () => {}
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
      type: Boolean,
      default: false
    },
    stock: {
      type: Array,
      default: () => {
        return []
      }
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
    },
    fromQuickShop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // productColorFamily,
      curColorFamily: {},
      colorsStyle: {},
      nearbyColorFamily1: [], // 当前hover中的色系,前后相近，各1个相邻的色系的index
      nearbyColorFamily2: [], // 当前hover中的色系,前后各相隔1个的色系
      mouseInOutBox: true, // 为了解决hover最边的色系出现动画闪动的问题
      OutBoxH: 0,
      isSmallStyle: false,
      selectedColorFamilyItem: {}
    }
  },
  computed: {
    // 色系最大宽度是否超过一行，如果超过，则不做动画处理。 小屏幕下也不做动画处理
    moreLine() {
      if (
        process.client &&
        this.productColorFamily &&
        Object.keys(this.productColorFamily) &&
        Object.keys(this.productColorFamily).length
      ) {
        const colorFamilyLength = Object.keys(this.productColorFamily).length
        const fW = this.isSmallStyle ? 60 : 75 // 每个色系的宽度
        const maxColorFamilyW = colorFamilyLength * fW + 90
        const parentDom = this.$refs['style-color-family']
        const parentDomW = (parentDom && parentDom.getBoundingClientRect().width) || 600
        return maxColorFamilyW > parentDomW
      }
      return true
    }
  },
  watch: {},
  created() {
    if (process.client) {
      this.getStyleClass()
    }
  },
  mounted() {
    this.initData()
    window.addEventListener('resize', () => {
      this.handleSetPosition()
      this.getStyleClass()
    })
  },
  methods: {
    initData() {
      let selectedColorFamilyItem = {}
      if (this.selectedColor && this.selectedColor.key && this.productColorFamily) {
        for (const familyKey in this.productColorFamily) {
          const subColorList = this.productColorFamily[familyKey].subColorList || []
          subColorList.forEach((colorItem) => {
            if (colorItem.key === this.selectedColor.key && !Object.keys(selectedColorFamilyItem).length) {
              selectedColorFamilyItem = {
                ...this.productColorFamily[familyKey]
              }
            }
          })
        }
      }
      this.selectedColorFamilyItem = selectedColorFamilyItem
    },
    // 选中颜色所属色系，都需要变红，只有当前选中颜色对应色系有气泡
    isSelectedColorBelongFamily(familyItem) {
      return (
        this.selectedColor &&
        familyItem &&
        familyItem.subColorList &&
        Object.keys(familyItem.subColorList).length &&
        Object.keys(familyItem.subColorList).some((key) => familyItem.subColorList[key].key === this.selectedColor.key)
      )
    },
    mouseEnterFamily(familyItem, type) {
      if (type == 'family' && familyItem.key !== this.curColorFamily.key) {
        this.buryPoint(this, 'event', {
          ec: 'colorfamily',
          el: 'popupdetailpage',
          ea: 'view',
          msg: JSON.stringify({
            cat_name: this.baseInfo.catName,
            cat_id: this.baseInfo.catId,
            goodsId: this.baseInfo.goodsId,
            dress_type: this.baseInfo.dressType,
            attr2: familyItem.name
          })
        })
      }
      this.curColorFamily = familyItem
      const familyIndex = Object.keys(this.productColorFamily).indexOf(familyItem.key)
      if (familyIndex > -1) {
        this.nearbyColorFamily1 = [familyIndex - 1, familyIndex + 1]
        this.nearbyColorFamily2 = [familyIndex - 2, familyIndex + 2]
      } else {
        this.nearbyColorFamily1 = []
        this.nearbyColorFamily2 = []
      }
      this.resetAllColorsScroll()
      // hover 的时候重新计算下定位
      this.colorsStyle[familyItem.key] = this.resetColorsStyle(familyItem)
    },
    mouseLeaveFamily(familyItem, e) {
      if (this.mouseInOutBox) {
        this.mouseEnterFamily(familyItem)
        // 为了修复hover两边的色系的时候，由于盒子宽度变小导致的鼠标进入和鼠标移出事件不停反复出现的问题。这里加一个最外层盒子的mouseleave和mouseenter事件，通过判断，如果鼠标没有移出外层盒子的时候，不执行当前的色系 mouseleave 事件
        return false
      } else {
        this.curColorFamily = {}
        this.nearbyColorFamily1 = []
        this.nearbyColorFamily2 = []
      }
    },
    mouseEnterOutBox(e) {
      const OutBoxClientRect = this.$refs['style-color-family-content-box'].getBoundingClientRect()
      this.OutBoxH = OutBoxClientRect && OutBoxClientRect.height
      this.mouseInOutBox = true
    },
    mouseLeaveOutBox(e) {
      this.mouseInOutBox = false
      this.mouseLeaveFamily()
    },
    colorClick(data) {
      const { colorItem, familyItem } = data
      // 选中其他的color的时候，点击颜色之后需要取消鼠标移入事件
      if (!this.selectedColor || this.selectedColor.key !== colorItem.key) {
        this.mouseLeaveOutBox()
      }
      this.selectedColorFamilyItem = familyItem
      this.$emit('select-color', colorItem)
    },
    colorFamilyClick(familyItem) {},
    handleSetPosition() {
      for (const key in this.productColorFamily) {
        const familyItem = this.productColorFamily[key]
        this.colorsStyle[key] = this.resetColorsStyle(familyItem)
      }
    },
    // 默认all色圈弹框，鼠标滚动到最下面
    resetAllColorsScroll() {
      if (this.$refs['family-all-colors-box'] && this.$refs['family-all-colors-box'][0]) {
        this.$refs['family-all-colors-box'][0].scrollTo({
          top: 0
        })
      }
    },
    resetColorsStyle(familyItem) {
      if (process.server) return false
      // 处理colors的定位
      const colorFamilyBox = this.$refs[`color-family-item-${familyItem.key}`] && this.$refs[`color-family-item-${familyItem.key}`][0]
      const parentDom = this.$refs['style-color-family']
      if (!colorFamilyBox || !parentDom || !familyItem.subColorList) return false
      const colorFamilyBoxClientRect = colorFamilyBox.getBoundingClientRect()
      const parentDomClientRect = parentDom.getBoundingClientRect()
      // 备注： 这里的处理方法是，假设 colorslist 的盒子针对色系定位居中的时候，如果左测超过最外层父级左侧，则让colorslist盒子最左侧靠左，同理，如果右侧超过最外层父级右侧，则让colorslist盒子最右侧靠右
      // 每个color盒子宽75px,两个盒子间隔 2.5px  。外层左右间隔 各 10px。 最大为 parentDom 的宽度
      const cw = 75 // color盒子宽度
      const cop = 10 // 外层左右间隔
      const cfw = 70 // active色系的宽度
      let maxW = 415 // 颜色盒子最大宽度是415px
      // all color 颜色盒子最大宽度是663px
      if (familyItem.key == 'all') {
        // maxW = 415 + 80 * 3 + 8 // 8是滚动条的宽度
        maxW = 415 + 8
      }
      const colorsBoxWidth = Math.min(Object.keys(familyItem.subColorList).length * (cw + 2.5) + cop * 2, maxW) // 颜色盒子最大宽度是415px,如果颜色个数不够,则取小值
      const colorsBoxLeft = colorFamilyBoxClientRect.left - (colorsBoxWidth / 2 - cfw / 2)
      const colorsBoxRight = colorsBoxWidth / 2 - cfw + colorFamilyBoxClientRect.right

      let style = {
        maxWidth: `${maxW}px`,
        left: '50%'
      }
      if (colorsBoxLeft <= parentDomClientRect.left) {
        style = {
          left: `-${colorFamilyBoxClientRect.left - parentDomClientRect.left}px`,
          transform: `translateX(0)`,
          maxWidth: `${maxW}px`
        }
      } else if (colorsBoxRight >= parentDomClientRect.right - 20) {
        const space = parentDomClientRect.right - colorFamilyBoxClientRect.right - 20
        // if (space > 90) {
        //   space = space - 90 // 90 是预留气泡的位置
        // }
        const left = space + cfw
        style = {
          left: `${left}px`,
          transform: `translateX(-100%)`,
          maxWidth: `${maxW}px`
        }
      }
      return style
    },
    showColorSelected(familyItem) {
      // 当前色系下是否有选中的颜色,并且没有任何hover态
      // return this.selectedColorFamilyItem && this.selectedColorFamilyItem.key === familyItem.key && !this.curColorFamily.key
      return this.selectedColorFamilyItem && this.selectedColorFamilyItem.key === familyItem.key
    },
    getHideClass(familyItem) {
      // 为了制作消失的东西，需要一个class
      const getHideClass = this.selectedColorFamilyItem && this.selectedColorFamilyItem.key === familyItem.key && this.curColorFamily.key
      return getHideClass && false
    },
    getTransparentClass(familyItem) {
      // hover其他色系的时候，气泡改成不消失了，但是要有个透明度。
      const getTransparentClass =
        this.selectedColorFamilyItem && this.selectedColorFamilyItem.key === familyItem.key && this.curColorFamily.key
      return getTransparentClass
    },
    formartName(name) {
      return name ? name.toLowerCase() : ''
    },
    getStyleClass() {
      // 获取屏幕宽度，小于1536以及quickshop使用一套，大于1536 使用另一套
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      this.isSmallStyle = windowWidth <= 1536 || this.fromQuickShop
    },
    getBiCommonParams(familyItem = {}, colorItem = null, el) {
      if (process.server) return
      const msg = {
        cat_name: this.baseInfo.catName,
        cat_id: this.baseInfo.catId,
        goodsId: this.baseInfo.goodsId,
        dress_type: this.baseInfo.dressType
      }
      if (colorItem) {
        msg.attr1 = colorItem.name
        msg.attr2 = familyItem.name
      } else {
        msg.attr2 = familyItem.name
      }
      const params = {
        common: {
          ec: 'colorfamily',
          el,
          msg: JSON.stringify(msg)
        }
      }
      return params
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
.style-color-family {
  .style-color-family-content-box {
    margin: 0 auto;
    max-width: 100%;
  }
  .color-family-list-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .color-family-item {
      text-align: center;
      height: 85px;
      // cursor: pointer;
      position: relative;
      padding: 0 10px 10px;
      box-sizing: border-box;
      margin-right: 0px;
      &.family-best_seller,
      &.family-new_in {
        .color-name {
          width: 140%;
        }
      }
      &::before {
        display: none;
        content: '';
        position: absolute;
        left: calc(50% - 16px);
        bottom: -2px;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 12px solid #f6f6f6;
        filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.5));
        z-index: 1;
      }
      &::after {
        display: none;
        content: '';
        position: absolute;
        left: calc(50% - 16px);
        bottom: -3px;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 12px solid #f6f6f6;
        z-index: 999999; //层级高于客服按钮
      }
      .family-item-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .color-img-box {
          box-sizing: border-box;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          .color-img-border {
            padding: 3px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid transparent;
          }
          .color-img {
            width: 40px;
            height: 40px;
            vertical-align: middle;
            border-radius: 50%;
            transition: all 0.2s ease-out;
            transform: translate3d(0, 0, 0);
          }
        }
        .color-name {
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 50%;
          transform: translate(-50%, -27px);
          width: 100%;
          top: 100%;
        }
      }
      &.family-active,
      &.family-select {
        position: relative;
      }
      // 当前hover中的色系
      &.family-active {
        &::before {
          display: block;
        }
        &::after {
          display: block;
        }
        .family-item-content {
          .color-img-box {
            .color-img-border {
              border: 2px solid @theme-color;
            }
            .color-img {
              width: 50px;
              height: 50px;
              transform: translate3d(0, 0, 0);
            }
          }
        }
      }
      &.family-active.family-all-index {
        &::before {
          display: none !important;
        }
        &::after {
          display: none !important;
        }
      }
      // 选中的色系
      &.family-select {
        .family-item-content {
          .color-name {
            color: @theme-color;
          }
        }
      }
      //页面初始状态，有选中色没有hover的状态
      &.family-select-init {
        .family-item-content {
          .color-img-box {
            .color-img-border {
              border: 2px solid @theme-color;
            }
          }
        }
      }
      // 邻近的色系
      &.family-nearby-1 {
        .family-item-content {
          .color-img-box {
            .color-img {
              width: 50px;
              height: 50px;
              transform: translate3d(0, 0, 0);
            }
          }
        }
      }
      &.family-nearby-2 {
        .family-item-content {
          .color-img-box {
            .color-img {
              width: 45px;
              height: 45px;
              transform: translate3d(0, 0, 0);
            }
          }
        }
      }

      &.moreLine {
        .color-img {
          width: 40px !important;
          height: 40px !important;
          transform: translate3d(0, 0, 0);
        }
        &.lastItem {
          margin-right: 90px !important; //换行的情况下，给最后一个色系加一个 90 的 margin-right: 90px。修复因为hover的时候气泡消失导致的交互bug
        }
      }

      // 当前色系下有选中的颜色,并且没有任何hover态，右侧有个气泡，需要给个宽度放气泡
      &.show-color-selected {
        margin-right: 90px;
        animation: mRShowAni 1s 1;
      }
      &.hide-color-selected {
        margin-right: 0px;
        animation: mRHideAni 1s 1;
      }
      .color-list-box {
        position: absolute;
        transform: translateX(-50%);
        left: 50%;
        box-sizing: border-box;
        top: 100%;
        visibility: hidden;
        width: max-content;
        // z-index: 3;
        z-index: 999999; //层级高于客服按钮
        margin-top: 3px;
        max-width: 415px;
        background: #f6f6f6;
        border-radius: 10px;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
        &.family-all-colors-box {
          max-height: 300px;
          max-width: 423px;
          overflow-y: scroll;
          // 重置滚动条样式
          &::-webkit-scrollbar-track-piece {
            background: #f1f1f1;
          }
          &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          &::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
          }
        }

        &.color-list-active {
          visibility: visible;
        }
        .color-list-content {
          padding: 0 7.5px 16px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
        }
      }

      // 色系下有选中颜色的时候色系右侧的气泡
      .selected-color-box {
        position: absolute;
        background: #f6f6f6;
        border-radius: 6px;
        left: 100%;
        top: -2px;
        width: 86px;
        padding: 9px 0;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
        margin-left: 5px;
        display: none;
        transform: scale(0, 0);
        transform-style: preserve-3d;
        &.selected-color-box-active {
          display: block;
          transform: scale(1, 1);
          animation: showbubAni 1s 1;
        }
        &.selected-color-box-hide {
          transform: scale(0, 0);
          display: block;
          animation: hidebubAni 1s 1;
        }
        &.selected-color-box-transparent {
          opacity: 0.35;
        }
        /deep/ .color-item {
          width: 100%;
          height: 100%;
          margin: 0;
          border-radius: 0;
          background: #f6f6f6;
        }

        .pop-triangle-box-1,
        .pop-triangle-box-2 {
          position: absolute;
          background: #f6f6f6;
          box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
          width: 20px;
          height: 20px;
          transform: rotate(-135deg);
          left: 0;
          top: 20px;
          margin-left: -7px;
          border-radius: 2px;
          z-index: -1;
        }
        .pop-triangle-box-2 {
          z-index: 12;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
        }
      }
    }
  }

  &.isSmallStyle {
    // 首页需要根据屏幕宽度设置样式
    .color-family-list-box {
      .color-family-item {
        height: 85px;
        padding: 0 10px 10px;

        &::before {
          bottom: 0px;
        }
        &::after {
          bottom: 0;
        }
        .family-item-content {
          .color-img-box {
            height: 50px;
            .color-img-border {
              padding: 3px;
            }
          }
          .color-img {
            width: 30px;
            height: 30px;
          }
        }
        // 当前hover中的色系
        &.family-active {
          .family-item-content {
            .color-img-box {
              .color-img-border {
                border: 2px solid @theme-color;
              }
              .color-img {
                width: 30px;
                height: 30px;
                transform: translate3d(0, 0, 0);
              }
            }
          }
        }
        // 邻近的色系
        &.family-nearby-1 {
          .family-item-content {
            .color-img-box {
              .color-img {
                width: 30px;
                height: 30px;
                transform: translate3d(0, 0, 0);
              }
            }
          }
        }
        &.family-nearby-2 {
          .family-item-content {
            .color-img-box {
              .color-img {
                width: 30px;
                height: 30px;
                transform: translate3d(0, 0, 0);
              }
            }
          }
        }

        &.moreLine {
          .color-img {
            width: 30px !important;
            height: 30px !important;
            transform: translate3d(0, 0, 0);
          }
          &.lastItem {
            margin-right: 90px; //换行的情况下，给最后一个色系加一个 90 的 margin-right: 90px。修复因为hover的时候气泡消失导致的交互bug
          }
        }
      }
      .color-list-box {
        margin-top: 0;
      }
    }

    /deep/ .color-item {
      em {
        width: 24px;
        height: 24px;
      }
      .active-icon {
        width: 14px;
        height: 14px;
      }
      .icon-stock {
        font-size: 14px;
      }
      .icon-stock.discount-tag {
        margin-top: -5px;
        margin-left: -5px;
        transform: scale(1);
      }
    }
  }
  &.fromQuickShop {
    margin-left: -10px;
  }
}

@keyframes showbubAni {
  0% {
    transform: scale(0, 0);
    display: none;
  }
  100% {
    transform: scale(1, 1);
    display: block;
  }
}
@keyframes hidebubAni {
  0% {
    transform: scale(1, 1);
    display: block;
  }
  100% {
    transform: scale(0, 0);
    display: none;
  }
}
@keyframes mRShowAni {
  0% {
    margin-right: 0px;
  }
  100% {
    margin-right: 90px;
  }
}
@keyframes mRHideAni {
  0% {
    margin-right: 90px;
  }
  100% {
    margin-right: 0px;
  }
}
</style>
