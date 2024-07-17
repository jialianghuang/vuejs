<template>
  <div :class="scene" class="mailbox-subscription">
    <az-select
      :options="roles"
      :defaultValue="roleKey"
      :width="160"
      :placeholder="nl('page_cyber_monday_identity')"
      @on-change="handleSelectChange"
    ></az-select>
    <div class="input-box">
      <div class="input-item">
        <input
          v-model="email"
          :placeholder="isFlashSalePage ? nl('page_email_your_email') : nl('page_lucky_wheel_placeholder_text')"
          :class="{ error: rulesRes.email }"
          @focus="onFocus"
          type="email"
          name="email"
        />
      </div>
      <p v-if="rulesRes.email" class="error-tip">{{ rulesRes.email ? rulesRes.email : nl('page_js_enter_valid_add') }}</p>
      <!-- <span class="required-prompt">*</span> -->
    </div>
    <az-button
      :loading="subscribeLoading"
      @click="subscribeSubmit"
      class="need_datalayer"
      data-datalayer-category="Newsletter_Click"
      data-datalayer-label="Newsletter_Click"
    >
      {{ buttonText }}
    </az-button>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import AzSelect from '@/components/az-ui/AzSelect'
import formValidatorType from '@/assets/js/formValidatorType'
import Schema from 'async-validator'

/**
 * 邮箱订阅组件
 * 用在az和bridal页面底部，以及free-swatch页面
 * 根据原有组件内相应逻辑抽出，本组件只做样式复用，具体数据交互逻辑在原有引用组件内
 */
export default {
  name: 'MailboxSubscription',
  components: {
    AzButton,
    AzSelect
  },
  props: {
    // 场景:az,bridal,freeSwatch
    scene: {
      type: String,
      default: 'az'
    },
    // 接口返回校验结果
    rulesResult: {
      type: String,
      default: ''
    },
    subscribeLoading: {
      type: Boolean,
      default: false
    },
    isFlashSalePage: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      validator: '',
      rulesRes: {
        email: ''
      },
      roles: [],
      roleKey: '',
      role: '',
      email: ''
    }
  },
  watch: {
    rulesResult(e) {
      this.rulesRes.email = e
    }
  },
  mounted() {
    const rules = {
      email: formValidatorType.email({ required: this.nl('page_js_enter_valid_add'), validator: this.nl('page_email_enter_valid') })
    }
    this.validator = new Schema(rules)

    if (this.scene !== 'freeSwatch') {
      this.buryPoint(this, 'event', {
        dp: 'home',
        ec: 'newsletter',
        el: 'signup',
        ea: 'view'
      })
    }
    this.getUserRoles()
    this.setPoint('customer', 'identity', 'view')
  },
  methods: {
    // 下拉选择修改获取对应的数据
    handleSelectChange(e) {
      this.roleKey = e.key
      this.role = e.name
      this.setPoint('customer', 'identity', 'click')
    },
    getUserRoles() {
      this.retentionReject()
      // 获取订阅用户身份接口
      this.$axios.$get('/1.0/email/subscribe-user-role').then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.roles = res.data.map((ele, idx) => {
            return {
              name: ele,
              key: idx
            }
          })
        }
      })
    },
    subscribeSubmit() {
      if (this.scene !== 'freeSwatch') {
        const msg = {}
        if (this.role) {
          msg.role = this.role
        }
        this.buryPoint(this, 'event', {
          dp: 'home',
          ec: 'newsletter',
          el: 'signup',
          ea: 'click',
          msg
        })
      }
      this.validator.validate(
        {
          email: this.email
        },
        (errors, fields) => {
          if (errors) {
            errors.map((item) => {
              if (!this.rulesRes[item.field]) {
                this.rulesRes[item.field] = item.message
              }
            })
            return false
          }
          this.$emit('on-submit', {
            email: this.email,
            role: this.role
          })
        }
      )
    },
    onFocus() {
      this.rulesRes.email = ''
      this.$emit('init-error')
    }
  }
}
</script>
<style lang="less" scoped>
.mailbox-subscription {
  display: flex;
  // align-items: center;
  /deep/ .az-select {
    align-items: unset;
  }
  /deep/ .az-select-main {
    border-color: @border-color;
    > .az-icon {
      width: 8px;
    }
    .az-select-options {
      border-color: @border-color;
    }
  }
  .input-box {
    margin: 0px 10px;
    .input-item {
      position: relative;
      &::after {
        content: '*';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: @theme-color;
      }
    }
  }
  input::-ms-clear {
    display: none;
  }
  input {
    width: 260px;
    height: 40px;
    line-height: 14px;
    color: var(--color-121212);
    outline: none;
    padding: 0 6px;
    background: #fff;
    border: solid 1px @border-color;
    box-sizing: border-box;
    &:focus {
      border: solid 2px @theme;
      padding: 10px 5px;
    }
    &.error {
      border: solid 1px #f00;
      background: var(--color-f9f9f9);
      padding: 10px 5px;
    }
  }
  button {
    padding: 0;
    width: 120px;
    height: 40px;
    overflow: hidden;
    line-height: 40px;
    border: none;
    color: #ffffff;
    background-color: var(--color-121212);
    text-transform: uppercase;
    font-family: @font-family-600;
  }
  .error-tip {
    max-width: 240px;
    color: #f00;
    font-style: normal;
    padding-top: 7px;
    text-transform: none;
    // position: absolute;
    text-align: left;
  }
  &.az {
    margin-left: 2%;
  }
  &.bridal {
    /deep/ .az-select-main {
      border-color: #050708;
      background: var(--color-f2e9e6);
      .az-select-options {
        border-color: #050708;
        background: var(--color-f2e9e6);
        li {
          &:hover {
            background: var(--color-f2e9e6);
          }
        }
      }
    }
    input {
      background: var(--color-f2e9e6);
      border-color: #050708;
    }
    button {
      background: var(--color-121212);
      color: #fff;
      font-family: @font-Ivy-Mode-400;
    }
  }
  &.freeSwatch {
    margin-top: 30px;
    .input-box {
      margin: 0px 5px;
    }
    input {
      width: 240px;
    }
  }
}
</style>
