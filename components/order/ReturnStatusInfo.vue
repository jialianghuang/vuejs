<template>
  <div class="order-b return-status-info">
    <div class="return-status-title">{{ nl('page_logistics_return_status') }}</div>

    <div class="return-status-info-content">
      <div class="return-status-info-box">
        <!-- 左侧退货状态 -->
        <div class="status-info-left">
          <div class="status-info">
            <div class="status-desc">
              <div v-html="returnApplyInfo.applyStatusTitle" class="status-desc-title"></div>
              <template v-if="currentStatusInfo.processDesc">
                <div
                  v-for="(item, index) in currentStatusInfo.processDesc"
                  v-html="item"
                  :key="`status-desc-txt_${index}`"
                  class="status-desc-txt"
                ></div>
              </template>
            </div>
          </div>
          <div class="order-option">
            <!-- view return label 点击后打开return label的pdf，可以下载。 -->
            <!-- 二次退货：view RMA -->
            <a v-if="returnLabels && returnLabels.pdfUrl" :href="returnLabels.pdfUrl" target="_blank">
              <az-button :needIcon="false" class="btn btn-default order-option-btn">
                {{ returnLabels.returnType === 'rma_2' ? nl('page_orders_view_rma') : nl('page_orders_return_label') }}
              </az-button>
            </a>
          </div>

          <!-- happy return 退货 -->
          <template
            v-if="
              returnApplyInfo.returnMethod === 'happy_return' &&
                extensionsInfo &&
                Object.keys(extensionsInfo).length &&
                extensionsInfo.happy_returns_confirmation_code_img
            "
          >
            <div class="hr-box">
              <div class="hr-info-box">
                <div class="code item">{{ nl('page_orders_express_code') }}: {{ extensionsInfo.happy_returns_confirmation_code }}</div>
                <div class="img-box item">
                  <img
                    :src="extensionsInfo.happy_returns_confirmation_code_img"
                    @click="showPreview = true"
                    class="code-img"
                    alt="azazie"
                  />
                </div>
                <div @click="handleDownload(extensionsInfo.happy_returns_confirmation_code_img)" class="download item">
                  <az-icon class="download-icon" icon-class="icon-download"></az-icon>
                  <span class="txt">{{ nl('page_orders_download_qrcode') }}</span>
                </div>
              </div>
            </div>
            <div class="order-option hr-option">
              <!-- See all location，点击跳转happyreturn页面 -->
              <a
                v-if="extensionsInfo.happy_returns_see_all_locations_url"
                :href="extensionsInfo.happy_returns_see_all_locations_url"
                target="_blank"
              >
                <az-button :needIcon="false" class="btn btn-default order-option-btn">
                  {{ nl('page_orders_happy_returned_see_all') }}
                </az-button>
              </a>
              <!-- Send to another email，点击跳转happyreturn页面 -->
              <!-- <a
                v-if="extensionsInfo.happy_returns_send_to_another_email_url"
                :href="extensionsInfo.happy_returns_send_to_another_email_url"
                target="_blank"
                class="link-box"
                >{{ nl('page_orders_happy_returned_send_email') }}</a
              > -->
            </div>
          </template>
        </div>

        <!-- 右侧订单金额模块 -->
        <div v-if="returnSummaryInfo && Object.keys(returnSummaryInfo).length" class="status-info-right">
          <return-status-summary
            :returnSummaryInfo="returnSummaryInfo"
            :isCompleteApply="!!isCompleteApply"
            class="pay-summary-block"
          ></return-status-summary>
        </div>
      </div>
      <!-- 进度条-->
      <div class="return-status-progress">
        <return-status-progress :returnApplyInfo="returnApplyInfo" :returnApplyProcess="returnApplyProcess"></return-status-progress>
      </div>
    </div>
    <template v-if="showPreview && extensionsInfo.happy_returns_confirmation_code_img">
      <az-overlay @click="showPreview = false" :z-index="12">
        <div class="preview-box">
          <img :src="extensionsInfo.happy_returns_confirmation_code_img" class="img" />
        </div>
      </az-overlay>
    </template>
  </div>
</template>

