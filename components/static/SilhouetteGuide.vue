<template>
  <div class="silhouette_guide_wrapper">
    <h3>{{ topBanner.title }}</h3>
    <p>{{ topBanner.text }}</p>
    <template v-if="firstStep">
      <h4>{{ firstStep.title }}</h4>
      <p>{{ firstStep.text }}</p>
      <p v-if="firstStep.data" class="measurement-video">
        <span class="start-note">{{ firstStep.data.title }}</span>
        <video
          id="myVideo"
          :poster="replaceImgCdnUrl(firstStep.data.imgUrl)"
          class="video-js vjs-default-skin vjs-big-play-centered"
          controls
          preload="auto"
          width="870"
          height="520"
          data-setup="{}"
        >
          <!-- 这个视频走多语言 -->
          <source :src="nl('page_video_size_guide_url')" type="video/mp4" />
        </video>
      </p>
    </template>
    <template v-if="secondStep">
      <h4>{{ secondStep.title }}</h4>
      <p>{{ secondStep.text }}</p>
      <div v-if="secondStep.data" class="custom_size_form size_form">
        <div class="size_des">
          <p>
            <span>{{ nl(secondStep.data.promptTitle) }}: </span>{{ nl(secondStep.data.promptText) }}
          </p>
        </div>
        <ul class="dress_ul">
          <li v-if="secondStep.data.bust">
            <label for="bust">{{ nl(secondStep.data.bust.title) }}:</label
            ><input
              :class="{ has_error: showError && !bust }"
              v-model="bust"
              type="text"
              name="bust"
              aria-label="bust"
              class="bust_on_listen"
            /><span>{{ nl(secondStep.data.bust.text) }}</span>
          </li>
          <li v-if="secondStep.data.waist">
            <label for="waist">{{ nl(secondStep.data.waist.title) }}:</label
            ><input :class="{ has_error: showError && !waist }" v-model="waist" type="text" name="waist" aria-label="waist" /><span>{{
              nl(secondStep.data.waist.text)
            }}</span>
          </li>
          <li v-if="secondStep.data.hips">
            <label for="hips">{{ nl(secondStep.data.hips.title) }}:</label
            ><input :class="{ has_error: showError && !hips }" v-model="hips" type="text" name="hips" aria-label="hips" /><span>{{
              nl(secondStep.data.hips.text)
            }}</span>
          </li>
          <li v-if="secondStep.data.height" class="not_in_chart">
            <label for="height">{{ nl(secondStep.data.height.title) }}:</label
            ><input :class="{ has_error: showError && !height }" v-model="height" type="text" name="height" aria-label="height" /><span>{{
              nl(secondStep.data.height.text)
            }}</span>
          </li>
        </ul>
        <img :src="replaceImgCdnUrl(secondStep.data.imgUrl)" :alt="secondStep.data.imgAlt" class="size-chart-png" />
        <button
          id="find_my_silhouette"
          v-if="secondStep.data.button"
          :data-datalayer-category="secondStep.data.button.eventName"
          :data-datalayer-label="secondStep.data.button.eventCategory"
          :class="{
            need_datalayer: secondStep.data.button.eventCategory && secondStep.data.button.eventName
          }"
          @click="getRecommend"
        >
          {{ nl(secondStep.data.button.text) }}
        </button>
      </div>
      <p class="spacial_p">{{ nl(secondStep.note) }}</p>
    </template>
    <div class="specials_box">
      <div
        v-for="(item, index) in midBanners"
        :key="index"
        :date-type="item.dataType"
        :class="{ be_recommended: item.dataType == type }"
        class="specials_item"
      >
        <a
          :href="countryUrl(item.linkUrl)"
          :data-datalayer-category="item.eventCategory"
          :data-datalayer-label="item.eventName"
          :class="{
            need_datalayer: item.eventCategory && item.eventName
          }"
          :target="linkTarget"
          :aria-label="item.eventName"
        >
          <img :src="replaceImgCdnUrl(item.imgUrl)" :alt="item.imgAlt" />
        </a>
        <div class="spacial_desc">
          <h4>{{ index + 1 }}. {{ item.header }}</h4>
          <hr />
          <p>
            {{ item.text }}
          </p>
          <a
            :href="countryUrl(item.linkUrl)"
            :data-datalayer-category="item.eventCategory"
            :data-datalayer-label="item.eventName"
            :class="{
              need_datalayer: item.eventCategory && item.eventName
            }"
            :target="linkTarget"
            class="a_btn"
            >{{ item.title }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SilhouetteGuideMid',
  props: {
    topBanner: {
      type: Object,
      default() {
        return {}
      }
    },
    midBanners: {
      type: Array,
      default() {
        return []
      }
    },
    linkTarget: {
      type: String,
      default: '_blank'
    }
  },
  data() {
    return {
      bust: '',
      waist: '',
      hips: '',
      height: '',
      type: '',
      showError: false,
      userSize: {
        bust: {
          desc: '',
          value: ''
        },
        hips: {
          desc: '',
          value: ''
        },
        height: {
          desc: '',
          value: ''
        },
        normalNum: 0,
        lowNum: 0,
        heightNum: 0
      },
      sizeCol: {
        bust: {
          min: 1.175,
          standard: 1.25,
          max: 1.325
        },
        hips: {
          min: 1.316,
          standard: 1.4,
          max: 1.484
        },
        height: {
          min: 2.284,
          standard: 2.43,
          max: 2.576
        }
      },
      listDadaType: ['type_one', 'type_two', 'type_three', 'type_four']
    }
  },
  computed: {
    firstStep() {
      return this.topBanner && this.topBanner.childNodes && this.topBanner.childNodes[0]
    },
    secondStep() {
      return this.topBanner && this.topBanner.childNodes && this.topBanner.childNodes[1]
    }
  },
  methods: {
    getRecommend() {
      let bust = this.bust
      const waist = this.waist
      let hips = this.hips
      let height = this.height
      this.showError = true
      if (!bust || !waist || !hips || !height) {
        return
      }
      this.userSizeInit()
      bust /= waist
      hips /= waist
      height /= waist
      this.setUserSize('bust', bust.toFixed(3))
      this.setUserSize('hips', hips.toFixed(3))
      this.setUserSize('height', height.toFixed(3))
      this.type = this.selectSkirt()
      document.documentElement.scrollTop = document.querySelector('.spacial_p').offsetTop - 30
    },
    userSizeInit() {
      this.userSize = {
        bust: {
          desc: '',
          value: ''
        },
        hips: {
          desc: '',
          value: ''
        },
        height: {
          desc: '',
          value: ''
        },
        normalNum: 0,
        lowNum: 0,
        heightNum: 0
      }
    },
    setUserSize(name, value) {
      if (this.sizeCol[name].max < value) {
        this.userSize[name].desc = 'height'
        this.userSize[name].value = (value - this.sizeCol[name].standard) / this.sizeCol[name].standard
        this.userSize.heightNum++
      } else if (this.sizeCol[name].min > value) {
        this.userSize[name].desc = 'low'
        this.userSize[name].value = (this.sizeCol[name].standard - value) / this.sizeCol[name].standard
        this.userSize.lowNum++
      } else {
        this.userSize[name].desc = 'normal'
        this.userSize.normalNum++
      }
    },
    selectSkirt() {
      let type
      if (this.userSize.normalNum === 3) {
        type = 'type_three'
        return type
      }
      if (this.userSize.heightNum === 3) {
        type =
          this.userSize.bust.value > this.userSize.hips.value
            ? this.userSize.bust.value > this.userSize.height.value
              ? 'type_two'
              : 'type_three'
            : this.userSize.hips.value > this.userSize.height.value
            ? 'type_one'
            : 'type_three'
        return type
      }
      if (this.userSize.lowNum === 3) {
        type =
          this.userSize.bust.value > this.userSize.hips.value
            ? this.userSize.bust.value > this.userSize.height.value
              ? 'type_one'
              : 'type_four'
            : this.userSize.hips.value > this.userSize.height.value
            ? 'type_three'
            : 'type_four'
        return type
      }
      if (this.userSize.normalNum === 0) {
        if (this.userSize.heightNum === 2 && this.userSize.hips.desc === 'low' && this.userSize.bust.value > this.userSize.height.value) {
          type = 'type_one'
          return type
        }
        type = 'type_four'
        return type
      }
      if (this.userSize.lowNum === 0) {
        if (this.userSize.hips.desc === 'height') {
          if (this.userSize.heightNum === 1) {
            type = 'type_one'
            return type
          } else if (this.userSize.hips.value > this.userSize.bust.value && this.userSize.hips.value > this.userSize.height.value) {
            type = 'type_four'
            return type
          } else {
            type = 'type_two'
            return type
          }
        }
        type = 'type_two'
        return type
      }
      if (this.userSize.heightNum === 0) {
        if (this.userSize.lowNum === 2) {
          if (this.userSize.height.desc === 'normal' && this.userSize.bust.value > this.userSize.hips.value) {
            type = 'type_one'
            return type
          }
          if (this.userSize.hips.desc === 'normal' && this.userSize.bust.value > this.userSize.height.value) {
            type = 'type_two'
            return type
          }
          type = 'type_four'
          return type
        }
        if (this.userSize.bust.desc === 'low') {
          type = 'type_one'
          return type
        } else if (this.userSize.hips.desc === 'low') {
          type = 'type_two'
          return type
        } else {
          type = 'type_four'
          return type
        }
      }
      if (this.userSize.normalNum === 1 && this.userSize.heightNum === 1) {
        if (this.userSize.height.desc === 'low') {
          type = 'type_four'
          return type
        }
        if (this.userSize.bust.desc === 'low') {
          type = 'type_one'
          return type
        }
        if (this.userSize.hips.desc === 'low' && this.userSize.bust.desc === 'height') {
          type = 'type_two'
          return type
        }
        type = 'type_three'
        return type
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
