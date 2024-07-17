<template>
  <div :class="'cat-' + catId" class="style-color clearfix">
    <div class="nav">
      <div class="ul">
        <div
          v-for="item in filterColor"
          :key="item.key"
          v-track.view="{ common: getBiParamsWithItem(item) }"
          :class="classes(item)"
          @mouseover="resetPosition(item.key)"
          class="li"
        >
          <p v-track.view.click="getBiCommonParams('colorcircle', catBiName + '_colorcircle')">
            <a
              v-if="item.url"
              @click="colorClick(item)"
              :aria-label="item.name"
              class="filter_option_a_datalayer"
              tabindex="0"
              role="button"
            >
              <em :style="getColorStyle(item.key)" :class="'color_type' + getColorType(item.key)">
                <az-icon
                  v-if="getShow(item.showColorTag) && !item.selected"
                  :class="['icon-stock', { tag: getShow(item.showColorTag) }]"
                  :icon-class="'icon-show-color-tag' + getColorType(item.key)"
                ></az-icon>
                <az-icon
                  v-else-if="item.showExpeditedShippingTime && !item.selected"
                  :icon-class="'icon-a-7day' + getColorType(item.key)"
                  class="icon-stock"
                ></az-icon>
              </em>
              <span style="display: none;">{{ item.name }}</span>
            </a>
            <span v-else>
              <em :style="getColorStyle(item.key)" :class="'color_type' + getColorType(item.key)">
                <az-icon
                  v-if="getShow(item.showColorTag)"
                  :class="['icon-stock', { tag: getShow(item.showColorTag) }]"
                  :icon-class="'icon-show-color-tag' + getColorType(item.key)"
                ></az-icon>
                <az-icon
                  v-else-if="item.showExpeditedShippingTime"
                  :icon-class="'icon-a-7day' + getColorType(item.key)"
                  class="icon-stock"
                ></az-icon>
              </em>
            </span>
          </p>
          <div :data-color-tip="item.name" :class="['text-tip new-text-tip', 'reset-hover-' + item.key]">
            <span>
              <a v-if="item.isNew" href="javascript:;" class="theme-color" role="text">{{ nl('page_common_new_capital') }}! </a
              >{{ item.name }}
              <a href="javascript:;" class="theme-color"> {{ item.showExpeditedShippingTime ? nl('page_ships_in_time') + '!' : '' }}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 该组件暂未使用
 */
import filtersMixins from '@/assets/js/filters'
import colorHex from '@/assets/js/colorHex'
export default {
  name: 'ColorFilter',
  mixins: [filtersMixins, colorHex],
  data() {
    return {}
  },
  computed: {
    filterColor() {
      return this.filters.color ? this.filters.color.values : this.filters.colors ? this.filters.colors.values : {}
    }
  },
  methods: {
    classes(color) {
      return color.selected ? `${color.key} cur selected` : color.key
    },
    getBiParamsWithItem(item) {
      return this.getfilterBiParams && this.getfilterBiParams(item, null, 'color')
    },
    colorClick(item) {
      this.clickFilterSetPoint && this.clickFilterSetPoint(item, null, 'color')
      const tempUrl = item.url + (this.$store.state.isBridal ? `${item.url.includes('?') ? '&' : '?'}subsite=bridal` : '')
      this.filterSelectOption('colors', item.key, tempUrl)
    },
    getShow(tag) {
      return !!(tag && tag == 1)
    },
    resetPosition(key) {
      const el = document.querySelector('.reset-hover-' + key)
      const domClientRect = el.getBoundingClientRect()
      const parentDom = document.querySelector('.style-color.clearfix')
      const ppppDomClientRect = parentDom && parentDom.getBoundingClientRect()
      if (!parentDom) return
      if (domClientRect.left <= ppppDomClientRect.left) {
        el.classList.add('left')
      }
      if (domClientRect.right >= ppppDomClientRect.right) {
        el.classList.add('right')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.theme-color {
  color: @theme;
}
.clearfix:after {
  content: '';
  clear: both;
  width: 0;
  height: 0;
  visibility: hidden;
  display: block;
}
.style-color {
  margin-top: 10px;
  margin-bottom: 27px;
  position: relative;
  z-index: 2;

  .ul {
    // margin-left: 1px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 28px);
    grid-template-rows: 28px;
    gap: 10px 5px;
    align-items: center;
  }

  .cur em:before {
    display: block;
  }

  .cur .text-tip {
    display: none;
  }

  .li {
    width: 28px;
    height: 28px;
    text-align: center;
    position: relative;
    z-index: 0;
    border-bottom: 1px solid #eee;
    border-radius: 50%;
    background-color: inherit;
    box-shadow: none;
    cursor: pointer;
    .text-tip {
      display: block !important;
      visibility: hidden;
    }
    &:hover {
      z-index: 1;
      .text-tip {
        // display: block;
        visibility: visible;
        &.left {
          left: 0 !important;
          transform: unset !important;
          span::before {
            left: 14px !important;
          }
        }
        &.right {
          left: unset !important;
          right: 0 !important;
          transform: unset !important;
          span::before {
            left: unset !important;
            right: 14px !important;
          }
        }
      }
    }
  }

  em {
    background-image: url(~assets/images/a_sprite_color_20190306.png?5770949);
    background-repeat: no-repeat;
    display: inline-block;
    width: 27px;
    height: 27px;
    .scale(0.85);
    transition: all 0.2s ease;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
    .icon-stock {
      position: absolute;
      fill: currentColor;
      color: #fff;
      left: 0;
      right: 0;
      margin: auto;
      top: 5px;
      font-size: 16px;
      &.tag {
        left: 5px;
        top: 8px;
      }
    }
  }
  a:hover em {
    .scale(1);
  }
  .all_colors {
    .text-tip {
      left: -146px;
    }
  }
  em:before {
    background-image: url(~assets/images/a_sprite_l_20190128.png?5770949);
    background-repeat: no-repeat;
    content: '';
    position: absolute;
    display: none;
    width: 11px;
    height: 9px;
    top: 9px;
    left: 9px;
    background-position: -117px 0;
  }
  em.color_type0:before {
    background-position: -138px 0;
  }
}
</style>
