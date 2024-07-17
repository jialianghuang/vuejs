<template>
  <div class="coming_soon_div">
    <div class="coming_soon_form">
      <button @click="showInput" :class="{ show: !isInputShow }" class="btn btn_cs_notify" type="button">
        {{ nl('page_come_soon_text1') }}
      </button>
      <input
        :placeholder="nl('page_placeholder_enter_email')"
        v-model="subscribeMail"
        :class="[{ show: isInputShow }, { error: errorTipShow }]"
        @focus="onChange"
        @blur="onChange"
        class="_remind_email"
        type="text"
        name="email"
        autocomplete="off"
      />
      <div v-if="errorTipShow" class="cs_remind_email_err">{{ nl('page_js_change_email_check_email_new') }}</div>
      <button :class="{ show: isInputShow }" @click="subscribeSubmit" class="_remind_me" aria-label="remind me"></button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ComeSoon',
  languageKeys: ['page_come_soon_text1', 'page_placeholder_enter_email', 'page_js_change_email_check_email_new'],
  props: {
    soonCatId: {
      type: Number,
      default: 0
    },
    goodsId: {
      type: [String, Number], // 兼容，避免语法校验错误
      default: ''
    }
  },
  data() {
    return {
      subscribeMail: '',
      errorTipShow: false,
      isInputShow: false
    }
  },
  computed: {
    ...mapState({})
  },
  mounted() {},
  methods: {
    showInput() {
      this.isInputShow = true
    },
    onChange() {
      this.errorTipShow = false
    },
    subscribeSubmit() {
      if (this.emailFormCheck(this.subscribeMail)) {
        const formData = new FormData()
        formData.set('cs_remind_email', this.subscribeMail)
        formData.set('goods_id', this.goodsId)
        this.retentionReject()
        this.$axios.$post(`/1.0/email/coming-soon`, formData).then((res) => {
          if (res.code == 0) {
            this.errorTipShow = false
            this.setDataLayer({
              action: '',
              category: 'PC_DetailPageRevision',
              label: `ComingSoonSaveRemindEmailSuccess`
            })
            if (this.soonCatId == 2) {
              this.setDataLayer({
                action: '',
                category: 'PC_DetailPageRevision',
                label: `BG_ComingSoonDetailSaveRemindEmailSuccess`
              })
            } else if (this.soonCatId == 6) {
              this.setDataLayer({
                action: '',
                category: 'PC_DetailPageRevision',
                label: `Veils_ComingSoonDetailSaveRemindEmailSuccess`
              })
            }
          } else {
            this.setDataLayer({
              action: '',
              category: 'PC_DetailPageRevision',
              label: `ComingSoonSaveRemindEmailErr`
            })
            if (this.soonCatId == 2) {
              this.setDataLayer({
                action: '',
                category: 'PC_DetailPageRevision',
                label: `BG_ComingSoonDetailSaveRemindEmailErr`
              })
            } else if (this.soonCatId == 6) {
              this.setDataLayer({
                action: '',
                category: 'PC_DetailPageRevision',
                label: `Veils_ComingSoonDetailSaveRemindEmailErr`
              })
            }
          }
          alert(res.data)
        })
      } else {
        this.errorTipShow = true
        this.setDataLayer({
          action: '',
          category: 'PC_DetailPageRevision',
          label: `ComingSoonSaveRemindEmailErr`
        })
        if (this.soonCatId == 2) {
          this.setDataLayer({
            action: '',
            category: 'PC_DetailPageRevision',
            label: `BG_ComingSoonDetailSaveRemindEmailErr`
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.coming_soon_div {
  margin-top: 13px;
  .coming_soon_form {
    position: relative;
    width: 210px;
    margin: 0 auto;
    .btn_cs_notify {
      width: 100%;
      height: 40px;
      border: 1px solid var(--color-121212);
      background-color: #ffffff;
      padding: 0;
      font-family: @font-family-600;
      font-size: 13px;
      color: var(--color-121212);
      display: none;
      &.show {
        display: block;
      }
    }
    ._remind_email {
      width: 100%;
      height: 38px;
      box-sizing: border-box;
      padding: 0 5px;
      border: 1px solid @border-color;
      display: inline-block;
      border-color: rgb(214, 142, 150);
      display: none;
      &.show {
        display: block;
      }
      &.error {
        border-color: rgb(255, 0, 0);
      }
    }
    ._remind_me {
      position: absolute;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      right: 10px !important;
      top: 6px;
      border: none;
      outline: none;
      background: data-uri('~assets/images/a_sprite_l_20190128.png') 0 -234px no-repeat;
      display: none;
      &.show {
        display: block;
      }
    }
    .cs_remind_email_err {
      color: rgb(255, 0, 0);
      text-align: left;
    }
  }
}
</style>
