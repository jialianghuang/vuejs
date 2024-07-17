<template>
  <div class="sod-coming-soon quickshop">
    <color-label
      :selected-color="selectedColor"
      :is-dress="baseInfo.isDress"
      :is-coming-soon="baseInfo.isComingSoon"
      :shop-more="shopMore"
      :baseInfo="baseInfo"
      :fromDialog="fromDialog"
    ></color-label>
    <color-list
      :stock="colorStock"
      :colors="colorsFormat.shown"
      :selected-color-id="selectedColor.styleId"
      :support-stock-sales="supportStockSales"
      :stock-info="stockInfo"
      @select-color="selectStockColor"
      :showSwatchBtn="true"
    ></color-list>
    <p class="sod-coming-soon-remind">{{ nl('page_common_sod_comingsoon_txt') }}</p>
    <div class="sod-coming-soon-form">
      <div class="sod-coming-soon-form-input">
        <input
          :placeholder="nl('page_placeholder_enter_email')"
          v-model="subscribeMail"
          @focus="errorTipShow = false"
          class="_remind_email"
          type="text"
          name="email"
          autocomplete="off"
        />
        <p v-if="errorTipShow" class="cs_remind_email_err">{{ nl('page_js_change_email_check_email_new') }}</p>
      </div>
      <button @click="subscribeSubmit" class="sod-coming-soon-btn">
        {{ nl('page_comming_soon_remind_me_button') }}
      </button>
    </div>
  </div>
</template>

<script>
import styleMixins from '@/assets/js/quickshopStyleMixins'
import ColorList from '@/components/quickshop/style/ColorList'
import ColorLabel from '@/components/quickshop/style/ColorLabel'
export default {
  name: 'SodComingSoon',
  languageKeys: [
    'page_placeholder_enter_email',
    'page_comming_soon_remind_me_button',
    'page_js_change_email_check_email_new',
    'page_common_sod_comingsoon_txt',
    ...ColorLabel.languageKeys,
    ...ColorList.languageKeys
  ],
  components: {
    ColorLabel,
    ColorList
  },
  mixins: [styleMixins],
  data() {
    return {
      subscribeMail: '',
      errorTipShow: false
    }
  },
  computed: {
    supportStockSales() {
      // BD库存与非库存
      return this.baseInfo.supportStockSales && this.stockInfo && this.stockInfo.hasStock
    }
  },
  mounted() {
    this.$axios.$get(`/1.0/common/user-info`).then((res) => {
      this.subscribeMail = res.data.userEmail || this.$store.state.userInfo.userInfoEmail
    })
  },
  methods: {
    selectStockColor(color) {
      this.selectColor(color)
      this.$nextTick(() => {
        if (this.$refs.delivery) {
          this.$refs.delivery.getDeliveryInfo()
        }
        this.currentColorSupportStock && this.checkSelect('color')
      })
    },
    subscribeSubmit() {
      if (this.emailFormCheck(this.subscribeMail)) {
        const formData = new FormData()
        formData.set('cs_remind_email', this.subscribeMail)
        formData.set('goods_id', this.baseInfo.goodsId)
        this.retentionReject()
        this.$axios.$post(`/1.0/email/coming-soon`, formData).then((res) => {
          if (res.code == 0) {
            this.errorTipShow = false
            this.setDataLayer({
              action: '',
              category: 'PC_DetailPageRevision',
              label: `ComingSoonSaveRemindEmailSuccess`
            })
            if (this.baseInfo.catId == 2) {
              this.setDataLayer({
                action: '',
                category: 'PC_DetailPageRevision',
                label: `BG_ComingSoonDetailSaveRemindEmailSuccess`
              })
            } else if (this.baseInfo.catId == 6) {
              this.setDataLayer({
                action: '',
                category: 'PC_DetailPageRevision',
                label: `Veils_ComingSoonDetailSaveRemindEmailSuccess`
              })
            }
          }
          alert(res.data)
        })
      } else {
        this.errorTipShow = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sod-coming-soon {
  background-color: #f7f7f8;
  padding: 15px;
  .sod-coming-soon-remind {
    font-family: @font-family-500;
    font-size: 13px;
    line-height: 18px;
    &::before {
      content: '*';
      //   margin-right: 3px;
    }
  }
  .sod-coming-soon-form {
    margin-top: 15px;
    // display: flex;
    max-width: 507px;
    &-input {
      // flex: 1;
      // align-items: center;
      width: 100%;
      input {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
      }
      .cs_remind_email_err {
        color: #f00;
        margin-top: 5px;
      }
    }
    .sod-coming-soon-btn {
      margin-top: 10px;
      padding: unset;
      background-color: @theme;
      width: 100%;
      color: #fff;
      font-family: @font-family-600;
      height: 50px;
      line-height: 50px;
      text-align: center;
      box-sizing: border-box;
      text-transform: uppercase;
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
