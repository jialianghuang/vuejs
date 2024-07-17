<template>
  <az-dialog :visible.sync="show" width="450px">
    <div class="create-list">
      <h3 class="create-list-title">{{ value ? nl('page_storefront_edit_list_name') : nl('page_storefront_create_a_list') }}</h3>
      <p class="create-list-des">{{ value ? nl('page_storefront_edit_below') : nl('page_storefront_name_list_below') }}</p>
      <div class="line"></div>
      <div class="input-box">
        <span class="input-name">
          {{ nl('page_storefront_list_name') }} <i>({{ nl('page_storefront_required') }})</i>
        </span>
        <az-input v-model="listName" :errorMsg="errorMsg" :max-length="70" @blur="handleBlurValidate"></az-input>
      </div>
      <az-button @click="handleClick" :disabled="disabled" class="btn btn-default">{{ nl('page_storefront_save_continue') }}</az-button>
      <a @click="show = false" role="button" href="javascript:;" class="cancel-btn">{{ nl('page_common_cancel') }}</a>
    </div>
  </az-dialog>
</template>
<script>
import AzDialog from '@/components/az-ui/AzDialog'
import AzButton from '@/components/az-ui/Button/AzButton'
import AzInput from '@/components/az-ui/AzInput'

/**
 * 创建，编辑门店列表名称
 */
export default {
  languageKeys: [
    'page_storefront_create_a_list',
    'page_storefront_edit_list_name',
    'page_storefront_name_list_below',
    'page_storefront_edit_below',
    'page_storefront_list_name',
    'page_storefront_required',
    'page_storefront_save_continue',
    'page_common_cancel',
    'page_please_enter_valid_value',
    'page_storefront_editname_same'
  ],
  components: {
    AzDialog,
    AzButton,
    AzInput
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    listKey: {
      type: [String, Number],
      default: ''
    },
    storefrontLists: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      disabled: false,
      show: false,
      listName: this.value,
      errorMsg: ''
    }
  },
  watch: {
    visible: {
      handler(e) {
        this.show = e
        if (e) {
          this.listName = this.value
        }
      },
      immediate: true
    },
    show(e) {
      if (!e) {
        this.$store.commit('list/setShowCreateStoreList', false)
        this.listName = ''
        this.$emit('update:visible', e)
      }
    }
  },
  methods: {
    handleBlurValidate(e) {
      if (this.listName) this.errorMsg = ''
    },
    handleClick() {
      if (!this.listName) {
        this.errorMsg = this.nl('page_please_enter_valid_value')
      } else {
        this.disabled = true
        let hasSame = false
        // 禁止重名，重名提示
        if (this.storefrontLists.length) {
          this.storefrontLists.forEach((ele) => {
            if (this.listName === ele.storefrontListInfo.name) {
              hasSame = true
              this.disabled = false
              alert(this.nl('page_storefront_editname_same'))
            }
          })
        }
        if (!hasSame) {
          // 编辑列表名
          if (this.value) {
            const data = {
              storefront_list_id: this.listKey,
              column: 'name',
              column_value: this.listName
            }
            this.$axios.$post('/1.0/referrer/update-storefront', data).then((res) => {
              this.disabled = false
              if (res.code === 0) {
                this.show = false
                this.$emit('onSuccess')
              } else {
                alert(res.msg)
              }
            })
          } else {
            // 创建列表名
            this.$axios
              .$post('/1.0/referrer/create-store', {
                name: this.listName
              })
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
    }
  }
}
</script>

<style lang="less" scoped>
.create-list {
  text-align: center;
  &-title {
    font-size: 18px;
    text-transform: uppercase;
    margin-bottom: 10px;
    font-family: @font-family-600;
  }
  &-des {
    font-size: 13px;
    margin-bottom: 20px;
  }
  .line {
    width: 100%;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
  .input-box {
    margin-bottom: 20px;
    text-align: left;
    > span {
      i {
        color: #999;
      }
    }
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
