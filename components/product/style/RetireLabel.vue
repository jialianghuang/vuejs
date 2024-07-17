<template>
  <div class="retire-label">
    <div class="title">
      <span>{{ nl('page_goods_color_will_retire') }} {{ nl('page_common_on') }} {{ retireInfo.retireColor.retireDate }}!</span>
      (<a
        :href="getSupportUrl(`/articles/205019529-What-happens-when-a-dress-retires-`, `/articles/8076751`)"
        target="_blank"
        class="delay-why"
        >{{ nl('page_common_why') }}?</a
      >)
    </div>
    <div class="delay-time">
      <span class="triangle"></span>
      <div class="text">
        <az-icon icon-class="time-icon"></az-icon>
        <span>{{ retireInfo.retireColor.leftTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RetireLabel',
  languageKeys: ['page_goods_color_will_retire', 'page_common_on', 'page_common_why'],
  props: {
    retireInfo: {
      type: Object,
      default: () => {
        return {
          retireColor: {}
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.retire-label {
  margin-top: 10px;
  .delay-why {
    text-decoration: underline;
    cursor: pointer;
    font-family: @font-family-600, sans-serif;
    color: var(--color-121212);
    &:hover {
      color: @theme-color;
    }
  }
  .delay-time {
    display: flex;
    align-items: center;
    color: @theme-color;
    padding: 10px 0;
    line-height: 16px;
    .triangle {
      width: 0;
      height: 0;
      border-right: 8px solid @bg-color;
      border-top: 13px solid transparent;
      border-bottom: 13px solid transparent;
    }
    .az-icon {
      fill: currentColor;
      font-size: 16px;
      margin-right: 5px;
      vertical-align: bottom;
    }
    .text {
      background-color: @bg-color;
      height: 16px;
      padding: 5px 7px;
      font-family: @font-family-600, sans-serif;
    }
  }
}
</style>
