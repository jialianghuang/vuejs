<template>
  <az-overlay id="invite_dialog" :zIndex="12">
    <div v-track.view="getTrackCommon('showroom')" class="dialog-wrapper">
      <az-icon @click="closeDialog()" icon-class="icon-icon_style_gallery_off" class="dialog-close" />
      <div class="invite__title">{{ nl('page_showroom_invite_desc') }}</div>
      <div class="invite__header">
        <p>{{ nl('page_showroom_step1') }}</p>
        <p><span class="invite-arrow">&gt;</span>{{ nl('page_showroom_step2') }}</p>
        <p><span class="invite-arrow">&gt;</span>{{ nl('page_showroom_step3') }}</p>
      </div>
      <div class="invite__tab">
        <span @click="showInviteBlock('link')" :class="{ selected: inviteBlock == 'link' }" class="tab-invite-item">
          <az-icon class="tab-invite-item__icon tab-invite-item__icon--link" icon-class="copy-link-color-icon" />
          {{ nl('page_showroom_link') }}
        </span>
        <span @click="showInviteBlock('mail')" :class="{ selected: inviteBlock == 'mail' }" class="tab-invite-item">
          <az-icon class="tab-invite-item__icon tab-invite-item__icon--email" icon-class="iconemail-color" />
          {{ nl('page_login_email') }}
        </span>
        <span @click="showInviteBlock('fb')" :class="{ selected: inviteBlock == 'fb' }" class="tab-invite-item">
          <az-icon class="tab-invite-item__icon tab-invite-item__icon--fb" icon-class="iconfacebook-color" />
          {{ nl('page_showroom_fb') }}
        </span>
      </div>
      <div class="invite__block">
        <div v-show="inviteBlock == 'link'" v-track.view="getTrackCommon('link')" class="url-link">
          <p class="note">{{ nl('page_showroom_share') }}</p>
          <input id="share-input-link" v-model="inviteInfo.inviteUrl" :class="{ 'copy-ing': isCopyIng }" />
          <span
            id="copy_link"
            v-track.view.click="getTrackCommon('copylink')"
            v-clipboard:copy="copyUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            {{ nl('page_showroom_copylink') }}
          </span>
        </div>
        <div v-show="inviteBlock == 'mail'" v-track.view="getTrackCommon('email')" class="content-invite-mail">
          <ul>
            <li v-for="(item, index) in shareEmailList" :key="index">
              <div class="invite__input-box">
                <input
                  :class="{ error: item.emailError }"
                  v-model="item.shareEmailTo"
                  :placeholder="nl('page_common_email_address')"
                  @blur="emailFormat(item, index)"
                  class="input_email"
                  type="text"
                />
                <span v-if="!index" class="nec-note"> *</span>
              </div>
              <div v-show="item.emailError" class="error-note" style="color: #f00;">{{ nl(item.errorNote) }}</div>
            </li>
          </ul>
          <div @click="inviteSubmit" class="add-more">
            <span>{{ nl('page_showroom_addmore') }}</span>
          </div>
          <az-button
            v-track.view="getTrackCommon('emailinvitebutton')"
            :needIcon="false"
            :disabled="btnInvite"
            @click="submitEmails"
            class="btn btn-default invite-submit"
          >
            <span v-if="!btnInvite">{{ nl('page_showroom_invite') }}</span>
            <span v-if="btnInvite">{{ nl('page_order_progress_processing') }}<span v-if="btnInvite">...</span></span>
          </az-button>
        </div>
        <div v-show="inviteBlock == 'fb'" v-track.view="getTrackCommon('facebook')" class="content-fb">
          <div v-track.view.click="getTrackCommon('facebooksendmessage')" @click="fbShare(inviteInfo.inviteUrl)" class="facebook-invite">
            <img :src="require('~/assets/images/facebook_pic5.png')" alt="facebook_pic" width="165" />
            <span>{{ nl('page_common_send_message') }}</span>
          </div>
        </div>
      </div>
      <az-toast ref="toast" :message="toastMsg" :position="`top`" />
    </div>
  </az-overlay>
