<template>
  <div id="userInfo_tutorial" @click="handleTutorial()">
    <az-icon class="tutorial-icon" icon-class="icon-gwc_question_"></az-icon>
    <span>{{ nl('page_showroom_tutorial') }}</span>
  </div>
</template>
<script>
export default {
  name: 'UserInfoTutorial',
  data() {
    return {}
  },
  methods: {
    handleTutorial() {
      this.setPoint('tutorial', 'entrance', 'click')
      this.$store.commit('showroom/setTutorialPopShow', true)
    }
  }
}
</script>
<style lang="less" scoped>
#userInfo_tutorial {
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 12px;
    margin-left: 4px;
    text-decoration: underline;
  }
}
</style>
