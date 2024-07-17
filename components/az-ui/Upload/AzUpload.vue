<template>
  <div class="az-upload-box">
    <div :class="['upload-box', { hide: hideDom }]">
      <div v-if="limit > fileList.length" @click="uploadClick('image')" class="upload-btn">
        <az-icon class="icon-add-photo" icon-class="icon-addyourphoto"></az-icon>
        <span>{{ nl('page_review_add_yours') }}</span>
      </div>
      <div v-if="showVideoBtn" :class="['upload-btn video', { show: !videoUpload }]" @click="uploadClick('video')">
        <az-icon class="icon-add-video" icon-class="az-upload-video-icon"></az-icon>
        <span>{{ nl('page_common_upload') }} {{ nl('page_video_desc') }}</span>
      </div>
      <input
        ref="uploadInput"
        @change="addUpload($event, 'image')"
        class="upload-input"
        accept="image/*"
        type="file"
        multiple
        aria-label="upload file"
      />
      <input
        ref="videoUploadInput"
        @change="addUpload($event, 'video')"
        class="upload-input"
        accept="video/*"
        type="file"
        aria-label="upload file"
      />
    </div>
    <div :class="['review-source-box', { show: !!fileList.length || videoUpload }]">
      <!-- 视频内容 -->
      <div :class="['review-source-item video-item', { show: videoUpload }]">
        <div v-if="loading" class="loading-box">
          <div class="loadingIcon"></div>
        </div>
        <az-icon v-else @click="previewItem(0, 'video')" icon-class="az-review-play-icon" class="az-play-icon"></az-icon>
        <az-icon @click="deleteVideo" icon-class="az-review-delete-item-icon" class="az-delete-icon"></az-icon>
      </div>
      <!-- 图片内容 -->
      <template v-for="(item, index) in base64Urls">
        <div @click="previewItem(index, 'image')" :key="index" class="review-source-item">
          <az-icon @click.prevent.stop="deletUpload(index)" icon-class="az-review-delete-item-icon" class="az-delete-icon"></az-icon>
          <img :src="item.source" alt="review img" />
        </div>
      </template>
    </div>
    <div v-if="showPreview" class="preview-container">
      <ReviewPreviewItem :index="currentIndex" :src-list="previewList" @close="resetPreview" />
    </div>
  </div>
</template>

<script>
import AzIcon from '@/components/az-ui/AzIcon'
import ReviewPreviewItem from '@/components/review/ReviewPreviewItem'
import { urlToBlob, blobToFile } from '@/assets/js/utils'

