<template>
  <div v-if="country == 'US'" v-track.view="setPoint('detailsbanner', 'AzaziePerks', 'view')" class="right-detail-entry">
    <div @click="toRightsPackage" class="detail-box">
      <img
        :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/c1/52/ce074fd7440b3823be1eef5fb4c3c152.jpg')"
        alt="detail"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightsDetailEntry',
  methods: {
    toRightsPackage() {
      this.setPoint('detailsbanner', 'AzaziePerks', 'click')
      location.href = '/user?azazie_perks'
    },
    setPoint(ec, el, ea) {
      const baseInfo = this.$store.state.product.baseInfo
      this.buryPoint(this, 'event', {
        ec,
        el,
        ea,
        msg: JSON.stringify({ goodsId: baseInfo.goodsId })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.right-detail-entry {
  margin-top: 5%;
  cursor: pointer;
  .detail-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    img {
      width: 100%;
    }
  }
}
</style>
