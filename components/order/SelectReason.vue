<template>
  <div class="select-reason">
    <div class="select-input-box">
      <input
        :placeholder="nl('page_return_select_reason')"
        :class="{ error: returnReasonData[goodsItem.recId] && returnReasonData[goodsItem.recId].inputError }"
        @click.stop="showReasons()"
        :value="reasonsDec.join(', ')"
        class="return_reason_select new_return_reason_select"
        type="text"
        readonly
      />
      <svg @click.stop="showReasons()" class="icon select-input-icon">
        <use xlink:href="#icon-lby_expand_arrow_down"></use>
      </svg>
    </div>
    <div v-if="show" class="select-reason-box">
      <div class="level_box">
        <ul>
          <li
            v-for="(f_item, f_key) in reasonsTemp"
            :key="f_key"
            @click.stop="handleReasons(1, f_key)"
            :class="{ selected: firstKey == f_key }"
            class="Branch"
          >
            <span>{{ f_key }}</span>
            <svg class="icon select_title-icon">
              <use xlink:href="#icon-lby_expand_arrow_down"></use>
            </svg>
          </li>
        </ul>
      </div>
      <div v-if="showSecond" class="level_second level_box">
        <ul>
          <li
            v-for="(s_item, s_key) in reasonsTemp[firstKey]"
            :key="s_key"
            @click.stop="handleReasons(2, s_item, s_key)"
            :class="[
              !s_item.leaf || !Object.keys(s_item.leaf).length ? 'leaf' : 'Branch',
              { selected: s_item.value == secondKey },
              { disabled: currentAbleReason && currentAbleReason != firstKey }
            ]"
          >
            <span :class="{ selected: s_item.selected }" v-if="!s_item.leaf || !Object.keys(s_item.leaf).length" class="checkbox-box">
              <az-icon :icon-class="'icon-lby_tick_white_s'" class="checkbox-icon"></az-icon>
            </span>
            <span>{{ s_item.value }}</span>
            <svg v-if="s_item.leaf && Object.keys(s_item.leaf).length" class="icon select_title-icon">
              <use xlink:href="#icon-lby_expand_arrow_down"></use>
            </svg>
          </li>
        </ul>
      </div>
      <div v-if="showThird" class="level_third level_box">
        <ul>
          <li
            v-for="(th_item, th_key) in reasonsTemp[firstKey][secondIndex].leaf"
            :key="th_key"
            @click.stop="handleReasons(3, th_item, th_key)"
            :class="[
              !th_item.leaf || !Object.keys(th_item.leaf).length ? 'leaf' : 'Branch',
              { disabled: currentAbleReason && currentAbleReason != firstKey }
            ]"
          >
            <span :class="{ selected: th_item.selected }" v-if="!th_item.leaf || !Object.keys(th_item.leaf).length" class="checkbox-box">
              <az-icon :icon-class="'icon-lby_tick_white_s'" class="checkbox-icon"></az-icon>
            </span>
            <span>{{ th_item.value }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SelectReason',
  components: {},
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    },
    reasons: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      firstKey: null,
      secondKey: null,
      showSecond: false,
      showThird: false,
      reasonsTemp: {},
      secondIndex: 0,
      show: false,
      reasonsDec: [],
      currentAbleReason: null
    }
  },
  computed: {
    ...mapState('order', ['returnReasonData']),
    itemReason() {
      const itemReasonTemp = []
      for (const reasonsItem in this.reasonsTemp) {
        this.reasonsTemp[reasonsItem].forEach((secItem) => {
          if (secItem.id && secItem.selected) {
            itemReasonTemp.push(secItem)
          } else if (secItem.leaf && Object.keys(secItem.leaf).length) {
            secItem.leaf.forEach((thirdItem) => {
              if (thirdItem.id && thirdItem.selected) {
                itemReasonTemp.push(thirdItem)
              }
            })
          }
        })
      }
      return itemReasonTemp
    }
  },
  created() {},
  mounted() {
    this.reasonsTemp =
      this.returnReasonData[this.goodsItem.recId] && this.returnReasonData[this.goodsItem.recId].reasonsTemp
        ? JSON.parse(JSON.stringify(this.returnReasonData[this.goodsItem.recId].reasonsTemp))
        : JSON.parse(JSON.stringify(this.reasons))
    window.addEventListener('click', this.hideReasons)
  },
  methods: {
    handleReasons(type, data, index) {
      if (type == 1) {
        this.firstKey = data
        this.showSecond = true
        this.showThird = false
      } else if (type == 2) {
        if (data.leaf && Object.keys(data.leaf).length) {
          this.reasonsTemp[this.firstKey].forEach((_item, _index) => {
            if (_item.leaf && Object.keys(_item.leaf).length) {
              this.$set(this.reasonsTemp[this.firstKey][_index], 'selected', false)
            }
          })
          // 有下一级
          this.showThird = true
          this.secondIndex = index
          this.secondKey = data.value
          this.$set(this.reasonsTemp[this.firstKey][index], 'selected', !data.selected)
        } else {
          //  每次选择只能选一个一级菜单下的选项，一旦选择了本一级菜单下的选项，就不能再选择其他一级菜单下的选项
          if (this.currentAbleReason && this.currentAbleReason != this.firstKey) return false
          this.$set(this.reasonsTemp[this.firstKey][index], 'selected', !data.selected)
          if (this.itemReason.length) {
            this.currentAbleReason = this.firstKey
          } else {
            this.currentAbleReason = null
          }
        }
      } else if (type == 3) {
        //  每次选择只能选一个一级菜单下的选项，一旦选择了本一级菜单下的选项，就不能再选择其他一级菜单下的选项
        if (this.currentAbleReason && this.currentAbleReason != this.firstKey) return false
        this.$set(this.reasonsTemp[this.firstKey][this.secondIndex].leaf[index], 'selected', !data.selected)
        if (this.itemReason.length) {
          this.currentAbleReason = this.firstKey
        } else {
          this.currentAbleReason = null
        }
      }
    },
    hideReasons() {
      this.show = false
      this.reasonsDec = []
      this.reasonsDec = this.itemReason.map((item) => {
        return item.value
      })
      this.$emit('getReasonsTemp', this.itemReason)
      const tempData = JSON.parse(JSON.stringify(this.returnReasonData))
      tempData[this.goodsItem.recId].reasonsTemp = this.reasonsTemp
      this.$store.commit('order/setReturnReasonData', tempData)
    },
    showReasons() {
      this.show = !this.show
      const returnReasonDataTemp = JSON.parse(JSON.stringify(this.returnReasonData))
      returnReasonDataTemp[this.goodsItem.recId].inputError = false
      this.$store.commit('order/setReturnReasonData', returnReasonDataTemp)
    }
  }
}
</script>

