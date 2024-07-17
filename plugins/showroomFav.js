function ShowRoomFav() {}

// const setUrlParam = (url, arg, argVal) => {
//   const evil = function(fn) {
//     const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
//     return new Fn('return ' + fn)()
//   }
//   const pattern = arg + '=([^&]*)'
//   const replaceText = arg + '=' + argVal
//   if (url.match(pattern)) {
//     let tmp = '/(' + arg + '=)([^&]*)/gi'
//     tmp = url.replace(evil(tmp), replaceText)
//     return tmp
//   } else {
//     const baseUrl = url.split('#')
//     if (url.match('[?]')) {
//       url = baseUrl[0] + '&' + replaceText
//     } else {
//       url = baseUrl[0] + '?' + replaceText
//     }
//     return url + (baseUrl[1] ? baseUrl[1] : '')
//   }
// }

/**
 * showroom中添加商品
 * showroom_id		-1：全部showroom 其它：指定的showroom
goods_id	
color_id		
goods_size		 这个字段也是没有在使用，默认都是0
from_guide		是否是首次创建时跟着指引添加的商品 0:不是 1:是   实际后端没有再用此字段
source_tag 操作来源标签
 */
ShowRoomFav.prototype.addFav2ShowRoom = function(showRoomId, goodsId, colorId, goodsSize, fromGuide, sourceTag, isStorefront, sucFunc) {
  const param = {
    showroom_id: showRoomId,
    goods_id: goodsId,
    color_id: colorId,
    goods_size: goodsSize,
    source_tag: sourceTag,
    is_storefront: isStorefront // 是否门店收藏
    // from_guide: fromGuide
  }
  window.$nuxt.$axios.$post('/1.0/showroom/favorites', param).then((response) => {
    if (response.code == 0) {
      sessionStorage.removeItem('fav_goods_id')
      sessionStorage.removeItem('fav_colorKey')
      sessionStorage.removeItem('fav_goods_size')
      sucFunc(response.data.favList || [])
    } else {
      alert(response.msg)
    }
  })
}

/**
 *showroom中删除商品
 * showroom_id		-1：全部showroom 其它：指定的showroom
 * favorite_id		
goods_id		
color_id		
goods_size		 这个字段也是没有在使用，默认都是0
 */
ShowRoomFav.prototype.delFavFromShowRoom = function(
  showRoomId,
  favoriteId,
  goodsId,
  colorId,
  goodsSize,
  isStorefront,
  sucFunc,
  isConfirm,
  that
) {
  if (isConfirm && !window.confirm(that.nl('page_common_remove_favorites_confirm_tip'))) {
    return false
  }
  const param = {
    showroom_id: showRoomId,
    favorite_id: favoriteId,
    goods_id: goodsId,
    color_id: colorId,
    goods_size: goodsSize,
    is_storefront: isStorefront // 是否门店收藏
  }
  window.$nuxt.$axios.$delete('/1.0/showroom/favorites', { params: param }).then((response) => {
    if (response.code == 0) {
      sucFunc(response.data.favList || [])
    } else {
      alert(response.msg)
    }
  })
}

/**
 *修改showroom中商品颜色
 */
ShowRoomFav.prototype.changeColorFavFromShowRoom = function(
  showRoomId,
  favoriteId,
  goodsId,
  colorId,
  colorName,
  page,
  limit,
  sodGalleryVersion = 'a',
  sucFunc
) {
  const param = {
    showroom_id: showRoomId,
    favorite_id: favoriteId,
    goods_id: goodsId,
    color_id: colorId,
    color_name: colorName,
    sodGalleryVersion,
    page,
    limit
  }
  window.$nuxt.$axios.$put('/1.0/showroom/favorites', param).then((response) => {
    if (response.code == 0) {
      sucFunc(response.data)
    } else {
      alert(response.msg)
    }
  })
}

export default new ShowRoomFav()
