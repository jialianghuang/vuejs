<template>
  <div id="popup_samples_extension" v-if="popupSamplesExtensionShow">
    <az-popup-layer @close="closeDialog()" :zIndex="12" :width="`460px`" :height="extendSampleDays * 1 > 0 ? `248px` : `308px`">
      <div class="samples-extension-content">
        <template v-if="extendSampleDays * 1 > 0">
          <az-icon class="icon icon-ok" icon-class="icon-ok" />
          <p class="tip-success">
            {{ nl('page_order_samples_extenison_success_1') }}
            <span id="extend_sample_days">{{ extendSampleDays }}</span>
            {{ nl('page_order_samples_extenison_success_2') }}<br />
          </p>
        </template>
        <template v-else>
          <p class="title">{{ nl('page_order_samples_extenison_title') }}</p>
          <div :class="{ error: isError }" class="extension-select-block">
            <div @click="showSelectList()" tabindex="0" aria-label="select" class="select-block">
              <input
                v-model="dayOptions[currentIndex]"
                :placeholder="nl('page_come_select_time')"
                name="input_extension_time"
                readonly=""
              />
              <az-icon class="icon select-title-icon" icon-class="icon-lby_expand_arrow_down" />
            </div>
            <span class="help-inline">{{ nl('page_order_samples_extenison_select_time') }}</span>
            <div :class="{ show: selectListShow }" class="select-list">
              <div
                v-for="(item, index) in dayOptions"
                :key="index"
                @click="selectOption(index)"
                class="select-item"
                role="button"
                tabindex="0"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <p class="tips">
            <span>{{ nl('page_size_note') }}</span> {{ nl('page_order_samples_extenison_note_tips') }}
          </p>
          <az-button @click="confirmSelect()" class="btn btn-default btn-samples-extension">{{ nl('page_common_confirm') }}</az-button>
        </template>
      </div>
    </az-popup-layer>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzPopupLayer from '@/components/az-ui/Popup/AzPopupLayer'
export default {
  name: 'PopupSamplesExtension',
  components: { AzButton, AzPopupLayer },
  props: {
    orderSn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentIndex: -1,
      selectListShow: false,
      isError: false
    }
  },
  computed: {
    ...mapState('order', ['popupSamplesExtensionShow', 'extendSampleDays']),
    dayOptions() {
      const dayOptions = []
      for (let i = 0; i < 10; i++) {
        const extensionTime = i + 1
        dayOptions.push(extensionTime + (extensionTime == 1 ? this.nl('page_common_day') : this.nl('page_common_days')))
      }
      return dayOptions
    }
  },
  watch: {
    popupSamplesExtensionShow: {
      handler(val) {
        if (process.client) {
          this.setMessageZindex(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    showSelectList() {
      this.selectListShow = true
    },
    selectOption(index) {
      this.currentIndex = index
      this.selectListShow = false
    },
    closeDialog() {
      this.$store.commit('order/setPopupSamplesExtensionShow', false)
      this.$emit('onClose', true)
    },
    confirmSelect() {
      const days = this.currentIndex * 1 + 1
      if (days <= 0) {
        this.isError = true
        return false
      }
      this.$axios.$post(`/1.0/order/extend-sample-days`, { order_sn: this.orderSn, extend_day: days }).then((res) => {
        if (res.code == 0) {
          this.$store.commit('order/setExtendSampleDays', days)
          this.$emit('setOrderExtendSampleDays', { sampleOrderSn: this.orderSn, extendSampleDays: days })
        } else {
          alert(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#popup_samples_extension {
  .samples-extension-content {
    width: 380px;
    height: 178px;
    padding: 30px 40px 20px;
    .title {
      font-size: 13px;
      font-family: @font-family-600;
      font-weight: 600;
      color: var(--color-121212);
      text-transform: uppercase;
    }
    .extension-select-block {
      margin: 8px 0 10px;
      position: relative;
      .select-block {
        width: 100%;
        height: 40px;
        border: 1px solid @border-color;
        box-sizing: border-box;
        position: relative;
        cursor: pointer;
        input {
          line-height: 38px;
          width: 100%;
          box-sizing: border-box;
          border: none;
          padding-left: 10px;
          cursor: pointer;
        }
        .select-title-icon {
          position: absolute;
          top: 12px;
          right: 10px;
          z-index: 2;
          font-size: 10px;
          width: 13px;
          height: 13px;
        }
      }
      .select-list {
        display: none;
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #ccc;
        box-shadow: 0px 2px 3px 0px rgba(51, 51, 51, 0.3);
        &.show {
          display: block;
          height: 200px;
          overflow: auto;
        }
        .select-item {
          line-height: 40px;
          padding: 0 10px;
          cursor: pointer;
          &:hover {
            background: #f6f6f6;
          }
        }
      }
      .help-inline {
        color: #f00;
        margin-top: 3px;
        display: none;
      }
      &.error {
        .select-block {
          border: 1px solid var(--color-ff0000);
        }
        .help-inline {
          display: block;
        }
      }
    }
    .tips {
      font-size: 13px;
      font-family: @font-family-500;
      span {
        color: var(--color-121212);
      }
    }
    .btn-samples-extension {
      width: 100%;
      height: 50px;
      margin-top: 18px;
    }
    .icon-ok {
      width: 60px;
      height: 60px;
      margin: auto;
      display: block;
    }
    .tip-success {
      font-size: 13px;
      margin: 13px;
      text-align: center;
    }
  }
}
</style>