<style lang="less" scoped>
.select-reason {
  .select-input-box {
    position: relative;
    margin-right: 20px;
    input {
      box-sizing: border-box;
      width: 300px;
      height: 32px;
      padding: 0 30px 0 10px;
      cursor: default;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 18px;
      border-color: #ccc;
      cursor: pointer;
      &.error {
        background: var(--color-f1e9e6);
        border-color: #d77ea9;
      }
    }
    .select-input-icon {
      position: absolute;
      top: 50%;
      right: 10px;
      cursor: pointer;
      z-index: 3;
      font-size: 10px;
      width: 10px;
      height: 10px;
      margin-top: -5px;
      fill: currentColor;
      color: var(--color-121212);
    }
  }
  .select-reason-box {
    background: #ffffff;
    position: absolute;
    left: 103px;
    display: flex;
    height: 160px;
    overflow: hidden;
    justify-content: space-between;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    z-index: 4;
    ul {
      min-width: 300px;
      height: 160px;
      overflow-y: auto;
      li {
        height: 32px;
        padding: 0 13px 0 10px;
        border: none;
        line-height: 32px;
        font-size: 13px;
        font-family: @font-family-500;
        color: var(--color-121212);
        cursor: default;
        position: relative;
        &.leaf {
          padding-left: 35px;
        }
        &.selected {
          background-color: #f6f6f6;
        }
        &.disabled {
          .checkbox-box {
            border-color: #eee;
          }
          span {
            color: var(--color-999999);
          }
        }
        span {
          color: var(--color-121212);
        }
        .select_title-icon {
          position: absolute;
          top: 50%;
          right: 10px;
          z-index: 3;
          font-size: 10px;
          width: 10px;
          height: 10px;
          margin-top: -5px;
          transform: rotate(-90deg);
          fill: currentColor;
          color: var(--color-121212);
        }
        .checkbox-box {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 10px;
          display: inline-block;
          box-sizing: border-box;
          width: 15px;
          height: 15px;
          border: 1px solid #666;
          .checkbox-icon {
            margin: 2px;
            display: block;
            fill: currentColor;
            color: #fff;
            font-size: 10px;
            width: 10px;
            height: 9px;
            cursor: pointer;
          }
          &.selected {
            background: #666;
          }
        }
      }
    }
    .level_second,
    .level_third {
      ul {
        min-width: 380px;
      }
    }
  }
}
</style>
