<template>
  <div class="silhouette_guide_detail_wrapper">
    <template v-if="topBanner.header">
      <h3 class="header-title">{{ topBanner.header.title }}</h3>
      <p v-html="topBanner.header.text" class="sub-title"></p>
    </template>
    <div v-if="topBanner.detailImg" class="content_box">
      <img :src="replaceImgCdnUrl(topBanner.detailImg.imgUrl)" alt="silhouette guide" />
      <a
        :href="countryUrl(topBanner.detailImg.linkUrl)"
        :data-datalayer-category="topBanner.detailImg.eventName"
        :data-datalayer-label="topBanner.detailImg.eventCategory"
        :class="{
          need_datalayer: topBanner.detailImg.eventCategory && topBanner.detailImg.eventName
        }"
        :target="linkTarget"
        class="a_link"
        >{{ topBanner.detailImg.title }} ></a
      >
      <ul v-if="topBanner" class="specials_nav">
        <li v-for="(item, index) in topBanner.smallImg" :key="index">
          <p @click="toLink(item.linkUrl)" class="img-text-box">
            <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" :class="{ active: item.isActive }" />
            <span :class="['module_title', { 'active-text': item.isActive }]">{{ item.title.toLowerCase() }}</span>
          </p>
        </li>
      </ul>
    </div>
    <div v-if="topBanner.guideBox" class="why_do_you_choose">
      <img :src="replaceImgCdnUrl(topBanner.guideBox.backgroundImageUrl)" alt="silhouette guide" />
    </div>
    <div v-if="aFewFavorites" class="a_few_favorites">
      <p class="module_name">{{ aFewFavorites.title }}</p>
      <product-list-swiper :prodList="aFewFavorites.list" :swiperCount="6"></product-list-swiper>
    </div>
    <div v-if="quizBox" class="style_quiz_box">
      <img
        :src="replaceImgCdnUrl(quizBox.imgUrl)"
        :data-datalayer-category="quizBox.eventCategory"
        :data-datalayer-label="quizBox.eventName"
        :class="{
          need_datalayer: quizBox.eventCategory && quizBox.eventName
        }"
        @click="setStyleQuizLayerShow(true)"
        alt="silhouette guide"
        class="style_quiz_bridal_nav"
      />
    </div>
    <style-quiz-layer v-if="styleQuizLayerShow" @close="setStyleQuizLayerShow(false)" :styleQuizBridal="styleQuizBridal"></style-quiz-layer>
  </div>
</template>

<script>
import ProductListSwiper from '@/components/static/ProductListSwiper'
import StyleQuizLayer from '@/components/static/StyleQuizLayer'

export default {
  name: 'SilhouetteGuideList',
  components: {
    ProductListSwiper,
    StyleQuizLayer
  },
  props: {
    topBanner: {
      type: Object,
      default() {
        return {}
      }
    },
    aFewFavorites: {
      type: Object,
      default() {
        return {}
      }
    },
    quizBox: {
      type: Object,
      default() {
        return {}
      }
    },
    linkTarget: {
      type: String,
      default: '_blank'
    }
  },
  data() {
    return {
      styleQuizLayerShow: false,
      styleQuizBridal: {}
    }
  },
  computed: {
    firstStep() {
      return this.topBanner && this.topBanner.childNodes && this.topBanner.childNodes[0]
    },
    secondStep() {
      return this.topBanner && this.topBanner.childNodes && this.topBanner.childNodes[1]
    }
  },
  methods: {
    setStyleQuizLayerShow(bl) {
      this.styleQuizLayerShow = bl
    },
    toLink(url) {
      const queryStr = url.substr(url.indexOf('?') + 1).split('=')
      this.$nextTick(() => {
        this.$router.push({
          path: this.$router.path,
          query: {
            [queryStr[0]]: queryStr[1]
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.silhouette_guide_detail_wrapper {
  width: 100%;
  .header-title {
    font-family: @font-Ivy-Mode-700;
    font-size: 26px;
    line-height: 32px;
    color: var(--color-121212);
  }
  .sub-title {
    margin-top: 5px;
    line-height: 18px;
  }
  .content_box {
    position: relative;
    margin: 30px auto 60px;
    font-size: 0;
    img {
      width: 100%;
    }
    .a_link {
      position: absolute;
      left: 50px;
      bottom: 78px;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-121212);
      text-decoration: underline;
    }
    .specials_nav {
      width: 226px;
      height: 110px;
      position: absolute;
      top: 36px;
      right: 40px;
      li:not(:first-child) {
        margin-top: 15px;
      }
      .img-text-box {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 85px;
          vertical-align: middle;
          &.active {
            outline: 2px solid var(--color-121212);
            outline-offset: -2px;
          }
          &:hover {
            outline: 2px solid var(--color-121212);
            outline-offset: -2px;
          }
          &:hover + .module_title {
            color: var(--color-121212);
          }
        }
      }
      .module_title {
        margin-left: 10px;
        font-size: 13px;
        line-height: 18px;
        color: #999;
        white-space: nowrap;
        text-transform: capitalize;
        &.active-text {
          color: var(--color-121212);
        }
      }
    }
  }
  .why_do_you_choose {
    font-size: 0;
    margin-bottom: 60px;
    img {
      width: 100%;
    }
  }
  .a_few_favorites {
    .module_name {
      font-size: 24px;
      line-height: 33px;
      text-transform: uppercase;
    }
    /deep/ .product-list-swiper {
      width: calc(100% - 72px);
      margin: 30px auto 60px;
    }
  }
  .style_quiz_box {
    font-size: 0;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
}
</style>
