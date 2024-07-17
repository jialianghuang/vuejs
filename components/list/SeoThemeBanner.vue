<template>
  <div class="seo-theme-banner">
    <div :class="[seoThemeBanner.goods_class, 'theme_banner_goods']">
      <img :src="seoThemeBanner.img_src" :alt="seoThemeBanner.event_name" class="bg-img" />
      <div :class="[seoThemeBanner.goods_class]" class="theme_banner_goods">
        <div
          v-for="item in seoThemeBanner.goods_id_list"
          :key="item.goods_id"
          :class="item.goods_id"
          :style="{ top: item.top, left: item.left }"
          class="goods_tip"
        >
          <div class="goods_hover_img">
            <img src="~assets/images/banner/pc_hover_big.gif" alt="hover big" />
            <ImageHotSpot :positions="item.positions || []" ec="seoThemeBanner" />
          </div>
          <div class="point_to_hover"></div>
          <a
            :href="countryUrl(item.jump_link)"
            :class="{
              'no-pointer': judgeIsEmptyUrl(item.jump_link)
            }"
            target="_blank"
          >
            <div class="goods_content">
              <img :src="addWebpSuffix(item.img_url)" alt="img" />
              <div class="goods_right">
                <div class="goods_name">{{ item.goods_name }}</div>
                <div class="color">
                  <div :style="{ background: item.hex }" class="color_cycle"></div>
                  <div class="color_name">{{ item.color }}</div>
                </div>
                <div class="price">{{ item.shop_price }}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bannerMixins from '@/assets/js/bannerMixins'

export default {
  name: 'SeoThemeBanner',
  mixins: [bannerMixins],
  data() {
    return {}
  },
  computed: {
    ...mapState(['country']),
    ...mapState('list', ['seoThemeBanner'])
  }
}
</script>

<style lang="less" scoped>
.seo-theme-banner {
  position: relative;
  .theme_banner_goods {
    .bg-img {
      width: 100%;
    }
    .theme_banner_goods {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      .goods_tip {
        position: absolute;
        display: block;
        .goods_hover_img {
          font-size: 0;
          img {
            width: 22px;
            height: 22px;
            margin-left: 45px;
            border-radius: 11px;
            display: inline-block;
          }
        }
        .point_to_hover {
          margin-left: 40px;
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 15px solid #fff;
          opacity: 0.8;
          display: none;
        }
        &:hover {
          .point_to_hover {
            display: block;
          }
          .goods_content {
            display: block;
          }
        }
        .goods_content {
          display: none;
          min-width: 210px;
          height: 104px;
          z-index: 1;
          font-size: 0;
          position: relative;
          img {
            width: 60px;
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: inherit;
          }
          .goods_right {
            display: block;
            padding: 10px 10px 10px 80px;
            border-radius: 10px;
            opacity: 0.8;
            background: #fffefe;
            .goods_name {
              font-size: 18px;
              font-family: @font-family-500;
              color: var(--color-121212);
              line-height: 18px;
            }
            .color {
              margin: 10px 0 15px;
              .color_cycle {
                display: inline-block;
                width: 16px;
                height: 16px;
                border-radius: 8px;
              }
              .color_name {
                display: inline-block;
                margin-left: 7px;
                font-size: 13px;
                font-family: @font-family-500;
                color: var(--color-121212);
                line-height: 16px;
                vertical-align: top;
              }
            }
            .price {
              font-size: 18px;
              font-family: @font-family-600;
              color: var(--color-121212);
              line-height: 24px;
            }
          }
        }
      }
    }
  }
}
</style>
