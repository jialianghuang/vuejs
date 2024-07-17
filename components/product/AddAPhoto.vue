<template>
  <div class="add-a-photo">
    <input class="file_upload_list" type="hidden" name="fileList[]" />
    <input class="file_upload_list_id" type="hidden" name="fileListId" />
    <input class="file_upload_list_size" type="hidden" name="fileListSize" />
    <input class="file_upload_list_type" type="hidden" name="fileListType" />
    <div id="ticket_img_form" class="ticket-img-form">
      <p v-if="uploadTitle" class="upload-title">{{ uploadTitle }}:</p>
      <p v-if="uploadTips" class="upload-tips">{{ uploadTips }}</p>
      <p class="question-liar-label"></p>
      <p class="question-bg-file default-bg">
        <input id="file_first" @change="getFile()" type="file" name="fileList[0]" value="file_first" />
        <input id="file_second" @change="getFile()" type="file" name="fileList[1]" value="file_second" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddAPhoto',
  components: {},
  props: {
    uploadTitle: {
      type: String,
      default: ''
    },
    uploadTips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: {}
    }
  },
  computed: {},
  mounted() {},
  methods: {
    getFile() {}
  }
}
</script>

<style lang="less" scoped>
.add-a-photo {
  .ticket-img-form {
    .upload-title {
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 5px;
      color: var(--color-121212);
    }
    .upload-tips {
      font-size: 13px;
      margin-bottom: 10px;
      color: var(--color-666666);
    }
    .question-bg-file {
      position: relative;
      overflow: hidden;
      display: inline-block;
      width: 160px;
      height: 35px;
    }

    .default-bg {
      background: url(~assets/images/review/addaphoto.png) no-repeat;
      cursor: pointer;
    }

    #file_first {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 160px;
      height: 35px;
      font-size: 100px;
      /*display: none;*/
      opacity: 0;
    }

    input[type='file']:hover {
      cursor: pointer;
    }

    #file_second {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 160px;
      height: 35px;
      font-size: 100px;
      display: none;
      opacity: 0;
    }
  }
}
</style>
