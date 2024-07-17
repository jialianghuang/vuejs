<template>
  <div
    :class="['cat-' + catId, { hasListTopBanner: hasListTopBanner, fromListFilter: fromListFilter }, cfClass]"
    class="style-color-family"
  >
    <!-- 只展示颜色 -->
    <div v-if="onlyShowColor" v-swiper.onlyColorListSwiper="swiperOptions" class="swiper-container">
      <div :class="{ 'slide-center': Object.keys(allColroObj).length < 15 }" class="swiper-wrapper">
        <div v-for="(colorItem, colorkey, idx) in allColroObj" :key="idx" class="swiper-slide">
          <filter-color-item
            :class="[{ 'color-active': colorItem.selected }]"
            :colorItem="colorItem"
            :familyItem="colorsFamilyListObj[colorItem.familyColorKey]"
            :colorIndex="colorkey + ''"
            @colorClick="colorClick"
          ></filter-color-item>
        </div>
      </div>
      <az-icon v-show="Object.keys(allColroObj).length > 15" class="swiper-button-prev" icon-class="icon-lby_arrow_left" />
      <az-icon v-show="Object.keys(allColroObj).length > 15" class="swiper-button-next" icon-class="icon-lby_arrow_right" />
    </div>

    <!-- 展示色系+颜色 -->
    <template v-else>
      <div
        v-if="colorsFamilyListObj && Object.values(colorsFamilyListObj).length"
        @mouseenter="mouseEnterOutBox($event)"
        @mouseleave="mouseLeaveOutBox($event)"
        :style="{ width: fromListFilter ? outBoxW : 'auto' }"
        class="style-color-family-content-box"
      >
        <div class="color-family-list-box">
          <div
            v-for="(familyItem, familyIndex) in Object.values(colorsFamilyListObj)"
            :key="`colorfamily_${familyItem.key}_${familyIndex}`"
            :class="[
              `family-${familyItem.key}`,
              `family-${familyItem.key}-${jsKey}`,
              {
                'family-active': curColorFamily.key === familyItem.key,
                'family-nearby-1': nearbyColorFamily1.includes(familyIndex),
                'family-nearby-2': nearbyColorFamily2.includes(familyIndex),
                'family-select': isSelectedColorBelongFamily(familyItem),
                'family-select-init': selectedColor.selColorParentKey === familyItem.key && !curColorFamily.key
              },
              { 'show-color-selected': showColorSelected(familyItem) },
              { 'hide-color-selected': getHideClass(familyItem) }
            ]"
            @mouseleave="mouseLeaveFamily(familyItem, $event)"
            class="color-family-item"
          >
            <!-- 色系 -->
            <template>
              <div
                @mouseenter="mouseEnterFamily(familyItem, 'family')"
                v-track.view="getBiCommonParams(familyItem)"
                @click="colorFamilyClick(familyItem)"
                class="family-item-content"
              >
                <div v-track.view="getColorfamilyBiParams('listpage', familyItem)" class="color-img-box">
                  <div class="color-img-border">
                    <!--  best_seller new_in 取色色系里的第一个单色，再加上背景图 -->
                    <div
                      v-if="['best_seller', 'new_in'].includes(familyItem.key)"
                      :style="{
                        ...getColorStyle(
                          fromIndex
                            ? familyItem.subColorList &&
                                Object.values(familyItem.subColorList)[0] &&
                                Object.values(familyItem.subColorList)[0].key
                            : familyItem.subColorKeyList && familyItem.subColorKeyList[0],
                          null,
                          null,
                          addWebpSuffix(familyItem.imageUrl),
                          fromIndex
                            ? familyItem.subColorList && Object.values(familyItem.subColorList)[0]
                            : familyItem.subColorKeyList &&
                                familyItem.subColorKeyList[0] &&
                                familyItem.subColorList[familyItem.subColorKeyList[0]]
                        )
                      }"
                      class="color-img"
                    ></div>
                    <img
                      :src="addWebpSuffix(familyItem.imageUrl)"
                      :alt="familyItem.key"
                      v-else-if="familyItem.imageUrl"
                      @load="imgLoad(familyItem)"
                      class="color-img"
                    />
                    <div v-else :style="getColorStyle(familyItem.key, null, null, null, familyItem)" class="color-img"></div>
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
                  { 'selected-color-box-hide': getHideClass(familyItem) }
                ]"
                class="selected-color-box"
              >
                <template>
                  <filter-color-item
                    :class="[{ 'color-active': selectedColor.selected }]"
                    :colorItem="selectedColor"
                    :familyItem="familyItem"
                    @colorClick="colorClick"
                  ></filter-color-item>
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
                class="color-list-box"
              >
                <div
                  v-show="!(familyItem.key == 'all' && jsKey == 'index')"
                  :class="{
                    'min-expedited-shipping-width':
                      showExpeditedShippingTimeTips(familyItem.subColorList) && Object.keys(familyItem.subColorList).length <= 2
                  }"
                  class="color-list-content"
                >
                  <client-only>
                    <!-- 首页的色系色圈模块 -->
                    <template v-if="fromIndex">
                      <template v-for="(colorItem, colorIndex) in familyItem.subColorList">
                        <filter-color-item
                          :key="`color_${colorItem.key}_${colorIndex}`"
                          :class="[`family-${familyItem.key}-color-${colorItem.key}`, { 'color-active': colorItem.selected }]"
                          :colorItem="colorItem"
                          :familyItem="colorsFamilyListObj[colorItem.familyColorKey]"
                          :colorIndex="colorIndex + ''"
                          @colorClick="colorClick"
                          v-track.view="curColorFamily.key === familyItem.key ? getBiCommonParams(familyItem, colorItem) : false"
                          @click="
                            curColorFamily.key === familyItem.key
                              ? trackClick(
                                  'shopbycolor',
                                  colorItem
                                    ? `${familyItem.name.toLowerCase()}_${colorItem.name.toLowerCase()}`
                                    : familyItem.name.toLowerCase(),
                                  {},
                                  null,
                                  null,
                                  null,
                                  null,
                                  null,
                                  '/'
                                )
                              : false
                          "
                          scene="home"
                        ></filter-color-item>
                      </template>
                    </template>
                    <!-- 列表页的色系色圈模块 -->
                    <template v-else-if="familyItem.subColorKeyList">
                      <template v-for="colorKey in familyItem.subColorKeyList">
                        <filter-color-item
                          :key="`color_${familyItem.subColorList[colorKey].key}_${colorKey}`"
                          :class="[
                            `family-${familyItem.key}-color-${familyItem.subColorList[colorKey].key}`,
                            { 'color-active': familyItem.subColorList[colorKey].selected }
                          ]"
                          :colorItem="familyItem.subColorList[colorKey]"
                          :familyItem="familyItem"
                          :colorIndex="colorKey + ''"
                          @colorClick="colorClick"
                          v-track.view.click="getBiCommonParams(familyItem, familyItem.subColorList[colorKey])"
                        ></filter-color-item>
                      </template>
                    </template>
                  </client-only>
                </div>
                <!-- 色系里存在bd库存商品,显示提示文案 -->
                <!-- <div v-if="showExpeditedShippingTimeTips(familyItem.subColorList)" class="expedited-shipping-time-tips theme-color">
                  <az-icon icon-class="icon-a-7day1"></az-icon>
                  <span v-html="nl('page_expedited_shipping_time_tips')"></span>
                </div> -->
                <!-- #17628: 提示文案改成展示ship in 48hrs 的filter -->
                <div
                  v-if="jsKey == 'list' && showExpeditedShippingTimeTips(familyItem.subColorList) && showSupportStockSales"
                  class="ship-in-box"
                >
                  <support-stockSales-checkbox-b-d
                    :supportStockSales="supportStockSales"
                    @handleNormalStockChange="handleNormalStockChange"
                  ></support-stockSales-checkbox-b-d>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import filtersMixins from '@/assets/js/filters'
