<template>
  <az-overlay :zIndex="12" :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.66)' }">
    <div class="jmodal-main" style="position: absolute; width: 500px; left: 388.5px; top: 100px;">
      <div class="jmodal-top">
        <div class="jmodal-top-left jmodal-png-fiexed">&nbsp;</div>
        <div class="jmodal-border-top jmodal-png-fiexed">&nbsp;</div>
        <div class="jmodal-top-right jmodal-png-fiexed">&nbsp;</div>
      </div>
      <div class="jmodal-middle">
        <div class="jmodal-border-left jmodal-png-fiexed">&nbsp;</div>
        <div class="jmodal-middle-content">
          <div class="jmodal-title">{{ nl('page_login_login_with_facebook') }}</div>
          <div v-html="nl('page_login_you_have_logged_on_facebook')" class="jmodal-content"></div>
        </div>
        <div class="jmodal-border-right jmodal-png-fiexed">&nbsp;</div>
      </div>
      <div class="jmodal-bottom">
        <div class="jmodal-bottom-left jmodal-png-fiexed">&nbsp;</div>
        <div class="jmodal-border-bottom jmodal-png-fiexed">&nbsp;</div>
        <div class="jmodal-bottom-right jmodal-png-fiexed">&nbsp;</div>
      </div>
    </div>
  </az-overlay>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
export default {
  name: 'JModal',
  components: {
    AzOverlay
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.jmodal-main {
  left: 0;
  padding: 0;
  margin: 0;
  top: 0;
  position: fixed;
  z-index: @popuy-z-index;
  overflow: visible;
}
.jmodal-main .jmodal-top {
  height: 10px;
  position: relative;
  width: 100%;
}
.jmodal-main .jmodal-top div {
  height: 10px;
  position: absolute;
  top: 0;
}
.jmodal-main .jmodal-top-left {
  width: 10px;
  left: 0;
  background: url('~assets/images/jmodal/dialog_top_left.png') center bottom no-repeat;
}
.jmodal-main .jmodal-top-right {
  width: 10px;
  right: 0;
  background: url('~assets/images/jmodal/dialog_top_right.png') center bottom no-repeat;
}
.jmodal-main .jmodal-border-top {
  left: 10px;
  right: 10px;
  background: url('~assets/images/jmodal/dialog_border.png') center bottom repeat-x;
}
.jmodal-main .jmodal-middle {
  position: relative;
  width: 100%;
  height: auto;
  left: 0;
  top: 0;
}
.jmodal-main .jmodal-border-left {
  background: url('~assets/images/jmodal/dialog_border.png') right bottom repeat-y;
  width: 10px;
  left: 0;
  position: absolute;
  top: 0;
  bottom: 0;
}
.jmodal-main .jmodal-border-right {
  width: 10px;
  right: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  background: url('~assets/images/jmodal/dialog_border.png') left bottom repeat-y;
}
.jmodal-main .jmodal-middle-content {
  padding: 0 10px;
}
.jmodal-main .jmodal-title {
  height: 30px;
  background-color: #6d84b4;
  font-weight: bold;
  text-indent: 10px;
  color: #fff;
  letter-spacing: 2px;
  line-height: 30px;
  border-bottom: solid 1px #3b5998;
  font-family: Arial, Tahoma, Verdana, sans-serif;
}
.jmodal-main .jmodal-content {
  line-height: 165%;
  height: auto;
  background-color: #fff;
  padding: 20px 10px;
  font-family: Arial, Tahoma, Verdana, sans-serif;
}
.jmodal-main .jmodal-opts {
  background-color: #eee;
  border-top: 1px solid #ccc;
  padding: 5px;
  text-align: right;
}
.jmodal-main .jmodal-opts input {
  background-color: #5b74a8;
  border-color: #29447e #29447e #1a356e;
  border-style: solid;
  border-width: 1px;
  color: #fff;
  cursor: pointer;
  padding: 2px 10px;
  text-align: center;
  margin-right: 5px;
}
/* ie png fixed */
.jmodal-png-fiexed {
  filter: alpha(opacity=50);
}
.jmodal-main .jmodal-bottom {
  height: 10px;
  position: relative;
  width: 100%;
}
.jmodal-main .jmodal-bottom div {
  position: absolute;
  top: 0;
  height: 10px;
}
.jmodal-main .jmodal-border-bottom {
  left: 10px;
  right: 10px;
  background: url('~assets/images/jmodal/dialog_border.png') center top repeat-x;
}
.jmodal-main .jmodal-bottom-left {
  width: 10px;
  left: 0;
  background: url('~assets/images/jmodal/dialog_bottom_left.png') center top no-repeat;
}
.jmodal-main .jmodal-bottom-right {
  width: 10px;
  right: 0;
  background: url('~assets/images/jmodal/dialog_bottom_right.png') center top no-repeat;
}
</style>
