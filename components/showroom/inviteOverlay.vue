<template>
  <div class="invite_dialog_overlay">
    <az-overlay :zIndex="12">
      <div class="dialog-wrapper">
        <az-icon @click="closeDialog()" icon-class="icon-icon_style_gallery_off" class="dialog-close" />
        <div class="invite-dialog-content">
          <div id="invite_succeed_dialog">
            <div class="invite_dialog_container">
              <img
                :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/85/aa/136013cf01a8f5bb2c61fd8ad78685aa.png')"
                alt="invite"
              />
              <div class="txt">{{ nl('page_showroom_invite_success') }}</div>
              <az-button :needIcon="false" @click="submitEmails" class="btn btn-default invite-submit">
                <span>{{ nl('page_common_ok') }}</span>
              </az-button>
            </div>
          </div>
        </div>
      </div>
    </az-overlay>
  </div>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import AzButton from '@/components/az-ui/Button/AzButton'
export default {
  name: 'InviteOverlay',
  components: {
    AzOverlay,
    AzButton
  },
  data() {
    return {}
  },
  methods: {
    closeDialog() {
      this.$store.commit('showroom/setInvitePopOverShow', false)
    },
    submitEmails() {
      this.$store.commit('showroom/setInvitePopOverShow', false)
    }
  }
}
</script>

<style scoped lang="less">
.invite_dialog_overlay {
  .dialog-wrapper {
    position: relative;
    width: 320px;
    background: #ffffff;
    .dialog-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 14px;
      height: 14px;
      fill: var(--color-121212);
    }
    .invite-dialog-content {
      width: 100%;
      height: 100%;
      text-align: center;
      box-sizing: border-box;
    }
    .txt {
      color: var(--color-121212);
      font-size: 13px;
      margin-top: 15px;
    }
    .invite-submit {
      margin-top: 20px;
      margin-bottom: 30px;
      width: 170px;
      height: 40px;
    }
  }
}
</style>
