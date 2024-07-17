<template>
  <div v-if="['US', 'CA', 'AU', 'IE', 'GB'].includes(country)" class="excitation-card">
    <div class="excitation-card-wrapper">
      <img :src="cardInfo.iconUrl" :alt="cardInfo.iconText" class="excitation-card-wrapper-img" />
      <div class="excitation-card-wrapper-text">
        <p :class="['bold', cardInfo.type]">{{ cardInfo.text }}</p>
        <p v-if="cardInfo.subText" class="light">{{ cardInfo.subText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExcitationCard',
  languageKeys: [],
  props: {
    sticker: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cardType: {
        going_fast: {
          iconUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/8d/c4/2d6241175563f6de1b900bef5aba8dc4.png',
          iconText: 'going fast!',
          iconSubText: '58 sold',
          type: 'clock'
        },
        medal: {
          iconUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/8b/59/203858958aa3810b4fa69aeec5bc8b59.png',
          iconText: 'rated 5',
          iconSubText: 'out of 5 for quality',
          type: 'medal'
        },
        trending_sold: {
          iconUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/6f/a0/835604346bc8cd46c9e424ffc0056fa0.png',
          iconText: 'trending!',
          iconSubText: '100+ sold',
          type: 'flame'
        },
        popular_view: {
          iconUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/3e/19/7a5dc149b3d1e7b656a2041bfa593e19.png',
          iconText: 'popular',
          iconSubText: '81 viewing ',
          type: 'observe'
        }
      }
    }
  },
  computed: {
    cardInfo({ sticker, cardType }) {
      /** subText
      : 
      " 56 viewing"
      text
      : 
      "Popular"
      type
      : 
      "popular_view" */
      if (sticker.type && cardType[sticker.type]) {
        return {
          ...sticker,
          iconUrl: cardType[sticker.type].iconUrl,
          subText: sticker.type == 'trending_sold' ? '200 + sold' : sticker.subText
        }
      }
      return {}
    }
  }
}
</script>

<style lang="less" scoped>
.excitation-card {
  position: absolute;
  left: 0;
  bottom: 15px;
  padding: 8px 10px;
  background-color: #fff;
  z-index: @z-index-2;
  &-wrapper {
    display: flex;
    align-items: center;
    column-gap: 6px;
  }
  &-wrapper-img {
    width: 20px;
    height: 20px;
  }
  &-wrapper-text {
    max-height: 20px;
    display: flex;
    align-items: center;
    font-family: @font-family-500;
    font-size: 12px;
    color: var(--color-121212);
    .bold {
      font-family: @font-family-700;
      &::first-letter {
        text-transform: uppercase;
      }
      &.trending_sold {
        color: @theme;
      }
    }
    .light {
      margin-left: 5px;
    }
  }
}
</style>
