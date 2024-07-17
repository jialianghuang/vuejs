<template>
  <div v-if="popupCustomerPhotoUploadShow">
    <az-popup :overlayZIndex="12" :styles="{ width: 'max-content' }" @close-on-click-overlay="closeDialog">
      <div class="popup-customer-photo-upload">
        <div @click="closeDialog()" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <div class="popup-content">
          <div class="progress_panel">
            <div class="progress">
              <div id="step1" :class="{ active: currentStepId >= 1 }" class="step">
                <span :class="{ active: currentStepId >= 1 }" class="step-icon">1</span>
                <span>{{ nl('page_gallery_upload_step1') }}</span>
              </div>
              <div id="step2" :class="{ active: currentStepId >= 2 }" class="step">
                <span :class="{ active: currentStepId >= 2 }" class="step-icon">2</span>
                <span>{{ nl('page_gallery_upload_step2') }}</span>
              </div>
              <div id="step3" :class="{ active: currentStepId >= 3 }" class="step">
                <span :class="{ active: currentStepId >= 3 }" class="step-icon">3</span>
                <span>{{ nl('page_gallery_upload_step3') }}</span>
              </div>
              <div id="step4" :class="{ active: currentStepId == 4 }" class="step">
                <span :class="{ active: currentStepId == 4 }" class="step-icon">4</span>
                <span>{{ nl('page_gallery_upload_step4') }}</span
                >!
              </div>
            </div>
            <!-- <div id="pro_img" :style="'background-position: 0px ' + stepPosition + 'px'"></div> -->
          </div>
          <form @submit.prevent="onSubmit($event)" class="gallery-form" enctype="multipart/form-data">
            <div :class="{ show: currentStepId == 1 }" class="step-content step-content-1">
              <div class="choose">{{ nl('page_gallery_upload_choose_source') }}</div>
              <div class="social-net">
                <div id="device" @click="changeStep(2, true)">
                  <p>{{ nl('page_gallery_upload_device') }}</p>
                </div>
                <div id="instagram" @click="changeStep(2, false)">
                  <p>{{ nl('page_common_instagram') }}</p>
                </div>
              </div>
            </div>
            <div :class="{ show: currentStepId == 2 }" class="step-content step-content-2">
              <div id="photo-device" :class="{ show: isPhotoDevice }">
                <div class="computer"></div>
                <label for="file" class="btn-choose-file">
                  {{ nl('page_gallery_upload_choose_file') }}
                  <az-upload-img @upload-img="getUploadImg"></az-upload-img>
                </label>
                <div class="max_warning">
                  <span class="note">{{ nl('page_size_note') }}</span>
                  {{ nl('page_gallery_maxium_file_size') }}
                </div>
                <az-button
                  @click="changeStep(1)"
                  :text="nl('page_common_style_quiz_back')"
                  class="progress_button"
                  text-color="#121212"
                  color="#fff"
                >
                  <az-icon icon-class="icon-lby_arrow_left" class="back-icon"></az-icon>
                </az-button>
              </div>
              <div id="photo-ins" :class="{ show: !isPhotoDevice }">
                <p class="text">
                  {{ nl('page_common_share_this') }}
                  <span v-if="errorSelectNoteShow" class="error-note">{{ nl('page_js_select_photo') }}</span>
                </p>
                <div id="ins"></div>
                <az-button @click="changeStep(1, true)" class="progress_button" text-color="#121212" color="#fff" text="BACK">
                  <az-icon icon-class="icon-lby_arrow_left" class="back-icon"></az-icon>
                </az-button>
                <az-button @click="insNext()" class="bg-file default-bg progress_next" text="Next"> </az-button>
              </div>
              <input id="file-social" type="hidden" Yname="pic_url" value="" />
              <img id="load-pic" :src="require('~/assets/images/loading_1.gif')" v-if="loadPic" alt="loading" />
            </div>
            <div :class="{ show: currentStepId == 3 }" class="step-content step-content-3">
              <div class="photo-info-content">
                <div id="show_img">
                  <img
                    id="gallery_img"
                    :src="uploadList.length > 0 ? uploadList[0].url : ''"
                    :name="uploadList.length > 0 ? uploadList[0].imgName : ''"
                    alt="gallery_img"
                  />
                </div>
                <div class="info-form">
                  <ul>
                    <li>
                      <label for="dress">{{ nl('page_common_dress_style') }}:</label>
                      <input
                        id="dress"
                        :placeholder="nl('page_placeholder_eg')"
                        v-model="formInfo.dresStyle"
                        class="w2"
                        type="text"
                        name="dress_style"
                      />
                    </li>
                    <li>
                      <label for="caption">{{ nl('page_common_caption') }}:</label>
                      <input
                        id="caption"
                        :placeholder="nl('page_placeholder_write_review')"
                        v-model="formInfo.caption"
                        class="w2"
                        type="text"
                        name="caption"
                      />
                    </li>
                    <li id="term_of_use" :class="{ error: errorBorder }">
                      <span class="term-of-use-dec">{{ nl('page_common_terms_of_us') }}:<em>*</em></span>
                      <div class="term-of-use-box">
                        <div :class="[{ selected: termOfUse }]" @click.stop="toggleConfirm()" class="checkbox-box">
                          <az-icon v-if="termOfUse" class="icon-checkbox" icon-class="icon-lby_tick_white_s"></az-icon>
                        </div>
                        {{ nl('page_gallery_upload_text1') }}
                        <a :href="countryUrl(`/content-submission-agreement`)" target="_blank" class="term_conditions">
                          {{ nl('page_common_csa_title') }}
                        </a>
                        <span style="padding: 0 2px">{{ nl('page_common_and') }}</span>
                        <a
                          :href="countryUrl(nl('page_common_provacy_policy_pdf_' + country.toLowerCase()))"
                          target="_blank"
                          class="term_conditions"
                        >
                          <span>{{ nl('page_sitemap_privacy') }}</span>
                        </a>
                        <br />
                        {{ nl('page_gallery_upload_text3') }}
                      </div>
                    </li>
                    <li style="float:left;margin-right: 17px;">
                      <label for="user_name">{{ nl('page_email_your_name') }}:<em>*</em></label>
                      <input id="user_name" v-model="formInfo.userName" class="w2" type="text" name="user_name" />
                      <p v-if="errorNameNoteShow" class="error-note">{{ nl('page_email_enter_name') }}</p>
                    </li>
                    <li style="float:left;">
                      <label for="email">{{ nl('page_email_your_email') }}:<em>*</em></label>
                      <input id="email" v-model="formInfo.userEmail" class="w2" type="text" name="email" />
                      <p v-if="errorEmailNoteShow" class="error-note">{{ nl('page_js_enter_valid_add') }}</p>
                    </li>
                  </ul>
                </div>
              </div>
              <az-button id="photo_submit" :disable="isDisable" :text="nl('page_v7_goods_submit')">
                <input :value="nl('page_v7_goods_submit')" type="submit" />
              </az-button>
              <az-button @click="changeStep(2, true)" class="progress_button" text-color="#121212" color="#fff" text="BACK">
                <az-icon icon-class="icon-lby_arrow_left" class="back-icon"></az-icon>
              </az-button>
            </div>
            <div :class="{ show: currentStepId == 4 }" class="step-content upload-success">
              <div class="success-content top">
                <p class="text-top">{{ nl('page_common_style_gallery_text1') }}</p>
                <p class="text-top">{{ nl('page_common_style_gallery_text2') }}</p>
                <p class="coupon-box">{{ couponCode }}</p>
              </div>
              <div class="success-content tips">
                <p class="tips-notice">{{ nl('page_common_style_gallery_text3') }}</p>
                <ul>
                  <li v-for="(item, index) in notices" v-html="nl(item)" :key="index"></li>
                </ul>
              </div>
              <div :class="['btn-wrap', { hideFirstBtn: activityType }]">
                <a :href="countryUrl(`/style-gallery`)">
                  <az-button id="view_gallery" :text="nl('page_gallery_view')" class="btn-default"></az-button>
                </a>
                <az-button
                  id="copy-code-btn"
                  :text="nl('page_common_style_gallery_copy_code')"
                  v-clipboard:copy="couponCode"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                ></az-button>
              </div>
            </div>
          </form>
          <az-toast ref="toast" :message="toastMsg" :duration="2000"></az-toast>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
