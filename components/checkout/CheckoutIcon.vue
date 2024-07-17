<template>
  <div :class="[country, `from_${from}`]" class="checkout_icon">
    <div v-if="from == 'cart'" class="payment-type">
      <SvgPayment />
      <div class="h3">{{ nl('page_common_cart_we_accept') | filterWeAccept }}</div>
      <ul class="card-list">
        <li v-for="(item, index) in allPayCardList" :key="item + index" class="card-item">
          <img
            v-if="item == 'cartes-bancaires'"
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/77/51/723e448f39d9ccc6f8f1c96bcefa7751.png')"
            alt="cartes bancaires"
          />
          <az-icon v-else :icon-class="item" class="icon"></az-icon>
        </li>
        <i v-for="i in 5" :key="i" style="width: 46.36px;"></i>
      </ul>
    </div>
    <template v-else>
      <div v-if="country == 'CA'" class="desc">{{ nl('page_cart_a_trusred_bridal') }}</div>
      <div class="cart_icon">
        <div class="ssl_icon">
          <img src="~/assets/images/checkout/secure.svg" alt="secure" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SvgPayment from '@/components/svgs/SvgPayment'

export default {
  name: 'CheckoutIcon',
  components: { SvgPayment },
  filters: {
    // 因为多语言中有：，没必要新增多语言，直接对内容进行处理
    filterWeAccept(e) {
      return e.split(':')[0]
    }
  },
  props: {
    from: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.checkout_icon {
  .cart_icon {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: auto;
      height: 52px;
      display: block;
    }
    .theknot {
      img {
        height: 70px;
      }
    }
    .ssl_icon {
      img {
        height: 60px;
      }
    }
  }
  &.CA:not(.from_cart) {
    margin: 15px 0;
    padding: 20px 10px;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #eee;
    font-size: 14px;
    font-family: @font-family-500;
    color: #454545;
    line-height: 16px;
    text-align: center;
    .cart_icon {
      padding: 0;
      justify-content: space-around;
    }
  }

  .payment-type {
    padding: 15px 20px;
    box-sizing: border-box;
    .h3 {
      font-size: 13px;
      line-height: 18px;
      text-transform: uppercase;
      color: var(--color-121212);
    }
    .card-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      grid-gap: 0px 6px;
      .card-item {
        margin-top: 10px;
        img {
          width: 46.36px;
          height: 30px;
        }
        .az-icon {
          width: 46.36px;
          height: 30px;
        }
      }
    }
  }
}
</style>
