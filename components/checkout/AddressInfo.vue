<template>
  <div class="info-part">
    <div v-if="scene !== 'alteration'" class="info_line">{{ addressInfo.fullName }}</div>
    <div :class="{ error: isAddressError }" class="info_line">{{ addressInfo.address }}</div>
    <div v-if="addressInfo.doorplate" class="info_line">{{ addressInfo.doorplate }}</div>
    <div class="info_line">{{ addressInfo.signBuilding }}</div>
    <div :class="{ error: isCsz }" class="info_line">
      {{ addressInfo.districtText ? addressInfo.districtText + ', ' : '' }}{{ addressInfo.cityText ? addressInfo.cityText + ',' : '' }}
      {{ addressInfo.provinceName || addressInfo.provinceText }}, {{ addressInfo.zipcode }}
    </div>
    <div class="info_line">{{ addressInfo.countryName }}</div>
    <div class="info_line">{{ addressInfo.tel }}</div>
  </div>
</template>

<script>
export default {
  name: 'AddressInfo',
  components: {},
  props: {
    addressInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    isAddressError: {
      type: Boolean,
      default: false
    },
    isCsz: {
      type: Boolean,
      default: false
    },
    // 使用场景值：default, alteration
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.info-part {
  // font-size: 14px;
  color: var(--color-121212);
  font-family: @font-family-500;
  word-break: break-word;
  .info_line:not(:first-of-type) {
    margin-top: 5px;
  }
  .error {
    border: 1px solid orangered;
    padding: 0 2px;
  }
}
</style>
