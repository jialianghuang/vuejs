<template>
  <div class="cookie_disabled">
    <h2>{{ nl('page_cookie_disable_text1') }}</h2>
    <p>{{ nl('page_cookie_disable_text2') }}</p>
    <h3>{{ nl('page_cookie_disable_text3') }}</h3>
    <p>{{ nl('page_cookie_disable_text4') }}</p>
    <p>{{ nl('page_cookie_disable_text5') }}</p>
    <p>{{ nl('page_cookie_disable_text6') }}</p>
    <p>
      <strong>{{ nl('page_cookie_disable_text7') }}</strong>
    </p>
    <ul>
      <li>{{ nl('page_cookie_disable_text8') }}</li>
      <li>{{ nl('page_cookie_disable_text9') }}</li>
    </ul>
    <p>
      <strong>{{ nl('page_cookie_disable_text10') }}</strong>
    </p>
    <ul>
      <li>{{ nl('page_cookie_disable_text11') }}</li>
      <li>{{ nl('page_cookie_disable_text12') }}</li>
    </ul>
    <p>{{ nl('page_cookie_disable_text13') }}</p>
    <p>{{ nl('page_cookie_disable_text14') }}</p>
  </div>
</template>

<script>
export default {
  name: 'CookieDisabled'
}
</script>

<style lang="less" scoped>
.cookie_disabled {
  padding: 0 100px;
  color: @gray;
  h2,
  h3 {
    margin: 20px 0 5px;
    color: @gray-dark;
  }
  p,
  ul {
    margin-bottom: 10px;
  }
}
</style>
