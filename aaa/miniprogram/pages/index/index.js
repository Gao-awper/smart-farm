const app = getApp()
const { farmApi } = require('../../utils/api')

Page({
  data: {
    headerStats: {
      devices: 12,
      normalRate: 85,
      waterUsage: 120
    },
    sensorData: {
      airTempDisplay: '25.0',
      soilMoistureDisplay: '65.0',
      lightDisplay: '80'
    },
    irrigationStatus: {
      status: '待机',
      lastIrrigation: '—',
      todayWaterUsage: 0
    }
  },

  onLoad() {
    this.socketTask = app.createSocket({
      initData: (data) => {
        if (data.sensorData) this.applySensorData(data.sensorData)
        if (data.irrigationStatus) this.setData({ irrigationStatus: data.irrigationStatus })
      },
      sensorDataUpdate: (data) => this.applySensorData(data),
      irrigationStatusUpdate: (data) => this.setData({ irrigationStatus: data })
    })

    this.loadOverview()
  },

  onUnload() {
    if (this.socketTask) this.socketTask.close()
  },

  applySensorData(d) {
    this.setData({
      sensorData: {
        airTempDisplay: Number(d.airTemperature).toFixed(1),
        soilMoistureDisplay: Number(d.soilMoisture).toFixed(1),
        lightDisplay: String(Math.round(d.lightIntensity / 1000))
      }
    })
  },

  loadOverview() {
    farmApi.overview().then((res) => {
      const data = res.data || res
      if (data && data.totalDevices) {
        const online = data.onlineDevices != null ? data.onlineDevices : data.totalDevices
        this.setData({
          headerStats: {
            devices: data.totalDevices,
            normalRate: Math.round((online / data.totalDevices) * 100),
            waterUsage: data.todayWaterUsage != null ? data.todayWaterUsage : this.data.headerStats.waterUsage
          }
        })
      }
    }).catch(() => {
      console.log('农场概览接口不可用，使用默认数据')
    })
  },

  goToMonitoring() {
    wx.switchTab({ url: '/pages/monitoring/monitoring' })
  },

  goToIrrigation() {
    wx.switchTab({ url: '/pages/irrigation/irrigation' })
  },

  goToDevices() {
    wx.switchTab({ url: '/pages/devices/devices' })
  },

  scanDevice() {
    wx.scanCode({
      success: () => {
        wx.showToast({ title: '绑定成功', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '扫码失败', icon: 'none' })
      }
    })
  }
})
