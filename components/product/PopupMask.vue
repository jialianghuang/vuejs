<template>
  <div v-if="popupMaskShow">
    <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
      <div class="popup-pannier">
        <div @click="closeDialog()" class="close-popup">
          <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
        </div>
        <div class="popup-content">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/55/b0/176ade3aa7c43e30831ac5bb4abe55b0.png')"
            alt="free garment bag"
          />
          <span>{{ nl('page_product_popup_face_mask_note') }}</span>
        </div>
      </div>
    </az-popup>
  </div>
</template>

<script>
/**
 * 口罩组件暂未使用
 */
import azPopup from '@/components/az-ui/Popup/AzPopup'
import { mapState } from 'vuex'

export default {
  name: 'PopupMask',
  components: { azPopup },
  computed: {
    ...mapState({
      popupMaskShow: (state) => state.product.popupMaskShow
    })
  },
  methods: {
    closeDialog() {
      this.$store.commit('product/setPopupMaskShow', false)
    }
  }
}
</script>

<style lang="less" scoped>
.popup-pannier {
  width: 650px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  margin: auto;
  .close-popup {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .popup-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 40px;
    background: #fff;
    img {
      width: 74px;
      margin-right: 20px;
    }
    span {
      text-align: left;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-121212);
      font-family: @font-family-500;
    }
  }
}
</style>
