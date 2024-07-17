<template>
  <div class="interested-list-container">
    <div class="interested-list-box">
      <div v-for="(item, index) in checkboxList" :key="index" :class="['interested-list-box-item']">
        <AzCheckBoxNew :value="!!item.checked" @on-change="handleItem(item, index)">
          <p class="check-box-item-text">{{ nl(item.value) }}</p>
        </AzCheckBoxNew>
      </div>
    </div>
  </div>
</template>

<script>
import AzCheckBoxNew from '@/components/az-ui-new/AzCheckBox'
export default {
  name: 'Interested',
  languageKeys: [
    'page_common_new_user_category_bd',
    'page_common_new_user_category_wd',
    'page_common_new_user_category_mom',
    'page_common_new_user_category_fgd',
    'page_common_new_user_category_sod',
    'page_common_new_user_category_acc'
  ],
  components: { AzCheckBoxNew },
  props: {
    goodsId: {
      type: Array,
      default: () => []
    },
    // 外部配置数据源 同 isConfig一起使用
    userRoleOptions: {
      type: Array,
      default: () => []
    },
    // 是否外部配置数据
    isConfig: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedList: [],
      checkboxList: [
        {
          catIds: [7, 9, 33, 45, 158],
          checked: false,
          value: 'page_common_new_user_category_bd'
        },
        {
          catIds: [2],
          checked: false,
          value: 'page_common_new_user_category_wd'
        },
        {
          catIds: [8],
          checked: false,
          value: 'page_common_new_user_category_mom'
        },
        {
          catIds: [10],
          checked: false,
          value: 'page_common_new_user_category_fgd'
        },
        {
          catIds: [3110],
          checked: false,
          value: 'page_common_new_user_category_sod'
        },
        {
          catIds: [6, 13, 15, 37, 129, 138, 139, 1508, 3076, 3077, 3099, 3101, 3102, 3109],
          checked: false,
          value: 'page_common_new_user_category_acc'
        }
      ]
    }
  },
  watch: {
    userRoleOptions: {
      handler(val) {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    // 初始化数据
    this.init()
  },
  methods: {
    init() {
      // 如果走组件外部数据则走外部配置数据
      if (this.isConfig && this.userRoleOptions && Object.keys(this.userRoleOptions).length > 0) {
        this.$set(this, 'checkboxList', this.userRoleOptions)
      }
      this.checkboxList.forEach((item, index) => {
        if (this.getIntersection(item.catIds, this.goodsId)) {
          this.handleItem(item, index)
        }
      })
    },
    handleItem(item, index) {
      this.checkboxList[index].checked = !this.checkboxList[index].checked
      const checkedValue = this.checkboxList
        .map((item) => {
          if (item.checked) {
            return item.value
          }
        })
        .filter((v) => !!v)
      this.$emit('on-change', checkedValue)
    },
    getIntersection(arr1 = [], arr2 = []) {
      return !!arr1.filter((item) => arr2.includes(item)).length
    }
  }
}
</script>

<style lang="less" scoped>
.interested-list-container {
  .interested-list-box {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>
