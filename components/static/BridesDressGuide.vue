<template>
  <div class="dress_guide">
    <h3 class="list_title">{{ title }}</h3>
    <div
      v-for="(dressGuide, index) in lists"
      :key="index"
      :data-datalayer-category="dressGuide.eventCategory"
      :data-datalayer-label="dressGuide.eventName"
      @click="
        showVideo = true
        selectItem = dressGuide
      "
      class="pannier_gift_video need_datalayer"
    >
      <img :src="replaceImgCdnUrl(dressGuide.imgUrl)" :alt="dressGuide.imgAlt" />
      <div class="pannier_video_a">{{ dressGuide.title }}</div>
      <div class="pannier_video_b">{{ dressGuide.text }} ></div>
    </div>
    <div id="pannierVideoContainer" v-if="showVideo && selectItem" class="pannier_gift_video_block" style="display: block;">
      <div @click="showVideo = false" class="video_close"></div>
      <p class="measurement">
        <img :src="replaceImgCdnUrl(selectItem.videoImageUrl)" :alt="selectItem.videoImageAlt" style="display: none" />
        <video
          id="pannierVideo"
          :poster="replaceImgCdnUrl(selectItem.videoImageUrl)"
          preload="auto"
          width="640"
          height="360"
          data-setup="{}"
          controls=""
        >
          <source :src="selectItem.videoUrl" type="video/mp4" />
        </video>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BridesDressGuide',
  props: {
    lists: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showVideo: false,
      selectItem: null
    }
  }
}
</script>

<style lang="less" scoped>
.list_title {
  font-size: 24px;
  font-family: @font-family-600;
  color: var(--color-121212);
  line-height: 64px;
  font-weight: normal;
}
.dress_guide {
  width: 1132px;
  margin: 60px auto 0;
  .pannier_gift_video {
    display: inline-block;
    text-decoration: none;
    cursor: pointer;
  }
  .pannier_video_a {
    color: var(--color-121212);
    font-size: 18px;
    font-family: @font-family-600;
    margin-top: 15px;
    margin-bottom: 6px;
    text-decoration: none;
    text-align: center;
  }
  .pannier_video_b {
    color: var(--color-121212);
    font-size: 13px;
    font-family: @font-family-500;
    margin-bottom: 10px;
    text-decoration: none;
    text-align: center;
  }
}
#pannierVideoContainer {
  z-index: @popuy-z-index;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: auto;
  background-color: var(--color-121212);
  background: rgba(0, 0, 0, 0.8);
  .video_close {
    cursor: pointer;
    z-index: 1;
    position: absolute;
    top: 0px;
    bottom: 360px;
    left: 640px;
    right: 0px;
    margin: auto;
    display: block;
    width: 24px;
    height: 24px;
    background: url('~assets/images/a_sprite_l_20190128.png') no-repeat 0 -162px;
  }
}
#pannierVideo {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
