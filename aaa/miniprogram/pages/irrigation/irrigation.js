const app = getApp()

Page({
  data: {
    isConnected: false,
    irrigationStatus: {
      status: '待机',
      lastIrrigation: '—',
      nextIrrigation: '—',
      todayWaterUsage: 0,
      manualMode: false
    },
    irrigationSchedule: [
      { time: '08:00', duration: 30, area: '东区' },
      { time: '18:00', duration: 45, area: '西区' },
      { time: '22:00', duration: 20, area: '南区' }
    ],
    irrigationZones: [
      { id: 1, name: '东区', area: 25, crop: '小麦', moisture: 65, status: '正常', controlStatus: '关闭' },
      { id: 2, name: '西区', area: 30, crop: '玉米', moisture: 55, status: '警告', controlStatus: '关闭' },
      { id: 3, name: '南区', area: 20, crop: '蔬菜', moisture: 70, status: '正常', controlStatus: '关闭' },
      { id: 4, name: '北区', area: 25, crop: '水果', moisture: 60, status: '正常', controlStatus: '关闭' }
    ]
  },

  onLoad() {
    this.socketTask = app.createSocket({
      initData: (data) => {
        if (data.irrigationStatus) this.setData({ irrigationStatus: data.irrigationStatus })
      },
      irrigationStatusUpdate: (data) => this.setData({ irrigationStatus: data })
    })

    this.socketTask.onOpen(() => this.setData({ isConnected: true }))
    this.socketTask.onClose(() => this.setData({ isConnected: false }))
    this.socketTask.onError(() => this.setData({ isConnected: false }))
  },

  onUnload() {
    if (this.socketTask) this.socketTask.close()
  },

  sendToServer(message) {
    if (this.socketTask && this.data.isConnected) {
      this.socketTask.send({ data: JSON.stringify(message) })
      return true
    }
    wx.showToast({ title: '未连接服务器', icon: 'none' })
    return false
  },

  startIrrigation() {
    if (this.data.irrigationStatus.status === '运行中') return
    if (this.sendToServer({ action: 'controlIrrigation', command: { action: 'start' } })) {
      wx.showToast({ title: '开始灌溉', icon: 'success' })
    }
  },

  stopIrrigation() {
    if (this.data.irrigationStatus.status === '待机') return
    if (this.sendToServer({ action: 'controlIrrigation', command: { action: 'stop' } })) {
      wx.showToast({ title: '停止灌溉', icon: 'success' })
    }
  },

  toggleManualMode() {
    const manualMode = !this.data.irrigationStatus.manualMode
    this.setData({ 'irrigationStatus.manualMode': manualMode })
    this.sendToServer({ action: 'updateIrrigationStatus', data: { manualMode } })
  },

  controlZone(e) {
    const zoneId = Number(e.currentTarget.dataset.id)
    const zones = this.data.irrigationZones
    const zone = zones.find((z) => z.id === zoneId)
    if (!zone) return

    const opening = zone.controlStatus !== '开启'
    zone.controlStatus = opening ? '开启' : '关闭'
    this.setData({ irrigationZones: zones })
    wx.showToast({ title: zone.name + '已' + zone.controlStatus, icon: 'none' })

    // 同步控制命令到MQTT（区域主题 farm/irrigation/zone_{id}/control）
    this.sendToServer({
      action: 'publish',
      topic: 'farm/irrigation/zone_' + zoneId + '/control',
      payload: { action: opening ? 'start' : 'stop', zoneId }
    })
  },

  editSchedule() {
    wx.showToast({ title: '编辑计划', icon: 'none' })
  },

  addSchedule() {
    wx.showToast({ title: '添加计划', icon: 'none' })
  }
})
