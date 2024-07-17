<template>
  <div class="cat-desc-text">
    <div v-if="content" v-html="htmlContent()" class="theme-review"></div>
    <div v-else-if="!content && Object.keys(colorContent).length" class="theme-review">
      <h2>{{ nl('page_common_why_they_chose') }} {{ colorContent.selectedColor }} {{ nl('page_common_for_their_wedding') }}</h2>
      <div class="color32-review">
        <p class="wide">{{ colorContent.description }}</p>
        <template v-if="colorContent.reviews">
          <h2>{{ nl('page_review_read_customers_saying') }}</h2>
          <div v-for="(review, index) in colorContent.reviews" :key="index">
            <p class="content">{{ review.content }}</p>
            <h3>- {{ review.customer }}</h3>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  name: 'CategoryDescription',
  languageKeys: ['page_common_why_they_chose', 'page_common_for_their_wedding', 'page_review_read_customers_saying'],
  components: {},
  props: {
    content: {
      type: String,
      default: () => {
        return ''
      }
    },
    colorContent: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    }
  },
  methods: {
    htmlContent() {
      return Base64.decode(this.content)
    }
  }
}
</script>

<style lang="less">
.cat-desc-text {
  margin-bottom: 20px;
  h1,
  h2 {
    .font-larger();
    margin: 20px 0 5px 0;
    color: var(--color-121212);
  }
  a {
    color: var(--color-121212);
  }
  .color32-review {
    padding-bottom: 20px;
    width: 100%;
    p {
      box-sizing: border-box;
    }
    h2 {
      width: 100%;
      text-align: center;
      text-transform: capitalize;
      font-size: 15px;
    }
    h3 {
      margin: 10px 0 0;
      padding: 0px 110px;
      font-size: 13px;
      font-weight: bold;
      color: #a1a1a1;
    }
    p {
      width: 75%;
      position: relative;
      padding: 30px 110px 0px;
      z-index: 0;
      line-height: 1.7;
      word-break: keep-all;

      margin: 14px 0;
      color: #a1a1a1;
      letter-spacing: 0.01em;
      line-height: 1.5em;
      box-sizing: border-box;
      &.content {
        font-style: italic;
        word-break: keep-all;
        &:before,
        &:after {
          content: '';
          position: absolute;
          height: 30px;
          width: 40px;
          z-index: -1;
          background-image: url('~assets/images/seo_sprite_20190129.png?5770949');
          background-repeat: no-repeat;
        }
        &:before {
          top: 0%;
          left: 0%;
          background-position: -616px -23px;
        }
        &:after {
          bottom: -30px;
          right: 0%;
          background-position: -658px -23px;
        }
      }

      &.wide {
        width: 100%;
        margin-left: -110px;
        padding-top: 0px;
      }
    }
    .burgundy {
      color: #8b1427;
    }
    .red {
      color: #c00017;
    }
    .watermelon {
      color: #fa7a79;
    }
    .orange {
      color: #ffa147;
    }
    .daffodil {
      color: #ffffcd;
    }
    .sage {
      color: #e1f9bb;
    }
    .lime_green {
      color: #dbf647;
    }
    .clover {
      color: #aeb953;
    }
    .jade {
      color: #0baab0;
    }
    .dark_green {
      color: #0a574d;
    }
    .ink_blue {
      color: #174c78;
    }
    .dark_navy {
      color: #1e2c5b;
    }
    .royal_blue {
      color: #212eb1;
    }
    .ocean_blue {
      color: #2478ec;
    }
    .pool {
      color: #60e0f9;
    }
    .sky_blue {
      color: #cbeafe;
    }
    .lavender {
      color: #d6dcfe;
    }
    .lilac {
      color: #e6cbf8;
    }
    .candy_pink {
      color: #ffc2db;
    }
    .blushing_pink {
      color: #ffd1e1;
    }
    .pearl_pink {
      color: #fcdbd4;
    }
    .fuchsia {
      color: #e236a4;
    }
    .regency {
      color: #4c1992;
    }
    .grape {
      color: #79346d;
    }
    .champagne {
      color: #e2d0a8;
    }
    .gold {
      color: #ddb766;
    }
    .brown {
      color: #8f6b53;
    }
    .chocolate {
      color: #503228;
    }
    .white {
      color: #fff;
    }
    .ivory {
      color: #f7f7ef;
    }
    .rose_petal {
      color: #faeeea;
    }
    .silver {
      color: #cfd1cc;
    }
    .black {
      color: #2d3029;
    }
    .tangerine {
      color: #fd9850;
    }
    .turquoise {
      color: #90f5da;
    }
    .coral {
      color: #f9c4b6;
    }
    .emerald {
      color: #057d40;
    }
    .steel_grey {
      color: #6f7478;
    }
  }

  .theme-review {
    width: 100%;
    h3 {
      margin-top: 13px;
      font-size: 13px;
      font-weight: bold;
      color: var(--color-121212);
    }
    a {
      color: var(--color-121212);
      font-weight: normal;
      text-decoration: underline;
    }
    p {
      margin-bottom: 13px;
      color: var(--color-121212);
      width: 100%;
      letter-spacing: 0.01em;
      word-break: keep-all;
      line-height: 1.5em;
      &.wide {
        width: 100%;
      }
    }
    .burgundy {
      color: #8b1427;
    }
    .red {
      color: #c00017;
    }
    .watermelon {
      color: #fa7a79;
    }
    .orange {
      color: #ffa147;
    }
    .daffodil {
      color: #ffffcd;
    }
    .sage {
      color: #e1f9bb;
    }
    .lime_green {
      color: #dbf647;
    }
    .clover {
      color: #aeb953;
    }
    .jade {
      color: #0baab0;
    }
    .dark_green {
      color: #0a574d;
    }
    .ink_blue {
      color: #174c78;
    }
    .dark_navy {
      color: #1e2c5b;
    }
    .royal_blue {
      color: #212eb1;
    }
    .ocean_blue {
      color: #2478ec;
    }
    .pool {
      color: #60e0f9;
    }
    .sky_blue {
      color: #cbeafe;
    }
    .lavender {
      color: #d6dcfe;
    }
    .lilac {
      color: #e6cbf8;
    }
    .candy_pink {
      color: #ffc2db;
    }
    .blushing_pink {
      color: #ffd1e1;
    }
    .pearl_pink {
      color: #fcdbd4;
    }
    .fuchsia {
      color: #e236a4;
    }
    .regency {
      color: #4c1992;
    }
    .grape {
      color: #79346d;
    }
    .champagne {
      color: #e2d0a8;
    }
    .gold {
      color: #ddb766;
    }
    .brown {
      color: #8f6b53;
    }
    .chocolate {
      color: #503228;
    }
    .white {
      color: #fff;
    }
    .ivory {
      color: #f7f7ef;
    }
    .rose_petal {
      color: #faeeea;
    }
    .silver {
      color: #cfd1cc;
    }
    .black {
      color: #2d3029;
    }
    .tangerine {
      color: #fd9850;
    }
    .turquoise {
      color: #90f5da;
    }
    .coral {
      color: #f9c4b6;
    }
    .emerald {
      color: #057d40;
    }
    .steel_grey {
      color: #6f7478;
    }
  }
  .theme-review {
    h1,
    h2 {
      margin: 0 0 15px 0;
      color: var(--color-121212);
      line-height: 32px;
      padding: 9px 0 8px;
      border-bottom: 1px solid #ccc;
    }
    h2 {
      font-size: 18px;
    }
    h3 {
      font-size: 16px;
      margin: 0 0 15px 0;
      line-height: 18px;
    }
    p {
      font-size: 14px;
      margin-bottom: 15px;
      line-height: 20px;
    }
    &:last-child {
      margin-bottom: 80px;
    }
  }
}

.related-search {
  clear: both;
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #e5e1e1;
  .related-title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  a.internal-link {
    color: #a1a1a1;
    margin-right: 10px;
    white-space: nowrap;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
