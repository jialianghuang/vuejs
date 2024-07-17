<template>
  <div>
    <div v-for="(goods, goodsIndex) in contentList" :key="goodsIndex">
      <h1 class="common-title help-shop-by-title">{{ goods.title }}</h1>
      <ul class="help-shop-by clearfix">
        <li
          v-for="(list, index) in goods.list"
          :key="index"
          :data-datalayer-category="list.eventCategory"
          :data-datalayer-label="list.eventName"
          :class="{
            need_datalayer: list.eventName && list.eventName,
            last: (index + 1) % 5 === 0,
            need_: (index + 1) % 5 === 0
          }"
        >
          <a :href="countryUrl(list.url)" :aria-label="list.showName || 'shop by color img' + index">
            <p
              @click="hrefPoint(list.catName, list.name ? list.name + ' ' + list.catName : '' + list.catName)"
              :data-datalayer-category="list.click && list.click.eventCategory"
              :data-datalayer-label="list.click && list.click.eventName"
              :class="{ [list.class]: true, need_datalayer: list.click && list.click.eventName && list.click.eventCategory }"
              class="pic"
            >
              <img v-if="list.imgUrl" :src="replaceImgCdnUrl(list.imgUrl)" :alt="list.showName || 'shop by color img' + index" />
            </p>
          </a>
          <a
            v-if="list.showName"
            @click="hrefPoint(list.catName, list.name ? list.name + ' ' + list.catName : '' + list.catName)"
            :href="countryUrl(list.url)"
            :class="{ need_datalayer: list.click && list.click.eventName && list.click.eventCategory }"
            :data-datalayer-category="list.click && list.click.eventCategory"
            :data-datalayer-label="list.click && list.click.eventName"
            :aria-label="list.showName || 'shop by color name' + index"
            class="show-name"
          >
            {{ list.showName }}
          </a>
          <a
            v-for="(sub, subIndex) in list.sub"
            @click="hrefPoint(list.catName, sub.name)"
            :key="subIndex"
            :class="{ need_datalayer: sub.eventName && sub.eventName }"
            :data-datalayer-category="sub.eventName"
            :data-datalayer-label="sub.eventName"
            :href="countryUrl(sub.url)"
            :aria-label="sub.isNew === 1 ? 'shop by color ' + sub.name + ' new' : 'shop by color ' + sub.name"
            class="color-series"
          >
            <span :class="{ ['circle-' + sub.class]: true }" :style="getStyle(sub)" class="color-circle"></span>
            {{ nl(sub.name) }}
            <span v-if="sub.isNew === 1" class="new-color">{{ nl('page_common_new_capital') }}!</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ColorList',
  props: {
    contentList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    ...mapState({
      colorHex: (state) => state.colorHex
    })
  },
  methods: {
    hrefPoint(type, name) {
      if (type == 'Bridesmaid Dresses') {
        this.buryPoint(this, 'event', {
          ec: 'shopbd',
          el: 'colors',
          ea: 'click',
          msg: JSON.stringify({ name })
        })
      }
      if (type == 'ALL WEDDING DRESSES') {
        this.buryPoint(this, 'event', {
          ec: 'shopwd',
          el: 'colors',
          ea: 'click',
          msg: JSON.stringify({ name })
        })
      }
      console.log('type', type, name)
    },
    getStyle(sub) {
      if (sub.imgUrl) {
        return `background: url(${this.addWebpSuffix(sub.imgUrl)}) no-repeat center/cover;`
      } else if (this.colorHex && sub.class) {
        const color = this.colorHex[sub.class] || this.colorHex[sub.class.replace(/-/g, '_')]
        if (color && color.hexes && color.hexes[0]) {
          // 因为有颜色重复，只能修改颜色值 jira11935
          if (color.key && color.key === 'rose_gold') {
            color.hexes[0] = '#904331'
          }
          let style = `background: ${color.hexes[0]};`
          if (color.colorType === 0) {
            style += 'box-shadow: inset 0 0 2px #ccc;'
          }
          return style
        }
      }
    },
    calcuColorDiffWithBGC(color) {
      let r, g, b
      if (color.length === 4) {
        r = this.getSixNum(color.substr(1, 1))
        g = this.getSixNum(color.substr(2, 1))
        b = this.getSixNum(color.substr(3, 1))
        r += r
        g += g
        b += b
      } else {
        r = this.getSixNum(color.substr(1, 2))
        g = this.getSixNum(color.substr(3, 2))
        b = this.getSixNum(color.substr(4, 2))
      }
      const diff = Math.sqrt((r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2)
      return diff
    },
    getSixNum(hex) {
      return parseInt(hex, 16)
    }
  }
}
</script>

<style lang="less" scoped>
.help-shop-by-title {
  margin: 18px 0 50px;
}

