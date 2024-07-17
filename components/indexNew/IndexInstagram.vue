<template>
  <div>
    <div v-show="!skeleton && loaded" class="index-instagram">
      <a :href="countryUrl('/style-gallery')" class="title">{{ item.title }}</a>
      <!-- <a :href="item.viewMoreUrl" class="des">{{ item.content }}></a> -->
      <div class="img-box">
        <img
          v-for="(it, idx) in item.bannerList"
          :key="idx"
          :src="addWebpSuffix(it.imageUrl)"
          :alt="'instagram ' + it.imageLabel + idx"
          @load="imgLoad(it)"
          :style="getImgStyle(it)"
          v-track.view="{ common: getBiParams('Shop our instagram', idx + 1 + '_image') }"
          @click="clickInstagramItem(it, idx + 1)"
        />
      </div>
      <popup-style-gallery
        v-if="popupStyleGallery.popupStyleGalleryShow"
        @getGalleryInfo="getGalleryInfo"
        :pageInfo="{ page: 1, totalPage: 1 }"
      ></popup-style-gallery>
    </div>
    <div v-if="!loaded" :style="styleInfo" class="skeleton-default"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import colorHex from '@/assets/js/colorHex'
import PopupStyleGallery from '@/components/styleGallery/PopupStyleGallery'
import indexModuleMixins from '@/assets/js/indexModuleMixins'

/**
 * 首页FOLLOW US ON INSTAGRAM功能模块组件
 * 弹框内容逻辑不变
 */
export default {
  languageKeys: PopupStyleGallery.languageKeys,
  components: {
    PopupStyleGallery
  },
  mixins: [colorHex, indexModuleMixins],
  computed: {
    ...mapState('styleGallery', ['popupStyleGallery', 'galleryList', 'currentGalleryId'])
  },
  created() {
    // this.getColorHexAjax()
    // 根据styleGallery中的逻辑，会有个获取列表的操作，但是首页五条固定，不需要单独调用接口获取列表
    // 所以这里直接修改数据并保存，在PopupStyleGallery组件代码不变的情况下，满足本组件操作
    const galleryList = this.item.bannerList.map((ele) => {
      return {
        galleryId: ele.linkUrl && ele.linkUrl.split('info/')[1]
      }
    })
    this.$store.commit('styleGallery/setGalleryList', galleryList)
  },
  methods: {
    // 点击获取对应gallery id,并查询详情
    clickInstagramItem(e, index) {
      this.setPoint('Shop our instagram', index + '_image', 'click', {}, null, '/')
      const currentGalleryId = e.linkUrl && e.linkUrl.split('info/')[1]
      if (currentGalleryId) {
        this.$store.commit('styleGallery/setCurrentGalleryId', currentGalleryId)
        this.getGalleryInfo(currentGalleryId)
      }
    },
    // 查询数据详情
    getGalleryInfo() {
      if (!this.currentGalleryId) return
      this.$store.commit('styleGallery/setPopupStyleGalleryShow', {
        popupStyleGalleryShow: true,
        popupStyleGalleryId: this.currentGalleryId
      })
      let data = {}
      for (let i = 0; i < this.item.bannerList.length; i++) {
        const ele = this.item.bannerList[i]
        if (ele.linkUrl.includes(this.currentGalleryId)) {
          data = {
            goodsIds: ele.goodsIds
          }
          break
        }
      }
      this.$store.commit('styleGallery/setGalleryInfoAgg', {})
      this.$axios.$post(`/1.0/style-gallery/home-page-info/${this.currentGalleryId}`, data).then((res) => {
        if (res.code == 0) {
          this.$store.commit('styleGallery/setGalleryInfoAgg', res.data || {})
        } else {
          alert(res.msg)
        }
      })
    },
    getBiParams(ec, el) {
      if (process.server) return
      const obj = {
        dp: 'home',
        ec,
        el
      }
      return obj
    }
  }
}
</script>
<style lang="less" scoped>
.index-instagram {
  margin-top: 100px;
  > .title {
    display: block;
    margin-bottom: 50px;
    font-family: @font-Ivy-Mode-400;
    font-style: normal;
    font-weight: 400;
    font-size: 36px;
    line-height: 45px;
    text-transform: uppercase;
    text-align: center;
  }
  > .des {
    display: block;
    font-family: @font-family-500;
    font-size: 18px;
    line-height: 25px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin: 20px 0px 50px;
    color: var(--color-121212);
    text-align: center;
  }
  > .img-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 19.375%;
      height: auto;
      cursor: pointer;
    }
  }
}
.skeleton-default {
  background-color: var(--color-f9f9f9);
  width: 100%;
  height: 100vw * 0.2957;
  margin-top: 100px;
}
</style>
