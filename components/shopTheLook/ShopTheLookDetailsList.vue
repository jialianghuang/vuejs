<template>
  <div v-show="visible" class="stl-details-list">
    <div class="stl-details-list-header">
      <div @click="clickClose" class="stl-details-list-title">
        <span>{{ title }}</span>
        <button aria-label="Close button" class="icon-button">
          <az-icon icon-class="icon-icon_style_gallery_off"></az-icon>
        </button>
      </div>
      <div ref="filterContent" v-show="filters.list_colors_family && filters.list_colors_family.values" class="stl-details-list-filter">
        <div @click="showFilters = !showFilters" class="filter-default">
          <span>{{ nl('page_common_colors') }}</span>
          <button class="icon-button">
            <az-icon :style="{ transform: showFilters ? 'rotate(180deg)' : '' }" icon-class="icon-lby_expand_arrow_down"></az-icon>
          </button>
        </div>
        <transition @before-enter="transitionInit" @enter="transitionEnter" @after-enter="transitionAfterEnter" @leave="transitionLeave">
          <div v-show="showFilters" :style="{ height: currentHeight }" class="filter-content">
            <color-family-filter
              ref="colorFamilyFilter"
              :colorsFamilyListObj="
                filters.list_colors_family && filters.list_colors_family.values && Object.keys(filters.list_colors_family.values).length
                  ? filters.list_colors_family.values
                  : {}
              "
              :valueFamilyKeyList="filters.list_colors_family ? filters.list_colors_family.valueFamilyKeyList : []"
              @onColorClick="handleColorClick"
              scene="shopTheLook"
            ></color-family-filter>
          </div>
        </transition>
      </div>
    </div>
    <van-list :finished="loadFinished" :immediate-check="false" :offset="200" @load="onLoad" class="van-clearfix">
      <div class="stl-details-list-content">
        <div @click="clickNone" :class="{ active: isNone }" class="list-item none">
          <div class="list-item-img">
            <az-icon :icon-class="iconClass"></az-icon>
          </div>
          <div class="list-item-info">
            <span class="name">{{ nl('page_common_none') }}</span>
          </div>
        </div>
        <div
          v-for="(item, index) in list"
          :key="index"
          @click.prevent="handleClick(item)"
          :class="{ active: selected && item.goodsId === selected.goodsId }"
          v-track.view.click="{
            common: [
              getBiParams('shopthelook', 'items', item),
              getBiParams('shopthelook', title + '_items', item),
              getBiParams('shopthelook', title + '_items' + (index + 1), item)
            ]
          }"
          class="list-item"
        >
          <button
            v-track.view.click="{ common: getBiParams('shopthelook', 'unselect') }"
            @click.stop="handleDelete(item)"
            class="icon-button"
          >
            <az-icon icon-class="icon-icon_style_gallery_off"></az-icon>
          </button>
          <div class="list-item-img">
            <img :src="addWebpSuffix(item.goodsThumb)" :alt="item.shownGoodsName" loading="lazy" />
          </div>
          <div class="list-item-info">
            <div>
              <span class="name">{{ item.shownGoodsName }}</span>
              <div class="price-box">
                <span :class="{ red: item.hasLinePrice }" class="goods-price">{{ item.shopPriceDisplay }}</span>
                <span v-if="item.hasLinePrice" class="no-deal-price">{{ item.noDealPriceDisplay }}</span>
                <exclusive-offer
                  v-if="item.showBundlePrice"
                  :price="item.bundlePrice"
                  :priceOff="item.bundlePriceOff"
                  question-position="under"
                  scene="shopthelookdetail"
                ></exclusive-offer>
              </div>
            </div>
            <az-button
              v-track.view.click="{ common: getBiParams('shopthelook', 'confirm') }"
              @click.native.stop="clickConfirm(item)"
              class="btn btn-theme"
            >
              <i class="icon-tick"></i>{{ nl('page_common_confirm') }}
            </az-button>
          </div>
        </div>
      </div>
      <template> <i></i><i></i><i></i><i></i><i></i> </template>
      <div slot="loading" class="load-more">
        <i class="loading-hint"></i>
        <span class="loading-txt">{{ nl('page_common_loading') }}</span>
      </div>
    </van-list>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import ColorFamilyFilter from '@/components/list/ColorFamilyFilter'
import ExclusiveOffer from '@/components/product/ExclusiveOffer'

/**
 * shop the look搭配商品具体列表接口
 * 选中后在shop the look页面搭配列表中展示
 */
