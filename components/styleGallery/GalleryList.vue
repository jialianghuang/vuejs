<template>
  <div id="style-gallery-list" class="gallery-list">
    <van-list
      v-if="!isEmpty"
      v-model="loading"
      :finished="pageInfo.page >= pageInfo.totalPage"
      :immediate-check="false"
      :offset="200"
      @load="onLoad"
      class="gallery-list-content van-clearfix"
    >
      <div class="gallery-list-content-box">
        <div v-for="columnItem in [0, 1, 2, 3]" :key="columnItem" :class="`columnItem_${columnItem}`" class="columnItem" role="article">
          <template v-for="(item, index) in galleryList">
            <div
              :key="index"
              :data-gallery-id="item.galleryId"
              v-if="index % 4 == columnItem"
              :data-line="index % 4"
              @click="openGalleryDialog(item)"
              class="gallery-item"
            >
              <img
                :src="replaceImgCdnUrl(item.imgSrc)"
                :height="item.size ? (315 * parseInt(item.size.split('*')[1])) / parseInt(item.size.split('*')[0]) : 315"
                :alt="'gallery img' + index"
                class="gallery-img"
              />
              <div class="item-over">
                <span class="overlay-effect"></span>
                <span class="shop_part hover">
                  <span
                    class="shop_btn need_datalayer"
                    data-datalayer-category="StyleGallery"
                    data-datalayer-label="StyleGallery_Shopthislook_Click"
                  >
                    {{ nl('page_style_gallery_shop') }}
                  </span>
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div slot="loading" class="load-more">
        <i class="loading-hint"></i>
        <span class="loading-txt">{{ nl('page_common_loading') }}</span>
      </div>
    </van-list>
    <div v-else class="no-result">
      <p>{{ nl('page_search_no_result') }}</p>
      <p>
        <a id="back-to-style-gallery" :href="countryUrl('/style-gallery')" class="btn btn-white">
          <span>{{ nl('page_style_gallery_back') }}</span>
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'GalleryList',
  components: {},
  props: {
    pageInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    loadingFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('styleGallery', ['galleryList']),
    isEmpty() {
      return !this.galleryList || !Object.keys(this.galleryList).length
    },
    loading: {
      get() {
        return this.loadingFlag
      },
      set(val) {}
    }
  },
  created() {},
  mounted() {},
  methods: {
    onLoad() {
      this.$emit('getGalleryList', [this.pageInfo.page * 1 + 1])
    },
    openGalleryDialog(item) {
      this.$store.commit('styleGallery/setCurrentGalleryId', item.galleryId)
      this.$emit('getGalleryInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.gallery-list {
  .gallery-list-content {
    .gallery-list-content-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .columnItem {
      display: flex;
      flex-direction: column;
      width: 315px;
    }
    .gallery-item {
      margin-bottom: 10px;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      background-color: #f6f6f6;
      .gallery-img {
        transition: transform 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
        width: 315px;
        vertical-align: bottom;
      }
      .item-over {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        .overlay-effect {
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          content: '';
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0;
          background-color: var(--color-121212);
        }
        .shop_part {
          color: #fff;
          transform: translateY(-50%);
          font-size: 11px;
          position: absolute;
          left: 0;
          width: 100%;
          text-align: center;
          visibility: hidden;
          top: 50%;
          transition: top 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
          .shop_btn {
            cursor: pointer;
            display: block;
            font-size: 13px;
            font-family: @font-family-600;
            line-height: 34px;
            height: 34px;
            border: 1px solid #ffffff;
            margin: 30px auto 0 auto;
            padding: 0 20px;
            display: inline-block;
          }
        }
      }

      &:hover {
        .gallery-img {
          transform: scale(1.1, 1.1);
        }
        .item-over {
          .shop_part {
            top: 50%;
            visibility: visible;
          }
          .overlay-effect {
            opacity: 0.3;
          }
        }
      }
    }
  }
  .no-result {
    color: var(--color-121212);
    font-size: 24px;
    text-align: center;
    font-family: @font-family-500, sans-serif;
    margin-top: 108px;
    margin-bottom: 100px;
    #back-to-style-gallery {
      text-shadow: none;
      color: var(--color-121212);
      margin: 33px auto 0;
      height: 38px;
      line-height: 36px;
      width: 194px;
      background: #fff;
      border: 1px solid var(--color-121212);
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1px;
      padding: 3px 5px 2px;
      display: inline-block;
      span {
        font-weight: bolder;
      }
    }
  }

  /deep/ .van-list__loading {
    width: 100%;
    .load-more {
      text-align: center;
      padding: 20px 0;
      .loading-hint {
        display: inline-block;
        height: 20px;
        width: 20px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAP1BMVEUAAAD0KA/xJhHxJA7yJA7xJA7xJA7xJA7xJA7wJA7xJA7xJA7xJA7xJA7xJA7xJA3xJA7xJA7xJA7xJA7xJA5JCyllAAAAFXRSTlMACxdEI3NalDdn3LyvLstPoveIgOl7Sm+EAAABiklEQVRIx9XS0W7kIAxAUWyDwckAIfD/37owUyndbbMJrtSq92UeoiMbGHMWRqKciSKamSw5v23b462d7T0HVIc76NrbGK8h+153vgozi9u39ZW7wOSfSYB3pyY3JqdV4ByiG86FTw6xrSmlx+mZ4757X8PJPo/Uo5OPe4/MaTwGy6dfOvz/VeAY7OGjrPvOcHH9PqXFf9i21krmMrcsi/vnhg55bfPfr1Irm1v5bqM5ElcF7lFYl2WF46DOOTA3w/TuuNBlMLeTvjIeQ8XcD9LS9mOoNRPl1t7GBufYTLW29jotP4dOjk2mhyJi5oKltfG2UYTMZL4VN6aL2FnKpTzGjwjMUiyl9b1F2Ey3lILjlvI8XUshY5lpnm6l8KBhnvpSxETmOE/3UpySjo6Fv5UiMykp5JyNsk5BSUPOqL2nnKP2sERklHWq3pgoaDf+nWPVfwsK6rcNIVilxW7xB6wNMVqtjXqLnVrQWbAj+IJFHcanRQAlxhH0xiJza7/owIrpMOBrsK4L9wckTA/GBoy0fQAAAABJRU5ErkJggg==)
          no-repeat 0 0;
        background-size: 100% 100%;
        animation: rotate 1s infinite;
      }
      .loading-txt {
        padding-left: 12px;
        font-size: 16px;
        color: var(--color-121212);
        line-height: 20px;
        display: inline-block;
      }
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }
}
#style-gallery-page {
  .gallery-list {
    margin-top: 40px;
  }
}
</style>
