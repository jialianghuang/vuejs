<template>
  <az-popup-layer
    v-if="freeGiftDialogShow"
    :z-index="12"
    :title="nl('page_fg_dialog_limited_free_gift_title')"
    @close="closeDialog"
    :class="[freeGiftDialogShow ? 'animation-fade-enter-active' : 'animation-fade-leave-active']"
    width="893px"
    height="auto"
  >
    <div id="free-gift-dialog" class="free-gift-dialog">
      <div class="free-gift-content">
        <!-- 活动 -->
        <div v-for="(moduleItem, moduleIndex) in giftActivity" :key="moduleItem.activityId" class="free-gift-module">
          <free-gift-swiper
            :key="`freeGiftModule-${moduleItem.activityId}`"
            :moduleItem="moduleItem"
            :moduleIndex="moduleIndex"
            @quickShop="handleQuickShop"
            @handleNotice="handleNotice"
          ></free-gift-swiper>
        </div>
      </div>
      <div class="free-gift-bag-content">
        <div class="title-box">
          <div class="left">
            <div class="txt">{{ nl('page_common_items') }}</div>
            <span class="num">({{ giftActivityInfo.selectedNumber || 0 }}/{{ giftActivityInfo.giftNumber || 0 }})</span>
          </div>
          <div @click="handleClear" :class="{ disable: !giftActivityInfo.selectedNumber }" class="right">
            <az-icon icon-class="icon-icon_delete" class="icon"></az-icon>
            <div class="txt">{{ nl('page_common_clear') }}</div>
          </div>
        </div>
        <div class="free-gift-bag">
          <free-gift-bag-swiper
            v-if="selectedGiftGoodsList && selectedGiftGoodsList.length"
            @refreshGiftActivity="refreshGiftActivity"
            @setHasClear="hasClear = true"
          ></free-gift-bag-swiper>
          <div v-else class="empty-bag">
            {{ nl('page_fg_please_select_your_free_gift') }}
          </div>
        </div>
        <div class="btn-box">
          <az-button
            @click="handleAddToBag"
            :text="nl('page_order_add2bag')"
            :disable="!giftActivityInfo.selectedNumber && !hasClear"
            class="add-btn"
          ></az-button>
        </div>
      </div>

      <!-- 因为free-gift-content盒子有滚动功能，这个提示会被overflow属性影响，所以把提示放在最外面，根据父元素free-gift-dialog定位 -->
      <div
        v-show="!!limitedNotice"
        :style="{ left: `${limitedNoticeLeft}px`, top: `${limitedNoticeTop}px` }"
        @mouseenter="handleNotice({ type: 'selft' })"
        @mouseleave="handleNotice({ type: 'leave' })"
        class="limited-notice-tips"
      >
        <az-icon icon-class="icon-already" class="icon" />
        <div class="txt">
          {{ nl('page_fg_limited_click_tips') }}
        </div>
      </div>
    </div>
  </az-popup-layer>
</template>

<script>
import azPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import FreeGiftSwiper from '@/components/freeGift/FreeGiftSwiper'
import FreeGiftBagSwiper from '@/components/freeGift/FreeGiftBagSwiper'
import AzButton from '@/components/az-ui/AzButton'
import { mapState } from 'vuex'

