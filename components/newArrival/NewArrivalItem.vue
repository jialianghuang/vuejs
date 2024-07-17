<template>
  <div class="new-arrival-list-children">
    <!-- linkUrl -->
    <div
      v-track.viewOnce.click="{ id: `new_arrival_banner_${currentIndex}`, common: getBiParams('banner') }"
      class="new-arrival-list-title"
    >
      <!-- <a :href="header.linkUrl"><img :src="header.imgUrl" :alt="header.alt"/></a> -->
      <p class="main-title">{{ title }}</p>
      <p class="main-title sub">{{ subTitle }}</p>
    </div>
    <div class="new-arrival-list-content">
      <product-swiper
        v-if="prodList.length > 0"
        :prodList="prodList"
        :nextEl="`swiper-button-next-${currentIndex}`"
        :prevEl="`swiper-button-prev-${currentIndex}`"
      >
        <div v-swiper:MPSwiper="MPSwiperOption" class="swiper-container">
          <div class="swiper-wrapper product-swiper-viewport">
            <div
              v-for="(item, index) in prodList"
              :title="item.shownGoodsName"
              :key="index"
              :style="{ maxWidth: maxWidth }"
              v-track.viewOnce.click="{ id: `new_arrival_banner_${currentIndex}_${index}`, common: getBiParams('item', index, item) }"
              class="swiper-slide goods-item"
            >
              <product-swiper-item
                :index="index"
                :item="item"
                :miniSize="false"
                :from="'new-arrival'"
                item-target="_blank"
              ></product-swiper-item>
            </div>
          </div>
        </div>
      </product-swiper>
    </div>
  </div>
</template>

<script>
import ProductSwiperItem from '@/components/product/productSwiperItem'
import ProductSwiper from '@/components/product/ProductSwiper'
export default {
  name: 'NewArrivalItem',
  components: { ProductSwiper, ProductSwiperItem },
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default() {
        return ''
      }
    },
    subTitle: {
      type: String,
      default() {
        return ''
      }
    },
    header: {
      type: Object,
      default() {
        return {}
      }
    },
    prodList: {
      type: Array,
      default() {
        return []
      }
    },
    shopAllUrl: {
      type: String,
      default() {
        return {}
      }
    },
    // 单个数据最大宽度
    maxWidth: {
      type: String,
      default: '176px'
    }
  },
  data() {
    return {
      MPSwiperOption: {
        slidesPerView: 6,
        // spaceBetween: '1.16%',
        spaceBetween: 33,
        slidesPerGroup: 6,
        simulateTouch: false,
        // loop: true,
        loopFillGroupWithBlank: true,
        speed: 800,
        navigation: {
          nextEl: `.swiper-button-next-${this.currentIndex}`,
          prevEl: `.swiper-button-prev-${this.currentIndex}`
        }
        // on: {
        //   slideChangeTransitionEnd: () => {
        //     if (this.MPSwiper) {
        //       this.itemsArrPoint()
        //     }
        //   }
        // }
      }
    }
  },
  mounted() {},
  methods: {
    getBiParams(from, index, item) {
      if (process.server) return
      const parms = {
        dp: '/all/new-arrivals',
        ec: 'newarrivalspage',
        el: `${this.title}-${from}`,
        param1: (location && location.href) || '-1',
        param2: this.versionGroup.banner_new_arrival_middle
      }
      if (index) {
        parms.msg = JSON.stringify({
          goods_name: item.shownGoodsName,
          color: item.color,
          report_pos: index
        })
      }
      return parms
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
.new-arrival-list-title {
  img {
    width: 100%;
  }
  text-align: center;
  margin: 50px 0;
  .main-title {
    font-family: @font-family;
    font-weight: 300;
    color: var(--color-121212);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 42px;
    line-height: 57px;
    &.sub {
      font-family: @font-family-500;
      text-transform: inherit;
      margin-top: 10px;
      line-height: 22px;
      font-size: 16px;
      letter-spacing: 0;
    }
  }
}
// .new-arrival-list-content {
//   .goods-item {
//     max-width: 176px;
//   }
// }
</style>
