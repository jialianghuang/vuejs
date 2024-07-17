<template>
  <div :style="{ left: tipsLeft }" class="check-tips">
    <div v-for="(tip, key) in tips" :key="key">
      <div class="tip-title">
        <az-icon :icon-class="isBridal ? 'icon-xxy_prompt_bridal' : 'icon-xxy_prompt_red'"></az-icon>
        <span class="tip-text">{{ tip.title }}</span>
      </div>
      <ul class="tips">
        <li v-for="(item, i) in tip.items" :key="i" class="tip-item">
          <span class="item">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckTips',
  props: {
    tips: {
      type: Array,
      default: () => {
        return []
      }
    },
    tipsLeft: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.check-tips {
  min-width: 111px;
  position: absolute;
  padding: 10px 10px 6px;
  background: @theme-color;
  border: 1px solid @theme-color;
  border-radius: 3px;
  color: var(--color-ffffff);
  top: 60px;
  left: 0;
  z-index: @z-index-2;
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 6px;
    top: -8px;
    border-right: 8px solid transparent;
    border-bottom: 8px solid @theme-color;
    border-left: 8px solid transparent;
  }
  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 6px;
    top: -7px;
    border-left: 8px solid transparent;
    border-bottom: 8px solid var(--color-121212);
    border-right: 8px solid transparent;
  }

  .tip-title {
    display: flex;
    .az-icon {
      flex-shrink: 0;
      font-size: 16px;
      margin-right: 3px;
    }
    .tip-text {
      font-family: @font-family-600, sans-serif;
    }
  }
  .tips {
    white-space: nowrap;
    position: relative;
    .tip-item {
      padding-left: 27px;
      position: relative;
      .item::before {
        position: absolute;
        left: 20px;
        top: -2px;
        content: '.';
        display: inline-block;
        margin-right: 9px;
        vertical-align: top;
        font: bold 14px Arial, sans-serif;
      }
    }
  }
}
</style>
