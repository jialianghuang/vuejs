<template>
  <div class="content-box coupon-code">
    <div v-for="(item, index) in newUserCouponInfo" :key="index" class="content-box-item">
      <p class="icon-title">{{ nl(item.title) }}</p>
      <p class="icon-des">{{ nl(item.des) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CouponCode',
  languageKeys: [
    'page_common_new_user_coupon_1',
    'page_common_new_user_coupon_1_1',
    'page_common_new_user_coupon_2',
    'page_common_new_user_coupon_2_1',
    'page_common_new_user_coupon_3',
    'page_common_new_user_coupon_3_1'
  ],
  data() {
    return {
      newUserCouponInfo: [
        {
          title: 'page_common_new_user_coupon_2',
          des: 'page_common_new_user_coupon_2_1'
        },
        {
          title: 'page_common_new_user_coupon_1',
          des: 'page_common_new_user_coupon_1_1'
        },
        {
          title: 'page_common_new_user_coupon_3',
          des: 'page_common_new_user_coupon_3_1'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.content-box.coupon-code {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 100%;
  background: var(--color-fcf8f6);
  .content-box-item {
    text-align: center;
    width: calc(100% / 3);
    padding-top: 13px;
    padding-bottom: 13px;
    .icon-wrap {
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      svg {
        font-size: 20px;
      }
    }
    .icon-title {
      font-family: @font-family-600;
      font-size: 14px;
      margin-bottom: 2px;
    }
    .icon-des {
      font-family: @font-family;
      font-size: 10px;
      color: #121212;
    }
  }
}
</style>
