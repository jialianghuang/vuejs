<template>
  <div class="account-left guest-account-hide account-menu">
    <h2>{{ nl('page_common_my_account') }}</h2>
    <ul>
      <template v-for="(data, k) in accountMenuNew">
        <template v-if="['influencer', 'my_storefront'].includes(k)">
          <li v-if="!data.hide" :key="k" class="li-1">
            <a :href="countryUrl(data.href)" :class="{ cur: k == currentMenuTypeNew }">{{ nl(data.title) }}</a>
          </li>
        </template>
        <template v-else>
          <li :key="k" class="li-1">
            {{ nl(data.title) }}
          </li>
          <li v-for="(item, key) in data.submenu" :key="`${key}_${k}`" :class="[key, 'li-2']">
            <template v-if="!item.hide">
              <a
                v-if="key == 'my_showroom'"
                @click="getMyShowroom"
                :href="countryUrl(item.href)"
                :class="{ cur: key == currentMenuTypeNew }"
                >{{ nl(item.name) }}</a
              >
              <a
                v-else-if="key == 'my_commission'"
                :href="countryUrl(item.href)"
                :class="{ cur: key == currentMenuTypeNew }"
                v-track.viewOnce.click="{ common: { ec: 'myaccount', el: 'mycommission' } }"
                >{{ nl(item.name) }}</a
              >
              <a v-else :href="countryUrl(item.href)" @click="setBuryPoint(key)" :class="{ cur: key == currentMenuTypeNew }"
                >{{ nl(item.name) }}<sup v-if="key === 'my_coupons' && showNewCouponRedDot" class="dot"></sup
              ></a>
            </template>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'AccountMenu',
  props: {
    accountMenu: {
      type: Object,
      default: null
    },
    currentMenuType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('userInfo', [
      'preCartNum',
      'showRoom',
      'showRoomNum',
      'noMoreShowRoom',
      'newCouponList',
      'newCouponRedPointClick',
      'influencerStatus',
      'influencerCountryCode',
      'storefrontStatus',
      'storefrontCountryCode'
    ]),
    recentShowroomIdDisplay() {
      if (this.isLogin && this.showRoom && Object.keys(this.showRoom).length) {
        let tempId = ''
        for (let i = 0; i < this.showRoom.length; i++) {
          if (this.showRoom[i].isOwner) {
            tempId = this.showRoom[i].showroomIdDisplay
            break
          }
        }
        return tempId
      } else {
        return ''
      }
    },
    accountMenuNew() {
      const kindMap = ['my_account', 'my_assets', 'my_orders', 'ambassador', 'retailer', 'other']
      const tempAccMenu = {
        my_account: {
          title: 'page_menu_my_account',
          submenu: {}
        },
        my_assets: {
          title: 'page_menu_my_assets',
          submenu: {}
        },
        my_orders: {
          title: 'page_menu_my_orders',
          submenu: {}
        },
        my_storefront: {
          title: 'page_menu_storefront',
          href: '/user?my_storefront',
          hide: !(this.storefrontStatus === 2 && this.storefrontCountryCode === this.country)
        },
        influencer: {
          title: 'page_menu_influencer',
          href: '/user?influencer',
          hide: !(this.influencerStatus === 2 && this.influencerCountryCode === this.country)
        },
        ambassador: {
          title: 'page_menu_ambassador',
          submenu: {}
        },
        retailer: {
          title: 'page_menu_retailer',
          submenu: {}
        },
        other: {
          title: 'page_menu_other_information',
          submenu: {}
        }
      }
      const accCtaMap = {
        my_profile: 0,
        my_showroom: 0,
        edit_my_addresses: 0,
        edit_my_email: 0,
        edit_password: 0,
        important_dates: 0,
        my_coupons: 1,
        my_gift_cards: 1,
        my_orders: 2,
        unpaid: 2,
        processing: 2,
        shipped: 2,
        review: 2,
        ambassador_dashboard: 3,
        ambassador_commission_details: 3,
        ambassador_my_reference: 3,
        my_commission: 4,
        ccpa: 5
      }
      for (const key in this.accountMenu) {
        if (this.accountMenu[key].hide !== true && accCtaMap.hasOwnProperty(key)) {
          tempAccMenu[kindMap[accCtaMap[key]]].submenu[key] = this.accountMenu[key]
        }
      }
      for (const key in tempAccMenu) {
        if (!['influencer', 'my_storefront'].includes(key) && Object.keys(tempAccMenu[key].submenu).length < 1) delete tempAccMenu[key]
      }
      return tempAccMenu
    },
    currentMenuTypeNew() {
      const type = this.$route.query.status
      return type || this.currentMenuType
    },
    // 是否展示优惠券红点
    showNewCouponRedDot() {
      // 券列表有数据，并且没有点击过红点
      return this.newCouponList && this.newCouponList.length && !this.newCouponRedPointClick
    }
  },
  methods: {
    getMyShowroom() {
      this.setBuryPoint('my_showroom')
      if (this.isLogin) {
        if (this.showRoom.length > 0 && this.showRoom[0]) {
          location.href = this.countryUrl(`/showroom/${this.showRoom[0].showroomIdDisplay}`)
        } else {
          this.createShowroom()
        }
      } else {
        this.$store.commit('setShowSignLayer', true)
        this.$store.commit('setSignLayerSource', 'showroom')
      }
    },
    createShowroom() {
      this.$axios.$post(`/1.0/showroom`).then((res) => {
        if (res.code == 0 && res.data && res.data.showroomIdDisplay) {
          location.href = this.countryUrl(`/showroom/${res.data.showroomIdDisplay}`)
        } else {
          alert(res.msg)
        }
      })
    },
    setBuryPoint(type) {
      if (type === 'my_coupons' && this.showNewCouponRedDot) {
        const postData = {
          viewType: 'new_coupon_red_point' // 新券弹窗new_coupon_pop ，红点new_coupon_red_point
        }
        // 优惠券弹框关闭和红点点击记录接口
        this.$axios
          .$post('/1.0/coupon-pop/add-view-record', postData)
          .then((res) => {
            if (res) {
              this.$store.commit('userInfo/setNewCouponRedPointClick', true)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
      // TO DO:有两个名字不一样，不能直接去掉下划线，能否改一下名
      const typeMap = {
        my_profile: 'myprofile',
        my_showroom: 'myshowroom',
        edit_my_addresses: 'editmyaddresses',
        edit_my_email: 'editmyemail',
        edit_password: 'editpassword',
        important_dates: 'importdates',
        my_coupons: 'mycoupons',
        my_orders: 'allorders',
        unpaid: 'unpaidorders',
        processing: 'processingorders',
        shipped: 'shippedorders',
        review: 'revieworders',
        ambassador_dashboard: 'ambassadordashboard',
        my_commission: 'mycommission',
        ccpa: 'ccpa'
      }
      this.buryPoint(this, 'event', { ec: 'myaccount', el: typeMap[type], ea: 'click' })
    }
  }
}
</script>

<style lang="less" scoped>
.account-left {
  margin-top: 18px;
  float: left;
  h2 {
    border-bottom: solid 1px var(--color-cccccc);
    line-height: 28px;
    text-transform: uppercase;
    font-family: @font-family-600;
    font-size: 16px;
  }
  ul {
    margin: 15px 0 0;
  }
  li {
    line-height: 18px;
    margin-bottom: 10px;
    .dot {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: @theme-color;
    }
    &.li-1 {
      font-family: @font-family-600;
      font-size: 14px;
    }
    &.li-2 {
      margin-left: 10px;
    }
  }
  a {
    color: var(--color-121212);
    &.cur,
    &:hover {
      color: @theme;
    }
  }
}
</style>
