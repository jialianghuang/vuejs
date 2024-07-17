<template>
  <div class="az-klarna-box">
    <div class="container">
      <az-icon icon-class="icon-theme-klarna" class="klarna-icon"></az-icon>
      <div class="text-box">
        <div v-html="nl('page_klarna_osm_text1')" class="message"></div>
        &nbsp;
        <div v-html="nl('page_klarna_osm_text2')" @click="showPop" class="btn"></div>
      </div>
    </div>
    <template>
      <div v-if="AZKlarnaLayerShow" class="az-klarna-layer-box">
        <az-popup :overlayZIndex="12" @close-on-click-overlay="closeDialog">
          <div class="az-klarna-layer">
            <div @click="closeDialog" class="close-popup">
              <az-icon icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
            </div>
            <div class="popup-content">
              <div class="icon_title">
                <az-icon class="icon" icon-class="icon-klarna-title"></az-icon>
              </div>
              <div class="title">{{ nl('page_klarna_layer_title', null, { purchaseAmount: purchaseAmountDisplay }) }}</div>
              <div v-html="nl('page_klarna_layer_sub_title')" class="desc"></div>
              <div class="detail-block">
                <div class="detail-item">
                  <span class="dot"></span>
                  <div v-html="nl('page_klarna_layer_desc_text1')" class="txt"></div>
                </div>
                <div class="detail-item">
                  <span class="dot"></span>
                  <div v-html="nl('page_klarna_layer_desc_text2')" class="txt"></div>
                  <az-icon icon-class="icon-theme-klarna" class="klarna-icon"></az-icon>
                </div>
                <div class="detail-item">
                  <span class="dot"></span>
                  <div v-html="nl('page_klarna_layer_desc_text3')" class="txt"></div>
                </div>
                <div class="detail-item">
                  <span class="dot"></span>
                  <div v-html="nl('page_klarna_layer_desc_text4')" class="txt"></div>
                </div>
              </div>
              <div @click="closeDialog" class="btn">{{ nl('page_klarna_layer_btn') }}</div>
            </div>
          </div>
        </az-popup>
      </div>
    </template>
  </div>
</template>

<script>
import azPopup from '@/components/az-ui/Popup/AzPopup'
export default {
  silent: true,
  name: 'AZKlarnaMessaging',
  languageKeys: [
    'page_klarna_osm_text1',
    'page_klarna_osm_text2',
    'page_klarna_layer_title',
    'page_klarna_layer_sub_title',
    'page_klarna_layer_desc_text1',
    'page_klarna_layer_desc_text2',
    'page_klarna_layer_desc_text3',
    'page_klarna_layer_desc_text4',
    'page_klarna_layer_btn'
  ],
  components: { azPopup },
  props: {
    purchaseAmountDisplay: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      AZKlarnaLayerShow: false
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    showPop() {
      this.AZKlarnaLayerShow = true
    },
    closeDialog() {
      this.AZKlarnaLayerShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.az-klarna-box {
  margin-top: 5px;
  width: 100%;
  .container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 13px;
    line-height: 18px;
    color: var(--color-121212);
    width: 100%;
    .klarna-icon {
      width: 60px;
      height: 30px;
      padding-right: 10px;
    }
    .text-box {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      font-family: @font-family-500;
      .btn {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .az-klarna-layer {
    width: 600px;
    box-sizing: border-box;
    position: relative;
    margin: auto;
    background-color: #fff;
    .close-popup {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
    .popup-content {
      padding: 40px;
      .icon_title {
        text-align: center;
        .icon {
          width: 162px;
          height: 40px;
        }
      }
      .title {
        font-size: 28px;
        font-family: @font-family-700;
        margin-top: 30px;
        line-height: 38px;
      }
      .desc {
        font-size: 16px;
        font-family: @font-family-500;
      }
      .detail-block {
        margin-top: 30px;
        .detail-item {
          position: relative;
          font-size: 16px;
          line-height: 30px;
          padding-bottom: 30px;
          padding-left: 20px;
          .txt {
            display: inline-block;
          }
          .klarna-icon {
            width: 60px;
            height: 30px;
            margin-left: 10px;
            vertical-align: middle;
          }
          .dot {
            width: 10px;
            height: 10px;
            background: var(--color-121212);
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:before {
            content: '';
            width: 2px;
            height: auto;
            background: #ccc;
            position: absolute;
            top: 0;
            height: 10px;
            left: 4px;
          }
          &:after {
            content: '';
            width: 2px;
            height: auto;
            background: #ccc;
            position: absolute;
            top: 20px;
            bottom: 0;
            left: 4px;
          }
          &:first-child {
            &:before {
              display: none;
            }
          }
          &:last-child {
            &:after {
              display: none;
            }
          }
        }
      }
      .btn {
        width: 100%;
        background: var(--color-121212);
        color: #fff;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        font-family: @font-family-700;
        cursor: pointer;
      }
    }
  }
}
</style>
