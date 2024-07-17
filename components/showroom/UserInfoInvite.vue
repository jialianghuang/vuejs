<template>
  <div id="userInfo_invite">
    <div class="showroom-userInfo-header">
      <div class="title">{{ nl('page_common_showroom_my_squad') }}</div>
      <div @click="handleInvite('invite')" v-if="showroomBaseInfo.isOwner" class="editor_div">
        <span id="invite" class="editor_item">{{ nl('page_showroom_invite_capitalize') }}</span>
      </div>
    </div>
    <div class="user-name-list">
      <div v-if="hasInviteUser" class="showroom-member-list">
        <div v-for="(item, index) in inviteInfo.userList" :key="index" class="showroom-member">
          <div class="profile_photo">{{ item.shortName }}</div>
          <div class="user_name">{{ item.shownName }}</div>
          <az-icon
            v-if="(showroomBaseInfo.isOwner && userId != item.userId) || (!showroomBaseInfo.isOwner && userId == item.userId)"
            @click="handleRemoveInvite(item)"
            icon-class="icon-icon_style_gallery_off"
            class="icon-remove"
          />
        </div>
      </div>
      <div id="showroom-invite-init" v-else>
        <span class="showroom-invite-des">{{ nl('page_showroom_get_party_start') }}</span>
        <az-button id="showroom-invite-btn" :needIcon="false" @click="handleInvite('squad')" class="btn btn-default showroom-invite-btn">
          <span>{{ nl('page_showroom_your_squad') }}</span>
        </az-button>
      </div>
    </div>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import { mapState } from 'vuex'

export default {
  name: 'UserInfoInvite',
  components: { AzButton },
  data() {
    return {}
  },
  computed: {
    ...mapState('showroom', ['inviteInfo', 'showroomBaseInfo']),
    hasInviteUser() {
      if (
        this.inviteInfo &&
        this.inviteInfo.userList &&
        Object.keys(this.inviteInfo.userList).length &&
        this.inviteInfo.userList.length > 1
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    handleInvite(type) {
      if (type == 'invite') {
        this.setPoint('showroom', 'invite', 'click')
      }
      this.$store.commit('showroom/setInvitePopShow', true)
    },
    // 取消邀请
    handleRemoveInvite(item) {
      if (!window.confirm(this.nl('page_showroom_remove_member_from_your_showroom'))) {
        return false
      }
      this.$axios.$delete('/1.0/showroom/user', { params: { user_id: item.userId, showroom_id: item.showroomId } }).then((res) => {
        if (res.code == 0) {
          if (this.userId == item.userId) {
            location.href = this.countryUrl('/all/bridesmaid-dresses')
          } else {
            location.reload()
            // this.$emit('getShowroomProdList')
            // this.$store.commit('showroom/setInviteInfoUserList', res.data.userList)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#userInfo_invite {
  box-sizing: border-box;
  margin-bottom: 20px;
  border: 1px solid #eee;
  padding-bottom: 5px;
  .showroom-userInfo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-family: @font-family-600;
    height: 42px;
    border-bottom: 1px solid var(--color-eeeeee);
    padding: 0 15px 0;
    .editor_item {
      font-size: 13px;
      font-family: @font-family-500;
      color: #666;
      line-height: 18px;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .showroom-member-list {
    padding: 5px 0 0;
  }
  .showroom-member {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    &:hover {
      background: #f6f6f6;
      cursor: pointer;
      .icon-remove {
        display: block;
      }
    }
    .profile_photo {
      border-radius: 50%;
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #ffffff;
      text-transform: capitalize;
      background: var(--color-ede1d3);
      font-size: 14px;
      font-family: @font-family-600;
    }
    .user_name {
      font-size: 14px;
      margin-left: 10px;
      max-width: 185px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 26px;
      height: 26px;
    }
    .icon-remove {
      display: none;
      width: 7px;
      height: 7px;
      cursor: pointer;
      fill: var(--color-121212);
      // background: data-uri('~assets/images/showroom/x.png') no-repeat center;
      // background-size: 100% 100%;
      margin-left: auto;
    }
  }
  #showroom-invite-init {
    padding: 0 15px 35px;
    .showroom-invite-des {
      display: block;
      text-align: center;
      color: var(--color-121212);
      margin: 40px 0 20px;
    }
    #showroom-invite-btn {
      width: 100%;
      padding: 0;
    }
  }
}
</style>
