<template>
  <div class="my-storefront">
    <div class="my-storefront-tab">
      <span v-for="(item, index) in tabs" :key="index" :class="{ active: tabKey === item.key }" @click="clickTab(item.key)">
        {{ item.name }}
      </span>
    </div>
    <div v-show="tabKey === 'my_storefront'" class="my-storefront-body">
      <img
        class="my-storefront-banner"
        src="https://cdn-1.azazie.com/upimg/userfiles/images/1/cd/f0/620518931766bc59816e6cf6935ecdf0.jpeg"
        alt="my storefront banner"
      />
      <az-button @click="clickCreate" class="btn btn-default create-btn">+ {{ nl('page_storefront_create_a_list') }}</az-button>
      <div v-for="(item, index) in storefrontLists" :key="index" class="my-storefront-section">
        <div class="my-storefront-section-header">
          <div class="my-storefront-section-header-left">
            <div v-if="item.storefrontListInfo.storeListId === editListId" class="edit-box">
              <input
                v-model="currentListName"
                @focus="currentListName = item.storefrontListInfo.name"
                @blur="handleListNameBlur(item)"
                maxlength="70"
                type="text"
              />
              <az-button @click="editListId = ''" class="btn btn-hollow">{{ nl('page_common_cancel') }}</az-button>
              <az-button @click="clickEditSave(item)" class="btn btn-default">{{ nl('page_common_save') }}</az-button>
            </div>
            <template v-else>
              <span class="name">{{ item.storefrontListInfo.name }}</span>
              <span>{{ item.goodsTotal || 0 }} {{ nl('page_cat_items') }}</span>
            </template>
          </div>
          <div v-if="item.storefrontListInfo.storeListId !== editListId" class="my-storefront-section-header-right">
            <span @click="clickEditList(item)" class="text-btn">{{ nl('page_storefront_edit_name') }}</span>
            <span v-if="item.goodsList && item.goodsList.length" @click="clickShareList(item)" class="text-btn">
              {{ nl('page_storefront_share_list') }}
            </span>
            <span @click="clickDeleteList(item)" class="text-btn">{{ nl('page_storefront_delete_list') }}</span>
          </div>
        </div>
        <div @click="clickToStoreListDetails(item)" class="my-storefront-section-content">
          <template v-for="(it, idx) in item.goodsList">
            <div v-if="idx < 6" :key="idx" class="product-item">
              <img :src="it.imageInfo.thumbPrefix + it.baseInfo.goodsThumb" :alt="it.baseInfo.goodsName" />
              <div v-if="idx === 5 && item.goodsTotal > 6" class="num">+{{ item.goodsTotal - 5 }}</div>
            </div>
          </template>
          <p v-if="!item.goodsList || item.goodsList.length === 0" v-html="nl('page_storefront_favorites_empty')" class="blank-tips"></p>
        </div>
      </div>
    </div>
    <div v-show="tabKey === 'my_dashboard'" class="my-storefront-dashboard">
      <div class="my-storefront-form-item">
        <template v-if="storefrontInfo.payAccount || (paypalSaved && paypalAccount)">
          <span class="form-item-label">{{ nl('page_ambassador_dashboard_my_paypal') }}: {{ paypalAccount }}</span>
          <p v-html="nl('page_influencer_paypal_tips')" class="paypal-tips"></p>
        </template>
        <template v-else>
          <span class="form-item-label">{{ nl('page_ambassador_dashboard_my_paypal') }}</span>
          <div class="input-box">
            <az-input
              v-model="paypalAccount"
              :errorMsg="paypalErrorMsg"
              @blur="paypalBlurValidate"
              :placeholder="nl('page_ambassador_my_paypal_placeholder')"
            ></az-input>
            <az-button @click="clickSavePaypal" class="btn btn-hollow">{{ nl('page_common_save') }}</az-button>
          </div>
        </template>
      </div>
      <my-dashboard :dashboard-data="dashboardData"></my-dashboard>
    </div>
    <create-edit-list :visible.sync="createVisible" @onSuccess="queryList"></create-edit-list>
    <share-list :visible.sync="shareVisible" :storeInfo="storeInfo"></share-list>
    <az-dialog :visible.sync="resultVisible" width="450px">
      <p v-html="resultTips"></p>
    </az-dialog>
    <delete-list :visible.sync="deleteVisible" :list-key="currentListId" :name="currentListName" @onSuccess="queryList"></delete-list>
    <az-toast ref="toast" :message="toastMsg" :duration="2000"></az-toast>
    <az-loading v-if="isLoading"></az-loading>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import AzInput from '@/components/az-ui/AzInput'
