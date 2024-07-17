<template>
  <!-- <div :class="{ 'rush-notice': springRushTemp }" class="parties-container"> -->
  <div class="party-select">
    <!-- <span class="party-select-note">{{ nl('page_party_select') }}</span> -->
    <div class="select-box">
      <div @click.stop="openValue" class="input">
        <input v-model="partySelectedDec" type="text" readonly />
        <svg class="icon select_title-icon">
          <use xlink:href="#icon-lby_expand_arrow_down"></use>
        </svg>
      </div>
      <div :class="['orderby-select', { show: show }]">
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
  </div>
  <!-- </div> -->
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PartyInfo',
  components: {},
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }
  },
  props: {
    summaryInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
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
    },
    springRushTemp() {
      return this.summaryInfo && this.summaryInfo.isSpringRush && this.parties && Object.keys(this.parties).length
    }
  },
  watch: {
    selectedParty: {
      handler(val, oldVal) {
        this.updateParty()
      },
      immediate: true
    },
    springRushTemp: {
      handler(val) {
        if (val) this.getvalue(0)
      },
      immediate: true
    }
  },
  mounted() {
    document.documentElement.addEventListener('click', () => {
      this.show = false
    })
    this.$nextTick(() => {
      this.setSelectBoxWidth()
    })
  },
  methods: {
    openValue() {
      if (this.springRushTemp) return false
      this.show = !this.show
      if (this.show) {
        this.setDataLayer({
          action: 'view',
          category: 'PC_ShoppingCartRevision',
          label: 'ShoppingCart_Party_View'
        })
      }
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
        .$post('/1.0/cart/party', { party_value: this.selectedParty.value, show_room_id: this.selectedParty.id })
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
    },
    setSelectBoxWidth() {
      const selectBox = document.querySelector('.party-select .select-box')
      const children = document.querySelector('.party-select .select-box .orderby-select')
      selectBox.style.setProperty('width', children.getBoundingClientRect().width + 'px')
    }
  }
}
</script>

<style lang="less" scoped>
// .parties-container {
//   padding: 20px 20px 16px;
//   margin-bottom: 6px;
// background: var(--color-f9f9f9);
.party-select {
  height: 32px;
  .select-box {
    position: relative;
    min-width: 200px;
    height: 32px;
    display: inline-block;
    cursor: pointer;
    color: var(--color-121212);
    background: #fff;
    .select_title-icon {
      position: absolute;
      top: 10px;
      right: 10px;
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
      line-height: 30px;
      border: 1px solid var(--color-cccccc);
      position: absolute;
      padding: 0 10px;
      box-sizing: border-box;
      input {
        width: 95%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        border: none;
        outline: none;
        padding: 0;
        cursor: pointer;
        color: var(--color-121212);
        &:focus {
          background: #fff;
        }
      }
    }
    .orderby-select {
      min-width: 200px;
      border: 1px solid var(--color-cccccc);
      overflow: hidden;
      position: absolute;
      top: 32px;
      background-color: #fff;
      // box-sizing: border-box;
      border-top: none;
      z-index: @z-index-2;
      text-transform: none;
      visibility: hidden;
      ul li {
        box-sizing: border-box;
        height: 30px;
        cursor: pointer;
        line-height: 30px;
        padding: 0 10px;
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
      &.show {
        visibility: visible;
      }
    }
  }
}
</style>
