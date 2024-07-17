<template>
  <div class="az-rate-box">
    <div
      v-for="item in total"
      :key="item"
      @mousemove="setCurrentValue(item)"
      @mouseleave="resetCurrentValue"
      @click="selectValue(item)"
      :style="{ margin: space, fontSize }"
      class="rate-item"
    >
      <az-icon
        :icon-class="getSvgIcon(item)"
        :style="{ 'font-size': fontStarSize || 'inherit', fill: isBridal ? 'var(--color-121212)' : 'var(--color-121212)' }"
      />
    </div>
    <div v-if="rateText" :style="{ fontSize, ...textStyle }" class="rate-text">{{ rateText }}</div>
  </div>
</template>

<script>
import azIcon from './../AzIcon'
export default {
  name: 'AzRate',
  languageKeys: [['page_review_poor', 'page_review_fair', 'page_review_average', 'page_review_good', 'page_review_excellent']],
  components: {
    azIcon
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 5
    },
    readonly: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    fontStarSize: {
      type: String,
      default: ''
    },
    space: {
      type: String,
      default: '0 3px 0 0'
    },
    showScore: {
      type: Boolean,
      default: false
    },
    scoreText: {
      type: Number,
      default: 0
    },
    showText: {
      type: Boolean,
      default: false
    },
    texts: {
      type: Array,
      default() {
        return ['page_review_poor', 'page_review_fair', 'page_review_average', 'page_review_good', 'page_review_excellent']
      }
    },
    textStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentValue: this.value,
      hoverIndex: -1
    }
  },
  computed: {
    isFloatNumber() {
      return this.currentValue !== Math.floor(this.currentValue)
    },
    rateText() {
      return this.showScore
        ? this.scoreText
          ? this.scoreText
          : this.currentValue
        : this.showText
        ? this.nl(this.texts[this.isFloatNumber ? Math.floor(this.currentValue) : this.currentValue - 1])
        : ''
    }
  },
  methods: {
    getSvgIcon(index) {
      if (this.isFloatNumber) {
        if (index <= Math.floor(this.currentValue)) {
          return 'icon-star-solid'
        } else if (index > Math.floor(this.currentValue) && index <= Math.ceil(this.currentValue)) {
          return 'icon-star-half-hollow'
        } else {
          return 'icon-star-hollow'
        }
      } else if (index <= this.currentValue) {
        return 'icon-star-solid'
      } else {
        return 'icon-star-hollow'
      }
    },
    selectValue(index) {
      if (this.readonly) return
      this.currentValue = this.hoverIndex = index
      this.$emit('change', index)
    },
    setCurrentValue(index) {
      if (this.readonly) return
      this.currentValue = this.hoverIndex = index
    },
    resetCurrentValue() {
      if (this.readonly) return
      this.currentValue = this.value
      this.hoverIndex = -1
    }
  }
}
</script>

<style lang="less" scoped>
.az-rate-box {
  display: inline-block;
  .rate-item {
    display: inline;
    cursor: pointer;
  }
  .rate-text {
    display: inline;
    vertical-align: middle;
  }
}
</style>
