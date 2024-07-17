<template>
  <div class="theme_color_list">
    <div v-for="(item, index) in lists" :key="index" :class="[item.displayType]" class="item_box">
      <div class="img_show">
        <div :class="{ has_color_desc: index % 2 != 0 }">
          <template v-if="index % 2 != 0">
            <h4>{{ item.firstTitle }}</h4>
            <hr />
            <p>{{ item.secondTitle }}</p>
          </template>
          <a
            :data-datalayer-category="item.imgLeft.eventCategory"
            :data-datalayer-label="item.imgLeft.eventName"
            :href="countryUrl(item.imgLeft.imgLink)"
            :class="{
              need_datalayer: item.imgLeft.eventCategory && item.imgLeft.eventName
            }"
            :target="linkTarget"
            :aria-label="item.imgLeft.eventCategory"
          >
            <img :src="replaceImgCdnUrl(item.imgLeft.imgUrl)" :alt="item.imgLeft.imgAlt" />
          </a>
          <a
            :data-datalayer-category="item.imgLeft.eventCategory"
            :data-datalayer-label="item.imgLeft.eventName"
            :href="countryUrl(item.imgLeft.imgLink)"
            :class="{
              need_datalayer: item.imgLeft.eventCategory && item.imgLeft.eventName
            }"
            :target="linkTarget"
            >{{ item.imgLeft.imgDescription }}</a
          >
        </div>
        <div :class="{ has_color_desc: index % 2 == 0 }">
          <template v-if="index % 2 == 0">
            <h4>{{ item.firstTitle }}</h4>
            <hr />
            <p>{{ item.secondTitle }}</p>
          </template>
          <a
            :data-datalayer-category="item.imgRight.eventCategory"
            :data-datalayer-label="item.imgRight.eventName"
            :href="countryUrl(item.imgRight.imgLink)"
            :class="{
              need_datalayer: item.imgRight.eventCategory && item.imgRight.eventName
            }"
            :target="linkTarget"
            :aria-label="item.imgRight.eventCategory"
          >
            <img :src="replaceImgCdnUrl(item.imgRight.imgUrl)" :alt="item.imgRight.imgAlt" />
          </a>
          <a
            :data-datalayer-category="item.imgRight.eventCategory"
            :data-datalayer-label="item.imgRight.eventName"
            :href="countryUrl(item.imgRight.imgLink)"
            :class="{
              need_datalayer: item.imgRight.eventCategory && item.imgRight.eventName
            }"
            :target="linkTarget"
            >{{ item.imgRight.imgDescription }}</a
          >
        </div>
      </div>
      <div class="a_few_favorites img_swipper">
        <h3 class="module_name">{{ item.goodsListTitle }}</h3>
        <product-list-swiper :prodList="getProdlist(item)" :hasHoverStyle="true" :swiperCount="6"></product-list-swiper>
      </div>
    </div>
  </div>
</template>

<script>
import ProductListSwiper from '@/components/static/ProductListSwiper'

export default {
  name: 'ShopbySeaonList',
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
  },
  methods: {
    getProdlist(list) {
      return (list.goodsList || []).map((item) => {
        return item.goodsId
          ? {
              eventCategory: list.eventCategory,
              eventName: list.eventName,
              linkUrl: item.goodsUrl,
              imgUrl: item.imgUrl,
              imgAlt: item.goodsName,
              text: item.goodsName,
              noDealPrice: item.noDealPriceDisplay,
              shopPrice: item.shopPriceDisplay
            }
          : {
              eventCategory: list.eventCategory,
              eventName: list.eventName,
              linkUrl: item.shopAllUrl,
              sortOrder: item.sortOrder,
              shopAll: true
            }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.theme_color_list {
  margin: 90px 0 0;
  .item_box {
    padding-bottom: 80px;
    margin: 0 0 80px;
    border-bottom: 1px solid #eee;
    .img_show {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 0 45px 57px;
      h4 {
        margin-top: 3px;
        font-size: 28px;
        font-family: Libre Baskerville Regular;
        color: var(--color-121212);
        line-height: 62px;
        font-weight: normal;
      }
      hr {
        margin: 0;
        width: 60px;
        border-color: var(--color-121212);
        border-width: 2px;
      }
      p {
        margin: 25px 0;
        font-size: 16px;
        line-height: 26px;
      }
      & > div {
        img {
          width: 100%;
          margin-bottom: 8px;
        }
        a:first-child {
          display: block;
        }
        a:last-child {
          font-size: 14px;
          font-family: @font-family-600;
          color: var(--color-121212);
          line-height: 20px;
          text-decoration: underline;
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    &.type_one {
      .img_show div {
        width: 520px;
        img {
          width: 520px;
          height: 700px;
        }
      }
      div.has_color_desc {
        width: 480px;
        img {
          width: 480px;
          height: 560px;
        }
      }
    }
    &.type_two {
      .img_show div {
        width: 460px;
        img {
          width: 460px;
          height: 610px;
        }
      }
      div.has_color_desc {
        width: 470px;
        img {
          width: 460px;
          height: 460px;
        }
      }
      div.a_link_box {
        text-align: center;
      }
    }
    &.type_three {
      .img_show div {
        width: 420px;
        img {
          width: 420px;
          height: 560px;
        }
      }
      div.has_color_desc {
        position: relative;
        width: 580px;
        img {
          position: relative;
          right: 91px;
          width: 670px;
          height: 440px;
          margin-bottom: 0;
        }
        a:last-child {
          display: inline-block;
          position: relative;
          left: -75px;
        }
      }
    }
    &.type_four {
      .img_show div {
        width: 520px;
        img {
          width: 520px;
          height: 680px;
        }
      }
      div.has_color_desc {
        position: relative;
        width: 480px;
        img {
          position: relative;
          left: 0;
          width: 585px;
          height: 585px;
          margin-bottom: 0;
        }
        div.a_link_box {
          position: relative;
          left: 0;
          width: 585px;
          text-align: center;
        }
      }
    }
    .a_few_favorites {
      margin-top: 0;
      .popular_goods:hover {
        span {
          color: var(--color-121212);
        }
      }
      span.goods_name {
        font-family: @font-family-600;
      }
    }
  }
}
</style>
