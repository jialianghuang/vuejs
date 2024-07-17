<template>
  <div id="product_customer_photo">
    <p class="module-title">{{ nl('page_header_customer_photo') }}</p>
    <product-swiper
      :prodList="tempList"
      :nextEl="'customer-swiper-button-next'"
      :prevEl="'customer-swiper-button-prev'"
      :slidesPerView="slidesPerView"
      :showArrowIcon="showArrowIcon"
    >
      <div ref="customer_photo_swiper" v-swiper:customer_photo_swiper="customerPhotoswiperOption" class="swiper-container">
        <div class="swiper-wrapper product-swiper-viewport">
          <div
            v-track.view.click="getTrackCommon(item.type, id)"
            v-for="(item, id) in tempList"
            :key="id"
            @click="showPopupCustomerPhotoShow(id)"
            class="goods-item swiper-slide"
          >
            <customer-swiper-item :item="{ ...item, index: id }"></customer-swiper-item>
          </div>
        </div>
      </div>
    </product-swiper>
    <div class="upload-btn-box">
      <div
        @click="showPopupCustomerPhotoUpload()"
        class="upload_btn need_datalayer"
        data-datalayer-category="PC_DetailPageRevision"
        data-datalayer-label="DetailPageA_UploadAPhoto_Click"
      >
        {{ nl('page_product_upload_photo') }}
      </div>
    </div>
  </div>
</template>

<script>
import ProductSwiper from '@/components/product/ProductSwiper'
import CustomerSwiperItem from '@/components/product/CustomerSwiperItem'
export default {
  name: 'CustomerPhoto',
  languageKeys: ['page_header_customer_photo', 'page_product_upload_photo'],
  components: {
    ProductSwiper,
    CustomerSwiperItem
  },
  props: {
    customPhotoList: {
      type: Array,
      default() {
        return []
      }
    },
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    spaceBetween: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      slidesPerView: null,
      showArrowIcon: true,
      tempList: []
    }
  },
  computed: {
    customerPhotoswiperOption({ spaceBetween }) {
      const options = {
        slidesPerView: 'auto',
        spaceBetween: 10,
        slidesPerGroup: 6,
        speed: 800,
        navigation: {
          nextEl: '.customer-swiper-button-next',
          prevEl: '.customer-swiper-button-prev'
        }
      }
      return options
    }
  },
  mounted() {
    this.tempList = JSON.parse(JSON.stringify(this.customPhotoList))
    if (this.isSpecialCatId(this.catId)) {
      this.getSlidesPerView()
      window.addEventListener('resize', this.getSlidesPerView)
    }
    this.$nextTick(() => {
      this.computedArrowShow()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getSlidesPerView)
  },
  methods: {
    getTrackCommon(type, index) {
      const isVersionB = this.sodDetailVersionFun(this.baseInfo)
      // const length = this.customPhotoList.length
      const msg = {
        index: index + 1,
        goodsId: this.baseInfo.goodsId,
        cat_id: this.baseInfo.catId,
        cat_name: this.baseInfo.catName,
        dress_type: this.baseInfo.dressType
      }
      // jira:19068--sod 命中B版本，且图片数量小于5
      if (this.isSpecialCatId(this.baseInfo.catId)) {
        msg.middle = '0'
        if (isVersionB) {
          msg.ab = 'b'
        } else {
          msg.ab = 'a'
        }
      }
      return {
        common: {
          ec: 'customphotos',
          el: type == 'image' ? 'customphotos' : 'video',
          msg: JSON.stringify(msg)
        }
      }
    },
    showPopupCustomerPhotoShow(index) {
      this.$store.commit('product/setPopupCustomerPhotoShow', { popupCustomerPhotoShow: true, popupCustomerPhotoIndex: index })
    },
    showPopupCustomerPhotoUpload() {
      this.buryPoint(this, 'event', {
        ec: 'customphotos',
        el: 'upload a photo',
        ea: 'click'
      })
      this.$store.commit('product/setPopupCustomerPhotoUploadShow', true)
    },
    getSlidesPerView() {
      const containerDom = document.querySelector('#product_customer_photo .swiper-container')
      const containerWidth = containerDom && containerDom.clientWidth
      this.slidesPerView = Math.floor(containerWidth / (60 + 10))
      this.computedArrowShow()
    },
    computedArrowShow() {
      const containerDom = document.querySelector('#product_customer_photo .product-swiper-container')
      const itemDom = document.querySelectorAll('#product_customer_photo .product-swiper-container .img-box')
      const cWidth = containerDom && containerDom.getBoundingClientRect().width
      let iWidth = 0
      itemDom &&
        itemDom.forEach((item) => {
          iWidth += item.getBoundingClientRect().width + 10
        })
      if (cWidth >= iWidth) {
        this.showArrowIcon = false
      } else {
        this.showArrowIcon = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
#product_customer_photo {
  margin-bottom: 60px;
  .upload-btn-box {
    text-align: center;
  }
  .module-title {
    padding-bottom: 5px;
    margin-bottom: 20px;
    box-shadow: 0 1px 0 var(--color-121212);
    font-family: @font-family-600;
    font-size: 16px;
    line-height: 22px;
    color: var(--color-121212);
    text-transform: uppercase;
  }
  .upload_btn {
    min-width: 150px;
    padding: 0 10px;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-family: @font-family-500;
    font-weight: 600;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid var(--color-121212);
    cursor: pointer;
    text-transform: uppercase;
    margin: auto;
    text-align: center;
    margin-top: 30px;
  }
}
</style>
