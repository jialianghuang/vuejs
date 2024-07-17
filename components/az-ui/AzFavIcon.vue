<template>
  <div @mouseenter="handleFavMenu(true)" @mouseleave="handleFavMenu(false)" :class="['icon-fav-wrapper', $route.name]">
    <div @click.stop.prevent="setGoodsFav(-1, isFav, 0)" :class="{ isList: isList }" class="az-fav-icon">
      <az-icon :class="[{ show: isFav && !isFavHover }]" :icon-class="'icon-lby_heart_1'" font-size="33px" class="icon-fav-heart"></az-icon>
      <az-icon :class="{ show: isFav && isFavHover }" :icon-class="'icon-lby_heart_3'" font-size="33px" class="icon-fav-heart"></az-icon>
      <az-icon :class="{ show: !isFav }" font-size="33px" icon-class="icon-lby_heart_2"></az-icon>
    </div>
    <div :class="{ show: isFavHover && !isFavOut }" class="sub_menu_box">
      <ul :class="{ 'save-this-ul': isLogin }" class="sub_menu">
        <template v-if="isLogin && showroomList.length > 0">
          <template v-for="(item, index) in showroomList">
            <li v-if="item.canCreateStore" :key="index" @click.stop.prevent="clickCreateStoreList" class="save-this-list">
              {{ nl('page_storefront_create_new_store_list') }}
            </li>
            <li
              v-else
              :key="index"
              @click.stop.prevent="setGoodsFav(item.showroomId, item.isAdded, item.favoriteId, item.isStorefront)"
              class="save-this-list"
            >
              {{ item.isAdded ? nl('page_showroom_remove_from') : nl('page_showroom_save_to') }}
              {{ item.roomName }}
            </li>
          </template>
        </template>
        <li v-else-if="isLogin" @click.stop.prevent="setGoodsFav(-1, isFav, 0)" class="save-this-tip">
          {{ nl('page_showroom_save_to_favor') }}
        </li>
        <li v-else @click.stop.prevent="setGoodsFav(-1, isFav, 0)" class="sign-save-this-tip">
          {{ nl('page_showroom_sign_in_save_to_favor') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import showRoomUtil from '@/plugins/showroomFav'
import { mapState } from 'vuex'

export default {
  name: 'AzFavIcon',
  languageKeys: [
    'page_showroom_remove_from',
    'page_showroom_save_to',
    'page_showroom_save_to_favor',
    'page_showroom_sign_in_save_to_favor',
    'page_storefront_create_new_store_list'
  ],
  filters: {
    /* 过滤roomName名称显示格式 */
    filtRoomName(e) {
      let res = e
      // 页面中视图显示位置最多显示7位，如果roomName大于7位，就要做格式过滤处理
      if (e.length > 7) {
        // 格式:abcdd...(1),abcdefg...
        // 先判断字符串中有没有（），如果有格式第一种，如果没有格式第二种
        const reg = /\(|\)/g // 正则校验字符串中是否有括号
        if (reg.test(res)) {
          res = res.substring(0, 5) + '...' + res.substring(res.length - 3, res.length)
        } else {
          res = res.substring(0, 7) + '...'
        }
      }
      return res
    }
  },
  props: {
    goodsId: {
      type: Number,
      default: 0
    },
    colorId: {
      type: Number,
      default: 0
    },
    goodsSize: {
      // 据了解现在只有0的情况
      type: Number,
      default: 0
    },
    isList: {
      type: Boolean,
      default: false
    },
    goodsCatId: {
      type: Number,
      default: 0
    },
    // 是否展示登录弹框
    showSignLayer: {
      type: Boolean,
      default: false
    },
    // 登录弹框组件操作成功后的跳转
    signLayerSource: {
      type: String,
      default: ''
    }
    // sashColorId: {
    //   type: Number,
    //   default: 0
    // }
  },
  data() {
    return {
      showroomList: [],
      isFavHover: false,
      animation: false,
      isFavOut: true,
      disabled: false
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      showRoomNum: (state) => state.userInfo.showRoomNum,
      storeRoomNum: (state) => state.userInfo.storeRoomNum,
      favGoodsList: (state) => state.product.favGoodsList,
      storefrontStatus: (state) => state.product.storefrontStatus,
      prodList: (state) => state.list.prodList,
      selectedColor: (state) => state.product.selectedColor
    }),
    isFav() {
      let flag = false
      if (this.favGoodsList[this.goodsId]) {
        flag = this.favGoodsList[this.goodsId].some((element) => {
          return element.colorId == this.colorId
        })
      }
      return flag
    }
  },
  mounted() {
    if (this.$route.name == 'product') {
      this.buryPoint(this, 'event', {
        ec: 'showroom',
        el: 'icon',
        ea: 'view',
        msg: JSON.stringify({
          goodsId: this.baseInfo.goodsId,
          color: this.selectedColor.key,
          cat_name: this.baseInfo.catName,
          dress_type: this.baseInfo.dressType || this.dressType
        })
      })
    }
  },
  methods: {
    // 点击创建一个门店收藏列表
    clickCreateStoreList() {
      this.$store.commit('list/setShowCreateStoreList', true)
    },
    handleFavMenu(isFavHover) {
      if (isFavHover) {
        this.isFavOut = false
        this.getFavShowroomList()
      } else {
        this.isFavOut = true
        this.isFavHover = false
      }
    },
    // 获取当前颜色商品尺码收藏信息
    getFavShowroomList() {
      const params = {
        goods_id: this.goodsId,
        color_id: this.colorId,
        goods_size: this.goodsSize
      }
      this.$axios.$get(`/1.0/showroom/showroom-status`, { params }).then((res) => {
        if (res.code == 0) {
          this.showroomList = res.data
        }
        this.isFavHover = true
      })
    },
    // 提交收藏
    setGoodsFav(showroomId, isAdded, favoriteId, isStorefront) {
      if (this.disabled) {
        return
      } else {
        this.disabled = true
      }
      const tempTime = setTimeout(() => {
        this.disabled = false
        clearTimeout(tempTime)
      }, 1000)
      if (this.$route.name == 'product') {
        this.buryPoint(this, 'event', {
          ec: 'showroom',
          el: !isAdded ? 'add' : 'remove',
          ea: 'click',
          msg: JSON.stringify({
            goodsId: this.baseInfo.goodsId,
            color: this.selectedColor.key,
            cat_name: this.baseInfo.catName,
            dress_type: this.baseInfo.dressType || this.dressType
          })
        })
      }
      if (this.$route.name == 'list') {
        this.buryPoint(this, 'event', {
          ec: 'lovebutton',
          el: !isAdded ? 'lovebutton_add' : 'lovebutton_remove',
          ea: 'click'
        })
      }
      const showRoomNum = this.showRoomNum
      const self = this
      this.setDataLayer({
        category: 'ListpageRevision',
        action: 'click',
        label: 'ShowroomVersion_Click'
      })

      if (!this.isLogin) {
        // 未登录跳转登录
        sessionStorage.setItem('fav_goods_id', this.goodsId)
        sessionStorage.setItem('fav_colorKey', this.colorId)
        sessionStorage.setItem('fav_goods_size', this.goodsSize)
        if (this.showSignLayer) {
          // 展示登录弹框
          this.$store.commit('setShowSignLayer', true)
          this.$store.commit('setSignLayerSource', this.signLayerSource)
        } else {
          const backUrl = location.href
          const link = this.countryUrl('/user/login') + '?back=' + encodeURIComponent(backUrl)
          location.href = link
        }
      } else if (showRoomNum == 0 && !isStorefront) {
        // 已登录无showroom
        sessionStorage.setItem('fav_goods_id', this.goodsId)
        sessionStorage.setItem('fav_colorKey', this.colorId)
        sessionStorage.setItem('fav_goods_size', this.goodsSize)
        if (this.storeRoomNum != 0) {
          // 添加收藏
          const sourceTag = this.getSourceTag({ catId: this.goodsCatId })
          showRoomUtil.addFav2ShowRoom(
            showroomId,
            self.goodsId,
            self.colorId,
            self.goodsSize,
            0,
            sourceTag,
            isStorefront,
            (favGoodsList) => {
              this.$store.commit('product/setFavGoodsList', favGoodsList)
            }
          )
        }
        this.createShowroom()
      } else if (isAdded) {
        // 取消收藏
        showRoomUtil.delFavFromShowRoom(
          showroomId,
          favoriteId,
          self.goodsId,
          self.colorId,
          self.goodsSize,
          isStorefront,
          (favGoodsList) => {
            this.$store.commit('product/setFavGoodsList', favGoodsList)
          },
          true,
          this
        )
      } else {
        // 添加收藏
        const sourceTag = this.getSourceTag({ catId: this.goodsCatId })
        showRoomUtil.addFav2ShowRoom(showroomId, self.goodsId, self.colorId, self.goodsSize, 0, sourceTag, isStorefront, (favGoodsList) => {
          this.$store.commit('product/setFavGoodsList', favGoodsList)
        })
      }
    },
    createShowroom() {
      const self = this
      this.$axios.$post(`/1.0/showroom`).then((res) => {
        this.disabled = false
        if (res.code == 0) {
          res.data.showroomList &&
            Object.keys(res.data.showroomList).length &&
            this.$store.commit('userInfo/setShowRooms', res.data.showroomList)
          self.setGoodsFav(res.data.showroomId, 0, 0)
        } else {
          alert(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less">
.icon-fav-wrapper {
  .az-fav-icon {
    position: absolute;
    right: 12px;
    top: 8px;
    z-index: 2;
    cursor: pointer;
    .icon-fav-heart {
      fill: currentColor;
      color: @theme-color;
    }
    svg {
      display: none;
      &.show {
        display: block;
        width: 50px;
        height: 50px;
      }
      fill: currentColor;
      @media screen and (max-width: 1440px) {
        &.show {
          display: block;
          width: 33px;
          height: 33px;
        }
      }
    }
    &.isList {
      top: 5px;
      right: 8px;
    }
  }
  &.landingPage-preSaleList,
  &.list,
  &.search,
  &.bestSeller,
  &.storefront-storefrontView {
    .az-fav-icon svg.show {
      width: 33px;
      height: 33px;
    }
  }
  .sub_menu {
    text-align: left;
    font-size: 13px;
    color: var(--color-121212);
    min-width: 174px;
    border: 1px solid var(--color-eeeeee);
    border-radius: 0;
    background-color: #f6f6f6;
    position: relative;
    &_box {
      display: none;
      position: absolute;
      right: 10px;
      top: 56px;
      z-index: 9;
      padding-top: 8px;
      &.show {
        display: block;
      }
      @media screen and (max-width: 1440px) {
        right: 0;
        top: 37px;
      }
    }
    &:before {
      content: '';
      width: 0;
      height: 0;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #ccc;
      border-left: 6px solid transparent;
      position: absolute;
      top: 0%;
      right: 21px;
      margin-top: -7px;
    }
    &:after {
      content: '';
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #f6f6f6;
      position: absolute;
      top: 0%;
      right: 21px;
      margin-top: -12px;
    }
    li {
      cursor: pointer;
      padding: 0px;
      line-height: 18px;
      margin: 8px;
    }
    .az-ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
    }
    &.save-this-ul {
      border: 1px solid #ccc;
      border-radius: 0;
      background-color: #f6f6f6;
      li.save-this-list {
        margin: 0;
        display: block;
        line-height: 32px;
        padding: 0 15px 0 15px;
        max-width: 205px;
        .az-ellipsis();
        cursor: pointer;
        &:hover {
          color: #fff;
          background: @a-color;
        }
        span {
          display: inline-block;
          text-indent: 3px;
        }
      }
      li.save-this-tip,
      .sign-save-this-tip {
        white-space: wrap;
        overflow: visible;
        text-align: center;
      }
    }
  }
}
</style>
