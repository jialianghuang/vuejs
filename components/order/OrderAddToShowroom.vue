<template>
  <az-overlay :zIndex="12" @click="closeLayer">
    <div class="order-add">
      <transition name="fade" mode="out-in">
        <div key="1" @click="openValue('init')" v-if="!submitDone" class="order-add-party">
          <div>
            <div class="desc">
              <span>{{ nl('page_order_add_to-showroom_text') }}</span> <span></span>
            </div>
            <div class="content">
              <div class="select-box">
                <div @click.stop="openValue" class="input">
                  <input v-model="partySelectedDec" type="text" readonly />
                  <svg class="icon select_title-icon">
                    <use xlink:href="#icon-lby_expand_arrow_down"></use>
                  </svg>
                </div>
                <div v-show="show" class="orderby-select">
                  <ul>
                    <!-- <li @click="getvalue(0)" :class="{ selected: !selectedParty }" class="no-party">
                      <span>{{ nl('page_party_notice') | capitalize }}</span>
                    </li> -->
                    <template v-for="item in parties">
                      <li
                        @click="getvalue(item)"
                        v-if="!item.disabled"
                        :key="item.id"
                        :class="{ selected: selectedParty.value == item.value, disabled: item.disabled }"
                      >
                        <span>{{ item.name }}{{ item.value }}{{ nl('page_party_select_desc') }}</span>
                        <span v-if="item.disabled">({{ nl('page_common_expired') }})</span>
                      </li>
                    </template>
                    <li @click="getvalue(1)" :class="{ selected: selectedParty == 1 }" class="no-party">
                      <span>{{ nl('page_party_select_no_desc') }}</span>
                    </li>
                    <template v-for="item in parties">
                      <li
                        @click="getvalue(item)"
                        v-if="item.disabled"
                        :key="item.id"
                        :class="{ selected: selectedParty.value == item.value, disabled: item.disabled }"
                      >
                        <span>{{ item.name }}{{ item.value }}{{ nl('page_party_select_desc') }}</span>
                        <span v-if="item.disabled">({{ nl('page_common_expired') }})</span>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
              <div class="note">
                <span class="notice">{{ nl('page_logistics_note') }}:</span> {{ nl('page_order_add_to-showroom_text1') }}
                <a :href="getSupportUrl(`/articles/360042154471-Changes-Policy`, '/articles/8076697')" target="_blank" class="a-click">
                  {{ nl('page_order_add_to-showroom_text2') }}
                </a>
                {{ nl('page_common_expires') }}.
              </div>
              <div v-if="errorTips" class="error-tips">
                {{ nl('page_order_add_to-showroom_text3') }}
              </div>
              <button @click="confirm" :class="{ 'submit-btn': true, 'disabled-display': loading }">
                {{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_account_cancel_confirm') }}
              </button>
            </div>
          </div>
        </div>
        <div key="2" v-if="success && submitDone" class="order-add-party">
          <div>
            <img class="success-img" src="~assets/images/ccpa/ccpa_success.png" alt="success" />
            <div class="success-desc">
              {{ nl('page_order_add_to-showroom_text4') }} {{ orderSn }} to Showroom ID: {{ selectedParty.value }}.
            </div>
          </div>
        </div>
        <div key="3" v-if="!success && submitDone" class="order-add-party-error">
          <div>
            <div class="error-desc">{{ nl('page_order_add_to_showroom_error') }}</div>
          </div>
        </div>
      </transition>
      <span @click="closeLayer" class="dialog-close"></span>
    </div>
  </az-overlay>
</template>

<script>
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
export default {
  name: 'OrderAddToShowrom',
  components: {
    AzOverlay
  },
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }
  },
  props: {
    orderSn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      submitDone: false,
      show: false,
      selectedParty: 0,
      parties: [],
      errorTips: false,
      success: false,
      loading: false
    }
  },
  computed: {
    partySelectedDec() {
      if (this.selectedParty && this.selectedParty != 1) {
        return `${this.selectedParty.name}${this.selectedParty.value}${this.nl('page_party_select_desc')}`
      } else if (this.selectedParty) {
        return this.nl('page_party_select_no_desc')
      } else {
        return `${this.capitalize(this.nl('page_party_notice'))}`
      }
    }
  },
  mounted() {
    this.getParties()
  },
  methods: {
    openValue(param) {
      if (param == 'init') {
        this.show = false
      } else {
        this.show = !this.show
      }
    },
    getvalue(item) {
      if (item.disabled) return
      this.selectedParty = item
      if (this.selectedParty && this.selectedParty != 1) {
        this.errorTips = false
      }
      this.show = false
    },
    closeLayer() {
      this.$store.commit('order/setAddToShowrommLayerShow', false)
      this.success = false
      this.submitDone = false
    },
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    getParties() {
      this.$axios
        .$get('/1.0/showroom/showroom-list')
        .then((res) => {
          if (res.code == 0) {
            this.parties = res.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addOrderToShowroom() {
      const param = {
        order_sn: this.orderSn,
        showroom_id: this.selectedParty.id
      }
      this.$axios
        .$post('/1.0/order/add-showroom', param)
        .then((res) => {
          this.submitDone = true
          this.$emit('refreshOrder')
          if (res.code == 0) {
            this.loading = false
            this.success = true
          } else {
            this.loading = false
            this.success = false
          }
        })
        .catch((error) => {
          this.loading = false
          this.success = false
          console.log(error)
        })
    },
    confirm() {
      if (this.loading) return
      this.loading = true
      if (!this.selectedParty || this.selectedParty == 1) {
        this.errorTips = true
        this.loading = false
      } else {
        this.addOrderToShowroom()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order-add {
  position: relative;
}
.order-add-party {
  position: relative;
  background: #fff;
  height: 316px;
  width: 460px;
  .desc {
    font-family: @font-family-500;
    font-size: 16px;
    padding: 50px 0 10px 40px;
  }
  .content {
    .select-box {
      .input {
        cursor: pointer;
        width: 380px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #979797;
        position: relative;
        padding: 0 10px;
        box-sizing: border-box;
        margin-left: 40px;
        input {
          border: none;
          outline: none;
          padding: 0;
          cursor: pointer;
          color: var(--color-121212);
          width: 100%;
          &:focus {
            background: #fff;
          }
        }
        .select_title-icon {
          position: absolute;
          top: 15px;
          right: 10px;
          z-index: 2;
          font-size: 10px;
          width: 10px;
          height: 10px;
        }
      }
      .orderby-select {
        position: absolute;
        left: 40px;
        top: 122px;
        width: 380px;
        border: 1px solid var(--color-cccccc);
        z-index: @z-index-4;
        background-color: #fff;
        box-sizing: border-box;
        border-top: none;
        max-height: 155px;
        overflow-y: scroll;
        ul li {
          box-sizing: border-box;
          height: 40px;
          cursor: pointer;
          line-height: 40px;
          padding-left: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &:hover {
            background: #f6f6f6;
          }
          &.selected {
            background: #f6f6f6;
          }
          &.disabled {
            color: #d6d6d6;
          }
        }
      }
    }
    .note {
      font-size: 13px;
      font-family: @font-family-500;
      margin: 10px 40px;
    }
    .notice {
      color: var(--color-121212);
    }
    .a-click {
      color: var(--color-121212);
      text-decoration: underline;
    }
    .error-tips {
      margin-top: 10px;
      margin-left: 40px;
      color: var(--color-ff0000);
      font-size: 13px;
      line-height: 18px;
    }
    .submit-btn {
      box-sizing: border-box;
      width: 100%;
      padding: 12px 10px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      margin: 20px 40px;
      width: 380px;
      height: 50px;
      background: var(--color-121212);
      color: #fff;
      text-align: center;
      font-size: 16px;
    }
    .disabled-display {
      background-color: #666;
    }
  }
  .success-img {
    vertical-align: middle;
    width: 60px;
    height: 60px;
    margin-left: 200px;
    margin-top: 65px;
  }
  .success-desc {
    margin: 27px 40px;
    text-align: center;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.6s;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-leave {
    opacity: 1;
  }
}
.order-add-party-error {
  position: relative;
  background: #fff;
  width: 460px;
  height: 180px;
  transition: 0.8s;
  .error-desc {
    width: 90%;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.dialog-close {
  position: absolute;
  top: -10px;
  right: -10px;
  display: block;
  width: 24px;
  height: 24px;
  cursor: pointer;
  background: url('~assets/images/a_sprite_l_20190128.png') no-repeat 0 -162px;
}
</style>
