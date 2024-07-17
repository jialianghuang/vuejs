<template>
  <div class="what_to_wear_wrapper">
    <div
      v-for="(item, index) in lists"
      :key="index"
      :class="[item.banners && item.banners.position == 'right' ? 'short_length' : 'length_short']"
      class="item_box"
    >
      <template v-if="item.banners">
        <h4>{{ item.banners.header && nl(item.banners.header.title) }}</h4>
        <p>{{ item.banners.header && nl(item.banners.header.text) }}</p>
        <div v-if="item.banners.details" class="img_show">
          <div class="show_img_box">
            <a
              v-for="(imgItem, imgIndex) in item.banners.details"
              :key="imgIndex"
              :data-datalayer-category="imgItem.eventCategory"
              :data-datalayer-label="imgItem.eventName"
              :href="countryUrl(imgItem.linkUrl)"
              :class="{
                need_datalayer: imgItem.eventCategory && imgItem.eventName
              }"
              :target="linkTarget"
              :aria-label="imgItem.eventCategory"
              ><img :src="replaceImgCdnUrl(imgItem.imgUrl)" :alt="imgItem.imgAlt"
            /></a>
          </div>
          <div v-if="item.banners.footer" class="about_img_desc">
            <a
              :href="countryUrl(item.banners.footer.linkUrl)"
              :class="{
                need_datalayer: item.banners.footer.eventCategory && item.banners.footer.eventName
              }"
              :target="linkTarget"
              :data-datalayer-category="item.banners.footer.eventCategory"
              :data-datalayer-label="item.banners.footer.eventName"
              class="good_desc"
              >{{ nl(item.banners.footer.title) }}</a
            >
            <a
              :href="countryUrl(item.banners.footer.linkUrl)"
              :class="{
                need_datalayer: item.banners.footer.eventCategory && item.banners.footer.eventName
              }"
              :target="linkTarget"
              :data-datalayer-category="item.banners.footer.eventCategory"
              :data-datalayer-label="item.banners.footer.eventName"
              class="shop_link"
              >{{ nl(item.banners.footer.text) }}&nbsp;></a
            >
          </div>
        </div>
      </template>
      <div v-if="item.aFewFavoritesBanners && item.aFewFavoritesBanners.length" class="goods_list">
        <h4>{{ item.aFewFavoritesBannersTitle }}</h4>
        <product-list-swiper
          :prodList="item.aFewFavoritesBanners"
          :swiperCount="6"
          v-if="item.aFewFavoritesBanners && item.aFewFavoritesBanners.length > 6"
        ></product-list-swiper>
        <div v-else-if="item.aFewFavoritesBanners && item.aFewFavoritesBanners.length">
          <a
            v-for="(goods, goodsIndex) in item.aFewFavoritesBanners"
            :key="goodsIndex"
            :href="countryUrl(goods.linkUrl)"
            :data-datalayer-category="goods.eventCategory"
            :data-datalayer-label="goods.eventName"
            :class="{
              need_datalayer: goods.eventName && goods.eventCategory
            }"
            :target="linkTarget"
            class="good_info"
          >
            <img :src="replaceImgCdnUrl(goods.imgUrl)" :alt="goods.imgAlt || goods.title" />
            <span>{{ goods.title }}</span>
            <!-- 打折商品划线价 -->
            <span>{{ goods.noDealPrice }}</span>
            <!-- 保持样式统一，占位 -->
            <div style="visibility: hidden;">{{ goods.shopPrice }}</div>
          </a>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductListSwiper from '@/components/static/ProductListSwiper'

export default {
  name: 'WhatToWearList',
  components: {
    ProductListSwiper
  },
  props: {
    lists: {
      type: Array,
      default() {
        return []
      }
    },
    linkTarget: {
      type: String,
      default: '_blank'
    }
  }
}
</script>

<style lang="less" scoped>
.what_to_wear_wrapper {
  width: 1132px;
  margin: 0 auto 120px;
  h4 {
    font-weight: normal;
  }
  .what_to_wear_banner img {
    width: 100%;
    height: 480px;
  }
  .item_box {
    margin-top: 60px;
    & > h4 {
      font-size: 26px;
      font-family: Libre Baskerville Regular;
      color: var(--color-121212);
      line-height: 26px;
      text-align: center;
      cursor: default;
    }
    & > p {
      margin: 17px 0 40px;
      text-align: center;
      cursor: default;
    }
    .img_show {
      width: 100%;
      .show_img_box {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          display: inline-block;
        }
        a:first-child {
          margin-right: 50px;
          img {
            width: 460px;
            height: 560px;
          }
        }
        a:last-child img {
          width: 505px;
          height: 700px;
        }
      }
      .about_img_desc {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        height: 90px;
        margin: 15px 58.5px 0;
        text-align: left;
        a {
          width: 505px;
          font-size: 13px;
          font-family: @font-family-500;
          color: var(--color-121212);
          line-height: 13px;
        }
        a.shop_link {
          margin-top: 13px;
          font-family: @font-family-600;
        }
      }
    }
    &.length_short {
      .img_show .show_img_box {
        a:first-child img {
          width: 505px;
          height: 700px;
        }
        a:last-child img {
          width: 460px;
          height: 560px;
        }
      }
      .about_img_desc {
        align-items: flex-start;
      }
    }
  }
  .goods_list {
    h4 {
      margin-bottom: 25px;
      font-size: 24px;
      font-family: @font-family-600;
      color: var(--color-121212);
      line-height: 24px;
      cursor: default;
    }
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      a.good_info,
      i {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 179px;
        margin-right: 11px;
        &:last-child {
          margin-right: 0;
        }
        img {
          width: 179px;
        }
        span {
          color: var(--color-121212);
        }
      }
    }
  }
}
</style>
