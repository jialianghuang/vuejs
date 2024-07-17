<template>
  <div class="barbie-pre">
    <div class="banner">
      <img :data-src="pageData.banner" :src="require('~/assets/images/default_img.jpg')" class="lazyload" alt="barbie pre banner" />
    </div>
    <div id="subscribe" class="join-list">
      <div class="content">
        <div class="title">{{ nl('page_common_barbie_pre_join_title') }}</div>
        <div class="subtitle">{{ nl('page_common_barbie_pre_join_subtitle') }}</div>
        <az-interest-subscribe
          :parentEmail="email"
          :isEvent="true"
          :checkboxData="checkboxList"
          :resResult="rulesRes.email"
          @subscribeSubmit="saveEmail"
          @initError="initError"
        ></az-interest-subscribe>
      </div>
    </div>
    <div class="coming-soon">
      <div class="content">
        <!-- <div class="title">{{ nl('page_common_barbie_pre_comming_soon') }}</div> -->
        <div class="image-box">
          <div v-for="(item, idx) in pageData.imageList" :key="idx" class="image-item">
            <img :data-src="item" :src="require('~/assets/images/default_img.jpg')" :alt="'barbie image ' + idx" class="lazyload" />
          </div>
        </div>
        <div v-track.viewOnce.click="{ common: { ec: 'barbie', el: 'notify_me' } }" @click="notifyClick" class="notify">
          {{ nl('page_common_barbie_pre_notify') }}
        </div>
      </div>
    </div>
    <!-- 邮件订阅弹窗 -->
    <az-dialog :visible.sync="showDialog" :maskEnable="false">
      <div class="success-dialog">
        <az-icon icon-class="icon-icon-success"></az-icon>
        <div class="title">{{ dialogData.title }}</div>
        <div class="desc">{{ dialogData.detail }}</div>
        <div class="coupon">{{ dialogData.couponCode }}</div>
        <!-- <div class="emailMes">{{ dialogData.emailMessage }}</div> -->
        <div class="product-list">
          <div v-for="(item, index) in dialogData.goodsList" :key="index" class="product-item">
            <img
              :data-src="addWebpSuffix(PIC_PATH + 's179/' + item.baseInfo.goodsThumb)"
              :src="require('~/assets/images/default_img.jpg')"
              :alt="'barbie pre color ' + index"
              class="lazyload"
            />
          </div>
        </div>
        <div v-track.viewOnce.click="{ common: { ec: 'barbie', el: 'buy_now' } }" @click="addToBagClick" class="addToBag">
          {{ nl('page_common_barbie_pre_add') }}
        </div>
      </div>
    </az-dialog>
  </div>
</template>
<script>
/**
 * barbie预热页面
 *
 */
import { mapState } from 'vuex'
import AzDialog from '@/components/az-ui/AzDialog'
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'
import AzInterestSubscribe from '@/components/common/AzInterestSubscribe'

