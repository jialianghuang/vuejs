<template>
  <div id="order-swatches-and-samples" class="details_module order-swatches-and-samples">
    <div class="details_module_header">
      {{
        ['US', 'CA'].includes(country) ? nl('page_common_showroom_order_swatches_and_samples') : nl('page_common_showroom_order_swatches')
      }}
    </div>
    <div class="details_module_content">
      <div class="copy">
        {{
          ['US', 'CA'].includes(country)
            ? nl('page_common_showroom_order_swatches_and_samples_copy')
            : nl('page_common_showroom_order_swatches_copy')
        }}
      </div>
      <div class="link_box">
        <a
          @click="hrefPoint('swatch')"
          :href="countryUrl('/products/azazie-swatches-bridesmaids-and-wedding-party?color=dusty-rose&from=swatch')"
          class="order_swatch"
          target="_blank"
          >{{ nl('page_common_showroom_order_swatch') }}</a
        >
        <a
          v-if="['US', 'CA'].includes(country)"
          @click="hrefPoint('try_on')"
          :href="countryUrl('/all/sample-dresses?current_in_stock=yes')"
          class="try_at_home"
          target="_blank"
          >{{ nl('page_common_at_home_try_on') }}</a
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrderSwatchesAndSamples',
  data() {
    return {}
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const ele = document.getElementById('order-swatches-and-samples')
      const eleBottom = ele.getBoundingClientRect().bottom
      const screenHeight = window.screen.height
      if (eleBottom < screenHeight) {
        this.setPoint('swatchandsample', 'showroom', 'view')
        window.removeEventListener('scroll', this.handleScroll)
      }
    },
    hrefPoint(type) {
      if (type == 'swatch') {
        this.setPoint('swatchandsample', 'orderswatch', 'click')
      } else {
        this.setPoint('swatchandsample', 'athometryon', 'click')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
