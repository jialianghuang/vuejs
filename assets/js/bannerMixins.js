import ImageHotSpot from '@/components/common/ImageHotSpot'

export default {
  components: { ImageHotSpot },
  methods: {
    judgeIsEmptyUrl(linkUrl) {
      linkUrl = (linkUrl || '').trim()
      return !linkUrl || (linkUrl.includes('javascript') && linkUrl.includes('void'))
    }
  }
}