export default {
  components: {
    AzButton,
    ColorFamilyFilter,
    ExclusiveOffer
  },
  props: {
    // 是否可用，显示
    visible: {
      type: Boolean,
      default: false
    },
    // 类型，bag, shoes等，现在传的是catId
    type: {
      type: [Number, String],
      default: ''
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 列表商品数据
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 列表筛选项
    filters: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    // 加载更多是否已经结束
    loadFinished: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isNone: false, // 是否点击none
      showFilters: false, // 是否展示筛选项
      viewed: false, // 筛选项是否已经看过
      selected: '', // 当前选中商品
      initHeight: 112, // 筛选区内容初始高度
      currentHeight: '' // 当前筛选项显示的高度
    }
  },
  computed: {
    iconClass() {
      let res = ''
      if (this.type === 3109) {
        res = 'icon-look-bag-disabled'
      } else if (this.type === 7) {
        res = 'icon-look-dress-disabled'
      } else if (this.type === 3076) {
        res = 'icon-look-jewelry-disabled'
      } else if (this.type === 3102) {
        res = 'icon-look-shoes-disabled'
      }
      return res
    }
  },
  watch: {
    visible(e) {
      if (e) {
        this.viewed = false
        this.isNone = false
        this.showFilters = false
        // this.$nextTick(() => {
        //   this.initHeight = this.$refs.filterContent.clientHeight
        // })
      }
    },
    filters() {
      this.$nextTick(() => {
        this.handleScaleFilter()
      })
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    getBiParams(ec, el, item) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      if (item) {
        obj.msg = JSON.stringify({
          goods_id: item.goodsId,
          cat_id: item.catId,
          cat_name: item.catName
        })
      }
      return obj
    },
    onLoad() {
      this.$emit('loadMore')
    },
    // 以下四个方法为交互动画设置
    // 交互初始阶段
    transitionInit(el) {
      el.style.height = '0px'
      el.style.overflow = 'hidden'
    },
    // 显示过程中
    transitionEnter(el) {
      if (!this.viewed) {
        this.handleScaleFilter()
        this.viewed = true
      }
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth
      el.style.height = this.currentHeight
      el.style.transition = 'all 0.3s'
    },
    // 已显示设置
    transitionAfterEnter(el) {
      el.style.overflow = 'initial'
    },
    // 交互离去设置
    transitionLeave(el) {
      el.style.height = '0px'
      el.style.overflow = 'hidden'
      el.style.transition = 'all 0.3s'
    },
    handleResize() {
      if (document.documentElement.clientWidth >= 1280) {
        this.handleScaleFilter()
      }
    },
    // 动态缩放颜色筛选区域大小
    handleScaleFilter() {
      if (this.filters.list_colors_family) {
        const colorsDom = this.$refs.colorFamilyFilter
        const filterContentDom = this.$refs.filterContent
        let ratio = 1
        const colorsFamilyLen = Object.keys(this.filters.list_colors_family.values).length
        ratio = filterContentDom.clientWidth / (colorsFamilyLen * 80)
        if (ratio >= 1) {
          ratio = 1
        } else {
          ratio = ratio - 0.07
        }
        this.currentHeight = this.initHeight * ratio + 'px'
        if (colorsDom.$el.children[0] && colorsDom.$el.children[0].children[0]) {
          colorsDom.$el.children[0].children[0].style.transform = `scale(${ratio})`
          colorsDom.$el.children[0].style.height = this.currentHeight
        }
      }
    },
    // 点击关闭
    clickClose() {
      this.showFilters = false
      this.$emit('update:visible', false)
      // this.$emit('onClose', { catId: this.type })
    },
    // 处理商品点击选中
    handleClick(e) {
      this.isNone = false
      this.selected = e
      this.$emit('itemChange', e)
    },
    // 点击取消选中商品选中状态
    handleDelete() {
      this.selected = ''
      // 传给父组件一个空imageInfo，左侧图片重置
      this.$emit('itemChange', { catId: this.type, imageInfo: null })
    },
    // 点击第一项none，清空选择
    clickNone() {
      this.selected = ''
      this.isNone = true
      this.$emit('clickNone', { catId: this.type, catName: this.title, imageInfo: null })
    },
    // 点击确认，将选中商品传给父组件，更新搭配商品列表
    clickConfirm(e) {
      this.handleClick(e)
      this.clickClose()
      // this.$emit('onConfirm', e)
    },
    // 颜色筛选点击
    handleColorClick(e) {
      this.$emit('onColorChange', e)
    }
  }
}
</script>
<style lang="less" scoped>
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@itemWidth: 11.72vw;
.stl-details-list {
  width: 47.656vw;
  min-width: 610px;
  &-header {
    background: var(--color-eeeeee);
    position: sticky;
    top: 0px;
    z-index: 2;
  }
  &-title,
  .filter-default {
    .flex-between();
    padding: 15px;
    font-size: 13px;
    line-height: 18px;
    text-transform: uppercase;
    background: #fff;
    font-family: @font-family-600;
    margin-bottom: 4px;
    cursor: pointer;
    .icon-button {
      width: 12px;
      height: 12px;
      padding: 0px;
      line-height: 12px;
      text-align: center;
      border: none;
      font-size: 12px;
      &:focus {
        background: none;
      }
      .az-icon {
        fill: var(--color-121212);
        transition: 0.3s;
      }
    }
  }
  &-filter {
    margin-bottom: 4px;
    .filter-default {
      margin-bottom: 0px;
    }
    .filter-content {
      width: 100%;
      background: #fff;
      transition: 0.3s;
      /deep/ .style-color-family .color-family-list-box {
        flex-wrap: nowrap;
        transform-origin: top;
      }
    }
  }
  &-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .list-item {
      // width: @itemWidth;
      width: 24.4%;
      height: calc(@itemWidth * 1.382 + 48px);
      // min-width: 150px;
      min-height: 255px;
      background: var(--color-f9f9f9);
      box-sizing: border-box;
      margin-bottom: 4px;
      padding-bottom: 48px;
      position: relative;
      cursor: pointer;
      transition: 0.15s;
      // margin-right: 0.24vw;
      margin-right: 0.8%;
      &:nth-of-type(4n) {
        margin-right: 0px;
      }
      &.null {
        opacity: 0;
      }
      &.active {
        height: calc(@itemWidth * 1.382 + 36px);
        border: 2px solid @theme;
        .icon-button,
        .btn {
          display: block;
        }
        &.none {
          .list-item-info {
            background: var(--color-f1e9e6);
            transition: 0.15s;
          }
        }
      }
      &:hover {
        height: calc(@itemWidth * 1.382 + 36px);
        border: 2px solid @theme;
        .list-item-info {
          background: var(--color-f1e9e6);
          transition: 0.15s;
        }
      }
      .icon-button {
        display: none;
        position: absolute;
        top: 0px;
        right: 0px;
        width: 24px;
        height: 24px;
        background: @theme;
        border: none;
        line-height: 0px;
        padding: 0px;
        &:focus {
          background: none;
        }
        .az-icon {
          width: 10px;
          height: 10px;
          fill: #fff;
        }
      }
      &-img {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-f9f9f9);
        width: 100%;
        height: calc(@itemWidth * 1.382);
        min-height: 207px;
        img {
          width: 100%;
          height: 100%;
        }
        .az-icon {
          width: 30px;
          height: 30px;
        }
      }
      &-info {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        min-height: 38px;
        padding: 5px 10px;
        background: #fff;
        font-size: 13px;
        line-height: 18px;
        .price-box {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-top: 5px;
          flex-wrap: wrap;
          .goods-price {
            font-size: 13px;
            display: inline-block;
            margin-right: 5px;
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
            margin-right: 5px;
          }
          /deep/ .exclusive-offer {
            margin-left: 0px;
          }
        }
        .price {
          color: #999;
          display: block;
          line-height: 20px;
        }
        .btn {
          display: none;
          height: 32px;
          width: 100%;
          margin-top: 15px;
          margin-bottom: 5px;
          font-size: 12px;
          line-height: 16px;
          text-transform: uppercase;
          .icon-tick {
            display: inline-block;
            width: 7px;
            height: 3px;
            border-left: 1px solid #fff;
            border-bottom: 1px solid #fff;
            transform: rotate(-45deg);
            margin-right: 6px;
            vertical-align: middle;
            margin-top: -3px;
          }
        }
      }
    }
  }
  /deep/ .van-list__loading {
    width: 100%;
    .load-more {
      text-align: center;
      padding: 20px 0;
      .loading-hint {
        display: inline-block;
        height: 20px;
        width: 20px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAP1BMVEUAAAD0KA/xJhHxJA7yJA7xJA7xJA7xJA7xJA7wJA7xJA7xJA7xJA7xJA7xJA7xJA3xJA7xJA7xJA7xJA7xJA5JCyllAAAAFXRSTlMACxdEI3NalDdn3LyvLstPoveIgOl7Sm+EAAABiklEQVRIx9XS0W7kIAxAUWyDwckAIfD/37owUyndbbMJrtSq92UeoiMbGHMWRqKciSKamSw5v23b462d7T0HVIc76NrbGK8h+153vgozi9u39ZW7wOSfSYB3pyY3JqdV4ByiG86FTw6xrSmlx+mZ4757X8PJPo/Uo5OPe4/MaTwGy6dfOvz/VeAY7OGjrPvOcHH9PqXFf9i21krmMrcsi/vnhg55bfPfr1Irm1v5bqM5ElcF7lFYl2WF46DOOTA3w/TuuNBlMLeTvjIeQ8XcD9LS9mOoNRPl1t7GBufYTLW29jotP4dOjk2mhyJi5oKltfG2UYTMZL4VN6aL2FnKpTzGjwjMUiyl9b1F2Ey3lILjlvI8XUshY5lpnm6l8KBhnvpSxETmOE/3UpySjo6Fv5UiMykp5JyNsk5BSUPOqL2nnKP2sERklHWq3pgoaDf+nWPVfwsK6rcNIVilxW7xB6wNMVqtjXqLnVrQWbAj+IJFHcanRQAlxhH0xiJza7/owIrpMOBrsK4L9wckTA/GBoy0fQAAAABJRU5ErkJggg==)
          no-repeat 0 0;
        background-size: 100% 100%;
        animation: rotate 1s infinite;
      }
      .loading-txt {
        padding-left: 12px;
        font-size: 16px;
        color: var(--color-121212);
        line-height: 20px;
        display: inline-block;
      }
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }
}
</style>
