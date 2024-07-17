<template>
  <az-popup-animate
    :isVisible="tryOnPopupShow"
    :popupStyle="{
      width: '370px',
      height: '642px',
      'z-index': 1,
      right: '90px',
      background: ' #fff',
      'box-shadow': '0px 0px 8px 0px rgb(102 102 102 / 38%)'
    }"
  >
    <div v-track.viewOnce="{ id: 'popup_try_on', view: getBiParams('popup') }" class="popup-try-on">
      <div class="modal-top">
        <p class="modal-title">{{ tryOnTitle[uploadStatus] || nl('page_try_it_on') }}</p>
        <az-icon @click="hideTryOnPopup()" class="arrow-down-icon" icon-class="icon-lby_expand_arrow_down"></az-icon>
      </div>
      <div class="modal-content">
        <!-- 图片上传 -->
        <div v-show="isShowUploadPhotoContent" class="upload-photo-content">
          <!-- uploading -->
          <div v-if="uploadStatus == 'uploading'" class="uploading-block">
            <div class="loading-icon"></div>
            <p class="tip-title">{{ nl('page_try_on_uploading_title') }}</p>
            <p>
              {{ nl('page_try_on_uploading_content') }}
            </p>
          </div>
          <!-- upload error -->
          <div v-else-if="uploadStatus == 'uploadingError'" class="upload-error-block">
            <az-icon icon-class="icon-icon_unrecognized" class="icon-upload-unrecognized"></az-icon>
            <p class="tip-title">{{ nl('page_try_on_uploading_error_title') }}</p>
            <p>{{ uploadStatusTip }}</p>
            <div class="try-on-bottom">
              <div @click="addAPhoto()" v-track.view.click="{ common: getBiParams('addanewphoto') }">
                <az-icon icon-class="icon-lby_arrow_left" class="icon-arrow-left"></az-icon>{{ nl('page_try_on_add_a_new_photo') }}
              </div>
            </div>
          </div>
          <!-- upload -->
          <div v-else class="upload-block">
            <az-icon icon-class="icon-icon_upload" class="icon-upload-pc"></az-icon>
            <p class="tip-title">{{ nl('page_try_on_upload_title') }}</p>
            <ul>
              <li>
                <az-icon icon-class="icon-ok" class="icon-ok"></az-icon>
                <p>{{ nl('page_try_on_upload_content_1') }}</p>
              </li>
              <li>
                <az-icon icon-class="icon-ok" class="icon-ok"></az-icon>
                <p>{{ nl('page_try_on_upload_content_2') }}</p>
              </li>
              <li>
                <az-icon icon-class="icon-ok" class="icon-ok"></az-icon>
                <p>{{ nl('page_try_on_upload_content_3') }}</p>
              </li>
              <li>
                <az-icon icon-class="icon-icon_safety" class="icon-safe"></az-icon>
                <p class="theme-color-green">{{ nl('page_try_on_upload_content_4') }}</p>
              </li>
            </ul>

            <div class="try-on-bottom">
              <div @click="chooseAModel" v-track.view.click="{ common: getBiParams('choose a model') }">
                <az-icon icon-class="icon-lby_arrow_left" class="icon-arrow-left"></az-icon>{{ nl('page_try_on_choose_a_model') }}
              </div>
              <div v-track.click="{ common: getBiParams('uploadaphoto') }" class="btn-upload">
                <az-button :needIcon="false" class="btn btn-default">
                  <span>{{ nl('page_product_upload_photo') }}</span>
                </az-button>
                <az-upload-img @upload-img="getUploadImg"></az-upload-img>
              </div>
            </div>
          </div>
        </div>
        <!-- 合成图 -->
        <div v-show="isShowCombContent" class="try-on-main-content">
          <div class="try-main-img">
            <img :src="replaceImgCdnUrl(combImg)" alt="comb" />
          </div>
          <div class="try-on-bottom">
            <div @click="starOver()" v-track.click="{ common: getBiParams('startover') }">
              <az-icon icon-class="icon-lby_arrow_left" class="icon-arrow-left"></az-icon>{{ nl('page_try_on_start_over') }}
            </div>
            <az-button :needIcon="false" @click="shopNow()" v-track.view.click="{ common: getBiParams('buynow') }" class="btn btn-default">
              <span>{{ nl('page_index_shop_now') }}</span>
            </az-button>
          </div>
        </div>
        <!-- 模特图 -->
        <div v-show="isShowModelContent" class="try-on-content">
          <div>{{ nl('page_try_on_model_title') }}</div>
          <div class="try-on-img-content">
            <div
              v-track.view.click="{ common: getBiParams('modelupload', index + 1) }"
              @click="showImg(item.uuid)"
              v-for="(item, index) in uploadList"
              :key="index"
              class="item-img"
            >
              <img :src="replaceImgCdnUrl(item.url)" :alt="item.imgName" />
              <az-icon @click.stop.prevent="deleteImg(index)" icon-class="iconshanchu" class="icon-delete"></az-icon>
            </div>
            <div
              v-track.view.click="{ common: getBiParams('model', index + 1) }"
              @click="showImg(item.uuid)"
              v-for="(item, index) in avatarList"
              :key="item.uuid"
              class="item-img"
            >
              <img :src="replaceImgCdnUrl(item.img_url)" alt="try on" />
            </div>
            <i></i>
            <i></i>
          </div>
        </div>
      </div>
    </div>
  </az-popup-animate>
