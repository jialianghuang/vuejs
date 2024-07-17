<template>
  <div class="empty-coupons-card">
    <div class="empty-text">
      <span>{{ nl('page_coupons_no_coupons') }}</span>
    </div>
    <div @click="viewMore" class="empty-btn">
      <span class="btn-text">{{ nl('page_coupons_btn_text') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyCouponsCard',
  methods: {
    viewMore() {
      location.href = this.countryUrl('/user?azazie_perks')
    }
  }
}
</script>

<style lang="less" scoped>
.empty-coupons-card {
  width: 100%;
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  .empty-text span {
    height: 18px;
    font-size: 13px;
    font-family: @font-family-500;
    color: var(--color-121212);
    line-height: 18px;
  }
  .empty-btn {
    width: 300px;
    height: 40px;
    background: var(--color-121212);
    text-align: center;
    line-height: 40px;
    margin-top: 30px;
    cursor: pointer;
    .btn-text {
      height: 19px;
      font-size: 14px;
      font-family: @font-family-600;
      font-weight: 600;
      color: #fff;
      line-height: 19px;
      text-transform: uppercase;
    }
  }
}
</style>
