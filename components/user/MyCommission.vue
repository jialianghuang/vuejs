<template>
  <!-- My Account下的My Commission，销售佣金页面 -->
  <div class="my-commission">
    <ul>
      <li v-for="item in commissionList" :key="item.key">
        <p>{{ nl(item.key) }}</p>
        <h2 @click="handleChoose(item)" v-if="commissionData.estimatedSum">
          {{ Number(commissionData[item.value]) >= 0 ? '' : '-' }}US${{ Math.abs(commissionData[item.value]) }}
        </h2>
      </li>
    </ul>
    <p class="commission-tip">{{ nl('page_commission_description') }}</p>
    <!-- 订单详情弹窗 -->
    <div v-if="showDialog">
      <div class="dialog-layer"></div>
      <div class="dialog-content">
        <i @click="showDialog = false">×</i>
        <p>
          {{ nl(choosedCommission.key) }}:
          <span
            >{{ Number(commissionData[choosedCommission.value]) >= 0 ? '' : '-' }}US${{
              Math.abs(commissionData[choosedCommission.value])
            }}</span
          >
        </p>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th v-for="(item, i) of tableColumns" :key="i">
                  <span>{{ item.title }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) of tableData" :key="i" :class="{ 'grey-bg': i % 2 !== 0 }">
                <td v-for="data of tableColumns" :key="data.field">
                  <span>{{ item[data.field] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyCommission',
  data() {
    return {
      commissionList: [
        {
          key: 'page_commission_title',
          value: 'estimatedSum',
          list: 'estimatedList',
          trackEl: 'estimatedcommission'
        },
        {
          key: 'page_commission_content1',
          value: 'paidSum',
          list: 'paidList',
          trackEl: 'commissionpaid'
        },
        {
          key: 'page_commission_content2',
          value: 'unpaidSum',
          list: 'unpaidList',
          trackEl: 'commissionunpaid'
        }
      ],
      commissionData: {},
      choosedCommission: {},
      showDialog: false,
      tableMap: {},
      tableData: []
    }
  },
  computed: {
    tableColumns() {
      const list = [
        {
          title: this.nl('page_common_order_number'),
          field: 'orderSn',
          key: 'orderSn',
          fixed: 'left',
          width: 160
        },
        {
          title: this.nl('page_excel_type'),
          field: 'serialTypeName',
          key: 'serialTypeName',
          width: 130
        },
        {
          title: this.nl('page_goods_review_order_time'),
          field: 'orderTime',
          key: 'orderTime',
          width: 130
        },
        {
          title: this.nl('page_excel_delivery_time'),
          field: 'deliveryTime',
          key: 'deliveryTime',
          width: 130
        },
        {
          title: this.nl('page_excel_refund_time'),
          field: 'refundTime',
          key: 'refundTime',
          width: 130
        },
        {
          title: this.nl('page_excel_payment_amount'),
          field: 'orderAmount',
          key: 'orderAmount',
          width: 130
        },
        {
          title: this.nl('page_excel_commission_rate'),
          field: 'commissionRate',
          key: 'commissionRate',
          width: 130
        },
        {
          title: this.nl('page_excel_commission'),
          field: 'commissionAmount',
          key: 'commissionAmount',
          width: 130
        },
        {
          title: this.nl('page_common_status'),
          field: 'commissionStatusName',
          key: 'commissionStatusName',
          width: 130
        },
        {
          title: this.nl('page_excel_outstanding_returns'),
          field: 'hasRefund',
          key: 'hasRefund',
          width: 130
        }
      ]
      if (this.choosedCommission.value !== 'paidSum') {
        return list
      } else {
        return list.concat({
          title: this.nl('page_excel_payment_time'),
          field: 'paymentTime',
          key: 'paymentTime',
          width: 130
        })
      }
    }
  },
  created() {
    // 获取佣金数据及订单列表
    this.$axios.$get('/1.0/retailer-commission-sum').then((res) => {
      if (res.data) {
        this.commissionData = res.data.sumList || {}
        this.tableMap = res.data.commissionList || {}
      }
    })
  },
  methods: {
    handleChoose(item) {
      this.tableData = this.tableMap[item.list] || []
      if (this.tableData.length === 0) {
        return
      }
      this.choosedCommission = item || {}
      this.buryPoint(this, 'event', {
        ec: 'myaccount',
        el: item.trackEl,
        ea: 'click'
      })
      this.showDialog = true
    }
  }
}
</script>

<style lang="less" scoped>
.my-commission {
  font-family: @font-family-500;
  & > ul {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    width: 100%;
    & > li {
      width: 200px;
      height: 80px;
      padding: 25px;
      letter-spacing: 1px;
      background: url('https://cdn-1.azazie.com/upimg/userfiles/images/c2/2d/25b3608bc45661669ed68bc08246c22d.png') no-repeat;
      background-size: cover;
      &:first-child {
        width: 315px;
        background: url('https://cdn-1.azazie.com/upimg/userfiles/images/1e/99/5d60376cc683a509c4caba518d231e99.png') no-repeat;
        background-size: cover;
      }
      p {
        color: #d6d6d6;
        font-size: 14px;
        line-height: 19px;
      }
      h2 {
        margin-top: 10px;
        font-weight: bold;
        font-size: 24px;
        line-height: 33px;
        text-transform: uppercase;
        color: #f2d8a8;
        cursor: pointer;
        &:hover {
          text-decoration-line: underline;
        }
      }
    }
  }
  .commission-tip {
    margin-top: 15px;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: var(--color-999999);
  }
}
.dialog-layer {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: @popuy-z-index;
}
.dialog-content {
  position: fixed;
  padding: 40px;
  width: 1180px;
  top: 50%;
  left: 50%;
  z-index: @popuy-z-index;
  transform: translate(-50%, -50%);
  background: #fff;
  & > p {
    span {
      font-weight: 600;
    }
  }

  & > i {
    font-size: 30px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-style: normal;
    cursor: pointer;
    color: #999;
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .commission-table {
    margin-top: 20px;
  }
}
.table-container {
  margin-top: 20px;
  padding-left: -5px;
  width: 100%;
  max-height: 430px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #fff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #ccc;
  }
  table {
    border-collapse: collapse;
    color: var(--color-121212);
  }

  th,
  td {
    padding: 0px;
    text-align: center;
    width: 130px;
    min-width: 130px;
    height: 60px;
    font-size: 13px;
    background-color: #fff;
    &:first-child {
      position: sticky;
      left: 0px;
      z-index: 10;
      span {
        box-shadow: 3px 2px 8px -2px #ccc;
      }
    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 50px;
      padding: 5px;
    }
  }

  th {
    position: sticky;
    top: 0px;
    background-color: var(--color-f9f9f9);
    &:first-child {
      top: 0px;
    }
  }
  .grey-bg {
    background-color: var(--color-f9f9f9);
    td {
      background-color: var(--color-f9f9f9);
    }
  }
}
</style>
