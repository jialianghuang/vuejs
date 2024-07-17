<template>
  <div>
    <a :href="countryUrl(config.linkUrl)" v-track.viewOnce.clickOnce="getBiParams(config.el)" class="body-list">
      <div v-for="(item, itemIndex) in config.list" :key="itemIndex" :class="[item.cls]" class="body-list__item img-box">
        <img :src="replaceImgCdnUrl(nl(item.imgUrl))" :alt="item.imgAlt || 'shapewear list' + currentIndex + ' img' + itemIndex" />
      </div>
    </a>

    <div class="good-list-container">
      <product-swiper
        v-if="prodList.length > 0"
        :prodList="prodList"
        :nextEl="`swiper-button-next-${currentIndex}`"
        :prevEl="`swiper-button-prev-${currentIndex}`"
      >
        <div v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <div v-for="(item, index) in prodList" :title="item.shownGoodsName" :key="index" class="swiper-slide goods-item">
              <product-swiper-item :item="item" :miniSize="false" :index="index" item-target="_blank"></product-swiper-item>
            </div>
          </div>
        </div>
      </product-swiper>
      <div v-else-if="showList && params.length" class="good-list-placeholder"></div>
    </div>
  </div>
</template>

<script>
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
import checkUpdate from '@/assets/js/checkScroll'
export default {
  name: 'ShapewearList',
  components: { ProductSwiper, ProductSwiperItem },
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    params: {
      type: Array,
      default() {
        return []
      }
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    }
    // prodList: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      scheduledScroll: null,
      needRequest: true,
      showList: true,
      prodList: [],
      img: require('~/assets/images/default_img.jpg'),
      MPSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 33,
        slidesPerGroup: 6,
        simulateTouch: false,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: `.swiper-button-next-${this.currentIndex}`,
          prevEl: `.swiper-button-prev-${this.currentIndex}`
        }
      }
    }
  },
  mounted() {
    this.checkUpdate = checkUpdate({
      element: this.$el,
      callback: this.getList.bind(this),
      threshold: 0.01,
      height: 0
      // removeAfterSuccess: true
    })
  },
  methods: {
    getBiParams(el, ids) {
      return {
        id: `${el}-${ids}`,
        common: {
          ec: 'shapewear',
          el
        }
      }
    },
    getList() {
      if (!this.needRequest) return
      this.checkUpdate.removeListen()
      this.needRequest = false
      const [data, options] = this.params
      return this.$axios
        .$post(`/1.0/list/content`, data, options)
        .then((res) => {
          if (+res.code === 0 && res.data.prodList && res.data.prodList.length) {
            this.prodList = res.data.prodList
          }
        })
        .finally(() => {
          if (!this.prodList.length) this.showList = false
        })
    }
  }
}
</script>

<style lang="less">
/deep/.swiper-button-prev,
/deep/.swiper-button-next {
  background-image: none;
  outline: none;
}
.arraw-icon {
  width: 18px;
  height: 18px;
}
.prev-arraw,
.next-arraw {
  display: block;
  cursor: pointer;
  background-image: none;
  width: auto;
  height: auto;
  &.swiper-button-disabled {
    cursor: default;
  }
  &:focus {
    outline: none;
  }
}
.good-list-container {
  margin-top: 35px;
  .goods-item {
    max-width: 176px;
  }
  img {
    min-height: 230px;
  }
}
.good-list-placeholder {
  height: 264px;
  background: url('../../assets/images/goodsList/img-bg.png') center center/74px 80px no-repeat,
    linear-gradient(to bottom, #f6f6f6, #f6f6f6 99%, #fff 99%);
}

@minImgHeight: 444px;
.body-list {
  padding-top: 60px;
  display: flex;
  flex-wrap: wrap;
  &:last-child {
    border-bottom: none;
  }
  &__item {
    width: calc((100% - 45px) / 4);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: @minImgHeight;
    &:nth-child(n + 2) {
      margin-left: 15px;
    }
    img {
      width: 100%;
    }
    &.flex-img-2 {
      width: calc((100% - 15px) / 2);
    }
  }
}
</style>