const imageMap = {
  en: {
    banner: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/d0/51/58557c8fe345736bdb5b44b74dd1d051.jpg',
    imageList: [
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/c2/95/25347b8b0d818e071b539cde3d5bc295.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/25/c5/3bc15c8730a2c94edb46c49ecf8425c5.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/90/59/6f6fa2b8d3c2bb6621c4a4bf04d99059.jpg'
    ]
  },
  es: {
    banner: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/23/78/c953d5add9ad945e77d64df05d452378.jpg',
    imageList: [
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/c0/4f/2708c751eb9557a5ed7317d3f5bcc04f.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/45/8b/cd1dedb476e60a40663831d43593458b.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/03/65/6e2ad05a564d9031fd6c0b7b2ef70365.jpg'
    ]
  },
  de: {
    banner: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/0b/f8/445864c020a4a50e038a2245ec770bf8.jpg',
    imageList: [
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/ed/43/4ad546fa9bea3afa8d65ffd993feed43.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/1b/c6/2719ab8a86344d0b01866497aaf91bc6.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/3b/69/c940c2f57d9fe0169f66e2c800193b69.jpg'
    ]
  },
  fr: {
    banner: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/0a/3b/7b793cad3b62dc7bbf12e6e656f80a3b.jpg',
    imageList: [
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/8d/a1/02282b4236e562adceb53d269b5b8da1.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/6b/2d/f9729a2ea931263ef1d5e5ebdb716b2d.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/67/2c/8e2dd0823e42b5c44e20daabbb13672c.jpg'
    ]
  },
  it: {
    banner: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/27/14/46ca233be42f0d866184b3d034fd2714.jpg',
    imageList: [
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/fe/86/e16138eccfa999f9ee69678d2798fe86.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/f2/a4/a09fe8d43343edc84db2ce46d6f2f2a4.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/07/48/013392226f9209a18cf5adce463e0748.jpg'
    ]
  },
  nl: {
    banner: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/7a/c1/8b4c689649e1af22d075d13815277ac1.jpg',
    imageList: [
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/ae/1a/be9a06c73c3460bb71bb45a4e307ae1a.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/a4/9e/90bfe3bf6538847a5c044ca5970aa49e.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/c3/f5/705471c603598c2e56de59766f44c3f5.jpg'
    ]
  },
  se: {
    banner: 'https://cdn-1.azazie.com/upimg/userfiles/images/Shoes/61/ff/208f886a239c6c10b9fcfc5b2ae961ff.jpg',
    imageList: [
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/ab/57/8d264f9f64c4a7e9d0cb1d09f3cfab57.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/32/e3/19a952425564a415a2cdb47199c732e3.jpg',
      'https://cdn-1.azazie.com/upimg/userfiles/images/1/d7/fa/a5aaf20adc9cd97810b4c8b40fadd7fa.jpg'
    ]
  }
}

