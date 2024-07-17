<template>
  <div @click="click" @mouseover="resetPosition" class="filter-svg-item">
    <div :class="{ selected: selected }" class="filter-svg-icon">
      <az-icon :icon-class="getIconName(info, 'normal')" class="svg-icon normal"></az-icon>
      <az-icon :icon-class="getIconName(info, 'selected')" class="svg-icon hover"></az-icon>
      <az-icon :icon-class="getIconName(info, 'selected')" class="svg-icon selected"></az-icon>
      <az-icon :icon-class="getIconName(info, 'disabled')" class="svg-icon disabled"></az-icon>
      <div v-if="selected" class="selected-icon-box">
        <svg class="icon selected-icon">
          <use xlink:href="#icon-lby_tick_white_s"></use>
        </svg>
      </div>
      <div :class="['svg-text-tip', 'reset-hover-' + hoverClass]">
        <span>{{ info.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import AzIcon from '@/components/az-ui/AzIcon'
export default {
  name: 'FilterSvgIcon',
  components: {
    AzIcon
  },
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    hoverClass() {
      // 会存在key中存在/的情况
      return this.info.key.replace(/\//g, '-')
    }
  },
  methods: {
    click() {
      this.$emit('click', this.selected)
    },
    getKeyValue(value) {
      return value.replace(/(_&_)|(_|\/)+?/g, '-')
    },
    getIconName(info, type) {
      // todo: 这里的parentValue 其实就是父级的key，因为真正的value有多语言被翻译了
      return `icon${this.getKeyValue(info.parentValue)}-${this.getKeyValue(info.key)}-${type}${
        this.isBridal && type === 'hover' ? '-bridal' : ''
      }`
    },
    resetPosition() {
      const el = document.querySelector('.reset-hover-' + this.hoverClass)
      const fEl = document.querySelector('#cat-left-scroll')
      el.classList.remove('left')
      el.classList.remove('right')
      const domClientRect = el && el.getBoundingClientRect()
      const fElClientRect = fEl && fEl.getBoundingClientRect()
      if (el && fEl) {
        if (domClientRect.left <= fElClientRect.left) {
          el.classList.add('left')
        } else if (domClientRect.right >= fElClientRect.right - 20) {
          el.classList.add('right')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.filter-svg-icon {
  position: relative;
  width: 55px;
  height: 55px;
  // margin: 8px 8px;
  cursor: pointer;
  cursor: pointer;
  .svg-icon {
    width: 55px;
    height: 55px;
    display: none;
    &.normal {
      display: block;
    }
    &.hover {
      path {
        fill: var(--color-121212);
      }
    }
  }
  &:hover {
    .svg-text-tip {
      // display: block;
      visibility: visible;
      z-index: @z-index-4;
    }
    .svg-icon {
      &.normal {
        display: none;
      }
      &.hover {
        display: block;
      }
    }
  }
  &.selected {
    .svg-icon {
      &.normal,
      &.hover {
        display: none;
      }
      &.selected {
        display: block;
      }
    }
  }
  &.disabled {
    cursor: default;
    .svg-icon {
      &.normal,
      &.hover,
      &.selected {
        display: none;
      }
      &.disabled {
        display: block;
      }
    }
  }
  .selected-icon-box {
    position: absolute;
    right: 8px;
    bottom: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #666;
    .selected-icon {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 7px;
      height: 7px;
      color: #fff;
      fill: currentColor;
    }
  }
  .svg-text-tip {
    // display: none;
    visibility: hidden;
    margin-top: 10px;
    position: absolute;
    top: 100%;
    left: 50%;
    z-index: -1;
    transform: translateX(-50%);
    text-align: center;
    &.left {
      left: 0;
      transform: translate(0);
      span::before {
        left: 19%;
      }
    }
    &.right {
      right: 0;
      left: unset;
      transform: translateX(40px);
      span::before {
        right: 0;
        left: unset;
        margin-right: 62px;
        margin-left: 0;
      }
    }
    span {
      display: inline-block;
      padding: 4px 10px;
      line-height: 1.5;
      font-family: @font-family-500, sans-serif;
      font-size: 13px;
      color: #666;
      text-transform: none;
      background: #fff;
      border: solid 1px #ccc;
      border-radius: 4px;
      white-space: nowrap;
      &:before {
        background: url(~assets/images/a_sprite_l_20190128.png) no-repeat -162px 0;
        content: '';
        position: absolute;
        display: inline-block;
        width: 13px;
        height: 8px;
        top: -7px;
        left: 50%;
        margin-left: -6px;
      }
    }
  }
}
</style>
