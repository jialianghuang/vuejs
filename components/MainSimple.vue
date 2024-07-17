<template>
  <div class="main-simple-box">
    <div class="header">
      <top-notification :notification="navigation.notification"></top-notification>
      <az-header-simple></az-header-simple>
    </div>
    <slot></slot>
    <az-footer-copyright></az-footer-copyright>
  </div>
</template>

<script>
/** 该组件未使用 */
import topNotification from './common/TopNotification'
import AzHeaderSimple from './common/AzHeaderSimple'
import AzFooterCopyright from './common/AzFooterCopyright'

export default {
  name: 'MainSimple',
  components: {
    topNotification,
    AzHeaderSimple,
    AzFooterCopyright
  },
  props: {}
}
</script>

<style lang="less" scoped></style>
