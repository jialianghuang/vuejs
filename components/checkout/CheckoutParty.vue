<template>
  <div id="checkout_party" class="checkout-party">
    <block-title :title="nl('page_checkout_choose_party')"></block-title>
    <div class="party-select">
      <div class="party-select-block">
        <span class="party-select-note">{{ nl('page_party_select') }}</span>
        <div class="select-box">
          <div @click.stop="openValue" class="input">
            <input v-model="partySelectedDec" :class="{ init: partySelectedDec == '* Please choose a party' }" type="text" readonly />
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
                  <span v-if="item.disabled">(Expired)</span>
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
                  <span v-if="item.disabled">(Expired)</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="displayNoticeBanner" class="note-box">
        <span>.{{ nl('page_cart_welcome_back_still_have') }}</span>
        <br />
        <span>.{{ nl('page_party_select_tip_begin_desc') }}</span>
        <a
          :href="getSupportUrl('/articles/207544223-Color-Consistency-Dye-Lots', '/')"
          target="_blank"
          style="text-decoration: underline; color: #999;"
          >{{ nl('page_cart_dye_lot_variations') }}</a
        >
        <span>{{ nl('page_party_select_tip_end_desc') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import BlockTitle from '@/components/checkout/BlockTitle'
// import AzCountDown from '@/components/az-ui/AzCountDown'
import { mapState } from 'vuex'
export default {
  name: 'CheckoutParty',
  components: { BlockTitle },
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }
  },
  props: {},
  data() {
    return {
      show: false,
      displayNoticeBanner: false, // 这个字段不知道是干嘛得，对应az的 cart_info['display_notice_banner']
      partyDeadline: null
    }
  },
  computed: {
    ...mapState('cart', ['selectedParty', 'parties']),
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
  watch: {
    selectedParty: {
      handler(val, oldVal) {
        this.updateParty()
      },
      immediate: true
    }
  },
  mounted() {
    document.documentElement.addEventListener('click', () => {
      this.show = false
    })
  },
  methods: {
    openValue() {
      this.show = !this.show
    },
    getvalue(item) {
      if (item.disabled) return
      this.$store.commit('cart/setSelectedParty', item)
      this.show = false
    },
    countDownEnd() {
      this.updateParty()
    },
    updateParty() {
      this.$axios
        .$post('/1.0/order/checkout/party', { party_value: this.selectedParty.value, show_room_id: this.selectedParty.id })
        .then((res) => {
          if (res.code == 0) {
            const data = res.data
            this.partyDeadline = null
            if (data.roomEndFlag == 0) {
              //
            } else if (data.roomEndFlag == 1) {
              // 有倒计时
              this.partyDeadline = res.data
            } else if (data.roomEndFlag == 2) {
              // 已经过期
              const partiesArr = JSON.parse(JSON.stringify(this.parties))
              partiesArr.forEach((item) => {
                if (item.value == this.selectedParty.value) {
                  item.disabled = true
                }
              })
              this.$store.commit('cart/setParties', partiesArr)
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }
  }
}
</script>

<style lang="less" scoped>
.checkout-party {
  margin-bottom: 60px;
  .party-select-block {
    display: flex;
    align-items: center;
    height: 40px;
    margin-top: 20px;
  }
  .party-select-note {
    margin-right: 5px;
    font-family: @font-family-600;
    font-size: 13px;
    line-height: 18px;
  }
  .select-box {
    position: relative;
    width: 233px;
    height: 40px;
    display: inline-block;
    cursor: pointer;
    color: var(--color-121212);
    background: #fff;
    .select_title-icon {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 2;
      font-size: 10px;
      width: 10px;
      height: 10px;
    }
    ul li {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .input {
      width: 100%;
      height: 100%;
      line-height: 40px;
      border: 1px solid #eee;
      position: absolute;
      padding: 0 10px;
      box-sizing: border-box;
      input {
        border: none;
        outline: none;
        padding: 0;
        cursor: pointer;
        color: var(--color-121212);
        &.init {
          color: #999;
        }
        &:focus {
          background: #fff;
        }
      }
    }
    .orderby-select {
      width: 367px;
      border: 1px solid var(--color-cccccc);
      overflow: hidden;
      position: absolute;
      top: 40px;
      background-color: #fff;
      box-sizing: border-box;
      border-top: none;
      z-index: @z-index;
      ul li {
        box-sizing: border-box;
        height: 30px;
        cursor: pointer;
        line-height: 30px;
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
  .party-deadline-desc {
    padding-bottom: 10px;
    font-size: 13px;
    color: @theme-color;
    font-family: @font-family-600, sans-serif;
    .flash-sale-time {
      background: none;
      margin-left: 0;
    }
  }
  .note-box {
    margin-top: 10px;
    font-size: 13px;
    color: #999;
    line-height: 18px;
  }
}
</style>
