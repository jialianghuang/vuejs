<template>
  <div>
    <div id="shop-by-color-banner" v-if="topBanner.color">
      <p class="banner-title">{{ topBanner.color.title }}</p>
      <p class="banner-txt">{{ topBanner.color.desc }}</p>
      <div v-if="topBanner.color.colorList" class="banner-content">
        <div v-for="(item, key, index) in topBanner.color.colorList" :key="key" class="color-item">
          <a
            @click="hrefPoint('color', item, index)"
            :href="countryUrl(item.url)"
            :data-datalayer-category="item.eventCategory"
            :data-datalayer-label="item.eventName"
            :class="{
              need_datalayer: item.eventName && item.eventCategory
            }"
            class="color-item-a"
            ><div :class="[item.className]" :style="item.style" class="color-block"></div>
            <p class="color-txt">{{ item.name }}</p></a
          >
        </div>
      </div>
    </div>
    <div v-if="topBanner.popular" class="popular_list">
      <div class="box_desc">
        <div class="sbc_title">{{ topBanner.popular.title }}</div>
        <div class="sbc_txt">{{ topBanner.popular.desc | dropFanXie }}</div>
        <a
          @click="hrefPoint('bridesmaid', item, index)"
          :data-datalayer-category="topBanner.popular.eventCategory"
          :data-datalayer-label="topBanner.popular.eventName"
          :class="{
            need_datalayer: topBanner.popular.eventName && topBanner.popular.eventCategory
          }"
          :href="countryUrl('/all/bridesmaid-dresses?from=shopby70_color')"
          class="sbc_link"
          >{{ topBanner.popular.btnText || nl('page_shop_by_colors_bd_dresses') }}</a
        >
        <a :href="countryUrl('/swatches?from=shopbycolor')" class="sbc_link sbc_link_second">{{ nl('page_shop_by_swatches') }}</a>
      </div>
      <div class="prod_list">
        <div @mouseenter="autoPlayStop" @mouseleave="autoPlayStart" v-swiper:ColorSwiper="swiperOption" class="swiper-container">
          <div class="swiper-wrapper">
            <div v-for="(item, index) in topBanner.popular.popularList" :key="index" class="swiper-slide">
              <a
                @click="hrefPoint('popular', item, index)"
                :href="countryUrl(item.goodsUrl + '&from=shopby70_color')"
                :data-datalayer-category="topBanner.popular.eventCategory"
                :data-datalayer-label="topBanner.popular.eventName"
                :class="{
                  need_datalayer: topBanner.popular.eventName && topBanner.popular.eventCategory
                }"
                :aria-label="item.shownColor + index"
                target="_blank"
              >
                <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.shownColor" />
                <div class="goods_name">{{ item.shownColor }}</div>
              </a>
            </div>
            <a :href="countryUrl('/all/bridesmaid-dresses')" target="_blank" class="swiper-slide view-more-block">
              <div class="view-more">
                <span class="view-more-text">{{ nl('page_common_see_more') }}</span>
              </div>
            </a>
          </div>
          <div class="swiper-scrollbar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let vm = null
export default {
  name: 'ColorTopBanner',
  filters: {
    colorFilter(name) {
      return (name || '').replace(/_/g, ' ')
    }
  },
  props: {
    topBanner: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      swiperOption: {
        scrollbar: {
          el: '.swiper-scrollbar',
          hide: false,
          draggable: true,
          snapOnRelease: false
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          speed: 500
        },
        speed: 500,
        slidesPerView: 4,
        slidesPerGroup: 1,
        spaceBetween: 12,
        on: {
          slideChangeTransitionEnd() {
            // console.log('slideChangeTransitionEnd', this.activeIndex)
            vm.handleSwiper(this.activeIndex) // 切换结束时，告诉我现在是第几个slide
          },
          scrollbarDragEnd() {
            // console.log('scrollbarDragEnd', this.activeIndex)
            vm.handleSwiper(this.activeIndex)
          }
        }
      },
      listViewArr: []
    }
  },
  created() {
    vm = this
  },
  methods: {
    // view 打点
    handleSwiper(index) {
      const list = JSON.parse(JSON.stringify(this.topBanner.popular.popularList))
      if (!list.length) return
      const temp = list.slice(0, index + 4)
      const arr = []
      if (!temp.length) return
      temp.forEach((element, index) => {
        if (!this.listViewArr.includes(element.goodsId)) {
          const obj = {
            ec: 'colors',
            el: 'items',
            ea: 'view',
            msg: JSON.stringify({ index: index + 1, color: element.colorReal, goodsId: element.goodsId })
          }
          arr.push(obj)
          this.listViewArr.push(element.goodsId)
        }
      })
      if (arr.length) {
        this.buryPoint(this, 'events', arr)
      }
    },
    hrefPoint(type, item, index) {
      if (type == 'popular') {
        this.buryPoint(this, 'event', {
          ec: 'colors',
          el: 'items',
          ea: 'click',
          msg: JSON.stringify({ index: index + 1, color: item.colorReal, goodsId: item.goodsId })
        })
      }
      if (type == 'color') {
        this.buryPoint(this, 'event', {
          ec: 'newcolor',
          el: 'items',
          ea: 'click',
          msg: JSON.stringify({ color: item.key, index: index + 1 })
        })
      }
      if (type == 'bridesmaid') {
        this.buryPoint(this, 'event', {
          ec: 'shopbd',
          el: 'common',
          ea: 'click'
        })
      }
    },
    autoPlayStop() {
      this.ColorSwiper.autoplay.stop()
    },
    autoPlayStart() {
      this.ColorSwiper.autoplay.start()
    }
  }
}
</script>

