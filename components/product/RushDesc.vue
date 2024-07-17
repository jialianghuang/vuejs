<template>
  <div class="rush-desc">
    <span class="rush-desc-title">
      {{ nl(title) }}
      <div class="after icon">
        <az-icon icon-class="icon-gwc-_question_" class="icon-question" />&nbsp;
        <div class="introduce-hover-content free-return-intro-pop">
          <p>
            {{ nl('page_rush_desc_tips_text1') }}
            <a
              :href="getSupportUrl('/articles/205019699-What-if-I-want-my-order-sooner-' + countryLinkSource, `/articles/8153075`)"
              target="_blank"
              class="a-click"
              >{{ nl('page_rush_desc_tips_text2') }}</a
            >
          </p>
        </div>
      </div>
    </span>
  </div>
</template>

<script>
export default {
  name: 'RushDesc',
  languageKeys: ['page_rush_desc_tips_text1', 'page_rush_desc_tips_text2', 'page_rush_desc_rush_production_available'],
  props: {
    title: {
      type: String,
      default: 'page_rush_desc_rush_production_available'
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.rush-desc {
  font-size: 13px;
  display: flex;
  color: var(--color-121212);
  .icon {
    display: inline;
    position: relative;
    cursor: pointer;
    .icon-question {
      border-radius: 50%;
      &:hover + .introduce-hover-content {
        display: block;
      }
    }
  }
  .rush-desc-title {
    padding-right: 5px;
    // text-transform: uppercase;
  }
  .a-click {
    text-decoration: underline;
    color: var(--color-121212);
  }
  .introduce-hover-content {
    display: none;
    position: absolute;
    z-index: 2;
    font-weight: initial;
    background: #fff;
    border: 1px solid var(--color-cccccc);
    border-radius: 3px;
    margin-top: 2px;
    text-transform: initial;
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
    &:hover {
      display: block;
    }
  }
}
</style>
