<template>
  <div class="product-microdata">
    <div typeof="schema:Product">
      <div :content="baseInfo.goodsName" property="schema:name"></div>
      <div :resource="`${imageInfo.thumbPrefix}${baseInfo.defaultGoodsThumb}`" rel="schema:image"></div>
      <div :content="detailsInfo.description ? detailsInfo.description.txt : baseInfo.goodsName" property="schema:description"></div>
      <div :content="`AzaziecUSleng${baseInfo.goodsId}`" property="schema:mpn"></div>
      <div rel="schema:Brand">
        <div typeof="schema:Thing">
          <div property="schema:name" content="Azazie"></div>
        </div>
      </div>
      <div rel="schema:offers">
        <div typeof="schema:AggregateOffer">
          <div content="1" property="schema:offerCount"></div>
          <div :content="baseInfo.noDealPrice ? baseInfo.noDealPrice : baseInfo.shopPrice" property="schema:highPrice"></div>
          <div :content="baseInfo.shopPrice" property="schema:lowPrice"></div>
          <div :content="currencyCode" property="schema:priceCurrency"></div>
          <div property="schema:availability" itemtype="http://schema.org/ItemAvailability" content="http://schema.org/InStock"></div>
          <div
            property="schema:itemCondition"
            itemtype="http://schema.org/OfferItemCondition"
            content="http://schema.org/NewCondition"
          ></div>
        </div>
      </div>
      <div rel="schema:aggregateRating">
        <div typeof="schema:AggregateRating">
          <div :content="`${HTTPS_HOST}${baseInfo.goodsUrl}`" property="schema:url"></div>
          <div :content="reviewInfo.rating * 1 ? reviewInfo.rating * 1 : 1" property="schema:ratingValue "></div>
          <div :content="reviewInfo.totalCount ? reviewInfo.totalCount : 10" property="schema:ratingCount "></div>
        </div>
      </div>
      <div v-if="reviewInfo.rating2f" rel="schema:review">
        <div typeof="schema:Review">
          <div rel="schema:reviewRating">
            <div typeof="schema:Rating">
              <div :content="reviewInfo.rating2f" property="schema:ratingValue"></div>
              <div property="schema:bestRating" content="5"></div>
            </div>
          </div>
          <div rel="schema:author">
            <div typeof="schema:Person">
              <div property="schema:name" content="Azazie"></div>
            </div>
          </div>
        </div>
      </div>
      <div :content="baseInfo.goodsId" property="schema:sku"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ProductMicrodata',
  props: {
    detailsInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    reviewInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      imageInfo: (state) => state.product.imageInfo
    })
  }
}
</script>

<style lang="less" scoped></style>
