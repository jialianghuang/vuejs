<template>
  <div v-if="['US', 'CA', 'AU', 'IE', 'GB'].includes(country) && show" class="excitation-view">
    <div class="excitation-view-container">
      <div v-if="sticker[0] && currentIndex == 0" class="excitation-view-wrapper">
        <p class="excitation-view-title">
          <az-icon :icon-class="sticker[0].icon" :class="sticker[0].className"></az-icon>
          <span>{{ sticker[0].title }}</span>
        </p>
        <p class="excitation-view-description">
          <span>{{ sticker[0].description }}</span>
        </p>
      </div>
      <div v-if="sticker[1] && currentIndex == 1" class="excitation-view-wrapper second">
        <p class="excitation-view-title">
          <az-icon :icon-class="sticker[1].icon" :class="sticker[1].className"></az-icon>
          <span>{{ sticker[1].title }}</span>
        </p>
        <p class="excitation-view-description">
          <span>{{ sticker[1].description }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExcitationView',
  languageKeys: [],
  props: {
    sticker: {
      type: [Object, Array],
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      show: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.show = true
    }, 1000)
    setTimeout(() => {
      this.currentIndex = 1
    }, 3000)
    setTimeout(() => {
      this.currentIndex = 2
    }, 5000)
    setTimeout(() => {
      this.show = false
    }, 6000)
  }
}
</script>

<style lang="less" scoped>
.excitation-view {
  width: 90%;
  max-width: 384px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: @z-index;
  overflow: hidden;
  &-container {
    position: relative;
    width: 100%;
    height: 70px;
  }
  &-wrapper {
    opacity: 0.9;
    background-color: @bg-color;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px 0;
    text-transform: uppercase;
    color: var(--color-121212);
    transition: all 1s ease;
    animation: fadeInOut 1s ease;
    &.second {
      transition: all 2s ease;
      animation: fadeInOut 2s ease;
    }
  }
  &-title {
    font-family: @font-family-600;
    font-size: 16px;
    letter-spacing: 1.12px;
    // margin-bottom: 8px;
    .eye,
    .bag,
    .shop {
      width: 20px;
      height: 12px;
      vertical-align: baseline;
    }
    .bag {
      width: 13px;
      height: 15px;
    }
    .shop {
      width: 17px;
      height: 16px;
      vertical-align: middle;
    }
  }
  &-description {
    font-family: @font-family-500;
    font-size: 13px;
    letter-spacing: 0.91px;
  }
}
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.9;
  }
}
</style>
