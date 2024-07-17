<template>
  <div @click="handleShowPopupActivityContent()" :style="tabStyle" v-track.view.click="{ common: getBiParams() }" class="activity-tag">
    <span>{{ activityContentData.resume }}</span>
  </div>
</template>
<script>
export default {
  name: 'ActivityTag',
  props: {
    activityContentData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      tabStyle: {}
    }
  },
  mounted() {
    this.getEleHeight()
  },
  methods: {
    getBiParams() {
      if (process.server) return
      return {
        ec: 'Banner',
        el: 'RedBar',
        param1: (location && location.href) || '-1',
        param2: this.versionObj.activityAbtest
      }
    },
    getEleHeight() {
      this.tabStyle = {
        opacity: 1
      }
    },
    handleShowPopupActivityContent() {
      this.$store.commit('setPopupActivityContentShow', true)
    }
  }
}
</script>
<style lang="less" scoped>
.activity-tag {
  position: fixed;
  bottom: 280px;
  right: 14px;
  z-index: @popuy-z-index;
  background-color: #dcadb3;
  color: rgb(255, 255, 255);
  transform: translate(50%, -50%) rotate(-90deg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  padding: 4px 38px;
  font-family: @font-family-500;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  border-radius: 5px 5px 0px 0px;
}
</style>
