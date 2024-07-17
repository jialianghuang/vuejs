import { mapState } from 'vuex'
export default {
  languageKeys: [
    'page_common_extra_length',
    'page_common_bust_des',
    'page_common_waist_des',
    'page_common_hips_des',
    'page_common_hollow_des',
    'page_common_height_des',
    'page_common_under_bust_des',
    'page_common_around_belly_des',
    'page_common_neck_hole_des',
    'page_size_ques',
    'page_common_junior_bust_des',
    'page_customsize_tip_min',
    'page_customsize_jbd_tip_for',
    'page_customsize_tip_for',
    'page_common_length_inches',
    'page_customsize_tip_max',
    'page_customsize_tip_diff',
    'page_customsize_tip_and',
    'page_customsize_tip_less',
    'page_common_length_inches',
    'page_customsize_tip_or',
    'page_customsize_tip_greater'
  ],
  props: {
    customData: {
      type: Object,
      default() {
        return {}
      }
    },
    unit: {
      type: String,
      default: 'inch'
    }
  },
  data() {
    return {
      extraLengthInfo: {
        name: this.nl('page_common_extra_length'),
        key: 'extra_length',
        inch_min: 0,
        inch_max: 5,
        gap: 1,
        cm_min: 0,
        cm_max: 12,
        cm_gap: 3,
        prefix: '+'
      },
      current: {},
      customList: [],
      currentShowName: '',
      currentShowDesc: '',
      size_des_mapping: {
        bust: this.nl('page_common_bust_des'),
        waist: this.nl('page_common_waist_des'),
        hips: this.nl('page_common_hips_des'),
        hollow_to_floor: this.nl('page_common_hollow_des'),
        height: this.nl('page_common_height_des'),
        under_bust: this.nl('page_common_under_bust_des'),
        around_belly: this.nl('page_common_around_belly_des'),
        neck_hole: this.nl('page_common_neck_hole_des'),
        extra_length: this.nl('page_size_ques'),
        hollow_to_hem: this.nl('page_size_recommend_hollow_to_hem')
      },
      confirmCheckbox: false,
      confirmCheckboxError: false,
      timer: null,
      customListForm: {},
      customListFormResult: {},
      measureList: {
        bust: {
          initHeight: false,
          text: 'page_size_chart_measure_bust',
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/ppml/222/9a/59/92436b9bfee0b4205d6ec03599b49a59.png'
        },
        waist: {
          initHeight: true,
          text: 'page_size_chart_measure_waist',
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/ppml/222/90/a4/7005278b684ee03bc8b229c612cc90a4.png'
        },
        hips: {
          initHeight: true,
          text: 'page_size_chart_measure_hips',
          imgUrl: 'https://cdn-1.azazie.com/upimg/userfiles/ppml/222/a7/fb/e7afe2a7247ce420e57691535ca0a7fb.png'
        },
        hollow_to_floor: {
          initHeight: true,
          text: 'page_size_chart_measure_hollow_to_floor',
          imgUrl: 'page_image_size_hollow_to_floor'
        },
        height: {
          initHeight: true,
          text: 'page_size_chart_measure_height',
          imgUrl: 'page_image_size_measure_height'
        },
        hollow_to_hem: {
          initHeight: true,
          text: 'page_size_chart_measure_hollow_to_hem',
          imgUrl: 'page_image_size_hollow_to_hem'
        }
      }
    }
  },
  computed: {
    ...mapState({
      baseInfo: (state) => state.product.baseInfo,
      customSizeInfo: (state) => state.product.customSizeInfo
    }),
    customSuggestionShow() {
      let res = false
      Object.keys(this.customListFormResult).map((key) => {
        if (this.customListFormResult[key] && this.customListFormResult[key].length) {
          res = true
        }
      })
      return res
    },
    customArray() {
      const tempCustomArray = []
      if (this.customSizeInfo.custom_size_info && this.customSizeInfo.custom_size_info.length) {
        this.customSizeInfo.custom_size_info.forEach((item) => {
          tempCustomArray.push({
            ...item
          })
        })
      }
      if (this.customSizeInfo.extra_length_status) {
        tempCustomArray.push(JSON.parse(JSON.stringify(this.extraLengthInfo)))
      }
      return tempCustomArray
    },
    customMaps() {
      const tempCustomArray = {}
      if (this.customSizeInfo.custom_size_info && this.customSizeInfo.custom_size_info.length) {
        this.customSizeInfo.custom_size_info.forEach((item) => {
          tempCustomArray[item.key] = {
            ...item
          }
        })
      }
      if (this.customSizeInfo.extra_length_status) {
        tempCustomArray.extra_length = JSON.parse(JSON.stringify(this.extraLengthInfo))
      }
      return tempCustomArray
    }
  },
  created() {
    this.customList = JSON.parse(JSON.stringify(this.customArray))
    if (this.customList[0]) {
      this.currentShowName = this.customList[0].name
      this.current = this.customList[0]
      this.currentShowDesc = this.size_des_mapping[this.customList[0].key]
    }
    this.getCustomListForm()
  },
  watch: {
    customData: {
      handler(val) {
        !!Object.keys(val).length && this.getCustomListForm()
      },
      deep: true
    }
  },
  mounted() {
    this.size_des_mapping.bust = this.baseInfo.catId == 9 ? this.nl('page_common_junior_bust_des') : this.nl('page_common_bust_des')
  },
  methods: {
    changeUnit() {
      this.$emit('switch-unit')
      this.getCustomListForm()
    },
    changeConfirm() {
      this.confirmCheckbox = !this.confirmCheckbox
      this.confirmCheckboxError = !this.confirmCheckboxError
    },
    getCustomListForm() {
      if (
        this.customData.hasOwnProperty('bust') ||
        this.customData.hasOwnProperty('hips') ||
        this.customData.hasOwnProperty('height') ||
        this.customData.hasOwnProperty('hollow_to_floor')
      ) {
        this.confirmCheckbox = true
        Object.keys(this.customData).map((key) => {
          this.$set(this.customListForm, key, this.customData[key])
          this.$set(this.customListFormResult, key, '')
        })
      } else {
        this.customList.map((item) => {
          this.$set(this.customListForm, item.key, '')
          this.$set(this.customListFormResult, item.key, '')
        })
      }
    },
    getDescTitle(obj) {
      const minKey = this.unit == 'inch' ? 'inch_min' : 'cm_min'
      const maxKey = this.unit == 'inch' ? 'inch_max' : 'cm_max'
      if (obj[minKey] && obj[maxKey]) {
        return `${obj[minKey]} - ${obj[maxKey]}`
      } else if (obj[minKey]) {
        return `>= ${obj[minKey]}`
      } else if (obj[maxKey]) {
        return `<= ${obj[maxKey]}`
      }
    },
    checkAndNotice(key) {
      if (this.customListForm[key] && this.customMaps[key]) {
        this.checkSelfAndNotice()
        this.checkOtherAndNotice()
      }
    },
    // 单个属性
    checkSelfAndNotice() {
      const minKey = this.unit == 'inch' ? 'inch_min' : 'cm_min'
      const maxKey = this.unit == 'inch' ? 'inch_max' : 'cm_max'
      for (const key in this.customMaps) {
        this.$set(this.customListFormResult, key, '')
        const selfItem = this.customMaps[key]
        const minVal = selfItem[minKey]
        const maxVal = selfItem[maxKey]
        if (this.customListForm[key]) {
          if (minVal && this.customListForm[key] < minVal) {
            const underNotice = `${this.nl('page_customsize_tip_min')} ${selfItem.name} ${
              this.baseInfo.catId == 9 ? this.nl('page_customsize_jbd_tip_for') : this.nl('page_customsize_tip_for')
            } ${selfItem.inch_min} ${this.nl('page_common_length_inches').toLowerCase()} (${selfItem.cm_min} cm).`
            this.customListFormResult[key] = underNotice
          } else if (maxVal && this.customListForm[key] > maxVal) {
            const greaterNotice = `${this.nl('page_customsize_tip_max')} ${selfItem.name} ${
              this.baseInfo.catId == 9 ? this.nl('page_customsize_jbd_tip_for') : this.nl('page_customsize_tip_for')
            } ${selfItem.inch_max} ${this.nl('page_common_length_inches').toLowerCase()} (${selfItem.cm_max} cm).`
            this.customListFormResult[key] = greaterNotice
          }
        }
      }
    },
    // 属性之间
    checkOtherAndNotice() {
      const minKey = this.unit == 'inch' ? 'inch_min' : 'cm_min'
      const maxKey = this.unit == 'inch' ? 'inch_max' : 'cm_max'
      for (const restrictSizeKey in this.customSizeInfo.other_restrict_info) {
        const restrictSizeItem = this.customSizeInfo.other_restrict_info[restrictSizeKey]
        const keys = restrictSizeItem.key.split('-')
        const names = restrictSizeItem.name.split('-')
        const oneKey = keys[0]
        const otherKey = keys[1]
        if (this.customListForm[oneKey] && this.customListForm[otherKey]) {
          const diffVal = this.customListForm[keys[0]] * 1 - this.customListForm[keys[1]] * 1
          if (diffVal < restrictSizeItem[minKey] || diffVal > restrictSizeItem[maxKey]) {
            let diffNotice = ''
            if (restrictSizeItem[minKey] >= 0) {
              diffNotice = `${this.nl('page_customsize_tip_diff')} ${names[0]} ${this.nl('page_customsize_tip_and')} ${names[1]} ${this.nl(
                'page_customsize_tip_less'
              )} ${restrictSizeItem.inch_min} ${this.nl('page_common_length_inches').toLowerCase()} (${
                restrictSizeItem.cm_min
              } cm)  ${this.nl('page_customsize_tip_or')} ${restrictSizeItem.inch_max} ${this.nl(
                'page_common_length_inches'
              ).toLowerCase()} (${restrictSizeItem.cm_max} cm)`
            } else if (diffVal > restrictSizeItem[maxKey]) {
              diffNotice = `${this.nl('page_customsize_tip_diff')} ${names[0]} ${this.nl('page_customsize_tip_and')} ${names[1]} ${this.nl(
                'page_customsize_tip_greater'
              )} ${restrictSizeItem.inch_max} ${this.nl('page_common_length_inches').toLowerCase()} (${restrictSizeItem.cm_max} cm)`
            } else {
              diffNotice = `${this.nl('page_customsize_tip_diff')} ${names[1]} ${this.nl('page_customsize_tip_and')} ${names[0]} ${this.nl(
                'page_customsize_tip_greater'
              )} ${Math.abs(restrictSizeItem.inch_min * 1)} ${this.nl('page_common_length_inches').toLowerCase()} (${Math.abs(
                restrictSizeItem.cm_min * 1
              )} cm)`
            }
            this.customListFormResult[oneKey] = diffNotice
          }
        }
      }
    },
    checkCustomSizeField() {
      Object.keys(this.customListFormResult).map((key) => {
        this.$set(this.customListFormResult, key, '')
      })
      this.confirmCheckboxError = false
      this.checkSelfAndNotice()
      this.checkOtherAndNotice()
      Object.keys(this.customListForm).map((key) => {
        const value = this.customListForm[key] && parseFloat(this.customListForm[key])
        if (!(value > 0) && key != 'extra_length') {
          this.$set(this.customListFormResult, key, true)
        } else if (!(value >= 0) && key == 'extra_length') {
          this.$set(this.customListFormResult, key, true)
        }
        if (key == 'extra_length') {
          if (!String(this.customListForm[key]) || this.customListForm[key] == -1) {
            this.customListFormResult[key] = true
          } else {
            this.customListFormResult[key] = false
          }
        }
      })
      let allRight = true
      Object.keys(this.customListFormResult).map((key) => {
        if (this.customListFormResult[key]) {
          allRight = false
        }
      })
      if (!this.confirmCheckbox) {
        this.confirmCheckboxError = true
        allRight = false
      }
      return allRight
    }
  }
}
