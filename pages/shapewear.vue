<template>
  <div class="page-common-box">
    <main-app :navigation="navigation">
      <div class="page-common-box-content">
        <div class="top-banner img-box">
          <a :href="countryUrl(topBanner.linkUrl)" v-track.viewOnce.clickOnce="getBiParams(topBanner.el)" aria-label="topBanner.imgAlt">
            <img :src="replaceImgCdnUrl(nl(topBanner.imgUrl))" :alt="topBanner.imgAlt" />
          </a>
        </div>
        <shapewear-list
          v-for="(config, index) in middleList"
          :key="index"
          :config="config"
          :params="params[index]"
          :currentIndex="index"
        ></shapewear-list>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import ShapewearList from '@/components/static/ShapewearList'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'

const topBanner = {
  imgUrl: 'page_image_shapewaer_pc_01',
  imgAlt: 'shapewear-banner',
  linkUrl: '/all/shapewear',
  el: 'shop shapewear'
}

export default {
  name: 'ShapeWear',
  components: {
    mainApp,
    ShapewearList
  },
  data() {
    return {
      params: []
    }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return

      return {
        ...commonAsyncData
        // lists: list.map((item) => item.data.prodList)
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  created() {
    this.topBanner = topBanner
    // 因为多语言中有特殊符号，所以需要转义一下
    const shapingBottoms = encodeURI(this.nl('page_list_filter_shaping_bottoms'))
    const solutionBras = encodeURI(this.nl('page_list_filter_solution_bras'))
    const allOverControl = encodeURI(this.nl('page_list_filter_all_over_control'))
    const shapingBottomsUrl = `/all/shapewear/with/target-area/${shapingBottoms}?sort_by=new_arrival&page=1`
    const solutionBrasUrl = `/all/shapewear/with/target-area/${solutionBras}?sort_by=new_arrival&page=1`
    const allOverControlUrl = `/all/shapewear/with/target-area/${allOverControl}?sort_by=new_arrival&page=1`
    this.middleList = [
      {
        linkUrl: shapingBottomsUrl,
        el: 'Smooth & Shape',
        list: [
          {
            imgUrl: 'page_image_shapewaer_pc_02',
            imgAlt: 'Smooth & Shape 1'
          },
          {
            imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/f4/dd/9f530f53764fdfbc321aa30ee4aef4dd.jpg',
            imgAlt: 'Smooth & Shape 2'
          },
          {
            imgUrl: 'page_image_shapewaer_pc_03',
            imgAlt: 'Smooth & Shape 3',
            cls: 'flex-img-2'
          }
        ]
      },
      {
        linkUrl: solutionBrasUrl,
        el: 'Enhance & Lift',
        list: [
          {
            imgUrl: 'page_image_shapewaer_pc_04',
            imgAlt: 'Enhance & Lift 1'
          },
          {
            imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/a9/8e/0e64e9a7705e3a17b272b3ec1635a98e.jpg',
            imgAlt: 'Enhance & Lift 2'
          },
          {
            imgUrl: 'page_image_shapewaer_pc_05',
            imgAlt: 'Enhance & Lift 3',
            cls: 'flex-img-2'
          }
        ]
      },
      {
        linkUrl: allOverControlUrl,
        el: 'Styling Secrets',
        list: [
          {
            imgUrl: 'page_image_shapewaer_pc_06',
            imgAlt: 'Styling Secrets 1'
          },
          {
            imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/b6/06/4e3d324722e541c0b7fb8b2ddbc0b606.jpg',
            imgAlt: 'Styling Secrets 2'
          },
          {
            imgUrl: 'page_image_shapewaer_pc_07',
            imgAlt: 'Styling Secrets 3',
            cls: 'flex-img-2'
          }
        ]
      }
    ]
    this.params = [
      [
        {
          filters: { 'target-area': [shapingBottoms] },
          view_mode: [],
          mkt: undefined,
          originUrl: shapingBottomsUrl
        },
        {
          params: {
            cat_name: 'shapewear',
            dress_type: 'dress',
            page: 1,
            limit: 18,
            in_stock: '',
            is_outlet: 0,
            version: 'b',
            sort_by: 'new_arrival'
          }
        }
      ],
      [
        {
          filters: { 'target-area': [solutionBras] },
          view_mode: [],
          mkt: undefined,
          originUrl: solutionBrasUrl
        },
        {
          params: {
            cat_name: 'shapewear',
            dress_type: 'dress',
            page: 1,
            limit: 18,
            in_stock: '',
            is_outlet: 0,
            version: 'b',
            sort_by: 'new_arrival'
          }
        }
      ],
      [
        {
          filters: { 'target-area': [allOverControl] },
          view_mode: [],
          mkt: undefined,
          originUrl: allOverControlUrl
        },
        {
          params: {
            cat_name: 'shapewear',
            dress_type: 'dress',
            page: 1,
            limit: 18,
            in_stock: '',
            is_outlet: 0,
            version: 'b',
            sort_by: 'new_arrival'
          }
        }
      ]
    ]
  },
  methods: {
    getBiParams(el, ids) {
      return {
        id: `${el}-${ids}`,
        common: {
          ec: 'shapewear',
          el
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@minImgHeight: 444px;
.page-common-box {
  .page-common-box-content {
    box-sizing: border-box;
    max-width: 1293px;
    width: 100%;
    padding-top: 30px;
    padding-bottom: 100px;
    margin: 0 auto;
    img {
      vertical-align: middle;
    }
    .img-box {
      background: url('../assets/images/goodsList/img-bg.png') center center/74px 80px no-repeat,
        linear-gradient(to bottom, #f6f6f6, #f6f6f6 99%, #fff 99%);
    }
  }
}
.top-banner {
  min-height: @minImgHeight;
  img {
    width: 100%;
  }
}
</style>
