<template>
  <div :class="{ 'bridal-copy-right': isBridal }" class="footer footer-wider footer-wider-goods">
    <div class="container">
      <span v-if="!isBridal" class="footer-logo">{{ APP_DOMAIN_LOWER }}</span>
      <p v-if="!isBridal" class="copyright">{{ nl('page_common_azazie_location') }}|{{ nl('page_common_copyright') }}</p>
      <p v-else class="copyright">{{ nl('page_common_copy_right_bridal') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzFooterCopyright',
  languageKeys: ['page_common_azazie_location', 'page_common_copyright', 'page_common_copy_right_bridal']
}
</script>

<style lang="less" scoped>
.footer {
  box-sizing: border-box;
  min-width: 768px;
  width: 100%;
  background: #272727;
  color: #ccc;
  line-height: 35px;
  height: 35px;
  text-align: right;
  text-transform: uppercase;
  white-space: nowrap;
  .container {
    display: flex;
    justify-content: space-between;
    max-width: 1600px;
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;
    // padding: 0 30px;
    overflow: hidden;
    .footer-logo {
      display: block;
      width: 137px;
      height: 29px;
      overflow: hidden;
      background: url(~assets/images/a_sprite_l_20190128.png?5761312) no-repeat -260px -233px;
      text-indent: 1000px;
    }
  }
  &.bridal-copy-right {
    background: @border-color!important;
    color: #666 !important;
    border-top: 1px solid @theme-color;
    padding: 0 20px;
    box-sizing: border-box;
    margin: auto;
    .container {
      max-width: 1640px;
    }
  }
}
</style>
