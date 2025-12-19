// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化网络请求
    this.globalData = {
      apiBaseUrl: 'http://localhost:3000/api',
      userInfo: null
    }
  },
  
  globalData: {
    apiBaseUrl: 'http://localhost:3000/api',
    userInfo: null
  }
})