export default {
  name: 'BarbiePreMain',
  components: { AzDialog, AzInterestSubscribe },
  data() {
    return {
      subscribeLoading: false,
      rulesRes: {
        email: '',
        role: '',
        shopType: ''
      },
      email: '',
      showDialog: false,
      roleKey: '',
      role: '',
      roleShow: false,
      shopTypeKey: '',
      shopType: '',
      shopTypeShow: false,
      dialogData: {},
      checkboxList: []
    }
  },
  computed: {
    ...mapState('userInfo', ['userInfoEmail']),
    pageData() {
      return imageMap[this.language]
    },
    roles({ nl }) {
      return [
        { name: nl('page_common_atelier_text11'), key: 'bridesmaid' },
        { name: nl('page_common_atelier_text12'), key: 'bride' },
        { name: nl('page_common_atelier_text13'), key: 'wedding_guest' },
        { name: nl('page_common_atelier_text14'), key: 'groom' },
        { name: nl('page_common_atelier_text15'), key: 'groomsmen' },
        { name: nl('page_common_atelier_text16'), key: 'mom' },
        { name: nl('page_common_atelier_text17'), key: 'just_shopping' }
      ]
    },
    shopTypes({ nl }) {
      return [
        { name: nl('page_common_atelier_text18'), key: 'wedding_events' },
        { name: nl('page_common_atelier_text19'), key: 'holiday_parties' },
        { name: nl('page_common_atelier_text20'), key: 'formal_events' },
        { name: nl('page_common_atelier_text21'), key: 'going_out' },
        // { name: nl('page_common_atelier_text22'), key: 'school_events ' },
        { name: nl('page_common_atelier_text23'), key: 'other' }
      ]
    }
  },
  watch: {
    userInfoEmail(e) {
      this.email = e
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const rules = {
        email: formValidatorType.email({ required: this.nl('page_js_enter_valid_add'), validator: this.nl('page_email_enter_valid') })
      }
      this.validator = new Schema(rules)
    },
    getCategoriesList() {
      this.$axios.get(`/1.0/email/subscribe-user-role-new`).then((res) => {
        if (res) {
          this.checkboxList = res.data.data
        }
      })
    },
    subscribeSubmit() {
      if (!this.role) {
        this.rulesRes.role = this.nl('page_common_atelier_text9')
        return
      }
      if (this.roleKey == 'just_shopping' && !this.shopType) {
        this.rulesRes.shopType = this.nl('page_common_atelier_text10')
        return
      }
      this.validator.validate(
        {
          email: this.email
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesRes[item.field]) {
                this.rulesRes[item.field] = item.message
              }
            })
            return false
          }
          this.saveEmail()
        }
      )
    },
    saveEmail(e) {
      if (this.subscribeLoading) return false
      this.subscribeLoading = true
      this.retentionReject()
      this.$axios
        .$post(`/1.0/email/add-free-swatch-email-for-barbie`, {
          email: e.email,
          interested: e.categories,
          event_date: e.event_date
        })
        .then((res) => {
          this.subscribeLoading = false
          if (res.code == 0) {
            this.dialogData = res.data
            this.$cookie.setCookie('UnLoginEmail', e.email, 30, '.' + this.APP_DOMAIN_LOWER) // cookie设置游客邮箱 查询coupon
            // status: new / exists 已完成订阅的邮箱，再次输入提交，无法再次订阅，也不再触发弹窗，给到文案提示邮箱已订阅。
            if (res.data.status === 'exists') {
              this.rulesRes.email = res.data.msg
              return
            }
            this.showDialog = true
            // ga4 newEmail 打点
            this.trackGA4NewEmail(e.email, 'barbie_subscribe')
          } else {
            this.rulesRes.email = res.msg
          }
        })
        .catch((error) => {
          console.log(error)
          this.subscribeLoading = false
        })
    },
    handleRoleChange(e) {
      if (e.key == 'just_shopping') {
        this.shopTypeShow = true
      } else {
        this.shopTypeShow = false
        this.shopTypeKey = ''
        this.shopType = ''
      }
      this.roleKey = e.key
      this.role = e.name
    },
    handleShopTypeChange(e) {
      this.shopTypeKey = e.key
      this.shopType = e.name
    },
    notifyClick() {
      // Notifyme按钮点击后，页面定位到提交邮箱模块
      document.querySelector('#subscribe').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    },
    addToBagClick() {
      // add to bag 首次订阅成功触发弹窗，引导用户加购三种色卡商品，并跳转到购物车页面
      if (!this.dialogData) {
        return
      }
      this.dialogData.goodsList.forEach((item) => {
        return this.addToBag(item)
      })
      setTimeout(() => {
        window.location.href = this.countryUrl(`/cart`)
      }, 500)
    },
    // 获取styleId
    getStyleId(item) {
      const color = item.baseInfo.colorReal
      return item.styleInfo.color[color].styleId
    },
    // 简易色卡加车逻辑
    addToBag(item) {
      const formData = new FormData()
      formData.set('act', 'addGoodsToCart')
      formData.set('goods_id', item.baseInfo.goodsId)
      formData.set('dress_type', item.baseInfo.dressType)
      formData.set('styles[select][color]', this.getStyleId(item))
      formData.set('goods_number', 1)
      this.addToBagAjax(formData)
    },
    addToBagAjax(formData) {
      this.$axios.$post('/1.0/cart/goods', formData).then(async (res) => {
        if (res.code == 0) {
          this.$store.commit('setBundlePromotionProgress', res.data.bundlePromotionProgress)
          await this.getCartInfo()
          this.$store.commit('product/setShowAddCartDialog', true)
          this.setOrderSourceFlag(this.pageName, true)
        } else {
          alert(res.msg)
          window.location.reload()
        }
      })
    },
    initError() {
      this.rulesRes.email = ''
    }
  }
}
</script>

