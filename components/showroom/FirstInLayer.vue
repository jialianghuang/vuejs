<template>
  <div v-if="firstInLayerShow" class="first-in-layer">
    <az-popup-layer :lockScroll="true" :z-index="12" :close-color="'var(--color-121212)'" @close="close" width="690px" height="auto">
      <div class="text">
        {{ nl('page_showroom_party_tips') }}
      </div>
    </az-popup-layer>
  </div>
</template>
<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import { mapState } from 'vuex'
export default {
  name: 'FirstInLayer',
  components: { AzPopupLayer },
  computed: {
    ...mapState('showroom', ['firstInLayerShow'])
  },
  methods: {
    close() {
      this.$store.commit('showroom/setFirstInLayerShow', false)
    }
  }
}
</script>
<style lang="less" scoped>
.first-in-layer {
  .text {
    padding: 50px;
    font-size: 13px;
    color: var(--color-121212);
    font-family: @font-family-500;
    line-height: 18px;
  }
}
</style>
