<template>
  <div class="showroom-empty">
    <div id="guide_flag_img" class="guide_flag_img">
      <img :src="require('~/assets/images/showroom/status_init.png')" alt="status_init" />
    </div>
    <p class="showroom-init-title">{{ nl('page_showroom_init_title') }}</p>
    <p class="showroom-init-content">{{ nl('page_showroom_init_content') }}</p>
    <span id="showroom-init-add-btn" class="showroom-init-add-btn">
      <a :href="countryUrl('/all/bridesmaid-dresses')" target="_blank">{{ nl('page_showroom_add_more') }}</a>
    </span>
  </div>
</template>
<script>
export default {
  name: 'ShowroomEmpty',
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.showroom-empty {
  margin: auto;
  text-align: center;
  .guide_flag_img {
    padding-top: 50px;
    img {
      width: 223px;
      vertical-align: middle;
    }
  }
  .showroom-init-title {
    font-size: 24px;
    font-family: @font-family-600;
    margin: 20px 0 5px;
  }
  .showroom-init-content {
    font-size: 16px;
    margin-bottom: 20px;
  }
  .showroom-init-add-btn {
    display: inline-block;
    width: 220px;
    height: 40px;
    background: var(--color-121212);
    border-radius: none;
    a {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-family: @font-family-600;
      color: #fff;
      line-height: 40px;
      display: inline-block;
      text-transform: uppercase;
    }
  }
}
</style>
