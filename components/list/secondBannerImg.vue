<template>
  <div class="second-banner-img second-banner-commonbox">
    <div v-for="(item, index) in secondBannerImgArr" :key="index" class="item">
      <a
        v-track.view.click="getBiCommonParams(index + 1)"
        :href="countryUrl(item.href)"
        :data-datalayer-category="item.datalayer_category"
        :data-datalayer-label="item.datalayer_label"
        :class="{ need_datalayer: item.need_datalayer }"
        data-analysis-a="listPageSecondaryBannery"
      >
        <img :src="addWebpSuffix(item.img)" :alt="`${index}-${item.datalayer_category}`" class="img" />
        <div class="txt">{{ nl(item.text) }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecondBannerImg',
  languageKeys: [
    'page_header_gentlemen_accessories',
    'page_header_jewelry',
    'page_header_wraps',
    'page_header_face_mask',
    'page_header_wedding_veils'
  ],
  props: {},
  data() {
    return {
      secondBannerImgArr: [
        {
          img: 'https://cdn-1.azazie.com/upimg/userfiles/images/f4/b9/c455f843dcef84a21c910bcb4d10f4b9.jpg',
          href: '/all/groomsmen-accessories',
          need_datalayer: true,
          datalayer_category: 'secondary_banner',
          datalayer_label: 'Groomsmen_Acc_ListPage_Click',
          text: 'page_header_gentlemen_accessories'
        },
        {
          img: 'https://cdn-1.azazie.com/upimg/userfiles/images/7d/b7/ddab5841f7720c8fb1cd473accbe7db7.jpg',
          href: '/all/jewelry',
          need_datalayer: true,
          datalayer_category: 'secondary_banner',
          datalayer_label: 'Sashes_ListPage_Click',
          text: 'page_header_jewelry'
        },
        {
          img: 'https://cdn-1.azazie.com/upimg/userfiles/images/ea/b3/fefc4dc4ede76b8495a52001c88deab3.jpg',
          href: '/all/wraps',
          need_datalayer: true,
          datalayer_category: 'secondary_banner',
          datalayer_label: 'Wraps_ListPage_Click',
          text: 'page_header_wraps'
        },
        {
          img: 'https://cdn-1.azazie.com/upimg/userfiles/images/55/0f/b369c8506453a98a395490e23f95550f.jpg',
          href: '/all/face-masks',
          need_datalayer: true,
          datalayer_category: 'secondary_banner',
          datalayer_label: 'Face_Masks_ListPage_Click',
          text: 'page_header_face_mask'
        },
        {
          img: 'https://cdn-1.azazie.com/upimg/userfiles/images/92/05/18e119cbdb5a52d754fad5b216429205.jpg',
          href: '/all/wedding-veils',
          need_datalayer: true,
          datalayer_category: 'secondary_banner',
          datalayer_label: 'Wedding_Veils_ListPage_Click',
          text: 'page_header_wedding_veils'
        }
      ]
    }
  },
  mounted() {
    const items = []
    this.secondBannerImgArr.forEach((element, index) => {
      const msg = {
        ec: 'secondarybanner',
        el: this.catBiName + '_' + index + '_secondarybanner',
        ea: 'view',
        msg: {
          index: index + 1,
          cat_id: this.catId,
          category_ids: this.catIds,
          cat_name: this.seoCatName || this.catName,
          dress_type: this.dressType
        }
      }
      items.push(msg)
    })
    this.buryPoint(this, 'events', items)
  },
  methods: {
    getBiCommonParams(index) {
      if (process.server) return
      const category = this.catBiName
      const msg = {
        index,
        cat_id: this.catId,
        category_ids: this.catIds,
        cat_name: this.seoCatName || this.catName,
        dress_type: this.dressType
      }
      const params = {
        common: {
          ec: 'secondarybanner',
          el: category + '_' + index + '_secondarybanner',
          msg: JSON.stringify(msg)
        }
      }
      return params
    }
  }
}
</script>

<style lang="less" scoped>
.second-banner-img {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 16px;
  .item {
    border: 1px solid #eee;
    border-bottom: none;
  }
  .img {
    vertical-align: middle;
  }
  .txt {
    height: 36px;
    line-height: 34px;
    font-size: 13px;
    color: var(--color-121212);
    text-align: center;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    text-transform: capitalize;
  }
  .item:not(:last-child) {
    margin-right: 15px;
  }
}
</style>