<script>
import ReturnStatusProgress from '@/components/order/ReturnStatusProgress'
import ReturnStatusSummary from '@/components/order/ReturnStatusSummary'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzOverlay from '@/components/az-ui/Overlay/AzOverlay'
export default {
  name: 'ReturnStatusInfo',
  components: { ReturnStatusProgress, ReturnStatusSummary, AzButton, AzOverlay },
  props: {
    returnApplyInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    returnApplyProcess: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showPreview: false,
      showPdf: false
    }
  },
  computed: {
    currentStatusInfo() {
      // 当前的状态信息
      let currentStatusInfo = {}
      this.returnApplyProcess.forEach((item, index) => {
        if (this.returnApplyInfo.applyStatus == item.processStatus) {
          currentStatusInfo = item
        }
      })
      return currentStatusInfo
    },
    returnSummaryInfo() {
      if (this.returnApplyInfo.returnInfo && this.returnApplyInfo.returnAmountInfo) {
        // 退款金额明细，处理退款以及完成退款阶段取实际金额，其他取预计金额
        // 优先取 return_apply_amount_final 字段
        return this.returnApplyInfo.returnAmountInfo.return_apply_amount_final &&
          Object.keys(this.returnApplyInfo.returnAmountInfo.return_apply_amount_final).length
          ? this.returnApplyInfo.returnAmountInfo.return_apply_amount_final
          : this.returnApplyInfo.returnAmountInfo.return_apply_amount_preview
      }
      return {}
    },
    isCompleteApply() {
      // applyStatus ：   N:新建，A:通过，C:取消，拒绝，S买家退货，R:退货签收，F:确认收货入库，P:处理退款，I退款完成, U:流程受阻
      // 是否展示已完成退款。根据 returnSummaryInfo 取的字段为准
      if (this.returnApplyInfo.returnInfo && this.returnApplyInfo.returnAmountInfo) {
        return (
          this.returnApplyInfo.returnAmountInfo.return_apply_amount_final &&
          Object.keys(this.returnApplyInfo.returnAmountInfo.return_apply_amount_final).length
        )
      }
      return false
    },
    extensionsInfo() {
      return this.returnApplyInfo.extensions || {}
    },
    returnLabels() {
      let returnLabels = {}
      if (
        this.returnApplyInfo.applyStatus === 'S' &&
        this.currentStatusInfo.processData &&
        this.currentStatusInfo.processData.returnLabels
      ) {
        returnLabels = this.currentStatusInfo.processData.returnLabels
      }
      return returnLabels
    }
  },
  mounted() {},
  methods: {
    linkToMore(el, url, bol) {
      this.setBuryPoint(el)
      if (bol) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'wd-lookbook')
        document.body.appendChild(link)
        link.click()
      } else {
        window.open(this.countryUrl(url), '_blank')
      }
    },
    handleDownload(url, name) {
      if (!url) return
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', name || 'AZAZIE')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>

<style lang="less" scoped>
.return-status-info-content {
  padding: 15px;
  .return-status-info-box {
    display: flex;
    .status-info-left {
      flex: 1;
      margin-right: 30px;
    }
    .status-info-right {
      width: 240px;
    }
    .status-info {
      .status-desc {
        .status-desc-title {
          font-size: 16px;
          line-height: 22px;
          text-transform: uppercase;
          color: var(--color-121212);
          font-family: @font-family-600;
        }
        .status-desc-txt {
          font-size: 13px;
          line-height: 18px;
          margin-top: 10px;
          color: var(--color-121212);
        }
      }
    }
    .hr-box {
      .hr-info-box {
        display: flex;
        border: 1px solid var(--color-eeeeee);
        height: 70px;
        box-sizing: border-box;
        margin-top: 10px;
        .item {
          flex: 1;
          border-right: 1px solid var(--color-eeeeee);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          &:last-child {
            border-right: none;
          }
        }
        .img-box {
          .code-img {
            width: 50px;
            height: 50px;
            vertical-align: middle;
            cursor: pointer;
          }
        }
        .code {
          font-size: 13px;
          line-height: 18px;
          text-align: center;
          color: var(--color-121212);
          font-family: @font-family-600;
        }
        .download {
          cursor: pointer;
          .download-icon {
            font-size: 16px;
            margin-right: 5px;
            vertical-align: middle;
          }
          .txt {
            font-size: 13px;
            line-height: 18px;
            text-decoration-line: underline;
            color: var(--color-121212);
          }
        }
      }
    }
    .order-option {
      &.hr-option {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      .order-option-btn {
        margin-top: 10px;
        width: 240px;
      }
      .link-box {
        margin-top: 10px;
        font-size: 13px;
        line-height: 18px;
        text-align: center;
        text-decoration-line: underline;
        color: var(--color-121212);
        display: inline-block;
        margin-left: 15px;
      }
    }
  }

  .return-status-progress {
    margin-top: 15px;
    border-top: 1px solid #eee;
  }
}
.preview-box {
  padding: 20px;
  background: #fff;
  .img {
    width: 200px;
    height: 200px;
  }
}
</style>
