<template>
  <div v-if="judgeSticker('time_limited')" class="az-limited-box">
    <p class="limited-time-box">{{ nl('page_limited_time_tag') }}<span class="after"></span></p>
  </div>
</template>

<script>
export default {
  name: 'AzLimitedTime',
  languageKeys: ['page_limited_time_tag'],
  props: {
    showLimitedTimeTag: {
      type: Boolean,
      default() {
        return false
      }
    },
    stickers: {
      type: Array,
      default() {
        return []
      }
    },
    goodsId: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  methods: {
    // 判断sticker标识
    judgeSticker(type) {
      if (!this.showLimitedTimeTag || !this.stickers || !this.stickers.length) return
      return this.stickers.find((sticker) => sticker.name === type)
    }
  }
}
</script>

<style lang="less" scoped>
.az-limited-box {
  display: inline-block;
  font-size: 0;
  // margin-top: 5px;
}
.limited-time-box {
  min-width: 82px;
  height: 22px;
  line-height: 20px;
  background: @btn-light-hover-color;
  font-size: 13px;
  color: @title-color;
  padding-left: 6px;
  margin: 0 8px 0 5px;
  position: relative;
  text-align: left;
  white-space: nowrap;
  .after {
    display: inline-block;
    // content: '';
    // z-index: 0;
    position: absolute;
    height: 22px;
    width: 8px;
    right: -7px;
    top: 0;
    background: @btn-light-hover-color;
    // background-image: url(~assets/images/common/rect_arrow.svg);
    // background-size: auto 100%;
    // background-repeat: no-repeat;
    // background-position: -7px 0;
    clip-path: polygon(100% 0%, 5% 50%, 100% 100%, 0 100%, 0% 50%, 0 0);
  }
}
</style>