export default {
  name: 'AzUpload',
  components: {
    AzIcon,
    ReviewPreviewItem
  },
  props: {
    limit: {
      type: Number,
      default: 5
    },
    nameList: {
      required: true,
      type: Array
    },
    maxSize: {
      type: Number,
      default: 5120 // 单位kb 默认限制最大图片5M
    },
    isReviewList: {
      // 是否是批量评论
      type: Boolean,
      default: false
    },
    showVideoBtn: {
      type: Boolean, // 是否展示视频上传按钮
      default: true
    }
  },
  data() {
    return {
      fileList: [],
      videoUrl: '', // 本地预览视频封面图地址
      videoUpload: false, // 是否上传了视频
      currentIndex: 0, // 预览当前文件下标
      showPreview: false, // 展示预览组件
      previewList: [], // 预览文件地址
      loading: false, // 视频是否上传完成的loading
      base64Urls: [], // 选择图片回显资源地址
      reviewVideo: []
    }
  },
  computed: {
    hideDom({ showVideoBtn, videoUpload, limit, fileList }) {
      if (showVideoBtn) {
        return limit <= fileList.length && videoUpload
      }
      return limit <= fileList.length
    }
  },
  methods: {
    uploadClick(type) {
      if (type === 'video') {
        this.$refs.videoUploadInput.click()
      } else {
        this.$refs.uploadInput.click()
      }
    },
    addUpload(event, type) {
      const files = event.target.files
      if (files.length + this.fileList.length > this.limit && type == 'image') {
        alert(this.nl('page_upload_limit_images_max', null, { limit: this.limit }))
      } else {
        for (let i = 0, len = files.length; i < len; i++) {
          const file = files[i]
          const prefixType = file.type.split('/')[0]
          const suffixType = file.name.substr(file.name.lastIndexOf('.') + 1)
          if (prefixType == 'video') {
            // 校验视频文件大小， 最大50MB
            if (file.size > 50 * 1024 * 1024) {
              alert(this.nl('page_common_upload_video_text'))
              continue
            }
            // 校验视频文件类型 只支持以下格式视频
            if (!['mp4', 'mov', 'MP4', 'MOV'].includes(suffixType)) {
              alert(this.nl('page_common_upload_video_type_text'))
              continue
            }
            this.loading = true
            this.createVideoDom(file)
          } else {
            // 校验图片文件大小， 最大5MB
            if (file.size > this.maxSize * 1024) {
              alert(this.nl('page_upload_file_is_to_big_tips', null, { size: this.maxSize / 1024 }))
              continue
            }
            // 校验图片文件类型 只支持以下格式图片
            const typeArray = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'JPG', 'JPEG', 'PNG', 'GIF', 'BMP']
            if (!typeArray.includes(suffixType)) {
              alert(this.nl('page_common_images_warning_tips'))
              continue
            }
            this.base64Urls.push({
              source: window.URL.createObjectURL(file),
              type: prefixType
            })
            this.fileList.push(file)
          }
          this.$emit('success-upload')
        }
      }
      this.$refs.uploadInput.value = ''
      this.$refs.videoUploadInput.value = ''
    },
    upload() {
      if (this.loading) {
        alert(this.nl('page_common_video_not_completed'))
        return { code: 2, message: 'video not upload' }
      }
      if (!this.fileList.length) this.$emit('success')
      const formData = new FormData()
      this.fileList.map((item, index) => {
        formData.append(this.nameList[index], item)
      })
      return formData
    },
    deletUpload(index) {
      this.fileList.splice(index, 1)
      this.base64Urls.splice(index, 1)
      this.$emit('on-deleted', { list: this.fileList, index })
    },
    createVideoDom(file) {
      const video = document.createElement('video')
      video.setAttribute('crossOrigin', 'anonymous') // 处理跨域
      video.setAttribute('preload', 'auto') // 加上preload属性，否则截取第一帧会黑屏
      // video.setAttribute('autoplay', 'auto')
      video.setAttribute('width', 92)
      video.setAttribute('height', 120)
      video.setAttribute('id', 'review-video')
      video.style.setProperty('object-fit', 'contain')
      const dom = document.querySelector('.review-source-item.video-item')
      dom.appendChild(video, dom)
      video.src = window.URL.createObjectURL(file)
      video.currentTime = 5 // 可以设置video的时间以跳转到某一帧开始播放，可以截取video任意时刻的图片
      // 用箭头函数是为了使用组件this实例， 如果是常规函数this就是video对象
      video.addEventListener('loadeddata', () => {
        // 事件在媒体当前播放位置的视频帧（通常是第一帧）加载完成后触发
        const canvas = document.createElement('canvas')
        const canvasHeight = video.clientHeight
        const canvasWidth = video.clientWidth
        canvas.width = 92
        canvas.height = 120
        canvas.getContext('2d').drawImage(video, 0, 0, canvasWidth, canvasHeight)
        const dataURL = canvas.toDataURL('image/jpeg')
        video.setAttribute('poster', dataURL) // 设置video的封面
        // 上传视频
        this.uploadVideo(file, dataURL)
      })
      this.videoUpload = true
      this.videoUrl = window.URL.createObjectURL(file)
    },
    deleteVideo() {
      this.videoUpload = false
      this.videoUrl = null
      const dom = document.querySelector('.review-source-item.video-item')
      dom.removeChild(document.getElementById('review-video'))
    },
    previewItem(index, type) {
      this.showPreview = true
      if (type == 'image' && this.videoUpload) {
        this.currentIndex = index + 1
      } else {
        this.currentIndex = index
      }
      if (this.videoUpload) {
        this.previewList = [{ source: this.videoUrl, type: 'video' }, ...this.base64Urls]
      } else {
        this.previewList = this.base64Urls
      }
    },
    resetPreview() {
      this.showPreview = false
      this.previewList = []
    },
    async uploadVideo(file, base64Url) {
      const formData = new FormData()
      formData.append('video', file)
      formData.append('image', blobToFile(urlToBlob(base64Url), file.name.replace(/MP4|AVI|MOV|RMVB/gi, 'png'), 'image/png'))
      const res = await this.$axios.$post('/1.0/comment/upload-video', formData)
      this.loading = false
      if (res.code == 0) {
        this.reviewVideo = res.data
        this.$emit('video-uploaded', this.reviewVideo)
      } else {
        this.videoUpload = false
        this.videoUrl = null
        alert(this.nl('page_common_video_upload_fail_text'))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.az-upload-box {
  padding-top: 6px;
  margin-left: 1px;
  border-bottom: 1px solid #ccc;
  .upload-box {
    display: flex;
    position: relative;
    column-gap: 10px;
    margin-bottom: 20px;
    .upload-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 40px;
      font-family: @font-family-600;
      color: @theme-color;
      outline: 1px solid @theme-color;
      cursor: pointer;
      transition: all 0.3s ease;
      span {
        margin-left: 10px;
        text-transform: uppercase;
      }
      .icon-add-photo,
      .icon-add-video {
        width: 17px;
        height: 14px;
        fill: currentColor;
        color: @theme-color;
        cursor: pointer;
      }
      &:hover {
        color: #fff;
        background: @theme-color;
        .icon-add-photo,
        .icon-add-video {
          color: #fff;
        }
      }
      &.video {
        display: none;
      }
      &.show {
        display: flex;
      }
    }
    .upload-input {
      width: 200px;
      display: none;
    }
    &.hide {
      display: none;
    }
  }
  .review-source-box {
    display: none;
    column-gap: 10px;
    &.show {
      display: flex;
    }
    .review-source-item {
      position: relative;
      width: 92px;
      font-size: 0;
      margin-bottom: 20px;
      img {
        width: 100%;
        object-fit: cover;
        height: 120px;
      }
      &.video-item {
        display: none;
      }
      &.show {
        display: block;
      }
      .az-icon {
        font-size: 12px;
        position: absolute;
        top: -6px;
        right: -6px;
        z-index: 2;
        cursor: pointer;
      }
      .az-play-icon {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 36px;
      }
    }
  }
}
.az-upload-box-a {
  .upload-list {
    .item {
      display: inline-block;
      width: 203px;
      height: 27px;
      border-radius: 10px;
      margin-right: 10px;
      margin-bottom: 0;
      text-align: center;
      line-height: 27px;
      background-color: #f6f6f6;
      position: relative;
      text-align: left;
      padding-left: 10px;
      border: 0;
      font-size: 13px;
      .close {
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.loading-box {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: @z-index-2;
}
.loadingIcon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  width: 35px;
  height: 35px;
  background: url('~assets/images/loading.png') center center no-repeat;
  background-size: 100% 100%;
  animation: rotate 1s infinite;
}

@keyframes rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
