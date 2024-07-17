<template>
  <div>
    <az-popup-layer :lockScroll="true" :z-index="12" @close="close" :title="nl('page_find_wedding_palette')" width="762px" height="auto">
      <div id="upload_gallery">
        <div class="progress_panel">
          <div class="progress">
            <span id="step1" class="step">{{ nl('page_gallery_upload_step1') }}</span>
            <span id="step2" class="step">{{ nl('page_gallery_upload_step2') }}</span>
          </div>
          <div id="pro_img" :class="{ step2: step > 0 }"></div>
        </div>
        <form id="gallery_form" class="gallery-form" action="" method="post" enctype="multipart/form-data">
          <div id="page1" v-if="step === 0">
            <div class="choose">{{ nl('page_gallery_upload_choose_source') }}</div>
            <div class="social-net">
              <div id="device" @click="step = 1" style="margin-left: 347px;">
                <p>{{ nl('page_gallery_upload_device') }}</p>
              </div>
            </div>
          </div>
          <div id="page2" v-if="step === 1">
            <div id="photo-device">
              <div class="computer"></div>
              <p class="bg-file default-bg">
                {{ nl('page_gallery_upload_choose_file') }}
                <input id="file1" ref="uploadInput" @change="addUpload($event)" type="file" name="fileList[]" accept="image/*" />
              </p>
              <div class="max_warning">
                <span class="note">{{ nl('page_logistics_note') }} </span>{{ nl('page_gallery_upload_file_limit') }}
              </div>
              <div @click="step = 0" class="progress_button">
                <img src="~assets/images/static/prev_arrow.png" alt="prev arrow" style="margin-right:5px" />{{ nl('page_js_back') }}
              </div>
            </div>
            <input id="file-social" type="hidden" name="pic_url" />
            <img id="load-pic" src="~assets/images/showroom/load_gallery.gif" alt="load gallery" style="display: none" />
          </div>
          <div id="page3" v-if="step === 2">
            <div id="show_img">
              <img id="gallery_img" v-if="fileList && fileList[0]" :src="replaceImgCdnUrl(fileList[0])" alt="gallery" />
            </div>
            <div
              id="prev"
              @click="
                step = 1
                fileList = []
              "
              class="progress_button"
            >
              <img src="~assets/images/static/prev_arrow.png" alt="prev arrow" style="margin-right:5px" />{{ nl('page_js_back') }}
            </div>
            <div
              id="submit"
              @click="
                $emit('update', fileList)
                close()
              "
              class="progress_button"
            >
              {{ nl('page_v7_goods_submit') }}
            </div>
          </div>
        </form>
        <div id="page4" style="display: none; height: 350px"></div>
      </div>
    </az-popup-layer>
  </div>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'

