<template>
  <div :class="{ selected }" @click="checkboxClick" class="filter-checkbox-box">
    <div :class="['checkbox-box', { 'radio-box': info.hasOwnProperty('multi') && !info.multi }]">
      <svg v-if="selected && info.multi" class="icon tick_white">
        <use xlink:href="#icon-lby_tick_white_s"></use>
      </svg>
      <span v-else class="inner-dot"></span>
    </div>
    <span v-if="info.key === 'barbie_azazie'" class="filter-option-title">
      Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE
    </span>
    <span v-else class="filter-option-title">{{ nl(info.name) }}</span>
  </div>
</template>

<script>
export default {
  name: 'FilterCheckbox',
  props: {
    info: {
      type: Object,
      default() {
        return {
          key: '',
          name: '',
          number: 0
        }
      }
    },
    selected: {
      type: Boolean,
      default: false
    },
    hasNumber: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // showZero({ info, $store }) {
    //   // jira:14872 要求首次进入没有筛选项的时候为零的选项不展示
    //   const { number, showNumber } = info
    //   const { apiFilters = {} } = $store.state.list
    //   if (showNumber) {
    //     return true
    //   }
    //   if (info.parentKey && info.parentKey.includes('price')) {
    //     return true
    //   }
    //   if (info.parentKey && info.parentKey == 'size') {
    //     return true
    //   }
    //   return !(Object.keys(apiFilters).length == 0 && number == 0)
    // }
  },
  methods: {
    checkboxClick() {
      if (!this.hasNumber || (this.hasNumber && this.info.number)) {
        this.$emit('click', this.selected)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.filter-checkbox-box {
  // margin-top: 10px;
  cursor: pointer;
  display: grid;
  align-items: center;
  grid-template-columns: 12px 1fr;
  column-gap: 10px;
  &.no_total {
    cursor: default;
  }
  .checkbox-box {
    box-sizing: border-box;
    width: 12px;
    height: 12px;
    border: 1px solid #999;
    align-self: start;
    align-self: flex-start;
    transform: translateY(4px);
    svg.icon {
      margin: 1px 0 0 1px;
      color: #fff;
      font-size: 10px;
      width: 9px;
      height: 9px;
      vertical-align: top;
      fill: currentColor;
    }
    &.radio-box {
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      .inner-dot {
        width: 8px;
        height: 8px;
        background-color: #666;
        border-radius: 50px;
        display: none;
      }
    }
  }
  .filter-option-title {
    display: block;
    line-height: 18px;
    color: #666;
    .barbie-heart {
      fill: #de1c85;
      transform: scale(0.5);
    }
  }
  &.selected {
    .checkbox-box {
      background: #666;
    }
    .radio-box {
      background-color: #fff;
      .inner-dot {
        display: block;
      }
    }
  }
  &.no_total {
    .checkbox-box {
      border: 0;
      svg.no-total {
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin: 0;
        fill: currentColor;
        overflow: hidden;
      }
    }
    .filter-option-title {
      color: #ccc;
    }
  }
  &:hover {
    .filter-option-title {
      color: @theme-color;
    }
  }
}
</style>
