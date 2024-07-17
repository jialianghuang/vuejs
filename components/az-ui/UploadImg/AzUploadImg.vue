<template>
  <input id="file" ref="azUploadImg" @change="handleUpload" type="file" name="fileList[]" accept="image/*" />
</template>

<script>
export default {
  name: 'AzUploadImg',
  languageKeys: ['page_upload_big_error'],
  props: {
    maxSize: {
      type: Number,
      default: 5120 // 单位kb 默认限制最大图片5M
    }
  },
  data() {
    return {
      uploadList: [],
      file: []
    }
  },
  mounted() {},
  methods: {
    uploadImg(file) {
      // const config = {
      //   herader: {
      //     'Content-Type': 'multipart/form-data',
      //     token: getToken()
      //   }
      // }
      const formData = new FormData()
      formData.append('file', file)
      // axios.post(`${baseUrl}/basic/uploadFile`, formData, config).then(
      //   (res) => {
      //     if (res.data.code === 0) {
      // this.$emit('addUrl', `http://alipaymini.oss-cn-shanghai.aliyuncs.com${res.data.data}`)
      //     } else {
      //       this.$Message.warning(res.data.msg)
      //     }
      //   },
      //   (error) => {
      //     this.$Message.warning(toString(error))
      //   }
      // )
    },
    testMaxSize(file) {
      let isAllow = false
      if (!file) isAllow = false
      const size = file.size // 注意，这里读到的是字节数
      if (!size) isAllow = false
      let maxSize = this.maxSize
      maxSize = maxSize * 1024 // 转化为字节
      isAllow = size <= maxSize
      return isAllow
    },
    handleUpload(e) {
      const that = this
      const file = e.target.files[0]
      if (this.maxSize) {
        if (!this.testMaxSize(file)) {
          this.$refs.azUploadImg.value = ''
          alert(this.nl('page_upload_big_error'))
          return false
        }
      }
      const reader = new FileReader()
      // 转 base64
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const t = e.target.result
        const image = new Image()
        image.src = t
        image.onload = () => {
          const realHeight = image.height
          const realWidth = image.width
          that.uploadList = [{ url: t, imgName: file.name, size: realWidth + '*' + realHeight, file }]
          that.$emit('upload-img', that.uploadList)
          this.$refs.azUploadImg.value = ''
        }
      }
      // that.file[that.file.length] = file
      return false
    }
  }
}
</script>
<style>
#file {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: 100px;
  opacity: 0;
  cursor: pointer;
}
</style>