<style lang="less" scoped>
.barbie-pre {
  .banner {
    position: relative;
    margin: 0 auto;
    padding: 0;
    img {
      display: block;
      width: 100%;
    }
  }
  .join-list {
    position: relative;
    background: #c89e9f;
    .content {
      margin: 0 auto;
      padding: 80px 30px;
      max-width: 1600px;
    }
    .title {
      margin: 0 auto;
      color: var(--color-ffffff);
      font-family: @font-Ivy-Mode;
      text-align: center;
      font-size: 48px;
      letter-spacing: 3.84px;
      text-transform: uppercase;
    }
    .subtitle {
      margin: 10px auto 40px;
      color: var(--color-ffffff);
      text-align: center;
      font-family: @font-family-500;
      font-size: 24px;
      letter-spacing: 2.4px;
    }
  }
  .coming-soon {
    position: relative;
    .content {
      margin: 0 auto;
      padding: 40px 0 0;
    }
    .title {
      text-align: center;
      padding: 40px 0 30px;
      margin: 0 auto;
      color: var(--color-121212);
      font-family: @font-Ivy-Mode;
      font-size: 48px;
      line-height: 85px;
      letter-spacing: 3.84px;
      text-transform: uppercase;
    }
    .image-box {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      column-gap: 20px;
      margin: 0 auto;
      max-width: 1600px;
    }
    .image-item {
      position: relative;
      width: calc((100% - 40px) / 3);
      img {
        display: block;
        width: 100%;
      }
    }
    .notify {
      width: fit-content;
      min-width: 300px;
      height: 50px;
      box-sizing: border-box;
      margin: 40px auto 0;
      padding: 15px 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--color-121212);
      color: var(--color-ffffff);
      font-family: @font-family-700;
      font-size: 18px;
      text-transform: uppercase;
      cursor: pointer;
    }
  }
  .success-dialog {
    text-align: center;
    .az-icon {
      font-size: 60px;
      vertical-align: middle;
      fill: var(--color-5fa452);
    }
    .title {
      margin: 10px 0 0;
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-600;
      font-size: 24px;
      letter-spacing: 1.44px;
      text-transform: uppercase;
    }
    .desc {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 18px;
      letter-spacing: 1.08px;
    }
    .coupon {
      margin: 10px auto;
      width: 215px;
      height: 49px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 24px;
      border: 1px solid var(--color-121212);
      background: var(--color-ffffff) dee;
    }
    .emailMes {
      color: var(--color-121212);
      text-align: center;
      font-family: @font-family-500;
      font-size: 12px;
      letter-spacing: 0.72px;
    }
    .product-list {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      column-gap: 10px;
      padding: 10px 0;
    }
    .product-item {
      width: 140px;
      img {
        display: block;
        width: 100%;
      }
    }
    .addToBag {
      width: 440px;
      height: 50px;
      box-sizing: border-box;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--color-121212);
      color: var(--color-ffffff);
      font-family: @font-family-700;
      font-size: 18px;
      text-transform: uppercase;
      cursor: pointer;
    }
  }
  /deep/ .az-interest-subscribe {
    padding: 0;
    background: #c89e9f;
  }
  /deep/ .input-box input:focus {
    border: solid 2px #de1c85;
    padding: 10px 5px;
  }
  /deep/ .interest-checkbox-text,
  /deep/ .check-box-text,
  /deep/ .interest-title,
  /deep/ label {
    color: var(--color-ffffff) !important;
  }
  /deep/ .privacy-policy-box {
    font-size: 13px !important;
    margin: 15px 0 0 !important;
    span,
    a {
      color: var(--color-eeeeee) !important;
    }
  }
  /deep/ .az-checkbox-icon.checked {
    background: #de1c85;
  }
  /deep/ .az-interest-subscribe .mailbox-subscription button {
    color: #de1c85;
    background: var(--color-ffffff);
  }
  /deep/ .az-date-picker .mx-input-wrapper input {
    &::-webkit-input-placeholder,
    &::-moz-placeholder,
    &:-ms-input-placeholder,
    &:-moz-placeholder,
    &::placeholder {
      display: none !important;
      color: transparent !important;
    }
  }
  /deep/ .az-date-picker .data-picker-box .mx-input:hover,
  /deep/ .az-date-picker .data-picker-box .mx-input:focus {
    border: 1px solid var(--color-cccccc) !important;
  }
  /deep/ .az-interest-subscribe {
    .interested-list-box {
      margin-top: 20px;
      column-gap: 30px !important;
      row-gap: 20px !important;
    }
    .interest-box .interest-title {
      font-size: 18px;
      font-family: @font-family-500;
    }
    .check-box-item-text {
      font-size: 16px;
      color: var(--color-ffffff);
      font-family: @font-family-500;
    }
    .az-check-box-item {
      width: 20px !important;
      height: 20px !important;
    }
    .az-check-box-item.checked {
      border: none !important;
    }
    .az-check-box-item.checked .az-icon {
      fill: #de1c85;
      font-size: 20px;
    }
    .subscribe-box label {
      font-size: 18px;
      font-family: @font-family-500;
    }
    .subscribe-box .date-box {
      width: 335px;
    }
    .mailbox-subscription input {
      width: 335px !important;
    }
  }
}
</style>
