<template>
  <!-- 订单完成页ambassador（校园大使）入口 -->
  <div @click="$router.push(`/ambassador-program`)" class="ambassador-apply">
    <img
      v-track.view="{
        common: {
          ec: 'banner',
          el: 'ambassador banner'
        }
      }"
      :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/point/ambassador/3d8fc8bed623bf6561e8873b5ae83d8cb14ed2d5.jpg')"
      alt="ambassador apply"
    />
    <div class="banner-content-tip">
      <h3 class="banner-tip">{{ nl('page_ambassador_banner_tip2') }}</h3>
      <p class="banner-tip2">{{ nl('page_ambassador_banner_tip3') }}</p>
      <p
        v-track.click="{
          common: {
            ec: 'banner',
            el: 'apply now'
          }
        }"
        class="apply-button"
      >
        {{ nl('page_ambassador_learn_more') }}
      </p>
    </div>
  </div>
</template>
<style lang="less" scoped>
.ambassador-apply {
  position: relative;
  margin: 40px auto;
  color: #fff;
  img {
    width: 100%;
  }
  .banner-content-tip {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
  }
  .banner-tip {
    width: 100%;
    text-align: center;
    font-family: @font-Ivy-Mode-700;
    text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
    font-size: 50px;
    color: #fff;
  }
  .banner-tip2 {
    font-family: @font-family-500;
    font-style: normal;
    font-weight: 400;
    font-size: 28px;
    margin: 6px 0 30px;
    text-align: center;
    letter-spacing: 0.06em;
    color: #ffffff;
    text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.5);
  }
  .apply-button {
    width: 280px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: @theme;
    font-size: 20px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    margin: auto;
  }
}
</style>
