<template>
  <div id="coming_soon_div" v-if="baseInfo.isComingSoon">
    <ul class="prod-info-styles">
      <li>
        <p class="label-line">
          <label for="_color" class="blockLabel">
            {{ nl('page_common_color') }}: <strong>{{ baseInfo.shownColor }}</strong></label
          >
        </p>
      </li>
    </ul>
    <p class="coming_soon_remind new_coming_soon_remind">
      *
      {{ baseInfo.catId == '6' ? nl('page_coming_soon_remind_veil') : baseInfo.comingSoonInfo && baseInfo.comingSoonInfo.txt }}
    </p>

    <div id="orderField" class="clearfix">
      <div id="coming_soon_form" name="coming_soon_form">
        <input
          id="cs_remind_email"
          :placeholder="nl('page_placeholder_enter_email')"
          v-model="subscribeMail"
          class="_remind_email"
          type="text"
          name="email"
          autocomplete="off"
        />
        <div id="cs_remind_email_err" v-if="errorTipShow" class="cs_remind_email_err">{{ nl('page_js_change_email_check_email_new') }}</div>
        <button id="_remind_me" @click="subscribeSubmit" class="btn btn-theme">
          {{ nl('page_comming_soon_remind_me_button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComeSoon',
  languageKeys: [
    'page_common_color',
    'page_coming_soon_remind_veil',
    'page_placeholder_enter_email',
    'page_js_change_email_check_email_new',
    'page_comming_soon_remind_me_button'
  ],
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      subscribeMail: '',
      errorTipShow: false
    }
  },
  mounted() {
    if (this.baseInfo.isComingSoon) {
      if (this.baseInfo.catId == 2) {
        this.setDataLayer({
          action: 'view',
          category: 'PC_DetailPageRevision',
          label: `BG_ComingSoonDetailPage_View`
        })
      } else if (this.baseInfo.catId == 6) {
        this.setDataLayer({
          action: 'view',
          category: 'PC_DetailPageRevision',
          label: `VeilsDetailPage_View`
        })
      }
    }
  },
  methods: {
    subscribeSubmit() {
      if (this.emailFormCheck(this.subscribeMail)) {
        const formData = new FormData()
        formData.set('cs_remind_email', this.subscribeMail)
        formData.set('goods_id', this.baseInfo.goodsId)
        this.retentionReject()
        this.$axios.$post(`/1.0/email/coming-soon`, formData).then((res) => {
          if (res.code == 0) {
            this.errorTipShow = false
            this.setDataLayer({
              action: '',
              category: 'PC_DetailPageRevision',
              label: `ComingSoonSaveRemindEmailSuccess`
            })
            if (this.baseInfo.catId == 2) {
              this.setDataLayer({
                action: '',
                category: 'PC_DetailPageRevision',
                label: `BG_ComingSoonDetailSaveRemindEmailSuccess`
              })
            } else if (this.baseInfo.catId == 6) {
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
            if (this.baseInfo.catId == 2) {
              this.setDataLayer({
                action: '',
                category: 'PC_DetailPageRevision',
                label: `BG_ComingSoonDetailSaveRemindEmailErr`
              })
            } else if (this.baseInfo.catId == 6) {
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
        if (this.baseInfo.catId == 2) {
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
#coming_soon_div {
  margin-top: 10px;
  padding: 10px;
  background-color: var(--color-f9f9f9);
  //width: 430px;
  .coming_soon_remind {
    margin-top: 10px;
    line-height: 21px;
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
  }
  #orderField {
    ._remind_email {
      margin-top: 25px;
      width: 207px;
      height: auto;
      line-height: 18px;
      border: 1px solid @border-color;
      color: var(--color-121212);
      padding: 10px 5px;
      background: #fff;
    }
    #_remind_me {
      padding: 13px 10px;
      margin-top: 10px;
      background: var(--color-121212);
      color: #fff;
      border: none;
      text-transform: uppercase;
      display: block;
      width: 186px;
    }
    .cs_remind_email_err {
      color: #f00;
      margin: 12px 0 13px;
    }
  }
}
</style>
