<template>
  <div class="showroom-title">
    <div class="room_name">
      <span class="room_name_text">{{ roomName }}</span>
      <p v-if="roomName.length > 30" class="room-name-toast">
        <span>{{ roomName }}</span>
      </p>
    </div>
    <div class="room_id">(ID: {{ showroomBaseInfo.partyId }})</div>
    <div v-if="showroomBaseInfo.isOwner == 1" @click="deleteShowroom()" class="del-box">
      <az-icon class="delete" icon-class="remove"></az-icon>
      <span class="hover-tips">{{ nl('page_common_showroom_delete_hover') }}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ShowroomTitle',
  data() {
    return {}
  },
  computed: {
    ...mapState('showroom', ['showroomBaseInfo']),
    roomName({ showroomBaseInfo }) {
      const text = showroomBaseInfo.roomName + this.nl('page_showroom_owner_showroom')
      return text
    }
  },
  methods: {
    deleteShowroom() {
      this.buryPoint(this, 'event', {
        ec: 'showroom',
        el: 'delete',
        ea: 'click'
      })
      this.$store.commit('showroom/setShowroomDeletePopShow', true)
    }
  }
}
</script>
<style lang="less" scoped>
.showroom-title {
  display: flex;
  align-items: center;
  margin: 30px 0 5px;
  font-size: 24px;
  font-family: @font-family-500;
  color: var(--color-121212);
  .room_name {
    position: relative;
    .room_name_text {
      display: block;
      max-width: 340px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: @font-family-600;
    }
    .room-name-toast {
      width: 100%;
      padding: 10px;
      position: absolute;
      left: 0;
      bottom: 100%;
      display: none;
      background-color: #fff;
      transform: translateY(-10px);
      box-shadow: 0 0 1px 0px #999;
      border-radius: 2px;
      font-size: 16px;
      word-wrap: break-word;
      z-index: @z-index-2;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 100%;
        border-top: 8px solid #ccc;
        border-right: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid transparent;
      }
      &::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 100%;
        border-top: 7px solid #fff;
        border-right: 7px solid transparent;
        border-bottom: 7px solid transparent;
        border-left: 7px solid transparent;
        z-index: 1;
      }
    }
    &:hover {
      .room-name-toast {
        display: block;
      }
    }
  }
  .room_id {
    padding: 0 5px 0 10px;
    font-size: 16px;
    color: #999;
    vertical-align: middle;
  }
  .del-box {
    display: inline-block;
    position: relative;
    line-height: 14px;
    .delete {
      display: inline-block;
      width: 13px;
      height: 14px;
      overflow: hidden;
      cursor: pointer;
      vertical-align: middle;
    }
    .hover-tips {
      position: absolute;
      display: none;
      bottom: 20px;
      left: -76px;
      width: 165px;
      height: 27px;
      background: var(--color-121212);
      opacity: 0.55;
      border-radius: 2px;
      color: #fefefe;
      font-size: 13px;
      line-height: 27px;
      text-align: center;
    }
    &:hover {
      i.delete {
        background-position-x: -122px;
      }
      .hover-tips {
        display: inline-block;
      }
    }
  }
}
</style>
