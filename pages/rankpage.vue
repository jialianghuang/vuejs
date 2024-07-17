<template>
  <div class="rank-box">
    <main-app :navigation="navigation">
      <div id="rank_list_wrap">
        <div class="top_banner">
          <img :src="replaceImgCdnUrl(rankpageInfo.banner)" alt="banner" />
        </div>
        <div :style="{ 'background-image': rankpageInfo.background }" class="content">
          <a v-for="(goodsItem, index) in rankpageData" :key="index" :href="countryUrl(goodsItem.goodsUrl)" class="top">
            <rankpage-goods-item :goodsItem="goodsItem" :itemIndex="index"></rankpage-goods-item>
          </a>
          <a :href="countryUrl('/all/dresses?sod_view=petite')" aria-label="dresses" class="find_more_dress">
            <img :src="replaceImgCdnUrl(nl('page_image_rank_page_img'))" alt="FIND MORE DRESSES" />
          </a>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import rankpageGoodsItem from '@/components/rankpage/RankpageGoodsItem'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

export default {
  name: 'RankPage',
  components: {
    MainApp,
    rankpageGoodsItem
  },
  data() {
    return {}
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const path = context.route.path
      const rankNum = path.substr(-6, 6)
      const url = '/1.0/rank-page?rank_number=' + rankNum
      const res = await context.$axios.$get(url)
      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(
          302,
          context.store.state.currentCountryUrl + `/sale_down?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`
        )
        return
      }
      context.store.commit('setJsKey', 'rankPage')

      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        rankpageInfo: res.data.rankInfo || {},
        rankpageData: res.data.rankList || [],
        url
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    if (process.client) {
    }
  }
}
</script>

<style lang="less">
.rank-box {
  #rank_list_wrap {
    padding: 10px 30px 0;
    box-sizing: border-box;
    min-width: 1263px;
    max-width: 1353px;
    margin: 0 auto;
    width: 1353px;
    margin-bottom: 80px;
    .top_banner {
      width: 100%;
      img {
        width: 100%;
        vertical-align: middle;
      }
    }
    .content {
      background-repeat: repeat-y;
      background: linear-gradient(to right, #f6e9d7, 50%, #eadbc5);
      padding-bottom: 8px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      img {
        width: 100%;
        height: 100%;
      }
      .top {
        position: relative;
        width: 378px;
        margin: 8px 0 32px 40px;
        display: flex;
        .goods_img {
          position: relative;
          .icon {
            width: 45px;
            height: 52px;
            position: absolute;
            z-index: 1;
            left: 0;
            top: -8px;
            img {
              vertical-align: middle;
              width: 100%;
              height: 100%;
            }
            span {
              display: inline-block;
              width: 40px;
              height: 52px;
              color: #ffffff;
              font-family: @font-family-700;
              font-size: 26px;
              position: absolute;
              top: 0;
              left: 0;
              line-height: 42px;
              text-align: center;
            }
          }
          .img_and_chart_part {
            position: relative;
            width: 378px;
            height: 523px;
          }
          .img_part {
            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 378px;
              height: 523px;
              animation: 0.5s slow_hide linear forwards;
              &.show {
                display: block;
                opacity: 1;
                animation: 0.5s slow_show linear forwards;
              }
            }
          }
          .info_part {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 20px 15px;
            background: #ffffff;
            .attr_part {
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-start;
              align-items: center;
              margin-bottom: 14px;
              .attr {
                box-sizing: border-box;
                height: 28px;
                border: 1px solid var(--color-cccccc);
                -webkit-border-radius: 14px;
                -moz-border-radius: 14px;
                border-radius: 14px;
                line-height: 28px;
                font-size: 16px;
                color: var(--color-121212);
                font-family: @font-family-500;
                width: fit-content;
                padding: 0 15px;
                margin-bottom: 10px;
                margin-right: 15px;
              }
            }
            .info_line {
              display: flex;
              justify-content: center;
              align-items: center;
              color: var(--color-121212);
              font-family: @font-family-600;
              font-size: 24px;
              line-height: 34px;
              img {
                width: 26px;
                height: 34px;
              }
              .title {
                margin-left: 10px;
                margin-right: 8px;
              }
              .show_details {
                margin-left: 15px;
                font-size: 16px;
                color: var(--color-999999);
                line-height: 22px;
                text-decoration: underline;
              }
              margin-bottom: 20px;
            }
            .price_part {
              margin-bottom: 24px;
            }
            .no_deal_price {
              font-family: @font-family-500;
              color: var(--color-999999);
              font-size: 16px;
              text-decoration: line-through;
              margin-left: 5px;
            }
            .buy_btn {
              width: 100%;
              height: 50px;
              text-transform: uppercase;
              font-size: 14px;
              color: #ffffff;
              font-family: @font-family-600;
              background: #d78e97;
              line-height: 50px;
              text-align: center;
            }
          }
        }
        .goods_info {
          width: 100%;
          height: 0;
          background: #ffffff;
          opacity: 0.98;
          position: absolute;
          left: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 1;
          transition: all 0.5s;
          .score_img {
            width: 342px;
            height: 276px;
            margin: 20px auto auto auto;
          }
          .score_value {
            position: absolute;
            top: 20px;
            width: 100%;
            height: 276px;
            font-weight: bold;
            font-size: 35px;
            color: var(--color-121212);
            line-height: 276px;
            text-align: center;
          }
          &.show {
            height: 306px;
          }
        }
        &:first-of-type {
          .icon {
            width: 66px;
            height: 64px;
            position: absolute;
            left: -26px;
            top: -22px;
            span {
              display: none;
            }
          }
        }
      }
      .find_more_dress {
        position: relative;
        width: 796px;
        height: 815px;
        margin: 8px 0 32px 40px;
        .find_btn_block {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          .find_btn {
            display: inline-block;
            background: #d78e97;
            color: #ffffff;
            font-size: 14px;
            font-family: @font-family-600;
            width: 235px;
            height: 40px;
            margin: auto;
            line-height: 40px;
            text-align: center;
          }
        }
      }
    }
  }
}
// 动画
@keyframes slow_show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slow_hide {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    display: none;
  }
}
</style>
