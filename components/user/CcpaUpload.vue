<template>
  <div class="ccpa-upload">
    <svg aria-hidden="true" style="position: absolute; width: 0px; height: 0px; overflow: hidden;">
      <symbol id="icon-ccpa_close" viewBox="0 0 8 8">
        <g id="icon-ccpa_close" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-1277.000000, -463.000000)" fill="var(--color-666666)" fill-rule="nonzero">
            <g transform="translate(1016.000000, 453.000000)">
              <polygon
                points="269 10.8844221 268.105528 10 265 13.1055276 261.884422 10 261 10.8844221 264.105528 14 261 17.1055276 261.884422 18 265 14.8844221 268.105528 18 269 17.1055276 265.884422 14"
              ></polygon>
            </g>
          </g>
        </g>
      </symbol>
      <symbol id="icon-ccpa_file" viewBox="0 0 16 18">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-1021.000000, -458.000000)">
            <g transform="translate(1016.000000, 453.000000)">
              <g transform="translate(5.000000, 5.000000)">
                <path
                  d="M10.8066536,0.5 L15.5,5.31709878 L15.5,17.5 L0.5,17.5 L0.5,0.5 L10.8066536,0.5 Z"
                  stroke="var(--color-666666)"
                ></path>
                <polygon
                  fill="var(--color-666666)"
                  fill-rule="nonzero"
                  points="11.4237535 0.614594111 11.423 4.725 15.196356 4.72501965 15.196356 5.72501965 10.4237535 5.72501965 10.4237535 0.614594111"
                ></polygon>
                <rect fill="var(--color-666666)" x="3" y="7" width="10" height="1"></rect>
                <rect fill="var(--color-666666)" x="3" y="10" width="10" height="1"></rect>
                <rect fill="var(--color-666666)" x="3" y="13" width="10" height="1"></rect>
              </g>
            </g>
          </g>
        </g>
      </symbol>
      <symbol id="icon-ccpa_select" viewBox="0 0 10 10">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-1276.000000, -495.000000)" fill="var(--color-5fa452)" fill-rule="nonzero">
            <g transform="translate(1016.000000, 486.000000)">
              <g transform="translate(260.000000, 9.000000)">
                <path
                  d="M5,0 C2.23857625,0 0,2.23857625 0,5 C0,7.76142375 2.23857625,10 5,10 C7.76142375,10 10,7.76142375 10,5 C10,2.23857625 7.76142375,0 5,0 Z M5,9.16666667 C2.69881354,9.16666667 0.83333333,7.30118646 0.83333333,5 C0.83333333,2.69881354 2.69881354,0.83333333 5,0.83333333 C7.30118646,0.83333333 9.16666667,2.69881354 9.16666667,5 C9.16666667,6.10506871 8.72767983,7.16487668 7.94627826,7.94627826 C7.16487668,8.72767983 6.10506871,9.16666667 5,9.16666667 Z"
                ></path>
                <polygon points="4.45 5.65833333 3.05 4.25833333 2.45833333 4.85 4.45 6.84166667 7.54166667 3.75 6.95 3.15833333"></polygon>
              </g>
            </g>
          </g>
        </g>
      </symbol>
      <symbol id="icon-ccpa_download" viewBox="0 0 10 9">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-1271.000000, -614.000000)" fill="var(--color-121212)">
            <g transform="translate(1016.000000, 604.000000)">
              <g transform="translate(255.000000, 10.000000)">
                <polygon points="10 8.5 0 8.5 0 5.5 1 5.5 1 7.5 9 7.5 9 5.5 10 5.5"></polygon>
                <polygon
                  points="5.5 0 5.49981078 5.001 6.17094009 4.5 7.56809059 4.5 4.99649501 6.62573045 2.37781078 4.5 3.81417823 4.5 4.49981078 5.004 4.5 0"
                ></polygon>
              </g>
            </g>
          </g>
        </g>
      </symbol>
    </svg>
    <template v-if="showUpload">
      <div class="tips">
        {{ nl('page_ccpa_upload_text1') }}
        <a :href="excelDownloadUrl" class="need_datalayer" data-datalayer-category="CCPA" data-datalayer-label="CCPA_here_Click">
          {{ nl('page_common_here') }}.
        </a>
        {{ nl('page_ccpa_upload_text2') }}
      </div>
      <div class="upload-main layout-main">
        <div class="layout-main-title">{{ nl('page_ccpa_submit_form') }}: <span class="layout-main-title-mark">*</span></div>
        <div class="layout-main-content upload-main-right">
          <az-upload-more
            ref="upload"
            :nameList="['file[0]', 'file[1]', 'file[2]', 'file[3]', 'file[4]']"
            :limit="5"
            :btnNearTips="{
              text: nl('page_ccpa_request_form'),
              href: excelDownloadUrl || 'javascript: void(0);',
              eventCategory: 'CCPA',
              eventName: 'CCPA_RequestForm_Click'
            }"
            :btnUpload="{ text: nl('page_ccpa_choose_file'), eventCategory: 'CCPA', eventName: 'CCPA_ChooseFile_Click' }"
            :tipsList="[nl('page_ccpa_tips_total_size'), nl('page_ccpa_tips_support_file')]"
          ></az-upload-more>
          <div class="submit-box">
            <az-button
              @click="handleSubmit"
              :class="{ 'submit-loading': loading }"
              class="submit-btn need_datalayer"
              data-datalayer-category="CCPA"
              data-datalayer-label="CCPA_Submit_Click"
              >{{ loading ? `${nl('page_order_progress_processing')}...` : nl('page_common_just_submit') }}</az-button
            >
          </div>
        </div>
      </div>
      <div v-if="fileList && fileList.length" class="history-search layout-main">
        <div class="layout-main-title">{{ nl('page_ccpa_see_my_data') }}:</div>
        <div class="layout-main-content">
          <az-upload-list :fileList="fileList" :firstCount="10">
            <template v-slot:hover="val">
              <a :href="val.item.downloadLink"
                ><az-icon
                  slot="hover"
                  class="download-img need_datalayer"
                  data-datalayer-category="CCPA"
                  data-datalayer-label="CCPA_Download_Click"
                  icon-class="icon-ccpa_download"
                ></az-icon
              ></a>
            </template>
          </az-upload-list>
        </div>
      </div>
    </template>
    <div v-else class="success-box">
      <img src="~assets/images/ccpa/ccpa_success.png" alt="success" />
      <p>{{ nl('page_ccpa_tips_submit_success') }}</p>
    </div>
  </div>
