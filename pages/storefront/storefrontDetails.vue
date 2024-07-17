<template>
  <main-app ref="main" :navigation="navigation">
    <SvgStorefront />
    <div class="storefront-details">
      <div class="storefront-details-menu">
        <div class="menu-section-box">
          <div class="menu-section">
            <div @click="navToMyStorefront" class="menu-section-head menu-section-item">{{ nl('page_menu_storefront') }}</div>
            <ul>
              <li
                v-for="(item, index) in storefrontLists"
                :key="index"
                :class="{ active: item.storefrontListInfo.storeListId == storeListId }"
                @click="clickListItem(item)"
                class="menu-section-item"
              >
                {{ item.storefrontListInfo && item.storefrontListInfo.name }}
              </li>
            </ul>
          </div>
          <div class="menu-section dashboard">
            <div @click="navToMyDashboard" class="menu-section-head menu-section-item">{{ nl('page_ambassador_dashboard') }}</div>
          </div>
        </div>
      </div>
      <div class="storefront-details-main">
        <div
          :style="{
            backgroundImage: `url(${
              storefrontInfo.bannerImgUrl
                ? cdnPath + storefrontInfo.bannerImgUrl
                : 'https://cdn-1.azazie.com/upimg/userfiles/images/1/2e/f0/c9a5eeba85e055d487226544c1ce2ef0.jpg'
            })`
          }"
          class="storefront-details-main-head"
        >
          <input @change="handleBannerUpload" class="upload-input" type="file" accept="image/*" name="fileList[0]" title="" />
          <div v-if="!storefrontInfo.hideUserImage" class="avatar">
            <img v-if="storefrontInfo.headerImgUrl" :src="cdnPath + storefrontInfo.headerImgUrl" alt="avatar" />
            <template v-else>
              <span>+ {{ nl('page_storefront_upload_profile') }}</span>
              <az-icon icon-class="icon-xxy_sign_in"></az-icon>
            </template>
            <input @change="handleAvatarUpload" class="upload-input" type="file" accept="image/*" name="fileList[0]" title="" />
          </div>
        </div>
        <div class="main-container">
          <div class="main-container-top">
            <div class="list-name">
              <span>{{ nl('page_storefront_user_name_list', null, { name: userInfoName }) }}:</span>
              <span class="name">{{ storefrontInfo.name }}</span>
            </div>
            <az-button v-if="prodList.length" @click="clickShare" class="btn btn-default">
              {{ nl('page_storefront_share_this_list') }}
            </az-button>
          </div>
          <div class="main-container-handle">
            <span>{{ pageInfo.totalCount || 0 }} {{ nl('page_cat_items').toLowerCase() }}</span>
            <div class="handle-box">
              <span @click="editVisible = true" class="text-btn">{{ nl('page_storefront_edit_list_name') }}</span>
              <span @click="deleteVisible = true" class="text-btn">{{ nl('page_storefront_delete_list') }}</span>
            </div>
          </div>
          <van-list v-model="loading" :finished="isFinished" :immediate-check="false" :offset="200" @load="onLoad" class="van-clearfix">
            <p v-if="prodList.length === 0" v-html="nl('page_storefront_favorites_empty')" @click="clickEmpty" class="blank-tips"></p>
            <div v-else class="product-list">
              <div v-for="(product, index) in prodList" :key="product.goodsId + '-' + index" class="product-item-box" role="article">
                <product-list-item
                  :productIndex="index"
                  :item="product"
                  :page="Number(pageInfo.page)"
                  :show-limited-time-tag="true"
                  :data-goods-id="product.goodsId"
                  :data-color-id="product.color"
                  :data-goods-index="product.indexNo"
                  :data-cat-id="product.catId"
                  :data-dress-type="product.dressType"
                  :addSuffix="true"
                  :showFav="false"
                  @quickShop="quickShopClick"
                  @notify-me="notifyMe"
                ></product-list-item>
                <az-icon @click="clickDeleteItem(product)" icon-class="iconicon-close" class="delete-icon"></az-icon>
              </div>
              <div v-for="item in 4" :key="item" class="product-item-box"></div>
            </div>
            <div slot="loading" class="load-more">
              <i class="loading-hint"></i>
              <span class="loading-txt">{{ nl('page_common_loading') }}</span>
            </div>
          </van-list>
        </div>
      </div>
    </div>
    <create-edit-list
      :visible.sync="editVisible"
      :value="storefrontInfo.name"
      :listKey="storeListId"
      :storefrontLists="storefrontLists"
      @onSuccess="handleEditSuccess"
    ></create-edit-list>
    <delete-list
      :visible.sync="deleteVisible"
      :name="storefrontInfo.name"
      :listKey="storeListId"
      @onSuccess="navToMyStorefront"
    ></delete-list>
    <share-list :visible.sync="shareVisible" :storeInfo="{ storefrontListInfo: storefrontInfo, goodsList: prodList }"></share-list>
    <az-dialog :visible.sync="resultVisible" width="450px">
      <p v-html="resultTips"></p>
    </az-dialog>
    <quick-shop-dialog ref="quickShopDialog" :fromDialog="'list'" @refreshCartList="getCartInfo()"></quick-shop-dialog>
    <notify-me-dialog v-if="openNotifyMe" :item="goodsItem" :style-info="{}"></notify-me-dialog>
    <az-loading v-if="isLoading || loadingFlag"></az-loading>
  </main-app>
