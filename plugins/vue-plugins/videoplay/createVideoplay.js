import { isElementInViewport } from '@/assets/js/utils'

/**
 * 创建自定义指令：v-videoplay
 * 修饰符：hoverHide，鼠标浮动后隐藏视频
 * 商品列表中的商品带有视频时，进入页面可视区域后，自动播放，离开可视区域后，停止播放
 * 保证列表中正在播放的视频资源有且仅有一个
 * 注意：此指令只需要绑定在页面中的一个div上，并绑定数据就可以，指令会在绑定元素后判断数据中是否有视频信息，并自行创建video元素
 */
const createVideoplay = () => {
  let playing = '' // 正在播放的video，存放video代表的商品id
  let timeVidoeplay // 定时器
  let playingList = [] // 所有包含视频的元素队列，用于保存视频在页面中出现的顺序
  // const VIDEO_PLAY_PLAYINGLIST = 'VIDEO_PLAY_PLAYINGLIST' // playingList缓存标识
  // const PRODUCTS_VIEW_SWITCH_CHANGE = 'PRODUCTS_VIEW_SWITCH_CHANGE' // 页面视图显示模式缓存

  /**
   * 凡是进入页面可见区域的元素，推入统一管理序列playingList
   * 判断是否已有同样的数据，如果没有，推入
   * 每一项的序号就是元素在页面中出现的顺序
   */
  function setPlayingList(el, onlyId) {
    let hasOnlyId = false
    for (let i = 0; i < playingList.length; i++) {
      const ele = playingList[i]
      if (ele.id === onlyId) {
        hasOnlyId = true
        break
      }
    }
    if (!hasOnlyId) {
      playingList.push({
        id: onlyId,
        isView: false // 元素是否在视图可视区域内，默认false
      })
      playing = playingList[0].id
    }

    // 默认第一页的初始可视区域内可能会有商品，这时，应该将对应的商品数据设为isView:true
    let tempTimeCount = 0
    const tempTime = setInterval(() => {
      tempTimeCount++
      if (isElementInViewport(el)) {
        for (let i = 0; i < playingList.length; i++) {
          if (playingList[i].id === onlyId) {
            playingList[i].isView = true
            clearInterval(tempTime)
          }
        }
      }
      if (tempTimeCount >= 50) {
        clearInterval(tempTime)
      }
    }, 1)

    // 将playingList缓存到本地
    // sessionStorage.setItem(VIDEO_PLAY_PLAYINGLIST, JSON.stringify(playingList))
  }
  /**
   * 处理视频播放和同级别其他元素隐藏
   * @param {*} el 指令绑定元素
   * @param {*} videoBox 视频容器元素
   * @param {*} videoDom 视频元素
   */
  function handlePlayAndView(el, videoBox, videoDom, isShow) {
    videoDom.muted = true
    const promise = videoDom.play()
    if (promise) {
      // Chrome视频自动播放会报错，并且不能有效自动播放，这里判断，一旦出错，设置静音，再次执行play
      promise
        .then(() => {})
        .catch((e) => {
          videoDom.muted = true
          videoDom
            .play()
            .then(() => {})
            .catch((error) => {
              console.log(error)
              videoDom.muted = true
            })
        })
    }
    // 处在页面可视区域中的绑定元素，子元素内的非视频元素隐藏
    el.childNodes.forEach((ele) => {
      if (ele.nodeName != 'DIV') {
        ele.style.display = isShow ? 'block' : 'none'
      }
    })
    videoBox.style.display = 'block'
  }
  /**
   * 页面中暂停的视频元素，同级别的其他元素显示
   * @param {*} el 指令绑定元素
   * @param {*} videoBox 视频容器元素
   * @param {*} videoDom 视频元素
   */
  function handlePauseAndView(el, videoBox, videoDom, isHide) {
    videoDom.pause()
    videoDom.currentTime = 0 // 返回初始位置
    // 处在页面可视区域中的绑定元素，子元素内的非视频元素显示
    el.childNodes.forEach((ele) => {
      if (ele.nodeName != 'DIV') {
        ele.style.display = isHide ? 'none' : 'block'
      }
    })
    videoBox.style.display = 'none'
  }
  /**
   * 设置playingList中的数据的状态
   * 进入可视区域，设置对应项的isView为true，否则false
   * @param state 状态 true false
   */
  function setPlayingListIsView(onlyId, state) {
    for (let i = 0; i < playingList.length; i++) {
      if (playingList[i].id === onlyId) {
        playingList[i].isView = state
        break
      }
    }
  }
  function updatePlaying() {
    let tempPlaying = ''
    // 遍历playingList，查询第一个isView为true的数据
    for (let i = 0; i < playingList.length; i++) {
      if (playingList[i].isView) {
        tempPlaying = playingList[i].id // 更新playing
        break
      }
    }
    // 当没有符合播放条件的数据时，playing会被置为空
    playing = tempPlaying
  }

  function updatePlayAndPause(el, videoBox, videoDom, onlyId) {
    updatePlaying()
    if (playing && playing === onlyId) {
      // 播放
      handlePlayAndView(el, videoBox, videoDom)
    } else {
      // 暂停
      handlePauseAndView(el, videoBox, videoDom)
    }
  }

  // 判断当前设备是否是移动设备，如果是移动设备，监听触屏操作
  let isTouched = false // 标识，是否已经有了触屏操作
  if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|ipad)/i)) {
    // 监听触屏操作，只有有操作之后，视频才能播放
    let touchCount = 1
    document.addEventListener('touchstart', (e) => {
      e.stopPropagation()
      // 设置touchCount标识，避免触屏后，多次执行handlePlay
      if (touchCount === 1) {
        isTouched = true
        ++touchCount
      }
    })
  } else {
    // pc设备，直接置为true
    isTouched = true
  }
  let intersect
  function handleFun(el, binding) {
    // 获取指令绑定的数据
    const { value, modifiers } = binding
    // 判断数据中是否有视频相关的数据
    if (value && value.url) {
      // 将页面中的视频数据推入playingList
      const onlyId = value.goodsId + value.goodsSn
      // 如果视频信息数据，判断子元素中是否有video元素，如果没有，创建video子元素
      let videoDom = ''
      let videoBox = '' // 包裹video的元素
      el.childNodes.forEach((ele) => {
        if (ele.nodeName === 'DIV') {
          videoBox = ele
          ele.childNodes.forEach((i) => {
            if (i.nodeName === 'VIDEO') {
              videoDom = ele
            }
          })
        }
      })
      if (!videoDom) {
        // 创建video元素
        videoDom = document.createElement('VIDEO')
        videoBox = document.createElement('div')
        // 设置video的属性
        videoDom.setAttribute('poster', value.thumbnail) // 视频默认图
        videoDom.setAttribute('muted', true) // 静音
        videoDom.setAttribute('autoplay', 'autoplay') // 循环播放
        videoDom.setAttribute('loop', 'loop') // 循环播放
        videoDom.setAttribute('width', '100%') // 宽度
        videoDom.setAttribute('height', '100%') // 高度
        // 设置以下几个属性，避免ios上视频默认全屏播放问题
        videoDom.setAttribute('webkit-playsinline', true)
        videoDom.setAttribute('x5-playsinline', true)
        videoDom.setAttribute('playsinline', true)
        // 将video元素插入到el绑定的元素中
        videoBox.appendChild(videoDom)
        el.appendChild(videoBox)
      }

      setPlayingList(el, onlyId)

      // 判断是否有鼠标移入隐藏操作
      if (modifiers.hoverHide) {
        // 如果存在hoverHide修饰符，给el元素添加鼠标移入监听，隐藏当前元素
        // 设置透明度，不能设置display，否则就会触发mouseout
        el.addEventListener('mouseenter', (e) => {
          e.stopPropagation()
          videoBox.style.display = 'none'
          el.childNodes.forEach((ele) => {
            if (ele.nodeName != 'DIV') {
              ele.style.display = 'none'
            }
          })
        })
        // 鼠标移出，显示元素
        el.addEventListener('mouseleave', (e) => {
          e.stopPropagation()
          videoBox.style.display = 'block'
        })
      }

      if (isTouched) {
        // videoDom.play()
        // videoDom.pause()
      }
      // 观察元素是否可见
      // IntersectionObserver API 可参考文档：https://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html
      intersect = new IntersectionObserver((e) => {
        e.forEach((item) => {
          if (item.intersectionRatio > 0) {
            // 进入可视区域
            // console.log('移入')
            // 处在可视区域内才加载视频资源，如果当前video没有视频源，添加视频源路径
            if (!videoDom.src) {
              videoDom.setAttribute('src', value.url) // 视频路径
            }
            // 如果用户已经有了触发操作，播放符合条件的视频
            setPlayingListIsView(onlyId, true)
            updatePlayAndPause(el, videoBox, videoDom, onlyId)
          } else {
            // 移出可视区域
            // console.log('移出')
            setPlayingListIsView(onlyId, false)
            updatePlayAndPause(el, videoBox, videoDom, onlyId)
          }
        })
        // console.log(playingList)
        // console.log(playing)
      })
      intersect.observe(el)
      // 设置定时器
      // IntersectionObserver可以观察元素移入移出，但是当B元素在视图内，A元素移出时，B元素并没有触发移入移出操作，
      // 所以，这时，无法对B元素进行控制，因此，设置定时器，监听数据变化
      timeVidoeplay = setInterval(() => {
        if (playing === onlyId) {
          if (videoDom.paused) {
            handlePlayAndView(el, videoBox, videoDom)
          }
        } else {
          handlePauseAndView(el, videoBox, videoDom)
        }
      }, 50)
    } else {
      console.log('No video information')
    }
  }

  /**
   * url改变后，处理playingList
   */
  function hashChangeFire() {
    playingList = []
    // console.log('url改变了')
  }

  /**
   * 根据本地url缓存，判断url是否改变
   * 根据location.pathname进行判断
   */
  function isHashChanged() {
    const tempUrl = sessionStorage.getItem('TEMP_URL_LISTEN')
    const currentUrl = window.location.pathname
    if (tempUrl) {
      if (tempUrl != currentUrl) {
        // 更新缓存
        sessionStorage.setItem('TEMP_URL_LISTEN', window.location.pathname)
        return true
      }
    } else {
      sessionStorage.setItem('TEMP_URL_LISTEN', window.location.pathname)
    }
    return false
  }

  let urlTime
  return {
    bind(el, binding) {
      // 每次绑定先更新本地缓存标识，保证缓存标识为最新
      isHashChanged()
      // TODO：监听url改变，如果改变，清空playingList
      // if ('onhashchange' in window && (typeof document.documentMode === 'undefined' || document.documentMode == 8)) {
      //   // 浏览器支持onhashchange事件
      //   window.onhashchange = hashChangeFire // TODO，对应新的hash执行的操作函数
      // } else {
      //   // 不支持则用定时器检测的办法
      // }
      // 用定时器监听url修改
      urlTime = setInterval(() => {
        const ischanged = isHashChanged() // TODO，检测hash值或其中某一段是否更改的函数
        if (ischanged) {
          hashChangeFire() // TODO，对应新的hash执行的操作函数
          clearInterval(urlTime)
        }
      }, 100)
      handleFun(el, binding)
    },
    unbind() {
      // 清除定时器
      if (timeVidoeplay) {
        clearInterval(timeVidoeplay)
      }
      if (urlTime) {
        clearInterval(urlTime)
      }
      playing = ''
      // playingList = []

      // 解绑的时候判断是否有缓存的视图模式
      // const viewSwitch = sessionStorage.getItem(PRODUCTS_VIEW_SWITCH_CHANGE)
      // // 如果有缓存，说明进行了视图切换操作
      // if (viewSwitch) {
      //   sessionStorage.removeItem(VIDEO_PLAY_PLAYINGLIST)
      // }
    }
  }
}

export default createVideoplay