import azPopup from '@/components/az-ui/Popup/AzPopup'
import AzUploadImg from '@/components/az-ui/UploadImg/AzUploadImg'
import azButton from '@/components/az-ui/AzButton'
import AzToast from '@/components/az-ui/AzToast'
import { mapGetters } from 'vuex'

export default {
  name: 'PopupCustomerPhotoUpload',
  languageKeys: [
    'page_gallery_upload_step1',
    'page_gallery_upload_step2',
    'page_gallery_upload_step3',
    'page_gallery_upload_step4',
    'page_gallery_upload_device',
    'page_common_instagram',
    'page_gallery_upload_choose_source',
    'page_gallery_upload_choose_file',
    'page_size_note',
    'page_gallery_maxium_file_size',
    'page_common_style_quiz_back',
    'page_common_share_this',
    'page_js_select_photo',
    'page_common_dress_style',
    'page_common_caption',
    'page_placeholder_eg',
    'page_common_caption',
    'page_placeholder_write_review',
    'page_common_terms_of_us',
    'page_gallery_upload_text1',
    'page_common_csa_title',
    'page_common_and',
    'page_common_financial_incentive',
    'page_gallery_upload_text3',
    'page_email_your_name',
    'page_email_enter_name',
    'page_email_your_email',
    'page_js_enter_valid_add',
    'page_v7_goods_submit',
    'page_common_style_gallery_text1',
    'page_common_style_gallery_text2',
    'page_common_style_gallery_text3',
    'page_gallery_view',
    'page_common_style_gallery_text4',
    'page_common_style_gallery_text5',
    'page_common_style_gallery_text6',
    'page_common_style_gallery_text7',
    'page_common_style_gallery_text8',
    'page_common_style_gallery_text9',
    'page_common_style_gallery_text10',
    'page_common_style_gallery_text11',
    'page_common_copied',
    'page_common_style_gallery_copy_code',
    ...AzUploadImg.languageKeys
  ],
  components: { azPopup, AzUploadImg, azButton, AzToast },
  props: {
    activityType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentStepId: 1,
      isPhotoDevice: false,
      formInfo: {
        dresStyle: '',
        caption: '',
        phone: '',
        userEmail: '',
        userName: ''
      },
      errorSelectNoteShow: true,
      errorNameNoteShow: false,
      errorEmailNoteShow: false,
      insPhotos: 0,
      showNumber: 10,
      loadPic: false,
      uploadList: [],
      termOfUse: false,
      errorBorder: false,
      isDisable: false,
      notices: [
        `page_common_style_gallery_text4`,
        `page_common_style_gallery_text5`,
        `page_common_style_gallery_text6`,
        `page_common_style_gallery_text7`,
        `page_common_style_gallery_text8`,
        `page_common_style_gallery_text9`,
        `page_common_style_gallery_text10`,
        `page_common_style_gallery_text11`
      ],
      couponCode: '',
      toastMsg: ''
    }
  },
  computed: {
    ...mapGetters({
      popupCustomerPhotoUploadShow: 'product/getPopupCustomerPhotoUploadShow'
    }),
    stepPosition() {
      return this.currentStepId == 1 ? 0 : -((this.currentStepId - 2) * 40 + 42)
    }
  },
  methods: {
    closeDialog() {
      this.currentStepId = 1
      this.$store.commit('product/setPopupCustomerPhotoUploadShow', false)
    },
    // 更换步骤
    changeStep(id, isPhotoDevice) {
      if (id == 2 && !isPhotoDevice) {
        // ins img
        const imgEle = document.querySelector('#ins').querySelector('img')
        if (!imgEle) {
          this.getInsUrl()
          return false
        }
      }
      this.currentStepId = id
      this.isPhotoDevice = isPhotoDevice
    },
    loadImage(imgSrc, callback) {
      const image = new Image()
      image.src = imgSrc
      if (image.complete) {
        callback(image)
        image.onload = () => {}
      } else {
        image.onload = () => {
          callback(image)
          image.onload = () => {}
        }
        image.onerror = () => {}
      }
    },
    // 获取ins授权地址
    getInsUrl() {
      const width = document.body.offsetWidth
      const left = (width - 900) / 2
      this.$axios.$get(`/1.0/style-gallery/instgram`).then((res) => {
        if (res.code == 0 && res.data && res.data.loginUrl) {
          window.open(
            res.data.loginUrl,
            '',
            'height=500,width=900,top=100,left=' + left + ',toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'
          )
        }
      })
    },
    // 选择图片下一步
    insNext() {
      this.uploadList = [{ url: '', imgName: '', size: '' }]
      this.changeStep(3)
    },
    // 获取本地上传图片
    getUploadImg(uploadList) {
      this.uploadList = uploadList
      this.changeStep(3)
    },
    // 提交
    onSubmit(e) {
      if (this.isDisable) {
        return
      }
      this.isDisable = true
      this.errorEmailNoteShow = false
      this.errorNameNoteShow = false
      if (!this.formInfo.userName) {
        this.errorNameNoteShow = true
        this.isDisable = false
        return false
      }
      if (!this.emailFormCheck(this.formInfo.userEmail)) {
        this.errorEmailNoteShow = true
        this.isDisable = false
        return false
      }
      const formData = new FormData(e.target)
      formData.append('size', this.uploadList[0].size)
      formData.append('fileList[]', this.uploadList[0].file)
      if (!this.termOfUse) {
        this.errorBorder = true
        this.isDisable = false
        return
      }
      if (this.termOfUse) {
        formData.append('get_auth', 1)
      }
      if (this.activityType) {
        formData.append('activity_type', this.activityType)
      }
      this.$axios
        .$post(`/1.0/product/style-gallery`, formData)
        .then((res) => {
          if (res.code == 0) {
            this.couponCode = res.data.couponCode
            this.changeStep(4)
          }
        })
        .finally(() => {
          this.isDisable = false
        })
    },
    toggleConfirm() {
      this.termOfUse = !this.termOfUse
      this.errorBorder = false
    },
    onCopy(value) {
      this.toastMsg = this.nl('page_common_copied')
      this.$refs.toast.show()
    },
    onError() {}
  }
}
</script>

