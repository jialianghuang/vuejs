<template>
  <az-overlay @click="closePreview" :z-index="12">
    <div class="preview-box">
      <div v-if="srcList[curIndex].type == 'video'" class="video-box">
        <video :src="cdnReplace(srcList[curIndex].source)" autoplay muted controls></video>
      </div>
      <div v-else class="img-box">
        <img ref="bigImg" :src="replaceImgCdnUrl(srcList[curIndex].source)" @load="imgLoad" alt="review photo" class="big-img" />
      </div>
      <div v-show="curIndex != 0" @click="prevClick" class="prev"></div>
      <div v-show="curIndex != srcList.length - 1" @click="nextClick" class="next"></div>
      <div class="preview-container">
        <div @click="closePreview" class="right-close"></div>
      </div>
    </div>
  </az-overlay>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
export default {
  name: 'ReviewPreviewItem',
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
    }
  },
  data() {
    return {
      curIndex: 0,
      width: 250,
      height: 250
    }
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
.preview-box {
  position: relative;
  min-width: 480px;
  .video-box {
    width: 960px;
    height: 720px;
    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .img-box {
    position: relative;
    width: 100%;
    max-width: 60vw;
    border: 4px solid var(--color-121212);
    border-radius: 3px;
    background: var(--color-121212) url(~assets/images/lightbox/loading.gif) center center no-repeat;
    background-color: rgba(0, 0, 0, 0.8);
    .big-img {
      width: 100%;
      border-radius: 3px;
      vertical-align: middle;
      max-height: 600px;
      object-fit: contain;
    }
  }
  .prev,
  .next {
    position: absolute;
    top: 0;
    z-index: @position-z-index;
    height: 70%;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.6s;
    &:hover {
      opacity: 1;
    }
  }
  .prev {
    left: 0;
    width: 20%;
    background: url(~assets/images/lightbox/prev.png) left 48% no-repeat;
  }
  .next {
    right: 0;
    width: 20%;
    background: url(~assets/images/lightbox/next.png) right 48% no-repeat;
  }
  .preview-container {
    box-sizing: border-box;
    height: 46px;
    padding: 5px 4px;
    color: #ccc;
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
</style>
