<template>
  <div id="gallery-font" @click="showPopupCustomerPhotoUpload()" style="position: relative" class="gallery-font">
    <img
      id="gallery-banner"
      :src="replaceImgCdnUrl(isBridal ? nl('page_image_style_gallery_banner_bridal') : nl('page_image_style_gallery_banner'))"
      alt="add your photo"
      class="gallery-banner"
    />
    <div class="add-photo">
      <az-icon class="icon-add-photo" icon-class="icon-addyourphoto"></az-icon><span class="txt">{{ nl('page_gallery_banner_text') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryBanner',
  methods: {
    showPopupCustomerPhotoUpload() {
      this.$store.commit('product/setPopupCustomerPhotoUploadShow', true)
    }
  }
}
</script>

<style lang="less" scoped>
.gallery-font {
  cursor: pointer;
  .gallery-banner {
    position: relative;
    width: 100%;
    height: auto;
    vertical-align: middle;
  }
  .add-photo {
    width: 210px;
    height: 40px;
    background-color: @theme-color;
    position: absolute;
    top: 69.54%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    .txt {
      font-size: 13px;
      font-family: @font-family-600;
      color: #ffffff;
      line-height: 40px;
      margin-left: 10px;
      text-transform: uppercase;
    }
    .icon-add-photo {
      width: 17px;
      height: 14px;
      fill: currentColor;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
