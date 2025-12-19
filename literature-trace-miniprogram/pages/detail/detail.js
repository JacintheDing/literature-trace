// detail.js
const app = getApp()

Page({
  data: {
    id: '',
    paper: {},
    loading: true,
    error: ''
  },

  onLoad(options) {
    // 获取传递过来的文献ID
    const id = options.id
    this.setData({
      id: id
    })
    
    // 加载文献详情
    this.loadPaperDetail()
  },

  // 加载文献详情
  loadPaperDetail() {
    const { id } = this.data
    
    this.setData({
      loading: true,
      error: ''
    })
    
    wx.request({
      url: `${app.globalData.apiBaseUrl}/papers/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            paper: res.data.data,
            loading: false
          })
        } else {
          this.setData({
            error: '加载失败，请稍后重试',
            loading: false
          })
        }
      },
      fail: (err) => {
        console.error('Load paper detail failed:', err)
        this.setData({
          error: '网络错误，请检查网络连接',
          loading: false
        })
      }
    })
  },

  // 打开全文链接
  openFullText() {
    const { paper } = this.data
    
    if (paper.fullTextUrl) {
      wx.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(paper.fullTextUrl)}`
      })
    }
  },

  // 格式化日期
  formatDate(dateString) {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
})