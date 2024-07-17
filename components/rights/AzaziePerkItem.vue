<template>
  <div class="azazie-perk-item">
    <div class="perk-item-box">
      <div class="item-box">
        <img v-if="data.thumb" :src="replaceImgCdnUrl(data.thumb)" :class="{ img: data.thumb }" alt="azaize perk" />
        <img v-else src="~/assets/images/rights/img-bg.png" alt="azaize perk" width="200" />
      </div>
      <div class="item-box-detail">
        <div class="detail-title">
          {{ nl('page_azazie_perks_perks_details') }}
        </div>
        <div class="detail-content">
          <template v-for="(item, index) in data.description">
            <div :key="index" class="detail-content-item">
              <span>{{ index + 1 }}. {{ nl(item) }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="item-box-btn">
        <div class="btn-text">
          <span>{{ nl('page_azazie_perks_total_value') }}</span>
          <span class="cross-text">{{ data.showMarketPrice }}</span>
          <span class="cross-text-right">{{ data.showShopPrice }}</span>
        </div>
        <div v-track.click="{ common: { ec: 'buynow', el: 'button' } }" @click="$emit('payment', data.rightsId)" class="btn-btn">
          <span>{{ nl('page_common_buy_now') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AzaziePerkItem',
  components: {},
  props: {
    data: {
      type: [Object, Array],
      default: () => []
    },
    id: {
      type: [Number, String],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>
.azazie-perk-item {
  width: calc(50% - 10px);
  .perk-item-box {
    .item-box {
      text-align: center;
      width: calc(100% - 2px);
      border: 1px dashed #eee;
      border-radius: 2px;
      .img {
        width: 100%;
        vertical-align: bottom;
      }
    }
    .item-box-detail {
      min-height: 194px;
      padding: 15px 25px;
      box-sizing: border-box;
      border: 1px solid #eee;
      border-top: none;
      text-align: left;
      .detail-title {
        margin-bottom: 10px;
        height: 19px;
        font-size: 14px;
        font-family: @font-family-600;
        font-weight: 600;
        color: #666660;
        line-height: 19px;
        text-transform: uppercase;
      }
      .detail-content-item {
        font-size: 12px;
        font-family: @font-family-500;
        color: var(--color-666666);
        line-height: 17px;
        padding-bottom: 5px;
      }
    }
    .item-box-btn {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 37px;
      margin-bottom: 30px;
      flex-grow: 1;
      .btn-text {
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
          display: inline-block;
          height: 19px;
          font-size: 14px;
          font-family: @font-family-500;
          color: var(--color-121212);
          line-height: 19px;
          &.cross-text {
            text-indent: 0.25em;
            text-decoration: line-through;
          }
          &.cross-text-right {
            height: 33px;
            font-size: 24px;
            font-family: @font-family-600;
            font-weight: 600;
            color: var(--color-121212);
            line-height: 33px;
            text-indent: 0.4em;
          }
        }
      }
      .btn-btn {
        width: 180px;
        height: 50px;
        background: var(--color-121212);
        padding: 15px 47px;
        margin-left: 20px;
        box-sizing: border-box;
        color: #fff;
        font-family: @font-family-600;
        text-align: center;
        text-transform: uppercase;
        cursor: pointer;
      }
    }
  }
}
</style>
