<template>
  <div :key="`color_${colorItem.key}_${colorIndex}`" :class="[{ 'color-active': colorItem.selected }]" class="color-item">
    <div class="color-item-content">
      <a
        v-if="colorItem.url"
        @click="colorClick(colorItem, familyItem)"
        :href="
          scene === 'home'
            ? countryUrl(colorItem.url + (isBridal ? `${colorItem.url.includes('?') ? '&' : '?'}subsite=bridal` : ''))
            : 'javascript:;'
        "
        :aria-label="colorItem.name"
        :role="scene === 'home' ? 'link' : 'button'"
        tabindex="0"
      >
        <img v-if="colorItem.imageUrl" :src="addWebpSuffix(colorItem.imageUrl)" :alt="colorItem.key" class="color-em" />
        <em
          v-else
          :style="getColorStyle(colorItem.key, null, true, null, colorItem)"
          :class="'color_type' + getColorType(colorItem.key)"
          class="color-em"
        >
          <az-icon
            v-if="getShow(colorItem.showColorTag) && !colorItem.selected"
            :class="['icon-stock', { tag: getShow(colorItem.showColorTag) }]"
            :icon-class="'icon-show-color-tag' + getColorType(colorItem.key)"
          ></az-icon>
          <az-icon
            v-else-if="colorItem.showExpeditedShippingTime && !colorItem.selected"
            :icon-class="'icon-a-7day' + getColorType(colorItem.key)"
            class="icon-stock"
          ></az-icon>
          <az-icon icon-class="icon-lby_tick_white_s" class="active-icon" />
        </em>
      </a>
      <span v-else>
        <em
          :style="getColorStyle(colorItem.key, null, true, null, colorItem)"
          :class="'color_type' + getColorType(colorItem.key)"
          class="color-em"
        >
          <az-icon
            v-if="getShow(colorItem.showColorTag)"
            :class="['icon-stock', { tag: getShow(colorItem.showColorTag) }]"
            :icon-class="'icon-show-color-tag' + getColorType(colorItem.key)"
          ></az-icon>
          <az-icon
            v-else-if="colorItem.showExpeditedShippingTime"
            :icon-class="'icon-a-7day' + getColorType(colorItem.key)"
            class="icon-stock"
          ></az-icon>
          <az-icon icon-class="icon-lby_tick_white_s" class="active-icon" />
        </em>
      </span>
    </div>

    <div class="color-item-name">
      <span v-if="colorItem.isNew" class="theme-color">{{ nl('page_common_new_capital') }}! </span
      ><span class="text-ca">{{ formartName(colorItem.name) }}</span>
      <!-- <a class="theme-color"> {{ colorItem.showExpeditedShippingTime ? nl('page_ships_in_time') + '!' : '' }}</a> -->
    </div>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'
export default {
  name: 'FilterColorItem',
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
    // 本组件出现被使用的场景
    scene: {
      type: String,
      default: ''
    }
  },
  methods: {
    formartName(name) {
      return name ? name.toLowerCase() : ''
    },
    getShow(tag) {
      return !!(tag && tag == 1)
    },
    colorClick(colorItem, familyItem) {
      this.$emit('colorClick', {
        colorItem,
        familyItem
      })
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
  // margin-top: 16px;
  margin: 16px 2.5px 0;
  z-index: 1;
  .color-item-content {
    box-sizing: border-box;
    border-radius: 13px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 6px;
    a {
      display: flex;
    }
  }
  .color-item-name {
    // font-size: 10px;
    color: var(--color-121212);
    font-size: 12px;
    // transform: scale(0.84);
    // width: 120%;
    line-height: 16px;
    margin-bottom: -3px;
    text-transform: capitalize;
    word-break: break-word;
    margin-left: -1px;
    margin-right: -1px;
  }
  &:hover,
  &.color-active {
    z-index: 1;
    .color-item-content {
      width: 40px;
      height: 40px;
      border: 2px solid @theme-color;
      .active-icon {
        display: block;
      }
    }
  }
  &:hover {
    .color-item-content {
      .active-icon {
        display: none;
      }
    }
    .color-item-name {
      color: @theme-color;
    }
  }
  &.color-active:hover {
    .color-item-content {
      .active-icon {
        display: block !important;
      }
    }
  }
  .color-em {
    // background-image: url(~assets/images/a_sprite_color_20190306.png?5770949);
    // background-repeat: no-repeat;
    display: inline-block;
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 10px;
    position: relative;
    box-shadow: 0px 0px 5.55768px var(--color-eeeeee);
    .icon-stock {
      position: absolute;
      fill: currentColor;
      color: #fff;
      font-size: 16px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      &.tag {
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
    display: none;
  }
  em.color_type0 {
    .active-icon {
      fill: currentColor;
      color: #666;
    }
  }
}
</style>
