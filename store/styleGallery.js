export const state = () => ({
  popupStyleGallery: {
    popupStyleGalleryShow: false,
    popupStyleGalleryId: 0
  },
  selectedFilters: {},
  galleryList: [],
  currentGalleryId: 0,
  galleryInfoAgg: {},
  currentUrl: ''
})
export const mutations = {
  setPopupStyleGalleryShow(state, popupStyleGallery) {
    state.popupStyleGallery = popupStyleGallery
  },
  setSelectedFilters(state, selectedFilters) {
    state.selectedFilters = selectedFilters
  },
  setGalleryList(state, galleryList) {
    state.galleryList = galleryList
  },
  setCurrentGalleryId(state, currentGalleryId) {
    state.currentGalleryId = currentGalleryId
  },
  setGalleryInfoAgg(state, galleryInfoAgg) {
    state.galleryInfoAgg = galleryInfoAgg
  },
  setCurrentUrl(state, currentUrl) {
    state.currentUrl = currentUrl
  }
}
