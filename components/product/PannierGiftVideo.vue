<template>
  <div id="pannierVideoContainer" :class="{ show: videoStatus }" class="pannier_gift_video_block">
    <div @click="stopVideo" class="video_close"></div>
    <p class="measurement">
      <img :src="replaceImgCdnUrl(giftInfo.pannier.videoImage)" style="display: none" alt="How to Pack a Crinoline" />
      <video
        id="pannierVideo"
        :poster="replaceImgCdnUrl(giftInfo.pannier.videoImage)"
        preload="auto"
        width="640"
        height="360"
        data-setup="{}"
        controls=""
      >
        <source :src="giftInfo.pannier.videoSource" type="video/mp4" />
      </video>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PannierGiftVideo',
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    giftInfo: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      videoStatus: 'product/getPannierVideoStatus'
    })
  },
  methods: {
    stopVideo() {
      const ele = document.getElementById('pannierVideo')
      if (ele) {
        ele.pause()
        ele.currentTime = 0
      }
      this.$store.commit('product/setPannierVideoStatus', false)
    }
  }
}
</script>

<style lang="less" scoped>
.pannier_gift_video_block {
  z-index: @popuy-z-index;
  display: none;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: auto;
  background-color: var(--color-121212);
  background: rgba(0, 0, 0, 0.8);
  &.show {
    display: block;
  }
  .video_close {
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 360px;
    left: 640px;
    right: 0;
    margin: auto;
    display: block;
    width: 24px;
    height: 24px;
    background: data-uri('../../assets/images/a_sprite_l_20190128.png') 0 -162px no-repeat;
    z-index: 1;
  }
  img {
    display: none;
  }
  video {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
</style>
