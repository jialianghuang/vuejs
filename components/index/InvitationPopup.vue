<template>
  <!-- 校园大使首页邀请弹窗 -->
  <div v-if="showPopup" class="invition-popup">
    <div>
      <az-icon @click="showPopup = false" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
      <img :src="replaceImgCdnUrl('https://cdn-1.azazie.com/upimg/point/ambassador/pc2.jpg')" alt="invition" />
      <h4>{{ nl('page_ambassador_invite_tip1') }} {{ ambassadorInfo.first_name }}</h4>
      <p v-html="nl(`page_ambassador_invite_tip2${country !== 'US' ? `_${country.toLowerCase()}` : ''}`)"></p>
      <az-button @click="toogleShow" class="btn btn-theme">{{ nl('page_ambassador_invite_btn') }}</az-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AzButton from '@/components/az-ui/Button/AzButton'
export default {
  languageKeys: [
    'page_ambassador_invite_tip1',
    'page_ambassador_invite_tip2',
    'page_ambassador_invite_tip2_ca',
    'page_ambassador_invite_tip2_gb',
    'page_ambassador_invite_tip2_au',
    'page_ambassador_invite_btn'
  ],
  components: {
    AzButton
  },
  data() {
    return {
      showPopup: false,
      ambassadorInfo: {}
    }
  },
  computed: {
    ...mapState('userInfo', ['firstInTime', 'isLogin'])
  },
  watch: {
    firstInTime(nval) {
      const id = this.$route.query.ambassador_info_id
      if (id) {
        // url上有ambassador_info_id参数代表被校园大使邀请
        this.buryPoint(this, 'event', {
          ec: 'Homepage',
          el: 'AmbassadorInvite',
          ea: 'view'
        })
        this.$axios
          .$post('/1.0/ambassador/relation', {
            ambassador_info_id: id
          })
          .then((res) => {
            if (res.code === 0) {
              this.ambassadorInfo = res.data
              this.showPopup = true
              const ambassadorIdInCookie = this.$cookie.getCookie('ambassador_info_id')
              this.buryPoint(this, 'event', {
                ec: 'Homepage',
                el: 'Invitation',
                ea: 'view'
              })
              if (!this.isLogin && (!ambassadorIdInCookie || (ambassadorIdInCookie && id !== +ambassadorIdInCookie))) {
                this.$cookie.setCookie('ambassador_info_id', id, 60)
              }
            }
          })
      }
    }
  },
  methods: {
    toogleShow() {
      this.buryPoint(this, 'event', {
        ec: 'Homepage',
        el: 'get discount',
        ea: 'click'
      })
      if (!this.isLogin) {
        this.$store.commit('setSignLayerSource', '/user?ambassador_my_reference')
        this.$parent.createAccountLayerShow = true
        // this.$router.push('/user/login?back=' + encodeURIComponent(this.countryUrl('/user?ambassador_my_reference')))
      } else {
        location.href = this.countryUrl('/user?ambassador_my_reference')
      }
      this.showPopup = !this.showPopup
    }
  }
}
</script>
<style lang="less" scoped>
.invition-popup {
  position: fixed;
  z-index: @popuy-z-index;
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  & > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    background: #fff;
    img {
      width: 100%;
      height: 192px;
    }
    .icon {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 15px;
      height: 15px;
      fill: #fff;
      cursor: pointer;
    }
    h4 {
      margin: auto;
      margin-top: 25px;
      width: 440px;
      font-family: @font-family-600;
      font-size: 20px;
      text-align: center;
      color: var(--color-121212);
    }
    p {
      margin: 10px auto 0;
      width: 440px;
      font-family: @font-family-500;
      font-size: 14px;
      line-height: 19px;
      text-align: center;
      color: var(--color-121212);
    }
    /deep/ a {
      color: @theme;
    }
  }
  .btn {
    display: block;
    width: 240px;
    height: 40px;
    margin: 25px auto 40px;
    font-family: @font-family-600;
  }
}
</style>
