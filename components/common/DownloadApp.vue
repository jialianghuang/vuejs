<template>
  <div v-if="scrollToTop" :class="{ 'bridal-index-download-app': isBridalIndex }" class="download-app">
    <div :class="{ 'bridal-icon-box': isBridal }" class="icon-box">
      <az-icon icon-class="a-icon-download-app" class="a-icon-download-app"></az-icon>
    </div>
    <div class="download-container">
      <div class="download-main">
        <h3>{{ nl('page_download_to_enjoy') }}</h3>
        <p v-if="showAppDrainageDes" class="app-des">{{ nl('page_app_drainage_des') }}</p>
        <div class="download-box">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/0-9A-Za-z-BD/3c/9f/fc1b5a911677cd4e73f6b8d9b37d3c9f.png')"
            alt="download qr"
          />
          <div class="download-link">
            <a href="https://azazie.onelink.me/IW0r/8izofs7e">
              <az-icon icon-class="icon-iPhone"></az-icon>
              iPhone
            </a>
            <a href="https://azazie.onelink.me/IW0r/8izofs7e">
              <az-icon icon-class="icon-Android1"></az-icon>
              Android
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

/**
 * 下载app展示组件
 */
export default {
  name: 'DownloadApp',
  languageKeys: ['page_download_to_enjoy', 'page_app_drainage_des'],
  props: {
    isBridalIndex: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      scrollToTop: (state) => state.scrollToTop
    }),
    showAppDrainageDes() {
      const res = this.nl('page_app_drainage_des')
      return res != '' && res != 'page_app_drainage_des'
    }
  }
}
</script>
<style lang="less" scoped>
.download-app {
  position: fixed;
  right: 20px;
  bottom: 150px;
  z-index: @position-z-index;
  cursor: pointer;
  &:hover {
    .download-container {
      display: block;
    }
  }
  .icon-box {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: var(--color-f1e9e6);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    &:hover {
      opacity: 0.95;
    }
    img {
      width: 19px;
      height: 26px;
    }
    .a-icon-download-app {
      fill: var(--color-121212);
      width: 26px;
      height: 36px;
    }
    &.bridal-icon-box {
      background: #fff;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    }
  }
  .download {
    &-container {
      display: none;
      position: absolute;
      right: 45px;
      bottom: 50%;
      transform: translateY(50%);
      padding-right: 10px;
    }
    &-main {
      position: relative;
      width: 223px;
      // height: 138px;
      background: #ffffff;
      border: 1px solid var(--color-cccccc);
      border-radius: 4px;
      padding: 20px;
      h3 {
        text-align: center;
        font-size: 13px;
        line-height: 18px;
        font-family: @font-family-600;
      }
      &::after {
        content: '';
        width: 10px;
        height: 10px;
        border-right: 1px solid var(--color-cccccc);
        border-bottom: 1px solid var(--color-cccccc);
        border-top: 1px solid transparent;
        border-left: 1px solid transparent;
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%) rotate(-45deg);
        background: #fff;
      }
      .app-des {
        font-size: 13px;
        line-height: 18px;
        font-family: @font-family-500;
        margin-top: 5px;
        text-align: center;
      }
    }
    &-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      > img {
        width: 100px;
        height: 100px;
      }
    }
    &-link {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;
      margin-left: 20px;
      border-left: 1px solid var(--color-121212);
      height: 80px;
      a {
        display: flex;
        align-items: center;
        color: var(--color-121212);
        font-size: 13px;
        font-family: @font-family-500;
        &:first-of-type {
          margin-bottom: 20px;
        }
        .az-icon {
          font-size: 24px;
          margin-right: 10px;
        }
      }
    }
  }
}
.bridal-index-download-app {
  z-index: 8 !important;
}
</style>
