<template>
  <div class="rush-desc">
    <span class="rush-desc-title">{{ title }}</span>
    <div @mouseenter="handleFreeReturnIntro(true)" @mouseleave="handleFreeReturnIntro(false)" class="after icon">
      <az-icon icon-class="icon-gwc-_question_" class="icon-question" />
      <div
        v-if="popupFreeReturnTipShow"
        @mouseenter="handleFreeReturnIntro(true)"
        @mouseleave="handleFreeReturnIntro(false)"
        class="introduce-hover-content free-return-intro-pop"
      >
        <p>
          {{ nl('page_rush_desc_tips_text1') }}
          <a :href="countryUrl(hrefUrl)" target="_blank" class="a-click">{{ nl('page_rush_desc_tips_text2') }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RushDesc',
  languageKeys: ['page_rush_desc_tips_text1', 'page_rush_desc_tips_text2'],
  props: {
    title: {
      type: String,
      default: 'Rush production available'
    }
  },
  data() {
    return {
      popupFreeReturnTipShow: false,
      hrefUrl: ''
    }
  },
  created() {
    this.hrefUrl = this.getSupportUrl(`/articles/205019699-What-if-I-want-my-order-sooner-`, `/articles/8153075`)
  },
  methods: {
    handleFreeReturnIntro(value) {
      this.popupFreeReturnTipShow = value
    }
  }
}
</script>

<style lang="less" scoped>
.rush-desc {
  font-size: 13px;
  display: flex;
  color: var(--color-121212);
  // position: relative;
  .icon {
    position: relative;
    cursor: pointer;
    .icon-question {
      border-radius: 50%;
    }
  }
  .rush-desc-title {
    padding-right: 5px;
  }
  .a-click {
    text-decoration: underline;
    color: var(--color-121212);
  }
  .introduce-hover-content {
    position: absolute;
    z-index: 1;
    font-weight: initial;
    background: #fff;
    border: 1px solid var(--color-cccccc);
    border-radius: 3px;
    margin-top: 2px;
    &:before {
      content: '';
      width: 0;
      height: 0;
      border-right: 6px solid transparent;
      border-bottom: 6px solid var(--color-cccccc);
      border-left: 6px solid transparent;
      position: absolute;
      top: 0%;
      left: 48.4%;
      margin-top: -7px;
    }
    &:after {
      cursor: pointer;
      content: '';
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #ffffff;
      position: absolute;
      top: 0%;
      left: 48.4%;
      margin-top: -11px;
    }
    &.free-return-intro-pop {
      width: 236px;
      padding: 10px;
      left: 40px;
      top: 24px;
      left: -125px;
    }
  }
}
</style>
