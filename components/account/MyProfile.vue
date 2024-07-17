<template>
  <div>
    <div class="myprofile-container">
      <div>
        <p class="profile-subtitle">{{ nl('page_profile_info_1') }}</p>
        <input :value="showEmail" disabled class="myprofile-input" />
        <a @click="profileBuryPoint('editemailaddress')" :href="countryUrl('/user?edit_my_email')"
          ><az-icon icon-class="profile-edit" class="edit-icon"></az-icon
        ></a>
      </div>
      <div>
        <p class="profile-subtitle">{{ nl('page_profile_info_2') }}</p>
        <input :value="hasWeddingDate" disabled class="myprofile-input" />
        <a @click="profileBuryPoint('editimportantdate')" :href="countryUrl('/user?important_dates')"
          ><az-icon icon-class="profile-edit" class="edit-icon"></az-icon
        ></a>
      </div>
    </div>
    <div class="my-profile-container2">
      <div class="account-title">
        <div class="view-all-text">
          <span
            ><a @click="profileBuryPoint('viewall')" :href="countryUrl('/order/list')" class="view-all-link">{{
              nl('page_profile_viewall')
            }}</a></span
          >
        </div>
        <h1>{{ nl('page_profile_my_order') }}</h1>
      </div>
      <div class="order-section">
        <div>
          <a @click="profileBuryPoint('unpaid')" :href="countryUrl('/order/list?page=1&status=unpaid')">
            <az-icon icon-class="unpaid-icon" class="myprofile-icon"></az-icon>
            <p class="icon-title">{{ nl('page_submenu_unpaid_orders') }}</p>
          </a>
        </div>
        <div>
          <a @click="profileBuryPoint('processing')" :href="countryUrl('/order/list?page=1&status=processing')">
            <az-icon icon-class="process-icon" class="myprofile-icon"></az-icon>
            <p class="icon-title">{{ nl('page_submenu_processing_orders') }}</p>
          </a>
        </div>
        <div>
          <a @click="profileBuryPoint('shipped')" :href="countryUrl('/order/list?page=1&status=shipped')">
            <az-icon icon-class="shipped-icon" class="myprofile-icon"></az-icon>
            <p class="icon-title">{{ nl('page_submenu_shipped_orders') }}</p>
          </a>
        </div>
        <div>
          <a @click="profileBuryPoint('reviews')" :href="countryUrl('/order/list?page=1&status=review')">
            <az-icon icon-class="reviews-icon" class="myprofile-icon"></az-icon>
            <p class="icon-title">{{ nl('page_submenu_review_orders') }}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormatForWeddingDate } from '@/assets/js/utils.js'
export default {
  name: 'MyProfile',
  components: {},
  props: {
    myEmail: {
      type: String,
      default: ''
    },
    weddingDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    hasWeddingDate() {
      return this.weddingDate != '0000-00-00' ? dateFormatForWeddingDate(this.weddingDate, this.country, this.language || 'en') : ''
    },
    showEmail() {
      return this.myEmail
    }
  },
  methods: {
    profileBuryPoint(type) {
      this.buryPoint(this, 'event', { ec: 'myprofile', el: type, ea: 'click' })
    }
  }
}
</script>

<style lang="less" scoped>
.myprofile-container {
  position: relative;
  padding-top: 15px;
  display: flex;
  gap: 63px;
}
.myprofile-input {
  background-color: #ffffff;
  box-sizing: border-box;
  width: 405px;
  height: 40px;
  border: 1px solid var(--color-cccccc);
  padding-left: 10px;
  font-family: @font-family-500;
  font-size: 13px;
  line-height: 18px;
  color: var(--color-121212);
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
.my-profile-container2 {
  position: relative;
  margin-top: 45px;
}
.view-all-text {
  position: absolute;
  height: 18px;
  right: 0;
}
.view-all-link {
  font-family: @font-family-500;
  font-size: 13px;
  line-height: 18px;
  text-transform: uppercase;
  color: var(--color-999999);
}
.myprofile-icon {
  width: 100px;
  height: 100px;
}
.order-section {
  display: flex;
  padding-left: 117px;
  padding-top: 25px;
  gap: 90px;
}
.icon-title {
  text-align: center;
  font-family: @font-family-600;
  font-size: 13px;
  line-height: 18px;
  color: var(--color-121212);
}
.profile-subtitle {
  font-family: @font-family-600;
  font-size: 13px;
  line-height: 18px;
  color: var(--color-121212);
  margin-bottom: 6px;
}
a {
  display: inline-block;
  .edit-icon {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 47px;
    margin-left: 10.5px;
  }
}
</style>