export default {
  name: 'ColorInspirationUploadLayer',
  components: {
    AzPopupLayer
  },
  data() {
    return {
      limit: 1,
      maxSize: 2048, // 单位kb 默认限制最大图片2M
      step: 0,
      fileList: []
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    addUpload(event) {
      const files = event.target.files
      if (files.length + this.fileList.length > this.limit) {
        // alert(`${this.limit} images max`)
        alert(this.nl('page_upload_limit_images_max', null, { limit: this.limit }))
      } else {
        for (let i = 0, len = files.length; i < len; i++) {
          const file = files[i]
          const type = file.type.replace('image/', '')
          const typeArray = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
          if (!typeArray.includes(type)) {
            // alert('Please only provide JPG/PNG/GIF/BMP files\n\nPlease check your image(s) in red')
            alert(this.nl('page_upload_please_only_provide_JPG_PNG_GIF_BMP_files'))
            continue
          }
          if (file.size > this.maxSize * 1024) {
            // alert('File is too big. Max 2MB bytes per image allowed\n\nPlease check your image(s) in red')
            alert(this.nl('page_upload_file_is_to_big_tips', null, { size: this.maxSize / 1024 }))
            continue
          }
          this.fileList.push(this.getObjectURL(file))
          this.step = 2
        }
      }
      this.$refs.uploadInput.value = ''
    },
    getObjectURL(file) {
      let url = null
      // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file)
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }
  }
}
</script>

<style lang="less" scoped>
#upload_gallery {
  width: 762px;
  height: 485px;
  .progress_panel {
    width: 762px;
    height: 100px;
    background-color: var(--color-f9f9f9);
  }
  #pro_img {
    margin-top: 30px;
  }
  em {
    color: red;
  }

  #prev {
    left: 30px;
    width: 100px;
    border: 1px solid var(--color-cccccc);
    color: var(--color-121212);
    font-size: 14px;
  }
  #submit {
    right: 30px;
    width: 180px;
    background-color: var(--color-121212);
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    font-family: @font-family-600, sans-serif;
  }
  .upload_success {
    text-align: center;
    color: var(--color-121212);
    .success-pic {
      background: url('~assets/images/gallery_social.png') no-repeat;
      background-position: 0 -285px;
      height: 70px;
      width: 70px;
      margin-top: 50px;
      margin-left: 346px;
    }
    .msg_title {
      margin-top: 14px;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 40px;
    }
    .msg_content {
      width: 400px;
      margin-left: 181px;
      margin-bottom: 46px;
      font-size: 14px;
    }
  }

  #pro_img {
    margin-left: 102px;
    margin-top: 30px;
    background: url('~assets/images/gallery_social.png') no-repeat;
    background-position: 0 0;
    height: 40px;
  }
  .step {
    position: relative;
    top: 16px;
    font-size: 14px;
    color: var(--color-121212);
  }
  #step1 {
    margin-left: 52px;
  }
  #step2 {
    margin-left: 56px;
  }
  #step3 {
    margin-left: 66px;
  }
  #step4 {
    margin-left: 92px;
  }

  #page1 {
    display: block;
    text-align: center;
    margin-top: 70px;
    .choose {
      font-size: 24px;
      color: var(--color-121212);
      margin-top: 90px;
    }
    .social-net {
      margin-top: 80px;
      #device {
        float: left;
        margin-left: 130px;
        background: url('~assets/images/gallery_social.png') no-repeat;
        background-position: -192px -155px;
        height: 56px;
        width: 70px;
        &:hover {
          cursor: pointer;
          background-position: -192px -210px;
        }
        p {
          margin-top: 75px;
        }
      }
      #facebook {
        float: left;
        margin-left: 95px;
        background: url('~assets/images/gallery_social.png') no-repeat;
        background-position: -160px -155px;
        height: 56px;
        width: 33px;
        &:hover {
          cursor: pointer;
          background-position: -160px -210px;
        }
        p {
          margin-top: 75px;
          margin-left: -15px;
        }
      }
      #instagram {
        float: left;
        margin-left: 95px;
        background: url('~assets/images/gallery_social.png') no-repeat;
        background-position: -325px -210px;
        height: 56px;
        width: 55px;
        &:hover {
          cursor: pointer;
          background-position: -325px -155px;
        }
        p {
          margin-top: 75px;
          margin-left: -11px;
        }
      }
      #twitter {
        float: left;
        margin-left: 95px;
        background: url('~assets/images/gallery_social.png') no-repeat;
        background-position: -264px -155px;
        height: 56px;
        width: 55px;
        &:hover {
          cursor: pointer;
          background-position: -264px -210px;
        }
        p {
          margin-top: 75px;
        }
      }
    }
  }

  #page2 {
    #photo-device {
      text-align: center;
      .computer {
        margin-left: 300px;
        margin-top: 70px;
        background: url('~assets/images/gallery_social.png') no-repeat;
        background-position: 0px -156px;
        height: 125px;
        width: 165px;
      }
      .note {
        color: var(--color-121212);
        margin-right: 5px;
      }
    }
    .social-img {
      position: relative;
      max-height: 120px;
      max-width: 120px;
      overflow: hidden;
      display: inline-block;
      margin-left: 10px;
      margin-top: 10px;
      &:hover {
        cursor: pointer;
      }
    }
    .progress_button {
      left: 30px;
      width: 100px;
      border: 1px solid #ccc;
      color: var(--color-121212);
      font-size: 14px;
    }
    .progress_next {
      text-align: center;
      margin-left: 521px;
      margin-top: -14px;
    }
    .select-pic {
      background: url('~assets/images/gallery_social.png') no-repeat;
      background-position: 0px -383px;
      height: 25px;
      width: 33px;
      left: 44px;
      top: 47px;
      position: absolute;
    }
    #load-pic {
      display: none;
      position: absolute;
      left: 366px;
      top: 270px;
    }
  }

  #file1 {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 180px;
    height: 40px;
    font-size: 100px;
    /*display: none;*/
    opacity: 0;
    cursor: pointer;
  }

  .button {
    float: left;
    padding: 10px;
    width: 120px;
    height: 30px;
    border: 1px solid var(--color-121212);
    text-align: center;
    line-height: 30px;
    -moz-border-radius: 2px; /* Gecko browsers */
    -webkit-border-radius: 2px; /* Webkit browsers */
    border-radius: 2px; /* W3C syntax */
  }

  .bg-file {
    position: relative;
    overflow: hidden;
    display: inline-block;
    top: 40px;
    width: 180px;
    height: 40px;
  }

  .default-bg {
    background: var(--color-1e1e1e);
    color: #fff;
    width: 180px;
    height: 40px;
    -moz-border-radius: 2px; /* Gecko browsers */
    -webkit-border-radius: 2px; /* Webkit browsers */
    border-radius: 2px; /* W3C syntax */
    border: none;
    font-size: 14px;
    font-weight: 400;
    font-family: @font-family-500, sans-serif;
    text-transform: uppercase;
    line-height: 40px;
    cursor: pointer;
  }
  .error-note {
    margin-bottom: 10px;
    margin-top: 6px;
    color: #f00;
  }
  .error {
    border-color: #f00;
  }
  #term_of_use {
    input {
      position: relative;
      top: 2px;
      margin-right: 5px;
    }
    .term_conditions {
      color: var(--color-121212);
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
#upload_gallery {
  #pro_img {
    margin-left: 237px;
    margin-top: 30px;
    background: url('~assets/images/static/add_your_photo1.png') no-repeat;
    background-position: 0 0;
    height: 40px;
    &.step2 {
      background-image: url('~assets/images/static/add_your_photo2.png');
    }
  }
  #step1 {
    margin-left: 190px;
  }
  #step2 {
    margin-left: 129px;
  }
  #show_img {
    float: left;
    width: 500px;
    height: 290px;
    overflow: hidden;
    margin-left: 134px;
    margin-top: 4px;
    text-align: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  #submit {
    right: 295px;
    width: 180px;
    background-color: var(--color-121212);
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    font-family: @font-family-600, sans-serif;
  }

  .dialog-wrapper {
    width: 100% !important;
  }
}
.max_warning {
  font-size: 13px;
  margin-top: 43px;
}
.progress_button {
  position: absolute;
  bottom: 30px;
  text-align: center;
  line-height: 40px;
  height: 40px;
  -moz-border-radius: 2px; /* Gecko browsers */
  -webkit-border-radius: 2px; /* Webkit browsers */
  border-radius: 2px; /* W3C syntax */
  cursor: pointer;
}
</style>
