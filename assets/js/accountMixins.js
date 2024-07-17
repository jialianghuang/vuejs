import { mapState } from 'vuex'
export default {
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState('userInfo', [
      'isGuest',
      'isRetailer',
      'ambassadorData',
      'influencerStatus',
      'influencerCountryCode',
      'storefrontStatus',
      'storefrontCountryCode'
    ]),
    // 把数据挪到mixins里面，不需要在每个页面都传一遍数据。数据是从 orderList 组件拷贝进来的
    accountMenu() {
      return {
        my_profile: {
          name: 'page_submenu_my_profile',
          href: '/account/my_profile',
          title: 'page_common_my_profile'
        },
        my_orders: {
          name: 'page_common_my_orders',
          href: '/order/list',
          title: 'page_common_my_orders'
        },
        my_coupons: {
          name: 'page_account_my_coupons',
          href: '/user?my_coupons',
          title: 'page_account_my_coupons'
        },
        my_gift_cards: {
          name: 'page_setting_gift_cards',
          href: '/user?my_gift_cards',
          title: 'page_setting_gift_cards',
          hide: this.country !== 'US'
        },
        my_showroom: {
          name: 'page_common_my_showroom',
          href: 'javascript:;'
        },
        important_dates: {
          name: 'page_important_dates_title',
          href: '/user?important_dates',
          title: 'page_important_dates_title'
        },
        edit_my_addresses: {
          name: 'page_common_manage_address_book',
          href: '/user?edit_my_addresses',
          title: 'page_common_manage_address_book'
        },
        edit_my_email: {
          name: 'page_common_edit_email',
          href: '/user?edit_my_email',
          title: 'page_email_desc'
        },
        edit_password: {
          name: 'page_common_account_settings',
          href: '/user?edit_password',
          title: 'page_common_account_settings'
        },
        // my_commission: {
        //   name: 'page_commission',
        //   href: '/user?my_commission',
        //   title: 'page_commission',
        //   hide: this.country !== 'US' || !this.isRetailer
        // },
        // ccpa: {
        //   name: 'page_setting_california',
        //   href: '/user?ccpa_data_application',
        //   title: 'page_setting_california',
        //   hide: this.country != 'US'
        // },
        ambassador_dashboard: {
          name: 'page_ambassador_dashboard',
          href: this.ambassadorData.isAmbassador === false ? '/ambassador-program' : '/user?ambassador_dashboard',
          title: 'page_ambassador_dashboard',
          hide: !['CA', 'US', 'GB', 'AU'].includes(this.country)
        },
        ambassador_commission_details: {
          name: 'page_ambassador_commission_details',
          href: this.ambassadorData.isAmbassador === false ? '/ambassador-program' : '/user?ambassador_commission_details',
          title: 'page_ambassador_commission_details',
          hide: !['CA', 'US', 'GB', 'AU'].includes(this.country)
        },
        ambassador_my_reference: {
          name: 'page_ambassador_my_reference',
          href: '/user?ambassador_my_reference',
          title: 'page_ambassador_my_reference',
          hide: !['CA', 'US', 'GB', 'AU'].includes(this.country)
        },
        unpaid: {
          name: 'page_submenu_unpaid_orders',
          href: '/order/list?page=1&status=unpaid',
          title: 'page_submenu_unpaid_orders'
        },
        processing: {
          name: 'page_submenu_processing_orders',
          href: '/order/list?page=1&status=processing',
          title: 'page_submenu_processing_orders'
        },
        shipped: {
          name: 'page_submenu_shipped_orders',
          href: '/order/list?page=1&status=shipped',
          title: 'page_submenu_shipped_orders'
        },
        review: {
          name: 'page_submenu_review_orders',
          href: '/order/list?page=1&status=review',
          title: 'page_submenu_review_orders'
        },
        influencer: {
          name: 'page_menu_influencer',
          href: '/user?influencer',
          title: 'page_menu_influencer',
          hide: !(this.influencerStatus === 2 && this.influencerCountryCode === this.country)
        },
        my_storefront: {
          name: 'page_menu_storefront',
          href: '/user?my_storefront',
          title: 'page_menu_storefront',
          hide: !(this.storefrontStatus === 2 && this.storefrontCountryCode === this.country)
        }
        // azazie_perks: {
        //   name: 'page_account_azazie_perks',
        //   href: '/user?azazie_perks',
        //   title: 'page_account_azazie_perks',
        //   hide: this.country !== 'US'
        // }
      }
    },
    breadCrumbInfo() {
      let name = ''
      if (this.accountMenu[this.currentMenuType]) {
        name = this.accountMenu[this.currentMenuType].name
      }
      return {
        home: {
          href: `/`,
          title: this.nl('page_common_home')
        },
        login: {
          title: name
        }
      }
    }
  },
  watch: {},
  created() {},
  methods: {}
}