export default {
  name: 'FreeGiftDialog',
  components: {
    azPopupLayer,
    FreeGiftSwiper,
    FreeGiftBagSwiper,
    AzButton
  },
  props: {},
  data() {
    return {
      limitedNotice: false,
      limitedNoticeLeft: 0,
      limitedNoticeTop: 0,
      activityIndex: 0, // 活动index
      currentIndex: 0, // 活动里面的商品index
      hasClear: false
    }
  },
  computed: {
    ...mapState('cart', ['freeGiftDialogShow', 'giftActivityInfo', 'hasGiftActivity']),
    giftActivity() {
      return (this.giftActivityInfo && this.giftActivityInfo.giftActivity) || []
    },
    selectedGiftGoodsList() {
      return (this.giftActivityInfo && this.giftActivityInfo.selectedGiftGoodsList) || []
    }
  },
  watch: {
    freeGiftDialogShow(val) {
      if (this.freeGiftDialogShow) {
        this.hasClear = false
        this.setPoint('select free gift', 'pop up', 'view')
        this.setPoint('addtobag', 'freegift', 'view')
        // 顶部横幅会遮挡住本弹窗，为了避免其他页面受影响，所以在本弹窗出现的时候设置 activity-position-fixed 的层级
        if (
          document.querySelector('#activity_bar.activity-position-fixed') &&
          document.querySelector('#activity_bar.activity-position-fixed').style
        ) {
          document.querySelector('#activity_bar.activity-position-fixed').style.zIndex = 1010
        }
      } else if (
        document.querySelector('#activity_bar.activity-position-fixed') &&
        document.querySelector('#activity_bar.activity-position-fixed').style
      ) {
        document.querySelector('#activity_bar.activity-position-fixed').style.zIndex = ''
      }
    }
  },
  methods: {
    handleQuickShop(params) {
      this.$emit('quickShop', params)
    },
    closeDialog() {
      // 弹窗Confirm弹窗确认是否关闭FreeGiftDialog弹窗
      this.$emit('setConfirmDialog', true)
      // this.$store.commit('cart/setFreeGiftDialogShow', false)
    },
    handleClear() {
      if (!this.giftActivityInfo || !this.giftActivityInfo.selectedNumber) return false
      this.setPoint('select free gift', 'clear', 'click')
      const formData = {}
      const giftActivityIds = []
      this.giftActivity.forEach((item) => {
        giftActivityIds.push(item.activityId)
      })
      this.$set(formData, 'gift_activity_ids', giftActivityIds)
      this.$store.commit('cart/setLoadingFlag', true)
      this.$axios
        .$post(`/1.0/gift/goods/clear`, formData)
        .then((res) => {
          if (res.code == 0) {
            // 更新赠品弹窗信息
            const updataGiftActivityInfo = res.data
            this.$store.commit('cart/setUpdataGiftActivityInfo', updataGiftActivityInfo)
            this.hasClear = true
          } else {
            this.$store.commit('cart/setCartErrorMsg', (res && res.msg) || 'Error')
          }
        })
        .catch((error) => {
          console.log('clesrError:', error)
          this.$store.commit('cart/setCartErrorMsg', (error && error.msg) || 'Error')
        })
        .finally(() => {
          this.$store.commit('cart/setLoadingFlag', false)
        })
    },
    handleAddToBag() {
      this.setPoint('select free gift', 'submit', 'click')
      this.$store.commit('cart/setLoadingFlag', true)
      this.$axios
        .$post(`/1.0/gift/goods/commit`)
        .then((res) => {
          if (res.code == 0) {
            // 提交成功，关闭弹窗，更新购物车信息
            this.$emit('refreshCartList')
            this.$store.commit('cart/setFreeGiftDialogShow', false)
          } else if (res.code == 800008) {
            this.$store.commit('cart/setCartErrorMsg', (res && res.msg) || 'Error')
          } else {
            this.$store.commit('cart/setCartErrorMsg', (res && res.msg) || 'Error')
            this.$store.commit('cart/setFreeGiftDialogShow', false)
          }
        })
        .catch((error) => {
          console.log('commitError:', error)
          this.$store.commit('cart/setCartErrorMsg', (error && error.msg) || 'Error')
          this.$store.commit('cart/setFreeGiftDialogShow', false)
        })
        .finally(() => {
          this.$store.commit('cart/setLoadingFlag', false)
        })
    },

    handleNotice(data) {
      const { moduleIndex, index, type, limited } = data
      if (type === 'selft') {
        this.limitedNotice = true
        return false
      }
      if (!limited || type === 'leave') {
        this.limitedNotice = false
        return false
      }
      this.activityIndex = moduleIndex
      this.currentIndex = index
      const swiperEle = `#free-gift-swipper-${this.activityIndex}`
      const ele = `#add-gift-icon-${this.activityIndex}-${index}`
      const eleBox = document.querySelector(ele)
      const swiperBox = document.querySelector(swiperEle)
      const dialogBox = document.querySelector(`#free-gift-dialog`)
      if (!eleBox || !swiperBox || !dialogBox) {
        this.limitedNotice = false
        return false
      }
      const eleOffset = eleBox.getBoundingClientRect() || {}
      const swiperBoxOffset = swiperBox.getBoundingClientRect() || {}
      const dialogBoxOffset = dialogBox.getBoundingClientRect() || {}
      const offsetLeft = eleOffset.left - swiperBoxOffset.left
      const offsetTop = eleOffset.top - dialogBoxOffset.top
      // left:根据加车icon的位置计算提示框的定位，加车icon距离屏幕左侧的距离 - 父元素距离屏幕左侧的距离  + 加车icon元素宽度的一半
      // top: 根据加车icon的位置计算提示框的定位，加车icon距离屏幕上方的距离 - 父元素距离屏幕上方的距离 + 加车icon元素的高度
      this.limitedNoticeLeft = offsetLeft + eleOffset.width / 2
      this.limitedNoticeTop = offsetTop + eleOffset.height
      this.limitedNotice = true
      if (type === 'click') {
        this.limitedNotice = true
      } else {
        this.limitedNotice = type === 'enter'
      }
    },
    refreshGiftActivity() {
      this.$emit('refreshGiftActivity')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.az-popup-box {
  min-width: 893px;
  // max-height: 80vh;
  // overflow: auto;
  .layer-title {
    margin-bottom: 15px;
  }
}
.free-gift-dialog {
  position: relative;
  .free-gift-content {
    max-height: 418px;
    overflow-y: auto;
    overflow-x: hidden;
    // 重置滚动条样式
    &::-webkit-scrollbar-track-piece {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
  }
  .free-gift-bag-content {
    .title-box {
      height: 50px;
      background: var(--color-f9f9f9);
      border-radius: 5px 5px 0px 0px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      .left {
        font-size: 14px;
        display: flex;
        align-items: center;
        font-family: @font-family-600;
        .txt {
          color: var(--color-121212);
          margin-right: 2px;
          text-transform: capitalize;
        }
        .num {
          color: var(--color-121212);
        }
      }
      .right {
        font-size: 13px;
        display: flex;
        align-items: center;
        cursor: pointer;
        .icon {
          width: 13px;
          height: 13px;
          margin-right: 5px;
        }
        .txt {
          font-family: @font-family-600;
          color: var(--color-999999);
        }
        &.disable {
          cursor: default;
        }
      }
    }
    .free-gift-bag {
      .empty-bag {
        font-size: 14px;
        line-height: 19px;
        padding: 20px 0;
        font-family: @font-family-600;
        color: var(--color-121212);
        text-align: center;
      }
    }
    .btn-box {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
      .add-btn {
        width: auto;
        height: 40px;
        line-height: 40px;
        padding: 0 40px;
        font-size: 14px;
        font-family: @font-family-600;
      }
    }
  }

  .limited-notice-tips {
    width: 286px;
    position: absolute;
    // transform: translate(-50%, 50%);
    transform: translate(-50%, 10px);
    background: #fee0e0;
    border: 1px solid var(--color-121212);
    box-sizing: border-box;
    border-radius: 3px;
    z-index: 1;
    padding: 6px 8px;
    font-size: 13px;
    line-height: 18px;
    color: var(--color-121212);
    /deep/ a {
      color: var(--color-121212);
      text-decoration: underline;
    }
    .icon {
      width: 15px;
      height: 15px;
      float: left;
    }
    .txt {
      margin-left: 23px;
    }
    &:before {
      content: '';
      position: absolute;
      border: 1px solid var(--color-121212);
      border-right: transparent;
      border-bottom: transparent;
      top: -1px;
      background: #fee0e0;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      width: 9px;
      height: 9px;
      box-sizing: border-box;
    }
  }
}
</style>