import colorHex from '@/assets/js/colorHex'
import FilterColorItem from '@/components/list/FilterColorItem'
import SupportStockSalesCheckboxBD from '@/components/product/SupportStockSalesCheckboxBD'
import { mapState } from 'vuex'
export default {
  name: 'ColorFamilyFilter',
  languageKeys: ['page_expedited_shipping_time_tips', ...SupportStockSalesCheckboxBD.languageKeys],
  components: { FilterColorItem, SupportStockSalesCheckboxBD },
  mixins: [filtersMixins, colorHex],
  props: {
    // 是否有ListTopBanner这个模块，影响到样式
    hasListTopBanner: {
      type: Boolean,
      default: false
    },
    colorsFamilyListObj: {
      type: Object,
      default() {
        return {}
      }
    },
    valueFamilyKeyList: {
      type: Array,
      default: () => {
        return []
      }
    },
    fromListFilter: {
      // 是否是列表页filter模块
      type: Boolean,
      default: false
    },
    indexShowModule: {
      // 因为首页有骨架屏，需要判断加载完成展示的时候，设置定位
      type: Boolean,
      default: false
    },
    cfClass: {
      type: String,
      default: ''
    },
    fromIndex: {
      // 来自首页
      type: Boolean,
      default: false
    },
    // 使用场景，比如：shopTheLook
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      curColorFamily: {},
      colorsStyle: {},
      nearbyColorFamily1: [], // 当前hover中的色系,前后相近，各1个相邻的色系的index
      nearbyColorFamily2: [], // 当前hover中的色系,前后各相隔1个的色系
      mouseInOutBox: true, // 为了解决hover最边的色系出现动画闪动的问题
      selectedColor: {}, // 选中的子颜色
      needHideAniKey: '',
      swiperOptions: {
        watchOverflow: true, // 仅有1个slide，swiper无效
        slidesPerView: 15,
        slidesPerGroup: 15,
        // centeredSlides: true,
        // centerInsufficientSlides: true,
        speed: 800,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      slideCount: 15 // 色块轮播区域每组最多显示15个色块
    }
  },
  computed: {
    ...mapState('list', ['selectedColorFamily', 'apiFilters', 'showSupportStockSales', 'isLandPage']),
    outBoxW() {
      // 备注。如果有改动到色系的大小，这里也需要改。这个是为了解决编辑色系hover跳动的问题，以最大宽度设置的色系外层盒子的宽度。
      if (this.colorsFamilyListObj && Object.keys(this.colorsFamilyListObj) && Object.keys(this.colorsFamilyListObj).length) {
        const listLength = Object.keys(this.colorsFamilyListObj).length
        let outBoxW = 94 + 90 * 2 + 85 * 2
        if (listLength >= 5) {
          outBoxW = 94 + 90 * 2 + 85 * 2 + 80 * (listLength - 5)
        } else if (listLength == 4) {
          outBoxW = 94 + 90 * 2 + 85 * 1
        } else if (listLength == 3) {
          outBoxW = 94 + 90 * 2
        } else if (listLength == 2) {
          outBoxW = 94 + 90 * 1
        } else if (listLength == 1) {
          outBoxW = 94
        }
        if (this.selectedColor.key) {
          // 表示有颜色选中,需要增加一个气泡的宽度 104px
          outBoxW = outBoxW + 104
        }
        return outBoxW + 'px'
      }
      return 'unset'
    },
    allColroObj() {
      // 如果所有色系下面的颜色总数少于7个（即颜色数量《=色系的数量），那么就直接显示颜色
      let allColroObj = {}
      if (this.colorsFamilyListObj && Object.keys(this.colorsFamilyListObj) && Object.keys(this.colorsFamilyListObj).length) {
        for (const fKey in this.colorsFamilyListObj) {
          const resSub = {}
          const subList = this.colorsFamilyListObj[fKey].subColorList || {}
          const subKeyList = this.colorsFamilyListObj[fKey].subColorKeyList || {}
          if (Object.keys(subList).length && Object.keys(subKeyList).length) {
            // 排序根据subColorKeyList内容来
            subKeyList.forEach((cKey) => {
              if (subList[cKey]) {
                resSub[cKey] = {
                  ...subList[cKey],
                  familyColorKey: fKey
                }
              }
            })
          }
          allColroObj = {
            ...allColroObj,
            ...resSub
          }
        }
      }
      return allColroObj
    },
    onlyShowColor() {
      return (Object.keys(this.allColroObj).length <= 7 && this.fromListFilter) || this.isLandPage
    }
  },
  watch: {
    indexShowModule(val) {
      if (val) {
        this.$nextTick(() => {
          this.handleSetPosition()
        })
      }
    },
    selectedColorFamily: {
      handler(val, oldVal) {
        this.initCurItem()
        if (process.client && this.fromListFilter) {
          // 因为改动filter条件后，颜色的数量会发生变化，所以需要重新计算定位
          this.handleSetPosition()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // this.initCurItem()
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.handleSetPosition()
    })
  },
  methods: {
    // 选中颜色所属色系，都需要变红，只有当前选中颜色对应色系有气泡
    isSelectedColorBelongFamily(familyItem) {
      return (
        familyItem &&
        familyItem.subColorList &&
        Object.keys(familyItem.subColorList).length &&
        Object.keys(familyItem.subColorList).some((key) => familyItem.subColorList[key].selected)
      )
    },
    // 色系里存在bd库存商品,显示提示文案
    showExpeditedShippingTimeTips(subColorList) {
      return (
        subColorList &&
        Object.keys(subColorList).length &&
        Object.keys(subColorList).some((key) => subColorList[key].showExpeditedShippingTime)
      )
    },
    initCurItem() {
      if (this.apiFilters) {
        // 如果在客户端的时候切换了filter,新的路径没有颜色入参，则让selectedColor置空
        // 主要是为了保证点击filter跳转的时候color展示的连贯性，以及修复切换CATEGORY的时候链接会重置filter导致的问题
        const colorFKey = ['colors', 'color', 'colors-family']
        let emptyFlag = true
        colorFKey.forEach((item) => {
          if (this.apiFilters[item] && this.apiFilters[item].length) {
            emptyFlag = false
          }
        })
        if (emptyFlag) {
          this.selectedColor = {}
          return false
        }
      }

      if (!this.colorsFamilyListObj) return false
      this.selectedColor = {}
      const list = Object.values(this.colorsFamilyListObj)
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        if (ele.selected) {
          const colorsObj = ele.subColorList
          this.selectedColor = { selColorParentKey: ele.key }
          if (Object.keys(colorsObj).length) {
            for (const cKey in colorsObj) {
              if (colorsObj[cKey] && colorsObj[cKey].selected) {
                this.selectedColor = { ...colorsObj[cKey], selColorParentKey: ele.key }
              }
            }
          }
        }
      }
    }, // type 是色系色圈
    mouseEnterFamily(familyItem, type) {
      if (type == 'family') {
        // 色系hover点记click
        if (this.fromIndex) {
          this.setPoint('shopbycolor', familyItem.name.toLowerCase(), 'click')
        } else {
          this.setPoint('filter', 'listpagecolorfamily', 'click', { attr1: `Color_${familyItem.name}`, attr2: familyItem.name })
        }
        if (
          (!this.curColorFamily || !this.curColorFamily.key || this.curColorFamily.key != familyItem.key) &&
          !(familyItem.key == 'all' && this.jsKey == 'index')
        ) {
          // 防止鼠标移动的时候重复打点，加个判断
          // 列表页色系弹窗出现次数	打点
          let msg = {
            attr2: familyItem.name
          }
          if (this.fromListFilter) {
            msg = {
              attr2: familyItem.name,
              cat_id: this.catId,
              category_ids: this.catIds,
              cat_name: this.seoCatName,
              dress_type: this.dressType
            }
          }
          this.buryPoint(this, 'event', {
            ec: 'colorfamily',
            el: 'popup',
            ea: 'view',
            msg: JSON.stringify(msg)
          })
        }
      }
      this.curColorFamily = familyItem
      const familyIndex = Object.keys(this.colorsFamilyListObj).indexOf(familyItem.key)
      if (familyIndex > -1) {
        this.nearbyColorFamily1 = [familyIndex - 1, familyIndex + 1]
        this.nearbyColorFamily2 = [familyIndex - 2, familyIndex + 2]
      } else {
        this.nearbyColorFamily1 = []
        this.nearbyColorFamily2 = []
      }
      this.resetAllColorsScroll()
    },
    mouseLeaveFamily(familyItem, e) {
      if (this.mouseInOutBox && this.fromListFilter) {
        // 为了修复hover两边的色系的时候，由于盒子宽度变小导致的鼠标进入和鼠标移出事件不停反复出现的问题。这里加一个最外层盒子的mouseleave和mouseenter事件，通过判断，如果鼠标没有移出外层盒子的时候，不执行当前的色系 mouseleave 事件
        return false
      } else {
        this.curColorFamily = {}
        this.nearbyColorFamily1 = []
        this.nearbyColorFamily2 = []
      }
    },
    mouseEnterOutBox(e) {
      this.mouseInOutBox = true
    },
    mouseLeaveOutBox(e) {
      this.mouseInOutBox = false
      this.mouseLeaveFamily()
    },
    colorClick(data) {
      const { colorItem, familyItem } = data
      // 色系中单色点击打点
      let msg = {
        attr1: colorItem.name,
        attr2: familyItem.name
      }
      if (this.fromListFilter) {
        msg = {
          attr1: colorItem.name,
          attr2: familyItem.name,
          cat_id: this.catId,
          category_ids: this.catIds,
          cat_name: this.seoCatName,
          dress_type: this.dressType
        }
      }
      this.buryPoint(this, 'event', {
        ec: 'colorfamily',
        el: 'singlecolor',
        ea: 'click',
        msg: JSON.stringify(msg)
      })

      if (familyItem) {
        this.$store.commit('list/setFamilyColorKey', familyItem.is_custom ? familyItem.key : '')
      }
      if (colorItem.selected) {
        // 说明是取消
        this.needHideAniKey = familyItem.key
      }
      if (this.scene === 'shopTheLook') {
        this.$emit('onColorClick', colorItem)
        return
      }
      if (this.fromListFilter) {
        const tempUrl = colorItem.url + (this.isBridal ? `${colorItem.url.includes('?') ? '&' : '?'}subsite=bridal` : '')
        this.selectOptionSubColors(
          'list_colors_family',
          {
            familyKey: familyItem.key,
            colorKey: colorItem.key
          },
          tempUrl
        )
      } else if (!this.fromIndex) {
        const linkUrl = colorItem.url + (this.isBridal ? `${colorItem.url.includes('?') ? '&' : '?'}subsite=bridal` : '')
        window.location.href = this.countryUrl(linkUrl)
      }
    },
    // 最新需求，色系不可选中了，先注释代码，防止后面又改！
    colorFamilyClick(familyItem) {
      if (familyItem.key === 'all' && this.jsKey == 'index') {
        const linkUrl = familyItem.url + (this.isBridal ? `${familyItem.url.includes('?') ? '&' : '?'}subsite=bridal` : '')
        window.location.href = this.countryUrl(linkUrl)
        return false
      }
    },
    getShow(tag) {
      return !!(tag && tag == 1)
    },
    handleSetPosition() {
      for (const key in this.colorsFamilyListObj) {
        const familyItem = this.colorsFamilyListObj[key]
        this.colorsStyle[key] = this.resetColorsStyle(familyItem)
      }
    },
    // 默认all色圈弹框，鼠标滚动到最下面
    resetAllColorsScroll() {
      if (document.querySelector('.family-all-colors-box')) {
        // const allColorsContentHeight = document.querySelector('.family-all-colors-box .color-list-content').getBoundingClientRect().height
        document.querySelector('.family-all-colors-box').scrollTo({
          top: 0
        })
      }
    },
    resetColorsStyle(familyItem) {
      if (process.server) return false
      // 处理colors的定位
      // const colorsBox = document.querySelector(`.family-${familyItem.key}-colors-box`)
      const colorFamilyBox = document.querySelector(`.family-${familyItem.key}`)
      const parentDom = document.querySelector('.style-color-family')
      if (!colorFamilyBox || !parentDom || !familyItem.subColorList) return false
      const colorFamilyBoxClientRect = colorFamilyBox.getBoundingClientRect()
      const parentDomClientRect = parentDom.getBoundingClientRect()
      // 备注： 这里的处理方法是，假设 colorslist 的盒子针对色系定位居中的时候，如果左测超过最外层父级左侧，则让colorslist盒子最左侧靠左，同理，如果右侧超过最外层父级右侧，则让colorslist盒子最右侧靠右
      // 每个color盒子宽48px,两个盒子间隔 2px  。外层左右间隔 各 10px。 最大为 parentDom 的宽度
      const cw = 75 // color盒子
      const cop = 10 // 外层左右间隔
      const cfw = this.cfClass === 'big-style' ? 108 : 80 // active色系的宽度
      let maxW = 415 // 颜色盒子最大宽度是415px
      // all color 颜色盒子最大宽度是663px
      if (familyItem.key == 'all') {
        maxW = 415 + 80 * 3 + 8 // 8是滚动条的宽度
      }
      const colorsBoxWidth = Math.min(Object.keys(familyItem.subColorList).length * cw + +cop * 2, maxW) // 颜色盒子最大宽度是410px,如果颜色个数不够,则取小值
      const colorsBoxLeft = colorFamilyBoxClientRect.left - (colorsBoxWidth / 2 - cfw / 2)
      const colorsBoxRight = colorsBoxWidth / 2 - cfw + colorFamilyBoxClientRect.right

      let style = {
        maxWidth: `${maxW}px`,
        left: '50%'
      }
      if (colorsBoxLeft <= parentDomClientRect.left) {
        style = {
          left: `-${parentDomClientRect.left - cfw / 2}px`,
          transform: `translateX(-40px)`, // 不能是0,0的话会导致箭头偏移错误
          maxWidth: `${maxW}px`
        }
      } else if (colorsBoxRight >= parentDomClientRect.right - 106) {
        let space = parentDomClientRect.right - colorFamilyBoxClientRect.right
        if (space > 106) {
          space = space - 106 // 106 是预留气泡的位置
        }
        const left = space + cfw
        style = {
          left: `${left}px`,
          transform: `translateX(-100%)`,
          maxWidth: `${maxW}px`
        }
      }
      // 加急提示的显示根据色圈数量判断
      const showExpeditedShippingTimeTips = this.showExpeditedShippingTimeTips(familyItem.subColorList)
      const colorLen = Object.keys(familyItem.subColorList).length
      if (showExpeditedShippingTimeTips) {
        if (colorLen <= 2) {
          // 最少宽是2个色圈的宽
          style.maxWidth = `${cw * 2 + 10 * 2 + 5}px`
        } else if (colorLen < 5) {
          // 色圈数量小于5，大于2，根据色圈宽度定
          style.maxWidth = `${cw * colorLen + 10 * 2 + 5 * (colorLen - 1)}px`
        }
      }
      return style
    },
    imgLoad(it) {
      this.$emit('imgLoad', it)
    },
    getBiCommonParams(familyItem = {}, colorItem = null) {
      if (process.server) return
      if (this.fromListFilter) {
        const msg = {
          cat_name: this.catName,
          cat_id: this.catId
        }
        if (colorItem) {
          msg.attr1 = 'Color'
          msg.attr2 = colorItem.name
          msg.attr3 = familyItem.name
        } else {
          msg.attr1 = `Color_${familyItem.name}`
          msg.attr2 = familyItem.name
        }
        const params = {
          common: {
            ec: 'filter',
            el: colorItem ? 'listpagecolor' : 'listpagecolorfamily',
            msg: JSON.stringify(msg)
          }
        }
        return params
      } else if (this.fromIndex) {
        // 首页的色系模块打点
        const params = {
          common: {
            ec: 'shopbycolor',
            el: colorItem ? `${familyItem.name.toLowerCase()}_${colorItem.name.toLowerCase()}` : familyItem.name.toLowerCase()
          }
        }
        return params
      } else if (this.scene === 'shopTheLook') {
        const msg = {}
        if (colorItem) {
          msg.attr1 = 'Color'
          msg.attr2 = colorItem.name
          msg.attr3 = familyItem.name
        } else {
          msg.attr1 = `Color_${familyItem.name}`
          msg.attr2 = familyItem.name
        }
        const params = {
          common: {
            ec: 'shopthelook',
            el: colorItem ? 'color_circle' : 'color_family',
            msg: JSON.stringify(msg)
          }
        }
        return params
      }
    },
    showColorSelected(familyItem) {
      // 当前色系下是否有选中的颜色,并且没有任何hover态
      return (
        this.selectedColor && this.selectedColor.key && this.selectedColor.selColorParentKey === familyItem.key && !this.curColorFamily.key
      )
    },
    getHideClass(familyItem) {
      // 为了制作消失的东西，需要一个class
      return (
        (this.selectedColor &&
          this.selectedColor.key &&
          this.selectedColor.selColorParentKey === familyItem.key &&
          this.curColorFamily.key) ||
        this.needHideAniKey === familyItem.key
      )
    },
    formartName(name) {
      return name ? name.toLowerCase() : ''
    },
    handleNormalStockChange(supportStockSales) {
      this.$emit('handleNormalStockChange', supportStockSales)
    },
    getColorfamilyBiParams(el, familyItem = {}, colorItem = null) {
      if (process.server) return false
      let msg = {
        attr1: colorItem && colorItem.name, // 颜色名称
        attr2: familyItem && familyItem.name // 色系名称，
      }
      if (this.fromListFilter) {
        msg = {
          attr1: colorItem && colorItem.name, // 颜色名称
          attr2: familyItem && familyItem.name, // 色系名称
          cat_id: this.catId,
          category_ids: this.catIds,
          cat_name: this.seoCatName,
          dress_type: this.dressType
        }
      }
      return {
        common: {
          ec: 'colorfamily',
          el,
          msg: JSON.stringify(msg)
        }
      }
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
  &.fromListFilter {
    padding: 14px 0 0;
    margin-bottom: -17px;
  }
  .style-color-family-content-box {
    margin: 0 auto;
    max-width: 100%;
  }
  &.hasListTopBanner {
    margin-top: -25px;
  }
  .color-family-list-box {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .color-family-item {
      text-align: center;
      height: 112px;
      // cursor: pointer;
      position: relative;
      padding: 0 12px 10px;
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
        // display: block;
        content: '';
        position: absolute;
        // background: #f6f6f6;
        // box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
        // width: 20px;
        // height: 20px;
        // transform: rotate(-45deg);
        // left: 50%;
        // bottom: 0;
        // margin-bottom: -7px;
        // margin-left: -12px;
        // border-radius: 2px;
        left: calc(50% - 16px);
        bottom: 2px;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        border-bottom: 14px solid #f6f6f6;
        filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.5));
        z-index: 1;
      }
      &::after {
        display: none;
        // display: block;
        content: '';
        position: absolute;
        // background: #f6f6f6;
        // width: 20px;
        // height: 20px;
        // transform: rotate(-45deg);
        // left: 50%;
        // bottom: 0;
        // margin-bottom: -7px;
        // margin-left: -12px;
        // border-radius: 2px;

        left: calc(50% - 16px);
        bottom: 5px;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        border-bottom: 14px solid #f6f6f6;
        z-index: 999999; //层级高于客服按钮
      }

      .family-item-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .color-img-box {
          box-sizing: border-box;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          .color-img-border {
            border: none;
            padding: 3px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .color-img {
            width: 50px;
            height: 50px;
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
          position: absolute;
          left: 50%;
          transform: translate(-50%, -38px);
          width: 100%;
          top: 100%;
          word-break: break-word;
        }
      }
      &.family-active,
      &.family-select {
        position: relative;
      }
      &.family-all-index {
        .family-item-content {
          cursor: pointer;
        }
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
              width: 60px;
              height: 60px;
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
              width: 60px;
              height: 60px;
              transform: translate3d(0, 0, 0);
            }
          }
        }
      }
      &.family-nearby-2 {
        .family-item-content {
          .color-img-box {
            .color-img {
              width: 55px;
              height: 55px;
              transform: translate3d(0, 0, 0);
            }
          }
        }
      }

      // 当前色系下有选中的颜色,并且没有任何hover态，右侧有个气泡，需要给个宽度放气泡
      &.show-color-selected {
        margin-right: 104px;
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
        margin-top: -5px;
        max-width: 415px;
        background: #f6f6f6;
        border-radius: 10px;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
        &.family-all-colors-box {
          max-height: 400px;
          max-width: 663px;
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
          &.min-expedited-shipping-width {
            justify-content: center;
          }
        }
        .expedited-shipping-time-tips {
          text-align: left;
          font-size: 12px;
          line-height: 16px;
          margin-bottom: 15px;
          padding: 0 10px;
          svg {
            fill: currentColor;
            font-size: 16px;
          }
        }
        .ship-in-box {
          text-align: left;
          margin-bottom: 15px;
          padding: 0 10px;
        }
      }

      // 色系下有选中颜色的时候色系右侧的气泡
      .selected-color-box {
        position: absolute;
        background: #f6f6f6;
        border-radius: 6px;
        left: 100%;
        top: 6px;
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
        // &::before {
        //   content: '';
        //   position: absolute;
        //   background: #f6f6f6;
        //   box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
        //   width: 20px;
        //   height: 20px;
        //   transform: translateZ(-1px) rotate(-45deg);
        //   left: 0;
        //   top: 20px;
        //   margin-left: -7px;
        //   border-radius: 2px;
        // }
        // &::after {
        //   content: '';
        //   position: absolute;
        //   background: #f6f6f6;
        //   width: 20px;
        //   height: 20px;
        //   transform: translateZ(3px) rotate(-45deg);
        //   left: 0;
        //   top: 20px;
        //   margin-left: -7px;
        //   border-radius: 2px;
        // }
        /deep/ .color-item {
          width: 100%;
          height: 100%;
          margin: 0;
          border-radius: 0;
          background: #f6f6f6;
          &.color-active {
            .color-item-content {
              border: 2px solid transparent;
            }
          }
          &:hover {
            .color-item-content {
              border: 2px solid @theme-color;
            }
          }
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

  &.big-style {
    // 首页需要根据屏幕宽度设置样式,宽一点的屏幕样式
    .color-family-list-box {
      .color-family-item {
        height: 154px;
        padding: 0 12.5px;
        .family-item-content {
          .color-img-box {
            height: 108px;
            .color-img-border {
              padding: 4px;
            }
          }
          .color-img {
            width: 75px;
            height: 75px;
          }
        }
        // 当前hover中的色系
        &.family-active {
          .family-item-content {
            .color-img-box {
              .color-img-border {
                border: 3px solid @theme-color;
              }
              .color-img {
                width: 90px;
                height: 90px;
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
                width: 90px;
                height: 90px;
                transform: translate3d(0, 0, 0);
              }
            }
          }
        }
        &.family-nearby-2 {
          .family-item-content {
            .color-img-box {
              .color-img {
                width: 82px;
                height: 82px;
                transform: translate3d(0, 0, 0);
              }
            }
          }
        }
      }
    }
  }

  .only-color-list-box {
    display: flex;
    justify-content: center;
    // margin-top: -16px;
    flex-wrap: wrap;
    padding-bottom: 20px;
  }
  .swiper-container {
    max-width: 1200px;
    padding: 0px 5px 20px;
    .slide-center {
      display: flex;
      justify-content: center;
    }
    .swiper-slide {
      width: 80px;
    }
    .swiper-button-next,
    .swiper-button-prev {
      background: none;
      font-size: 16px;
      margin-top: -28px;
    }
    .swiper-button-next {
      right: 0px;
    }
    .swiper-button-prev {
      left: 0px;
    }
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
    margin-right: 104px;
  }
}
@keyframes mRHideAni {
  0% {
    margin-right: 104px;
  }
  100% {
    margin-right: 0px;
  }
}
</style>
