<template>
  <div v-if="showroomDeletePopShow" class="showroom-delete-pop">
    <az-popup :overlayZIndex="12" @close-on-click-overlay="close" :position="'center'" width="670px">
      <div id="delete_showroom">
        <div class="title">
          <p class="txt">
            <az-icon icon-class="icon-already" class="dialog-already-icon" />{{
              `Delete ${showroomBaseInfo.roomName}${nl('page_showroom_owner_showroom')}`
            }}
          </p>
          <a @click="close()" class="dialog-close" href="javascript:void(0)">
            <az-icon icon-class="icon-icon_style_gallery_off" class="dialog-close-icon" />
          </a>
        </div>
        <div class="content">
          <p class="txt1">{{ nl('page_showroom_delete_pop_tip_quest') }}</p>
          <p class="txt2">{{ nl('page_showroom_delete_pop_tip_if') }}</p>
          <div class="dec">
            <p>
              <em>·</em><span>{{ nl('page_showroom_delete_pop_tip_1') }}</span>
            </p>
            <p>
              <em>·</em><span>{{ nl('page_showroom_delete_pop_tip_2') }}</span>
            </p>
            <p>
              <em>·</em><span>{{ nl('page_showroom_delete_pop_tip_3') }}</span>
            </p>
            <p>
              <em>·</em><span>{{ nl('page_showroom_delete_pop_tip_4') }}</span>
            </p>
          </div>
          <p class="txt3">
            {{ nl('page_showroom_delete_pop_tip_would') }} {{ showroomBaseInfo.roomName }}{{ nl('page_showroom_owner_showroom') }}?
          </p>
        </div>
        <div class="footer">
          <az-button :needIcon="false" @click="deleteRoom()" class="btn delete-btn">
            <span>{{ nl('page_common_delete') }}</span>
          </az-button>
          <az-button :needIcon="false" @click="close()" class="btn cancle-btn">
            <span>{{ nl('page_common_cancel') }}</span>
          </az-button>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import AzPopup from '@/components/az-ui/Popup/AzPopup'
import AzButton from '@/components/az-ui/Button/AzButton'
import { mapState } from 'vuex'
export default {
  name: 'ShowroomDeletePop',
  components: {
    AzPopup,
    AzButton
  },
  mixins: [],
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('showroom', ['showroomDeletePopShow', 'showroomBaseInfo'])
  },
  mounted() {},
  methods: {
    close() {
      this.$store.commit('showroom/setShowroomDeletePopShow', false)
    },
    deleteRoom() {
      this.$axios.$delete(`/1.0/showroom/${this.showroomBaseInfo.showroomId}`, {}).then((res) => {
        if (res.code == 0) {
          window.location.href = this.countryUrl(`/showroom/${res.data.showroomIdDisplay}`)
        } else {
          window.location.href = this.countryUrl('/')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.showroom-delete-pop {
  #delete_showroom {
    background: #fff;
  }
  .title {
    padding: 40px 0 15px 40px;
    position: relative;
    .txt {
      font-size: 24px;
      font-family: @font-family-600;
      color: var(--color-121212);
      display: flex;
      align-items: center;
    }
    .dialog-already-icon {
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }
    .dialog-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 14px;
      height: 14px;
      .dialog-close-icon {
        width: 14px;
        height: 14px;
        fill: var(--color-121212);
        cursor: pointer;
      }
    }
  }
  .content {
    font-size: 13px;
    padding: 0 40px;
    .txt1 {
      margin-bottom: 15px;
      font-family: @font-family-600;
    }
    .txt2 {
      margin-bottom: 10px;
    }
    .dec {
      p {
        margin-bottom: 10px;
        em {
          display: inline-block;
          width: 6px;
          vertical-align: top;
        }
        span {
          display: inline-block;
          width: calc(~'100% - 6px');
        }
      }
    }
    .txt3 {
      margin-bottom: 25px;
      font-family: @font-family-600;
    }
  }
  .footer {
    padding: 0 40px 40px;
    .btn {
      width: 150px;
      height: 40px;
      font-size: 14px;
      text-transform: uppercase;
      &.delete-btn {
        font-family: @font-family-600;
        color: #ffffff;
        border: solid 1px var(--color-121212);
        background: var(--color-121212);
      }
      &.cancle-btn {
        background: #ffffff;
        border: solid 1px var(--color-121212);
        margin-left: 30px;
        font-family: @font-family-600;
        color: var(--color-121212);
      }
    }
  }
}
</style>
