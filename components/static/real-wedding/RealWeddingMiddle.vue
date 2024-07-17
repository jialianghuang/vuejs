<template>
  <div class="ceremony_wrapper">
    <div class="ceremony_content">
      <div v-if="realWeddings.topBanner" class="main_pic">
        <img :src="replaceImgCdnUrl(realWeddings.topBanner.imgUrl)" :alt="realWeddings.topBanner.alt" />
      </div>
      <div class="pic_list">
        <a
          :href="countryUrl(item.linkUrl)"
          :target="linkTarget"
          v-for="(item, index) in realWeddings.picList"
          :key="index"
          class="pic_item"
        >
          <div>
            <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.name" />
          </div>
          <div>
            <h5>{{ item.theme }}</h5>
            <div class="des">
              <span v-for="(color, colorIndex) in item.color" :key="colorIndex" :style="getColorStyle(color)" class="color_icon"></span>
              <span class="wedding_name">{{ item.name }}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import colorHex from '@/assets/js/colorHex'

export default {
  name: 'RealWeddingMiddle',
  mixins: [colorHex],
  props: {
    realWeddings: {
      type: Object,
      default() {
        return {}
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
.ceremony_wrapper {
  .dusty_rose {
    background-color: #e1bbb8;
  }
  .taupe {
    background-color: #d4cdc3;
  }
  .champagne {
    background-color: #e2d0a8;
  }
  .pearl_pink {
    background-color: #fcdbd4;
  }
  .burgundy {
    background-color: #8b1427;
  }
  .sky_blue {
    background-color: #cbeafe;
  }
  .marigold {
    background-color: #fec559;
  }
  .ivory {
    background-color: #fefef7;
    .box-shadow(0px 0px 2px #ccc inset);
  }
  .steel_grey {
    background-color: #6f7478;
  }
  .orchid {
    background-color: #961d78;
  }
  .grape {
    background-color: #561f58;
  }
  .turquoise {
    background-color: #90f5da;
  }
  .watermelon {
    background-color: #fa7a79;
  }
  .papaya {
    background-color: #fa9178;
  }
  .dark_navy {
    background-color: #1e2c5b;
  }
  .ocean_blue {
    background-color: #2478ec;
  }
  .regency {
    background-color: #4c1992;
  }
  .blushing_pink {
    background-color: #fee5ec;
  }
  .lavender {
    background-color: #d6dcfe;
  }
  .tahiti {
    background-color: #9e81b6;
  }
  .spa {
    background-color: #5bf7ea;
  }
  .color_icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid var(--color-121212);
    margin-right: 8px;
  }
  .ceremony_content {
    width: 1004px;
    margin: 0 auto 100px;
  }
  .main_pic {
    margin: 12px 0 56px;
    img {
      width: 100%;
    }
  }
  .pic_list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border-top: 1px solid var(--color-121212);
    a {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 48%;
      margin: 20px 0;
      & > div {
        width: 100%;
      }
      img {
        display: inline-block;
        width: 100%;
        height: 320px;
      }
      h5 {
        text-align: center;
        color: var(--color-121212);
        line-height: 44px;
        font-family: @font-family-600;
        font-size: 16px;
        text-transform: uppercase;
      }
      .des {
        display: flex;
        justify-content: center;
        align-items: center;
        .wedding_name {
          display: inline-block;
          margin-left: 7px;
          font-size: 16px;
          font-family: @font-family-500;
          color: var(--color-121212);
          line-height: 20px;
        }
      }
    }
  }
  .ceremony_details {
    .wedding_des {
      margin-top: 20px;
      .info_box {
        display: flex;
        justify-content: flex-start;
        width: 1002px;
        height: 228px;
        border: 1px solid #eee;
        img {
          display: inline-block;
          width: 480px;
        }
        .word_info {
          flex: 1;
          h1 {
            margin: 27px 0 10px;
            color: var(--color-121212);
            text-align: center;
            line-height: 24px;
            font-size: 24px;
            font-family: @font-family-600;
          }
          .wedding_date {
            margin-bottom: 33px;
            color: #666;
            text-align: center;
            line-height: 14px;
            font-size: 14px;
            font-family: @font-family-500;
          }
          .other_info {
            display: flex;
            justify-content: space-between;
          }
          dl {
            margin: 0 30px 0 40px;
            color: var(--color-121212);
            line-height: 14px;
            font-size: 14px;
            font-family: @font-family-600;
            dt {
              margin-bottom: 9px;
              text-transform: uppercase;
            }
            dd {
              margin-bottom: 18px;
              font-family: @font-family-500;
              line-height: 13px;
              font-size: 13px;
              span {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: none;
                border-radius: 10px;
                margin-right: 6px;
              }
            }
            &:last-child {
              min-width: 150px;
              margin: 0;
            }
          }
        }
      }
      p.copy_writing {
        font-size: 13px;
        line-height: 22px;
        margin: 15px 0 50px;
        a {
          font-family: @font-family-600;
          text-decoration: underline;
          color: var(--color-121212);
        }
      }
    }
    .img_show {
      img {
        display: inline-block;
      }
      .big_img {
        height: 670px;
        display: flex;
        justify-content: center;
        align-items: center;
        img.byWidth {
          width: 100%;
        }
        img.byHeight {
          height: 100%;
        }
      }
      .img_swipper {
        position: relative;
        width: 858px;
        height: 140px;
        margin: 40px 0 50px;
        padding: 0 73px;
        .swiper-slide {
          display: flex;
          justify-content: flex-start;
          height: 140px;
          cursor: pointer;
          .slide_mask {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            box-sizing: border-box;
            width: 180px;
            height: 140px;
            border: 2px solid transparent;
            margin-right: 46px;
            opacity: 0.6;
            &.isShowing {
              border-color: var(--color-121212);
              opacity: 1;
            }
            &:last-child {
              margin-right: 0;
            }
            img.byWidth {
              height: 100%;
            }
            img.byHeight {
              width: 100%;
            }
          }
        }
        .swiper-button {
          width: 11px;
          height: 18px;
          margin-top: -9px;
          background-size: 11px 18px;
        }
      }
    }
  }
  .shop_the_look {
    .title {
      color: var(--color-121212);
      line-height: 36px;
      font-size: 16px;
      font-family: @font-family-600;
      border-bottom: 1px solid var(--color-121212);
    }
    .goods_list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-bottom: 70px;
      .goods_item {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 179px;
        margin-right: 27px;
        color: var(--color-121212);
        line-height: 13px;
        &.no_margin {
          margin-right: 0;
        }
        .pic {
          margin: 30px 0;
          img {
            width: 100%;
          }
        }
        .color,
        .goods_name,
        .price {
          margin-bottom: 10px;
        }
        .color .color_icon {
          width: 16px;
          height: 16px;
          border: none;
          vertical-align: text-bottom;
        }
      }
    }
  }
}
</style>
