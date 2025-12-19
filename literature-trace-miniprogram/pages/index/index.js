// index.js
const app = getApp()

Page({
  data: {
    searchQuery: '',
    activeType: 'all',
    papers: [],
    loading: false,
    error: ''
  },

  onLoad() {
    // 页面加载时的初始化
  },

  // 输入框输入事件
  onInput(e) {
    this.setData({
      searchQuery: e.detail.value
    })
  },

  // 选择检索类型
  selectType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      activeType: type
    })
  },

  // 搜索文献
  search() {
    const { searchQuery, activeType } = this.data
    
    if (!searchQuery.trim()) {
      this.setData({
        error: '请输入检索词'
      })
      return
    }
    
    this.setData({
      loading: true,
      error: '',
      papers: []
    })
    
    wx.request({
      url: `${app.globalData.apiBaseUrl}/papers/search`,
      method: 'GET',
      data: {
        query: searchQuery,
        type: activeType,
        page: 1,
        limit: 10
      },
      success: (res) => {
        if (res.data.success) {
          this.setData({
            papers: res.data.data,
            loading: false
          })
        } else {
          this.setData({
            error: '检索失败，请稍后重试',
            loading: false
          })
        }
      },
      fail: (err) => {
        console.error('Search failed:', err)
        this.setData({
          error: '网络错误，请检查网络连接',
          loading: false
        })
      }
    })
  },

  // 跳转到文献详情页
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  // 格式化日期
  formatDate(dateString) {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
})