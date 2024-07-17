<template>
  <div @click="click" :class="{ all_color: info.key === 'back_to_all_color' }" class="color-item-box">
    <span
      :class="[info.key, 'color_type' + getColorType(info.key)]"
      :style="[
        {
          background: info.key === 'back_to_all_color' ? `url(${info.imageUrl || defaultAllImg}) center no-repeat` : ''
        },
        getColorStyle(info.key, null, null, null, info)
      ]"
      class="color-filter"
    >
      <az-icon
        v-if="getShow(info.showColorTag) && !selected"
        :class="['icon-stock', 'tag', { tag: getShow(info.showColorTag) }]"
        :icon-class="'icon-show-color-tag' + getColorType(info.key)"
      ></az-icon>
      <az-icon
        v-else-if="info.showExpeditedShippingTime && !selected"
        :icon-class="'icon-a-7day' + getColorType(info.key)"
        class="icon-stock"
      ></az-icon>
      <svg v-if="selected" class="icon tick_white">
        <use xlink:href="#icon-lby_tick_white_s"></use>
      </svg>
    </span>
    <span class="text">
      <a v-if="info.isNew" href="javascript:;" class="theme-color" role="text">{{ nl('page_common_new_capital') }}! </a>
      {{ info.name }}
    </span>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'
export default {
  name: 'FilterDressesColorItem',
  mixins: [colorHex],
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultAllImg: require('../../../assets/images/brides_color_filter/all-color.png?5850711')
    }
  },
  methods: {
    click() {
      this.$emit('click', this.selected)
    },
    getShow(tag) {
      return !!(tag && tag == 1)
    }
  }
}
</script>

<style lang="less" scoped>
.theme-color {
  color: @theme-color;
}
.color-item-box {
  display: grid;
  grid-template-columns: 30px 1fr;
  column-gap: 7px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  .color-filter {
    width: 24px;
    height: 24px;
    margin: 3px;
    display: inline-block;
    border-radius: 50%;
    transition: all 0.2s ease 0s;
    position: relative;
    .tick_white,
    .icon-stock {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 10px;
      margin: auto;
      color: #fff;
      fill: currentColor;
    }
    &.sp_white,
    &.color_type0 {
      .tick_white {
        color: var(--color-121212);
      }
    }
    .icon-stock {
      width: 12px;
    }
  }
  .text {
    color: var(--color-121212);
    white-space: initial;
    line-height: 1.2;
    align-self: center;
  }
  &:hover {
    .color-filter {
      transform: scale(1.2);
    }
    .text {
      color: @theme-color;
    }
  }
  &.all_color {
    .back_to_all_color {
      background: url(~assets/images/brides_color_filter/all-color.png?5850711) center no-repeat;
      // margin-top: 10px;
    }
    .text {
      color: @theme-color;
      text-decoration: underline;
    }
  }
}
</style>