<style lang="less" scoped>
#shop-by-color-banner {
  margin-bottom: 25px;
  width: 100%;
  min-height: 200px;
  // background: url(~assets/images/shop_by/shop-by-color-banner-bng.png) no-repeat center center;
  background: #f1e9e6;
  background-size: 100% 100%;
  text-align: center;
  padding-bottom: 15px;
  .banner-title {
    font-size: 36px;
    font-family: @font-family-500;
    color: rgba(51, 51, 48, 1);
    line-height: 49px;
    text-transform: uppercase;
    padding: 10px 0 9px;
  }
  .banner-txt {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 15px;
  }
  .banner-content {
    margin: 0 auto;
    width: 920px;
    display: flex;
    justify-content: center;
    .color-item {
      // flex: 1;
      margin: 0 50px;
    }
    .color-item-a {
      color: var(--color-121212);
      .color-block {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 auto;
      }
      .color-txt {
        font-size: 13px;
        line-height: 18px;
        margin-top: 8px;
        width: 100%;
        text-align: center;
      }
      &:hover {
        color: @theme-color;
        cursor: pointer;
      }
    }
  }
}
.popular_list {
  display: flex;
  align-items: center;
  background: #f1e9e6;
  //padding: 50px 0 40px;
  height: 426px;
  box-sizing: border-box;
  .box_desc {
    width: 390px;
    padding-left: 100px;
    box-sizing: border-box;
    .sbc_title {
      color: var(--color-121212);
      font-size: 60px;
      letter-spacing: -3px;
      font-family: @font-Ivy-Mode-400;
    }
    .sbc_txt {
      margin-top: 15px;
      font-size: 16px;
      color: var(--color-121212);
      font-family: Arimo;
    }
    .sbc_link {
      display: block;
      margin-top: 40px;
      text-decoration: underline;
      cursor: pointer;
      color: var(--color-121212);
      font-size: 13px;
      text-transform: uppercase;
      font-family: @font-family-500;
      &:hover {
        color: @theme-color;
      }
    }
    .sbc_link_second {
      margin-top: 10px;
    }
  }
  .prod_list {
    margin-top: 5px;
    margin-left: 35px;
    //margin-right: 15px;
    width: calc(~'100% - 440px');
    overflow: hidden;
    .swiper-container {
      height: 340px;
      cursor: pointer;
    }
    /deep/ .swiper-scrollbar {
      bottom: 0;
      height: 4px;
      border-radius: 2px;
      background: rgba(253, 241, 241, 1);
      .swiper-scrollbar-drag {
        width: 260px;
        height: 4px;
        background: #d4c9c0;
        border-radius: 2px;
      }
    }
    /deep/ .swiper-slide {
      text-align: center;
      display: inline-block;
      width: 210px;
      a {
        cursor: pointer;
        img {
          width: 195px;
        }
        .goods_name {
          color: var(--color-121212);
          font-size: 13px;
          margin-top: 15px;
          text-transform: capitalize;
        }
        &:hover {
          .goods_name {
            color: @theme-color;
          }
        }
      }
    }
  }
}
.view-more-block {
  height: auto;
  .view-more {
    background-color: var(--color-f9f9f9);
    height: 270px;
    align-items: center;
    justify-content: center;
    display: flex;
    .view-more-text {
      text-transform: uppercase;
      border-bottom: 2px solid var(--color-121212);
      padding-bottom: 5px;
      font-size: 14px;
      color: var(--color-121212);
    }
  }
}
</style>
