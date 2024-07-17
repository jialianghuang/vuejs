<template>
  <div class="new-arrival-list">
    <template v-for="(item, index) in list">
      <new-arrival-item
        v-if="item.show"
        :key="index"
        :title="item.title"
        :sub-title="item.subTitle"
        :header="item.header"
        :prodList="item.list"
        :shopAllUrl="item.shopAllLink"
        :currentIndex="index"
        :maxWidth="maxWidth"
      ></new-arrival-item>
    </template>
  </div>
</template>

<script>
import NewArrivalItem from '@/components/newArrival/NewArrivalItem'
export default {
  name: 'NewArrivalList',
  components: { NewArrivalItem },
  props: {
    prodReqListData: {
      type: Array,
      default() {
        return []
      }
    },
    // 单个数据最大宽度
    maxWidth: {
      type: String,
      default: '176px'
    }
  },
  data() {
    return {}
  },
  computed: {
    list() {
      return this.prodReqListData.filter((item) => {
        let title = this.nl('')
        let subTitle = this.nl('')
        let show = true
        switch (item.catName) {
          case 'bridesmaid_dresses':
            title = this.nl('page_common_bridesmaid_dresses')
            subTitle = this.nl('page_common_bridesmaid_dresses_sub')
            break
          case 'wedding_dresses':
            title = this.nl('page_common_wedding_dresses')
            subTitle = this.nl('page_common_wedding_dresses_sub')
            break
          case 'mother_of_the_bride_dresses':
            title = this.nl('page_common_mother_of_the_bride')
            subTitle = this.nl('page_common_mother_of_the_bride_sub')
            break
          case 'dresses':
            title = this.nl('page_common_formal_dressess')
            subTitle = this.nl('page_common_formal_dressess_sub')
            break
          case 'accessories':
            title = this.nl('page_common_accessories')
            subTitle = this.nl('page_common_accessories_sub')
            break
          case 'shapewear':
            title = this.nl('page_common_shapewear')
            subTitle = this.nl('page_common_shapewear_sub')
            show = false
            break
          default:
            break
        }
        item.title = title
        item.subTitle = subTitle
        item.show = show
        return item.list && item.list.length
      })
    }
  }
}
</script>

<style lang="less" scoped>
.new-arrival-list {
  width: 100%;
  margin: 50px auto 50px;
}
</style>
