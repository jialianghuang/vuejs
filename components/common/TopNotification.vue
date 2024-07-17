<template>
  <div
    id="top-notification"
    v-if="showTopNotification && notification.html"
    :style="backgroundColor"
    style="border-bottom:1px solid var(--color-cccccc)"
  >
    <div v-html="notification.html" class="text"></div>
    <span @click="closeTopNotification()" :style="closeBtnColor" tabindex="0" role="button" class="close">x</span>
  </div>
</template>

<script>
export default {
  name: 'TopNotification',
  props: {
    notification: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      noTop: 0
    }
  },
  computed: {
    showTopNotification() {
      let show = false
      if (typeof this.notification.cookie == 'string' && this.notification.cookie) {
        show = this.noTop != 1
      }
      return show
    },
    backgroundColor() {
      const topNotifbgColor = this.notification.backgroundColor
      const bgColor = typeof topNotifbgColor == 'string' && topNotifbgColor != '' ? topNotifbgColor : 'var(--color-f1e9e6)'
      return {
        'background-color': bgColor
      }
    },
    closeBtnColor() {
      const pos = this.notification.html.search(/[^-]color/)
      let color = this.notification.html.substring(pos + 8, pos + 15)
      const reg = /^#[0-9A-F]{6}$/i
      if (!reg.test(color)) color = 'var(--color-121212)'
      return {
        color
      }
    }
  },
  mounted() {
    this.noTop = this.$cookie.getCookie(this.notification.cookie)
  },
  methods: {
    closeTopNotification() {
      this.noTop = 1
      this.$cookie.setCookie(this.notification.cookie, 1, 30, '.' + this.APP_DOMAIN_LOWER)
    }
  }
}
</script>

<style lang="less" scoped>
#top-notification {
  box-sizing: border-box;
  min-width: 1263px;
  width: 100%;
  color: var(--color-121212);
  line-height: normal;
  font-family: @font-family-500, sans-serif;
  word-break: break-word;
  padding: 7px 33px 7px 13px;
  position: relative;
  .text {
    p {
      text-align: center;
    }
  }
  .close {
    position: absolute;
    right: 10px;
    top: 3px;
    width: 10px;
    height: 10px;
    cursor: pointer;
    font-weight: bold;
  }
}
</style>
