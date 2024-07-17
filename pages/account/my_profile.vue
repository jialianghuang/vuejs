<template>
  <div class="account-box">
    <main-app :navigation="navigation">
      <div class="main-content account-width clearfix">
        <bread-crumb :breadCrumbInfo="breadCrumbInfo"></bread-crumb>
        <div class="account-flex">
          <account-menu v-if="!isGuest" :currentMenuType="currentMenuType" :accountMenu="accountMenu"></account-menu>
          <div class="account-right">
            <div :class="currentMenuType" class="account-content"></div>
            <div class="account-title">
              <h1>{{ nl(pageTitle) }}</h1>
            </div>
            <div :class="currentMenuType" class="account-content">
              <my-profile v-if="currentMenuType == 'my_profile'" :myEmail="userInfo.email" :weddingDate="userInfo.weddingDate"></my-profile>
              <update-wedding-date v-if="currentMenuType == 'important_dates'" :weddingDate="userInfo.weddingDate"></update-wedding-date>
              <edit-address v-if="currentMenuType == 'edit_my_addresses'"></edit-address>
              <edit-email v-if="currentMenuType == 'edit_my_email'" :myEmail="userInfo.email"></edit-email>
              <edit-password v-if="currentMenuType == 'edit_password'"></edit-password>
              <ccpa-upload v-if="currentMenuType == 'ccpa'"></ccpa-upload>
              <my-commission v-if="currentMenuType == 'my_commission'"></my-commission>
              <azazie-perks v-if="currentMenuType == 'azazie_perks' && country !== 'CA'" @changeTitle="handleChangeTitle"></azazie-perks>
              <my-coupons v-if="currentMenuType == 'my_coupons' && country !== 'CA'" @changeTitle="handleChangeTitle"></my-coupons>
              <ambassador-dashboard v-if="currentMenuType == 'ambassador_dashboard'"></ambassador-dashboard>
              <ambassador-my-reference v-if="currentMenuType == 'ambassador_my_reference'"></ambassador-my-reference>
            </div>
          </div>
        </div>
      </div>
    </main-app>
  </div>
</template>

<script>
import MainApp from '@/components/Main'
import MyProfile from '@/components/account/MyProfile'
import BreadCrumb from '@/components/common/Breadcrumb'
import AccountMenu from '@/components/user/AccountMenu'
import EditPassword from '@/components/user/EditPassword'
import EditEmail from '@/components/user/EditEmail'
import myCommission from '@/components/user/MyCommission'
import UpdateWeddingDate from '@/components/user/UpdateWeddingDate'
import EditAddress from '@/components/user/EditAddress'
import CcpaUpload from '@/components/user/CcpaUpload'
import AmbassadorDashboard from '@/components/user/AmbassadorDashboard'
import AmbassadorMyReference from '@/components/user/AmbassadorReference'
import AzaziePerks from '@/components/rights/AzaziePerks.vue'
import MyCoupons from '@/components/rights/MyCoupons'
import { init, getUserIdentity } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
import accountMixins from '@/assets/js/accountMixins'

