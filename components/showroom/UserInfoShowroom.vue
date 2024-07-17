<template>
  <div class="user-info-showroom">
    <template v-if="!editInfo">
      <div class="header">
        <div class="title">{{ nl('page_common_showroom_my_profile') }}</div>
        <div
          v-track.click="{ common: { ec: 'showroom', el: 'edit' } }"
          @click="editShowroom()"
          v-if="showroomBaseInfo.isOwner"
          class="editor_div"
        >
          <span id="edit" class="editor_item for_guide_pos">
            {{ nl('page_common_edit') }}
          </span>
        </div>
      </div>
      <div class="content">
        <template v-if="showroomBaseInfo.isOwner">
          <div class="room-owner-icon">{{ showroomBaseInfo.roomShortName }}</div>
          <div class="room-owner-name">{{ showroomBaseInfo.roomName }}</div>
        </template>
        <template v-else>
          <template v-for="(item, index) in userList">
            <div v-if="item.userId == userId" :key="index">
              <div class="room-owner-icon">{{ item.shortName }}</div>
              <div class="room-owner-name">{{ item.userName }}</div>
            </div>
          </template>
        </template>
        <p v-show="showroomBaseInfo.weddingDate" class="wedding-date">
          <span>{{ nl('page_register_event_date') }}&nbsp;</span>
          <span class="wedding-date-dec">{{ showroomBaseInfo.weddingDate | dateFormat(datePickerLang) }}</span>
        </p>
        <div class="user-email">{{ showroomBaseInfo.email }}</div>
        <div class="visit-my-account">
          <a v-track.click="{ common: { ec: 'showroom', el: 'myaccount' } }" :href="countryUrl('/order/list')" target="_blank">
            {{ nl('page_common_showroom_visit_my_account') }}
          </a>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="header">
        <div class="title">{{ nl('page_common_showroom_edit_my_profile') }}</div>
      </div>
      <div class="content">
        <div class="input-box">
          <input id="room_name" v-model="showroomInfoEdit.room_name" type="text" class="text showroom-input" name="room_name" />
          <div class="wedding-date-select-box">
            <p class="wedding-date-select">
              <date-picker
                v-model="showroomInfoEdit.wedding_date"
                :append-to-body="false"
                :popup-style="{ top: '40px', zIndex: 1 }"
                :editable="false"
                :disabled-date="disabledDate"
                :clearable="false"
                :lang="datePickerLang"
                :format="dateFormatisplay"
                :input-attr="{ 'aria-label': 'date picker' }"
                type="date"
                placeholder=""
                class="data-picker-box"
                value-type="YYYY-MM-DD"
              ></date-picker>
            </p>
          </div>
        </div>
        <div class="editor-div">
          <span
            id="cancel"
            v-track.click="{ common: { ec: 'showroom', el: 'canceledit' } }"
            @click="editInfo = false"
            class="editor-item"
            >{{ nl('page_common_cancel') }}</span
          >
          <span id="save" v-track.click="{ common: { ec: 'showroom', el: 'saveedit' } }" @click="saveEditor()" class="editor-item">
            {{ nl('page_common_save') }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/fr'
import 'vue2-datepicker/locale/es'
import 'vue2-datepicker/locale/de'
import 'vue2-datepicker/locale/it'
import { dateFormatFn } from '@/assets/js/utils.js'

export default {
  name: 'UserInfoShowroom',
  components: { DatePicker },
  filters: {
    dateFormat: (s, l) => {
      return dateFormatFn(s, l)
    }
  },
  data() {
    return {
      editInfo: false,
      showroomInfoEdit: {}
    }
  },
  computed: {
    ...mapState('showroom', ['showroomBaseInfo', 'userList']),
    ...mapState('userInfo', ['showRoom']),
    datePickerLang() {
      // 备注： 处理 DatePicker 组件的语言设置。需要跟插件语言对上
      // 新增语言的话，需要 import 对应的语言包
      const datePickerLang = this.language || 'en' // 如果网站的语言缩写跟插件语言包对不上，需要单独设置，否则插件就直接默认英语了
      return datePickerLang
    }
  },
  watch: {
    showroomBaseInfo: {
      handler(val, oldVal) {
        if (this.showroomBaseInfo) {
          this.showroomInfoEdit = {
            wedding_date: this.showroomBaseInfo.weddingDate,
            room_name: this.showroomBaseInfo.roomName,
            showroom_id: this.showroomBaseInfo.showroomId
          }
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    disabledDate(current) {
      // Can not select days before today
      return current && current < this.$dayjs().startOf('day')
    },
    editShowroom() {
      this.editInfo = true
      if (this.showroomBaseInfo) {
        this.showroomInfoEdit = {
          wedding_date: this.showroomBaseInfo.weddingDate,
          room_name: this.showroomBaseInfo.roomName,
          showroom_id: this.showroomBaseInfo.showroomId
        }
      }
    },
    saveEditor() {
      const dateFlag = this.showroomInfoEdit.wedding_date == this.showroomBaseInfo.weddingDate
      const roomNameFlag = this.showroomBaseInfo.roomName.trim() === this.showroomInfoEdit.room_name.trim()
      // 名称为空且日期没变，为了减少一次请求，不处理直接return
      if (!this.showroomInfoEdit.room_name.trim() && dateFlag) {
        this.editInfo = false
        return false
      }
      const params = JSON.parse(JSON.stringify(this.showroomInfoEdit))
      // 名称没变，提交的时候清空名称，后端就不会修改名称，日期该咋样还咋样
      if (roomNameFlag) {
        params.room_name = ''
      }
      this.$axios
        .$put('/1.0/showroom/', params)
        .then((res) => {
          if (res.code == 0) {
            if (res.data) {
              const tempObj = {
                weddingDate: res.data.weddingDate,
                roomName: res.data.roomName,
                roomShortName: res.data.roomShortName
              }
              const showRoom = JSON.parse(JSON.stringify(this.showRoom))
              showRoom[0].roomName = res.data.roomName
              this.$store.commit('userInfo/setShowRooms', showRoom)
              this.$store.commit('showroom/setShowroomBaseInfo', {
                ...this.showroomBaseInfo,
                ...tempObj
              })
            }
          }
        })
        .finally(() => {
          this.editInfo = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.user-info-showroom {
  box-sizing: border-box;
  margin-bottom: 20px;
  border: 1px solid #eee;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-family: @font-family-600;
    height: 42px;
    border-bottom: 1px solid var(--color-eeeeee);
    padding: 0 15px;
    .editor_item {
      font-size: 13px;
      font-family: @font-family-500;
      color: #666;
      line-height: 18px;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .content {
    padding: 15px 15px 20px;
    .room-owner-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 5px;
      border-radius: 50%;
      background-color: var(--color-ede1d3);
      text-align: center;
      color: #ffffff;
      font-family: @font-family-600, sans-serif;
      font-size: 26px;
      line-height: 60px;
      text-transform: uppercase;
    }
    .room-owner-name {
      text-align: center;
      font-size: 18px;
      font-family: @font-family-600;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wedding-date {
      margin: 5px auto 0;
      text-align: center;
      span {
        display: inline-block;
      }
    }
    .user-email {
      margin-top: 5px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .visit-my-account {
      text-align: center;
      margin-top: 15px;
      a {
        font-size: 13px;
        font-family: @font-family-500;
        text-decoration: underline;
        color: var(--color-121212);
        line-height: 24px;
      }
    }
    .showroom-input {
      box-sizing: border-box;
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-bottom: 15px;
      border-color: #ccc;
      &:focus {
        background-color: #fff;
        border-color: var(--color-121212);
      }
    }
    .wedding-date-select-box {
      margin-bottom: 15px;
      .wedding-date-select {
        display: inline-block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border: 1px solid #ccc;
        border-radius: 0;
        background-color: #fff;
      }
      .data-picker-box {
        width: 100%;
        height: 40px;
        /deep/ .mx-input {
          height: 40px;
          line-height: 40px;
          border: none;
          border-radius: 0;
          background-color: #fff;
          border-color: #ccc;
          &:focus {
            border-color: var(--color-121212);
          }
        }
        &.error {
          /deep/ .mx-input {
            border-color: #f00;
          }
        }
      }
    }
    .editor-div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
      .for-guide-pos {
        visibility: hidden;
      }
      .editor-item {
        display: inline-block;
        flex: 1;
        height: 40px;
        background: var(--color-121212);
        border: 1px solid var(--color-121212);
        box-sizing: border-box;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        font-family: @font-family-600;
        color: #fffefe;
        text-transform: uppercase;
        cursor: pointer;
        margin-right: 10px;
        &#cancel {
          background: #ffffff;
          color: var(--color-121212);
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