</template>

<script>
import mainApp from '@/components/Main'
import AzButton from '@/components/az-ui/Button/AzButton'
import CreateEditList from '@/components/storefront/CreateEditList'
import DeleteList from '@/components/storefront/DeleteList'
import ShareList from '@/components/storefront/ShareList'
import AzDialog from '@/components/az-ui/AzDialog'
import ProductListItem from '@/components/list/ProductListItem'
import AzLoading from '@/components/az-ui/AzLoading'
import NotifyMeDialog from '@/components/common/NotifyMeDialog'
import SvgStorefront from '@/components/svgs/SvgStorefront'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
// 异步组件，会分开打包，有多语言的要在组件中请求多语言
const QuickShopDialog = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('@/components/quickshop/QuickShopDialog'),
  // 异步组件加载时使用的组件
  loading: AzLoading
})

/**
 * 门店列表商品详情
 */
export default {
  components: {
    mainApp,
    AzButton,
    AzDialog,
    CreateEditList,
    DeleteList,
    ShareList,
    ProductListItem,
    AzLoading,
    QuickShopDialog,
    NotifyMeDialog,
    SvgStorefront
  },
  data() {
    return {
      editVisible: false,
      deleteVisible: false,
      shareVisible: false,
      resultVisible: false,
      isLoading: false,
      loading: false,
      isFinished: false,
      goodsItem: {},
      resultTips: '',
      cdnPath: 'https://cdn-1.azazie.com/'
    }
  },
  computed: {
    ...mapState('list', ['prodList', 'loadingFlag'])
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      const listRes = await context.$axios.$get('/1.0/referrer/storefront-list')
      const storefrontLists = listRes.data.storefrontLists || []

      const storeListId = context.route.query.id || ''
      const referrerCode = context.route.query.code || ''
      let storefrontInfo = {}
      let pageInfo = { totalCount: 0, limit: 30, page: 1, totalPage: 1 }
      if (storeListId) {
        // 获取门店指定列表详情接口
        const params = {
          referrer_code: referrerCode,
          page: pageInfo.page,
          limit: pageInfo.limit
        }
        const [res, colorHexRes] = await Promise.all([
          context.$axios.$get('/1.0/referrer/storefront-goods-list/' + storeListId, { params }),
          context.$axios.$get('/1.0/common/color-hex')
        ])
        if (res.code === 0) {
          pageInfo = res.data.pageInfo
          storefrontInfo = res.data.storefrontInfo
          if (res.data.goodsList) {
            context.store.commit('list/setProdList', res.data.goodsList)
          }
        } else if (res.code == 100001 || res.code == 100501) {
          context.redirect(302, `/user/login?back=${context.route.fullPath}`)
          return
        } else if (res.code == 302) {
          context.redirect(302, `/`)
          return
        } else {
          context.redirect(302, `/user?my_storefront`)
          return
        }
        // 列表页将colorHex放在首屏里面，优化页面渲染
        if (colorHexRes.code == 0) {
          context.store.commit('setColorHex', colorHexRes.data.colorHex)
        }
      }

      context.store.commit('list/setLoadingFlag', false)
      context.store.commit('setJsKey', 'storefront_details')
      return {
        ...commonAsyncData,
        storefrontLists,
        storeListId,
        referrerCode,
        storefrontInfo,
        pageInfo
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
  methods: {
    clickEmpty() {
      location.href = this.countryUrl('/')
    },
    notifyMe(item) {
      this.goodsItem = item
      this.$store.commit('setOpenNotifyMe', true)
    },
    quickShopClick(params) {
      this.$refs.quickShopDialog.quickShopClick(params)
    },
    getCartInfo() {
      this.$refs.main.getCartInfo()
    },
    navToMyStorefront() {
      location.href = this.countryUrl('/user?my_storefront')
    },
    navToMyDashboard() {
      location.href = this.countryUrl('/user?my_storefront&tab=my_dashboard')
    },
    handleEditSuccess() {
      location.reload()
    },
    clickListItem(e) {
      if (e.storefrontListInfo) {
        location.href = this.countryUrl(
          '/storefront-details?id=' + e.storefrontListInfo.storeListId + '&code=' + e.storefrontListInfo.referrerCode
        )
      }
    },
    // 点击列表，切换对应门店列表详情数据
    queryGoodsList(e) {
      if (e && e.storefrontListInfo) {
        this.storeListId = e.storefrontListInfo.storeListId
        this.referrerCode = e.storefrontListInfo.referrerCode
      }
      const params = {
        referrer_code: this.referrerCode,
        page: this.pageInfo.page,
        limit: this.pageInfo.limit
      }
      this.isLoading = true
      this.$axios.$get('/1.0/referrer/storefront-goods-list/' + this.storeListId, { params }).then((res) => {
        this.isLoading = false
        if (res.code === 0) {
          this.pageInfo = res.data.pageInfo
          if (this.pageInfo.page >= this.pageInfo.totalPage) {
            this.isFinished = true
          } else {
            this.isFinished = false
            this.loading = false
          }
          this.storefrontInfo = res.data.storefrontInfo
          let goodsList = []
          if (e && e.isDelete) {
            goodsList = res.data.goodsList
          } else {
            goodsList = [...this.prodList]
            res.data.goodsList.forEach((ele) => {
              goodsList.push(ele)
            })
          }
          if (res.data.goodsList) {
            this.$store.commit('list/setProdList', goodsList)
          }
        }
      })
    },
    uploadCommon(e) {
      const file = e.target.files[0]
      // 校验图片文件大小， 最大5MB
      const maxSize = 1024 * 5
      if (file.size > maxSize * 1024) {
        alert(this.nl('page_upload_file_is_to_big_tips', null, { size: maxSize / 1024 }))
        return
      }
      const formData = new FormData()
      formData.append('file[0]', file)
      return formData
    },
    // 上传头像
    handleAvatarUpload(e) {
      const formData = this.uploadCommon(e)
      if (formData) this.handleUpload(formData, 'header')
    },
    // 上传banner
    handleBannerUpload(e) {
      const formData = this.uploadCommon(e)
      if (formData) this.handleUpload(formData, 'banner')
    },
    // 处理图片上传
    handleUpload(formData, column) {
      this.$axios
        .$post('/1.0/file/batch-upload-img', formData)
        .then((res) => {
          if (res.code == 0) {
            let imgUrl = res.data.file_addr
            if (imgUrl) imgUrl = imgUrl.split('.com/')[1]
            if (column === 'header') {
              this.storefrontInfo.headerImgUrl = imgUrl
            } else if (column === 'banner') {
              this.storefrontInfo.bannerImgUrl = imgUrl
            }
            const data = {
              storefront_list_id: this.storeListId,
              column,
              column_value: imgUrl
            }
            this.$axios.$post('/1.0/referrer/update-storefront', data).then((res) => {})
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    clickShare() {
      if (!this.pageInfo.totalCount || this.pageInfo.totalCount < 5) {
        this.resultTips = this.nl('page_storefront_select_more_than_five')
        this.resultVisible = true
      } else if (!this.storefrontInfo.headerImgUrl) {
        this.resultTips = this.nl('page_storefront_upload_your_profile')
        this.resultVisible = true
      } else {
        this.shareVisible = true
      }
    },
    // 点击从门店列表中删除选中商品
    clickDeleteItem(e) {
      this.isLoading = true
      const data = {
        store_list_id: this.storeListId,
        goods_id: e.goodsId,
        color_id: e.colorId
      }
      this.$axios.$post('/1.0/referrer/remove-storefront-goods', data).then((res) => {
        this.isLoading = false
        if (res.code === 0) {
          this.pageInfo.page = 1
          this.queryGoodsList({ isDelete: true })
        } else {
          console.log(res.msg)
        }
      })
    },
    // 加载更多
    onLoad() {
      if (this.pageInfo.page >= this.pageInfo.totalPage) this.isFinished = true
      if (!this.isFinished) {
        this.loading = true
        this.pageInfo.page++
        this.queryGoodsList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.storefront-details {
  width: 87.6%;
  margin: 20px auto 0px;
  position: relative;
  display: flex;
  justify-content: center;
  &-menu {
    width: 242px;
    .menu-section {
      border: 1px solid #ccc;
      margin-bottom: 20px;
      &-box {
        position: sticky;
        top: 70px;
        left: 0px;
      }
      &.dashboard {
        border-bottom: 0px;
      }
      &-item {
        padding: 16px 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        text-transform: capitalize;
      }
      &-head {
        font-size: 16px;
        letter-spacing: 0.64px;
        border-bottom: 1px solid #ccc;
        font-family: @font-family-600;
      }
      ul {
        li {
          font-size: 13px;
          font-family: @font-family-500;
          &:hover,
          &.active {
            background: var(--color-f9f9f9);
            font-family: @font-family-600;
          }
        }
      }
    }
  }
  &-main {
    width: calc(100% - 242px);
    max-width: 1400px;
    margin-left: 40px;
    &-head {
      width: 100%;
      height: 160px;
      background-color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: #fff;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      > span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .upload-input {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        cursor: pointer;
        font-size: 0px;
        opacity: 0;
      }
      .banner {
        width: 100%;
        height: 100%;
        &-box {
          width: 100%;
          height: 100%;
        }
      }
      .avatar {
        width: 146px;
        height: 146px;
        border-radius: 50%;
        border: 2px solid #fff;
        position: absolute;
        left: 3.86%;
        bottom: -22px;
        background-color: var(--color-121212);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        cursor: pointer;
        .az-icon {
          width: 110px;
          height: 110px;
          fill: #444;
          margin-top: 36px;
        }
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          text-align: center;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .main-container {
      max-width: 92.357%;
      height: 100%;
      position: relative;
      margin: 32px auto 0px;
      &-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .list-name {
          font-size: 16px;
          text-transform: uppercase;
          max-width: 560px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .name {
            text-transform: initial;
            font-family: @font-family-600;
            font-size: 24px;
            line-height: normal;
            margin-left: 15px;
            text-transform: capitalize;
          }
        }
        .btn {
          padding: 7px 50px;
        }
      }
      &-handle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .handle-box {
          display: flex;
          align-items: center;
          .text-btn {
            text-decoration-line: underline;
            margin-left: 15px;
            cursor: pointer;
            color: var(--color-121212);
            text-transform: capitalize;
            &:first-of-type {
              margin-left: 0px;
            }
          }
        }
      }
    }
    .product-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      /deep/ .goods-item {
        width: 100%;
      }
      .product-item-box {
        position: relative;
        width: 19%;
        .delete-icon {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 35px;
          height: 35px;
          fill: var(--color-121212);
          cursor: pointer;
          z-index: 1;
        }
      }
    }
    .blank-tips {
      width: 100%;
      text-align: center;
      margin: 50px 0px;
      cursor: pointer;
    }
  }
}
/deep/ .van-list__loading {
  width: 100%;
  .load-more {
    text-align: center;
    padding: 20px 0;
    .loading-hint {
      display: inline-block;
      height: 20px;
      width: 20px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAP1BMVEUAAAD0KA/xJhHxJA7yJA7xJA7xJA7xJA7xJA7wJA7xJA7xJA7xJA7xJA7xJA7xJA3xJA7xJA7xJA7xJA7xJA5JCyllAAAAFXRSTlMACxdEI3NalDdn3LyvLstPoveIgOl7Sm+EAAABiklEQVRIx9XS0W7kIAxAUWyDwckAIfD/37owUyndbbMJrtSq92UeoiMbGHMWRqKciSKamSw5v23b462d7T0HVIc76NrbGK8h+153vgozi9u39ZW7wOSfSYB3pyY3JqdV4ByiG86FTw6xrSmlx+mZ4757X8PJPo/Uo5OPe4/MaTwGy6dfOvz/VeAY7OGjrPvOcHH9PqXFf9i21krmMrcsi/vnhg55bfPfr1Irm1v5bqM5ElcF7lFYl2WF46DOOTA3w/TuuNBlMLeTvjIeQ8XcD9LS9mOoNRPl1t7GBufYTLW29jotP4dOjk2mhyJi5oKltfG2UYTMZL4VN6aL2FnKpTzGjwjMUiyl9b1F2Ey3lILjlvI8XUshY5lpnm6l8KBhnvpSxETmOE/3UpySjo6Fv5UiMykp5JyNsk5BSUPOqL2nnKP2sERklHWq3pgoaDf+nWPVfwsK6rcNIVilxW7xB6wNMVqtjXqLnVrQWbAj+IJFHcanRQAlxhH0xiJza7/owIrpMOBrsK4L9wckTA/GBoy0fQAAAABJRU5ErkJggg==)
        no-repeat 0 0;
      background-size: 100% 100%;
      animation: rotate 1s infinite;
    }
    .loading-txt {
      padding-left: 12px;
      font-size: 16px;
      color: var(--color-121212);
      line-height: 20px;
      display: inline-block;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .storefront-details {
    &-main {
      .product-list {
        .product-item-box {
          .delete-icon {
            width: 28px;
            height: 28px;
          }
        }
      }
    }
  }
}
</style>
