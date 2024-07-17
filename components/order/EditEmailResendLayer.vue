<template>
  <div>
    <az-popup-layer :zIndex="12" @close="closeLayer()" width="auto" height="auto" class="edit-email-resend-dialog">
      <div class="edit-email-resend-dialog-content">
        <div class="title">{{ nl('page_order_detail_card_email_resend') }}</div>
        <div class="email-list">
          <template v-for="(item, index) in emailListData">
            <div :key="`${index}`" class="email-item">
              <input
                v-model="item.email"
                :disabled="!item.isEdit"
                @blur="handleBlur(item.email, index)"
                @focus="handleFocus(item.email, index)"
                type="text"
                class="email-ipt"
              />
              <div @click="handleEmailAct(item, index)" class="act-box">
                {{ item.isEdit ? nl('page_common_save') : nl('page_common_edit') }}
              </div>
            </div>
            <div :key="`${index}_tip`" v-if="item.errFlag" class="error-tip">{{ item.errFlag }}</div>
          </template>
        </div>
        <div class="btns">
          <az-button
            @click="closeLayer()"
            :text="nl('page_common_cancel')"
            :textColor="'var(--color-666666)'"
            :color="'#fff'"
            class="btn cancel"
          ></az-button>
          <az-button
            @click="handleConfirm()"
            :text="isResend ? nl('page_common_resend') : nl('page_common_confirm')"
            :loading="loading"
            class="btn confirm"
          ></az-button>
        </div>
      </div>
    </az-popup-layer>
  </div>
</template>

<script>
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
import AzButton from '@/components/az-ui/AzButton'
import Schema from 'async-validator'
import formValidatorType from '@/assets/js/formValidatorType'
import { mapState } from 'vuex'

