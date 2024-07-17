<template>
  <!-- 退货原因 -->
  <div :id="`new_div_return_reason_${goodsItem.orderId}_${goodsItem.oiid}`" class="return-reason-form">
    <div class="show_line">
      <!-- #12280 如果是样衣，就不选原因 -->
      <div v-if="needReturnReason" class="reason_box content_box">
        <div class="title">{{ nl('page_return_reason') }}:</div>
        <select-reason :goodsItem="goodsItem" @getReasonsTemp="getReasonsTemp" :reasons="reasons"></select-reason>
      </div>
      <!-- 退货数量 -->
      <div v-if="goodsItem.goodsReturnNumber * 1 > 0" class="quantity_box content_box">
        <div class="title">{{ nl('page_return_quantity_to_return') }}:</div>
        <div class="return_quantity_select_box">
          <select v-model="formData.quantity" class="return_quantity_select">
            <template v-for="(numItem, index) in goodsItem.goodsReturnNumber">
              <option :key="index" :value="numItem">{{ numItem }}</option>
            </template>
          </select>
          <svg class="icon select_title-icon">
            <use xlink:href="#icon-lby_expand_arrow_down"></use>
          </svg>
        </div>
      </div>
    </div>
    <div v-if="formData.showDescribe" class="return_div">
      <p class="return_title">{{ nl('page_return_comments_required') }}</p>
      <textarea
        :placeholder="nl('page_placeholder_share_reason_min')"
        v-model="formData.note"
        :class="{ error: returnReasonData[goodsItem.recId].textError }"
        @focus="hideError()"
        maxlength="200"
        style="resize:vertical"
      ></textarea>
      <p style="margin-top:5px;">
        <strong style="color:var(--color-121212);text-transform: uppercase">{{ nl('page_size_note') }}</strong>
        {{ nl('page_return_no_policy_exception') }}
      </p>
    </div>
  </div>
</template>

<script>
import SelectReason from '@/components/order/SelectReason'
import { mapState } from 'vuex'
export default {
  name: 'ReturnReasonForm',
  components: {
    SelectReason
  },
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
      formData: {
        quantity: 1,
        note: '',
        reason: '',
        rec_id: '',
        showDescribe: false
      }
    }
  },
  computed: {
    ...mapState('order', ['returnReasonData']),
    needReturnReason() {
      return this.returnReasonData[this.goodsItem.recId] && this.returnReasonData[this.goodsItem.recId].needReturnReason
    }
  },
  watch: {
    formData: {
      handler(val, oldVal) {
        const tempReturnReasonData = Object.assign({}, this.returnReasonData)
        tempReturnReasonData[this.goodsItem.recId] = {
          ...tempReturnReasonData[this.goodsItem.recId],
          ...this.formData,
          rec_id: this.goodsItem.recId
        }
        this.$store.commit('order/setReturnReasonData', tempReturnReasonData)
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    getReasonsTemp(itemReason) {
      this.formData.showDescribe = false
      const needDescribeArr = []
      const IdArr = []
      const descArr = []
      itemReason.forEach((item) => {
        needDescribeArr.push(item.needDescribe)
        IdArr.push(item.id)
        descArr.push(item.reason)
      })
      if (needDescribeArr.includes(true)) this.formData.showDescribe = true
      this.$set(this.formData, 'reason', IdArr.join(', '))
      this.$set(this.formData, 'rec_id', this.goodsItem.recId)
      this.$set(this.formData, 'descArr', descArr.join(' | '))
    },
    hideError() {
      const returnReasonDataTemp = JSON.parse(JSON.stringify(this.returnReasonData))
      returnReasonDataTemp[this.goodsItem.recId].textError = false
      this.$store.commit('order/setReturnReasonData', returnReasonDataTemp)
    }
  }
}
</script>

<style lang="less" scoped>
.return-reason-form {
  position: relative;
  margin-top: 10px;
  .show_line {
    display: flex;
    align-items: center;
  }
  .content_box {
    display: flex;
    align-items: center;
    .title {
      font-size: 13px;
      color: var(--color-121212);
      line-height: 18px;
      margin-right: 10px;
      text-transform: capitalize;
    }
    .new_return_reason_select {
      box-sizing: border-box;
      width: 210px;
      height: 32px;
      padding: 0 30px 0 10px;
      margin-right: 30px;
      cursor: default;
      &:focus {
        background: #ffffff;
        &.rerror {
          background: var(--color-f1e9e6);
        }
      }
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .return_quantity_select_box {
      position: relative;
      width: 60px;
      height: 32px;
      margin-left: 0;
      .return_quantity_select {
        padding: 0 10px;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        width: 100%;
        height: 100%;
        border-color: #ccc;
        background: #fff;
        cursor: pointer;
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
      }
    }
  }
  .return_div {
    margin-top: 10px;
    .return_title {
      margin-bottom: 5px;
    }
    textarea {
      width: 106%;
      background-color: #fff;
      padding: 5px;
      color: var(--color-121212);
      background: #fff;
      border: 1px solid @border-color;
      line-height: 18px;
      &.error {
        background-color: var(--color-f1e9e6);
        border-color: var(--color-ff0000);
      }
    }
  }
}
</style>
