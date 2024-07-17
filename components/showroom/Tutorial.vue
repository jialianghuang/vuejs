<template>
  <div>
    <div
      id="showroom_guide_list"
      ref="showroom_guide_list"
      :class="[{ show: tutorialPopShow }, { 'special-dialog': specialDialog }]"
      :style="dialogStyle"
    >
      <az-overlay v-if="tutorialPopShow" @click="closeDialog()" :overlayStyle="specialDialog ? { background: 'transparent' } : {}">
      </az-overlay>
      <div :class="{ 'dialog-wrapper-hasimg': guideList[currentIndex] && guideList[currentIndex].has_image }" class="dialog-wrapper">
        <az-icon @click="closeDialog()" href="javascript:void(0)" class="dialog-close" icon-class="icon-icon_style_gallery_off" />
        <div class="dialog-content">
          <div id="guide_list_seciont">
            <template v-for="(item, index) in guideList">
              <div
                v-if="currentIndex == index"
                :key="index"
                :id="item.name"
                :bind_e="item.bind_e"
                :backup_e="item.backup_e"
                :backup_type="item.backup_type"
                :style="{ width: item.width }"
                :used_content="item.used_content"
                :class="[
                  { image_style: item.has_image },
                  `guide_list_${index}`,
                  { down: item.name == 'get_social' || item.name == 'assign_dresses' }
                ]"
                class="guide_section"
              >
                <span
                  v-if="currentIndex >= 2"
                  :class="{ down: item.name == 'get_social' || item.name == 'assign_dresses' }"
                  class="joyride-nub"
                ></span>
                <p class="guide_title">{{ item.title }}</p>
                <p class="guide_content">
                  {{
                    (item.name == 'invite_squad' && userList && userList.length > 1) ||
                    (item.name == 'save_fav' && Object.keys(prodList).length)
                      ? item.used_content
                      : item.content
                  }}
                </p>
                <div v-if="item.has_image" class="img_section">
                  <img
                    :data-src="country == 'CA' ? item.img_url_ca || item.img_url : item.img_url"
                    :src="require('~/assets/images/default_img.jpg')"
                    class="lazyload"
                    alt="tutoral"
                  />
                </div>
                <div v-if="Object.keys(item.button).length" class="btn-group">
                  <az-button
                    v-for="(btnItem, btnIndex) in item.button"
                    :key="btnIndex"
                    :class="btnItem.type"
                    :needIcon="false"
                    @click="handleTutorialNext(btnItem.type, index)"
                    class="btn btn-default"
                  >
                    <span> {{ btnItem.name }}</span>
                  </az-button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div v-if="specialDialog" :style="styleOverlay" class="guide-overlay">
      <div :style="styleChildOverlay" class="guide-overlay__main"></div>
    </div>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