.help-shop-by {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  li {
    float: left;
    position: relative;
    margin: 0 80px 37px 0;
    width: 188px;
    text-align: center;
    &.last {
      margin-right: 0;
    }
  }
  .show-name {
    display: inline-block;
    text-decoration: underline;
    font-family: @font-family-500;
    font-size: 13px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .pic {
    display: block;
    width: 100%;
    height: 188px;
    background-repeat: no-repeat;
    margin-bottom: 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .watermelon,
  .red,
  .black,
  .spring,
  .garden,
  .classic,
  .hourglass,
  .mini,
  .floor_length,
  .chiffon,
  .charmeuse,
  .elegant {
    background-position: 0 0;
  }
  .pearl_pink,
  .fuchsia,
  .grape,
  .summer,
  .beach,
  .vintage,
  .pear,
  .knee_length,
  .asymmetrical,
  .taffeta,
  .high_low {
    background-position: -188px 0;
  }
  .blushing_pink,
  .lilac,
  .regency,
  .fall,
  .cocktail,
  .romantic,
  .apple,
  .tea_length,
  .satin,
  .open_back {
    background-position: -376px 0;
  }
  .jade,
  .royal_blue,
  .dark_navy,
  .winter,
  .black_tie,
  .modern,
  .straigh,
  .ankle_length,
  .lace,
  .sweet_flow,
  .straight {
    background-position: -564px 0;
  }

  .a_line_princess {
    background-position: 0 0;
  }
  .empire {
    background-position: -188px 0;
  }
  .trumpet_mermaid {
    background-position: -376px 0;
  }
  .sheath_column {
    background-position: -564px 0;
  }

  .imageHover {
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }
  a:hover .imageHover {
    display: block;
  }
  h2 {
    margin-top: 13px;
    line-height: 15px;
    text-decoration: underline;
    color: #666;
    font-weight: normal;
    text-transform: uppercase;
  }
  a:hover h2 {
    color: @theme-color;
  }
  li {
    &:not(.last) {
      margin-right: 88px;
    }
    .pink,
    .red,
    .yellow,
    // .orange {
    //   background: url('../images/help/new_shop_by_color/line1_20180424.jpg@{last_v}');
    // }

    .pink {
      background-position: 0 0;
    }
    .red {
      background-position: -188px 0;
    }
    .yellow {
      background-position: -376px 0;
    }
    .orange {
      background-position: -564px 0;
    }

    // .green,
    // .blue,
    // .purple,
    // .brown {
    //   background: url('../images/help/new_shop_by_color/line2_20180424.jpg@{last_v}');
    // }

    .green {
      background-position: 0 0;
    }
    .blue {
      background-position: -188px 0;
    }
    .purple {
      background-position: -376px 0;
    }
    .brown {
      background-position: -564px 0;
    }
    // .ext-option-floral-big {
    //   background: url('https://cdn-1.azazie.com/upimg/userfiles/images/db/5f/ffccbc070c7c13672fafdcbed588db5f.jpg');
    // }
    // .ext-option-sequin-big {
    //   background: url('https://cdn-1.azazie.com/upimg/userfiles/images/ec/d8/3d6216c77d72c832aceff31f0327ecd8.jpg');
    // }
    .white {
      background-position: 0 0;
    }
    .grey {
      background-position: -188px 0;
    }
    .neutral {
      background-position: -376px 0;
    }
    .black {
      background-position: -564px 0;
    }
  }
  @media screen and (max-width: 1370px) {
    li:not(.last) {
      margin-right: 65px;
    }
  }
  li h2 {
    text-decoration: none;
    text-align: center;
    margin-bottom: 19px;
    // white-space: nowrap;
    font-weight: normal;
    text-decoration: underline;
    color: #666;
    &:hover {
      color: @theme-color;
    }
  }
  .color-series {
    padding-left: 15px;
    display: block;
    font-weight: normal;
    font-size: 12px;
    text-transform: uppercase;
    font-family: @font-family-500, sans-serif;
    color: #666;
    text-align: left;
    height: 22px;
    white-space: nowrap;
    &:hover {
      color: @theme-color;
      cursor: pointer;
    }
    .color-circle {
      display: inline-block;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: -4px;
    }
    .new-color {
      font-size: 12px;
      font-family: @font-family-500;
      color: @theme-color;
      margin-left: 5px;
    }
  }

  //Do not manually modify this file! File generated from db !
  .circle-burgundy {
    background-color: #8b1427;
  }
  .circle-red {
    background-color: #c00017;
  }
  .circle-watermelon {
    background-color: #fa7a79;
  }
  .circle-orange {
    background-color: #ffa147;
  }
  .circle-daffodil {
    background-color: #ffffcd;
  }
  .circle-sage {
    background-color: #e1f9bb;
  }
  .circle-lime_green {
    background-color: #dbf647;
  }
  .circle-clover {
    background-color: #aeb953;
  }
  .circle-jade {
    background-color: #0baab0;
  }
  .circle-dark_green {
    background-color: #0a574d;
  }
  .circle-ink_blue {
    background-color: #174c78;
  }
  .circle-dark_navy {
    background-color: #1e2c5b;
  }
  .circle-royal_blue {
    background-color: #212eb1;
  }
  .circle-ocean_blue {
    background-color: #2478ec;
  }
  .circle-pool {
    background-color: #60e0f9;
  }
  .circle-sky_blue {
    background-color: #cbeafe;
  }
  .circle-lavender {
    background-color: #d6dcfe;
  }
  .circle-lilac {
    background-color: #e6cbf8;
  }
  .circle-pearl_pink {
    background-color: #fcdbd4;
  }
  .circle-fuchsia {
    background-color: #e236a4;
  }
  .circle-regency {
    background-color: #4c1992;
  }
  .circle-champagne {
    background-color: #e2d0a8;
  }
  .circle-gold {
    background-color: #ddb766;
  }
  .circle-brown {
    background-color: #8f6b53;
  }
  .circle-chocolate {
    background-color: #503228;
  }
  .circle-white {
    background-color: #ffffff;
    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-silver {
    background-color: #cfd1cc;
  }
  .circle-black {
    background-color: #2d3029;
  }
  .circle-tangerine {
    background-color: #fd9850;
  }
  .circle-turquoise {
    background-color: #90f5da;
  }
  .circle-coral {
    background-color: #f9c4b6;
  }
  .circle-emerald {
    background-color: #057d40;
  }
  .circle-steel_grey {
    background-color: #6f7478;
  }
  .circle-wisteria {
    background-color: #c3a5bb;
  }
  .circle-mint_green {
    background-color: #d0ffe5;
  }
  .circle-tiffany_blue {
    background-color: #3ceadc;
  }
  .circle-mist {
    background-color: #d5e7f5;
  }
  .circle-papaya {
    background-color: #fa9178;
  }
  .circle-mulberry {
    background-color: #9a375a;
  }
  .circle-frost {
    background-color: #ebebe7;
  }
  .circle-dusk {
    background-color: #ccbdca;
  }
  .circle-rust {
    background-color: #b53c2d;
  }
  .circle-taupe {
    background-color: #d4cdc3;
  }
  .circle-stormy {
    background-color: #636784;
  }
  .circle-flamingo {
    background-color: #fca4ae;
  }
  .circle-peach {
    background-color: #ffe0c7;
  }
  .circle-orchid {
    background-color: #961d78;
  }
  .circle-tahiti {
    background-color: #9e81b6;
  }
  .circle-moss {
    background-color: #4e722d;
  }
  .circle-candy_pink {
    background-color: #ffd4e7;
  }
  .circle-blushing_pink {
    background-color: #fee5ec;
  }
  .circle-dusty_rose {
    background-color: #e1bbb8;
  }
  .circle-spa {
    background-color: #5bf7ea;
  }
  .circle-grape {
    background-color: #561f58;
  }
  .circle-ivory {
    background-color: #fefef7;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-rose_petal {
    background-color: #faeeea;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-azalea {
    background-color: #fd73af;
  }
  .circle-marigold {
    background-color: #fec559;
  }
  .circle-peacock {
    background-color: #035d69;
  }
  .circle-lemon {
    background-color: #fef984;
  }
  .circle-classic_champagne {
    background-color: #f8f7e6;
  }
  .circle-cabernet {
    background-color: #5c2c35;
  }
  .circle-garden_green {
    background-color: #429343;
  }
  .circle-dusty_sage {
    background-color: #bccab3;
  }
  .circle-blue_jay {
    background-color: #5388cd;
  }
  .circle-caribbean {
    background-color: #91dce8;
  }
  .circle-jungle_green {
    background-color: #00908b;
  }
  .circle-sunset {
    background-color: #fca289;
  }
  .circle-dusty_blue {
    background-color: #8c9dad;
  }
  .circle-nude {
    background-color: #d5b98c;
  }
  .circle-diamond_white {
    background-color: #fefef7;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-cream {
    background-color: #fefef0;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-butter {
    background-color: #fefae3;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-egg_shell {
    background-color: #f7f7f3;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-ecru {
    background-color: #fdfbf4;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-sand {
    background-color: #f9f5eb;
  }
  .circle-vintage_mauve {
    background-color: #cfb1b5;
  }
  .circle-dusty_mauve {
    background-color: #dac5c4;
  }
  .circle-hazelnut {
    background-color: #8c817b;
  }
  .circle-rose_quartz {
    background-color: #fef7f1;
  }
  .circle-aurora_teal {
    background-color: #1db6b4;
  }
  .circle-iris {
    background-color: #f0e9f9;
  }
  .circle-vintage_rose {
    background-color: #f9efe6;
  }
  .circle-crimson {
    background-color: #981d35;
  }
  .circle-blush {
    background-color: #f7ded5;
  }
  .circle-sunny_yellow {
    background-color: #fbe35c;
  }
  .circle-navy {
    background-color: #082755;
  }
  .circle-maui_blue {
    background-color: #00eef2;
  }
  .circle-pink {
    background-color: #ff8aa8;
  }
  .circle-periwinkle {
    background-color: #b6bad5;
  }
  .circle-royal {
    background-color: #15489e;
  }
  .circle-charcoal {
    background-color: #5e5959;
  }
  .circle-hot_pink {
    background-color: #e90d88;
  }
  .circle-mint {
    background-color: #c4e9d7;
  }
  .circle-lime {
    background-color: #c8e27d;
  }
  .circle-teal {
    background-color: #008b9f;
  }
  .circle-aqua {
    background-color: #8dcfd8;
  }
  .circle-eggplant {
    background-color: #663366;
  }
  .circle-copper {
    background-color: #904331;
  }
  .circle-wine {
    background-color: #7c344c;
  }
  .circle-regal_purple {
    background-color: #353a81;
  }
  .circle-light_turquoise {
    background-color: #bcefde;
  }
  .circle-slate_blue {
    background-color: #8ca9d3;
  }
  .circle-ruby_red {
    background-color: #a02b34;
  }
  .circle-grey {
    background-color: #ebebe8;
  }
  .circle-plum {
    background-color: #560c54;
  }
  .circle-rose_gold {
    background-color: #e3cfbc;
  }
  .circle-midnight_blue {
    background-color: #374c82;
  }
  .circle-light_blue {
    background-color: #5b90c4;
  }
  .circle-evergreen {
    background-color: #0f372e;
  }
  .circle-clay {
    background-color: #6b5c55;
  }
  .circle-bright_blue {
    background-color: #2f4ccc;
  }
  .circle-dream_black {
    background-color: #353030;
  }
  .circle-raspberry {
    background-color: #691350;
  }
  .circle-fog {
    background-color: #ccc6d4;
  }
  .circle-steel_blue {
    background-color: #809dbd;
  }
  .circle-pewter {
    background-color: #4f5e61;
  }
  .circle-sunrise_pink {
    background-color: #f2efeb;
  }
  .circle-misty_blue {
    background-color: #c1d9e1;
  }
  .circle-cloudy_blue {
    background-color: #dae4e7;
  }
  .circle-antique_pink {
    background-color: #eee8e0;
  }
  .circle-platinum {
    background-color: #e5e5e5;
  }
  .circle-sp_black {
    background-color: var(--color-121212);
  }
  .circle-sp_royal_blue {
    background-color: #292e82;
  }
  .circle-sp_navy_blue {
    background-color: #233156;
  }
  .circle-sp_slate_blue {
    background-color: #7ca0b8;
  }
  .circle-sp_blue {
    background-color: #425ab4;
  }
  .circle-sp_periwinkle {
    background-color: #b0bcd4;
  }
  .circle-sp_periwinkle_blue {
    background-color: #a9b5ca;
  }
  .circle-sp_forest_green {
    background-color: #1e3636;
  }
  .circle-sp_light_grey {
    background-color: #e5e4ea;
  }
  .circle-sp_denim_blue {
    background-color: #5f616e;
  }
  .circle-sp_taupe {
    background-color: #9f8c85;
  }
  .circle-sp_beige {
    background-color: #edceb1;
  }
  .circle-sp_rusty_rose {
    background-color: #ea8a74;
  }
  .circle-sp_coral_orange {
    background-color: #ee7462;
  }
  .circle-sp_plum_purple {
    background-color: #511319;
  }
  .circle-sp_burgundy {
    background-color: #6f1d33;
  }
  .circle-sp_rust_red {
    background-color: #c04f41;
  }
  .circle-sp_berry_pink {
    background-color: #c54748;
  }
  .circle-sp_blush {
    background-color: #f7d1bc;
  }
  .circle-sp_blush_pink {
    background-color: #fec8ae;
  }
  .circle-sp_peach {
    background-color: #ffcbab;
  }
  .circle-sp_white {
    background-color: #ffffff;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-sp_ivory {
    background-color: #ffffff;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-sp_yellow {
    background-color: #f9c976;
  }
  .circle-sp_green {
    background-color: #41854d;
  }
  .circle-sp_grey {
    background-color: #808080;
  }
  .circle-sp_pink {
    background-color: #f2a1b1;
  }
  .circle-sp_red {
    background-color: #d23c47;
  }
  .circle-sp_purple {
    background-color: #893d88;
  }
  .circle-sp_dark_emerald_43 {
    background-color: #133a2a;
  }
  .circle-sp_dark_navy_44 {
    background-color: #1e2c5b;
  }
  .circle-sp_burgundy_44 {
    background-color: #8b1427;
  }
  .circle-sp_burgundy_43 {
    background-color: #8b1427;
  }
  .circle-sp_black_52 {
    background-color: #2d3029;
  }
  .circle-sp_burgundy_52 {
    background-color: #8b1427;
  }
  .circle-sp_black_53 {
    background-color: #2d3029;
  }
  .circle-sp_black_45 {
    background-color: #2d3029;
  }
  .circle-sp_burgundy_45 {
    background-color: #8b1427;
  }
  .circle-sp_burgundy_46 {
    background-color: #8b1427;
  }
  .circle-sp_black_47 {
    background-color: #2d3029;
  }
  .circle-sp_burgundy_47 {
    background-color: #8b1427;
  }
  .circle-sp_black_48 {
    background-color: #2d3029;
  }
  .circle-sp_marigold_48 {
    background-color: #fec559;
  }
  .circle-sp_black_49 {
    background-color: #2d3029;
  }
  .circle-sp_dark_navy_49 {
    background-color: #1e2c5b;
  }
  .circle-sp_black_50 {
    background-color: #2d3029;
  }
  .circle-sp_ink_blue_50 {
    background-color: #174c78;
  }
  .circle-sp_red_51 {
    background-color: #c00017;
  }
  .circle-sp_black_51 {
    background-color: #2d3029;
  }
  .circle-sp_sunset_yellow_48 {
    background-color: #fec559;
  }
  .circle-sp_blush_\#f7d1bc {
    background-color: #f7d1bc;
  }
  .circle-sp_light_grey_\#e5e4ea {
    background-color: #e5e4ea;
  }
  .circle-sp_royal_blue_\#292e82 {
    background-color: #292e82;
  }
  .circle-sp_navy_blue_\#233156 {
    background-color: #233156;
  }
  .circle-sp_rusty_rose_\#ea8a74 {
    background-color: #ea8a74;
  }
  .circle-sp_slate_blue_\#7ca0b8 {
    background-color: #7ca0b8;
  }
  .circle-sp_blue_\#425ab4 {
    background-color: #425ab4;
  }
  .circle-sp_coral_orange_\#ee7462 {
    background-color: #ee7462;
  }
  .circle-sp_yellow_\#f9c976 {
    background-color: #f9c976;
  }
  .circle-sp_white_\#ffffff {
    background-color: #ffffff;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-sp_forest_green_\#1e3636 {
    background-color: #1e3636;
  }
  .circle-sp_plum_purple_\#511319 {
    background-color: #511319;
  }
  .circle-sp_burgundy_\#6f1d33 {
    background-color: #6f1d33;
  }
  .circle-sp_black_\var(--color-121212) {
    background-color: var(--color-121212);
  }
  .circle-sp_blush_pink_\#fec8ae {
    background-color: #fec8ae;
  }
  .circle-sp_taupe_\#9f8c85 {
    background-color: #9f8c85;
  }
  .circle-sp_rust_red_\#c04f41 {
    background-color: #c04f41;
  }
  .circle-sp_ivory_\#ffffff {
    background-color: #ffffff;

    box-shadow: 0px 0px 2px #ccc inset;
  }
  .circle-sp_slate_blue_\#9ab1bf {
    background-color: #9ab1bf;
  }
  .circle-sp_burgundy_\#6d1526 {
    background-color: #6d1526;
  }
  .circle-sp_periwinkle_\#b0bcd4 {
    background-color: #b0bcd4;
  }
  .circle-sp_berry_pink_\#c54748 {
    background-color: #c54748;
  }
  .circle-sp_periwinkle_blue_\#a9b5ca {
    background-color: #a9b5ca;
  }
  .circle-sp_beige_\#edceb1 {
    background-color: #edceb1;
  }
  .circle-sp_peach_\#ffcbab {
    background-color: #ffcbab;
  }
  .circle-sp_burgundy_\#8b1427 {
    background-color: #8b1427;
  }
  .circle-sp_dark_emerald_\#133a2a {
    background-color: #133a2a;
  }
  .circle-sp_dark_navy_\#1e2c5b {
    background-color: #1e2c5b;
  }
  .circle-sp_black_\#2d3029 {
    background-color: #2d3029;
  }
  .circle-sp_sunset_yellow_\#fec559 {
    background-color: #fec559;
  }
  .circle-sp_ink_blue_\#174c78 {
    background-color: #02403f;
  }
  .circle-sp_red_\#c00017 {
    background-color: #c00017;
  }
  .circle-sp_wine_red_\#8b1427 {
    background-color: #8b1427;
  }
  .circle-sp_navy_blue_\#1e2c5b {
    background-color: #1e2c5b;
  }
  .circle-sp_navy_blue_\#131f38 {
    background-color: #131f38;
  }
  .circle-sp_ginger_yellow_\#efc641 {
    background-color: #efc641;
  }
  .circle-sp_red_\#c60000 {
    background-color: #c60000;
  }
  .circle-sp_blush_\#ffeee2 {
    background-color: #ffeee2;
  }
  .circle-sp_magenta_\#c25882 {
    background-color: #c25882;
  }
  .circle-sp_royal_blue_\#34377b {
    background-color: #34377b;
  }
  .circle-sp_ink_blue_\#02403f {
    background-color: #02403f;
  }
  .circle-sp_burgundy_\#6e001f {
    background-color: #6e001f;
  }
  .circle-sp_black_\#1d191a {
    background-color: #1d191a;
  }
  .circle-sp_ivory_\#9 {
    background-color: #ffffff;
  }
  .circle-sp_raspberry_\#aa153b {
    background-color: #aa153b;
  }
  .circle-sp_blue_grey_\#93939f {
    background-color: #93939f;
  }
  .circle-sp_burgundy_\#6b0421 {
    background-color: #6b0421;
  }
  .circle-sp_black_\#252527 {
    background-color: #252527;
  }
  .circle-sp_blush_floral_print_\#fcb7ad {
    background-color: #fcb7ad;
  }
  .circle-sp_dark_navy_floral_print_\#1b1f3a {
    background-color: #1b1f3a;
  }
  .circle-sp_black_\#2b2a2f {
    background-color: #2b2a2f;
  }
  .circle-sp_burgundy_\#6d1e34 {
    background-color: #6d1e34;
  }
  .circle-sp_royal_blue_\#3b3f7f {
    background-color: #3b3f7f;
  }
  .circle-sp_dark_navy_\#212e3f {
    background-color: #212e3f;
  }
  .circle-lavender_mist {
    background-color: #faf5f9;
  }
  .circle-dolphin_grey {
    background-color: #969da3;
  }
  .circle-dusty_lavender {
    background-color: #999eb2;
  }
  .circle-twilight {
    background-color: #506175;
  }
  .circle-neptune {
    background-color: #2c3f50;
  }
  .circle-desert_rose {
    background-color: #905655;
  }
  .circle-agave {
    background-color: #95a6a0;
  }
  .circle-sp_rose_gold_\#eddcd3 {
    background-color: #eddcd3;
  }
  .circle-sp_navy_blue_\#1a2649 {
    background-color: #1a2649;
  }
  .circle-sp_burgundy_\#7c0606 {
    background-color: #7c0606;
  }
  .circle-sp_navy_blue_\#29354b {
    background-color: #29354b;
  }
  .circle-sp_navy_blue_\#222c3f {
    background-color: #222c3f;
  }
  .circle-sp_burgundy_\#78292c {
    background-color: #78292c;
  }
  .circle-sp_french_blue_\#2a617b {
    background-color: #2a617b;
  }
  .circle-sp_gold {
    background-color: #d6a761;
  }
  .circle-sp_navy_blue_\#182434 {
    background-color: #182434;
  }
  .circle-sp_watermelon_red_\#dd826f {
    background-color: #dd826f;
  }
  .circle-sp_dark_navy_\#0c1a3e {
    background-color: #0c1a3e;
  }
  .circle-sp_blush_\#ddbdb8 {
    background-color: #ddbdb8;
  }
  .circle-sp_dark_green_\#28400d {
    background-color: #28400d;
  }
  .circle-sp_dark_green_\#254735 {
    background-color: #254735;
  }
  .circle-sp_slate_blue_\#b2cad2 {
    background-color: #b2cad2;
  }
  .circle-sp_dusty_rose_\#e1bbb8 {
    background-color: #e1bbb8;
  }
  .circle-sp_cabernet_\#5c2c35 {
    background-color: #5c2c35;
  }
  .circle-sp_dark_navy_\#2a3b4c {
    background-color: #2a3b4c;
  }
  .circle-sp_raspberry_\#a82525 {
    background-color: #a82525;
  }
  .circle-sp_dusty_blue_\#8c9dad {
    background-color: #8c9dad;
  }
  .circle-sp_slate_blue_\#89c4e0 {
    background-color: #89c4e0;
  }
  .circle-sp_fog_\#e9e9e7 {
    background-color: #e9e9e7;
  }
  .circle-sp_burgundy_\#6a222a {
    background-color: #6a222a;
  }
  .circle-sp_burgundy_\#731621 {
    background-color: #731621;
  }
  .circle-sp_marigold_\#44 {
    background-color: #965900;
  }
  .circle-sp_marigold_\#41 {
    background-color: #965900;
  }
  .circle-sp_french_blue_\#45 {
    background-color: #242e38;
  }
  .circle-sp_french_blue_\#42 {
    background-color: #242e38;
  }
  .circle-sp_rusty_rose_\#46 {
    background-color: #702100;
  }
  .circle-sp_rusty_rose_\#43 {
    background-color: #702100;
  }
  .circle-sp_blush_pink_\#47 {
    background-color: #ffe2e4;
  }
  .circle-sp_dusty_purple_\#48 {
    background-color: #5b365a;
  }
  .circle-sp_blush_pink_\#ffe2d1 {
    background-color: #ffe2d1;
  }
  .circle-sp_royal_blue_\#31417d {
    background-color: #31417d;
  }
  .circle-sp_lavender_\#eedaf1 {
    background-color: #eedaf1;
  }
  .circle-sp_raspberry_\#d82c67 {
    background-color: #d82c67;
  }
  .circle-light_apricot {
    background-color: #fef9ed;
  }
  .circle-sp_red_\#da0000 {
    background-color: #da0000;
  }
  .circle-sp_burgundy_\#590211 {
    background-color: #590211;
  }
  .circle-sp_forest_green_\#0f5749 {
    background-color: #0f5749;
  }
  .circle-light_gray {
    background-color: #bcc0c3;
  }
  .circle-light_brown {
    background-color: #a57943;
  }
  .circle-sp_purple_\#4b2c4c {
    background-color: #4b2c4c;
  }
  .circle-sp_cabernet_\#5e1f1b {
    background-color: #5e1f1b;
  }
  .circle-navy_blue {
    background-color: #2b364e;
  }
  .circle-beige {
    background-color: #f2edd8;
  }
  .circle-dolpin_grey {
    background-color: #969da3;
  }
  .circle-sp_dusty_blue_\#90b5ab {
    background-color: #90b5ab;
  }
  .circle-sp_slate_blue_\#6596b1 {
    background-color: #6596b1;
  }
  .circle-sp_royal_blue_\#182049 {
    background-color: #182049;
  }
  .circle-sp_burgundy_\#762f32 {
    background-color: #762f32;
  }
  .circle-sp_burgundy_\#873a3d {
    background-color: #873a3d;
  }
  .circle-sp_blue_grey_\#9cabb4 {
    background-color: #9cabb4;
  }
  .circle-sp_blush_\#e0c1b0 {
    background-color: #e0c1b0;
  }
  .circle-sp_burgundy_\#8e0229 {
    background-color: #8e0229;
  }
  .circle-sp_navy_blue_\#343a61 {
    background-color: #343a61;
  }
  .circle-sp_navy_blue_\#2d3356 {
    background-color: #2d3356;
  }
  .circle-sp_burgundy_\#62 {
    background-color: #6d0017;
  }
  .circle-sp_wisteria_\#c3a5bb {
    background-color: #c3a5bb;
  }
  .circle-sp_dusty_sage_\#bccab3 {
    background-color: #bccab3;
  }
  .circle-sp_dusk_\#ccbdca {
    background-color: #ccbdca;
  }
  .circle-sp_dark_green_\#0a574d {
    background-color: #0a574d;
  }
  .circle-sp_pearl_pink_\#fcdbd4 {
    background-color: #fcdbd4;
  }
  .circle-sp_blushing_pink_\#fee5ec {
    background-color: #fee5ec;
  }
  .circle-sp_mulberry_\#9a375a {
    background-color: #9a375a;
  }
  .circle-sp_steel_blue_\#809dbd {
    background-color: #809dbd;
  }
  .circle-sp_mist_\#d5e7f5 {
    background-color: #d5e7f5;
  }
  .circle-sp_vintage_mauve_\#cfb1b5 {
    background-color: #cfb1b5;
  }
  .circle-sp_silver_\#cfd1cc {
    background-color: #cfd1cc;
  }
  .circle-sp_stormy_\#636784 {
    background-color: #636784;
  }
  .circle-sp_lilac_\#e6cbf8 {
    background-color: #e6cbf8;
  }
  .circle-sp_sky_blue_\#cbeafe {
    background-color: #cbeafe;
  }
  .circle-sp_dark_emerald_\#294138 {
    background-color: #294138;
  }
  .circle-sp_red_\#d82020 {
    background-color: #d82020;
  }
  .circle-sp_silver {
    background-color: #cfd1cc;
  }
  .circle-light_brown_fur {
    background-color: #a57943;
  }
  .circle-dusty_rose_fur {
    background-color: #dbbfb3;
  }
  .circle-sp_metallic_black_\var(--color-121212) {
    background-color: var(--color-121212);
  }
  .circle-sp_navy_blue_\#343c56 {
    background-color: #343c56;
  }
  .circle-sp_burgundy_\#750000 {
    background-color: #750000;
  }
  .circle-sp_metallic_black_silver_\var(--color-121212) {
    background-color: var(--color-121212);
  }
  .circle-sp_royal_blue_\#2e93f7 {
    background-color: #2e93f7;
  }
  .circle-sp_burgundy_\#871233 {
    background-color: #871233;
  }
  .circle-sp_burgundy_\#640f16 {
    background-color: #640f16;
  }
  .circle-sp_burgundy_\#a31442 {
    background-color: #a31442;
  }
  .circle-sp_olive_\#5e7244 {
    background-color: #5e7244;
  }
  .circle-sp_red_\#eb1426 {
    background-color: #eb1426;
  }
  .circle-sp_red_\#b80b19 {
    background-color: #b80b19;
  }
  .circle-sp_navy_blue_\#182049 {
    background-color: #182049;
  }
  .circle-sp_metallic_silver_pink_\#66 {
    background-color: #dcc397;
  }
  .circle-sp_white_\#f9ebd1 {
    background-color: #f9ebd1;
  }
  .circle-sp_olive_green_\#38471a {
    background-color: #38471a;
  }
  .circle-sp_white_\#f6f0c8 {
    background-color: #f6f0c8;
  }
  .circle-sp_forest_green_\#054327 {
    background-color: #054327;
  }
  .circle-sp_rusty_rose_\#b8695c {
    background-color: #b8695c;
  }
  .circle-sp_ivory_\#f6f0c8 {
    background-color: #f6f0c8;
  }
  .circle-sp_grey_\#8c8c84 {
    background-color: #8c8c84;
  }
  .circle-sp_teal_green_\#14515f {
    background-color: #14515f;
  }
  .circle-sp_forest_green_\#21522d {
    background-color: #21522d;
  }
  .circle-sp_dark_navy_\#253044 {
    background-color: #253044;
  }
  .circle-sp_red_\#f11616 {
    background-color: #f11616;
  }
  .circle-sp_blush_\#ecc8a9 {
    background-color: #ecc8a9;
  }
  .circle-sp_ivory_\#f2edd3 {
    background-color: #f2edd3;
  }
  .circle-sp_khaki_\#b5ab6a {
    background-color: #b5ab6a;
  }
  .circle-sp_teal_green_\#0d575c {
    background-color: #0d575c;
  }
  .circle-sp_khaki_\#c0b092 {
    background-color: #c0b092;
  }
  .circle-greyish_blue {
    background-color: #c4d3e8;
  }
  .circle-sapphire {
    background-color: #003295;
  }
  .circle-dark_teal {
    background-color: #336e7c;
  }
  .circle-strawberry {
    background-color: #d12977;
  }
  .circle-berry {
    background-color: #bd282a;
  }
  .circle-light_purple {
    background-color: #a05ca5;
  }
  .circle-dark_red {
    background-color: #552125;
  }
  .circle-turquiose {
    background-color: #87d9ca;
  }
  .circle-magenta {
    background-color: #af106a;
  }
  .circle-coffee {
    background-color: #7c5c4d;
  }
  .circle-light_grey {
    background-color: #b5b1ae;
  }
  .circle-light_pink {
    background-color: #ddbdbe;
  }
  .circle-light_green {
    background-color: #d2c9c0;
  }
  .circle-sp_pink_\#f8eeed {
    background-color: #f8eeed;
  }
  .circle-sp_champagne_\#ffeccd {
    background-color: #ffeccd;
  }
  .circle-sp_sky_blue_\#d3e4ef {
    background-color: #d3e4ef;
  }
  .circle-sp_pink_\#f3d7cf {
    background-color: #f3d7cf;
  }
  .circle-pattern_white {
    background-color: #ffffff;
  }
  .circle-sp_brown_\#4e2d19 {
    background-color: #4e2d19;
  }
  .circle-sp_orange_\#c8731f {
    background-color: #c8731f;
  }
  .circle-sp_brown {
    background-color: #4e2d19;
  }
  .circle-sp_orange {
    background-color: #c8731f;
  }
  .circle-purple {
    background-color: #9e81b7;
  }
  .circle-green {
    background-color: #4e712d;
  }
  .circle-yellow {
    background-color: #fef984;
  }
  .circle-neutral {
    background-color: #e2d0a8;
  }
  .circle-blue {
    background-color: #60e0f9;
  }
}
</style>
