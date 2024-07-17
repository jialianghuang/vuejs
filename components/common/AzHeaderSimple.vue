<template>
  <div class="header-widgets clearfix">
    <div class="header-logo">
      <span class="logo">
        {{ APP_DOMAIN_LOWER }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzHeaderSimple'
}
</script>

<style lang="less" scoped>
.header-widgets {
  box-sizing: border-box;
  min-width: 1263px;
  max-width: 1353px;
  width: 100%;
  padding: 0 30px;
  margin: 60px auto 0;
  .header-logo {
    display: flex;
    justify-content: center;
    margin: 0;
    .logo {
      display: block;
      width: 245px;
      height: 32px;
      line-height: 32px;
      overflow: hidden;
      background: url(~assets/images/a_sprite_l_20190128.png?5834596) no-repeat 0 -192px;
      text-indent: -1000px;
    }
  }
}
</style>
