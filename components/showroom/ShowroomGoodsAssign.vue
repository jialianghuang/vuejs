<template>
  <div class="showroom-goods-assign">
    <div v-show="assignUserList.length > 0" class="assigned">
      <div class="assigned_to_title">{{ nl('page_showroom_assigned_to') }}</div>
      <div v-for="assignUser in assignUserList" :key="assignUser.assignId" class="user_card">
        <div v-if="assignUser.userId == showroomBaseInfo.userId && !showroomBaseInfo.isOwner" class="profile_photo">
          {{ nl('page_common_me') }}
        </div>
        <div v-else class="profile_photo">{{ assignUser.shortName }}</div>
        <div @click.stop="assignBlockShowClick('update', assignUser)" class="user_card_operation">
          <div class="profile_photo">{{ assignUser.shortName }}</div>
          <div class="user_name">{{ assignUser.userName }}</div>
          <img
            v-if="showroomBaseInfo.isOwner"
            @click.stop="deleteAssign(assignUser.assignId)"
            class="del_btn"
            src="~assets/images/showroom/delete_assign.png"
            alt="delete assign"
          />
        </div>
      </div>
      <div id="assigned_add_btn" @click.stop="assignBlockShowClick('add')" v-if="showroomBaseInfo.isOwner" class="assigned_add_btn">
        <az-icon class="icon-assigned" style="" icon-class="icon-add-cycle-solid" />
      </div>
    </div>
    <template v-if="showroomBaseInfo.isOwner">
      <div v-show="assignUserList.length == 0" class="assign_btn_all">
        <div v-show="!firstAssignShow" @click.stop="firstAssignClick" class="assign_edit">
          <div id="unassign_icon" class="unassign_btn">
            <az-icon class="assign_to_icon" icon-class="iconicon_account" />
            <span class="unassign_font">{{ nl('page_showroom_unassign') }}</span>
          </div>
          <div class="assign_to_btn">
            <az-icon class="assign_to_icon" icon-class="iconicon_account" />
            <span class="assign_to_font">{{ nl('page_showroom_assignto') }}</span>
          </div>
          <div class="assign_to_tips">
            <div class="triangle"></div>
            <div class="triangle-2"></div>
            <span class="tips_font">{{ nl('page_showroom_assign_to_tips') }}</span>
          </div>
        </div>
        <div v-show="firstAssignShow" class="assign_to_div">
          <az-icon class="assign_to_icon" icon-class="iconicon_account" />
          <span class="assign_to_font">{{ nl('page_showroom_assignto') }}</span>
        </div>
      </div>
      <div v-show="assignBlockShow" class="assign_block">
        <div @click="showroomMemberClick(assignUser)" v-for="assignUser in assignList" :key="assignUser.userId" class="showroom_member">
          <div class="profile_photo">{{ assignUser.shortName }}</div>
          <div class="user_name">{{ assignUser.userName }}</div>
        </div>
        <div @click.stop="" class="not_member">
          <div class="title">
            {{ nl('page_showroom_not_in') }}
          </div>
          <div class="add_div">
            <input
              @click="errorTipShow = false"
              :class="{ error: errorTipShow }"
              v-model="notMemberCurName"
              :placeholder="nl('page_placeholder_text1')"
              class="add_name"
              name="add_name"
              type="text"
            />
            <az-icon @click="notMemberClick" class="add_name_btn" icon-class="icon-add-cycle-dash" />
          </div>
          <div v-show="errorTipShow" class="error_tip">{{ nl('page_showroom_invalid') }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AzIcon from '../az-ui/AzIcon.vue'
export default {
  name: 'ShowroomGoodsAssign',
  components: { AzIcon },
  props: {
    favoriteId: {
      type: Number,
      default: 0
    },
    assignInfo: {
      type: Array,
      default: () => []
    },
    showroomGoodsIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      firstAssignShow: false,
      assignBlockShow: '',
      errorTipShow: false,
      notMemberCurName: '',
      curUpdateAssignId: 0,
      curUpdateUserId: 0
    }
  },
  computed: {
    ...mapState('showroom', ['showroomBaseInfo', 'prodList']),
    assignList() {
      if (this.assignBlockShow == 'update') {
        return this.showroomUserList
      } else {
        return this.notAssignUserList
      }
    },
    assignUserList() {
      const temp = []
      for (let index = 0; index < this.assignInfo.length; index++) {
        const element = this.assignInfo[index]
        if (element.assigned) temp.push(element)
      }
      return temp
    },
    notAssignUserList() {
      const temp = []
      for (let index = 0; index < this.assignInfo.length; index++) {
        const element = this.assignInfo[index]
        if (element.userId != 0 && !element.assigned) temp.push(element)
      }
      return temp
    },
    showroomUserList() {
      const temp = []
      for (let index = 0; index < this.assignInfo.length; index++) {
        const element = this.assignInfo[index]
        if (element.userId) temp.push(element)
      }
      return temp
    }
  },
  watch: {
    assignBlockShow(val) {
      this.$emit('updateAssignBlockShow', val)
    }
  },
  methods: {
    firstAssignClick() {
      this.setPoint('assignto', 'showroom', 'click')
      this.firstAssignShow = true
      this.assignBlockShow = 'add'
      window.addEventListener('click', this.handleBodyClickEvent, { once: true })
    },
    assignBlockShowClick(act, assignUser) {
      this.setPoint('assignto', 'addsomebody', 'click')
      this.assignBlockShow = act
      if (act == 'update') {
        this.curUpdateAssignId = assignUser.assignId
        this.curUpdateUserId = assignUser.userId
      }
      window.addEventListener('click', this.handleBodyClickEvent, { once: true })
    },
    handleBodyClickEvent() {
      this.firstAssignShow = false
      this.assignBlockShow = ''
      this.errorTipShow = false
    },
    showroomMemberClick(member) {
      this.setPoint('assignto', 'somebody', 'click')
      if (this.assignBlockShow == 'add') {
        this.addAssign(member.userId, '')
      } else {
        if (member.userId == this.curUpdateUserId) return false
        for (let index = 0; index < this.assignUserList.length; index++) {
          const element = this.assignUserList[index]
          if (element.userId == member.userId) {
            this.deleteAssign(this.curUpdateAssignId)
            return false
          }
        }
        this.updateAssign(member.userId, '', this.curUpdateAssignId)
      }
    },
    notMemberClick() {
      this.setPoint('assignto', 'anotherperson', 'click')
      // 输入框内容校验
      const reg = /^[a-zA-Z0-9\s]+$/
      if (this.notMemberCurName == '' || !reg.test(this.notMemberCurName)) {
        this.errorTipShow = true
        return false
      }
      if (this.assignBlockShow == 'add') {
        this.addAssign('', this.notMemberCurName)
      } else {
        this.updateAssign('', this.notMemberCurName, this.curUpdateAssignId)
      }
      // 清除输入框内内容
      this.handleBodyClickEvent()
      this.notMemberCurName = ''
    },
    // 700200;    //showroom 商品已被删除
    // 700201;    //showroom用户已被删除
    // 700202;    //showroom已被删除
    // 700203;    //assign用户被删除
    // 700204;    //assign被删除
    addAssign(userId, userName) {
      const params = { showroom_id: this.showroomBaseInfo.showroomId, favorite_id: this.favoriteId, user_id: userId, name: userName }
      this.$axios.$post(`/1.0/showroom/assign`, params).then((res) => {
        if (res.code == 0) {
          const tempProdList = JSON.parse(JSON.stringify(this.prodList))
          tempProdList[this.showroomGoodsIndex].assignInfo = res.data.list
          this.$store.commit('showroom/setProdList', tempProdList)
        } else if ([700200, 700203].includes(res.code)) {
          alert(res.msg)
          window.location.reload()
        } else if ([700201, 700202].includes(res.code)) {
          alert(res.msg)
          window.location.href = this.countryUrl('/')
        }
      })
    },
    deleteAssign(assignId) {
      this.setPoint('assignto', 'unassign', 'click')
      const params = { showroom_id: this.showroomBaseInfo.showroomId, favorite_id: this.favoriteId, assign_id: assignId }
      this.$axios.$delete(`/1.0/showroom/assign`, { params }).then((res) => {
        if (res.code == 0) {
          const tempProdList = JSON.parse(JSON.stringify(this.prodList))
          tempProdList[this.showroomGoodsIndex].assignInfo = res.data.list
          this.$store.commit('showroom/setProdList', tempProdList)
        } else if ([700200, 700203, 700204].includes(res.code)) {
          alert(res.msg)
          window.location.reload()
        } else if ([700201, 700202].includes(res.code)) {
          alert(res.msg)
          window.location.href = this.countryUrl('/')
        }
      })
      this.handleBodyClickEvent()
    },
    updateAssign(userId, userName, assignId) {
      const params = {
        showroom_id: this.showroomBaseInfo.showroomId,
        favorite_id: this.favoriteId,
        user_id: userId,
        name: userName,
        assign_id: assignId
      }
      this.$axios.$put(`/1.0/showroom/assign`, params).then((res) => {
        if (res.code == 0) {
          const tempProdList = JSON.parse(JSON.stringify(this.prodList))
          tempProdList[this.showroomGoodsIndex].assignInfo = res.data.list
          this.$store.commit('showroom/setProdList', tempProdList)
        } else if ([700200, 700203, 700204].includes(res.code)) {
          alert(res.msg)
          window.location.reload()
        } else if ([700201, 700202].includes(res.code)) {
          alert(res.msg)
          window.location.href = this.countryUrl('/')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.showroom-goods-assign {
  position: relative;
  border-top: 1px solid var(--color-eeeeee);
  .assigned {
    margin: 10px 10px 0;
    display: flex;
    flex-wrap: wrap;
    .assigned_to_title {
      color: var(--color-121212);
      height: 26px;
      line-height: 26px;
      margin-bottom: 10px;
    }
    @cardLeft: 9px;
    @card6childLeft: 9px;
    .user_card {
      height: 26px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      &:nth-child(6n) {
        .profile_photo {
          margin-left: @card6childLeft;
        }
        .user_card_operation {
          margin-left: @card6childLeft - 1px - 3px;
        }
      }
      .profile_photo {
        margin-left: @cardLeft;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        text-align: center;
        line-height: 24px;
        color: #ffffff;
        text-transform: capitalize;
        background: var(--color-ede1d3);
        font-family: @font-family-600;
      }
      .user_card_operation {
        position: absolute;
        cursor: pointer;
        display: none;
        height: 32px;
        border-radius: 20px;
        background: var(--color-f9f9f9);
        border: 1px solid #eee;
        align-items: center;
        z-index: 1;
        max-width: 150px;
        margin-left: @cardLeft - 1px - 3px;
        .profile_photo {
          margin-left: 3px;
        }
        .user_name {
          font-family: @font-family-500, sans-serif;
          font-size: 13px;
          color: var(--color-121212);
          margin-left: 5px;
          line-height: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 32px;
          white-space: nowrap;
          max-width: 74px;
          margin-right: 10px;
          flex: 1;
        }
        img {
          width: 14px;
          height: 14px;
          margin-right: 10px;
        }
      }
      &:hover {
        .user_card_operation {
          display: flex;
        }
      }
    }
    .assigned_add_btn {
      display: flex;
      align-items: center;
      margin-left: @cardLeft;
      cursor: pointer;
      height: 26px;
      width: 26px;
      margin-bottom: 10px;
      &:nth-child(6n) {
        margin-left: @card6childLeft;
      }
      .icon-assigned {
        width: 26px;
        height: 26px;
        vertical-align: middle;
      }
    }
  }
  .assign_btn_all {
    margin: 0 10px;
    .assign_edit {
      width: fit-content;
      height: 48px;
      line-height: 48px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .unassign_btn {
        display: flex;
        align-items: center;
        height: 28px;
        line-height: 28px;
        .unassign_font {
          color: var(--color-121212);
          font-family: @font-family-500, sans-serif;
        }
      }
      .assign_to_icon {
        width: 12px;
        height: 12px;
        fill: var(--color-121212);
        margin-right: 5px;
      }
      .assign_to_btn {
        cursor: pointer;
        background: var(--color-f9f9f9);
        border: 1px solid #eee;
        border-radius: 20px;
        height: 28px;
        display: none;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        .assign_to_font {
          color: var(--color-121212);
          font-family: @font-family-500, sans-serif;
        }
      }
      .assign_to_tips {
        display: none;
        height: 54px;
        border: 1px solid #eee;
        background: #fff;
        position: absolute;
        top: 45px;
        left: 10px;
        right: 10px;
        .triangle {
          border-bottom: 5px solid #eee;
          width: 0px;
          height: 0px;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          position: absolute;
          top: -6px;
          left: 46px;
        }
        .triangle-2 {
          border-bottom: 5px solid #fff;
          width: 0px;
          height: 0px;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          position: absolute;
          top: -5px;
          left: 46px;
        }
        .tips_font {
          height: auto;
          text-align: left;
          padding: 10px;
          line-height: 18px;
        }
      }
    }
    .assign_to_div {
      display: flex;
      align-items: center;
      width: fit-content;
      height: 48px;
      line-height: 48px;
      .assign_to_font {
        margin-left: 8px;
      }
    }
  }
  .assign_edit:hover {
    .unassign_btn {
      display: none;
    }
    .assign_to_btn {
      display: flex;
    }
    .assign_to_tips {
      display: flex;
      align-items: center;
    }
  }
  .assign_block {
    .showroom_member {
      min-height: 48px;
      display: flex;
      padding: 11px 10px;
      box-sizing: border-box;
      align-items: center;
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
        font-size: @font-family-600;
      }
      .user_name {
        font-size: 13px;
        margin-left: 10px;
        font-family: @font-family-600;
        max-width: 185px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 26px;
        height: 26px;
      }
      &:hover {
        background: #f6f6f6;
        cursor: pointer;
      }
    }
    .not_member {
      padding: 10px;
      .title {
        margin-bottom: 5px;
      }
      .add_div {
        display: flex;
        align-items: center;
        .add_name {
          background: #f6f6f6;
          width: 100%;
          flex: 1;
          height: 38px;
          line-height: 38px;
          padding: 0 10px;
          border-color: var(--color-eeeeee);
          &::placeholder {
            color: #ccc;
            font-size: 13px;
          }
        }
        .error {
          border: 1px solid var(--color-ff0000);
        }
        .add_name::-webkit-input-placeholder {
          color: #d1d1d1;
        }
        .add_name_btn {
          cursor: pointer;
          width: 26px;
          height: 26px;
          margin-left: 10px;
        }
      }
      .error_tip {
        margin-top: 5px;
        color: var(--color-ff0000);
      }
    }
  }
}
</style>