</template>
<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import AzButton from '@/components/az-ui/Button/AzButton'
import formValidatorType from '@/assets/js/formValidatorType'
import AzToast from '@/components/az-ui/AzToast'
import { setUrlParam } from '@/assets/js/utils'
import { mapState } from 'vuex'
import Schema from 'async-validator'
export default {
  name: 'Invite',
  components: {
    AzOverlay,
    AzButton,
    AzToast
  },
  data() {
    return {
      shareEmailList: [
        { shareEmailTo: '', emailError: false, errorNote: 'page_js_email_input' },
        { shareEmailTo: '', emailError: false, errorNote: 'page_js_enter_valid_add' },
        { shareEmailTo: '', emailError: false, errorNote: 'page_js_enter_valid_add' }
      ],
      shareEmailConten: '',
      showroomInvite: 'page_showroom_invite',
      btnInvite: false,
      inviteBlock: 'link',
      shareGoods: {}, // fs分享链接
      copyUrl: '',
      toastMsg: '',
      isCopyIng: false
    }
  },
  computed: {
    ...mapState('showroom', ['invitePopShow', 'inviteInfo'])
  },
  watch: {
    'inviteInfo.inviteUrl': {
      handler(newVal, oldVal) {
        if (process.server) return
        this.copyUrl = setUrlParam(newVal, 'share_channel', 'showroomurl')
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.$store.commit('showroom/setInvitePopShow', false)
    },
    showInviteBlock(blockName) {
      switch (blockName) {
        case 'mail':
          this.setPoint('inviteyourfriends', 'email', 'click')
          break
        case 'fb':
          this.setPoint('inviteyourfriends', 'facebook', 'click')
          break
        case 'link':
          this.setPoint('inviteyourfriends', 'link', 'click')
          break
      }
      this.inviteBlock = blockName
    },
    fbShare(facebookUrl) {
      // const shareUrl = facebookUrl.substr(facebookUrl.indexOf('u=') + 2)
      // window.FB.ui(
      //   {
      //     method: 'share',
      //     mobile_iframe: true,
      //     href: shareUrl
      //   },
      //   function(response) {
      //     if (typeof response != 'undefined') {
      //     }
      //   }
      // )
      facebookUrl = setUrlParam(facebookUrl, 'share_channel', 'showroomfb')
      window.open(
        `http://www.facebook.com/sharer/sharer.php?u=${facebookUrl}`,
        '_blank',
        'height=' + 700 + ',width=' + 600 + ',top=' + window.outerHeight / 3 + ',left=' + window.outerWidth / 3
      )
    },
    inviteSubmit() {
      const itemInput = { shareEmailTo: '', emailError: false, errorNote: 'page_js_enter_valid_add' }
      this.shareEmailList.push(itemInput)
    },
    emailFormat(e, i) {
      if (!e.shareEmailTo.trim() && !i) {
        e.errorNote = 'page_js_email_input'
        e.emailError = true
        return
      }
      if (e.shareEmailTo.trim()) {
        const emailValidator = new Schema({
          email: formValidatorType.email({
            required: this.nl('page_login_enter_email'),
            validator: this.nl('page_js_enter_valid_add')
          })
        })
        emailValidator.validate({ email: e.shareEmailTo }, (errors, fields) => {
          if (errors) {
            e.emailError = true
            e.errorNote = 'page_js_enter_valid_add'
          } else {
            e.emailError = false
          }
        })
      } else {
        e.emailError = false
      }
    },
    verifyEmails() {
      const emailErrors = this.shareEmailList.filter((i) => i.emailError)
      const shareEmailTos = this.shareEmailList.filter((i) => i.shareEmailTo)
      if (shareEmailTos.length == 0 && emailErrors.length == 0) {
        this.shareEmailList[0].emailError = true
        return false
      } else if (shareEmailTos.length > 0 && emailErrors.length == 0) {
        return true
      } else {
        return false
      }
    },
    submitEmails() {
      if (this.verifyEmails()) {
        const emailList = []
        this.shareEmailList.forEach((i) => {
          if (i.shareEmailTo.trim()) {
            emailList.push(i.shareEmailTo)
          }
        })
        this.btnInvite = true
        const data = {
          emails: emailList,
          invite_url: setUrlParam(this.inviteInfo.inviteUrl, 'share_channel', 'showroomem'),
          user_name: this.userInfoName
        }
        this.setPoint('inviteyourfriends', 'emailinvitebutton', 'click', { num: emailList.length })
        this.$axios.$post('/1.0/showroom/invite', data).then((res) => {
          if (res.code == 0) {
            this.$store.commit('showroom/setInvitePopShow', false)
            this.$store.commit('showroom/setInvitePopOverShow', true)
            this.setPoint('inviteyourfriends', 'success', 'click', { num: emailList.length })
          } else {
            alert(res.msg)
          }
        })
      }
    },
    onCopy() {
      this.toastMsg = this.nl('page_common_share_successfully_copied')
      this.$refs.toast.show()
      this.isCopyIng = true
      setTimeout(() => {
        this.isCopyIng = false
      }, 300)
    },
    onError() {
      console.log('复制失败')
    },
    getTrackCommon(el) {
      const common = {
        ec: 'inviteyourfriends',
        el
      }
      return {
        common
      }
    }
  }
}
</script>

<style lang="less" scoped>
#invite_dialog {
  .dialog-wrapper {
    position: relative;
    background: #fff;
    width: 650px;
    min-height: 416px;
    max-height: 600px;
    overflow: auto;
    .invite__title {
      text-align: left;
      padding: 40px 0 8px 40px;
      font-family: @font-family-600, sans-serif;
      font-size: 16px;
      border-bottom: 1px solid var(--color-cccccc);
    }
    .invite__header {
      height: 58px;
      border-bottom: 1px solid var(--color-cccccc);
      padding-left: 40px;
      color: var(--color-999999);
      display: flex;
      align-items: center;
      .invite-arrow {
        margin: 0 12px;
      }
    }
    .invite__tab {
      display: flex;
      .tab-invite-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        text-align: center;
        background-color: #f6f6f6;
        cursor: pointer;
        color: #999;
        &.selected {
          background-color: #fff;
          color: var(--color-121212);
          font-family: @font-family-600;
        }
        .tab-invite-item__icon {
          margin-right: 5px;
          width: 20px;
          height: 20px;
        }
      }
    }
    .dialog-close {
      position: absolute;
      top: 15px;
      right: 15px;
      display: block;
      width: 14px;
      height: 14px;
      cursor: pointer;
    }
    .invite__block {
      input {
        border: 1px solid var(--color-cccccc);
        &:focus {
          border-color: var(--color-121212);
          background: #fff;
        }
        &::placeholder {
          color: #999;
        }
      }
      .content-invite-mail {
        text-align: left;
        width: 340px;
        margin: 0 auto;
        padding-top: 15px;
      }
      .invite__input-box {
        position: relative;
      }
      .input_email {
        width: 100%;
        height: 40px;
        margin-top: 15px;
        padding-left: 10px;
        box-sizing: border-box;
      }
      .nec-note {
        color: var(--color-121212);
        position: absolute;
        top: 28px;
        right: 5px;
      }
      .error-note {
        text-align: left;
        color: #f00;
        margin-top: 5px;
      }
      .add-more {
        margin-top: 5px;
        color: var(--color-121212);
        cursor: pointer;
      }
      .invite-submit {
        margin-top: 25px;
        margin-bottom: 40px;
        width: 100%;
        height: 40px;
      }
      .facebook-invite {
        margin: 140px auto;
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 40px;
        background: var(--color-121212);
        width: 216px;
        justify-content: center;
        color: #fff;
        font-family: @font-family-600;
        img {
          width: 20px;
          margin-right: 10px;
        }
      }
      .url-link {
        text-align: center;
        padding-bottom: 125px;
        .note {
          font-size: 16px;
          font-family: @font-family-600, sans-serif;
          margin-top: 90px;
          margin-bottom: 20px;
        }
        input {
          display: inline-block;
          width: 335px;
          height: 40px;
          padding-left: 15px;
          transition: all ease-in 0.25s;
          &.copy-ing {
            background: var(--color-121212);
            color: #fff;
          }
        }
        span {
          display: inline-block;
          color: #fff;
          border: 1px solid var(--color-121212);
          background-color: var(--color-121212);
          width: 136px;
          height: 40px;
          line-height: 40px;
          margin-left: 6px;
          &:hover,
          &.zeroclipboard-is-hover {
            background-color: var(--color-1e1e1e);
            cursor: pointer;
          }
        }
        .highlight {
          background-color: var(--color-121212);
          color: #fff;
        }
      }
    }
  }
}
</style>
