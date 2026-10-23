App({
  globalData: {
    userInfo: null,
    baseUrl: 'http://localhost:8080',      // Spring Boot 业务后端
    apiBase: 'http://localhost:3000/api',  // Node 农场IoT后端
    socketUrl: 'ws://localhost:8082'       // MQTT-WS 数据推送桥（原生WebSocket）
  },

  onLaunch() {
    console.log('智慧农场小程序启动')
  },

  // 统一创建 WebSocket 连接并按消息类型分发
  // handlers 形如 { initData: fn, sensorDataUpdate: fn, irrigationStatusUpdate: fn }
  createSocket(handlers) {
    const socketTask = wx.connectSocket({
      url: this.globalData.socketUrl,
      fail: (err) => console.error('WebSocket连接失败:', err)
    })

    socketTask.onMessage((res) => {
      try {
        const data = JSON.parse(res.data)
        if (handlers && typeof handlers[data.type] === 'function') {
          handlers[data.type](data.data)
        }
      } catch (e) {
        console.error('WebSocket消息解析失败:', e)
      }
    })

    return socketTask
  }
})