import AzToast from '@/components/az-ui/AzToast'
import MyDashboard from '@/components/influencer/MyDashboard'
import AzDialog from '@/components/az-ui/AzDialog'
import AzLoading from '@/components/az-ui/AzLoading'
import CreateEditList from '@/components/storefront/CreateEditList'
import DeleteList from '@/components/storefront/DeleteList'
import ShareList from '@/components/storefront/ShareList'
import { mapState } from 'vuex'

export default {
  components: {
    AzButton,
    AzInput,
    AzToast,
    MyDashboard,
    AzDialog,
    AzLoading,
    CreateEditList,
    DeleteList,
    ShareList
  },
  props: {
    storefrontInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    dashboardData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tabKey: 'my_storefront',
      paypalAccount: '',
      paypalErrorMsg: '',
      toastMsg: '',
      listName: '',
      errorMsg: '',
      createVisible: false,
      shareVisible: false,
      resultVisible: false,
      deleteVisible: false,
      isLoading: false,
      paypalSaved: false,
      editListId: '',
      currentListId: '',
      currentListName: '',
      storeInfo: {},
      resultTips: ''
    }
  },
  computed: {
    ...mapState('userInfo', ['storefrontLists']),
    tabs() {
      return [
        {
          key: 'my_storefront',
          name: this.nl('page_menu_storefront')
        },
        {
          key: 'my_dashboard',
          name: this.nl('page_ambassador_dashboard')
        }
      ]
    }
  },
  created() {
    if (this.$route.query.tab) {
      this.tabKey = this.$route.query.tab
    }
  },
  mounted() {
    this.paypalAccount = this.storefrontInfo.payAccount
  },
  methods: {
    clickTab(k) {
      this.tabKey = k
    },
    // 点击创建一个列表
    clickCreate() {
      this.createVisible = true
    },
    paypalBlurValidate() {
      if (this.paypalAccount) this.paypalErrorMsg = ''
    },
    clickSavePaypal() {
      if (!this.paypalAccount) {
        this.paypalErrorMsg = this.nl('page_please_enter_valid_value')
        return
      }
      const params = {
        pay_account: this.paypalAccount,
        referrer_type: 'storefront'
      }
      // 保存paypal账户接口
      this.$axios.$post('/1.0/referrer/collect-pay-account', params).then((res) => {
        if (res.code === 0) {
          this.paypalSaved = true
          this.toastMsg = this.nl('page_common_saved')
          this.$refs.toast.show()
        } else {
          alert(this.nl(res.msg))
        }
      })
    },
    // 点击编辑列表名称
    clickEditList(e) {
      this.editListId = e.storefrontListInfo.storeListId
      this.currentListName = e.storefrontListInfo.name
    },
    // 点击分享列表
    clickShareList(e) {
      if (!e.goodsTotal || e.goodsTotal < 5) {
        this.resultTips = this.nl('page_storefront_select_more_than_five')
        this.resultVisible = true
      } else if (!e.storefrontListInfo.headerImgUrl) {
        this.resultTips = this.nl('page_storefront_upload_your_profile')
        this.resultVisible = true
      } else {
        this.storeInfo = e
        this.shareVisible = true
      }
    },
    // 点击删除列表
    clickDeleteList(e) {
      this.deleteVisible = true
      this.currentListId = e.storefrontListInfo.storeListId
      this.currentListName = e.storefrontListInfo.name
    },
    // 编辑列表名字失去焦点，校验内容是否为空
    handleListNameBlur(e) {
      if (!this.currentListName) {
        this.currentListName = e.storefrontListInfo.name
      }
    },
    // 编辑列表名字确认保存
    clickEditSave(e) {
      if (this.currentListName) {
        let hasSame = false
        this.storefrontLists.forEach((ele) => {
          if (this.currentListName === ele.storefrontListInfo.name) {
            hasSame = true
            alert(this.nl('page_storefront_editname_same'))
          }
        })
        if (!hasSame) {
          this.isLoading = true
          const data = {
            storefront_list_id: e.storefrontListInfo.storeListId,
            column: 'name',
            column_value: this.currentListName
          }
          this.$axios.$post('/1.0/referrer/update-storefront', data).then(async (res) => {
            await this.queryList()
          })
        }
      } else {
        alert(this.nl('page_please_enter_valid_value'))
      }
    },
    // 查询门店列表数据
    async queryList() {
      this.isLoading = true
      const res = await this.$axios.$get('/1.0/referrer/storefront-list')
      this.isLoading = false
      this.editListId = ''
      if (res.code === 0) {
        this.$store.commit('userInfo/setStorefrontList', res.data.storefrontLists)
      }
    },
    // 点击门店内列表模块，进入对应列表详情页
    clickToStoreListDetails(e) {
      if (!e.goodsList || e.goodsList.length === 0) {
        location.href = '/'
        return
      }
      if (e.goodsTotal && e.storefrontListInfo) {
        location.href = '/storefront-details?id=' + e.storefrontListInfo.storeListId + '&code=' + e.storefrontListInfo.referrerCode
      }
    }
  }
}
</script>
<style lang="less" scoped>
.my-storefront {
  &-tab {
    border-bottom: 1px solid rgba(204, 204, 204, 0.9);
    margin-bottom: 20px;
    span {
      display: inline-block;
      font-family: @font-family-500;
      font-size: 16px;
      line-height: 22px;
      text-transform: uppercase;
      color: #999;
      margin-right: 30px;
      padding-bottom: 6px;
      position: relative;
      cursor: pointer;
      transition: 0.3s;
      &::after {
        transition: 0.3s;
        content: '';
        position: absolute;
        width: 100%;
        height: 3px;
        left: 0px;
        bottom: -1px;
        background-color: transparent;
      }
      &.active {
        color: var(--color-121212);
        font-family: @font-family-600;
        &::after {
          background-color: var(--color-121212);
        }
      }
    }
  }
  &-banner {
    width: 100%;
    margin-bottom: 20px;
    display: block;
  }
  .create-btn {
    margin-bottom: 20px;
  }
  &-section {
    border: 1px solid #eee;
    margin-bottom: 20px;
    &-header {
      padding: 10px 15px;
      height: 22px;
      border-bottom: 1px solid #eee;
      background: var(--color-f9f9f9);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #666;
      position: relative;
      &-left {
        display: flex;
        align-items: center;
        .name {
          font-family: @font-family-600;
          margin-right: 15px;
          color: var(--color-121212);
          text-transform: capitalize;
        }
        .edit-box {
          display: flex;
          align-items: center;
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          .btn {
            margin-left: 10px;
            height: 30px;
            line-height: 28px;
            min-width: 80px;
            font-size: 14px;
            padding: 0px 10px;
          }
          input {
            width: 260px;
            height: 30px;
            padding: 0px 10px;
            background: #fff;
            border: none;
          }
        }
      }
      &-right {
        .text-btn {
          text-decoration-line: underline;
          margin-left: 10px;
          cursor: pointer;
          text-transform: capitalize;
        }
      }
    }
    &-content {
      padding: 15px;
      height: 183px;
      display: flex;
      align-items: center;
      overflow: hidden;
      cursor: pointer;
      .blank-tips {
        width: 100%;
        text-align: center;
      }
      .product-item {
        width: 133px;
        height: 183px;
        margin-right: 15px;
        position: relative;
        &:last-of-type {
          margin-right: 0px;
        }
        .num {
          position: absolute;
          top: 0px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &-form-item {
    margin-top: 20px;
    .form-item-label {
      font-size: 13px;
      margin-bottom: 6px;
      display: block;
      .az-input {
        margin-top: 0px;
      }
    }
    .input-box {
      display: flex;
      justify-content: space-between;
      .btn {
        min-width: 100px;
        margin-left: 12px;
      }
      .az-input {
        flex: 1;
      }
      /deep/ .az-input-box {
        margin: 0px;
      }
    }
    .paypal-tips {
      font-size: 13px;
      color: #999;
    }
  }
}
</style>
