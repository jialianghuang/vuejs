<template>
  <az-dialog :visible.sync="show" width="450px">
    <div class="delete-list">
      <h3 class="delete-list-title">{{ nl('page_storefront_delete_list') }}</h3>
      <h4>{{ name }}</h4>
      <p class="delete-list-des">{{ nl('page_storefront_delete_forever') }}</p>
      <az-button @click="handleClick" :disabled="disabled" class="btn btn-default">{{ nl('page_storefront_yes_delete') }}</az-button>
      <a @click="show = false" role="button" href="javascript:;" class="cancel-btn">{{ nl('page_common_cancel') }}</a>
    </div>
  </az-dialog>
</template>
<script>
import AzDialog from '@/components/az-ui/AzDialog'
import AzButton from '@/components/az-ui/Button/AzButton'

/**
 * 删除列表提示
 */
export default {
  components: {
    AzDialog,
    AzButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    listKey: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      disabled: false,
      show: false
    }
  },
  watch: {
    visible(e) {
      this.show = e
    },
    show(e) {
      if (!e) {
        this.$emit('update:visible', e)
      }
    }
  },
  methods: {
    handleClick() {
      this.disabled = true
      // 删除门店列表
      this.$axios
        .$delete('/1.0/referrer/storefront-list/' + this.listKey)
        .then((res) => {
          this.disabled = false
          if (res.code === 0) {
            this.show = false
            this.$emit('onSuccess')
          } else {
            alert(res.msg)
          }
        })
        .catch(() => {
          this.disabled = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.delete-list {
  text-align: center;
  &-title {
    font-size: 18px;
    text-transform: uppercase;
    margin-bottom: 10px;
    font-family: @font-family-600;
  }
  h4 {
    font-size: 14px;
    margin-bottom: 20px;
  }
  &-des {
    font-size: 13px;
    margin-bottom: 20px;
  }
  .btn {
    margin-bottom: 20px;
    width: 100%;
  }
  .cancel-btn {
    font-size: 13px;
    text-decoration: underline;
    text-transform: lowercase;
  }
}
</style>