export default {
  name: 'EditEmailResendLayer',
  components: {
    AzPopupLayer,
    AzButton
  },
  props: {},
  data() {
    return {
      emailListData: [],
      loading: false
    }
  },
  computed: {
    ...mapState('order', ['editEmailResendLayerShow', 'currentGiftCarInfo']),
    isEditEmail() {
      return this.editEmailResendLayerShow === 'editEmail'
    },
    isResend() {
      return this.editEmailResendLayerShow === 'resend'
    }
  },
  created() {
    if (this.isEditEmail) {
      // 编辑
      const emailList =
        this.currentGiftCarInfo.giftCard && this.currentGiftCarInfo.giftCard.toUser ? this.currentGiftCarInfo.giftCard.toUser : []
      // 处理拿到的数据成前端要的格式
      this.emailListData = emailList.map((item) => {
        return {
          email: item,
          isEdit: false,
          errFlag: '',
          key: item
        }
      })
    } else if (this.isResend) {
      // resend
      const emailList = this.currentGiftCarInfo.giftCardInfo || []
      this.emailListData = []
      emailList.forEach((item) => {
        if (!item.status) {
          //  status: 0 未激活；1 已激活； 2 禁用
          this.emailListData.push({
            ...item,
            isEdit: false,
            errFlag: ''
          })
        }
      })
    }
  },
  methods: {
    closeLayer() {
      this.$store.commit('order/setEditEmailResendLayerShow', false)
    },
    handleEmailAct(item, index) {
      if (item.errFlag == this.nl('page_order_gift_card_edit_email_error_tip')) {
        // 当前处于编辑状态，需要保存
        item.errFlag = false
      }
      this.emailCheck(item.email, index)
      if (item.isEdit) {
        if (item.errFlag) {
          return false
        }
      }
      item.isEdit = !item.isEdit
    },
    /**
     * 提交
     */
    handleConfirm() {
      let hasErr = false
      this.emailListData.forEach((item, index) => {
        if (item.isEdit) {
          // 未保存
          this.$set(this.emailListData[index], 'errFlag', this.nl('page_order_gift_card_edit_email_error_tip'))
          hasErr = true
        } else if (item.errFlag) {
          hasErr = true
        }
      })
      if (hasErr) return false
      // 校验完成后，请求接口
      if (this.isEditEmail) {
        // edit email
        const emails = this.emailListData.map((item) => {
          return item.email
        })
        const params = {
          order_sn: this.currentGiftCarInfo.orderSn,
          emails
        }
        this.loading = true
        this.$axios
          .$post(`/1.0/order/gift-card-edit-email`, params)
          .then((res) => {
            this.loading = false
            if (res.code == 0) {
              this.updateEmail(this.emailListData)
              alert(res.msg)
              this.$emit('refreshOrder')
              this.closeLayer()
            } else {
              alert(res.msg)
            }
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
          })
      } else if (this.isResend) {
        // 请求接口重发 发送成功后弹窗显示操作成功 alert()
        // 用户只能同一个订单resend5次，超过5次后再次点击resend，弹窗显示当前操作异常，请联系客服（如下图右弹窗）
        const emails = this.emailListData.map((item) => {
          return {
            email: item.email,
            card_id: item.card_id
          }
        })
        const params = {
          resend: emails
        }
        this.loading = true
        this.$axios
          .$post(`/1.0/order/gift-card-resend`, params)
          .then((res) => {
            this.loading = false
            if (res.code == 0) {
              alert(res.msg)
              this.$emit('refreshOrder')
              this.closeLayer()
            } else if (res.code == 800505) {
              this.closeLayer()
              this.$nextTick(() => {
                this.$store.commit('order/setResendUnusalLayerShow', true)
              })
            } else {
              this.closeLayer()
              alert(res.msg)
            }
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
          })
      }
    },
    /**
     * 失去焦点之后校验email
     */
    handleBlur(email, index) {
      this.emailCheck(email, index)
    },
    /**
     * 获取焦点清空错误信息
     */
    handleFocus(email, index) {
      this.$set(this.emailListData[index], 'errFlag', false)
    },
    /**
     * 单个邮箱校验Fn
     */
    emailCheck(_email, index) {
      const rules = {
        email: formValidatorType.email({ required: this.nl('page_login_eamil_required'), validator: this.nl('page_email_enter_valid') })
      }
      this.emailValidator = new Schema(rules)
      this.emailValidator.validate(
        {
          email: _email
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              this.$set(this.emailListData[index], 'errFlag', item.message)
            })
          }
        }
      )
    },
    updateEmail(newList = []) {
      if (this.currentGiftCarInfo.giftCard && this.currentGiftCarInfo.giftCard.toUser) {
        for (let i = 0; i < newList.length; i++) {
          const item = newList[i]
          ;(this.currentGiftCarInfo.giftCard.toUser || []).forEach((email, index, arr) => {
            if (email == item.key) {
              arr[index] = item.email
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.edit-email-resend-dialog {
  .edit-email-resend-dialog-content {
    width: 365px;
    .title {
      font-size: 14px;
      line-height: 19px;
      font-family: @font-family-600;
    }
    .email-list {
      max-height: calc(~'90vh - 150px');
      overflow-y: auto;
      box-sizing: border-box;
      .email-item {
        display: flex;
        height: 40px;
        line-height: 38px;
        border: 1px solid var(--color-cccccc);
        font-size: 13px;
        color: var(--color-121212);
        margin-top: 10px;
        box-sizing: border-box;
        .email-ipt {
          flex: 1;
          border: none;
          padding: 10px;
          &:disabled {
            background: var(--color-eeeeee);
          }
        }
        .act-box {
          width: 120px;
          border-left: 1px solid var(--color-cccccc);
          text-align: center;
          text-transform: uppercase;
          cursor: pointer;
        }
      }
      .error-tip {
        font-size: 13px;
        line-height: 18px;
        color: var(--color-ff0000);
        margin-top: 5px;
      }
    }
    .btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      .btn {
        width: calc((100% - 15px) / 2);
        height: 40px;
        line-height: 38px;
        font-size: 14px;
        font-family: @font-family-600;
        text-transform: uppercase;
        &.cancel {
          border: 1px solid var(--color-cccccc);
        }
      }
    }
  }
}
</style>
