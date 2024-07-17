<template>
  <div class="showroom-notice">
    <div v-if="!showroomBaseInfo.countdownStatus" class="standard">
      <span v-html="nl('page_common_showroom_notice')"></span>
    </div>
    <div v-else-if="showroomBaseInfo.countdownStatus == 1" class="dye_log_ing">
      <!-- <span v-html="nl('page_common_showroom_dye_log_ing_before_notice')" class="showroom_dye_log_ing_before"></span> -->
      <!-- <div class="countdown_div">
        <az-count-down
          :end-time="showroomBaseInfo.endedTime"
          @countDownEnd="countDownEnd"
          v-if="serverTime"
          :isShowroomTime="true"
        ></az-count-down>
      </div> -->
      <p v-html="nl('page_common_showroom_dye_log_ing_end_notice')" class="showroom_dye_log_ing_end"></p>
    </div>
    <div v-else-if="showroomBaseInfo.countdownStatus == 2" class="dye_log_end">
      <span v-html="nl('page_common_showroom_dye_log_end_notice')"></span>
    </div>
  </div>
</template>
<script>
// import AzCountDown from '@/components/az-ui/AzCountDown'
import { mapState } from 'vuex'
export default {
  name: 'ShowroomNotice',
  components: {},
  data() {
    return {
      // showroom是否过期字段countdownStatus   2.已过期   1.有倒计时   0.普通
    }
  },
  computed: {
    ...mapState('showroom', ['showroomBaseInfo'])
  },
  methods: {
    countDownEnd() {
      this.$store.commit('showroom/setShowroomBaseInfo', {
        ...this.showroomBaseInfo,
        countdownStatus: 2
      })
    }
  }
}
</script>
<style lang="less" scoped>
.showroom-notice {
  text-align: center;
  margin-top: 30px;
  background-color: var(--color-f1e9e6);
  padding: 15px 10px;
  .standard,
  .dye_log_end {
    padding: 0 65px;
    // border: 1px solid #ffffff;
    span {
      font-family: @font-family-500;
      font-size: 13px;
      color: var(--color-121212);
      /deep/.showroom_notice_before {
        font-family: @font-family-600;
      }
      /deep/a.showroom_notice_a {
        text-decoration: underline;
        cursor: pointer;
        color: var(--color-121212);
      }
    }
    /deep/a {
      text-decoration: underline;
      cursor: pointer;
      color: #757575;
    }
  }
  .standard {
    padding: 0 68px 0;
  }
  .dye_log_end {
    padding: 0 72px;
    span {
      color: #757575;
      font-size: 14px;
      line-height: unset;
      /deep/a {
        color: #757575;
        font-size: 14px;
      }
    }
  }
  .dye_log_ing {
    padding: 0 83px;
    /deep/a {
      text-decoration: underline;
      cursor: pointer;
      color: #757575;
    }
    .showroom_dye_log_ing_before {
      font-size: 18px;
      font-family: @font-family-600;
      color: var(--color-666666);
    }
    .showroom_dye_log_ing_end {
      padding-top: 8px;
      font-size: 13px;
      font-family: @font-family-500;
      color: var(--color-666666);
    }

    .countdown_div {
      display: inline-block;
      background: url('~assets/images/showroom/showroom_end.png');
      display: inline-block;
      width: 135px;
      height: 28px;
      background-repeat: no-repeat;
      background-position: -168px 2px;
      background-size: 300px 27px;
      position: relative;
      top: 6px;
    }
  }
}
</style>
