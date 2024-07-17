<template>
  <div class="pre-sale-shipping-notice">
    <span class="notice">
      <az-icon icon-class="icon-gwc-_question_"></az-icon>
      <p v-track.view="{ common: { el: 'pretimex', ec: 'pretimex' } }" class="tips-box">
        <!-- <span class="tips-box-item">{{ nl('page_common_sod_preorder_text3') }}</span>
        <span class="tips-box-item">{{ nl('page_common_sod_preorder_text4') }}</span> -->
        <span class="tips-box-item">{{ nl('page_common_sod_preorder_text8') }}</span>
      </p>
    </span>
  </div>
</template>

<script>
export default {
  name: 'PreSaleShippingNotice',
  languageKeys: ['page_common_sod_preorder_text3', 'page_common_sod_preorder_text4', 'page_common_sod_preorder_text8']
}
</script>

<style lang="less" scoped>
.pre-sale-shipping-notice {
  margin-left: 3px;
  .notice {
    position: relative;
    .tips-box {
      width: 388px;
      padding: 15px;
      position: absolute;
      left: 50%;
      top: 100%;
      transform: translate(-50%, 9px);
      display: none;
      background-color: #fff;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
      box-sizing: border-box;
      z-index: @z-index;
      .tips-box-item:last-child {
        display: block;
        // margin-top: 10px;
      }
      &:hover {
        display: block;
      }
      &::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        right: 50%;
        transform: translateX(-50%) rotate(45deg);
        border-left: 12px solid #fff;
        border-top: 12px solid #fff;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
      }
      &::after {
        content: '';
        position: absolute;
        top: -3px;
        left: 50%;
        right: 50%;
        transform: translateX(-50%) rotate(45deg);
        border-left: 12px solid #fff;
        border-top: 12px solid #fff;
        box-shadow: 0 0 8px 0 #fff;
      }
    }
    &:hover {
      .tips-box {
        display: block;
      }
    }
  }
}
</style>
