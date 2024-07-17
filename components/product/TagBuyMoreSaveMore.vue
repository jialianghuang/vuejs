<template>
  <div :class="{ bridal: isBridal }" class="tag-buy_more_save_more">
    <img v-if="bundlePromotionInfo.bundleIcon" :src="bundlePromotionInfo.bundleIcon" alt="bundle icon" />
    <span
      v-track.view="{
        common: getBiParams('buy_more_save_more', nameEl)
      }"
      >{{ bundlePromotionInfo.bundleName }}</span
    >
    <AzQuestionIcon
      v-if="bundlePromotionInfo.bundleDes"
      :popTips="bundlePromotionInfo.bundleDes"
      :el="descEl"
      :ec="'buy_more_save_more'"
      :questionClass="'icon-icon-question'"
    />
  </div>
</template>

<script>
/**
 * AZWEB-18459 Buy more save more tag
 */
import AzQuestionIcon from '@/components/az-ui/AzQuestionIcon'
export default {
  name: 'TagBuyMoreSaveMore',
  components: { AzQuestionIcon },
  props: {
    nameEl: {
      type: String,
      default: ''
    },
    descEl: {
      type: String,
      default: ''
    },
    bundlePromotionInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 问号icon的icon-class
    questionClass: {
      type: String,
      default: 'icon-gwc-_question_'
    }
  },
  data() {
    return {}
  },
  methods: {
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        ec,
        el
      }
      return obj
    }
  }
}
</script>
<style lang="less" scoped>
.tag-buy_more_save_more {
  font-size: 12px;
  height: 40px;
  background: var(--bg-color);
  color: @theme;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-family: @font-family-600;
  &.bridal {
    color: var(--color-121212);
  }
  img {
    height: 20px;
  }
  span {
    margin: 0 5px;
  }
  /deep/ .hover-tips {
    margin-left: 0;
  }
}
</style>
