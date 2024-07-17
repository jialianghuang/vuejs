<template>
  <div class="sod-list-top">
    <div class="sod-list-top-box">
      <div v-for="(item, index) in list" :key="index" class="sod-list-top-item">
        <img :src="addWebpSuffix(item.imgUrl)" :alt="item.desc" class="sod-list-top-item-left" />
        <div class="sod-list-top-item-middle"></div>
        <div class="sod-list-top-item-right">
          <p class="title">{{ item.title }}</p>
          <p class="desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SodListTop',
  languageKeys: [
    'page_common_list_new_small_text1',
    'page_common_list_new_small_text2',
    'page_common_list_new_small_text3',
    'page_common_list_new_small_text4',
    'page_common_list_new_small_text5',
    'page_common_list_new_small_text6'
  ],
  computed: {
    list({ nl }) {
      return [
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/f9/46/93b97d14b128844bdea3a373f652f946.jpg',
          title: nl('page_common_list_new_small_text1'),
          desc: nl('page_common_list_new_small_text2')
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/44/29/95b8365b5c8186e1bc7355c386844429.jpg',
          title: nl('page_common_list_new_small_text3'),
          desc: nl('page_common_list_new_small_text4')
        },
        {
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/fb/20/f83d44e1e8623a20ab278118c893fb20.jpg',
          title: nl('page_common_list_new_small_text5'),
          desc: nl('page_common_list_new_small_text6')
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.sod-list-top {
  margin: 30px auto;
  &-box {
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
  }
  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
    &:not(:last-child) {
      margin-right: 30px;
    }
    img {
      width: 60px;
      height: 70px;
      vertical-align: middle;
    }
    &-middle {
      width: 1px;
      height: 70px;
      margin: 0 25px;
      background-color: #eee;
    }
    &-right {
      max-width: 230px;
      .title {
        color: #121212;
        font-family: @font-Ivy-Mode;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }
      .desc {
        margin-top: 5px;
        color: #121212;
        font-family: @font-family-500;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        &::first-letter {
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