export default {
  name: 'MyAccount',
  components: {
    CcpaUpload,
    BreadCrumb,
    AccountMenu,
    EditPassword,
    EditEmail,
    // EditFacebookEmail,
    UpdateWeddingDate,
    EditAddress,
    MainApp,
    AzaziePerks,
    MyCoupons,
    myCommission,
    AmbassadorDashboard,
    MyProfile,
    AmbassadorMyReference
  },
  mixins: [accountMixins],
  data() {
    return {
      changeTitle: ''
    }
  },
  computed: {
    ...mapState('userInfo', ['isGuest', 'isRetailer', 'ambassadorData']),
    pageTitle() {
      if (this.changeTitle) {
        return this.changeTitle
      } else {
        return this.accountMenu[this.currentMenuType].title
      }
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const query = context.route.query

      let url = '/1.0/user/first-screen'
      let currentMenuType = 'my_profile'
      if (query.hasOwnProperty('important_dates')) {
        currentMenuType = 'important_dates'
      } else if (query.hasOwnProperty('edit_my_email') || (query.hasOwnProperty('act') && query.act == 'email_settings')) {
        currentMenuType = 'edit_my_email'
      } else if (query.hasOwnProperty('edit_password') || (query.hasOwnProperty('act') && query.act == 'account_settings')) {
        currentMenuType = 'edit_password'
      } else if (query.hasOwnProperty('ccpa_data_application')) {
        currentMenuType = 'ccpa'
      } else if (query.hasOwnProperty('edit_my_addresses')) {
        currentMenuType = 'edit_my_addresses'
        url += '?type=editAddress'
      } else if (query.hasOwnProperty('azazie_perks')) {
        currentMenuType = 'azazie_perks'
      } else if (query.hasOwnProperty('my_coupons')) {
        currentMenuType = 'my_coupons'
      } else if (query.hasOwnProperty('my_commission')) {
        currentMenuType = 'my_commission'
      } else if (query.hasOwnProperty('ambassador_dashboard')) {
        currentMenuType = 'ambassador_dashboard'
      } else if (query.hasOwnProperty('ambassador_my_reference')) {
        currentMenuType = 'ambassador_my_reference'
      }

      if (
        (['ccpa', 'azazie_perks', 'my_gift_cards', 'my_commission'].includes(currentMenuType) && context.store.state.country != 'US') ||
        (['ambassador_dashboard', 'ambassador_my_reference', 'ambassador_commission_details'].includes(currentMenuType) &&
          !['US', 'CA', 'GB', 'AU'].includes(context.store.state.country))
      ) {
        context.redirect(302, context.store.state.currentCountryUrl + '/order/list')
        return
      }

      const res = await context.$axios.$get(url)

      // code等于5表明redis链接失败，需要用户刷新重试
      if (res.code == 5) {
        context.error({
          statusCode: 200,
          message: res.msg ? res.msg : 'service are unavailable temporarily, please refresh page!'
        })
        return
      } else if (res.code == 404) {
        context.redirect(302, context.store.state.currentCountryUrl + `/404?originUrl=${encodeURIComponent(commonAsyncData.requestUrl)}`)
        return
      } else if (res.code == 100001 || res.code == 100501) {
        const flag = currentMenuType === 'ccpa' || currentMenuType === 'azazie_perks'
        context.redirect(
          302,
          flag
            ? context.store.state.currentCountryUrl + `/user/login?back=${context.route.fullPath}`
            : context.store.state.currentCountryUrl + '/user/login'
        )
        return
      }

      if (currentMenuType == 'edit_my_addresses' && res.data.addressInfo) {
        context.store.commit('checkout/setAddressInfo', res.data.addressInfo)
      }

      await getUserIdentity(context)

      context.store.commit('setJsKey', 'user')

      // canonicalUrl
      // if (
      //   query.hasOwnProperty('important_dates') ||
      //   query.hasOwnProperty('edit_my_email') ||
      //   query.hasOwnProperty('ccpa_data_application') ||
      //   query.hasOwnProperty('edit_password')
      // ) {
      //   res.data.seoInfo.canonicalUrl = 'https://www.azazie.com/user'
      // }
      return {
        ...commonAsyncData,
        seoInfo: res.data.seoInfo,
        dataLayerInfo: res.data.dataLayerInfo,
        userInfo: res.data.userInfo,
        url,
        currentMenuType
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  mounted() {
    this.profileBuryPoint()
  },
  methods: {
    // 点击权益包历史记录修改标题
    handleChangeTitle(title) {
      this.changeTitle = title
    },
    profileBuryPoint() {
      this.buryPoint(this, 'event', { ec: 'myaccount', el: 'myprofile', ea: 'view' })
    }
  }
}
</script>

<style lang="less" scoped>
.page-title {
  color: var(--color-121212);
  padding: 13px 0 7px;
  border-bottom: 1px solid #666;
  letter-spacing: 1px;
  font-size: 24px;
  font-weight: 400;
  text-transform: uppercase;
}
.account-flex {
  display: flex;
  .account-right {
    width: 903px;
    margin-top: 18px;
  }
  .account-left {
    flex: 1;
    margin-right: 1293px - 903px - 350px;
    // 兼容未修改页面
    float: left;
  }
}
.account-title {
  border-bottom: solid 1px var(--color-cccccc);
  padding-bottom: 5px;
  h1 {
    display: inline;
    .font-large();
    line-height: 22px;
    text-transform: uppercase;
  }
  span {
    margin-left: 10px;
  }
}
.account-content.edit_password,
.account-content.edit_my_email {
  margin: 20px auto;
  display: flex;
  justify-content: center;
}
</style>