<style lang="less" scoped>
.btn-default {
  width: 190px !important;
  height: 40px !important;
  line-height: 40px;
  border: 1px solid var(--color-121212);
  font-size: 13px;
  font-family: @font-family-600;
}
.error-note {
  margin-bottom: 10px;
  margin-top: 6px;
  color: red;
  font-size: 13px;
  font-family: @font-family-500, sans-serif;
}
#load-pic {
  position: absolute;
  left: 366px;
  top: 270px;
}

.popup-customer-photo-upload {
  width: 764px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  margin: auto;
  .w2 {
    width: 218px;
  }
  .close-popup {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .popup-content {
    background: #fff;
    min-height: 575px;
    .progress_panel {
      width: 762px;
      height: 98px;
      background-color: #f9f9f9;
      .progress {
        padding-top: 40px;
        display: flex;
        justify-content: center;
        .step {
          font-size: 13px;
          color: #999999;
          position: relative;
          &:not(:nth-child(0)) {
            margin-left: 30px;
          }
          &.active span {
            color: var(--color-121212);
          }
        }
        .step-icon {
          width: 20px;
          height: 20px;
          background: #cccccc;
          color: #fff !important;
          display: inline-block;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
          margin-right: 5px;
          &.active {
            background: var(--color-121212);
          }
        }
      }
      #pro_img {
        margin-left: 102px;
        margin-top: 16px;
        background: data-uri('~assets/images/gallery_social.png') no-repeat;
        height: 40px;
        background-position: 0px 0px;
      }
    }

    .gallery-form {
      #photo_submit {
        position: absolute;
        width: 190px;
        height: 40px;
        line-height: 40px;
        right: 30px;
        bottom: 30px;
        left: auto;
        border: none;
        input {
          width: 100%;
          height: 100%;
          position: absolute;
          right: 0;
          left: 0;
          opacity: 0;
        }
      }
      .progress_button {
        position: absolute;
        bottom: 30px;
        line-height: 40px;
        height: 40px;
        left: 30px;
        width: 100px;
        border: 1px solid var(--color-121212) !important;
        font-size: 14px;
        .back-icon {
          width: 10px;
          height: 10px;
          fill: currentColor;
          color: var(--color-121212);
          vertical-align: middle;
          margin-right: -1px;
          margin-top: -1px;
          margin-left: -3px;
        }
      }

      .step-content {
        display: none;
        &.show {
          display: block;
        }
      }
      .step-content-1 {
        .choose {
          font-size: 24px;
          color: var(--color-121212);
          margin-top: 87px;
          text-transform: uppercase;
        }
        .social-net {
          display: flex;
          justify-content: space-between;
          width: 218px;
          margin: 50px auto 0;
          p {
            margin-top: 75px;
          }
          #device {
            background: data-uri('~assets/images/style_gallery/device.png') no-repeat;
            height: 44px;
            width: 54px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            cursor: pointer;
            background-size: 100% 100%;
            &:hover {
              color: @theme-color;
            }
          }
          #instagram {
            margin-right: 15px;
            background: data-uri('~assets/images/style_gallery/instagram.png') no-repeat;
            height: 44px;
            width: 44px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            cursor: pointer;
            background-size: 100% 100%;
            &:hover {
              color: @theme-color;
            }
          }
        }
      }
      .step-content-2 {
        #photo-device {
          display: none;
          &.show {
            display: block;
          }
          .computer {
            margin: 101px auto 0;
            background: data-uri('~assets/images/style_gallery/computer.png') no-repeat;
            height: 77px;
            width: 93px;
            background-size: 100% 100%;
          }
          .btn-choose-file {
            display: block;
            background-color: @theme-color;
            color: #fff;
            width: 190px;
            height: 40px;
            font-size: 13px;
            text-transform: uppercase;
            line-height: 40px;
            margin: auto;
            margin-top: 25px;
            font-family: @font-family-600;
            cursor: pointer;
            /deep/ #file {
              z-index: -1;
            }
          }
          .max_warning {
            margin-top: 10px;
            .note {
              color: @theme-color;
              margin-right: 5px;
            }
          }
        }
        #photo-ins {
          display: none;
          margin-top: 30px;
          margin-left: 30px;
          text-align: left;
          &.show {
            display: block;
          }
          p {
            font-family: @font-family-600, sans-serif;
            font-size: 14px;
            color: var(--color-121212);
          }
          .error-note {
            margin-left: 20px;
          }
          .progress_next {
            position: absolute;
            right: 30px;
            left: auto;
            bottom: 30px;
            width: 180px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            font-family: @font-family-600, sans-serif;
          }
        }
      }
      .step-content-3 {
        .photo-info-content {
          margin: 30px 30px 0;
          display: flex;
          #show_img {
            width: 200px;
            height: 290px;
            overflow: hidden;
            margin-right: 25px;
            text-align: center;
            img {
              width: 100%;
            }
          }
          .info-form {
            text-align: left;
            ul {
              li {
                word-spacing: 0;
                margin-bottom: 20px;
                label {
                  display: block;
                  margin-bottom: 5px;
                  font-family: @font-family-600, sans-serif;
                  em {
                    color: @theme-color;
                  }
                }
                &#term_of_use {
                  .term-of-use-dec {
                    font-size: 13px;
                    font-family: @font-family-600, sans-serif;
                    color: var(--color-121212);
                    line-height: 18px;
                    em {
                      color: var(--theme-color);
                    }
                  }
                  .term-of-use-box {
                    margin-top: 10px;
                  }
                  input {
                    position: relative;
                    top: 2px;
                    margin-right: 5px;
                    height: auto;
                  }
                  .checkbox-box {
                    left: 0;
                    z-index: 10;
                    box-sizing: border-box;
                    width: 12px;
                    height: 12px;
                    border: 1px solid #666;
                    display: inline-block;
                    vertical-align: middle;
                    &.selected {
                      background: @theme-color;
                      border: 1px solid @theme-color;
                    }
                    .icon-checkbox {
                      margin: 1px 0 0 1px;
                      color: #fff;
                      width: 9px;
                      height: 9px;
                      vertical-align: top;
                      fill: currentColor;
                    }
                  }
                  &.error {
                    padding: 5px;
                    border: 1px solid red;
                  }
                }
                input {
                  height: 18px;
                  line-height: 18px;
                  // width: 100%;
                  // width: 460px;
                  &#caption {
                    width: 460px;
                  }
                }
                .term_conditions {
                  color: @theme-color;
                  text-decoration: underline;
                  cursor: pointer;
                  text-transform: uppercase;
                }
              }
            }
          }
        }
        #photo_submit {
          background-color: @theme-color!important;
        }
      }
    }

    .upload-success {
      padding: 30px 60px;
      .icon-success {
        font-size: 70px;
        margin: 70px auto 0;
      }
      .msg-title {
        margin-top: 20px;
        font-size: 16px;
        margin-bottom: 30px;
        font-weight: 600;
      }
      .msg-content {
        width: 400px;
        font-size: 14px;
        margin: 0 auto 30px;
      }
      .success-content {
        &.top {
          font-family: @font-family-600;
          color: var(--color-121212);
        }
        .text-top {
          font-size: 13px;
          line-height: 20px;
        }
        .coupon-box {
          width: max-content;
          margin: 30px auto;
          background-color: #fef8f8;
          border: 1px dashed @theme-color;
          padding: 5px 30px;
          box-sizing: border-box;
          color: @theme-color;
          font-size: 24px;
          line-height: 33px;
        }
        &.tips {
          margin: 30px auto;
          font-size: 12px;
          line-height: 20px;
          text-align: left;
        }
        .tips-notice::before {
          content: '*';
        }
        .tips-notice::after {
          content: ':';
        }
        ul {
          list-style-type: none;
          counter-reset: page;
          li {
            &::before {
              counter-increment: page;
              content: counter(page) '.';
              padding-right: 5px;
            }
            /deep/ a {
              color: var(--color-121212);
              text-decoration: underline;
              text-transform: capitalize;
            }
          }
        }
      }
      .btn-wrap {
        display: flex;
        justify-content: center;
        column-gap: 20px;
        #view_gallery {
          background-color: #fff !important;
          outline: 1px solid var(--color-121212);
          font-family: @font-family-600;
          color: var(--color-121212) !important;
        }
        #copy-code-btn {
          width: max-content;
          height: 40px;
          line-height: 40px;
          padding: 0 60px;
          font-family: @font-family-600;
          font-size: 13px;
          color: #fff !important;
        }
        &.hideFirstBtn {
          #reUpload {
            display: none;
          }
        }
      }
    }
  }
}
</style>
