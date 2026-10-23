const app = getApp()

Page({
  data: {
    userInfo: {
      name: '智慧农场管理员',
      role: '高级管理员'
    }
  },

  onShow() {
    // 优先显示本地缓存的用户信息（后续接入登录后由登录页写入）
    try {
      const cached = wx.getStorageSync('userInfo')
      if (cached && cached.name) {
        this.setData({ userInfo: cached })
      }
    } catch (e) {
      // 读取缓存失败则保持默认
    }
  },

  editProfile() {
    wx.showToast({ title: '编辑资料', icon: 'none' })
  },

  navigateTo(e) {
    const page = e.currentTarget.dataset.page
    wx.showToast({ title: '进入' + page + '页面', icon: 'none' })
  },

  exportData() {
    wx.showLoading({ title: '正在导出数据...' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '导出成功', icon: 'success' })
    }, 1500)
  },

  shareApp() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.showToast({ title: '请点击右上角分享', icon: 'none' })
  },

  feedback() {
    wx.showToast({ title: '意见反馈', icon: 'none' })
  },

  about() {
    wx.showModal({
      title: '关于我们',
      content: '智慧农场管理系统 v2.0.0\n\n致力于为农场提供智能化管理解决方案',
      showCancel: false
    })
  },

  changePassword() {
    wx.showToast({ title: '修改密码', icon: 'none' })
  },

  bindingPhone() {
    wx.showToast({ title: '绑定手机', icon: 'none' })
  },

  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('userInfo')
          } catch (e) { /* 忽略 */ }
          app.globalData.userInfo = null
          wx.showToast({ title: '已退出', icon: 'success' })
        }
      }
    })
  }
})
