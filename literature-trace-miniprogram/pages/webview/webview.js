// webview.js
Page({
  data: {
    url: ''
  },

  onLoad(options) {
    // 获取传递过来的URL
    const url = decodeURIComponent(options.url)
    this.setData({
      url: url
    })
  },

  // 网页加载完成事件
  onLoad() {
    console.log('Webview loaded successfully')
  },

  // 网页加载错误事件
  onError(e) {
    console.error('Webview load error:', e)
    wx.showToast({
      title: '网页加载失败',
      icon: 'none'
    })
  }
})