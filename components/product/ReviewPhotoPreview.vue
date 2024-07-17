<template>
  <az-overlay @click="closePreview" :z-index="12">
    <div v-if="srcList[curIndex].type == 'video'" class="preview-video-box video">
      <video :src="cdnReplace(srcList[curIndex].videoUrl)" autoplay muted controls width="100%"></video>
      <div v-show="curIndex != 0" @click="prevClick" class="prev"></div>
      <div v-show="curIndex != srcList.length - 1" @click="nextClick" class="next"></div>
    </div>
    <div v-else :style="{ width: `${width + 8}px`, height: `${height + 54}px` }" class="preview-box">
      <div :style="{ width: `${width}px`, height: `${height}px` }" class="img-box">
        <img
          ref="bigImg"
          v-if="srcList.length && from == 'product'"
          :style="{ width: `${width}px`, height: `${height}px` }"
          :src="replaceImgCdnUrl(srcList[curIndex].bigImgUrl)"
          @load="imgLoad"
          alt="review photo"
          class="big-img"
        />
        <img
          ref="bigImg"
          v-else-if="srcList.length && from == 'reviews'"
          :style="{ width: `${width}px`, height: `${height}px` }"
          :src="replaceImgCdnUrl(srcList[curIndex])"
          @load="imgLoad"
          alt="review photo"
          class="big-img"
        />
        <div v-show="curIndex != 0" @click="prevClick" class="prev"></div>
        <div v-show="curIndex != srcList.length - 1" @click="nextClick" class="next"></div>
      </div>
      <div class="preview-container">
        <div @click="closePreview" class="right-close"></div>
        <div class="left">
          <div class="left-title">{{ baseInfo.shownGoodsName }}</div>
          <div v-if="srcList.length > 1" class="left-number">{{ `${curIndex + 1} of ${srcList.length}` }}</div>
        </div>
      </div>
    </div>
  </az-overlay>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import { mapGetters } from 'vuex'
export default {
  name: 'ReviewPhotoPreview',
  components: {
    AzOverlay
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    srcList: {
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: 'product'
    }
  },
  data() {
    return {
      curIndex: 0,
      width: 250,
      height: 250
    }
  },
  computed: {
    ...mapGetters({
      baseInfo: 'product/getBaseInfo'
    })
  },
  created() {
    this.curIndex = this.index
  },
  mounted() {
    let size = localStorage.getItem('previewSize')
    if (size) {
      size = JSON.parse(size)
      this.width = size.width
      this.height = size.height
    }
  },
  beforeDestroy() {
    const size = {
      width: this.width,
      height: this.height
    }
    localStorage.setItem('previewSize', JSON.stringify(size))
  },
  methods: {
    imgLoad(event) {
      const clientSize = this.getClientSize()
      if (!this.$refs.bigImg) return
      let imgWidth = this.$refs.bigImg.naturalWidth
      let imgHeight = this.$refs.bigImg.naturalHeight
      if (clientSize.clientWidth > imgWidth && clientSize.clientHeight > imgHeight + 46) {
        this.width = imgWidth
        this.height = imgHeight
      } else if (clientSize.clientHeight <= imgHeight + 46) {
        imgHeight = (clientSize.clientHeight - 46) * 0.8
        imgWidth = (this.$refs.bigImg.naturalWidth / this.$refs.bigImg.naturalHeight) * imgHeight
        this.width = imgWidth
        this.height = imgHeight
      } else if (clientSize.clientWidth <= imgWidth) {
        imgWidth = clientSize.clientWidth * 0.8
        imgHeight = (this.$refs.bigImg.naturalHeight / this.$refs.bigImg.naturalWidth) * imgWidth
        this.width = imgWidth
        this.height = imgHeight
      }
    },
    getClientSize() {
      let clientWidth = window.innerWidth
      let clientHeight = window.innerHeight
      if (typeof clientWidth != 'number') {
        if (document.compatMode == 'CSS1Compat') {
          clientWidth = document.documentElement.clientWidth
          clientHeight = document.docuementElement.clientHeight
        } else {
          clientWidth = document.body.clientWidth
          clientHeight = document.body.clientHeight
        }
      }
      return { clientWidth, clientHeight }
    },
    prevClick() {
      if (this.curIndex == 0) return
      this.curIndex--
    },
    nextClick() {
      if (this.curIndex == this.srcList.length) return
      this.curIndex++
    },
    closePreview() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.preview-video-box {
  position: relative;
  width: fit-content;
  width: 960px;
  height: 720px;
  video {
    width: 100%;
    height: 100%;
    min-width: 540px;
    max-width: 65vw;
  }
  &.video {
    .prev,
    .next {
      height: 70%;
    }
  }
}
.preview-box {
  position: relative;
  width: 258px;
  height: 304px;
  .img-box {
    position: relative;
    width: 250px;
    height: 250px;
    border: 4px solid #fff;
    border-radius: 3px;
    background: #fff url(~assets/images/lightbox/loading.gif) center center no-repeat;
    .big-img {
      border-radius: 3px;
    }
  }
  .preview-container {
    box-sizing: border-box;
    height: 46px;
    padding: 5px 4px;
    color: #ccc;
    .left {
      text-align: left;
      line-height: 1.1em;
      height: 36px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .left-title {
        font-weight: 700;
        line-height: 1em;
        margin-bottom: 5px;
      }
      .left-number {
        color: #999;
      }
    }
    .right-close {
      float: right;
      margin-left: 10px;
      width: 30px;
      height: 30px;
      background: url(~assets/images/lightbox/close.png) center center no-repeat;
      text-align: right;
      outline: 0;
      opacity: 0.7;
      transition: opacity 0.2s;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
}
.prev,
.next {
  position: absolute;
  top: 0;
  z-index: 10;
  height: 100%;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.6s;
  &:hover {
    opacity: 1;
  }
}
.prev {
  left: 0;
  width: 34%;
  background: url(~assets/images/lightbox/prev.png) left 48% no-repeat;
}
.next {
  right: 0;
  width: 64%;
  background: url(~assets/images/lightbox/next.png) right 48% no-repeat;
}
</style>
