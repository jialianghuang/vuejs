<template>
  <az-popup-layer :lockScroll="true" :z-index="12" @close="close" :isVisible="true" width="640px" height="auto" top="382px">
    <div class="dialog_tpl">
      <p class="measurement-video">
        <img class="loading-before" src="" style="display: none;" />
        <span class="start-note">{{ item.title }}</span
        ><video :poster="replaceImgCdnUrl(item.imgUrl)" controls="" preload="auto" width="100%" height="auto" data-setup="{}">
          <!-- 换成多语言 -->
          <source :src="nl('page_video_size_guide_url')" type="video/mp4" />
        </video>
      </p>
    </div>
  </az-popup-layer>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
export default {
  name: 'VideoPopLayer',
  components: {
    AzPopupLayer
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.measurement-video {
  height: auto;
  background-color: black;
  //padding-bottom: 4px;
  padding-top: 3px;
  margin: 0;
  padding: 0;
  background-color: transparent;
  .loading-before {
    position: absolute;
    z-index: 1;
    margin-left: 47%;
    margin-top: 22.5%;
  }
  .start-note {
    position: absolute;
    z-index: 1;
    margin-top: 0;
    margin-left: 2px;
    font-size: 13px;
    font-family: @font-family-600, sans-serif;
  }

  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
