<template>
  <div class="az-upload-box">
    <div class="upload-box">
      <div>
        <div
          @click="uploadClick"
          :class="btnUpload.eventName && btnUpload.eventCategory && 'need_datalayer'"
          :data-datalayer-category="btnUpload.eventCategory"
          :data-datalayer-label="btnUpload.eventName"
          class="upload-btn"
        >
          <img class="upload-btn-img" src="~assets/images/ccpa/ccpa_upload.png" alt="ccpa upload" />
          <span>{{ btnUpload.text }}</span>
        </div>
        <input ref="uploadInput" @change="addUpload($event)" :accept="acceptFileType.accept" class="upload-input" type="file" multiple />
      </div>
      <div v-show="btnNearTips.text" class="upload-btn-nearmsg">
        <template v-if="btnNearTips.href">
          <a
            :href="btnNearTips.href"
            :class="btnNearTips.eventName && btnNearTips.eventCategory && 'need_datalayer'"
            :data-datalayer-category="btnNearTips.eventCategory"
            :data-datalayer-label="btnNearTips.eventName"
            >{{ btnNearTips.text }}</a
          >
        </template>
        <span v-else>{{ btnNearTips.text }}</span>
      </div>
    </div>
    <ul v-show="tipsList && tipsList.length" class="tips-list">
      <li v-for="(item, index) in tipsList" :key="index">
        {{ item }}
      </li>
    </ul>
    <ul v-show="submitErrorTips && submitErrorTips.length" class="tips-error-list">
      <li v-for="(item, index) in submitErrorTips" :key="index">
        {{ item }}
      </li>
    </ul>
    <az-upload-list :fileList="fileList" v-if="fileList && fileList.length">
      <template v-slot:hover="val">
        <az-icon @click="deletUpload(val.index)" class="hover-img" icon-class="icon-ccpa_close"></az-icon>
      </template>
      <az-icon slot="normal" class="normal-img" icon-class="icon-ccpa_select"></az-icon>
    </az-upload-list>
  </div>
</template>

<script>
import AzIcon from '@/components/az-ui/AzIcon'
import AzUploadList from '@/components/user/Upload/AzUploadList'
export default {
  name: 'AzUploadMore',
  components: {
    AzIcon,
    AzUploadList
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
      default: 1024 * 1024 * 10
    },
    totalSize: {
      type: Number,
      default: 1024 * 1024 * 10
    },
    acceptFileType: {
      type: Object,
      default() {
        return {
          accept: '.xlsx,.xls,.csv,.pdf,.doc,.docx',
          typeArray: [
            'application/vnd.ms-excel',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]
        }
      }
    },
    btnUpload: {
      type: Object,
      default() {
        return {}
      }
    },
    tipsList: {
      type: Array,
      default() {
        return []
      }
    },
    btnNearTips: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      fileList: [],
      submitErrorTips: []
    }
  },
  computed: {
    fileTotalSize() {
      return (this.fileList || []).reduce((prev, item) => prev + item.size, 0)
    }
  },
  methods: {
    uploadClick() {
      this.$refs.uploadInput.click()
    },
    addUpload(event) {
      this.submitErrorTips = []
      const files = event.target.files
      if (files.length + this.fileList.length > this.limit) {
        alert(`${this.limit} files max`)
      } else {
        for (let i = 0, len = files.length; i < len; i++) {
          const file = files[i]
          console.log(file.type)
          if (!this.acceptFileType.typeArray.includes(file.type)) {
            alert(this.nl('page_ccpa_tips_file_error'))
            continue
          }
          if (this.maxSize && file.size > this.maxSize) {
            // alert(`File is too big. Max ${this.getFileSizeName(this.maxSize)} bytes per image allowed\n\nPlease check your image(s) in red`)
            alert(this.nl('page_ccpa_tips_size_error').replace('{X}', this.getFileSizeName(this.maxSize)))
            continue
          }
          if (this.totalSize && this.fileTotalSize + file.size > this.totalSize) {
            alert(this.nl('page_ccpa_tips_total_size_error').replace('{X}', this.getFileSizeName(this.totalSize)))
            // alert(`Please note that the uploaded file should not exceed ${this.getFileSizeName(this.totalSize)}.`)
            continue
          }
          this.fileList.push(file)
        }
      }
      this.$refs.uploadInput.value = ''
    },
    getFileSizeName(size) {
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return Math.floor(size / 1024) + 'KB'
      } else if (size < 1024 * 1024 * 1024) {
        return Math.floor(size / 1024 / 1024) + 'MB'
      }
    },
    upload() {
      this.submitErrorTips = []
      if (!this.fileList || this.fileList.length === 0) {
        this.submitErrorTips.push(this.nl('page_ccpa_tips_upload_form'))
        return
      }
      const formData = new FormData()
      this.fileList.map((item, index) => {
        formData.append(this.nameList[index], item)
      })
      return formData
    },
    deletUpload(index) {
      this.fileList.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
@themeColor: var(--color-121212);
.az-upload-box {
  font-family: @font-family-500;
  font-size: 13px;
  .upload-box {
    font-family: @font-family-500;
    display: flex;
    align-items: center;
    position: relative;
    .upload-btn {
      border: 1px solid @themeColor;
      width: 367px;
      height: 40px;
      box-sizing: border-box;
      cursor: pointer;
      color: @themeColor;
      display: flex;
      align-items: center;
      justify-content: center;
      .upload-btn-img {
        margin-right: 10px;
        height: 15px;
        width: 21px;
      }
    }
    .upload-input {
      width: 0;
      height: 0;
      visibility: hidden;
      position: absolute;
      top: 0;
    }
    .upload-btn-nearmsg {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 377px;
      cursor: pointer;
      white-space: nowrap;
      text-transform: uppercase;
      a {
        color: @themeColor;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .tips-list {
    margin-top: 10px;
    color: var(--color-999999);
    line-height: 18px;
  }
  .tips-error-list {
    margin-top: 5px;
    line-height: 18px;
    color: var(--color-ff0000);
  }
}
</style>
