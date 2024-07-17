<template>
  <div class="goods_img goods_part">
    <div class="icon">
      <img v-if="itemIndex > 3" :src="replaceImgCdnUrl(imgIcon[3])" alt="image" />
      <img v-else :src="replaceImgCdnUrl(imgIcon[itemIndex])" alt="image" />
      <span>{{ itemIndex + 1 }}</span>
    </div>
    <div class="img_and_chart_part">
      <div @mouseenter="showBackImg" @mouseleave="showBackImg" :href="countryUrl(goodsItem.goodsUrl)" class="img_part">
        <img :class="{ show: !backImgShow }" :src="replaceImgCdnUrl(`${PIC_PATH}s360/${goodsItem.imgUrl}`)" alt="image" class="small_img" />
        <img
          :class="{ show: backImgShow }"
          :src="replaceImgCdnUrl(`${PIC_PATH}s360/${goodsItem.backImgUrl}`)"
          alt="image"
          class="large_img"
        />
      </div>
      <div :class="{ show: scoreLayerShow }" class="goods_info chart_part">
        <div>
          <div :id="'score_' + itemIndex" class="score_img"></div>
          <div class="score_value">{{ goodsItem.totalScore }}</div>
        </div>
      </div>
    </div>
    <div class="info_part">
      <div class="attr_part">
        <div v-for="(attr, attrIndex) in goodsItem.labels" :key="attrIndex" class="attr">{{ attr }}</div>
      </div>
      <div class="info_line">
        <img src="~assets/images/rankPage/score.png" alt="score" />
        <div class="title">{{ nl('page_common_score') }}:</div>
        <div>{{ goodsItem.totalScore }}</div>
        <div @mouseenter="showScore" @mouseleave="showScore" class="show_details">{{ nl('page_common_check_details') }}</div>
      </div>
      <div class="info_line price_part">
        <img src="~assets/images/rankPage/price.png" alt="price" />
        <div class="title">{{ nl('page_filter_price') }}:</div>
        <div :style="{ color: goodsItem.hasLinePrice ? 'var(--color-121212)' : '' }" class="price">
          {{ goodsItem.shopPriceDisplay }}
        </div>
        <div v-if="goodsItem.hasLinePrice" class="no_deal_price">
          {{ goodsItem.noDealPriceDisplay }}
        </div>
      </div>
      <div :href="goodsItem.goodsUrl" class="buy_btn"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankpageGoodsItem',
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    },
    itemIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scoreLayerShow: false,
      backImgShow: false,
      imgIcon: [
        require('~/assets/images/rankPage/top_1.png'),
        require('~/assets/images/rankPage/top_2.png'),
        require('~/assets/images/rankPage/top_3.png'),
        require('~/assets/images/rankPage/top_4.png')
      ]
    }
  },
  mounted() {
    const t = this
    const myChart = this.$echarts.init(document.getElementById('score_' + this.itemIndex))
    const item = this.goodsItem.scores
    const option = {
      tooltip: {},
      radar: {
        name: {
          textStyle: {
            color: 'var(--color-121212)',
            borderRadius: 3,
            padding: [1, 2]
          }
        },

        indicator: [
          { name: 'popularity', max: 100 },
          { name: 'quality', max: 100 },
          { name: 'comfort', max: 100 },
          { name: 'reviews', max: 100 },
          { name: 'fit', max: 100 }
        ]
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              name: 'radar',
              value: [item.popularityScore, item.qualityScore, item.comfortScore, item.reviewsScore, item.fitScore],
              areaStyle: {
                normal: {
                  opacity: 0.1,
                  color: new t.$echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                    {
                      color: '#D78E97',
                      offset: 0
                    }
                  ])
                }
              },
              lineStyle: {
                normal: {
                  color: '#D78E97',
                  opacity: 0.6,
                  width: 1
                }
              }
            }
          ]
        }
      ]
    }
    myChart.setOption(option)
  },
  methods: {
    showScore() {
      this.scoreLayerShow = !this.scoreLayerShow
    },
    showBackImg() {
      this.backImgShow = !this.backImgShow
    }
  }
}
</script>
learn More

<style lang="less" scoped>
.title {
  text-transform: uppercase;
}
</style>