</template>

<script>
import AzUploadMore from '@/components/user/Upload/AzUploadMore'
import AzUploadList from '@/components/user/Upload/AzUploadList'
import AzButton from '@/components/az-ui/Button/AzButton'

export default {
  components: {
    AzUploadList,
    AzUploadMore,
    AzButton
  },
  data() {
    return {
      loading: false,
      excelDownloadUrl: 'https://cdn-1.azazie.com/upload/CCPA%20Consumer%20Verifiable%20Request.xlsx', // 请求接口后会更新
      showUpload: true,
      fileList: [] // name url
    }
  },
  watch: {
    fileList() {
      if (this.fileList && this.fileList.length) {
        this.setDataLayer({
          action: 'view',
          category: 'CCPA',
          label: 'CCPA_Download_View'
        })
      }
    }
  },
  mounted() {
    this.getUploadFile()
  },
  methods: {
    getUploadFile() {
      this.$axios
        .$get(`/1.0/file/ccpa`)
        .then((res) => {
          if (res.code === 0) {
            this.fileList = ((res.data && res.data.record) || [])
              .map((item) => {
                return item.audit_file_addr.split(',').map((fileName) => {
                  return {
                    ...item,
                    downloadLink: fileName,
                    name: fileName.substr(fileName.lastIndexOf('/') + 1)
                  }
                })
              })
              .flat()
              .filter((item) => item.audit_file_addr)
            this.excelDownloadUrl = res.data && res.data.ccpaDoc
          } else if (res.code == 100001 || res.code == 100501) {
            location.href = this.countryUrl(`/user/login?back=${this.$route.fullPath}`)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleSubmit() {
      const formData = this.$refs.upload.upload()
      if (!formData) return
      this.loading = true
      this.$axios
        .$post(`/1.0/file`, formData)
        .then((res) => {
          this.loading = false
          if (res.code === 0) {
            this.showUpload = false
            setTimeout(() => {
              this.showUpload = true
              this.getUploadFile()
            }, 5000)
          } else if (res.code == 100001 || res.code == 100501) {
            location.href = this.countryUrl(`/user/login?back=${this.$route.fullPath}`)
          }
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
  font-size: 13px;
  color: var(--color-121212);
  line-height: 18px;
  padding-top: 15px;
  a {
    cursor: pointer;
    color: var(--color-121212);
    &:hover {
      text-decoration: underline;
    }
  }
}
.layout-main {
  padding-top: 25px;
  width: 367px;
  margin: 0 auto;
  text-align: left;
}

.layout-main-title {
  color: var(--color-121212);
  width: 290px;
  text-align: left;
  line-height: 18px;
  padding-top: 15px;
  padding-bottom: 10px;
  font-family: @font-family-500;
  .layout-main-title-mark {
    color: var(--color-121212);
  }
}
.submit-box {
  margin-top: 15px;
  .submit-loading {
    border-color: #666 !important;
    background: #666 !important;
  }
  .submit-btn {
    width: 184px;
    height: 40px;
    font-size: 14px;
    font-family: @font-family-500;
    padding: 0 5px;
    line-height: 40px;
    text-align: center;
    background-color: var(--color-121212);
    border-color: var(--color-121212);
    text-transform: uppercase;
    color: #fff;
    &:hover {
      background-color: var(--color-1e1e1e);
      border-color: var(--color-1e1e1e);
    }
  }
}
.history-search /deep/ {
  .download-img {
    width: 10px;
    height: 9px;
    margin-right: 10px;
  }
}
.success-box {
  text-align: center;
  img {
    vertical-align: middle;
    width: 60px;
    height: 60px;
    padding: 60px 0 20px;
  }
  p {
    font-family: @font-family-500;
    font-size: 13px;
    color: var(--color-121212);
    line-height: 18px;
  }
}
</style>
