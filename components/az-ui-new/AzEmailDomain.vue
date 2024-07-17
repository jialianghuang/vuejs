<template>
  <div v-if="show && originEmail && !!getData.length && emailDomainShow" class="az-email-domain-box">
    <p class="az-domain-title">{{ nl('page_login_select_email_type') }}</p>
    <!-- <p @click="clickOriginEmail" class="az-email-domain-box-item">{{ originEmail }}</p> -->
    <p v-for="(item, index) in getData" :key="index" @click="$emit('domain-handler', item)" class="az-email-domain-box-item">{{ item }}</p>
  </div>
</template>

<script lang="js">
import emailDomainJs from '@/assets/js/emailDomain'
export default {
  name: 'AzEmailDomain',
  languageKeys: ['page_login_select_email_type'],
  mixins: [emailDomainJs]
}
</script>

<style lang="less" scoped>
.az-email-domain-box {
  position: absolute;
  top: calc(100% + 1px);
  max-height: 284px;
  background: var(--color-ffffff);
  width: 100%;
  margin: 0 auto;
  border: 1px solid @border-color;
  box-sizing: border-box;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.35);
  overflow-y: scroll;
  text-align: left;
  font-size: 13px;
  z-index: @z-index-6;
  .az-domain-title {
    padding: 0 10px;
    font-family: @font-family-600, sans-serif;
    line-height: 40px;
  }
  &-item {
    padding: 0 10px;
    font-family: @font-family-500, sans-serif;
    line-height: 40px;
    cursor: pointer;
    &:hover {
      background-color: @shadow-color;
    }
  }
}
</style>
