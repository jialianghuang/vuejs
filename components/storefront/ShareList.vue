<template>
  <az-dialog :visible.sync="show" width="450px">
    <div class="share-list">
      <h3 class="share-list-title">{{ nl('page_storefront_share_my_list') }}</h3>
      <div class="img-box">
        <img v-for="(it, idx) in imgs" :key="idx" :src="it.img" :alt="it.alt" />
      </div>
      <p class="share-list-des">{{ nl('page_storefront_share_your_wanted') }}</p>
      <div class="tracking-links">
        <div @click="clickGenerate('tiktok')" class="tracking-link">
          <az-icon icon-class="icon-tiktok"></az-icon>{{ nl('page_ambassador_form_tiktok') }}
        </div>
        <div @click="clickGenerate('instagram')" class="tracking-link">
          <az-icon icon-class="icon-Instagram"></az-icon>{{ nl('page_ambassador_form_instagram') }}
        </div>
        <div @click="clickGenerate('youtube')" class="tracking-link">
          <az-icon icon-class="icon-youtube"></az-icon>{{ nl('page_ambassador_form_youtube') }}
        </div>
        <div @click="clickGenerate('others')" class="tracking-link">
          <az-icon icon-class="icon-Share"></az-icon>{{ nl('page_influencer_other_channel') }}
        </div>
      </div>
      <p class="share-list-des">{{ nl('page_storefront_click_to_copy') }}</p>
      <a @click="show = false" role="button" href="javascript:;" class="cancel-btn">{{ nl('page_common_close') }}</a>
    </div>
    <az-toast ref="toast" :message="toastMsg" :duration="2000"></az-toast>
  </az-dialog>
</template>
<script>
import AzDialog from '@/components/az-ui/AzDialog'
import AzToast from '@/components/az-ui/AzToast'

/**
 * 门店列表分享弹框
 */
export default {
  components: {
    AzDialog,
    AzToast
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    storeInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      disabled: false,
      show: false,
      toastMsg: ''
    }
  },
  computed: {
    // 分享弹框展示的商品图，取前三个
    imgs() {
      const res = []
      if (this.storeInfo.goodsList && this.storeInfo.goodsList.length) {
        for (let i = 0; i < 3; i++) {
          let ele = this.storeInfo.goodsList[i]
          if (ele) {
            if (ele.baseInfo) {
              ele = ele.baseInfo
            }
            const img = ele.imgUrl ? ele.imgUrl : this.PIC_PATH + 's240/' + ele.goodsThumb
            res.push({ img, alt: ele.goodsName })
          }
        }
      }
      return res
    },
    // 渠道分享链接
    shareUrl() {
      if (this.storeInfo.storefrontListInfo) {
        return 'https://www.azazie.com' + this.storeInfo.storefrontListInfo.storefrontUrl
      } else {
        return ''
      }
    }
  },
  watch: {
    visible(e) {
      this.show = e
    },
    show(e) {
      if (!e) {
        this.$emit('update:visible', e)
      }
    }
  },
  methods: {
    // 生成渠道分享短连接
    clickGenerate(e) {
      // 如果已经各渠道短连接数据，直接复制
      if (
        this.storeInfo.storefrontListInfo &&
        this.storeInfo.storefrontListInfo.channels &&
        this.storeInfo.storefrontListInfo.channels[e]
      ) {
        this.$copyText(this.storeInfo.storefrontListInfo.channels[e]).then(
          (e) => {
            this.toastMsg = this.nl('page_common_copied')
            this.$refs.toast.show()
          },
          (e) => {
            console.log('copy fail!')
          }
        )
      } else {
        const params = {
          url: this.shareUrl,
          utm_source: e,
          referrer_type: 'storefront',
          store_list_id: this.storeInfo.storefrontListInfo.storeListId,
          referrer_code: this.storeInfo.storefrontListInfo.referrerCode
        }
        // 生成渠道短连接
        this.$axios.$post('/1.0/referrer/storefront-share-link', params).then((res) => {
          if (res.code === 0) {
            this.$copyText(res.data.shortUrl).then(
              (e) => {
                this.toastMsg = this.nl('page_common_copied')
                this.$refs.toast.show()
              },
              (e) => {
                console.log('copy fail!')
              }
            )
          } else {
            alert(this.nl(res.msg))
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.share-list {
  text-align: center;
  &-title {
    font-size: 18px;
    text-transform: uppercase;
    margin-bottom: 10px;
    font-family: @font-family-600;
  }
  .img-box {
    display: flex;
    img {
      width: 150px;
      display: block;
    }
  }
  &-des {
    font-size: 13px;
    margin: 20px 0px;
  }
  .tracking {
    &-links {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    &-link {
      width: 230px;
      height: 30px;
      padding: 5px 10px;
      border: 1px solid var(--color-121212);
      color: var(--color-121212);
      font-family: @font-family-600;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      cursor: pointer;
      &:last-of-type {
        margin-bottom: 0px;
      }
      .az-icon {
        width: 24px;
        height: 24px;
        fill: var(--color-121212);
        margin-right: 5px;
      }
    }
  }
  .cancel-btn {
    font-size: 13px;
    text-decoration: underline;
    text-transform: lowercase;
  }
}
</style>