import showRoomUtil from '@/plugins/showroomFav'
import { mapState } from 'vuex'
export default {
  name: 'Tutorial',
  components: { AzButton, AzOverlay },
  props: {
    guideList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
      dialogStyle: {},
      styleOverlay: {},
      styleChildOverlay: {}
    }
  },
  computed: {
    ...mapState('showroom', ['tutorialPopShow', 'userList', 'prodList', 'showroomBaseInfo']),
    specialDialog() {
      return Object.keys(this.guideList).length && this.guideList[this.currentIndex] && this.guideList[this.currentIndex].bind_e
    }
  },
  mounted() {
    window.onresize = () => {
      this.$nextTick(() => {
        console.log('setGuidePos onresize')
        this.specialDialog && this.setGuidePos()
      })
    }
  },
  methods: {
    offset(node) {
      let offest = {
        top: 0,
        left: 0
      }
      // 当前为IE11以下, 直接返回{top: 0, left: 0}
      if (!node.getClientRects().length) {
        return offest
      }
      // 当前DOM节点的 display === 'node' 时, 直接返回{top: 0, left: 0}
      if (window.getComputedStyle(node).display === 'none') {
        return offest
      }
      // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
      // 返回值包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。
      // 返回如{top: 8, right: 1432, bottom: 548, left: 8, width: 1424…}
      offest = node.getBoundingClientRect()
      const docElement = node.ownerDocument.documentElement
      return {
        top: offest.top + window.pageYOffset - docElement.clientTop,
        left: offest.left + window.pageXOffset - docElement.clientLeft
      }
    },
    offsetBorder(node) {
      let offest = {
        top: 0,
        left: 0
      }
      // 当前为IE11以下, 直接返回{top: 0, left: 0}
      if (!node.getClientRects().length) {
        return offest
      }
      // 当前DOM节点的 display === 'node' 时, 直接返回{top: 0, left: 0}
      if (window.getComputedStyle(node).display === 'none') {
        return offest
      }
      // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
      // 返回值包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。
      // 返回如{top: 8, right: 1432, bottom: 548, left: 8, width: 1424…}
      offest = node.getBoundingClientRect()
      // const docElement = node.ownerDocument.documentElement
      return {
        top: offest.top,
        left: offest.left
      }
    },
    // 设置dialog位置
    setGuidePos(resetFlag, resetIndex) {
      if (resetFlag && resetIndex != this.currentIndex) return
      // 这个方法执行的时候可能在setTimeout 里面，所以可能会出现 this.$refs.showroom_guide_list 不存在的情况
      if (!this.$refs.showroom_guide_list) return false
      let bindEle = this.guideList[this.currentIndex].bind_type == 'class' ? '.' : '#'
      let bindRelative = document.querySelector(bindEle + this.guideList[this.currentIndex].bind_e)
      if (!bindRelative || (bindRelative && bindRelative.offsetHeight <= 0)) {
        bindEle = this.guideList[this.currentIndex].backup_type == 'class' ? '.' : '#'
        bindRelative = document.querySelector(bindEle + this.guideList[this.currentIndex].backup_e)
      }
      const bindWidth = bindRelative.offsetWidth / 2
      const bindHeight = bindRelative.offsetHeight
      const bindTop = this.offset(bindRelative).top
      const bindLeft = this.offset(bindRelative).left
      const leftBuffer = this.$refs.showroom_guide_list.offsetWidth / 2
      const topBuffer = this.$refs.showroom_guide_list.offsetHeight
      const curLeft = bindLeft + bindWidth - leftBuffer
      let curTop = ''
      // styleOverlay
      this.styleOverlay = {
        'border-top-width': bindTop - 1 + 'px',
        'border-left-width': bindLeft - 1 + 'px',
        width: bindWidth * 2 + 2 + 'px',
        height: bindHeight + 2 + 'px'
      }
      let offHigh = 10
      this.styleChildOverlay = {}
      if (bindWidth <= 20) {
        offHigh = 4
        this.styleChildOverlay = {
          'border-top-width': 2 + 'px', // 默认5
          'border-bottom-width': 2 + 'px' // 默认5
        }
      }

      if (this.guideList[this.currentIndex].name == 'get_social' || this.guideList[this.currentIndex].name == 'assign_dresses') {
        curTop = bindTop - topBuffer - 10 - offHigh
      } else {
        curTop = bindTop + bindHeight + 10 + offHigh
      }
      this.dialogStyle = { top: curTop + 'px', left: curLeft < 0 ? 0 : curLeft + 'px', 'z-index': 10000 }
      bindRelative.scrollIntoView({ block: 'center', behavior: 'smooth' })
      if (!resetFlag)
        setTimeout(() => {
          this.$nextTick(() => {
            this.setGuidePos(true, this.currentIndex)
          })
        }, 1000)
    },
    closeDialog() {
      this.setPoint('tutorial', 'close', 'click', { index: this.currentIndex + 1 })
      this.$store.commit('showroom/setTutorialPopShow', false)
    },
    handleTutorialNext(buttonType, index) {
      // this.setPoint('tutorial', 'entrance', 'click')
      if (buttonType == 'step_next') {
        this.currentIndex = index * 1 + 1
      } else if (buttonType == 'step_pre') {
        this.currentIndex = index * 1 - 1
      }

      if (this.currentIndex > this.guideList.length - 1) {
        this.closeDialog()
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        return false
      }

      if (this.currentIndex * 1 <= 1) {
        this.dialogStyle = {
          top: 0,
          left: 0,
          'z-index': 10000
        }
        return false
      }

      this.$nextTick(() => {
        //  showroom商品列表为空， 则自动加入演示商品ginger
        if (this.prodList.length <= 0 && this.currentIndex * 1 > 1) {
          // 添加收藏
          showRoomUtil.addFav2ShowRoom(this.showroomBaseInfo.showroomId, '1001107', '4495', 0, 1, '', false, (favGoodsList) => {
            this.$store.commit('product/setFavGoodsList', favGoodsList)
            this.$emit('getShowroomProdList')
          })
        }
        this.specialDialog && this.setGuidePos()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.guide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  border-color: rgba(0, 0, 0, 0.5);
  border-bottom-width: 100vh * 100;
  border-right-width: 100vw * 100;
  border-style: solid;
  z-index: @popuy-z-index;
  // box-shadow: inset 0 0 0 10px rgba(0, 0, 0, 0.5);
  .guide-overlay__main {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 5px;
    border: 5px solid #fff;
    box-shadow: inset 0 0 0 1px #fff;
  }
}
#showroom_guide_list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;
  justify-content: center;
  align-items: center;
  z-index: @popuy-z-index;
  &.special-dialog {
    position: absolute;
    top: unset;
    bottom: unset;
    left: unset;
    right: unset;
    justify-content: unset;
    align-items: unset;
  }
  .joyride-nub {
    border-color: #fff;
    border-top-color: transparent !important;
    border-top-style: solid;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    top: -40px;
    border: 10px solid #fff;
    display: block;
    height: 0;
    position: absolute;
    width: 0;
    left: 50%;
    transform: translateX(-50%);
    &.down {
      border-top-color: #fff !important;
      border-bottom-color: transparent !important;
      top: unset;
      bottom: -40px;
    }
  }
  &.show {
    display: flex;
    top: 0px;
    left: 0px;
  }
  .dialog-wrapper {
    position: relative;
    z-index: 10;
    zoom: 1;
    background-color: #ffffff;
    padding: 20px 20px;
    &.dialog-wrapper-hasimg {
      padding-top: 30px;
      // border: 1px solid var(--color-121212);
      .dialog-close {
        width: 14px;
        height: 14px;
      }
      .guide_title {
        font-size: 24px;
      }
    }
    .dialog-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 10px;
      height: 10px;
      cursor: pointer;
    }
    // 内容
    .guide_section {
      position: relative;
      text-align: center;
    }
    .guide_title {
      font-size: 18px;
      font-family: @font-family-600;
      margin-bottom: 10px;
    }
    .guide_content {
      font-size: 13px;
      font-family: @font-family-500;
      margin-bottom: 15px;
    }
    .img_section {
      margin-bottom: 20px;
      img {
        width: 100%;
        vertical-align: middle;
      }
    }
    .btn-group {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .btn-default {
      flex: 1;
      font-size: 13px;
      text-transform: uppercase;
      &:nth-child(2) {
        margin-top: 15px;
      }
    }
  }
}
</style>