</template>
<script>
import { mapState } from 'vuex'
import AzPopupAnimate from '@/components/az-ui/Popup/AzPopupAnimate'
import AzUploadImg from '@/components/az-ui/UploadImg/AzUploadImg'
import AzButton from '@/components/az-ui/Button/AzButton'

export default {
  name: 'PopupTryOn',
  languageKeys: [
    'page_try_on_uploading_title',
    'page_try_on_uploading_content',
    'page_try_on_uploading_error_title',
    'page_try_on_add_a_new_photo',
    'page_try_on_upload_title',
    ...new Array(4).fill().map((v, i) => 'page_try_on_upload_content_' + (i + 1)),
    'page_try_on_choose_a_model',
    'page_try_on_start_over',
    'page_try_on_model_title',
    ...AzUploadImg.languageKeys
  ],
  components: { AzPopupAnimate, AzButton, AzUploadImg },
  data() {
    return {
      limitTimes: 0,
      statusTimer: null,
      isShowModelContent: true,
      isShowCombContent: false,
      isShowUploadPhotoContent: false,
      uploadStatus: '',
      uploadStatusTip: '',
      uploadList: [],
      avatarList: [],
      combImg: '',
      tryOnTitle: {
        upload: 'upload a photo',
        uploading: 'UPLOADING YOUR PICTURE',
        uploadingError: 'OOPS! SOMETHING WENT WRONG'
      }
    }
  },
  computed: {
    ...mapState({
      tryOnPopupShow: (state) => state.product.tryOnPopupShow,
      baseInfo: (state) => state.product.baseInfo
    })
  },
  mounted() {
    this.getTryonAvatars()
    const uploadList = localStorage.getItem('tryOnUploadList')
    if (uploadList) this.uploadList = JSON.parse(uploadList)
  },
  methods: {
    // 显示图片上传
    showUploadPhoto() {
      this.isShowModelContent = false
      this.isShowUploadPhotoContent = true
      this.uploadStatus = 'upload'
      this.limitTimes = 0
    },
    // 获取本地上传图片
    getUploadImg(uploadList) {
      this.handleUploadAvatar(uploadList[0].file, uploadList)
    },
    deleteImg(index) {
      this.uploadList.splice(index, 1)
      localStorage.setItem('tryOnUploadList', JSON.stringify(this.uploadList))
    },
    getBiParams(el, index) {
      if (process.server) return
      const params = {
        ec: 'tryinstore',
        el,
        param1: (location && location.href) || '-1'
      }
      if (index)
        params.msg = JSON.stringify({
          report_pos: index
        })

      if (el == 'buynow')
        params.msg = JSON.stringify({
          goodsId: this.baseInfo.goodsId
        })
      return params
    },
    // 上传模特图
    handleUploadAvatar(file, uploadList) {
      this.uploadStatus = 'uploading'
      const formData = new FormData()
      formData.set('avatar', file)
      this.$axios
        .$post('/1.0/tryon/avatar/upload', formData)
        .then((res) => {
          if (res.code == 0) {
            const tempUploadList = JSON.parse(JSON.stringify(uploadList))
            tempUploadList[0].uuid = res.data.avatarUUID
            this.uploadList = tempUploadList.concat(this.uploadList)
            localStorage.setItem('tryOnUploadList', JSON.stringify(this.uploadList))
            this.statusTimer = setTimeout(() => {
              this.statusTimer = null
              this.getAvatarStatus(res.data.avatarUUID)
            }, 4000)
          } else {
            this.uploadStatus = 'uploadingError'
          }
        })
        .catch((error) => {
          this.uploadStatus = 'uploadingError'
          console.log(error)
        })
    },
    // 获取avatar图片状态
    getAvatarStatus(uuid) {
      if (this.limitTimes > 4) {
        // 上传之后先4s调一次状态，后面2s调一次，一共最多5次
        // 上传失败了
        this.uploadStatus = 'uploadingError'
        return false
      }
      this.limitTimes++
      this.$axios.$get(`/1.0/tryon/avatar/${uuid}/status`).then((res) => {
        if (res.code == 0) {
          // res.data.status  processing  processed processing_failed
          if (res.data.status == 'processed') {
            // 上传成功进行合成
            this.getTryonCombImg(uuid)
          } else if (res.data.status == 'processing_failed') {
            this.uploadStatusTip = res.data.error.message
            this.uploadStatus = 'uploadingError'
          } else {
            this.statusTimer = setTimeout(() => {
              this.statusTimer = null
              this.getAvatarStatus(uuid)
            }, 2000)
          }
        } else {
          console.log(res.msg)
        }
      })
    },
    // 获取系统avatar图片
    getTryonAvatars() {
      this.$axios.$get('/1.0/tryon/avatars').then((res) => {
        if (res.code == 0) {
          this.avatarList = res.data
        } else {
          console.log(res.msg)
        }
      })
    },
    // 获取合成图
    getTryonCombImg(avatarUuid) {
      this.combImg = ''
      this.$axios
        .$post('/1.0/tryon/tryon', { avatar_uuid: avatarUuid, goods_id: this.baseInfo.goodsId, color: this.baseInfo.color })
        .then((res) => {
          this.isShowUploadPhotoContent = false
          this.uploadStatus = ''
          if (res.code == 0) {
            this.isShowCombContent = true
            this.combImg = res.data.img_url
            this.setOrderSourceFlag(`tryonbutton`, true)
            localStorage.setItem(`isTryOnCombImgSuccess_${this.baseInfo.goodsId}`, true)
          } else {
            this.isShowModelContent = true
            alert(res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 隐藏弹框
    hideTryOnPopup() {
      this.$store.commit('product/setShowTryOnPopup', false)
      this.isShowModelContent = true
      this.isShowCombContent = false
      this.isShowUploadPhotoContent = false
      this.uploadStatus = ''
      this.uploadStatusTip = ''
    },
    // 显示合成图
    showImg(avatarUuid) {
      this.isShowModelContent = false
      this.isShowUploadPhotoContent = true
      this.uploadStatus = 'uploading'
      this.getTryonCombImg(avatarUuid)
    },
    // shop now
    shopNow() {
      document.querySelector('#description').scrollIntoView({ block: 'center', behavior: 'smooth' })
      this.hideTryOnPopup()
    },
    addAPhoto() {
      this.uploadStatus = 'upload'
    },
    chooseAModel() {
      this.isShowModelContent = true
      this.isShowUploadPhotoContent = false
      this.uploadStatus = ''
    },
    starOver() {
      this.isShowCombContent = false
      this.isShowModelContent = true
    }
  }
}
</script>
<style lang="less" scoped>
.popup-try-on {
  width: 100%;
  .modal-top {
    width: 100%;
    height: 50px;
    background: @theme;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .modal-title {
      color: #fff;
      margin-left: 15px;
      font-size: 14px;
      text-transform: uppercase;
      font-family: @font-family-600, sans-serif;
    }
    .arrow-down-icon {
      color: #fff;
      fill: currentColor;
      margin-right: 15px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .modal-content {
    .try-on-content {
      padding: 15px;
      .try-on-des {
        margin-bottom: 15px;
        font-family: @font-family-600, sans-serif;
      }
      .try-on-img-content {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        justify-content: space-between;
        margin-top: 15px;
        i {
          width: 101px;
        }
        .upload-box {
          background: var(--color-f9f9f9);
          position: relative;
          text-align: center;
          .icon-plus {
            font-size: 20px;
            fill: currentColor;
            color: var(--color-121212);
            margin-top: 45px;
          }
          p {
            font-family: @font-family-500;
            margin: 15px 17px 0 17px;
            text-transform: uppercase;
          }
        }
        .item-img {
          width: 104px;
          height: 144px;
          margin-bottom: 13px;
          position: relative;
          cursor: pointer;
          background: var(--color-f9f9f9);
          .icon-delete {
            position: absolute;
            font-size: 12px;
            top: -6px;
            right: -6px;
            fill: currentColor;
            color: var(--color-121212);
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .try-on-main-content {
      .try-main-img {
        height: 512px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .upload-photo-content {
      text-align: center;
      padding: 15px;
      .uploading-block {
        .loading-icon {
          display: inline-block;
          width: 36px;
          height: 36px;
          background: url('~assets/images/loading.png') center center no-repeat;
          background-size: 100% 100%;
          animation: rotate 1s infinite;
          margin-top: 154px;
          margin-bottom: 40px;
        }
        .tip-title {
          text-align: center;
          margin-bottom: 15px;
        }
      }
      .upload-error-block {
        .icon-upload-unrecognized {
          margin-bottom: 40px;
          margin-top: 110px;
          font-size: 100px;
        }
        .tip-title {
          text-align: center;
          margin-bottom: 15px;
        }
      }
      .upload-block {
        .icon-upload-pc {
          font-size: 100px;
          margin-bottom: 40px;
          margin-top: 40px;
        }
        ul {
          text-align: left;
          li {
            margin-top: 25px;
            position: relative;
            .icon-ok {
              position: absolute;
              font-size: 12px;
              margin-right: 5px;
              top: 4px;
            }
            .icon-safe {
              position: absolute;
              font-size: 12px;
              margin-right: 5px;
              top: 2px;
              font-size: 14px;
              margin-right: 3px;
              margin-left: -1px;
            }
            p {
              padding-left: 17px;
            }
            .theme-color-green {
              color: #00aa55;
            }
          }
        }
      }
      .btn-upload {
        position: relative;
        // margin-top: 30px;
        button {
          width: 100%;
        }
        input {
          cursor: pointer;
        }
      }
      .tip-title {
        text-align: left;
        font-size: 16px;
        font-family: @font-family-600;
      }
    }
    .try-on-bottom {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      > div {
        font-family: @font-family-600;
        cursor: pointer;
      }
      .icon-arrow-left {
        font-size: 12px;
      }
      button {
        min-width: 140px;
      }
    }
  }
}
input[type=file], /* FF, IE7+, chrome (except button) */
input[type=file]::-webkit-file-upload-button {
  /* chromes and blink button */
  cursor: pointer;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
