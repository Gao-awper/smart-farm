// 网络请求封装：Spring Boot(8080) + Node农场服务(3000/api)
const app = getApp()

function request(base, path, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: base + path,
      method,
      data,
      timeout: 8000,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error('HTTP ' + res.statusCode))
        }
      },
      fail: reject
    })
  })
}

// Node 农场IoT服务
const farmApi = {
  overview: () => request(app.globalData.apiBase, '/farm/overview'),
  realtime: () => request(app.globalData.apiBase, '/farm/realtime'),
  crops: () => request(app.globalData.apiBase, '/crops'),
  devices: () => request(app.globalData.apiBase, '/devices'),
  irrigation: () => request(app.globalData.apiBase, '/farm/irrigation')
}

// Spring Boot 业务服务
const springApi = {
  notices: () => request(app.globalData.baseUrl, '/api/notices'),
  activities: () => request(app.globalData.baseUrl, '/api/activities')
}

module.exports = { farmApi, springApi }
