<template>
  <div class="one-delete-attribute">
    <template v-if="filterItem.value.key == 'sale_type'">
      <span @click="$emit('click')" v-if="onSaleValueOn" class="desc">
        <span>
          {{ nl('page_saletype_sale_offers') }}
        </span>
        <svg class="icon close-icon"><use xlink:href="#icon-lby_filter_close_x"></use></svg>
      </span>
    </template>
    <span @click="$emit('click')" v-else class="desc">
      <span v-if="filterItemName.toLowerCase() === 'Barbie AZAZIE'.toLowerCase()">
        Barbie™ <az-icon icon-class="icon-Barbie-Heart" class="barbie-heart"></az-icon> AZAZIE
      </span>
      <span v-else>{{ filterItemName }}</span>
      <svg class="icon close-icon"><use xlink:href="#icon-lby_filter_close_x"></use></svg>
    </span>
  </div>
</template>

<script>
export default {
  name: 'SelectedFilterItem',
  props: {
    filterItem: {
      type: Object,
      default() {
        return {
          key: '',
          name: '',
          value: '',
          url: ''
        }
      }
    },
    isOnSale: {
      type: Boolean,
      default: false
    },
    onSaleName: {
      type: String,
      default: ''
    }
  },
  computed: {
    filterItemName() {
      return this.isOnSale
        ? this.nl(this.onSaleName)
        : ['Yes', 'yes', 'No', 'no'].includes(this.filterItem.value)
        ? `${this.filterItem.parentName}: ${this.filterItem.name}`
        : this.filterItem.value && ['size', 'stock_size'].includes(this.filterItem.value.key)
        ? this.filterItem.shownName
        : this.filterItem.name
    },
    onSaleValueOn() {
      // 只有当值只为 sales_&_offers 表示 onsale打开
      return (
        this.filterItem.value.key == 'sale_type' &&
        this.filterItem.key === 'sales_&_offers' &&
        this.filterItem.value.values &&
        Object.keys(this.filterItem.value.values).length === 1
      )
    }
  }
}
</script>

<style lang="less" scoped>
.one-delete-attribute {
  display: inline-block;
  height: 20px;
  margin: 0 5px 5px 0;
  cursor: pointer;
  .desc {
    font-size: 13px;
    font-family: @font-family-500;
    color: #666;
    padding: 1px 8px;
    background: #f6f6f6;
    border-radius: 10px;
    // text-transform: capitalize;
    .close-icon {
      width: 8px;
      height: 8px;
      font-size: 8px;
      margin-left: 2px;
      vertical-align: 0;
      fill: currentColor;
      overflow: hidden;
    }
    .barbie-heart {
      fill: #de1c85;
      transform: scale(0.5);
    }
  }
}
</style>
